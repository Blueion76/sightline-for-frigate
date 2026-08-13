import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const bundle = fs.readFileSync(path.join(root, 'dist', 'sightline-for-frigate.js'), 'utf8');

class FakeHTMLElement { attachShadow() { return {}; } }
const registry = new Map();
const context = {
  HTMLElement: FakeHTMLElement,
  customElements: { get: (name) => registry.get(name), define: (name, ctor) => registry.set(name, ctor) },
  window: { customCards: [] },
  console: { info() {}, log() {}, warn() {}, error() {} },
  Map, Set, Date, Intl, URL, URLSearchParams, AbortController,
  CustomEvent: class {}, navigator: {}, document: { createElement: () => ({}) },
  setTimeout, clearTimeout, setInterval, clearInterval,
  requestAnimationFrame: (cb) => setTimeout(cb, 0), cancelAnimationFrame: clearTimeout
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
assert.equal(typeof card._applyInitialMediaState, 'function');
assert.equal(typeof card._setGalleryMode, 'function');
assert.equal(typeof card._openInGridSlot, 'function');

card._renderShell = () => {};
card._setupMicrophoneDetection = () => {};
card.setConfig({ cameras:[{entity:'camera.test'}], default_tab:'clips', autoplay_latest_clip:true, timeline:{thumbnail_size:64} });
assert.equal(card._config.default_tab, 'clips');
assert.equal(card._config.autoplay_latest_clip, true);
assert.equal(card._config.timeline.thumbnail_size, 64);
card.setConfig({ cameras:[{entity:'camera.test'}], default_tab:'clips', hidden_tabs:['clips'] });
assert.equal(card._config.default_tab, 'live', 'hidden startup tab must fall back to Live');

const startup = new Card();
startup._config = { default_tab:'clips', autoplay_latest_clip:true };
startup._eventsMode = 'camera';
startup._events = [
  {id:'old',has_clip:true,start_time:100},
  {id:'snapshot-only',has_clip:false,start_time:300},
  {id:'new',has_clip:true,start_time:200}
];
startup._setGalleryMode = async (tab) => { startup._galleryMode=tab; startup._tab=tab; };
startup._filterMediaEvents = (events) => events;
startup._showClip = async (ev) => { startup._autoplayed=ev.id; };
await startup._applyInitialMediaState();
assert.equal(startup._autoplayed, 'new');
startup._autoplayed='unchanged';
await startup._applyInitialMediaState();
assert.equal(startup._autoplayed, 'unchanged', 'startup state must not replay twice');

console.log('Smoke test passed.');
