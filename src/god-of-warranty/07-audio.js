// ================= AUDIO =================
// Everything is synthesised at runtime (§11). No audio files.
const mtof = m => 440 * Math.pow(2, (m - 69) / 12);
const AUDIO = {
  ctx: null, ok: false, master: null, musicBus: null, sfxBus: null, voiceBus: null, rev: null, revSend: null, noise: null,
  cue: null, cueName: '', nextNote: 0, beat: 0, timer: 0, layers: {}, holdBus: null, holdGain: null, humGain: null, windGain: null, fireGain: null,
  low: null, lowTarget: 22000, spaces: {}, space: 'forest', cueGains: [],
};
function initAudio() {
  if (AUDIO.ctx) { if (AUDIO.ctx.state === 'suspended') AUDIO.ctx.resume(); return; }
  const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
  let ctx;
  try { ctx = new AC({ latencyHint: 'interactive' }); } catch (e) { return; }
  AUDIO.ctx = ctx;
  const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -14; comp.ratio.value = 3.5; comp.attack.value = 0.006; comp.release.value = 0.25;
  AUDIO.master = ctx.createGain(); AUDIO.low = ctx.createBiquadFilter(); AUDIO.low.type = 'lowpass'; AUDIO.low.frequency.value = 22000;
  AUDIO.master.connect(AUDIO.low); AUDIO.low.connect(comp); comp.connect(ctx.destination);
  AUDIO.musicBus = ctx.createGain(); AUDIO.sfxBus = ctx.createGain(); AUDIO.voiceBus = ctx.createGain();
  [AUDIO.musicBus, AUDIO.sfxBus, AUDIO.voiceBus].forEach(b => b.connect(AUDIO.master));
  // white noise buffer
  const nb = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate), nd = nb.getChannelData(0); for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1; AUDIO.noise = nb;
  // procedurally generated impulse responses per space
  const ir = (secs, decay, bright) => { const len = Math.floor(ctx.sampleRate * secs), b = ctx.createBuffer(2, len, ctx.sampleRate); for (let c = 0; c < 2; c++) { const d = b.getChannelData(c); let lp = 0; for (let i = 0; i < len; i++) { const t = i / len; const n = (Math.random() * 2 - 1) * Math.pow(1 - t, decay); lp = lp + (n - lp) * bright; d[i] = lp; } } return b; };
  AUDIO.rev = ctx.createConvolver(); AUDIO.rev.buffer = ir(3.0, 3.2, 0.5);
  AUDIO.spaces = { forest: ir(2.2, 3.5, 0.6), yard: ir(3.2, 3.0, 0.45), interior: ir(1.0, 2.5, 0.35), bridge: ir(2.8, 2.6, 0.7), open: ir(3.6, 2.8, 0.5) };
  AUDIO.revSend = ctx.createGain(); AUDIO.revSend.gain.value = 0.35; AUDIO.revSend.connect(AUDIO.rev);
  const revOut = ctx.createGain(); revOut.gain.value = 0.9; AUDIO.rev.connect(revOut); revOut.connect(AUDIO.master);
  // ambience beds
  AUDIO.windGain = loopNoise('lowpass', 500, 0.0, AUDIO.sfxBus, 0.5);
  AUDIO.fireGain = loopNoise('bandpass', 1800, 0.0, AUDIO.sfxBus, 0.9, true);
  // the ward's hum: 60/120 Hz with soft harmonics
  const hg = ctx.createGain(); hg.gain.value = 0; hg.connect(AUDIO.sfxBus); AUDIO.humGain = hg;
  for (const [f, a] of [[60, 0.5], [120, 0.35], [180, 0.12], [240, 0.06]]) { const o = ctx.createOscillator(); o.frequency.value = f; const g = ctx.createGain(); g.gain.value = a * 0.12; o.connect(g); g.connect(hg); o.start(); }
  // the hold-music bus (telephone band, bit-crushed)
  const hb = ctx.createGain(); const bp1 = ctx.createBiquadFilter(); bp1.type = 'highpass'; bp1.frequency.value = 300; const bp2 = ctx.createBiquadFilter(); bp2.type = 'lowpass'; bp2.frequency.value = 3400;
  const crush = ctx.createWaveShaper(); const curve = new Float32Array(1024); for (let i = 0; i < 1024; i++) { const x = i / 512 - 1; curve[i] = Math.round(x * 12) / 12; } crush.curve = curve;
  AUDIO.holdPan = ctx.createStereoPanner(); AUDIO.holdGain = ctx.createGain(); AUDIO.holdGain.gain.value = 0;
  hb.connect(bp1); bp1.connect(bp2); bp2.connect(crush); crush.connect(AUDIO.holdGain); AUDIO.holdGain.connect(AUDIO.holdPan); AUDIO.holdPan.connect(AUDIO.sfxBus);
  AUDIO.holdBus = hb; AUDIO.holdNext = 0; AUDIO.holdStep = 0;
  applyVolumes();
  AUDIO.ok = true;
  AUDIO.timer = setInterval(scheduleMusic, 25);
  if (AUDIO.pendingCue) { const [n, f] = AUDIO.pendingCue; AUDIO.pendingCue = null; musicCue(n, f); }
}
function applyVolumes() {
  if (!AUDIO.ctx) return;
  const t = AUDIO.ctx.currentTime;
  AUDIO.master.gain.setTargetAtTime(SETTINGS.vMaster, t, 0.05); AUDIO.musicBus.gain.setTargetAtTime(SETTINGS.vMusic * 0.55, t, 0.05);
  AUDIO.sfxBus.gain.setTargetAtTime(SETTINGS.vSfx * 0.8, t, 0.05); AUDIO.voiceBus.gain.setTargetAtTime(SETTINGS.vVoice * 0.7, t, 0.05);
}
function loopNoise(type, freq, gain, dest, q = 0.7, crackle = false) {
  const ctx = AUDIO.ctx, src = ctx.createBufferSource(); src.buffer = AUDIO.noise; src.loop = true;
  const f = ctx.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = q;
  const g = ctx.createGain(); g.gain.value = gain;
  src.connect(f); f.connect(g); g.connect(dest); src.start();
  g.filter = f;
  return g;
}
function setSpace(name) { if (!AUDIO.ok || AUDIO.space === name || !AUDIO.spaces[name]) return; AUDIO.space = name; AUDIO.rev.buffer = AUDIO.spaces[name]; }

