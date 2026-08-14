import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { BUNDLE_MODULES } from '../scripts/build-manifest.mjs';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=(relative)=>fs.readFileSync(path.join(root,relative),'utf8');

// Composition roots should be declarative. Runtime modules must not patch card
// prototypes after import, because override chains are difficult to reason about
// and previously caused click handlers to bypass legend filtering.
for(const relative of ['src/card/SightlineCard.js','src/editor/SightlineCardEditor.js']) {
  const source=read(relative);
  assert.equal(/\.prototype\._\w+\s*=/.test(source),false,`${relative} must not install post-composition prototype patches`);
}

assert.equal(fs.existsSync(path.join(root,'src/card/v115.js')),false,'version-specific runtime patch module should be removed');
assert.equal(fs.existsSync(path.join(root,'src/card/multi-recording-init.js')),false,'side-effect Multiview initializer should be removed');

// Every runtime source module belongs to the explicit HACS build manifest. This
// catches accidental source files that work in ESM tests but never reach HACS.
const runtimeFiles=[];
const walk=(dir)=>{
  for(const entry of fs.readdirSync(dir,{withFileTypes:true})) {
    const full=path.join(dir,entry.name);
    if(entry.isDirectory()) walk(full);
    else if(entry.name.endsWith('.js')) runtimeFiles.push(path.relative(root,full).replaceAll('\\','/'));
  }
};
walk(path.join(root,'src'));
for(const relative of runtimeFiles) {
  assert.ok(BUNDLE_MODULES.includes(relative),`Build manifest is missing runtime module: ${relative}`);
}
assert.equal(new Set(BUNDLE_MODULES).size,BUNDLE_MODULES.length,'Build manifest must not contain duplicate modules');


// Composition order is behavioral: specialized method groups must own their
// intentional overrides after the base implementations are installed.
{
  const oldHTMLElement=globalThis.HTMLElement;
  globalThis.HTMLElement=class { attachShadow(){ this.shadowRoot={}; } };
  const [{ SightlineCard },{ playbackLayoutMethods },{ multiviewTimelineMethods },{ timelineZoomMethods }]=await Promise.all([
    import('../src/card/SightlineCard.js'),
    import('../src/card/ui/playback-layout.js'),
    import('../src/card/multiview/timeline-ui.js'),
    import('../src/card/timeline/zoom.js'),
  ]);
  assert.equal(SightlineCard.prototype._enter,playbackLayoutMethods._enter,'playback layout must own playback entry presentation');
  assert.equal(SightlineCard.prototype._showLive,playbackLayoutMethods._showLive,'playback layout must own workspace restoration');
  assert.equal(SightlineCard.prototype._click,multiviewTimelineMethods._click,'Multiview timeline handler must preserve legend filtering');
  assert.equal(SightlineCard.prototype._zoomTimeline,timelineZoomMethods._zoomTimeline,'timeline zoom must use the discrete scale implementation');
  if(oldHTMLElement===undefined) delete globalThis.HTMLElement;
  else globalThis.HTMLElement=oldHTMLElement;
}


// Returning from full-card media playback must restore the timeline gesture
// lifecycle after the Multiview workspace has been put back in place.
{
  const source=read('src/card/ui/playback-layout.js');
  assert.match(source,/returningFromPlayback/);
  assert.ok(source.includes('this._refreshTimelineInteractionWiring?.(true);'));
}

console.log('Source architecture regression test passed.');
