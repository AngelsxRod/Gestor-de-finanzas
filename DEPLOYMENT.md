# Despliegue self-hosted

El repositorio ofrece dos configuraciones independientes:

- `compose.dev.yaml`: solo PostgreSQL; web y API se ejecutan localmente con hot reload.
- `compose.prod.yaml`: PostgreSQL, migraciones, API y web en contenedores de producción.

La configuración está diseñada para una única computadora. En producción solo la web se publica en `127.0.0.1`; API y PostgreSQL permanecen dentro de la red de Docker.

## Desarrollo

Requisitos: Node.js 24+, pnpm 11.18.0 y Docker con Compose.

```bash
cp .env.example .env
pnpm install --frozen-lockfile
docker compose -f compose.dev.yaml up -d --wait
pnpm db:migrate
pnpm dev
```

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

La aplicación queda disponible en `http://127.0.0.1:3210`. No cambies el binding a `0.0.0.0` ni configures acceso desde Internet mientras no exista autenticación y autorización.

## Actualizaciones

Haz primero un backup. Después actualiza el código y reconstruye:

```bash
git pull --ff-only
docker compose --env-file .env.production -f compose.prod.yaml up -d --build --wait
```

La tarea `migrate` es idempotente: Drizzle aplica únicamente migraciones pendientes. Revisa el SQL y sus requisitos de rollback antes de desplegar un cambio de esquema.

## Backup y restauración

Crear un backup lógico:

```bash
docker compose --env-file .env.production -f compose.prod.yaml exec -T postgres sh -c 'pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" --format=custom' > gestor-finanzas.backup
```

Guarda el archivo cifrado y fuera del mismo disco que contiene el volumen. Verifica periódicamente la restauración en una base aislada.

Restaurar reemplaza datos y requiere una ventana de mantenimiento. Detén web y API, confirma el destino y usa `pg_restore` desde el contenedor; no ejecutes una restauración sobre producción sin un backup reciente.

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

La guía oficial de Next.js recomienda un reverse proxy para self-hosting. Cuando la aplicación tenga autenticación, coloca Caddy, nginx o equivalente delante de `127.0.0.1:3210` para administrar HTTPS, límites de peticiones y tráfico malformado. No publiques los puertos internos de API o PostgreSQL.

Siguen pendientes antes de almacenar datos financieros reales: autenticación, autorización, política de sesiones, estrategia de backups automatizados, restauración probada y actualización segura del host.
