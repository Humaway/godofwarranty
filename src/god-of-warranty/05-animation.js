// ================= ANIMATION =================
// Code-authored poses (per-bone Euler, degrees in source), procedural locomotion, keyed clips, look-at, verlet secondary motion.
// Conventions: actors face +z, their LEFT is +x. Hanging limbs: x<0 swings forward, x>0 back. Upward bones: x>0 bends forward, y>0 turns left.

const BONES = ['hips', 'spine', 'chest', 'neck', 'head', 'shL', 'armL', 'foreL', 'handL', 'shR', 'armR', 'foreR', 'handR', 'thighL', 'shinL', 'footL', 'thighR', 'shinR', 'footR'];
const MASKS = {
  full: null,
  upper: new Set(['spine', 'chest', 'neck', 'head', 'shL', 'armL', 'foreL', 'handL', 'shR', 'armR', 'foreR', 'handR']),
  arms: new Set(['shL', 'armL', 'foreL', 'handL', 'shR', 'armR', 'foreR', 'handR']),
  armR: new Set(['shR', 'armR', 'foreR', 'handR']),
  armL: new Set(['shL', 'armL', 'foreL', 'handL']),
  head: new Set(['neck', 'head']),
};
const D2R = DEG;
function P(o) { const out = {}; for (const k in o) out[k] = k === 'root' ? o[k].slice() : o[k].map(v => v * D2R); return out; }
function mirror(p) { const o = {}; for (const k in p) { let n = k; if (k.endsWith('L')) n = k.slice(0, -1) + 'R'; else if (k.endsWith('R')) n = k.slice(0, -1) + 'L'; const v = p[k]; o[n] = k === 'root' ? v.slice() : [v[0], -v[1], -v[2]]; } return o; }

const POSES = {
  rest: P({ armL: [0, 0, 6], armR: [0, 0, -6], foreL: [-8, 0, 0], foreR: [-8, 0, 0] }),
  combatIdle: P({ root: [-0.06, 0], spine: [8, -10, 0], chest: [6, -8, 0], head: [-8, 14, 0], armR: [-25, 0, -18], foreR: [-55, 0, 0], handR: [10, 0, 0], armL: [-30, 0, 22], foreL: [-80, 0, 0], thighL: [-14, 0, 6], shinL: [18, 0, 0], thighR: [10, 0, -6], shinR: [14, 0, 0], footL: [-4, 0, 0] }),
  fistsIdle: P({ root: [-0.06, 0], spine: [8, -10, 0], chest: [6, -8, 0], head: [-8, 14, 0], armR: [-35, 0, -20], foreR: [-110, 0, 0], armL: [-45, 0, 20], foreL: [-115, 0, 0], thighL: [-14, 0, 6], shinL: [18, 0, 0], thighR: [10, 0, -6], shinR: [14, 0, 0] }),
  shield: P({ root: [-0.08, 0], spine: [10, -6, 0], chest: [8, -4, 0], armL: [-75, -10, 30], foreL: [-75, -60, 0], handL: [0, 0, 0], armR: [-20, 0, -20], foreR: [-50, 0, 0], thighL: [-16, 0, 6], shinL: [22, 0, 0], thighR: [12, 0, -6], shinR: [18, 0, 0] }),
  aim: P({ spine: [6, -12, 0], chest: [4, -14, 0], head: [-4, 22, 0], armR: [-170, 0, -10], foreR: [-40, 0, 0], handR: [-20, 0, 0], armL: [-80, 30, 10], foreL: [-30, 0, 0] }),
  aimUnarmed: P({ spine: [6, -12, 0], chest: [4, -14, 0], head: [-4, 22, 0], armL: [-85, 10, 10], foreL: [-20, 0, 0], handL: [0, 0, 0], armR: [-30, 0, -20], foreR: [-90, 0, 0] }),
  carryLog: P({ root: [-0.04, 0], spine: [12, 0, 0], armL: [-65, 0, 10], foreL: [-40, 0, 0], armR: [-65, 0, -10], foreR: [-40, 0, 0] }),
  carryShoulder: P({ chest: [6, 0, -4], armR: [-150, 0, -30], foreR: [-110, 0, 0], armL: [-20, 0, 10], foreL: [-30, 0, 0] }),
  carryBody: P({ root: [-0.03, 0], spine: [-6, 0, 0], chest: [-4, 0, 0], armL: [-55, 0, 18], foreL: [-60, 30, 0], armR: [-55, 0, -18], foreR: [-60, -30, 0], head: [10, 0, 0] }),
  sit: P({ root: [-0.47, -0.05], spine: [14, 0, 0], thighL: [-88, 0, 8], thighR: [-88, 0, -8], shinL: [95, 0, 0], shinR: [95, 0, 0], armL: [-40, 0, 12], foreL: [-80, 30, 0], armR: [-40, 0, -12], foreR: [-80, -30, 0], head: [12, 0, 0] }),
  sitHug: P({ root: [-0.47, -0.05], spine: [24, 0, 0], chest: [10, 0, 0], thighL: [-110, 0, 6], thighR: [-110, 0, -6], shinL: [130, 0, 0], shinR: [130, 0, 0], armL: [-70, 0, -10], foreL: [-70, 40, 0], armR: [-70, 0, 10], foreR: [-70, -40, 0], head: [8, 0, 0] }),
  kneel: P({ root: [-0.42, 0], spine: [22, 0, 0], chest: [10, 0, 0], thighL: [-90, 0, 6], shinL: [90, 0, 0], footL: [0, 0, 0], thighR: [10, 0, -4], shinR: [100, 0, 0], footR: [40, 0, 0], armL: [-45, 0, 8], foreL: [-30, 0, 0], armR: [-50, 0, -8], foreR: [-40, 0, 0], head: [20, 0, 0] }),
  crouch: P({ root: [-0.5, 0], spine: [35, 0, 0], thighL: [-100, 0, 10], thighR: [-100, 0, -10], shinL: [120, 0, 0], shinR: [120, 0, 0], footL: [-15, 0, 0], footR: [-15, 0, 0], armL: [-30, 0, 15], foreL: [-60, 0, 0], armR: [-30, 0, -15], foreR: [-60, 0, 0], head: [-20, 0, 0] }),
  prone: P({ root: [-0.85, 0], spine: [-5, 0, 0], head: [-60, 0, 0], armL: [-150, 0, 20], foreL: [-60, 0, 0], armR: [-150, 0, -20], foreR: [-60, 0, 0] }),
  bowReady: P({ spine: [4, 20, 0], chest: [2, 18, 0], head: [0, -26, 0], armL: [-85, 0, 8], foreL: [-6, 0, 0], handL: [0, 0, 0], armR: [-80, 0, -30], foreR: [-130, 0, 0] }),
  bowCarry: P({ armL: [-18, 0, 10], foreL: [-30, 0, 0] }),
  handsInPockets: P({ armL: [8, 0, 12], foreL: [-30, 0, 0], armR: [8, 0, -12], foreR: [-30, 0, 0] }),
  armsCrossed: P({ armL: [-20, 0, 18], foreL: [-100, -60, 0], armR: [-20, 0, -18], foreR: [-100, 60, 0] }),
  holdStaff: P({ armR: [-22, 0, -14], foreR: [-50, 0, 0] }),
  holdBall: P({ armL: [-10, 0, 14], foreL: [-80, 30, 0] }),
  holdBox: P({ armL: [-20, 0, 14], foreL: [-90, 30, 0], handL: [0, 0, 0] }),
  holdTablet: P({ armL: [-40, 0, 10], foreL: [-70, 20, 0], armR: [-35, 0, -14], foreR: [-80, -25, 0] }),
  frozen: P({ spine: [10, 0, 0], armL: [-60, 0, 30], foreL: [-40, 0, 0], armR: [-70, 0, -25], foreR: [-50, 0, 0], head: [-10, 0, 0] }),
  churnIdle: P({ spine: [16, 0, 4], chest: [10, 0, 0], head: [16, 0, -10], armL: [-10, 0, 8], foreL: [-20, 0, 0], armR: [-6, 0, -4], foreR: [-30, 0, 0], thighL: [-4, 0, 0], shinL: [8, 0, 0] }),
  stunned: P({ root: [-0.1, 0], spine: [24, 0, 10], chest: [10, 0, 0], head: [30, 0, 20], armL: [6, 0, 12], foreL: [-10, 0, 0], armR: [10, 0, -10], foreR: [-10, 0, 0], thighL: [-12, 0, 0], shinL: [24, 0, 0] }),
};

