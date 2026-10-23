/* SOS ONLY — pages 4–5: the board, SOS only. */

/* ---------- Page 4 — The Board ---------- */

const crown = (x, y, s = 1, col = C.y) => `<path d="M${n(x - 9 * s)} ${n(y + 6 * s)}L${n(x - 10 * s)} ${n(y - 6 * s)}L${n(x - 4 * s)} ${n(y)}L${n(x)} ${n(y - 9 * s)}L${n(x + 4 * s)} ${n(y)}L${n(x + 10 * s)} ${n(y - 6 * s)}L${n(x + 9 * s)} ${n(y + 6 * s)}Z" fill="${col}" stroke="${C.ink}" stroke-width="${n(1.4 * s)}" stroke-linejoin="round"/>`;

// The BEST OF THE MONTH wall monitor. o: {sales, glow, skew}
function leaderboard(x, y, w, h, o = {}) {
  const d = new Date();
  const when = `3:00 AM · ${d.getDate()} ${d.toLocaleString(undefined, { month: 'short' })}`;
  const k = w / 600;
  let s = R(x - 10 * k, y - 10 * k, w + 20 * k, h + 20 * k, '#141518', `rx="${8 * k}" ${st(C.ink, 3)}`);
  s += R(x, y, w, h, '#F4F2EA', 'class="lit"');
  s += R(x, y, w, h * 0.13, C.y) + Tx(x + w / 2, y + h * 0.095, 'BEST OF THE MONTH', h * 0.07, C.ink, 'text-anchor="middle" letter-spacing="2"', FONTS.ui);
  // rank 1: Jarrad — photo, crowns, the total that keeps climbing
  const px = x + w * 0.04, py = y + h * 0.18, pw = w * 0.24, ph = h * 0.48;
  const cid = uid('lb');
  s += `<clipPath id="${cid}"><rect x="${n(px)}" y="${n(py)}" width="${n(pw)}" height="${n(ph)}"/></clipPath>`;
  s += R(px, py, pw, ph, '#BFD4E6') + `<g clip-path="url(#${cid})">${fig('jarrad', { x: px + pw / 2, y: py + ph * 2.35, s: ph / 150, view: 'front', face: 'grin', light: 'none', props: ['lanyard'] })}</g>` + R(px, py, pw, ph, 'none', st(C.ink, 2.5));
  s += Tx(px + pw + w * 0.04, py + h * 0.1, '#1  JARRAD', h * 0.085, C.ink, '', FONTS.ui);
  s += `<text class="ft-m p4-sales" x="${n(px + pw + w * 0.04)}" y="${n(py + h * 0.26)}" font-size="${n(h * 0.15)}" fill="${C.ink}">${o.sales || 287}</text>`;
  s += Tx(px + pw + w * 0.04 + h * 0.36, py + h * 0.25, 'SALES', h * 0.05, '#555', '', FONTS.ui);
  for (let i = 0; i < 12; i++) s += crown(px + pw + w * 0.07 + i * w * 0.052, py + h * 0.36, k * 1.15);
  s += Tx(px + pw + w * 0.04, py + h * 0.46, `Last sale: ${when}`, h * 0.045, '#444', '', FONTS.mono);
  s += `<g class="sale-toast">${R(px + pw + w * 0.36, py + h * 0.17, w * 0.2, h * 0.08, '#2BB673', `rx="${h * 0.04}"`)}${Tx(px + pw + w * 0.46, py + h * 0.23, 'SALE ✓', h * 0.05, '#FFFFFF', 'text-anchor="middle"', FONTS.ui)}</g>`;
  // the rest of the board
  const rows = [['#2  ZEE', '271'], ['#3  CHASE', '198'], ['#4  LUKA', '164'], ['#5  ZANE', '9']];
  rows.forEach(([nm, v], i) => {
    const ry = y + h * (0.72 + i * 0.065);
    s += R(x + w * 0.04, ry - h * 0.045, w * 0.92, h * 0.058, i % 2 ? '#ECE9E0' : '#E3E0D6');
    s += Tx(x + w * 0.06, ry, nm, h * 0.045, C.ink, '', FONTS.ui) + Tx(x + w * 0.9, ry, v, h * 0.05, C.ink, 'text-anchor="end"', FONTS.mono);
  });
  if (o.glow) s = glow(x + w / 2, y + h / 2, w * 0.8, h * 0.9, 'gW', o.glow) + s;
  return s;
}

