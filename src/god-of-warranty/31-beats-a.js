// ================= DIRECTOR: Beats 0–4 — Begin Shift, The Marked Tree, The Carry, Wi-Faye, The Ward Falls =================
const TWEENS = [];
function tween(set, a, b, dur, ease = EASE.inOutSine) {
  if (DIR.skipping || dur <= 0) { set(b); return Promise.resolve(); }
  const id = RUN.id;
  return new Promise((res, rej) => TWEENS.push({ set, a, b, dur, t: 0, ease, res, rej, id }));
}
function updateTweens(dt) {
  for (let i = TWEENS.length - 1; i >= 0; i--) {
    const w = TWEENS[i];
    if (w.id !== RUN.id) { TWEENS.splice(i, 1); w.rej(new Abort()); continue; }
    w.t += DIR.skipping ? 1e9 : dt;
    const k = clamp01(w.t / w.dur); w.set(lerp(w.a, w.b, w.ease(k)));
    if (k >= 1) { TWEENS.splice(i, 1); w.res(); }
  }
}
// hidden wipes: the camera passes behind something that fills the frame (§5.5)
async function wipe(type, tin, hold, tout, mid) {
  R.post.wipeType = type;
  await tween(v => R.post.wipe = v, R.post.wipe, 1, tin, EASE.inQuad);
  if (mid) await mid();
  await wait(hold);
  await tween(v => R.post.wipe = v, 1, 0, tout, EASE.outQuad);
}
const LOG = { mesh: null, carried: false, dir: V3(0, 0, 1), get onPyre() { return this.mesh; } };
const PROPS = {};
function buildStoryProps() {
  // the trimmed log, with Faye's handprint
  const T = OBJ.tree;
  const g = new THREE.Group();
  const lm = T.log.clone(); lm.position.set(0, -2.7, 0); g.add(lm);
  const hd = T.hand.clone(); hd.position.set(0.02, 0.95 - 2.7, 0.318); g.add(hd);
  const holder = new THREE.Group(); holder.add(g); g.rotation.x = PI / 2; // along +z, centred
  holder.visible = false; R.scene.add(holder); LOG.mesh = holder; LOG.inner = g;
  // the Cold Call, standing in the scorched display-table frame
  const ax = buildColdCall(); ax.rotation.set(PI + 0.25, 0.4, 0.12); ax.position.copy(LOC.pyre).setY(OBJ.pyreY + 1.75); ax.visible = false; R.scene.add(ax); OBJ.pyreAxe = ax;
  // Chase's cardboard box
  PROPS.box = new GB().box(0.36, 0.26, 0.28, { color: 0xffffff }).mesh(MATS.cardboard); ACTORS.chase.attach('handL', PROPS.box, [0.12, -0.14, 0.12], [0, 0, 0]); PROPS.box.visible = false;
  // the flip-phone lighter
  PROPS.lighter = new GB().box(0.045, 0.08, 0.018, { color: 0x9aa4a8 }).box(0.045, 0.08, 0.008, { pos: [0, 0.07, -0.012], rot: [-0.7, 0, 0], color: 0x8a949a }).mesh(MATS.vcNoSnow);
  PROPS.lighter.visible = false; ACTORS.chase.attach('handR', PROPS.lighter, [0, -0.15, 0.02]);
  PROPS.lighterL = PROPS.lighter.clone(); PROPS.lighterL.visible = false; ACTORS.luka.attach('handR', PROPS.lighterL, [0, -0.16, 0.02]);
  // the repair bag and Ticket #0001
  const tkT = textTex(256, 96, (c, w, h) => { c.fillStyle = '#fbfaf2'; c.fillRect(0, 0, w, h); c.fillStyle = '#0f8a8a'; c.fillRect(0, 0, w, 16); c.fillStyle = '#fff'; c.font = '700 11px Barlow, sans-serif'; c.textAlign = 'left'; c.fillText('REPAIR TICKET #0001', 8, 12); c.fillStyle = '#1b2a6a'; c.font = 'italic 600 13px "Segoe Print", "Bradley Hand", cursive'; c.fillText('CUSTOMER: FAYE', 10, 36); c.fillText('FAULT: ______', 10, 56); c.fillText('RETURN TO: THE HIGHEST TOWER', 10, 78); });
  PROPS.bag = new THREE.Group();
  PROPS.bag.add(new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.26, 0.07), new THREE.MeshStandardMaterial({ color: 0xdfe8ee, transparent: true, opacity: 0.35, roughness: 0.15 })));
  const ash = new THREE.Mesh(new THREE.BoxGeometry(0.17, 0.11, 0.05), new THREE.MeshLambertMaterial({ color: 0x8a8580 })); ash.position.y = -0.06; PROPS.bag.add(ash); PROPS.ash = ash;
  const tk = new THREE.Mesh(new THREE.PlaneGeometry(0.16, 0.06), new THREE.MeshLambertMaterial({ map: tkT })); tk.position.set(0, 0.07, 0.037); PROPS.bag.add(tk); PROPS.ticket = tk;
  PROPS.bag.visible = false; ACTORS.luka.attach('handL', PROPS.bag, [0, -0.17, 0.06], [0, 0, 0]);
  // Zane's cloth, offered to Luke
  PROPS.lukeCloth = new GB().box(0.09, 0.006, 0.12, { color: 0xf1c232 }).mesh(MATS.vcNoSnow); PROPS.lukeCloth.visible = false; ACTORS.luke.attach('handR', PROPS.lukeCloth, [0, -0.18, 0.03]);
  // the Hold Pattern pager charm
  PROPS.pager = new GB().box(0.05, 0.07, 0.02, { color: 0x2a2a2a }).box(0.03, 0.015, 0.004, { pos: [0, 0.015, 0.011], color: 0x7ad3a0 }).mesh(MATS.vcNoSnow); PROPS.pager.visible = false; ACTORS.zee.attach('handL', PROPS.pager, [0, -0.15, 0.04]);
  PROPS.pagerC = PROPS.pager.clone(); PROPS.pagerC.visible = false; ACTORS.chase.attach('handL', PROPS.pagerC, [0, -0.14, 0.04]);
  PROPS.arrowZ = new THREE.Mesh(buildArrowGeo(), MATS.vcNoSnow); PROPS.arrowZ.visible = false; ACTORS.zee.attach('handR', PROPS.arrowZ, [0, -0.16, 0.05], [PI / 2, 0, 0]);
  // the foreground pine boughs for the long-lens Zee shot
  const bg = new GB(); for (let i = 0; i < 7; i++) bg.cone(0.9, 1.6, 6, { pos: [(i % 3 - 1) * 0.7, (i / 3 | 0) * 0.35, 0], rot: [PI / 2 + 0.3, 0, (i - 3) * 0.3], color: PINE_GREENS[i % 5] });
  PROPS.boughs = bg.mesh(MATS.pine); PROPS.boughs.visible = false; R.scene.add(PROPS.boughs);
  // wombat tracks
  PROPS.tracks = []; for (let i = 0; i < 8; i++) { const m = new THREE.Mesh(new THREE.CircleGeometry(0.22, 8), new THREE.MeshBasicMaterial({ color: 0x4a5a78, transparent: true, opacity: 0.4, depthWrite: false })); m.rotation.x = -PI / 2; m.visible = false; R.scene.add(m); PROPS.tracks.push(m); }
}
function placeLog(state) {
  const T = OBJ.tree, L = LOG.mesh;
  if (state === 'standing') { T.pivot.visible = true; T.pivot.rotation.set(0, 0, 0); T.canopy.visible = true; L.visible = false; return; }
  T.pivot.visible = false; L.visible = true;
  if (state === 'fallen') {
    const f = fwdFromYaw(T.yaw + PI, _v[1]);
    // the trunk lies away from the clearing, Faye's handprint facing the sky
    L.position.copy(T.base).addScaledVector(f, 3.3); L.position.y = terrainHeight(L.position.x, L.position.z) + 0.3;
    L.rotation.set(0, T.yaw, 0); L.children[0].rotation.set(-PI / 2, 0, 0); L.scale.setScalar(1);
  }
  if (state === 'pyre') { L.position.copy(OBJ.pyre.top).add(V3(0.45, 0.05, 0)); L.rotation.set(0, 0.2, 0); L.children[0].rotation.set(-PI / 2, 0, 0); L.scale.setScalar(0.85); }
}

// ---------- Title / Beat 0 — Begin Shift ----------
const TITLE = { t: 0, cableT: 0 };
function titleShot() {
  CAM.shotFn((t, p, a) => { p.set(205, 118, -175 + 0.4 * t); a.set(-60, 2, 58 + 0.4 * t); }, { snap: true, omega: 2, lens: 18, fStop: 8, handheld: 0.1 });
  CAM.focal = 18; CAM.fStop = 8; CAM.focusOverride = 300;
}
function enterTitle() {
  G.mode = 'title'; G.title = true;
  setEnv('title', 0); titleShot(); musicCue('title', 3);
  FIRE.on = false; FIRE.chimney = true;
  setupCheckpoint('grove');
  setEnv('title', 0);
  UI.showTitle(true);
}
function updateTitleWorld(dt) {
  // far out on the ice, a long shape breaks the surface and sinks again
  TITLE.cableT += dt;
  const c = TITLE.cableT % 40;
  CABLE.rise = c > 18 && c < 26 ? Math.sin((c - 18) / 8 * PI) * 0.16 : 0;
}
async function beginShift() {
  G.title = false; UI.showTitle(false); G.stats.startT = G.realTime;
  const id = ++RUN.id;
  try {
    G.mode = 'cine';
    resetProgress(); setCheckpoint('grove');
    setupCheckpoint('grove');
    setEnv('title', 0);
    CABLE.rise = 0;
    // the letters crumble into snow and are taken by a gust toward the land
    sfx('whoosh', null, 1); U.gust.value = 1; LIFE.gustDur = 6; LIFE.gustT = 30;
    for (let i = 0; i < 60; i++) { const p = V3(R.camera.position.x - 20 + frand() * 10, R.camera.position.y - 10 + frand() * 8, R.camera.position.z + 10 + frand() * 30); FX.soft.emit(p.x, p.y, p.z, -30 - frand() * 10, -6, 6 + frand() * 6, 3, 0.4, 0.9, 0.95, 0.97, 1, 0.8, 0, 0, 0.2); }
    // crane down and forward over the cliffs into the pine canopy, 18 → 35 mm over 8 s
    CAM.focusOverride = null;
    CAM.focusOn(() => CAM.final.aim);
    CAM.shotFn(SHOT.path([[205, 118, -175], [120, 86, -170], [40, 52, -176], [-4, 34, -178], [-17, 23.5, -177.5]], [[-60, 2, 58], [-20, 10, -120], [-10, 14, -170], [-18, 18, -180], [-20, 17, -182]], 8.2, EASE.inOutSine), { omega: 2.8, lens: 35, lensDur: 8, fStop: 4, handheld: 0.2 });
    musicCue('silence', 4);
    await wait(5.0);
    setEnv('grove', 3);
    await wait(2.4);
    // Canopy wipe: dense boughs fill the frame; snow dumps across the lens
    await wipe(2, 0.6, 0.35, 1.1, async () => { prepHandprintShot(); });
    if (id !== RUN.id) return;
    DIR.done = new Set();
    await BEATS.grove(true);
    for (const k of CHECKPOINTS.slice(CHECKPOINTS.indexOf('carry'))) { if (id !== RUN.id) return; if (DIR.done.has(k)) continue; await BEATS[k](); }
  } catch (e) { if (!e.isAbort) console.error(e); }
}

