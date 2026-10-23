/* SOS ONLY — pages 13–19: interaction notes, call yourself, scanner, stocktake, the pitch, one unit, stems.
   Every top-level name here starts with pB_ (all source files share one scope). */

// Page-scoped CSS lives in a <style> inside the page's SVG, so it comes and goes with the page.
const pB_style = (css) => `<style>${css}</style>`;

// Code Rot reaching the panel edges and spilling into the gutters (pages 13–18).
function pB_gutRot(x, y, seed, o = {}) {
  const reach = o.reach || 90;
  return rotPatch(Object.assign({ x, y, reach, count: o.count || 34, size: o.size || 16, seed, grow: o.grow == null ? 9 : o.grow, delay: o.delay || 1.5, box: o.box || [x - reach, y - reach, reach * 2, reach * 2] }, o));
}

const pB_hhmm = (t) => { const d = new Date(t); return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`; };

/* ---------- Page 13 — Interaction Notes ---------- */

// The JARVIS notes window (panel 2): geometry shared by render and mount.
const pB_W13 = [40, 408, 600, 620], pB_N13 = { x: 60, w: 560 };

page(13, {
  title: 'Interaction Notes', side: 'right', gutter: 'black', bleed: 'black', status: 'sos',
  alt: 'Zee opens JARVIS in the back office to read tonight’s notes on the store account. They are written by JGAUNT — Jarrad’s login — in flat rep shorthand, and they describe what happened to Zane and Luke. Then the notes start describing Zee. The cursor types on its own: Cx ZEE turned around.',
  sound: { hum: true },
  render(pg) {
    const A = [40, 40, 920, 350], B = pB_W13, Cc = [658, 408, 302, 301], D = [658, 727, 302, 301], Eb = [40, 1046, 920, 230], F = [40, 1294, 920, 166];
    let s = pB_style(`.pB13-cur{animation:blinkk 1s steps(1,end) infinite}.rm .pB13-cur{animation:none}`);
    // 1: Zee alone in the back office, lit by JARVIS
    let a = R(A[0], A[1], A[2], A[3], '#0A0D12') + R(A[0], A[1], A[2], A[3], 'url(#htN)', 'opacity=".5"');
    a += R(A[0], A[1] + 290, A[2], 70, '#07090C');
    // the doorway behind her: dark corridor
    a += R(A[0] + 50, A[1] + 40, 170, 252, '#020305', st('#1B222B', 10));
    a += `<g opacity=".28">${leaderboard(A[0] + 250, A[1] + 40, 200, 120, { sales: Save.d.jarradSales || 287 })}</g>`;
    // Ollie, just his mask, peering round the edge of the frame
    a += ollie({ x: A[0] + 16, y: A[1] + 318, s: 0.3, dark: true, turn: 1 });
    // the desk at her hands' height, the keyboard under them, JARVIS on the monitor, her yellow tablet put down for once
    const dy = A[1] + 172;
    a += glow(A[0] + 790, A[1] + 110, 300, 190, 'gS', 0.3);
    a += R(A[0] + 500, dy, 440, 18, '#2A2018', st(C.ink, 3)) + R(A[0] + 512, dy + 18, 16, 150, '#1A140F', st(C.ink, 2)) + R(A[0] + 900, dy + 18, 16, 150, '#1A140F', st(C.ink, 2));
    a += R(A[0] + 512, dy - 9, 120, 10, '#1B1D22', `rx="2" ${st(C.ink, 2)}`) + [0, 1, 2, 3, 4, 5, 6, 7].map((i) => R(A[0] + 520 + i * 14, dy - 7, 9, 3, '#5A6470')).join('');
    a += R(A[0] + 760, dy - 34, 40, 34, '#1A1B1F', st(C.ink, 2)) + R(A[0] + 650, A[1] + 22, 260, 160, '#111216', `rx="6" ${st(C.ink, 4)}`);
    a += `<g transform="translate(${A[0] + 660} ${A[1] + 31}) scale(.4)">${jarvisWindow(0, 0, 600, 355, { title: 'JARVIS' })}${[0, 1, 2, 3, 4, 5].map((i) => R(20, 76 + i * 42, 360 + (i % 3) * 60, 12, '#8792A0')).join('')}${rotPatch({ x: 600, y: 0, box: [0, 0, 600, 355], reach: 230, count: 40, size: 26, seed: 'p13mon', grow: 0 })}</g>`;
    a += `<g transform="translate(${A[0] + 862} ${dy - 3}) rotate(-4)">${R(-26, -8, 52, 9, C.y, `rx="2" ${st(C.ink, 2)}`)}${R(-20, -7, 40, 4, '#20262E')}</g>`;
    // chair and Zee, facing the screen
    a += R(A[0] + 380, A[1] + 236, 120, 18, '#1D1F24', st(C.ink, 3)) + Ln(A[0] + 440, A[1] + 254, A[0] + 440, A[1] + 330, '#1D1F24', 8) + R(A[0] + 372, A[1] + 120, 20, 120, '#1D1F24', st(C.ink, 3));
    const oz = {};
    a += fig('zee', { x: A[0] + 440, y: A[1] + 240, s: 0.95, pose: 'typing', face: 'neutral', light: 'side', so: 0.82, out: oz, no: ['tablet'] });
    a += glow(oz.head[0] + 24, oz.head[1], 46, 40, 'gS', 0.4);
    a += R(A[0], A[1], A[2], A[3], 'url(#gVig)', 'opacity=".9"');
    s += pg.panel('a', A, a, {
      desc: 'Zee alone in the back office, her face lit by JARVIS — grey enterprise windows, tabs, tiny type, Code Rot already blotting the corners. Behind her, the doorway to the dark corridor.',
      guided: [{ focus: [40, 40, 492, 350] }, { focus: [460, 40, 500, 350] }],
    });
    s += pg.say({ p: 'a', x: 338, y: 104, text: 'Okay. Store account. Tonight’s notes.', who: 'ZEE', tail: [oz.head[0] - 12, oz.head[1] - 24], w: 230, size: 25 });
    s += pg.say({ p: 'a', x: oz.head[0] + 116, y: oz.head[1] - 8, type: 'whisper', text: 'Cx. Short for customer.', who: 'ZEE (under her breath, doing Zane’s bit because Zane isn’t here to)', tail: [oz.mouth[0] + 14, oz.mouth[1] + 2], w: 120, size: 21 });

    // 2: the notes, author JGAUNT, typed live
    let b = jarvisWindow(B[0], B[1], B[2], B[3], { title: 'JARVIS — Interaction Notes · Store account 0007', tabs: ['Account', 'Services', 'Interaction Notes', 'Billing'] });
    const notes = [
      '23:47 — Network event. All lines placed on hold. Cx waiting.',
      '23:58 — Cx ZANE took ticket 01. Served. Cx very happy w/ outcome. Viewing figures excellent.',
      '00:41 — Cx LUKE attended roof re: coverage. Signal acquired. Advised cx body no longer required for service. Cx agreed.',
      '01:12 — Cx ZEE reviewing notes.',
    ];
    // §8: coming back to this page (later this read, or on a later visit) leaves a trace in the notes
    if (pg.revisit) notes.push(`${pB_hhmm(Date.now())} — Cx ${NAME()} returned to re-read notes. Cx very interested. Pls hold.`);
    const left = Reader.sess.leftAt || (pg.second && Save.d.lastLeftAt);
    if (left) notes.push(`${pB_hhmm(Date.now())} — Cx stepped away from screen at ${fmtClock(new Date(left))}. Cx came back.`);
    // fit the notes to the window: compact type once the reader's own notes arrive, and if even that overflows,
    // the oldest note scrolls up out of view like a real notes list
    const nx = pB_N13.x, nw = pB_N13.w, top = B[1] + B[3] * 0.15 + 36, room = B[1] + B[3] - 24 - top;
    const lay = (fs, lh, ah, gap, list) => list.reduce((h, t) => h + ah + wrapText(t, nw, fs, FONTS.mono).length * lh + gap, 0);
    let L = { fs: 24, lh: 26, ah: 22, gap: 15 }, first = 0;
    if (lay(L.fs, L.lh, L.ah, L.gap, notes) > room) L = { fs: 22, lh: 23, ah: 17, gap: 11 };
    while (first < notes.length - 4 && lay(L.fs, L.lh, L.ah, L.gap, notes.slice(first)) > room - 20) first++;
    const { fs, lh } = L;
    let ny = top;
    if (first) { b += Tx(nx, ny - 6, `▲ ${first} earlier note${first > 1 ? 's' : ''}`, 15, '#7C8792', '', FONTS.mono); ny += 10; }
    notes.forEach((t, i) => {
      pg.lines.push({ who: 'JARVIS NOTE (author JGAUNT)', text: t });
      if (i < first) return;
      b += Tx(B[0] + B[2] - 22, ny - 3, `AUTHOR: JGAUNT  #${4012 + i}`, 14, '#7C8792', 'text-anchor="end"', FONTS.mono);
      ny += L.ah;
      wrapText(t, nw, fs, FONTS.mono).forEach((ln) => {
        b += `<text class="ft-m pB13-ln" data-n="${i}" x="${nx}" y="${n(ny)}" font-size="${fs}" fill="${i >= 3 ? '#8A1520' : '#26303A'}">${esc(ln)}</text>`;
        ny += lh;
      });
      b += Ln(nx, ny - 9, nx + nw, ny - 9, '#C4CAD0', 1.2);
      ny += L.gap;
    });
    // where a note typed live (the reader leaving the tab and coming back) would go; the rot leaves room for it
    b += `<g class="pB13-roth" data-y="${n(ny)}" data-k="${notes.length}" data-fs="${fs}" data-lh="${lh}" data-ah="${L.ah}" data-stepped="${left ? 1 : 0}"></g>`;
    b += rotPatch({ x: B[0] + B[2], y: B[1], box: [B[0] + B[2] - 210, B[1], 210, 96], reach: 120, count: 24, size: 15, seed: 'p13w0', grow: 4 });
    // guided view holds on the notes until they have landed (they type faster there; see mount)
    s += pg.panel('b', B, b, { desc: 'Screen insert: the interaction notes, author ID JGAUNT, typing themselves in flat rep shorthand. Rot spreads across the window as each note lands.', guided: [{ focus: B, lock: 6500 }] });

    // 3: the call record that never ends
    let c = R(Cc[0], Cc[1], Cc[2], Cc[3], '#C9D0D6') + R(Cc[0], Cc[1], Cc[2], 34, '#56606B') + Tx(Cc[0] + 12, Cc[1] + 24, 'CALL RECORD', 18, '#EEF2F5', '', FONTS.mono);
    c += R(Cc[0] + 12, Cc[1] + 46, Cc[2] - 24, Cc[3] - 60, '#F4F6F7', st('#7C8792', 1));
    c += Tx(Cc[0] + 26, Cc[1] + 80, 'Call 1 — ON HOLD', 24, '#26303A', '', FONTS.mono);
    c += Tx(Cc[0] + 26, Cc[1] + 108, 'Line: OPTUS REDCLIFFE', 17, '#56606B', '', FONTS.mono) + Tx(Cc[0] + 26, Cc[1] + 128, 'Agent: JGAUNT', 17, '#56606B', '', FONTS.mono);
    c += Tx(Cc[0] + 26, Cc[1] + 170, 'Duration', 17, '#56606B', '', FONTS.mono);
    c += `<text class="ft-m pB13-c1" x="${Cc[0] + 26}" y="${Cc[1] + 210}" font-size="34" fill="#8A1520">365d 03:00:00</text>`;
    c += R(Cc[0] + 26, Cc[1] + 232, 250, 10, '#D9DEE2') + R(Cc[0] + 26, Cc[1] + 232, 250, 10, '#8A1520', 'class="fx-glow"');
    c += rotPatch({ x: Cc[0], y: Cc[1] + Cc[3], box: Cc, reach: 110, count: 24, size: 13, seed: 'p13c', grow: 8 });
    c += R(Cc[0], Cc[1], Cc[2], Cc[3], 'url(#gVig)', 'opacity=".45"');
    s += pg.panel('c', Cc, c, { desc: 'In the corner of the screen, a call record: Call 1, on hold, duration 365 days and still ticking.' });

    // 4: the note that is her — and, in the glass, her own face and the dark doorway behind it
    let d = R(D[0], D[1], D[2], D[3], '#B9C2CA');
    d += `<g opacity=".3"><rect x="${D[0] + 18}" y="${D[1] + 10}" width="96" height="190" fill="#05070A"/>${fig('zee', { x: D[0] + 182, y: D[1] + 905, s: 2.4, view: 'front', face: 'worried', light: 'none', no: ['tablet'] })}</g>`;
    d += R(D[0] + 14, D[1] + 112, D[2] - 28, 84, '#FFF3A8', 'opacity=".78"');
    d += textLines(['01:12 — Cx ZEE', 'reviewing notes.'], D[0] + D[2] / 2, D[1] + 154, 32, '#8A1520', { font: FONTS.mono });
    d += Tx(D[0] + D[2] - 16, D[1] + 96, 'AUTHOR: JGAUNT', 16, '#4A5560', 'text-anchor="end"', FONTS.mono);
    d += Pa(`M${D[0]} ${D[1] + 40}L${D[0] + D[2]} ${D[1] - 20}L${D[0] + D[2]} ${D[1] + 30}L${D[0]} ${D[1] + 110}Z`, '#FFFFFF', 'opacity=".22"');
    d += rotPatch({ x: D[0] + D[2], y: D[1] + D[3], box: D, reach: 130, count: 30, size: 14, seed: 'p13d', grow: 10, delay: 3 });
    d += R(D[0], D[1], D[2], D[3], 'url(#gVig)', 'opacity=".6"');
    s += pg.panel('d', D, d, { desc: 'Close on the latest note: 01:12 — Cx ZEE reviewing notes. Zee’s own face is faintly reflected in the screen, and behind it, the dark doorway.' });

    // 5: the cursor types on its own
    let e = R(Eb[0], Eb[1], Eb[2], Eb[3], '#DDE2E6') + R(Eb[0], Eb[1], Eb[2], Eb[3], 'url(#scan)', 'opacity=".12"');
    e += `<text class="ft-m pB13-e" x="${Eb[0] + 60}" y="${Eb[1] + 140}" font-size="58" fill="#8A1520">01:13 — Cx ZEE turned around.</text>`;
    e += `<rect class="pB13-cur" x="${Eb[0] + 60}" y="${Eb[1] + 96}" width="24" height="52" fill="#8A1520"/>`;
    e += rotPatch({ x: Eb[0], y: Eb[1], box: [Eb[0], Eb[1], 70, Eb[3]], reach: 160, count: 34, size: 16, seed: 'p13e', grow: 12, delay: 4 });
    e += R(Eb[0], Eb[1], Eb[2], Eb[3], 'url(#gVig)', 'opacity=".55"');
    s += pg.panel('e', Eb, e, { desc: 'The cursor blinks. Then it types on its own: 01:13 — Cx ZEE turend. Backspace, backspace. Turned around.', guided: [{ focus: Eb, lock: 5200 }] });
    pg.lines.push({ who: 'JARVIS NOTE (typing itself)', text: '01:13 — Cx ZEE turend… turned around.' });

    // 6: hook — her eyes
    let f = R(F[0], F[1], F[2], F[3], '#05070A');
    f += fig('zee', { x: 500, y: F[1] + 96 + 318 * 0.94 * 7, s: 7, view: 'front', face: 'scared', look: [-0.6, 0], light: 'none', props: [] });
    f += R(F[0], F[1], F[2], F[3], C.screen, 'opacity=".16"') + R(F[0], F[1], F[2], F[3], 'url(#gVig)', 'opacity=".9"');
    f += R(F[0], F[1] + F[3] - 50, F[2], 50, 'url(#gFade)', 'opacity=".8"');
    s += pg.panel('f', F, f, { desc: 'Zee’s eyes, wide, in the screen glow. She doesn’t want to turn round.', guided: [{ focus: [180, 1294, 640, 166], move: 'creep' }] });

    // the rot reaches the edge of the window and spills into the gutter (filled in by the page script)
    s += `<g class="pB13-spill" pointer-events="none"></g>`;
    return s;
  },
  mount(ctx) {
    // the call record never ends
    const c1 = ctx.q('.pB13-c1');
    const tick = () => { if (c1) c1.textContent = fmtDur(YEAR_MS + (Date.now() - (ctx.save.call1Start || Date.now())), true); };
    tick();
    ctx.every(1000, tick);

    const W = pB_W13, N = pB_N13;
    const lines = ctx.qa('.pB13-ln'), full = lines.map((l) => l.textContent);
    const eLine = ctx.q('.pB13-e'), cur = ctx.q('.pB13-cur'), eFull = eLine.textContent;
    const host = ctx.q('.pB13-roth'), spill = ctx.q('.pB13-spill');
    let tailY = host ? +host.dataset.y : W[1] + W[3] - 60;
    // keep the rot off the words: it creeps along the margins and fills the empty window below the notes,
    // leaving a band for one more note
    const freeY = Math.min(W[1] + W[3] - 30, tailY + 70), bot = W[1] + W[3];
    const stages = [
      { x: W[0] + 4, y: bot - 4, reach: 190, count: 44, box: [W[0], freeY, W[2] * 0.55, bot - freeY] },
      { x: W[0] + W[2] - 4, y: W[1] + 100, reach: 260, count: 40, box: [W[0] + W[2] - 26, W[1] + 90, 26, W[3] - 90] },
      { x: W[0] + W[2] - 4, y: bot - 4, reach: 240, count: 60, box: [W[0] + W[2] * 0.4, freeY, W[2] * 0.6, bot - freeY] },
      { x: W[0] + 4, y: W[1] + 100, reach: 300, count: 44, box: [W[0], W[1] + 90, 22, W[3] - 90] },
      { x: W[0] + W[2] * 0.5, y: bot - 4, reach: 200, count: 60, box: [W[0], freeY - 10, W[2], bot - freeY + 10] },
      { x: W[0] + W[2] * 0.25, y: bot - 4, reach: 220, count: 60, box: [W[0], freeY - 20, W[2], bot - freeY + 20] },
    ];
    const landed = new Set();
    const land = (i) => {
      if (landed.has(i) || !host) return;
      landed.add(i);
      const sp = stages[Math.min(i, stages.length - 1)];
      host.insertAdjacentHTML('beforeend', rotPatch(Object.assign({ size: 15, seed: `p13s${i}`, grow: 3.5 }, sp)));
      ctx.sfx('beep', { v: 0.25 });
    };
    const doSpill = () => {
      if (!spill || spill.childNodes.length) return;
      spill.insertAdjacentHTML('beforeend',
        rotPatch({ x: 640, y: 1028, box: [560, 960, 160, 120], reach: 110, count: 46, size: 15, seed: 'p13sp1', grow: 5 }) +
        rotPatch({ x: 640, y: 560, box: [610, 440, 60, 260], reach: 120, count: 26, size: 13, seed: 'p13sp2', grow: 6, delay: 1.5 }));
    };
    // a live note, when the reader leaves the tab and comes back while this page is open
    let liveDone = false;
    const liveNote = (away) => {
      // not before the reader is on this page, and not twice (the list may already say they stepped away)
      if (liveDone || !host || ctx.dead || !ctx.isReached() || host.dataset.stepped === '1') return;
      liveDone = true;
      const t = `${pB_hhmm(Date.now())} — Cx stepped away from screen at ${fmtClock(new Date(Date.now() - away))}. Cx came back.`;
      const k = +host.dataset.k;
      const fs = +host.dataset.fs, lh = +host.dataset.lh;
      let y = tailY;
      let html = Tx(W[0] + W[2] - 22, y - 3, `AUTHOR: JGAUNT  #${4012 + k}`, 14, '#7C8792', 'text-anchor="end"', FONTS.mono);
      y += +host.dataset.ah;
      const ls = wrapText(t, N.w, fs, FONTS.mono);
      ls.forEach((_, j) => { html += `<text class="ft-m pB13-live" x="${N.x}" y="${n(y + j * lh)}" font-size="${fs}" fill="#8A1520"></text>`; });
      host.insertAdjacentHTML('afterbegin', html);
      const els = [...host.querySelectorAll('.pB13-live')];
      if (ctx.reduced) { els.forEach((el, j) => { el.textContent = ls[j]; }); return; }
      let li = 0, ci = 0;
      const step = () => {
        if (ctx.dead || li >= els.length) return;
        ci++;
        els[li].textContent = ls[li].slice(0, ci) + (ci < ls[li].length ? '▌' : '');
        if (ci >= ls[li].length) { li++; ci = 0; }
        ctx.after(30 + Math.random() * Math.random() * 120, step);
      };
      ctx.after(900, step);
    };
    ctx.on('tabReturn', (p) => { if (p && p.away > 1200) liveNote(p.away); });

    if (ctx.reduced) {
      lines.forEach((l) => land(+l.dataset.n));
      doSpill();
      if (cur) cur.style.display = 'none';
      return;
    }
    lines.forEach((l) => { l.textContent = ''; });
    eLine.textContent = '';
    const r = rng('p13type');
    // on a phone the reader taps on at a few seconds a stop, so the same human rhythm runs ~2.5x faster
    const sp = ctx.mode === 'guided' ? 0.4 : 1;
    let li = 0, ci = 0, bDone = false, eStarted = false;
    const finishB = () => { if (bDone) return; bDone = true; lines.forEach((l, i) => { l.textContent = full[i]; land(+l.dataset.n); }); };
    // the notes type at an uneven, human speed: bursts, hesitations, a pause at each full stop
    const typeB = () => {
      if (bDone || ctx.dead) return;
      if (li >= lines.length) { bDone = true; if (ctx.mode !== 'guided') ctx.after(900, typeE); return; }
      const L = lines[li], t = full[li];
      ci++;
      L.textContent = t.slice(0, ci) + (ci < t.length ? '▌' : '');
      if (ci >= t.length) {
        const nn = +L.dataset.n;
        li++; ci = 0;
        const nxt = lines[li];
        if (!nxt || +nxt.dataset.n !== nn) { land(nn); ctx.after((360 + r() * 360) * sp, typeB); }
        else ctx.after(40 * sp, typeB);
        return;
      }
      const ch = t[ci - 1];
      ctx.after((ch === '.' || ch === ',' ? 110 + r() * 170 : ch === ' ' ? 16 + r() * 50 : 8 + r() * r() * 80) * sp, typeB);
    };
    // panel 5: the typo is what makes it a person
    const x0 = +eLine.getAttribute('x');
    const typeE = () => {
      if (eStarted || ctx.dead) return;
      eStarted = true;
      const ops = [];
      const typo = '01:13 — Cx ZEE turend';
      for (let i = 1; i <= typo.length; i++) ops.push([typo.slice(0, i), 40 + r() * r() * 160]);
      ops[ops.length - 1][1] = 900;
      ['01:13 — Cx ZEE ture', '01:13 — Cx ZEE tur'].forEach((t) => ops.push([t, 300]));
      for (let i = '01:13 — Cx ZEE tur'.length + 1; i <= eFull.length; i++) ops.push([eFull.slice(0, i), 50 + r() * r() * 170]);
      let k = 0;
      const step = () => {
        if (ctx.dead) return;
        if (k >= ops.length) { if (cur) cur.style.display = 'none'; ctx.after(1200, doSpill); return; }
        const [t, d] = ops[k++];
        eLine.textContent = t;
        if (cur) { try { cur.setAttribute('x', n(x0 + eLine.getComputedTextLength() + 6)); } catch (err) { /* not laid out yet */ } }
        ctx.after(d, step);
      };
      ctx.after(ctx.mode === 'guided' ? 700 : 1400, step);
    };
    if (ctx.mode === 'guided') {
      ctx.onPanel('b', () => ctx.after(400, typeB));
      // moving on before the notes have landed lands them all, so nothing is left half-typed
      ctx.onPanel('c', finishB);
      // reaching panel 5 finishes the notes at once (the reader has moved on) and starts the ghost typing
      ctx.onPanel('e', () => { finishB(); typeE(); });
    } else ctx.whenReached(() => ctx.after(900, typeB));
  },
});

