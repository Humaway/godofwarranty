/* SOS ONLY — character kit: staff figures, the Customers, the Ollie standee, props.
   Figures are drawn in local units: feet on y=0, head centre near y=-318, facing +x ("side" is a
   three-quarter view facing right; flip:true faces left). */

const CAST = {
  luka:   { skin: '#D3A27C', hair: '#21160F', hs: 'short', top: C.navy, pants: '#1C1D22', h: 1.0, w: 1.0 },
  chase:  { skin: '#E2B38E', hair: '#4B2D1A', hs: 'curly', top: C.navy, pants: '#24252B', h: 0.98, w: 0.95 },
  luke:   { skin: '#C38E66', hair: '#2E2119', hs: 'buzz', top: C.navy, pants: '#25262B', h: 1.03, w: 1.07 },
  zee:    { skin: '#B07A55', hair: '#120C0A', hs: 'pony', top: C.navy, pants: '#1B1C21', h: 0.94, w: 0.9 },
  zane:   { skin: '#E6B996', hair: '#6A4728', hs: 'cap', top: C.navy, pants: '#22232A', h: 0.97, w: 0.92 },
  chloe:  { skin: '#EEC7A6', hair: '#5C3B27', hs: 'long', top: '#6B7076', pants: '#1C1D22', h: 0.92, w: 0.9, hoodie: true },
  jarrad: { skin: '#DAA680', hair: '#2A1A11', hs: 'crop', top: C.navy, pants: '#1D1E23', h: 1.08, w: 1.06 },
  rue:    { skin: '#E9BEA0', hair: '#BDB9B2', hs: 'side', top: '#2A2E35', pants: '#2A2E35', h: 1.0, w: 1.02, suit: true },
};

const DEFAULT_PROPS = {
  luka: ['lanyard', 'clipboard'], chase: ['headphones'], luke: ['headtorch', 'cable'], zee: ['tablet'],
  zane: ['gimbal'], chloe: [], jarrad: ['lanyard', 'keyring'], rue: [],
};

// Arm/leg poses. [upper, lower] angles in degrees: 0 = down, 90 = forward (+x), 180 = up, -90 = back.
// {to:[x,y]} solves the limb to reach a point instead (bend: 1 or -1 picks the elbow side).
const POSES = {
  stand:   { na: [6, 2], fa: [-8, -4], nl: [3, 0], fl: [-4, 0] },
  idle:    { na: [10, 30], fa: [-10, 20], nl: [3, 0], fl: [-4, 0] },
  walk:    { na: [-26, -8], fa: [26, 44], nl: [24, 4], fl: [-20, -36] },
  run:     { na: [-52, -10], fa: [56, 120], nl: [56, -8], fl: [-34, -78], lean: 12 },
  point:   { na: [84, 90], fa: [-8, -4], nl: [5, 0], fl: [-5, 0], hand: 'point' },
  pointUp: { na: [36, 176], fa: [-8, -4], nl: [3, 0], fl: [-4, 0], hand: 'point' },
  tapChest:{ na: [28, 150], fa: [-8, -4], nl: [3, 0], fl: [-4, 0], hand: 'point' },
  hold:    { na: [22, 118], fa: [16, 112], nl: [3, 0], fl: [-4, 0] },
  holdOne: { na: [24, 112], fa: [-8, -4], nl: [3, 0], fl: [-4, 0] },
  phone:   { na: { to: [-9, -308], bend: 1 }, fa: [-8, -4], nl: [3, 0], fl: [-4, 0] },
  film:    { na: [66, 98], fa: [30, 122], nl: [6, 0], fl: [-6, 0] },
  filmHigh:{ na: [100, 120], fa: [30, 122], nl: [6, 0], fl: [-6, 0] },
  recoil:  { na: [122, 166], fa: [104, 152], nl: [-12, 2], fl: [16, 0], lean: -9 },
  handsUp: { na: [160, 184], fa: [148, 178], nl: [4, 0], fl: [-5, 0] },
  reach:   { na: [76, 84], fa: [60, 72], nl: [18, 4], fl: [-14, -8], lean: 7 },
  mouth:   { na: { to: [18, -298], bend: -1 }, fa: [-8, -4], nl: [3, 0], fl: [-4, 0] },
  shrug:   { na: [30, 112], fa: [-24, 60], nl: [3, 0], fl: [-4, 0] },
  lift:    { na: [150, 196], fa: [140, 190], nl: [3, 0], fl: [-4, 0] },
  kneel:   { na: [40, 96], fa: [8, 30], nl: [88, 2], fl: [4, -92], ground: true },
  crouch:  { na: [58, 100], fa: [30, 70], nl: [74, -18], fl: [44, -40], lean: 16, ground: true },
  sit:     { na: [16, 44], fa: [8, 34], nl: [84, 4], fl: [80, -2], sit: true },
  slump:   { na: [6, 4], fa: [-6, 0], nl: [6, -88], fl: [-4, -90], lean: 14, ground: true },
  still:   { na: [4, 0], fa: [-4, 0], nl: [2, 0], fl: [-2, 0] },
  typing:  { na: [34, 92], fa: [24, 88], nl: [80, 4], fl: [76, 0], sit: true, lean: 6 },
  hand:    { na: [60, 70], fa: [-8, -4], nl: [3, 0], fl: [-4, 0] },
};

// Front-view arm poses: [upper, lower] where + swings outward from the body.
const FRONT_POSES = {
  stand: { r: [8, 3], l: [8, 3] }, idle: { r: [10, 2], l: [10, 2] }, handsUp: { r: [150, 176], l: [150, 176] },
  point: { r: [88, 90], l: [8, 3] }, hold: { r: [18, 150], l: [18, 150] }, holdOne: { r: [16, 150], l: [8, 3] },
  shrug: { r: [40, 100], l: [40, 100] }, recoil: { r: [120, 175], l: [120, 175] }, lift: { r: [150, 200], l: [150, 200] },
  phone: { r: [30, 170], l: [8, 3] }, film: { r: [30, 140], l: [8, 3] }, mouth: { r: [18, 178], l: [8, 3] },
  slump: { r: [6, 2], l: [6, 2] }, still: { r: [4, 1], l: [4, 1] }, kneel: { r: [10, 4], l: [10, 4] },
  reach: { r: [70, 80], l: [60, 70] }, walk: { r: [12, 6], l: [-6, -2] }, pointUp: { r: [36, 176], l: [8, 3] },
};

const EXPR = {
  neutral: ['dot', 'flat', 'line'], talk: ['dot', 'flat', 'talk'], smile: ['dot', 'raised', 'smile'],
  grin: ['dot', 'raised', 'grin'], laugh: ['closed', 'raised', 'grin'], worried: ['dot', 'worried', 'frown'],
  scared: ['wide', 'worried', 'open'], scream: ['wide', 'worried', 'scream'], shock: ['wide', 'raised', 'open'],
  angry: ['dot', 'angry', 'frown'], shout: ['dot', 'angry', 'scream'], flat: ['narrow', 'flat', 'flat'],
  sad: ['lids', 'worried', 'frown'], blank: ['blank', 'flat', 'line'], closed: ['closed', 'flat', 'line'],
  dead: ['pin', 'flat', 'biggrin'], smirk: ['dot', 'raised', 'smirk'], tremble: ['wide', 'worried', 'tremble'],
  cry: ['lids', 'worried', 'tremble'], hush: ['dot', 'worried', 'line'], calm: ['lids', 'flat', 'smile'],
  forced: ['dot', 'worried', 'smile'], mouthOpen: ['blank', 'flat', 'open'], chat: ['dot', 'raised', 'talk'],
};

const shade = (hex, k) => {
  // k < 0 darkens, k > 0 lightens
  const v = parseInt(hex.slice(1), 16);
  const ch = [(v >> 16) & 255, (v >> 8) & 255, v & 255].map((c) => Math.round(k < 0 ? c * (1 + k) : c + (255 - c) * k));
  return '#' + ch.map((c) => c.toString(16).padStart(2, '0')).join('');
};

