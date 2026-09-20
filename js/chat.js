// Chat widget: a résumé-grounded assistant in the bottom-right corner.
//
// The browser only ever sends the visitor's turns. The system prompt (and the
// API key) live in the Worker, so a visitor can't rewrite the bot's brief by
// editing a request in devtools.

import { CHAT_ENDPOINT, CHAT_CONFIGURED, SUGGESTED_QUESTIONS } from './config.js';

const MAX_TURNS = 12;        // conversation turns sent upstream
const MAX_CHARS = 1000;      // per message
const STORE_KEY = 'resume-chat';

const el = {};
let history = [];            // [{ role: 'user' | 'assistant', content }]
let inFlight = null;         // AbortController for the open stream
let lastOpener = null;       // element to restore focus to on close

/* ------------------------------------------------------------------ utils */

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));

/**
 * Very small markdown subset — bold, inline code, and dash lists.
 * Everything is escaped first, so model output can never inject markup.
 */
function miniMarkdown(text) {
  const inline = (s) =>
    esc(s)
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/`([^`]+)`/g, '<code>$1</code>');

  return text
    .split(/\n{2,}/)
    .map((block) => {
      const lines = block.split('\n');
      if (lines.every((l) => /^\s*[-*]\s+/.test(l))) {
        const items = lines.map((l) => `<li>${inline(l.replace(/^\s*[-*]\s+/, ''))}</li>`);
        return `<ul>${items.join('')}</ul>`;
      }
      return `<p>${lines.map(inline).join('<br>')}</p>`;
    })
    .join('');
}

const scrollToEnd = () => { el.log.scrollTop = el.log.scrollHeight; };

/* ------------------------------------------------------------- rendering */

function addMessage(role, text = '') {
  const node = document.createElement('div');
  node.className = `msg msg--${role}`;
  if (text) node.innerHTML = role === 'bot' ? miniMarkdown(text) : esc(text);
  el.log.appendChild(node);
  scrollToEnd();
  return node;
}

function addTyping() {
  const node = addMessage('bot');
  node.innerHTML = '<span class="typing"><span></span><span></span><span></span></span>';
  return node;
}

function setBusy(busy) {
  el.send.disabled = busy;
  el.input.disabled = busy;
  el.status.textContent = busy ? 'Thinking…' : 'Answers grounded in this résumé';
}

function renderSuggestions() {
  // Suggestions are training wheels — they disappear once a conversation starts.
  if (history.length) { el.suggest.hidden = true; return; }
  el.suggest.hidden = false;
  el.suggest.innerHTML = SUGGESTED_QUESTIONS
    .map((q) => `<button class="suggest-btn" type="button">${esc(q)}</button>`)
    .join('');
}

/* --------------------------------------------------------------- storage */

function save() {
  try {
    sessionStorage.setItem(STORE_KEY, JSON.stringify(history.slice(-MAX_TURNS * 2)));
  } catch (e) { /* private mode: the transcript just won't survive a reload */ }
}

function restore() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(STORE_KEY) || '[]');
    if (!Array.isArray(saved) || !saved.length) return false;
    history = saved;
    for (const m of history) addMessage(m.role === 'user' ? 'user' : 'bot', m.content);
    return true;
  } catch (e) { return false; }
}

/* ------------------------------------------------------------ networking */

async function streamReply(bubble) {
  const controller = new AbortController();
  inFlight = controller;

  const res = await fetch(CHAT_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: history.slice(-MAX_TURNS * 2) }),
    signal: controller.signal,
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(
      res.status === 429
        ? 'Too many questions in a short window — give it a minute.'
        : `The assistant is unavailable (HTTP ${res.status}). ${detail.slice(0, 140)}`
    );
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let answer = '';

  // OpenAI-compatible SSE: newline-delimited `data:` frames, terminated by [DONE].
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const frames = buffer.split('\n');
    buffer = frames.pop() ?? '';       // keep the trailing partial frame

    for (const frame of frames) {
      const line = frame.trim();
      if (!line.startsWith('data:')) continue;

      const payload = line.slice(5).trim();
      if (payload === '[DONE]') continue;

      try {
        const delta = JSON.parse(payload).choices?.[0]?.delta?.content;
        if (!delta) continue;
        answer += delta;
        bubble.innerHTML = miniMarkdown(answer);
        scrollToEnd();
      } catch (e) { /* a frame split mid-JSON; the next read completes it */ }
    }
  }

  return answer.trim();
}

async function send(text) {
  const question = text.trim().slice(0, MAX_CHARS);
  if (!question || inFlight) return;

  addMessage('user', question);
  history.push({ role: 'user', content: question });
  renderSuggestions();
  save();

  el.input.value = '';
  autosize();
  setBusy(true);

  const bubble = addTyping();

  try {
    const answer = await streamReply(bubble);
    if (answer) {
      history.push({ role: 'assistant', content: answer });
      save();
    } else {
      bubble.remove();
      addMessage('error', 'The assistant returned an empty response. Try rephrasing?');
    }
  } catch (err) {
    bubble.remove();
    if (err.name === 'AbortError') return;
    const offline = err instanceof TypeError;
    addMessage(
      'error',
      offline
        ? 'Could not reach the assistant. Check your connection, or email pakhapoom.sar@gmail.com.'
        : err.message
    );
  } finally {
    inFlight = null;
    setBusy(false);
    el.input.focus();
  }
}

/* ------------------------------------------------------------------- UI */

function autosize() {
  el.input.style.height = 'auto';
  el.input.style.height = `${Math.min(el.input.scrollHeight, 112)}px`;
}

function open() {
  lastOpener = document.activeElement;
  el.panel.hidden = false;
  el.launcher.hidden = true;
  el.launcher.setAttribute('aria-expanded', 'true');

  if (!el.log.childElementCount) {
    const restored = restore();
    if (!restored) {
      addMessage(
        'bot',
        "Hi — I'm an assistant that answers from Pakhapoom's résumé. " +
        'Ask about his experience, technical stack, research, or fit for a role.'
      );
    }
    if (!CHAT_CONFIGURED) {
      addMessage('error', 'Chat backend not configured yet — set the Worker URL in js/config.js.');
    }
  }

  renderSuggestions();
  el.input.focus();
}

function close() {
  inFlight?.abort();
  inFlight = null;
  el.panel.hidden = true;
  el.launcher.hidden = false;
  el.launcher.setAttribute('aria-expanded', 'false');
  setBusy(false);
  lastOpener?.focus?.();
}

export function initChat() {
  Object.assign(el, {
    launcher: document.getElementById('chat-launcher'),
    panel: document.getElementById('chat-panel'),
    close: document.getElementById('chat-close'),
    log: document.getElementById('chat-log'),
    suggest: document.getElementById('chat-suggest'),
    form: document.getElementById('chat-form'),
    input: document.getElementById('chat-input'),
    send: document.getElementById('chat-send'),
    status: document.getElementById('chat-status'),
  });

  el.launcher.addEventListener('click', open);
  el.close.addEventListener('click', close);

  el.form.addEventListener('submit', (e) => {
    e.preventDefault();
    send(el.input.value);
  });

  el.input.addEventListener('input', autosize);
  el.input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send(el.input.value);
    }
  });

  el.suggest.addEventListener('click', (e) => {
    const btn = e.target.closest('.suggest-btn');
    if (btn) send(btn.textContent);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !el.panel.hidden) close();
  });
}
