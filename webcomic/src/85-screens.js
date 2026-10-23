/* SOS ONLY — the inside covers: the check-in tablet and the end call screen (HTML, not SVG). */

const REASONS = ['New phone', 'Upgrade', 'Optus Water Solutions', 'Something’s wrong with my service'];

function miniOllie(cls = '') {
  return `<svg class="mini-ollie ${cls}" viewBox="-130 -280 260 290" aria-hidden="true">
    <path d="M-18 -120 L-24 -6 M18 -120 L24 -6" stroke="#0E0E10" stroke-width="7" stroke-linecap="round"/>
    <ellipse cx="-28" cy="-5" rx="12" ry="6" fill="#0E0E10"/><ellipse cx="28" cy="-5" rx="12" ry="6" fill="#0E0E10"/>
    <path d="M-68 -186 L-102 -150" stroke="#0E0E10" stroke-width="7" stroke-linecap="round"/><circle cx="-104" cy="-148" r="8" fill="#0E0E10"/>
    <g class="mo-arm"><path d="M68 -196 L100 -246" stroke="#0E0E10" stroke-width="7" stroke-linecap="round"/><circle cx="102" cy="-250" r="8" fill="#0E0E10"/></g>
    <circle cx="0" cy="-190" r="72" fill="#FFCD00" stroke="#0E0E10" stroke-width="6"/>
    <path d="M-74 -214 C-50 -236 50 -236 74 -214 C60 -186 30 -176 0 -186 C-30 -176 -60 -186 -74 -214 Z" fill="#fff" stroke="#0E0E10" stroke-width="5"/>
    <g class="mo-eyes"><ellipse cx="-26" cy="-206" rx="10" ry="13" fill="#0E0E10"/><ellipse cx="26" cy="-206" rx="10" ry="13" fill="#0E0E10"/></g>
  </svg>`;
}

function ticketHTML(name, when) {
  return `<div class="tk"><div class="tk-h">OPTUS REDCLIFFE</div><div class="tk-s">YOUR NUMBER</div><div class="tk-n">07</div>
    <div class="tk-name">${esc(name)}</div><div class="tk-r">Reason: SOS ONLY</div><div class="tk-t">${esc(when)}</div>
    <div class="tk-f">Please wait to be served</div></div>`;
}

