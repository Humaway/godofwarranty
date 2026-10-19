// ================= WORLD: the kiosk, Zee's clearing, the cliff path, the Hornibrook =================
function signMesh(w, h, pw, ph, draw, mat = 'lambert') {
  const t = textTex(pw, ph, draw);
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat === 'basic' ? new THREE.MeshBasicMaterial({ map: t, transparent: true }) : new THREE.MeshLambertMaterial({ map: t, transparent: true }));
  return m;
}
function paintBoard(g, w, h, bg = '#3b2a1c') { g.fillStyle = bg; g.fillRect(0, 0, w, h); const r = mulberry32(w * h); for (let i = 0; i < 30; i++) { g.fillStyle = 'rgba(0,0,0,.15)'; g.fillRect(0, r() * h, w, 1); } }

// ---------- the kiosk: Luke & Zane's cart inside a hollow giant stump ----------
function buildKiosk() {
  const K = LOC.kiosk, kx = K.x - 5.5, kz = K.z + 1, y = groundHeight(kx, kz);
  // the stump opens east, onto the path
  const g = new THREE.Group(); g.position.set(kx, y, kz); g.rotation.y = PI / 2; R.scene.add(g);
  const gb = new GB();
  // the stump: open to the path on its east side
  gb.add(new THREE.CylinderGeometry(4.3, 5.0, 6.5, 18, 2, true, 1.2, TAU - 2.2), { pos: [0, 3.0, 0], color: 0x5c4232, uvScale: [6, 3] });
  gb.add(new THREE.CylinderGeometry(3.9, 4.6, 6.5, 18, 2, true, 1.2, TAU - 2.2), { pos: [0, 3.0, 0], color: 0x8a6143, uvScale: [6, 3] });
  for (let i = 0; i < 14; i++) { const a = 1.2 + i / 13 * (TAU - 2.2); gb.cone(0.5, 1.2 + (i % 3) * 0.6, 4, { pos: [Math.sin(a) * 4.2, 6.6 + (i % 3) * 0.2, Math.cos(a) * 4.2], color: 0x5c4232 }); }
  const stump = gb.mesh(new THREE.MeshLambertMaterial({ map: TEX.bark, vertexColors: true, side: THREE.DoubleSide })); g.add(stump);
  const c = new GB();
  // cart
  c.box(2.4, 0.9, 1.2, { pos: [-0.6, 0.95, -0.6], color: 0x2f5f8a });
  c.box(2.5, 0.08, 1.3, { pos: [-0.6, 1.44, -0.6], color: 0xdfe3e6 });
  for (const [wx, wz] of [[-1.5, -1.25], [0.3, -1.25], [-1.5, 0.05], [0.3, 0.05]]) c.cyl(0.42, 0.42, 0.1, 10, { pos: [wx, 0.42, wz], rot: [PI / 2, 0, 0], color: 0x2c2c2c });
  // forge cabinet, glowing; bellows are a laptop cooling fan the size of a cartwheel
  c.box(1.0, 1.4, 0.9, { pos: [1.7, 0.7, -1.9], color: 0x4c5358 });
  c.box(0.6, 0.12, 0.05, { pos: [1.7, 0.95, -1.44], color: 0x111111 });
  // pegboard of tools, screws in jars, solder spools
  c.box(2.2, 1.4, 0.05, { pos: [-0.8, 2.3, -2.6], color: 0xb08a5a });
  for (let i = 0; i < 9; i++) c.box(0.05, 0.25 + (i % 3) * 0.1, 0.03, { pos: [-1.7 + i * 0.22, 2.4, -2.55], color: [0x777777, 0xc22, 0x333][i % 3] });
  for (let i = 0; i < 6; i++) c.cyl(0.06, 0.06, 0.14, 6, { pos: [-1.6 + i * 0.16, 1.55, -0.2], color: 0xaad4dd });
  for (let i = 0; i < 3; i++) c.cyl(0.08, 0.08, 0.06, 8, { pos: [0.1 + i * 0.2, 1.52, -0.9], rot: [PI / 2, 0, 0], color: 0xc0c0c0 });
  // shelf behind the cart (the demo tape sits here)
  c.box(1.6, 0.05, 0.35, { pos: [-2.4, 1.6, -1.8], rot: [0, 0.7, 0], color: 0x6e4b33 });
  c.box(0.11, 0.07, 0.02, { pos: [-2.35, 1.66, -1.75], rot: [0, 0.7, 0], color: 0xd9c08a });
  // awning poles
  c.cyl(0.04, 0.04, 2.8, 5, { pos: [1.2, 1.4, 1.6], color: 0x444 }); c.cyl(0.04, 0.04, 2.8, 5, { pos: [-2.2, 1.4, 1.6], color: 0x444 });
  const cart = c.mesh(MATS.vcNoSnow); g.add(cart);
  const awning = new THREE.Mesh(new THREE.PlaneGeometry(3.8, 2.4, 6, 3), new THREE.MeshLambertMaterial({ color: 0xc9b98f, side: THREE.DoubleSide }));
  awning.position.set(-0.5, 2.9, 0.6); awning.rotation.set(-PI / 2 + 0.28, 0, 0); g.add(awning);
  const forgeGlow = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.1, 0.02), MATS.ember); forgeGlow.position.set(1.7, 0.95, -1.42); g.add(forgeGlow);
  const fan = new THREE.Group(); fan.position.set(2.75, 1.25, -1.0); fan.rotation.y = -PI / 2;
  const fb = new GB().torus(0.62, 0.06, 4, 18, { color: 0x222 }); for (let i = 0; i < 7; i++) fb.box(0.12, 0.55, 0.02, { pos: [Math.cos(i / 7 * TAU) * 0.3, Math.sin(i / 7 * TAU) * 0.3, 0], rot: [0.3, 0, i / 7 * TAU], color: 0x333 });
  const blades = fb.mesh(MATS.vcNoSnow); fan.add(blades); g.add(fan);
  const sign = signMesh(2.8, 0.9, 512, 164, (g2, w, h) => {
    paintBoard(g2, w, h, '#ece4d2');
    g2.fillStyle = '#16324f'; g2.font = '800 34px Barlow, sans-serif'; drawLines(g2, ['LUKE & ZANE'], w / 2, 34, 0);
    g2.font = '700 21px Barlow, sans-serif'; drawLines(g2, ['SCREENS, SEALS & SMITHING'], w / 2, 70, 0);
    g2.fillStyle = '#1f6f4a'; g2.font = 'italic 600 18px Barlow, sans-serif'; drawLines(g2, ['PLEASE SANITISE.'], w / 2, 106, 0);
    g2.fillStyle = '#a02a1e'; g2.font = '700 22px "Comic Sans MS", Barlow, sans-serif'; drawLines(g2, ['OR DON’T.'], w / 2 + 40, 140, 0);
  });
  sign.position.set(-0.6, 3.6, -2.4); g.add(sign);
  const board = signMesh(1.1, 0.8, 256, 188, (g2, w, h) => {
    paintBoard(g2, w, h, '#2a2f33');
    g2.fillStyle = '#fff'; g2.font = '700 14px Barlow, sans-serif'; drawLines(g2, ['REPAIR QUEUE'], w / 2, 14, 0);
    const t = ['#0002 · CUSTOMER: LUKE · FAULT: LICKED IT', '#0003 · CUSTOMER: CHASE · FAULT: BOW (TAPE)', '#0004 · CUSTOMER: HILDIS-VINNIE · FAULT: SAT ON IT', '#0005 · CUSTOMER: ZANE · FAULT: NONE. CHECK AGAIN', '#0006 · CUSTOMER: ZEE · FAULT: ???', '#0007 · RUE · CAN’T HANG UP · AWAITING PARTS (SINCE 2019)', '#0008 · CUSTOMER: LUKA · FAULT: WON’T SAY', '#0009 · CUSTOMER: FAYE · FAULT: ______'];
    g2.font = '600 9.5px Barlow, sans-serif'; t.forEach((s, i) => { g2.fillStyle = i % 2 ? '#ffe9a8' : '#fffdf2'; g2.fillRect(8, 28 + i * 19.5, w - 16, 16); g2.fillStyle = '#1b1b1b'; g2.textAlign = 'left'; g2.fillText(s, 12, 37 + i * 19.5); });
  });
  board.position.set(-3.1, 2.2, -1.2); board.rotation.y = 1.05; g.add(board);
  g.updateMatrixWorld(true);
  OBJ.kiosk = { group: g, fan: blades, forge: forgeGlow, awning, lantern: g.localToWorld(V3(-0.5, 2.6, 1.2)), forgePos: g.localToWorld(V3(1.7, 1.2, -1.6)), tape: g.localToWorld(V3(-2.35, 1.66, -1.75)), board: g.localToWorld(V3(-3.0, 2.0, -1.2)), bench: g.localToWorld(V3(-0.6, 1.5, -0.6)), pole: g.localToWorld(V3(1.2, 2.8, 1.6)) };
  const wc = g.localToWorld(V3(0, 0, 0));
  // stump wall colliders (ring segments), the cart
  for (let i = 0; i < 16; i++) { const a = 1.2 + i / 15 * (TAU - 2.2); const p = g.localToWorld(V3(Math.sin(a) * 4.6, 0, Math.cos(a) * 4.6)); addCollider({ x: p.x, z: p.z, r: 0.9, h: 7, tag: 'kiosk' }); }
  const cp = g.localToWorld(V3(-0.6, 0, -0.6)); addCollider({ x: cp.x, z: cp.z, r: 1.3, h: 1.6, tag: 'cart' });
  const fp = g.localToWorld(V3(1.7, 0, -1.9)); addCollider({ x: fp.x, z: fp.z, r: 0.7, h: 1.5, tag: 'forge' });
  mark('kiosk_luka', ...g.localToWorld(V3(0.0, 0, 2.6)).toArray().filter((_, i) => i !== 1), PI);
  mark('kiosk_chase', ...g.localToWorld(V3(1.6, 0, 3.1)).toArray().filter((_, i) => i !== 1), PI + 0.4);
  mark('kiosk_luke', ...g.localToWorld(V3(-0.2, 0, 1.0)).toArray().filter((_, i) => i !== 1), 0);
  mark('kiosk_zane', ...g.localToWorld(V3(-1.8, 0, 0.9)).toArray().filter((_, i) => i !== 1), 0.3);
  for (const k of ['kiosk_luka', 'kiosk_chase', 'kiosk_luke', 'kiosk_zane']) MARKS[k].yaw += g.rotation.y;
  OBJ.kiosk.center = wc;
}

