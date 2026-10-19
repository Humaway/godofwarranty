// ================= WORLD: living world, interactables, easter eggs, Mystery Shoppers =================
const THROW_TARGETS = [];
function addThrowTarget(t) { removeThrowTarget(t.id); THROW_TARGETS.push(t); return t; }
function removeThrowTarget(id) { const i = THROW_TARGETS.findIndex(x => x.id === id); if (i >= 0) THROW_TARGETS.splice(i, 1); }
function throwTargets() { return THROW_TARGETS; }

const EGG_TOTAL = 18;
function foundEgg(id, title) {
  if (G.eggs.has(id)) return false;
  G.eggs.add(id); toast(`Training Module: <b>${title}</b>`, `${G.eggs.size}/${EGG_TOTAL}`); sfx('chime', null, 0.5);
  if (G.eggs.size >= EGG_TOTAL) trophy('Every Egg in the Basket');
  saveProgress();
  return true;
}
const CODEX = {
  yes: ['The YES runes', 'ᛃᛖᛊ — a real Elder Futhark spelling of “Yes”, cut into the lintel by Faye. The ward posts read ᛟᛈᛏᚢᛊ.'],
  roster: ['The staff roster', 'SAT: CHASE · SUN: CHASE · MON–FRI: LUKA · ALWAYS: FAYE.'],
  vane: ['The weathervane', 'The old Yes sign fell off the store wall. Faye said leave it up there.'],
  esky: ['The esky note', 'WHOEVER ATE MY YOGHURT — I KNOW. — Z.'],
  tape: ['Pudding — Demo Tape', 'Chase gave it to Faye. She kept it. It changes the end-credits music.'],
  board: ['The repair queue', '#0007 · CUSTOMER: RUE · FAULT: CAN’T HANG UP · STATUS: AWAITING PARTS (SINCE 2019).'],
  ollie: ['Ollie in the ice', 'Frozen mid-wave. Nobody talks about it.'],
  jarvis: ['The JARVIS cairn', 'JARVIS is not responding. JARVIS is restarting… Same spinner.'],
  wreck: ['The wreck from another time', 'Display phones and a display table, half-buried. Still on two percent.'],
  brothers: ['The Stone of Three Brothers', 'Three weathered figures with enormous hair. The wind through them makes a three-part falsetto chord.'],
  sign: ['The signpost', 'SIGNAL HILL ← 40 · OPTUS CITY → · YES TOWN ↑ · HELPDESK: PLEASE HOLD.'],
  chime: ['The chime phones', 'Four brick phones, each tuned to one note of Faye’s song.'],
  antler: ['The Upgrade Stag’s antler', 'An antenna array, shed in the snow. Five bars.'],
  shrine: ['The Tower Shrine', 'A giant hands a lanyard to a small figure. A tower above the clouds. A figure with a bow and headphones.'],
  prepaid: ['The PREPAID', 'Locked in the ice. For now.'],
  pelican: ['The trainee pelican', 'Wears a lanyard that reads TRAINEE.'],
  ticket: ['Ticket 4,818', 'NOW SERVING 002 · YOUR NUMBER: 4,818 · ESTIMATED WAIT: END OF FINANCIAL YEAR.'],
  returns: ['The returns policy', 'NO RETURNS WITHOUT RECEIPT. He had a returns policy.'],
};

