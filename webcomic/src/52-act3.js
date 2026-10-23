/* SOS ONLY — pages 20–26: Four, Town Hall, I'll Lock Up, Service Restored, Now Serving 06, Next Please, You. */

/* ---------- shared bits for Act III ---------- */

// Page-scoped keyframes for Act III. Included by each page; duplicates in a spread are harmless.
function pC_css() {
  return `<style>
  .pC-jit{animation:pC-jit .44s steps(1,end) infinite}
  @keyframes pC-jit{0%{transform:translate(0,0)}25%{transform:translate(-10px,2px)}50%{transform:translate(7px,-3px)}75%{transform:translate(-4px,5px)}}
  .pC-jit2{animation:pC-jit2 .31s steps(1,end) infinite}
  @keyframes pC-jit2{0%{transform:translate(0,0)}33%{transform:translate(12px,0)}66%{transform:translate(-6px,-2px)}}
  .pC-bob{animation:pC-bob 2.6s ease-in-out infinite;transform-box:fill-box;transform-origin:center bottom}
  @keyframes pC-bob{0%,100%{transform:rotate(-1.4deg)}50%{transform:rotate(1.4deg)}}
  .pC-blk{animation:pC-blk 1.9s steps(1,end) infinite}
  @keyframes pC-blk{0%{opacity:0}40%{opacity:.85}55%{opacity:0}80%{opacity:.5}}
  .pC-pulse{animation:pC-pulse 1.6s ease-in-out infinite;transform-box:fill-box;transform-origin:center}
  @keyframes pC-pulse{0%,100%{transform:scale(1);opacity:.8}50%{transform:scale(1.1);opacity:1}}
  .pC-fadein{opacity:0;animation:pC-fade 2.6s ease-out forwards;animation-delay:var(--fd,1.5s)}
  @keyframes pC-fade{to{opacity:1}}
  .pC-drain{animation:pC-drain 2.2s cubic-bezier(.55,0,.75,.6) forwards;transform-box:view-box;transform-origin:500px 760px}
  @keyframes pC-drain{0%{transform:scale(1)}100%{transform:scale(0)}}
  .pC-door{transform-box:view-box;transform:scaleX(var(--k0,1));transition:transform 10s cubic-bezier(.45,0,.25,1)}
  .pC-doorshade{opacity:.35;transition:opacity 10s cubic-bezier(.45,0,.25,1)}
  .pC-shut .pC-door{transform:scaleX(1)}
  .pC-shut .pC-doorshade{opacity:0}
  .pC-wedge{transition:opacity 10s cubic-bezier(.45,0,.25,1)}
  .pC-shut .pC-wedge{opacity:.06}
  .pC-sign{opacity:0;transform:translate(-150px,0);transition:transform 1.8s cubic-bezier(.2,.8,.3,1),opacity .6s}
  .pC-sign.on{opacity:1;transform:translate(0,0)}
  .pC-gull{animation:pC-gull 16s linear infinite}
  @keyframes pC-gull{from{transform:translate(-40px,10px)}to{transform:translate(300px,-30px)}}
  .pC-flap{animation:pC-flap .55s ease-in-out infinite alternate;transform-box:fill-box;transform-origin:center}
  @keyframes pC-flap{from{transform:scaleY(1)}to{transform:scaleY(-.5)}}
  .pC-shim{animation:pC-shim 3.2s ease-in-out infinite}
  @keyframes pC-shim{0%,100%{opacity:.3}50%{opacity:.85}}
  .pC-bloom{animation:pC-bloom 7s ease-in-out infinite;transform-box:fill-box;transform-origin:center}
  @keyframes pC-bloom{0%,100%{transform:scale(1);opacity:.75}50%{transform:scale(1.14);opacity:1}}
  .pC-sflick{animation:pC-sf 3.7s steps(1,end) infinite}
  @keyframes pC-sf{0%{opacity:1}43%{opacity:.78}50%{opacity:1}77%{opacity:.88}}
  .pC-end{opacity:0}
  .pC-end.go{animation:pC-fade 2.6s ease-out forwards}
  .pC-late{display:none}
  .pC-late.on{display:inline}
  .pC-q{transition:transform 1.2s ease-in-out,opacity 1.2s}
  .pC-glowm{transition:transform .5s ease-out}
  .pC-endcard{position:absolute;left:50%;bottom:8%;transform:translate(-50%,20px);opacity:0;transition:opacity .9s,transform .9s;z-index:4;
    background:#FFFDF6;color:#1A1A1A;border:3px solid #1A1A1A;border-radius:14px;padding:14px 22px 16px;text-align:center;font-family:var(--f-ui);box-shadow:0 10px 30px rgba(0,0,0,.35);min-width:min(320px,80%)}
  .pC-endcard.on{opacity:1;transform:translate(-50%,0)}
  .pC-endcard b{display:block;font:800 22px var(--f-ui);margin-bottom:4px}
  .pC-endcard small{display:block;color:#666;font-size:13px;margin-bottom:10px}
  .pC-endcard button{border:0;border-radius:999px;background:#1A1A1A;color:#FFCD00;font:800 16px var(--f-ui);padding:10px 22px;cursor:pointer;min-width:160px}
  .rm .pC-jit,.rm .pC-jit2,.rm .pC-bob,.rm .pC-blk,.rm .pC-pulse,.rm .pC-gull,.rm .pC-flap,.rm .pC-shim,.rm .pC-bloom,.rm .pC-sflick{animation:none!important}
  .rm .pC-fadein,.rm .pC-end.go{animation:none;opacity:1}
  .rm .pC-drain{display:none}
  .rm .pC-door,.rm .pC-doorshade,.rm .pC-wedge,.rm .pC-sign,.rm .pC-q,.rm .pC-glowm,.rm .pC-endcard{transition:none}
  </style>`;
}

// Page 3's count bubbles, back for the counting.
function pC_badge(x, y, num, o = {}) {
  const r = o.r || 18;
  if (o.ghost) return `<g opacity="${o.op || 0.5}">${Ci(x, y, r, 'none', st(C.y, 2.6, 'stroke-dasharray="5 4"'))}${Tx(x, y + r * 0.47, String(num), r * 1.4, 'none', `text-anchor="middle" ${st(C.y, 1.6)}`, FONTS.sfx)}</g>`;
  return `<g${o.cls ? ` class="${o.cls}"` : ''}>${Ci(x, y, r, C.y, st(C.ink, 3))}${Tx(x, y + r * 0.47, String(num), r * 1.4, C.ink, 'text-anchor="middle"', FONTS.sfx)}</g>`;
}

// The thing wearing Luke: exactly right, moving slightly wrong. A dropped-frame double outline and
// tiny letters crawling under the skin above the collar.
function pC_fakeLuke(o) {
  const out = o.out || {};
  const base = Object.assign({ face: ['blank', 'flat', 'smile'], light: 'side', so: 0.6, no: ['cable'] }, o, { out });
  const main = fig('luke', base);
  const ghost = fig('luke', Object.assign({}, base, { out: undefined }));
  const sc = (o.s || 1) * CAST.luke.h;
  let s = `<g class="rimS" opacity=".3" transform="translate(${o.gdx == null ? 9 : o.gdx} -3)">${ghost}</g>` + main;
  s += rotPatch({ x: out.head[0], y: out.head[1] + 34 * sc, reach: 22 * sc, count: 14, size: 5.5 * sc, seed: `pCluke${o.x}`, grow: 0, cols: [C.rot, C.rot3, C.rot2] });
  if (o.out) Object.assign(o.out, out);
  return s;
}

// The impossible stockroom aisle in one-point perspective: shelving to a vanishing point, every box glowing faintly.
function pC_aisle(box, o = {}) {
  const [x, y, w, h] = box;
  const vx = x + w * (o.vx == null ? 0.5 : o.vx), vy = y + h * (o.vy == null ? 0.42 : o.vy);
  const r = rng(o.seed || 'pCaisle');
  let s = R(x - 6, y - 6, w + 12, h + 12, '#07080A');
  s += Po([[x - 6, y + h + 6], [x + w + 6, y + h + 6], [vx + 5, vy + 3], [vx - 5, vy + 3]], '#0F1115');
  for (let k = 1; k < 12; k++) {
    const t = persp(k / 12, 10), yy = lerp(y + h + 6, vy + 3, t);
    s += Ln(lerp(x - 6, vx - 5, t), yy, lerp(x + w + 6, vx + 5, t), yy, '#1A1E25', 1.2);
  }
  const K = 16, levels = 5;
  for (const side of [-1, 1]) {
    const nearX = side < 0 ? x - 10 : x + w + 10;
    const xs = [], tops = [], bots = [];
    for (let k = 0; k <= K; k++) {
      const t = persp(k / K, 11);
      xs.push(lerp(nearX, vx + side * 6, t));
      tops.push(lerp(y - 40, vy - 4, t));
      bots.push(lerp(y + h * 0.94, vy + 4, t));
    }
    for (let k = 0; k < K; k++) {
      for (let j = 0; j < levels; j++) {
        const v0 = j / levels + 0.02, v1 = (j + 1) / levels - 0.03;
        const q = [[xs[k], lerp(tops[k], bots[k], v0)], [xs[k + 1], lerp(tops[k + 1], bots[k + 1], v0)], [xs[k + 1], lerp(tops[k + 1], bots[k + 1], v1)], [xs[k], lerp(tops[k], bots[k], v1)]];
        const g = r();
        s += Po(q, '#161C24');
        if (g < 0.8) {
          const c = [(q[0][0] + q[2][0]) / 2, (q[0][1] + q[2][1]) / 2];
          const hw = Math.abs(q[1][0] - q[0][0]) * 0.32, hh = Math.abs(q[3][1] - q[0][1]) * 0.28;
          s += R(c[0] - hw, c[1] - hh, hw * 2, hh * 2, o.glowCol || C.screen, `opacity="${n(0.15 + g * 0.5)}"${g < 0.1 && o.still !== true ? ' class="pC-sflick"' : ''}`);
        }
      }
      s += Ln(xs[k], tops[k], xs[k], bots[k], '#2A313B', lerp(7, 0.6, k / K));
    }
  }
  s += R(x - 6, y - 6, w + 12, (vy - y) * 0.8, 'url(#gFadeUp)', 'opacity=".95"');
  s += glow(vx, vy, w * 0.18, h * 0.08, o.vglow || 'gY', 0.35);
  return s;
}

// Jarrad as the Hold's best closer: too tall, the leaderboard grin, cables into the stock pulsing yellow.
function pC_jarrad(o) {
  const out = {};
  const fo = Object.assign({ face: 'dead', light: 'under', so: 0.7, props: ['lanyard', 'keyring'] }, o, { out });
  delete fo.cables; delete fo.still; delete fo.cablesBehind;
  let s = fig('jarrad', fo);
  const sc = (o.s || 1) * CAST.jarrad.h;
  let cab = '';
  const r = rng(`pCjc${o.x}`);
  (o.cables || []).forEach((tgt, i) => {
    const from = i % 3 === 0 ? out.nh : i % 3 === 1 ? out.fh : [out.head[0] + r.jit(20) * sc, out.head[1] + 80 * sc];
    const mx = (from[0] + tgt[0]) / 2 + r.jit(60 * sc), my = Math.max(from[1], tgt[1]) + 40 * sc;
    cab += `<path d="M${n(from[0])} ${n(from[1])}Q${n(mx)} ${n(my)} ${n(tgt[0])} ${n(tgt[1])}" fill="none" stroke="${C.ink}" stroke-width="${n(5 * sc)}"/><path class="${o.still ? '' : 'fx-glow'}" style="animation-delay:${(i * 0.23).toFixed(2)}s" d="M${n(from[0])} ${n(from[1])}Q${n(mx)} ${n(my)} ${n(tgt[0])} ${n(tgt[1])}" fill="none" stroke="${C.y}" stroke-width="${n(2.2 * sc)}"/>`;
  });
  if (o.out) Object.assign(o.out, out);
  return (o.cablesBehind === false ? s + cab : cab + s);
}

// A queue TV with its number in a group we can pulse.
function pC_tv(x, y, w, h, num, name, o = {}) {
  return queueTV(x, y, w, h, { num, name, numCls: o.numCls || '', sub: o.sub, glow: o.glow });
}

/* ---------- Page 20 — Four ---------- */

