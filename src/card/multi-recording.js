import { CAM_COLORS } from '../constants.js';
import { cap, camDisplayName, timelineGlyph } from '../helpers.js';
import { browserMethods } from './browser.js';
import { downloadMethods } from './download.js';
import { timelineRenderMethods } from './timeline-render.js';
import { multiRecordingCoreMethods } from './multi-recording-core.js';
import { multiRecordingPlayerMethods } from './multi-recording-player.js';
import { multiRecordingControllerMethods } from './multi-recording-controller.js';

const timelineUxMethods={
  _renderLegend() {
    const el=this._$('#legend');
    if(!el)return;
    if(this._config?.timeline?.show_legend===false){el.innerHTML='';el.style.display='none';return;}
    el.style.display='';
    const labels=this._labels();
    const current=this._filterLabel==='all'?'all':this._normalizeObjectLabel(this._filterLabel);
    let html=labels.map(raw=>{
      const label=this._normalizeObjectLabel(raw);
      if(!label)return '';
      const active=current!=='all'&&label===current;
      const display=this._filterDisplayName('label',label);
      const activeStyle=active?'background:var(--c-acc-bg)!important;border-color:var(--c-acc-bdr)!important;color:var(--c-acc-text)!important;':'';
      return `<button type="button" class="lg tl-detection-legend${active?' active':''}" data-legend-label="${label}" aria-pressed="${active?'true':'false'}" style="appearance:none;-webkit-appearance:none;font:inherit;cursor:pointer;touch-action:manipulation;${activeStyle}"><i>${timelineGlyph(label)}</i>${display}</button>`;
    }).join('');
    if(this._eventsMode==='all'){
      this._config.cameras.forEach((c,i)=>{
        const color=CAM_COLORS[i%CAM_COLORS.length].replace('.5','1').replace('rgba','rgb').replace(',1)',')');
        html+=`<span class="lg"><i style="background:${color}"></i>${cap(camDisplayName(c))} rec</span>`;
      });
    }else{
      html+=`<span class="lg"><i style="background:${CAM_COLORS[0].replace('.5','1').replace('rgba','rgb').replace(',1)',')')}"></i>Rec</span>`;
    }
    el.innerHTML=html;
  },

  _click(e) {
    const legend=e?.target?.closest?.('[data-legend-label]');
    if(legend){
      e.preventDefault?.();
      e.stopPropagation?.();
      const label=this._normalizeObjectLabel(legend.dataset.legendLabel);
      if(!label)return;
      this._filterLabel=this._filterLabel===label?'all':label;
      this._applyLiveFilterChange();
      return;
    }
    return browserMethods._click.call(this,e);
  },

  _timelineConfiguredPreviewHeight() {
    return Math.max(48,Math.min(140,Math.round(Number(this._config?.timeline?.thumbnail_size ?? 84))));
  },

  _syncTimelinePreviewGeometry() {
    const track=this._$('#tl-track');
    if(!track)return;
    const h=this._timelineConfiguredPreviewHeight();
    const w=Math.max(154,Math.min(420,Math.round(h*3.15)));
    const s=Number(this._winStart),e=Number(this._winEnd);
    const span=Math.max(1,e-s);
    const focus=Number.isFinite(Number(this._timelineFocusTs))?Number(this._timelineFocusTs):e;
    const trackPx=Math.max(1,Number(track.clientHeight)||Number(track.getBoundingClientRect?.().height)||420);
    const yPct=ts=>Math.max(0,Math.min(100,50+((focus-Number(ts))/span)*100));
    for(const preview of track.querySelectorAll('.t-preview[data-ts]')){
      const ts=Number(preview.dataset.ts);
      preview.style.setProperty('height',`${h}px`,'important');
      preview.style.setProperty('width',`min(${w}px, calc(100% - var(--tl-content) - 10px))`,'important');
      preview.style.setProperty('max-width',`${w}px`,'important');
      if(Number.isFinite(ts)){
        // The detection row is anchored at yPct(ts). Center the preview on the
        // exact same pixel, using the configured height as the authoritative
        // geometry. This prevents the connector from drifting when the user
        // changes timeline.thumbnail_size.
        const center=(yPct(ts)/100)*trackPx;
        preview.style.top=`${center-h/2}px`;
      }
    }
  },

  _renderTimeline(...args) {
    const result=timelineRenderMethods._renderTimeline.apply(this,args);
    this._syncTimelinePreviewGeometry();
    if(this._downloadRange){
      this._syncDownloadRangePickerDOM();
      this._wireDedicatedDownloadRangeDrag();
    }
    return result;
  },

  _syncDownloadRangePickerDOM(activeKind=null) {
    const result=downloadMethods._syncDownloadRangePickerDOM.call(this,activeKind);
    const root=this._$('#tl-track')?.querySelector('.tl-download-range');
    const range=this._downloadRange;
    if(!root||!range)return result;
    for(const [kind,ts] of [['end',range.end],['start',range.start]]){
      const label=root.querySelector(`[data-range-handle="${kind}"]`)?.querySelector('span');
      if(label)label.innerHTML=`<b>${kind==='end'?'END':'START'}</b>${this._timelineTime(ts)}`;
    }
    return result;
  },

  _downloadRangeTimestampAtClientY(clientY) {
    const track=this._$('#tl-track');
    if(!track)return NaN;
    const rect=track.getBoundingClientRect();
    const ratio=Math.max(0,Math.min(1,(Number(clientY)-rect.top)/Math.max(1,rect.height)));
    const span=Math.max(1,Number(this._winEnd)-Number(this._winStart));
    const focus=Number.isFinite(Number(this._timelineFocusTs))
      ? Number(this._timelineFocusTs)
      : (Number(this._winStart)+Number(this._winEnd))/2;
    // Exact inverse of timeline-render.js yPct():
    // y = 50 + ((focus - ts) / span) * 100
    return focus+(0.5-ratio)*span;
  },

  _downloadRangeKindAtClientY(clientY,preferred=null) {
    const range=this._downloadRange;
    if(!range)return preferred||'start';
    if(preferred==='start'||preferred==='end')return preferred;
    const ts=this._downloadRangeTimestampAtClientY(clientY);
    return Math.abs(ts-Number(range.start))<=Math.abs(ts-Number(range.end))?'start':'end';
  },

  _wireDedicatedDownloadRangeDrag() {
    const track=this._$('#tl-track');
    const root=track?.querySelector('.tl-download-range');
    if(!track||!root||!this._downloadRange||root.dataset.dragWired==='1')return;
    root.dataset.dragWired='1';
    root.style.touchAction='none';
    let kind=null;
    let pointerId=null;
    let touchId=null;

    const isActionTarget=target=>!!target?.closest?.('[data-range-download],[data-range-cancel]');
    const update=y=>{
      if(!kind||!this._downloadRange)return;
      const ts=this._downloadRangeTimestampAtClientY(y);
      const value=this._updateDownloadRangeBoundary(kind,ts);
      if(!Number.isFinite(value))return;
      this._timelineInteracting=true;
      track.classList.add('range-grab');
      this._syncDownloadRangePickerDOM(kind);
      this._updateTimelineScrubLabel(value);
    };
    const start=(target,y)=>{
      if(!this._downloadRange||isActionTarget(target))return false;
      const preferred=target?.closest?.('[data-range-handle]')?.dataset?.rangeHandle||null;
      kind=this._downloadRangeKindAtClientY(y,preferred);
      update(y);
      return true;
    };
    const finish=()=>{
      if(!kind)return;
      kind=null;
      pointerId=null;
      touchId=null;
      this._timelineInteracting=false;
      track.classList.remove('range-grab');
      this._syncDownloadRangePickerDOM();
    };

    root.addEventListener('pointerdown',e=>{
      if(isActionTarget(e.target)||(e.pointerType==='mouse'&&e.button!==0))return;
      if(!start(e.target,e.clientY))return;
      e.preventDefault();
      e.stopPropagation();
      pointerId=e.pointerId;
      try{root.setPointerCapture?.(e.pointerId);}catch(_){}
    },{capture:true,passive:false});
    root.addEventListener('pointermove',e=>{
      if(pointerId==null||e.pointerId!==pointerId||!kind)return;
      e.preventDefault();
      e.stopPropagation();
      update(e.clientY);
    },{capture:true,passive:false});
    const endPointer=e=>{
      if(pointerId==null||e.pointerId!==pointerId)return;
      e.preventDefault?.();
      e.stopPropagation?.();
      try{if(root.hasPointerCapture?.(e.pointerId))root.releasePointerCapture?.(e.pointerId);}catch(_){}
      finish();
    };
    root.addEventListener('pointerup',endPointer,{capture:true,passive:false});
    root.addEventListener('pointercancel',endPointer,{capture:true,passive:false});
    root.addEventListener('lostpointercapture',e=>{if(pointerId!=null&&e.pointerId===pointerId)finish();},{capture:true});

    // WKWebView fallback. Some iOS versions expose PointerEvent but can still
    // fail to deliver a complete pointer sequence through nested Shadow DOM.
    root.addEventListener('touchstart',e=>{
      if(pointerId!=null||kind||isActionTarget(e.target)||!e.changedTouches?.length)return;
      const touch=e.changedTouches[0];
      if(!start(e.target,touch.clientY))return;
      touchId=touch.identifier;
      e.preventDefault();
      e.stopPropagation();
    },{capture:true,passive:false});
    root.addEventListener('touchmove',e=>{
      if(touchId==null||!kind)return;
      const touch=[...(e.changedTouches||[])].find(t=>t.identifier===touchId)||[...(e.touches||[])].find(t=>t.identifier===touchId);
      if(!touch)return;
      e.preventDefault();
      e.stopPropagation();
      update(touch.clientY);
    },{capture:true,passive:false});
    const endTouch=e=>{
      if(touchId==null||!kind)return;
      const ended=[...(e.changedTouches||[])].some(t=>t.identifier===touchId);
      if(!ended)return;
      e.preventDefault?.();
      e.stopPropagation?.();
      finish();
    };
    root.addEventListener('touchend',endTouch,{capture:true,passive:false});
    root.addEventListener('touchcancel',endTouch,{capture:true,passive:false});

    // Mouse fallback for browsers without Pointer Events.
    root.addEventListener('mousedown',e=>{
      if('PointerEvent' in window||e.button!==0||isActionTarget(e.target))return;
      if(!start(e.target,e.clientY))return;
      e.preventDefault();
      e.stopPropagation();
      const move=ev=>{ev.preventDefault();update(ev.clientY);};
      const up=()=>{window.removeEventListener('mousemove',move);window.removeEventListener('mouseup',up);finish();};
      window.addEventListener('mousemove',move,{passive:false});
      window.addEventListener('mouseup',up,{once:true});
    },{capture:true,passive:false});
  },

  _enterDownloadRangePicker(anchorTs) {
    const result=downloadMethods._enterDownloadRangePicker.call(this,anchorTs);
    if(this._downloadRange){
      this._syncDownloadRangePickerDOM();
      this._wireDedicatedDownloadRangeDrag();
    }
    return result;
  }
};

export const multiRecordingMethods=Object.assign({},multiRecordingCoreMethods,multiRecordingPlayerMethods,multiRecordingControllerMethods,timelineUxMethods);
