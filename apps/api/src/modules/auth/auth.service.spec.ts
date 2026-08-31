import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import { describe, expect, it, vi } from 'vitest';
import type { Environment } from '../../config/environment.js';
import { hashPassword } from './password.js';
import { AuthService } from './auth.service.js';
import type { SessionTokenService } from './session-token.service.js';

const adminPasswordHash = hashPassword('correct-password');

function createService() {
  const configService = new ConfigService<Environment, true>({
    ADMIN_USERNAME: 'admin',
    ADMIN_PASSWORD_HASH: adminPasswordHash,
  });
  const sessionTokenService = { sign: vi.fn().mockResolvedValue('a-token') };
  const service = new AuthService(
    configService,
    sessionTokenService as unknown as SessionTokenService,
  );

  return { service, sessionTokenService };
}

describe('AuthService', () => {
  it('signs a session token for correct credentials', async () => {
    const { service, sessionTokenService } = createService();

    await expect(
      service.login('admin', 'correct-password'),
    ).resolves.toBe('a-token');
    expect(sessionTokenService.sign).toHaveBeenCalledWith('admin');
  });

  it('rejects a wrong password', async () => {
    const { service, sessionTokenService } = createService();

    const result = service.login('admin', 'wrong-password');

    await expect(result).rejects.toBeInstanceOf(UnauthorizedException);
    await expect(result).rejects.toMatchObject({
      response: { code: 'AUTH_INVALID_CREDENTIALS' },
    });
    expect(sessionTokenService.sign).not.toHaveBeenCalled();
  });

  it('rejects an unknown username with the same error as a wrong password', async () => {
    const { service } = createService();

    const result = service.login('someone-else', 'correct-password');

    await expect(result).rejects.toBeInstanceOf(UnauthorizedException);
    await expect(result).rejects.toMatchObject({
      response: { code: 'AUTH_INVALID_CREDENTIALS' },
    });
  });
});
