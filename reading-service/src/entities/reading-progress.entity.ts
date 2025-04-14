import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
} from 'typeorm';

@Entity('reading_progress')
export class ReadingProgress {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user_id: string;

  @Column()
  book_id: string;

  @Column()
  current_page: number;

  @Column('float')
  percentage_read: number;

  @UpdateDateColumn()
  updated_at: Date;
}
