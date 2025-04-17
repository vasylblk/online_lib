import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReadingProgress } from '../entities/reading-progress.entity';
import {
  CreateReadingProgressDto,
  UpdateReadingProgressDto,
} from './dto/reading-progress.dto';

@Injectable()
export class ReadingService {
  constructor(
    @InjectRepository(ReadingProgress)
    private repo: Repository<ReadingProgress>,
  ) {}

  async create(dto: CreateReadingProgressDto): Promise<ReadingProgress> {
    const progress = this.repo.create(dto);
    return this.repo.save(progress);
  }

  async getByUser(userId: string): Promise<ReadingProgress[]> {
    return this.repo.find({ where: { user_id: userId } });
  }

  async update(
    id: string,
    dto: UpdateReadingProgressDto,
  ): Promise<ReadingProgress> {
    const progress = await this.repo.findOne({ where: { id } });
    if (!progress)
      throw new NotFoundException(`Progress with ID ${id} not found`);
    Object.assign(progress, dto);
    return this.repo.save(progress);
  }
}
