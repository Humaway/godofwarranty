// ================= DIRECTOR: Beats 5–11 — The Kiosk, The Wombat, The Cliff Path, The Queue, Dodgy Hamarr, Not Ready, The Knock =================

// ---------- BEAT 5 — The Kiosk ----------
SETUPS.kiosk = () => {
  setEnv('ward', 0);
  worldState({ tree: 'pyre', pyre: 'cold', body: false, ward: false, axe: 'none', slate: 'none', smiths: 'kiosk', zee: 'none', beanie: false, weapon: 'axe', door: false, lights: () => lightsYard(true) });
  placeLog('pyre'); LOG.mesh.visible = false;
  place('luka', [6, null, -64, PI]); place('chase', [4.5, null, -66.5, PI]);
};
BEATS.kiosk = async () => {
  const L = ACTORS.luka, C = ACTORS.chase, LU = ACTORS.luke, ZA = ACTORS.zane, K = OBJ.kiosk;
  if (G.mode !== 'play') { await handoff({ mode: 'explore' }); musicCue('explore', 3); }
  setCheckpoint('kiosk');
  worldState({ smiths: 'kiosk' });
  setLight(3, { pos: K.lantern, color: 0xffc070, intensity: 9, flicker: 0.2, dist: 16 });
  setLight(1, { pos: K.forgePos, color: 0xff7a30, intensity: 14, flicker: 0.5, dist: 10 });
  G.flags.forgeOn = true;
  await waitUntil(() => dist2D(L.pos, K.center) < 9.5);
  setEnv('kiosk', 4); setSpace('forest');
  // 5.1 — arrival
  cine();
  LU.listen = ZA.listen = C.listen = true;
  walk(L, 'kiosk_luka', { speed: 1.3 }); walk(C, 'kiosk_chase', { speed: 1.3 });
  const mid = () => LU.pos.clone().lerp(ZA.pos, 0.5).add(V3(0, 1.4, 0));
  CAM.shotFn((t, p, a) => { const m = mid(); p.copy(K.center).add(V3(5.5, 2.1, 2.2)); a.copy(m); }, { omega: 2, lens: 35, fStop: 2.8, handheld: 0.3 });
  CAM.pull(head('luke'), 1);
  look(LU, 'luka'); look(ZA, 'luka');
  await wait(1.0);
  await say('luke', 'Oi! Survivors! Told you the ward’d go.');
  CAM.pull(head('zane'), 0.5); await say('zane', 'You said the ward would “hold for a hundred years”.');
  CAM.pull(head('luke'), 0.5); await say('luke', 'I said it’d hold for a hundred years if NOBODY touched it.');
  CAM.pull(head('zane'), 0.5); await say('zane', 'Someone died, Luke.');
  CAM.pull(head('luke'), 0.5); await wait(0.8); await say('luke', '…Yeah. Yeah, alright.'); await say('luke', 'Sorry.', { dur: 1.4 });
  // 5.2 — Faye's axe. The camera moves in slowly on Luke's face (50 mm). His unfunny moment.
  CAM.shotFn((t, p, a) => { const h = LU.headWorld(_v[1]); p.copy(h).addScaledVector(fwdFromYaw(LU.yaw + 0.5, _v[2]), 2.2 - Math.min(0.6, t * 0.08)); a.copy(h); }, { omega: 1.6, lens: 50, fStop: 2.0, handheld: 0.25 });
  look(LU, () => L.boneWorld('handR', V3()));
  await wait(1.6);
  await say('luke', 'That’s — that’s Faye’s.', { slow: 1.2 });
  CAM.shotFn(SHOT.face(ZA, { yaw: 0.75, dist: 2.1, toward: L, avoid: [L, C, LU] }), { omega: 2, lens: 50, fStop: 2.2, handheld: 0.25 });
  CAM.pull(head('zane'), 0.6);
  await say('zane', 'We forged that for her. Twelve years ago. Not for you.'); await wait(0.6); await say('zane', 'No offence.');
  CAM.shotFn(SHOT.face(L, { yaw: 1.0, dist: 2.1, toward: ZA, avoid: [C, LU, ZA] }), { omega: 2, lens: 50, fStop: 2.2, handheld: 0.25 });
  CAM.pull(head('luka'), 0.6);
  await say('luka', 'She left it to me.');
  CAM.shotFn(SHOT.face(LU, { yaw: 0.75, dist: 2.0, avoid: [L, C, ZA] }), { omega: 2, lens: 50, fStop: 2.0, handheld: 0.25 });
  CAM.pull(head('luke'), 0.6); look(LU, null);
  await say('luke', '(looking away, gruff) …Course she did.');
  act(LU, 'hold_out_hand');
  await say('luke', 'Gimme. It’s been through a funeral and a fight. Needs a tune.');
  // 5.3 — upgrades: the menu appears as a carved slate panel lying on the bench, lit by the forge
  CAM.shotFn((t, p, a) => { p.copy(K.bench).add(V3(0, 0.8, 0)).addScaledVector(_v[1].copy(K.center).sub(K.bench).setY(0).normalize(), -0.2).add(V3(0.0, 0, 0)); a.copy(K.bench).add(V3(0, 0.1, 0)); }, { omega: 2, lens: 50, fStop: 2.8, handheld: 0.15 });
  CAM.pull(() => K.bench.clone().add(V3(0, 0.1, 0)), 0.6);
  setWeapon('none');
  if (!G.promos.rebate) { G.promos.rebate = true; later(1, () => { toast('Runic Promo: <b>Glacial Rebate</b>', `${glyph('promoL')} — ice spikes in a 5 m ring`); sfx('rune', K.bench, 1); }); }
  if (!G.flags.float) { G.flags.float = true; await say('zane', 'Here. The store float. She’d want it spent on you.'); addSilver(200, 'The store float'); }
  await openKiosk(true);
  setWeapon('axe');
  // Zane's moment: the ticket
  CAM.shotFn((t, p, a) => { const h = ZA.headWorld(_v[1]); p.copy(h).addScaledVector(fwdFromYaw(ZA.yaw + 0.6, _v[2]), 2.0); a.copy(h); }, { omega: 2, lens: 50, fStop: 2.0, handheld: 0.2 });
  CAM.pull(head('zane'), 0.8); look(ZA, () => L.props.satchel.getWorldPosition(V3()));
  await wait(1.2);
  await say('zane', 'The ticket — I left “Fault” blank. I didn’t know what to put.', { slow: 1.1 });
  CAM.shotFn(SHOT.face(L, { yaw: 1.0, dist: 2.1, toward: ZA, avoid: [C, LU, ZA] }), { omega: 2, lens: 50, fStop: 2.0, handheld: 0.2 });
  CAM.pull(head('luka'), 0.8); look(ZA, 'luka');
  await say('luka', 'Leave it blank.');
  await wait(0.8);
  // 5.4 — leaving: Luke licks a screen protector before pressing it onto the Tempered Guardian. Zane gags.
  CAM.shotFn((t, p, a) => { const m = mid(); p.copy(K.center).add(V3(4.6, 1.9, 3.5)); a.copy(m); }, { omega: 2, lens: 35, fStop: 2.8, handheld: 0.3 });
  CAM.pull(head('luke'), 0.6);
  act(LU, 'lick'); await wait(0.8); sfx('step', LU.pos, 0.5);
  act(ZA, 'gag'); await wait(0.5);
  await say('luke', 'Activates the adhesive.');
  await say('luke', 'Oi, Casual. Your bow’s held together with tape.');
  look(LU, 'chase'); look(ZA, 'chase');
  CAM.shotFn(SHOT.face(C, { yaw: 0.8, dist: 2.2, toward: LU, avoid: [L, LU, ZA] }), { omega: 2.2, lens: 50, fStop: 2.4, handheld: 0.3 });
  CAM.pull(head('chase'), 0.6);
  await say('chase', 'It’s gaffer. It’s structural.');
  CAM.shotFn(SHOT.two(LU, ZA, { from: C, swing: 0.35 }), { omega: 2.2, lens: 35, fStop: 2.8, handheld: 0.3 });
  CAM.pull(head('zane'), 0.6);
  await say('zane', 'It’s unhygienic.');
  G.flags.kioskDone = true;
  await handoff({ mode: 'explore' });
  // Repeatable: ask "Brothers?" again for escalating denials (trophy after three)
  await waitUntil(() => dist2D(L.pos, LOC.zee) < 30 && L.pos.z > -10);
};
// the kiosk menu: Luke & Zane's upgrades and the KPI Tree (§8)
async function openKiosk(first) {
  const prevMode = G.mode; G.mode = 'menu';
  const res = await UI.openKiosk(first);
  G.mode = prevMode === 'menu' ? 'play' : prevMode;
  if (res === 'brothers') await brothersBit();
}
async function brothersBit() {
  G.stats.brothersAsked++;
  const n = G.stats.brothersAsked;
  const sets = [
    [['chase', 'So… brothers?'], ['luke', 'Business partners.'], ['zane', '*Estranged* business partners.']],
    [['chase', 'Brothers, though?'], ['luke', 'We share a cart.'], ['zane', 'Against my will.']],
    [['chase', 'Okay but are you —'], ['luke', 'NOT.'], ['zane', 'Brothers.'], ['luke', '…He means we’re not.'], ['zane', 'I said what I said.']],
  ];
  for (const [w, t] of sets[Math.min(2, n - 1)]) await say(w, t);
  if (n >= 3) trophy('Not Brothers');
}
const UPGRADES = [
  { id: 'axe2', name: 'Cold Call Lv 2', cost: 300, desc: '+15% damage, +10% frost build.', bark: ['luke', 'Someone’s been chopping trees with this. Disrespectful.'] },
  { id: 'protector', name: '9H Screen Protector', cost: 250, desc: 'Tempered Guardian: block chip −50%, Price Match window +2 frames.', bark: ['luke', '(licking it) Activates the adhesive.'] },
  { id: 'strings', name: 'Fresh Strings', cost: 200, desc: 'Treble Bow: quiver +1, arrow stun +20%.', bark: ['zane', 'I’m replacing the tape too. Don’t argue.'] },
  { id: 'fleece', name: 'Thermal Fleece', cost: 350, desc: 'Luka: +10% max health.', bark: ['luke', 'Faye’s old size. Don’t make it weird.'] },
];
const KPI_NODES = [
  { id: 'upsell', name: 'Upsell', cost: 120, desc: 'Light, Light, Heavy: a 270° sweep.' },
  { id: 'wallMount', name: 'Wall Mount', cost: 120, desc: 'A thrown axe pins light enemies to walls.' },
  { id: 'callbackStrike', name: 'Callback Strike', cost: 100, desc: 'The returning axe also adds 20 stun.' },
  { id: 'hardClose', name: 'Hard Close', cost: 100, desc: 'Shield Bash breaks guards in one hit.' },
  { id: 'grapple', name: 'Chase: Grapple', cost: 140, desc: 'Command Chase on a dazed enemy: he chokes it with the bow string.' },
  { id: 'chord', name: 'Chase: Faye’s Chord', cost: 140, desc: 'Four commanded hits in a row play her tune and release a shockwave.' },
];
function buyUpgrade(u) {
  if (G.upgrades[u.id] || G.silver < u.cost) return false;
  G.silver -= u.cost; G.upgrades[u.id] = true; sfx('pickup', null, 0.7); sfx('wood', null, 0.5);
  if (u.id === 'fleece') { PLAYER.maxHp = Math.round(PLAYER.maxHp * 1.1); PLAYER.hp = PLAYER.maxHp; }
  if (u.id === 'strings') CHASE.arrows = quiverMax();
  if (u.bark) say(u.bark[0], u.bark[1]);
  saveProgress(); return true;
}
function buyKPI(k) { if (G.kpi[k.id] || G.commission < k.cost) return false; G.commission -= k.cost; G.kpi[k.id] = true; sfx('rune', null, 0.7); saveProgress(); return true; }

