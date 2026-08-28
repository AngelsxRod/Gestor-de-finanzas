# Roadmap

Este archivo comunica prioridades, no fechas ni compromisos de release. El estado implementado se describe en [`README.md`](README.md); las ideas futuras de arquitectura están en [`docs/architecture.md`](docs/architecture.md).

## Ahora: base técnica confiable

- Definir el primer flujo financiero y sus criterios de aceptación.
- [x] Diseñar el modelo inicial y decidir PostgreSQL + Drizzle mediante ADR-0001.
- [x] Añadir `.env.example` con configuración exclusivamente local.
- [x] Integrar `@gestor-finanzas/models` en la API y validar su configuración al iniciar.
- [x] Añadir Compose separados para desarrollo y producción self-hosted.
- Establecer integración continua para lint, tests y builds.
- Definir la estrategia de autenticación y protección de datos antes de almacenar información financiera real.

## Después: producto mínimo

- Registrar cuentas, categorías y movimientos.
- Consultar saldos e historial con filtros.
- Implementar presupuestos y resúmenes mensuales.
- Añadir persistencia, migraciones, backup y restauración.
- Cubrir los flujos críticos con tests unitarios, de integración y E2E.

## Más adelante

- Evaluar un cliente de API generado desde OpenAPI.
- Definir importación y exportación de datos.
- Añadir observabilidad respetuosa de la privacidad.
- Diseñar un procedimiento de despliegue y rollback reproducible.
- Evaluar sincronización o acceso remoto solo después de implementar los controles de seguridad necesarios.

## Fuera del alcance actual

- Integraciones bancarias.
- Uso multiusuario.
- Exposición pública de la API.
- Recomendaciones financieras automatizadas.

Las prioridades cambian mediante issues o PRs. Una decisión que altere límites, dependencias principales, persistencia, seguridad o despliegue debe acompañarse de un ADR.