function limbPts(S, spec, l1, l2) {
  if (spec.to) {
    const T = spec.to, dx = T[0] - S[0], dy = T[1] - S[1];
    const d = clamp(Math.hypot(dx, dy), 1, l1 + l2 - 0.5);
    const base = Math.atan2(dy, dx);
    const a = Math.acos(clamp((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d), -1, 1)) * (spec.bend || 1);
    const Eb = [S[0] + Math.cos(base - a) * l1, S[1] + Math.sin(base - a) * l1];
    const Hd = [S[0] + Math.cos(base) * d, S[1] + Math.sin(base) * d];
    return [S, Eb, Hd];
  }
  const Eb = [S[0] + Math.sin(spec[0] * D2R) * l1, S[1] + Math.cos(spec[0] * D2R) * l1];
  const Hd = [Eb[0] + Math.sin(spec[1] * D2R) * l2, Eb[1] + Math.cos(spec[1] * D2R) * l2];
  return [S, Eb, Hd];
}

// Two-layer stroke: ink outline under a coloured core, so limbs read as inked shapes.
function limb(pts, col, w, ow, ex = '') {
  const d = 'M' + pts.map((p) => `${n(p[0])} ${n(p[1])}`).join('L');
  return `<path d="${d}" fill="none" ${st(C.ink, w + ow * 2)} ${ex}/><path d="${d}" fill="none" ${st(col, w)}/>`;
}

/* ---------- hair (head-local, head centre 0,0, facing +x) ---------- */

function hairParts(hs, view, col) {
  const hc = shade(col, 0.18);
  const ow = 'stroke="#0E0E10" stroke-width="3" stroke-linejoin="round"';
  const p = (d, c = col) => `<path d="${d}" fill="${c}" ${ow}/>`;
  const curls = (list) => {
    const cs = list.map(([x, y, r]) => Ci(x, y, r, col)).join('');
    return `<g ${st(C.ink, 6)}>${cs}</g><g>${cs}</g>` + list.filter((_, i) => i % 3 === 0).map(([x, y, r]) => Pa(`M${x - r * 0.4} ${y - r * 0.1}q${r * 0.4} ${-r * 0.5} ${r * 0.8} 0`, 'none', st(hc, 1.6))).join('');
  };
  let back = '', front = '';
  if (view === 'back') {
    const capRim = hs === 'cap';
    front = E(0, -2, 23, 28, col, ow);
    if (hs === 'curly') front = curls([[-14, -20, 12], [0, -26, 12], [14, -20, 12], [-19, -4, 11], [19, -4, 11], [-12, 10, 11], [12, 10, 11], [0, 0, 13], [0, 14, 10]]);
    if (hs === 'pony') front += p('M-6 -14 C-12 10 -8 40 0 62 C8 40 12 10 6 -14 Z') + E(0, -14, 6, 4, C.y, ow);
    if (hs === 'long') front += p('M-24 -10 C-30 20 -30 50 -26 74 L26 74 C30 50 30 20 24 -10 C10 -2 -10 -2 -24 -10 Z');
    if (capRim) front = p('M-23 6 C-26 -24 -10 -34 0 -34 C12 -34 26 -24 23 6 C10 0 -10 0 -23 6 Z', '#1D1F24') + p('M-16 4 C-12 18 12 18 16 4 Z', '#1D1F24') + R(-4, -6, 8, 6, C.y, ow);
    if (hs === 'buzz') front += Pa('M-23 -10 C-10 -4 10 -4 23 -10 L23 -5 C10 1 -10 1 -23 -5 Z', '#1A1A1A', ow);
    if (hs === 'side') front = E(0, -2, 23, 28, col, ow) + Pa('M-12 -24 C-4 -18 4 -16 12 -18', 'none', st(shade(col, -0.25), 1.5));
    return { back, front };
  }
  if (view === 'front') {
    switch (hs) {
      case 'short': front = p('M-24 6 C-28 -22 -12 -34 0 -34 C12 -34 28 -22 24 6 L20 -9 L14 -13 L8 -9 L2 -15 L-4 -9 L-10 -14 L-16 -8 L-20 -7 Z'); break;
      case 'crop': front = p('M-24 4 C-26 -24 -12 -34 0 -34 C14 -34 26 -24 24 4 L21 -11 C12 -18 -4 -19 -14 -15 L-21 -10 Z') + p('M-6 -33 C4 -42 20 -36 20 -24 C12 -30 2 -31 -6 -33 Z'); break;
      case 'curly': front = curls([[-20, 0, 9], [-22, -12, 10], [-14, -24, 11], [0, -29, 12], [14, -24, 11], [22, -12, 10], [20, 0, 9], [-7, -18, 9], [7, -18, 9]]); break;
      case 'buzz': front = p('M-23 4 C-25 -22 -12 -32 0 -32 C12 -32 25 -22 23 4 L20 -10 C10 -18 -10 -18 -20 -10 Z'); break;
      case 'pony': front = p('M-23 4 C-26 -22 -12 -33 0 -33 C12 -33 26 -22 23 4 L19 -10 C8 -19 -8 -19 -19 -10 Z') + E(0, -31, 7, 4, col, ow); break;
      case 'cap': front = p('M-22 -8 L-24 4 L-18 -2 Z') + p('M22 -8 L24 4 L18 -2 Z') + p('M-24 -4 C-26 -28 -12 -36 0 -36 C12 -36 26 -28 24 -4 C12 -10 -12 -10 -24 -4 Z', '#1D1F24') + p('M-7 -8 C-7 -14 7 -14 7 -8 Z', col) + Pa('M-7 -8 L7 -8', 'none', st(C.y, 2)); break;
      case 'long':
        back = p('M-25 -14 C-33 14 -33 44 -30 70 L30 70 C33 44 33 14 25 -14 Z');
        front = p('M-23 2 C-26 -22 -10 -34 0 -34 C12 -34 26 -22 23 2 L18 -8 L12 -4 L6 -10 L0 -6 L-6 -10 L-12 -4 L-18 -8 Z') + p('M-23 -2 C-27 14 -26 34 -22 50 L-16 50 C-19 32 -19 16 -17 0 Z') + p('M23 -2 C27 14 26 34 22 50 L16 50 C19 32 19 16 17 0 Z');
        break;
      case 'side': front = p('M-24 4 C-26 -22 -12 -32 0 -32 C14 -32 26 -22 24 4 L21 -12 C10 -20 -6 -22 -18 -14 Z') + Pa('M-8 -30 C-4 -24 4 -20 14 -20', 'none', st(shade(col, -0.3), 1.5)); break;
    }
    return { back, front };
  }
  switch (hs) {
    case 'short': front = p('M-24 4 C-27 -18 -14 -33 4 -33 C20 -33 28 -24 26 -10 L21 -14 L19 -8 L14 -15 L9 -10 L5 -17 C-2 -14 -9 -9 -11 -1 L-14 8 Z'); break;
    case 'crop': front = p('M-23 2 C-26 -20 -12 -34 6 -33 C20 -33 27 -25 26 -14 C20 -18 12 -18 6 -15 C0 -12 -8 -8 -12 0 L-15 8 Z') + p('M2 -32 C14 -42 28 -34 26 -21 C20 -28 12 -30 2 -32 Z'); break;
    case 'curly': front = curls([[-20, 6, 10], [-24, -6, 10], [-21, -19, 10], [-11, -28, 11], [2, -32, 11], [14, -29, 10], [22, -20, 8], [-14, -10, 9], [0, -21, 9]]); break;
    case 'buzz': front = p('M-23 4 C-25 -20 -12 -31 4 -31 C18 -31 25 -24 25 -14 C18 -17 10 -18 2 -16 C-6 -13 -12 -6 -14 6 Z'); break;
    case 'pony':
      back = p('M-16 -24 C-34 -28 -46 -10 -43 10 C-41 28 -36 44 -28 58 C-33 40 -31 20 -27 4 C-25 -6 -21 -14 -16 -14 Z');
      front = p('M-23 2 C-25 -20 -12 -32 4 -32 C18 -32 26 -24 25 -10 C20 -16 12 -20 4 -20 C-6 -18 -12 -10 -14 4 Z') + E(-20, -19, 4, 6, C.y, ow);
      break;
    case 'cap':
      front = p('M-22 -6 L-21 8 L-14 2 Z') + p('M15 -7 L26 -4 L21 2 L27 3 L18 7 Z') +
        p('M-24 -4 C-26 -27 -10 -35 4 -35 C19 -35 27 -25 25 -6 C10 -10 -10 -9 -24 -4 Z', '#1D1F24') +
        p('M-22 -8 C-32 -10 -44 -8 -46 -2 C-38 -1 -28 -2 -20 -2 Z', '#1D1F24') + R(-16, -14, 6, 5, C.y, ow);
      break;
    case 'long':
      back = p('M-20 -24 C-35 -10 -34 30 -31 72 L-4 74 C-9 50 -11 26 -5 6 Z');
      front = p('M-22 0 C-26 -22 -10 -33 6 -32 C20 -31 27 -22 25 -6 L20 -9 L17 -4 L12 -10 L7 -6 L2 -12 C-6 -8 -12 -4 -14 6 Z') + p('M-12 -2 C-17 14 -15 34 -9 46 L-3 44 C-7 30 -7 14 -5 2 Z');
      break;
    case 'side': front = p('M-23 2 C-26 -18 -14 -31 2 -31 C16 -31 25 -24 25 -14 L18 -18 C10 -22 2 -22 -4 -16 C-10 -10 -12 -4 -14 6 Z') + Pa('M-4 -29 C2 -24 8 -22 14 -22', 'none', st(shade(col, -0.3), 1.5)); break;
  }
  return { back, front };
}

