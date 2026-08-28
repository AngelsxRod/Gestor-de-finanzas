# Guía de estilo

## Convenciones globales

- Usa TypeScript estricto y mantén privados los workspaces.
- Gestiona dependencias y scripts con pnpm; Turborepo coordina las tareas desde la raíz.
- Conserva los límites entre `apps/*` y `packages/*`: ninguna app debe importar código interno de la otra.
- Usa `packages/contracts` para esquemas que cruzan la frontera HTTP y `packages/ui` para primitivas visuales sin conocimiento de dominio.
- No presentes `packages/api-client` ni `packages/tooling` como dependencias activas mientras sigan siendo marcadores sin consumidores.
- Sigue la configuración local de cada workspace; no existe una configuración de estilo compartida efectiva.

## Guías locales

- Web: [`apps/web/STYLEGUIDE.md`](apps/web/STYLEGUIDE.md), con las convenciones de Next.js, React, ESLint y Tailwind CSS.
- API: [`apps/api/STYLEGUIDE.md`](apps/api/STYLEGUIDE.md), con las convenciones de NestJS, NodeNext, Oxlint y Prettier.

Las instrucciones operativas para agentes están en [`AGENTS.md`](AGENTS.md) y en el `AGENTS.md` de cada aplicación.