page(4, {
  title: 'The Board', side: 'left', gutter: 'white', bleed: 'store', status: 'bars',
  alt: 'In the back office, the sales board still shows Jarrad at number one, a year after he vanished. Every one of his sales is logged at 3 a.m. under his login. Luka has been deleting them. A memory: Jarrad at the roller door, telling Luka to go home. Luka left at 2:40. He was 2IC by Monday.',
  sound: { hum: true },
  render(pg) {
    const A = [40, 40, 920, 420], B = [40, 478, 300, 400], Cc = [358, 478, 602, 400], D = [40, 896, 440, 250], Eb = [498, 896, 462, 250], F = [40, 1164, 920, 296];
    const sales = Save.d.jarradSales || 287;
    let s = '';
    // panel 1: the board
    let a = R(A[0], A[1], A[2], A[3], '#D9D5CA') + R(A[0], A[1], A[2], A[3], 'url(#ht1)', 'opacity=".25"');
    a += R(A[0], A[1] + 330, A[2], 100, '#BDB8AC') + Ln(A[0], A[1] + 330, A[0] + A[2], A[1] + 330, C.ink, 3);
    a += R(A[0] + 40, A[1] + 120, 90, 210, '#A9A496', st(C.ink, 3)) + Ci(A[0] + 116, A[1] + 230, 5, '#777');
    a += leaderboard(A[0] + 272, A[1] + 26, 466, 270, { sales, glow: 0.25 });
    const oz = {}, on = {};
    a += fig('zee', { x: A[0] + 222, y: A[1] + 640, s: 1.2, face: 'angry', pose: 'holdOne', out: oz, light: 'side', so: 0.45 });
    a += fig('zane', { x: A[0] + 834, y: A[1] + 656, s: 1.2, flip: true, face: 'grin', pose: 'film', out: on, light: 'side', so: 0.45 });
    s += pg.panel('a', A, a, {
      desc: 'The back office. A wall monitor: BEST OF THE MONTH — JARRAD, his photo grinning, twelve crowns in a row. Zee is second.',
      guided: [{ focus: [40, 40, 560, 420] }, { focus: [400, 40, 560, 420] }],
    });
    s += pg.say({ p: 'a', x: 160, y: 140, w: 200, size: 25, text: 'He quit a year ago. A YEAR. How is he still beating me?', who: 'ZEE', tail: [oz.head[0] + 4, oz.head[1] - 40] });
    s += pg.say({ p: 'a', x: 872, y: 150, w: 140, size: 24, text: 'Ghost of Jarrad still smashing target. Respect.', who: 'ZANE', tail: [on.head[0] - 4, on.head[1] - 40] });

    // panel 2: Optus Water Solutions
    const B0 = B[0], B1 = B[1];
    let b = R(B0, B1, B[2], B[3], '#E6E2D8') + R(B0, B1, B[2], B[3], 'url(#ht1)', 'opacity=".18"');
    b += R(B0, B1 + 340, B[2], 70, '#C9C4B8') + Ln(B0, B1 + 340, B0 + B[2], B1 + 340, C.ink, 2.5);
    b += ollie({ x: B0 + 262, y: B1 + 365, s: 0.62, turn: -1 });
    b += R(B0 + 50, B1 + 362, 240, 22, '#A07A4A', st(C.ink, 3)) + Ln(B0 + 50, B1 + 373, B0 + 290, B1 + 373, '#7A5A34', 2);
    for (let j = 0; j < 2; j++) for (let i = 0; i < 4; i++) {
      const bx = B0 + 54 + i * 58, by = B1 + 314 - j * 50;
      b += R(bx, by, 56, 48, '#D9EAF2', st(C.ink, 2)) + [0, 1, 2].map((k) => R(bx + 5 + k * 17, by + 6, 12, 36, '#9FC9DE', 'rx="4" opacity=".8"') + R(bx + 7 + k * 17, by + 2, 8, 6, '#2E6FA8', 'rx="2"')).join('');
    }
    b += R(B0 + 52, B1 + 262, 236, 100, '#FFFFFF', 'opacity=".18"') + Pa(`M${B0 + 60} ${B1 + 268}L${B0 + 110} ${B1 + 358}M${B0 + 210} ${B1 + 266}L${B0 + 250} ${B1 + 356}`, 'none', st('#FFFFFF', 2, 'opacity=".5"'));
    // the sign, in Luka's handwriting, taped to the shrink-wrap
    const signL = ['OFFER EVERY CUSTOMER WATER.', 'EVERY CUSTOMER. EVERY TIME.', '(IT’S ON THE QA SHEET) — L'];
    const signSz = Math.min(15, 192 / Math.max(...signL.map((l) => textW(l, 1))));
    b += `<g transform="rotate(-4 ${B0 + 170} ${B1 + 296})">${R(B0 + 66, B1 + 252, 208, 90, '#FFFDF2', st(C.ink, 2))}${R(B0 + 148, B1 + 245, 44, 14, '#E8E1C8', 'opacity=".9"')}` +
      textLines(signL, B0 + 170, B1 + 286, signSz, '#1E3A8A', {}) + '</g>';
    b += R(B0 + 86, B1 + 330, 170, 20, '#FFFFFF', st(C.ink, 1.5)) + Tx(B0 + 171, B1 + 345, 'OPTUS WATER SOLUTIONS', 12.5, C.ink, 'text-anchor="middle"', FONTS.mono);
    // Zane, off panel, pointing at the label
    b += limb([[B0 - 20, B1 + 410], [B0 + 30, B1 + 372], [B0 + 74, B1 + 346]], CAST.zane.skin, 13, 3) + limb([[B0 - 20, B1 + 410], [B0 + 14, B1 + 384]], C.navy, 19, 3) + limb([[B0 + 74, B1 + 346], [B0 + 90, B1 + 340]], CAST.zane.skin, 5, 2.6) + Ci(B0 + 74, B1 + 346, 9, CAST.zane.skin, st(C.ink, 3));
    s += pg.panel('b', B, b, { desc: 'By the door, a pallet of bottled water for customers. Taped to the shrink-wrap, a sign in Luka’s handwriting: Offer every customer water. Every customer. Every time. (It’s on the QA sheet) — L. Zane’s hand comes in from the side, pointing at the pallet label.' });
    s += pg.say({ p: 'b', x: B0 + 96, y: B1 + 52, text: 'Optus Water Solutions.', who: 'ZANE', tail: [B0 + 6, B1 + 112], w: 130, size: 22 });
    s += pg.say({ p: 'b', x: B0 + 232, y: B1 + 106, text: 'It’s literally just water.', who: 'CHASE', tail: [B0 + 288, B1 + 190], w: 96, size: 22 });
    s += pg.say({ p: 'b', x: B0 + 108, y: B1 + 184, text: 'Optus Water Solutions. Short for water.', who: 'ZANE', tail: [B0 + 6, B1 + 250], w: 176, size: 22 });

    // panel 3: the logs — and the rot in them. Luke behind the laptop, lit by it; the screen enlarged beside him.
    const K0 = Cc[0], K1 = Cc[1];
    let c = R(K0, K1, Cc[2], Cc[3], '#CFCAC0') + R(K0, K1, Cc[2], Cc[3], 'url(#ht1)', 'opacity=".18"');
    c += R(K0 + 20, K1 + 40, 120, 160, '#BDB7A9', st(C.ink, 2.5)) + R(K0 + 30, K1 + 52, 100, 6, '#9C9688') + R(K0 + 30, K1 + 120, 100, 6, '#9C9688');
    const ol = {};
    c += glow(K0 + 160, K1 + 330, 150, 90, 'gS', 0.45);
    c += fig('luke', { x: K0 + 158, y: K1 + 684, s: 1.16, view: 'front', pose: 'idle', face: ['dot', 'flat', 'flat'], look: [0.6, 0.4], out: ol, light: 'under', so: 0.5 });
    c += R(K0, K1 + 372, Cc[2], 40, '#8A7660', st(C.ink, 3));
    // the laptop, from behind: the lid, its glow on his face
    c += Po([[K0 + 64, K1 + 376], [K0 + 256, K1 + 376], [K0 + 246, K1 + 336], [K0 + 74, K1 + 336]], '#3A3E46', st(C.ink, 3)) + E(K0 + 160, K1 + 356, 10, 7, '#8B9098');
    // the inset screen
    const I = [K0 + 322, K1 + 24, 262, 206];
    let scr = R(I[0], I[1], I[2], I[3], '#F2F5F7');
    const logs = ['03:00:00 SALE JGAUNT 5G PLAN', '03:00:00 SALE JGAUNT HANDSET', '03:00:00 SALE JGAUNT 5G PLAN', '03:00:00 SALE JGAUNT WATER x1', '03:00:00 SALE JGAUNT 5G PLAN', '03:00:00 LOGIN JGAUNT OK', '03:00:00 SALE JGAUNT ??????'];
    logs.forEach((l, i) => { scr += rotLine(I[0] + 10, I[1] + 28 + i * 26, l, 17, i < 3 ? 0.04 : i === 5 ? 0 : 0.32, `p4log${i}`, { fill: i === 5 ? '#B3121F' : '#2C3540' }); });
    scr += R(I[0] + 5, I[1] + 141, I[2] - 10, 23, 'none', st('#B3121F', 2, 'stroke-dasharray="5 4"'));
    scr += rotPatch({ x: I[0] + I[2], y: I[1], box: I, reach: 200, count: 60, size: 14, seed: 'p4rotA', grow: 14 });
    scr += rotPatch({ x: I[0], y: I[1] + I[3], box: I, reach: 140, count: 36, size: 12, seed: 'p4rotB', grow: 18, delay: 2 });
    c += `<g>${R(I[0] - 6, I[1] - 6, I[2] + 12, I[3] + 12, '#FFFFFF', st(C.ink, 5))}${scr}</g>`;
    s += pg.panel('c', Cc, c, {
      desc: 'Luke behind the laptop, lit by it, scrolling the sales logs. Inset, the screen: half the log has decayed — characters slumped and dripping into blotches of glyph-mould, creeping in from the corners. One line is clean: LOGIN JGAUNT OK.',
      guided: [{ focus: [358, 478, 330, 400] }],
    });
    pg.stop('c2', [I[0] - 14, I[1] - 14, I[2] + 28, 380], { move: 'glide' });
    s += pg.say({ p: 'c', x: K0 + 150, y: K1 + 54, text: 'Every sale’s logged at three a.m. On the dot. Under his login.', who: 'LUKE', tail: [K0 + 290, K1 + 122], w: 250, size: 23, bend: 0.3 });
    s += pg.say({ p: 'c', x: K0 + 152, y: K1 + 172, text: 'Half the log’s rotted, too. Code rot. JARVIS has code in it older than all of us, and nobody maintains it.', who: 'LUKE', tail: [ol.head[0] + 14, ol.head[1] - 40], w: 268, size: 21 });
    s += pg.say({ p: 'c2', x: K0 + 462, y: K1 + 318, text: 'But that bit’s not rot. That’s somebody signing in.', who: 'LUKE', tail: [ol.head[0] + 34, ol.head[1] - 2], w: 230, size: 23 });

    // panel 4: "I'll delete them."
    const D0 = D[0], D1 = D[1];
    let d = R(D0, D1, D[2], D[3], '#DCD8CD') + R(D0, D1, D[2], D[3], 'url(#ht1)', 'opacity=".18"');
    const ok = {}, oz2 = {};
    d += fig('luka', { x: D0 + 112, y: D1 + 560, s: 1.25, face: 'flat', out: ok, light: 'side', so: 0.5, props: ['lanyard'] });
    d += fig('zee', { x: D0 + 336, y: D1 + 552, s: 1.3, flip: true, face: 'shock', out: oz2, pose: 'holdOne', arms: { na: [30, 150] }, light: 'side', so: 0.4 });
    s += pg.panel('d', D, d, { desc: 'Luka, flat. Zee, turning on him.' });
    s += pg.say({ p: 'd', x: D0 + 118, y: D1 + 50, text: 'It’s a glitch. I’ll delete them.', who: 'LUKA', tail: [ok.head[0] + 10, ok.head[1] - 34], w: 196, size: 25 });
    s += pg.say({ p: 'd', x: D0 + 330, y: D1 + 70, text: 'You’ve been deleting them?', who: 'ZEE', tail: [oz2.head[0] - 4, oz2.head[1] - 34], w: 170, size: 25 });

    // panel 5: memory — a year ago, at the roller door
    let e = R(Eb[0], Eb[1], Eb[2], Eb[3], '#9A968C');
    e += R(Eb[0] + 40, Eb[1] - 10, 380, 260, '#5A5E66');
    for (let yy = Eb[1]; yy < Eb[1] + 120; yy += 12) e += Ln(Eb[0] + 40, yy, Eb[0] + 420, yy, '#43464C', 2);
    e += R(Eb[0] + 40, Eb[1] + 112, 380, 10, '#2E3137');
    const oj = {};
    e += fig('jarrad', { x: Eb[0] + 240, y: Eb[1] + 534, s: 1.12, view: 'front', face: 'smile', pose: 'holdOne', farms: { r: [58, 192] }, out: oj, light: 'side', so: 0.35, props: ['lanyard'] });
    // the store keys held up, the volleyball keyring swinging under them
    e += `<g transform="translate(${n(oj.nh[0] + 2)} ${n(oj.nh[1] + 4)}) scale(1.5)">${Ci(0, 4, 7, 'none', st('#C9CDD2', 2.6))}${Pa('M-2 10 l-6 18 l4 1 l1 -3 l2 1 l1 -3 M3 10 l7 16 l4 -2 M5 15 l3 7', 'none', st('#C9CDD2', 2.8))}${Ln(1, 11, 1, 24, '#888', 1.4)}<g transform="translate(1 31)">${Ci(0, 0, 7, '#FFFFFF', st(C.ink, 1.6))}${Pa('M-6 -2.5Q0 2 6 -2.5M-4.5 4.5Q0 -2 1.8 -7', 'none', st('#1E5AA8', 1.2))}</g></g>`;
    e += R(Eb[0], Eb[1], Eb[2], Eb[3], 'url(#grain)', 'class="fx-flicker2" opacity=".9"') + R(Eb[0], Eb[1], Eb[2], Eb[3], 'url(#ht2)', 'opacity=".25"');
    s += pg.panel('e', Eb, `<g filter="url(#fGrey)">${e}</g>`, { desc: 'A memory, in grey: a year ago, Jarrad at the roller door, keys in hand, smiling.', path: raggedRect(Eb[0], Eb[1], Eb[2], Eb[3], 'p4mem', 3), sw: 8 });
    s += pg.say({ p: 'e', x: Eb[0] + 120, y: Eb[1] + 60, text: 'You go, mate. I’ll lock up.', who: 'JARRAD', tail: [oj.head[0] - 20, oj.head[1] - 10], w: 160, size: 26 });
    s += pg.cap({ p: 'e', x: Eb[0] + 18, y: Eb[1] + Eb[3] - 16, bottom: true, text: 'Luka left at 2:40.', w: 220, style: 'memory' });

    // panel 6: Luka alone at the monitor
    let f = R(F[0], F[1], F[2], F[3], '#1B2530') + R(F[0], F[1], F[2], F[3], 'url(#htN)', 'opacity=".4"');
    f += leaderboard(F[0] + 470, F[1] + 26, 420, 240, { sales, glow: 0.5 });
    f += glow(F[0] + 340, F[1] + 160, 300, 200, 'gS', 0.25);
    f += fig('luka', { x: F[0] + 300, y: F[1] + 690, s: 1.7, pose: 'mouth', face: 'sad', light: 'front', so: 0.75, props: ['lanyard'] });
    s += pg.panel('f', F, f, { desc: 'Present. Luka alone at the monitor, his hand over his mouth.' });
    s += pg.cap({ p: 'f', x: 64, y: 1430, bottom: true, text: 'He was 2IC by Monday. There was no one else.', w: 330 });
    return s;
  },
  mount(ctx) {
    // Jarrad never stops hitting target: +1 every ~9 seconds, saved across reads
    const totals = ctx.qa('.p4-sales'), toasts = ctx.qa('.sale-toast');
    ctx.every(9000, () => {
      ctx.save.jarradSales = (ctx.save.jarradSales || 287) + 1;
      ctx.persist();
      totals.forEach((t) => { t.textContent = ctx.save.jarradSales; });
      toasts.forEach((t) => { t.classList.remove('on'); void t.getBBox(); t.classList.add('on'); });
      ctx.sfx('beep', { v: 0.4 });
    });
  },
});

