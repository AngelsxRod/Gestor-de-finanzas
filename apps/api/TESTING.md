# Testing de la API

## Unitarios

- Framework: Vitest 4 y `@nestjs/testing`.
- Ubicación: junto al código bajo `src/`.
- Patrón: `**/*.spec.ts`.
- Configuración: `vitest.config.ts`.
- Los tests existentes cubren health, configuración, conexión y controller/service de cuentas, categorías, movimientos y presupuestos con dependencias aisladas.

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

Los unitarios no requieren una base real. `test:integration` prueba `AccountsRepository`, `CategoriesRepository`, `TransactionsRepository` (incluidos el cálculo de saldos y los filtros de consulta) y `BudgetsRepository` (incluido el cálculo de gasto mensual), y los E2E prueban health, cuentas, categorías, movimientos (creación, edición, desactivación, saldos y filtros) y presupuestos (creación, edición, desactivación y el resumen mensual con gasto y restante) contra PostgreSQL. Ambos requieren `DATABASE_URL` apuntando a una base migrada cuyo nombre termine en `_test`; limpian `budgets`, `transactions`, `categories` y `accounts` (en ese orden, por las claves foráneas) y nunca deben ejecutarse contra desarrollo o producción. Como el spec de movimientos comparte las tablas `accounts` y `categories` con sus propios specs, y el de presupuestos comparte además `transactions`, `test:integration` corre los archivos en serie (`fileParallelism: false`) para evitar condiciones de carrera entre ellos.
