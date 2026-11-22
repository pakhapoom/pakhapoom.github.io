#!/usr/bin/env bash
# Render scripts/og-card.html to public/og-card.png (1200×630), the image link
# previews show. Rerun after editing the name, headline, decode tokens or
# tagline in js/resume-data.js. Needs Google Chrome and python3; the fonts come
# from Google Fonts, so it needs the network too.
set -euo pipefail

cd "$(dirname "$0")/.."

CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
PORT="${PORT:-8765}"
OUT="public/og-card.png"

# The template imports js/resume-data.js as a module, which file:// blocks,
# so it is served over http for the length of the screenshot.
python3 -m http.server "$PORT" --bind 127.0.0.1 >/dev/null 2>&1 &
SERVER=$!
trap 'kill "$SERVER" 2>/dev/null' EXIT
sleep 1

"$CHROME" --headless=new --disable-gpu --hide-scrollbars \
  --force-device-scale-factor=1 --window-size=1200,630 \
  --virtual-time-budget=8000 \
  --screenshot="$PWD/$OUT" \
  "http://127.0.0.1:$PORT/scripts/og-card.html" 2>/dev/null

echo "→ $OUT"
