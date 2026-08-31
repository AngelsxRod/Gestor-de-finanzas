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

El esquema de persistencia inicial ya existe, tiene migraciones versionadas y está integrado en el ciclo de vida de la API mediante `DatabaseModule`. Los flujos verticales de cuentas, categorías y movimientos funcionan de extremo a extremo, incluida su edición y desactivación reversible, el saldo calculado por cuenta, los filtros de consulta del historial, y los presupuestos mensuales por categoría con su gasto real calculado. Toda la API exige una sesión autenticada (ver ADR-0006), salvo el health check y el propio login.

## Aplicación web

`@gestor-finanzas/web` usa App Router y conserva las rutas y layouts en `app/`. `app/(dashboard)/` es un route group: agrupa `/`, `/cuentas`, `/categorias`, `/movimientos`, `/presupuestos` y `/configuracion` bajo un `layout.tsx` propio que aplica `AppShell`; `app/login/` queda fuera del grupo y solo comparte el layout raíz (html/body/fuentes/`Providers`), así que no hereda el sidebar. Los route groups no cambian las URLs. `proxy.ts` (raíz de `apps/web`; reemplaza a `middleware.ts`, renombrado y deprecado en Next.js 16) verifica la cookie de sesión antes de cualquier ruta salvo `/login`, `/api`, `_next` y archivos estáticos, y redirige a `/login` sin renderizar el dashboard. El código de aplicación vive bajo `src/`:

- `src/features/<feature>/api`: operaciones HTTP propias de la feature.
- `src/features/<feature>/hooks`: React Query y hooks de formulario.
- `src/features/<feature>/schemas`: esquemas exclusivos de la interfaz.
- `src/features/<feature>/components`: composición visual ligada a la feature.
- `src/features/<feature>/templates`: distribución de regiones sin estado remoto ni reglas de formulario.
- `src/lib`: infraestructura transversal de la app, como la instancia Axios.

Los Server Components son el valor predeterminado. Query Client, hooks, eventos y formularios se aíslan tras fronteras `"use client"`. React Query administra estado remoto interactivo; React Hook Form y Zod validan formularios. Axios usa `/api/v1` y Next.js reenvía `/api/*` a la API local.

La app es un dashboard con sidebar de navegación y encabezado por sección (`src/features/shell`): `/` es el resumen, `/cuentas`, `/categorias`, `/movimientos` y `/presupuestos` alojan los flujos completos, y `/configuracion` sigue siendo una sección planificada sin backend. `AccountsDashboard`, `CategoriesDashboard`, `TransactionsDashboard` y `BudgetsDashboard` delimitan las regiones cliente que administran consultas, mutaciones e invalidación de caché; sus formularios de alta y edición se presentan en un `Modal` (elemento `<dialog>` nativo) y sus listados en una tabla con acciones de editar y desactivar/reactivar por fila. `TransactionForm` alterna entre categoría y cuenta destino según el tipo elegido (ingreso, gasto o transferencia); pasa las cuentas y categorías completas (no solo las activas), para que editar un movimiento siga mostrando la cuenta o categoría que tenía asignada aunque haya sido desactivada después. `TransactionsTable` resuelve los nombres de cuenta y categoría del mismo modo. `AccountsDashboard` combina `useAccountsQuery` con `useAccountBalancesQuery` (feature `transactions`, ya que el saldo se deriva de `GET /api/v1/transactions/balances`) para que la columna "Saldo" de `AccountsTable` muestre el saldo real en vez del saldo de apertura estático; las tres mutaciones de movimientos invalidan también esa consulta. `TransactionsFilters` es un organism controlado (sin estado propio de formulario, a diferencia de los formularios de alta/edición) que administra `accountId`, `categoryId`, `type`, rango de fechas y estado mediante el hook `useTransactionFilters`, y `TransactionsDashboard` traduce esos valores a `ListTransactionsQuery` antes de pasarlos a `useTransactionsQuery`, cuya clave de caché incluye los filtros activos. `BudgetsDashboard` mantiene el mes seleccionado (`<input type="month">`, por defecto el mes actual) como estado local y lo pasa a `useBudgetsQuery`, cuya clave de caché lo incluye; `BudgetForm` solo ofrece categorías de tipo `expense` (activas, o la ya asignada al editar, mismo filtro que `TransactionForm`) y `BudgetsTable` resalta en rojo la columna "Restante" cuando el gasto supera el límite. Todas las interfaces presentan estados de carga, error, vacío y éxito.

