import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../common/decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true; // Если роли не требуются, доступ разрешён
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const req = context.switchToHttp().getRequest();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
    const user = req.user; // Информация о пользователе из JwtAuthGuard

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (!user || !user.role) {
      throw new ForbiddenException('Роль не знайдена');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-argument
    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException('Доступ заборонено: недостатньо прав');
    }

    return true; // Доступ разрешён, если роль подходит
  }
}
