// ================= WORLD: sky, light, per-scene grade (§9.3, §10.7, §10.9) =================

const ENV_PRESETS = {
  title:   { top: 0x1d3150, hor: 0x8ba2bb, gnd: 0x5d6f80, sunDir: [0.5, 0.06, 0.6], sun: 0x9fb4d8, sunI: 0.7, disc: 0, hemiS: 0x89a3c4, hemiG: 0xc4cfdc, hemiI: 1.45,
             fog: 0x7d93a9, fogD: 0.0032, clouds: 0.5, cloud: 0x6d819b, aurora: 0, stars: 0.15,
             lift: [0.045, 0.055, 0.075], gamma: [1, 1, 1], gain: [0.96, 1, 1.06], sat: 0.72, contrast: 0.98, tint: [0.95, 0.99, 1.06], exposure: 1.0, bloom: 0.5, vignette: 0.32, grain: 0.05, snow: 0.8, snowCol: 0xd9e2ee },
  grove:   { top: 0x5f83af, hor: 0xd8dde0, gnd: 0x9aa7b4, sunDir: [-0.72, 0.36, 0.5], sun: 0xffe2b6, sunI: 2.3, disc: 1, hemiS: 0xa9bfd6, hemiG: 0xe6eaee, hemiI: 1.25,
             fog: 0xc9d1d8, fogD: 0.0075, clouds: 0.55, cloud: 0xc7ccd3, aurora: 0, stars: 0,
             lift: [0.01, 0.012, 0.02], gamma: [1, 1, 1], gain: [1.05, 1.0, 0.95], sat: 0.95, contrast: 0.97, tint: [1, 1, 1], exposure: 1.0, bloom: 0.45, vignette: 0.3, grain: 0.045, snow: 0.45, snowCol: 0xeef2f7 },
  carry:   { top: 0x5a7aa6, hor: 0xe1c9b0, gnd: 0x9aa7b4, sunDir: [-0.8, 0.22, 0.55], sun: 0xffcf98, sunI: 2.2, disc: 1, hemiS: 0x9fb4cc, hemiG: 0xe0e2e6, hemiI: 1.2,
             fog: 0xcfcdcf, fogD: 0.0048, clouds: 0.55, cloud: 0xc9c2c1, aurora: 0, stars: 0,
             lift: [0.01, 0.014, 0.024], gamma: [1, 1, 1], gain: [1.06, 1.0, 0.94], sat: 0.98, contrast: 0.98, tint: [1, 1, 1], exposure: 1.0, bloom: 0.5, vignette: 0.3, grain: 0.045, snow: 0.4, snowCol: 0xf0f0f2 },
  dusk:    { top: 0x34436a, hor: 0xf09a5c, gnd: 0x6d6a72, sunDir: [-0.85, 0.07, 0.4], sun: 0xff9348, sunI: 1.7, disc: 1, hemiS: 0x6a7ea8, hemiG: 0xb6a59d, hemiI: 0.95,
             fog: 0xa7959a, fogD: 0.0036, clouds: 0.6, cloud: 0x9a7a78, aurora: 0, stars: 0.05,
             lift: [0.0, 0.03, 0.055], gamma: [1, 1, 1], gain: [1.09, 1.0, 0.9], sat: 1.05, contrast: 1.02, tint: [1.02, 0.99, 0.96], exposure: 1.0, bloom: 0.7, vignette: 0.34, grain: 0.05, snow: 0.3, snowCol: 0xf2e6dc },
  night:   { top: 0x040915, hor: 0x18294a, gnd: 0x0b1220, sunDir: [0.35, 0.62, -0.45], sun: 0x9cb4e6, sunI: 0.55, disc: 0, hemiS: 0x2e4470, hemiG: 0x495a74, hemiI: 0.42,
             fog: 0x13213a, fogD: 0.0042, clouds: 0.25, cloud: 0x1a2840, aurora: 0.9, stars: 1,
             lift: [0.01, 0.022, 0.05], gamma: [1, 1, 1], gain: [0.96, 1.0, 1.1], sat: 0.92, contrast: 1.0, tint: [0.96, 1.0, 1.05], exposure: 1.05, bloom: 0.75, vignette: 0.38, grain: 0.06, snow: 0.35, snowCol: 0xb8c8e6 },
  ward:    { top: 0x040915, hor: 0x16263f, gnd: 0x0b1220, sunDir: [0.35, 0.62, -0.45], sun: 0x9ab0dc, sunI: 0.6, disc: 0, hemiS: 0x2c4268, hemiG: 0x45566e, hemiI: 0.5,
             fog: 0x13203a, fogD: 0.0048, clouds: 0.3, cloud: 0x1a2840, aurora: 0.55, stars: 0.8,
             lift: [0.01, 0.026, 0.06], gamma: [1, 1, 1], gain: [0.95, 1.0, 1.1], sat: 0.8, contrast: 1.04, tint: [0.95, 1.0, 1.06], exposure: 1.1, bloom: 0.7, vignette: 0.36, grain: 0.06, snow: 0.55, snowCol: 0xb8c8e6 },
  kiosk:   { top: 0x0b1530, hor: 0x2a3c5c, gnd: 0x101828, sunDir: [0.35, 0.62, -0.45], sun: 0x9cb4e6, sunI: 0.5, disc: 0, hemiS: 0x334a72, hemiG: 0x50607a, hemiI: 0.5,
             fog: 0x1b2a44, fogD: 0.006, clouds: 0.35, cloud: 0x22324c, aurora: 0.5, stars: 0.7,
             lift: [0.012, 0.02, 0.045], gamma: [1, 1, 1], gain: [1.02, 1.0, 1.04], sat: 0.95, contrast: 1.0, tint: [1, 1, 1], exposure: 1.1, bloom: 0.75, vignette: 0.36, grain: 0.055, snow: 0.3, snowCol: 0xc4d2ea },
  zee:     { top: 0x67807e, hor: 0xc2cec2, gnd: 0x7f8c80, sunDir: [-0.3, 0.55, 0.6], sun: 0xfff0d6, sunI: 1.5, disc: 0, hemiS: 0xb6c8b4, hemiG: 0xdfe5da, hemiI: 1.35,
             fog: 0xb8c5b9, fogD: 0.013, clouds: 0.7, cloud: 0xc4ccc2, aurora: 0, stars: 0,
             lift: [0.025, 0.035, 0.03], gamma: [1, 1, 1], gain: [0.98, 1.02, 0.96], sat: 0.84, contrast: 0.93, tint: [0.97, 1.02, 0.97], exposure: 1.0, bloom: 0.55, vignette: 0.3, grain: 0.045, snow: 0.15, snowCol: 0xe8eee6 },
  cliff:   { top: 0x3f6194, hor: 0xf3c497, gnd: 0x8a8f98, sunDir: [0.92, 0.12, 0.25], sun: 0xffcf98, sunI: 2.3, disc: 1, hemiS: 0x92a8c8, hemiG: 0xe2dcd6, hemiI: 1.15,
             fog: 0xd8c8bc, fogD: 0.0032, clouds: 0.45, cloud: 0xd6b8a6, aurora: 0, stars: 0,
             lift: [0.0, 0.01, 0.02], gamma: [1, 1, 1], gain: [1.05, 1.0, 0.96], sat: 1.1, contrast: 1.12, tint: [1, 1, 1], exposure: 1.0, bloom: 0.5, vignette: 0.3, grain: 0.04, snow: 0.2, snowCol: 0xf2eee8 },
  horni:   { top: 0x7f8f9a, hor: 0xc4ccd1, gnd: 0x99a5ad, sunDir: [0.5, 0.6, 0.3], sun: 0xdde5ea, sunI: 1.0, disc: 0, hemiS: 0xa7b6c1, hemiG: 0xd5dce1, hemiI: 1.6,
             fog: 0xb6c3ca, fogD: 0.0085, clouds: 1, cloud: 0x98a4ad, aurora: 0, stars: 0,
             lift: [0.0, 0.025, 0.035], gamma: [1, 1, 1], gain: [0.97, 1.0, 1.02], sat: 0.8, contrast: 1.03, tint: [0.97, 1.0, 1.02], exposure: 1.0, bloom: 0.45, vignette: 0.32, grain: 0.05, snow: 0.45, snowCol: 0xe4eaee },
  boss:    { top: 0x76858f, hor: 0xb8c2c8, gnd: 0x8e9aa2, sunDir: [0.5, 0.6, 0.3], sun: 0xe2e8ec, sunI: 1.2, disc: 0, hemiS: 0xa0b0bc, hemiG: 0xd0d8dd, hemiI: 1.5,
             fog: 0xaebbc3, fogD: 0.0075, clouds: 1, cloud: 0x8e9aa3, aurora: 0, stars: 0,
             lift: [0.0, 0.02, 0.03], gamma: [1, 1, 1], gain: [0.98, 1.0, 1.02], sat: 0.85, contrast: 1.12, tint: [0.98, 1.0, 1.02], exposure: 1.0, bloom: 0.5, vignette: 0.34, grain: 0.05, snow: 0.55, snowCol: 0xe4eaee },
  home:    { top: 0x030813, hor: 0x162646, gnd: 0x0b1220, sunDir: [0.35, 0.62, -0.45], sun: 0x9cb4e6, sunI: 0.5, disc: 0, hemiS: 0x2e4470, hemiG: 0x495a74, hemiI: 0.42,
             fog: 0x13213a, fogD: 0.0055, clouds: 0.25, cloud: 0x1a2840, aurora: 1.25, stars: 1,
             lift: [0.01, 0.022, 0.05], gamma: [1, 1, 1], gain: [0.96, 1.0, 1.1], sat: 0.92, contrast: 1.0, tint: [0.96, 1.0, 1.05], exposure: 1.05, bloom: 0.75, vignette: 0.38, grain: 0.06, snow: 0.95, snowCol: 0xb8c8e6 },
  interior:{ top: 0x030813, hor: 0x162646, gnd: 0x0b1220, sunDir: [0.35, 0.62, -0.45], sun: 0x6c7fa6, sunI: 0.15, disc: 0, hemiS: 0x4a3a2c, hemiG: 0x2c241e, hemiI: 0.35,
             fog: 0x1a1410, fogD: 0.012, clouds: 0.25, cloud: 0x1a2840, aurora: 1.25, stars: 1,
             lift: [0.02, 0.012, 0.0], gamma: [1, 1, 1], gain: [1.1, 0.98, 0.84], sat: 0.95, contrast: 1.04, tint: [1.04, 0.98, 0.9], exposure: 1.1, bloom: 0.7, vignette: 0.62, grain: 0.065, snow: 0.0, snowCol: 0xb8c8e6 },
};
const ENV_KEYS_COLOR = ['top', 'hor', 'gnd', 'sun', 'hemiS', 'hemiG', 'fog', 'cloud', 'snowCol'];
const ENV_KEYS_NUM = ['sunI', 'disc', 'hemiI', 'fogD', 'clouds', 'aurora', 'stars', 'sat', 'contrast', 'exposure', 'bloom', 'vignette', 'grain', 'snow'];
const ENV_KEYS_VEC = ['sunDir', 'lift', 'gamma', 'gain', 'tint'];