// ---------- BEAT 1 — The Marked Tree ----------
function handprintPos(out = V3()) { return OBJ.tree.hand.getWorldPosition(out); }
function prepHandprintShot() {
  // the camera sits off Luka's right shoulder so his hand enters frame from the side
  const H = handprintPos(V3()), T = OBJ.tree, f = fwdFromYaw(T.yaw, V3()), side = fwdFromYaw(T.yaw + PI / 2, V3());
  const cp = H.clone().addScaledVector(f, 0.78).addScaledVector(side, 1.22); cp.y += 0.06;
  CAM.shotFn((t, p, a) => { p.copy(cp).addScaledVector(side, -t * 0.012); a.copy(H).addScaledVector(side, 0.03); }, { snap: true, omega: 3, lens: 85, lensDur: 0.01, fStop: 1.8, fDur: 0.01, handheld: 0.25 });
  CAM.focal = 85; CAM.fStop = 1.8; CAM.focusOn(() => H); CAM.focus.snap(cp.distanceTo(H));
  setEnv('grove', 0);
}
SETUPS.grove = () => {
  setEnv('grove', 0); placeLog('standing');
  worldState({ tree: 'standing', pyre: 'built', body: false, ward: true, axe: 'pyre', slate: 'post', rue: 'off', smiths: 'yard', zee: 'none', beanie: true, weapon: 'none', door: false, lights: () => lightsYard(false) });
  OBJ.tree.lanyard.visible = true;
  place('luka', 'tree_hand'); MARKS.tree_hand.pos.copy(OBJ.tree.base).addScaledVector(fwdFromYaw(OBJ.tree.yaw, V3()), 0.98); MARKS.tree_hand.pos.y = terrainHeight(MARKS.tree_hand.pos.x, MARKS.tree_hand.pos.z);
  place('luka', 'tree_hand');
  place('chase', [-34, null, -150, 2.6]); ACTORS.chase.setVisible(false);
  PROPS.box.visible = false; LOG.carried = false;
};
BEATS.grove = async (fromTitle) => {
  const L = ACTORS.luka, C = ACTORS.chase, T = OBJ.tree;
  cine();
  if (!fromTitle) { prepHandprintShot(); await wait(0.2); }
  musicCue('silence', 1);
  sfx('raven', V3(-30, 30, -190), 0.4);
  // 1.1 — the handprint. Luka's hand enters frame and rests over the print. His fingers are slightly bigger than hers.
  await wait(0.9);
  act(L, 'touch_print');
  await wait(1.5);
  CAM.pull(() => L.boneWorld('handR', V3(), [0, -0.1, 0.02]), 0.8);
  await wait(2.5);
  // 1.2 — focus racks up his arm to his face as the camera tilts up and drifts left (50 mm, f/2)
  const f = fwdFromYaw(T.yaw, V3()), side = fwdFromYaw(T.yaw + PI / 2, V3());
  const H = handprintPos(V3());
  const face = () => L.eyes(V3());
  const e0 = face();
  CAM.shotFn((t, p, a) => { const e = face(), k = smootherstep(t / 3.4); p.copy(e0).addScaledVector(f, lerp(-0.42, -0.5, k)).addScaledVector(side, lerp(0.86, 0.72, k)); p.y = lerp(H.y + 0.05, e.y + 0.03, k); a.copy(H).lerp(e, k); }, { omega: 2.4, lens: 50, lensDur: 3, fStop: 2.0, fDur: 2, handheld: 0.3 });
  CAM.pull(face, 2.6);
  await wait(2.4);
  nameCard('luka');
  musicCue('wifaye', 6);
  await wait(1.6);
  // he unties Faye's lanyard, winds it around his hand, and puts it in his satchel
  L.anim.stop(0.3); act(L, 'untie');
  await wait(1.6); T.lanyard.visible = false;
  await wait(1.2);
  act(L, 'hand_to_satchel'); await wait(1.3);
  // 1.3 — the chop. He steps back; the camera drifts back and right into the exploration framing. Soft handoff.
  setWeapon('wood');
  const back = T.base.clone().addScaledVector(f, 3.1);
  walk(L, back, { yaw: T.yaw + PI, backwards: true, speed: 0.8 });
  CAM.shotFn(SHOT.track(L, [0.55, 1.55, -2.2], [0.55, 1.45, 8]), { omega: 2.4, lens: 26, fStop: 5.6, handheld: 0.3 });
  await wait(1.4);
  await waitOrInput(1.2);
  await handoff({ chase: false, prompt: ['move', 'Move', 6], yaw: T.yaw + PI });
  G.allowAim = false; G.allowShield = false; G.allowDodge = false; G.allowRage = false;
  setCheckpoint('grove');
  await waitUntil(() => dist2D(L.pos, T.base) < 2.2, 60);
  promptHide('move'); prompt('light', 'Swing', { key: 'light', sticky: true });
  // three swings: chips, a 70 ms hitstop, camera trauma 0.15, snow off the branches
  let chops = 0;
  while (chops < 3) {
    await waitUntil(() => PLAYER.state === 'attack' && PLAYER.stateT >= PLAYER.move.s * F && !PLAYER.chopDone && dist2D(L.pos, T.base) < 2.4 && Math.abs(angleTo(L.yaw, yawTo(L.pos, T.base))) < 1.1);
    PLAYER.chopDone = true; later(0.4, () => { PLAYER.chopDone = false; });
    chops++;
    const hp = T.base.clone().add(V3(0, 0.62, 0)).addScaledVector(f, 0.35);
    hitstop(70); CAM.shake(0.15); sfx('wood', hp, 1); sfx('hit', hp, 0.4); fxBurst('chips', hp, { n: 20, dx: f.x, dz: f.z }); rumble(0.3, 0.5, 90);
    fxBurst('snow', T.base.clone().add(V3(0, 6, 0)), { n: 40, scale: 1.8 });
    if (chops === 1) promptHide('light');
    if (chops === 2) groveRavens();
  }
  // 1.4 — the fall. Input fades out; Luka steps back on his own.
  cine();
  await wait(0.3);
  walk(L, T.base.clone().addScaledVector(f, 3.6).addScaledVector(side, -0.8), { yaw: T.yaw + PI, backwards: true, speed: 0.9 });
  sfx('creak', T.base, 1);
  const fallDir = fwdFromYaw(T.yaw + PI, V3());
  CAM.shotFn((t, p, a) => { p.copy(T.base).addScaledVector(f, 7.5 + t * 0.4).addScaledVector(side, -3.5); p.y = T.base.y + 2.2 + Math.min(1.8, t * 0.9); a.copy(T.base).addScaledVector(fallDir, 3).add(V3(0, 3.5 - Math.min(2.5, t * 0.9), 0)); }, { omega: 2.6, lens: 24, fStop: 4, handheld: 0.35 });
  CAM.focusOn(() => T.base.clone().add(V3(0, 2, 0)));
  await wait(1.1);
  sfx('crack', T.base, 1);
  await tween(v => { T.pivot.rotation.x = -v * (PI / 2 - 0.05); }, 0, 1, 2.3, EASE.inQuad);
  // impact: a big plume of powder snow; the operator flinches and re-frames
  const land = T.base.clone().addScaledVector(fallDir, 4.5);
  sfx('thump', land, 1.3); CAM.shake(0.35); rumble(0.8, 1, 250); fxBurst('plume', land, { n: 220, scale: 1.2 }); fxBurst('snow', T.base, { n: 60 });
  if (AUDIO.ok) INST.taiko(T0(), 1, AUDIO.musicBus, 0.6);
  for (let i = 0; i < 18; i++) FX.soft.emit(R.camera.position.x + (frand() - 0.5) * 3, R.camera.position.y + (frand() - 0.5), R.camera.position.z + (frand() - 0.5) * 3, (frand() - 0.5), -0.2, (frand() - 0.5), 2.5, 0.05, 0.05, 0.95, 0.96, 1, 0.9, 0, 0.1, 0.2);
  await wait(0.5);
  placeLog('fallen'); T.root.children[0].visible = true;
  await wait(1.2);
  // 1.5 — Chase. The operator hears a voice behind and turns to find him wading through thigh-deep snow, a box under his arm.
  C.setVisible(true); place(C, [-29.5, null, -160.5, 2.7]); PROPS.box.visible = true; C.anim.setOverlay('holdBox', 20, 'armL');
  const chaseMark = T.base.clone().addScaledVector(f, 2.6).addScaledVector(side, -2.2); chaseMark.y = terrainHeight(chaseMark.x, chaseMark.z);
  walk(C, chaseMark, { speed: 1.0 });
  say('chase', 'Sorry! Sorry — I know. The snow’s up to my —', { dur: 2.4 });
  await wait(0.35);
  CAM.shotFn((t, p, a) => { p.copy(L.pos).addScaledVector(side, -1.6).add(V3(0, 1.65, 0)).addScaledVector(f, 1.2); a.copy(C.headWorld(_v[1])); }, { omega: 4.2, lens: 35, fStop: 2.8, handheld: 0.45 });
  CAM.pull(eyes('chase'), 0.8);
  look(L, 'chase', 0.6);
  await wait(2.3);
  nameCard('chase');
  await say('chase', 'Luke says the pyre’s “structurally sound”, and Zane says it’s “structurally a fire hazard”, which, I mean, that’s sort of the point of a —', { dur: 5.4 });
  await say('luka', 'Don’t be sorry. Be on time.');
  await say('chase', '…Right. Yep.');
  await waitUntil(() => !C.walkTo, 6);
  // favour Chase (50 mm); the handprint on the fallen trunk soft in the foreground
  const hpw = () => LOG.inner.children[1].getWorldPosition(V3());
  CAM.shotFn((t, p, a) => { const hp = hpw(); p.copy(hp).add(V3(0, 0.35, 0)).addScaledVector(_v[2].copy(hp).sub(C.pos).setY(0).normalize(), 0.9); a.copy(C.headWorld(_v[3])); }, { omega: 2.6, lens: 50, fStop: 2.0, handheld: 0.3 });
  CAM.pull(eyes('chase'), 1.0);
  look(C, hpw, 1);
  await wait(1.8);
  await say('chase', '(quiet) That’s her tree.', { slow: 1.2 });
  await wait(0.9);
  look(C, 'luka');
  await say('luka', 'Take the other end, Casual.');
  await say('chase', 'It’s Chase.');
  CAM.shotFn((t, p, a) => { p.copy(C.pos).add(V3(0, 1.6, 0)).addScaledVector(_v[2].copy(L.pos).sub(C.pos).setY(0).normalize(), 0.0).addScaledVector(fwdFromYaw(yawTo(C.pos, L.pos) + PI / 2, _v[4]), 0.9).addScaledVector(fwdFromYaw(yawTo(C.pos, L.pos), _v[5]), -0.9); a.copy(L.headWorld(_v[6])); }, { omega: 2.2, lens: 50, fStop: 2.0, handheld: 0.25 });
  CAM.pull(eyes('luka'), 0.7);
  await wait(2.0);
  await say('luka', 'Take the other end.');
};

