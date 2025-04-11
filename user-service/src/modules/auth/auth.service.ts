import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RpcException } from '@nestjs/microservices';
import { TokenPayload, Tokens } from './dto';

@Injectable()
export class AuthService {
  constructor(
      private readonly jwtService: JwtService,
      private readonly configService: ConfigService,
  ) {}

  async generateTokens(payload: TokenPayload): Promise<Tokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_SECRET') || 'secret',
        expiresIn:
            this.configService.get<string>('JWT_ACCESS_EXPIRATION') || '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret:
            this.configService.get<string>('JWT_REFRESH_SECRET') || 'refresh',
        expiresIn:
            this.configService.get<string>('JWT_REFRESH_EXPIRATION') || '7d',
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async verifyAccessToken(token: string): Promise<TokenPayload> {
    try {
      return this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET') || 'secret',
      });
    } catch (error) {
      throw new RpcException('Invalid or expired access token');
    }
  }

  async verifyRefreshToken(token: string): Promise<TokenPayload> {
    try {
      return this.jwtService.verify(token, {
        secret:
            this.configService.get<string>('JWT_REFRESH_SECRET') || 'refresh',
      });
    } catch (error) {
      throw new RpcException('Invalid or expired refresh token');
    }
  }

  async refreshTokens(refreshToken: string): Promise<Tokens> {
    const decoded = await this.verifyRefreshToken(refreshToken);
    return this.generateTokens({
      member_id: decoded.member_id,
      role_id: decoded.role_id,
    });
  }
}
