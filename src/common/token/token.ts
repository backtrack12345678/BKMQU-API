import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';

@Injectable()
export class Token {
  constructor(private jwtService: JwtService) {}
  async generateToken(user: User, type: string): Promise<string> {
    const payload = {
      id: user.id,
      ...(type === 'accessToken' && {
        role: user.role,
      }),
    };

    const expiresIn: string | number =
      type === 'accessToken' ? Number(process.env.ACCESS_TOKEN_AGE) : '30d';
    const secret: string =
      type === 'accessToken'
        ? process.env.ACCESS_TOKEN_KEY
        : process.env.REFRESH_TOKEN_KEY;

    return this.jwtService.signAsync(payload, {
      secret,
      expiresIn,
    });
  }

  async validateToken(
    token: string,
    type: string,
  ): Promise<Record<any, string>> {
    return this.jwtService.verifyAsync(token, {
      secret:
        type === 'accessToken'
          ? process.env.ACCESS_TOKEN_KEY
          : process.env.REFRESH_TOKEN_KEY,
    });
  }
}