/* ---------- Page 14 — Call Yourself ---------- */

// A coiled phone cord along a quadratic curve from a to b (control c). k = coils, r = coil radius.
function pB_curly(a, c, b, o = {}) {
  const k = o.k || 22, r = o.r || 7, N = k * 10;
  const pts = [];
  for (let i = 0; i <= N; i++) {
    const t = i / N, u = 1 - t;
    const x = u * u * a[0] + 2 * u * t * c[0] + t * t * b[0], y = u * u * a[1] + 2 * u * t * c[1] + t * t * b[1];
    const dx = 2 * u * (c[0] - a[0]) + 2 * t * (b[0] - c[0]), dy = 2 * u * (c[1] - a[1]) + 2 * t * (b[1] - c[1]);
    const L = Math.hypot(dx, dy) || 1, px = -dy / L, py = dx / L, ang = t * k * Math.PI * 2;
    pts.push([x + px * Math.sin(ang) * r + (dx / L) * Math.cos(ang) * r * 0.45, y + py * Math.sin(ang) * r + (dy / L) * Math.cos(ang) * r * 0.45]);
  }
  const d = pathOf(pts, false);
  return `<g${o.cls ? ` class="${o.cls}"` : ''}${o.style ? ` style="${o.style}"` : ''}><path d="${d}" fill="none" ${st(C.ink, (o.w || 3) + 3)}/><path d="${d}" fill="none" ${st(o.col || '#D9C9A3', o.w || 3)}/></g>`;
}

// The old beige backup landline. o: {s, handset:false (off the hook)}
function pB_landline(x, y, o = {}) {
  const s = o.s || 1;
  let g = Pa('M-70 0 L-58 -60 Q0 -74 58 -60 L70 0 Z', '#D9C9A3', st(C.ink, 3.5));
  g += R(-40, -54, 80, 18, '#3B4A3C', `rx="3" ${st(C.ink, 2)}`);
  for (let j = 0; j < 4; j++) for (let i = 0; i < 3; i++) g += R(-30 + i * 22, -32 + j * 8, 16, 6, '#EFE6CF', `rx="2" ${st(C.ink, 1.2)}`);
  if (o.handset !== false) g += Pa('M-80 -62 Q-84 -86 -60 -86 L60 -86 Q84 -86 80 -62 L64 -62 Q60 -74 40 -74 L-40 -74 Q-60 -74 -64 -62 Z', '#D9C9A3', st(C.ink, 3.5));
  else g += Pa('M-62 -62 L-56 -70 L56 -70 L62 -62 Z', '#BFAE88', st(C.ink, 2));
  return `<g transform="translate(${n(x)} ${n(y)}) scale(${s})">${g}</g>`;
}

// The handset on its own. ang in degrees.
function pB_handset(x, y, s = 1, ang = 0) {
  return `<g transform="translate(${n(x)} ${n(y)}) rotate(${ang}) scale(${s})">${Pa('M-14 -60 Q-26 -60 -24 -40 L-18 40 Q-16 58 -4 58 L8 58 Q18 56 16 42 L10 28 Q6 20 4 0 L6 -28 Q8 -44 14 -48 Q18 -60 -14 -60 Z', '#D9C9A3', st(C.ink, 3.5))}${E(-6, -46, 12, 9, '#BFAE88', st(C.ink, 1.6))}${E(-2, 46, 11, 8, '#BFAE88', st(C.ink, 1.6))}</g>`;
}

// A hand with too many knuckles, fingers far too long, wrapped round an edge from the dark side of it.
// Origin is the edge the hand comes from; fingers run out along +x and curl down. Each finger is a tapered
// outline with a crease at every one of its far-too-many joints and a dark, pointed nail.
function pB_wrongHand(x, y, s = 1) {
  const skin = '#A9A58E', dark = '#6F6B58';
  const finger = (fy, len, curl, w0) => {
    const pts = [[0, fy]];
    let a = -6 * D2R, px = 0, py = fy;
    const segs = 6, sl = len / segs;
    for (let k = 0; k < segs; k++) { a += (curl * (0.4 + k * 0.25)) * D2R; px += Math.cos(a) * sl; py += Math.sin(a) * sl; pts.push([px, py]); }
    const L = [], Rr = [];
    pts.forEach((p, k) => {
      const q = pts[Math.min(k + 1, pts.length - 1)], o = pts[Math.max(k - 1, 0)];
      const dx = q[0] - o[0], dy = q[1] - o[1], d = Math.hypot(dx, dy) || 1;
      const w = lerp(w0, w0 * 0.42, k / segs) + (k && k < segs ? 3 : 0); // the knuckles bulge
      L.push([p[0] - (dy / d) * w / 2, p[1] + (dx / d) * w / 2]); Rr.push([p[0] + (dy / d) * w / 2, p[1] - (dx / d) * w / 2]);
    });
    let g = Pa(pathOf(L.concat(Rr.reverse())), skin, st(C.ink, 2.6));
    g += Pa('M' + pts.slice(1).map((p) => `${n(p[0])} ${n(p[1] + w0 * 0.24)}`).join('L'), 'none', st(dark, 3, 'opacity=".6"'));
    g += Pa('M' + pts.slice(0, -1).map((p) => `${n(p[0])} ${n(p[1] - w0 * 0.2)}`).join('L'), 'none', st('#D8D4BE', 1.6, 'opacity=".7"'));
    for (let k = 1; k < segs; k++) {
      const p = pts[k], q = pts[k + 1], d = Math.hypot(q[0] - p[0], q[1] - p[1]) || 1, nx = -(q[1] - p[1]) / d, ny = (q[0] - p[0]) / d, w = lerp(w0, w0 * 0.45, k / segs) * 0.42;
      g += Pa(`M${n(p[0] + nx * w)} ${n(p[1] + ny * w)}Q${n(p[0] + (q[0] - p[0]) / d * 2.5)} ${n(p[1] + (q[1] - p[1]) / d * 2.5)} ${n(p[0] - nx * w)} ${n(p[1] - ny * w)}`, 'none', st(C.ink, 1.3));
    }
    const t = pts[segs], t0 = pts[segs - 1], ang = Math.atan2(t[1] - t0[1], t[0] - t0[0]) / D2R;
    g += `<g transform="translate(${n(t[0])} ${n(t[1])}) rotate(${n(ang)})">${Pa('M-9 -3 Q-2 -4 8 0 Q-2 4 -9 3 Z', '#2B2618', st(C.ink, 1.2))}</g>`;
    return g;
  };
  let g = '';
  // back to front: little finger lowest, index on top; the thumb hooks under from below
  g += finger(56, 64, 14, 15);
  [[34, 120, 9, 14], [12, 152, 7, 16], [-10, 164, 6, 17], [-32, 146, 5, 16]].forEach(([fy, len, curl, w]) => { g += finger(fy, len, curl, w); });
  g = Pa('M-30 -40 Q-6 -46 4 -32 L6 54 Q-8 64 -30 56 Z', shade(skin, -0.25), st(C.ink, 2.6)) + g;
  return `<g transform="translate(${n(x)} ${n(y)}) scale(${s})">${g}</g>`;
}

