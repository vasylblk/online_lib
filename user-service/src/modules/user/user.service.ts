import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { patterns } from '../patterns';
import { Tokens } from '../auth/dto'; // Перевірте, чи у вас є такий DTO

@Injectable()
export class UserService {
  constructor(
      @InjectRepository(User) private userRepository: Repository<User>,

      @Inject('AUTH_SERVICE') // 🔐 Інжектимо мікросервіс для авторизації
      private readonly authClient: ClientProxy,
  ) {}

  // Створення нового користувача
  async createUser(name: string, email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = this.userRepository.create({
      name,
      email,
      password: hashedPassword,
    });
    return this.userRepository.save(newUser);
  }

  // Отримання всіх користувачів
  async getAllUsers() {
    return this.userRepository.find({
      select: ['id', 'name', 'email', 'role', 'created_at'],
    });
  }

  // Пошук користувача за email
  async findUserByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  // Отримання користувача за ID
  async getUserById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'name', 'email', 'role', 'created_at'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  // Логін користувача
  async login(email: string, password: string): Promise<Tokens> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 🔐 Відправка даних до AUTH_SERVICE через RabbitMQ для генерації токенів
    const payload = {
      member_id: user.id,
      role_id: user.role,
    };

    return await lastValueFrom<Tokens>(
        this.authClient.send(patterns.AUTH.TOKENS, payload),
    );
  }

  // Видалення користувача
  async deleteUser(id: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    await this.userRepository.delete(id);
  }

  // Оновлення користувача
  async updateUser(
      id: string,
      data: { name: string; email: string; password: string },
  ): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    user.name = data.name;
    user.email = data.email;
    user.password = await bcrypt.hash(data.password, 10);

    return this.userRepository.save(user);
  }
}
