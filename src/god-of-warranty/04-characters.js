// ================= ASSETS: characters built from primitives (§3, §10.5) =================
const ACTORS = {};
const ACTOR_LIST = [];

// ---------- face atlases: 4 mouth frames × (eyes open, eyes closed, specials) ----------
function paintFace(f) {
  const W = 512, H = 384, C = 128;
  return canvasTex(W, H, (g) => {
    const skin = f.skin;
    for (let row = 0; row < 3; row++) for (let col = 0; col < 4; col++) {
      const x0 = col * C, y0 = row * C;
      g.save(); g.translate(x0, y0); g.beginPath(); g.rect(0, 0, C, C); g.clip();
      g.fillStyle = skin; g.fillRect(0, 0, C, C);
      // soft shading: cheeks, eye sockets, nose
      const sh = (x, y, rx, ry, a, c = '0,0,0') => { const gr = g.createRadialGradient(x, y, 0, x, y, Math.max(rx, ry)); gr.addColorStop(0, `rgba(${c},${a})`); gr.addColorStop(1, `rgba(${c},0)`); g.save(); g.translate(x, y); g.scale(rx / Math.max(rx, ry), ry / Math.max(rx, ry)); g.translate(-x, -y); g.fillStyle = gr; g.fillRect(0, 0, C, C); g.restore(); };
      sh(40, 55, 20, 14, f.sockets || 0.16); sh(88, 55, 20, 14, f.sockets || 0.16);
      sh(64, 74, 7, 16, 0.12); sh(30, 82, 14, 12, 0.08, '200,80,70'); sh(98, 82, 14, 12, 0.08, '200,80,70');
      if (f.grey) { sh(64, 64, 70, 70, 0.2, '40,70,70'); }
      // stubble / beard shadow
      if (f.stubble) { const r = mulberry32(col * 7 + row); g.fillStyle = f.stubble; for (let i = 0; i < 520; i++) { const a = r() * PI, rad = 30 + r() * 30; const x = 64 + Math.cos(a) * rad * 0.95, y = 72 + Math.sin(a) * rad * 0.82; if (y > 76 || (y > 84)) g.fillRect(x, y, 1.6, 1.6); } }
      const special = row === 2, closed = row === 1 || (special && col === 1 && f.squintSpecial);
      // eyes
      const eye = (cx, flip) => {
        const ey = 54 + (f.eyeY || 0);
        if (closed) { g.strokeStyle = f.lid || 'rgba(40,20,10,.85)'; g.lineWidth = 2.4; g.beginPath(); g.moveTo(cx - 10, ey); g.quadraticCurveTo(cx, ey + 4, cx + 10, ey); g.stroke(); return; }
        if (f.glowEyes) { const gr = g.createRadialGradient(cx, ey, 0, cx, ey, 11); gr.addColorStop(0, '#d8fffb'); gr.addColorStop(0.35, f.glowEyes); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = 'rgba(10,20,22,.85)'; g.beginPath(); g.ellipse(cx, ey, 11, 7, 0, 0, TAU); g.fill(); g.fillStyle = gr; g.beginPath(); g.ellipse(cx, ey, 10, 7, 0, 0, TAU); g.fill(); return; }
        g.fillStyle = '#f4efe8'; g.beginPath(); g.ellipse(cx, ey, 10.5, 6.2, 0, 0, TAU); g.fill();
        g.fillStyle = f.iris || '#4a3020'; g.beginPath(); g.arc(cx + (flip ? -1 : 1) * 0.6, ey + 0.4, 4.8, 0, TAU); g.fill();
        g.fillStyle = '#0b0b0b'; g.beginPath(); g.arc(cx + (flip ? -1 : 1) * 0.6, ey + 0.4, 2.2, 0, TAU); g.fill();
        g.fillStyle = 'rgba(255,255,255,.9)'; g.fillRect(cx + 1.5, ey - 2.5, 1.6, 1.6);
        // upper lid (tired eyes droop)
        g.fillStyle = skin; g.beginPath(); g.ellipse(cx, ey - 6.2 + (f.tired || 0) * 3.2, 12, 4.5, 0, 0, TAU); g.fill();
        g.strokeStyle = 'rgba(30,15,8,.8)'; g.lineWidth = 1.8; g.beginPath(); g.ellipse(cx, ey + 0.2, 10.5, 6.2, 0, PI * 1.08, PI * 1.92); g.stroke();
        if (f.glasses) { g.strokeStyle = '#1d1d1f'; g.lineWidth = 2.6; g.beginPath(); g.ellipse(cx, ey + 1, 15, 11, 0, 0, TAU); g.stroke(); }
      };
      eye(40, false); eye(88, true);
      if (f.glasses) { g.strokeStyle = '#1d1d1f'; g.lineWidth = 2.6; g.beginPath(); g.moveTo(55, 54); g.quadraticCurveTo(64, 50, 73, 54); g.stroke(); }
      // brows
      g.strokeStyle = f.brow || '#2a1a10'; g.lineCap = 'round'; g.lineWidth = f.browW || 4;
      const bt = f.browTilt || 0, by = 40 + (f.browY || 0) - (special && col === 0 && f.raiseOnSmile ? 2 : 0);
      g.beginPath(); g.moveTo(28, by + 2 - bt); g.quadraticCurveTo(40, by - 3, 52, by + bt); g.stroke();
      g.beginPath(); g.moveTo(76, by + bt); g.quadraticCurveTo(88, by - 3, 100, by + 2 - bt); g.stroke();
      // nose
      g.strokeStyle = 'rgba(60,30,20,.45)'; g.lineWidth = 1.6; g.beginPath(); g.moveTo(60, 78); g.quadraticCurveTo(64, 82, 68, 78); g.stroke();
      // moustache
      if (f.moustache) { g.fillStyle = f.moustache; g.beginPath(); g.moveTo(46, 90); g.quadraticCurveTo(64, 80, 82, 90); g.quadraticCurveTo(64, 87, 46, 90); g.fill(); g.fillRect(48, 85, 32, 4); }
      // mouth
      const my = 94 + (f.mouthY || 0), lip = f.lip || '#8a3a34', dark = '#2a0a0a';
      g.lineWidth = 2.2; g.strokeStyle = lip;
      const m = special ? -1 - col : col;
      if (m === 0) { g.beginPath(); g.moveTo(52, my); g.quadraticCurveTo(64, my + (f.smile ? 3 : 1), 76, my); g.stroke(); }
      else if (m > 0) { const w = [0, 7, 9, 11][m], h = [0, 2.5, 5, 8][m]; g.fillStyle = dark; g.beginPath(); g.ellipse(64, my + h * 0.3, w + 2, h, 0, 0, TAU); g.fill(); if (m >= 2) { g.fillStyle = '#e9e4dc'; g.fillRect(64 - w * 0.7, my - h * 0.55, w * 1.4, 2.2); } g.strokeStyle = lip; g.beginPath(); g.ellipse(64, my + h * 0.3, w + 2, h, 0, 0, TAU); g.stroke(); }
      else if (m === -1) { g.fillStyle = dark; g.beginPath(); g.moveTo(50, my - 1); g.quadraticCurveTo(64, my + 9, 78, my - 1); g.quadraticCurveTo(64, my + 3, 50, my - 1); g.fill(); if (f.teeth) { g.fillStyle = '#eee'; g.beginPath(); g.moveTo(52, my); g.quadraticCurveTo(64, my + 5, 76, my); g.quadraticCurveTo(64, my + 2, 52, my); g.fill(); } g.strokeStyle = lip; g.beginPath(); g.moveTo(50, my - 1); g.quadraticCurveTo(64, my + 9, 78, my - 1); g.stroke(); }
      else if (m === -2) { g.beginPath(); g.moveTo(52, my + 0.5); g.quadraticCurveTo(66, my + 1.5, 77, my - 2.5); g.stroke(); }
      else if (m === -3) { g.fillStyle = dark; g.beginPath(); g.rect(52, my - 3, 24, 6); g.fill(); g.fillStyle = '#e8e2d8'; g.fillRect(52, my - 3, 24, 2.5); g.fillRect(52, my + 1, 24, 2); }
      else if (m === -4) { g.fillStyle = dark; g.beginPath(); g.ellipse(64, my + 3, 14, 11, 0, 0, TAU); g.fill(); g.fillStyle = '#ddd'; g.fillRect(53, my - 6, 22, 3); }
      if (f.mask) { g.fillStyle = f.mask; g.fillRect(0, 112, C, 16); }
      g.restore();
    }
  });
}

