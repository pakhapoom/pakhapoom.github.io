// Page-view counter: one beacon per page load to the chat Worker's /view route,
// which writes it to the same log as the chat turns. No third-party script.
//
// What is sent: the path, the referring site's hostname (not its full URL),
// a utm_source if the link carried one, and the per-tab session id. No IP,
// user agent or location is logged — the Worker reads none of them into the
// line. Visitors who send Global Privacy Control or Do Not Track are not
// counted at all.

import { VIEW_ENDPOINT, CHAT_CONFIGURED } from './config.js';
import { sessionId } from './session.js';

export function countView() {
  if (!CHAT_CONFIGURED || !navigator.sendBeacon) return;
  if (navigator.globalPrivacyControl || navigator.doNotTrack === '1') return;

  let ref = '';
  try { ref = document.referrer ? new URL(document.referrer).hostname : ''; } catch (e) { /* opaque */ }

  const src = new URLSearchParams(location.search).get('utm_source') || '';

  // text/plain keeps this a CORS "simple" request: no preflight, and nothing
  // needs to be read back.
  const body = JSON.stringify({ path: location.pathname, ref, src, session: sessionId() });
  try {
    navigator.sendBeacon(VIEW_ENDPOINT, new Blob([body], { type: 'text/plain' }));
  } catch (e) { /* a lost count is fine; a thrown error on boot is not */ }
}