/* ---------- faces (head-local) ---------- */

function faceParts(view, expr, o, c) {
  const [eyes, brows, mouth] = Array.isArray(expr) ? expr : (EXPR[expr] || EXPR.neutral);
  const lk = o.look || [0, 0];
  const side = view === 'side';
  const E1 = side ? [3, 0] : [-9, 0], E2 = side ? [16, -1] : [9, 0];
  const k2 = side ? 0.82 : 1;
  const M = side ? [12, 16] : [0, 16];
  let s = '';
  const eye = ([x, y], k) => {
    switch (eyes) {
      case 'wide': return Ci(x, y, 5.2 * k, '#FFFFFF', st(C.ink, 1.6)) + Ci(x + lk[0] * 2.2, y + lk[1] * 2, 2.1 * k, C.ink);
      case 'pin': return Ci(x, y, 5 * k, '#FFFFFF', st(C.ink, 1.6)) + Ci(x + lk[0] * 2, y + lk[1] * 2, 1.2, C.ink);
      case 'blank': return Ci(x, y, 4.6 * k, '#F4F4F0', st(C.ink, 1.6));
      case 'closed': return Pa(`M${x - 4.5 * k} ${y}q${4.5 * k} 3.5 ${9 * k} 0`, 'none', st(C.ink, 2.2));
      case 'narrow': return Pa(`M${x - 4 * k} ${y}h${8 * k}`, 'none', st(C.ink, 2.4));
      case 'lids': return E(x + lk[0], y + 1 + lk[1], 2.6 * k, 2.4, C.ink) + Pa(`M${x - 5 * k} ${y - 1}h${10 * k}`, 'none', st(C.ink, 2));
      default: return E(x + lk[0] * 1.5, y + lk[1] * 1.5, 2.6 * k, 3.4, C.ink);
    }
  };
  s += eye(E1, 1) + eye(E2, k2);
  // brows: [inner end, outer end] offsets; the inner end is the one nearer the nose
  const brow = ([x, y], k, innerRight) => {
    if (brows === 'none') return '';
    const by = y - 9;
    const [inn, out] = { flat: [0, 0], raised: [-3, -3], worried: [-3.5, 1], angry: [3.5, -1.5] }[brows] || [0, 0];
    const yl = by + (innerRight ? out : inn), yr = by + (innerRight ? inn : out);
    return Pa(`M${n(x - 5 * k)} ${n(yl)}L${n(x + 5 * k)} ${n(yr)}`, 'none', st(C.ink, 2.6));
  };
  s += brow(E1, 1, true) + brow(E2, k2, false);
  if (side) s += Pa('M20 -1 L26 9 L19 11', 'none', st(C.ink, 2.2));
  else s += Pa('M0 4 L-2 9 L2 10', 'none', st(C.ink, 1.8));
  const [mx, my] = M;
  switch (mouth) {
    case 'smile': s += Pa(`M${mx - 7} ${my - 1}q7 6 14 0`, 'none', st(C.ink, 2.4)); break;
    case 'grin': s += Pa(`M${mx - 9} ${my - 3}q9 2 18 0q-2 10 -9 10q-7 0 -9 -10Z`, '#FFFFFF', st(C.ink, 2.2)) + Pa(`M${mx - 8} ${my}h16`, 'none', st(C.ink, 1)); break;
    case 'biggrin': s += Pa(`M${mx - 18} ${my - 6}q18 4 34 -2q-4 16 -17 16q-13 0 -17 -14Z`, '#FFFFFF', st(C.ink, 2.4)) + Pa(`M${mx - 16} ${my - 1}h31` + [-12, -7, -2, 3, 8, 13].map((x) => `M${mx + x} ${my - 4}v10`).join(''), 'none', st(C.ink, 1.1)); break;
    case 'open': s += E(mx, my + 1, 4, 5, C.ink); break;
    case 'talk': s += E(mx, my, 4.6, 3, C.ink); break;
    case 'scream': s += E(mx, my + 2, 6.5, 10, C.ink) + E(mx, my + 7, 3.5, 3, '#7A2A2A'); break;
    case 'frown': s += Pa(`M${mx - 6} ${my + 3}q6 -5 12 0`, 'none', st(C.ink, 2.4)); break;
    case 'flat': s += Pa(`M${mx - 7} ${my}h13`, 'none', st(C.ink, 2.6)); break;
    case 'smirk': s += Pa(`M${mx - 6} ${my + 1}q8 2 12 -4`, 'none', st(C.ink, 2.4)); break;
    case 'tremble': s += Pa(`M${mx - 9} ${my - 1}q2 3 4.5 1q2 3 4.5 0q2 3 4.5 0q2 3 4.5 -2`, 'none', st(C.ink, 2.2)); break;
    default: s += Pa(`M${mx - 5} ${my}h10`, 'none', st(C.ink, 2.2));
  }
  if (o.tears) s += Pa(`M${E1[0]} ${E1[1] + 5}q-2 10 1 18`, 'none', st(C.screen, 2.2)) + Pa(`M${E2[0]} ${E2[1] + 5}q2 9 0 15`, 'none', st(C.screen, 1.8));
  if (o.blush) s += E(E1[0] - 2, 9, 5, 2.5, '#E07A6A', 'opacity=".45"');
  return s;
}

/* ---------- a staff figure ---------- */