`LoginForm` (feature `auth`) es un organism presentacional más, igual que los demás formularios; `LoginPageContent` (client, usado solo por `app/login/page.tsx`) orquesta el envío, el redirect a `?from=` tras iniciar sesión y el mensaje de error. `Sidebar`/`AppShell` no conocen la sesión: reciben un slot `footer`/`sidebarFooter` opcional, y `app/(dashboard)/layout.tsx` les pasa `SidebarFooter` (nombre de usuario y botón de cerrar sesión) — así ambos siguen siendo componentes puros y sus stories no necesitan un `QueryClientProvider`. `httpClient` intercepta cualquier 401 y fuerza una navegación completa a `/login`, cubriendo una sesión que expira mientras el usuario ya está en la página (`proxy.ts` solo revalida en cada navegación).

## API

`@gestor-finanzas/api` se organiza mediante feature modules de NestJS:

- `AppModule` compone módulos y no contiene comportamiento de dominio.
- `HealthModule` agrupa controller y service del health check.
- `DatabaseModule` registra globalmente el cliente tipado de `@gestor-finanzas/models` y administra su cierre.
- `ConfigModule` carga y valida `DATABASE_URL`, `HOST`, `PORT`, `NODE_ENV`, `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH` y `SESSION_SECRET` antes del arranque.
- `app.config.ts` aplica el prefijo `/api/v1`, `cookie-parser` y el pipe global de Standard Schema tanto en runtime como en E2E.
- `AuthModule` registra `AuthGuard` como `APP_GUARD` global: toda ruta exige la cookie `gestor_finanzas_session` salvo las marcadas `@Public()`. `POST /api/v1/auth/login` valida contra `ADMIN_USERNAME`/`ADMIN_PASSWORD_HASH` (`crypto.scrypt`, siempre corre la comparación aunque el usuario no exista, para no filtrar por tiempo cuál campo falló), está limitada a 5 intentos/minuto (`@nestjs/throttler`) y firma un JWT HS256 (`jose`, 12h) en la cookie. `POST /api/v1/auth/logout` la limpia. `GET /api/v1/auth/session` devuelve el usuario autenticado. Ver ADR-0006.
- `GET /api/v1/health` (`@Public()`) devuelve el contrato compartido de health.
- `AccountsModule` contiene controller, servicio y un repository Drizzle específico.
- `GET /api/v1/accounts` lista cuentas en orden estable por nombre e ID.
- `POST /api/v1/accounts` valida, normaliza y crea una cuenta; los nombres duplicados devuelven un conflicto público sin detalles de PostgreSQL.
- `PATCH /api/v1/accounts/:id` reemplaza los campos editables de una cuenta existente; responde 404 público si no existe.
- `PATCH /api/v1/accounts/:id/active` activa o desactiva una cuenta (única forma de "eliminar", reversible; ver ADR-0002).
- `CategoriesModule` contiene controller, servicio y un repository Drizzle específico.
- `GET /api/v1/categories` lista categorías por tipo, nombre e ID.
- `POST /api/v1/categories` recorta el nombre y permite duplicarlo solo entre tipos distintos.
- `PATCH /api/v1/categories/:id` reemplaza los campos editables de una categoría existente; responde 404 público si no existe.
- `PATCH /api/v1/categories/:id/active` activa o desactiva una categoría (misma semántica que en cuentas).
- `TransactionsModule` contiene controller, servicio y un repository Drizzle específico; importa `AccountsModule` y `CategoriesModule` para reutilizar sus repositories en vez de duplicar consultas.
- `GET /api/v1/transactions/balances` devuelve el saldo de cada cuenta (`openingBalance` más la suma de sus movimientos activos: ingreso suma, gasto resta, transferencia resta en la cuenta origen y suma en la destino) calculado enteramente en SQL con `numeric`, nunca con aritmética de punto flotante en JS. Vive en `TransactionsModule`, no en `AccountsModule`, porque es una vista agregada sobre movimientos y la dependencia entre módulos ya es unidireccional (`TransactionsModule` → `AccountsModule`); `TransactionsRepository` importa la tabla `accounts` de `@gestor-finanzas/models` directamente para el `LEFT JOIN`, lo cual es una consulta Drizzle, no un acoplamiento de módulos NestJS.
- `GET /api/v1/transactions` lista movimientos por fecha de ocurrencia, del más reciente al más antiguo, y acepta filtros opcionales por query string (`accountId`, `categoryId`, `type`, `occurredFrom`/`occurredTo` como fecha `YYYY-MM-DD` con límites inclusivos del día en hora local, `isActive`); sin filtros se comporta igual que antes de este flujo. `accountId` incluye los movimientos donde la cuenta participa como origen o como destino de una transferencia.
- `POST /api/v1/transactions` crea un ingreso, gasto o transferencia. `TransactionsService` deriva la moneda del movimiento de la cuenta seleccionada (nunca la recibe del cliente) y valida las reglas que ninguna restricción de una sola tabla puede expresar: la cuenta (y, para transferencias, la cuenta destino) debe existir y estar activa; para ingresos y gastos, la categoría debe existir, estar activa y coincidir en tipo; para transferencias, la cuenta destino debe ser distinta de la de origen y compartir moneda con ella.
- `PATCH /api/v1/transactions/:id` reemplaza los campos editables de un movimiento existente reutilizando exactamente las mismas reglas que `POST`; responde 404 público si no existe.
- `PATCH /api/v1/transactions/:id/active` activa o desactiva un movimiento (única forma de "eliminar", reversible; ver ADR-0003).
- `BudgetsModule` contiene controller, servicio y un repository Drizzle específico; importa `CategoriesModule` para revalidar la categoría.
- `GET /api/v1/budgets` exige el query param `month` (`YYYY-MM`) y devuelve, por cada presupuesto de ese mes, `spent` y `remaining` calculados en SQL (suma de movimientos de gasto activos de la misma categoría y moneda, ocurridos en ese mes, restada del límite) — nunca con aritmética de punto flotante en JS. `BudgetsRepository` importa la tabla `transactions` de `@gestor-finanzas/models` directamente para el `LEFT JOIN`, mismo razonamiento que el saldo de cuentas.
- `POST /api/v1/budgets` crea un presupuesto; `BudgetsService` exige que la categoría exista, esté activa y sea de tipo `expense`; un presupuesto duplicado para la misma categoría y mes devuelve un conflicto público (ver ADR-0004).
- `PATCH /api/v1/budgets/:id` reemplaza los campos editables revalidando las mismas reglas que `POST`; responde 404 público si no existe.
- `PATCH /api/v1/budgets/:id/active` activa o desactiva un presupuesto (única forma de "eliminar", reversible; ver ADR-0004).