// ---------- Zee's clearing: a frozen creek, birches, low mist ----------
function buildClearing() {
  const Z = LOC.zee;
  // the creek: a ribbon of black ice following creekZ
  const pts = []; for (let x = -34; x <= cliffX(22) - 1; x += 2) pts.push(x);
  const n = pts.length, pos = new Float32Array(n * 2 * 3), uv = new Float32Array(n * 2 * 2), idx = [];
  pts.forEach((x, i) => {
    const z = creekZ(x), y = Math.min(terrainHeight(x, z - 1.5), terrainHeight(x, z + 1.5), terrainHeight(x, z)) + 0.06;
    pos.set([x, y, z - 1.7, x, y, z + 1.7], i * 6); uv.set([x / 4, 0, x / 4, 1], i * 4);
    if (i < n - 1) { const a = i * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
  });
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.BufferAttribute(uv, 2)); g.setIndex(idx); g.computeVertexNormals();
  const ice = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ color: 0x0c1c24, roughness: 0.06, metalness: 0.2, transparent: true, opacity: 0.86 }));
  ice.receiveShadow = true; ice.renderOrder = 2; R.scene.add(ice);
  const bed = new THREE.Mesh(g.clone().translate(0, -0.18, 0), new THREE.MeshLambertMaterial({ color: 0x0a1016 })); R.scene.add(bed);
  // fish shadows beneath the ice
  OBJ.fish = [];
  const fishMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.55, depthWrite: false });
  for (let i = 0; i < 7; i++) {
    const f = new THREE.Mesh(new THREE.CircleGeometry(0.22, 8), fishMat); f.scale.set(1, 0.32, 1); f.rotation.x = -PI / 2;
    const x0 = Z.x - 14 + i * 4.3; f.userData = { x: x0, ph: i * 1.3, sp: 0.4 + (i % 3) * 0.2 };
    R.scene.add(f); OBJ.fish.push(f);
  }
  // Ollie, frozen mid-wave in the ice
  const ox = Z.x + 5.5, oz = creekZ(Z.x + 5.5), oy = terrainHeight(ox, oz) - 0.15;
  const ol = new GB().sphere(0.28, 10, 8, { pos: [0, 0.3, 0], scale: [1, 1.15, 0.75], color: 0x1d9c96 }).sphere(0.17, 8, 6, { pos: [0, 0.68, 0], color: 0xffd34d })
    .strut([0.22, 0.42, 0], [0.48, 0.75, 0], 0.08, { color: 0x1d9c96, round: true }).sphere(0.05, 6, 4, { pos: [0.5, 0.8, 0], color: 0xffd34d })
    .strut([-0.22, 0.42, 0], [-0.4, 0.2, 0], 0.08, { color: 0x1d9c96, round: true });
  const ollie = ol.mesh(MATS.vcNoSnow); ollie.position.set(ox, oy, oz); ollie.rotation.set(-1.25, 0.4, 0); ollie.scale.setScalar(0.85); R.scene.add(ollie);
  OBJ.ollie = V3(ox, oy + 0.4, oz);
  // ring of stones, dead birch for Mystery Shopper #3
  const sgb = new GB();
  for (let i = 0; i < 9; i++) { const a = i / 9 * TAU; const x = Z.x - 7 + Math.cos(a) * 3, z = Z.z - 5 + Math.sin(a) * 3; sgb.ico(0.35 + (i % 3) * 0.1, 0, { pos: [x, terrainHeight(x, z) + 0.15, z], scale: [1, 0.7, 1], color: 0x7a8084, jitter: 0.2 }); }
  R.scene.add(sgb.mesh(MATS.stone));
  const dt = new THREE.Mesh(deadTreeGeo(6, 7), MATS.vc); const dx = Z.x + 9, dz = Z.z - 7; dt.position.set(dx, terrainHeight(dx, dz), dz); dt.castShadow = true; R.scene.add(dt);
  addCollider({ x: dx, z: dz, r: 0.3, h: 6 });
  OBJ.deadBirch = V3(dx, terrainHeight(dx, dz) + 4.6, dz);
  mark('zee_wombat', Z.x + 3.5, Z.z - 3.2, -2.2);
  mark('zee_rise', Z.x + 5.0, Z.z - 4.6, -2.4);
  mark('zee_luka', Z.x - 3.0, Z.z - 6.5, 0.5);
  mark('zee_chase', Z.x + 0.4, Z.z - 5.2, 0.8);
}

