import assert from 'node:assert/strict';
import { iosTimelineDateMethods } from '../src/card/ios-timeline-date.js';

class ClassListMock {
  constructor(){this.items=new Set();}
  toggle(name,on){if(on)this.items.add(name);else this.items.delete(name);return !!on;}
  contains(name){return this.items.has(name);}
}

function makeDateDom(){
  const oldDocument=globalThis.document;
  const label={className:'timeline-date-label',textContent:'',style:{display:'none'},attrs:new Map(),setAttribute(n,v){this.attrs.set(n,String(v));}};
  const host={
    id:'cal-btn',style:{},title:'Calendar',classList:new ClassListMock(),label:null,children:[],
    querySelector(sel){return sel==='.timeline-date-label'?this.label:null;},
    insertBefore(node,input){this.label=node;this.children.unshift(node);node.parentElement=this;},
    appendChild(node){this.children.push(node);node.parentElement=this;}
  };
  const input={
    id:'timeline-native-date',type:'date',value:'',max:'',parentElement:host,attrs:new Map(),
    setAttribute(name,value){this.attrs.set(name,String(value));},
    getAttribute(name){return this.attrs.get(name)||null;}
  };
  host.children=[input];
  globalThis.document={
    createElement(tag){
      assert.equal(tag,'span');
      return {className:'',textContent:'',style:{cssText:'',display:'none'},attrs:new Map(),setAttribute(n,v){this.attrs.set(n,String(v));}};
    }
  };
  const root={
    querySelector(sel){
      if(sel==='#cal-btn') return host;
      if(sel==='#timeline-native-date') return input;
      if(sel==='#cal-panel') return {style:{display:'block'}};
      return null;
    }
  };
  return {oldDocument,root,host,input,label};
}

// The native input remains the actual hit target, but the visible calendar
// control gains a compact selected-date badge whenever the timeline is not on
// Today. This makes the current historical date obvious without reopening the
// picker.
{
  const {oldDocument,root,host,input}=makeDateDom();
  const ctx={
    shadowRoot:root,
    _timelineFocusTs:Math.floor(new Date(2026,7,9,12,0,0,0).getTime()/1000),
    _updateTimelineDateLabel:iosTimelineDateMethods._updateTimelineDateLabel
  };
  const native=iosTimelineDateMethods._ensureTimelineNativeDateInput.call(ctx);
  assert.equal(native,input);
  assert.ok(host.label,'selected-date label should be inserted beside the calendar icon');
  iosTimelineDateMethods._updateTimelineDateLabel.call(ctx,'2026-08-09');
  assert.equal(host.label.style.display,'inline-block');
  assert.match(host.label.textContent,/Aug/);
  assert.match(host.label.textContent,/9/);
  assert.match(host.title,/2026/);
  assert.match(input.getAttribute('aria-label'),/Timeline date/);
  assert.equal(host.classList.contains('has-date-label'),true);

  const now=Math.floor(Date.now()/1000);
  iosTimelineDateMethods._updateTimelineDateLabel.call(ctx,now);
  assert.equal(host.label.style.display,'none','Today should return to the compact icon-only calendar button');
  assert.match(host.title,/Today/);
  globalThis.document=oldDocument;
}

// Picking a date must be a complete one-step timeline action: preserve the
// current zoom/span, start the visible day at local midnight, and immediately
// seek/play the recording at the fixed playhead inside that new window. The
// user should not need a second tap on the timeline to start playback.
{
  const {oldDocument,root,host,input}=makeDateDom();
  const originalSpan=10*60;
  const start=Math.floor(new Date(2026,7,14,14,0,0,0).getTime()/1000);
  let seeked=null;
  let rendered=0;
  let loaded=0;
  let invalidated=0;
  const ctx={
    shadowRoot:root,
    _winStart:start,
    _winEnd:start+originalSpan,
    _timelineFocusTs:start+originalSpan/2,
    _timelineDefaultSpanSeconds:()=>originalSpan,
    _timelineDataSeq:0,_timelineLoadSeq:0,_timelineSeekSeq:0,_playSeq:0,_playbackLoadSeq:0,
    _timelineFollowingLive:true,_timelineWasLiveBeforeGesture:true,_timelineLiveCrossed:true,
    _invalidatePlaybackForTimelineMove(){invalidated++;},
    _renderTimeline(){rendered++;},
    _renderRange(){},
    _renderTimelineZoomLabel(){},
    _loadWindow(){loaded++;return Promise.resolve();},
    _seekTimelineTarget:async target=>{seeked=target;},
    _updateTimelineDateLabel:iosTimelineDateMethods._updateTimelineDateLabel
  };

  await iosTimelineDateMethods._pickDay.call(ctx,'2026-08-09');
  const midnight=Math.floor(new Date(2026,7,9,0,0,0,0).getTime()/1000);
  assert.equal(ctx._winStart,midnight);
  assert.equal(ctx._winEnd-ctx._winStart,originalSpan,'calendar selection must not change timeline zoom/span');
  assert.equal(ctx._timelineFocusTs,midnight+originalSpan/2);
  assert.equal(seeked,ctx._timelineFocusTs,'selected date should immediately start recording playback without a second timeline tap');
  assert.equal(ctx._scrubTarget,ctx._timelineFocusTs);
  assert.equal(ctx._timelineFollowingLive,false);
  assert.equal(invalidated,1);
  assert.ok(rendered>=1);
  assert.ok(loaded>=1);
  assert.equal(host.label.style.display,'inline-block');
  assert.match(host.label.textContent,/Aug/);
  assert.match(input.getAttribute('aria-label'),/Aug/);
  globalThis.document=oldDocument;
}

console.log('iOS timeline date selection regression test passed.');
