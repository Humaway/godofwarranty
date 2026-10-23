/* SOS ONLY — environment kit: weather, light, the store and its fittings, the outside world. */

/* ---------- weather and light ---------- */

// Two layers of diagonal rain at different speeds. Seamless: each layer slides one tile height.
function rainFx(box, o = {}) {
  const [x, y, w, h] = box, ang = o.ang == null ? 14 : o.ang;
  const cx = x + w / 2, cy = y + h / 2, big = Math.hypot(w, h) + 60;
  const layer = (pat, cls, op, tile) =>
    `<g transform="rotate(${ang} ${n(cx)} ${n(cy)})"><g class="${cls}"><rect x="${n(cx - big / 2)}" y="${n(cy - big / 2 - tile)}" width="${n(big)}" height="${n(big + tile * 2)}" fill="url(#${pat})" opacity="${op}"/></g></g>`;
  const cid = uid('rc');
  return `<g class="rain" pointer-events="none"${o.noClip ? '' : ` clip-path="url(#${cid})"`}>${o.noClip ? '' : `<clipPath id="${cid}"><rect x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${n(h)}"/></clipPath>`}${o.only !== 'A' ? layer(o.dark ? 'rainD' : 'rainB', 'fx-rainB', o.op2 == null ? 0.85 : o.op2, 300) : ''}${o.only !== 'B' ? layer(o.dark ? 'rainD' : 'rainA', 'fx-rainA', o.op == null ? 1 : o.op, 180) : ''}</g>`;
}

// Droplets and runs on glass.
function glassDrops(box, seed, count = 40, col = '#CFE3F0') {
  const r = rng(seed), [x, y, w, h] = box;
  let s = '';
  for (let i = 0; i < count; i++) {
    const px = x + r() * w, py = y + r() * h, l = 6 + r() * 40;
    s += `<path d="M${n(px)} ${n(py)}q-1.5 ${n(l * 0.6)} 0 ${n(l)}" fill="none" stroke="${col}" stroke-width="${n(1 + r() * 1.6)}" stroke-linecap="round" opacity="${n(0.25 + r() * 0.4)}"/>`;
    if (r() < 0.5) s += Ci(px, py + l, 1.6 + r() * 1.6, col, `opacity="${n(0.35 + r() * 0.3)}"`);
  }
  return `<g pointer-events="none">${s}</g>`;
}

// Lightning: a soft flash plus a bolt, at most once per ~5.6 s, capped brightness. Never in reduced motion.
function lightningFx(box, o = {}) {
  const [x, y, w, h] = box, r = rng(o.seed || 'bolt');
  let px = o.bx == null ? x + w * 0.6 : o.bx, py = y;
  const pts = [[px, py]];
  while (py < (o.by || y + h * 0.55)) { py += 22 + r() * 30; px += r.jit(26); pts.push([px, py]); }
  const bolt = Pa(pathOf(pts, false), 'none', st('#F4F8FF', 3.2)) + Pa(pathOf(pts, false), 'none', st('#BFD9FF', 9, 'opacity=".35"'));
  return `<g class="fx-light" pointer-events="none" style="animation-delay:${o.delay || 0}s">${R(x, y, w, h, '#DDE8FF', 'opacity=".5"')}${bolt}</g>`;
}

// A ceiling fluorescent tube and the cone of light under it.
function fluoro(x, y, w, o = {}) {
  const on = o.on !== false;
  const tube = R(x, y, w, 9, on ? '#F7FBFF' : '#55585E', `rx="4" ${st(C.ink, 2)}`);
  const cone = on && o.cone !== false ? `<path d="M${n(x)} ${n(y + 8)}L${n(x + w)} ${n(y + 8)}L${n(x + w + (o.spread || 60))} ${n(y + (o.drop || 260))}L${n(x - (o.spread || 60))} ${n(y + (o.drop || 260))}Z" fill="url(#gCone)" opacity="${o.coneOp || 0.7}"/>` : '';
  const g = on ? glow(x + w / 2, y + 4, w * 0.7, 22, 'gW', 0.6) : '';
  return `<g${o.flicker ? ' class="fx-flicker"' : ''}>${cone}${g}${tube}</g>`;
}

/* ---------- phones, screens, devices ---------- */

