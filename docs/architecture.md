# Dirección objetivo de arquitectura

> Este documento describe hacia dónde debe evolucionar el producto. Para la arquitectura implementada y comprobable consulta [`ARCHITECTURE.md`](../ARCHITECTURE.md); para el orden de entrega consulta [`ROADMAP.md`](../ROADMAP.md).

## Objetivo de producto

El proyecto aspira a ser una aplicación personal de finanzas self-hosted para registrar cuentas, categorías, ingresos, gastos y transferencias; consultar saldos e historial; y administrar presupuestos y resúmenes mensuales.

El primer alcance seguirá siendo de una sola persona y una sola instalación. Integraciones bancarias, uso multiusuario, exposición pública de la API y recomendaciones financieras automatizadas permanecen fuera del alcance actual.

## Evolución por flujos verticales

La arquitectura crecerá mediante flujos completos y pequeños, no mediante capas o abstracciones creadas por anticipado. El flujo de alta y consulta de cuentas ya recorre:

```text
Next.js
  └─► contrato HTTP Zod
        └─► controller y servicio NestJS
              └─► acceso Drizzle
                    └─► PostgreSQL
```

El siguiente flujo incorporará categorías; después vendrán movimientos, saldos e historial, presupuestos y resúmenes mensuales. Cada flujo debe incluir validación, manejo de errores y pruebas en las fronteras que afecte.

## Responsabilidades objetivo

- `apps/web` presentará los flujos financieros y administrará su estado remoto con React Query. No accederá directamente a PostgreSQL ni contendrá reglas financieras autoritativas.
- `apps/api` será propietaria de casos de uso, autorización, validaciones entre tablas y transacciones de aplicación. Los controllers conservarán el transporte separado de las reglas de negocio.
- `packages/contracts` publicará únicamente los esquemas y tipos que crucen la frontera HTTP.
- `packages/models` continuará siendo propietario del esquema Drizzle, la conexión y las migraciones PostgreSQL; no absorberá reglas de negocio.
- `packages/ui` seguirá conteniendo primitivas visuales sin conocimiento del dominio.
- `packages/api-client` y `packages/tooling` solo se activarán cuando exista un consumidor y una necesidad demostrables.

El flujo de cuentas demostró una separación pequeña entre controller, servicio y repository Drizzle. Los siguientes dominios reutilizarán ese patrón solo si encaja con sus necesidades. No se adopta por anticipado CQRS, DDD, una arquitectura hexagonal ni un cliente generado desde OpenAPI.

## Persistencia y dinero

PostgreSQL 18 y Drizzle ORM son la decisión vigente. El modelo inicial ya representa cuentas, categorías y movimientos, y utiliza `numeric(19,4)` como texto en TypeScript para conservar precisión.

La API deberá asegurar las reglas que no pueden expresarse por completo con restricciones de una sola tabla, como compatibilidad de moneda, tipo de categoría y movimiento. Las transferencias entre monedas distintas y la contabilidad de partida doble permanecen fuera del MVP hasta que una nueva decisión de arquitectura las defina.

## Seguridad y operación

El despliegue objetivo continúa siendo self-hosted. La configuración actual de producción ejecuta PostgreSQL, migraciones, API y web, y publica únicamente la web en loopback.

Antes de almacenar información financiera real o permitir acceso desde otros dispositivos deben existir y probarse:

- autenticación, autorización y política de sesiones;
- protección contra exposición accidental de API y PostgreSQL;
- backups automatizados, cifrados y restauraciones verificadas;
- actualización y rollback reproducibles;
- manejo seguro de secretos y registros sin datos sensibles.

El acceso remoto, un reverse proxy y HTTPS se evaluarán después de estos controles. Observabilidad, importación, exportación y cliente OpenAPI son mejoras posteriores, no requisitos del primer flujo.
