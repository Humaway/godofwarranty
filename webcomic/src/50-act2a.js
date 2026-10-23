/* SOS ONLY — pages 6–12: caller number seven, the stream, the tickets, the first service, the roof, ahead. */

/* ---------- local helpers (prefixed pA_: every source file shares one scope) ---------- */

const pA_style = (css) => `<style>${css}</style>`;

// A small balloon that keeps its lettering lower-case (the kit's balloons are all caps).
function pA_tiny(pg, p, x, y, text, o = {}) {
  const size = o.size || 22;
  const tw = textW(text, size, FONTS.speech);
  const rx = tw / 2 + 18, ry = size * 0.9;
  const fill = o.dark ? C.ink : '#FFFFFF', line = o.dark ? '#FFFFFF' : C.ink, tcol = o.dark ? '#FFFFFF' : C.ink;
  const tail = o.tail ? Pa(tailPath(x, y, rx, ry, o.tail, { tw: 0.3 }), fill) : '';
  const el = E(x, y, rx, ry, fill);
  pg.lines.push({ who: o.who || '', text, type: o.type || 'speech' });
  return `<g class="${o.cls || 'bl'}" data-p="${p}" style="--i:${pg.bal++}"><g ${st(line, 5, o.dash ? 'stroke-dasharray="8 6"' : '')}>${el}${tail}</g><g>${el}${tail}</g>` +
    `<text class="ft-s" x="${n(x)}" y="${n(y + size * 0.34)}" font-size="${size}" fill="${tcol}" text-anchor="middle">${esc(text)}</text></g>`;
}

// The size of a speech balloon pg.say would draw, so balloons can be linked edge to edge. Returns [rx, ry].
function pA_bdims(text, size = 29, w) {
  const T = String(text).toUpperCase(), L = size * 1.06;
  const maxW = w || clamp(Math.sqrt(textW(T, size) * L * 2.4), 90, 470);
  const lines = wrapText(T, maxW, size);
  const tw = Math.max(...lines.map((l) => textW(l, size)));
  const ry = (lines.length * L) / 2 * 1.22 + 12;
  return [Math.max(tw / 2 * 1.13 + 17, ry * 1.1), ry];
}

// A connector between two balloons of one speaker (same look as the rest of the book): a white band
// with inked sides, drawn over both balloons so the joins are seamless. Pops in with the second balloon.
function pA_link(pg, p, P, Q, wid = 22) {
  const dx = Q[0] - P[0], dy = Q[1] - P[1], L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L, px = -uy * wid / 2, py = ux * wid / 2;
  const band = [[P[0] - ux * 7 + px, P[1] - uy * 7 + py], [Q[0] + ux * 7 + px, Q[1] + uy * 7 + py], [Q[0] + ux * 7 - px, Q[1] + uy * 7 - py], [P[0] - ux * 7 - px, P[1] - uy * 7 - py]];
  const sides = `M${n(P[0] + px)} ${n(P[1] + py)}L${n(Q[0] + px)} ${n(Q[1] + py)}M${n(P[0] - px)} ${n(P[1] - py)}L${n(Q[0] - px)} ${n(Q[1] - py)}`;
  return `<g class="bl" data-p="${p}" style="--i:${pg.bal - 1}">${Po(band, '#FFFFFF')}${Pa(sides, 'none', st(C.ink, 6))}</g>`;
}

// A thermal ticket whose small print is big enough to read (the kit's ticket prints its extra lines tiny).
function pA_ticket(x, y, o = {}) {
  const s = o.s || 1;
  let t = ticketProp(0, 0, { num: o.num, name: o.name, nameSize: 16 });
  const lines = o.lines || [];
  const fs = Math.min(15, ...lines.map((l) => 108 / Math.max(1, textW(l, 1, FONTS.mono))));
  lines.forEach((l, i) => { t += Tx(60, 149 + i * fs * 1.05, l, fs, '#1A1A1A', 'text-anchor="middle"', FONTS.mono); });
  return `<g transform="translate(${n(x)} ${n(y)}) rotate(${o.r || 0}) scale(${s})"${o.cls ? ` class="${o.cls}"` : ''}>${t}</g>`;
}

// Stream overlay strip: red LIVE pill, watching count, the title.
function pA_streamBar(x, y, w, o = {}) {
  const h = o.h || 34, k = h / 34;
  let g = R(x, y, w, h, 'rgba(8,8,10,.72)', `rx="${4 * k}"`);
  g += R(x + 6 * k, y + 6 * k, 58 * k, 22 * k, '#E0262F', `rx="${4 * k}"`) + Ci(x + 16 * k, y + 17 * k, 4 * k, '#FFFFFF', 'class="fx-blink"');
  g += Tx(x + 24 * k, y + 23 * k, 'LIVE', 15 * k, '#FFFFFF', '', FONTS.ui);
  if (o.count) g += Tx(x + 72 * k, y + 23 * k, `◉ ${o.count}`, 15 * k, '#FFFFFF', `class="${o.countCls || ''}"`, FONTS.ui);
  if (o.title !== false) {
    const title = o.title || 'NIGHTMARE ON 63RD STREET (NOT CLICKBAIT)', tx = (o.count ? 150 : 74) * k;
    // as big as the strip allows (it sets up a running joke), up to ~18 units
    const fs = Math.min(17.5 * k, (w - tx - 10 * k) / (textW(title, 1, FONTS.ui) + 0.5 * title.length / 17.5));
    g += Tx(x + tx, y + 18 * k + fs * 0.36, title, fs, '#FFFFFF', 'letter-spacing="0.5"', FONTS.ui);
  }
  return g;
}

// The open-air walkway seen through the shopfront glass, Cafe 63 lit up across it.
// o: {cafe: {...cafe63 opts}, queue: null|'far'|'glass', prints, dark}
function pA_walkway(box, o = {}) {
  const [x, y, w, h] = box;
  const r = rng(o.seed || 'walk');
  let s = R(x, y, w, h, '#0E141B');
  // awning edge, rain beyond it, wet tiles
  const fy = y + h * 0.58;
  s += R(x, y, w, h * 0.12, '#151B23') + Ln(x, y + h * 0.12, x + w, y + h * 0.12, '#2A323C', 4);
  s += Po([[x, fy], [x + w, fy], [x + w, y + h], [x, y + h]], '#1A222B');
  for (let i = 0; i < 12; i++) s += Ln(x + w * 0.5 + (i - 6) * w * 0.04, fy, x + w * 0.5 + (i - 6) * w * 0.22, y + h, '#26303A', 1.5);
  for (let k = 1; k < 6; k++) { const yy = lerp(fy, y + h, Math.pow(k / 6, 1.7)); s += Ln(x, yy, x + w, yy, '#26303A', 1.3); }
  // Cafe 63, across the walkway
  const cb = [x + w * 0.2, y + h * 0.16, w * 0.6, h * 0.46];
  s += cafe63(cb, Object.assign({ lights: 4 }, o.cafe || {}));
  // light spilling out of the cafe onto the wet floor
  if (!o.cafe || o.cafe.lights !== 0) s += E(x + w * 0.5, fy + h * 0.08, w * 0.34, h * 0.06, '#F3D9A6', 'opacity=".12"');
  if (o.prints) {
    // wet footprints leading up to the glass
    for (let i = 0; i < 9; i++) {
      const t = i / 8, px = lerp(x + w * 0.5, x + w * 0.46, t) + (i % 2 ? 10 : -10) * (0.5 + t), py = lerp(fy + 8, y + h - 10, Math.pow(t, 1.3));
      const sc = 0.4 + t * 1.2;
      s += E(px, py, 7 * sc, 3.6 * sc, '#6E8DA6', 'opacity=".9"') + E(px + 1, py - 5.4 * sc, 4.4 * sc, 2.2 * sc, '#6E8DA6', 'opacity=".9"') + E(px - 1, py - 1, 4 * sc, 1.4 * sc, '#B7D0E2', 'opacity=".6"');
    }
  }
  if (o.queue === 'far') s += queueLine({ x0: x + w * 0.5, y0: y + h * 0.98, s0: h / 520, x1: x + w * 0.48, y1: fy + h * 0.02, s1: h / 2400, count: 9, ease: 1.6, seed: 'pAq7', fadeFar: 0.55 });
  s += rainFx([x, y + h * 0.12, w, fy - y - h * 0.12], { op: 0.5, op2: 0.35 });
  if (o.dark) s += R(x, y, w, h, C.ink, `opacity="${o.dark}"`);
  return s;
}

// Customers pressed right up against the glass: faces flattened and smeared, palms flat either side, breath fogging.
// o: {count, sc (scale), head (face height as a fraction of the box), at:[x fractions], seed}
function pA_atGlass(box, o = {}) {
  const [x, y, w, h] = box;
  const N = o.count || 3, sc = o.sc || h / 300, hy = y + h * (o.head == null ? 0.36 : o.head);
  const at = o.at || [...Array(N)].map((_, i) => (N === 1 ? 0.5 : 0.17 + (i / (N - 1)) * 0.66));
  let s = '';
  at.forEach((fx, i) => {
    const cx = x + w * fx, fy = hy + (i % 2 ? 8 : -4) * sc, yy = fy + 318 * sc;
    s += customer({ x: cx, y: yy, s: sc, kind: CUSTOMER_ORDER[(i + 1 + (o.off || 0)) % 8], seed: `pAg${o.seed || ''}${i}`, ticket: true, faceOp: 0.95 });
    // flattened against the glass: pale pressure on the nose and cheek
    s += E(cx + 1 * sc, fy + 4 * sc, 10 * sc, 7 * sc, '#EADFD3', 'opacity=".55"') + E(cx - 10 * sc, fy + 12 * sc, 8 * sc, 5 * sc, '#EADFD3', 'opacity=".35"');
    // palms pressed flat either side of the face
    s += pA_palm(cx - 50 * sc, fy + 18 * sc, sc * 0.36, -1) + pA_palm(cx + 50 * sc, fy + 12 * sc, sc * 0.36, 1);
    // the fog of their breath on the glass
    s += E(cx, fy + 30 * sc, 22 * sc, 11 * sc, '#DCE6EE', 'opacity=".28"');
  });
  return s;
}

// Shopfront glass frame drawn over a view.
function pA_glassFrame(box, o = {}) {
  const [x, y, w, h] = box;
  let s = glassDrops(box, o.seed || 'pAgl', o.drops || 34);
  s += Pa(`M${n(x)} ${n(y + h * 0.1)}L${n(x + w * 0.25)} ${n(y + h * 0.1)}L${n(x)} ${n(y + h * 0.5)}Z`, '#FFFFFF', 'opacity=".05"');
  (o.mullions || [0.33, 0.66]).forEach((t) => { s += R(x + w * t - 7, y, 14, h, '#16191E', st(C.ink, 2)); });
  return s;
}

/* ---------- Page 6 — Caller Number Seven ---------- */

