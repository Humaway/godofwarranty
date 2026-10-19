/* =====================================================================
   GOD OF WARRANTY — Part One: The Ward Falls
   One HTML file. PS2 bones, modern lens. One unbroken camera take.
   ===================================================================== */
// ================= CONFIG =================
import * as THREE from 'three';

const DEBUG = /[?&]debug=1/.test(location.search);
const URLQ = new URLSearchParams(location.search);
// HAS_TOUCH: a touch screen exists (touch laptops included). IS_TOUCH: touch is the main input (phones, tablets).
// Touch is assumed only when there is no mouse or trackpad at all, or on a mobile browser whose primary pointer is a finger
// (stylus phones report a fine pointer too). Everything else starts on mouse; touching the screen switches to touch controls.
const HAS_TOUCH = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
const mediaQ = q => !!(window.matchMedia && window.matchMedia(q).matches);
const MOBILE_UA = navigator.userAgentData ? !!navigator.userAgentData.mobile : /Android|iPhone|iPod|Mobile/i.test(navigator.userAgent);
const IS_TOUCH = HAS_TOUCH && (!mediaQ('(any-pointer: fine)') || (MOBILE_UA && mediaQ('(pointer: coarse)')));
const HUB_URL = '../index.html';

const QUALITY = {
  mobile:   { label: 'Mobile',   res: 0.55, dynRes: true,  dofTaps: 16, shadow: 1024, shadows: true,  snow: 4000,  msaa: 0, bloom: 4, motionBlur: 0, pixelRatioCap: 1.0 },
  balanced: { label: 'Balanced', res: 0.75, dynRes: true,  dofTaps: 32, shadow: 1024, shadows: true,  snow: 8000,  msaa: 0, bloom: 5, motionBlur: 1, pixelRatioCap: 1.5 },
  high:     { label: 'High',     res: 1.0,  dynRes: true,  dofTaps: 40, shadow: 2048, shadows: true,  snow: 10000, msaa: 4, bloom: 5, motionBlur: 2, pixelRatioCap: 1.75 },
  ultra:    { label: 'Ultra',    res: 1.0,  dynRes: false, dofTaps: 48, shadow: 4096, shadows: true,  snow: 12000, msaa: 4, bloom: 5, motionBlur: 2, pixelRatioCap: 2.0 },
};

const DIFFICULTY = {
  story:    { label: 'Give Me a Story',          dmg: 0.5, hp: 0.7,  parry: 0.220, tokens: 1, perks: false, autoParry: true },
  plan:     { label: 'Give Me a Plan',           dmg: 1.0, hp: 1.0,  parry: 0.150, tokens: 2, perks: false },
  contract: { label: 'Give Me a Contract',       dmg: 1.4, hp: 1.25, parry: 0.110, tokens: 3, perks: false, aggressive: true },
  gow:      { label: 'Give Me God of Warranty',  dmg: 2.0, hp: 1.5,  parry: 0.083, tokens: 3, perks: true,  aggressive: true },
};

const F = 1 / 60; // one frame of the 60 fps frame data, in seconds

// Luka's moveset (§7.3). Times in frames.
const MOVES = {
  L1: { s: 8,  a: 4, r: 14, dmg: 10, stun: 6,  range: 2.5, arc: 70,  react: 'flinch',   trauma: 0.08, stop: 50,  anim: 'chopL' },
  L2: { s: 7,  a: 4, r: 14, dmg: 10, stun: 6,  range: 2.5, arc: 70,  react: 'flinch',   trauma: 0.08, stop: 50,  anim: 'backhand' },
  L3: { s: 9,  a: 5, r: 16, dmg: 12, stun: 8,  range: 2.6, arc: 75,  react: 'flinch',   trauma: 0.1,  stop: 60,  anim: 'rising' },
  L4: { s: 14, a: 6, r: 24, dmg: 20, stun: 14, range: 2.7, arc: 60,  react: 'knockback', kb: 2, trauma: 0.18, stop: 90, anim: 'overhead' },
  H1: { s: 18, a: 6, r: 24, dmg: 25, stun: 15, range: 2.8, arc: 110, react: 'stagger',  trauma: 0.18, stop: 90,  anim: 'wide' },
  H2: { s: 26, a: 8, r: 30, dmg: 40, dmgC: 60, stun: 25, range: 2.9, arc: 80, react: 'launch', trauma: 0.3, stop: 120, anim: 'heavyOver', charge: 36 },
  UPSELL: { s: 16, a: 8, r: 28, dmg: 30, stun: 20, range: 3.0, arc: 270, react: 'stagger', trauma: 0.2, stop: 90, anim: 'sweep' },
  BARGE: { s: 6, a: 10, r: 22, dmg: 15, stun: 20, range: 2.0, arc: 60, react: 'knockdown', trauma: 0.2, stop: 80, anim: 'barge' },
  FL: { s: 6,  a: 3, r: 10, dmg: 4,  stun: 14, range: 1.7, arc: 60, react: 'flinch',  trauma: 0.06, stop: 45, anim: 'jab', fists: true },
  FL2:{ s: 6,  a: 3, r: 10, dmg: 4,  stun: 14, range: 1.7, arc: 60, react: 'flinch',  trauma: 0.06, stop: 45, anim: 'cross', fists: true },
  FH: { s: 12, a: 4, r: 18, dmg: 8,  stun: 25, range: 1.8, arc: 70, react: 'stagger', trauma: 0.12, stop: 70, anim: 'uppercut', fists: true },
  BASH: { s: 10, a: 4, r: 18, dmg: 6, stun: 18, range: 2.0, arc: 70, react: 'stagger', trauma: 0.14, stop: 80, anim: 'bash', bash: true },
  QUOTA: { s: 16, a: 6, r: 26, dmg: 30, stun: 30, range: 4.5, arc: 360, react: 'knockdown', trauma: 0.4, stop: 110, anim: 'slam', fists: true },
};

