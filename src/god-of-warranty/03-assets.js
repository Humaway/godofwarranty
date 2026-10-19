// ================= ASSETS =================
// Everything is generated at boot: canvas textures (32–128 px, small palettes), geometry builders, rune strokes.

const U = { // shared uniforms (one object, referenced by every patched material)
  time: { value: 0 }, wind: { value: new THREE.Vector2(0.6, 0.25) }, gust: { value: 0 },
  snowColor: { value: new THREE.Color(0.86, 0.9, 0.96) }, sparkle: { value: 1 }, wobble: { value: 0 },
};

// ---------- canvas textures ----------
function canvasTex(w, h, draw, { repeat = false, nearest = true, srgb = true } = {}) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const g = c.getContext('2d'); draw(g, w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  t.magFilter = nearest && SETTINGS.filtering === 'crisp' ? THREE.NearestFilter : THREE.LinearFilter;
  t.minFilter = THREE.LinearMipmapLinearFilter; t.generateMipmaps = true;
  t.anisotropy = 4;
  if (repeat) t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.userData.canvas = c;
  return t;
}
function noiseFill(g, w, h, base, vary, r = mulberry32(5)) {
  const img = g.getImageData(0, 0, w, h), d = img.data;
  const [br, bg, bb] = base;
  for (let i = 0; i < w * h; i++) { const n = (r() - 0.5) * vary; d[i * 4] = clamp(br + n, 0, 255); d[i * 4 + 1] = clamp(bg + n, 0, 255); d[i * 4 + 2] = clamp(bb + n, 0, 255); d[i * 4 + 3] = 255; }
  g.putImageData(img, 0, 0);
}
const TEX = {};
function buildTextures() {
  TEX.bark = canvasTex(32, 64, (g, w, h) => {
    noiseFill(g, w, h, [74, 52, 38], 26);
    const r = mulberry32(3);
    for (let i = 0; i < 14; i++) { g.fillStyle = `rgba(${r() < .5 ? '30,20,14' : '110,82,60'},${0.5 + r() * 0.4})`; const x = r() * w; g.fillRect(x, 0, 1 + r() * 2, h); }
    for (let i = 0; i < 10; i++) { g.fillStyle = 'rgba(20,14,10,.6)'; g.fillRect(r() * w, r() * h, 3 + r() * 5, 1); }
  }, { repeat: true });
  TEX.birch = canvasTex(32, 64, (g, w, h) => {
    noiseFill(g, w, h, [222, 220, 212], 18);
    const r = mulberry32(8);
    for (let i = 0; i < 18; i++) { g.fillStyle = `rgba(30,28,26,${0.55 + r() * .4})`; g.fillRect(r() * w, r() * h, 3 + r() * 9, 1 + (r() < .3 ? 1 : 0)); }
  }, { repeat: true });
  TEX.logs = canvasTex(64, 64, (g, w, h) => {
    for (let y = 0; y < h; y += 8) {
      const grd = g.createLinearGradient(0, y, 0, y + 8); grd.addColorStop(0, '#6e4b33'); grd.addColorStop(0.45, '#8a6143'); grd.addColorStop(1, '#3d2919');
      g.fillStyle = grd; g.fillRect(0, y, w, 8);
    }
    const r = mulberry32(11);
    for (let i = 0; i < 40; i++) { g.fillStyle = 'rgba(40,26,16,.5)'; g.fillRect(r() * w, (r() * 8 | 0) * 8 + 3, 4 + r() * 12, 1); }
    for (let x = 0; x < w; x += 32) { g.fillStyle = 'rgba(25,16,10,.5)'; g.fillRect(x + (r() * 6 | 0), 0, 1, h); }
  }, { repeat: true });
  TEX.planks = canvasTex(64, 64, (g, w, h) => {
    const r = mulberry32(12);
    for (let x = 0; x < w; x += 8) { const c = 80 + r() * 30; g.fillStyle = `rgb(${c},${c * 0.72 | 0},${c * 0.5 | 0})`; g.fillRect(x, 0, 8, h); g.fillStyle = 'rgba(20,12,6,.6)'; g.fillRect(x, 0, 1, h); }
    for (let i = 0; i < 30; i++) { g.fillStyle = 'rgba(40,25,14,.35)'; g.fillRect(r() * w, r() * h, 1, 4 + r() * 10); }
  }, { repeat: true });
  TEX.concrete = canvasTex(64, 64, (g, w, h) => {
    noiseFill(g, w, h, [128, 132, 134], 30);
    const r = mulberry32(13);
    for (let i = 0; i < 12; i++) { g.strokeStyle = 'rgba(50,52,54,.6)'; g.beginPath(); let x = r() * w, y = r() * h; g.moveTo(x, y); for (let k = 0; k < 4; k++) { x += (r() - .5) * 14; y += (r() - .5) * 14; g.lineTo(x, y); } g.stroke(); }
    for (let i = 0; i < 6; i++) { g.fillStyle = 'rgba(110,70,40,.35)'; g.fillRect(r() * w, r() * h, 2 + r() * 6, 8 + r() * 20); }
  }, { repeat: true });
  TEX.stone = canvasTex(64, 64, (g, w, h) => { noiseFill(g, w, h, [104, 108, 112], 36); }, { repeat: true });
  TEX.snow = canvasTex(64, 64, (g, w, h) => {
    noiseFill(g, w, h, [236, 240, 246], 14);
    const r = mulberry32(14);
    for (let i = 0; i < 40; i++) { g.fillStyle = `rgba(190,205,225,${r() * .35})`; g.beginPath(); g.arc(r() * w, r() * h, 1 + r() * 4, 0, TAU); g.fill(); }
  }, { repeat: true });
  TEX.ice = canvasTex(128, 128, (g, w, h) => {
    const grd = g.createLinearGradient(0, 0, w, h); grd.addColorStop(0, '#6f9fb3'); grd.addColorStop(1, '#4f7f95'); g.fillStyle = grd; g.fillRect(0, 0, w, h);
    const r = mulberry32(15);
    for (let i = 0; i < 80; i++) { g.fillStyle = `rgba(230,245,255,${r() * .25})`; g.fillRect(r() * w, r() * h, 1 + r() * 18, 1); }
    g.strokeStyle = 'rgba(220,240,255,.45)'; g.lineWidth = 1;
    for (let i = 0; i < 14; i++) { g.beginPath(); let x = r() * w, y = r() * h; g.moveTo(x, y); for (let k = 0; k < 6; k++) { x += (r() - .5) * 30; y += (r() - .5) * 30; g.lineTo(x, y); } g.stroke(); }
  }, { repeat: true });
  TEX.wool = canvasTex(32, 32, (g, w, h) => {
    noiseFill(g, w, h, [200, 200, 200], 40);
    for (let y = 0; y < h; y += 2) { g.fillStyle = 'rgba(0,0,0,.08)'; g.fillRect(0, y, w, 1); }
  }, { repeat: true });
  TEX.fur = canvasTex(32, 32, (g, w, h) => {
    noiseFill(g, w, h, [200, 196, 186], 70);
    const r = mulberry32(21);
    for (let i = 0; i < 60; i++) { g.fillStyle = `rgba(255,255,255,${r() * .3})`; g.fillRect(r() * w, r() * h, 1, 3 + r() * 4); }
  }, { repeat: true });
  TEX.fleece = canvasTex(64, 64, (g, w, h) => { // shroud stitched from navy and teal staff fleeces
    const r = mulberry32(22), cols = ['#1d2b4a', '#16244a', '#0f6f73', '#13878a', '#22325a', '#0c5b60'];
    for (let y = 0; y < h; y += 16) for (let x = 0; x < w; x += 16) { g.fillStyle = cols[(r() * cols.length) | 0]; g.fillRect(x, y, 16, 16); }
    g.strokeStyle = 'rgba(230,230,210,.55)'; g.setLineDash([2, 2]);
    for (let y = 0; y <= h; y += 16) { g.beginPath(); g.moveTo(0, y + .5); g.lineTo(w, y + .5); g.stroke(); }
    for (let x = 0; x <= w; x += 16) { g.beginPath(); g.moveTo(x + .5, 0); g.lineTo(x + .5, h); g.stroke(); }
    g.fillStyle = 'rgba(255,207,31,.75)'; g.font = 'bold 7px sans-serif'; g.fillText('yes', 20, 27);
  }, { repeat: true });
  TEX.cardboard = canvasTex(32, 32, (g, w, h) => { noiseFill(g, w, h, [176, 134, 88], 22); g.fillStyle = 'rgba(90,60,30,.4)'; g.fillRect(0, 14, w, 3); }, { repeat: true });
  TEX.rock = canvasTex(64, 64, (g, w, h) => {
    const r = mulberry32(31);
    for (let y = 0; y < h; y++) { const band = Math.sin(y * 0.45 + Math.sin(y * 0.13) * 2) * 0.5 + 0.5; const c = [168 + band * 40, 74 + band * 30, 44 + band * 16]; g.fillStyle = `rgb(${c[0] | 0},${c[1] | 0},${c[2] | 0})`; g.fillRect(0, y, w, 1); }
    for (let i = 0; i < 200; i++) { g.fillStyle = `rgba(${r() < .5 ? '60,24,14' : '230,170,120'},${r() * .3})`; g.fillRect(r() * w, r() * h, 1 + r() * 3, 1); }
  }, { repeat: true });
}

