// ================= UI =================
// Title, HUD, prompts, subtitles, pause (On Break), settings, Call Dropped, kiosk, end card (§7.15, §10.11, §13).
const UI = {
  fxScale: 1, hudOn: false, hudA: 0, prompts: {}, menuStack: [], sel: 0, stamps: [], titleSel: 0,
  menuOpen() { return !!this.menuStack.length || G.mode === 'title' || G.mode === 'menu'; },
};
function saveSettings() { Store.set('settings', SETTINGS); }
function applySettings() {
  document.documentElement.style.setProperty('--sub-scale', { S: 0.85, M: 1, L: 1.2, XL: 1.45 }[SETTINGS.subSize] || 1);
  $('subs').classList.toggle('box', !!SETTINGS.subBox);
  U.wobble.value = SETTINGS.wobble ? 1 : 0;
  applyVolumes();
  if (INPUT.binds) INPUT.binds = { ...DEFAULT_BINDS, ...(SETTINGS.binds || {}) };
  G.tokens.melee = diff().tokens;
}

// ---------- prompts (runestone keycaps that adapt to the active input device) ----------
function prompt(id, label, { key = null, dur = 0, sticky = false } = {}) {
  if (DIR.skipping) return;
  let p = UI.prompts[id];
  const html = `${key ? `<span class="cap">${esc(glyph(key))}</span>` : ''}<span>${esc(label)}</span>`;
  if (!p) { const e = el('div', 'prompt', html); $('prompts').appendChild(e); p = UI.prompts[id] = { e, t: 0 }; }
  else if (p.html !== html) { p.e.innerHTML = html; p.e.classList.remove('out'); }
  p.html = html; p.dur = dur; p.sticky = sticky; p.t = 0; p.key = key; p.label = label;
}
function promptHide(id) {
  if (id === '*') { for (const k in UI.prompts) promptHide(k); return; }
  const p = UI.prompts[id]; if (!p) return;
  p.e.classList.add('out'); const e = p.e; setTimeout(() => e.remove(), 420); delete UI.prompts[id];
}
function updatePrompts(dt) {
  for (const id in UI.prompts) {
    const p = UI.prompts[id]; p.t += dt;
    if (!p.sticky && p.dur && p.t > p.dur) promptHide(id);
    if (p.key && p.lastDevice !== INPUT.device) { p.lastDevice = INPUT.device; p.e.querySelector('.cap') && (p.e.querySelector('.cap').textContent = glyph(p.key)); }
  }
  // prompts fade after the action is performed twice
  for (const [id, act] of [['light', 'light'], ['heavy', 'heavy'], ['aim', 'aim'], ['dodge', 'dodge'], ['shield', 'shield'], ['callback', 'callback'], ['chase', 'chase'], ['rage', 'rage']]) {
    if (UI.prompts[id] && !UI.prompts[id].sticky && wasPressed(act)) { UI.prompts[id].uses = (UI.prompts[id].uses || 0) + 1; if (UI.prompts[id].uses >= 2) promptHide(id); }
  }
  if (UI.prompts.throw && PLAYER && PLAYER.axeState !== 'hand') promptHide('throw');
}
function toast(html, sub = '', cls = '') {
  const e = el('div', 'toast ' + cls, html + (sub ? ` <span style="opacity:.7">${sub}</span>` : ''));
  $('toasts').appendChild(e); setTimeout(() => e.remove(), 3300);
  while ($('toasts').children.length > 4) $('toasts').firstChild.remove();
}
function trophy(name) {
  if (G.trophies.has(name)) return;
  G.trophies.add(name); toast(`Trophy: <b>${esc(name)}</b>`, '', 'trophy'); sfx('trophy', null, 0.6); saveProgress();
}
UI.stamp = (text, pos) => { UI.stamps.push({ text, pos: pos.clone(), t: 0 }); };