// o: {x, y, s, pose, view:'side'|'front'|'back', face, flip, sil, rim, light:'side'|'under'|'top'|'none',
//     so (shadow opacity), props:[...] (replaces defaults), add:[...], no:[...], look, tilt, lean, arms:{na,fa}, legs:{nl,fl},
//     beam (head torch on), screen (glowing screen colour for held devices), cls, ex}
function fig(who, o = {}) {
  const c = CAST[who];
  const view = o.view || 'side';
  const s = (o.s || 1) * c.h;
  const W = c.w;
  const pose = Object.assign({}, POSES[o.pose || 'stand'] || POSES.stand, o.arms || {}, o.legs || {});
  const fpose = Object.assign({}, FRONT_POSES[o.pose] || FRONT_POSES.stand, o.farms || {});
  let props = (o.props || DEFAULT_PROPS[who]).concat(o.add || []).filter((p) => !(o.no || []).includes(p));
  if (view === 'back') props = props.filter((p) => !['tablet', 'clipboard'].includes(p));
  const has = (p) => props.includes(p);
  const sk = c.skin, top = c.top, pants = c.pants;
  const lwK = Math.pow(o.s || 1, -0.55);
  const OW = 3.3 * lwK;
  const sleeve = c.hoodie || c.suit ? 'long' : 'short';
  const sy = -276, hy = -150;
  const lean = o.lean != null ? o.lean : pose.lean || 0;
  const id = uid('f');

  // joints
  let NS_, FS_, NH_, FH_;
  if (view === 'side') { NS_ = [-4 * W, sy + 6]; FS_ = [14 * W, sy + 3]; NH_ = [-3, hy + 10]; FH_ = [9, hy + 10]; }
  else { NS_ = [36 * W, sy + 8]; FS_ = [-36 * W, sy + 8]; NH_ = [14, hy + 10]; FH_ = [-14, hy + 10]; }
  const mirrorFront = (spec) => (Array.isArray(spec) ? [-spec[0], -spec[1]] : spec);
  let na, fa, nl, fl;
  if (view === 'side') { na = pose.na; fa = pose.fa; nl = pose.nl; fl = pose.fl; }
  else {
    na = fpose.r; fa = mirrorFront(fpose.l);
    const legSpread = pose.sit ? [86, 4] : null;
    nl = legSpread || (pose.ground && o.pose === 'kneel' ? [4, -90] : [3, 0]);
    fl = legSpread || (pose.ground && o.pose === 'kneel' ? [-4, -90] : [-3, 0]);
    if (o.pose === 'slump') { nl = [8, -88]; fl = [-8, -88]; }
    if (view === 'back') { const t = na; na = fa; fa = t; }
  }
  const legL = [76, 70], armL = [64, 58];
  const nLeg = limbPts(NH_, nl, legL[0], legL[1]), fLeg = limbPts(FH_, fl, legL[0], legL[1]);
  // pivot upper body around hips for lean
  const rot = (p) => {
    if (!lean) return p;
    const a = lean * D2R, cx = 0, cy = hy;
    const dx = p[0] - cx, dy = p[1] - cy;
    return [cx + dx * Math.cos(a) - dy * Math.sin(a), cy + dx * Math.sin(a) + dy * Math.cos(a)];
  };
  const nArm = limbPts(rot(NS_), na, armL[0], armL[1]), fArm = limbPts(rot(FS_), fa, armL[0], armL[1]);
  // grounding: lowest foot or knee sits on y=0 unless sitting
  let yOff = 0;
  if (pose.ground || pose.sit) {
    const lows = [nLeg[1][1], nLeg[2][1] + 6, fLeg[1][1], fLeg[2][1] + 6];
    yOff = pose.sit ? -hy : -Math.max(...lows) + 0;
    if (pose.sit) yOff = 124;
  }

  // ---- parts ----
  const legCol = pants, farLeg = shade(pants, -0.25);
  const shoe = (L, col) => {
    const [, k, a] = L;
    const ang = Math.atan2(a[1] - k[1], a[0] - k[0]) / D2R - 90;
    return `<g transform="translate(${n(a[0])} ${n(a[1])}) rotate(${n(ang)})"><path d="M-9 -4 C-10 6 -6 9 0 9 L22 9 C24 4 18 0 8 -3 Z" fill="${C.ink}" ${st(C.ink, OW)}/></g>`;
  };
  const legsOut = (L, col) => limb(L, col, 21 * W, OW) + shoe(L, col);
  const handPt = (A) => A[2];
  const hand = (A, col, kind) => {
    const h = A[2];
    if (c.hoodie) return Ci(h[0], h[1], 10.5, top, st(C.ink, OW)) + Pa(`M${n(h[0] - 7)} ${n(h[1] - 4)}q7 -4 14 0`, 'none', st(shade(top, -0.3), 1.5));
    let s2 = Ci(h[0], h[1], 9.2, sk, st(C.ink, OW));
    if (kind === 'point') {
      const ang = Math.atan2(A[2][1] - A[1][1], A[2][0] - A[1][0]);
      const fx = h[0] + Math.cos(ang) * 17, fy = h[1] + Math.sin(ang) * 17;
      s2 = limb([[h[0], h[1]], [fx, fy]], sk, 5, OW * 0.8) + s2;
    }
    return s2;
  };
  const arm = (A, isNear) => {
    const col = isNear ? top : shade(top, -0.25), skin = isNear ? sk : shade(sk, -0.18);
    if (sleeve === 'long') return limb(A, col, 17 * W, OW);
    const sl = [A[0], [lerp(A[0][0], A[1][0], 0.62), lerp(A[0][1], A[1][1], 0.62)]];
    return limb(A, skin, 14 * W, OW) + limb(sl, col, 19 * W, OW) + Ln(sl[1][0], sl[1][1], lerp(sl[1][0], sl[0][0], 0.06), lerp(sl[1][1], sl[0][1], 0.06), C.y, 2.2 * lwK);
  };

  // torso
  let torso, collar = '';
  if (view === 'side') {
    torso = `M${-24 * W} ${sy + 8}C${-31 * W} ${sy + 52} ${-28 * W} ${hy - 40} ${-25 * W} ${hy + 6}L${25 * W} ${hy + 6}C${28 * W} ${hy - 40} ${31 * W} ${sy + 64} ${23 * W} ${sy + 14}Q${17 * W} ${sy - 4} 4 ${sy - 6}Q${-16 * W} ${sy - 6} ${-24 * W} ${sy + 8}Z`;
    if (c.suit) collar = Pa(`M-2 ${sy - 5}L12 ${sy + 40}L20 ${sy + 4}Z`, '#F4F2EC', st(C.ink, OW * 0.7)) + Pa(`M10 ${sy + 4}L15 ${sy + 6}L14 ${sy + 46}L11 ${sy + 52}L9 ${sy + 44}Z`, C.y, st(C.ink, 1.4));
    else if (!c.hoodie) collar = Pa(`M-6 ${sy - 6}L8 ${sy + 16}L18 ${sy - 2}Z`, top, st(C.y, 2.4 * lwK)) + Ln(8, sy + 16, 8, sy + 44, shade(top, -0.4), 1.6) + Ci(-12 * W, sy + 40, 4, C.y);
  } else {
    torso = `M${-38 * W} ${sy + 10}Q${-40 * W} ${sy - 4} ${-24 * W} ${sy - 6}L${24 * W} ${sy - 6}Q${40 * W} ${sy - 4} ${38 * W} ${sy + 10}C${36 * W} ${sy + 64} ${32 * W} ${hy - 30} ${31 * W} ${hy + 6}L${-31 * W} ${hy + 6}C${-32 * W} ${hy - 30} ${-36 * W} ${sy + 64} ${-38 * W} ${sy + 10}Z`;
    if (view === 'front') {
      if (c.suit) collar = Pa(`M-12 ${sy - 6}L0 ${sy + 46}L12 ${sy - 6}Z`, '#F4F2EC', st(C.ink, OW * 0.7)) + Pa(`M-4 ${sy + 2}L4 ${sy + 2}L5 ${sy + 48}L0 ${sy + 56}L-5 ${sy + 48}Z`, C.y, st(C.ink, 1.4));
      else if (!c.hoodie) collar = Pa(`M-14 ${sy - 6}L0 ${sy + 18}L14 ${sy - 6}`, top, st(C.y, 2.4 * lwK)) + Ln(0, sy + 18, 0, sy + 44, shade(top, -0.4), 1.6) + Ci(-18 * W, sy + 34, 4, C.y);
    }
  }
  const pantsTop = view === 'side'
    ? Pa(`M${-25 * W} ${hy - 2}L${25 * W} ${hy - 2}L${24 * W} ${hy + 26}L${-24 * W} ${hy + 26}Z`, pants, st(C.ink, OW))
    : Pa(`M${-31 * W} ${hy - 2}L${31 * W} ${hy - 2}L${30 * W} ${hy + 26}L${-30 * W} ${hy + 26}Z`, pants, st(C.ink, OW));
  let torsoS = Pa(torso, top, st(C.ink, OW));
  if (c.hoodie) {
    // hoodie: kangaroo pocket, drawstrings, the uniform collar peeking out
    torsoS += view === 'back' ? Pa(`M-26 ${sy + 2}C-20 ${sy + 30} 20 ${sy + 30} 26 ${sy + 2}`, 'none', st(shade(top, -0.3), 2)) :
      Pa(view === 'side' ? `M-6 ${hy - 50}L22 ${hy - 50}L24 ${hy - 6}L-10 ${hy - 6}Z` : `M-22 ${hy - 52}L22 ${hy - 52}L26 ${hy - 6}L-26 ${hy - 6}Z`, 'none', st(shade(top, -0.35), 2)) +
      Pa(view === 'side' ? `M-4 ${sy - 6}L8 ${sy + 8}L18 ${sy - 4}` : `M-12 ${sy - 6}L0 ${sy + 8}L12 ${sy - 6}`, C.navy, st(C.y, 2)) +
      (view === 'side' ? Ln(10, sy + 4, 12, sy + 40, '#EEE', 1.6) : Ln(-5, sy + 2, -6, sy + 40, '#EEE', 1.6) + Ln(5, sy + 2, 6, sy + 40, '#EEE', 1.6));
  }
  torsoS += collar;

  // head
  const HC = view === 'side' ? [2, -318] : [0, -318];
  const hp = hairParts(c.hs, view, c.hair);
  const headShape = view === 'side'
    ? 'M-20 -318C-20 -350 24 -352 24 -322L26 -310C27 -300 20 -292 10 -291C-6 -290 -16 -298 -20 -308Z'
    : 'M-22 -318C-22 -352 22 -352 22 -318C22 -298 12 -290 0 -290C-12 -290 -22 -298 -22 -318Z';
  const neck = view === 'side' ? R(-7, -300, 16, 28, shade(sk, -0.12), st(C.ink, OW)) : R(-8, -300, 16, 28, shade(sk, -0.12), st(C.ink, OW));
  const ear = view === 'side' ? E(-10, -316, 4.5, 7, sk, st(C.ink, OW * 0.8)) : view === 'front' ? E(-23, -316, 4, 7, sk, st(C.ink, OW * 0.8)) + E(23, -316, 4, 7, sk, st(C.ink, OW * 0.8)) : '';
  const tilt = o.tilt || 0;
  const faceS = view === 'back' ? '' : `<g transform="translate(${HC[0]} ${HC[1]})">${faceParts(view, o.face || 'neutral', o, c)}</g>`;
  const headInner = (view === 'back' ? '' : Pa(headShape, sk, st(C.ink, OW))) + ear + faceS +
    `<g transform="translate(${HC[0]} ${HC[1]})">${hp.front}</g>`;

  // props
  const back = [], frontP = [], handP = [], neckP = [];
  if (has('cable') && view !== 'back') back.push(`<g transform="translate(${view === 'side' ? -30 : -40} ${sy + 34})">${[0, 4, 8].map((k) => E(0, 0, 30 - k, 34 - k, 'none', st(k === 4 ? '#E08A1E' : C.ink, k === 4 ? 6 : 3))).join('')}${E(0, 0, 13, 16, C.ink)}</g>`);
  if (has('cable') && view === 'back') frontP.push(`<g transform="translate(0 ${sy + 50})">${[0, 4, 8].map((k) => E(0, 0, 34 - k, 38 - k, 'none', st(k === 4 ? '#E08A1E' : C.ink, k === 4 ? 6 : 3))).join('')}${E(0, 0, 14, 17, C.ink)}</g>`);
  if (has('cable') && view !== 'back') frontP.push(Pa(view === 'side' ? `M-20 ${sy}L20 ${hy - 20}` : `M-30 ${sy}L26 ${hy - 20}`, 'none', st(C.ink, 7) ) + Pa(view === 'side' ? `M-20 ${sy}L20 ${hy - 20}` : `M-30 ${sy}L26 ${hy - 20}`, 'none', st('#5A4A3A', 4)));
  if (has('lanyard') && view !== 'back') {
    const cx = view === 'side' ? 6 : 0;
    frontP.push(Pa(`M${cx - 10} ${sy - 4}L${cx - 2} ${sy + 50}M${cx + 10} ${sy - 4}L${cx + 2} ${sy + 50}`, 'none', st(C.y, 4.2 * lwK)) +
      R(cx - 9, sy + 48, 18, 24, '#FFFFFF', st(C.ink, 1.6)) + R(cx - 9, sy + 48, 18, 6, C.y) + Ln(cx - 5, sy + 62, cx + 5, sy + 62, C.ink, 1.6) + Ln(cx - 5, sy + 67, cx + 3, sy + 67, C.ink, 1.2) +
      (who === 'luka' ? Ci(cx, sy + 78, 4, 'none', st('#9AA0A6', 2)) + Pa(`M${cx} ${sy + 82}l-3 10l4 2`, 'none', st('#9AA0A6', 2.4)) : ''));
  }
  if (has('keyring') && view !== 'back') frontP.push(Ln(view === 'side' ? 18 : 22, hy + 6, view === 'side' ? 20 : 24, hy + 22, '#9AA0A6', 1.6) + `<g transform="translate(${view === 'side' ? 20 : 24} ${hy + 30})">${Ci(0, 0, 8, '#FFFFFF', st(C.ink, 1.8))}${Pa('M-7 -3Q0 2 7 -3M-5 5Q0 -2 2 -8M2 7Q1 0 7 -2', 'none', st('#1E5AA8', 1.4))}</g>`);
  if (has('headphones') && view !== 'back') {
    const hx = view === 'side' ? 2 : 0;
    neckP.push(Pa(`M${hx - 18} ${sy - 4}Q${hx} ${sy + 18} ${hx + 18} ${sy - 4}`, 'none', st(C.ink, 6)) + E(hx - 19, sy - 6, 8, 10, '#26272C', st(C.ink, OW)) + E(hx + 19, sy - 6, 8, 10, '#26272C', st(C.ink, OW)) + E(hx + 19, sy - 6, 3.5, 5, C.y));
  }
  if (has('laptop')) back.push(R(view === 'side' ? -40 : -54, sy + 40, 12, 72, '#4A4D55', st(C.ink, OW)) + Ln(view === 'side' ? -36 : -50, sy + 44, view === 'side' ? -36 : -50, sy + 108, '#9AA0A6', 1.4));
  const hn = handPt(nArm);
  if (has('clipboard') && view !== 'back') {
    const ang = Math.atan2(nArm[2][1] - nArm[1][1], nArm[2][0] - nArm[1][0]) / D2R - 90;
    handP.push(`<g transform="translate(${n(hn[0])} ${n(hn[1])}) rotate(${n(ang)})">${R(-16, -4, 32, 42, '#9C7A4C', st(C.ink, OW))}${R(-12, 2, 24, 32, '#FAF8F0')}${R(-7, -7, 14, 7, '#9AA0A6', st(C.ink, 1.4))}${[10, 16, 22, 28].map((y) => Ln(-8, y, 8, y, '#8A8A8A', 1.2)).join('')}</g>`);
  }
  if (has('tablet') && view !== 'back') handP.push(`<g transform="translate(${n(hn[0] + 4)} ${n(hn[1] - 26)}) rotate(-8)">${R(-15, -2, 30, 40, C.y, `rx="5" ${st(C.ink, OW)}`)}${R(-11, 3, 22, 30, o.screen || '#20262E', 'rx="2" class="lit"')}</g>`);
  if (has('gimbal') && view !== 'back') {
    const scr = o.screen || '#CFE9F5';
    handP.push(`<g transform="translate(${n(hn[0])} ${n(hn[1])})">${R(-3, -40, 6, 40, '#2A2B30', st(C.ink, 1.6))}${R(-11, -66, 22, 30, '#15161A', `rx="3" ${st(C.ink, 1.6)}`)}${R(-8, -63, 16, 24, scr, 'rx="1.5" class="lit"')}${Ci(0, -82, 11, 'none', `class="lit" ${st('#FFFFFF', 4)}`)}${Ci(0, -82, 11, 'none', st(C.ink, 1))}</g>`);
  }
  if (has('phoneEar') && view !== 'back') handP.push(`<g transform="translate(${n(hn[0])} ${n(hn[1])}) rotate(-8)">${R(-8, -22, 16, 34, '#15161A', `rx="3" ${st(C.ink, 1.6)}`)}${o.screen ? R(-5.5, -19, 11, 28, o.screen, 'rx="1.5" class="lit"') : ''}</g>`);
  if (has('phoneHand') && view !== 'back') handP.push(`<g transform="translate(${n(hn[0])} ${n(hn[1])}) rotate(-12)">${R(-9, -24, 18, 32, '#15161A', `rx="3" ${st(C.ink, 1.6)}`)}${R(-6.5, -21, 13, 26, o.screen || C.screen, 'rx="1.5" class="lit"')}</g>`);
  if (has('scanner') && view !== 'back') {
    const ang = Math.atan2(nArm[2][1] - nArm[1][1], nArm[2][0] - nArm[1][0]) / D2R;
    handP.push(`<g transform="translate(${n(hn[0])} ${n(hn[1])}) rotate(${n(ang - 30)})">${Pa('M-6 -6 L26 -10 L30 0 L4 6 L2 22 L-8 22 Z', '#3A3C42', st(C.ink, OW))}${R(26, -9, 4, 8, C.laser, 'class="lit"')}${o.laser ? `<path class="lit" d="M30 -5 L${o.laser} -5" stroke="${C.laser}" stroke-width="2.2" opacity=".9"/>` : ''}</g>`);
  }
  let torchS = '';
  if (has('headtorch') && view !== 'back') {
    const lx = view === 'side' ? 26 : 0, ly = -332;
    torchS = Pa(view === 'side' ? 'M-21 -330C-8 -336 12 -338 25 -334L25 -328C12 -331 -8 -330 -21 -324Z' : 'M-23 -334C-10 -338 10 -338 23 -334L23 -328C10 -332 -10 -332 -23 -328Z', '#1A1A1A', st(C.ink, 1.5)) +
      R(lx - 6, ly - 6, 12, 10, '#2A2B30', st(C.ink, 1.6)) + Ci(lx + (view === 'side' ? 2 : 0), ly - 1, 3.6, o.beam ? '#FFFBE0' : '#CFCFC4', 'class="lit"');
    if (o.beam) back.unshift(`<path class="lit" d="M${lx} ${ly}L${lx + 520} ${ly - 160}L${lx + 520} ${ly + 120}Z" fill="url(#gCone)" transform="rotate(${o.beam === true ? 0 : o.beam} ${lx} ${ly})" opacity=".9"/>`);
  }

  // shading: shadow shape clipped to torso + head
  const light = o.light || 'side', so = o.so == null ? 0.42 : o.so;
  let shadeS = '';
  if (!o.sil && light !== 'none') {
    const cl = `<clipPath id="${id}s"><path d="${torso}"/><path d="${headShape}"/></clipPath>`;
    let sh = '';
    if (light === 'side') sh = Pa(view === 'side' ? `M-90 -400L-6 -400Q-20 -300 -4 -230Q-14 -180 -2 -100L-90 -100Z` : 'M-90 -400L-8 -400Q-22 -300 -6 -230Q-14 -180 -6 -100L-90 -100Z', C.ink, `opacity="${so}"`);
    else if (light === 'front') sh = Pa('M90 -400L10 -400Q24 -300 8 -230Q16 -180 6 -100L90 -100Z', C.ink, `opacity="${so}"`);
    else if (light === 'under') sh = R(-80, -360, 160, 230, 'url(#gUnder)', `opacity="${Math.min(1, so + 0.35)}"`) + R(-80, -330, 160, 200, 'url(#gUnderS)', `opacity=".9"`);
    else if (light === 'top') sh = R(-80, -300, 160, 200, 'url(#gFadeUp)', `opacity="${so}" transform="rotate(180 0 -200)"`);
    else if (light === 'dark') sh = R(-80, -400, 160, 300, C.ink, `opacity="${so}"`);
    shadeS = cl + `<g clip-path="url(#${id}s)">${sh}</g>`;
  }

  const farLegS = legsOut(fLeg, farLeg), nearLegS = legsOut(nLeg, legCol);
  const upper = `<g${lean ? ` transform="rotate(${lean} 0 ${hy})"` : ''}>${hp.back ? `<g transform="translate(${HC[0]} ${HC[1]})">${hp.back}</g>` : ''}${torsoS}${neck}${shadeS ? '' : ''}</g>`;
  const headG = `<g transform="${lean ? `rotate(${lean} 0 ${hy}) ` : ''}rotate(${tilt} ${HC[0]} -296)">${headInner}${torchS}</g>`;
  const handKind = pose.hand;
  const body =
    back.join('') +
    (view === 'back' ? '' : arm(fArm, false) + hand(fArm, top, '')) +
    farLegS + nearLegS + pantsTop + upper +
    (shadeS ? `<g${lean ? ` transform="rotate(${lean} 0 ${hy})"` : ''}>${shadeS}</g>` : '') +
    `<g${lean ? ` transform="rotate(${lean} 0 ${hy})"` : ''}>${neckP.join('')}${frontP.join('')}</g>` +
    headG +
    (view === 'back' ? arm(fArm, true) + hand(fArm, top, '') : '') +
    arm(nArm, true) + hand(nArm, top, handKind) + handP.join('');

  const fl_ = o.flip ? -1 : 1;
  // Report world positions of hands and head so a page can attach lasers, beams, balloon tails.
  if (o.out) {
    const wp = (p) => [(o.x || 0) + p[0] * s * fl_, (o.y || 0) + (p[1] + yOff) * s];
    o.out.nh = wp(nArm[2]); o.out.fh = wp(fArm[2]); o.out.head = wp(rot(HC)); o.out.mouth = wp(rot([HC[0] + (view === 'side' ? 12 : 0), HC[1] + 16]));
    o.out.scale = s; o.out.flip = fl_;
  }
  const T = `translate(${n(o.x || 0)} ${n((o.y || 0))}) scale(${n(s * fl_ * 1000) / 1000} ${n(s * 1000) / 1000})${yOff ? ` translate(0 ${n(yOff)})` : ''}`;
  const cls = `fig fig-${who}${o.sil ? ' sil' : ''} ${o.cls || ''}`;
  if (o.rim) {
    const rimCls = o.rim === C.screen || o.rim === 'screen' ? 'rimS' : o.rim === 'white' ? 'rimW' : 'rimY';
    const dx = o.rimDx == null ? -5 : o.rimDx;
    return `<g class="${cls}" ${o.ex || ''}><g transform="${T}"><g class="${rimCls}" transform="translate(${dx} -2)">${body}</g><g class="sil">${body}</g></g></g>`;
  }
  return `<g class="${cls}" ${o.ex || ''}><g transform="${T}">${body}</g></g>`;
}

