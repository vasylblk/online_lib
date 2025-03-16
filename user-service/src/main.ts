import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

async function bootstrap() {
  console.log('Loaded RABBITMQ_URL:', process.env.RABBITMQ_URL);

  const rabbitMqUrl: string | undefined = process.env.RABBITMQ_URL;
  if (!rabbitMqUrl) {
    console.error('❌ RABBITMQ_URL is not defined in .env file');
    process.exit(1);
  }

  try {
    // Запуск HTTP API
    const app = await NestFactory.create(AppModule);
    const port = process.env.PORT || 3000;
    await app.listen(port);
    console.log(`✅ HTTP API is running on http://localhost:${port}`);

    // Запуск мікросервісу
    const microservice =
      await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
        transport: Transport.RMQ,
        options: {
          urls: [rabbitMqUrl],
          queue: 'user_service_queue',
          queueOptions: { durable: false },
        },
      });

    await microservice.listen();
    console.log(
      `✅ User Service is running and connected to RabbitMQ on ${rabbitMqUrl}`,
    );
  } catch (error) {
    console.error('❌ Error starting User Service:', error);
    process.exit(1);
  }
}

void bootstrap();
