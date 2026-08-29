# Estilo de código de la API

- Usa TypeScript estricto, NestJS y módulos ESM.
- Mantén comillas simples, comas finales y punto y coma.
- Usa extensiones `.js` en imports relativos por la configuración NodeNext.
- Nombra clases en PascalCase con sufijos NestJS: `Module`, `Controller` y `Service`.
- Nombra archivos con los sufijos equivalentes: `.module.ts`, `.controller.ts` y `.service.ts`.
- Recibe dependencias por constructor como `private readonly`.
- Delega comportamiento desde controladores hacia servicios.
- Usa decoradores NestJS para módulos, controladores, rutas y providers.
- Agrupa controller, service, schemas y tests relacionados bajo `src/modules/<feature>`.
- Mantén `AppModule` como punto de composición; no coloques comportamiento de feature en él.
- Usa `@gestor-finanzas/contracts` para datos que cruzan HTTP y el pipe de Standard Schema para validar entradas Zod.

Herramientas locales:

- Oxlint revisa `src/` y `test/`.
- Prettier formatea `src/**/*.ts` y `test/**/*.ts`.
- `no-explicit-any` está desactivada.
- Las promesas sin manejar generan advertencias.

La conexión y el esquema de persistencia pertenecen a `@gestor-finanzas/models` y su ciclo de vida se integra mediante `DatabaseModule`. Cuentas usa un repository pequeño para encapsular consultas Drizzle y un servicio para reglas y errores públicos; reutiliza ese patrón solo cuando otro flujo demuestre que encaja. Todavía no hay una convención observable para logging o filtros de excepciones.
