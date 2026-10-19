// ================= WORLD: weather and VFX (§9.3, §10.10) =================
const PART_VERT = /* glsl */`
  attribute vec4 aCol; attribute float aSize;
  uniform float uScale, uFocal, uFStop, uFocus, uImgH, uBokeh;
  varying vec4 vCol; varying float vFog; varying float vBlur;
  void main(){
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    float D = max(-mv.z, 0.05);
    float size = aSize * uScale / D;
    float f = uFocal * 0.001; float S = max(uFocus, f * 1.5);
    float coc = abs((f * f / (uFStop * (S - f))) * (D - S) / D) * (uImgH / 0.024) * uBokeh;
    coc = min(coc, uImgH * 0.06);
    float s2 = max(size, coc);
    vCol = aCol; vCol.a *= clamp((size * size + 1.0) / (s2 * s2 + 1.0), 0.04, 1.0);
    vBlur = clamp((s2 - size) / max(s2, 1.0), 0.0, 1.0);
    gl_PointSize = clamp(s2, 0.0, 256.0);
    vFog = D;
    gl_Position = projectionMatrix * mv;
  }`;
const PART_FRAG = /* glsl */`
  uniform sampler2D uMap; uniform float uUseMap, uAdd; uniform vec3 uFogColor; uniform float uFogDensity;
  varying vec4 vCol; varying float vFog; varying float vBlur;
  void main(){
    vec2 pc = gl_PointCoord - 0.5; float d = length(pc) * 2.0;
    float a;
    if (uUseMap > 0.5) a = texture2D(uMap, gl_PointCoord).a * texture2D(uMap, gl_PointCoord).r;
    else { a = smoothstep(1.0, mix(0.15, 0.82, vBlur), d); a += vBlur * smoothstep(0.7, 0.92, d) * smoothstep(1.0, 0.92, d) * 0.6; }
    a *= vCol.a;
    if (a < 0.003) discard;
    float fog = 1.0 - exp(-uFogDensity * uFogDensity * vFog * vFog);
    vec3 c = vCol.rgb;
    if (uAdd > 0.5) { gl_FragColor = vec4(c * a * (1.0 - fog), 1.0); }
    else { gl_FragColor = vec4(mix(c, uFogColor, fog), a); }
  }`;
