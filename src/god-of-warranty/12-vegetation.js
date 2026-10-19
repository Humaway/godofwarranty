// ================= WORLD: pines, birches, rocks =================
const PINE_GREENS = [0x1f3a2c, 0x24402f, 0x1b3327, 0x2a4634, 0x203b30];
function pineGeo(h, r, layers, seed, { trunkH = 0.36 } = {}) {
  const gb = new GB(), rr = mulberry32(seed);
  gb.cyl(r * 0.07, r * 0.12, h * trunkH, 5, { pos: [0, h * trunkH / 2, 0], color: 0x4a3526, ao: 0.4 });
  for (let i = 0; i < layers; i++) {
    const t = i / (layers - 1);
    const y0 = h * (0.16 + t * 0.6), lr = r * (1 - t * 0.8) * (0.9 + rr() * 0.2), lh = h * (0.36 - t * 0.12);
    gb.cone(lr, lh, 7, { pos: [rr() * 0.1, y0 + lh / 2, rr() * 0.1], rot: [0, rr() * TAU, 0], color: PINE_GREENS[i % PINE_GREENS.length], ao: 0.5, aoY0: y0, aoY1: y0 + lh * 0.9, jitter: 0.12 });
  }
  return gb.build();
}
function birchGeo(h, seed) {
  const gb = new GB(), r = mulberry32(seed);
  gb.cyl(0.07, 0.13, h, 6, { pos: [0, h / 2, 0], color: 0xe6e3da, uvScale: [1, 3] });
  for (let i = 0; i < 6; i++) {
    const y = h * (0.45 + r() * 0.45), a = r() * TAU, l = 0.8 + r() * 1.3;
    gb.strut([0, y, 0], [Math.cos(a) * l, y + l * 0.7, Math.sin(a) * l], 0.05, { color: 0x5a524a, round: true });
  }
  // a few sparse leafy clumps (autumn gold, frosted)
  for (let i = 0; i < 4; i++) gb.ico(0.6 + r() * 0.5, 0, { pos: [(r() - .5) * 1.8, h * (0.7 + r() * 0.3), (r() - .5) * 1.8], color: r() < .5 ? 0xb69a4c : 0x8c8a5a, jitter: 0.2 });
  return gb.build();
}
function deadTreeGeo(h, seed) {
  const gb = new GB(), r = mulberry32(seed);
  gb.cyl(0.12, 0.25, h, 6, { pos: [0, h / 2, 0], color: 0x5b5047 });
  const branch = (p, dir, len, th, depth) => {
    const e = [p[0] + dir[0] * len, p[1] + dir[1] * len, p[2] + dir[2] * len];
    gb.strut(p, e, th, { color: 0x5b5047, round: true, seg: 4 });
    if (depth > 0) for (let k = 0; k < 2; k++) {
      const nd = [dir[0] + (r() - .5) * 1.2, dir[1] + r() * 0.3, dir[2] + (r() - .5) * 1.2], l = Math.hypot(...nd);
      branch(e, nd.map(v => v / l), len * 0.65, th * 0.6, depth - 1);
    }
  };
  for (let i = 0; i < 4; i++) { const a = i * 1.7 + r(); branch([0, h * (0.55 + i * 0.1), 0], [Math.cos(a) * 0.8, 0.6, Math.sin(a) * 0.8], h * 0.3, 0.12, 2); }
  return gb.build();
}
function rockGeo(seed, s = 1) {
  const g = new THREE.IcosahedronGeometry(1, 1), r = mulberry32(seed), p = g.attributes.position;
  for (let i = 0; i < p.count; i++) { const k = 0.75 + r() * 0.45; p.setXYZ(i, p.getX(i) * k * 1.2, p.getY(i) * k * 0.7, p.getZ(i) * k); }
  g.computeVertexNormals();
  const gb = new GB(); gb.add(g, { scale: s, color: 0x707a80, jitter: 0.25 });
  return gb.build();
}