// A handset. o: {screen (fill), lit, content(sx,sy,sw,sh), stand, ring, rot, cls, body}
function phoneObj(x, y, w, h, o = {}) {
  const rr = Math.min(w, h) * 0.14;
  let s = '';
  if (o.stand) s += R(x + w * 0.3, y + h - 4, w * 0.4, h * 0.22, '#2B2D33', st(C.ink, 2)) + R(x + w * 0.12, y + h + h * 0.18, w * 0.76, h * 0.07, '#1A1B1F', st(C.ink, 2));
  if (o.lit && o.halo !== false) s += glow(x + w / 2, y + h / 2, w * 1.4, h * 0.95, o.haloGrad || 'gS', o.haloOp || 0.45);
  s += R(x, y, w, h, o.body || '#141518', `rx="${n(rr)}" ${st(C.ink, Math.max(1.5, w * 0.05))}`);
  const sx = x + w * 0.08, sy = y + h * 0.06, sw = w * 0.84, sh = h * 0.88;
  s += R(sx, sy, sw, sh, o.screen || (o.lit ? '#CFEFFB' : '#1D232B'), `rx="${n(rr * 0.6)}"${o.lit ? ' class="lit"' : ''}`);
  if (!o.lit && o.glare !== false) s += Pa(`M${n(sx + sw * 0.15)} ${n(sy)}L${n(sx + sw * 0.55)} ${n(sy)}L${n(sx)} ${n(sy + sh * 0.45)}L${n(sx)} ${n(sy + sh * 0.2)}Z`, '#FFFFFF', 'opacity=".06"');
  if (o.content) s += o.content(sx, sy, sw, sh);
  if (o.ring) s += `<g class="fx-ring" style="--rd:${o.ringDelay || 0}s" pointer-events="none">${Pa(`M${n(x - w * 0.25)} ${n(y + h * 0.2)}q-${n(w * 0.18)} ${n(h * 0.3)} 0 ${n(h * 0.6)}M${n(x + w * 1.25)} ${n(y + h * 0.2)}q${n(w * 0.18)} ${n(h * 0.3)} 0 ${n(h * 0.6)}`, 'none', st(o.ringCol || C.y, Math.max(2, w * 0.07)))}</g>`;
  const tf = o.rot ? ` transform="rotate(${o.rot} ${n(x + w / 2)} ${n(y + h / 2)})"` : '';
  return `<g class="phone ${o.cls || ''}"${tf}>${s}</g>`;
}

// Status-bar style signal readout used inside screens. kind: 'bars4' | 'bars3' | '3g' | 'sos' | '5g'
function signalGlyph(x, y, s, kind, col = C.ink) {
  const bars = { bars4: 4, bars3: 3, '3g': 2, sos: 0, '5g': 4, none: 0 }[kind] ?? 4;
  let g = '';
  for (let i = 0; i < 4; i++) g += R(x + i * 7 * s, y + (12 - (i + 1) * 3) * s, 5 * s, (i + 1) * 3 * s, i < bars ? col : 'none', i < bars ? '' : st(col, 1 * s, 'opacity=".5"'));
  const lab = kind === 'sos' ? 'SOS only' : kind === '3g' ? '3G' : kind === '5g' ? '5G' : '4G';
  g += Tx(x + 31 * s, y + 12 * s, lab, 13 * s, col, '', FONTS.ui);
  return g;
}

/* ---------- the store ---------- */

// Display wall: rows of demo phones on security stands. o: {cols, rows, lit, ring, dim, screens(i, j, sx, sy, sw, sh), header}
function displayWall(box, o = {}) {
  const [x, y, w, h] = box;
  const cols = o.cols || 8, rows = o.rows || 3;
  let s = R(x, y, w, h, o.wall || '#E9E6DE', st(C.ink, 3));
  if (o.header !== false) s += R(x, y, w, h * 0.12, C.y, st(C.ink, 3)) + Tx(x + w / 2, y + h * 0.09, 'optus', h * 0.085, C.ink, 'text-anchor="middle" font-weight="700" letter-spacing="2"', FONTS.ui);
  const top = y + h * 0.17, rowH = (h * 0.8) / rows, colW = w / cols;
  for (let j = 0; j < rows; j++) {
    const sy0 = top + j * rowH;
    s += R(x + 6, sy0 + rowH * 0.86, w - 12, 6, '#B9B4A8', st(C.ink, 1.6));
    for (let i = 0; i < cols; i++) {
      const pw = colW * 0.42, ph = rowH * 0.6, px = x + i * colW + (colW - pw) / 2, py = sy0 + rowH * 0.12;
      const content = o.screens ? (sx, sy2, sw, sh) => o.screens(i, j, sx, sy2, sw, sh) : null;
      s += Ln(px + pw / 2, py + ph, px + pw / 2 + 4, sy0 + rowH * 0.86, '#3A3A3A', 1.2) +
        phoneObj(px, py, pw, ph, { lit: typeof o.lit === 'function' ? o.lit(i, j) : o.lit, ring: typeof o.ring === 'function' ? o.ring(i, j) : o.ring, ringDelay: ((i + j * cols) % 7) * 0.13, content, screen: o.screenCol, haloOp: 0.3 });
    }
  }
  if (o.dim) s += R(x, y, w, h, C.ink, `opacity="${o.dim}"`);
  return s;
}

// Counter: a white front with a yellow kick strip and a pale top. o: {top, dark}
function counterObj(x, y, w, h, o = {}) {
  const th = o.top || h * 0.12;
  let s = R(x, y + th, w, h - th, o.dark ? '#22252B' : '#E8E5DD', st(C.ink, 4));
  s += R(x, y + h - h * 0.12, w, h * 0.12, o.dark ? '#3A3410' : C.y, st(C.ink, 3));
  s += R(x - 8, y, w + 16, th, o.dark ? '#33363D' : '#F6F4EE', st(C.ink, 4));
  return s;
}