function groveRavens() {
  const T = OBJ.tree;
  sfx('raven', T.base.clone().add(V3(0, 8, 0)), 1);
  for (let i = 0; i < 4; i++) { const r = buildRaven(false); perchRaven(r, T.base.clone().add(V3((frand() - 0.5) * 4, 7 + frand() * 2, (frand() - 0.5) * 4)), frand() * 6); flyRaven(r, V3((frand() - 0.5) * 6, 3 + frand() * 2, (frand() - 0.5) * 6)); }
  // one stays behind: a single green glowing eye, a tiny clipboard tied to its leg
  const s = buildRaven(true); const branch = T.base.clone().add(V3(-1.6, 5.2, 1.4)); perchRaven(s, branch, yawTo(branch, ACTORS.luka.pos));
  later(1.0, () => sfx('scribble', branch, 0.8));
  later(3.2, () => { sfx('raven', branch, 0.8); flyRaven(s, V3(0.5, 6, -1)); });
}

// ---------- BEAT 2 — The Carry ----------
SETUPS.carry = () => {
  SETUPS.grove(); OBJ.tree.lanyard.visible = false; placeLog('fallen'); ACTORS.chase.setVisible(true); setWeapon('none');
  const lp = LOG.mesh.position; place('luka', lp.clone().addScaledVector(fwdFromYaw(LOG.mesh.rotation.y, V3()), -2.6), LOG.mesh.rotation.y);
  place('chase', lp.clone().addScaledVector(fwdFromYaw(LOG.mesh.rotation.y, V3()), 2.6), LOG.mesh.rotation.y + PI);
  PROPS.box.visible = true; ACTORS.chase.anim.setOverlay('holdBox', 50, 'armL');
};
BEATS.carry = async () => {
  const L = ACTORS.luka, C = ACTORS.chase;
  setCheckpoint('carry');
  // walk to the ends of the log
  const lp = LOG.mesh.position.clone(), ld = fwdFromYaw(LOG.mesh.rotation.y, V3());
  walk(L, lp.clone().addScaledVector(ld, -2.5), { speed: 1.2 });
  await walk(C, lp.clone().addScaledVector(ld, 2.5), { speed: 1.2 });
  await waitUntil(() => !L.walkTo, 5);
  // Chase sets the box on the log
  PROPS.box.visible = false; C.anim.setOverlay(null);
  const box = new GB().box(0.36, 0.26, 0.28, { color: 0xffffff }).mesh(MATS.cardboard); box.position.set(0.15, -1.2, 0.36); LOG.inner.add(box); PROPS.logBox = box;
  await handoffCarryPrompt();
  // 2.1 — lift: they hoist the log
  act(L, 'lift'); act(C, 'lift');
  await wait(0.6);
  LOG.carried = true; L.anim.setOverlay('carryLog', 8); C.anim.setOverlay('carryLog', 8);
  // the path direction is "forward": a leading Steadicam shot walking backwards ahead of them (35 mm)
  G.carryDir = V3(); const pathTo = V3(-1, 0, -103);
  DIR.skipping = false; DIR.skippable = false;
  PLAYER.carry = true; PLAYER.control = true; toState('free'); G.mode = 'play'; INPUT.weight = 0; INPUT.weightTarget = 1; INPUT.weightRate = 1;
  CHASE.ai = false;
  const mid = V3();
  CAM.shotFn((t, p, a) => { mid.copy(L.pos).lerp(C.pos, 0.42); const d = G.carryDir; p.copy(mid).addScaledVector(d, 7.6).add(V3(0, 1.9, 0)).addScaledVector(fwdFromYaw(Math.atan2(d.x, d.z) + PI / 2, _v[1]), 1.5); p.y = Math.max(p.y, groundHeight(p.x, p.z) + 1.5); a.copy(mid).add(V3(0, 1.05, 0)); }, { omega: 2.6, lens: 35, fStop: 4, handheld: 0.4 });
  CAM.focusOn(() => V3().copy(L.pos).lerp(C.pos, 0.5).add(V3(0, 1.3, 0)));
  prompt('move', 'Carry the log to the yard', { key: 'move', dur: 5 });
  // 2.2 — walk-and-talk
  later(2.5, () => startConvo([
    ['chase', 'Eight months. She hired me eight months ago. Do you know what she asked me in the interview?'],
    ['luka', 'No.'],
    ['chase', '“Can you hold a conversation and a phone at the same time?” And I said yes. And then I dropped the phone.'],
    ['wait', 1.2],
    ['chase', 'She hired me anyway.'],
    ['luka', 'She hired everyone anyway.'],
    ['chase', '…Is that a compliment?'],
    ['luka', 'It’s a fact.', 2.6],
    ['chase', 'What did she ask you? In your interview?'],
    ['wait', 2.0],
    ['luka', 'She didn’t. I came in to buy a charger.'],
    ['chase', 'And?'],
    ['luka', 'And I left with a lanyard.'],
  ]));
  let lastYaw = L.yaw, protestCd = 0;
  CARRY.on = true; CARRY.last = L.yaw;
  await waitUntil(() => { // the trees open onto the yard
    G.carryDir.copy(pathTo).sub(L.pos).setY(0).normalize();
    const turn = Math.abs(angleTo(lastYaw, L.yaw)) / Math.max(G.lastDt || 0.016, 1e-3); lastYaw = L.yaw; protestCd -= G.lastDt || 0.016;
    if (turn > 1.4 && protestCd <= 0 && !DLG.line) { protestCd = 9; bark('chase', 'Little warning before the turns?', { force: true }); }
    return L.pos.z > -110 && L.pos.x > -12;
  });
  // 2.3 — the yard reveal: the operator swings around behind them and cranes up (24 mm)
  stopConvo();
  cine({ carry: true }); PLAYER.carry = true;
  await BEATS.pyre_start(true);
};
async function handoffCarryPrompt() {
  // light interactive: prompt Lift
  G.mode = 'play'; PLAYER.control = false; INPUT.weightTarget = 1;
  CAM.shotFn(SHOT.track(ACTORS.luka, [-0.9, 1.7, -2.8], [0.4, 1.0, 3]), { omega: 2.4, lens: 30, fStop: 4, handheld: 0.3 });
  prompt('interact', 'Lift', { key: 'interact', sticky: true });
  await waitUntil(() => wasPressed('interact') || wasPressed('light') || DIR.skipping || G.flags.autoplay);
  promptHide('interact');
}
// the log rides between the two of them; Chase steers his end with a lag
const CARRY = { on: false, auto: false, dir: V3(0, 0, 1) };
function updateCarry(dt) {
  if (!LOG.carried) return;
  const L = ACTORS.luka, C = ACTORS.chase;
  if (!CARRY.auto) {
    // Chase follows Luka's end of the log, 4.8 m back
    const d = _v[1].copy(C.pos).sub(L.pos).setY(0); const len = d.length() || 1; d.divideScalar(len);
    const want = _v[2].copy(L.pos).addScaledVector(d, 4.8);
    const step = _v[3].copy(want).sub(C.pos).setY(0); const sl = step.length();
    C.speed = damp(C.speed, Math.min(1.5, sl * 2.5), 6, dt);
    if (sl > 0.02) { C.pos.addScaledVector(step.normalize(), Math.min(sl, C.speed * dt * 1.2 + sl * 0.02)); }
    C.yaw = dampAngle(C.yaw, yawTo(C.pos, L.pos) + 0.0, 6, dt);
    WORLD.resolve(C.pos, 0.35); C.pos.y = groundHeight(C.pos.x, C.pos.z);
  }
  const a = L.boneWorld('handR', _v[4]).lerp(L.boneWorld('handL', _v[5]), 0.5), b = C.boneWorld('handR', _v[6]).lerp(C.boneWorld('handL', _v[7]), 0.5);
  LOG.mesh.position.copy(a).lerp(b, 0.5); LOG.mesh.position.y -= 0.05;
  const dir = _v[8].copy(b).sub(a);
  LOG.mesh.rotation.set(0, Math.atan2(dir.x, dir.z), 0); LOG.mesh.rotateX(-Math.atan2(dir.y, Math.hypot(dir.x, dir.z)));
  LOG.inner.rotation.set(-PI / 2, 0, 0); LOG.mesh.scale.setScalar(0.92);
}

