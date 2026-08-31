import { defineConfig } from 'vitest/config';
import { hashPassword } from './src/modules/auth/password.js';

// Kept in sync with the constants of the same name in
// test/app.e2e-spec.ts. Setting these via Vitest's `test.env` (rather than
// as a `process.env` assignment inside the spec file) is required: Nest's
// ConfigModule reads the real .env files as soon as AppModule is imported,
// which happens before any of the spec file's own top-level code runs.
export const TEST_ADMIN_USERNAME = 'e2e-admin';
export const TEST_ADMIN_PASSWORD = 'e2e-admin-password';

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    env: {
      DATABASE_URL:
        process.env.DATABASE_URL ??
        'postgres://test:test@127.0.0.1:5432/gestor_finanzas_test',
      NODE_ENV: 'test',
      ADMIN_USERNAME: TEST_ADMIN_USERNAME,
      ADMIN_PASSWORD_HASH: hashPassword(TEST_ADMIN_PASSWORD),
      SESSION_SECRET: 'e2e-test-session-secret-do-not-reuse-it',
    },
    globals: true,
    root: './',
    include: ['**/*.e2e-spec.ts'],
  },
});