page(6, {
  title: 'Caller Number Seven', side: 'left', gutter: 'grey', bleed: 'grey', status: 'sos',
  alt: 'Chase answers one of the ringing demo phones, and every other phone stops at once. Hold music, then a voice: thank you for holding, your call is important to us, you are caller number seven. There are six of them. Chloe says “seven.” The hold music is Chase’s own unreleased track.',
  sound: { hum: true, rain: true, hold: true },
  render(pg) {
    const A = [40, 40, 560, 420], B = [618, 40, 342, 420], Cc = [40, 478, 920, 150], D = [40, 646, 920, 420], Eb = [40, 1084, 920, 376];
    let s = pA_style(`
      .pA-gather{opacity:0;transition:opacity .25s}
      .pA-gather.on{opacity:1}
      .pA-orbit{animation:pA-orbit 3s linear infinite;transform-box:view-box;transform-origin:0 0}
      @keyframes pA-orbit{to{transform:rotate(360deg)}}
      .pA-drain{animation:pA-drain 9s ease-in forwards}
      @keyframes pA-drain{from{opacity:0}to{opacity:1}}
      .rm .pA-orbit,.rm .pA-drain{animation:none!important}
      .rm .pA-drain{opacity:1}`);
    let t = ''; // lettering goes on top of everything, even the notes drifting across the gutters
    // 1: Chase reaches for a ringing demo phone
    let a = R(A[0], A[1], A[2], A[3], '#1A2129') + R(A[0], A[1] + 330, A[2], 100, '#141A20');
    a += displayWall([A[0] + 268, A[1] + 26, 300, 300], { cols: 4, rows: 3, lit: true, ring: true, wall: '#39424E' });
    a += glow(A[0] + 420, A[1] + 180, 260, 200, 'gS', 0.25);
    const oL = {}, oC = {};
    a += fig('luka', { x: A[0] + 92, y: A[1] + 307 + 318 * 1.28, s: 1.28, pose: 'hand', face: 'worried', out: oL, light: 'front', so: 0.55, props: ['lanyard'] });
    a += fig('chase', { x: A[0] + 236, y: A[1] + 486, s: 1.0, pose: 'reach', face: 'smirk', out: oC, light: 'front', so: 0.5, arms: { na: [96, 110], fa: [20, 40] } });
    a += R(A[0], A[1], A[2], A[3], 'url(#gVig)', 'opacity=".6"');
    s += pg.panel('a', A, a, { desc: 'Chase reaches for one of the ringing demo phones on the wall. Luka, behind him, puts a hand out.' });
    t += pg.say({ p: 'a', x: 110, y: 96, text: 'Don’t.', who: 'LUKA', tail: [oL.head[0] + 6, oL.head[1] - 34], w: 90 });
    t += pg.say({ p: 'a', x: 330, y: 100, text: 'They’re demo units. There’s no SIMs in them.', who: 'CHASE', tail: [oC.head[0] + 10, oC.head[1] - 36], w: 220, size: 26 });
    t += pg.say({ p: 'a', x: 132, y: 212, text: 'Then why are they ringing?', who: 'LUKA', tail: [oL.head[0] + 14, oL.head[1] - 34], w: 160, size: 26 });
    const rb = rng('p6brr');
    for (let i = 0; i < 6; i++) s += pg.sfx('brrr', A[0] + 300 + rb() * 240, A[1] + 70 + rb() * 240, { size: 18 + rb() * 10, rot: rb.jit(18), sw: 4, log: i === 0, p: 'a' });

    // 2: he answers; the rest of the wall goes quiet
    let b = R(B[0], B[1], B[2], B[3], '#151B22');
    b += displayWall([B[0] - 40, B[1] + 20, 420, 300], { cols: 5, rows: 3, lit: false, header: false, wall: '#2C343E', dim: 0.35 });
    const oB = {};
    b += fig('chase', { x: B[0] + 190, y: B[1] + 1040, s: 2.45, pose: 'phone', props: ['phoneEar', 'headphones'], screen: '#CFF2FF', face: 'worried', out: oB, flip: true, light: 'side', so: 0.6 });
    b += R(B[0], B[1], B[2], B[3], 'url(#gVig)', 'opacity=".55"');
    s += pg.panel('b', B, b, { desc: 'Close: Chase answers anyway. Every other phone on the wall stops ringing at once.' });
    s += pg.sfx('click', B[0] + 290, B[1] + 330, { size: 30, rot: 8, fill: '#FFFFFF', p: 'b' });

    // 3: the speaker grille (press and hold to listen)
    let c = R(Cc[0], Cc[1], Cc[2], Cc[3], '#07090C');
    c += R(Cc[0] - 10, Cc[1] + 18, Cc[2] + 20, 120, '#16181C', `rx="40" ${st(C.ink, 4)}`);
    c += R(Cc[0] + 330, Cc[1] + 58, 260, 34, '#050506', `rx="17" ${st('#33363C', 3)}`) + R(Cc[0] + 338, Cc[1] + 62, 244, 26, 'url(#htW)', 'rx="13" opacity=".35"');
    c += glow(Cc[0] + 460, Cc[1] + 75, 260, 60, 'gY', 0.25);
    c += `<g>${R(Cc[0] + 790, Cc[1] + 56, 96, 38, '#22262C', `rx="19" ${st('#555', 2)}`)}${Ci(Cc[0] + 812, Cc[1] + 75, 7, C.y, 'class="fx-pulse"')}${Tx(Cc[0] + 828, Cc[1] + 82, 'HOLD', 18, '#E8E8E8', '', FONTS.ui)}</g>`;
    c += notesFx(Cc[0] + 460, Cc[1] + 70, { count: 7, dx: 140, dy: -60, col: C.y, stroke: C.ink, seed: 'p6c' });
    s += pg.panel('c', Cc, c, { desc: 'A thin panel: only the phone’s speaker grille, music notes curling out.', guided: [{ focus: [40, 478, 560, 150] }, { focus: [420, 478, 540, 150] }] });
    t += pg.say({ p: 'c', type: 'elec', x: 190, y: 552, text: 'Thank you for holding.', who: 'PHONE', tail: [370, 552], w: 260, size: 27 });

    // 4: everyone leaning in, lit from below
    let d = R(D[0], D[1], D[2], D[3], '#0B0E13') + R(D[0], D[1], D[2], D[3], 'url(#htN)', 'opacity=".35"');
    d += glow(D[0] + 470, D[1] + 300, 420, 260, 'gS', 0.32);
    d += ollie({ x: D[0] + 880, y: D[1] + 330, s: 0.42, dark: true, turn: -1 });
    const lean = [['luka', 140, false, 12, 'scared'], ['zee', 300, false, 8, 'worried'], ['luke', 660, true, 10, 'worried'], ['zane', 800, true, 8, 'shock']];
    const hd = {};
    lean.forEach(([w, x, fl, ln, face]) => { const o = {}; d += fig(w, { x: D[0] + x, y: D[1] + 740, s: 1.38, flip: fl, lean: ln, face, light: 'under', so: 0.55, pose: w === 'zane' ? 'holdOne' : 'stand', out: o, props: w === 'zane' ? ['gimbal'] : w === 'luke' ? ['headtorch'] : undefined }); hd[w] = o.head; });
    const oD = {};
    d += fig('chase', { x: D[0] + 480, y: D[1] + 750, s: 1.4, view: 'front', pose: 'holdOne', face: 'scared', light: 'under', so: 0.6, props: ['headphones', 'phoneHand'], screen: '#DFF6FF', out: oD });
    d += glow(oD.nh[0], oD.nh[1] - 20, 90, 70, 'gS', 0.6);
    s += pg.panel('d', D, d, { desc: 'Everyone leans in toward the phone in Chase’s hand, faces lit from below.', guided: [{ focus: [210, 646, 590, 420] }, { focus: [520, 768, 440, 298] }] });
    t += pg.say({ p: 'd', type: 'entity', x: 500, y: 720, text: 'Your call is important to us. You are caller number seven.', who: 'THE HOLD', w: 560 });
    t += pg.say({ p: 'd', x: 700, y: 840, text: '…There’s six of us.', who: 'CHASE', tail: [oD.head[0] + 20, oD.head[1] - 30], w: 150, size: 26 });
    t += pg.say({ p: 'd', type: 'tiny', x: 880, y: 1010, text: 'Seven.', who: 'CHLOE (off-panel)', tail: [972, 1040], w: 80 });

    // 5: close on Chase, colour draining out of him
    let e = R(Eb[0], Eb[1], Eb[2], Eb[3], '#151A20') + R(Eb[0], Eb[1], Eb[2], Eb[3], 'url(#ht2)', 'opacity=".18"');
    const oE = {};
    const chaseE = fig('chase', { x: Eb[0] + 690, y: Eb[1] + 1100, s: 3.0, face: 'shock', flip: true, out: oE, light: 'side', so: 0.5, props: ['headphones', 'phoneHand'], pose: 'holdOne', screen: '#DFF6FF' });
    e += chaseE + `<g class="pA-drain" filter="url(#fGrey)">${chaseE}</g>`;
    e += R(Eb[0], Eb[1], Eb[2], Eb[3], 'url(#gVig)', 'opacity=".5"');
    s += pg.panel('e', Eb, e, { desc: 'Close on Chase. The colour drains out of him.', guided: [{ focus: [40, 1084, 570, 376] }, { focus: [480, 1084, 480, 376], move: 'creep' }] });
    // one speaker, three balloons: the first points at him, the others hang off it
    const e1 = [360, 1142, 'Luka. This hold music.', 29, 220], e2 = [272, 1266, 'It’s mine. It’s a Pudding track.', 29, 240], e3 = [290, 1392, 'I never put this one out. It’s only ever been on my laptop.', 27, 330];
    const [, ry1] = pA_bdims(e1[2], e1[3], e1[4]), [, ry2] = pA_bdims(e2[2], e2[3], e2[4]), [, ry3] = pA_bdims(e3[2], e3[3], e3[4]);
    t += pg.say({ p: 'e', x: e1[0], y: e1[1], text: e1[2], who: 'CHASE', tail: [oE.mouth[0] - 96, oE.mouth[1] - 14], w: e1[4] });
    t += pg.say({ p: 'e', x: e2[0], y: e2[1], text: e2[2], who: 'CHASE', w: e2[4] });
    t += pA_link(pg, 'e', [300, e1[1] + ry1 - 6], [300, e2[1] - ry2 + 6]);
    t += pg.say({ p: 'e', x: e3[0], y: e3[1], text: e3[2], who: 'CHASE', w: e3[4], size: e3[3] });
    t += pA_link(pg, 'e', [290, e2[1] + ry2 - 5], [292, e3[1] - ry3 + 5]);

    // the music breaks out of its panel: notes drift across the gutters and off the page
    s += notesFx(500, 550, { count: 6, dx: -380, dy: -420, col: C.y, stroke: C.ink, seed: 'p6x1', size: 40 });
    s += notesFx(560, 560, { count: 5, dx: 300, dy: -380, col: C.y, stroke: C.ink, seed: 'p6x2', size: 38 });
    s += notesFx(470, 600, { count: 6, dx: 520, dy: 320, col: C.y, stroke: C.ink, seed: 'p6x3', size: 36 });
    s += notesFx(520, 600, { count: 4, dx: -560, dy: 240, col: C.y, stroke: C.ink, seed: 'p6x4', size: 34 });
    // notes that gather round the reader's finger while they hold the panel (with sound off)
    let gth = '';
    for (let i = 0; i < 8; i++) { const a2 = (i / 8) * Math.PI * 2; gth += `<text class="ft-s" x="${n(Math.cos(a2) * 46)}" y="${n(Math.sin(a2) * 46 + 10)}" font-size="34" fill="${C.y}" stroke="${C.ink}" stroke-width="3" paint-order="stroke" text-anchor="middle">${i % 2 ? '♪' : '♫'}</text>`; }
    s += t;
    s += `<g class="pA-gather" pointer-events="none"><g class="pA-gpos"><g class="pA-orbit">${gth}</g></g></g>`;
    return s;
  },
  mount(ctx) {
    const gather = ctx.q('.pA-gather'), gpos = ctx.q('.pA-gpos');
    let holding = false;
    const follow = (e) => { if (!holding) return; const p = ctx.toPage(e.clientX, e.clientY); gpos.setAttribute('transform', `translate(${n(p[0])} ${n(p[1])})`); };
    addEventListener('pointermove', follow);
    const off = () => removeEventListener('pointermove', follow);
    ctx.onHold('.pn[data-panel="c"]', (e) => {
      holding = true;
      follow(e);
      const b = Sound.beds.hold;
      if (Sound.on && b) { b.out.gain.cancelScheduledValues(Sound.now()); b.out.gain.setTargetAtTime(0.75, Sound.now(), 0.08); }
      else gather.classList.add('on');
    }, () => {
      holding = false;
      gather.classList.remove('on');
      const b = Sound.beds.hold;
      if (b && Sound.ac) b.out.gain.setTargetAtTime(0.22, Sound.now(), 0.2);
    });
    ctx.onPanel('b', () => ctx.sfx('static', { v: 0.4 }), 1200);
    // keep the pointer listener from outliving the page
    ctx.onCleanup(off);
  },
});

/* ---------- Page 7 — Nightmare on 63rd Street ---------- */

page(7, {
  title: 'Nightmare on 63rd Street', side: 'right', gutter: 'grey', bleed: 'rain', status: 'sos',
  alt: 'Zane livestreams the empty walkway through the front glass. On his phone screen, the walkway is full: a single-file line of people with tickets, faces frozen like a dropped video call, and every table at Cafe 63 taken. Lens down, it is empty — except for a steaming cup on every table and wet footprints outside the glass. Lens up, the line is at the glass. His stream says seven watching. The queue kiosk switches on by itself.',
  sound: { hum: true, rain: true },
  render(pg) {
    const A = [40, 40, 920, 360], B = [40, 418, 920, 420], Cc = [40, 856, 450, 300], D = [508, 856, 452, 300], Eb = [40, 1174, 380, 286], F = [438, 1174, 522, 286];
    // revisit later in the read (or a second read) and they're already inside the doors
    const ss = Reader.sess;
    const inside = pg.second || (pg.revisit && (!ss.pA_p7 || Date.now() - ss.pA_p7 > 15000));
    let s = pA_style(`
      .pA-shuffle{transition:transform .6s steps(3,end)}
      .pA-kon{opacity:0}
      .go .pA-kon{animation:pA-kon 1.6s steps(1,end) forwards}
      @keyframes pA-kon{0%{opacity:0}30%{opacity:.8}45%{opacity:.1}70%{opacity:1}100%{opacity:1}}
      .rm .go .pA-kon{animation:none;opacity:1}`);
    // 1: Zane filming the walkway through the glass
    let a = R(A[0], A[1], A[2], A[3], '#1A2028');
    const gl = [A[0] + 300, A[1] + 30, 620, 300];
    a += pA_walkway(gl, { cafe: { lights: 4, steam: true } }) + pA_glassFrame(gl, { seed: 'p7a' });
    a += R(A[0], A[1], 300, A[3], '#232B34') + R(A[0], A[1] + 300, A[2], 60, '#1C2229');
    a += ollie({ x: A[0] + 96, y: A[1] + 312, s: 0.55, turn: 1, dark: true });
    const oZ = {};
    a += fig('zane', { x: A[0] + 330, y: A[1] + 620, s: 1.45, pose: 'filmHigh', face: 'chat', out: oZ, light: 'front', so: 0.6, screen: '#CFE9F5' });
    a += R(A[0], A[1], A[2], A[3], 'url(#gVig)', 'opacity=".55"');
    s += pg.panel('a', A, a, { desc: 'Zane films the empty walkway through the front glass. Across it, Cafe 63 is lit up. His stream title: NIGHTMARE ON 63RD STREET (NOT CLICKBAIT).', guided: [{ focus: [40, 40, 560, 360] }, { focus: [400, 40, 560, 360] }] });
    s += `<g class="bl" data-p="a" style="--i:${pg.bal++}">${pA_streamBar(A[0] + 330, A[1] + 18, 560, { h: 36 })}</g>`;
    pg.lines.push({ who: 'STREAM', text: '● LIVE — NIGHTMARE ON 63RD STREET (NOT CLICKBAIT)' });
    s += pg.say({ p: 'a', x: 180, y: 120, text: 'Chat, the whole network’s dead and I’m STILL live. Explain that.', who: 'ZANE', tail: [oZ.head[0] - 30, oZ.head[1] - 20], w: 240, size: 26 });

    // 2: over his shoulder — the phone screen, a panel within the panel
    let b = R(B[0], B[1], B[2], B[3], '#10151B') + R(B[0], B[1], B[2], B[3], 'url(#htN)', 'opacity=".4"');
    const ph = [B[0] + 300, B[1] + 26, 560, 380];
    b += glow(ph[0] + ph[2] / 2, ph[1] + ph[3] / 2, 420, 300, 'gS', 0.25);
    b += R(ph[0] - 16, ph[1] - 16, ph[2] + 32, ph[3] + 32, '#141518', `rx="28" ${st(C.ink, 4)}`);
    const cid = uid('ph');
    const vx = ph[0] + ph[2] * 0.49, vy = ph[1] + ph[3] * 0.62;
    b += `<clipPath id="${cid}"><rect x="${ph[0]}" y="${ph[1]}" width="${ph[2]}" height="${ph[3]}" rx="12"/></clipPath><g clip-path="url(#${cid})">` +
      pA_walkway(ph, { cafe: { lights: 4, full: true } }) +
      `<g class="pA-shuffle" style="transform-origin:${n(vx)}px ${n(vy)}px">${queueLine({ x0: ph[0] + ph[2] * 0.74, y0: ph[1] + ph[3] * 1.05, s0: ph[3] / 640, x1: ph[0] + ph[2] * 0.4, y1: ph[1] + ph[3] * 0.6, s1: ph[3] / 2300, count: 11, ease: 1.5, seed: 'p7line', fadeFar: 0.6 })}</g>` +
      pA_streamBar(ph[0] + 12, ph[1] + 12, 470, { h: 30, count: 7 }) + `</g>`;
    // Zane from behind, cap on backwards, his arm up to the phone
    b += Pa(`M${B[0] + 150} ${B[1] + 420}C${B[0] + 190} ${B[1] + 330} ${B[0] + 250} ${B[1] + 300} ${ph[0] - 10} ${ph[1] + ph[3] - 30}L${ph[0] + 40} ${ph[1] + ph[3] + 10}C${B[0] + 300} ${B[1] + 380} ${B[0] + 260} ${B[1] + 400} ${B[0] + 250} ${B[1] + 420}Z`, C.navy, st(C.ink, 5));
    b += Pa(`M${ph[0] - 34} ${ph[1] + ph[3] + 14}c-24 -36 -14 -100 22 -112l40 36l-8 84Z`, '#E6B996', st(C.ink, 4));
    b += pA_zaneBack(B[0] + 110, B[1] + 236, 1);
    s += pg.panel('b', B, b, { desc: 'Over his shoulder, his phone screen: the walkway is full — a single-file line of people facing the store, each holding a small paper ticket, faces frozen and smeared like a dropped video call. Behind them, every table in Cafe 63 is taken, everyone seated perfectly still, all turned toward the store.', guided: [{ focus: [40, 418, 560, 420] }, { focus: [380, 418, 580, 420], move: 'creep' }] });

    // 3: lens down — empty. Cups steaming on every table. Wet footprints.
    const g3 = [Cc[0], Cc[1], Cc[2], Cc[3]];
    const emptyView = pA_walkway(g3, { cafe: { lights: 4, cups: true }, prints: true, seed: 'p7c' });
    // look away and come back: the line is at the glass, faces pressed to it
    const glassView = pA_walkway(g3, { cafe: { lights: 4, cups: true }, prints: true, seed: 'p7c', dark: 0.25 }) + pA_atGlass(g3, { count: 3, sc: 0.95, head: 0.3, seed: 'c' });
    // later in the read: they're already inside the doors
    const ib = [Cc[0] + 70, Cc[1] + 14, Cc[2] - 140, Cc[3] * 0.56];
    const insideView = R(Cc[0], Cc[1], Cc[2], Cc[3], '#1B222A') + pA_walkway(ib, { cafe: { lights: 4, cups: true }, seed: 'p7c' }) + pA_glassFrame(ib, { seed: 'p7ci', mullions: [0.5], drops: 12 }) +
      floorGrid([Cc[0], ib[1] + ib[3], Cc[2], Cc[3] - ib[3] - 14], Cc[0] + Cc[2] / 2, ib[1] + ib[3] * 0.6, { col: '#262E37', lineCol: '#36414C', rows: 6 }) +
      R(Cc[0], Cc[1], 70, Cc[3], '#151B22') + R(Cc[0] + Cc[2] - 70, Cc[1], 70, Cc[3], '#151B22') +
      queueLine({ x0: Cc[0] + 300, y0: Cc[1] + 110 + 318 * 0.78, s0: 0.78, x1: Cc[0] + 222, y1: ib[1] + ib[3] + 4, s1: 0.2, count: 7, seed: 'p7in', ease: 0.8, offset: 2 }) +
      R(Cc[0], Cc[1], Cc[2], Cc[3], 'url(#gVig)', 'opacity=".6"');
    let c = inside ? insideView : swap(emptyView, glassView, 'pA-p7c') + pA_glassFrame(g3, { seed: 'p7cg', mullions: [0.335, 0.665] });
    s += pg.panel('c', Cc, c, { desc: inside ? 'He lowers the phone. The line is already inside the doors.' : 'He lowers the phone. The walkway is empty. Cafe 63 is empty. But every one of its tables now has a cup on it, steaming. Wet footprints on the tiles outside the glass.' });

    // 4: raises it again — the front of the line is at the glass
    let d = R(D[0], D[1], D[2], D[3], '#11161C') + R(D[0], D[1], D[2], D[3], 'url(#htN)', 'opacity=".35"');
    const oZ2 = {};
    d += fig('zane', { x: D[0] + 92, y: D[1] + 178 + 318 * 1.5 * 0.97, s: 1.5, face: ['closed', 'raised', 'grin'], out: oZ2, props: [], arms: { na: [104, 126] }, light: 'side', so: 0.55 });
    const p4 = [D[0] + 222, D[1] + 30, 206, 196];
    d += glow(p4[0] + p4[2] / 2, p4[1] + p4[3] / 2, 200, 170, 'gS', 0.3);
    d += R(p4[0] - 11, p4[1] - 11, p4[2] + 22, p4[3] + 22, '#141518', `rx="20" ${st(C.ink, 4)}`);
    const cid2 = uid('ph');
    d += `<clipPath id="${cid2}"><rect x="${p4[0]}" y="${p4[1]}" width="${p4[2]}" height="${p4[3]}" rx="8"/></clipPath><g clip-path="url(#${cid2})">${R(p4[0], p4[1], p4[2], p4[3], '#1B232C')}${pA_walkway(p4, { cafe: { lights: 4 }, seed: 'p7d' })}${pA_atGlass([p4[0] - 14, p4[1], p4[2] + 28, p4[3]], { count: 2, sc: 0.78, head: 0.4, seed: 'd', off: 3 })}${pA_glassFrame(p4, { seed: 'p7d', mullions: [] })}${pA_streamBar(p4[0] + 8, p4[1] + 8, 112, { h: 24, title: false, count: 7 })}</g>`;
    // his hand on the phone, and the gimbal handle
    d += R(p4[0] + p4[2] / 2 - 7, p4[1] + p4[3] + 10, 14, 60, '#2A2B30', st(C.ink, 2)) + Pa(`M${n(oZ2.nh[0] - 10)} ${n(oZ2.nh[1] + 6)}L${p4[0] + p4[2] / 2 - 6} ${p4[1] + p4[3] + 40}`, 'none', st(C.ink, 22)) + Pa(`M${n(oZ2.nh[0] - 10)} ${n(oZ2.nh[1] + 6)}L${p4[0] + p4[2] / 2 - 6} ${p4[1] + p4[3] + 40}`, 'none', st(C.navy, 15));
    d += Ci(p4[0] + p4[2] / 2, p4[1] + p4[3] + 40, 13, '#E6B996', st(C.ink, 3));
    s += pg.panel('d', D, d, { desc: 'He raises the phone again. On screen, the front of the line is at the glass now, faces pressed to it.' });
    s += pg.say({ p: 'd', x: D[0] + 100, y: D[1] + 62, text: 'Okay, that’s a sick filter. What filter is that?', who: 'ZANE', tail: [oZ2.head[0] + 10, oZ2.head[1] - 40], w: 170, size: 23, r: -3 });
    s += pg.say({ p: 'd', x: D[0] + 340, y: D[1] + 252, text: 'There’s no network. How are you live?', who: 'LUKE (off-panel)', tail: [D[0] + 470, D[1] + 290], w: 190, size: 23 });

    // 5: insert — the stream overlay
    let e = R(Eb[0], Eb[1], Eb[2], Eb[3], '#0B0D10') + R(Eb[0], Eb[1], Eb[2], Eb[3], 'url(#scan)', 'opacity=".25"');
    const lw = textW('LIVE', 46, FONTS.ui);
    e += R(Eb[0] + 30, Eb[1] + 80, lw + 76, 70, '#E0262F', 'rx="10"') + Ci(Eb[0] + 60, Eb[1] + 115, 11, '#FFFFFF', 'class="fx-blink"') + Tx(Eb[0] + 82, Eb[1] + 132, 'LIVE', 46, '#FFFFFF', '', FONTS.ui);
    e += Tx(Eb[0] + lw + 124, Eb[1] + 134, '· 7', 64, '#FFFFFF', '', FONTS.ui) + Tx(Eb[0] + 40, Eb[1] + 212, 'watching', 42, '#C9CED4', '', FONTS.ui);
    s += pg.panel('e', Eb, e, { desc: 'Insert, the stream overlay: LIVE · 7 watching.' });
    pg.lines.push({ who: 'STREAM', text: 'LIVE · 7 watching' });

    // 6: hook — by the front doors, the queue kiosk switches itself on
    let f = R(F[0], F[1], F[2], F[3], '#090B0E');
    const gd = [F[0] + 300, F[1] + 14, 222, 272];
    f += R(gd[0], gd[1], gd[2], gd[3], '#141B24', st(C.ink, 3)) + pA_walkway(gd, { cafe: { lights: 4 }, seed: 'p7f', dark: 0.35 }) + pA_glassFrame(gd, { seed: 'p7f', mullions: [0.5] });
    f += Po([[F[0], F[1] + 236], [F[0] + 300, F[1] + 236], [F[0] + 300, F[1] + 286], [F[0], F[1] + 286]], '#11151A');
    f += `<g class="pA-kon">${glow(F[0] + 170, F[1] + 110, 230, 190, 'gS', 0.55)}${glow(F[0] + 170, F[1] + 270, 200, 30, 'gS', 0.35)}</g>`;
    f += kiosk(F[0] + 170, F[1] + 490, {
      s: 1.55, lit: false,
      screen: (sx, sy, sw, sh) => `<g class="pA-kon">${R(sx, sy, sw, sh, '#DDF3FB')}${textLines(['WELCOME!', 'PLEASE TAKE', 'A TICKET.'], sx + sw / 2, sy + sh / 2, 11, '#0E1A22', { font: FONTS.ui, lh: 1.3 })}</g>`,
    });
    f += R(F[0], F[1], F[2], F[3], 'url(#gVig)', 'opacity=".6"');
    s += pg.panel('f', F, f, { desc: 'By the front doors, the queue kiosk’s screen blinks on by itself: WELCOME! PLEASE TAKE A TICKET.' });
    pg.lines.push({ who: 'KIOSK', text: 'WELCOME! PLEASE TAKE A TICKET.' });
    return s;
  },
  mount(ctx) {
    if (!ctx.sess.pA_p7) ctx.sess.pA_p7 = Date.now();
    ctx.setHiddenTitle('They’re closer');
    // the line on Zane's phone shuffles one step closer every ~5 seconds
    const q = ctx.q('.pA-shuffle');
    let step = 0;
    if (q && !ctx.reduced) ctx.every(5000, () => { if (step < 6) { step++; q.style.transform = `scale(${(1 + step * 0.07).toFixed(3)}) translateY(${step * 6}px)`; } });
    // look away and they come up to the glass
    ctx.on('tabReturn', () => { const sw = ctx.q('.pA-p7c'); if (sw) sw.classList.add('on'); });
    ctx.onPanel('f', () => { const p = ctx.q('.pn[data-panel="f"]'); if (p) p.classList.add('go'); ctx.sfx('beep', { v: 0.3 }); }, 4200);
  },
});

