// ================= GAMEPLAY: game state, Luka =================
const G = {
  mode: 'boot', title: true, time: 0, realTime: 0, timeScale: 1, enemyScale: 1, hitstop: 0, slowT: 0, slowK: 1,
  combat: false, checkpoint: 'grove', flags: {}, silver: 0, commission: 0,
  upgrades: { axe2: false, protector: false, strings: false, fleece: false }, kpi: { upsell: false, wallMount: false, callbackStrike: false, hardClose: false, grapple: false, chord: false },
  promos: { rebate: false, conference: false }, talisman: false, eggs: new Set(), shoppers: new Set(), trophies: new Set(),
  stats: { deaths: 0, priceMatches: 0, finishers: 0, silverEarned: 0, freezes: 0, kills: 0, startT: 0, finisherTypes: new Set(), brothersAsked: 0 },
  tokens: { melee: 2, ranged: 1, usedMelee: 0, usedRanged: 0 }, inputLock: 0,
};
const diff = () => DIFFICULTY[SETTINGS.difficulty] || DIFFICULTY.plan;

let PLAYER = null;
function makePlayer() {
  const a = ACTORS.luka;
  PLAYER = {
    actor: a, pos: a.pos, vel: V3(), hp: 100, maxHp: 100, hpLag: 100, rage: 0, rageActive: false, rageT: 0,
    state: 'cine', stateT: 0, move: null, moveKey: '', combo: 0, comboT: 0, hitSet: new Set(), queued: null, charge: 0,
    axeState: 'hand', axe: null, weapon: 'none', shieldUp: false, shieldT: 0, shieldPress: -9, shieldScale: 0, aiming: false,
    iframe: false, dodgeT: 0, dodgeDir: V3(), dodgeStart: -9, catchT: -9, finisherTarget: null, lockTarget: null,
    promoCd: { L: 0, H: 0 }, holdCd: 0, holdT: 0, control: false, speedMul: 1, lowHp: false, heartT: 0, grabbed: null, mash: 0,
    stepT: 0, lastHitT: -9, carry: false,
  };
  buildAxeProjectile();
  return PLAYER;
}

// ---------- the thrown Cold Call ----------
function buildAxeProjectile() {
  const m = buildColdCall(); m.visible = false; R.scene.add(m);
  PLAYER.axe = { mesh: m, pos: V3(), vel: V3(), t: 0, dist: 0, stuck: null, stuckLocal: V3(), stuckEnemy: null, spin: 0, from: V3(), ctrl: V3(), hitSet: new Set(), bounces: 0, conference: false };
}
function setWeapon(w) {
  const a = ACTORS.luka; PLAYER.weapon = w;
  a.props.axe.visible = w === 'axe' && PLAYER.axeState === 'hand';
  a.props.woodAxe.visible = w === 'wood';
}

// ---------- hit-stop, trauma, slow-mo ----------
function hitstop(ms) { G.hitstop = Math.max(G.hitstop, ms / 1000); }
function slowmo(k, secs) { G.slowK = k; G.slowT = secs; }

