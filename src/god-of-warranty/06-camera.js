// ================= CAMERA =================
// One PerspectiveCamera, ever. Gameplay and cinematics are targets fed to a virtual camera operator (§5.2).

const GAME_CAM = {
  explore: { shoulder: 0.55, height: 1.55, dist: 2.1, lens: 26, fStop: 5.6, omega: 9 },
  combat:  { shoulder: 0.6,  height: 1.6,  dist: 2.6, lens: 24, fStop: 5.6, omega: 10 },
  aim:     { shoulder: 0.45, height: 1.6,  dist: 1.3, lens: 32, fStop: 4,   omega: 14 },
  boss:    { shoulder: 0.8,  height: 1.95, dist: 3.6, lens: 20, fStop: 8,   omega: 8 },
  carry:   { shoulder: 0.2,  height: 1.9,  dist: 4.4, lens: 30, fStop: 5.6, omega: 6 },
  rage:    { shoulder: 0.55, height: 1.7,  dist: 3.0, lens: 22, fStop: 5.6, omega: 10 },
};
const focalToFov = mm => 2 * Math.atan(24 / (2 * mm)) / DEG;

const CAM = {
  // cinematic springs
  pos: new Spring3({ omega: 3.2, zeta: 0.92 }), aim: new Spring3({ omega: 4.0, zeta: 0.95 }), roll: new Spring1({ omega: 2, zeta: 1 }),
  tPos: V3(), tAim: V3(), tRoll: 0,
  shot: null, shotT: 0, shotOpts: null,
  cineOmega: 3.2, omegaNow: 3.2,
  // gameplay
  gameW: 0, gameWTarget: 0, gameWRate: 1 / 1.2, gameWFrom: 0, gameWT: 1,
  yaw: 0, pitch: 0.12, quickTurn: 0,
  gp: { ...GAME_CAM.explore }, gMode: 'explore', pivot: new Spring3({ omega: 9, zeta: 1 }), colDist: new Spring1({ omega: 6, zeta: 1, x: 2.1 }),
  gPos: V3(), gAim: V3(),
  // lens
  focal: 35, focalFrom: 35, focalTo: 35, focalT: 1, focalDur: 1, focalEase: EASE.inOutSine,
  fStop: 4, fStopFrom: 4, fStopTo: 4, fStopT: 1, fStopDur: 1,
  focus: new Spring1({ omega: 6, zeta: 0.8, x: 3 }), focusSubject: null, pullFrom: 3, pullT: 1, pullDur: 1, prevSubject: null, focusOverride: null,
  handheld: 0.35, handheldTarget: 0.35, trauma: 0,
  final: { pos: V3(0, 120, 0), aim: V3(0, 0, 50), roll: 0, fwd: V3(0, 0, 1) },
  prevFwd: V3(0, 0, 1), speed: 0, prevPos: V3(), stridePh: 0,
  t: 0, freeFly: false,
};