// keyed clips: dur (s), keys [time, pose, ease], mask, events [time, name]
function K(dur, keys, o = {}) { return { dur, keys: keys.map(([t, p, e]) => [t, typeof p === 'string' ? (POSES[p] || (console.warn('missing pose', p), {})) : P(p), e || 'inOutSine']), mask: o.mask || null, events: o.events || [], hold: o.hold || 0, loop: !!o.loop }; }
const F60 = f => f / 60;
// Luka's swings: windup → strike → follow-through, timed to the frame data
function swing(m, wind, strike, follow, o = {}) {
  const s = F60(m.s), a = F60(m.a), r = F60(m.r), d = s + a + r;
  return K(d, [[0, wind, 'outQuad'], [s * 0.85, wind, 'inQuad'], [s + a, strike, 'outCubic'], [s + a + r * 0.45, follow, 'inOutSine'], [d, follow]], o);
}
const CLIPS = {};
function buildClips() {
  const M = MOVES;
  CLIPS.chopL = swing(M.L1, { spine: [-6, 30, 0], chest: [-4, 24, 0], armR: [-150, 0, -40], foreR: [-70, 0, 0], handR: [-20, 0, 0], armL: [-30, 0, 20], foreL: [-60, 0, 0] },
    { spine: [18, -24, 0], chest: [10, -18, 0], armR: [-40, -30, -10], foreR: [-20, 0, 0], handR: [20, 0, 0], armL: [-20, 0, 25], foreL: [-50, 0, 0], thighL: [-30, 0, 0], shinL: [30, 0, 0] },
    { spine: [14, -20, 0], chest: [8, -14, 0], armR: [-30, -20, -20], foreR: [-40, 0, 0], armL: [-25, 0, 22], foreL: [-60, 0, 0], thighL: [-20, 0, 0], shinL: [20, 0, 0] });
  CLIPS.backhand = swing(M.L2, { spine: [4, -36, 0], chest: [2, -28, 0], armR: [-60, 60, 40], foreR: [-80, 0, 0], handR: [0, 0, 0] },
    { spine: [10, 30, 0], chest: [6, 24, 0], armR: [-80, -40, -80], foreR: [-10, 0, 0], handR: [0, 0, 0], thighR: [-25, 0, 0], shinR: [25, 0, 0] },
    { spine: [8, 24, 0], chest: [4, 18, 0], armR: [-60, -20, -70], foreR: [-30, 0, 0] });
  CLIPS.rising = swing(M.L3, { root: [-0.12, 0], spine: [24, -10, 0], armR: [10, 0, -30], foreR: [-20, 0, 0], handR: [30, 0, 0], thighL: [-30, 0, 0], shinL: [40, 0, 0] },
    { root: [0.02, 0], spine: [-10, 10, 0], chest: [-8, 8, 0], armR: [-170, 0, -20], foreR: [-20, 0, 0], handR: [-30, 0, 0] },
    { spine: [-4, 6, 0], armR: [-140, 0, -25], foreR: [-40, 0, 0] });
  CLIPS.overhead = swing(M.L4, { spine: [-14, 0, 0], chest: [-10, 0, 0], armR: [-190, 0, -10], foreR: [-80, 0, 0], armL: [-190, 0, 10], foreL: [-80, 0, 0], head: [-10, 0, 0] },
    { root: [-0.14, 0.1], spine: [30, 0, 0], chest: [16, 0, 0], armR: [-50, 0, -6], foreR: [-10, 0, 0], handR: [30, 0, 0], armL: [-50, 0, 6], foreL: [-10, 0, 0], thighL: [-50, 0, 0], shinL: [55, 0, 0], thighR: [20, 0, 0], shinR: [30, 0, 0] },
    { root: [-0.1, 0.05], spine: [24, 0, 0], armR: [-40, 0, -10], foreR: [-20, 0, 0], armL: [-40, 0, 10], foreL: [-20, 0, 0], thighL: [-40, 0, 0], shinL: [45, 0, 0] });
  CLIPS.wide = swing(M.H1, { spine: [0, 60, 0], chest: [0, 40, 0], armR: [-90, 70, -70], foreR: [-40, 0, 0], armL: [-40, 0, 40], foreL: [-60, 0, 0], thighR: [-20, 0, 0], shinR: [20, 0, 0] },
    { spine: [10, -50, 0], chest: [6, -40, 0], armR: [-90, -50, -80], foreR: [-5, 0, 0], handR: [0, 0, 0], armL: [-20, 0, 40], foreL: [-40, 0, 0], thighL: [-30, 0, 0], shinL: [30, 0, 0] },
    { spine: [8, -40, 0], chest: [4, -30, 0], armR: [-70, -40, -70], foreR: [-20, 0, 0] });
  CLIPS.heavyOver = swing(M.H2, { root: [-0.05, -0.05], spine: [-20, 10, 0], chest: [-14, 6, 0], armR: [-200, 0, -6], foreR: [-90, 0, 0], armL: [-200, 0, 6], foreL: [-90, 0, 0], head: [-14, 0, 0], thighR: [10, 0, 0] },
    { root: [-0.22, 0.2], spine: [40, 0, 0], chest: [20, 0, 0], armR: [-60, 0, -4], foreR: [-5, 0, 0], handR: [40, 0, 0], armL: [-60, 0, 4], foreL: [-5, 0, 0], thighL: [-60, 0, 0], shinL: [70, 0, 0], thighR: [24, 0, 0], shinR: [40, 0, 0] },
    { root: [-0.18, 0.1], spine: [30, 0, 0], armR: [-50, 0, -10], foreR: [-20, 0, 0], armL: [-50, 0, 10], foreL: [-20, 0, 0], thighL: [-50, 0, 0], shinL: [60, 0, 0] });
  CLIPS.sweep = swing(M.UPSELL, { spine: [6, 80, 0], chest: [4, 50, 0], armR: [-90, 80, -80], foreR: [-30, 0, 0], thighR: [-20, 0, 0] },
    { spine: [10, -90, 0], chest: [6, -60, 0], armR: [-90, -60, -85], foreR: [0, 0, 0], thighL: [-30, 0, 0], shinL: [30, 0, 0] },
    { spine: [8, -70, 0], chest: [4, -40, 0], armR: [-70, -50, -70], foreR: [-20, 0, 0] });
  CLIPS.barge = swing(M.BARGE, { spine: [20, 30, 0], chest: [10, 20, 0], armL: [-40, 0, 50], foreL: [-90, 0, 0] },
    { root: [-0.1, 0.2], spine: [30, 40, 0], chest: [12, 20, 0], armL: [-30, 0, 30], foreL: [-110, 0, 0], thighL: [-50, 0, 0], shinL: [40, 0, 0] },
    { spine: [20, 20, 0], armL: [-30, 0, 30], foreL: [-90, 0, 0] });
  CLIPS.jab = swing(M.FL, 'fistsIdle', { spine: [10, -24, 0], chest: [6, -20, 0], armR: [-90, 0, -8], foreR: [-5, 0, 0], armL: [-45, 0, 20], foreL: [-115, 0, 0] }, 'fistsIdle');
  CLIPS.cross = swing(M.FL2, 'fistsIdle', { spine: [10, 24, 0], chest: [6, 20, 0], armL: [-90, 0, 8], foreL: [-5, 0, 0], armR: [-40, 0, -20], foreR: [-110, 0, 0] }, 'fistsIdle');
  CLIPS.uppercut = swing(M.FH, { root: [-0.12, 0], spine: [20, -20, 0], armR: [-10, 0, -20], foreR: [-120, 0, 0] }, { root: [0.02, 0], spine: [-12, 20, 0], chest: [-8, 10, 0], armR: [-160, 0, -10], foreR: [-60, 0, 0] }, 'fistsIdle');
  CLIPS.bash = swing(M.BASH, 'shield', { root: [-0.08, 0.25], spine: [20, 10, 0], armL: [-85, -10, 20], foreL: [-60, -60, 0], thighL: [-40, 0, 0], shinL: [40, 0, 0] }, 'shield');
  CLIPS.slam = swing(M.QUOTA, { root: [0.0, 0], spine: [-20, 0, 0], armR: [-190, 0, -20], foreR: [-60, 0, 0], armL: [-190, 0, 20], foreL: [-60, 0, 0], head: [-20, 0, 0] },
    { root: [-0.55, 0], spine: [50, 0, 0], armR: [-80, 0, -10], foreR: [-10, 0, 0], armL: [-80, 0, 10], foreL: [-10, 0, 0], thighL: [-90, 0, 10], shinL: [100, 0, 0], thighR: [20, 0, -10], shinR: [110, 0, 0] }, 'crouch');
  CLIPS.rebate = K(0.9, [[0, 'combatIdle'], [0.25, { spine: [-14, 0, 0], armR: [-200, 0, -10], foreR: [-60, 0, 0], armL: [-190, 0, 10], foreL: [-60, 0, 0] }, 'outQuad'], [0.42, { root: [-0.5, 0.1], spine: [55, 0, 0], armR: [-70, 0, -4], foreR: [0, 0, 0], handR: [60, 0, 0], armL: [-70, 0, 4], foreL: [0, 0, 0], thighL: [-90, 0, 0], shinL: [100, 0, 0], thighR: [20, 0, 0], shinR: [100, 0, 0] }, 'inCubic'], [0.9, 'combatIdle']], { events: [[0.42, 'impact']] });
  CLIPS.throw = K(0.42, [[0, 'aim'], [F60(AXE.windup / F) * 0.7, { spine: [-4, -24, 0], chest: [-4, -20, 0], armR: [-200, 0, -10], foreR: [-70, 0, 0] }, 'outQuad'], [F60(AXE.windup / F), { spine: [16, 10, 0], chest: [10, 6, 0], armR: [-80, 0, -20], foreR: [-10, 0, 0] }, 'inCubic'], [0.42, 'aimUnarmed']], { events: [[F60(AXE.windup / F), 'release']] });
  CLIPS.callback = K(0.35, [[0, { armR: [-80, 0, -30], foreR: [-10, 0, 0], handR: [0, 0, 0] }], [0.35, { armR: [-85, 0, -32], foreR: [-5, 0, 0] }]], { mask: 'armR' });
  CLIPS.catch = K(0.32, [[0, { armR: [-85, 0, -30], foreR: [-5, 0, 0] }], [0.06, { spine: [-4, 8, 0], armR: [-60, 0, -30], foreR: [-40, 0, 0] }, 'outQuad'], [0.32, 'combatIdle']]);
  CLIPS.dodge = K(F60(20), [[0, 'combatIdle'], [0.08, { root: [-0.18, 0], spine: [20, 0, 10], thighL: [-40, 0, 20], shinL: [50, 0, 0], thighR: [-10, 0, -20], shinR: [40, 0, 0] }], [F60(20), 'combatIdle']]);
  CLIPS.roll = K(F60(26), [[0, 'combatIdle'], [0.08, { root: [-0.6, 0], spine: [80, 0, 0], chest: [30, 0, 0], head: [40, 0, 0], thighL: [-120, 0, 0], shinL: [130, 0, 0], thighR: [-120, 0, 0], shinR: [130, 0, 0], armL: [-60, 0, 20], armR: [-60, 0, -20] }], [0.3, { root: [-0.6, 0], spine: [80, 0, 0], chest: [30, 0, 0], head: [40, 0, 0], thighL: [-120, 0, 0], shinL: [130, 0, 0], thighR: [-120, 0, 0], shinR: [130, 0, 0] }], [F60(26), 'combatIdle']]);
  CLIPS.hit = K(0.38, [[0, 'combatIdle'], [0.06, { spine: [-18, 10, 0], chest: [-12, 6, 0], head: [-20, 0, 10], armR: [-10, 0, -30], armL: [-10, 0, 30] }, 'outQuad'], [0.38, 'combatIdle']]);
  CLIPS.knockdown = K(1.5, [[0, 'combatIdle'], [0.2, { root: [-0.6, -0.3], spine: [-50, 0, 0], head: [-20, 0, 0], thighL: [-70, 0, 0], thighR: [-50, 0, 0], shinL: [30, 0, 0], armL: [-100, 0, 40], armR: [-100, 0, -40] }, 'outQuad'], [0.6, { root: [-0.86, -0.4], spine: [-80, 0, 0], head: [-10, 0, 0], thighL: [-20, 0, 0], thighR: [-30, 0, 0], armL: [-120, 0, 40], armR: [-120, 0, -40] }], [1.0, 'kneel'], [1.5, 'combatIdle']]);
  CLIPS.roar = K(1.2, [[0, 'combatIdle'], [0.3, { root: [-0.12, 0], spine: [-16, 0, 0], chest: [-14, 0, 0], head: [-24, 0, 0], armL: [-40, 0, 60], foreL: [-80, 0, 0], armR: [-40, 0, -60], foreR: [-80, 0, 0] }, 'outQuad'], [0.95, { root: [-0.12, 0], spine: [-16, 0, 0], chest: [-14, 0, 0], head: [-24, 0, 0], armL: [-40, 0, 60], foreL: [-90, 0, 0], armR: [-40, 0, -60], foreR: [-90, 0, 0] }], [1.2, 'fistsIdle']], { events: [[0.3, 'roar']] });
  CLIPS.headbutt = K(0.6, [[0, 'combatIdle'], [0.18, { spine: [-14, 0, 0], head: [-24, 0, 0], armL: [-80, 0, 10], foreL: [-60, 0, 0] }], [0.3, { spine: [24, 0, 0], head: [30, 0, 0], armL: [-80, 0, 10], foreL: [-80, 0, 0] }, 'inCubic'], [0.6, 'combatIdle']], { events: [[0.3, 'impact']] });
  CLIPS.stomp = K(0.7, [[0, 'combatIdle'], [0.25, { root: [0.05, 0], thighR: [-80, 0, 0], shinR: [90, 0, 0], spine: [-8, 0, 0] }], [0.4, { root: [-0.15, 0], thighR: [-20, 0, 0], shinR: [10, 0, 0], spine: [20, 0, 0] }, 'inCubic'], [0.7, 'combatIdle']], { events: [[0.4, 'impact']] });
  CLIPS.kick = K(0.5, [[0, 'combatIdle'], [0.15, { thighR: [-90, 0, 0], shinR: [100, 0, 0], spine: [-10, 0, 0] }], [0.25, { thighR: [-90, 0, 0], shinR: [5, 0, 0], spine: [-16, 0, 0] }, 'inCubic'], [0.5, 'combatIdle']], { events: [[0.25, 'impact']] });
  CLIPS.getUp = K(0.8, [[0, 'kneel'], [0.8, 'rest']]);
  // gestures (cinematic, additive-ish upper body)
  CLIPS.reach_shoulder = K(1.6, [[0, 'rest'], [0.9, { armL: [-70, 0, -12], foreL: [-28, 0, 0], handL: [10, 0, 0], chest: [0, 12, 0] }, 'inOutSine'], [1.6, { armL: [-68, 0, -12], foreL: [-30, 0, 0], handL: [10, 0, 0], chest: [0, 12, 0] }]], { mask: 'upper', hold: 1 });
  CLIPS.withdraw_fist = K(1.1, [[0, { armL: [-68, 0, -12], foreL: [-30, 0, 0], handL: [10, 0, 0], chest: [0, 12, 0] }], [0.6, { armL: [-30, 0, 4], foreL: [-80, 0, 0], handL: [-20, 0, 0] }], [1.1, { armL: [-8, 0, 8], foreL: [-30, 0, 0], handL: [-10, 0, 0] }]], { mask: 'upper', hold: 1 });
  CLIPS.hold_out_hand = K(1.0, [[0, 'rest'], [1.0, { armR: [-50, 0, -10], foreR: [-30, 0, 0], handR: [0, 0, 0] }]], { mask: 'armR', hold: 1 });
  CLIPS.touch = K(1.2, [[0, 'rest'], [1.2, { armR: [-90, 0, -2], foreR: [-30, 0, 0], handR: [-20, 0, 0], head: [-4, 0, 0] }]], { mask: 'upper', hold: 1 });
  CLIPS.touch_print = K(1.3, [[0, 'rest'], [1.3, { armR: [-86, 0, 17], foreR: [-22, 0, 0], handR: [-35, 0, 0], head: [-4, 6, 0], chest: [0, 6, 0] }]], { mask: 'upper', hold: 1 });
  CLIPS.touch_high = K(1.4, [[0, 'rest'], [1.4, { armR: [-112, 4, 0], foreR: [-14, 0, 0], handR: [-30, 0, 0], head: [-6, 0, 0] }]], { mask: 'upper', hold: 1 });
  CLIPS.untie = K(2.6, [[0, { armR: [-112, 4, 0], foreR: [-14, 0, 0] }], [0.5, { armR: [-90, 0, 0], foreR: [-50, 0, 0], armL: [-80, 0, 0], foreL: [-50, 0, 0] }], [1.2, { armR: [-85, 0, 4], foreR: [-60, 0, 0], armL: [-78, 0, -4], foreL: [-55, 0, 0] }], [1.8, { armR: [-50, 0, -10], foreR: [-80, 0, 0], armL: [-55, 0, 10], foreL: [-80, 0, 0], head: [12, 0, 0] }], [2.6, { armR: [-10, 0, -18], foreR: [-60, -40, 0], head: [16, 0, 0] }]], { mask: 'upper' });
  CLIPS.hand_to_satchel = K(1.2, [[0, 'rest'], [0.5, { armR: [-6, 0, -20], foreR: [-70, -60, 0], handR: [20, 0, 0], head: [16, -10, 0] }], [1.2, { armR: [-4, 0, -16], foreR: [-50, -40, 0], head: [8, 0, 0] }]], { mask: 'upper' });
  CLIPS.nod = K(0.8, [[0, {}], [0.25, { head: [16, 0, 0] }], [0.5, { head: [-4, 0, 0] }], [0.8, {}]], { mask: 'head' });
  CLIPS.shake = K(1.0, [[0, {}], [0.2, { head: [0, 20, 0] }], [0.45, { head: [0, -20, 0] }], [0.7, { head: [0, 14, 0] }], [1.0, {}]], { mask: 'head' });
  CLIPS.shrug = K(0.9, [[0, 'rest'], [0.35, { chest: [-4, 0, 0], shL: [0, 0, 14], shR: [0, 0, -14], armL: [-10, 0, 30], foreL: [-90, 50, 0], armR: [-10, 0, -30], foreR: [-90, -50, 0], head: [0, 0, 8] }], [0.9, 'rest']], { mask: 'upper' });
  CLIPS.point = K(1.4, [[0, 'rest'], [0.35, { armR: [-95, -20, -10], foreR: [-5, 0, 0], handR: [0, 0, 0] }], [1.0, { armR: [-95, -20, -10], foreR: [-5, 0, 0] }], [1.4, 'rest']], { mask: 'armR' });
  CLIPS.rub_neck = K(1.6, [[0, 'rest'], [0.4, { armR: [-150, 30, -20], foreR: [-120, 0, 0], head: [16, 0, 0] }], [1.2, { armR: [-150, 30, -24], foreR: [-125, 0, 0], head: [20, 6, 0] }], [1.6, 'rest']], { mask: 'upper' });
  CLIPS.wipe_eye = K(1.4, [[0, 'rest'], [0.4, { armR: [-140, -10, -10], foreR: [-130, 0, 0], head: [10, 8, 0] }], [1.0, { armR: [-140, -10, -14], foreR: [-135, 0, 0], head: [12, 6, 0] }], [1.4, 'rest']], { mask: 'upper' });
  CLIPS.finger_lips = K(1.0, [[0, 'rest'], [1.0, { armR: [-60, 0, 6], foreR: [-135, -20, 0], handR: [0, 0, 0], head: [6, 0, 0] }]], { mask: 'upper', hold: 1 });
  CLIPS.wave = K(1.6, [[0, 'rest'], [0.3, { armR: [-160, 0, -30], foreR: [-30, 0, 0] }], [0.6, { armR: [-160, 0, -20], foreR: [-50, 0, 0] }], [0.9, { armR: [-160, 0, -35], foreR: [-25, 0, 0] }], [1.2, { armR: [-160, 0, -20], foreR: [-50, 0, 0] }], [1.6, 'rest']], { mask: 'armR' });
  CLIPS.beanie_off = K(1.5, [[0, 'rest'], [0.5, { armR: [-170, 0, -30], foreR: [-80, 0, 0], head: [8, 0, 0] }], [0.9, { armR: [-160, 0, -30], foreR: [-100, 0, 0], head: [12, 0, 0] }], [1.5, { armR: [-30, 0, -10], foreR: [-80, -20, 0], head: [14, 0, 0] }]], { mask: 'upper', hold: 1 });
  CLIPS.tap = K(0.8, [[0, 'holdTablet'], [0.3, { armL: [-40, 0, 10], foreL: [-70, 20, 0], armR: [-50, 0, -10], foreR: [-85, -30, 0], handR: [30, 0, 0] }], [0.8, 'holdTablet']], { mask: 'upper' });
  CLIPS.place = K(1.4, [[0, 'rest'], [0.7, { spine: [30, 0, 0], armL: [-75, 0, 4], foreL: [-30, 0, 0], armR: [-75, 0, -4], foreR: [-30, 0, 0], head: [20, 0, 0] }], [1.4, 'rest']], { mask: 'upper' });
  CLIPS.lay_body = K(2.2, [[0, 'carryBody'], [1.2, { root: [-0.1, 0], spine: [40, 0, 0], armL: [-65, 0, 18], foreL: [-30, 30, 0], armR: [-65, 0, -18], foreR: [-30, -30, 0], head: [24, 0, 0] }], [2.2, { spine: [10, 0, 0], armL: [-20, 0, 10], foreL: [-20, 0, 0], armR: [-20, 0, -10], foreR: [-20, 0, 0], head: [16, 0, 0] }]]);
  CLIPS.pull_axe = K(1.6, [[0, 'rest'], [0.5, { armR: [-100, 0, -6], foreR: [-30, 0, 0], handR: [-10, 0, 0], spine: [10, 0, 0] }], [0.9, { armR: [-110, 0, -6], foreR: [-30, 0, 0], spine: [6, 0, 0] }], [1.2, { armR: [-150, 0, -12], foreR: [-50, 0, 0], spine: [-6, 0, 0], head: [-6, 0, 0] }, 'outCubic'], [1.6, 'combatIdle']], { events: [[1.0, 'free']] });
  CLIPS.gather = K(2.4, [[0, 'kneel'], [0.6, { root: [-0.42, 0], spine: [40, 0, 0], armL: [-60, 0, 0], foreL: [-30, 0, 0], armR: [-60, 0, 0], foreR: [-30, 0, 0], head: [30, 0, 0] }], [1.2, { root: [-0.42, 0], spine: [30, 0, 0], armL: [-50, 0, -10], foreL: [-60, 30, 0], armR: [-50, 0, 10], foreR: [-60, -30, 0], head: [30, 0, 0] }], [1.8, { root: [-0.42, 0], spine: [38, 0, 0], armL: [-62, 0, 0], foreL: [-30, 0, 0], armR: [-62, 0, 0], foreR: [-30, 0, 0], head: [30, 0, 0] }], [2.4, { root: [-0.42, 0], spine: [20, 0, 0], armL: [-40, 0, -10], foreL: [-80, 30, 0], armR: [-40, 0, 10], foreR: [-80, -30, 0], head: [24, 0, 0] }]], { hold: 1 });
  CLIPS.shoot = K(0.7, [[0, 'bowReady'], [0.35, { spine: [4, 22, 0], chest: [2, 20, 0], head: [0, -28, 0], armL: [-88, 0, 6], foreL: [-4, 0, 0], armR: [-85, 0, -40], foreR: [-150, 0, 0], handR: [0, 0, 0] }], [0.42, { spine: [2, 20, 0], chest: [0, 18, 0], head: [0, -26, 0], armL: [-90, 0, 6], foreL: [-4, 0, 0], armR: [-70, 0, -60], foreR: [-40, 0, 0] }, 'outExpo'], [0.7, 'bowReady']], { mask: 'upper', events: [[0.36, 'release']] });
  CLIPS.climb = K(0.9, [[0, { armL: [-160, 0, 10], foreL: [-30, 0, 0], armR: [-120, 0, -10], foreR: [-60, 0, 0], thighL: [-70, 0, 0], shinL: [90, 0, 0] }], [0.45, { armL: [-120, 0, 10], foreL: [-60, 0, 0], armR: [-160, 0, -10], foreR: [-30, 0, 0], thighR: [-70, 0, 0], shinR: [90, 0, 0] }], [0.9, { armL: [-160, 0, 10], foreL: [-30, 0, 0], armR: [-120, 0, -10], foreR: [-60, 0, 0], thighL: [-70, 0, 0], shinL: [90, 0, 0] }]], { loop: true });
  CLIPS.spin_ball = K(1.0, [[0, 'holdBall'], [1.0, { armL: [-60, 0, 20], foreL: [-90, 0, 0], handL: [-60, 0, 0] }]], { mask: 'armL', hold: 1 });
  CLIPS.knockdoor = K(0.9, [[0, 'rest'], [0.2, { armR: [-90, 0, -10], foreR: [-110, 0, 0] }], [0.35, { armR: [-80, 0, -10], foreR: [-80, 0, 0] }], [0.5, { armR: [-90, 0, -10], foreR: [-110, 0, 0] }], [0.65, { armR: [-80, 0, -10], foreR: [-80, 0, 0] }], [0.9, 'rest']], { mask: 'armR' });
  CLIPS.lift = K(0.8, [[0, 'rest'], [0.35, { root: [-0.35, 0], spine: [40, 0, 0], armL: [-60, 0, 10], foreL: [-20, 0, 0], armR: [-60, 0, -10], foreR: [-20, 0, 0] }], [0.8, 'carryLog']]);
  CLIPS.flinch = K(0.3, [[0, {}], [0.06, { spine: [-14, 0, 6], head: [-16, 0, 0] }, 'outQuad'], [0.3, {}]], { mask: 'upper' });
  CLIPS.cheer = K(1.2, [[0, 'rest'], [0.3, { armR: [-170, 0, -20], foreR: [-20, 0, 0], armL: [-160, 0, 30], foreL: [-30, 0, 0] }], [0.9, { armR: [-170, 0, -25], foreR: [-30, 0, 0], armL: [-165, 0, 25], foreL: [-30, 0, 0] }], [1.2, 'rest']], { mask: 'upper' });
  CLIPS.lick = K(1.6, [[0, 'rest'], [0.5, { armR: [-90, 0, 4], foreR: [-130, 0, 0], head: [-10, 0, 0] }], [1.1, { armR: [-92, 0, 4], foreR: [-130, 0, 0], head: [-12, 0, 0] }], [1.6, 'rest']], { mask: 'upper' });
  CLIPS.gag = K(1.0, [[0, 'rest'], [0.2, { spine: [30, 0, 0], chest: [10, 0, 0], head: [20, 0, 0], armR: [-80, 0, -10], foreR: [-120, 0, 0] }], [1.0, 'rest']], { mask: 'upper' });
  CLIPS.slap = K(0.6, [[0, 'rest'], [0.25, { armR: [-130, 0, -20], foreR: [-60, 0, 0] }], [0.35, { armR: [-60, 0, -10], foreR: [-20, 0, 0], spine: [12, 0, 0] }, 'inCubic'], [0.6, 'rest']], { mask: 'upper' });
  // enemy clips
  CLIPS.swipe = K(0.9, [[0, 'churnIdle'], [0.55, { spine: [-6, 40, 0], chest: [-4, 30, 0], armR: [-150, 30, -50], foreR: [-30, 0, 0], head: [0, -10, 0] }, 'outQuad'], [0.68, { spine: [20, -30, 0], chest: [10, -20, 0], armR: [-50, -40, -20], foreR: [-10, 0, 0] }, 'inCubic'], [0.9, 'churnIdle']]);
  CLIPS.lunge = K(1.25, [[0, 'churnIdle'], [0.8, { root: [-0.15, -0.1], spine: [-10, 0, 0], armL: [-120, 0, 20], foreL: [-40, 0, 0], armR: [-120, 0, -20], foreR: [-40, 0, 0], thighR: [20, 0, 0] }, 'outQuad'], [1.0, { root: [-0.2, 0.2], spine: [40, 0, 0], armL: [-90, 0, 10], foreL: [-10, 0, 0], armR: [-90, 0, -10], foreR: [-10, 0, 0], thighL: [-50, 0, 0], shinL: [40, 0, 0] }, 'inCubic'], [1.25, 'churnIdle']]);
  CLIPS.stagger = K(0.7, [[0, 'churnIdle'], [0.1, { root: [-0.05, -0.15], spine: [-30, 20, 10], chest: [-20, 0, 0], head: [-30, 0, 0], armL: [-60, 0, 50], armR: [-60, 0, -50] }, 'outQuad'], [0.7, 'churnIdle']]);
  CLIPS.eflinch = K(0.32, [[0, 'churnIdle'], [0.06, { spine: [-14, 10, 6], head: [-20, 0, 10], armL: [-20, 0, 30] }, 'outQuad'], [0.32, 'churnIdle']]);
  CLIPS.rise = K(2.2, [[0, { root: [-1.25, 0], spine: [60, 0, 0], head: [-30, 0, 0], armL: [-170, 0, 20], foreL: [-30, 0, 0], armR: [-160, 0, -20], foreR: [-30, 0, 0], thighL: [-100, 0, 0], shinL: [120, 0, 0], thighR: [-100, 0, 0], shinR: [120, 0, 0] }], [1.2, { root: [-0.5, 0], spine: [40, 0, 0], armL: [-90, 0, 20], armR: [-60, 0, -20], thighL: [-90, 0, 0], shinL: [100, 0, 0], thighR: [-40, 0, 0], shinR: [80, 0, 0] }], [2.2, 'churnIdle']]);
  CLIPS.bjab = K(1.0, [[0, 'churnIdle'], [0.6, { spine: [-10, 20, 0], armR: [-60, 0, -10], foreR: [-90, 0, 0] }, 'outQuad'], [0.72, { spine: [20, -10, 0], armR: [-90, 0, -5], foreR: [0, 0, 0] }, 'inCubic'], [1.0, 'churnIdle']]);
  CLIPS.bsweep = K(1.3, [[0, 'churnIdle'], [0.9, { spine: [0, 70, 0], chest: [0, 40, 0], armR: [-80, 60, -70], foreR: [-20, 0, 0] }, 'outQuad'], [1.05, { spine: [10, -60, 0], chest: [6, -40, 0], armR: [-80, -50, -70], foreR: [0, 0, 0] }, 'inCubic'], [1.3, 'churnIdle']]);
  CLIPS.boverhead = K(1.6, [[0, 'churnIdle'], [1.1, { spine: [-20, 0, 0], armR: [-200, 0, -10], foreR: [-30, 0, 0], armL: [-200, 0, 10], foreL: [-30, 0, 0] }, 'outQuad'], [1.25, { root: [-0.2, 0.2], spine: [40, 0, 0], armR: [-70, 0, -6], foreR: [0, 0, 0], armL: [-70, 0, 6], foreL: [0, 0, 0] }, 'inCubic'], [1.6, 'churnIdle']]);
  CLIPS.swell = K(2.5, [[0, 'churnIdle'], [2.4, { root: [0.02, 0], spine: [-24, 0, 0], chest: [-10, 0, 0], head: [-30, 0, 0], armL: [-60, 0, 70], foreL: [-30, 0, 0], armR: [-60, 0, -70], foreR: [-30, 0, 0] }]], { hold: 1 });
  CLIPS.toss = K(1.0, [[0, 'churnIdle'], [0.55, { spine: [-10, 30, 0], armR: [-190, 20, -20], foreR: [-80, 0, 0] }, 'outQuad'], [0.7, { spine: [20, -20, 0], armR: [-60, -20, -20], foreR: [-10, 0, 0] }, 'inCubic'], [1.0, 'churnIdle']], { events: [[0.68, 'release']] });
  CLIPS.die = K(1.3, [[0, 'churnIdle'], [0.25, { root: [-0.3, -0.1], spine: [-30, 0, 20], head: [-30, 0, 20], armL: [-80, 0, 60], armR: [-60, 0, -40], thighL: [-30, 0, 0], shinL: [50, 0, 0] }, 'outQuad'], [0.8, { root: [-0.86, -0.4], spine: [-85, 0, 10], head: [-20, 30, 0], armL: [-150, 0, 70], foreL: [-20, 0, 0], armR: [-110, 0, -50], thighL: [-20, 0, 6], thighR: [-10, 0, -6] }, 'inQuad'], [1.3, { root: [-0.9, -0.42], spine: [-88, 0, 10], head: [-10, 40, 0], armL: [-160, 0, 70], armR: [-120, 0, -50], thighL: [-14, 0, 6], thighR: [-6, 0, -6] }]], { hold: 1 });
  CLIPS.dieFwd = K(1.2, [[0, 'churnIdle'], [0.3, { root: [-0.4, 0], spine: [40, 0, 0], head: [20, 0, 0], thighL: [-60, 0, 0], shinL: [90, 0, 0], thighR: [-40, 0, 0], shinR: [90, 0, 0] }, 'outQuad'], [0.9, { root: [-0.92, 0.5], spine: [88, 0, 0], head: [-50, 30, 0], armL: [-160, 0, 40], armR: [-150, 0, -40], thighL: [-6, 0, 0], thighR: [-6, 0, 0] }, 'inQuad'], [1.2, { root: [-0.94, 0.5], spine: [90, 0, 0], head: [-60, 40, 0], armL: [-165, 0, 40], armR: [-155, 0, -40] }]], { hold: 1 });
}

