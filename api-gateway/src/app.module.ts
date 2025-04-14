import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from '../modules/users/user.controller';
import { BookController } from '../modules/books/book.controller';
import { UserService } from '../modules/users/user.service';
import { BookService } from '../modules/books/book.service';
import { BookModule } from '../modules/books/book.module';
import { UserModule } from '../modules/users/user.module';
import { ReadingModule } from '../modules/reading/reading.module';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [
    ReadingModule,
    BookModule,
    UserModule,
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
          queue: process.env.USER_SERVICE_QUEUE || 'user_service_queue',
          queueOptions: { durable: false },
        },
      },
      {
        name: 'AUTH_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
          queue: process.env.AUTH_SERVICE_QUEUE || 'auth_service_queue',
          queueOptions: { durable: false },
        },
      },
      {
        name: 'BOOK_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
          queue: process.env.BOOK_SERVICE_QUEUE || 'books_queue',
          queueOptions: { durable: false },
        },
      },
      {
        name: 'READING_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
          queue: process.env.READING_SERVICE_QUEUE || 'reading_progress_queue',
          queueOptions: { durable: false },
        },
      },

    ]),
  ],
  controllers: [AppController, UserController, BookController],
  providers: [
    AppService,
    UserService,
    BookService,
  ],
})
export class AppModule {}
