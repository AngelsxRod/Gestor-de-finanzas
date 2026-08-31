import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Environment } from '../../config/environment.js';
import { hashPassword, verifyPassword } from './password.js';
import { SessionTokenService } from './session-token.service.js';

// Used when the username doesn't match, so verifyPassword still runs a
// scrypt comparison either way — the response time doesn't reveal whether
// the username or the password was wrong.
const DUMMY_PASSWORD_HASH = hashPassword('irrelevant-dummy-password');

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService<Environment, true>,
    private readonly sessionTokenService: SessionTokenService,
  ) {}

  async login(username: string, password: string): Promise<string> {
    const expectedUsername = this.configService.get('ADMIN_USERNAME');
    const expectedPasswordHash = this.configService.get('ADMIN_PASSWORD_HASH');
    const usernameMatches = username === expectedUsername;

    const passwordMatches = verifyPassword(
      password,
      usernameMatches ? expectedPasswordHash : DUMMY_PASSWORD_HASH,
    );

    if (!usernameMatches || !passwordMatches) {
      throw new UnauthorizedException({
        code: 'AUTH_INVALID_CREDENTIALS',
        message: 'Usuario o contraseña incorrectos.',
      });
    }

    return this.sessionTokenService.sign(username);
  }
}
