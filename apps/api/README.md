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

## Estado

La API expone `GET /api/v1/health`, organizado dentro de `HealthModule`. La respuesta se construye con el contrato Zod de `@gestor-finanzas/contracts` y la web la consume mediante el rewrite de Next.js.

La aplicación registra un prefijo versionado y `StandardSchemaValidationPipe`. No hay persistencia, autenticación ni autorización.

## Documentación local

- [AGENTS.md](AGENTS.md)
- [STYLEGUIDE.md](STYLEGUIDE.md)
- [TESTING.md](TESTING.md)
- [SECURITY.md](SECURITY.md)

Para la arquitectura general consulta [`ARCHITECTURE.md`](../../ARCHITECTURE.md) en la raíz.