// Zane seen from right behind, big in the foreground: cap on backwards (brim toward us), ears, nape, collar.
function pA_zaneBack(x, y, k) {
  const sk = CAST.zane.skin, hair = CAST.zane.hair, cap = '#1D1F24';
  let g = Pa('M-150 330C-150 220 -110 170 -40 160L40 160C110 170 150 220 150 330Z', C.navy, st(C.ink, 6));
  g += Pa('M-44 150L-30 194L0 176L30 194L44 150Z', C.navy, st(C.y, 3));
  g += R(-34, 70, 68, 110, shade(sk, -0.2), st(C.ink, 5)) + R(-34, 70, 68, 110, C.ink, 'opacity=".3"');
  g += E(-100, 30, 16, 30, sk, st(C.ink, 5)) + E(100, 30, 16, 30, sk, st(C.ink, 5));
  g += E(0, 10, 98, 112, hair, st(C.ink, 6));
  // short hair at the nape
  g += Pa('M-60 96l6 -22M-36 108l4 -24M-12 112l2 -24M12 112l-2 -24M36 108l-4 -24M60 96l-6 -22', 'none', st(shade(hair, -0.35), 3));
  // the cap crown, on backwards
  g += Pa('M-104 8C-108 -84 -54 -112 0 -112C54 -112 108 -84 104 8C60 -6 -60 -6 -104 8Z', cap, st(C.ink, 6));
  g += Pa('M0 -110L0 -10M-62 -90C-50 -60 -46 -30 -48 -4M62 -90C50 -60 46 -30 48 -4', 'none', st('#33363D', 3));
  // the brim, pointing back at us, foreshortened to a thick curve
  g += Pa('M-86 2C-60 -10 60 -10 86 2C78 30 40 44 0 44C-40 44 -78 30 -86 2Z', '#26282E', st(C.ink, 6));
  g += Pa('M-70 6C-40 0 40 0 70 6', 'none', st('#4A4E57', 3));
  g += R(-12, -40, 24, 16, C.y, st(C.ink, 3));
  // the phone glow catching his ear and the edge of the cap
  g += Pa('M100 -60C116 -30 118 10 108 40', 'none', st(C.screen, 5, 'opacity=".55"'));
  return `<g transform="translate(${n(x)} ${n(y)}) scale(${k})">${g}</g>`;
}

/* ---------- Page 8 — Take a Ticket ---------- */

// The kiosk's animated Ollie: waves faster each panel while Code Rot eats him. level 0..5
function pA_miniOllie(x, y, s, level) {
  const body = level >= 5 ? C.rot2 : level >= 3 ? '#C9A915' : C.y;
  const dur = [1.3, 0.95, 0.7, 0.5, 0.36, 0.26][level];
  const sx = x + 68 * s, sy = y - 196 * s;
  let g = `<g transform="translate(${n(x)} ${n(y)}) scale(${s})">`;
  g += Pa('M-18 -120 L-24 -6 M18 -120 L24 -6 M-68 -186 L-102 -150', 'none', st(C.ink, 8));
  g += Ci(0, -190, 72, body, st(C.ink, 6));
  if (level < 5) g += Pa('M-74 -214 C-50 -236 50 -236 74 -214 C60 -186 30 -176 0 -186 C-30 -176 -60 -186 -74 -214 Z', '#FFFFFF', st(C.ink, 5)) + E(-26, -206, 10, 13, C.ink) + E(26, -206, 10, 13, C.ink);
  else g += Pa('M-60 -210 C-30 -200 30 -224 64 -206 C40 -190 10 -180 -10 -190 Z', '#D8D2B0', 'opacity=".7"') + E(-20, -200, 12, 6, C.ink) + E(30, -208, 8, 12, C.ink);
  g += '</g>';
  g += `<g class="pA-wave" style="transform-origin:${n(sx)}px ${n(sy)}px;animation-duration:${dur}s"><g transform="translate(${n(x)} ${n(y)}) scale(${s})">${Pa('M68 -196 L100 -246', 'none', st(C.ink, 8))}${Ci(102, -250, 9, C.ink)}</g></g>`;
  if (level) g += rotPatch({ x: x + 40 * s, y: y - 120 * s, box: [x - 110 * s, y - 280 * s, 220 * s, 280 * s], reach: 70 * s * (1 + level), count: 10 + level * 14, size: 10 + level, seed: `pAko${level}`, grow: 0 });
  return g;
}

// The kiosk's screen content for a given rot level.
const pA_kioskScreen = (level) => (sx, sy, sw, sh) => {
  let g = R(sx, sy, sw, sh, level >= 4 ? '#C9D6C4' : '#DDF3FB');
  const msg = level >= 4 ? ['H▒! Pl░ase', 'ta▓e a t▒cket!'] : ['Hi! Please', 'take a ticket!'];
  g += textLines(msg, sx + sw / 2, sy + 17, 8.5, '#0E1A22', { font: FONTS.ui });
  const cid = uid('ks');
  g += `<clipPath id="${cid}"><rect x="${sx}" y="${sy}" width="${sw}" height="${sh}"/></clipPath><g clip-path="url(#${cid})">${pA_miniOllie(sx + sw / 2, sy + sh - 6, sh / 380, level)}</g>`;
  return g;
};