function buildCheckin(el) {
  const back = Save.d.checkedIn;
  const s = Save.d.settings;
  const sw = (k, label, on) => `<button type="button" class="tg" data-k="${k}" role="switch" aria-checked="${on}"><span class="tg-k" aria-hidden="true"></span>${label}</button>`;
  const toggles = `<div class="f-toggles">${sw('sound', 'Sound', !!s.sound)}${sw('motion', 'Motion', !reducedMotion())}${sw('tilt', 'Tilt', !!s.tilt)}</div>`;
  const note = '<p class="cn"><b>Content note:</b> horror, disappearance, body horror, flickering light.</p>';
  const justNow = back && Reader.sess.checkedInNow;
  const body = back
    ? `<h1>${justNow ? `Thanks${hasName() ? `, ${esc(NAME())}` : ''}.` : `Welcome back${hasName() ? `, ${esc(NAME())}` : ''}.`}</h1>
       <p class="sub">${justNow ? 'You’re number 07. Please wait to be served.' : 'You’re still number 07 in the queue.'}</p>
       <div class="printed">${ticketHTML(NAME(), new Date(Save.d.readStart || Date.now()).toLocaleString())}</div>
       ${toggles}${note}
       <div class="f-acts"><button type="button" class="take cont">${Save.d.lastPage > 1 ? `Continue — page ${Save.d.lastPage}` : 'Continue'}</button>${Save.d.lastPage > 1 ? '<button type="button" class="ghost restart">Start from page 1</button>' : ''}</div>`
    : `<h1>Welcome to Optus Redcliffe!</h1>
       <p class="sub">Pop your name in and we’ll be with you shortly.</p>
       <label class="f-name"><span>Your name <i>(optional)</i></span><input type="text" maxlength="16" autocomplete="off" spellcheck="false" placeholder="YOU" value="${esc(Save.d.name || '')}"></label>
       <div class="f-reason" role="radiogroup" aria-label="Reason for visit"><span class="lab">Reason for visit</span>
         ${REASONS.map((r, i) => `<button type="button" role="radio" aria-checked="${i === 0}" data-i="${i}">${r}</button>`).join('')}</div>
       ${toggles}${note}
       <button type="button" class="take">Take a ticket</button>
       <div class="tb-printer" aria-hidden="true"><div class="tb-slot"></div><div class="tb-paper"></div></div>`;
  el.innerHTML = `<div class="sheet checkin"><div class="tablet">
      <div class="tb-bar"><span class="tb-logo">optus</span><span class="tb-store">Redcliffe</span><span class="tb-clock"></span></div>
      <div class="tb-body">${body}</div>
      ${miniOllie()}
      <footer>An OG original.</footer>
    </div></div>`;
  const clock = $('.tb-clock', el);
  const tick = () => { clock.textContent = fmtClock(); };
  tick();
  const t = setInterval(tick, 1000);

  // reason chips: whatever you pick, the ticket prints SOS ONLY
  el.querySelectorAll('.f-reason button').forEach((b) => {
    b.onclick = () => { el.querySelectorAll('.f-reason button').forEach((x) => x.setAttribute('aria-checked', String(x === b))); };
  });
  el.querySelectorAll('.tg').forEach((b) => {
    b.onclick = async () => {
      const k = b.dataset.k, on = b.getAttribute('aria-checked') !== 'true';
      if (k === 'sound') { s.sound = on; if (on) Sound.unlock(); Sound.setEnabled(on); }
      if (k === 'motion') { s.motion = on ? 'on' : 'off'; applyMotion(); }
      if (k === 'tilt') { s.tilt = on ? await enableTilt() : false; }
      b.setAttribute('aria-checked', String(k === 'tilt' ? !!s.tilt : on));
      Save.write();
    };
  });
  const input = $('.f-name input', el);
  if (input) {
    input.addEventListener('input', () => { input.value = input.value.replace(/[<>]/g, '').slice(0, 16); });
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); $('.take', el).click(); } });
  }

  const take = $('.take', el);
  take.onclick = () => {
    if (back) { goLeaf(Math.max(1, Save.d.lastPage || 1)); return; }
    take.disabled = true;
    Save.d.name = input ? input.value.trim().slice(0, 16) : '';
    Save.d.checkedIn = true;
    Save.d.visits = 1;
    Save.d.readStart = Date.now();
    Save.d.firstOpened = Save.d.firstOpened || Date.now();
    Save.write();
    Reader.sess.checkedInNow = true;
    if (Save.d.settings.sound) Sound.unlock();
    Sound.sfx('print');
    const paper = $('.tb-paper', el);
    paper.innerHTML = ticketHTML(NAME(), fmtClock());
    paper.classList.add('printing');
    setTimeout(() => flyTicket(paper), reducedMotion() ? 300 : 1900);
  };
  const rs = $('.restart', el);
  if (rs) rs.onclick = () => goLeaf(1);
  return () => clearInterval(t);
}

