# ADR-0005: Backups cifrados automatizados desde el host, no desde Compose

- Estado: aceptado
- Fecha: 2026-08-31
- Responsables: mantenedores del proyecto

## Contexto

`DEPLOYMENT.md` documentaba backup y restauración como comandos manuales
(`pg_dump`/`pg_restore` copiados y pegados) sin cifrado ni verificación
automatizada. `SECURITY.md` y `ROADMAP.md` ya exigían backups cifrados y
restauración probada antes de almacenar información financiera real. Faltaba
decidir tres cosas: quién dispara el backup periódicamente, con qué se cifra,
y cómo se comprueba que un backup realmente restaura.

## Opciones consideradas

1. **Programación dentro de Compose** (un servicio adicional en
   `compose.prod.yaml` que hace `sleep` + `pg_dump` en bucle): mantiene todo
   dentro de `docker compose up`, pero la imagen `postgres:18-alpine` no trae
   `openssl` — cifrar exigiría instalarlo en cada arranque del contenedor
   (dependencia de red en un despliegue pensado para funcionar sin ella) o
   mantener un `Dockerfile` propio solo para este servicio.
2. **Programación desde el host** (`scripts/backup.sh` invocado por cron o un
   timer de systemd): reutiliza `openssl` del host, que ya es un requisito
   implícito del proyecto (`DEPLOYMENT.md` ya lo usa para generar
   `POSTGRES_PASSWORD`), y no depende de que el contenedor tenga acceso a
   internet para funcionar. Es el mecanismo estándar para programar tareas en
   una sola computadora Linux, que es exactamente el objetivo de despliegue
   actual.
3. **Herramienta de backup gestionada** (pgBackRest, WAL-G, un servicio en la
   nube): resuelve retención y backups incrementales, pero añade
   infraestructura y credenciales externas que este MVP self-hosted de una
   sola computadora no necesita todavía.

## Decisión

Se elige la opción 2. `scripts/backup.sh` corre `pg_dump --format=custom`
dentro del servicio `postgres` de `compose.prod.yaml` vía
`docker compose exec` (autenticación local por socket, sin contraseña) y
cifra el resultado con `openssl enc -aes-256-cbc -pbkdf2` usando la frase en
`GESTOR_FINANZAS_BACKUP_PASSPHRASE`. Elimina backups más viejos que
`RETENTION_DAYS` (14 por omisión). `DEPLOYMENT.md` documenta cómo programarlo
con cron; el repositorio no instala esa entrada por el operador — es una
acción que modifica el host y depende de cada máquina.

`scripts/restore.sh` descifra un backup y lo restaura en una base de
verificación aislada (`gestor_finanzas_restore_check` por omisión) dentro del
mismo servicio `postgres`, nunca sobre la base real. No la elimina
automáticamente: imprime el comando para hacerlo después de inspeccionarla.
Este es el mecanismo para "probar la restauración" de forma repetible, no
solo documentada.

`backups/` (directorio por omisión de `scripts/backup.sh`) queda en
`.gitignore`: nunca debe versionarse un backup, cifrado o no.

## Consecuencias

- La automatización real (que el backup ocurra sin intervención) depende de
  que el operador registre la entrada de cron/systemd documentada en
  `DEPLOYMENT.md`; el repositorio por sí solo no la programa.
- La pérdida de `GESTOR_FINANZAS_BACKUP_PASSPHRASE` hace irrecuperables todos
  los backups cifrados con ella. Debe guardarse fuera del repositorio y del
  mismo disco que los backups, igual que `.env.production`.
- Los backups quedan en el disco local salvo que el operador los copie fuera
  de la máquina; este ADR no resuelve la réplica fuera de sitio (offsite),
  que sigue siendo responsabilidad manual del operador hasta que exista una
  necesidad concreta de automatizarla.
- `scripts/restore.sh` requiere que el servicio `postgres` de
  `compose.prod.yaml` esté corriendo; no crea un Postgres efímero aparte.

## Referencias

- [`DEPLOYMENT.md`](../../DEPLOYMENT.md)
- [`SECURITY.md`](../../SECURITY.md)
