import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthController } from './auth.controller.js';
import { AuthGuard } from './auth.guard.js';
import { AuthService } from './auth.service.js';
import { SessionTokenService } from './session-token.service.js';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [{ limit: 5, ttl: 60_000 }],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    SessionTokenService,
    { provide: APP_GUARD, useClass: AuthGuard },
  ],
})
export class AuthModule {}