// ---------- per-frame ----------
const _pv = { f: V3(), r: V3(), d: V3(), t: V3() };
function camBasis() {
  if (PLAYER && PLAYER.carry && G.carryDir && CAM.gameW < 0.5) { _pv.f.copy(G.carryDir); _pv.r.set(-G.carryDir.z, 0, G.carryDir.x).multiplyScalar(-1); _pv.r.set(-Math.cos(Math.atan2(G.carryDir.x, G.carryDir.z)), 0, Math.sin(Math.atan2(G.carryDir.x, G.carryDir.z))); return Math.atan2(G.carryDir.x, G.carryDir.z); }
  const yaw = CAM.gameW > 0.5 ? CAM.yaw : Math.atan2(CAM.final.aim.x - CAM.final.pos.x, CAM.final.aim.z - CAM.final.pos.z);
  _pv.f.set(Math.sin(yaw), 0, Math.cos(yaw)); _pv.r.set(-Math.cos(yaw), 0, Math.sin(yaw));
  return yaw;
}
function updatePlayer(dt) {
  const P = PLAYER; if (!P) return;
  const a = P.actor, I = INPUT;
  P.stateT += dt; P.comboT += dt;
  P.promoCd.L = Math.max(0, P.promoCd.L - dt); P.promoCd.H = Math.max(0, P.promoCd.H - dt); P.holdCd = Math.max(0, P.holdCd - dt);
  P.hpLag = P.hpLag > P.hp ? Math.max(P.hp, P.hpLag - dt * 22) : P.hp;
  // low health: one flickering bar, heartbeat, muffled audio
  const low = P.hp / P.maxHp <= 0.25 && P.hp > 0 && G.combat;
  if (low) { P.heartT -= dt; if (P.heartT <= 0) { P.heartT = 0.9; sfx('heart', null, 0.7); } }
  R.post.lowHealth = damp(R.post.lowHealth, low ? 1 : 0, 3, dt);
  AUDIO.lowTarget = G.mode === 'dead' ? 500 : low ? 4000 : P.holdT > 0 ? 1200 : 22000;
  if (P.holdT > 0) { P.holdT -= dt / Math.max(G.enemyScale, 0.01) * G.enemyScale; P.holdT -= dt * 0; if (P.holdT <= 0) { G.enemyScale = 1; } }
  R.post.hold = damp(R.post.hold, P.holdT > 0 ? 1 : 0, 6, dt);
  // rage
  if (P.rageActive) { P.rageT -= dt; P.rage = Math.max(0, (P.rageT / 12) * 100); ENV.rageMix = damp(ENV.rageMix, 1, 4, dt); if (P.rageT <= 0 && P.state === 'free') monthClose(); }
  else ENV.rageMix = damp(ENV.rageMix, 0, 3, dt);
  R.post.rage = ENV.rageMix;
  updateAxe(dt);
  if (P.state === 'cine' || P.state === 'dead') { syncPlayerAnim(dt); return; }
  if (!P.control) { syncPlayerAnim(dt); return; }
  camBasis();
  const mv = _pv.d.set(0, 0, 0).addScaledVector(_pv.f, I.move.y).addScaledVector(_pv.r, I.move.x);
  const mlen = Math.min(1, mv.length());
  // ---- aiming (hold) ----
  const canAim = P.weapon === 'axe' && P.axeState === 'hand' && (P.state === 'free') && !P.rageActive && !P.carry;
  const aimHeld = SETTINGS.aimHold ? I.held.aim : (wasPressed('aim') ? (P.aimToggle = !P.aimToggle) : P.aimToggle);
  P.aiming = !!(aimHeld && (canAim || (P.state === 'throw')) && G.allowAim !== false);
  CAM.aiming = P.aiming;
  // ---- shield ----
  const shieldHeld = (SETTINGS.shieldHold ? I.held.shield : (wasPressed('shield') ? (P.shieldToggle = !P.shieldToggle) : P.shieldToggle)) && G.allowShield !== false && !P.carry;
  if (wasPressed('shield') && G.allowShield !== false) P.shieldPress = G.realTime;
  const canShield = (P.state === 'free' || (P.state === 'attack' && P.stateT > (P.move.s + P.move.a + 4) * F)) && !P.rageActive;
  if (shieldHeld && canShield && P.state === 'attack') toState('free');
  P.shieldUp = !!(shieldHeld && canShield && P.state === 'free');
  P.shieldScale = damp(P.shieldScale, P.shieldUp ? 1 : 0, 18, dt);
  const sh = a.props.shield; sh.visible = P.shieldScale > 0.03; sh.scale.setScalar(Math.max(0.01, P.shieldScale));
  if (sh.userData.glass) sh.userData.glass.material.opacity = 0.5 + Math.max(0, (P.shieldCraze || 0)) * 0.4; P.shieldCraze = Math.max(0, (P.shieldCraze || 0) - dt / 2);

  switch (P.state) {
    case 'free': {
      let speed = P.carry ? 1.4 : G.combat ? (I.sprinting ? 5.6 : 3.5) : (I.sprinting ? 6.4 : 4.0);
      if (P.aiming) speed = 1.9; if (P.shieldUp) speed = 1.7;
      speed *= P.speedMul;
      const tv = _pv.t.copy(mv).multiplyScalar(speed);
      P.vel.x = damp(P.vel.x, tv.x, mlen > 0.05 ? 12 : 16, dt); P.vel.z = damp(P.vel.z, tv.z, mlen > 0.05 ? 12 : 16, dt);
      // facing
      if (P.aiming || P.shieldUp) { a.yaw = dampAngle(a.yaw, CAM.yaw, 14, dt); }
      else if (mlen > 0.08) { const ty = Math.atan2(mv.x, mv.z); a.anim.turn = damp(a.anim.turn, clamp(angleTo(a.yaw, ty), -1, 1), 6, dt); a.yaw = dampAngle(a.yaw, ty, P.carry ? 3 : 11, dt); }
      // actions
      if (!P.carry && !G.inputLock) handleActions(mlen, mv);
      break;
    }
    case 'attack': updateAttack(dt); break;
    case 'charge': {
      P.charge += dt;
      a.yaw = dampAngle(a.yaw, P.chargeYaw, 8, dt);
      P.vel.multiplyScalar(Math.exp(-10 * dt));
      if (!I.held.heavy || P.charge >= 36 * F) startAttack(P.charge < 8 * F ? 'H1' : 'H2', { charge: clamp01((P.charge - 8 * F) / (28 * F)) });
      break;
    }
    case 'dodge': case 'roll': {
      const D = P.state === 'roll' ? { dur: 26 * F, dist: 4.4, i0: 3 * F, i1: 16 * F } : { dur: 20 * F, dist: 2.4, i0: 4 * F, i1: 14 * F };
      const k = EASE.outQuad(clamp01(P.stateT / (D.dur * 0.75))) - EASE.outQuad(clamp01((P.stateT - dt) / (D.dur * 0.75)));
      P.pos.addScaledVector(P.dodgeDir, D.dist * k);
      P.vel.set(0, 0, 0);
      P.iframe = P.stateT >= D.i0 && P.stateT <= D.i1;
      if (P.state === 'dodge' && wasPressed('dodge') && P.stateT < 0.25) { toState('roll'); a.anim.play('roll', { fade: 0.05 }); sfx('whoosh', P.pos, 0.6); }
      if (P.stateT >= D.dur) { P.iframe = false; toState('free'); }
      break;
    }
    case 'throw': {
      a.yaw = dampAngle(a.yaw, CAM.yaw, 16, dt); P.vel.multiplyScalar(Math.exp(-12 * dt));
      if (!P.thrown && P.stateT >= AXE.windup) { P.thrown = true; releaseAxe(); }
      if (P.stateT >= 0.42) toState('free');
      break;
    }
    case 'catch': P.vel.multiplyScalar(Math.exp(-10 * dt)); if (P.stateT > 0.25) toState('free'); handleActions(mlen, mv, true); break;
    case 'hit': P.vel.multiplyScalar(Math.exp(-8 * dt)); if (P.stateT > 0.38) toState('free'); break;
    case 'knockdown': P.vel.multiplyScalar(Math.exp(-6 * dt)); if (P.stateT > 1.5) toState('free'); break;
    case 'grabbed': updateGrabbed(dt); break;
    case 'rageStart': P.vel.set(0, 0, 0); if (P.stateT > 1.15) toState('free'); break;
    case 'promo': P.vel.multiplyScalar(Math.exp(-12 * dt)); if (P.stateT > (P.promoDur || 0.9)) toState('free'); break;
    case 'finisher': P.vel.set(0, 0, 0); break;
  }
  // integrate
  if (!isFinite(P.vel.x + P.vel.z)) P.vel.set(0, 0, 0);
  P.pos.x += P.vel.x * dt; P.pos.z += P.vel.z * dt;
  separateFromEnemies(P.pos, 0.42);
  WORLD.resolve(P.pos, 0.38);
  if (!isFinite(P.pos.x + P.pos.y + P.pos.z)) P.pos.copy(P.lastGood || V3(0, 14, -80)); else (P.lastGood || (P.lastGood = V3())).copy(P.pos);
  P.pos.y = damp(P.pos.y, groundHeight(P.pos.x, P.pos.z), 18, dt);
  syncPlayerAnim(dt);
  // footsteps + persistent footprints
  const sp = Math.hypot(P.vel.x, P.vel.z);
  if (sp > 0.6) { P.stepT -= dt * sp; if (P.stepT <= 0) { P.stepT = 1.25; sfx('step', P.pos, 0.6); const side = (P.stepSide = !P.stepSide) ? 1 : -1, r = _v[23].set(-Math.cos(a.yaw), 0, Math.sin(a.yaw)); fxFootprint(P.pos.x + r.x * 0.13 * side, P.pos.z + r.z * 0.13 * side, a.yaw); } }
  // contextual finisher target
  P.finisherTarget = findFinisherTarget();
}
function syncPlayerAnim(dt) {
  const P = PLAYER, a = P.actor;
  if (P.control || P.state !== 'cine') a.speed = Math.hypot(P.vel.x, P.vel.z) * (P.state === 'free' ? 1 : 0);
  // overlay by state
  let ov = null;
  if (P.state === 'cine') return;
  if (P.carry) ov = 'carryLog';
  else if (P.aiming) ov = 'aim';
  else if (P.shieldUp) ov = 'shield';
  else if (G.combat) ov = P.weapon === 'axe' && P.axeState === 'hand' && !P.rageActive ? 'combatIdle' : 'fistsIdle';
  a.anim.setOverlay(ov, 10);
  a.fatigue = G.combat;
}
function toState(s) { const P = PLAYER; P.state = s; P.stateT = 0; if (s !== 'attack') P.move = null; }

