// ================= WORLD: Faye's grove, Store 001, the yard, the Faraday Ward, the pyre =================
const OBJ = {}; // named world objects the director drives
const INTERACT = []; // { pos, r, label, key, use(), enabled() }
const MARKS = {};

function addInteract(o) { o.enabled = o.enabled || (() => true); INTERACT.push(o); return o; }
function mark(name, x, z, yaw = 0, y = null) { MARKS[name] = { pos: V3(x, y != null ? y : groundHeight(x, z), z), yaw }; return MARKS[name]; }

// ---------- the marked tree ----------
function buildMarkedTree() {
  const T = LOC.markedTree, y = terrainHeight(T.x, T.z);
  const yaw = Math.atan2(LOC.grove.x - T.x, LOC.grove.z - T.z); // faces the clearing
  const root = new THREE.Group(); root.position.set(T.x, y - 0.05, T.z); root.rotation.y = yaw;
  const stump = new GB().cyl(0.36, 0.42, 0.6, 9, { pos: [0, 0.3, 0], color: 0x5a4030 }).cyl(0.33, 0.33, 0.02, 9, { pos: [0, 0.6, 0], color: 0xc9a77a }).mesh(MATS.bark);
  root.add(stump);
  const pivot = new THREE.Group(); pivot.position.y = 0.6; root.add(pivot);
  const log = new GB().cyl(0.29, 0.34, 5.4, 9, { pos: [0, 2.7, 0], color: 0x5c4232, uvScale: [1, 4] })
    .cyl(0.06, 0.08, 0.5, 5, { pos: [0.3, 3.9, 0.1], rot: [0, 0, -1.1], color: 0x4a3526 })
    .cyl(0.05, 0.07, 0.4, 5, { pos: [-0.25, 4.6, -0.1], rot: [0.3, 0, 1.2], color: 0x4a3526 })
    // chop wedge
    .box(0.36, 0.2, 0.1, { pos: [0, 0.05, 0.3], rot: [0.3, 0, 0], color: 0xd8b98c })
    .mesh(MATS.bark);
  pivot.add(log);
  const canopy = new THREE.Mesh(pineGeo(8.5, 2.6, 5, 77, { trunkH: 0.6 }), MATS.pine);
  canopy.position.y = 4.6; canopy.castShadow = true; pivot.add(canopy);
  // the handprint: yellow paint, frost along its edges
  const hand = textTex(64, 64, (g, w, h) => {
    g.translate(w / 2, h / 2 + 4); g.fillStyle = '#ffcf1f';
    g.beginPath(); g.ellipse(0, 6, 12, 13, 0, 0, TAU); g.fill();
    const fingers = [[-11, -8, -0.5, 12], [-4, -14, -0.12, 15], [4, -15, 0.08, 16], [11, -11, 0.35, 13], [-16, 6, -1.2, 10]];
    for (const [x, yy, a, l] of fingers) { g.save(); g.translate(x, yy); g.rotate(a); g.beginPath(); g.ellipse(0, -l * 0.35, 3.6, l * 0.62, 0, 0, TAU); g.fill(); g.restore(); }
    g.globalCompositeOperation = 'source-atop'; g.fillStyle = 'rgba(230,245,255,.55)';
    const r = mulberry32(4); for (let i = 0; i < 90; i++) { const a = r() * TAU, d = 9 + r() * 16; g.fillRect(Math.cos(a) * d, Math.sin(a) * d, 1.4, 1.4); }
  });
  const handMat = new THREE.MeshLambertMaterial({ map: hand, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 });
  const handMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.34, 0.34), handMat);
  handMesh.position.set(0.02, 0.95, 0.318); handMesh.rotation.z = 0.08; pivot.add(handMesh);
  // Faye's lanyard, tied around the trunk
  const lan = new THREE.Group(); pivot.add(lan);
  lan.add(new GB().torus(0.335, 0.012, 4, 20, { rot: [PI / 2, 0, 0], pos: [0, 0.68, 0], color: 0x0f8a8a })
    .strut([0, 0.67, 0.335], [0.02, 0.42, 0.37], 0.022, { color: 0x0f8a8a, depth: 0.004 }).mesh(MATS.vcNoSnow));
  const badgeT = textTex(96, 64, (g, w, h) => {
    g.fillStyle = '#f3f6f6'; g.fillRect(0, 0, w, h); g.fillStyle = '#ffcf1f'; g.fillRect(0, 0, w, 12);
    g.fillStyle = '#10272c'; g.font = 'bold 15px Barlow, sans-serif'; drawLines(g, ['FAYE'], w / 2, 30, 14);
    g.font = '600 9px Barlow, sans-serif'; drawLines(g, ['STORE MANAGER'], w / 2, 47, 10);
    g.fillStyle = 'rgba(220,235,245,.5)'; for (let i = 0; i < 40; i++) g.fillRect(Math.random() * w, Math.random() * h, 2, 2);
  });
  const badge = new THREE.Mesh(new THREE.PlaneGeometry(0.085, 0.057), new THREE.MeshLambertMaterial({ map: badgeT }));
  badge.position.set(0.02, 0.38, 0.375); badge.rotation.x = -0.15; lan.add(badge);
  R.scene.add(root);
  OBJ.tree = { root, pivot, log, canopy, hand: handMesh, lanyard: lan, yaw, base: V3(T.x, y, T.z), fallen: false };
  addCollider(OBJ.tree.col = { x: T.x, z: T.z, r: 0.42, h: 12, tag: 'markedTree' });
  const f = fwdFromYaw(yaw);
  mark('tree_hand', T.x + f.x * 0.62, T.z + f.z * 0.62, yaw + PI);
  mark('tree_chop', T.x + f.x * 1.15, T.z + f.z * 1.15, yaw + PI);
}

