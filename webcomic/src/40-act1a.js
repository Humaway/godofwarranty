/* SOS ONLY — pages 1–3: cold open, title splash, headcount. */

/* ---------- Page 1 — One Year Ago ---------- */

// The wide establishing shot. Drawn twice: panel 1 and its exact repeat in panel 5.
function p1Wide(pg, box, gone) {
  const [x, y, w, h] = box;
  let s = storeInterior(box, {
    vx: 0.55, vy: 0.4, bw: 0.4, bh: 0.48, night: 0.5, vig: 1, lights: [1, 0, 0, 1, 1, 0], flicker: 3, left: 'acc', right: 'display',
    litScreens: (i, j) => (gone && i === 2 && j === 1 ? '#FFE680' : false),
    ollie: (bl, bt, bw, bh) => ollie({ x: bl + bw * 0.8, y: bt + bh * 0.99, s: bh / 560, back: !gone, dark: true, flip: false, turn: gone ? -1 : 0 }),
  });
  // a pool of light where Jarrad works
  s += glow(x + w * 0.23, y + h * 0.68, w * 0.2, h * 0.16, 'gW', 0.18);
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
    s += pg.panel('a', A, p1Wide(pg, A, false), { desc: 'The store at night, from behind the counter. Half the lights are off. Rain on the front glass; the roller door is down. Jarrad kneels at the accessories wall with a scanner. The cardboard Ollie standee stands by the entrance, facing the street.' });
    s += pg.cap({ p: 'a', x: 62, y: 62, text: `Optus Redcliffe. One year ago. ${time}.`, w: 360 });

    // panel 2: Jarrad counting stock
    const out = {};
    let b = pegboard(B, { dark: true, seed: 'p1peg', rows: 3, cols: 4 });
    b += glow(B[0] + 200, B[1] - 20, 260, 120, 'gW', 0.35);
    b += R(B[0], B[1] + 300, B[2], 80, '#1E242B') + floorGrid([B[0], B[1] + 300, B[2], 70], B[0] + 190, B[1] + 240, { col: '#252C34', lineCol: '#323B45', rows: 4 });
    b += fig('jarrad', { x: B[0] + 250, y: B[1] + 352, s: 0.95, pose: 'kneel', flip: true, add: ['scanner'], face: 'talk', light: 'side', so: 0.55, out, arms: { na: [70, 92] } });
    const tgt = [B[0] + 54, B[1] + 236];
    b += `<g class="fx-sweep" style="transform-origin:${n(out.nh[0])}px ${n(out.nh[1])}px"><line x1="${n(out.nh[0] - 30)}" y1="${n(out.nh[1] - 6)}" x2="${n(tgt[0])}" y2="${n(tgt[1])}" stroke="${C.laser}" stroke-width="2.4"/>${glow(tgt[0], tgt[1], 26, 12, 'gR', 0.8)}</g>`;
    b += R(B[0], B[1], B[2], B[3], 'url(#gVig)', 'opacity=".7"');
    s += pg.panel('b', B, b, { desc: 'Jarrad on one knee at the accessories wall, scanner gun in hand, his 2IC lanyard swinging, a volleyball keyring on his belt loop.' });
    s += pg.say({ p: 'b', x: 180, y: 625, text: '…forty-one. Forty-two.', who: 'JARRAD', tail: [out.head[0] - 30, out.head[1] - 20], w: 210 });
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
    let d = R(D[0], D[1], D[2], D[3], '#101820') + R(D[0], D[1], D[2], D[3], 'url(#htN)', 'opacity=".6"');
    d += glow(D[0] + 120, D[1] + 160, 200, 200, 'gS', 0.35);
    d += fig('jarrad', { x: D[0] + 150, y: D[1] + 1060, s: 2.55, pose: 'phone', props: ['lanyard', 'phoneEar'], screen: '#CFF2FF', face: 'smile', light: 'side', so: 0.62, out: o4, flip: true });
    d += pg.say({ p: 'd', x: D[0] + 210, y: D[1] + 70, text: 'Optus Redcliffe, Jarrad speaking, how can I—', who: 'JARRAD', tail: [D[0] + 150, D[1] + 140], w: 300 });
    s += pg.panel('d', D, d, { desc: 'Close on Jarrad, phone to his ear, his habit-smile on. His sentence is cut off by the edge of the panel and never finishes.' });

    // panel 5: exact repeat of panel 1, one year's absence later
    s += pg.panel('e', Eb, p1Wide(pg, Eb, true), { desc: 'The same shot again. Jarrad is gone. The scanner lies on the floor, its red laser still on, pointing at nothing. His keyring is on the tiles. The demo phone lies face-up on the counter, showing a call timer. And the Ollie standee has turned around: it is facing the spot where Jarrad was.' });
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
  let s = R(-60, -60, 1120, 900, 'url(#gSky)');
  // the storm's interior, lit cold from inside by the lightning behind the jetty
  s += glow(250, 560, 420, 230, 'gW', 0.16) + glow(260, 600, 220, 120, 'gS', 0.18);
  // the anvil: a flat, towering top spreading across the sky
  s += Pa('M-60 120 C80 40 300 10 520 18 C760 26 940 60 1080 110 L1080 250 C900 230 700 260 520 250 C300 240 100 270 -60 300 Z', '#0C121A');
  s += Pa('M-60 120 C80 40 300 10 520 18 C760 26 940 60 1080 110', 'none', st('#2D3D4F', 4, 'opacity=".7"'));
  // cloud masses, each with a faint lit underside
  const masses = [[520, 300, 560, 120, '#131B26'], [260, 380, 380, 110, '#101823'], [790, 360, 360, 110, '#121A25'], [520, 450, 600, 90, '#0D131B'], [150, 250, 300, 90, '#18222E'], [880, 230, 280, 80, '#16202B']];
  for (let i = 0; i < 26; i++) {
    const cx = r.range(-40, 1040), cy = r.range(160, 470), rx = r.range(70, 180), ry = r.range(26, 60);
    masses.push([cx, cy, rx, ry, r.pick(['#1A2533', '#141D29', '#203042', '#0F161F'])]);
  }
  masses.sort((m1, m2) => m1[1] - m2[1]).forEach(([cx, cy, rx, ry, c]) => {
    s += E(cx, cy, rx, ry, c);
    s += Pa(`M${n(cx - rx * 0.8)} ${n(cy + ry * 0.55)}Q${n(cx)} ${n(cy + ry * 1.15)} ${n(cx + rx * 0.8)} ${n(cy + ry * 0.55)}`, 'none', st('#3E5267', 2.5, `opacity="${n(0.25 + r() * 0.35)}"`));
  });
  // mammatus pouches hanging under the cell
  for (let i = 0; i < 16; i++) { const cx = 120 + i * 52 + r.jit(14), cy = 490 + r.jit(12); s += E(cx, cy, 30, 20, '#121A24') + Pa(`M${cx - 24} ${cy + 10}Q${cx} ${cy + 26} ${cx + 24} ${cy + 10}`, 'none', st('#33465A', 2, 'opacity=".5"')); }
  // a resting bolt (the flash overlay brightens it)
  const bolt = 'M300 470 L292 530 L318 560 L300 620 L330 660 L322 720 L338 760';
  s += Pa(bolt, 'none', st('#BFD9FF', 10, 'opacity=".12"')) + Pa(bolt, 'none', st('#E8F2FF', 2.2, 'opacity=".55"')) + Pa('M318 560 L360 590 L372 640 M300 620 L268 650', 'none', st('#DCEBFF', 1.4, 'opacity=".4"'));
  // rain curtains hanging from the cell
  s += Po([[200, 480], [420, 480], [360, 760], [120, 760]], 'url(#hatchW)', 'opacity=".1"');
  s += Po([[600, 480], [880, 480], [830, 760], [560, 760]], 'url(#hatchW)', 'opacity=".08"');
  // the mainland, far off: a thin line of lights that will go out
  s += R(-60, 708, 1120, 14, '#141E28') + glow(820, 714, 260, 18, 'gO', 0.35);
  for (let i = 0; i < 24; i++) s += Ci(560 + i * 18 + r.jit(5), 712 + r.jit(2), 1.4, '#FFD9A8', `opacity="${n(0.4 + r() * 0.5)}"`);
  return s;
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
  // hidden detail: a single-file queue walking off the end of the jetty into the water
  let q = '';
  const N = 9 + (extra ? 1 : 0);
  for (let i = 0; i < N; i++) {
    const t = i / (N - 1);
    const x = lerp(352, 398, t), y = lerp(752, 760, t), sink = i > N - 4 ? (i - (N - 4)) * 3.2 : 0;
    const h = 14 - sink;
    q += `<g><rect x="${n(x - 2)}" y="${n(y - h)}" width="4" height="${n(h)}" fill="#05060A"/><circle cx="${n(x)}" cy="${n(y - h - 2)}" r="2.2" fill="#05060A"/></g>`;
    if (extra && i === 0) q += glow(x + 3, y - 9, 6, 6, 'gS', 0.9) + R(x + 1, y - 10, 3, 4, C.screen);
  }
  s += `<g class="p2-queue">${q}</g>`;
  // ripples where they go under
  s += E(400, 762, 10, 2, 'none', st('#4A6478', 1));
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
      guided: [
        { focus: [40, 1050, 920, 400], move: 'cut' },
        { focus: [40, 560, 700, 520], move: 'glide' },
        { focus: [300, 700, 140, 110], move: 'creep', hold: 2000, lock: 2000 },
      ],
    });
    // inset: the bridge to the mainland, lights going out in a line
    const I = [600, 70, 360, 200];
    let bridge = R(I[0], I[1], I[2], I[3], '#0B1018') + E(I[0] + 180, I[1] + 40, 260, 90, '#162030') + R(I[0], I[1] + 130, I[2], 70, '#0D1A26');
    bridge += Pa(`M${I[0] - 10} ${I[1] + 128}L${I[0] + 370} ${I[1] + 112}`, 'none', st('#05070A', 7));
    for (let i = 0; i < 14; i++) {
      const x = I[0] + 16 + i * 25, y = I[1] + 126 - i * 1.1;
      s += '';
      bridge += Ln(x, y + 2, x, y + 18, '#05070A', 2) + `<g class="p2-bl" style="animation-delay:${(13 - i) * 1.4 + 2}s">${glow(x, y - 3, 10, 7, 'gO', 0.9)}${Ci(x, y - 3, 2.2, '#FFE2B0')}${E(x, y + 24, 2, 8, '#FFE2B0', 'opacity=".35"')}</g>`;
    }
    bridge += rainFx(I, { op: 0.5, op2: 0.3 });
    s += pg.panel('b', I, bridge, { desc: 'Inset: the bridge to the mainland. Its lights go out one by one, in a line.' });
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
    if (ctx.reduced) ctx.qa('.p2-bl').forEach((b, i) => { if (i > 6) b.style.opacity = 0.15; });
  },
});

