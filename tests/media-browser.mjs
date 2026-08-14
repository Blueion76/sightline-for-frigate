import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { mediaNavigationMethods } from '../src/card/media/navigation.js';
import { isMultiviewPlaybackContext } from '../src/card/ui/playback-layout.js';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=relative=>fs.readFileSync(path.join(root,relative),'utf8');
const ux=read('src/card/multiview/media-browser.js');
const layout=read('src/card/ui/playback-layout.js');
const controller=read('src/card/playback/event-controller.js');

assert.match(ux,/isClipBrowser[\s\S]*?_mediaQueryBounds\(now\)/,'Multiview Clips must use the media-browser time range for every camera');
assert.match(ux,/if\(isClipBrowser\)request\.has_clip=true/,'Multiview Clips background queries must request retained clips');
assert.match(ux,/if\(isClipBrowser&&this\._galleryMode==='clips'\)this\._renderGallery\(\)/,'All-camera clip loading must refresh the Clips gallery');
assert.match(ux,/for\(const config of \(this\._config\?\.cameras\|\|\[\]\)\)/,'Multiview camera filters must be seeded from every configured camera');
assert.match(ux,/await this\._loadAllCamsBackground\(\)/,'Opening Multiview Clips must wait for the aggregate camera load before final paint');

assert.match(layout,/grid-template-columns/,'Desktop grid clip playback must override the responsive workstation columns');
assert.match(layout,/setProperty\('display','none','important'\)/,'Desktop grid clip playback must hide secondary panes with important priority');
assert.match(layout,/playback-fullcard/,'Full-card recorded playback must have an explicit state marker');
assert.match(layout,/playbackColumnHeight/,'Full-card playback must save and clear the synchronized Multiview column height');
assert.match(layout,/setProperty\('display','block','important'\)/,'Full-card playback must collapse the workstation CSS grid to one block-level feed');
assert.match(layout,/camSwitcher/,'Full-card playback must hide and restore the unused Multiview camera switcher');
assert.match(layout,/min-height/,'Playback return button should use compact sizing');
assert.match(layout,/min-height:30px/,'Playback return button should be reduced from the v1.1.0 size');

// A clip selected from the media browser must always use workspace-level
// playback. Multiview is restored by the playback-return policy; the selected
// camera tile is never used as the clip's playback target.
{
  let opened=null;
  let gridOpened=null;
  const card={dataset:{ev:'clip-event-1'}};
  const target={closest(selector){return selector==='[data-ev]'?card:null;}};
  const ctx={
    _viewMode:'grid',
    _open:id=>{opened=id;},
    _openInGridSlot:id=>{gridOpened=id;}
  };
  mediaNavigationMethods._click.call(ctx,{target,stopPropagation(){}});
  assert.equal(opened,'clip-event-1','Multiview Clips must open in the full playback workspace');
  assert.equal(gridOpened,null,'Multiview Clips must not replace only the matching camera tile');
}

assert.match(controller,/if\(ev\.has_clip\) return this\._showClip\(ev\)/,'Timeline event clips must use the same full playback pipeline');
// Wide workstation reconciliation can leave the state flag stale while the
// Multiview grid is still visibly mounted beside the Clips browser. Playback
// must follow the visible player, not only `_viewMode`.
{
  const grid={style:{display:''},children:[{}],querySelector:()=>({})};
  const cardNode={classList:{contains:()=>false}};
  const ctx={_viewMode:'single'};
  assert.equal(isMultiviewPlaybackContext(ctx,{card:cardNode,grid}),true,'visible mounted Multiview must trigger full-player playback even with stale view state');

  grid.style.display='none';
  assert.equal(isMultiviewPlaybackContext(ctx,{card:cardNode,grid}),false,'a hidden stale grid must not force Multiview playback');
}

assert.match(layout,/isMultiviewPlaybackContext\(this,workspace\)/,'Full playback must derive its return target from the rendered Multiview context');

console.log('Media browser and desktop playback regression test passed.');