// ---------- Store 001 ----------
function buildLonghouse() {
  const X0 = -22, X1 = -6, Z0 = -96, Z1 = -88, CX = (X0 + X1) / 2, CZ = (Z0 + Z1) / 2;
  const G = groundHeight(CX, CZ), FY = G + 0.8, WH = 2.9, RIDGE = FY + WH + 2.15, T = 0.3;
  OBJ.house = { X0, X1, Z0, Z1, G, FY, RIDGE, CX, CZ };
  const shell = new GB();
  // foundation stones, with a gap on the south side (the final pull-out leaves through it)
  const r = mulberry32(55);
  const stoneRow = (ax, az, bx, bz, skip) => {
    const len = Math.hypot(bx - ax, bz - az), n = Math.ceil(len / 0.7);
    for (let i = 0; i < n; i++) {
      const t = (i + 0.5) / n, x = lerp(ax, bx, t), z = lerp(az, bz, t);
      if (skip && skip(x, z)) continue;
      shell.box(0.68, FY - G - 0.1 + r() * 0.06, 0.42, { pos: [x, G + (FY - G) / 2 - 0.08, z], rot: [0, Math.atan2(bx - ax, bz - az), 0], color: 0x6c6f72, jitter: 0.25 });
    }
  };
  stoneRow(X0, Z0, X1, Z0); stoneRow(X0, Z1, X1, Z1, (x) => x > -12.9 && x < -11.4); stoneRow(X0, Z0, X0, Z1); stoneRow(X1, Z0, X1, Z1);
  // log walls
  const wall = (x0, x1, z0, z1, y0, y1) => shell.box(x1 - x0, y1 - y0, z1 - z0, { pos: [(x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2], color: 0xffffff, uvScale: [Math.max(x1 - x0, z1 - z0) / 3, (y1 - y0) / 3] });
  wall(X0, X1, Z0 - T / 2, Z0 + T / 2, FY - 0.12, FY + WH);   // north
  wall(X0, X1, Z1 - T / 2, Z1 + T / 2, FY - 0.12, FY + WH);   // south
  wall(X0 - T / 2, X0 + T / 2, Z0, Z1, FY - 0.12, FY + WH);   // west
  const DZ0 = -92.9, DZ1 = -91.1, DH = 2.25;
  wall(X1 - T / 2, X1 + T / 2, DZ1, Z1, FY - 0.12, FY + WH);  // east, south of the door
  wall(X1 - T / 2, X1 + T / 2, Z0, DZ0, FY - 0.12, FY + WH);  // east, north of the door
  wall(X1 - T / 2, X1 + T / 2, DZ0, DZ1, FY + DH, FY + WH);   // lintel
  const wallMesh = shell.mesh(MATS.logs); R.scene.add(wallMesh);
  // gables and roof
  const gable = new THREE.Shape(); gable.moveTo(-4.15, 0); gable.lineTo(4.15, 0); gable.lineTo(0, 2.15); gable.lineTo(-4.15, 0);
  const gg = new THREE.ExtrudeGeometry(gable, { depth: T, bevelEnabled: false }); gg.rotateY(PI / 2);
  const roofB = new GB();
  roofB.add(gg.clone(), { pos: [X0 - T / 2, FY + WH, CZ], color: 0x8a6143, uvScale: [0.3, 0.3] });
  roofB.add(gg, { pos: [X1 - T / 2, FY + WH, CZ], color: 0x8a6143, uvScale: [0.3, 0.3] });
  const slope = Math.atan2(2.15, 4.4), sl = Math.hypot(4.4, 2.15) + 0.55;
  roofB.box(X1 - X0 + 1.2, 0.26, sl, { pos: [CX, RIDGE - 1.08 - 0.12, CZ + 2.2 + 0.22], rot: [slope, 0, 0], color: 0x5d4330 });
  roofB.box(X1 - X0 + 1.2, 0.26, sl, { pos: [CX, RIDGE - 1.08 - 0.12, CZ - 2.2 - 0.22], rot: [-slope, 0, 0], color: 0x5d4330 });
  roofB.box(X1 - X0 + 1.3, 0.22, 0.3, { pos: [CX, RIDGE + 0.02, CZ], color: 0x4a3324 });
  // carved bargeboards crossing at the peak, like dragon heads
  for (const sx of [X1 + 0.62, X0 - 0.62]) {
    roofB.strut([sx, FY + WH - 0.25, Z1 + 0.55], [sx, RIDGE + 0.85, CZ - 0.75], 0.22, { color: 0x6b4a32, depth: 0.12 });
    roofB.strut([sx, FY + WH - 0.25, Z0 - 0.55], [sx, RIDGE + 0.85, CZ + 0.75], 0.22, { color: 0x6b4a32, depth: 0.12 });
  }
  // chimney
  roofB.box(0.9, 2.2, 0.9, { pos: [-18.2, RIDGE - 0.5, -93.6], color: 0x6c6f72, jitter: 0.2 });
  const roof = roofB.mesh(MATS.planks); R.scene.add(roof);
  // shopfront: sign board, lintel runes ᛃᛖᛊ, warm windows
  const front = new GB();
  front.box(0.12, 0.55, 3.2, { pos: [X1 + 0.2, FY + WH + 0.5, CZ], color: 0x3e2a1c });
  front.box(0.1, 0.18, 2.3, { pos: [X1 + 0.2, FY + DH + 0.1, CZ], color: 0x5a3e2a });
  front.box(0.14, DH, 0.14, { pos: [X1 + 0.22, FY + DH / 2, DZ0 - 0.07], color: 0x4a3324 });
  front.box(0.14, DH, 0.14, { pos: [X1 + 0.22, FY + DH / 2, DZ1 + 0.07], color: 0x4a3324 });
  for (const wz of [-94.5, -89.5]) {
    front.box(0.12, 0.95, 1.2, { pos: [X1 + 0.17, FY + 1.45, wz], color: 0x3a281b });
  }
  // steps
  front.box(1.3, 0.38, 2.4, { pos: [X1 + 0.85, G + 0.19, CZ], color: 0x707478, jitter: 0.15 });
  front.box(0.75, 0.38, 2.2, { pos: [X1 + 0.62, G + 0.57, CZ], color: 0x707478, jitter: 0.15 });
  const frontMesh = front.mesh(MATS.planks); R.scene.add(frontMesh);
  const runeGB = new GB();
  addRunes(runeGB, 'ᛃᛖᛊ', { y: 0, size: 0.13, stroke: 0.022, gap: 0.05, color: 0xffcf1f, matrix: new THREE.Matrix4().makeRotationY(PI / 2).setPosition(X1 + 0.26, FY + DH + 0.035, CZ) });
  const lintelRunes = runeGB.mesh(glow(1.6, 1.1, 0.15)); R.scene.add(lintelRunes);
  const signT = textTex(256, 48, (g, w, h) => {
    g.fillStyle = '#2b1d13'; g.fillRect(0, 0, w, h);
    g.fillStyle = '#e9d6b4'; g.font = '700 26px Cinzel, Georgia, serif'; drawLines(g, ['STORE  001'], w / 2, h / 2 + 1, 0);
  });
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(3.0, 0.5), new THREE.MeshLambertMaterial({ map: signT }));
  sign.position.set(X1 + 0.27, FY + WH + 0.5, CZ); sign.rotation.y = PI / 2; R.scene.add(sign);
  // windows: warm outside, night-blue inside
  for (const wz of [-94.5, -89.5]) {
    const o = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 0.75), MATS.warmWindow); o.position.set(X1 + 0.235, FY + 1.45, wz); o.rotation.y = PI / 2; R.scene.add(o);
    const i = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 0.75), basic({ color: 0x0d1830 })); i.position.set(X1 - 0.16, FY + 1.45, wz); i.rotation.y = -PI / 2; R.scene.add(i);
    (OBJ.windows = OBJ.windows || []).push(o);
  }
  // icicles along the eaves
  const ice = new GB();
  for (let x = X0 - 0.4; x <= X1 + 0.4; x += 0.33) for (const ez of [Z1 + 0.5, Z0 - 0.5]) { const l = 0.15 + r() * 0.45; ice.cone(0.035, l, 4, { pos: [x + r() * 0.1, FY + WH - 0.27 - l / 2, ez], rot: [PI, 0, 0], color: 0xcfe8f5 }); }
  const icicles = ice.mesh(new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.1, metalness: 0, transparent: true, opacity: 0.85 }), { cast: false }); R.scene.add(icicles);
  // weathervane: the old Yes sign that fell off the store wall
  const vane = new THREE.Group(); vane.position.set(X1 + 0.1, RIDGE + 0.15, CZ);
  vane.add(new GB().cyl(0.02, 0.025, 1.3, 5, { pos: [0, 0.65, 0], color: 0x333638 }).mesh(MATS.vcNoSnow));
  const vs = new THREE.Group(); vs.position.y = 1.15; vane.add(vs);
  const yesT = textTex(128, 64, (g, w, h) => { g.fillStyle = '#ffcf1f'; g.beginPath(); g.roundRect(4, 6, w - 8, h - 12, 14); g.fill(); g.fillStyle = '#0d2a2c'; g.font = '900 36px Barlow, sans-serif'; drawLines(g, ['yes'], w / 2, h / 2 + 2, 0); });
  const ym = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.45), new THREE.MeshLambertMaterial({ map: yesT, side: THREE.DoubleSide }));
  ym.position.x = 0.4; vs.add(ym); R.scene.add(vane); OBJ.vane = vs;
  // the door, hinged on its north edge, opening inward
  const door = new THREE.Group(); door.position.set(X1, FY, DZ0);
  const dm = new GB().box(0.09, DH - 0.02, 1.78, { pos: [0, DH / 2, 0.9], color: 0x6e4b33, uvScale: [1, 1] }).box(0.12, 0.1, 1.6, { pos: [0.02, 0.5, 0.9], color: 0x3a2a1c }).box(0.12, 0.1, 1.6, { pos: [0.02, 1.7, 0.9], color: 0x3a2a1c }).mesh(MATS.planksIn);
  door.add(dm); R.scene.add(door); OBJ.door = door;
  const doorCol = addCollider({ x0: X1 - 0.15, x1: X1 + 0.15, z0: DZ0, z1: DZ1, h: 3, tag: 'door' });
  OBJ.doorCol = doorCol;
  // colliders: walls (door gap stays open for the director to walk through)
  addCollider({ x0: X0 - 0.3, x1: X1 + 0.3, z0: Z0 - 0.4, z1: Z0 + 0.2, h: 6, tag: 'house' });
  addCollider({ x0: X0 - 0.3, x1: X1 + 0.3, z0: Z1 - 0.2, z1: Z1 + 0.4, h: 6, tag: 'house' });
  addCollider({ x0: X0 - 0.4, x1: X0 + 0.2, z0: Z0, z1: Z1, h: 6, tag: 'house' });
  addCollider({ x0: X1 - 0.2, x1: X1 + 0.4, z0: Z0, z1: DZ0, h: 6, tag: 'house' });
  addCollider({ x0: X1 - 0.2, x1: X1 + 0.4, z0: DZ1, z1: Z1, h: 6, tag: 'house' });
  addCollider({ x0: X0, x1: X1, z0: Z0, z1: Z1, h: 6, tag: 'houseIn', noCam: false, interior: true });
  OBJ.houseInterior = COL.list[COL.list.length - 1];
  buildInterior(OBJ.house);
  mark('door_out', X1 + 2.2, CZ, -PI / 2);
  mark('door_in', X1 - 1.2, CZ, -PI / 2, FY);
}

