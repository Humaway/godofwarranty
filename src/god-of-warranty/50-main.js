// ================= MAIN =================
const SETTINGS = { ...DEFAULT_SETTINGS, ...Store.get('settings', {}) };
if (!QUALITY[SETTINGS.quality]) SETTINGS.quality = DEFAULT_SETTINGS.quality;
if (URLQ.get('q') && QUALITY[URLQ.get('q')]) SETTINGS.quality = URLQ.get('q');
if (!CanvasRenderingContext2D.prototype.roundRect) CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h) { this.rect(x, y, w, h); };

const nextFrame = () => new Promise(r => requestAnimationFrame(() => r()));
async function bootStep(pct, fn) { $('bootBar').style.width = pct + '%'; await nextFrame(); fn(); }

let lastT = 0;
async function boot() {
  try {
    await bootStep(4, () => { initRenderer(); setDofTaps((QUALITY[SETTINGS.quality] || QUALITY.balanced).dofTaps); });
    await bootStep(10, () => { buildTextures(); buildMaterials(); buildClips(); buildBossClips(); buildEnv(); });
    await bootStep(22, () => buildTerrain());
    await bootStep(34, () => buildVegetation());
    await bootStep(44, () => { buildMarkedTree(); buildLonghouse(); buildYard(); });
    await bootStep(52, () => { buildKiosk(); buildClearing(); buildCliffPath(); buildHornibrook(); });
    await bootStep(58, () => { buildBay(); buildSnow(); buildFX(); });
    await bootStep(66, () => { buildLuka(); buildChase(); buildLuke(); buildZane(); buildZee(); buildJarrad(); buildFayeBody(); buildWombat(); buildRueFeed(); buildSlateProp(); });
    await bootStep(74, () => { makePlayer(); buildStoryProps(); buildInteractables(); setupChimePuzzle(); OBJ.shoppers = []; });
    await bootStep(82, () => {
      for (let i = 0; i < 14; i++) POOL.churned.push(new Enemy('churned'));
      for (let i = 0; i < 2; i++) { POOL.brute.push(new Enemy('brute')); POOL.holdmusic.push(new Enemy('holdmusic')); POOL.reviewer.push(new Enemy('reviewer')); }
      BOSS = new Boss();
    });
    await bootStep(88, () => { initInput(); buildHUD(); buildTitle(); applySettings(); wrapBeats(); });
    $('bootBar').style.width = '94%'; await nextFrame();
    // warm up every shader behind the title, so the take never stutters (§12.4)
    for (const e of ENEMIES) e.actor.setVisible(true);
    ACTORS.jarrad.setVisible(true); ACTORS.zee.setVisible(true); OBJ.wombat.root.visible = true;
    await warmShaders([RUE.scene]);
    for (const e of ENEMIES) e.actor.setVisible(false);
    window.__GOW_BOOTED = true;
    enterTitle();
    $('bootBar').style.width = '100%';
    $('boot').style.opacity = 0; setTimeout(() => $('boot').style.display = 'none', 900);
    if (DEBUG) { $('app').appendChild(el('div', '', '')).id = 'dbg'; }
    const cp = URLQ.get('cp');
    if (cp && CHECKPOINTS.includes(cp)) { setTimeout(() => continueGame(cp), 100); }
    if (URLQ.get('autoplay')) { G.flags.autoplay = true; G.flags.god = true; }
    if (URLQ.get('ff')) DIR.ff = +URLQ.get('ff');
    if (URLQ.get('begin')) setTimeout(() => startGame(), 100);
    lastT = performance.now();
    requestAnimationFrame(frame);
  } catch (e) {
    console.error(e);
    $('bootErr').textContent = 'The game could not start: ' + (e && e.message ? e.message : e);
  }
}