page(8, {
  title: 'Take a Ticket', side: 'left', gutter: 'grey', bleed: 'grey', status: 'sos',
  alt: 'The kiosk’s little animated Ollie waves. Zane tears off ticket 01 for his stream. The kiosk keeps printing on its own: 02 Luke, 03 Zee, 04 Chase, 05 Luka, 06 Chloe — please proceed to counter. 07 is blank. The kiosk isn’t even plugged in. Luka shreds every ticket. On the kiosk screen, Ollie waves faster and faster as the rot eats him.',
  sound: { hum: true, rain: true },
  render(pg) {
    const A = [40, 40, 560, 380], B = [618, 40, 342, 380], Cc = [40, 438, 920, 280], D = [40, 736, 420, 410], Eb = [478, 736, 482, 410], F = [40, 1164, 920, 296];
    let s = pA_style(`
      .pA-wave{animation:pA-wave 1s ease-in-out infinite;transform-box:view-box}
      @keyframes pA-wave{0%,100%{transform:rotate(-16deg)}50%{transform:rotate(22deg)}}
      .pA-print{animation:pA-print 2.6s steps(8,end) infinite;transform-box:fill-box;transform-origin:50% 0}
      @keyframes pA-print{0%{transform:scaleY(.05)}70%,100%{transform:scaleY(1)}}
      .pA-flut{animation:pA-flut 2.9s ease-in-out infinite alternate;transform-box:fill-box;transform-origin:50% 0}
      @keyframes pA-flut{from{transform:translateY(-7px) rotate(-5deg)}to{transform:translateY(9px) rotate(6deg)}}
      .pA-strip{animation:pA-strip 1.4s linear infinite;transform-box:view-box}
      @keyframes pA-strip{from{transform:translateY(-40px);opacity:1}to{transform:translateY(90px);opacity:0}}
      .pA-heat{opacity:0;transition:opacity 3.5s ease-in}
      .pA-heat.on{opacity:.62}
      .pA-heat.off{opacity:0;transition:opacity 4s ease-out}
      .rm .pA-wave,.rm .pA-print,.rm .pA-flut,.rm .pA-strip{animation:none!important}`);
    // 1: the kiosk, friendly; Zane tears off number one
    let a = R(A[0], A[1], A[2], A[3], '#2B333D') + R(A[0], A[1] + 310, A[2], 70, '#232A32');
    a += R(A[0] + 330, A[1] + 26, 220, 290, '#18202A', st(C.ink, 3)) + rainFx([A[0] + 330, A[1] + 26, 220, 290], { op: 0.45 }) + pA_glassFrame([A[0] + 330, A[1] + 26, 220, 290], { seed: 'p8a', mullions: [0.5] });
    a += glow(A[0] + 170, A[1] + 140, 200, 160, 'gS', 0.35);
    a += kiosk(A[0] + 170, A[1] + 410, { s: 1.12, screen: pA_kioskScreen(0) });
    const oZ = {};
    a += fig('zane', { x: A[0] + 420, y: A[1] + 540, s: 1.15, flip: true, pose: 'reach', face: 'grin', out: oZ, props: ['gimbal'], arms: { na: [70, 96], fa: [150, 170] }, light: 'side', so: 0.5 });
    a += `<g transform="translate(${n(oZ.nh[0] - 14)} ${n(oZ.nh[1] - 6)}) rotate(-20)">${R(-10, -2, 20, 30, '#F7F4EA', st(C.ink, 1.6))}</g>`;
    a += R(A[0], A[1], A[2], A[3], 'url(#gVig)', 'opacity=".45"');
    s += pg.panel('a', A, a, { desc: 'The kiosk, bright and friendly, a little animated Ollie waving on its screen: Hi! Please take a ticket! Zane, performing for chat, tears off a ticket.' });
    s += pg.say({ p: 'a', x: 430, y: 96, text: 'VIP. Number one, baby.', who: 'ZANE', tail: [oZ.head[0] - 6, oZ.head[1] - 36], w: 170 });

    // 2: ticket 01 — ZANE
    let b = R(B[0], B[1], B[2], B[3], '#1E252E') + R(B[0], B[1], B[2], B[3], 'url(#htN)', 'opacity=".4"');
    b += `<g opacity=".8">${kiosk(B[0] + 290, B[1] + 440, { s: 0.8, screen: pA_kioskScreen(1) })}</g>`;
    b += Pa(`M${B[0] - 10} ${B[1] + 390}C${B[0] + 30} ${B[1] + 300} ${B[0] + 80} ${B[1] + 280} ${B[0] + 120} ${B[1] + 290}L${B[0] + 140} ${B[1] + 390}Z`, C.navy, st(C.ink, 4));
    b += ticketProp(B[0] + 64, B[1] + 50, { num: '01', name: 'ZANE', s: 1.45, r: -6 });
    b += E(B[0] + 106, B[1] + 312, 34, 22, '#E6B996', st(C.ink, 4)) + E(B[0] + 168, B[1] + 305, 30, 20, '#E6B996', st(C.ink, 4));
    b += R(B[0], B[1], B[2], B[3], 'url(#gVig)', 'opacity=".4"');
    s += pg.panel('b', B, b, { desc: 'The ticket, close: 01 — ZANE.' });
    pg.lines.push({ who: 'TICKET', text: '01 — ZANE' });

    // 3: the kiosk keeps printing on its own; the tickets flutter down
    let c = R(Cc[0], Cc[1], Cc[2], Cc[3], '#252C35') + R(Cc[0], Cc[1] + 230, Cc[2], 50, '#1E242B');
    c += glow(Cc[0] + 150, Cc[1] + 110, 180, 140, 'gS', 0.3);
    c += kiosk(Cc[0] + 150, Cc[1] + 380, { s: 0.92, screen: pA_kioskScreen(2) });
    c += `<g class="pA-print">${R(Cc[0] + 132, Cc[1] + 226, 36, 54, '#F7F4EA', st(C.ink, 1.5))}</g>`;
    const falls = [['02', 'LUKE', 330, 14, -12], ['03', 'ZEE', 490, 62, 8], ['04', 'CHASE', 650, 20, -5], ['05', 'LUKA', 805, 66, 13]];
    falls.forEach(([num, nm, dx, dy, r], i) => {
      const tx = Cc[0] + dx, ty = Cc[1] + dy;
      // little fall lines above each ticket
      c += Pa(`M${tx - 30} ${ty - 2}v-26M${tx} ${ty - 8}v-30M${tx + 30} ${ty - 2}v-22`, 'none', st('#8F9AA6', 2.2, 'opacity=".7"'));
      c += `<g transform="translate(${tx} ${ty}) rotate(${r})"><g class="pA-flut" style="animation-delay:${-i * 0.9}s">${ticketProp(-57, 0, { num, name: nm, s: 0.95 })}</g></g>`;
    });
    c += R(Cc[0], Cc[1], Cc[2], Cc[3], 'url(#gVig)', 'opacity=".45"');
    s += pg.panel('c', Cc, c, { desc: 'The kiosk keeps printing on its own. Tickets spool out and fall: 02 — LUKE. 03 — ZEE. 04 — CHASE. 05 — LUKA.', guided: [{ focus: [40, 438, 560, 280] }, { focus: [400, 438, 560, 280] }] });
    falls.forEach(([num, nm]) => pg.lines.push({ who: 'TICKET', text: `${num} — ${nm}` }));
    s += pg.sfx('chk-chk-chk', Cc[0] + 252, Cc[1] + 262, { size: 30, rot: -6, fill: '#FFFFFF', p: 'c' });

    // 4: 06 — CHLOE — PLEASE PROCEED TO COUNTER
    let d = R(D[0], D[1], D[2], D[3], '#1A2028') + R(D[0], D[1] + 330, D[2], 80, '#151A21');
    d += glow(D[0] + 300, D[1] + 140, 200, 170, 'gW', 0.12);
    d += `<g opacity=".75">${kiosk(D[0] + 380, D[1] + 410, { s: 0.62, screen: pA_kioskScreen(3) })}</g>`;
    const oC = {};
    d += fig('chloe', { x: D[0] + 95, y: D[1] + 745, s: 1.9, face: ['wide', 'worried', 'frown'], look: [1, -0.6], out: oC, arms: { na: [70, 170] }, light: 'side', so: 0.55 });
    d += pA_ticket(oC.nh[0] - 4, oC.nh[1] - 112, { num: '06', name: 'CHLOE', lines: ['PLEASE PROCEED', 'TO COUNTER'], s: 1.22, r: 4 });
    // her fingers, pinching the edge through the hoodie sleeve
    d += Ci(oC.nh[0] - 4, oC.nh[1] + 4, 13, CAST.chloe.top, st(C.ink, 3)) + R(oC.nh[0] - 2, oC.nh[1] - 22, 12, 24, CAST.chloe.skin, `rx="6" ${st(C.ink, 2.4)}`);
    d += R(D[0], D[1], D[2], D[3], 'url(#gVig)', 'opacity=".5"');
    s += pg.panel('d', D, d, { desc: 'Chloe picks up the next ticket: 06 — CHLOE — PLEASE PROCEED TO COUNTER.' });
    pg.lines.push({ who: 'TICKET', text: '06 — CHLOE — PLEASE PROCEED TO COUNTER' });

    // 5: 07 — blank. Not even plugged in.
    let e = R(Eb[0], Eb[1], Eb[2], Eb[3], '#1D232C') + R(Eb[0], Eb[1] + 320, Eb[2], 90, '#171C23');
    e += R(Eb[0] + 150, Eb[1] + 110, 180, 210, '#141B24', st(C.ink, 3)) + rainFx([Eb[0] + 150, Eb[1] + 110, 180, 210], { op: 0.4 }) + pA_glassFrame([Eb[0] + 150, Eb[1] + 110, 180, 210], { seed: 'p8e', mullions: [0.5], drops: 14 });
    const oZe = {}, oLk = {};
    e += fig('zee', { x: Eb[0] + 72, y: Eb[1] + 590, s: 1.2, pose: 'holdOne', face: ['dot', 'angry', 'frown'], look: [1, 0.6], out: oZe, props: [], light: 'side', so: 0.5 });
    e += `<g transform="translate(${n(oZe.fh[0] + 4)} ${n(oZe.fh[1] - 10)}) rotate(10)">${R(-17, -2, 34, 46, C.y, `rx="5" ${st(C.ink, 3)}`)}${R(-12, 4, 24, 34, '#20262E', 'rx="2"')}</g>`;
    e += fig('luke', { x: Eb[0] + 420, y: Eb[1] + 590, s: 1.15, flip: true, face: 'flat', out: oLk, arms: { na: [100, 150] }, props: ['headtorch'], light: 'side', so: 0.5 });
    // the dangling plug and its cord, hanging back down to the floor
    e += Pa(`M${n(oLk.nh[0] + 2)} ${n(oLk.nh[1] + 10)}C${n(oLk.nh[0] + 10)} ${n(oLk.nh[1] + 120)} ${n(oLk.nh[0] - 60)} ${Eb[1] + 330} ${Eb[0] + 190} ${Eb[1] + 420}`, 'none', st('#111', 5));
    e += `<g transform="translate(${n(oLk.nh[0])} ${n(oLk.nh[1] - 14)}) rotate(-8)">${R(-13, -10, 26, 30, '#E6E3DA', st(C.ink, 2.5))}${Ln(-5, -10, -5, -26, '#B9B4A8', 4.5)}${Ln(5, -10, 5, -26, '#B9B4A8', 4.5)}</g>`;
    e += Ci(oLk.nh[0], oLk.nh[1], 10, CAST.luke.skin, st(C.ink, 3));
    // ticket 07: blank. Linger, and a name develops on it like heat on thermal paper.
    const tk = [oZe.nh[0] - 8, oZe.nh[1] - 172];
    e += glow(tk[0] + 60, tk[1] + 84, 110, 100, 'gW', 0.18);
    e += `<g transform="translate(${n(tk[0])} ${n(tk[1])}) rotate(-5)">${ticketProp(0, 0, { num: '07' })}<text class="ft-m pA-heat" x="60" y="134" font-size="${NAME().length > 9 ? 13 : 17}" fill="#8A5A2B" text-anchor="middle">${esc(NAME())}</text></g>`;
    e += Ci(oZe.nh[0], oZe.nh[1], 9.5, CAST.zee.skin, st(C.ink, 3));
    e += R(Eb[0], Eb[1], Eb[2], Eb[3], 'url(#gVig)', 'opacity=".5"');
    s += pg.panel('e', Eb, e, { desc: 'The last ticket: 07 — blank. Luke holds up the kiosk’s dangling plug.' });
    pg.lines.push({ who: 'TICKET', text: '07 — (blank)' });
    s += pg.say({ p: 'e', x: Eb[0] + 112, y: Eb[1] + 58, text: 'Who programmed this?', who: 'ZEE', tail: [oZe.head[0] + 4, oZe.head[1] - 40], w: 150, size: 25 });
    s += pg.say({ p: 'e', x: Eb[0] + 345, y: Eb[1] + 90, text: 'Nobody. It’s not even plugged in.', who: 'LUKE', tail: [oLk.head[0] + 6, oLk.head[1] - 40], w: 236, size: 25 });

    // 6: the shredder
    let f = R(F[0], F[1], F[2], F[3], '#1C222A');
    f += `<g opacity=".75">${kiosk(F[0] + 820, F[1] + 330, { s: 0.75, screen: pA_kioskScreen(5) })}</g>`;
    f += R(F[0] + 380, F[1] + 150, 200, 150, '#5A6068', st(C.ink, 4)) + R(F[0] + 370, F[1] + 120, 220, 40, '#2E3238', st(C.ink, 4)) + R(F[0] + 400, F[1] + 134, 160, 8, '#050506');
    f += R(F[0] + 392, F[1] + 162, 176, 130, '#B9C4CC', 'opacity=".35"');
    let strips = '';
    for (let i = 0; i < 12; i++) strips += `<g class="pA-strip" style="animation-delay:${-i * 0.12}s">${R(F[0] + 404 + i * 13, F[1] + 160 + (i % 3) * 20, 5, 40, '#F7F4EA', st(C.ink, 0.8))}</g>`;
    f += strips;
    const oLu = {};
    f += fig('luka', { x: F[0] + 230, y: F[1] + 610, s: 1.35, pose: 'reach', face: 'angry', out: oLu, props: ['lanyard'], light: 'side', so: 0.55, arms: { na: [86, 100], fa: [70, 96] } });
    [0, 1, 2].forEach((i) => { f += `<g transform="translate(${n(oLu.nh[0] + 10 + i * 6)} ${n(oLu.nh[1] - 30 - i * 4)}) rotate(${80 + i * 6})">${R(-10, -14, 20, 30, '#F7F4EA', st(C.ink, 1.4))}</g>`; });
    f += ollie({ x: F[0] + 690, y: F[1] + 300, s: 0.46, turn: -1, dark: true });
    f += R(F[0], F[1], F[2], F[3], 'url(#gVig)', 'opacity=".45"');
    s += pg.panel('f', F, f, { desc: 'Luka gathers every ticket and feeds them into the shredder. Behind him, on the kiosk screen, Ollie is a rotted smear, still jerking his arm.', guided: [{ focus: [40, 1164, 580, 296] }, { focus: [480, 1164, 480, 296], move: 'creep' }] });
    s += pg.sfx('ZZZRRRRT', F[0] + 480, F[1] + 110, { size: 40, rot: -4, fill: '#FFFFFF', p: 'f' });
    s += pg.say({ p: 'f', x: F[0] + 140, y: F[1] + 70, text: 'Done. Nobody’s taking anything.', who: 'LUKA', tail: [oLu.head[0] + 10, oLu.head[1] - 30], w: 230 });
    return s;
  },
  mount(ctx) {
    // linger on ticket 07 and the reader's name slowly develops on it, then fades
    const heat = ctx.q('.pA-heat');
    ctx.dwell(10000, () => {
      if (!heat) return;
      heat.classList.add('on');
      ctx.after(6000, () => { heat.classList.remove('on'); heat.classList.add('off'); });
    });
    ctx.onPanel('c', () => ctx.sfx('print'), 1500);
    ctx.onPanel('f', () => ctx.sfx('shred'), 4500);
  },
});

/* ---------- Page 9 — Now Serving 01 ---------- */

page(9, {
  title: 'Now Serving 01', side: 'right', gutter: 'greyblack', bleed: 'black', status: 'sos',
  alt: 'The queue TV above the counter wakes with a chime: NOW SERVING 01. Everyone turns to Zane. He laughs. Luka tells him to come stand over here. Then the lights die. In the dark there is only Zane’s phone screen and his voice: why is the screen warm? Far back in the black, Ollie’s white mask. Then, very small: it’s pulling.',
  sound: { hum: true, rain: true },
  render(pg) {
    const A = [40, 40, 920, 330], B = [40, 388, 560, 380], Cc = [618, 388, 342, 380], D = [40, 786, 920, 400], Eb = [40, 1204, 920, 256];
    let s = pA_style(`.pA-glim{animation:pA-glim 2.3s steps(1,end) infinite}@keyframes pA-glim{0%{opacity:1}38%{opacity:.7}46%{opacity:1}71%{opacity:.82}80%{opacity:1}}.rm .pA-glim{animation:none!important}`);
    // 1: the queue TV wakes
    let a = R(A[0], A[1], A[2], A[3], '#1A2028') + R(A[0], A[1], A[2], A[3], 'url(#htN)', 'opacity=".35"');
    a += counterObj(A[0] + 120, A[1] + 250, 680, 120, { dark: true });
    a += queueTV(A[0] + 300, A[1] + 60, 320, 160, { num: '01' });
    a += glow(A[0] + 460, A[1] + 140, 380, 220, 'gY', 0.25);
    a += R(A[0], A[1], A[2], A[3], 'url(#gVig)', 'opacity=".55"');
    s += pg.panel('a', A, a, { desc: 'The queue TV above the counter wakes. NOW SERVING 01.', guided: [{ focus: [40, 40, 640, 330], move: 'cut' }, { focus: [360, 40, 600, 330] }] });
    s += pg.sfx('BING—', A[0] + 150, A[1] + 120, { size: 74, rot: -10, fill: C.y, p: 'a', log: false });
    pg.lines.push({ who: 'SFX', text: 'BING—BONG.', type: 'sfx' });
    s += pg.sfx('BONG.', A[0] + 790, A[1] + 200, { size: 74, rot: 8, fill: C.y, p: 'a', log: false });
    pg.lines.push({ who: 'QUEUE TV', text: 'NOW SERVING 01' });

    // 2: everyone turns to Zane
    let b = R(B[0], B[1], B[2], B[3], '#202832') + R(B[0], B[1] + 290, B[2], 90, '#1A2027');
    b += glow(B[0] + 300, B[1] + 160, 220, 200, 'gY', 0.15);
    const oZ = {};
    b += fig('zane', { x: B[0] + 300, y: B[1] + 524, s: 0.98, view: 'front', pose: 'handsUp', face: 'laugh', out: oZ, light: 'side', so: 0.45 });
    b += fig('luke', { x: B[0] + 70, y: B[1] + 560, s: 1.25, flip: false, view: 'side', sil: true, rim: 'white', rimDx: 4, props: ['headtorch'] });
    b += fig('zee', { x: B[0] + 500, y: B[1] + 560, s: 1.2, flip: true, sil: true, rim: 'white', rimDx: -4 });
    s += pg.panel('b', B, b, { desc: 'Everyone turns to Zane. He grins, hands up.' });
    s += pg.say({ p: 'b', x: B[0] + 250, y: B[1] + 62, text: 'Haha. Okay. Okay, that’s actually funny.', who: 'ZANE', tail: [oZ.head[0] + 4, oZ.head[1] - 36], w: 340, size: 27 });

    // 3: Luka — come stand over here
    let c = R(Cc[0], Cc[1], Cc[2], Cc[3], '#18202A') + R(Cc[0], Cc[1], Cc[2], Cc[3], 'url(#htN)', 'opacity=".5"');
    const oL = {};
    c += fig('luka', { x: Cc[0] + 150, y: Cc[1] + 900, s: 2.15, face: 'worried', out: oL, pose: 'hand', light: 'side', so: 0.65, props: ['lanyard'], flip: true });
    s += pg.panel('c', Cc, c, { desc: 'Luka, very serious, beckoning.' });
    s += pg.say({ p: 'c', x: Cc[0] + 180, y: Cc[1] + 70, text: 'Zane. Come stand over here.', who: 'LUKA', tail: [oL.head[0] + 10, oL.head[1] - 60], w: 220 });

    // 4: the lights die. Only his phone screen.
    let d = R(D[0], D[1], D[2], D[3], '#000000');
    const px = D[0] + 520, py = D[1] + 220;
    d += `<g class="pA-glim">${glow(px, py, 160, 130, 'gW', 0.28)}${R(px - 22, py - 38, 44, 76, '#FFFFFF', 'rx="5"')}</g>`;
    d += E(px - 30, py + 34, 18, 10, '#26201C', 'opacity=".8"') + E(px + 30, py + 34, 18, 10, '#26201C', 'opacity=".8"');
    d += ollie({ x: D[0] + 846, y: D[1] + 300, s: 0.5, dark: true, turn: -1, cls: 'pA-far' });
    s += pg.panel('d', D, d, { desc: 'The lights die. A black panel: only Zane’s phone screen, a white rectangle floating at chest height. Far back in the black, where the glow barely reaches: a white bandit mask with two black eyes. Ollie’s standee. Closer than it should be.', stroke: '#000', guided: [{ focus: [40, 786, 600, 400], move: 'cut' }, { focus: [480, 786, 480, 400], move: 'creep' }] });
    s += pg.say({ p: 'd', type: 'dark', x: D[0] + 260, y: D[1] + 120, text: 'Guys? …Guys, why is the screen warm?', who: 'ZANE', tail: [px - 30, py - 20], w: 280 });

    // 5: black. One tiny balloon.
    let e = R(Eb[0], Eb[1], Eb[2], Eb[3], '#000000');
    s += pg.panel('e', Eb, e, { desc: 'Black. One tiny balloon.', stroke: '#000', guided: [{ focus: [270, 1204, 460, 256], move: 'cut' }] });
    s += pA_tiny(pg, 'e', Eb[0] + 470, Eb[1] + 140, 'it’s pulling', { who: 'ZANE', size: 21, dark: true, tail: [Eb[0] + 500, Eb[1] + 200] });
    return s;
  },
  mount(ctx) {
    ctx.onPanel('a', () => { ctx.sfx('chime'); ctx.haptic('bell'); }, 400);
    ctx.onPanel('d', () => { Sound.cut('hum'); Sound.cut('rain'); ctx.sfx('static', { v: 0.3 }); }, 3800);
    ctx.onPanel('e', () => Sound.silence(4000), 5200);
  },
});

