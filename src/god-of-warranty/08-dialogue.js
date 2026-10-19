// ================= DIALOGUE =================
// Subtitles (§5.8), name cards, babble + lip flap, barks, walk-and-talk, and Rue's video call.
const DLG = { line: null, lineT: 0, lineDur: 0, syl: [], speaker: null, seen: new Set(), barkCd: {}, lastBark: {}, cardT: 0, talkActors: new Set(), convo: null };

function lineDuration(text) { const w = text.replace(/\(.*?\)/g, '').split(/\s+/).filter(Boolean).length; return Math.max(1.8, w * 0.32 + 0.6); }
function showSub(who, text, o = {}) {
  const el2 = $('subLine'), sp = SPEAKERS[who] || SPEAKERS.sys;
  if (!SETTINGS.subs && !o.force) { el2.classList.remove('on'); return; }
  const name = sp.name && SETTINGS.subNames ? `<span class="who" style="color:${SETTINGS.subNames ? sp.color : 'inherit'}">${sp.name}${o.os ? ' (O.S.)' : ''}:</span>` : '';
  const body = esc(text).replace(/\((.*?)\)/g, '<span class="dir">($1)</span>').replace(/\*(.*?)\*/g, '<i>$1</i>');
  el2.className = 'ln on' + (o.caps ? ' caps' : '') + (o.tiny ? ' tiny' : '');
  el2.innerHTML = name + body;
}
function hideSub() { $('subLine').classList.remove('on'); }

// say(): a line of dialogue. Awaitable on the director's clock.
function say(who, text, o = {}) {
  const dur = o.dur || lineDuration(text) * (o.slow || 1);
  if (DIR.skipping) return Promise.resolve();
  const actor = o.actor || (who === 'rue' ? ACTORS.rue : ACTORS[who]);
  showSub(who, text, o);
  const syl = babble(who, text, dur, actor);
  DLG.line = { who, text, actor, syl, t: 0, dur, delay: who === 'rue' ? 0.16 : 0, id: (DLG.lineId = (DLG.lineId || 0) + 1) };
  if (actor && o.look !== false) for (const a of ACTOR_LIST) if (a !== actor && a.active && a.listen && a.id !== 'rue') a.lookAt(() => actor.headWorld(_v[22]), 1);
  const id = DLG.line.id;
  return wait(o.cutAt ? dur * o.cutAt : dur).then(() => { if (DLG.line && DLG.line.id === id) { if (o.cutAt) showSub(who, text.slice(0, Math.floor(text.length * o.cutAt)) + '—', o); DLG.line = o.hold ? DLG.line : null; if (!o.hold) hideSub(); } });
}
function updateDialogue(dt) {
  for (const a of DLG.talkActors) a.talk = damp(a.talk, 0, 20, dt);
  const L = DLG.line;
  if (L && L.actor) {
    L.t += dt;
    const v = sylEnvelope(L.syl, L.t - L.delay);
    L.actor.talk = v; DLG.talkActors.add(L.actor);
  }
  if (DLG.cardT > 0) { DLG.cardT -= dt; if (DLG.cardT <= 0) $('namecard').classList.remove('on'); }
}
function nameCard(who, role) {
  if (!SETTINGS.nameCards || DIR.skipping) return;
  const sp = SPEAKERS[who]; if (!sp) return;
  const nc = $('namecard'), rl = $('ncRole');
  $('ncName').textContent = sp.name; rl.textContent = role || sp.role; rl.classList.remove('upd');
  const c = ENV.cur ? ENV.cur.sun.clone().lerp(new THREE.Color(0x1fc8c1), ENV.name === 'night' || ENV.name === 'ward' ? 0.7 : 0.3) : new THREE.Color(0x1fc8c1);
  nc.style.setProperty('--nc-light', '#' + c.getHexString()); nc.style.setProperty('--nc-glow', `rgba(${c.r * 255 | 0},${c.g * 255 | 0},${c.b * 255 | 0},.35)`);
  nc.classList.add('on'); DLG.cardT = 4.2; DLG.seen.add(who);
}
function updateNameCardRole(role) { const rl = $('ncRole'); rl.textContent = role; rl.classList.remove('upd'); void rl.offsetWidth; rl.classList.add('upd'); $('namecard').classList.add('on'); DLG.cardT = 3.5; }