// ---------- instruments ----------
const T0 = () => AUDIO.ctx.currentTime;
function env(g, t, a, peak, hold, rel) { const p = g.gain; p.cancelScheduledValues(t); p.setValueAtTime(0.0001, t); p.linearRampToValueAtTime(peak, t + a); p.setValueAtTime(peak, t + a + hold); p.exponentialRampToValueAtTime(0.0001, t + a + hold + rel); }
function osc(type, f, t, stop, dest, detune = 0) { const o = AUDIO.ctx.createOscillator(); o.type = type; o.frequency.setValueAtTime(f, t); o.detune.value = detune; o.connect(dest); o.start(t); o.stop(stop); return o; }
function noiseSrc(t, dur, dest, rate = 1) { const s = AUDIO.ctx.createBufferSource(); s.buffer = AUDIO.noise; s.playbackRate.value = rate; s.connect(dest); s.start(t, Math.random() * 1.5); s.stop(t + dur); return s; }
function gainNode(v, dest) { const g = AUDIO.ctx.createGain(); g.gain.value = v; if (dest) g.connect(dest); return g; }
function filt(type, f, q, dest) { const b = AUDIO.ctx.createBiquadFilter(); b.type = type; b.frequency.value = f; b.Q.value = q; if (dest) b.connect(dest); return b; }
function sendRev(node, amt) { const g = gainNode(amt, AUDIO.revSend); node.connect(g); }
const INST = {
  choir(t, m, dur, vel, out, vowel = 'ah') {
    const g = gainNode(0, out); sendRev(g, 0.9);
    const F = vowel === 'oh' ? [450, 800] : vowel === 'oo' ? [320, 760] : [730, 1150];
    const f1 = filt('bandpass', F[0], 6, g), f2 = filt('bandpass', F[1], 8, g);
    const mix = gainNode(0.5); mix.connect(f1); mix.connect(f2);
    for (const d of [-9, 0, 8]) { const o = osc('sawtooth', mtof(m), t, t + dur + 1.6, mix, d); const v = AUDIO.ctx.createOscillator(); v.frequency.value = 4.6 + Math.random(); const vg = gainNode(5); v.connect(vg); vg.connect(o.detune); v.start(t); v.stop(t + dur + 1.6); }
    env(g, t, 0.7, vel * 0.32, Math.max(0, dur - 0.7), 1.4);
  },
  strings(t, m, dur, vel, out) {
    const g = gainNode(0, out); sendRev(g, 0.6); const lp = filt('lowpass', 1300, 0.6, g);
    for (const d of [-11, 0, 9]) osc('sawtooth', mtof(m), t, t + dur + 1.2, lp, d);
    env(g, t, 0.45, vel * 0.12, Math.max(0, dur - 0.45), 1.0);
  },
  cello(t, m, dur, vel, out) {
    const g = gainNode(0, out); sendRev(g, 0.7); const lp = filt('lowpass', 1700, 0.8, g);
    const o = osc('sawtooth', mtof(m), t, t + dur + 0.9, lp);
    const v = AUDIO.ctx.createOscillator(); v.frequency.value = 5.4; const vg = AUDIO.ctx.createGain(); vg.gain.setValueAtTime(0, t); vg.gain.linearRampToValueAtTime(14, t + Math.min(0.6, dur)); v.connect(vg); vg.connect(o.detune); v.start(t); v.stop(t + dur + 0.9);
    const ng = gainNode(0.03, g); noiseSrc(t, dur + 0.5, filt('bandpass', 2400, 1.5, ng));
    env(g, t, 0.18, vel * 0.22, Math.max(0, dur - 0.18), 0.8);
  },
  taiko(t, vel, out, pitch = 1) {
    const g = gainNode(0, out); sendRev(g, 0.4);
    const o = AUDIO.ctx.createOscillator(); o.frequency.setValueAtTime(120 * pitch, t); o.frequency.exponentialRampToValueAtTime(42 * pitch, t + 0.28); o.connect(g); o.start(t); o.stop(t + 0.9);
    env(g, t, 0.004, vel * 0.9, 0.02, 0.6);
    const ng = gainNode(0, out); noiseSrc(t, 0.12, filt('lowpass', 900, 0.8, ng)); env(ng, t, 0.002, vel * 0.5, 0.01, 0.1);
  },
  brass(t, m, dur, vel, out) {
    const g = gainNode(0, out); sendRev(g, 0.5); const lp = filt('lowpass', 900, 2, g);
    lp.frequency.setValueAtTime(600, t); lp.frequency.linearRampToValueAtTime(3200, t + 0.05); lp.frequency.exponentialRampToValueAtTime(900, t + 0.35);
    for (const d of [-6, 6]) osc('sawtooth', mtof(m), t, t + dur + 0.5, lp, d);
    env(g, t, 0.03, vel * 0.16, Math.max(0, dur - 0.03), 0.35);
  },
  bell(t, m, dur, vel, out, ratio = 3.5) {
    const g = gainNode(0, out); sendRev(g, 0.8);
    const c = osc('sine', mtof(m), t, t + dur + 2, g);
    const mo = AUDIO.ctx.createOscillator(); mo.frequency.value = mtof(m) * ratio; const mg = AUDIO.ctx.createGain(); mg.gain.setValueAtTime(mtof(m) * 3, t); mg.gain.exponentialRampToValueAtTime(1, t + dur + 1.5); mo.connect(mg); mg.connect(c.frequency); mo.start(t); mo.stop(t + dur + 2);
    env(g, t, 0.003, vel * 0.18, 0.02, dur + 1.6);
  },
  pluck(t, m, vel, out) { INST.bell(t, m, 0.6, vel * 1.2, out, 2.0); },
  pad(t, m, dur, vel, out) { const g = gainNode(0, out); sendRev(g, 0.9); const lp = filt('lowpass', 900, 0.5, g); for (const d of [-12, 0, 12]) osc('triangle', mtof(m), t, t + dur + 2.5, lp, d); env(g, t, 1.5, vel * 0.1, Math.max(0, dur - 1.5), 2.2); },
  sub(t, f, dur, vel, out) { const g = gainNode(0, out); osc('sine', f, t, t + dur + 1.5, g); env(g, t, 1.2, vel * 0.5, Math.max(0, dur - 1.2), 1.2); },
  ep(t, m, dur, vel, out) {
    const g = gainNode(0, out);
    const c = osc('sine', mtof(m), t, t + dur + 0.6, g);
    const mo = AUDIO.ctx.createOscillator(); mo.frequency.value = mtof(m); const mg = AUDIO.ctx.createGain(); mg.gain.setValueAtTime(mtof(m) * 1.4, t); mg.gain.exponentialRampToValueAtTime(mtof(m) * 0.1, t + 0.5); mo.connect(mg); mg.connect(c.frequency); mo.start(t); mo.stop(t + dur + 0.6);
    env(g, t, 0.005, vel * 0.16, Math.max(0, dur * 0.4), dur * 0.6 + 0.3);
  },
  kick(t, vel, out) { const g = gainNode(0, out); const o = AUDIO.ctx.createOscillator(); o.frequency.setValueAtTime(140, t); o.frequency.exponentialRampToValueAtTime(48, t + 0.12); o.connect(g); o.start(t); o.stop(t + 0.4); env(g, t, 0.002, vel * 0.8, 0.01, 0.28); },
  snare(t, vel, out) { const g = gainNode(0, out); noiseSrc(t, 0.25, filt('bandpass', 1800, 0.8, g)); env(g, t, 0.002, vel * 0.35, 0.01, 0.18); sendRev(g, 0.3); },
  hat(t, vel, out) { const g = gainNode(0, out); noiseSrc(t, 0.06, filt('highpass', 7000, 0.8, g)); env(g, t, 0.001, vel * 0.12, 0.005, 0.04); },
  hum(t, m, dur, vel, out) { const g = gainNode(0, out); sendRev(g, 0.3); const lp = filt('lowpass', 700, 1.2, g); const o = osc('triangle', mtof(m - 12), t, t + dur + 0.4, lp); const v = AUDIO.ctx.createOscillator(); v.frequency.value = 5; const vg = gainNode(8); v.connect(vg); vg.connect(o.detune); v.start(t); v.stop(t + dur + 0.4); env(g, t, 0.08, vel * 0.5, Math.max(0, dur - 0.1), 0.25); },
};

