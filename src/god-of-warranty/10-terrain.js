// ================= WORLD: terrain, walkable regions, collision =================
// Mid-Band Redcliffe (§9.1): north = −z, the frozen bay to the east (+x), the Mountain far south-west.

const LOC = {
  grove: V3(-22, 0, -176), markedTree: V3(-20.5, 0, -179.5),
  yard: V3(4, 0, -84), longhouse: V3(-14, 0, -92), door: V3(-5.6, 0, -92), pyre: V3(17, 0, -80),
  ward: V3(2, 0, -86), wardR: 24,
  kiosk: V3(-10, 0, -28), zee: V3(2, 0, 22), fork: V3(22, 0, 44),
  jarvis: V3(34, 0, 72), brothers: V3(46.5, 0, 90), shrine: V3(31, 0, 101), chime: V3(42, 0, 114),
  bridgehead: V3(48, 0, 146), deckX0: 55, deckX1: 112, deckZ0: 137, deckZ1: 155, deckY: 8,
  arena: V3(84, 8, 146), mountain: V3(-760, 0, 980), cable: V3(330, 0, -40),
};

// The walkable world is a union of circles and capsules (paths); trees fill everything else.
const WALK = [
  { c: [-22, -176], r: 13 },
  { a: [-22, -168], b: [-17, -142], r: 5 }, { a: [-17, -142], b: [-9, -116], r: 5 }, { a: [-9, -116], b: [-1, -103], r: 5 },
  { c: [3, -85], r: 25.5 },
  { a: [6, -62], b: [-1, -44], r: 4.2 }, { a: [-1, -44], b: [-8, -32], r: 4.2 },
  { c: [-10, -28], r: 8.5 },
  { a: [-8, -21], b: [-6, 0], r: 4.2 }, { a: [-6, 0], b: [0, 12], r: 4.2 },
  { c: [2, 22], r: 14 },
  { a: [11, 30], b: [22, 44], r: 4.2 }, { c: [22, 44], r: 6 }, { a: [22, 44], b: [33, 62], r: 4.2 },
  { a: [33, 62], b: [38, 80], r: 4.4 }, { c: [34, 72], r: 5 }, { a: [38, 80], b: [42, 98], r: 4.4 }, { c: [45.5, 90], r: 4 },
  { c: [32, 101], r: 4.5 }, { a: [42, 98], b: [45, 116], r: 4.4 }, { c: [42, 114], r: 5 }, { a: [45, 116], b: [47, 136], r: 4.6 },
  { c: [48, 146], r: 10 },
];
const DECK = { x0: LOC.deckX0, x1: LOC.deckX1, z0: LOC.deckZ0, z1: LOC.deckZ1, y: LOC.deckY };

function piecewise(pts, x) {
  if (x <= pts[0][0]) return pts[0][1];
  for (let i = 1; i < pts.length; i++) if (x <= pts[i][0]) { const [x0, y0] = pts[i - 1], [x1, y1] = pts[i]; return lerp(y0, y1, smoothstep(0, 1, (x - x0) / (x1 - x0))); }
  return pts[pts.length - 1][1];
}
const CLIFF_PTS = [[-260, 52], [-200, 47], [-150, 40], [-112, 31], [-80, 27.5], [-55, 30], [-20, 34], [20, 38], [60, 44], [95, 50], [125, 54], [146, 56], [175, 57], [215, 62]];
const MACRO_PTS = [[-260, 27], [-178, 22], [-140, 18.5], [-108, 14.6], [-60, 14.2], [-30, 13.2], [0, 12], [22, 11], [50, 11.6], [100, 11.4], [130, 10], [146, 8], [175, 8.5], [220, 10]];
function cliffX(z) { return piecewise(CLIFF_PTS, z) + Noise.n2(z * 0.045, 3.3) * 2.2 + Noise.n2(z * 0.19, 9.1) * 0.7; }
function creekZ(x) { return 22 + Math.sin(x * 0.11) * 2.2 + Noise.n2(x * 0.05, 4) * 1.5; }

function walkDist(x, z) { // signed distance to the walkable union (negative = inside)
  let d = 1e9;
  for (const w of WALK) {
    let dd;
    if (w.c) dd = Math.hypot(x - w.c[0], z - w.c[1]) - w.r;
    else {
      const ax = w.a[0], az = w.a[1], bx = w.b[0] - ax, bz = w.b[1] - az;
      const t = clamp01(((x - ax) * bx + (z - az) * bz) / (bx * bx + bz * bz));
      dd = Math.hypot(x - (ax + bx * t), z - (az + bz * t)) - w.r;
    }
    if (dd < d) d = dd;
  }
  const inDeck = x > DECK.x0 - 2 && x < DECK.x1 && z > DECK.z0 && z < DECK.z1;
  if (inDeck) d = Math.min(d, -Math.min(x - (DECK.x0 - 2), DECK.x1 - x, z - DECK.z0, DECK.z1 - z));
  return d;
}

