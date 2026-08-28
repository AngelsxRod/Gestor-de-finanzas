# Contribuir

Este proyecto usa pnpm, Turborepo y TypeScript estricto. Antes de cambiar código, lee [`AGENTS.md`](AGENTS.md) y la documentación local del workspace afectado.

## Flujo de trabajo

1. Parte de `main` actualizada y crea una rama corta.
2. Limita cada cambio a un objetivo verificable.
3. Respeta los límites descritos en [`ARCHITECTURE.md`](ARCHITECTURE.md).
4. Añade o actualiza tests y documentación cuando cambie el comportamiento.
5. Ejecuta las comprobaciones aplicables de [`TESTING.md`](TESTING.md).
6. Revisa `git diff --check` y el diff completo antes de abrir el PR.

No mezcles refactors, cambios de formato o dependencias que no sean necesarios para el objetivo del PR.

## Ramas

Usa nombres en minúsculas, separados por guiones y con un prefijo descriptivo:

```text
feat/presupuestos-mensuales
fix/calculo-saldo
docs/flujo-de-despliegue
refactor/contratos-health
chore/actualizar-dependencias
```

No hagas push directo a `main` cuando exista más de una persona colaborando. Elimina la rama después de integrar el PR.

## Commits

Los mensajes siguen Conventional Commits:

```text
<tipo>(<alcance opcional>): <descripción imperativa>
```

Tipos permitidos:

- `feat`: funcionalidad observable nueva.
- `fix`: corrección de un defecto.
- `docs`: solo documentación.
- `test`: tests sin cambio funcional.
- `refactor`: cambio interno sin nueva funcionalidad ni corrección.
- `perf`: mejora de rendimiento.
- `style`: formato sin cambio de comportamiento.
- `build`: build o dependencias.
- `ci`: automatización de integración o despliegue.
- `chore`: mantenimiento que no encaja en los anteriores.
- `revert`: reversión explícita de otro commit.

Usa como alcance el workspace o dominio afectado (`web`, `api`, `contracts`, `ui`, `repo`). La descripción debe ir en minúsculas, ser concreta, no terminar en punto y preferiblemente no superar 72 caracteres.

Ejemplos:

```text
feat(web): agrega formulario de presupuesto
fix(api): valida el límite mensual
docs(repo): documenta el flujo de contribución
```

Un cambio incompatible añade `!` después del tipo o alcance y explica la migración en un pie `BREAKING CHANGE:`. No uses `WIP`, mensajes genéricos como `changes` ni commits que mezclen objetivos independientes.

## Estilo y arquitectura

- Sigue [`STYLEGUIDE.md`](STYLEGUIDE.md) y la guía local de la app.
- Mantén contratos HTTP en `packages/contracts` y primitivas visuales reutilizables en `packages/ui`.
- No importes archivos internos entre `apps/web` y `apps/api`.
- Registra decisiones estructurales duraderas mediante un ADR en [`docs/adr`](docs/adr/README.md).
- No añadas una dependencia sin justificar por qué las herramientas actuales no resuelven el problema.

## Tests y calidad

Como mínimo, ejecuta los checks del workspace modificado. Para cambios transversales:

```bash
pnpm lint
pnpm test
pnpm build
git diff --check
```

El E2E de la API y Storybook tienen requisitos adicionales descritos en [`TESTING.md`](TESTING.md). Si una comprobación no puede ejecutarse por una restricción del entorno, indícalo en el PR junto con la causa exacta.

## Pull requests

Cada PR debe incluir:

- el problema y la solución propuesta;
- el alcance y los archivos o workspaces relevantes;
- los comandos de validación ejecutados y sus resultados;
- capturas o grabaciones para cambios visuales;
- riesgos, migración y forma de revertir cuando corresponda;
- referencia al issue, roadmap o ADR relacionado.

Solicita una revisión enfocada, responde los comentarios y conserva un historial entendible. Antes de integrar, todos los checks exigidos deben pasar y la documentación debe reflejar el comportamiento final.
