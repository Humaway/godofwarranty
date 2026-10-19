// ================= WORLD: the Lake of Nine Bars, the Mountain, the World Cable =================
function farMaterial(haze, opts = {}) {
  const m = new THREE.MeshLambertMaterial({ vertexColors: true, fog: false, ...opts });
  m.userData.haze = { value: haze };
  m.customProgramCacheKey = () => 'far';
  m.onBeforeCompile = sh => {
    sh.uniforms.uFarFog = { value: R.scene.fog.color }; sh.uniforms.uHaze = m.userData.haze;
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nuniform vec3 uFarFog; uniform float uHaze;')
      .replace('#include <dithering_fragment>', '#include <dithering_fragment>\ngl_FragColor.rgb = mix(gl_FragColor.rgb, uFarFog, uHaze);');
  };
  return m;
}

function buildBay() {
  // the ice
  TEX.ice.repeat.set(220, 220);
  const ice = new THREE.Mesh(new THREE.PlaneGeometry(6000, 6000, 1, 1), MATS.ice);
  ice.rotation.x = -PI / 2; ice.position.set(1500, 0.02, 0); ice.receiveShadow = true; ice.name = 'ice';
  R.scene.add(ice);
  // floes, snow-capped
  const fl = new GB(), r = mulberry32(404);
  for (let i = 0; i < 90; i++) {
    const x = 70 + r() * 900, z = -500 + r() * 1100; if (x < 120 && z > 120 && z < 175) continue;
    const g = new THREE.CylinderGeometry(1, 1, 1, 7, 1); const p = g.attributes.position;
    for (let k = 0; k < p.count; k++) { const a = Math.atan2(p.getZ(k), p.getX(k)), j = 0.65 + 0.35 * Noise.n2(Math.cos(a) * 2 + i, Math.sin(a) * 2); p.setX(k, p.getX(k) * j); p.setZ(k, p.getZ(k) * j); }
    const s = 3 + r() * 11; fl.add(g, { pos: [x, 0.15, z], scale: [s, 0.35 + r() * 0.4, s * (0.6 + r() * 0.6)], rot: [0, r() * 3, 0], color: 0xdbe5ec });
  }
  // islands, far shore
  for (const [x, z, s] of [[720, -260, 70], [980, 120, 110], [640, 420, 60], [1300, -500, 160], [1500, 300, 220]]) fl.add(new THREE.SphereGeometry(1, 14, 8, 0, TAU, 0, PI / 2), { pos: [x, -2, z], scale: [s, s * 0.32, s * 0.8], color: 0xcfd9e2 });
  const floes = new THREE.Mesh(fl.build(), patchWorld(new THREE.MeshLambertMaterial({ vertexColors: true }), { snow: 1 }));
  floes.receiveShadow = true; R.scene.add(floes);

  // the hill ring around the play area (west, north, south)
  const ring = new THREE.RingGeometry(360, 1100, 160, 6);
  ring.rotateX(-PI / 2);
  const rp = ring.attributes.position, rc = new Float32Array(rp.count * 3), col = new THREE.Color();
  for (let k = 0; k < rp.count; k++) {
    const x = rp.getX(k), z = rp.getZ(k) - 20, d = Math.hypot(x, z), a = Math.atan2(z, x);
    const east = smoothstep(-0.2, 0.6, Math.cos(a)); // the bay side stays low
    let h = (Noise.fbm2(x * 0.004, z * 0.004, 4) * 0.5 + 0.6) * smoothstep(360, 600, d) * 170 * (1 - east * 0.9) + 18 * (1 - east);
    rp.setY(k, h - 4); rp.setZ(k, z + 20);
    col.setHex(0x1d2f2c).lerp(new THREE.Color(0xe8eef3), smoothstep(70, 140, h) * 0.9);
    rc.set([col.r, col.g, col.b], k * 3);
  }
  ring.setAttribute('color', new THREE.BufferAttribute(rc, 3)); ring.computeVertexNormals();
  const hills = new THREE.Mesh(ring, farMaterial(0.55, { side: THREE.DoubleSide })); hills.position.set(20, 0, -20); R.scene.add(hills);

  // the Mountain, far south-west, bristling with ancient transmission towers
  const M = LOC.mountain;
  const mg = new THREE.ConeGeometry(420, 470, 48, 14), mp = mg.attributes.position, mc = new Float32Array(mp.count * 3);
  for (let k = 0; k < mp.count; k++) {
    const x = mp.getX(k), y = mp.getY(k), z = mp.getZ(k), t = (y + 235) / 470;
    const n = Noise.fbm2(x * 0.01, z * 0.01 + y * 0.005, 4);
    const j = 1 + n * 0.28 * (1 - t);
    mp.setXYZ(k, x * j, y + n * 40 * (1 - t * 0.5), z * j);
    col.setHex(0x55626e).lerp(new THREE.Color(0xf2f6fa), smoothstep(0.35, 0.55, t + n * 0.2));
    mc.set([col.r, col.g, col.b], k * 3);
  }
  mg.setAttribute('color', new THREE.BufferAttribute(mc, 3)); mg.computeVertexNormals();
  const mtn = new THREE.Mesh(mg, farMaterial(0.42)); mtn.position.set(M.x, 230, M.z); R.scene.add(mtn);
  const twr = new GB(), blink = [];
  for (let i = 0; i < 6; i++) {
    const a = i * 1.1, rr = i === 0 ? 0 : 40 + i * 22, x = M.x + Math.cos(a) * rr, z = M.z + Math.sin(a) * rr, base = 455 - rr * 0.9, h = 38 + (i % 3) * 14;
    twr.box(2.2, h, 2.2, { pos: [x, base + h / 2, z], color: 0x2a3036 });
    twr.box(9, 1.2, 1.2, { pos: [x, base + h * 0.8, z], color: 0x2a3036 });
    blink.push(V3(x, base + h + 1.5, z));
  }
  R.scene.add(new THREE.Mesh(twr.build(), farMaterial(0.35)));
  OBJ.towerLights = blink.map((p, i) => { const s = sprite(TEX.disc || (TEX.disc = softDiscTex(64)), 22, { color: 0xff2a1a, blending: THREE.AdditiveBlending, fog: false }); s.position.copy(p); s.userData.ph = i * 0.7; R.scene.add(s); return s; });

  // a long line of still figures, far out on the ice (seen in the eulogy)
  const fig = new GB().cyl(0.22, 0.28, 1.6, 6, { pos: [0, 0.8, 0], color: 0x3a4a52 }).sphere(0.17, 6, 5, { pos: [0, 1.75, 0], color: 0x3a4a52 }).build();
  const n = 46, qm = new THREE.InstancedMesh(fig, farMaterial(0.32), n), m4 = new THREE.Matrix4();
  for (let i = 0; i < n; i++) m4.compose(V3(240 + i * 0.9 + Math.sin(i) * 0.6, 0, -150 + i * 3.1), new THREE.Quaternion().setFromAxisAngle(UP, 2.2), V3(1, 0.9 + (i % 4) * 0.06, 1)), qm.setMatrixAt(i, m4);
  R.scene.add(qm); OBJ.farQueue = qm;
  buildCable();
}

