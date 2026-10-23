/* SOS ONLY — the reader: layout modes, mounting, guided view, controls, UI chrome, triggers. */

const LAST = 27; // 0 = check-in, 1..26 = story pages, 27 = end screen
const leafKind = (i) => (i === 0 ? 'checkin' : i === LAST ? 'end' : 'page');
const GUTTER = { white: C.paper, grey: C.gutterGrey, black: C.ink, warm: '#FFF4E0', whitegrey: 'url(#gGutWG)', greyblack: 'url(#gGutGB)' };
const OG_URL = '../';

const Bus = {
  h: {},
  on(e, f) { (this.h[e] = this.h[e] || []).push(f); },
  off(e, f) { this.h[e] = (this.h[e] || []).filter((x) => x !== f); },
  emit(e, a) { (this.h[e] || []).slice().forEach((f) => { try { f(a); } catch (err) { console.error(err); } }); },
};

const Reader = {
  idx: 0, stop: 0, mode: null, full: false, leaves: [], vb: null, lockUntil: 0, dragging: false,
  hiddenTitle: null, titleBase: 'SOS ONLY — Optus Redcliffe',
  sess: { start: Date.now(), leftAt: null, awayCount: 0 },
};

/* ---------- layout ---------- */

function pickMode() {
  const m = Save.d.settings.mode;
  if (m && m !== 'auto') return m;
  const a = innerWidth / innerHeight;
  return a < 0.7 ? 'guided' : a <= 1.2 ? 'page' : 'spread';
}

function sizeBook() {
  const app = $('#app'), m = Reader.mode;
  const H = innerHeight, W = innerWidth - (Save.d.settings.transcript && innerWidth >= 820 && m !== 'guided' ? Math.min(380, innerWidth * 0.92) : 0);
  let lw, lh;
  if (m === 'spread') { lh = Math.min(H * 0.95, W * 0.97 * 0.75); lw = (lh * 2) / 3; }
  else if (m === 'page') { lh = Math.min(H * 0.975, W * 0.98 * 1.5); lw = (lh * 2) / 3; }
  else { lw = W; lh = H; }
  app.style.setProperty('--lw', `${lw}px`);
  app.style.setProperty('--lh', `${lh}px`);
  // HTML leaves (check-in, end) keep 2:3 and scale with --u
  const sw = m === 'guided' ? Math.min(W, H / 1.5) : lw;
  app.style.setProperty('--sw', `${sw}px`);
  app.style.setProperty('--u', `${sw / 1000}px`);
  app.dataset.mode = m;
  debugInfo();
}

/* ---------- rendering a story page ---------- */

function renderPage(num, env) {
  const P = PAGES[num];
  _uid = 0;
  _uidPrefix = `${P.id}-`;
  _ollieShift = Math.min(3, Math.max(0, (Save.d.visits || 1) - 1)) * 14;
  const pg = makePG(P, env);
  let body = '';
  try { body = P.render(pg); } catch (e) {
    console.error(`page ${num}`, e);
    body = R(0, 0, 1000, 1500, C.ink) + Tx(500, 750, `PAGE ${num} — PLEASE HOLD`, 40, C.y, 'text-anchor="middle"');
  }
  const bg = GUTTER[P.gutter] || P.gutter || C.ink;
  const folioCol = /black|grey/.test(P.gutter) && P.gutter !== 'whitegrey' ? '#8A8A86' : '#6A665C';
  const label = `Page ${num}: ${P.title}. ${P.alt || ''}`;
  const svg = `<svg class="page pg-${P.id}" viewBox="0 0 1000 1500" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${esc(label)}">` +
    `<rect class="pgbg" x="-3000" y="-3000" width="7000" height="7500" fill="${bg.startsWith('url') ? (P.gutter === 'whitegrey' ? C.gutterGrey : C.ink) : bg}"/>` +
    (bg.startsWith('url') ? `<rect width="1000" height="1500" fill="${bg}"/>` : '') +
    body +
    `<rect width="1000" height="1500" fill="url(#grain)" opacity="${P.gutter === 'black' ? 0.35 : 0.6}" pointer-events="none"/>` +
    `<text class="ft-x folio" x="${P.side === 'left' ? 34 : 966}" y="1490" font-size="20" fill="${folioCol}" text-anchor="middle">${num}</text>` +
    `<path class="gmask" fill="${C.ink}" fill-rule="evenodd" d="" pointer-events="none"/>` +
    `</svg>`;
  return { svg, pg };
}

/* ---------- guided view: animating the SVG viewBox between focus rectangles ---------- */

function leafSize() { const r = $('#book').getBoundingClientRect(); return [innerWidth, innerHeight, r]; }

