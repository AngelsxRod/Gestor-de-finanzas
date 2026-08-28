# Estilo de código de la web

- Usa TypeScript/TSX estricto y App Router.
- Mantén comillas dobles y punto y coma, como el código actual.
- Usa `import type` para imports que solo aporten tipos.
- Los componentes de ruta son funciones PascalCase con export default.
- Los componentes son Server Components salvo que una necesidad concreta requiera `"use client"`.
- El alias `@/*` apunta a la raíz de este workspace.
- Organiza comportamiento por feature bajo `src/features/<feature>`; coloca infraestructura transversal bajo `src/lib`.
- Encapsula cada operación remota en una función API y expón React Query mediante hooks de la feature.
- Usa React Hook Form con un resolver Zod y un custom hook por formulario.
- Los esquemas que representan contratos HTTP viven en `@gestor-finanzas/contracts`; los esquemas exclusivos de UI viven en su feature.
- Usa atoms y molecules de `@gestor-finanzas/ui`; no dupliques primitivas dentro de una feature.
- Mantén organisms con dominio en `src/features/<feature>/components`, templates de layout en `src/features/<feature>/templates` y pages en `app/`.
- Los templates reciben regiones por props y no consultan APIs, administran formularios ni conocen React Query.
- Usa `Heading` para títulos reutilizables: `level` representa la jerarquía HTML y `variant` su apariencia. No elijas `level` por tamaño.
- Prefiere exports nombrados para familias compuestas (`Panel`, `PanelHeader`, `PanelContent`) y evita propiedades estáticas ocultas.
- Añade o actualiza una story al introducir un estado visual compartido o un organism. Incluye `play` cuando haya interacción relevante.
- Usa tokens semánticos `--ui-*`; no introduzcas valores de color repetidos en componentes.
- Escribe los estilos existentes con utilidades Tailwind en `className` y reserva `app/globals.css` para tokens y reglas globales.
- No uses React Query como sustituto automático del fetching en Server Components; resérvalo para caché e interacción cliente.

ESLint carga `core-web-vitals` y la configuración TypeScript de Next.js. No existe Prettier ni script de formato en este workspace.

Antes de escribir código específico de Next.js 16, lee la guía relevante bajo `node_modules/next/dist/docs/`, como exige `AGENTS.md`.
