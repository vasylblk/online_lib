import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { Role } from '../../entities/role.entity';
import * as bcrypt from 'bcryptjs';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { patterns } from '../patterns';
import { Tokens } from '../auth/dto';
import { UserDTO } from './dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,

    @Inject('AUTH_SERVICE')
    private readonly authClient: ClientProxy,
  ) {}

  // Створення нового користувача
  async createUser(dto: UserDTO): Promise<User> {
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // 👇 Навіть якщо в dto прийде 'null' або '', ставимо роль за замовчуванням
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

    console.log('📌 Role ID:', role.id); // отладка

    return this.userRepository.save(newUser);

  }

  // Отримання всіх користувачів
  async getAllUsers(): Promise<User[]> {
    return this.userRepository.find({
      select: ['id', 'name', 'email', 'role', 'created_at'],
    });
  }

  // Пошук користувача за email
  async findUserByEmail(email: string): Promise<User | null> {
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

    const payload = {
      member_id: user.id,
      role_id: user.role_id,
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
