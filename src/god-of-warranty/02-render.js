// ================= RENDER =================
// Renderer, render targets and the lens post stack (§10.8):
// scene → CoC (half) → bokeh gather (half) → DOF composite + haze + whip blur → bloom chain → final grade.

const GLSL_COMMON = /* glsl */`
float hash12(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * .1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
float vnoise(vec2 p){ vec2 i = floor(p), f = fract(p); vec2 u = f*f*(3.-2.*f);
  return mix(mix(hash12(i), hash12(i+vec2(1,0)), u.x), mix(hash12(i+vec2(0,1)), hash12(i+vec2(1,1)), u.x), u.y); }
float fbm(vec2 p){ float a = 0., w = .5; for (int i = 0; i < 5; i++){ a += w * vnoise(p); p = p * 2.03 + vec2(17.1, 9.2); w *= .5; } return a; }
`;

const FSQ_VERT = /* glsl */`
varying vec2 vUv;
void main(){ vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

const R = {
  renderer: null, canvas: null, scene: null, camera: null,
  displayW: 1, displayH: 1, w: 1, h: 1, scale: 1, dpr: 1,
  rtScene: null, rtHalf: null, rtDof: null, rtComp: null, bloomRTs: [],
  quadScene: null, quadCam: null, quad: null, mats: {},
  preRenders: [],
  frameMs: 16, dynTimer: 0,
  grade: null, post: null,
  stats: { calls: 0, tris: 0 },
};

function makeQuadMat(frag, uniforms) {
  return new THREE.ShaderMaterial({ vertexShader: FSQ_VERT, fragmentShader: frag, uniforms, depthTest: false, depthWrite: false });
}

function initRenderer() {
  const canvas = $('gl');
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance', alpha: false, stencil: false, depth: true, preserveDrawingBuffer: !!URLQ.get('shot') });
  } catch (e) { throw new Error('WebGL 2 is not available in this browser.'); }
  if (!renderer.capabilities.isWebGL2) throw new Error('This game needs WebGL 2.');
  renderer.autoClear = true;
  renderer.toneMapping = THREE.NoToneMapping;
  renderer.outputColorSpace = THREE.LinearSRGBColorSpace; // the final pass encodes sRGB itself
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.shadowMap.autoUpdate = true;
  R.renderer = renderer; R.canvas = canvas;

  R.scene = new THREE.Scene();
  R.scene.fog = new THREE.FogExp2(0x9fb3c2, 0.004);
  R.scene.background = null;
  R.camera = new THREE.PerspectiveCamera(38, 16 / 9, 0.08, 2600);
  R.camera.position.set(0, 120, 0);
  R.scene.add(R.camera);

  R.quadScene = new THREE.Scene();
  R.quadCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]), 3));
  R.quad = new THREE.Mesh(g, null); R.quad.frustumCulled = false; R.quadScene.add(R.quad);

  // Grade + post state, driven by the director's per-scene grades (§10.9)
  R.grade = {
    lift: V3(0, 0, 0), gamma: V3(1, 1, 1), gain: V3(1, 1, 1), sat: 1, tint: V3(1, 1, 1), contrast: 1, exposure: 1,
  };
  R.post = {
    focal: 35, fStop: 5.6, focusDist: 3, dof: 1, bloom: 0.55, bloomThreshold: 0.9, vignette: 0.35, grain: 0.05, ca: 0.6,
    haze: V3(0.5, 0.5, 0), hazeR: 0.1, whip: new THREE.Vector2(0, 0), wipe: 0, wipeType: 1, fade: 0, desat: 0, rage: 0, hold: 0,
    flash: 0, time: 0, lowHealth: 0,
  };
  buildPostMaterials();
  window.addEventListener('resize', () => resizeRenderer(true));
  resizeRenderer(true);
}

function buildPostMaterials() {
  const P = R.post;
  // 1. CoC + downsample to half res. rgb = colour, a = signed CoC in half-res pixels (negative = near field)
  R.mats.coc = makeQuadMat(/* glsl */`
    precision highp float;
    varying vec2 vUv;
    uniform sampler2D tColor, tDepth;
    uniform float near, far, focal, fstop, focus, imgH, maxCoc, strength;
    uniform vec2 texel;
    float linDepth(float d){ float z = d * 2.0 - 1.0; return (2.0 * near * far) / (far + near - z * (far - near)); }
    float coc(float D){ float f = focal * 0.001; float S = max(focus, f * 1.5);
      float c = (f * f / (fstop * (S - f))) * (D - S) / D; return clamp(c * (imgH / 0.024) * 0.5 * strength, -maxCoc, maxCoc); }
    void main(){
      vec2 o = texel * 0.5;
      vec3 c = texture2D(tColor, vUv + vec2(-o.x, -o.y)).rgb + texture2D(tColor, vUv + vec2(o.x, -o.y)).rgb
             + texture2D(tColor, vUv + vec2(-o.x, o.y)).rgb + texture2D(tColor, vUv + vec2(o.x, o.y)).rgb;
      float d0 = linDepth(texture2D(tDepth, vUv + vec2(-o.x, -o.y)).r), d1 = linDepth(texture2D(tDepth, vUv + vec2(o.x, -o.y)).r);
      float d2 = linDepth(texture2D(tDepth, vUv + vec2(-o.x, o.y)).r), d3 = linDepth(texture2D(tDepth, vUv + vec2(o.x, o.y)).r);
      float dn = min(min(d0, d1), min(d2, d3));
      float cn = coc(dn), cf = coc((d0 + d1 + d2 + d3) * 0.25);
      gl_FragColor = vec4(min(c * 0.25, vec3(64.0)), cn < 0.0 ? cn : cf);
    }`, {
    tColor: { value: null }, tDepth: { value: null }, near: { value: 0.08 }, far: { value: 2600 }, focal: { value: 35 }, fstop: { value: 4 }, focus: { value: 3 },
    imgH: { value: 1080 }, maxCoc: { value: 6 }, strength: { value: 1 }, texel: { value: new THREE.Vector2() },
  });
  // 2. Bokeh gather (Vogel disc, scatter-as-gather). a = near-field coverage
  R.mats.gather = makeQuadMat(/* glsl */`
    precision highp float;
    varying vec2 vUv;
    uniform sampler2D tHalf;
    uniform vec2 texel;
    uniform float maxCoc;
    #define TAPS __TAPS__
    void main(){
      vec4 c0 = texture2D(tHalf, vUv);
      float cs = abs(c0.a);
      vec3 col = c0.rgb; float tot = 1.0; float nearCov = 0.0;
      if (maxCoc < 0.5) { gl_FragColor = vec4(col, 0.0); return; }
      for (int i = 0; i < TAPS; i++) {
        float fi = float(i) + 0.5;
        float r = sqrt(fi / float(TAPS)) * maxCoc;
        float a = fi * 2.39996323;
        vec4 s = texture2D(tHalf, vUv + vec2(cos(a), sin(a)) * r * texel);
        float ss = abs(s.a);
        if (s.a > c0.a) ss = min(ss, cs * 2.0);         // a farther sample can't bleed over a nearer one
        float m = smoothstep(r - 0.5, r + 0.5, ss);
        col += mix(col / tot, s.rgb, m); tot += 1.0;
        if (s.a < -0.6 && s.a < c0.a) nearCov = max(nearCov, m * smoothstep(0.6, 2.2, -s.a));
      }
      gl_FragColor = vec4(col / tot, nearCov);
    }`.replace('__TAPS__', '32'), { tHalf: { value: null }, texel: { value: new THREE.Vector2() }, maxCoc: { value: 6 } });
  // 3. Composite sharp/blurred + heat haze + directional (whip) blur
  R.mats.comp = makeQuadMat(/* glsl */`
    precision highp float;
    varying vec2 vUv;
    uniform sampler2D tColor, tDof, tHalf;
    uniform vec2 whip; uniform vec3 haze; uniform float hazeR, time, aspect, dofOn;
    ${GLSL_COMMON}
    void main(){
      vec2 uv = vUv;
      if (haze.z > 0.001) {
        vec2 d = (uv - haze.xy) * vec2(aspect, 1.0);
        float m = smoothstep(hazeR, hazeR * 0.25, length(d * vec2(1.0, 0.6))) * smoothstep(-0.05, 0.12, uv.y - haze.y + hazeR * 0.4);
        vec2 n = vec2(vnoise(uv * 38.0 + vec2(0.0, -time * 3.1)), vnoise(uv * 41.0 + vec2(5.2, -time * 2.7))) - 0.5;
        uv += n * 0.012 * m * haze.z;
      }
      vec4 sharp = texture2D(tColor, uv);
      vec4 bl = texture2D(tDof, uv);
      float cocC = abs(texture2D(tHalf, uv).a);
      float f = max(smoothstep(0.35, 1.4, cocC), bl.a) * dofOn;
      vec3 col = mix(sharp.rgb, bl.rgb, f);
      float wl = length(whip);
      if (wl > 0.0005) {
        vec3 acc = col; float n = 1.0;
        for (int i = 1; i <= 8; i++) { float t = float(i) / 8.0 - 0.5; acc += texture2D(tColor, uv + whip * t).rgb; n += 1.0; }
        col = mix(col, acc / n, smoothstep(0.0005, 0.004, wl));
      }
      gl_FragColor = vec4(col, 1.0);
    }`, {
    tColor: { value: null }, tDof: { value: null }, tHalf: { value: null }, whip: { value: P.whip }, haze: { value: P.haze }, hazeR: { value: 0.1 },
    time: { value: 0 }, aspect: { value: 1.7 }, dofOn: { value: 1 },
  });
  // 4. Bloom chain (dual filter)
  R.mats.bloomPre = makeQuadMat(/* glsl */`
    precision highp float; varying vec2 vUv; uniform sampler2D tSrc; uniform vec2 texel; uniform float threshold;
    void main(){
      vec3 c = texture2D(tSrc, vUv).rgb * 4.0 + texture2D(tSrc, vUv + texel * vec2(-1,-1)).rgb + texture2D(tSrc, vUv + texel * vec2(1,-1)).rgb
             + texture2D(tSrc, vUv + texel * vec2(-1,1)).rgb + texture2D(tSrc, vUv + texel * vec2(1,1)).rgb;
      c /= 8.0;
      float br = max(c.r, max(c.g, c.b));
      float knee = threshold * 0.5;
      float soft = clamp(br - threshold + knee, 0.0, 2.0 * knee); soft = soft * soft / (4.0 * knee + 1e-4);
      float contrib = max(soft, br - threshold) / max(br, 1e-4);
      gl_FragColor = vec4(min(c * contrib, vec3(32.0)), 1.0);
    }`, { tSrc: { value: null }, texel: { value: new THREE.Vector2() }, threshold: { value: 0.9 } });
  R.mats.down = makeQuadMat(/* glsl */`
    precision highp float; varying vec2 vUv; uniform sampler2D tSrc; uniform vec2 texel;
    void main(){ vec2 o = texel * 0.5;
      vec3 c = texture2D(tSrc, vUv).rgb * 4.0 + texture2D(tSrc, vUv - o).rgb + texture2D(tSrc, vUv + o).rgb
             + texture2D(tSrc, vUv + vec2(o.x, -o.y)).rgb + texture2D(tSrc, vUv - vec2(o.x, -o.y)).rgb;
      gl_FragColor = vec4(c / 8.0, 1.0); }`, { tSrc: { value: null }, texel: { value: new THREE.Vector2() } });
  R.mats.up = makeQuadMat(/* glsl */`
    precision highp float; varying vec2 vUv; uniform sampler2D tSrc, tAdd; uniform vec2 texel; uniform float mixAmt;
    void main(){ vec2 o = texel * 0.5;
      vec3 c = texture2D(tSrc, vUv + vec2(-o.x * 2.0, 0.0)).rgb + texture2D(tSrc, vUv + vec2(-o.x, o.y)).rgb * 2.0
             + texture2D(tSrc, vUv + vec2(0.0, o.y * 2.0)).rgb + texture2D(tSrc, vUv + vec2(o.x, o.y)).rgb * 2.0
             + texture2D(tSrc, vUv + vec2(o.x * 2.0, 0.0)).rgb + texture2D(tSrc, vUv + vec2(o.x, -o.y)).rgb * 2.0
             + texture2D(tSrc, vUv + vec2(0.0, -o.y * 2.0)).rgb + texture2D(tSrc, vUv + vec2(-o.x, -o.y)).rgb * 2.0;
      gl_FragColor = vec4(c / 12.0 + texture2D(tAdd, vUv).rgb * mixAmt, 1.0); }`, { tSrc: { value: null }, tAdd: { value: null }, texel: { value: new THREE.Vector2() }, mixAmt: { value: 1 } });
  // 5. Final: tonemap → grade → CA → vignette → grain → dither → wipes and fades
  R.mats.final = makeQuadMat(/* glsl */`
    precision highp float;
    varying vec2 vUv;
    uniform sampler2D tComp, tBloom;
    uniform vec2 res; uniform float time, exposure, bloomStr, sat, contrast, vignette, grain, ca;
    uniform vec3 lift, gamma, gain, tint;
    uniform float wipe, wipeType, fade, desat, rage, hold, flash, lowHealth;
    ${GLSL_COMMON}
    vec3 aces(vec3 x){ const float a = 2.51, b = 0.03, c = 2.43, d = 0.59, e = 0.14; return clamp((x * (a * x + b)) / (x * (c * x + d) + e), 0.0, 1.0); }
    vec3 toSRGB(vec3 c){ c = clamp(c, 0.0, 1.0); return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(0.0031308, c)); }
    float luma(vec3 c){ return dot(c, vec3(0.2126, 0.7152, 0.0722)); }
    void main(){
      vec2 uv = vUv;
      vec2 d = uv - 0.5;
      float r2 = dot(d, d);
      vec2 off = d * r2 * ca * 4.0 / res;
      vec3 col;
      col.r = texture2D(tComp, uv + off).r; col.g = texture2D(tComp, uv).g; col.b = texture2D(tComp, uv - off).b;
      col += texture2D(tBloom, uv).rgb * bloomStr;
      col *= exposure;
      col = aces(col);
      col = toSRGB(col);
      // grade
      col = gain * (col + lift * (1.0 - col));
      col = pow(max(col, 0.0), 1.0 / gamma);
      col = (col - 0.5) * contrast + 0.5;
      float l = luma(col);
      col = mix(vec3(l), col, sat);
      col *= tint;
      // Rage: red-gold push
      if (rage > 0.0) { float lr = luma(col); col = mix(col, vec3(lr * 1.35, lr * 0.82, lr * 0.32) + vec3(0.06, 0.0, -0.02), rage * 0.55); }
      // Hold Pattern: on-hold blue hush
      if (hold > 0.0) { col = mix(col, vec3(luma(col)) * vec3(0.78, 0.95, 1.08), hold * 0.5); }
      if (desat > 0.0) { col = mix(col, vec3(luma(col)) * 0.75, desat); }
      // vignette
      float vig = smoothstep(0.95, 0.18, length(d * vec2(1.0, 0.86)) * (1.0 + lowHealth * 0.35));
      col *= mix(1.0, vig, vignette + lowHealth * 0.35);
      if (lowHealth > 0.0) col = mix(col, col * vec3(1.0, 0.7, 0.7), lowHealth * 0.25 * (1.0 - vig));
      // grain (animated, luminance weighted)
      float gn = hash12(uv * res + fract(time * 13.37) * 400.0) - 0.5;
      col += gn * grain * (1.0 - luma(col) * 0.6);
      col += flash;
      // wipes: smoke (1), canopy (2), cloak (3). Coverage reaches 100% at wipe = 1
      if (wipe > 0.0) {
        vec2 p = uv * vec2(res.x / res.y, 1.0);
        float n = fbm(p * 3.0 + vec2(time * 0.05, -time * 0.11));
        float n2 = fbm(p * 7.0 - vec2(time * 0.08, time * 0.21));
        float cover = smoothstep(0.0, 0.25, wipe * 1.35 - (1.0 - n) * 0.6 + n2 * 0.1);
        vec3 wc;
        if (wipeType < 1.5) {
          wc = mix(vec3(0.62, 0.62, 0.64), vec3(0.93, 0.92, 0.9), n);
          float em = smoothstep(0.92, 0.99, hash12(floor(p * 90.0 + vec2(0.0, time * 4.0))));
          wc += vec3(1.0, 0.55, 0.2) * em * 0.8 * n2;
        } else if (wipeType < 2.5) {
          float needles = fbm(vec2(p.x * 40.0, p.y * 6.0) + n * 3.0);
          wc = mix(vec3(0.02, 0.05, 0.035), vec3(0.08, 0.15, 0.1), needles);
          wc = mix(wc, vec3(0.86, 0.9, 0.95), smoothstep(0.62, 0.8, n2) * 0.9);
        } else {
          float weave = sin(uv.y * res.y * 0.9) * 0.5 + 0.5;
          wc = mix(vec3(0.07, 0.1, 0.11), vec3(0.17, 0.22, 0.23), n * 0.8 + weave * 0.08);
        }
        col = mix(col, wc, cover);
      }
      col = mix(col, vec3(0.0), fade);
      // ordered dither to kill banding in fog
      col += (hash12(gl_FragCoord.xy) - 0.5) / 255.0;
      gl_FragColor = vec4(col, 1.0);
    }`, {
    tComp: { value: null }, tBloom: { value: null }, res: { value: new THREE.Vector2() }, time: { value: 0 }, exposure: { value: 1 }, bloomStr: { value: 0.5 },
    sat: { value: 1 }, contrast: { value: 1 }, vignette: { value: 0.35 }, grain: { value: 0.05 }, ca: { value: 0.6 },
    lift: { value: R.grade.lift }, gamma: { value: R.grade.gamma }, gain: { value: R.grade.gain }, tint: { value: R.grade.tint },
    wipe: { value: 0 }, wipeType: { value: 1 }, fade: { value: 0 }, desat: { value: 0 }, rage: { value: 0 }, hold: { value: 0 }, flash: { value: 0 }, lowHealth: { value: 0 },
  });
}

function setDofTaps(n) {
  const m = R.mats.gather;
  m.fragmentShader = m.fragmentShader.replace(/#define TAPS \d+/, '#define TAPS ' + n);
  m.needsUpdate = true;
}

function makeRT(w, h, opts = {}) {
  const rt = new THREE.WebGLRenderTarget(Math.max(1, w | 0), Math.max(1, h | 0), {
    type: THREE.HalfFloatType, format: THREE.RGBAFormat, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter,
    depthBuffer: !!opts.depth, stencilBuffer: false, samples: opts.samples || 0, generateMipmaps: false,
  });
  rt.texture.colorSpace = THREE.LinearSRGBColorSpace;
  if (opts.depth) { rt.depthTexture = new THREE.DepthTexture(rt.width, rt.height, THREE.FloatType); rt.depthTexture.minFilter = THREE.NearestFilter; rt.depthTexture.magFilter = THREE.NearestFilter; }
  return rt;
}

function resizeRenderer(force) {
  const q = QUALITY[SETTINGS.quality] || QUALITY.balanced;
  const dw = Math.max(320, window.innerWidth), dh = Math.max(200, window.innerHeight);
  const dpr = Math.min(window.devicePixelRatio || 1, q.pixelRatioCap);
  R.displayW = dw; R.displayH = dh; R.dpr = dpr;
  R.renderer.setPixelRatio(dpr);
  R.renderer.setSize(dw, dh, false);
  R.camera.aspect = dw / dh; R.camera.updateProjectionMatrix();
  let iw = Math.round(dw * dpr * R.scale * q.res * SETTINGS.resScale), ih = Math.round(dh * dpr * R.scale * q.res * SETTINGS.resScale);
  if (SETTINGS.retro480) { ih = 480; iw = Math.round(480 * dw / dh); }
  iw = Math.max(160, iw); ih = Math.max(90, ih);
  if (!force && iw === R.w && ih === R.h) return;
  R.w = iw; R.h = ih;
  [R.rtScene, R.rtHalf, R.rtDof, R.rtComp, ...R.bloomRTs].forEach(rt => rt && rt.dispose());
  R.rtScene = makeRT(iw, ih, { depth: true, samples: q.msaa });
  R.rtHalf = makeRT(iw / 2, ih / 2);
  R.rtDof = makeRT(iw / 2, ih / 2);
  R.rtComp = makeRT(iw, ih);
  const nearest = SETTINGS.retro480 ? THREE.NearestFilter : THREE.LinearFilter;
  R.rtComp.texture.minFilter = R.rtComp.texture.magFilter = nearest;
  (R.bloomUp || []).forEach(rt => rt.dispose());
  R.bloomRTs = []; R.bloomUp = [];
  let bw = iw / 2, bh = ih / 2;
  for (let i = 0; i < q.bloom; i++) { R.bloomRTs.push(makeRT(bw, bh)); R.bloomUp.push(makeRT(bw, bh)); bw /= 2; bh /= 2; }
  const fc = $('fx2d'); fc.width = Math.round(dw * Math.min(dpr, 1.5)); fc.height = Math.round(dh * Math.min(dpr, 1.5));
  if (typeof UI !== 'undefined' && UI.fxScale !== undefined) UI.fxScale = fc.width / dw;
}

function blit(mat, target) { R.quad.material = mat; R.renderer.setRenderTarget(target); R.renderer.render(R.quadScene, R.quadCam); }

function renderFrame(dt, realDt) {
  const r = R.renderer, P = R.post, cam = R.camera;
  for (const f of R.preRenders) f(dt);
  // main scene
  r.setRenderTarget(R.rtScene);
  r.render(R.scene, cam);
  R.stats.calls = r.info.render.calls; R.stats.tris = r.info.render.triangles;
  const q = QUALITY[SETTINGS.quality] || QUALITY.balanced;
  const dofOn = SETTINGS.dof ? P.dof : 0;
  const maxCoc = 12 * (R.h / 1080) * 0.5 * (q.dofTaps >= 32 ? 1 : 0.8);
  // CoC
  const mc = R.mats.coc.uniforms;
  mc.tColor.value = R.rtScene.texture; mc.tDepth.value = R.rtScene.depthTexture;
  mc.near.value = cam.near; mc.far.value = cam.far; mc.focal.value = P.focal; mc.fstop.value = P.fStop; mc.focus.value = P.focusDist;
  mc.imgH.value = R.h; mc.maxCoc.value = Math.max(0.01, maxCoc); mc.strength.value = dofOn; mc.texel.value.set(1 / R.w, 1 / R.h);
  blit(R.mats.coc, R.rtHalf);
  // gather
  const mg = R.mats.gather.uniforms;
  mg.tHalf.value = R.rtHalf.texture; mg.texel.value.set(1 / R.rtHalf.width, 1 / R.rtHalf.height); mg.maxCoc.value = dofOn > 0.01 ? maxCoc : 0;
  blit(R.mats.gather, R.rtDof);
  // composite
  const mp = R.mats.comp.uniforms;
  mp.tColor.value = R.rtScene.texture; mp.tDof.value = R.rtDof.texture; mp.tHalf.value = R.rtHalf.texture;
  mp.time.value = P.time; mp.aspect.value = R.w / R.h; mp.hazeR.value = P.hazeR; mp.dofOn.value = dofOn > 0.01 ? 1 : 0;
  if (!SETTINGS.motionBlur || q.motionBlur === 0) P.whip.set(0, 0);
  blit(R.mats.comp, R.rtComp);
  // bloom
  const B = R.bloomRTs;
  if (B.length && SETTINGS.bloom) {
    const bp = R.mats.bloomPre.uniforms; bp.tSrc.value = R.rtComp.texture; bp.texel.value.set(1 / R.w, 1 / R.h); bp.threshold.value = P.bloomThreshold;
    blit(R.mats.bloomPre, B[0]);
    const md = R.mats.down.uniforms;
    for (let i = 1; i < B.length; i++) { md.tSrc.value = B[i - 1].texture; md.texel.value.set(1 / B[i - 1].width, 1 / B[i - 1].height); blit(R.mats.down, B[i]); }
    const mu = R.mats.up.uniforms, UP2 = R.bloomUp;
    let src = B[B.length - 1];
    for (let i = B.length - 2; i >= 0; i--) { mu.tSrc.value = src.texture; mu.tAdd.value = B[i].texture; mu.texel.value.set(1 / src.width, 1 / src.height); mu.mixAmt.value = 1; blit(R.mats.up, UP2[i]); src = UP2[i]; }
    R.bloomOut = src;
  }
  // final
  const mf = R.mats.final.uniforms;
  mf.tComp.value = R.rtComp.texture; mf.tBloom.value = B.length && R.bloomOut ? R.bloomOut.texture : R.rtComp.texture;
  mf.res.value.set(r.domElement.width, r.domElement.height);
  mf.time.value = P.time; mf.exposure.value = R.grade.exposure; mf.bloomStr.value = SETTINGS.bloom && B.length ? P.bloom : 0;
  mf.sat.value = R.grade.sat; mf.contrast.value = R.grade.contrast; mf.vignette.value = P.vignette;
  mf.grain.value = SETTINGS.grain ? P.grain : 0; mf.ca.value = SETTINGS.ca ? P.ca : 0;
  mf.wipe.value = P.wipe; mf.wipeType.value = P.wipeType; mf.fade.value = P.fade; mf.desat.value = P.desat; mf.rage.value = P.rage; mf.hold.value = P.hold;
  mf.flash.value = P.flash; mf.lowHealth.value = P.lowHealth;
  blit(R.mats.final, null);

  // dynamic resolution (frame-time driven, 5% steps, 50–100%)
  if (q.dynRes && !SETTINGS.retro480) {
    R.frameMs = lerp(R.frameMs, realDt * 1000, 0.05);
    R.dynTimer += realDt;
    if (R.dynTimer > 1.5) {
      R.dynTimer = 0;
      const target = 1000 / 60;
      let s = R.scale;
      if (R.frameMs > target * 1.18) s -= 0.05; else if (R.frameMs < target * 0.85) s += 0.05;
      s = clamp(s, 0.5, 1);
      if (Math.abs(s - R.scale) > 0.001) { R.scale = s; resizeRenderer(false); }
    }
  }
}

// Compile every material while everything is visible, so the take never hitches (§12.4)
async function warmShaders(extraRoots = []) {
  const hidden = [];
  const reveal = o => o.traverse(c => { if (!c.visible) { hidden.push(c); c.visible = true; } });
  reveal(R.scene); extraRoots.forEach(reveal);
  try {
    if (R.renderer.compileAsync) await R.renderer.compileAsync(R.scene, R.camera);
    else R.renderer.compile(R.scene, R.camera);
    for (const root of extraRoots) R.renderer.compile(root, R.camera);
  } catch (e) { console.warn('warm-up', e); }
  // one real frame through the whole stack
  R.renderer.setRenderTarget(R.rtScene); R.renderer.render(R.scene, R.camera);
  hidden.forEach(c => { c.visible = false; });
  for (const k in R.mats) { R.quad.material = R.mats[k]; R.renderer.compile(R.quadScene, R.quadCam); }
}
