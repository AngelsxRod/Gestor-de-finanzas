import { ConfigService } from '@nestjs/config';
import { SignJWT } from 'jose';
import { describe, expect, it } from 'vitest';
import type { Environment } from '../../config/environment.js';
import { SessionTokenService } from './session-token.service.js';

function createService(secret = 'a'.repeat(32)): SessionTokenService {
  return new SessionTokenService(
    new ConfigService<Environment, true>({ SESSION_SECRET: secret }),
  );
}

describe('SessionTokenService', () => {
  it('signs and verifies a token round trip', async () => {
    const service = createService();
    const token = await service.sign('admin');

    await expect(service.verify(token)).resolves.toEqual({
      username: 'admin',
    });
  });

  it('rejects a token signed with a different secret', async () => {
    const signed = await createService('a'.repeat(32)).sign('admin');
    const verifier = createService('b'.repeat(32));

    await expect(verifier.verify(signed)).resolves.toBeNull();
  });

  it('rejects an expired token', async () => {
    const secret = 'a'.repeat(32);
    const expired = await new SignJWT({ sub: 'admin' })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt(Math.floor(Date.now() / 1000) - 3600)
      .setExpirationTime(Math.floor(Date.now() / 1000) - 1800)
      .sign(new TextEncoder().encode(secret));

    await expect(createService(secret).verify(expired)).resolves.toBeNull();
  });

  it('rejects a tampered token', async () => {
    const service = createService();
    const token = await service.sign('admin');
    const tampered = `${token.slice(0, -1)}${token.at(-1) === 'a' ? 'b' : 'a'}`;

    await expect(service.verify(tampered)).resolves.toBeNull();
  });

  it('rejects garbage input instead of throwing', async () => {
    await expect(createService().verify('not-a-jwt')).resolves.toBeNull();
  });
});
