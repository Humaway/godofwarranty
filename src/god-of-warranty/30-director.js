// ================= DIRECTOR =================
// Scenes are async functions on the game clock. One camera; cinematic and gameplay are just targets (§5.4, §5.7).
const DIR = { timers: [], skipping: false, skippable: false, holdSkip: 0, busyInteract: false, ff: 1, scene: '', done: new Set() };

function wait(s) {
  const id = RUN.id;
  return new Promise((res, rej) => { DIR.timers.push({ t: G.time + (DIR.skipping ? 0 : Math.max(0, s)), res, rej, id }); });
}
function later(s, fn, real = false) { DIR.timers.push({ t: (real ? G.realTime : G.time) + s, fn, real, id: -1 }); }
function waitUntil(cond, timeout = 1e9) {
  const id = RUN.id, t0 = G.time;
  return new Promise((res, rej) => { DIR.timers.push({ cond, res, rej, id, t0, timeout }); });
}
function updateTimers() {
  const L = DIR.timers;
  for (let i = L.length - 1; i >= 0; i--) {
    const T = L[i];
    if (T.id !== -1 && T.id !== RUN.id) { L.splice(i, 1); T.rej && T.rej(new Abort()); continue; }
    if (T.cond) { let ok = false; try { ok = T.cond(); } catch (e) { ok = false; } if (ok || G.time - T.t0 > T.timeout) { L.splice(i, 1); T.res(ok); } continue; }
    const now = T.real ? G.realTime : G.time;
    if (now >= T.t) { L.splice(i, 1); if (T.fn) { try { T.fn(); } catch (e) { console.warn(e); } } else T.res(); }
  }
}
// ---- actors ----
function markPos(m) { if (typeof m === 'string') { const k = MARKS[m]; if (!k) { console.warn('no mark', m); return { pos: V3(), yaw: 0 }; } return k; } if (m.isVector3) return { pos: m, yaw: null }; if (Array.isArray(m)) return { pos: V3(m[0], m[1] != null ? m[1] : groundHeight(m[0], m[2]), m[2]), yaw: m[3] }; return m; }
// a superseded walk resolves, so nothing awaiting it can hang
function cancelWalk(a) { const w = a.walkTo; if (w) { a.walkTo = null; if (w.done) w.done(); } }
function walk(actor, m, o = {}) {
  const a = typeof actor === 'string' ? ACTORS[actor] : actor, k = markPos(m);
  cancelWalk(a);
  const yaw = o.yaw !== undefined ? o.yaw : k.yaw;
  if (DIR.skipping || o.snap) { a.walkTo = null; a.place(k.pos.clone(), yaw != null ? yaw : a.yaw); if (o.y != null) a.pos.y = o.y; return Promise.resolve(); }
  return new Promise((res, rej) => {
    const id = RUN.id;
    const w = a.walkTo = { x: k.pos.x, z: k.pos.z, yaw, speed: o.speed || 1.3, tol: o.tol, collide: o.collide, backwards: o.backwards, noGround: o.noGround, yOff: o.yOff, done: () => { if (id !== RUN.id) rej(new Abort()); else res(); } };
    // safety: never wait forever (only for this walk — a newer walk must not be cancelled by an older timer)
    DIR.timers.push({ t: G.time + (o.timeout || 30), id, res: () => { if (a.walkTo === w) { a.place(k.pos.clone(), yaw != null ? yaw : a.yaw); a.walkTo = null; res(); } }, rej });
  });
}
function place(actor, m, yaw) { const a = typeof actor === 'string' ? ACTORS[actor] : actor, k = markPos(m); cancelWalk(a); a.speed = 0; a.place(k.pos.clone(), yaw != null ? yaw : k.yaw != null ? k.yaw : a.yaw); }
function faceTo(actor, target, rate = 4) { const a = typeof actor === 'string' ? ACTORS[actor] : actor; const t = target.isVector3 ? target : (target.pos || target); const yaw = yawTo(a.pos, t); return turnTo(a, yaw, rate); }
function turnTo(a, yaw, rate = 4) { if (DIR.skipping) { a.yaw = yaw; return Promise.resolve(); } cancelWalk(a); return new Promise(res => { const id = RUN.id; const w = a.walkTo = { x: a.pos.x, z: a.pos.z, yaw, speed: 0.001, tol: 0.4, done: res }; DIR.timers.push({ t: G.time + 3, id, res: () => { if (a.walkTo === w) { a.yaw = yaw; a.walkTo = null; } res(); }, rej: () => { } }); }); }
function act(actor, clip, o = {}) { const a = typeof actor === 'string' ? ACTORS[actor] : actor; const d = a.anim.play(clip, o); return o.wait ? wait(d) : Promise.resolve(); }
function look(actor, target, w = 1) { const a = typeof actor === 'string' ? ACTORS[actor] : actor; if (!target) { a.lookAt(null, 0); return; } const t = typeof target === 'string' ? (ACTORS[target] ? () => ACTORS[target].headWorld(_v[22]) : null) : target.isVector3 ? target : typeof target === 'function' ? target : () => target.headWorld(_v[22]); a.lookAt(t, w); }
const head = id => () => ACTORS[id].headWorld(V3());
const eyes = id => () => ACTORS[id].eyes(V3());
const bone = (id, b, off) => () => ACTORS[id].boneWorld(b, V3(), off);
const pt = (x, y, z) => () => V3(x, y, z);

