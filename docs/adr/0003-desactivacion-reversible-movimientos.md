# ADR-0003: Desactivación reversible también para movimientos

- Estado: aceptado
- Fecha: 2026-08-29
- Responsables: mantenedores del proyecto

## Contexto

[ADR-0002](0002-soft-delete-simetrico-cuentas-categorias.md) adoptó la desactivación reversible en vez del borrado físico para cuentas y categorías, motivada por una restricción técnica concreta: `transactions` las referencia con `ON DELETE restrict`, así que borrarlas físicamente rompería en cuanto existieran movimientos.

Esa restricción no aplica a `transactions` en sí: ninguna tabla la referencia, así que borrar físicamente un movimiento es técnicamente seguro. Aun así, el módulo de movimientos necesita una acción de "eliminar" en su interfaz (columna de Acciones: editar y eliminar), y hay que decidir si esa acción borra el registro para siempre o lo oculta de forma reversible.

## Opciones consideradas

1. Borrado físico (`DELETE`) para movimientos: técnicamente seguro al no tener dependientes, pero irreversible; un movimiento borrado por error (fecha, monto o cuenta equivocados) pierde su historial sin posibilidad de deshacerlo ni de auditarlo después.
2. Desactivación reversible (`isActive`), igual que cuentas y categorías: mantiene una única semántica de "eliminar" en toda la aplicación y dos beneficios que el borrado físico no da: reversibilidad ante errores de captura y conservación del historial para una futura auditoría o reportes, aun cuando hoy no se exploten.

## Decisión

Se adopta la opción 2. `transactions` gana una columna `is_active` (`boolean`, `not null`, `default true`) simétrica a `accounts` y `categories`, agregada mediante una migración nueva (`drizzle/0002_mysterious_lord_hawal.sql`) generada con `db:generate`.

La API expone `PATCH /api/v1/transactions/:id/active` (body `{ isActive: boolean }`) como la única operación de "eliminar/restaurar" un movimiento. No existe ni existirá un endpoint `DELETE` público mientras esta decisión no se revierta explícitamente.

`PATCH /api/v1/transactions/:id` reemplaza los campos editables (mismo shape que `POST`) y vuelve a validar las mismas reglas de negocio que la creación: cuenta y categoría activas, tipo de categoría coherente, monedas coincidentes en una transferencia. Si el movimiento editado referencia una cuenta o categoría que fue desactivada después de crearlo, la edición falla con el mismo error de negocio que tendría una creación nueva, salvo que el usuario también corrija esa referencia como parte de la edición.

## Consecuencias

- "Eliminar" tiene la misma semántica reversible en los tres módulos financieros: desactivar oculta el movimiento sin perder su historial; "Reactivar" lo restaura.
- La interfaz debe seguir mostrando un movimiento inactivo y sus cuentas/categorías relacionadas aunque estén desactivadas (para no romper el historial ni el formulario de edición), distinguiéndolo con una insignia de estado — mismo patrón que `AccountsTable`/`CategoriesTable`.
- Editar un movimiento cuya cuenta o categoría fue desactivada después de crearlo puede fallar hasta que el usuario también actualice esa referencia; es una consecuencia esperada de reutilizar las mismas reglas de negocio que la creación, no un caso especial.
- Cualquier necesidad real de borrado físico de movimientos (por ejemplo, cumplimiento de borrado de datos) requiere una nueva decisión y no debe añadirse ad hoc a este endpoint.

## Referencias

- [`ADR-0002`](0002-soft-delete-simetrico-cuentas-categorias.md)
- [`packages/models/README.md`](../../packages/models/README.md)
- [`apps/web/DESIGN.md`](../../apps/web/DESIGN.md)