// ---------- HUD ----------
UI.hud = (on) => { UI.hudOn = on && SETTINGS.hud !== 'off'; };
UI.bossBar = (on, name, role) => { $('bossbar').classList.toggle('on', !!on); if (name) $('bossName').textContent = name; if (role) $('bossRole').textContent = role; };
function buildHUD() {
  const q = $('quiver'); q.innerHTML = ''; for (let i = 0; i < 5; i++) q.appendChild(el('i'));
}
function updateHUD(dt) {
  UI.hudA = damp(UI.hudA, UI.hudOn ? 1 : 0, UI.hudOn ? 1 / 0.8 * 3 : 1 / 0.5 * 3, dt);
  document.documentElement.style.setProperty('--hud-a', UI.hudA.toFixed(3));
  // the touch controls only exist while touch is the device in use
  const touchOn = INPUT.device === 'touch' && G.mode === 'play' && !UI.menuOpen();
  $('touch').classList.toggle('on', touchOn); document.body.classList.toggle('touchUI', touchOn);
  $('lockHint').classList.toggle('on', G.mode === 'play' && INPUT.device === 'kbm' && !INPUT.locked && !INPUT.lockFailed && !UI.menuOpen() && SETTINGS.pointerLock !== false);
  const P = PLAYER; if (!P) return;
  const k = clamp01(P.hp / P.maxHp);
  $('hpFill').style.transform = `scaleX(${k})`; $('hpLag').style.transform = `scaleX(${clamp01(P.hpLag / P.maxHp)})`;
  const bars = k <= 0 ? 0 : k <= 0.25 ? 1 : k <= 0.5 ? 2 : k <= 0.75 ? 3 : 4;
  const sig = $('sig'); [...sig.children].forEach((b, i) => b.classList.toggle('off', i >= bars)); sig.classList.toggle('flick', bars === 1);
  $('rageFill').style.transform = `scaleX(${clamp01(P.rage / 100)})`; $('rageBar').classList.toggle('full', P.rage >= 100 && !P.rageActive);
  const qv = $('quiver').children, qm = quiverMax(), chordLit = G.time - CHASE.chordT < 3 ? CHASE.chord : 0;
  for (let i = 0; i < 5; i++) { qv[i].style.display = i < qm ? '' : 'none'; qv[i].classList.toggle('off', i >= CHASE.arrows); qv[i].classList.toggle('lit', i < chordLit); }
  $('axeIco').classList.toggle('out', P.axeState !== 'hand');
  const pl = $('promoL'), ph = $('promoH');
  pl.classList.toggle('hide', !G.promos.rebate); ph.classList.toggle('hide', !G.promos.conference);
  pl.querySelector('.cd').style.setProperty('--p', (P.promoCd.L / 25 * 100).toFixed(1) + '%'); pl.classList.toggle('ready', P.promoCd.L <= 0);
  ph.querySelector('.cd').style.setProperty('--p', (P.promoCd.H / 40 * 100).toFixed(1) + '%'); ph.classList.toggle('ready', P.promoCd.H <= 0);
  $('reticle').classList.toggle('on', P.aiming && UI.hudA > 0.5);
  if (BOSS && BOSS.alive) { $('bossFill').style.transform = `scaleX(${clamp01(BOSS.hp / BOSS.maxHp)})`; BOSS.hpLag = BOSS.hpLag == null ? BOSS.hp : Math.max(BOSS.hp, BOSS.hpLag - dt * 120); $('bossLag').style.transform = `scaleX(${clamp01(BOSS.hpLag / BOSS.maxHp)})`; $('bossStun').style.transform = `scaleX(${clamp01(BOSS.stun / BOSS.stunCap)})`; }
  // touch: rage button and contextual button
  if (touchOn) {
    document.querySelector('[data-b="rage"]').classList.toggle('hide', !(P.rage >= 100 && !P.rageActive));
    const ctx = $('tCtx'); const show = !!(P.finisherTarget || currentInteract); ctx.classList.toggle('hide', !show); if (show) ctx.textContent = P.finisherTarget ? 'Close the Deal' : 'Interact';
    document.querySelector('[data-b="throw"]').textContent = P.axeState !== 'hand' ? 'Callback' : 'Throw';
  }
}

