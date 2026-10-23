# SOS ONLY — web comic

An Optus Redcliffe horror comic. *Your call is important to us.*

`sos-only.html` is the whole comic: one self-contained file, every page drawn as inline SVG, all sound synthesised with Web Audio. Open it in a browser (tilt only works over https or localhost).

## Editing

The file is built from `src/`:

| File | What's in it |
|---|---|
| `shell.html`, `style.css` | Page skeleton and styles |
| `00-core.js` | Helpers, palette, seeded randomness, saved data, page registry |
| `10-art.js` | Shared SVG defs, panels, balloons, captions, SFX, Code Rot |
| `20-figures.js` | Character kit, the Customers, the Ollie standee, the reader's silhouette |
| `30-env.js` | Environment kit: rain, lightning, the store, Cafe 63, stockroom, devices |
| `40-…`–`52-…` | The pages, one `page(n, {...})` each |
| `70-audio.js` | Synthesised sound and haptics |
| `80-reader.js` | Layout modes, guided view, controls, menu, transcript, triggers |
| `85-screens.js` | Check-in tablet and end screen |

Rebuild after editing:

```sh
node webcomic/build.mjs
```

Add `?debug` to the URL for the viewport/mode overlay, and `?p=N` to open on a page once checked in (0 = check-in, 1–26 = story, 27 = end screen).
