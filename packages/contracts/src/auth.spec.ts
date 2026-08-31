import { describe, expect, it } from 'vitest';
import {
  authErrorResponseSchema,
  loginRequestSchema,
  loginResponseSchema,
  logoutResponseSchema,
  sessionResponseSchema,
} from './auth.js';

describe('auth contracts', () => {
  it('accepts a valid login request', () => {
    expect(
      loginRequestSchema.parse({ username: 'admin', password: 'secreto' }),
    ).toEqual({ username: 'admin', password: 'secreto' });
  });

  it.each([
    { username: '', password: 'secreto' },
    { username: 'admin', password: '' },
    { username: 'admin' },
  ])('rejects an invalid login request: %o', (request) => {
    expect(loginRequestSchema.safeParse(request).success).toBe(false);
  });

  it('accepts session and login responses with a username', () => {
    const session = { username: 'admin' };

    expect(sessionResponseSchema.parse(session)).toEqual(session);
    expect(loginResponseSchema.parse(session)).toEqual(session);
  });

  it('accepts a logout response', () => {
    expect(logoutResponseSchema.parse({ success: true })).toEqual({
      success: true,
    });
    expect(logoutResponseSchema.safeParse({ success: false }).success).toBe(
      false,
    );
  });

  it('accepts the public error codes for authentication failures', () => {
    expect(
      authErrorResponseSchema.parse({
        code: 'AUTH_INVALID_CREDENTIALS',
        message: 'Usuario o contraseña incorrectos.',
      }),
    ).toEqual({
      code: 'AUTH_INVALID_CREDENTIALS',
      message: 'Usuario o contraseña incorrectos.',
    });

    expect(
      authErrorResponseSchema.parse({
        code: 'UNAUTHENTICATED',
        message: 'Inicia sesión para continuar.',
      }),
    ).toEqual({
      code: 'UNAUTHENTICATED',
      message: 'Inicia sesión para continuar.',
    });
  });
});
