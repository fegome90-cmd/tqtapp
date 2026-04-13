#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
APP_URL="${APP_URL:-http://127.0.0.1:3000}"
SESSION="tqtapp-smoke"
RESULTS_DIR="$ROOT_DIR/test-results/agent-browser"
DEV_LOG="$RESULTS_DIR/dev-server.log"
STARTED_SERVER=0
DEV_PID=""

mkdir -p "$RESULTS_DIR"

cleanup() {
  npx agent-browser --session "$SESSION" close >/dev/null 2>&1 || true

  if [[ "$STARTED_SERVER" == "1" && -n "$DEV_PID" ]]; then
    kill "$DEV_PID" >/dev/null 2>&1 || true
    wait "$DEV_PID" 2>/dev/null || true
  fi
}

wait_for_url() {
  local url="$1"
  local attempts="${2:-60}"

  for ((i = 1; i <= attempts; i += 1)); do
    if curl -fsS "$url" >/dev/null 2>&1; then
      return 0
    fi
    sleep 1
  done

  return 1
}

assert_contains() {
  local haystack="$1"
  local needle="$2"
  local context="$3"

  if ! grep -Fi "$needle" <<<"$haystack" >/dev/null; then
    echo "Assertion failed: expected '$needle' in $context" >&2
    exit 1
  fi
}

trap cleanup EXIT

cd "$ROOT_DIR"

if ! wait_for_url "$APP_URL" 1; then
  npm run dev >"$DEV_LOG" 2>&1 &
  DEV_PID="$!"
  STARTED_SERVER=1

  if ! wait_for_url "$APP_URL" 60; then
    echo "No se pudo iniciar la app en $APP_URL" >&2
    echo "Revisa el log en $DEV_LOG" >&2
    exit 1
  fi
fi

npx agent-browser close --all >/dev/null 2>&1 || true
npx agent-browser --session "$SESSION" open "$APP_URL"
npx agent-browser --session "$SESSION" wait --load networkidle

HOME_TEXT="$(npx agent-browser --session "$SESSION" get text body)"
assert_contains "$HOME_TEXT" "Buen día, Paciente" "home"
assert_contains "$HOME_TEXT" "Categorías Frecuentes" "home"
assert_contains "$HOME_TEXT" "Llamado de Asistencia" "home"

npx agent-browser --session "$SESSION" find text "Hablar" click
npx agent-browser --session "$SESSION" wait --text "Texto Libre"

TALK_TEXT="$(npx agent-browser --session "$SESSION" get text body)"
assert_contains "$TALK_TEXT" "Reproducir Mensaje" "texto libre"
assert_contains "$TALK_TEXT" "Dictado por voz y clonación" "texto libre"

npx agent-browser --session "$SESSION" find text "Perfil" click
npx agent-browser --session "$SESSION" wait --text "Mi Perfil Clínico"

PROFILE_TEXT="$(npx agent-browser --session "$SESSION" get text body)"
assert_contains "$PROFILE_TEXT" "Mario Rojas" "perfil"
assert_contains "$PROFILE_TEXT" "Mi Banco de Voz" "perfil"

npx agent-browser --session "$SESSION" screenshot "$RESULTS_DIR/tqtapp-smoke.png" >/dev/null

echo "Smoke test con agent-browser completado correctamente."
echo "Screenshot: $RESULTS_DIR/tqtapp-smoke.png"
