import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

async function bootstrap() {
  const rabbitMqUrl = process.env.RABBITMQ_URL;
  const queueName = process.env.BOOK_SERVICE_QUEUE;

  if (!rabbitMqUrl || !queueName) {
    console.error('❌ RABBITMQ_URL або BOOK_SERVICE_QUEUE не задані');
    process.exit(1);
  }

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [rabbitMqUrl],
        queue: queueName,
        queueOptions: { durable: false },
      },
    },
  );

  console.log(`📡 Book Service listening on queue "${queueName}"`);
  await app.listen();
}

void bootstrap();