function terrainFn(x, z) {
  const macro = piecewise(MACRO_PTS, z);
  const wd = walkDist(x, z);
  const calm = smoothstep(-2, 14, wd); // flatter where people walk
  let h = macro + Noise.fbm2(x * 0.013 + 3, z * 0.013 - 7, 4) * (1.2 + 5.5 * calm);
  h += Noise.fbm2(x * 0.06, z * 0.06, 2) * 0.35 * (0.3 + calm);
  h += Math.max(0, -x - 45) * 0.24 + Math.max(0, -z - 222) * 0.5 + Math.max(0, z - 180) * 0.45;
  // the yard is a level shelf
  const yd = Math.hypot(x - LOC.yard.x, z - LOC.yard.z);
  h = lerp(h, 14.2, 1 - smoothstep(18, 32, yd));
  // Zee's creek
  if (z > 5 && z < 40) { const cd = Math.abs(z - creekZ(x)); h -= 0.9 * (1 - smoothstep(1.2, 3.2, cd)) * smoothstep(-40, -20, x); }
  // red cliffs down to the bay
  const cx = cliffX(z);
  const t = smoothstep(cx - 1.2, cx + 7, x);
  const terr = Math.floor(t * 4) / 4 * 0.25 + t * 0.75; // a little terracing in the sandstone
  h = lerp(h, -0.8, Math.pow(terr, 0.85));
  return h;
}

const TER = { x0: -175, z0: -255, w: 320, d: 480, step: 2, nx: 0, nz: 0, h: null, mesh: null };
function buildTerrain() {
  TER.nx = Math.round(TER.w / TER.step) + 1; TER.nz = Math.round(TER.d / TER.step) + 1;
  TER.h = new Float32Array(TER.nx * TER.nz);
  for (let j = 0; j < TER.nz; j++) for (let i = 0; i < TER.nx; i++) TER.h[j * TER.nx + i] = terrainFn(TER.x0 + i * TER.step, TER.z0 + j * TER.step);
  const geo = new THREE.PlaneGeometry(TER.w, TER.d, TER.nx - 1, TER.nz - 1);
  geo.rotateX(-PI / 2);
  geo.translate(TER.x0 + TER.w / 2, 0, TER.z0 + TER.d / 2);
  const pos = geo.attributes.position, uv = geo.attributes.uv;
  for (let k = 0; k < pos.count; k++) {
    const x = pos.getX(k), z = pos.getZ(k);
    const i = Math.round((x - TER.x0) / TER.step), j = Math.round((z - TER.z0) / TER.step);
    pos.setY(k, TER.h[j * TER.nx + i]);
    uv.setXY(k, x / 5, z / 5);
  }
  geo.computeVertexNormals();
  const nrm = geo.attributes.normal, col = new Float32Array(pos.count * 3), c = new THREE.Color();
  const snowA = new THREE.Color(0xeef3f8), snowB = new THREE.Color(0xc9d6e6), path = new THREE.Color(0xb8c4d0), rock1 = new THREE.Color(0xb3542e), rock2 = new THREE.Color(0xd98a52), rock3 = new THREE.Color(0x7a3520), shore = new THREE.Color(0x9fb8c6);
  for (let k = 0; k < pos.count; k++) {
    const x = pos.getX(k), y = pos.getY(k), z = pos.getZ(k), ny = nrm.getY(k);
    const wd = walkDist(x, z);
    c.copy(snowA).lerp(snowB, clamp01(Noise.fbm2(x * 0.05, z * 0.05, 2) * 0.8 + 0.3) * 0.35);
    if (wd < 0) c.lerp(path, (1 - smoothstep(-3.5, 0, wd)) * 0.55 * (0.6 + 0.4 * Noise.n2(x * 0.3, z * 0.3)));
    const steep = 1 - smoothstep(0.55, 0.85, ny);
    if (steep > 0) {
      const band = Math.sin(y * 2.3 + Noise.n2(x * 0.1, z * 0.1) * 1.5) * 0.5 + 0.5;
      const rc = rock1.clone().lerp(band > 0.6 ? rock2 : rock3, Math.abs(band - 0.5) * 1.4);
      c.lerp(rc, steep);
    }
    if (y < 0.6) c.lerp(shore, 0.5);
    col[k * 3] = c.r; col[k * 3 + 1] = c.g; col[k * 3 + 2] = c.b;
  }
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  const m = new THREE.Mesh(geo, MATS.terrain);
  m.receiveShadow = true; m.castShadow = false;
  m.name = 'terrain';
  TER.mesh = m;
  R.scene.add(m);
}