// ---------- the score ----------
const CUES = {
  silence: { bpm: 60, step() {} },
  title: { bpm: 60, step(t, b) {
    if (b % 8 === 0) for (const m of [50, 57, 62, 65]) INST.choir(t, m, 9, 0.5, AUDIO.musicBus, 'oh');
    if (b % 16 === 4) INST.sub(t, mtof(38), 10, 0.3, AUDIO.musicBus);
    if (b % 40 === 12) playMotif(t, 'cello', 0.8, 60);
  } },
  wifaye: { bpm: 56, step(t, b) {
    const prog = [[38, 45, 53], [34, 41, 50], [41, 48, 57], [36, 43, 52]];
    if (b % 6 === 0) { const c = prog[(b / 6 | 0) % 4]; c.forEach(m => INST.strings(t, m, 6.2, 0.6, AUDIO.musicBus)); }
    if (b === 2) playMotif(t, 'cello', 0.7, 56);
  } },
  pyre: { bpm: 56, step(t, b) {
    const prog = [[38, 45, 53, 62], [34, 41, 50, 58], [41, 48, 57, 65], [43, 50, 55, 62]];
    if (b % 4 === 0) { const c = prog[(b / 4 | 0) % 4]; c.forEach(m => INST.strings(t, m, 4.3, 0.75, AUDIO.musicBus)); }
    if (b % 16 === 0) playMotif(t, 'choir', 0.9, 56);
    if (b % 16 === 0) playMotif(t, 'strings', 0.6, 56, -12);
    if (b % 8 === 0) INST.taiko(t, 0.35, AUDIO.musicBus, 0.8);
  } },
  cable: { bpm: 50, step(t, b) {
    if (b === 0) { INST.sub(t, mtof(26), 14, 0.7, AUDIO.musicBus); [50, 57, 62, 69].forEach(m => INST.choir(t, m, 12, 0.6, AUDIO.musicBus, 'oh')); }
    if (b === 8) [53, 57, 60, 65].forEach(m => INST.choir(t, m, 8, 0.5, AUDIO.musicBus, 'oh'));
  } },
  embers: { bpm: 54, step(t, b) { if (b % 8 === 0) [38, 45, 50].forEach(m => INST.pad(t, m, 8, 0.45, AUDIO.musicBus)); if (b % 24 === 6) INST.bell(t, 74, 2, 0.3, AUDIO.musicBus); } },
  ward: { bpm: 112, step(t, b) {
    INST.taiko(t, b % 4 === 0 ? 1 : 0.55, AUDIO.musicBus, b % 4 === 0 ? 0.9 : 1.3);
    if (b % 2 === 1) INST.taiko(t + 60 / 112 / 2, 0.35, AUDIO.musicBus, 1.5);
    if (b % 8 === 0) [50, 57, 62].forEach(m => INST.brass(t, m, 0.5, 0.9, AUDIO.musicBus));
    if (b % 16 === 8) [62, 65, 69].forEach(m => INST.choir(t, m, 1.6, 0.8, AUDIO.musicBus, 'ah'));
  } },
  combat: { bpm: 104, layers: ['base', 'intense', 'rage'], step(t, b) {
    const L = AUDIO.layers, e = 60 / 104 / 2;
    // base percussion
    INST.taiko(t, (b % 4 === 0 ? 0.9 : b % 4 === 2 ? 0.65 : 0.3) * L.base, AUDIO.musicBus, b % 4 === 0 ? 0.85 : 1.2);
    if (b % 2 === 1) INST.taiko(t + e, 0.25 * L.base, AUDIO.musicBus, 1.6);
    // ostinato
    const bass = [38, 38, 41, 38, 36, 36, 34, 36][Math.floor(b / 2) % 8];
    INST.strings(t, bass, e * 1.6, 0.5 * L.base, AUDIO.musicBus); INST.strings(t + e, bass + 12, e * 0.8, 0.35 * L.base, AUDIO.musicBus);
    // intensity: brass + strings
    if (L.intense > 0.05) { if (b % 4 === 0) [bass + 12, bass + 19, bass + 24].forEach(m => INST.brass(t, m, 0.35, 0.8 * L.intense, AUDIO.musicBus)); if (b % 8 === 4) [62, 65, 69].forEach(m => INST.strings(t, m, 2, 0.5 * L.intense, AUDIO.musicBus)); }
    // rage drums
    if (L.rage > 0.05) { INST.taiko(t, 0.8 * L.rage, AUDIO.musicBus, 0.7); INST.taiko(t + e, 0.6 * L.rage, AUDIO.musicBus, 0.75); if (b % 2 === 0) INST.choir(t, 50, 0.4, 0.5 * L.rage, AUDIO.musicBus, 'ah'); }
  } },
  zee: { bpm: 72, step(t, b) {
    const arp = [62, 65, 69, 72, 76, 72, 69, 65];
    INST.pluck(t, arp[b % 8], 0.4, AUDIO.musicBus); if (b % 2) INST.pluck(t + 60 / 72 / 2, arp[(b + 3) % 8] - 12, 0.25, AUDIO.musicBus);
    if (b % 8 === 0) [50, 57, 64].forEach(m => INST.pad(t, m, 7, 0.5, AUDIO.musicBus));
  } },
  explore: { bpm: 60, step(t, b) {
    if (b % 12 === 0) [38, 45, 52].forEach(m => INST.pad(t, m, 11, 0.35, AUDIO.musicBus));
    if (b % 24 === 9) { const k = (b / 24 | 0) % 3; if (k === 0) playMotif(t, 'bell', 0.35, 60, 12); else INST.cello(t, [62, 65, 69][k], 3, 0.4, AUDIO.musicBus); }
  } },
  queue: { bpm: 60, step() {} },
  hamarr: { bpm: 96, step(t, b) {
    const e = 60 / 96 / 2;
    INST.taiko(t, b % 2 === 0 ? 1 : 0.6, AUDIO.musicBus, b % 4 === 0 ? 0.7 : 1.0); INST.taiko(t + e, 0.4, AUDIO.musicBus, 1.4);
    if (b % 8 === 0) { INST.choir(t, 38, 0.7, 1, AUDIO.musicBus, 'ah'); INST.choir(t, 45, 0.7, 0.8, AUDIO.musicBus, 'ah'); }
    if (b % 8 === 1) { INST.choir(t + e, 37, 1.1, 1, AUDIO.musicBus, 'oo'); INST.choir(t + e, 44, 1.1, 0.8, AUDIO.musicBus, 'oo'); }
    if (b % 4 === 2) [38, 50].forEach(m => INST.brass(t, m, 0.4, 0.8, AUDIO.musicBus));
    const bass = [38, 38, 39, 38][Math.floor(b / 4) % 4]; INST.strings(t, bass, e * 1.5, 0.6, AUDIO.musicBus);
    if (AUDIO.layers.rage > 0.05) { INST.taiko(t, 0.8 * AUDIO.layers.rage, AUDIO.musicBus, 0.6); }
  } },
  knock: { bpm: 60, step(t, b) { if (b === 6) INST.strings(t, 38, 10, 0.7, AUDIO.musicBus); } },
  ending: { bpm: 60, step(t, b) { if (b === 0) INST.strings(t, 38, 7, 0.6, AUDIO.musicBus); if (b === 6) playMotif(t, 'cello', 0.8, 60); } },
  credits: { bpm: 80, step(t, b) {
    const e = 60 / 80 / 2, sw = e * 0.16;
    if (b % 4 === 0 || b % 8 === 5) INST.kick(t, 0.8, AUDIO.musicBus);
    if (b % 4 === 2) INST.snare(t, 0.7, AUDIO.musicBus);
    INST.hat(t, 0.6, AUDIO.musicBus); INST.hat(t + e + sw, 0.4, AUDIO.musicBus);
    const chords = [[50, 53, 57, 60], [46, 50, 53, 57], [41, 45, 48, 52], [48, 52, 55, 59]];
    if (b % 4 === 0) chords[(b / 4 | 0) % 4].forEach(m => INST.ep(t, m, 1.8, 0.55, AUDIO.musicBus));
    if (b % 16 === 0) playMotif(t, CREDITS_PUDDING() ? 'bell' : 'ep', 0.7, 80, 12);
  } },
};
const CREDITS_PUDDING = () => !!(G && G.flags && G.flags.tape);
function playMotif(t, inst, vel, bpm, transpose = 0) {
  const b = 60 / bpm; let tt = t;
  for (const n of MOTIF) { const d = n.d * b; if (inst === 'cello') INST.cello(tt, n.n + transpose - 12, d * 0.95, vel, AUDIO.musicBus); else if (inst === 'choir') INST.choir(tt, n.n + transpose, d * 0.95, vel, AUDIO.musicBus, 'ah'); else if (inst === 'strings') INST.strings(tt, n.n + transpose, d, vel, AUDIO.musicBus); else if (inst === 'bell') INST.bell(tt, n.n + transpose, d, vel, AUDIO.musicBus); else if (inst === 'ep') INST.ep(tt, n.n + transpose, d, vel, AUDIO.musicBus); tt += d; }
}
function musicCue(name, fade = 2) {
  if (!AUDIO.ok) { AUDIO.pendingCue = [name, fade]; return; }
  if (AUDIO.cueName === name) return;
  const ctx = AUDIO.ctx, t = ctx.currentTime;
  // crossfade: the old bus fades out, a new bus fades in
  const old = AUDIO.musicBus;
  old.gain.cancelScheduledValues(t); old.gain.setValueAtTime(old.gain.value, t); old.gain.linearRampToValueAtTime(0.0001, t + fade);
  setTimeout(() => { try { old.disconnect(); } catch (e) { } }, (fade + 3) * 1000);
  const nb = ctx.createGain(); nb.gain.value = 0.0001; nb.connect(AUDIO.master); nb.gain.linearRampToValueAtTime(SETTINGS.vMusic * 0.55, t + Math.max(0.05, fade * 0.6));
  AUDIO.musicBus = nb;
  AUDIO.cue = CUES[name] || CUES.silence; AUDIO.cueName = name; AUDIO.beat = 0; AUDIO.nextNote = t + 0.08;
  if (name === 'combat' || name === 'hamarr') AUDIO.layers = { base: 1, intense: 0, rage: 0 };
}
function scheduleMusic() {
  if (!AUDIO.ok || !AUDIO.cue) return;
  const ctx = AUDIO.ctx, ahead = 0.18;
  if (ctx.state !== 'running') return;
  if (AUDIO.nextNote < ctx.currentTime - 0.5) AUDIO.nextNote = ctx.currentTime + 0.05;
  while (AUDIO.nextNote < ctx.currentTime + ahead) {
    try { AUDIO.cue.step(AUDIO.nextNote, AUDIO.beat); } catch (e) { console.warn(e); }
    AUDIO.nextNote += 60 / AUDIO.cue.bpm; AUDIO.beat++;
  }
  // hold music loop (bossa EP + bass, aggressively bland)
  if (AUDIO.holdGain.gain.value > 0.001) {
    while (AUDIO.holdNext < ctx.currentTime + ahead) {
      const s = AUDIO.holdStep++, t = Math.max(AUDIO.holdNext, ctx.currentTime), e = 0.21;
      const ch = [[60, 64, 67, 71], [57, 60, 64, 67], [62, 65, 69, 72], [55, 59, 62, 65]][Math.floor(s / 8) % 4];
      if (s % 8 === 0 || s % 8 === 3 || s % 8 === 6) ch.forEach(m => INST.ep(t, m, 0.3, 0.5, AUDIO.holdBus));
      if (s % 4 === 0) INST.ep(t, ch[0] - 24, 0.4, 0.8, AUDIO.holdBus);
      const g = gainNode(0, AUDIO.holdBus); noiseSrc(t, 0.05, filt('highpass', 5000, 1, g)); env(g, t, 0.002, 0.08, 0.01, 0.03);
      if (s % 16 === 10) INST.ep(t, [76, 74, 72][Math.floor(s / 16) % 3], 0.5, 0.4, AUDIO.holdBus);
      AUDIO.holdNext = t + e;
    }
  } else AUDIO.holdNext = ctx.currentTime;
}
function setMusicLayers(base, intense, rage) { const L = AUDIO.layers; if (!L) return; L.base = damp(L.base || 0, base, 2, 0.1); L.intense = damp(L.intense || 0, intense, 2, 0.1); L.rage = damp(L.rage || 0, rage, 3, 0.1); }

