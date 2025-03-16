import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmModuleOptions } from '@nestjs/typeorm/dist/interfaces/typeorm-options.interface';
import config from './config/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (): TypeOrmModuleOptions => ({
        type: 'postgres',
        host: config().database.host,
        port: config().database.port,
        username: config().database.username,
        password: config().database.password,
        database: config().database.database,
        synchronize: config().database.synchronize,
        autoLoadEntities: config().database.autoLoadEntities,
        logging: config().database.logging,
        entities: [__dirname + '/../**/*.entity{.ts,.js}'], // Додаємо шлях до сутностей
      }),
    }),
  ],
})
export class OrmModule {}
