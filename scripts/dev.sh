#!/usr/bin/env bash
# Run the chat Worker locally against the key in .env, on the port js/config.js
# expects. Serve the site itself with:  python3 -m http.server 8000
set -euo pipefail

cd "$(dirname "$0")/.."

if [[ ! -f .env ]]; then
  echo "error: .env not found (needs TYPHOON_API_KEY=...)" >&2
  exit 1
fi

# wrangler reads local secrets from worker/.dev.vars, which is gitignored.
grep -E '^TYPHOON_API_KEY=' .env > worker/.dev.vars || {
  echo "error: TYPHOON_API_KEY missing from .env" >&2
  exit 1
}

echo "→ Worker on http://localhost:8787  (site: python3 -m http.server 8000)"
cd worker && npx --yes wrangler dev --port 8787
