/* SOS ONLY — pages 1–3: cold open, title splash, headcount. */

/* ---------- Page 1 — One Year Ago ---------- */

// The wide establishing shot. Drawn twice: panel 1 and its exact repeat in panel 5.
function p1Wide(pg, box, gone) {
  const [x, y, w, h] = box;
  let s = storeInterior(box, {
    vx: 0.55, vy: 0.4, bw: 0.4, bh: 0.48, night: 0.58, vig: 1, lights: [1, 0, 0, 1, 1, 0], flicker: 3, left: 'acc', right: 'display',
    litScreens: (i, j) => (gone && i === 2 && j === 1 ? '#FFE680' : false),
    ollie: (bl, bt, bw, bh) => ollie({ x: bl + bw * 0.8, y: bt + bh * 0.99, s: bh / 560, back: !gone, dark: true, flip: false, turn: gone ? -2 : 0 }),
  });
  // a pool of light where Jarrad works
  s += glow(x + w * 0.23, y + h * 0.62, w * 0.2, h * 0.3, 'gW', 0.24) + glow(x + w * 0.23, y + h * 0.74, w * 0.16, h * 0.07, 'gW', 0.3);
  const jx = x + w * 0.24, jy = y + h * 0.71;
  if (!gone) {
    const out = {};
    s += fig('jarrad', { x: jx, y: jy, s: 0.42, pose: 'kneel', flip: true, add: ['scanner'], face: 'talk', light: 'top', so: 0.5, out });
    s += `<line class="fx-sweep" style="transform-origin:${n(out.nh[0])}px ${n(out.nh[1])}px" x1="${n(out.nh[0] - 8)}" y1="${n(out.nh[1] - 4)}" x2="${n(x + w * 0.06)}" y2="${n(y + h * 0.5)}" stroke="${C.laser}" stroke-width="1.6" opacity=".85"/>`;
  } else {
    // the scanner on the floor, laser still on, pointing at nothing; the keyring on the tiles
    const sx = jx - 6, sy = jy - 4;
    s += `<g transform="translate(${n(sx)} ${n(sy)}) rotate(14) scale(.8)">${Pa('M-6 -6 L26 -10 L30 0 L4 6 L2 22 L-8 22 Z', '#3A3C42', st(C.ink, 3))}${R(26, -9, 4, 8, C.laser)}</g>`;
    s += `<g class="fx-sweep" style="transform-origin:${n(sx + 16)}px ${n(sy + 2)}px"><line x1="${n(sx + 16)}" y1="${n(sy + 2)}" x2="${n(sx + 300)}" y2="${n(sy + 22)}" stroke="${C.laser}" stroke-width="2.8"/>${glow(sx + 300, sy + 22, 22, 9, 'gR', 0.9)}</g>`;
    s += glow(sx + 160, sy + 22, 170, 14, 'gR', 0.45);
    s += `<g transform="translate(${n(jx + 60)} ${n(jy + 4)}) scale(1.7)">${Ci(0, 0, 8, '#FFFFFF', st(C.ink, 2))}${Pa('M-7 -3Q0 2 7 -3M-5 5Q0 -2 2 -8', 'none', st('#1E5AA8', 1.4))}${Ln(6, -6, 16, -14, '#9AA0A6', 2)}</g>`;
  }
  // foreground: the counter, from behind
  s += counterFore(box, { y: y + h * 0.84, tilt: -6, dark: true });
  s += R(x + w * 0.08, y + h * 0.76, 70, 40, '#22252B', `rx="4" ${st(C.ink, 2.5)}`) + R(x + w * 0.08 + 8, y + h * 0.76 + 6, 54, 16, '#3B4A3C');
  // stocktake clutter on the counter: a tub, a stack of handset boxes, the scanner cradle
  const cy = y + h * 0.84;
  s += R(x + w * 0.78, cy - 46, 110, 50, '#22416B', st(C.ink, 3)) + R(x + w * 0.78, cy - 46, 110, 10, '#2E5687', st(C.ink, 2));
  s += handsetBox(x + w * 0.36, cy - 40, 46, 38, { col: '#9A978E' }) + handsetBox(x + w * 0.36 + 6, cy - 72, 40, 32, { col: '#A5A299' }) + handsetBox(x + w * 0.42, cy - 34, 40, 32, { col: '#8F8C84' });
  s += R(x + w * 0.5, cy - 18, 40, 18, '#2A2C31', `rx="4" ${st(C.ink, 2)}`) + glow(x + w * 0.5 + 20, cy - 6, 22, 6, 'gR', 0.6);
  if (gone) {
    // the demo phone, face-up on the counter, showing a call that never ends
    const px = x + w * 0.56, py = y + h * 0.86;
    s += glow(px + 70, py + 30, 150, 50, 'gS', 0.7);
    s += `<g transform="translate(${n(px)} ${n(py)}) skewX(-30) scale(1 .6)">${R(0, 0, 150, 92, '#141518', `rx="10" ${st(C.ink, 3)}`)}${R(7, 6, 136, 80, '#CDEFFA', 'rx="6" class="lit"')}` +
      `<text class="ft-m" x="75" y="34" font-size="22" fill="#123" text-anchor="middle">CALL 1</text><text class="ft-m p1-timer" x="75" y="66" font-size="30" fill="#123" text-anchor="middle">00:00:00</text></g>`;
  }
  return s;
}