// ---------- BEAT 6 — The Wombat ----------
SETUPS.zee = () => {
  setEnv('kiosk', 0);
  worldState({ tree: 'pyre', pyre: 'cold', ward: false, axe: 'none', slate: 'none', smiths: 'kiosk', zee: 'none', beanie: false, weapon: 'axe', lights: () => { lightsOff(1, 2, 3); } });
  LOG.mesh.visible = false; G.flags.kioskDone = true;
  place('luka', [-6, null, -2, 0]); place('chase', [-7.5, null, -4, 0]);
};
BEATS.zee = async () => {
  const L = ACTORS.luka, C = ACTORS.chase, Z = ACTORS.zee, W = OBJ.wombat;
  if (G.mode !== 'play') { await handoff({ mode: 'explore' }); }
  setCheckpoint('zee');
  musicCue('explore', 3);
  // wombat lies on her side in the snow; Zee crouched out of sight behind her
  W.root.visible = true; W.pos.copy(MARKS.zee_wombat.pos); W.yaw = MARKS.zee_wombat.yaw; W.lie = 1; W.walkTo = null; W.arrow.visible = true; W.speed = 0;
  Z.setVisible(true); place(Z, 'zee_rise'); Z.anim.setOverlay('crouch', 50); Z.anim.overlayW = 1; Z.root.visible = false;
  lightsOff(1, 2, 3);
  // gouges in the snow, a trail leading off the path
  for (let i = 0; i < 8; i++) fxFootprint(LOC.zee.x - 4 + i * 0.9, LOC.zee.z - 14 + i * 1.3, 0.6);
  await waitUntil(() => dist2D(L.pos, LOC.zee) < 17);
  setEnv('zee', 6); musicCue('zee', 4);
  cine();
  C.listen = true; Z.listen = true;
  walk(C, V3(LOC.zee.x - 1.8, 0, LOC.zee.z - 9).setY(groundHeight(LOC.zee.x - 1.8, LOC.zee.z - 9)), { speed: 1.4 });
  walk(L, V3(LOC.zee.x - 3.5, 0, LOC.zee.z - 10.5).setY(groundHeight(LOC.zee.x - 3.5, LOC.zee.z - 10.5)), { speed: 1.2 });
  CAM.shotFn(SHOT.track(C, [0.9, 1.6, -2.2], [0, 1.2, 4]), { omega: 2.2, lens: 35, fStop: 2.8, handheld: 0.35 });
  CAM.focusOn(head('chase'));
  await wait(1.6);
  await say('chase', 'Luka. Look.');
  look(C, () => W.pos.clone().add(V3(0, 1, 0))); look(L, () => W.pos.clone().add(V3(0, 1, 0)));
  CAM.shotFn((t, p, a) => { p.copy(C.pos).add(V3(-1.2, 1.7, -1.6)); a.copy(W.pos).add(V3(0, 1.0, 0)); }, { omega: 1.8, lens: 35, fStop: 2.8, handheld: 0.3 });
  CAM.pull(() => W.pos.clone().add(V3(0, 1, 0)), 1);
  sfx('bellow', W.pos, 0.4);
  await wait(1.8);
  await say('chase', 'That’s… that’s my arrow.');
  await say('luka', 'Leave it.');
  await say('chase', 'It’s hurt. I hurt it.');
  // 6.2 — Zee. Tracks Chase as he approaches (35 mm), Luka soft behind.
  walk(C, W.pos.clone().add(V3(-1.5, 0, -2.6)).setY(groundHeight(W.pos.x - 1.5, W.pos.z - 2.6)), { speed: 0.8 });
  CAM.shotFn(SHOT.track(C, [-0.8, 1.55, -2.0], [0, 1.25, 3]), { omega: 2, lens: 35, fStop: 2.4, handheld: 0.3 });
  await wait(2.2);
  await say('zee', 'Gently.', { actor: Z });
  Z.root.visible = true; Z.anim.setOverlay(null, 1.2); look(Z, 'chase');
  await wait(0.6);
  CAM.pull(head('zee'), 1.2);
  await say('zee', 'He’s not dangerous. He’s just very big, and very offended.');
  CAM.pull(head('chase'), 0.6);
  await say('chase', 'I’m so sorry. I was aiming at a — there was a — it was a dead customer.');
  CAM.pull(head('zee'), 0.6);
  await say('zee', 'I know. I saw. You did well.');
  // she draws the arrow out
  await walk(Z, W.pos.clone().add(V3(0.4, 0, -1.9)).setY(groundHeight(W.pos.x + 0.4, W.pos.z - 1.9)), { speed: 0.8 });
  act(Z, 'place'); await wait(0.7); W.arrow.visible = false; PROPS.arrowZ.visible = true; sfx('bellow', W.pos, 0.5);
  await walk(Z, C.pos.clone().addScaledVector(fwdFromYaw(yawTo(C.pos, Z.pos)), 1.1), { speed: 0.8 });
  act(Z, 'hold_out_hand', { mask: 'armR' }); await wait(0.6);
  await say('zee', 'Keep this. You’ll need every one of them.');
  PROPS.arrowZ.visible = false; Z.anim.stop(0.4); CHASE.arrows = Math.min(quiverMax(), CHASE.arrows + 1);
  // she lays a palm on the wombat's broad forehead
  await walk(Z, W.pos.clone().addScaledVector(fwdFromYaw(W.yaw), 2.2).setY(groundHeight(W.pos.x, W.pos.z)), { speed: 0.8 });
  await faceTo(Z, W.head.getWorldPosition(V3()));
  CAM.shotFn((t, p, a) => { const hp = W.head.getWorldPosition(_v[1]); p.copy(hp).add(V3(-2.2, 0.9, -1.8)); a.copy(hp).lerp(Z.headWorld(_v[2]), 0.5); }, { omega: 2, lens: 35, fStop: 2.4, handheld: 0.25 });
  act(Z, 'touch'); await wait(0.6);
  await say('zee', 'Let’s try a gentle reset.');
  sfx('reset', W.pos, 1); fxBurst('spiral', W.pos.clone().add(V3(0, 0.6, 0)), { n: 90 });
  await wait(1.4);
  // Hildis-Vinnie heaves upright, shakes off the snow, and sneezes directly onto Luka
  await tween(v => W.lie = v, 1, 0, 1.4, EASE.inOutCubic);
  fxBurst('snow', W.pos.clone().add(V3(0, 1.2, 0)), { n: 60, scale: 1.8 }); W.shake = 1; later(1.2, () => { W.shake = 0; });
  await wait(1.2);
  W.yaw = yawTo(W.pos, L.pos); await wait(0.6);
  sfx('sneeze', W.pos, 1); W.sneeze = 1; later(0.4, () => { W.sneeze = 0; fxBurst('snow', L.headWorld(V3()), { n: 50, scale: 0.8 }); act(L, 'flinch'); });
  CAM.shotFn((t, p, a) => { p.copy(L.headWorld(_v[1])).addScaledVector(fwdFromYaw(L.yaw + 0.8, _v[2]), 2.2); a.copy(L.headWorld(_v[3])); }, { omega: 3, lens: 50, fStop: 2.4, handheld: 0.35 });
  CAM.pull(head('luka'), 0.4);
  await wait(1.4);
  // 6.3 — the conversation: she comes over; a slow drifting two-shot favouring whoever speaks
  look(L, 'zee'); look(Z, 'luka');
  walk(Z, L.pos.clone().addScaledVector(fwdFromYaw(yawTo(L.pos, Z.pos)), 2.3), { speed: 0.9, timeout: 6 });
  const convo = () => CAM.shotFn(SHOT.two(L, Z, { from: C, swing: 0.45, drift: -0.01, fill: 1.0 }), { omega: 1.4, lens: 35, fStop: 2.8, handheld: 0.25 });
  convo();
  act(L, 'wipe_eye'); CAM.pull(head('luka'), 0.6);
  await say('luka', '(wiping snow from his face) Who are you.');
  CAM.pull(head('zee'), 0.6);
  await say('zee', 'Zee. I live in the woods. Mostly.'); look(Z, () => L.props.satchel.getWorldPosition(V3()));
  await say('zee', 'You’re carrying her.');
  CAM.pull(head('luka'), 0.6); act(L, 'hand_to_satchel');
  await say('luka', '(hand to the satchel) That’s not your concern.');
  look(Z, 'luka'); CAM.pull(head('zee'), 0.6);
  await say('zee', 'No. It’s yours.');
  await say('zee', '(softly) I’m sorry, 2IC. She was the best of us.');
  CAM.shotFn(SHOT.face(C, { yaw: 0.6, dist: 2.3, toward: Z, avoid: [L, Z] }), { omega: 2, lens: 50, fStop: 2.4, handheld: 0.25 });
  CAM.pull(head('chase'), 0.6); await say('chase', 'You knew Faye?');
  convo(); CAM.pull(head('zee'), 0.6);
  await say('zee', 'Everyone who ever trained anyone knew Faye.');
  await say('zee', '(to Luka) The old Hornibrook is ahead. Something lives under it that was never taught manners.');
  CAM.pull(head('luka'), 0.6); await say('luka', 'We don’t need help.');
  CAM.pull(head('zee'), 0.6); await say('zee', 'Nobody does. Until the queue gets long.');
  // she presses a charm into Chase's hand: an old pager on a braided lanyard cord
  await walk(Z, C.pos.clone().addScaledVector(fwdFromYaw(yawTo(C.pos, Z.pos)), 0.95), { speed: 0.8 });
  look(Z, 'chase'); PROPS.pager.visible = true; act(Z, 'hold_out_hand');
  CAM.shotFn(SHOT.two(C, Z, { from: L, swing: -0.3, min: 2.2, ay: -0.35 }), { omega: 1.8, lens: 35, fStop: 2.4, handheld: 0.25 });
  CAM.pull(() => PROPS.pager.getWorldPosition(V3()), 0.6);
  await wait(0.6);
  await say('zee', 'Hold Pattern. When everything gets too fast, it’ll slow down for you.');
  PROPS.pager.visible = false; PROPS.pagerC.visible = true; Z.anim.stop(0.4);
  G.talisman = true;
  // 6.4 — the warning: a tight two-shot, 85 mm, f/1.8. Zee sharp, Luka soft over her shoulder.
  await walk(Z, L.pos.clone().addScaledVector(fwdFromYaw(yawTo(L.pos, Z.pos)), 0.85), { speed: 0.7 });
  look(Z, 'luka'); look(L, 'zee');
  CAM.shotFn((t, p, a) => { const zh = Z.headWorld(_v[1]), lh = L.headWorld(_v[2]); const d = _v[3].copy(zh).sub(lh).setY(0).normalize(); p.copy(lh).addScaledVector(d, 2.6).addScaledVector(fwdFromYaw(Math.atan2(d.x, d.z) + PI / 2, _v[4]), 0.45).add(V3(0, 0.02, 0)); p.addScaledVector(d, 0); a.copy(zh); }, { omega: 2, lens: 85, fStop: 1.8, handheld: 0.2 });
  CAM.shotFn((t, p, a) => { const zh = Z.headWorld(_v[1]), lh = L.headWorld(_v[2]); const d = _v[3].copy(lh).sub(zh).setY(0).normalize(); p.copy(zh).addScaledVector(d, -2.4).addScaledVector(fwdFromYaw(Math.atan2(d.x, d.z) + PI / 2, _v[4]), 0.35); a.copy(zh); }, { omega: 2, lens: 85, fStop: 1.8, handheld: 0.2 });
  CAM.pull(eyes('zee'), 0.8);
  place(C, C.pos.clone(), C.yaw); C.anim.setOverlay('holdBox', 6, 'armL');
  await wait(1.0);
  await say('zee', 'And 2IC — if someone comes to your door…', { slow: 1.1 });
  await wait(0.8);
  await say('zee', 'Don’t tell him no. He won’t hear it.');
  CAM.pull(eyes('luka'), 0.6);
  await say('luka', 'What does that mean?');
  CAM.pull(eyes('zee'), 0.6);
  // already walking into the mist, the wombat following
  walk(Z, V3(LOC.zee.x + 16, 0, LOC.zee.z + 10).setY(groundHeight(LOC.zee.x + 16, LOC.zee.z + 10)), { speed: 1.0, timeout: 20 });
  W.walkTo = V3(LOC.zee.x + 18, 0, LOC.zee.z + 13);
  await say('zee', '(already walking into the mist) It means say something else.');
  nameCard('zee', 'The Witch of the Woods'); later(1.4, () => updateNameCardRole('The Witch of the Woods'));
  CAM.shotFn((t, p, a) => { const m = L.pos.clone().lerp(C.pos, 0.5); p.copy(m).add(V3(-2.5, 1.7, -3)); a.copy(Z.headWorld(_v[1])).lerp(m.add(V3(0, 1.4, 0)), smoothstep(2, 7, t)); }, { omega: 1.5, lens: 35, fStop: 2.8, handheld: 0.3 });
  CAM.pull(head('zee'), 0.5);
  await wait(3.0);
  C.anim.setOverlay(null); PROPS.pagerC.visible = false;
  look(C, 'luka'); look(L, null);
  CAM.pull(head('chase'), 1.2);
  await say('chase', 'She was nice.');
  await say('luka', 'She was hiding something.');
  await say('chase', 'Everyone’s hiding something. You’re hiding like eight things.');
  await wait(0.5);
  await say('luka', '…Walk.');
  look(C, null);
  Z.setVisible(false); W.root.visible = false; W.walkTo = null;
  await handoff({ mode: 'explore', yaw: yawTo(L.pos, LOC.fork) });
  later(1.2, () => toast('Talisman: <b>Hold Pattern</b>', 'A perfect dodge slows the world'));
  musicCue('explore', 4);
};

