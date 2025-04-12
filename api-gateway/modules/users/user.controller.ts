import {
  Controller,
  Logger,
  Post,
  Body,
  UseGuards,
  Get,
  Param,
  Put,
  Delete,
  Inject,
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { User } from './dto';
import { JwtAuthGuard } from '../../guards/auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { firstValueFrom } from 'rxjs';

@Controller('users')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(@Inject('USER_SERVICE') private readonly client: ClientProxy) {}

  @Post('register')
  @Public()
  async register(@Body() user: User): Promise<any> {
    this.logger.log('Registering user...');
    console.log('[GATEWAY] Sending cmd: create_user with payload:', user);

    try {
      return await firstValueFrom(
        this.client.send({ cmd: 'create_user' }, user),
      );
    } catch (err) {
      this.logger.error('❌ Error during registration:', err);

      // 💥 ВОТ СЮДА вставляй:
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      this.logger.error('📦 RPC error payload:', err.message);

      if (
        err &&
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        typeof err.message === 'object' &&
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        err.message.statusCode === 409
      ) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        throw new ConflictException(err.message.message);
      }

      throw new InternalServerErrorException(
        'Не вдалося зареєструвати користувача',
      );
    }
  }

  @Post('login')
  @Public()
  async login(
    @Body() credentials: { email: string; password: string },
  ): Promise<any> {
    console.log('[GATEWAY] Sending cmd: login_user with payload:', credentials);
    try {
      return await firstValueFrom(
        this.client.send({ cmd: 'login_user' }, credentials),
      );
    } catch (err) {
      this.logger.error('❌ Error during login:', err);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (err?.message?.statusCode === 401) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        throw new UnauthorizedException(err.message.message);
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (err?.message?.statusCode === 404) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        throw new NotFoundException(err.message.message);
      }

      throw new InternalServerErrorException('Не вдалося увійти');
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async getUsers(): Promise<any> {
    console.log('[GATEWAY] Sending cmd: get_users');
    try {
      return await firstValueFrom(this.client.send({ cmd: 'get_users' }, {}));
    } catch (err) {
      this.logger.error('❌ Error fetching users:', err);
      throw new InternalServerErrorException(
        'Не вдалося отримати список користувачів',
      );
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getUserById(@Param('id') id: string): Promise<any> {
    console.log('[GATEWAY] Sending cmd: get_user_by_id with payload:', id);
    try {
      return await firstValueFrom(
        this.client.send({ cmd: 'get_user_by_id' }, id),
      );
    } catch (err) {
      this.logger.error('❌ Error fetching user by ID:', err);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (err?.message?.statusCode === 404) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        throw new NotFoundException(err.message.message);
      }

      throw new InternalServerErrorException('Не вдалося отримати користувача');
    }
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateUser(
    @Param('id') id: string,
    @Body() userDto: User,
  ): Promise<any> {
    console.log('[GATEWAY] Sending cmd: update_user with payload:', {
      id,
      data: userDto,
    });

    try {
      return await firstValueFrom(
        this.client.send({ cmd: 'update_user' }, { id, data: userDto }),
      );
    } catch (err) {
      this.logger.error('❌ Error updating user:', err);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (err?.message?.statusCode === 404) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        throw new NotFoundException(err.message.message);
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (err?.message?.statusCode === 409) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        throw new ConflictException(err.message.message);
      }

      throw new InternalServerErrorException('Не вдалося оновити користувача');
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async deleteUser(@Param('id') id: string): Promise<any> {
    console.log('[GATEWAY] Sending cmd: delete_user with payload:', id);

    try {
      return await firstValueFrom(this.client.send({ cmd: 'delete_user' }, id));
    } catch (err) {
      this.logger.error('❌ Error deleting user:', err);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (err?.message?.statusCode === 404) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        throw new NotFoundException(err.message.message);
      }

      throw new InternalServerErrorException('Не вдалося видалити користувача');
    }
  }

  @Post('reset-password')
  @Public()
  async resetPassword(@Body('email') email: string): Promise<any> {
    console.log('[GATEWAY] Sending cmd: reset_password with payload:', email);

    try {
      return await firstValueFrom(
        this.client.send({ cmd: 'reset_password' }, { email }),
      );
    } catch (err) {
      this.logger.error('❌ Error resetting password:', err);
      throw new InternalServerErrorException('Не вдалося скинути пароль');
    }
  }
}