page(1, {
  title: 'One Year Ago', side: 'right', gutter: 'black', bleed: 'dark', status: 'bars',
  alt: 'One year ago, at 3:00 AM, Jarrad is alone in the store doing stocktake. A demo phone with no SIM rings with a call from the store’s own number. He answers. In the repeat of the opening shot, he is gone.',
  sound: { rain: true, hum: true },
  render(pg) {
    const A = [40, 40, 920, 500], B = [40, 558, 380, 364], Cc = [438, 558, 230, 364], D = [686, 558, 274, 364], Eb = [40, 940, 920, 500];
    const hr = new Date().getHours();
    const time = hr >= 2 && hr < 4 ? fmtClock() : '3:00 AM';
    let s = '';
    const half = [[40, 40, 478, 500], [463, 40, 497, 500]];
    s += pg.panel('a', A, p1Wide(pg, A, false), {
      guided: [{ focus: half[0], move: 'cut' }, { focus: half[1] }], desc: 'The store at night, from behind the counter. Half the lights are off. Rain on the front glass; the roller door is down. Jarrad kneels at the accessories wall with a scanner. The cardboard Ollie standee stands by the entrance, facing the street.' });
    s += pg.cap({ p: 'a', x: 62, y: 62, text: `Optus Redcliffe. One year ago. ${time}.`, w: 360 });

    // panel 2: Jarrad counting stock
    const out = {};
    let b = pegboard(B, { dark: true, seed: 'p1peg', rows: 3, cols: 4 });
    b += glow(B[0] + 200, B[1] - 20, 260, 120, 'gW', 0.35);
    b += R(B[0], B[1] + 300, B[2], 80, '#1E242B') + floorGrid([B[0], B[1] + 300, B[2], 70], B[0] + 190, B[1] + 240, { col: '#252C34', lineCol: '#323B45', rows: 4 });
    b += fig('jarrad', { x: B[0] + 262, y: B[1] + 372, s: 0.88, pose: 'kneel', flip: true, add: ['scanner'], face: 'talk', light: 'side', so: 0.55, out, arms: { na: [70, 92] } });
    const tgt = [B[0] + 54, B[1] + 236];
    b += `<g class="fx-sweep" style="transform-origin:${n(out.nh[0])}px ${n(out.nh[1])}px"><line x1="${n(out.nh[0] - 30)}" y1="${n(out.nh[1] - 6)}" x2="${n(tgt[0])}" y2="${n(tgt[1])}" stroke="${C.laser}" stroke-width="2.4"/>${glow(tgt[0], tgt[1], 26, 12, 'gR', 0.8)}</g>`;
    b += R(B[0], B[1], B[2], B[3], 'url(#gVig)', 'opacity=".7"');
    s += pg.panel('b', B, b, { desc: 'Jarrad on one knee at the accessories wall, scanner gun in hand, his 2IC lanyard swinging, a volleyball keyring on his belt loop.' });
    s += pg.say({ p: 'b', x: B[0] + 128, y: B[1] + 62, text: '…forty-one. Forty-two.', who: 'JARRAD', tail: [out.head[0] - 26, out.head[1] - 18], w: 210 });
    s += pg.sfx('beep', B[0] + 90, B[1] + 300, { size: 46, rot: -12, fill: C.laser, stroke: '#FFFFFF', sw: 5, p: 'b' });

    // panel 3: the demo phone with no SIM rings
    let c = R(Cc[0], Cc[1], Cc[2], Cc[3], '#0B0D10');
    c += R(Cc[0], Cc[1] + 296, Cc[2], 6, '#2A2D33');
    c += phoneObj(Cc[0] - 40, Cc[1] + 120, 50, 92, { stand: true }) + phoneObj(Cc[0] + 210, Cc[1] + 120, 50, 92, { stand: true });
    c += phoneObj(Cc[0] + 52, Cc[1] + 40, 126, 230, {
      lit: true, stand: true, ring: true, haloOp: 0.7,
      content: (sx, sy, sw, sh) =>
        // no SIM icon
        Pa(`M${n(sx + 8)} ${n(sy + 6)}h9l4 4v11h-13Z`, 'none', st('#355', 1.4)) + Ln(sx + 6, sy + 22, sx + 23, sy + 4, C.laser, 1.6) +
        Tx(sx + sw / 2, sy + 52, 'INCOMING CALL', 11, '#355', 'text-anchor="middle" letter-spacing="1"', FONTS.ui) +
        Tx(sx + sw / 2, sy + 82, 'OPTUS', 18, '#0E1A22', 'text-anchor="middle"', FONTS.ui) + Tx(sx + sw / 2, sy + 102, 'REDCLIFFE', 15, '#0E1A22', 'text-anchor="middle"', FONTS.ui) +
        Ci(sx + sw * 0.28, sy + sh - 30, 13, '#D7263D') + Ci(sx + sw * 0.72, sy + sh - 30, 13, '#2BB673') +
        `<g class="fx-pulse">${Ci(sx + sw * 0.72, sy + sh - 30, 18, 'none', st('#2BB673', 2))}</g>`,
    });
    s += pg.panel('c', Cc, c, { desc: 'Insert: a demo phone on its security stand, with no SIM. The screen lights up: incoming call, Optus Redcliffe — the store’s own number.' });
    s += pg.sfx('brrr', Cc[0] + 40, Cc[1] + 70, { size: 34, rot: -16, fill: C.y, p: 'c' }) + pg.sfx('brrr', Cc[0] + 196, Cc[1] + 320, { size: 30, rot: 10, fill: C.y, p: 'c', log: false });

    // panel 4: close on Jarrad, phone to ear; the balloon is cut off by the border
    const o4 = {};
    pg.desc('Close on Jarrad, phone to his ear, his habit-smile on. His sentence is cut off by the edge of the panel and never finishes.');
    let d = R(D[0], D[1], D[2], D[3], '#101820') + R(D[0], D[1], D[2], D[3], 'url(#htN)', 'opacity=".6"');
    d += glow(D[0] + 120, D[1] + 160, 200, 200, 'gS', 0.35);
    d += fig('jarrad', { x: D[0] + 150, y: D[1] + 1060, s: 2.55, pose: 'phone', props: ['lanyard', 'phoneEar'], screen: '#CFF2FF', face: 'smile', light: 'side', so: 0.62, out: o4, flip: true });
    d += pg.say({ p: 'd', x: D[0] + 210, y: D[1] + 70, text: 'Optus Redcliffe, Jarrad speaking, how can I—', who: 'JARRAD', tail: [D[0] + 150, D[1] + 140], w: 300 });
    s += pg.panel('d', D, d);

    // panel 5: exact repeat of panel 1, one year's absence later
    s += pg.panel('e', Eb, p1Wide(pg, Eb, true), {
      guided: [{ focus: [40, 940, 478, 500], move: 'cut', hold: 1200 }, { focus: [463, 940, 497, 500] }], desc: 'The same shot again. Jarrad is gone. The scanner lies on the floor, its red laser still on, pointing at nothing. His keyring is on the tiles. The demo phone lies face-up on the counter, showing a call timer. And the Ollie standee has turned around: it is facing the spot where Jarrad was.' });
    return s;
  },
  mount(ctx) {
    if (!ctx.save.call1Start) { ctx.save.call1Start = Date.now(); ctx.persist(); }
    const timer = ctx.q('.p1-timer');
    ctx.onPanel('e', () => {
      const start = Date.now();
      const tick = () => { if (timer) timer.textContent = fmtDur(Date.now() - start); };
      tick();
      ctx.every(1000, tick);
    });
    ctx.onPanel('b', () => ctx.sfx('beep'), 900);
    ctx.onPanel('c', () => { ctx.sfx('ring'); ctx.after(1400, () => ctx.sfx('ring')); ctx.haptic('ring'); }, 2000);
    ctx.onPanel('d', () => [69, 72, 76, 74].forEach((m, i) => ctx.after(i * 420, () => ctx.sfx('note', { m }))), 4200);
    ctx.onPanel('e', () => { Sound.silence(5000); }, 6200);
  },
});