// ---------- BEAT 7 — The Cliff Path ----------
SETUPS.path = () => {
  setEnv('kiosk', 0);
  worldState({ tree: 'pyre', ward: false, axe: 'none', slate: 'none', smiths: 'none', zee: 'none', beanie: false, weapon: 'axe', lights: () => lightsOff(1, 2, 3) });
  LOG.mesh.visible = false; G.talisman = true;
  place('luka', [16, null, 36, 0.7]); place('chase', [14, null, 34, 0.7]);
};
BEATS.path = async () => {
  const L = ACTORS.luka;
  if (G.mode !== 'play') await handoff({ mode: 'explore' });
  setCheckpoint('path');
  // dawn comes slowly over the bay as they walk the red cliffs
  await waitUntil(() => L.pos.z > 32);
  setEnv('cliff', 45); setSpace('open'); lightsOff(1, 2, 3);
  await waitUntil(() => L.pos.z > 52);
  startConvo([
    ['chase', 'Luke said something. When you weren’t listening. He called you “the Ghost”.'],
    ['luka', 'Luke says a lot.'],
    ['chase', 'Ghost of what?'],
    ['wait', 1.4],
    ['luka', '…Walk faster.'],
  ]);
  await waitUntil(() => L.pos.z > 96);
  startConvo([
    ['chase', 'Do you think Rue’s okay?'],
    ['luka', 'He’s the CEO.'],
    ['chase', 'That’s not a yes.'],
    ['luka', 'It’s not a no.'],
    ['wait', 1.0],
    ['chase', 'That’s the nicest thing you’ve ever said about him.'],
  ]);
  await waitUntil(() => L.pos.z > 133);
};