// ---------- skeleton ----------
function deformHead(g, s) {
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    let x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    x *= s.wide || 0.88; y *= 1.1; z *= 0.98;
    if (y < -0.2 * 0.068 * 10) { }
    const ny = y / 0.0748; // approx normalised
    if (ny < -0.15) { const k = 1 - (-ny - 0.15) * (s.jaw || 0.35); x *= k; z *= lerp(1, 0.92, -ny); }
    if (z > 0 && ny > 0.1 && ny < 0.45) z *= 1.04;
    p.setXYZ(i, x, y, z);
  }
  g.computeVertexNormals();
  return g;
}
class Actor {
  constructor(id, o) {
    this.id = id; this.height = o.height || 1.8; this.legLen = this.height * 0.5; this.kind = o.kind || 'human';
    this.root = new THREE.Group(); this.root.name = id; this.pos = this.root.position; this.yaw = 0;
    this.bones = {}; this.props = {}; this.chains = []; this.cloth = null; this.meshes = [];
    this.vel = V3(); this.speed = 0; this.walkTo = null; this.talk = 0; this.mouthOverride = null; this.expr = null;
    this.blinkT = 2 + frand() * 3; this.blinking = 0; this.breathT = frand() * 3; this.breathPuffs = true;
    this.makeSkeleton(o);
    this.anim = new Animator(this);
    R.scene.add(this.root);
    ACTORS[id] = this; ACTOR_LIST.push(this);
    this.active = true;
  }
  makeSkeleton(o) {
    const H = this.height, b = this.bones, sw = (o.shoulder || 0.22) * H, hw = (o.hip || 0.1) * H;
    const G = (name, parent, x, y, z) => { const g = new THREE.Group(); g.name = name; g.position.set(x, y, z); parent.add(g); b[name] = g; return g; };
    G('hips', this.root, 0, this.legLen, 0);
    G('spine', b.hips, 0, 0.06 * H, 0); G('chest', b.spine, 0, 0.12 * H, 0); G('neck', b.chest, 0, 0.15 * H, 0); G('head', b.neck, 0, 0.04 * H, 0);
    for (const [s, k] of [['L', 1], ['R', -1]]) {
      G('sh' + s, b.chest, k * sw / 2, 0.13 * H, 0); G('arm' + s, b['sh' + s], 0, 0, 0); G('fore' + s, b['arm' + s], 0, -0.17 * H, 0); G('hand' + s, b['fore' + s], 0, -0.15 * H, 0);
      G('thigh' + s, b.hips, k * hw / 2, -0.03 * H, 0); G('shin' + s, b['thigh' + s], 0, -0.23 * H, 0); G('foot' + s, b['shin' + s], 0, -0.2 * H, 0);
    }
  }
  attach(bone, mesh, pos, rot) { if (pos) mesh.position.set(...pos); if (rot) mesh.rotation.set(...rot); (this.bones[bone] || this.root).add(mesh); this.meshes.push(mesh); mesh.traverse(m => { if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; } }); return mesh; }
  part(bone, gb, mat = MATS.vcNoSnow) { return this.attach(bone, gb.mesh(mat)); }
  headWorld(out = V3()) { return this.bones.head.getWorldPosition(out).add(_v[14].set(0, 0.065 * this.height, 0)); }
  boneWorld(name, out = V3(), off = null) { const b = this.bones[name]; if (!b) return out.copy(this.pos); if (off) return b.localToWorld(out.set(...off)); return b.getWorldPosition(out); }
  eyes(out = V3()) { return this.bones.head.localToWorld(out.set(0, 0.07 * this.height, 0.06 * this.height)); }
  place(p, yaw) { if (p.isVector3) this.pos.copy(p); else this.pos.set(p[0], p[1] != null ? p[1] : groundHeight(p[0], p[2]), p[2]); if (yaw != null) this.yaw = yaw; this.root.rotation.y = this.yaw; this.root.updateMatrixWorld(true); this.chains.forEach(c => c.chain.inited = false); if (this.cloth) this.cloth.inited = false; }
  setVisible(v) { this.root.visible = v; if (this.cloth) this.cloth.mesh.visible = v; this.chains.forEach(c => c.meshes.forEach(m => m.visible = v)); this.active = v; }
  lookAt(t, w = 1) { this.anim.look.target = t; this.anim.look.weight = w; }
  update(dt) {
    if (!this.active) return;
    // director walks: full locomotion to a mark, not a teleport
    if (this.walkTo) {
      const w = this.walkTo, dx = w.x - this.pos.x, dz = w.z - this.pos.z, d = Math.hypot(dx, dz);
      if (d < (w.tol || 0.12)) {
        this.speed = damp(this.speed, 0, 10, dt);
        if (w.yaw != null) this.yaw = dampAngle(this.yaw, w.yaw, 6, dt);
        if (this.speed < 0.05 && (w.yaw == null || Math.abs(angleTo(this.yaw, w.yaw)) < 0.05)) { const cb = w.done; this.walkTo = null; this.speed = 0; if (cb) cb(); }
      } else {
        const target = Math.min(w.speed || 1.4, d * 2.2 + 0.25);
        this.speed = damp(this.speed, target, 5, dt);
        const yawT = w.backwards ? Math.atan2(-dx, -dz) : Math.atan2(dx, dz);
        const turn = angleTo(this.yaw, yawT); this.anim.turn = damp(this.anim.turn, clamp(turn, -1, 1), 6, dt);
        this.yaw = dampAngle(this.yaw, yawT, w.turnRate || 7, dt);
        const k = this.speed * dt * Math.max(0.2, Math.cos(turn)) * (w.backwards ? -1 : 1);
        this.pos.x += Math.sin(this.yaw) * k; this.pos.z += Math.cos(this.yaw) * k;
        if (w.collide) WORLD.resolve(this.pos, 0.35, { walk: false });
      }
      if (!w.noGround) this.pos.y = damp(this.pos.y, groundHeight(this.pos.x, this.pos.z) + (w.yOff || 0), 14, dt);
    }
    this.anim.speed = this.speed;
    this.root.rotation.y = this.yaw;
    this.anim.update(dt);
    // face: blink + lip flap
    if (this.face) {
      this.blinkT -= dt; if (this.blinkT < 0) { this.blinking = 0.13; this.blinkT = 2.5 + frand() * 3.5; }
      if (this.blinking > 0) this.blinking -= dt;
      const t = this.talk; let mouth = t < 0.12 ? 0 : t < 0.35 ? 1 : t < 0.65 ? 2 : 3;
      let row = this.blinking > 0 || this.eyesClosed ? 1 : 0;
      if (this.expr && t < 0.12) { row = 2; mouth = this.expr; }
      if (this.mouthOverride != null) mouth = this.mouthOverride;
      if (this.exprRow != null) row = this.exprRow;
      this.face.map.offset.set(mouth * 0.25, 1 - (row + 1) / 3);
      if (this.jaw) this.jaw.rotation.x = t * 0.18;
    }
    // breath fog in the cold
    if (this.breathPuffs && this.face && ENV.cur && ENV.name !== 'interior') {
      this.breathT -= dt;
      const talking = this.talk > 0.3;
      if (this.breathT < 0 || (talking && frand() < dt * 6)) {
        this.breathT = (this.fatigue ? 1.4 : 3.0) + frand() * 0.8;
        const p = this.bones.head.localToWorld(_v[15].set(0, 0.035 * this.height, 0.075 * this.height)), f = fwdFromYaw(this.yaw, _v[16]);
        fxBurst('breath', p, { dx: f.x, dz: f.z, n: talking ? 2 : 4, a: ENV.name === 'zee' ? 0.4 : 1 });
      }
    }
    this.root.updateMatrixWorld(true);
    for (const c of this.chains) c.update(dt, this);
    if (this.cloth && this.clothUpdate) this.clothUpdate(dt);
    if (this.extraUpdate) this.extraUpdate(dt);
  }
}

