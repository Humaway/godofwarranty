#!/usr/bin/env node
// Builds games/god-of-warranty.html from src/god-of-warranty/.
// The shell holds the markup and styles; every NN-*.js part is concatenated, in order,
// into the single inline module script. Usage: node tools/build-god-of-warranty.mjs [--artifact out.html]
import { readFileSync, writeFileSync, readdirSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const srcDir = join(root, 'src', 'god-of-warranty');
const shell = readFileSync(join(srcDir, 'shell.html'), 'utf8');
const parts = readdirSync(srcDir).filter(f => /^\d\d-.*\.js$/.test(f)).sort();
const js = parts.map(f => `// ===== ${f} =====\n` + readFileSync(join(srcDir, f), 'utf8')).join('\n');

const pick = (tag) => {
  const m = shell.match(new RegExp(`<!--${tag}-->([\\s\\S]*?)<!--/${tag}-->`));
  if (!m) throw new Error('shell is missing the ' + tag + ' block');
  return m[1].trim();
};
const head = pick('HEAD');
const body = pick('BODY').replace('/*@@JS@@*/', () => js);

// Shown only if the module never starts (e.g. Three.js could not be fetched).
const watchdog = `<script>
setTimeout(function(){ if (!window.__GOW_BOOTED) { var e=document.getElementById('bootErr'); if(e) e.textContent='The game could not start. It loads Three.js from cdn.jsdelivr.net, so it needs an internet connection and a browser with WebGL 2.'; } }, 12000);
</script>`;

const full = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
${head}
</head>
<body>
${body}
${watchdog}
</body>
</html>
`;
mkdirSync(join(root, 'games'), { recursive: true });
writeFileSync(join(root, 'games', 'god-of-warranty.html'), full);
console.log(`games/god-of-warranty.html  ${(full.length / 1024).toFixed(1)} KB  (${parts.length} parts)`);

const ai = process.argv.indexOf('--artifact');
if (ai > 0) {
  // Artifact hosting wraps the page in its own doctype/head/body skeleton.
  const art = `${head}\n${body}\n${watchdog}\n`;
  writeFileSync(process.argv[ai + 1], art);
  console.log(`artifact page -> ${process.argv[ai + 1]}`);
}
const jsOut = process.argv.indexOf('--js');
if (jsOut > 0) writeFileSync(process.argv[jsOut + 1], js);
