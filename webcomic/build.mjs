// Builds the single-file comic: webcomic/sos-only.html
// Usage: node webcomic/build.mjs
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const src = join(here, 'src');
// optional: --out <file> to write elsewhere, --exclude a.js,b.js to leave files out (for working on pages in parallel)
const argv = process.argv.slice(2);
const opt = (k) => { const i = argv.indexOf(k); return i < 0 ? null : argv[i + 1]; };
const exclude = (opt('--exclude') || '').split(',').filter(Boolean);

const shell = readFileSync(join(src, 'shell.html'), 'utf8');
const css = readFileSync(join(src, 'style.css'), 'utf8');
const js = readdirSync(src)
  .filter((f) => f.endsWith('.js') && !exclude.includes(f))
  .sort()
  .map((f) => `/* ---- ${f} ---- */\n` + readFileSync(join(src, f), 'utf8'))
  .join('\n');

if (/<\/script/i.test(js)) throw new Error('A source file contains "</script" — it would end the inline script early.');

const html = shell
  .replace('/*STYLE*/', () => css)
  .replace('/*SCRIPT*/', () => `(() => {\n'use strict';\n${js}\n})();`);

const out = opt('--out') || join(here, 'sos-only.html');
writeFileSync(out, html);
console.log(`Wrote ${out} (${(html.length / 1024).toFixed(1)} KB)`);