page(14, {
  title: 'Call Yourself', side: 'left', gutter: 'black', bleed: 'black', status: 'sos',
  alt: 'Zee spins round. The doorway behind her is empty, but low on the frame a hand with far too many knuckles slides back out of sight. On the shop floor she grabs the old beige backup landline and calls her own mobile. Her mobile stays dark: the ringing is coming from the stockroom. Someone answers in her voice, a fraction before she speaks. She walks toward the stockroom, the cord stretched behind her, and the door swings shut.',
  sound: { hum: true },
  render(pg) {
    const A = [40, 40, 920, 430], B = [40, 488, 450, 380], Cc = [508, 488, 452, 380], D = [40, 886, 920, 300], Eb = [40, 1204, 450, 256], F = [508, 1204, 452, 256];
    let s = pB_style(`.pB14-hand{transition:transform 5s cubic-bezier(.6,0,.4,1)}.pB14-hand.gone{transform:translateX(-200px)}
      .pB14-door{transform-box:fill-box;transform-origin:100% 50%;transition:transform 7s cubic-bezier(.5,0,.3,1);transform:scaleX(.42)}.pB14-door.shut{transform:scaleX(1)}
      .rm .pB14-hand,.rm .pB14-door{transition:none}`);
    // 1: payoff — she spins round; the doorway is empty, except for the hand
    let a = R(A[0], A[1], A[2], A[3], '#0A0E13') + R(A[0], A[1], A[2], A[3], 'url(#htN)', 'opacity=".5"');
    const dx0 = A[0] + 600, dw = 190;
    a += R(dx0 - 22, A[1] + 30, dw + 60, 420, '#2A313A') + R(dx0, A[1] + 50, dw, 400, '#010203');
    a += R(dx0 - 22, A[1] + 30, 22, 420, '#3A424C', st(C.ink, 3)) + R(dx0 + dw, A[1] + 30, 22, 420, '#3A424C', st(C.ink, 3));
    a += Po([[dx0 + 30, A[1] + 120], [dx0 + 160, A[1] + 120], [dx0 + 120, A[1] + 360], [dx0 + 60, A[1] + 360]], '#06080B');
    const hc = uid('h');
    a += `<clipPath id="${hc}"><rect x="${dx0 + dw - 2}" y="${A[1]}" width="200" height="${A[3]}"/></clipPath><g clip-path="url(#${hc})"><g class="pB14-hand">${pB_wrongHand(dx0 + dw - 2, A[1] + 336, 0.85)}</g></g>`;
    a += glow(A[0] + 250, A[1] + 230, 330, 260, 'gS', 0.3);
    a += fig('zee', { x: A[0] + 290, y: A[1] + 1090, s: 2.9, view: 'front', face: 'scared', look: [1, 0], light: 'side', so: 0.55, no: ['tablet'] });
    a += R(A[0], A[1], A[2], A[3], C.screen, 'opacity=".07"') + R(A[0], A[1], A[2], A[3], 'url(#gVig)', 'opacity=".75"');
    s += pg.panel('a', A, a, { desc: 'Zee spins round in her chair. The doorway behind her is empty — dark corridor. But low on the doorframe, a hand is sliding back out of sight. Fingers too long. Too many knuckles.', guided: [{ focus: [40, 40, 520, 430], move: 'cut' }] });
    // guided view: her face, then a slow push onto the doorway, where the hand is still there for a moment
    pg.stop('a2', [560, 70, 400, 400], { move: 'creep' });

    // 2: the beige backup landline under the counter
    let b = R(B[0], B[1], B[2], B[3], '#11161C');
    b += R(B[0], B[1], B[2], 70, '#3A3F47', st(C.ink, 3)) + R(B[0], B[1] + 70, B[2], 16, '#22262C');
    b += R(B[0], B[1] + 250, B[2], 12, '#3A3F47', st(C.ink, 2)) + R(B[0], B[1] + 262, B[2], 140, '#0B0E12');
    b += R(B[0] + 330, B[1] + 150, 90, 100, '#1E2228', st(C.ink, 2)) + handsetBox(B[0] + 20, B[1] + 170, 60, 80, {});
    const bo = {};
    b += fig('zee', { x: B[0] + 150, y: B[1] + 420, s: 1.05, pose: 'kneel', face: 'worried', out: bo, arms: { na: { to: [-9, -308], bend: 1 } }, no: ['tablet'], light: 'side', so: 0.6 });
    b += pB_landline(B[0] + 330, B[1] + 250, { s: 1.1, handset: false });
    b += pB_handset(bo.nh[0] - 4, bo.nh[1] - 6, 0.8, -12);
    b += pB_curly([B[0] + 330, B[1] + 220], [B[0] + 250, B[1] + 330], [bo.nh[0] + 2, bo.nh[1] + 36], { cls: 'fx-sway', k: 18, r: 6 });
    s += pg.panel('b', B, b, { desc: 'Zee on the shop floor, grabbing the old beige backup landline from under the counter. Curly cord.' });
    s += pg.say({ p: 'b', x: B[0] + 300, y: B[1] + 66, text: 'Landline. It’s copper. It doesn’t care about the network.', who: 'ZEE', tail: [bo.head[0] + 16, bo.head[1] - 26], w: 250, size: 25 });
    s += pg.sfx('hmmmmmmm', B[0] + 300, B[1] + 175, { size: 30, rot: -4, fill: '#E8E2CC', p: 'b' });

    // 3: she dials
    let c = R(Cc[0], Cc[1], Cc[2], Cc[3], '#151A20') + glow(Cc[0] + 240, Cc[1] + 260, 260, 160, 'gW', 0.12);
    c += `<g transform="translate(${Cc[0] + 236} ${Cc[1] + 340}) scale(2.6)">${Pa('M-70 0 L-58 -60 Q0 -74 58 -60 L70 0 Z', '#D9C9A3', st(C.ink, 2.4))}${R(-40, -54, 80, 18, '#3B4A3C', `rx="3" ${st(C.ink, 1.4)}`)}<text class="ft-m" x="-34" y="-40" font-size="11" fill="#B8F0B0">0412 ··· 7</text>` +
      [...Array(12)].map((_, k) => { const i = k % 3, j = Math.floor(k / 3); return R(-30 + i * 22, -32 + j * 8, 16, 6, '#EFE6CF', `rx="2" ${st(C.ink, 0.9)}`) + Tx(-22 + i * 22, -27.2 + j * 8, '123456789*0#'[k], 5, '#333', 'text-anchor="middle"', FONTS.ui); }).join('') + '</g>';
    // her finger on the 7
    c += `<g transform="translate(${Cc[0] + 270} ${Cc[1] + 230}) rotate(-28)">${R(-12, -10, 24, 140, '#B07A55', `rx="12" ${st(C.ink, 3)}`)}${E(0, -2, 8, 6, '#D9B39A', st(C.ink, 1.5))}${Pa('M-8 40q8 4 16 0M-8 70q8 4 16 0', 'none', st('#6E4A33', 1.6))}${R(-40, 100, 80, 120, '#B07A55', `rx="34" ${st(C.ink, 3)}`)}</g>`;
    c += pB_curly([Cc[0] + 60, Cc[1] + 300], [Cc[0] + 40, Cc[1] + 120], [Cc[0] - 20, Cc[1] + 60], { k: 12, r: 12, w: 5 });
    c += `<g transform="translate(${Cc[0] + 360} ${Cc[1] + 70}) rotate(14)">${limb([[150, 170], [60, 120]], C.navy, 54, 3)}${Ln(64, 96, 64, 146, C.y, 3)}${phoneObj(0, 0, 70, 130, { lit: false })}${R(-8, 70, 60, 70, '#B07A55', `rx="24" ${st(C.ink, 3)}`)}${[0, 1, 2].map((i) => R(-14, 64 + i * 20, 30, 17, '#B07A55', `rx="8" ${st(C.ink, 2.4)}`)).join('')}${R(48, 40, 18, 44, '#B07A55', `rx="9" ${st(C.ink, 2.4)}`)}</g>`;
    s += pg.panel('c', Cc, c, { desc: 'She dials her own mobile number on the landline keypad. Her mobile, in her other hand, stays dark.' });
    s += pg.say({ p: 'c', x: Cc[0] + 160, y: Cc[1] + 90, text: 'Calling my mobile. If it rings, we’ve got a line out.', who: 'ZEE (off-panel)', tail: [Cc[0] + 40, Cc[1] + 10], w: 240, size: 25 });

    // 4: everyone turns — the ringing is coming from the stockroom
    let d = storeInterior(D, { vx: 0.42, vy: 0.36, bw: 0.36, bh: 0.5, night: 0.55, lights: [1, 0, 0, 1, 0, 0], left: 'display', right: null, vig: 1, back: 'wall', seed: 'p14' });
    // the stockroom door, right
    const sx = D[0] + 700, sy = D[1] + 40;
    d += R(sx - 12, sy - 12, 200, 290, '#2A2F36', st(C.ink, 4)) + R(sx, sy, 176, 270, '#4A525C', st(C.ink, 3)) + R(sx + 40, sy + 40, 96, 26, '#E8E4DA', st(C.ink, 2)) + Tx(sx + 88, sy + 59, 'STOCKROOM', 14, C.ink, 'text-anchor="middle"', FONTS.ui) + Ci(sx + 22, sy + 150, 6, '#9AA0A6', st(C.ink, 1.5));
    d += R(sx, sy + 266, 176, 6, C.y, 'opacity=".55"') + glow(sx + 88, sy + 272, 120, 14, 'gY', 0.5);
    d += ollie({ x: D[0] + 90, y: D[1] + 300, s: 0.42, dark: true, turn: 1 });
    const turn = [['luka', 330], ['chase', 430], ['chloe', 520]];
    turn.forEach(([w, x], i) => { d += fig(w, { x: D[0] + x, y: D[1] + 420, s: 0.9, view: 'side', face: 'shock', look: [1, 0], light: 'side', so: 0.7, tilt: [4, -3, 6][i], lean: [-4, -6, -3][i], props: w === 'luka' ? ['lanyard'] : undefined }); });
    const zo = {};
    d += fig('zee', { x: D[0] + 210, y: D[1] + 430, s: 0.95, pose: 'holdOne', face: 'scared', look: [1, 0], props: ['phoneHand'], screen: '#1D232B', out: zo, light: 'side', so: 0.7 });
    d += fig('luke', { x: D[0] + 620, y: D[1] + 410, s: 0.86, view: 'front', face: 'blank', pose: 'still', light: 'dark', so: 0.5, no: ['cable'] });
    s += pg.panel('d', D, d, { desc: 'Zee’s mobile stays dark. Everyone turns. The ringing is coming from the stockroom. Only Luke doesn’t turn.' });
    s += pg.sfx('BRRRING', sx + 30, sy + 150, { size: 54, rot: -10, fill: C.y, p: 'd' }) + pg.sfx('BRRRING', sx + 150, sy + 230, { size: 40, rot: 8, fill: C.y, p: 'd', log: false });

    // 5: click — answered, in her own voice. The handset at her ear; the voices come out of it, hers comes after.
    let e = R(Eb[0], Eb[1], Eb[2], Eb[3], '#0E1217') + glow(Eb[0] + 120, Eb[1] + 100, 220, 160, 'gW', 0.08);
    const eo = {};
    e += fig('zee', { x: Eb[0] + 222, y: Eb[1] + 930, s: 2.6, view: 'side', pose: 'phone', face: 'scared', look: [1, 0], no: ['tablet'], light: 'side', so: 0.62, out: eo });
    const ear = [eo.head[0] - 34, eo.head[1] - 6], chin = [eo.head[0] + 2, eo.head[1] + 92];
    const hang = Math.atan2(chin[1] - ear[1], chin[0] - ear[0]) / D2R - 90;
    e += pB_handset((ear[0] + chin[0]) / 2, (ear[1] + chin[1]) / 2, 1.05, hang);
    e += `<g transform="translate(${n(eo.nh[0] + 2)} ${n(eo.nh[1] + 12)}) rotate(${n(hang)})">${R(-24, -26, 36, 52, '#B07A55', `rx="14" ${st(C.ink, 3)}`)}${[0, 1, 2].map((k) => Pa(`M-22 ${-12 + k * 13}h14`, 'none', st('#6E4A33', 1.6))).join('')}</g>`;
    e += R(Eb[0], Eb[1], Eb[2], Eb[3], 'url(#gVig)', 'opacity=".6"');
    s += pg.panel('e', Eb, e, { desc: 'Click. Answered. From the earpiece, in Zee’s own lettering style.' });
    s += pg.sfx('click', Eb[0] + 64, Eb[1] + 236, { size: 28, rot: -8, fill: '#FFFFFF', p: 'e' });
    s += pg.say({ p: 'e', x: Eb[0] + 118, y: Eb[1] + 40, type: 'elec', text: 'Optus Redcliffe, Zee speaking.', who: 'THE EARPIECE (in Zee’s voice)', tail: [ear[0] - 6, ear[1] - 4], w: 186, size: 22 });
    // her own words, and the earpiece saying them a fraction first: its balloon sits on top of hers
    const zb = pg.say({ p: 'e', x: Eb[0] + 388, y: Eb[1] + 150, text: '…Who is this?', who: 'ZEE', tail: [chin[0] + 44, chin[1] - 34], w: 86, size: 21 });
    const eb = pg.say({ p: 'e', x: Eb[0] + 84, y: Eb[1] + 128, type: 'elec', text: 'Who is this?', who: 'THE EARPIECE (a fraction before she says it)', tail: [ear[0] - 4, ear[1] + 10], w: 110, size: 22 });
    s += eb + zb;

    // 6: hook — she walks into the stockroom, the cord stretched to its limit; linger and the door shuts on her,
    // leaving the cord running under it
    let f = R(F[0], F[1], F[2], F[3], '#0C1015') + R(F[0], F[1] + 214, F[2], 42, '#161B21');
    const fx0 = F[0] + 300, fy0 = F[1] + 24, fw = 132, fh = 190, sill = fy0 + fh;
    f += R(fx0 - 10, fy0 - 8, fw + 20, fh + 8, '#2A2F36', st(C.ink, 3)) + R(fx0, fy0, fw, fh, '#030405');
    f += glow(fx0 + 80, fy0 + 110, 90, 120, 'gY', 0.3);
    const fz = {};
    const zf = { x: fx0 + 54, y: sill - 2, s: 0.5, view: 'back', pose: 'phone', out: fz, sil: true, rim: 'yellow', rimDx: 2 };
    fig('zee', zf);
    const hs = [fz.nh[0] + 4, fz.nh[1] + 8];
    f += Pa(`M${fx0 + 6} ${sill - 2}L${n(fz.nh[0] - 10)} ${n(sill - 40)}L${n(hs[0])} ${n(hs[1])}`, 'none', st(C.ink, 6)) + Pa(`M${fx0 + 6} ${sill - 2}L${n(fz.nh[0] - 10)} ${n(sill - 40)}L${n(hs[0])} ${n(hs[1])}`, 'none', st('#D9C9A3', 3));
    f += fig('zee', zf) + pB_handset(hs[0] + 4, hs[1] - 6, 0.34, 20);
    f += `<path class="pB14-door" d="M${fx0} ${fy0}h${fw}v${fh}h-${fw}Z" fill="#4A525C" stroke="${C.ink}" stroke-width="3"/>`;
    // the cord, taut, from the counter off to the left, along the floor and under the door
    f += Pa(`M${F[0] - 10} ${F[1] + 150}L${fx0 + 4} ${sill - 2}`, 'none', st(C.ink, 6)) + Pa(`M${F[0] - 10} ${F[1] + 150}L${fx0 + 4} ${sill - 2}`, 'none', st('#D9C9A3', 3));
    // Luka's hand reaching in after her, too late
    f += limb([[F[0] - 30, F[1] + 118], [F[0] + 58, F[1] + 104]], C.navy, 30, 3) + Ci(F[0] + 72, F[1] + 102, 16, '#D3A27C', st(C.ink, 3)) + [0, 1, 2, 3].map((k) => Pa(`M${F[0] + 80} ${F[1] + 92 + k * 7}l${18 - Math.abs(k - 1.5) * 4} ${-3 + k * 2}`, 'none', st(C.ink, 7)) + Pa(`M${F[0] + 80} ${F[1] + 92 + k * 7}l${18 - Math.abs(k - 1.5) * 4} ${-3 + k * 2}`, 'none', st('#D3A27C', 4))).join('');
    f += R(F[0], F[1], F[2], F[3], 'url(#gVig)', 'opacity=".7"');
    s += pg.panel('f', F, f, { desc: 'Zee walking into the stockroom, the handset cord stretched to its limit behind her. Luka reaches after her. The stockroom door swinging shut, the cord running under it.' });
    s += pg.say({ p: 'f', x: F[0] + 170, y: F[1] + 52, type: 'shout', text: 'Zee. ZEE—', who: 'LUKA (off-panel)', tail: [F[0] - 14, F[1] + 84], w: 130, size: 25 });

    // rot reaching the panel edges and spilling into the gutters
    s += pB_gutRot(490, 878, 'p14g1', { reach: 70, count: 28 }) + pB_gutRot(960, 1196, 'p14g2', { reach: 60, count: 22, delay: 4 }) + pB_gutRot(40, 480, 'p14g3', { reach: 50, count: 18, delay: 6 });
    return s;
  },
  mount(ctx) {
    if (!ctx.reduced) ctx.onPanel('a2', () => ctx.after(ctx.mode === 'guided' ? 1600 : 0, () => { const h = ctx.q('.pB14-hand'); if (h) h.classList.add('gone'); }), 2600);
    ctx.onPanel('b', () => ctx.sfx('dial', { dur: 2.6 }), 1500);
    ctx.onPanel('d', () => {
      [0, 1500, 3000].forEach((t, i) => ctx.after(t, () => { ctx.sfx('ring', { pan: 1 }); if (i < 2) ctx.haptic('ring'); }));
    }, 3600);
    ctx.onPanel('e', () => ctx.sfx('static', { v: 0.4 }), 6000);
    // linger, and the stockroom door closes slowly on her (in guided view, only once her panel is on screen)
    const shut = () => { const dr = ctx.q('.pB14-door'); if (dr) dr.classList.add('shut'); };
    if (ctx.mode === 'guided') ctx.onPanel('f', () => ctx.dwell(3500, shut));
    else ctx.dwell(11000, shut);
  },
});

/* ---------- Page 15 — Scanner ---------- */

const pB_NAMES = ['M. PATEL', 'D. HOANG', 'S. NGUYEN', 'J. SMITH', 'A. KOWALSKI', 'R. OKAFOR', 'T. BRENNAN', 'K. WILLIAMS', 'L. ROSSI', 'B. TAUFA', 'H. CHEN', 'P. MURPHY', 'E. SANTOS', 'G. KAUR', 'N. COOPER', 'F. AHMED', 'C. JONES', 'V. IVANOVA', 'O. MAHER', 'W. TAN', 'I. BAKER', 'Y. SATO', 'Q. LE', 'U. NOVAK', 'Z. HALL', 'R. SINGH', 'M. ROBERTS', 'S. KELLY', 'A. NGATA', 'D. PHAM'];