function fitVB(f, pad = 14) {
  const [W, H] = leafSize();
  const A = W / H;
  let [x, y, w, h] = [f[0] - pad, f[1] - pad, f[2] + pad * 2, f[3] + pad * 2];
  if (w / h > A) { const nh = w / A; y -= (nh - h) / 2; h = nh; } else { const nw = h * A; x -= (nw - w) / 2; w = nw; }
  return [x, y, w, h];
}

function maskPath(f) {
  if (!f) return '';
  const [x, y, w, h] = f;
  return `M-5000 -5000H6000V6500H-5000Z M${n(x)} ${n(y)}h${n(w)}v${n(h)}h${n(-w)}Z`;
}

let _vbAnim = 0;
function animateVB(svg, from, to, dur, mask) {
  cancelAnimationFrame(_vbAnim);
  const m = svg.querySelector('.gmask');
  const set = (v, f) => { svg.setAttribute('viewBox', v.map(n).join(' ')); Reader.vb = v; if (m) m.setAttribute('d', maskPath(f)); };
  if (!from || dur <= 0 || reducedMotion()) { set(to, mask); return; }
  const t0 = performance.now();
  const fromMask = Reader.mask || mask;
  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const step = (now) => {
    const t = clamp((now - t0) / dur, 0, 1), e = ease(t);
    const v = from.map((a, i) => lerp(a, to[i], e));
    const mk = mask && fromMask ? fromMask.map((a, i) => lerp(a, mask[i], e)) : mask;
    set(v, mk);
    if (t < 1) _vbAnim = requestAnimationFrame(step);
  };
  _vbAnim = requestAnimationFrame(step);
  Reader.mask = mask;
}

const MOVE_MS = { cut: 0, glide: 380, creep: 1500, unfold: 1200 };

function buildStops(pg) {
  const out = [];
  const [W, H] = leafSize();
  for (const p of pg.panels) {
    const b = pg.bbox[p.id] || p.box;
    if (p.guided) { p.guided.forEach((g) => out.push(Object.assign({ p: p.id, move: 'glide' }, g, { focus: g.focus || b }))); continue; }
    // split wide panels so lettering stays at least ~13 CSS px
    const [x, y, w, h] = b;
    const sc = Math.min(W / (w + 28), H / (h + 28));
    const k = Math.min(3, Math.max(1, Math.ceil(0.46 / sc - 0.05)));
    if (k === 1 || w < h * 0.9) { out.push({ p: p.id, focus: b, move: 'glide' }); continue; }
    const seg = w / k;
    for (let i = 0; i < k; i++) out.push({ p: p.id, focus: [x + seg * i - (i ? seg * 0.08 : 0), y, seg * (i ? 1.08 : 1.04), h], move: 'glide' });
  }
  return out;
}

function revealBalloons(L, upto) {
  const ids = [];
  for (const s of L.stops.slice(0, upto + 1)) if (!ids.includes(s.p)) ids.push(s.p);
  let j = 0;
  L.svg.querySelectorAll('.bl').forEach((b) => {
    const on = ids.includes(b.dataset.p);
    if (on && !b.classList.contains('on')) { b.style.setProperty('--j', j++); b.classList.add('on'); }
    if (!on) b.classList.remove('on');
  });
}

function goStop(k, o = {}) {
  const L = Reader.leaves[0];
  if (!L || !L.stops || !L.stops.length) return;
  k = clamp(k, 0, L.stops.length - 1);
  Reader.stop = k;
  Reader.full = false;
  const s = L.stops[k];
  const vb = fitVB(s.focus);
  const from = o.from || Reader.vb;
  animateVB(L.svg, from, vb, o.move ? MOVE_MS[o.move] : MOVE_MS[s.move] ?? 380, s.focus.map((v, i) => v + (i < 2 ? -6 : 12)));
  revealBalloons(L, k);
  if (s.lock) Reader.lockUntil = Date.now() + s.lock;
  if (!o.silent) L.ctx && L.ctx._panel(s.p);
  progress();
  debugInfo();
}

function guidedFull(on) {
  const L = Reader.leaves[0];
  if (!L || !L.svg) return;
  Reader.full = on;
  if (on) {
    animateVB(L.svg, Reader.vb, fitVB([0, 0, 1000, 1500], 0), 380, null);
    L.svg.querySelectorAll('.bl').forEach((b) => b.classList.add('on'));
  } else goStop(Reader.stop);
}

/* ---------- per-page context: timers, triggers and effects all clean up on unmount ---------- */

