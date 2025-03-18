/* import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Извлечение токена из заголовка
      secretOrKey: process.env.JWT_SECRET_KEY || 'secret', // Секретный ключ
    });
  }

  async validate(payload: any) {
    return this.authService.validateUser(payload); // валідація юзера
  }
}
*/