// A boxed handset labelled with a person's name. o: {sub, col, glow, warn}
function pB_nameBox(x, y, w, h, name, o = {}) {
  let g = R(x, y, w, h, o.col || '#E9E4D8', st(C.ink, 2.4));
  g += R(x, y + h * 0.36, w, h * 0.12, '#C9B98E', 'opacity=".7"');
  g += R(x + w * 0.05, y + h * 0.5, w * 0.9, h * 0.44, o.warn ? '#FFF3A8' : '#FFFFFF', st(C.ink, 1.4));
  const fs = Math.min(h * 0.22, (w * 1.75) / Math.max(7, name.length));
  g += Tx(x + w / 2, y + h * 0.7, name, fs, C.ink, 'text-anchor="middle"', FONTS.mono);
  g += Tx(x + w / 2, y + h * 0.88, o.sub || '1 UNIT', Math.min(h * 0.14, (w * 1.75) / Math.max(7, (o.sub || '1 UNIT').length)), o.warn ? '#8A1520' : '#444', 'text-anchor="middle"', FONTS.mono);
  if (o.glow) g += R(x + 4, y + 4, w - 8, h * 0.3, C.screen, `opacity="${o.glow}"`);
  // a red rubber stamp across the top of the box, big enough to read in the beam
  if (o.stamp) g += `<g transform="translate(${n(x + w / 2)} ${n(y + h * 0.25)}) rotate(-7)">${R(-w * 0.47, -h * 0.17, w * 0.94, h * 0.34, 'none', st('#B0182A', 3))}${Tx(0, h * 0.1, o.stamp, Math.min(h * 0.25, (w * 1.22) / o.stamp.length), '#B0182A', 'text-anchor="middle"', FONTS.ui)}</g>`;
  return g;
}

page(15, {
  title: 'Scanner', side: 'right', gutter: 'black', bleed: 'black', status: 'sos',
  alt: 'Inside the stockroom, almost total darkness: only Zee’s red scanner laser and her phone torch. The boxed phones on the shelves aren’t labelled with models. They’re labelled with names. Far too many. One of them is yours, reserved. Something in the dark is counting past four thousand. Zee finds Jarrad’s 2IC lanyard and his volleyball keyring on the floor. Then the counting stops.',
  sound: {},
  render(pg) {
    const P1 = [40, 40, 440, 250], P2 = [498, 40, 462, 250], P3 = [40, 308, 920, 250], P4 = [40, 576, 920, 430], P5 = [40, 1024, 440, 210], P6 = [498, 1024, 462, 210], P7 = [40, 1252, 600, 208], P8 = [658, 1252, 302, 208];
    let s = '';
    // 1: black. A red laser line.
    let a = R(P1[0], P1[1], P1[2], P1[3], '#030304');
    a += `<g class="fx-sweep" style="transform-origin:${P1[0] - 40}px ${P1[1] + 150}px">${glow(P1[0] + 220, P1[1] + 140, 260, 16, 'gR', 0.6)}${Ln(P1[0] - 40, P1[1] + 150, P1[0] + P1[2] + 20, P1[1] + 128, C.laser, 3)}</g>`;
    s += pg.panel('a', P1, a, { desc: 'Black. A red laser line.' });
    s += pg.sfx('beep', P1[0] + 330, P1[1] + 90, { size: 40, rot: -8, fill: C.laser, stroke: '#000', p: 'a' });

    // 2: Zee's face in red light
    let b = R(P2[0], P2[1], P2[2], P2[3], '#050203');
    b += fig('zee', { x: P2[0] + 230, y: P2[1] + 960, s: 2.6, view: 'front', face: 'worried', look: [0.5, 0], light: 'under', so: 0.6, no: ['tablet'] });
    b += R(P2[0], P2[1], P2[2], P2[3], C.laser, 'opacity=".42"') + Ln(P2[0], P2[1] + 168, P2[0] + P2[2], P2[1] + 160, '#FF6A7A', 2.4, 'opacity=".8"');
    b += R(P2[0], P2[1], P2[2], P2[3], 'url(#gVig)', 'opacity="1"');
    s += pg.panel('b', P2, b, { desc: 'Zee’s face in red light.' });
    s += pg.say({ p: 'b', x: P2[0] + 380, y: P2[1] + 66, type: 'whisper', text: 'Jarrad?', who: 'ZEE', tail: [P2[0] + 280, P2[1] + 130], w: 110, size: 22 });

    // 3: the labels aren't models — they're names
    let c = R(P3[0], P3[1], P3[2], P3[3], '#040304');
    for (let i = 0; i < 6; i++) c += pB_nameBox(P3[0] + 30 + i * 150, P3[1] + 50, 136, 92, pB_NAMES[i], {}) + pB_nameBox(P3[0] + 30 + i * 150, P3[1] + 156, 136, 92, pB_NAMES[i + 6], {});
    c += R(P3[0], P3[1] + 146, P3[2], 8, '#3A2A2C');
    c += R(P3[0], P3[1], P3[2], P3[3], C.laser, 'opacity=".38"');
    c += `<radialGradient id="pB15g" cx=".3" cy=".55" r=".6"><stop offset=".25" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".96"/></radialGradient>`;
    c += R(P3[0], P3[1], P3[2], P3[3], 'url(#pB15g)');
    c += Ln(P3[0], P3[1] + 118, P3[0] + P3[2], P3[1] + 100, C.laser, 2.4) + glow(P3[0] + 280, P3[1] + 112, 300, 14, 'gR', 0.5);
    s += pg.panel('c', P3, c, { desc: 'Shelves of boxed phones. The labels catch the light. They’re not models. They’re names: M. PATEL — 1 UNIT. D. HOANG — 1 UNIT.' });

    // 4: the reader holds the torch
    const lit = [];
    const rows = 4, cols = 7, bw = 118, bh = 84;
    const resIdx = 17;
    let k = 0, resAt = null;
    for (let j = 0; j < rows; j++) {
      lit.push(R(P4[0], P4[1] + 18 + j * 102 + bh + 4, P4[2], 10, '#5A5E66', st(C.ink, 2)));
      for (let i = 0; i < cols; i++) {
        const x = P4[0] + 26 + i * 128 + (j % 2) * 12, y = P4[1] + 18 + j * 102;
        if (k === 9) { lit.push(R(x, y, bw, bh, '#08090B')); lit.push(ollie({ x: x + 60, y: y + 140, s: 0.48, dark: true })); k++; continue; }
        if (k === resIdx) resAt = [x + bw / 2, y + bh / 2];
        lit.push(k === resIdx ? pB_nameBox(x, y, bw, bh, NAME(), { sub: '1 UNIT — RESERVED', warn: true, stamp: 'RESERVED' }) : pB_nameBox(x, y, bw, bh, pB_NAMES[(k * 7 + 3) % pB_NAMES.length], {}));
        k++;
      }
    }
    pg.lines.push({ who: '', text: `One label reads: ${NAME()} — 1 UNIT — RESERVED.`, desc: true });
    const mid = uid('m');
    let d = R(P4[0], P4[1], P4[2], P4[3], '#020203');
    d += `<mask id="${mid}" maskUnits="userSpaceOnUse" x="${P4[0]}" y="${P4[1]}" width="${P4[2]}" height="${P4[3]}"><rect x="${P4[0]}" y="${P4[1]}" width="${P4[2]}" height="${P4[3]}" fill="#000"/><g class="pB15-beam" transform="translate(${n(resAt[0])} ${n(resAt[1])})">${Ci(0, 0, 170, 'url(#gW)')}</g></mask>`;
    d += `<g mask="url(#${mid})">${R(P4[0], P4[1], P4[2], P4[3], '#2A2620')}${lit.join('')}${R(P4[0], P4[1], P4[2], P4[3], '#FFE9B8', 'opacity=".12"')}</g>`;
    d += `<g class="pB15-beam" transform="translate(${n(resAt[0])} ${n(resAt[1])})" pointer-events="none">${Ci(0, 0, 210, 'url(#gTorch)', 'opacity=".14"')}</g>`;
    d += `<rect class="pB15-hit" x="${P4[0]}" y="${P4[1]}" width="${P4[2]}" height="${P4[3]}" fill="transparent"/>`;
    s += pg.panel('d', P4, d, { desc: 'The torch panel: black, except where Zee’s phone torch falls. Sweep it across the shelves to read the labels. More names. Far too many.', guided: [{ focus: [290, 576, 500, 430] }] });

    // 5: counting, off-panel
    let e = R(P5[0], P5[1], P5[2], P5[3], '#020203') + R(P5[0], P5[1], P5[2], P5[3], 'url(#htK)', 'opacity=".5"');
    s += pg.panel('e', P5, e, { desc: 'Faint lettering trailing in from the dark, off-panel.' });
    s += `<g opacity=".62">${pg.say({ p: 'e', x: P5[0] + 200, y: P5[1] + 104, type: 'dark', text: '…four thousand and twelve…', who: 'A VOICE IN THE DARK', tail: [P5[0] + P5[2] + 30, P5[1] + 60], w: 210, size: 24 })}</g>`;

    // 6: "Hello?"
    let f = R(P6[0], P6[1], P6[2], P6[3], '#020203');
    const zf = {};
    f += `<path d="M${P6[0] + 140} ${P6[1] + 110}L${P6[0] + P6[2]} ${P6[1] + 20}L${P6[0] + P6[2]} ${P6[1] + 200}Z" fill="url(#gCone)" opacity=".8"/>`;
    f += fig('zee', { x: P6[0] + 110, y: P6[1] + 236, s: 0.62, pose: 'film', face: 'scared', props: ['phoneHand'], screen: '#FFFDF0', light: 'dark', so: 0.75, out: zf });
    f += glow(zf.nh[0], zf.nh[1] - 10, 30, 30, 'gTorch', 0.9);
    s += pg.panel('f', P6, f, { desc: 'Zee, tiny in the black, holding up her phone torch.' });
    s += pg.say({ p: 'f', x: P6[0] + 330, y: P6[1] + 60, text: 'Hello?', who: 'ZEE', tail: [zf.head[0] + 10, zf.head[1] - 10], w: 110, size: 26 });

    // 7: Jarrad's lanyard and keyring on the floor
    let g = R(P7[0], P7[1], P7[2], P7[3], '#020203');
    g += E(P7[0] + 300, P7[1] + 112, 260, 92, '#3A3328') + E(P7[0] + 300, P7[1] + 112, 260, 92, 'url(#gTorch)', 'opacity=".35"');
    g += Pa(`M${P7[0] + 120} ${P7[1] + 70}C${P7[0] + 200} ${P7[1] + 150} ${P7[0] + 260} ${P7[1] + 40} ${P7[0] + 330} ${P7[1] + 120}C${P7[0] + 360} ${P7[1] + 150} ${P7[0] + 300} ${P7[1] + 170} ${P7[0] + 250} ${P7[1] + 150}`, 'none', st(C.y, 9));
    g += `<g transform="translate(${P7[0] + 336} ${P7[1] + 72}) rotate(12)">${R(0, 0, 110, 74, '#FFFFFF', st(C.ink, 2.4))}${R(0, 0, 110, 16, C.y)}${R(8, 22, 32, 44, '#BFD4E6', st(C.ink, 1.2))}${Tx(46, 40, 'JARRAD', 15, C.ink, '', FONTS.ui)}${Tx(46, 60, '2IC', 18, C.ink, '', FONTS.ui)}</g>`;
    g += `<g transform="translate(${P7[0] + 170} ${P7[1] + 140})">${Ci(0, 0, 18, '#FFFFFF', st(C.ink, 2.4))}${Pa('M-16 -6Q0 4 16 -6M-12 11Q0 -4 4 -17M4 16Q2 0 16 -4', 'none', st('#1E5AA8', 2.4))}${Ci(18, -22, 7, 'none', st('#9AA0A6', 2.4))}</g>`;
    g += R(P7[0], P7[1], P7[2], P7[3], 'url(#gVig)', 'opacity=".8"');
    s += pg.panel('g', P7, g, { desc: 'Her torch finds a lanyard on the floor: JARRAD — 2IC. Beside it, a little volleyball keyring.' });

    // 8: the counting stops
    let h = R(P8[0], P8[1], P8[2], P8[3], '#000');
    s += pg.panel('h', P8, h, { desc: 'The counting stops. An empty balloon — silence.' });
    s += pg.say({ p: 'h', x: P8[0] + 128, y: P8[1] + 112, type: 'silence', who: false, tail: [P8[0] + P8[2] + 24, P8[1] + 52] });

    s += pB_gutRot(490, 568, 'p15g1', { reach: 60, count: 24 }) + pB_gutRot(960, 1016, 'p15g2', { reach: 60, count: 22, delay: 3 }) + pB_gutRot(649, 1300, 'p15g3', { reach: 50, count: 18, delay: 5 });
    return s;
  },
  mount(ctx) {
    const P4 = [40, 576, 920, 430];
    const beams = ctx.qa('.pB15-beam');
    // the beam starts on the reserved box (so reduced motion still shows it); left alone it wanders off
    const t0b = (beams[0] && beams[0].getAttribute('transform').match(/[-\d.]+/g)) || [P4[0] + 230, P4[1] + 210];
    let bx = +t0b[0], by = +t0b[1], lastInput = 0;
    const put = (x, y) => {
      bx = clamp(x, P4[0] - 40, P4[0] + P4[2] + 40); by = clamp(y, P4[1] - 40, P4[1] + P4[3] + 40);
      beams.forEach((b) => b.setAttribute('transform', `translate(${n(bx)} ${n(by)})`));
    };
    const inside = (x, y) => x > P4[0] - 60 && x < P4[0] + P4[2] + 60 && y > P4[1] - 60 && y < P4[1] + P4[3] + 60;
    // mouse and tilt
    ctx.onPointer((nx, ny, p) => {
      if (p.tilt) { lastInput = Date.now(); put(P4[0] + P4[2] / 2 + nx * P4[2] * 0.55, P4[1] + P4[3] / 2 + ny * P4[3] * 0.6); return; }
      if (p.x == null) return;
      const [x, y] = ctx.toPage(p.x, p.y);
      if (inside(x, y)) { lastInput = Date.now(); put(x, y); }
    });
    // touch or mouse: drag to sweep (a drag never turns the page); a plain tap still turns it
    const hit = ctx.q('.pn[data-panel="d"]');
    if (hit) {
      let down = null;
      const mv = (e) => {
        if (!down) return;
        if (!down.moved && Math.hypot(e.clientX - down.x, e.clientY - down.y) > 10) { down.moved = true; Reader.dragging = true; Reader.dragMoved = true; }
        if (down.moved) { lastInput = Date.now(); const [x, y] = ctx.toPage(e.clientX, e.clientY); put(x, y); }
      };
      const up = () => { if (down && down.moved) setTimeout(() => { Reader.dragging = false; }, 0); down = null; };
      const dn = (e) => { down = { x: e.clientX, y: e.clientY, moved: false }; const [x, y] = ctx.toPage(e.clientX, e.clientY); put(x, y); lastInput = Date.now(); };
      hit.addEventListener('pointerdown', dn);
      addEventListener('pointermove', mv);
      addEventListener('pointerup', up);
      addEventListener('pointercancel', up);
      const off = () => { hit.removeEventListener('pointerdown', dn); removeEventListener('pointermove', mv); removeEventListener('pointerup', up); removeEventListener('pointercancel', up); };
      const cleanup = ctx._cleanup;
      ctx._cleanup = () => { off(); cleanup(); };
    }
    // left alone, the beam wanders on its own
    // (in guided view it stays inside the part of the shelf on screen)
    if (!ctx.reduced) {
      let t0 = performance.now();
      const gx = ctx.mode === 'guided' ? [540, 190] : [P4[0] + P4[2] / 2, P4[2] * 0.38];
      const sx = bx, sy = by, ease = 2600;
      // in guided view the beam waits on the reserved box until its panel comes up
      if (ctx.mode === 'guided') { t0 = Infinity; ctx.onPanel('d', () => { put(sx, sy); t0 = performance.now() + 600; }); }
      // in a spread it waits on the reserved box until the reader comes over to this page
      else if (!ctx.isReached()) { t0 = Infinity; ctx.whenReached(() => { put(sx, sy); t0 = performance.now() + 600; }); }
      ctx.raf((t) => {
        if (Date.now() - lastInput < 2500) return;
        if (t < t0) return;
        const el = t - t0, u = el / 1000;
        const wx = gx[0] + gx[1] * Math.sin(u * 0.37 - 0.55), wy = P4[1] + P4[3] * (0.5 + 0.3 * Math.sin(u * 0.61 + 1));
        const k = clamp((el - 1200) / ease, 0, 1);
        put(lerp(sx, wx, k * k * (3 - 2 * k)), lerp(sy, wy, k * k * (3 - 2 * k)));
      });
    }
    ctx.onPanel('a', () => ctx.sfx('beep'), 400);
    ctx.onPanel('h', () => Sound.silence(3000), 5000);
  },
});

/* ---------- Page 16 — Stocktake (splash) ---------- */

// One-point projection for the impossible stockroom. World: X across, Y down (floor at +1100), z into the page.
const pB_VP = [520, 600], pB_F = 500;
const pB_pj = (X, Y, z) => [pB_VP[0] + (X * pB_F) / z, pB_VP[1] + (Y * pB_F) / z];
const pB_q = (pts) => 'M' + pts.map((p) => `${n(p[0])} ${n(p[1])}`).join('L') + 'Z';

