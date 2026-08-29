# Arquitectura

## Visión general

El repositorio es un monorepo TypeScript gestionado con pnpm 11.18.0 y Turborepo 2.10.12. Contiene dos aplicaciones desplegables, tres packages compartidos activos y dos marcadores futuros.

```text
gestor-de-finanzas
├── apps
│   ├── web            Next.js 16 + React 19
│   └── api            NestJS 12
└── packages
    ├── contracts      esquemas Zod y tipos HTTP
    ├── models         esquema, conexión y migraciones PostgreSQL
    ├── ui             tokens, atoms y molecules React
    ├── api-client     marcador sin código
    └── tooling        marcador sin configuración
```

El esquema de persistencia inicial ya existe, tiene una migración versionada y está integrado en el ciclo de vida de la API mediante `DatabaseModule`. Los flujos verticales de cuentas y categorías funcionan de extremo a extremo. Los movimientos todavía no tienen casos de uso, endpoints ni pantallas.

## Aplicación web

`@gestor-finanzas/web` usa App Router y conserva las rutas y layouts en `app/`. El código de aplicación vive bajo `src/`:

- `src/features/<feature>/api`: operaciones HTTP propias de la feature.
- `src/features/<feature>/hooks`: React Query y hooks de formulario.
- `src/features/<feature>/schemas`: esquemas exclusivos de la interfaz.
- `src/features/<feature>/components`: composición visual ligada a la feature.
- `src/features/<feature>/templates`: distribución de regiones sin estado remoto ni reglas de formulario.
- `src/lib`: infraestructura transversal de la app, como la instancia Axios.

Los Server Components son el valor predeterminado. Query Client, hooks, eventos y formularios se aíslan tras fronteras `"use client"`. React Query administra estado remoto interactivo; React Hook Form y Zod validan formularios. Axios usa `/api/v1` y Next.js reenvía `/api/*` a la API local.

La ruta `/` compone en servidor la introducción y los flujos de cuentas y categorías. `AccountsDashboard` y `CategoriesDashboard` delimitan las regiones cliente que administran consultas, mutaciones, invalidación de caché y formularios. Ambas interfaces presentan estados de carga, error, vacío y éxito.

## API

`@gestor-finanzas/api` se organiza mediante feature modules de NestJS:

- `AppModule` compone módulos y no contiene comportamiento de dominio.
- `HealthModule` agrupa controller y service del health check.
- `DatabaseModule` registra globalmente el cliente tipado de `@gestor-finanzas/models` y administra su cierre.
- `ConfigModule` carga y valida `DATABASE_URL`, `HOST`, `PORT` y `NODE_ENV` antes del arranque.
- `app.config.ts` aplica el prefijo `/api/v1` y el pipe global de Standard Schema tanto en runtime como en E2E.
- `GET /api/v1/health` devuelve el contrato compartido de health.
- `AccountsModule` contiene controller, servicio y un repository Drizzle específico.
- `GET /api/v1/accounts` lista cuentas en orden estable por nombre e ID.
- `POST /api/v1/accounts` valida, normaliza y crea una cuenta; los nombres duplicados devuelven un conflicto público sin detalles de PostgreSQL.
- `CategoriesModule` contiene controller, servicio y un repository Drizzle específico.
- `GET /api/v1/categories` lista categorías por tipo, nombre e ID.
- `POST /api/v1/categories` recorta el nombre y permite duplicarlo solo entre tipos distintos.

Los repositories de cuentas y categorías son fronteras pequeñas alrededor de sus consultas Drizzle. No se introducen entidades de persistencia, CQRS, DDD o capas hexagonales mientras no exista una necesidad concreta. Nest Observe fue retirado porque el starter solo contenía credenciales placeholder.

## Packages compartidos

### `@gestor-finanzas/contracts`

Es la fuente de verdad de los datos que cruzan la frontera HTTP. Exporta esquemas Zod ejecutables y tipos inferidos. No contiene React, Axios ni reglas de negocio.

Publica el contrato de respuesta del health check y los esquemas de petición, respuesta y error de cuentas y categorías. Los siguientes contratos financieros se añadirán con cada flujo vertical, no por anticipado.

### `@gestor-finanzas/ui`

Implementa Atomic Design de forma incremental:

- `foundations`: tokens CSS semánticos de color, tipografía, espacio, radios y sombras.
- `atoms`: controles y tipografía visual indivisible.
- `molecules`: composiciones pequeñas de atoms.
- Los organisms que conocen el dominio permanecen dentro de las features web.
- Los templates permanecen en la app y las pages en App Router.

El package no administra datos, formularios ni navegación.

### `@gestor-finanzas/models`

Es propietario del esquema Drizzle, los tipos persistidos, la fábrica de conexiones y las migraciones PostgreSQL. No contiene reglas de negocio, controllers ni contratos HTTP. La API consume la fábrica y administra el ciclo de vida de la conexión mediante `DatabaseService`.

El esquema actual contiene cuentas, categorías y movimientos. Las restricciones estructurales viven en PostgreSQL; las reglas que cruzan tablas, como la coherencia entre categoría, tipo y moneda, corresponderán a los servicios de la API.

Las decisiones y limitaciones del modelo inicial están registradas en [`ADR-0001`](docs/adr/0001-postgresql-drizzle-en-models.md).

### Marcadores

`api-client` queda reservado para un posible cliente generado desde OpenAPI. `tooling` queda reservado para configuración compartida. Ninguno tiene exports o consumidores activos.

## Dependencias y flujo

```text
Navegador
  └─► apps/web /api/v1/health, /api/v1/accounts y /api/v1/categories
        └─► rewrite de Next.js
              └─► apps/api

apps/web ──► packages/ui
    └──────► packages/contracts ◄────── apps/api

apps/api ──► packages/models ──► PostgreSQL
```

Una app nunca importa archivos internos de la otra y ningún package depende de una app desplegable.

## Build, tests y ejecución

- `pnpm dev` inicia web y API en paralelo mediante el TUI de Turborepo.
- `pnpm build` construye primero los packages requeridos y después sus consumidores.
- `pnpm lint` ejecuta ESLint en web y Oxlint en API.
- `pnpm test` ejecuta Vitest en API, contracts y las stories web en Chromium.
- `pnpm storybook` expone el catálogo visual; `pnpm build:storybook` genera su artefacto estático.

El repositorio conserva un único `pnpm-lock.yaml` raíz.

## Ejecución y límites actuales

La API valida `DATABASE_URL`, `HOST`, `PORT` y `NODE_ENV`; abre PostgreSQL de forma diferida y cierra el cliente durante el apagado. La web escucha en `127.0.0.1:3210`. Desarrollo y producción self-hosted tienen Compose separados; producción aplica migraciones antes de iniciar la API y solo publica la web en loopback.

No hay autenticación, autorización, sesiones ni CI/CD. Cuentas y categorías son los dominios expuestos. El stack self-hosted es operable en una sola computadora, pero no debe exponerse a una red ni almacenar información financiera real antes de definir y probar los controles de seguridad pendientes.

[`docs/architecture.md`](docs/architecture.md) describe la dirección objetivo del producto. Este archivo describe únicamente la arquitectura implementada.