function buildInterior(H) {
  const { X0, X1, Z0, Z1, G, FY } = H;
  const fl = new GB(), r = mulberry32(66);
  // floor planks run north–south; one plank has a gap Chase can look through, the trapdoor is behind the counter
  const TD = { x0: -9.55, x1: -8.6, z0: -95.7, z1: -94.75 };
  H.trap = TD; H.gap = { x: -7.86, z0: -93.25, z1: -92.15 };
  for (let x = X0 + 0.15; x < X1 - 0.1; x += 0.3) {
    const segs = [[Z0 + 0.15, Z1 - 0.15]];
    const cut = (a, b) => { for (let i = segs.length - 1; i >= 0; i--) { const [s0, s1] = segs[i]; if (b <= s0 || a >= s1) continue; segs.splice(i, 1, ...[[s0, a], [b, s1]].filter(s => s[1] - s[0] > 0.05)); } };
    if (x + 0.15 > TD.x0 && x - 0.15 < TD.x1) cut(TD.z0, TD.z1);
    if (Math.abs(x - H.gap.x) < 0.16) cut(H.gap.z0, H.gap.z1);
    for (const [s0, s1] of segs) fl.box(0.292, 0.1, s1 - s0, { pos: [x, FY - 0.05, (s0 + s1) / 2], color: 0xb0b0b0 * 0 + (r() < 0.5 ? 0xc4b098 : 0xb09c84), uvScale: [0.2, (s1 - s0) / 2] });
  }
  // joists under the floor
  for (let z = Z0 + 0.7; z < Z1; z += 1.4) fl.box(X1 - X0, 0.18, 0.16, { pos: [(X0 + X1) / 2, FY - 0.2, z], color: 0x5a4030 });
  // dirt under the house
  fl.box(X1 - X0 - 0.2, 0.04, Z1 - Z0 - 0.2, { pos: [(X0 + X1) / 2, G + 0.03, (Z0 + Z1) / 2], color: 0x3b3128, jitter: 0.3 });
  // counter (carved timber), display tables (driftwood), the empty chair
  fl.box(3.2, 1.0, 0.75, { pos: [-9.0, FY + 0.5, -94.2], color: 0x8a6143 });
  fl.box(3.35, 0.08, 0.9, { pos: [-9.0, FY + 1.04, -94.2], color: 0x6e4b33 });
  for (let i = 0; i < 5; i++) fl.box(0.04, 0.8, 0.02, { pos: [-10.4 + i * 0.7, FY + 0.5, -93.81], color: 0x4a3324 });
  for (const [tx, tz] of [[-17.5, -89.7], [-12.6, -89.5]]) {
    fl.box(1.7, 0.08, 0.75, { pos: [tx, FY + 0.82, tz], rot: [0, 0.03, 0], color: 0xa89a86 });
    for (const [lx, lz] of [[-0.7, -0.28], [0.7, -0.28], [-0.7, 0.28], [0.7, 0.28]]) fl.cyl(0.05, 0.07, 0.8, 5, { pos: [tx + lx, FY + 0.4, tz + lz], color: 0x8f8170 });
    for (let k = 0; k < 4; k++) { // carved wooden phones like museum pieces
      fl.box(0.09, 0.17, 0.015, { pos: [tx - 0.55 + k * 0.37, FY + 0.95, tz], rot: [-0.25, 0, 0], color: 0x9c7552 });
      fl.box(0.07, 0.03, 0.07, { pos: [tx - 0.55 + k * 0.37, FY + 0.87, tz + 0.03], color: 0x5a4030 });
    }
  }
  // Faye's chair
  const cx = -19.7, cz = -94.4;
  fl.box(0.5, 0.06, 0.5, { pos: [cx, FY + 0.46, cz], color: 0x7a5a3e });
  for (const [lx, lz] of [[-0.21, -0.21], [0.21, -0.21], [-0.21, 0.21], [0.21, 0.21]]) fl.box(0.05, 0.46, 0.05, { pos: [cx + lx, FY + 0.23, cz + lz], color: 0x5a4030 });
  fl.box(0.5, 0.55, 0.05, { pos: [cx, FY + 0.76, cz - 0.23], color: 0x7a5a3e });
  fl.box(0.04, 0.32, 0.01, { pos: [cx + 0.08, FY + 0.82, cz - 0.2], color: 0x0f8a8a });
  fl.box(0.07, 0.05, 0.005, { pos: [cx + 0.08, FY + 0.62, cz - 0.2], color: 0xf3f6f6 });
  // fire pit
  for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; fl.box(0.32, 0.22, 0.24, { pos: [-15 + Math.cos(a) * 0.75, FY + 0.11, -92 + Math.sin(a) * 0.75], rot: [0, -a, 0], color: 0x5d6063, jitter: 0.2 }); }
  for (let i = 0; i < 4; i++) fl.cyl(0.07, 0.08, 0.9, 5, { pos: [-15, FY + 0.18, -92], rot: [PI / 2, 0, i * 0.8], color: 0x2c1e14 });
  // the trapdoor frame and lid (separate so it can open)
  const interior = fl.mesh(MATS.planksIn); interior.name = 'interior'; R.scene.add(interior);
  const lid = new THREE.Group(); lid.position.set(TD.x0, FY, TD.z0);
  lid.add(new GB().box(TD.x1 - TD.x0, 0.08, TD.z1 - TD.z0, { pos: [(TD.x1 - TD.x0) / 2, -0.04, (TD.z1 - TD.z0) / 2], color: 0x9c8468 }).torus(0.05, 0.008, 4, 10, { pos: [(TD.x1 - TD.x0) / 2, 0.005, (TD.z1 - TD.z0) - 0.12], rot: [PI / 2, 0, 0], color: 0x333333 }).mesh(MATS.planksIn));
  R.scene.add(lid); OBJ.trapLid = lid;
  // Best of the Month: thirty-six plaques of Faye, and one blank
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const wallT = textTex(768, 512, (g, w, h) => {
    g.clearRect(0, 0, w, h);
    g.fillStyle = '#e9d9bb'; g.font = '700 22px Cinzel, Georgia, serif'; drawLines(g, ['BEST OF THE MONTH'], w / 2, 22, 0);
    const pw = 100, ph = 64, gx = (w - pw * 6 - 20 * 5) / 2;
    for (let i = 0; i < 37; i++) {
      const col = i < 36 ? i % 6 : 2.5, row = i < 36 ? Math.floor(i / 6) : 6;
      const x = gx + col * (pw + 20), y = 44 + row * (ph + 4.5);
      g.fillStyle = '#5a3c26'; g.fillRect(x, y, pw, ph);
      g.fillStyle = '#7a5538'; g.fillRect(x + 3, y + 3, pw - 6, ph - 6);
      if (i === 36) continue;
      g.fillStyle = '#3d2818'; g.beginPath(); g.ellipse(x + 22, y + 32, 13, 17, 0, 0, TAU); g.fill();
      g.fillStyle = '#b58a62'; g.beginPath(); g.ellipse(x + 22, y + 30, 8, 10, 0, 0, TAU); g.fill();
      g.fillStyle = '#e8d3b0'; g.font = '700 13px Cinzel, Georgia, serif'; g.textAlign = 'left'; g.fillText('FAYE', x + 42, y + 26);
      g.font = '600 10px Barlow, sans-serif'; g.fillText(months[i % 12] + ' ' + (2023 + Math.floor(i / 12)), x + 42, y + 44);
    }
  });
  const wallP = new THREE.Mesh(new THREE.PlaneGeometry(4.8, 3.2), new THREE.MeshLambertMaterial({ map: wallT, transparent: true }));
  wallP.position.set(-15.4, FY + 1.75, Z0 + 0.17); R.scene.add(wallP);
  // the blank plaque's world position (row 6, centred)
  H.blankPlaque = V3(-15.4, FY + 1.75 + 3.2 * (0.5 - (44 + 6 * 68.5 + 32) / 512), Z0 + 0.19);
  // the locker under the floor: chained, red glow, COMMISSION scratched into the lid
  const L = { x: -11.4, z: -93.4 };
  const lk = new GB().box(1.1, 0.5, 0.62, { pos: [L.x, G + 0.3, L.z], color: 0x2a2d30 });
  for (let i = 0; i < 3; i++) lk.torus(0.36, 0.022, 4, 14, { pos: [L.x - 0.35 + i * 0.35, G + 0.3, L.z], rot: [0, PI / 2, 0], scale: [1, 0.85, 1.05], color: 0x6b6f72 });
  const locker = lk.mesh(MATS.vcNoSnow); R.scene.add(locker);
  const seams = new GB().box(1.12, 0.02, 0.64, { pos: [L.x, G + 0.5, L.z], color: 0xffffff }).box(0.02, 0.45, 0.63, { pos: [L.x - 0.56, G + 0.3, L.z], color: 0xffffff }).mesh(MATS.redGlow, { cast: false });
  R.scene.add(seams);
  const lidT = textTex(128, 64, (g, w, h) => { g.clearRect(0, 0, w, h); g.strokeStyle = 'rgba(210,200,190,.8)'; g.lineWidth = 2; g.font = '700 20px Barlow, sans-serif'; g.textAlign = 'center'; g.strokeText('COMMISSION', w / 2, h / 2 + 7); });
  const lidText = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.45), new THREE.MeshBasicMaterial({ map: lidT, transparent: true, depthWrite: false }));
  lidText.rotation.x = -PI / 2; lidText.position.set(L.x, G + 0.556, L.z); R.scene.add(lidText);
  H.locker = V3(L.x, G + 0.3, L.z);
  // slatted light under the floor
  const shafts = new GB();
  for (let i = 0; i < 9; i++) shafts.box(0.02, 0.7, 0.9 + r() * 0.8, { pos: [-20 + i * 1.6 + r() * 0.4, G + 0.42, -92 + (r() - .5) * 4], rot: [0, 0, 0.1], color: 0xffb070 });
  const sm = shafts.mesh(new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.07, blending: THREE.AdditiveBlending, depthWrite: false }), { cast: false, receive: false });
  R.scene.add(sm);
  FLOORS.push(H.floor = { x0: X0, x1: X1 + 0.05, z0: Z0, z1: Z1, y: FY, active: true });
  mark('plaque', -15.4, Z0 + 0.95, PI, FY);
  mark('counter_back', -9.1, -95.1, -PI / 2, FY);
  mark('crawl', -8.3, -93.0, -PI / 2, G + 0.06);
}