// ---------- body dressing helpers ----------
function bodyParts(a, s) {
  const H = a.height, B = a.bones, bw = s.build || {};
  const chestW = (bw.chest || 0.13) * H, belly = (bw.belly || 0.11) * H, limb = bw.limb || 1;
  const shirt = s.shirt, pants = s.pants, skin = s.skin;
  // pelvis
  a.part('hips', new GB().box((s.hipW || 0.17) * H, 0.11 * H, 0.12 * H, { pos: [0, -0.02 * H, 0], color: pants }).box((s.hipW || 0.17) * H + 0.01, 0.025 * H, 0.125 * H, { pos: [0, 0.03 * H, 0], color: s.belt || 0x1b1b1b }));
  // abdomen + chest (shirt)
  const torsoA = new GB().cyl(chestW * 0.42, belly * 0.5, 0.13 * H, 10, { pos: [0, 0.06 * H, 0], scale: [1.2, 1, 0.82], color: s.shirtLow || shirt });
  a.part('spine', torsoA);
  const tc = new GB().cyl(chestW * 0.62, chestW * 0.44, 0.16 * H, 10, { pos: [0, 0.07 * H, 0], scale: [1.22, 1, 0.78], color: shirt })
    .sphere(chestW * 0.6, 10, 6, { pos: [0, 0.15 * H, 0], scale: [1.22, 0.4, 0.75], color: shirt, thetaLength: PI / 2 });
  if (s.collar) tc.torus(0.03 * H, 0.008 * H, 4, 12, { pos: [0, 0.155 * H, 0.008 * H], rot: [PI / 2 - 0.2, 0, 0], color: s.collar });
  if (s.logo) tc.box(0.03 * H, 0.012 * H, 0.004, { pos: [-0.04 * H, 0.11 * H, chestW * 0.49], color: s.logo });
  a.part('chest', tc);
  a.part('neck', new GB().cyl(0.028 * H, 0.032 * H, 0.06 * H, 8, { pos: [0, 0.02 * H, 0], color: skin }));
  // arms
  for (const k of ['L', 'R']) {
    const sl = s.sleeve === 'long' ? (s.sleeveCol || shirt) : skin, slTop = s.sleeve === 'none' ? skin : (s.sleeveCol || shirt);
    const ua = new GB().sphere(0.04 * H * limb, 8, 6, { color: slTop })
      .cyl(0.036 * H * limb, 0.029 * H * limb, 0.17 * H, 8, { pos: [0, -0.085 * H, 0], color: s.sleeve === 'short' ? skin : slTop });
    if (s.sleeve === 'short') ua.cyl(0.04 * H * limb, 0.036 * H * limb, 0.07 * H, 8, { pos: [0, -0.03 * H, 0], color: slTop });
    a.part('arm' + k, ua);
    const fa = new GB().sphere(0.03 * H * limb, 7, 5, { color: s.sleeve === 'rolled' ? (s.sleeveCol || shirt) : sl })
      .cyl(0.028 * H * limb, 0.021 * H * limb, 0.15 * H, 8, { pos: [0, -0.075 * H, 0], color: s.forearm || sl });
    if (s.sleeve === 'rolled') fa.cyl(0.034 * H * limb, 0.032 * H * limb, 0.04 * H, 8, { pos: [0, -0.01 * H, 0], color: s.sleeveCol || shirt });
    if (s.bracers) fa.cyl(0.031 * H * limb, 0.026 * H * limb, 0.08 * H, 8, { pos: [0, -0.1 * H, 0], color: s.bracers });
    if (s.bracelet && k === 'R') fa.torus(0.024 * H, 0.004 * H, 4, 10, { pos: [0, -0.14 * H, 0], rot: [PI / 2, 0, 0], color: 0xd8dce0 });
    a.part('fore' + k, fa);
    const gl = s.gloves || skin;
    a.part('hand' + k, new GB().box(0.05 * H * limb, 0.075 * H, 0.026 * H * limb, { pos: [0, -0.038 * H, 0.004 * H], color: gl }).box(0.016 * H, 0.04 * H, 0.016 * H, { pos: [(k === 'L' ? -1 : 1) * -0.025 * H, -0.025 * H, 0.016 * H], rot: [0.3, 0, (k === 'L' ? 1 : -1) * 0.5], color: gl }));
    // legs
    a.part('thigh' + k, new GB().cyl(0.052 * H * limb, 0.04 * H * limb, 0.235 * H, 8, { pos: [0, -0.115 * H, 0], color: pants }));
    a.part('shin' + k, new GB().sphere(0.04 * H * limb, 7, 5, { color: pants }).cyl(0.039 * H * limb, 0.03 * H * limb, 0.2 * H, 8, { pos: [0, -0.1 * H, 0], color: s.boots || pants }));
    const shoe = new GB().box(0.055 * H, 0.04 * H, 0.14 * H, { pos: [0, -0.024 * H, 0.032 * H], color: s.shoes || 0x1e1e1e }).box(0.058 * H, 0.012 * H, 0.145 * H, { pos: [0, -0.04 * H, 0.033 * H], color: s.sole || 0xf2f2f2 });
    if (s.footWrap) shoe.cyl(0.042 * H, 0.036 * H, 0.06 * H, 7, { pos: [0, 0.01 * H, 0], color: s.footWrap }).box(0.06 * H, 0.008 * H, 0.1 * H, { pos: [0, -0.01 * H, 0.04 * H], rot: [0.3, 0, 0], color: 0x5a3e2a });
    a.part('foot' + k, shoe);
  }
}
function headParts(a, s) {
  const H = a.height, r = 0.068 * H;
  const head = new GB().add(deformHead(new THREE.SphereGeometry(r, 16, 12), s), { pos: [0, 0.065 * H, 0], color: s.skin })
    .box(0.018 * H, 0.03 * H, 0.02 * H, { pos: [0, 0.062 * H, 0.066 * H], rot: [-0.2, 0, 0], color: s.skin })
    .sphere(0.016 * H, 6, 5, { pos: [0.062 * H, 0.062 * H, 0], scale: [0.5, 1, 0.8], color: s.skin })
    .sphere(0.016 * H, 6, 5, { pos: [-0.062 * H, 0.062 * H, 0], scale: [0.5, 1, 0.8], color: s.skin });
  a.part('head', head);
  // painted face patch
  const fg = deformHead(new THREE.SphereGeometry(r * 1.012, 14, 12, PI / 2 - 0.95, 1.9, 0.78, 1.55), s);
  const tex = paintFace(s.face); tex.repeat.set(0.25, 1 / 3); tex.offset.set(0, 2 / 3);
  const fm = new THREE.Mesh(fg, new THREE.MeshLambertMaterial({ map: tex }));
  fm.position.y = 0.065 * H; a.bones.head.add(fm); a.face = { mesh: fm, map: tex };
}
// hair styles
function hairCap(a, color, o = {}) {
  const H = a.height, r = 0.068 * H;
  const g = new GB().add(deformHead(new THREE.SphereGeometry(r * 1.07, 14, 8, 0, TAU, 0, o.theta || 1.25), {}), { pos: [0, 0.07 * H + (o.lift || 0), -0.004 * H], color, scale: [1.02, 1.0, 1.04] });
  if (o.back !== false) g.add(deformHead(new THREE.SphereGeometry(r * 1.06, 12, 8, PI * 0.15 + PI, PI * 1.7, 0.9, 1.0), {}), { pos: [0, 0.065 * H, -0.004 * H], color, rot: [0, PI, 0] });
  return g;
}

// ---------- props ----------
function buildColdCall() {
  const g = new THREE.Group();
  const haft = new GB().cyl(0.017, 0.02, 0.78, 7, { pos: [0, 0.32, 0], color: 0x3a2a1f })
    .cyl(0.022, 0.022, 0.2, 7, { pos: [0, 0.02, 0], color: 0x1aa59f }).cyl(0.026, 0.02, 0.04, 7, { pos: [0, -0.09, 0], color: 0x2b2f33 });
  for (let i = 0; i < 6; i++) haft.torus(0.021, 0.004, 3, 8, { pos: [0, -0.04 + i * 0.035, 0], rot: [PI / 2, 0, 0], color: 0x0e6f6b });
  const hm = haft.mesh(MATS.vcNoSnow); g.add(hm);
  // the head: dark steel, a rounded window cut through it
  const sh = new THREE.Shape();
  sh.moveTo(-0.05, 0.06); sh.lineTo(0.05, 0.075); sh.quadraticCurveTo(0.22, 0.12, 0.27, 0.16); sh.quadraticCurveTo(0.31, 0.02, 0.27, -0.13); sh.quadraticCurveTo(0.2, -0.09, 0.05, -0.06); sh.lineTo(-0.05, -0.05); sh.lineTo(-0.08, 0.0); sh.lineTo(-0.05, 0.06);
  const hole = new THREE.Path(); hole.absarc(0.14, 0.01, 0.042, 0, TAU, true); sh.holes.push(hole);
  const hg = new THREE.ExtrudeGeometry(sh, { depth: 0.028, bevelEnabled: true, bevelThickness: 0.006, bevelSize: 0.006, bevelSegments: 1 });
  hg.translate(0, 0, -0.014);
  const head = new GB().add(hg, { color: 0x3a4248 }).box(0.012, 0.25, 0.034, { pos: [0.285, 0.015, 0], rot: [0, 0, 0.05], color: 0xc9e7f2 });
  const hdm = head.mesh(new THREE.MeshStandardMaterial({ vertexColors: true, metalness: 0.75, roughness: 0.32 }));
  hdm.position.set(0, 0.66, 0); hdm.rotation.y = -PI / 2; g.add(hdm);
  const win = new THREE.Mesh(new THREE.CircleGeometry(0.04, 16), MATS.tealGlow.clone()); win.position.set(0, 0.67, 0.14); win.rotation.y = -PI / 2; g.add(win);
  const win2 = win.clone(); win2.rotation.y = PI / 2; win2.position.z = 0.14; g.add(win2);
  const rg = new GB(); addRunes(rg, 'ᚠᚱᛟ', { size: 0.045, stroke: 0.006, gap: 0.01, matrix: new THREE.Matrix4().makeRotationY(-PI / 2).setPosition(0.02, 0.63, 0.21) });
  addRunes(rg, 'ᛊᛏ', { size: 0.045, stroke: 0.006, gap: 0.01, matrix: new THREE.Matrix4().makeRotationY(PI / 2).setPosition(-0.02, 0.63, 0.21) });
  const rm = rg.mesh(glow(0.7, 2.6, 3.4), { cast: false }); g.add(rm);
  // the price tag, swinging from the pommel
  const tag = new THREE.Group(); tag.position.set(0, -0.11, 0);
  tag.add(new GB().box(0.002, 0.07, 0.002, { pos: [0, -0.035, 0], color: 0xdddddd }).box(0.004, 0.05, 0.03, { pos: [0, -0.09, 0], color: 0xf6f3e8 }).box(0.005, 0.012, 0.024, { pos: [0, -0.08, 0], color: 0xffcf1f }).mesh(MATS.vcNoSnow));
  g.add(tag);
  g.userData = { tag, window: win, glowMat: win.material, runes: rm, headLocal: V3(0, 0.67, 0.12), bladeEdge: V3(0, 0.66, 0.29) };
  g.traverse(m => { if (m.isMesh) m.castShadow = true; });
  return g;
}
function buildWoodAxe() {
  const g = new GB().cyl(0.017, 0.02, 0.8, 6, { pos: [0, 0.32, 0], color: 0x9a7a52 }).box(0.03, 0.12, 0.17, { pos: [0, 0.68, 0.07], color: 0x55595c }).box(0.035, 0.15, 0.03, { pos: [0, 0.68, 0.16], color: 0xa9adb0 });
  return g.mesh(MATS.vcNoSnow);
}
function buildBow() {
  const g = new GB();
  g.cyl(0.018, 0.018, 0.22, 6, { color: 0x2c2c2c }); g.cyl(0.024, 0.024, 0.14, 6, { color: 0x8e9396 });
  for (const s of [1, -1]) { for (let i = 0; i < 3; i++) g.cyl(0.012 - i * 0.002, 0.012 - i * 0.002, 0.2, 5, { pos: [0, s * (0.2 + i * 0.19), -0.03 - i * 0.02], rot: [s * (0.12 + i * 0.07), 0, 0], color: 0x111111 }); g.sphere(0.018, 5, 4, { pos: [0, s * 0.68, -0.12], color: 0x111111 }); }
  const m = g.mesh(MATS.vcNoSnow);
  const sg = new THREE.BufferGeometry().setFromPoints([V3(0, 0.68, -0.12), V3(0, 0, -0.1), V3(0, -0.68, -0.12)]);
  const str = new THREE.Line(sg, new THREE.LineBasicMaterial({ color: 0xdedede })); m.add(str); m.userData.string = str;
  return m;
}
function buildArrowGeo() {
  return new GB().cyl(0.006, 0.006, 0.7, 4, { rot: [PI / 2, 0, 0], color: 0x2a2a2a }).cone(0.014, 0.05, 4, { pos: [0, 0, 0.37], rot: [PI / 2, 0, 0], color: 0x9aa4a8 })
    .box(0.002, 0.04, 0.09, { pos: [0, 0.016, -0.3], color: 0x7d7f80 }).box(0.002, 0.04, 0.09, { pos: [0, -0.016, -0.3], color: 0x7d7f80 }).build();
}
function buildTablet(screenMat) {
  const g = new THREE.Group();
  g.add(new GB().box(0.25, 0.18, 0.012, { color: 0x1a1d20 }).mesh(MATS.vcNoSnow));
  const scr = new THREE.Mesh(new THREE.PlaneGeometry(0.228, 0.158), screenMat); scr.position.z = 0.0065; g.add(scr);
  const crack = new THREE.Mesh(new THREE.PlaneGeometry(0.228, 0.158), new THREE.MeshBasicMaterial({ map: TEX.crack || (TEX.crack = textTex(128, 96, (c, w, h) => { c.clearRect(0, 0, w, h); c.strokeStyle = 'rgba(255,255,255,.55)'; c.lineWidth = 1; const r = mulberry32(3); for (let k = 0; k < 7; k++) { c.beginPath(); let x = 96, y = 18; c.moveTo(x, y); for (let i = 0; i < 6; i++) { x += (r() - .6) * 22; y += r() * 14; c.lineTo(x, y); } c.stroke(); } })), transparent: true, depthWrite: false }));
  crack.position.z = 0.0075; g.add(crack);
  return g;
}
function buildTripod() { const g = new GB(); for (let i = 0; i < 3; i++) { const a = i / 3 * TAU; g.strut([0, 0.12, 0], [Math.cos(a) * 0.07, 0, Math.sin(a) * 0.07], 0.006, { round: true, color: 0x222 }); } g.box(0.03, 0.02, 0.03, { pos: [0, 0.125, 0], color: 0x333 }); return g.mesh(MATS.vcNoSnow); }
function badgeTex(name, role, back) {
  return textTex(96, 64, (g, w, h) => {
    if (back) { g.fillStyle = '#efeee8'; g.fillRect(0, 0, w, h); g.fillStyle = '#2a3a8a'; g.font = 'italic 700 20px "Brush Script MT", "Segoe Script", cursive'; drawLines(g, ['LO-FI'], w / 2, h / 2 + 2, 0); return; }
    g.fillStyle = '#f3f6f6'; g.fillRect(0, 0, w, h); g.fillStyle = '#ffcf1f'; g.fillRect(0, 0, w, 12); g.fillStyle = '#0f8a8a'; g.fillRect(0, h - 6, w, 6);
    g.fillStyle = '#10272c'; g.font = 'bold 16px Barlow, sans-serif'; drawLines(g, [name], w / 2, 30, 0); g.font = '600 9px Barlow, sans-serif'; drawLines(g, [role], w / 2, 47, 0);
  });
}
function addLanyard(a, name, role, { back = false, cord = 0x0f8a8a, torc = false } = {}) {
  const H = a.height, ch = a.bones.chest;
  const cg = new GB();
  if (torc) cg.torus(0.045 * H, 0.006 * H, 4, 14, { pos: [0, 0.15 * H, 0.008 * H], rot: [PI / 2 - 0.25, 0, 0], color: cord });
  else { cg.strut([0.045 * H, 0.155 * H, 0.01 * H], [0.012 * H, 0.06 * H, 0.068 * H], 0.008 * H, { color: cord, depth: 0.002 * H }); cg.strut([-0.045 * H, 0.155 * H, 0.01 * H], [-0.012 * H, 0.06 * H, 0.068 * H], 0.008 * H, { color: cord, depth: 0.002 * H }); }
  const cm = cg.mesh(MATS.vcNoSnow); ch.add(cm);
  const holder = new THREE.Group(); holder.position.set(0, 0.06 * H, 0.072 * H); ch.add(holder);
  const front = new THREE.Mesh(new THREE.PlaneGeometry(0.05 * H, 0.033 * H), new THREE.MeshLambertMaterial({ map: badgeTex(name, role) }));
  front.position.y = -0.016 * H; holder.add(front);
  if (back) { const bk = new THREE.Mesh(new THREE.PlaneGeometry(0.05 * H, 0.033 * H), new THREE.MeshLambertMaterial({ map: badgeTex('', '', true) })); bk.rotation.y = PI; bk.position.set(0, -0.016 * H, -0.001); holder.add(bk); }
  a.props.badge = holder;
  return holder;
}

