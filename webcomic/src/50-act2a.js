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

// Stream overlay strip: red LIVE pill, watching count, the title.
function pA_streamBar(x, y, w, o = {}) {
  const h = o.h || 34, k = h / 34;
  let g = R(x, y, w, h, 'rgba(8,8,10,.72)', `rx="${4 * k}"`);
  g += R(x + 6 * k, y + 6 * k, 58 * k, 22 * k, '#E0262F', `rx="${4 * k}"`) + Ci(x + 16 * k, y + 17 * k, 4 * k, '#FFFFFF', 'class="fx-blink"');
  g += Tx(x + 24 * k, y + 23 * k, 'LIVE', 15 * k, '#FFFFFF', '', FONTS.ui);
  if (o.count) g += Tx(x + 72 * k, y + 23 * k, `◉ ${o.count}`, 15 * k, '#FFFFFF', `class="${o.countCls || ''}"`, FONTS.ui);
  if (o.title !== false) g += Tx(x + (o.count ? 150 : 74) * k, y + 23 * k, o.title || 'NIGHTMARE ON 63RD STREET (NOT CLICKBAIT)', 14 * k, '#FFFFFF', 'letter-spacing="0.5"', FONTS.ui);
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

// Customers pressed right up against the glass: hands flat, faces smeared.
function pA_atGlass(box, o = {}) {
  const [x, y, w, h] = box;
  let s = '';
  const N = o.count || 4;
  for (let i = 0; i < N; i++) {
    const cx = x + w * (0.14 + (i / Math.max(1, N - 1)) * 0.72), sc = h / (o.k || 260);
    s += customer({ x: cx, y: y + h * 1.25, s: sc, kind: CUSTOMER_ORDER[(i + 1) % 8], seed: `pAg${i}`, ticket: true, faceOp: 0.95 });
    // palms pressed flat against the glass
    s += `<g opacity=".9">${E(cx - 40 * sc, y + h * 0.42, 15 * sc, 19 * sc, '#C8B4A2', st(C.ink, 2))}${E(cx + 42 * sc, y + h * 0.4, 15 * sc, 19 * sc, '#C8B4A2', st(C.ink, 2))}</g>`;
  }
  // fog on the glass where they breathe
  for (let i = 0; i < N; i++) s += E(x + w * (0.14 + (i / Math.max(1, N - 1)) * 0.72), y + h * 0.3, w * 0.06, h * 0.06, '#DCE6EE', 'opacity=".18"');
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
    // 1: Chase reaches for a ringing demo phone
    let a = R(A[0], A[1], A[2], A[3], '#1A2129') + R(A[0], A[1] + 330, A[2], 100, '#141A20');
    a += displayWall([A[0] + 268, A[1] + 26, 300, 300], { cols: 4, rows: 3, lit: true, ring: true, wall: '#39424E' });
    a += glow(A[0] + 420, A[1] + 180, 260, 200, 'gS', 0.25);
    const oL = {}, oC = {};
    a += fig('luka', { x: A[0] + 86, y: A[1] + 600, s: 0.95, pose: 'hand', face: 'worried', out: oL, light: 'front', so: 0.55, props: ['lanyard'] });
    a += fig('chase', { x: A[0] + 236, y: A[1] + 486, s: 1.0, pose: 'reach', face: 'smirk', out: oC, light: 'front', so: 0.5, arms: { na: [96, 110], fa: [20, 40] } });
    a += R(A[0], A[1], A[2], A[3], 'url(#gVig)', 'opacity=".6"');
    s += pg.panel('a', A, a, { desc: 'Chase reaches for one of the ringing demo phones on the wall. Luka, behind him, puts a hand out.' });
    s += pg.say({ p: 'a', x: 110, y: 96, text: 'Don’t.', who: 'LUKA', tail: [oL.head[0] + 6, oL.head[1] - 34], w: 90 });
    s += pg.say({ p: 'a', x: 330, y: 92, text: 'They’re demo units. There’s no SIMs in them.', who: 'CHASE', tail: [oC.head[0] + 10, oC.head[1] - 36], w: 220, size: 26 });
    s += pg.say({ p: 'a', x: 132, y: 212, text: 'Then why are they ringing?', who: 'LUKA', tail: [oL.head[0] + 14, oL.head[1] - 34], w: 160, size: 26 });
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
    s += pg.panel('c', Cc, c, { desc: 'A thin panel: only the phone’s speaker grille, music notes curling out.' });
    s += pg.say({ p: 'c', type: 'elec', x: 190, y: 552, text: 'Thank you for holding.', who: 'PHONE', tail: [370, 552], w: 260, size: 27 });

    // 4: everyone leaning in, lit from below
    let d = R(D[0], D[1], D[2], D[3], '#0B0E13') + R(D[0], D[1], D[2], D[3], 'url(#htN)', 'opacity=".35"');
    d += glow(D[0] + 470, D[1] + 300, 420, 260, 'gS', 0.32);
    d += ollie({ x: D[0] + 880, y: D[1] + 330, s: 0.42, dark: true, turn: -1 });
    const lean = [['luka', 140, false, 12, 'scared'], ['zee', 300, false, 8, 'worried'], ['luke', 660, true, 10, 'worried'], ['zane', 800, true, 8, 'shock']];
    const hd = {};
    lean.forEach(([w, x, fl, ln, face]) => { const o = {}; d += fig(w, { x: D[0] + x, y: D[1] + 740, s: 1.38, flip: fl, lean: ln, face, light: 'under', so: 0.55, pose: w === 'zane' ? 'film' : 'stand', out: o, props: w === 'zane' ? ['gimbal'] : w === 'luke' ? ['headtorch'] : undefined }); hd[w] = o.head; });
    const oD = {};
    d += fig('chase', { x: D[0] + 480, y: D[1] + 750, s: 1.4, view: 'front', pose: 'holdOne', face: 'scared', light: 'under', so: 0.6, props: ['headphones', 'phoneHand'], screen: '#DFF6FF', out: oD });
    d += glow(oD.nh[0], oD.nh[1] - 20, 90, 70, 'gS', 0.6);
    s += pg.panel('d', D, d, { desc: 'Everyone leans in toward the phone in Chase’s hand, faces lit from below.' });
    s += pg.say({ p: 'd', type: 'entity', x: 500, y: 720, text: 'Your call is important to us. You are caller number seven.', who: 'THE HOLD', w: 560 });
    s += pg.say({ p: 'd', x: 700, y: 840, text: '…There’s six of us.', who: 'CHASE', tail: [oD.head[0] + 20, oD.head[1] - 30], w: 150, size: 26 });
    s += pg.say({ p: 'd', type: 'tiny', x: 880, y: 1010, text: 'Seven.', who: 'CHLOE (off-panel)', tail: [972, 1040], w: 80 });

    // 5: close on Chase, colour draining out of him
    let e = R(Eb[0], Eb[1], Eb[2], Eb[3], '#151A20') + R(Eb[0], Eb[1], Eb[2], Eb[3], 'url(#ht2)', 'opacity=".18"');
    const oE = {};
    const chaseE = fig('chase', { x: Eb[0] + 690, y: Eb[1] + 1100, s: 3.0, face: 'shock', flip: true, out: oE, light: 'side', so: 0.5, props: ['headphones', 'phoneHand'], pose: 'holdOne', screen: '#DFF6FF' });
    e += chaseE + `<g class="pA-drain" filter="url(#fGrey)">${chaseE}</g>`;
    e += R(Eb[0], Eb[1], Eb[2], Eb[3], 'url(#gVig)', 'opacity=".5"');
    s += pg.panel('e', Eb, e, { desc: 'Close on Chase. The colour drains out of him.' });
    s += pg.say({ p: 'e', x: 220, y: 1146, text: 'Luka. This hold music.', who: 'CHASE', tail: [oE.head[0] - 40, oE.head[1] - 10], w: 220 });
    s += pg.say({ p: 'e', x: 300, y: 1262, text: 'It’s mine. It’s a Pudding track.', who: 'CHASE', tail: [oE.head[0] - 50, oE.head[1] + 10], w: 240 });
    s += pg.say({ p: 'e', x: 280, y: 1392, text: 'I never put this one out. It’s only ever been on my laptop.', who: 'CHASE', tail: [oE.head[0] - 60, oE.head[1] + 30], w: 330, size: 27 });

    // the music breaks out of its panel: notes drift across the gutters and off the page
    s += notesFx(500, 550, { count: 6, dx: -380, dy: -420, col: C.y, stroke: C.ink, seed: 'p6x1', size: 40 });
    s += notesFx(560, 560, { count: 5, dx: 300, dy: -380, col: C.y, stroke: C.ink, seed: 'p6x2', size: 38 });
    s += notesFx(470, 600, { count: 6, dx: 520, dy: 320, col: C.y, stroke: C.ink, seed: 'p6x3', size: 36 });
    s += notesFx(520, 600, { count: 4, dx: -560, dy: 240, col: C.y, stroke: C.ink, seed: 'p6x4', size: 34 });
    // notes that gather round the reader's finger while they hold the panel (with sound off)
    let gth = '';
    for (let i = 0; i < 8; i++) { const a2 = (i / 8) * Math.PI * 2; gth += `<text class="ft-s" x="${n(Math.cos(a2) * 46)}" y="${n(Math.sin(a2) * 46 + 10)}" font-size="34" fill="${C.y}" stroke="${C.ink}" stroke-width="3" paint-order="stroke" text-anchor="middle">${i % 2 ? '♪' : '♫'}</text>`; }
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
    const origCleanup = ctx._cleanup;
    ctx._cleanup = () => { off(); origCleanup(); };
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
    s += pg.panel('a', A, a, { desc: 'Zane films the empty walkway through the front glass. Across it, Cafe 63 is lit up. His stream title: NIGHTMARE ON 63RD STREET (NOT CLICKBAIT).' });
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
    // Zane's shoulder and hand in the foreground
    b += Pa(`M${B[0]} ${B[1] + 420}C${B[0] + 40} ${B[1] + 250} ${B[0] + 160} ${B[1] + 200} ${B[0] + 260} ${B[1] + 230}L${B[0] + 330} ${B[1] + 420}Z`, C.navy, st(C.ink, 5));
    // the back of his head: hair, and the cap on backwards with its brim toward us
    b += E(B[0] + 90, B[1] + 230, 120, 120, '#6A4728', st(C.ink, 5)) + Pa(`M${B[0] - 30} ${B[1] + 220}C${B[0] - 30} ${B[1] + 80} ${B[0] + 210} ${B[1] + 80} ${B[0] + 210} ${B[1] + 220}Z`, '#1D1F24', st(C.ink, 5)) + Pa(`M${B[0] + 10} ${B[1] + 214}C${B[0] + 40} ${B[1] + 290} ${B[0] + 160} ${B[1] + 290} ${B[0] + 190} ${B[1] + 214}Z`, '#1D1F24', st(C.ink, 5)) + R(B[0] + 80, B[1] + 160, 22, 14, C.y, st(C.ink, 2));
    b += Pa(`M${ph[0] - 40} ${ph[1] + ph[3] + 10}c-30 -40 -20 -110 20 -120l40 40l-10 90Z`, '#E6B996', st(C.ink, 4));
    s += pg.panel('b', B, b, { desc: 'Over his shoulder, his phone screen: the walkway is full — a single-file line of people facing the store, each holding a small paper ticket, faces frozen and smeared like a dropped video call. Behind them, every table in Cafe 63 is taken, everyone seated perfectly still, all turned toward the store.' });

    // 3: lens down — empty. Cups steaming on every table. Wet footprints.
    const g3 = [Cc[0], Cc[1], Cc[2], Cc[3]];
    const emptyView = pA_walkway(g3, { cafe: { lights: 4, cups: true }, prints: true, seed: 'p7c' });
    const glassView = pA_walkway(g3, { cafe: { lights: 4, cups: true }, prints: true, seed: 'p7c' }) + pA_atGlass([Cc[0] + 10, Cc[1] + 20, Cc[2] - 20, Cc[3] - 20], { count: 4, k: 230 });
    const insideView = R(Cc[0], Cc[1], Cc[2], Cc[3], '#1B222A') + pA_walkway([Cc[0] + 40, Cc[1] + 10, Cc[2] - 80, Cc[3] * 0.62], { cafe: { lights: 4, cups: true }, seed: 'p7c' }) +
      R(Cc[0], Cc[1] + Cc[3] * 0.62, Cc[2], Cc[3] * 0.4, '#2A323C') + floorGrid([Cc[0], Cc[1] + Cc[3] * 0.62, Cc[2], Cc[3] * 0.4], Cc[0] + Cc[2] / 2, Cc[1] + Cc[3] * 0.4, { col: '#2A323C', lineCol: '#36414C', rows: 5 }) +
      queueLine({ x0: Cc[0] + 300, y0: Cc[1] + 420, s0: 0.62, x1: Cc[0] + 210, y1: Cc[1] + 220, s1: 0.2, count: 6, seed: 'p7in', ease: 1.3 });
    let c = inside ? insideView : swap(emptyView, glassView, 'pA-p7c');
    c += pA_glassFrame(inside ? [Cc[0] + 40, Cc[1] + 10, Cc[2] - 80, Cc[3] * 0.62] : g3, { seed: 'p7cg', mullions: [0.5] });
    s += pg.panel('c', Cc, c, { desc: inside ? 'He lowers the phone. The line is already inside the doors.' : 'He lowers the phone. The walkway is empty. Cafe 63 is empty. But every one of its tables now has a cup on it, steaming. Wet footprints on the tiles outside the glass.' });

    // 4: raises it again — the front of the line is at the glass
    let d = R(D[0], D[1], D[2], D[3], '#11161C');
    const p4 = [D[0] + 150, D[1] + 30, 270, 250];
    d += R(p4[0] - 12, p4[1] - 12, p4[2] + 24, p4[3] + 24, '#141518', `rx="20" ${st(C.ink, 4)}`);
    const cid2 = uid('ph');
    d += `<clipPath id="${cid2}"><rect x="${p4[0]}" y="${p4[1]}" width="${p4[2]}" height="${p4[3]}" rx="8"/></clipPath><g clip-path="url(#${cid2})">${R(p4[0], p4[1], p4[2], p4[3], '#1B232C')}${pA_atGlass([p4[0] - 30, p4[1] - 10, p4[2] + 60, p4[3]], { count: 3, k: 150 })}${pA_glassFrame(p4, { seed: 'p7d', mullions: [] })}${pA_streamBar(p4[0] + 8, p4[1] + 8, 160, { h: 22, title: false, count: 7 })}</g>`;
    d += Pa(`M${p4[0] + 40} ${D[1] + 300}c-10 -40 0 -70 30 -80l50 10l10 70Z`, '#E6B996', st(C.ink, 4));
    const oZ2 = {};
    d += fig('zane', { x: D[0] + 70, y: D[1] + 560, s: 1.15, face: 'laugh', out: oZ2, props: [], light: 'side', so: 0.5 });
    s += pg.panel('d', D, d, { desc: 'He raises the phone again. On screen, the front of the line is at the glass now.' });
    s += pg.say({ p: 'd', x: D[0] + 120, y: D[1] + 52, text: 'Okay, that’s a sick filter. What filter is that?', who: 'ZANE', tail: [oZ2.head[0] + 6, oZ2.head[1] - 30], w: 200, size: 23, r: -3 });
    s += pg.say({ p: 'd', x: D[0] + 350, y: D[1] + 250, text: 'There’s no network. How are you live?', who: 'LUKE (off-panel)', tail: [D[0] + 460, D[1] + 290], w: 180, size: 23 });

    // 5: insert — the stream overlay
    let e = R(Eb[0], Eb[1], Eb[2], Eb[3], '#0B0D10') + R(Eb[0], Eb[1], Eb[2], Eb[3], 'url(#scan)', 'opacity=".25"');
    e += R(Eb[0] + 30, Eb[1] + 80, 150, 70, '#E0262F', 'rx="10"') + Ci(Eb[0] + 62, Eb[1] + 115, 11, '#FFFFFF', 'class="fx-blink"') + Tx(Eb[0] + 82, Eb[1] + 132, 'LIVE', 46, '#FFFFFF', '', FONTS.ui);
    e += Tx(Eb[0] + 200, Eb[1] + 132, '· 7', 64, '#FFFFFF', '', FONTS.ui) + Tx(Eb[0] + 40, Eb[1] + 212, 'watching', 42, '#C9CED4', '', FONTS.ui);
    s += pg.panel('e', Eb, e, { desc: 'Insert, the stream overlay: LIVE · 7 watching.' });
    pg.lines.push({ who: 'STREAM', text: 'LIVE · 7 watching' });

    // 6: hook — the queue kiosk switches itself on
    let f = R(F[0], F[1], F[2], F[3], '#0E1217');
    f += R(F[0] + 300, F[1] + 20, 210, 250, '#18202A', st(C.ink, 3)) + rainFx([F[0] + 300, F[1] + 20, 210, 250], { op: 0.5 }) + pA_glassFrame([F[0] + 300, F[1] + 20, 210, 250], { seed: 'p7f', mullions: [0.5] });
    f += `<g class="pA-kon">${glow(F[0] + 170, F[1] + 120, 200, 160, 'gS', 0.5)}</g>`;
    f += kiosk(F[0] + 170, F[1] + 300, {
      s: 0.92, lit: false,
      screen: (sx, sy, sw, sh) => `<g class="pA-kon">${R(sx, sy, sw, sh, '#DDF3FB')}${textLines(['WELCOME!', 'PLEASE TAKE', 'A TICKET.'], sx + sw / 2, sy + sh / 2, 12.5, '#0E1A22', { font: FONTS.ui })}</g>`,
    });
    f += R(F[0], F[1], F[2], F[3], 'url(#gVig)', 'opacity=".7"');
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
    const A = [40, 40, 560, 440], B = [618, 40, 342, 440], Cc = [40, 498, 920, 300], D = [40, 816, 440, 330], Eb = [498, 816, 462, 330], F = [40, 1164, 920, 296];
    let s = pA_style(`
      .pA-wave{animation:pA-wave 1s ease-in-out infinite;transform-box:view-box}
      @keyframes pA-wave{0%,100%{transform:rotate(-16deg)}50%{transform:rotate(22deg)}}
      .pA-print{animation:pA-print 2.6s steps(8,end) infinite;transform-box:fill-box;transform-origin:50% 0}
      @keyframes pA-print{0%{transform:scaleY(.05)}70%,100%{transform:scaleY(1)}}
      .pA-fall{animation:pA-fall 3.2s ease-in infinite;transform-box:view-box}
      @keyframes pA-fall{0%{transform:translate(0,-14px) rotate(0deg);opacity:.2}12%{opacity:1}100%{transform:translate(var(--fx,20px),46px) rotate(var(--fr,20deg));opacity:1}}
      .pA-strip{animation:pA-strip 1.4s linear infinite;transform-box:view-box}
      @keyframes pA-strip{from{transform:translateY(-40px);opacity:1}to{transform:translateY(90px);opacity:0}}
      .pA-heat{opacity:0;transition:opacity 3.5s ease-in}
      .pA-heat.on{opacity:.62}
      .pA-heat.off{opacity:0;transition:opacity 4s ease-out}
      .rm .pA-wave,.rm .pA-print,.rm .pA-fall,.rm .pA-strip{animation:none!important}`);
    // 1: the kiosk, friendly; Zane tears off number one
    let a = R(A[0], A[1], A[2], A[3], '#2B333D') + R(A[0], A[1] + 360, A[2], 80, '#232A32');
    a += R(A[0] + 330, A[1] + 30, 220, 330, '#18202A', st(C.ink, 3)) + rainFx([A[0] + 330, A[1] + 30, 220, 330], { op: 0.45 }) + pA_glassFrame([A[0] + 330, A[1] + 30, 220, 330], { seed: 'p8a', mullions: [0.5] });
    a += glow(A[0] + 170, A[1] + 140, 200, 160, 'gS', 0.35);
    a += kiosk(A[0] + 170, A[1] + 420, { s: 1.12, screen: pA_kioskScreen(0) });
    const oZ = {};
    a += fig('zane', { x: A[0] + 420, y: A[1] + 560, s: 1.15, flip: true, pose: 'reach', face: 'grin', out: oZ, props: ['gimbal'], arms: { na: [70, 96], fa: [150, 170] }, light: 'side', so: 0.5 });
    a += `<g transform="translate(${n(oZ.nh[0] - 14)} ${n(oZ.nh[1] - 6)}) rotate(-20)">${R(-10, -2, 20, 30, '#F7F4EA', st(C.ink, 1.6))}</g>`;
    s += pg.panel('a', A, a, { desc: 'The kiosk, bright and friendly, a little animated Ollie waving on its screen: Hi! Please take a ticket! Zane, performing for chat, tears off a ticket.' });
    s += pg.say({ p: 'a', x: 430, y: 104, text: 'VIP. Number one, baby.', who: 'ZANE', tail: [oZ.head[0] - 6, oZ.head[1] - 36], w: 170 });

    // 2: ticket 01 — ZANE
    let b = R(B[0], B[1], B[2], B[3], '#1E252E') + R(B[0], B[1], B[2], B[3], 'url(#htN)', 'opacity=".4"');
    b += `<g opacity=".8">${kiosk(B[0] + 290, B[1] + 470, { s: 0.8, screen: pA_kioskScreen(1) })}</g>`;
    b += Pa(`M${B[0] - 10} ${B[1] + 440}C${B[0] + 30} ${B[1] + 330} ${B[0] + 80} ${B[1] + 300} ${B[0] + 120} ${B[1] + 310}L${B[0] + 140} ${B[1] + 440}Z`, C.navy, st(C.ink, 4));
    b += ticketProp(B[0] + 64, B[1] + 90, { num: '01', name: 'ZANE', s: 1.45, r: -6 });
    b += E(B[0] + 106, B[1] + 352, 34, 22, '#E6B996', st(C.ink, 4)) + E(B[0] + 168, B[1] + 345, 30, 20, '#E6B996', st(C.ink, 4));
    s += pg.panel('b', B, b, { desc: 'The ticket, close: 01 — ZANE.' });
    pg.lines.push({ who: 'TICKET', text: '01 — ZANE' });

    // 3: the kiosk keeps printing on its own
    let c = R(Cc[0], Cc[1], Cc[2], Cc[3], '#252C35') + R(Cc[0], Cc[1] + 250, Cc[2], 50, '#1E242B');
    c += glow(Cc[0] + 150, Cc[1] + 110, 180, 140, 'gS', 0.3);
    c += kiosk(Cc[0] + 150, Cc[1] + 380, { s: 0.92, screen: pA_kioskScreen(2) });
    c += `<g class="pA-print">${R(Cc[0] + 132, Cc[1] + 230, 36, 60, '#F7F4EA', st(C.ink, 1.5))}</g>`;
    const falls = [['02', 'LUKE'], ['03', 'ZEE'], ['04', 'CHASE'], ['05', 'LUKA']];
    falls.forEach(([num, nm], i) => {
      const x = Cc[0] + 300 + i * 150, y = Cc[1] + 40 + (i % 2) * 22;
      c += `<g class="pA-fall" style="--fx:${(i % 2 ? -1 : 1) * 22}px;--fr:${(i % 2 ? -1 : 1) * 26}deg;animation-delay:${-i * 0.8}s">${ticketProp(x, y, { num, name: nm, s: 0.95, r: [-14, 9, -6, 16][i] })}</g>`;
      pg.lines.push({ who: 'TICKET', text: `${num} — ${nm}` });
    });
    s += pg.panel('c', Cc, c, { desc: 'The kiosk keeps printing on its own. Tickets spool out and fall: 02 — LUKE. 03 — ZEE. 04 — CHASE. 05 — LUKA.' });
    s += pg.sfx('chk-chk-chk', Cc[0] + 240, Cc[1] + 270, { size: 30, rot: -6, fill: '#FFFFFF', p: 'c' });

    // 4: 06 — CHLOE — PLEASE PROCEED TO COUNTER
    let d = R(D[0], D[1], D[2], D[3], '#1A2028');
    d += `<g opacity=".7">${kiosk(D[0] + 380, D[1] + 400, { s: 0.7, screen: pA_kioskScreen(3) })}</g>`;
    const oC = {};
    d += fig('chloe', { x: D[0] + 110, y: D[1] + 780, s: 1.9, face: 'worried', out: oC, pose: 'holdOne', light: 'side', so: 0.55, look: [1, 1] });
    d += ticketProp(D[0] + 200, D[1] + 50, { num: '06', name: 'CHLOE', lines: ['PLEASE PROCEED', 'TO COUNTER'], s: 1.18, r: 7 });
    d += Pa(`M${D[0] + 250} ${D[1] + 340}C${D[0] + 250} ${D[1] + 290} ${D[0] + 270} ${D[1] + 250} ${D[0] + 300} ${D[1] + 245}C${D[0] + 330} ${D[1] + 250} ${D[0] + 336} ${D[1] + 290} ${D[0] + 330} ${D[1] + 340}Z`, '#6B7076', st(C.ink, 4));
    d += R(D[0] + 282, D[1] + 232, 13, 26, '#EEC7A6', `rx="6" ${st(C.ink, 2.4)}`) + R(D[0] + 298, D[1] + 228, 13, 28, '#EEC7A6', `rx="6" ${st(C.ink, 2.4)}`);
    s += pg.panel('d', D, d, { desc: 'Chloe picks up the next ticket: 06 — CHLOE — PLEASE PROCEED TO COUNTER.' });
    pg.lines.push({ who: 'TICKET', text: '06 — CHLOE — PLEASE PROCEED TO COUNTER' });

    // 5: 07 — blank. Not even plugged in.
    let e = R(Eb[0], Eb[1], Eb[2], Eb[3], '#202731') + R(Eb[0], Eb[1] + 250, Eb[2], 80, '#1A1F26');
    const oZe = {}, oLk = {};
    e += fig('zee', { x: Eb[0] + 70, y: Eb[1] + 560, s: 0.95, face: 'angry', out: oZe, pose: 'holdOne', light: 'side', so: 0.5 });
    e += fig('luke', { x: Eb[0] + 400, y: Eb[1] + 570, s: 0.95, flip: true, face: 'flat', out: oLk, arms: { na: [150, 178] }, props: ['headtorch'], light: 'side', so: 0.5 });
    // the dangling plug
    e += Pa(`M${n(oLk.nh[0])} ${n(oLk.nh[1] + 4)}C${n(oLk.nh[0] + 30)} ${n(oLk.nh[1] + 120)} ${n(oLk.nh[0] + 110)} ${Eb[1] + 250} ${Eb[0] + 470} ${Eb[1] + 300}`, 'none', st('#111', 5));
    e += `<g transform="translate(${n(oLk.nh[0])} ${n(oLk.nh[1] - 20)})">${R(-12, -8, 24, 28, '#E6E3DA', st(C.ink, 2.5))}${Ln(-5, -8, -5, -22, '#B9B4A8', 4)}${Ln(5, -8, 5, -22, '#B9B4A8', 4)}</g>`;
    // ticket 07: blank. Linger, and a name develops on it like heat on thermal paper.
    e += glow(Eb[0] + 230, Eb[1] + 210, 120, 110, 'gW', 0.2);
    e += `<g transform="translate(${Eb[0] + 168} ${Eb[1] + 112}) rotate(-6) scale(1.12)">${ticketProp(0, 0, { num: '07' })}<text class="ft-m pA-heat" x="60" y="134" font-size="${NAME().length > 9 ? 13 : 17}" fill="#8A5A2B" text-anchor="middle">${esc(NAME())}</text></g>`;
    s += pg.panel('e', Eb, e, { desc: 'The last ticket: 07 — blank. Luke holds up the kiosk’s dangling plug.' });
    s += pg.say({ p: 'e', x: Eb[0] + 92, y: Eb[1] + 54, text: 'Who programmed this?', who: 'ZEE', tail: [oZe.head[0] + 4, oZe.head[1] - 34], w: 140, size: 24 });
    s += pg.say({ p: 'e', x: Eb[0] + 330, y: Eb[1] + 46, text: 'Nobody. It’s not even plugged in.', who: 'LUKE', tail: [oLk.head[0] - 20, oLk.head[1] - 24], w: 190, size: 24 });
    pg.lines.push({ who: 'TICKET', text: '07 — (blank)' });

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
    s += pg.panel('f', F, f, { desc: 'Luka gathers every ticket and feeds them into the shredder. Behind him, on the kiosk screen, Ollie is a rotted smear, still jerking his arm.' });
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
    s += pg.panel('a', A, a, { desc: 'The queue TV above the counter wakes. NOW SERVING 01.' });
    s += pg.sfx('BING—', A[0] + 150, A[1] + 120, { size: 74, rot: -10, fill: C.y, p: 'a' });
    s += pg.sfx('BONG.', A[0] + 790, A[1] + 200, { size: 74, rot: 8, fill: C.y, p: 'a', log: false });
    pg.lines.push({ who: 'QUEUE TV', text: 'NOW SERVING 01' });

    // 2: everyone turns to Zane
    let b = R(B[0], B[1], B[2], B[3], '#202832') + R(B[0], B[1] + 290, B[2], 90, '#1A2027');
    b += glow(B[0] + 300, B[1] + 160, 220, 200, 'gY', 0.15);
    const oZ = {};
    b += fig('zane', { x: B[0] + 300, y: B[1] + 470, s: 0.98, view: 'front', pose: 'handsUp', face: 'laugh', out: oZ, light: 'side', so: 0.45 });
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
    s += pg.panel('d', D, d, { desc: 'The lights die. A black panel: only Zane’s phone screen, a white rectangle floating at chest height. Far back in the black, where the glow barely reaches: a white bandit mask with two black eyes. Ollie’s standee. Closer than it should be.', stroke: '#000' });
    s += pg.say({ p: 'd', type: 'dark', x: D[0] + 260, y: D[1] + 120, text: 'Guys? …Guys, why is the screen warm?', who: 'ZANE', tail: [px - 30, py - 20], w: 280 });

    // 5: black. One tiny balloon.
    let e = R(Eb[0], Eb[1], Eb[2], Eb[3], '#000000');
    s += pg.panel('e', Eb, e, { desc: 'Black. One tiny balloon.', stroke: '#000' });
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
      .pA-fog{animation:pA-fog 3.4s ease-in-out infinite;transform-box:fill-box;transform-origin:center}
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
    s += pg.panel('a', A, a, { desc: 'One bank of lights is back on, harsh, everything outside it black. Zane is gone. His phone lies face-up in the middle of the floor, the brightest thing in the room. The others stand in a wide ring around it, keeping their distance, their long shadows all pointing at it — and the cardboard Ollie stands in the ring with them.' });
    s += pg.say({ p: 'a', type: 'whisper', x: A[0] + 150, y: A[1] + 600, text: 'He’s still live.', who: 'CHLOE', tail: [hd.chloe[0] - 20, hd.chloe[1] - 10], w: 160 });

    // bottom: inside the screen
    let b = R(B[0], B[1], B[2], B[3], '#06121B');
    b += glow(B[0] + 460, B[1] + 300, 520, 360, 'gS', 0.18);
    b += `<g opacity=".55">${queueLine({ x0: B[0] + 760, y0: B[1] + 420, s0: 0.4, x1: B[0] + 620, y1: B[1] + 250, s1: 0.12, count: 7, seed: 'p10q', sil: true, ease: 1.3 })}${queueLine({ x0: B[0] + 160, y0: B[1] + 400, s0: 0.36, x1: B[0] + 300, y1: B[1] + 250, s1: 0.12, count: 6, seed: 'p10r', sil: true, offset: 3, ease: 1.3 })}</g>`;
    // Zane, underwater, hair drifting
    const oZ = {};
    const zx = B[0] + 410, zy = B[1] + 250 + 318 * 4.3 * 0.97;
    b += fig('pA_zaneWet', { x: zx, y: zy, s: 4.3, view: 'front', face: ['wide', 'raised', 'scream'], out: oZ, props: [], light: 'under', so: 0.45 });
    const HR = 24 * 4.3 * 0.97, hr = rng('p10hair');
    let hair = '';
    for (let i = 0; i < 22; i++) {
      const a0 = (-158 + i * (136 / 21)) * D2R, bx = oZ.head[0] + Math.cos(a0) * HR * 0.92, by = oZ.head[1] + Math.sin(a0) * HR * 1.08;
      const L = HR * (0.8 + hr() * 0.8), dx = Math.cos(a0) * L * 0.8, dy = -L * (0.7 + hr() * 0.3);
      const wv = HR * 0.18 * (hr() < 0.5 ? 1 : -1);
      const d = `M${n(bx)} ${n(by)}C${n(bx + dx * 0.3 + wv)} ${n(by + dy * 0.3)} ${n(bx + dx * 0.6 - wv)} ${n(by + dy * 0.65)} ${n(bx + dx + wv * 0.6)} ${n(by + dy)}`;
      const sw = HR * (0.035 + hr() * 0.03);
      hair += `<g class="pA-drift" style="animation-delay:${n(-hr() * 4)}s;animation-duration:${n(3.6 + hr() * 2)}s" opacity=".9"><path d="${d}" fill="none" ${st('#2A1C10', sw + 3)}/><path d="${d}" fill="none" ${st('#7A5634', sw)}/></g>`;
    }
    b = b.replace('<g class="fig fig-pA_zaneWet', `<g opacity=".97">${hair}</g><g class="fig fig-pA_zaneWet`);
    // face pressed to the glass: pale flattened nose and cheek, and the fog of his breath
    b += E(oZ.head[0] + 2, oZ.head[1] + 30, 16, 12, '#F3E8E0', 'opacity=".55"') + E(oZ.head[0] - 52, oZ.head[1] + 40, 22, 14, '#F3E8E0', 'opacity=".3"');
    b += `<g class="pA-fog">${E(oZ.mouth[0], oZ.mouth[1] + 14, 150, 84, 'url(#gW)', 'opacity="1"')}</g>`;
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
    const one = rows.map((u, i) => (u === me ? R(cc[0] + 4, cc[1] + 8 + i * LH, cc[2] - 8, LH - 4, C.y, 'rx="4" opacity=".92"') : '') +
      `<text class="ft-u" x="${cc[0] + 12}" y="${cc[1] + 32 + i * LH}" font-size="${u === me ? 21 : 19}" fill="${u === me ? C.ink : '#DDE3E8'}"><tspan font-weight="800">${esc(u)}</tspan><tspan fill="${u === me ? C.ink : '#FFFFFF'}" font-weight="${u === me ? 800 : 400}">: next</tspan></text>`).join('');
    const list = `<g class="fx-scroll" style="--sd:12s;--sh:-${rows.length * LH}px">${one}<g transform="translate(0 ${rows.length * LH})">${one}</g></g>`;
    const ccid = uid('cc');
    b += `<clipPath id="${ccid}"><rect x="${cc[0]}" y="${cc[1]}" width="${cc[2]}" height="${cc[3]}"/></clipPath>${R(cc[0], cc[1], cc[2], cc[3], 'rgba(0,0,0,.4)', 'rx="8"')}<g clip-path="url(#${ccid})">${list}</g>`;
    pg.lines.push({ who: 'COMMENTS', text: `next · next · next · ${me}: next · next…` });
    // glass sheen and the phone bezel
    b += Pa(`M${B[0]} ${B[1] + 120}L${B[0] + 260} ${B[1]}L${B[0] + 330} ${B[1]}L${B[0]} ${B[1] + 170}Z`, '#FFFFFF', 'opacity=".06"');
    b += R(B[0] + 6, B[1] + 6, B[2] - 12, B[3] - 12, 'none', `rx="34" ${st('#111', 14)}`);
    // his palms, flattened against the glass from the inside — fingers breaking over the top of the panel
    const lp = [B[0] + 210, B[1] + 92], rp = [B[0] + 612, B[1] + 82];
    b += pA_smear(lp[0], lp[1], 1.3, 'p10sl') + pA_smear(rp[0], rp[1], 1.3, 'p10sr');
    const gc = uid('p10g');
    const palms = `<g class="pA-press">${pA_palm(lp[0], lp[1], 1.3, -1)}</g><g class="pA-press" style="animation-delay:-1.3s">${pA_palm(rp[0], rp[1], 1.3, 1)}</g>` +
      `<clipPath id="${gc}"><rect x="${B[0]}" y="${B[1]}" width="${B[2]}" height="${B[3]}"/></clipPath><g clip-path="url(#${gc})" pointer-events="none">${R(B[0], B[1], B[2], B[3], C.screen, 'opacity=".07"')}${pA_smear(lp[0], lp[1] - 20, 1.1, 'p10gl')}${pA_smear(rp[0], rp[1] - 20, 1.1, 'p10gr')}${Pa(`M${B[0] + 120} ${B[1]}L${B[0] + 230} ${B[1]}L${B[0] + 40} ${B[1] + 260}L${B[0]} ${B[1] + 220}Z`, '#FFFFFF', 'opacity=".07"')}</g>`;
    s += pg.panel('b', B, b, { desc: 'Big close-up on the screen: Zane is inside it. Face and palms pressed against the glass from the other side, mouth wide, hair drifting like he’s underwater. Behind him, deep darkness, and the queue standing in it. Stream overlay: LIVE · 1.2K watching. The comments column: next, next, next, next.', over: palms });
    pg.lines.push({ who: 'STREAM', text: 'LIVE · 1.2K watching — NIGHTMARE ON 63RD STREET (NOT CLICKBAIT)' });
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
function pA_ogScene(box, depth, third) {
  const [x, y, w, h] = box;
  const k = w / 482;
  let g = R(x, y, w, h, '#151B22');
  // the laptop screen running The OG
  const L = [x + w * 0.17, y + h * 0.05, w * 0.66, h * 0.6];
  g += glow(L[0] + L[2] / 2, L[1] + L[3] / 2, L[2] * 0.8, L[3] * 0.8, 'gS', 0.3);
  g += R(L[0] - 6 * k, L[1] - 6 * k, L[2] + 12 * k, L[3] + 12 * k, '#2A2D33', `rx="${5 * k}"`) + R(L[0], L[1], L[2], L[3], '#F2EFE6');
  g += R(L[0], L[1], L[2], L[3] * 0.12, C.y) + (depth >= 2 ? Tx(L[0] + 8 * k, L[1] + L[3] * 0.09, 'The OG', L[3] * 0.08, C.ink, '', FONTS.ui) : '');
  const cols = 4, rows = 3, tw = (L[2] - 10 * k) / cols, th = (L[3] * 0.86) / rows;
  const titles = ['', '', 'GOD OF WARRANTY', 'OLLIE SWING', 'OLLIE KICK', 'QUEUE BUSTER', 'OLLIE GOLF', 'SIM DROP', 'STOCKY', 'OLLIE DASH', 'DATA DASH', 'OLLIE BALL'];
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
    const idx = j * cols + i;
    if (idx === 1) continue;
    const tx = L[0] + 5 * k + i * tw, ty = L[1] + L[3] * 0.14 + j * th;
    const tb = idx === 0 ? [tx + 2 * k, ty + 2 * k, tw * 2 - 4 * k, th - 4 * k] : [tx + 2 * k, ty + 2 * k, tw - 4 * k, th - 4 * k];
    if (idx === 0) {
      // the tile nobody uploaded — the only one without Ollie — and its thumbnail is this panel
      g += R(tb[0] - 2.5 * k, tb[1] - 2.5 * k, tb[2] + 5 * k, tb[3] + 5 * k, C.laser);
      const tbox = [tb[0] + tb[2] * 0.14, tb[1], tb[2] * 0.72, tb[3] * 0.8];
      g += R(tb[0], tb[1], tb[2], tb[3], '#0B0E12');
      if (depth > 1) g += pA_ogScene(tbox, depth - 1, third);
      else g += R(tbox[0], tbox[1], tbox[2], tbox[3], '#151B22');
      if (third && depth === 3) g += readerFig({ x: tbox[0] + tbox[2] * 0.5, y: tbox[1] + tbox[3] * 1.05, s: tbox[3] / 700, device: 'phone' });
      g += R(tb[0], tb[1] + tb[3] * 0.8, tb[2], tb[3] * 0.2, C.ink) + (depth >= 2 ? Tx(tb[0] + tb[2] / 2, tb[1] + tb[3] * 0.96, 'SOS ONLY — NEW', tb[3] * 0.17, C.y, 'text-anchor="middle"', FONTS.ui) : '');
      continue;
    }
    const hue = ['#3D6FB0', '#4E7A5A', '#7A2E3A', '#2B4E7A', '#8A6A2A', '#5B3C88'][idx % 6];
    g += R(tb[0], tb[1], tb[2], tb[3], hue);
    if (depth >= 2) {
      const os = tb[3] / 420, ox = tb[0] + tb[2] / 2 + (idx % 3 - 1) * tb[2] * 0.2, oy = tb[1] + tb[3] * (0.72 - (idx % 2) * 0.12);
      g += `<g transform="translate(${n(ox)} ${n(oy)}) scale(${n(os)}) rotate(${(idx % 5 - 2) * 14})">${Ci(0, -190, 72, C.y, st(C.ink, 8))}${Pa('M-74 -214 C-50 -236 50 -236 74 -214 C60 -186 30 -176 0 -186 C-30 -176 -60 -186 -74 -214 Z', '#FFFFFF', st(C.ink, 6))}${E(-26, -206, 10, 13, C.ink)}${E(26, -206, 10, 13, C.ink)}${Pa('M-68 -186 L-110 -230 M68 -186 L110 -150 M-18 -120 L-40 -10 M18 -120 L40 -30', 'none', st(C.ink, 10))}</g>`;
      g += R(tb[0], tb[1] + tb[3] * 0.8, tb[2], tb[3] * 0.2, 'rgba(0,0,0,.55)') + Tx(tb[0] + tb[2] / 2, tb[1] + tb[3] * 0.95, titles[idx], tb[3] * 0.13, '#FFFFFF', 'text-anchor="middle"', FONTS.ui);
    }
  }
  // Chase and Chloe from behind, sitting on the counter
  const fs = h / 560;
  g += fig('chase', { x: x + w * 0.27, y: y + h * 1.3, s: fs * 1.15, view: 'back', light: 'none' });
  g += fig('chloe', { x: x + w * 0.73, y: y + h * 1.3, s: fs * 1.15, view: 'back', light: 'none' });
  g += R(x, y + h * 0.9, w, h * 0.1, '#2B2E35');
  return g;
}

page(11, {
  title: 'Roof', side: 'right', gutter: 'grey', bleed: 'storm', status: 'sos',
  alt: 'Luke goes up to the roof to find one bar of signal. Chase and Chloe wait on the counter; Chase opens The OG on his laptop — and there is a new game tile nobody uploaded, SOS ONLY, whose thumbnail is the two of them, from behind, looking at the laptop. Someone’s reading us. Luke comes back down at 12:41, drenched. His mouth moves before his words arrive.',
  sound: { hum: true, rain: true },
  render(pg) {
    const A = [40, 40, 520, 300], B = [578, 40, 382, 300], Cc = [40, 358, 420, 330], D = [478, 358, 482, 330], Eb = [40, 706, 300, 250], F = [358, 706, 602, 250], Gp = [40, 974, 450, 486], H = [508, 974, 452, 486];
    let s = pA_style(`
      .pA-talk{animation:pA-talk .32s steps(1,end) infinite;transform-box:fill-box;transform-origin:center}
      @keyframes pA-talk{0%{transform:scaleY(1)}50%{transform:scaleY(.25)}}
      .pA-late{opacity:0;transition:opacity .15s}
      .pA-late.on{opacity:1}
      .rm .pA-talk{animation:none!important}`);
    // 1: the roof hatch
    let a = R(A[0], A[1], A[2], A[3], '#2A323C') + R(A[0], A[1], A[2], 70, '#20262E');
    a += R(A[0] + 300, A[1] - 10, 140, 70, '#0B0E12', st(C.ink, 4));
    for (let i = 0; i < 6; i++) a += Ln(A[0] + 316, A[1] + 30 + i * 46, A[0] + 424, A[1] + 30 + i * 46, '#9AA0A8', 6);
    a += Ln(A[0] + 316, A[1] + 10, A[0] + 316, A[1] + 300, '#7D838C', 8) + Ln(A[0] + 424, A[1] + 10, A[0] + 424, A[1] + 300, '#7D838C', 8);
    const oLk = {}, oLu = {};
    a += fig('luke', { x: A[0] + 380, y: A[1] + 560, s: 1.15, face: 'neutral', out: oLk, beam: -30, flip: true, arms: { na: [150, 182] }, light: 'side', so: 0.5 });
    a += fig('luka', { x: A[0] + 110, y: A[1] + 590, s: 1.15, face: 'worried', out: oLu, props: ['lanyard'], light: 'side', so: 0.55 });
    s += pg.panel('a', A, a, { desc: 'Luke at the roof-hatch ladder, head torch on. Luka beside him.' });
    s += pg.say({ p: 'a', x: 196, y: 88, text: 'There’s a booster on the roof. If I can get one bar, we call out.', who: 'LUKE', tail: [oLk.head[0] - 30, oLk.head[1] - 20], w: 280, size: 24 });
    s += pg.say({ p: 'a', x: 210, y: 210, text: 'Nobody goes alone.', who: 'LUKA', tail: [oLu.head[0] + 16, oLu.head[1] - 20], w: 150, size: 24 });
    s += pg.say({ p: 'a', x: 488, y: 300, text: 'Five minutes.', who: 'LUKE', tail: [oLk.head[0] + 16, oLk.head[1] + 30], w: 100, size: 24 });

    // 2: the roof, in the storm
    let b = stormSky(B, { seed: 'p11sky', clouds: 16 });
    b += lightningFx(B, { bx: B[0] + 260, by: B[1] + 200, seed: 'p11b' });
    b += Po([[B[0], B[1] + 230], [B[0] + B[2], B[1] + 210], [B[0] + B[2], B[1] + B[3]], [B[0], B[1] + B[3]]], '#0A0D11');
    b += R(B[0] + 40, B[1] + 196, 70, 40, '#12161B') + R(B[0] + 270, B[1] + 150, 8, 70, '#0A0D11') + Pa(`M${B[0] + 256} ${B[1] + 150}l18 -30l18 30`, 'none', st('#0A0D11', 5));
    const oR = {};
    b += fig('luke', { x: B[0] + 190, y: B[1] + 232, s: 0.3, pose: 'pointUp', sil: true, rim: 'white', rimDx: -3, out: oR, add: ['phoneHand'], screen: C.screen, arms: { na: [170, 178] } });
    b += glow(oR.nh[0], oR.nh[1] - 6, 14, 14, 'gS', 0.9);
    b += rainFx(B, { op: 0.9, op2: 0.7 });
    s += pg.panel('b', B, b, { desc: 'Outside, the roof in the storm. Luke, tiny against the sky, holds his phone up like an offering. Lightning.' });

    // 3: Chase and Chloe on the counter
    let c = R(Cc[0], Cc[1], Cc[2], Cc[3], '#262E37') + R(Cc[0], Cc[1], Cc[2], Cc[3], 'url(#htN)', 'opacity=".3"');
    c += ollie({ x: Cc[0] + 380, y: Cc[1] + 200, s: 0.42, dark: true, turn: -1 });
    c += counterObj(Cc[0] - 10, Cc[1] + 300, Cc[2] + 20, 120, { dark: true });
    const oCh = {}, oCl = {};
    c += fig('chase', { x: Cc[0] + 120, y: Cc[1] + 312, s: 0.95, pose: 'typing', face: 'smirk', out: oCh, light: 'under', so: 0.4 });
    c += fig('chloe', { x: Cc[0] + 300, y: Cc[1] + 312, s: 0.92, pose: 'sit', face: 'flat', flip: true, out: oCl, light: 'under', so: 0.4 });
    c += laptopObj(Cc[0] + 150, Cc[1] + 256, 70, 52, { screen: '#E8F4F8' }) + glow(Cc[0] + 186, Cc[1] + 270, 70, 50, 'gS', 0.5);
    s += pg.panel('c', Cc, c, { desc: 'The shop floor. Chase and Chloe sit on the counter, waiting. Chase flips his laptop open.' });
    s += pg.say({ p: 'c', x: Cc[0] + 170, y: Cc[1] + 58, text: 'Network’s dead, but The OG still runs. Every game’s one HTML file. Works offline.', who: 'CHASE', tail: [oCh.head[0] + 10, oCh.head[1] - 34], w: 320, size: 22 });
    s += pg.say({ p: 'c', x: Cc[0] + 360, y: Cc[1] + 154, text: 'Course it does.', who: 'CHLOE', tail: [oCl.head[0] + 4, oCl.head[1] - 34], w: 100, size: 22 });

    // 4: The OG — and a tile nobody uploaded
    s += pg.panel('d', D, pA_ogScene(D, 3, pg.second), { desc: 'The OG’s grid of game tiles, Ollie on nearly every one of them. At the top, a tile nobody uploaded, the only one without Ollie: SOS ONLY — NEW. Its thumbnail is a comic panel: two people sitting on a counter, looking at a laptop, drawn from behind.' + (pg.second ? ' Behind them in the thumbnail, a third figure, holding a glowing screen.' : '') });
    s += pg.say({ p: 'd', type: 'whisper', x: D[0] + 110, y: D[1] + 250, text: '…That’s us.', who: 'CHLOE', tail: [D[0] + 330, D[1] + 300], w: 110, size: 23 });
    s += pg.say({ p: 'd', type: 'whisper', x: D[0] + 380, y: D[1] + 250, text: 'Someone’s reading us.', who: 'CHLOE', tail: [D[0] + 360, D[1] + 320], w: 150, size: 23 });
    s += pg.sfx('SNAP', D[0] + 430, D[1] + 312, { size: 34, rot: 10, fill: '#FFFFFF', p: 'd' });

    // 5: looking up through the skylight — 12:30
    let e = R(Eb[0], Eb[1], Eb[2], Eb[3], '#0B0E12');
    const sk = [Eb[0] + 50, Eb[1] + 30, 200, 190];
    e += Po([[Eb[0], Eb[1]], [Eb[0] + Eb[2], Eb[1]], [sk[0] + sk[2], sk[1]], [sk[0], sk[1]]], '#151A20') + Po([[Eb[0], Eb[1] + Eb[3]], [Eb[0] + Eb[2], Eb[1] + Eb[3]], [sk[0] + sk[2], sk[1] + sk[3]], [sk[0], sk[1] + sk[3]]], '#10141A');
    e += stormSky(sk, { seed: 'p11e', clouds: 8 }) + lightningFx(sk, { seed: 'p11e2', delay: 2 });
    e += fig('luke', { x: sk[0] + 120, y: sk[1] + 190, s: 0.42, pose: 'phone', props: ['phoneEar', 'headtorch'], sil: true, rim: 'white', rimDx: -3 });
    e += rainFx(sk, { op: 0.8 }) + R(sk[0], sk[1], sk[2], sk[3], 'none', st('#2E353E', 8));
    s += pg.panel('e', Eb, e, { desc: 'From inside, looking up through the skylight: Luke’s silhouette against the clouds.' });
    s += pg.cap({ p: 'e', x: Eb[0] + 12, y: Eb[1] + 12, text: '12:30.', w: 100, size: 21 });

    // 6: 12:41 — the hatch opens, he climbs down
    let f = R(F[0], F[1], F[2], F[3], '#252C35') + R(F[0], F[1], F[2], 60, '#1C2229');
    f += R(F[0] + 240, F[1] - 10, 150, 60, '#06080A', st(C.ink, 4)) + rainFx([F[0] + 240, F[1] - 10, 150, 60], { op: 0.9 });
    for (let i = 0; i < 5; i++) f += Ln(F[0] + 262, F[1] + 40 + i * 46, F[0] + 368, F[1] + 40 + i * 46, '#9AA0A8', 6);
    f += Ln(F[0] + 262, F[1], F[0] + 262, F[1] + 250, '#7D838C', 8) + Ln(F[0] + 368, F[1], F[0] + 368, F[1] + 250, '#7D838C', 8);
    const oF = {};
    f += fig('luke', { x: F[0] + 316, y: F[1] + 300, s: 0.95, view: 'back', pose: 'handsUp', out: oF, props: ['headtorch', 'cable'] });
    let drips = '';
    const rd = rng('p11d');
    for (let i = 0; i < 14; i++) { const dx = F[0] + 260 + rd() * 110, dy = F[1] + 80 + rd() * 160; drips += `<path d="M${n(dx)} ${n(dy)}q-2 7 0 11q2 -4 0 -11Z" fill="#9FC3D9"/>`; }
    f += drips;
    s += pg.panel('f', F, f, { desc: 'The hatch opens. Luke climbs down, drenched.' });
    s += pg.cap({ p: 'f', x: F[0] + 14, y: F[1] + 14, text: '12:41.', w: 100, size: 21 });
    s += pg.say({ p: 'f', x: F[0] + 500, y: F[1] + 110, text: 'Got nothing. It’s dead up there.', who: 'LUKE', tail: [oF.head[0] + 30, oF.head[1] + 10], w: 170, size: 24 });

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
      const o = {};
      g += `<g opacity=".22" transform="translate(5 2)">${fig('luke', { x: P[0] + 260, y: P[1] + 1230, s: 3.0, view: 'front', face: ['dot', 'flat', 'line'], props: [], sil: true })}</g>`;
      g += fig('luke', { x: P[0] + 260, y: P[1] + 1230, s: 3.0, view: 'front', face: ['dot', 'flat', 'line'], out: o, props: [], light: 'side', so: 0.5 });
      g += towel(o) + wet(o);
      if (talking) g += `<g class="pA-talk">${E(o.mouth[0], o.mouth[1] + 2, 15, 10, C.ink)}</g>`;
      // Chloe in the foreground, watching
      g += fig('chloe', { x: P[0] + 20, y: P[1] + 1150, s: 2.8, view: 'back', light: 'dark', so: 0.35 });
      return [g, o];
    };
    const [g7] = pair(Gp, true);
    s += pg.panel('g', Gp, g7, { desc: 'Chloe watches Luke towel off. His mouth is moving. There is no balloon.' });
    pg.desc('(silence)');
    const [g8, o8] = pair(H, false);
    s += pg.panel('h', H, g8, { desc: 'His mouth is closed and still. Then the balloon arrives.', guided: [{ move: 'cut', lock: 1800 }] });
    s += pg.say({ p: 'h', x: H[0] + 250, y: H[1] + 80, text: '…I’m fine. Stop looking at me.', who: 'LUKE', tail: [o8.head[0] + 20, o8.head[1] - 60], w: 230 }).replace('class="bl ', 'class="pA-late ');
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

page(12, {
  title: 'Ahead', side: 'left', gutter: 'greyblack', bleed: 'black', status: 'sos',
  alt: 'Luke tells Zee not to open JARVIS before she has said anything — then his mouth silently shapes the words after she says them. Chloe looks up through the skylight: the real Luke is still on the roof, perfectly still in the storm, phone to his ear, exactly where he was at 12:30. When she lowers her eyes, the Luke inside the store is right behind her. Tiny letters crawl under the skin above his collar.',
  sound: { hum: true, rain: true },
  render(pg) {
    const A = [40, 40, 920, 330], B = [40, 388, 450, 330], Cc = [508, 388, 452, 330], D = [40, 736, 920, 380], Eb = [40, 1134, 920, 326];
    let s = pA_style(`
      .pA-talk{animation:pA-talk .32s steps(1,end) infinite;transform-box:fill-box;transform-origin:center}
      @keyframes pA-talk{0%{transform:scaleY(1)}50%{transform:scaleY(.25)}}
      .pA-crawl{animation:pA-crawl 7s linear infinite}
      @keyframes pA-crawl{from{transform:translateY(0)}to{transform:translateY(var(--ch,-20px))}}
      .pA-turnA{transition:opacity 8s ease-in-out}
      .pA-turnB{opacity:0;transition:opacity 8s ease-in-out}
      .pA-turned .pA-turnA{opacity:0}
      .pA-turned .pA-turnB{opacity:1}
      .rm .pA-talk,.rm .pA-crawl{animation:none!important}
      .rm .pA-turnA,.rm .pA-turnB{transition:none}`);
    // the store lights stutter: an animated dark veil (the group holds the strength, the animation the rhythm)
    const flick = (P) => `<g opacity=".3" pointer-events="none">${R(P[0], P[1], P[2], P[3], C.ink, 'class="fx-flicker2"')}</g>`;
    // 1: Zee by the back office; Luke, across the room, already answering
    let a = R(A[0], A[1], A[2], A[3], '#1D242D') + R(A[0], A[1] + 260, A[2], 70, '#171C22');
    a += R(A[0] + 60, A[1] + 50, 130, 230, '#3A3530', st(C.ink, 4)) + R(A[0] + 82, A[1] + 76, 86, 60, '#0E1318', st(C.ink, 2)) + Ci(A[0] + 172, A[1] + 170, 6, '#9AA0A6');
    a += Tx(A[0] + 125, A[1] + 162, 'STAFF ONLY', 14, '#C9C4B8', 'text-anchor="middle"', FONTS.ui);
    a += R(A[0] + 540, A[1] + 30, 340, 220, '#121920', st(C.ink, 3)) + rainFx([A[0] + 540, A[1] + 30, 340, 220], { op: 0.55 }) + pA_glassFrame([A[0] + 540, A[1] + 30, 340, 220], { seed: 'p12a', mullions: [0.5] });
    a += ollie({ x: A[0] + 30, y: A[1] + 290, s: 0.4, dark: true, turn: 1 });
    const oZ = {}, oL = {};
    a += fig('zee', { x: A[0] + 250, y: A[1] + 520, s: 1.05, face: 'neutral', out: oZ, pose: 'holdOne', light: 'side', so: 0.55 });
    a += `<g opacity=".3" class="fx-jitter">${fig('luke', { x: A[0] + 726, y: A[1] + 452, s: 0.7, flip: true, face: 'blank', props: ['headtorch'], sil: true })}</g>`;
    a += fig('luke', { x: A[0] + 720, y: A[1] + 450, s: 0.7, flip: true, face: 'blank', out: oL, props: ['headtorch'], light: 'side', so: 0.6 });
    a += flick(A);
    s += pg.panel('a', A, a, { desc: 'Zee by the back-office door. Before she has said a word, Luke speaks from across the room.' });
    s += pg.say({ p: 'a', x: 470, y: 92, text: 'Zee. Don’t open JARVIS.', who: 'LUKE', tail: [oL.head[0] - 10, oL.head[1] - 20], w: 210 });
    s += pg.say({ p: 'a', x: 210, y: 166, text: '…I didn’t say anything.', who: 'ZEE', tail: [oZ.head[0] + 6, oZ.head[1] - 30], w: 180, size: 27 });

    // 2: Zee says it — and only now does his mouth move, silently
    let b = R(B[0], B[1], B[2], B[3], '#1A2129') + R(B[0], B[1] + 270, B[2], 60, '#151A20');
    b += R(B[0] + 250, B[1] + 20, 180, 200, '#121920', st(C.ink, 3)) + rainFx([B[0] + 250, B[1] + 20, 180, 200], { op: 0.5 });
    const oL2 = {};
    b += fig('luke', { x: B[0] + 340, y: B[1] + 400, s: 0.82, flip: true, view: 'front', face: ['blank', 'flat', 'line'], out: oL2, props: ['headtorch'], light: 'side', so: 0.6 });
    b += `<g class="pA-talk">${E(oL2.mouth[0], oL2.mouth[1] + 1, 5, 3.5, C.ink)}</g>`;
    const oZ2 = {};
    b += fig('zee', { x: B[0] + 110, y: B[1] + 640, s: 1.7, face: 'flat', out: oZ2, pose: 'holdOne', light: 'side', so: 0.6 });
    b += flick(B);
    s += pg.panel('b', B, b, { desc: 'Zee says it. And now, across the room, Luke’s mouth moves — silently shaping the words he already said.' });
    s += pg.say({ p: 'b', x: B[0] + 150, y: B[1] + 60, text: 'I’m going to check JARVIS.', who: 'ZEE', tail: [oZ2.head[0] + 10, oZ2.head[1] - 40], w: 220 });

    // 3: Chloe steps back, sick, and looks up
    let c = R(Cc[0], Cc[1], Cc[2], Cc[3], '#161C23');
    c += Po([[Cc[0] + 120, Cc[1]], [Cc[0] + 360, Cc[1]], [Cc[0] + 330, Cc[1] + 40], [Cc[0] + 150, Cc[1] + 40]], '#0B1016', st('#2E353E', 5)) + rainFx([Cc[0] + 120, Cc[1], 240, 40], { op: 0.6 });
    const oC = {};
    c += fig('chloe', { x: Cc[0] + 200, y: Cc[1] + 760, s: 2.0, face: ['wide', 'worried', 'frown'], look: [0.6, -1.4], tilt: -16, lean: -7, out: oC, pose: 'mouth', light: 'top', so: 0.6 });
    c += flick(Cc);
    s += pg.panel('c', Cc, c, { desc: 'Chloe steps back, sick, and looks up.' });

    // 4: through the skylight — the real Luke, perfectly still in the storm
    let d = stormSky(D, { seed: 'p12sky', clouds: 18 });
    d += lightningFx(D, { bx: D[0] + 700, by: D[1] + 260, seed: 'p12b' });
    d += Po([[D[0], D[1] + 300], [D[0] + D[2], D[1] + 286], [D[0] + D[2], D[1] + D[3]], [D[0], D[1] + D[3]]], '#07090C');
    // he does not move. He is the only thing on the page that doesn't.
    const oR = {};
    d += fig('luke', { out: oR, x: D[0] + 640, y: D[1] + 336, s: 0.85, pose: 'phone', tilt: 16, face: ['blank', 'flat', 'open'], props: ['phoneEar', 'headtorch', 'cable'], screen: '#CFF2FF', light: 'dark', so: 0.55 });
    const rr = rng('p12spl');
    let spl = '';
    for (let i = 0; i < 9; i++) { const sx = oR.head[0] + rr.jit(26), sy = oR.head[1] - 26 + (i > 4 ? 70 : 0) + rr.jit(4); spl += Pa(`M${n(sx - 6)} ${n(sy)}q6 -9 12 0`, 'none', st('#DCE8F2', 1.4, 'opacity=".7"')); }
    d += spl;
    d += rainFx(D, { op: 0.95, op2: 0.75 });
    // the skylight frame around it all
    d += Po([[D[0], D[1]], [D[0] + D[2], D[1]], [D[0] + D[2] - 70, D[1] + 40], [D[0] + 70, D[1] + 40]], '#1C2229') + Po([[D[0], D[1] + D[3]], [D[0] + D[2], D[1] + D[3]], [D[0] + D[2] - 70, D[1] + D[3] - 40], [D[0] + 70, D[1] + D[3] - 40]], '#151A20');
    d += Po([[D[0], D[1]], [D[0] + 70, D[1] + 40], [D[0] + 70, D[1] + D[3] - 40], [D[0], D[1] + D[3]]], '#181D24') + Po([[D[0] + D[2], D[1]], [D[0] + D[2] - 70, D[1] + 40], [D[0] + D[2] - 70, D[1] + D[3] - 40], [D[0] + D[2], D[1] + D[3]]], '#181D24');
    d += R(D[0] + 70, D[1] + 40, D[2] - 140, D[3] - 80, 'none', st('#39424D', 6)) + Ln(D[0] + D[2] / 2, D[1] + 40, D[0] + D[2] / 2, D[1] + D[3] - 40, '#39424D', 6) + glassDrops([D[0] + 70, D[1] + 40, D[2] - 140, D[3] - 80], 'p12g', 40);
    s += pg.panel('d', D, d, { desc: 'Through the skylight: the real Luke is still on the roof. Standing perfectly still in the storm, phone pressed to his ear, head tilted, mouth open, rain bouncing off him. Exactly where he was at 12:30.' });

    // 5: she lowers her eyes. He's right behind her.
    let e = R(Eb[0], Eb[1], Eb[2], Eb[3], '#11161C') + rainFx(Eb, { dark: true, op: 0.6, op2: 0.4 });
    const oA = {}, oA1 = {}, oB = {};
    const fakeSide = (face, out) => fig('luke', { x: Eb[0] + 420, y: Eb[1] + 950, s: 2.5, lean: 8, face, out, props: [], light: 'side', so: 0.75, look: [1, 0.4] });
    const sideNeutral = fakeSide(['dot', 'flat', 'line'], oA), sideSmile = fakeSide(['dot', 'flat', 'smile'], oA1);
    const neckA = pA_rotSkin(oA.head[0] - 26, oA.head[1] + 48, 66, 54, 'p12nA');
    const front = fig('luke', { x: Eb[0] + 470, y: Eb[1] + 950, s: 2.5, view: 'front', face: ['blank', 'flat', 'smile'], out: oB, props: [], light: 'side', so: 0.7 });
    const k = oB.scale;
    const pupils = `<g class="pA-pupils">${Ci(oB.head[0] - 9 * k, oB.head[1], 2.4 * k, C.ink)}${Ci(oB.head[0] + 9 * k, oB.head[1], 2.4 * k, C.ink)}</g>`;
    const neckB = pA_rotSkin(oB.head[0] - 24, oB.head[1] + 50, 48, 54, 'p12nB');
    e += `<g class="pA-turnA"><g opacity=".22" class="fx-jitter">${sideNeutral}</g>${swap(sideNeutral, sideSmile, 'pA-smile')}${neckA}</g>`;
    e += `<g class="pA-turnB">${front}${pupils}${neckB}</g>`;
    const oCh = {};
    e += fig('chloe', { x: Eb[0] + 650, y: Eb[1] + 1020, s: 2.9, view: 'front', face: ['lids', 'worried', 'frown'], look: [-1.2, 0.6], out: oCh, light: 'side', so: 0.6 });
    e += flick(Eb);
    s += pg.panel('e', Eb, e, { desc: 'Chloe slowly lowers her eyes to the Luke inside the store. He is right behind her. As he leans in, just above his collar, tiny letters crawl under the skin like veins. Code Rot, wearing Luke.' });
    s += pg.say({ p: 'e', x: Eb[0] + 150, y: Eb[1] + 70, text: 'I’m right here, Chloe.', who: 'LUKE', tail: [oA.mouth[0] - 10, oA.mouth[1]], w: 200 });
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