page(20, {
  title: 'Four', side: 'left', gutter: 'black', bleed: 'dark', status: 'sos',
  alt: 'The thing wearing Luke counts them. One: Luka. Two: Chloe. It skips three — Zee is already counted — and points at Chase. Four. Chase stutters out of existence like dropped video frames. His headphones lie on the floor, still playing. His laptop has rotted completely, and the rot is creeping off it onto the counter. Every speaker in the store says, in Chase’s chopped-up voice: thank you for holding. Luka is on his knees.',
  sound: { hum: true },
  render(pg) {
    const A = [40, 40, 440, 330], B = [498, 40, 462, 330], Cc = [40, 388, 300, 300], D = [358, 388, 602, 300];
    const Eb = [40, 706, 920, 330], F = [40, 1054, 440, 406], G2 = [498, 1054, 462, 406];
    let s = pC_css();

    // 1: "One." Luka lunges
    let a = storeInterior(A, { night: 0.68, vx: 0.55, vy: 0.36, bw: 0.4, bh: 0.44, lights: [0, 1, 0, 0, 1, 0], flicker2: 1, left: 'display', right: 'acc', litScreens: false });
    const ol = {}, ok = {};
    a += fig('luka', { x: A[0] + 120, y: A[1] + 470, s: 0.98, pose: 'run', face: 'shout', out: ok, light: 'side', so: 0.65, props: ['lanyard'] });
    a += Pa(`M${A[0] + 20} ${A[1] + 170}h70M${A[0] + 6} ${A[1] + 205}h80M${A[0] + 24} ${A[1] + 240}h60`, 'none', st('#C9D3DC', 3, 'opacity=".55"'));
    a += pC_fakeLuke({ x: A[0] + 360, y: A[1] + 480, s: 1.0, flip: true, pose: 'point', out: ol });
    a += pC_badge(ok.head[0] - 6, ok.head[1] - 62, 1);
    s += pg.panel('a', A, a, { desc: 'Luke — or the thing wearing him — stands very straight and points at Luka. Luka lunges at him.' });
    s += pg.say({ p: 'a', x: A[0] + 330, y: A[1] + 62, text: 'One.', who: 'LUKE', tail: [ol.head[0] - 4, ol.head[1] - 34], w: 80 });

    // 2: "Two—" — the balloon lands early and late at once
    let b = R(B[0], B[1], B[2], B[3], '#0C0F14') + glow(B[0] + 330, B[1] + 150, 200, 170, 'gS', 0.22);
    const oc = {}, ol2 = {};
    b += fig('chloe', { x: B[0] + 340, y: B[1] + 450, s: 1.05, pose: 'recoil', face: 'scared', out: oc, light: 'side', so: 0.6 });
    b += pC_fakeLuke({ x: B[0] + 90, y: B[1] + 560, s: 1.45, pose: 'point', out: ol2, arms: { na: [84, 86] }, face: ['blank', 'flat', 'line'] });
    b += pC_badge(oc.head[0] + 8, oc.head[1] - 72, 2);
    s += pg.panel('b', B, b, { desc: 'Luke points at Chloe. His mouth is closed; the word arrives twice — too early and too late at once.' });
    s += `<g opacity=".4">${pg.say({ p: 'b', x: B[0] + 200, y: B[1] + 66, text: 'Two—', who: false, w: 90, tail: [ol2.mouth[0] + 4, ol2.mouth[1] - 4] })}</g>`;
    s += pg.say({ p: 'b', x: B[0] + 228, y: B[1] + 100, text: 'Two—', who: 'LUKE', w: 90, tail: [ol2.mouth[0] + 6, ol2.mouth[1] + 2] });

    // 3: Chase — don't let him finish
    let c = R(Cc[0], Cc[1], Cc[2], Cc[3], '#10151C') + R(Cc[0], Cc[1], Cc[2], Cc[3], 'url(#htS)', 'opacity=".18"');
    const och = {};
    c += `<g transform="rotate(-8 ${Cc[0] + 150} ${Cc[1] + 200})">${fig('chase', { x: Cc[0] + 160, y: Cc[1] + 862, s: 2.1, view: 'front', face: 'shout', out: och, light: 'under', so: 0.5, pose: 'hold' })}</g>`;
    s += pg.panel('c', Cc, c, { desc: 'Chase, shouting.' });
    s += pg.say({ p: 'c', x: Cc[0] + 172, y: Cc[1] + 76, type: 'shout', text: 'Don’t let him finish! Luka, cover your—', who: 'CHASE', w: 150, size: 22, tail: [Cc[0] + 170, Cc[1] + 170] });

    // 4: "Four." — three is already counted
    let d = storeInterior(D, { night: 0.72, vx: 0.62, vy: 0.4, bw: 0.36, bh: 0.5, lights: [0, 0, 1, 0, 0, 0], left: 'acc', right: 'display' });
    const oc4 = {};
    d += fig('chase', { x: D[0] + 430, y: D[1] + 300, s: 0.72, face: 'scared', pose: 'recoil', out: oc4, flip: true, light: 'side', so: 0.6, add: ['laptop'] });
    d += pC_badge(D[0] + 300, D[1] + 70, 3, { ghost: true, op: 0.4 });
    d += pC_badge(oc4.head[0], oc4.head[1] - 46, 4, { r: 20 });
    // the pointing arm in the foreground — letters crawling under the skin
    const arm = [[D[0] - 30, D[1] + 300], [D[0] + 150, D[1] + 210], [D[0] + 300, D[1] + 168]];
    d += limb(arm, CAST.luke.skin, 46, 6) + limb([arm[0], [lerp(arm[0][0], arm[1][0], 0.55), lerp(arm[0][1], arm[1][1], 0.55)]], C.navy, 58, 6);
    d += Ci(D[0] + 312, D[1] + 166, 22, CAST.luke.skin, st(C.ink, 5)) + limb([[D[0] + 318, D[1] + 160], [D[0] + 366, D[1] + 146]], CAST.luke.skin, 13, 4);
    d += rotPatch({ x: D[0] + 200, y: D[1] + 196, box: [D[0] + 120, D[1] + 160, 190, 60], reach: 110, count: 22, size: 9, seed: 'pC20arm', grow: 8, ang: -0.3 });
    s += pg.panel('d', D, d, { desc: 'Luke’s arm in the foreground, pointing past Zee’s empty number at Chase. He skipped three. Three is already counted.' });
    s += pg.say({ p: 'd', x: D[0] + 120, y: D[1] + 70, text: 'Four.', who: 'LUKE', w: 90, tail: [D[0] + 30, D[1] + 200] });

    // 5: Chase stutters out of existence — five overlapping, fading copies, shattered like dropped frames
    const chaseId = uid('pCch');
    let e = R(Eb[0], Eb[1], Eb[2], Eb[3], '#05070A');
    const rr = rng('pC20e');
    for (let i = 0; i < 18; i++) e += R(Eb[0], Eb[1] + rr() * Eb[3], Eb[2], 2 + rr() * 6, rr() < 0.5 ? '#0E2230' : '#1A1608', `opacity="${n(0.5 + rr() * 0.5)}"`);
    for (let i = 0; i < 26; i++) e += R(Eb[0] + rr() * Eb[2], Eb[1] + rr() * Eb[3], 8 + rr() * 26, 8 + rr() * 16, rr.pick(['#21384A', '#3A3410', '#2A2F36']), `class="pC-blk" style="animation-delay:${n(-rr() * 2)}s"`);
    e += `<defs><g id="${chaseId}">${fig('chase', { x: 0, y: 0, s: 1.0, view: 'front', pose: 'recoil', face: 'scream', light: 'side', so: 0.5, props: ['headphones'] })}</g></defs>`;
    const cx0 = Eb[0] + 360, cy0 = Eb[1] + 420;
    const shardY = [-400, -250, -170, -80, 40];
    const copies = [[0, 1], [80, 0.6], [165, 0.4], [255, 0.24], [350, 0.12]];
    copies.forEach(([dx, op], k) => {
      for (let b2 = 0; b2 < 4; b2++) {
        const y0 = cy0 + shardY[b2], y1 = cy0 + shardY[b2 + 1];
        const j = rng(`pCsh${k}${b2}`);
        const cid = uid('pCsc');
        const pts = [[-140, y0 + j.jit(14)], [-40, y0 + j.jit(20)], [60, y0 + j.jit(14)], [160, y0 + j.jit(18)], [160, y1 + j.jit(14)], [60, y1 + j.jit(20)], [-40, y1 + j.jit(14)], [-140, y1 + j.jit(18)]].map(([px, py]) => [cx0 + dx + px, py]);
        const sx = (b2 % 2 ? 1 : -1) * (8 + k * 9) + j.jit(10);
        e += `<clipPath id="${cid}"><path d="${pathOf(pts)}"/></clipPath><g clip-path="url(#${cid})" opacity="${op}"><g class="${k ? (b2 % 2 ? 'pC-jit' : 'pC-jit2') : ''}" style="animation-delay:${n(-(k * 0.13 + b2 * 0.07))}s"><use href="#${chaseId}" x="${n(cx0 + dx + sx)}" y="${n(cy0)}"/></g></g>`;
      }
    });
    e += Pa(`M${Eb[0]} ${Eb[1] + 120}h${Eb[2]}M${Eb[0]} ${Eb[1] + 236}h${Eb[2]}`, 'none', st(C.screen, 1.5, 'opacity=".25"'));
    s += pg.panel('e', Eb, e, {
      desc: 'Chase stutters out of existence: five overlapping copies of him, each fainter than the last, torn into shards like dropped video frames.', path: raggedRect(Eb[0], Eb[1], Eb[2], Eb[3], 'pC20shard', 5),
      guided: [{ focus: [Eb[0], Eb[1], 520, Eb[3]], move: 'cut' }, { focus: [Eb[0] + 400, Eb[1], 520, Eb[3]], move: 'glide' }],
    });
    s += `<g opacity=".3">${pg.say({ p: 'e', x: Eb[0] + 150, y: Eb[1] + 72, text: 'Luka it’s — it’s —', who: false, w: 170, size: 25 })}</g>`;
    s += pg.say({ p: 'e', x: Eb[0] + 170, y: Eb[1] + 92, text: 'Luka it’s — it’s — it’s —', who: 'CHASE', w: 170, size: 25, tail: [cx0 - 40, Eb[1] + 110], rot: 0.2 });
    s += `<g opacity=".3">${pg.say({ p: 'e', x: Eb[0] + 760, y: Eb[1] + 210, text: 'lying about the — the —', who: false, w: 210, size: 25 })}</g>`;
    s += pg.say({ p: 'e', x: Eb[0] + 780, y: Eb[1] + 232, text: 'lying about the — the — the—', who: 'CHASE', w: 210, size: 25, tail: [cx0 + 260, Eb[1] + 150] });

    // 6: the empty spot — headphones still playing, the laptop rotted through
    let f = R(F[0], F[1], F[2], F[3], '#0A0C10');
    f += glow(F[0] + 220, F[1] + 60, 260, 150, 'gW', 0.14);
    f += R(F[0], F[1] + 170, F[2], 18, '#2E323A', st(C.ink, 3)) + R(F[0], F[1] + 188, F[2], 70, '#1A1D22');
    f += laptopObj(F[0] + 130, F[1] + 40, 180, 135, {
      screen: '#2A2410',
      content: (sx, sy, sw, sh) => R(sx, sy, sw, sh, '#3A3112') + rotPatch({ x: sx + sw / 2, y: sy + sh / 2, box: [sx, sy, sw, sh], reach: 120, count: 90, size: 13, seed: 'pC20lap', grow: 0 }) +
        [0, 1, 2, 3].map((i) => rotLine(sx + 8, sy + 20 + i * 24, '▒PUDDING_hold_v7.wav', 15, 0.7, `pC20l${i}`, { fill: '#6B5A1E' })).join(''),
    });
    f += `<g class="pC-late on">${rotPatch({ x: F[0] + 220, y: F[1] + 175, box: [F[0], F[1] + 160, F[2], 120], reach: 220, count: 70, size: 13, seed: 'pC20crawl', grow: 16, delay: 1.5, ang: Math.PI / 2 })}</g>`;
    f += R(F[0], F[1] + 258, F[2], 150, '#14171C') + floorGrid([F[0], F[1] + 258, F[2], 150], F[0] + 220, F[1] + 160, { col: '#14171C', lineCol: '#22272F', rows: 5 });
    // headphones on the floor, faintly playing
    const hx = F[0] + 200, hy = F[1] + 352;
    f += E(hx, hy + 22, 110, 14, '#000', 'opacity=".5"');
    f += Pa(`M${hx - 70} ${hy}C${hx - 70} ${hy - 70} ${hx + 70} ${hy - 70} ${hx + 70} ${hy}`, 'none', st(C.ink, 14)) + Pa(`M${hx - 70} ${hy}C${hx - 70} ${hy - 70} ${hx + 70} ${hy - 70} ${hx + 70} ${hy}`, 'none', st('#3A3C42', 8));
    f += E(hx - 74, hy + 4, 26, 32, '#26272C', st(C.ink, 4)) + E(hx + 74, hy + 4, 26, 32, '#26272C', st(C.ink, 4)) + E(hx + 74, hy + 4, 11, 15, C.y) + E(hx - 74, hy + 4, 11, 15, C.y);
    f += notesFx(hx, hy - 20, { count: 4, dx: 90, dy: -110, size: 22, col: C.screen, stroke: C.ink, seed: 'pC20n' });
    s += pg.panel('f', F, f, { desc: 'The empty spot. Chase’s headphones on the floor, still faintly playing. On the counter, his laptop, lid open, the screen completely rotted — and the rot creeping off the bezel onto the counter, letter by letter, like mould looking for a way out.' });
    s += pg.sfx('tss tss', hx + 110, hy - 70, { size: 24, rot: -10, fill: C.screen, sw: 4, p: 'f' });

    // 7: every speaker, in Chase's voice
    let g = R(G2[0], G2[1], G2[2], G2[3], '#06070A') + R(G2[0], G2[1], G2[2], 60, '#15181D');
    const spk = [[G2[0] + 92, G2[1] + 40], [G2[0] + 366, G2[1] + 40]];
    spk.forEach(([x, y]) => { g += Ci(x, y, 30, '#2A2D33', st(C.ink, 3)) + Ci(x, y, 22, 'url(#ht2)') + glow(x, y + 20, 60, 30, 'gS', 0.25); });
    g += R(G2[0] + 211, G2[1] + 52, 40, 9, '#C9D3DC', st(C.ink, 2));
    g += `<path d="M${G2[0] + 216} ${G2[1] + 60}L${G2[0] + 246} ${G2[1] + 60}L${G2[0] + 350} ${G2[1] + 406}L${G2[0] + 100} ${G2[1] + 406}Z" fill="url(#gCone)" opacity=".5"/>`;
    g += E(G2[0] + 228, G2[1] + 384, 104, 14, '#20252C');
    g += fig('luka', { x: G2[0] + 215, y: G2[1] + 398, s: 0.78, pose: 'slump', face: 'cry', light: 'top', so: 0.75, props: ['lanyard'], tilt: 18 });
    g += ollie({ x: G2[0] + 420, y: G2[1] + 360, s: 0.3, dark: true, turn: -1 });
    s += pg.panel('g', G2, g, { desc: 'Every ceiling speaker, in Chase’s voice, chopped like a sample. Below them, Luka on his knees. No words.' });
    s += pg.say({ p: 'g', x: spk[0][0], y: G2[1] + 140, type: 'elec', text: 'THANK —\nTHANK YOU\nFOR —', who: 'SPEAKERS (CHASE’S VOICE)', w: 150, size: 24, tail: [spk[0][0], spk[0][1] + 24] });
    s += pg.say({ p: 'g', x: spk[1][0] - 6, y: G2[1] + 130, type: 'elec', text: 'FOR HOL —\nHOLDING.', who: 'SPEAKERS (CHASE’S VOICE)', w: 140, size: 24, tail: [spk[1][0], spk[1][1] + 24] });
    return s;
  },
  mount(ctx) {
    ctx.onPanel('e', () => { ctx.sfx('stutter'); ctx.haptic('stutter'); ctx.after(500, () => ctx.sfx('stutter')); }, 2600);
    ctx.onPanel('f', () => ctx.sfx('static', { v: 0.3 }), 4200);
    ctx.onPanel('g', () => ctx.bed({ hum: true, hold: true, voice: true }), 5200);
  },
});

/* ---------- Page 21 — Town Hall ---------- */

// One screen of the promo wall with Rue on it: suit, desk, briefcase, scan lines and compression blocks.
// o: {view, flip, face, look, out, delay, rec, lower, bob, fig (override markup), seed}
function pC_rueFig(x, y, w, h, o = {}) {
  const sc = h / (o.frame || 150);
  return fig('rue', { x: x + w * (o.fx || 0.42), y: y + h * 0.42 + 318 * sc, s: sc, view: o.view || 'front', flip: o.flip, face: o.face || 'smile', light: 'front', so: 0.3, look: o.look, out: o.out, pose: o.pose || 'stand' });
}

function pC_rueScreen(x, y, w, h, o = {}) {
  const cid = uid('pCrs');
  const r = rng(o.seed || `pCrs${x},${y}`);
  const sc = h / 200;
  let inner = R(x, y, w, h, '#14263B') + R(x, y, w, h, 'url(#htN)', 'opacity=".55"');
  inner += glow(x + w * 0.42, y + h * 0.38, w * 0.4, h * 0.5, 'gW', 0.12);
  inner += Pa(`M${n(x + w * 0.72)} ${n(y)}L${n(x + w * 0.9)} ${n(y)}L${n(x + w * 0.62)} ${n(y + h)}L${n(x + w * 0.44)} ${n(y + h)}Z`, C.y, 'opacity=".12"');
  const figs = o.figs || pC_rueFig(x, y, w, h, o);
  inner += `<g class="${o.bob === false ? '' : 'pC-bob'}" style="animation-delay:${n(o.delay || 0)}s">${figs}</g>`;
  // the desk and the briefcase on it
  inner += R(x, y + h * 0.8, w, h * 0.2, '#3A2A1C') + R(x, y + h * 0.8, w, h * 0.025, '#5A4430');
  inner += `<g transform="translate(${n(x + w * 0.78)} ${n(y + h * 0.8)}) scale(${n(sc)})">${R(-34, -40, 68, 40, '#4A2E1A', `rx="4" ${st(C.ink, 2)}`)}${Pa('M-12 -40v-8h24v8', 'none', st(C.ink, 3))}${R(-4, -26, 8, 6, '#C9A44A')}</g>`;
  if (o.lower) inner += R(x, y + h * 0.66, w * 0.5, h * 0.11, C.y) + Tx(x + w * 0.03, y + h * 0.745, 'RUE · CEO', h * 0.07, C.ink, 'letter-spacing="1"', FONTS.ui);
  if (o.rec) inner += Ci(x + w * 0.05, y + h * 0.08, h * 0.028, '#E8322F', 'class="fx-blink"') + Tx(x + w * 0.09, y + h * 0.105, 'RECORDED 14·03·1987', h * 0.07, '#F2F2F2', '', FONTS.mono);
  inner += R(x, y, w, h, 'url(#scan)', 'opacity=".3"');
  for (let i = 0; i < (o.blocks == null ? 3 : o.blocks); i++) inner += R(x + r() * w * 0.85, y + h * (0.25 + r() * 0.6), w * (0.06 + r() * 0.1), h * (0.05 + r() * 0.08), r.pick(['#3A5A7A', '#7A6A2A', '#2A3A4A', '#C9A88A']), `class="pC-blk" style="animation-delay:${n(-r() * 2)}s"`);
  let s = glow(x + w / 2, y + h / 2, w * 0.75, h * 0.85, 'gS', o.halo == null ? 0.18 : o.halo);
  s += R(x - 7, y - 7, w + 14, h + 14, '#111215', `rx="4" ${st(C.ink, 3)}`);
  s += `<clipPath id="${cid}"><rect x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${n(h)}"/></clipPath><g clip-path="url(#${cid})">${inner}</g>`;
  return s;
}

