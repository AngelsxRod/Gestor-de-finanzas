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

`db:generate` crea migraciones en `drizzle/` a partir del esquema. Revisa el SQL generado antes de versionarlo. `db:migrate` y `db:studio` usan `DATABASE_URL`; nunca incluyas credenciales reales en Git.

## Responsabilidades

- `src/schema`: tablas, enums, índices, restricciones y tipos persistidos.
- `src/database.ts`: creación explícita de una conexión para consumidores.
- `drizzle/`: historial SQL generado y metadatos de migración.
- `drizzle.config.ts`: configuración exclusiva de Drizzle Kit.

El package no contiene controladores, reglas de negocio, contratos HTTP ni componentes React.