const PART_UNIFORMS = () => ({
  uScale: { value: 500 }, uFocal: { value: 35 }, uFStop: { value: 4 }, uFocus: { value: 3 }, uImgH: { value: 1080 }, uBokeh: { value: 1 },
  uMap: { value: null }, uUseMap: { value: 0 }, uAdd: { value: 0 }, uFogColor: { value: null }, uFogDensity: { value: 0.004 },
});
const PSYSTEMS = [];
class PSys {
  constructor({ max = 1200, tex = null, add = false, order = 5 } = {}) {
    this.max = max; this.n = 0; this.head = 0;
    const g = new THREE.BufferGeometry();
    this.aPos = new Float32Array(max * 3); this.aCol = new Float32Array(max * 4); this.aSize = new Float32Array(max);
    g.setAttribute('position', new THREE.BufferAttribute(this.aPos, 3).setUsage(THREE.DynamicDrawUsage));
    g.setAttribute('aCol', new THREE.BufferAttribute(this.aCol, 4).setUsage(THREE.DynamicDrawUsage));
    g.setAttribute('aSize', new THREE.BufferAttribute(this.aSize, 1).setUsage(THREE.DynamicDrawUsage));
    g.setDrawRange(0, 0);
    const u = PART_UNIFORMS(); u.uFogColor.value = R.scene.fog.color; u.uAdd.value = add ? 1 : 0;
    if (tex) { u.uMap.value = tex; u.uUseMap.value = 1; }
    this.mat = new THREE.ShaderMaterial({ vertexShader: PART_VERT, fragmentShader: PART_FRAG, uniforms: u, transparent: true, depthWrite: false,
      blending: add ? THREE.AdditiveBlending : THREE.NormalBlending });
    this.pts = new THREE.Points(g, this.mat); this.pts.frustumCulled = false; this.pts.renderOrder = order;
    R.scene.add(this.pts);
    const F32 = () => new Float32Array(max);
    this.P = { x: F32(), y: F32(), z: F32(), vx: F32(), vy: F32(), vz: F32(), life: F32(), maxL: F32(), s0: F32(), s1: F32(), r: F32(), g: F32(), b: F32(), a0: F32(), a1: F32(), grav: F32(), drag: F32(), fade: F32() };
    PSYSTEMS.push(this);
  }
  emit(x, y, z, vx, vy, vz, life, s0, s1, r, g, b, a0 = 1, a1 = 0, grav = 0, drag = 0, fadeIn = 0) {
    const P = this.P; let i;
    if (this.n < this.max) i = this.n++; else { i = this.head; this.head = (this.head + 1) % this.max; }
    P.x[i] = x; P.y[i] = y; P.z[i] = z; P.vx[i] = vx; P.vy[i] = vy; P.vz[i] = vz; P.life[i] = 0; P.maxL[i] = life;
    P.s0[i] = s0; P.s1[i] = s1; P.r[i] = r; P.g[i] = g; P.b[i] = b; P.a0[i] = a0; P.a1[i] = a1; P.grav[i] = grav; P.drag[i] = drag; P.fade[i] = fadeIn;
  }
  update(dt) {
    const P = this.P, ap = this.aPos, ac = this.aCol, as = this.aSize;
    let w = 0;
    for (let i = 0; i < this.n; i++) {
      P.life[i] += dt;
      const t = P.life[i] / P.maxL[i];
      if (t >= 1) continue;
      const dr = Math.exp(-P.drag[i] * dt);
      P.vx[i] *= dr; P.vz[i] *= dr; P.vy[i] = P.vy[i] * dr - P.grav[i] * dt;
      P.x[i] += P.vx[i] * dt; P.y[i] += P.vy[i] * dt; P.z[i] += P.vz[i] * dt;
      // compact in place
      if (w !== i) for (const k in P) P[k][w] = P[k][i];
      ap[w * 3] = P.x[w]; ap[w * 3 + 1] = P.y[w]; ap[w * 3 + 2] = P.z[w];
      const fi = P.fade[w] > 0 ? clamp01(t / P.fade[w]) : 1;
      ac[w * 4] = P.r[w]; ac[w * 4 + 1] = P.g[w]; ac[w * 4 + 2] = P.b[w]; ac[w * 4 + 3] = lerp(P.a0[w], P.a1[w], t) * fi;
      as[w] = lerp(P.s0[w], P.s1[w], t);
      w++;
    }
    this.n = w; if (this.head >= w) this.head = 0;
    const g = this.pts.geometry;
    g.setDrawRange(0, w);
    if (w) { g.attributes.position.needsUpdate = true; g.attributes.aCol.needsUpdate = true; g.attributes.aSize.needsUpdate = true; }
  }
}

