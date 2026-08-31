import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import {
  loginRequestSchema,
  type LoginRequest,
  type LoginResponse,
  type SessionResponse,
} from '@gestor-finanzas/contracts';
import type { Response } from 'express';
import { AuthService } from './auth.service.js';
import { SESSION_COOKIE_MAX_AGE_MS, SESSION_COOKIE_NAME } from './constants.js';
import { Public } from './public.decorator.js';
import type { AuthenticatedRequest } from './auth.guard.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @HttpCode(200)
  @Post('login')
  async login(
    @Body({ schema: loginRequestSchema }) input: LoginRequest,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginResponse> {
    const token = await this.authService.login(input.username, input.password);

    res.cookie(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      path: '/',
      maxAge: SESSION_COOKIE_MAX_AGE_MS,
    });

    return { username: input.username };
  }

  @Public()
  @HttpCode(200)
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response): { success: true } {
    res.clearCookie(SESSION_COOKIE_NAME, { path: '/' });

    return { success: true };
  }

  @Get('session')
  session(@Req() req: AuthenticatedRequest): SessionResponse {
    return { username: req.user.username };
  }
}
