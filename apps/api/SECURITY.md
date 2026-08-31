# Seguridad de la API

## Controles observados

- El host predeterminado es `127.0.0.1` y el puerto predeterminado es `3211`.
- `HOST` y `PORT` pueden cambiarse mediante variables de entorno.
- Los archivos `.env*` están ignorados por Git.

## Base de datos

`DATABASE_URL` es obligatoria y se valida antes de crear la aplicación. `DatabaseService` cierra el cliente PostgreSQL durante el apagado ordenado. La URL contiene credenciales: no debe aparecer en logs, errores públicos o archivos versionados. Los flujos de cuentas y categorías traducen únicamente sus restricciones de unicidad conocidas a errores públicos y no exponen consultas ni causas de PostgreSQL.

## Autenticación y sesiones

`AuthGuard` (`APP_GUARD` global) exige la cookie de sesión en toda ruta sin `@Public()`: solo `GET /api/v1/health`, `POST /api/v1/auth/login` y `POST /api/v1/auth/logout` quedan fuera. `POST /api/v1/auth/login` valida usuario y contraseña (`crypto.scrypt`) contra `ADMIN_USERNAME`/`ADMIN_PASSWORD_HASH`, siempre corre la comparación completa (incluso con usuario inexistente, contra un hash señuelo) para no filtrar por tiempo qué campo falló, y está limitado a 5 intentos por minuto (`@nestjs/throttler`) contra fuerza bruta. La sesión es un JWT HS256 (`jose`) firmado con `SESSION_SECRET`, sin estado ni tabla de sesiones — no hay revocación individual, solo rotar el secreto invalida todo. Ver [ADR-0006](../../docs/adr/0006-autenticacion-sesion-cookie-firmada.md).

## Capacidades ausentes

No existen CORS explícito, Helmet, uploads, cifrado en tránsito propio (depende de un reverse proxy futuro) ni multiusuario/recuperación de contraseña. `StandardSchemaValidationPipe` valida y transforma la entrada; estas garantías de forma no sustituyen los controles de identidad y permisos ya descritos arriba.

## Telemetría

Nest Observe y sus credenciales placeholder fueron retirados. No hay exportación de telemetría configurada.

## Exposición de red

Cambiar `HOST` para escuchar fuera de loopback amplía la superficie de ataque. Autenticación, autorización y límites de solicitudes de login ya existen, pero la cookie de sesión no se marca `secure` (el despliegue actual no garantiza HTTPS): no realices ese cambio sin antes añadir HTTPS/reverse proxy y una política CORS explícita.

Los archivos `.env.example` documentan nombres y valores exclusivamente locales. Nunca copies sus credenciales a producción.