// Head and shoulders only, for close-ups (cheaper than a whole figure and drawn bigger).
function bust(who, o = {}) {
  return fig(who, Object.assign({}, o, { cls: (o.cls || '') + ' bust' }));
}

/* ---------- the Customers ---------- */

const CUSTOMER_KINDS = {
  hivis: { coat: '#D8762C', trim: '#C9CCC8', under: '#2E3236', legs: '#2B2F3A' },
  suit: { coat: '#17181C', trim: '#ECE9E2', under: '#ECE9E2', legs: '#17181C' },
  wind: { coat: '#2F8C8C', trim: '#5B3C88', under: '#C2457E', legs: '#2A2E3A' },
  gown: { coat: '#9DB8C8', trim: '#7E9AAA', under: '#9DB8C8', legs: '#B9A493' },
  rain: { coat: '#2F4A3A', trim: '#1E3328', under: '#2F4A3A', legs: '#25282E' },
  cardi: { coat: '#6E5640', trim: '#4E3C2C', under: '#B9B2A2', legs: '#3A3A40' },
  school: { coat: '#5D7FA8', trim: '#3D5F88', under: '#5D7FA8', legs: '#4B4F57' },
  bride: { coat: '#D8D2C6', trim: '#BDB6A8', under: '#D8D2C6', legs: '#D8D2C6' },
};
const CUSTOMER_ORDER = ['hivis', 'suit', 'wind', 'gown', 'rain', 'cardi', 'school', 'bride'];

