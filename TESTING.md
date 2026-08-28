# Testing

## Ejecución transversal

Desde la raíz:

```bash
pnpm lint
pnpm test
pnpm build
```

Turborepo ejecuta los scripts disponibles en los workspaces. `pnpm build` alcanza a las apps y a los packages compilables; `pnpm test` ejecuta API, contratos y las stories de la web en Chromium.

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

Consulta [`apps/api/TESTING.md`](apps/api/TESTING.md) para los patrones, configuraciones y comandos propios de la API.

## Limitaciones conocidas

- El build web descarga Geist desde Google Fonts y puede fallar sin red ni caché disponible.
- Turbopack puede necesitar abrir un puerto auxiliar durante el procesamiento de CSS; los entornos aislados que prohíben listeners pueden bloquear también el build.
- Los tests de Storybook requieren Chromium de Playwright instalado y permiso para iniciar el navegador local.
- El test E2E de la API necesita permisos para abrir un listener local.
- No existe un script `typecheck` global ni por workspace.
