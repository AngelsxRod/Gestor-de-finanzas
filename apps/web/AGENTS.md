<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Instrucciones locales

Estas reglas complementan el `AGENTS.md` de la raíz:

- Lee `DESIGN.md` antes de cambiar estilos, layout, responsive o accesibilidad.
- Lee `STYLEGUIDE.md` antes de modificar componentes, imports o CSS.
- Usa los scripts del workspace a través de Turborepo desde la raíz.
- Ejecuta `pnpm --filter @gestor-finanzas/web lint` y, cuando haya red para Google Fonts, `pnpm --filter @gestor-finanzas/web build`.
- Ejecuta `pnpm test:storybook` cuando cambies componentes, tokens o stories; los checks incluyen interacción y accesibilidad en Chromium.
- Conserva el límite Atomic Design descrito en `DESIGN.md`: UI comparte atoms/molecules, las features poseen organisms/templates y App Router posee pages.
- No importes código desde `apps/api/src`; usa `@gestor-finanzas/contracts` para la frontera HTTP.
- Mantén las rutas en `app/`, el comportamiento en `src/features` y la infraestructura transversal en `src/lib`.
- No lleves organisms con conocimiento del dominio a `@gestor-finanzas/ui`.
- Conserva este bloque generado por Next.js aunque se amplíe el resto del archivo.
