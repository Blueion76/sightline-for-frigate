/**
 * Clips, recordings, and reviews gallery rendering.
 *
 * Methods are composed onto SightlineCard.prototype; method names are kept
 * stable so existing card behavior and tests remain unchanged.
 */
import { ICONS } from '../../constants.js';
import { cap, camDisplayName } from '../../helpers.js';

export const mediaGalleryMethods = {
_renderGallery(force=false) {
    const gallery=this.shadowRoot.querySelector('#media-gallery'); if(!gallery || !this._galleryMode) return;
    // While a native date/time picker owns the screen, do not mutate any part
    // of the gallery. Clips/Recordings receive asynchronous _loadWindow()
    // updates that Reviews does not, and even changing sibling result rows or
    // ancestor height can make iOS dismiss the native picker although the
    // <input> itself survived. Queue one repaint and keep the DOM pixel-stable.
    if(this._mediaPickerActive && !force) {
      this._mediaPickerPendingGalleryRender=true;
      return;
    }
    this._mediaPickerPendingGalleryRender=false;
    const tab=this._galleryMode; let title=''; let content=''; let count=0;
    this._normalizeMediaFilterState();
    const activeFilters=this._mediaFilterActive();
    if(tab==='clips') {
      const events=this._filterMediaEvents(this._eventsMode==='all'?this._allDisplayEvents():this._events); title='Clips'; count=events.length;
      content=events.length ? events.map(ev=>this._eventCardHTML(ev,false)).join('') : this._emptyState(ICONS.clips,'No clips match','Try changing the filters');
    } else if(tab==='recordings') {
      const recs=this._filterMediaRecordings(this._recordingBrowse.length ? this._recordingBrowse : this._mergeRecs(this._recordings)).sort((a,b)=>b.start_time-a.start_time); title='Recordings'; count=recs.length;
      content=recs.length ? recs.map(r=>{ const rs=Math.floor(r.start_time), re=Math.floor(r.end_time||Date.now()/1000); const d=Math.max(1,re-rs), mm=Math.floor(d/60), ss=d%60; return `<div class="rec" data-rs="${rs}" data-re="${re}"><div class="ric">${ICONS.recordings}</div><div class="rinf"><div class="rt">${this._time(r.start_time)} – ${this._time(r.end_time||Date.now()/1000)}</div><div class="rsub">${mm?mm+'m ':''}${ss}s${r.events?' · '+r.events+' ev':''}</div></div><div class="rp">▶</div></div>`; }).join('') : this._emptyState(ICONS.recordings,'No recordings match','Try changing the filters');
    } else if(tab==='reviews') {
      const revs=this._filterMediaReviews(this._reviews).sort((a,b)=>b.start_time-a.start_time); title='Reviews'; count=revs.length;
      content=revs.length ? revs.map(r=>{ const sev=r.severity==='alert'?'alert':'detection'; const objs=this._reviewLabelList(r).map(x=>this._filterDisplayName('label',x)).join(', '); const title=r.data?.metadata?.title||objs||cap(r.severity); const firstDet=(r.data?.detections&&r.data.detections[0])||''; const reviewed=r.has_been_reviewed; const reviewThumbUrl=firstDet?this._mediaForEvent({id:firstDet,camera:r.camera},'thumbnail.jpg'):''; const thumb=firstDet?`<div class="rev-th"><img src="${reviewThumbUrl}" data-frigate-thumb="1" data-thumb-src="${reviewThumbUrl}" loading="lazy"><div class="tph thumb-fallback" style="display:none">${ICONS.reviews}</div></div>`:''; return `<div class="rev ${sev}" data-review-id="${r.id}" ${firstDet?`data-review-open="${firstDet}"`:''}><div class="rev-sev ${sev}"></div>${thumb}<div class="rev-inf"><div class="rev-t">${title}</div><div class="rev-m">${this._time(r.start_time)} · ${cap(sev)}${reviewed?' · ✓':firstDet?' · tap':''}</div></div>${reviewed?'':`<button class="ico" data-mark>${ICONS.reviews}</button>`}</div>`; }).join('') : this._emptyState(ICONS.reviews,'No reviews match','Try changing the filters');
    } else return;

    // IMPORTANT: never replace the filter panel merely because clips/recordings
    // refreshed in the background. Native iOS date/time pickers are attached to
    // the exact input DOM node; replacing the gallery used to destroy that node
    // and instantly dismiss the picker. Build the shell once, then update only
    // the header/count/results around the stable panel.
    let head=gallery.querySelector('.media-gallery-head');
    let panel=gallery.querySelector('#media-filter-panel');
    let grid=gallery.querySelector('.media-gallery-grid');
    if(!head || !panel || !grid) {
      gallery.innerHTML=`<div class="media-gallery-head"><div class="media-gallery-head-left"><span class="section-label"></span><button id="media-filter-btn" class="media-gallery-filter-btn" title="Filter" aria-label="Filter">${ICONS.filter}<span>Filter</span></button></div><span class="media-gallery-count"></span></div><div id="media-filter-panel" class="media-filter-panel"></div><div class="media-gallery-grid"></div>`;
      head=gallery.querySelector('.media-gallery-head');
      panel=gallery.querySelector('#media-filter-panel');
      grid=gallery.querySelector('.media-gallery-grid');
    }
    const label=head?.querySelector('.section-label'); if(label) label.textContent=title;
    const countEl=head?.querySelector('.media-gallery-count'); if(countEl) countEl.textContent=String(count);
    const filterBtn=head?.querySelector('#media-filter-btn'); if(filterBtn) filterBtn.classList.toggle('active',activeFilters);
    if(grid) grid.innerHTML=content;
    this._renderMediaFilter(force);
  },

_mediaCameraDisplay(camera) {
    const key=String(camera||'');
    const cfg=this._config?.cameras?.find(c=>String(this._camCache[c.entity]?.cam||'')===key);
    return cfg ? (cfg.name||cap(camDisplayName(cfg))) : cap(key.replace(/_/g,' '));
  }
};
