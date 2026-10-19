// ================= GAMEPLAY: Chase — support kit (§7.7) =================
const CHASE = { ai: false, arrows: 4, regen: 0, fireT: 4, downT: 0, chord: 0, chordT: -9, streak: 0, streakT: -9, shootT: 0, grapple: null, arrowsLive: [], arrowPool: [], target: V3(), humT: 30 };
const arrowGeo = () => CHASE.geo || (CHASE.geo = buildArrowGeo());
function quiverMax() { return G.upgrades.strings ? 5 : 4; }
function updateChase(dt) {
  const C = CHASE, a = ACTORS.chase; if (!a || !PLAYER) return;
  updateArrows(dt);
  // quiver regenerates one note every 1.6 s
  if (C.arrows < quiverMax()) { C.regen += dt; if (C.regen >= 1.6) { C.regen = 0; C.arrows++; } }
  if (!C.ai) return;
  const P = PLAYER, L = P.actor;
  if (C.downT > 0) { C.downT -= dt; a.speed = 0; if (C.downT <= 0) { a.anim.play('getUp'); } return; }
  if (C.grapple) { updateGrapple(dt); return; }
  C.shootT -= dt;
  // where to stand
  const back = fwdFromYaw(L.yaw + PI, _v[1]), left = fwdFromYaw(L.yaw + PI / 2, _v[2]);
  const want = C.target;
  if (G.combat) {
    let bestA = 0, bestS = -1e9;
    for (let k = 0; k < 10; k++) {
      const ang = L.yaw + PI * 0.55 + k / 9 * PI * 0.9 * (k % 2 ? 1 : -1) * 0.9;
      const px = P.pos.x + Math.sin(ang) * 5.6, pz = P.pos.z + Math.cos(ang) * 5.6;
      let s = -Math.hypot(px - a.pos.x, pz - a.pos.z) * 0.15;
      for (const e of ENEMIES) if (e.alive && e.state !== 'dead') s -= Math.max(0, 5 - Math.hypot(px - e.pos.x, pz - e.pos.z)) * 2.5;
      if (walkDist(px, pz) > -0.5 && !DECK_on(px, pz)) s -= 30;
      if (s > bestS) { bestS = s; bestA = ang; }
    }
    want.set(P.pos.x + Math.sin(bestA) * 5.6, 0, P.pos.z + Math.cos(bestA) * 5.6);
  } else {
    want.copy(P.pos).addScaledVector(back, 2.8).addScaledVector(left, 1.5);
  }
  const dx = want.x - a.pos.x, dz = want.z - a.pos.z, d = Math.hypot(dx, dz);
  // too far behind and out of sight: catch up quietly
  if (d > 22 && !onScreen(a.pos)) { a.pos.copy(P.pos).addScaledVector(back, 4); a.pos.y = groundHeight(a.pos.x, a.pos.z); }
  let sp = 0;
  if (d > 0.6) { sp = d > 6 ? 5.2 : d > 2.5 ? 3.6 : 1.6; if (P.carry) sp = Math.min(sp, 1.5); }
  a.speed = damp(a.speed, sp, 5, dt);
  if (a.speed > 0.05) { const yawT = Math.atan2(dx, dz); a.anim.turn = damp(a.anim.turn, clamp(angleTo(a.yaw, yawT), -1, 1), 6, dt); a.yaw = dampAngle(a.yaw, yawT, 8, dt); a.pos.x += Math.sin(a.yaw) * a.speed * dt; a.pos.z += Math.cos(a.yaw) * a.speed * dt; }
  WORLD.resolve(a.pos, 0.35);
  separateFromEnemies(a.pos, 0.35);
  a.pos.y = damp(a.pos.y, groundHeight(a.pos.x, a.pos.z), 16, dt);
  // combat stance and auto-fire every 3–5 s at whatever Luka is engaging
  if (G.combat) {
    chaseBowToHand(true); a.anim.setOverlay(C.shootT > -0.6 ? 'bowReady' : 'bowCarry', 8, 'upper');
    C.fireT -= dt;
    if (C.fireT <= 0 && C.arrows > 0) { C.fireT = 3 + frand() * 2; const t = autoTarget(10, 90) || nearestEnemy(P.pos, 12); if (t && t.state !== 'queue') chaseShoot(t, false); }
    if (frand() < dt * 0.05) bark('chase', ['Left side!', 'Right side!', 'Okay, that’s a lot of customers.', 'Is it weird that the dead customers still want to speak to the manager?'], { cd: 12 });
    if (C.shootT > 0) { const tp = C.lastTarget; if (tp && tp.alive) a.yaw = dampAngle(a.yaw, yawTo(a.pos, tp.pos) + 0.35, 10, dt); }
  } else {
    a.anim.setOverlay(null);
    if (!G.combat && C.shootT < -4) chaseBowToHand(false);
    C.humT -= dt; if (C.humT < 0 && !DLG.line && !DLG.convo && a.speed > 0.4) { C.humT = 40 + frand() * 40; humRandom(a); }
  }
}
function DECK_on(x, z) { return x > DECK.x0 - 2 && x < DECK.x1 && z > DECK.z0 && z < DECK.z1; }
function humRandom(a) { if (!AUDIO.ok) return; const t = T0() + 0.05, out = sfxOut(a.pos, 0.6); const notes = [60, 62, 64, 67, 65, 64].map(n => n + (frand() < 0.5 ? 0 : 2)); notes.forEach((n, i) => INST.hum(t + i * 0.32, n, 0.3, 0.6, out)); }