// A frozen video-call face: smeared compression blocks, doubled eyes, mouth stuck mid-word.
function blockFace(cx, cy, seed, o = {}) {
  const r = rng(seed);
  const tones = o.tones || ['#C9A68A', '#B48C70', '#9E7A62', '#D9B9A0', '#8C6C58'];
  const B = o.block || 7, rx = 22, ry = 27;
  const buckets = tones.map(() => '');
  for (let y = -ry; y < ry; y += B) {
    const smear = r() < 0.3 ? r.jit(10) : 0;
    for (let x = -rx; x < rx; x += B) {
      const nx = (x + B / 2) / rx, ny = (y + B / 2) / ry;
      if (nx * nx + ny * ny > 1.05) continue;
      const k = Math.floor(r() * tones.length);
      const w = r() < 0.15 ? B * (2 + r() * 2) : B;
      buckets[k] += `M${n(cx + x + smear)} ${n(cy + y)}h${n(w)}v${B}h${n(-w)}Z`;
    }
  }
  let s = buckets.map((d, k) => (d ? `<path d="${d}" fill="${tones[k]}"/>` : '')).join('');
  // eyes doubled by artefacts, mouth stuck mid-word
  const ey = cy - 3;
  for (const [dx, dy, op] of [[0, 0, 1], [4 + r() * 3, -3, 0.55]]) {
    s += `<g opacity="${op}">${R(cx - 13 + dx, ey + dy, 8, 5, '#1A1414')}${R(cx + 5 + dx, ey + dy, 8, 5, '#1A1414')}</g>`;
  }
  s += R(cx - 6, cy + 11, 12, 8, '#2A1616') + R(cx - 4, cy + 13, 8, 2, '#5A2A2A');
  // horizontal smear streaks
  for (let i = 0; i < 3; i++) {
    const yy = cy + r.jit(ry * 0.8);
    s += R(cx - rx + r.jit(6), yy, rx * (1.3 + r() * 0.8), 2 + r() * 3, r.pick(tones), 'opacity=".75"');
  }
  return s;
}

