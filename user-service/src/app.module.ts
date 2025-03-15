import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database.config';
import { UserModule } from './modules/user/user.module';
import { Transport, ClientsModule } from '@nestjs/microservices';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    UserModule,
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.BROKER_URL ?? 'amqp://localhost'],
          queue: process.env.USER_SERVICE_QUEUE ?? 'user_queue',
          queueOptions: { durable: false },
        },
      },
    ]),
  ],
})
export class AppModule {}
