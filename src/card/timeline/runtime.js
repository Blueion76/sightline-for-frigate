/**
 * Deferred timeline data loading, scroll pagination and status synchronization.
 */
import { cap, camDisplayName } from '../../helpers.js';

export const timelineRuntimeMethods = {
_scheduleTimelineDynamicData(mode='motion') {
    if (!this.isConnected || this._galleryMode || !this._activeCam?.entity) return;
    const isLive=mode==='live';
    const nowMs=performance.now();
    const span=Math.max(300,this._winEnd-this._winStart);
    const loadedStart=Number(this._recordingsRangeStart);
    const loadedEnd=Number(this._recordingsRangeEnd);
    const margin=Math.min(10*60,Math.max(60,span*.18));
    const loadedAt=Number(this._recordingsLoadedAt)||0;

    // If a request is already in flight, remember that the viewport changed
    // even when the old cache happens to cover it right now. The in-flight
    // response may replace that cache with a tighter interval.
    if (this._timelineDynamicActive) { this._timelineDynamicPending=true; return; }

    // During motion, don't refetch while the currently loaded interval still
    // comfortably surrounds the viewport. At LIVE, freshness matters even
    // when the requested interval overlaps, because the right edge advances.
    if (!isLive && Number.isFinite(loadedStart) && Number.isFinite(loadedEnd) &&
        loadedStart<=this._winStart-margin && loadedEnd>=this._winEnd+margin) return;
    if (isLive && loadedAt && Date.now()-loadedAt<3000) return;

    this._timelineDynamicPending=true;

    // A pending LIVE timer must never delay an active user gesture. Promote it
    // to the faster motion cadence immediately when the user starts moving.
    if (this._timelineDynamicTimer) {
      if (!(mode==='motion' && this._timelineDynamicTimerMode==='live')) return;
      clearTimeout(this._timelineDynamicTimer);
      this._timelineDynamicTimer=null;
    }

    const minGap=isLive ? 3000 : 500;
    const delay=Math.max(0,minGap-(nowMs-(this._timelineDynamicLastAt||0)));
    this._timelineDynamicTimerMode=mode;
    this._timelineDynamicTimer=setTimeout(async()=>{
      this._timelineDynamicTimer=null;
      this._timelineDynamicTimerMode='';
      if (!this.isConnected || this._galleryMode) return;
      this._timelineDynamicActive=true;
      this._timelineDynamicPending=false;
      this._timelineDynamicLastAt=performance.now();
      try {
        await this._loadWindow(true,false,true);
      } finally {
        this._timelineDynamicActive=false;
        // If the viewport moved again while the request was in flight, follow
        // it with one more throttled request for the newest position.
        if (this._timelineDynamicPending && this.isConnected) {
          this._timelineDynamicPending=false;
          this._scheduleTimelineDynamicData(this._timelineFollowingLive?'live':'motion');
        }
      }
    },delay);
  },

_scheduleTimelineDataLoad() {
    clearTimeout(this._timelineDataTimer);
    const seq=++this._timelineDataSeq;
    const entity=this._activeCam?.entity || '';
    const windowStart=this._winStart, windowEnd=this._winEnd;
    // Do not hit Frigate on every high-frequency touch/wheel burst. The
    // current window is already rendered locally; fetch once the gesture has
    // settled enough to know which range is actually needed.
    this._timelineDataTimer = setTimeout(() => {
      if (seq !== this._timelineDataSeq || entity !== this._activeCam?.entity) return;
      // The timer is only a debounce gate. _loadWindow has its own monotonic
      // request guard, so an older network response can never win.
      if (windowStart !== this._winStart || windowEnd !== this._winEnd) return;
      this._loadWindow(true);
    }, 320);
  },

_timelineTimestampAtRatio(ratio, focusTs, span) {
    const r=Math.max(0,Math.min(1,Number.isFinite(Number(ratio)) ? Number(ratio) : 0.5));
    const sp=Math.max(1,Number.isFinite(Number(span)) ? Number(span) : (this._winEnd-this._winStart));
    const f=Number.isFinite(Number(focusTs)) ? Number(focusTs) : ((this._winStart+this._winEnd)/2);
    return f + (0.5-r)*sp;
  },

_setTimelineWindowAround(anchorTs, anchorRatio, span) {
    const now=Math.floor(Date.now()/1000);
    const ratio=Math.max(0,Math.min(1,Number.isFinite(Number(anchorRatio)) ? Number(anchorRatio) : 0.5));
    const sp=Math.max(300,Math.min(86400,Math.floor(Number(span)||900)));
    const anchor=Number.isFinite(Number(anchorTs)) ? Number(anchorTs) : (this._timelineFocusTs ?? this._winEnd);

    // If timestamp A is at visual ratio r, then:
    // A = focus + (0.5 - r) * span.
    // Solve that equation for the new focus after changing span.
    let newFocus=anchor - (0.5-ratio)*sp;
    let ns=Math.floor(newFocus-sp/2);
    let ne=Math.floor(newFocus+sp/2);

    // Keep the newest edge from extending into the future. Shift the whole
    // window rather than changing its span so zoom level remains exact.
    if(ne>now){ const shift=ne-now; ns-=shift; ne-=shift; newFocus-=shift; }
    if(ns<0){ const shift=-ns; ns+=shift; ne+=shift; newFocus+=shift; }

    // Final invariant: focus stays inside the normalized window without
    // silently changing the requested zoom span.
    this._winStart=Math.floor(ns);
    this._winEnd=Math.floor(ne);
    this._timelineFocusTs=Math.max(this._winStart,Math.min(this._winEnd,Math.round(newFocus)));
    this._exhausted=false;
  },

_wireScroll() {

    const list=this.shadowRoot.querySelector('#list'); if(!list) return;
    list.addEventListener('scroll',()=>{if(this._loading||this._exhausted)return;if(list.scrollTop+list.clientHeight>=list.scrollHeight-40)this._loadOlder();});
  },

async _loadOlder() {
    const before=this._events.length?Math.floor(Math.min(...this._events.map(e=>e.start_time))):this._winStart;
    this._loading=true; const {clientId,cam}=this._cc();
    try{
      const older=await this._ws({type:'frigate/events/get',instance_id:clientId,cameras:[cam],before,limit:50});
      const arr=Array.isArray(older)?older.filter(o=>!this._events.some(e=>e.id===o.id)):[];
      if(!arr.length)this._exhausted=true; else{this._events=this._events.concat(arr);this._winStart=Math.min(this._winStart,...arr.map(e=>e.start_time));this._mergeLoadedFilterMetadata(this._cc(),arr,[]);}
    }catch(_){}
    this._loading=false; this._renderList();this._renderTimeline();this._renderRange();
  },

_syncStatus() {
    const ent=this._hass?.states?.[this._activeCam?.entity]; if(!ent) return;
    const dot=this._$('#on-dot'),lbl=this._$('#on-lbl'),title=this._$('#info-title');
    const ok=!this._cameraIsOffline();
    if(dot) dot.style.color=ok?'var(--c-on)':'var(--c-danger)';
    if(lbl) lbl.textContent=ok?'Online':'Offline';
    const tlOffline=this._$('#tl-track')?.querySelector('.tl-offline'); if(tlOffline) tlOffline.style.display=ok?'none':'flex';
    if(title) {
      const c=this._activeCam; const n=cap(camDisplayName(c)||'Camera');
      title.textContent=n;
    }
  },

_$(sel) { return this._domCache[sel] || (this._domCache[sel] = this.shadowRoot.querySelector(sel)); }
};
