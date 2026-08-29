# Roadmap

Este archivo comunica prioridades, no fechas ni compromisos de release. El estado implementado se describe en [`README.md`](README.md) y [`ARCHITECTURE.md`](ARCHITECTURE.md); la dirección objetivo está en [`docs/architecture.md`](docs/architecture.md).

## Base técnica completada

- [x] Diseñar el modelo inicial y decidir PostgreSQL + Drizzle mediante ADR-0001.
- [x] Añadir `.env.example` con configuración exclusivamente local.
- [x] Integrar `@gestor-finanzas/models` en la API y validar su configuración al iniciar.
- [x] Añadir Compose separados para desarrollo y producción self-hosted.

## Primer flujo vertical completado

- [x] Definir los contratos para crear, listar y reportar errores de cuentas.
- [x] Implementar alta y consulta mediante NestJS y Drizzle.
- [x] Añadir la interfaz con estados de carga, error, vacío y éxito.
- [x] Cubrir contratos, servicio, repository, endpoints e interfaz con pruebas.

## Segundo flujo vertical completado

- [x] Definir los criterios de aceptación para categorías de ingreso y gasto.
- [x] Implementar contratos, persistencia, endpoints e interfaz de categorías.
- [x] Cubrir validación, duplicados por tipo, orden, estados visuales y accesibilidad.

## Ahora

- Establecer integración continua para lint, tests y builds.

## Después: producto mínimo incremental

- Registrar ingresos, gastos y transferencias.
- Consultar saldos e historial con filtros.
- Implementar presupuestos y resúmenes mensuales.
- Cubrir cada flujo con tests unitarios, de integración y E2E proporcionales a su riesgo.
- Automatizar backups y comprobar la restauración antes de usar información financiera real.
- Definir autenticación, autorización y sesiones antes de almacenar información real o ampliar el acceso más allá de la computadora local.

## Más adelante

- Evaluar un cliente de API generado desde OpenAPI.
- Definir importación y exportación de datos.
- Añadir observabilidad respetuosa de la privacidad.
- Formalizar actualizaciones y rollback más allá del procedimiento self-hosted actual.
- Evaluar sincronización o acceso remoto solo después de implementar los controles de seguridad necesarios.

## Fuera del alcance actual

- Integraciones bancarias.
- Uso multiusuario.
- Exposición pública de la API.
- Recomendaciones financieras automatizadas.

Las prioridades cambian mediante issues o PRs. Una decisión que altere límites, dependencias principales, persistencia, seguridad o despliegue debe acompañarse de un ADR.
