import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern({ cmd: 'create_user' }) // 🔥 саме create_user
  async registerUser(
    @Payload() data: { name: string; email: string; password: string },
  ) {
    console.log('[UserService] Received create_user with payload:', data);
    return this.userService.createUser(data);
  }

  @MessagePattern({ cmd: 'login_user' })
  async login(@Payload() credentials: { email: string; password: string }) {
    return this.userService.login(credentials.email, credentials.password);
  }

  @MessagePattern({ cmd: 'update_user' })
  async updateUser(
    @Payload()
    {
      id,
      data,
    }: {
      id: string;
      data: { name: string; email: string; password: string };
    },
  ) {
    return this.userService.updateUser(id, data);
  }

  @MessagePattern({ cmd: 'get_users' })
  async getUsers() {
    return this.userService.getAllUsers();
  }

  @MessagePattern({ cmd: 'get_user_by_id' })
  async getUserById(@Payload() id: string) {
    return this.userService.getUserById(id);
  }

  @MessagePattern({ cmd: 'delete_user' })
  async deleteUser(@Payload() id: string) {
    return this.userService.deleteUser(id);
  }

  @MessagePattern({ cmd: 'find_user_by_email' })
  async findUserByEmail(@Payload() email: string) {
    return this.userService.findUserByEmail(email);
  }
}
