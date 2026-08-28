# Seguridad de la API

## Controles observados

- El host predeterminado es `127.0.0.1` y el puerto predeterminado es `3211`.
- `HOST` y `PORT` pueden cambiarse mediante variables de entorno.
- Los archivos `.env*` están ignorados por Git.

## Capacidades ausentes

No existen autenticación, autorización, CORS explícito, Helmet, rate limiting, persistencia, uploads, cifrado ni sesiones. `StandardSchemaValidationPipe` está registrado globalmente para los futuros esquemas de entrada.

## Telemetría

Nest Observe y sus credenciales placeholder fueron retirados. No hay exportación de telemetría configurada.

## Exposición de red

Cambiar `HOST` para escuchar fuera de loopback amplía la superficie de ataque. No realices ese cambio sin añadir y documentar autenticación, autorización, validación, límites de solicitudes y política CORS.

No existe `.env.example`; cualquier nueva variable debe documentarse sin incluir valores sensibles.
