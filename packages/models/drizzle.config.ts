import { defineConfig } from 'drizzle-kit';

const databaseUrl =
  process.env.DATABASE_URL ??
  'postgres://gestor_finanzas:gestor_finanzas@127.0.0.1:5432/gestor_finanzas';

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/schema/index.ts',
  out: './drizzle',
  dbCredentials: {
    url: databaseUrl,
  },
  strict: true,
  verbose: true,
});
