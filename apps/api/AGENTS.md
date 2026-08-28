# Instrucciones para la API

Estas reglas complementan el `AGENTS.md` de la raíz y se aplican a `apps/api`.

## Antes de modificar

- Lee `STYLEGUIDE.md` para convenciones NestJS, ESM y formato.
- Lee `TESTING.md` para elegir unitarios o E2E y ejecutar los comandos correctos.
- Lee `SECURITY.md` antes de tocar `HOST`, `PORT`, entrada HTTP, telemetría o credenciales.
- Revisa `tsconfig.json`, `tsconfig.build.json`, `oxlint.json` y la configuración Vitest relacionada con el cambio.

## Reglas

- Mantén las extensiones `.js` en imports relativos TypeScript porque el workspace usa NodeNext.
- Conserva la separación por feature modules entre módulo, controlador y servicio.
- Mantén el prefijo `/api/v1` y aplica `configureApp()` en cualquier bootstrap o test de integración.
- Usa `@gestor-finanzas/contracts` para los contratos HTTP compartidos.
- No introduzcas persistencia o autenticación como si ya fueran convenciones existentes.
- No pongas secretos reales en `app.module.ts` ni en archivos versionados.
- La API debe seguir enlazada a `127.0.0.1` salvo que el cambio incluya los controles de seguridad necesarios.

## Verificación

Desde la raíz:

```bash
pnpm --filter @gestor-finanzas/api lint
pnpm --filter @gestor-finanzas/api test
pnpm --filter @gestor-finanzas/api build
pnpm --filter @gestor-finanzas/api test:e2e
```

El E2E necesita que el entorno permita abrir un listener local.