// ---- director-facing API ----
CAM.shotFn = function (fn, o = {}) {
  this.shot = fn; this.shotT = 0; this.shotOpts = o;
  if (o.omega) this.cineOmega = o.omega;
  if (o.lens) this.lensTo(o.lens, o.lensDur != null ? o.lensDur : (o.blend || 1.2));
  if (o.fStop) this.fStopTo_(o.fStop, o.fDur != null ? o.fDur : (o.blend || 1.2));
  if (o.handheld != null) this.handheldTarget = o.handheld;
  if (o.snap) { fn(0, this.tPos, this.tAim); this.pos.snap(this.tPos); this.aim.snap(this.tAim); }
  return this;
};
CAM.lensTo = function (mm, dur = 1, ease = EASE.inOutSine) { this.focalFrom = this.focal; this.focalTo = mm; this.focalT = 0; this.focalDur = Math.max(0.001, dur); this.focalEase = ease; };
CAM.fStopTo_ = function (n, dur = 1) { this.fStopFrom = this.fStop; this.fStopTo = n; this.fStopT = 0; this.fStopDur = Math.max(0.001, dur); };
// focus subjects are functions returning a world-space point
CAM.focusOn = function (subj) { this.focusSubject = subj; this.pullT = 1; };
CAM.pull = function (subj, secs = 1) { this.pullFrom = this.focus.x; this.focusSubject = subj; this.pullT = 0; this.pullDur = Math.max(0.05, secs); };
CAM.shake = function (amt) { this.trauma = Math.min(1, this.trauma + amt); };
// switch to cinematic: the current pose is the first keyframe — nothing jumps
CAM.toCine = function (dur = 0.6) {
  if (this.gameW > 0.001 || this.gameWTarget > 0) {
    this.pos.snap(this.final.pos); this.aim.snap(this.final.aim);
    this.tPos.copy(this.final.pos); this.tAim.copy(this.final.aim);
    this.omegaNow = this.gp.omega;
  }
  this.gameW = 0; this.gameWTarget = 0; this.gameWT = 1;
  this.focal = this.curFocal(); this.focalTo = this.focal; this.focalT = 1;
  this.fStop = this.curFStop(); this.fStopTo = this.fStop; this.fStopT = 1;
  if (!this.shot) this.shotFn((t, p, a) => { p.copy(CAM.final.pos); a.copy(CAM.final.aim); }, {});
};
// handoff to gameplay: blend from the scene's last pose to the live gameplay pose (smootherstep, 1.2 s)
CAM.toGame = function (dur = 1.2, { keepYaw = false } = {}) {
  if (!keepYaw) {
    const f = _v[0].copy(this.final.aim).sub(this.final.pos);
    this.yaw = Math.atan2(f.x, f.z); this.pitch = clamp(-Math.atan2(f.y, Math.hypot(f.x, f.z)), -0.6, 0.6);
  }
  this.gameWFrom = this.gameW; this.gameWTarget = 1; this.gameWT = 0; this.gameWDur = Math.max(0.01, dur);
  const P = PLAYER;
  if (P) { this.pivot.snap(_v[1].copy(P.pos).add(_v[2].set(0, this.gp.height, 0))); }
  this.colDist.snap(this.gp.dist);
};
CAM.setGameMode = function (m) { this.gMode = m; };
CAM.curFocal = function () { const g = this.gp.lens - (SETTINGS.fovOffset ? 0 : 0); return lerp(this.focal, g, this.gameW); };
CAM.curFStop = function () { return lerp(this.fStop, this.gp.fStop, this.gameW); };

