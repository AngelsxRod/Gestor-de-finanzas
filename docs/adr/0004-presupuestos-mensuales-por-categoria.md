# ADR-0004: Presupuestos mensuales por categoría con gasto calculado

- Estado: aceptado
- Fecha: 2026-08-31
- Responsables: mantenedores del proyecto

## Contexto

El siguiente flujo del roadmap es "presupuestos y resúmenes mensuales": permitir
definir un límite de gasto y compararlo contra lo realmente gastado. Esto
introduce una tabla nueva (`budgets`) y requiere decidir cuatro cosas que no
tienen un precedente directo en el modelo actual: a qué se asocia un
presupuesto, qué representa el "mes", si necesita moneda propia, y si el
gasto real se guarda o se calcula.

## Opciones consideradas

1. **Alcance del presupuesto**: por cuenta, por categoría, o ambos. Un
   presupuesto por cuenta mezclaría distintos tipos de gasto bajo un mismo
   límite; por categoría es el concepto habitual de presupuestación ("no
   gastar más de X en Alimentación este mes") y solo tiene sentido para
   categorías de tipo `expense` (las de `income` no se "limitan"). Se elige
   **por categoría de gasto**.
2. **Representación del mes**: enteros separados de año/mes, un rango de
   fechas, o una columna `date` fijada al día 1. Un `date` reutiliza el tipo
   ya usado en `occurredAt`/`createdAt`, permite un índice único simple
   `(category_id, month)` y un `CHECK` (`date_trunc('month', month) =
   month`) que impide guardar cualquier día que no sea el primero. Se elige
   **`date` fijado al día 1**, expuesto en el contrato HTTP como `"YYYY-MM"`
   (coincide exactamente con `<input type="month">`, sin conversión extra).
3. **Moneda del presupuesto**: derivarla de alguna cuenta, o pedirla
   explícita. Las categorías no tienen moneda propia (una categoría de gasto
   puede usarse desde cuentas de distintas monedas) y una cuenta no es un
   dato del presupuesto. Se elige pedirla **explícita**, igual que
   `accounts.currency`, y comparar el gasto solo contra movimientos de esa
   misma moneda.
4. **Origen del "gastado"**: guardarlo en la tabla y actualizarlo cuando se
   crean/editan/desactivan movimientos, o calcularlo en cada consulta. Guardarlo
   duplica el dato de `transactions` y arriesga desincronización si un
   movimiento cambia por una vía que olvide actualizarlo. Se elige
   **calcularlo siempre en la consulta**, con el mismo criterio ya usado para
   el saldo de cuentas: SQL con `numeric`, nunca aritmética de punto
   flotante en JavaScript.

## Decisión

Se agrega `budgets` (`categoryId`, `month` como `date`, `currency`,
`limitAmount`, `isActive`, timestamps) con un índice único
`budgets_category_month_unique` sobre `(category_id, month)` — un
presupuesto por categoría y mes, sin excluir filas inactivas (mismo criterio
que `accounts_name_unique`: reactivar en vez de duplicar).

La API valida en `BudgetsService` que la categoría exista, esté activa y sea
de tipo `expense` (mismo patrón que `TransactionsService` con cuentas y
categorías). `GET /api/v1/budgets` exige el query param `month` y devuelve,
por cada presupuesto de ese mes, `spent` (suma de movimientos de gasto
activos, de la misma categoría y moneda, ocurridos en ese mes) y `remaining`
(`limitAmount - spent`), ambos calculados en SQL. La edición reemplaza todos
los campos editables revalidando las mismas reglas que la creación, y
`PATCH /:id/active` es la única forma de "eliminar" (reversible, mismo
patrón que ADR-0002/ADR-0003).

## Consecuencias

- Un presupuesto sin movimientos en su mes muestra `spent = "0.0000"` y
  `remaining` igual al límite; no hay estado "sin datos" que distinguir.
- Si una categoría se reclasifica de gasto a ingreso, sus presupuestos
  existentes no se tocan automáticamente, pero no podrá crearse ni editarse
  ningún presupuesto nuevo contra ella mientras no sea de tipo `expense`.
- Cambiar la moneda de un presupuesto después de creado no reclasifica el
  historial: solo cuenta como "gastado" lo que coincida con la moneda
  vigente en el momento de la consulta.
- Cualquier necesidad futura de presupuestos que crucen categorías (por
  ejemplo, un límite total mensual) requiere una nueva decisión y no debe
  añadirse ad hoc a `budgets`.

## Referencias

- [`ADR-0002`](0002-soft-delete-simetrico-cuentas-categorias.md)
- [`ADR-0003`](0003-desactivacion-reversible-movimientos.md)
- [`packages/models/README.md`](../../packages/models/README.md)
