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
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator'; // 👈 Додано
import { firstValueFrom } from 'rxjs';

@Controller('users')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(@Inject('USER_SERVICE') private readonly client: ClientProxy) {}

  // 🔓 Відкрита — Реєстрація користувача
  @Post('register')
  @Public()
  async register(@Body() user: User): Promise<any> {
    this.logger.log('Registering user...');
    console.log('[GATEWAY] Sending cmd: create_user with payload:', user);
    return await firstValueFrom(this.client.send({ cmd: 'create_user' }, user));
  }

  // 🔓 Відкрита — Логін користувача
  @Post('login')
  @Public()
  async login(
    @Body() credentials: { email: string; password: string },
  ): Promise<any> {
    console.log('[GATEWAY] Sending cmd: login_user with payload:', credentials);
    return await firstValueFrom(
      this.client.send({ cmd: 'login_user' }, credentials),
    );
  }

  // 🔐 Тільки для адміністраторів — Отримати всіх користувачів
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async getUsers(): Promise<any> {
    console.log('[GATEWAY] Sending cmd: get_users');
    return await firstValueFrom(this.client.send({ cmd: 'get_users' }, {}));
  }

  // 🔐 Авторизований — Отримати користувача за ID
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getUserById(@Param('id') id: string): Promise<any> {
    console.log('[GATEWAY] Sending cmd: get_user_by_id with payload:', id);
    return await firstValueFrom(
      this.client.send({ cmd: 'get_user_by_id' }, id),
    );
  }

  // 🔐 Авторизований — Оновити користувача
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateUser(
    @Param('id') id: string,
    @Body() userDto: User,
  ): Promise<any> {
    console.log('[GATEWAY] Sending cmd: update_user with payload:', {
      id,
      data: userDto, // ✅ тут має бути "data", не "dto"
    });
    return await firstValueFrom(
      this.client.send({ cmd: 'update_user' }, { id, data: userDto }),
    );
  }

  // 🔐 Тільки для адміністраторів — Видалити користувача
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async deleteUser(@Param('id') id: string): Promise<any> {
    console.log('[GATEWAY] Sending cmd: delete_user with payload:', id);
    return await firstValueFrom(this.client.send({ cmd: 'delete_user' }, id));
  }

  // 🔓 Відкрита — Скидання паролю без токена
  @Post('reset-password')
  @Public()
  async resetPassword(@Body('email') email: string): Promise<any> {
    console.log('[GATEWAY] Sending cmd: reset_password with payload:', email);
    return await firstValueFrom(
      this.client.send({ cmd: 'reset_password' }, { email }),
    );
  }
}
