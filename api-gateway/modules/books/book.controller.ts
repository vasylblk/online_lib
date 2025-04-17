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
  BadRequestException,
} from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto, UpdateBookDto } from './dto/book.dto';
import { JwtAuthGuard } from '../../guards/auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator'; // 👈 Імпорт декоратора

@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  // 🔓 Публічно — отримання всіх книг
  @Get()
  @Public()
  async getBooks(
    @Query()
    query: {
      genre?: string;
      author?: string;
      publication_year?: number;
    },
  ) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return await this.bookService.getBooks(query);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new BadRequestException('Error retrieving books');
    }
  }

  // 🔓 Публічно — отримання книги за ID
  @Get(':id')
  @Public()
  async getBook(@Param('id') id: string) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return await this.bookService.getBookById(id);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new BadRequestException('Error retrieving the book');
    }
  }

  // 🔐 Тільки для адміністраторів — створення нової книги
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async createBook(@Body() dto: CreateBookDto) {
    console.log('[GATEWAY] Sending cmd: create_book with payload:', dto);
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return await this.bookService.createBook(dto);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new BadRequestException('Error creating book');
    }
  }

  // 🔐 Тільки для адміністраторів — редагування книги
  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async updateBook(@Param('id') id: string, @Body() dto: UpdateBookDto) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return await this.bookService.updateBook(id, dto);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new BadRequestException('Error updating book');
    }
  }

  // 🔐 Тільки для адміністраторів — видалення книги
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async deleteBook(@Param('id') id: string) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return await this.bookService.deleteBook(id);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new BadRequestException('Error deleting book');
    }
  }
}
