# Seguridad

## Controles transversales observados

- El repositorio ignora archivos `.env*`; no deben versionarse secretos.
- La web y la API escuchan en `127.0.0.1` de forma predeterminada.
- La API permite configurar `HOST` y `PORT`; ampliar su exposición fuera de loopback requiere revisar antes sus controles HTTP.
- No hay autenticación, autorización ni gestión centralizada de secretos implementadas.
- La API integra el cliente PostgreSQL, administra su cierre y expone creación y consulta de cuentas y categorías. Los errores públicos de duplicados no incluyen consultas, restricciones ni otros detalles internos de PostgreSQL.
- La integración placeholder de Nest Observe fue retirada; actualmente no hay exportación de telemetría configurada.
- PostgreSQL local escucha en `127.0.0.1`; las credenciales de `.env.example` son solo para desarrollo y deben reemplazarse en cualquier despliegue.

La exposición HTTP y las capacidades ausentes de la API se documentan en [`apps/api/SECURITY.md`](apps/api/SECURITY.md).

`DATABASE_URL` contiene credenciales y nunca debe registrarse en logs, issues o commits. En producción debe provenir del gestor de secretos del entorno y usar un usuario de aplicación con privilegios mínimos. `scripts/backup.sh` cifra cada backup (`openssl enc -aes-256-cbc -pbkdf2`) con la frase de `GESTOR_FINANZAS_BACKUP_PASSPHRASE`, que debe guardarse fuera del repositorio y del mismo disco que los backups; `scripts/restore.sh` verifica la restauración en una base aislada, nunca sobre la real (ver [ADR-0005](docs/adr/0005-backups-cifrados-con-cron-del-host.md) y [`DEPLOYMENT.md`](DEPLOYMENT.md)). Programar el backup periódico (cron/systemd) y copiar los archivos fuera de esta máquina siguen siendo responsabilidad del operador.

El Compose de producción publica únicamente la web en `127.0.0.1`. No cambies ese binding a `0.0.0.0` ni lo expongas mediante un proxy, túnel o router mientras la aplicación no tenga autenticación y autorización.

La web valida entradas con el contrato compartido y vuelve a validar las respuestas HTTP. Estas validaciones mejoran la integridad de la interfaz, pero no sustituyen autenticación, autorización ni controles de exposición de red.
