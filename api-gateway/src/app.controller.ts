import { Controller, Get, Post, Body, Param, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

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
  async createUser(
    @Body() data: { name: string; email: string; password: string },
  ): Promise<UserResponse> {
    return firstValueFrom(
      this.userService.send<UserResponse>({ cmd: 'register_user' }, data),
    );
  }

  // по ID
  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<UserResponse> {
    return firstValueFrom(
      this.userService.send<UserResponse>({ cmd: 'get_user_by_id' }, id),
    );
  }

  // всіх
  @Get()
  async getUsers(): Promise<UserResponse[]> {
    return firstValueFrom(
      this.userService.send<UserResponse[]>({ cmd: 'get_users' }, {}),
    );
  }
}