function makeCtx(i, el, svg, pg, o) {
  const timers = [], cleanups = [], panelCbs = {}, firedPanels = new Set();
  const ctx = {
    num: i, el, svg, pg, mode: Reader.mode, dead: false,
    reduced: reducedMotion(), revisit: pg.revisit, visits: Save.d.visits, second: Save.d.finished || Save.d.visits > 1,
    layoutFrom: o.fromMode || null, save: Save.d, name: NAME(), hasName: hasName(),
    sess: Reader.sess, aspect: innerWidth / innerHeight,
    persist: () => Save.write(),
    q: (s) => svg.querySelector(s), qa: (s) => [...svg.querySelectorAll(s)],
    after(ms, fn) { const t = setTimeout(() => !ctx.dead && fn(), ms); timers.push(() => clearTimeout(t)); return t; },
    every(ms, fn) { const t = setInterval(() => !ctx.dead && fn(), ms); timers.push(() => clearInterval(t)); return t; },
    // fires after the reader has spent `ms` on the page with it visible (pauses when the tab is hidden)
    dwell(ms, fn) {
      let acc = 0, last = performance.now();
      const t = setInterval(() => {
        const now = performance.now();
        if (!document.hidden) acc += now - last;
        last = now;
        if (acc >= ms) { clearInterval(t); if (!ctx.dead) fn(); }
      }, 200);
      timers.push(() => clearInterval(t));
    },
    raf(fn) {
      let id = 0;
      const loop = (t) => { if (ctx.dead || fn(t) === false) return; id = requestAnimationFrame(loop); };
      id = requestAnimationFrame(loop);
      timers.push(() => cancelAnimationFrame(id));
    },
    on(evt, fn) { Bus.on(evt, fn); cleanups.push(() => Bus.off(evt, fn)); },
    // Run fn when panel p is reached: in guided view when its stop is shown, otherwise `delay` ms after mount.
    onPanel(p, fn, delay = 0) {
      if (Reader.mode === 'guided') (panelCbs[p] = panelCbs[p] || []).push(fn);
      else ctx.after(delay, fn);
    },
    _panel(p) { if (firedPanels.has(p)) return; firedPanels.add(p); (panelCbs[p] || []).forEach((f) => f()); },
    onTap(sel, fn) { ctx._taps.push([sel, fn]); },
    _taps: [],
    // press-and-hold on an element
    onHold(sel, down, up) {
      svg.querySelectorAll(sel).forEach((t) => {
        t.setAttribute('data-hot', 'hold');
        const d = (e) => { e.preventDefault(); down(e); const u = () => { up(); removeEventListener('pointerup', u); removeEventListener('pointercancel', u); }; addEventListener('pointerup', u); addEventListener('pointercancel', u); };
        t.addEventListener('pointerdown', d);
        cleanups.push(() => t.removeEventListener('pointerdown', d));
      });
    },
    // drag across an element; fn receives page coordinates
    onDrag(sel, fn, end) {
      svg.querySelectorAll(sel).forEach((t) => {
        t.setAttribute('data-hot', 'drag');
        const d = (e) => {
          e.preventDefault();
          Reader.dragging = true;
          try { t.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
          fn(ctx.toPage(e.clientX, e.clientY), e);
          const mv = (ev) => fn(ctx.toPage(ev.clientX, ev.clientY), ev);
          const up = () => { t.removeEventListener('pointermove', mv); t.removeEventListener('pointerup', up); t.removeEventListener('pointercancel', up); setTimeout(() => (Reader.dragging = false), 0); end && end(); };
          t.addEventListener('pointermove', mv); t.addEventListener('pointerup', up); t.addEventListener('pointercancel', up);
        };
        t.addEventListener('pointerdown', d);
        cleanups.push(() => t.removeEventListener('pointerdown', d));
      });
    },
    // continuous pointer / tilt input, normalised -1..1 around the page centre
    onPointer(fn) { ctx.on('pointer', (p) => { if (p.leaf === undefined || p.leaf === el || Reader.mode !== 'spread') fn(p.nx, p.ny, p); }); },
    toPage(cx, cy) {
      const m = svg.getScreenCTM();
      if (!m) return [500, 750];
      const p = new DOMPoint(cx, cy).matrixTransform(m.inverse());
      return [p.x, p.y];
    },
    sfx: (name, o2) => Sound.sfx(name, o2),
    bed: (spec) => Sound.bed(spec),
    haptic: (name) => haptic(name),
    status: (k) => setStatus(k),
    ticket: (k) => ticketState(k),
    setHiddenTitle: (t) => { Reader.hiddenTitle = t; cleanups.push(() => (Reader.hiddenTitle = null)); },
    next: () => next(),
    stopIndex: () => Reader.stop,
    isLastStop: () => Reader.mode !== 'guided' || !Reader.leaves[0] || Reader.stop >= (Reader.leaves[0].stops || []).length - 1,
    _cleanup() { ctx.dead = true; timers.forEach((f) => f()); cleanups.forEach((f) => f()); },
  };
  return ctx;
}

/* ---------- mounting ---------- */

function unmountAll() {
  for (const L of Reader.leaves) {
    try { L.ctx && L.ctx._cleanup(); } catch (e) { console.error(e); }
    try { L.unmount && L.unmount(); } catch (e) { console.error(e); }
    L.el.remove();
  }
  Reader.leaves = [];
}

function mountLeaf(i, side, o) {
  const kind = leafKind(i);
  const el = document.createElement('div');
  el.className = `leaf leaf-${kind} ${side}`;
  const L = { i, el, kind };
  $('#book').append(el);
  if (kind === 'page' && !Save.d.checkedIn) {
    // a closed roller door until the reader has taken a ticket
    el.innerHTML = '<div class="shutter closed"><span>PLEASE TAKE A TICKET</span></div>';
    Reader.leaves.push(L);
    return L;
  }
  if (kind === 'page') {
    const P = PAGES[i];
    if (!P) { el.innerHTML = `<div class="missing">Page ${i}<br>Please hold…</div>`; Reader.leaves.push(L); return L; }
    const env = { mode: Reader.mode, revisit: Save.d.pagesSeen.includes(i) };
    const { svg, pg } = renderPage(i, env);
    el.innerHTML = svg;
    L.svg = el.firstElementChild;
    L.pg = pg;
    L.stops = Reader.mode === 'guided' ? buildStops(pg) : null;
    if (!o.noEnter) el.classList.add('enter');
    L.ctx = makeCtx(i, el, L.svg, pg, o);
    Reader.leaves.push(L);
    // page scripts run after the chrome has been set for this view (see show)
    L.start = () => { try { P.mount && P.mount(L.ctx); } catch (e) { console.error(`mount ${i}`, e); } };
  } else {
    Reader.leaves.push(L);
    try { L.unmount = (kind === 'checkin' ? buildCheckin : buildEnd)(el, o); } catch (e) { console.error(e); }
  }
  return L;
}

function show(o = {}) {
  unmountAll();
  const book = $('#book');
  const ids = Reader.mode === 'spread' ? [Reader.idx - (Reader.idx % 2), Reader.idx - (Reader.idx % 2) + 1] : [Reader.idx];
  if (Reader.mode === 'spread') Reader.idx = ids[0];
  book.className = `mode-${Reader.mode}${o.turn ? ' turning' : ''}`;
  ids.forEach((i, k) => mountLeaf(i, Reader.mode === 'spread' ? (k ? 'right' : 'left') : 'single', o));
  if (o.turn) setTimeout(() => book.classList.remove('turning'), 400);

  if (Reader.mode === 'guided') {
    const L = Reader.leaves[0];
    Reader.mask = null;
    if (L.svg && L.stops && L.stops.length) {
      const start = o.fromEnd ? L.stops.length - 1 : 0;
      goStop(start, { from: o.fromVB || null, move: o.fromVB ? 'glide' : 'cut', silent: true });
      Reader._firstStop = L.stops[start].p;
    }
  } else if (o.fromVB && Reader.leaves.length) {
    // Unfold: start zoomed on the panel the reader was on, then open out to the whole page.
    const L = Reader.leaves.find((x) => x.i === o.fromLeaf) || Reader.leaves[0];
    if (L.svg) {
      const full = [0, 0, 1000, 1500];
      const r = L.el.getBoundingClientRect(), A = r.width / r.height;
      let [x, y, w, h] = o.fromFocus || o.fromVB;
      if (w / h > A) { const nh = w / A; y -= (nh - h) / 2; h = nh; } else { const nw = h * A; x -= (nw - w) / 2; w = nw; }
      animateVB(L.svg, [x, y, w, h], full, MOVE_MS.unfold, null);
    }
  }
  chrome();
  for (const L of Reader.leaves) if (L.start) L.start();
  // in guided view, the opening stop's panel triggers once the page script is listening
  if (Reader.mode === 'guided' && Reader._firstStop && Reader.leaves[0] && Reader.leaves[0].ctx) {
    const L = Reader.leaves[0], p = Reader._firstStop;
    Reader._firstStop = null;
    L.stops.slice(0, Reader.stop + 1).forEach((st) => L.ctx._panel(st.p));
    void p;
  }
  Bus.emit('show', ids);
}

/* ---------- navigation ---------- */

function canLeaveCheckin() { return Save.d.checkedIn; }

function goLeaf(i, o = {}) {
  i = clamp(i, 0, LAST);
  if (i > 0 && !canLeaveCheckin()) { nudgeCheckin(); return; }
  Reader.idx = i;
  Reader.stop = 0;
  show(Object.assign({ turn: true }, o));
}

function next() {
  if (Date.now() < Reader.lockUntil) return;
  if (Reader.mode === 'guided') {
    const L = Reader.leaves[0];
    if (Reader.full) { guidedFull(false); return; }
    if (L && L.stops && Reader.stop < L.stops.length - 1) { goStop(Reader.stop + 1); return; }
  }
  if (Reader.mode === 'spread') goLeaf(Reader.idx - (Reader.idx % 2) + 2);
  else goLeaf(Reader.idx + 1);
}

function prev() {
  if (Reader.mode === 'guided') {
    if (Reader.full) { guidedFull(false); return; }
    if (Reader.stop > 0) { goStop(Reader.stop - 1); return; }
    if (Reader.idx > 0) goLeaf(Reader.idx - 1, { fromEnd: true });
    return;
  }
  if (Reader.mode === 'spread') goLeaf(Reader.idx - (Reader.idx % 2) - 2);
  else goLeaf(Reader.idx - 1);
}

function setMode(m, o = {}) {
  if (m === Reader.mode && !o.force) { sizeBook(); return; }
  const from = Reader.mode;
  const fromVB = Reader.vb && from === 'guided' ? Reader.vb.slice() : null;
  const L = Reader.leaves[0];
  const fromFocus = from === 'guided' && L && L.stops && L.stops[Reader.stop] ? L.stops[Reader.stop].focus : null;
  Reader.mode = m;
  Reader.vb = null;
  sizeBook();
  show({ fromMode: from, fromVB, fromFocus, fromLeaf: Reader.idx, noEnter: !!fromVB });
  Bus.emit('layoutChange', { from, to: m });
}

/* ---------- chrome: status icon, favicon, ticket, progress, title, transcript ---------- */

const STATUS_LABEL = { bars: '4G', '3g': '3G', sos: 'SOS only', full: '5G' };
function setStatus(k) {
  const el = $('#status');
  if (el.dataset.k === k) return;
  el.dataset.k = k;
  const bars = { bars: 4, '3g': 2, sos: 0, full: 4 }[k] ?? 4;
  el.innerHTML = `<span class="sb">${[1, 2, 3, 4].map((b) => `<i class="${b <= bars ? 'on' : ''}" style="height:${b * 25}%"></i>`).join('')}</span><span class="sl">${STATUS_LABEL[k] || ''}</span>`;
  setFavicon(k === 'sos' ? 'sos' : 'bars');
}

function setFavicon(k) {
  const svg = k === 'sos'
    ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="12" fill="#0E0E10"/><text x="32" y="42" font-family="Arial Black,Arial" font-weight="900" font-size="24" fill="#FFCD00" text-anchor="middle">SOS</text></svg>`
    : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="12" fill="#FFCD00"/>${[0, 1, 2, 3].map((i) => `<rect x="${10 + i * 12}" y="${46 - (i + 1) * 9}" width="8" height="${(i + 1) * 9}" rx="1.5" fill="#0E0E10"/>`).join('')}</svg>`;
  $('#favicon').href = 'data:image/svg+xml,' + encodeURIComponent(svg);
}

function setTitle(t) { document.title = t; }

function ticketState(k) {
  const t = $('#ticket');
  t.classList.remove('gone', 'back', 'pulse', 'rot1', 'rot2');
  if (k === 'hide') t.classList.add('gone');
  else if (k === 'back') t.classList.add('back');
  else if (k === 'pulse') {
    t.classList.add('pulse');
    t.style.setProperty('--pd', `${-(Date.now() % 1600) / 1000}s`);
  } else if (k) t.classList.add(k);
}

function progress() {
  let f = Reader.idx / LAST;
  const L = Reader.leaves[0];
  if (Reader.mode === 'guided' && L && L.stops && L.stops.length) f += (Reader.stop / L.stops.length) / LAST;
  $('#pfill').style.width = `${(f * 100).toFixed(2)}%`;
}

function chrome() {
  const ids = Reader.leaves.map((L) => L.i);
  const last = ids[ids.length - 1];
  const P = PAGES[last];
  const app = $('#app');
  // status & favicon
  setStatus(last === 0 ? 'bars' : last === LAST ? 'sos' : (P && P.status) || 'sos');
  // title
  Reader.titleBase = last === LAST ? 'Please hold…' : 'SOS ONLY — Optus Redcliffe';
  if (!document.hidden) setTitle(Reader.titleBase);
  // ticket
  $('#ticket').hidden = !Save.d.checkedIn;
  ticketState(null);
  // UI rot staging (§10): 19–22 the UI decays, 23 is clean, 24–26 it's back worse.
  const rotLevel = last >= 19 && last <= 22 ? 1 : last >= 24 && last <= 26 ? 2 : 0;
  app.dataset.rot = rotLevel;
  if (rotLevel) ticketState(rotLevel === 1 ? 'rot1' : 'rot2');
  // bleed margins in page mode
  const bleedSrc = PAGES[Reader.idx] || P;
  app.dataset.bleed = Reader.idx === 0 ? 'checkin' : Reader.idx === LAST ? 'end' : (bleedSrc && (bleedSrc.bleed || bleedSrc.gutter)) || 'black';
  // gutter colour of the whole viewport in guided mode
  const gk = (PAGES[Reader.idx] || {}).gutter;
  app.style.setProperty('--gut', gk === 'whitegrey' ? C.gutterGrey : gk === 'greyblack' ? '#202022' : GUTTER[gk] || C.ink);
  progress();
  // saved progress
  let changed = false;
  for (const i of ids) if (i > 0 && i < LAST && !Save.d.pagesSeen.includes(i)) { Save.d.pagesSeen.push(i); changed = true; }
  if (last >= 1 && last < LAST) { Save.d.lastPage = Reader.idx; changed = true; }
  if (last === LAST && !Save.d.finished) { Save.d.finished = true; changed = true; }
  Save.d.lastActive = Date.now();
  changed = true;
  if (changed) Save.write();
  // sound beds follow the right-hand page
  const snd = (P && P.sound) || (last === 0 ? {} : last === LAST ? { hold: true } : {});
  Sound.bed(snd);
  renderTranscript();
  debugInfo();
}

function renderTranscript() {
  const box = $('#transcript');
  const on = !!Save.d.settings.transcript;
  box.hidden = !on;
  const app = $('#app');
  if (app.classList.contains('with-transcript') !== on) { app.classList.toggle('with-transcript', on); sizeBook(); }
  if (!on) return;
  let h = '<button class="tx-close" type="button" aria-label="Close transcript">×</button>';
  for (const L of Reader.leaves) {
    if (L.kind === 'checkin') { h += '<section><h2>Check-in</h2><p class="d">The store’s check-in tablet. Pop your name in, choose a reason for your visit, and take a ticket.</p></section>'; continue; }
    if (L.kind === 'end') { h += '<section><h2>End screen</h2><p class="d">A black call screen. Call 2, on hold: your reading time. Call 1, on hold: a year and counting. Your call is important to us. Please continue to hold.</p></section>'; continue; }
    const P = PAGES[L.i];
    if (!P || !L.pg) continue;
    h += `<section><h2>Page ${L.i} — ${esc(P.title)}</h2>${P.alt ? `<p class="d">${esc(P.alt)}</p>` : ''}`;
    for (const ln of L.pg.lines) {
      if (ln.desc) h += `<p class="d">${esc(ln.text)}</p>`;
      else h += `<p><b>${esc(ln.who || '…')}${ln.type === 'whisper' ? ' (whispering)' : ln.type === 'elec' ? ' (from a device)' : ''}:</b> ${esc(ln.text)}</p>`;
    }
    h += '</section>';
  }
  box.innerHTML = h;
  $('.tx-close', box).onclick = () => { Save.d.settings.transcript = false; Save.write(); renderTranscript(); };
}

/* ---------- menu (opens from the 07 ticket) ---------- */

function openMenu(open = true) {
  const m = $('#menu'), t = $('#ticket');
  m.hidden = !open;
  t.setAttribute('aria-expanded', String(open));
  if (!open) { t.focus({ preventScroll: true }); return; }
  const s = Save.d.settings;
  const seg = (key, opts) => `<div class="seg" role="group" aria-label="${key}">${opts.map(([v, l]) => `<button type="button" data-k="${key}" data-v="${v}" aria-pressed="${String(s[key]) === String(v)}">${l}</button>`).join('')}</div>`;
  m.innerHTML = `<div class="m-in">
    <div class="m-head"><span class="m-num">07</span><span>${esc(NAME())}<br><small>Reason: SOS ONLY</small></span><button type="button" class="m-x" aria-label="Close menu">×</button></div>
    <div class="m-row"><span>Sound</span>${seg('sound', [[true, 'On'], [false, 'Off']])}</div>
    <div class="m-row"><span>Motion</span>${seg('motion', [['auto', 'Auto'], ['on', 'Full'], ['off', 'Reduced']])}</div>
    <div class="m-row"><span>Tilt</span>${seg('tilt', [[true, 'On'], [false, 'Off']])}</div>
    <div class="m-row"><span>Transcript</span>${seg('transcript', [[true, 'On'], [false, 'Off']])}</div>
    <div class="m-row"><span>Layout</span>${seg('mode', [['auto', 'Auto'], ['guided', 'Guided'], ['page', 'Page'], ['spread', 'Spread']])}</div>
    <div class="m-row m-acts"><button type="button" class="m-restart">Back to page 1</button><button type="button" class="m-leave">Leave the queue</button></div>
    <div class="m-confirm" hidden><p>Nobody leaves the queue.</p><button type="button" class="m-yes">Reset everything</button><button type="button" class="m-no">Stay</button></div>
  </div>`;
  m.querySelectorAll('.seg button').forEach((b) => {
    b.onclick = async () => {
      const k = b.dataset.k;
      let v = b.dataset.v;
      if (v === 'true') v = true; else if (v === 'false') v = false;
      if (k === 'tilt' && v) v = await enableTilt();
      s[k] = v;
      Save.write();
      if (k === 'sound') { if (v) Sound.unlock(); Sound.setEnabled(v); chrome(); }
      if (k === 'motion') applyMotion();
      if (k === 'transcript') renderTranscript();
      if (k === 'mode') setMode(pickMode(), { force: true });
      if (k === 'motion') show({ noEnter: true });
      openMenu(true);
    };
  });
  $('.m-x', m).onclick = () => openMenu(false);
  $('.m-restart', m).onclick = () => { openMenu(false); goLeaf(1); };
  $('.m-leave', m).onclick = () => { $('.m-confirm', m).hidden = false; $('.m-yes', m).focus(); };
  $('.m-no', m).onclick = () => { $('.m-confirm', m).hidden = true; };
  $('.m-yes', m).onclick = () => { Save.reset(); openMenu(false); Reader.idx = 0; applyMotion(); show(); };
  $('.m-x', m).focus({ preventScroll: true });
}

/* ---------- input ---------- */

let _tilt = null;
async function enableTilt() {
  try {
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      const r = await DeviceOrientationEvent.requestPermission();
      if (r !== 'granted') return false;
    }
  } catch (e) { return false; }
  if (!_tilt) {
    _tilt = (e) => {
      if (!Save.d.settings.tilt || e.gamma == null) return;
      Bus.emit('pointer', { nx: clamp(e.gamma / 30, -1, 1), ny: clamp((e.beta - 40) / 30, -1, 1), tilt: true });
    };
    addEventListener('deviceorientation', _tilt);
  }
  return true;
}