function buildInteractables() {
  const H = OBJ.house;
  const talk = (lines) => async () => { for (const [w, t] of lines) await say(w, t); };
  addInteract({ id: 'yes', pos: V3(H.X1 + 1.6, 0, H.CZ), r: 2.2, label: 'Look at the lintel', use: async () => { foundEgg('yes', CODEX.yes[0]); await talk([['chase', 'Y… E… S.'], ['luka', 'She carved that.']])(); }, once: true });
  addInteract({ id: 'roster', pos: V3(-15, 0, -85.2), r: 2.0, label: 'Read the woodpile beam', use: async () => { foundEgg('roster', CODEX.roster[0]); showSub('sys', 'SAT: CHASE · SUN: CHASE · MON–FRI: LUKA · ALWAYS: FAYE.'); await wait(2.8); await say('chase', 'I do a lot of Saturdays.'); }, once: true });
  addInteract({ id: 'vane', pos: V3(H.X1 + 3.2, 0, H.CZ + 2.6), r: 1.6, label: 'Look up at the weathervane', use: async () => { foundEgg('vane', CODEX.vane[0]); await say('luka', 'It fell off the wall. She said leave it up there.'); }, once: true });
  addInteract({ id: 'esky', pos: V3(-4.4, 0, -89.0), r: 1.4, label: 'Read the note on the esky', use: async () => { foundEgg('esky', CODEX.esky[0]); showSub('sys', 'WHOEVER ATE MY YOGHURT — I KNOW. — Z.'); await wait(3); hideSub(); }, once: true });
  addInteract({ id: 'ollie', get pos() { return OBJ.ollie; }, r: 2.2, label: 'Look down through the ice', use: async () => { foundEgg('ollie', CODEX.ollie[0]); await say('chase', 'Is that —'); await say('luka', 'Don’t.'); }, once: true });
  addInteract({ id: 'sign', get pos() { return OBJ.signpost; }, r: 2.4, label: 'Read the signpost', use: async () => { foundEgg('sign', CODEX.sign[0]); showSub('sys', 'SIGNAL HILL ← 40 · OPTUS CITY → · YES TOWN ↑ · HELPDESK: PLEASE HOLD.'); await wait(3.2); hideSub(); }, once: true });
  addInteract({ id: 'jarvis', get pos() { return OBJ.jarvis.pos; }, r: 2.4, label: 'Hit the terminal', use: async () => {
    const J = OBJ.jarvis; PLAYER.actor.anim.play('slap'); await wait(0.35); sfx('block', J.pos, 0.8); CAM.shake(0.08);
    if (!J.hits) { J.hits = 1; J.label = 'JARVIS is not responding.'; showSub('sys', 'JARVIS is not responding.'); await wait(2); await say('chase', 'Have you tried turning it off and on again?'); }
    else { J.label = 'JARVIS is restarting…'; showSub('sys', 'JARVIS is restarting…'); await wait(2.2); await say('chase', '…Classic.'); foundEgg('jarvis', CODEX.jarvis[0]); trophy('Turn It Off and On Again'); J.done = true; }
  }, enabled: () => !OBJ.jarvis.done });
  addInteract({ id: 'wreck', get pos() { return OBJ.wreck; }, r: 2.6, label: 'Look at the wreck', use: async () => { foundEgg('wreck', CODEX.wreck[0]); await talk([['chase', 'Should we… tell someone about this?'], ['luka', 'No.'], ['chase', 'It’s still on two percent.'], ['luka', 'Walk.']])(); }, once: true });
  addInteract({ id: 'antler', get pos() { return OBJ.antler.pos; }, r: 1.8, label: 'Pick up the antler', use: async () => { foundEgg('antler', CODEX.antler[0]); OBJ.antler.mesh.visible = false; await say('chase', 'It’s got five bars.'); }, once: true });
  addInteract({ id: 'shrine', get pos() { return OBJ.shrine; }, r: 2.2, label: 'Look at the carving', use: async () => { foundEgg('shrine', CODEX.shrine[0]); await say('chase', 'Who carved this?'); await say('luka', '…Old people.'); }, once: true });
  addInteract({ id: 'tape', get pos() { return OBJ.kiosk && OBJ.kiosk.tape; }, r: 1.8, label: 'Take the cassette', use: async () => { foundEgg('tape', CODEX.tape[0]); G.flags.tape = true; toast('<b>Pudding — Demo Tape</b>', 'The credits will sound different'); await say('chase', 'Oh no. Oh no, they kept that.'); }, once: true, enabled: () => G.flags.kioskDone });
  addInteract({ id: 'board', get pos() { return OBJ.kiosk && OBJ.kiosk.board; }, r: 1.8, label: 'Read the repair queue', use: async () => { foundEgg('board', CODEX.board[0]); showSub('sys', '#0004 · CUSTOMER: HILDIS-VINNIE · FAULT: SAT ON IT'); await wait(2.6); showSub('sys', '#0007 · CUSTOMER: RUE · FAULT: CAN’T HANG UP · STATUS: AWAITING PARTS (SINCE 2019)'); await wait(3.2); hideSub(); }, once: true, enabled: () => G.flags.kioskDone });
  addInteract({ id: 'smiths', get pos() { return OBJ.kiosk && OBJ.kiosk.bench; }, r: 2.6, label: 'Talk to Luke and Zane', use: async () => { await openKiosk(); }, enabled: () => G.flags.kioskDone && G.checkpointIndex <= CHECKPOINTS.indexOf('zee') });
  addInteract({ id: 'ticket', get pos() { return OBJ.ticket && OBJ.ticket.pos; }, r: 1.6, label: 'Take another ticket', use: async () => { sfx('ding', OBJ.ticket.pos, 1); foundEgg('ticket', CODEX.ticket[0]); showSub('sys', 'NOW SERVING 002 · YOUR NUMBER: 4,818 · ESTIMATED WAIT: END OF FINANCIAL YEAR.'); await wait(3.4); hideSub(); }, once: true, enabled: () => G.flags.queueDone });
}

