import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtService],
  exports: [AuthService], // Експортуємо лише те, що реально треба
})
export class AuthModule {}
