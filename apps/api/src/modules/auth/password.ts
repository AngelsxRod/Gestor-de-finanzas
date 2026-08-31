import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

const SCRYPT_N = 16384;
const SCRYPT_R = 8;
const SCRYPT_P = 1;
const KEY_LENGTH = 64;

function scrypt(password: string, salt: Buffer): Buffer {
  return scryptSync(password, salt, KEY_LENGTH, {
    N: SCRYPT_N,
    r: SCRYPT_R,
    p: SCRYPT_P,
    maxmem: 128 * SCRYPT_N * SCRYPT_R * 2,
  });
}

/**
 * Encodes as `scrypt:N:r:p:<saltHex>:<hashHex>` so verification never
 * depends on parameters hardcoded anywhere other than this file.
 */
export function hashPassword(password: string): string {
  const salt = randomBytes(16);
  const hash = scrypt(password, salt);

  return `scrypt:${SCRYPT_N}:${SCRYPT_R}:${SCRYPT_P}:${salt.toString('hex')}:${hash.toString('hex')}`;
}

export function verifyPassword(password: string, encoded: string): boolean {
  const parts = encoded.split(':');

  if (parts.length !== 6 || parts[0] !== 'scrypt') {
    return false;
  }

  const [, n, r, p, saltHex, hashHex] = parts as [
    string,
    string,
    string,
    string,
    string,
    string,
  ];

  if (
    Number(n) !== SCRYPT_N ||
    Number(r) !== SCRYPT_R ||
    Number(p) !== SCRYPT_P
  ) {
    return false;
  }

  const salt = Buffer.from(saltHex, 'hex');
  const expected = Buffer.from(hashHex, 'hex');

  if (salt.length === 0 || expected.length !== KEY_LENGTH) {
    return false;
  }

  const actual = scrypt(password, salt);

  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
