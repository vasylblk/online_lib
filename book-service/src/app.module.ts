import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookModule } from './book/book.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'heric025',
      database: 'book_service_db',
      autoLoadEntities: true,
      synchronize: true,
    }),
    BookModule,    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
