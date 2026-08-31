# Despliegue self-hosted

El repositorio ofrece dos configuraciones independientes:

- `compose.dev.yaml`: solo PostgreSQL; web y API se ejecutan localmente con hot reload.
- `compose.prod.yaml`: PostgreSQL, migraciones, API y web en contenedores de producción.

La configuración está diseñada para una única computadora. En producción solo la web se publica en `127.0.0.1`; API y PostgreSQL permanecen dentro de la red de Docker.

## Desarrollo

Requisitos: Node.js 24+, pnpm 11.18.0 y Docker con Compose.

```bash
cp .env.example .env
cp apps/web/.env.local.example apps/web/.env.local
pnpm install --frozen-lockfile
docker compose -f compose.dev.yaml up -d --wait
pnpm db:migrate
pnpm dev
```

`SESSION_SECRET` debe ser idéntico en `.env` y `apps/web/.env.local`: la API firma la cookie de sesión y la web la verifica de forma independiente en `proxy.ts`. `.env.example` ya trae un usuario y contraseña de desarrollo fijos (documentados en el propio archivo); cámbialos fuera del desarrollo local.

Servicios locales:

- Web: `http://127.0.0.1:3210`.
- API: `http://127.0.0.1:3211/api/v1/health`.
- PostgreSQL: `127.0.0.1:55432`.

Para detener únicamente la base:

```bash
docker compose -f compose.dev.yaml down
```

El volumen `postgres-dev-data` se conserva. Añadir `--volumes` lo elimina junto con todos sus datos.

## Producción local

No uses `.env.production.example` directamente: contiene credenciales deliberadamente inseguras.

```bash
cp .env.production.example .env.production
openssl rand -hex 32
```

Copia el valor generado tanto en `POSTGRES_PASSWORD` como dentro de `DATABASE_URL`. La contraseña debe estar codificada para URL si contiene caracteres reservados; `openssl rand -hex 32` evita ese problema. El archivo `.env.production` está ignorado por Git.

Genera también las credenciales de autenticación (ver [ADR-0006](docs/adr/0006-autenticacion-sesion-cookie-firmada.md)):

```bash
node scripts/hash-password.mts "una-contraseña-larga"
openssl rand -hex 32
```

Copia el resultado del primer comando en `ADMIN_PASSWORD_HASH`, el usuario elegido en `ADMIN_USERNAME`, y el resultado del segundo comando en `SESSION_SECRET`. `SESSION_SECRET` firma y verifica la misma cookie tanto en `api` como en `web`; usa el mismo valor en ambos servicios de `compose.prod.yaml` (ya está resuelto: ambos leen la variable del mismo `.env.production`).

Antes de desplegar:

```bash
pnpm lint
pnpm test
pnpm build
docker compose --env-file .env.production -f compose.prod.yaml config --quiet
```

Construye e inicia el stack:

```bash
docker compose --env-file .env.production -f compose.prod.yaml up -d --build --wait
```

Compose espera a PostgreSQL, ejecuta las migraciones pendientes una sola vez, inicia la API y finalmente la web. Comprueba el resultado:

```bash
curl --fail http://127.0.0.1:3210/
curl --fail http://127.0.0.1:3210/api/v1/health
docker compose --env-file .env.production -f compose.prod.yaml ps
```