// text → canvas texture (signage, tickets, badges)
function textTex(w, h, draw) { return canvasTex(w, h, draw, { nearest: false }); }
function drawLines(g, lines, x, y, lh, align = 'center') { g.textAlign = align; g.textBaseline = 'middle'; lines.forEach((l, i) => g.fillText(l, x, y + i * lh)); }

// ---------- materials ----------
const MATS = {};
function patchWorld(mat, { snow = 0, sway = 0, swayH = 10, sparkle = false, wobble = false } = {}) {
  mat.userData.snow = { value: snow };
  mat.userData.swayAmt = { value: sway };
  const key = `w${snow > 0 ? 1 : 0}${sway > 0 ? 1 : 0}${sparkle ? 1 : 0}${swayH}`;
  mat.customProgramCacheKey = () => key + mat.type;
  mat.onBeforeCompile = (sh) => {
    sh.uniforms.uTime = U.time; sh.uniforms.uWind = U.wind; sh.uniforms.uGust = U.gust; sh.uniforms.uSnowColor = U.snowColor;
    sh.uniforms.uSnow = mat.userData.snow; sh.uniforms.uSwayAmt = mat.userData.swayAmt; sh.uniforms.uSparkle = U.sparkle; sh.uniforms.uWobble = U.wobble;
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', `#include <common>
        uniform float uTime, uGust, uSwayAmt, uWobble; uniform vec2 uWind; varying vec3 vSnowN; varying vec3 vSnowW;`)
      .replace('#include <begin_vertex>', `#include <begin_vertex>
        ${sway > 0 ? `{
          float hh = max(position.y, 0.0) / ${swayH.toFixed(1)};
          vec2 ip = vec2(0.0);
          #ifdef USE_INSTANCING
            ip = instanceMatrix[3].xz;
          #endif
          float ph = dot(ip, vec2(0.13, 0.17));
          float s = sin(uTime * 1.3 + ph) * 0.6 + sin(uTime * 2.9 + ph * 1.7) * 0.22;
          transformed.xz += uWind * (s * 0.5 + uGust * 1.4) * hh * hh * uSwayAmt;
        }` : ''}`)
      .replace('#include <defaultnormal_vertex>', `#include <defaultnormal_vertex>
        vSnowN = inverseTransformDirection(transformedNormal, viewMatrix);`)
      .replace('#include <project_vertex>', `#include <project_vertex>
        { vec4 swp = vec4(transformed, 1.0);
          #ifdef USE_INSTANCING
            swp = instanceMatrix * swp;
          #endif
          vSnowW = (modelMatrix * swp).xyz; }
        ${wobble ? 'if (uWobble > 0.5) { gl_Position.xy = floor(gl_Position.xy / gl_Position.w * 120.0) / 120.0 * gl_Position.w; }' : ''}`);
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', `#include <common>
        uniform vec3 uSnowColor; uniform float uSnow, uSparkle, uTime; varying vec3 vSnowN; varying vec3 vSnowW;
        float sHash(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * .1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
        float sNoise(vec2 p){ vec2 i = floor(p), f = fract(p); vec2 u = f*f*(3.-2.*f);
          return mix(mix(sHash(i), sHash(i+vec2(1,0)), u.x), mix(sHash(i+vec2(0,1)), sHash(i+vec2(1,1)), u.x), u.y); }`)
      .replace('#include <color_fragment>', `#include <color_fragment>
        float snowAmt = 0.0;
        if (uSnow > 0.0) {
          float sn = sNoise(vSnowW.xz * 0.9) * 0.6 + sNoise(vSnowW.xz * 3.7) * 0.4;
          snowAmt = smoothstep(0.42, 0.78, normalize(vSnowN).y + (sn - 0.5) * 0.45) * uSnow;
          diffuseColor.rgb = mix(diffuseColor.rgb, uSnowColor, snowAmt);
        }`)
      .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
        ${sparkle ? `{ float g = sHash(floor(vSnowW.xz * 26.0) + floor(cameraPosition.xz * 1.7 + vSnowW.y));
          totalEmissiveRadiance += vec3(1.6, 1.7, 1.9) * step(0.9965, g) * snowAmt * uSparkle; }` : ''}`);
  };
  return mat;
}
function lambert(opts = {}, patch) {
  const m = new THREE.MeshLambertMaterial(opts);
  if (patch) patchWorld(m, patch);
  return m;
}
function basic(opts = {}) { return new THREE.MeshBasicMaterial(opts); }
function glow(r, g, b, opts = {}) { const m = new THREE.MeshBasicMaterial({ ...opts }); m.color.setRGB(r, g, b); m.toneMapped = false; return m; }

