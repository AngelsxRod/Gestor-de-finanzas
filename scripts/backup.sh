#!/usr/bin/env bash
set -euo pipefail

# Crea un backup lógico cifrado de PostgreSQL desde el stack de producción
# (compose.prod.yaml) y elimina los backups más viejos que RETENTION_DAYS.
# Pensado para correr manualmente o desde cron/systemd; ver DEPLOYMENT.md.
#
# Variables de entorno:
#   COMPOSE_FILE                      (default: compose.prod.yaml)
#   ENV_FILE                          (default: .env.production)
#   BACKUP_DIR                        (default: ./backups)
#   RETENTION_DAYS                    (default: 14)
#   GESTOR_FINANZAS_BACKUP_PASSPHRASE (obligatoria; frase de cifrado)

cd "$(dirname "$0")/.."

COMPOSE_FILE="${COMPOSE_FILE:-compose.prod.yaml}"
ENV_FILE="${ENV_FILE:-.env.production}"
BACKUP_DIR="${BACKUP_DIR:-./backups}"
RETENTION_DAYS="${RETENTION_DAYS:-14}"

if [ -z "${GESTOR_FINANZAS_BACKUP_PASSPHRASE:-}" ]; then
  echo "GESTOR_FINANZAS_BACKUP_PASSPHRASE debe estar definida (frase de cifrado del backup)." >&2
  exit 1
fi

if [ ! -f "$ENV_FILE" ]; then
  echo "No se encontró $ENV_FILE." >&2
  exit 1
fi

set -a
# shellcheck disable=SC1090
source "$ENV_FILE"
set +a

: "${POSTGRES_USER:?POSTGRES_USER no está definido en $ENV_FILE}"
: "${POSTGRES_DB:?POSTGRES_DB no está definido en $ENV_FILE}"

mkdir -p "$BACKUP_DIR"

raw_file="$(mktemp)"
trap 'rm -f "$raw_file"' EXIT

timestamp="$(date -u +%Y%m%dT%H%M%SZ)"
encrypted_file="${BACKUP_DIR%/}/gestor-finanzas-${timestamp}.backup.enc"

docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" exec -T postgres \
  pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" --format=custom \
  > "$raw_file"

openssl enc -aes-256-cbc -pbkdf2 -salt \
  -pass "pass:${GESTOR_FINANZAS_BACKUP_PASSPHRASE}" \
  -in "$raw_file" -out "$encrypted_file"

echo "Backup creado: $encrypted_file"

find "$BACKUP_DIR" -maxdepth 1 -name 'gestor-finanzas-*.backup.enc' -mtime "+${RETENTION_DAYS}" -print -delete