function terrainHeight(x, z) {
  const fx = (x - TER.x0) / TER.step, fz = (z - TER.z0) / TER.step;
  const i = clamp(Math.floor(fx), 0, TER.nx - 2), j = clamp(Math.floor(fz), 0, TER.nz - 2);
  const tx = clamp01(fx - i), tz = clamp01(fz - j), n = TER.nx, H = TER.h;
  // match the PlaneGeometry triangulation (diagonal from (i, j+1) to (i+1, j))
  const h00 = H[j * n + i], h10 = H[j * n + i + 1], h01 = H[(j + 1) * n + i], h11 = H[(j + 1) * n + i + 1];
  if (tx + tz <= 1) return h00 + (h10 - h00) * tx + (h01 - h00) * tz;
  return h11 + (h01 - h11) * (1 - tx) + (h10 - h11) * (1 - tz);
}
// floors and decks override the terrain
const FLOORS = []; // { x0, x1, z0, z1, y, active }
function groundHeight(x, z) {
  for (let i = 0; i < FLOORS.length; i++) { const f = FLOORS[i]; if (f.active !== false && x >= f.x0 && x <= f.x1 && z >= f.z0 && z <= f.z1) return f.y; }
  if (x >= DECK.x0 - 1 && x <= DECK.x1 && z >= DECK.z0 - 0.5 && z <= DECK.z1 + 0.5) return DECK.y;
  return terrainHeight(x, z);
}

// ---- colliders: circles and axis-aligned boxes in XZ, in a spatial hash ----
const COL = { cell: 8, map: new Map(), list: [] };
function colKey(i, j) { return i * 73856093 ^ j * 19349663; }
function addCollider(c) {
  // c: { x, z, r } or { x0, x1, z0, z1 }, optional y0/y1 for camera tests, tag
  COL.list.push(c);
  const x0 = c.r != null ? c.x - c.r : c.x0, x1 = c.r != null ? c.x + c.r : c.x1, z0 = c.r != null ? c.z - c.r : c.z0, z1 = c.r != null ? c.z + c.r : c.z1;
  for (let i = Math.floor(x0 / COL.cell); i <= Math.floor(x1 / COL.cell); i++) for (let j = Math.floor(z0 / COL.cell); j <= Math.floor(z1 / COL.cell); j++) {
    const k = colKey(i, j); let a = COL.map.get(k); if (!a) COL.map.set(k, a = []); a.push(c);
  }
  return c;
}
function collidersNear(x, z) { return COL.map.get(colKey(Math.floor(x / COL.cell), Math.floor(z / COL.cell))) || []; }

const WORLD = {
  ready: false, walkMask: true,
  // push a moving body out of colliders and back inside the walkable world
  resolve(p, r = 0.4, { walk = true } = {}) {
    for (let pass = 0; pass < 2; pass++) {
      const near = collidersNear(p.x, p.z);
      for (let k = 0; k < near.length; k++) {
        const c = near[k]; if (c.off) continue;
        if (c.y1 != null && (p.y > c.y1 || p.y + 1.6 < (c.y0 || -99))) continue;
        if (c.r != null) {
          const dx = p.x - c.x, dz = p.z - c.z, d = Math.hypot(dx, dz), m = c.r + r;
          if (d < m && d > 1e-5) { p.x = c.x + dx / d * m; p.z = c.z + dz / d * m; }
        } else {
          const cx = clamp(p.x, c.x0, c.x1), cz = clamp(p.z, c.z0, c.z1);
          const dx = p.x - cx, dz = p.z - cz, d = Math.hypot(dx, dz);
          if (d < r) {
            if (d > 1e-5) { p.x = cx + dx / d * r; p.z = cz + dz / d * r; }
            else { // inside: exit by the nearest face
              const ex = [p.x - c.x0, c.x1 - p.x, p.z - c.z0, c.z1 - p.z], m = Math.min(...ex);
              if (m === ex[0]) p.x = c.x0 - r; else if (m === ex[1]) p.x = c.x1 + r; else if (m === ex[2]) p.z = c.z0 - r; else p.z = c.z1 + r;
            }
          }
        }
      }
    }
    if (walk && this.walkMask) {
      const d = walkDist(p.x, p.z) + r;
      if (d > 0) {
        // step back along the gradient
        const e = 0.25, gx = walkDist(p.x + e, p.z) - walkDist(p.x - e, p.z), gz = walkDist(p.x, p.z + e) - walkDist(p.x, p.z - e), gl = Math.hypot(gx, gz) || 1;
        p.x -= gx / gl * d; p.z -= gz / gl * d;
      }
      // never past the cliff edge (except on the deck)
      const onDeck = p.x > DECK.x0 - 2 && p.z > DECK.z0 && p.z < DECK.z1;
      if (!onDeck) { const cx = cliffX(p.z) - 1.6; if (p.x > cx) p.x = cx; }
      if (onDeck) { p.z = clamp(p.z, DECK.z0 + 0.9, DECK.z1 - 0.9); p.x = Math.min(p.x, DECK.x1 - 1.2); }
    }
    return p;
  },
  blocksCamera(x, y, z, r) {
    const near = collidersNear(x, z);
    for (let k = 0; k < near.length; k++) {
      const c = near[k]; if (c.off || c.noCam) continue;
      const top = c.y1 != null ? c.y1 : groundHeight(x, z) + (c.h || 3);
      if (y > top || (c.y0 != null && y < c.y0)) continue;
      if (c.r != null) { if (Math.hypot(x - c.x, z - c.z) < c.r + r) return true; }
      else if (x > c.x0 - r && x < c.x1 + r && z > c.z0 - r && z < c.z1 + r) return true;
    }
    return false;
  },
};