function handleActions(mlen, mv, cancelOnly = false) {
  const P = PLAYER, I = INPUT;
  // dodge (double tap to roll)
  if ((wasPressed('dodge') || consumeBuffered('dodge', 6 * F)) && G.allowDodge !== false) {
    const d = mlen > 0.1 ? _pv.d.copy(mv).normalize() : fwdFromYaw(P.actor.yaw + PI, _pv.d);
    P.dodgeDir.copy(d); P.dodgeStart = G.time;
    toState('dodge'); P.actor.anim.play('dodge', { fade: 0.04 }); sfx('whoosh', P.pos, 0.4);
    return;
  }
  if (cancelOnly) return;
  // quick turn
  if (wasPressed('quickturn')) CAM.quickTurn = PI;
  if (wasPressed('lockon') && SETTINGS.lockOn) { P.lockTarget = P.lockTarget ? null : nearestEnemy(P.pos, 15); }
  // Rage
  if (wasPressed('rage') && P.rage >= 100 && !P.rageActive && G.allowRage !== false) { startRage(); return; }
  // Runic promos
  if ((wasPressed('promoL') || (I.held.shield && wasPressed('light') && G.promos.rebate)) && G.promos.rebate && P.promoCd.L <= 0 && P.weapon === 'axe' && P.axeState === 'hand' && !P.rageActive) { glacialRebate(); return; }
  if ((wasPressed('promoH') || (I.held.shield && wasPressed('heavy') && G.promos.conference)) && G.promos.conference && P.promoCd.H <= 0 && P.weapon === 'axe' && P.axeState === 'hand' && !P.rageActive) { conferenceCall(); return; }
  // Close the Deal
  if (wasPressed('finisher') && P.finisherTarget) { startFinisher(P.finisherTarget); return; }
  // Callback
  if (wasPressed('callback') && P.axeState !== 'hand' && P.axeState !== 'returning' && P.weapon === 'axe') { callbackAxe(); }
  // throw while aiming
  if (P.aiming && (wasPressed('light') || consumeBuffered('light'))) { P.thrown = false; toState('throw'); P.actor.anim.play('throw', { fade: 0.04 }); sfx('swing', P.pos, 0.5, 1.2); return; }
  if (P.aiming) return;
  const fists = P.weapon !== 'axe' || P.axeState !== 'hand' || P.rageActive;
  // shield bash
  if (P.shieldUp && (wasPressed('light') || consumeBuffered('light'))) { startAttack('BASH'); return; }
  if (P.shieldUp) return;
  if (G.allowAttack === false) return;
  // light chain
  if (wasPressed('light') || consumeBuffered('light')) {
    if (P.weapon === 'wood') { startAttack('L1'); return; }
    if (INPUT.sprinting && mlen > 0.5 && !fists) { startAttack('BARGE'); return; }
    if (fists) { const k = P.combo % 3; startAttack(k === 2 ? 'FH' : k === 1 ? 'FL2' : 'FL'); return; }
    const k = P.comboT < 0.45 ? P.combo % 4 : 0;
    startAttack(['L1', 'L2', 'L3', 'L4'][k]); return;
  }
  // E is both heavy attack and interact: next to something usable (and out of combat) it means interact
  const using = currentInteract && wasPressed('interact') && !G.combat;
  if (using) consumeBuffered('heavy');
  if (!using && (wasPressed('heavy') || consumeBuffered('heavy'))) {
    if (P.weapon === 'wood') { startAttack('L1'); return; }
    if (P.rageActive) { startAttack('QUOTA'); return; }
    if (fists) { startAttack('FH'); return; }
    if (G.kpi.upsell && P.combo === 2 && P.comboT < 0.45) { startAttack('UPSELL'); return; }
    P.charge = 0; P.chargeYaw = P.actor.yaw; const t = autoTarget(3.5, 70); if (t) P.chargeYaw = yawTo(P.pos, t.pos);
    toState('charge'); P.actor.anim.play(CLIPS.heavyOver, { speed: 0.001, fade: 0.12 }); P.actor.anim.clipT = 18 * F * 0.8;
  }
}
function autoTarget(range, arcDeg) {
  const P = PLAYER; let best = null, bs = 1e9;
  const f = fwdFromYaw(P.actor.yaw, _v[1]);
  const mvl = Math.hypot(INPUT.move.x, INPUT.move.y);
  if (mvl > 0.2) { camBasis(); f.set(0, 0, 0).addScaledVector(_pv.f, INPUT.move.y).addScaledVector(_pv.r, INPUT.move.x).normalize(); }
  for (const e of ENEMIES) {
    if (!e.alive || e.state === 'rise' || e.state === 'queue') continue;
    const d = dist2D(P.pos, e.pos) - e.radius; if (d > range) continue;
    const ang = Math.abs(angleTo(Math.atan2(f.x, f.z), yawTo(P.pos, e.pos))) / DEG;
    if (ang > arcDeg) continue;
    const s = d + ang * 0.03; if (s < bs) { bs = s; best = e; }
  }
  if (P.lockTarget && P.lockTarget.alive) return P.lockTarget;
  return best;
}
function startAttack(key, o = {}) {
  const P = PLAYER, M = MOVES[key];
  P.move = M; P.moveKey = key; P.hitSet.clear(); P.chargeK = o.charge || 0;
  const t = autoTarget(M.range + 1.8, 75);
  if (t) { P.actor.yaw = yawTo(P.pos, t.pos); P.lungeTarget = t; } else P.lungeTarget = null;
  toState('attack'); P.move = M;
  const clip = CLIPS[M.anim];
  P.actor.anim.play(clip, { fade: key === 'H2' ? 0.02 : 0.06 });
  if (key === 'H2') P.actor.anim.clipT = Math.max(P.actor.anim.clipT, 18 * F * 0.8);
  if (key.startsWith('L') || key === 'FL' || key === 'FL2' || key === 'FH' || key === 'BASH') { P.combo = (key === 'L4' || key === 'FH') ? 0 : P.combo + 1; }
  else P.combo = 0;
  P.comboT = 0;
  sfx(M.dmg >= 25 ? 'heavySwing' : 'swing', P.pos, 0.55, M.fists ? 1.4 : 1);
}
function updateAttack(dt) {
  const P = PLAYER, M = P.move, a = P.actor, t = P.stateT;
  const s = M.s * F, ac = M.a * F, r = M.r * F;
  // lunge toward the target during startup
  if (t < s + ac) {
    const lunge = M === MOVES.BARGE ? 7 : M.dmg >= 25 ? 2.2 : 1.6;
    let sp = lunge * (1 - t / (s + ac));
    if (P.lungeTarget && dist2D(P.pos, P.lungeTarget.pos) < P.lungeTarget.radius + 1.0) sp = 0;
    const f = fwdFromYaw(a.yaw, _v[2]); P.vel.set(f.x * sp, 0, f.z * sp);
  } else P.vel.multiplyScalar(Math.exp(-14 * dt));
  // active frames
  if (t >= s && t <= s + ac + 1e-4) doMeleeHits(M);
  // chain
  const chainOK = t >= s + ac;
  if (chainOK && (consumeBuffered('light') || wasPressed('light'))) {
    if (P.moveKey !== 'L4' && P.moveKey !== 'H1' && P.moveKey !== 'H2' && P.moveKey !== 'UPSELL' && P.moveKey !== 'QUOTA') { INPUT.buffer.push({ a: 'light', t: G.realTime }); toState('free'); handleActions(0, _pv.d.set(0, 0, 0)); return; }
  }
  if (chainOK && P.combo === 2 && G.kpi.upsell && (consumeBuffered('heavy') || wasPressed('heavy')) && !P.rageActive) { startAttack('UPSELL'); return; }
  // dodge / shield cancel from 4 frames after active ends
  if (t >= s + ac + 4 * F && (wasPressed('dodge') || consumeBuffered('dodge', 6 * F))) { toState('free'); INPUT.buffer.push({ a: 'dodge', t: G.realTime }); handleActions(0, _pv.d.set(0, 0, 0), true); return; }
  if (t >= s + ac + r) toState('free');
}
function doMeleeHits(M) {
  const P = PLAYER, f = fwdFromYaw(P.actor.yaw, _v[3]);
  const fy = Math.atan2(f.x, f.z);
  for (const e of ENEMIES) {
    if (!e.alive || P.hitSet.has(e) || e.state === 'rise' || e.untargetable) continue;
    const big = e.kind === 'hamarr';
    const d = dist2D(P.pos, e.pos) - e.radius;
    const reach = M.range + (big ? 1.2 : 0);
    if (d > reach) continue;
    if (big && Math.abs(P.pos.y - e.pos.y) > 2) continue;
    const ang = Math.abs(angleTo(fy, yawTo(P.pos, e.pos))) / DEG;
    if (ang > M.arc / 2 + (d < 0.6 ? 40 : 0)) continue;
    P.hitSet.add(e);
    let dmg = M.dmg;
    if (P.moveKey === 'H2') dmg = lerp(M.dmg, M.dmgC, P.chargeK);
    if (!M.fists && P.weapon === 'axe' && G.upgrades.axe2) dmg *= 1.15;
    if (P.rageActive && (M.fists || M.anim === 'slam')) dmg *= 2.5;
    if (G.time - P.catchT < AXE.catchCombo + 0.45 && !M.fists) { dmg *= 1.5; P.catchT = -9; }
    const res = e.hurt({ dmg, stun: M.stun * (M.fists ? 1.4 : 1), frost: M.fists ? 0 : P.weapon === 'axe' ? 6 * (G.upgrades.axe2 ? 1.1 : 1) : 0, react: M.react, kb: M.kb || (M.react === 'knockback' ? 2 : M.react === 'launch' ? 1 : 0.4), dir: f, src: 'melee', bash: !!M.bash, heavy: M.dmg >= 20, guardBreak: !!M.bash && (G.kpi.hardClose || true) });
    if (res && res.blocked) { hitstop(60); CAM.shake(0.1); sfx('block', e.pos, 0.8); fxBurst('sparks', e.headPos ? e.headPos() : e.pos, { r: 2, g: 1.8, b: 1.2, n: 8 }); continue; }
    hitstop(M.stop); CAM.shake(M.trauma); rumble(M.dmg >= 25 ? 0.4 : 0.25, M.dmg >= 25 ? 0.9 : 0.3, M.dmg >= 25 ? 110 : 60);
    const hp = e.hitPoint ? e.hitPoint(_v[4]) : _v[4].copy(e.pos).add(_v[5].set(0, 1.2, 0));
    fxBurst('flash', hp, { scale: M.dmg >= 25 ? 1.4 : 1 }); fxBurst('ichor', hp, { dx: f.x, dz: f.z }); if (!M.fists) fxBurst('frost', hp, { n: 8 });
    sfx('hit', hp, 0.9, M.fists ? 1.3 : 1); if (!M.fists && P.weapon === 'axe') sfx('frost', hp, 0.35);
    if (P.rageActive && M.fists) { healPlayer(2); }
    addRage(dmg / 10);
  }
}
function separateFromEnemies(p, r) {
  for (const e of ENEMIES) { if (!e.alive || e.state === 'dead') continue; const dx = p.x - e.pos.x, dz = p.z - e.pos.z, d = Math.hypot(dx, dz), m = r + e.radius; if (d < m && d > 1e-4) { const k = (m - d) * (e.kind === 'hamarr' ? 1 : 0.6); p.x += dx / d * k; p.z += dz / d * k; } }
}

