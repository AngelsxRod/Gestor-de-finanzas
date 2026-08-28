# Gestor de finanzas

Monorepo TypeScript para una futura aplicación personal de finanzas. El estado actual es un scaffold técnico: la web comprueba la conexión con NestJS y un formulario local validado, pero todavía no hay funciones financieras ni persistencia.

## Tecnologías y requisitos

- Node.js 24 o posterior, según `engines.node`.
- pnpm 11.18.0, fijado en `packageManager`.
- Next.js 16.3.3 y React 19.2.8 para la web.
- NestJS 12 para la API.
- TypeScript estricto en ambos workspaces.

El monorepo usa pnpm workspaces mediante `pnpm-workspace.yaml` y Turborepo 2.10.12 para ejecutar tareas. No usa Nx.

## Estructura

```text
apps/
├── web/          # @gestor-finanzas/web: Next.js y Tailwind CSS
└── api/          # @gestor-finanzas/api: NestJS y Vitest
packages/
├── contracts/    # Esquemas Zod y tipos de los contratos HTTP
├── ui/           # Tokens, atoms y molecules React compartidos
├── api-client/   # Marcador para un futuro cliente generado
└── tooling/      # Marcador para futura configuración compartida
```

La web depende de `contracts` y `ui`; la API depende de `contracts`.

## Instalación

Desde la raíz del repositorio, pnpm utiliza los patrones `apps/*` y `packages/*`.

```bash
pnpm install
```

No existe un script de instalación propio. `pnpm-lock.yaml` en la raíz es el único lockfile y contiene todos los importers del workspace.

## Configuración

No hay archivos `.env.example` ni validación centralizada de configuración.

La API reconoce:

| Variable | Valor predeterminado | Uso |
| --- | --- | --- |
| `HOST` | `127.0.0.1` | Interfaz donde escucha NestJS. |
| `PORT` | `3211` | Puerto de NestJS. |

La web fija `127.0.0.1:3210` directamente en sus scripts. Consulta [SECURITY.md](SECURITY.md) antes de cambiar la exposición de red.

## Desarrollo

Iniciar web y API en paralelo mediante Turborepo:

```bash
pnpm dev
```

Iniciar un solo workspace:

```bash
pnpm dev:web
pnpm dev:api
```

- Web: `http://127.0.0.1:3210`.
- API: `http://127.0.0.1:3211`.
- Health check de la API: `GET /api/v1/health`.

Next.js redirige las peticiones `/api/*` al backend local, de modo que el navegador usa un único origen.

El catálogo Atomic Design se inicia por separado:

```bash
pnpm storybook
```

Storybook escucha en `http://127.0.0.1:6006`.

## Calidad, tests y build

```bash
pnpm lint
pnpm test
pnpm build
```

- `pnpm lint` delega en Turborepo, que ejecuta ESLint en la web y Oxlint en la API.
- `pnpm test` ejecuta los tests de API, contratos y las stories web en Chromium.
- `pnpm test:storybook` ejecuta directamente interacciones y accesibilidad del catálogo visual.
- `pnpm build:storybook` genera el catálogo estático.
- Los E2E de la API se ejecutan por separado con `pnpm --filter @gestor-finanzas/api test:e2e`.
- La cobertura de la API se obtiene con `pnpm --filter @gestor-finanzas/api test:cov`.
- No existe script `typecheck`.
- El build web descarga Geist desde Google Fonts y requiere red o caché disponible.

Consulta [TESTING.md](TESTING.md) para ubicaciones, patrones y limitaciones verificadas.

## Build y ejecución de producción

El build conjunto es:

```bash
pnpm build
```

Los workspaces exponen además:

```bash
pnpm --filter @gestor-finanzas/web start
pnpm --filter @gestor-finanzas/api start:prod
```

No determinado a partir del repositorio actual: proceso de despliegue self-hosted, CI/CD, Docker, servicios de sistema o estrategia de release.

## Documentación

- [AGENTS.md](AGENTS.md): instrucciones y router para agentes.
- [ARCHITECTURE.md](ARCHITECTURE.md): arquitectura efectiva y límites entre workspaces.
- [CONTRIBUTING.md](CONTRIBUTING.md): ramas, commits, pull requests y criterios para contribuir.
- [DEPLOYMENT.md](DEPLOYMENT.md): estado y requisitos para futuros despliegues.
- [DESIGN.md](DESIGN.md): índice de documentación de diseño.
- [ROADMAP.md](ROADMAP.md): prioridades del producto y trabajo futuro.
- [STYLEGUIDE.md](STYLEGUIDE.md): convenciones globales y rutas a las guías locales.
- [TESTING.md](TESTING.md): ejecución transversal de las pruebas.
- [SECURITY.md](SECURITY.md): controles y riesgos transversales.
- [`docs/adr`](docs/adr/README.md): decisiones técnicas importantes y su justificación.
- [`apps/web/README.md`](apps/web/README.md): aplicación web y documentación local.
- [`apps/api/README.md`](apps/api/README.md): API y documentación local.
- [`docs/architecture.md`](docs/architecture.md): intención futura; no representa funcionalidad ya construida.