// ---- control handoffs ----
function cine(o = {}) {
  G.mode = 'cine'; DIR.skippable = o.skippable !== false;
  if (PLAYER) { PLAYER.control = false; if (PLAYER.state !== 'dead') toState('cine'); PLAYER.vel.set(0, 0, 0); PLAYER.aiming = false; CAM.aiming = false; PLAYER.shieldUp = false; PLAYER.carry = o.carry || false; }
  INPUT.weightTarget = 0; UI.hud(false);
  CHASE.ai = false;
  CAM.toCine();
  promptHide('*');
  if (!o.carry) ACTORS.luka.anim.setOverlay(null);
}
async function handoff(o = {}) {
  const dur = o.dur || 1.2;
  DIR.skipping = false; DIR.skippable = false; $('skipHint').classList.remove('on');
  CAM.setGameMode(o.mode || 'explore');
  CAM.toGame(dur, { keepYaw: o.keepYaw });
  if (o.yaw != null) CAM.yaw = o.yaw;
  if (o.pitch != null) CAM.pitch = o.pitch;
  const P = PLAYER, a = P.actor;
  a.walkTo = null; P.vel.set(Math.sin(a.yaw) * a.speed, 0, Math.cos(a.yaw) * a.speed);
  toState('free'); P.control = true; G.mode = 'play'; P.carry = !!o.carry;
  INPUT.weight = 0; INPUT.weightTarget = 1; INPUT.weightRate = 1 / dur;
  CHASE.ai = o.chase !== false;
  later(0.3, () => UI.hud(o.hud !== false));
  if (o.prompt) later(dur * 0.5 + 0.6, () => prompt(o.prompt[0], o.prompt[1], { key: o.prompt[0], dur: o.prompt[2] || 6 }));
}
// a soft ending: players who are ready never wait (§5.4)
function waitOrInput(s) { return waitUntil(() => Math.hypot(INPUT.move.x, INPUT.move.y) > 0.3 || (INPUT.rawMove && INPUT.rawMove > 0.3), s); }
function near(p, r) { return () => PLAYER && dist2D(PLAYER.pos, p) < r; }