// The queue TV above the counter. o: {num, label, sub, name, dark, cls}
function queueTV(x, y, w, h, o = {}) {
  let s = Ln(x + w * 0.3, y - 40, x + w * 0.3, y, '#333', 4) + Ln(x + w * 0.7, y - 40, x + w * 0.7, y, '#333', 4);
  s += R(x - 6, y - 6, w + 12, h + 12, '#16171B', `rx="6" ${st(C.ink, 3)}`);
  const lit = o.dark ? '#1E2228' : 'url(#gTVY)';
  s += R(x, y, w, h, lit, `rx="2"${o.dark ? '' : ' class="lit"'}`);
  if (!o.dark) {
    s += Tx(x + w / 2, y + h * 0.24, o.label || 'NOW SERVING', h * 0.15, C.ink, 'text-anchor="middle" letter-spacing="2"', FONTS.ui);
    const both = o.name && o.sub;
    s += `<text class="ft-m ${o.numCls || ''}" x="${n(x + w / 2)}" y="${n(y + h * (both ? 0.6 : o.name || o.sub ? 0.68 : 0.8))}" font-size="${n(h * (both ? 0.4 : o.name || o.sub ? 0.48 : 0.6))}" fill="${C.ink}" text-anchor="middle">${esc(o.num || '00')}</text>`;
    if (o.name) s += Tx(x + w / 2, y + h * (both ? 0.76 : 0.88), o.name, h * (both ? 0.11 : 0.13), C.ink, 'text-anchor="middle" letter-spacing="1"', FONTS.ui);
    if (o.sub) s += Tx(x + w / 2, y + h * (both ? 0.9 : 0.92), o.sub, h * 0.08, '#4A3A00', 'text-anchor="middle"', FONTS.ui);
    if (o.glow !== false) s = glow(x + w / 2, y + h / 2, w * 0.9, h * 0.9, 'gY', 0.35) + s;
  }
  return `<g class="qtv ${o.cls || ''}">${s}</g>`;
}

// Queue kiosk on its pedestal. o: {s, screen(sx,sy,sw,sh), plug:'in'|'out'|null, lit}
function kiosk(x, y, o = {}) {
  const s = o.s || 1;
  let g = R(-34, -150, 68, 150, '#E9E6DE', st(C.ink, 3)) + R(-40, -6, 80, 8, '#2A2B30', st(C.ink, 2));
  g += R(-48, -300, 96, 160, '#1D1F24', `rx="6" ${st(C.ink, 3)}`);
  g += R(-40, -290, 80, 110, o.lit === false ? '#22272E' : '#DDF3FB', `rx="3"${o.lit === false ? '' : ' class="lit"'}`);
  if (o.screen) g += o.screen(-40, -290, 80, 110);
  g += R(-26, -168, 52, 8, '#0A0A0A', st('#555', 1.4)) + R(-48, -300, 96, 14, C.y, st(C.ink, 2));
  if (o.plug === 'out') g += Pa('M30 -10 C60 -10 70 30 40 50 L40 70', 'none', st('#1A1A1A', 4)) + R(30, 66, 22, 16, '#E6E3DA', st(C.ink, 2)) + Ln(36, 82, 36, 92, '#B9B4A8', 3) + Ln(46, 82, 46, 92, '#B9B4A8', 3);
  return `<g class="kiosk ${o.cls || ''}" transform="translate(${n(x)} ${n(y)}) scale(${s})">${g}</g>`;
}

// Perspective floor tiles from a vanishing point.
function floorGrid(box, vx, vy, o = {}) {
  const [x, y, w, h] = box;
  let s = R(x, y, w, h, o.col || '#D9D5CB');
  const lines = o.lines || 14, col = o.lineCol || '#B4AFA2';
  for (let i = -lines; i <= lines * 2; i++) {
    const bx = x + (i / lines) * w;
    s += Ln(vx, vy, bx, y + h, col, 1.4);
  }
  for (let k = 1; k <= (o.rows || 9); k++) {
    const t = Math.pow(k / (o.rows || 9), 1.8);
    const yy = lerp(vy, y + h, t);
    if (yy > y) s += Ln(x, yy, x + w, yy, col, 1.2);
  }
  return s;
}

