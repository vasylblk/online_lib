import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as path from 'path';

const envPath = path.resolve(
  __dirname,
  process.env.NODE_ENV === 'production' ? '../.env' : '../../.env',
);
dotenv.config({ path: envPath });

console.log('Using .env from:', envPath);
console.log('Loaded RABBITMQ_URL:', process.env.RABBITMQ_URL);
console.log('Loaded USER_SERVICE_QUEUE:', process.env.USER_SERVICE_QUEUE);
console.log('Loaded PORT:', process.env.PORT);

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);

    app.enableCors();
    app.setGlobalPrefix('api');

    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );

    const port = process.env.PORT || 3000;
    await app.listen(port);

    console.log(`🚀 API Gateway is running on http://localhost:${port}/api`);
  } catch (error) {
    console.error('❌ Ошибка при запуске API Gateway:', error);
    process.exit(1);
  }
}

void bootstrap();