// ---------- BEAT 8 — The Queue ----------
SETUPS.queue = () => {
  setEnv('horni', 0);
  worldState({ tree: 'pyre', ward: false, axe: 'none', slate: 'none', smiths: 'none', zee: 'none', beanie: false, weapon: 'axe', lights: () => lightsOff(1, 2, 3) });
  LOG.mesh.visible = false;
  place('luka', [46, null, 128, 0.2]); place('chase', [44.5, null, 126, 0.2]);
  OBJ.ticket.serving = 1; drawTicketScreen();
};
let QUEUE = [];
function spawnQueue() {
  QUEUE = [];
  const rows = [141.6, 143.8, 146.0];
  for (let r = 0; r < 3; r++) for (let i = 0; i < 4; i++) {
    const x = 39.4 + i * 1.8 + (r % 2) * 0.6, z = rows[r];
    const e = spawnEnemy('churned', V3(x, groundHeight(x, z), z), { queue: true, rise: false, yaw: PI / 2 + (frand() - 0.5) * 0.2, group: 'queue' });
    e.wakeQueue = () => wakeQueueGroup(e);
    QUEUE.push(e);
  }
}
function wakeQueueGroup(e) { if (e.state === 'queue') { e.setState('approach'); e.thinkT = 0.3; } }
BEATS.queue = async () => {
  const L = ACTORS.luka, C = ACTORS.chase, T = OBJ.ticket;
  if (G.mode !== 'play') await handoff({ mode: 'explore' });
  setCheckpoint('queue');
  setEnv('horni', 20); setSpace('bridge');
  spawnQueue();
  // the reviewers' roof
  if (!FLOORS.find(f => f.tag === 'booth')) FLOORS.push({ x0: 50.2, x1: 52.8, z0: 151.4, z1: 153.6, y: groundHeight(51.5, 150) + 3.0, tag: 'booth' });
  await waitUntil(() => L.pos.z > 136.5 && L.pos.x > 41);
  // 8.1 — the queue: 24 mm, low, then a slow crane up along the line. Music drops out. Wind only.
  cine();
  musicCue('queue', 2);
  const tick = () => { if (G.queueTick) { sfx('step', T.pos, 0.25, 3); later(1, tick); } }; G.queueTick = true; tick();
  walk(L, 'queue_luka', { speed: 1.0 }); walk(C, 'queue_chase', { speed: 1.0 });
  CAM.shotFn((t, p, a) => { const k = smoothstep(0, 10, t); p.set(lerp(37, 40, k), lerp(9.0, 13.5, k), lerp(149.5, 151, k)); a.set(lerp(43, 50, k), lerp(9.2, 9.6, k), lerp(144, 146, k)); }, { omega: 1.4, lens: 24, fStop: 4, handheld: 0.2 });
  CAM.focusOn(() => V3(44, 9.5, 144));
  await wait(5.5);
  CAM.shotFn((t, p, a) => { const m = L.pos.clone().lerp(C.pos, 0.5); p.copy(m).add(V3(-2.4, 1.6, 2.0)); a.copy(m).add(V3(0.6, 1.4, 0)); }, { omega: 1.8, lens: 35, fStop: 2.8, handheld: 0.25 });
  CAM.pull(head('chase'), 0.6);
  await say('chase', '(whisper) They’re… queuing.');
  CAM.pull(head('luka'), 0.5);
  await say('luka', '(whisper) Don’t touch anything.');
  // Chase has already taken a ticket. The machine dings, bright and loud.
  place(C, T.pos.clone().add(V3(-0.6, 0, -0.6)).setY(groundHeight(T.pos.x - 0.6, T.pos.z - 0.6)), yawTo(T.pos.clone().add(V3(-0.6, 0, -0.6)), T.pos));
  sfx('ding', T.pos, 1.2);
  CAM.shotFn((t, p, a) => { p.copy(C.pos).add(V3(-1.6, 1.65, -1.5)); a.copy(C.headWorld(_v[1])); }, { omega: 4, lens: 50, fStop: 2.4, handheld: 0.35 });
  CAM.pull(head('chase'), 0.4);
  await wait(1.0);
  act(C, 'tap');
  await say('chase', '(reading it) Four thousand, eight hundred and seventeen.');
  // every head in the queue turns at once
  CAM.shotFn((t, p, a) => { p.set(37.5, 10.4, 148.5); a.set(44, 9.4, 144); }, { omega: 6, lens: 24, fStop: 4, handheld: 0.4 });
  for (const e of QUEUE) { const y0 = e.yaw, y1 = yawTo(e.pos, L.pos); tween(v => e.yaw = y0 + angleTo(y0, y1) * v, 0, 1, 0.35, EASE.outCubic); }
  sfx('crack', V3(43, 9, 144), 0.6);
  await wait(1.3);
  CAM.shotFn((t, p, a) => { const m = L.pos.clone().lerp(C.pos, 0.5); p.copy(m).add(V3(-2.4, 1.6, 2.0)); a.copy(m).add(V3(0.6, 1.4, 0)); }, { omega: 3, lens: 35, fStop: 2.8, handheld: 0.35 });
  CAM.pull(head('luka'), 0.4);
  await say('luka', 'Casual.');
  await say('chase', 'I know.');
  G.queueTick = false;
  // 8.2 — the fight: groups of 2–3 peel off; two 1-Star Reviewers on the toll-booth roof; a Hold-Music Churned mid-fight; a Brute closes it out
  PLAYER.rage = 100; G.allowRage = true;
  await handoff({ mode: 'combat', yaw: yawTo(L.pos, V3(43, 0, 144)) });
  prompt('rage', 'Rage ready', { key: 'rage', dur: 6 });
  if (G.promos.rebate) later(3, () => prompt('promoL', 'Glacial Rebate', { key: 'promoL', dur: 6 }));
  G.combat = true; musicCue('combat', 0.3); CAM.setGameMode('combat');
  const roofY = groundHeight(51.5, 152.5);
  const r1 = spawnEnemy('reviewer', V3(50.9, roofY, 152.0), { rise: false, group: 'roof' }), r2 = spawnEnemy('reviewer', V3(52.2, roofY, 153.1), { rise: false, group: 'roof' });
  for (const r of [r1, r2]) { r.cfg = { ...r.cfg, speed: 0 }; r.roof = true; }
  bark('chase', 'Incoming — star!', { cd: 3 });
  let woken = 0, mid = false;
  await waitUntil(() => {
    const active = QUEUE.filter(e => e.alive && e.state !== 'queue' && e.state !== 'dead').length;
    if (active <= 1 && woken < QUEUE.length) { for (let k = 0; k < 3 && woken < QUEUE.length; k++) { const e = QUEUE[woken++]; if (e.state === 'queue') { e.setState('approach'); } } }
    if (!mid && woken >= 6) { mid = true; spawnEnemy('holdmusic', V3(40, 0, 132).setY(groundHeight(40, 132)), { group: 'q2' }); }
    return woken >= QUEUE.length && QUEUE.every(e => !e.alive || e.state === 'dead');
  });
  spawnEnemy('brute', V3(36.5, 0, 140).setY(groundHeight(36.5, 140)), { group: 'q3', rise: false });
  bark('chase', 'He’s got a stanchion! Again!', { force: true });
  await waitUntil(() => aliveEnemies().length === 0);
  G.combat = false;
  // 8.3 — after: the ticket machine clicks over
  await wait(1.0);
  T.serving = 2; drawTicketScreen(); sfx('ding', T.pos, 0.9);
  musicCue('explore', 3);
  await wait(0.6);
  await say('chase', '…Progress.');
  G.flags.queueDone = true; CAM.setGameMode('explore');
  await waitUntil(() => L.pos.x > 62 && L.pos.z > DECK.z0 && L.pos.z < DECK.z1);
};

