import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReadingProgress } from '../entities/reading-progress.entity';
import { ReadingService } from './reading.service';
import { ReadingController } from './reading.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ReadingProgress])],
  controllers: [ReadingController],
  providers: [ReadingService],
})
export class ReadingModule {}
