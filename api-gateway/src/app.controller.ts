import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Inject,
  Put,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { Public } from '../common/decorators/public.decorator'; // ✅ Додано

interface UserResponse {
  id: string;
  name: string;
  email: string;
}

@Controller('users')
export class AppController {
  constructor(
    @Inject('USER_SERVICE') private readonly userService: ClientProxy,
  ) {}

  @Post('register')
  @Public() // ✅ Відкрита реєстрація
  async createUser(
    @Body() data: { name: string; email: string; password: string },
  ): Promise<UserResponse> {
    return firstValueFrom(
      this.userService.send<UserResponse>({ cmd: 'create_user' }, data),
    );
  }

  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() data: { name: string; email: string; password: string },
  ): Promise<UserResponse> {
    return firstValueFrom(
      this.userService.send<UserResponse>({ cmd: 'update_user' }, { id, data }),
    );
  }

  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<UserResponse> {
    return firstValueFrom(
      this.userService.send<UserResponse>({ cmd: 'get_user_by_id' }, id),
    );
  }

  @Get()
  async getUsers(): Promise<UserResponse[]> {
    return firstValueFrom(
      this.userService.send<UserResponse[]>({ cmd: 'get_users' }, {}),
    );
  }

  @Post('login')
  @Public() // ✅ Відкритий логін
  async login(@Body() credentials: { email: string; password: string }) {
    console.log('[GATEWAY] Sending cmd: login_user with payload:', credentials);
    return firstValueFrom(
      this.userService.send({ cmd: 'login_user' }, credentials),
    );
  }
}
