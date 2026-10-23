/* SOS ONLY — sound and haptics. Everything is synthesised with Web Audio: no audio files.
   Off by default; starts only after a tap. */

const midi = (m) => 440 * Math.pow(2, (m - 69) / 12);

const Sound = {
  ac: null, master: null, beds: {}, on: false, spec: {}, noise: null,

  setEnabled(v) {
    this.on = !!v;
    if (!this.on) { Object.keys(this.beds).forEach((k) => this.stopBed(k)); return; }
    this.unlock();
    this.bed(this.spec);
  },

  // Create/resume the context. Must run inside a user gesture the first time.
  unlock() {
    if (!this.ac) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      this.ac = new AC();
      this.master = this.ac.createGain();
      this.master.gain.value = 0.75;
      this.master.connect(this.ac.destination);
      const len = this.ac.sampleRate * 2;
      this.noise = this.ac.createBuffer(1, len, this.ac.sampleRate);
      const d = this.noise.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    }
    if (this.ac.state === 'suspended') this.ac.resume();
  },

  suspend(h) {
    if (!this.ac) return;
    if (h) this.ac.suspend(); else if (this.on) this.ac.resume();
  },

  now() { return this.ac.currentTime; },

  gain(v, to) { const g = this.ac.createGain(); g.gain.value = v; if (to) g.connect(to); return g; },

  osc(type, f, to) { const o = this.ac.createOscillator(); o.type = type; o.frequency.value = f; if (to) o.connect(to); return o; },

  noiseSrc(to) { const s = this.ac.createBufferSource(); s.buffer = this.noise; s.loop = true; if (to) s.connect(to); return s; },

  filt(type, f, q, to) { const b = this.ac.createBiquadFilter(); b.type = type; b.frequency.value = f; if (q) b.Q.value = q; if (to) b.connect(to); return b; },

  // telephone band: 300–3,400 Hz, so the music always sounds like hold music
  phoneBand(to) { const lo = this.filt('lowpass', 3400, 0.7, to); return this.filt('highpass', 300, 0.7, lo); },

  env(g, t, a, peak, d) {
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + a);
    g.gain.exponentialRampToValueAtTime(0.0001, t + a + d);
  },

  tone(f, t, dur, o = {}) {
    const g = this.gain(0.0001, o.to || this.master);
    const s = this.osc(o.type || 'sine', f, g);
    this.env(g, t, o.a || 0.01, o.v || 0.2, dur);
    s.start(t); s.stop(t + (o.a || 0.01) + dur + 0.05);
    return s;
  },

  /* ---- beds: long-running ambiences, crossfaded on and off ---- */

  bed(spec) {
    this.spec = spec || {};
    if (!this.on || !this.ac) return;
    for (const k of ['hum', 'rain', 'hold', 'store', 'birds', 'waves', 'voice']) {
      if (this.spec[k] && !this.beds[k]) this.startBed(k);
      if (!this.spec[k] && this.beds[k]) this.stopBed(k);
    }
  },

  startBed(k) {
    const out = this.gain(0.0001, this.master), t = this.now();
    const vol = { hum: 0.05, rain: 0.16, hold: 0.22, store: 0.16, birds: 0.12, waves: 0.18, voice: 1 }[k];
    out.gain.exponentialRampToValueAtTime(vol, t + 0.8);
    const bed = { out, nodes: [], timer: 0 };
    if (k === 'hum') {
      [[50, 1], [100, 0.5], [150, 0.18]].forEach(([f, v]) => { const g = this.gain(v, out); const o = this.osc('sine', f, g); o.start(); bed.nodes.push(o); });
    } else if (k === 'rain') {
      const hp = this.filt('highpass', 400, 0.5, out), lp = this.filt('lowpass', 2600, 0.5, hp);
      const s = this.noiseSrc(lp); s.start(); bed.nodes.push(s);
    } else if (k === 'waves') {
      const lp = this.filt('lowpass', 500, 0.6, out);
      const g = this.gain(0.5, lp), s = this.noiseSrc(g);
      const lfo = this.osc('sine', 0.12), lg = this.gain(0.45); lfo.connect(lg); lg.connect(g.gain);
      s.start(); lfo.start(); bed.nodes.push(s, lfo);
    } else if (k === 'birds') {
      const chirp = () => {
        const t0 = this.now() + 0.05, n2 = 2 + Math.floor(Math.random() * 3), base = 2400 + Math.random() * 1600;
        for (let i = 0; i < n2; i++) {
          const g = this.gain(0.0001, out), o = this.osc('sine', base, g), tt = t0 + i * 0.12;
          o.frequency.setValueAtTime(base, tt); o.frequency.exponentialRampToValueAtTime(base * 1.5, tt + 0.07);
          this.env(g, tt, 0.01, 0.5, 0.08); o.start(tt); o.stop(tt + 0.12);
        }
        bed.timer = setTimeout(chirp, 700 + Math.random() * 2200);
      };
      chirp();
    } else if (k === 'hold') this.holdMusic(bed, this.phoneBand(out));
    else if (k === 'store') this.storeRiff(bed, out);
    else if (k === 'voice') this.choppedVoice(bed);
    this.beds[k] = bed;
  },

  stopBed(k, fast) {
    const b = this.beds[k];
    if (!b) return;
    delete this.beds[k];
    clearTimeout(b.timer); clearInterval(b.timer);
    if (b.stop) b.stop();
    const t = this.now();
    b.out.gain.cancelScheduledValues(t);
    b.out.gain.setValueAtTime(b.out.gain.value, t);
    b.out.gain.exponentialRampToValueAtTime(0.0001, t + (fast ? 0.03 : 0.6));
    setTimeout(() => { b.nodes.forEach((x) => { try { x.stop(); } catch (e) { /* already stopped */ } }); b.out.disconnect(); }, fast ? 100 : 800);
  },

  // Chase's track: an original eight-bar minor loop.
  holdMusic(bed, out) {
    const bpm = 86, beat = 60 / bpm;
    const chords = [[57, 60, 64], [57, 60, 64], [53, 57, 60], [53, 57, 60], [52, 55, 60], [55, 59, 62], [50, 53, 57], [52, 56, 59]];
    const mel = [69, 72, 76, 74, 72, 71, 69, 64, 65, 69, 72, 69, 65, 64, 65, 69, 67, 72, 76, 72, 74, 71, 67, 71, 69, 65, 62, 65, 64, 68, 71, 76];
    let step = 0, next = this.now() + 0.1;
    const sched = () => {
      while (next < this.now() + 0.3) {
        const bar = Math.floor(step / 8) % 8, e = step % 8, ch = chords[bar];
        // arpeggio in eighths
        this.tone(midi(ch[e % 3] + 12), next, beat * 0.45, { type: 'square', v: 0.05, to: out });
        // bass on 1 and 3
        if (e === 0 || e === 4) this.tone(midi(ch[0] - 12), next, beat * 1.6, { type: 'triangle', v: 0.22, to: out });
        // melody on the beat
        if (e % 2 === 0) this.tone(midi(mel[(bar * 4 + e / 2) % mel.length]), next, beat * 0.9, { type: 'triangle', v: 0.16, a: 0.02, to: out });
        next += beat / 2;
        step++;
      }
    };
    sched();
    bed.timer = setInterval(sched, 60);
  },

  // A generic synthesised rock riff for the in-store music. Never a real recording.
  storeRiff(bed, out) {
    const bpm = 124, e8 = 60 / bpm / 2;
    const shaper = this.ac.createWaveShaper();
    const curve = new Float32Array(512);
    for (let i = 0; i < 512; i++) { const x = i / 256 - 1; curve[i] = Math.tanh(x * 4); }
    shaper.curve = curve; shaper.connect(out);
    const riff = [40, 40, 43, 40, 45, 40, 43, 38];
    let step = 0, next = this.now() + 0.05;
    const sched = () => {
      while (next < this.now() + 0.3) {
        const r = riff[step % 8];
        [0, 7, 12].forEach((iv) => this.tone(midi(r + iv), next, e8 * 0.8, { type: 'sawtooth', v: 0.08, to: shaper }));
        if (step % 4 === 0) this.kick(next, out);
        if (step % 4 === 2) this.snare(next, out);
        next += e8; step++;
      }
    };
    sched();
    bed.timer = setInterval(sched, 60);
  },

  kick(t, out) {
    const g = this.gain(0.0001, out), o = this.osc('sine', 120, g);
    o.frequency.setValueAtTime(120, t); o.frequency.exponentialRampToValueAtTime(45, t + 0.15);
    this.env(g, t, 0.005, 0.9, 0.2); o.start(t); o.stop(t + 0.3);
  },

  snare(t, out) {
    const g = this.gain(0.0001, out), f = this.filt('bandpass', 1800, 0.8, g), s = this.noiseSrc(f);
    this.env(g, t, 0.003, 0.5, 0.14); s.start(t); s.stop(t + 0.2);
  },

  // Chase's voice, chopped like a sample. Speech synthesis where it exists; silently skipped otherwise.
  choppedVoice(bed) {
    if (!('speechSynthesis' in window)) return;
    const parts = ['Thank', 'thank you for', 'for hol', 'holding.'];
    let i = 0;
    const say = () => {
      const u = new SpeechSynthesisUtterance(parts[i++ % parts.length]);
      u.rate = 0.85; u.pitch = 0.6; u.volume = 0.5;
      speechSynthesis.speak(u);
      bed.timer = setTimeout(say, i % parts.length === 0 ? 5200 : 700);
    };
    bed.timer = setTimeout(say, 1200);
    bed.stop = () => { try { speechSynthesis.cancel(); } catch (e) { /* ignore */ } };
  },

  /* ---- one-shot effects ---- */

  sfx(name, o = {}) {
    if (!this.on || !this.ac) return;
    const t = this.now() + (o.delay || 0);
    let out = this.master;
    if (o.pan && this.ac.createStereoPanner) { const p = this.ac.createStereoPanner(); p.pan.value = o.pan; p.connect(this.master); out = p; }
    const v = o.v || 1;
    switch (name) {
      case 'beep': this.tone(2600, t, 0.07, { type: 'square', v: 0.08 * v, to: out }); break;
      case 'bigbeep': this.tone(2400, t, 0.5, { type: 'square', v: 0.07 * v, to: out }); this.tone(1200, t, 0.6, { type: 'sine', v: 0.08 * v, to: out }); break;
      case 'chime': // the queue chime: two descending tones — the Hold's motif
        [[659.3, 0], [523.3, 0.55]].forEach(([f, dt]) => { this.tone(f, t + dt, 1.1, { v: 0.22 * v, to: out }); this.tone(f * 2, t + dt, 0.6, { v: 0.05 * v, to: out }); });
        break;
      case 'ring': {
        const g = this.gain(0.0001, out);
        const a = this.osc('sine', 400, g), b = this.osc('sine', 450, g);
        const am = this.gain(0.5); const lfo = this.osc('square', 25); lfo.connect(am); am.connect(g.gain);
        [[0, 0.4], [0.6, 1.0]].forEach(([s0, s1]) => { g.gain.setValueAtTime(0.0001, t + s0); g.gain.linearRampToValueAtTime(0.09 * v, t + s0 + 0.02); g.gain.setValueAtTime(0.09 * v, t + s1 - 0.02); g.gain.linearRampToValueAtTime(0.0001, t + s1); });
        [a, b, lfo].forEach((x) => { x.start(t); x.stop(t + 1.1); });
        break;
      }
      case 'chorus': // every demo phone at once
        for (let i = 0; i < 6; i++) this.sfx('ring', { delay: (o.delay || 0) + i * 0.13, pan: (i / 5) * 2 - 1, v: 0.6 });
        break;
      case 'dial': {
        const g = this.gain(0.0001, out), a = this.osc('sine', 425, g);
        g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.08 * v, t + 0.05); g.gain.setValueAtTime(0.08 * v, t + (o.dur || 2)); g.gain.linearRampToValueAtTime(0.0001, t + (o.dur || 2) + 0.1);
        a.start(t); a.stop(t + (o.dur || 2) + 0.2);
        break;
      }
      case 'thump': {
        const g = this.gain(0.0001, out), s = this.osc('sine', 90, g);
        s.frequency.setValueAtTime(90, t); s.frequency.exponentialRampToValueAtTime(38, t + 0.2);
        this.env(g, t, 0.005, 0.8 * v, 0.28); s.start(t); s.stop(t + 0.4);
        break;
      }
      case 'heartbeat': this.sfx('thump', { delay: o.delay, v: 0.7 }); this.sfx('thump', { delay: (o.delay || 0) + 0.22, v: 0.5 }); break;
      case 'shred': case 'door': case 'static': case 'print': {
        const dur = { shred: 0.9, door: 1.6, static: 0.35, print: 0.8 }[name];
        const g = this.gain(0.0001, out), f = this.filt('bandpass', name === 'door' ? 500 : name === 'print' ? 3000 : 1400, 0.9, g), s = this.noiseSrc(f);
        const am = this.gain(0.5), lfo = this.osc('square', name === 'door' ? 14 : name === 'print' ? 30 : 60); lfo.connect(am); am.connect(g.gain);
        g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.18 * v, t + 0.03); g.gain.setValueAtTime(0.18 * v, t + dur - 0.1); g.gain.linearRampToValueAtTime(0.0001, t + dur);
        s.start(t); lfo.start(t); s.stop(t + dur + 0.05); lfo.stop(t + dur + 0.05);
        break;
      }
      case 'bell': [[2093, 0.22], [4186, 0.06], [5588, 0.03]].forEach(([f, vv]) => this.tone(f, t, 1.4, { v: vv * v, to: out })); break;
      case 'stutter': for (let i = 0; i < 6; i++) this.tone(300 + Math.random() * 600, t + i * 0.07, 0.04, { type: 'square', v: 0.06 * v, to: out }); break;
      case 'note': this.tone(midi(o.m || 69), t, 0.5, { type: 'triangle', v: 0.12 * v, to: this.phoneBand(out) }); break;
    }
  },

  // Sudden total silence: the silence is the scare.
  silence(ms) {
    if (!this.ac) return;
    const t = this.now(), g = this.master.gain;
    g.cancelScheduledValues(t); g.setValueAtTime(0.0001, t);
    g.setValueAtTime(0.0001, t + ms / 1000); g.linearRampToValueAtTime(0.75, t + ms / 1000 + 0.05);
  },

  cut(k) { this.stopBed(k, true); if (this.spec) this.spec = Object.assign({}, this.spec, { [k]: false }); },
};

/* ---------- haptics (Android; silently nothing elsewhere) ---------- */

const HAPTIC = {
  ring: [320, 180, 320], heartbeat: [70, 140, 100], thump: [90, 120, 90], stutter: [30, 40, 30, 40, 30, 40, 30],
  bell: [28], tap: [18],
};
function haptic(name) {
  if (!navigator.vibrate || (navigator.userActivation && !navigator.userActivation.hasBeenActive)) return;
  if (!Save.d.settings.sound && reducedMotion()) return;
  try { navigator.vibrate(HAPTIC[name] || 20); } catch (e) { /* ignore */ }
}