// ---------- the cast ----------
function buildLuka() {
  const a = new Actor('luka', { height: 1.88, shoulder: 0.26, hip: 0.11 });
  const s = { skin: '#c3906c', shirt: 0x1d2b4a, pants: 0x1a1a1c, shoes: 0x161616, sole: 0xf2f2f2, footWrap: 0x8c7a62, sleeve: 'short', bracers: 0x4a3324, build: { chest: 0.15, belly: 0.125, limb: 1.12 }, hipW: 0.18, logo: 0xffcf1f,
    face: { skin: '#c3906c', iris: '#3b2414', brow: '#22150c', browW: 5, browTilt: 1.5, stubble: 'rgba(40,26,18,.55)', tired: 1, lip: '#7e4438' }, wide: 0.92, jaw: 0.28 };
  bodyParts(a, s); headParts(a, s);
  const H = a.height;
  a.part('head', hairCap(a, 0x2b1d14, { theta: 1.15 }));
  // ponytail (verlet)
  const pt = new VChain(6, 0.055, { damping: 0.93 });
  const pmeshes = [];
  for (let i = 0; i < 5; i++) { const m = new THREE.Mesh(new THREE.CylinderGeometry(0.022 - i * 0.003, 0.018 - i * 0.003, 0.06, 5), MATS.vcNoSnow.clone()); m.material = new THREE.MeshLambertMaterial({ color: 0x2b1d14 }); m.castShadow = true; R.scene.add(m); pmeshes.push(m); }
  a.chains.push({ chain: pt, meshes: pmeshes, update(dt, actor) {
    const anc = actor.bones.head.localToWorld(_v[17].set(0, 0.075 * H, -0.075 * H));
    pt.spheres[0] = pt.spheres[0] || { c: V3(), r: 0.09 * H }; actor.bones.head.localToWorld(pt.spheres[0].c.set(0, 0.06 * H, 0));
    pt.spheres[1] = pt.spheres[1] || { c: V3(), r: 0.11 * H }; actor.bones.chest.localToWorld(pt.spheres[1].c.set(0, 0.1 * H, -0.02 * H));
    pt.update(dt, anc, _v[18].set(-Math.sin(actor.yaw), 0, -Math.cos(actor.yaw)).multiplyScalar(actor.speed * 4));
    for (let i = 0; i < 5; i++) { const p0 = pt.p[i], p1 = pt.p[i + 1], m = pmeshes[i]; m.position.copy(p0).lerp(p1, 0.5); m.quaternion.setFromUnitVectors(UP, _v[19].copy(p0).sub(p1).normalize()); }
  } });
  // cloak (verlet), fur collar
  const cloakMat = new THREE.MeshLambertMaterial({ map: TEX.wool, color: 0x55666b, side: THREE.DoubleSide, vertexColors: true });
  patchWorld(cloakMat, { snow: 0.35 });
  const cl = new Cloth(7, 9, 0.62, 1.02, cloakMat); R.scene.add(cl.mesh); a.cloth = cl;
  cl.spheres = [{ c: V3(), r: 0.2 }, { c: V3(), r: 0.19 }, { c: V3(), r: 0.13 }, { c: V3(), r: 0.13 }, { c: V3(), r: 0.12 }, { c: V3(), r: 0.12 }];
  a.clothUpdate = (dt) => {
    const B = a.bones;
    for (let i = 0; i < 7; i++) { const t = i / 6, ang = lerp(-1.05, 1.05, t); B.chest.localToWorld(cl.pins[i].set(Math.sin(ang) * 0.17 * (H / 1.88), 0.14 * H + Math.cos(ang * 0.9) * 0.012, -Math.cos(ang) * 0.085 - 0.02)); }
    B.chest.localToWorld(cl.spheres[0].c.set(0, 0.08 * H, -0.02)); B.spine.localToWorld(cl.spheres[1].c.set(0, 0.04 * H, -0.01));
    B.thighL.localToWorld(cl.spheres[2].c.set(0, -0.06 * H, 0)); B.thighR.localToWorld(cl.spheres[3].c.set(0, -0.06 * H, 0));
    B.shinL.localToWorld(cl.spheres[4].c.set(0, -0.02 * H, 0)); B.shinR.localToWorld(cl.spheres[5].c.set(0, -0.02 * H, 0));
    const back = _v[20].set(-Math.sin(a.yaw), 0, -Math.cos(a.yaw)).multiplyScalar(a.speed * 1.2);
    cl.update(dt, back);
  };
  a.part('chest', new GB().torus(0.1 * H, 0.035 * H, 5, 14, { pos: [0, 0.14 * H, -0.01], rot: [PI / 2 + 0.1, 0, 0], scale: [1.15, 1, 0.8], color: 0xb7aa96 }), MATS.fur);
  // satchel at the hip, strap across the chest
  a.part('chest', new GB().strut([0.08 * H, 0.15 * H, 0.05 * H], [-0.09 * H, -0.06 * H, 0.06 * H], 0.012 * H, { color: 0x4a3324, depth: 0.004 * H }));
  const sat = a.attach('hips', new GB().box(0.07 * H, 0.08 * H, 0.03 * H, { color: 0x5a3e2a }).box(0.072 * H, 0.03 * H, 0.032 * H, { pos: [0, 0.03 * H, 0.002], color: 0x4a3324 }).mesh(MATS.vcNoSnow), [-0.1 * H, -0.02 * H, 0.03 * H], [0, -0.4, 0]);
  a.props.satchel = sat;
  addLanyard(a, 'LUKA', '2IC', { torc: true, cord: 0x0f8a8a });
  // weapons
  const axe = buildColdCall(); a.props.axe = axe; a.attach('handR', axe, [0, -0.06 * H, 0.012], [PI / 2, 0, 0]); axe.visible = false;
  const wood = buildWoodAxe(); a.props.woodAxe = wood; a.attach('handR', wood, [0, -0.06 * H, 0.012], [PI / 2, 0, 0]); wood.visible = false;
  // the Tempered Guardian: folds out of the left bracer
  const shield = new THREE.Group(); shield.position.set(0.02, -0.09 * H, 0.02); shield.rotation.set(0, PI / 2, 0);
  const sg = new GB().cyl(0.36, 0.36, 0.03, 18, { rot: [PI / 2, 0, 0], color: 0x5b6670 }).torus(0.36, 0.025, 4, 18, { color: 0x2c3237 });
  for (let i = 0; i < 8; i++) sg.box(0.03, 0.34, 0.02, { pos: [Math.cos(i / 8 * TAU) * 0.18, Math.sin(i / 8 * TAU) * 0.18, 0.01], rot: [0, 0, i / 8 * TAU + PI / 2], color: 0x3a434a });
  shield.add(sg.mesh(new THREE.MeshStandardMaterial({ vertexColors: true, metalness: 0.7, roughness: 0.35 })));
  const glass = new THREE.Mesh(new THREE.CircleGeometry(0.34, 24), new THREE.MeshStandardMaterial({ color: 0xbfe8ff, metalness: 0.1, roughness: 0.04, transparent: true, opacity: 0.5 }));
  glass.position.z = 0.02; shield.add(glass); shield.userData.glass = glass;
  shield.scale.setScalar(0.01); shield.visible = false;
  a.attach('foreL', shield); a.props.shield = shield;
  a.props.fist = null;
  return a;
}
function buildChase() {
  const a = new Actor('chase', { height: 1.78, shoulder: 0.23, hip: 0.1 });
  const s = { skin: '#dcae8a', shirt: 0x1d2b4a, pants: 0x2b2f3a, shoes: 0x2a2a2a, sole: 0xe8e8e8, sleeve: 'long', sleeveCol: 0x1d2b4a, bracelet: true, build: { chest: 0.13, belly: 0.11 }, logo: 0xffcf1f,
    face: { skin: '#dcae8a', iris: '#5a3c1e', brow: '#4a2e18', browW: 4, browTilt: -2, moustache: '#5a3a22', lip: '#8a4a40', tired: 0.2 }, wide: 0.88 };
  bodyParts(a, s); headParts(a, s);
  const H = a.height;
  // battered puffer vest with a fur-lined hood (down)
  a.part('chest', new GB().cyl(0.105 * H, 0.085 * H, 0.17 * H, 10, { pos: [0, 0.07 * H, 0], scale: [1.18, 1, 0.92], color: 0x3c4a3a, segY: 3 })
    .torus(0.085 * H, 0.012 * H, 4, 12, { pos: [0, 0.03 * H, 0], rot: [PI / 2, 0, 0], scale: [1.2, 0.92, 1], color: 0x33402f })
    .torus(0.088 * H, 0.012 * H, 4, 12, { pos: [0, 0.1 * H, 0], rot: [PI / 2, 0, 0], scale: [1.2, 0.92, 1], color: 0x33402f })
    .torus(0.07 * H, 0.03 * H, 5, 12, { pos: [0, 0.155 * H, -0.035 * H], rot: [PI / 2 + 0.5, 0, 0], color: 0x3c4a3a })
    .torus(0.06 * H, 0.016 * H, 5, 12, { pos: [0, 0.16 * H, -0.03 * H], rot: [PI / 2 + 0.5, 0, 0], color: 0xc8bba6 }));
  a.part('spine', new GB().cyl(0.09 * H, 0.085 * H, 0.1 * H, 10, { pos: [0, 0.07 * H, 0], scale: [1.18, 1, 0.92], color: 0x3c4a3a }));
  // messy wavy hair, clumps
  const hg = hairCap(a, 0x5a3a20, { theta: 1.1 }), r = mulberry32(42);
  for (let i = 0; i < 16; i++) { const th = r() * 1.2, ph = r() * TAU; hg.ico(0.024 * H, 0, { pos: [Math.sin(th) * Math.cos(ph) * 0.07 * H, 0.068 * H + Math.cos(th) * 0.068 * H, Math.sin(th) * Math.sin(ph) * 0.068 * H - 0.004 * H], color: r() < .5 ? 0x5a3a20 : 0x6a4628 }); }
  a.part('head', hg);
  // beanie (comes off at the funeral)
  const beanie = a.attach('head', new GB().sphere(0.078 * H, 12, 8, { thetaLength: 1.45, pos: [0, 0.075 * H, -0.004 * H], scale: [1, 1.05, 1.05], color: 0x8a2a2a }).torus(0.072 * H, 0.012 * H, 4, 14, { pos: [0, 0.08 * H, -0.004 * H], rot: [PI / 2, 0, 0], color: 0x7a2222 }).sphere(0.016 * H, 6, 4, { pos: [0, 0.155 * H, -0.004 * H], color: 0x9a3a3a }).mesh(MATS.wool));
  a.props.beanie = beanie;
  // headphones around the neck
  a.part('neck', new GB().torus(0.05 * H, 0.008 * H, 4, 14, { pos: [0, 0.0, 0.006 * H], rot: [PI / 2 - 0.3, 0, 0], color: 0x161616 }).cyl(0.026 * H, 0.026 * H, 0.014 * H, 10, { pos: [0.05 * H, -0.006 * H, 0.03 * H], rot: [0, 0, PI / 2 + 0.5], color: 0x222 }).cyl(0.026 * H, 0.026 * H, 0.014 * H, 10, { pos: [-0.05 * H, -0.006 * H, 0.03 * H], rot: [0, 0, PI / 2 - 0.5], color: 0x222 }));
  // quiver: a long phone-accessory box
  a.attach('chest', new GB().box(0.09, 0.62, 0.07, { color: 0xf2f2f2 }).box(0.092, 0.2, 0.072, { pos: [0, 0.12, 0], color: 0x19b5ad }).box(0.06, 0.06, 0.004, { pos: [0, -0.1, 0.037], color: 0xffcf1f }).mesh(MATS.vcNoSnow), [0.06, 0.05 * H, -0.12 * H], [0, 0, -0.35]);
  const bow = buildBow(); a.props.bow = bow;
  a.attach('chest', bow, [-0.04, 0.06 * H, -0.13 * H], [0, PI / 2, 0.5]); a.props.bowOnBack = true;
  addLanyard(a, 'CHASE', 'CASUAL', { back: true });
  return a;
}
function chaseBowToHand(on) {
  const a = ACTORS.chase, b = a.props.bow; if (!a || !b) return;
  if (on && a.props.bowOnBack) { a.bones.handL.add(b); b.position.set(0, -0.06 * a.height, 0.02); b.rotation.set(PI / 2, 0, 0); a.props.bowOnBack = false; }
  if (!on && !a.props.bowOnBack) { a.bones.chest.add(b); b.position.set(-0.04, 0.06 * a.height, -0.13 * a.height); b.rotation.set(0, PI / 2, 0.5); a.props.bowOnBack = true; }
}
function buildLuke() {
  const a = new Actor('luke', { height: 1.85, shoulder: 0.27, hip: 0.12 });
  const s = { skin: '#d6a47e', shirt: 0x2f6fb5, shirtLow: 0x2f6fb5, pants: 0x2c3240, gloves: 0x3f86e0, sleeve: 'long', sleeveCol: 0x2f6fb5, build: { chest: 0.16, belly: 0.15, limb: 1.15 }, hipW: 0.2,
    face: { skin: '#d6a47e', iris: '#5a6a78', brow: '#3a2614', browW: 6, stubble: 'rgba(70,40,25,.4)', lip: '#8a4a40', browTilt: 1 }, wide: 0.96, jaw: 0.2 };
  bodyParts(a, s); headParts(a, s);
  const H = a.height;
  a.part('head', hairCap(a, 0x6a4a2a, { theta: 0.95 }).torus(0.072 * H, 0.008 * H, 4, 16, { pos: [0, 0.1 * H, 0], rot: [PI / 2 + 0.25, 0, 0], color: 0x222 }).cyl(0.016 * H, 0.012 * H, 0.025 * H, 8, { pos: [0.02 * H, 0.122 * H, 0.06 * H], rot: [PI / 2 - 0.3, 0, 0], color: 0x333 }));
  a.props.loupe = a.meshes[a.meshes.length - 1];
  a.part('chest', new GB().cyl(0.12 * H, 0.1 * H, 0.17 * H, 10, { pos: [0, 0.07 * H, 0], scale: [1.18, 1, 0.92], color: 0x3a7bc4 }));
  addLanyard(a, 'LUKE', 'REPAIRS');
  return a;
}
function buildZane() {
  const a = new Actor('zane', { height: 1.8, shoulder: 0.21, hip: 0.095 });
  const s = { skin: '#e2b996', shirt: 0x6b7480, pants: 0x2a2d33, sleeve: 'long', sleeveCol: 0x6b7480, build: { chest: 0.12, belly: 0.1, limb: 0.92 }, hipW: 0.15,
    face: { skin: '#e2b996', iris: '#3a2a1a', brow: '#2a1a10', browW: 3.5, glasses: true, mask: '#a9d4e6', lip: '#9a5a50' }, wide: 0.84, jaw: 0.38 };
  bodyParts(a, s); headParts(a, s);
  const H = a.height;
  a.part('head', hairCap(a, 0x1e1610, { theta: 1.0 }));
  // spotless apron
  a.part('chest', new GB().box(0.15 * H, 0.18 * H, 0.01, { pos: [0, 0.06 * H, 0.066 * H], color: 0xf4f6f6 }).strut([0.06 * H, 0.15 * H, 0.06 * H], [0.04 * H, 0.17 * H, -0.01], 0.006 * H, { color: 0xf4f6f6 }).strut([-0.06 * H, 0.15 * H, 0.06 * H], [-0.04 * H, 0.17 * H, -0.01], 0.006 * H, { color: 0xf4f6f6 }));
  a.part('hips', new GB().box(0.16 * H, 0.2 * H, 0.01, { pos: [0, -0.07 * H, 0.068 * H], color: 0xf4f6f6 }));
  // face mask pulled down to his chin (painted) + strap
  a.part('head', new GB().torus(0.064 * H, 0.004 * H, 3, 14, { pos: [0, 0.035 * H, 0], rot: [PI / 2 + 0.6, 0, 0], color: 0xa9d4e6 }));
  // microfibre cloth always in hand
  a.props.cloth = a.attach('handR', new GB().box(0.09, 0.006, 0.12, { color: 0xf1c232 }).mesh(MATS.vcNoSnow), [0, -0.1 * H, 0.03], [0.4, 0, 0]);
  addLanyard(a, 'ZANE', 'REPAIRS');
  return a;
}
function buildZee() {
  const a = new Actor('zee', { height: 1.83, shoulder: 0.22, hip: 0.105 });
  const s = { skin: '#cfa686', shirt: 0x3e4a3a, pants: 0x2c3328, sleeve: 'long', sleeveCol: 0x4a5a44, build: { chest: 0.125, belly: 0.11 },
    face: { skin: '#cfa686', iris: '#5a7a62', brow: '#5a4a3a', browW: 3, lip: '#8a5048', tired: 0.4, smile: true }, wide: 0.86, jaw: 0.35 };
  bodyParts(a, s); headParts(a, s);
  const H = a.height;
  const hair = hairCap(a, 0x6e6a62, { theta: 1.3 });
  for (let i = 0; i < 5; i++) hair.cyl(0.006 * H, 0.006 * H, 0.14 * H, 4, { pos: [(i - 2) * 0.012 * H, -0.0 * H, -0.07 * H], rot: [0.25, 0, 0], color: [0x0f8a8a, 0xffcf1f, 0xc8291f, 0x2f6fb5, 0x8a8a8a][i] });
  a.part('head', hair);
  // hood
  a.part('neck', new GB().sphere(0.1 * H, 12, 8, { phiStart: PI * 0.62, phiLength: PI * 1.76, thetaLength: 1.9, pos: [0, 0.1 * H, -0.01 * H], scale: [1, 1.12, 1.08], color: 0x4a5a44 }), MATS.wool);
  // long cloak to the ground (verlet)
  const cm = new THREE.MeshLambertMaterial({ map: TEX.wool, color: 0x5d6a52, side: THREE.DoubleSide, vertexColors: true }); patchWorld(cm, { snow: 0.25 });
  const cl = new Cloth(8, 10, 0.78, 1.42, cm); R.scene.add(cl.mesh); a.cloth = cl;
  cl.spheres = [{ c: V3(), r: 0.2 }, { c: V3(), r: 0.2 }, { c: V3(), r: 0.14 }, { c: V3(), r: 0.14 }, { c: V3(), r: 0.13 }, { c: V3(), r: 0.13 }];
  a.clothUpdate = (dt) => {
    const B = a.bones;
    for (let i = 0; i < 8; i++) { const t = i / 7, ang = lerp(-1.5, 1.5, t); B.chest.localToWorld(cl.pins[i].set(Math.sin(ang) * 0.17, 0.145 * H, -Math.cos(ang) * 0.09 + 0.01)); }
    B.chest.localToWorld(cl.spheres[0].c.set(0, 0.08 * H, 0)); B.spine.localToWorld(cl.spheres[1].c.set(0, 0.03 * H, 0));
    B.thighL.localToWorld(cl.spheres[2].c.set(0, -0.08 * H, 0)); B.thighR.localToWorld(cl.spheres[3].c.set(0, -0.08 * H, 0));
    B.shinL.localToWorld(cl.spheres[4].c.set(0, -0.06 * H, 0)); B.shinR.localToWorld(cl.spheres[5].c.set(0, -0.06 * H, 0));
    cl.update(dt, _v[20].set(-Math.sin(a.yaw), 0, -Math.cos(a.yaw)).multiplyScalar(a.speed));
  };
  // access cards at the belt, walking staff with an old pager
  const cards = new GB(); for (let i = 0; i < 6; i++) cards.box(0.035, 0.05, 0.003, { pos: [0.1 * H + Math.cos(i * 0.5) * 0.03, -0.06 * H - i * 0.004, Math.sin(i * 0.5) * 0.03], rot: [0, i * 0.4, 0.1], color: i === 0 ? 0xffcf1f : 0xd8dde0 });
  a.part('hips', cards);
  const staff = new GB().cyl(0.016, 0.022, 1.95, 6, { pos: [0, 0.2, 0], color: 0x5a4632 }).box(0.04, 0.06, 0.018, { pos: [0.05, 1.0, 0], color: 0x2a2a2a }).box(0.002, 0.08, 0.002, { pos: [0.05, 1.07, 0], color: 0x888 });
  a.props.staff = a.attach('handR', staff.mesh(MATS.vcNoSnow), [0, -0.08 * H, 0.02], [0, 0, 0]);
  return a;
}
function buildJarrad() {
  const a = new Actor('jarrad', { height: 1.84, shoulder: 0.25, hip: 0.105 });
  const tat = '#c79a76';
  const s = { skin: '#e0ad86', shirt: 0xf2f4f6, pants: 0x2f3a4a, sleeve: 'rolled', sleeveCol: 0xf2f4f6, forearm: 0xc89c78, collar: 0xf8f8f8, build: { chest: 0.145, belly: 0.11, limb: 1.05 },
    face: { skin: '#e0ad86', iris: '#4a7aaa', brow: '#4a3220', browW: 4, browY: -3, lip: '#9a4a40', teeth: true, raiseOnSmile: true }, wide: 0.9, jaw: 0.3 };
  bodyParts(a, s); headParts(a, s);
  const H = a.height;
  a.part('head', hairCap(a, 0x5a3e24, { theta: 1.05, lift: 0.004 * H }).box(0.08 * H, 0.02 * H, 0.06 * H, { pos: [0.01 * H, 0.13 * H, 0.02 * H], rot: [0.2, 0, -0.15], color: 0x5a3e24 }));
  a.expr = 1; // that smile (special row 0)
  addLanyard(a, 'JARRAD', 'HERE TO HELP!');
  const ballT = canvasTex(64, 32, (g, w, h) => { g.fillStyle = '#f4f1e8'; g.fillRect(0, 0, w, h); g.fillStyle = '#ffcf1f'; g.fillRect(0, 10, w, 6); g.fillStyle = '#2f6fb5'; g.fillRect(0, 22, w, 5); }, { nearest: false });
  const ball = new THREE.Mesh(new THREE.SphereGeometry(0.105, 14, 10), new THREE.MeshLambertMaterial({ map: ballT }));
  a.props.ball = a.attach('handL', ball, [0.0, -0.14 * H, 0.06], [0, 0, 0]);
  return a;
}
function buildRue() {
  // Rue lives in his own tiny scene (Head Office), rendered to the slate (§3.3)
  const a = new Actor('rue', { height: 1.76, shoulder: 0.23, hip: 0.1 });
  const s = { skin: '#e6bea2', shirt: 0xf0f0ec, pants: 0x1c2238, sleeve: 'long', sleeveCol: 0x1c2a4a, collar: 0xffffff, build: { chest: 0.13, belly: 0.12 },
    face: { skin: '#e6bea2', iris: '#4a7aaa', brow: '#b9b9b9', browW: 4, lip: '#9a5a50', smile: true, teeth: true }, wide: 0.9 };
  bodyParts(a, s); headParts(a, s);
  const H = a.height;
  a.part('chest', new GB().cyl(0.1 * H, 0.085 * H, 0.17 * H, 10, { pos: [0, 0.07 * H, -0.004], scale: [1.2, 1, 0.9], color: 0x1c2a4a }).box(0.04 * H, 0.1 * H, 0.004, { pos: [0, 0.1 * H, 0.072 * H], color: 0xf0f0ec }).box(0.012 * H, 0.08 * H, 0.004, { pos: [0, 0.09 * H, 0.074 * H], color: 0x8a2a2a }));
  const hair = hairCap(a, 0xbfc2c4, { theta: 1.05 }); hair.box(0.004 * H, 0.004 * H, 0.08 * H, { pos: [0.03 * H, 0.135 * H, 0.0], color: 0x9a9da0 });
  a.part('head', hair);
  return a;
}
function buildFayeBody() {
  const g = new GB();
  g.lathe([[0, -0.86], [0.12, -0.84], [0.17, -0.6], [0.2, -0.2], [0.23, 0.15], [0.21, 0.5], [0.15, 0.62], [0.13, 0.7], [0.14, 0.82], [0.1, 0.92], [0, 0.95]], 10, { scale: [1, 1, 0.75], color: 0xffffff });
  const m = g.mesh(MATS.fleece); m.rotation.z = PI / 2;
  const holder = new THREE.Group(); holder.add(m); R.scene.add(holder); holder.visible = false;
  const cardT = textTex(128, 96, (c, w, h) => {
    c.fillStyle = '#f6f2e6'; c.fillRect(0, 0, w, h); c.fillStyle = '#0f8a8a'; c.font = '700 12px Cinzel, Georgia, serif'; drawLines(c, ['Farewell, Faye'], w / 2, 13, 0);
    c.fillStyle = '#333'; c.font = 'italic 8px Barlow, sans-serif';
    const names = ['Conway', 'Pudmenzky', 'McRoberts', 'Dedman', 'Luke', 'Zane', 'Chase', 'Luka', 'Sam', 'Priya', 'Jo', 'Tom', 'Mel', 'Ari', 'Kev', 'Bec', 'Ollie', 'Dee'];
    names.forEach((n, i) => { c.save(); c.translate(10 + (i % 3) * 40 + (i * 7) % 9, 30 + Math.floor(i / 3) * 11); c.rotate(((i * 37) % 9 - 4) * 0.03); c.textAlign = 'left'; c.fillText(n, 0, 0); c.restore(); });
  });
  const card = new THREE.Mesh(new THREE.PlaneGeometry(0.22, 0.16), new THREE.MeshLambertMaterial({ map: cardT }));
  card.rotation.x = -PI / 2; card.position.set(0, 0.2, 0.1); card.visible = false; holder.add(card);
  OBJ.faye = holder; OBJ.card = card;
  return holder;
}