// ---------- taking hits ----------
function receiveHit(atk) {
  const P = PLAYER;
  if (P.state === 'dead' || P.state === 'cine' || P.state === 'finisher' || !P.control) return 'none';
  if (G.flags.god) return 'none';
  const src = atk.from || P.pos;
  // i-frames: dodged. A perfect dodge with the Hold Pattern slows the world (§7.9)
  if (P.iframe) {
    if (G.talisman && P.holdCd <= 0 && G.time - P.dodgeStart < 0.22) { P.holdCd = 20; P.holdT = 1.2; G.enemyScale = 0.5; sfx('dialtone', null, 0.5); toast('Hold Pattern', 'Perfect dodge'); }
    return 'dodged';
  }
  const toSrc = yawTo(P.pos, src), front = Math.abs(angleTo(P.actor.yaw, toSrc)) < 80 * DEG;
  if (P.shieldUp && front && !atk.unblockable) {
    const win = diff().parry + (G.upgrades.protector ? 2 * F : 0);
    if (G.realTime - P.shieldPress <= win || (SETTINGS.difficulty === 'story' && SETTINGS.autoParry !== false && diff().autoParry)) {
      // Price Match
      G.stats.priceMatches++; hitstop(140); CAM.shake(0.12); sfx('parry', P.pos, 1); rumble(0.6, 0.2, 80);
      const hp = _v[6].copy(P.pos).add(_v[7].set(0, 1.3, 0)).addScaledVector(fwdFromYaw(P.actor.yaw, _v[8]), 0.6);
      fxBurst('flash', hp, { scale: 1.6, r: 3, g: 2.8, b: 2 }); fxBurst('sparks', hp, { r: 3, g: 2.6, b: 1.2, n: 24 });
      UI.stamp('PRICE MATCHED', hp);
      if (atk.enemy && atk.enemy.parried) atk.enemy.parried();
      addRage(4);
      if (G.stats.priceMatches >= 10) trophy('Price Match Guaranteed');
      return 'parried';
    }
    const chip = atk.dmg * diff().dmg * 0.2 * (G.upgrades.protector ? 0.5 : 1);
    damagePlayer(chip, src, true);
    P.shieldCraze = 1; sfx('block', P.pos, 0.9); CAM.shake(0.12); hitstop(50);
    P.pos.addScaledVector(_v[9].set(Math.sin(toSrc), 0, Math.cos(toSrc)), -0.35);
    return 'blocked';
  }
  const dmg = atk.dmg * diff().dmg;
  damagePlayer(dmg, src, false);
  if (P.hp <= 0) return 'dead';
  if (P.rageActive) return 'hit';
  if (atk.knockdown) { toState('knockdown'); P.actor.anim.play('knockdown', { fade: 0.05 }); P.vel.copy(_v[9].set(-Math.sin(toSrc), 0, -Math.cos(toSrc)).multiplyScalar(4)); }
  else { toState('hit'); P.actor.anim.play('hit', { fade: 0.03 }); P.vel.copy(_v[9].set(-Math.sin(toSrc), 0, -Math.cos(toSrc)).multiplyScalar(2.2)); }
  return 'hit';
}
function damagePlayer(dmg, src, chip) {
  const P = PLAYER;
  P.hp = Math.max(0, P.hp - dmg); P.lastHitT = G.time;
  CAM.shake(chip ? 0.08 : 0.25); rumble(0.3, 0.6, 120);
  if (!chip) { sfx('hit', P.pos, 0.9, 0.8); fxBurst('snow', P.pos, { n: 12 }); }
  addRage(dmg / 5);
  if (P.hp <= 0) callDropped();
}
function healPlayer(n) { const P = PLAYER; P.hp = Math.min(P.maxHp, P.hp + n); }
function addRage(n) { const P = PLAYER; if (P.rageActive || G.allowRage === false) return; const was = P.rage; P.rage = Math.min(100, P.rage + n); if (was < 100 && P.rage >= 100) { prompt('rage', 'Rage ready', { key: 'rage', dur: 4 }); } }