Los repositories de cuentas y categorías son fronteras pequeñas alrededor de sus consultas Drizzle. No se introducen entidades de persistencia, CQRS, DDD o capas hexagonales mientras no exista una necesidad concreta. Nest Observe fue retirado porque el starter solo contenía credenciales placeholder.

## Packages compartidos

### `@gestor-finanzas/contracts`

Es la fuente de verdad de los datos que cruzan la frontera HTTP. Exporta esquemas Zod ejecutables y tipos inferidos. No contiene React, Axios ni reglas de negocio.

Publica el contrato de respuesta del health check, los esquemas de autenticación (login, sesión, logout) y los de petición, respuesta y error de cuentas, categorías, movimientos y presupuestos. Los siguientes contratos financieros se añadirán con cada flujo vertical, no por anticipado.

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

El esquema actual contiene cuentas, categorías, movimientos y presupuestos. Las restricciones estructurales viven en PostgreSQL; las reglas que cruzan tablas, como la coherencia entre categoría, tipo y moneda, viven en `TransactionsService` y `BudgetsService`.

Las decisiones y limitaciones del modelo inicial están registradas en [`ADR-0001`](docs/adr/0001-postgresql-drizzle-en-models.md); el modelo de presupuestos, en [`ADR-0004`](docs/adr/0004-presupuestos-mensuales-por-categoria.md).

### Marcadores

`api-client` queda reservado para un posible cliente generado desde OpenAPI. `tooling` queda reservado para configuración compartida. Ninguno tiene exports o consumidores activos.

## Dependencias y flujo

```text
Navegador
  └─► apps/web /api/v1/health, /api/v1/auth/*, /api/v1/accounts, /api/v1/categories, /api/v1/transactions, /api/v1/transactions/balances y /api/v1/budgets
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
- `pnpm test` ejecuta Vitest en API, contracts y las stories web en Chromium; no incluye los tests de integración y E2E de la API contra PostgreSQL (`pnpm --filter @gestor-finanzas/api test:integration` y `test:e2e`), que requieren una base `_test` aislada aparte y se ejecutan como pasos propios en CI y localmente.
- `pnpm storybook` expone el catálogo visual; `pnpm build:storybook` genera su artefacto estático.

El repositorio conserva un único `pnpm-lock.yaml` raíz.

## Ejecución y límites actuales

La API valida `DATABASE_URL`, `HOST`, `PORT` y `NODE_ENV`; abre PostgreSQL de forma diferida y cierra el cliente durante el apagado. La web escucha en `127.0.0.1:3210`. Desarrollo y producción self-hosted tienen Compose separados; producción aplica migraciones antes de iniciar la API y solo publica la web en loopback.

No hay CD. Autenticación, autorización y sesiones ya están resueltas (ver ADR-0006); cuentas, categorías, movimientos y presupuestos son los dominios expuestos, todos protegidos por sesión. El stack self-hosted es operable en una sola computadora, pero no debe exponerse a otra red sin resolver antes HTTPS/reverse proxy ni almacenar información financiera real antes de terminar de probar los controles de seguridad pendientes (ver `SECURITY.md`).

[`docs/architecture.md`](docs/architecture.md) describe la dirección objetivo del producto. Este archivo describe únicamente la arquitectura implementada.
