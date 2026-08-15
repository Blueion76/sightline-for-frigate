import assert from 'node:assert/strict';
import { liveViewMethods, shouldShowFullscreenButton } from '../src/card/live/view.js';
import { multiviewTimelineMethods } from '../src/card/multiview/timeline-ui.js';
import { microphoneMethods } from '../src/card/talk/microphone.js';
import { timelineGestureMethods } from '../src/card/timeline/interaction.js';
import { timelinePlaybackSyncMethods } from '../src/card/timeline/playback-sync.js';
import { TIMELINE_SCALE_SECONDS, timelineScaleLabel, timelineScaleStep, timelineZoomMethods } from '../src/card/timeline/zoom.js';

assert.deepEqual([...TIMELINE_SCALE_SECONDS],[60,300,600,1800,2700,3600,10800,21600,43200,86400]);
for(const [span,direction,expected] of [[600,'out',1800],[600,'in',300],[300,'in',60],[2700,'out',3600],[43200,'out',86400],[86400,'out',86400]]) {
  assert.equal(timelineScaleStep(span,direction),expected);
}
for(const [span,expected] of [[60,'1m'],[2700,'45m'],[21600,'6h'],[86400,'24h']]) {
  assert.equal(timelineScaleLabel(span),expected);
}
{
  const ctx={_winStart:1_000_000,_winEnd:1_000_600,_timelineFocusTs:1_000_300,_timelineFollowingLive:false,_renderTimeline(){},_renderRange(){},_renderTimelineZoomLabel(){},_scheduleTimelineDynamicData(){},_scheduleTimelineDataLoad(){}};
  timelineZoomMethods._zoomTimeline.call(ctx,1/1.35);
  assert.equal(ctx._winEnd-ctx._winStart,1800);
}

// Empty pre-permission enumeration must not hide a microphone-capable browser.
{
  const old=Object.getOwnPropertyDescriptor(globalThis,'navigator');
  const ctx={_config:{two_way_audio:true},_microphonePresent:null,_talkSpeaking:false,isConnected:false};
  Object.defineProperty(globalThis,'navigator',{configurable:true,value:{mediaDevices:{getUserMedia(){},enumerateDevices:async()=>[]}}});
  assert.equal(await microphoneMethods._refreshMicrophoneAvailability.call(ctx),true);
  assert.equal(ctx._microphonePresent,true);
  Object.defineProperty(globalThis,'navigator',{configurable:true,value:{mediaDevices:{enumerateDevices:async()=>[]}}});
  assert.equal(await microphoneMethods._refreshMicrophoneAvailability.call(ctx),false);
  old?Object.defineProperty(globalThis,'navigator',old):delete globalThis.navigator;
}

// Desktop Live must expose Sightline's fullscreen control. Recorded single
// camera playback keeps using native video controls, and iOS stays suppressed.
{
  assert.equal(shouldShowFullscreenButton({isLive:true,inGrid:false,isIOS:false}),true);
  assert.equal(shouldShowFullscreenButton({isLive:true,inGrid:true,isIOS:false}),true);
  assert.equal(shouldShowFullscreenButton({isLive:false,inGrid:true,isIOS:false}),true);
  assert.equal(shouldShowFullscreenButton({isLive:false,inGrid:false,isIOS:false}),false);
  assert.equal(shouldShowFullscreenButton({isLive:true,inGrid:false,isIOS:true}),false);
}

// Explicit speaker control converts a user gesture into a real unmute/play attempt.
{
  let played=0,rendered=0;
  const video={muted:true,volume:0,setAttribute(){},play(){played++;return Promise.resolve();}};
  const ctx={_go2rtcLive:{video},_engine:null,_liveAudioEnabled:false,_renderStreamCtrl(){rendered++;}};
  liveViewMethods._toggleLiveAudio.call(ctx);
  assert.equal(ctx._liveAudioEnabled,true);
  assert.equal(video.muted,false);
  assert.equal(video.volume,1);
  assert.equal(played,1);
  assert.equal(rendered,1);
}