function buildMaterials() {
  MATS.vc = lambert({ vertexColors: true }, { snow: 1, sparkle: true, wobble: true });            // generic world props, snow on top
  MATS.vcNoSnow = lambert({ vertexColors: true }, { snow: 0, wobble: true });                      // interiors, characters' props
  MATS.vcDouble = lambert({ vertexColors: true, side: THREE.DoubleSide }, { snow: 0.7 });
  MATS.pine = lambert({ vertexColors: true }, { snow: 1, sway: 1, swayH: 12, sparkle: true });
  MATS.bark = lambert({ map: TEX.bark, vertexColors: true }, { snow: 0.6 });
  MATS.birch = lambert({ map: TEX.birch, vertexColors: true }, { snow: 0.5, sway: 0.5, swayH: 10 });
  MATS.logs = lambert({ map: TEX.logs, vertexColors: true }, { snow: 1, sparkle: true });
  MATS.logsIn = lambert({ map: TEX.logs, vertexColors: true }, { snow: 0 });
  MATS.planks = lambert({ map: TEX.planks, vertexColors: true }, { snow: 1 });
  MATS.planksIn = lambert({ map: TEX.planks, vertexColors: true }, { snow: 0 });
  MATS.concrete = lambert({ map: TEX.concrete, vertexColors: true }, { snow: 1, sparkle: true });
  MATS.stone = lambert({ map: TEX.stone, vertexColors: true }, { snow: 1, sparkle: true });
  MATS.rock = lambert({ map: TEX.rock, vertexColors: true }, { snow: 1 });
  MATS.terrain = lambert({ vertexColors: true, map: TEX.snow }, { snow: 0, sparkle: true });
  MATS.ice = new THREE.MeshStandardMaterial({ map: TEX.ice, roughness: 0.18, metalness: 0.0, color: 0x9cc6d8 });
  MATS.wool = lambert({ map: TEX.wool, vertexColors: true, side: THREE.DoubleSide }, { snow: 0.25 });
  MATS.fur = lambert({ map: TEX.fur, vertexColors: true }, { snow: 0.2 });
  MATS.fleece = lambert({ map: TEX.fleece, vertexColors: true }, { snow: 0.15 });
  MATS.cardboard = lambert({ map: TEX.cardboard, vertexColors: true }, { snow: 0.4 });
  MATS.copper = new THREE.MeshStandardMaterial({ color: 0xc8743e, roughness: 0.35, metalness: 0.9 });
  MATS.steel = new THREE.MeshStandardMaterial({ color: 0x5e676d, roughness: 0.4, metalness: 0.85 });
  MATS.glass = new THREE.MeshStandardMaterial({ color: 0x9fd4e6, roughness: 0.05, metalness: 0.1, transparent: true, opacity: 0.45 });
  MATS.rune = glow(0.3, 3.2, 3.0);
  MATS.runeDead = basic({ color: 0x1b2427 });
  MATS.tealGlow = glow(0.2, 2.6, 2.5);
  MATS.yellowGlow = glow(3.0, 2.2, 0.4);
  MATS.warmWindow = glow(2.2, 1.2, 0.45);
  MATS.redGlow = glow(3.2, 0.25, 0.15);
  MATS.greenEye = glow(1.4, 4.0, 0.6);
  MATS.churnEye = glow(0.4, 3.6, 3.2);
  MATS.ember = glow(4.0, 1.4, 0.35);
  MATS.black = basic({ color: 0x050607 });
}