// o: {x, y, s, kind, flip, ticket, op, sil, seed, back, faceOp, wet}
function customer(o = {}) {
  const k = CUSTOMER_KINDS[o.kind || 'rain'];
  const s = o.s || 1, seed = o.seed || `${o.x},${o.y},${o.kind}`;
  const r = rng(seed);
  const OW = 2.6 * Math.pow(s, -0.5);
  const sy = -276, hy = -150;
  let b = '';
  // legs
  b += limb([[-10, hy], [-12, -76], [-11, -4]], k.legs, 19, OW) + limb([[10, hy], [11, -76], [12, -4]], shade(k.legs, -0.2), 19, OW);
  b += E(-11, -3, 13, 6, C.ink) + E(12, -3, 13, 6, C.ink);
  // coat / body
  const hem = o.kind === 'gown' || o.kind === 'bride' ? -70 : o.kind === 'rain' || o.kind === 'suit' ? -108 : -132;
  b += Pa(`M-34 ${sy + 8}Q-36 ${sy - 4} -22 ${sy - 6}L22 ${sy - 6}Q36 ${sy - 4} 34 ${sy + 8}L${o.kind === 'bride' ? 46 : 38} ${hem}L${o.kind === 'bride' ? -46 : -38} ${hem}Z`, k.coat, st(C.ink, OW));
  if (o.kind === 'hivis') b += R(-34, -230, 68, 8, k.trim) + R(-36, -190, 72, 8, k.trim) + Pa(`M-10 ${sy - 6}L0 ${sy + 40}L10 ${sy - 6}Z`, k.under);
  if (o.kind === 'suit') b += Pa(`M-12 ${sy - 6}L0 ${sy + 50}L12 ${sy - 6}Z`, k.trim) + Ln(0, sy, 0, sy + 50, C.ink, 4) + Ci(-20, sy + 26, 5, '#E9E1D4', st(C.ink, 1.2));
  if (o.kind === 'wind') b += Pa(`M-34 ${sy + 40}L34 ${sy + 10}L36 ${sy + 40}L-36 ${sy + 70}Z`, k.trim) + Pa(`M-36 ${sy + 70}L36 ${sy + 40}L37 ${sy + 60}L-37 ${sy + 90}Z`, k.under);
  if (o.kind === 'gown') b += [...Array(10)].map(() => Ci(r.range(-30, 30), r.range(sy + 10, hem - 6), 2, k.trim)).join('');
  if (o.kind === 'rain') b += Pa(`M-26 ${sy - 4}Q0 ${sy - 60} 26 ${sy - 4}`, k.coat, st(C.ink, OW));
  if (o.kind === 'cardi') b += Pa(`M-8 ${sy - 4}L-4 ${hem}M8 ${sy - 4}L4 ${hem}`, 'none', st(k.trim, 3)) + R(-6, sy - 4, 12, 90, k.under);
  if (o.kind === 'bride') b += Pa(`M-24 ${sy - 10}Q0 ${sy - 70} 24 ${sy - 10}L40 ${sy + 120}L-40 ${sy + 120}Z`, '#ECE8DE', 'opacity=".55"');
  // arms hanging, one hand holding a ticket
  b += limb([[-30, sy + 10], [-36, -204], [-34, -150]], shade(k.coat, -0.15), 15, OW) + Ci(-34, -146, 8, '#B9A493', st(C.ink, OW));
  b += limb([[30, sy + 10], [34, -204], [26, -156]], k.coat, 15, OW) + Ci(24, -152, 8, '#B9A493', st(C.ink, OW));
  if (o.ticket !== false) b += `<g transform="translate(26 -150) rotate(${n(r.jit(12))})">${R(-6, -2, 12, 22, '#F6F3EA', st(C.ink, 1.2))}${Ln(-3, 5, 3, 5, C.ink, 1.4)}${Ln(-3, 10, 3, 10, C.ink, 1)}</g>`;
  // neck and head
  b += R(-7, -300, 14, 26, '#9E8470', st(C.ink, OW));
  const face = o.faceHidden ? E(0, -318, 22, 27, '#2A2A2E', st(C.ink, OW)) : `<g opacity="${o.faceOp == null ? 1 : o.faceOp}">${blockFace(0, -318, seed, o)}</g>`;
  b += o.back ? E(0, -318, 22, 27, shade(k.coat, -0.5), st(C.ink, OW)) + Pa('M-22 -326C-18 -350 18 -350 22 -326C10 -334 -10 -334 -22 -326Z', '#1E1A16') : face;
  // wet: plastered hair and drips
  if (!o.back) b += Pa('M-23 -322C-24 -350 22 -352 23 -324L18 -336L10 -330L2 -338L-6 -330L-14 -338Z', r.pick(['#2A2018', '#3A2E22', '#1A1612', '#6A645C']), st(C.ink, 1.4));
  if (o.wet !== false) {
    let drips = '';
    for (let i = 0; i < 7; i++) {
      const x = r.range(-36, 36), y = hem + 4 + r() * 20;
      drips += `<path d="M${n(x)} ${n(y)}q-1.6 6 0 9q1.6 -3 0 -9Z" fill="#9FC3D9" opacity=".8"/>`;
    }
    b += drips;
  }
  const fl_ = o.flip ? -1 : 1;
  const sil = o.sil ? ' sil' : '';
  return `<g class="cust${sil} ${o.cls || ''}"${o.op != null ? ` opacity="${o.op}"` : ''} ${o.ex || ''}><g transform="translate(${n(o.x || 0)} ${n(o.y || 0)}) scale(${n(s * fl_ * 1000) / 1000} ${n(s * 1000) / 1000})">${b}</g></g>`;
}

// Single-file line of Customers from near (x0,y0,s0) to far (x1,y1,s1). Drawn far-to-near.
function queueLine(o) {
  const N = o.count || 8, out = [];
  for (let i = N - 1; i >= 0; i--) {
    const t = N === 1 ? 0 : Math.pow(i / (N - 1), o.ease || 1);
    const x = lerp(o.x0, o.x1, t), y = lerp(o.y0, o.y1, t), s = lerp(o.s0, o.s1, t);
    const kind = CUSTOMER_ORDER[(i + (o.offset || 0)) % CUSTOMER_ORDER.length];
    out.push(customer(Object.assign({}, o.each || {}, { x, y, s, kind, seed: `${o.seed || 'q'}${i}`, flip: o.flip, sil: o.sil || (o.silFar && i > o.silFar), op: o.fadeFar ? lerp(1, o.fadeFar, t) : o.op, back: o.back })));
  }
  return out.join('');
}

/* ---------- the Ollie standee: hidden on every page, tap him and he blinks ---------- */