// interactable prompt + use
let currentInteract = null;
function updateInteract() {
  currentInteract = null;
  if (!PLAYER || !PLAYER.control || G.combat || PLAYER.state !== 'free' || G.inputLock || DIR.busyInteract) { promptHide('interact'); return; }
  let best = null, bd = 1e9;
  for (const it of INTERACT) {
    if (it.done || !it.enabled()) continue;
    const p = it.pos; if (!p) continue;
    const d = dist2D(p, PLAYER.pos); if (d > it.r) continue;
    if (d < bd) { bd = d; best = it; }
  }
  currentInteract = best;
  if (best) prompt('interact', best.label, { key: 'interact', sticky: true }); else promptHide('interact');
  if (best && (wasPressed('interact')) && !DLG.line) {
    if (best.once) best.done = true;
    DIR.busyInteract = true; promptHide('interact');
    PLAYER.vel.set(0, 0, 0);
    Promise.resolve(best.use()).catch(e => { if (!e.isAbort) console.warn(e); }).finally(() => { DIR.busyInteract = false; });
  }
}

// ---------- Mystery Shoppers (5) ----------
const SHOPPER_LINES = ['That’s one less report.', 'He gave us three stars! Rude.', 'Do they report on us or on the store?', 'Mystery solved.', 'Last one. Head Office is going to be so confused.'];
function placeShopper(n, pos, yaw = 0) {
  if (G.shoppers.has(n)) return;
  const r = OBJ.shoppers[n] || (OBJ.shoppers[n] = buildRaven(true));
  perchRaven(r, pos, yaw); r.shopperN = n;
  addThrowTarget({ id: 'shopper' + n, get pos() { return r.root.position; }, r: 0.55, chase: true, hit: () => knockShopper(n) });
}
function knockShopper(n) {
  const r = OBJ.shoppers[n]; if (!r || G.shoppers.has(n)) return;
  G.shoppers.add(n); removeThrowTarget('shopper' + n);
  fxBurst('feathers', r.root.position); fxBurst('paper', r.root.position); sfx('raven', r.root.position, 0.8); sfx('scribble', r.root.position, 0.5);
  r.root.visible = false; r.state = 'off';
  addSilver(100, `Mystery Shopper ${G.shoppers.size}/5`);
  later(0.6, () => bark('chase', SHOPPER_LINES[Math.min(4, G.shoppers.size - 1)], { force: true, cd: 0 }));
  if (G.shoppers.size >= 5) trophy('Mystery Solved');
  saveProgress();
}

// ---------- the chime-phone puzzle: hit them in the order of Faye's motif ----------
function setupChimePuzzle() {
  const seq = [62, 65, 69, 67]; let prog = 0;
  OBJ.chimePhones.forEach((ph, i) => {
    addThrowTarget({ id: 'chime' + i, get pos() { return ph.g.localToWorld(_v[18].set(0, -1.05, 0)); }, r: 0.4, chase: true, hit: () => {
      ph.swing = 1; sfx('note', ph.g.position, 1, ph.note + 12);
      if (G.flags.chimeDone) return;
      if (ph.note === seq[prog]) { prog++; if (prog === 4) { G.flags.chimeDone = true; solvedChimes(); } }
      else prog = ph.note === seq[0] ? 1 : 0;
    } });
  });
}
async function solvedChimes() {
  foundEgg('chime', CODEX.chime[0]); trophy('Faye’s Song');
  await wait(0.8); await say('luka', '…That’s it.', { slow: 1.3 });
  PLAYER.maxHp = Math.round(PLAYER.maxHp * 1.1); PLAYER.hp = PLAYER.maxHp; toast('<b>Iðunn Power Bank</b>', '+10% max health');
}