// The printed ticket slides into the top-left corner and becomes the menu button.
function flyTicket(paper) {
  const tk = $('#ticket');
  tk.hidden = false;
  const a = paper.getBoundingClientRect(), b = tk.getBoundingClientRect();
  tk.hidden = true;
  const ghost = paper.cloneNode(true);
  ghost.className = 'tk-ghost';
  Object.assign(ghost.style, { left: `${a.left}px`, top: `${a.top}px`, width: `${a.width}px`, height: `${a.height}px` });
  document.body.append(ghost);
  paper.style.visibility = 'hidden';
  requestAnimationFrame(() => {
    ghost.style.transform = `translate(${b.left - a.left}px, ${b.top - a.top}px) scale(${b.width / a.width}, ${b.height / a.height}) rotate(-4deg)`;
    ghost.style.opacity = '0.2';
  });
  const done = () => {
    ghost.remove();
    tk.hidden = false;
    tk.classList.add('landed');
    setTimeout(() => tk.classList.remove('landed'), 900);
    if (Reader.mode === 'spread') {
      show();
      const r = Reader.leaves[1];
      if (r) {
        const sh = document.createElement('div');
        sh.className = 'shutter';
        r.el.append(sh);
        Sound.sfx('door');
        requestAnimationFrame(() => requestAnimationFrame(() => sh.classList.add('up')));
        setTimeout(() => sh.remove(), 1800);
      }
    } else goLeaf(1);
  };
  setTimeout(done, reducedMotion() ? 50 : 800);
}

function nudgeCheckin() {
  const b = $('.leaf-checkin .take');
  if (!b) { goLeaf(0); return; }
  b.classList.remove('nudge');
  void b.offsetWidth;
  b.classList.add('nudge');
  b.focus({ preventScroll: true });
}

function buildEnd(el) {
  const d = Save.d;
  if (!d.call1Start) { d.call1Start = d.readStart || Date.now(); Save.write(); }
  const since = new Date(d.firstOpened || Date.now()).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' });
  const found = d.olliesFound.length;
  el.innerHTML = `<div class="sheet endscreen"><div class="cs">
    <div class="cs-top"><span>Redcliffe Peninsula</span><span class="cs-sig"><i></i><i></i><i></i><i></i> SOS only</span></div>
    <div class="cs-calls">
      <div class="cs-call live"><div class="cs-av">2</div><div class="cs-col"><div class="cs-n">Call 2 — On hold</div><div class="cs-t" data-t="c2">00:00:00</div></div><div class="cs-pulse"></div></div>
      <div class="cs-call"><div class="cs-av">1</div><div class="cs-col"><div class="cs-n">Call 1 — On hold</div><div class="cs-t" data-t="c1">365d 00:00:00</div></div></div>
    </div>
    <p class="cs-msg">YOUR CALL IS IMPORTANT TO US.<br>PLEASE CONTINUE TO HOLD.</p>
    <div class="cs-svc"><b>Redcliffe Peninsula</b><br>Network: <span class="ok">●</span> Operational · 100% uptime since ${esc(since)}</div>
    <div class="cs-btns"><button type="button" class="cs-hang">H▒ng u░</button><button type="button" class="cs-again">Read again</button></div>
    <div class="cs-ollies">Ollies found: <b>${found}</b> / 26</div>
    <div class="cs-cred"><b>SOS ONLY</b> · An OG original<br>Content note: horror, disappearance, body horror, flickering light.<br>Your call is important to us.</div>
    <a class="cs-og" href="${OG_URL}">Back to The OG</a>
  </div></div>`;
  const c1 = $('[data-t=c1]', el), c2 = $('[data-t=c2]', el);
  const tick = () => {
    const now = Date.now();
    c2.textContent = fmtDur(now - (d.readStart || now));
    c1.textContent = fmtDur(YEAR_MS + (now - (d.call1Start || now)), true);
  };
  tick();
  const t = setInterval(tick, 1000);
  // there's always one more than you count
  const ob = $('.cs-ollies b', el);
  const t2 = setTimeout(() => { ob.textContent = String(found + 1); ob.parentElement.classList.add('ticked'); }, 4500);
  const hang = $('.cs-hang', el);
  let presses = 0;
  hang.onclick = () => {
    presses++;
    if (presses === 1) { hang.textContent = 'Jarrad tried that.'; hang.classList.add('clean'); }
    else goLeaf(0);
  };
  $('.cs-again', el).onclick = () => goLeaf(1);
  return () => { clearInterval(t); clearTimeout(t2); };
}
