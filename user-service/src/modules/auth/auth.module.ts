import { Module } from '@nestjs/common';
import {
  ClientProxyFactory,
  Transport,
  ClientProxy,
  ClientOptions, // <- обов’язково цей тип
} from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [
    AuthService,
    JwtService,
    {
      provide: 'AUTH_SERVICE',
      useFactory: (): ClientProxy => {
        if (!process.env.RABBITMQ_URL || !process.env.AUTH_SERVICE_QUEUE) {
          throw new Error('RABBITMQ_URL або AUTH_SERVICE_QUEUE не задані');
        }

        const options: ClientOptions = {
          transport: Transport.RMQ,
          options: {
            urls: [process.env.RABBITMQ_URL],
            queue: process.env.AUTH_SERVICE_QUEUE,
            queueOptions: {
              durable: true,
            },
            noAck: false,
          },
        };

        return ClientProxyFactory.create(options);
      },
    },
  ],
  exports: [
    AuthService,
    'AUTH_SERVICE', // <-- додай цей рядок
  ],
})
export class AuthModule {}
