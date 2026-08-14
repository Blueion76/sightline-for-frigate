import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=relative=>fs.readFileSync(path.join(root,relative),'utf8');
const ux=read('src/card/multiview/media-browser.js');
const layout=read('src/card/ui/playback-layout.js');

assert.match(ux,/isClipBrowser[\s\S]*?_mediaQueryBounds\(now\)/,'Multiview Clips must use the media-browser time range for every camera');
assert.match(ux,/if\(isClipBrowser\)request\.has_clip=true/,'Multiview Clips background queries must request retained clips');
assert.match(ux,/if\(isClipBrowser&&this\._galleryMode==='clips'\)this\._renderGallery\(\)/,'All-camera clip loading must refresh the Clips gallery');
assert.match(ux,/for\(const config of \(this\._config\?\.cameras\|\|\[\]\)\)/,'Multiview camera filters must be seeded from every configured camera');
assert.match(ux,/await this\._loadAllCamsBackground\(\)/,'Opening Multiview Clips must wait for the aggregate camera load before final paint');

assert.match(layout,/grid-template-columns/,'Desktop grid clip playback must override the responsive workstation columns');
assert.match(layout,/setProperty\('display','none','important'\)/,'Desktop grid clip playback must hide secondary panes with important priority');
assert.match(layout,/playback-fullcard/,'Full-card recorded playback must have an explicit state marker');
assert.match(layout,/min-height/,'Playback return button should use compact sizing');
assert.match(layout,/min-height:30px/,'Playback return button should be reduced from the v1.1.0 size');

console.log('Media browser and desktop playback regression test passed.');
