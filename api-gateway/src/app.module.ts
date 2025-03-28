import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from '../modules/users/user.controller';
import * as dotenv from 'dotenv';

dotenv.config(); // Завантажуємо .env

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
          queue: process.env.USER_SERVICE_QUEUE || 'users_queue',
          queueOptions: { durable: false },
        },
      },
      {
        name: 'AUTH_SERVICE', // 🔥 ось це додай
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
          queue: process.env.AUTH_SERVICE_QUEUE || 'auth_service_queue', // або назва черги для auth
          queueOptions: { durable: false },
        },
      },
    ]),
  ],
  controllers: [AppController, UserController],
  providers: [AppService],
})
export class AppModule {}
