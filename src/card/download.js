/**
 * Recording download-range selection, validation and Frigate export requests.
 */
import { VERSION, CARD_TAG, DAY, DEFAULT_ROTATE_S, ICONS, LABEL_COLORS, PALETTE, TIMELINE_GLYPHS, CAM_COLORS } from '../constants.js';
import { cap, parseWs, labelColor, timelineGlyph, mkCamState, camDisplayName } from '../helpers.js';
import { STYLES } from '../styles.js';

// Prototype methods grouped by responsibility.
export const downloadMethods = {
_formatDownloadRangeDuration(seconds) {
    const total=Math.max(1,Math.round(Number(seconds)||0));
    const h=Math.floor(total/3600), m=Math.floor((total%3600)/60), s=total%60;
    if(h) return `${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
    return `${m}:${String(s).padStart(2,'0')}`;
  },

_enterDownloadRangePicker(anchorTs) {
    if(this._viewMode==='grid' || this._galleryMode) return;
    const now=Math.floor(Date.now()/1000);
    const windowStart=Math.max(0,Math.floor(Number(this._winStart)||0));
    const windowEnd=Math.max(windowStart+1,Math.min(now,Math.floor(Number(this._winEnd)||now)));
    let anchor=Math.floor(Number(anchorTs));
    if(!Number.isFinite(anchor)) anchor=Math.floor((windowStart+windowEnd)/2);
    anchor=Math.max(windowStart,Math.min(windowEnd,anchor));

    // Center the configurable default trim span on the current scrub timestamp.
    const defaultRange=Math.max(2,Math.round(Number(this._config?.download?.default_range_seconds||60)));
    let start=Math.max(windowStart,anchor-Math.floor(defaultRange/2));
    let end=Math.min(windowEnd,anchor+Math.ceil(defaultRange/2));
    if(end-start<2){
      if(end<windowEnd) end=Math.min(windowEnd,start+2);
      else start=Math.max(windowStart,end-2);
    }
    this._downloadRange={start:Math.floor(start),end:Math.max(Math.floor(start)+1,Math.floor(end)),anchor};
    this._timelineFollowingLive=false;
    this._renderTimeline(true);
    this._renderStreamCtrl();
    this._toast('Drag START and END on the timeline, then Download',2600);
  },

_cancelDownloadRangePicker() {
    if(!this._downloadRange) return;
    this._downloadRange=null;
    this._timelineInteracting=false;
    this._renderTimeline(true);
    this._renderStreamCtrl();
  },

async _confirmDownloadRangePicker() {
    const range=this._downloadRange;
    if(!range) return;
    const start=Math.floor(Number(range.start));
    const end=Math.floor(Number(range.end));
    if(!Number.isFinite(start)||!Number.isFinite(end)||end<=start){
      this._toast('Choose a valid download range');
      return;
    }
    this._downloadRange=null;
    this._timelineInteracting=false;
    this._renderTimeline(true);
    this._renderStreamCtrl();
    return this._downloadRecRange(start,end);
  },

_syncDownloadRangePickerDOM(activeKind=null) {
    const track=this._$('#tl-track');
    const root=track?.querySelector('.tl-download-range');
    const r=this._downloadRange;
    if(!track||!root||!r) return;
    const s=Number(this._winStart), e=Number(this._winEnd);
    const span=Math.max(1,e-s);
    const focus=Number.isFinite(Number(this._timelineFocusTs))?Number(this._timelineFocusTs):e;
    const yPct=ts=>Math.max(0,Math.min(100,50+((focus-Number(ts))/span)*100));
    const endPct=yPct(r.end), startPct=yPct(r.start);
    const band=root.querySelector('.tl-range-band');
    if(band){band.style.top=`${Math.min(endPct,startPct)}%`;band.style.height=`${Math.max(.35,Math.abs(startPct-endPct))}%`;}
    const syncHandle=(kind,pct,ts)=>{
      const h=root.querySelector(`[data-range-handle="${kind}"]`);
      if(!h) return;
      h.style.top=`${pct}%`;
      h.setAttribute('aria-valuetext',this._timelineTime(ts));
      h.classList.toggle('dragging',activeKind===kind);
      const label=h.querySelector('span');
      if(label) label.innerHTML=`<b>${kind==='end'?'END':'START'}</b>${this._timelineScaleTime(ts)}`;
    };
    syncHandle('end',endPct,r.end);
    syncHandle('start',startPct,r.start);
    root.classList.toggle('range-dragging',!!activeKind);
    root.dataset.start=String(Math.floor(Number(r.start)));
    root.dataset.end=String(Math.floor(Number(r.end)));
    root.setAttribute('aria-label',`Download range ${this._timelineTime(r.start)} to ${this._timelineTime(r.end)}`);
    const dur=root.querySelector('.tl-range-duration');
    if(dur) dur.textContent=this._formatDownloadRangeDuration(Number(r.end)-Number(r.start));
  },

_updateDownloadRangeBoundary(kind, absoluteTs) {
    const range=this._downloadRange;
    if(!range) return null;
    const now=Math.floor(Date.now()/1000);
    const lo=Math.max(0,Math.floor(Number(this._winStart)||0));
    const hi=Math.max(lo+1,Math.min(now,Math.floor(Number(this._winEnd)||now)));
    let t=Math.max(lo,Math.min(hi,Math.round(Number(absoluteTs)||0)));
    const maxLen=Math.max(60,Math.round(Number(this._config?.download?.max_range_minutes||120)*60));
    if(kind==='start'){
      t=Math.min(t,range.end-1);
      t=Math.max(t,range.end-maxLen,lo);
      range.start=t;
    } else {
      t=Math.max(t,range.start+1);
      t=Math.min(t,range.start+maxLen,hi);
      range.end=t;
    }
    return t;
  },

async _downloadRecRange(dlStart, dlEnd) {
    const {clientId, cam} = this._cc();
    const maxLen=Math.max(60,Math.round(Number(this._config?.download?.max_range_minutes||120)*60));
    const end=Math.min(Math.floor(Number(dlEnd)),Math.floor(Number(dlStart))+maxLen);
    const start=Math.floor(Number(dlStart));
    if(!Number.isFinite(start)||!Number.isFinite(end)||end<=start){this._toast('Choose a valid download range');return;}
    const base = `/api/frigate/${encodeURIComponent(String(clientId))}/recording/${encodeURIComponent(String(cam))}/start/${start}/end/${end}`;

    // IMPORTANT: Home Assistant signs both the request path *and* all non-safe
    // query parameters. An older implementation signed `base` and only then appended
    // `download=true`; current HA correctly rejects that as a tampered signed
    // request, causing the 401/error body to be saved with an .mp4 extension.
    // Build the final proxy request first, then sign that exact path.
    const signed = await this._signed(`${base}?download=true`);
    const a = document.createElement('a');
    a.href = signed;
    const stamp=new Date(start*1000).toISOString().replace(/[:.]/g,'-');
    a.download = `${String(cam).replace(/[^a-z0-9_-]+/gi,'_')}_${stamp}_${end-start}s.mp4`;
    a.rel='noopener';
    document.body.appendChild(a);
    a.click();
    a.remove();
  }
};