// overlay canvas: enemy bars, Close the Deal prompts, threat indicators, stamps
const _sv = V3();
function project(p, out) { _sv.copy(p).project(R.camera); out.x = (_sv.x * 0.5 + 0.5) * R.displayW; out.y = (-_sv.y * 0.5 + 0.5) * R.displayH; out.z = _sv.z; out.behind = _sv.z > 1; return out; }
function drawOverlay(dt) {
  const c = $('fx2d'), g = c.getContext('2d'), s = c.width / R.displayW;
  g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, c.width, c.height); g.setTransform(s, 0, 0, s, 0, 0);
  if (UI.hudA < 0.02 || !PLAYER) return;
  g.globalAlpha = UI.hudA;
  const sp = {};
  for (const e of ENEMIES) {
    if (!e.alive || e.state === 'dead' || e.kind === 'hamarr') continue;
    const hp = e.headPos ? e.headPos(_v[0]).add(_v[1].set(0, 0.45, 0)) : null; if (!hp) continue;
    project(hp, sp);
    if (sp.behind || sp.x < -50 || sp.x > R.displayW + 50) { continue; }
    const d = R.camera.position.distanceTo(hp);
    if (e.showBars > 0 && d < 30) {
      const w = clamp(70 * 8 / d, 26, 70), x = sp.x - w / 2, y = sp.y;
      g.fillStyle = 'rgba(0,0,0,.55)'; g.fillRect(x - 1, y - 1, w + 2, 7);
      g.fillStyle = '#d64234'; g.fillRect(x, y, w * clamp01(e.hp / e.maxHp), 3);
      g.fillStyle = '#ffcf1f'; g.fillRect(x, y + 4, w * clamp01(e.stun / e.stunCap), 1.6);
      if (e.frost > 0 && e.frozenT <= 0) { g.fillStyle = '#7fe6f0'; g.fillRect(x, y - 3, w * clamp01(e.frost / 100), 1.5); }
    }
    if (e.finisherReady) {
      const pulse = 0.75 + Math.sin(G.realTime * 10) * 0.25;
      g.save(); g.translate(sp.x, sp.y - 22); g.globalAlpha = UI.hudA * pulse;
      g.fillStyle = 'rgba(10,16,19,.85)'; g.strokeStyle = '#ffcf1f'; g.lineWidth = 2; g.beginPath(); g.roundRect ? g.roundRect(-58, -13, 116, 26, 4) : g.rect(-58, -13, 116, 26); g.fill(); g.stroke();
      g.fillStyle = '#fff6d6'; g.font = '700 11px Cinzel, Georgia, serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(`${glyph('finisher')} · CLOSE THE DEAL`, 0, 1);
      g.restore();
    }
  }
  if (BOSS && BOSS.finisherReady && BOSS.alive) {
    project(BOSS.headPos(_v[0]).add(_v[1].set(0, 1, 0)), sp);
    if (!sp.behind) { g.fillStyle = 'rgba(10,16,19,.85)'; g.strokeStyle = '#ffcf1f'; g.lineWidth = 2; g.fillRect(sp.x - 64, sp.y - 13, 128, 26); g.strokeRect(sp.x - 64, sp.y - 13, 128, 26); g.fillStyle = '#fff6d6'; g.font = '700 11px Cinzel, Georgia, serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(`${glyph('finisher')} · CLOSE THE DEAL`, sp.x, sp.y + 1); }
  }
  // threat indicators: chevrons on the screen edge for off-screen attackers (§7.10)
  const cols = { white: '#f1f4f5', teal: '#3ff0e6', red: '#ff3b2f' };
  const cbCols = SETTINGS.cbPalette === 'cb' ? { white: '#ffffff', teal: '#5aa0ff', red: '#ffb000' } : cols;
  for (const e of ENEMIES) {
    if (!e.alive || !e.telegraph) continue;
    const kind = e.telegraph(); if (!kind) continue;
    project(e.hitPoint(_v[2]), sp);
    const on = !sp.behind && sp.x > 30 && sp.x < R.displayW - 30 && sp.y > 30 && sp.y < R.displayH - 30;
    if (on && e.kind !== 'hamarr') { g.save(); g.translate(sp.x, sp.y - 40); g.fillStyle = cbCols[kind]; g.globalAlpha = UI.hudA * (0.6 + Math.sin(G.realTime * 18) * 0.4); g.beginPath(); g.arc(0, 0, kind === 'red' ? 6 : 4, 0, TAU); g.fill(); g.restore(); continue; }
    if (on) continue;
    const rel = _v[3].copy(e.pos).sub(R.camera.position), right = _v[4].set(1, 0, 0).applyQuaternion(R.camera.quaternion), fwd = _v[5].copy(CAM.final.fwd).setY(0).normalize();
    const ang = Math.atan2(rel.dot(right), rel.dot(fwd));
    const cx = R.displayW / 2, cy = R.displayH / 2, rr = Math.min(cx, cy) * 0.82;
    const x = cx + Math.sin(ang) * rr * (R.displayW / R.displayH) * 0.7, y = cy - Math.cos(ang) * rr;
    g.save(); g.translate(clamp(x, 26, R.displayW - 26), clamp(y, 26, R.displayH - 26)); g.rotate(ang); g.fillStyle = cbCols[kind];
    g.globalAlpha = UI.hudA * (0.7 + Math.sin(G.realTime * 16) * 0.3);
    const chev = (o) => { g.beginPath(); g.moveTo(-11, 6 + o); g.lineTo(0, -6 + o); g.lineTo(11, 6 + o); g.lineTo(6, 6 + o); g.lineTo(0, 0 + o); g.lineTo(-6, 6 + o); g.closePath(); g.fill(); };
    if (kind === 'teal') { g.beginPath(); g.arc(0, 0, 6, 0, TAU); g.fill(); } else { chev(0); if (kind === 'red') chev(9); }
    g.restore();
  }
  // PRICE MATCHED stamps
  for (let i = UI.stamps.length - 1; i >= 0; i--) {
    const st = UI.stamps[i]; st.t += dt; if (st.t > 0.9) { UI.stamps.splice(i, 1); continue; }
    project(st.pos, sp); if (sp.behind) continue;
    g.save(); g.translate(sp.x, sp.y); g.rotate(-0.12); const k = st.t < 0.08 ? 1.6 - st.t * 7.5 : 1; g.scale(k, k); g.globalAlpha = UI.hudA * (1 - clamp01((st.t - 0.5) / 0.4));
    g.strokeStyle = '#ffcf1f'; g.lineWidth = 2.5; g.strokeRect(-70, -15, 140, 30); g.fillStyle = '#ffcf1f'; g.font = '900 15px Cinzel, Georgia, serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(st.text, 0, 1); g.restore();
  }
  g.globalAlpha = 1;
}

