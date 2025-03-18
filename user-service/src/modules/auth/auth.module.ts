/* import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtStrategy } from './jwt.strategy'; // стратегія для роботи з JWT
import { JwtAuthGuard } from './jwt-auth.guard'; // Guard для захисту маршрутів

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY || 'secret', // секретний ключ для підпису JWT
      signOptions: { expiresIn: '60m' }, // час дії токена
    }),
  ],
  providers: [AuthService, UserService, JwtStrategy, JwtAuthGuard],
  exports: [AuthService], // єскпорт AuthService для використ в інших модулях
})
export class AuthModule {} */
