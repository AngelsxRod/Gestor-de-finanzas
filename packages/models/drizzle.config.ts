import { defineConfig } from 'drizzle-kit';
import { existsSync } from 'node:fs';
import { loadEnvFile } from 'node:process';
import { fileURLToPath } from 'node:url';

const rootEnvPath = fileURLToPath(new URL('../../.env', import.meta.url));

if (!process.env.DATABASE_URL && existsSync(rootEnvPath)) {
  loadEnvFile(rootEnvPath);
}

const databaseUrl =
  process.env.DATABASE_URL ??
  'postgres://gestor_finanzas:gestor_finanzas_local@127.0.0.1:55432/gestor_finanzas';

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