/* ---------- Page 10 — LIVE ---------- */

// A hand pressed flat against glass from the other side: pale pressure patches where skin meets glass.
// dir: 1 = right hand (thumb on our left), -1 = left hand
function pA_palm(x, y, s, dir = 1, col = '#BFA796') {
  const fingers = [[-25, -44, 66, -9, 8.5], [-8, -50, 78, -3, 9], [10, -49, 74, 3, 9], [27, -40, 58, 10, 8]];
  let g = '';
  fingers.forEach(([fx, fy, len, ang, w]) => {
    g += `<g transform="translate(${fx} ${fy}) rotate(${ang})">${R(-w, -len, w * 2, len + 8, col, `rx="${w}" ${st(C.ink, 2.4)}`)}` +
      `${E(0, -len + w + 2, w * 0.78, w * 1.05, '#F3E8E0', 'opacity=".9"')}${E(0, -len * 0.45, w * 0.6, w * 0.55, '#E9D9CE', 'opacity=".55"')}` +
      `${Pa(`M${-w * 0.6} ${-len * 0.62}h${w * 1.2}M${-w * 0.6} ${-len * 0.3}h${w * 1.2}`, 'none', st(shade(col, -0.3), 1))}</g>`;
  });
  g += `<g transform="translate(-34 4) rotate(-58)">${R(-9, -44, 18, 50, col, `rx="9" ${st(C.ink, 2.4)}`)}${E(0, -34, 7, 9, '#F3E8E0', 'opacity=".85"')}</g>`;
  g += Pa('M-36 -46 C-42 -6 -34 34 -4 44 C26 46 40 14 38 -42 Z', col, st(C.ink, 2.8));
  // pressure: the heel of the palm and the pads under the fingers flattened white against the glass
  g += E(-2, 26, 24, 14, '#F3E8E0', 'opacity=".9"') + E(-18, -34, 9, 6, '#EFE2D8', 'opacity=".8"') + E(2, -38, 9, 6, '#EFE2D8', 'opacity=".8"') + E(20, -34, 9, 6, '#EFE2D8', 'opacity=".8"');
  g += Pa('M-26 -10 Q-4 6 26 -16', 'none', st(shade(col, -0.35), 1.4)) + Pa('M-30 10 Q-10 0 6 -30', 'none', st(shade(col, -0.35), 1.2));
  return `<g transform="translate(${n(x)} ${n(y)}) scale(${n(s * dir)} ${n(s)})">${g}</g>`;
}

// Smudged trails on the glass below a pressed hand, where it has dragged.
function pA_smear(x, y, s, seed) {
  const r = rng(seed);
  let g = '';
  for (let i = 0; i < 4; i++) {
    const sx = x + (-26 + i * 17) * s + r.jit(4), sy = y - 40 * s, len = (90 + r() * 120) * s;
    g += `<path d="M${n(sx)} ${n(sy)}C${n(sx + r.jit(8))} ${n(sy + len * 0.4)} ${n(sx + r.jit(10))} ${n(sy + len * 0.7)} ${n(sx + r.jit(6))} ${n(sy + len)}" fill="none" stroke="#DCE8EF" stroke-width="${n((10 + r() * 6) * s)}" stroke-linecap="round" opacity=".14"/>`;
  }
  return g;
}

CAST.pA_zaneWet = Object.assign({}, CAST.zane, { hs: 'buzz' });

page(10, {
  title: 'LIVE', side: 'left', gutter: 'black', bleed: 'black', status: 'sos',
  alt: 'The lights are back. Zane is gone. His phone lies face-up in the middle of the floor, the others in a wide ring around it, keeping their distance. On the screen, Zane is inside: face and palms pressed against the glass from the other side, mouth wide, hair drifting like he is underwater. Behind him, darkness, and the queue standing in it. The stream is still live. The comments say next, next, next.',
  sound: { hum: true, rain: true },
  render(pg) {
    const A = [40, 40, 920, 860], B = [40, 918, 920, 542];
    let s = pA_style(`
      .pA-press{animation:pA-press 2.8s ease-in-out infinite;transform-box:fill-box;transform-origin:center}
      @keyframes pA-press{0%,100%{transform:scale(1)}45%{transform:scale(1.035)}55%{transform:scale(.99)}}
      .pA-fog{opacity:.16;animation:pA-fog 3.4s ease-in-out infinite;transform-box:fill-box;transform-origin:center}
      @keyframes pA-fog{0%{opacity:.05;transform:scale(.6)}50%{opacity:.4;transform:scale(1.15)}100%{opacity:.05;transform:scale(.6)}}
      .pA-drift{animation:pA-drift 4.5s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 100%}
      @keyframes pA-drift{0%,100%{transform:rotate(-6deg)}50%{transform:rotate(7deg)}}
      .rm .pA-press,.rm .pA-fog,.rm .pA-drift{animation:none!important}`);
    // top: the ring around the phone, high angle — one bank of lights back on, everything else black
    let a = R(A[0], A[1], A[2], A[3], '#22272E');
    a += Po([[A[0], A[1]], [A[0] + A[2], A[1]], [A[0] + A[2], A[1] + 150], [A[0], A[1] + 150]], '#1A1F25');
    a += displayWall([A[0] + 150, A[1] + 10, 620, 130], { cols: 10, rows: 1, lit: false, header: true, wall: '#3A4450', dim: 0.55 });
    a += floorGrid([A[0], A[1] + 150, A[2], A[3] - 150], A[0] + A[2] / 2, A[1] - 500, { col: '#B8B4A9', lineCol: '#9C978A', lines: 10, rows: 12 });
    const cx = A[0] + 460, cy = A[1] + 520;
    // long cast shadows, all converging on the phone
    const ring = [
      ['zee', 300, 260, 0.62, 'front', false, 'scared'],
      ['ollie', 640, 268, 0.42],
      ['chase', 150, 470, 0.8, 'side', false, 'scared'],
      ['luke', 810, 480, 0.8, 'side', true, 'worried'],
      ['chloe', 330, 700, 0.98, 'back', false],
      ['luka', 640, 690, 1.0, 'back', false],
    ];
    ring.forEach(([, x, y, sc]) => {
      const fx = A[0] + x, fy = A[1] + y, dx = cx - fx, dy = cy - fy, L = Math.hypot(dx, dy) || 1, px = -dy / L, py = dx / L, wv = 26 * sc;
      const tx = fx + dx * 0.82, ty = fy + dy * 0.82;
      a += Po([[fx + px * wv, fy + py * wv], [tx + px * wv * 0.45, ty + py * wv * 0.45], [tx - px * wv * 0.45, ty - py * wv * 0.45], [fx - px * wv, fy - py * wv]], C.ink, 'opacity=".55"');
    });
    // darkness everywhere the light doesn't reach
    const vg = uid('p10v');
    a += `<radialGradient id="${vg}" cx="${n((cx - A[0]) / A[2])}" cy="${n((cy - A[1]) / A[3])}" r=".62"><stop offset=".18" stop-color="#000" stop-opacity="0"/><stop offset=".42" stop-color="#000" stop-opacity=".45"/><stop offset=".7" stop-color="#000" stop-opacity=".9"/><stop offset="1" stop-color="#000" stop-opacity=".98"/></radialGradient>`;
    a += R(A[0], A[1], A[2], A[3], `url(#${vg})`);
    // the one bank of fluorescents, and the hard cone it throws
    a += `<path d="M${A[0] + 380} ${A[1] - 10}L${A[0] + 540} ${A[1] - 10}L${A[0] + 800} ${A[1] + 760}L${A[0] + 120} ${A[1] + 760}Z" fill="url(#gCone)" opacity=".55"/>`;
    a += `<g class="fx-flicker2">${R(A[0] + 386, A[1] + 6, 148, 14, '#F4FAFF', st(C.ink, 3))}${glow(A[0] + 460, A[1] + 14, 140, 26, 'gW', 0.8)}</g>`;
    // the phone, face-up — the brightest thing on the floor
    a += glow(cx, cy, 240, 110, 'gS', 0.85) + glow(cx, cy, 90, 46, 'gW', 0.7);
    a += `<g transform="translate(${cx} ${cy}) skewX(-22) scale(1 .55)">${R(-34, -60, 68, 120, '#121418', `rx="8" ${st(C.ink, 3)}`)}${R(-29, -54, 58, 108, '#E6F8FF', 'rx="5" class="lit"')}${R(-24, -48, 16, 8, '#E0262F')}</g>`;
    const hd = {};
    ring.forEach(([w, x, y, sc, view, fl, face]) => {
      if (w === 'ollie') { a += ollie({ x: A[0] + x, y: A[1] + y, s: sc, dark: true }); return; }
      const o = {};
      const back = view === 'back';
      a += fig(w, { x: A[0] + x, y: A[1] + y, s: sc, view, flip: fl, face, out: o, sil: back, rim: back ? 'screen' : null, rimDx: x < 460 ? 4 : -4, light: view === 'front' ? 'under' : 'side', so: 0.75, props: w === 'luke' ? ['headtorch'] : undefined });
      hd[w] = o.head;
    });
    a += R(A[0], A[1], A[2], A[3], 'url(#ht1)', 'opacity=".18"');
    s += pg.panel('a', A, a, { desc: 'One bank of lights is back on, harsh, everything outside it black. Zane is gone. His phone lies face-up in the middle of the floor, the brightest thing in the room. The others stand in a wide ring around it, keeping their distance, their long shadows all pointing at it — and the cardboard Ollie stands in the ring with them.' , guided: [{ focus: [40, 40, 540, 790], move: 'cut' }, { focus: [420, 40, 540, 790], move: 'creep' }] });
    s += pg.say({ p: 'a', type: 'whisper', x: A[0] + 150, y: A[1] + 600, text: 'He’s still live.', who: 'CHLOE', tail: [hd.chloe[0] - 20, hd.chloe[1] - 10], w: 160 });

    // bottom: inside the screen
    let b = R(B[0], B[1], B[2], B[3], '#06121B');
    b += glow(B[0] + 460, B[1] + 300, 520, 360, 'gS', 0.18);
    b += `<g opacity=".55">${queueLine({ x0: B[0] + 760, y0: B[1] + 420, s0: 0.4, x1: B[0] + 620, y1: B[1] + 250, s1: 0.12, count: 7, seed: 'p10q', sil: true, ease: 1.3 })}${queueLine({ x0: B[0] + 160, y0: B[1] + 400, s0: 0.36, x1: B[0] + 300, y1: B[1] + 250, s1: 0.12, count: 6, seed: 'p10r', sil: true, offset: 3, ease: 1.3 })}</g>`;
    // Zane, underwater, hair drifting
    const oZ = {};
    const zx = B[0] + 410, zy = B[1] + 250 + 318 * 4.3 * 0.97;
    b += fig('pA_zaneWet', { x: zx, y: zy, s: 4.3, view: 'front', face: ['pin', 'worried', 'scream'], out: oZ, props: [], light: 'under', so: 0.6 });
    const zk = oZ.scale, HR = 24 * zk, hr = rng('p10hair');
    let hair = '';
    // locks of hair lifting off his head and drifting, as if he's under water
    for (let i = 0; i < 12; i++) {
      const a0 = (-170 + i * (160 / 11)) * D2R;
      const bx = oZ.head[0] + Math.cos(a0) * HR * 0.84, by = oZ.head[1] + Math.sin(a0) * HR * 0.95;
      const L = HR * (0.7 + hr() * 0.6), tx = bx + Math.cos(a0) * L * 0.95 + hr.jit(HR * 0.15), ty = by - L * (0.5 + hr() * 0.3);
      const Lr = Math.hypot(tx - bx, ty - by), ux = (tx - bx) / Lr, uy = (ty - by) / Lr, px = -uy, py = ux;
      const wv = HR * 0.3 * (i % 2 ? 1 : -1), wd = HR * (0.17 + hr() * 0.07);
      const at = (t, off) => `${n(bx + (tx - bx) * t + px * off)} ${n(by + (ty - by) * t + py * off)}`;
      const d = `M${at(0, wd)}C${at(0.33, wv + wd * 0.7)} ${at(0.66, -wv + wd * 0.3)} ${at(1, 0)}C${at(0.66, -wv - wd * 0.3)} ${at(0.33, wv - wd * 0.7)} ${at(0, -wd)}Z`;
      hair += `<g class="pA-drift" style="animation-delay:${n(-hr() * 4)}s;animation-duration:${n(3.8 + hr() * 2)}s"><path d="${d}" fill="#4E3420" ${st(C.ink, 2.6)}/><path d="M${at(0.1, 0)}C${at(0.4, wv * 0.6)} ${at(0.7, -wv * 0.6)} ${at(0.92, 0)}" fill="none" ${st('#7A5634', 1.6)}/></g>`;
    }
    b = b.replace('<g class="fig fig-pA_zaneWet', `<g>${hair}</g><g class="fig fig-pA_zaneWet`);
    // face pressed to the glass: the nose and cheeks flattened pale, hollows under the eyes, the fog of his breath
    b += E(oZ.head[0] - 9 * zk, oZ.head[1] + 6 * zk, 5.5 * zk, 2.6 * zk, C.ink, 'opacity=".28"') + E(oZ.head[0] + 9 * zk, oZ.head[1] + 6 * zk, 5.5 * zk, 2.6 * zk, C.ink, 'opacity=".28"');
    b += E(oZ.head[0], oZ.head[1] + 7 * zk, 5 * zk, 3.4 * zk, '#F3E8E0', 'opacity=".6"') + E(oZ.head[0] - 15 * zk, oZ.head[1] + 12 * zk, 6 * zk, 3.6 * zk, '#F3E8E0', 'opacity=".35"') + E(oZ.head[0] + 15 * zk, oZ.head[1] + 12 * zk, 6 * zk, 3.6 * zk, '#F3E8E0', 'opacity=".35"');
    b += R(B[0], B[1], B[2], B[3], C.screen, 'opacity=".08"');
    b += `<g class="pA-fog">${E(oZ.mouth[0], oZ.mouth[1] + 14, 150, 84, 'url(#gW)')}</g>`;
    // air escaping from his mouth
    const rb = rng('p10bub');
    for (let i = 0; i < 7; i++) b += `<circle class="fx-drift" cx="${n(oZ.head[0] + 60 + rb.jit(40))}" cy="${n(oZ.head[1] - HR * 1.2 - i * 26)}" r="${n(4 + rb() * 7)}" fill="none" stroke="#CFEFFB" stroke-width="2.4" opacity=".7" style="--dx:${n(rb.jit(40))}px;--dy:${n(-120 - rb() * 80)}px;animation-delay:${n(-rb() * 6)}s;animation-duration:${n(4 + rb() * 3)}s"/>`;
    // stream overlay, along the bottom
    const by0 = B[1] + B[3] - 104;
    b += R(B[0] + 24, by0, 560, 80, 'rgba(8,8,10,.72)', 'rx="8"') + R(B[0] + 34, by0 + 10, 70, 28, '#E0262F', 'rx="5"') + Ci(B[0] + 48, by0 + 24, 5, '#FFFFFF', 'class="fx-blink"') + Tx(B[0] + 58, by0 + 32, 'LIVE', 19, '#FFFFFF', '', FONTS.ui);
    b += `<text class="ft-u pA-count" x="${B[0] + 114}" y="${by0 + 34}" font-size="26" fill="#FFFFFF">◉ 1.2K watching</text>`;
    b += Tx(B[0] + 36, by0 + 68, 'NIGHTMARE ON 63RD STREET (NOT CLICKBAIT)', 20, '#FFFFFF', '', FONTS.ui);
    // comments, scrolling forever
    const users = ['bazza_77', 'kaylz', 'redcliffe_rat', 'dee.dee', 'tom_h', 'mum', 'ghostgirl', 'p_stocky', 'xX_ollie_Xx', 'jgaunt', 'w8ing', 'ticket07'];
    const me = hasName() ? NAME().toLowerCase() : 'you';
    const cc = [B[0] + 680, B[1] + 36, 220, 400];
    const rows = [];
    for (let i = 0; i < 14; i++) rows.push(i === 6 ? me : users[i % users.length]);
    const LH = 34;
    // the reader's own row always fits, ': next' included, however long their name
    const meFs = Math.min(21, (cc[2] - 26) / textW(`${me}: next`, 1, FONTS.ui));
    const one = rows.map((u, i) => (u === me ? R(cc[0] + 4, cc[1] + 8 + i * LH, cc[2] - 8, LH - 4, C.y, 'rx="4" opacity=".92"') : '') +
      `<text class="ft-u" x="${cc[0] + 12}" y="${cc[1] + 32 + i * LH}" font-size="${n(u === me ? meFs : 19)}" fill="${u === me ? C.ink : '#DDE3E8'}"><tspan font-weight="800">${esc(u)}</tspan><tspan fill="${u === me ? C.ink : '#FFFFFF'}" font-weight="${u === me ? 800 : 400}">: next</tspan></text>`).join('');
    const list = `<g class="fx-scroll" style="--sd:12s;--sh:-${rows.length * LH}px">${one}<g transform="translate(0 ${rows.length * LH})">${one}</g></g>`;
    const ccid = uid('cc');
    b += `<clipPath id="${ccid}"><rect x="${cc[0]}" y="${cc[1]}" width="${cc[2]}" height="${cc[3]}"/></clipPath>${R(cc[0], cc[1], cc[2], cc[3], 'rgba(0,0,0,.4)', 'rx="8"')}<g clip-path="url(#${ccid})">${list}</g>`;
    // glass sheen and the phone bezel
    b += Pa(`M${B[0]} ${B[1] + 120}L${B[0] + 260} ${B[1]}L${B[0] + 330} ${B[1]}L${B[0]} ${B[1] + 170}Z`, '#FFFFFF', 'opacity=".06"');
    b += R(B[0] + 6, B[1] + 6, B[2] - 12, B[3] - 12, 'none', `rx="34" ${st('#111', 14)}`);
    // his palms, flattened against the glass from the inside — fingers breaking over the top of the panel
    const lp = [B[0] + 210, B[1] + 92], rp = [B[0] + 612, B[1] + 82];
    b += pA_smear(lp[0], lp[1], 1.3, 'p10sl') + pA_smear(rp[0], rp[1], 1.3, 'p10sr');
    const gc = uid('p10g');
    const palms = `<g class="pA-press">${pA_palm(lp[0], lp[1], 1.3, -1)}</g><g class="pA-press" style="animation-delay:-1.3s">${pA_palm(rp[0], rp[1], 1.3, 1)}</g>` +
      `<clipPath id="${gc}"><rect x="${B[0]}" y="${B[1]}" width="${B[2]}" height="${B[3]}"/></clipPath><g clip-path="url(#${gc})" pointer-events="none">${R(B[0], B[1], B[2], B[3], C.screen, 'opacity=".07"')}${pA_smear(lp[0], lp[1] - 20, 1.1, 'p10gl')}${pA_smear(rp[0], rp[1] - 20, 1.1, 'p10gr')}${Pa(`M${B[0] + 120} ${B[1]}L${B[0] + 230} ${B[1]}L${B[0] + 40} ${B[1] + 260}L${B[0]} ${B[1] + 220}Z`, '#FFFFFF', 'opacity=".07"')}</g>`;
    s += pg.panel('b', B, b, { desc: 'Big close-up on the screen: Zane is inside it. Face and palms pressed against the glass from the other side, mouth wide, hair drifting like he’s underwater. Behind him, deep darkness, and the queue standing in it. Stream overlay: LIVE · 1.2K watching. The comments column: next, next, next, next.', guided: [{ focus: [40, 918, 640, 542], move: 'cut' }, { focus: [560, 918, 400, 542] }], over: palms });
    pg.lines.push({ who: 'STREAM', text: 'LIVE · 1.2K watching — NIGHTMARE ON 63RD STREET (NOT CLICKBAIT)' });
    pg.lines.push({ who: 'COMMENTS', text: `next · next · next · ${me}: next · next…` });
    return s;
  },
  mount(ctx) {
    // you are watching: the count climbs, faster the longer you look
    const el = ctx.q('.pA-count');
    let v = 1200, t0 = Date.now();
    const fmt = (x) => (x >= 1000 ? `${(x / 1000).toFixed(x >= 10000 ? 0 : 1)}K` : String(x));
    ctx.every(250, () => {
      if (document.hidden) return;
      const t = (Date.now() - t0) / 1000;
      v += Math.ceil(1 + t * t * 0.6);
      if (el) el.textContent = `◉ ${fmt(v)} watching`;
    });
    // him hitting the glass: a dull double thump, three times at most
    [1800, 5200, 8600].forEach((ms) => ctx.after(ms, () => { ctx.haptic('thump'); ctx.sfx('thump'); ctx.after(220, () => ctx.sfx('thump', { v: 0.6 })); }));
  },
});