// Size of an electronic balloon exactly as pg.say draws it, so connectors and guided stops can be placed on it.
function pC_elecBox(x, y, text, w, size) {
  const lines = wrapText(String(text).toUpperCase(), w, size, FONTS.speech, 0);
  const bw = Math.max(...lines.map((l) => textW(l, size, FONTS.speech, 0))) + 44, bh = lines.length * size * 1.06 + 28;
  return [x - bw / 2, y - bh / 2, bw, bh];
}

// A balloon connector (one speaker, two balloons): a white band from P to Q whose inked sides run edge to edge.
// Drawn over both balloons so the joins are seamless; it pops in with the second balloon.
function pC_link(pg, p, P, Q, wid = 22) {
  const dx = Q[0] - P[0], dy = Q[1] - P[1], L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L, px = -uy * wid / 2, py = ux * wid / 2;
  const band = [[P[0] - ux * 7 + px, P[1] - uy * 7 + py], [Q[0] + ux * 7 + px, Q[1] + uy * 7 + py], [Q[0] + ux * 7 - px, Q[1] + uy * 7 - py], [P[0] - ux * 7 - px, P[1] - uy * 7 - py]];
  const sides = `M${n(P[0] + px)} ${n(P[1] + py)}L${n(Q[0] + px)} ${n(Q[1] + py)}M${n(P[0] - px)} ${n(P[1] - py)}L${n(Q[0] - px)} ${n(Q[1] - py)}`;
  return `<g class="bl" data-p="${p}" style="--i:${pg.bal - 1}">${Po(band, '#FFFFFF')}${Pa(sides, 'none', st(C.ink, 6))}</g>`;
}

page(21, {
  title: 'Town Hall', side: 'right', gutter: 'black', bleed: 'hold', status: 'sos',
  alt: 'At 2:00 AM the promo video wall switches itself on: a message from Rue, the CEO, nine of him, each a frame out of sync. It was recorded in 1987, yet he answers. He knows what Luka said about Bon Jovi. He knew about Jarrad. Coverage isn’t free, he explains: somebody has to pay for the hold. Close the store, count to seven, lock the door. And Chloe? Chloe’s not a customer. Chloe’s staff.',
  sound: { hum: true },
  render(pg) {
    const A = [40, 40, 920, 220], B = [40, 278, 920, 340], Cc = [40, 636, 360, 250], D = [418, 636, 542, 250];
    const Eb = [40, 904, 920, 260], F = [40, 1182, 920, 278];
    let s = pC_css();

    // 1: the promo wall switches on — a town-hall card in Optus yellow; Luka and Chloe, backs to us, in its light
    let a = R(A[0], A[1], A[2], A[3], '#07080B');
    const W0 = [A[0] + 220, A[1] + 16, 540, 186];
    a += glow(W0[0] + 270, W0[1] + 100, 420, 200, 'gY', 0.35);
    a += R(W0[0], W0[1], W0[2], W0[3], C.y) + R(W0[0], W0[1], W0[2], W0[3], 'url(#htY)', 'opacity=".5"') + R(W0[0], W0[1] + W0[3] * 0.68, W0[2], W0[3] * 0.32, '#F2B800');
    a += Tx(W0[0] + 340, W0[1] + 42, 'TOWN HALL', 18, C.ink, 'text-anchor="middle" letter-spacing="4"', FONTS.ui);
    a += Tx(W0[0] + 340, W0[1] + 108, 'A MESSAGE FROM RUE', 30, C.ink, 'text-anchor="middle"', FONTS.ui);
    a += Tx(W0[0] + 340, W0[1] + 160, '2:00 AM  ·  ALL STAFF', 15, '#3A2E00', 'text-anchor="middle" letter-spacing="2"', FONTS.ui);
    a += `<g transform="translate(${W0[0] + 74} ${W0[1] + 176}) scale(.5)">${pC_miniOllie()}</g>`;
    for (let i = 1; i < 3; i++) a += Ln(W0[0] + (W0[2] * i) / 3, W0[1], W0[0] + (W0[2] * i) / 3, W0[1] + W0[3], '#111215', 4) + Ln(W0[0], W0[1] + (W0[3] * i) / 3, W0[0] + W0[2], W0[1] + (W0[3] * i) / 3, '#111215', 4);
    a += R(W0[0] - 7, W0[1] - 7, W0[2] + 14, W0[3] + 14, 'none', st('#111215', 10)) + R(W0[0], W0[1], W0[2], W0[3], 'url(#scan)', 'opacity=".15"');
    a += ollie({ x: A[0] + 28, y: A[1] + 214, s: 0.3, dark: true, turn: 1 });
    a += fig('luka', { x: A[0] + 118, y: A[1] + 590, s: 1.4, view: 'back', sil: true, rim: 'yellow', rimDx: 5 });
    a += fig('chloe', { x: A[0] + 836, y: A[1] + 526, s: 1.3, view: 'back', sil: true, rim: 'yellow', rimDx: -5 });
    s += pg.panel('a', A, a, {
      desc: 'The promo video wall, a three-by-three grid of screens, switches on by itself: a corporate town-hall card in Optus yellow, Ollie waving beside the title. A MESSAGE FROM RUE. Luka and Chloe, silhouetted, in front of it.',
      guided: [{ focus: [A[0], A[1], 330, A[3]] }, { focus: [W0[0] - 10, A[1], W0[2] + 20, A[3]] }],
    });
    s += pg.cap({ p: 'a', x: 60, y: 58, text: '2:00 AM.', w: 150 });

    // 2: nine Rues, each a frame behind the last. When he says "Luka", eight turn to Luka — and one turns to you.
    let b = R(B[0], B[1], B[2], B[3], '#06070A');
    const gw = 170, gh = 98, gx0 = B[0] + 26, gy0 = B[1] + 18;
    let nine = null;
    for (let k = 0; k < 9; k++) {
      const i = k % 3, j = Math.floor(k / 3);
      const x = gx0 + i * (gw + 14), y = gy0 + j * (gh + 14);
      let turned;
      if (k === 8) {
        // the camera on this screen has pushed in: he's bigger, and he's looking straight out at you
        const out = {};
        turned = pC_rueFig(x, y, gw, gh, { face: ['blank', 'flat', 'smile'], out, frame: 92, fx: 0.4 });
        const sc = gh / 92;
        turned += `<g class="pC-rpup">${Ci(out.head[0] - 9 * sc, out.head[1], 2.4 * sc, C.ink)}${Ci(out.head[0] + 9 * sc, out.head[1], 2.4 * sc, C.ink)}</g>`;
        nine = [x, y];
      } else turned = pC_rueFig(x, y, gw, gh, { view: 'side', flip: true, face: 'smile', fx: 0.48 });
      const front = pC_rueFig(x, y, gw, gh, { face: 'smile' });
      b += pC_rueScreen(x, y, gw, gh, { figs: swap(front, turned, `pC-rue pC-rue${k}`), delay: k * 0.08, seed: `pC21b${k}`, lower: k === 4, rec: true });
    }
    const grid = [B[0], B[1], 590, B[3]];
    const t1 = 'Hello, team. If you’re seeing this, your store has been selected for a Service Event. First of all — thank you.';
    const t2 = 'And Luka? You’re right about Bon Jovi.';
    const b1 = pC_elecBox(B[0] + 748, B[1] + 92, t1, 280, 23), b2 = pC_elecBox(B[0] + 760, B[1] + 262, t2, 230, 25);
    s += pg.panel('b', B, b, {
      desc: 'Rue on all nine screens: suit, briefcase on the desk beside him. Each Rue runs a frame behind the last.',
      guided: [{ focus: grid }, { focus: [b1[0] - 40, b1[1] - 6, b1[2] + 50, b1[3] + 12] }],
    });
    s += pg.say({ p: 'b', x: B[0] + 748, y: B[1] + 92, type: 'elec', text: t1, who: 'RUE', w: 280, size: 23, tail: [B[0] + 560, B[1] + 70] });
    // guided view: read "And Luka?", cut back to the wall as eight of them turn, then creep in on the ninth
    pg.stop('bL', [b2[0] - 50, b2[1] - 10, b2[2] + 60, b2[3] + 20]);
    pg.stop('bT', grid, { move: 'cut' });
    pg.stop('b9', [nine[0] - 14, nine[1] - 10, gw + 28, gh + 20], { move: 'creep' });
    s += pg.say({ p: 'bL', x: B[0] + 760, y: B[1] + 262, type: 'elec', text: t2, who: 'RUE', w: 230, size: 25, tail: [B[0] + 560, B[1] + 250] });

    // 3: Luka goes cold
    let c = R(Cc[0], Cc[1], Cc[2], Cc[3], '#0B0F14') + glow(Cc[0] + 300, Cc[1] + 80, 200, 200, 'gY', 0.3);
    const okc = {};
    c += fig('luka', { x: Cc[0] + 84, y: Cc[1] + 812, s: 2.0, view: 'side', face: 'shock', out: okc, light: 'front', so: 0.72, props: ['lanyard'], look: [1, -0.3] });
    s += pg.panel('c', Cc, c, { desc: 'Luka goes cold. He said that at 11:46, to five people, in a locked store.' });
    s += pg.say({ p: 'c', x: Cc[0] + 228, y: Cc[1] + 52, text: '…How do you know that?', who: 'LUKA', w: 170, size: 22, tail: [okc.head[0] + 44, okc.head[1] - 18] });
    s += pg.say({ p: 'c', x: Cc[0] + 268, y: Cc[1] + 168, text: 'You knew. About Jarrad.', who: 'LUKA', w: 140, size: 22, tail: [okc.head[0] + 56, okc.head[1] + 22], rot: 0.2 });

    // 4: recorded — yet answering
    let d = R(D[0], D[1], D[2], D[3], '#06070A');
    d += pC_rueScreen(D[0] + 22, D[1] + 22, 310, 206, { rec: true, lower: true, seed: 'pC21d', face: 'smile', blocks: 4, halo: 0.3 });
    s += pg.panel('d', D, d, { desc: 'One screen, close. Rue, warm, recorded — yet answering. In the corner of every screen: RECORDED 14·03·1987.' });
    s += pg.say({ p: 'd', x: D[0] + 440, y: D[1] + 124, type: 'elec', text: 'Jarrad was a wonderful closer, Luka. So are you.', who: 'RUE', w: 170, size: 23, tail: [D[0] + 310, D[1] + 110] });

    // 5: coverage isn't free — one speaker, three balloons, joined so they read in order
    let e = R(Eb[0], Eb[1], Eb[2], Eb[3], '#06070A');
    e += pC_rueScreen(Eb[0] + 22, Eb[1] + 40, 250, 156, { seed: 'pC21e', face: 'calm', blocks: 3, rec: true });
    const te1 = 'Coverage isn’t free. Every bar, on every phone, on this whole peninsula, is held up by something. Somebody has to pay for the hold.';
    const te2 = 'Your Zane had it right, by the way. S.O.S. Save our souls.';
    const te3 = 'That’s the job, Luka. We save every single one.';
    const e1 = pC_elecBox(Eb[0] + 428, Eb[1] + 132, te1, 222, 22), e2 = pC_elecBox(Eb[0] + 774, Eb[1] + 72, te2, 220, 22), e3 = pC_elecBox(Eb[0] + 784, Eb[1] + 196, te3, 210, 22);
    s += pg.panel('e', Eb, e, {
      desc: 'Rue, explaining.',
      guided: [{ focus: [e1[0] - 120, Eb[1], e1[2] + 134, Eb[3]] }, { focus: [e2[0] - 16, Eb[1], Eb[0] + Eb[2] - e2[0] + 16, Eb[3]] }],
    });
    s += pg.say({ p: 'e', x: Eb[0] + 428, y: Eb[1] + 132, type: 'elec', text: te1, who: 'RUE', w: 222, size: 22, tail: [Eb[0] + 280, Eb[1] + 110] });
    s += pg.say({ p: 'e', x: Eb[0] + 774, y: Eb[1] + 72, type: 'elec', text: te2, who: 'RUE', w: 220, size: 22 });
    const ly = clamp(e2[1] + e2[3] * 0.62, e1[1] + 16, e1[1] + e1[3] - 16);
    s += pC_link(pg, 'e', [e1[0] + e1[2], ly], [e2[0], ly]);
    s += pg.say({ p: 'e', x: Eb[0] + 784, y: Eb[1] + 196, type: 'elec', text: te3, who: 'RUE', w: 210, size: 22 });
    s += pC_link(pg, 'e', [Eb[0] + 790, e2[1] + e2[3]], [Eb[0] + 790, e3[1]]);

    // 6: close the store. And Chloe? — Chloe's staff.
    let f = R(F[0], F[1], F[2], F[3], '#06070A');
    f += pC_rueScreen(F[0] + 22, F[1] + 26, 214, 134, { seed: 'pC21f', face: 'smile', blocks: 3 });
    f += glow(F[0] + 830, F[1] + 130, 200, 200, 'gY', 0.22);
    const okf = {};
    f += fig('luka', { x: F[0] + 860, y: F[1] + 860, s: 2.0, view: 'side', flip: true, face: 'worried', out: okf, light: 'front', so: 0.75, props: ['lanyard'] });
    const tf1 = 'Close the store. Count to seven. Lock the door. By sunrise, Redcliffe has coverage — and you’ll never have another outage as long as you live.';
    const tf3 = 'Chloe’s not a customer, Luka. Chloe’s staff.';
    const f1 = pC_elecBox(F[0] + 418, F[1] + 102, tf1, 290, 22), f3 = pC_elecBox(F[0] + 236, F[1] + 236, tf3, 330, 25);
    s += pg.panel('f', F, f, {
      desc: 'Rue, smiling. Luka, at the edge of the light.',
      guided: [{ focus: [f1[0] - 110, F[1], f1[2] + 124, f1[1] + f1[3] + 8 - F[1]] }, { focus: [F[0] + 560, F[1], 360, F[3]] }, { focus: [f3[0] - 14, f3[1] - 14, f3[2] + 28, f3[3] + 20] }],
    });
    s += pg.say({ p: 'f', x: F[0] + 418, y: F[1] + 102, type: 'elec', text: tf1, who: 'RUE', w: 290, size: 22, tail: [F[0] + 240, F[1] + 80] });
    s += pg.say({ p: 'f', x: F[0] + 742, y: F[1] + 84, text: 'And Chloe?', who: 'LUKA', w: 100, size: 25, tail: [okf.head[0] - 30, okf.head[1] - 14] });
    s += pg.say({ p: 'f', x: F[0] + 236, y: F[1] + 236, type: 'elec', text: tf3, who: 'RUE', w: 330, size: 25, tail: [F[0] + 130, F[1] + 162] });
    // §10: 19–22 the rot is in the UI as well as the gutters — it doesn't let up on the town hall page
    s += pC_gutterRot([[409, 760, 50, 24], [960, 627, 60, 26], [40, 269, 50, 22]], 'pC21gr', 9);
    return s;
  },
  mount(ctx) {
    ctx.onPanel('a', () => { ctx.sfx('static', { v: 0.4 }); [72, 76, 79, 84].forEach((m, i) => ctx.after(500 + i * 220, () => ctx.sfx('note', { m }))); }, 300);
    // "And Luka?" — eight Rues turn to Luka, one frame apart; the ninth turns to the reader and keeps watching
    const turn = () => {
      for (let k = 0; k < 9; k++) ctx.after(k * 85, () => ctx.qa(`.pC-rue${k}`).forEach((x) => x.classList.add('on')));
      const pup = ctx.q('.pC-rpup');
      if (!pup) return;
      ctx.onPointer((nx, ny) => { pup.setAttribute('transform', `translate(${n(clamp(nx, -1, 1) * 2.4)} ${n(clamp(ny, -1, 1) * 1.8)})`); });
    };
    ctx.onPanel('bT', turn, 2600);
  },
});