// ---------- the axe in flight ----------
function aimPoint(out) {
  // ray from the camera centre; soft aim assist toward enemies near the ray
  const cam = R.camera, o = cam.position, d = _v[10].copy(CAM.final.fwd);
  let best = null, bestA = (INPUT.device === 'kbm' ? 4 : 8) * DEG * SETTINGS.aimAssist;
  for (const e of ENEMIES) { if (!e.alive || e.state === 'rise') continue; const c = e.hitPoint ? e.hitPoint(_v[11]) : _v[11].copy(e.pos).add(_v[12].set(0, 1.1, 0)); const to = _v[12].copy(c).sub(o); const dist = to.length(); if (dist > AXE.maxDist) continue; const a = to.normalize().angleTo(d); if (a < bestA) { bestA = a; best = c.clone(); } }
  for (const t of throwTargets()) { const to = _v[12].copy(t.pos).sub(o); const dist = to.length(); if (dist > AXE.maxDist) continue; const a = to.normalize().angleTo(d); if (a < bestA * 0.8) { bestA = a; best = t.pos.clone(); } }
  if (best) { out.copy(best); CAM.aimHitDist = out.distanceTo(o); return true; }
  for (let s = 1; s < AXE.maxDist; s += 0.5) { const x = o.x + d.x * s, y = o.y + d.y * s, z = o.z + d.z * s; if (y < groundHeight(x, z) || WORLD.blocksCamera(x, y, z, 0.05)) { out.set(x, y, z); CAM.aimHitDist = s; return false; } }
  out.copy(o).addScaledVector(d, AXE.maxDist); CAM.aimHitDist = AXE.maxDist; return false;
}
function releaseAxe(target = null, conference = false) {
  const P = PLAYER, A = P.axe;
  const hand = P.actor.boneWorld('handR', _v[13]);
  const tgt = target || aimPoint(_v[14]) && _v[14] || _v[14];
  A.pos.copy(hand); A.vel.copy(tgt).sub(hand).normalize().multiplyScalar(AXE.throwSpeed);
  A.t = 0; A.dist = 0; A.stuck = null; A.stuckEnemy = null; A.hitSet.clear(); A.bounces = conference ? 5 : 0; A.conference = conference;
  P.axeState = 'flying'; P.actor.props.axe.visible = false; A.mesh.visible = true;
  sfx('throw', hand, 0.8); CAM.shake(0.04);
}
function callbackAxe() {
  const P = PLAYER, A = P.axe;
  if (A.stuckEnemy && A.stuckEnemy.wallPinned) A.stuckEnemy.unpin();
  A.from.copy(A.pos); A.t = 0; A.hitSet.clear();
  const hand = P.actor.boneWorld('handR', _v[15]);
  const mid = _v[16].copy(A.pos).lerp(hand, 0.5); const side = _v[17].copy(hand).sub(A.pos).cross(UP).normalize().multiplyScalar(Math.min(4, A.pos.distanceTo(hand) * 0.25));
  A.ctrl.copy(mid).add(side).add(_v[18].set(0, 1.5, 0));
  A.returnDur = Math.max(0.25, A.pos.distanceTo(hand) / AXE.returnSpeed);
  A.stuckEnemy = null; A.stuck = null;
  P.axeState = 'returning'; sfx('callback', A.pos, 0.8); sfx('callback', P.pos, 0.4);
  P.actor.anim.play('callback', { fade: 0.08 });
}
function updateAxe(dt) {
  const P = PLAYER, A = P.axe; if (!A) return;
  const edt = dt;
  if (P.axeState === 'flying') {
    const steps = 4, h = edt / steps;
    for (let i = 0; i < steps && P.axeState === 'flying'; i++) {
      A.vel.y -= (A.dist > 18 ? 6 : 0.6) * h;
      A.pos.addScaledVector(A.vel, h); A.dist += A.vel.length() * h;
      A.spin += h * 26;
      // enemies
      for (const e of ENEMIES) {
        if (!e.alive || A.hitSet.has(e) || e.state === 'rise') continue;
        if (e.axeHit(A.pos, 0.35)) {
          A.hitSet.add(e);
          const frost = (A.conference ? 40 : AXE.throwFrost) * (G.upgrades.axe2 ? 1.1 : 1), dmg = (A.conference ? 20 : AXE.throwDmg) * (G.upgrades.axe2 ? 1.15 : 1);
          const res = e.hurt({ dmg, stun: 8, frost, react: 'flinch', kb: 0.6, dir: _v[19].copy(A.vel).normalize(), src: 'throw', legs: A.pos.y - e.pos.y < 0.9 });
          hitstop(40); CAM.shake(0.06); sfx('hit', A.pos, 0.8, 1.2); sfx('frost', A.pos, 0.6); fxBurst('frost', A.pos, { n: 14 }); fxBurst('ichor', A.pos);
          addRage(dmg / 10);
          if (A.conference && A.bounces > 1) { A.bounces--; const nxt = ENEMIES.filter(o => o.alive && !A.hitSet.has(o) && o.pos.distanceTo(e.pos) < 8 && o.state !== 'rise').sort((p, q) => p.pos.distanceTo(e.pos) - q.pos.distanceTo(e.pos))[0]; if (nxt) { A.vel.copy(nxt.hitPoint(_v[20])).sub(A.pos).normalize().multiplyScalar(AXE.throwSpeed); continue; } callbackAxe(); return; }
          if (A.conference) { callbackAxe(); return; }
          // the axe sticks in the target
          A.stuckEnemy = e; e.worldToLocal(A.pos, A.stuckLocal); P.axeState = 'stuck';
          if (G.kpi.wallMount && e.kind === 'churned' && e.nearWall && e.nearWall()) e.pin();
          break;
        }
      }
      if (P.axeState !== 'flying') break;
      // ravens, chime phones, padlocks, totem
      for (const t of throwTargets()) if (t.pos.distanceTo(A.pos) < (t.r || 0.45)) { t.hit(A.pos); if (t.stop) { P.axeState = 'stuck'; A.stuck = 'world'; } }
      // world
      const gy = groundHeight(A.pos.x, A.pos.z);
      if (A.pos.y < gy + 0.08 || WORLD.blocksCamera(A.pos.x, A.pos.y, A.pos.z, 0.05) || A.dist > AXE.maxDist + 6) {
        if (A.pos.y < gy + 0.08) A.pos.y = gy + 0.08;
        P.axeState = 'stuck'; A.stuck = 'world'; sfx('wood', A.pos, 0.6); fxBurst('snow', A.pos, { n: 10, scale: 0.4 });
      }
    }
    orientAxe(A, A.vel);
    updateTrail(A.mesh.localToWorld(_v[21].set(0, 0.55, 0.05)), A.mesh.localToWorld(_v[22].set(0, 0.66, 0.29)), true);
  } else if (P.axeState === 'stuck') {
    if (A.stuckEnemy) { if (A.stuckEnemy.alive && A.stuckEnemy.actor.root.visible) A.stuckEnemy.localToWorld(A.stuckLocal, A.pos); else { A.stuckEnemy = null; A.pos.y = groundHeight(A.pos.x, A.pos.z) + 0.1; } }
    A.mesh.position.copy(A.pos);
    updateTrail(null, null, false);
  } else if (P.axeState === 'returning') {
    const hand = P.actor.boneWorld('handR', _v[15]);
    A.t += edt / A.returnDur;
    const k = Math.min(1, A.t), u = 1 - k;
    const prev = _v[16].copy(A.pos);
    A.pos.set(u * u * A.from.x + 2 * u * k * A.ctrl.x + k * k * hand.x, u * u * A.from.y + 2 * u * k * A.ctrl.y + k * k * hand.y, u * u * A.from.z + 2 * u * k * A.ctrl.z + k * k * hand.z);
    A.spin += edt * 30;
    for (const e of ENEMIES) { if (!e.alive || A.hitSet.has(e) || e.state === 'rise') continue; if (e.axeHit(A.pos, 0.45)) { A.hitSet.add(e); const killed = e.hurt({ dmg: AXE.returnDmg, stun: G.kpi.callbackStrike ? 20 : 4, frost: 10, react: 'stagger', kb: 0.8, dir: _v[17].copy(A.pos).sub(prev).normalize(), src: 'callback' }); hitstop(40); sfx('hit', A.pos, 0.7, 1.2); fxBurst('frost', A.pos); if (killed && killed.killed) trophy('Callback'); } }
    orientAxe(A, _v[18].copy(A.pos).sub(prev));
    updateTrail(A.mesh.localToWorld(_v[21].set(0, 0.55, 0.05)), A.mesh.localToWorld(_v[22].set(0, 0.66, 0.29)), true);
    if (k >= 1) catchAxe();
  } else updateTrail(null, null, false);
  if (P.axeState !== 'hand') A.mesh.position.copy(A.pos);
}
function orientAxe(A, dir) {
  const m = A.mesh; if (dir.lengthSq() < 1e-8) return;
  m.position.copy(A.pos);
  const yaw = Math.atan2(dir.x, dir.z);
  m.rotation.set(0, 0, 0); m.rotateY(yaw); m.rotateX(A.spin); m.translateY(-0.35);
}
function catchAxe() {
  const P = PLAYER, A = P.axe;
  P.axeState = 'hand'; A.mesh.visible = false; updateTrail(null, null, false);
  if (P.weapon === 'axe' && !P.rageActive) P.actor.props.axe.visible = true;
  P.catchT = G.time; sfx('catch', P.pos, 1); CAM.shake(0.06); rumble(0.8, 0.1, 40);
  if (P.state === 'free' || P.state === 'hit') { toState('catch'); P.actor.anim.play('catch', { fade: 0.03 }); }
}
function recallAxeInstant() { const P = PLAYER; if (!P) return; P.axeState = 'hand'; P.axe.mesh.visible = false; updateTrail(null, null, false); setWeapon(P.weapon); }