// ---------- sound effects ----------
const _sp = V3();
function spatial(pos) {
  if (!pos) return { pan: 0, gain: 1 };
  const cam = R.camera, rel = _sp.copy(pos).sub(cam.position), d = rel.length();
  const right = _v[21].set(1, 0, 0).applyQuaternion(cam.quaternion);
  return { pan: clamp(rel.dot(right) / Math.max(d, 1) * 0.85, -1, 1), gain: 1 / (1 + Math.max(0, d - 3) * 0.12) };
}
function sfxOut(pos, vol = 1) {
  const sp = spatial(pos), g = gainNode(vol * sp.gain), p = AUDIO.ctx.createStereoPanner(); p.pan.value = sp.pan; g.connect(p); p.connect(AUDIO.sfxBus); sendRev(g, 0.18); return g;
}
function sfx(name, pos = null, vol = 1, pitch = 1) {
  if (!AUDIO.ok) return;
  const t = T0(), out = sfxOut(pos, vol), pr = pitch * (0.94 + Math.random() * 0.12);
  switch (name) {
    case 'swing': { const g = gainNode(0, out), b = filt('bandpass', 600, 1.2, g); b.frequency.setValueAtTime(400 * pr, t); b.frequency.exponentialRampToValueAtTime(2400 * pr, t + 0.16); noiseSrc(t, 0.22, b); env(g, t, 0.03, 0.5, 0.05, 0.12); break; }
    case 'heavySwing': { const g = gainNode(0, out), b = filt('bandpass', 300, 1.0, g); b.frequency.setValueAtTime(200 * pr, t); b.frequency.exponentialRampToValueAtTime(1500 * pr, t + 0.28); noiseSrc(t, 0.35, b); env(g, t, 0.06, 0.7, 0.08, 0.2); break; }
    case 'hit': { const g = gainNode(0, out); const o = AUDIO.ctx.createOscillator(); o.frequency.setValueAtTime(140 * pr, t); o.frequency.exponentialRampToValueAtTime(50, t + 0.12); o.connect(g); o.start(t); o.stop(t + 0.3); env(g, t, 0.002, 0.9, 0.01, 0.16); const n = gainNode(0, out); noiseSrc(t, 0.12, filt('lowpass', 2200 * pr, 0.8, n)); env(n, t, 0.001, 0.6, 0.01, 0.08); break; }
    case 'frost': { const n = gainNode(0, out); noiseSrc(t, 0.2, filt('highpass', 3000, 0.8, n)); env(n, t, 0.001, 0.4, 0.01, 0.12); INST.bell(t, 88 + Math.random() * 4, 0.1, 0.4, out, 5.3); break; }
    case 'shatter': { for (let i = 0; i < 5; i++) INST.bell(t + i * 0.02, 84 + Math.random() * 12, 0.08, 0.35, out, 4.7); const n = gainNode(0, out); noiseSrc(t, 0.35, filt('highpass', 2500, 0.6, n)); env(n, t, 0.001, 0.6, 0.02, 0.25); break; }
    case 'wood': { const g = gainNode(0, out); osc('triangle', 180 * pr, t, t + 0.2, g); env(g, t, 0.001, 0.6, 0.01, 0.1); const n = gainNode(0, out); noiseSrc(t, 0.1, filt('bandpass', 1200, 1.5, n)); env(n, t, 0.001, 0.5, 0.01, 0.06); break; }
    case 'throw': { const g = gainNode(0, out); const o = osc('square', 900, t, t + 0.6, filt('lowpass', 2500, 1, g)); o.frequency.exponentialRampToValueAtTime(1500, t + 0.5); const tr = AUDIO.ctx.createOscillator(); tr.frequency.value = 22; const tg = gainNode(0.5); tr.connect(tg); tg.connect(g.gain); tr.start(t); tr.stop(t + 0.6); env(g, t, 0.02, 0.12, 0.4, 0.1); break; }
    case 'callback': { INST.bell(t, 81, 0.1, 0.6, out, 2); INST.bell(t + 0.11, 88, 0.15, 0.6, out, 2); break; }
    case 'catch': { const g = gainNode(0, out); const o = AUDIO.ctx.createOscillator(); o.frequency.setValueAtTime(110, t); o.frequency.exponentialRampToValueAtTime(55, t + 0.08); o.connect(g); o.start(t); o.stop(t + 0.2); env(g, t, 0.001, 1.0, 0.01, 0.1); const n = gainNode(0, out); noiseSrc(t + 0.03, 0.12, filt('bandpass', 700, 3, n)); env(n, t + 0.03, 0.01, 0.15, 0.03, 0.06); break; }
    case 'parry': { [62, 69, 74, 78].forEach((m, i) => INST.bell(t + i * 0.005, m + 12, 0.2, 0.4, out, 1.0)); const n = gainNode(0, out); noiseSrc(t, 0.1, filt('highpass', 4000, 1, n)); env(n, t, 0.001, 0.5, 0.01, 0.08); break; }
    case 'block': { const g = gainNode(0, out); osc('square', 220 * pr, t, t + 0.15, filt('lowpass', 1500, 1, g)); env(g, t, 0.001, 0.25, 0.01, 0.1); const n = gainNode(0, out); noiseSrc(t, 0.12, filt('bandpass', 3000, 1, n)); env(n, t, 0.001, 0.4, 0.01, 0.08); break; }
    case 'step': { const n = gainNode(0, out); noiseSrc(t, 0.09, filt('bandpass', 900 * pr, 1.2, n), 0.6 + Math.random() * 0.3); env(n, t, 0.005, 0.12, 0.01, 0.06); break; }
    case 'whoosh': { const g = gainNode(0, out), b = filt('bandpass', 300, 0.8, g); b.frequency.setValueAtTime(200, t); b.frequency.exponentialRampToValueAtTime(1200, t + 0.4); noiseSrc(t, 0.6, b); env(g, t, 0.15, 0.4, 0.1, 0.3); break; }
    case 'creak': { const g = gainNode(0, out); const o = osc('sawtooth', 70, t, t + 1.5, filt('bandpass', 400, 6, g)); o.frequency.linearRampToValueAtTime(55, t + 1.4); env(g, t, 0.2, 0.25, 0.9, 0.3); break; }
    case 'crack': { const n = gainNode(0, out); noiseSrc(t, 0.3, filt('lowpass', 3000, 0.6, n)); env(n, t, 0.001, 1, 0.02, 0.2); break; }
    case 'thump': { const g = gainNode(0, out); const o = AUDIO.ctx.createOscillator(); o.frequency.setValueAtTime(80, t); o.frequency.exponentialRampToValueAtTime(30, t + 0.4); o.connect(g); o.start(t); o.stop(t + 1); env(g, t, 0.003, 1.2, 0.05, 0.7); const n = gainNode(0, out); noiseSrc(t, 0.6, filt('lowpass', 600, 0.7, n)); env(n, t, 0.005, 0.8, 0.05, 0.5); break; }
    case 'raven': { for (let i = 0; i < 2; i++) { const g = gainNode(0, out); const o = osc('sawtooth', 520, t + i * 0.28, t + i * 0.28 + 0.25, filt('bandpass', 1300, 3, g)); o.frequency.linearRampToValueAtTime(380, t + i * 0.28 + 0.2); env(g, t + i * 0.28, 0.01, 0.3, 0.08, 0.1); } break; }
    case 'scribble': { for (let i = 0; i < 6; i++) { const n = gainNode(0, out); noiseSrc(t + i * 0.07, 0.06, filt('bandpass', 4200, 4, n)); env(n, t + i * 0.07, 0.005, 0.12, 0.02, 0.03); } break; }
    case 'ringtone': { const notes = [76, 79, 84, 79, 76, 79, 84, 88]; notes.forEach((m, i) => { const g = gainNode(0, out); osc('square', mtof(m), t + i * 0.13, t + i * 0.13 + 0.12, filt('lowpass', 3000, 1, g)); env(g, t + i * 0.13, 0.005, 0.12, 0.08, 0.03); }); break; }
    case 'jingle': { [72, 76, 79, 84, 79, 81, 77, 84].forEach((m, i) => { const g = gainNode(0, out); osc('square', mtof(m), t + i * 0.09, t + i * 0.09 + 0.085, filt('lowpass', 4000, 1, g)); env(g, t + i * 0.09, 0.002, 0.09, 0.05, 0.02); }); break; }
    case 'chime': { INST.bell(t, 84, 0.2, 0.5, out, 2.0); INST.bell(t + 0.09, 79, 0.2, 0.4, out, 2.0); break; }
    case 'systemChime': { const g = gainNode(0, out); osc('sine', 660, t, t + 0.5, g); env(g, t, 0.005, 0.2, 0.1, 0.25); break; }
    case 'reset': { [69, 74, 81].forEach((m, i) => INST.bell(t + i * 0.18, m, 0.5, 0.45, out, 2.0)); break; }
    case 'ding': { INST.bell(t, 91, 0.2, 0.7, out, 2.0); const n = gainNode(0, out); noiseSrc(t + 0.05, 0.4, filt('bandpass', 2500, 2, n)); env(n, t + 0.05, 0.02, 0.1, 0.25, 0.1); break; }
    case 'knock': { [0, 0.42, 0.84].forEach(dt => { const g = gainNode(0, out); const o = AUDIO.ctx.createOscillator(); o.frequency.setValueAtTime(140, t + dt); o.frequency.exponentialRampToValueAtTime(70, t + dt + 0.08); o.connect(g); o.start(t + dt); o.stop(t + dt + 0.3); env(g, t + dt, 0.002, 1.1, 0.01, 0.15); const n = gainNode(0, out); noiseSrc(t + dt, 0.08, filt('bandpass', 900, 1.5, n)); env(n, t + dt, 0.001, 0.8, 0.01, 0.06); }); break; }
    case 'roar': { const g = gainNode(0, out); const ws = AUDIO.ctx.createWaveShaper(); const c = new Float32Array(256); for (let i = 0; i < 256; i++) { const x = i / 128 - 1; c[i] = Math.tanh(x * 4); } ws.curve = c; ws.connect(g); const o = osc('sawtooth', 70 * pr, t, t + 1.4, filt('lowpass', 900, 2, ws)); o.frequency.linearRampToValueAtTime(48, t + 1.2); noiseSrc(t, 1.3, filt('bandpass', 500, 1, ws)); env(g, t, 0.08, 0.8, 0.6, 0.5); break; }
    case 'bellow': { const g = gainNode(0, out); const o = osc('sawtooth', 110, t, t + 1.4, filt('lowpass', 700, 3, g)); o.frequency.linearRampToValueAtTime(70, t + 1.2); env(g, t, 0.1, 0.5, 0.6, 0.4); break; }
    case 'sneeze': { const n = gainNode(0, out); noiseSrc(t + 0.3, 0.35, filt('bandpass', 1400, 0.8, n)); env(n, t + 0.3, 0.005, 1.0, 0.05, 0.25); const g = gainNode(0, out); const o = osc('sawtooth', 200, t, t + 0.3, filt('lowpass', 900, 2, g)); o.frequency.linearRampToValueAtTime(320, t + 0.28); env(g, t, 0.1, 0.25, 0.1, 0.05); break; }
    case 'whine': { const g = gainNode(0, out); const o = osc('sawtooth', 820, t, t + 2.6, filt('bandpass', 1200, 2, g)); o.frequency.exponentialRampToValueAtTime(70, t + 2.4); env(g, t, 0.05, 0.25, 1.8, 0.6); for (let i = 0; i < 12; i++) { const n = gainNode(0, out); noiseSrc(t + Math.random() * 2.4, 0.04, filt('highpass', 2000, 1, n)); env(n, t + i * 0.2, 0.001, 0.3, 0.01, 0.03); } break; }
    case 'cableCall': { const g = gainNode(0, out); sendRev(g, 1); const o1 = osc('sine', 350, t, t + 5, g), o2 = osc('sine', 440, t, t + 5, g); o1.frequency.linearRampToValueAtTime(300, t + 2); o1.frequency.linearRampToValueAtTime(380, t + 4.5); o2.frequency.linearRampToValueAtTime(400, t + 2.2); o2.frequency.linearRampToValueAtTime(470, t + 4.5); env(g, t, 0.8, 0.22, 2.8, 1.2); break; }
    case 'busy': { for (let i = 0; i < 4; i++) { const g = gainNode(0, out); osc('sine', 480, t + i * 0.5, t + i * 0.5 + 0.25, g); osc('sine', 620, t + i * 0.5, t + i * 0.5 + 0.25, g); env(g, t + i * 0.5, 0.01, 0.12, 0.22, 0.02); } break; }
    case 'pickup': { INST.bell(t, 86, 0.08, 0.35, out, 1.0); INST.bell(t + 0.06, 93, 0.1, 0.3, out, 1.0); break; }
    case 'silver': { INST.bell(t, 96, 0.05, 0.2, out, 1.4); break; }
    case 'ui': { const g = gainNode(0, out); osc('triangle', 880, t, t + 0.06, g); env(g, t, 0.002, 0.12, 0.01, 0.04); break; }
    case 'uiBack': { const g = gainNode(0, out); osc('triangle', 520, t, t + 0.08, g); env(g, t, 0.002, 0.12, 0.01, 0.05); break; }
    case 'note': { INST.bell(t, pitch, 0.25, 0.5, out, 2.0); break; } // pitch = midi
    case 'dialtone': { const g = gainNode(0, out); osc('sine', 350, t, t + 0.3, g); osc('sine', 440, t, t + 0.3, g); env(g, t, 0.01, 0.15, 0.2, 0.05); break; }
    case 'explode': { const g = gainNode(0, out); const o = AUDIO.ctx.createOscillator(); o.frequency.setValueAtTime(90, t); o.frequency.exponentialRampToValueAtTime(30, t + 0.6); o.connect(g); o.start(t); o.stop(t + 1.2); env(g, t, 0.003, 1.2, 0.08, 0.8); const n = gainNode(0, out); noiseSrc(t, 1.0, filt('lowpass', 1600, 0.5, n)); env(n, t, 0.002, 1.0, 0.1, 0.7); break; }
    case 'glass': { INST.bell(t, 90 + Math.random() * 8, 0.05, 0.3, out, 5.1); break; }
    case 'heart': { const g = gainNode(0, out); const o = AUDIO.ctx.createOscillator(); o.frequency.setValueAtTime(60, t); o.frequency.exponentialRampToValueAtTime(35, t + 0.1); o.connect(g); o.start(t); o.stop(t + 0.4); env(g, t, 0.005, 0.8, 0.01, 0.12); const g2 = gainNode(0, out); const o2 = AUDIO.ctx.createOscillator(); o2.frequency.setValueAtTime(55, t + 0.18); o2.frequency.exponentialRampToValueAtTime(32, t + 0.28); o2.connect(g2); o2.start(t + 0.18); o2.stop(t + 0.5); env(g2, t + 0.18, 0.005, 0.6, 0.01, 0.12); break; }
    case 'rune': { const g = gainNode(0, out); osc('sine', 120, t, t + 0.3, g); env(g, t, 0.01, 0.3, 0.05, 0.2); INST.bell(t, 70, 0.1, 0.2, out, 7); break; }
    case 'rage': { INST.taiko(t, 1, out, 0.6); INST.brass(t, 38, 0.8, 1, out); INST.brass(t, 50, 0.8, 1, out); break; }
    case 'star': { const g = gainNode(0, out); noiseSrc(t, 0.6, filt('bandpass', 1500, 1, g)); env(g, t, 0.05, 0.2, 0.3, 0.2); break; }
    case 'trophy': { [74, 78, 81, 86].forEach((m, i) => INST.bell(t + i * 0.07, m, 0.2, 0.35, out, 2)); break; }
  }
}
// continuous beds driven by the world
function updateAudio(dt) {
  if (!AUDIO.ok) return;
  const t = AUDIO.ctx.currentTime;
  const indoors = OBJ.house && insideHouse(R.camera.position);
  AUDIO.windGain.gain.setTargetAtTime((indoors ? 0.02 : 0.05 + U.gust.value * 0.12) * (G.title ? 1.4 : 1), t, 0.4);
  AUDIO.windGain.filter.frequency.setTargetAtTime(380 + U.gust.value * 900, t, 0.5);
  AUDIO.low.frequency.setTargetAtTime(AUDIO.lowTarget, t, 0.15);
}