// ---- helpers producing shot functions ----
const SHOT = {
  still: (pos, aim) => (t, p, a) => { p.set(...pos); a.set(...aim); },
  lerp: (p0, p1, a0, a1, dur, ease = EASE.inOutSine) => (t, p, a) => {
    const k = ease(clamp01(t / dur));
    p.set(lerp(p0[0], p1[0], k), lerp(p0[1], p1[1], k), lerp(p0[2], p1[2], k));
    a.set(lerp(a0[0], a1[0], k), lerp(a0[1], a1[1], k), lerp(a0[2], a1[2], k));
  },
  // follow an actor at an offset in that actor's local frame
  track: (actor, off, aimOff = [0, 1.5, 0], aimActor = null) => (t, p, a) => {
    const o = typeof off === 'function' ? off(t) : off;
    localToWorld(actor, o, p);
    const aa = aimActor || actor, ao = typeof aimOff === 'function' ? aimOff(t) : aimOff;
    localToWorld(aa, ao, a);
  },
  orbit: (center, fromDeg, toDeg, radius, height, dur, ease = EASE.inOutSine, aimH = null) => (t, p, a) => {
    const c = typeof center === 'function' ? center() : _v[3].set(...center);
    const ang = lerp(fromDeg, toDeg, ease(clamp01(t / dur))) * DEG;
    const r = typeof radius === 'function' ? radius(t) : radius;
    p.set(c.x + Math.sin(ang) * r, c.y + (typeof height === 'function' ? height(t) : height), c.z + Math.cos(ang) * r);
    a.set(c.x, c.y + (aimH != null ? aimH : 0), c.z);
  },
  // a single on a face: from the actor's front quarter (yaw offset, rad), optionally cheating the aim toward someone else
  // avoid: actors that must not stand between lens and face; the clearer side of the yaw offset is picked once
  face: (A, o = {}) => {
    const h = V3(), f = V3(), b = V3();
    let off = o.yaw != null ? o.yaw : 0.45;
    if (o.avoid) {
      const score = y => { const q = V3().copy(A.pos).addScaledVector(fwdFromYaw(A.yaw + y), o.dist || 2.2); return Math.min(...o.avoid.map(x => { const d = segDist2D(x.pos, A.pos, q); return d; })); };
      if (score(-off) > score(off)) off = -off;
    }
    return (t, p, a) => {
      A.headWorld(h); fwdFromYaw(A.yaw + off, f);
      p.copy(h).addScaledVector(f, Math.max(o.min || 0.9, (o.dist || 2.2) - (o.push || 0) * t)).y += o.dy || 0;
      a.copy(h); if (o.toward) a.lerp(o.toward.headWorld(b), o.k || 0.2);
    };
  },
  // a two-shot that keeps both heads in frame from one side of the line between them; swing rotates around the midpoint
  two: (A, B, o = {}) => {
    const ha = V3(), hb = V3(), m = V3();
    return (t, p, a) => {
      A.headWorld(ha); B.headWorld(hb); m.copy(ha).lerp(hb, o.bias != null ? o.bias : 0.5);
      const dx = hb.x - ha.x, dz = hb.z - ha.z, len = Math.hypot(dx, dz) || 1;
      let sd = o.side || 1;
      if (o.from) { const fp = o.from.pos || o.from; sd = (-dz * (fp.x - m.x) + dx * (fp.z - m.z)) >= 0 ? 1 : -1; } // the side the onlooker stands on
      const nx = -dz / len * sd, nz = dx / len * sd, sw = (o.swing || 0) + (o.drift || 0) * t, c = Math.cos(sw), sn = Math.sin(sw);
      const half = 21.3 / Math.max(10, CAM.focalTo || CAM.focal); // tan(hfov / 2) at 16:9
      const d = Math.max(o.min || 2.4, len * (o.fill || 0.85) / half);
      p.set(m.x + (nx * c - nz * sn) * d, m.y + (o.dy != null ? o.dy : 0.1), m.z + (nx * sn + nz * c) * d);
      a.copy(m); a.y += o.ay != null ? o.ay : -0.1;
    };
  },
  path: (pts, aims, dur, ease = EASE.inOutSine) => {
    const cp = new THREE.CatmullRomCurve3(pts.map(q => V3(...q)), false, 'centripetal');
    const ca = aims.length > 1 ? new THREE.CatmullRomCurve3(aims.map(q => V3(...q)), false, 'centripetal') : null;
    const a0 = V3(...aims[0]);
    return (t, p, a) => { const k = ease(clamp01(t / dur)); cp.getPoint(k, p); if (ca) ca.getPoint(k, a); else a.copy(a0); };
  },
};
// distance in the ground plane from point c to the segment a→b
function segDist2D(c, a, b) { const dx = b.x - a.x, dz = b.z - a.z, L2 = dx * dx + dz * dz || 1, k = clamp01(((c.x - a.x) * dx + (c.z - a.z) * dz) / L2); return Math.hypot(c.x - a.x - dx * k, c.z - a.z - dz * k); }
function localToWorld(actor, off, out) {
  const yaw = actor.yaw != null ? actor.yaw : 0, base = actor.pos || actor.position;
  const s = Math.sin(yaw), c = Math.cos(yaw);
  // local: +x = actor's left?  We use +x = actor's right, +z = actor's forward
  out.set(base.x + (-c * off[0]) + s * off[2], base.y + off[1], base.z + (s * off[0]) + c * off[2]);
  return out;
}