// o: {x, y, s, back, dark, wave, turn (face direction -1/1), id}
let _ollieShift = 0; // second read: he starts a little further along than last time (set per page render)
function ollie(o = {}) {
  const s = o.s || 1;
  o = Object.assign({}, o, { x: o.x + _ollieShift * s * (o.flip ? -1 : 1) });
  const dark = !!o.dark;
  const body = dark ? '#1E1C10' : C.y;
  const line = C.ink;
  let g = '';
  g += E(0, 2, 46, 8, '#000', 'opacity=".35"');
  // stick legs and feet
  g += Pa('M-18 -120 L-24 -6 M18 -120 L24 -6', 'none', st(line, 5)) + E(-28, -5, 11, 5, line) + E(28, -5, 11, 5, line);
  if (o.back) {
    g += Ci(0, -190, 72, dark ? '#16140C' : C.card, st(line, 5)) + Pa('M0 -190 L0 -30 M-30 -150 L0 -60 M30 -150 L0 -60', 'none', st(dark ? '#2A2618' : '#8E7650', 4)) +
      Pa('M-70 -186 L-104 -150 M70 -186 L104 -150', 'none', st(line, 5)) + Ci(-106, -148, 6, line) + Ci(106, -148, 6, line);
  } else {
    const waveA = o.wave ? 'M68 -196 L100 -246' : 'M68 -186 L102 -150';
    g += Pa(`M-68 -186 L-102 -150 ${waveA}`, 'none', st(line, 5)) + Ci(-104, -148, 7, line) + Ci(o.wave ? 102 : 104, o.wave ? -250 : -148, 7, line);
    g += Ci(0, -190, 72, body, st(line, 5));
    if (!dark) g += Pa('M30 -250 A72 72 0 0 1 40 -130 A80 80 0 0 0 30 -250Z', '#E0A800', 'opacity=".8"') + Pa('M-40 -238 q16 -14 36 -16', 'none', st('#FFF3B0', 6));
    // white bandit mask with two black eyes
    const tx = (o.turn || 0) * 10;
    g += Pa(`M${-74 + tx} -214 C${-50 + tx} -236 ${50 + tx} -236 ${74 + tx} -214 C${60 + tx} -186 ${30 + tx} -176 ${0 + tx} -186 C${-30 + tx} -176 ${-60 + tx} -186 ${-74 + tx} -214 Z`, '#FFFFFF', st(line, 4) + (dark ? ' class="lit"' : ''));
    g += `<g class="ol-eyes">${E(-26 + tx, -206, 10, 13, line)}${E(26 + tx, -206, 10, 13, line)}${Ci(-23 + tx, -211, 3, '#FFFFFF')}${Ci(29 + tx, -211, 3, '#FFFFFF')}</g>`;
  }
  if (dark && !o.back) g = glow(0, -206, 120, 70, 'gW', 0.25) + g;
  const fl_ = o.flip ? -1 : 1;
  return `<g class="ollie${o.cls ? ' ' + o.cls : ''}" data-hot="ollie" ${o.ex || ''}><g transform="translate(${n(o.x)} ${n(o.y)}) scale(${n(s * fl_ * 1000) / 1000} ${n(s * 1000) / 1000})">${R(-115, -270, 230, 275, 'transparent')}${g}</g></g>`;
}

/* ---------- small props for close-ups ---------- */

// Thermal queue ticket. o: {num, name, lines, s, r, faint}
function ticketProp(x, y, o = {}) {
  const s = o.s || 1;
  const w = 120, h = 168;
  let t = R(0, 0, w, h, '#F7F4EA', st(C.ink, 2.5));
  t += Pa(`M0 ${h}` + [...Array(12)].map((_, i) => `L${(i + 0.5) * (w / 12)} ${h + 5}L${(i + 1) * (w / 12)} ${h}`).join(''), '#F7F4EA', st(C.ink, 2));
  t += Tx(w / 2, 22, 'OPTUS REDCLIFFE', 11, '#555', 'text-anchor="middle" letter-spacing="1"', FONTS.mono);
  t += Tx(w / 2, 40, 'YOUR NUMBER', 13, '#333', 'text-anchor="middle"', FONTS.mono);
  t += Tx(w / 2, 104, o.num || '07', 70, C.ink, 'text-anchor="middle"', FONTS.mono);
  if (o.name) t += `<g${o.nameCls ? ` class="${o.nameCls}"` : ''}>${Tx(w / 2, 132, o.name, o.nameSize || 17, C.ink, 'text-anchor="middle"', FONTS.mono)}</g>`;
  (o.lines || []).forEach((l, i) => { t += Tx(w / 2, 150 + i * 13, l, 11, '#444', 'text-anchor="middle"', FONTS.mono); });
  return `<g transform="translate(${n(x)} ${n(y)}) rotate(${o.r || 0}) scale(${s})"${o.cls ? ` class="${o.cls}"` : ''}>${t}</g>`;
}

/* ---------- the reader: a silhouette lit from below by the device in their hands ---------- */

// o: {x, y, s, device: 'phone'|'fold'|'foldOpen'|'laptop', rim, ticket (text), rot (Code Rot creeping), flip}
function readerFig(o = {}) {
  const s = o.s || 1, dev = o.device || 'phone';
  let g = '';
  // body: shoulders, head, arms bent holding the device at chest height
  g += Pa('M-62 -250 C-70 -200 -66 -120 -58 0 L58 0 C66 -120 70 -200 62 -250 C40 -272 -40 -272 -62 -250 Z', C.ink);
  g += E(0, -318, 30, 36, C.ink) + R(-12, -290, 24, 30, C.ink);
  g += Pa('M-58 -240 C-80 -190 -60 -160 -24 -168 M58 -240 C80 -190 60 -160 24 -168', 'none', st(C.ink, 22));
  // under-light on chin, cheeks and hands
  const dy = dev === 'laptop' ? -150 : -172;
  g += `<g class="lit">${E(0, -296, 26, 12, C.screen, 'opacity=".22"')}${E(-18, dy + 8, 14, 9, '#C8E6F0', 'opacity=".35"')}${E(18, dy + 8, 14, 9, '#C8E6F0', 'opacity=".35"')}</g>`;
  g = glow(0, dy - 40, 120, 150, 'gS', 0.35) + g;
  // the device
  if (dev === 'laptop') g += `<g class="lit">${Po([[-70, -150], [70, -150], [86, -132], [-86, -132]], '#8E949C', st(C.ink, 2))}${R(-64, -246, 128, 96, '#1A1F26', st(C.ink, 3))}${R(-58, -240, 116, 84, C.screen, 'opacity=".9"')}</g>`;
  else if (dev === 'foldOpen') g += `<g class="lit">${R(-46, -214, 92, 84, '#121418', `rx="6" ${st(C.ink, 3)}`)}${R(-41, -209, 82, 74, C.screen)}${Ln(0, -209, 0, -135, '#7FB8CC', 1.4)}</g>`;
  else if (dev === 'fold') g += `<g class="lit">${R(-18, -222, 36, 96, '#121418', `rx="6" ${st(C.ink, 4)}`)}${R(-14, -218, 28, 88, C.screen)}${R(-22, -222, 6, 96, '#22252B')}</g>`;
  else g += `<g class="lit">${R(-20, -220, 40, 78, '#121418', `rx="6" ${st(C.ink, 3)}`)}${R(-16, -216, 32, 70, C.screen)}</g>`;
  if (o.ticket) g += `<g transform="translate(64 -150) rotate(10)">${R(-14, -4, 30, 44, '#F6F3EA', st(C.ink, 1.5))}${Tx(1, 18, '07', 16, C.ink, 'text-anchor="middle"', FONTS.mono)}${Tx(1, 32, o.ticket, 6, C.ink, 'text-anchor="middle"', FONTS.mono)}</g>`;
  if (o.rimCol) g = `<g transform="translate(-4 -2)">${Pa('M-62 -250 C-70 -200 -66 -120 -58 0 L58 0 C66 -120 70 -200 62 -250 C40 -272 -40 -272 -62 -250 Z', o.rimCol)}${E(0, -318, 30, 36, o.rimCol)}</g>` + g;
  const fl_ = o.flip ? -1 : 1;
  return `<g class="readerfig ${o.cls || ''}"><g transform="translate(${n(o.x || 0)} ${n(o.y || 0)}) scale(${n(s * fl_ * 1000) / 1000} ${n(s * 1000) / 1000})">${g}</g></g>`;
}