// barks: priority, cooldown, never the same line twice in a row
function bark(who, lines, { cd = 6, force = false, dur } = {}) {
  if (DIR.skipping || (DLG.line && !force)) return false;
  const now = G.time;
  if (!force && (DLG.barkCd[who] || 0) > now) return false;
  const pool = Array.isArray(lines) ? lines : [lines];
  let l = pick(pool); if (pool.length > 1 && l === DLG.lastBark[who]) l = pool[(pool.indexOf(l) + 1) % pool.length];
  DLG.lastBark[who] = l; DLG.barkCd[who] = now + cd;
  const d = dur || lineDuration(l) * 0.85;
  const actor = ACTORS[who];
  showSub(who, l, { caps: who === 'hamarr' });
  const syl = babble(who, l, d, actor);
  DLG.line = { who, text: l, actor, syl, t: 0, dur: d, delay: 0, id: (DLG.lineId = (DLG.lineId || 0) + 1), bark: true };
  const id = DLG.line.id;
  later(d, () => { if (DLG.line && DLG.line.id === id) { DLG.line = null; hideSub(); } });
  return true;
}

// walk-and-talk: a conversation attached to a path segment; combat interrupts it naturally (§5.8)
function startConvo(lines, { recover = null } = {}) {
  const c = { lines, i: 0, active: true, paused: false, recover };
  DLG.convo = c;
  (async () => {
    try {
      while (c.active && c.i < c.lines.length) {
        if (c.paused || G.combat) { await wait(0.3); continue; }
        if (c.resumeWith) { const r = c.resumeWith; c.resumeWith = null; await say('chase', r); await wait(0.3); continue; }
        const [who, text, gap] = c.lines[c.i];
        if (who === 'wait') { await wait(text); c.i++; continue; }
        const lineNo = c.i;
        await say(who, text);
        if (G.combat && c.i === lineNo) { c.resumeWith = c.recover || pick(['Anyway — as I was saying —', 'Where was I? Something about… oh, right.']); continue; }
        c.i++;
        await wait(gap != null ? gap : 0.45);
      }
    } catch (e) { if (!e.isAbort) console.warn(e); }
    c.active = false; if (DLG.convo === c) DLG.convo = null;
  })();
  return c;
}
function stopConvo() { if (DLG.convo) DLG.convo.active = false; DLG.convo = null; }

