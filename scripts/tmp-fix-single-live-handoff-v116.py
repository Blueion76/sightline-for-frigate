from pathlib import Path


def replace_once(path, old, new):
    p = Path(path)
    text = p.read_text()
    if old not in text:
        raise SystemExit(f"expected text not found in {path}: {old[:120]!r}")
    p.write_text(text.replace(old, new, 1))

# Make view-mode changes capable of changing presentation without implicitly
# remounting the live engine. Camera selection owns the actual camera remount.
replace_once(
    'src/card/live/view.js',
    "_setViewMode(mode) {\n    if (mode === 'grid') this._stopTalk(); // no talk button/target in grid view",
    "_setViewMode(mode, options={}) {\n    const mountEngine = options?.mountEngine !== false;\n    if (mode === 'grid') this._stopTalk(); // no talk button/target in grid view",
)
replace_once(
    'src/card/live/view.js',
    "      this._mountEngine();\n      this._renderAll();",
    "      if (mountEngine) this._mountEngine();\n      this._renderAll();",
)

# Do not leave Multiview until the requested camera is actually active. The old
# flow entered single view first, which kicked off an unawaited mount for the
# previous camera and then raced the selected camera's explicit mount.
replace_once(
    'src/card/live/view.js',
    "    // Clicking a cam tab while in grid mode switches to single view of that camera\n    if (this._viewMode === 'grid') this._setViewMode('single');\n    const prevEnt = this._activeCam?.entity;",
    "    // Capture the Multiview exit before changing camera state. We defer the\n    // presentation change until the selected camera is active so entering\n    // single view cannot start a stale mount for the previously active camera.\n    const leavingGrid = this._viewMode === 'grid';\n    const prevEnt = this._activeCam?.entity;",
)
replace_once(
    'src/card/live/view.js',
    "    this._reviews = cached.reviews||[]; this._kept = cached.kept||[];\n    this._renderCamSwitcher(); this._syncStatus();\n    await this._mountEngine();",
    "    this._reviews = cached.reviews||[]; this._kept = cached.kept||[];\n    // _switchCamera owns this remount. Suppress _setViewMode's normal implicit\n    // mount so there is exactly one WebRTC/HA engine handoff for the new camera.\n    if (leavingGrid) this._setViewMode('single', { mountEngine:false });\n    this._renderCamSwitcher(); this._syncStatus();\n    await this._mountEngine();",
)

# Multiview's wrapper must forward the mount policy to the live-domain owner.
replace_once(
    'src/card/multiview/controller.js',
    "  _setViewMode(mode) {\n    if(mode!=='grid'&&this._multiPlaybackSession)this._cancelMultiRecordingPlayback();\n    return liveMethods._setViewMode.call(this,mode);\n  }",
    "  _setViewMode(mode, options={}) {\n    if(mode!=='grid'&&this._multiPlaybackSession)this._cancelMultiRecordingPlayback();\n    return liveMethods._setViewMode.call(this,mode,options);\n  }",
)

# Regression coverage for the exact Multiview -> camera-tab handoff.
p = Path('tests/multiview.mjs')
text = p.read_text()
text = text.replace(
    "import { fileURLToPath } from 'node:url';\n",
    "import { fileURLToPath } from 'node:url';\nimport { liveViewMethods } from '../src/card/live/view.js';\n",
    1,
)
anchor = "assert.match(ux,/_enterDownloadRangePicker/,'Initial download-range render must refresh precision labels');\n"
if anchor not in text:
    raise SystemExit('multiview test anchor missing')
block = r'''

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
'''
text = text.replace(anchor, anchor + block, 1)
p.write_text(text)

# Release notes.
p = Path('CHANGELOG.md')
text = p.read_text()
anchor = "- Added `default_view: multiview` as the public startup option for multi-camera cards and exposed it as **Multiview (all cameras)** in the visual editor. Existing `default_view: grid` configurations remain supported as a backward-compatible alias.\n"
if anchor not in text:
    raise SystemExit('1.1.6 changelog anchor missing')
text = text.replace(
    anchor,
    anchor + "- Fixed Multiview-to-single-camera live handoff so clicking a camera tab no longer races an old-camera engine mount against the selected camera. The selected camera now becomes active first and receives one authoritative live-engine remount, preventing a connected-but-black single live player.\n",
    1,
)
p.write_text(text)
