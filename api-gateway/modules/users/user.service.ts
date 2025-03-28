import { Injectable, Logger, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { timeout, catchError, throwError, firstValueFrom } from 'rxjs';
import { retry } from 'rxjs/operators';

import { User } from './dto';
import { patterns } from '../patterns';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
  ) {}

  private async send(pattern: any, data: any): Promise<any> {
    const res$ = this.userClient.send(pattern, data).pipe(
      timeout(10000), // 10 секунд — достаточно для ответа
      retry(2), // повторы при ошибке: всего 3 попытки
      catchError((e: Error) => {
        this.logger.error(`❌ Ошибка запроса к User Service: ${e.message}`);
        return throwError(() => e);
      }),
    );
    return firstValueFrom(res$);
  }

  async createUser(dto: User): Promise<any> {
    this.logger.log('Создание пользователя...');
    return this.send(patterns.USER.CREATE, dto);
  }

  async findAllUsers(): Promise<any> {
    this.logger.log('Получение всех пользователей...');
    return this.send(patterns.USER.FIND_ALL, {});
  }

  async findUserById(id: string): Promise<any> {
    this.logger.log(`Поиск пользователя по ID: ${id}`);
    return this.send(patterns.USER.FIND_BY_ID, { id });
  }

  async updateUser(id: string, dto: User): Promise<any> {
    this.logger.log(`Обновление пользователя ID: ${id}`);
    return this.send(patterns.USER.UPDATE, { id, dto });
  }

  async deleteUser(id: string): Promise<any> {
    this.logger.log(`Удаление пользователя ID: ${id}`);
    return this.send(patterns.USER.DELETE, { id });
  }

  async findUserByEmail(email: string): Promise<any> {
    this.logger.log(`Поиск пользователя по email: ${email}`);
    return this.send(patterns.USER.FIND_BY_EMAIL, { email });
  }

  async resetPassword(email: string): Promise<any> {
    this.logger.log(`Сброс пароля для email: ${email}`);
    return this.send(patterns.USER.RESET_PASSWORD, { email });
  }
}
