import {
  Injectable,
  UnauthorizedException,
  type CanActivate,
  type ExecutionContext,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import { SESSION_COOKIE_NAME } from './constants.js';
import { IS_PUBLIC_KEY } from './public.decorator.js';
import { SessionTokenService } from './session-token.service.js';

export type AuthenticatedRequest = Request & { user: { username: string } };

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly sessionTokenService: SessionTokenService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token: unknown = request.cookies?.[SESSION_COOKIE_NAME];

    if (typeof token !== 'string' || token.length === 0) {
      throw new UnauthorizedException({
        code: 'UNAUTHENTICATED',
        message: 'Inicia sesión para continuar.',
      });
    }

    const session = await this.sessionTokenService.verify(token);

    if (!session) {
      throw new UnauthorizedException({
        code: 'UNAUTHENTICATED',
        message: 'Inicia sesión para continuar.',
      });
    }

    request.user = session;

    return true;
  }
}
