// ================= INPUT =================
// Keyboard & mouse, gamepad, touch (§7.2). Everything maps to named actions; a 10-frame input buffer.
const DEFAULT_BINDS = {
  up: 'KeyW', down: 'KeyS', left: 'KeyA', right: 'KeyD', light: 'Mouse0', heavy: 'KeyE', aim: 'Mouse2', callback: 'KeyR', shield: 'KeyQ', dodge: 'Space',
  sprint: 'ShiftLeft', chase: 'KeyF', finisher: 'KeyV', rage: 'KeyZ', promoL: 'Digit1', promoH: 'Digit2', quickturn: 'KeyC', interact: 'KeyE', lockon: 'Tab', pause: 'Escape',
};
const ACTION_LABELS = { up: 'Move forward', down: 'Move back', left: 'Move left', right: 'Move right', light: 'Light attack / Throw', heavy: 'Heavy attack (hold to charge)', aim: 'Aim', callback: 'Callback', shield: 'Shield / Price Match', dodge: 'Dodge (double tap to roll)', sprint: 'Sprint', chase: 'Command Chase', finisher: 'Close the Deal', rage: 'End-of-Month Rage', promoL: 'Runic Promo (light)', promoH: 'Runic Promo (heavy)', quickturn: 'Quick turn', interact: 'Interact', lockon: 'Lock-on', pause: 'Pause' };
const INPUT = {
  move: { x: 0, y: 0 }, look: { x: 0, y: 0 }, held: {}, pressed: new Set(), released: new Set(), buffer: [], device: IS_TOUCH ? 'touch' : 'kbm',
  keys: new Set(), mouse: new Set(), locked: false, weight: 1, binds: null, rebinding: null, padPrev: [], padIndex: -1, touch: { stick: null, look: null, stickV: { x: 0, y: 0 }, btn: {} },
  lastDodge: -9, anyKey: false, enabled: true, mouseDX: 0, mouseDY: 0,
  lockFailed: false, lockErrors: 0, lockLostT: -1e9, lockT: -1e9, lastTouchT: -1e9, pausePressT: -1e9, pauseReleaseT: -1e9,
};
function keyName(code) {
  if (!code) return '—';
  if (code.startsWith('Mouse')) return ['LMB', 'MMB', 'RMB', 'M4', 'M5'][+code.slice(5)] || code;
  return code.replace(/^Key/, '').replace(/^Digit/, '').replace('ShiftLeft', 'Shift').replace('ShiftRight', 'R-Shift').replace('Space', 'Space').replace('Escape', 'Esc').replace('ControlLeft', 'Ctrl').replace(/^Arrow/, '');
}
const PAD_GLYPHS = { light: 'RB', heavy: 'RT', aim: 'LT', callback: 'Y', shield: 'LB', dodge: 'A', sprint: 'L3', chase: 'X', finisher: 'R3', rage: 'L3+R3', promoL: 'LB+RB', promoH: 'LB+RT', quickturn: '↓', interact: 'RB', move: 'L-Stick', look: 'R-Stick', pause: '☰', throw: 'RB' };
const TOUCH_GLYPHS = { light: 'Light', heavy: 'Heavy', aim: 'Throw', callback: 'Throw', shield: 'Shield', dodge: 'Dodge', sprint: 'Stick', chase: 'Chase', finisher: 'Tap', rage: 'Rage', interact: 'Tap', move: 'Stick', look: 'Drag', throw: 'Release', promoL: 'Rage', promoH: 'Rage' };
function glyph(action) {
  if (INPUT.device === 'pad') return PAD_GLYPHS[action] || action;
  if (INPUT.device === 'touch') return TOUCH_GLYPHS[action] || action;
  if (action === 'move') return 'WASD'; if (action === 'look') return 'Mouse'; if (action === 'throw') return keyName(INPUT.binds.light);
  return keyName(INPUT.binds[action]);
}
function actionsFor(code) { const out = []; for (const a in INPUT.binds) if (INPUT.binds[a] === code) out.push(a); if (code === 'ArrowUp') out.push('up'); if (code === 'ArrowDown') out.push('down'); if (code === 'ArrowLeft') out.push('left'); if (code === 'ArrowRight') out.push('right'); return out; }
function press(a) { if (!INPUT.held[a]) { if (a === 'pause') INPUT.pausePressT = performance.now(); INPUT.pressed.add(a); INPUT.buffer.push({ a, t: G.realTime }); if (INPUT.buffer.length > 8) INPUT.buffer.shift(); } INPUT.held[a] = true; }
function release(a) { if (INPUT.held[a]) { INPUT.released.add(a); if (a === 'pause') INPUT.pauseReleaseT = performance.now(); } INPUT.held[a] = false; }
function consumeBuffered(a, win = 10 * F) { for (let i = INPUT.buffer.length - 1; i >= 0; i--) { const b = INPUT.buffer[i]; if (b.a === a && G.realTime - b.t <= win) { INPUT.buffer.splice(i, 1); return true; } } return false; }
function wasPressed(a) { return INPUT.pressed.has(a); }

