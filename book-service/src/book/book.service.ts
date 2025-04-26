import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from '../entities/book.entity';
import { CreateBookDto, UpdateBookDto } from './dto/book.dto';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
  ) {}

  async create(createBookDto: CreateBookDto): Promise<Book> {
    console.log('➡️ [BookService] Створення книги почато', createBookDto);
    const book = this.bookRepository.create(createBookDto);
    console.log('🛠️ [BookService] Книга створена локально, зберігаємо...');
    const savedBook = await this.bookRepository.save(book);
    console.log('✅ [BookService] Книга успішно збережена в БД:', savedBook);
    return savedBook;
  }


  async findAll(): Promise<Book[]> {
    return await this.bookRepository.find();
  }

  async findOne(id: string): Promise<Book> {
    console.log(`Searching for book with ID: ${id}`); // для дебагу
    const book = await this.bookRepository.findOne({ where: { id } });
    if (!book) throw new NotFoundException(`Book with ID ${id} not found`);
    return book;
  }

  async update(id: string, updateBookDto: UpdateBookDto): Promise<Book> {
    const book = await this.findOne(id);
    Object.assign(book, updateBookDto);
    return await this.bookRepository.save(book);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.bookRepository.delete(id);
  }

  // фильтр
  async findFiltered(
    genre?: string,
    author?: string,
    publication_year?: number,
  ): Promise<Book[]> {
    const query = this.bookRepository.createQueryBuilder('book');

    if (genre) {
      query.andWhere('book.genre = :genre', { genre });
    }

    if (author) {
      query.andWhere('book.author = :author', { author });
    }

    if (publication_year) {
      query.andWhere('book.publication_year = :publication_year', {
        publication_year,
      });
    }

    return await query.getMany();
  }
}
