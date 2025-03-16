import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern({ cmd: 'register_user' })
  async registerUser(
    @Payload() data: { name: string; email: string; password: string },
  ) {
    return this.userService.createUser(data.name, data.email, data.password);
  }

  @MessagePattern({ cmd: 'get_users' })
  async getUsers() {
    return this.userService.getAllUsers();
  }

  // 🟢 Додаємо отримання користувача за ID
  @MessagePattern({ cmd: 'get_user_by_id' })
  async getUserById(@Payload() id: number) {
    return this.userService.getUserById(id);
  }
}