// The shop floor seen from behind the counter, looking out to the front glass and roller door.
// o: {lights:[...on flags], dark (0..1), door:'down'|'up', rain, glassFn(box), ollie:{...}}
function storeFront(box, o = {}) {
  const [x, y, w, h] = box;
  const r = rng(o.seed || 'storefront');
  let s = '';
  const ceil = y + h * 0.16, floorY = y + h * 0.66;
  s += R(x, y, w, h, '#C9C5BA');
  // ceiling
  s += R(x, y, w, ceil - y, '#9B978D');
  const tubes = o.lights || [true, true, true, true];
  tubes.forEach((on, i) => { s += fluoro(x + w * (0.1 + i * 0.22), ceil - 18, w * 0.14, { on, drop: h * 0.5, flicker: o.flicker === i, coneOp: 0.45 }); });
  // side walls with yellow promo panels
  s += Po([[x, ceil], [x + w * 0.12, ceil + h * 0.05], [x + w * 0.12, floorY - h * 0.02], [x, floorY + h * 0.1]], '#B8B3A7', st(C.ink, 2));
  s += Po([[x + w, ceil], [x + w * 0.88, ceil + h * 0.05], [x + w * 0.88, floorY - h * 0.02], [x + w, floorY + h * 0.1]], '#B8B3A7', st(C.ink, 2));
  s += Po([[x + w * 0.02, ceil + h * 0.1], [x + w * 0.1, ceil + h * 0.12], [x + w * 0.1, ceil + h * 0.34], [x + w * 0.02, ceil + h * 0.36]], C.y, st(C.ink, 2));
  // the front: glass and roller door
  const gx = x + w * 0.12, gw = w * 0.76, gy = ceil + h * 0.05, gh = floorY - gy - h * 0.02;
  s += R(gx, gy, gw, gh, '#25313D');
  if (o.outside) s += `<g clip-path="none">${o.outside([gx, gy, gw, gh])}</g>`;
  if (o.rain !== false) s += rainFx([gx, gy, gw, gh], { op: 0.7, op2: 0.5 });
  s += glassDrops([gx, gy, gw, gh], 'sf', 50);
  if (o.door !== 'up') {
    const dh = o.door === 'half' ? gh * 0.45 : gh;
    let slats = '';
    for (let yy = gy; yy < gy + dh; yy += 14) slats += Ln(gx, yy, gx + gw, yy, '#5D6066', 2);
    s += `<g opacity="${o.doorOp == null ? 0.82 : o.doorOp}">${R(gx, gy, gw, dh, '#7C8087')}${slats}${R(gx, gy + dh - 10, gw, 10, '#3A3D44')}</g>`;
  }
  for (let i = 0; i <= 4; i++) s += Ln(gx + (gw * i) / 4, gy, gx + (gw * i) / 4, gy + gh, '#1C1D21', 5);
  s += R(gx, gy, gw, gh, 'none', st(C.ink, 5));
  // floor
  s += `<g>${floorGrid([x, floorY, w, y + h - floorY], x + w / 2, floorY - h * 0.25, { col: '#CFCBC0', lineCol: '#ADA89B', rows: 7 })}</g>`;
  if (o.dark) s += R(x, y, w, h, C.ink, `opacity="${o.dark}"`);
  return s;
}

/* ---------- outside ---------- */

function stormSky(box, o = {}) {
  const [x, y, w, h] = box, r = rng(o.seed || 'sky');
  let s = R(x, y, w, h, 'url(#gSky)');
  // heavy cloud masses
  for (let i = 0; i < (o.clouds || 14); i++) {
    const cx = x + r() * w, cy = y + r() * h * 0.55, rx = 80 + r() * 220, ry = 30 + r() * 70;
    s += E(cx, cy, rx, ry, r.pick(['#141D29', '#1B2633', '#0F1620', '#223040']), `opacity="${n(0.6 + r() * 0.4)}"`);
  }
  return s;
}