// ---------- the yard ----------
function buildYard() {
  const gb = new GB(), r = mulberry32(88), Y = (x, z) => groundHeight(x, z);
  // woodpile with the staff roster carved into its beam
  const wp = { x: -15, z: -86.7 };
  for (let row = 0; row < 4; row++) for (let i = 0; i < 9; i++) gb.cyl(0.13, 0.13, 1.1, 6, { pos: [wp.x - 1.6 + i * 0.36 + (row % 2) * 0.18, Y(wp.x, wp.z) + 0.15 + row * 0.25, wp.z + 0.2], rot: [PI / 2, 0, 0], color: 0x6e4b33 });
  gb.box(3.8, 0.12, 0.2, { pos: [wp.x, Y(wp.x, wp.z) + 1.25, wp.z + 0.8], color: 0x5a3e2a });
  for (const dx of [-1.85, 1.85]) gb.box(0.14, 1.25, 0.14, { pos: [wp.x + dx, Y(wp.x, wp.z) + 0.62, wp.z + 0.8], color: 0x5a3e2a });
  // sled
  gb.box(0.6, 0.06, 1.6, { pos: [-9.5, Y(-9.5, -85.6) + 0.22, -85.6], rot: [0, 0.6, 0], color: 0x8a6143 });
  for (const s of [-0.26, 0.26]) gb.box(0.04, 0.2, 1.7, { pos: [-9.5 + s * Math.cos(0.6), Y(-9.5, -85.6) + 0.1, -85.6 - s * Math.sin(0.6)], rot: [0, 0.6, 0], color: 0x3a3a3a });
  // drying rack
  const dr = { x: -2, z: -97 };
  for (const dx of [-1.2, 1.2]) { gb.strut([dr.x + dx - 0.4, Y(dr.x, dr.z), dr.z], [dr.x + dx, Y(dr.x, dr.z) + 1.8, dr.z], 0.06, { color: 0x6e4b33, round: true }); gb.strut([dr.x + dx + 0.4, Y(dr.x, dr.z), dr.z], [dr.x + dx, Y(dr.x, dr.z) + 1.8, dr.z], 0.06, { color: 0x6e4b33, round: true }); }
  gb.strut([dr.x - 1.3, Y(dr.x, dr.z) + 1.75, dr.z], [dr.x + 1.3, Y(dr.x, dr.z) + 1.75, dr.z], 0.05, { color: 0x6e4b33, round: true });
  for (let i = 0; i < 4; i++) gb.box(0.35, 0.6, 0.02, { pos: [dr.x - 0.9 + i * 0.6, Y(dr.x, dr.z) + 1.42, dr.z], color: [0x1d2b4a, 0x0f6f73, 0x9b8f7e, 0x22325a][i] });
  // chopping stump (Chase sits here at the embers)
  const cs = { x: 12.2, z: -84.6 };
  gb.cyl(0.33, 0.38, 0.46, 9, { pos: [cs.x, Y(cs.x, cs.z) + 0.23, cs.z], color: 0x5a4030 });
  gb.cyl(0.3, 0.3, 0.02, 9, { pos: [cs.x, Y(cs.x, cs.z) + 0.465, cs.z], color: 0xc9a77a });
  addCollider({ x: cs.x, z: cs.z, r: 0.38, h: 0.5, tag: 'stump' });
  mark('stump', cs.x, cs.z, 0.9, Y(cs.x, cs.z) + 0.46);
  // esky by the door
  gb.box(0.7, 0.42, 0.42, { pos: [-4.4, Y(-4.4, -89.7) + 0.21, -89.7], color: 0x2a6fb5 });
  gb.box(0.72, 0.07, 0.44, { pos: [-4.4, Y(-4.4, -89.7) + 0.45, -89.7], color: 0xf0f0f0 });
  addCollider({ x0: -4.8, x1: -4.0, z0: -90, z1: -89.4, h: 0.5, tag: 'esky' });
  // fence by the pyre, with a post for Rue's slate
  const fz = -75.2;
  for (let i = 0; i < 4; i++) { const fx = 9.5 + i * 1.6; gb.box(0.12, 1.15, 0.12, { pos: [fx, Y(fx, fz) + 0.57, fz], color: 0x5a3e2a }); addCollider({ x: fx, z: fz, r: 0.12, h: 1.2 }); }
  gb.box(4.9, 0.08, 0.06, { pos: [11.9, Y(11.9, fz) + 0.85, fz], color: 0x6e4b33 });
  gb.box(4.9, 0.08, 0.06, { pos: [11.9, Y(11.9, fz) + 0.45, fz], color: 0x6e4b33 });
  mark('slate_post', 12.7, fz, PI, Y(12.7, fz) + 1.15);
  // phone-box lanterns
  OBJ.lanterns = [];
  for (const [lx, lz] of [[8.6, -63.5], [-3.2, -103.0], [10.6, -71.6]]) {
    const y = Y(lx, lz);
    gb.cyl(0.05, 0.06, 2.1, 5, { pos: [lx, y + 1.05, lz], color: 0x2c2f31 });
    gb.box(0.36, 0.56, 0.36, { pos: [lx, y + 2.38, lz], color: 0xc8291f });
    gb.box(0.42, 0.06, 0.42, { pos: [lx, y + 2.69, lz], color: 0xa82219 });
    OBJ.lanterns.push(V3(lx, y + 2.38, lz));
    addCollider({ x: lx, z: lz, r: 0.12, h: 2.5 });
  }
  const yard = gb.mesh(MATS.vc); R.scene.add(yard);
  const lglow = new GB(); OBJ.lanterns.forEach(p => lglow.box(0.38, 0.4, 0.38, { pos: [p.x, p.y, p.z], color: 0xffffff }));
  R.scene.add(lglow.mesh(MATS.yellowGlow, { cast: false }));
  // the staff roster
  const rosterT = textTex(512, 32, (g, w, h) => { g.fillStyle = '#4a3324'; g.fillRect(0, 0, w, h); g.fillStyle = '#d9c39a'; g.font = '700 15px Barlow, sans-serif'; drawLines(g, ['SAT: CHASE  ·  SUN: CHASE  ·  MON–FRI: LUKA  ·  ALWAYS: FAYE'], w / 2, h / 2 + 1, 0); });
  const roster = new THREE.Mesh(new THREE.PlaneGeometry(3.7, 0.12), new THREE.MeshLambertMaterial({ map: rosterT }));
  roster.position.set(wp.x, Y(wp.x, wp.z) + 1.25, wp.z + 0.911); R.scene.add(roster);
  addCollider({ x0: wp.x - 1.9, x1: wp.x + 1.9, z0: wp.z - 0.6, z1: wp.z + 0.9, h: 1.3, tag: 'woodpile' });
  // esky note
  const noteT = textTex(128, 64, (g, w, h) => { g.fillStyle = '#fbf6e4'; g.fillRect(0, 0, w, h); g.fillStyle = '#222'; g.font = 'italic 600 11px Barlow, sans-serif'; drawLines(g, ['WHOEVER ATE MY', 'YOGHURT — I KNOW.', '— Z.'], w / 2, 16, 15); });
  const note = new THREE.Mesh(new THREE.PlaneGeometry(0.26, 0.13), new THREE.MeshLambertMaterial({ map: noteT }));
  note.position.set(-4.4, Y(-4.4, -89.7) + 0.49, -89.7); note.rotation.x = -PI / 2; R.scene.add(note);
  // wind-chime phones in the birch by the door
  OBJ.chimes = [];
  for (let i = 0; i < 4; i++) {
    const g = new THREE.Group(); g.position.set(-4.2 + Math.cos(i * 1.6) * 0.9, Y(-4.2, -95.8) + 3.4, -95.8 + Math.sin(i * 1.6) * 0.9);
    g.add(new GB().box(0.005, 0.5, 0.005, { pos: [0, -0.25, 0], color: 0x222222 }).box(0.06, 0.12, 0.03, { pos: [0, -0.55, 0], color: [0x333333, 0x7a7a7a, 0x1e3a5a, 0x5a1e1e][i] }).mesh(MATS.vcNoSnow));
    R.scene.add(g); OBJ.chimes.push(g);
  }
  buildWard();
  buildPyre();
}

