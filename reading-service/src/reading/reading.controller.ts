// src/reading/reading.controller.ts
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ReadingService } from './reading.service';
import {
  CreateReadingProgressDto,
  UpdateReadingProgressDto,
} from './dto/reading-progress.dto';
import { patterns } from '../patterns';

@Controller()
export class ReadingController {
  constructor(private readonly service: ReadingService) {}

  // 🟢 Створення запису прогресу
  @MessagePattern(patterns.READING.CREATE)
  create(@Payload() dto: CreateReadingProgressDto) {
    return this.service.create(dto);
  }

  // 🔵 Отримання списку книг, які читає користувач
  @MessagePattern(patterns.READING.GET_BY_USER)
  getByUser(@Payload() userId: string) {
    return this.service.getByUser(userId);
  }

  // 🟡 Оновлення прогресу читання
  @MessagePattern(patterns.READING.UPDATE)
  update(@Payload() payload: { id: string; data: UpdateReadingProgressDto }) {
    return this.service.update(payload.id, payload.data);
  }
}