// ---------- The World Cable ----------
const CABLE = { segs: 64, len: 640, rise: 0, bow: 0, t: 0, mesh: null, bands: null, head: null, crack: null, active: false };
function buildCable() {
  const seg = new GB();
  seg.cyl(5.2, 5.2, 10.4, 12, { rot: [PI / 2, 0, 0], color: 0x2e3a3c, jitter: 0.15 });
  seg.cyl(6.0, 6.0, 2.4, 12, { rot: [PI / 2, 0, 0], pos: [0, 0, 3.2], color: 0x3d4a4c });
  seg.cyl(6.0, 6.0, 2.4, 12, { rot: [PI / 2, 0, 0], pos: [0, 0, -3.2], color: 0x3d4a4c });
  const r = mulberry32(8);
  for (let i = 0; i < 9; i++) { const a = r() * TAU; seg.ico(0.7 + r() * 0.8, 0, { pos: [Math.cos(a) * 5.6, Math.sin(a) * 5.6, (r() - .5) * 9], color: 0x8c8f84 }); }
  for (let i = 0; i < 6; i++) { const a = PI + (r() - .5) * 1.6; seg.box(0.25, 5 + r() * 4, 0.6, { pos: [Math.cos(a) * 5.4, Math.sin(a) * 5.4 - 3, (r() - .5) * 8], color: 0x24402a }); }
  const im = new THREE.InstancedMesh(seg.build(), farMaterial(0.28), CABLE.segs);
  im.frustumCulled = false; R.scene.add(im); CABLE.mesh = im;
  const band = new THREE.TorusGeometry(5.6, 0.45, 5, 18);
  const bm = new THREE.MeshBasicMaterial({ color: 0xffffff, fog: false });
  const bands = new THREE.InstancedMesh(band, bm, CABLE.segs);
  bands.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(CABLE.segs * 3), 3);
  bands.frustumCulled = false; R.scene.add(bands); CABLE.bands = bands;
  const head = new THREE.Group();
  head.add(new GB().cyl(5.8, 6.6, 12, 12, { rot: [PI / 2, 0, 0], color: 0x3d4a4c }).cone(6.2, 9, 12, { rot: [PI / 2, 0, 0], pos: [0, 0, 10.4], color: 0x2e3a3c })
    .box(14, 1.2, 3, { pos: [0, -2, 4], color: 0x2a3436 }).mesh(farMaterial(0.28)));
  for (const s of [-1, 1]) { const e = new THREE.Mesh(new THREE.SphereGeometry(1.1, 8, 6), MATS.tealGlow); e.position.set(s * 3.6, 2.2, 8.4); head.add(e); }
  const lens = new THREE.Mesh(new THREE.CircleGeometry(2.4, 14), glow(0.5, 4, 3.6)); lens.position.set(0, 0, 14.95); head.add(lens);
  R.scene.add(head); CABLE.head = head;
  // the split in the ice
  const cg = new THREE.PlaneGeometry(14, CABLE.len, 1, 40); cg.rotateX(-PI / 2);
  const cp = cg.attributes.position; for (let k = 0; k < cp.count; k++) { const z = cp.getZ(k); cp.setX(k, cp.getX(k) * (0.6 + 0.4 * Noise.n2(z * 0.05, 1)) + cableX(z + CABLE.z0())); }
  const crack = new THREE.Mesh(cg, new THREE.MeshBasicMaterial({ color: 0x050d12, transparent: true, opacity: 0, depthWrite: false }));
  crack.position.set(0, 0.06, CABLE.z0() + CABLE.len / 2); crack.renderOrder = 1; R.scene.add(crack); CABLE.crack = crack;
  setCable(0);
}
CABLE.z0 = () => LOC.cable.z - CABLE.len / 2;
function cableX(z) { return LOC.cable.x + Math.sin(z * 0.009) * 38; }
// body height: two humps and the head, scaled by rise; the head bows with `bow`
function cableY(s, rise, bow) {
  const hump = (c, w, h) => { const d = (s - c) / w; return Math.abs(d) < 1 ? Math.cos(d * PI / 2) * h : 0; };
  let y = -28 + rise * (hump(0.32, 0.12, 62) + hump(0.58, 0.1, 50) + hump(0.86, 0.13, 76 - bow * 30));
  return y;
}
const _cm = new THREE.Matrix4(), _cq = new THREE.Quaternion(), _cs = V3(1, 1, 1), _cp = V3(), _cn = V3(), _cc = new THREE.Color();
function setCable(t) {
  const N = CABLE.segs, rise = CABLE.rise, bow = CABLE.bow, z0 = CABLE.z0();
  const posAt = (s, out) => { const z = z0 + s * CABLE.len * 0.92; return out.set(cableX(z), cableY(s, rise, bow), z); };
  for (let i = 0; i < N; i++) {
    const s = i / N;
    posAt(s, _cp); posAt(s + 0.5 / N, _cn);
    _cq.setFromUnitVectors(_v[10].set(0, 0, 1), _cn.sub(_cp).normalize());
    _cm.compose(_cp, _cq, _cs); CABLE.mesh.setMatrixAt(i, _cm); CABLE.bands.setMatrixAt(i, _cm);
    const pulse = Math.pow(Math.max(0, Math.sin((s * 9 - t * 1.6) * PI)), 16) * 3.5 + 0.25;
    _cc.setRGB(0.12 * pulse, 1.4 * pulse, 1.3 * pulse); CABLE.bands.setColorAt(i, _cc);
  }
  CABLE.mesh.instanceMatrix.needsUpdate = true; CABLE.bands.instanceMatrix.needsUpdate = true; CABLE.bands.instanceColor.needsUpdate = true;
  const hs = 0.93; posAt(hs, _cp); posAt(hs + 0.01, _cn);
  CABLE.head.position.copy(_cp); CABLE.head.lookAt(_cn.lerp(_v[11].copy(_cp).add(_v[12].set(-1, -bow * 1.4 + 0.2, 0.2)), 0.5 + bow * 0.4));
  CABLE.crack.material.opacity = clamp01(rise * 3) * 0.85;
  const vis = rise > 0.001;
  CABLE.mesh.visible = CABLE.bands.visible = CABLE.head.visible = vis; CABLE.crack.visible = vis || CABLE.crack.material.opacity > 0;
}
function cableWorldHead() { return CABLE.head.position; }
