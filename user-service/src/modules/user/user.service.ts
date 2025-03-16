import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { UnauthorizedException } from '@nestjs/common';

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

  async getUserById(id: string): Promise<User> {
    // UUID — это строка
    const user = await this.userRepository.findOne({
      where: { id }, // Не конвертируем в Number, UUID строка
      select: ['id', 'name', 'email', 'role', 'created_at'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async login(email: string, password: string) {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
    };
  }
}