// The endless pallet racking: steel uprights, ochre beams, and thousands of boxes, each leaking a thin line of
// light along its flap seam from the phone inside.
function pB_aisle(seed) {
  const r = rng(seed);
  const FLOOR = 1100, TOP = -700, ROW = 90;
  let faces = ['', ''], seams = ['', '', '', '', ''], beams = '', ups = '', far = '';
  for (const side of [-1, 1]) {
    const X = side * 600;
    for (let Y = TOP; Y < FLOOR; Y += ROW) {
      const Yb = Y + ROW - 14;
      for (let z = 330; z < 2700; z += 72) {
        const z2 = z + 62, top = Y + r() * 10;
        faces[r() < 0.5 ? 0 : 1] += pB_q([pB_pj(X, top, z), pB_pj(X, top, z2), pB_pj(X, Yb, z2), pB_pj(X, Yb, z)]);
        if (r() < 0.75) {
          const k = Math.floor(r() * 5), g1 = top + (Yb - top) * 0.3, g2 = g1 + Math.max(4, (Yb - top) * 0.07);
          seams[k] += pB_q([pB_pj(X, g1, z + 4), pB_pj(X, g1, z2 - 4), pB_pj(X, g2, z2 - 4), pB_pj(X, g2, z + 4)]);
        }
      }
      // a beam under each row, all the way to the vanishing point
      const a = pB_pj(X, Y + ROW - 9, 330), b = pB_pj(X, Y + ROW - 9, 60000), a2 = pB_pj(X, Y + ROW, 330), b2 = pB_pj(X, Y + ROW, 60000);
      beams += pB_q([a, b, b2, a2]);
    }
    for (let z = 400; z < 9000; z *= 1.22) { const a = pB_pj(X, TOP, z), b = pB_pj(X, FLOOR, z); ups += `M${n(a[0])} ${n(a[1])}L${n(b[0])} ${n(b[1])}`; }
    // beyond the boxes we can draw: a dusting of glows into the dark
    for (let i = 0; i < 260; i++) {
      const z = 2700 * Math.pow(25, r()), Y = TOP + r() * (FLOOR - TOP), p = pB_pj(X, Y, z), sz = Math.max(0.8, 2400 / z);
      far += `M${n(p[0])} ${n(p[1])}h${n(sz * 1.6)}v${n(sz * 0.4)}h${n(-sz * 1.6)}Z`;
    }
  }
  let s = '';
  // floor, with solid yellow safety lines running into the dark
  s += Po([pB_pj(-600, FLOOR, 300), pB_pj(600, FLOOR, 300), pB_pj(600, FLOOR, 60000), pB_pj(-600, FLOOR, 60000)], '#0E1013');
  for (const X of [-470, 470]) s += Po([pB_pj(X - 12, FLOOR, 300), pB_pj(X + 12, FLOOR, 300), pB_pj(X + 12, FLOOR, 60000), pB_pj(X - 12, FLOOR, 60000)], '#7A6514', 'opacity=".55"');
  for (const side of [-1, 1]) s += Po([pB_pj(side * 600, TOP, 300), pB_pj(side * 600, TOP, 60000), pB_pj(side * 600, FLOOR, 60000), pB_pj(side * 600, FLOOR, 300)], '#0B0C0E');
  s += `<path d="${faces[0]}" fill="#2F2B25" stroke="#08090A" stroke-width="1.2"/><path d="${faces[1]}" fill="#26231F" stroke="#08090A" stroke-width="1.2"/>`;
  const gop = [0.22, 0.35, 0.5, 0.7, 0.9];
  seams.forEach((d, k) => { s += `<path d="${d}" fill="${k > 2 ? '#CFF4FF' : C.screen}" opacity="${gop[k]}"${k === 2 ? ' class="fx-glow" style="animation-duration:3.7s"' : k === 4 ? ' class="fx-glow" style="animation-duration:2.9s;animation-delay:-1.3s"' : ''}/>`; });
  s += `<path d="${beams}" fill="#6B5418" stroke="#1A1406" stroke-width="1"/><path d="${ups}" fill="none" stroke="#2F3A48" stroke-width="5"/><path d="${ups}" fill="none" stroke="#475668" stroke-width="1.6"/>`;
  s += `<path d="${far}" fill="${C.screen}" opacity=".5"/>`;
  // the ceiling, lost in darkness
  s += R(-200, -200, 1400, pB_VP[1] + 160, 'url(#gFadeUp)', 'opacity=".98"');
  return s;
}

page(16, {
  title: 'Stocktake', side: 'left', gutter: 'black', bleed: 'hold', status: 'sos',
  alt: 'Splash. The stockroom is impossible: shelving runs to a vanishing point miles away, the ceiling lost in darkness, thousands of boxes each glowing faintly from the phone inside. Zee, tiny, in the foreground. Midway down the aisle, a pallet of bottled water stacked higher than a house — every bottle full of black bay water. Far down the aisle, a figure in an Optus staff top, far too tall, stocks a shelf with its back to us, head bent against the ceiling. From very far away, the warmest voice in the world.',
  sound: {},
  render(pg) {
    let s = pB_style(`.pB16-dolly{transform-origin:520px 600px;animation:pB16d 6s cubic-bezier(.45,0,.55,1) both}@keyframes pB16d{from{transform:scale(1.2)}to{transform:scale(.95)}}.rm .pB16-dolly{animation:none;transform:scale(.95)}`);
    const botId = uid('bot');
    // bottles of black, cloudy bay water, two to a tray layer, shrink-wrapped
    let art = `<pattern id="${botId}" width="20" height="44" patternUnits="userSpaceOnUse"><rect width="20" height="44" fill="#06090B"/><rect y="40" width="20" height="4" fill="#3A4046"/>` +
      `<path d="M6 9 Q6 6 8.5 5.5 L8.5 2.5 L11.5 2.5 L11.5 5.5 Q14 6 14 9 L15 13 L15 38 Q15 40 13 40 L7 40 Q5 40 5 38 L5 13 Z" fill="#0F1A1E" stroke="#5E7A86" stroke-width=".9"/>` +
      `<rect x="8.3" y="1" width="3.4" height="2.4" fill="#2F6E9C"/><rect x="5.4" y="20" width="9.2" height="6" fill="#D7DEE2" opacity=".55"/><path d="M6.5 15 L6.5 37" stroke="#9FC4D0" stroke-width=".8" opacity=".5"/><path d="M8 31 q2 -3 4 0" stroke="#3E4F44" stroke-width="1.1" fill="none" opacity=".8"/></pattern>`;
    art += R(-200, -200, 1400, 1900, '#030405');
    let aisle = pB_aisle('p16');
    // far down the aisle: a crossbeam at ceiling height, a lamp hanging under it, and its pool of light
    const zj = 5000, jb = pB_pj(-600, -1080, zj), jb2 = pB_pj(600, -1080, zj);
    aisle += R(jb[0] - 20, jb[1] - 10, jb2[0] - jb[0] + 40, 12, '#4A5058', st('#000', 1.2)) + R(jb[0] - 20, jb[1] + 2, jb2[0] - jb[0] + 40, 2.5, C.y, 'opacity=".6"');
    const lamp = pB_pj(-320, -900, 4300), pool = pB_pj(380, 1100, zj);
    aisle += `<path d="M${n(lamp[0] - 4)} ${n(lamp[1])}L${n(pool[0] - 74)} ${n(pool[1])}L${n(pool[0] + 70)} ${n(pool[1])}L${n(lamp[0] + 4)} ${n(lamp[1])}Z" fill="url(#gConeY)" opacity=".5"/>`;
    aisle += E(pool[0], pool[1], 72, 9, C.y, 'opacity=".22"') + Ln(lamp[0], jb[1], lamp[0], lamp[1], '#111', 1.2) + glow(lamp[0], lamp[1] + 6, 46, 30, 'gY', 0.8) + Ci(lamp[0], lamp[1], 2.6, '#FFF3B0');
    // the pallet, stacked higher than a house
    const P0 = pB_pj(-560, -1000, 1700), P1 = pB_pj(-150, 1100, 1700);
    const S1 = pB_pj(-150, -1000, 2300), S2 = pB_pj(-150, 1100, 2300);
    aisle += Po([[P1[0], P0[1]], S1, S2, [P1[0], P1[1]]], `url(#${botId})`) + Po([[P1[0], P0[1]], S1, S2, [P1[0], P1[1]]], '#000', 'opacity=".55"');
    aisle += R(P0[0], P0[1], P1[0] - P0[0], P1[1] - P0[1], `url(#${botId})`, st('#000', 2));
    aisle += R(P0[0], P0[1], P1[0] - P0[0], P1[1] - P0[1], 'url(#gTorch)', 'opacity=".1"');
    for (let i = 0; i < 4; i++) aisle += Ln(P0[0] + 14 + i * 30, P0[1], P0[0] + 8 + i * 32, P1[1], '#FFFFFF', 1.4, 'opacity=".1"');
    aisle += R(P0[0] - 3, P1[1] - 4, P1[0] - P0[0] + 6, 16, '#5A4630', st('#000', 1.5));
    const lw = 128, lx = (P0[0] + P1[0]) / 2 - lw / 2, ly = P1[1] - 190;
    aisle += R(lx, ly, lw, 70, '#F3F1EA', st(C.ink, 2.5)) + R(lx, ly, lw, 8, C.y) + textLines(['OPTUS WATER', 'SOLUTIONS', '4,000 UNITS'], lx + lw / 2, ly + 40, 17, C.ink, { font: FONTS.mono, lh: 1.05 });
    // Ollie, a white mask on a far shelf
    const ol = pB_pj(600, 380, 1900);
    aisle += ollie({ x: ol[0] - 10, y: ol[1], s: 0.14, dark: true, flip: true });
    // the figure, far down the aisle in the lamp's light: back to us, an Optus staff top, far too tall,
    // head bent under the crossbeam, one long arm up putting stock on the shelf
    const jf = pB_pj(400, 1100, zj);
    const jo = { x: jf[0], y: jf[1], s: 0.52, view: 'back', pose: 'still', farms: { r: [8, 4], l: [-128, -158] }, tilt: 30, lean: 6, light: 'dark', so: 0.45, props: [] };
    const tall = `translate(${n(jf[0])} ${n(jf[1])}) scale(.74 1.06) translate(${n(-jf[0])} ${n(-jf[1])})`;
    aisle += `<g transform="${tall}"><g transform="translate(2.4 -1)">${fig('jarrad', Object.assign({}, jo, { cls: 'rimY' }))}</g>${fig('jarrad', jo)}</g>`;
    // darkness swallowing the far end
    aisle += Ci(pB_VP[0], pB_VP[1], 110, 'url(#gK)', 'opacity=".85"');
    art += `<g class="pB16-dolly">${aisle}</g>`;
    // Zee, tiny, her phone torch pointed into it
    const zp = pB_pj(-40, 1100, 1050), zo = {};
    art += `<path d="M${n(zp[0] + 14)} ${n(zp[1] - 120)}L${pB_VP[0] - 40} ${pB_VP[1] - 10}L${pB_VP[0] + 90} ${pB_VP[1] + 70}Z" fill="url(#gCone)" opacity=".5"/>`;
    art += fig('zee', { x: zp[0], y: zp[1], s: 0.55, view: 'back', pose: 'idle', props: [], out: zo, light: 'dark', so: 0.45 });
    art += glow(zp[0] + 14, zp[1] - 120, 22, 18, 'gTorch', 0.9);
    art += R(0, 0, 1000, 1500, 'url(#gVig)', 'opacity=".75"');
    s += pg.panel('a', [0, 0, 1000, 1500], art, {
      border: false,
      desc: 'The impossible stockroom. Shelving to a vanishing point miles away, thousands of faintly glowing boxes. Zee, tiny, bottom foreground. Midway down the aisle, a pallet stacked higher than a house: OPTUS WATER SOLUTIONS — 4,000 UNITS, every bottle full of black, cloudy bay water. Far down the aisle, a too-tall figure in an Optus staff top stocks a shelf, back to us, head bent against the ceiling.',
      guided: [{ focus: [36, 860, 828, 600], move: 'cut' }],
    });
    // the ticker
    s += `<g class="bl cap" data-p="a" style="--i:${pg.bal++}">${R(48, 1386, 340, 64, 'rgba(0,0,0,.35)')}${R(42, 1378, 340, 64, C.ink, st(C.y, 2))}<text class="ft-m pB16-tick" x="62" y="1422" font-size="30" fill="${C.y}">4,013 … 4,014 … 4,015</text></g>`;
    pg.lines.push({ who: 'CAPTION', text: '4,013 … 4,014 … 4,015' });
    // §10: 13–18 the rot reaches the edges; on the splash it creeps in from the page edge, away from the reveal
    s += pB_gutRot(392, 1446, 'p16g1', { reach: 60, count: 24, delay: 3 }) + pB_gutRot(1000, 1130, 'p16g2', { reach: 70, count: 26, delay: 5 }) + pB_gutRot(0, 330, 'p16g3', { reach: 55, count: 20, delay: 7 });
    // guided: one long, slow push down the aisle — first the voice, then the figure under the beam
    pg.stop('j', [150, 90, 740, 960], { move: 'creep', hold: 1500, lock: 1500 });
    pg.stop('k', [446, 380, 230, 380], { move: 'creep', lock: 1200 });
    // the voice: enormous and faint, from the dark above the aisle; its tail stops short of him
    const head = [pB_VP[0] + (jf[0] - pB_VP[0]) * 0.95, pB_VP[1] + (jf[1] - 172 - pB_VP[1]) * 0.95];
    s += `<g opacity=".6">${pg.say({ p: 'j', x: 500, y: 214, text: 'ZEE! GREAT TO SEE YOU!', who: 'JARRAD (from very far away, enormous and faint)', tail: [head[0] - 22, head[1] - 70], w: 560, size: 58, tw: 0.06, bend: 0.06 })}</g>`;
    return s;
  },
  mount(ctx) {
    const t = ctx.q('.pB16-tick');
    let k = 4015;
    const fmt = (v) => v.toLocaleString('en-AU');
    ctx.every(1300, () => { k++; if (t) t.textContent = `${fmt(k - 2)} … ${fmt(k - 1)} … ${fmt(k)}`; });
  },
});

/* ---------- Page 17 — The Pitch ---------- */

// A bottle of Optus Water Solutions, full of black, cloudy bay water. Something small turns over inside.
function pB_bottle(x, y, s = 1, ang = 0) {
  let g = Pa('M-16 -70 L-16 -84 L16 -84 L16 -70 Q30 -60 30 -40 L30 66 Q30 76 20 76 L-20 76 Q-30 76 -30 66 L-30 -40 Q-30 -60 -16 -70 Z', '#DCEBF2', st(C.ink, 3));
  g += Pa('M-26 -30 L26 -30 L26 64 Q26 72 18 72 L-18 72 Q-26 72 -26 64 Z', '#0E1416');
  g += E(0, 10, 22, 30, '#26343A', 'opacity=".7"') + E(-8, 34, 10, 14, '#3A4A44', 'opacity=".5"');
  g += `<g class="pB17-spin">${Pa('M-4 -6 q8 -4 10 4 q2 8 -6 10 q-6 0 -4 -6', 'none', st('#C9C1A8', 2.6))}${Ci(5, -3, 1.6, '#C9C1A8')}</g>`;
  g += R(-30, 0, 60, 26, '#FFFFFF', 'opacity=".9"') + Tx(0, 11, 'OPTUS WATER', 8, C.ink, 'text-anchor="middle"', FONTS.ui) + Tx(0, 21, 'SOLUTIONS', 8, C.ink, 'text-anchor="middle"', FONTS.ui);
  g += R(-17, -96, 34, 14, '#2F6E9C', `rx="3" ${st(C.ink, 2)}`) + Ln(-20, -40, -20, 60, '#FFFFFF', 3, 'opacity=".45"');
  return `<g transform="translate(${n(x)} ${n(y)}) rotate(${ang}) scale(${s})">${g}</g>`;
}

// A charging cable from a to b that pulses yellow in a travelling wave.
function pB_cable(a, b, sag, i, o = {}) {
  const c1 = [lerp(a[0], b[0], 0.3), lerp(a[1], b[1], 0.3) + sag], c2 = [lerp(a[0], b[0], 0.7), lerp(a[1], b[1], 0.7) + sag * 0.6];
  const d = `M${n(a[0])} ${n(a[1])}C${n(c1[0])} ${n(c1[1])} ${n(c2[0])} ${n(c2[1])} ${n(b[0])} ${n(b[1])}`;
  const w = o.w || 6;
  let s = `<path d="${d}" fill="none" ${st(C.ink, w + 4)}/><path d="${d}" fill="none" ${st('#5A4A00', w)}/>`;
  const N = o.beads || 12;
  for (let k = 1; k < N; k++) {
    const t = k / N, u = 1 - t;
    const x = u * u * u * a[0] + 3 * u * u * t * c1[0] + 3 * u * t * t * c2[0] + t * t * t * b[0];
    const y = u * u * u * a[1] + 3 * u * u * t * c1[1] + 3 * u * t * t * c2[1] + t * t * t * b[1];
    s += `<circle class="pB17-p" cx="${n(x)}" cy="${n(y)}" r="${n(w * 0.55)}" fill="${C.y}" style="animation-delay:${n(-(N - k) * 0.11 - i * 0.37)}s"/>`;
  }
  return s;
}

