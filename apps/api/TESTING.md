# Testing de la API

## Unitarios

- Framework: Vitest 4 y `@nestjs/testing`.
- Ubicación: junto al código bajo `src/`.
- Patrón: `**/*.spec.ts`.
- Configuración: `vitest.config.ts`.
- El test existente crea un `TestingModule` con el controller y service de health.

## E2E

- Framework: Vitest, Nest Testing y Supertest.
- Ubicación: `test/`.
- Patrón: `**/*.e2e-spec.ts`.
- Configuración: `vitest.config.e2e.ts`.
- La aplicación se crea, recibe `configureApp()` y se inicializa en cada test.

## Comandos

```bash
pnpm --filter @gestor-finanzas/api test
pnpm --filter @gestor-finanzas/api test:watch
pnpm --filter @gestor-finanzas/api test:e2e
pnpm --filter @gestor-finanzas/api test:cov
pnpm --filter @gestor-finanzas/api test:debug
```

`test` no incluye E2E. No hay mocks, fixtures, setup global, base de datos de pruebas ni umbrales de cobertura.

El E2E necesita permisos para escuchar en red local.

Vitest proporciona una `DATABASE_URL` sintácticamente válida para construir `AppModule`. Como el driver abre conexiones de forma diferida y el health check no consulta PostgreSQL, estos tests no requieren una base real. Los futuros tests de repositories deberán usar una base aislada y aplicar migraciones antes de ejecutarse.
