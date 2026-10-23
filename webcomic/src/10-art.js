/* SOS ONLY — art primitives: shared defs, text fitting, panels, lettering, Code Rot. */

const FONTS = {
  speech: { fam: "'Comic Neue', 'Comic Sans MS', 'Chalkboard SE', 'Marker Felt', cursive", w: 700, cls: 'ft-s' },
  sfx: { fam: "Bangers, Impact, 'Arial Black', sans-serif", w: 400, cls: 'ft-x' },
  mono: { fam: "VT323, 'IBM Plex Mono', ui-monospace, Menlo, Consolas, monospace", w: 400, cls: 'ft-m' },
  ui: { fam: "system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif", w: 700, cls: 'ft-u' },
};

/* ---------- tiny SVG string helpers ---------- */

const R = (x, y, w, h, fill, ex = '') => `<rect x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${n(h)}" fill="${fill}" ${ex}/>`;
const E = (cx, cy, rx, ry, fill, ex = '') => `<ellipse cx="${n(cx)}" cy="${n(cy)}" rx="${n(rx)}" ry="${n(ry)}" fill="${fill}" ${ex}/>`;
const Ci = (cx, cy, r, fill, ex = '') => `<circle cx="${n(cx)}" cy="${n(cy)}" r="${n(r)}" fill="${fill}" ${ex}/>`;
const Pa = (d, fill = 'none', ex = '') => `<path d="${d}" fill="${fill}" ${ex}/>`;
const Ln = (x1, y1, x2, y2, stroke, sw = 2, ex = '') => `<line x1="${n(x1)}" y1="${n(y1)}" x2="${n(x2)}" y2="${n(y2)}" stroke="${stroke}" stroke-width="${n(sw)}" ${ex}/>`;
const Po = (pts, fill, ex = '') => `<polygon points="${ptsStr(pts)}" fill="${fill}" ${ex}/>`;
const Pl = (pts, stroke, sw = 2, ex = '') => `<polyline points="${ptsStr(pts)}" fill="none" stroke="${stroke}" stroke-width="${n(sw)}" stroke-linejoin="round" stroke-linecap="round" ${ex}/>`;
const G = (inner, ex = '') => `<g ${ex}>${inner}</g>`;
const st = (c, w, ex = '') => `stroke="${c}" stroke-width="${n(w)}" stroke-linejoin="round" stroke-linecap="round" ${ex}`;
const ptsStr = (pts) => pts.map((p) => `${n(p[0])},${n(p[1])}`).join(' ');
const pathOf = (pts, close = true) => 'M' + pts.map((p) => `${n(p[0])} ${n(p[1])}`).join('L') + (close ? 'Z' : '');
const tr = (x, y, s = 1, r = 0) => `transform="translate(${n(x)} ${n(y)})${r ? ` rotate(${n(r)})` : ''}${s !== 1 ? ` scale(${n(s * 1000) / 1000})` : ''}"`;
const Tx = (x, y, str, size, fill, ex = '', font = FONTS.speech) =>
  `<text class="${font.cls}" x="${n(x)}" y="${n(y)}" font-size="${n(size)}" fill="${fill}" ${ex}>${esc(str)}</text>`;
const glow = (cx, cy, rx, ry, grad, op = 1, ex = '') => E(cx, cy, rx, ry, `url(#${grad})`, `opacity="${op}" ${ex}`);

/* ---------- the shared <defs> library (one hidden SVG, referenced by every page) ---------- */

function makeGrain() {
  const S = 180;
  const c = document.createElement('canvas');
  c.width = c.height = S;
  const x = c.getContext('2d');
  const img = x.createImageData(S, S);
  const r = rng('paper-grain');
  for (let i = 0; i < S * S; i++) {
    const v = r();
    const dark = v < 0.55;
    const a = Math.floor(r() * r() * (dark ? 90 : 60));
    img.data.set(dark ? [24, 20, 14, a] : [255, 250, 232, a], i * 4);
  }
  x.putImageData(img, 0, 0);
  try { return c.toDataURL('image/png'); } catch (e) { return ''; }
}