// ---- per-frame update ----
const _camQ = new THREE.Quaternion(), _camE = new THREE.Euler(0, 0, 0, 'YXZ'), _camM = new THREE.Matrix4();
function updateCamera(dt, realDt) {
  const C = CAM; C.t += dt;
  if (C.freeFly) return updateFreeFly(realDt);
  // lens tweens
  if (C.focalT < 1) { C.focalT = Math.min(1, C.focalT + dt / C.focalDur); C.focal = lerp(C.focalFrom, C.focalTo, C.focalEase(C.focalT)); }
  if (C.fStopT < 1) { C.fStopT = Math.min(1, C.fStopT + dt / C.fStopDur); C.fStop = lerp(C.fStopFrom, C.fStopTo, EASE.inOutSine(C.fStopT)); }
  C.handheld = damp(C.handheld, C.handheldTarget, 1.5, dt);

  // cinematic springs
  if (C.shot) { C.shotT += dt; C.shot(C.shotT, C.tPos, C.tAim); }
  else if (C.gameW >= 1) { C.tPos.copy(C.gPos); C.tAim.copy(C.gAim); }
  C.omegaNow = damp(C.omegaNow, C.cineOmega, 1.0, dt);
  C.pos.omega = C.omegaNow; C.aim.omega = C.omegaNow * 1.25;
  C.pos.target.copy(C.tPos); C.aim.target.copy(C.tAim);
  C.pos.step(dt); C.aim.step(dt);
  C.roll.target = C.tRoll; C.roll.step(dt);

  // gameplay pose
  if (C.gameWTarget > 0 || C.gameW > 0) updateGameCam(dt);
  if (C.gameWT < 1) { C.gameWT = Math.min(1, C.gameWT + dt / (C.gameWDur || 1.2)); C.gameW = lerp(C.gameWFrom, C.gameWTarget, smootherstep(C.gameWT)); if (C.gameWT >= 1 && C.gameWTarget === 1) C.shot = null; }

  // a target that went bad (e.g. an actor that vanished) must never poison the take
  if (!isFinite(C.tPos.x + C.tPos.y + C.tPos.z + C.tAim.x + C.tAim.y + C.tAim.z)) { C.tPos.copy(C.final.pos); C.tAim.copy(C.final.aim); }
  if (!isFinite(C.pos.x.x + C.pos.x.y + C.pos.x.z + C.aim.x.x + C.aim.x.y + C.aim.x.z)) { C.pos.snap(C.final.pos); C.aim.snap(C.final.aim); }
  if (!isFinite(C.gPos.x + C.gPos.y + C.gPos.z + C.gAim.x + C.gAim.y + C.gAim.z)) { C.gPos.copy(C.final.pos); C.gAim.copy(C.final.aim); }
  const F = C.final, w = C.gameW;
  F.pos.copy(C.pos.x).lerp(C.gPos, w);
  F.aim.copy(C.aim.x).lerp(C.gAim, w);
  F.roll = C.roll.x * (1 - w);

  // lens resolve
  const focal = lerp(C.focal, C.gp.lens, w) ;
  const fStop = lerp(C.fStop, C.gp.fStop, w);
  // focus puller
  let fd = 3;
  const fwd = _v[4].copy(F.aim).sub(F.pos).normalize();
  if (C.focusOverride != null) fd = C.focusOverride;
  else if (C.focusSubject) { const sp = C.focusSubject(); fd = Math.max(0.2, _v[5].copy(sp).sub(F.pos).dot(fwd)); }
  else fd = F.pos.distanceTo(F.aim);
  if (w > 0.5 && PLAYER && !C.focusSubject) {
    fd = C.aiming && C.aimHitDist ? C.aimHitDist : Math.max(0.5, _v[5].copy(PLAYER.pos).add(_v[6].set(0, 1.4, 0)).sub(F.pos).dot(fwd));
  }
  if (C.pullT < 1) { C.pullT = Math.min(1, C.pullT + dt / C.pullDur); C.focus.snap(lerp(C.pullFrom, fd, EASE.inOutSine(C.pullT))); }
  else { C.focus.target = fd; C.focus.step(dt); }

  // camera speed (operator walking?) and angular speed (whip blur)
  C.speed = damp(C.speed, F.pos.distanceTo(C.prevPos) / Math.max(dt, 1e-4), 6, dt);
  C.prevPos.copy(F.pos);

  // ---- apply to the one camera ----
  const cam = R.camera;
  cam.position.copy(F.pos);
  cam.up.set(0, 1, 0);
  cam.lookAt(F.aim);
  // handheld layers in camera local space
  const T = C.t, hh = clamp01(C.handheld * (w > 0.5 ? 0.35 : 1) * SETTINGS.handheld);
  const breathe = 0.3 + 0.7 * hh;
  let dx = 0, dy = 0, dz = 0, rp = 0, ry = 0, rr = F.roll;
  dy += Math.sin(T * TAU * 0.22) * 0.006 * breathe; rp += Math.sin(T * TAU * 0.22 + 0.6) * 0.12 * DEG * breathe;
  dx += Noise.fbm1(T * 0.35, 3.1) * 0.012 * hh * 2; dy += Noise.fbm1(T * 0.35, 7.7) * 0.012 * hh * 2;
  ry += Noise.fbm1(T * 0.35, 11.3) * 0.25 * DEG * hh * 2; rp += Noise.fbm1(T * 0.35, 13.9) * 0.25 * DEG * hh * 2;
  if (C.speed > 0.4 && w < 0.5) { C.stridePh += dt * TAU * 1.8; const k = clamp01((C.speed - 0.4) / 1.5) * hh; dy += Math.abs(Math.sin(C.stridePh)) * 0.015 * k; rr += Math.sin(C.stridePh) * 0.2 * DEG * k; }
  if (hh > 0.6) { const k = (hh - 0.6) / 0.4; rp += Noise.n2(T * 6, 1.7) * 0.05 * DEG * k; ry += Noise.n2(T * 6, 4.2) * 0.05 * DEG * k; }
  C.trauma = Math.max(0, C.trauma - 1.6 * realDt);
  const tr = C.trauma * C.trauma * SETTINGS.shake;
  if (tr > 0) {
    dx += Noise.n2(T * 22, 1) * 0.08 * tr; dy += Noise.n2(T * 22, 2) * 0.08 * tr;
    rp += Noise.n2(T * 24, 3) * 2.5 * DEG * tr; ry += Noise.n2(T * 24, 4) * 2.5 * DEG * tr; rr += Noise.n2(T * 24, 5) * 1.5 * DEG * tr;
  }
  cam.translateX(dx); cam.translateY(dy); cam.translateZ(dz);
  cam.rotateX(rp); cam.rotateY(ry); cam.rotateZ(rr);
  const fovOff = w * (SETTINGS.fovOffset || 0);
  cam.fov = focalToFov(focal) + fovOff;
  cam.updateProjectionMatrix();
  cam.updateMatrixWorld();
  F.fwd.set(0, 0, -1).applyQuaternion(cam.quaternion);
  // whip blur: angular velocity projected to screen
  const ang = Math.acos(clamp(F.fwd.dot(C.prevFwd), -1, 1)) / Math.max(dt, 1e-4);
  if (ang > 2.2) {
    const d = _v[7].copy(F.fwd).sub(C.prevFwd);
    const rx = _v[8].set(1, 0, 0).applyQuaternion(cam.quaternion), ry2 = _v[9].set(0, 1, 0).applyQuaternion(cam.quaternion);
    const k = clamp((ang - 2.2) / 6, 0, 1) * 0.06;
    R.post.whip.set(d.dot(rx), d.dot(ry2)).normalize().multiplyScalar(-k);
  } else R.post.whip.multiplyScalar(0.5);
  C.prevFwd.copy(F.fwd);
  // lens → post
  R.post.focal = focal - fovOff * 0; R.post.fStop = fStop; R.post.focusDist = C.focus.x;
}

