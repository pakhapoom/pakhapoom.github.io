// ---------------------------------------------------------------------------
// Chat backend.
//
// The Typhoon API key must never reach the browser — anything shipped to a
// GitHub Pages site is public source. The page therefore talks to a small
// Cloudflare Worker (see worker/) that holds the key as a secret and streams
// Typhoon's response back.
//
// After `wrangler deploy`, paste the Worker URL below.
// ---------------------------------------------------------------------------

const PRODUCTION_ENDPOINT = 'https://resume-chat.pakhapoom.workers.dev/chat';

// `./scripts/dev.sh` runs the real Worker locally via `wrangler dev` on this port.
const DEV_ENDPOINT = 'http://localhost:8787/chat';

const isLocal = ['localhost', '127.0.0.1', '[::1]', ''].includes(location.hostname);

export const CHAT_ENDPOINT = isLocal ? DEV_ENDPOINT : PRODUCTION_ENDPOINT;

/** True until the Worker URL above is filled in — lets the UI explain itself. */
export const CHAT_CONFIGURED = isLocal || !PRODUCTION_ENDPOINT.includes('YOUR-SUBDOMAIN');

export const SUGGESTED_QUESTIONS = [
  'What does he do at DataX?',
  'Experience with RAG and agents?',
  'Summarize his research',
  'Is he a fit for an ML lead role?',
];
