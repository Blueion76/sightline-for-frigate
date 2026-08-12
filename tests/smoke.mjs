import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const bundle = fs.readFileSync(path.join(root, 'dist', 'sightline-for-frigate.js'), 'utf8');

class FakeHTMLElement {
  attachShadow() { return {}; }
}
const registry = new Map();
const context = {
  HTMLElement: FakeHTMLElement,
  customElements: {
    get: (name) => registry.get(name),
    define: (name, ctor) => registry.set(name, ctor)
  },
  window: { customCards: [] },
  console: { info() {}, log() {}, warn() {}, error() {} },
  Map,
  Set,
  Date,
  Intl,
  URL,
  URLSearchParams,
  AbortController,
  CustomEvent: class {},
  navigator: {},
  document: { createElement: () => ({}) },
  setTimeout,
  clearTimeout,
  setInterval,
  clearInterval,
  requestAnimationFrame: (cb) => setTimeout(cb, 0),
  cancelAnimationFrame: clearTimeout
};
context.window.window = context.window;
vm.createContext(context);
vm.runInContext(bundle, context, { filename: 'sightline-for-frigate.js' });

assert.ok(registry.has('sightline-card'), 'card custom element was not registered');
assert.ok(registry.has('sightline-card-editor'), 'editor custom element was not registered');
assert.equal(context.window.customCards.length, 1);
assert.equal(context.window.customCards[0].type, 'sightline-card');

const Card = registry.get('sightline-card');
const card = new Card();
assert.equal(typeof card.setConfig, 'function');
assert.equal(typeof card._renderTimeline, 'function');
assert.equal(typeof card._showRecording, 'function');
assert.equal(typeof card._enterDownloadRangePicker, 'function');
console.log('Smoke test passed.');