// ---------- the Churned and friends ----------
const CHURN_VARIANTS = [
  { shirt: 0x5c6a70, pants: 0x3a4044, jacket: 0x6a5a4a, hair: 0x4a4a48 },
  { shirt: 0x4a5560, pants: 0x2e3238, jacket: null, hair: null, phone: true },
  { shirt: 0x6a6252, pants: 0x3e3a34, jacket: 0x3a4a5a, hair: 0x6a6a64 },
  { shirt: 0x506a60, pants: 0x30363a, jacket: null, hair: 0x3a3a38, phone: true },
  { shirt: 0x6a5060, pants: 0x3a3238, jacket: 0x5a4a3a, hair: null },
  { shirt: 0x58606a, pants: 0x34383e, jacket: 0x4a4e3a, hair: 0x5a5a56 },
];
let churnCount = 0;
function buildChurned(type = 'churned', variant = null) {
  const v = variant != null ? CHURN_VARIANTS[variant % 6] : CHURN_VARIANTS[churnCount % 6];
  const id = type + '_' + (churnCount++);
  const big = type === 'brute', bloat = type === 'holdmusic', gaunt = type === 'reviewer';
  const a = new Actor(id, { height: big ? 2.2 : gaunt ? 1.86 : 1.76, shoulder: big ? 0.3 : 0.22, hip: big ? 0.13 : 0.1, kind: type });
  const skin = '#8d9a98';
  const s = { skin, shirt: gaunt ? 0x9a8a6a : v.shirt, pants: v.pants, sleeve: 'short', shoes: 0x2a2a2a, sole: 0x777777, build: { chest: big ? 0.17 : gaunt ? 0.1 : 0.13, belly: bloat ? 0.2 : big ? 0.16 : 0.11, limb: big ? 1.25 : gaunt ? 0.8 : 1 },
    face: { skin, glowEyes: '#3df2e0', brow: '#4a5250', browW: 3, browTilt: 3, lip: '#4a5652', grey: true, sockets: 0.35 }, wide: 0.9 };
  if (v.jacket && !gaunt) { s.sleeve = 'long'; s.sleeveCol = v.jacket; }
  bodyParts(a, s); headParts(a, s);
  const H = a.height;
  if (v.hair) a.part('head', hairCap(a, v.hair, { theta: 0.9 }));
  if (v.jacket && !gaunt) a.part('chest', new GB().cyl(0.105 * H, 0.09 * H, 0.17 * H, 9, { pos: [0, 0.07 * H, 0], scale: [1.2, 1, 0.95], color: v.jacket, jitter: 0.2 }).box(0.05 * H, 0.06 * H, 0.01, { pos: [0.04 * H, 0.04 * H, 0.082 * H], rot: [0, 0, 0.3], color: 0x2a2a2a }));
  if (gaunt) a.part('chest', new GB().cyl(0.09 * H, 0.08 * H, 0.18 * H, 9, { pos: [0, 0.07 * H, 0], scale: [1.15, 1, 0.9], color: 0xb8a47e }));
  // glowing eyes (emissive, so they read in the dark)
  const eg = new GB().sphere(0.009 * H, 6, 4, { pos: [0.023 * H, 0.072 * H, 0.06 * H] }).sphere(0.009 * H, 6, 4, { pos: [-0.023 * H, 0.072 * H, 0.06 * H] });
  a.attach('head', eg.mesh(MATS.churnEye, { cast: false }));
  if (v.phone && !big && !bloat) a.props.phone = a.attach('handR', new GB().box(0.045, 0.09, 0.008, { color: 0x111 }).box(0.04, 0.08, 0.001, { pos: [0, 0, 0.0045], color: 0x2a5a5a }).mesh(MATS.vcNoSnow), [0, -0.1 * H, 0.02], [0.4, 0, 0]);
  if (big) {
    // PLEASE QUEUE HERE sandwich board shield, rusted stanchion spear
    const bt = textTex(128, 160, (g, w, h) => { g.fillStyle = '#e8e2d2'; g.fillRect(0, 0, w, h); g.fillStyle = '#b32a1f'; g.fillRect(0, 0, w, 22); g.fillStyle = '#1b1b1b'; g.font = '900 26px Barlow, sans-serif'; drawLines(g, ['PLEASE', 'QUEUE', 'HERE'], w / 2, 52, 34); g.fillStyle = '#b32a1f'; g.beginPath(); g.moveTo(w / 2, 150); g.lineTo(w / 2 - 16, 128); g.lineTo(w / 2 + 16, 128); g.fill(); });
    const board = new THREE.Group();
    const bm = new THREE.Mesh(new THREE.BoxGeometry(0.85, 1.15, 0.05), [MATS.vcNoSnow, MATS.vcNoSnow, MATS.vcNoSnow, MATS.vcNoSnow, new THREE.MeshLambertMaterial({ map: bt }), new THREE.MeshLambertMaterial({ color: 0x6a5a4a })]);
    bm.geometry = bm.geometry.toNonIndexed(); const cc = new Float32Array(bm.geometry.attributes.position.count * 3).fill(0.5); bm.geometry.setAttribute('color', new THREE.BufferAttribute(cc, 3));
    board.add(bm); board.position.set(0.06, -0.1 * H, 0.12); board.rotation.set(0, 0, 0);
    a.attach('foreL', board); a.props.board = board;
    const sp = new GB().cyl(0.03, 0.03, 2.2, 6, { pos: [0, 0.5, 0], color: 0x7a4a2a }).cyl(0.16, 0.18, 0.06, 10, { pos: [0, -0.6, 0], color: 0x553a2e }).cone(0.05, 0.25, 5, { pos: [0, 1.7, 0], color: 0x6a3a22 }).box(0.06, 0.5, 0.008, { pos: [0.05, 1.3, 0], color: 0x8a2a20 });
    a.props.spear = a.attach('handR', sp.mesh(MATS.vcNoSnow), [0, -0.08 * H, 0.03], [PI / 2, 0, 0]);
  }
  if (bloat) {
    // bloated, yellow light leaking from the seams
    const seams = new GB();
    for (let i = 0; i < 6; i++) seams.box(0.015, 0.18 * H, 0.01, { pos: [Math.sin(i) * 0.15, 0.07 * H, Math.cos(i) * 0.15], rot: [0, i, 0.2], color: 0xffffff });
    a.attach('spine', new GB().sphere(0.21, 12, 9, { pos: [0, 0.07 * H, 0.02], scale: [1.1, 1.0, 1.0], color: v.shirt, jitter: 0.15 }).mesh(MATS.vcNoSnow));
    a.attach('spine', seams.mesh(MATS.yellowGlow, { cast: false }));
    a.attach('chest', new GB().sphere(0.17, 10, 8, { pos: [0, 0.06 * H, 0.02], color: v.shirt, jitter: 0.12 }).mesh(MATS.vcNoSnow));
    const rings = [];
    for (let i = 0; i < 3; i++) { const m = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.012, 4, 24), new THREE.MeshBasicMaterial({ color: 0xffd34a, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false })); m.rotation.x = PI / 2; a.root.add(m); m.position.y = 1.0; rings.push(m); }
    a.props.rings = rings;
  }
  if (gaunt) {
    a.props.star = a.attach('handR', new THREE.Mesh(new THREE.OctahedronGeometry(0.1, 0), MATS.ember), [0, -0.1 * H, 0.04]);
  }
  a.breathPuffs = false;
  a.anim.setOverlay('churnIdle', 50);
  a.anim.overlayW = 1;
  return a;
}

