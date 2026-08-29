import { defineConfig } from 'vitest/config';

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
    },
    globals: true,
    root: './',
    include: ['**/*.e2e-spec.ts'],
  },
});