// ---------- title ----------
function buildTitle() {
  const lt = $('logoText'), text = 'GOD OF WARRANTY';
  lt.innerHTML = [...text].map(ch => ch === ' ' ? '<span class="gap"> </span>' : `<span>${ch}</span>`).join('');
  renderTitleMenu();
}
function renderTitleMenu() {
  const m = $('menu'); m.innerHTML = '';
  const save = Store.get('save', null);
  const items = [];
  if (save && save.cp && save.cp !== 'grove') items.push(['Continue', () => continueGame(save.cp)]);
  items.push(['Begin Shift', () => startGame()], ['Settings', () => UI.openSettings()], ['Credits', () => UI.openCredits()]);
  if (DEBUG) items.push(['Chapters', () => UI.openChapters()]);
  items.forEach(([label, fn], i) => { const b = el('button', 'opt' + (i === UI.titleSel ? ' sel' : ''), label); b.setAttribute('role', 'menuitem'); b.onclick = () => { sfx('ui'); initAudio(); fn(); }; b.onmouseenter = () => { UI.titleSel = i; [...m.children].forEach((c, j) => c.classList.toggle('sel', j === i)); }; m.appendChild(b); });
  UI.titleItems = items;
}
UI.showTitle = (on) => {
  const t = $('title');
  if (on) { t.hidden = false; t.style.display = 'flex'; t.style.opacity = 1; [...$('logoText').children].forEach(s => { s.style.transition = 'none'; s.style.transform = ''; s.style.opacity = 1; s.style.filter = ''; }); $('menu').style.opacity = 1; $('soundHint').style.display = AUDIO.ok ? 'none' : ''; renderTitleMenu(); }
  else {
    // the title letters crumble into snow and are taken by a gust toward the land
    [...$('logoText').children].forEach((s, i) => { s.style.transition = `transform ${1.4 + frand() * 0.8}s cubic-bezier(.5,0,.8,.4) ${i * 0.03}s, opacity 1.6s ${0.3 + i * 0.03}s, filter 1.4s ${i * 0.03}s`; s.style.transform = `translate(${-200 - frand() * 300}px, ${80 + frand() * 160}px) rotate(${(frand() - 0.5) * 90}deg) scale(${0.4 + frand() * 0.4})`; s.style.opacity = 0; s.style.filter = 'blur(6px)'; });
    $('menu').style.opacity = 0; $('soundHint').style.display = 'none';
    setTimeout(() => { t.style.opacity = 0; }, 900); setTimeout(() => { t.style.display = 'none'; }, 2200);
  }
};
function startGame() { if (G.mode !== 'title') return; beginShift(); requestLock(); }
function continueGame(cp) {
  if (G.mode !== 'title') return;
  loadProgress(); G.title = false; UI.showTitle(false); G.stats.startT = G.realTime;
  G.checkpoint = cp; G.mode = 'cine';
  R.post.fade = 0; $('fade').style.transition = 'none'; $('fade').style.opacity = 1;
  runStory(cp); requestLock();
  setTimeout(() => { $('fade').style.transition = 'opacity 1.6s'; $('fade').style.opacity = 0; }, 500);
}