function frame(now) {
  requestAnimationFrame(frame);
  let realDt = Math.min(0.1, Math.max(0, (now - lastT) / 1000)); lastT = now;
  G.realTime += realDt;
  try { tick(realDt); } catch (e) { console.error(e); }
  window.__frames = (window.__frames || 0) + 1;
}
function tick(realDt) {
  updateInput(realDt);
  autopilot(realDt);
  // pause (tap) vs skip (hold) during cinematics
  if (wasPressed('pause')) { if (G.mode === 'cine' && DIR.skippable) INPUT.pauseDownT = G.realTime; else if (G.mode !== 'title' && !UI.menuStack.includes('settings') && !UI.menuStack.includes('kiosk')) UI.togglePause(); }
  if (INPUT.released.has('pause') && INPUT.pauseDownT && G.realTime - INPUT.pauseDownT < 0.3 && G.mode === 'cine') { UI.pause(); }
  if (INPUT.released.has('pause')) INPUT.pauseDownT = 0;
  if (G.mode === 'title' && INPUT.anyKey) { initAudio(); $('soundHint').style.display = 'none'; }
  const paused = G.mode === 'pause' || G.mode === 'menu';
  if (G.slowT > 0) { G.slowT -= realDt; G.timeScale = G.slowK; if (G.slowT <= 0) { G.timeScale = 1; G.slowK = 1; } }
  let dt = paused ? 0 : realDt * DIR.ff * G.timeScale;
  if (DIR.skipping) dt = Math.min(0.1, realDt * 3);
  G.time += dt; G.lastDt = dt;
  U.time.value += dt; R.post.time += realDt;
  INPUT.weight = INPUT.weightTarget == null ? 1 : damp(INPUT.weight, INPUT.weightTarget, (INPUT.weightRate || 2.5) * 2.5, realDt);
  if (!paused) {
    updateTimers(); updateTweens(dt);
    const hs = G.hitstop > 0; G.hitstop = Math.max(0, G.hitstop - realDt);
    const cdt = hs ? 0 : dt;
    if (G.mode === 'dead') { R.post.desat = damp(R.post.desat, 1, 2, realDt); }
    if (PLAYER && PLAYER.control && wasPressed('chase') && G.combat) chaseCommand();
    if (PLAYER && PLAYER.control && wasPressed('chase') && !G.combat && throwTargets().some(t => t.chase && dist2D(t.pos, PLAYER.pos) < 25)) { CHASE.ai = true; chaseCommand(); }
    updatePlayer(cdt);
    updateChase(cdt);
    for (const e of ENEMIES) { if (!e.alive) continue; if (G.enemyHold && e.state !== 'rise') continue; try { e.update(cdt * (e.kind === 'hamarr' ? G.enemyScale : 1)); } catch (err) { console.error(err); } }
    updateStars(cdt); updatePickups(dt); updateSpikes(dt); updateCarry(dt);
    for (const a of ACTOR_LIST) {
      if (!a.active) continue;
      const k = a.kind !== 'human' ? cdt * G.enemyScale : (a.id === 'luka' || a.id === 'chase') ? cdt : dt;
      try { a.update(k); } catch (err) { console.error(err); }
    }
    // the volleyball spins on one finger
    if (ACTORS.jarrad && ACTORS.jarrad.props.ball.userData.spin) ACTORS.jarrad.props.ball.rotation.y += dt * 14;
    if (PLAYER && PLAYER.axe && ACTORS.luka.props.axe.userData.tag) ACTORS.luka.props.axe.userData.tag.rotation.x = Math.sin(G.time * 3) * 0.25 - ACTORS.luka.speed * 0.05;
    updateWombat(dt); updateRavens(dt); updateDialogue(dt); updateInteract(); updateWorldLife(dt);
    updateFX(dt);
    if (G.title) updateTitleWorld(dt);
    if (CABLE.active || CABLE.rise > 0 || G.title) setCable(G.time);
    // combat music layers follow the fight
    if (G.combat && AUDIO.ok) { const attackers = ENEMIES.filter(e => e.alive && (e.state === 'windup' || e.state === 'active' || e.kind === 'hamarr')).length; setMusicLayers(1, clamp01(attackers / 2 + (PLAYER.hp / PLAYER.maxHp < 0.4 ? 0.5 : 0)), PLAYER.rageActive ? 1 : 0); }
    // the gameplay camera: look input, framing assist, combat/aim modes
    if (PLAYER && PLAYER.control && CAM.gameW > 0.01) {
      CAM.yaw -= INPUT.look.x; CAM.pitch += INPUT.look.y;
      if (G.combat && CAM.gMode !== 'boss') CAM.setGameMode(PLAYER.aiming ? 'aim' : PLAYER.rageActive ? 'rage' : 'combat');
      else if (!G.combat && CAM.gMode !== 'boss') CAM.setGameMode(PLAYER.aiming ? 'aim' : 'explore');
      else if (CAM.gMode === 'boss' && PLAYER.aiming) { CAM.gp.dist = damp(CAM.gp.dist, 2.2, 6, realDt); }
      CAM.assistYaw = 0;
      if (G.combat) { const atk = ENEMIES.find(e => e.alive && e.state === 'windup' && dist2D(e.pos, PLAYER.pos) < 6); if (atk) { const a = angleTo(CAM.yaw, yawTo(PLAYER.pos, atk.pos)); if (Math.abs(a) > 1.7) CAM.assistYaw = Math.sign(a) * 8 * DEG; } }
    }
  }
  updateCamera(paused ? 0 : dt, realDt);
  updateEnv(paused ? 0 : dt);
  updateAudio(realDt);
  renderFrame(dt, realDt);
  updateHUD(realDt); updatePrompts(realDt); drawOverlay(realDt); updateSkipHint(realDt);
  if (DEBUG) updateDebug(realDt);
  endInputFrame();
}

