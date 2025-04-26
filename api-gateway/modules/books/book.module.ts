import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { BookController } from './book.controller';
import { BookService } from './book.service';

@Module({
  imports: [
    ClientsModule.register([
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
        name: 'AUTH_SERVICE', // 👈 Додай цю частину!
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
          queue: process.env.AUTH_SERVICE_QUEUE || 'user_service_queue',
          queueOptions: { durable: false },
        },
      },
    ]),
  ],
  controllers: [BookController],
  providers: [BookService],
})
export class BookModule {}
