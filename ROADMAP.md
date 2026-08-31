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

## Sexto flujo vertical completado

- [x] Calcular el saldo real de cada cuenta (saldo de apertura más sus movimientos activos) en SQL, sin aritmética de punto flotante, y mostrarlo en la tabla de cuentas.
- [x] Agregar filtros opcionales por cuenta, categoría, tipo, rango de fechas y estado al historial de movimientos, en la API y en la interfaz.
- [x] Cubrir el cálculo de saldos y los filtros con pruebas de contrato, unitarias y de integración.

## Séptimo flujo vertical completado

- [x] Definir el modelo de presupuestos mensuales por categoría de gasto, con moneda explícita y gasto siempre calculado (ADR-0004).
- [x] Implementar contratos, persistencia, endpoints e interfaz para crear, editar, desactivar/reactivar y consultar presupuestos por mes, incluido el resumen de gastado y restante.
- [x] Cubrir contratos, servicio, repository, endpoints e interfaz con pruebas.

## Producto mínimo incremental completado

- [x] Cubrir cada flujo con tests unitarios, de integración y E2E proporcionales a su riesgo: saldos, filtros de movimientos y presupuestos ya tienen los tres niveles, y CI levanta PostgreSQL para correr integración y E2E en cada push y pull request (antes solo corrían localmente).
- [x] Automatizar backups y comprobar la restauración antes de usar información financiera real: `scripts/backup.sh` cifra y rota los backups, `scripts/restore.sh` verifica la restauración en una base aislada (ADR-0005). Programar la ejecución periódica (cron/systemd) y copiar los backups fuera de la máquina siguen siendo responsabilidad del operador — ver `DEPLOYMENT.md`.
- [x] Definir autenticación, autorización y sesiones antes de almacenar información real o ampliar el acceso más allá de la computadora local: un solo usuario vía variables de entorno, sesión por cookie firmada sin estado (`jose`, 12h), verificada de forma independiente por la API (guard global) y por la web (`proxy.ts`) (ADR-0006). Sigue pendiente añadir HTTPS/reverse proxy antes de aceptar tráfico fuera de esta computadora — ver `DEPLOYMENT.md`.

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
