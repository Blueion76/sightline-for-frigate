import assert from 'node:assert/strict';
import fs from 'node:fs';

const ux=fs.readFileSync(new URL('../src/card/multi-recording.js',import.meta.url),'utf8');

assert.ok(ux.includes('_timelineConfiguredPreviewHeight'),'Configured thumbnail height must drive timeline geometry');
assert.ok(ux.includes('preview.style.top'),'Timeline preview top must be recalculated from its event timestamp');
assert.ok(ux.includes('center-h/2'),'Timeline preview must be centered on the detection timestamp');
assert.ok(ux.includes('_downloadRangeTimestampAtClientY'),'Trim drag must use the inverse timeline coordinate mapping');
assert.ok(ux.includes('_wireDedicatedDownloadRangeDrag'),'Trim picker must have a dedicated gesture path');
assert.ok(ux.includes('setPointerCapture'),'Trim picker must use pointer capture');
assert.ok(ux.includes("addEventListener('touchstart'"),'Trim picker must include an iOS touch fallback');
assert.ok(ux.includes("addEventListener('touchmove'"),'Trim picker touch drag must update continuously');

console.log('Timeline UX smoke test passed.');