// ---------- geometry builder: merges primitives into one vertex-coloured mesh ----------
const _gbM = new THREE.Matrix4(), _gbQ = new THREE.Quaternion(), _gbE = new THREE.Euler(), _gbS = new THREE.Vector3(), _gbP = new THREE.Vector3(), _gbC = new THREE.Color();
class GB {
  constructor() { this.parts = []; }
  add(geo, o = {}) {
    let g = geo.index ? geo.toNonIndexed() : geo.clone();
    if (geo !== g) geo.dispose();
    _gbP.set(...(o.pos || [0, 0, 0])); _gbE.set(...(o.rot || [0, 0, 0]), o.order || 'XYZ'); _gbQ.setFromEuler(_gbE);
    const s = o.scale; if (s == null) _gbS.set(1, 1, 1); else if (typeof s === 'number') _gbS.set(s, s, s); else _gbS.set(...s);
    _gbM.compose(_gbP, _gbQ, _gbS);
    if (o.matrix) _gbM.premultiply(o.matrix);
    g.applyMatrix4(_gbM);
    const n = g.attributes.position.count, col = new Float32Array(n * 3);
    _gbC.set(o.color != null ? o.color : 0xffffff); // hex is sRGB; Color.set converts to the linear working space
    const pos = g.attributes.position.array;
    const ao = o.ao || 0, aoY0 = o.aoY0 != null ? o.aoY0 : 0, aoY1 = o.aoY1 != null ? o.aoY1 : 1;
    const jit = o.jitter || 0, r = jit ? mulberry32(n * 7 + this.parts.length) : null;
    for (let i = 0; i < n; i++) {
      let k = 1;
      if (ao) k *= 1 - ao * (1 - smoothstep(aoY0, aoY1, pos[i * 3 + 1]));
      if (jit) k *= 1 - jit * r();
      col[i * 3] = _gbC.r * k; col[i * 3 + 1] = _gbC.g * k; col[i * 3 + 2] = _gbC.b * k;
    }
    g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    if (!g.attributes.uv) g.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(n * 2), 2));
    if (o.uvScale) { const uv = g.attributes.uv.array; for (let i = 0; i < uv.length; i += 2) { uv[i] *= o.uvScale[0]; uv[i + 1] *= o.uvScale[1]; } }
    for (const k of Object.keys(g.attributes)) if (!['position', 'normal', 'uv', 'color'].includes(k)) g.deleteAttribute(k);
    if (!g.attributes.normal) g.computeVertexNormals();
    this.parts.push(g);
    return this;
  }
  box(w, h, d, o = {}) { return this.add(new THREE.BoxGeometry(w, h, d, o.seg || 1, o.segY || 1, o.seg || 1), o); }
  cyl(rt, rb, h, seg = 8, o = {}) { return this.add(new THREE.CylinderGeometry(rt, rb, h, seg, o.hseg || 1, !!o.open), o); }
  cone(r, h, seg = 8, o = {}) { return this.add(new THREE.ConeGeometry(r, h, seg, 1, !!o.open), o); }
  sphere(r, ws = 8, hs = 6, o = {}) { return this.add(new THREE.SphereGeometry(r, ws, hs, o.phiStart || 0, o.phiLength || TAU, o.thetaStart || 0, o.thetaLength || PI), o); }
  ico(r, detail = 0, o = {}) { return this.add(new THREE.IcosahedronGeometry(r, detail), o); }
  torus(r, t, rs = 6, ts = 12, o = {}) { return this.add(new THREE.TorusGeometry(r, t, rs, ts, o.arc || TAU), o); }
  plane(w, h, o = {}) { return this.add(new THREE.PlaneGeometry(w, h, o.ws || 1, o.hs || 1), o); }
  lathe(pts, seg = 8, o = {}) { return this.add(new THREE.LatheGeometry(pts.map(p => new THREE.Vector2(p[0], p[1])), seg), o); }
  // a straight segment of given thickness between two points
  strut(a, b, t, o = {}) {
    const A = new THREE.Vector3(...a), B = new THREE.Vector3(...b), len = A.distanceTo(B);
    const g = o.round ? new THREE.CylinderGeometry(t / 2, t / 2, len, o.seg || 5) : new THREE.BoxGeometry(t, len, o.depth || t);
    const mid = A.clone().add(B).multiplyScalar(0.5), dir = B.clone().sub(A).normalize();
    const q = new THREE.Quaternion().setFromUnitVectors(UP, dir);
    const m = new THREE.Matrix4().compose(mid, q, new THREE.Vector3(1, 1, 1));
    return this.add(g, { ...o, pos: [0, 0, 0], rot: [0, 0, 0], matrix: o.matrix ? m.premultiply(o.matrix) : m });
  }
  build() {
    if (!this.parts.length) return new THREE.BufferGeometry();
    const total = this.parts.reduce((s, g) => s + g.attributes.position.count, 0);
    const P = new Float32Array(total * 3), N = new Float32Array(total * 3), C = new Float32Array(total * 3), T = new Float32Array(total * 2);
    let o = 0;
    for (const g of this.parts) {
      const n = g.attributes.position.count;
      P.set(g.attributes.position.array, o * 3); N.set(g.attributes.normal.array, o * 3); C.set(g.attributes.color.array, o * 3); T.set(g.attributes.uv.array, o * 2);
      o += n; g.dispose();
    }
    const out = new THREE.BufferGeometry();
    out.setAttribute('position', new THREE.BufferAttribute(P, 3)); out.setAttribute('normal', new THREE.BufferAttribute(N, 3));
    out.setAttribute('color', new THREE.BufferAttribute(C, 3)); out.setAttribute('uv', new THREE.BufferAttribute(T, 2));
    out.computeBoundingSphere(); out.computeBoundingBox();
    this.parts = [];
    return out;
  }
  mesh(mat = MATS.vc, { cast = true, receive = true } = {}) { const m = new THREE.Mesh(this.build(), mat); m.castShadow = cast; m.receiveShadow = receive; return m; }
}

