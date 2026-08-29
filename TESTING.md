# Testing

## Ejecución transversal

Desde la raíz:

```bash
pnpm lint
pnpm test
pnpm build
```

Turborepo ejecuta los scripts disponibles en los workspaces. `pnpm build` alcanza a las apps y a los packages compilables; `pnpm test` ejecuta API, contratos, modelos y las stories de la web en Chromium.

Los checks del esquema y las migraciones se ejecutan además con:

```bash
pnpm db:check
pnpm --filter @gestor-finanzas/models test
```

El sistema visual dispone además de comandos explícitos:

```bash
pnpm test:storybook
pnpm build:storybook
pnpm storybook
```

Las stories comprueban estados aislados, interacciones y accesibilidad con axe. Storybook local escucha en `127.0.0.1:6006`.

Los tests E2E y la cobertura de la API se ejecutan de forma explícita:

```bash
pnpm --filter @gestor-finanzas/api test:e2e
pnpm --filter @gestor-finanzas/api test:cov
```

Los tests de cuentas, categorías y movimientos contra PostgreSQL requieren una base aislada, migrada y con un nombre terminado en `_test`:

```bash
DATABASE_URL=postgres://usuario:contraseña@127.0.0.1:5432/gestor_finanzas_test pnpm db:migrate
DATABASE_URL=postgres://usuario:contraseña@127.0.0.1:5432/gestor_finanzas_test pnpm --filter @gestor-finanzas/api test:integration
DATABASE_URL=postgres://usuario:contraseña@127.0.0.1:5432/gestor_finanzas_test pnpm --filter @gestor-finanzas/api test:e2e
```

Estas pruebas limpian las tablas `transactions`, `categories` y `accounts` (en ese orden, por las claves foráneas); nunca las apuntes a desarrollo o producción.

Consulta [`apps/api/TESTING.md`](apps/api/TESTING.md) para los patrones, configuraciones y comandos propios de la API.

## Limitaciones conocidas

- El build web descarga Geist desde Google Fonts y puede fallar sin red ni caché disponible.
- Turbopack puede necesitar abrir un puerto auxiliar durante el procesamiento de CSS; los entornos aislados que prohíben listeners pueden bloquear también el build.
- Los tests de Storybook requieren Chromium de Playwright instalado y permiso para iniciar el navegador local.
- El test E2E de la API necesita permisos para abrir un listener local.
- No existe un script `typecheck` global ni por workspace.
