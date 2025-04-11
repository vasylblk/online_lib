import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module'; // 👈 Додай!
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST') || 'postgres',
        port: configService.get<number>('DATABASE_PORT') || 5432,
        username: configService.get<string>('DATABASE_USER') || 'postgres',
        password: configService.get<string>('DATABASE_PASSWORD') || 'password',
        database: configService.get<string>('DATABASE_NAME') || 'users_db',
        entities: [User, Role],
        autoLoadEntities: true,
        synchronize: true,
        logging: true,
      }),
    }),

    UserModule, // 👈 обов’язково
    AuthModule, // 👈 обов’язково
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