// the active device decides glyphs and whether the touch controls are shown; the last input used wins
function setDevice(d) {
  if (INPUT.device === d) return;
  INPUT.device = d;
  if (d === 'touch' && document.pointerLockElement) document.exitPointerLock();
}
// mouse capture: pointer lock can only be requested from a user gesture (a click or a key), never from Escape
function wantsLock() { return INPUT.device === 'kbm' && !INPUT.locked && !INPUT.lockSandboxed && SETTINGS.pointerLock !== false && (G.mode === 'play' || G.mode === 'cine') && !UI.menuOpen(); }
function requestLock(fromClick = false) {
  const c = $('gl');
  if (!c.requestPointerLock || !wantsLock()) return false;
  if (navigator.userActivation && !navigator.userActivation.isActive) return false;
  INPUT.lockAsked = fromClick; // only a refusal of a click-initiated request says anything about this page's permissions
  // a frame sandboxed without pointer-lock permission says so outright: go straight to the fallback and stop asking
  const sandboxed = e => { if (e && /sandbox/i.test(e.message || '')) { INPUT.lockSandboxed = INPUT.lockFailed = true; } };
  try { const p = c.requestPointerLock(); if (p && p.catch) p.catch(sandboxed); } catch (err) { sandboxed(err); lockError(); return false; }
  return true;
}
// a sandboxed frame without pointer-lock permission refuses every request; after two refused clicks, fall back to free mouse-look
function lockError() {
  if (!INPUT.lockAsked) return;
  INPUT.lockAsked = false;
  if (performance.now() - INPUT.lockLostT < 1500) return; // Chrome refuses re-locking for a moment after Escape; that's not a permission problem
  if (++INPUT.lockErrors >= 2) INPUT.lockFailed = true;
}
// clicks on menus, buttons and the touch controls belong to them, not to the game
const uiTarget = t => !!(t && t.closest && t.closest('button, a, input, select, textarea, label, .screen, #menu, #touch'));
// browsers follow a touch with emulated mouse events; those must not switch the controls back to mouse
const fromTouch = e => (e.sourceCapabilities && e.sourceCapabilities.firesTouchEvents) || performance.now() - INPUT.lastTouchT < 800;

