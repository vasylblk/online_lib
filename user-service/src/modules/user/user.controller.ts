import { Controller, Logger } from '@nestjs/common';
import {
  MessagePattern,
  Payload,
  Ctx,
  RmqContext,
} from '@nestjs/microservices';
import { UserService } from './user.service';
import { ConsumeMessage, Channel } from 'amqplib';

@Controller()
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {}

  @MessagePattern({ cmd: 'create_user' })
  async registerUser(
    @Payload() data: { name: string; email: string; password: string },
  ) {
    this.logger.log('📩 Received create_user:', data);
    try {
      return await this.userService.createUser(data);
    } catch (error) {
      this.logger.error('❌ Error creating user:', error);
      throw error; // обов’язково пробросити RpcException назад
    }
  }

  @MessagePattern({ cmd: 'login_user' })
  async login(@Payload() credentials: { email: string; password: string }) {
    this.logger.log(`📩 Received login_user: ${JSON.stringify(credentials)}`);
    return this.userService.login(credentials.email, credentials.password);
  }

  @MessagePattern({ cmd: 'get_users' })
  async getUsers() {
    this.logger.log('📩 Received get_users');
    return this.userService.getAllUsers();
  }

  @MessagePattern({ cmd: 'get_user_by_id' })
  async getUserById(@Payload() id: string) {
    this.logger.log('📩 Received get_user_by_id:', id);
    return this.userService.getUserById(id);
  }

  @MessagePattern({ cmd: 'update_user' })
  async updateUser(
    @Payload()
    payload: {
      id: string;
      data: { name: string; email: string; password: string };
    },
  ) {
    this.logger.log('📩 Received update_user:', payload);
    this.logger.log('payload =', JSON.stringify(payload));
    this.logger.log('payload.data =', JSON.stringify(payload.data));

    return this.userService.updateUser(payload.id, payload.data);
  }

  @MessagePattern({ cmd: 'delete_user' })
  async deleteUser(@Payload() id: string) {
    this.logger.log('📩 Received delete_user:', id);
    return this.userService.deleteUser(id);
  }

  @MessagePattern({ cmd: 'reset_password' })
  async resetPassword(
    @Payload() data: { email: string },
  ): Promise<{ message: string }> {
    this.logger.log('📩 Received reset_password:', data);
    return this.userService.resetPassword(data.email);
  }

  @MessagePattern({ cmd: 'find_user_by_email' })
  async findUserByEmail(@Payload() email: string) {
    this.logger.log('📩 Received find_user_by_email:', email);
    return this.userService.findUserByEmail(email);
  }

  // 🛑 Обробник на випадок невідомих команд (резервний)
  @MessagePattern()
  async handleUnknown(
    @Payload() payload: Record<string, unknown>,
    @Ctx() context: RmqContext,
  ): Promise<{ error: string }> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const channel: Channel = context.getChannelRef();
    const message = context.getMessage() as ConsumeMessage;

    this.logger.error('❌ Received unknown or unmatched message:', payload);

    await Promise.resolve(); // ESLint "require-await" satisfied

    channel.ack(message); // ✅ тепер усе типізовано

    return { error: 'No matching handler in user-service.' };
  }
}
