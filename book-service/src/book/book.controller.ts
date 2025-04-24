// src/modules/books/book.controller.ts
import { Controller, Post, Get, Param, Body, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CreateBookDto } from './dto/book.dto';
import { patterns } from '../patterns'; // шлях може трохи відрізнятись

@Controller('books')
export class BookController {
  constructor(
    @Inject('BOOK_SERVICE') private readonly bookService: ClientProxy,
  ) {}

  @Post()
  async create(@Body() dto: CreateBookDto) {
    console.log('[API GATEWAY] ▶️ Створення книги:', dto);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return firstValueFrom(this.bookService.send(patterns.BOOK.CREATE, dto));
  }

  @Get()
  async findAll() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return firstValueFrom(this.bookService.send(patterns.BOOK.FIND_ALL, {}));
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return firstValueFrom(this.bookService.send(patterns.BOOK.FIND_BY_ID, id));
  }
}