function initInput() {
  INPUT.binds = { ...DEFAULT_BINDS, ...(SETTINGS.binds || {}) };
  const canvas = $('gl');
  window.addEventListener('keydown', e => {
    if (INPUT.rebinding) { e.preventDefault(); finishRebind(e.code); return; }
    if (['Tab', 'Space', 'ArrowUp', 'ArrowDown'].includes(e.code) && !UI.menuOpen()) e.preventDefault();
    // keys alone don't hide the touch controls while touch is in use (tablet + keyboard); a real mouse does
    if (INPUT.device !== 'touch' || performance.now() - INPUT.lastTouchT > 5000) setDevice('kbm');
    INPUT.anyKey = true; initAudio();
    if (e.repeat) return;
    INPUT.keys.add(e.code);
    for (const a of actionsFor(e.code)) press(a);
    UI.onKey(e);
  });
  window.addEventListener('keyup', e => { INPUT.keys.delete(e.code); for (const a of actionsFor(e.code)) release(a); });
  // mouse buttons are heard on the whole window: the HUD, subtitles and prompts sit above the canvas
  window.addEventListener('mousedown', e => {
    if (fromTouch(e)) return;
    // preventDefault below also blocks the browser's click-to-focus: inside an iframe (hub, embeds) take focus ourselves or keys never arrive
    if (!document.hasFocus()) window.focus();
    if (INPUT.rebinding) { e.preventDefault(); INPUT.eatMenuT = performance.now(); finishRebind('Mouse' + e.button); return; }
    setDevice('kbm'); INPUT.anyKey = true; initAudio();
    if (!INPUT.locked && uiTarget(e.target)) return;
    // the click that captures the mouse doesn't also swing the axe
    if (!INPUT.locked && !INPUT.lockFailed && G.mode === 'play' && requestLock(true)) { e.preventDefault(); return; }
    if (!INPUT.locked && (G.mode === 'play' || G.mode === 'cine')) requestLock(true); // cinematics, or quietly retrying in fallback mode
    INPUT.mouse.add(e.button); for (const a of actionsFor('Mouse' + e.button)) press(a);
    if (INPUT.locked || G.mode === 'play') e.preventDefault();
  });
  window.addEventListener('mouseup', e => { INPUT.mouse.delete(e.button); for (const a of actionsFor('Mouse' + e.button)) release(a); });
  document.addEventListener('contextmenu', e => { if (INPUT.locked || !uiTarget(e.target) || performance.now() - (INPUT.eatMenuT || -1e9) < 1000) e.preventDefault(); });
  window.addEventListener('mousemove', e => {
    if (fromTouch(e)) return;
    if ((e.movementX || e.movementY) && INPUT.device === 'touch') setDevice('kbm');
    // the first event after capture can carry the cursor's whole jump to the lock point; ignore it and absurd outliers
    if (INPUT.locked && (performance.now() - INPUT.lockT < 60 || Math.abs(e.movementX) > 1000 || Math.abs(e.movementY) > 1000)) return;
    if (INPUT.locked || (INPUT.lockFailed && G.mode === 'play' && INPUT.device === 'kbm' && !UI.menuOpen())) { INPUT.mouseDX += e.movementX || 0; INPUT.mouseDY += e.movementY || 0; }
  });
  document.addEventListener('pointerlockchange', () => {
    const was = INPUT.locked;
    INPUT.locked = document.pointerLockElement === canvas;
    if (INPUT.locked) { INPUT.lockT = performance.now(); INPUT.lockAsked = false; INPUT.lockErrors = 0; INPUT.lockFailed = false; return; }
    if (!was) return;
    // the mouse was released (usually Escape): drop held buttons and pause. Chrome keeps the Escape that frees a captured
    // mouse to itself, so this is the only sign of it; in a cutscene the pause menu offers Skip Scene. Where the key does
    // arrive and is being held (Firefox), leave it to hold-to-skip.
    INPUT.lockLostT = performance.now();
    for (const b of INPUT.mouse) for (const a of actionsFor('Mouse' + b)) release(a);
    INPUT.mouse.clear();
    setTimeout(() => { if ((G.mode === 'play' || (G.mode === 'cine' && !INPUT.held.pause)) && !UI.menuOpen() && !INPUT.locked && INPUT.device === 'kbm') UI.pause(true); }, 120);
  });
  document.addEventListener('pointerlockerror', lockError);
  window.addEventListener('blur', () => { for (const a in INPUT.held) release(a); INPUT.keys.clear(); INPUT.mouse.clear(); if (G.mode === 'play' && !UI.menuOpen()) UI.pause(true); });
  window.addEventListener('gamepadconnected', e => { INPUT.padIndex = e.gamepad.index; });
  initTouch();
}
function finishRebind(code) {
  const a = INPUT.rebinding; INPUT.rebinding = null;
  if (code !== 'Escape') { INPUT.binds[a] = code; SETTINGS.binds = { ...(SETTINGS.binds || {}), [a]: code }; saveSettings(); }
  UI.renderSettings();
}