// Jarrad as the Top Seller: still himself — the Optus staff top, the 2IC lanyard, the volleyball keyring — but
// stretched too tall, lit from below by his own cables, a yellow rim of the Hold round him, the leaderboard grin
// pulled too wide and the eyes not moving with it. o.fig: fig() options; sx/sy stretch him; k: how much closer he is
// (scaled about his face, so he only ever gets nearer, never leaves the frame).
function pB_monster(o) {
  const f = Object.assign({ pose: 'stand', face: 'dead', light: 'dark', so: 0.5, props: ['lanyard', 'keyring'] }, o.fig), out = {};
  const sy = o.sy || 1.15, sx = o.sx || 0.88, fx = f.x, fy = f.y, sc = (f.s || 1) * CAST.jarrad.h, fl = f.flip ? -1 : 1;
  const view = f.view || 'side', HC = view === 'side' ? [2, -318] : [0, -318];
  const lean = f.lean != null ? f.lean : (POSES[f.pose] || {}).lean || 0, tilt = f.tilt || 0;
  const body = fig('jarrad', Object.assign({}, f, { out }));
  const rim = fig('jarrad', Object.assign({}, f, { cls: 'rimY', face: 'neutral' }));
  // the face, worked over: eye sockets sunk in shadow, lit from below by the cables, and the grin pulled past the cheeks
  const headShape = view === 'side' ? 'M-20 -318C-20 -350 24 -352 24 -322L26 -310C27 -300 20 -292 10 -291C-6 -290 -16 -298 -20 -308Z' : 'M-22 -318C-22 -352 22 -352 22 -318C22 -298 12 -290 0 -290C-12 -290 -22 -298 -22 -318Z';
  const M = view === 'side' ? [12, 16] : [0, 16];
  const teeth = [-24, -17, -10, -3, 4, 11, 18].map((x) => `M${M[0] + x} ${M[1] - 6}v13`).join('');
  const face = `<g transform="translate(${n(fx)} ${n(fy)}) scale(${n(sc * fl * 1000) / 1000} ${n(sc * 1000) / 1000}) rotate(${lean} 0 -150) rotate(${tilt} ${HC[0]} -296)">` +
    `<path d="${headShape}" fill="url(#pB17sh)"/><g transform="translate(${HC[0]} ${HC[1]})">` +
    Pa(`M${M[0] - 30} ${M[1] - 9}q30 9 58 -5q-6 25 -29 25q-23 0 -29 -20Z`, '#F4EFDF', st(C.ink, 2.2)) + Pa(`M${M[0] - 28} ${M[1]}h55${teeth}`, 'none', st(C.ink, 1)) +
    Pa(`M${M[0] - 31} ${M[1] - 9}q-4 -6 -2 -12M${M[0] + 28} ${M[1] - 14}q4 -6 2 -12`, 'none', st(C.ink, 1.6)) + `</g></g>`;
  const T = (p) => [fx + (p[0] - fx) * sx, fy + (p[1] - fy) * sy];
  const hd = T(out.head);
  const g = `<g class="pB17-j" style="transform-box:view-box;transform-origin:${n(hd[0])}px ${n(hd[1])}px;transform:scale(${o.k || 1})"><g transform="translate(${n(fx)} ${n(fy)}) scale(${sx} ${sy}) translate(${n(-fx)} ${n(-fy)})"><g transform="translate(${n(-2.2 * sc * fl)} ${n(-1.2 * sc)})">${rim}</g>${body}${face}</g></g>`;
  return { g, head: hd, nh: T(out.nh), fh: T(out.fh), mouth: T(out.mouth), s: out.scale, back: (dy) => T([fx - fl * 22 * out.scale, out.head[1] + dy * out.scale]) };
}

page(17, {
  title: 'The Pitch', side: 'right', gutter: 'black', bleed: 'hold', status: 'sos',
  alt: 'Jarrad turns: his leaderboard grin, stretched too wide, the eyes not moving with it. He is far too tall. Charging cables run out of his back and arms into hundreds of boxed phones, pulsing yellow. He offers Zee a bottle of black water with something turning over inside, and does the pitch — unlimited, forever, never locked in, never locked out, you just stay. Under Zee’s hand, a box labelled with her name is warm, and breathing. Her scream is cut off by an enormous BEEP.',
  sound: {},
  render(pg) {
    const A = [40, 40, 920, 420], B = [40, 478, 450, 330], Cc = [508, 478, 452, 330], D = [40, 826, 450, 250], Eb = [508, 826, 452, 250], F = [40, 1094, 600, 366], G7 = [658, 1094, 302, 366];
    const seen = Reader.sess.pB17 || 0;
    const k0 = 1 + Math.min(seen, 4) * 0.05;
    let s = `<linearGradient id="pB17sh" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.ink}" stop-opacity=".85"/><stop offset=".45" stop-color="${C.ink}" stop-opacity=".5"/><stop offset=".7" stop-color="${C.ink}" stop-opacity="0"/><stop offset="1" stop-color="${C.y}" stop-opacity=".22"/></linearGradient>`;
    s += pB_style(`.pB17-p{animation:pB17p 1.3s linear infinite;opacity:.2}@keyframes pB17p{0%,100%{opacity:.15}40%{opacity:1}60%{opacity:.6}}
      .pB17-spin{transform-box:fill-box;transform-origin:center;animation:pB17s 3.6s linear infinite}@keyframes pB17s{to{transform:rotate(360deg)}}
      .pB17-j{transition:transform .01s}.rm .pB17-p{animation:none;opacity:.8}.rm .pB17-spin{animation:none}`);
    // 1: Jarrad turns. Cables from his back and arms into hundreds of boxes.
    let a = R(A[0], A[1], A[2], A[3], '#07080A');
    a += shelfUnit(A[0] - 10, A[1] + 30, 330, 400, { rows: 5, glow: 0.35, seed: 'p17L' }) + shelfUnit(A[0] + 640, A[1] + 30, 300, 400, { rows: 5, glow: 0.35, seed: 'p17R' });
    a += R(A[0], A[1], A[2], A[3], C.ink, 'opacity=".8"');
    a += R(A[0], A[1], A[2], 26, '#1B1E22', st('#000', 2));
    a += glow(A[0] + 470, A[1] + 360, 300, 180, 'gY', 0.3);
    const m1 = pB_monster({ fig: { x: A[0] + 470, y: A[1] + 520, s: 1.12, pose: 'reach', flip: true, tilt: 16, arms: { na: [60, 40], fa: [-40, -10] } }, k: k0 });
    const targets = [[A[0] + 40, A[1] + 70], [A[0] + 110, A[1] + 160], [A[0] + 30, A[1] + 250], [A[0] + 180, A[1] + 330], [A[0] + 700, A[1] + 90], [A[0] + 800, A[1] + 180], [A[0] + 690, A[1] + 270], [A[0] + 860, A[1] + 340]];
    let cables = '';
    targets.forEach((t, i) => {
      const from = i % 3 === 0 ? m1.nh : i % 3 === 1 ? m1.fh : m1.back(80 + i * 12);
      cables += pB_cable(from, t, 40 + (i % 3) * 30, i);
      cables += handsetBox(t[0] - 20, t[1] - 16, 40, 34, { glow: 0.5 });
    });
    a += cables + m1.g;
    a += ollie({ x: A[0] + 880, y: A[1] + 416, s: 0.17, dark: true, turn: -1 });
    // cables that break the border
    const over = pB_cable(m1.back(130), [A[0] + A[2] + 40, A[1] + A[3] + 30], 60, 9, { beads: 14 }) + pB_cable(m1.back(170), [A[0] - 36, A[1] + A[3] + 44], 30, 10, { beads: 14 });
    s += pg.panel('a', A, a, { over, desc: 'Jarrad turns. The leaderboard grin, exactly — too wide; the eyes don’t move with it. His head bends against the ceiling. Charging cables run from his back and forearms into hundreds of boxes, pulsing yellow like veins.' });

    // 2: a water while you wait — the balloons along the top, him and the bottle under them
    let b = R(B[0], B[1], B[2], B[3], '#08090B') + glow(B[0] + 300, B[1] + 300, 260, 140, 'gY', 0.25);
    const m2 = pB_monster({ fig: { x: B[0] + 110, y: B[1] + 732, s: 1.55, pose: 'hand', look: [1, 0], arms: { na: [58, 98] } }, k: k0, sx: 0.92, sy: 1.05 });
    b += m2.g + pB_bottle(m2.nh[0] + 12, m2.nh[1] - 26, 0.8, 6);
    s += pg.panel('b', B, b, { desc: 'Jarrad holds out a bottle of black, cloudy water. Something small turns over inside it.' });
    s += pg.say({ p: 'b', x: B[0] + 118, y: B[1] + 66, text: 'Can I get you a water while you wait? You look thirsty.', who: 'JARRAD', tail: [m2.mouth[0] - 4, m2.mouth[1] - 26], w: 196, size: 22 });
    s += pg.say({ p: 'b', x: B[0] + 334, y: B[1] + 96, text: 'Have you heard about our new plan? Unlimited. Forever.', who: 'JARRAD', tail: [m2.mouth[0] + 22, m2.mouth[1] - 10], w: 196, size: 22 });

    // 3: Zee backing away; he's closer, and he hasn't walked
    let c = R(Cc[0], Cc[1], Cc[2], Cc[3], '#060708') + glow(Cc[0] + 330, Cc[1] + 200, 220, 220, 'gY', 0.2);
    const m3 = pB_monster({ fig: { x: Cc[0] + 345, y: Cc[1] + 1190, s: 2.6, pose: 'still', flip: true, look: [-1, 0] }, k: k0, sx: 0.9, sy: 1.1 });
    c += m3.g;
    c += fig('zee', { x: Cc[0] + 120, y: Cc[1] + 560, s: 1.25, view: 'front', pose: 'recoil', face: 'scream', look: [1, 0], light: 'side', so: 0.65, no: ['tablet'] });
    s += pg.panel('c', Cc, c, { desc: 'Zee backing away. Jarrad is closer. He hasn’t walked.' });
    s += pg.say({ p: 'c', x: Cc[0] + 236, y: Cc[1] + 56, text: 'And no lock-in contract. You’re never locked in.', who: 'JARRAD', tail: [m3.mouth[0] - 30, m3.mouth[1] - 30], w: 290, size: 24 });

    // 4: close on his mouth — the leaderboard grin pulled far past where a mouth should stop, far too many teeth
    let d = R(D[0], D[1], D[2], D[3], '#030303');
    const mx = D[0] + 225, my = D[1] + 128, sk = CAST.jarrad.skin;
    d += Pa(`M${mx - 300} ${my - 140}L${mx + 300} ${my - 140}L${mx + 300} ${my + 70}Q${mx + 150} ${my + 170} ${mx} ${my + 176}Q${mx - 150} ${my + 170} ${mx - 300} ${my + 70}Z`, sk, st(C.ink, 5));
    d += R(D[0], D[1], D[2], D[3], 'url(#gUnder)', 'opacity=".95"') + R(D[0], D[1] + D[3] * 0.45, D[2], D[3] * 0.55, 'url(#gUnderS)', 'opacity=".5"');
    // smile creases dug up into the cheeks
    d += Pa(`M${mx - 196} ${my - 92}Q${mx - 238} ${my - 6} ${mx - 214} ${my + 64}M${mx + 196} ${my - 98}Q${mx + 240} ${my - 10} ${mx + 216} ${my + 58}`, 'none', st(C.ink, 4));
    const lipT = `M${mx - 206} ${my - 34}Q${mx} ${my - 4} ${mx + 206} ${my - 40}`, lipB = `Q${mx + 150} ${my + 86} ${mx} ${my + 90}Q${mx - 150} ${my + 86} ${mx - 206} ${my - 34}Z`;
    d += Pa(lipT + lipB, '#3A0E10', st(C.ink, 5));
    const tid = uid('mt');
    d += `<clipPath id="${tid}"><path d="${lipT + lipB}"/></clipPath><g clip-path="url(#${tid})">`;
    let teeth = '';
    for (let k2 = -11; k2 <= 11; k2++) {
      const tx = mx + k2 * 18.5, t0 = my - 30 + Math.abs(k2) * 0.2 - (k2 > 0 ? k2 * 0.25 : 0) + (k2 * k2) * 0.04;
      teeth += R(tx - 8.5, t0 - 6, 17, 34 - Math.abs(k2) * 0.9, '#EFE9D6', `rx="4" ${st(C.ink, 2)}`);
      teeth += R(tx - 8, my + 34 + (k2 * k2) * 0.12, 16, 30 - Math.abs(k2) * 0.8, '#DED6BE', `rx="4" ${st(C.ink, 2)}`);
    }
    d += teeth + `</g>` + Pa(lipT + lipB, 'none', st(C.ink, 5));
    d += [-120, -60, 0, 60, 120].map((x, k2) => Ci(mx + x + (k2 % 2) * 14, my + 128 + (k2 % 3) * 7, 1.6, '#2A1A10')).join('');
    d += R(D[0], D[1], D[2], 46, 'url(#gFadeUp)', 'opacity=".9"') + Pa(`M${mx - 300} ${my + 70}Q${mx - 150} ${my + 170} ${mx} ${my + 176}Q${mx + 150} ${my + 170} ${mx + 300} ${my + 70}`, 'none', st(C.y, 3, 'opacity=".8"'));
    s += pg.panel('d', D, d, { desc: 'Close on his mouth: the leaderboard grin, pulled far past where a mouth should stop. Far too many teeth.' });
    s += pg.say({ p: 'd', x: D[0] + 330, y: D[1] + 42, text: 'You’re never locked out.', who: 'JARRAD', tail: [mx + 70, my - 22], w: 200, size: 25 });

    // 5: you just... stay
    let e = R(Eb[0], Eb[1], Eb[2], Eb[3], '#050505');
    const m5 = pB_monster({ fig: { x: Eb[0] + 200, y: Eb[1] + 110 + 318 * 1.08 * 5 * 1.08, s: 5, view: 'front', pose: 'still' }, k: 1, sx: 1, sy: 1.08 });
    e += m5.g + R(Eb[0], Eb[1] + 150, Eb[2], 110, 'url(#gFade)');
    s += pg.panel('e', Eb, e, { desc: 'His eyes, pinprick-still above the smile.' });
    s += pg.say({ p: 'e', x: Eb[0] + 385, y: Eb[1] + 186, text: 'You just… stay.', who: 'JARRAD', tail: [Eb[0] + 250, Eb[1] + 240], w: 120, size: 26 });

    // 6: her hand on the box — warm, and rising
    let f = R(F[0], F[1], F[2], F[3], '#0B0A08') + glow(F[0] + 300, F[1] + 200, 320, 200, 'gO', 0.25);
    f += shelfUnit(F[0] - 20, F[1] + 260, 640, 120, { rows: 1, seed: 'p17f', glow: 0.25 });
    f += `<g class="fx-breathe" style="animation-duration:2.6s">${handsetBox(F[0] + 150, F[1] + 60, 300, 210, { label: 'ZEE — 1 UNIT', col: '#E9E2D2' })}</g>`;
    // her hand, flat on the top of the box, fingers spread
    f += `<g transform="translate(${F[0] + 400} ${F[1] + 120}) rotate(-24)">` +
      [[-26, -16], [-30, 2], [-28, 20], [-20, 36]].map(([x0, y0], i) => `<g transform="translate(${x0} ${y0}) rotate(${-8 + i * 7})">${R(-62, -8, 66, 16, '#B07A55', `rx="8" ${st(C.ink, 2.6)}`)}${Pa('M-40 -6v12M-20 -6v12', 'none', st('#6E4A33', 1.2))}</g>`).join('') +
      `<g transform="translate(-6 -34) rotate(-50)">${R(-40, -8, 44, 16, '#B07A55', `rx="8" ${st(C.ink, 2.6)}`)}</g>${R(-30, -32, 70, 74, '#B07A55', `rx="22" ${st(C.ink, 3)}`)}${R(30, -38, 120, 86, C.navy, st(C.ink, 3))}${Ln(34, -38, 34, 48, C.y, 3)}</g>`;
    f += R(F[0], F[1], F[2], F[3], 'url(#gVig)', 'opacity=".7"');
    s += pg.panel('f', F, f, { desc: 'Zee’s hand on a box beside her. The label: ZEE — 1 UNIT. The cardboard is warm. Under her palm, it rises. Falls. Rises.' });
    s += pg.sfx('thmp… thmp…', F[0] + 470, F[1] + 330, { size: 28, rot: -6, fill: '#C9A27A', p: 'f' });

    // 7: hook — a white panel; the scream, cut off
    let g = R(G7[0], G7[1], G7[2], G7[3], '#FFFFFF');
    g += `<text class="ft-x" x="${G7[0] + 16}" y="${G7[1] + 120}" font-size="64" fill="#FFFFFF" stroke="${C.ink}" stroke-width="5" paint-order="stroke" transform="rotate(-8 ${G7[0] + 16} ${G7[1] + 120})" letter-spacing="2">AAAAAH—</text>`;
    s += pg.panel('g', G7, g, { desc: 'A white panel. Zee’s scream, cut off.' });
    pg.lines.push({ who: 'ZEE', text: 'AAAAAH—' });
    s += pg.sfx('BEEP', G7[0] + 150, G7[1] + 300, { size: 190, rot: -10, fill: C.ink, stroke: '#FFFFFF', sw: 10, outer: C.ink, p: 'g' });

    s += pB_gutRot(490, 816, 'p17g1', { reach: 60, count: 24, delay: 2 }) + pB_gutRot(649, 1250, 'p17g2', { reach: 70, count: 26, delay: 4 }) + pB_gutRot(960, 470, 'p17g3', { reach: 50, count: 18, delay: 6 });
    return s;
  },
  mount(ctx) {
    // in page view he is a little closer every time you come back; in guided view, every tap
    Reader.sess.pB17 = (Reader.sess.pB17 || 0) + 1;
    if (ctx.mode === 'guided') {
      // panels b and c: each tap, the next one has him a little bigger in frame — never while you're looking
      const order = ['a', 'b', 'c'];
      order.forEach((p, i) => ctx.onPanel(p, () => {
        order.slice(i + 1).forEach((q) => ctx.qa(`.pn[data-panel="${q}"] .pB17-j`).forEach((el) => { el.style.transform = `scale(${n((1 + (i + 1) * 0.08) * 1000) / 1000})`; }));
      }));
    }
    ctx.onPanel('f', () => { ctx.haptic('heartbeat'); ctx.sfx('heartbeat'); ctx.after(1500, () => ctx.sfx('heartbeat')); }, 3500);
    ctx.onPanel('g', () => { ctx.sfx('bigbeep'); ctx.haptic('thump'); }, 5200);
  },
});

