import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { BUNDLE_MODULES } from './build-manifest.mjs';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'dist', 'sightline-for-frigate.js');


function flattenModule(code, filename) {
  const strippedImports = code.replace(/^import\s+[^\n]+;\s*\n/gm, '');
  const strippedExports = strippedImports.replace(/^export\s+(?=(?:const|let|var|function|class)\b)/gm, '');
  if (/^\s*(?:import|export)\s/m.test(strippedExports)) throw new Error(`Unsupported module syntax remains in ${filename}`);
  return `\n// ── ${filename} ──\n${strippedExports.trim()}\n`;
}

const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const constants = fs.readFileSync(path.join(root, 'src/constants.js'), 'utf8');
const versionMatch = constants.match(/VERSION\s*=\s*['\"]([^'\"]+)['\"]/);
if (!versionMatch || versionMatch[1] !== pkg.version) throw new Error(`package.json version (${pkg.version}) must match src/constants.js VERSION (${versionMatch?.[1] ?? 'missing'})`);

const banner = `// Sightline for Frigate v${pkg.version}\n// Generated from src/ by scripts/build.mjs. Do not edit dist directly.\n`;
let bundle = banner;
for (const relative of BUNDLE_MODULES) {
  const full = path.join(root, relative);
  if (!fs.existsSync(full)) throw new Error(`Missing source module: ${relative}`);
  bundle += flattenModule(fs.readFileSync(full, 'utf8'), relative);
}

fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, bundle);
execFileSync(process.execPath, ['--check', output], { stdio: 'inherit' });
console.log(`Built ${path.relative(root, output)} (${Buffer.byteLength(bundle).toLocaleString()} bytes)`);
