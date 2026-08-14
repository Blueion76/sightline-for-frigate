/**
 * LIVE-edge detection, live refresh, and moving timeline-window behavior.
 *
 * Methods are composed onto SightlineCard.prototype; method names are kept
 * stable so existing card behavior and tests remain unchanged.
 */
export const timelineLiveMethods = {
_isAtLiveEdge(ts = this._timelineFocusTs) {
    const now = Math.floor(Date.now()/1000);
    return Number.isFinite(Number(ts)) && Number(ts) >= now - 2;
  },

_refreshLiveFromTimeline(opts={}) {
    // Crossing the newest/live edge is an explicit request to return to live.
    // Only remount the WebRTC player when we were actually in recorded
    // playback. If the user started from an already-live stream, keep that
    // healthy player alive; remounting it on the release event creates a race
    // with ha-camera-stream and is the source of the intermittent
    // 'Unable to start stream' state seen after timeline drags.
    const restart=opts.restart!==false;
    this._timelineFollowingLive=true;
    this._timelineInteracting=false;
    this._resetTimelineToNow10m();
    if (restart) {
      this._showLive();
    } else {
      this._playing=null;
      this._playingHour=null;
      this._playingSourceStart=null;
      this._playingSourceEnd=null; this._playingRecordings=[]; this._playingInpointOffset=0;
      this._scrubTarget=this._timelineFocusTs;
      this._galleryMode='';
      this._syncResponsiveWorkspace();
      const viewer=this.shadowRoot.querySelector('#viewer');
      if(viewer){viewer.innerHTML='';viewer.style.display='none';}
      const engine=this.shadowRoot.querySelector('#engine');
      if(engine) engine.style.display='block';
      const timeline=this.shadowRoot.querySelector('#timeline-view');
      if(timeline) timeline.style.display='';
      this._clearStatusOverlay();
      this._renderStreamCtrl();
    }
    this._loadWindow(true);
    requestAnimationFrame(() => {
      this._renderTimeline(true);
      this._renderRange();
      this._renderTimelineZoomLabel();
    });
  },

_updateTimelineLive() {
    const track=this._$('#tl-track'); if(!track) return;
    track.classList.toggle('following-live', !!this._timelineFollowingLive);
    let s=this._winStart,e=this._winEnd;
    const nowTs=Math.floor(Date.now()/1000);
    // LIVE is a true moving anchor. On the live view the scrubber stays exactly
    // on top of the red LIVE line and its HH:MM:SS value advances with the clock.
    // Once the user scrubs, _timelineFollowingLive is false and the selected
    // playback timestamp is left untouched.
    if (this._timelineFollowingLive && !this._timelineInteracting) {
      // Follow LIVE without destroying the user's zoom level. The previous
      // implementation hard-coded a 10-minute viewport here on every clock
      // update, so clicking +/- appeared to do nothing: _zoomTimeline changed
      // the span, then the next LIVE tick immediately restored +/- 5 minutes.
      // Preserve the currently selected span and only translate it forward
      // with the moving LIVE playhead.
      const currentSpan=Math.max(5*60,Math.min(24*60*60,Number(this._winEnd)-Number(this._winStart)||10*60));
      const half=currentSpan/2;
      s=Math.floor(nowTs-half);
      e=Math.floor(nowTs+half);
      if(s<0){e-=s;s=0;}
      this._winStart=s;
      this._winEnd=e;
      this._timelineFocusTs=nowTs;
      this._scrubTarget=nowTs;
      this._timelineZoom=Math.max(this._timelineZoomMin,Math.min(this._timelineZoomMax,3600/currentSpan));
    }
    const span=Math.max(1,e-s);
    // When the selected playhead is at LIVE, keep its wall-clock timestamp
    // moving with real time. Do this from the same update path as the LIVE
    // marker so the HH:MM:SS label cannot get stuck on the initial second.
    let focus=Number.isFinite(Number(this._timelineFocusTs)) ? Number(this._timelineFocusTs) : nowTs;
    if (this._timelineFollowingLive && !this._timelineInteracting) {
      focus=nowTs;
      this._timelineFocusTs=nowTs;
      this._scrubTarget=nowTs;
    }
    const yPct = ts => Math.max(0,Math.min(100,50 + ((focus-Number(ts))/span)*100));
    const liveLine=track.querySelector('.tl-live-line');
    if (liveLine) {
      if (nowTs >= s && nowTs <= e) {
        liveLine.style.display='block';
        liveLine.style.top=`${yPct(nowTs)}%`;
      } else {
        liveLine.style.display='none';
      }
    }
    const events=this._timelineEvents();
    const byId=new Map(events.map(ev=>[String(ev.id),ev]));

    // O(1) event lookup during every animation frame. More importantly, do
    // not clamp stale nodes to 0/100% when their timestamp has moved outside
    // the viewport. That clamp was the cause of the post-zoom "stuck event"
    // artifact: an old marker/card remained pinned to the screen edge until
    // the timeline eventually crossed its original timestamp again.
    track.querySelectorAll('.t-ev').forEach(el=>{
      const ev=byId.get(String(el.dataset.tick));
      const a=Number(el.dataset.start);
      const b=Number(el.dataset.end);
      const anchor=Number.isFinite(Number(el.dataset.ts)) ? Number(el.dataset.ts) : Number(ev?.start_time);
      const overlaps=Number.isFinite(a)&&Number.isFinite(b) ? (b>=s && a<=e) : !!ev;
      // Never pin a stale event to the top/bottom edge. Its duration may still
      // overlap the window, but the class glyph belongs at its real timestamp.
      // Once that anchor leaves the viewport, hide it until a full reconcile
      // promotes a new in-window detection from the same cluster.
      if(!ev || !overlaps || !Number.isFinite(anchor) || anchor<s || anchor>e) {
        el.style.visibility='hidden'; el.style.pointerEvents='none'; return;
      }
      el.style.visibility=''; el.style.pointerEvents='';
      el.style.top=`${yPct(anchor)}%`;
    });
    track.querySelectorAll('.t-preview').forEach(el=>{
      const ev=byId.get(String(el.dataset.eventId));
      if(!ev) { el.style.visibility='hidden'; el.style.pointerEvents='none'; return; }
      const anchor=Number.isFinite(Number(el.dataset.ts)) ? Number(el.dataset.ts) : Number(ev.start_time);
      if(!Number.isFinite(anchor) || anchor<s || anchor>e) {
        el.style.visibility='hidden'; el.style.pointerEvents='none'; return;
      }
      el.style.visibility=''; el.style.pointerEvents='';
      const trackPx=Math.max(track.clientHeight||420,360);
      const cardH=el.offsetHeight||92;
      const y=(yPct(anchor)/100)*trackPx;
      el.style.top=`${y-cardH/2}px`;
    });
    track.querySelectorAll('.t-rec').forEach(el=>{
      const a=Number(el.dataset.start), b=Number(el.dataset.end); if(!Number.isFinite(a)||!Number.isFinite(b)) return;
      const top=yPct(Math.min(b,e));
      const h=Math.max(.45,((Math.min(b,e)-Math.max(a,s))/span)*100);
      el.style.top=`${top}%`; el.style.height=`${h}%`;
    });
    track.querySelectorAll('.tl-no-recording').forEach(el=>{
      const a=Number(el.dataset.start), b=Number(el.dataset.end);
      const loadedStart=Number(this._recordingsRangeStart), loadedEnd=Number(this._recordingsRangeEnd);
      if(!Number.isFinite(loadedStart)||!Number.isFinite(loadedEnd)||loadedEnd<=loadedStart){el.style.display='none';return;}
      if(!Number.isFinite(a)||!Number.isFinite(b)||b<s||a>e||b<loadedStart||a>loadedEnd){el.style.display='none';return;}
      const clippedA=Math.max(a,s,loadedStart), clippedB=Math.min(b,e,loadedEnd,Math.floor(Date.now()/1000));
      if(clippedB<=clippedA){el.style.display='none';return;}
      el.style.display='block';
      const top=yPct(clippedB);
      const h=Math.max(.55,((clippedB-clippedA)/span)*100);
      el.style.top=`${top}%`; el.style.height=`${h}%`;
    });
    // The scale labels are part of the moving timeline, not a static axis.
    // During a scroll the window timestamps change every frame. The previous
    // implementation only moved the old labels, leaving e.g. 06:52–07:07
    // labels attached to a newly scrolled 07:00–07:15 window. Zoom caused a
    // full render and therefore appeared to "fix" the problem.
    // Reuse the existing label nodes whenever possible so this stays cheap on
    // iOS while keeping the labels mathematically synchronized with the window.
    this._syncTimelineScaleNodes(track, s, e, span, focus, yPct);

    const ph=track.querySelector('.tl-playhead');
    if(ph) {
      const label=ph.querySelector('span');
      if(label) label.textContent=this._timelineTime(focus);
      // Keep the dedicated scrubber/current-time readout in sync as well.
      // This is intentionally a text-only update; it does not rebuild the
      // timeline or disturb an active drag/scroll gesture.
      const range=track.querySelector('#tl-range');
      if(range && this._timelineFollowingLive && !this._timelineInteracting) {
        range.textContent=`${new Date(focus*1000).toLocaleDateString([],{month:'short',day:'2-digit'}).toUpperCase()} · ${this._timeMinute(focus)}`;
      }
    }
  }
};
