import { VERSION, CARD_TAG, DAY, DEFAULT_ROTATE_S, ICONS, LABEL_COLORS, PALETTE, TIMELINE_GLYPHS, CAM_COLORS } from '../constants.js';
import { cap, parseWs, labelColor, timelineGlyph, mkCamState, camDisplayName } from '../helpers.js';
import { STYLES } from '../styles.js';

// Prototype methods grouped by responsibility.
export const listMethods = {
_favIcon(ev) { return ev.retain_indefinitely?`<button class="ico fav on" data-fav="${ev.id}">${ICONS.star}</button>`:`<button class="ico fav" data-fav="${ev.id}">${ICONS.starO}</button>`; },

_eventCardHTML(ev,expanded,compact=false) {
    const col=labelColor(ev.label); const score=ev.top_score!=null?Math.round(ev.top_score*100)+'%':'';
    const eventZones=this._eventZoneList(ev); const zone=eventZones.length?eventZones[0]:''; const subl=ev.sub_label?`<span class="subl">${ev.sub_label}</span>`:'';
    const desc=expanded&&ev.data?.description?`<div class="desc">${ev.data.description}</div>`:'';
    const thumbUrl=this._mediaForEvent(ev,'thumbnail.jpg');
    const thumb=ev.has_snapshot||ev.has_clip?`<img src="${thumbUrl}" data-frigate-thumb="1" data-thumb-src="${thumbUrl}" loading="lazy"><div class="tph thumb-fallback" style="display:none">${timelineGlyph((ev._tl||this._timelineLabelInfo(ev)).key)}</div>`:`<div class="tph thumb-fallback">${timelineGlyph((ev._tl||this._timelineLabelInfo(ev)).key)}</div>`;
    const badge=ev.has_clip?'<span class="bc">clip</span>':(ev.has_snapshot?'<span class="bs">snap</span>':'');
    const dlClip=ev.has_clip?`<button class="ico" data-dl="${ev.id}" data-dl-file="clip.mp4" title="Download clip">${ICONS.download}</button>`:'';
    const dlSnap=ev.has_snapshot?`<button class="ico" data-dl="${ev.id}" data-dl-file="snapshot.jpg" title="Download snapshot">${ICONS.snapshot}</button>`:'';
    // show camera name in multi-cam all-events mode
    const camLabel=(this._eventsMode==='all'&&this._config.cameras.length>1)?`<span class="cam-badge">${(ev.camera||'').replace(/_/g,' ')}</span>`:'';
    // compact: wrap everything in a tighter layout, actions horizontal
    return `<div class="ec${compact?' compact':''}" data-ev="${ev.id}">
      <div class="et">${thumb}<div class="ed">${this._dur(ev)}s</div></div>
      <div class="ei">
        <div class="etop"><span class="tb" style="background:${col}33;color:${col}">${cap(ev.label)}</span>${subl}${badge}${camLabel}${score?`<span class="esc">${score}</span>`:''}</div>
        <div class="em"><span>${ICONS.clock}${this._time(ev.start_time)}</span>${zone?`<span>${ICONS.pin}${zone}</span>`:''}</div>
        ${desc}
      </div>
      <div class="eact${compact?' h':''}">${this._favIcon(ev)}${dlClip}${dlSnap}</div>
    </div>`;
  },

_emptyState(icon, title, desc) {
    return `<div class="empty-state"><div class="es-icon">${icon}</div><div class="es-title">${title}</div>${desc ? `<div class="es-desc">${desc}</div>` : ''}</div>`;
  },

_renderList() {
    if (this._galleryMode) { this._renderGallery(); return; }
    const list=this._$('#list'); if(!list) return;
    if(this._tab==='recordings') {
      // Don't blow away the recording list (and seek bar) while the user is watching a recording
      const viewerActive = this._$('#viewer')?.style.display !== 'none';
      if (viewerActive && this._playing?.rec != null) return;
      return this._renderRecordings(list);
    }
    if(this._tab==='reviews') return this._renderReviews(list);
    if(this._tab==='kept'){
      if(!this._kept.length){list.innerHTML=this._emptyState(ICONS.star,'No kept events','Star an event to keep it here');return;}
      list.innerHTML=this._kept.map(ev=>this._eventCardHTML(ev,false)).join(''); return;
    }
    const events=this._filtered();
    if(!events.length){list.innerHTML=this._emptyState(ICONS.clips,'No events','Nothing detected in this time window');return;}
    list.innerHTML=events.map(ev=>this._eventCardHTML(ev,false)).join('')+(this._exhausted?'<div class="end">— end —</div>':'<div class="more">scroll for older…</div>');
  },

_renderRecordings(list) {
    const recs=this._mergeRecs(this._recordings).sort((a,b)=>b.start_time-a.start_time);
    if(!recs.length){list.innerHTML=this._emptyState(ICONS.recordings,'No recordings','This camera has nothing recorded in this window');return;}
    list.innerHTML=recs.map(r=>{
      const rs=Math.floor(r.start_time), re=Math.floor(r.end_time||Date.now()/1000);
      const d=Math.max(1,re-rs); const mm=Math.floor(d/60),ss=d%60;
      const dur=`${mm?mm+'m ':''}${ss}s`;
      const seekHint = d > 300 ? ' <span class="seek-hint">· click to seek</span>' : '';
      return `<div class="rec" data-rs="${rs}" data-re="${re}">
        <div class="ric">${ICONS.recordings}</div>
        <div class="rinf">
          <div class="rt">${this._time(r.start_time)} – ${this._time(r.end_time||Date.now()/1000)}</div>
          <div class="rsub">${dur}${r.events?' · '+r.events+' ev':''}${seekHint}</div>
        </div>
        <div class="rp">▶</div>
      </div>`;
    }).join('');
  },

_renderReviews(list) {
    if(!this._reviews.length){list.innerHTML=this._emptyState(ICONS.reviews,'No reviews','Nothing flagged for review in this window');return;}
    const allRevs=[...this._reviews].sort((a,b)=>b.start_time-a.start_time);
    const unrev=allRevs.filter(r=>!r.has_been_reviewed).length;
    const revs=this._showReviewed ? allRevs : allRevs.filter(r=>!r.has_been_reviewed);
    const toggleLbl=this._showReviewed?'Hide reviewed':'Show reviewed';
    const head=`<div class="rev-head"><span>${unrev} to review</span><div style="display:flex;gap:5px;align-items:center">${unrev?`<button class="chip on" data-mark-all>Mark all</button>`:''}<button class="chip" data-toggle-reviewed>${toggleLbl}</button></div></div>`;
    if(!revs.length){list.innerHTML=head+this._emptyState(ICONS.reviews,'All caught up','Nothing left to review');return;}
    list.innerHTML=head+revs.map(r=>{
      const sev=r.severity==='alert'?'alert':'detection';
      const objs=this._reviewLabelList(r).map(x=>this._filterDisplayName('label',x)).join(', ');
      const title=r.data?.metadata?.title||objs||cap(r.severity);
      const firstDet=(r.data?.detections&&r.data.detections[0])||'';
      const reviewed=r.has_been_reviewed;
      const reviewThumbUrl=firstDet?this._mediaForEvent({id:firstDet,camera:r.camera},'thumbnail.jpg'):''; const thumb=firstDet?`<div class="rev-th"><img src="${reviewThumbUrl}" data-frigate-thumb="1" data-thumb-src="${reviewThumbUrl}" loading="lazy"><div class="tph thumb-fallback" style="display:none">${ICONS.reviews}</div></div>`:'';
      return`<div class="rev ${sev}" data-review-id="${r.id}" ${firstDet?`data-review-open="${firstDet}"`:''}><div class="rev-sev ${sev}"></div>${thumb}<div class="rev-inf"><div class="rev-t">${title}</div><div class="rev-m">${this._time(r.start_time)} · ${cap(sev)}${reviewed?' · ✓':firstDet?' · tap':''}</div></div>${reviewed?'':`<button class="ico" data-mark>${ICONS.reviews}</button>`}</div>`;
    }).join('');
  }
};