// ---------- the Faraday Ward ----------
function buildWard() {
  const C = LOC.ward, R0 = LOC.wardR, posts = [], gb = new GB();
  const word = [...'ᛟᛈᛏᚢᛊ'];
  const gates = [Math.atan2(6.2 - C.x, -62.5 - C.z), Math.atan2(-5.6 - C.x, -108.6 - C.z)];
  const N = 18;
  for (let i = 0; i < N; i++) {
    let a = i / N * TAU;
    if (gates.some(g => Math.abs(angleTo(a, g)) < 0.16)) continue;
    let x = C.x + Math.sin(a) * R0, z = C.z + Math.cos(a) * R0;
    const cx = cliffX(z) - 2.2; if (x > cx) x = cx;
    posts.push({ x, z, a });
  }
  for (const g of gates) for (const s of [-0.12, 0.12]) { const a = g + s; posts.push({ x: C.x + Math.sin(a) * R0, z: C.z + Math.cos(a) * R0, a, gate: true }); }
  posts.sort((p, q) => p.a - q.a);
  OBJ.wardPosts = [];
  posts.forEach((p, i) => {
    const y = groundHeight(p.x, p.z), h = p.gate ? 2.6 : 1.75;
    p.y = y; p.top = y + h - 0.12;
    gb.box(0.24, h, 0.24, { pos: [p.x, y + h / 2, p.z], rot: [0, p.a, 0], color: 0x5c4232, ao: 0.4, aoY0: y, aoY1: y + 1 });
    gb.box(0.3, 0.1, 0.3, { pos: [p.x, y + h, p.z], rot: [0, p.a + 0.785, 0], color: 0x4a3324 });
    for (let k = 0; k < 3; k++) gb.box(0.27, 0.04, 0.27, { pos: [p.x, y + 0.4 + k * 0.32, p.z], rot: [0, p.a, 0], color: 0x3a281b });
    addCollider({ x: p.x, z: p.z, r: 0.18, h, tag: 'ward' });
    // rune on the face toward the yard
    const rg = new GB(), m = new THREE.Matrix4().makeRotationY(p.a + PI).setPosition(p.x - Math.sin(p.a) * 0.125, y + h * 0.62, p.z - Math.cos(p.a) * 0.125);
    addRunes(rg, word[i % word.length], { size: 0.32, stroke: 0.035, matrix: m });
    const mat = MATS.rune.clone();
    const rm = rg.mesh(mat, { cast: false }); R.scene.add(rm);
    OBJ.wardPosts.push({ ...p, rune: rm, mat, alive: true });
  });
  // gate crossbeams
  for (const g of gates) {
    const a0 = g - 0.12, a1 = g + 0.12;
    const p0 = [C.x + Math.sin(a0) * R0, 0, C.z + Math.cos(a0) * R0], p1 = [C.x + Math.sin(a1) * R0, 0, C.z + Math.cos(a1) * R0];
    const y = Math.max(groundHeight(p0[0], p0[2]), groundHeight(p1[0], p1[2])) + 2.45;
    gb.strut([p0[0], y, p0[2]], [p1[0], y, p1[2]], 0.18, { color: 0x4a3324 });
  }
  R.scene.add(gb.mesh(MATS.vc));
  // copper wire, sagging between the post tops
  const wire = [];
  for (let i = 0; i < posts.length; i++) {
    const p = posts[i], q = posts[(i + 1) % posts.length];
    const a = V3(p.x, p.top, p.z), b = V3(q.x, q.top, q.z), mid = a.clone().lerp(b, 0.5); mid.y -= 0.18 + a.distanceTo(b) * 0.03;
    const geo = new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(a, mid, b), 12, 0.012, 4, false);
    wire.push(geo);
  }
  const wgb = new GB(); wire.forEach(g => wgb.add(g, { color: 0xc8743e }));
  const wm = new THREE.Mesh(wgb.build(), new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.35, metalness: 0.9 }));
  wm.castShadow = false; R.scene.add(wm);
  OBJ.ward = { alive: true, posts: OBJ.wardPosts };
}

