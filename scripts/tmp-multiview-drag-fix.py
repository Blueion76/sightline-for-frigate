from pathlib import Path

def replace_once(text, old, new, label):
    if old not in text:
        raise SystemExit(f"Missing expected source block: {label}")
    return text.replace(old, new, 1)

interaction = Path("src/card/timeline/interaction.js")
text = interaction.read_text()
text = replace_once(
    text,
    "    const controller = new AbortController();\n    this._scrubAbort = controller;\n    const signal = controller.signal;",
    "    const controller = new AbortController();\n    this._scrubAbort = controller;\n    this._scrubTrack = track;\n    const signal = controller.signal;",
    "scrub controller ownership",
)
text = replace_once(
    text,
    "      e.preventDefault();dn(e.clientX,e.clientY);\n    });\n    window.addEventListener('mousemove'",
    "      e.preventDefault();dn(e.clientX,e.clientY);\n    },{signal});\n    window.addEventListener('mousemove'",
    "mousedown signal ownership",
)
text = replace_once(
    text,
    "      dn(e.touches[0].clientX,e.touches[0].clientY);\n    },{passive:false});\n    track.addEventListener('touchmove'",
    "      dn(e.touches[0].clientX,e.touches[0].clientY);\n    },{passive:false,signal});\n    track.addEventListener('touchmove'",
    "touchstart signal ownership",
)
text = replace_once(
    text,
    "      if(drag){e.preventDefault();mv(e.touches[0].clientX,e.touches[0].clientY);}\n    },{passive:false});\n    track.addEventListener('touchend'",
    "      if(drag){e.preventDefault();mv(e.touches[0].clientX,e.touches[0].clientY);}\n    },{passive:false,signal});\n    track.addEventListener('touchend'",
    "touchmove signal ownership",
)
text = replace_once(
    text,
    "    track.addEventListener('touchend',e=>{if(rangeDrag&&rangePointerId==null){e.preventDefault();stopRangeHandle();return;}if(scrubber){e.preventDefault();stopScrubber();return;}if(pinch){e.preventDefault();up();return;}up();},{passive:false});",
    "    track.addEventListener('touchend',e=>{if(rangeDrag&&rangePointerId==null){e.preventDefault();stopRangeHandle();return;}if(scrubber){e.preventDefault();stopScrubber();return;}if(pinch){e.preventDefault();up();return;}up();},{passive:false,signal});",
    "touchend signal ownership",
)
text = replace_once(
    text,
    "    track.addEventListener('touchcancel',()=>{if(rangeDrag&&rangePointerId==null){stopRangeHandle();return;}if(scrubber){stopScrubber();return;}pinch=false;drag=false;this._timelineInteracting=false;this._timelineWasLiveBeforeGesture=false;this._timelineLiveCrossed=false;track.classList.remove('grab');this._renderTimeline();});",
    "    track.addEventListener('touchcancel',()=>{if(rangeDrag&&rangePointerId==null){stopRangeHandle();return;}if(scrubber){stopScrubber();return;}pinch=false;drag=false;this._timelineInteracting=false;this._timelineWasLiveBeforeGesture=false;this._timelineLiveCrossed=false;track.classList.remove('grab');this._renderTimeline();},{signal});",
    "touchcancel signal ownership",
)
text = replace_once(
    text,
    "    },{passive:false});\n\n    this._wireDesktopEventTimelineDrag(track,signal);\n    this._renderTimelineZoomLabel();\n  },\n\n  /**\n   * Allow desktop users to begin a timeline pan on top of an event preview.",
    "    },{passive:false,signal});\n\n    this._wireDesktopEventTimelineDrag(track,signal);\n    this._renderTimelineZoomLabel();\n  },\n\n  /**\n   * Ensure the visible timeline has one complete, current gesture binding set.\n   *\n   * Playback can temporarily hide the timeline while the dashboard layout is\n   * reconfigured. Rebinding at that lifecycle boundary is safe because every\n   * listener installed by `_wireScrub()` now belongs to the same AbortSignal.\n   * This prevents a half-wired state where `mousedown` survives but the global\n   * `mousemove`/`mouseup` listeners that actually carry the drag do not.\n   */\n  _refreshTimelineInteractionWiring(force=false) {\n    const track=this.shadowRoot?.querySelector?.('#tl-track');\n    if(!track) return false;\n    const signal=this._scrubAbort?.signal;\n    if(!force && this._scrubTrack===track && signal && !signal.aborted) return true;\n    this._wireScrub();\n    return this._scrubTrack===track && this._scrubAbort?.signal?.aborted===false;\n  },\n\n  /**\n   * Allow desktop users to begin a timeline pan on top of an event preview.",
    "wheel ownership and interaction refresh helper",
)
interaction.write_text(text)

state = Path("src/card/state.js")
text = state.read_text()
text = replace_once(
    text,
    "  card._scrubAbort = null;\n  card._scrollAbort = null;",
    "  card._scrubAbort = null;\n  card._scrubTrack = null;\n  card._scrollAbort = null;",
    "scrub track state",
)
state.write_text(text)

core = Path("src/card/core.js")
text = core.read_text()
text = replace_once(
    text,
    "    if (this._scrubAbort) { try { this._scrubAbort.abort(); } catch(_) {} this._scrubAbort=null; }\n    if (this._scrollAbort)",
    "    if (this._scrubAbort) { try { this._scrubAbort.abort(); } catch(_) {} this._scrubAbort=null; }\n    this._scrubTrack=null;\n    if (this._scrollAbort)",
    "disconnect scrub track cleanup",
)
core.write_text(text)