// ---------- BEAT 9 — Dodgy Hamarr ----------
SETUPS.hamarr = () => {
  setEnv('horni', 0); setSpace('bridge');
  worldState({ tree: 'pyre', ward: false, axe: 'none', slate: 'none', smiths: 'none', zee: 'none', beanie: false, weapon: 'axe', lights: () => lightsOff(1, 2, 3) });
  LOG.mesh.visible = false; OBJ.ticket.serving = 2; drawTicketScreen(); G.flags.queueDone = true;
  place('luka', [60, DECK.y, 146, PI / 2]); place('chase', [57.5, DECK.y, 144.5, PI / 2]);
};
BEATS.hamarr = async () => {
  const L = ACTORS.luka, C = ACTORS.chase;
  if (G.mode !== 'play') await handoff({ mode: 'explore' });
  setCheckpoint('hamarr');
  await waitUntil(() => L.pos.x > 64);
  if (!BOSS) BOSS = new Boss();
  const b = BOSS;
  // 9.1 — the toll. The bridge shakes. A huge hand grips the edge of the deck from below.
  cine();
  musicCue('silence', 0.5);
  walk(L, [69, DECK.y, 145.5, PI / 2], { speed: 1.2, noGround: true }); walk(C, [66, DECK.y, 143.5, PI / 2], { speed: 1.2, noGround: true });
  CAM.shake(0.25); sfx('thump', V3(86, DECK.y, 156), 1); rumble(0.6, 0.8, 300);
  const edge = V3(84, DECK.y, DECK.z1 - 0.2);
  b.spawn(V3(edge.x, DECK.y - 5.6, DECK.z1 + 1.2), PI); b.actor.anim.setOverlay(null); b.actor.anim.overlayW = 0;
  b.actor.anim.play(K(1, [[0, { armL: [-170, 0, 20], foreL: [-60, 0, 0], armR: [-170, 0, -20], foreR: [-60, 0, 0], spine: [20, 0, 0] }], [1, { armL: [-170, 0, 20], foreL: [-60, 0, 0], armR: [-170, 0, -20], foreR: [-60, 0, 0], spine: [20, 0, 0] }]], { hold: 1 }), { instant: true });
  CAM.shotFn((t, p, a) => { p.set(76.5, DECK.y + 0.6, 148.5); a.copy(edge).add(V3(0, 0.4, 0)); }, { omega: 3, lens: 24, fStop: 2.8, handheld: 0.4 });
  CAM.focusOn(() => edge.clone().add(V3(0, 0.5, 0)));
  await wait(1.6);
  CAM.shake(0.3); sfx('crack', edge, 1); fxBurst('dust', edge, { n: 30, scale: 1.5 });
  // he hauls himself up: six metres, grey-blue hide crusted with ice and moss
  await tween(v => { b.pos.set(edge.x, lerp(DECK.y - 5.6, DECK.y - 1.0, v), lerp(DECK.z1 + 1.2, DECK.z1 + 0.4, v)); }, 0, 1, 2.2, EASE.inOutQuad);
  b.actor.anim.play('hRoar', { fade: 0.4 });
  CAM.shotFn((t, p, a) => { p.set(lerp(76.5, 73, smoothstep(0, 2, t)), DECK.y + 0.55, lerp(148.5, 147.5, smoothstep(0, 2, t))); a.copy(b.headPos(_v[1])); }, { omega: 2.4, lens: 18, fStop: 5.6, handheld: 0.4 });
  await tween(v => { b.pos.set(edge.x, lerp(DECK.y - 1.0, DECK.y, v), lerp(DECK.z1 + 0.4, DECK.z1 - 3.4, v)); }, 0, 1, 1.4, EASE.inOutQuad);
  // he lands: the operator stumbles backward, recovers, re-frames up at him
  sfx('thump', b.pos, 1.4); CAM.shake(0.4); rumble(1, 1, 300); fxBurst('snow', b.pos, { n: 80, scale: 2.4 });
  b.actor.anim.setOverlay('hIdle', 4); b.yaw = yawTo(b.pos, L.pos);
  musicCue('hamarr', 0.5);
  await wait(1.0);
  CAM.focusOn(head('hamarr'));
  await say('hamarr', 'TOLL.', { caps: true });
  CAM.pull(head('chase'), 0.4);
  await say('chase', 'Did he just say toll?');
  CAM.pull(head('hamarr'), 0.4);
  await say('hamarr', 'TOLL. OR. REVIEW.', { caps: true });
  CAM.pull(head('luka'), 0.4);
  await say('luka', 'Neither.');
  CAM.pull(head('hamarr'), 0.4);
  b.actor.anim.play('hSlam', { speed: 0.6 });
  await say('hamarr', '(raising the totem) WORST. SERVICE. EVER.', { caps: true });
  UI.bossBar(true, 'Dodgy Hamarr', 'Troll of the Comment Section');
  setEnv('boss', 3);
  await handoff({ mode: 'boss', yaw: yawTo(L.pos, b.pos) });
  b.setState('idle'); b.cool = 1.5; b.actor.anim.stop(0.3);
  G.combat = true; G.arenaFree = false;
  await waitUntil(() => b.state === 'dead');
  G.combat = false;
};
// 70% — Chase runs ahead and is caught by the Reply
async function runGrab70(b) {
  const C = ACTORS.chase, L = ACTORS.luka;
  CHASE.ai = false; b.scripted = true; b.atk = null; b.setState('scripted');
  bark('chase', 'I’ve got this! I’ve got this!', { force: true });
  walk(C, b.pos.clone().addScaledVector(fwdFromYaw(b.yaw), 2.8).setY(DECK.y), { speed: 5, noGround: true });
  await waitUntil(() => !C.walkTo || dist2D(C.pos, b.pos) < 3.6, 3);
  C.walkTo = null;
  b.yaw = yawTo(b.pos, C.pos); b.actor.anim.play('hReach', { fade: 0.1 }); b.actor.props.handGlow.material.opacity = 0.8;
  await wait(0.9);
  b.grab(C, false); C.anim.setOverlay('frozen', 10);
  sfx('roar', b.pos, 0.8); CAM.shake(0.2);
  prompt('throw', 'Hit the hand!', { key: 'throw', dur: 6 });
  let hit = false;
  addThrowTarget({ id: 'hand', get pos() { return b.actor.props.handGlow.getWorldPosition(_v[19]); }, r: 0.9, chase: false, hit: () => { hit = true; } });
  const ok = await waitUntil(() => { if (hit) return true; if (PLAYER.state === 'attack' && PLAYER.stateT >= PLAYER.move.s * F && dist2D(PLAYER.pos, b.actor.props.handGlow.getWorldPosition(_v[20])) < 3.6) return true; return false; }, 6);
  removeThrowTarget('hand'); promptHide('throw');
  b.releaseGrab(ok, false);
  C.anim.setOverlay(null); C.pos.y = DECK.y; act(C, 'roll');
  C.place(C.pos.clone().add(fwdFromYaw(b.yaw + PI).multiplyScalar(-1.5)).setY(DECK.y), C.yaw);
  if (!ok) damagePlayer(15 * diff().dmg, b.pos, false); else { hitstop(90); CAM.shake(0.3); sfx('hit', b.pos, 1); }
  await wait(0.8);
  await say('luka', 'STAY BACK.');
  await say('chase', '(shaken) Okay. Okay.');
  CHASE.ai = true; b.scripted = false; b.setState('idle'); b.cool = 1.4;
}
// 35% — "Good." A short scripted sequence, still in one take.
async function runGood35(b) {
  const C = ACTORS.chase, L = ACTORS.luka;
  await waitUntil(() => PLAYER.state === 'free' || PLAYER.state === 'hit', 3);
  cine();
  b.atk = null; b.setState('scripted');
  b.yaw = yawTo(b.pos, L.pos);
  // he backhands Luka into a pillar; the camera tracks the flight and the impact
  const pl = OBJ.pillars.reduce((best, p) => (dist2D(V3(p.px, 0, p.pz), L.pos) < dist2D(V3(best.px, 0, best.pz), L.pos) ? p : best));
  const toPl = V3(pl.px, DECK.y, pl.pz); const land = toPl.clone().addScaledVector(_v[1].copy(L.pos).sub(toPl).setY(0).normalize(), 1.1); land.y = DECK.y;
  walk(L, L.pos.clone(), { snap: true });
  L.yaw = yawTo(L.pos, b.pos);
  b.actor.anim.play('hBackhand');
  CAM.shotFn((t, p, a) => { const m = L.pos.clone().lerp(b.pos, 0.35); p.copy(m).add(V3(0, 2.2, 0)).addScaledVector(fwdFromYaw(yawTo(L.pos, b.pos) + PI / 2, _v[2]), 7); a.copy(L.pos).add(V3(0, 1.2, 0)); }, { omega: 4, lens: 24, fStop: 4, handheld: 0.6 });
  CAM.focusOn(head('luka'));
  await wait(0.55);
  sfx('hit', L.pos, 1, 0.7); hitstop(80); CAM.shake(0.35);
  act(L, 'knockdown', { hold: true });
  const from = L.pos.clone();
  await tween(v => { L.pos.lerpVectors(from, land, v); L.pos.y = DECK.y + Math.sin(v * PI) * 1.4; }, 0, 1, 0.55, EASE.outQuad);
  sfx('thump', land, 1.2); CAM.shake(0.5); fxBurst('dust', toPl.clone().add(V3(0, 1.5, 0)), { n: 40, scale: 1.5 }); rumble(1, 1, 220);
  damagePlayer(8 * diff().dmg, b.pos, true);
  // Hamarr raises the totem to finish him
  b.yaw = yawTo(b.pos, L.pos);
  walkBossTo(b, L.pos.clone().addScaledVector(_v[3].copy(b.pos).sub(L.pos).setY(0).normalize(), 4.6));
  await wait(1.2);
  b.actor.anim.play(K(1.2, [[0, 'hIdle'], [1.0, { spine: [-10, 0, 0], chest: [-12, 0, 0], armR: [-200, 0, -10], foreR: [-40, 0, 0], armL: [-190, 0, 10], foreL: [-40, 0, 0] }, 'outQuad'], [1.2, { spine: [-10, 0, 0], chest: [-12, 0, 0], armR: [-200, 0, -10], foreR: [-40, 0, 0], armL: [-190, 0, 10], foreL: [-40, 0, 0] }]], { hold: 1 }));
  b.actor.props.totemTop.material.color.setRGB(3.4, 0.5, 0.3);
  CAM.shotFn((t, p, a) => { p.copy(L.pos).add(V3(0, 0.6, 0)).addScaledVector(fwdFromYaw(yawTo(L.pos, b.pos) + 2.6, _v[2]), 2.0); a.copy(b.actor.props.totemTop.getWorldPosition(_v[4])).lerp(b.headPos(_v[5]), 0.4); }, { omega: 2.2, lens: 24, fStop: 2.8, handheld: 0.45 });
  CAM.pull(head('hamarr'), 0.6);
  await wait(1.6);
  // Chase's arrow hits the glowing top face of the totem; it bursts in teal sparks; Hamarr reels
  C.place(C.pos.clone(), yawTo(C.pos, b.pos)); chaseBowToHand(true); C.anim.setOverlay('bowReady', 20, 'upper');
  act(C, 'shoot');
  await wait(0.36);
  const tp = b.actor.props.totemTop.getWorldPosition(V3());
  fireArrow(C.boneWorld('handL', V3()), tp, { commanded: true });
  await wait(Math.max(0.15, C.pos.distanceTo(tp) / 36));
  fxBurst('sparks', tp, { r: 0.4, g: 3, b: 2.8, n: 60 }); fxBurst('flash', tp, { scale: 2.5, r: 0.5, g: 3, b: 3 }); sfx('shatter', tp, 1); CAM.shake(0.3);
  b.actor.props.totemTop.material.color.setRGB(0.4, 3.4, 3.2);
  b.actor.anim.play('hStun', { fade: 0.1 }); sfx('roar', b.pos, 1);
  await wait(1.2);
  CAM.shotFn((t, p, a) => { p.copy(L.pos).add(V3(0, 1.5, 0)).addScaledVector(fwdFromYaw(L.yaw + 0.9, _v[2]), 2.4); a.copy(L.headWorld(_v[3])); }, { omega: 2, lens: 50, fStop: 2.4, handheld: 0.3 });
  CAM.pull(head('luka'), 0.5);
  L.anim.clipHold = false; L.anim.stop(0.2); act(L, 'getUp');
  await wait(0.9);
  look(L, 'chase', 0.4);
  await say('luka', '(getting up) …Good.', { slow: 1.2 });
  trophy('Good.');
  await wait(0.6);
  CAM.pull(head('chase'), 0.6);
  await say('chase', 'Did you just say “good”?');
  CAM.pull(head('luka'), 0.4);
  await say('luka', 'Shoot.');
  look(L, null);
  await handoff({ mode: 'boss', dur: 0.9, yaw: yawTo(L.pos, b.pos) });
  b.scripted = false; b.setState('idle'); b.cool = 1.0; b.actor.anim.stop(0.3);
}
function walkBossTo(b, p) { const from = b.pos.clone(); b.yaw = yawTo(b.pos, p); b.actor.speed = 1.4; return tween(v => b.pos.lerpVectors(from, p, v), 0, 1, 1.2).then(() => { b.actor.speed = 0; }); }
// mid-fight stun: Luka leaps up and buries the axe in his shoulder (150 damage, not lethal)
async function runBossShoulder(b) {
  const L = ACTORS.luka;
  cine(); b.setState('scripted');
  CAM.shotFn((t, p, a) => { const m = b.pos.clone().lerp(L.pos, 0.4); p.copy(m).add(V3(0, 2.4, 0)).addScaledVector(fwdFromYaw(yawTo(L.pos, b.pos) - PI / 2, _v[1]), 7.5); a.copy(b.pos).add(V3(0, 3.6, 0)); }, { omega: 4, lens: 24, fStop: 4, handheld: 0.6 });
  CAM.focusOn(() => b.pos.clone().add(V3(0, 3.6, 0)));
  const from = L.pos.clone(), sh = b.actor.boneWorld('shL', V3()); sh.y -= 0.6;
  L.yaw = yawTo(L.pos, b.pos);
  act(L, 'roll'); sfx('whoosh', L.pos, 0.8);
  await tween(v => { L.pos.lerpVectors(from, sh, EASE.outQuad(v)); L.pos.y = lerp(from.y, sh.y, EASE.outQuad(v)) + Math.sin(v * PI) * 1.2; }, 0, 1, 0.55);
  act(L, 'overhead'); await wait(0.25);
  hitstop(160); CAM.shake(0.6); sfx('hit', sh, 1, 0.6); sfx('frost', sh, 1); fxBurst('frost', sh, { n: 50 }); fxBurst('ichor', sh, { n: 30 }); rumble(1, 1, 250);
  b.hp = Math.max(b.maxHp * 0.02, b.hp - 150); b.checkEvents();
  sfx('roar', b.pos, 1); b.actor.anim.play('hRoar', { fade: 0.1 });
  await wait(0.5);
  const land = from.clone().addScaledVector(_v[2].copy(from).sub(b.pos).setY(0).normalize(), 1.0); land.y = DECK.y;
  const top = L.pos.clone();
  await tween(v => { L.pos.lerpVectors(top, land, v); L.pos.y = lerp(top.y, DECK.y, EASE.inQuad(v)); }, 0, 1, 0.5);
  sfx('thump', L.pos, 0.6);
  await handoff({ mode: 'boss', dur: 0.8, yaw: yawTo(L.pos, b.pos) });
  b.scripted = false; b.setState('idle'); b.cool = 1.2; b.stun = 0;
}
// 9.3 — Close the Deal: run up his forearm, wrench the totem, full circle, into his jaw
async function runBossFinale(b) {
  const L = ACTORS.luka, C = ACTORS.chase;
  b.finisherReady = false; promptHide('finisher');
  cine();
  G.stats.finishers++;
  const P0 = L.pos.clone(), hand = b.actor.boneWorld('handL', V3()), shoulder = b.actor.boneWorld('shL', V3());
  // fully handheld (0.8), 24 mm, running alongside Luka
  CAM.shotFn((t, p, a) => { p.copy(L.pos).add(V3(0, 1.4, 0)).addScaledVector(fwdFromYaw(L.yaw - PI / 2, _v[1]), 2.4).addScaledVector(fwdFromYaw(L.yaw, _v[2]), -0.6); a.copy(L.pos).add(V3(0, 1.4, 0)).addScaledVector(fwdFromYaw(L.yaw, _v[3]), 2.5); }, { omega: 6, lens: 24, fStop: 2.8, handheld: 0.8 });
  CAM.focusOn(head('luka'));
  L.yaw = yawTo(L.pos, hand);
  act(L, 'dodge'); sfx('whoosh', L.pos, 1);
  await tween(v => { L.pos.lerpVectors(P0, hand, v); }, 0, 1, 0.5);
  L.yaw = yawTo(hand, shoulder);
  await tween(v => { L.pos.lerpVectors(hand, shoulder, v); L.speed = 5; }, 0, 1, 0.6);
  // he wrenches the totem out of the troll's grip
  const T = b.actor.props.totem; (T.parent || b.actor.bones.handR).remove(T); L.bones.handR.add(T); T.position.set(0, -0.12, 0.1); T.rotation.set(PI / 2, 0, 0); T.scale.setScalar(0.42);
  sfx('wood', L.pos, 1); CAM.shake(0.3);
  // swings it in a full circle (the camera ducks under it)
  CAM.shotFn((t, p, a) => { p.copy(L.pos).add(V3(0, 0.3, 0)).addScaledVector(fwdFromYaw(L.yaw + PI * 0.75, _v[1]), 2.2); a.copy(L.pos).add(V3(0, 1.6, 0)); }, { omega: 7, lens: 24, fStop: 2.8, handheld: 0.8 });
  const y0 = L.yaw;
  act(L, 'sweep');
  await tween(v => { L.yaw = y0 + v * TAU; }, 0, 1, 0.7, EASE.inQuad);
  // smash: time slows to 0.25×; DOF drops to f/1.4; ice shards and broken teeth hang in the air
  const jaw = b.actor.headWorld(V3()).add(V3(0, -0.4, 0));
  G.timeScale = 0.25; slowmo(0.25, 1.6);
  hitstop(200); CAM.shake(0.7); sfx('hit', jaw, 1, 0.5); sfx('shatter', jaw, 1); rumble(1, 1, 400);
  for (let i = 0; i < 70; i++) FX.soft.emit(jaw.x + (frand() - 0.5) * 0.8, jaw.y + (frand() - 0.5) * 0.8, jaw.z + (frand() - 0.5) * 0.8, (frand() - 0.5) * 1.6, (frand() - 0.2) * 1.2, (frand() - 0.5) * 1.6, 3.2, 0.05, 0.04, 0.9, 0.95, 1, 1, 0.4, 0.5, 0.2);
  fxBurst('frost', jaw, { n: 60, scale: 1.5 }); fxBurst('flash', jaw, { scale: 3 });
  CAM.shotFn((t, p, a) => { p.copy(jaw).add(V3(-2.2, -0.4, 1.6)); a.copy(jaw); }, { omega: 5, lens: 35, fStop: 1.4, fDur: 0.2, handheld: 0.3 });
  CAM.pull(() => jaw, 0.2);
  b.actor.anim.play('hFall', { fade: 0.2, speed: 0.4 });
  await new Promise(r => later(1.4, r, true));
  G.timeScale = 1; G.slowT = 0;
  // he topples backwards off the deck onto the ice below, which cracks but holds
  T.scale.setScalar(1); L.bones.handR.remove(T); R.scene.add(T); T.position.copy(L.pos).add(V3(1, 0.3, 0)); T.rotation.set(0, 0, PI / 2);
  const land = L.pos.clone(); land.y = DECK.y; const LP0 = L.pos.clone();
  tween(v => { L.pos.lerpVectors(LP0, land.clone().add(V3(-1.5, 0, 0)), v); L.pos.y = lerp(LP0.y, DECK.y, EASE.inQuad(v)); }, 0, 1, 0.6);
  const b0 = b.pos.clone(), fall = V3(b0.x + 2, 0.2, DECK.z1 + 5);
  CAM.shotFn((t, p, a) => { p.set(b0.x - 8, DECK.y + 3.5, DECK.z1 - 6); a.copy(b.pos).add(V3(0, 2, 0)); }, { omega: 2.4, lens: 24, fStop: 4, handheld: 0.4 });
  CAM.focusOn(() => b.pos.clone().add(V3(0, 2, 0)));
  b.setState('dead'); b.finisherReady = false;
  await tween(v => { b.pos.set(lerp(b0.x, fall.x, v), lerp(b0.y, fall.y, EASE.inQuad(v)) + Math.sin(v * PI) * 1.5, lerp(b0.z, fall.z, v)); b.actor.root.rotation.x = -v * 1.4; }, 0, 1, 1.6);
  sfx('thump', fall, 1.5); sfx('crack', fall, 1.2); CAM.shake(0.5); fxBurst('ice', fall, { n: 60, scale: 3 }); fxBurst('snow', fall, { n: 80, scale: 3 }); rumble(1, 1, 400);
  musicCue('silence', 0.2);
  UI.bossBar(false);
  CAM.shotFn((t, p, a) => { p.set(fall.x - 2, DECK.y + 1.8, DECK.z1 - 1.2); a.copy(fall).add(V3(0, 1, 0)); }, { omega: 1.6, lens: 50, fStop: 2.8, handheld: 0.25 });
  look(L, () => fall); look(C, () => fall);
  place(C, [Math.max(DECK.x0 + 2, L.pos.x - 3), DECK.y, DECK.z1 - 2.4, PI / 2]);
  await wait(3.2);
  // silence; then, from below, very small
  await say('hamarr', '…ok. fair enough.', { tiny: true, dur: 2.8 });
  b.actor.anim.speed = 0;
  trophy('…ok. fair enough.');
  addSilver(600, 'Dodgy Hamarr'); addCommission(500);
  b.alive = false;
  await wait(1.5);
  setCheckpoint('walk_home');
}

