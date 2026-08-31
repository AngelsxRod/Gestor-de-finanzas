import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { jwtVerify, SignJWT } from 'jose';
import type { Environment } from '../../config/environment.js';
import { SESSION_COOKIE_MAX_AGE_MS } from './constants.js';

const ALGORITHM = 'HS256';
const SESSION_DURATION_SECONDS = SESSION_COOKIE_MAX_AGE_MS / 1000;

@Injectable()
export class SessionTokenService {
  private readonly secret: Uint8Array;

  constructor(configService: ConfigService<Environment, true>) {
    this.secret = new TextEncoder().encode(configService.get('SESSION_SECRET'));
  }

  async sign(username: string): Promise<string> {
    return new SignJWT({ sub: username })
      .setProtectedHeader({ alg: ALGORITHM })
      .setIssuedAt()
      .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
      .sign(this.secret);
  }

  async verify(token: string): Promise<{ username: string } | null> {
    try {
      const { payload } = await jwtVerify(token, this.secret, {
        algorithms: [ALGORITHM],
      });

      if (typeof payload.sub !== 'string' || payload.sub.length === 0) {
        return null;
      }

      return { username: payload.sub };
    } catch {
      return null;
    }
  }
}
