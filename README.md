# God of Warranty — Demo, Part One: *The Ward Falls*

A story-first, one-take action parody (God of War, 2018 × an Optus store), built as **one self-contained HTML file**:

- **Play:** open [`games/god-of-warranty.html`](games/god-of-warranty.html) in a desktop or mobile browser with WebGL 2.
  It loads Three.js r170 from `cdn.jsdelivr.net` and the Cinzel/Barlow fonts from Google Fonts, so it needs a connection. Everything else (models, textures, music, voices, SFX) is generated at runtime.
- **Design document:** [`docs/god-of-warranty-demo-design.md`](docs/god-of-warranty-demo-design.md)
- **Thumbnail:** [`thumbnails/god-of-warranty.png`](thumbnails/god-of-warranty.png)

## Controls

| Action | Keyboard & mouse | Gamepad |
|---|---|---|
| Move / camera | WASD / mouse | Left stick / right stick |
| Light attack · throw (while aiming) | Left click | RB |
| Heavy attack (hold to charge) | E | RT |
| Aim | Right click | LT |
| Call the axe back | R | Y |
| Shield (tap at the right moment to Price Match) | Q | LB |
| Dodge (double tap to roll) | Space | A |
| Sprint | Left Shift | L3 |
| Command Chase | F | X |
| Close the Deal (finisher) | V | R3 |
| End-of-Month Rage | Z | L3 + R3 |
| Runic Promos | 1 / 2 | LB + RB / LB + RT |
| Pause · hold to skip a cinematic | Esc | Menu |

Click the game to capture the mouse (Esc releases it and pauses). On-screen touch controls appear only when you're actually using touch — on phones and tablets, or after touching the screen of a touch laptop; moving the mouse or pressing a key switches back. Every key can be rebound under **Settings → Controls**. Settings also cover difficulty, graphics quality, subtitles (size, background, speaker names), camera shake and handheld sway, depth of field, film grain, chromatic aberration, motion blur, field of view, aim assist, hold-vs-toggle for aim and shield, colour-blind palettes, slower enemy tells, and audio mix.

Progress is saved at each checkpoint in `localStorage`; **Continue** on the title screen resumes from the last one.

## Building

The HTML file is generated from the sources in `src/god-of-warranty/`:

```sh
node tools/build-god-of-warranty.mjs            # writes games/god-of-warranty.html
node tools/build-god-of-warranty.mjs --js out.mjs   # also dumps the bundled module (for linting)
```

`shell.html` holds the markup, styles and import map; the numbered `NN-*.js` parts are concatenated, in order, into the page's single module script.

## Debugging

URL parameters (e.g. `games/god-of-warranty.html?debug=1&cp=kiosk`):

| Param | Effect |
|---|---|
| `debug=1` | FPS / draw-call overlay |
| `cp=<checkpoint>` | start at a checkpoint: `grove`, `carry`, `pyre_start`, `pyre_embers`, `ward_falls`, `kiosk`, `zee`, `path`, `queue`, `hamarr`, `walk_home`, `knock`, `end` |
| `q=<quality>` | `mobile`, `balanced`, `high`, `ultra` |
| `ff=<n>` | run the game clock *n*× faster |
| `begin=1` | skip the title screen |
| `autoplay=1` | autopilot through the demo (god mode) — used for automated testing |

## Hub card

```js
{
  title: 'God of Warranty',
  description: 'A 2IC, a casual, and a satchel of ashes. One unbroken take. (Demo)',
  image: 'thumbnails/god-of-warranty.png',
  url: 'games/god-of-warranty.html'
}
```

*God of Warranty* is a parody. It is not affiliated with, endorsed by, or sponsored by Optus, Sony Interactive Entertainment or Santa Monica Studio.