// ---------- BEAT 3 — Wi-Faye ----------
SETUPS.pyre_start = () => {
  setEnv('carry', 0);
  worldState({ tree: 'pyre', pyre: 'built', body: false, ward: true, axe: 'pyre', slate: 'post', rue: 'off', smiths: 'yard', zee: 'none', beanie: true, weapon: 'none', door: false, lights: () => lightsYard(false) });
  placeLog('pyre');
  place('luka', 'pyre_luka'); place('chase', 'pyre_chase');
  FIRE.candles = true;
};
BEATS.pyre_start = async (carrying) => {
  const L = ACTORS.luka, C = ACTORS.chase, LU = ACTORS.luke, ZA = ACTORS.zane, P = LOC.pyre, py = OBJ.pyreY;
  setCheckpoint('pyre_start');
  if (!carrying) { cine(); setEnv('carry', 0); }
  musicCue('wifaye', 3); setSpace('yard'); setEnv('dusk', 22); FIRE.candles = true;
  LU.listen = ZA.listen = C.listen = true; L.listen = false;
  // 3.1 — the yard: 24 mm crane, f/4
  const yardC = V3(4, 14, -84);
  CAM.shotFn((t, p, a) => { const L0 = L.pos; p.set(L0.x - 3 + Math.min(t, 7) * 0.4, L0.y + 2 + Math.min(7, t) * 0.75, L0.z - 6 - Math.min(t, 7) * 0.25); a.set(lerp(L0.x, P.x, smoothstep(0, 7, t)), lerp(L0.y + 1, py + 1, smoothstep(0, 7, t)), lerp(L0.z + 4, P.z, smoothstep(0, 7, t))); }, { omega: 1.8, lens: 24, lensDur: 3, fStop: 4, handheld: 0.25 });
  CAM.focusOn(() => V3(P.x, py + 1, P.z));
  if (carrying) {
    // they carry the log down to the pyre on their own
    // Chase keeps following his end of the log
    const pyreN = V3(P.x - 1.5, 0, P.z - 2.6);
    CARRY.auto = false; C.walkTo = null;
    walk(L, V3(P.x - 7, 0, P.z - 6).setY(groundHeight(P.x - 7, P.z - 6)), { speed: 1.25, timeout: 60 });
    await waitUntil(() => !L.walkTo, 60);
    await walk(L, pyreN.clone().setY(groundHeight(pyreN.x, pyreN.z)), { speed: 1.0, timeout: 30 });
  }
  // 3.2 — Luke and Zane. Orbit slowly left around the pyre, favouring each smith.
  look(LU, () => LOG.mesh.position); look(ZA, () => LOG.mesh.position);
  walk(LU, V3(P.x + 0.6, py, P.z - 2.6), { speed: 1 }); walk(ZA, V3(P.x + 0.6, py, P.z + 2.6), { speed: 1 });
  CAM.shotFn(SHOT.orbit(() => V3(P.x - 0.4, py + 1.25, P.z), 76, 104, 7.6, 0.55, 22, EASE.inOutSine, -0.1), { omega: 1.6, lens: 35, fStop: 3.2, handheld: 0.3 });
  CAM.pull(head('luke'), 1.2);
  await wait(0.6);
  nameCard('luke');
  await say('luke', 'Watch the corner. WATCH THE CORNER.');
  CAM.pull(head('zane'), 0.6);
  nameCard('zane');
  await say('zane', 'I’m watching the corner. I am always watching the corner. One of us has to.');
  // the log drops into place
  LOG.carried = false; CARRY.auto = false; L.anim.setOverlay(null); C.anim.setOverlay(null);
  await tween(k => { placeLog('pyre'); LOG.mesh.position.y += (1 - k) * 0.5; }, 0, 1, 0.5, EASE.inQuad);
  sfx('thump', LOG.mesh.position, 0.7); CAM.shake(0.08);
  if (PROPS.logBox) PROPS.logBox.visible = false;
  walk(L, 'pyre_luka', { speed: 1.1 }); walk(C, 'pyre_chase', { speed: 1.1 });
  act(LU, 'slap'); await wait(0.4); sfx('wood', OBJ.pyre.top, 0.8);
  CAM.pull(head('luke'), 0.6);
  await say('luke', 'Built it off the old display table. Six device bays. She’d have liked that.');
  await wait(0.5);
  await say('luke', 'Room for everyone.');
  CAM.pull(head('zane'), 0.6);
  await say('zane', 'I sanitised it.');
  CAM.pull(head('luke'), 0.5); await say('luke', 'It’s a pyre, Zane.');
  CAM.pull(head('zane'), 0.5); await say('zane', 'And now it’s a clean pyre.');
  CAM.pull(head('chase'), 0.6);
  await say('chase', '(nervous, filling the silence) So how long have you two been brothers?');
  look(LU, 'chase'); look(ZA, 'chase');
  showSub('luke', 'We’re not brothers.'); babble('luke', 'We’re not brothers.', 1.4, LU); babble('zane', 'We’re not brothers.', 1.4, ZA);
  $('subLine').innerHTML = `<span class="who" style="color:var(--c-luke)">LUKE</span> <span class="who" style="color:var(--c-zane)">&amp; ZANE:</span> We’re not brothers.`;
  await wait(1.7);
  CAM.pull(head('luke'), 0.4); await say('luke', 'Business partners.');
  CAM.pull(head('zane'), 0.4); await say('zane', '*Estranged* business partners.');
  CAM.pull(head('luke'), 0.4); await say('luke', 'We share a cart.');
  CAM.pull(head('zane'), 0.4); await say('zane', 'Against my will.');
  CAM.pull(head('luka'), 0.5);
  await say('luka', 'Enough.');
  hideSub(); await wait(1.4); // silence; everyone straightens
  // 3.3 — Faye. Luka walks into the longhouse; the operator waits outside, respectfully, holding on the doorway.
  look(LU, null); look(ZA, null); look(C, 'luka');
  walk(LU, 'pyre_luke', { speed: 0.9 }); walk(ZA, 'pyre_zane', { speed: 0.9 });
  const H = OBJ.house;
  walk(L, V3(H.X1 + 2.0, H.G, H.CZ), { speed: 1.25 });
  CAM.shotFn((t, p, a) => { p.set(lerp(9.2, 8.4, smoothstep(0, 9, t)), py + 1.55, lerp(-84.8, -85.6, smoothstep(0, 9, t))); a.set(H.X1, H.FY + 1.2, H.CZ); }, { omega: 1.6, lens: 50, fStop: 2.0, handheld: 0.3 });
  CAM.pull(() => V3(H.X1, H.FY + 1.2, H.CZ), 2);
  await waitUntil(() => !L.walkTo, 20);
  await tween(v => OBJ.door.rotation.y = -v * 1.5, 0, 1, 1.2); OBJ.doorCol.off = true; sfx('creak', OBJ.door.position, 0.6);
  FLOORS.forEach(f => f.active = true);
  await walk(L, 'door_in', { speed: 1.1, noGround: false });
  L.setVisible(false);
  await wait(3.2);
  // he comes back out carrying Faye's body, wrapped in a shroud stitched from old navy and teal staff fleeces
  L.setVisible(true); place(L, MARKS.door_in.pos.clone(), PI / 2);
  OBJ.faye.visible = true; L.bones.chest.add(OBJ.faye); OBJ.faye.position.set(0, 0.0, 0.32); OBJ.faye.rotation.set(0, PI / 2, 0); OBJ.faye.scale.setScalar(0.95);
  L.anim.setOverlay('carryBody', 20); L.anim.overlayW = 1;
  walk(L, V3(H.X1 + 2.0, H.G, H.CZ), { speed: 0.8 });
  await wait(2.0);
  await waitUntil(() => !L.walkTo, 10);
  musicCue('wifaye', 1);
  // low tracking shot alongside his slow walk to the pyre (35 mm, f/2)
  walk(L, V3(P.x - 1.8, py, P.z), { speed: 0.75, timeout: 40 });
  CAM.shotFn(SHOT.track(L, [2.1, 0.95, 2.3], [0.0, 1.25, 0.3]), { omega: 2.4, lens: 35, fStop: 2.0, handheld: 0.4 });
  CAM.focusOn(head('luka'));
  // wordless: Chase pulls off his beanie; Luke pushes his loupe headband off and holds it; Zane folds his cloth away
  await wait(3.0);
  act(C, 'beanie_off'); later(0.8, () => { C.props.beanie.visible = false; });
  await wait(2.0);
  if (LU.props.loupe) LU.props.loupe.visible = false; act(LU, 'beanie_off');
  await wait(2.0);
  act(ZA, 'place', { mask: 'arms' }); later(0.7, () => { if (ZA.props.cloth) ZA.props.cloth.visible = false; });
  await waitUntil(() => !L.walkTo, 30);
  // Luka lays Faye on the pyre
  await turnTo(L, PI / 2, 3);
  CAM.shotFn((t, p, a) => { p.set(P.x - 4.6, py + 1.7, P.z + 2.6); a.set(P.x - 0.2, py + 1.3, P.z); }, { omega: 1.8, lens: 35, fStop: 2.4, handheld: 0.3 });
  act(L, 'lay_body'); L.anim.setOverlay(null);
  await wait(1.2);
  const fw = OBJ.faye.getWorldPosition(V3()); R.scene.add(OBJ.faye); OBJ.faye.position.copy(fw); OBJ.faye.rotation.set(0, 0, 0);
  await tween(k => { OBJ.faye.position.lerpVectors(fw, OBJ.pyre.top.clone().add(V3(-0.1, 0.18, 0)), k); OBJ.faye.rotation.y = k * PI / 2; }, 0, 1, 1.0);
  OBJ.faye.scale.setScalar(1);
  await wait(1.0);
  walk(L, 'pyre_luka', { speed: 0.9 });
  // Chase places the store's farewell card on her chest; the focal plane catches it just long enough to read
  walk(C, V3(P.x - 1.0, py, P.z + 0.6), { speed: 0.9 });
  await waitUntil(() => !C.walkTo, 8);
  await turnTo(C, PI / 2, 4);
  act(C, 'place'); await wait(0.7); OBJ.card.visible = true;
  const cardP = () => OBJ.card.getWorldPosition(V3());
  CAM.shotFn((t, p, a) => { const c = cardP(); p.set(c.x - 0.75, c.y + 0.75, c.z + 0.35 - t * 0.02); a.copy(c); }, { omega: 2.2, lens: 50, fStop: 2.2, handheld: 0.2 });
  CAM.pull(cardP, 1.2);
  await wait(3.6);
  walk(C, 'pyre_chase', { speed: 0.8 });
  await wait(1.2);
  // 3.4 — the call. A cheerful, generic ringtone — horribly loud in the silence.
  RUE.visible = true; setRueMode('ringing');
  const slate = RUE.slate, slateP = () => slate.userData.tablet.getWorldPosition(V3()), slateN = () => slate.userData.tablet.getWorldDirection(V3()).setY(0).normalize();
  sfx('ringtone', slate.position, 1.1); later(1.15, () => sfx('ringtone', slate.position, 1.1)); later(2.3, () => sfx('ringtone', slate.position, 1.1));
  look(L, 'chase'); look(LU, 'chase'); look(ZA, 'chase');
  CAM.shotFn((t, p, a) => { p.set(P.x - 5.6, py + 1.6, P.z + 1.2); a.copy(C.headWorld(_v[1])); }, { omega: 3.6, lens: 35, fStop: 2.8, handheld: 0.35 });
  CAM.pull(head('chase'), 0.4);
  await wait(1.2);
  await say('chase', 'Sorry — sorry, that’s — he said he’d call.');
  await walk(C, MARKS.slate_post.pos.clone().add(V3(0.0, 0, -0.75)).setY(groundHeight(MARKS.slate_post.pos.x, MARKS.slate_post.pos.z - 0.75)), { speed: 1.3, yaw: 0 });
  act(C, 'tap'); await wait(0.35); sfx('ui', slate.position, 0.6);
  setRueMode('connecting');
  // over Chase's shoulder, 50 mm: the slate sharp, the pyre soft behind it
  CAM.shotFn((t, p, a) => { const s = slateP(); localToWorld(C, [0.55, 1.72, -1.25], p); a.copy(s); }, { omega: 3.2, lens: 50, fStop: 2.0, handheld: 0.3 });
  CAM.pull(slateP, 0.6);
  RUE.actor.anim.setOverlay(null);
  await wait(1.4);
  await say('rue', '— can you hear me? Am I on? There’s a little man with a line through him —', { dur: 4.2 });
  setRueMode('live');
  await say('rue', 'Ah. There you are. Luka. Chase. Lads.');
  await say('rue', 'For the record, I didn’t make JARVIS.');
  await say('chase', '…Nobody said —', { cutAt: 0.9 });
  await say('rue', 'Force of habit. Every call I’ve ever been on starts with someone blaming me for JARVIS.');
  // Chase turns the slate toward the pyre. Rue sees it. His face changes.
  await tween(v => slate.rotation.y = lerp(MARKS.slate_post.yaw + 0.3, MARKS.slate_post.yaw + 0.3 - 1.1, v), 0, 1, 1.0);
  const slateFront = () => CAM.shotFn((t, p, a) => { const s = slateP(), n = slateN(); p.copy(s).addScaledVector(n, 1.05).add(V3(-n.z * 0.3, 0.1, n.x * 0.3)); a.copy(s); }, { omega: 2.2, lens: 50, fStop: 2.4, handheld: 0.25 });
  slateFront(); CAM.pull(slateP, 0.8);
  RUE.actor.expr = null; RUE.actor.mouthOverride = null;
  nameCard('rue');
  await wait(1.0);
  await say('rue', 'Ah. Ah, it’s lovely. She’d hate it.');
  await wait(0.7);
  await say('rue', 'It’s lovely.');
  look(L, slateP, 1); turnTo(L, yawTo(L.pos, slate.position), 3);
  CAM.shotFn(SHOT.face(L, { yaw: 0.45, dist: 2.4, avoid: [C, LU, ZA] }), { omega: 2.2, lens: 50, fStop: 2.0, handheld: 0.3 });
  CAM.pull(head('luka'), 0.8);
  await wait(0.5);
  await say('luka', 'Rue.');
  slateFront(); CAM.pull(slateP, 0.8);
  await say('rue', 'Head Office wouldn’t let me come down. Said a CEO hasn’t set foot in a store in thirty years, why start now. So I’m here the only way they allow. On a call. Which, as you know, I can’t hang up.', { dur: 9.5 });
  await say('chase', '(whispering to Luka) Why can’t he hang up?');
  await say('luka', 'Nobody knows.');
  await say('rue', 'I can hear you, Chase.');
  // Chase props the slate on the corner of the display table, facing everyone
  walk(C, V3(P.x - 1.4, py, P.z + 1.4), { speed: 1.1 }); await wait(1.2);
  worldState({ slate: 'table' }); turnTo(L, PI / 2, 2);
  await walk(C, 'pyre_chase', { speed: 1.1 });
  await eulogy();
};

