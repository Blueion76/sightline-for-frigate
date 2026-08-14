/**
 * Frigate event/recording/review loading, calendar activity, subscriptions, and refresh scheduling.
 *
 * Methods are composed onto SightlineCard.prototype; method names are kept
 * stable so existing card behavior and tests remain unchanged.
 */
export const dataLoadingMethods = {
_isNowWindow() {
    const now=Math.floor(Date.now()/1000);
    // The LIVE timeline is centered on `now`, so its newest window edge is
    // intentionally ~5 minutes in the future. Comparing only _winEnd to now
    // therefore made the card think a true LIVE view was *not* a now-window,
    // which disabled the periodic Frigate refresh after startup.
    if (this._timelineFollowingLive) return true;
    const focus=Number(this._timelineFocusTs);
    if (Number.isFinite(focus) && Math.abs(focus-now)<120) return true;
    return Number(this._winStart)<=now+120 && Number(this._winEnd)>=now-120;
  },

async _loadWindow(replace, initialFullDay=false, timelineOnly=false) {
    const requestSeq = ++this._timelineLoadSeq;
    const activeEntity = this._activeCam?.entity || '';
    const { clientId, cam } = this._cc();
    if (!clientId || !cam) return;
    const visibleSpan=Math.max(300,this._winEnd-this._winStart);
    const now=Math.floor(Date.now()/1000);
    // Keep the normal timeline fetch tight. A huge prefetch made rapid scrubs
    // compete with each other on slower Frigate/HA installs and increased the
    // chance that a late response would arrive after the user had moved again.
    const buffer=Math.min(30*60,Math.max(visibleSpan,10*60));
    const browseSpan=Math.max(3600,Number(this._config.window_hours||24)*3600);
    // Media-browser queries are deliberately independent from the visible
    // timeline viewport. On wide layouts the timeline remains on-screen while
    // Clips/Recordings/Reviews occupy the adjacent column, so opening a browser
    // must never repurpose _winStart/_winEnd (and therefore never zoom the
    // timeline out to window_hours / 24h). A selected browser date/time range
    // is used only for the Frigate data query.
    const mediaBounds=(!timelineOnly && this._galleryMode) ? this._mediaQueryBounds(now) : null;
    const after=mediaBounds
      ? mediaBounds.start
      : (initialFullDay ? Math.max(0, now-browseSpan) : Math.max(0,Math.floor(this._winStart-buffer)));
    // A lightweight LIVE refresh should describe data Frigate could actually
    // have finalized, not the intentional future half of the timeline view.
    const before=mediaBounds
      ? mediaBounds.end
      : (initialFullDay ? now : (timelineOnly && this._timelineFollowingLive
        ? now
        : Math.floor(this._winEnd+buffer)));
    // Do not let a slow request for an old scrub position overwrite the
    // currently visible range. Advanced Camera Card uses the same principle:
    // timeline range changes are data-source changes, not just CSS changes.
    try {
      // Mirror Advanced Camera Card's Frigate engine: event queries explicitly
      // ask for clips, while the recording browser uses Frigate's hourly
      // recordings summary. Raw recording segments remain the authoritative
      // source for timeline drawing and exact playback seeking.
      // Keep the three Frigate data sources independent. A recordings-summary
      // command is not available in every HA/Frigate integration combination;
      // it must never suppress otherwise-valid clips or raw recording segments.
      const requests=[
        this._ws({ type:'frigate/events/get', instance_id:clientId, cameras:[cam], after, before, limit:500, has_clip:true }),
        this._ws({ type:'frigate/recordings/get', instance_id:clientId, camera:cam, after, before })
      ];
      // Summary is useful for the Recordings browser, but it is unnecessary
      // overhead for high-frequency moving-timeline refreshes.
      if (!timelineOnly) requests.push(
        this._ws({ type:'frigate/recordings/summary', instance_id:clientId, camera:cam, timezone:this._tz() })
      );
      const settled=await Promise.allSettled(requests);
      const evResult=settled[0], recResult=settled[1], summaryResult=settled[2];
      if (
        requestSeq !== this._timelineLoadSeq ||
        activeEntity !== this._activeCam?.entity ||
        clientId !== this._cc().clientId ||
        cam !== this._cc().cam
      ) return;
      if (timelineOnly) {
        const currentFocus=Number.isFinite(Number(this._timelineFocusTs))
          ? Number(this._timelineFocusTs)
          : ((this._winStart+this._winEnd)/2);
        const liveSlack=this._timelineFollowingLive ? 15 : 0;
        // A fling can travel farther than the prefetch buffer while this request
        // is in flight. Never replace the visible recording cache with a range
        // the playhead has already left; the scheduler will immediately request
        // the newest position instead.
        if (currentFocus < after || currentFocus > before+liveSlack) {
          this._timelineDynamicPending=true;
          return;
        }
      }
      if (evResult.status==='fulfilled') {
        const incomingEvents = Array.isArray(evResult.value) ? evResult.value : [];
        const eventMap = new Map((this._events||[]).map(x=>[String(x.id),x]));
        for (const item of incomingEvents) eventMap.set(String(item.id), item);
        this._events = [...eventMap.values()];
      } else {
        console.warn('[Frigate] clips query failed', evResult.reason);
      }
      if (recResult.status==='fulfilled') {
        this._recordings = Array.isArray(recResult.value) ? recResult.value : [];
        this._recordingsLoaded = true;
        // Track the exact wall-clock interval this recording result represents.
        // A fast fling can move the viewport beyond this interval before the
        // debounced Frigate query for the new position returns. Unknown time
        // must never be rendered as a real "No Recording" gap.
        this._recordingsRangeStart = after;
        this._recordingsRangeEnd = before;
        this._recordingsLoadedAt = Date.now();
      } else {
        console.warn('[Frigate] recording segments query failed', recResult.reason);
      }
      if (!timelineOnly) {
        if (summaryResult?.status==='fulfilled') {
          this._recordingBrowse = this._recordingHoursFromSummary(summaryResult.value, after, before);
        } else {
          // The raw segments remain a fully usable browser fallback.
          this._recordingBrowse = this._mergeRecs(this._recordings||[]);
          console.warn('[Frigate] recordings summary unavailable; using segments', summaryResult?.reason);
        }
      }
      this._timelineDataDirty = true;
      this._mergeLoadedFilterMetadata(this._cc(), this._events, this._reviews);
    } catch(e) {
      if (requestSeq !== this._timelineLoadSeq) return;
      console.warn('[Frigate] timeline range load failed', e);
    }
    const ent=this._activeCam?.entity;
    if (ent&&this._camCache[ent]) { this._camCache[ent].events=this._events; this._camCache[ent].recordings=this._recordings; this._camCache[ent].recordingsLoaded=this._recordingsLoaded; this._camCache[ent].recordingsRangeStart=this._recordingsRangeStart; this._camCache[ent].recordingsRangeEnd=this._recordingsRangeEnd; this._camCache[ent].recordingsLoadedAt=this._recordingsLoadedAt; }
    if (!timelineOnly && this._tab==='reviews') await this._loadReviews();
    if (requestSeq !== this._timelineLoadSeq) return;
    if (!timelineOnly && this._eventsMode==='all') this._loadAllCamsBackground();
    // Clips/Recordings are fed by _loadWindow(), including the periodic refresh
    // timer. While a native picker is open, accept/cache the fresh data but do
    // not let the normal _renderAll() path mutate any visible card DOM. Reviews
    // does not use this path, which is why it appeared stable before this fix.
    if(!timelineOnly && this._mediaPickerActive && this._galleryMode) {
      this._mediaPickerPendingGalleryRender=true;
      return;
    }
    if (timelineOnly) {
      // The moving-window refresh is deliberately surgical: reconcile just the
      // timeline so new events/recording bars/gaps appear while the gesture or
      // LIVE motion is still happening. Stable-key reconciliation preserves
      // existing thumbnail DOM and avoids the old pop/reload behavior.
      this._scheduleTimelineRender(false);
      this._updateTimelineLive();
      this._renderRange();
      this._renderTimelineZoomLabel();
    } else if (this._timelineInteracting) {
      this._scheduleTimelineRender(false);
      this._updateTimelineLive();
      this._renderRange();
      this._renderTimelineZoomLabel();
    } else {
      this._renderAll();
    }
  },

async _loadAllCamsBackground() {
    const loadSeq=this._timelineLoadSeq;
    const after=this._winStart, before=this._winEnd;
    const others = this._config.cameras.filter(c => {
      const cc = this._camCache[c.entity];
      return c.entity !== this._activeCam?.entity && cc && cc.discovered;
    });
    await Promise.all(others.map(async c => {
      const cc = this._camCache[c.entity];
      try {
        const ev = await this._ws({type:'frigate/events/get',instance_id:cc.clientId,cameras:[cc.cam],after,before,limit:200});
        cc.events = Array.isArray(ev) ? ev : [];
        this._mergeLoadedFilterMetadata(cc, cc.events, cc.reviews||[]);
      } catch(_) {}
    }));
    if (loadSeq !== this._timelineLoadSeq || this._eventsMode!=='all') return;
    this._renderList();
  },

async _loadKept() {
    const {clientId,cam}=this._cc();
    try {
      const k=await this._ws({type:'frigate/events/get',instance_id:clientId,cameras:[cam],favorites:true,limit:200});
      this._kept=Array.isArray(k)?k:[];
      const ent=this._activeCam?.entity; if(ent&&this._camCache[ent]) this._camCache[ent].kept=this._kept;
    } catch(_) { this._kept=[]; }
  },

_recordingHoursFromSummary(summary, after, before) {
    const out=[];
    if (!Array.isArray(summary)) return out;
    for (const dayData of summary) {
      const day=dayData?.day;
      if (!day || !Array.isArray(dayData.hours)) continue;
      for (const hourData of dayData.hours) {
        const hour=Number(hourData?.hour);
        if (!Number.isFinite(hour) || hour<0 || hour>23) continue;
        const d=new Date(`${day}T${String(hour).padStart(2,'0')}:00:00`);
        const start=Math.floor(d.getTime()/1000);
        const end=start+3600;
        if (end<=after || start>=before) continue;
        out.push({start_time:Math.max(start,after),end_time:Math.min(end,before),events:Number(hourData.events||0),camera:this._cc().cam,_summary:true});
      }
    }
    const seen=new Set();
    return out.filter(r=>{const k=`${r.start_time}-${r.end_time}`;if(seen.has(k))return false;seen.add(k);return true;}).sort((a,b)=>a.start_time-b.start_time);
  },

async _loadReviews() {
    const {clientId,cam}=this._cc();
    try {
      const now=Math.floor(Date.now()/1000);
      const currentWindow=this._isNowWindow();
      const galleryRange=!!this._galleryMode;
      const browseSpan=Math.max(3600,Number(this._config.window_hours||24)*3600);
      const mediaBounds=galleryRange ? this._mediaQueryBounds(now) : null;
      const after=mediaBounds ? mediaBounds.start : (currentWindow ? now-browseSpan : this._winStart);
      const before=mediaBounds ? mediaBounds.end : (currentWindow ? now : this._winEnd);
      const r=await this._ws({type:'frigate/reviews/get',instance_id:clientId,cameras:[cam],after,before,limit:500});
      this._reviews=Array.isArray(r)?r:[];
      const active=this._cc();
      active.reviews=this._reviews;
      this._mergeLoadedFilterMetadata(active, this._events, this._reviews);
    } catch(_) { this._reviews=[]; }
  },

async _loadCalendar() {
    const {clientId,cam}=this._cc();
    try {
      const sum=await this._ws({type:'frigate/events/summary',instance_id:clientId,timezone:this._tz()});
      if(Array.isArray(sum)) this._daysWithActivity=new Set(sum.filter(s=>s.camera===cam&&s.day).map(s=>s.day));
    } catch(_) {}
  },

_tz() { return this._hass?.config?.time_zone||Intl.DateTimeFormat().resolvedOptions().timeZone||'UTC'; },

async _subscribe() {
    const {clientId}=this._cc(); if(!this._hass?.connection||!clientId) return;
    try {
      this._unsub=this._hass.connection.subscribeMessage(
        msg=>{ if(msg?.type==='end'&&this._isNowWindow()) this._scheduleReload(); },
        {type:'frigate/events/subscribe',instance_id:clientId}
      );
    } catch(_) {}
  },

_scheduleReload() { clearTimeout(this._rt); this._rt=setTimeout(()=>this._loadWindow(true),1500); }
};