// The kiosk-style waving Ollie from the check-in tablet, as SVG markup (no hotspot: it's on a screen).
function pC_miniOllie() {
  return `<g><path d="M-18 -120 L-24 -6 M18 -120 L24 -6" stroke="#0E0E10" stroke-width="7" stroke-linecap="round"/><ellipse cx="-28" cy="-5" rx="12" ry="6" fill="#0E0E10"/><ellipse cx="28" cy="-5" rx="12" ry="6" fill="#0E0E10"/>` +
    `<path d="M-68 -186 L-102 -150" stroke="#0E0E10" stroke-width="7" stroke-linecap="round"/><circle cx="-104" cy="-148" r="8" fill="#0E0E10"/>` +
    `<g class="fx-sway" style="transform-origin:68px -196px;transform-box:view-box"><path d="M68 -196 L100 -246" stroke="#0E0E10" stroke-width="7" stroke-linecap="round"/><circle cx="102" cy="-250" r="8" fill="#0E0E10"/></g>` +
    `<circle cx="0" cy="-190" r="72" fill="#FFCD00" stroke="#0E0E10" stroke-width="6"/><path d="M-74 -214 C-50 -236 50 -236 74 -214 C60 -186 30 -176 0 -186 C-30 -176 -60 -186 -74 -214 Z" fill="#fff" stroke="#0E0E10" stroke-width="5"/>` +
    `<ellipse cx="-26" cy="-206" rx="10" ry="13" fill="#0E0E10"/><ellipse cx="26" cy="-206" rx="10" ry="13" fill="#0E0E10"/></g>`;
}

/* ---------- Page 22 — I'll Lock Up ---------- */

// A stockroom door seen from the shop floor, handle on the side nearest the hinge-free edge (o.handle: 'left' | 'right').
function pC_stockDoor(x, y, w, h, o = {}) {
  let s = R(x - 14, y - 14, w + 28, h + 14, '#2A2E35', st(C.ink, 3));
  s += R(x, y, w, h, '#4A5058', st(C.ink, 3)) + R(x + w * 0.3, y + h * 0.12, w * 0.4, h * 0.16, '#141820', st(C.ink, 2));
  s += R(x + w * 0.18, y + h * 0.34, w * 0.64, h * 0.08, '#F2EFE6', st(C.ink, 1.5)) + Tx(x + w / 2, y + h * 0.395, 'STOCKROOM', h * 0.05, C.ink, 'text-anchor="middle" letter-spacing="1"', FONTS.ui);
  s += R(x + w * (o.handle === 'left' ? 0.06 : 0.8), y + h * 0.52, w * 0.14, h * 0.035, '#B9BCC2', st(C.ink, 1.5));
  return s;
}

page(22, {
  title: 'I’ll Lock Up', side: 'left', gutter: 'black', bleed: 'dark', status: 'sos',
  alt: 'Luka takes off his lanyard — keys, 2IC card — and puts it over Chloe’s head. When the roller door goes up, she runs, and doesn’t count anything. At 2:40 AM, the time he left a year ago, he walks into the impossible stockroom, where Jarrad turns. “You go, mate. I’ll lock up.” The door closes on the two of them. Beep. The queue TV says 05.',
  sound: {},
  render(pg) {
    const A = [40, 40, 560, 420], B = [618, 40, 342, 420], Cc = [40, 478, 920, 300], D = [40, 796, 560, 340], Eb = [618, 796, 342, 340], F = [40, 1154, 920, 306];
    let s = pC_css();

    // 1: the lanyard goes over Chloe's head — held open in both his hands, the 2IC card and keys swinging below
    let a = R(A[0], A[1], A[2], A[3], '#0D1117') + glow(A[0] + 520, A[1] + 160, 260, 260, 'gY', 0.22) + R(A[0], A[1] + 360, A[2], 60, '#141820');
    const ol = {}, oc = {};
    const chloe1 = fig('chloe', { x: A[0] + 372, y: A[1] + 640, s: 1.18, flip: true, face: ['dot', 'worried', 'frown'], look: [1, -1], out: oc, light: 'front', so: 0.6, pose: 'still' });
    const lx = oc.head[0], lyy = oc.head[1] - 30, lrx = 44;
    const L0 = [lx - lrx, lyy], L1 = [lx + lrx, lyy - 2], card = [lx - 6, lyy + 92];
    const lk = A[0] + 262, lkY = A[1] + 628, lks = 1.2;
    const loc = (p) => [(p[0] - lk) / lks, (p[1] - lkY) / lks];
    const strap = (d) => Pa(d, 'none', st(C.ink, 8)) + Pa(d, 'none', st(C.y, 4.6));
    a += strap(`M${n(L0[0])} ${n(L0[1])}A${lrx} 11 0 0 1 ${n(L1[0])} ${n(L1[1])}`);
    a += fig('luka', { x: lk, y: lkY, s: lks, face: ['dot', 'worried', 'line'], look: [1, 0.6], out: ol, props: [], light: 'side', so: 0.6, arms: { na: { to: loc(L0), bend: -1 }, fa: { to: loc(L1), bend: -1 } } });
    a += chloe1;
    a += strap(`M${n(L0[0])} ${n(L0[1])}Q${n(L0[0] + 8)} ${n(card[1] - 30)} ${n(card[0] - 4)} ${n(card[1])}M${n(L1[0])} ${n(L1[1])}Q${n(L1[0] - 12)} ${n(card[1] - 30)} ${n(card[0] + 4)} ${n(card[1])}`);
    a += `<g transform="translate(${n(card[0])} ${n(card[1])}) rotate(-7)">${R(-17, 0, 34, 44, '#FFFFFF', st(C.ink, 2))}${R(-17, 0, 34, 10, C.y)}${Tx(0, 33, '2IC', 13, C.ink, 'text-anchor="middle"', FONTS.ui)}${Ci(0, 54, 6, 'none', st('#9AA0A6', 3))}${Pa('M0 60l-5 16l7 3M4 60l10 13', 'none', st('#9AA0A6', 3.5))}</g>`;
    s += pg.panel('a', A, a, { desc: 'Luka lifts his lanyard — keys, the 2IC card — over his own head and puts it over Chloe’s.' });
    s += pg.say({ p: 'a', x: A[0] + 290, y: A[1] + 78, text: 'Roller door. When it goes up, you run. Don’t look back. Don’t count anything. Not steps, not cars, nothing.', who: 'LUKA', w: 400, size: 24, tail: [ol.mouth[0] - 6, ol.mouth[1] - 22] });

    // 2: what are you doing?
    let b = R(B[0], B[1], B[2], B[3], '#0D1117') + glow(B[0] + 170, B[1] + 260, 200, 200, 'gY', 0.18);
    const oc2 = {}, ol2 = {};
    b += fig('luka', { x: B[0] + 280, y: B[1] + 870, s: 1.9, flip: true, face: ['lids', 'worried', 'line'], out: ol2, props: [], light: 'side', so: 0.7 });
    b += fig('chloe', { x: B[0] + 110, y: B[1] + 790, s: 1.75, view: 'front', face: 'worried', out: oc2, props: ['lanyard'], light: 'side', so: 0.5 });
    s += pg.panel('b', B, b, { desc: 'Chloe, the lanyard round her neck now. Luka, calm.' });
    s += pg.say({ p: 'b', x: B[0] + 92, y: B[1] + 58, text: 'What are you doing?', who: 'CHLOE', w: 140, size: 24, tail: [oc2.mouth[0], oc2.mouth[1] - 30] });
    s += pg.say({ p: 'b', x: B[0] + 240, y: B[1] + 132, text: 'What I should’ve done a year ago.', who: 'LUKA', w: 150, size: 23, tail: [ol2.mouth[0] + 6, ol2.mouth[1] - 24], rot: 0.07 });

    // 3: at the stockroom door, hand on it, a small forced smile back at her
    let c = R(Cc[0], Cc[1], Cc[2], Cc[3], '#11151B') + R(Cc[0], Cc[1] + 230, Cc[2], 70, '#181C22');
    c += pC_stockDoor(Cc[0] + 640, Cc[1] + 30, 150, 210, { handle: 'left' });
    c += glow(Cc[0] + 715, Cc[1] + 236, 120, 18, 'gY', 0.5);
    const ok3 = {}, hx3 = Cc[0] + 640 + 150 * 0.13, hy3 = Cc[1] + 30 + 210 * 0.535, lx3 = Cc[0] + 575, ly3 = Cc[1] + 290;
    c += fig('luka', { x: lx3, y: ly3, s: 0.82, view: 'front', face: 'forced', out: ok3, props: [], farms: { r: { to: [(hx3 - lx3) / 0.82, (hy3 - ly3) / 0.82], bend: 1 } }, light: 'side', so: 0.55 });
    c += fig('chloe', { x: Cc[0] + 180, y: Cc[1] + 700, s: 1.75, view: 'back', sil: true, rim: 'yellow', rimDx: 5 });
    s += pg.panel('c', Cc, c, {
      desc: 'Luka at the stockroom door, hand on it. He looks back at Chloe — a small, forced smile.',
      guided: [{ focus: Cc }, { focus: [Cc[0] + 400, Cc[1], 520, Cc[3]], move: 'creep' }],
    });
    s += pg.cap({ p: 'c', x: Cc[0] + Cc[2] - 18, y: Cc[1] + 18, right: true, text: '2:40 AM.', w: 160 });

    // 4: inside, the impossible aisle again — far off, Jarrad turns
    let d = pC_aisle(D, { vx: 0.52, vy: 0.4, seed: 'pC22aisle', still: true });
    const oj = {};
    d += pC_jarrad({ x: D[0] + 300, y: D[1] + 152, s: 0.2, face: 'dead', still: true, out: oj, cables: [[D[0] + 240, D[1] + 120], [D[0] + 360, D[1] + 130], [D[0] + 230, D[1] + 150], [D[0] + 380, D[1] + 112]] });
    d += fig('luka', { x: D[0] + 250, y: D[1] + 420, s: 0.62, view: 'back', sil: true, rim: 'yellow' });
    s += pg.panel('d', D, d, { desc: 'Inside: the impossible aisle again, shelving to a vanishing point. Far off, Jarrad turns.' });
    s += pg.say({ p: 'd', x: D[0] + 150, y: D[1] + 64, text: 'Jarrad! It’s me. I’m staying this time.', who: 'LUKA', w: 220, size: 24, tail: [D[0] + 240, D[1] + 200] });

    // 5: close on Luka, calm, over his shoulder
    let e = R(Eb[0], Eb[1], Eb[2], Eb[3], '#0A0B0E') + glow(Eb[0] + 300, Eb[1] + 170, 220, 260, 'gY', 0.45);
    const ok5 = {};
    e += fig('luka', { x: Eb[0] + 170, y: Eb[1] + 870, s: 2.05, flip: true, face: 'forced', out: ok5, props: [], light: 'side', so: 0.78 });
    s += pg.panel('e', Eb, e, { desc: 'Close on Luka, calm, looking back over his shoulder at Chloe.' });
    s += pg.say({ p: 'e', x: Eb[0] + 196, y: Eb[1] + 62, text: 'You go, mate. I’ll lock up.', who: 'LUKA', w: 170, size: 26, tail: [ok5.head[0] - 40, ok5.head[1] - 30] });

    // 6: the door closing; through the narrowing gap, the two of them together. BEEP. 05.
    const dx0 = F[0] + 330, dw = 240, gap = 110, dy0 = F[1] + 40, dh = 218;
    let f = R(F[0], F[1], F[2], F[3], '#0B0D11') + R(F[0], F[1] + 250, F[2], 60, '#121519');
    f += R(dx0 - 22, F[1] + 26, dw + 44, 232, '#2A2E35', st(C.ink, 3));
    // what the opening shows, clipped to the door frame
    const gcl = uid('pCgap');
    let gapArt = R(dx0, dy0, dw, dh, '#2A2208') + glow(dx0 + 56, dy0 + 110, 160, 140, 'gY', 0.9);
    gapArt += fig('luka', { x: dx0 + 40, y: dy0 + 212, s: 0.5, view: 'side', sil: true });
    gapArt += fig('jarrad', { x: dx0 + 78, y: dy0 + 212, s: 0.68, flip: true, sil: true, pose: 'reach', tilt: 14 });
    f += `<clipPath id="${gcl}"><rect x="${dx0}" y="${dy0}" width="${dw}" height="${dh}"/></clipPath><g clip-path="url(#${gcl})">${gapArt}</g>`;
    f += `<g class="pC-wedge">${Po([[dx0, dy0 + dh], [dx0 + gap, dy0 + dh], [dx0 + gap + 240, F[1] + 306], [dx0 - 60, F[1] + 306]], C.y, 'opacity=".28"')}</g>`;
    // the door leaf, hinged on the right: foreshortened while it stands open, swinging flat to close as you linger
    const leaf = R(dx0, dy0, dw, dh, '#4A5058', st(C.ink, 3)) + R(dx0 + 16, dy0 + 84, 12, 32, '#B9BCC2', st(C.ink, 1.5)) + R(dx0 + 56, dy0 + 26, dw - 96, 34, '#F2EFE6', st(C.ink, 1.5)) + Tx(dx0 + 56 + (dw - 96) / 2, dy0 + 50, 'STOCK', 18, C.ink, 'text-anchor="middle"', FONTS.ui);
    f += `<g class="pC-door" style="transform-origin:${dx0 + dw}px ${dy0}px;--k0:${n((dw - gap) / dw * 1000) / 1000}">${leaf}${R(dx0, dy0, dw, dh, '#000', 'class="pC-doorshade"')}</g>`;
    f += queueTV(F[0] + 650, F[1] + 74, 160, 92, { num: '05', glow: true });
    f += ollie({ x: F[0] + 120, y: F[1] + 290, s: 0.5, dark: true, turn: 1 });
    s += pg.panel('f', F, f, {
      desc: 'The stockroom door closing. Through the narrowing gap: Jarrad’s shape reaching, and the two silhouettes together. The queue TV: 05.',
      guided: [{ focus: [F[0] + 110, F[1], 720, F[3]], move: 'creep' }],
    });
    s += pg.sfx('BEEP', F[0] + 250, F[1] + 128, { size: 120, rot: -3, fill: '#FFF4CC', stroke: '#8C7A3A', sw: 5, op: 0.5, ls: 16, p: 'f' });
    return s;
  },
  mount(ctx) {
    // no horror movement and no sound: only the door, closing as you linger
    const fp = ctx.q('.pn[data-panel="f"]');
    const shut = () => fp && fp.classList.add('pC-shut');
    if (ctx.mode === 'guided') ctx.onPanel('f', () => ctx.after(2500, shut));
    else ctx.dwell(6000, shut);
  },
});

/* ---------- Page 23 — Service Restored (the lie) ---------- */

