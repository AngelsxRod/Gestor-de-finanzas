# @gestor-finanzas/contracts

Contratos HTTP compartidos entre la API y sus consumidores. Cada contrato exporta un esquema Zod para validación en runtime y el tipo TypeScript inferido correspondiente.

Actualmente exporta el contrato de respuesta de `GET /api/v1/health` y los esquemas de petición, respuesta y error de cuentas y categorías. Los contratos de creación normalizan sus nombres; cuentas también normaliza moneda e importe decimal sin convertir dinero a `number`. Los contratos de movimientos se incorporarán con su flujo vertical.

Este paquete no contiene lógica de negocio, componentes React ni clientes HTTP.