// ---------- Rue's video call: a tiny render target with compression artefacts ----------
const RUE = { scene: null, cam: null, rt: null, mat: null, overCanvas: null, overTex: null, mode: 'off', fps: 12, acc: 0, freeze: 0, glitch: 0, slate: null, visible: false, lagT: 0 };
function buildRueFeed() {
  const sc = new THREE.Scene();
  // same light layout as the main scene, so materials never switch programs
  sc.fog = new THREE.FogExp2(0x8899aa, 0.00001);
  sc.add(new THREE.HemisphereLight(0xdfe8f2, 0x8a7a6a, 2.6));
  const d = new THREE.DirectionalLight(0xfff2e0, 2.4); d.position.set(1.5, 3, 2.5); d.castShadow = true; d.shadow.mapSize.set(256, 256); sc.add(d); sc.add(d.target);
  for (let i = 0; i < 4; i++) { const p = new THREE.PointLight(0xffffff, 0, 5, 2); p.position.set(0, -50, 0); sc.add(p); }
  // Head Office: a window full of clouds, a shelf with a framed photo (Trinity College, 1987)
  const winT = textTex(128, 96, (g, w, h) => {
    const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#9fc2e6'); gr.addColorStop(1, '#e8f0f6'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
    const r = mulberry32(9); for (let i = 0; i < 26; i++) { g.fillStyle = 'rgba(255,255,255,.75)'; g.beginPath(); g.ellipse(r() * w, 40 + r() * 50, 10 + r() * 22, 5 + r() * 8, 0, 0, TAU); g.fill(); }
    g.fillStyle = '#c9d1d6'; g.fillRect(w / 2 - 2, 0, 4, h); g.fillRect(0, h / 2 - 2, w, 4);
  });
  const win = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 1.5), new THREE.MeshBasicMaterial({ map: winT })); win.position.set(-0.35, 1.7, -1.1); sc.add(win);
  const wall = new THREE.Mesh(new THREE.PlaneGeometry(6, 4), new THREE.MeshLambertMaterial({ color: 0xd9d4ca })); wall.position.set(0, 1.5, -1.12); sc.add(wall);
  const shelf = new GB().box(0.9, 0.04, 0.25, { pos: [0.85, 1.25, -0.98], color: 0x6e4b33 }).box(0.22, 0.28, 0.03, { pos: [0.75, 1.42, -0.95], rot: [-0.1, -0.2, 0], color: 0x3a2a1c }).box(0.06, 0.2, 0.06, { pos: [1.05, 1.37, -0.95], color: 0x2f6fb5 });
  sc.add(shelf.mesh(new THREE.MeshLambertMaterial({ vertexColors: true })));
  const photoT = textTex(64, 80, (g, w, h) => { g.fillStyle = '#d8cbb0'; g.fillRect(0, 0, w, h); g.fillStyle = '#8a8070'; g.fillRect(6, 6, w - 12, 50); g.fillStyle = '#5a4a3a'; g.beginPath(); g.arc(32, 26, 9, 0, TAU); g.fill(); g.fillRect(24, 34, 16, 22); g.fillStyle = '#3a3026'; g.font = '700 8px Georgia, serif'; drawLines(g, ['TRINITY', '1987'], w / 2, 64, 9); });
  const photo = new THREE.Mesh(new THREE.PlaneGeometry(0.18, 0.23), new THREE.MeshBasicMaterial({ map: photoT })); photo.position.set(0.75, 1.42, -0.93); photo.rotation.set(-0.1, -0.2, 0); sc.add(photo);
  const rue = buildRue(); sc.add(rue.root); rue.place(V3(0, 0, 0), 0); rue.breathPuffs = false; rue.listen = false;
  rue.anim.setOverlay('holdTablet', 50); rue.anim.overlayW = 0;
  RUE.actor = rue; RUE.scene = sc;
  RUE.cam = new THREE.PerspectiveCamera(36, 4 / 3, 0.05, 20); RUE.cam.position.set(0.05, 1.56, 0.95); RUE.cam.lookAt(0, 1.53, 0); sc.add(RUE.cam);
  RUE.rt = new THREE.WebGLRenderTarget(88, 66, { minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter, type: THREE.UnsignedByteType, depthBuffer: true });
  RUE.rt.texture.colorSpace = THREE.LinearSRGBColorSpace;
  const oc = document.createElement('canvas'); oc.width = 176; oc.height = 132; RUE.overCanvas = oc;
  RUE.overTex = new THREE.CanvasTexture(oc); RUE.overTex.colorSpace = THREE.SRGBColorSpace;
  RUE.mat = new THREE.ShaderMaterial({
    uniforms: { tFeed: { value: RUE.rt.texture }, tOver: { value: RUE.overTex }, glitch: { value: 0 }, time: U.time, mode: { value: 0 }, bright: { value: 0.75 } },
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: `varying vec2 vUv; uniform sampler2D tFeed, tOver; uniform float glitch, time, mode, bright;
      float h(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
      void main(){
        vec2 uv = vUv; vec3 c = vec3(0.02);
        if (mode > 0.5 && mode < 1.5) {
          float bl = mix(88.0, 10.0, glitch);
          vec2 buv = (floor(uv * vec2(bl, bl * 0.75)) + 0.5) / vec2(bl, bl * 0.75);
          vec2 juv = uv + (glitch > 0.3 ? vec2(step(0.7, h(floor(uv * 8.0) + floor(time * 6.0))) * 0.08, 0.0) : vec2(0.0));
          c = texture2D(tFeed, glitch > 0.01 ? mix(juv, buv, 0.85) : uv).rgb;
          c = pow(c, vec3(0.4545));
          c = floor(c * 18.0 + 0.5) / 18.0;
        } else if (mode > 2.5) { c = vec3(h(uv * 200.0 + time)); }
        vec4 o = texture2D(tOver, uv); c = mix(c, o.rgb, o.a);
        gl_FragColor = vec4(pow(c, vec3(2.2)) * bright, 1.0);
      }`,
  });
  R.preRenders.push(updateRueFeed);
}
function setRueMode(mode) {
  RUE.mode = mode;
  const g = RUE.overCanvas.getContext('2d'), w = 176, h = 132;
  g.clearRect(0, 0, w, h);
  let m = 0;
  if (mode === 'live' || mode === 'connecting') { m = 1; g.fillStyle = 'rgba(0,0,0,.45)'; g.fillRect(0, h - 16, w, 16); g.fillStyle = '#fff'; g.font = '600 10px Barlow, sans-serif'; g.textAlign = 'left'; g.fillText('Rue · Head Office', 6, h - 5); g.fillStyle = '#e33'; g.beginPath(); g.arc(w - 10, h - 8, 3.5, 0, TAU); g.fill(); }
  if (mode === 'connecting') { g.strokeStyle = '#fff'; g.lineWidth = 2; g.beginPath(); g.arc(w / 2, h / 2 - 8, 9, 0, TAU); g.stroke(); g.fillStyle = '#fff'; g.beginPath(); g.arc(w / 2, h / 2 - 12, 3.4, 0, TAU); g.fill(); g.beginPath(); g.moveTo(w / 2 - 12, h / 2 + 6); g.lineTo(w / 2 + 12, h / 2 - 22); g.stroke(); }
  if (mode === 'ringing') { g.fillStyle = '#10161a'; g.fillRect(0, 0, w, h); g.fillStyle = '#fff'; g.font = '700 15px Barlow, sans-serif'; g.textAlign = 'center'; g.fillText('Rue', w / 2, 40); g.font = '500 9px Barlow, sans-serif'; g.fillText('Head Office · video call', w / 2, 54); g.fillStyle = '#2ecc71'; g.beginPath(); g.arc(w / 2 - 30, 96, 13, 0, TAU); g.fill(); g.fillStyle = '#e74c3c'; g.beginPath(); g.arc(w / 2 + 30, 96, 13, 0, TAU); g.fill(); }
  if (mode === 'cameraOff') { g.fillStyle = '#4a5258'; g.fillRect(0, 0, w, h); g.fillStyle = '#6e7880'; g.beginPath(); g.arc(w / 2, h / 2 - 4, 26, 0, TAU); g.fill(); g.fillStyle = '#fff'; g.font = '700 26px Barlow, sans-serif'; g.textAlign = 'center'; g.fillText('R', w / 2, h / 2 + 5); g.font = '500 9px Barlow, sans-serif'; g.fillText('Camera off', w / 2, h - 10); }
  if (mode === 'ended') { g.fillStyle = '#1a1f23'; g.fillRect(0, 0, w, h); g.fillStyle = '#fff'; g.font = '600 12px Barlow, sans-serif'; g.textAlign = 'center'; g.fillText('Call ended by host', w / 2, h / 2 + 4); }
  if (mode === 'static') m = 3;
  RUE.mat.uniforms.mode.value = m; RUE.overTex.needsUpdate = true;
}
function updateRueFeed(dt) {
  if (!RUE.visible || (RUE.mode !== 'live' && RUE.mode !== 'connecting')) return;
  RUE.acc += dt; RUE.lagT -= dt;
  if (RUE.lagT < 0) { RUE.lagT = 3 + frand() * 6; RUE.freeze = 0.15 + frand() * 0.45; }
  if (RUE.freeze > 0) { RUE.freeze -= dt; RUE.mat.uniforms.glitch.value = Math.max(RUE.mat.uniforms.glitch.value, 0.35); if (RUE.mode === 'live') return; }
  RUE.mat.uniforms.glitch.value = damp(RUE.mat.uniforms.glitch.value, RUE.mode === 'connecting' ? 0.9 : 0, 6, dt);
  if (RUE.acc < 1 / RUE.fps) return;
  RUE.acc = 0;
  const r = R.renderer, prev = r.getRenderTarget();
  r.setRenderTarget(RUE.rt); r.render(RUE.scene, RUE.cam); r.setRenderTarget(prev);
}
// the physical slate prop in the world
function buildSlateProp() {
  const g = new THREE.Group();
  const tab = buildTablet(RUE.mat); tab.position.y = 0.2; tab.rotation.x = -0.08; g.add(tab);
  const tri = buildTripod(); g.add(tri);
  g.userData = { tablet: tab, tripod: tri };
  R.scene.add(g); RUE.slate = g; g.visible = false;
  return g;
}