/* ---------- Page 18 — One Unit ---------- */

// Shelving drawn onto a receding wall quad (for storeInterior's left/right walls).
function pB_wallShelves(q, seed) {
  const r = rng(seed);
  let g = '';
  for (let j = 0; j < 4; j++) {
    const v1 = 0.22 + j * 0.19;
    g += Po(quadAt(q, 0.02, 0.98, v1 + 0.15, v1 + 0.165), '#8A8F96', st(C.ink, 1.2));
    for (let i = 0; i < 9; i++) {
      if (r() < 0.15) continue;
      const u0 = persp(0.03 + i * 0.105), u1 = persp(0.03 + i * 0.105 + 0.085);
      g += Po(quadAt(q, u0, u1, v1 + 0.04 + r() * 0.03, v1 + 0.15), r() < 0.5 ? '#EEEAE0' : '#DDD6C6', st(C.ink, 1.2));
    }
  }
  return g;
}

page(18, {
  title: 'One Unit', side: 'left', gutter: 'black', bleed: 'black', status: 'sos',
  alt: 'Luka and Chloe haul the stockroom door open. It’s just the stockroom: small, ordinary, three metres deep. Zee isn’t there. The landline handset lies on the floor, its cord running under the door. On a shelf at eye level, a sealed handset box with fresh tape: ZEE — 1 UNIT — DEMO. It is rising and falling, slowly, like sleep. Through the door, the queue TV: Now serving 03.',
  sound: { hum: true },
  render(pg) {
    const A = [40, 40, 920, 440], B = [40, 498, 450, 300], Cc = [508, 498, 452, 300], D = [40, 816, 920, 300], Eb = [40, 1134, 560, 326], F = [618, 1134, 342, 326];
    let s = pB_style(`.pB18-tips{opacity:0;transition:opacity 1.4s ease-in-out}.pB18-tips.on{opacity:1}`);
    // 1: just the stockroom. Small. Ordinary. Empty.
    let a = storeInterior([A[0] + 60, A[1] + 30, A[2] - 120, A[3] - 30], {
      day: true, night: 0.02, vx: 0.5, vy: 0.46, bw: 0.5, bh: 0.56, vig: 0.35, lights: [1, 1, 1, 1, 1, 1], flicker2: 2,
      back: (x, y, w, h) => shelfUnit(x + 10, y + 16, w - 20, h - 20, { rows: 3, seed: 'p18back' }),
      left: (q) => pB_wallShelves(q, 'p18L'), right: (q) => pB_wallShelves(q, 'p18R'), seed: 'p18',
    });
    a += R(A[0] + 380, A[1] + 360, 90, 50, '#3D6FB0', st(C.ink, 3)) + R(A[0] + 380, A[1] + 360, 90, 12, '#5B8AC8', st(C.ink, 2)) + R(A[0] + 500, A[1] + 372, 70, 40, '#3D6FB0', st(C.ink, 3));
    // the doorway they're standing in
    a += Pa(`M${A[0]} ${A[1]}H${A[0] + A[2]}V${A[1] + A[3]}H${A[0]}Z M${A[0] + 70} ${A[1] + 36}V${A[1] + A[3]}H${A[0] + A[2] - 70}V${A[1] + 36}Z`, '#14181E', 'fill-rule="evenodd"');
    a += R(A[0] + 58, A[1] + 26, 16, A[3], '#3A424C', st(C.ink, 3)) + R(A[0] + A[2] - 74, A[1] + 26, 16, A[3], '#3A424C', st(C.ink, 3));
    a += Po([[A[0] + A[2] - 60, A[1] + 30], [A[0] + A[2] + 10, A[1] - 10], [A[0] + A[2] + 10, A[1] + A[3] + 20], [A[0] + A[2] - 60, A[1] + A[3]]], '#4A525C', st(C.ink, 3));
    a += fig('luka', { x: A[0] + 150, y: A[1] + 600, s: 1.15, view: 'back', farms: { r: [-62, -96], l: [8, 3] }, light: 'dark', so: 0.4 });
    a += fig('chloe', { x: A[0] + 770, y: A[1] + 600, s: 1.1, view: 'back', light: 'dark', so: 0.4, farms: { r: [80, 70] } });
    s += pg.panel('a', A, a, { desc: 'Luka and Chloe haul the stockroom door open. Fluorescents. It’s just the stockroom — small, ordinary, three metres deep, shelves and stocktake tubs. Zee isn’t there.' });

    // 2: "Zee!" — and the handset on the floor
    let b = R(B[0], B[1], B[2], B[3], '#D3D0C6') + R(B[0], B[1] + 200, B[2], 100, '#B9B5AA');
    b += Pa(`M${B[0]} ${B[1] + 204}L${B[0] + B[2]} ${B[1] + 196}`, 'none', st(C.ink, 3));
    b += fig('luka', { x: B[0] + 300, y: B[1] + 520, s: 1.3, flip: true, face: 'shout', light: 'side', so: 0.45, props: ['lanyard'] });
    // the door they've just hauled open, edge-on at the left, and the cord coming in under it
    b += R(B[0], B[1], 74, 286, '#4A525C', st(C.ink, 3)) + R(B[0] + 54, B[1] + 130, 12, 30, '#9AA0A6', st(C.ink, 1.5)) + R(B[0], B[1] + 286, 90, 14, '#0B0D10');
    b += pB_curly([B[0] + 30, B[1] + 292], [B[0] + 120, B[1] + 296], [B[0] + 172, B[1] + 272], { k: 10, r: 6 });
    b += pB_handset(B[0] + 210, B[1] + 262, 0.95, 74);
    s += pg.panel('b', B, b, { desc: 'Luka shouts for Zee. The landline handset lies on the floor, its cord running under the door.' });
    s += pg.say({ p: 'b', x: B[0] + 150, y: B[1] + 80, type: 'shout', text: 'Zee!', who: 'LUKA', tail: [B[0] + 260, B[1] + 120], w: 100, size: 34 });

    // 3: on a shelf at eye level
    let c = R(Cc[0], Cc[1], Cc[2], Cc[3], '#CFCBC1');
    c += shelfUnit(Cc[0] + 150, Cc[1] - 30, 320, 360, { rows: 3, seed: 'p18c' });
    c += handsetBox(Cc[0] + 206, Cc[1] + 86, 236, 144, { tape: '#E8D9A0' }) + R(Cc[0] + 216, Cc[1] + 168, 216, 46, '#FFFFFF', st(C.ink, 2)) + Tx(Cc[0] + 324, Cc[1] + 198, 'ZEE — 1 UNIT — DEMO', 19, C.ink, 'text-anchor="middle"', FONTS.mono);
    c += fig('chloe', { x: Cc[0] + 110, y: Cc[1] + 600, s: 1.45, face: 'worried', look: [1, 0], light: 'side', so: 0.5 });
    s += pg.panel('c', Cc, c, { desc: 'Chloe sees it on a shelf at eye level: a sealed handset box, fresh tape. ZEE — 1 UNIT — DEMO.' });

    // 4: close — the box is breathing
    let d = R(D[0], D[1], D[2], D[3], '#BDB8AC') + R(D[0], D[1], D[2], D[3], 'url(#ht1)', 'opacity=".3"');
    d += R(D[0], D[1] + 250, D[2], 50, '#8A8F96', st(C.ink, 3));
    d += handsetBox(D[0] + 30, D[1] + 120, 120, 130, {}) + handsetBox(D[0] + 750, D[1] + 110, 150, 140, {});
    let box = handsetBox(D[0] + 250, D[1] + 30, 420, 222, { label: 'ZEE — 1 UNIT — DEMO', tape: '#E8D9A0' });
    box += R(D[0] + 250, D[1] + 120, 420, 26, '#FFF6C8', 'opacity=".35"');
    // fingertips pressing up against the tape from inside: four bulges and a thumb, the tape stretched taut round them
    box += `<g class="pB18-tips">${[0, 1, 2, 3].map((i) => {
      const fx = D[0] + 404 + i * 36, fy = D[1] + 132 + [4, 0, 1, 6][i];
      return `${E(fx, fy + 5, 15, 9, '#7E7258', 'opacity=".55"')}${E(fx, fy, 13, 10, '#F4E7B8')}${E(fx - 3, fy - 3, 6, 4, '#FFFBEA', 'opacity=".9"')}` +
        Pa(`M${fx - 22} ${fy - 9}Q${fx} ${fy - 15} ${fx + 22} ${fy - 9}M${fx - 18} ${fy + 12}l-8 8M${fx + 18} ${fy + 12}l8 8`, 'none', st('#9C8E6E', 1.4, 'opacity=".8"'));
    }).join('')}${E(D[0] + 372, D[1] + 156, 12, 9, '#F4E7B8')}${E(D[0] + 372, D[1] + 160, 13, 8, '#7E7258', 'opacity=".4"')}</g>`;
    d += `<g class="fx-breathe">${box}</g>`;
    s += pg.panel('d', D, d, { desc: 'Close. The box is rising and falling. Slowly. Like sleep.', guided: [{ focus: [D[0] + 190, D[1], 540, D[3]], move: 'creep' }] });

    // 5: don't — Luka left, Chloe right, the box between them; her sleeve-covered hand hovering over the tape
    let e = R(Eb[0], Eb[1], Eb[2], Eb[3], '#2A2C30') + glow(Eb[0] + 280, Eb[1] + 200, 280, 180, 'gW', 0.22);
    e += R(Eb[0], Eb[1] + 262, Eb[2], 64, '#8A8F96', st(C.ink, 3));
    e += `<g class="fx-breathe">${handsetBox(Eb[0] + 168, Eb[1] + 196, 236, 120, { tape: '#E8D9A0' })}${R(Eb[0] + 186, Eb[1] + 264, 200, 36, '#FFFFFF', st(C.ink, 2))}${Tx(Eb[0] + 286, Eb[1] + 289, 'ZEE — 1 UNIT — DEMO', 17, C.ink, 'text-anchor="middle"', FONTS.mono)}</g>`;
    const oc = {}, ol = {};
    e += fig('luka', { x: Eb[0] + 96, y: Eb[1] + 690, s: 1.6, face: 'angry', look: [1, 0.3], light: 'side', so: 0.55, out: ol, props: ['lanyard'], arms: { na: [64, 150] } });
    e += fig('chloe', { x: Eb[0] + 476, y: Eb[1] + 640, s: 1.6, flip: true, face: 'cry', look: [-1, 1], light: 'side', so: 0.5, out: oc, arms: { na: [50, 122] } });
    s += pg.panel('e', Eb, e, { desc: 'Chloe’s hand, the sleeve pulled over it, hovers over the tape. Luka stops her.' });
    s += pg.say({ p: 'e', x: Eb[0] + 82, y: Eb[1] + 50, text: 'Don’t.', who: 'LUKA', tail: [ol.head[0] + 4, ol.head[1] - 44], w: 90, size: 26 });
    s += pg.say({ p: 'e', x: Eb[0] + 470, y: Eb[1] + 48, text: 'She’s in there.', who: 'CHLOE', tail: [oc.head[0] + 4, oc.head[1] - 44], w: 130, size: 26 });
    s += pg.say({ p: 'e', x: Eb[0] + 272, y: Eb[1] + 112, text: 'Something is.', who: 'LUKA', tail: [ol.mouth[0] + 14, ol.mouth[1] - 4], w: 120, size: 26 });

    // 6: hook — through the door, the queue TV
    let f = R(F[0], F[1], F[2], F[3], '#07090C');
    f += R(F[0] + 40, F[1] + 20, 262, 290, '#121820') + R(F[0] + 30, F[1] + 10, 282, 300, 'none', st('#3A424C', 14));
    f += queueTV(F[0] + 76, F[1] + 100, 190, 110, { num: '03' });
    f += Tx(F[0] + 171, F[1] + 246, '02 — SERVED 12:41', 18, C.y, 'text-anchor="middle" class="lit"', FONTS.mono);
    f += ollie({ x: F[0] + 260, y: F[1] + 312, s: 0.22, dark: true, turn: -1 });
    f += R(F[0], F[1], F[2], F[3], 'url(#gVig)', 'opacity=".6"');
    s += pg.panel('f', F, f, { desc: 'Through the door, the queue TV: NOW SERVING 03. Smaller, beneath: 02 — SERVED 12:41.' });
    pg.lines.push({ who: 'QUEUE TV', text: 'NOW SERVING 03. 02 — SERVED 12:41.' });

    s += pB_gutRot(40, 806, 'p18g1', { reach: 60, count: 24, delay: 2 }) + pB_gutRot(609, 1290, 'p18g2', { reach: 70, count: 28, delay: 4 }) + pB_gutRot(960, 520, 'p18g3', { reach: 55, count: 20, delay: 6 });
    return s;
  },
  mount(ctx) {
    // linger and, once only, fingertips press up against the tape from inside
    ctx.dwell(7000, () => {
      if (Reader.sess.pB18tips) return;
      Reader.sess.pB18tips = true;
      const t = ctx.q('.pB18-tips');
      if (!t) return;
      t.classList.add('on');
      ctx.after(2600, () => t.classList.remove('on'));
    });
    // a slow heartbeat while the box is on screen (three at most)
    ctx.onPanel('d', () => { [0, 2600, 5200].forEach((ms) => ctx.after(ms, () => { ctx.haptic('heartbeat'); ctx.sfx('heartbeat', { v: 0.6 }); })); }, 2400);
    ctx.onPanel('f', () => ctx.sfx('chime'), 5200);
  },
});

/* ---------- Page 19 — Stems ---------- */

// Waveform lane: one path of bars. amp(t) gives the envelope.
function pB_wave(x, y, w, h, seed, col) {
  const r = rng(seed);
  let d = '';
  for (let i = 0; i < w; i += 4) {
    const a = (0.25 + 0.75 * Math.abs(Math.sin(i * 0.031 + r() * 0.4))) * (0.4 + r() * 0.6) * h * 0.46;
    d += `M${n(x + i)} ${n(y + h / 2 - a)}v${n(a * 2)}`;
  }
  return `<path d="${d}" stroke="${col}" stroke-width="2.4" fill="none"/>`;
}

// Faint counting voices filling a panel.
function pB_counting(box, seed, op = 0.5) {
  const r = rng(seed), [x, y, w, h] = box;
  const words = ['one', 'two', 'three', 'four', '…forty-one', 'forty-two', '4,012', '4,013', 'seven', 'six', 'five', '3,998', 'nine', 'eleven', '…twelve', 'one', 'two', 'three'];
  let s = '';
  for (let i = 0; i < 46; i++) {
    const t = r.pick(words), sz = 12 + r() * 16;
    s += `<text class="ft-s" x="${n(x + r() * w)}" y="${n(y + r() * h)}" font-size="${n(sz)}" fill="#BFC8D0" opacity="${n(op * (0.25 + r() * 0.75))}" transform="rotate(${n(r.jit(12))} ${n(x + w / 2)} ${n(y + h / 2)}) scale(-1 1) translate(${n(-2 * (x + w / 2))} 0)">${esc(t.toUpperCase())}</text>`;
  }
  return s;
}

