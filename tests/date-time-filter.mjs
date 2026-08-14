import assert from 'node:assert/strict';
import { actionMethods } from '../src/card/actions.js';
import { browserMethods } from '../src/card/browser.js';

// Timeline calendar selection must translate the viewport without changing its
// current span/zoom. Date-only navigation begins at local midnight.
{
  const span=45*60;
  const panel={style:{display:'block'}};
  const calls={render:0,range:0,zoom:0,load:0};
  const ctx={
    _winStart:10_000,
    _winEnd:10_000+span,
    _timelineFocusTs:10_000+span/2,
    _timelineZoom:3600/span,
    _timelineFollowingLive:true,
    _timelineInteracting:true,
    _timelineSeekSeq:7,
    _timelineSelected:'old-event',
    _downloadRange:{start:1,end:2},
    _wt:setTimeout(()=>{},60_000),
    shadowRoot:{querySelector:sel=>sel==='#cal-panel'?panel:null},
    _timelineDefaultSpanSeconds:()=>10*60,
    _renderTimeline:force=>{ assert.equal(force,true); calls.render++; },
    _renderRange:()=>{ calls.range++; },
    _renderTimelineZoomLabel:()=>{ calls.zoom++; },
    _loadWindow:replace=>{ assert.equal(replace,true); calls.load++; }
  };

  const zoomBefore=ctx._timelineZoom;
  actionMethods._pickDay.call(ctx,'2026-08-12');

  const midnight=Math.floor(new Date(2026,7,12,0,0,0,0).getTime()/1000);
  assert.equal(ctx._winStart,midnight,'date-only timeline selection must begin at local midnight');
  assert.equal(ctx._winEnd-ctx._winStart,span,'calendar selection must preserve the exact current timeline span');
  assert.equal(ctx._timelineFocusTs,midnight+span/2,'timeline focus must remain centered inside the translated viewport');
  assert.equal(ctx._scrubTarget,ctx._timelineFocusTs,'scrub target must follow the translated timeline focus');
  assert.equal(ctx._timelineZoom,zoomBefore,'calendar selection must not change the current zoom level');
  assert.equal(ctx._timelineFollowingLive,false,'historical calendar navigation must leave LIVE-follow mode');
  assert.equal(ctx._timelineInteracting,false);
  assert.equal(ctx._timelineSelected,null);
  assert.equal(ctx._downloadRange,null);
  assert.equal(panel.style.display,'none');
  assert.deepEqual(calls,{render:1,range:1,zoom:1,load:1});
}

const temporalContext=filter=>({
  _mediaFilter:{...filter},
  _mediaDateBounds:browserMethods._mediaDateBounds,
  _mediaTimeParts:browserMethods._mediaTimeParts,
  _mediaAbsoluteBounds:browserMethods._mediaAbsoluteBounds,
  _mediaMatchesTimeOfDay:browserMethods._mediaMatchesTimeOfDay
});

// A selected date with no time range begins at local midnight and covers the
// selected local calendar day. Local endpoints also remain DST-safe.
{
  const ctx=temporalContext({date:'2026-08-12',timeStart:'',timeEnd:''});
  const bounds=browserMethods._mediaAbsoluteBounds.call(ctx);
  assert.equal(bounds.start,Math.floor(new Date(2026,7,12,0,0,0,0).getTime()/1000));
  assert.equal(bounds.end,Math.floor(new Date(2026,7,13,0,0,0,0).getTime()/1000));
}

// Explicit From/To values must be honored on the selected date.
{
  const ctx=temporalContext({date:'2026-08-12',timeStart:'09:30',timeEnd:'10:45'});
  const bounds=browserMethods._mediaAbsoluteBounds.call(ctx);
  assert.equal(bounds.start,Math.floor(new Date(2026,7,12,9,30,0,0).getTime()/1000));
  assert.equal(bounds.end,Math.floor(new Date(2026,7,12,10,45,0,0).getTime()/1000));
}

// An overnight time filter remains intentional: 23:00–01:00 spans midnight.
{
  const ctx=temporalContext({date:'2026-08-12',timeStart:'23:00',timeEnd:'01:00'});
  const bounds=browserMethods._mediaAbsoluteBounds.call(ctx);
  assert.equal(bounds.start,Math.floor(new Date(2026,7,12,23,0,0,0).getTime()/1000));
  assert.equal(bounds.end,Math.floor(new Date(2026,7,13,1,0,0,0).getTime()/1000));
}

// With All dates selected, From/To is a time-of-day filter over the loaded
// rolling dataset. Verify both ordinary and overnight ranges.
{
  const ctx=temporalContext({date:'all',timeStart:'09:30',timeEnd:'10:45'});
  assert.equal(browserMethods._mediaMatchesTimeOfDay.call(ctx,new Date(2026,7,12,10,0,0,0).getTime()/1000),true);
  assert.equal(browserMethods._mediaMatchesTimeOfDay.call(ctx,new Date(2026,7,12,11,0,0,0).getTime()/1000),false);

  ctx._mediaFilter.timeStart='23:00';
  ctx._mediaFilter.timeEnd='01:00';
  assert.equal(browserMethods._mediaMatchesTimeOfDay.call(ctx,new Date(2026,7,12,23,30,0,0).getTime()/1000),true);
  assert.equal(browserMethods._mediaMatchesTimeOfDay.call(ctx,new Date(2026,7,13,0,30,0,0).getTime()/1000),true);
  assert.equal(browserMethods._mediaMatchesTimeOfDay.call(ctx,new Date(2026,7,12,12,0,0,0).getTime()/1000),false);
}

console.log('Timeline date and media time filter regression test passed.');
