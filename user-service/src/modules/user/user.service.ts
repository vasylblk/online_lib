import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async createUser(name: string, email: string, password: string) {
    try {
      const hashedPassword: string = await bcrypt.hash(password, 10);

      const newUser = this.userRepository.create({
        name,
        email,
        password: hashedPassword,
      });
      return await this.userRepository.save(newUser);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error('Unknown error', error);
      }
    }
  }

  async getAllUsers() {
    return this.userRepository.find({
      select: ['id', 'name', 'email', 'role', 'created_at'],
    });
  }

  async getUserByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }
}
