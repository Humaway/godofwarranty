/* SOS ONLY — start. */
addEventListener('pointerdown', () => { if (Save.d.settings.sound) Sound.unlock(); }, { once: true, capture: true });
// ?p=N opens straight on a leaf (handy for links to a page); ?debug also exposes the kit for testing.
const _jump = /[?&]p=(\d+)/.exec(location.search);
if (DEBUG) window.__sos = { fig, customer, queueLine, ollie, blockFace, makePG, PAGES, Reader, Save, show, goLeaf, setMode, C, R, E, Ci, Pa, Tx, Ln, G, st, rainFx, storeFront, displayWall, phoneObj, ticketProp, rotPatch, rotLine };
boot().then(() => { if (_jump && Save.d.checkedIn) goLeaf(clamp(+_jump[1], 0, LAST), { turn: false }); }).catch((e) => console.error(e));