const ENV = { cur: null, from: null, to: null, t: 1, dur: 1, name: 'title', sky: null, sun: null, hemi: null, lights: [], focus: V3(), extraSat: 0, rageMix: 0 };
function envState(p) {
  const s = {};
  for (const k of ENV_KEYS_COLOR) s[k] = new THREE.Color(p[k]);
  for (const k of ENV_KEYS_NUM) s[k] = p[k];
  for (const k of ENV_KEYS_VEC) s[k] = new THREE.Vector3(...p[k]);
  s.sunDir.normalize();
  return s;
}
function setEnv(name, dur = 2) {
  const p = ENV_PRESETS[name]; if (!p) return;
  ENV.name = name;
  ENV.from = cloneEnv(ENV.cur); ENV.to = envState(p); ENV.t = 0; ENV.dur = Math.max(0.0001, dur);
  if (dur <= 0.001) { ENV.cur = cloneEnv(ENV.to); ENV.t = 1; applyEnv(); }
}
function cloneEnv(s) { const o = {}; for (const k in s) o[k] = s[k].clone ? s[k].clone() : s[k]; return o; }

const SKY_FRAG = /* glsl */`
  varying vec3 vDir;
  uniform vec3 top, hor, gnd, sunDir, sunCol, cloudCol;
  uniform float disc, clouds, aurora, stars, time;
  ${GLSL_COMMON}
  void main(){
    vec3 d = normalize(vDir);
    float h = d.y;
    vec3 col = mix(hor, top, pow(smoothstep(-0.02, 0.62, h), 0.75));
    col = mix(col, gnd, smoothstep(0.0, -0.25, h));
    float sd = max(dot(d, sunDir), 0.0);
    col += sunCol * (pow(sd, 6.0) * 0.35 + pow(sd, 64.0) * 0.6) * (0.4 + disc * 0.6);
    col += sunCol * smoothstep(0.9993, 0.9997, sd) * disc * 6.0;
    // stars
    if (stars > 0.0 && h > 0.0) {
      vec2 sp = vec2(atan(d.z, d.x) * 120.0, h * 160.0);
      float s = hash12(floor(sp));
      float tw = 0.6 + 0.4 * sin(time * 2.0 + s * 50.0);
      col += vec3(0.85, 0.9, 1.0) * step(0.9975, s) * stars * tw * smoothstep(0.02, 0.2, h) * 1.6;
    }
    // aurora: teal and gold curtains in the north (−z)
    if (aurora > 0.0 && h > 0.02) {
      float az = atan(d.x, -d.z);
      float n = fbm(vec2(az * 3.0 + time * 0.015, time * 0.02));
      float curtain = smoothstep(0.35, 0.75, fbm(vec2(az * 9.0 + n * 3.0, time * 0.04)));
      float band = smoothstep(0.08, 0.22, h) * smoothstep(0.7, 0.3, h - n * 0.15);
      float north = smoothstep(0.1, 0.8, -d.z * 0.8 + 0.4);
      vec3 ac = mix(vec3(0.1, 1.2, 0.85), vec3(1.1, 0.8, 0.25), smoothstep(0.3, 0.6, h + n * 0.2));
      col += ac * curtain * band * north * aurora * 0.55;
    }
    // clouds on a dome
    if (clouds > 0.0 && h > -0.05) {
      vec2 cp = d.xz / (h + 0.18) * 1.6 + vec2(time * 0.004, time * 0.002);
      float c = fbm(cp * 1.2);
      float cov = smoothstep(1.0 - clouds * 0.75, 1.15 - clouds * 0.5, c + 0.15);
      vec3 cc = mix(cloudCol, cloudCol * 1.25 + sunCol * 0.25 * pow(sd, 3.0), smoothstep(0.4, 0.8, c));
      col = mix(col, cc, cov * smoothstep(-0.05, 0.12, h) * 0.85);
    }
    gl_FragColor = vec4(col, 1.0);
  }`;

