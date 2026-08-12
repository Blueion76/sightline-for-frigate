import { VERSION, CARD_TAG, DAY, DEFAULT_ROTATE_S, ICONS, LABEL_COLORS, PALETTE, TIMELINE_GLYPHS, CAM_COLORS } from '../constants.js';
import { cap, parseWs, labelColor, timelineGlyph, mkCamState, camDisplayName } from '../helpers.js';
import { STYLES } from '../styles.js';

// Prototype methods grouped by responsibility.
export const browserMethods = {
_mediaTemporalInput(target) {
    const el=target?.nodeType===1 ? target : null;
    if(!el?.matches) return null;
    if(el.matches('#media-filter-date,#media-filter-time-start,#media-filter-time-end')) return el;
    // A tap on the calendar glyph / From / To label still opens the nested
    // native control. Treat the entire wrapper as the input hit target.
    const control=el.closest?.('.media-filter-date-control,.media-filter-time-control');
    if(!control) return null;
    const input=control.querySelector?.('input[type="date"],input[type="time"]');
    return input||null;
  },

_beginMediaPicker(input) {
    if(!input) return;
    clearTimeout(this._mediaPickerReleaseTimer);
    this._mediaPickerReleaseTimer=null;
    this._mediaPickerActive=true;
    this._mediaPickerActiveId=input.id||'';
  },

_scheduleMediaPickerRelease(delay=260) {
    clearTimeout(this._mediaPickerReleaseTimer);
    this._mediaPickerReleaseTimer=setTimeout(()=>{
      this._mediaPickerReleaseTimer=null;
      this._mediaPickerActive=false;
      this._mediaPickerActiveId='';
      // Clips/Recordings use _loadWindow(), which can refresh the result grid
      // while a native iOS picker is open. Freeze the *entire* gallery DOM
      // during that ownership window and flush it only after dismissal. This
      // is intentionally stronger than merely preserving the input node: iOS
      // can dismiss its popover when an ancestor's layout/content changes.
      if(this._mediaPickerPendingGalleryRender) {
        this._mediaPickerPendingGalleryRender=false;
        this._mediaPickerPendingFilterRender=false;
        this._renderGallery(true);
      } else if(this._mediaPickerPendingFilterRender) {
        this._mediaPickerPendingFilterRender=false;
        this._renderMediaFilter(true);
      }
      this._syncStatus();
      if(this._config?.theme==='auto') this._applyCardStyle();
      if(this._cardWidth>=560) this._syncColHeight();
    }, Math.max(0,Number(delay)||0));
  },

_change(e) {
    const t=e?.target;
    if(!t) return;
    let key=null, value='';
    if(t.id==='media-filter-date'){ key='date'; value=t.value||'all'; }
    else if(t.id==='media-filter-time-start'){ key='timeStart'; value=t.value||''; }
    else if(t.id==='media-filter-time-end'){ key='timeEnd'; value=t.value||''; }
    if(!key) return;

    // Never blur a native temporal input from its own change handler. iOS time
    // wheels can emit `change` while the system picker is still onscreen; the
    // old blur + 300ms forced repaint was therefore closing the picker itself.
    this._beginMediaPicker(t);
    clearTimeout(this._mediaPickerApplyTimer);
    this._mediaPickerApplyTimer=null;

    // Apply/query the new timestamp immediately, but keep the visible gallery
    // frozen while iOS owns the native picker. _loadWindow/_loadReviews may
    // refresh their caches; _renderGallery/_renderMediaFilter will queue paint
    // until the next page interaction after the picker is dismissed.
    Promise.resolve(this._setMediaTemporal(key,value)).catch(err=>
      console.warn('[Frigate] temporal media filter update failed',err)
    );

    // Desktop date/time popovers commit on close, so a short release is safe.
    // iOS/WKWebView must remain sticky: its time wheel may keep firing change
    // events before the user taps Done. The next pointer/touch outside the
    // control releases the lock and paints the already-loaded filtered results.
    if(!this._isIOSRecordingPlatform()) this._scheduleMediaPickerRelease(260);
  },

_click(e) {
    const galleryTab = e.target.closest('[data-gallery-tab]');
    if (galleryTab) return this._setGalleryMode(galleryTab.dataset.galleryTab);
    if (e.target.closest('#sc-talk')) return this._toggleTalk();
    if (e.target.closest('#sc-fs')) {
      const target=this._viewMode==='grid' ? this.shadowRoot.querySelector('#cam-grid') : this.shadowRoot.querySelector('#eng-wrap');
      return this._fullscreen(target);
    }
    if (e.target.closest('#media-filter-btn')) return this._toggleMediaFilter();
    const mf=e.target.closest('[data-mf]'); if (mf) { this._setMediaFilter(mf.dataset.mf, mf.dataset.mv); return; }
    if (e.target.closest('#media-filter-reset')) { this._resetMediaFilter(); return; }
    if (e.target.closest('#filter-btn')) return this._toggleFilter();
    if (e.target.closest('#cal-btn')) return this._toggleCal();
    if (e.target.closest('#now-btn')) return this._goNow();
    if (e.target.closest('#tl-zoom-in')) return this._zoomTimeline(1.35);
    if (e.target.closest('#tl-zoom-out')) return this._zoomTimeline(1/1.35);
    if (e.target.closest('#tl-zoom-level')) return this._resetTimelineZoom();
    if (e.target.closest('#rotate-btn')) return this._toggleRotate();
    if (e.target.closest('[data-mark-all]')) return this._markAll();
    if (e.target.closest('[data-toggle-reviewed]')) { this._showReviewed=!this._showReviewed; this._renderList(); return; }

    const setvm = e.target.closest('[data-setviewmode]'); if (setvm) return this._setViewMode(setvm.dataset.setviewmode);
    const viewm = e.target.closest('[data-viewmode]'); if (viewm) return this._setViewMode(viewm.dataset.viewmode);
    const camTab = e.target.closest('[data-camidx]'); if (camTab) return this._switchCamera(Number(camTab.dataset.camidx));
    const calDay = e.target.closest('[data-cal-day]'); if (calDay) return this._pickDay(calDay.dataset.calDay);
    const calNav = e.target.closest('[data-cal-nav]'); if (calNav) return this._calNav(Number(calNav.dataset.calNav));
    const fopt = e.target.closest('[data-flabel]'); if (fopt) { this._filterLabel=fopt.dataset.flabel; this._applyLiveFilterChange(); return; }
    const faceOpt = e.target.closest('[data-fface]'); if (faceOpt) { this._filterFace=faceOpt.dataset.fface; this._applyLiveFilterChange(); return; }
    const zopt = e.target.closest('[data-fzone]'); if (zopt) { this._filterZone=zopt.dataset.fzone; this._applyLiveFilterChange(); return; }
    const favo = e.target.closest('[data-favonly]'); if (favo) { this._favOnly=favo.dataset.favonly==='1'; this._applyLiveFilterChange(); return; }

    const rangeDl = e.target.closest('[data-range-download]'); if (rangeDl) { e.stopPropagation(); return this._confirmDownloadRangePicker(); }
    const rangeCancel = e.target.closest('[data-range-cancel]'); if (rangeCancel) { e.stopPropagation(); return this._cancelDownloadRangePicker(); }
    const recDl = e.target.closest('[data-rec-download]'); if (recDl) { e.stopPropagation(); const ts=this._scrubTarget||this._timelineFocusTs||this._playing?.rec||Math.floor(Date.now()/1000); return this._enterDownloadRangePicker(ts); }
    const dl = e.target.closest('[data-dl]'); if (dl) { e.stopPropagation(); return this._download(dl.dataset.dl,dl.dataset.dlFile); }
    const fav = e.target.closest('[data-fav]'); if (fav) { e.stopPropagation(); return this._toggleFav(fav.dataset.fav); }
    const revMark = e.target.closest('[data-mark]'); if (revMark) { const rv=revMark.closest('[data-review-id]'); e.stopPropagation(); if(rv) return this._markReviewed(rv.dataset.reviewId); }
    const revOpen = e.target.closest('[data-review-open]'); if (revOpen) return this._showClipById(revOpen.dataset.reviewOpen);
    const pill = e.target.closest('[data-tab]'); if (pill) return this._setTab(pill.dataset.tab);
    const timelinePreview = e.target.closest('.t-preview[data-event-id]');
    if (timelinePreview) return this._activateTimelineEvent(timelinePreview.dataset.eventId);
    const tick = e.target.closest('[data-tick]');
    if (tick) return this._activateTimelineEvent(tick.dataset.tick);
    // Stop seek-bar clicks from bubbling up to the recording row handler
    if (e.target.closest('.rec-seek-wrap')) return;
    const recRow = e.target.closest('[data-rs]'); if (recRow) return this._toggleRecSeek(recRow);
    const restoreSlot = e.target.closest('[data-restore-slot]');
    if (restoreSlot) { e.stopPropagation(); this._mountGrid(); return; }
    // per-slot fullscreen (from innerHTML-created button in _openInGridSlot)
    const slotFs = e.target.closest('[data-slot-fs]');
    if (slotFs) { e.stopPropagation(); this._fullscreen(slotFs.closest('.grid-slot')); return; }
    // whole-grid fullscreen
    const gridFs = e.target.closest('[data-grid-fs]');
    if (gridFs) { e.stopPropagation(); this._fullscreen(this.shadowRoot.querySelector('#cam-grid')); return; }
    const card = e.target.closest('[data-ev]'); if (card) {
      if (this._viewMode === 'grid') {
        this._openInGridSlot(card.dataset.ev);
      } else {
        this._open(card.dataset.ev);
      }
    }
  },

async _setGalleryMode(tab) {
    // Gallery navigation is intentionally a two-phase update: establish the
    // final layout synchronously, then load/paint asynchronous review data.
    // This prevents the first Reviews tap from briefly rendering against the
    // old timeline height and then only looking correct after a second tap.
    const gallery = this.shadowRoot.querySelector('#media-gallery');
    const timeline = this.shadowRoot.querySelector('#timeline-view');

    if (tab === 'live') {
      this._galleryMode = '';
      this._tab = 'live';
      // Returning from Clips/Recordings/Reviews always starts the timeline at
      // the current time with the standard 10-minute viewport. Do not reuse
      // the gallery's 24-hour data window as the visible timeline range.
      this._resetTimelineToNow10m();
      if (gallery) { gallery.classList.remove('open'); gallery.innerHTML=''; }
      this._syncResponsiveWorkspace();
      this._showLive();
      this._renderStreamCtrl();
      requestAnimationFrame(() => {
        this._renderTimeline(true);
        this._renderRange();
        this._renderTimelineZoomLabel();
        this._syncColHeight();
      });
      this._loadWindow(true);
      return;
    }

    // If timeline/clip playback is active, leave playback *before* opening the
    // requested gallery. Previously the gallery was constructed first and then
    // _showLive() cleared it, so the first Clips/Recordings/Reviews click after
    // a timeline seek appeared to do nothing and a second click was required.
    // Also cancel a pending desktop wheel-settle callback so it cannot reopen a
    // recording after the gallery has been selected.
    clearTimeout(this._wt);
    this._wt=null;
    this._timelineInteracting=false;
    this._downloadRange=null;
    ++this._timelineSeekSeq;
    if (this._playing || this._activePlaybackCleanup || this._playbackSession) {
      this._showLive();
    }

    this._galleryMode = tab;
    this._tab = tab;
    // Browser filters default to All, never Today. The media browser queries
    // its own rolling window while the timeline retains its exact zoom/focus.
    // This is required for the wide workspace where both panes are visible.
    this._syncResponsiveWorkspace();
    if (gallery) {
      gallery.classList.add('open');
      gallery.innerHTML = `<div class="media-gallery-head"><div class="media-gallery-head-left"><span class="section-label">${tab==='clips'?'Clips':tab==='recordings'?'Recordings':'Reviews'}</span><button id="media-filter-btn" class="media-gallery-filter-btn" title="Filter" aria-label="Filter">${ICONS.filter}<span>Filter</span></button></div><span class="media-gallery-count">…</span></div><div id="media-filter-panel" class="media-filter-panel"></div><div class="media-gallery-grid"><div class="empty-state">Loading…</div></div>`;
    }
    // Update navigation before async work so the selected state is stable on
    // the very first tap.
    this._renderStreamCtrl();
    requestAnimationFrame(() => this._syncColHeight());

    const requestedTab = tab;
    if (tab === 'reviews') {
      await this._loadReviews();
      // Do not let a slower Reviews request overwrite a later Live/Clips tap.
      if (this._galleryMode === requestedTab) this._renderGallery();
    } else {
      // Clips and Recordings are browser views, not just alternate renderings of
      // the current timeline cache. Fetch the selected day/range on entry so a
      // timeline scrub cannot leave either browser empty or scoped to 10 minutes.
      await this._loadWindow(true);
      if (this._galleryMode === requestedTab) this._renderGallery();
    }
    requestAnimationFrame(() => {
      this._syncColHeight();
      const g=this.shadowRoot.querySelector('#media-gallery');
      if (g && this._galleryMode===tab) {
        g.classList.add('open');
        // Force a single post-image/layout reconciliation. This is deliberately
        // one frame, not a continuous observer, to avoid timeline-style churn.
        requestAnimationFrame(() => this._syncColHeight());
      }
    });
  },

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

_mediaFilterActive() {
    const f=this._mediaFilter;
    const cameraActive=this._eventsMode==='all' && (this._config?.cameras?.length||0)>1 && f.camera!=='all';
    return cameraActive||f.label!=='all'||f.face!=='all'||f.zone!=='all'||f.favorites||f.reviewed!=='all'||f.severity!=='all'||f.duration!=='all'||f.date!=='all'||!!f.timeStart||!!f.timeEnd;
  },

_mediaCameraDisplay(camera) {
    const key=String(camera||'');
    const cfg=this._config?.cameras?.find(c=>String(this._camCache[c.entity]?.cam||'')===key);
    return cfg ? (cfg.name||cap(camDisplayName(cfg))) : cap(key.replace(/_/g,' '));
  },

_mediaFilterValues() {
    const f=this._mediaFilter;
    const baseEvents=this._eventsMode==='all'?this._allDisplayEvents():(this._events||[]);
    const baseReviews=this._reviews||[];
    const cams=new Set();
    for(const e of baseEvents) if(e?.camera) cams.add(String(e.camera));
    for(const r of baseReviews) if(r?.camera) cams.add(String(r.camera));
    if(this._cc().cam) cams.add(String(this._cc().cam));
    const selectedCamera=f.camera!=='all'?String(f.camera):null;
    const labels=new Set(), faces=new Set(), zones=new Set();
    const states=this._config.cameras.map(c=>this._camCache[c.entity]).filter(cc=>cc&&cams.has(String(cc.cam||''))&&(!selectedCamera||String(cc.cam)===selectedCamera));
    for(const cc of states) {
      for(const l of (cc.filterLabels||[])) { const label=this._normalizeObjectLabel(l); if(label) labels.add(label); }
      for(const face of (cc.filterFaces||[])) if(face) faces.add(String(face));
      for(const z of (cc.filterZones||[])) if(z) zones.add(String(z));
    }
    for(const e of baseEvents) {
      if(selectedCamera&&String(e?.camera)!==selectedCamera) continue;
      { const label=this._normalizeObjectLabel(e?.label); if(label) labels.add(label); }
      for(const face of this._eventFaceList(e)) faces.add(face);
      for(const z of this._eventZoneList(e)) zones.add(z);
    }
    for(const r of baseReviews) {
      if(selectedCamera&&r?.camera&&String(r.camera)!==selectedCamera) continue;
      for(const l of this._reviewLabelList(r)) labels.add(l);
      for(const face of this._reviewFaceList(r)) faces.add(face);
      for(const z of this._reviewZoneList(r)) zones.add(z);
    }
    return {cams:[...cams].sort(),labels:[...labels].sort(),faces:[...faces].sort((a,b)=>String(a).localeCompare(String(b))),zones:[...zones].sort()};
  },

_normalizeMediaFilterState() {
    let v=this._mediaFilterValues(), f=this._mediaFilter;
    const canFilterCamera=this._eventsMode==='all' && (this._config?.cameras?.length||0)>1;
    if(!canFilterCamera) f.camera='all';
    else if(f.camera!=='all'&&!v.cams.includes(f.camera)) { f.camera='all'; v=this._mediaFilterValues(); }
    if(f.label!=='all'&&!v.labels.includes(f.label)) f.label='all';
    if(f.face!=='all'&&!v.faces.includes(f.face)) f.face='all';
    if(f.zone!=='all'&&!v.zones.includes(f.zone)) f.zone='all';
    return v;
  },

_mediaDateBounds(date) {
    if (!date || date==='all') return null;
    const parts=String(date).split('-').map(Number);
    if (parts.length!==3 || parts.some(n=>!Number.isFinite(n))) return null;
    const [y,mo,d]=parts;
    const start=Math.floor(new Date(y,mo-1,d,0,0,0,0).getTime()/1000);
    const end=Math.floor(new Date(y,mo-1,d+1,0,0,0,0).getTime()/1000);
    return Number.isFinite(start)&&Number.isFinite(end)?{start,end,y,mo,d}:null;
  },

_mediaTimeParts(value) {
    const m=String(value||'').match(/^(\d{1,2}):(\d{2})$/);
    if(!m) return null;
    const h=Number(m[1]), min=Number(m[2]);
    return h>=0&&h<=23&&min>=0&&min<=59?{h,min,minutes:h*60+min}:null;
  },

_mediaAbsoluteBounds() {
    const f=this._mediaFilter, b=this._mediaDateBounds(f.date);
    if(!b) return null;
    const a=this._mediaTimeParts(f.timeStart), z=this._mediaTimeParts(f.timeEnd);
    const startDate=new Date(b.y,b.mo-1,b.d,a?.h??0,a?.min??0,0,0);
    let endDate=new Date(b.y,b.mo-1,b.d,z?.h??24,z?.min??0,0,0);
    if(!z) endDate=new Date(b.y,b.mo-1,b.d+1,0,0,0,0);
    else if(a && z.minutes<=a.minutes) endDate=new Date(b.y,b.mo-1,b.d+1,z.h,z.min,0,0); // overnight range
    const start=Math.floor(startDate.getTime()/1000), end=Math.floor(endDate.getTime()/1000);
    return Number.isFinite(start)&&Number.isFinite(end)&&end>start?{start,end}:b;
  },

_mediaQueryBounds(now=Math.floor(Date.now()/1000)) {
    const abs=this._mediaAbsoluteBounds();
    if(abs) {
      const start=Math.max(0,Math.floor(abs.start));
      const end=Math.max(start+1,Math.min(now,Math.floor(abs.end)));
      return {start,end};
    }
    const span=Math.max(3600,Number(this._config?.window_hours||24)*3600);
    return {start:Math.max(0,now-span),end:now};
  },

_mediaMatchesTimeOfDay(ts) {
    const f=this._mediaFilter, a=this._mediaTimeParts(f.timeStart), z=this._mediaTimeParts(f.timeEnd);
    if(!a&&!z) return true;
    const d=new Date(Number(ts)*1000); if(!Number.isFinite(d.getTime())) return false;
    const m=d.getHours()*60+d.getMinutes();
    if(a&&z) return z.minutes>a.minutes ? (m>=a.minutes&&m<=z.minutes) : (m>=a.minutes||m<=z.minutes);
    if(a) return m>=a.minutes;
    return m<=z.minutes;
  },

_filterByMediaTemporal(items,date,endKey='end_time') {
    const abs=this._mediaAbsoluteBounds();
    if(abs) {
      return (items||[]).filter(x=>{
        const st=Number(x?.start_time), en=Number(x?.[endKey] ?? st);
        return Number.isFinite(st)&&Number.isFinite(en)&&en>=abs.start&&st<abs.end;
      });
    }
    // "All dates" keeps the browser's rolling 24h data set; a time range in
    // that mode is a time-of-day filter across those loaded items.
    return (items||[]).filter(x=>this._mediaMatchesTimeOfDay(Number(x?.start_time)));
  },

async _setMediaTemporal(key,value) {
    if(key==='date') this._mediaFilter.date=value||'all';
    else if(key==='timeStart'||key==='timeEnd') this._mediaFilter[key]=value||'';
    // Browser date/time filtering changes only the browser query. The visible
    // timeline keeps its own zoom/focus range, which is especially important
    // when both are visible together in the wide workspace.
    const tab=this._galleryMode;
    if(!tab){ this._renderGallery(); return; }
    if(tab==='reviews') await this._loadReviews();
    else await this._loadWindow(true);
    if(this._galleryMode===tab) {
      this._renderGallery();
      const p=this.shadowRoot.querySelector('#media-filter-panel');
      if(p) p.classList.add('open');
    }
  },

async _setMediaDate(date) { return this._setMediaTemporal('date',date||'all'); },

_filterMediaEvents(events) {
    const f=this._mediaFilter; let list=this._filterByMediaTemporal((events||[]).filter(e=>e.has_clip!==false),f.date);
    if(f.camera!=='all') list=list.filter(e=>e.camera===f.camera);
    if(f.label!=='all') list=list.filter(e=>this._normalizeObjectLabel(e?.label)===f.label);
    if(f.face!=='all') list=list.filter(e=>this._eventFaceList(e).includes(f.face));
    if(f.zone!=='all') list=list.filter(e=>this._eventZoneList(e).includes(f.zone));
    if(f.favorites) list=list.filter(e=>e.retain_indefinitely||e.is_favorite||e.favorite);
    return list;
  },

_filterMediaRecordings(records) {
    const f=this._mediaFilter; let list=this._filterByMediaTemporal(records||[],f.date);
    if(f.camera!=='all') list=list.filter(r=>!r.camera||r.camera===f.camera);
    if(f.duration==='short') list=list.filter(r=>(r.end_time-r.start_time)<60);
    if(f.duration==='medium') list=list.filter(r=>(r.end_time-r.start_time)>=60&&(r.end_time-r.start_time)<300);
    if(f.duration==='long') list=list.filter(r=>(r.end_time-r.start_time)>=300);
    if(f.favorites) list=list.filter(r=>r.retain_indefinitely||r.favorite||r.is_favorite);
    return list;
  },

_filterMediaReviews(reviews) {
    const f=this._mediaFilter; let list=this._filterByMediaTemporal(reviews||[],f.date);
    if(f.camera!=='all') list=list.filter(r=>!r.camera||r.camera===f.camera);
    if(f.label!=='all') list=list.filter(r=>this._reviewLabelList(r).includes(f.label));
    if(f.face!=='all') list=list.filter(r=>this._reviewFaceList(r).includes(f.face));
    if(f.zone!=='all') list=list.filter(r=>this._reviewZoneList(r).includes(f.zone));
    if(f.reviewed==='unreviewed') list=list.filter(r=>!r.has_been_reviewed);
    if(f.reviewed==='reviewed') list=list.filter(r=>!!r.has_been_reviewed);
    if(f.severity!=='all') list=list.filter(r=>r.severity===f.severity);
    return list;
  },

_toggleMediaFilter() {
    const p=this.shadowRoot.querySelector('#media-filter-panel'); if(!p) return;
    const opening=!p.classList.contains('open');
    if(opening) this._loadFrigateFilterMetadata();
    p.classList.toggle('open');
    this._renderMediaFilter();
  },

_setMediaFilter(key,value) {
    if(key==='date') return this._setMediaDate(value);
    if(key==='timeStart' && value===''){
      this._mediaFilter.timeStart=''; this._mediaFilter.timeEnd='';
      return this._setMediaTemporal('timeStart','');
    }
    if(key==='favorites') this._mediaFilter.favorites=value==='1'; else this._mediaFilter[key]=value;
    this._normalizeMediaFilterState();
    this._renderGallery(); const p=this.shadowRoot.querySelector('#media-filter-panel'); if(p) p.classList.add('open');
  },

_resetMediaFilter() {
    // Reset browser filters without touching the timeline viewport.
    this._mediaFilter={camera:'all',label:'all',face:'all',zone:'all',favorites:false,reviewed:this._config?.media?.reviewed_default||'all',severity:'all',duration:'all',date:'all',timeStart:'',timeEnd:''};
    const tab=this._galleryMode;
    if (tab==='reviews') this._loadReviews().then(()=>{ if(this._galleryMode===tab)this._renderGallery(); });
    else if (tab) this._loadWindow(true).then(()=>{ if(this._galleryMode===tab)this._renderGallery(); });
    else this._renderGallery();
  },

_renderMediaFilter(force=false) {
    const p=this.shadowRoot.querySelector('#media-filter-panel'); if(!p||!this._galleryMode) return;
    if(this._mediaPickerActive && !force) {
      this._mediaPickerPendingFilterRender=true;
      return;
    }
    this._mediaPickerPendingFilterRender=false;
    const wasOpen=p.classList.contains('open');
    const f=this._mediaFilter, v=this._normalizeMediaFilterState(), chip=(key,val,label,checked)=>`<button class="media-filter-chip${checked?' on':''}" data-mf="${key}" data-mv="${val}">${label}</button>`;
    const today=new Date();
    const todayStr=`${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
    const dateValue=f.date==='all'?'':f.date;
    const dateRow=`<div class="media-filter-row"><span class="media-filter-label">Date</span><button class="media-filter-chip${f.date==='all'?' on':''}" data-mf="date" data-mv="all">All dates</button><label class="media-filter-date-control"><span>${ICONS.calendar||''}</span><input id="media-filter-date" type="date" max="${todayStr}" value="${dateValue}" aria-label="Filter by date"></label>${f.date!=='all'?'<button class="media-filter-reset-date" data-mf="date" data-mv="all">Clear</button>':''}</div>`;
    const timeRow=`<div class="media-filter-row"><span class="media-filter-label">Time</span><label class="media-filter-time-control"><span>From</span><input id="media-filter-time-start" type="time" step="60" value="${f.timeStart||''}" aria-label="Start time"></label><label class="media-filter-time-control"><span>To</span><input id="media-filter-time-end" type="time" step="60" value="${f.timeEnd||''}" aria-label="End time"></label>${(f.timeStart||f.timeEnd)?'<button class="media-filter-reset-date" data-mf="timeStart" data-mv="">Clear time</button>':''}</div>`;
    const canFilterCamera=this._eventsMode==='all' && (this._config?.cameras?.length||0)>1;
    const cameraRow=canFilterCamera&&v.cams.length>1?`<div class="media-filter-row"><span class="media-filter-label">Camera</span>${chip('camera','all','All',f.camera==='all')}${v.cams.map(c=>chip('camera',c,this._mediaCameraDisplay(c),f.camera===c)).join('')}</div>`:'';
    const showObjectFilters=(this._galleryMode==='clips'||this._galleryMode==='reviews');
    const labelRow=showObjectFilters&&v.labels.length?`<div class="media-filter-row"><span class="media-filter-label">Label</span>${chip('label','all','All',f.label==='all')}${v.labels.map(x=>chip('label',x,this._filterDisplayName('label',x),f.label===x)).join('')}</div>`:'';
    const faceRow=showObjectFilters&&v.faces.length?`<div class="media-filter-row"><span class="media-filter-label">Face</span>${chip('face','all','All',f.face==='all')}${v.faces.map(x=>chip('face',x,this._faceDisplayName(x),f.face===x)).join('')}</div>`:'';
    const zoneRow=showObjectFilters&&v.zones.length?`<div class="media-filter-row"><span class="media-filter-label">Zone</span>${chip('zone','all','All',f.zone==='all')}${v.zones.map(x=>chip('zone',x,this._filterDisplayName('zone',x),f.zone===x)).join('')}</div>`:'';
    const common=this._galleryMode!=='reviews'?`<div class="media-filter-row"><span class="media-filter-label">Saved</span>${chip('favorites','0','All',!f.favorites)}${chip('favorites','1','Favorites',f.favorites)}</div>`:'';
    const duration=this._galleryMode==='recordings'?`<div class="media-filter-row"><span class="media-filter-label">Length</span>${chip('duration','all','Any',f.duration==='all')}${chip('duration','short','< 1m',f.duration==='short')}${chip('duration','medium','1–5m',f.duration==='medium')}${chip('duration','long','> 5m',f.duration==='long')}</div>`:'';
    const review=this._galleryMode==='reviews'?`<div class="media-filter-row"><span class="media-filter-label">Status</span>${chip('reviewed','unreviewed','Unreviewed',f.reviewed==='unreviewed')}${chip('reviewed','reviewed','Reviewed',f.reviewed==='reviewed')}${chip('reviewed','all','All',f.reviewed==='all')}</div><div class="media-filter-row"><span class="media-filter-label">Type</span>${chip('severity','all','All',f.severity==='all')}${chip('severity','alert','Alerts',f.severity==='alert')}${chip('severity','detection','Detections',f.severity==='detection')}</div>`:'';
    p.innerHTML=`${dateRow}${timeRow}${cameraRow}${labelRow}${faceRow}${zoneRow}${duration}${review}${common}<div class="media-filter-row"><button id="media-filter-reset" class="media-filter-reset">Reset filters</button></div>`;
    p.classList.toggle('open',wasOpen);
  },

_timelineDefaultSpanSeconds() {
    return Math.max(5*60,Math.min(60*60,Math.round(Number(this._config?.timeline?.default_minutes||10)*60)));
  },

_resetTimelineToNow10m() {
    const now=Math.floor(Date.now()/1000);
    const span=this._timelineDefaultSpanSeconds();
    this._winStart=now-span/2;
    this._winEnd=now+span/2;
    this._timelineFocusTs=now;
    this._scrubTarget=now;
    this._timelineZoom=3600/span;
    this._timelineFollowingLive=true;
    this._exhausted=false;
    this._calMonth=null;
    this._timelineDataDirty=true;
    this._renderTimelineZoomLabel();
  },

_setTab(tab) {
    this._galleryMode = '';
    const gallery=this.shadowRoot.querySelector('#media-gallery'); if(gallery) { gallery.classList.remove('open'); gallery.innerHTML=''; }
    const timeline=this.shadowRoot.querySelector('#timeline-view'); if(timeline) timeline.style.display=this._config.timeline.enabled?'':'none';
    this._syncResponsiveWorkspace();
    this._tab = tab;
    this.shadowRoot.querySelectorAll('[data-tab]').forEach(p=>p.classList.toggle('active',p.dataset.tab===tab));
    const lbl=this.shadowRoot.querySelector('#list-label');
    if (lbl) lbl.textContent=({live:'Recent events',recordings:'Recordings',clips:'Clips',snapshot:'Snapshots',reviews:'Reviews',kept:'Kept'})[tab]||tab;
    if (tab==='live') this._showLive();
    if (tab==='reviews') this._loadReviews().then(()=>this._renderList());
    if (tab==='kept') this._loadKept().then(()=>this._renderList());
    this._renderList();
  }
};
