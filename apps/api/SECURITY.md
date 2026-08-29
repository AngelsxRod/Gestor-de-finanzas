# Seguridad de la API

## Controles observados

- El host predeterminado es `127.0.0.1` y el puerto predeterminado es `3211`.
- `HOST` y `PORT` pueden cambiarse mediante variables de entorno.
- Los archivos `.env*` están ignorados por Git.

## Base de datos

`DATABASE_URL` es obligatoria y se valida antes de crear la aplicación. `DatabaseService` cierra el cliente PostgreSQL durante el apagado ordenado. La URL contiene credenciales: no debe aparecer en logs, errores públicos o archivos versionados. Los flujos de cuentas y categorías traducen únicamente sus restricciones de unicidad conocidas a errores públicos y no exponen consultas ni causas de PostgreSQL.

## Capacidades ausentes

No existen autenticación, autorización, CORS explícito, Helmet, rate limiting, uploads, cifrado ni sesiones. `StandardSchemaValidationPipe` valida y transforma la entrada de cuentas y categorías; estas garantías de forma no sustituyen controles de identidad o permisos.

## Telemetría

Nest Observe y sus credenciales placeholder fueron retirados. No hay exportación de telemetría configurada.

## Exposición de red

Cambiar `HOST` para escuchar fuera de loopback amplía la superficie de ataque. No realices ese cambio sin añadir y documentar autenticación, autorización, validación, límites de solicitudes y política CORS.

Los archivos `.env.example` documentan nombres y valores exclusivamente locales. Nunca copies sus credenciales a producción.
