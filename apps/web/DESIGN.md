# Diseño de la aplicación web

## Implementación actual

La ruta `/` muestra un scaffold técnico responsive con estado de API y un formulario local. `packages/ui` aporta los tokens, atoms y molecules sin dominio.

Atomic Design define límites de responsabilidad, no solo carpetas:

- Foundations: tokens CSS semánticos de `packages/ui/src/styles.css`.
- Atoms: tipografía y controles indivisibles en `packages/ui/src/atoms`.
- Molecules: composiciones genéricas pequeñas en `packages/ui/src/molecules`.
- Organisms: secciones completas con vocabulario o comportamiento de negocio dentro de `src/features/*/components`.
- Templates: distribución de regiones sin acceso a datos en `src/features/*/templates`.
- Pages: composición final, metadata y fronteras de ruta en `app/`.

No se promueve un organism al package UI hasta demostrar más de un consumidor y poder eliminar su conocimiento del dominio.

## Base visual

- Tailwind CSS 4 se importa en `app/globals.css`.
- PostCSS usa `@tailwindcss/postcss`.
- Geist y Geist Mono se cargan con `next/font/google` y se exponen como variables CSS.
- `body` usa Geist con fallback a Arial, Helvetica y sans-serif.
- Tailwind incluye explícitamente las fuentes de `packages/ui` mediante `@source`.
- Storybook cataloga foundations, atoms, molecules, organisms y templates en aislamiento.

## Tokens y tema

Los tokens `--ui-*` del package compartido cubren canvas, superficies, texto, bordes, acción primaria, foco, éxito y error; además definen escala tipográfica, espaciado, radios y sombras. El tema se selecciona con `data-theme="light|dark"`; sin atributo, sigue `prefers-color-scheme`.

La dirección visual actual es neutral y funcional. No existe todavía una identidad de marca completa.

## Layout y responsive

- La estructura usa Flexbox y altura mínima completa.
- El contenido principal tiene `max-w-5xl`.
- Las tarjetas forman una columna y cambian a dos columnas en `lg`.
- El padding aumenta a partir de `sm` y `lg`.

El espaciado significativo usa la escala `--ui-space-*`; Tailwind se usa como sintaxis de composición.

## Tipografía y encabezados

`Heading` separa semántica y presentación. `level` determina `h1`–`h6` y es obligatorio; `variant` determina `display`, `title`, `section` o `subsection`. Cada página conserva un único `h1` y no salta niveles por conseguir un tamaño visual.

`ContentHeader` compone eyebrow, heading y descripción cuando esa agrupación se repite. No debe reemplazar encabezados que requieren una estructura diferente.

## Catálogo y comprobación

`pnpm storybook` inicia el catálogo en `127.0.0.1:6006`. `pnpm test:storybook` ejecuta todas las stories en Chromium; los tests de interacción y las violaciones de axe configuradas como error fallan la ejecución.

## Accesibilidad observable

- Elementos semánticos `main`, `header`, `section`, encabezados y formulario.
- Labels asociados, descripciones mediante `aria-describedby` y errores con `role="alert"`.
- Estados de red y preview anunciados mediante regiones live.
- Botones con foco visible y estados disabled.
- Tema oscuro según preferencias del sistema.
- `lang="es"`, coherente con el contenido actual.

## Patrones todavía inexistentes

No determinado a partir del código actual:

- Navegación de producto.
- Estado empty de colecciones.
- Tablas, gráficas y visualizaciones financieras.
- Notificaciones, diálogos e iconografía propia.
