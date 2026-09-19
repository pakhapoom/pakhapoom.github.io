// Hero: the job title writes itself the way a language model emits it — one
// token at a time, with the runners-up and their probabilities visible for a
// beat before each token commits.
//
// The title is already in the DOM as plain text. This only takes over once it
// has checked that the tokens in resume-data still spell it, so a future edit
// to the headline degrades to plain text instead of printing something wrong.

import { resume } from './resume-data.js';

const THINK = 420;   // ms the candidates stay up before the top one commits
const SETTLE = 120;  // ms between one token committing and the next appearing

export function initDecode(host, r = resume) {
  if (!host) return;
  const line = host.querySelector('[data-decode]');
  const out = line?.querySelector('.decode__out');
  const caret = line?.querySelector('.decode__caret');
  const replay = host.querySelector('[data-decode-replay]');
  const steps = r.decode;
  const title = r.headline[0];

  if (!out || !caret || !Array.isArray(steps) || !steps.length) return;
  // The tokens must reconstruct the headline exactly, or this is out of date.
  if (steps.map((s) => s.top[0]).join('') !== title) return;

  const pop = document.createElement('div');
  pop.className = 'decode__pop';
  pop.hidden = true;
  pop.setAttribute('aria-hidden', 'true');
  host.appendChild(pop);

  let run = 0;

  const sleep = (ms, id) => new Promise((resolve) => setTimeout(() => resolve(run === id), ms));

  const showCandidates = (step) => {
    const all = [step.top, ...step.alt];
    pop.innerHTML = all.map(([token, p], i) => `
      <div class="decode__cand${i === 0 ? ' is-top' : ''}">
        <span class="decode__tok">${token.replace(/[&<>]/g, '')}</span>
        <span class="decode__meter"><i style="width:${(p * 100).toFixed(0)}%"></i></span>
        <span class="decode__p">${p.toFixed(2)}</span>
      </div>`).join('');
    pop.hidden = false;

    // Out in the empty right-hand margin, its top on the title's line: that
    // clears the name above it and the short lines below it, so the popover
    // never covers type. In a column too narrow for that it drops under the
    // title instead, and the title reserves the room so nothing reflows.
    const box = host.getBoundingClientRect();
    const tip = caret.getBoundingClientRect();
    const room = host.clientWidth - pop.offsetWidth;
    const beside = room >= tip.right - box.left + 12;

    line.classList.toggle('has-pop', !beside);
    pop.style.left = `${beside ? room : 0}px`;
    pop.style.top = `${(beside ? tip.top : tip.bottom + 8) - box.top}px`;
  };

  async function play() {
    const id = ++run;
    line.classList.add('is-running');
    out.textContent = '';
    pop.hidden = true;
    if (replay) replay.hidden = true;

    for (const step of steps) {
      showCandidates(step);
      if (!await sleep(THINK, id)) return;
      out.textContent += step.top[0];
      pop.hidden = true;
      if (!await sleep(SETTLE, id)) return;
    }

    line.classList.remove('is-running', 'has-pop');
    if (replay) replay.hidden = false;
  }

  const stop = () => {
    run++;
    line.classList.remove('is-running', 'has-pop');
    pop.hidden = true;
    out.textContent = title;
    if (replay) replay.hidden = false;
  };

  replay?.addEventListener('click', play);

  // Reduced motion gets the finished line and an opt-in button, since motion
  // the visitor asked for is a different thing from motion sprung on them.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    stop();
    return;
  }

  play();
}
