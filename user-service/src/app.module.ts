import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserModule } from './modules/user/user.module';
import { AppController } from './app.controller'; // Додаємо контролер
import { AppService } from './app.service'; // Додаємо сервіс

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST') || 'localhost',
        port: configService.get<number>('DB_PORT') || 5432,
        username: configService.get<string>('DB_USER') || 'postgres',
        password: configService.get<string>('DB_PASSWORD') || 'yourpassword',
        database: configService.get<string>('DB_NAME') || 'online_library',
        entities: [User],
        autoLoadEntities: true,
        synchronize: true,
        logging: true,
      }),
    }),

    ClientsModule.registerAsync([
      {
        name: 'RABBITMQ_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [
              configService.get<string>('RABBITMQ_URL') ||
                'amqp://guest:guest@localhost:5672',
            ],
            queue: 'user_queue',
            queueOptions: { durable: false },
          },
        }),
      },
    ]),

    UserModule,
  ],
  controllers: [AppController], // Додаємо AppController
  providers: [AppService], // Додаємо AppService
})
export class AppModule {}