function buildEnv() {
  ENV.cur = envState(ENV_PRESETS.title);
  const skyU = {
    top: { value: new THREE.Color() }, hor: { value: new THREE.Color() }, gnd: { value: new THREE.Color() }, sunDir: { value: V3(0, 1, 0) }, sunCol: { value: new THREE.Color() },
    cloudCol: { value: new THREE.Color() }, disc: { value: 0 }, clouds: { value: 0.5 }, aurora: { value: 0 }, stars: { value: 0 }, time: U.time,
  };
  const skyMat = new THREE.ShaderMaterial({
    vertexShader: `varying vec3 vDir; void main(){ vDir = position; vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.0); gl_Position = p.xyww; }`,
    fragmentShader: SKY_FRAG, uniforms: skyU, side: THREE.BackSide, depthWrite: false, depthTest: true, fog: false,
  });
  const sky = new THREE.Mesh(new THREE.SphereGeometry(2000, 32, 16), skyMat);
  sky.frustumCulled = false; sky.renderOrder = -10; sky.name = 'sky';
  R.scene.add(sky); ENV.sky = sky; ENV.skyU = skyU;

  ENV.hemi = new THREE.HemisphereLight(0xffffff, 0xffffff, 1);
  R.scene.add(ENV.hemi);
  const sun = new THREE.DirectionalLight(0xffffff, 1);
  sun.castShadow = true;
  const q = QUALITY[SETTINGS.quality] || QUALITY.balanced;
  sun.shadow.mapSize.set(q.shadow, q.shadow);
  const sc = sun.shadow.camera; sc.left = -26; sc.right = 26; sc.top = 26; sc.bottom = -26; sc.near = 1; sc.far = 160;
  sun.shadow.bias = -0.0006; sun.shadow.normalBias = 0.03;
  R.scene.add(sun); R.scene.add(sun.target);
  ENV.sun = sun;
  // four point lights, always present; switched by intensity, never added or removed (§10.7)
  for (let i = 0; i < 4; i++) {
    const l = new THREE.PointLight(0xffaa66, 0, 26, 2);
    l.castShadow = false; l.userData = { base: 0, flicker: 0, target: 0 };
    R.scene.add(l); ENV.lights.push(l);
  }
  applyEnv();
}
// place one of the four practical lights
function setLight(i, { pos, color, intensity, flicker = 0, dist = 26 } = {}) {
  const l = ENV.lights[i]; if (!l) return;
  if (pos) l.position.set(...(pos.isVector3 ? pos.toArray() : pos));
  if (color != null) l.color.set(color);
  if (intensity != null) { l.userData.base = intensity; }
  l.userData.flicker = flicker; l.distance = dist;
}

