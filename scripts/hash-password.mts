// Genera el valor de ADMIN_PASSWORD_HASH para .env/.env.production.
// Uso: node scripts/hash-password.mts <contraseña>
//
// Corre directo con `node` gracias al soporte nativo de TypeScript de
// Node 24 — sin build. No importa apps/api/src/modules/auth/password.ts
// porque ese módulo se ejecuta compilado (dist/), no como fuente; el
// codificado scrypt de abajo debe coincidir exactamente con el de ese
// archivo si alguno de los dos cambia.

import { randomBytes, scryptSync } from 'node:crypto';

const SCRYPT_N = 16384;
const SCRYPT_R = 8;
const SCRYPT_P = 1;
const KEY_LENGTH = 64;

function hashPassword(password: string): string {
  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, KEY_LENGTH, {
    N: SCRYPT_N,
    r: SCRYPT_R,
    p: SCRYPT_P,
    maxmem: 128 * SCRYPT_N * SCRYPT_R * 2,
  });

  return `scrypt:${SCRYPT_N}:${SCRYPT_R}:${SCRYPT_P}:${salt.toString('hex')}:${hash.toString('hex')}`;
}

const password = process.argv[2];

if (!password) {
  console.error('Uso: node scripts/hash-password.mts <contraseña>');
  process.exit(1);
}

console.log(hashPassword(password));