/* ---------- Page 2 — Title splash ---------- */

function p2Sky() {
  const r = rng('p2sky');
  let s = R(-60, -60, 1120, 900, 'url(#gSky)') + R(-60, -60, 1120, 640, 'url(#gFadeUp)', 'opacity=".75"');
  // the anvil: a flat, towering top spreading right across the sky, faintly lit along its upper edge
  s += Pa('M-80 92 C120 30 380 0 560 12 C760 26 950 42 1100 92 L1100 226 C980 214 850 196 730 214 C640 228 570 250 520 290 L360 290 C320 252 250 228 150 224 C60 222 -10 232 -80 244 Z', '#141E2A');
  s += Pa('M-80 92 C120 30 380 0 560 12 C760 26 950 42 1100 92', 'none', st('#55708A', 3, 'opacity=".5"'));
  for (let i = 0; i < 9; i++) {
    const cx = 640 + i * 48 + r.jit(10), cy = 220 + r.jit(8) - Math.max(0, 4 - i) * 4;
    s += E(cx, cy, 26, 17, '#141E2A') + Pa(`M${n(cx - 20)} ${n(cy + 9)}Q${n(cx)} ${n(cy + 23)} ${n(cx + 20)} ${n(cy + 9)}`, 'none', st('#3A5066', 2, 'opacity=".45"'));
  }
  // the tower: billows stacked from the base up into the anvil, lit on top by the lightning inside
  const bil = [];
  for (let i = 0; i < 46; i++) {
    const v = r();
    const cy = lerp(468, 232, v), hw = lerp(300, 140, v);
    bil.push([420 + r.jit(hw), cy, lerp(92, 60, v) * (0.65 + r() * 0.5)]);
  }
  for (let i = 0; i < 12; i++) bil.push([-30 + i * 64 + r.jit(16), 470 + i * 2 + r.jit(12), 40 + r() * 26]);
  bil.sort((p1, p2) => p1[1] - p2[1]).forEach(([cx, cy, rad], i) => {
    const near = Math.max(0, 1 - Math.hypot(cx - 310, cy - 430) / 420);
    s += Ci(cx, cy, rad, i % 3 ? '#1D2938' : '#222F40');
    s += Pa(`M${n(cx - rad * 0.88)} ${n(cy - rad * 0.24)}A${n(rad)} ${n(rad)} 0 0 1 ${n(cx + rad * 0.5)} ${n(cy - rad * 0.86)}`, 'none', st('#7A93AC', 2.4, `opacity="${n(0.16 + near * 0.4 + r() * 0.12)}"`));
  });
  // lit from inside by the lightning behind the jetty
  s += glow(310, 420, 240, 140, 'gS', 0.14) + glow(310, 470, 150, 70, 'gW', 0.12);
  // the dark, ragged base of the cell, and the rain shafts hanging under it
  let base = 'M-80 448';
  for (let x = -80; x <= 1100; x += 40) base += `Q${n(x + 20)} ${n(522 + r.jit(10) + Math.max(0, x - 600) * 0.06)} ${n(x + 40)} ${n(500 + r.jit(8) + Math.max(0, x - 600) * 0.06)}`;
  s += Pa(base + 'L1100 448 Z', 'url(#gFade)', 'opacity=".9"');
  s += Po([[170, 506], [430, 506], [372, 770], [110, 770]], 'url(#hatchW)', 'opacity=".09"');
  s += Po([[600, 508], [880, 508], [836, 770], [560, 770]], 'url(#hatchW)', 'opacity=".07"');
  // a resting bolt out of the base (the flash overlay brightens it)
  const bolt = 'M300 506 L292 548 L318 576 L300 628 L330 664 L322 718 L338 756';
  s += Pa(bolt, 'none', st('#BFD9FF', 10, 'opacity=".12"')) + Pa(bolt, 'none', st('#E8F2FF', 2.2, 'opacity=".55"')) + Pa('M318 576 L360 602 L372 646 M300 628 L268 656', 'none', st('#DCEBFF', 1.4, 'opacity=".4"'));
  // the mainland, far off: a thin line of lights that will go out
  s += R(-60, 708, 1120, 14, '#141E28') + glow(820, 714, 260, 18, 'gO', 0.35);
  for (let i = 0; i < 24; i++) s += Ci(560 + i * 18 + r.jit(5), 712 + r.jit(2), 1.4, '#FFD9A8', `opacity="${n(0.4 + r() * 0.5)}"`);
  return s;
}