// A barista for Cafe 63, opening up for the morning. Added to the cast table under a page-scoped key.
CAST.pC_barista = { skin: '#C99A7A', hair: '#3A2A20', hs: 'crop', top: '#3A2E26', pants: '#2A2A30', h: 0.96, w: 1.0, hoodie: true };

function pC_phoneStage(x, y, w, h, kind, o = {}) {
  return phoneObj(x, y, w, h, {
    lit: true, screen: '#FFF6EA', halo: false, rot: o.rot || 0,
    content: (sx, sy, sw, sh) => {
      let c = signalGlyph(sx + sw * 0.08, sy + sh * 0.05, sw / (kind === 'sos' ? 104 : 58), kind === 'sos' ? 'sos' : kind === '3g' ? '3g' : kind === '5g' ? '5g' : 'bars4', kind === 'sos' ? '#B3121F' : C.ink);
      c += Tx(sx + sw / 2, sy + sh * 0.36, kind === 'sos' ? '5:58' : kind === '3g' ? '5:59' : kind === '5g' ? '6:01' : '6:00', sh * 0.15, '#3A2A20', 'text-anchor="middle"', FONTS.ui);
      if (kind !== 'sos') {
        const ny = sy + sh * (kind === '3g' ? 0.6 : 0.48);
        c += R(sx + sw * 0.05, ny, sw * 0.9, sh * 0.2, '#FFFFFF', `rx="${sh * 0.03}" ${st('#D9C9B0', 1.2)}`) + Ci(sx + sw * 0.15, ny + sh * 0.06, sh * 0.03, C.y, st(C.ink, 0.8));
        c += Tx(sx + sw * 0.22, ny + sh * 0.075, 'Optus · now', sh * 0.045, '#666', '', FONTS.ui) + Tx(sx + sw * 0.1, ny + sh * 0.15, 'Service restored ✓', sh * 0.052, C.ink, '', FONTS.ui);
        if (kind !== '3g') c += R(sx + sw * 0.05, ny + sh * 0.22, sw * 0.9, sh * 0.17, '#FFFFFF', `rx="${sh * 0.03}" opacity=".85" ${st('#D9C9B0', 1.2)}`) + Tx(sx + sw * 0.1, ny + sh * 0.33, 'Your service has been…', sh * 0.045, '#444', '', FONTS.ui);
      }
      return c;
    },
  });
}

page(23, {
  title: 'Service Restored', side: 'right', gutter: 'white', bleed: 'dawn', status: 'sos',
  alt: 'Every phone in the store climbs back from SOS only to full 5G: your service has been restored. The roller door rattles up on its own and dawn light spills across the floor. Chloe runs out past Cafe 63, where a barista is putting the chairs out, across the car park, to Redcliffe Jetty at sunrise. 6:02 AM. Gulls, flat water, the bridge lights back on. Chloe, crying and laughing at once, holding Luka’s lanyard. The End.',
  sound: { birds: true, waves: true },
  render(pg) {
    const A = [40, 40, 920, 240], B = [40, 298, 440, 360], Cc = [498, 298, 462, 360], D = [40, 676, 920, 460], Eb = [40, 1154, 920, 226];
    let s = pC_css();

    // 1: SOS only → 1 bar → 4G → 5G
    let a = R(A[0], A[1], A[2], A[3], '#F4DCC6') + R(A[0], A[1], A[2], A[3], 'url(#gDawn)', 'opacity=".55"');
    a += Pa(`M${A[0] + 640} ${A[1]}L${A[0] + 760} ${A[1]}L${A[0] + 440} ${A[1] + A[3]}L${A[0] + 260} ${A[1] + A[3]}Z`, '#FFF4D6', 'opacity=".55"');
    a += R(A[0], A[1] + 196, A[2], 44, '#E2C7AE') + Ln(A[0], A[1] + 196, A[0] + A[2], A[1] + 196, '#B89A80', 3);
    ['sos', '3g', 'bars4', '5g'].forEach((k, i) => {
      a += pC_phoneStage(A[0] + 70 + i * 222, A[1] + 24, 118, 196, k, { rot: [-4, 2, -2, 3][i] });
      if (i < 3) a += Pa(`M${A[0] + 206 + i * 222} ${A[1] + 120}h44l-10 -9M${A[0] + 250 + i * 222} ${A[1] + 120}l-10 9`, 'none', st('#B07A50', 4));
    });
    s += pg.panel('a', A, a, { desc: 'Every phone in the store: SOS only, then one bar, then 4G, then 5G. Notifications flood in: your service has been restored.' });

    // 2: the roller door rattles up on its own; grey-gold dawn spills across the floor
    let b = storeInterior(B, {
      day: true, night: 0.16, tint: '#6A3A1A', vx: 0.5, vy: 0.4, bw: 0.48, bh: 0.5, door: 'half', rain: false, vig: 0.35, left: 'acc', right: 'display', litScreens: true,
      outside: (gx, gy, gw, gh) => R(gx, gy, gw, gh, 'url(#gDawn)') + Ci(gx + gw * 0.7, gy + gh * 0.8, gh * 0.18, '#FFE2A8', 'class="pC-bloom"'),
      ollie: (bl, bt, bw, bh) => ollie({ x: bl + bw * 0.14, y: bt + bh * 0.99, s: bh / 560, turn: 1 }),
    });
    b += Po([[B[0] + 140, B[1] + 228], [B[0] + 300, B[1] + 228], [B[0] + 460, B[1] + 370], [B[0] - 20, B[1] + 370]], '#FFD58A', 'opacity=".45"');
    b += glow(B[0] + 220, B[1] + 240, 240, 60, 'gWarm', 0.7);
    s += pg.panel('b', B, b, { desc: 'The roller door rattling up on its own. Grey-gold dawn light spilling across the floor.' });
    s += pg.sfx('rrrattle', B[0] + 220, B[1] + 120, { size: 34, rot: -3, fill: '#FFF4D6', stroke: '#8C5A30', sw: 4, p: 'b' });

    // 3: out through the mall, past Cafe 63, across the car park
    let c = R(Cc[0], Cc[1], Cc[2], Cc[3], 'url(#gDawn)');
    c += cafe63([Cc[0] + 10, Cc[1] + 40, 220, 220], { lights: 4, steam: true, cups: false });
    c += R(Cc[0] + 230, Cc[1] + 40, 240, 220, '#E9B9A0', 'opacity=".35"');
    c += R(Cc[0], Cc[1] + 260, Cc[2], 100, '#5A4A58');
    [[Cc[0] + 330, Cc[1] + 300, 70, 10], [Cc[0] + 150, Cc[1] + 335, 90, 12], [Cc[0] + 400, Cc[1] + 345, 50, 8]].forEach(([x, y, rx, ry]) => { c += E(x, y, rx, ry, '#F6B6A6', 'opacity=".75"') + E(x, y, rx * 0.5, ry * 0.4, '#FFE2C8', 'class="pC-shim"'); });
    const obar = {};
    c += fig('pC_barista', { x: Cc[0] + 120, y: Cc[1] + 296, s: 0.62, face: ['closed', 'raised', 'smile'], props: [], arms: { na: [64, 168] }, out: obar, light: 'side', so: 0.3 });
    c += R(Cc[0] + 150, Cc[1] + 240, 34, 6, '#2A2A30') + Ln(Cc[0] + 154, Cc[1] + 246, Cc[0] + 150, Cc[1] + 290, '#2A2A30', 3) + Ln(Cc[0] + 180, Cc[1] + 246, Cc[0] + 184, Cc[1] + 290, '#2A2A30', 3);
    c += fig('chloe', { x: Cc[0] + 330, y: Cc[1] + 340, s: 0.9, pose: 'run', face: 'worried', props: ['lanyard'], light: 'front', so: 0.35 });
    c += Pa(`M${Cc[0] + 200} ${Cc[1] + 150}h60M${Cc[0] + 190} ${Cc[1] + 190}h70M${Cc[0] + 205} ${Cc[1] + 230}h50`, 'none', st('#FFF4D6', 3, 'opacity=".7"'));
    s += pg.panel('c', Cc, c, { desc: 'Chloe running through the mall — past Cafe 63, where a barista putting the chairs out for the morning gives her a sleepy wave — and across the car park, puddles reflecting a pink sky.' });

    // 4: Redcliffe Jetty at sunrise
    let d = R(D[0], D[1], D[2], D[3] * 0.56, 'url(#gDawn)');
    const hz = D[1] + D[3] * 0.56;
    d += `<g class="pC-bloom">${glow(D[0] + 640, hz - 6, 220, 140, 'gWarm', 0.9)}${Ci(D[0] + 640, hz, 48, '#FFE7B0')}</g>`;
    d += R(D[0], hz, D[2], D[3] * 0.44, 'url(#gSeaDawn)');
    for (let i = 0; i < 12; i++) {
      const y = hz + 8 + i * i * 2.2 + i * 6, w = 40 + i * 18;
      d += R(D[0] + 640 - w / 2 + ((i * 37) % 30) - 15, y, w, 2 + i * 0.2, '#FFE2B8', `class="pC-shim" style="animation-delay:${(i * 0.3).toFixed(1)}s"`);
    }
    // the bridge, its lights back on
    d += Pa(`M${D[0] + 760} ${hz - 4}L${D[0] + 920} ${hz - 9}`, 'none', st('#6A5A6A', 3));
    for (let i = 0; i < 12; i++) d += Ci(D[0] + 768 + i * 13, hz - 6 - i * 0.4, 1.6, '#FFF4D6');
    // the jetty
    d += Po([[D[0] - 10, D[1] + 470], [D[0] + 300, D[1] + 430], [D[0] + 470, hz - 2], [D[0] + 452, hz - 2]], '#4A3A44', st('#2A2026', 2));
    for (let k = 0; k <= 14; k++) {
      const t = persp(k / 14, 6), lx = lerp(D[0] + 10, D[0] + 455, t), ly = lerp(D[1] + 466, hz - 2, t), rx = lerp(D[0] + 300, D[0] + 470, t), ry = lerp(D[1] + 430, hz - 2, t);
      d += Ln(lx, ly, lx, ly + lerp(70, 6, t), '#3A2C34', lerp(7, 1, t)) + Ln(rx, ry, rx, ry + lerp(60, 5, t), '#3A2C34', lerp(7, 1, t));
      if (k % 3 === 1) d += Ln(rx - 4, ry, rx - 4, ry - lerp(100, 9, t), '#3A2C34', lerp(4, 0.8, t));
    }
    d += Pa(`M${D[0] - 10} ${D[1] + 410}L${D[0] + 456} ${hz - 10}M${D[0] + 300} ${D[1] + 372}L${D[0] + 470} ${hz - 10}`, 'none', st('#3A2C34', 4));
    d += fig('chloe', { x: D[0] + 250, y: D[1] + 420, s: 0.66, pose: 'hold', face: 'sad', props: ['lanyard'], light: 'front', so: 0.4 });
    // gulls
    [[D[0] + 120, D[1] + 90, 2.2, 0], [D[0] + 300, D[1] + 60, 1.6, -4], [D[0] + 520, D[1] + 140, 1.3, -8], [D[0] + 760, D[1] + 70, 1.8, -2], [D[0] + 640, D[1] + 40, 1.1, -11]].forEach(([x, y, k, dl]) => {
      d += `<g class="pC-gull" style="animation-delay:${dl}s"><g class="pC-flap" style="animation-delay:${dl * 0.1}s"><path d="M${x - 16 * k} ${y}q${8 * k} -9 ${16 * k} 0q${8 * k} -9 ${16 * k} 0" fill="none" stroke="#3A2C34" stroke-width="${2.6 * k}" stroke-linecap="round"/></g></g>`;
    });
    s += pg.panel('d', D, d, { desc: 'Redcliffe Jetty at sunrise. Gulls. Flat, calm water. The bridge lights are back on. Chloe at the rail, breathing.' });
    s += pg.cap({ p: 'd', x: 64, y: 700, text: '6:02 AM.', w: 160 });

    // 5: crying and laughing at once, holding Luka's lanyard — THE END
    let e = R(Eb[0], Eb[1], Eb[2], Eb[3], 'url(#gDawn)') + glow(Eb[0] + 700, Eb[1] + 60, 300, 200, 'gWarm', 0.8);
    const oe = {};
    e += fig('chloe', { x: Eb[0] + 520, y: Eb[1] + 744, s: 2.2, view: 'front', face: 'laugh', tears: true, out: oe, props: [], light: 'side', so: 0.3 });
    const lx = Eb[0] + 360, ly = Eb[1] + 70;
    e += Pa(`M${lx} ${ly}C${lx + 30} ${ly - 50} ${lx + 120} ${ly - 40} ${n(oe.head[0] - 30)} ${n(oe.head[1] + 70)}`, 'none', st(C.ink, 9)) + Pa(`M${lx} ${ly}C${lx + 30} ${ly - 50} ${lx + 120} ${ly - 40} ${n(oe.head[0] - 30)} ${n(oe.head[1] + 70)}`, 'none', st(C.y, 6));
    e += `<g transform="translate(${lx} ${ly}) rotate(-10)">${R(-28, 0, 56, 76, '#FFFFFF', st(C.ink, 2.5))}${R(-28, 0, 56, 16, C.y)}${Tx(0, 52, '2IC', 22, C.ink, 'text-anchor="middle"', FONTS.ui)}</g>`;
    e += Ci(lx + 30, ly + 70, 22, '#EEC7A6', st(C.ink, 3.5)) + Pa(`M${lx + 6} ${ly + 86}C${lx + 20} ${ly + 140} ${lx + 60} ${ly + 160} ${lx + 70} ${ly + 200}L${lx + 120} ${ly + 200}C${lx + 100} ${ly + 150} ${lx + 70} ${ly + 110} ${lx + 52} ${ly + 76}Z`, '#6B7076', st(C.ink, 3.5));
    s += pg.panel('e', Eb, e, { desc: 'Chloe, crying and laughing at once, holding Luka’s lanyard.', guided: [{ focus: [40, 1154, 920, 306], move: 'glide' }] });
    s += `<g class="pC-end">${Tx(500, 1438, 'THE END', 56, C.ink, 'text-anchor="middle" letter-spacing="14"', FONTS.speech)}</g>`;
    pg.lines.push({ who: 'CAPTION', text: 'THE END' });
    return s;
  },
  mount(ctx) {
    ctx.ticket('hide');
    // the comic's own status icon climbs back to full bars, with the tab icon
    ctx.onPanel('a', () => { ['3g', 'bars', 'full'].forEach((k, i) => ctx.after(700 + i * 700, () => ctx.status(k))); }, 300);
    ctx.onPanel('b', () => ctx.sfx('door', { v: 0.5 }), 1600);
    ctx.onPanel('e', () => { const t = ctx.q('.pC-end'); if (t) t.classList.add('go'); }, 2400);
    // a convincing end card... that changes its mind
    const card = () => {
      if (ctx.el.querySelector('.pC-endcard')) return;
      const el = document.createElement('div');
      el.className = 'pC-endcard';
      el.innerHTML = '<b>Thanks for reading</b><small>SOS ONLY · An OG original</small><button type="button">Read again</button>';
      ctx.el.append(el);
      requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('on')));
      const btn = el.querySelector('button');
      btn.onclick = () => ctx.next();
      ctx.after(3000, () => { btn.textContent = 'Please hold…'; ctx.after(1700, () => ctx.next()); });
    };
    if (ctx.mode === 'guided') ctx.onPanel('e', () => ctx.after(2800, card));
    else ctx.dwell(ctx.mode === 'spread' ? 30000 : 12000, card);
  },
});

/* ---------- Page 24 — Now Serving 06 ---------- */

// Code Rot back in the gutters, worse than before.
function pC_gutterRot(spots, seed, grow = 10) {
  return spots.map(([x, y, reach, count], i) => rotPatch({ x, y, reach, count: count || 40, size: 14, seed: `${seed}${i}`, grow, delay: i * 0.6, box: [x - reach, y - reach, reach * 2, reach * 2] })).join('');
}

