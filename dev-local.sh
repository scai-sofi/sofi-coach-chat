#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# dev-local.sh — Run sofi-coach-chat locally without an OpenAI API key
#
# Starts three processes:
#   1. mock-openai  (port 4321) — OpenAI-compatible mock server
#   2. api-server   (port 3001) — Express backend, points to mock-openai
#   3. mobile (Expo)            — React Native app via Expo Go
#
# Usage:
#   ./dev-local.sh            # start all three
#   ./dev-local.sh --api-only # start only mock + api-server (no Expo)
# ---------------------------------------------------------------------------

set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
MOCK_PORT=4321
API_PORT=3001
TSX="$ROOT/node_modules/.pnpm/node_modules/.bin/tsx"

API_ONLY=false
if [[ "${1:-}" == "--api-only" ]]; then
  API_ONLY=true
fi

cleanup() {
  echo ""
  echo "Stopping all processes..."
  kill 0 2>/dev/null || true
}
trap cleanup SIGINT SIGTERM EXIT

echo ""
echo "┌─────────────────────────────────────────────────────┐"
echo "│   sofi-coach-chat  —  local dev (no OpenAI key)     │"
echo "└─────────────────────────────────────────────────────┘"

# ── 1. Mock OpenAI server ──────────────────────────────────────────────────
echo ""
echo "▶ [1/3] Starting mock-openai on port $MOCK_PORT..."
PORT=$MOCK_PORT "$TSX" "$ROOT/scripts/src/mock-openai.ts" 2>&1 | sed 's/^/[mock] /' &

# Give it a moment to boot
sleep 1
echo "   → http://localhost:$MOCK_PORT/v1/chat/completions"

# ── 2. API server ──────────────────────────────────────────────────────────
echo ""
echo "▶ [2/3] Starting api-server on port $API_PORT..."
(
  export PORT=$API_PORT
  export AI_INTEGRATIONS_OPENAI_BASE_URL="http://localhost:$MOCK_PORT/v1"
  export AI_INTEGRATIONS_OPENAI_API_KEY="mock-key"
  export NODE_ENV="development"
  cd "$ROOT/artifacts/api-server"
  "$TSX" ./src/index.ts 2>&1 | sed 's/^/[api] /'
) &

sleep 2
echo "   → http://localhost:$API_PORT/api/healthz"

if [[ "$API_ONLY" == "true" ]]; then
  echo ""
  echo "═══════════════════════════════════════════════════════"
  echo " Running in --api-only mode (no Expo)"
  echo ""
  echo " Test the chat API:"
  echo "   curl -s -X POST http://localhost:$API_PORT/api/chat \\"
  echo "     -H 'Content-Type: application/json' \\"
  echo "     -d '{\"message\":\"Help me budget\"}' | jq ."
  echo "═══════════════════════════════════════════════════════"
  wait
  exit 0
fi

# ── 3. Expo / mobile ───────────────────────────────────────────────────────
# Resolve the host IP for Expo Go on physical devices.
# Priority: EXPO_PUBLIC_API_URL already set by caller > auto-detected LAN IP > localhost
if [[ -z "${EXPO_PUBLIC_API_URL:-}" ]]; then
  LOCAL_IP=$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || echo "localhost")
  export EXPO_PUBLIC_API_URL="http://${LOCAL_IP}:$API_PORT/api"
fi

echo ""
echo "▶ [3/3] Starting Expo (web + Expo Go QR)..."
(
  cd "$ROOT/artifacts/mobile"
  pnpm exec expo start --web --clear
) &

echo ""
echo "═══════════════════════════════════════════════════════"
echo " All services running:"
echo ""
echo "  [mock-openai]  http://localhost:$MOCK_PORT"
echo "  [api-server]   http://localhost:$API_PORT/api"
echo "  [expo web]     http://localhost:8081   ← open in Cursor preview"
echo "  [expo mobile]  scan QR code with Expo Go app"
echo "  [api url]      $EXPO_PUBLIC_API_URL"
echo ""
echo "  Press Ctrl+C to stop everything"
echo "═══════════════════════════════════════════════════════"
echo ""

wait
