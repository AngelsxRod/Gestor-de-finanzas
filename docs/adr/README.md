# Registros de decisiones de arquitectura

Los ADR documentan decisiones técnicas duraderas, sus motivos y sus consecuencias. Complementan [`ARCHITECTURE.md`](../../ARCHITECTURE.md): la arquitectura describe el estado vigente; cada ADR explica por qué se eligió.

## Cuándo crear uno

Crea un ADR antes o junto con un cambio que afecte, entre otros:

- límites entre aplicaciones o packages;
- persistencia, migraciones o contratos públicos;
- autenticación, autorización o tratamiento de datos sensibles;
- dependencias estructurales o frameworks principales;
- estrategia de despliegue, observabilidad o CI/CD.

No uses ADRs para decisiones locales y fácilmente reversibles.

## Convención

Copia [`0000-template.md`](0000-template.md) con el siguiente número disponible y un nombre corto en kebab-case:

```text
0001-elegir-persistencia.md
```

Estados permitidos: `propuesto`, `aceptado`, `rechazado`, `obsoleto` o `reemplazado por ADR-NNNN`. Un ADR aceptado no se reescribe para ocultar cambios posteriores; crea otro que lo reemplace y enlaza ambos.

## Índice

- [ADR-0001: PostgreSQL y Drizzle en un package de modelos](0001-postgresql-drizzle-en-models.md) — aceptado.