// ---------- BEAT 10 — Not Ready ----------
SETUPS.walk_home = () => {
  setEnv('boss', 0); setSpace('bridge');
  worldState({ tree: 'pyre', ward: false, axe: 'none', slate: 'none', smiths: 'none', zee: 'none', beanie: false, weapon: 'axe', lights: () => lightsOff(1, 2, 3) });
  LOG.mesh.visible = false; G.flags.queueDone = true;
  place('luka', [86, DECK.y, 151, -PI / 2]); place('chase', [84, DECK.y, 150, -PI / 2]);
  if (!BOSS) BOSS = new Boss();
  BOSS.alive = false; BOSS.actor.setVisible(true); BOSS.actor.place(V3(86, 0.2, DECK.z1 + 5), PI); BOSS.actor.root.rotation.x = -1.4;
};
BEATS.walk_home = async () => {
  const L = ACTORS.luka, C = ACTORS.chase;
  setCheckpoint('walk_home');
  setEnv('horni', 10); musicCue('explore', 4);
  // 10.1 — the argument (a walking two-shot that favours each speaker)
  look(L, null); look(C, null);
  await handoff({ mode: 'explore', yaw: -PI / 2 });
  startConvo([
    ['chase', '(breathless, elated) We did it — did you see — I hit the — right in the —'],
    ['luka', 'You ran ahead.'],
    ['chase', 'I helped!'],
    ['luka', 'You helped a troll nearly kill you.'],
    ['chase', 'And then I helped you not die! That’s one-for-one, that’s a —'],
    ['luka', 'That’s not how it works.', 1.6],
    ['chase', 'He was just angry, Luka. Under all of it. He was just someone who was really, really angry.'],
    ['luka', 'Angry things still kill you.'],
    ['chase', 'Is that how you see the customers?'],
    ['wait', 1.6],
    ['luka', 'No.'],
    ['chase', 'Is that how you see me?', 2.4],
    ['chase', '(quietly) In sales, silence is a yes.'],
    ['luka', '(without turning) We’re not in sales.'],
    ['chase', 'We’re literally always in sales.'],
    ['luka', 'We go home. One night. You’re not ready.'],
    ['chase', 'I just helped you kill a troll.'],
    ['luka', 'Home.'],
  ]);
  prompt('move', 'Head back to the bridgehead', { key: 'move', dur: 5 });
  await waitUntil(() => dist2D(L.pos, MARKS.ladder.pos) < 3.2 && (!DLG.convo || DLG.convo.i >= 12));
  await waitUntil(() => !DLG.convo || !DLG.convo.active, 30);
  // 10.2 — the shortcut and the cloak wipe
  cine();
  const lad = MARKS.ladder;
  await walk(L, lad.pos.clone(), { speed: 1.3, yaw: 0 });
  act(L, 'kick'); await wait(0.3); sfx('wood', lad.pos, 1); toast('<b>Shortcut opened</b>', ''); sfx('chime', null, 0.6);
  CAM.shotFn((t, p, a) => { p.copy(L.pos).add(V3(0.4, 1.9, -1.6)); a.copy(L.pos).add(V3(0, 2.2, 2)); }, { omega: 3, lens: 28, fStop: 2.8, handheld: 0.35 });
  CAM.focusOn(head('luka'));
  act(L, 'climb');
  const l0 = L.pos.clone();
  tween(v => { L.pos.set(l0.x, l0.y + v * 2.8, l0.z + v * 1.1); }, 0, 1, 3.4, EASE.linear);
  later(1.2, () => { if (!G.eggs.has('returns')) { foundEgg('returns', CODEX.returns[0]); bark('chase', 'He had a returns policy.', { force: true }); } });
  // the camera passes tight behind his cloak; on the other side, they're walking through the longhouse gate
  CAM.shotFn((t, p, a) => { p.copy(L.pos).add(V3(0, 1.3 + t * 0.2, -0.45)); a.copy(L.pos).add(V3(0, 1.4, 2)); }, { omega: 6, lens: 28, fStop: 2.8, handheld: 0.4 });
  await wait(1.9);
  await wipe(3, 0.45, 0.35, 0.9, async () => {
    L.anim.stop(0); setEnv('home', 0); setSpace('yard');
    FLOORS.forEach(f => { if (f.tag === 'booth') f.active = false; });
    worldState({ pyre: 'cold', ward: false, smiths: 'none', zee: 'none', door: false, lights: () => lightsYard(true) });
    place(L, [6.2, null, -57.5, PI]); place(C, [4.6, null, -56.0, PI]);
    walk(L, [5.6, null, -66.0], { speed: 1.2 }); walk(C, [4.0, null, -64.5], { speed: 1.2 });
    CAM.shotFn((t, p, a) => { p.copy(L.pos).add(V3(0.3, 1.7, 1.9)); a.copy(L.pos).add(V3(-0.4, 1.4, -6)); }, { snap: true, omega: 3, lens: 28, fStop: 2.8, handheld: 0.35 });
    musicCue('silence', 2);
  });
  setCheckpoint('knock');
  await wait(1.6);
};