// ---------- modal screens ----------
function openScreen(id) { $(id).hidden = false; if (!UI.menuStack.includes(id)) UI.menuStack.push(id); if (document.pointerLockElement) document.exitPointerLock(); }
function closeScreen(id) { $(id).hidden = true; UI.menuStack = UI.menuStack.filter(x => x !== id); }
UI.closeAll = () => { for (const id of [...UI.menuStack]) closeScreen(id); if (G.mode === 'pause') G.mode = UI.prevMode || 'play'; };
UI.pause = (force) => {
  if (G.mode === 'title' || G.mode === 'end' || G.mode === 'dead' || G.mode === 'boot' || G.mode === 'menu') return;
  if (G.mode === 'pause') { if (!force) UI.resume(); return; }
  UI.prevMode = G.mode; G.mode = 'pause'; renderPause(); openScreen('pause');
  if (AUDIO.ok) AUDIO.ctx.suspend();
};
UI.resume = () => { closeScreen('pause'); closeScreen('settings'); G.mode = UI.prevMode || 'play'; if (AUDIO.ok) AUDIO.ctx.resume(); requestLock(); };
UI.togglePause = () => { if (G.mode === 'pause') UI.resume(); else UI.pause(); };
function renderPause() {
  const p = $('pausePanel');
  p.innerHTML = `<h2>On Break</h2><p class="lede">${esc(CHECKPOINT_LABELS[G.checkpoint] || '')} · ${esc(diff().label)}</p><div class="stack" id="pauseItems"></div>`;
  const items = [['Resume', () => UI.resume()], ['Settings', () => UI.openSettings()], ['Controls', () => UI.openSettings('controls')], ['Training Modules', () => UI.openCodex()], ['Restart Checkpoint', () => { UI.resume(); callBack(); }], ['Quit to Title', () => quitToTitle()]];
  if (UI.prevMode === 'cine' && DIR.skippable) items.splice(1, 0, ['Skip Scene', () => { UI.resume(); DIR.skipping = true; hideSub(); }]);
  const st = $('pauseItems');
  items.forEach(([l, f]) => { const b = el('button', 'opt', l); b.onclick = () => { sfx('ui'); f(); }; st.appendChild(b); });
}
function quitToTitle() {
  UI.closeAll(); if (AUDIO.ok) AUDIO.ctx.resume();
  RUN.id++; clearEnemies(); stopConvo(); hideSub(); promptHide('*'); UI.bossBar(false); UI.hud(false);
  G.timeScale = 1; G.slowT = 0; R.post.desat = 0; R.post.fade = 0; $('death').hidden = true; $('endcard').hidden = true; $('credits').classList.remove('on');
  enterTitle();
}
UI.showDeath = () => {
  openScreen('death'); $('btnCallBack').focus();
  $('btnCallBack').onclick = () => { sfx('ui'); closeScreen('death'); callBack(); requestLock(); };
  $('btnChangePlan').onclick = () => { sfx('ui'); UI.openSettings('play', true); };
};
// ---------- settings (§13) ----------
const SETTING_UI = {
  play: [['difficulty', 'Difficulty', 'select', Object.fromEntries(Object.entries(DIFFICULTY).map(([k, v]) => [k, v.label]))], ['nameCards', 'Name cards', 'toggle'], ['gore', 'Gore', 'select', { full: 'Full', reduced: 'Reduced' }], ['hud', 'HUD', 'select', { full: 'Full', minimal: 'Minimal', off: 'Off' }], ['skipFinishers', 'Skip finisher animations', 'toggle'], ['slowTells', 'Slower enemy tells (+20%)', 'toggle'], ['autoParry', 'Auto-Price Match on Give Me a Story', 'toggle'], ['cbPalette', 'Threat indicator colours', 'select', { default: 'Default', cb: 'Colour-blind' }]],
  camera: [['sens', 'Sensitivity', 'range', [0.2, 3, 0.05]], ['invertX', 'Invert X', 'toggle'], ['invertY', 'Invert Y', 'toggle'], ['fovOffset', 'FOV offset', 'range', [-10, 10, 1]], ['shake', 'Camera shake', 'range', [0, 1, 0.05]], ['handheld', 'Handheld in cinematics', 'range', [0, 1, 0.05]], ['lockOn', 'Lock-on', 'toggle'], ['aimAssist', 'Aim assist', 'range', [0, 1.5, 0.05]]],
  image: [['quality', 'Quality preset', 'select', Object.fromEntries(Object.entries(QUALITY).map(([k, v]) => [k, v.label]))], ['resScale', 'Internal resolution', 'range', [0.5, 1, 0.05]], ['dof', 'Depth of field', 'toggle'], ['grain', 'Film grain', 'toggle'], ['ca', 'Chromatic aberration', 'toggle'], ['motionBlur', 'Motion blur', 'toggle'], ['bloom', 'Bloom', 'toggle'], ['filtering', 'Texture filtering', 'select', { crisp: 'Crisp', smooth: 'Smooth' }], ['retro480', 'Authentic 480p', 'toggle'], ['wobble', 'Retro Wobble', 'toggle']],
  audio: [['vMaster', 'Master', 'range', [0, 1, 0.05]], ['vMusic', 'Music', 'range', [0, 1, 0.05]], ['vSfx', 'Effects', 'range', [0, 1, 0.05]], ['vVoice', 'Dialogue', 'range', [0, 1, 0.05]], ['voiceMode', 'Voices', 'select', { babble: 'Character babble', speech: 'Browser speech' }], ['subs', 'Subtitles', 'toggle'], ['subSize', 'Subtitle size', 'select', { S: 'S', M: 'M', L: 'L', XL: 'XL' }], ['subBox', 'Subtitle background', 'toggle'], ['subNames', 'Speaker names', 'toggle']],
  controls: [['aimHold', 'Aim: hold (off = toggle)', 'toggle'], ['shieldHold', 'Shield: hold (off = toggle)', 'toggle'], ['autoSprint', 'Auto-sprint', 'toggle']],
};
UI.openSettings = (tab = 'play', fromDeath = false) => { UI.setTab = tab; UI.setFromDeath = fromDeath; openScreen('settings'); UI.renderSettings(); };
UI.renderSettings = () => {
  const p = $('setPanel'), tab = UI.setTab || 'play';
  p.innerHTML = `<h2>Settings</h2><p class="lede">Changes apply immediately.</p><div class="tabs">${Object.keys(SETTING_UI).map(t => `<button class="tab${t === tab ? ' on' : ''}" data-t="${t}">${t}</button>`).join('')}</div><div id="setRows"></div>
    ${tab === 'controls' ? '<div id="bindRows" style="margin-top:12px"></div>' : ''}<div class="btnrow"><button class="btn sel" id="setDone">${UI.setFromDeath ? 'Call Back' : 'Done'}</button></div>`;
  p.querySelectorAll('.tab').forEach(b => b.onclick = () => { sfx('ui'); UI.setTab = b.dataset.t; UI.renderSettings(); });
  const rows = $('setRows');
  for (const [key, label, type, opt] of SETTING_UI[tab]) {
    const id = 'set_' + key, r = el('div', 'row'); const val = SETTINGS[key];
    let ctl = '';
    if (type === 'toggle') ctl = `<input type="checkbox" id="${id}" ${val !== false ? 'checked' : ''}>`;
    if (type === 'select') ctl = `<select id="${id}">${Object.entries(opt).map(([k, v]) => `<option value="${k}" ${k === val ? 'selected' : ''}>${esc(v)}</option>`).join('')}</select>`;
    if (type === 'range') ctl = `<input type="range" id="${id}" min="${opt[0]}" max="${opt[1]}" step="${opt[2]}" value="${val}"><span class="val" id="${id}_v">${(+val).toFixed(2).replace(/\.?0+$/, '')}</span>`;
    r.innerHTML = `<label for="${id}">${esc(label)}</label><div class="ctl">${ctl}</div>`;
    rows.appendChild(r);
    const inp = r.querySelector('#' + id);
    inp.oninput = inp.onchange = () => {
      let v = type === 'toggle' ? inp.checked : type === 'range' ? +inp.value : inp.value;
      SETTINGS[key] = v; if (type === 'range') r.querySelector('#' + id + '_v').textContent = (+v).toFixed(2).replace(/\.?0+$/, '');
      saveSettings(); applySettings();
      if (['quality', 'resScale', 'retro480'].includes(key)) { resizeRenderer(true); setDofTaps((QUALITY[SETTINGS.quality] || QUALITY.balanced).dofTaps); }
      if (key === 'filtering') for (const k in TEX) { const t = TEX[k]; if (t && t.isTexture) { t.magFilter = v === 'crisp' ? THREE.NearestFilter : THREE.LinearFilter; t.needsUpdate = true; } }
    };
  }
  if (tab === 'controls') {
    const br = $('bindRows');
    for (const a of Object.keys(DEFAULT_BINDS)) {
      const r = el('div', 'row'); r.innerHTML = `<label>${esc(ACTION_LABELS[a] || a)}</label><div class="ctl"><button class="btn" id="bind_${a}" style="padding:5px 10px;min-width:70px">${INPUT.rebinding === a ? '…' : esc(keyName(INPUT.binds[a]))}</button></div>`;
      br.appendChild(r); r.querySelector('button').onclick = () => { INPUT.rebinding = a; UI.renderSettings(); };
    }
    const pad = el('p', 'small', 'Gamepad: RB light · RT heavy · LT aim · Y callback · LB shield · A dodge · X Chase · R3 Close the Deal · L3+R3 Rage · D-pad ↓ quick turn. Touch: left stick moves, drag right side to look.'); br.appendChild(pad);
    const rb = el('button', 'btn', 'Reset bindings'); rb.onclick = () => { SETTINGS.binds = {}; INPUT.binds = { ...DEFAULT_BINDS }; saveSettings(); UI.renderSettings(); }; br.appendChild(rb);
  }
  $('setDone').onclick = () => { sfx('uiBack'); closeScreen('settings'); if (UI.setFromDeath) { closeScreen('death'); callBack(); requestLock(); } };
};
UI.openCodex = () => {
  const p = $('setPanel');
  openScreen('settings');
  const eggs = Object.entries(CODEX).map(([k, [t, d]]) => G.eggs.has(k) ? `<h3>${esc(t)}</h3><p>${esc(d)}</p>` : `<h3 class="locked">???</h3><p class="locked">Not yet found.</p>`).join('');
  p.innerHTML = `<h2>Training Modules</h2><p class="lede">${G.eggs.size}/${EGG_TOTAL} found · Mystery Shoppers ${G.shoppers.size}/5</p><div class="codex">
    <h3>The Cold Call</h3><p>*Terms and conditions apply. Axe must be returned in original condition. Cold calls may be recorded for training and quality purposes.</p>${eggs}</div><div class="btnrow"><button class="btn sel" id="cdx">Done</button></div>`;
  $('cdx').onclick = () => { sfx('uiBack'); closeScreen('settings'); };
};
UI.openCredits = () => {
  const p = $('setPanel'); openScreen('settings');
  p.innerHTML = `<h2>Credits</h2><div class="small" style="text-align:center;line-height:1.8">${creditsHTML(true)}</div><div class="btnrow"><button class="btn sel" id="crd">Done</button></div>`;
  $('crd').onclick = () => { sfx('uiBack'); closeScreen('settings'); };
};
UI.openChapters = () => {
  const p = $('setPanel'); openScreen('settings');
  p.innerHTML = `<h2>Chapters</h2><p class="lede">Debug build</p><div class="stack" id="chap"></div><div class="btnrow"><button class="btn" id="chx">Close</button></div>`;
  for (const cp of CHECKPOINTS.slice(1, -1)) { const b = el('button', 'opt', CHECKPOINT_LABELS[cp] || cp); b.onclick = () => { closeScreen('settings'); continueGame(cp); }; $('chap').appendChild(b); }
  $('chx').onclick = () => closeScreen('settings');
};
function creditsHTML(short) {
  return `<p><b>GOD OF WARRANTY</b> · Part One: The Ward Falls</p><p>A one-take demo built in one HTML file.</p>
    <p>Starring Luka · Chase · Rue · Luke · Zane · Zee · Jarrad · and Faye, in memory</p>
    <p>Everything you see and hear is generated at runtime: geometry, textures, music, voices.</p>
    <p class="small" style="max-width:520px;margin:12px auto 0">A fan-made parody, made for fun under fair dealing for the purposes of parody and satire. Not affiliated with, endorsed by, or connected to Optus, Sony Interactive Entertainment or Santa Monica Studio. All names of real places are used affectionately.</p>`;
}