La aplicación queda disponible en `http://127.0.0.1:3210`. Ya existen autenticación y autorización (ver [ADR-0006](docs/adr/0006-autenticacion-sesion-cookie-firmada.md)), pero eso no basta para exponerla a Internet sin los controles descritos en [Seguridad y acceso remoto](#seguridad-y-acceso-remoto): no cambies el binding a `0.0.0.0` ni configures acceso desde Internet sin resolverlos primero.

## Actualizaciones

Corre primero `./scripts/backup.sh` (ver [Backup y restauración](#backup-y-restauración)). Después actualiza el código y reconstruye:

```bash
git pull --ff-only
docker compose --env-file .env.production -f compose.prod.yaml up -d --build --wait
```

La tarea `migrate` es idempotente: Drizzle aplica únicamente migraciones pendientes. Revisa el SQL y sus requisitos de rollback antes de desplegar un cambio de esquema.

## Backup y restauración

`scripts/backup.sh` crea un backup lógico cifrado (`openssl enc -aes-256-cbc -pbkdf2`) del servicio `postgres` de `compose.prod.yaml` y elimina los backups más viejos que `RETENTION_DAYS` (14 por omisión). Necesita una frase de cifrado en `GESTOR_FINANZAS_BACKUP_PASSPHRASE`, que debe guardarse fuera del repositorio y del mismo disco que los backups: perderla hace irrecuperables todos los backups cifrados con ella.

```bash
export GESTOR_FINANZAS_BACKUP_PASSPHRASE="una frase larga, guardada aparte"
./scripts/backup.sh
```

Por omisión escribe en `./backups/` (ignorado por Git; nunca versiones un backup). `COMPOSE_FILE`, `ENV_FILE`, `BACKUP_DIR` y `RETENTION_DAYS` son configurables como variables de entorno si necesitas otra ubicación. Copia los archivos generados fuera de esta máquina — el script solo resuelve la creación y retención locales, no la réplica fuera de sitio (ver [ADR-0005](docs/adr/0005-backups-cifrados-con-cron-del-host.md)).

### Programar backups automáticos

El repositorio no instala ninguna tarea programada por ti: agrega una entrada de cron (o un timer de systemd) en el host, por ejemplo para correr todos los días a la 01:00:

```cron
0 1 * * * GESTOR_FINANZAS_BACKUP_PASSPHRASE="$(cat /ruta/segura/backup-passphrase)" /ruta/al/repo/scripts/backup.sh >> /var/log/gestor-finanzas-backup.log 2>&1
```

Guarda la frase de cifrado en un archivo con permisos restringidos (`chmod 600`), nunca directamente en el crontab.

### Verificar una restauración

`scripts/restore.sh` descifra un backup y lo restaura en una base de verificación aislada (`gestor_finanzas_restore_check` por omisión) dentro del mismo servicio `postgres` — nunca toca la base real:

```bash
export GESTOR_FINANZAS_BACKUP_PASSPHRASE="una frase larga, guardada aparte"
./scripts/restore.sh backups/gestor-finanzas-20260831T071954Z.backup.enc
```

Imprime cuántas tablas encontró y el comando para eliminar la base de verificación cuando termines de inspeccionarla. Corre este simulacro de restauración periódicamente, no solo la primera vez, para confirmar que los backups siguen siendo restaurables.

Restaurar sobre la base real reemplaza datos y requiere una ventana de mantenimiento: detén web y API, confirma el destino y usa `pg_restore` directamente contra `postgres` (no `scripts/restore.sh`, que solo restaura en la base de verificación); no ejecutes una restauración sobre producción sin un backup reciente y ya verificado.

## Operación

Ver logs:

```bash
docker compose --env-file .env.production -f compose.prod.yaml logs -f --tail=200
```

Detener los contenedores conservando datos:

```bash
docker compose --env-file .env.production -f compose.prod.yaml down
```

No uses `down --volumes` en producción: elimina permanentemente la base PostgreSQL.

## Seguridad y acceso remoto

La guía oficial de Next.js recomienda un reverse proxy para self-hosting. Antes de aceptar tráfico fuera de esta computadora, coloca Caddy, nginx o equivalente delante de `127.0.0.1:3210` para administrar HTTPS, límites de peticiones y tráfico malformado — la cookie de sesión todavía no se marca `secure` porque el despliegue actual no garantiza HTTPS (ver [ADR-0006](docs/adr/0006-autenticacion-sesion-cookie-firmada.md)). No publiques los puertos internos de API o PostgreSQL.

Sigue pendiente antes de almacenar datos financieros reales: actualización segura del host. Autenticación, autorización, sesiones (ver [ADR-0006](docs/adr/0006-autenticacion-sesion-cookie-firmada.md)) y backups cifrados con restauración probada (ver [Backup y restauración](#backup-y-restauración)) ya están resueltos, aunque programar el backup periódico, copiarlo fuera de esta máquina, y añadir HTTPS antes de exponerse a otras redes siguen siendo tareas del operador.
