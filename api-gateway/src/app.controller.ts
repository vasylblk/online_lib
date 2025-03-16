import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller('users')
export class AppController {
  private client: ClientProxy;

  constructor() {
    this.client = ClientProxyFactory.create({
      transport: Transport.RMQ, // або інший транспорт
      options: {
        urls: ['amqp://localhost:5672'], // Зміни URL, якщо потрібно
        queue: 'user_queue',
        queueOptions: { durable: false },
      },
    });
  }

  @Post()
  async createUser(
    @Body() data: { name: string; email: string; password: string },
  ) {
    return firstValueFrom(
      this.client.send<{ id: number; name: string; email: string }>(
        { cmd: 'register_user' },
        data,
      ),
    );
  }

  @Get(':id')
  async getUserById(@Param('id') id: number) {
    return firstValueFrom(
      this.client.send<{ id: number; name: string; email: string }>(
        { cmd: 'get_user_by_id' },
        Number(id),
      ),
    );
  }
}