const _gc = { f: V3(), r: V3(), d: V3(), p: V3() };
function updateGameCam(dt) {
  const C = CAM, P = PLAYER;
  if (!P) return;
  // mode params blend (aim is fast)
  const target = GAME_CAM[C.gMode] || GAME_CAM.explore;
  const rate = C.gMode === 'aim' || C.prevMode === 'aim' ? 1 / 0.18 * 2.2 : 3.2;
  for (const k of ['shoulder', 'height', 'dist', 'lens', 'fStop', 'omega']) C.gp[k] = damp(C.gp[k], target[k], rate, dt);
  C.prevMode = C.gMode;
  // look input
  if (C.quickTurn > 0) { const s = Math.min(C.quickTurn, dt * PI / 0.22); C.yaw += s; C.quickTurn -= s; }
  C.pitch = clamp(C.pitch, -0.95, 0.75);
  // framing assist: lean toward the nearest attacker behind Luka
  if (C.assistYaw) C.yaw += C.assistYaw * dt;
  const cp = Math.cos(C.pitch), sp = Math.sin(C.pitch);
  const f = _gc.f.set(Math.sin(C.yaw) * cp, -sp, Math.cos(C.yaw) * cp);
  const r = _gc.r.set(-Math.cos(C.yaw), 0, Math.sin(C.yaw));
  C.pivot.omega = C.gp.omega;
  C.pivot.target.set(P.pos.x, P.pos.y + C.gp.height, P.pos.z);
  C.pivot.step(dt);
  const piv = C.pivot.x;
  // collision: march from the pivot toward the desired position
  const want = C.gp.dist;
  const start = _gc.p.copy(piv).addScaledVector(r, C.gp.shoulder * 0.6);
  const dir = _gc.d.copy(f).multiplyScalar(-1).addScaledVector(r, C.gp.shoulder * 0.4 / Math.max(want, 0.5)).normalize();
  let hit = want;
  for (let s = 0.3; s <= want + 0.25; s += 0.25) {
    const x = start.x + dir.x * s, y = start.y + dir.y * s, z = start.z + dir.z * s;
    if (y < groundHeight(x, z) + 0.35 || WORLD.blocksCamera(x, y, z, 0.2)) { hit = Math.max(0.6, s - 0.3); break; }
  }
  const cd = C.colDist;
  cd.omega = hit < cd.x ? 20 : 3.5; cd.target = hit; cd.step(dt);
  const dist = Math.min(cd.x, want);
  C.gPos.copy(piv).addScaledVector(f, -dist).addScaledVector(r, C.gp.shoulder);
  const gh = groundHeight(C.gPos.x, C.gPos.z) + 0.3; if (C.gPos.y < gh) C.gPos.y = gh;
  C.gAim.copy(piv).addScaledVector(r, C.gp.shoulder).addScaledVector(f, 10);
}

// debug free-fly
const FREE = { pos: V3(), yaw: 0, pitch: 0 };
function updateFreeFly(dt) {
  const cam = R.camera, I = INPUT;
  FREE.yaw -= I.look.x * 0.0025; FREE.pitch = clamp(FREE.pitch - I.look.y * 0.0025, -1.5, 1.5);
  const sp = (I.held.sprint ? 40 : 10) * dt;
  const f = V3(Math.sin(FREE.yaw) * Math.cos(FREE.pitch), Math.sin(FREE.pitch), Math.cos(FREE.yaw) * Math.cos(FREE.pitch));
  const r = V3(-Math.cos(FREE.yaw), 0, Math.sin(FREE.yaw));
  FREE.pos.addScaledVector(f, I.move.y * sp).addScaledVector(r, I.move.x * sp);
  cam.position.copy(FREE.pos); cam.lookAt(FREE.pos.clone().add(f)); cam.fov = 50; cam.updateProjectionMatrix(); cam.updateMatrixWorld();
  CAM.final.pos.copy(cam.position); CAM.final.aim.copy(FREE.pos).add(f);
}