function foundOllie(el) {
  el.classList.remove('blink');
  void el.getBBox;
  requestAnimationFrame(() => el.classList.add('blink'));
  setTimeout(() => el.classList.remove('blink'), 700);
  const L = Reader.leaves.find((x) => x.el.contains(el));
  if (L && !Save.d.olliesFound.includes(L.i)) { Save.d.olliesFound.push(L.i); Save.write(); }
}

function healBalloon(el) {
  el.classList.add('healed');
  clearTimeout(el._heal);
  el._heal = setTimeout(() => el.classList.remove('healed'), 2600);
}

function hotspot(target, e) {
  const hot = target.closest && target.closest('[data-hot]');
  for (const L of Reader.leaves) {
    if (!L.ctx || !L.el.contains(target)) continue;
    for (const [sel, fn] of L.ctx._taps) {
      const t = target.closest(sel);
      if (t && L.el.contains(t)) { fn(t, e); return true; }
    }
  }
  if (!hot) return false;
  const k = hot.dataset.hot;
  if (k === 'ollie') { foundOllie(hot); return true; }
  if (k === 'heal') { healBalloon(hot); return true; }
  return true; // holds and drags handle themselves
}

let _down = null, _lastTap = 0, _tapTimer = 0, _idle = 0;
function wakeUI() {
  const app = $('#app');
  app.classList.remove('idle');
  clearTimeout(_idle);
  _idle = setTimeout(() => { if ($('#menu').hidden) app.classList.add('idle'); }, 2000);
}

