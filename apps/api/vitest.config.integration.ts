import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    globals: true,
    root: './',
    include: ['**/*.integration-spec.ts'],
    // Transactions reference accounts and categories, so its spec shares
    // those tables with their own specs: files must not run concurrently
    // against the same database.
    fileParallelism: false,
  },
});