// Recorded playback uses a fixed visual playhead. Advancing the decoder clock
// must translate the viewport by the exact same amount so the scale/events stay
// in the same wall-clock coordinate system as the HH:MM:SS pill.
{
  let liveUpdates=0,reconciles=0,dynamicLoads=0;
  const track={querySelector(){return null;}};
  const ctx={
    isConnected:true,
    _timelineFollowingLive:false,
    _timelineInteracting:false,
    _timelineFocusTs:1_000_300,
    _scrubTarget:1_000_300,
    _winStart:1_000_000,
    _winEnd:1_000_600,
    _updateTimelineDateLabel(){},
    _$(selector){return selector==='#tl-track'?track:null;},
    _updateTimelineLive(){liveUpdates++;},
    _reconcileTimelineDuringMove(){reconciles++;},
    _scheduleTimelineDynamicData(mode){if(mode==='motion') dynamicLoads++;},
    _timelineTime(value){return String(value);},
    _timeMinute(value){return String(value);},
    _renderTimeline(){throw new Error('ordinary playback progress should not require a full render');},
  };
  timelinePlaybackSyncMethods._updateTimelinePlaybackTime.call(ctx,1_000_301.25);
  assert.equal(ctx._timelineFocusTs,1_000_301.25);
  assert.equal(ctx._scrubTarget,1_000_301.25);
  assert.equal(ctx._winStart,1_000_001.25);
  assert.equal(ctx._winEnd,1_000_601.25);
  assert.equal(ctx._winEnd-ctx._winStart,600);
  assert.equal(liveUpdates,1);
  assert.equal(reconciles,1);
  assert.equal(dynamicLoads,1);
}

// Legend buttons continue to own filtering even after timeline drag hardening.
{
  let applied=0;
  const legend={dataset:{legendLabel:'person'}};
  const event={target:{closest(selector){return selector==='[data-legend-label]'?legend:null;}},preventDefault(){},stopPropagation(){}};
  const ctx={_timelineSuppressClickUntil:0,_filterLabel:'all',_normalizeObjectLabel:value=>value,_applyLiveFilterChange(){applied++;}};
  multiviewTimelineMethods._click.call(ctx,event);
  assert.equal(ctx._filterLabel,'person');
  assert.equal(applied,1);
  multiviewTimelineMethods._click.call(ctx,event);
  assert.equal(ctx._filterLabel,'all');
}

// Event previews remain click targets until movement establishes drag intent.
{
  const listeners={};
  const track={
    clientHeight:400,
    classList:{add(){},remove(){}},
    addEventListener(name,fn){listeners[name]=fn;},
    getBoundingClientRect(){return {height:400};},
    setPointerCapture(){},hasPointerCapture(){return false;},releasePointerCapture(){},
  };
  let seeked=null;
  const now=Math.floor(Date.now()/1000);
  const ctx={
    _downloadRange:null,_winStart:now-300,_winEnd:now+300,_timelineFocusTs:now,_timelineFollowingLive:true,
    _playing:null,_activePlaybackCleanup:null,_updateTimelineLive(){},_renderRange(){},_reconcileTimelineDuringMove(){},
    _scheduleTimelineDynamicData(){},_updateTimelineScrubLabel(){},_isAtLiveEdge(){return false;},
    _seekTimelineTarget(target){seeked=target;},_scheduleTimelineDataLoad(){},_renderTimeline(){},
  };
  timelineGestureMethods._wireDesktopEventTimelineDrag.call(ctx,track);
  const target={closest(selector){return selector==='.t-preview,.t-ev'?{}:null;}};
  listeners.pointerdown({pointerType:'mouse',button:0,pointerId:7,clientX:20,clientY:200,target});
  listeners.pointermove({pointerId:7,clientX:20,clientY:202,preventDefault(){},stopPropagation(){}});
  assert.equal(ctx._timelineFocusTs,now);
  listeners.pointermove({pointerId:7,clientX:20,clientY:240,preventDefault(){},stopPropagation(){}});
  assert.notEqual(ctx._timelineFocusTs,now);
  listeners.pointerup({pointerId:7});
  assert.equal(seeked,ctx._scrubTarget);
  assert.ok(ctx._timelineSuppressClickUntil>performance.now());
}


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

console.log('v1.1.5 audio and timeline hardening regression tests passed.');
