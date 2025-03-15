import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as path from 'path';

// завантажуємо змінні оточенння
dotenv.config({ path: path.resolve(__dirname, '../.env') });

console.log('Loaded RABBITMQ_URL:', process.env.RABBITMQ_URL);
console.log('Loaded USER_SERVICE_QUEUE:', process.env.USER_SERVICE_QUEUE);
console.log('Loaded PORT:', process.env.PORT);

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);

    // вмикаємо CORS (доступ з фронтенда)
    app.enableCors();

    // глобальний апі-префікс
    app.setGlobalPrefix('api');

    // включаємо глобальну валідацію (захист від некоректних даних)
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

    // перевіряємо чи завантажені потрібні змінні оточення
    const rabbitMqUrl = process.env.RABBITMQ_URL;
    const queueName = process.env.USER_SERVICE_QUEUE;

    if (!rabbitMqUrl || !queueName) {
      throw new Error('RABBITMQ_URL або USER_SERVICE_QUEUE не задані в .env');
    }

    // підключаємо кролика як мікросервіс
    app.connectMicroservice<MicroserviceOptions>({
      transport: Transport.RMQ,
      options: {
        urls: [rabbitMqUrl],
        queue: queueName,
        queueOptions: { durable: false },
      },
    });

    // Запуск мікросервісної взаємодії
    await app.startAllMicroservices();

    // Запуск HTTP-сервера
    const port = process.env.PORT || 3000;
    await app.listen(port);

    console.log(`🚀 API Gateway is running on http://localhost:${port}/api`);
  } catch (error) {
    console.error('❌ Ошибка при запуске API Gateway:', error);
    process.exit(1); // Корректное завершение процесса с ошибкой
  }
}

// Безпечний запуск - запобігання помилок, які не були зафіксовані
void bootstrap();