// ---------- End-of-Month Rage ----------
function startRage() {
  const P = PLAYER;
  P.rageActive = true; P.rageT = 12; toState('rageStart'); P.actor.anim.play('roar', { fade: 0.05 });
  P.actor.props.axe.visible = false;
  sfx('rage', P.pos, 1); CAM.shake(0.35); hitstop(120);
  bark('luka', 'TARGET.', { force: true, dur: 1.2 });
  fxRing(P.pos, 6, 0.7, [3, 2.2, 0.4]);
}
function monthClose() {
  const P = PLAYER;
  startAttack('QUOTA'); P.rageActive = false; P.rage = 0;
  later(0.35, () => { setWeapon(P.weapon); });
}
// ---------- Runic Promos ----------
function glacialRebate() {
  const P = PLAYER; P.promoCd.L = 25; toState('promo'); P.promoDur = 0.9;
  P.actor.anim.play('rebate', { fade: 0.05, onEvent: (n) => {
    if (n !== 'impact') return;
    const c = P.pos.clone(); CAM.shake(0.35); hitstop(90); sfx('shatter', c, 1); sfx('thump', c, 0.8);
    fxRing(c, 5, 0.6, [0.5, 2.6, 3]); fxBurst('ice', c, { n: 40, scale: 0.5 }); fxBurst('frost', c.clone().add(V3(0, 0.5, 0)), { n: 40 });
    spikeRing(c, 5);
    for (const e of ENEMIES) if (e.alive && e.state !== 'rise' && dist2D(e.pos, c) < 5 + e.radius) e.hurt({ dmg: 30, stun: 10, frost: 70, react: 'launch', kb: 1, dir: _v[1].copy(e.pos).sub(c).normalize(), src: 'promo' });
  } });
}
function conferenceCall() {
  const P = PLAYER; P.promoCd.H = 40;
  const t = autoTarget(14, 60) || nearestEnemy(P.pos, 14);
  if (!t) { P.promoCd.H = 0; return; }
  P.actor.yaw = yawTo(P.pos, t.pos);
  P.thrown = true; toState('throw'); P.actor.anim.play('throw', { fade: 0.04 });
  later(AXE.windup, () => releaseAxe(t.hitPoint(V3()), true));
  sfx('rune', P.pos, 1);
}
const SPIKES = { list: [] };
function spikeRing(c, r) {
  if (!SPIKES.mesh) { SPIKES.mesh = new THREE.InstancedMesh(new THREE.ConeGeometry(0.22, 1.6, 5), new THREE.MeshStandardMaterial({ color: 0xbfe8f5, roughness: 0.1, metalness: 0.1, transparent: true, opacity: 0.9 }), 40); SPIKES.mesh.frustumCulled = false; R.scene.add(SPIKES.mesh); }
  SPIKES.list = []; for (let i = 0; i < 40; i++) { const a = i / 40 * TAU, d = r * (0.35 + (i % 4) * 0.2); SPIKES.list.push({ x: c.x + Math.cos(a) * d, z: c.z + Math.sin(a) * d, y: groundHeight(c.x + Math.cos(a) * d, c.z + Math.sin(a) * d), t: -(i % 4) * 0.04, tilt: (frand() - 0.5) * 0.5 }); }
  SPIKES.t = 0;
}
function updateSpikes(dt) {
  if (!SPIKES.mesh || !SPIKES.list.length) return;
  SPIKES.t += dt; const m = _m[0], q = _q[0];
  for (let i = 0; i < SPIKES.list.length; i++) { const s = SPIKES.list[i]; s.t += dt; const k = s.t < 0 ? 0 : s.t < 0.12 ? s.t / 0.12 : s.t < 1.4 ? 1 : Math.max(0, 1 - (s.t - 1.4) / 0.6); q.setFromEuler(_e.set(s.tilt, 0, s.tilt * 0.6)); m.compose(_v[2].set(s.x, s.y + (k - 1) * 1.6 + 0.6 * k, s.z), q, _v[3].set(1, Math.max(0.01, k), 1)); SPIKES.mesh.setMatrixAt(i, m); }
  SPIKES.mesh.instanceMatrix.needsUpdate = true;
  if (SPIKES.t > 2.2) { SPIKES.list = []; for (let i = 0; i < 40; i++) { SPIKES.mesh.setMatrixAt(i, m.makeScale(0, 0, 0)); } SPIKES.mesh.instanceMatrix.needsUpdate = true; }
}

