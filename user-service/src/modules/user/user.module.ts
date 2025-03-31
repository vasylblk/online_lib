import { Module } from '@nestjs/common';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from '../../entities/user.entity'; // Імпортуємо User Entity
import { AuthModule } from '../auth/auth.module'; // Імпортуємо AuthModule для AUTH_SERVICE
import { Role } from '../../entities/role.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role]), // Реєструємо UserRepository
    AuthModule, // Імпортуємо AuthModule для отримання AUTH_SERVICE
  ],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: 'USER_SERVICE',
      useFactory: () => {
        const rabbitMqUrl = process.env.RABBITMQ_URL;
        const queueName = process.env.USER_SERVICE_QUEUE;

        if (!rabbitMqUrl || !queueName) {
          throw new Error(
            'RABBITMQ_URL або USER_SERVICE_QUEUE не заданы в .env файле',
          );
        }


        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [rabbitMqUrl],
            queue: queueName,
            queueOptions: { durable: true },
          },
        });
      },
    },
  ],
})
export class UserModule {}
