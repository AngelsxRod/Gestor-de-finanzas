# Seguridad

## Controles transversales observados

- El repositorio ignora archivos `.env*`; no deben versionarse secretos.
- La web y la API escuchan en `127.0.0.1` de forma predeterminada.
- La API permite configurar `HOST` y `PORT`; ampliar su exposición fuera de loopback requiere revisar antes sus controles HTTP.
- No hay autenticación, autorización, integración de persistencia en runtime ni gestión centralizada de secretos implementadas.
- La integración placeholder de Nest Observe fue retirada; actualmente no hay exportación de telemetría configurada.
- PostgreSQL local escucha en `127.0.0.1`; las credenciales de `.env.example` son solo para desarrollo y deben reemplazarse en cualquier despliegue.

La exposición HTTP y las capacidades ausentes de la API se documentan en [`apps/api/SECURITY.md`](apps/api/SECURITY.md).

`DATABASE_URL` contiene credenciales y nunca debe registrarse en logs, issues o commits. En producción debe provenir del gestor de secretos del entorno y usar un usuario de aplicación con privilegios mínimos. Los backups y restauraciones deben cifrarse y probarse antes de almacenar información financiera real.

No existe una guía de seguridad local para la web porque el código actual no aporta reglas específicas suficientes. Si se añaden entrada de usuario, sesión, consumo de API o manejo de datos financieros, habrá que definir y documentar los controles correspondientes.
