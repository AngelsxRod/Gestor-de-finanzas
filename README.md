# Gestor de finanzas

Monorepo TypeScript para una aplicación personal de finanzas self-hosted. Los flujos implementados permiten crear y consultar cuentas y categorías desde la web mediante contratos Zod, una API NestJS y PostgreSQL con Drizzle. Los movimientos continúan solo en el esquema.

## Tecnologías y requisitos

- Node.js 24 o posterior, según `engines.node`.
- pnpm 11.18.0, fijado en `packageManager`.
- Next.js 16.3.3 y React 19.2.8 para la web.
- NestJS 12 para la API.
- PostgreSQL 18 y Drizzle ORM para persistencia.
- TypeScript estricto en ambos workspaces.

El monorepo usa pnpm workspaces mediante `pnpm-workspace.yaml` y Turborepo 2.10.12 para ejecutar tareas. No usa Nx.

## Estructura

```text
apps/
├── web/          # @gestor-finanzas/web: Next.js y Tailwind CSS
└── api/          # @gestor-finanzas/api: NestJS y Vitest
packages/
├── contracts/    # Esquemas Zod y tipos de los contratos HTTP
├── models/       # Esquema Drizzle, conexión y migraciones PostgreSQL
├── ui/           # Tokens, atoms y molecules React compartidos
├── api-client/   # Marcador para un futuro cliente generado
└── tooling/      # Marcador para futura configuración compartida
```

La web depende de `contracts` y `ui`; la API depende de `contracts` y `models`. `DatabaseModule` integra la fábrica de conexión de `models`. Los flujos HTTP actuales son el health check y la creación y consulta de cuentas y categorías.

## Instalación

Desde la raíz del repositorio, pnpm utiliza los patrones `apps/*` y `packages/*`.

```bash
pnpm install
```

No existe un script de instalación propio. `pnpm-lock.yaml` en la raíz es el único lockfile y contiene todos los importers del workspace.

## Configuración

Copia `.env.example` a `.env` para operar PostgreSQL local. Sus valores son exclusivamente de desarrollo y la base escucha en loopback. NestJS valida la configuración antes de iniciar.

La API reconoce:

| Variable | Valor predeterminado | Uso |
| --- | --- | --- |
| `HOST` | `127.0.0.1` | Interfaz donde escucha NestJS. |
| `PORT` | `3211` | Puerto de NestJS. |
| `DATABASE_URL` | Obligatoria | Conexión PostgreSQL usada por `DatabaseService`. |

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
- Cuentas: `GET /api/v1/accounts` y `POST /api/v1/accounts`.
- Categorías: `GET /api/v1/categories` y `POST /api/v1/categories`.

Next.js redirige las peticiones `/api/*` al backend local, de modo que el navegador usa un único origen.

El catálogo Atomic Design se inicia por separado:

```bash
pnpm storybook
```

Storybook escucha en `http://127.0.0.1:6006`.

## Base de datos local

```bash
cp .env.example .env
docker compose -f compose.dev.yaml up -d --wait
pnpm db:migrate
pnpm dev
```

PostgreSQL se publica solo en `127.0.0.1:55432` para no competir con una instalación local en el puerto estándar. Web y API siguen ejecutándose con hot reload fuera de Docker.

El esquema y las migraciones pertenecen a [`packages/models`](packages/models/README.md). Después de modificar el esquema:

```bash
pnpm db:generate
pnpm db:check
```

Revisa siempre el SQL generado antes de versionarlo. No edites una migración aplicada en otro entorno.

El modelo inicial contiene:

- cuentas de efectivo, corriente, ahorro, crédito o inversión, con moneda y saldo de apertura;
- categorías de ingreso o gasto;
- movimientos de ingreso, gasto o transferencia, con integridad referencial y restricciones de forma.

La API ya lee y escribe `accounts` y `categories` mediante repositories específicos. Los movimientos continúan únicamente como modelo persistente.

Para ejecutar el stack self-hosted completo consulta [`DEPLOYMENT.md`](DEPLOYMENT.md). La configuración de producción aplica migraciones y levanta API/web en orden; solo publica la web en loopback.

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
- La integración con PostgreSQL se ejecuta con `pnpm --filter @gestor-finanzas/api test:integration` contra una base aislada cuyo nombre termine en `_test`.
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

El despliegue self-hosted mediante Docker Compose ya está definido: construye las aplicaciones, aplica migraciones pendientes y publica únicamente la web en loopback. Siguen sin estar definidos CI/CD, servicios de sistema y una estrategia formal de releases o rollback.

## Documentación

- [AGENTS.md](AGENTS.md): instrucciones y router para agentes.
- [ARCHITECTURE.md](ARCHITECTURE.md): arquitectura efectiva y límites entre workspaces.
- [CONTRIBUTING.md](CONTRIBUTING.md): ramas, commits, pull requests y criterios para contribuir.
- [DEPLOYMENT.md](DEPLOYMENT.md): desarrollo y despliegue self-hosted mediante Docker Compose.
- [DESIGN.md](DESIGN.md): índice de documentación de diseño.
- [ROADMAP.md](ROADMAP.md): prioridades del producto y trabajo futuro.
- [STYLEGUIDE.md](STYLEGUIDE.md): convenciones globales y rutas a las guías locales.
- [TESTING.md](TESTING.md): ejecución transversal de las pruebas.
- [SECURITY.md](SECURITY.md): controles y riesgos transversales.
- [`docs/adr`](docs/adr/README.md): decisiones técnicas importantes y su justificación.
- [`apps/web/README.md`](apps/web/README.md): aplicación web y documentación local.
- [`apps/api/README.md`](apps/api/README.md): API y documentación local.
- [`packages/models/README.md`](packages/models/README.md): esquema, migraciones y comandos de base de datos.
- [`docs/architecture.md`](docs/architecture.md): dirección objetivo; no sustituye la arquitectura implementada.