function initTouch() {
  const T = INPUT.touch, root = $('touch');
  if (!HAS_TOUCH) return;
  // any touch switches to the touch controls; a real mouse or a key switches back
  window.addEventListener('touchstart', () => { INPUT.lastTouchT = performance.now(); setDevice('touch'); }, { passive: true, capture: true });
  // emulated mouse events follow touchend, so a long press must not let them through as a real mouse
  window.addEventListener('touchend', () => { INPUT.lastTouchT = performance.now(); }, { passive: true, capture: true });
  const stick = $('tStick'), knob = stick.querySelector('i');
  const btnEls = [...root.querySelectorAll('.tb')];
  const findBtn = (x, y) => btnEls.find(b => { if (b.classList.contains('hide')) return false; const r = b.getBoundingClientRect(); return x >= r.left - 6 && x <= r.right + 6 && y >= r.top - 6 && y <= r.bottom + 6; });
  const onStart = e => {
    setDevice('touch'); initAudio();
    for (const t of e.changedTouches) {
      const b = findBtn(t.clientX, t.clientY);
      if (b) { T.btn[t.identifier] = b; b.classList.add('on'); touchBtn(b.dataset.b, true); if (b.dataset.b === 'throw') T.look = T.look || { id: t.identifier, x: t.clientX, y: t.clientY }; continue; }
      const sr = stick.getBoundingClientRect();
      if (!T.stick && t.clientX < window.innerWidth * 0.42 && t.clientY > window.innerHeight * 0.35) { T.stick = { id: t.identifier, cx: sr.left + sr.width / 2, cy: sr.top + sr.height / 2 }; moveStick(t); continue; }
      if (!T.look) { T.look = { id: t.identifier, x: t.clientX, y: t.clientY, t0: performance.now() }; if (T.lastTap && performance.now() - T.lastTap < 280) press('quickturn'); T.lastTap = performance.now(); }
    }
    if (G.mode === 'play' || G.mode === 'cine') e.preventDefault();
  };
  const moveStick = t => { const dx = t.clientX - T.stick.cx, dy = t.clientY - T.stick.cy, m = Math.hypot(dx, dy), r = 60; const k = Math.min(1, m / r); T.stickV.x = m ? dx / m * k : 0; T.stickV.y = m ? -dy / m * k : 0; knob.style.transform = `translate(${T.stickV.x * r}px, ${-T.stickV.y * r}px)`; INPUT.held.sprint = SETTINGS.autoSprint || m > r * 1.25; };
  const onMove = e => {
    for (const t of e.changedTouches) {
      if (T.stick && t.identifier === T.stick.id) moveStick(t);
      else if (T.look && t.identifier === T.look.id) { INPUT.mouseDX += (t.clientX - T.look.x) * 1.6; INPUT.mouseDY += (t.clientY - T.look.y) * 1.6; T.look.x = t.clientX; T.look.y = t.clientY; }
    }
    e.preventDefault();
  };
  const onEnd = e => {
    for (const t of e.changedTouches) {
      if (T.btn[t.identifier]) { const b = T.btn[t.identifier]; b.classList.remove('on'); touchBtn(b.dataset.b, false); delete T.btn[t.identifier]; }
      if (T.stick && t.identifier === T.stick.id) { T.stick = null; T.stickV.x = T.stickV.y = 0; knob.style.transform = ''; INPUT.held.sprint = false; }
      if (T.look && t.identifier === T.look.id) T.look = null;
    }
  };
  root.addEventListener('touchstart', onStart, { passive: false }); root.addEventListener('touchmove', onMove, { passive: false });
  root.addEventListener('touchend', onEnd); root.addEventListener('touchcancel', onEnd);
}
function touchBtn(b, down) {
  const map = { light: 'light', heavy: 'heavy', shield: 'shield', dodge: 'dodge', chase: 'chase', rage: 'rage', pause: 'pause', ctx: 'ctx' };
  if (b === 'throw') {
    // hold to aim, release to throw; when the axe is out it becomes Callback
    if (PLAYER && PLAYER.axeState !== 'hand') { if (down) press('callback'); else release('callback'); return; }
    if (down) press('aim'); else { press('light'); INPUT.touchThrow = true; release('aim'); setTimeout(() => release('light'), 60); }
    return;
  }
  if (b === 'ctx') { const a = PLAYER && PLAYER.finisherTarget ? 'finisher' : 'interact'; if (down) press(a); else release(a); return; }
  if (b === 'pause') { if (down) { UI.togglePause(); } return; }
  const a = map[b]; if (!a) return;
  if (down) press(a); else release(a);
}