const _envV = V3();
function applyEnv() {
  const s = ENV.cur, u = ENV.skyU;
  u.top.value.copy(s.top); u.hor.value.copy(s.hor); u.gnd.value.copy(s.gnd); u.sunDir.value.copy(s.sunDir); u.sunCol.value.copy(s.sun);
  u.cloudCol.value.copy(s.cloud); u.disc.value = s.disc; u.clouds.value = s.clouds; u.aurora.value = s.aurora; u.stars.value = s.stars;
  ENV.hemi.color.copy(s.hemiS); ENV.hemi.groundColor.copy(s.hemiG); ENV.hemi.intensity = s.hemiI * 2.3;
  ENV.sun.color.copy(s.sun); ENV.sun.intensity = s.sunI * 1.5;
  R.scene.fog.color.copy(s.fog); R.scene.fog.density = s.fogD;
  const G2 = R.grade;
  G2.lift.copy(s.lift); G2.gamma.copy(s.gamma); G2.gain.copy(s.gain); G2.tint.copy(s.tint);
  G2.sat = s.sat + ENV.extraSat; G2.contrast = s.contrast; G2.exposure = s.exposure;
  R.post.bloom = s.bloom; R.post.vignette = s.vignette; R.post.grain = s.grain;
  U.snowColor.value.copy(s.snowCol);
}