// 3.5 — the eulogy: one slow continuous drift, letting Rue's words land on whoever they're about
async function eulogy() {
  const L = ACTORS.luka, C = ACTORS.chase, LU = ACTORS.luke, ZA = ACTORS.zane, P = LOC.pyre, py = OBJ.pyreY;
  const slate = RUE.slate, slateP = () => slate.userData.tablet.getWorldPosition(V3());
  for (const a of [L, C, LU, ZA]) look(a, slateP, 0.8);
  CAM.focusOn(slateP);
  const s0 = slateP();
  // on the slate, 50 mm. Begin a slow pull back.
  CAM.shotFn((t, p, a) => { p.copy(s0).add(V3(-0.75 - t * 0.35, 0.15 + t * 0.06, -0.15 + t * 0.12)); a.copy(s0).lerp(V3(P.x - 1.5, py + 1.3, P.z), smoothstep(2, 10, t)); }, { omega: 1.6, lens: 50, fStop: 2.4, handheld: 0.25 });
  await say('rue', 'I’ve given a lot of speeches. Launches. Results. Apologies — mostly apologies.', { dur: 5 });
  await say('rue', 'This is the first one I’ve wanted to get right.', { dur: 3.4 });
  CAM.pull(head('chase'), 2);
  await say('rue', 'Faye ran Store Zero-Zero-One for longer than any of you have been alive.', { dur: 4.2 });
  // drift to Chase. The wind has flipped his lanyard badge: for ~2 s the player can read the back, in Faye's handwriting.
  const card = () => { const b = C.props.badge; return b.children[b.children.length - 1]; };
  const badgeP = () => card().getWorldPosition(V3());
  CAM.shotFn((t, p, a) => { const b = badgeP(), n = fwdFromYaw(C.yaw, _v[2]); p.copy(b).addScaledVector(n, 0.8).add(V3(-n.z * 0.12, 0.06, n.x * 0.12)); a.copy(b).lerp(C.headWorld(_v[1]), smoothstep(2.6, 5, t) * 0.8); }, { omega: 1.5, lens: 50, fStop: 2.8, handheld: 0.2 });
  const flip = tween(v => C.props.badge.rotation.y = v, 0, PI, 0.5);
  await say('rue', 'Well — longer than Chase has been employed, which in retail is the same thing.', { dur: 4.4 });
  C.expr = 2; later(1.2, () => { C.expr = null; });
  CAM.pull(badgeP, 0.8);
  await wait(2.0);
  act(C, 'place', { mask: 'armR' }); await tween(v => C.props.badge.rotation.y = v, PI, 0, 0.4);
  // drift to Luke, who wipes one eye with a blue glove and pretends it's snow. Zane, without looking, offers his cloth.
  CAM.shotFn((t, p, a) => { const m = LU.headWorld(_v[1]).lerp(ZA.headWorld(_v[2]), 0.45); p.copy(m).add(V3(1.85 + t * 0.03, 0.02, -1.4 + t * 0.02)); a.copy(m).y -= 0.12; }, { omega: 1.4, lens: 50, fStop: 2.4, handheld: 0.25 });
  CAM.pull(head('luke'), 1.5);
  const p2 = say('rue', 'Everyone called her Wi-Faye. Because it didn’t matter where you stood in that store — the stockroom, the counter, the car park, crying on your lunch break — you were connected to her. Full bars.', { dur: 10.5 });
  await wait(3.5); act(LU, 'wipe_eye');
  await wait(2.2); if (ZA.props.cloth) ZA.props.cloth.visible = true; act(ZA, 'hold_out_hand', { mask: 'armR' });
  await wait(1.5); if (ZA.props.cloth) ZA.props.cloth.visible = false; PROPS.lukeCloth.visible = true; ZA.anim.stop(0.5);
  await p2;
  // arc out past the mourners to the cliff edge, 24 mm: the frozen bay, the floes, the Mountain's blinking towers
  CAM.shotFn((t, p, a) => { p.set(lerp(P.x + 2, P.x + 7.5, smoothstep(0, 9, t)), py + 2.3 + t * 0.08, lerp(P.z + 4, P.z + 7, smoothstep(0, 9, t))); a.set(lerp(P.x + 20, P.x + 160, smoothstep(0, 9, t)), py + lerp(0, -8, smoothstep(0, 9, t)), lerp(P.z + 30, P.z + 260, smoothstep(0, 9, t))); }, { omega: 1.2, lens: 24, fStop: 5.6, handheld: 0.2 });
  CAM.focusOverride = null; CAM.focusOn(() => V3(P.x + 200, 0, P.z + 200));
  await say('rue', 'You all know the world’s gone strange. The Fimbul-Winter Sale’s been “ending soon” for three years. Snow on the red cliffs. The bay frozen halfway to the islands.', { dur: 9 });
  // slow push toward the far shore: in the fog, very far away, a long line of still figures
  CAM.shotFn((t, p, a) => { p.set(P.x + 7.5 + t * 0.15, py + 2.8, P.z + 6.5 - t * 0.35); a.set(258, 1.2, -88); }, { omega: 1.1, lens: 110, lensDur: 9, fStop: 5.6, handheld: 0.15 });
  CAM.focusOn(() => V3(258, 1, -88));
  await say('rue', 'And Helpdesk… Helpdesk is on hold. The dead can’t get through. They wander out there in the snow, waiting for a number that’s never called. We call them the Churned.', { dur: 10 });
  // pan along the copper wire of the ward ring; the runes glow; the hum is audible
  const W = OBJ.wardPosts, wi = W.reduce((b, w, i) => (dist2D(w, LOC.pyre) < dist2D(W[b], LOC.pyre) ? i : b), 0);
  const wpt = k => { const n = W.length, i0 = Math.floor(k) % n, i1 = (i0 + 1) % n, f = k - Math.floor(k); return V3(lerp(W[i0].x, W[i1].x, f), lerp(W[i0].top, W[i1].top, f), lerp(W[i0].z, W[i1].z, f)); };
  CAM.shotFn((t, p, a) => { const k = wi + t * 0.28, w = wpt(k), c = LOC.ward; const inward = V3(c.x - w.x, 0, c.z - w.z).normalize(); p.copy(w).addScaledVector(inward, 3.2).add(V3(0, 0.3, 0)); a.copy(wpt(k + 0.35)); }, { omega: 1.4, lens: 35, lensDur: 2, fStop: 2.8, handheld: 0.2 });
  CAM.focusOn(() => wpt(wi + CAM.shotT * 0.28 + 0.35));
  if (AUDIO.ok) AUDIO.humGain.gain.setTargetAtTime(1.2, AUDIO.ctx.currentTime, 0.5);
  await say('rue', 'Through all of it, this little store stayed hidden. Head Office never found it. Not the Auditors. Not the ravens. That was Faye.', { dur: 8.2 });
  await say('rue', 'She built a ward around this place — Faraday, she called it — and nothing from above could hear a word we said.', { dur: 7 });
  // settle with the slate soft in the foreground, Luka sharp behind it
  const sp = slateP();
  CAM.shotFn((t, p, a) => { const lh = L.headWorld(_v[1]); const dir = _v[2].copy(sp).sub(lh).setY(0).normalize(); p.copy(sp).addScaledVector(dir, 0.6).add(V3(0, 0.25, 0)).addScaledVector(fwdFromYaw(Math.atan2(dir.x, dir.z) + PI / 2, _v[3]), 0.25); a.copy(lh); }, { omega: 1.3, lens: 50, fStop: 2.0, handheld: 0.2 });
  CAM.pull(head('luka'), 2.2);
  for (const a of [C, LU, ZA]) look(a, slateP, 0.6);
  await say('rue', 'She asked me for one thing, in the end. Her ashes, carried to the highest tower in all the Nine Bands, and scattered from the very top.', { dur: 8.4 });
  await say('rue', 'Not by me. Not by Head Office.', { dur: 2.6 });
  await wait(0.8);
  look(C, 'luka', 1); look(L, null);
  await say('rue', 'By you two.', { dur: 2 });
  await wait(1.2);
  await say('luka', 'She said that.');
  await wait(0.6);
  await say('rue', 'She said, “Luka will say no. Tell him I said yes.”', { dur: 4.6 });
  // rationed silence (3 s). A very slow creep zoom on Luka, 50 → 60 mm. His jaw works.
  CAM.lensTo(60, 4.5, EASE.inOutSine);
  L.mouthOverride = 1; later(1.2, () => { L.mouthOverride = 0; }); later(1.8, () => { L.mouthOverride = 1; }); later(2.4, () => { L.mouthOverride = null; });
  await wait(3.2);
  await lightPyre();
}
// 3.6 — lighting the pyre
async function lightPyre() {
  const L = ACTORS.luka, C = ACTORS.chase, P = LOC.pyre, py = OBJ.pyreY;
  act(L, 'hold_out_hand');
  await wait(1.2);
  await say('chase', 'I’ve got a lighter.');
  PROPS.lighter.visible = true; act(C, 'hold_out_hand'); await wait(0.6);
  sfx('jingle', C.pos, 0.9);
  look(ACTORS.luke, 'chase'); look(ACTORS.zane, 'chase'); look(L, 'chase', 0.7);
  await wait(1.3);
  await say('chase', '…It came with a case.');
  // 85 mm, f/1.8, close on Luka as he takes it. The corner of his mouth moves — the only almost-smile — then it's gone.
  CAM.shotFn((t, p, a) => { const h = L.headWorld(_v[1]); p.copy(h).addScaledVector(fwdFromYaw(L.yaw + 0.7, _v[2]), 1.6).add(V3(0, -0.04, 0)); a.copy(h).add(V3(0, -0.02, 0)); }, { omega: 2.4, lens: 85, fStop: 1.8, handheld: 0.25 });
  CAM.pull(eyes('luka'), 0.6);
  await wait(0.5);
  PROPS.lighter.visible = false; PROPS.lighterL.visible = true; C.anim.stop(0.4); L.anim.stop(0.4);
  await wait(0.5);
  L.exprRow = 2; L.mouthOverride = 1; await wait(0.9); L.exprRow = null; L.mouthOverride = null;
  await wait(0.6);
  // he lights the kindling
  await walk(L, V3(P.x - 1.25, py, P.z - 0.1), { speed: 0.8, yaw: PI / 2 });
  CAM.shotFn((t, p, a) => { p.set(P.x - 4.0 + t * 0.05, py + 1.2, P.z + 2.5); a.set(P.x - 0.6, py + 0.6, P.z); }, { omega: 2.2, lens: 35, fStop: 2.4, handheld: 0.3 });
  CAM.pull(() => V3(P.x - 0.8, py + 0.5, P.z), 0.8);
  act(L, 'place'); await wait(0.8);
  sfx('crack', OBJ.pyre.top, 0.4); fxBurst('sparks', V3(P.x - 0.7, py + 0.5, P.z), { r: 3, g: 1.5, b: 0.3, n: 16 });
  PROPS.lighterL.visible = false;
  FIRE.on = true; FIRE.mode = 'pyre'; FIRE.pos.set(P.x, py + 1.0, P.z); FIRE.target = 1; FIRE.level = 0.05;
  musicCue('pyre', 1.5);
  await walk(L, 'pyre_luka', { speed: 0.6, backwards: true });
  CAM.shotFn((t, p, a) => { p.set(P.x - 6.2 + t * 0.1, py + 1.5, P.z + 3.4 - t * 0.05); a.set(P.x - 1.6, py + 1.4, P.z + 0.4); }, { omega: 1.6, lens: 35, fStop: 2.0, handheld: 0.3 });
  CAM.pull(head('luka'), 1);
  await tween(k => scorchPyre(0.2 * k), 0, 1, 6);
  // 3.7 — the World Cable. The camera cranes up with the smoke column (24 → 18 mm).
  CAM.shotFn((t, p, a) => { const k = smoothstep(0, 9, t); p.set(P.x - 4 - k * 6, py + 2 + k * 26, P.z + 4 + k * 8); a.set(lerp(P.x, 330, smoothstep(2, 10, t)), lerp(py + 4, 20, smoothstep(2, 10, t)), lerp(P.z, -40, smoothstep(2, 10, t))); }, { omega: 1.3, lens: 24, fStop: 5.6, handheld: 0.2 });
  CAM.lensTo(18, 9);
  CAM.focusOn(() => V3(330, 10, -40));
  await wait(6.0);
  musicCue('cable', 2);
  CABLE.active = true;
  sfx('crack', V3(330, 0, -40), 1);
  tween(v => CABLE.rise = v, 0, 1, 7, EASE.outCubic);
  for (let i = 0; i < 8; i++) later(i * 0.7, () => fxBurst('ice', V3(cableX(-40 + (i - 4) * 50), 0.5, -40 + (i - 4) * 50), { n: 40, scale: 4 }));
  await wait(2.5);
  // settle at the cliff edge on a longer lens as it lifts its head toward the smoke
  CAM.shotFn((t, p, a) => { p.set(P.x + 4 + t * 0.15, py + 3.4, P.z + 2 - t * 0.1); a.copy(cableWorldHead()).lerp(_v[1].set(cableX(-18), 38, -18), 0.55); }, { omega: 0.9, lens: 40, lensDur: 5, fStop: 5.6, handheld: 0.15 });
  CAM.focusOn(() => cableWorldHead());
  sfx('cableCall', V3(330, 20, -40), 1);
  await wait(1.8);
  await say('chase', 'Is that — is that the World Cable?', { os: true });
  await say('rue', 'Undersea fibre. Older than the Bands, some say. Carries every word anyone’s ever said across the water.', { os: true, dur: 6 });
  await say('luka', 'He doesn’t surface.', { os: true });
  await say('rue', 'He liked her. Everyone did.', { os: true });
  // the Cable lowers its head in a slow bow, and sinks
  await tween(v => CABLE.bow = v, 0, 1, 3.5);
  sfx('cableCall', V3(330, 20, -40), 0.7);
  tween(v => CABLE.rise = v, 1, 0, 9, EASE.inOutSine).then(() => { CABLE.active = false; CABLE.bow = 0; });
  await wait(3.5);
  await zeeAtTreeline();
}
// 3.8 — Zee at the treeline: a 135 mm long-lens shot through pine branches
async function zeeAtTreeline() {
  const C = ACTORS.chase, L = ACTORS.luka, Z = ACTORS.zee, W = OBJ.wombat, P = LOC.pyre, py = OBJ.pyreY;
  const zp = V3(-21.5, 0, -66.5); zp.y = groundHeight(zp.x, zp.z);
  Z.setVisible(true); place(Z, zp, yawTo(zp, C.pos)); Z.lookAt(head('chase'), 1);
  W.root.visible = true; W.pos.copy(zp).add(V3(-2.6, 0, 1.2)); W.pos.y = groundHeight(W.pos.x, W.pos.z); W.yaw = 1.2; W.lie = 0; W.walkTo = null;
  look(C, () => Z.headWorld(V3()), 1);
  // the camera sits in the trees beyond her flank; Chase is soft in the background, staring back
  const camP = zp.clone().add(V3(-11, 1.9, 9.5));
  const unclear = clearSightline([[camP, zp.clone().lerp(C.pos, 0.35)], [camP, L.pos]], 1.6);
  // a few soft boughs cross the right edge of frame, a few metres off the lens
  const look0 = V3().subVectors(zp, camP).normalize(), side0 = V3(-look0.z, 0, look0.x);
  PROPS.boughs.visible = true; PROPS.boughs.scale.setScalar(0.4); PROPS.boughs.position.copy(camP).addScaledVector(look0, 3.4).addScaledVector(side0, 0.85).add(V3(0, -0.12, 0)); PROPS.boughs.lookAt(zp);
  CAM.shotFn((t, p, a) => { const k = smoothstep(0, 4, t); p.copy(camP).add(V3(0, 18 * (1 - k), 0)); a.copy(zp).add(V3(0, 1.6 + 6 * (1 - k), 0)); }, { omega: 1.5, lens: 135, lensDur: 3.6, fStop: 2.8, handheld: 0.15 });
  CAM.focusOn(() => PROPS.boughs.position.clone());
  await wait(4.2);
  CAM.pull(head('zee'), 1.6);
  await wait(1.2);
  nameCard('zee', '???');
  act(Z, 'finger_lips');
  await wait(2.2);
  CAM.pull(head('chase'), 0.9); await wait(1.0); CAM.pull(head('zee'), 0.6);
  say('chase', 'Luka — there’s someone in the —', { cutAt: 0.85 });
  await wait(1.4);
  // whip pan to Luka turning, then back to the treeline. She's gone.
  CAM.shotFn((t, p, a) => { p.copy(camP); a.copy(L.headWorld(_v[1])); }, { omega: 9, lens: 85, lensDur: 0.3, fStop: 2.8, handheld: 0.5 });
  CAM.pull(head('luka'), 0.3);
  act(L, 'flinch'); look(L, () => zp.clone().add(V3(0, 1.6, 0)), 1);
  await wait(0.9);
  Z.setVisible(false); W.root.visible = false; Z.anim.stop(0);
  PROPS.tracks.forEach((m, i) => { m.visible = true; m.material.opacity = 0.4; m.position.set(zp.x - 2.6 - i * 0.9, groundHeight(zp.x - 2.6 - i * 0.9, zp.z + 1.2 + (i % 2) * 0.7) + 0.03, zp.z + 1.2 + (i % 2) * 0.7); });
  tween(v => PROPS.tracks.forEach(m => m.material.opacity = v), 0.4, 0, 9);
  CAM.shotFn((t, p, a) => { p.copy(camP); a.copy(zp).add(V3(0, 1.0, 0)); }, { omega: 9, lens: 85, fStop: 2.8, handheld: 0.4 });
  CAM.pull(() => zp.clone().add(V3(0, 0.5, 0)), 0.4);
  await wait(1.4);
  await say('luka', 'There’s no one.', { look: false });
  await say('chase', 'There was a woman. And a… very large wombat.');
  await say('luka', 'Watch the fire.');
  PROPS.boughs.visible = false; unclear();
  look(C, null); look(L, null);
  await smokeWipe();
}
// 3.9 — smoke wipe (time skip): dusk → night, fire → embers
async function smokeWipe() {
  const P = LOC.pyre, py = OBJ.pyreY;
  CAM.shotFn((t, p, a) => { const k = smoothstep(0, 5, t); p.set(P.x - 3 + k * 2, py + 3 + k * 12, P.z + 3 - k * 2); a.set(P.x, py + 6 + k * 16, P.z); }, { omega: 1.4, lens: 28, fStop: 4, handheld: 0.2 });
  CAM.focusOn(() => CAM.final.aim);
  musicCue('silence', 4);
  for (let i = 0; i < 40; i++) fxBurst('smoke', V3(P.x + (frand() - 0.5) * 2, py + 2 + i * 0.4, P.z + (frand() - 0.5) * 2), { scale: 1.6, a: 0.6 });
  await wait(2.5);
  await wipe(1, 1.2, 3.0, 1.6, async () => {
    // behind the wipe: night, embers, Luke and Zane gone (their lantern far down the path), aurora, Rue's camera off
    setEnv('night', 0); setSpace('yard');
    worldState({ pyre: 'embers', body: false, smiths: 'none', slate: 'table', rue: 'cameraOff' });
    lightsYard(true);
    FIRE.candles = false;
    setLight(3, { pos: V3(2, 15.5, -50), color: 0xffc070, intensity: 6, flicker: 0.2, dist: 18 });
    tween(v => ENV.lights[3].position.set(lerp(2, -6, v), 15.5, lerp(-50, -20, v)), 0, 1, 40, EASE.linear).catch(() => { });
    place('chase', 'stump'); ACTORS.chase.anim.setOverlay('sitHug', 50); ACTORS.chase.anim.overlayW = 1;
    place('luka', 'embers_luka'); ACTORS.luka.anim.setOverlay('kneel', 50); ACTORS.luka.anim.overlayW = 1;
    PROPS.lukeCloth.visible = false;
    CAM.shotFn((t, p, a) => { const k = smoothstep(0, 5, t); p.set(P.x - 2 - k * 1.5, py + 12 - k * 10.6, P.z + 1 + k * 1.4); a.set(P.x - 1.2, py + 6 - k * 5.6, P.z + 0.3); }, { omega: 1.4, lens: 50, lensDur: 5, fStop: 2.0, handheld: 0.2 });
    musicCue('embers', 4);
  });
  setCheckpoint('pyre_embers');
  await BEATS.pyre_embers(true);
}
SETUPS.pyre_embers = () => {
  setEnv('night', 0); setSpace('yard');
  worldState({ tree: 'pyre', pyre: 'embers', body: false, ward: true, axe: 'pyre', slate: 'table', rue: 'cameraOff', smiths: 'none', zee: 'none', beanie: false, weapon: 'none', door: false, lights: () => lightsYard(true) });
  placeLog('pyre'); LOG.mesh.visible = false;
  place('chase', 'stump'); ACTORS.chase.anim.setOverlay('sitHug', 50); ACTORS.chase.anim.overlayW = 1;
  place('luka', 'embers_luka'); ACTORS.luka.anim.setOverlay('kneel', 50); ACTORS.luka.anim.overlayW = 1;
};
BEATS.pyre_embers = async (fromWipe) => {
  const L = ACTORS.luka, C = ACTORS.chase, P = LOC.pyre, py = OBJ.pyreY;
  if (!fromWipe) { cine(); musicCue('embers', 2); }
  LOG.mesh.visible = false;
  // 3.10 — the ashes: low, 50 mm, f/2, focused on Luka's hands; ember glow lights him from below
  const hands = () => L.boneWorld('handL', V3()).lerp(L.boneWorld('handR', _v[1]), 0.5);
  CAM.shotFn((t, p, a) => { const h = hands(); p.copy(L.pos).addScaledVector(fwdFromYaw(L.yaw + 0.85, _v[2]), 1.85).add(V3(0, 0.8, 0)); a.copy(h); }, { omega: 2, lens: 50, fStop: 2.0, handheld: 0.25 });
  CAM.pull(hands, 1.2);
  PROPS.bag.visible = true; PROPS.ash.scale.y = 0.05;
  act(L, 'gather');
  await tween(v => PROPS.ash.scale.y = v, 0.05, 1, 2.4);
  await wait(0.4);
  sfx('ui', L.pos, 0.4);
  // the ticket, in Zane's neat handwriting, fills the frame for a moment
  const tk = () => PROPS.ticket.getWorldPosition(V3());
  CAM.shotFn((t, p, a) => { const c = tk(); p.copy(c).add(V3(0, 0.05, 0)).addScaledVector(fwdFromYaw(L.yaw, _v[3]), 0.42); a.copy(c); }, { omega: 2.4, lens: 85, fStop: 2.8, handheld: 0.15 });
  CAM.pull(tk, 0.8);
  await wait(3.8);
  act(L, 'hand_to_satchel'); await wait(0.8); PROPS.bag.visible = false;
  L.anim.setOverlay(null, 2);
  await wait(0.6);
  // 3.11 — the tune. Chase, on the chopping stump, hums the four-note motif without thinking. Luka freezes mid-motion.
  walk(L, V3(C.pos.x + 0.75, 0, C.pos.z + 0.55).setY(groundHeight(C.pos.x + 0.75, C.pos.z + 0.55)), { speed: 0.7, yaw: C.yaw - 0.2 });
  CAM.shotFn(SHOT.two(C, L, { from: LOC.pyre, swing: 0.3, drift: 0.01, fill: 0.95, min: 3, dy: -0.15, ay: -0.25 }), { omega: 1.6, lens: 35, fStop: 2.4, handheld: 0.2 });
  CAM.pull(head('chase'), 1);
  await wait(2.6);
  const hd = humMotif(C); C.mouthOverride = 1; later(hd, () => { C.mouthOverride = null; });
  await wait(1.0);
  L.walkTo = null; L.speed = 0; L.anim.speed = 0;
  await wait(Math.max(0.5, hd - 0.8));
  look(L, 'chase', 0.5);
  CAM.shotFn(SHOT.face(L, { yaw: -0.5, dist: 2.3, toward: C, k: 0.15, avoid: [C] }), { omega: 2.2, lens: 50, fStop: 2.0, handheld: 0.2 });
  CAM.pull(head('luka'), 0.9);
  await say('luka', 'Where did you learn that.');
  look(C, 'luka');
  CAM.shotFn(SHOT.face(C, { yaw: 0.45, dist: 2.1, dy: 0.1, toward: L, k: 0.15, avoid: [L] }), { omega: 2.2, lens: 50, fStop: 2.0, handheld: 0.2 });
  CAM.pull(head('chase'), 0.6);
  await say('chase', 'Faye. She hummed it whenever the system was down.');
  await wait(0.6);
  await say('chase', 'So, always.');
  CAM.shotFn(SHOT.face(L, { yaw: -0.4, dist: 2.2, push: 0.05, toward: C, k: 0.1, avoid: [C] }), { omega: 1.8, lens: 50, fStop: 2.0, handheld: 0.2 });
  CAM.pull(head('luka'), 0.8);
  await say('luka', '(quiet) She hummed it at home too.', { slow: 1.2 });
  await wait(2.2); // the most Luka has ever said about himself
  look(C, () => FIRE.pos);
  // 3.12 — the hand
  await walk(L, V3(C.pos.x + 0.62, 0, C.pos.z + 0.22).setY(groundHeight(C.pos.x + 0.62, C.pos.z + 0.22)), { speed: 0.5, yaw: C.yaw + 0.25 });
  CAM.shotFn(SHOT.track(C, [0.8, 0.8, 1.55], [0, 0.95, 0]), { omega: 1.8, lens: 50, fStop: 2.0, handheld: 0.2 });
  CAM.pull(eyes('chase'), 1.0);
  await say('chase', 'I don’t think I’m ready for this, Luka. I’m a casual. I do Saturdays.');
  await wait(0.4);
  act(L, 'reach_shoulder');
  later(0.3, () => CAM.pull(() => L.boneWorld('handL', V3()), 0.9));
  CAM.shotFn((t, p, a) => { const c = C.headWorld(_v[1]); p.copy(C.pos).addScaledVector(fwdFromYaw(C.yaw - 0.6, _v[2]), 2.5 - Math.min(0.3, t * 0.1)).add(V3(0, 1.05, 0)); a.copy(c).lerp(L.boneWorld('handL', _v[3]), 0.45); }, { omega: 1.4, lens: 50, fStop: 2.0, handheld: 0.15 });
  await wait(2.6);
  act(L, 'withdraw_fist');
  later(0.5, () => CAM.pull(head('luka'), 0.8));
  await wait(1.2);
  await say('luka', 'Get some sleep. We leave at first light.');
  await say('chase', 'Okay.');
  // Chase stands and heads for the longhouse door. The camera holds on Luka's fist, then rises to his face.
  C.anim.setOverlay(null, 3); act(C, 'getUp');
  await wait(0.8);
  walk(C, V3(OBJ.house.X1 + 2.2, 0, OBJ.house.CZ + 0.4).setY(OBJ.house.G), { speed: 1.0 });
  const fy = L.yaw;
  CAM.shotFn((t, p, a) => { const fist = L.boneWorld('handL', _v[1]), h = L.headWorld(_v[2]); p.copy(L.pos).addScaledVector(fwdFromYaw(fy + 0.7, _v[3]), 2.1).add(V3(0, 0.95 + smoothstep(1, 4, t) * 0.65, 0)); a.copy(fist).lerp(h, smoothstep(1, 4, t)); }, { omega: 1.5, lens: 50, fStop: 2.0, handheld: 0.2 });
  CAM.pull(() => L.boneWorld('handL', V3()), 0.3);
  await wait(1.6);
  CAM.pull(head('luka'), 2.0);
  await wait(2.6);
  await BEATS.ward_falls(true);
};