const PAD = { dead: 0.16 };
function pollGamepad() {
  const pads = navigator.getGamepads ? navigator.getGamepads() : [];
  let gp = null; for (const p of pads) if (p && p.connected) { gp = p; break; }
  if (!gp) return null;
  const b = gp.buttons.map(x => x.pressed || x.value > 0.5), prev = INPUT.padPrev;
  const ax = gp.axes, dz = v => Math.abs(v) < PAD.dead ? 0 : (v - Math.sign(v) * PAD.dead) / (1 - PAD.dead);
  const lx = dz(ax[0] || 0), ly = dz(ax[1] || 0), rx = dz(ax[2] || 0), ry = dz(ax[3] || 0);
  const any = b.some(Boolean) || Math.abs(lx) + Math.abs(ly) + Math.abs(rx) + Math.abs(ry) > 0.3;
  if (any) { setDevice('pad'); INPUT.anyKey = true; }
  const edge = (i, a) => { if (b[i] && !prev[i]) press(a); if (!b[i] && prev[i]) release(a); };
  const L1 = b[4];
  if (L1 && b[5] && !prev[5]) press('promoL'); else edge(5, L1 ? '_' : 'light');
  if (L1 && b[7] && !prev[7]) press('promoH'); else edge(7, L1 ? '_' : 'heavy');
  edge(5, 'interact');
  edge(0, 'dodge'); edge(2, 'chase'); edge(3, 'callback'); edge(4, 'shield'); edge(6, 'aim'); edge(9, 'pause'); edge(13, 'quickturn'); edge(12, 'up_d');
  if (b[10] && b[11] && (!prev[10] || !prev[11])) press('rage');
  else { edge(11, 'finisher'); if (b[10] && !prev[10]) INPUT.padSprint = !INPUT.padSprint; }
  if (Math.hypot(lx, ly) < 0.2) INPUT.padSprint = false;
  INPUT.padPrev = b;
  return { lx, ly, rx, ry };
}
function rumble(weak, strong, ms) {
  const pads = navigator.getGamepads ? navigator.getGamepads() : [];
  for (const p of pads) if (p && p.vibrationActuator && p.vibrationActuator.playEffect) { try { p.vibrationActuator.playEffect('dual-rumble', { duration: ms, weakMagnitude: weak, strongMagnitude: strong }); } catch (e) { } }
}

function updateInput(realDt) {
  const I = INPUT;
  const pad = pollGamepad();
  let mx = 0, my = 0;
  if (I.held.left) mx -= 1; if (I.held.right) mx += 1; if (I.held.up) my += 1; if (I.held.down) my -= 1;
  if (pad && (Math.abs(pad.lx) + Math.abs(pad.ly) > 0)) { mx = pad.lx; my = -pad.ly; }
  if (I.touch.stick) { mx = I.touch.stickV.x; my = I.touch.stickV.y; }
  const m = Math.hypot(mx, my); if (m > 1) { mx /= m; my /= m; }
  const w = I.enabled ? I.weight : 0;
  I.move.x = mx * w; I.move.y = my * w;
  const sens = SETTINGS.sens;
  let lx = I.mouseDX * 0.0022 * sens, ly = I.mouseDY * 0.0022 * sens;
  if (pad) { lx += pad.rx * 2.6 * sens * realDt; ly += pad.ry * 2.0 * sens * realDt; }
  if (SETTINGS.invertX) lx = -lx; if (SETTINGS.invertY) ly = -ly;
  I.look.x = lx; I.look.y = ly; I.mouseDX = 0; I.mouseDY = 0;
  I.sprinting = (I.held.sprint && I.device === 'kbm') || I.padSprint || (I.device === 'touch' && I.held.sprint) || (SETTINGS.autoSprint && m > 0.9);
}
function endInputFrame() { INPUT.pressed.clear(); INPUT.released.clear(); }
