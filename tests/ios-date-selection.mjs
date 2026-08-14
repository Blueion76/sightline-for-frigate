import assert from 'node:assert/strict';
import { actionMethods } from '../src/card/actions.js';
import { timelineCalendarMethods } from '../src/card/timeline/calendar.js';

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

console.log('iOS timeline date selection regression test passed.');
