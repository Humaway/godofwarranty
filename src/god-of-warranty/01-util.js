// ================= UTIL =================
const PI = Math.PI, TAU = Math.PI * 2, DEG = Math.PI / 180;
const clamp = (x, a, b) => x < a ? a : x > b ? b : x;
const clamp01 = x => x < 0 ? 0 : x > 1 ? 1 : x;
const lerp = (a, b, t) => a + (b - a) * t;
const invLerp = (a, b, x) => clamp01((x - a) / (b - a));
const smoothstep = (a, b, x) => { const t = clamp01((x - a) / (b - a)); return t * t * (3 - 2 * t); };
const smootherstep = t => { t = clamp01(t); return t * t * t * (t * (t * 6 - 15) + 10); };
const damp = (a, b, lambda, dt) => lerp(a, b, 1 - Math.exp(-lambda * dt));
const wrapAngle = a => { a = (a + PI) % TAU; if (a < 0) a += TAU; return a - PI; };
const angleTo = (a, b) => wrapAngle(b - a);
const dampAngle = (a, b, lambda, dt) => a + angleTo(a, b) * (1 - Math.exp(-lambda * dt));
const sign = x => x < 0 ? -1 : 1;
const EASE = {
  linear: t => t,
  inSine: t => 1 - Math.cos(t * PI / 2), outSine: t => Math.sin(t * PI / 2), inOutSine: t => -(Math.cos(PI * t) - 1) / 2,
  inQuad: t => t * t, outQuad: t => 1 - (1 - t) * (1 - t), inOutQuad: t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2,
  inCubic: t => t * t * t, outCubic: t => 1 - Math.pow(1 - t, 3), inOutCubic: t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  outBack: t => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); },
  outExpo: t => t === 1 ? 1 : 1 - Math.pow(2, -10 * t), inExpo: t => t === 0 ? 0 : Math.pow(2, 10 * t - 10),
  smoother: smootherstep,
};

// --- RNG ---
function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
let rand = mulberry32(1337);
const rnd = (a = 0, b = 1) => a + (b - a) * rand();
const rndi = (a, b) => Math.floor(rnd(a, b + 1));
const pick = arr => arr[Math.floor(rand() * arr.length)];
const frand = Math.random; // non-deterministic cosmetics

// --- Simplex noise (2D/3D), compact implementation ---
const Noise = (() => {
  const grad3 = new Float32Array([1,1,0,-1,1,0,1,-1,0,-1,-1,0,1,0,1,-1,0,1,1,0,-1,-1,0,-1,0,1,1,0,-1,1,0,1,-1,0,-1,-1]);
  const perm = new Uint8Array(512), permMod12 = new Uint8Array(512);
  const r = mulberry32(9001), p = new Uint8Array(256);
  for (let i = 0; i < 256; i++) p[i] = i;
  for (let i = 255; i > 0; i--) { const j = Math.floor(r() * (i + 1)); const t = p[i]; p[i] = p[j]; p[j] = t; }
  for (let i = 0; i < 512; i++) { perm[i] = p[i & 255]; permMod12[i] = perm[i] % 12; }
  const F2 = 0.5 * (Math.sqrt(3) - 1), G2 = (3 - Math.sqrt(3)) / 6, F3 = 1 / 3, G3 = 1 / 6;
  function n2(xin, yin) {
    let n0 = 0, n1 = 0, n2 = 0;
    const s = (xin + yin) * F2, i = Math.floor(xin + s), j = Math.floor(yin + s), t = (i + j) * G2;
    const x0 = xin - (i - t), y0 = yin - (j - t);
    let i1, j1; if (x0 > y0) { i1 = 1; j1 = 0; } else { i1 = 0; j1 = 1; }
    const x1 = x0 - i1 + G2, y1 = y0 - j1 + G2, x2 = x0 - 1 + 2 * G2, y2 = y0 - 1 + 2 * G2;
    const ii = i & 255, jj = j & 255;
    let t0 = 0.5 - x0 * x0 - y0 * y0;
    if (t0 >= 0) { const gi = permMod12[ii + perm[jj]] * 3; t0 *= t0; n0 = t0 * t0 * (grad3[gi] * x0 + grad3[gi + 1] * y0); }
    let t1 = 0.5 - x1 * x1 - y1 * y1;
    if (t1 >= 0) { const gi = permMod12[ii + i1 + perm[jj + j1]] * 3; t1 *= t1; n1 = t1 * t1 * (grad3[gi] * x1 + grad3[gi + 1] * y1); }
    let t2 = 0.5 - x2 * x2 - y2 * y2;
    if (t2 >= 0) { const gi = permMod12[ii + 1 + perm[jj + 1]] * 3; t2 *= t2; n2 = t2 * t2 * (grad3[gi] * x2 + grad3[gi + 1] * y2); }
    return 70 * (n0 + n1 + n2);
  }
  function n3(xin, yin, zin) {
    let n0, n1, n2, n3;
    const s = (xin + yin + zin) * F3, i = Math.floor(xin + s), j = Math.floor(yin + s), k = Math.floor(zin + s);
    const t = (i + j + k) * G3, x0 = xin - (i - t), y0 = yin - (j - t), z0 = zin - (k - t);
    let i1, j1, k1, i2, j2, k2;
    if (x0 >= y0) { if (y0 >= z0) { i1=1;j1=0;k1=0;i2=1;j2=1;k2=0; } else if (x0 >= z0) { i1=1;j1=0;k1=0;i2=1;j2=0;k2=1; } else { i1=0;j1=0;k1=1;i2=1;j2=0;k2=1; } }
    else { if (y0 < z0) { i1=0;j1=0;k1=1;i2=0;j2=1;k2=1; } else if (x0 < z0) { i1=0;j1=1;k1=0;i2=0;j2=1;k2=1; } else { i1=0;j1=1;k1=0;i2=1;j2=1;k2=0; } }
    const x1 = x0 - i1 + G3, y1 = y0 - j1 + G3, z1 = z0 - k1 + G3, x2 = x0 - i2 + 2 * G3, y2 = y0 - j2 + 2 * G3, z2 = z0 - k2 + 2 * G3;
    const x3 = x0 - 1 + 3 * G3, y3 = y0 - 1 + 3 * G3, z3 = z0 - 1 + 3 * G3;
    const ii = i & 255, jj = j & 255, kk = k & 255;
    let t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
    if (t0 < 0) n0 = 0; else { const gi = permMod12[ii + perm[jj + perm[kk]]] * 3; t0 *= t0; n0 = t0 * t0 * (grad3[gi] * x0 + grad3[gi + 1] * y0 + grad3[gi + 2] * z0); }
    let t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
    if (t1 < 0) n1 = 0; else { const gi = permMod12[ii + i1 + perm[jj + j1 + perm[kk + k1]]] * 3; t1 *= t1; n1 = t1 * t1 * (grad3[gi] * x1 + grad3[gi + 1] * y1 + grad3[gi + 2] * z1); }
    let t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
    if (t2 < 0) n2 = 0; else { const gi = permMod12[ii + i2 + perm[jj + j2 + perm[kk + k2]]] * 3; t2 *= t2; n2 = t2 * t2 * (grad3[gi] * x2 + grad3[gi + 1] * y2 + grad3[gi + 2] * z2); }
    let t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
    if (t3 < 0) n3 = 0; else { const gi = permMod12[ii + 1 + perm[jj + 1 + perm[kk + 1]]] * 3; t3 *= t3; n3 = t3 * t3 * (grad3[gi] * x3 + grad3[gi + 1] * y3 + grad3[gi + 2] * z3); }
    return 32 * (n0 + n1 + n2 + n3);
  }
  function fbm2(x, y, oct = 4) { let a = 0, f = 1, amp = 0.5, n = 0; for (let i = 0; i < oct; i++) { a += amp * n2(x * f, y * f); n += amp; f *= 2.03; amp *= 0.5; } return a / n; }
  function fbm1(t, seed = 0, oct = 3) { let a = 0, f = 1, amp = 0.5, n = 0; for (let i = 0; i < oct; i++) { a += amp * n2(t * f, seed + i * 17.3); n += amp; f *= 2.1; amp *= 0.5; } return a / n; }
  return { n2, n3, fbm2, fbm1 };
})();