function bindInput() {
  const stage = $('#stage');
  stage.addEventListener('pointerdown', (e) => {
    _down = { x: e.clientX, y: e.clientY, t: Date.now(), target: e.target };
  });
  stage.addEventListener('pointerup', (e) => {
    wakeUI();
    const d = _down;
    _down = null;
    if (!d || Reader.dragging) return;
    if (e.target.closest && e.target.closest('.leaf-checkin, .leaf-end, input, button, a, label')) return;
    const dx = e.clientX - d.x, dy = e.clientY - d.y, dt = Date.now() - d.t;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.4 && dt < 800) { dx < 0 ? next() : prev(); return; }
    if (Math.hypot(dx, dy) > 12 || dt > 650) return;
    if (hotspot(d.target, e)) return;
    const zone = e.clientX / innerWidth;
    const act = () => {
      if (zone < 1 / 3) prev();
      else if (zone > 2 / 3 || Reader.mode === 'guided') next();
    };
    if (Reader.mode === 'guided') {
      // double-tap toggles the full page; single taps wait a beat to tell the difference
      if (Date.now() - _lastTap < 300) { clearTimeout(_tapTimer); _lastTap = 0; guidedFull(!Reader.full); return; }
      _lastTap = Date.now();
      _tapTimer = setTimeout(act, 260);
    } else act();
  });
  addEventListener('pointermove', (e) => {
    if (e.pointerType === 'mouse') wakeUI();
    const leaf = e.target.closest ? e.target.closest('.leaf') : null;
    const r = (leaf || $('#book')).getBoundingClientRect();
    Bus.emit('pointer', { nx: clamp(((e.clientX - r.left) / r.width) * 2 - 1, -1.5, 1.5), ny: clamp(((e.clientY - r.top) / r.height) * 2 - 1, -1.5, 1.5), x: e.clientX, y: e.clientY, leaf: leaf || undefined });
  }, { passive: true });
  addEventListener('keydown', (e) => {
    if (e.target.closest && e.target.closest('input, textarea')) return;
    wakeUI();
    const menuOpen = !$('#menu').hidden;
    if (e.key === 'Escape') { if (menuOpen) openMenu(false); else if (Reader.full) guidedFull(false); return; }
    if (menuOpen) return;
    if (e.target.closest && e.target.closest('button, a') && (e.key === ' ' || e.key === 'Enter')) return;
    if (['ArrowRight', 'PageDown', ' '].includes(e.key)) { e.preventDefault(); next(); }
    else if (['ArrowLeft', 'PageUp'].includes(e.key)) { e.preventDefault(); prev(); }
    else if (e.key === 'Home') goLeaf(Save.d.checkedIn ? 1 : 0);
    else if (e.key === 'm') openMenu(true);
    else if (e.key === 't') { Save.d.settings.transcript = !Save.d.settings.transcript; Save.write(); renderTranscript(); }
    else if (e.key === 'f' && Reader.mode === 'guided') guidedFull(!Reader.full);
  });
  $('#ticket').addEventListener('click', () => openMenu($('#menu').hidden));
  let rz = 0;
  addEventListener('resize', () => {
    clearTimeout(rz);
    rz = setTimeout(() => {
      const m = pickMode();
      if (m !== Reader.mode) setMode(m);
      else { sizeBook(); if (Reader.mode === 'guided') { if (Reader.full) guidedFull(true); else goStop(Reader.stop, { move: 'cut' }); } }
    }, 140);
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      const now = Date.now();
      if (!Reader.sess.leftAt) Reader.sess.leftAt = now;
      Reader.sess.awayCount++;
      Reader.sess.hiddenAt = now;
      Save.d.lastLeftAt = now;
      Save.write();
      setTitle(Reader.hiddenTitle || 'Are you still there?');
      clearTimeout(Reader._tt);
      Reader._tt = setTimeout(() => setTitle('You’re number 07'), 30000);
      Sound.suspend(true);
      Bus.emit('tabLeave');
    } else {
      clearTimeout(Reader._tt);
      setTitle(Reader.titleBase);
      Sound.suspend(false);
      Bus.emit('tabReturn', { away: Date.now() - (Reader.sess.hiddenAt || Date.now()) });
    }
  });
}