/* ---------- Page 5 — SOS Only ---------- */

// Close-up of a status bar on a device, switching from bars to SOS when its trigger fires.
function statusInsert(x, y, w, from, cls, o = {}) {
  const sc = w / 62;
  const a = signalGlyph(x, y, sc, from, o.col || C.ink);
  const b = signalGlyph(x, y, sc, o.to || 'sos', o.to === '3g' ? o.col || C.ink : o.sosCol || '#B3121F');
  return swap(a, b, cls);
}

page(5, {
  title: 'SOS Only', side: 'right', gutter: 'whitegrey', bleed: 'grey', status: 'bars',
  alt: 'At 11:47 PM the music cuts out mid-chorus and every device in the store drops to SOS only. Across the walkway, closed-up Cafe 63 switches its lights on by itself, and its coffee machine starts. Then every demo phone on the wall — none of them with a SIM — starts ringing at once.',
  sound: { hum: true, rain: true, store: true },
  render(pg) {
    const A = [40, 40, 920, 290];
    const gx = [40, 352.5, 665], gw = 295, r1 = 348, r2 = 606, gh = 240;
    const ex = [40, 308, 736], ew = [250, 410, 224], gh2 = 334;
    const H8 = [40, 958, 920, 502];
    let s = '';
    // 1: the ceiling speaker, music spilling out
    let a = R(A[0], A[1], A[2], A[3], '#D7D3C8') + R(A[0], A[1], A[2], 60, '#C2BEB2');
    a += fluoro(A[0] + 600, A[1] + 30, 200, { cone: false });
    a += Ci(A[0] + 470, A[1] + 70, 46, '#EDEAE2', st(C.ink, 4)) + Ci(A[0] + 470, A[1] + 70, 34, 'url(#ht2)') + Ci(A[0] + 470, A[1] + 70, 34, 'none', st(C.ink, 2));
    a += notesFx(A[0] + 470, A[1] + 110, { count: 9, dx: 300, dy: 90, seed: 'p5n', cls: 'p5-notes' }) + notesFx(A[0] + 470, A[1] + 110, { count: 6, dx: -320, dy: 80, seed: 'p5m', cls: 'p5-notes' });
    s += pg.panel('a', A, a, { desc: 'A ceiling speaker, music notes spilling out of it.', guided: [{ focus: [40, 40, 530, 290] }, { focus: [522, 40, 438, 290] }] });
    s += pg.cap({ p: 'a', x: 58, y: 56, text: '11:46 PM.', w: 160 });
    s += pg.say({ p: 'a', x: 150, y: 165, text: 'Can we PLEASE put Kanye on.', who: 'ZANE', tail: [80, 330], w: 170, size: 26 });
    s += pg.say({ p: 'a', x: 370, y: 248, text: 'Bon Jovi’s better than Kanye. 2IC’s call.', who: 'LUKA', tail: [330, 330], w: 240, size: 26 });
    s += pg.say({ p: 'a', x: 680, y: 170, text: 'That’s not how being 2IC works.', who: 'CHASE', tail: [740, 330], w: 200, size: 26 });
    s += pg.say({ p: 'a', x: 870, y: 262, text: 'It is tonight.', who: 'LUKA', tail: [930, 330], w: 110, size: 26 });

    // 2: a display-wall phone, bars dropping
    let b = R(gx[0], r1, gw, gh, '#E9E6DE');
    b += phoneObj(gx[0] + 28, r1 + 34, 150, 270, { lit: true, screen: '#EAF6FB', halo: false });
    b += statusInsert(gx[0] + 46, r1 + 68, 84, 'bars4', 'p5-s2', { to: '3g' });
    b += Tx(gx[0] + 103, r1 + 158, '11:47', 42, '#1C2A33', 'text-anchor="middle"', FONTS.ui) + Tx(gx[0] + 103, r1 + 184, 'Thursday', 15, '#56626B', 'text-anchor="middle"', FONTS.ui);
    s += pg.panel('b', [gx[0], r1, gw, gh], b, { desc: 'A display-wall phone, its signal bars dropping.' });
    s += pg.cap({ p: 'b', x: gx[0] + 14, y: r1 + 14, text: '11:47 PM.', w: 140, size: 20 });
    s += pg.say({ p: 'b', x: gx[0] + 224, y: r1 + 198, text: 'Dropped to 3G…', who: 'LUKE', tail: [gx[0] + 288, r1 + 238], w: 110, size: 24 });

    // 3: EFTPOS and the laptop — no connection, and a bloom of rot in the corners
    let c = R(gx[1], r1, gw, gh, '#DAD6CC') + R(gx[1], r1 + 170, gw, 70, '#8A7660');
    c += R(gx[1] + 24, r1 + 50, 100, 150, '#2A2C31', `rx="12" ${st(C.ink, 3)}`) + R(gx[1] + 34, r1 + 62, 80, 52, '#C6E2C4');
    c += textLines(['NO', 'CONNECTION'], gx[1] + 74, r1 + 88, 13, '#16361A', { font: FONTS.mono });
    c += rotPatch({ x: gx[1] + 114, y: r1 + 62, box: [gx[1] + 34, r1 + 62, 80, 52], reach: 50, count: 12, size: 9, seed: 'p5r1', grow: 6 });
    for (let i = 0; i < 9; i++) c += R(gx[1] + 38 + (i % 3) * 26, r1 + 124 + Math.floor(i / 3) * 22, 20, 16, '#4A4D55', 'rx="3"');
    c += laptopObj(gx[1] + 140, r1 + 70, 140, 110, {
      screen: '#E6ECF0',
      content: (sx, sy, sw, sh) => Pa(`M${sx + sw / 2 - 24} ${sy + 40}q24 -22 48 0M${sx + sw / 2 - 15} ${sy + 50}q15 -13 30 0`, 'none', st('#A8B0B8', 4)) + Ci(sx + sw / 2, sy + 58, 4, '#A8B0B8') + Ln(sx + sw / 2 - 30, sy + 64, sx + sw / 2 + 30, sy + 24, '#B3121F', 3) +
        rotPatch({ x: sx, y: sy + sh, box: [sx, sy, sw, sh], reach: 60, count: 14, size: 9, seed: 'p5r2', grow: 6 }),
    });
    s += pg.panel('c', [gx[1], r1, gw, gh], c, { desc: 'The EFTPOS terminal: NO CONNECTION. Beside it, Luke’s laptop, wi-fi greyed out. A faint bloom of Code Rot in the corner of both screens.' });

    // 4: the music system — NO SOURCE
    let d = R(gx[2], r1, gw, gh, '#CFCBC0');
    d += R(gx[2] + 30, r1 + 70, 235, 110, '#1E1F24', `rx="8" ${st(C.ink, 3)}`) + R(gx[2] + 50, r1 + 88, 130, 40, '#0E1A12');
    d += swap(Tx(gx[2] + 115, r1 + 116, '♪ TRACK 07', 20, '#7CFF9A', 'text-anchor="middle"', FONTS.mono), Tx(gx[2] + 115, r1 + 116, 'NO SOURCE', 22, '#FF6A5A', 'text-anchor="middle"', FONTS.mono), 'p5-src');
    d += Ci(gx[2] + 220, r1 + 125, 30, '#3A3C42', st(C.ink, 2)) + Ci(gx[2] + 220, r1 + 125, 8, '#77797F');
    for (let i = 0; i < 10; i++) d += R(gx[2] + 52 + i * 12, r1 + 146, 8, 18 - (i % 4) * 4, '#4A4D55');
    s += pg.panel('d', [gx[2], r1, gw, gh], d, { desc: 'The music system: NO SOURCE. The song cuts off mid-chorus.' });
    s += pg.say({ p: 'd', x: gx[2] + 110, y: r1 + 210, text: '…Finally.', who: 'ZANE', tail: [gx[2] + 40, r1 + 250], w: 110, size: 26 });

    // 5: every device the same
    let e = R(ex[0], r2, ew[0], gh2, '#BDB9AE') + R(ex[0], r2 + 250, ew[0], 90, '#A9A498') + '<g transform="translate(0 40)">';
    e += `<g transform="rotate(-8 ${ex[0] + 70} ${r2 + 140})">${R(ex[0] + 18, r2 + 70, 100, 134, C.y, `rx="10" ${st(C.ink, 3)}`)}${R(ex[0] + 26, r2 + 78, 84, 114, '#EAF2F6')}` +
      statusInsert(ex[0] + 32, r2 + 86, 46, 'bars4', 'p5-s5a') + R(ex[0] + 34, r2 + 110, 68, 8, '#C9D6DE', 'rx="2"') + R(ex[0] + 34, r2 + 124, 50, 8, '#C9D6DE', 'rx="2"') + R(ex[0] + 34, r2 + 150, 68, 30, '#DCE6EC', 'rx="3"') + '</g>';
    e += R(ex[0] + 128, r2 + 130, 56, 62, '#2C2E33', `rx="14" ${st(C.ink, 3)}`) + R(ex[0] + 135, r2 + 138, 42, 46, '#101418', 'rx="8"') + R(ex[0] + 144, r2 + 96, 24, 34, '#6B7076') + R(ex[0] + 144, r2 + 192, 24, 50, '#6B7076');
    e += swap(Tx(ex[0] + 156, r2 + 167, '4G', 15, '#FFFFFF', 'text-anchor="middle"', FONTS.ui), Tx(ex[0] + 156, r2 + 167, 'SOS', 15, '#FF6A5A', 'text-anchor="middle"', FONTS.ui), 'p5-s5b');
    e += phoneObj(ex[0] + 186, r2 + 92, 54, 104, { lit: true, screen: '#EAF2F6', halo: false, rot: 8 });
    e += `<g transform="rotate(8 ${ex[0] + 213} ${r2 + 144})">${swap(signalGlyph(ex[0] + 194, r2 + 102, 0.55, 'bars4', C.ink).replace(/>4G</, '><') + Tx(ex[0] + 213, r2 + 150, '4G', 16, C.ink, 'text-anchor="middle"', FONTS.ui),
      signalGlyph(ex[0] + 194, r2 + 102, 0.55, 'sos', '#B3121F').replace(/>SOS only</, '><') + Tx(ex[0] + 213, r2 + 146, 'SOS', 19, '#B3121F', 'text-anchor="middle"', FONTS.ui) + Tx(ex[0] + 213, r2 + 162, 'only', 11, '#B3121F', 'text-anchor="middle"', FONTS.ui), 'p5-s5c')}</g>`;
    e += '</g>';
    s += pg.panel('e', [ex[0], r2, ew[0], gh2], e, { desc: 'Zee’s tablet, Chloe’s watch, Zane’s phone: all the same.' });
    s += pg.say({ p: 'e', x: ex[0] + 96, y: r2 + 46, text: 'Mine says SOS.', who: 'ZEE', tail: [ex[0] + 6, r2 + 104], w: 120, size: 23 });
    s += pg.say({ p: 'e', x: ex[0] + 150, y: r2 + 286, text: 'Everyone’s says SOS.', who: 'CHASE', tail: [ex[0] + 244, r2 + 330], w: 150, size: 23 });

    // 6: short for Save Our Souls
    let f = R(ex[1], r2, ew[1], gh2, '#C4C0B5') + R(ex[1], r2, ew[1], gh2, 'url(#ht1)', 'opacity=".25"');
    const oz = {}, ol = {};
    f += fig('zane', { x: ex[1] + 112, y: r2 + 578, s: 1.0, face: 'grin', out: oz, props: ['gimbal'], pose: 'holdOne', light: 'side', so: 0.4 });
    f += fig('luke', { x: ex[1] + 332, y: r2 + 548, s: 1.0, flip: true, face: 'flat', out: ol, light: 'side', so: 0.4 });
    s += pg.panel('f', [ex[1], r2, ew[1], gh2], f, { desc: 'Zane, grinning. Luke, unimpressed.' });
    s += pg.say({ p: 'f', x: ex[1] + 128, y: r2 + 50, text: 'SOS. Short for Save Our Souls.', who: 'ZANE', tail: [oz.head[0] - 30, oz.head[1] - 40], w: 220, size: 23 });
    s += pg.say({ p: 'f', x: ex[1] + 300, y: r2 + 118, text: 'It’s not short for anything. It’s just easy Morse.', who: 'LUKE', tail: [ol.head[0] - 2, ol.head[1] - 30], w: 180, size: 22 });
    s += pg.say({ p: 'f', x: ex[1] + 134, y: r2 + 190, text: 'It’s short for Save Our Souls, Luke.', who: 'ZANE', tail: [oz.head[0] + 14, oz.head[1] - 28], w: 230, size: 22 });

    // 7: across the walkway, Cafe 63 comes on by itself
    const gxx = ex[2], gww = ew[2];
    let g = R(gxx, r2, gww, gh2, '#141B24');
    const cbox = [gxx + 16, r2 + 56, 192, 250];
    g += `<g>${cafe63(cbox, { lights: 0, steam: false })}</g>`;
    g += `<g class="c63-lit">${[0, 1, 2, 3].map((i) => `<g class="c63l" style="--li:${i}">${glow(cbox[0] + cbox[2] * (0.15 + i * 0.23), cbox[1] + cbox[3] * 0.3, 40, 34, 'gWarm', 0.85)}</g>`).join('')}` +
      `<g class="c63l" style="--li:4">${R(cbox[0] + cbox[2] * 0.64, cbox[1] + cbox[3] * 0.2, cbox[2] * 0.32, cbox[3] * 0.1, '#0B0B0B', st('#444', 1.2))}${Tx(cbox[0] + cbox[2] * 0.79, cbox[1] + cbox[3] * 0.275, 'ORDER READY', 13, '#7CFF9A', 'text-anchor="middle"', FONTS.mono)}<g class="fx-steam">${Pa(`M${cbox[0] + cbox[2] * 0.77} ${cbox[1] + cbox[3] * 0.37}q-8 -14 0 -26q8 -12 0 -24`, 'none', st('#EEE', 3, 'opacity=".7"'))}</g></g></g>`;
    g += rainFx([gxx, r2, gww, gh2], { op: 0.6, op2: 0.4 }) + glassDrops([gxx, r2, gww, gh2], 'p5g', 20);
    g += R(gxx, r2, 12, gh2, '#2A2D33') + R(gxx + gww - 12, r2, 12, gh2, '#2A2D33');
    // the machine's hiss, lettered as it starts (appears with the last light)
    g += `<g class="c63l" style="--li:4">${pg.sfx('SSSSHHHHHH', gxx + 112, r2 + 42, { size: 31, rot: -4, fill: '#FFFFFF' })}</g>`;
    s += pg.panel('g', [gxx, r2, gww, gh2], g, { desc: 'Through the front glass, across the walkway: Cafe 63, shut since four, its lights flicking on one by one. Its coffee machine starts by itself. The order screen: ORDER READY.' });


    // 8: every demo phone wakes at once
    let h = R(H8[0], H8[1], H8[2], H8[3], '#0B0E13');
    const wall = [H8[0] + 40, H8[1] + 24, 840, 350];
    h += R(wall[0], wall[1], wall[2], wall[3], '#1D2229', st(C.ink, 3)) + R(wall[0], wall[1], wall[2], 40, '#5A4A00') + Tx(wall[0] + wall[2] / 2, wall[1] + 30, 'optus', 30, '#1D1A08', 'text-anchor="middle" letter-spacing="3"', FONTS.ui);
    let lit = '';
    for (let j = 0; j < 4; j++) for (let i = 0; i < 10; i++) {
      const px = wall[0] + 28 + i * 81, py = wall[1] + 56 + j * 72;
      h += R(px, py, 40, 66, '#121418', `rx="5" ${st(C.ink, 2)}`) + R(px + 3, py + 4, 34, 58, '#1A2028', 'rx="3"') + R(px + 6, py + 66, 28, 6, '#2A2D33');
      lit += `<g class="wv" style="--w:${i + j * 0.5}">${glow(px + 20, py + 33, 54, 50, 'gS', 0.55)}${R(px + 3, py + 4, 34, 58, '#D8F4FF', 'rx="3" class="lit"')}${(i + j) % 3 === 0 ? `<path class="fx-ring" style="--rd:${(i * 0.17).toFixed(2)}s" d="M${px + 46} ${py + 18}q8 14 0 28M${px - 6} ${py + 18}q-8 14 0 28" fill="none" stroke="${C.y}" stroke-width="3"/>` : ''}</g>`;
    }
    // tiny ringing lettering all over the wall, each arriving as its column lights up
    const rr = rng('p5brr');
    for (let i = 0; i < 14; i++) {
      const bx = H8[0] + 90 + rr() * 760, by = H8[1] + 80 + rr() * 300;
      lit += `<g class="wv" style="--w:${n((bx - wall[0] - 28) / 81 + 0.6)}">${pg.sfx('brrr', bx, by, { size: 18 + rr() * 16, rot: rr.jit(20), fill: C.y, sw: 4, log: i === 0, op: 0.95 })}</g>`;
    }
    h += `<g class="p5-wave">${lit}</g>`;
    h += R(H8[0], H8[1] + 380, H8[2], 200, '#14181E');
    h += `<path d="M${H8[0]} ${H8[1] + 380}L${H8[0] + H8[2]} ${H8[1] + 380}L${H8[0] + H8[2]} ${H8[1] + 580}L${H8[0]} ${H8[1] + 580}Z" fill="url(#gUnderS)" opacity=".35"/>`;
    const team = [['luka', 200, 'back'], ['chase', 330, 'back'], ['zee', 455, 'back'], ['luke', 600, 'back'], ['zane', 735, 'back'], ['chloe', 860, 'side']];
    team.forEach(([w, x, v], i) => { h += fig(w, { x: H8[0] + x - 40, y: H8[1] + 650 + (i % 2) * 16, s: 1.0, view: v === 'side' ? 'side' : 'back', sil: true, rim: 'screen', rimDx: i < 3 ? 5 : -5, flip: v === 'side', tilt: -10 }); });
    h += ollie({ x: H8[0] + 70, y: H8[1] + 492, s: 0.6, dark: true, turn: 1 });
    s += pg.panel('h', H8, h, { desc: 'The whole team looking up at the display wall, faces lit, as every demo phone wakes at once and rings. At the edge of the light, the Ollie standee — nearer the counter than it was before.' });
    return s;
  },
  mount(ctx) {
    const on = (sel) => ctx.qa(sel).forEach((x) => x.classList.add('on'));
    ctx.status('bars');
    const run = () => {
      ctx.onPanel('b', () => { on('.p5-s2'); ctx.status('3g'); }, 1600);
      ctx.onPanel('d', () => {
        on('.p5-src');
        ctx.qa('.p5-notes').forEach((x) => x.classList.add('stopped'));
        Sound.cut('store');
        Sound.silence(1500);
      }, 3400);
      ctx.onPanel('e', () => { on('.p5-s5a'); ctx.after(300, () => on('.p5-s5b')); ctx.after(600, () => on('.p5-s5c')); ctx.status('sos'); }, 4400);
      ctx.onPanel('g', () => { ctx.q('.pn[data-panel="g"]').classList.add('go'); }, 5600);
      ctx.onPanel('h', () => {
        ctx.q('.pn[data-panel="h"]').classList.add('go');
        ctx.sfx('chorus');
        ctx.haptic('ring');
        ctx.after(1600, () => { ctx.sfx('chorus'); ctx.haptic('ring'); });
      }, 7400);
    };
    // (in a spread the reader holds this page's timeline until they reach it)
    run();
  },
});
