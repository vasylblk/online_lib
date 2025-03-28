import { Controller, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { Tokens, TokenPayload } from './dto';
import { patterns } from '../patterns';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @MessagePattern(patterns.AUTH.TOKENS)
  async generateTokens(dto: TokenPayload): Promise<Tokens> {
    this.logger.log('Generating tokens...');
    return this.authService.generateTokens(dto);
  }

  @MessagePattern(patterns.AUTH.VERIFY)
  async verifyToken(token: string): Promise<TokenPayload> {
    this.logger.log('Verifying token...');
    return this.authService.verifyAccessToken(token);
  }

  @MessagePattern(patterns.AUTH.REFRESH)
  async refreshTokens(refreshToken: string): Promise<Tokens> {
    this.logger.log('Refreshing tokens...');
    return this.authService.refreshTokens(refreshToken);
  }
}
