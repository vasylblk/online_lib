import { Module } from '@nestjs/common';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
    controllers: [UserController],
    providers: [
        UserService,
        {
            provide: 'USER_SERVICE',
            useFactory: () => {
                const rabbitMqUrl = process.env.RABBITMQ_URL; // Приводим к единому названию
                const queueName = process.env.USER_SERVICE_QUEUE;

                if (!rabbitMqUrl || !queueName) {
                    throw new Error('❌ RABBITMQ_URL или USER_SERVICE_QUEUE не заданы в .env файле');
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
