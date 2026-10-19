// ================= GAMEPLAY: the Churned and friends (§7.11) =================
const ENEMIES = [];
const POOL = { churned: [], brute: [], holdmusic: [], reviewer: [] };
const ATTACKS = {
  churned: [{ name: 'swipe', clip: 'swipe', tell: 0.55, active: 0.13, dmg: 12, range: 1.9, arc: 80, w: 0.65 }, { name: 'lunge', clip: 'lunge', tell: 0.8, active: 0.2, dmg: 15, range: 3.3, arc: 50, dash: 2.6, w: 0.35 }],
  brute: [{ name: 'jab', clip: 'bjab', tell: 0.6, active: 0.12, dmg: 14, range: 2.8, arc: 50, w: 0.4 }, { name: 'sweep', clip: 'bsweep', tell: 0.9, active: 0.15, dmg: 18, range: 2.9, arc: 150, w: 0.35 }, { name: 'overhead', clip: 'boverhead', tell: 1.1, active: 0.15, dmg: 28, range: 2.7, arc: 60, unblockable: true, w: 0.25 }],
  reviewer: [{ name: 'toss', clip: 'toss', tell: 0.68, active: 0.05, dmg: 10, range: 18, ranged: true, w: 1 }],
  holdmusic: [],
};
const CHURN_MUTTERS = ['…cancel… my… contract…', '…I want to speak… to the manager…', '…I’ve been… on hold…', '…it was working… yesterday…', '…I’m not paying… for that…', '…can you just… check the system…', '…my nephew… does computers…', '…I’ll take my business… elsewhere…'];