page(19, {
  title: 'Stems', side: 'right', gutter: 'black', bleed: 'hold', status: 'sos',
  alt: 'Chase takes the hold music apart on his laptop while Code Rot eats the file from both ends. Reversed and slowed, the melody is full of voices, hundreds of them, all counting — and one clear one, Jarrad’s, saying count them again. Among them, tiny, Zane: there’s so many people in here. Chase works out the rule: it can’t take what isn’t counted. Behind them, by the display wall, Luke stands very straight, smiling. One finger rises. One.',
  sound: { hum: true, hold: true },
  render(pg) {
    const A = [40, 40, 920, 360], B = [40, 418, 920, 330], Cc = [40, 766, 450, 280], D = [508, 766, 452, 280], Eb = [40, 1064, 600, 396], F = [658, 1064, 302, 396];
    let s = pB_style(`.pB19-mir{transform-box:fill-box;transform-origin:center;cursor:pointer}.pB19-cnt{transform-box:fill-box;transform-origin:center}
      .pB19-kp{transform-box:fill-box;transform-origin:center;animation:pulse 1.6s ease-in-out infinite}.pB19-used .pB19-kp,.rm .pB19-kp{animation:none}
      .pB19-fill{transform-box:fill-box;transform-origin:100% 50%;transform:scaleX(0)}
      .pB19-wait .pB19-eatL,.pB19-wait .pB19-eatR{animation-play-state:paused}.pB19-eatL{transform-box:fill-box;transform-origin:0 50%;animation:pB19e 60s linear forwards}.pB19-eatR{transform-box:fill-box;transform-origin:100% 50%;animation:pB19e 60s linear forwards}
      @keyframes pB19e{from{transform:scaleX(.04)}to{transform:scaleX(1)}}
      .pB19-head{animation:pB19h 4.2s linear infinite}@keyframes pB19h{from{transform:translateX(0)}to{transform:translateX(560px)}}
      .rm .pB19-eatL,.rm .pB19-eatR{animation:none;transform:scaleX(.45)}.rm .pB19-head{animation:none}`);
    // 1: Chase at the counter, taking it apart
    let a = storeInterior(A, { vx: 0.62, vy: 0.3, bw: 0.4, bh: 0.44, night: 0.55, lights: [0, 1, 0, 0, 1, 0], left: 'display', right: 'acc', vig: 1, back: 'front', seed: 'p19' });
    a += ollie({ x: A[0] + 660, y: A[1] + 196, s: 0.2, dark: true, turn: -1 });
    a += fig('chloe', { x: A[0] + 700, y: A[1] + 470, s: 0.95, flip: true, face: 'worried', light: 'side', so: 0.6 });
    a += fig('luka', { x: A[0] + 820, y: A[1] + 480, s: 1.0, flip: true, face: 'flat', light: 'side', so: 0.6, props: ['lanyard'] });
    const oc = {};
    a += fig('chase', { x: A[0] + 250, y: A[1] + 600, s: 1.25, pose: 'reach', face: 'talk', out: oc, light: 'side', so: 0.55, arms: { na: [52, 96], fa: [40, 92] } });
    a += counterObj(A[0] + 300, A[1] + 290, 420, 100, { dark: true });
    a += laptopObj(A[0] + 330, A[1] + 196, 150, 96, { screen: '#121820', content: (sx, sy, sw, sh) => [0, 1, 2].map((i) => pB_wave(sx + 6, sy + 8 + i * 20, sw - 12, 16, `p19m${i}`, ['#6FD3FF', '#FFCD00', '#B7F07A'][i])).join('') });
    a += glow(A[0] + 405, A[1] + 236, 140, 80, 'gS', 0.35);
    a += phoneObj(A[0] + 520, A[1] + 236, 34, 62, { lit: true, screen: '#CFF2FF', rot: -70 });
    a += notesFx(A[0] + 540, A[1] + 230, { count: 7, dx: 220, dy: -150, col: C.y, stroke: C.ink, seed: 'p19n' });
    s += pg.panel('a', A, a, { desc: 'Chase at the counter: laptop open, music software running, a demo phone on speaker beside it, the hold music’s notes curling out. Luka and Chloe watch.' });
    s += pg.say({ p: 'a', x: 240, y: 110, text: 'It’s audio. Everything in here is audio. And audio I can take apart.', who: 'CHASE', tail: [oc.head[0] + 10, oc.head[1] - 30], w: 280, size: 25 });

    // 2: the screen — stems, reversed and slowed, rotting in from both ends
    const S = [B[0] + 20, B[1] + 20, B[2] - 40, B[3] - 40];
    let b = R(B[0], B[1], B[2], B[3], '#0A0C10');
    b += R(S[0], S[1], S[2], S[3], '#161A22', st('#2C3340', 3)) + R(S[0], S[1], S[2], 30, '#262C38') + Tx(S[0] + 12, S[1] + 21, 'PUDDING — hold_loop_FINAL_v7.wav   ◀◀ REVERSE   × 0.5', 17, '#A9B4C2', '', FONTS.mono);
    const lanes = ['MELODY', 'VOICES', 'VOICES (deep)', 'NOISE'], cols = ['#FFCD00', '#6FD3FF', '#B7F07A', '#9AA0A6'];
    lanes.forEach((nm, i) => {
      const ly = S[1] + 40 + i * 52;
      b += R(S[0] + 8, ly, 110, 46, '#20252F') + Tx(S[0] + 16, ly + 28, nm, 15, '#C9D2DC', '', FONTS.mono);
      b += R(S[0] + 124, ly, S[2] - 136, 46, '#10141A') + pB_wave(S[0] + 128, ly + 2, S[2] - 144, 42, `p19w${i}`, cols[i]);
    });
    const LX = S[0] + 124, LW = S[2] - 136, LY = S[1] + 40, LH = 4 * 52;
    b += `<g class="pB19-head">${Ln(LX + 4, LY - 4, LX + 4, LY + LH, '#FFFFFF', 2, 'opacity=".8"')}</g>`;
    // the rot eating the file from both ends
    b += `<g class="pB19-eatL">${R(LX, LY - 4, LW / 2, LH + 4, C.rot2, 'opacity=".92"')}</g><g class="pB19-eatR">${R(LX + LW / 2, LY - 4, LW / 2, LH + 4, C.rot2, 'opacity=".92"')}</g>`;
    b += rotPatch({ x: LX, y: LY + LH / 2, box: [LX - 10, LY - 10, LW / 2, LH + 20], reach: LW / 2, count: 90, size: 16, seed: 'p19rL', grow: 60, ang: 0 });
    b += rotPatch({ x: LX + LW, y: LY + LH / 2, box: [LX + LW / 2, LY - 10, LW / 2 + 10, LH + 20], reach: LW / 2, count: 90, size: 16, seed: 'p19rR', grow: 60, ang: Math.PI });
    // the scrub bar: drag (or tap) to reverse the voices back into words
    const TB = [LX, S[1] + S[3] - 34, LW, 22];
    // the scrub: a lane-label cue in the left column and a pulsing knob, big enough to find on a phone
    b += `<g class="pB19-scrub">${R(S[0] + 4, TB[1] - 14, TB[2] + 136, TB[3] + 30, 'transparent')}${R(TB[0], TB[1] + 7, TB[2], 8, '#2C3340', 'rx="4"')}<g class="pB19-fill">${R(TB[0], TB[1] + 7, TB[2], 8, C.y, 'rx="4" opacity=".55"')}</g>` +
      `${Tx(S[0] + 12, TB[1] + 19, '◀ REVERSE', 21, C.y, '', FONTS.mono)}<g class="pB19-knob" transform="translate(${TB[0] + TB[2]} ${TB[1] + 11})"><g class="pB19-kp">${Ci(0, 0, 17, C.y, st(C.ink, 3))}${Pa('M5 -7 L-6 0 L5 7', 'none', st(C.ink, 3))}</g></g></g>`;
    s += pg.panel('b', B, b, { desc: 'Chase’s screen: waveform lanes. He has reversed the hold music and slowed it down. Code Rot is eating the file in from both ends. A scrub bar runs along the bottom.' });
    s += pg.say({ p: 'b', x: B[0] + 760, y: B[1] - 4, text: 'It’s rotting the file. I’ve got about a minute.', who: 'CHASE', tail: [B[0] + 500, B[1] - 64], w: 250, size: 24, rot: 0.2 });

    // 3: under the melody — hundreds of voices, all counting, and one clear one
    let c = R(Cc[0], Cc[1], Cc[2], Cc[3], '#07090D') + `<g class="pB19-cnt">${pB_counting(Cc, 'p19c', 0.6)}</g>`;
    c += pB_wave(Cc[0], Cc[1] + 200, Cc[2], 80, 'p19cw', '#2A3A4A');
    s += pg.panel('c', Cc, c, { desc: 'Under the melody: voices. Hundreds of them, all counting. And one clear one — Jarrad’s, slowed and reversed.' });
    s += `<g class="pB19-mir" style="transform:scaleX(-1)">${pg.say({ p: 'c', x: Cc[0] + 225, y: Cc[1] + 130, type: 'elec', text: 'count them again', who: 'JARRAD (slowed and reversed)', tail: [Cc[0] + 120, Cc[1] + 260], w: 220, size: 34 })}</g>`;

    // 4: among them, tiny, Zane
    let d = R(D[0], D[1], D[2], D[3], '#07090D') + `<g class="pB19-cnt">${pB_counting(D, 'p19d', 0.45)}</g>`;
    d += `<g opacity=".18">${blockFace(D[0] + 330, D[1] + 160, 'p19zane', { tones: ['#E6B996', '#C99C7A', '#B48A6A', '#F0CCAA'] })}</g>`;
    s += pg.panel('d', D, d, { desc: 'Among them, tiny: Zane’s voice.' });
    s += `<g class="pB19-mir" style="transform:scaleX(-1)">${pg.say({ p: 'd', x: D[0] + 170, y: D[1] + 186, type: 'tiny', text: 'there’s so many people in here', who: 'ZANE (tiny, among the voices)', tail: [D[0] + 320, D[1] + 160], w: 190 })}</g>`;

    // 5: the rule
    let e = R(Eb[0], Eb[1], Eb[2], Eb[3], '#151A20') + glow(Eb[0] + 160, Eb[1] + 300, 260, 200, 'gS', 0.2);
    const ec = {}, el = {}, eh = {};
    e += fig('luka', { x: Eb[0] + 360, y: Eb[1] + 780, s: 1.5, flip: true, face: 'flat', light: 'side', so: 0.6, out: el, props: ['lanyard'] });
    e += fig('chloe', { x: Eb[0] + 520, y: Eb[1] + 740, s: 1.45, flip: true, face: 'scared', light: 'side', so: 0.6, out: eh });
    e += fig('chase', { x: Eb[0] + 150, y: Eb[1] + 780, s: 1.6, view: 'front', pose: 'shrug', face: 'shout', out: ec, light: 'side', so: 0.5 });
    // two guided stops so Chase's long line stays big enough to read on a phone
    s += pg.panel('e', Eb, e, { desc: 'Chase turns to Luka, urgent.', guided: [{ focus: [34, 1064, 418, 396] }, { focus: [404, 1064, 242, 396] }] });
    s += pg.say({ p: 'e', x: Eb[0] + 196, y: Eb[1] + 118, text: 'It can’t take what isn’t counted. That’s why everything tonight is counting. The stocktake. Your headcount. The tickets. Zane’s viewers. It’s counting us IN.', who: 'CHASE', tail: [ec.head[0], ec.head[1] - 40], w: 330, size: 22 });
    s += pg.say({ p: 'e', x: Eb[0] + 500, y: Eb[1] + 64, text: 'So nobody counts anything.', who: 'LUKA', tail: [el.head[0] + 6, el.head[1] - 40], w: 150, size: 23, rot: 0.25 });
    s += pg.say({ p: 'e', x: Eb[0] + 500, y: Eb[1] + 200, text: 'Then who’s the seventh?', who: 'CHLOE', tail: [eh.head[0] + 4, eh.head[1] - 34], w: 160, size: 23 });

    // 6: hook — Luke, very straight, smiling. One finger rises.
    let f = R(F[0], F[1], F[2], F[3], '#07090C');
    f += `<g opacity=".55">${displayWall([F[0] + 10, F[1] + 20, F[2] - 20, 250], { cols: 4, rows: 3, lit: (i, j) => (i + j) % 3 === 0, dim: 0.5 })}</g>`;
    f += R(F[0], F[1] + 270, F[2], 130, '#0E1116');
    const lk = { x: F[0] + 160, y: F[1] + 470, s: 1.12, view: 'front', pose: 'point', face: ['dot', 'flat', 'smile'], light: 'under', so: 0.6, props: ['headtorch'], farms: { r: [24, 172] } };
    f += E(F[0] + 210, F[1] + 470, 90, 14, '#000', 'opacity=".6"');
    f += `<g opacity=".35" transform="translate(7 -3)">${fig('luke', lk)}</g>` + fig('luke', lk);
    f += rotPatch({ x: F[0] + 160, y: F[1] + 175, box: [F[0] + 120, F[1] + 160, 80, 40], reach: 40, count: 12, size: 9, seed: 'p19luke', grow: 3 });
    s += pg.panel('f', F, f, { desc: 'Behind them, by the display wall, Luke stands very straight, smiling. One finger rises. His outline doubles, like a dropped frame; letters crawl under the skin above his collar.' });
    s += pg.say({ p: 'f', x: F[0] + 90, y: F[1] + 60, text: 'One.', who: 'LUKE', tail: [F[0] + 158, F[1] + 140], w: 80, size: 28 });

    s += pB_gutRot(490, 758, 'p19g1', { reach: 40, count: 14, delay: 4 });
    return s;
  },
  mount(ctx) {
    // in a spread, the minute the rot needs to eat the file starts when the reader gets to this page
    if (!ctx.isReached()) { ctx.svg.classList.add('pB19-wait'); ctx.whenReached(() => ctx.svg.classList.remove('pB19-wait')); }
    const mirrors = ctx.qa('.pB19-mir'), cnts = ctx.qa('.pB19-cnt'), scrub = ctx.q('.pB19-scrub'), fill = ctx.q('.pB19-fill');
    const S = [60, 438, 880, 290], TBx = S[0] + 124, TBw = S[2] - 136, TBy = S[1] + S[3] - 34 + 11;
    let prog = 0, anim = 0;
    // un-reverse: the voice balloons run scaleX -1 → 1 as the scrub runs back; the counting crowd behind them flips the other way
    const apply = (p) => {
      prog = clamp(p, 0, 1);
      const k = n((prog * 2 - 1) * 1000) / 1000;
      mirrors.forEach((m) => { m.style.transform = `scaleX(${Math.abs(k) < 0.02 ? (k < 0 ? -0.02 : 0.02) : k})`; });
      cnts.forEach((m) => { m.style.transform = `scaleX(${Math.abs(k) < 0.02 ? 0.02 : -k})`; });
      const kn = ctx.q('.pB19-knob');
      if (kn) kn.setAttribute('transform', `translate(${n(TBx + TBw * (1 - prog))} ${TBy})`);
      if (fill) fill.style.transform = `scaleX(${n(prog * 1000) / 1000})`;
    };
    const playTo = (to, ms) => {
      cancelAnimationFrame(anim);
      if (scrub) scrub.classList.add('pB19-used');
      if (ctx.reduced) { apply(to); return; }
      const from = prog, t0 = performance.now();
      const step = (t) => { if (ctx.dead) return; const u = clamp((t - t0) / ms, 0, 1); apply(lerp(from, to, u * u * (3 - 2 * u))); if (u < 1) anim = requestAnimationFrame(step); };
      anim = requestAnimationFrame(step);
    };
    // drag the scrub (a press alone does nothing; a tap is handled below); letting go snaps to whichever end is nearer,
    // so the voices are never left squashed edge-on
    let start = null, moved = false;
    ctx.onDrag('.pB19-scrub', ([x], e) => {
      if (e.type === 'pointerdown') { start = x; moved = false; return; }
      if (start == null) return;
      if (!moved && Math.abs(x - start) < 12) return;
      moved = true;
      cancelAnimationFrame(anim);
      if (scrub) scrub.classList.add('pB19-used');
      apply(1 - (x - TBx) / TBw);
      ctx.sfx('note', { m: 57 + Math.round(prog * 12), v: 0.4 });
    }, () => { if (moved) playTo(prog >= 0.5 ? 1 : 0, 260); start = null; moved = false; });
    // tap the scrub, or a reversed balloon, to play it back the right way (and again to flip it back)
    const toggle = () => { playTo(prog > 0.5 ? 0 : 1, 1200); ctx.sfx('note', { m: prog > 0.5 ? 57 : 69, v: 0.4 }); };
    ctx.onTap('.pB19-scrub', toggle);
    ctx.onTap('.pB19-mir', toggle);
    // in guided view the scrub is a stop behind you: when the reversed voice comes up, it twitches once to show it can turn
    ctx.onPanel('c', () => { if (ctx.mode !== 'guided' || ctx.reduced || prog > 0) return; ctx.after(900, () => { if (prog === 0) { playTo(0.3, 500); ctx.after(560, () => playTo(0, 500)); } }); });
    ctx.onCleanup(() => cancelAnimationFrame(anim));
  },
});