// Cafe 63 storefront across the walkway. o: {lights (0..4 lit), full, cups, steam, sign}
function cafe63(box, o = {}) {
  const [x, y, w, h] = box;
  const lit = o.lights == null ? 4 : o.lights;
  let s = R(x, y, w, h, lit ? '#3B3226' : '#15161A', st(C.ink, 3));
  s += R(x, y, w, h * 0.16, '#1B1C20', st(C.ink, 2));
  s += Tx(x + w / 2, y + h * 0.12, 'CAFE 63', h * 0.1, lit ? '#F3D9A6' : '#4A4A4A', 'text-anchor="middle" letter-spacing="3"', FONTS.ui);
  // pendant lights
  for (let i = 0; i < 4; i++) {
    const lx = x + w * (0.15 + i * 0.23), ly = y + h * 0.26;
    const on = i < lit;
    s += Ln(lx, y + h * 0.16, lx, ly, '#111', 1.5) + `<g class="${o.lightCls || ''}" style="--li:${i}">${on ? glow(lx, ly + 10, w * 0.12, h * 0.16, 'gWarm', 0.7) : ''}${Pa(`M${n(lx - 9)} ${n(ly + 8)}L${n(lx - 4)} ${n(ly)}L${n(lx + 4)} ${n(ly)}L${n(lx + 9)} ${n(ly + 8)}Z`, on ? '#FFE3A0' : '#3A3A3A', st(C.ink, 1.4))}</g>`;
  }
  // counter + coffee machine
  s += R(x + w * 0.62, y + h * 0.52, w * 0.34, h * 0.3, '#2A2018', st(C.ink, 2));
  s += R(x + w * 0.68, y + h * 0.38, w * 0.18, h * 0.14, '#B9BDC3', st(C.ink, 2)) + R(x + w * 0.7, y + h * 0.4, w * 0.05, h * 0.03, lit ? '#9EF0A0' : '#333', lit ? 'class="lit"' : '');
  if (o.steam) s += `<g class="fx-steam">${Pa(`M${n(x + w * 0.77)} ${n(y + h * 0.37)}q-8 -14 0 -26q8 -12 0 -24`, 'none', st('#EEE', 3, 'opacity=".55"'))}${Pa(`M${n(x + w * 0.8)} ${n(y + h * 0.37)}q8 -12 0 -24q-6 -10 2 -22`, 'none', st('#EEE', 2.5, 'opacity=".45"'))}</g>`;
  if (o.order) s += R(x + w * 0.64, y + h * 0.2, w * 0.3, h * 0.1, '#0B0B0B', st('#444', 1.2)) + Tx(x + w * 0.79, y + h * 0.275, 'ORDER READY', h * 0.055, '#7CFF9A', 'text-anchor="middle" class="lit"', FONTS.mono);
  // tables and chairs
  const tables = [[0.14, 0.78], [0.34, 0.84], [0.5, 0.74]];
  tables.forEach(([tx, ty], i) => {
    const cx = x + w * tx, cy = y + h * ty;
    if (o.full) s += customer({ x: cx + (i % 2 ? 22 : -22), y: cy + h * 0.16, s: h * 0.0011, kind: CUSTOMER_ORDER[(i + 2) % 8], seed: `cafe${i}`, flip: i % 2 === 0, ticket: false, faceOp: 0.85 });
    s += E(cx, cy, w * 0.07, h * 0.02, '#5A4632', st(C.ink, 1.6)) + Ln(cx, cy, cx, cy + h * 0.14, '#222', 3);
    if (o.cups) s += R(cx - 5, cy - 12, 10, 11, '#F4F0E6', st(C.ink, 1.2)) + `<g class="fx-steam" style="animation-delay:${i * 0.4}s">${Pa(`M${n(cx)} ${n(cy - 14)}q-5 -8 0 -16q5 -8 0 -16`, 'none', st('#F2F2F2', 2, 'opacity=".6"'))}</g>`;
  });
  // window glass sheen
  s += Pa(`M${n(x)} ${n(y + h * 0.18)}L${n(x + w * 0.2)} ${n(y + h * 0.18)}L${n(x)} ${n(y + h * 0.6)}Z`, '#FFFFFF', 'opacity=".05"');
  if (!lit && !o.full) s += R(x, y, w, h, C.ink, 'opacity=".35"');
  return s;
}

/* ---------- back of house ---------- */

// Sealed handset box with a label. o: {label, sub, glow, warm, cls}
function handsetBox(x, y, w, h, o = {}) {
  let s = R(x, y, w, h, o.col || '#F1EEE6', st(C.ink, Math.max(1.4, w * 0.03)));
  s += R(x, y + h * 0.42, w, h * 0.12, o.tape || '#C9B98E', 'opacity=".75"');
  if (o.glow) s += R(x + 2, y + 2, w - 4, h - 4, C.screen, `opacity="${o.glow}" class="lit"`);
  if (o.label) {
    s += R(x + w * 0.08, y + h * 0.6, w * 0.84, h * 0.3, '#FFFFFF', st(C.ink, 1.2));
    s += Tx(x + w / 2, y + h * 0.73, o.label, Math.min(h * 0.11, (w * 1.5) / Math.max(6, o.label.length)), C.ink, 'text-anchor="middle"', FONTS.mono);
    if (o.sub) s += Tx(x + w / 2, y + h * 0.86, o.sub, Math.min(h * 0.08, (w * 1.4) / Math.max(6, o.sub.length)), '#333', 'text-anchor="middle"', FONTS.mono);
  }
  return `<g class="hbox ${o.cls || ''}">${s}</g>`;
}

// Steel shelving unit stacked with boxes. o: {rows, glow, labels(i,j) -> [label, sub], seed}
function shelfUnit(x, y, w, h, o = {}) {
  const rows = o.rows || 4, r = rng(o.seed || 'shelf');
  let s = '';
  const rh = h / rows;
  for (let j = 0; j < rows; j++) {
    const yy = y + j * rh;
    let bx = x + 6;
    while (bx < x + w - 30) {
      const bw = Math.min(x + w - 6 - bx, rh * (0.55 + r() * 0.3)), bh = rh * (0.6 + r() * 0.25);
      const lab = o.labels ? o.labels(j, Math.round((bx - x) / 40)) : null;
      s += handsetBox(bx, yy + rh - 8 - bh, bw - 4, bh, { glow: o.glow ? o.glow * (0.4 + r() * 0.6) : 0, label: lab && lab[0], sub: lab && lab[1], col: o.boxCol });
      bx += bw;
    }
    s += R(x, yy + rh - 8, w, 8, '#7D828A', st(C.ink, 2));
  }
  s += R(x - 4, y, 8, h, '#6A6F77', st(C.ink, 2)) + R(x + w - 4, y, 8, h, '#6A6F77', st(C.ink, 2));
  return s;
}

