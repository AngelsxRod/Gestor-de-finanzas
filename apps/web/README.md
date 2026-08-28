# @gestor-finanzas/web

Aplicación web del monorepo, construida con Next.js 16, React 19, App Router, Tailwind CSS 4, React Query, Axios y React Hook Form.

## Comandos

Desde la raíz:

```bash
pnpm dev:web
pnpm --filter @gestor-finanzas/web lint
pnpm --filter @gestor-finanzas/web build
pnpm --filter @gestor-finanzas/web start
pnpm storybook
pnpm test:storybook
```

`dev` y `start` escuchan en `http://127.0.0.1:3210`; Storybook escucha en `http://127.0.0.1:6006`.

## Estado

La ruta `/` muestra un scaffold técnico: consulta `GET /api/v1/health` mediante el rewrite de Next.js y presenta un formulario local validado con Zod. No hay persistencia ni funcionalidad financiera.

El código se organiza por features bajo `src/features`. Los componentes compartidos proceden de `@gestor-finanzas/ui`, las respuestas HTTP se validan con `@gestor-finanzas/contracts` y Storybook prueba el catálogo Atomic Design con Vitest, Playwright y axe.

El build carga Geist desde Google Fonts y requiere acceso de red o una copia disponible en caché.

## Documentación local

- [AGENTS.md](AGENTS.md)
- [DESIGN.md](DESIGN.md)
- [STYLEGUIDE.md](STYLEGUIDE.md)

Para arquitectura, testing y seguridad transversal consulta la documentación de la raíz.