class Animator {
  constructor(actor) {
    this.a = actor; this.t = 0; this.phase = 0; this.speed = 0; this.mode = 'walk'; this.turn = 0;
    this.base = {}; this.cur = {}; for (const b of BONES) { this.base[b] = new Float32Array(3); this.cur[b] = new Float32Array(3); }
    this.baseRoot = [0, 0]; this.root = [0, 0];
    this.overlay = null; this.overlayW = 0; this.overlayTarget = 0; this.overlayRate = 5; this.overlayMask = null; this.prevOverlay = null;
    this.clip = null; this.clipT = 0; this.clipW = 0; this.clipSpeed = 1; this.clipFade = 0.08; this.clipDone = true; this.clipEvents = null; this.clipMask = null; this.clipOut = false; this.clipHoldPose = null;
    this.flinch = { x: 0, v: 0, z: 0, vz: 0 };
    this.look = { yaw: new Spring1({ omega: 6, zeta: 0.9 }), pitch: new Spring1({ omega: 6, zeta: 0.9 }), target: null, weight: 1, chestW: 0.3 };
    this.idleSeed = frand() * 100; this.breathe = 1;
  }
  setOverlay(name, rate = 5, mask = null) {
    if (name === this.overlay && this.overlayTarget > 0) return;
    if (name) { if (this.overlay !== name) { this.prevOverlay = this.overlay; } this.overlay = name; this.overlayTarget = 1; this.overlayMask = mask ? MASKS[mask] : null; }
    else this.overlayTarget = 0;
    this.overlayRate = rate;
  }
  play(name, o = {}) {
    const c = typeof name === 'string' ? CLIPS[name] : name;
    if (!c) { console.warn('no clip', name); return; }
    // freeze the current blended pose as the clip's implicit start, so nothing pops
    this.clip = c; this.clipName = typeof name === 'string' ? name : 'custom'; this.clipT = 0; this.clipSpeed = o.speed || 1; this.clipFade = o.fade != null ? o.fade : 0.1; this.clipDone = false; this.clipOut = false;
    this.clipMask = o.mask ? MASKS[o.mask] : c.mask ? MASKS[c.mask] : null;
    this.clipEvents = (c.events || []).map(e => ({ t: e[0], name: e[1], fired: false })); this.onEvent = o.onEvent || null; this.onDone = o.onDone || null;
    this.clipHold = o.hold != null ? o.hold : c.hold;
    if (o.instant) this.clipW = 1;
    return c.dur / this.clipSpeed;
  }
  stop(fade = 0.15) { if (this.clip) { this.clipOut = true; this.clipFade = fade; } }
  isPlaying(name) { return this.clip && !this.clipDone && !this.clipOut && (!name || this.clipName === name); }
  kick(amount, side = 0) { this.flinch.v -= amount * 9; this.flinch.vz += side * amount * 6; }
  update(dt) {
    this.t += dt;
    const a = this.a, base = this.base, sp = this.speed;
    // ---- procedural locomotion ----
    for (const b of BONES) base[b].fill(0);
    const rest = POSES.rest; for (const b in rest) base[b].set(rest[b]);
    this.baseRoot[0] = 0; this.baseRoot[1] = 0;
    const H = a.height || 1.8, stride = H * (sp > 3 ? 0.62 : 0.42);
    const run = smoothstep(2.6, 4.2, sp), walk = clamp01(sp / 1.4);
    this.phase += dt * (sp / Math.max(stride, 0.3)) * PI;
    const ph = this.phase;
    if (sp > 0.05) {
      const amp = lerp(0.42, 0.75, run) * walk, s = Math.sin(ph), c = Math.cos(ph);
      base.thighL[0] = -s * amp - run * 0.15; base.thighR[0] = s * amp - run * 0.15;
      base.shinL[0] = Math.max(0, Math.sin(ph + 1.3)) * (0.7 + run * 0.9) * walk + 0.08;
      base.shinR[0] = Math.max(0, Math.sin(ph + 1.3 + PI)) * (0.7 + run * 0.9) * walk + 0.08;
      base.footL[0] = -base.thighL[0] * 0.3 - base.shinL[0] * 0.5; base.footR[0] = -base.thighR[0] * 0.3 - base.shinR[0] * 0.5;
      base.armL[0] = s * lerp(0.35, 0.8, run) * walk; base.armR[0] = -s * lerp(0.35, 0.8, run) * walk;
      base.foreL[0] = -0.2 - run * 1.1 - Math.max(0, -s) * 0.3 * walk; base.foreR[0] = -0.2 - run * 1.1 - Math.max(0, s) * 0.3 * walk;
      base.hips[1] = s * 0.1 * walk; base.chest[1] = -s * 0.12 * walk; base.spine[0] = 0.04 + run * 0.16;
      base.head[0] = -run * 0.08;
      this.baseRoot[0] = -Math.abs(c) * 0.035 * walk - run * 0.05 + 0.02 * walk;
      base.spine[2] = -this.turn * 0.12 * walk; base.chest[2] = -this.turn * 0.06;
    }
    // idle life: breathing and weight shift
    const br = Math.sin(this.t * (1.25 + this.breathe * 0.4)) * 0.022 * this.breathe;
    base.chest[0] += br; base.neck[0] -= br * 0.6;
    base.shL[2] += br * 0.5; base.shR[2] -= br * 0.5;
    if (sp < 0.05) { const ws = Noise.n2(this.t * 0.15, this.idleSeed) * 0.05; base.hips[2] += ws; base.spine[2] -= ws * 0.8; base.thighL[2] += ws * 0.4; base.thighR[2] += ws * 0.4; }
    // ---- overlay pose ----
    this.overlayW = damp(this.overlayW, this.overlayTarget, this.overlayRate, dt);
    if (this.overlayTarget === 0 && this.overlayW < 0.01) this.overlay = null;
    const cur = this.cur;
    for (const b of BONES) cur[b].set(base[b]);
    this.root[0] = this.baseRoot[0]; this.root[1] = this.baseRoot[1];
    if (this.overlay && this.overlayW > 0.001) {
      const op = POSES[this.overlay] || {}, w = this.overlayW, m = this.overlayMask;
      for (const b in op) {
        if (b === 'root') { this.root[0] = lerp(this.root[0], op.root[0], w); this.root[1] = lerp(this.root[1], op.root[1], w); continue; }
        if (m && !m.has(b)) continue;
        // keep leg locomotion when moving
        const legs = b.startsWith('thigh') || b.startsWith('shin') || b.startsWith('foot');
        const ww = legs ? w * (1 - walk * 0.85) : w;
        const v = cur[b], t = op[b]; v[0] = lerp(v[0], t[0], ww); v[1] = lerp(v[1], t[1], ww); v[2] = lerp(v[2], t[2], ww);
      }
    }
    // ---- action clip ----
    if (this.clip) {
      const c = this.clip;
      if (!this.clipOut) {
        this.clipT += dt * this.clipSpeed;
        this.clipW = Math.min(1, this.clipW + dt / Math.max(this.clipFade, 0.001));
        for (const e of this.clipEvents) if (!e.fired && this.clipT >= e.t) { e.fired = true; if (this.onEvent) this.onEvent(e.name); a.onAnimEvent && a.onAnimEvent(e.name, this.clipName); }
        if (this.clipT >= c.dur) {
          if (c.loop) this.clipT %= c.dur;
          else if (!this.clipHold) { this.clipOut = true; this.clipDone = true; if (this.onDone) { const f = this.onDone; this.onDone = null; f(); } }
          else { this.clipT = c.dur; if (!this.clipDone) { this.clipDone = true; if (this.onDone) { const f = this.onDone; this.onDone = null; f(); } } }
        }
      } else {
        this.clipW = Math.max(0, this.clipW - dt / Math.max(this.clipFade, 0.001));
        if (this.clipW <= 0) { this.clip = null; this.clipDone = true; }
      }
      if (this.clip) this.applyClip(c, Math.min(this.clipT, c.dur), this.clipW, walk);
    }
    // ---- additive: look-at, flinch ----
    const L = this.look;
    let ly = 0, lp = 0;
    if (L.target && L.weight > 0) {
      const tp = typeof L.target === 'function' ? L.target() : L.target;
      if (tp) {
        const hp = a.headWorld(_v[13]);
        const dx = tp.x - hp.x, dy = tp.y - hp.y, dz = tp.z - hp.z;
        ly = clamp(angleTo(a.yaw, Math.atan2(dx, dz)), -1.6, 1.6) * L.weight; lp = clamp(-Math.atan2(dy, Math.hypot(dx, dz)), -0.6, 0.6) * L.weight;
      }
    }
    L.yaw.target = ly; L.pitch.target = lp; L.yaw.step(dt); L.pitch.step(dt);
    const chestYaw = clamp(L.yaw.x * L.chestW, -25 * D2R, 25 * D2R), headYaw = clamp(L.yaw.x - chestYaw, -70 * D2R, 70 * D2R);
    cur.chest[1] += chestYaw; cur.head[1] += headYaw * 0.7; cur.neck[1] += headYaw * 0.3; cur.head[0] += L.pitch.x * 0.7; cur.neck[0] += L.pitch.x * 0.3;
    const f = this.flinch, nf = Math.max(1, Math.ceil(dt * 120)), hf = dt / nf;
    for (let i = 0; i < nf; i++) { f.v += (-f.x * 140 - f.v * 16) * hf; f.x += f.v * hf; f.vz += (-f.z * 140 - f.vz * 16) * hf; f.z += f.vz * hf; }
    if (!isFinite(f.x + f.z)) { f.x = f.v = f.z = f.vz = 0; }
    cur.spine[0] += f.x * 0.5; cur.chest[0] += f.x * 0.4; cur.head[0] += f.x * 0.6; cur.spine[2] += f.z * 0.4;
    // ---- write bones ----
    const B = a.bones;
    for (const b of BONES) { const bone = B[b]; if (bone) { const v = cur[b]; bone.rotation.set(v[0], v[1], v[2]); } }
    B.hips.position.y = a.legLen + this.root[0] * (H / 1.8); B.hips.position.z = this.root[1];
  }
  applyClip(c, t, w, walk) {
    const keys = c.keys, cur = this.cur, m = this.clipMask;
    let i = 0; while (i < keys.length - 2 && t > keys[i + 1][0]) i++;
    const k0 = keys[i], k1 = keys[Math.min(i + 1, keys.length - 1)];
    const span = Math.max(1e-4, k1[0] - k0[0]), u = (EASE[k1[2]] || EASE.inOutSine)(clamp01((t - k0[0]) / span));
    const p0 = k0[1], p1 = k1[1];
    const seen = this._seen || (this._seen = new Set()); seen.clear();
    for (const p of [p0, p1]) for (const b in p) {
      if (seen.has(b)) continue; seen.add(b);
      if (b === 'root') { const r0 = p0.root || [0, 0], r1 = p1.root || [0, 0]; this.root[0] = lerp(this.root[0], lerp(r0[0], r1[0], u), w); this.root[1] = lerp(this.root[1], lerp(r0[1], r1[1], u), w); continue; }
      if (m && !m.has(b)) continue;
      const v = cur[b], a0 = p0[b] || v, a1 = p1[b] || v;
      const legs = m == null && (b.startsWith('thigh') || b.startsWith('shin') || b.startsWith('foot'));
      const ww = legs ? w * (1 - walk * 0.7) : w;
      v[0] = lerp(v[0], lerp(a0[0], a1[0], u), ww); v[1] = lerp(v[1], lerp(a0[1], a1[1], u), ww); v[2] = lerp(v[2], lerp(a0[2], a1[2], u), ww);
    }
  }
}

