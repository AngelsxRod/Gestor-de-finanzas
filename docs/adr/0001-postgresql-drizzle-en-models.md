# ADR-0001: PostgreSQL y Drizzle en un package de modelos

- Estado: aceptado
- Fecha: 2026-08-28
- Responsables: mantenedores del proyecto

## Contexto

El primer flujo financiero necesita persistir cuentas, categorías y movimientos. La aplicación será self-hosted y su arquitectura ya separa la web, la API y los packages compartidos. Las migraciones y el esquema no deben quedar acoplados al ciclo de vida de NestJS ni duplicarse entre consumidores.

Los importes monetarios requieren precisión decimal, integridad referencial y restricciones que sobrevivan a errores de aplicación. El despliegue futuro también necesita migraciones versionadas y una base preparada para copias de seguridad.

## Opciones consideradas

1. SQLite dentro de la API: operación local sencilla, pero menos apropiada para acceso concurrente y una futura instalación accesible desde varios dispositivos.
2. PostgreSQL y Drizzle dentro de `apps/api`: implementación directa, pero convierte a NestJS en propietario de artefactos que pueden reutilizar tareas de migración u otros procesos.
3. PostgreSQL y Drizzle en `packages/models`: conserva esquema, conexión y migraciones en un límite independiente, con tipos inferidos compartibles y SQL revisable.

## Decisión

Usar PostgreSQL 18 y Drizzle ORM en `packages/models`, publicado internamente como `@gestor-finanzas/models`.

El package es propietario de tablas, enums, índices, restricciones, tipos persistidos, creación de conexiones y migraciones SQL versionadas. La API consumirá el package para implementar repositories y casos de uso, pero será propietaria de las reglas de negocio y del ciclo de vida de la conexión. Los contratos HTTP continuarán en `packages/contracts`.

El primer modelo usa `numeric(19,4)` como texto en TypeScript para evitar pérdida de precisión. Una transacción representa un ingreso, gasto o transferencia. Las transferencias entre monedas distintas y la contabilidad de partida doble quedan fuera del MVP y requieren una nueva decisión antes de implementarse.

## Consecuencias

- PostgreSQL pasa a ser un requisito de ejecución para las funciones financieras.
- Los cambios de esquema se generan mediante `db:generate`, se revisan como SQL y se aplican con `db:migrate`.
- El desarrollo local dispone de PostgreSQL enlazado exclusivamente a `127.0.0.1`.
- Ninguna aplicación debe definir tablas Drizzle o editar migraciones ya aplicadas.
- Los servicios deben validar que categoría y moneda coincidan con el movimiento; estas reglas cruzan tablas y no están completamente expresadas por la primera migración.
- Los timestamps `updated_at` se actualizan explícitamente desde la capa que persiste cambios.

## Referencias

- [`packages/models/README.md`](../../packages/models/README.md)
- [`ARCHITECTURE.md`](../../ARCHITECTURE.md)
- [`SECURITY.md`](../../SECURITY.md)