// ---------- kiosk ----------
UI.openKiosk = (first) => new Promise(res => {
  openScreen('kiosk'); UI.kioskRes = res; UI.kioskTab = 'smith'; UI.kioskFirst = first;
  renderKiosk();
  if (G.flags.autoplay) setTimeout(() => { if (UPGRADES[0] && !G.upgrades.axe2) buyUpgrade(UPGRADES[0]); closeScreen('kiosk'); res('done'); }, 800);
});
function renderKiosk() {
  const p = $('kioskPanel'), tab = UI.kioskTab;
  p.innerHTML = `<h2>Screens, Seals &amp; Smithing</h2><p class="lede">Luke &amp; Zane · ${UI.kioskFirst ? 'Try Cold Call Lv 2 — it’s what Luke would do' : 'PLEASE SANITISE. OR DON’T.'}</p>
    <div class="wallet"><span>SIMsilver <b>${G.silver}</b></span><span>Commission <b>${G.commission}</b></span></div>
    <div class="tabs"><button class="tab ${tab === 'smith' ? 'on' : ''}" data-t="smith">Upgrades</button><button class="tab ${tab === 'kpi' ? 'on' : ''}" data-t="kpi">KPI Tree</button></div>
    <div class="shop" id="shop"></div>
    <div class="btnrow">${!UI.kioskFirst ? '<button class="btn" id="kBro">Ask: “Brothers?”</button>' : ''}<button class="btn sel" id="kDone">Done</button></div>`;
  p.querySelectorAll('.tab').forEach(b => b.onclick = () => { sfx('ui'); UI.kioskTab = b.dataset.t; renderKiosk(); });
  const shop = $('shop');
  if (tab === 'smith') {
    for (const u of UPGRADES) {
      const own = G.upgrades[u.id], can = G.silver >= u.cost;
      const b = el('button', 'item' + (own ? ' owned' : !can ? ' cant' : ''), `<span class="n">${esc(u.name)}</span><span class="c">${own ? 'Owned' : u.cost + ' SIMsilver'}</span><span class="d">${esc(u.desc)}</span>`);
      b.onclick = () => { if (buyUpgrade(u)) renderKiosk(); else sfx('uiBack'); };
      shop.appendChild(b);
    }
    shop.appendChild(el('div', 'item owned', `<span class="n">Glacial Rebate etching</span><span class="c">${G.promos.rebate ? 'Etched' : 'Free'}</span><span class="d">Runic Promo (light): slam the axe, ice spikes erupt in a 5 m ring. ${esc(glyph('promoL'))} or Shield + ${esc(glyph('light'))}.</span>`));
  } else {
    for (const k of KPI_NODES) {
      const own = G.kpi[k.id], can = G.commission >= k.cost;
      const b = el('button', 'item' + (own ? ' owned' : !can ? ' cant' : ''), `<span class="n">${esc(k.name)}</span><span class="c">${own ? 'Unlocked' : k.cost + ' Commission'}</span><span class="d">${esc(k.desc)}</span>`);
      b.onclick = () => { if (buyKPI(k)) renderKiosk(); else sfx('uiBack'); };
      shop.appendChild(b);
    }
    shop.appendChild(el('div', 'item owned', `<span class="n">Everything else</span><span class="c">—</span><span class="d">Available in the full game.</span>`));
  }
  $('kDone').onclick = () => { sfx('uiBack'); closeScreen('kiosk'); UI.kioskRes && UI.kioskRes('done'); };
  const bro = $('kBro'); if (bro) bro.onclick = () => { sfx('ui'); closeScreen('kiosk'); UI.kioskRes && UI.kioskRes('brothers'); };
}