// Laptop. o: {screen (fill), content(sx,sy,sw,sh), open, rot}
function laptopObj(x, y, w, h, o = {}) {
  let s = Po([[x - w * 0.06, y + h], [x + w * 1.06, y + h], [x + w, y + h * 0.82], [x, y + h * 0.82]], '#9AA0A8', st(C.ink, 2.5));
  s += R(x, y, w, h * 0.82, '#2A2D33', `rx="5" ${st(C.ink, 2.5)}`);
  const sx = x + w * 0.05, sy = y + h * 0.06, sw = w * 0.9, sh = h * 0.7;
  s += R(sx, sy, sw, sh, o.screen || '#121820', 'class="lit"');
  if (o.content) s += o.content(sx, sy, sw, sh);
  return `<g class="laptop ${o.cls || ''}"${o.rot ? ` transform="rotate(${o.rot} ${n(x + w / 2)} ${n(y + h / 2)})"` : ''}>${s}</g>`;
}

// JARVIS-style enterprise window. o: {title, lines:[...], size, tabs}
function jarvisWindow(x, y, w, h, o = {}) {
  let s = R(x, y, w, h, '#C9D0D6', st(C.ink, 3));
  s += R(x, y, w, h * 0.08, '#56606B') + Tx(x + 10, y + h * 0.058, o.title || 'JARVIS — Customer Interaction', h * 0.04, '#EEF2F5', '', FONTS.mono);
  const tabs = o.tabs || ['Account', 'Services', 'Interaction Notes', 'Billing'];
  tabs.forEach((t, i) => { s += R(x + 8 + i * w * 0.24, y + h * 0.1, w * 0.23, h * 0.05, i === 2 ? '#EEF1F3' : '#AEB7BF', st('#56606B', 1)) + Tx(x + 14 + i * w * 0.24, y + h * 0.138, t, h * 0.03, '#2C3540', '', FONTS.mono); });
  s += R(x + 8, y + h * 0.15, w - 16, h * 0.82, '#F4F6F7', st('#7C8792', 1));
  return s;
}

/* ---------- the shop floor in one-point perspective ---------- */

// Bilinear point in a quad [p00, p10, p11, p01] (u across, v down).
function quadPt(q, u, v) {
  const t = [lerp(q[0][0], q[1][0], u), lerp(q[0][1], q[1][1], u)];
  const b = [lerp(q[3][0], q[2][0], u), lerp(q[3][1], q[2][1], u)];
  return [lerp(t[0], b[0], v), lerp(t[1], b[1], v)];
}
// Depth fraction (0 near … 1 far) to screen fraction along a receding wall.
const persp = (s, Z = 3.2) => (1 - 1 / (1 + s * (Z - 1))) / (1 - 1 / Z);
const quadAt = (q, u0, u1, v0, v1) => [quadPt(q, u0, v0), quadPt(q, u1, v0), quadPt(q, u1, v1), quadPt(q, u0, v1)];

