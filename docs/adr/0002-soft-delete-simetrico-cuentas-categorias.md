# ADR-0002: Desactivación reversible en vez de borrado físico para cuentas y categorías

- Estado: aceptado
- Fecha: 2026-08-29
- Responsables: mantenedores del proyecto

## Contexto

Se agregó edición y eliminación desde la interfaz web para cuentas y categorías. La tabla `accounts` ya tenía una columna `is_active` desde el primer modelo, pero `categories` no. La tabla `transactions` (definida en el esquema desde el inicio, aunque su API y su interfaz todavía no existen) referencia `accounts` y `categories` con claves foráneas `ON DELETE restrict`: un borrado físico de una cuenta o categoría referenciada por movimientos fallaría con un error de PostgreSQL sin traducir, o exigiría lógica adicional en cada capa para convertirlo en un error público coherente.

Además, borrar físicamente una cuenta o categoría destruye su historial de forma irreversible, mientras que el caso de uso real ("ya no quiero ver esta cuenta en el formulario de nuevos movimientos") es de ocultamiento, no de destrucción de datos.

## Opciones consideradas

1. Borrado físico (`DELETE`) en ambos módulos: simple hoy, pero irreversible y roto en cuanto exista el módulo de movimientos (violaría la restricción `ON DELETE restrict`).
2. Mantener `accounts` con `isActive` y agregar borrado físico solo a `categories`: evita una migración nueva, pero introduce dos semánticas distintas de "Eliminar" en la misma aplicación y el mismo problema futuro con `categories`.
3. Agregar `isActive` a `categories` (nueva migración) y exponer "desactivar/reactivar" como la única forma pública de "eliminar" en ambos módulos, nunca un `DELETE` físico.

## Decisión

Se adopta la opción 3. `categories` gana una columna `is_active` (`boolean`, `not null`, `default true`) simétrica a `accounts`, agregada mediante una migración nueva (`drizzle/0001_bumpy_doctor_doom.sql`) generada con `db:generate`, sin editar la migración inicial.

La API expone `PATCH /api/v1/accounts/:id/active` y `PATCH /api/v1/categories/:id/active` (body `{ isActive: boolean }`) como la única operación de "eliminar/restaurar". No existe ni existirá un endpoint `DELETE` público para estos recursos mientras `transactions` pueda referenciarlos.

## Consecuencias

- "Eliminar" en la interfaz es siempre reversible: desactivar oculta el registro de los flujos de alta de nuevos movimientos sin perder su historial; "Reactivar" lo restaura.
- Cuando se implemente el módulo de movimientos, no hará falta manejar cuentas o categorías borradas a mitad de camino: siempre existen, solo pueden estar inactivas.
- Los endpoints de edición (`PATCH /:id`) reemplazan todos los campos editables (mismo shape que la creación); el estado `isActive` se administra exclusivamente por el endpoint `/active`, nunca por el de edición.
- Cualquier futura necesidad real de borrado físico (por ejemplo, cumplimiento de borrado de datos) requiere una nueva decisión y no debe añadirse ad hoc a estos endpoints.

## Referencias

- [`packages/models/README.md`](../../packages/models/README.md)
- [`ADR-0001: PostgreSQL y Drizzle en un package de modelos`](0001-postgresql-drizzle-en-models.md)
- [`apps/web/DESIGN.md`](../../apps/web/DESIGN.md)
