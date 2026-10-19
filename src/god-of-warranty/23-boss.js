// ================= GAMEPLAY: Dodgy Hamarr, Troll of the Comment Section (§7.12) =================
function buildBossClips() {
  CLIPS.hIdle = K(2, [[0, { spine: [22, 0, 0], chest: [14, 0, 0], neck: [-20, 0, 0], head: [-10, 0, 0], armR: [-30, 0, -20], foreR: [-50, 0, 0], armL: [-10, 0, 25], foreL: [-30, 0, 0], thighL: [-14, 0, 6], shinL: [20, 0, 0], thighR: [8, 0, -6], shinR: [14, 0, 0] }], [2, { spine: [24, 0, 0], chest: [16, 0, 0], neck: [-22, 0, 0], head: [-12, 0, 0], armR: [-32, 0, -20], foreR: [-52, 0, 0], armL: [-12, 0, 25], foreL: [-32, 0, 0], thighL: [-14, 0, 6], shinL: [20, 0, 0], thighR: [8, 0, -6], shinR: [14, 0, 0] }]], { loop: true });
  POSES.hIdle = CLIPS.hIdle.keys[0][1];
  CLIPS.hSlam = K(1.6, [[0, 'hIdle'], [1.0, { spine: [-10, 0, 0], chest: [-12, 0, 0], neck: [-10, 0, 0], armR: [-200, 0, -10], foreR: [-40, 0, 0], armL: [-190, 0, 10], foreL: [-40, 0, 0] }, 'outQuad'], [1.15, { root: [-0.15, 0.1], spine: [50, 0, 0], chest: [20, 0, 0], armR: [-70, 0, -6], foreR: [-5, 0, 0], armL: [-70, 0, 6], foreL: [-5, 0, 0], thighL: [-50, 0, 0], shinL: [60, 0, 0] }, 'inCubic'], [1.6, 'hIdle']]);
  CLIPS.hSweep = K(1.3, [[0, 'hIdle'], [0.8, { spine: [10, 70, 0], chest: [6, 40, 0], armR: [-90, 70, -70], foreR: [-20, 0, 0] }, 'outQuad'], [0.98, { spine: [14, -60, 0], chest: [8, -40, 0], armR: [-90, -50, -80], foreR: [0, 0, 0] }, 'inCubic'], [1.3, 'hIdle']]);
  CLIPS.hStomp = K(1.1, [[0, 'hIdle'], [0.6, { spine: [10, 0, 0], thighL: [-80, 0, 0], shinL: [90, 0, 0], armL: [-40, 0, 40], armR: [-40, 0, -40] }, 'outQuad'], [0.72, { root: [-0.08, 0], spine: [30, 0, 0], thighL: [-30, 0, 0], shinL: [20, 0, 0] }, 'inCubic'], [1.1, 'hIdle']]);
  CLIPS.hReach = K(1.4, [[0, 'hIdle'], [0.7, { spine: [26, 20, 0], chest: [10, 10, 0], armL: [-60, 0, 50], foreL: [-60, 0, 0] }, 'outQuad'], [0.9, { spine: [40, -10, 0], chest: [10, -10, 0], armL: [-95, 0, 10], foreL: [-5, 0, 0], handL: [0, 0, 0] }, 'inCubic'], [1.4, { spine: [20, 0, 0], armL: [-80, 0, 20], foreL: [-40, 0, 0] }]], { hold: 1 });
  CLIPS.hHold = K(0.6, [[0, { spine: [10, 0, 0], armL: [-110, 0, 20], foreL: [-50, 0, 0] }], [0.6, { spine: [8, 0, 0], armL: [-112, 0, 20], foreL: [-52, 0, 0] }]], { hold: 1 });
  CLIPS.hCharge = K(1.2, [[0, 'hIdle'], [1.2, { root: [-0.1, 0], spine: [50, 0, 0], chest: [20, 0, 0], neck: [-40, 0, 0], armR: [10, 0, -20], foreR: [-40, 0, 0], armL: [10, 0, 20], foreL: [-40, 0, 0] }]], { hold: 1 });
  CLIPS.hRoar = K(1.6, [[0, 'hIdle'], [0.4, { spine: [-14, 0, 0], chest: [-16, 0, 0], neck: [-30, 0, 0], head: [-30, 0, 0], armR: [-60, 0, -70], foreR: [-60, 0, 0], armL: [-60, 0, 70], foreL: [-60, 0, 0] }, 'outQuad'], [1.2, { spine: [-14, 0, 0], chest: [-16, 0, 0], neck: [-30, 0, 0], head: [-32, 0, 0], armR: [-62, 0, -72], foreR: [-62, 0, 0], armL: [-62, 0, 72], foreL: [-62, 0, 0] }], [1.6, 'hIdle']]);
  CLIPS.hStun = K(1.0, [[0, 'hIdle'], [0.5, { root: [-0.12, 0], spine: [40, 0, 20], chest: [20, 0, 0], head: [30, 0, 30], armR: [10, 0, -10], foreR: [-20, 0, 0], armL: [20, 0, 20], foreL: [-20, 0, 0], thighL: [-30, 0, 0], shinL: [40, 0, 0] }], [1.0, { root: [-0.13, 0], spine: [42, 0, 22], chest: [20, 0, 0], head: [32, 0, 30], armR: [12, 0, -10], foreR: [-20, 0, 0], armL: [22, 0, 20], foreL: [-20, 0, 0], thighL: [-30, 0, 0], shinL: [40, 0, 0] }]], { hold: 1 });
  CLIPS.hKneel = K(1.0, [[0, 'hIdle'], [1.0, { root: [-0.32, 0], spine: [30, 0, 0], chest: [10, 0, 0], head: [20, 0, 0], thighL: [-90, 0, 0], shinL: [90, 0, 0], thighR: [20, 0, 0], shinR: [110, 0, 0], footR: [40, 0, 0], armL: [-40, 0, 10], foreL: [-30, 0, 0], armR: [10, 0, -10] }]], { hold: 1 });
  CLIPS.hBackhand = K(1.0, [[0, 'hIdle'], [0.45, { spine: [10, -60, 0], armL: [-80, -40, 60], foreL: [-60, 0, 0] }, 'outQuad'], [0.6, { spine: [10, 50, 0], armL: [-90, 60, 30], foreL: [-10, 0, 0] }, 'inCubic'], [1.0, 'hIdle']]);
  CLIPS.hPlant = K(1.4, [[0, 'hIdle'], [0.6, { armR: [-160, 0, -10], foreR: [-60, 0, 0], spine: [-6, 0, 0] }, 'outQuad'], [0.85, { root: [-0.1, 0], spine: [36, 0, 0], armR: [-80, 0, -6], foreR: [-80, 0, 0] }, 'inCubic'], [1.4, 'hIdle']]);
  POSES.hKneelPose = CLIPS.hKneel.keys[1][1];
  CLIPS.hFall = K(2.0, [[0, 'hKneelPose'], [2.0, { root: [-0.6, -0.6], spine: [-80, 0, 0], head: [-30, 0, 0], armL: [-150, 0, 60], armR: [-150, 0, -60], thighL: [-40, 0, 0], thighR: [-40, 0, 0] }]], { hold: 1 });
  POSES.hKneelPose = CLIPS.hKneel.keys[1][1];
}
const BOSS_BARKS = ['FIRST!!', 'RATIO.', 'DO YOUR JOB.', 'I WAS ON HOLD FOR THREE HOURS.', 'WHO HIRED THIS GUY.', 'ONE STAR.', 'EDIT: STILL ANGRY.', 'TOLL.'];

