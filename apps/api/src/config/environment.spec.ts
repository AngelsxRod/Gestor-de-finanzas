import { describe, expect, it } from 'vitest';
import { hashPassword } from '../modules/auth/password.js';
import { validateEnvironment } from './environment.js';

const validAuthEnv = {
  ADMIN_USERNAME: 'admin',
  ADMIN_PASSWORD_HASH: hashPassword('a-strong-password'),
  SESSION_SECRET: 'a'.repeat(32),
};

describe('validateEnvironment', () => {
  it('applies safe local defaults', () => {
    expect(
      validateEnvironment({
        DATABASE_URL: 'postgres://user:password@127.0.0.1:5432/database',
        ...validAuthEnv,
      }),
    ).toMatchObject({
      NODE_ENV: 'development',
      HOST: '127.0.0.1',
      PORT: 3211,
    });
  });

  it('rejects a non-PostgreSQL database URL', () => {
    expect(() =>
      validateEnvironment({
        DATABASE_URL: 'https://example.com/database',
        ...validAuthEnv,
      }),
    ).toThrow();
  });

  it('requires ADMIN_USERNAME', () => {
    expect(() =>
      validateEnvironment({
        DATABASE_URL: 'postgres://user:password@127.0.0.1:5432/database',
        ...validAuthEnv,
        ADMIN_USERNAME: '',
      }),
    ).toThrow();
  });

  it('rejects an ADMIN_PASSWORD_HASH not produced by scripts/hash-password.ts', () => {
    expect(() =>
      validateEnvironment({
        DATABASE_URL: 'postgres://user:password@127.0.0.1:5432/database',
        ...validAuthEnv,
        ADMIN_PASSWORD_HASH: 'plaintext-not-a-hash',
      }),
    ).toThrow();
  });

  it('requires SESSION_SECRET to be at least 32 characters', () => {
    expect(() =>
      validateEnvironment({
        DATABASE_URL: 'postgres://user:password@127.0.0.1:5432/database',
        ...validAuthEnv,
        SESSION_SECRET: 'too-short',
      }),
    ).toThrow();
  });
});
