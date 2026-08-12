import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist', 'sightline-for-frigate.js');
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const hacs = JSON.parse(fs.readFileSync(path.join(root, 'hacs.json'), 'utf8'));
const constants = fs.readFileSync(path.join(root, 'src/constants.js'), 'utf8');

if (!fs.existsSync(dist)) throw new Error('dist/sightline-for-frigate.js is missing; run npm run build');
if (hacs.filename !== 'sightline-for-frigate.js') throw new Error('hacs.json filename must match the built card');
if (!hacs.name) throw new Error('hacs.json requires a name');
if (pkg.name !== 'sightline-for-frigate') throw new Error('package.json name must remain sightline-for-frigate');
if (hacs.name !== 'Sightline for Frigate') throw new Error('hacs.json name must remain Sightline for Frigate');
if (hacs.filename !== `${pkg.name}.js`) throw new Error('HACS plugin filename must match the repository/package name');

const version = constants.match(/VERSION\s*=\s*['\"]([^'\"]+)['\"]/)?.[1];
if (version !== pkg.version) throw new Error(`Version mismatch: package=${pkg.version}, source=${version}`);

const bundle = fs.readFileSync(dist, 'utf8');
for (const required of [
  "const CARD_TAG = 'sightline-card'",
  'class SightlineCard extends HTMLElement',
  'class SightlineCardEditor extends HTMLElement',
  "customElements.define(CARD_TAG, SightlineCard)"
]) {
  if (!bundle.includes(required)) throw new Error(`Built bundle is missing expected marker: ${required}`);
}

for (const file of fs.readdirSync(path.join(root, 'dist'))) {
  if (file !== 'sightline-for-frigate.js') {
    throw new Error(`Unexpected HACS dist artifact: dist/${file}`);
  }
}

const sourceFiles = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.endsWith('.js')) sourceFiles.push(full);
  }
}
walk(path.join(root, 'src'));
for (const file of sourceFiles) execFileSync(process.execPath, ['--check', file], { stdio: 'inherit' });
execFileSync(process.execPath, ['--check', dist], { stdio: 'inherit' });
console.log(`Validated ${sourceFiles.length} source modules and HACS dist bundle.`);