function libDefs() {
  const dots = (id, r, col, sz = 8, rot = 45) =>
    `<pattern id="${id}" width="${sz}" height="${sz}" patternUnits="userSpaceOnUse" patternTransform="rotate(${rot})"><circle cx="${sz / 2}" cy="${sz / 2}" r="${r}" fill="${col}"/></pattern>`;
  const hatch = (id, ang, col, sw, gap = 7) =>
    `<pattern id="${id}" width="${gap}" height="${gap}" patternUnits="userSpaceOnUse" patternTransform="rotate(${ang})"><rect width="${sw}" height="${gap}" fill="${col}"/></pattern>`;
  const rad = (id, col, a0 = 1, mid = null) =>
    `<radialGradient id="${id}"><stop offset="0" stop-color="${col}" stop-opacity="${a0}"/>${mid ? `<stop offset="${mid[0]}" stop-color="${col}" stop-opacity="${mid[1]}"/>` : ''}<stop offset="1" stop-color="${col}" stop-opacity="0"/></radialGradient>`;
  const lin = (id, stops, x2 = 0, y2 = 1, x1 = 0, y1 = 0) =>
    `<linearGradient id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">${stops.map(([o, c, a = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`).join('')}</linearGradient>`;
  const rainTile = (id, w, h, count, seed, col, op, len) => {
    const r = rng(seed);
    let lines = '';
    for (let i = 0; i < count; i++) {
      const x = r() * w, y = r() * h, l = len * (0.6 + r() * 0.7);
      lines += `<line x1="${n(x)}" y1="${n(y)}" x2="${n(x)}" y2="${n(y + l)}"/>`;
      if (y + l > h) lines += `<line x1="${n(x)}" y1="${n(y - h)}" x2="${n(x)}" y2="${n(y - h + l)}"/>`;
    }
    return `<pattern id="${id}" width="${w}" height="${h}" patternUnits="userSpaceOnUse"><g stroke="${col}" stroke-opacity="${op}" stroke-width="1.6" stroke-linecap="round">${lines}</g></pattern>`;
  };
  const grain = makeGrain();
  return `<defs>
    ${dots('ht1', 1.1, C.ink, 7)}${dots('ht2', 1.9, C.ink, 7)}${dots('ht3', 2.8, C.ink, 7)}
    ${dots('htY', 1.9, C.y, 7)}${dots('htW', 1.3, '#FFFFFF', 7)}${dots('htS', 1.6, C.screen, 7)}${dots('htR', 1.8, C.laser, 7)}
    ${dots('htN', 2.2, C.night, 7)}${dots('htK', 2.6, '#000', 9)}${dots('htO', 1.9, C.sodium, 7)}
    ${hatch('hatchA', 45, C.ink, 1.4, 6)}${hatch('hatchB', -45, C.ink, 1.4, 6)}${hatch('hatchW', 45, '#FFFFFF', 1.1, 6)}
    ${hatch('hatchH', 0, C.ink, 1.2, 5)}${hatch('scan', 90, '#000', 1.5, 5)}
    ${rainTile('rainA', 90, 180, 14, 'rainA', '#DCE8F2', 0.55, 38)}
    ${rainTile('rainB', 150, 300, 8, 'rainB', '#BFD3E3', 0.4, 70)}
    ${rainTile('rainD', 90, 180, 16, 'rainD', '#0E0E10', 0.35, 34)}
    ${grain ? `<pattern id="grain" width="180" height="180" patternUnits="userSpaceOnUse"><image href="${grain}" width="180" height="180"/></pattern>` : `<pattern id="grain" width="4" height="4" patternUnits="userSpaceOnUse"></pattern>`}
    ${rad('gY', C.y, 0.95, [0.35, 0.45])}${rad('gS', C.screen, 0.9, [0.3, 0.4])}${rad('gW', '#FFFFFF', 0.95, [0.3, 0.4])}
    ${rad('gR', C.laser, 0.9, [0.3, 0.35])}${rad('gO', C.sodium, 0.85, [0.35, 0.4])}${rad('gK', C.ink, 0.92, [0.55, 0.7])}
    ${rad('gRot', C.rot2, 0.75, [0.5, 0.45])}${rad('gTorch', '#FFF6D8', 0.95, [0.45, 0.55])}${rad('gWarm', C.dawn2, 0.9, [0.4, 0.5])}
    <radialGradient id="gVig" cx=".5" cy=".5" r=".75"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".85"/></radialGradient>
    ${lin('gUnder', [[0, C.ink, 0.92], [0.5, C.ink, 0.45], [1, C.ink, 0]])}
    ${lin('gUnderS', [[0, C.screen, 0], [0.6, C.screen, 0.18], [1, C.screen, 0.55]])}
    ${lin('gSky', [[0, '#070B12'], [0.45, '#121C2A'], [0.8, '#22303F'], [1, '#2C3B4A']])}
    ${lin('gSkyN', [[0, '#05070C'], [1, '#1B2A3A']])}
    ${lin('gDawn', [[0, '#4D5A86'], [0.38, '#C98FA6'], [0.62, '#F6B6A6'], [0.85, '#FFD58A'], [1, '#FFE7B5']])}
    ${lin('gSea', [[0, '#1E3445'], [1, '#081520']])}
    ${lin('gSeaDawn', [[0, '#F2B9A0'], [0.4, '#9C8FA8'], [1, '#3E5470']])}
    ${lin('gCone', [[0, '#FFFFFF', 0.28], [1, '#FFFFFF', 0]])}
    ${lin('gConeY', [[0, C.y, 0.45], [1, C.y, 0]])}
    ${lin('gConeS', [[0, C.screen, 0.5], [1, C.screen, 0]])}
    ${lin('gFade', [[0, C.ink, 0], [1, C.ink, 1]])}
    ${lin('gFadeUp', [[0, C.ink, 1], [1, C.ink, 0]])}
    ${lin('gFloor', [[0, '#2A333D'], [1, '#12171D']])}
    ${lin('gWall', [[0, '#1A222C'], [1, '#2B3440']])}
    ${lin('gStoreLit', [[0, '#EDEBE4'], [1, '#C9C6BC']])}
    ${lin('gScreenUI', [[0, '#DDE3E8'], [1, '#B8C1C9']])}
    ${lin('gLaserH', [[0, C.laser, 0], [0.5, C.laser, 1], [1, C.laser, 0]], 1, 0)}
    ${lin('gTVY', [[0, '#FFE04D'], [1, '#F2B800']])}
    ${lin('gGutWG', [[0, C.paper], [0.55, '#B7B3A8'], [1, C.gutterGrey]])}
    ${lin('gGutGB', [[0, C.gutterGrey], [0.6, '#232325'], [1, C.ink]])}
    <filter id="fGrey" x="0" y="0" width="1" height="1"><feColorMatrix type="saturate" values="0.06"/></filter>
  </defs>`;
}

/* ---------- text measuring and wrapping (canvas, measured once fonts are in) ---------- */

const _mctx = document.createElement('canvas').getContext('2d');
const _mcache = new Map();
function textW(str, size, font = FONTS.speech, ls = 0) {
  const k = font.cls + str;
  let w = _mcache.get(k);
  if (w === undefined) {
    _mctx.font = `${font.w} 100px ${font.fam}`;
    w = _mctx.measureText(str).width / 100;
    _mcache.set(k, w);
  }
  return w * size + ls * str.length;
}

function wrapText(text, maxW, size, font = FONTS.speech, ls = 0) {
  const out = [];
  for (const para of String(text).split('\n')) {
    const words = para.split(/\s+/).filter(Boolean);
    let line = '';
    for (const w of words) {
      const t = line ? line + ' ' + w : w;
      if (line && textW(t, size, font, ls) > maxW) { out.push(line); line = w; } else line = t;
    }
    out.push(line);
  }
  return out;
}

// Lines of text centred on (cx, cy).
function textLines(lines, cx, cy, size, fill, o = {}) {
  const font = o.font || FONTS.speech, lh = size * (o.lh || 1.12);
  const anchor = o.anchor || 'middle';
  const top = cy - ((lines.length - 1) * lh) / 2 + size * 0.36;
  let s = `<text class="${font.cls}" font-size="${n(size)}" fill="${fill}" text-anchor="${anchor}"${o.ls ? ` letter-spacing="${o.ls}"` : ''} ${o.ex || ''}>`;
  lines.forEach((ln, i) => { s += `<tspan x="${n(cx)}" y="${n(top + i * lh)}">${o.raw ? ln : esc(ln)}</tspan>`; });
  return s + '</text>';
}

// Two states of the same art; a page trigger adds .on to swap to the second.
const swap = (a, b, cls = '') => `<g class="sw ${cls}"><g class="s0">${a}</g><g class="s1">${b}</g></g>`;

// Music notes drifting out of a source. o: {count, dx, dy, col, seed, cls}
function notesFx(x, y, o = {}) {
  const r = rng(o.seed || `notes${x}`);
  let g = '';
  for (let i = 0; i < (o.count || 6); i++) {
    const dx = (o.dx || 160) * (0.6 + r() * 0.8), dy = (o.dy || -90) * (0.6 + r() * 0.8);
    g += `<text class="ft-s fx-drift" x="${n(x + r.jit(14))}" y="${n(y + r.jit(10))}" font-size="${n((o.size || 34) * (0.7 + r() * 0.6))}" fill="${o.col || C.ink}" stroke="${o.stroke || '#FFFFFF'}" stroke-width="3" paint-order="stroke" style="--dx:${n(dx)}px;--dy:${n(dy)}px;animation-delay:${n(-r() * 7)}s;animation-duration:${n(5 + r() * 4)}s">${r() < 0.5 ? '♪' : '♫'}</text>`;
  }
  return `<g class="notes ${o.cls || ''}" pointer-events="none">${g}</g>`;
}

/* ---------- Code Rot ---------- */

const ROT_GLYPHS = '▒░▓�╳┘┐╯╮╰╭▖▘▚▞▙▟¤§ʬ⌐¬';

// Swap some letters for rot glyphs. Returns markup (tspans) for use inside <text>.
function rotString(str, amount, seed, col = C.rot) {
  const r = rng(seed);
  let out = '';
  for (const ch of str) {
    if (ch !== ' ' && r() < amount) out += `<tspan fill="${col}">${esc(r.pick(ROT_GLYPHS))}</tspan>`;
    else out += esc(ch);
  }
  return out;
}

// A line of screen text that is rotting: letters slump, tilt, drip and turn to glyph-mould.
function rotLine(x, y, str, size, amount, seed, o = {}) {
  const r = rng(seed);
  const fill = o.fill || '#2C3540', font = o.font || FONTS.mono;
  const cw = textW('M', size, font);
  let ys = [], rots = [], body = '', drips = '';
  [...str].forEach((ch, i) => {
    const bad = ch !== ' ' && r() < amount;
    const slump = bad ? r() * size * 0.45 : r() < amount ? r() * size * 0.12 : 0;
    ys.push(n(y + slump));
    rots.push(bad ? n(r.jit(28)) : 0);
    if (bad && r() < 0.55) body += `<tspan fill="${o.rot || C.rot}">${esc(r.pick(ROT_GLYPHS))}</tspan>`;
    else body += esc(ch);
    if (bad && r() < 0.5) {
      const dx = x + i * cw + cw * 0.5, dy = y + slump + 2, l = 4 + r() * size * 0.7;
      drips += `<path d="M${n(dx - 1.2)} ${n(dy)}Q${n(dx)} ${n(dy + l)} ${n(dx + 1.2)} ${n(dy)}Z" fill="${o.rot || C.rot}" opacity=".85"/>${Ci(dx, dy + l * 0.92, 1.6, o.rot || C.rot)}`;
    }
  });
  return `<text class="${font.cls}" x="${n(x)}" font-size="${n(size)}" fill="${fill}" y="${ys.join(' ')}" rotate="${rots.join(' ')}"${o.ex ? ' ' + o.ex : ''}>${body}</text>${drips}`;
}

// A branching patch of glyph-mould growing out from (x, y). Revealed over `grow` seconds by
// staggered CSS animation; nothing re-renders text per frame. With reduced motion it is static.
function rotPatch(o) {
  const r = rng(o.seed || `rot${o.x},${o.y}`);
  const count = o.count || 70, size = o.size || 16, reach = o.reach || 160;
  const [bx, by, bw, bh] = o.box || [o.x - reach, o.y - reach, reach * 2, reach * 2];
  const grow = o.grow == null ? 6 : o.grow, delay = o.delay || 0;
  const cols = o.cols || [C.rot, C.rot2, C.rot3, C.rot];
  const pts = [];
  const walkers = [{ x: o.x, y: o.y, a: o.ang == null ? r() * Math.PI * 2 : o.ang, d: 0 }];
  let guard = 0;
  while (pts.length < count && guard++ < count * 8) {
    const w = walkers[Math.floor(r() * walkers.length)];
    w.a += r.jit(0.9);
    w.x += Math.cos(w.a) * size * 0.75;
    w.y += Math.sin(w.a) * size * 0.75;
    w.d += 1;
    if (w.x < bx || w.x > bx + bw || w.y < by || w.y > by + bh) { w.x = o.x; w.y = o.y; w.d = 0; continue; }
    pts.push({ x: w.x, y: w.y, d: Math.hypot(w.x - o.x, w.y - o.y) / reach });
    if (r() < 0.12 && walkers.length < 9) walkers.push({ x: w.x, y: w.y, a: w.a + r.jit(1.6), d: w.d });
  }
  pts.sort((a, b) => a.d - b.d);
  let s = '';
  // soft mould halo under the glyphs
  for (let i = 0; i < pts.length; i += 7) {
    const p = pts[i];
    s += `<g class="rotg" style="--d:${n(delay + p.d * grow)}s">${glow(p.x, p.y, size * 2.2, size * 1.7, 'gRot', 0.6)}</g>`;
  }
  for (let i = 0; i < pts.length; i += 6) {
    const chunk = pts.slice(i, i + 6);
    const d = delay + chunk[0].d * grow;
    s += `<text class="ft-m rotg" style="--d:${n(d)}s" font-size="${n(size * (0.8 + r() * 0.5))}" fill="${r.pick(cols)}" x="${chunk.map((p) => n(p.x)).join(' ')}" y="${chunk.map((p) => n(p.y)).join(' ')}" rotate="${chunk.map(() => n(r.jit(40))).join(' ')}">${chunk.map(() => esc(r.pick(ROT_GLYPHS))).join('')}</text>`;
  }
  return `<g class="rot ${o.cls || ''}" pointer-events="none"${o.op ? ` opacity="${o.op}"` : ''}>${s}</g>`;
}

/* ---------- lettering: balloons, captions, SFX ---------- */

function ellipsePt(cx, cy, rx, ry, t) { return [cx + rx * Math.cos(t), cy + ry * Math.sin(t)]; }

// Tapered, gently curved tail from the balloon edge to the speaker.
function tailPath(cx, cy, rx, ry, tip, o = {}) {
  const t = Math.atan2((tip[1] - cy) / ry, (tip[0] - cx) / rx);
  const wid = o.tw || 0.2;
  const b1 = ellipsePt(cx, cy, rx * 0.86, ry * 0.86, t - wid), b2 = ellipsePt(cx, cy, rx * 0.86, ry * 0.86, t + wid);
  const bm = [(b1[0] + b2[0]) / 2, (b1[1] + b2[1]) / 2];
  const dx = tip[0] - bm[0], dy = tip[1] - bm[1], len = Math.hypot(dx, dy) || 1;
  const px = -dy / len, py = dx / len, bend = (o.bend == null ? 0.16 : o.bend) * len;
  const m = [bm[0] + dx * 0.5 + px * bend, bm[1] + dy * 0.5 + py * bend];
  const hw = Math.hypot(b2[0] - b1[0], b2[1] - b1[1]) * 0.22;
  return `M${n(b1[0])} ${n(b1[1])}Q${n(m[0] - px * hw)} ${n(m[1] - py * hw)} ${n(tip[0])} ${n(tip[1])}Q${n(m[0] + px * hw)} ${n(m[1] + py * hw)} ${n(b2[0])} ${n(b2[1])}Z`;
}

// Jagged lightning tail for voices coming out of devices.
function zapPath(cx, cy, w, h, tip) {
  const bx = clamp(tip[0], cx - w / 2 + 16, cx + w / 2 - 16), by = tip[1] > cy ? cy + h / 2 - 6 : cy - h / 2 + 6;
  const dx = tip[0] - bx, dy = tip[1] - by, len = Math.hypot(dx, dy) || 1, px = -dy / len, py = dx / len;
  const at = (k, off) => [bx + dx * k + px * off, by + dy * k + py * off];
  const pts = [[bx - px * 11, by - py * 11], at(0.35, 9), at(0.3, -5), at(0.65, 6), at(0.6, -3), tip, at(0.58, -12), at(0.63, 1), at(0.3, -16), at(0.34, -2), [bx + px * 11, by + py * 11]];
  return pathOf(pts);
}

function burstPath(cx, cy, rx, ry, seed) {
  const r = rng(seed), pts = [], N = 22;
  for (let i = 0; i < N * 2; i++) {
    const t = (i / (N * 2)) * Math.PI * 2, k = i % 2 ? 1 : 1.28 + r() * 0.22;
    pts.push([cx + Math.cos(t) * rx * k, cy + Math.sin(t) * ry * k]);
  }
  return pathOf(pts);
}

function raggedRect(x, y, w, h, seed, j = 4) {
  const r = rng(seed), pts = [];
  const edge = (x1, y1, x2, y2) => {
    const steps = Math.max(2, Math.round(Math.hypot(x2 - x1, y2 - y1) / 22));
    for (let i = 0; i < steps; i++) pts.push([lerp(x1, x2, i / steps) + r.jit(j), lerp(y1, y2, i / steps) + r.jit(j)]);
  };
  edge(x, y, x + w, y); edge(x + w, y, x + w, y + h); edge(x + w, y + h, x, y + h); edge(x, y + h, x, y);
  return pathOf(pts);
}

/* ---------- page builder: one per render, carries the page's panels, balloons and transcript ---------- */

function makePG(page, env) {
  const pg = {
    id: page.id, num: page.num, page, env,
    mode: env.mode, revisit: env.revisit, visits: Save.d.visits, second: Save.d.finished || Save.d.visits > 1,
    rnd: rng(page.id),
    panels: [], lines: [], bbox: {}, bal: 0,
  };

  const grow = (p, box) => {
    const b = pg.bbox[p];
    if (!b) { pg.bbox[p] = box.slice(); return; }
    const x1 = Math.min(b[0], box[0]), y1 = Math.min(b[1], box[1]);
    const x2 = Math.max(b[0] + b[2], box[0] + box[2]), y2 = Math.max(b[1] + b[3], box[1] + box[3]);
    pg.bbox[p] = [x1, y1, x2 - x1, y2 - y1];
  };

  pg.wobble = (box, j = 2) => {
    const [x, y, w, h] = box, r = pg.rnd;
    return pathOf([[x + r.jit(j), y + r.jit(j)], [x + w + r.jit(j), y + r.jit(j)], [x + w + r.jit(j), y + h + r.jit(j)], [x + r.jit(j), y + h + r.jit(j)]]);
  };

  // A panel: clipped art plus an inked, slightly hand-wobbled border.
  // o.guided: [{focus:[x,y,w,h], move:'cut'|'glide'|'creep', hold:ms, lock:ms}] (defaults to the panel box)
  pg.panel = (id, box, inner, o = {}) => {
    const d = o.path || pg.wobble(box);
    const cid = uid(`${pg.id}c`);
    const k = pg.panels.length;
    pg.panels.push({ id, box, guided: o.guided, k, desc: o.desc });
    if (o.desc) pg.lines.push({ who: '', text: o.desc, desc: true });
    grow(id, box);
    const bg = o.bg ? R(box[0] - 10, box[1] - 10, box[2] + 20, box[3] + 20, o.bg) : '';
    const border = o.border === false ? '' :
      `<path class="pb" d="${d}" pathLength="100" fill="none" stroke="${o.stroke || C.ink}" stroke-width="${o.sw || 7}" stroke-linejoin="round"/>`;
    return `<g class="pn ${o.cls || ''}" data-panel="${id}" style="--k:${k}"><clipPath id="${cid}"><path d="${d}"/></clipPath><g class="pa" clip-path="url(#${cid})">${bg}${inner}</g>${border}${o.over || ''}</g>`;
  };

  // Register a guided-view stop that isn't a whole panel (pans across wide panels, etc).
  pg.stop = (id, focus, o = {}) => { pg.panels.push({ id, box: focus, guided: [Object.assign({ focus }, o)], k: pg.panels.length, virtual: true }); };

  // Speech balloon. o: {p, x, y (centre), text, who, type, tail:[x,y], w (wrap width), size, rot, bend}
  // types: speech · whisper · shout · elec · entity · silence · dark · tiny
  pg.say = (o) => {
    const type = o.type || 'speech';
    const size = o.size || ({ whisper: 25, tiny: 21, entity: 28 }[type] || 29);
    const raw = String(o.text || '');
    const text = raw.toUpperCase();
    const ls = type === 'entity' ? 1.5 : 0;
    const L = size * 1.06;
    const T = textW(text, size, FONTS.speech, ls);
    const maxW = o.w || clamp(Math.sqrt(T * L * 2.4), 90, 470);
    const lines = text ? wrapText(text, maxW, size, FONTS.speech, ls) : [];
    const tw = lines.length ? Math.max(...lines.map((l) => textW(l, size, FONTS.speech, ls))) : 0;
    const th = lines.length * L;
    const { x, y } = o;
    const i = pg.bal++;
    if (raw && o.who !== false) pg.lines.push({ who: o.who || '', text: raw, type });
    let shape = '', bw = 0, bh = 0, fill = '#FFFFFF', line = C.ink, tcol = C.ink;
    const sw = 7;
    if (type === 'elec' || type === 'entity') {
      bw = tw + (type === 'entity' ? 52 : 44); bh = th + (type === 'entity' ? 34 : 28);
      if (type === 'entity') {
        fill = C.ink; tcol = C.y;
        shape = Pa(raggedRect(x - bw / 2, y - bh / 2, bw, bh, `${pg.id}e${i}`), C.ink, st(C.y, 1.6, 'stroke-opacity=".35"'));
      } else {
        const tail = o.tail ? Pa(zapPath(x, y, bw, bh, o.tail), '#FFFFFF') : '';
        const rr = `<rect x="${n(x - bw / 2)}" y="${n(y - bh / 2)}" width="${n(bw)}" height="${n(bh)}" rx="9"`;
        shape = `<g ${st(line, sw)}>${rr} fill="#FFFFFF"/>${tail}</g><g>${rr} fill="#FFFFFF"/>${tail.replace(/stroke[^ ]*/g, '')}</g>`;
      }
    } else {
      let rx, ry;
      if (type === 'silence') { rx = 52; ry = 34; } else {
        rx = tw / 2 * 1.13 + (type === 'tiny' ? 12 : 17); ry = th / 2 * 1.22 + (type === 'tiny' ? 9 : 12);
        rx = Math.max(rx, ry * 1.1);
      }
      bw = rx * 2; bh = ry * 2;
      if (type === 'dark') { fill = C.ink; line = '#FFFFFF'; tcol = '#FFFFFF'; }
      const dash = type === 'whisper' ? 'stroke-dasharray="11 8"' : '';
      const outline = type === 'whisper' ? 4.5 : sw;
      const tail = o.tail ? Pa(tailPath(x, y, rx, ry, o.tail, o), fill) : '';
      if (type === 'shout') {
        const bp = Pa(burstPath(x, y, rx, ry, `${pg.id}b${i}`), fill);
        shape = `<g ${st(line, outline)}>${bp}${tail}</g><g>${bp}${tail}</g>`;
        bw *= 1.35; bh *= 1.35;
      } else {
        const el = E(x, y, rx, ry, fill);
        shape = `<g ${st(line, outline, dash)}>${el}${tail}</g><g>${el}${tail}</g>`;
      }
    }
    let txt = '';
    if (lines.length) {
      if (o.rot) {
        const rotted = lines.map((l, k) => rotString(l, o.rot === true ? 0.22 : o.rot, `${pg.id}r${i}${k}`));
        txt = `<g class="rotted">${textLines(rotted, x, y, size, tcol, { raw: true, ls, lh: 1.06 })}</g><g class="clean">${textLines(lines, x, y, size, tcol, { ls, lh: 1.06 })}</g>`;
      } else txt = textLines(lines, x, y, size, tcol, { ls, lh: 1.06 });
    }
    grow(o.p, [x - bw / 2, y - bh / 2, bw, bh]);
    const tf = o.r ? ` transform="rotate(${o.r} ${n(x)} ${n(y)})"` : '';
    return `<g class="bl${o.rot ? ' bl-rot' : ''} ${o.cls || ''}" data-p="${o.p}" style="--i:${i}"${o.rot ? ' data-hot="heal"' : ''}${tf}>${shape}${txt}</g>`;
  };

  // Caption box, top-left anchored. styles: yellow · paper · black · entity · memory
  pg.cap = (o) => {
    const size = o.size || 24, style = o.style || 'yellow';
    const text = String(o.text).toUpperCase();
    const padX = 14, padY = 11, ls = style === 'entity' ? 1.5 : 0.5;
    const maxW = (o.w || 420) - padX * 2;
    const lines = wrapText(text, maxW, size, FONTS.speech, ls);
    const tw = Math.max(...lines.map((l) => textW(l, size, FONTS.speech, ls)));
    const w = o.w && o.fixed ? o.w : tw + padX * 2, h = lines.length * size * 1.15 + padY * 2;
    let x = o.x, y = o.y;
    if (o.right) x = o.x - w;
    if (o.bottom) y = o.y - h;
    const i = pg.bal++;
    if (o.who !== false) pg.lines.push({ who: style === 'entity' ? '⟨ENTITY⟩' : 'CAPTION', text: o.text, type: 'caption' });
    const fills = { yellow: [C.y, C.ink, C.ink], paper: ['#FFFDF5', C.ink, C.ink], black: [C.ink, '#FFFFFF', '#FFFFFF'], entity: [C.ink, C.y, C.y], memory: ['#D8D4C8', C.ink, C.ink] }[style];
    const box = style === 'entity'
      ? Pa(raggedRect(x, y, w, h, `${pg.id}cap${i}`, 3.5), fills[0], st(C.y, 1.4, 'stroke-opacity=".35"'))
      : R(x + 5, y + 6, w, h, 'rgba(0,0,0,.35)') + R(x, y, w, h, fills[0], st(fills[1], 3.5));
    const ty = y + padY + size * 0.82;
    let t = `<text class="ft-s" font-size="${size}" fill="${fills[2]}" letter-spacing="${ls}">`;
    lines.forEach((l, k) => { t += `<tspan x="${n(x + padX)}" y="${n(ty + k * size * 1.15)}">${o.rotAmt ? rotString(l, o.rotAmt, `${pg.id}cr${i}${k}`) : esc(l)}</tspan>`; });
    t += '</text>';
    grow(o.p, [x, y, w, h]);
    const tf = o.r ? ` transform="rotate(${o.r} ${n(x)} ${n(y)})"` : '';
    return `<g class="bl cap ${o.cls || ''}" data-p="${o.p}" style="--i:${i}"${tf}>${box}${t}</g>`;
  };

  // Sound effect lettering, integrated into the art.
  pg.sfx = (text, x, y, o = {}) => {
    const size = o.size || 64, rot = o.rot == null ? -6 : o.rot;
    if (o.log !== false) pg.lines.push({ who: 'SFX', text, type: 'sfx' });
    const base = `class="ft-x sfx ${o.cls || ''}" x="${n(x)}" y="${n(y)}" font-size="${n(size)}" text-anchor="${o.anchor || 'middle'}" letter-spacing="${o.ls == null ? 2 : o.ls}" transform="rotate(${rot} ${n(x)} ${n(y)})${o.skew ? ` skewX(${o.skew})` : ''}"`;
    const sw = o.sw == null ? Math.max(4, size * 0.14) : o.sw;
    const out = o.outer ? `<text ${base} fill="none" stroke="${o.outer}" stroke-width="${n(sw * 2.1)}" stroke-linejoin="round">${esc(text)}</text>` : '';
    return `<g${o.op != null ? ` opacity="${o.op}"` : ''}${o.p ? ` class="bl" data-p="${o.p}" style="--i:${pg.bal++}"` : ''}>${out}<text ${base} fill="${o.fill || C.y}" stroke="${o.stroke || C.ink}" stroke-width="${n(sw)}" paint-order="stroke" stroke-linejoin="round">${esc(text)}</text></g>`;
  };

  // Describe a beat for the transcript without drawing anything.
  pg.desc = (text) => { pg.lines.push({ who: '', text, desc: true }); return ''; };

  return pg;
}
