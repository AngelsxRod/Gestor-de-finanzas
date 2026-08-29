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

## Tercer flujo vertical completado

- [x] Definir la desactivación reversible como única forma de "eliminar" cuentas y categorías (ADR-0002).
- [x] Implementar edición y desactivación/reactivación en API e interfaz para ambos módulos.
- [x] Rediseñar la web como un dashboard con shell de navegación, secciones por ruta y resumen general.

## Integración continua completada

- [x] Establecer integración continua para lint, tests y builds (`.github/workflows/ci.yml`).

## Cuarto flujo vertical completado

- [x] Implementar contratos, persistencia, endpoints e interfaz para registrar ingresos, gastos y transferencias.
- [x] Validar en la API lo que una sola tabla no puede expresar: cuentas y categorías activas, tipo de categoría coherente con el movimiento, y misma moneda entre las cuentas de una transferencia.
- [x] Cubrir contratos, servicio, repository, endpoints e interfaz con pruebas.

## Quinto flujo vertical completado

- [x] Extender la desactivación reversible a movimientos (ADR-0003) y agregar edición, reutilizando en la API las mismas reglas de negocio que la creación.
- [x] Agregar columna de estado y acciones (editar, desactivar/reactivar) a la tabla de movimientos.
- [x] Cubrir contratos, servicio, repository, endpoints e interfaz con pruebas.

## Producto mínimo incremental

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