// A hand holding a phone up close, the hoodie sleeve pulled over the wrist. Fingers wrap the lower half so the
// notification stays clear.
function pC_handPhone(x, y, s, screen) {
  const skin = '#EEC7A6';
  let g = '';
  g += Pa('M-120 300 C-110 210 -96 170 -70 150 L80 150 C104 176 116 230 120 300 Z', '#6B7076', st(C.ink, 5));
  g += Pa('M-92 40 C-112 120 -92 176 -40 186 L60 186 C100 170 112 120 96 40 Z', skin, st(C.ink, 4));
  g += phoneObj(-78, -200, 156, 300, { lit: true, screen: '#F4F6F8', halo: false, content: screen });
  [10, 38, 66].forEach((fy) => { g += R(-96, fy, 34, 28, skin, `rx="14" ${st(C.ink, 3.2)}`); });
  g += `<g transform="translate(86 54) rotate(-24)">${R(-16, -60, 32, 76, skin, `rx="16" ${st(C.ink, 3.2)}`)}</g>`;
  return `<g transform="translate(${n(x)} ${n(y)}) scale(${s})">${g}</g>`;
}

// A palm and splayed fingers flattened against the glass from outside.
function pC_palm(x, y, k, ang = 0) {
  const fill = '#CDBBAA', o = st(C.ink, 1.8);
  let g = '';
  [[-15, -26, -14], [-5, -31, -4], [5, -30, 5], [14, -25, 14]].forEach(([fx, fy, a]) => { g += `<g transform="translate(${fx} ${fy}) rotate(${a})">${R(-4.5, -15, 9, 24, fill, `rx="4.5" ${o}`)}</g>`; });
  g += `<g transform="translate(-21 4) rotate(-48)">${R(-4.5, -14, 9, 20, fill, `rx="4.5" ${o}`)}</g>`;
  g += E(0, 0, 18, 20, fill, o) + E(-2, 2, 9, 10, '#E4D6C8', 'opacity=".7"');
  return `<g transform="translate(${n(x)} ${n(y)}) rotate(${ang}) scale(${n(k * 1000) / 1000})" opacity=".92">${g}</g>`;
}

// A queue TV laid out for a name and a line of small print.
function pC_tvBig(x, y, w, h, num, name, sub) {
  let s = Ln(x + w * 0.3, y - 40, x + w * 0.3, y, '#333', 4) + Ln(x + w * 0.7, y - 40, x + w * 0.7, y, '#333', 4);
  s += glow(x + w / 2, y + h / 2, w * 0.9, h * 0.9, 'gY', 0.35);
  s += R(x - 6, y - 6, w + 12, h + 12, '#16171B', `rx="6" ${st(C.ink, 3)}`) + R(x, y, w, h, 'url(#gTVY)', 'rx="2" class="lit"');
  s += Tx(x + w / 2, y + h * 0.17, 'NOW SERVING', h * 0.11, C.ink, 'text-anchor="middle" letter-spacing="2"', FONTS.ui);
  s += Tx(x + w / 2, y + h * 0.56, num, h * 0.4, C.ink, 'text-anchor="middle"', FONTS.mono);
  if (name) s += Tx(x + w / 2, y + h * 0.75, name, h * 0.13, C.ink, 'text-anchor="middle" letter-spacing="3"', FONTS.ui);
  if (sub) s += Tx(x + w / 2, y + h * 0.9, sub, h * 0.075, '#4A3A00', 'text-anchor="middle" letter-spacing="1"', FONTS.ui);
  return s;
}

// The warm light left over from page 23, draining from the edges inward over two seconds: a dawn wash screened
// over the night art, its soft edge shrinking towards the centre until it's night again.
function pC_drain() {
  const gid = uid('pCwarm');
  return `<defs><radialGradient id="${gid}"><stop offset="0" stop-color="#FFD9A0" stop-opacity=".9"/><stop offset=".62" stop-color="#F6B6A6" stop-opacity=".82"/><stop offset=".86" stop-color="#C98FA6" stop-opacity=".45"/><stop offset="1" stop-color="#C98FA6" stop-opacity="0"/></radialGradient></defs>` +
    `<g class="pC-drain" pointer-events="none" style="mix-blend-mode:screen"><ellipse cx="500" cy="760" rx="1000" ry="1420" fill="url(#${gid})"/></g>`;
}

page(24, {
  title: 'Now Serving 06', side: 'left', gutter: 'black', bleed: 'dark', status: 'sos',
  alt: 'On the jetty, Chloe’s phone buzzes: your service has been restored, please proceed to the counter. She looks up. She isn’t on the jetty. She is behind the counter in the store, lights low, the clock at 3:00, the roller door down. The Customers are pressed against the front glass, holding tickets. Every table in Cafe 63 is full. The queue TV: now serving 06, Chloe, please proceed to counter. She looks down at the lanyard round her neck. 2IC. Somebody has to close.',
  sound: { hum: true, rain: true },
  render(pg) {
    const A = [40, 40, 920, 300], B = [40, 358, 920, 440], Cc = [40, 816, 560, 360], D = [618, 816, 342, 360], Eb = [40, 1194, 920, 266];
    let s = pC_css();

    // 1: the phone buzzes on the jetty — close enough to read
    let a = R(A[0], A[1], A[2], A[3], 'url(#gDawn)') + R(A[0], A[1] + 200, A[2], 100, 'url(#gSeaDawn)');
    a += Po([[A[0] - 10, A[1] + 300], [A[0] + 380, A[1] + 300], [A[0] + 560, A[1] + 200], [A[0] + 540, A[1] + 200]], '#4A3A44');
    const PX = A[0] + 610, PY = A[1] + 248, PS = 1.1;
    a += pC_handPhone(PX, PY, PS, (sx, sy, sw, sh) => {
      let c = signalGlyph(sx + 8, sy + 8, 1.4, '5g', C.ink) + Tx(sx + sw / 2, sy + 62, '6:03', 38, '#3A2A20', 'text-anchor="middle"', FONTS.ui);
      const body = ['Your service has', 'been restored.'], ask = ['Please proceed', 'to the counter.'];
      const fit = (ls, max) => Math.min(max, (sw - 22) / Math.max(...ls.map((l) => textW(l, 1, FONTS.ui))));
      const f1 = fit(body, 15), f2 = fit(ask, 17);
      const ch = 34 + f1 * 2.3 + f2 * 2.4;
      c += R(sx + 5, sy + 78, sw - 10, ch, '#FFFFFF', `rx="10" ${st('#C9B9A0', 2)}`) + Ci(sx + 19, sy + 94, 6.5, C.y, st(C.ink, 1.5)) + Tx(sx + 31, sy + 98, 'Optus · now', 11, '#666', '', FONTS.ui);
      c += textLines(body, sx + sw / 2, sy + 112 + f1 * 1.1, f1, '#333', { font: FONTS.ui, lh: 1.15 });
      c += textLines(ask, sx + sw / 2, sy + 116 + f1 * 2.3 + f2 * 1.1, f2, C.ink, { font: FONTS.ui, lh: 1.12 });
      return c;
    });
    const pl = PX - 78 * PS, pr = PX + 78 * PS;
    a += Pa(`M${pl - 18} ${A[1] + 70}l-26 -12M${pl - 22} ${A[1] + 120}l-32 0M${pl - 18} ${A[1] + 170}l-26 12M${pr + 18} ${A[1] + 70}l26 -12M${pr + 22} ${A[1] + 120}l32 0M${pr + 18} ${A[1] + 170}l26 12`, 'none', st(C.ink, 4));
    s += pg.panel('a', A, a, {
      desc: 'At the jetty, Chloe’s phone buzzes in her hand. Optus: Your service has been restored. Please proceed to the counter.',
      guided: [{ focus: [A[0] + 250, A[1], 640, A[3]] }, { focus: [pl - 24, A[1], pr - pl + 48, A[3]], move: 'creep' }],
    });
    s += pg.sfx('bzzt', A[0] + 300, A[1] + 90, { size: 40, rot: -12, fill: '#FFFFFF', p: 'a' }) + pg.sfx('bzzt', A[0] + 840, A[1] + 230, { size: 34, rot: 10, fill: '#FFFFFF', p: 'a', log: false });

    // 2: she looks up. She isn't on the jetty. She's behind the counter.
    let b = storeInterior(B, {
      night: 0.7, vx: 0.56, vy: 0.4, bw: 0.4, bh: 0.48, lights: [0, 0, 1, 0, 0, 0], flicker2: 2, left: 'acc', right: 'display',
      ollie: (bl, bt, bw, bh) => ollie({ x: bl + bw * 0.62, y: bt + bh * 0.99, s: bh / 470, dark: true, turn: -1 }),
    });
    // the wall clock: 3:00
    const ck = [B[0] + 150, B[1] + 92];
    b += Ci(ck[0], ck[1], 44, '#E9E6DE', st(C.ink, 5)) + [...Array(12)].map((_, i) => { const a2 = (i / 12) * Math.PI * 2; return Ln(ck[0] + Math.sin(a2) * 34, ck[1] - Math.cos(a2) * 34, ck[0] + Math.sin(a2) * 40, ck[1] - Math.cos(a2) * 40, C.ink, 2.4); }).join('');
    b += Ln(ck[0], ck[1], ck[0], ck[1] - 32, C.ink, 4) + Ln(ck[0], ck[1], ck[0] + 22, ck[1], C.ink, 5) + Ci(ck[0], ck[1], 4, C.laser);
    b += fig('chloe', { x: B[0] + 300, y: B[1] + 830, s: 1.9, face: 'shock', props: ['lanyard'], tilt: -10, light: 'top', so: 0.7, look: [1, -1] });
    b += counterFore(B, { y: B[1] + 384, tilt: -4, dark: true });
    s += pg.panel('b', B, b, {
      desc: 'She looks up. She isn’t on the jetty. She’s behind the counter in the store. Lights low. The wall clock says 3:00. The roller door is down.',
      guided: [{ focus: [B[0], B[1], 520, B[3]], move: 'cut' }, { focus: [B[0] + 380, B[1], 540, B[3]] }],
    });

    // 3: the Customers, pressed against the glass. Every table in Cafe 63 is full.
    let c = R(Cc[0], Cc[1], Cc[2], Cc[3], '#05070A');
    c += cafe63([Cc[0] + 330, Cc[1] + 30, 220, 170], { lights: 1, full: true });
    c += queueLine({ x0: Cc[0] + 300, y0: Cc[1] + 300, s0: 0.5, x1: Cc[0] + 160, y1: Cc[1] + 140, s1: 0.1, count: 9, seed: 'pC24q', fadeFar: 0.3, ease: 0.7 });
    [[Cc[0] + 90, 1.05, 'hivis'], [Cc[0] + 250, 1.1, 'suit'], [Cc[0] + 430, 1.0, 'gown']].forEach(([x, k, kind], i) => {
      const hy = Cc[1] + 190 + (i % 2) * 20;
      c += customer({ x, y: hy + 318 * k, s: k, kind, seed: `pC24c${i}`, faceOp: 0.95 });
      // palms flattened against the glass
      c += pC_palm(x - 48 * k, hy + 30 * k, 1.05 * k, -14) + pC_palm(x + 48 * k, hy + 24 * k, 1.05 * k, 12);
    });
    c += rainFx(Cc, { op: 0.5, op2: 0.35 }) + glassDrops(Cc, 'pC24g', 40) + R(Cc[0], Cc[1], Cc[2], Cc[3], '#9FC9DE', 'opacity=".08"');
    c += Ln(Cc[0] + 280, Cc[1], Cc[0] + 280, Cc[1] + Cc[3], '#1C1E22', 8);
    s += pg.panel('c', Cc, c, { desc: 'The front glass: the Customers, pressed against it, all holding tickets, their faces frozen and smeared like a dropped call, the line stretching down the corridor into darkness. Across the walkway, every table in Cafe 63 is full again.' });

    // 4: NOW SERVING 06 — CHLOE
    let d = R(D[0], D[1], D[2], D[3], '#07080A');
    d += pC_tvBig(D[0] + 26, D[1] + 90, 290, 200, '06', 'CHLOE', 'PLEASE PROCEED TO COUNTER');
    d += rotPatch({ x: D[0] + 316, y: D[1] + 280, box: [D[0] + 26, D[1] + 90, 290, 190], reach: 140, count: 36, size: 12, seed: 'pC24tv', grow: 10, delay: 1 });
    s += pg.panel('d', D, d, { desc: 'The queue TV: NOW SERVING 06 — CHLOE — PLEASE PROCEED TO COUNTER.' });
    s += pg.sfx('BING-BONG', D[0] + 170, D[1] + 60, { size: 38, rot: -4, fill: C.y, p: 'd' });

    // 5: she looks down at the lanyard round her neck — 2IC
    let e = R(Eb[0], Eb[1], Eb[2], Eb[3], '#0A0C10') + glow(Eb[0] + 600, Eb[1] + 120, 260, 200, 'gY', 0.18);
    const oe = {};
    e += fig('chloe', { x: Eb[0] + 700, y: Eb[1] + 820, s: 2.3, flip: true, face: ['dot', 'worried', 'tremble'], look: [0.8, 1], tilt: 16, props: [], light: 'top', so: 0.75, tears: true, out: oe });
    const cx5 = Eb[0] + 545, cy5 = Eb[1] + 150;
    e += Pa(`M${n(oe.head[0] - 26)} ${n(oe.head[1] + 78)}Q${n(cx5 + 20)} ${n(cy5 + 30)} ${n(cx5 - 30)} ${n(cy5 - 6)}M${n(oe.head[0] + 34)} ${n(oe.head[1] + 84)}Q${n(cx5 + 60)} ${n(cy5 + 70)} ${n(cx5 + 30)} ${n(cy5 - 8)}`, 'none', st(C.ink, 11) + ' ' + '') + Pa(`M${n(oe.head[0] - 26)} ${n(oe.head[1] + 78)}Q${n(cx5 + 20)} ${n(cy5 + 30)} ${n(cx5 - 30)} ${n(cy5 - 6)}M${n(oe.head[0] + 34)} ${n(oe.head[1] + 84)}Q${n(cx5 + 60)} ${n(cy5 + 70)} ${n(cx5 + 30)} ${n(cy5 - 8)}`, 'none', st(C.y, 7));
    e += `<g transform="translate(${cx5} ${cy5}) rotate(-8)">${R(-46, -10, 92, 110, '#FFFFFF', st(C.ink, 3.5))}${R(-46, -10, 92, 24, C.y)}${Tx(0, 70, '2IC', 40, C.ink, 'text-anchor="middle"', FONTS.ui)}</g>`;
    s += pg.panel('e', Eb, e, {
      desc: 'Chloe looks down at the lanyard round her neck. 2IC.',
      guided: [{ focus: [Eb[0] + 420, Eb[1], 500, Eb[3]], move: 'creep' }, { focus: [Eb[0], Eb[1], 520, Eb[3]] }],
    });
    s += pg.cap({ p: 'e', x: 70, y: 1222, text: 'Somebody has to close.', style: 'entity', w: 330, size: 26 });
    s += pg.cap({ p: 'e', x: 70, y: 1430, bottom: true, text: '2IC. Short for “there’s no one else.”', style: 'entity', w: 330, size: 26 });

    // the rot is back in the gutters, worse than before
    s += pC_gutterRot([[609, 349, 60], [49, 807, 80], [609, 1185, 70], [960, 520, 70, 30], [320, 1185, 50, 30]], 'pC24gr', 9);
    s += pC_drain();
    return s;
  },
  mount(ctx) {
    ctx.status('sos');
    ctx.ticket('back');
    ctx.onPanel('a', () => { ctx.haptic('thump'); ctx.sfx('thump', { v: 0.4 }); }, 300);
    ctx.onPanel('d', () => ctx.sfx('chime'), 3000);
  },
});