// o: {vx, vy (0..1 in box), bw, bh (back wall size 0..1), night (0..1 darkness), lights:[6 flags], flicker (index),
//     back: 'front'|'wall'|fn(x,y,w,h), left: 'acc'|'display'|'glass'|null, right: same, rain, door, ollie: markup at back wall,
//     litScreens (phones lit), ring, tint}
function storeInterior(box, o = {}) {
  const [x, y, w, h] = box;
  const vx = x + w * (o.vx == null ? 0.5 : o.vx), vy = y + h * (o.vy == null ? 0.42 : o.vy);
  const bw = w * (o.bw || 0.44), bh = h * (o.bh || 0.5);
  const bl = vx - bw / 2, br = vx + bw / 2, bt = vy - bh * 0.5, bb = vy + bh * 0.5;
  const X0 = x - 4, X1 = x + w + 4, Y0 = y - 4, Y1 = y + h + 4;
  const TL = [X0, Y0], TR = [X1, Y0], BR = [X1, Y1], BL = [X0, Y1];
  const btl = [bl, bt], btr = [br, bt], bbr = [br, bb], bbl = [bl, bb];
  const night = o.night == null ? 0.35 : o.night;
  const cols = o.day ? { ceil: '#C9C6BD', wall: '#DAD6CC', wall2: '#CFCBC0', floor: '#D2CEC3', tile: '#B3AEA1', back: '#E3DFD6' } :
    { ceil: '#252C35', wall: '#3E4854', wall2: '#36404B', floor: '#2C343D', tile: '#3B4550', back: '#46515D' };
  let s = '';
  // ceiling, walls, floor
  s += Po([TL, TR, btr, btl], cols.ceil);
  const leftQ = [TL, btl, bbl, BL], rightQ = [TR, btr, bbr, BR];
  s += Po(leftQ, cols.wall) + Po(rightQ, cols.wall2);
  s += Po([BL, BR, bbr, bbl], cols.floor);
  // floor tiles converging on the vanishing point
  let tiles = '';
  const N = 16;
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    const top = [lerp(bl, br, t), bb], bot = [lerp(x - w * 1.2, x + w * 2.2, t), Y1];
    tiles += `M${n(top[0])} ${n(top[1])}L${n(bot[0])} ${n(bot[1])}`;
  }
  for (let k = 1; k <= 8; k++) {
    const t = persp(1 - k / 8.5, 3.4), yy = lerp(Y1, bb, t);
    const xl = lerp(X0, bl, (yy - Y1) / (bb - Y1)), xr = lerp(X1, br, (yy - Y1) / (bb - Y1));
    tiles += `M${n(xl)} ${n(yy)}L${n(xr)} ${n(yy)}`;
  }
  s += `<path d="${tiles}" fill="none" stroke="${cols.tile}" stroke-width="1.5"/>`;
  // ceiling tubes in perspective
  const ceilQ = [TL, TR, btr, btl];
  const lights = o.lights || [1, 1, 1, 1, 1, 1];
  [[0.12, 0.3], [0.5, 0.6], [0.78, 0.82]].forEach(([dv], row) => {
    [[0.22, 0.4], [0.6, 0.78]].forEach(([u0, u1], c) => {
      const on = lights[row * 2 + c];
      const v = persp(dv), v2 = persp(dv + 0.06);
      const q = quadAt(ceilQ, u0, u1, v, v2);
      const cx = (q[0][0] + q[2][0]) / 2, cy = (q[0][1] + q[2][1]) / 2;
      const wq = Math.abs(q[1][0] - q[0][0]);
      s += `<g${o.flicker === row * 2 + c ? ' class="fx-flicker"' : o.flicker2 === row * 2 + c ? ' class="fx-flicker2"' : ''}>${on ? glow(cx, cy + wq * 0.25, wq * 0.9, wq * 0.55, 'gW', o.day ? 0.5 : 0.35) : ''}${Po(q, on ? '#F4FAFF' : '#4A525C', st(C.ink, 1.5))}</g>`;
    });
  });
  // the back wall
  s += R(bl, bt, bw, bh, cols.back, st(C.ink, 2.5));
  if (typeof o.back === 'function') s += o.back(bl, bt, bw, bh);
  else if (o.back !== 'wall') {
    // front glass + roller door + the mall beyond
    const gx = bl + bw * 0.06, gy = bt + bh * 0.08, gw = bw * 0.88, gh = bh * 0.92;
    s += R(gx, gy, gw, gh, '#141B24');
    if (o.outside) s += o.outside(gx, gy, gw, gh);
    if (o.rain !== false) s += rainFx([gx, gy, gw, gh], { op: 0.6, op2: 0.45 });
    s += glassDrops([gx, gy, gw, gh], 'si' + (o.seed || ''), 26);
    if (o.door !== 'up') {
      const dh = o.door === 'half' ? gh * 0.45 : gh;
      let sl = '';
      for (let yy = gy + 6; yy < gy + dh; yy += 9) sl += `M${n(gx)} ${n(yy)}h${n(gw)}`;
      s += `<g opacity="${o.doorOp == null ? 0.85 : o.doorOp}">${R(gx, gy, gw, dh, o.day ? '#8C9097' : '#5A5F67')}<path d="${sl}" stroke="${o.day ? '#6A6E75' : '#3E4249'}" stroke-width="2"/>${R(gx, gy + dh - 7, gw, 7, '#2E3137')}</g>`;
    }
    for (let i = 0; i <= 3; i++) s += Ln(gx + (gw * i) / 3, gy, gx + (gw * i) / 3, gy + gh, '#111317', 4);
    s += R(gx, gy, gw, gh, 'none', st(C.ink, 4));
  }
  if (o.ollie) s += o.ollie(bl, bt, bw, bh);
  // side walls: accessories pegboard, display wall, or glass
  const wallItems = (q, kind, side) => {
    let g = '';
    if (kind === 'acc') {
      const rows = 4, cs = 7;
      g += Po(quadAt(q, 0.02, 0.98, 0.18, 0.86), o.day ? '#E8E4DA' : '#4C5662', st(C.ink, 1.6));
      for (let j = 0; j < rows; j++) for (let i = 0; i < cs; i++) {
        const u0 = persp(0.04 + i * 0.13), u1 = persp(0.04 + i * 0.13 + 0.08);
        const v0 = 0.24 + j * 0.15, v1 = v0 + 0.11;
        const col = ['#2B4E7A', '#C8C3B5', '#7A2E3A', C.y, '#2E2E33', '#4E7A5A'][(i * 3 + j * 5) % 6];
        g += Po(quadAt(q, u0, u1, v0, v1), o.day ? col : shade(col, -0.45), st(C.ink, 1.2));
      }
    } else if (kind === 'display') {
      g += Po(quadAt(q, 0.02, 0.98, 0.16, 0.2), C.y, st(C.ink, 1.5));
      g += Po(quadAt(q, 0.02, 0.98, 0.2, 0.84), o.day ? '#EEEBE4' : '#4A5460', st(C.ink, 1.6));
      for (let j = 0; j < 3; j++) {
        g += Po(quadAt(q, 0.02, 0.98, 0.37 + j * 0.2, 0.385 + j * 0.2), '#8A8D93');
        for (let i = 0; i < 8; i++) {
          const u0 = persp(0.04 + i * 0.12), u1 = persp(0.04 + i * 0.12 + 0.05);
          const qq = quadAt(q, u0, u1, 0.24 + j * 0.2, 0.36 + j * 0.2);
          const lit = typeof o.litScreens === 'function' ? o.litScreens(i, j, side) : o.litScreens;
          g += Po(qq, '#16181C', st(C.ink, 1.1)) + Po(quadAt(q, u0 + (u1 - u0) * 0.12, u1 - (u1 - u0) * 0.12, 0.25 + j * 0.2, 0.35 + j * 0.2), lit ? (lit === true ? '#CFF2FF' : lit) : '#232A33', lit ? 'class="lit"' : '');
          if (lit) { const c = quadPt(q, (u0 + u1) / 2, 0.3 + j * 0.2); g += glow(c[0], c[1], Math.abs(qq[1][0] - qq[0][0]) * 2, Math.abs(qq[3][1] - qq[0][1]) * 1.1, 'gS', 0.35); }
          if (o.ring && (i + j) % 2 === 0) { const c = quadPt(q, u1, 0.27 + j * 0.2); g += `<g class="fx-ring" style="--rd:${((i * 3 + j) % 7) * 0.15}s">${Pa(`M${n(c[0] + 3)} ${n(c[1] - 6)}q5 6 0 12M${n(c[0] + 8)} ${n(c[1] - 9)}q7 9 0 18`, 'none', st(C.y, 2))}</g>`; }
        }
      }
    } else if (kind === 'glass') {
      g += Po(quadAt(q, 0.05, 0.95, 0.12, 0.92), '#141B24', st(C.ink, 2));
      if (o.rain !== false) g += `<g opacity=".6">${glassDrops([Math.min(q[0][0], q[1][0]), q[1][1], Math.abs(q[1][0] - q[0][0]), q[2][1] - q[1][1]], 'sg' + side, 18)}</g>`;
    } else if (typeof kind === 'function') g += kind(q);
    return g;
  };
  s += wallItems(leftQ, o.left === undefined ? 'acc' : o.left, 'L') + wallItems(rightQ, o.right === undefined ? 'display' : o.right, 'R');
  // corner lines
  s += Pa(`M${n(X0)} ${n(Y0)}L${n(bl)} ${n(bt)}M${n(X1)} ${n(Y0)}L${n(br)} ${n(bt)}M${n(X0)} ${n(Y1)}L${n(bl)} ${n(bb)}M${n(X1)} ${n(Y1)}L${n(br)} ${n(bb)}`, 'none', st(C.ink, 2.5));
  if (night) s += R(x - 10, y - 10, w + 20, h + 20, o.tint || C.ink, `opacity="${night}"`);
  if (o.vig !== false) s += R(x - 10, y - 10, w + 20, h + 20, 'url(#gVig)', `opacity="${o.vig || 0.8}"`);
  return s;
}