const AXE = { throwSpeed: 45, maxDist: 40, throwDmg: 18, throwFrost: 50, returnSpeed: 55, returnDmg: 12, windup: 10 * F, catchCombo: 10 * F };

const ENEMY = {
  churned: { hp: 60,  stunCap: 50, speed: 1.55, radius: 0.45, silver: 15, xp: 20 },
  brute:   { hp: 160, stunCap: 90, speed: 1.25, radius: 0.7,  silver: 60, xp: 60 },
  holdmusic:{ hp: 40, stunCap: 40, speed: 2.0,  radius: 0.6,  silver: 20, xp: 25 },
  reviewer:{ hp: 45,  stunCap: 45, speed: 2.4,  radius: 0.45, silver: 30, xp: 35 },
  hamarr:  { hp: 2000, stunCap: 300, radius: 2.2, silver: 600, xp: 500 },
};

const SPEAKERS = {
  luka:   { name: 'LUKA',   color: 'var(--c-luka)',   role: '2IC' },
  chase:  { name: 'CHASE',  color: 'var(--c-chase)',  role: 'Casual' },
  rue:    { name: 'RUE',    color: 'var(--c-rue)',    role: 'CEO (Currently on a Call)' },
  luke:   { name: 'LUKE',   color: 'var(--c-luke)',   role: 'Repair Smith' },
  zane:   { name: 'ZANE',   color: 'var(--c-zane)',   role: 'Repair Smith (Not His Brother)' },
  zee:    { name: 'ZEE',    color: 'var(--c-zee)',    role: '???' },
  jarrad: { name: 'JARRAD', color: 'var(--c-jarrad)', role: 'Here to Help!' },
  hamarr: { name: 'HAMARR', color: 'var(--c-hamarr)', role: 'Troll of the Comment Section' },
  churned:{ name: 'CHURNED', color: 'var(--c-churned)' },
  sys:    { name: '', color: 'var(--c-sys)' },
};

// Voice babble recipes (§11.3)
const VOICES = {
  luka:   { pitch: 85,  rate: 3.2, contour: 'flat',   wave: 'sawtooth', formant: 1.0, dry: true },
  chase:  { pitch: 130, rate: 5.0, contour: 'rise',   wave: 'sawtooth', formant: 1.12 },
  rue:    { pitch: 115, rate: 4.0, contour: 'lilt',   wave: 'sawtooth', formant: 1.05, phone: true },
  luke:   { pitch: 95,  rate: 4.5, contour: 'punch',  wave: 'square',   formant: 0.98, drive: true },
  zane:   { pitch: 145, rate: 5.2, contour: 'clip',   wave: 'sawtooth', formant: 1.15 },
  zee:    { pitch: 205, rate: 3.6, contour: 'soft',   wave: 'triangle', formant: 1.3, breathy: true },
  jarrad: { pitch: 125, rate: 5.5, contour: 'up',     wave: 'sawtooth', formant: 1.1, bright: true },
  hamarr: { pitch: 55,  rate: 2.5, contour: 'shout',  wave: 'sawtooth', formant: 0.7, growl: true },
  churned:{ pitch: 85,  rate: 2.0, contour: 'moan',   wave: 'triangle', formant: 0.85, low: true },
  sys:    null,
};

// Faye's Theme: D – F – A – G (half, quarter, quarter, whole)
const MOTIF = [ { n: 62, d: 2 }, { n: 65, d: 1 }, { n: 69, d: 1 }, { n: 67, d: 4 } ];

const DEFAULT_SETTINGS = {
  difficulty: 'plan', quality: IS_TOUCH ? 'mobile' : 'balanced', resScale: 1.0,
  sens: 1.0, invertX: false, invertY: false, fovOffset: 0, shake: 1.0, handheld: 1.0,
  dof: true, grain: true, ca: true, motionBlur: true, bloom: true, filtering: 'crisp', retro480: false, wobble: false,
  gore: 'full', nameCards: true,
  subs: true, subSize: 'M', subBox: false, subNames: true,
  vMaster: 0.9, vMusic: 0.7, vSfx: 0.85, vVoice: 0.9, voiceMode: 'babble',
  aimHold: true, shieldHold: true, aimAssist: 1.0, autoSprint: false,
  cbPalette: 'default', slowTells: false, skipFinishers: false, hud: 'full', lockOn: true,
};

const CHECKPOINTS = ['title', 'grove', 'carry', 'pyre_start', 'pyre_embers', 'ward_falls', 'kiosk', 'zee', 'path', 'queue', 'hamarr', 'walk_home', 'knock', 'end'];
const CHECKPOINT_LABELS = {
  grove: 'The Marked Tree', carry: 'The Carry', pyre_start: 'Wi-Faye', pyre_embers: 'The Embers', ward_falls: 'The Ward Falls',
  kiosk: 'The Kiosk', zee: 'The Wombat', path: 'The Cliff Path', queue: 'The Queue', hamarr: 'Dodgy Hamarr', walk_home: 'Not Ready', knock: 'The Knock',
};
