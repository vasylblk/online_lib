import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ReadingController } from './reading.controller';
import { ReadingService } from './reading.service';

@Module({
    imports: [
        ClientsModule.register([
            {
                name: 'READING_SERVICE',
                transport: Transport.RMQ,
                options: {
                    urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
                    queue: process.env.READING_SERVICE_QUEUE || 'reading_progress_queue',
                    queueOptions: {
                        durable: false,
                    },
                },
            },
        ]),
    ],
    controllers: [ReadingController],
    providers: [ReadingService],
})
export class ReadingModule {}