/* ---------- Page 11 — Roof ---------- */

// Panel 4 of page 11, which contains a thumbnail of itself, three levels deep.
// The laptop running The OG fills the top of the panel; Chase and Chloe sit with their backs to us below it.
function pA_ogScene(box, depth, third) {
  const [x, y, w, h] = box;
  const k = w / 482;
  let g = R(x, y, w, h, '#151B22');
  // the laptop screen running The OG
  const L = [x + w * 0.1, y + h * 0.05, w * 0.8, h * 0.58];
  g += glow(L[0] + L[2] / 2, L[1] + L[3] / 2, L[2] * 0.75, L[3] * 0.9, 'gS', 0.32);
  g += R(L[0] - 8 * k, L[1] - 8 * k, L[2] + 16 * k, L[3] + 16 * k, '#2A2D33', `rx="${6 * k}"`) + R(L[0], L[1], L[2], L[3], '#F2EFE6');
  g += R(L[0], L[1], L[2], L[3] * 0.11, C.y) + (depth >= 2 ? Tx(L[0] + 8 * k, L[1] + L[3] * 0.085, 'The OG', L[3] * 0.075, C.ink, '', FONTS.ui) : '');
  const cols = 4, rows = 3, gx = L[0] + 5 * k, gy = L[1] + L[3] * 0.13, tw = (L[2] - 10 * k) / cols, th = (L[3] * 0.85) / rows;
  const titles = ['', '', 'GOD OF WARRANTY', 'OLLIE SWING', '', '', 'OLLIE KICK', 'QUEUE BUSTER', 'OLLIE GOLF', 'SIM DROP', 'STOCKY', 'OLLIE DASH'];
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
    const idx = j * cols + i;
    if (idx === 1 || idx === 4 || idx === 5) continue; // the big tile covers these
    const tx = gx + i * tw, ty = gy + j * th;
    if (idx === 0) {
      // the tile nobody uploaded — the only one without Ollie — and its thumbnail is this panel
      const tb = [tx + 2 * k, ty + 2 * k, tw * 2 - 4 * k, th * 2 - 4 * k];
      g += R(tb[0] - 3 * k, tb[1] - 3 * k, tb[2] + 6 * k, tb[3] + 6 * k, C.laser);
      g += R(tb[0], tb[1], tb[2], tb[3], '#0B0E12');
      const tbox = [tb[0] + tb[2] * 0.12, tb[1] + tb[3] * 0.02, tb[2] * 0.76, tb[3] * 0.8];
      if (depth > 1) g += pA_ogScene(tbox, depth - 1, third);
      else g += R(tbox[0], tbox[1], tbox[2], tbox[3], '#151B22');
      // second read: someone is standing behind them, holding a glowing screen
      if (third && depth === 3) g += readerFig({ x: tbox[0] + tbox[2] * 0.5, y: tbox[1] + tbox[3] * 1.0, s: tbox[3] / 560, device: 'phone' });
      g += R(tb[0], tb[1] + tb[3] * 0.82, tb[2], tb[3] * 0.18, C.ink) + (depth >= 2 ? Tx(tb[0] + tb[2] / 2, tb[1] + tb[3] * 0.96, 'SOS ONLY — NEW', tb[3] * 0.12, C.y, 'text-anchor="middle"', FONTS.ui) : '');
      continue;
    }
    const tb = [tx + 2 * k, ty + 2 * k, tw - 4 * k, th - 4 * k];
    const hue = ['#3D6FB0', '#4E7A5A', '#7A2E3A', '#2B4E7A', '#8A6A2A', '#5B3C88'][idx % 6];
    g += R(tb[0], tb[1], tb[2], tb[3], hue);
    if (depth >= 2) {
      const os = tb[3] / 420, ox = tb[0] + tb[2] / 2 + (idx % 3 - 1) * tb[2] * 0.2, oy = tb[1] + tb[3] * (0.72 - (idx % 2) * 0.12);
      g += `<g transform="translate(${n(ox)} ${n(oy)}) scale(${n(os)}) rotate(${(idx % 5 - 2) * 14})">${Ci(0, -190, 72, C.y, st(C.ink, 8))}${Pa('M-74 -214 C-50 -236 50 -236 74 -214 C60 -186 30 -176 0 -186 C-30 -176 -60 -186 -74 -214 Z', '#FFFFFF', st(C.ink, 6))}${E(-26, -206, 10, 13, C.ink)}${E(26, -206, 10, 13, C.ink)}${Pa('M-68 -186 L-110 -230 M68 -186 L110 -150 M-18 -120 L-40 -10 M18 -120 L40 -30', 'none', st(C.ink, 10))}</g>`;
      g += R(tb[0], tb[1] + tb[3] * 0.8, tb[2], tb[3] * 0.2, 'rgba(0,0,0,.55)') + Tx(tb[0] + tb[2] / 2, tb[1] + tb[3] * 0.95, titles[idx], tb[3] * 0.13, '#FFFFFF', 'text-anchor="middle"', FONTS.ui);
    }
  }
  // the keyboard deck
  g += Po([[L[0] - 8 * k, L[1] + L[3] + 8 * k], [L[0] + L[2] + 8 * k, L[1] + L[3] + 8 * k], [L[0] + L[2] + 40 * k, L[1] + L[3] + 40 * k], [L[0] - 40 * k, L[1] + L[3] + 40 * k]], '#8E949C', st(C.ink, 2 * k));
  g += R(x, y + h * 0.86, w, h * 0.14, '#2B2E35');
  // Chase and Chloe from behind, sitting on the counter
  const fs = h / 360;
  g += fig('chase', { x: x + w * 0.2, y: y + h * 0.8 + 194 * fs, s: fs, view: 'back', pose: 'sit', light: 'none' });
  const oc = {};
  g += fig('chloe', { x: x + w * 0.8, y: y + h * 0.8 + 194 * fs, s: fs, view: 'back', pose: 'sit', light: 'none', out: oc });
  // her hair, from behind, falling over the hood
  const hk = oc.scale, [hx, hy] = oc.head;
  g += Pa([-14, -6, 4, 14].map((dx) => `M${n(hx + dx * hk)} ${n(hy - 22 * hk)}C${n(hx + dx * 1.3 * hk)} ${n(hy)} ${n(hx + dx * 1.1 * hk)} ${n(hy + 30 * hk)} ${n(hx + dx * 1.4 * hk)} ${n(hy + 60 * hk)}`).join(''), 'none', st(shade(CAST.chloe.hair, -0.35), Math.max(0.6, 1.6 * hk)));
  g += Pa(`M${n(hx - 26 * hk)} ${n(hy + 64 * hk)}C${n(hx - 10 * hk)} ${n(hy + 80 * hk)} ${n(hx + 10 * hk)} ${n(hy + 80 * hk)} ${n(hx + 26 * hk)} ${n(hy + 64 * hk)}`, 'none', st(shade(CAST.chloe.top, -0.3), Math.max(0.8, 3 * hk)));
  return g;
}

