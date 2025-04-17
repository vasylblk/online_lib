import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateBookDto, UpdateBookDto } from './dto/book.dto';
import { firstValueFrom } from 'rxjs';
import { patterns } from '../patterns';

@Injectable()
export class BookService {
  constructor(@Inject('BOOK_SERVICE') private client: ClientProxy) {}

  async getBooks(query?: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await firstValueFrom(
      this.client.send(patterns.BOOK.FIND_ALL, query || {}),
    );
  }

  async getBookById(id: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await firstValueFrom(this.client.send(patterns.BOOK.FIND_BY_ID, id));
  }

  async createBook(dto: CreateBookDto) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await firstValueFrom(this.client.send(patterns.BOOK.CREATE, dto));
  }

  async updateBook(id: string, dto: UpdateBookDto) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await firstValueFrom(
      this.client.send(patterns.BOOK.UPDATE, { id, dto }),
    );
  }

  async deleteBook(id: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await firstValueFrom(this.client.send(patterns.BOOK.DELETE, id));
  }
}