// ---------- BEAT 11 — The Knock ----------
SETUPS.knock = () => {
  setEnv('home', 0); setSpace('yard');
  worldState({ tree: 'pyre', pyre: 'cold', ward: false, axe: 'none', slate: 'none', smiths: 'none', zee: 'none', beanie: false, weapon: 'axe', door: false, lights: () => lightsYard(true) });
  LOG.mesh.visible = false;
  place('luka', [5.6, null, -66.0, PI]); place('chase', [4.0, null, -64.5, PI]);
};
BEATS.knock = async () => {
  const L = ACTORS.luka, C = ACTORS.chase, J = ACTORS.jarrad, H = OBJ.house;
  setCheckpoint('knock');
  if (G.mode !== 'play') await handoff({ mode: 'explore', yaw: yawTo(L.pos, MARKS.door_out.pos) });
  CHASE.ai = true;
  prompt('interact', 'Go inside', { key: 'move', dur: 5 });
  await waitUntil(() => dist2D(L.pos, MARKS.door_out.pos) < 2.6);
  // 11.1 — inside Store 001: low firelight
  cine();
  setLight(0, { pos: V3(-15, H.FY + 0.9, -92), color: 0xff8a3a, intensity: 16, flicker: 0.6, dist: 14 });
  FIRE.on = true; FIRE.mode = 'pit'; FIRE.pos.set(-15, H.FY + 0.2, -92); FIRE.target = 1; FIRE.level = 0.6; FIRE.haze = false;
  setLight(3, { pos: V3(H.locker.x, H.G + 0.45, H.locker.z), color: 0xff2010, intensity: 1.6, flicker: 0.3, dist: 3.2 });
  lightsOff(1, 2);
  await tween(v => OBJ.door.rotation.y = -v * 1.5, 0, 1, 0.9); OBJ.doorCol.off = true; sfx('creak', OBJ.door.position, 0.6);
  CAM.shotFn(SHOT.track(L, [-0.5, 1.7, -2.4], [0, 1.5, 3]), { omega: 2.4, lens: 28, fStop: 2.8, handheld: 0.3 });
  CAM.focusOn(head('luka'));
  walk(C, V3(-13.6, H.FY, -91.2), { speed: 1.1, timeout: 15, yOff: 0 });
  await walk(L, V3(-9.5, H.FY, -92), { speed: 1.1, timeout: 15 });
  setEnv('interior', 1.5); setSpace('interior');
  await tween(v => OBJ.door.rotation.y = -(1 - v) * 1.5, 0, 1, 0.9); OBJ.doorCol.off = false; sfx('wood', OBJ.door.position, 0.6);
  look(C, 'luka');
  await say('chase', '(heading for the stove) Tea?');
  await say('luka', 'No.', { look: false });
  await say('chase', 'I’m making tea.');
  look(C, () => FIRE.pos);
  // 50 mm, f/2, a slow push as Luka stands in front of the blank plaque and touches it. No music. Fire only.
  const plq = H.blankPlaque;
  await walk(L, MARKS.plaque.pos.clone(), { speed: 0.8, yaw: PI });
  CAM.shotFn((t, p, a) => { const h = L.headWorld(_v[1]); p.copy(h).add(V3(0.85, 0.05, 1.7 - t * 0.06)); a.copy(h).lerp(plq, 0.45); }, { omega: 1.4, lens: 50, fStop: 2.0, handheld: 0.2 });
  CAM.pull(() => plq, 1.4);
  act(L, 'touch_high');
  await wait(2.6);
  CAM.pull(head('luka'), 1.2);
  await say('luka', '(very quiet, to the plaque) I said no to this job three times.', { slow: 1.2 });
  await wait(1.0);
  await say('luka', 'I was not supposed to be the one who stayed.', { slow: 1.2 });
  await wait(1.2);
  // 11.2 — knock, knock, knock
  sfx('knock', OBJ.door.position.clone().add(V3(1, 1, 0)), 1.3);
  CAM.shotFn((t, p, a) => { p.copy(L.headWorld(_v[1])).add(V3(0.85, 0.05, 1.5)); a.set(H.X1, H.FY + 1.3, H.CZ); }, { omega: 9, lens: 35, fStop: 2.4, handheld: 0.5 });
  CAM.pull(() => V3(H.X1, H.FY + 1.3, H.CZ), 0.25);
  L.anim.stop(0.2);
  await wait(1.0);
  CAM.shotFn((t, p, a) => { const h = L.headWorld(_v[1]); p.copy(h).add(V3(0.85, 0.05, 1.5)); a.copy(h); }, { omega: 9, lens: 50, fStop: 2.0, handheld: 0.4 });
  CAM.pull(head('luka'), 0.25);
  await wait(0.5);
  look(L, 'chase');
  await say('luka', '(low, urgent) Casual. Under the floor.');
  look(C, 'luka');
  await say('chase', 'What? Why —');
  await say('luka', 'Under. The. Floor.');
  // Chase lifts the trapdoor behind the counter and drops down
  const TD = H.trap;
  await walk(C, V3((TD.x0 + TD.x1) / 2 + 0.7, H.FY, (TD.z0 + TD.z1) / 2), { speed: 1.6, yaw: -PI / 2 });
  await tween(v => OBJ.trapLid.rotation.x = -v * 1.7, 0, 1, 0.5); sfx('wood', OBJ.trapLid.position, 0.6);
  const td = V3((TD.x0 + TD.x1) / 2, H.FY, (TD.z0 + TD.z1) / 2);
  FLOORS.forEach(f => { if (f === H.floor) f.active = false; });
  C.place(td.clone(), -PI / 2);
  C.anim.setOverlay('crouch', 10);
  await tween(v => C.pos.y = H.FY - v * 0.85, 0, 1, 0.5, EASE.inQuad);
  // the camera follows him down into the crawlspace: dust in slatted light, and the chained locker
  CAM.shotFn((t, p, a) => { const k = smoothstep(0, 4.5, t); p.set(lerp(td.x + 0.2, H.locker.x + 1.6, k), lerp(H.FY + 0.3, H.G + 0.42, smoothstep(0, 1.5, t)), lerp(td.z + 0.6, H.locker.z + 1.2, k)); a.set(lerp(td.x, H.locker.x, k), H.G + 0.35, lerp(td.z, H.locker.z, k)); }, { omega: 2.2, lens: 28, fStop: 2.0, handheld: 0.35 });
  CAM.focusOn(() => H.locker.clone());
  for (let i = 0; i < 30; i++) FX.soft.emit(H.locker.x + (frand() - 0.5) * 3, H.G + 0.2 + frand() * 0.5, H.locker.z + (frand() - 0.5) * 2, (frand() - 0.5) * 0.05, 0.02, (frand() - 0.5) * 0.05, 8, 0.012, 0.012, 1, 0.8, 0.6, 0.5, 0, 0, 0);
  C.place(V3(-8.6, H.G + 0.04, -93.2), PI); C.anim.setOverlay('prone', 10); C.anim.overlayW = 1;
  walk(C, MARKS.crawl.pos.clone(), { speed: 0.6, noGround: true, yaw: -PI / 2 });
  await wait(2.4);
  OBJ.trapLid.rotation.x = 0;
  // Chase presses his eye to a gap between the floorboards; the camera rises back up through the gap to Luka at the door
  const gap = V3(H.gap.x, H.FY, (H.gap.z0 + H.gap.z1) / 2);
  await wait(1.2);
  walk(L, MARKS.door_in.pos.clone(), { speed: 1.0, yaw: -PI / 2 });
  CAM.shotFn((t, p, a) => { const k = smoothstep(0, 3, t); p.set(lerp(H.locker.x + 1.6, gap.x - 0.05, k), lerp(H.G + 0.42, H.FY + 0.55, smoothstep(1.4, 3.4, t)), lerp(H.locker.z + 1.2, gap.z, k)); a.set(lerp(gap.x, H.X1, smoothstep(1.2, 3.4, t)), lerp(H.FY, H.FY + 1.3, smoothstep(1.2, 3.4, t)), gap.z); }, { omega: 2.2, lens: 28, fStop: 2.0, handheld: 0.35 });
  CAM.focusOn(() => C.eyes(V3()));
  await wait(1.8);
  CAM.pull(() => V3(H.X1, H.FY + 1.3, H.CZ), 1.0);
  await waitUntil(() => !L.walkTo, 6);
  // 11.3 — the Stranger
  J.setVisible(true); place(J, 'door_out'); J.yaw = -PI / 2; J.anim.setOverlay('holdBall', 50, 'armL'); J.anim.overlayW = 1; J.expr = 1; J.listen = true;
  setEnv('interior', 0);
  await tween(v => OBJ.door.rotation.y = -v * 1.5, 0, 1, 1.0); OBJ.doorCol.off = true; sfx('creak', OBJ.door.position, 0.7);
  for (let i = 0; i < 40; i++) FX.soft.emit(H.X1 + 0.2, H.FY + 0.5 + frand() * 1.8, H.CZ + (frand() - 0.5) * 1.6, -2.5 - frand() * 2, (frand() - 0.5) * 0.4, (frand() - 0.5) * 1.2, 1.8, 0.03, 0.02, 0.95, 0.97, 1, 0.9, 0, 0.3, 0.6);
  CAM.shotFn((t, p, a) => { const jh = J.headWorld(_v[1]), lh = L.headWorld(_v[2]); p.copy(lh).add(V3(-0.9, 0.0, -0.7)); a.copy(jh); }, { omega: 2.4, lens: 50, fStop: 2.0, handheld: 0.25 });
  CAM.pull(head('jarrad'), 0.8);
  look(J, 'luka'); look(L, 'jarrad');
  await wait(1.0);
  nameCard('jarrad');
  await say('jarrad', 'G’day! Lovely place. Bit hard to find, mind you — normally there’s a weird hum round here.');
  await say('jarrad', '(bright) Is this the 2IC?');
  CAM.pull(head('luka'), 0.4);
  await say('luka', 'No.');
  CAM.pull(head('jarrad'), 0.4);
  await say('jarrad', '(not a flicker — as if Luka said nothing at all) Great! So it is.');
  CAM.pull(head('luka'), 0.4);
  await wait(1.2); // Luka's eyes narrow
  CAM.pull(head('jarrad'), 0.4);
  await say('jarrad', 'Look, I’ll keep it quick, I know you’re busy.');
  act(J, 'spin_ball'); J.props.ball.userData.spin = 1;
  await say('jarrad', '(spins the volleyball on one finger) I’d like to speak to the manager.');
  CAM.pull(head('luka'), 0.5);
  await say('luka', '…The manager is dead.', { slow: 1.2 });
  CAM.pull(head('jarrad'), 0.5);
  await say('jarrad', '(warmly) Then I’ll speak to you.');
  J.props.ball.userData.spin = 0;
  // 11.4 — the last rationed silence, then one long pull back
  CAM.shotFn((t, p, a) => { const m = J.headWorld(_v[1]).lerp(L.headWorld(_v[2]), 0.5); p.copy(m).add(V3(0.2, -0.05, 2.6)); a.copy(m); }, { omega: 1.6, lens: 50, fStop: 2.4, handheld: 0.2 });
  CAM.focusOn(() => J.headWorld(V3()).lerp(L.headWorld(_v[3]), 0.5));
  await wait(3.0);
  await theEnd();
};
async function theEnd() {
  hideSub(); stopConvo();
  const H = OBJ.house, C = ACTORS.chase, gap = V3(H.gap.x, H.FY, (H.gap.z0 + H.gap.z1) / 2);
  musicCue('ending', 1);
  const pts = [
    [gap.x + 1.2, H.FY + 1.6, gap.z + 1.6], [gap.x, H.FY + 0.3, gap.z], [gap.x - 0.15, H.G + 0.35, gap.z + 0.2], [H.locker.x + 0.9, H.G + 0.4, H.locker.z + 1.2],
    [-12.1, H.G + 0.35, H.Z1 - 0.1], [-12.1, H.G + 0.5, H.Z1 + 2.5], [-8, H.G + 8, H.Z1 + 24], [10, H.G + 40, H.Z1 + 75], [40, H.G + 85, H.Z1 + 140],
  ];
  const aims = [
    [gap.x, H.FY + 1.4, gap.z], [gap.x, H.G + 0.3, gap.z - 0.2], [C.eyes(V3()).x, H.G + 0.3, gap.z - 0.4], [H.locker.x, H.G + 0.3, H.locker.z],
    [-12.1, H.G + 0.4, H.Z1 + 4], [-12.1, H.G + 1.0, H.Z1 - 2], [-14, H.G + 1.0, H.CZ], [-12, H.G, H.CZ], [-200, 120, 600],
  ];
  CAM.shotFn(SHOT.path(pts, aims, 22, EASE.inOutSine), { omega: 2.0, lens: 24, lensDur: 8, fStop: 2.8, handheld: 0.25 });
  CAM.focusOn(() => CAM.final.aim);
  later(3.5, () => { CAM.focusOverride = null; });
  await wait(4.5);
  setEnv('home', 3); setSpace('open'); FIRE.haze = false;
  await wait(10);
  // the falling snow gathers into the title letters
  UI.endTitle();
  await wait(7.5);
  CAM.lensTo(18, 6);
  await wait(2.5);
  G.mode = 'end';
  trophy('Full Bars'); if (SETTINGS.difficulty === 'gow') trophy('Give Me God of Warranty');
  setCheckpoint('grove'); Store.del('save');
  UI.showEnd();
  musicCue('credits', 3);
}
BEATS.end = async () => { if (G.mode !== 'end') await theEnd(); };