// ---------- falling snow: GPU-wrapped volume around the camera ----------
const SNOW = { pts: null, u: null, density: 0.5, target: 0.5 };
function buildSnow() {
  const q = QUALITY[SETTINGS.quality] || QUALITY.balanced, N = q.snow;
  const g = new THREE.BufferGeometry(), seed = new Float32Array(N * 4), pos = new Float32Array(N * 3);
  const r = mulberry32(17);
  for (let i = 0; i < N; i++) { seed.set([r(), r(), r(), r()], i * 4); }
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('aSeed', new THREE.BufferAttribute(seed, 4));
  const u = { ...PART_UNIFORMS(), uTime: U.time, uOrigin: { value: V3() }, uBox: { value: V3(36, 26, 36) }, uWind: U.wind, uGust: U.gust, uDensity: { value: 0.5 } };
  u.uFogColor.value = R.scene.fog.color;
  const vs = /* glsl */`
    attribute vec4 aSeed;
    uniform float uScale, uFocal, uFStop, uFocus, uImgH, uBokeh, uTime, uDensity, uGust; uniform vec3 uOrigin, uBox; uniform vec2 uWind;
    varying vec4 vCol; varying float vFog; varying float vBlur;
    void main(){
      float fall = 0.7 + aSeed.w * 0.9;
      vec3 p = aSeed.xyz * uBox + vec3(uWind.x * (1.0 + uGust * 3.0), -fall, uWind.y * (1.0 + uGust * 3.0)) * uTime;
      p.x += sin(uTime * (0.8 + aSeed.w) + aSeed.x * 40.0) * 0.35;
      p.z += cos(uTime * (0.7 + aSeed.y) + aSeed.z * 40.0) * 0.35;
      vec3 rel = mod(p - uOrigin + uBox * 0.5, uBox) - uBox * 0.5;
      vec4 mv = viewMatrix * vec4(uOrigin + rel, 1.0);
      float D = max(-mv.z, 0.05);
      float size = (0.018 + aSeed.y * 0.02) * uScale / D;
      float f = uFocal * 0.001; float S = max(uFocus, f * 1.5);
      float coc = abs((f * f / (uFStop * (S - f))) * (D - S) / D) * (uImgH / 0.024) * uBokeh;
      coc = min(coc, uImgH * 0.05);
      float s2 = max(size, coc);
      float on = step(aSeed.x * 0.999 + aSeed.z * 0.001, uDensity);
      vCol = vec4(0.95, 0.97, 1.0, on * clamp((size * size + 0.6) / (s2 * s2 + 0.6), 0.025, 0.9) * smoothstep(0.1, 0.6, D));
      vBlur = clamp((s2 - size) / max(s2, 1.0), 0.0, 1.0);
      gl_PointSize = on * clamp(max(s2, 1.2), 0.0, 200.0);
      vFog = D;
      gl_Position = projectionMatrix * mv;
    }`;
  const m = new THREE.ShaderMaterial({ vertexShader: vs, fragmentShader: PART_FRAG, uniforms: u, transparent: true, depthWrite: false });
  const p = new THREE.Points(g, m); p.frustumCulled = false; p.renderOrder = 8;
  R.scene.add(p); SNOW.pts = p; SNOW.u = u;
}

