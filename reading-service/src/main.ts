import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

async function bootstrap() {
  const rabbitmqUrl = process.env.RABBITMQ_URL;
  const queueName =
    process.env.READING_SERVICE_QUEUE || 'reading_progress_queue';

  if (!rabbitmqUrl) {
    throw new Error('❌ RABBITMQ_URL is not defined in .env');
  }

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [rabbitmqUrl], // <- Тепер тип string[]
        queue: queueName,
        queueOptions: { durable: false },
      },
    },
  );

  await app.listen();
  console.log(`Reading Service is running on queue "${queueName}"`);
}

void bootstrap();
