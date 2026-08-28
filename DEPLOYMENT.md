# Despliegue

## Estado actual

El repositorio todavía no define un destino de despliegue, CI/CD, contenedores, infraestructura ni estrategia de releases. La aplicación está configurada para uso local y ambos servidores escuchan en loopback por defecto.

Este documento describe únicamente cómo producir y comprobar artefactos; no debe interpretarse como un procedimiento de producción aprobado.

## Preparación

Requisitos:

- Node.js 24 o posterior.
- pnpm 11.18.0.
- dependencias instaladas con `pnpm install --frozen-lockfile`.

Antes de generar artefactos:

```bash
pnpm lint
pnpm test
pnpm build
```

El build web puede requerir acceso a Google Fonts. Consulta [`TESTING.md`](TESTING.md) si falla por red o por restricciones para abrir listeners.

## Ejecución de los builds

Después de `pnpm build`:

```bash
pnpm --filter @gestor-finanzas/web start
pnpm --filter @gestor-finanzas/api start:prod
```

La web usa `127.0.0.1:3210`. La API usa `HOST`, con valor predeterminado `127.0.0.1`, y `PORT`, con valor predeterminado `3211`. El health check está disponible en `GET /api/v1/health`.

No expongas la API a una interfaz pública cambiando `HOST` sin añadir antes autenticación, autorización, terminación TLS, límites de peticiones, gestión de secretos y una revisión de [`SECURITY.md`](SECURITY.md).

## Entornos

No existen configuraciones versionadas para desarrollo, staging o producción. Cuando se introduzcan:

- documenta cada variable en un `.env.example` sin valores secretos;
- almacena secretos en el gestor del proveedor, nunca en Git;
- separa datos y credenciales por entorno;
- usa builds reproducibles basados en `pnpm-lock.yaml`;
- ejecuta migraciones mediante un paso explícito, respaldado y reversible;
- conserva un health check y logs suficientes para verificar el release.

## Checklist de un futuro release

1. Confirmar que el commit desplegado fue revisado y está identificado con una etiqueta inmutable.
2. Ejecutar lint, tests, build y cualquier migración en un entorno equivalente.
3. Respaldar los datos antes de una migración destructiva.
4. Desplegar primero en staging y realizar una comprobación funcional.
5. Desplegar en producción sin incluir archivos `.env` ni artefactos locales.
6. Verificar web, health check, logs y métricas.
7. Documentar la versión y conservar un procedimiento de rollback probado.

La elección de proveedor, persistencia, dominio, HTTPS, observabilidad y automatización sigue pendiente y debe registrarse en un ADR antes de establecer un procedimiento definitivo.
