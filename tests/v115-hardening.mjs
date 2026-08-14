import assert from 'node:assert/strict';
import fs from 'node:fs';
import {
  TIMELINE_SCALE_SECONDS,
  timelineScaleStep,
  timelineScaleLabel,
  v115HardeningMethods,
} from '../src/card/v115-hardening.js';

const multiRecordingInit=fs.readFileSync(new URL('../src/card/multi-recording-init.js',import.meta.url),'utf8');
assert.ok(
  multiRecordingInit.includes("event?.target?.closest?.('[data-legend-label]')") &&
  multiRecordingInit.includes('multiRecordingMethods._click.call(this,event)'),
  'v1.1.5 click hardening must preserve the existing timeline legend filter handler',
);

assert.deepEqual(
  [...TIMELINE_SCALE_SECONDS],
  [60,300,600,1800,2700,3600,10800,21600,43200,86400],
  'Timeline +/- must use the normal discrete scale ladder',
);
assert.equal(timelineScaleStep(600,'out'),1800,'10m zoom-out should become 30m');
assert.equal(timelineScaleStep(600,'in'),300,'10m zoom-in should become 5m');
assert.equal(timelineScaleStep(300,'in'),60,'5m zoom-in should become 1m');
assert.equal(timelineScaleStep(2700,'out'),3600,'45m zoom-out should become 1h');
assert.equal(timelineScaleStep(43200,'out'),86400,'12h zoom-out should become 24h');
assert.equal(timelineScaleStep(86400,'out'),86400,'24h is the maximum scale');
assert.equal(timelineScaleLabel(60),'1m');
assert.equal(timelineScaleLabel(2700),'45m');
assert.equal(timelineScaleLabel(21600),'6h');
assert.equal(timelineScaleLabel(86400),'24h');

// Browsers may return an empty enumerateDevices() result before microphone
// permission is granted. getUserMedia support must keep Talk eligible so the
// user can actually trigger the permission prompt.
{
  const oldNavigator=Object.getOwnPropertyDescriptor(globalThis,'navigator');
  Object.defineProperty(globalThis,'navigator',{
    configurable:true,
    value:{mediaDevices:{getUserMedia(){},enumerateDevices:async()=>[]}},
  });
  const ctx={
    _config:{two_way_audio:true},
    _microphonePresent:null,
    _talkSpeaking:false,
    isConnected:false,
  };
  assert.equal(await v115HardeningMethods._refreshMicrophoneAvailability.call(ctx),true);
  assert.equal(ctx._microphonePresent,true);

  Object.defineProperty(globalThis,'navigator',{
    configurable:true,
    value:{mediaDevices:{enumerateDevices:async()=>[]}},
  });
  assert.equal(await v115HardeningMethods._refreshMicrophoneAvailability.call(ctx),false);

  if(oldNavigator) Object.defineProperty(globalThis,'navigator',oldNavigator);
  else delete globalThis.navigator;
}

// Desktop detection cards remain ordinary click targets until the mouse moves
// far enough to establish drag intent. Once moved, the card becomes a timeline
// pan surface and the release seeks the newly selected timestamp.
{
  const listeners={};
  const track={
    clientHeight:400,
    classList:{items:new Set(),add(v){this.items.add(v);},remove(v){this.items.delete(v);}},
    addEventListener(name,fn){listeners[name]=fn;},
    getBoundingClientRect(){return {height:400};},
    setPointerCapture(){},
    hasPointerCapture(){return false;},
    releasePointerCapture(){},
  };
  let seeked=null;
  const now=Math.floor(Date.now()/1000);
  const ctx={
    _downloadRange:null,
    _winStart:now-300,
    _winEnd:now+300,
    _timelineFocusTs:now,
    _timelineFollowingLive:true,
    _playing:null,
    _activePlaybackCleanup:null,
    _updateTimelineLive(){},
    _renderRange(){},
    _reconcileTimelineDuringMove(){},
    _scheduleTimelineDynamicData(){},
    _updateTimelineScrubLabel(){},
    _isAtLiveEdge(){return false;},
    _seekTimelineTarget(target){seeked=target;},
    _scheduleTimelineDataLoad(){},
    _renderTimeline(){},
  };
  v115HardeningMethods._wireDesktopTimelineCardDrag.call(ctx,track);
  const target={closest(selector){return selector==='.t-preview,.t-ev'?{}:null;}};
  listeners.pointerdown({pointerType:'mouse',button:0,pointerId:7,clientX:20,clientY:200,target});
  listeners.pointermove({pointerId:7,clientX:20,clientY:202,preventDefault(){},stopPropagation(){}});
  assert.equal(ctx._timelineFocusTs,now,'sub-threshold movement must remain a normal event click');
  listeners.pointermove({pointerId:7,clientX:20,clientY:240,preventDefault(){},stopPropagation(){}});
  assert.notEqual(ctx._timelineFocusTs,now,'a deliberate desktop drag must pan the timeline');
  listeners.pointerup({pointerId:7});
  assert.equal(seeked,ctx._scrubTarget,'desktop card drag must commit the normal recording seek path');
  assert.ok(ctx._timelineSuppressClickUntil>performance.now(),'the click emitted after a drag must be suppressed');
}

// The explicit audio control must translate a real user gesture into an
// unmuted/play attempt instead of relying on browser-native video controls.
{
  let played=0;
  const video={muted:true,volume:0,setAttribute(){},play(){played++;return Promise.resolve();}};
  const ctx={
    _go2rtcLive:{video},
    _engine:null,
    _liveAudioEnabled:false,
    _renderStreamCtrl(){},
  };
  v115HardeningMethods._toggleLiveAudio.call(ctx);
  assert.equal(ctx._liveAudioEnabled,true);
  assert.equal(video.muted,false);
  assert.equal(video.volume,1);
  assert.equal(played,1);
}

console.log('v1.1.5 audio/timeline hardening regression tests passed.');
