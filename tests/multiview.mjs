import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=relative=>fs.readFileSync(path.join(root,relative),'utf8');
const controller=read('src/card/multi-recording-controller.js');
const core=read('src/card/multi-recording-core.js');
const ux=read('src/card/multi-recording.js');

assert.match(controller,/_showMultiRecording\(/,'Multiview recording playback method must exist');
assert.match(controller,/_viewMode==='grid'/,'Grid timeline seeks must use Multiview playback');
assert.match(core,/15\*60/,'Multiview playback should use bounded recording windows');
assert.match(core,/No recording/,'Per-camera recording gaps must remain visible');
assert.match(ux,/data-legend-label/,'Timeline detection legend must expose clickable filter controls');
assert.match(ux,/_filterLabel===label\?'all':label/,'Clicking an active legend filter must clear it');
assert.match(ux,/_timelineTime\(ts\)/,'Download START and END labels must use second-precision timeline time');
assert.match(ux,/_enterDownloadRangePicker/,'Initial download-range render must refresh precision labels');

console.log('Multiview and timeline UX smoke test passed.');