const VEG = { pines: [], birch: null, rocks: null };
function buildVegetation() {
  const variants = [pineGeo(12, 2.6, 5, 11), pineGeo(15, 3.0, 6, 23), pineGeo(9, 2.2, 4, 37), pineGeo(18, 3.4, 6, 41)];
  const spots = [[], [], [], []];
  const r = mulberry32(2024);
  const tryTree = (x, z, minWalk) => {
    const wd = walkDist(x, z);
    if (wd < minWalk) return false;
    if (x > cliffX(z) - 3) return false;
    if (Math.hypot(x - LOC.longhouse.x, z - LOC.longhouse.z) < 16) return false;
    const y = terrainHeight(x, z); if (y < 1) return false;
    const v = (r() * 4) | 0, s = 0.75 + r() * 0.55;
    spots[v].push([x, y - 0.2, z, r() * TAU, s]);
    if (wd < 6) addCollider({ x, z, r: 0.35 * s, h: 14, tag: 'tree' });
    return true;
  };
  // dense near the paths, sparser far away
  for (let x = TER.x0 + 4; x < TER.x0 + TER.w - 4; x += 5.2) for (let z = TER.z0 + 4; z < TER.z0 + TER.d - 4; z += 5.2) {
    const jx = x + (r() - .5) * 4.6, jz = z + (r() - .5) * 4.6;
    const wd = walkDist(jx, jz);
    const p = wd < 30 ? 0.86 : wd < 70 ? 0.6 : 0.42;
    if (r() < p) tryTree(jx, jz, 1.6 + r() * 1.5);
  }
  // the treeline frames the Zee shot: a few big boughs near the yard edge
  variants.forEach((g, i) => {
    const list = spots[i]; if (!list.length) return;
    const im = new THREE.InstancedMesh(g, MATS.pine, list.length);
    const m = new THREE.Matrix4(), q = new THREE.Quaternion(), s = V3(), p = V3(), c = new THREE.Color();
    list.forEach((t, k) => { p.set(t[0], t[1], t[2]); q.setFromAxisAngle(UP, t[3]); s.set(t[4], t[4] * (0.9 + (k % 5) * 0.05), t[4]); m.compose(p, q, s); im.setMatrixAt(k, m); c.setScalar(0.85 + ((k * 7919) % 100) / 100 * 0.3); im.setColorAt(k, c); });
    im.castShadow = true; im.receiveShadow = true; im.name = 'pines' + i; im.userData.spots = list;
    R.scene.add(im); VEG.pines.push(im);
  });
  VEG.treeCount = spots.reduce((a, l) => a + l.length, 0);

  // birches: Zee's clearing, the yard door, the grove
  const bg = [birchGeo(9, 3), birchGeo(11, 5), birchGeo(7.5, 9)];
  const bl = [[], [], []];
  const birchAt = (x, z) => { const y = terrainHeight(x, z); bl[(bl[0].length + bl[1].length + bl[2].length) % 3].push([x, y - 0.1, z, r() * TAU, 0.85 + r() * 0.3]); addCollider({ x, z, r: 0.18, h: 10, tag: 'tree' }); };
  for (let i = 0; i < 26; i++) { const a = r() * TAU, d = 10 + r() * 9; birchAt(LOC.zee.x + Math.cos(a) * d, LOC.zee.z + Math.sin(a) * d * 0.8); }
  for (let i = 0; i < 6; i++) { const a = r() * TAU, d = 9 + r() * 5; birchAt(LOC.grove.x + Math.cos(a) * d, LOC.grove.z + Math.sin(a) * d); }
  birchAt(-4.2, -95.8); // the wind-chime birch by the door
  bg.forEach((g, i) => {
    if (!bl[i].length) return;
    const im = new THREE.InstancedMesh(g, MATS.birch, bl[i].length), m = new THREE.Matrix4(), q = new THREE.Quaternion();
    bl[i].forEach((t, k) => { q.setFromAxisAngle(UP, t[3]); m.compose(V3(t[0], t[1], t[2]), q, V3(t[4], t[4], t[4])); im.setMatrixAt(k, m); });
    im.castShadow = true; im.receiveShadow = true; R.scene.add(im);
  });

  // boulders with moss on their north sides
  const rg = rockGeo(5, 1);
  const rocks = [];
  for (let i = 0; i < 140; i++) {
    const x = TER.x0 + 20 + r() * (TER.w - 40), z = TER.z0 + 20 + r() * (TER.d - 40), wd = walkDist(x, z);
    if (wd < -1 || wd > 26 || x > cliffX(z) - 2) continue;
    const s = 0.4 + r() * 1.3; rocks.push([x, terrainHeight(x, z) - s * 0.25, z, r() * TAU, s]);
    if (wd < 2) addCollider({ x, z, r: s * 1.0, h: s * 1.2, tag: 'rock' });
  }
  const rim = new THREE.InstancedMesh(rg, MATS.stone, rocks.length), m = new THREE.Matrix4(), q = new THREE.Quaternion();
  rocks.forEach((t, k) => { q.setFromAxisAngle(UP, t[3]); m.compose(V3(t[0], t[1], t[2]), q, V3(t[4], t[4], t[4])); rim.setMatrixAt(k, m); });
  rim.castShadow = true; rim.receiveShadow = true; R.scene.add(rim);
}

// hide the pines that stand in a long-lens sightline (a→b, plus the lens itself); returns the undo
function clearSightline(segs, r = 2.2) {
  const hidden = [], m = new THREE.Matrix4(), zero = new THREE.Matrix4().makeScale(0, 0, 0);
  const segD = (x, z, a, b) => { const dx = b.x - a.x, dz = b.z - a.z, L2 = dx * dx + dz * dz || 1, t = clamp01(((x - a.x) * dx + (z - a.z) * dz) / L2); return Math.hypot(x - a.x - dx * t, z - a.z - dz * t); };
  VEG.pines.forEach(im => {
    im.userData.spots.forEach((t, k) => {
      if (!segs.some(([a, b]) => segD(t[0], t[2], a, b) < r + t[4] * 1.6)) return;
      im.getMatrixAt(k, m); hidden.push([im, k, m.clone()]); im.setMatrixAt(k, zero); im.instanceMatrix.needsUpdate = true;
    });
  });
  return (VEG.undo = () => { VEG.undo = null; for (const [im, k, mm] of hidden) { im.setMatrixAt(k, mm); im.instanceMatrix.needsUpdate = true; } });
}