// ---------- Dodgy Hamarr, Troll of the Comment Section ----------
function buildHamarr() {
  const a = new Actor('hamarr', { height: 6.0, shoulder: 0.32, hip: 0.13, kind: 'hamarr' });
  const H = a.height, hide = 0x6f8291, hideDk = 0x52616c, moss = 0x4a5a3a;
  a.legLen = H * 0.42; a.bones.hips.position.y = a.legLen;
  const s = { skin: '#6f8291', shirt: hide, pants: 0x4a3a2c, sleeve: 'none', shoes: hideDk, sole: hideDk, build: { chest: 0.19, belly: 0.17, limb: 1.4 }, hipW: 0.22,
    face: { skin: '#6f8291', glowEyes: '#3df2e0', brow: '#2a3238', browW: 9, browTilt: 5, lip: '#3a444a', sockets: 0.4 }, wide: 1.0, jaw: 0.1 };
  bodyParts(a, s); headParts(a, s);
  a.bones.head.scale.setScalar(0.72); a.bones.head.position.z = 0.04 * H; a.bones.neck.position.z = 0.03 * H;
  // huge forearms, ice and moss crust, carved ALL-CAPS runes
  for (const k of ['L', 'R']) {
    a.part('fore' + k, new GB().cyl(0.062 * H, 0.05 * H, 0.15 * H, 9, { pos: [0, -0.07 * H, 0], color: hide, jitter: 0.12 }).box(0.03 * H, 0.03 * H, 0.03 * H, { pos: [0.02 * H, -0.03 * H, 0.04 * H], color: 0xd8eaf2 }));
    a.part('hand' + k, new GB().box(0.08 * H, 0.08 * H, 0.05 * H, { pos: [0, -0.05 * H, 0.01 * H], color: hideDk }));
  }
  a.part('chest', new GB().sphere(0.12 * H, 10, 8, { pos: [0, 0.13 * H, -0.03 * H], scale: [1.3, 0.8, 1], color: hide, jitter: 0.15 }).ico(0.04 * H, 0, { pos: [0.08 * H, 0.2 * H, -0.06 * H], color: moss }).ico(0.035 * H, 0, { pos: [-0.1 * H, 0.17 * H, -0.08 * H], color: 0xd8eaf2 }));
  const rg = new GB();
  for (let i = 0; i < 14; i++) rg.box(0.004 * H, 0.012 * H + (i % 3) * 0.004 * H, 0.002 * H, { pos: [-0.06 * H + (i % 7) * 0.02 * H, 0.06 * H + Math.floor(i / 7) * 0.035 * H, 0.112 * H], rot: [0, 0, (i % 2 ? 0.3 : -0.3)] });
  a.attach('chest', rg.mesh(MATS.tealGlow, { cast: false }));
  // beard of tangled old phone cables
  const beard = new GB(), r = mulberry32(66);
  for (let i = 0; i < 26; i++) { const x = (r() - .5) * 0.09 * H, l = 0.05 * H + r() * 0.12 * H; beard.strut([x, 0.03 * H, 0.06 * H], [x + (r() - .5) * 0.04 * H, 0.03 * H - l, 0.07 * H + r() * 0.03 * H], 0.006 * H, { round: true, seg: 4, color: pick([0x111111, 0x2a2a2a, 0xdddddd, 0x3a3a3a]) }); }
  a.part('head', beard);
  a.breathPuffs = false;
  // the Totem of Grievances
  const tt = textTex(128, 512, (g, w, h) => {
    g.fillStyle = '#5c4232'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 6; i++) { const y = 40 + i * 80; g.fillStyle = '#3a281b'; g.beginPath(); g.ellipse(w / 2, y, 48, 36, 0, 0, TAU); g.fill(); g.strokeStyle = '#2a1a10'; g.lineWidth = 6; g.beginPath(); g.moveTo(w / 2 - 34, y - 18); g.lineTo(w / 2 - 8, y - 8); g.moveTo(w / 2 + 34, y - 18); g.lineTo(w / 2 + 8, y - 8); g.stroke(); g.fillStyle = '#1a0e08'; g.fillRect(w / 2 - 22, y + 10, 44, 14); }
  });
  const te = textTex(128, 512, (g, w, h) => { g.fillStyle = '#000'; g.fillRect(0, 0, w, h); for (let i = 0; i < 6; i++) { const y = 40 + i * 80; g.fillStyle = '#3df2e0'; g.beginPath(); g.arc(w / 2 - 20, y - 4, 7, 0, TAU); g.arc(w / 2 + 20, y - 4, 7, 0, TAU); g.fill(); } });
  const totem = new THREE.Group();
  const tmesh = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.6, 5.2, 10), new THREE.MeshLambertMaterial({ map: tt, emissiveMap: te, emissive: new THREE.Color(0.3, 2.6, 2.4) }));
  tmesh.position.y = 2.2; tmesh.castShadow = true; totem.add(tmesh);
  const topFace = new THREE.Mesh(new THREE.SphereGeometry(0.4, 10, 8), glow(0.4, 3.4, 3.2)); topFace.position.y = 4.85; topFace.scale.set(1, 0.4, 1); totem.add(topFace);
  a.props.totem = totem; a.props.totemTop = topFace; a.props.totemMesh = tmesh;
  a.attach('handR', totem, [0, -0.06 * H, 0.06 * H], [PI / 2, 0, 0]);
  // the Reply grab hand glows yellow when it reaches
  a.props.handGlow = new THREE.Mesh(new THREE.SphereGeometry(0.42, 10, 8), new THREE.MeshBasicMaterial({ color: 0xffd34a, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }));
  a.bones.handL.add(a.props.handGlow); a.props.handGlow.position.y = -0.05 * H;
  return a;
}

