/**
 * Media browser navigation, delegated clicks, tabs, and gallery-mode transitions.
 *
 * Methods are composed onto SightlineCard.prototype; method names are kept
 * stable so existing card behavior and tests remain unchanged.
 */
import { ICONS } from '../../constants.js';

export const mediaNavigationMethods = {
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
      // Event media is a workspace-level playback action. In Multiview the
      // grid is the return target, not a per-camera playback surface. Routing
      // every browser event through `_open()` keeps Clips aligned with timeline
      // and Review playback, and lets playback-layout.js temporarily replace
      // the complete player until Back to Multiview is selected.
      return this._open(card.dataset.ev);
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
