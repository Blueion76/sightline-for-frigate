import assert from 'node:assert/strict';
import { actionMethods } from '../src/card/actions.js';
import { timelineCalendarMethods } from '../src/card/timeline/calendar.js';
import { localDateValue } from '../src/utils/date.js';

class ClassListMock {
  constructor() { this.items=new Set(); }
  toggle(name,on) { on?this.items.add(name):this.items.delete(name); return Boolean(on); }
  contains(name) { return this.items.has(name); }
}

function makeDateLabelDom() {
  const label={textContent:'',style:{display:'none'}};
  const input={value:'',attrs:new Map(),setAttribute(name,value){this.attrs.set(name,String(value));},getAttribute(name){return this.attrs.get(name)||null;}};
  const host={
    title:'Calendar',
    classList:new ClassListMock(),
    querySelector(selector){return selector==='.timeline-date-label'?label:null;},
  };
  const root={querySelector(selector){return selector==='#cal-btn'?host:selector==='#timeline-native-date'?input:selector==='#cal-panel'?{style:{display:'block'}}:null;}};
  return {root,host,input,label};
}

// Cold-start placeholders (null focus and zero window bounds) are not Unix-epoch
// timestamps. The native picker must initialize to Today before _start() seeds
// the real timeline window, rather than showing Dec 31, 1969 in US time zones.
{
  const {root,host,input,label}=makeDateLabelDom();
  const ctx={
    shadowRoot:root,
    _timelineFocusTs:null,
    _winStart:0,
    _winEnd:0,
    _updateTimelineDateLabel(value){timelineCalendarMethods._updateTimelineDateLabel.call(this,value);},
  };
  timelineCalendarMethods._prepareTimelineNativeDateInput.call(ctx,input);
  assert.equal(input.value,localDateValue());
  assert.equal(input.max,localDateValue());
  assert.equal(label.style.display,'none');
  assert.match(host.title,/Today/);
  assert.doesNotMatch(host.title,/1969|1970/);
}

// Historical navigation exposes the selected date beside the calendar icon and
// returns to an icon-only control when the playhead is back on Today.
{
  const {root,host,input,label}=makeDateLabelDom();
  const ctx={shadowRoot:root,_timelineFocusTs:+new Date(2026,7,9,12)/1000};
  timelineCalendarMethods._updateTimelineDateLabel.call(ctx,'2026-08-09');
  assert.equal(label.style.display,'inline-block');
  assert.match(label.textContent,/Aug/);
  assert.match(label.textContent,/9/);
  assert.match(host.title,/2026/);
  assert.match(input.getAttribute('aria-label'),/Timeline date/);
  assert.equal(host.classList.contains('has-date-label'),true);

  timelineCalendarMethods._updateTimelineDateLabel.call(ctx,Date.now()/1000);
  assert.equal(label.style.display,'none');
  assert.match(host.title,/Today/);
}

// Date selection preserves the current span, anchors the day at local midnight,
// invalidates stale playback and immediately commits through the normal seek path.
{
  const {root}=makeDateLabelDom();
  const span=600;
  const start=+new Date(2026,7,14,14)/1000;
  let seeked=null,rendered=0,loaded=0,invalidated=0;
  const ctx={
    shadowRoot:root,
    _winStart:start,
    _winEnd:start+span,
    _timelineFocusTs:start+span/2,
    _timelineDefaultSpanSeconds:()=>span,
    _timelineDataSeq:0,
    _timelineLoadSeq:0,
    _timelineSeekSeq:0,
    _playSeq:0,
    _playbackLoadSeq:0,
    _timelineFollowingLive:true,
    _timelineWasLiveBeforeGesture:true,
    _timelineLiveCrossed:true,
    _invalidatePlaybackForTimelineMove(){invalidated++;},
    _renderTimeline(){rendered++;},
    _renderRange(){},
    _renderTimelineZoomLabel(){},
    _loadWindow(){loaded++;return Promise.resolve();},
    _seekTimelineTarget(target){seeked=target;return Promise.resolve();},
    _updateTimelineDateLabel(value){timelineCalendarMethods._updateTimelineDateLabel.call(this,value);},
  };

  actionMethods._pickDay.call(ctx,'2026-08-09');
  const midnight=+new Date(2026,7,9,0)/1000;
  assert.equal(ctx._winStart,midnight);
  assert.equal(ctx._winEnd-ctx._winStart,span);
  assert.equal(ctx._timelineFocusTs,midnight+span/2);
  assert.equal(seeked,ctx._timelineFocusTs);
  assert.equal(ctx._scrubTarget,ctx._timelineFocusTs);
  assert.equal(ctx._timelineFollowingLive,false);
  assert.equal(invalidated,1);
  assert.ok(rendered>=1);
  assert.ok(loaded>=1);
}

// A mouse click on the transparent native input must explicitly open Chromium's
// date picker, while touch keeps the direct iOS/WebKit native-default path.
{
  const oldDocument=globalThis.document;
  let replacedHost=null;
  let showPickerCalls=0;

  const makeSpan=()=>({
    id:'',className:'',title:'',innerHTML:'',textContent:'',style:{},children:[],classList:new ClassListMock(),
    attrs:new Map(),
    setAttribute(name,value){this.attrs.set(name,String(value));},
    appendChild(child){this.children.push(child);child.parentElement=this;},
    querySelector(selector){return selector==='.timeline-date-label'?this.children.find(child=>child.className==='timeline-date-label')||null:null;},
  });
  const makeInput=()=>({
    id:'',type:'',value:'',max:'',style:{},listeners:{},attrs:new Map(),
    setAttribute(name,value){this.attrs.set(name,String(value));},
    addEventListener(name,handler){this.listeners[name]=handler;},
    showPicker(){showPickerCalls++;},
    blur(){},
  });

  const oldButton=makeSpan();
  oldButton.id='cal-btn';
  oldButton.className='tool';
  oldButton.title='Calendar';
  oldButton.parentNode={replaceChild(host){replacedHost=host;}};

  globalThis.document={
    createElement(tag){return tag==='input'?makeInput():makeSpan();},
  };

  const root={
    querySelector(selector){
      if(selector==='#cal-btn') return replacedHost||oldButton;
      if(selector==='#timeline-native-date') return replacedHost?.children.find(child=>child.id==='timeline-native-date')||null;
      if(selector==='#cal-panel') return {style:{display:'none'}};
      return null;
    },
  };
  const ctx={
    shadowRoot:root,
    _timelineFocusTs:+new Date(2026,7,14,15,30)/1000,
    _pickDay(){},
    _prepareTimelineNativeDateInput(input){return timelineCalendarMethods._prepareTimelineNativeDateInput.call(this,input);},
    _updateTimelineDateLabel(value){timelineCalendarMethods._updateTimelineDateLabel.call(this,value);},
  };

  const input=timelineCalendarMethods._ensureTimelineNativeDateInput.call(ctx);
  assert.ok(input);
  input.listeners.pointerdown({pointerType:'mouse'});
  input.listeners.click({stopPropagation(){}});
  assert.equal(showPickerCalls,1,'desktop trusted click should call showPicker()');

  showPickerCalls=0;
  input.listeners.pointerdown({pointerType:'touch'});
  input.listeners.touchstart();
  input.listeners.click({stopPropagation(){}});
  assert.equal(showPickerCalls,0,'touch should keep the direct native input activation path');
  globalThis.document=oldDocument;
}

console.log('timeline date selection regression tests passed.');
