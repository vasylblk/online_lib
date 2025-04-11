// src/book/book.micro.controller.ts
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { BookService } from './book.service';
import { CreateBookDto, UpdateBookDto } from './dto/book.dto';
import { patterns } from '../patterns';

@Controller()
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @MessagePattern(patterns.BOOK.CREATE)
  create(@Payload() dto: CreateBookDto) {
    return this.bookService.create(dto);
  }

  @MessagePattern(patterns.BOOK.FIND_ALL)
  findBooks(@Payload() query: any) {
    const { genre, author, publication_year } = query;
    if (genre || author || publication_year) {
      return this.bookService.findFiltered(genre, author, publication_year);
    }
    return this.bookService.findAll();
  }

  @MessagePattern(patterns.BOOK.FIND_BY_ID)
  findOne(@Payload() id: string) {
    return this.bookService.findOne(id);
  }

  @MessagePattern(patterns.BOOK.UPDATE)
  update(@Payload() payload: { id: string; dto: UpdateBookDto }) {
    return this.bookService.update(payload.id, payload.dto);
  }

  @MessagePattern(patterns.BOOK.DELETE)
  delete(@Payload() id: string) {
    return this.bookService.remove(id);
  }
}
