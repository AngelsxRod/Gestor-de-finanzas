# @gestor-finanzas/api

API local del monorepo, construida con NestJS 12 y Express.

## Comandos

Desde la raíz:

```bash
pnpm dev:api
pnpm --filter @gestor-finanzas/api lint
pnpm --filter @gestor-finanzas/api test
pnpm --filter @gestor-finanzas/api test:e2e
pnpm --filter @gestor-finanzas/api test:cov
pnpm --filter @gestor-finanzas/api build
pnpm --filter @gestor-finanzas/api start:prod
```

## Configuración

- `HOST`: `127.0.0.1` por defecto.
- `PORT`: `3211` por defecto.
- `DATABASE_URL`: obligatoria y validada como una URL PostgreSQL.

Copia `.env.example` de la raíz a `.env` y levanta la base de desarrollo con `docker compose -f compose.dev.yaml up -d --wait`.

## Estado

La API expone `GET /api/v1/health`, `GET /api/v1/accounts`, `POST /api/v1/accounts`, `PATCH /api/v1/accounts/:id`, `PATCH /api/v1/accounts/:id/active`, `GET /api/v1/categories`, `POST /api/v1/categories`, `PATCH /api/v1/categories/:id` y `PATCH /api/v1/categories/:id/active`. Las peticiones y respuestas públicas usan contratos Zod de `@gestor-finanzas/contracts`; la web las consume mediante el rewrite de Next.js. Los endpoints `/active` son la única forma de "eliminar": desactivan o reactivan el registro (ver [ADR-0002](../../docs/adr/0002-soft-delete-simetrico-cuentas-categorias.md)); no existe borrado físico público.

La aplicación registra un prefijo versionado, `StandardSchemaValidationPipe` y un `DatabaseModule` global. `DatabaseService` expone el cliente tipado de `@gestor-finanzas/models` y lo cierra durante el apagado. `AccountsModule` y `CategoriesModule` implementan cada uno su controller, servicio y repository; los movimientos todavía no tienen comportamiento. No hay autenticación ni autorización.

## Documentación local

- [AGENTS.md](AGENTS.md)
- [STYLEGUIDE.md](STYLEGUIDE.md)
- [TESTING.md](TESTING.md)
- [SECURITY.md](SECURITY.md)

Para la arquitectura general consulta [`ARCHITECTURE.md`](../../ARCHITECTURE.md) en la raíz.