function applyMotion() {
  document.documentElement.classList.toggle('rm', reducedMotion());
}

/* ---------- debug overlay (?debug) ---------- */

const DEBUG = /[?&]debug/.test(location.search);
function debugInfo() {
  if (!DEBUG) return;
  const d = $('#debug');
  d.hidden = false;
  d.textContent = `${innerWidth}×${innerHeight} @${devicePixelRatio.toFixed(2)}x · aspect ${(innerWidth / innerHeight).toFixed(3)} · mode ${Reader.mode}${Save.d.settings.mode !== 'auto' ? ' (override)' : ''} · leaf ${Reader.idx}${Reader.mode === 'guided' ? ` stop ${Reader.stop}` : ''}`;
}

/* ---------- boot ---------- */

function fontsReady(ms) {
  if (!document.fonts || !document.fonts.load) return Promise.resolve();
  const loads = ['700 30px "Comic Neue"', '30px Bangers', '30px VT323'].map((f) => document.fonts.load(f).catch(() => null));
  return Promise.race([Promise.all(loads), new Promise((r) => setTimeout(r, ms))]);
}

async function boot() {
  $('#lib').innerHTML = libDefs();
  // a new visit is coming back after a break, not a reload mid-read
  if (Save.d.checkedIn && Date.now() - (Save.d.lastActive || 0) > 30 * 60 * 1000) { Save.d.visits = (Save.d.visits || 1) + 1; Save.write(); }
  applyMotion();
  await fontsReady(1800);
  _mcache.clear();
  Reader.mode = pickMode();
  sizeBook();
  bindInput();
  if (Save.d.settings.tilt) enableTilt();
  Sound.setEnabled(!!Save.d.settings.sound);
  Reader.idx = 0;
  show();
  wakeUI();
  // the progress line doubles as a call-duration readout
  setInterval(() => { if (Save.d.readStart) $('#ptime').textContent = fmtDur(Date.now() - Save.d.readStart).replace(/^00:/, ''); }, 1000);
  // fonts that arrive late change text widths; re-measure and redraw once
  if (document.fonts) document.fonts.addEventListener('loadingdone', () => { _mcache.clear(); if (Reader.idx > 0) show({ noEnter: true }); }, { once: true });
  if (matchMedia) matchMedia('(prefers-reduced-motion: reduce)').addEventListener?.('change', applyMotion);
}