// ---------- Hildis-Vinnie, a giant wombat the size of a small car ----------
function buildWombat() {
  const g = new THREE.Group();
  const fur = 0x6a5a4a, furDk = 0x4a3e34;
  const body = new GB().sphere(1, 14, 10, { scale: [1.15, 0.95, 1.65], pos: [0, 1.15, 0], color: fur, jitter: 0.12 })
    .sphere(0.8, 10, 8, { scale: [1, 0.8, 0.9], pos: [0, 1.0, -1.2], color: furDk });
  const bm = body.mesh(MATS.fur); g.add(bm);
  const head = new THREE.Group(); head.position.set(0, 1.25, 1.55); g.add(head);
  head.add(new GB().sphere(0.72, 12, 9, { scale: [1.15, 0.9, 1.05], color: fur, jitter: 0.1 }).box(0.62, 0.45, 0.4, { pos: [0, -0.15, 0.55], color: 0x2a2420 })
    .sphere(0.16, 6, 5, { pos: [0.55, 0.55, -0.1], scale: [0.6, 1, 0.6], color: furDk }).sphere(0.16, 6, 5, { pos: [-0.55, 0.55, -0.1], scale: [0.6, 1, 0.6], color: furDk })
    .sphere(0.06, 5, 4, { pos: [0.32, 0.18, 0.62], color: 0x0a0a0a }).sphere(0.06, 5, 4, { pos: [-0.32, 0.18, 0.62], color: 0x0a0a0a }).mesh(MATS.fur));
  const legs = [];
  for (const [x, z] of [[0.7, 0.9], [-0.7, 0.9], [0.7, -0.9], [-0.7, -0.9]]) { const l = new THREE.Group(); l.position.set(x, 0.75, z); l.add(new GB().cyl(0.26, 0.3, 0.75, 8, { pos: [0, -0.37, 0], color: furDk }).box(0.36, 0.12, 0.44, { pos: [0, -0.72, 0.08], color: 0x2a2420 }).mesh(MATS.fur)); g.add(l); legs.push(l); }
  const arrow = new THREE.Mesh(buildArrowGeo(), MATS.vcNoSnow); arrow.position.set(0.5, 1.7, -1.6); arrow.rotation.set(-0.6, 0.4, 0); g.add(arrow);
  g.traverse(m => { if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; } });
  R.scene.add(g); g.visible = false;
  const W = { root: g, head, legs, arrow, pos: g.position, yaw: 0, state: 'hidden', t: 0, lie: 0, speed: 0, walkTo: null };
  OBJ.wombat = W;
  return W;
}
function updateWombat(dt) {
  const W = OBJ.wombat; if (!W || !W.root.visible) return;
  W.t += dt;
  if (W.walkTo) { const dx = W.walkTo.x - W.pos.x, dz = W.walkTo.z - W.pos.z, d = Math.hypot(dx, dz); if (d > 0.3) { W.yaw = dampAngle(W.yaw, Math.atan2(dx, dz), 2, dt); W.speed = damp(W.speed, 1.6, 2, dt); W.pos.x += Math.sin(W.yaw) * W.speed * dt; W.pos.z += Math.cos(W.yaw) * W.speed * dt; } else { W.speed = damp(W.speed, 0, 4, dt); } W.pos.y = groundHeight(W.pos.x, W.pos.z); }
  W.root.rotation.set(0, W.yaw, 0);
  W.root.rotateZ(W.lie * 1.35);
  W.root.position.y = W.pos.y + W.lie * 0.15;
  const ph = W.t * 5 * Math.min(1, W.speed);
  W.legs.forEach((l, i) => { l.rotation.x = Math.sin(ph + (i % 2 ? PI : 0) + (i > 1 ? PI : 0)) * 0.5 * Math.min(1, W.speed); });
  W.head.rotation.x = Math.sin(W.t * 1.3) * 0.04 + (W.sneeze || 0) * -0.6;
  W.head.rotation.y = W.shake ? Math.sin(W.t * 18) * 0.3 * W.shake : 0;
}

