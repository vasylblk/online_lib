import { Module } from '@nestjs/common';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [
    AuthService,
    JwtService,
    {
      provide: 'AUTH_SERVICE',
      useFactory: () => {
        return ClientProxyFactory.create({
          transport: Transport.RMQ, // Указуємо Transport, але використовуємо правильні налаштування
          options: {
            urls: [process.env.RABBITMQ_URL],
            queue: process.env.AUTH_SERVICE_QUEUE,
            queueOptions: { durable: true },
            noAck: false, // За потреби можна додати інші параметри
          },
        });
      },
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
