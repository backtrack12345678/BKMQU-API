import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Auth } from './auth.decorator';
import { PrismaService } from './prisma.service';
import { Token } from './token/token';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private tokenManager: Token,
    private reflector: Reflector,
    private prismaService: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const auth = this.reflector.get<boolean>(Auth, context.getHandler());

    if (!auth) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    if (type !== 'Bearer' || !token) {
      throw new HttpException(
        'Kredensial Tidak Valid. Silahkan Login Kembali',
        401,
      );
    }

    try {
      const payload = await this.tokenManager.validateToken(
        token,
        'accessToken',
      );

      request['user'] = {
        id: payload.id,
        role: payload.role,
      };
    } catch (e) {
      throw new HttpException(
        'Kredensial Tidak Valid. Silahkan Login Kembali',
        401,
      );
    }

    return true;
  }
}