/* ---------- Page 3 — Headcount ---------- */

// A hand counting on its fingers (hoodie sleeve pulled over the wrist). up = fingers raised.
function handCount(x, y, sc, up, skin = '#EEC7A6', sleeve = '#6B7076') {
  let g = '';
  const fingers = [[-22, -2], [-8, -8], [6, -8], [19, -2]];
  fingers.forEach(([fx, fa], i) => {
    const raised = i < up;
    g += `<g transform="translate(${fx} -46) rotate(${fa + (raised ? 0 : 0)})">${R(-6.5, raised ? -50 : -18, 13, raised ? 54 : 22, skin, `rx="6.5" ${st(C.ink, 2.6)}`)}${raised ? Ln(-3, -36, 3, -36, shade(skin, -0.3), 1.2) : ''}</g>`;
  });
  g += Pa('M-30 -50 C-34 -20 -26 0 0 2 C24 0 32 -20 28 -50 Z', skin, st(C.ink, 2.8));
  g += `<g transform="translate(-30 -26) rotate(-40)">${R(-6, -26, 12, 30, skin, `rx="6" ${st(C.ink, 2.6)}`)}</g>`;
  g += Pa('M-36 -6 C-36 20 36 20 36 -6 L40 40 L-40 40 Z', sleeve, st(C.ink, 3));
  return `<g transform="translate(${n(x)} ${n(y)}) scale(${sc})">${g}</g>`;
}

