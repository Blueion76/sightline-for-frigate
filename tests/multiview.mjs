import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { liveViewMethods } from '../src/card/live/view.js';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=relative=>fs.readFileSync(path.join(root,relative),'utf8');
const controller=read('src/card/multiview/controller.js');
const core=read('src/card/multiview/core.js');
const ux=read('src/card/multiview/timeline-ui.js');

assert.match(controller,/_showMultiRecording\(/,'Multiview recording playback method must exist');
assert.match(controller,/_viewMode==='grid'/,'Grid timeline seeks must use Multiview playback');
assert.match(core,/15\*60/,'Multiview playback should use bounded recording windows');
assert.match(core,/No recording/,'Per-camera recording gaps must remain visible');
assert.match(ux,/data-legend-label/,'Timeline detection legend must expose clickable filter controls');
assert.match(ux,/_filterLabel===label\?'all':label/,'Clicking an active legend filter must clear it');
assert.match(ux,/_timelineTime\(ts\)/,'Download START and END labels must use second-precision timeline time');
assert.match(ux,/_enterDownloadRangePicker/,'Initial download-range render must refresh precision labels');


// Leaving Multiview through a camera tab must not start two competing live
// engine mounts. The selected camera becomes active before presentation leaves
// the grid, _setViewMode is told not to mount, and _switchCamera performs the
// one authoritative mount for that selected camera.
{
  const calls=[];
  const cameras=[{entity:'camera.one'},{entity:'camera.two'}];
  const ctx={
    _activeCamIdx:0,
    _viewMode:'grid',
    _downloadRange:{start:1,end:2},
    _config:{cameras},
    _camCache:{
      'camera.one':{discovered:true},
      'camera.two':{discovered:true,events:[],recordings:[],recordingsLoaded:false,reviews:[],kept:[]},
    },
    _events:[],_recordings:[],_recordingsLoaded:false,
    _recordingsRangeStart:null,_recordingsRangeEnd:null,_recordingsLoadedAt:0,
    _reviews:[],_kept:[],
    _stopTalk(){},
    _setViewMode(mode,options){calls.push({kind:'view',mode,options,idx:this._activeCamIdx});this._viewMode=mode;},
    async _discoverOne(){},
    _applyCardStyle(){},_loadFrigateFilterMetadata(){},_renderCamSwitcher(){},_syncStatus(){},
    async _mountEngine(){calls.push({kind:'mount',idx:this._activeCamIdx});},
    _renderAll(){},async _loadWindow(){},
  };
  Object.defineProperty(ctx,'_activeCam',{get(){return cameras[this._activeCamIdx];}});
  await liveViewMethods._switchCamera.call(ctx,1);
  assert.deepEqual(calls.filter(x=>x.kind==='view'),[
    {kind:'view',mode:'single',options:{mountEngine:false},idx:1},
  ],'single-view presentation must switch only after the selected camera is active');
  assert.deepEqual(calls.filter(x=>x.kind==='mount'),[
    {kind:'mount',idx:1},
  ],'Multiview camera-tab handoff must mount the selected camera exactly once');
}

assert.match(read('src/card/live/view.js'),/_setViewMode\(mode, options=\{\}\)/,'Live view mode must support presentation-only transitions');
assert.match(controller,/liveMethods\._setViewMode\.call\(this,mode,options\)/,'Multiview wrapper must forward view-mode options');

console.log('Multiview and timeline UX smoke test passed.');