// ---------- the cliff path ----------
function buildCliffPath() {
  const gb = new GB(), Y = (x, z) => terrainHeight(x, z);
  // the signpost at the fork
  const sp = LOC.fork; const sy = Y(sp.x + 2.5, sp.z - 1.5);
  gb.cyl(0.07, 0.08, 2.6, 6, { pos: [sp.x + 2.5, sy + 1.3, sp.z - 1.5], color: 0x5c4232 });
  R.scene.add(gb.mesh(MATS.vc));
  const arrows = [['SIGNAL HILL ← 40', -0.2, 2.35], ['OPTUS CITY →', 0.6, 2.0], ['YES TOWN ↑', 1.3, 1.65], ['HELPDESK: PLEASE HOLD', 2.6, 1.3]];
  arrows.forEach(([t, rot, h]) => {
    const m = signMesh(1.25, 0.24, 256, 48, (g, w, hh) => { paintBoard(g, w, hh, '#6e4b33'); g.fillStyle = '#f2e6cc'; g.font = '700 20px Barlow, sans-serif'; drawLines(g, [t], w / 2, hh / 2 + 1, 0); });
    m.material.side = THREE.DoubleSide;
    const holder = new THREE.Group(); holder.position.set(sp.x + 2.5, sy + h, sp.z - 1.5); holder.rotation.y = rot; m.position.x = 0.62; holder.add(m); R.scene.add(holder);
  });
  OBJ.signpost = V3(sp.x + 2.5, sy + 1.8, sp.z - 1.5);
  addCollider({ x: sp.x + 2.5, z: sp.z - 1.5, r: 0.15, h: 2.6 });
  // the JARVIS cairn: a chunky old terminal sealed in ice, loading forever
  const J = LOC.jarvis, jy = Y(J.x + 2.2, J.z);
  const jg = new GB();
  for (let i = 0; i < 7; i++) jg.ico(0.5, 0, { pos: [J.x + 2.2 + Math.cos(i) * 0.7, jy + 0.2, J.z + Math.sin(i) * 0.7], color: 0x6d7276, jitter: 0.2 });
  jg.box(0.75, 0.6, 0.65, { pos: [J.x + 2.2, jy + 0.85, J.z], color: 0xcfc9b8 });
  jg.box(0.8, 0.08, 0.35, { pos: [J.x + 2.2, jy + 0.5, J.z - 0.55], color: 0xbab3a0 });
  R.scene.add(jg.mesh(MATS.stone));
  const spinC = document.createElement('canvas'); spinC.width = 64; spinC.height = 48;
  const spinT = new THREE.CanvasTexture(spinC); spinT.colorSpace = THREE.SRGBColorSpace;
  const scr = new THREE.Mesh(new THREE.PlaneGeometry(0.52, 0.4), new THREE.MeshBasicMaterial({ map: spinT })); scr.position.set(J.x + 2.2, jy + 0.88, J.z - 0.33); scr.rotation.y = PI; R.scene.add(scr);
  const iceBlock = new THREE.Mesh(new THREE.BoxGeometry(1.15, 1.25, 1.1), new THREE.MeshStandardMaterial({ color: 0xbfe6f5, roughness: 0.05, transparent: true, opacity: 0.32, depthWrite: false }));
  iceBlock.position.set(J.x + 2.2, jy + 0.78, J.z); iceBlock.rotation.y = 0.2; R.scene.add(iceBlock);
  OBJ.jarvis = { pos: V3(J.x + 2.2, jy + 0.9, J.z), canvas: spinC, tex: spinT, label: 'JARVIS is not responding.', t: 0 };
  addCollider({ x: J.x + 2.2, z: J.z, r: 0.9, h: 1.5 });
  // the Stone of Three Brothers (enormous hair)
  const B = LOC.brothers, by = Y(B.x, B.z);
  const bg = new GB();
  for (let i = 0; i < 3; i++) {
    const x = B.x - 1.2 + i * 1.2, z = B.z + (i === 1 ? -0.4 : 0);
    bg.cyl(0.32, 0.42, 1.6, 7, { pos: [x, by + 0.8, z], color: 0x8b8d8c, jitter: 0.15 });
    bg.ico(0.36, 0, { pos: [x, by + 1.85, z], color: 0x8b8d8c });
    bg.ico(0.7, 1, { pos: [x, by + 2.2, z + 0.08], scale: [1, 0.85, 0.9], color: 0x777a79, jitter: 0.2 });
    addCollider({ x, z, r: 0.45, h: 2.6 });
  }
  R.scene.add(bg.mesh(MATS.stone));
  OBJ.brothers = V3(B.x, by + 1.6, B.z);
  // the Tower Shrine: a fallen lattice cell tower, with a three-panel carving
  const S = LOC.shrine, shy = Y(S.x - 2.5, S.z);
  const tg = new GB();
  for (let i = 0; i < 9; i++) {
    const x0 = S.x - 2.5 - i * 1.6, x1 = x0 - 1.6, w0 = 1.2 - i * 0.1, w1 = w0 - 0.1, h0 = shy + 0.6 + i * 0.25;
    for (const s of [-1, 1]) { tg.strut([x0, h0 + s * w0 * 0.5, S.z + w0 * 0.5], [x1, h0 + 0.25 + s * w1 * 0.5, S.z + w1 * 0.5], 0.06, { color: 0x6b6f72 }); tg.strut([x0, h0 + s * w0 * 0.5, S.z - w0 * 0.5], [x1, h0 + 0.25 + s * w1 * 0.5, S.z - w1 * 0.5], 0.06, { color: 0x6b6f72 }); }
    tg.strut([x0, h0 - w0 * 0.5, S.z - w0 * 0.5], [x1, h0 + 0.25 + w1 * 0.5, S.z + w1 * 0.5], 0.04, { color: 0x6b6f72 });
  }
  tg.box(1.6, 1.4, 1.6, { pos: [S.x - 1.6, shy + 0.55, S.z], color: 0x7a7c7b, jitter: 0.1 });
  R.scene.add(tg.mesh(MATS.concrete));
  const carve = signMesh(1.5, 1.0, 256, 172, (g, w, h) => {
    g.fillStyle = '#7a7c7b'; g.fillRect(0, 0, w, h); g.strokeStyle = '#3d3f3e'; g.lineWidth = 3;
    for (let i = 0; i < 3; i++) g.strokeRect(6 + i * 82, 8, 78, h - 16);
    g.lineWidth = 2.5;
    // a giant handing a lanyard to a small figure
    g.beginPath(); g.arc(36, 40, 10, 0, TAU); g.moveTo(36, 50); g.lineTo(36, 110); g.moveTo(36, 70); g.lineTo(62, 92); g.moveTo(62, 92); g.lineTo(62, 112); g.stroke(); g.beginPath(); g.arc(66, 106, 5, 0, TAU); g.moveTo(66, 111); g.lineTo(66, 150); g.stroke();
    // a tower above the clouds
    g.beginPath(); g.moveTo(130, 150); g.lineTo(124, 30); g.lineTo(118, 150); g.moveTo(124, 30); g.lineTo(124, 18); g.stroke(); g.beginPath(); g.moveTo(96, 96); g.bezierCurveTo(110, 84, 140, 84, 154, 96); g.stroke();
    // a figure with a bow and headphones
    g.beginPath(); g.arc(206, 56, 9, 0, TAU); g.moveTo(195, 56); g.arc(206, 56, 13, PI, 0); g.moveTo(206, 65); g.lineTo(206, 120); g.moveTo(222, 40); g.quadraticCurveTo(240, 85, 222, 130); g.moveTo(222, 40); g.lineTo(222, 130); g.stroke();
  });
  carve.position.set(S.x - 0.79, shy + 0.6, S.z); carve.rotation.y = PI / 2; R.scene.add(carve);
  OBJ.shrine = V3(S.x - 0.8, shy + 0.8, S.z); OBJ.shrineTop = V3(S.x - 1.6, shy + 1.4, S.z);
  addCollider({ x0: S.x - 2.4, x1: S.x - 0.8, z0: S.z - 0.8, z1: S.z + 0.8, h: 1.4 });
  // the chime-phone tree: four old brick phones, each tuned to one note
  const C = LOC.chime, cy = Y(C.x + 1.8, C.z);
  const ct = new THREE.Mesh(deadTreeGeo(7, 21), MATS.vc); ct.position.set(C.x + 1.8, cy, C.z); ct.castShadow = true; R.scene.add(ct);
  addCollider({ x: C.x + 1.8, z: C.z, r: 0.3, h: 7 });
  OBJ.chimePhones = [];
  for (let i = 0; i < 4; i++) {
    const g = new THREE.Group(); g.position.set(C.x + 1.8 + (i - 1.5) * 0.75, cy + 4.3 + (i % 2) * 0.3, C.z + 0.6);
    const ph = new GB().box(0.004, 0.9, 0.004, { pos: [0, -0.45, 0], color: 0x222 }).box(0.12, 0.34, 0.07, { pos: [0, -1.05, 0], color: 0x2b2b2b }).box(0.02, 0.12, 0.02, { pos: [0.04, -0.82, 0], color: 0x111 }).mesh(MATS.vcNoSnow);
    g.add(ph); R.scene.add(g);
    OBJ.chimePhones.push({ g, note: [62, 65, 69, 67][[2, 0, 3, 1][i]], idx: i, swing: 0 });
  }
  // the wreck from another time (display phones and a display table)
  const wr = new GB(), wx = 28.5, wz = 85, wy = Y(wx, wz);
  wr.box(1.6, 0.6, 1.0, { pos: [wx, wy + 0.2, wz], rot: [0.15, 0.4, 0.3], color: 0xdcdcd4 });
  for (let i = 0; i < 5; i++) wr.box(0.3, 0.55, 0.04, { pos: [wx - 0.6 + i * 0.3, wy + 0.65, wz + 0.1], rot: [0.2, 0.4, 0.3 + i * 0.1], color: 0x1c1f22 });
  wr.torus(0.5, 0.05, 4, 14, { pos: [wx + 0.4, wy + 0.8, wz - 0.3], rot: [0.5, 0, 0.4], color: 0x9a9a9a });
  R.scene.add(wr.mesh(MATS.vc)); OBJ.wreck = V3(wx, wy + 0.6, wz);
  // the Upgrade Stag's shed antenna-antler on the ridge
  const ax = 37.5, az = 66, ay = Y(ax, az);
  const ant = new GB().strut([0, 0, 0], [0.1, 0.8, 0], 0.04, { round: true, color: 0x8a8f94 });
  for (let i = 0; i < 5; i++) ant.strut([0, 0.15 + i * 0.15, 0], [0.25 + (i % 2) * 0.1, 0.25 + i * 0.15, 0], 0.025, { round: true, color: 0x8a8f94 });
  const antM = ant.mesh(MATS.vcNoSnow); antM.position.set(ax, ay + 0.05, az); antM.rotation.set(1.3, 0.4, 0); R.scene.add(antM); OBJ.antler = { mesh: antM, pos: V3(ax, ay + 0.2, az) };
}

