import { VERSION, CARD_TAG, DAY, DEFAULT_ROTATE_S, ICONS, LABEL_COLORS, PALETTE, TIMELINE_GLYPHS, CAM_COLORS } from '../constants.js';
import { cap, parseWs, labelColor, timelineGlyph, mkCamState, camDisplayName } from '../helpers.js';
import { STYLES } from '../styles.js';

// Prototype methods grouped by responsibility.
export const actionMethods = {
_goNow() { this._downloadRange=null; this._resetTimelineToNow10m(); this._loadWindow(true); this._renderTimeline(true); this._renderRange(); this._renderTimelineZoomLabel(); this._renderStreamCtrl(); },

_download(id,file) { const a=document.createElement('a'); a.href=this._media(id,file,true); a.download=`${this._cc().cam}_${id}_${file}`; document.body.appendChild(a); a.click(); a.remove(); },

_toggleFav(id) {
    const ev=this._events.find(e=>e.id===id); if(!ev) return;
    const next=!ev.retain_indefinitely;
    ev.retain_indefinitely=next;
    if (next) { if(!this._kept.find(e=>e.id===id)) this._kept=[{...ev},...this._kept]; }
    else { this._kept=this._kept.filter(e=>e.id!==id); }
    const ent=this._activeCam?.entity; if(ent&&this._camCache[ent]) this._camCache[ent].kept=this._kept;
    this._renderList(); this._renderLatest();
    const {clientId}=this._cc();
    this._hass.callWS({type:'frigate/event/retain',instance_id:clientId,event_id:id,retain:next})
      .catch(err=>{
        ev.retain_indefinitely=!next;
        if(next) this._kept=this._kept.filter(e=>e.id!==id);
        else if(!this._kept.find(e=>e.id===id)) this._kept=[{...ev},...this._kept];
        this._renderList();
        console.warn('[Frigate] retain failed',err);
        this._toast('Could not save — check Frigate port config.');
      });
  },

async _markAll() {
    const ids=this._reviews.filter(r=>!r.has_been_reviewed).map(r=>r.id); if(!ids.length) return;
    const {clientId}=this._cc();
    try { await this._hass.callWS({type:'frigate/reviews/viewed',instance_id:clientId,ids,viewed:true}); this._reviews.forEach(r=>r.has_been_reviewed=true); this._renderList(); }
    catch(e) { console.warn(e); }
  },

async _markReviewed(id) {
    const {clientId}=this._cc();
    try { await this._hass.callWS({type:'frigate/reviews/viewed',instance_id:clientId,ids:[id],viewed:true}); const r=this._reviews.find(x=>x.id===id); if(r) r.has_been_reviewed=true; this._renderList(); }
    catch(e) { console.warn(e); }
  },

_applyBrowse() {
    // The legacy bottom Events · Recordings browser was replaced by the
    // unified media gallery. Keep this method as a harmless compatibility
    // no-op because older lifecycle paths still call it.
  },

_toggleBrowse() { this._browseOpen=!this._browseOpen; this._applyBrowse(); },

_toast(msg,ms=3500) {
    const t=this.shadowRoot.querySelector('#toast'); if(!t) return;
    t.textContent=msg; t.style.display='block';
    clearTimeout(this._toastT); this._toastT=setTimeout(()=>{ t.style.display='none'; },ms);
  },

_toggleFilter() { const p=this.shadowRoot.querySelector('#filter-panel'); const open=p.style.display==='none'; this.shadowRoot.querySelector('#cal-panel').style.display='none'; p.style.display=open?'block':'none'; if(open){ this._mergeLoadedFilterMetadata(this._cc(),this._events,this._reviews); this._loadFrigateFilterMetadata(); this._renderFilter(); } },

_toggleCal() { const p=this.shadowRoot.querySelector('#cal-panel'); const open=p.style.display==='none'; this.shadowRoot.querySelector('#filter-panel').style.display='none'; p.style.display=open?'block':'none'; if(open){ this._calMonth=this._calMonth||new Date(this._winEnd*1000); this._renderCal(); } },

_calNav(d) { const m=this._calMonth||new Date(); m.setMonth(m.getMonth()+d); this._calMonth=new Date(m); this._renderCal(); },

_pickDay(ds) {
    const [y,mo,da]=String(ds||'').split('-').map(Number);
    if(!Number.isFinite(y)||!Number.isFinite(mo)||!Number.isFinite(da)) return;
    const midnight=Math.floor(new Date(y,mo-1,da,0,0,0,0).getTime()/1000);
    if(!Number.isFinite(midnight)) return;

    // A calendar selection is a timeline translation, not a zoom command.
    // Preserve the exact visible span the user currently chose and move that
    // same viewport so its oldest edge begins at local midnight on the selected
    // date. Previously this replaced the viewport with 00:00–23:59:59, which
    // looked like the calendar merely zoomed the timeline out to 24 hours.
    const currentSpan=Number(this._winEnd)-Number(this._winStart);
    const fallbackSpan=typeof this._timelineDefaultSpanSeconds==='function'
      ? Number(this._timelineDefaultSpanSeconds()) : 10*60;
    const span=Number.isFinite(currentSpan)&&currentSpan>0 ? currentSpan : Math.max(1,fallbackSpan||10*60);

    // Calendar navigation is a hard ownership boundary. After a scrub there
    // may still be a wheel-settle callback, a debounced timeline load, a
    // moving-window refresh, or an active recording/media clock waiting to
    // update the playhead. Any of those can immediately translate the timeline
    // back to the old scrub position after the new date is applied. Cancel the
    // queued work and invalidate every in-flight generation before moving the
    // viewport so repeated date selections are deterministic.
    clearTimeout(this._wt); this._wt=null;
    clearTimeout(this._timelineDataTimer); this._timelineDataTimer=null;
    this._timelineDataSeq=(Number(this._timelineDataSeq)||0)+1;
    clearTimeout(this._timelineDynamicTimer); this._timelineDynamicTimer=null;
    this._timelineDynamicTimerMode='';
    this._timelineDynamicPending=false;
    this._timelineLoadSeq=(Number(this._timelineLoadSeq)||0)+1;

    // Stop single-camera and synchronized Multiview recording playback before
    // changing dates. Their media clocks intentionally drive
    // _updateTimelinePlaybackTime(); leaving either alive would let the old
    // recording re-anchor the freshly selected calendar date on its next tick.
    if(typeof this._invalidatePlaybackForTimelineMove==='function') {
      this._invalidatePlaybackForTimelineMove();
    } else if(typeof this._cancelActivePlayback==='function') {
      this._cancelActivePlayback();
      this._playSeq=(Number(this._playSeq)||0)+1;
      this._playbackLoadSeq=(Number(this._playbackLoadSeq)||0)+1;
    }

    this._timelineInteracting=false;
    this._timelineFollowingLive=false;
    this._timelineWasLiveBeforeGesture=false;
    this._timelineLiveCrossed=false;
    this._scrubGestureInvalidated=false;
    this._timelineSeekSeq=(Number(this._timelineSeekSeq)||0)+1;
    this._timelineSelected=null;
    this._downloadRange=null;

    this._winStart=midnight;
    this._winEnd=midnight+span;
    this._timelineFocusTs=midnight+span/2;
    this._scrubTarget=this._timelineFocusTs;
    this._exhausted=false;
    this._timelineDataDirty=true;

    const panel=this.shadowRoot.querySelector('#cal-panel');
    if(panel) panel.style.display='none';
    this._renderTimeline(true);
    this._renderRange();
    this._renderTimelineZoomLabel();
    this._loadWindow(true);
  },

_renderCal() {
    const p=this.shadowRoot.querySelector('#cal-panel'); if(!p) return;
    const m=this._calMonth||new Date(); const y=m.getFullYear(),mo=m.getMonth();
    const first=new Date(y,mo,1); const startDow=(first.getDay()+6)%7; const days=new Date(y,mo+1,0).getDate();
    let cells=''; for(let i=0;i<startDow;i++) cells+='<span></span>';
    for(let d=1;d<=days;d++){
      const ds=`${y}-${String(mo+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
      cells+=`<button class="cday" data-cal-day="${ds}">${d}${this._daysWithActivity.has(ds)?'<i class="cdot"></i>':''}</button>`;
    }
    p.innerHTML=`<div class="cal-head"><button data-cal-nav="-1">‹</button><b>${m.toLocaleDateString([],{month:'long',year:'numeric'})}</b><button data-cal-nav="1">›</button></div>
      <div class="cal-dow"><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span></div>
      <div class="cal-grid">${cells}</div>`;
  }
};