// ---- checkpoints & saves ----
function setCheckpoint(name) {
  G.checkpoint = name; G.checkpointIndex = CHECKPOINTS.indexOf(name);
  saveProgress();
}
function saveProgress() {
  Store.set('save', {
    cp: G.checkpoint, silver: G.silver, commission: G.commission, upgrades: G.upgrades, kpi: G.kpi, promos: G.promos, talisman: G.talisman,
    eggs: [...G.eggs], shoppers: [...G.shoppers], trophies: [...G.trophies], flags: { tape: G.flags.tape, chimeDone: G.flags.chimeDone, kioskDone: G.flags.kioskDone }, stats: { ...G.stats, finisherTypes: [...G.stats.finisherTypes] }, maxHp: PLAYER ? PLAYER.maxHp : 100,
  });
}
function loadProgress() {
  const s = Store.get('save', null); if (!s) return null;
  G.silver = s.silver || 0; G.commission = s.commission || 0; Object.assign(G.upgrades, s.upgrades || {}); Object.assign(G.kpi, s.kpi || {}); Object.assign(G.promos, s.promos || {}); G.talisman = !!s.talisman;
  G.eggs = new Set(s.eggs || []); G.shoppers = new Set(s.shoppers || []); G.trophies = new Set(s.trophies || []); Object.assign(G.flags, s.flags || {});
  if (s.stats) { Object.assign(G.stats, s.stats); G.stats.finisherTypes = new Set(s.stats.finisherTypes || []); }
  if (PLAYER && s.maxHp) { PLAYER.maxHp = s.maxHp; PLAYER.hp = s.maxHp; }
  return s.cp;
}
function resetProgress() {
  G.silver = 0; G.commission = 0; for (const k in G.upgrades) G.upgrades[k] = false; for (const k in G.kpi) G.kpi[k] = false; G.promos.rebate = false; G.promos.conference = false; G.talisman = false;
  G.eggs = new Set(); G.shoppers = new Set(); G.flags = {}; G.stats = { deaths: 0, priceMatches: 0, finishers: 0, silverEarned: 0, freezes: 0, kills: 0, startT: G.realTime, finisherTypes: new Set(), brothersAsked: 0 };
  if (PLAYER) { PLAYER.maxHp = 100; PLAYER.hp = 100; }
}

// ---- running the take ----
const BEATS = {};
// every beat records itself, so a take that flows straight into the next beat is never replayed
function wrapBeats() { for (const k of Object.keys(BEATS)) { const f = BEATS[k]; BEATS[k] = async (...a) => { DIR.done.add(k); DIR.scene = k; G.checkpointIndex = CHECKPOINTS.indexOf(k); return f(...a); }; } }
async function runStory(from) {
  const id = ++RUN.id;
  DIR.skipping = false;
  const order = CHECKPOINTS.slice(1);
  let i = Math.max(0, order.indexOf(from));
  DIR.done = new Set();
  try {
    setupCheckpoint(order[i]);
    for (; i < order.length; i++) {
      if (id !== RUN.id) return;
      if (DIR.done.has(order[i])) continue; // already played as part of a chained take
      await BEATS[order[i]]();
    }
  } catch (e) { if (!e.isAbort) { console.error('story', e); } }
}
// Call Back: restart at the last checkpoint. The only fade in the demo.
async function callBack() {
  UI.closeAll();
  $('fade').style.transition = 'none'; $('fade').style.opacity = 1; R.post.fade = 0;
  G.mode = 'cine'; G.timeScale = 1; G.slowT = 0; G.slowK = 1; G.enemyScale = 1; R.post.desat = 0; AUDIO.lowTarget = 22000;
  RUN.id++;
  await new Promise(r => setTimeout(r, 60));
  if (PLAYER) { PLAYER.hp = PLAYER.maxHp; PLAYER.rage = 0; PLAYER.rageActive = false; PLAYER.grabbed = null; recallAxeInstant(); toState('cine'); }
  runStory(G.checkpoint);
  setTimeout(() => { $('fade').style.transition = 'opacity 1.4s'; $('fade').style.opacity = 0; }, 350);
}

