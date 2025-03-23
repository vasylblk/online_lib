import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('books')
export class Book {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  author: string;

  @Column()
  genre: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  publication_year: number;

  @Column()
  file_url: string;

  @CreateDateColumn()
  created_at: Date;
}
