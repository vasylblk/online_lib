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
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { User } from './dto';
import { JwtAuthGuard } from '../../guards/auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator'; // 🆕
import { firstValueFrom } from 'rxjs';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard) // ✅ Глобальний захист токеном + ролями
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(@Inject('USER_SERVICE') private readonly client: ClientProxy) {}

  // ❗ Відкрита (без токена)
  @Post('register')
  async register(@Body() user: User): Promise<any> {
    this.logger.log('Registering user...');
    return await firstValueFrom(this.client.send({ cmd: 'create_user' }, user));
  }

  // ❗ Відкрита (без токена)
  @Post('login')
  async login(
    @Body() credentials: { email: string; password: string },
  ): Promise<any> {
    return await firstValueFrom(
      this.client.send({ cmd: 'login_user' }, credentials),
    );
  }

  // 🔐 Тільки для адміністраторів
  @Get()
  @Roles('admin')
  async getUsers(): Promise<any> {
    return await firstValueFrom(this.client.send({ cmd: 'get_users' }, {}));
  }

  // 🔐 Авторизований (будь-який)
  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<any> {
    return await firstValueFrom(
      this.client.send({ cmd: 'get_user_by_id' }, id),
    );
  }

  // 🔐 Авторизований (будь-який)
  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() userDto: User,
  ): Promise<any> {
    return await firstValueFrom(
      this.client.send({ cmd: 'update_user' }, { id, dto: userDto }),
    );
  }

  // 🔐 Тільки для адміністраторів
  @Delete(':id')
  @Roles('admin')
  async deleteUser(@Param('id') id: string): Promise<any> {
    return await firstValueFrom(this.client.send({ cmd: 'delete_user' }, id));
  }

  // ❗ Відкрита (скидання паролю без токена)
  @Post('reset-password')
  async resetPassword(@Body('email') email: string): Promise<any> {
    return await firstValueFrom(
      this.client.send({ cmd: 'reset_password' }, { email }),
    );
  }
}