layout = Path("src/card/ui/playback-layout.js")
text = layout.read_text()
text = replace_once(
    text,
    "  _showLive(...args) {\n    const returnToGrid=this._playbackReturnViewMode==='grid';\n    const result=eventPlaybackMethods._showLive.apply(this,args);",
    "  _showLive(...args) {\n    const returnToGrid=this._playbackReturnViewMode==='grid';\n    const returningFromPlayback=Boolean(\n      this._playing || this._activePlaybackCleanup || this._playbackSession || this._playbackReturnViewMode\n    );\n    const result=eventPlaybackMethods._showLive.apply(this,args);",
    "playback return detection",
)
text = replace_once(
    text,
    "    this._syncResponsiveWorkspace?.();\n    return result;\n  },",
    "    this._syncResponsiveWorkspace?.();\n    // Full-card playback temporarily changes the Multiview workspace and can\n    // cross a card/layout lifecycle boundary in desktop Home Assistant. Refresh\n    // the complete scrub binding set only when actually returning from media.\n    if(returningFromPlayback) this._refreshTimelineInteractionWiring?.(true);\n    return result;\n  },",
    "playback return interaction refresh",
)
layout.write_text(text)

test = Path("tests/v115-hardening.mjs")
text = test.read_text()
marker = "\nconsole.log('v1.1.5 audio and timeline hardening regression tests passed.');\n"
if marker not in text:
    raise SystemExit("Missing v1.1.5 test footer")
addition = r'''

// Scrub wiring must be all-or-nothing. Every track/window listener that carries
// a drag belongs to the same AbortSignal so a lifecycle refresh cannot leave a
// live mousedown handler paired with dead global mousemove/mouseup listeners.
{
  const oldWindow=globalThis.window;
  const trackListeners=[];
  const windowListeners=[];
  const track={
    addEventListener(name,handler,options){trackListeners.push({name,handler,options});},
    classList:{add(){},remove(){},contains(){return true;}},
  };
  globalThis.window={
    PointerEvent:function PointerEvent(){},
    addEventListener(name,handler,options){windowListeners.push({name,handler,options});},
  };
  const ctx={
    shadowRoot:{querySelector(selector){return selector==='#tl-track'?track:null;}},
    _scrubAbort:null,
    _scrubTrack:null,
    _wireDesktopEventTimelineDrag(){},
    _renderTimelineZoomLabel(){},
  };
  timelineGestureMethods._wireScrub.call(ctx);
  const signal=ctx._scrubAbort.signal;
  for(const name of ['mousedown','touchstart','touchmove','touchend','touchcancel','wheel']) {
    assert.equal(trackListeners.find(item=>item.name===name)?.options?.signal,signal,`${name} must share scrub AbortSignal`);
  }
  for(const name of ['mousemove','mouseup']) {
    assert.equal(windowListeners.find(item=>item.name===name)?.options?.signal,signal,`${name} must share scrub AbortSignal`);
  }

  let rewires=0;
  const originalController=ctx._scrubAbort;
  ctx._wireScrub=function(){
    rewires++;
    this._scrubAbort=new AbortController();
    this._scrubTrack=track;
  };
  assert.equal(timelineGestureMethods._refreshTimelineInteractionWiring.call(ctx),true);
  assert.equal(rewires,0,'healthy binding should not be duplicated');
  originalController.abort();
  assert.equal(timelineGestureMethods._refreshTimelineInteractionWiring.call(ctx),true);
  assert.equal(rewires,1,'aborted binding must be restored');
  assert.equal(timelineGestureMethods._refreshTimelineInteractionWiring.call(ctx,true),true);
  assert.equal(rewires,2,'playback return may force one clean rebind');
  globalThis.window=oldWindow;
}
'''
test.write_text(text.replace(marker, addition + marker, 1))

architecture = Path("tests/architecture.mjs")
text = architecture.read_text()
marker = "\nconsole.log('Source architecture regression test passed.');\n"
if marker not in text:
    raise SystemExit("Missing architecture test footer")
addition = r'''

// Returning from full-card media playback must restore the timeline gesture
// lifecycle after the Multiview workspace has been put back in place.
{
  const source=read('src/card/ui/playback-layout.js');
  assert.match(source,/returningFromPlayback/);
  assert.ok(source.includes('this._refreshTimelineInteractionWiring?.(true);'));
}
'''
architecture.write_text(text.replace(marker, addition + marker, 1))

changelog = Path("CHANGELOG.md")
text = changelog.read_text()
anchor = "- Fixed recorded-playback synchronization on Windows/Chromium: the media decoder clock now translates the visible timeline window by the same fractional delta as playback, keeping the fixed playhead, `HH:MM:SS` pill, time scale, recording rail, detections, and thumbnails on the same wall-clock timestamp instead of allowing the label to advance independently.\n"
if anchor not in text:
    raise SystemExit("Missing changelog timeline synchronization bullet")
bullet = "- Fixed desktop Multiview timeline mouse dragging after opening a clip and returning to Live. Timeline pointer/mouse/touch/wheel listeners now share one abortable lifecycle, and returning from full-card playback explicitly refreshes that binding set so the track cannot be left with a `mousedown` handler but no active `mousemove`/`mouseup` transport.\n"
changelog.write_text(text.replace(anchor, anchor + bullet, 1))
