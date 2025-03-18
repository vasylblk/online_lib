/* import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport'; // Використовуємо AuthGuard з пакету passport
import { ExecutionContext } from '@nestjs/common';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {

  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }
}*/