// A tiny walking silhouette, feet at (x, y), h tall. sink: 0..1 of the body under the water at y.
function p2Walker(x, y, h, o = {}) {
  const hr = h * 0.13, sh = h * 0.22;
  let g = Ci(x, y - h + hr, hr, '#04050A');
  g += Pa(`M${n(x - sh)} ${n(y - h + hr * 2.2)}L${n(x + sh)} ${n(y - h + hr * 2.2)}L${n(x + sh * 0.8)} ${n(y - h * 0.46)}L${n(x - sh * 0.8)} ${n(y - h * 0.46)}Z`, '#04050A');
  const st2 = o.step || 1;
  g += Pa(`M${n(x - sh * 0.5)} ${n(y - h * 0.5)}L${n(x - sh * 0.5 - st2 * h * 0.08)} ${n(y)}M${n(x + sh * 0.5)} ${n(y - h * 0.5)}L${n(x + sh * 0.5 + st2 * h * 0.06)} ${n(y)}`, 'none', `stroke="#04050A" stroke-width="${n(h * 0.14)}" stroke-linecap="round"`);
  if (o.screen) g += glow(x, y - h * 0.62, h * 0.5, h * 0.5, 'gS', 0.9) + R(x - h * 0.08, y - h * 0.7, h * 0.16, h * 0.13, C.screen);
  if (!o.sink) return g;
  const cid = uid('p2w');
  return `<clipPath id="${cid}"><rect x="${n(x - h)}" y="${n(y - h * 2)}" width="${n(h * 2)}" height="${n(h * 2 - h * o.sink)}"/></clipPath><g clip-path="url(#${cid})">${g}</g>` +
    E(x, y - h * o.sink, h * 0.45, h * 0.09, 'none', st('#5A7488', 1, 'opacity=".8"'));
}

function p2Jetty(extra) {
  let s = '';
  // the bay
  s += R(-60, 720, 1120, 460, 'url(#gSea)');
  for (let i = 0; i < 9; i++) {
    const y = 740 + i * i * 6 + i * 10;
    s += `<path class="fx-swell" style="animation-delay:${i * 0.4}s" d="M-60 ${y}q60 -6 120 0t120 0t120 0t120 0t120 0t120 0t120 0t120 0t120 0t120 0" fill="none" stroke="#3A5266" stroke-width="${1 + i * 0.35}" opacity="${0.5 - i * 0.03}"/>`;
  }
  // the jetty, receding out into the bay
  const near = [[-40, 1010], [210, 980]], far = [[372, 758], [396, 756]];
  s += Po([near[0], near[1], far[1], far[0]], '#07090C', st(C.ink, 2));
  for (let k = 0; k <= 22; k++) {
    const t = persp(k / 22, 6);
    const lx = lerp(-40, 372, t), ly = lerp(1010, 758, t), rx = lerp(210, 396, t), ry = lerp(980, 756, t);
    const ph = lerp(80, 8, t);
    s += Ln(lx + 4, ly, lx + 4, ly + ph, '#07090C', lerp(8, 1.2, t)) + Ln(rx - 4, ry, rx - 4, ry + ph, '#07090C', lerp(8, 1.2, t));
    if (k % 3 === 1) {
      const lh = lerp(110, 10, t);
      s += Ln(rx - 6, ry, rx - 6, ry - lh, '#07090C', lerp(4, 0.8, t)) + glow(rx - 6, ry - lh, lerp(30, 4, t), lerp(30, 4, t), 'gO', 0.7) + Ci(rx - 6, ry - lh, lerp(5, 0.9, t), '#FFD9A8');
    }
  }
  // railings
  s += Pa(`M-40 960L372 752M210 940L396 750`, 'none', st('#07090C', 3));
  // hidden detail: a single-file queue walking out along the jetty and off the end into the water.
  // Second read: one more at the back of the line, holding a glowing screen.
  const cl = (t) => [lerp(85, 384, t), lerp(995, 757, t)];
  const walkers = [];
  if (extra) walkers.push([...cl(0.735), 22, 0, true]);
  for (let k = 0; k < 6; k++) walkers.push([...cl(0.78 + k * 0.042), lerp(20, 12.5, k / 5), 0]);
  [[391, 752, 12, 0.3], [397, 748.5, 11.5, 0.55], [402, 745.5, 11, 0.8]].forEach((w) => walkers.push(w));
  let q = '';
  walkers.slice().reverse().forEach(([x, y, h, sink, scr], i) => { q += p2Walker(x, y, h, { sink, screen: scr, step: i % 2 ? 1 : -1 }); });
  // the last of them: just rings on the water
  q += E(407, 743, 6, 1.4, 'none', st('#6A8498', 1)) + E(407, 743, 10, 2.2, 'none', st('#4A6478', 0.8, 'opacity=".7"'));
  s += `<g class="p2-queue">${q}</g>`;
  return s;
}

function p2CarPark() {
  let s = '';
  // the shopping centre, low and dark, one storefront glowing Optus yellow
  s += Po([[430, 1120], [1060, 1060], [1060, 960], [430, 1040]], '#0D1015');
  s += Po([[430, 1040], [1060, 960], [1060, 940], [430, 1024]], '#1A1E25');
  const shops = [[470, 1036], [560, 1026], [650, 1015], [740, 1004], [830, 993], [920, 982]];
  shops.forEach(([x, y], i) => {
    const lit = i === 3;
    s += Po([[x, y], [x + 78, y - 10], [x + 78, y + 48], [x, y + 58]], lit ? C.y : '#161A20', st(C.ink, 1.5));
    if (lit) s += glow(x + 40, y + 40, 150, 90, 'gY', 0.6) + `<text class="ft-u" x="${x + 16}" y="${y + 6}" font-size="13" fill="${C.ink}" transform="rotate(-7 ${x} ${y})">optus</text>`;
  });
  // the Ollie standee, a white mask in the lit window
  s += ollie({ x: 790, y: 1043, s: 0.13, dark: true });
  // asphalt, lines, puddles, sodium lights
  s += Po([[300, 1500], [1060, 1500], [1060, 1060], [430, 1120]], '#14171C');
  for (let i = 0; i < 9; i++) {
    const t = i / 8;
    s += Ln(lerp(470, 1050, t), lerp(1120, 1062, t), lerp(360, 1300, t), 1500, '#5A5F66', 2.5, 'opacity=".6"');
  }
  [[640, 1300, 90, 14], [880, 1220, 70, 10], [520, 1420, 120, 18]].forEach(([x, y, rx, ry]) => { s += E(x, y, rx, ry, '#2A2F37') + E(x, y, rx * 0.6, ry * 0.5, C.y, 'opacity=".25"'); });
  [[560, 1080], [760, 1060], [960, 1040]].forEach(([x, y], i) => {
    s += Ln(x, y + 100, x, y - 60 + i * 6, '#090B0E', 5) + Ln(x, y - 60 + i * 6, x + 26, y - 64 + i * 6, '#090B0E', 4);
    s += `<path d="M${x + 26} ${y - 60 + i * 6}L${x - 30} ${y + 200}L${x + 90} ${y + 200}Z" fill="url(#gConeY)" opacity=".25"/>` + glow(x + 26, y - 58 + i * 6, 30, 16, 'gO', 0.9);
  });
  return s;
}

