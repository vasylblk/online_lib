/* import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService, // Для генерації та перевірки токенів
  ) {}

  // Метод для аутентифікації користувача та генерації токена
  async login(email: string, password: string) {
    // Спочатку шукаємо користувача по email, оскільки у вас немає методу findUserByEmail
    const users = await this.userService.getAllUsers();
    const user = users.find((u) => u.email === email); // Знайти користувача за email
    if (!user || user.password !== password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { id: user.id, email: user.email, role: user.role }; // Створюємо payload для токена
    const token = this.jwtService.sign(payload); // Генерація токена

    return { access_token: token }; // Повертаємо токен клієнту
  }

  // Метод для валідації користувача за токеном
  async validateUser(payload: any) {
    const user = await this.userService.getUserById(payload.id);
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }
    return user; // Повертаємо користувача
  }
}*/
