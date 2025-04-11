import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

async function bootstrap() {
  const rabbitMqUrl: string | undefined = process.env.RABBITMQ_URL;
  const queueName: string =
    process.env.USER_SERVICE_QUEUE || 'user_service_queue';

  if (!rabbitMqUrl) {
    console.error('❌ RABBITMQ_URL is not defined in .env file');
    process.exit(1);
  }

  try {
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(
      AppModule,
      {
        transport: Transport.RMQ,
        options: {
          urls: [rabbitMqUrl],
          queue: process.env.USER_SERVICE_QUEUE,
          queueOptions: { durable: false },
        },
      },
    );

    console.log(
      `📡 Connecting to RabbitMQ at ${rabbitMqUrl} (queue: ${queueName})`,
    );
    await app.listen();
    console.log(
      `✅ User Service is listening on queue "${queueName}" via RabbitMQ`,
    );
  } catch (error) {
    console.error('❌ Error starting User Service:', error);
    process.exit(1);
  }
}

void bootstrap();