// ---------- grabbed by Hamarr's Reply ----------
function updateGrabbed(dt) {
  const P = PLAYER;
  if (wasPressed('light')) { P.mash += 1; CAM.shake(0.05); }
  if (P.mash >= 8) { if (P.grabbed && P.grabbed.releaseGrab) P.grabbed.releaseGrab(true); trophy('Ratio’d'); }
}

// ---------- Close the Deal (§7.6) ----------
function findFinisherTarget() {
  let best = null, bd = 3.2;
  for (const e of ENEMIES) { if (!e.alive || !e.finisherReady) continue; const d = dist2D(PLAYER.pos, e.pos) - e.radius; if (d < bd) { bd = d; best = e; } }
  return best;
}
function startFinisher(e) {
  const P = PLAYER;
  if (e.kind === 'hamarr') { e.closeTheDeal(); return; }
  e.finisherReady = false; e.inFinisher = true; e.state = 'finisher';
  toState('finisher');
  const type = e.kind === 'brute' ? 'Contract Signed' : e.kind === 'holdmusic' ? 'Please Hold' : e.kind === 'reviewer' ? 'One Star' : (P.weapon === 'axe' && P.axeState === 'hand' && !P.rageActive ? (frand() < 0.5 ? 'Early Termination Fee' : 'Port Out') : 'Cooling-Off Period');
  G.stats.finishers++; G.stats.finisherTypes.add(type);
  if (G.stats.finisherTypes.size >= 6) trophy('Early Termination Fee');
  runFinisher(e, type).catch(err => { if (!err.isAbort) console.warn(err); });
}
async function runFinisher(e, type) {
  const P = PLAYER, a = P.actor, ea = e.actor;
  const yaw = yawTo(P.pos, e.pos);
  a.yaw = yaw; e.yaw = yaw + PI; ea.yaw = e.yaw;
  const near = _v[1].copy(e.pos).addScaledVector(fwdFromYaw(yaw, _v[2]), -1.25); near.y = P.pos.y;
  // a short in-take execution with its own camera move
  const skip = SETTINGS.skipFinishers;
  if (!skip) {
    CAM.toCine();
    const side = frand() < 0.5 ? 1 : -1;
    const mid = P.pos.clone().lerp(e.pos, 0.5);
    CAM.shotFn((t, p, aim) => { const ang = yaw + PI / 2 * side + t * 0.5 * side; p.set(mid.x + Math.sin(ang) * 3.0, mid.y + 1.5 - t * 0.15, mid.z + Math.cos(ang) * 3.0); aim.set(mid.x, mid.y + 1.15, mid.z); }, { omega: 7, lens: 30, fStop: 2.8, blend: 0.3, handheld: 0.6 });
    CAM.pull(() => e.headPos(_v[3]), 0.3);
  }
  const imp = (s = 0.3, st = 120) => { hitstop(st); CAM.shake(s); sfx('hit', e.headPos(_v[4]), 1, 0.9); fxBurst('flash', e.headPos(_v[4]), { scale: 1.6 }); fxBurst('ichor', e.headPos(_v[4]), { n: 22 }); rumble(0.5, 1, 160); };
  if (skip) { e.killedBy(type); }
  else if (type === 'Early Termination Fee') {
    a.anim.play('headbutt'); await wait(0.3); imp(0.3, 120); ea.anim.play('stagger');
    await wait(0.35); a.anim.play('rising'); await wait(0.18); imp(0.45, 200); sfx('frost', e.pos, 1); fxBurst('frost', e.headPos(_v[4]), { n: 30 });
    e.killedBy(type, 'launch'); await wait(0.5);
  } else if (type === 'Port Out') {
    a.anim.play('kick'); await wait(0.25); imp(0.25, 100); e.launch(7);
    await wait(0.45); a.anim.play('throw'); await wait(AXE.windup);
    const tgt = e.headPos(V3()); setWeapon('axe'); P.actor.props.axe.visible = false; const A = P.axe; A.mesh.visible = true; A.pos.copy(P.actor.boneWorld('handR', _v[5])); A.from.copy(A.pos);
    for (let i = 0; i < 8; i++) { A.pos.lerp(tgt, 0.35); orientAxe(A, _v[6].copy(tgt).sub(A.pos).add(_v[7].set(0, 0.001, 0))); await wait(1 / 60); }
    imp(0.4, 180); sfx('frost', tgt, 1); e.killedBy(type, 'launch');
    await wait(0.25); P.axeState = 'flying'; A.vel.set(0, 0, 0); callbackAxe(); await wait(A.returnDur + 0.15);
  } else if (type === 'Cooling-Off Period') {
    a.anim.play('slam'); await wait(0.3); imp(0.35, 140); e.knockFlat();
    await wait(0.25); a.anim.play('stomp'); await wait(0.4); imp(0.5, 160); fxBurst('ice', e.pos, { n: 20, scale: 0.4 }); sfx('shatter', e.pos, 1);
    e.killedBy(type); await wait(0.4);
  } else if (type === 'Contract Signed') {
    a.anim.play('pull_axe', { speed: 1.6 }); await wait(0.4); if (ea.props.spear) ea.props.spear.visible = false; sfx('wood', e.pos, 1);
    await wait(0.35); a.anim.play('overhead'); await wait(0.25); imp(0.55, 200); sfx('thump', e.pos, 1); e.killedBy(type, 'pinned'); await wait(0.6);
  } else if (type === 'Please Hold') {
    a.anim.play('lift'); await wait(0.5); e.hurl(nearestEnemy(e.pos, 14, e)); await wait(0.6);
  } else if (type === 'One Star') {
    a.anim.play('catch'); await wait(0.25); sfx('star', e.pos, 1); a.anim.play('jab'); await wait(0.15); imp(0.3, 120); fxBurst('embers', e.headPos(_v[4]), { n: 30 });
    await wait(0.25); a.anim.play('kick'); await wait(0.25); imp(0.35, 140); e.killedBy(type, 'launch'); await wait(0.4);
  }
  spawnPickup('signal', e.pos.clone().add(V3(0, 0.3, 0)));
  addRage(12);
  if (!skip) CAM.toGame(0.6, { keepYaw: true });
  if (P.state === 'finisher') toState('free');
}