class Enemy {
  constructor(kind) {
    this.kind = kind; this.cfg = ENEMY[kind];
    this.actor = buildChurned(kind); this.actor.setVisible(false); this.actor.listen = false;
    this.pos = this.actor.pos; this.radius = this.cfg.radius; this.alive = false; this.state = 'off';
    // ice crust shell (On Hold)
    const shell = new THREE.Mesh(new THREE.IcosahedronGeometry(1, 1), new THREE.MeshStandardMaterial({ color: 0xbfe8f5, roughness: 0.08, metalness: 0.05, transparent: true, opacity: 0.55, depthWrite: false }));
    shell.scale.set(0.55, this.actor.height * 0.55, 0.45); shell.position.y = this.actor.height * 0.5; shell.visible = false; this.actor.root.add(shell); this.shell = shell;
    ENEMIES.push(this);
  }
  get yaw() { return this.actor.yaw; } set yaw(v) { this.actor.yaw = v; }
  spawn(pos, o = {}) {
    const d = diff();
    this.alive = true; this.maxHp = this.cfg.hp * d.hp * (o.hpMul || 1); this.hp = this.maxHp; this.stun = 0; this.frost = 0; this.frozenT = 0;
    this.stunCap = this.cfg.stunCap; this.finisherReady = false; this.finT = 0; this.inFinisher = false; this.token = null; this.atk = null; this.distractT = 0; this.guard = this.kind === 'brute';
    this.vel = V3(); this.airY = 0; this.airV = 0; this.hitT = -9; this.showBars = 0; this.wallPinned = false; this.swellT = 0; this.circleDir = frand() < 0.5 ? 1 : -1; this.thinkT = frand();
    this.mutterT = 2 + frand() * 6; this.untargetable = false; this.onDeath = o.onDeath || null; this.group = o.group || null;
    this.actor.setVisible(true); this.actor.place(pos.isVector3 ? pos.clone() : V3(...pos), o.yaw != null ? o.yaw : yawTo(pos, PLAYER.pos));
    this.actor.root.scale.setScalar(1); this.actor.root.rotation.x = 0; this.actor.root.rotation.z = 0; this.shell.visible = false;
    for (const k of ['spear', 'board', 'phone']) if (this.actor.props[k]) this.actor.props[k].visible = true;
    this.actor.anim.stop(0); this.actor.anim.clip = null;
    if (o.queue) { this.state = 'queue'; this.actor.anim.setOverlay('churnIdle', 50); }
    else if (o.rise !== false) { this.state = 'rise'; this.stateT = 0; this.actor.anim.play('rise', { instant: true }); this.riseDur = 2.2; fxBurst('snow', this.pos, { n: 26, scale: 1.2 }); sfx('crack', this.pos, 0.4); }
    else { this.state = 'approach'; this.stateT = 0; }
    this.stateT = 0;
    if (this.kind === 'holdmusic') this.actor.props.rings.forEach(r => r.visible = true);
    return this;
  }
  despawn() { this.alive = false; this.state = 'off'; this.actor.setVisible(false); this.releaseToken(); }
  headPos(out = V3()) { return this.actor.headWorld(out); }
  hitPoint(out = V3()) { return out.copy(this.pos).add(_v[23].set(0, this.actor.height * 0.6 + this.airY, 0)); }
  axeHit(p, r) { const dx = p.x - this.pos.x, dz = p.z - this.pos.z; const y = p.y - this.pos.y - this.airY; return Math.hypot(dx, dz) < this.radius + r && y > -0.2 && y < this.actor.height + 0.2; }
  worldToLocal(p, out) { this.actor.root.updateMatrixWorld(true); return this.actor.root.worldToLocal(out.copy(p)); }
  localToWorld(l, out) { return this.actor.root.localToWorld(out.copy(l)); }
  setState(s) { this.state = s; this.stateT = 0; }
  releaseToken() { if (this.token === 'melee') G.tokens.usedMelee = Math.max(0, G.tokens.usedMelee - 1); if (this.token === 'ranged') G.tokens.usedRanged = Math.max(0, G.tokens.usedRanged - 1); this.token = null; }
  takeToken() {
    const T = G.tokens, ranged = this.kind === 'reviewer';
    if (ranged) { if (T.usedRanged < T.ranged) { T.usedRanged++; this.token = 'ranged'; return true; } return false; }
    if (T.usedMelee < diff().tokens) { T.usedMelee++; this.token = 'melee'; return true; } return false;
  }
  update(dt) {
    if (!this.alive) return;
    const a = this.actor, P = PLAYER;
    this.stateT += dt; this.showBars = Math.max(0, this.showBars - dt);
    const toP = yawTo(this.pos, P.pos), dP = dist2D(this.pos, P.pos);
    let moveSpeed = 0, faceYaw = null;
    // stun finisher window
    if (this.finisherReady) { this.finT -= dt; if (this.finT <= 0) { this.finisherReady = false; this.stun = 0; if (this.state === 'stunned') this.setState('approach'); } }
    // frozen: On Hold
    if (this.frozenT > 0) { this.frozenT -= dt; if (this.frozenT <= 0) this.unfreeze(); }
    switch (this.state) {
      case 'queue': a.anim.speed = 0; break;
      case 'rise': if (this.stateT > this.riseDur) this.setState('approach'); break;
      case 'approach': case 'circle': {
        if (this.distractT > 0) { this.distractT -= dt; faceYaw = yawTo(this.pos, ACTORS.chase.pos); break; }
        const want = this.kind === 'reviewer' ? 13 : this.kind === 'holdmusic' ? 0 : 1.6;
        const atk = this.pickAttack(dP);
        this.thinkT -= dt;
        if (this.kind === 'holdmusic') { faceYaw = toP; moveSpeed = this.cfg.speed; if (dP < 5) { this.setState('swell'); a.anim.play('swell'); bark('chase', ['Why is that one humming — why is it HUMMING —', 'That one’s going to pop!'], { cd: 10 }); } break; }
        if (this.kind === 'reviewer') {
          faceYaw = toP;
          if (dP < 5) { moveSpeed = -this.cfg.speed * 1.3; } else if (dP > 17) moveSpeed = this.cfg.speed; else if (this.thinkT < 0 && this.takeToken()) { this.startAttack(ATTACKS.reviewer[0]); }
          if (this.thinkT < 0) this.thinkT = 1.8 + frand() * 1.4;
          break;
        }
        if (atk && this.thinkT < 0) { if (this.token || this.takeToken()) { this.startAttack(atk); break; } else this.setState('circle'); this.thinkT = 0.4 + frand() * 0.6; }
        if (this.state === 'circle' && !this.token) {
          // circle at 4–6 m, feint, reposition
          faceYaw = toP; const r = dP; const tgt = r < 3.8 ? -1 : r > 6 ? 1 : 0;
          const side = fwdFromYaw(toP + PI / 2 * this.circleDir, _v[1]), fwd = fwdFromYaw(toP, _v[2]);
          this.vel.set(side.x * 1.0 + fwd.x * tgt * 1.2, 0, side.z * 1.0 + fwd.z * tgt * 1.2);
          if (frand() < dt * 0.3) this.circleDir *= -1;
          this.pos.x += this.vel.x * dt * G.enemyScale; this.pos.z += this.vel.z * dt * G.enemyScale; a.speed = 1.1;
          if (this.stateT > 1.2 && frand() < dt * 1.5) this.setState('approach');
          break;
        }
        faceYaw = toP; moveSpeed = dP > want ? this.cfg.speed * (dP > 8 ? 1.25 : 1) : 0;
        break;
      }
      case 'windup': case 'active': case 'recover': this.updateAttack(dt, dP, toP); break;
      case 'hit': if (this.stateT > (this.hitDur || 0.35)) this.setState('approach'); break;
      case 'knock': if (this.airY <= 0 && this.stateT > 1.6) { a.anim.play('getUp', { fade: 0.1 }); this.setState('getup'); } break;
      case 'getup': if (this.stateT > 0.8) this.setState('approach'); break;
      case 'stunned': a.anim.setOverlay('stunned', 8); if (!this.finisherReady) { a.anim.setOverlay('churnIdle', 4); this.setState('approach'); } break;
      case 'guardbroken': if (this.stateT > 2.5) { this.guard = true; this.setState('approach'); } break;
      case 'frozen': break;
      case 'swell': {
        this.swellT += dt; faceYaw = toP; moveSpeed = 0.6;
        const k = clamp01(this.stateT / 2.5); a.props.rings.forEach((r, i) => { const s = 1 + ((this.stateT * 1.6 + i / 3) % 1) * (2 + k * 3); r.scale.setScalar(s); r.material.opacity = 0.6 * (1 - ((this.stateT * 1.6 + i / 3) % 1)); });
        if (this.stateT >= 2.5) this.detonate(true);
        break;
      }
      case 'dead': if (this.stateT > 3.2) { this.pos.y -= dt * 0.35; if (this.stateT > 6) this.despawn(); } break;
      case 'finisher': case 'pinned': break;
    }
    if (this.state === 'approach' && !this.token) a.anim.setOverlay('churnIdle', 4);
    if (faceYaw != null) a.yaw = dampAngle(a.yaw, faceYaw, 5, dt * G.enemyScale);
    if (moveSpeed !== 0) { const f = fwdFromYaw(a.yaw, _v[3]); this.pos.x += f.x * moveSpeed * dt * G.enemyScale; this.pos.z += f.z * moveSpeed * dt * G.enemyScale; }
    if (this.state === 'approach' || this.state === 'swell') a.speed = Math.abs(moveSpeed);
    else if (this.state !== 'circle') a.speed = damp(a.speed, 0, 8, dt);
    // knockback / launch physics
    if (this.vel && (this.state === 'hit' || this.state === 'knock' || this.state === 'finisher')) { this.pos.x += this.vel.x * dt; this.pos.z += this.vel.z * dt; this.vel.multiplyScalar(Math.exp(-5 * dt)); }
    if (this.airY > 0 || this.airV > 0) { this.airV -= 18 * dt; this.airY = Math.max(0, this.airY + this.airV * dt); if (this.airY === 0 && this.airV < 0) { this.airV = 0; fxBurst('snow', this.pos, { n: 20 }); CAM.shake(0.08); sfx('thump', this.pos, 0.4); } }
    // separation from other enemies and the world
    if (this.state !== 'dead' && this.state !== 'pinned') {
      for (const o of ENEMIES) { if (o === this || !o.alive || o.state === 'dead') continue; const dx = this.pos.x - o.pos.x, dz = this.pos.z - o.pos.z, d = Math.hypot(dx, dz), m = this.radius + o.radius; if (d < m && d > 1e-4) { const k = (m - d) * 0.5; this.pos.x += dx / d * k; this.pos.z += dz / d * k; } }
      if (this.state !== 'queue') WORLD.resolve(this.pos, this.radius * 0.8, { walk: !G.arenaFree });
      if (this.kind !== 'hamarr') { const dx = this.pos.x - P.pos.x, dz = this.pos.z - P.pos.z, d = Math.hypot(dx, dz), m = this.radius + 0.4; if (d < m && d > 1e-4 && P.state !== 'finisher') { this.pos.x += dx / d * (m - d) * 0.4; this.pos.z += dz / d * (m - d) * 0.4; } }
    }
    if (this.state !== 'dead') this.pos.y = damp(this.pos.y, groundHeight(this.pos.x, this.pos.z) + this.airY, 20, dt);
    // mutters from under the snow
    this.mutterT -= dt;
    if (this.mutterT < 0 && this.state !== 'dead' && this.kind !== 'reviewer') { this.mutterT = 6 + frand() * 10; if (!DLG.line && dP < 14 && frand() < 0.5) { const l = pick(CHURN_MUTTERS); babble('churned', l, 2.2, a); if (frand() < 0.35) showSub('churned', l), later(2.2, () => { if (!DLG.line) hideSub(); }); } }
    if (this.kind === 'reviewer' && this.mutterT < 0) { this.mutterT = 7 + frand() * 6; babble('churned', '…one… star…', 1.6, a); }
  }
  pickAttack(dP) {
    const list = ATTACKS[this.kind]; if (!list || !list.length) return null;
    const ok = list.filter(t => dP <= t.range + 0.3 && !(t.name === 'lunge' && dP < 1.8));
    if (!ok.length) return null;
    let s = frand() * ok.reduce((x, t) => x + t.w, 0); for (const t of ok) { s -= t.w; if (s <= 0) return t; } return ok[0];
  }
  startAttack(atk) {
    this.atk = atk; this.setState('windup');
    const tell = atk.tell * (SETTINGS.slowTells ? 1.2 : 1) * (diff().aggressive ? 0.92 : 1) + (onScreen(this.pos) ? 0 : 0.3);
    this.tellDur = tell;
    this.actor.anim.play(atk.clip, { speed: CLIPS[atk.clip] ? (CLIPS[atk.clip].keys[1][0] / tell) : 1, fade: 0.08 });
    this.lunged = false;
    // the first enemy telegraph in the tutorial triggers a brief slow-mo (once)
    if (G.flags.tutorialSlowmo && !G.flags.tutorialSlowmoDone && PLAYER.control) { G.flags.tutorialSlowmoDone = true; slowmo(0.5, 0.4); prompt('dodge', 'Dodge', { key: 'dodge', dur: 3 }); }
  }
  updateAttack(dt, dP, toP) {
    const atk = this.atk, a = this.actor, es = G.enemyScale;
    a.anim.clipSpeed = (this.state === 'windup' ? (CLIPS[atk.clip].keys[1][0] / this.tellDur) : 1) * es;
    if (this.state === 'windup') {
      a.yaw = dampAngle(a.yaw, toP, this.stateT < this.tellDur * 0.7 ? 6 : 1.5, dt * es);
      if (this.stateT * es >= this.tellDur || this.stateT >= this.tellDur / Math.max(es, 0.3)) { this.setState('active'); if (atk.ranged) this.throwStar(); }
    } else if (this.state === 'active') {
      if (atk.dash && !this.lunged) { const f = fwdFromYaw(a.yaw, _v[4]); this.pos.addScaledVector(f, atk.dash * Math.min(1, dt / atk.active) * es); }
      if (!this.lunged && !atk.ranged && this.stateT >= atk.active * 0.4) {
        this.lunged = true;
        const ang = Math.abs(angleTo(a.yaw, toP)) / DEG;
        if (dP <= atk.range + 0.35 && ang <= atk.arc / 2 + 10 && Math.abs(PLAYER.pos.y - this.pos.y) < 1.5) {
          const r = receiveHit({ dmg: atk.dmg, from: this.pos, unblockable: atk.unblockable, enemy: this, knockdown: atk.name === 'overhead' });
          if (r === 'hit' || r === 'dead') { fxBurst('flash', PLAYER.actor.headWorld(_v[5]), { scale: 0.8, r: 2.4, g: 1.2, b: 1.0 }); }
        }
      }
      if (this.stateT >= atk.active / Math.max(es, 0.3)) this.setState('recover');
    } else if (this.state === 'recover') {
      if (this.stateT >= 0.45 / Math.max(es, 0.3)) { this.releaseToken(); this.setState(frand() < 0.4 ? 'circle' : 'approach'); this.thinkT = 0.6 + frand() * 1.2; }
    }
  }
  throwStar() { const h = this.actor.boneWorld('handR', V3()); launchStar(h, PLAYER.pos.clone().add(V3(0, 1, 0)), this); if (this.actor.props.star) { this.actor.props.star.visible = false; later(1.2, () => { if (this.actor.props.star) this.actor.props.star.visible = true; }); } }
  telegraph() { if (this.state !== 'windup' || !this.atk) return null; return this.atk.unblockable ? 'red' : this.atk.ranged ? 'teal' : 'white'; }
  parried() { this.releaseToken(); this.interrupt('stagger', 1.2); this.addStun(30); }
  interrupt(react, dur) {
    if (this.state === 'dead' || this.state === 'frozen' || this.state === 'finisher' || this.state === 'pinned') return;
    this.releaseToken();
    const a = this.actor;
    if (react === 'stagger') { a.anim.play('stagger', { fade: 0.04 }); this.hitDur = dur || 0.7; this.setState('hit'); }
    else if (react === 'flinch') { a.anim.play('eflinch', { fade: 0.03 }); a.anim.kick(0.6); this.hitDur = dur || 0.32; this.setState('hit'); }
  }
  addStun(n) {
    if (this.finisherReady || this.kind === 'hamarr') return;
    this.stun += n;
    if (this.stun >= this.stunCap) { this.stun = this.stunCap; this.finisherReady = true; this.finT = 3; this.releaseToken(); if (this.state !== 'frozen') this.setState('stunned'); if (!G.flags.finisherTaught) { G.flags.finisherTaught = true; prompt('finisher', 'Close the Deal', { key: 'finisher', dur: 3.5 }); } }
  }
  hurt(h) {
    if (!this.alive || this.state === 'dead' || this.state === 'rise' && this.stateT < this.riseDur * 0.5 || this.inFinisher) return null;
    if (this.state === 'queue') { this.wakeQueue && this.wakeQueue(); }
    this.showBars = 6; this.hitT = G.time;
    const a = this.actor;
    // brute guard: frontal hits are blocked unless broken
    if (this.guard && this.kind === 'brute') {
      const front = Math.abs(angleTo(a.yaw, yawTo(this.pos, PLAYER.pos))) < 70 * DEG;
      const breaks = h.bash || (h.heavy && h.src === 'melee' && PLAYER.moveKey === 'H2' && PLAYER.chargeK > 0.3) || h.src === 'chase' || (h.src === 'throw' && h.legs) || this.distractT > 0;
      if (front && !breaks && h.src !== 'promo') { if (h.src === 'chase') { } this.addStun(h.stun * 0.3); return { blocked: true }; }
      if (front && breaks) { this.guard = false; this.releaseToken(); a.anim.play('stagger', { fade: 0.04 }); this.setState('guardbroken'); sfx('wood', this.pos, 1); fxBurst('chips', this.hitPoint(_v[6]), { n: 18 }); if (!G.flags.brutebreak) { G.flags.brutebreak = true; } }
    }
    let dmg = h.dmg;
    if (this.frozenT > 0) { dmg *= 1.5; this.shatter(); }
    this.hp -= dmg;
    if (h.stun) this.addStun(h.stun);
    if (h.frost && this.kind !== 'hamarr') { this.frost += h.frost; if (this.frost >= 100 && this.hp > 0) this.freeze(); }
    if (this.hp <= 0) { this.die(h); return { killed: true }; }
    if (this.state === 'frozen' || this.state === 'stunned' || this.state === 'finisher') return { hit: true };
    // reactions
    const dir = h.dir || fwdFromYaw(yawTo(PLAYER.pos, this.pos), _v[7]);
    const heavyGuy = this.kind === 'brute' && this.guard;
    if (this.kind === 'holdmusic' && this.state === 'swell') return { hit: true };
    if (h.react === 'launch' && !heavyGuy) { this.launch(5.5); }
    else if (h.react === 'knockdown' && !heavyGuy) { this.vel.copy(dir).multiplyScalar(5); a.anim.play('die', { fade: 0.05, speed: 1.4 }); this.setState('knock'); }
    else if (h.react === 'knockback' || h.kb > 1) { this.vel.copy(dir).multiplyScalar((h.kb || 2) * 2.2); this.interrupt(heavyGuy ? 'flinch' : 'stagger', 0.6); }
    else if (h.react === 'stagger') { this.vel.copy(dir).multiplyScalar(1.5); this.interrupt(heavyGuy ? 'flinch' : 'stagger'); }
    else { this.vel.copy(dir).multiplyScalar(h.kb || 0.6); if (this.kind !== 'brute' || this.state !== 'windup') this.interrupt('flinch'); }
    return { hit: true };
  }
  launch(v) { this.airV = v; this.releaseToken(); this.actor.anim.play('die', { fade: 0.05 }); this.setState('knock'); }
  knockFlat() { this.actor.anim.play('dieFwd', { fade: 0.05, speed: 2 }); }
  freeze() {
    this.frost = 0; this.frozenT = 3; this.releaseToken(); this.shell.visible = true; this.prevState = this.state;
    this.setState('frozen'); this.actor.anim.setOverlay('frozen', 30); this.actor.anim.stop(0.05); this.actor.anim.speed = 0;
    G.stats.freezes++; if (G.stats.freezes >= 25) trophy('Your Call Is Important to Us');
    sfx('frost', this.pos, 1); fxBurst('frost', this.hitPoint(_v[8]), { n: 30 });
    if (this.kind === 'holdmusic' && this.swellT > 0) trophy('Please Hold');
    if (!G.flags.frozeTaught) { G.flags.frozeTaught = true; bark('chase', 'Your call is important to us.', { cd: 2, force: true }); }
    else bark('chase', ['That one’s frozen. Do your thing.', 'Your call is important to us.'], { cd: 9 });
  }
  unfreeze() { this.frozenT = 0; this.shell.visible = false; this.actor.anim.setOverlay('churnIdle', 6); if (this.state === 'frozen') { if (this.kind === 'holdmusic' && this.swellT > 0) this.setState('swell'); else this.setState('approach'); } }
  shatter() { this.frozenT = 0; this.shell.visible = false; sfx('shatter', this.pos, 1); fxBurst('frost', this.hitPoint(_v[9]), { n: 40, scale: 1.4 }); if (this.kind === 'holdmusic') { sfx('dialtone', this.pos, 1); this.swellT = 0; } this.actor.anim.setOverlay('churnIdle', 6); if (this.state === 'frozen') this.setState('hit'); }
  pin() { this.wallPinned = true; this.setState('pinned'); this.releaseToken(); }
  unpin() { this.wallPinned = false; if (this.state === 'pinned') this.setState('approach'); }
  nearWall() { return WORLD.blocksCamera(this.pos.x + Math.sin(this.yaw + PI) * 1.4, this.pos.y + 1, this.pos.z + Math.cos(this.yaw + PI) * 1.4, 0.3); }
  detonate(full) {
    const p = this.pos.clone().add(V3(0, 1, 0)), r = full ? 3.5 : 2;
    sfx('explode', p, 1); CAM.shake(full ? 0.5 : 0.3); fxRing(this.pos, r, 0.5, [3, 2.4, 0.6]); fxBurst('sparks', p, { r: 3, g: 2.4, b: 0.6, n: 40 }); fxBurst('snow', this.pos, { n: 40, scale: 1.6 });
    if (dist2D(PLAYER.pos, this.pos) < r && full) receiveHit({ dmg: 30, from: this.pos, knockdown: true, unblockable: false, enemy: this });
    if (!full) for (const e of ENEMIES) if (e !== this && e.alive && e.state !== 'dead' && dist2D(e.pos, this.pos) < r + e.radius) e.hurt({ dmg: 30, stun: 20, react: 'knockdown', dir: _v[10].copy(e.pos).sub(this.pos).normalize(), src: 'explosion' });
    if (full) for (const e of ENEMIES) if (e !== this && e.alive && e.state !== 'dead' && dist2D(e.pos, this.pos) < r + e.radius) e.hurt({ dmg: 20, stun: 10, react: 'knockdown', dir: _v[10].copy(e.pos).sub(this.pos).normalize(), src: 'explosion' });
    if (ACTORS.chase && dist2D(ACTORS.chase.pos, this.pos) < r) chaseKnockdown();
    this.actor.props.rings.forEach(r2 => r2.visible = false);
    this.die({ src: 'explosion' }, true);
  }
  hurl(target) {
    // Please Hold: hurled into the nearest group, where it detonates
    const from = this.pos.clone(), to = target ? target.pos.clone() : from.clone().addScaledVector(fwdFromYaw(PLAYER.actor.yaw), 6);
    this.state = 'finisher'; let t = 0;
    const step = () => { t += 1 / 60 / 0.55; const k = Math.min(1, t); this.pos.lerpVectors(from, to, k); this.airY = Math.sin(k * PI) * 2.5; this.actor.root.rotation.x += 0.2; if (k < 1) requestAnimationFrame(step); else { this.actor.root.rotation.x = 0; this.airY = 0; this.detonate(false); } };
    step();
  }
  killedBy(type, how) {
    this.inFinisher = false; this.hp = 0;
    if (how === 'launch') { this.airV = 6; this.vel.copy(fwdFromYaw(PLAYER.actor.yaw, _v[11])).multiplyScalar(3); }
    this.die({ src: 'finisher', how });
  }
  die(h, silent) {
    if (this.state === 'dead') return;
    this.releaseToken(); this.finisherReady = false; this.frozenT = 0; this.shell.visible = false;
    this.setState('dead'); this.hp = 0;
    const a = this.actor; a.anim.setOverlay(null); a.anim.play(frand() < 0.5 ? 'die' : 'dieFwd', { fade: 0.06, hold: true });
    if (this.kind === 'holdmusic') a.props.rings.forEach(r => r.visible = false);
    G.stats.kills++;
    addSilver(this.cfg.silver, ''); addCommission(this.cfg.xp);
    if (!silent && frand() < 0.25) spawnPickup(frand() < 0.5 ? 'signal' : 'target', this.pos.clone().add(V3(0, 0.4, 0)));
    if (PLAYER.lockTarget === this) PLAYER.lockTarget = null;
    if (this.onDeath) this.onDeath(this);
    if (this.kind === 'churned' || this.kind === 'brute') bark('chase', ['Nice! …I mean, that was horrible. Nice.', 'Do they ever stop complaining?'], { cd: 14 });
  }
}
function getEnemy(kind) {
  let e = (POOL[kind] || []).find(x => !x.alive && x.state === 'off');
  if (!e) { e = new Enemy(kind); POOL[kind].push(e); }
  return e;
}
function spawnEnemy(kind, pos, o) { return getEnemy(kind).spawn(pos, o); }
function nearestEnemy(p, range = 99, exclude = null) { let best = null, bd = range; for (const e of ENEMIES) { if (!e.alive || e === exclude || e.state === 'dead' || e.state === 'rise') continue; const d = dist2D(p, e.pos); if (d < bd) { bd = d; best = e; } } return best; }
function aliveEnemies(group) { return ENEMIES.filter(e => e.alive && e.state !== 'dead' && (!group || e.group === group)); }
function clearEnemies() { for (const e of ENEMIES) { if (e.alive || e.state !== 'off') e.despawn(); } G.tokens.usedMelee = 0; G.tokens.usedRanged = 0; STARS.list.forEach(s => s.m.visible = false); STARS.list.length = 0; }
function onScreen(p) { const v = _v[12].copy(p).project(R.camera); return v.z < 1 && Math.abs(v.x) < 1 && Math.abs(v.y) < 1; }