// ---------- ravens (and the five Mystery Shoppers) ----------
const RAVENS = [];
function buildRaven(shopper = false) {
  const g = new THREE.Group();
  const body = new GB().sphere(0.1, 8, 6, { scale: [0.8, 0.8, 1.6], color: 0x111214 }).sphere(0.07, 7, 5, { pos: [0, 0.07, 0.14], color: 0x111214 }).cone(0.025, 0.09, 4, { pos: [0, 0.06, 0.24], rot: [PI / 2, 0, 0], color: 0x222 })
    .box(0.1, 0.01, 0.14, { pos: [0, 0.01, -0.2], rot: [-0.2, 0, 0], color: 0x111214 });
  if (shopper) body.box(0.05, 0.065, 0.006, { pos: [0.02, -0.12, 0.02], rot: [0.3, 0, 0], color: 0xf0f0ea }).box(0.05, 0.012, 0.007, { pos: [0.02, -0.09, 0.022], rot: [0.3, 0, 0], color: 0x8a5a2a });
  const bm = body.mesh(MATS.vcNoSnow); g.add(bm);
  const wings = [];
  for (const s of [1, -1]) { const w = new THREE.Group(); w.position.set(s * 0.06, 0.04, 0.02); w.add(new GB().box(0.26, 0.012, 0.13, { pos: [s * 0.13, 0, -0.02], color: 0x15161a }).mesh(MATS.vcNoSnow)); g.add(w); wings.push(w); }
  const eye = new THREE.Mesh(new THREE.SphereGeometry(0.014, 6, 4), shopper ? MATS.greenEye : MATS.black); eye.position.set(0.05, 0.09, 0.17); g.add(eye);
  if (shopper) { const e2 = new THREE.Mesh(new THREE.SphereGeometry(0.012, 5, 4), MATS.black); e2.position.set(-0.05, 0.09, 0.17); g.add(e2); }
  R.scene.add(g); g.visible = false;
  const r = { root: g, wings, shopper, state: 'off', t: 0, vel: V3(), alive: true, pos: g.position, hitR: 0.35 };
  RAVENS.push(r);
  return r;
}
function perchRaven(r, p, yaw = 0) { r.root.visible = true; r.root.position.copy(p); r.root.rotation.set(0, yaw, 0); r.state = 'perch'; r.t = 0; r.alive = true; }
function flyRaven(r, dir) { r.state = 'fly'; r.t = 0; r.vel.copy(dir); }
function updateRavens(dt) {
  for (const r of RAVENS) {
    if (!r.root.visible) continue;
    r.t += dt;
    if (r.state === 'perch') { r.wings.forEach((w, i) => w.rotation.z = (i ? -1 : 1) * (0.1 + Math.sin(r.t * 0.7) * 0.03)); r.root.children[0].rotation.x = Math.sin(r.t * 9) > 0.7 ? 0.25 : 0; r.root.rotation.y += Math.sin(r.t * 0.6) * 0.002; }
    else if (r.state === 'fly') {
      r.wings.forEach((w, i) => w.rotation.z = (i ? -1 : 1) * Math.sin(r.t * 22) * 0.9);
      r.vel.y += dt * 1.2; r.root.position.addScaledVector(r.vel, dt);
      r.root.rotation.y = Math.atan2(r.vel.x, r.vel.z);
      if (r.t > 8) { r.root.visible = false; r.state = 'off'; }
    }
  }
}
