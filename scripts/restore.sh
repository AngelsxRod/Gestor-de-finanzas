#!/usr/bin/env bash
set -euo pipefail

# Verifica que un backup sea restaurable: lo descifra y lo restaura en una
# base de verificación aislada dentro del mismo servicio postgres — nunca
# toca la base real. Pensado para simulacros de restauración periódicos;
# ver DEPLOYMENT.md. La base de verificación NO se elimina automáticamente
# para permitir inspeccionarla; el script imprime el comando para borrarla.
#
# Uso: scripts/restore.sh <archivo .backup.enc>
#
# Variables de entorno:
#   COMPOSE_FILE                      (default: compose.prod.yaml)
#   ENV_FILE                          (default: .env.production)
#   VERIFY_DB                         (default: gestor_finanzas_restore_check)
#   GESTOR_FINANZAS_BACKUP_PASSPHRASE (obligatoria; frase de cifrado)

cd "$(dirname "$0")/.."

COMPOSE_FILE="${COMPOSE_FILE:-compose.prod.yaml}"
ENV_FILE="${ENV_FILE:-.env.production}"
VERIFY_DB="${VERIFY_DB:-gestor_finanzas_restore_check}"
BACKUP_FILE="${1:?Uso: scripts/restore.sh <archivo .backup.enc>}"

if [ -z "${GESTOR_FINANZAS_BACKUP_PASSPHRASE:-}" ]; then
  echo "GESTOR_FINANZAS_BACKUP_PASSPHRASE debe estar definida (frase de cifrado del backup)." >&2
  exit 1
fi

if [ ! -f "$BACKUP_FILE" ]; then
  echo "No se encontró el archivo de backup: $BACKUP_FILE" >&2
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

compose() {
  docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" "$@"
}

raw_file="$(mktemp)"
trap 'rm -f "$raw_file"' EXIT

openssl enc -d -aes-256-cbc -pbkdf2 \
  -pass "pass:${GESTOR_FINANZAS_BACKUP_PASSPHRASE}" \
  -in "$BACKUP_FILE" -out "$raw_file"

compose exec -T postgres psql -U "$POSTGRES_USER" -d postgres -v ON_ERROR_STOP=1 \
  -c "DROP DATABASE IF EXISTS ${VERIFY_DB};"
compose exec -T postgres psql -U "$POSTGRES_USER" -d postgres -v ON_ERROR_STOP=1 \
  -c "CREATE DATABASE ${VERIFY_DB};"

compose exec -T postgres pg_restore -U "$POSTGRES_USER" -d "$VERIFY_DB" < "$raw_file"

table_count="$(compose exec -T postgres psql -U "$POSTGRES_USER" -d "$VERIFY_DB" -tAc \
  "SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public';")"
table_count="${table_count//[$'\r\n ']/}"

echo "Restauración verificada en la base '${VERIFY_DB}': ${table_count} tablas encontradas."
echo "Elimínala cuando termines de inspeccionarla:"
echo "  docker compose --env-file ${ENV_FILE} -f ${COMPOSE_FILE} exec -T postgres psql -U ${POSTGRES_USER} -d postgres -c 'DROP DATABASE ${VERIFY_DB};'"