// ---------- death: Call Dropped (§7.14) ----------
function callDropped() {
  const P = PLAYER; if (P.state === 'dead') return;
  toState('dead'); P.control = false; G.stats.deaths++;
  P.actor.anim.play('knockdown', { fade: 0.05, hold: true }); P.actor.anim.clipHold = true;
  slowmo(0.2, 99); sfx('busy', null, 0.9);
  G.mode = 'dead';
  later(1.6, () => UI.showDeath(), true);
}

// ---------- pickups: Signal Stones (health), Target Stones (rage) ----------
const PICKUPS = [];
function spawnPickup(kind, pos) {
  const mat = kind === 'signal' ? glow(0.3, 2.6, 1.6) : glow(3, 2.3, 0.3);
  const g = new THREE.Group();
  for (let i = 0; i < 4; i++) { const b = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.06 + i * 0.05, 0.05), mat); b.position.set(-0.09 + i * 0.06, 0.03 + i * 0.025, 0); g.add(b); }
  g.position.copy(pos); R.scene.add(g);
  PICKUPS.push({ kind, g, pos: g.position, t: 0, vy: 3 });
}
function updatePickups(dt) {
  for (let i = PICKUPS.length - 1; i >= 0; i--) {
    const p = PICKUPS[i]; p.t += dt;
    const gy = groundHeight(p.pos.x, p.pos.z) + 0.4;
    p.vy -= 9 * dt; p.pos.y = Math.max(gy, p.pos.y + p.vy * dt); if (p.pos.y <= gy) p.vy = 0;
    p.g.rotation.y += dt * 2; p.g.position.y = p.pos.y + Math.sin(p.t * 3) * 0.05;
    const d = PLAYER ? dist2D(p.pos, PLAYER.pos) : 99;
    if (d < 1.4 && p.t > 0.4) {
      if (p.kind === 'signal') { healPlayer(25); fxBurst('heal', PLAYER.pos); } else { addRage(20); fxBurst('gold', p.pos); }
      sfx('pickup', p.pos, 0.8); R.scene.remove(p.g); PICKUPS.splice(i, 1);
    } else if (p.t > 40) { R.scene.remove(p.g); PICKUPS.splice(i, 1); }
  }
}
function addSilver(n, why) { G.silver += n; G.stats.silverEarned += n; toast(`+${n} <b>SIMsilver</b>`, why); sfx('silver', null, 0.5); }
function addCommission(n) { G.commission += n; }