// --- Springs: a = -2ζω·v - ω²·(x - target), semi-implicit, substepped ---
class Spring1 {
  constructor({ omega = 4, zeta = 1, x = 0 } = {}) { this.omega = omega; this.zeta = zeta; this.x = x; this.v = 0; this.target = x; }
  step(dt) {
    const n = Math.max(1, Math.ceil(dt / (1 / 120))), h = dt / n, w = this.omega, z = this.zeta;
    for (let i = 0; i < n; i++) { const a = -2 * z * w * this.v - w * w * (this.x - this.target); this.v += a * h; this.x += this.v * h; }
    return this.x;
  }
  snap(x) { this.x = this.target = x; this.v = 0; }
}
class Spring3 {
  constructor({ omega = 4, zeta = 1 } = {}) { this.omega = omega; this.zeta = zeta; this.x = new THREE.Vector3(); this.v = new THREE.Vector3(); this.target = new THREE.Vector3(); }
  step(dt) {
    const n = Math.max(1, Math.ceil(dt / (1 / 120))), h = dt / n, w = this.omega, z = this.zeta, x = this.x, v = this.v, t = this.target;
    for (let i = 0; i < n; i++) {
      v.x += (-2 * z * w * v.x - w * w * (x.x - t.x)) * h; v.y += (-2 * z * w * v.y - w * w * (x.y - t.y)) * h; v.z += (-2 * z * w * v.z - w * w * (x.z - t.z)) * h;
      x.x += v.x * h; x.y += v.y * h; x.z += v.z * h;
    }
    return x;
  }
  snap(p) { this.x.copy(p); this.target.copy(p); this.v.set(0, 0, 0); }
}

// --- temp vector pools (no allocation in the loop) ---
const _v = Array.from({ length: 24 }, () => new THREE.Vector3());
const _q = Array.from({ length: 6 }, () => new THREE.Quaternion());
const _m = Array.from({ length: 4 }, () => new THREE.Matrix4());
const _e = new THREE.Euler();
const V3 = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
const UP = new THREE.Vector3(0, 1, 0);
const dist2D = (a, b) => Math.hypot(a.x - b.x, a.z - b.z);
const yawTo = (from, to) => Math.atan2(to.x - from.x, to.z - from.z);
const fwdFromYaw = (yaw, out = new THREE.Vector3()) => out.set(Math.sin(yaw), 0, Math.cos(yaw));

// --- storage (always wrapped; the game works without it) ---
const Store = {
  get(k, d) { try { const v = localStorage.getItem('gow.' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem('gow.' + k, JSON.stringify(v)); } catch (e) { /* no storage */ } },
  del(k) { try { localStorage.removeItem('gow.' + k); } catch (e) { /* no storage */ } },
};

const $ = id => document.getElementById(id);
const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// Abortable game-time promises (the director's clock). A story run is cancelled by bumping RUN.id.
const RUN = { id: 0 };
class Abort extends Error { constructor() { super('abort'); this.isAbort = true; } }