function updateEnv(dt) {
  if (ENV.t < 1) {
    ENV.t = Math.min(1, ENV.t + dt / ENV.dur);
    const k = EASE.inOutSine(ENV.t), a = ENV.from, b = ENV.to, c = ENV.cur;
    for (const key of ENV_KEYS_COLOR) c[key].copy(a[key]).lerp(b[key], k);
    for (const key of ENV_KEYS_NUM) c[key] = lerp(a[key], b[key], k);
    for (const key of ENV_KEYS_VEC) c[key].copy(a[key]).lerp(b[key], k);
    c.sunDir.normalize();
  }
  applyEnv();
  // rage push (§7.9) layered on top of any grade
  if (ENV.rageMix > 0) { R.grade.contrast += ENV.rageMix * 0.1; R.grade.sat += ENV.rageMix * 0.1; }
  // sky follows the camera
  ENV.sky.position.copy(R.camera.position);
  // shadow box follows what the camera looks at, snapped to texels to stop shimmer
  const f = ENV.focus.copy(CAM.final.aim).lerp(CAM.final.pos, 0.55);
  const sun = ENV.sun, sc = sun.shadow.camera, ts = (sc.right - sc.left) / sun.shadow.mapSize.x;
  f.x = Math.round(f.x / ts) * ts; f.z = Math.round(f.z / ts) * ts; f.y = Math.round(f.y / ts) * ts;
  sun.position.copy(f).addScaledVector(ENV.cur.sunDir, 70);
  sun.target.position.copy(f);
  sun.target.updateMatrixWorld();
  // practical lights flicker
  const t = U.time.value;
  for (let i = 0; i < ENV.lights.length; i++) {
    const l = ENV.lights[i], ud = l.userData;
    let k = 1;
    if (ud.flicker) k = 1 - ud.flicker * (0.5 + 0.5 * Noise.n2(t * 7.3, i * 5.1)) * 0.6 - ud.flicker * 0.2 * Math.max(0, Noise.n2(t * 19, i * 3.3));
    l.intensity = ud.base * k;
    l.visible = true;
  }
}
