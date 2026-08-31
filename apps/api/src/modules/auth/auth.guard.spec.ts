import { UnauthorizedException, type ExecutionContext } from '@nestjs/common';
import { describe, expect, it, vi } from 'vitest';
import { AuthGuard } from './auth.guard.js';
import { SESSION_COOKIE_NAME } from './constants.js';
import type { Reflector } from '@nestjs/core';
import type { SessionTokenService } from './session-token.service.js';

function createContext(
  cookies: Record<string, string> = {},
): ExecutionContext {
  return {
    getHandler: () => vi.fn(),
    getClass: () => vi.fn(),
    switchToHttp: () => ({
      getRequest: () => ({ cookies }),
    }),
  } as unknown as ExecutionContext;
}

describe('AuthGuard', () => {
  it('lets a request through when the route is marked @Public()', async () => {
    const reflector = { getAllAndOverride: vi.fn().mockReturnValue(true) };
    const sessionTokenService = { verify: vi.fn() };
    const guard = new AuthGuard(
      reflector as unknown as Reflector,
      sessionTokenService as unknown as SessionTokenService,
    );

    await expect(guard.canActivate(createContext())).resolves.toBe(true);
    expect(sessionTokenService.verify).not.toHaveBeenCalled();
  });

  it('rejects a request without a session cookie', async () => {
    const reflector = { getAllAndOverride: vi.fn().mockReturnValue(false) };
    const sessionTokenService = { verify: vi.fn() };
    const guard = new AuthGuard(
      reflector as unknown as Reflector,
      sessionTokenService as unknown as SessionTokenService,
    );

    await expect(guard.canActivate(createContext())).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });

  it('rejects a request with an invalid session cookie', async () => {
    const reflector = { getAllAndOverride: vi.fn().mockReturnValue(false) };
    const sessionTokenService = { verify: vi.fn().mockResolvedValue(null) };
    const guard = new AuthGuard(
      reflector as unknown as Reflector,
      sessionTokenService as unknown as SessionTokenService,
    );
    const context = createContext({ [SESSION_COOKIE_NAME]: 'garbage' });

    await expect(guard.canActivate(context)).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });

  it('allows a request with a valid session cookie and attaches the user', async () => {
    const reflector = { getAllAndOverride: vi.fn().mockReturnValue(false) };
    const sessionTokenService = {
      verify: vi.fn().mockResolvedValue({ username: 'admin' }),
    };
    const guard = new AuthGuard(
      reflector as unknown as Reflector,
      sessionTokenService as unknown as SessionTokenService,
    );
    const request: { cookies: Record<string, string>; user?: unknown } = {
      cookies: { [SESSION_COOKIE_NAME]: 'a-valid-token' },
    };
    const context = {
      getHandler: () => vi.fn(),
      getClass: () => vi.fn(),
      switchToHttp: () => ({ getRequest: () => request }),
    } as unknown as ExecutionContext;

    await expect(guard.canActivate(context)).resolves.toBe(true);
    expect(request.user).toEqual({ username: 'admin' });
  });
});
