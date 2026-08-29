# Diseño de la aplicación web

## Implementación actual

La aplicación es un dashboard financiero: un `AppShell` (Server Component) compone una barra lateral de navegación (`Sidebar`) y el área principal (`MainRegion`), y cada página arma su propio `SectionHeader` (título, breadcrumb, acción principal y botón de menú móvil) dentro de un `SectionTemplate`. La ruta `/` ("Resumen") muestra tarjetas de métrica y accesos rápidos a las demás secciones (feature `overview`, que reutiliza los hooks de React Query existentes de `accounts`/`categories` sin nuevas llamadas HTTP). Las rutas `/cuentas`, `/categorias` y `/movimientos` alojan los flujos completos: una tabla (`AccountsTable`/`CategoriesTable`/`TransactionsTable`) lista los registros con columna de estado (Activo/Inactivo) y acciones de editar y desactivar/reactivar por fila, y el botón principal del header ("Nueva cuenta"/"Nueva categoría"/"Nuevo movimiento") abre un `Modal` con el formulario de alta; el mismo formulario se reutiliza en modo edición. `/presupuestos` y `/configuracion` son páginas reales con un `EmptyState` ("próximamente"), sin fetching, para las secciones que aún no tienen backend. `packages/ui` aporta los tokens, atoms y molecules sin dominio.

### Modal y tablas

- `Modal`/`ModalHeader`/`ModalContent`/`ModalFooter` (`packages/ui/src/molecules/modal.tsx`) envuelven el elemento nativo `<dialog>`, controlado por `ref` + `showModal()`/`close()` — nunca por el atributo JSX `open`. El cierre por Escape o por click en el backdrop dispara el evento nativo `close`; el foco vuelve al elemento que abrió el modal. No se agregó ninguna librería de diálogos.
- `Table`/`TableHeader`/`TableBody`/`TableRow`/`TableCell` (`packages/ui/src/molecules/table.tsx`) son la primitiva genérica de tabla: separan filas con `divide-y` en vez de bordes por celda y usan un encabezado de texto pequeño en mayúsculas, siguiendo la dirección de minimalismo monocromo.
- El botón del header que abre el modal y el propio modal/tabla viven en componentes distintos (header vs. contenido de la página). Comparten estado mediante `createModalContext<T>()` (`src/features/shell/context/create-modal-context.tsx`), un factory que cada feature instancia con su propio tipo (`account-modal-context.ts`, `category-modal-context.ts`, `transaction-modal-context.ts`) siguiendo el mismo patrón "interleaving" que ya usa `ShellProvider` para el drawer del sidebar.
- "Eliminar" nunca es un borrado físico: activa o desactiva el registro (ver [ADR-0002](../../docs/adr/0002-soft-delete-simetrico-cuentas-categorias.md) para cuentas/categorías y [ADR-0003](../../docs/adr/0003-desactivacion-reversible-movimientos.md) para movimientos), es reversible y no requiere un modal de confirmación aparte.
- `TransactionForm` es un único formulario con tres formas: alterna entre categoría (ingreso/gasto) y cuenta destino (transferencia) según el campo "Tipo", filtra la categoría por el tipo de movimiento y excluye la cuenta de origen de las opciones de cuenta destino. La moneda del movimiento nunca se pide en el formulario: la API la deriva de la cuenta elegida. Recibe todas las cuentas y categorías (no solo las activas): una inactiva sigue apareciendo, marcada "— inactiva", únicamente si es el valor ya asignado al movimiento que se edita — así editar no la hace desaparecer del selector, pero tampoco se ofrece como opción nueva.

### Shell y secciones

- `AppShell`, `Sidebar`, `NavLink`, `MobileMenuButton`, `Breadcrumb`, `SectionHeader` y `SectionTemplate` viven en `src/features/shell` (organisms/templates con conocimiento de la app y sus rutas).
- `ShellProvider`/`useShell` (`src/features/shell/context/shell-context.tsx`) administran el único estado compartido del shell: si el drawer de navegación móvil está abierto.
- `NAV_ITEMS` (`src/features/shell/config/nav-items.ts`) es la fuente única de las seis secciones del sidebar y alimenta también los accesos rápidos del Resumen.

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