const TAGS = {
  luka: 'Luka — 2IC. Didn’t ask for it.', chase: 'Chase — Casual. Makes music as “Pudding.”', luke: 'Luke — Fixes anything with a cable.',
  zee: 'Zee — #2 on the sales board. Hates being #2.', zane: 'Zane — Films everything.', chloe: 'Chloe — Notices things.',
};

page(3, {
  title: 'Headcount', side: 'right', gutter: 'white', bleed: 'store', status: 'bars',
  alt: 'The six staff gather in the closed store for stocktake. Luka counts six. Zane points out he didn’t count the Ollie standee. Chloe, quietly, counts seven.',
  sound: { hum: true, rain: true },
  render(pg) {
    const A = [40, 40, 920, 560], B = [40, 618, 450, 360], Cc = [508, 618, 452, 360], D = [40, 996, 920, 300], Eb = [40, 1314, 920, 146];
    let s = '';
    const second = pg.second;
    // panel 1: the team, stocktake gear everywhere
    let a = storeInterior(A, {
      day: true, night: 0.06, vx: 0.47, vy: 0.36, bw: 0.4, bh: 0.44, left: 'display', right: 'acc', vig: 0.45, flicker: 5,
      ollie: (bl, bt, bw, bh) => ollie({ x: bl + bw * 0.86, y: bt + bh * 0.99, s: bh / 600 }),
    });
    // tubs and boxes
    a += R(560, 470, 90, 50, '#3D6FB0', st(C.ink, 3)) + R(560, 470, 90, 12, '#5B8AC8', st(C.ink, 2)) + R(330, 486, 80, 44, '#3D6FB0', st(C.ink, 3)) + handsetBox(612, 430, 40, 50, {}) + handsetBox(340, 452, 34, 40, {});
    const P3 = [['luka', 110, false, 'talk', 'hold'], ['chase', 250, true, 'smirk', 'stand'], ['luke', 380, true, 'neutral', 'idle'], ['zee', 505, true, 'flat', 'holdOne'], ['zane', 640, true, 'chat', 'filmHigh'], ['chloe', 770, true, 'neutral', 'still']];
    const hd = {};
    for (const [w, x, fl, face, pose] of P3.slice().reverse()) {
      const o = {};
      a += fig(w, { x, y: 590, s: 0.72, flip: fl, face, pose, out: o, add: w === 'chase' ? ['laptop'] : [] });
      hd[w] = o.head;
    }
    // the silhouette that only exists when the screen is wide enough to show it
    a += `<g class="wide-only">${R(850, 140, 120, 460, C.ink, 'opacity=".55"')}${readerFig({ x: 910, y: 600, s: 0.6, device: 'phone' })}</g>`;
    a += `<text class="ft-x ghost7" x="930" y="580" font-size="70" fill="${C.y}" stroke="${C.ink}" stroke-width="6" paint-order="stroke" text-anchor="middle">7</text>`;
    s += pg.panel('a', A, a, {
      desc: 'Wide group shot: the team in the closed store with tubs, scanners and clipboards. Luka, Chase, Luke, Zee, Zane and Chloe. The Ollie standee stands by the roller door.',
      guided: [{ focus: second ? [40, 40, 920, 560] : [40, 40, 800, 560], move: 'cut' }].concat(second ? [{ focus: [800, 120, 170, 480], move: 'creep', hold: 1500 }] : []),
    });
    P3.forEach(([w, x], i) => { s += pg.cap({ p: 'a', x: x - 60, y: i % 2 ? 500 : 468, text: TAGS[w], w: 126, size: 13, who: false }); });
    s += pg.say({ p: 'a', x: 225, y: 128, w: 330, text: 'Right. Roller door’s down, bridge is shut, nobody’s going anywhere till the count’s done.', who: 'LUKA', tail: [hd.luka[0] + 6, hd.luka[1] - 30] });
    s += pg.say({ p: 'a', x: 545, y: 112, w: 200, text: 'Chat, we’re locked in. Stocky arc.', who: 'ZANE', tail: [hd.zane[0] - 10, hd.zane[1] - 34] });
    s += pg.say({ p: 'a', x: 150, y: 262, text: 'Stocky?', who: 'LUKA', tail: [hd.luka[0], hd.luka[1] - 30], w: 110 });
    s += pg.say({ p: 'a', x: 775, y: 175, text: 'Short for stocktake.', who: 'ZANE', tail: [hd.zane[0] + 10, hd.zane[1] - 30], w: 150 });

    // panel 2: Luka counting — a number pops over each head
    let b = R(B[0], B[1], B[2], B[3], '#E5E1D6') + R(B[0], B[1], B[2], B[3], 'url(#ht1)', 'opacity=".25"') + R(B[0], B[1] + 280, B[2], 90, '#CFCBC0');
    const heads = [];
    [['zane', 120], ['zee', 200], ['luke', 280], ['chase', 360]].forEach(([w, dx], i) => {
      const o = {};
      b += fig(w, { x: B[0] + dx, y: B[1] + 400, s: 0.78, view: 'front', face: w === 'zane' ? 'grin' : 'neutral', out: o, props: w === 'zane' ? [] : undefined });
      heads.push(o.head);
    });
    const oc = {};
    b += fig('chloe', { x: B[0] + 425, y: B[1] + 400, s: 0.76, view: 'front', face: 'hush', out: oc });
    heads.push(oc.head);
    b += fig('luka', { x: B[0] + 40, y: B[1] + 470, s: 1.15, pose: 'point', face: 'neutral', props: ['lanyard'], arms: { na: [80, 70] }, light: 'side', so: 0.5 });
    heads.forEach((h, i) => { b += `<g class="pop-n" style="--n:${i}">${Ci(h[0], h[1] - 48, 17, C.y, st(C.ink, 3))}${Tx(h[0], h[1] - 40, String(i + 1), 24, C.ink, 'text-anchor="middle"', FONTS.sfx)}</g>`; });
    s += pg.panel('b', B, b, { desc: 'Luka points around the group, counting. A number pops up over each head.' });
    s += pg.say({ p: 'b', x: 200, y: 664, text: 'One, two, three, four, five—', who: 'LUKA', tail: [96, 780], w: 300, size: 26 });

    // panel 3: "six. Good." — and Ollie, by the door
    let c = R(Cc[0], Cc[1], Cc[2], Cc[3], '#E9E6DE');
    c += R(Cc[0] + 250, Cc[1] + 30, 200, 300, '#2A3440', st(C.ink, 3)) + rainFx([Cc[0] + 250, Cc[1] + 30, 200, 300], { op: 0.6 }) + R(Cc[0] + 250, Cc[1] + 30, 200, 300, '#6A6F77', 'opacity=".7"');
    for (let yy = Cc[1] + 40; yy < Cc[1] + 330; yy += 12) c += Ln(Cc[0] + 250, yy, Cc[0] + 450, yy, '#4E5259', 2);
    c += R(Cc[0], Cc[1] + 300, Cc[2], 70, '#D2CEC3');
    c += ollie({ x: Cc[0] + 360, y: Cc[1] + 345, s: 0.85, turn: -1 });
    c += fig('zane', { x: Cc[0] + 210, y: Cc[1] + 420, s: 0.9, flip: true, face: 'smirk', arms: { na: [-60, -20] }, props: ['gimbal'] });
    c += fig('luka', { x: Cc[0] + 70, y: Cc[1] + 470, s: 1.12, pose: 'tapChest', face: 'flat', props: ['lanyard', 'clipboard'], arms: { fa: [30, 110] } });
    c += Pa(`M${Cc[0] + 108} ${Cc[1] + 236}l8 10l16 -22`, 'none', st(C.laser, 5));
    s += pg.panel('c', Cc, c, { desc: 'Luka taps his own chest and ticks the clipboard. Zane jerks a thumb at the cardboard Ollie standee by the door.' });
    s += pg.say({ p: 'c', x: 590, y: 668, text: second ? '—six. …Seven.' : '—six. Good.', who: 'LUKA', tail: second ? [990, 900] : [570, 770], w: 150 });
    s += pg.say({ p: 'c', x: 836, y: 700, text: 'You didn’t count Ollie.', who: 'ZANE', tail: [728, 780], w: 120, size: 26 });
    s += pg.say({ p: 'c', x: 610, y: 935, text: 'Ollie’s cardboard, Zane.', who: 'LUKA', tail: [590, 870], w: 200 });

    // panel 4: why do we count people?
    let d = R(D[0], D[1], D[2], D[3], '#DCD8CD') + R(D[0], D[1], D[2], D[3], 'url(#ht1)', 'opacity=".2"');
    d += fig('chase', { x: D[0] + 100, y: D[1] + 570, s: 1.25, face: 'talk', add: ['laptop'] });
    d += fig('zee', { x: D[0] + 470, y: D[1] + 580, s: 1.25, flip: true, face: 'flat', pose: 'holdOne' });
    d += R(D[0] + 580, D[1], 340, D[3], '#1B2A3A') + R(D[0] + 580, D[1], 340, D[3], 'url(#htN)', 'opacity=".5"');
    d += fig('luka', { x: D[0] + 740, y: D[1] + 980, s: 2.7, view: 'front', face: 'flat', light: 'side', so: 0.7, props: ['lanyard'] });
    d += Ln(D[0] + 580, D[1], D[0] + 580, D[1] + D[3], C.ink, 6);
    s += pg.panel('d', D, d, { desc: 'Chase and Zee. Then Luka’s face, silent.' });
    s += pg.say({ p: 'd', x: 215, y: 1062, text: 'Why do we even count people? We know who’s here.', who: 'CHASE', tail: [175, 1150], w: 280, size: 27 });
    s += pg.say({ p: 'd', x: 450, y: 1066, text: 'Because he lost one last year.', who: 'ZEE', tail: [500, 1150], w: 180, size: 27 });
    s += pg.say({ p: 'd', x: 860, y: 1050, type: 'silence', who: false, tail: [800, 1110] });

    // panel 5: Chloe alone, recounting on her fingers
    let e = R(Eb[0], Eb[1], Eb[2], Eb[3], '#CFCBC1') + R(Eb[0], Eb[1], Eb[2], Eb[3], 'url(#ht2)', 'opacity=".22"');
    e += fig('chloe', { x: Eb[0] + 640, y: Eb[1] + 690, s: 2.1, face: 'hush', look: [1, 0], light: 'side', so: 0.5, no: [], props: [] });
    // fingers, counting
    e += handCount(Eb[0] + 450, Eb[1] + 150, 1.05, 3);
    s += pg.panel('e', Eb, e, { desc: 'Chloe, alone, looking slightly past us, recounting on her fingers.' });
    s += pg.say({ p: 'e', x: 230, y: 1388, type: 'whisper', text: '…seven.', who: 'CHLOE', tail: [560, 1380], w: 120 });
    return s;
  },
  mount(ctx) {
    ctx.onPanel('b', () => ctx.qa('.pop-n').forEach((x) => x.classList.add('on')), 900);
    // the ghost seven: linger and a faint 7 appears at the edge nearest the reader, then is gone
    ctx.dwell(6000, () => {
      const g = ctx.q('.ghost7');
      if (!g) return;
      g.classList.add('on');
      ctx.after(500, () => g.classList.remove('on'));
    });
  },
});