/* ---------- Page 25 — Next Please ---------- */

// A demo phone with someone pressed against the glass from the inside.
function pC_faceInPhone(x, y, w, h, who) {
  const cid = uid('pCfp');
  const sc = h / 150;
  let inner = R(x, y, w, h, '#0E1A22');
  inner += fig(who, { x: x + w / 2, y: y + h * 0.46 + 318 * sc * CAST[who].h, s: sc, view: 'front', face: ['wide', 'worried', 'scream'], light: 'none', props: [] });
  inner += E(x + w * 0.12, y + h * 0.66, w * 0.17, h * 0.13, '#E8D2C0', `opacity=".9" ${st(C.ink, 1.2)}`) + E(x + w * 0.88, y + h * 0.64, w * 0.17, h * 0.13, '#E8D2C0', `opacity=".9" ${st(C.ink, 1.2)}`);
  inner += R(x, y, w, h, C.screen, 'opacity=".22"') + E(x + w / 2, y + h * 0.82, w * 0.4, h * 0.08, '#FFFFFF', 'opacity=".25"');
  let s = R(x - w * 0.08, y - h * 0.06, w * 1.16, h * 1.12, '#141518', `rx="${w * 0.14}" ${st(C.ink, 2)}`);
  s += `<clipPath id="${cid}"><rect x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${n(h)}" rx="${n(w * 0.08)}"/></clipPath><g clip-path="url(#${cid})" class="lit">${inner}</g>`;
  s += glow(x + w / 2, y + h / 2, w * 1.3, h * 0.9, 'gS', 0.3);
  return s;
}

page(25, {
  title: 'Next Please', side: 'right', gutter: 'black', bleed: 'dark', status: 'sos',
  alt: 'Chloe wipes her face, straightens the lanyard and puts on the retail smile like a mask. The doors slide open and the first Customer steps in, dripping. “Hi! Welcome to Optus. Can I get you a water while you wait?” Bay water pours from its sleeves across the counter. Behind her, six demo phones show faces pressed against the glass from inside: Zane, Luke, Zee, Chase, Luka, Jarrad. She serves. The Customer is gone. The queue TV ticks over: now serving 07. Chloe looks up, straight out of the page. “…How can I help you today?”',
  sound: { hum: true, rain: true },
  render(pg) {
    const A = [40, 40, 440, 330], B = [498, 40, 462, 330], Cc = [40, 388, 920, 430], D = [40, 836, 920, 220], Eb = [40, 1074, 920, 386];
    let s = pC_css();

    // 1: tears still wet, she straightens the lanyard and puts the retail smile on like a mask
    let a = R(A[0], A[1], A[2], A[3], '#0B0E13') + glow(A[0] + 220, A[1] + 120, 220, 200, 'gY', 0.18);
    a += fig('chloe', { x: A[0] + 220, y: A[1] + 800, s: 2.25, view: 'front', face: ['dot', 'worried', 'grin'], tears: true, props: ['lanyard'], light: 'side', so: 0.6, farms: { r: { to: [12, -244], bend: 1 } } });
    s += pg.panel('a', A, a, { desc: 'Chloe wipes her face and straightens the lanyard. She puts the retail smile on like a mask.' });

    // 2: the doors slide open; the first Customer steps in, dripping
    let b = R(B[0], B[1], B[2], B[3], '#05070A');
    b += queueLine({ x0: B[0] + 250, y0: B[1] + 230, s0: 0.42, x1: B[0] + 200, y1: B[1] + 150, s1: 0.1, count: 8, seed: 'pC25q', fadeFar: 0.2, ease: 0.7, offset: 3 });
    b += R(B[0] + 40, B[1] + 20, 150, 300, '#1A242E', `opacity=".9" ${st(C.ink, 4)}`) + R(B[0] + 290, B[1] + 20, 150, 300, '#1A242E', `opacity=".9" ${st(C.ink, 4)}`);
    b += glassDrops([B[0] + 40, B[1] + 20, 150, 300], 'pC25d1', 14) + glassDrops([B[0] + 290, B[1] + 20, 150, 300], 'pC25d2', 14);
    b += Pa(`M${B[0] + 196} ${B[1] + 170}l-26 0l8 -8M${B[0] + 284} ${B[1] + 170}l26 0l-8 -8`, 'none', st('#8AA0B0', 3));
    b += customer({ x: B[0] + 240, y: B[1] + 420, s: 1.05, kind: 'wind', seed: 'pC25first', faceOp: 0.9 });
    b += E(B[0] + 240, B[1] + 328, 90, 10, '#16303F', 'opacity=".9"');
    s += pg.panel('b', B, b, { desc: 'The front doors slide open with a soft chime. The first Customer steps in, dripping.' });
    s += pg.sfx('ding', B[0] + 380, B[1] + 70, { size: 34, rot: 6, fill: '#FFFFFF', sw: 4, p: 'b' });

    // 3: "Hi! Welcome to Optus. Can I get you a water while you wait?" — and six faces in the display wall behind her
    let c = R(Cc[0], Cc[1], Cc[2], Cc[3], '#07090C');
    const WL = [Cc[0] + 420, Cc[1] + 20, 370, 262];
    c += R(WL[0], WL[1], WL[2], WL[3], '#1A1E25', st(C.ink, 3)) + R(WL[0], WL[1], WL[2], 22, '#3A3410');
    ['zane', 'luke', 'zee', 'chase', 'luka', 'jarrad'].forEach((w, i) => { c += pC_faceInPhone(WL[0] + 34 + (i % 3) * 114, WL[1] + 44 + Math.floor(i / 3) * 110, 66, 92, w); });
    c += customer({ x: Cc[0] + 180, y: Cc[1] + 560, s: 1.3, kind: 'wind', seed: 'pC25first', flip: false, faceOp: 0.95 });
    // the Ollie standee has got behind the counter now, in the dark beside the display wall
    c += ollie({ x: Cc[0] + 366, y: Cc[1] + 312, s: 0.4, dark: true, turn: 1 });
    const och = {};
    c += fig('chloe', { x: Cc[0] + 830, y: Cc[1] + 590, s: 1.35, flip: true, face: ['dot', 'worried', 'grin'], tears: true, props: ['lanyard'], out: och, pose: 'holdOne', light: 'side', so: 0.5 });
    c += counterObj(Cc[0] - 10, Cc[1] + 310, Cc[2] + 20, 130, { dark: true });
    // bay water pouring from the sleeves, pooling across the counter round her hands
    c += Pa(`M${Cc[0] + 222} ${Cc[1] + 270}C${Cc[0] + 236} ${Cc[1] + 290} ${Cc[0] + 230} ${Cc[1] + 304} ${Cc[0] + 244} ${Cc[1] + 316}`, 'none', st('#1E3A4A', 12, 'opacity=".9"'));
    c += Pa(`M${Cc[0] + 180} ${Cc[1] + 316}C${Cc[0] + 300} ${Cc[1] + 306} ${Cc[0] + 520} ${Cc[1] + 310} ${Cc[0] + 720} ${Cc[1] + 314}C${Cc[0] + 800} ${Cc[1] + 316} ${Cc[0] + 810} ${Cc[1] + 326} ${Cc[0] + 720} ${Cc[1] + 328}C${Cc[0] + 520} ${Cc[1] + 332} ${Cc[0] + 300} ${Cc[1] + 330} ${Cc[0] + 180} ${Cc[1] + 326}Z`, '#16303F', `opacity=".95" ${st('#2E5468', 2)}`);
    c += Pa(`M${Cc[0] + 330} ${Cc[1] + 326}q4 30 0 54M${Cc[0] + 560} ${Cc[1] + 328}q-3 22 0 44`, 'none', st('#16303F', 5));
    c += `<g transform="translate(${Cc[0] + 470} ${Cc[1] + 250})">${R(-14, 0, 28, 64, '#2A3A40', `rx="8" ${st(C.ink, 2.5)}`)}${R(-8, -12, 16, 14, '#1A6A9A', st(C.ink, 2))}${R(-14, 22, 28, 18, '#F2F2EE')}${Tx(0, 35, 'OWS', 10, C.ink, 'text-anchor="middle"', FONTS.ui)}</g>`;
    s += pg.panel('c', Cc, c, {
      desc: 'Chloe, smile fixed, tears on her cheeks, across the counter from the Customer. Its sleeves pour bay water across the counter, pooling around her hands. Behind her, on the display wall, six demo phones show faces pressed against the glass from inside: Zane. Luke. Zee. Chase. Luka. Jarrad.',
      guided: [{ focus: [Cc[0] + 590, Cc[1], 330, Cc[3]] }],
    });
    s += pg.say({ p: 'c', x: Cc[0] + 846, y: Cc[1] + 60, text: 'Hi! Welcome\nto Optus.', who: 'CHLOE', w: 180, size: 24, tail: [och.mouth[0] + 4, och.mouth[1] - 30] });
    // guided view: the offer and the water pouring, then a slow push in on the six faces behind her
    // (the offer is framed with Chloe in it, so the line has a visible speaker on a phone)
    pg.stop('cW', [Cc[0] + 420, Cc[1] + 70, 500, 360]);
    pg.stop('cF', [WL[0] - 10, WL[1] - 8, WL[2] - 46, WL[3] + 16], { move: 'creep' });
    s += pg.say({ p: 'cW', x: Cc[0] + 620, y: Cc[1] + 384, text: 'Can I get you a water\nwhile you wait?', who: 'CHLOE', w: 320, size: 24, tail: [och.mouth[0] - 10, och.mouth[1] + 26], bend: 0.1 });

    // 4: she serves. The Customer is gone — a puddle and a sodden, unreadable ticket. NOW SERVING 07
    let d = R(D[0], D[1], D[2], D[3], '#07090C') + R(D[0], D[1] + 150, D[2], 70, '#1A1D22', st(C.ink, 3));
    d += E(D[0] + 260, D[1] + 172, 170, 16, '#16303F', `opacity=".95" ${st('#2E5468', 2)}`);
    d += `<g transform="translate(${D[0] + 210} ${D[1] + 160}) rotate(-12)">${R(0, -6, 40, 54, '#B9B2A0', st(C.ink, 1.5))}${E(20, 18, 13, 9, '#6A6A66', 'opacity=".55"')}${E(16, 22, 6, 11, '#4A4A48', 'opacity=".5"')}${R(0, 30, 40, 18, '#16303F', 'opacity=".35"')}</g>`;
    d += queueTV(D[0] + 560, D[1] + 30, 250, 150, { num: '07', numCls: 'pC-pulse pC-07' });
    s += pg.panel('d', D, d, { desc: 'She serves. The Customer is gone — only a puddle and a sodden ticket. The queue TV ticks over: NOW SERVING 07.' });

    // 5: she looks up — straight out of the page, at you
    let e = R(Eb[0], Eb[1], Eb[2], Eb[3], '#090B0F') + glow(Eb[0] + 460, Eb[1] + 200, 360, 260, 'gS', 0.16);
    ['zane', 'luke', 'zee', 'chase', 'luka', 'jarrad'].forEach((w, i) => { e += `<g opacity=".35">${pC_faceInPhone(Eb[0] + 60 + i * 150 + (i > 2 ? 160 : 0), Eb[1] + 40, 34, 52, w)}</g>`; });
    const oc5 = {};
    e += fig('chloe', { x: Eb[0] + 460, y: Eb[1] + 960, s: 2.6, view: 'front', face: ['blank', 'worried', 'tremble'], tears: true, props: ['lanyard'], out: oc5, light: 'under', so: 0.45 });
    const sc5 = 2.6 * CAST.chloe.h;
    e += `<g class="pC-cpup">${Ci(oc5.head[0] - 9 * sc5, oc5.head[1], 2.3 * sc5, C.ink)}${Ci(oc5.head[0] + 9 * sc5, oc5.head[1], 2.3 * sc5, C.ink)}</g>`;
    s += pg.panel('e', Eb, e, {
      desc: 'Chloe looks up — straight out of the page, at you. The smile trembles.',
      guided: [{ focus: [Eb[0] + 330, Eb[1] + 10, 570, Eb[3] - 10], move: 'creep' }],
    });
    s += pg.say({ p: 'e', x: Eb[0] + 760, y: Eb[1] + 120, text: '…How can I help you today?', who: 'CHLOE', w: 200, size: 27, tail: [oc5.head[0] + 70, oc5.head[1] + 40] });

    s += pC_gutterRot([[489, 205, 60], [49, 827, 70], [960, 1065, 80], [500, 1065, 50, 30], [960, 300, 60, 30]], 'pC25gr', 10);
    return s;
  },
  mount(ctx) {
    ctx.onPanel('b', () => ctx.sfx('bell', { v: 0.5 }), 1400);
    ctx.onPanel('d', () => {
      ctx.sfx('chime');
      // the 07 on the TV and the reader's own 07 ticket pulse together: lock the TV's pulse to the ticket's clock
      ctx.ticket('pulse');
      const tk = document.getElementById('ticket');
      const ta = tk && tk.getAnimations ? tk.getAnimations().find((x) => x.animationName === 'tkPulse') : null;
      const tvs = ctx.qa('.pC-07');
      tvs.forEach((t) => { t.style.animationDelay = tk ? tk.style.getPropertyValue('--pd') : '0s'; });
      // a fresh animation has no start time until its first frame: wait for it, then share it
      if (ta && ta.ready) ta.ready.then(() => { if (!ctx.dead) tvs.forEach((t) => t.getAnimations && t.getAnimations().forEach((x) => { x.startTime = ta.startTime; })); }).catch(() => {});
    }, 3000);
    ctx.onPanel('e', () => { ctx.haptic('bell'); ctx.sfx('bell', { v: 0.7 }); }, 4200);
    const pup = ctx.q('.pC-cpup');
    if (pup) ctx.onPointer((nx, ny) => { pup.setAttribute('transform', `translate(${n(clamp(nx, -1, 1) * 5)} ${n(clamp(ny, -1, 1) * 3.5)})`); });
  },
});

/* ---------- Page 26 — You ---------- */

// The queue behind the reader curves away into the dark like the jetty into the bay.
const pC_QPTS = [[640, 1000], [800, 800], [760, 610], [600, 500], [420, 452], [270, 430], [160, 424]];
const pC_QN = 16;
function pC_qPos(t) {
  const segs = [];
  let total = 0;
  for (let i = 1; i < pC_QPTS.length; i++) { const l = Math.hypot(pC_QPTS[i][0] - pC_QPTS[i - 1][0], pC_QPTS[i][1] - pC_QPTS[i - 1][1]); segs.push(l); total += l; }
  let d = clamp(t, 0, 1) * total, i = 0;
  while (i < segs.length - 1 && d > segs[i]) { d -= segs[i]; i++; }
  const k = segs[i] ? d / segs[i] : 0;
  const a = pC_QPTS[i], b = pC_QPTS[i + 1];
  return [lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(0.9, 0.05, Math.pow(t, 0.55))];
}
const pC_qSlot = (k) => pC_qPos((k + 1) / (pC_QN + 1));
const pC_qTf = (p) => `transform:translate(${n(p[0])}px,${n(p[1])}px) scale(${n(p[2] * 1000) / 1000})`;