page(11, {
  title: 'Roof', side: 'right', gutter: 'grey', bleed: 'storm', status: 'sos',
  alt: 'Luke goes up to the roof to find one bar of signal. Chase and Chloe wait on the counter; Chase opens The OG on his laptop — and there is a new game tile nobody uploaded, SOS ONLY, whose thumbnail is the two of them, from behind, looking at the laptop. Someone’s reading us. Luke comes back down at 12:41, drenched. His mouth moves before his words arrive.',
  sound: { hum: true, rain: true },
  render(pg) {
    const A = [40, 40, 520, 290], B = [578, 40, 382, 290], Cc = [40, 348, 420, 400], D = [478, 348, 482, 400], Eb = [40, 766, 300, 250], F = [358, 766, 602, 250], Gp = [40, 1034, 450, 426], H = [508, 1034, 452, 426];
    let s = pA_style(`
      .pA-talk{animation:pA-talk .3s steps(1,end) infinite;transform-box:fill-box;transform-origin:center}
      @keyframes pA-talk{0%{transform:scaleY(1)}50%{transform:scaleY(.2)}}
      .pA-late{opacity:0;transition:opacity .15s}
      .pA-late.on{opacity:1}
      .rm .pA-talk{animation:none!important}`);
    // 1: at the foot of the roof-hatch ladder
    let a = R(A[0], A[1], A[2], A[3], '#2A323C') + R(A[0], A[1], A[2], 60, '#20262E') + R(A[0], A[1], A[2], A[3], 'url(#htN)', 'opacity=".3"');
    a += R(A[0] + 395, A[1] - 10, 120, 62, '#06080A', st(C.ink, 4)) + rainFx([A[0] + 395, A[1] - 10, 120, 62], { op: 0.8 });
    for (let i = 0; i < 6; i++) a += Ln(A[0] + 410, A[1] + 34 + i * 46, A[0] + 500, A[1] + 34 + i * 46, '#9AA0A8', 6);
    a += Ln(A[0] + 410, A[1] + 10, A[0] + 410, A[1] + 300, '#7D838C', 8) + Ln(A[0] + 500, A[1] + 10, A[0] + 500, A[1] + 300, '#7D838C', 8);
    const oLk = {}, oLu = {};
    a += fig('luke', { x: A[0] + 330, y: A[1] + 222 + 318 * 1.12 * 1.03, s: 1.12, flip: true, face: 'talk', out: oLk, props: ['headtorch', 'cable'], light: 'side', so: 0.5 });
    a += fig('luka', { x: A[0] + 120, y: A[1] + 236 + 318 * 1.12, s: 1.12, pose: 'hand', face: 'worried', out: oLu, props: ['lanyard'], light: 'side', so: 0.55 });
    a += R(A[0], A[1], A[2], A[3], 'url(#gVig)', 'opacity=".45"');
    s += pg.panel('a', A, a, { desc: 'Luke at the roof-hatch ladder, head torch on. Luka beside him.' });
    s += pg.say({ p: 'a', x: A[0] + 200, y: A[1] + 56, text: 'There’s a booster on the roof. If I can get one bar, we call out.', who: 'LUKE', tail: [oLk.head[0] - 6, oLk.head[1] - 34], w: 300, size: 24 });
    s += pg.say({ p: 'a', x: A[0] + 92, y: A[1] + 156, text: 'Nobody goes alone.', who: 'LUKA', tail: [oLu.head[0] + 4, oLu.head[1] - 32], w: 130, size: 24 });
    s += pg.say({ p: 'a', x: A[0] + 440, y: A[1] + 170, text: 'Five minutes.', who: 'LUKE', tail: [oLk.head[0] + 30, oLk.head[1] - 8], w: 100, size: 24 });

    // 2: the roof, in the storm
    let b = stormSky(B, { seed: 'p11sky', clouds: 16 });
    b += E(B[0] + 200, B[1] + 220, 260, 70, '#4A5A70', 'opacity=".45"');
    b += lightningFx(B, { bx: B[0] + 260, by: B[1] + 200, seed: 'p11b' });
    b += Po([[B[0], B[1] + 230], [B[0] + B[2], B[1] + 210], [B[0] + B[2], B[1] + B[3]], [B[0], B[1] + B[3]]], '#0A0D11');
    b += R(B[0] + 40, B[1] + 196, 70, 40, '#12161B') + R(B[0] + 290, B[1] + 140, 8, 80, '#0A0D11') + Pa(`M${B[0] + 274} ${B[1] + 142}l20 -34l20 34M${B[0] + 280} ${B[1] + 160}h28`, 'none', st('#0A0D11', 5));
    const oR = {};
    b += fig('luke', { x: B[0] + 190, y: B[1] + 232, s: 0.34, pose: 'pointUp', sil: true, rim: 'white', rimDx: -3, out: oR, add: ['phoneHand'], screen: C.screen, arms: { na: [170, 178] } });
    b += glow(oR.nh[0], oR.nh[1] - 6, 16, 16, 'gS', 0.9);
    b += rainFx(B, { op: 0.9, op2: 0.7 });
    s += pg.panel('b', B, b, { desc: 'Outside, the roof in the storm. Luke, tiny against the sky, holds his phone up like an offering. Lightning.' });

    // 3: Chase and Chloe sitting on the counter
    let c = storeInterior(Cc, { vx: 0.5, vy: 0.36, bw: 0.5, bh: 0.42, night: 0.6, lights: [0, 0, 0, 1, 0, 0], left: 'display', right: 'acc', seed: 'p11c' });
    const ct = Cc[1] + 336;
    c += R(Cc[0] - 10, ct, Cc[2] + 20, 14, '#3A3E46', st(C.ink, 4)) + R(Cc[0] - 10, ct + 14, Cc[2] + 20, 90, '#22252B', st(C.ink, 4)) + R(Cc[0] - 10, Cc[1] + Cc[3] - 16, Cc[2] + 20, 16, '#3A3410');
    const oCh = {}, oCl = {};
    const fsC = 0.92;
    c += fig('chase', { x: Cc[0] + 120, y: ct + 6, s: fsC, pose: 'typing', face: ['dot', 'raised', 'smirk'], look: [1, 0.6], out: oCh, light: 'under', so: 0.45 });
    c += fig('chloe', { x: Cc[0] + 300, y: ct + 6, s: fsC, pose: 'sit', face: ['dot', 'flat', 'flat'], look: [-1, 0.6], flip: true, out: oCl, light: 'under', so: 0.45 });
    // the laptop on his knees, side on, its glow on both their faces
    const lx = oCh.nh[0] + 4, ly = oCh.nh[1] - 2;
    c += glow(lx + 30, ly - 30, 90, 70, 'gS', 0.55);
    c += `<g class="lit">${Pa(`M${n(lx - 30)} ${n(ly)}L${n(lx + 44)} ${n(ly)}L${n(lx + 44)} ${n(ly + 6)}L${n(lx - 30)} ${n(ly + 6)}Z`, '#8E949C', st(C.ink, 2.5))}${Pa(`M${n(lx + 44)} ${n(ly)}L${n(lx + 70)} ${n(ly - 54)}L${n(lx + 63)} ${n(ly - 57)}L${n(lx + 37)} ${n(ly - 3)}Z`, '#2A2D33', st(C.ink, 2.5))}${Ln(lx + 40, ly - 6, lx + 62, ly - 50, C.screen, 3)}</g>`;
    c += R(Cc[0], Cc[1], Cc[2], Cc[3], 'url(#gVig)', 'opacity=".4"');
    s += pg.panel('c', Cc, c, { desc: 'The shop floor. Chase and Chloe sit on the counter, waiting. Chase flips his laptop open.' });
    s += pg.say({ p: 'c', x: Cc[0] + 148, y: Cc[1] + 74, text: 'Network’s dead, but The OG still runs. Every game’s one HTML file. Works offline.', who: 'CHASE', tail: [oCh.head[0] + 4, oCh.head[1] - 32], w: 240, size: 23 });
    s += pg.say({ p: 'c', x: Cc[0] + 352, y: Cc[1] + 70, text: 'Course it does.', who: 'CHLOE', tail: [oCl.head[0] + 2, oCl.head[1] - 32], w: 100, size: 23 });

    // 4: The OG — and a tile nobody uploaded
    s += pg.panel('d', D, pA_ogScene(D, 3, pg.second), { desc: 'The OG’s grid of game tiles, Ollie on nearly every one of them. At the top, a tile nobody uploaded, the only one without Ollie: SOS ONLY — NEW. Its thumbnail is a comic panel: two people sitting on a counter, looking at a laptop, drawn from behind.' + (pg.second ? ' Behind them in the thumbnail, a third figure, holding a glowing screen.' : '') });
    const w1 = [D[0] + 372, D[1] + 92], w2 = [D[0] + 360, D[1] + 196];
    s += pg.say({ p: 'd', type: 'whisper', x: w1[0], y: w1[1], text: '…That’s us.', who: 'CHLOE', w: 120, size: 24 });
    const [, r1] = pA_bdims('…That’s us.', 24, 120), [, r2] = pA_bdims('Someone’s reading us.', 24, 150);
    s += pg.say({ p: 'd', type: 'whisper', x: w2[0], y: w2[1], text: 'Someone’s reading us.', who: 'CHLOE', tail: [D[0] + 392, D[1] + 296], w: 150, size: 24 });
    s += pA_link(pg, 'd', [w1[0] - 6, w1[1] + r1 - 4], [w2[0] - 6, w2[1] - r2 + 4], 18);
    s += pg.sfx('SNAP', D[0] + 236, D[1] + 352, { size: 40, rot: -8, fill: '#FFFFFF', p: 'd' });

    // 5: looking up through the skylight — 12:30
    let e = R(Eb[0], Eb[1], Eb[2], Eb[3], '#0B0E12');
    const sk = [Eb[0] + 50, Eb[1] + 30, 200, 190];
    e += Po([[Eb[0], Eb[1]], [Eb[0] + Eb[2], Eb[1]], [sk[0] + sk[2], sk[1]], [sk[0], sk[1]]], '#151A20') + Po([[Eb[0], Eb[1] + Eb[3]], [Eb[0] + Eb[2], Eb[1] + Eb[3]], [sk[0] + sk[2], sk[1] + sk[3]], [sk[0], sk[1] + sk[3]]], '#10141A');
    e += stormSky(sk, { seed: 'p11e', clouds: 8 }) + E(sk[0] + 100, sk[1] + 110, 110, 60, '#3A4A5E', 'opacity=".4"') + lightningFx(sk, { seed: 'p11e2', delay: 2 });
    e += fig('luke', { x: sk[0] + 110, y: sk[1] + 230, s: 0.5, pose: 'phone', tilt: 14, props: ['phoneEar', 'headtorch', 'cable'], sil: true, rim: 'white', rimDx: -3 });
    e += rainFx(sk, { op: 0.8 }) + R(sk[0], sk[1], sk[2], sk[3], 'none', st('#2E353E', 8));
    s += pg.panel('e', Eb, e, { desc: 'From inside, looking up through the skylight: Luke’s silhouette against the clouds, phone to his ear.' });
    s += pg.cap({ p: 'e', x: Eb[0] + 12, y: Eb[1] + 12, text: '12:30.', w: 100, size: 22 });

    // 6: 12:41 — the hatch opens, he climbs down
    let f = R(F[0], F[1], F[2], F[3], '#252C35') + R(F[0], F[1], F[2], 60, '#1C2229') + R(F[0], F[1], F[2], F[3], 'url(#htN)', 'opacity=".3"');
    f += R(F[0] + 240, F[1] - 10, 150, 60, '#06080A', st(C.ink, 4)) + rainFx([F[0] + 240, F[1] - 10, 150, 60], { op: 0.9 });
    for (let i = 0; i < 5; i++) f += Ln(F[0] + 262, F[1] + 40 + i * 46, F[0] + 368, F[1] + 40 + i * 46, '#9AA0A8', 6);
    f += Ln(F[0] + 262, F[1], F[0] + 262, F[1] + 250, '#7D838C', 8) + Ln(F[0] + 368, F[1], F[0] + 368, F[1] + 250, '#7D838C', 8);
    f += R(F[0], F[1], 130, F[3], '#0B0E12', 'opacity=".75"') + ollie({ x: F[0] + 64, y: F[1] + 246, s: 0.32, dark: true, turn: 1 });
    const oF = {};
    f += fig('luke', { x: F[0] + 316, y: F[1] + 300, s: 0.95, view: 'back', pose: 'handsUp', out: oF, props: ['headtorch', 'cable'] });
    let drips = '';
    const rd = rng('p11d');
    for (let i = 0; i < 18; i++) { const dx = F[0] + 260 + rd() * 110, dy = F[1] + 60 + rd() * 180; drips += `<path d="M${n(dx)} ${n(dy)}q-2 7 0 11q2 -4 0 -11Z" fill="#9FC3D9"/>`; }
    f += drips + Pa(`M${F[0] + 250} ${F[1] + 250}q66 -14 132 0`, 'none', st('#6E8DA6', 3, 'opacity=".7"'));
    s += pg.panel('f', F, f, { desc: 'The hatch opens. Luke climbs down, drenched.' });
    s += pg.cap({ p: 'f', x: F[0] + 14, y: F[1] + 14, text: '12:41.', w: 100, size: 22 });
    s += pg.say({ p: 'f', x: F[0] + 500, y: F[1] + 110, text: 'Got nothing. It’s dead up there.', who: 'LUKE', tail: [oF.head[0] + 34, oF.head[1] + 4], w: 170, size: 24 });

    // 7 & 8: the latency — his mouth moves first, the words come later
    const towel = (o) => {
      const [hx, hy] = o.head, k = o.scale;
      return Pa(`M${n(hx - 62 * k)} ${n(hy + 64 * k)}C${n(hx - 40 * k)} ${n(hy + 40 * k)} ${n(hx - 18 * k)} ${n(hy + 44 * k)} ${n(hx)} ${n(hy + 58 * k)}C${n(hx + 18 * k)} ${n(hy + 44 * k)} ${n(hx + 40 * k)} ${n(hy + 40 * k)} ${n(hx + 62 * k)} ${n(hy + 64 * k)}L${n(hx + 48 * k)} ${n(hy + 130 * k)}L${n(hx + 14 * k)} ${n(hy + 80 * k)}L${n(hx - 16 * k)} ${n(hy + 140 * k)}L${n(hx - 50 * k)} ${n(hy + 120 * k)}Z`, '#E9E6DE', st(C.ink, 4)) +
        Pa(`M${n(hx - 40 * k)} ${n(hy + 60 * k)}l6 30M${n(hx + 30 * k)} ${n(hy + 58 * k)}l-4 34`, 'none', st('#C9C4B8', 3));
    };
    const wet = (o) => {
      const [hx, hy] = o.head, k = o.scale, r2 = rng('p11wet');
      let w = '';
      for (let i = 0; i < 10; i++) { const x = hx + r2.jit(22) * k, y = hy + (-20 + r2() * 40) * k; w += `<path d="M${n(x)} ${n(y)}q-${n(1.6 * k)} ${n(5 * k)} 0 ${n(8 * k)}q${n(1.6 * k)} -${n(3 * k)} 0 -${n(8 * k)}Z" fill="#BFE0F0" opacity=".85"/>`; }
      return w;
    };
    const pair = (P, talking) => {
      let g = R(P[0], P[1], P[2], P[3], '#1E252E') + R(P[0], P[1], P[2], P[3], 'url(#htN)', 'opacity=".35"');
      g += glow(P[0] + 300, P[1] + 160, 220, 200, 'gW', 0.1);
      const o = {};
      g += pA_fakeLuke({ x: P[0] + 280, y: P[1] + 200 + 318 * 2.8 * 1.03, s: 2.8, view: 'front', face: ['dot', 'flat', 'line'], out: o, gdx: 5, light: 'side', so: 0.5 });
      g += towel(o) + wet(o);
      if (talking) g += `<g class="pA-talk">${E(o.mouth[0], o.mouth[1] + 2, 15, 10, C.ink)}${E(o.mouth[0], o.mouth[1] + 5, 7, 3.5, '#3E1414')}</g>`;
      // Chloe in the foreground, from behind, watching him
      g += fig('chloe', { x: P[0] + 70, y: P[1] + 300 + 318 * 2.6 * 0.92, s: 2.6, view: 'back', sil: true, rim: 'screen', rimDx: 5 });
      g += R(P[0], P[1], P[2], P[3], 'url(#gVig)', 'opacity=".5"');
      return [g, o];
    };
    const [g7] = pair(Gp, true);
    s += pg.panel('g', Gp, g7, { desc: 'Chloe watches Luke towel off. His mouth is moving. There is no balloon.' });
    pg.desc('(silence)');
    const [g8, o8] = pair(H, false);
    s += pg.panel('h', H, g8, { desc: 'His mouth is closed and still. Then the balloon arrives.', guided: [{ move: 'cut', lock: 1800 }] });
    s += pg.say({ p: 'h', x: H[0] + 270, y: H[1] + 70, text: '…I’m fine. Stop looking at me.', who: 'LUKE', tail: [o8.head[0] + 6, o8.head[1] - 74], w: 240 }).replace('class="bl ', 'class="pA-late ');
    return s;
  },
  mount(ctx) {
    const late = ctx.q('.pA-late');
    // the balloon pops in ~1.8 s after his mouth stops
    ctx.onPanel('h', () => ctx.after(1800, () => late && late.classList.add('on')), 4200);
    ctx.onPanel('b', () => ctx.sfx('thump', { v: 0.4 }), 1200);
  },
});

/* ---------- Page 12 — Ahead ---------- */

// Code Rot crawling under the skin: vein lines and tiny letters, clipped to a patch of skin.
function pA_rotSkin(x, y, w, h, seed) {
  const r = rng(seed), cid = uid('rs');
  let veins = '', glyphs = '';
  for (let i = 0; i < 5; i++) {
    let px = x + r() * w, py = y + h, d = `M${n(px)} ${n(py)}`;
    for (let k = 0; k < 4; k++) { px += r.jit(w * 0.25); py -= h * (0.2 + r() * 0.2); d += `L${n(px)} ${n(py)}`; }
    veins += `<path d="${d}" fill="none" stroke="${C.rot2}" stroke-width="${n(Math.max(1, w * 0.02))}" opacity=".75"/>`;
  }
  const fs = Math.max(5, h * 0.2);
  for (let row = 0; row < 8; row++) {
    let line = '';
    for (let k = 0; k < Math.ceil(w / (fs * 0.55)); k++) line += r() < 0.55 ? r.pick(ROT_GLYPHS + 'abcdefghijklmnopqrstuvwxyz') : ' ';
    glyphs += `<text class="ft-m" x="${n(x)}" y="${n(y + row * fs * 0.9)}" font-size="${n(fs)}" fill="${row % 2 ? C.rot2 : C.rot}" opacity=".95">${esc(line)}</text>`;
  }
  return `<clipPath id="${cid}"><rect x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${n(h)}" rx="${n(w * 0.2)}"/></clipPath><g clip-path="url(#${cid})" pointer-events="none">${veins}<g class="pA-crawl" style="--ch:${n(-fs * 3.6)}px">${glyphs}</g></g>`;
}