// ---------- verlet: chains (ponytail, lanyards) and cloth (cloaks) ----------
class VChain {
  constructor(n, seg, { grav = 9.8, damping = 0.96, stiff = 1 } = {}) {
    this.n = n; this.seg = seg; this.grav = grav; this.damp = damping; this.stiff = stiff;
    this.p = Array.from({ length: n }, () => V3()); this.o = Array.from({ length: n }, () => V3());
    this.inited = false; this.spheres = [];
  }
  reset(a, dir = V3(0, -1, 0)) { for (let i = 0; i < this.n; i++) { this.p[i].copy(a).addScaledVector(dir, i * this.seg); this.o[i].copy(this.p[i]); } this.inited = true; }
  update(dt, anchor, push = null) {
    if (!this.inited) this.reset(anchor);
    dt = Math.min(dt, 1 / 30);
    const p = this.p, o = this.o, g = this.grav * dt * dt, w = U.wind.value, gust = U.gust.value;
    p[0].copy(anchor); o[0].copy(anchor);
    for (let i = 1; i < this.n; i++) {
      const vx = (p[i].x - o[i].x) * this.damp, vy = (p[i].y - o[i].y) * this.damp, vz = (p[i].z - o[i].z) * this.damp;
      o[i].copy(p[i]);
      p[i].x += vx + w.x * (0.4 + gust * 2) * dt * dt * 3; p[i].y += vy - g; p[i].z += vz + w.y * (0.4 + gust * 2) * dt * dt * 3;
      if (push) p[i].addScaledVector(push, dt * dt * (i / this.n));
    }
    for (let it = 0; it < 3; it++) {
      for (let i = 1; i < this.n; i++) {
        const a = p[i - 1], b = p[i]; const dx = b.x - a.x, dy = b.y - a.y, dz = b.z - a.z, d = Math.hypot(dx, dy, dz) || 1e-5;
        const k = (d - this.seg) / d; if (i === 1) { b.x -= dx * k; b.y -= dy * k; b.z -= dz * k; } else { a.x += dx * k * 0.5; a.y += dy * k * 0.5; a.z += dz * k * 0.5; b.x -= dx * k * 0.5; b.y -= dy * k * 0.5; b.z -= dz * k * 0.5; }
      }
      for (const s of this.spheres) for (let i = 1; i < this.n; i++) { const c = s.c, dx = p[i].x - c.x, dy = p[i].y - c.y, dz = p[i].z - c.z, d = Math.hypot(dx, dy, dz); if (d < s.r && d > 1e-5) { const k = s.r / d; p[i].set(c.x + dx * k, c.y + dy * k, c.z + dz * k); } }
      const gy = groundHeight(p[this.n - 1].x, p[this.n - 1].z) + 0.02; for (let i = 1; i < this.n; i++) if (p[i].y < gy) p[i].y = gy;
    }
  }
}
// a cloak: W×H grid pinned along its top row to points supplied each frame
class Cloth {
  constructor(W, H, width, length, mat) {
    this.W = W; this.H = H; this.sx = width / (W - 1); this.sy = length / (H - 1);
    const N = W * H; this.p = Array.from({ length: N }, () => V3()); this.o = Array.from({ length: N }, () => V3()); this.inited = false;
    const g = new THREE.BufferGeometry(), pos = new Float32Array(N * 3), uv = new Float32Array(N * 2), idx = [];
    for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) { uv[(j * W + i) * 2] = i / (W - 1) * 2; uv[(j * W + i) * 2 + 1] = 1 - j / (H - 1) * 2; if (i < W - 1 && j < H - 1) { const a = j * W + i; idx.push(a, a + W, a + 1, a + 1, a + W, a + W + 1); } }
    const col = new Float32Array(N * 3); for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) { const k = 1 - 0.35 * (j / (H - 1)) * 0 - (j === 0 ? 0.2 : 0); col.set([k, k, k], (j * W + i) * 3); }
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3).setUsage(THREE.DynamicDrawUsage)); g.setAttribute('uv', new THREE.BufferAttribute(uv, 2)); g.setAttribute('color', new THREE.BufferAttribute(col, 3)); g.setIndex(idx);
    this.geo = g; this.mesh = new THREE.Mesh(g, mat); this.mesh.frustumCulled = false; this.mesh.castShadow = true; this.mesh.receiveShadow = true;
    this.spheres = []; this.pins = Array.from({ length: W }, () => V3());
    this.nTimer = 0;
  }
  reset(down = V3(0, -1, 0)) { for (let j = 0; j < this.H; j++) for (let i = 0; i < this.W; i++) { const k = j * this.W + i; this.p[k].copy(this.pins[i]).addScaledVector(down, j * this.sy); this.o[k].copy(this.p[k]); } this.inited = true; }
  update(dt, back) {
    if (!this.inited) this.reset();
    dt = Math.min(dt, 1 / 30);
    const W = this.W, H = this.H, p = this.p, o = this.o, g = 9.8 * dt * dt, w = U.wind.value, gust = U.gust.value;
    for (let i = 0; i < W; i++) { p[i].copy(this.pins[i]); o[i].copy(this.pins[i]); }
    for (let k = W; k < W * H; k++) {
      const vx = (p[k].x - o[k].x) * 0.95, vy = (p[k].y - o[k].y) * 0.95, vz = (p[k].z - o[k].z) * 0.95;
      o[k].copy(p[k]);
      const j = Math.floor(k / W) / (H - 1);
      p[k].x += vx + (w.x * (0.5 + gust * 3) * 2.2 + (back ? back.x * 1.2 : 0)) * dt * dt * j;
      p[k].y += vy - g;
      p[k].z += vz + (w.y * (0.5 + gust * 3) * 2.2 + (back ? back.z * 1.2 : 0)) * dt * dt * j;
    }
    const sx = this.sx, sy = this.sy;
    const rel = (a, b, L, wa) => { const dx = p[b].x - p[a].x, dy = p[b].y - p[a].y, dz = p[b].z - p[a].z, d = Math.hypot(dx, dy, dz) || 1e-5, k = (d - L) / d; const ka = wa ? 0 : 0.5, kb = wa ? 1 : 0.5; p[a].x += dx * k * ka; p[a].y += dy * k * ka; p[a].z += dz * k * ka; p[b].x -= dx * k * kb; p[b].y -= dy * k * kb; p[b].z -= dz * k * kb; };
    for (let it = 0; it < 4; it++) {
      for (let j = 0; j < H; j++) for (let i = 0; i < W - 1; i++) { if (j === 0) continue; rel(j * W + i, j * W + i + 1, sx * (1 - j / H * 0.15), false); }
      for (let j = 0; j < H - 1; j++) for (let i = 0; i < W; i++) rel(j * W + i, (j + 1) * W + i, sy, j === 0);
      for (let j = 0; j < H - 2; j++) for (let i = 0; i < W; i++) rel(j * W + i, (j + 2) * W + i, sy * 2, j === 0);
      for (const s of this.spheres) { const c = s.c, r2 = s.r; for (let k = W; k < W * H; k++) { const dx = p[k].x - c.x, dy = p[k].y - c.y, dz = p[k].z - c.z, d = Math.hypot(dx, dy, dz); if (d < r2 && d > 1e-5) { const q = r2 / d; p[k].set(c.x + dx * q, c.y + dy * q, c.z + dz * q); } } }
    }
    const a = this.geo.attributes.position.array;
    for (let k = 0; k < W * H; k++) { a[k * 3] = p[k].x; a[k * 3 + 1] = p[k].y; a[k * 3 + 2] = p[k].z; }
    this.geo.attributes.position.needsUpdate = true;
    if ((this.nTimer = (this.nTimer + 1) % 2) === 0) this.geo.computeVertexNormals();
  }
}