// ---------- burning stars from the 1-Star Reviewers ----------
const STARS = { list: [], patches: [] };
function launchStar(from, to, owner) {
  let m = STARS.pool && STARS.pool.find(x => !x.visible);
  if (!m) { m = new THREE.Mesh(new THREE.OctahedronGeometry(0.16, 0), MATS.ember); R.scene.add(m); (STARS.pool = STARS.pool || []).push(m); }
  m.visible = true; m.position.copy(from);
  const d = to.clone().sub(from), dist = Math.hypot(d.x, d.z), tFlight = dist / 14;
  const v = V3(d.x / tFlight, (d.y + 0.5 * 9.8 * tFlight * tFlight) / tFlight, d.z / tFlight);
  STARS.list.push({ m, v, t: 0, owner });
  sfx('star', from, 0.6);
}
function updateStars(dt) {
  const es = G.enemyScale;
  for (let i = STARS.list.length - 1; i >= 0; i--) {
    const s = STARS.list[i]; s.t += dt * es;
    s.v.y -= 9.8 * dt * es; s.m.position.addScaledVector(s.v, dt * es); s.m.rotation.x += dt * 8; s.m.rotation.y += dt * 6;
    if (frand() < 0.6) fxBurst('embers', s.m.position, { n: 1, scale: 0.1 });
    const p = s.m.position, P = PLAYER;
    const hitP = dist2D(p, P.pos) < 0.7 && p.y - P.pos.y < 2 && p.y - P.pos.y > 0;
    const gy = groundHeight(p.x, p.z);
    if (hitP || p.y < gy + 0.1) {
      if (hitP) receiveHit({ dmg: 10, from: s.owner ? s.owner.pos : p, enemy: null });
      // a 2 s fire patch
      STARS.patches.push({ pos: V3(p.x, gy, p.z), t: 0 });
      s.m.visible = false; STARS.list.splice(i, 1);
    }
  }
  for (let i = STARS.patches.length - 1; i >= 0; i--) { const f = STARS.patches[i]; f.t += dt; if (frand() < 0.5) fxBurst('flame', f.pos, { scale: 0.4 }); if (dist2D(f.pos, PLAYER.pos) < 0.8 && f.t % 0.5 < dt) receiveHit({ dmg: 3, from: f.pos }); if (f.t > 2) STARS.patches.splice(i, 1); }
}

// ---------- waves ----------
async function runWaves(waves, o = {}) {
  G.combat = true; musicCue(o.music || 'combat', 1.2); CAM.setGameMode(o.camMode || 'combat');
  for (let w = 0; w < waves.length; w++) {
    const wave = waves[w];
    if (wave.before) await wave.before();
    const group = 'w' + w + '_' + (o.tag || '');
    for (const s of wave.spawn) { const e = spawnEnemy(s.kind, s.pos, { group, rise: s.rise, yaw: s.yaw, queue: s.queue }); if (s.after) s.after(e); await wait(s.delay != null ? s.delay : 0.35); }
    while (aliveEnemies(group).length > 0) { await wait(0.25); if (wave.during) wave.during(); }
    if (wave.after) await wave.after();
  }
  G.combat = false;
}
