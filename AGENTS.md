# Instrucciones para agentes

Este archivo es el punto de entrada para cualquier agente que trabaje en el repositorio. Sus reglas se aplican a todo el monorepo. Las instrucciones más específicas de un workspace tienen prioridad dentro de ese directorio.

## Orientación rápida

El repositorio usa pnpm 11.18.0, workspaces declarados en `pnpm-workspace.yaml` y Turborepo 2.10.12 para coordinar tareas. No usa Nx ni otro coordinador adicional.

| Ruta | Responsabilidad observada |
| --- | --- |
| `apps/web` | Aplicación Next.js 16 organizada por features, con React Query, Axios, React Hook Form, Zod y Tailwind CSS 4. |
| `apps/api` | Aplicación NestJS 12 organizada por feature modules. Expone el health check versionado. |
| `packages/contracts` | Contratos HTTP compartidos mediante esquemas Zod y tipos inferidos. |
| `packages/models` | Esquema Drizzle, conexión y migraciones PostgreSQL. No contiene reglas de negocio. |
| `packages/ui` | Primitivas React compartidas organizadas con Atomic Design. |
| `packages/api-client` | Marcador vacío para un futuro cliente de API. No contiene código ni genera contratos. |
| `packages/tooling` | Marcador vacío para futura configuración compartida. |
| `docs/architecture.md` | Documento de planificación futura; no describe por sí solo funcionalidad ya construida. |

La web consume `contracts` y `ui`; la API consume `contracts`. `models` es propietario de la persistencia y será consumido por la API. `api-client` y `tooling` siguen sin consumidores.

## Qué leer antes de cambiar algo

- UI, estilos, accesibilidad o experiencia en `apps/web`: `apps/web/AGENTS.md`, `apps/web/DESIGN.md` y `apps/web/STYLEGUIDE.md`.
- Estructura, límites entre apps o nuevos paquetes: [ARCHITECTURE.md](ARCHITECTURE.md).
- Flujo de ramas, commits y pull requests: [CONTRIBUTING.md](CONTRIBUTING.md).
- Decisiones técnicas duraderas: [`docs/adr/README.md`](docs/adr/README.md).
- Esquema o migraciones: `packages/models/README.md` y el ADR vigente.
- Código TypeScript o React: `apps/web/STYLEGUIDE.md`.
- Código NestJS: `apps/api/AGENTS.md` y `apps/api/STYLEGUIDE.md`.
- Tests de API: `apps/api/TESTING.md`. Para la ejecución transversal, [TESTING.md](TESTING.md).
- Telemetría o configuración de seguridad de la API: `apps/api/SECURITY.md`. Para reglas transversales, [SECURITY.md](SECURITY.md).
- Contenedores o despliegue self-hosted: [DEPLOYMENT.md](DEPLOYMENT.md).
- Comandos y puesta en marcha: [README.md](README.md).

Antes de modificar Next.js, lee la guía relevante en `apps/web/node_modules/next/dist/docs/`, tal como exige `apps/web/AGENTS.md`. Esa instrucción es generada por Next.js y no debe eliminarse.

## Flujo obligatorio de trabajo

1. Identifica el workspace afectado mediante su ruta y su `package.json`.
2. Lee su configuración local (`tsconfig*`, lint, format, tests y framework) antes de editar.
3. Busca consumidores e imports antes de cambiar nombres o interfaces compartidas.
4. Mantén el cambio dentro del workspace salvo que exista una necesidad demostrable de compartir código.
5. Ejecuta las comprobaciones disponibles para el workspace afectado.
6. Revisa `git diff --check` y el diff final; no mezcles cambios ajenos.

## Comandos existentes

Desde la raíz:

```bash
pnpm dev
pnpm dev:web
pnpm dev:api
pnpm build
pnpm lint
pnpm test
```

Los scripts raíz delegan en Turborepo. `pnpm dev` ejecuta las tareas persistentes `dev` de la web y la API en paralelo. `pnpm test` alcanza a la API, `packages/contracts`, `packages/models` y las stories de la web.

Para comandos propios de la API:

```bash
pnpm --filter @gestor-finanzas/api test
pnpm --filter @gestor-finanzas/api test:e2e
pnpm --filter @gestor-finanzas/api test:cov
pnpm --filter @gestor-finanzas/api build
pnpm --filter @gestor-finanzas/api lint
```

Para la web:

```bash
pnpm --filter @gestor-finanzas/web build
pnpm --filter @gestor-finanzas/web lint
```

No existe un script `typecheck` global ni por workspace. No documentes uno como si existiera.

## Criterio de finalización

- Cambios solo en documentación: comprueba enlaces, rutas, comandos citados y `git diff --check`.
- Cambios en `apps/web`: ejecuta al menos su lint y, si el entorno tiene acceso a Google Fonts, su build.
- Cambios en `apps/api`: ejecuta lint, tests unitarios y build. Ejecuta E2E cuando el entorno permita abrir un listener local.
- Cambios transversales: ejecuta los scripts raíz aplicables y las comprobaciones particulares de cada workspace afectado.

El build actual de la web descarga Geist desde Google Fonts. Puede fallar en entornos sin red aunque el código compile. Consulta [TESTING.md](TESTING.md) antes de interpretar ese fallo.

## Archivos que requieren cuidado

- No edites `node_modules/`, `.next/`, `dist/`, `coverage/` ni `*.tsbuildinfo`; son artefactos o dependencias generadas.
- No cambies `pnpm-lock.yaml` si no cambia ninguna dependencia. Es el único lockfile del monorepo.
- No edites `.turbo/`; contiene caché y logs generados.
- No publiques directamente los puertos de API o PostgreSQL en producción ni uses credenciales de los archivos de ejemplo.
- No borres ni reescribas el bloque generado de `apps/web/AGENTS.md`.
- No conviertas `packages/api-client` o `packages/tooling` en dependencias reales sin añadir manifiestos, exports, uso comprobable y documentación coherente.
- Mantén `packages/contracts` libre de lógica de negocio, React y transporte HTTP.
- Mantén tablas, conexión y migraciones en `packages/models`; no edites migraciones ya aplicadas.
- Mantén atoms y molecules reutilizables en `packages/ui`; los organisms ligados al dominio pertenecen a la feature web correspondiente.
- Mantén templates sin acceso a datos dentro de la feature y pages dentro de App Router. Verifica cambios visuales con `pnpm test:storybook`.
- No copies código interno de una app a otra para simular una dependencia compartida.
- No introduzcas herramientas nuevas para tareas que ya cubren ESLint, Oxlint, Prettier, Vitest, Nest CLI, Next CLI o pnpm.

## Convenciones globales y locales

- Global: TypeScript estricto, paquetes privados, pnpm, Turborepo y separación entre `apps/*` y `packages/*`.
- Solo web: ESLint, comillas dobles, App Router, features, Tailwind, React Query para estado servidor cliente y alias `@/*`.
- Solo API: Oxlint, Prettier con comillas simples, feature modules, NodeNext y extensiones `.js` en imports relativos.
- Compartido: Zod define contratos HTTP en `packages/contracts`; `packages/ui` no conoce features ni formularios concretos.
- No existe configuración compartida efectiva: `packages/tooling` es solo un marcador.

Si una práctica no está descrita en la configuración o repetida en el código, trátala como `No determinado a partir del repositorio actual` en vez de convertirla en regla.