page(2, {
  title: 'SOS ONLY', side: 'left', gutter: 'black', bleed: 'storm', status: 'bars',
  alt: 'Title splash. A night storm over Moreton Bay. Redcliffe Jetty is silhouetted by lightning; a huge storm cell sits overhead. In an inset, the bridge to the mainland goes dark, light by light. Below, an empty shopping-centre car park, one storefront glowing Optus yellow. Far out at the end of the jetty, tiny figures walk single file off the end into the water.',
  sound: { rain: true },
  render(pg) {
    let s = '';
    const extra = pg.second;
    const art = `<g class="par par1">${p2Sky()}</g>${lightningFx([0, 0, 1000, 800], { bx: 300, by: 760, seed: 'p2bolt' })}` +
      rainFx([-40, -40, 1080, 1580], { op: 0.85, op2: 0.6 }) +
      `<g class="par par2">${p2Jetty(extra)}</g><g class="par par3">${p2CarPark()}</g>` +
      R(0, 0, 1000, 1500, 'url(#gVig)', 'opacity=".55"');
    s += pg.panel('a', [0, 0, 1000, 1500], art, {
      border: false, desc: 'A night storm over Moreton Bay; Redcliffe Jetty silhouetted mid-left; an empty car park and one glowing yellow storefront.',
      // guided: the title, the captions in the storm, the bridge going dark, then down the bay
      // and a slow creep out to the end of the jetty, holding on the queue
      guided: [{ focus: [40, 1050, 920, 400], move: 'cut' }, { focus: [20, 30, 520, 300], move: 'glide' }],
    });
    // inset: the bridge to the mainland, lights going out in a line
    const I = [600, 70, 360, 200];
    let bridge = R(I[0], I[1], I[2], I[3], '#0B1018') + E(I[0] + 180, I[1] + 40, 260, 90, '#162030') + R(I[0], I[1] + 130, I[2], 70, '#0D1A26');
    bridge += Pa(`M${I[0] - 10} ${I[1] + 128}L${I[0] + 370} ${I[1] + 112}`, 'none', st('#05070A', 7));
    for (let i = 0; i < 14; i++) {
      const x = I[0] + 16 + i * 25, y = I[1] + 126 - i * 1.1;
      bridge += Ln(x, y + 2, x, y + 18, '#05070A', 2) + `<g class="p2-bl">${glow(x, y - 3, 10, 7, 'gO', 0.9)}${Ci(x, y - 3, 2.2, '#FFE2B0')}${E(x, y + 24, 2, 8, '#FFE2B0', 'opacity=".35"')}</g>`;
    }
    bridge += rainFx(I, { op: 0.5, op2: 0.3 });
    s += pg.panel('b', I, bridge, { desc: 'Inset: the bridge to the mainland. Its lights go out one by one, in a line.' });
    pg.stop('a2', [40, 560, 700, 520], { move: 'glide' });
    pg.stop('a3', [306, 704, 130, 100], { move: 'creep', hold: 2000, lock: 2000 });
    pg.desc(extra ? 'Far out at the end of the jetty, a line of tiny figures walks single file off the end into the water. At the back of the line, one more, holding a glowing screen.' : 'Far out at the end of the jetty, a line of tiny figures walks single file off the end into the water.');
    // captions
    s += pg.cap({ p: 'a', x: 40, y: 50, text: 'Present day.', w: 300 });
    s += pg.cap({ p: 'a', x: 40, y: 110, text: 'Stocktake night. The bridge is closed. Nobody is going home.', w: 430 });
    // title lockup, styled like a status bar
    const tx = 500, ty = 1250;
    let t = `<g class="bl" data-p="a" style="--i:${pg.bal++}">`;
    t += R(70, ty - 150, 860, 230, 'rgba(10,12,16,.55)', 'rx="18"');
    for (let i = 0; i < 4; i++) t += R(110 + i * 26, ty - 34 - (i + 1) * 22, 18, (i + 1) * 22, 'none', st(C.y, 4, 'opacity=".8"'));
    t += `<text class="ft-x" x="${tx + 70}" y="${ty + 20}" font-size="200" text-anchor="middle" fill="${C.y}" stroke="${C.ink}" stroke-width="16" paint-order="stroke" letter-spacing="6">SOS ONLY</text>`;
    t += Tx(tx, ty + 62, 'AN OPTUS REDCLIFFE HORROR COMIC  ·  AN OG ORIGINAL', 22, '#E8E2D0', 'text-anchor="middle" letter-spacing="3"', FONTS.speech);
    t += '</g>';
    pg.lines.push({ who: 'TITLE', text: 'SOS ONLY — an Optus Redcliffe horror comic. An OG original.' });
    s += t;
    return s;
  },
  mount(ctx) {
    const layers = ctx.qa('.par');
    const k = [6, 14, 26];
    ctx.onPointer((nx, ny) => {
      if (ctx.reduced) return;
      layers.forEach((l, i) => { l.setAttribute('transform', `translate(${n(-nx * k[i])} ${n(-ny * k[i] * 0.5)})`); });
    });
    // the bridge goes dark, light by light, from the mainland end, over about twenty seconds
    const bl = ctx.qa('.p2-bl');
    if (ctx.reduced) bl.forEach((b, i) => { if (i > 6) b.style.opacity = 0.12; });
    else ctx.onPanel('b', () => bl.forEach((b, i) => ctx.after(((13 - i) * 1.4 + 1.5) * 1000, () => { b.style.transition = 'opacity .45s ease-in'; b.style.opacity = 0.1; })));
  },
});

/* ---------- Page 3 — Headcount ---------- */