// ---------- debug build (?debug=1) ----------
let dbgT = 0, dbgFps = 60;
function updateDebug(dt) {
  dbgT += dt; dbgFps = lerp(dbgFps, 1 / Math.max(dt, 1e-3), 0.05);
  if (dbgT < 0.25) return; dbgT = 0;
  const d = $('dbg'); if (!d) return;
  const P = PLAYER;
  d.textContent = `fps ${dbgFps.toFixed(0)}  res ${R.w}x${R.h} (${(R.scale * 100) | 0}%)\ncalls ${R.stats.calls}  tris ${(R.stats.tris / 1000).toFixed(0)}k\nmode ${G.mode}  scene ${DIR.scene}  cp ${G.checkpoint}\npos ${P ? P.pos.x.toFixed(1) + ',' + P.pos.y.toFixed(1) + ',' + P.pos.z.toFixed(1) : ''}  state ${P ? P.state : ''}\nenemies ${aliveEnemies().length}  hp ${P ? P.hp.toFixed(0) : ''}  lens ${R.post.focal.toFixed(0)}mm f/${R.post.fStop.toFixed(1)} @${R.post.focusDist.toFixed(1)}m`;
}

// ---------- autopilot for automated play-throughs (?autoplay=1) ----------
const ROUTE = [[-22, -168], [-17, -142], [-9, -116], [-1, -103], [3, -85], [6, -62], [-1, -44], [-8, -32], [-8, -21], [-6, 0], [0, 12], [2, 22], [11, 30], [22, 44], [33, 62], [38, 80], [42, 98], [45, 116], [47, 136], [48, 146], [60, 146], [72, 146]];
const AUTO = { t: 0, swing: 0 };
function autopilot(dt) {
  if (!G.flags.autoplay || !PLAYER) return;
  AUTO.t += dt;
  const P = PLAYER;
  if (G.mode === 'cine' && DIR.skippable && !DIR.skipping && URLQ.get('skip')) DIR.skipping = true;
  if (!P.control) return;
  // fight: instantly finish nearby enemies; whittle the boss down so every scripted beat triggers
  if (G.combat) {
    const e = nearestEnemy(P.pos, 60);
    if (e && AUTO.t > 0.6) {
      AUTO.t = 0;
      if (e.kind === 'hamarr') { if (e.state === 'down') { e.closeTheDeal(); } else if (e.finisherReady) e.closeTheDeal(); else if (!e.scripted && e.state !== 'scripted' && e.state !== 'intro') e.hurt({ dmg: 140, stun: 0 }); }
      else e.hurt({ dmg: 999, stun: 0, react: 'stagger', src: 'melee' });
    }
    if (BOSS && BOSS.alive && BOSS.state === 'down') BOSS.closeTheDeal();
    return;
  }
  // walk the route toward whatever the current beat is waiting for
  let target = null;
  const sc = DIR.scene;
  if (sc === 'grove') target = OBJ.tree.base;
  else if (sc === 'walk_home') target = P.pos.x > 50 ? V3(48, 0, 147) : MARKS.ladder.pos;
  else if (sc === 'knock') target = MARKS.door_out.pos;
  else {
    // monotonic progress along the route
    if (AUTO.idx == null || AUTO.scene !== sc) { let bi = 0, bd = 1e9; ROUTE.forEach((r, i) => { const d = Math.hypot(P.pos.x - r[0], P.pos.z - r[1]); if (d < bd) { bd = d; bi = i; } }); AUTO.idx = bi; AUTO.scene = sc; }
    while (AUTO.idx < ROUTE.length - 1 && Math.hypot(P.pos.x - ROUTE[AUTO.idx][0], P.pos.z - ROUTE[AUTO.idx][1]) < 3) AUTO.idx++;
    const nx = ROUTE[AUTO.idx]; target = V3(nx[0], 0, nx[1]);
  }
  if (sc === 'grove' && dist2D(P.pos, target) < 2.0) { P.actor.yaw = yawTo(P.pos, target); if (P.state === 'free' && (AUTO.swing -= dt) <= 0) { AUTO.swing = 0.8; press('light'); setTimeout(() => release('light'), 30); } INPUT.move.x = INPUT.move.y = 0; return; }
  if (!target) return;
  camBasis();
  const d = _v[0].copy(target).sub(P.pos).setY(0); if (d.length() < 0.5) return; d.normalize();
  INPUT.move.y = d.dot(_pv.f); INPUT.move.x = d.dot(_pv.r);
}

window.__GOW = {
  G, R, CAM, PLAYER: () => PLAYER, ACTORS, ACTOR_LIST, ENEMIES, DIR, OBJ, PROPS, RUE, CABLE, LOC, groundHeight, setEnv, continueGame, startGame, callBack,
  skip: () => { DIR.skipping = true; }, killAll: () => ENEMIES.forEach(e => e.alive && e.kind !== 'hamarr' && e.hurt({ dmg: 9999 })),
  tp: (x, z) => { PLAYER.pos.set(x, groundHeight(x, z), z); }, god: (v = true) => { G.flags.god = v; },
};
boot();
