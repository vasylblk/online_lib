import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { User } from './user.entity';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string; // Наприклад: 'user', 'admin'

  @Column({ type: 'jsonb', default: [] })
  permissions: string[]; // Опціонально: список дозволів

  @OneToMany(() => User, (user) => user.role)
  users: User[];
}