// ---------- FX recipes ----------
const FX = { soft: null, add: null, smoke: null, flame: null, emitters: [], rings: [], prints: [], printI: 0, trail: null };
function buildFX() {
  TEX.disc = TEX.disc || softDiscTex(64);
  FX.soft = new PSys({ max: 2400 });
  FX.add = new PSys({ max: 2400, add: true, order: 6 });
  FX.smoke = new PSys({ max: 900, tex: smokeTex(), order: 4 });
  FX.flame = new PSys({ max: 700, tex: flameTex(), add: true, order: 6 });
  // expanding rings (shockwaves, Glacial Rebate, Faye's Chord)
  for (let i = 0; i < 8; i++) {
    const m = new THREE.Mesh(new THREE.RingGeometry(0.85, 1, 40), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }));
    m.rotation.x = -PI / 2; m.visible = false; m.renderOrder = 7; R.scene.add(m); FX.rings.push({ m, t: 1, dur: 1, r0: 0, r1: 1 });
  }
  // footprints that slowly fill in
  const pm = new THREE.MeshBasicMaterial({ color: 0x556a85, transparent: true, opacity: 0.32, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -3 });
  const pg = new THREE.PlaneGeometry(0.13, 0.3); pg.rotateX(-PI / 2);
  for (let i = 0; i < 180; i++) { const m = new THREE.Mesh(pg, pm.clone()); m.visible = false; m.renderOrder = 1; R.scene.add(m); FX.prints.push({ m, t: 0 }); }
  // axe frost trail (ribbon of the last 8 frames)
  const tg = new THREE.BufferGeometry(); tg.setAttribute('position', new THREE.BufferAttribute(new Float32Array(16 * 3), 3).setUsage(THREE.DynamicDrawUsage));
  tg.setAttribute('color', new THREE.BufferAttribute(new Float32Array(16 * 3), 3));
  const idx = []; for (let i = 0; i < 7; i++) { const a = i * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); } tg.setIndex(idx);
  const tc = tg.attributes.color.array; for (let i = 0; i < 8; i++) { const k = i / 7; for (let j = 0; j < 2; j++) tc.set([0.25 * k, 1.6 * k, 1.7 * k], (i * 2 + j) * 3); }
  FX.trail = { mesh: new THREE.Mesh(tg, new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide })), hist: [], on: false };
  FX.trail.mesh.frustumCulled = false; FX.trail.mesh.visible = false; R.scene.add(FX.trail.mesh);
}
const rr = () => frand() - 0.5;
function fxBurst(kind, p, o = {}) {
  const n = o.n, s = o.scale || 1;
  switch (kind) {
    case 'chips': for (let i = 0; i < (n || 14); i++) FX.soft.emit(p.x, p.y, p.z, rr() * 4 + (o.dx || 0) * 3, 1 + frand() * 3, rr() * 4 + (o.dz || 0) * 3, 0.8 + frand() * 0.5, 0.05, 0.04, 0.85, 0.7, 0.5, 1, 0.8, 9, 0.5); break;
    case 'snow': for (let i = 0; i < (n || 30); i++) FX.soft.emit(p.x + rr() * s, p.y + frand() * 0.4 * s, p.z + rr() * s, rr() * 3 * s, frand() * 2.2 * s, rr() * 3 * s, 1.2 + frand() * 1.6, 0.25 * s, 0.9 * s, 0.93, 0.95, 1.0, 0.7, 0, 1.6, 1.6); break;
    case 'plume': for (let i = 0; i < (n || 160); i++) FX.soft.emit(p.x + rr() * 6 * s, p.y + frand() * 2 * s, p.z + rr() * 6 * s, rr() * 5 * s, frand() * 4 * s, rr() * 5 * s, 2.5 + frand() * 2.5, 0.6 * s, 2.6 * s, 0.94, 0.96, 1.0, 0.75, 0, 0.6, 1.1); break;
    case 'frost': for (let i = 0; i < (n || 18); i++) FX.add.emit(p.x, p.y, p.z, rr() * 6, rr() * 5 + 1.5, rr() * 6, 0.35 + frand() * 0.35, 0.05 * s, 0.01, 0.6, 2.4, 2.6, 1, 0, 6, 2); break;
    case 'ichor': if (SETTINGS.gore === 'full') for (let i = 0; i < (n || 12); i++) FX.soft.emit(p.x, p.y, p.z, rr() * 3 + (o.dx || 0) * 2, frand() * 2.5, rr() * 3 + (o.dz || 0) * 2, 0.6 + frand() * 0.4, 0.06, 0.04, 0.03, 0.2, 0.2, 1, 0.6, 9.8, 0.4); break;
    case 'flash': FX.add.emit(p.x, p.y, p.z, 0, 0, 0, 0.09, 0.6 * s, 0.2 * s, o.r || 2.2, o.g || 2.2, o.b || 2.0, 1, 0); break;
    case 'sparks': for (let i = 0; i < (n || 22); i++) FX.add.emit(p.x, p.y, p.z, rr() * 4, frand() * 3, rr() * 4, 0.3 + frand() * 0.5, 0.025, 0.01, o.r || 0.4, o.g || 3, o.b || 2.8, 1, 0, 8, 1); break;
    case 'embers': for (let i = 0; i < (n || 6); i++) FX.add.emit(p.x + rr() * s, p.y, p.z + rr() * s, rr() * 0.6, 1.2 + frand() * 2, rr() * 0.6, 2 + frand() * 3, 0.035, 0.015, 3.2, 1.2, 0.3, 1, 0, -0.1, 0.4); break;
    case 'spiral': for (let i = 0; i < (n || 60); i++) { const a = i * 0.5, rad = 0.4 + i * 0.012; FX.add.emit(p.x + Math.cos(a) * rad, p.y + i * 0.02, p.z + Math.sin(a) * rad, -Math.sin(a) * 1.2, 0.9, Math.cos(a) * 1.2, 1.4 + frand(), 0.06, 0.02, 0.5, 2.6, 1.8, 1, 0, -0.2, 0.6, 0.2); } break;
    case 'feathers': for (let i = 0; i < (n || 16); i++) FX.soft.emit(p.x, p.y, p.z, rr() * 3, frand() * 2, rr() * 3, 1.4 + frand(), 0.08, 0.06, 0.02, 0.02, 0.03, 1, 0, 1.2, 2.5); for (let i = 0; i < 8; i++) FX.soft.emit(p.x, p.y, p.z, rr() * 2, frand() * 2.5, rr() * 2, 1.6 + frand(), 0.06, 0.06, 0.95, 0.95, 0.9, 1, 0, 0.9, 2); break;
    case 'breath': for (let i = 0; i < (n || 3); i++) FX.soft.emit(p.x + (o.dx || 0) * 0.07 + rr() * 0.03, p.y - 0.02, p.z + (o.dz || 0) * 0.07 + rr() * 0.03, (o.dx || 0) * 0.42 + rr() * 0.1, 0.1 + frand() * 0.08, (o.dz || 0) * 0.42 + rr() * 0.1, 0.9 + frand() * 0.5, 0.025, 0.17 * s, 0.9, 0.93, 0.98, 0.1 * (o.a || 1), 0, -0.05, 1.2, 0.15); break;
    case 'smoke': for (let i = 0; i < (n || 1); i++) FX.smoke.emit(p.x + rr() * 0.5 * s, p.y, p.z + rr() * 0.5 * s, rr() * 0.3 + U.wind.value.x * 0.6, 1.6 + frand() * 1.2, rr() * 0.3 + U.wind.value.y * 0.6, 8 + frand() * 4, 0.9 * s, 5.5 * s, o.c || 0.55, o.c || 0.53, o.c || 0.52, o.a || 0.5, 0, -0.05, 0.05, 0.12); break;
    case 'flame': for (let i = 0; i < (n || 1); i++) FX.flame.emit(p.x + rr() * 0.9 * s, p.y + frand() * 0.2, p.z + rr() * 1.6 * s, rr() * 0.3, 1.2 + frand() * 1.5, rr() * 0.3, 0.5 + frand() * 0.5, 0.65 * s, 0.15 * s, 1.6, 1.0, 0.55, 1, 0, -0.5, 0.5, 0.1); break;
    case 'ice': for (let i = 0; i < (n || 30); i++) FX.soft.emit(p.x + rr() * 8 * s, p.y, p.z + rr() * 8 * s, rr() * 4, 2 + frand() * 6, rr() * 4, 2 + frand() * 1.5, 0.6 * s, 0.5 * s, 0.86, 0.92, 0.98, 1, 0.2, 9.8, 0.1); break;
    case 'dust': for (let i = 0; i < (n || 40); i++) FX.soft.emit(p.x + rr() * s, p.y + frand() * 0.3, p.z + rr() * s, rr() * 2, frand() * 1.5, rr() * 2, 1 + frand() * 1.5, 0.2 * s, 0.9 * s, 0.75, 0.75, 0.76, 0.6, 0, 1, 1.2); break;
    case 'paper': for (let i = 0; i < (n || 10); i++) FX.soft.emit(p.x, p.y, p.z, rr() * 2.4, frand() * 2.2, rr() * 2.4, 1.8 + frand(), 0.07, 0.07, 0.96, 0.96, 0.92, 1, 0, 1.0, 1.5); break;
    case 'gold': for (let i = 0; i < (n || 18); i++) FX.add.emit(p.x, p.y, p.z, rr() * 3, frand() * 3, rr() * 3, 0.5 + frand() * 0.4, 0.05, 0.01, 3, 2.2, 0.4, 1, 0, 3, 1); break;
    case 'heal': for (let i = 0; i < (n || 14); i++) FX.add.emit(p.x + rr() * 0.6, p.y + frand() * 1.6, p.z + rr() * 0.6, 0, 0.8 + frand(), 0, 0.8 + frand() * 0.5, 0.06, 0.02, 0.3, 2.6, 1.6, 1, 0); break;
  }
}
function fxRing(p, r1, dur, color = [0.4, 2.6, 2.6], r0 = 0.2) {
  const f = FX.rings.find(x => x.t >= 1) || FX.rings[0];
  f.m.position.set(p.x, p.y + 0.08, p.z); f.t = 0; f.dur = dur; f.r0 = r0; f.r1 = r1; f.m.visible = true; f.m.material.color.setRGB(...color);
}
function fxFootprint(x, z, yaw) {
  const f = FX.prints[FX.printI]; FX.printI = (FX.printI + 1) % FX.prints.length;
  f.m.position.set(x, groundHeight(x, z) + 0.025, z); f.m.rotation.y = yaw; f.m.visible = true; f.t = 0; f.m.material.opacity = 0.32;
}
function addEmitter(e) { e.acc = 0; e.on = e.on !== false; FX.emitters.push(e); return e; }