La dirección visual es un minimalismo monocromo refinado: sin color de marca, con sombras discretas (`--ui-shadow-panel` reducida) y bordes sutiles u opacos (por ejemplo, el borde del sidebar usa `/60` de opacidad). `Panel` admite `variant="flat"` (sin borde ni sombra) para contenedores como las tablas, donde el color de superficie ya basta para diferenciarlo del fondo.

## Layout y responsive

- La estructura usa Flexbox y altura mínima completa. `AppShell` divide la pantalla en `Sidebar` + `MainRegion`.
- El breakpoint `lg` (1024px) separa el sidebar estático de escritorio del drawer de navegación móvil: por debajo de `lg` el `<nav>` del sidebar se desliza fuera de pantalla (`invisible -translate-x-full`) y se controla con `ShellProvider`; a partir de `lg` es siempre visible y estático.
- Mientras el drawer móvil está abierto, el contenido de `MainRegion` se marca `inert` para evitar que el foco de teclado se escape hacia el fondo sin necesitar un focus-trap manual; `ShellProvider` cierra el drawer automáticamente si la ventana cruza a tamaño de escritorio.
- El contenido principal de cada sección tiene `max-w-6xl` (definido en `SectionTemplate`).
- Las tarjetas forman una columna y cambian a dos o cuatro columnas en `sm`/`lg` según la sección.
- El padding aumenta a partir de `sm` y `lg`.

El espaciado significativo usa la escala `--ui-space-*`; Tailwind se usa como sintaxis de composición.

## Tipografía y encabezados

`Heading` separa semántica y presentación. `level` determina `h1`–`h6` y es obligatorio; `variant` determina `display`, `title`, `section` o `subsection`. Cada página conserva un único `h1` y no salta niveles por conseguir un tamaño visual.

`ContentHeader` compone eyebrow, heading y descripción cuando esa agrupación se repite. No debe reemplazar encabezados que requieren una estructura diferente.

## Catálogo y comprobación

`pnpm storybook` inicia el catálogo en `127.0.0.1:6006`. `pnpm test:storybook` ejecuta todas las stories en Chromium; los tests de interacción y las violaciones de axe configuradas como error fallan la ejecución.

## Accesibilidad observable

- Elementos semánticos `main`, `header`, `nav`, `section`, encabezados y formulario; un único landmark `<nav aria-label="Navegación principal">` compartido entre escritorio y móvil (no se duplica el sidebar).
- El enlace activo del sidebar usa `aria-current="page"` con una distinción visual adicional (negrita y subrayado) que no depende solo del color.
- El botón de menú móvil usa `aria-expanded`, `aria-controls` y `aria-label` dinámico; al abrir el drawer el foco se mueve al primer enlace, `Escape` lo cierra y al cerrarlo el foco regresa al botón que lo abrió.
- Labels asociados, descripciones mediante `aria-describedby` y errores con `role="alert"`.
- Estados de red y preview anunciados mediante regiones live (incluida la sección de métricas del Resumen y el resultado de desactivar/reactivar una fila).
- El `Modal` usa `aria-labelledby` hacia el título del formulario; al abrirse mueve el foco al primer campo (`autoFocus`) y al cerrarse lo devuelve al botón que lo abrió.
- Botones con foco visible y estados disabled.
- Tema oscuro según preferencias del sistema.
- `lang="es"`, coherente con el contenido actual.

## Patrones todavía inexistentes

No determinado a partir del código actual:

- Gráficas y visualizaciones financieras.
- Notificaciones e iconografía propia (el botón de menú móvil y los indicadores usan formas CSS, sin librería de iconos instalada). Los diálogos (`Modal`) y las tablas ya existen.