// A hand counting on its fingers, Chloe's hoodie sleeve pulled down over it so only the fingers come out.
// fingers: how many of the four fingers are raised (index first). o: {thumb, mirror, skin, sleeve}
function handCount(x, y, sc, fingers, o = {}) {
  const skin = o.skin || CAST.chloe.skin, sleeve = o.sleeve || CAST.chloe.top, ks = shade(skin, -0.3);
  let g = '';
  [[-17, -8, 50], [-5, -2, 58], [7, 4, 54], [18, 10, 42]].forEach(([fx, fa, L], i) => {
    const up = i < fingers, h = up ? L : 12;
    g += `<g transform="translate(${fx} -40) rotate(${fa})">${R(-6.5, -h, 13, h + 8, skin, `rx="6.5" ${st(C.ink, 2.6)}`)}${up ? Ln(-3, -h * 0.55, 3, -h * 0.55, ks, 1.3) : ''}</g>`;
  });
  if (o.thumb) g += `<g transform="translate(-27 -26) rotate(-50)">${R(-6.5, -36, 13, 42, skin, `rx="6.5" ${st(C.ink, 2.6)}`)}${Ln(-3, -21, 3, -21, ks, 1.3)}</g>`;
  g += Pa('M-33 -26 C-34 -45 -22 -51 0 -51 C22 -51 33 -45 31 -26 L37 80 L-39 80 Z', sleeve, st(C.ink, 3));
  g += Pa('M-31 -33 C-12 -25 12 -25 30 -33', 'none', st(shade(sleeve, -0.32), 2)) + Pa('M-8 -20 L-12 40 M10 -18 L14 44', 'none', st(shade(sleeve, -0.25), 1.6));
  return `<g transform="translate(${n(x)} ${n(y)}) scale(${n(sc * (o.mirror ? -1 : 1))} ${n(sc)})">${g}</g>`;
}

// Zane's phone gimbal and ring light, for when it's in his other hand.
const p3Gimbal = (x, y, s, rot = 0) => `<g transform="translate(${n(x)} ${n(y)}) rotate(${rot}) scale(${n(s)})">${R(-3, -40, 6, 40, '#2A2B30', st(C.ink, 1.6))}${R(-11, -66, 22, 30, '#15161A', `rx="3" ${st(C.ink, 1.6)}`)}${R(-8, -63, 16, 24, '#CFE9F5', 'rx="1.5" class="lit"')}${Ci(0, -82, 11, 'none', `class="lit" ${st('#FFFFFF', 4)}`)}${Ci(0, -82, 11, 'none', st(C.ink, 1))}</g>`;

// Luka's stocktake clipboard, with this year's tick on it.
const p3Clip = (x, y, s, rot = 0, tick = true) => `<g transform="translate(${n(x)} ${n(y)}) rotate(${rot}) scale(${n(s)})">${R(-17, -22, 34, 44, '#9C7A4C', st(C.ink, 2.4))}${R(-13, -16, 26, 34, '#FAF8F0')}${R(-7, -26, 14, 7, '#9AA0A6', st(C.ink, 1.4))}${[-10, -4, 2, 8].map((yy) => Ln(-9, yy, 4, yy, '#8A8A8A', 1.2)).join('')}${tick ? Pa('M-2 10 l5 6 l11 -16', 'none', st(C.laser, 3.6)) : ''}</g>`;

const TAGS = {
  luka: 'Luka — 2IC. Didn’t ask for it.', chase: 'Chase — Casual. Makes music as “Pudding.”', luke: 'Luke — Fixes anything with a cable.',
  zee: 'Zee — #2 on the sales board. Hates being #2.', zane: 'Zane — Films everything.', chloe: 'Chloe — Notices things.',
};

