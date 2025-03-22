import { Controller, Get, Post, Put, Delete, Param, Body, Query } from '@nestjs/common';
import { BookService } from './book.service';

@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  create(@Body() data: any) {
    return this.bookService.create(data);
  }

  @Get()
  findAll() {
    return this.bookService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.bookService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() data: any) {
    return this.bookService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.bookService.delete(+id);
  }

  @Get('/filter')
  filter(
    @Query('genre') genre?: string,
    @Query('author') author?: string,
    @Query('year') year?: string,
  ) {
    return this.bookService.filter(genre, author, year ? +year : undefined);
  }
}
