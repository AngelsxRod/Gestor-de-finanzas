# Seguridad

## Controles transversales observados

- El repositorio ignora archivos `.env*`; no deben versionarse secretos.
- La web y la API escuchan en `127.0.0.1` de forma predeterminada.
- La API permite configurar `HOST` y `PORT`; ampliar su exposición fuera de loopback requiere revisar antes sus controles HTTP.
- Autenticación de un solo usuario (`ADMIN_USERNAME`/`ADMIN_PASSWORD_HASH` vía variables de entorno, sin tabla `users`) y sesión por cookie firmada sin estado (`jose`, HS256, 12h); un guard global exige sesión en toda la API salvo el health check y el propio login (ver [ADR-0006](docs/adr/0006-autenticacion-sesion-cookie-firmada.md)). No hay gestión centralizada de secretos más allá de `.env`/`.env.production`.
- La API integra el cliente PostgreSQL, administra su cierre y expone creación y consulta de cuentas y categorías. Los errores públicos de duplicados no incluyen consultas, restricciones ni otros detalles internos de PostgreSQL.
- La integración placeholder de Nest Observe fue retirada; actualmente no hay exportación de telemetría configurada.
- PostgreSQL local escucha en `127.0.0.1`; las credenciales de `.env.example` son solo para desarrollo y deben reemplazarse en cualquier despliegue.

La exposición HTTP y las capacidades ausentes de la API se documentan en [`apps/api/SECURITY.md`](apps/api/SECURITY.md).

`DATABASE_URL` contiene credenciales y nunca debe registrarse en logs, issues o commits. En producción debe provenir del gestor de secretos del entorno y usar un usuario de aplicación con privilegios mínimos. `scripts/backup.sh` cifra cada backup (`openssl enc -aes-256-cbc -pbkdf2`) con la frase de `GESTOR_FINANZAS_BACKUP_PASSPHRASE`, que debe guardarse fuera del repositorio y del mismo disco que los backups; `scripts/restore.sh` verifica la restauración en una base aislada, nunca sobre la real (ver [ADR-0005](docs/adr/0005-backups-cifrados-con-cron-del-host.md) y [`DEPLOYMENT.md`](DEPLOYMENT.md)). Programar el backup periódico (cron/systemd) y copiar los archivos fuera de esta máquina siguen siendo responsabilidad del operador.

`SESSION_SECRET` firma y verifica la cookie de sesión tanto en `api` como en `web`; debe ser idéntico en ambos servicios y tratarse como secreto igual que `DATABASE_URL`. Rotarlo invalida todas las sesiones activas. La cookie no se marca `secure` porque el despliegue actual no garantiza HTTPS (ver ADR-0006); no la sirvas fuera de una red que confíes hasta que exista un reverse proxy con HTTPS delante.

El Compose de producción publica únicamente la web en `127.0.0.1`. No cambies ese binding a `0.0.0.0` ni lo expongas mediante un proxy, túnel o router sin antes agregar HTTPS: la autenticación y autorización ya existen, pero la cookie de sesión viaja sin cifrar en HTTP.

La web valida entradas con el contrato compartido y vuelve a validar las respuestas HTTP. Estas validaciones mejoran la integridad de la interfaz, pero no sustituyen los controles de exposición de red descritos arriba.
