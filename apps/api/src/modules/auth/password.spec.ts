import { describe, expect, it } from 'vitest';
import { hashPassword, verifyPassword } from './password.js';

describe('password', () => {
  it('hashes and verifies the same password', () => {
    const encoded = hashPassword('correct horse battery staple');

    expect(verifyPassword('correct horse battery staple', encoded)).toBe(
      true,
    );
  });

  it('rejects a wrong password', () => {
    const encoded = hashPassword('correct horse battery staple');

    expect(verifyPassword('wrong password', encoded)).toBe(false);
  });

  it('produces a different salt (and encoding) each time', () => {
    const first = hashPassword('same password');
    const second = hashPassword('same password');

    expect(first).not.toEqual(second);
    expect(verifyPassword('same password', first)).toBe(true);
    expect(verifyPassword('same password', second)).toBe(true);
  });

  it('rejects a malformed encoded hash instead of throwing', () => {
    expect(verifyPassword('anything', 'not-a-valid-hash')).toBe(false);
    expect(verifyPassword('anything', 'scrypt:16384:8:1:zz:zz')).toBe(false);
    expect(verifyPassword('anything', '')).toBe(false);
  });

  it('rejects a hash encoded with different scrypt parameters', () => {
    const encoded = hashPassword('correct horse battery staple');
    const tampered = encoded.replace(/^scrypt:16384:/, 'scrypt:1024:');

    expect(verifyPassword('correct horse battery staple', tampered)).toBe(
      false,
    );
  });
});
