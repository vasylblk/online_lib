import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { Role } from '../../entities/role.entity';
import * as bcrypt from 'bcryptjs';
import { Tokens } from '../auth/dto';
import { UserDTO } from './dto';
import { AuthService } from '../auth/auth.service'; // 🔥 Прямий імпорт

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,

    private readonly authService: AuthService, // ✅ Прямий інжект сервісу
  ) {}

  async createUser(dto: UserDTO): Promise<User> {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const roleName =
      !dto.role || dto.role === 'null' || dto.role === '' ? 'user' : dto.role;

    const role = await this.roleRepository.findOne({
      where: { name: roleName },
    });

    if (!role) {
      throw new NotFoundException(`Role '${roleName}' not found`);
    }

    const newUser = new User();
    newUser.name = dto.name;
    newUser.email = dto.email;
    newUser.password = hashedPassword;
    newUser.role = role;
    newUser.role_id = role.id;

    this.logger.log(`📌 Created user with role ID: ${role.id}`);

    return this.userRepository.save(newUser);
  }

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.find({
      select: ['id', 'name', 'email', 'role', 'created_at'],
    });
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

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

  async login(email: string, password: string): Promise<Tokens> {
    this.logger.log('🔍 Шукаємо користувача по email...');
    const user = await this.userRepository.findOne({ where: { email } });
    this.logger.log('✅ Знайдено користувача: ' + user?.id);

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    this.logger.log('🔐 Перевіряємо пароль...');
    const isPasswordValid = await bcrypt.compare(password, user.password);
    this.logger.log('✅ Пароль валідний: ' + isPasswordValid);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      member_id: user.id,
      role_id: user.role_id,
    };

    this.logger.log('🧾 Генеруємо токени...');
    return this.authService.generateTokens(payload);
  }

  async deleteUser(id: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    await this.userRepository.delete(id);
  }

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
    user.updated_at = new Date();

    return this.userRepository.save(user);
  }

  async resetPassword(email: string): Promise<{ message: string }> {
    this.logger.log(`🔧 Resetting password for email: ${email}`);
    return { message: `Reset password request processed for ${email}` };
  }
}
