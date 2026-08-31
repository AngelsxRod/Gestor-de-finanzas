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

Toda la aplicación exige sesión: `proxy.ts` (raíz del paquete) verifica la cookie de sesión antes de servir `/`, `/cuentas`, `/categorias`, `/movimientos`, `/presupuestos` o `/configuracion`, y redirige a `/login` sin renderizar nada del dashboard si falta o es inválida. Esas rutas viven en el route group `app/(dashboard)/`, que aplica el shell (sidebar, drawer móvil, encabezado por sección); `/login` queda fuera del grupo y no lo hereda.

El dashboard tiene las rutas `/` (resumen con métricas), `/cuentas`, `/categorias`, `/movimientos` y `/presupuestos` (flujos completos de creación, edición y desactivación) y `/configuracion` (sección planificada en el roadmap, sin backend todavía, mostrada como "próximamente"). Cuentas, categorías, movimientos y presupuestos consultan sus endpoints y muestran los registros en una tabla con estados de carga, error, vacío y éxito, columna de estado (Activo/Inactivo) y acciones de editar y desactivar/reactivar por fila; el botón principal del header ("Nueva cuenta"/"Nueva categoría"/"Nuevo movimiento"/"Nuevo presupuesto") abre un modal con el formulario correspondiente, reutilizado también para editar. El formulario de movimientos alterna entre categoría y cuenta destino según el tipo elegido (ingreso, gasto o transferencia) y no pide moneda: la API la deriva de la cuenta. La tabla de cuentas muestra el saldo real (saldo de apertura más movimientos activos) y la de movimientos ofrece filtros por cuenta, categoría, tipo, rango de fechas y estado; la de presupuestos se filtra por mes y muestra el gasto real y lo restante frente al límite de cada categoría. Tras cualquier cambio se invalida la consulta correspondiente para actualizar la tabla. El sidebar muestra el usuario autenticado y un botón para cerrar sesión. Peticiones y respuestas se validan con los contratos Zod compartidos; un 401 fuerza una navegación completa a `/login`.

El código se organiza por features bajo `src/features`: `accounts`, `categories`, `transactions`, `budgets` y `auth` (dominio), `overview` (resumen que reutiliza sus hooks de React Query) y `shell` (navegación, encabezado de sección y plantillas de layout). Los componentes compartidos proceden de `@gestor-finanzas/ui`, las respuestas HTTP se validan con `@gestor-finanzas/contracts` y Storybook prueba el catálogo Atomic Design con Vitest, Playwright y axe.

El build carga Geist desde Google Fonts y requiere acceso de red o una copia disponible en caché.

## Documentación local

- [AGENTS.md](AGENTS.md)
- [DESIGN.md](DESIGN.md)
- [STYLEGUIDE.md](STYLEGUIDE.md)

Para arquitectura, testing y seguridad transversal consulta la documentación de la raíz.