// ---------- the pyre on the old display table ----------
function buildPyre() {
  const P = LOC.pyre, y = groundHeight(P.x, P.z);
  OBJ.pyreY = y;
  const g = new THREE.Group(); g.position.set(P.x, y, P.z); R.scene.add(g);
  const timber = new GB(), r = mulberry32(99);
  for (let layer = 0; layer < 5; layer++) {
    const along = layer % 2 === 0;
    for (let i = 0; i < 6; i++) {
      const o = -1.1 + i * 0.44 + (r() - .5) * 0.06;
      timber.box(0.17, 0.17, 2.7, { pos: along ? [o * 0.62, 0.1 + layer * 0.18, 0] : [0, 0.1 + layer * 0.18, o], rot: [0, along ? 0 : PI / 2, (r() - .5) * 0.08], color: r() < .5 ? 0x9a7656 : 0x7d5c41 });
    }
  }
  // the display-table frame: six device bays
  const frame = new GB();
  for (const [lx, lz] of [[-0.55, -1.15], [0.55, -1.15], [-0.55, 1.15], [0.55, 1.15]]) frame.box(0.08, 0.5, 0.08, { pos: [lx, 1.05, lz], color: 0xd8d8d0 });
  frame.box(1.25, 0.07, 2.45, { pos: [0, 1.32, 0], color: 0xe6e6de });
  for (let i = 0; i < 6; i++) frame.box(0.32, 0.02, 0.5, { pos: [i % 2 ? 0.27 : -0.27, 1.36, -0.75 + Math.floor(i / 2) * 0.75], color: 0x15191b });
  const timberMat = MATS.vc.clone(); timberMat.onBeforeCompile = MATS.vc.onBeforeCompile; timberMat.customProgramCacheKey = MATS.vc.customProgramCacheKey; timberMat.userData = MATS.vc.userData;
  const tm = timber.mesh(timberMat), fm = frame.mesh(timberMat);
  g.add(tm, fm);
  // candles
  const candles = new GB(); OBJ.candles = [];
  for (let i = 0; i < 12; i++) { const a = i / 12 * TAU, d = 1.9 + r() * 0.3, cx = Math.cos(a) * d * 0.7, cz = Math.sin(a) * d; const h = 0.14 + r() * 0.12; candles.cyl(0.035, 0.04, h, 6, { pos: [cx, h / 2, cz], color: 0xf1e8d2 }); OBJ.candles.push(V3(P.x + cx, y + h + 0.03, P.z + cz)); }
  g.add(candles.mesh(MATS.vcNoSnow, { cast: false }));
  // ember glow spots (revealed when the fire has burned down)
  const em = new GB(); for (let i = 0; i < 40; i++) em.box(0.08 + r() * 0.12, 0.03, 0.08 + r() * 0.12, { pos: [(r() - .5) * 1.4, 0.06 + r() * 0.12, (r() - .5) * 2.4], rot: [0, r() * 3, 0], color: 0xffffff });
  const embersMat = MATS.ember.clone(); embersMat.transparent = true; embersMat.opacity = 0;
  const emMesh = em.mesh(embersMat, { cast: false }); g.add(emMesh);
  OBJ.pyre = { group: g, timber: tm, frame: fm, mat: timberMat, embers: emMesh, embersMat, top: V3(P.x, y + 1.4, P.z), state: 'built' };
  addCollider({ x0: P.x - 0.8, x1: P.x + 0.8, z0: P.z - 1.4, z1: P.z + 1.4, h: 1.5, tag: 'pyre' });
  mark('pyre_luka', P.x - 1.85, P.z - 0.2, PI / 2);
  mark('pyre_chase', P.x - 2.4, P.z + 1.5, PI / 2 + 0.35);
  mark('pyre_luke', P.x - 1.3, P.z - 2.2, PI / 2 - 0.6);
  mark('pyre_zane', P.x - 2.6, P.z - 1.6, PI / 2 - 0.25);
  mark('pyre_head', P.x, P.z - 1.9, 0);
  mark('pyre_foot', P.x, P.z + 1.9, PI);
  mark('embers_luka', P.x - 1.25, P.z + 0.3, PI / 2);
}
function scorchPyre(k) { // 0 = fresh timber, 1 = burned down
  const P = OBJ.pyre; if (!P) return;
  P.mat.color.setRGB(lerp(1, 0.16, k), lerp(1, 0.13, k), lerp(1, 0.12, k));
  P.timber.scale.y = lerp(1, 0.38, k);
  P.frame.position.y = lerp(0, -0.55, k); P.frame.rotation.z = k * 0.06;
  P.embersMat.opacity = k;
}
