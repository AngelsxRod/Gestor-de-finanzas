# Testing de la API

## Unitarios

- Framework: Vitest 4 y `@nestjs/testing`.
- Ubicación: junto al código bajo `src/`.
- Patrón: `**/*.spec.ts`.
- Configuración: `vitest.config.ts`.
- Los tests existentes cubren health, configuración, conexión y controller/service de cuentas y categorías con dependencias aisladas.

## E2E

- Framework: Vitest, Nest Testing y Supertest.
- Ubicación: `test/`.
- Patrón: `**/*.e2e-spec.ts`.
- Configuración: `vitest.config.e2e.ts`.
- La aplicación se crea, recibe `configureApp()` y se inicializa en cada test.

## Comandos

```bash
pnpm --filter @gestor-finanzas/api test
pnpm --filter @gestor-finanzas/api test:integration
pnpm --filter @gestor-finanzas/api test:watch
pnpm --filter @gestor-finanzas/api test:e2e
pnpm --filter @gestor-finanzas/api test:cov
pnpm --filter @gestor-finanzas/api test:debug
```

`test` no incluye integración ni E2E. No hay fixtures, setup global ni umbrales de cobertura.

El E2E necesita permisos para escuchar en red local.

Los unitarios no requieren una base real. `test:integration` prueba `AccountsRepository` y `CategoriesRepository`, y los E2E prueban health, cuentas y categorías contra PostgreSQL. Ambos requieren `DATABASE_URL` apuntando a una base migrada cuyo nombre termine en `_test`; limpian `accounts` y `categories` y nunca deben ejecutarse contra desarrollo o producción.
