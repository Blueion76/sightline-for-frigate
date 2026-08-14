import assert from 'node:assert/strict';
import fs from 'node:fs';
import { v115Methods } from '../src/card/v115.js';

const source=fs.readFileSync(new URL('../src/card/v115.js',import.meta.url),'utf8');
const init=fs.readFileSync(new URL('../src/card/multi-recording-init.js',import.meta.url),'utf8');
assert.ok(init.includes('multiRecordingMethods,responsiveUxMethods,v115Methods'),'v1.1.5 should be one flattened method group');
assert.ok(!init.includes('iosTimelineDateMethods')&&!init.includes('v115HardeningMethods'),'legacy v1.1.5 wrapper groups must stay removed');
assert.ok(source.includes("closest?.('[data-legend-label]')")&&source.includes('multiRecordingMethods._click.call(this,event)'),'legend filtering must remain in the click chain');
assert.ok(source.includes('Math.hypot(e.clientX-drag.x,e.clientY-drag.y)<4')&&source.includes('_seekTimelineTarget(target)'),'desktop event-card dragging must retain its threshold and normal seek path');

const zoom=async(span,factor)=>{
  const ctx={_winStart:1_000_000,_winEnd:1_000_000+span,_timelineFocusTs:1_000_000+span/2,_timelineFollowingLive:false,_renderTimeline(){},_renderRange(){},_renderTimelineZoomLabel(){},_scheduleTimelineDynamicData(){},_scheduleTimelineDataLoad(){}};
  v115Methods._zoomTimeline.call(ctx,factor);return ctx._winEnd-ctx._winStart;
};
for(const [span,factor,expected] of [[600,1/1.35,1800],[600,1.35,300],[300,1.35,60],[2700,1/1.35,3600],[43200,1/1.35,86400],[86400,1/1.35,86400]])assert.equal(await zoom(span,factor),expected);
for(const [span,expected] of [[60,'1m'],[2700,'45m'],[21600,'6h'],[86400,'24h']]){
  const el={textContent:''},ctx={_winStart:0,_winEnd:span,_$(){return el;}};v115Methods._renderTimelineZoomLabel.call(ctx);assert.equal(el.textContent,expected);
}

{
  const old=Object.getOwnPropertyDescriptor(globalThis,'navigator'),ctx={_config:{two_way_audio:true},_microphonePresent:null,_talkSpeaking:false,isConnected:false};
  Object.defineProperty(globalThis,'navigator',{configurable:true,value:{mediaDevices:{getUserMedia(){},enumerateDevices:async()=>[]}}});
  assert.equal(await v115Methods._refreshMicrophoneAvailability.call(ctx),true);assert.equal(ctx._microphonePresent,true);
  Object.defineProperty(globalThis,'navigator',{configurable:true,value:{mediaDevices:{enumerateDevices:async()=>[]}}});
  assert.equal(await v115Methods._refreshMicrophoneAvailability.call(ctx),false);
  old?Object.defineProperty(globalThis,'navigator',old):delete globalThis.navigator;
}

{
  let played=0,rendered=0;
  const video={muted:true,volume:0,setAttribute(){},play(){played++;return Promise.resolve();}},ctx={_go2rtcLive:{video},_engine:null,_liveAudioEnabled:false,_renderStreamCtrl(){rendered++;}};
  const target={closest:s=>s==='#sc-audio'?{}:null},event={target,preventDefault(){},stopPropagation(){}};
  v115Methods._click.call(ctx,event);
  assert.equal(ctx._liveAudioEnabled,true);assert.equal(video.muted,false);assert.equal(video.volume,1);assert.equal(played,1);assert.equal(rendered,1);
}

console.log('v1.1.5 consolidated compatibility regression tests passed.');
