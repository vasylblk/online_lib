import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto, UpdateBookDto } from './dto/book.dto';
import { JwtAuthGuard } from '../../guards/auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  // 🔓 Публічно — отримання всіх книг
  @Get()
  getBooks(@Query() query: any) {
    return this.bookService.getBooks(query);
  }

  // 🔓 Публічно — отримання книги за ID
  @Get(':id')
  getBook(@Param('id') id: string) {
    return this.bookService.getBookById(id);
  }

  // 🔐 Тільки для адміністраторів — створення нової книги
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  createBook(@Body() dto: CreateBookDto) {
    return this.bookService.createBook(dto);
  }

  // 🔐 Тільки для адміністраторів — редагування книги
  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  updateBook(@Param('id') id: string, @Body() dto: UpdateBookDto) {
    return this.bookService.updateBook(id, dto);
  }

  // (не обов’язковий, але залишимо приклад для повноти)
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  deleteBook(@Param('id') id: string) {
    return this.bookService.deleteBook(id);
  }

}