// ---------- Elder Futhark as straight strokes (§10.4) ----------
const RUNES = {
  'ᛃ': [[.45, .95, .15, .65], [.15, .65, .45, .35], [.55, .65, .85, .35], [.85, .35, .55, .05]],
  'ᛖ': [[.15, 0, .15, 1], [.15, 1, .5, .62], [.5, .62, .85, 1], [.85, 1, .85, 0]],
  'ᛊ': [[.72, 1, .3, .64], [.3, .64, .7, .36], [.7, .36, .28, 0]],
  'ᛟ': [[.5, 1, .2, .68], [.5, 1, .8, .68], [.2, .68, .82, .02], [.8, .68, .18, .02]],
  'ᛈ': [[.3, 0, .3, 1], [.3, 1, .6, .75], [.6, .75, .85, .95], [.3, 0, .6, .25], [.6, .25, .85, .05]],
  'ᛏ': [[.5, 0, .5, 1], [.5, 1, .15, .7], [.5, 1, .85, .7]],
  'ᚢ': [[.2, 0, .2, 1], [.2, 1, .8, .72], [.8, .72, .8, 0]],
  'ᚱ': [[.25, 0, .25, 1], [.25, 1, .75, .78], [.75, .78, .25, .55], [.25, .55, .78, 0]],
  'ᚠ': [[.3, 0, .3, 1], [.3, .8, .8, 1], [.3, .5, .8, .72]],
  'ᚨ': [[.3, 0, .3, 1], [.3, 1, .8, .78], [.3, .7, .8, .48]],
  'ᛚ': [[.3, 0, .3, 1], [.3, 1, .75, .72]],
  'ᚷ': [[.2, 0, .8, 1], [.8, 0, .2, 1]],
};
// adds rune strokes to a GB, laid out in the XY plane, facing +Z
function addRunes(gb, text, { x = 0, y = 0, z = 0, size = 0.3, stroke = 0.04, gap = 0.08, color = 0xffffff, matrix } = {}) {
  const chars = [...text];
  const width = chars.length * size * 0.75 + (chars.length - 1) * gap;
  let cx = x - width / 2;
  for (const ch of chars) {
    const s = RUNES[ch];
    if (s) for (const [x0, y0, x1, y1] of s) gb.strut([cx + x0 * size * 0.75, y + y0 * size, z], [cx + x1 * size * 0.75, y + y1 * size, z], stroke, { color, depth: stroke * 0.6, matrix });
    cx += size * 0.75 + gap;
  }
  return gb;
}