class Boss {
  constructor() {
    this.kind = 'hamarr'; this.actor = buildHamarr(); this.pos = this.actor.pos; this.radius = 2.0; this.alive = false; this.state = 'off'; this.cfg = ENEMY.hamarr;
    this.actor.setVisible(false); this.actor.listen = false;
    ENEMIES.push(this); this.decals = []; this.shards = [];
    for (let i = 0; i < 18; i++) {
      const d = new THREE.Mesh(new THREE.RingGeometry(0.75, 1.2, 24), new THREE.MeshBasicMaterial({ color: 0xff3020, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide })); d.rotation.x = -PI / 2; d.visible = false; d.renderOrder = 3; R.scene.add(d);
      const s = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.55, 0.12), glow(0.4, 3, 2.8)); s.visible = false; R.scene.add(s);
      this.decals.push({ m: d, s, t: 0, on: false, pos: V3() });
    }
  }
  get yaw() { return this.actor.yaw; } set yaw(v) { this.actor.yaw = v; }
  spawn(pos, yaw) {
    const d = diff();
    this.alive = true; this.maxHp = this.cfg.hp * d.hp; this.hp = this.maxHp; this.stun = 0; this.stunCap = this.cfg.stunCap; this.finisherReady = false;
    this.phase = 1; this.atk = null; this.cool = 2; this.events = { grab70: false, good35: false, plant50: false, storm: false }; this.totemPlanted = null; this.totemHits = 0; this.totemArrowHits = 0;
    this.actor.setVisible(true); this.actor.place(pos.clone(), yaw); this.actor.anim.setOverlay('hIdle', 50); this.actor.anim.overlayW = 1;
    this.state = 'intro'; this.stateT = 0; this.barkT = 6; this.scripted = false; this.grabbed = null; this.showBars = 99; this.distractT = 0; this.hitStunT = 0;
    this.actor.props.totem.visible = true; this.speedK = 1;
    return this;
  }
  headPos(out = V3()) { return this.actor.headWorld(out); }
  hitPoint(out = V3()) { return out.copy(this.pos).add(_v[23].set(0, 3.0, 0)); }
  axeHit(p, r) { const dx = p.x - this.pos.x, dz = p.z - this.pos.z, y = p.y - this.pos.y; return Math.hypot(dx, dz) < 1.7 + r && y > 0 && y < 6.2; }
  worldToLocal(p, out) { this.actor.root.updateMatrixWorld(true); return this.actor.root.worldToLocal(out.copy(p)); }
  localToWorld(l, out) { return this.actor.root.localToWorld(out.copy(l)); }
  setState(s) { this.state = s; this.stateT = 0; }
  releaseToken() { }
  addStun(n) { if (this.finisherReady || this.phase >= 3 || this.scripted) return; this.stun += n; if (this.stun >= this.stunCap) { this.stun = this.stunCap; this.finisherReady = true; this.finT = 3.5; this.setState('stunned'); this.actor.anim.play('hStun', { fade: 0.2 }); prompt('finisher', 'Close the Deal', { key: 'finisher', dur: 3 }); } }
  telegraph() { if (this.state !== 'windup' || !this.atk) return null; return this.atk.unblockable ? 'red' : 'white'; }
  parried() { if (this.atk && this.atk.name === 'sweep') { this.setState('stagger'); this.actor.anim.play('hStun', { fade: 0.1 }); this.staggerDur = 1.5; bark('hamarr', 'OK BUT—', { force: true }); } }
  hurt(h) {
    if (!this.alive || this.state === 'intro' || this.state === 'dead' || this.state === 'final' || this.scripted) return null;
    let dmg = h.dmg;
    // the planted totem soaks melee aimed at it
    this.hp = Math.max(this.phase >= 3 ? 0 : 1, this.hp - dmg); this.showBars = 99;
    this.addStun(h.stun || 0);
    this.actor.anim.kick(0.25);
    if (h.dmg >= 20 && frand() < 0.3) bark('hamarr', 'OK BUT—', { cd: 5 });
    this.checkEvents();
    return { hit: true };
  }
  checkEvents() {
    const k = this.hp / this.maxHp;
    if (k <= 0.6 && this.phase === 1) { this.phase = 2; }
    if (k <= 0.3 && this.phase === 2) { this.phase = 3; this.speedK = 1.2; }
    if (k <= 0.7 && !this.events.grab70) { this.events.grab70 = true; this.queueScript('grab70'); }
    if (k <= 0.5 && !this.events.plant50) { this.events.plant50 = true; this.queueAttack('plant'); }
    if (k <= 0.35 && !this.events.good35) { this.events.good35 = true; this.queueScript('good35'); }
    if (this.hp <= 0.5 && this.state !== 'final' && this.state !== 'down') { this.hp = 0; this.goDown(); }
  }
  queueScript(name) { this.pendingScript = name; }
  queueAttack(name) { this.pendingAttack = name; }
  closeTheDeal() {
    if (this.state === 'down') { this.setState('final'); runBossFinale(this); return; }
    if (!this.finisherReady) return;
    this.finisherReady = false; this.stun = 0; this.scripted = true;
    runBossShoulder(this).catch(e => { if (!e.isAbort) console.warn(e); });
  }
  goDown() { this.setState('down'); this.atk = null; this.actor.anim.play('hKneel', { fade: 0.3 }); this.finisherReady = true; this.finT = 999; sfx('thump', this.pos, 1); CAM.shake(0.4); prompt('finisher', 'Close the Deal', { key: 'finisher', dur: 99 }); }
  update(dt) {
    if (!this.alive) return;
    const es = G.enemyScale * this.speedK, a = this.actor, P = PLAYER;
    this.stateT += dt * es;
    const toP = yawTo(this.pos, P.pos), dP = dist2D(this.pos, P.pos);
    if (this.finisherReady && this.state === 'stunned') { this.finT -= dt; if (this.finT <= 0) { this.finisherReady = false; this.stun = 0; this.setState('idle'); a.anim.stop(0.3); } }
    this.updateDecals(dt);
    if (this.state === 'dead') return;
    this.updateTotem(dt);
    if (this.grabbed) this.updateGrab(dt);
    // barks
    this.barkT -= dt; if (this.barkT <= 0 && !DLG.line && this.state !== 'intro' && !this.scripted) { this.barkT = 9 + frand() * 8; bark('hamarr', BOSS_BARKS, { cd: 6 }); }
    switch (this.state) {
      case 'intro': case 'scripted': case 'final': case 'dead': case 'down': break;
      case 'idle': {
        if (this.pendingScript && P.control && P.state === 'free') { const s = this.pendingScript; this.pendingScript = null; this.scripted = true; (s === 'grab70' ? runGrab70(this) : runGood35(this)).catch(e => { if (!e.isAbort) console.warn(e); }); break; }
        a.yaw = dampAngle(a.yaw, toP, 1.4, dt * es);
        this.cool -= dt * es;
        if (dP > 7.5 && !this.totemPlanted) { const f = fwdFromYaw(a.yaw, _v[1]); this.pos.addScaledVector(f, 2.0 * dt * es); a.speed = 1.2; } else a.speed = 0.3;
        if (this.cool <= 0) this.chooseAttack(dP);
        break;
      }
      case 'windup': case 'active': case 'recover': this.updateAttack(dt, dP, toP); break;
      case 'stunned': break;
      case 'stagger': if (this.stateT > (this.staggerDur || 1.5)) { this.setState('idle'); this.cool = 0.8; } break;
      case 'pillarStun': if (this.stateT > 3) { this.setState('idle'); this.cool = 1; a.anim.stop(0.4); } break;
      case 'fetch': {
        const T = this.totemPlanted; if (!T) { this.setState('idle'); break; }
        const tgt = T.pos; const d = dist2D(this.pos, tgt);
        a.yaw = dampAngle(a.yaw, yawTo(this.pos, tgt), 3, dt);
        if (d > 3) { this.pos.addScaledVector(fwdFromYaw(a.yaw, _v[1]), 2.2 * dt); a.speed = 1.3; }
        else if (this.stateT > 4) { this.pickUpTotem(); }
        break;
      }
    }
    // stay on the deck
    this.pos.x = clamp(this.pos.x, DECK.x0 + 6, DECK.x1 - 3); this.pos.z = clamp(this.pos.z, DECK.z0 + 2.5, DECK.z1 - 2.5);
    if (this.state !== 'intro' && this.state !== 'final' && this.state !== 'dead') this.pos.y = DECK.y;
    // pillars push him out
    for (const pl of OBJ.pillars) { const cx = clamp(this.pos.x, pl.x0, pl.x1), cz = clamp(this.pos.z, pl.z0, pl.z1), dx = this.pos.x - cx, dz = this.pos.z - cz, d = Math.hypot(dx, dz); if (d < 1.6 && d > 1e-4) { this.pos.x = cx + dx / d * 1.6; this.pos.z = cz + dz / d * 1.6; } }
  }
  chooseAttack(dP) {
    if (this.pendingAttack === 'plant' && !this.totemPlanted) { this.pendingAttack = null; return this.startAttack(BATK.plant); }
    if (this.phase >= 3 && !this.events.storm && frand() < 0.5) { this.events.storm = true; later(18, () => { this.events.storm = false; }); return this.startAttack(BATK.storm); }
    const list = [];
    const armed = !this.totemPlanted;
    if (armed && dP < 7.5) list.push([BATK.slam, 3], [BATK.sweep, 3]);
    if (dP < 4.5) list.push([BATK.stomp, 2.5]);
    if (dP > 6) list.push([BATK.charge, 2.5]);
    if (this.phase >= 2 && dP < 7.5) list.push([BATK.reply, 2]);
    if (!list.length) list.push([BATK.charge, 1]);
    let s = frand() * list.reduce((x, l) => x + l[1], 0); for (const [atk, w] of list) { s -= w; if (s <= 0) return this.startAttack(atk); }
  }
  startAttack(atk) {
    this.atk = atk; this.setState('windup'); this.hitDone = false;
    const tell = atk.tell * (SETTINGS.slowTells ? 1.2 : 1);
    this.tellDur = tell;
    const clip = CLIPS[atk.clip]; this.actor.anim.play(atk.clip, { speed: clip.keys[1][0] / tell, fade: 0.15 });
    if (atk.name === 'slam') { this.actor.props.totemTop.material.color.setRGB(3.4, 0.5, 0.3); }
    if (atk.name === 'reply') this.actor.props.handGlow.material.opacity = 0.7;
    if (atk.name === 'charge') { this.chargeDir = fwdFromYaw(yawTo(this.pos, PLAYER.pos), V3()); }
    if (atk.name === 'storm') { bark('hamarr', 'CAPS LOCK.', { force: true }); sfx('roar', this.pos, 1); CAM.shake(0.3); }
  }
  updateAttack(dt, dP, toP) {
    const atk = this.atk, a = this.actor, P = PLAYER, es = G.enemyScale * this.speedK;
    if (!atk) { if (this.stateT > 0.9) { this.setState('idle'); this.cool = 1; } return; }
    if (this.state === 'windup') {
      if (atk.name !== 'charge') a.yaw = dampAngle(a.yaw, toP, this.stateT < this.tellDur * 0.6 ? 2.2 : 0.4, dt * es);
      else { a.yaw = dampAngle(a.yaw, toP, 2.5, dt); this.chargeDir.copy(fwdFromYaw(a.yaw, _v[2])); if (frand() < 0.3) fxBurst('snow', this.pos, { n: 4 }); }
      a.anim.clipSpeed = (CLIPS[atk.clip].keys[1][0] / this.tellDur) * es;
      if (this.stateT >= this.tellDur) { this.setState('active'); a.anim.clipSpeed = es; this.activeStart(); }
      return;
    }
    if (this.state === 'active') {
      if (atk.name === 'charge') {
        const f = this.chargeDir; this.pos.addScaledVector(f, 11 * dt * es); a.speed = 6; fxBurst('snow', this.pos, { n: 2 });
        if (!this.hitDone && dist2D(this.pos, P.pos) < 2.4) { this.hitDone = true; receiveHit({ dmg: 30, from: this.pos, knockdown: true, unblockable: true, enemy: this }); }
        // into a pillar: stunned for 3 s
        for (const pl of OBJ.pillars) { const cx = clamp(this.pos.x + f.x * 1.6, pl.x0, pl.x1), cz = clamp(this.pos.z + f.z * 1.6, pl.z0, pl.z1); if (Math.hypot(this.pos.x + f.x * 1.6 - cx, this.pos.z + f.z * 1.6 - cz) < 0.6) { this.hitPillar(pl); return; } }
        const out = this.pos.x < DECK.x0 + 6.5 || this.pos.x > DECK.x1 - 3.5 || this.pos.z < DECK.z0 + 3 || this.pos.z > DECK.z1 - 3;
        if (this.stateT > 2.0 || out) { this.setState('recover'); a.anim.stop(0.4); a.speed = 0; }
        return;
      }
      if (atk.name === 'storm') { this.stormT = (this.stormT || 0) - dt; if (this.stormT <= 0) { this.stormT = 0.28; this.dropShard(); } if (this.stateT > 8) { this.setState('recover'); a.anim.stop(0.4); } return; }
      if (!this.hitDone && this.stateT >= 0.05) { this.hitDone = true; this.impact(); }
      if (this.stateT > 0.3) this.setState('recover');
      return;
    }
    if (this.state === 'recover') {
      if (this.stateT > (atk.recover || 0.9)) { this.setState('idle'); this.cool = (this.phase >= 3 ? 0.9 : 1.6) + frand() * 0.8; this.atk = null; this.actor.props.totemTop.material.color.setRGB(0.4, 3.4, 3.2); this.actor.props.handGlow.material.opacity = 0; }
    }
  }
  activeStart() { if (this.atk.name === 'plant') this.plantTotem(); if (this.atk.name === 'reply') this.tryGrab(); }
  impact() {
    const atk = this.atk, P = PLAYER, f = fwdFromYaw(this.yaw, _v[3]);
    if (atk.name === 'slam') {
      const c = _v[4].copy(this.pos).addScaledVector(f, 4.2); c.y = DECK.y;
      CAM.shake(clamp(0.6 - dist2D(c, P.pos) * 0.03, 0.15, 0.6)); sfx('thump', c, 1.2); sfx('crack', c, 0.8); fxRing(c, 4, 0.5, [3, 1, 0.6]); fxBurst('snow', c, { n: 40, scale: 1.6 }); fxBurst('dust', c, { n: 30, scale: 2 }); rumble(1, 1, 250);
      if (dist2D(c, P.pos) < 4) receiveHit({ dmg: 35, from: c, unblockable: true, knockdown: true, enemy: this });
      if (ACTORS.chase && dist2D(c, ACTORS.chase.pos) < 4) chaseKnockdown();
    } else if (atk.name === 'sweep') {
      sfx('heavySwing', this.pos, 1, 0.6); CAM.shake(0.25);
      const ang = Math.abs(angleTo(this.yaw, yawTo(this.pos, P.pos))) / DEG;
      if (dist2D(this.pos, P.pos) < 6.8 && ang < 65) receiveHit({ dmg: 25, from: this.pos, enemy: this });
    } else if (atk.name === 'stomp') {
      const c = _v[4].copy(this.pos).addScaledVector(f, 1.6); CAM.shake(0.35); sfx('thump', c, 1); fxRing(c, 3, 0.4, [2, 2, 2]); fxBurst('snow', c, { n: 30 });
      if (dist2D(c, P.pos) < 3.2) receiveHit({ dmg: 15, from: c, knockdown: true, unblockable: true, enemy: this });
    }
  }
  hitPillar(pl) {
    this.setState('pillarStun'); this.atk = null; this.actor.anim.play('hStun', { fade: 0.1 }); this.actor.speed = 0;
    CAM.shake(0.5); sfx('thump', this.pos, 1.2); sfx('crack', this.pos, 1); fxBurst('dust', V3(pl.px, DECK.y + 2, pl.pz), { n: 50, scale: 2 }); fxBurst('chips', V3(pl.px, DECK.y + 2.5, pl.pz), { n: 30 });
    bark('hamarr', 'OK BUT—', { force: true });
    if (!G.flags.pillarTip) { G.flags.pillarTip = true; bark('chase', 'He’s stuck — hit him!', { cd: 1 }); }
  }
  // ---- the Reply grab ----
  tryGrab() {
    const P = PLAYER, hand = this.actor.props.handGlow.getWorldPosition(_v[5]);
    if (dist2D(hand, P.pos) < 2.6 && !P.iframe && P.state !== 'dead') { this.grab(P.actor, true); receiveHit({ dmg: 0.01, from: this.pos, unblockable: true }); damagePlayer(20 * diff().dmg, this.pos, false); }
  }
  grab(actor, isPlayer) {
    this.grabbed = { actor, isPlayer, t: 0 }; this.actor.anim.play('hHold', { fade: 0.2 });
    if (isPlayer) { PLAYER.grabbed = this; PLAYER.mash = 0; toState('grabbed'); prompt('light', 'Break free', { key: 'light', dur: 3 }); }
  }
  updateGrab(dt) {
    const g = this.grabbed; g.t += dt;
    const hand = this.actor.props.handGlow.getWorldPosition(_v[6]);
    g.actor.pos.set(hand.x, hand.y - 1.4, hand.z); g.actor.yaw = this.yaw + PI;
    if (g.isPlayer) { CAM.shake(0.02); if (CHASE.ai && g.t > 2.6 && !g.chaseShot) { g.chaseShot = true; chaseShootAt(hand.clone(), true); later(0.45, () => { if (this.grabbed === g) this.releaseGrab(false, true); }); } if (g.t > 4.5) { damagePlayer(15 * diff().dmg, this.pos, false); this.releaseGrab(false); } }
  }
  releaseGrab(broke, byChase) {
    const g = this.grabbed; if (!g) return;
    this.grabbed = null; this.actor.anim.stop(0.3); this.actor.props.handGlow.material.opacity = 0;
    g.actor.pos.y = DECK.y;
    if (g.isPlayer) { PLAYER.grabbed = null; toState('knockdown'); PLAYER.actor.anim.play('knockdown', { fade: 0.05 }); PLAYER.pos.addScaledVector(fwdFromYaw(this.yaw, _v[7]), 1.5); }
    if (broke || byChase) { this.setState('stagger'); this.staggerDur = 1.4; this.actor.anim.play('hStun', { fade: 0.1 }); sfx('hit', this.pos, 1, 0.6); }
    if (this.state !== 'stagger') { this.setState('recover'); }
  }
  // ---- Totem Plant (once, at 50%) ----
  plantTotem() {
    const f = fwdFromYaw(this.yaw, _v[8]), p = this.pos.clone().addScaledVector(f, 3.2); p.y = DECK.y;
    const T = this.actor.props.totem; this.actor.bones.handR.remove(T); R.scene.add(T); T.position.copy(p).add(V3(0, -0.4, 0)); T.rotation.set(0, frand() * TAU, 0);
    this.totemPlanted = { pos: p, t: 0, pulse: 0 }; this.totemHits = 0; this.totemArrowHits = 0;
    CAM.shake(0.4); sfx('thump', p, 1.2); fxRing(p, 6, 0.6, [0.4, 2.6, 2.6]);
    spawnEnemy('churned', p.clone().add(V3(-4, 0, -3)), { group: 'totem' }); spawnEnemy('churned', p.clone().add(V3(-4, 0, 3)), { group: 'totem' });
    bark('chase', 'The top! The glowing bit — I can hit that!', { force: true });
    totemTarget(this);
  }
  updateTotem(dt) {
    const T = this.totemPlanted; if (!T) return;
    T.t += dt; T.pulse += dt;
    const top = this.actor.props.totemTop; top.material.color.setRGB(0.4, 3.4 + Math.sin(T.t * 6) * 0.8, 3.2);
    if (T.pulse >= 4) { T.pulse = 0; fxRing(T.pos, 6, 0.6, [0.4, 2.8, 2.8]); sfx('rune', T.pos, 1); if (dist2D(T.pos, PLAYER.pos) < 6) receiveHit({ dmg: 12, from: T.pos, unblockable: true }); }
    // Luka can hit it six times
    if (PLAYER.state === 'attack' && PLAYER.stateT >= PLAYER.move.s * F && PLAYER.stateT <= (PLAYER.move.s + PLAYER.move.a) * F && dist2D(PLAYER.pos, T.pos) < 2.8 && !PLAYER.hitSet.has(T)) { PLAYER.hitSet.add(T); this.totemHits++; hitstop(60); sfx('wood', T.pos, 1); fxBurst('chips', T.pos.clone().add(V3(0, 1.5, 0)), { n: 14 }); if (this.totemHits >= 6) this.toppleTotem(); }
  }
  totemArrow() { this.totemArrowHits++; fxBurst('sparks', this.actor.props.totemTop.getWorldPosition(V3()), { n: 30 }); sfx('glass', null, 1); if (this.totemArrowHits >= 3) this.toppleTotem(); }
  toppleTotem() {
    const T = this.totemPlanted; if (!T || T.toppled) return; T.toppled = true;
    const m = this.actor.props.totem; sfx('creak', T.pos, 1);
    let t = 0; const step = () => { t += 1 / 60; m.rotation.z = Math.min(PI / 2, t * t * 2.4); if (t < 1.1) requestAnimationFrame(step); else { sfx('thump', T.pos, 1); CAM.shake(0.3); fxBurst('snow', T.pos, { n: 40, scale: 1.5 }); } };
    step();
    // Hamarr staggers for 4 s fetching it
    this.atk = null; this.setState('fetch'); this.actor.anim.stop(0.3);
    bark('hamarr', 'WHO TOUCHED MY POST.', { force: true });
  }
  pickUpTotem() {
    const m = this.actor.props.totem; R.scene.remove(m); this.actor.bones.handR.add(m); m.position.set(0, -0.06 * 6, 0.06 * 6); m.rotation.set(PI / 2, 0, 0);
    this.totemPlanted = null; removeThrowTarget('totem'); this.setState('idle'); this.cool = 1.2;
  }
  // ---- Comment Storm ----
  dropShard() {
    const d = this.decals.find(x => !x.on); if (!d) return;
    const P = PLAYER; d.on = true; d.t = 0;
    d.pos.set(clamp(P.pos.x + (frand() - 0.5) * 9, DECK.x0 + 2, DECK.x1 - 2), DECK.y + 0.05, clamp(P.pos.z + (frand() - 0.5) * 9, DECK.z0 + 1.5, DECK.z1 - 1.5));
    d.m.position.copy(d.pos); d.m.visible = true; d.s.visible = true; d.s.position.copy(d.pos).add(V3(0, 14, 0));
  }
  updateDecals(dt) {
    for (const d of this.decals) {
      if (!d.on) continue;
      d.t += dt * G.enemyScale;
      d.m.material.opacity = 0.25 + 0.5 * Math.abs(Math.sin(d.t * 10));
      const k = clamp01(d.t / 1.2); d.s.position.y = d.pos.y + 14 * (1 - k * k); d.s.rotation.y += dt * 4;
      if (d.t >= 1.2) {
        d.on = false; d.m.visible = false; d.s.visible = false; sfx('glass', d.pos, 0.8); fxBurst('sparks', d.pos, { r: 0.4, g: 3, b: 2.8, n: 14 });
        if (dist2D(d.pos, PLAYER.pos) < 1.3) receiveHit({ dmg: 10, from: d.pos, unblockable: true });
      }
    }
  }
}
const BATK = {
  slam: { name: 'slam', clip: 'hSlam', tell: 1.0, unblockable: true, recover: 1.1 },
  sweep: { name: 'sweep', clip: 'hSweep', tell: 0.8, recover: 0.9 },
  stomp: { name: 'stomp', clip: 'hStomp', tell: 0.6, unblockable: true, recover: 0.8 },
  reply: { name: 'reply', clip: 'hReach', tell: 0.7, recover: 1.0 },
  charge: { name: 'charge', clip: 'hCharge', tell: 1.2, unblockable: true, recover: 1.0 },
  plant: { name: 'plant', clip: 'hPlant', tell: 0.85, recover: 1.2 },
  storm: { name: 'storm', clip: 'hRoar', tell: 0.6, unblockable: true, recover: 1.0 },
};
let BOSS = null;
function totemTarget(b) { addThrowTarget({ id: 'totem', get pos() { return b.actor.props.totemTop.getWorldPosition(_v[19]); }, r: 0.9, chase: true, hit: () => b.totemArrow() }); }
