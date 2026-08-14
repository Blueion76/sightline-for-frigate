import assert from 'node:assert/strict';
import { v115Methods } from '../src/card/v115.js';

class ClassListMock{constructor(){this.items=new Set();}toggle(n,on){on?this.items.add(n):this.items.delete(n);return !!on;}contains(n){return this.items.has(n);}}
function makeDateDom(){
  const oldDocument=globalThis.document;
  const host={id:'cal-btn',style:{},title:'Calendar',classList:new ClassListMock(),label:null,children:[],querySelector(s){return s==='.timeline-date-label'?this.label:null;},insertBefore(n){this.label=n;this.children.unshift(n);n.parentElement=this;},appendChild(n){this.children.push(n);n.parentElement=this;}};
  const input={id:'timeline-native-date',type:'date',value:'',max:'',parentElement:host,attrs:new Map(),setAttribute(n,v){this.attrs.set(n,String(v));},getAttribute(n){return this.attrs.get(n)||null;}};host.children=[input];
  globalThis.document={createElement(tag){assert.equal(tag,'span');return {className:'',textContent:'',style:{cssText:'',display:'none'},attrs:new Map(),setAttribute(n,v){this.attrs.set(n,String(v));}};}};
  const root={querySelector(s){return s==='#cal-btn'?host:s==='#timeline-native-date'?input:s==='#cal-panel'?{style:{display:'block'}}:null;}};
  return {oldDocument,root,host,input};
}

{
  const {oldDocument,root,host,input}=makeDateDom(),ctx={shadowRoot:root,_timelineFocusTs:+new Date(2026,7,9,12)/1000,_updateTimelineDateLabel:v115Methods._updateTimelineDateLabel};
  assert.equal(v115Methods._ensureTimelineNativeDateInput.call(ctx),input);assert.ok(host.label);
  v115Methods._updateTimelineDateLabel.call(ctx,'2026-08-09');
  assert.equal(host.label.style.display,'inline-block');assert.match(host.label.textContent,/Aug/);assert.match(host.label.textContent,/9/);assert.match(host.title,/2026/);assert.match(input.getAttribute('aria-label'),/Timeline date/);assert.equal(host.classList.contains('has-date-label'),true);
  v115Methods._updateTimelineDateLabel.call(ctx,Date.now()/1000);assert.equal(host.label.style.display,'none');assert.match(host.title,/Today/);globalThis.document=oldDocument;
}

{
  const {oldDocument,root,host,input}=makeDateDom(),span=600,start=+new Date(2026,7,14,14)/1000;let seeked=null,rendered=0,loaded=0,invalidated=0;
  const ctx={shadowRoot:root,_winStart:start,_winEnd:start+span,_timelineFocusTs:start+span/2,_timelineDefaultSpanSeconds:()=>span,_timelineDataSeq:0,_timelineLoadSeq:0,_timelineSeekSeq:0,_playSeq:0,_playbackLoadSeq:0,_timelineFollowingLive:true,_timelineWasLiveBeforeGesture:true,_timelineLiveCrossed:true,_invalidatePlaybackForTimelineMove(){invalidated++;},_renderTimeline(){rendered++;},_renderRange(){},_renderTimelineZoomLabel(){},_loadWindow(){loaded++;return Promise.resolve();},_seekTimelineTarget:async t=>{seeked=t;},_updateTimelineDateLabel:v115Methods._updateTimelineDateLabel};
  v115Methods._ensureTimelineNativeDateInput.call(ctx);await v115Methods._pickDay.call(ctx,'2026-08-09');
  const midnight=+new Date(2026,7,9,0)/1000;
  assert.equal(ctx._winStart,midnight);assert.equal(ctx._winEnd-ctx._winStart,span);assert.equal(ctx._timelineFocusTs,midnight+span/2);assert.equal(seeked,ctx._timelineFocusTs);assert.equal(ctx._scrubTarget,ctx._timelineFocusTs);assert.equal(ctx._timelineFollowingLive,false);assert.equal(invalidated,1);assert.ok(rendered&&loaded);assert.equal(host.label.style.display,'inline-block');assert.match(host.label.textContent,/Aug/);assert.match(input.getAttribute('aria-label'),/Aug/);globalThis.document=oldDocument;
}

console.log('iOS timeline date selection regression test passed.');
