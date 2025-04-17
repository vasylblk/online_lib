import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { patterns } from '../modules/patterns';
import { IS_PUBLIC_KEY } from '../common/decorators/public.decorator'; // 👈 імпорт ключа для @Public

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
    private readonly reflector: Reflector, // 👈 додаємо Reflector
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Якщо маршрут помічений як публічний — дозволяємо без перевірки токена
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      this.logger.log('Public route detected – skipping token check');
      return true;
    }

    const req: Request & { user?: any } = context.switchToHttp().getRequest();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const authHeader: string | undefined = req.headers?.['authorization'];

    if (!authHeader) {
      this.logger.warn('Token not provided - Authorization header is missing');
      throw new UnauthorizedException('Token not provided');
    }

    if (!authHeader.startsWith('Bearer ')) {
      this.logger.warn('Invalid token format - Should be Bearer <token>');
      throw new UnauthorizedException('Invalid token format');
    }

    const token = authHeader.split(' ')[1];

    try {
      this.logger.log('Verifying token...');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      req.user = await lastValueFrom(
        this.authClient.send(patterns.AUTH.VERIFY, token),
      );
      return true;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      this.logger.error('Token verification failed', error?.stack);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