// ---------- small helpers ----------
function sprite(tex, scale = 1, opts = {}) {
  const m = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, ...opts });
  const s = new THREE.Sprite(m); s.scale.setScalar(scale); return s;
}
function softDiscTex(size = 64, inner = 0.0, color = '255,255,255') {
  return canvasTex(size, size, (g, w, h) => {
    const grd = g.createRadialGradient(w / 2, h / 2, w * inner * 0.5, w / 2, h / 2, w / 2);
    grd.addColorStop(0, `rgba(${color},1)`); grd.addColorStop(0.45, `rgba(${color},.55)`); grd.addColorStop(1, `rgba(${color},0)`);
    g.fillStyle = grd; g.fillRect(0, 0, w, h);
  }, { nearest: false });
}
function smokeTex() {
  return canvasTex(64, 64, (g, w, h) => {
    const r = mulberry32(77);
    for (let i = 0; i < 26; i++) {
      const x = w / 2 + (r() - .5) * w * .45, y = h / 2 + (r() - .5) * h * .45, rad = w * (.12 + r() * .22);
      const grd = g.createRadialGradient(x, y, 0, x, y, rad); grd.addColorStop(0, 'rgba(255,255,255,.22)'); grd.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = grd; g.fillRect(0, 0, w, h);
    }
  }, { nearest: false });
}
function flameTex() {
  return canvasTex(32, 64, (g, w, h) => {
    const grd = g.createRadialGradient(w / 2, h * .7, 1, w / 2, h * .62, h * .5);
    grd.addColorStop(0, 'rgba(255,250,220,1)'); grd.addColorStop(.25, 'rgba(255,190,80,.95)'); grd.addColorStop(.6, 'rgba(255,90,20,.5)'); grd.addColorStop(1, 'rgba(120,20,0,0)');
    g.fillStyle = grd; g.beginPath(); g.moveTo(w / 2, 0); g.quadraticCurveTo(w, h * .6, w / 2, h); g.quadraticCurveTo(0, h * .6, w / 2, 0); g.fill();
  }, { nearest: false });
}