// ---------- the Hornibrook ruins ----------
function buildHornibrook() {
  const D = DECK, gb = new GB(), r = mulberry32(123);
  // deck slab with broken edges
  gb.box(D.x1 - D.x0 + 1, 1.2, D.z1 - D.z0, { pos: [(D.x0 + D.x1) / 2, D.y - 0.6, (D.z0 + D.z1) / 2], color: 0x9a9d9e, uvScale: [10, 3] });
  for (let x = D.x0; x < D.x1; x += 1.2) for (const z of [D.z0 + 0.3, D.z1 - 0.3]) { const h = 0.5 + r() * 0.6; gb.box(1.1 + r() * 0.4, h, 0.55 + r() * 0.3, { pos: [x, D.y + h / 2 - 0.05, z + (r() - .5) * 0.2], rot: [0, (r() - .5) * 0.3, (r() - .5) * 0.2], color: 0x8a8e90, jitter: 0.2 }); }
  // the broken far end: rebar like ribs, rubble
  for (let i = 0; i < 14; i++) gb.strut([D.x1 - 0.2, D.y - 0.4 - r() * 0.4, D.z0 + 1 + i * 1.2], [D.x1 + 1.2 + r() * 1.4, D.y + 0.2 + r() * 0.8, D.z0 + 1 + i * 1.2 + (r() - .5)], 0.05, { color: 0x6a3a22, round: true });
  for (let i = 0; i < 10; i++) gb.ico(0.6 + r() * 0.5, 0, { pos: [D.x1 - 1 - r() * 2, D.y + 0.3, D.z0 + 1.5 + r() * (D.z1 - D.z0 - 3)], color: 0x8a8e90, jitter: 0.2 });
  // further spans, collapsed onto the ice
  gb.box(16, 1.1, 16, { pos: [D.x1 + 14, D.y - 3.5, (D.z0 + D.z1) / 2], rot: [0.05, 0, -0.42], color: 0x9a9d9e });
  gb.box(18, 1.1, 16, { pos: [D.x1 + 34, D.y - 1.5, (D.z0 + D.z1) / 2 + 1], rot: [0, 0.04, 0.12], color: 0x9a9d9e });
  // piers down to the ice
  for (let x = D.x0 + 6; x < D.x1 + 40; x += 14) for (const z of [D.z0 + 3, D.z1 - 3]) gb.box(1.6, D.y + 1, 1.6, { pos: [x, (D.y - 1.2) / 2 - 0.5, z], color: 0x888b8c, ao: 0.4, aoY0: 0, aoY1: 4 });
  // four standing pillars on the arena (charge targets)
  OBJ.pillars = [];
  for (const [px, pz] of [[70, 141.3], [70, 150.7], [96, 141.3], [96, 150.7]]) {
    gb.box(1.3, 5.2, 1.3, { pos: [px, D.y + 2.6, pz], color: 0x8f9394, jitter: 0.08 });
    gb.box(1.6, 0.4, 1.6, { pos: [px, D.y + 5.2, pz], color: 0x7d8182 });
    for (let k = 0; k < 4; k++) gb.strut([px + (k % 2 ? 0.5 : -0.5), D.y + 5.3, pz + (k < 2 ? 0.5 : -0.5)], [px + (k % 2 ? 0.7 : -0.6), D.y + 6.1 + r() * 0.5, pz + (k < 2 ? 0.7 : -0.5)], 0.05, { color: 0x6a3a22, round: true });
    OBJ.pillars.push(addCollider({ x0: px - 0.65, x1: px + 0.65, z0: pz - 0.65, z1: pz + 0.65, y0: D.y - 1, y1: D.y + 5.4, tag: 'pillar', pillar: true, px, pz }));
  }
  // the toll booth, queue stanchions
  const TB = { x: 51.5, z: 152.5 }, ty = groundHeight(TB.x, TB.z);
  gb.box(2.4, 0.3, 2.0, { pos: [TB.x, ty + 0.15, TB.z], color: 0x777b7c });
  gb.box(0.18, 2.6, 0.18, { pos: [TB.x - 1.1, ty + 1.45, TB.z - 0.9], color: 0x5a5e60 }); gb.box(0.18, 2.6, 0.18, { pos: [TB.x + 1.1, ty + 1.45, TB.z - 0.9], color: 0x5a5e60 });
  gb.box(0.18, 2.6, 0.18, { pos: [TB.x - 1.1, ty + 1.45, TB.z + 0.9], color: 0x5a5e60 }); gb.box(0.18, 2.6, 0.18, { pos: [TB.x + 1.1, ty + 1.45, TB.z + 0.9], color: 0x5a5e60 });
  gb.box(2.7, 0.22, 2.3, { pos: [TB.x, ty + 2.85, TB.z], rot: [0.05, 0, -0.08], color: 0xb7432f });
  gb.box(2.3, 1.0, 0.1, { pos: [TB.x, ty + 0.8, TB.z + 0.95], color: 0x6d7173 });
  gb.box(0.5, 1.3, 0.4, { pos: [TB.x - 1.6, ty + 0.65, TB.z - 1.6], color: 0x3a4a52 });
  addCollider({ x0: TB.x - 1.2, x1: TB.x + 1.2, z0: TB.z - 1.0, z1: TB.z + 1.0, h: 3, tag: 'booth' });
  addCollider({ x: TB.x - 1.6, z: TB.z - 1.6, r: 0.35, h: 1.4, tag: 'ticket' });
  OBJ.queuePosts = [];
  for (let row = 0; row < 4; row++) for (let i = 0; i < 6; i++) {
    const x = 38.5 + i * 1.8, z = 140.5 + row * 2.2; const y = groundHeight(x, z);
    gb.cyl(0.04, 0.05, 0.95, 5, { pos: [x, y + 0.48, z], color: 0x6a4a3a }); gb.cyl(0.14, 0.16, 0.05, 8, { pos: [x, y + 0.03, z], color: 0x553a2e });
    if (i < 5) gb.box(1.8, 0.05, 0.01, { pos: [x + 0.9, y + 0.85, z], color: 0x8a2a20 });
    OBJ.queuePosts.push(V3(x, y, z));
  }
  // rock step with the shortcut ladder
  gb.box(3.5, 3.2, 3.0, { pos: [44.2, groundHeight(44.2, 153.5) + 1.2, 155.6], color: 0xb3542e, jitter: 0.2 });
  for (let i = 0; i < 2; i++) gb.box(0.07, 3.6, 0.07, { pos: [44.2 + i * 0.5 - 0.25, groundHeight(44.2, 153.6) + 1.6, 153.9], rot: [-0.32, 0, 0], color: 0x6e4b33 });
  for (let k = 0; k < 9; k++) gb.box(0.5, 0.05, 0.05, { pos: [44.2, groundHeight(44.2, 153.6) + 0.3 + k * 0.36, 154.05 + k * 0.12], color: 0x6e4b33 });
  addCollider({ x0: 42.4, x1: 46, z0: 154, z1: 157.2, h: 3, tag: 'rockstep' });
  const deck = gb.mesh(MATS.concrete); R.scene.add(deck);
  // the ticket machine screen
  const tc = document.createElement('canvas'); tc.width = 96; tc.height = 48;
  const tt = new THREE.CanvasTexture(tc); tt.colorSpace = THREE.SRGBColorSpace;
  const tscr = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.21), new THREE.MeshBasicMaterial({ map: tt })); tscr.position.set(TB.x - 1.6, ty + 1.05, TB.z - 1.39); R.scene.add(tscr);
  OBJ.ticket = { canvas: tc, tex: tt, serving: 1, pos: V3(TB.x - 1.6, ty + 1.0, TB.z - 1.6), roof: V3(TB.x, ty + 3.0, TB.z) };
  drawTicketScreen();
  // Hamarr's lair below: a mountain of returned items
  const lair = new GB(), lx = 63, lz = 161.5;
  for (let i = 0; i < 26; i++) lair.box(0.4 + r() * 0.8, 0.2 + r() * 0.5, 0.3 + r() * 0.6, { pos: [lx + (r() - .5) * 6, 0.3 + r() * 1.8 * (1 - Math.abs(r() - .5)), lz + (r() - .5) * 4], rot: [r(), r(), r()], color: pick([0x8a8a8a, 0x3a3f44, 0xc0c0c0, 0x2a2a2a, 0x6a2a2a, 0x2a4a6a]) });
  for (let i = 0; i < 3; i++) { lair.box(0.9, 0.6, 0.6, { pos: [lx - 2 + i * 1.5, 0.5, lz + 2.2], rot: [0, i, 0.3], color: 0x9aa0a4 }); }
  lair.box(2.4, 0.25, 1.6, { pos: [lx + 2.5, 0.15, lz - 1.5], color: 0x2a2a2a, jitter: 0.4 });
  R.scene.add(lair.mesh(MATS.vc));
  const rs = signMesh(1.4, 0.5, 256, 92, (g, w, h) => { g.fillStyle = '#f2f2ee'; g.fillRect(0, 0, w, h); g.fillStyle = '#b31d1d'; g.font = '800 22px Barlow, sans-serif'; drawLines(g, ['NO RETURNS', 'WITHOUT RECEIPT'], w / 2, 30, 32); });
  rs.position.set(lx - 1.6, 2.0, lz - 1.1); rs.rotation.set(0, -0.6, 0.12); R.scene.add(rs);
  OBJ.lair = V3(lx, 1.0, lz);
  mark('queue_luka', 49.5, 137.6, PI / 2 + 0.4);
  mark('queue_chase', 48.5, 136.0, PI / 2 + 0.2);
  mark('arena_luka', 66, 146, PI / 2, D.y);
  mark('arena_chase', 62, 144, PI / 2, D.y);
  mark('ladder', 44.2, 153.0, PI, groundHeight(44.2, 153.0));
}
function drawTicketScreen(extra) {
  const T = OBJ.ticket; if (!T) return;
  const g = T.canvas.getContext('2d');
  g.fillStyle = '#05140f'; g.fillRect(0, 0, 96, 48);
  g.fillStyle = '#3dfc9b'; g.font = '700 10px monospace'; g.textAlign = 'center'; g.fillText('NOW SERVING', 48, 15);
  g.font = '700 22px monospace'; g.fillText(String(T.serving).padStart(3, '0'), 48, 40);
  T.tex.needsUpdate = true;
}
