import { describe, expect, it, vi } from 'vitest';
import type { Response } from 'express';
import { AuthController } from './auth.controller.js';
import { SESSION_COOKIE_NAME } from './constants.js';
import type { AuthService } from './auth.service.js';
import type { AuthenticatedRequest } from './auth.guard.js';

function createResponseMock(): Response {
  return {
    cookie: vi.fn(),
    clearCookie: vi.fn(),
  } as unknown as Response;
}

describe('AuthController', () => {
  it('sets the session cookie and returns the username on successful login', async () => {
    const authService = { login: vi.fn().mockResolvedValue('a-token') };
    const controller = new AuthController(
      authService as unknown as AuthService,
    );
    const res = createResponseMock();

    await expect(
      controller.login({ username: 'admin', password: 'secret' }, res),
    ).resolves.toEqual({ username: 'admin' });

    expect(authService.login).toHaveBeenCalledWith('admin', 'secret');
    expect(res.cookie).toHaveBeenCalledWith(
      SESSION_COOKIE_NAME,
      'a-token',
      expect.objectContaining({ httpOnly: true, path: '/' }),
    );
  });

  it('clears the session cookie on logout', () => {
    const authService = { login: vi.fn() };
    const controller = new AuthController(
      authService as unknown as AuthService,
    );
    const res = createResponseMock();

    expect(controller.logout(res)).toEqual({ success: true });
    expect(res.clearCookie).toHaveBeenCalledWith(
      SESSION_COOKIE_NAME,
      expect.objectContaining({ path: '/' }),
    );
  });

  it('returns the authenticated username for the session endpoint', () => {
    const authService = { login: vi.fn() };
    const controller = new AuthController(
      authService as unknown as AuthService,
    );
    const req = { user: { username: 'admin' } } as AuthenticatedRequest;

    expect(controller.session(req)).toEqual({ username: 'admin' });
  });
});
