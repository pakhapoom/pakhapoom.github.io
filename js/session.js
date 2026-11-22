// The per-tab id that groups one visit's lines in the Worker's logs: its chat
// turns (chat.js) and its page views (views.js).

const SESSION_KEY = 'resume-chat-session';   // name predates views; kept so open tabs keep their id

/**
 * A random id that ties one tab's log lines together, so a question can be
 * read next to the answer it got, and next to the pages viewed before it.
 *
 * Deliberately thin: random per tab, thrown away when the tab closes, and
 * derived from nothing about the visitor. It says "these lines belong to one
 * visit" and nothing else — it is not a visitor id and cannot be used to
 * recognize anyone returning later.
 */
export function sessionId() {
  try {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = (crypto.randomUUID?.() ?? `${Date.now()}-${Math.random()}`).slice(0, 36);
      sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch (e) {
    return 'no-storage';   // private mode: the lines just won't group
  }
}