// One of the others in the queue: a person-shaped silhouette, head bowed over the phone in both hands, lit from
// below by its own screen (a different colour each).
function pC_qFig(i) {
  const grads = ['gS', 'gW', 'gWarm', 'gS', 'gW'], cols = [C.screen, '#F4F8FF', '#FFD9A0', '#B8F0C8', '#E8E8FF'];
  const g = grads[i % grads.length], col = cols[i % cols.length];
  const r = rng(`pCqf${i}`), hw = 44 + r.jit(6), tilt = 6 + r.jit(8), kind = i % 3;
  let s = glow(0, -230, 80, 110, g, 0.45);
  s += Pa(`M${-hw} -232C${-hw - 6} -170 ${-hw + 6} -90 ${-hw + 14} 0L${hw - 14} 0C${hw - 6} -90 ${hw + 6} -170 ${hw} -232C${hw - 8} -256 ${n(hw * 0.5)} -262 16 -264L-16 -264C${n(-hw * 0.5)} -262 ${-hw + 8} -256 ${-hw} -232Z`, C.ink);
  let head = R(-11, -284, 22, 28, C.ink) + E(0, -306, 25, 30, C.ink);
  if (kind === 1) head += Pa('M-30 -300C-34 -344 34 -344 30 -300L34 -262L-34 -262Z', C.ink); // hood up
  if (kind === 2) head += E(-4, -338, 13, 10, C.ink); // hair tied up
  s += `<g transform="rotate(${n(tilt)} 0 -280)">${head}${glow(0, -284, 22, 16, g, 0.7)}${E(3, -303, 3, 2, col, 'opacity=".4"')}</g>`;
  s += Pa('M-40 -226C-48 -186 -30 -170 -12 -180M40 -226C48 -186 30 -170 12 -180', 'none', st(C.ink, 17));
  s += R(-13, -214, 26, 40, col, 'rx="3"') + E(-12, -182, 8, 5, col, 'opacity=".5"') + E(12, -182, 8, 5, col, 'opacity=".5"');
  return s;
}

// You, for the last page: the reader's silhouette from the kit, lit only from below by the device in your hands —
// the light catches the underside of the jaw, the nose, the brows and the fingers round the device, nothing more.
// One hand holds the device; the other holds up your ticket. dev: phone | fold | foldOpen | laptop.
function pC_you(x, y, sc, dev) {
  const col = C.screen;
  let g = '';
  const body = 'M-62 -250 C-70 -200 -66 -120 -58 0 L58 0 C66 -120 70 -200 62 -250 C40 -272 -40 -272 -62 -250 Z';
  const dv = { phone: [-20, -222, 40, 78], fold: [-19, -224, 38, 96], foldOpen: [-46, -216, 92, 84], laptop: [-64, -246, 128, 96] }[dev];
  const [dx, dy, dw, dh] = dv;
  const lap = dev === 'laptop';
  g += glow(0, dy + dh / 2 - 40, 120, 150, 'gS', 0.4);
  g += Pa(body, C.ink) + R(-12, -292, 24, 34, C.ink) + E(0, -318, 30, 36, C.ink);
  // the near arm comes round to the device; the far arm holds the ticket up to the counter
  const hy = lap ? -138 : dy + dh * 0.7;
  g += Pa(`M-58 -240C-82 -196 -62 ${hy + 8} ${lap ? -40 : dx + 4} ${hy}`, 'none', st(C.ink, 22));
  g += Pa('M58 -244C76 -230 86 -262 84 -300', 'none', st(C.ink, 22)) + E(84, -306, 13, 15, C.ink);
  // the device
  if (lap) g += Po([[-78, -150], [78, -150], [96, -130], [-96, -130]], '#8E949C', st(C.ink, 2)) + R(dx, dy, dw, dh, '#1A1F26', st(C.ink, 3)) + R(dx + 6, dy + 6, dw - 12, dh - 12, col, 'opacity=".92"');
  else g += R(dx, dy, dw, dh, '#121418', `rx="6" ${st(C.ink, 3)}`) + R(dx + 4, dy + 4, dw - 8, dh - 8, col) + (dev === 'foldOpen' ? Ln(0, dy + 4, 0, dy + dh - 4, '#7FB8CC', 1.4) : '') + (dev === 'fold' ? R(dx - 4, dy, 6, dh, '#22252B') : '');
  // light from the screen on the face (under the jaw, the nose, the brows) and on the fingers holding the device
  const hc = uid('pCyou');
  g += `<clipPath id="${hc}"><ellipse cx="0" cy="-318" rx="30" ry="36"/></clipPath><g clip-path="url(#${hc})">${glow(0, -268, 40, 48, 'gS', 0.75)}${glow(0, -282, 24, 22, 'gS', 0.35)}</g>`;
  g += Ci(-11, -321, 1.8, col, 'opacity=".55"') + Ci(11, -321, 1.8, col, 'opacity=".55"');
  const finger = (fx, fy, a) => `<g transform="translate(${fx} ${fy}) rotate(${a})">${R(-4, -9, 8, 18, C.ink, 'rx="4"')}${R(-3, -8, 6, 14, col, 'rx="3" opacity=".42"')}</g>`;
  if (lap) [-34, -24, -14].forEach((fx, k) => { g += finger(fx, -136, 80 + k * 6); });
  else {
    [0.32, 0.52, 0.72].forEach((t) => { g += finger(dx - 1, dy + dh * t, 12); });
    g += finger(dx + 9, dy + dh * 0.98, -64);
  }
  return `<g class="readerfig pC-you"><g transform="translate(${n(x)} ${n(y)}) scale(${n(sc * 1000) / 1000})">${g}</g></g>`;
}

page(26, {
  title: 'You', side: 'left', gutter: 'black', bleed: 'dark', status: 'sos',
  alt: 'Reverse angle, from just behind Chloe’s shoulder, across the counter: a silhouette, lit from below by the device in their hands. It is you, holding ticket 07. On the counter, a bottle of Optus Water Solutions she has slid across to you. At her shoulder, the Ollie standee, closer than ever, looking at you. Behind you the queue goes on, an endless line of other people lit by their screens, curving away into the dark like the jetty into the bay. The store clock shows your time. Thank you for holding. Your call is important to us.',
  sound: { hold: true, voice: true },
  render(pg) {
    const P = [30, 30, 940, 1440];
    const asp = innerWidth / innerHeight;
    const dev = pg.mode === 'guided' ? (asp < 0.44 ? 'fold' : 'phone') : pg.mode === 'page' ? 'foldOpen' : 'laptop';
    let s = pC_css() + '<defs><filter id="pC26blur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="7"/></filter></defs>';
    let a = R(P[0], P[1], P[2], P[3], '#05060A');
    // the dark beyond the open doors, like water
    a += R(P[0], 420, P[2], 640, 'url(#gSea)', 'opacity=".35"');
    a += Pa(`M${P[0]} 430Q500 400 ${P[0] + P[2]} 440`, 'none', st('#1B2A3A', 2));
    a += R(P[0], P[1], P[2], 300, 'url(#gFadeUp)', 'opacity=".9"');
    // the store clock — your time
    const ck = [170, 200];
    a += Ci(ck[0], ck[1], 62, '#DAD6CC', st(C.ink, 6)) + [...Array(12)].map((_, i) => { const t = (i / 12) * Math.PI * 2; return Ln(ck[0] + Math.sin(t) * 48, ck[1] - Math.cos(t) * 48, ck[0] + Math.sin(t) * 56, ck[1] - Math.cos(t) * 56, C.ink, 3); }).join('');
    const now = new Date(), hDeg = ((now.getHours() % 12) + now.getMinutes() / 60) * 30, mDeg = now.getMinutes() * 6;
    a += `<g class="pC-hh" transform="rotate(${n(hDeg)} ${ck[0]} ${ck[1]})">${Ln(ck[0], ck[1] + 6, ck[0], ck[1] - 32, C.ink, 7)}</g><g class="pC-mm" transform="rotate(${n(mDeg)} ${ck[0]} ${ck[1]})">${Ln(ck[0], ck[1] + 8, ck[0], ck[1] - 48, C.ink, 4.5)}</g>` + Ci(ck[0], ck[1], 5, C.laser);
    a += R(P[0], P[1], P[2], P[3], '#000', 'opacity=".25"');
    // the queue, curving away
    let q = '';
    for (let j = pC_QN - 1; j >= 0; j--) q += `<g class="pC-q pC-qf" data-j="${j}" style="${pC_qTf(pC_qSlot(j))}">${pC_qFig(j)}</g>`;
    a += `<g class="pC-queue">${q}</g>`;
    // you
    const ry = dev === 'laptop' ? 1265 : 1170, rs = 2.05;
    const DV = { phone: [-20, -222, 40, 78], fold: [-19, -224, 38, 96], foldOpen: [-46, -216, 92, 84], laptop: [-64, -246, 128, 96] }[dev];
    const dcx = 480 + (DV[0] + DV[2] / 2) * rs, dcy = ry + (DV[1] + DV[3] / 2) * rs;
    a += `<g class="pC-glowm"><g class="pC-sflick">${glow(480, dcy, 260, 230, 'gS', 0.55)}</g></g>`;
    // the ticket in your other hand, held up to the counter
    const tkx = 480 + 84 * rs, tky = ry - 306 * rs;
    a += `<g transform="translate(${n(tkx)} ${n(tky)}) rotate(9)">${ticketProp(-40, -132, { num: '07', name: `07 — ${NAME()}`, nameSize: Math.min(15, 106 / textW(`07 — ${NAME()}`, 1, FONTS.mono)), s: 0.68 })}</g>`;
    a += pC_you(480, ry, rs, dev);
    // linger and the rot gets out of your screen, over the bezel and onto your fingers
    const rw = DV[2] * rs + 70, rh = DV[3] * rs + 60;
    a += `<g class="pC-late pC-rot26">${rotPatch({ x: dcx, y: dcy, reach: Math.max(rw, rh) * 0.62, count: 64, size: 15, seed: 'pC26rot', grow: 12, box: [dcx - rw / 2 - 10, dcy - rh / 2, rw + 10, rh + 10] })}</g>`;
    // the counter between you and her
    a += Po([[P[0] - 10, 1000], [P[0] + P[2] + 10, 990], [P[0] + P[2] + 10, 1160], [P[0] - 10, 1170]], '#14171C', st(C.ink, 4));
    a += R(P[0], 990, P[2], 8, '#2A3038') + glow(480, 1010, 300, 40, 'gS', 0.35);
    a += rotPatch({ x: 600, y: 1000, reach: 160, count: 40, size: 13, seed: 'pC26ctr', grow: 14, delay: 4, box: [440, 990, 330, 120] });
    // the bottle she slid across: Optus Water Solutions
    a += Pa('M150 1150 C220 1118 290 1094 340 1078', 'none', st('#2E5468', 26, 'opacity=".22"'))+ [[214, 1124, 7], [262, 1104, 5], [300, 1092, 4]].map(([x, y, r]) => E(x, y, r * 1.6, r, '#9FC9DE', 'opacity=".18"')).join('');
    a += `<g transform="translate(350 1068)">${R(-30, -150, 60, 150, '#1A2228', `rx="12" ${st(C.ink, 3)}`)}${R(-26, -110, 52, 104, '#0C1418', 'rx="8"')}${E(-6, -60, 10, 18, '#2A3A30', 'opacity=".7"')}${R(-14, -172, 28, 24, '#1A6A9A', st(C.ink, 2.5))}${R(-30, -96, 60, 54, '#F4F2EA', st(C.ink, 2))}` +
      textLines(['OPTUS', 'WATER', 'SOLUTIONS'], 0, -70, 9.5, C.ink, { font: FONTS.ui, lh: 1.15 }) + '</g>';
    // PLEASE HOLD — slid onto the counter if you linger
    a += `<g class="pC-sign"><g transform="translate(640 1060)">${Po([[-70, 0], [70, 0], [56, -96], [-56, -96]], '#F4F2EA', st(C.ink, 3))}${R(-50, -84, 100, 18, C.y)}${textLines(['PLEASE', 'HOLD'], 0, -44, 22, C.ink, { font: FONTS.ui })}</g></g>`;
    // the Ollie standee at her shoulder, closest he's ever been, eyes on you
    a += ollie({ x: 860, y: 1520, s: 1.45, dark: true, flip: true });
    // Chloe's shoulder, soft and out of focus in the foreground, her lanyard across it
    a += `<g filter="url(#pC26blur)">${fig('chloe', { x: 110, y: 2090, s: 3.6, view: 'back', sil: true, rim: 'screen', rimDx: 9 })}${Pa('M40 1196 C110 1150 190 1160 262 1236', 'none', st(C.y, 16, 'opacity=".85"'))}</g>`;
    s += pg.panel('a', P, a, {
      desc: 'Reverse angle. From just behind Chloe’s shoulder, her lanyard soft and out of focus in the foreground, across the counter: a silhouette, the reader, lit only from below by the glow of the device in their hands. In their other hand, ticket 07. On the counter, a bottle of water she has slid across: Optus Water Solutions. At Chloe’s shoulder, the Ollie standee, the closest he’s ever been, his two black eyes on you. Behind, the queue goes on, an endless line of silhouettes each lit by a different screen, curving away into the dark like the jetty into the bay. On the wall, the store clock shows your actual time.',
      guided: [
        { focus: P, move: 'cut' },
        { focus: [250, 380, 460, 560], move: 'creep', hold: 1500 },
        { focus: [110, 700, 870, 620], move: 'glide' },
        { focus: P, move: 'glide' },
      ],
    });
    s += pg.cap({ p: 'a', x: 360, y: 64, text: 'Thank you for holding.', style: 'entity', w: 520, size: 36 });
    s += pg.cap({ p: 'a', x: 500 - 200, y: 1420, bottom: true, text: 'Your call is important to us.', style: 'entity', w: 420, size: 20 });
    s += pC_gutterRot([[30, 520, 70], [970, 860, 80], [520, 1470, 60, 30], [30, 1250, 60, 30]], 'pC26gr', 10);
    return s;
  },
  mount(ctx) {
    // the store clock keeps the reader's real time
    const hh = ctx.q('.pC-hh'), mm = ctx.q('.pC-mm');
    const tick = () => {
      const d = new Date();
      if (hh) hh.setAttribute('transform', `rotate(${n(((d.getHours() % 12) + d.getMinutes() / 60) * 30)} 170 200)`);
      if (mm) mm.setAttribute('transform', `rotate(${n((d.getMinutes() + d.getSeconds() / 60) * 6)} 170 200)`);
    };
    tick();
    ctx.every(1000, tick);
    // the glow mirrors you
    const gm = ctx.q('.pC-glowm');
    if (gm) ctx.onPointer((nx, ny) => { gm.style.transform = `translate(${n(clamp(nx, -1, 1) * 46)}px,${n(clamp(ny, -1, 1) * 26)}px)`; });
    // every ~7 seconds the queue shuffles one step closer
    if (!ctx.reduced) {
      const figs = ctx.qa('.pC-qf');
      let step = 0;
      ctx.every(7000, () => {
        step++;
        figs.forEach((g) => {
          const j = +g.dataset.j, k = (((j - step) % pC_QN) + pC_QN) % pC_QN;
          if (k === pC_QN - 1) {
            // the one at the front is served: fade out at the counter, come back at the far end of the line
            g.style.cssText = `${pC_qTf(pC_qPos(0))};opacity:0`;
            ctx.after(1300, () => {
              g.style.transition = 'none';
              g.style.cssText = `${pC_qTf(pC_qSlot(k))};opacity:0;transition:none`;
              void g.getBBox();
              requestAnimationFrame(() => { g.style.cssText = `${pC_qTf(pC_qSlot(k))};opacity:1`; });
            });
          } else g.style.cssText = `${pC_qTf(pC_qSlot(k))};opacity:1`;
        });
      });
    }
    // linger and the rot gets out of your screen, onto your fingers
    ctx.dwell(7000, () => { const r = ctx.q('.pC-rot26'); if (r) r.classList.add('on'); });
    // linger longer and she slides a PLEASE HOLD sign onto the counter
    ctx.dwell(20000, () => { const g = ctx.q('.pC-sign'); if (g) g.classList.add('on'); ctx.haptic('tap'); ctx.sfx('beep', { v: 0.3 }); });
  },
});