function updateFX(dt) {
  for (const s of PSYSTEMS) {
    const u = s.mat.uniforms;
    u.uScale.value = R.h / (2 * Math.tan(R.camera.fov * DEG / 2)); u.uFocal.value = R.post.focal; u.uFStop.value = R.post.fStop; u.uFocus.value = R.post.focusDist;
    u.uImgH.value = R.h; u.uBokeh.value = SETTINGS.dof ? R.post.dof : 0; u.uFogDensity.value = R.scene.fog.density;
    s.update(dt);
  }
  if (SNOW.u) {
    const u = SNOW.u;
    u.uScale.value = R.h / (2 * Math.tan(R.camera.fov * DEG / 2)); u.uFocal.value = R.post.focal; u.uFStop.value = R.post.fStop; u.uFocus.value = R.post.focusDist;
    u.uImgH.value = R.h; u.uBokeh.value = SETTINGS.dof ? R.post.dof : 0; u.uFogDensity.value = R.scene.fog.density;
    u.uOrigin.value.copy(R.camera.position);
    SNOW.density = damp(SNOW.density, ENV.cur ? ENV.cur.snow : 0.5, 0.8, dt);
    u.uDensity.value = SNOW.density * (OBJ.house && insideHouse(R.camera.position) ? 0 : 1);
  }
  for (const e of FX.emitters) {
    if (!e.on) continue;
    e.acc += dt * e.rate;
    while (e.acc >= 1) { e.acc -= 1; fxBurst(e.kind, e.pos, e.opts || {}); }
  }
  for (const f of FX.rings) {
    if (f.t >= 1) continue;
    f.t = Math.min(1, f.t + dt / f.dur);
    const s = lerp(f.r0, f.r1, EASE.outCubic(f.t)); f.m.scale.set(s, s, s); f.m.material.opacity = (1 - f.t) * 0.9;
    if (f.t >= 1) f.m.visible = false;
  }
  for (const p of FX.prints) { if (!p.m.visible) continue; p.t += dt; p.m.material.opacity = 0.32 * (1 - p.t / 45); if (p.t > 45) p.m.visible = false; }
}
function insideHouse(p) { const H = OBJ.house; return p.x > H.X0 && p.x < H.X1 && p.z > H.Z0 && p.z < H.Z1 && p.y < H.RIDGE; }

// the frost ribbon behind the flying axe
function updateTrail(p0, p1, on) {
  const T = FX.trail; if (!T) return;
  if (!on) { T.hist.length = 0; T.mesh.visible = false; return; }
  T.hist.unshift([p0.clone(), p1.clone()]); if (T.hist.length > 8) T.hist.pop();
  const a = T.mesh.geometry.attributes.position.array;
  for (let i = 0; i < 8; i++) { const h = T.hist[Math.min(i, T.hist.length - 1)]; a.set([h[0].x, h[0].y, h[0].z, h[1].x, h[1].y, h[1].z], (7 - i) * 6); }
  T.mesh.geometry.attributes.position.needsUpdate = true; T.mesh.visible = T.hist.length > 1;
}
