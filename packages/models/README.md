# `@gestor-finanzas/models`

Package propietario de la persistencia PostgreSQL. Contiene el esquema Drizzle, tipos inferidos, fábrica de conexión y migraciones versionadas. Las aplicaciones consumen sus exports; no definen tablas ni ejecutan SQL de infraestructura por su cuenta.

## Comandos

Desde la raíz:

```bash
pnpm --filter @gestor-finanzas/models build
pnpm --filter @gestor-finanzas/models test
pnpm --filter @gestor-finanzas/models db:generate
pnpm --filter @gestor-finanzas/models db:check
pnpm --filter @gestor-finanzas/models db:migrate
pnpm --filter @gestor-finanzas/models db:studio
```

`db:generate` crea migraciones en `drizzle/` a partir del esquema. Revisa el SQL generado antes de versionarlo. `db:migrate` y `db:studio` usan `DATABASE_URL` del entorno o cargan el `.env` de la raíz; nunca incluyas credenciales reales en Git.

## Responsabilidades

- `src/schema`: tablas, enums, índices, restricciones y tipos persistidos.
- `src/database.ts`: creación explícita de una conexión para consumidores.
- `drizzle/`: historial SQL generado y metadatos de migración.
- `drizzle.config.ts`: configuración exclusiva de Drizzle Kit.

El package no contiene controladores, reglas de negocio, contratos HTTP ni componentes React. NestJS lo integra mediante `apps/api/src/modules/database`; otros consumidores deben crear y cerrar su propia conexión explícitamente.

## Modelo actual

- `accounts`: cuentas de efectivo, corriente, ahorro, crédito o inversión, con moneda, saldo de apertura y estado activo.
- `categories`: categorías diferenciadas por ingreso o gasto, con estado activo.
- `transactions`: ingresos, gastos y transferencias asociados a cuentas y, cuando corresponde, a una categoría, con estado activo.

PostgreSQL garantiza importes positivos, monedas con tres letras mayúsculas, referencias protegidas y la forma estructural de cada tipo de movimiento. La capa de servicios de la API valida las reglas que cruzan tablas, incluida la compatibilidad de moneda y categoría.