// The counter seen from behind, across the bottom of a panel. o: {y (top edge), tilt, dark}
function counterFore(box, o = {}) {
  const [x, y, w, h] = box;
  const ty = o.y || y + h * 0.82, t2 = ty + (o.tilt || 0);
  let s = Po([[x - 10, ty], [x + w + 10, t2], [x + w + 10, y + h + 10], [x - 10, y + h + 10]], o.dark ? '#16181C' : '#2B2E35', st(C.ink, 4));
  s += Pa(`M${n(x - 10)} ${n(ty + 5)}L${n(x + w + 10)} ${n(t2 + 5)}`, 'none', st(o.dark ? '#2E323A' : '#4A4F58', 3));
  return s;
}

// Flat pegboard wall of accessories (cases, chargers, cables) on hooks. o: {dark, seed, rows, cols}
function pegboard(box, o = {}) {
  const [x, y, w, h] = box, r = rng(o.seed || 'peg');
  let s = R(x, y, w, h, o.dark ? '#3C4550' : '#E6E2D8') + R(x, y, w, h, 'url(#ht1)', 'opacity=".35"');
  const rows = o.rows || 4, cols = o.cols || 6;
  const cw = w / cols, rh = h / rows;
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
    if (r() < 0.12) continue;
    const cx = x + cw * (i + 0.5), top = y + rh * j + rh * 0.12;
    const pw = cw * (0.5 + r() * 0.2), ph = rh * (0.62 + r() * 0.15);
    const col = r.pick(['#2B4E7A', '#C8C3B5', '#7A2E3A', C.y, '#2E2E33', '#4E7A5A', '#E7E4DC']);
    s += Ln(cx, top - 8, cx, top + 6, '#888', 2) + R(cx - pw / 2, top, pw, ph, o.dark ? shade(col, -0.4) : col, st(C.ink, 1.6));
    s += R(cx - pw * 0.3, top + ph * 0.25, pw * 0.6, ph * 0.55, o.dark ? '#5A6470' : '#F8F8F4', `opacity=".75" ${st(C.ink, 1)}`);
    s += Ci(cx, top + 5, 3, o.dark ? '#222' : '#FFF', st(C.ink, 1));
  }
  return s;
}