// ---------- the end ----------
UI.endTitle = () => {
  const t = $('title'); t.style.display = 'flex'; t.hidden = false; t.style.opacity = 0; $('menu').style.opacity = 0; $('soundHint').style.display = 'none'; $('titleFoot').style.display = 'none';
  const letters = [...$('logoText').children];
  letters.forEach((s, i) => { s.style.transition = 'none'; s.style.transform = `translate(${(frand() - 0.5) * 600}px, ${-200 - frand() * 300}px) scale(0.3)`; s.style.opacity = 0; s.style.filter = 'blur(8px)'; });
  requestAnimationFrame(() => { t.style.transition = 'opacity 2s'; t.style.opacity = 1; letters.forEach((s, i) => { s.style.transition = `transform ${3 + frand()}s cubic-bezier(.2,.7,.2,1) ${i * 0.08}s, opacity 2.5s ${i * 0.08}s, filter 3s ${i * 0.08}s`; s.style.transform = ''; s.style.opacity = 1; s.style.filter = ''; }); });
};
UI.showEnd = () => {
  const p = $('endPanel'), S = G.stats, mins = Math.max(0, (G.realTime - S.startT) / 60);
  $('title').style.display = 'none';
  p.innerHTML = `<h2 style="font-size:20px">Thanks for playing</h2><p class="lede">the God of Warranty demo</p>
    <div class="stats">
      <div><span>Time</span><b>${Math.floor(mins)}:${String(Math.floor((mins % 1) * 60)).padStart(2, '0')}</b></div>
      <div><span>Calls Dropped</span><b>${S.deaths}</b></div>
      <div><span>Mystery Shoppers</span><b>${G.shoppers.size}/5</b></div>
      <div><span>Easter eggs</span><b>${G.eggs.size}/${EGG_TOTAL}</b></div>
      <div><span>SIMsilver earned</span><b>${S.silverEarned}</b></div>
      <div><span>Price Matches</span><b>${S.priceMatches}</b></div>
      <div><span>Finishers</span><b>${S.finishers}</b></div>
      <div><span>Trophies</span><b>${G.trophies.size}/15</b></div>
    </div>
    <div class="btnrow"><button class="btn sel" id="endAgain">Play Again</button><a class="btn" id="endHub" href="${HUB_URL}" target="_top" style="text-decoration:none">Back to Optus Games</a><button class="btn" id="endCredits">Credits</button></div>`;
  openScreen('endcard');
  $('endAgain').onclick = () => { sfx('ui'); closeScreen('endcard'); $('credits').classList.remove('on'); quitToTitle(); };
  $('endCredits').onclick = () => { sfx('ui'); closeScreen('endcard'); rollCredits(); };
};
function rollCredits() {
  const c = $('credits'), roll = $('creditRoll'); c.classList.add('on');
  roll.innerHTML = `<h4>God of Warranty</h4><p>Part One — The Ward Falls</p><h4>Luka</h4><p>The 2IC</p><h4>Chase</h4><p>The Casual (Pudding)</p><h4>Rue</h4><p>CEO, currently on a call</p><h4>Luke &amp; Zane</h4><p>Repair Smiths. Not brothers.</p><h4>Zee</h4><p>The Witch of the Woods</p><h4>Jarrad</h4><p>Here to Help!</p><h4>Faye</h4><p>Wi-Faye. Full bars.</p><h4>Music</h4><p>${G.flags.tape ? 'Pudding — Demo Tape (found)' : 'Faye’s Theme, lo-fi'}</p><div class="disc">${creditsHTML()}</div><h4 style="margin-top:60px">Store 001</h4><p>Located.</p>`;
  roll.style.transition = 'none'; roll.style.transform = 'translateY(0)';
  requestAnimationFrame(() => { roll.style.transition = 'transform 38s linear'; roll.style.transform = `translateY(-${roll.scrollHeight + window.innerHeight}px)`; });
  setTimeout(() => { c.classList.remove('on'); UI.showEnd(); }, 39000);
}