// ---------- character babble (§11.3): syllable-rate synthesised speech that also drives lip flap ----------
function babble(who, text, dur, actor) {
  const v = VOICES[who];
  const syl = [];
  if (!v) return syl;
  const words = text.replace(/\(.*?\)/g, '').split(/\s+/).filter(Boolean);
  const count = Math.max(2, Math.min(Math.round(dur * v.rate * 0.85), Math.round(words.reduce((s, w) => s + Math.max(1, Math.round(w.replace(/[^a-z]/gi, '').length / 3)), 0) * 1.0)));
  const span = Math.min(dur - 0.2, count / v.rate);
  let tt = 0;
  for (let i = 0; i < count; i++) { const d = (span / count) * (0.7 + Math.random() * 0.5); syl.push({ t0: tt, t1: tt + d * 0.82, amp: 0.6 + Math.random() * 0.4 }); tt += d; }
  if (SETTINGS.voiceMode === 'speech' && window.speechSynthesis && who !== 'churned') {
    try { const u = new SpeechSynthesisUtterance(text.replace(/[*_]/g, '')); u.pitch = clamp(v.pitch / 120, 0.1, 2); u.rate = clamp(v.rate / 4.2, 0.6, 1.6); u.volume = SETTINGS.vVoice; speechSynthesis.cancel(); speechSynthesis.speak(u); } catch (e) { }
    return syl;
  }
  if (!AUDIO.ok) return syl;
  const ctx = AUDIO.ctx, t0 = ctx.currentTime + 0.02;
  let out = gainNode(1);
  const pan = ctx.createStereoPanner(); pan.pan.value = actor ? spatial(actor.pos).pan * 0.6 : 0;
  out.connect(pan);
  if (v.phone) { const hp = filt('highpass', 380, 0.7), lp = filt('lowpass', 3000, 0.7); out.disconnect(); out.connect(hp); hp.connect(lp); lp.connect(pan); }
  if (v.low) { const lp = filt('lowpass', 900, 0.7); out.disconnect(); out.connect(lp); lp.connect(pan); sendRev(lp, 0.6); }
  pan.connect(AUDIO.voiceBus); sendRev(pan, v.breathy ? 0.5 : 0.15);
  const VOW = [[730, 1090], [530, 1840], [270, 2290], [570, 840], [300, 870], [660, 1720], [440, 1020]];
  for (let i = 0; i < syl.length; i++) {
    const s = syl[i], st = t0 + s.t0, en = t0 + s.t1;
    const g = gainNode(0, out);
    const vw = VOW[(Math.random() * VOW.length) | 0], fm = v.formant;
    const f1 = filt('bandpass', vw[0] * fm, 5, g), f2 = filt('bandpass', vw[1] * fm, 7, g);
    const mix = gainNode(1); mix.connect(f1); mix.connect(f2);
    const prog = i / Math.max(1, syl.length - 1);
    let p = v.pitch;
    if (v.contour === 'rise' || v.contour === 'up') p *= 1 + prog * (v.contour === 'up' ? 0.3 : 0.12) + Math.sin(i * 1.7) * 0.05;
    else if (v.contour === 'flat') p *= 1 - prog * 0.1 + Math.sin(i * 1.3) * 0.02;
    else if (v.contour === 'lilt') p *= 1 + Math.sin(i * 0.9) * 0.12;
    else if (v.contour === 'punch') p *= 1 + (i % 3 === 0 ? 0.15 : 0);
    else if (v.contour === 'clip') p *= 1 + Math.sin(i * 2.3) * 0.06;
    else if (v.contour === 'shout') p *= 1.2;
    else if (v.contour === 'moan') p *= 1 - prog * 0.25;
    const o = ctx.createOscillator(); o.type = v.wave; o.frequency.setValueAtTime(p * (1 + (Math.random() - 0.5) * 0.08), st); o.frequency.linearRampToValueAtTime(p * (0.95 + Math.random() * 0.1), en);
    o.connect(mix); o.start(st); o.stop(en + 0.1);
    if (v.breathy) noiseSrc(st, en - st + 0.05, filt('bandpass', 2500, 1, gainNode(0.18, mix)));
    if (v.growl) { const ws = ctx.createWaveShaper(); const c = new Float32Array(256); for (let k = 0; k < 256; k++) { const x = k / 128 - 1; c[k] = Math.tanh(x * 6); } ws.curve = c; const o2 = ctx.createOscillator(); o2.type = 'square'; o2.frequency.value = p * 0.5; o2.connect(ws); ws.connect(gainNode(0.4, mix)); o2.start(st); o2.stop(en + 0.1); }
    const pk = 0.55 * s.amp * (v.drive ? 1.2 : 1) * (who === 'hamarr' ? 1.3 : 1);
    g.gain.setValueAtTime(0.0001, st); g.gain.linearRampToValueAtTime(pk, st + 0.025); g.gain.setValueAtTime(pk, en - 0.03); g.gain.exponentialRampToValueAtTime(0.0001, en + 0.04);
  }
  return syl;
}
function sylEnvelope(syl, t) { for (const s of syl) { if (t >= s.t0 && t <= s.t1 + 0.04) { const a = Math.min(1, (t - s.t0) / 0.04), r = Math.min(1, (s.t1 + 0.04 - t) / 0.06); return s.amp * Math.min(a, r); } } return 0; }
// Chase hums Faye's four notes
function humMotif(actor) {
  if (!AUDIO.ok) return 0;
  const t = T0() + 0.05, b = 0.62; let tt = t;
  const out = sfxOut(actor ? actor.pos : null, 1.2);
  for (const n of MOTIF) { INST.hum(tt, n.n, n.d * b * 0.92, 0.9, out); tt += n.d * b; }
  return tt - t;
}
