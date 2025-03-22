import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Book } from '../entities/book.entity';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepo: Repository<Book>,
  ) {}

  create(bookData: Partial<Book>) {
    const book = this.bookRepo.create(bookData);
    return this.bookRepo.save(book);
  }

  findAll() {
    return this.bookRepo.find();
  }

  findOne(id: number) {
    return this.bookRepo.findOne({ where: { id } });
  }

  update(id: number, bookData: Partial<Book>) {
    return this.bookRepo.update(id, bookData);
  }

  delete(id: number) {
    return this.bookRepo.delete(id);
  }

  filter(genre?: string, author?: string, year?: number) {
    const where: any = {};
    if (genre) where.genre = Like(`%${genre}%`);
    if (author) where.author = Like(`%${author}%`);
    if (year) where.year = year;

    return this.bookRepo.find({ where });
  }
}