// ---------- per-frame world life ----------
const LIFE = { gustT: 25, gust: 0, gustDur: 0, chimeIdle: 0 };
function updateWorldLife(dt) {
  const t = U.time.value;
  // gusts every 20–40 s sweep blown snow across the ground and bend the trees
  LIFE.gustT -= dt;
  if (LIFE.gustT <= 0) { LIFE.gustT = 20 + frand() * 20; LIFE.gustDur = 4.5; }
  if (LIFE.gustDur > 0) { LIFE.gustDur -= dt; const k = 1 - Math.abs(LIFE.gustDur / 4.5 * 2 - 1); U.gust.value = smoothstep(0, 1, k); if (frand() < dt * 30 * k) { const p = R.camera.position; fxBurst('snow', V3(p.x + (frand() - 0.5) * 16, groundHeight(p.x, p.z) + 0.2, p.z + (frand() - 0.5) * 16), { n: 3, scale: 1.4 }); } }
  else U.gust.value = damp(U.gust.value, 0, 1, dt);
  U.wind.value.set(0.5 + U.gust.value * 1.5, 0.22 + U.gust.value * 0.5);
  if (OBJ.vane) OBJ.vane.rotation.y = damp(OBJ.vane.rotation.y, Math.atan2(U.wind.value.y, U.wind.value.x) + Math.sin(t * 0.7) * 0.25, 1.5, dt);
  if (OBJ.chimes) OBJ.chimes.forEach((c, i) => { c.rotation.z = Math.sin(t * 1.7 + i) * 0.12 * (1 + U.gust.value * 2); c.rotation.x = Math.cos(t * 1.3 + i * 2) * 0.08 * (1 + U.gust.value * 2); });
  if (OBJ.kiosk) OBJ.kiosk.fan.rotation.z += dt * (G.flags.forgeOn ? 6 : 1.2);
  if (OBJ.fish) OBJ.fish.forEach(f => { const u = f.userData; u.x += Math.sin(t * 0.3 + u.ph) * dt * u.sp; const z = creekZ(u.x) + Math.sin(t * 0.5 + u.ph) * 0.8; f.position.set(u.x, terrainHeight(u.x, z) - 0.08, z); f.rotation.z = Math.atan2(Math.cos(t * 0.5 + u.ph) * 0.4, Math.cos(t * 0.3 + u.ph)); });
  if (OBJ.towerLights) OBJ.towerLights.forEach(s => { s.material.opacity = (Math.sin(t * 2.2 + s.userData.ph) > 0.2 ? 1 : 0.08); });
  if (OBJ.chimePhones) OBJ.chimePhones.forEach(ph => { ph.swing = Math.max(0, ph.swing - dt * 0.6); ph.g.rotation.z = Math.sin(t * 7) * 0.4 * ph.swing + Math.sin(t * 1.2 + ph.idx) * 0.05; });
  // JARVIS spins forever
  if (OBJ.jarvis && R.camera.position.distanceTo(OBJ.jarvis.pos) < 40) {
    const J = OBJ.jarvis, g = J.canvas.getContext('2d'); J.t += dt;
    if (((J.t * 10) | 0) !== J.lastF) { J.lastF = (J.t * 10) | 0; g.fillStyle = '#0a1a24'; g.fillRect(0, 0, 64, 48); g.strokeStyle = '#6fd'; g.lineWidth = 3; g.beginPath(); g.arc(32, 20, 9, J.t * 5, J.t * 5 + 4.4); g.stroke(); g.fillStyle = '#9fe'; g.font = '6px monospace'; g.textAlign = 'center'; g.fillText(J.label.slice(0, 18), 32, 40); J.tex.needsUpdate = true; }
  }
  // the Stone of Three Brothers harmonises when you stand close
  if (OBJ.brothers && PLAYER && dist2D(PLAYER.pos, OBJ.brothers) < 4.5 && !G.flags.brothersHeard && PLAYER.control) {
    G.flags.brothersHeard = true;
    if (AUDIO.ok) { const t0 = T0(), out = sfxOut(OBJ.brothers, 0.9); [74, 78, 81].forEach(m => INST.choir(t0, m, 3.5, 0.55, out, 'oo')); }
    foundEgg('brothers', CODEX.brothers[0]); later(1.5, () => bark('chase', 'Are the rocks… harmonising?', { force: true }));
  }
  // idle near the chime tree and Chase hums Faye's tune (the hint)
  if (OBJ.chimePhones && PLAYER && PLAYER.control && !G.flags.chimeDone && dist2D(PLAYER.pos, LOC.chime) < 7 && Math.hypot(PLAYER.vel.x, PLAYER.vel.z) < 0.2) { LIFE.chimeIdle += dt; if (LIFE.chimeIdle > 6 && !DLG.line) { LIFE.chimeIdle = -20; humMotif(ACTORS.chase); } } else if (LIFE.chimeIdle > 0) LIFE.chimeIdle = 0;
  // the ward's hum
  if (AUDIO.ok && OBJ.ward) { const d = PLAYER ? Math.abs(dist2D(R.camera.position, LOC.ward) - LOC.wardR) : 99; AUDIO.humGain.gain.setTargetAtTime(OBJ.ward.alive ? clamp01(1 - d / 22) * 0.9 : 0, AUDIO.ctx.currentTime, 0.2); }
  // fire: crackle and heat haze
  const fire = FIRE.on && FIRE.level > 0.05;
  if (AUDIO.ok) AUDIO.fireGain.gain.setTargetAtTime(fire ? clamp01(1 - R.camera.position.distanceTo(FIRE.pos) / 25) * 0.25 * FIRE.level : 0, AUDIO.ctx.currentTime, 0.2);
  const hz = R.post.haze;
  if (fire && FIRE.haze) { const p = _v[20].copy(FIRE.pos).add(_v[21].set(0, 1.6, 0)).project(R.camera); const vis = p.z < 1 && Math.abs(p.x) < 1.3 && Math.abs(p.y) < 1.3; hz.set(p.x * 0.5 + 0.5, p.y * 0.5 + 0.5, vis ? FIRE.level * clamp01(1 - R.camera.position.distanceTo(FIRE.pos) / 40) : 0); R.post.hazeR = clamp(4 / Math.max(2, R.camera.position.distanceTo(FIRE.pos)) * (30 / R.camera.fov), 0.05, 0.5); }
  else hz.z = damp(hz.z, 0, 4, dt);
  updateFire(dt);
}
// fire emitters: the pyre, the chimney, candles, fire pit, forge
const FIRE = { on: false, level: 0, target: 0, pos: V3(), haze: true, smokeRate: 0, emberRate: 0, light: 0, candles: false, chimney: true, mode: 'pyre', acc: 0, accS: 0, accE: 0 };
function updateFire(dt) {
  FIRE.level = damp(FIRE.level, FIRE.target, FIRE.target > FIRE.level ? 0.6 : 1.5, dt);
  const L = FIRE.level;
  if (FIRE.on && L > 0.02) {
    const scale = FIRE.mode === 'pyre' ? 1 : FIRE.mode === 'embers' ? 0.35 : 0.45;
    FIRE.acc += dt * (FIRE.mode === 'embers' ? 6 : 60) * L;
    while (FIRE.acc >= 1) { FIRE.acc--; fxBurst('flame', FIRE.mode === 'pyre' ? _v[22].copy(FIRE.pos).add(_v[23].set(0, 0.2 + frand() * 1.0, 0)) : FIRE.pos, { scale }); }
    FIRE.accE += dt * (FIRE.mode === 'pyre' ? 14 : 4) * L; while (FIRE.accE >= 1) { FIRE.accE--; fxBurst('embers', _v[22].copy(FIRE.pos).add(_v[23].set(0, 0.8, 0)), { n: 1, scale: FIRE.mode === 'pyre' ? 1.2 : 0.4 }); }
    FIRE.accS += dt * (FIRE.mode === 'pyre' ? 3.2 : FIRE.mode === 'embers' ? 0.8 : 0) * L; while (FIRE.accS >= 1) { FIRE.accS--; fxBurst('smoke', _v[22].copy(FIRE.pos).add(_v[23].set(0, 1.8, 0)), { scale: FIRE.mode === 'pyre' ? 1.3 : 0.7, a: 0.45 }); }
    setLight(0, { pos: _v[22].copy(FIRE.pos).add(_v[23].set(0, 1.8, 0)), color: 0xff8a3a, intensity: (FIRE.mode === 'pyre' ? 90 : FIRE.mode === 'embers' ? 14 : 22) * L, flicker: 0.6, dist: FIRE.mode === 'pyre' ? 40 : 16 });
  } else if (FIRE.light !== 0) { setLight(0, { intensity: 0 }); }
  // chimney smoke and candles
  if (FIRE.chimney && OBJ.house && frand() < dt * 1.5) fxBurst('smoke', V3(-18.2, OBJ.house.RIDGE + 0.7, -93.6), { scale: 0.6, a: 0.25, c: 0.6 });
  if (FIRE.candles && OBJ.candles) for (const c of OBJ.candles) if (frand() < dt * 8) FX.flame.emit(c.x, c.y, c.z, 0, 0.3, 0, 0.3, 0.07, 0.02, 1.6, 1.0, 0.5, 1, 0, -0.2, 0);
}
