# Arquitectura

> Este documento conserva la dirección futura planteada para el proyecto. Para la arquitectura implementada y comprobable consulta [`ARCHITECTURE.md`](../ARCHITECTURE.md).

## Monorepo

El proyecto usa un único workspace de pnpm con dos aplicaciones desplegables y paquetes compartidos. Turborepo coordina build, lint, tests y desarrollo.

## Aplicación web

`apps/web` contiene Next.js y es la única dirección que abre el usuario. Las peticiones bajo `/api` ya se reenvían al backend local para evitar dos orígenes distintos.

La aplicación web no accederá directamente a SQLite ni contendrá reglas financieras.

## API

`apps/api` contiene NestJS y será responsable de las reglas financieras, la validación, las migraciones y el acceso a SQLite. La API ya usa el prefijo `/api/v1`; SQLite sigue siendo futuro.

## Paquetes compartidos

`packages/contracts` ya comparte esquemas Zod y tipos HTTP. `packages/ui` ya comparte atoms y molecules. `packages/api-client` alojará un cliente TypeScript generado desde OpenAPI si esa estrategia se adopta; `packages/tooling` contendrá configuraciones comunes cuando exista una necesidad real.

Solo `api-client` y `tooling` siguen siendo marcadores.

## Límites actuales

- Acceso exclusivo desde esta computadora.
- Web en `127.0.0.1:3210`.
- API en `127.0.0.1:3211`.
- Sin autenticación o base de datos; la comunicación actual se limita al health check técnico.