// Command Chase (F / Square): an aimed Note Arrow, 6 damage, 12 stun, and a distract
function chaseCommand() {
  const C = CHASE, P = PLAYER;
  if (!C.ai || C.downT > 0 || C.grapple) return;
  if (C.arrows <= 0) { bark('chase', ['I’m out of notes!', 'Reloading — re-tuning — whatever!'], { cd: 3, force: true }); return; }
  let t = null;
  if (P.aiming) { let best = 6 * DEG; const o = R.camera.position, d = CAM.final.fwd; for (const e of ENEMIES) { if (!e.alive || e.state === 'dead') continue; const a = _v[3].copy(e.hitPoint(_v[4])).sub(o).normalize().angleTo(d); if (a < best) { best = a; t = e; } } }
  if (!t) t = autoTarget(20, 60) || nearestEnemy(P.pos, 20);
  // shoot Mystery Shoppers and other targets too
  if (!t) { const tt = throwTargets().find(x => x.chase && dist2D(x.pos, P.pos) < 25 && Math.abs(angleTo(P.actor.yaw, yawTo(P.pos, x.pos))) < 0.8); if (tt) { chaseShootAt(tt.pos.clone(), true); return; } }
  if (!t) { bark('chase', 'At what?', { cd: 3 }); return; }
  if (G.kpi.grapple && t.stun >= t.stunCap * 0.7 && !t.finisherReady && t.kind === 'churned') { startGrapple(t); return; }
  chaseShoot(t, true);
}
function chaseShoot(t, commanded) { chaseShootAt(t.hitPoint(V3()), commanded, t); }
function chaseShootAt(p, commanded, target = null) {
  const C = CHASE, a = ACTORS.chase;
  if (C.arrows <= 0) return;
  C.arrows--; C.shootT = 0.7; C.lastTarget = target;
  chaseBowToHand(true); a.anim.setOverlay('bowReady', 20, 'upper');
  a.yaw = yawTo(a.pos, p) + 0.35;
  a.anim.play('shoot', { fade: 0.05, onEvent: () => {
    const from = a.boneWorld('handL', V3()).add(V3(0, 0.05, 0));
    const lead = target && target.alive ? target.hitPoint(V3()) : p;
    fireArrow(from, lead, { commanded, target });
  } });
}
function fireArrow(from, to, o) {
  let m = CHASE.arrowPool.find(x => !x.visible);
  if (!m) { m = new THREE.Mesh(arrowGeo(), MATS.vcNoSnow); R.scene.add(m); CHASE.arrowPool.push(m); }
  m.visible = true; m.position.copy(from);
  const v = to.clone().sub(from); const d = v.length(); v.normalize().multiplyScalar(36); v.y += d * 0.06;
  CHASE.arrowsLive.push({ m, v, t: 0, o, stuck: 0 });
  sfx('note', from, 0.35, 74 + Math.min(12, CHASE.streak * 2));
}
function updateArrows(dt) {
  for (let i = CHASE.arrowsLive.length - 1; i >= 0; i--) {
    const A = CHASE.arrowsLive[i];
    if (A.stuck > 0) { A.stuck -= dt; if (A.stuck <= 0) { A.m.visible = false; CHASE.arrowsLive.splice(i, 1); } continue; }
    A.t += dt; A.v.y -= 2.5 * dt; A.m.position.addScaledVector(A.v, dt);
    A.m.lookAt(_v[5].copy(A.m.position).add(A.v));
    const p = A.m.position;
    let hit = false;
    for (const e of ENEMIES) {
      if (!e.alive || e.state === 'dead' || e.state === 'rise') continue;
      if (e.axeHit(p, 0.18)) {
        hit = true; const cmd = A.o.commanded;
        const res = e.hurt({ dmg: cmd ? 6 : 3, stun: (cmd ? 12 : 6) * (G.upgrades.strings ? 1.2 : 1), react: 'flinch', kb: 0.3, dir: _v[6].copy(A.v).normalize(), src: 'chase' });
        if (cmd && e.kind !== 'hamarr') e.distractT = 1.5;
        if (e.kind === 'hamarr' && e.onArrow) e.onArrow(p);
        noteHit(e, cmd);
        fxBurst('flash', p, { scale: 0.5, r: 2.6, g: 2.4, b: 1.2 });
        break;
      }
    }
    if (!hit) for (const t of throwTargets()) if (t.chase !== false && t.pos.distanceTo(p) < (t.r || 0.45)) { t.hit(p, 'arrow'); hit = true; break; }
    if (hit) { A.m.visible = false; CHASE.arrowsLive.splice(i, 1); continue; }
    if (p.y < groundHeight(p.x, p.z) || A.t > 2.5 || WORLD.blocksCamera(p.x, p.y, p.z, 0.02)) { A.stuck = 3; if (A.o.commanded) { CHASE.chord = 0; CHASE.streak = 0; } }
  }
}
// the Treble Bow rings higher with each consecutive hit; with Faye's Chord, four notes release a shockwave
function noteHit(e, commanded) {
  const C = CHASE;
  if (G.time - C.streakT > 3) C.streak = 0;
  C.streak++; C.streakT = G.time;
  if (!commanded) return;
  if (G.time - C.chordT > 3) C.chord = 0;
  C.chordT = G.time;
  const n = MOTIF[C.chord % 4].n;
  sfx('note', e.pos, 0.9, n + 12);
  C.chord++;
  if (C.chord >= 4) {
    C.chord = 0;
    if (G.kpi.chord) {
      fxRing(e.pos, 3, 0.6, [3, 2.6, 0.8]); CAM.shake(0.2); sfx('reset', e.pos, 1);
      for (const o of ENEMIES) if (o.alive && o.state !== 'dead' && dist2D(o.pos, e.pos) < 3 + o.radius) o.addStun(40);
      toast('Faye’s Chord', '');
    }
  }
}
function chaseKnockdown() {
  const a = ACTORS.chase; if (!a || !CHASE.ai || CHASE.downT > 0) return;
  CHASE.downT = 3; a.anim.play('knockdown', { fade: 0.05 }); bark('chase', 'Ow — I’m fine — I’m fine.', { force: true });
}
function startGrapple(t) {
  const C = CHASE, a = ACTORS.chase; C.grapple = { e: t, t: 0 };
  t.releaseToken(); t.setState('stunned'); t.finisherReady = false;
  bark('chase', 'HOLD STILL, SIR!', { force: true });
}
function updateGrapple(dt) {
  const C = CHASE, a = ACTORS.chase, g = C.grapple, e = g.e;
  g.t += dt;
  a.pos.copy(e.pos).addScaledVector(fwdFromYaw(e.yaw + PI, _v[7]), 0.35); a.pos.y = e.pos.y + 0.6; a.yaw = e.yaw;
  a.anim.setOverlay('carryShoulder', 10);
  if (!e.alive || g.t > 3) { C.grapple = null; a.anim.setOverlay(null); if (e.alive) { e.stun = e.stunCap; e.finisherReady = true; e.finT = 3; } a.pos.y = groundHeight(a.pos.x, a.pos.z); }
}
