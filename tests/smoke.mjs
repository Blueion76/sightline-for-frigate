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
card.setConfig({ cameras:[{entity:'camera.test'}], default_tab:'reviews', hidden_tabs:['recordings','live'] });
assert.deepEqual([...card._config.hidden_tabs], ['recordings','live'], 'Live can be hidden');
assert.equal(card._config.default_tab, 'reviews');
assert.equal(card._liveTabHidden(), true);
card.setConfig({ cameras:[{entity:'camera.test'}], hidden_tabs:['live'] });
assert.equal(card._config.default_tab, 'clips', 'hidden Live startup must fall back to the first visible tab');
card.setConfig({ cameras:[{entity:'camera.test'}], default_tab:'live', hidden_tabs:['live','clips'] });
assert.equal(card._config.default_tab, 'recordings');
card.setConfig({ cameras:[{entity:'camera.test'}], hidden_tabs:['live','clips','recordings','reviews','bogus'] });
assert.deepEqual([...card._config.hidden_tabs], ['clips','recordings','reviews'], 'hiding every tab must keep Live visible');
assert.equal(card._config.default_tab, 'live');

const home = new Card();
home._renderShell = () => {};
home._setupMicrophoneDetection = () => {};
home.setConfig({ cameras:[{entity:'camera.test'}], default_tab:'reviews', hidden_tabs:['live','recordings'] });
const homeCalls = [];
home._showLive = () => homeCalls.push('live');
home._setGalleryMode = (tab) => homeCalls.push(tab);
home._galleryMode = 'clips';
home._returnHome();
home._galleryMode = '';
home._returnHome();
home._returnHome('recordings');
assert.deepEqual(homeCalls, ['clips','reviews','reviews'], 'with Live hidden, returning home must land on a visible gallery tab');
home._galleryMode = 'clips';
assert.equal(home._homeTabLabel(), 'Clips');
home.setConfig({ cameras:[{entity:'camera.test'}] });
homeCalls.length = 0;
home._returnHome();
assert.deepEqual(homeCalls, ['live'], 'with Live visible, returning home must show Live');
assert.equal(home._homeTabLabel(), 'Live');

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

const latest = new Card();
latest._config = { default_tab:'reviews', hidden_tabs:['live','recordings'] };
latest._eventsMode = 'camera';
latest._viewMode = 'single';
latest._reviews = [{id:'r1',start_time:1000,data:{detections:['e1']}},{id:'r3',start_time:3000,data:{detections:['e3']}},{id:'r2',start_time:2000,data:{detections:['e2']}}];
latest._events = [{id:'c1',start_time:500,has_clip:true},{id:'c2',start_time:4000,has_clip:false},{id:'c3',start_time:2500,has_clip:true}];
latest._winStart = 10000; latest._winEnd = 10600; latest._timelineFollowingLive = true;
for (const m of ['_renderTimeline','_renderRange','_renderTimelineZoomLabel','_updateTimelineDateLabel','_scheduleTimelineDataLoad']) latest[m] = () => {};
latest._filterMediaReviews = (r) => r;
latest._filterMediaEvents = (e) => e;
const opened = [];
latest._showClipById = (id, opts) => opened.push(['review', id, opts]);
latest._showClip = (ev, opts) => opened.push(['clip', ev.id, opts]);
assert.equal(latest._shouldShowHomeMedia('reviews'), true);
assert.equal(latest._shouldShowHomeMedia('recordings'), false, 'Recordings have no home item');
latest._showHomeMedia('reviews');
assert.equal(latest._timelineFocusTs, 3000, 'home item focuses the newest review');
assert.equal(latest._timelineFollowingLive, false, 'home item leaves LIVE-follow mode');
assert.equal(latest._winEnd - latest._winStart, 600, 'home item keeps the zoom span');
assert.equal(latest._winStart, 2700);
assert.deepEqual(JSON.parse(JSON.stringify(opened.pop())), ['review','e3',{autoplay:false,home:true}], 'newest review opens paused as the home item');
latest._showHomeMedia('clips');
assert.equal(latest._timelineFocusTs, 2500, 'Clips home item is the newest retained clip');
assert.equal(latest._timelineSelected, 'c3');
assert.deepEqual(JSON.parse(JSON.stringify(opened.pop())), ['clip','c3',{autoplay:false,home:true}]);
const goNowOpened = opened.length;
latest._galleryMode = 'reviews';
latest._renderStreamCtrl = () => {};
latest._resetTimelineToNow10m = () => { throw new Error('Jump to latest must not reset the timeline to now'); };
latest._goNow();
assert.equal(opened.length, goNowOpened + 1, 'with Live hidden, Jump to now opens the newest item');
assert.equal(opened.at(-1)[1], 'e3');
assert.equal(latest._timelineFocusTs, 3000, 'with Live hidden, Jump to now focuses the newest review');

latest._viewMode = 'grid';
assert.equal(latest._shouldShowHomeMedia('reviews'), false, 'Multiview keeps its live grid');
latest._viewMode = 'single';
latest._config = { default_tab:'reviews', hidden_tabs:['recordings'] };
assert.equal(latest._shouldShowHomeMedia('reviews'), false, 'with Live visible there is no home item');
latest._config = { default_tab:'reviews', hidden_tabs:['live','recordings'] };
latest._reviews = [];
assert.equal(latest._showHomeMedia('reviews'), null, 'no reviews leaves the player alone');

console.log('Smoke test passed.');