page(3, {
  title: 'Headcount', side: 'right', gutter: 'white', bleed: 'store', status: 'bars',
  alt: 'The six staff gather in the closed store for stocktake. Luka counts six. Zane points out he didn’t count the Ollie standee. Chloe, quietly, counts seven.',
  sound: { hum: true, rain: true },
  render(pg) {
    const A = [40, 40, 920, 540], B = [40, 598, 450, 360], Cc = [508, 598, 452, 360], D = [40, 976, 920, 290], Eb = [40, 1284, 920, 176];
    const second = pg.second, guided = pg.mode === 'guided';
    const foot = A[1] + A[3] - 10;
    let s = '';

    // panel 1: the team in the closed store, stocktake gear everywhere
    let a = storeInterior(A, {
      day: true, night: 0.06, vx: 0.47, vy: 0.36, bw: 0.4, bh: 0.44, left: 'display', right: 'acc', vig: 0.45, flicker: 5,
      ollie: (bl, bt, bw, bh) => ollie({ x: bl + bw * 0.7, y: bt + bh * 0.99, s: bh / 600 }),
    });
    a += R(575, foot - 112, 84, 46, '#3D6FB0', st(C.ink, 3)) + R(575, foot - 112, 84, 11, '#5B8AC8', st(C.ink, 2)) + handsetBox(622, foot - 150, 38, 46, {});
    a += R(300, foot - 98, 76, 42, '#3D6FB0', st(C.ink, 3)) + R(300, foot - 98, 76, 10, '#5B8AC8', st(C.ink, 2)) + handsetBox(312, foot - 134, 32, 38, {});
    // Luka, then Chase; Zane between them and the others so the whole exchange sits on the left
    const P3 = [['luka', 110, false, 'talk', 'hold'], ['chase', 240, true, 'smirk', 'stand'], ['zane', 380, true, 'chat', 'film'], ['luke', 515, true, 'neutral', 'idle'], ['zee', 650, true, 'flat', 'holdOne'], ['chloe', 780, true, 'neutral', 'still']];
    const hd = {};
    for (const [w, x, fl, face, pose] of P3.slice().reverse()) {
      const o = {};
      a += fig(w, { x, y: foot, s: 0.72, flip: fl, face, pose, out: o, add: w === 'chase' ? ['laptop'] : [], look: w === 'chloe' ? [1, 0] : undefined });
      hd[w] = o.head;
    }
    // the dark corner beside the accessories wall, and someone standing in it, lit from below by a small screen.
    // It only exists when the screen is wide enough to show it (and, on a second read, always).
    const gid = uid('p3nook');
    const nook = `<linearGradient id="${gid}" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="${C.ink}" stop-opacity="0"/><stop offset=".5" stop-color="${C.ink}" stop-opacity=".82"/><stop offset="1" stop-color="${C.ink}" stop-opacity=".96"/></linearGradient>` +
      R(A[0] + A[2] - 170, A[1], 170, A[3], `url(#${gid})`) + readerFig({ x: 905, y: foot + 6, s: 0.62, device: 'phone' });
    a += second ? `<g class="p3-you">${nook}</g>` : `<g class="wide-only">${nook}</g>`;
    // the ghost seven: at the edge of the panel nearest the reader (inside what guided view shows)
    a += `<text class="ft-x ghost7" x="${guided && !second ? 818 : 930}" y="${guided && !second ? 178 : foot - 6}" font-size="74" fill="${C.y}" stroke="${C.ink}" stroke-width="6" paint-order="stroke" text-anchor="middle">7</text>`;
    s += pg.panel('a', A, a, {
      desc: 'Wide group shot: the team in the closed store with tubs, scanners and clipboards — Luka, Chase, Zane, Luke, Zee and Chloe. The Ollie standee stands by the roller door.' + (second ? ' In the dark corner at the far right, beside the accessories wall, someone is standing, lit from below by a small screen.' : ''),
      guided: [{ focus: [40, 40, 590, 540], move: 'cut' }],
    });
    pg.stop('a2', [40, 330, 440, 250]);
    pg.stop('a3', second ? [450, 40, 510, 540] : [450, 40, 400, 540]);
    if (second) pg.stop('a4', [800, 150, 170, 440], { move: 'creep', hold: 1500, lock: 1500 });
    pg.desc(`Name tags: ${Object.values(TAGS).join(' · ')}`);
    P3.forEach(([w, x], i) => { s += pg.cap({ p: x < 450 ? 'a2' : 'a3', x: x - 66, y: foot - (i % 2 ? 100 : 140), text: TAGS[w], w: 142, size: 16, who: false }); });
    s += pg.say({ p: 'a', x: 222, y: 128, w: 330, size: 26, text: 'Right. Roller door’s down, bridge is shut, nobody’s going anywhere till the count’s done.', who: 'LUKA', tail: [hd.luka[0] + 10, hd.luka[1] - 34] });
    s += pg.say({ p: 'a', x: 528, y: 100, w: 170, size: 27, text: 'Chat, we’re locked in. Stocky arc.', who: 'ZANE', tail: [hd.zane[0] + 10, hd.zane[1] - 34] });
    s += pg.say({ p: 'a', x: 132, y: 252, text: 'Stocky?', who: 'LUKA', tail: [hd.luka[0] + 4, hd.luka[1] - 30], size: 27 });
    s += pg.say({ p: 'a', x: 300, y: 270, w: 140, size: 25, text: 'Short for stocktake.', who: 'ZANE', tail: [hd.zane[0] - 10, hd.zane[1] - 24] });

    // panel 2: Luka counting — a number pops over each head
    let b = R(B[0], B[1], B[2], B[3], '#E5E1D6') + R(B[0], B[1], B[2], B[3], 'url(#ht1)', 'opacity=".25"') + R(B[0], B[1] + 280, B[2], 90, '#CFCBC0');
    const heads = [];
    [['zane', 120], ['zee', 200], ['luke', 280], ['chase', 360]].forEach(([w, dx]) => {
      const o = {};
      b += fig(w, { x: B[0] + dx, y: B[1] + 432, s: 0.78, view: 'front', face: w === 'zane' ? 'grin' : 'neutral', out: o });
      heads.push(o.head);
    });
    const oc = {}, ol2 = {};
    b += fig('chloe', { x: B[0] + 425, y: B[1] + 432, s: 0.76, view: 'front', face: 'hush', out: oc });
    heads.push(oc.head);
    b += fig('luka', { x: B[0] + 40, y: B[1] + 470, s: 1.15, pose: 'point', face: 'talk', props: ['lanyard'], arms: { na: [80, 70] }, light: 'side', so: 0.5, out: ol2 });
    heads.forEach((h, i) => { b += `<g class="pop-n" style="--n:${i}">${Ci(h[0], h[1] - 48, 17, C.y, st(C.ink, 3))}${Tx(h[0], h[1] - 40, String(i + 1), 24, C.ink, 'text-anchor="middle"', FONTS.sfx)}</g>`; });
    s += pg.panel('b', B, b, { desc: 'Luka points around the group, counting. A number pops up over each head.' });
    s += pg.say({ p: 'b', x: B[0] + 250, y: B[1] + 54, text: 'One, two, three, four, five—', who: 'LUKA', tail: [ol2.head[0] + 24, ol2.head[1] - 16], w: 310, size: 26 });

    // panel 3: "—six. Good." Zane jerks a thumb back at the standee by the door
    const C0 = Cc[0], C1 = Cc[1];
    let c = R(C0, C1, Cc[2], Cc[3], '#E9E6DE') + R(C0, C1, Cc[2], Cc[3], 'url(#ht1)', 'opacity=".18"');
    c += R(C0 + 236, C1 + 26, 216, 290, '#2A3440', st(C.ink, 3)) + rainFx([C0 + 236, C1 + 26, 216, 290], { op: 0.6 }) + R(C0 + 236, C1 + 26, 216, 290, '#6A6F77', 'opacity=".7"');
    for (let yy = C1 + 36; yy < C1 + 316; yy += 12) c += Ln(C0 + 236, yy, C0 + 452, yy, '#4E5259', 2);
    c += R(C0, C1 + 300, Cc[2], 70, '#D2CEC3') + Ln(C0, C1 + 300, C0 + Cc[2], C1 + 300, C.ink, 2.5);
    c += ollie({ x: C0 + 418, y: C1 + 338, s: 0.6, turn: -1 });
    const oz3 = {}, ok3 = {};
    c += fig('zane', { x: C0 + 296, y: C1 + 462, s: 0.8, flip: true, face: 'smirk', pose: 'point', arms: { na: [-30, -148], fa: [10, 40] }, props: [], out: oz3, light: 'side', so: 0.35 });
    c += p3Gimbal(oz3.fh[0], oz3.fh[1], 0.78, 6);
    if (second) {
      // second read: Luka's count reaches you. He turns and looks straight out of the panel.
      c += fig('luka', { x: C0 + 82, y: C1 + 462, s: 0.78, view: 'front', pose: 'holdOne', face: ['dot', 'flat', 'line'], props: ['lanyard', 'clipboard'], out: ok3, light: 'side', so: 0.45 });
    } else {
      // he taps his own chest, the clipboard in his other hand, this year's tick on it
      c += fig('luka', { x: C0 + 78, y: C1 + 462, s: 0.78, pose: 'point', face: 'neutral', props: ['lanyard'], arms: { na: [74, -66], fa: [10, 34] }, out: ok3, light: 'side', so: 0.45 });
      c += p3Clip(ok3.fh[0] + 6, ok3.fh[1] + 4, 1.0, -10);
    }
    s += pg.panel('c', Cc, c, { desc: second ? 'Luka ticks the clipboard — and keeps counting. He turns and looks straight out of the panel, at you. Zane jerks a thumb at the cardboard Ollie standee by the door.' : 'Luka taps his own chest and ticks the clipboard. Zane jerks a thumb back at the cardboard Ollie standee by the door.' });
    s += pg.say({ p: 'c', x: C0 + (second ? 78 : 100), y: C1 + (second ? 54 : 44), text: second ? '—six. …Seven.' : '—six. Good.', who: 'LUKA', tail: [ok3.head[0] - 14, ok3.head[1] - 22], w: second ? 110 : 170, size: 27, bend: 0 });
    s += pg.say({ p: 'c', x: C0 + 336, y: C1 + 58, text: 'You didn’t count Ollie.', who: 'ZANE', tail: [oz3.head[0] + 2, oz3.head[1] - 22], w: 170, size: 26 });
    s += pg.say({ p: 'c', x: C0 + (second ? 178 : 168), y: C1 + (second ? 150 : 140), text: 'Ollie’s cardboard, Zane.', who: 'LUKA', tail: [ok3.head[0] + 10, ok3.head[1] - 22], w: 150, size: 26 });

    // panel 4: why do we count people? — and Luka, silent
    const D0 = D[0], D1 = D[1];
    let d = R(D0, D1, 580, D[3], '#DCD8CD') + R(D0, D1, 580, D[3], 'url(#ht1)', 'opacity=".2"');
    const och = {}, oze = {};
    d += fig('chase', { x: D0 + 150, y: D1 + 630, s: 1.42, face: 'talk', add: ['laptop'], out: och, light: 'side', so: 0.35 });
    d += fig('zee', { x: D0 + 452, y: D1 + 624, s: 1.46, flip: true, face: 'flat', pose: 'holdOne', arms: { na: [30, 152] }, out: oze, light: 'side', so: 0.35 });
    d += R(D0 + 580, D1, 340, D[3], '#16222F') + R(D0 + 580, D1, 340, D[3], 'url(#htN)', 'opacity=".55"') + glow(D0 + 700, D1 + 130, 170, 150, 'gW', 0.12);
    d += fig('luka', { x: D0 + 752, y: D1 + 990, s: 2.7, view: 'front', face: ['lids', 'worried', 'line'], light: 'side', so: 0.72, props: ['lanyard'] });
    d += Ln(D0 + 580, D1, D0 + 580, D1 + D[3], C.ink, 6);
    s += pg.panel('d', D, d, {
      desc: 'Chase and Zee. Then Luka’s face, silent.',
      guided: [{ focus: [40, 976, 560, 290] }, { focus: [612, 976, 348, 290], move: 'cut', hold: 1200 }],
    });
    s += pg.say({ p: 'd', x: D0 + 180, y: D1 + 70, text: 'Why do we even count people? We know who’s here.', who: 'CHASE', tail: [och.head[0] + 14, och.head[1] - 44], w: 260, size: 26 });
    s += pg.say({ p: 'd', x: D0 + 440, y: D1 + 84, text: 'Because he lost one last year.', who: 'ZEE', tail: [oze.head[0] - 6, oze.head[1] - 44], w: 156, size: 26 });
    s += pg.say({ p: 'd', x: D0 + 862, y: D1 + 58, type: 'silence', who: false, tail: [D0 + 800, D1 + 118] });

    // panel 5: Chloe alone, recounting on her fingers — five, and two
    const E0 = Eb[0], E1 = Eb[1];
    let e = R(E0, E1, Eb[2], Eb[3], '#CFCBC1') + R(E0, E1, Eb[2], Eb[3], 'url(#ht2)', 'opacity=".22"');
    e += glow(E0 + 650, E1 + 90, 280, 130, 'gW', 0.3);
    const och5 = {};
    e += fig('chloe', { x: E0 + 660, y: E1 + 712, s: 2.1, view: 'front', face: 'hush', look: [1, -0.3], light: 'side', so: 0.45, props: [], out: och5 });
    e += handCount(E0 + 430, E1 + 178, 1.12, 4, { thumb: true });
    e += handCount(E0 + 536, E1 + 186, 1.12, 2, { mirror: true });
    s += pg.panel('e', Eb, e, {
      desc: 'Chloe, alone, looking slightly past us, recounting on her fingers: one hand open, two fingers on the other.',
      guided: [{ focus: [300, 1284, 400, 176] }],
    });
    pg.stop('e2', [520, 1284, 440, 176], { move: 'creep' });
    s += pg.say({ p: 'e2', x: E0 + 812, y: E1 + 72, type: 'whisper', text: '…seven.', who: 'CHLOE', tail: [och5.mouth[0] + 30, och5.mouth[1] - 2], w: 120 });
    return s;
  },
  mount(ctx) {
    ctx.onPanel('b', () => ctx.qa('.pop-n').forEach((x) => x.classList.add('on')), 900);
    // the ghost seven: linger six seconds on the group shot and a faint 7 pops at the edge, holds half a second, and is gone
    let onA = true;
    ctx.onPanel('b', () => { onA = false; });
    ctx.dwell(6000, () => {
      const g = ctx.q('.ghost7');
      if (!g || (ctx.mode === 'guided' && !onA)) return;
      g.classList.add('on');
      ctx.after(500, () => g.classList.remove('on'));
    });
  },
});