// The Luke who came back down: right in every line, but a frame out of step — a cold ghost of him trails a few
// units behind (the same dropped-frame double the later pages use).
function pA_fakeLuke(o) {
  const out = o.out || {};
  const base = Object.assign({ light: 'side', so: 0.6, props: [] }, o, { out });
  const main = fig('luke', base);
  const ghost = fig('luke', Object.assign({}, base, { out: undefined }));
  const s = `<g class="rimS fx-jitter" opacity=".3"><g transform="translate(${o.gdx == null ? 8 : o.gdx} -3)">${ghost}</g></g>` + main;
  if (o.out) Object.assign(o.out, out);
  return s;
}

page(12, {
  title: 'Ahead', side: 'left', gutter: 'greyblack', bleed: 'black', status: 'sos',
  alt: 'Luke tells Zee not to open JARVIS before she has said anything — then his mouth silently shapes the words after she says them. Chloe looks up through the skylight: the real Luke is still on the roof, perfectly still in the storm, phone to his ear, exactly where he was at 12:30. When she lowers her eyes, the Luke inside the store is right behind her. Tiny letters crawl under the skin above his collar.',
  sound: { hum: true, rain: true },
  render(pg) {
    const A = [40, 40, 920, 300], B = [40, 358, 450, 300], Cc = [508, 358, 452, 300], D = [40, 676, 920, 440], Eb = [40, 1134, 920, 326];
    let s = pA_style(`
      .pA-talk{animation:pA-talk .3s steps(1,end) infinite;transform-box:fill-box;transform-origin:center}
      @keyframes pA-talk{0%{transform:scaleY(1)}50%{transform:scaleY(.2)}}
      .pA-crawl{animation:pA-crawl 7s linear infinite}
      @keyframes pA-crawl{from{transform:translateY(0)}to{transform:translateY(var(--ch,-20px))}}
      .pA-turnA{transition:opacity 8s ease-in-out}
      .pA-turnB{opacity:0;transition:opacity 8s ease-in-out}
      .pA-turned .pA-turnA{opacity:0}
      .pA-turned .pA-turnB{opacity:1}
      .rm .pA-talk,.rm .pA-crawl{animation:none!important}
      .rm .pA-turnA,.rm .pA-turnB{transition:none}`);
    // the store lights stutter: an animated dark veil (the group holds the strength, the animation the rhythm)
    const flick = (P, op = 0.3) => `<g opacity="${op}" pointer-events="none">${R(P[0], P[1], P[2], P[3], C.ink, 'class="fx-flicker2"')}</g>`;

    // 1: across the shop floor, Luke answers before Zee has said a word
    let a = storeInterior(A, { vx: 0.33, vy: 0.4, bw: 0.3, bh: 0.62, night: 0.55, lights: [0, 1, 0, 0, 1, 0], flicker2: 4, left: 'acc', right: 'display', seed: 'p12' });
    // the back-office door, in the foreground on the right
    a += R(A[0] + 770, A[1] - 10, 150, 330, '#2E2A26', st(C.ink, 5)) + R(A[0] + 790, A[1] + 30, 106, 70, '#0B0E12', st(C.ink, 2.5)) + Ci(A[0] + 790, A[1] + 176, 7, '#9AA0A6', st(C.ink, 2));
    a += R(A[0] + 800, A[1] + 120, 86, 24, '#C9C4B8', st(C.ink, 1.5)) + Tx(A[0] + 843, A[1] + 137, 'STAFF ONLY', 13, C.ink, 'text-anchor="middle"', FONTS.ui);
    a += ollie({ x: A[0] + 48, y: A[1] + 292, s: 0.36, dark: true, turn: 1 });
    const oL = {}, oZ = {};
    a += pA_fakeLuke({ x: A[0] + 330, y: A[1] + 252, s: 0.56, face: ['blank', 'flat', 'line'], props: ['headtorch'], out: oL, gdx: 6 });
    a += fig('zee', { x: A[0] + 660, y: A[1] + 490, s: 1.05, flip: true, pose: 'holdOne', face: ['dot', 'raised', 'flat'], look: [-1, 0], out: oZ, light: 'side', so: 0.55 });
    a += flick(A, 0.25);
    s += pg.panel('a', A, a, { desc: 'Zee by the back-office door. Before she has said a word, Luke speaks from across the room.', guided: [{ focus: [40, 40, 540, 300] }] });
    s += pg.say({ p: 'a', x: 190, y: 96, text: 'Zee. Don’t open JARVIS.', who: 'LUKE', tail: [oL.head[0] - 6, oL.head[1] - 22], w: 230 });
    pg.stop('a2', [420, 40, 540, 300]);
    s += pg.say({ p: 'a2', x: 600, y: 96, text: '…I didn’t say anything.', who: 'ZEE', tail: [oZ.head[0] - 6, oZ.head[1] - 34], w: 200, size: 27 });

    // 2: over Zee's shoulder — she says it, and only now does his mouth move. No sound comes out.
    let b = R(B[0], B[1], B[2], B[3], '#1A2129') + R(B[0], B[1], B[2], B[3], 'url(#htN)', 'opacity=".3"');
    b += R(B[0] + 210, B[1] + 10, 230, 150, '#121920', st(C.ink, 3)) + rainFx([B[0] + 210, B[1] + 10, 230, 150], { op: 0.45 });
    const oL2 = {};
    b += pA_fakeLuke({ x: B[0] + 330, y: B[1] + 810, s: 1.95, view: 'front', face: ['blank', 'flat', 'line'], out: oL2, props: ['headtorch'], gdx: 9, light: 'side', so: 0.65 });
    const mk = oL2.scale;
    b += `<g class="pA-talk">${E(oL2.mouth[0], oL2.mouth[1] + 1.5 * mk, 6 * mk, 4.4 * mk, C.ink)}${E(oL2.mouth[0], oL2.mouth[1] + 3.4 * mk, 3.2 * mk, 1.6 * mk, '#6E2A2A')}</g>`;
    const oZ2 = {};
    b += fig('zee', { x: B[0] + 80, y: B[1] + 640, s: 1.6, face: ['dot', 'flat', 'talk'], out: oZ2, pose: 'holdOne', light: 'side', so: 0.65 });
    b += R(B[0], B[1], B[2], B[3], 'url(#gVig)', 'opacity=".55"') + flick(B);
    s += pg.panel('b', B, b, { desc: 'Zee says it. And now, across the room, Luke’s mouth moves — silently shaping the words he already said.' });
    s += pg.say({ p: 'b', x: B[0] + 130, y: B[1] + 58, text: 'I’m going to check JARVIS.', who: 'ZEE', tail: [oZ2.mouth[0] + 10, oZ2.mouth[1] - 26], w: 210, size: 27 });

    // 3: Chloe steps back, sick, and looks up
    let c = R(Cc[0], Cc[1], Cc[2], Cc[3], '#161C23');
    c += Po([[Cc[0] + 110, Cc[1]], [Cc[0] + 370, Cc[1]], [Cc[0] + 336, Cc[1] + 46], [Cc[0] + 144, Cc[1] + 46]], '#0B1016', st('#2E353E', 5)) + rainFx([Cc[0] + 110, Cc[1], 260, 46], { op: 0.6 });
    c += glow(Cc[0] + 240, Cc[1] + 20, 200, 90, 'gS', 0.2);
    const oC = {};
    c += fig('chloe', { x: Cc[0] + 200, y: Cc[1] + 740, s: 2.0, face: ['wide', 'worried', 'frown'], look: [0.6, -1.4], tilt: -16, lean: -7, out: oC, pose: 'mouth', light: 'top', so: 0.6 });
    c += R(Cc[0], Cc[1], Cc[2], Cc[3], 'url(#gVig)', 'opacity=".5"') + flick(Cc);
    s += pg.panel('c', Cc, c, { desc: 'Chloe steps back, sick, and looks up.' });

    // 4: through the skylight — the real Luke, still on the roof, perfectly still in the storm
    let d = stormSky(D, { seed: 'p12sky', clouds: 18 });
    d += E(D[0] + 470, D[1] + 300, 520, 150, '#3A4A5E', 'opacity=".35"');
    d += lightningFx(D, { bx: D[0] + 780, by: D[1] + 300, seed: 'p12b' });
    // he does not move. He is the only thing on the page that doesn't.
    const oR = {};
    const roofLuke = { x: D[0] + 470, y: D[1] + 640, s: 1.42, pose: 'phone', tilt: 14, face: ['blank', 'flat', 'open'], props: ['phoneEar', 'headtorch', 'cable'], screen: '#CFF2FF', light: 'top', so: 0.5 };
    d += `<g class="rimS" opacity=".55" transform="translate(-4 -3)">${fig('luke', Object.assign({}, roofLuke))}</g>`;
    d += fig('luke', Object.assign({ out: oR }, roofLuke));
    d += R(D[0], D[1], D[2], D[3], '#9FC3E0', 'opacity=".08"');
    const rr = rng('p12spl');
    let spl = '';
    // rain bouncing off his head and shoulders
    for (let i = 0; i < 18; i++) {
      const top = i < 8, sx = oR.head[0] + (top ? rr.jit(34) : rr.jit(70)), sy = oR.head[1] + (top ? -38 * oR.scale / 1.46 : 70) + rr.jit(5);
      spl += Ci(sx + rr.jit(10), sy - 8 - rr() * 14, 1.8 + rr() * 1.6, '#DCE8F2', 'opacity=".8"') + Ln(sx, sy, sx + rr.jit(7), sy - 6 - rr() * 8, '#DCE8F2', 1.6, 'opacity=".7"');
    }
    d += spl;
    d += rainFx(D, { op: 0.95, op2: 0.75 });
    // the skylight: a deep shaft of ceiling around it, the glass and its frame in front of him
    const g0 = [D[0] + 70, D[1] + 40, D[2] - 140, D[3] - 80];
    d += glassDrops(g0, 'p12g', 46);
    d += Po([[D[0], D[1]], [D[0] + D[2], D[1]], [g0[0] + g0[2], g0[1]], [g0[0], g0[1]]], '#151A20') + Po([[D[0], D[1] + D[3]], [D[0] + D[2], D[1] + D[3]], [g0[0] + g0[2], g0[1] + g0[3]], [g0[0], g0[1] + g0[3]]], '#0B0E12');
    d += Po([[D[0], D[1]], [g0[0], g0[1]], [g0[0], g0[1] + g0[3]], [D[0], D[1] + D[3]]], '#10141A') + Po([[D[0] + D[2], D[1]], [g0[0] + g0[2], g0[1]], [g0[0] + g0[2], g0[1] + g0[3]], [D[0] + D[2], D[1] + D[3]]], '#10141A');
    d += R(g0[0], g0[1], g0[2], g0[3], 'none', st('#39424D', 7)) + Ln(g0[0] + g0[2] * 0.2, g0[1], g0[0] + g0[2] * 0.2, g0[1] + g0[3], '#39424D', 6) + Ln(g0[0] + g0[2] * 0.8, g0[1], g0[0] + g0[2] * 0.8, g0[1] + g0[3], '#39424D', 6);
    s += pg.panel('d', D, d, { desc: 'Through the skylight: the real Luke is still on the roof. Standing perfectly still in the storm, phone pressed to his ear, head tilted, mouth open, rain bouncing off him. Exactly where he was at 12:30.', guided: [{ focus: [210, 676, 580, 440], move: 'cut' }] });

    // 5: she lowers her eyes. He's right behind her, leaning in.
    let e = R(Eb[0], Eb[1], Eb[2], Eb[3], '#0C1015') + rainFx(Eb, { dark: true, op: 0.5, op2: 0.3 });
    e += glow(Eb[0] + 120, Eb[1] + 120, 300, 260, 'gS', 0.12);
    // a slab of black behind them: the stockroom doorway
    e += Po([[Eb[0] + 700, Eb[1]], [Eb[0] + 920, Eb[1]], [Eb[0] + 920, Eb[1] + 326], [Eb[0] + 760, Eb[1] + 326]], '#050608');
    const oA = {}, oA1 = {}, oB = {};
    const lk = { x: Eb[0] + 390, y: Eb[1] + 1050, s: 2.9, lean: 14, look: [1, 0.5], gdx: 10, light: 'side', so: 0.75 };
    const sideNeutral = pA_fakeLuke(Object.assign({ face: ['blank', 'flat', 'line'], out: oA }, lk));
    const sideSmile = pA_fakeLuke(Object.assign({ face: ['blank', 'flat', 'smile'], out: oA1 }, lk));
    const k = oA.scale;
    // Code Rot just above his collar, crawling under the skin like veins
    const neckA = pA_rotSkin(oA.head[0] - 20 * k, oA.head[1] + 14 * k, 40 * k, 34 * k, 'p12nA');
    const front = pA_fakeLuke({ x: oA.head[0], y: oA.head[1] + 318 * k, s: lk.s, view: 'front', face: ['blank', 'flat', 'smile'], out: oB, gdx: 10, light: 'side', so: 0.7 });
    const pupils = `<g class="pA-pupils">${Ci(oB.head[0] - 9 * k, oB.head[1], 2.4 * k, C.ink)}${Ci(oB.head[0] + 9 * k, oB.head[1], 2.4 * k, C.ink)}</g>`;
    const neckB = pA_rotSkin(oB.head[0] - 16 * k, oB.head[1] + 16 * k, 32 * k, 32 * k, 'p12nB');
    e += `<g class="pA-turnA">${swap(sideNeutral, sideSmile, 'pA-smile')}${neckA}</g>`;
    e += `<g class="pA-turnB">${front}${pupils}${neckB}</g>`;
    const oCh = {};
    e += fig('chloe', { x: Eb[0] + 655, y: Eb[1] + 1060, s: 3.0, view: 'front', face: ['wide', 'worried', 'frown'], look: [-1.5, 0.7], out: oCh, light: 'side', so: 0.6 });
    e += R(Eb[0], Eb[1], Eb[2], Eb[3], 'url(#gVig)', 'opacity=".6"') + flick(Eb, 0.25);
    s += pg.panel('e', Eb, e, { desc: 'Chloe slowly lowers her eyes to the Luke inside the store. He is right behind her. As he leans in, just above his collar, tiny letters crawl under the skin like veins. Code Rot, wearing Luke.', guided: [{ focus: [40, 1134, 600, 326] }, { focus: [400, 1134, 560, 326], move: 'creep' }] });
    s += pg.say({ p: 'e', x: Eb[0] + 170, y: Eb[1] + 78, text: 'I’m right here, Chloe.', who: 'LUKE', tail: [oA.head[0] - 34 * k, oA.head[1] - 22 * k], w: 210 });
    return s;
  },
  mount(ctx) {
    const panelE = ctx.q('.pn[data-panel="e"]');
    // the balloon arrives before his smile does
    ctx.onPanel('e', () => ctx.after(1600, () => { const sw = ctx.q('.pA-smile'); if (sw) sw.classList.add('on'); }), 2600);
    // linger, and his head turns, very slowly, until he faces you
    ctx.dwell(9000, () => { if (panelE) panelE.classList.add('pA-turned'); });
    // ...and his eyes follow you
    const pupils = ctx.q('.pA-pupils');
    ctx.onPointer((nx, ny) => {
      if (!pupils) return;
      const k = 5;
      pupils.setAttribute('transform', `translate(${n(clamp(nx, -1, 1) * k)} ${n(clamp(ny, -1, 1) * k * 0.7)})`);
    });
    ctx.onPanel('c', () => ctx.sfx('heartbeat'), 2000);
  },
});