// ---------- keyboard navigation for menus ----------
UI.onKey = (e) => {
  if (G.mode === 'title' && !UI.menuStack.length) {
    const n = UI.titleItems ? UI.titleItems.length : 0;
    if (e.code === 'ArrowDown' || e.code === 'KeyS') { UI.titleSel = (UI.titleSel + 1) % n; renderTitleMenu(); sfx('ui', null, 0.5); }
    else if (e.code === 'ArrowUp' || e.code === 'KeyW') { UI.titleSel = (UI.titleSel - 1 + n) % n; renderTitleMenu(); sfx('ui', null, 0.5); }
    else if (e.code === 'Enter' || e.code === 'Space') { const it = UI.titleItems[UI.titleSel]; if (it) { sfx('ui'); it[1](); } }
    return;
  }
  // Escape backs out of the top menu only: it must not also reach the pause toggle in tick()
  if (e.code === 'Escape' && UI.menuStack.includes('settings')) { INPUT.pressed.delete('pause'); closeScreen('settings'); return; }
  if (e.code === 'Escape' && UI.menuStack.includes('kiosk')) { INPUT.pressed.delete('pause'); closeScreen('kiosk'); UI.kioskRes && UI.kioskRes('done'); return; }
};
function updateSkipHint(realDt) {
  const sh = $('skipHint');
  const can = G.mode === 'cine' && DIR.skippable && !DIR.skipping;
  // held for one second of wall-clock time (not frame time), counted from the press or the start of the cutscene
  if (can && INPUT.held.pause) { DIR.holdSkip = (performance.now() - Math.max(INPUT.pausePressT, DIR.cineT || 0)) / 1000; sh.classList.add('on'); sh.querySelector('.ring').style.setProperty('--p', Math.min(100, DIR.holdSkip * 100) + '%'); if (DIR.holdSkip >= 1) { DIR.skipping = true; DIR.holdSkip = 0; sh.classList.remove('on'); hideSub(); } }
  else { DIR.holdSkip = 0; if (!can || !INPUT.held.pause) sh.classList.remove('on'); }
}
