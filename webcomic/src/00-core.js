/* SOS ONLY — core: helpers, palette, seeded randomness, saved state, settings. */

const NS = 'http://www.w3.org/2000/svg';
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const D2R = Math.PI / 180;
// Round to one decimal so generated SVG stays small.
const n = (v) => Math.round(v * 10) / 10;
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const pad2 = (v) => String(v).padStart(2, '0');

// Palette. Mirrors the CSS custom properties in style.css.
const C = {
  ink: '#0E0E10', paper: '#F2ECDD', y: '#FFCD00', night: '#1B2A3A', sodium: '#E07B2E',
  screen: '#9FE6FF', laser: '#D7263D', white: '#FFFFFF',
  grey: '#7A7A76', dgrey: '#36363A', mgrey: '#56565B', lgrey: '#BDBAB0', gutterGrey: '#4A4A4D',
  navy: '#14283F', navy2: '#0D1B2B', wall: '#2B3440', floor: '#1F262E',
  rot: '#A8952C', rot2: '#6B5A1E', rot3: '#D4C24A',
  dawn1: '#F6B6A6', dawn2: '#FFD58A', sea: '#0F2233', bay: '#16303F',
  card: '#B89A6A', water: '#1C2A2E',
};

/* ---------- seeded randomness (so every load draws identically) ---------- */

function hashStr(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619);
  return h >>> 0;
}

function rng(seed) {
  let a = typeof seed === 'string' ? hashStr(seed) : seed >>> 0;
  const r = () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  r.range = (lo, hi) => lo + r() * (hi - lo);
  r.int = (lo, hi) => Math.floor(lo + r() * (hi - lo + 1));
  r.pick = (arr) => arr[Math.floor(r() * arr.length)];
  r.jit = (v) => (r() * 2 - 1) * v;
  return r;
}

// Unique-per-render ids for clip paths and gradients. Reset before each page render.
let _uid = 0, _uidPrefix = '';
const uid = (p = 'u') => `${_uidPrefix}${p}${++_uid}`;

/* ---------- saved data: device only, one key ---------- */

const SAVE_KEY = 'sosonly.v1';
const Save = {
  d: null,
  fresh() {
    return {
      name: '', ticket: 7, visits: 0, checkedIn: false, finished: false,
      pagesSeen: [], olliesFound: [], jarradSales: 287, call1Start: null,
      firstOpened: Date.now(), lastLeftAt: null, readStart: null,
      settings: { sound: false, motion: 'auto', tilt: false, mode: 'auto', transcript: false },
    };
  },
  load() {
    let d = null;
    try { d = JSON.parse(localStorage.getItem(SAVE_KEY) || 'null'); } catch (e) { d = null; }
    const f = this.fresh();
    this.d = d && typeof d === 'object' ? Object.assign(f, d, { settings: Object.assign(f.settings, d.settings || {}) }) : f;
    return this.d;
  },
  write() {
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(this.d)); } catch (e) { /* private browsing: carry on without saving */ }
  },
  reset() {
    try { localStorage.removeItem(SAVE_KEY); } catch (e) { /* ignore */ }
    this.d = this.fresh();
  },
};
Save.load();

// The reader's check-in name, or YOU.
const NAME = () => (Save.d.name || '').trim().toUpperCase().slice(0, 16) || 'YOU';
const hasName = () => !!(Save.d.name || '').trim();

const reducedMotion = () => {
  const m = Save.d.settings.motion;
  if (m === 'on') return false;
  if (m === 'off') return true;
  return !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
};

const fmtClock = (d = new Date()) => {
  let h = d.getHours();
  const ap = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${pad2(d.getMinutes())} ${ap}`;
};

const fmtDur = (ms, withDays) => {
  const s = Math.max(0, Math.floor(ms / 1000));
  const d = Math.floor(s / 86400), h = Math.floor((s % 86400) / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
  const hms = `${pad2(h)}:${pad2(m)}:${pad2(sec)}`;
  return withDays || d ? `${d}d ${hms}` : hms;
};

const YEAR_MS = 365 * 86400 * 1000;

// Page registry: page files call page(n, {...}); the reader mounts them.
const PAGES = [];
function page(num, def) { PAGES[num] = Object.assign({ num, id: 'p' + pad2(num) }, def); }