// ---------- BEAT 4 — The Ward Falls ----------
SETUPS.ward_falls = () => {
  SETUPS.pyre_embers();
  ACTORS.chase.anim.setOverlay(null); place('chase', V3(OBJ.house.X1 + 2.2, OBJ.house.G, OBJ.house.CZ + 0.4), -PI / 2);
  ACTORS.luka.anim.setOverlay(null); place('luka', V3(13.2, OBJ.pyreY, -84.0), 0.9);
};
BEATS.ward_falls = async (cont) => {
  const L = ACTORS.luka, C = ACTORS.chase, P = LOC.pyre, py = OBJ.pyreY, H = OBJ.house;
  setCheckpoint('ward_falls');
  if (!cont) cine();
  look(L, null);
  // 4.1 — the ward dies: the hum falters into a descending electrical whine
  sfx('whine', LOC.ward, 1.1);
  musicCue('silence', 0.5);
  const W = OBJ.wardPosts;
  const first = W.reduce((b, w, i) => (dist2D(w, L.pos) < dist2D(W[b], L.pos) ? i : b), 0);
  const fp = W[first];
  CAM.shotFn((t, p, a) => { const y = yawTo(L.pos, fp); p.copy(L.pos).add(V3(0, 1.9, 0)).addScaledVector(fwdFromYaw(y + PI, _v[1]), 1.5).addScaledVector(fwdFromYaw(y - PI / 2, _v[2]), 0.55); a.set(fp.x, fp.top - 0.6, fp.z); }, { omega: 6, lens: 35, fStop: 2.8, handheld: 0.5 });
  CAM.pull(() => V3(fp.x, fp.top - 0.6, fp.z), 0.4);
  await wait(0.8);
  const kill = (w) => { w.alive = false; const m = w.mat; let n = 0; const fl = () => { n++; w.rune.material = n % 2 ? MATS.runeDead : m; if (n < 7) later(0.05 + frand() * 0.08, fl); else { w.rune.material = MATS.runeDead; fxBurst('sparks', V3(w.x, w.top - 0.5, w.z), { n: 10 }); } }; fl(); sfx('rune', V3(w.x, w.top, w.z), 0.5); };
  kill(fp);
  await wait(1.0);
  // the camera spins with the failure as it races around the ring: 270° in 3 s
  const startA = Math.atan2(fp.x - LOC.ward.x, fp.z - LOC.ward.z);
  const order = W.map((w, i) => ({ w, a: wrapAngle(Math.atan2(w.x - LOC.ward.x, w.z - LOC.ward.z) - startA) })).sort((x, y) => (x.a < 0 ? x.a + TAU : x.a) - (y.a < 0 ? y.a + TAU : y.a));
  CAM.shotFn((t, p, a) => { const ang = startA + EASE.inOutCubic(clamp01(t / 3)) * PI * 1.5; a.set(LOC.ward.x + Math.sin(ang) * LOC.wardR, py + 1.2, LOC.ward.z + Math.cos(ang) * LOC.wardR); p.copy(L.pos).add(V3(0, 2.15, 0)).addScaledVector(_v[1].subVectors(a, L.pos).setY(0).normalize(), -0.75); }, { omega: 7, lens: 30, fStop: 4, handheld: 0.6 });
  CAM.focusOverride = 18;
  for (let i = 1; i < order.length; i++) { later(i / order.length * 3.0, () => kill(order[i].w)); }
  await wait(3.3);
  OBJ.ward.alive = false;
  CAM.focusOverride = null;
  // 4.2 — Rue is cut off
  const slate = RUE.slate, slateP = () => slate.userData.tablet.getWorldPosition(V3());
  setRueMode('static'); sfx('crack', slate.position, 0.6);
  CAM.shotFn((t, p, a) => { const s = slateP(); p.copy(s).add(V3(-1.3, 0.35, 0.9)); a.copy(s); }, { omega: 5, lens: 50, fStop: 2.4, handheld: 0.45 });
  CAM.pull(slateP, 0.4);
  await wait(0.6);
  setRueMode('live'); RUE.mat.uniforms.glitch.value = 0.5;
  await say('rue', 'Lads — LADS. The ward. The ward was hers, it’s going with her — Head Office can see the smoke — they can see y—', { dur: 6.4, cutAt: 0.97 });
  RUE.freeze = 1.5; RUE.mat.uniforms.glitch.value = 0.8;
  await wait(1.1);
  sfx('systemChime', slate.position, 1); setRueMode('ended');
  await wait(0.8);
  CAM.shotFn((t, p, a) => { p.set(H.X1 + 6.5, H.G + 1.7, H.CZ + 3.2); a.copy(C.headWorld(_v[1])); }, { omega: 3, lens: 50, fStop: 2.4, handheld: 0.35 });
  CAM.pull(head('chase'), 0.5);
  look(C, slateP); await turnTo(C, yawTo(C.pos, slate.position), 5);
  await say('chase', '(at the door, turning back) Did he just hang up?');
  await say('luka', 'He can’t hang up.', { look: false });
  await say('chase', 'So someone hung up on him.');
  await walk(C, slate.position.clone().add(V3(-0.9, 0, 0.6)).setY(py), { speed: 1.8 });
  act(C, 'place'); await wait(0.6); slate.visible = false; RUE.visible = false;
  await say('chase', 'In case he calls back.');
  // 4.3 — the Mystery Shopper on the gable
  const gab = V3(H.X1 + 0.62, H.RIDGE + 0.95, H.CZ);
  CAM.shotFn((t, p, a) => { p.set(H.X1 + 9, H.G + 1.6, H.CZ + 4); a.copy(gab); }, { omega: 2.6, lens: 50, fStop: 2.8, handheld: 0.3 });
  CAM.pull(() => gab, 0.8);
  await wait(1.0); sfx('scribble', gab, 0.8); await wait(1.1); sfx('raven', gab, 1); await wait(1.0);
  // 4.4 — the Churned rise beyond the dead ward ring
  musicCue('ward', 1);
  G.enemyHold = true;
  const wave1 = [V3(-6, 0, -61), V3(8, 0, -60.5), V3(20, 0, -66)].map(v => v.setY(groundHeight(v.x, v.z)));
  const spawned = wave1.map((p, i) => { const e = spawnEnemy('churned', p, { group: 'w1', yaw: yawTo(p, L.pos) }); e.riseDur = 2.2 + i * 0.4; return e; });
  CAM.shotFn((t, p, a) => { p.set(lerp(9, 7, t / 5), py + 1.4, lerp(-70, -72, t / 5)); a.set(6, py + 0.8, -62); }, { omega: 2.2, lens: 35, fStop: 4, handheld: 0.4 });
  CAM.focusOn(() => V3(6, py + 1, -62));
  for (let i = 0; i < 4; i++) later(i * 0.6, () => babble('churned', pick(CHURN_MUTTERS), 2.4, spawned[i % 3].actor));
  showSub('churned', '…cancel… my…'); later(1.6, () => showSub('churned', '…speak to the… manager…')); later(3.2, () => showSub('churned', '…I’ve been… on hold…')); later(4.8, hideSub);
  await wait(5.0);
  // 4.5 — the Cold Call, standing upright in the scorched display-table frame
  await walk(L, V3(P.x - 1.1, py, P.z + 0.2), { speed: 1.6, yaw: PI / 2 });
  const axP = () => OBJ.pyreAxe.getWorldPosition(V3());
  CAM.shotFn((t, p, a) => { p.set(P.x - 3.4, py + 1.5, P.z + 1.9); a.copy(axP()); }, { omega: 2.4, lens: 50, fStop: 2.0, handheld: 0.3 });
  CAM.pull(axP, 0.6);
  act(L, 'pull_axe', { onEvent: n => { if (n === 'free') { OBJ.pyreAxe.visible = false; setWeapon('axe'); sfx('frost', L.pos, 1); fxBurst('frost', L.boneWorld('handR', V3()), { n: 40 }); CAM.shake(0.15); if (AUDIO.ok) { INST.choir(T0(), 50, 1.2, 1, AUDIO.musicBus, 'ah'); INST.taiko(T0(), 1, AUDIO.musicBus, 0.7); } } } });
  await wait(1.6);
  CAM.shotFn(SHOT.track(L, [-0.9, 1.55, 1.6], [0, 1.35, 0]), { omega: 2.4, lens: 35, fStop: 2.4, handheld: 0.35 });
  CAM.pull(head('luka'), 0.5);
  await wait(0.4);
  await say('luka', 'Casual. Behind me.');
  chaseBowToHand(true); C.anim.setOverlay('bowReady', 6, 'upper');
  walk(C, V3(P.x - 4.5, py, P.z - 1.4), { speed: 2.5 });
  await say('chase', '(drawing the Treble Bow) I’ve been practising.');
  await say('luka', 'On what.');
  await say('chase', '…Bins.');
  // soft handoff into combat framing; HUD fades in; combat music enters on the downbeat
  await handoff({ mode: 'combat', yaw: yawTo(L.pos, V3(6, 0, -62)), pitch: 0.12 });
  G.enemyHold = false;
  setCheckpoint('ward_falls');
  await combatTutorial();
  await wardAfter();
};
async function combatTutorial() {
  const L = ACTORS.luka;
  G.flags.tutorialSlowmo = true;
  G.allowAim = false; G.allowShield = false; G.allowRage = false;
  // wave 1: Light, Heavy, Dodge, Close the Deal
  G.combat = true; musicCue('combat', 0.5); CAM.setGameMode('combat');
  if (aliveEnemies('w1').length === 0) { for (const p of [V3(-6, 0, -61), V3(8, 0, -60.5), V3(20, 0, -66)]) spawnEnemy('churned', p.setY(groundHeight(p.x, p.z)), { group: 'w1' }); }
  prompt('light', 'Light attack', { key: 'light', dur: 6 }); later(4, () => prompt('heavy', 'Heavy attack (hold to charge)', { key: 'heavy', dur: 6 }));
  later(10, () => bark('chase', 'Is it weird that the dead customers still want to speak to the manager?', { force: false }));
  await waitUntil(() => aliveEnemies('w1').length === 0);
  await wait(1.2);
  // wave 2: Aim + Throw to freeze, Callback, fists while the axe is out
  G.allowAim = true;
  const w2 = [['churned', V3(-10, 0, -70)], ['churned', V3(14, 0, -98)], ['holdmusic', V3(22, 0, -90)]];
  for (const [k, p] of w2) { spawnEnemy(k, p.setY(groundHeight(p.x, p.z)), { group: 'w2' }); await wait(0.5); }
  prompt('aim', 'Aim', { key: 'aim', dur: 6 }); later(2.5, () => prompt('throw', 'Throw the Cold Call', { key: 'throw', dur: 6 }));
  let calledBack = false;
  await waitUntil(() => { if (!calledBack && PLAYER.axeState === 'stuck') { calledBack = true; prompt('callback', 'Callback', { key: 'callback', dur: 8 }); later(4, () => { if (PLAYER.axeState !== 'hand') bark('chase', 'Your hands work too! Probably!', { cd: 10 }); }); } return aliveEnemies('w2').length === 0; });
  await wait(1.2);
  // wave 3: Shield, Price Match, red = unblockable, Command Chase to break the guard
  G.allowShield = true;
  spawnEnemy('brute', V3(4, 0, -62).setY(groundHeight(4, -62)), { group: 'w3' }); await wait(0.6);
  spawnEnemy('churned', V3(-8, 0, -100).setY(groundHeight(-8, -100)), { group: 'w3' }); spawnEnemy('churned', V3(18, 0, -70).setY(groundHeight(18, -70)), { group: 'w3' });
  bark('chase', 'He’s got a stanchion!', { force: true });
  prompt('shield', 'Shield — tap as a hit lands to Price Match', { key: 'shield', dur: 7 });
  later(7, () => { prompt('chase', 'Command Chase — break his guard', { key: 'chase', dur: 7 }); bark('chase', 'I’ll get his attention — sort of!', { cd: 6 }); });
  later(14, () => toast('Red attacks are <b>unblockable</b>', 'Dodge them'));
  await waitUntil(() => aliveEnemies('w3').length === 0);
  G.combat = false; G.flags.tutorialSlowmo = false; G.allowRage = undefined;
}
async function wardAfter() {
  const L = ACTORS.luka, C = ACTORS.chase;
  await wait(1.0);
  cine();
  musicCue('silence', 3);
  C.fatigue = true;
  CAM.shotFn((t, p, a) => { const m = L.pos.clone().lerp(C.pos, 0.5); p.copy(m).add(V3(2.6, 1.6, 2.2)); a.copy(m).add(V3(0, 1.3, 0)); }, { omega: 1.8, lens: 35, fStop: 2.8, handheld: 0.3 });
  walk(C, L.pos.clone().addScaledVector(fwdFromYaw(L.yaw + 1.6), 2.2), { speed: 1.2 });
  look(C, 'luka');
  CAM.pull(head('chase'), 0.8);
  await say('chase', '(breathing hard) That was — I hit one! I hit — I hit something.');
  await wait(0.5);
  sfx('bellow', V3(-20, 15, -40), 1.2);
  await wait(1.6);
  look(C, () => V3(-20, 15, -40)); look(L, () => V3(-20, 15, -40));
  await say('chase', '…What was that.');
  look(L, 'chase', 0.5);
  CAM.pull(head('luka'), 0.6);
  await say('luka', 'Something you hit.');
  await say('luka', 'We go now. Before more come.');
  act(L, 'hand_to_satchel'); await wait(1.2);
  look(L, null); look(C, null);
  chaseBowToHand(false);
  await handoff({ mode: 'explore', yaw: yawTo(L.pos, V3(6, 0, -60)) });
  musicCue('explore', 4);
  prompt('move', 'Follow the path south', { key: 'move', dur: 5 });
}