// ---- the state of the world at the start of each checkpoint ----
function worldState(o) {
  const T = OBJ.tree;
  if (o.tree === 'standing') { T.pivot.rotation.set(0, 0, 0); T.canopy.visible = true; T.root.position.copy(T.base).add(V3(0, -0.05, 0)); T.root.rotation.set(0, T.yaw, 0); T.lanyard.visible = true; T.col.off = false; LOG.carried = false; T.root.visible = true; }
  if (o.tree === 'fallen') { T.pivot.rotation.set(-PI / 2 + 0.06, 0, 0); T.canopy.visible = false; T.lanyard.visible = false; T.col.off = true; T.root.visible = true; }
  if (o.tree === 'pyre') { T.root.visible = false; T.col.off = true; LOG.onPyre.visible = true; }
  if (o.tree !== 'pyre' && LOG.onPyre) LOG.onPyre.visible = false;
  if (o.pyre) {
    const P = OBJ.pyre;
    if (o.pyre === 'built') { scorchPyre(0); FIRE.on = false; FIRE.target = 0; FIRE.level = 0; }
    if (o.pyre === 'burning') { scorchPyre(0.2); FIRE.on = true; FIRE.mode = 'pyre'; FIRE.pos.copy(LOC.pyre).setY(OBJ.pyreY + 1.0); FIRE.target = 1; FIRE.level = 1; }
    if (o.pyre === 'embers') { scorchPyre(1); FIRE.on = true; FIRE.mode = 'embers'; FIRE.pos.copy(LOC.pyre).setY(OBJ.pyreY + 0.3); FIRE.target = 0.7; FIRE.level = 0.7; }
    if (o.pyre === 'cold') { scorchPyre(1); FIRE.on = true; FIRE.mode = 'embers'; FIRE.pos.copy(LOC.pyre).setY(OBJ.pyreY + 0.3); FIRE.target = 0.25; FIRE.level = 0.25; }
  }
  if (o.body != null) { OBJ.faye.visible = o.body; if (o.body) { OBJ.faye.position.copy(OBJ.pyre.top).add(V3(0, 0.12, 0)); OBJ.faye.rotation.set(0, PI / 2, 0); } OBJ.card.visible = !!o.card; }
  if (o.ward != null) { OBJ.ward.alive = o.ward; for (const p of OBJ.wardPosts) { p.alive = o.ward; p.rune.material = o.ward ? p.mat : MATS.runeDead; } }
  if (o.axe) { const ax = OBJ.pyreAxe; if (o.axe === 'pyre') { ax.visible = true; } else ax.visible = false; }
  if (o.slate) { const s = RUE.slate; s.visible = o.slate !== 'none'; RUE.visible = s.visible; if (o.slate === 'post') { s.position.copy(MARKS.slate_post.pos); s.rotation.set(0, MARKS.slate_post.yaw + 0.3, 0); } if (o.slate === 'table') { s.position.copy(OBJ.pyre.top).add(V3(-0.45, 0.02, 0.85)); s.rotation.set(0, -PI / 2 + 0.25, 0); } if (o.rue) setRueMode(o.rue); }
  if (o.smiths) { const L = ACTORS.luke, Z = ACTORS.zane; const vis = o.smiths !== 'none'; L.setVisible(vis); Z.setVisible(vis); if (o.smiths === 'yard') { place(L, 'pyre_luke'); place(Z, 'pyre_zane'); } if (o.smiths === 'kiosk') { place(L, 'kiosk_luke'); place(Z, 'kiosk_zane'); } }
  if (o.zee) { const Z = ACTORS.zee; Z.setVisible(o.zee !== 'none'); OBJ.wombat.root.visible = o.zee !== 'none' && o.zee !== 'noWombat'; }
  if (o.jarrad != null) ACTORS.jarrad.setVisible(o.jarrad);
  if (o.beanie != null) ACTORS.chase.props.beanie.visible = o.beanie;
  if (o.weapon) { setWeapon(o.weapon); }
  if (o.door != null) { OBJ.door.rotation.y = o.door ? -1.5 : 0; OBJ.doorCol.off = !!o.door; }
  if (o.boss != null) { if (!o.boss && BOSS) { BOSS.alive = false; BOSS.state = 'off'; BOSS.actor.setVisible(false); } }
  if (o.lights) o.lights();
}
function lightsYard(night) {
  setLight(1, { pos: OBJ.lanterns[0], color: 0xffc070, intensity: night ? 7 : 3, flicker: 0.15, dist: 14 });
  setLight(2, { pos: OBJ.lanterns[2], color: 0xffc070, intensity: night ? 7 : 3, flicker: 0.15, dist: 14 });
  setLight(3, { pos: V3(OBJ.house.X1 + 1.5, OBJ.house.FY + 1.6, OBJ.house.CZ), color: 0xffa860, intensity: night ? 5 : 1.5, flicker: 0.1, dist: 10 });
  FIRE.chimney = true;
}
function lightsOff(...ids) { for (const i of ids) setLight(i, { intensity: 0 }); }
function setupCheckpoint(cp) {
  if (VEG.undo) VEG.undo(); if (PROPS.boughs) PROPS.boughs.visible = false;
  clearEnemies(); stopConvo(); hideSub(); UI.bossBar(false); UI.hud(false); promptHide('*');
  G.combat = false; G.arenaFree = false; G.allowAim = G.allowShield = G.allowDodge = G.allowAttack = G.allowRage = undefined; G.inputLock = 0;
  WORLD.walkMask = true; FIRE.candles = false; FIRE.haze = true;
  for (const a of ACTOR_LIST) { a.walkTo = null; a.anim.stop(0); a.anim.clip = null; a.lookAt(null); a.expr = a.id === 'jarrad' ? 1 : null; a.mouthOverride = null; a.exprRow = null; a.eyesClosed = false; }
  const P = PLAYER; P.carry = false; P.grabbed = null; P.rageActive = false; recallAxeInstant();
  CABLE.rise = 0; setCable(0); CABLE.active = false;
  RAVENS.forEach(r => { if (!r.shopper) { r.root.visible = false; r.state = 'off'; } });
  if (BOSS) { BOSS.alive = false; BOSS.state = 'off'; BOSS.actor.setVisible(false); BOSS.decals.forEach(d => { d.on = false; d.m.visible = false; d.s.visible = false; }); BOSS.grabbed = null; if (BOSS.totemPlanted) BOSS.pickUpTotem(); }
  FLOORS.forEach(f => f.active = true);
  ACTORS.chase.setVisible(true); ACTORS.luka.setVisible(true); ACTORS.jarrad.setVisible(false);
  chaseBowToHand(false);
  OBJ.trapLid.rotation.x = 0;
  const S = SETUPS[cp]; if (S) S();
  placeShoppersFor(cp);
}
function placeShoppersFor(cp) {
  const i = CHECKPOINTS.indexOf(cp);
  const H = OBJ.house;
  if (i >= CHECKPOINTS.indexOf('ward_falls')) { placeShopper(0, V3(H.X1 + 0.62, H.RIDGE + 0.95, H.CZ), PI / 2); }
  if (i <= CHECKPOINTS.indexOf('zee')) placeShopper(1, OBJ.kiosk.pole.clone().add(V3(0, 0.12, 0)), PI);
  if (i <= CHECKPOINTS.indexOf('path')) { placeShopper(2, OBJ.deadBirch, 1); placeShopper(3, OBJ.shrineTop.clone().add(V3(0, 0.15, 0)), 2); }
  placeShopper(4, OBJ.ticket.roof.clone().add(V3(0, 0.12, 0)), 2.5);
}
const SETUPS = {};
