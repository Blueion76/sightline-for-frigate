import { VERSION, CARD_TAG, DAY, DEFAULT_ROTATE_S, ICONS, LABEL_COLORS, PALETTE, TIMELINE_GLYPHS, CAM_COLORS } from '../constants.js';
import { cap, parseWs, labelColor, timelineGlyph, mkCamState, camDisplayName } from '../helpers.js';
import { STYLES } from '../styles.js';

// Prototype methods grouped by responsibility.
export const timelineInteractionMethods = {
_normalizeLiveFilterState() {
    const labels=this._labels(), faces=this._faces(), zones=this._zones();
    if(this._filterLabel!=='all'&&!labels.includes(this._filterLabel)) this._filterLabel='all';
    if(this._filterFace!=='all'&&!faces.includes(this._filterFace)) this._filterFace='all';
    if(this._filterZone!=='all'&&!zones.includes(this._filterZone)) this._filterZone='all';
  },

_eventMatchesLiveFilter(ev) {
    if(!ev) return false;
    if(this._filterLabel!=='all' && this._normalizeObjectLabel(ev?.label)!==String(this._filterLabel)) return false;
    if(this._filterFace!=='all' && !this._eventFaceList(ev).includes(this._filterFace)) return false;
    if(this._filterZone!=='all' && !this._eventZoneList(ev).includes(this._filterZone)) return false;
    if(this._favOnly && !(ev.retain_indefinitely||ev.is_favorite||ev.favorite)) return false;
    return true;
  },

_applyLiveFilterChange() {
    this._normalizeLiveFilterState();
    if(this._timelineSelected) {
      const selected=this._allDisplayEvents().find(ev=>String(ev.id)===String(this._timelineSelected));
      if(selected&&!this._eventMatchesLiveFilter(selected)) this._timelineSelected=null;
    }
    this._renderFilter();
    this._renderList();
    this._renderLatest();
    this._renderStats();
    this._renderLegend();
    this._renderTimeline(true);
  },

_renderFilter() {
    const p=this.shadowRoot.querySelector('#filter-panel'); if(!p) return;
    this._normalizeLiveFilterState();
    const lbls=['all',...this._labels()]; const faces=['all',...this._faces()]; const zones=['all',...this._zones()];
    const chip=(val,cur,attr,kind)=>`<button class="chip ${val===cur?'on':''}" data-${attr}="${val}">${val==='all'?'All':this._filterDisplayName(kind,val)}</button>`;
    p.innerHTML=`<div class="frow"><span class="frow-l">Label</span>${lbls.map(l=>chip(l,this._filterLabel,'flabel','label')).join('')}</div>
      ${faces.length>1?`<div class="frow"><span class="frow-l">Face</span>${faces.map(v=>`<button class="chip ${v===this._filterFace?'on':''}" data-fface="${v}">${v==='all'?'All':this._faceDisplayName(v)}</button>`).join('')}</div>`:''}
      <div class="frow"><span class="frow-l">Zone</span>${zones.map(z=>chip(z,this._filterZone,'fzone','zone')).join('')}</div>
      <div class="frow"><span class="frow-l">Show</span>
        <button class="chip ${!this._favOnly?'on':''}" data-favonly="0">All</button>
        <button class="chip ${this._favOnly?'on':''}" data-favonly="1">★ Favorites</button></div>`;
  },

_invalidatePlaybackForTimelineMove() {
    this._cancelActivePlayback();
    ++this._playSeq;
    ++this._playbackLoadSeq;
    clearTimeout(this._playbackTimer);
    this._playing = null;
    this._playingHour = null;
    this._playingSourceStart = null;
    this._playingSourceEnd = null; this._playingRecordings = []; this._playingInpointOffset = 0;
    this._scrubTarget = this._timelineFocusTs;
    const v=this.shadowRoot.querySelector('#viewer');
    if(v) v.innerHTML='';
    this._renderStreamCtrl();
  },

_scheduleTimelineRender(full=false) {
    this._timelineRenderNeedsFull = this._timelineRenderNeedsFull || full;
    if (this._timelineRenderRaf) return;
    this._timelineRenderRaf = requestAnimationFrame(() => {
      this._timelineRenderRaf = 0;
      const needsFull = this._timelineRenderNeedsFull;
      this._timelineRenderNeedsFull = false;
      this._renderTimeline(!!needsFull);
    });
  },

_reconcileTimelineDuringMove() {
    // High-frequency pan updates move existing DOM nodes directly for speed,
    // but a zoom can leave the visible event set different from the old DOM.
    // Reconcile at a modest cadence while moving so newly-visible markers are
    // introduced and stale ones are removed without rebuilding every frame.
    const now=performance.now();
    if(now-(this._timelineLastMotionReconcile||0)<120) return;
    this._timelineLastMotionReconcile=now;
    this._scheduleTimelineRender(false);
  },

_wireScrub() {
    const track=this.shadowRoot.querySelector('#tl-track'); if(!track) return;
    if (this._scrubAbort) { try { this._scrubAbort.abort(); } catch(_) {} }
    const controller = new AbortController();
    this._scrubAbort = controller;
    const signal = controller.signal;
    let drag=false,sx=0,sy=0,sws=0,swe=0,lastScrubLabelAt=0;
    let scrubber=false,scrubberLastY=0,scrubberAutoRaf=0,scrubberAutoY=0;
    let rangeDrag=null,rangeLastLabel=0,rangePointerId=null;
    let pinch=false,pinchDistance=0,pinchSpan=0,pinchAnchorTs=0,pinchAnchorRatio=0;
    const stopScrubberAuto=()=>{
      if(scrubberAutoRaf){cancelAnimationFrame(scrubberAutoRaf);scrubberAutoRaf=0;}
    };
    // The center scrubber is a viewport transport, not an independent cursor.
    // Keep the loaded/rendered window translated by exactly the same amount as
    // the playhead timestamp. Previously the scrubber changed only
    // _timelineFocusTs, while _winStart/_winEnd remained on the old range. The
    // fast renderer then correctly culled nodes against that stale window, which
    // made the timeline appear mostly blank until a normal finger pan updated the
    // window again.
    const moveScrubberWindowTo=(nextTs)=>{
      const now=Math.floor(Date.now()/1000);
      const current=Number.isFinite(Number(this._timelineFocusTs))
        ? Number(this._timelineFocusTs)
        : ((this._winStart+this._winEnd)/2);
      const desired=Math.max(0,Math.min(now,Math.round(Number(nextTs))));
      let delta=desired-current;
      // Preserve the current span/visual playhead position. Only constrain the
      // extreme historical boundary; normal LIVE/past movement is a pure
      // translation and therefore stays identical to finger panning.
      if(this._winStart+delta<0) delta=-this._winStart;
      this._winStart+=delta;
      this._winEnd+=delta;
      this._timelineFocusTs=Math.round(current+delta);
      this._scrubTarget=this._timelineFocusTs;
      this._exhausted=false;
    };
    const rangeTimestampAtY=(y)=>{
      const rect=track.getBoundingClientRect();
      const ratio=Math.max(0,Math.min(1,(y-rect.top)/Math.max(1,rect.height)));
      return this._winEnd-ratio*Math.max(1,this._winEnd-this._winStart);
    };
    const rangeKindAtY=(y,preferred)=>{
      const r=this._downloadRange;
      if(!r) return preferred||'start';
      const ts=rangeTimestampAtY(y);
      const ds=Math.abs(ts-Number(r.start));
      const de=Math.abs(ts-Number(r.end));
      // When the handles are nearly on top of each other, honor the explicitly
      // touched handle. Everywhere else, choose the mathematically closest
      // boundary so overlapping 54px hit lanes never select the wrong one.
      if(preferred && Math.abs(ds-de)<1.25) return preferred;
      return ds<=de?'start':'end';
    };
    const startRangeHandle=(kind,y)=>{
      if(!this._downloadRange) return;
      stopScrubberAuto();
      rangeDrag=kind; drag=false; scrubber=false; pinch=false;
      this._timelineInteracting=true;
      track.classList.remove('grab');
      track.classList.add('range-grab');
      const t=this._updateDownloadRangeBoundary(kind,rangeTimestampAtY(y));
      if(Number.isFinite(t)){
        this._syncDownloadRangePickerDOM(kind);
        this._updateTimelineScrubLabel(t);
      }
    };
    const moveRangeHandle=(y)=>{
      if(!rangeDrag||!this._downloadRange) return;
      const t=this._updateDownloadRangeBoundary(rangeDrag,rangeTimestampAtY(y));
      if(!Number.isFinite(t)) return;
      // Do not rebuild the timeline while a pointer is captured. Replacing the
      // boundary DOM node mid-drag is what made iOS intermittently lose the
      // active finger in v2.0.28. Update only positions/text in place.
      this._syncDownloadRangePickerDOM(rangeDrag);
      const nowMs=performance.now();
      if(nowMs-rangeLastLabel>75){rangeLastLabel=nowMs;this._updateTimelineScrubLabel(t);}
    };
    const stopRangeHandle=()=>{
      if(!rangeDrag) return;
      rangeDrag=null;
      this._timelineInteracting=false;
      track.classList.remove('range-grab');
      this._syncDownloadRangePickerDOM();
    };
    const startScrubber=(y)=>{
      stopScrubberAuto();
      scrubber=true; drag=false; this._timelineInteracting=true; this._scrubGestureInvalidated=false; this._timelineWasLiveBeforeGesture=this._timelineFollowingLive===true; this._timelineLiveCrossed=false; this._timelineFollowingLive=false;
      scrubberLastY=y; scrubberAutoY=y;
      if (this._playing || this._activePlaybackCleanup) this._invalidatePlaybackForTimelineMove();
      this._scrubTarget=this._timelineFocusTs ?? ((this._winStart+this._winEnd)/2);
      track.classList.add('grab');
      scrubberAutoRaf=requestAnimationFrame(scrubberAuto);
    };
    const moveScrubber=(y)=>{
      if(!scrubber)return;
      const rect=track.getBoundingClientRect();
      const size=Math.max(1,track.clientHeight||rect.height||1);
      const span=Math.max(1,this._winEnd-this._winStart);
      const dy=y-scrubberLastY;
      if(Math.abs(dy)>0.01){
        // Dragging the center scrubber downward moves toward older footage.
        // Once the finger is held in the lower part of the rail, progressively
        // increase the time rate so a long timeline can be traversed quickly.
        const localY=Math.max(0,Math.min(size,y-rect.top));
        const lower=Math.max(0,Math.min(1,(localY/size-.58)/.42));
        const speed=1+4*lower*lower;
        const next=(this._scrubTarget ?? this._timelineFocusTs ?? ((this._winStart+this._winEnd)/2)) - (dy/size)*span*speed;
        moveScrubberWindowTo(next);
        this._updateTimelineLive(); this._renderRange();
        this._reconcileTimelineDuringMove();
        this._scheduleTimelineDynamicData('motion');
        const nowMs=performance.now();
        if(nowMs-lastScrubLabelAt>90){lastScrubLabelAt=nowMs;this._updateTimelineScrubLabel(this._timelineFocusTs);}
      }
      scrubberLastY=y; scrubberAutoY=y;
    };
    const scrubberAuto=()=>{
      if(!scrubber)return;
      const rect=track.getBoundingClientRect();
      const size=Math.max(1,track.clientHeight||rect.height||1);
      const localY=Math.max(0,Math.min(size,scrubberAutoY-rect.top));
      // Holding near the bottom edge keeps walking backward through time.
      // This is deliberately bounded so a small accidental touch cannot race
      // through hours of recordings.
      if(localY>size*.78){
        const edge=(localY-size*.78)/(size*.22);
        const speed=1+7*Math.min(1,edge);
        const span=Math.max(1,this._winEnd-this._winStart);
        const dt=(1/60)*span/size*speed*size*.055;
        const next=(this._scrubTarget ?? this._timelineFocusTs ?? ((this._winStart+this._winEnd)/2))-dt;
        moveScrubberWindowTo(next);
        this._updateTimelineLive(); this._renderRange();
        this._reconcileTimelineDuringMove();
        this._scheduleTimelineDynamicData('motion');
        this._updateTimelineScrubLabel(this._timelineFocusTs);
      }
      scrubberAutoRaf=requestAnimationFrame(scrubberAuto);
    };
    const stopScrubber=()=>{
      if(!scrubber)return;
      scrubber=false; stopScrubberAuto(); track.classList.remove('grab');
      this._timelineInteracting=false;
      const target=this._scrubTarget ?? this._timelineFocusTs ?? this._winEnd;
      const wasLive=this._timelineWasLiveBeforeGesture;
      this._timelineWasLiveBeforeGesture=false;
      this._renderTimeline(); this._scheduleTimelineDataLoad();
      if (this._isAtLiveEdge(target)) { this._refreshLiveFromTimeline({restart: !wasLive}); return; }
      this._seekTimelineTarget(target);
    };
    const dn=(x,y)=>{
      drag=true; this._timelineInteracting=true; this._scrubGestureInvalidated=false; this._timelineWasLiveBeforeGesture=this._timelineFollowingLive===true; this._timelineLiveCrossed=false; this._timelineFollowingLive=false; sx=x; sy=y; sws=this._winStart; swe=this._winEnd;
      // Any timeline movement supersedes event-clip playback immediately.
      // Do this before changing the window so an old clip cannot continue
      // updating the viewer while the new recording target is being chosen.
      if (this._playing || this._activePlaybackCleanup) {
        this._invalidatePlaybackForTimelineMove();
      }
      this._scrubTarget = this._timelineFocusTs ?? swe;
      track.classList.add('grab');
    };
    const mv=(x,y)=>{
      if(!drag||pinch)return;
      // Once the finger/mouse moves, the old recording is no longer authoritative.
      // Do this on the first movement only; subsequent moves are cheap renders.
      if (!this._scrubGestureInvalidated) {
        this._scrubGestureInvalidated = true;
        this._invalidatePlaybackForTimelineMove();
      }
      const vertical=track.classList.contains('vertical');
      const size=(vertical?track.clientHeight:track.clientWidth)||1;
      const sp=swe-sws;
      const delta=vertical?-(y-sy):(x-sx);
      // Newest is at the top. Swiping upward moves the timeline downward into older footage; dragging downward moves toward newer footage.
      const sh=Math.round(delta/size*sp);
      const pan = sh;
      let ns=sws-pan, ne=swe-pan;
      let nf=((sws+swe)/2)-pan;
      const now=Math.floor(Date.now()/1000);
      const previousFocus = Number.isFinite(Number(this._timelineFocusTs))
        ? Number(this._timelineFocusTs)
        : ((sws+swe)/2);
      // LIVE is crossed by the fixed playhead timestamp, not by the window's
      // newest edge. The default 10-minute viewport intentionally extends
      // five minutes into the future so LIVE can start centered. Do not clamp
      // that future portion away when the user makes a small backward move;
      // doing so moved the LIVE line to the top of the timeline.
      const crossedLive = previousFocus < now - 1 && nf >= now - 1;
      if(ns<0){const a=-ns;ns+=a;ne+=a;nf+=a;}
      this._winStart=ns; this._winEnd=ne;
      this._timelineFocusTs = Math.max(ns,Math.min(ne,Math.round(nf)));
      if (crossedLive) {
        // Do not restart the live stream from inside the move handler. The
        // browser can still deliver a touchend/mouseup immediately afterward,
        // which previously caused two competing stream mounts and the
        // intermittent 'Unable to start stream' error. Let the single release
        // handler perform the transition exactly once.
        this._timelineLiveCrossed=true;
        this._scrubTarget=Math.floor(now);
        this._updateTimelineLive();
        this._renderRange();
        return;
      }
      this._scrubTarget = this._timelineFocusTs;
      this._updateTimelineLive(); this._renderRange();
      this._reconcileTimelineDuringMove();
      this._scheduleTimelineDynamicData('motion');
      const nowMs=performance.now();
      if(nowMs-lastScrubLabelAt>140){
        lastScrubLabelAt=nowMs;
        this._updateTimelineScrubLabel(this._timelineFocusTs);
      }
    };
    const pinchMove=(touches)=>{
      if(!pinch||touches.length<2)return;
      const a=touches[0],b=touches[1];
      const dx=b.clientX-a.clientX,dy=b.clientY-a.clientY;
      const dist=Math.max(1,Math.hypot(dx,dy));
      const ratio=Math.max(0,Math.min(1,pinchAnchorRatio));
      const newSpan=Math.max(5*60,Math.min(24*60*60,Math.round(pinchSpan*pinchDistance/dist)));
      this._timelineZoom=Math.max(this._timelineZoomMin,Math.min(this._timelineZoomMax,3600/newSpan));
      this._setTimelineWindowAround(pinchAnchorTs,ratio,newSpan);
      // The zoom changes the time scale, so reconcile the scale/markers on the
      // next animation frame instead of leaving the old scale until touchend.
      this._scheduleTimelineRender(true);
      this._renderRange(); this._renderTimelineZoomLabel();
      this._scheduleTimelineDynamicData('motion');
      this._updateTimelineScrubLabel(this._timelineFocusTs ?? this._winEnd);
    };
    const up=()=>{
      if(pinch){pinch=false;pinchDistance=0;this._timelineInteracting=false;track.classList.remove('grab');this._timelineWasLiveBeforeGesture=false;this._timelineLiveCrossed=false;this._renderTimeline();this._scheduleTimelineDataLoad();return;}
      if(!drag)return;
      drag=false; track.classList.remove('grab');
      this._scrubGestureInvalidated=false;
      const target=this._scrubTarget ?? this._winEnd;
      const crossedLive=this._timelineLiveCrossed || this._isAtLiveEdge(target);
      const wasLive=this._timelineWasLiveBeforeGesture;
      this._timelineLiveCrossed=false;
      this._timelineWasLiveBeforeGesture=false;
      if (crossedLive) { this._refreshLiveFromTimeline({restart: !wasLive}); return; }
      this._seekTimelineTarget(target);
      this._scheduleTimelineDataLoad();
    };
    // Pointer Events are the authoritative trim interaction path. Capture is
    // taken on the stable timeline element (not on a handle that is visually
    // updated) so the drag survives finger drift, Shadow DOM hit-testing and
    // iOS/WebKit event retargeting. Dragging anywhere in trim mode moves the
    // nearest boundary; the visible circle/label is no longer a precision hit.
    if('PointerEvent' in window){
      track.addEventListener('pointerdown',e=>{
        if(!this._downloadRange) return;
        if(e.target.closest('[data-range-download],[data-range-cancel]')) return;
        if(e.pointerType==='mouse' && e.button!==0) return;
        e.preventDefault(); e.stopPropagation();
        const preferred=e.target.closest('[data-range-handle]')?.dataset?.rangeHandle||null;
        const kind=rangeKindAtY(e.clientY,preferred);
        rangePointerId=e.pointerId;
        try{track.setPointerCapture(e.pointerId);}catch(_){}
        startRangeHandle(kind,e.clientY);
      },{passive:false,signal});
      track.addEventListener('pointermove',e=>{
        if(rangePointerId==null || e.pointerId!==rangePointerId || !rangeDrag) return;
        e.preventDefault();
        moveRangeHandle(e.clientY);
      },{passive:false,signal});
      const finishRangePointer=e=>{
        if(rangePointerId==null || e.pointerId!==rangePointerId) return;
        try{if(track.hasPointerCapture?.(e.pointerId))track.releasePointerCapture(e.pointerId);}catch(_){}
        rangePointerId=null;
        stopRangeHandle();
      };
      track.addEventListener('pointerup',finishRangePointer,{signal});
      track.addEventListener('pointercancel',finishRangePointer,{signal});
      track.addEventListener('lostpointercapture',e=>{
        if(rangePointerId!=null && e.pointerId===rangePointerId){rangePointerId=null;stopRangeHandle();}
      },{signal});
    }

    track.addEventListener('mousedown',e=>{
      if(this._downloadRange){
        if(e.target.closest('[data-range-download],[data-range-cancel]'))return;
        if(!('PointerEvent' in window)){
          e.preventDefault(); e.stopPropagation();
          const preferred=e.target.closest('[data-range-handle]')?.dataset?.rangeHandle||null;
          startRangeHandle(rangeKindAtY(e.clientY,preferred),e.clientY);
        }
        return;
      }
      if(e.target.closest('.tl-playhead i')){e.preventDefault();startScrubber(e.clientY);return;}
      if(e.target.closest('.t-ev,.t-preview,.tl-zoom-controls'))return;
      e.preventDefault();dn(e.clientX,e.clientY);
    });
    window.addEventListener('mousemove',e=>{if(rangeDrag&&rangePointerId==null){e.preventDefault();moveRangeHandle(e.clientY);return;}if(scrubber){e.preventDefault();moveScrubber(e.clientY);return;}mv(e.clientX,e.clientY);},{signal});
    window.addEventListener('mouseup',()=>{if(rangeDrag&&rangePointerId==null){stopRangeHandle();return;}if(scrubber){stopScrubber();return;}up();},{signal});
    track.addEventListener('touchstart',e=>{
      if(this._downloadRange){
        if(e.target.closest('[data-range-download],[data-range-cancel]'))return;
        /* Pointer Events are preferred, but some iOS/WKWebView builds expose
           PointerEvent while intermittently failing to deliver pointerdown
           through nested glass/Shadow DOM layers. If no pointer was actually
           captured, use touch as a real fallback instead of assuming support. */
        if(rangePointerId==null && !rangeDrag && e.touches.length){
          e.preventDefault(); e.stopPropagation();
          const y=e.touches[0].clientY;
          const preferred=e.target.closest('[data-range-handle]')?.dataset?.rangeHandle||null;
          startRangeHandle(rangeKindAtY(y,preferred),y);
        }
        return;
      }
      if(e.target.closest('.tl-playhead i')){
        e.preventDefault();
        startScrubber(e.touches[0].clientY);
        scrubberAutoRaf=requestAnimationFrame(scrubberAuto);
        return;
      }
      if(e.touches.length>=2){
        drag=false; pinch=true;
        this._timelineWasLiveBeforeGesture=this._timelineFollowingLive===true;
        this._timelineLiveCrossed=false;
        this._invalidatePlaybackForTimelineMove();
        const a=e.touches[0],b=e.touches[1];
        pinchDistance=Math.max(1,Math.hypot(b.clientX-a.clientX,b.clientY-a.clientY));
        pinchSpan=Math.max(1,this._winEnd-this._winStart);
        const rect=track.getBoundingClientRect();
        const midY=(a.clientY+b.clientY)/2;
        pinchAnchorRatio=Math.max(0,Math.min(1,(midY-rect.top)/Math.max(1,rect.height)));
        pinchAnchorTs=(this._timelineFocusTs ?? this._winEnd) + (0.5-pinchAnchorRatio)*pinchSpan;
        track.classList.add('grab');
        e.preventDefault();
        return;
      }
      if(e.target.closest('.t-ev,.t-preview,.tl-zoom-controls'))return;
      dn(e.touches[0].clientX,e.touches[0].clientY);
    },{passive:false});
    track.addEventListener('touchmove',e=>{
      if(rangeDrag&&rangePointerId==null){e.preventDefault();moveRangeHandle(e.touches[0].clientY);return;}
      if(scrubber){e.preventDefault();moveScrubber(e.touches[0].clientY);return;}
      if(pinch&&e.touches.length>=2){e.preventDefault();pinchMove(e.touches);return;}
      if(drag){e.preventDefault();mv(e.touches[0].clientX,e.touches[0].clientY);}
    },{passive:false});
    track.addEventListener('touchend',e=>{if(rangeDrag&&rangePointerId==null){e.preventDefault();stopRangeHandle();return;}if(scrubber){e.preventDefault();stopScrubber();return;}if(pinch){e.preventDefault();up();return;}up();},{passive:false});
    track.addEventListener('touchcancel',()=>{if(rangeDrag&&rangePointerId==null){stopRangeHandle();return;}if(scrubber){stopScrubber();return;}pinch=false;drag=false;this._timelineInteracting=false;this._timelineWasLiveBeforeGesture=false;this._timelineLiveCrossed=false;track.classList.remove('grab');this._renderTimeline();});
    track.addEventListener('wheel',e=>{
      e.preventDefault();
      if(this._downloadRange) return;
      const rect=track.getBoundingClientRect();
      const span=this._winEnd-this._winStart;
      // Ctrl/Meta wheel behaves like pinch zoom; normal wheel pans vertically.
      if(e.ctrlKey||e.metaKey){
        const midY=Math.max(0,Math.min(rect.height,e.clientY-rect.top));
        const ratio=midY/Math.max(1,rect.height);
        const anchor=this._timelineTimestampAtRatio(ratio,this._timelineFocusTs,span);
        this._zoomTimeline(e.deltaY>0?1/1.12:1.12,anchor,ratio);
        return;
      }
      const delta=e.deltaY||e.deltaX;
      // Wheel scrolling is a timeline interaction too. While following LIVE,
      // _updateTimelineLive() normally keeps the viewport centered on now.
      // If we don't explicitly leave that state before applying a wheel shift,
      // the very next live-marker update snaps the timeline straight back to
      // now +/- 5 minutes. That was the regression introduced with the LIVE
      // bar: even a tiny wheel movement appeared to jump/reset the timeline.
      // Treat wheel panning exactly like touch/mouse dragging until the wheel
      // settles, then commit the selected timestamp.
      if (!this._timelineInteracting) this._timelineWasLiveBeforeGesture=this._timelineFollowingLive===true;
      this._timelineFollowingLive=false;
      this._timelineInteracting=true;
      if (this._playing || this._activePlaybackCleanup) this._invalidatePlaybackForTimelineMove();
      clearTimeout(this._wt);
      const shift=Math.round(delta/Math.max(1,rect.height)*span);
      let ns=this._winStart+shift, ne=this._winEnd+shift;
      let nf=(this._timelineFocusTs ?? ((this._winStart+this._winEnd)/2))+shift;
      const now=Math.floor(Date.now()/1000);
      const previousFocus = Number.isFinite(Number(this._timelineFocusTs))
        ? Number(this._timelineFocusTs)
        : ((this._winStart+this._winEnd)/2);
      // Do not use the window's newest edge to decide whether LIVE was crossed.
      // The initial 10-minute window has five minutes of intentional future
      // space. A small backward wheel move must preserve that space rather than
      // clamping the whole window to "now" and putting LIVE at the top.
      const crossedLive = previousFocus < now - 1 && nf >= now - 1;
      if(ns<0){const a=-ns;ns+=a;ne+=a;nf+=a;}
      this._winStart=ns;this._winEnd=ne;this._exhausted=false;
      this._timelineFocusTs=Math.max(ns,Math.min(ne,Math.round(nf)));
      if (crossedLive) {
        // Defer the live transition to the settled wheel callback so a burst
        // of wheel events cannot mount multiple live players.
        this._timelineLiveCrossed=true;
        this._scrubTarget=Math.floor(now);
        this._updateTimelineLive(); this._renderRange();
        clearTimeout(this._wt);
        this._wt=setTimeout(()=>{
          this._timelineInteracting=false;
          const wasLive=this._timelineWasLiveBeforeGesture;
          this._timelineWasLiveBeforeGesture=false;
          this._timelineLiveCrossed=false;
          this._refreshLiveFromTimeline({restart: !wasLive});
        },220);
        return;
      }
      this._scrubTarget=this._timelineFocusTs;
      this._updateTimelineLive();this._renderRange();this._renderTimelineZoomLabel();
      this._updateTimelineScrubLabel(this._scrubTarget);
      this._reconcileTimelineDuringMove();
      this._scheduleTimelineDynamicData('motion');
      clearTimeout(this._wt);this._wt=setTimeout(()=>{ this._timelineInteracting=false; this._renderTimeline(); const latest=this._scrubTarget ?? this._timelineFocusTs ?? this._winEnd; if(this._isAtLiveEdge(latest)){ this._refreshLiveFromTimeline(); return; } this._seekTimelineTarget(latest); },220);
      this._scheduleTimelineDataLoad();
    },{passive:false});
    this._renderTimelineZoomLabel();
  },

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

_zoomTimeline(factor, anchorTs, anchorRatio) {
    const oldSpan=Math.max(300,this._winEnd-this._winStart);
    const nextSpan=Math.max(300,Math.min(86400,Math.round(oldSpan/Number(factor||1))));
    const hasExplicitAnchor=Number.isFinite(Number(anchorTs));
    const ratio=Number.isFinite(Number(anchorRatio)) ? Number(anchorRatio) : 0.5;
    // +/- while following LIVE should change scale without leaving LIVE. Build
    // the new centered viewport immediately so the next clock tick has nothing
    // to undo. Pinch/trackpad zoom still uses its explicit pointer anchor.
    if(this._timelineFollowingLive && !hasExplicitAnchor){
      const now=Math.floor(Date.now()/1000);
      const half=nextSpan/2;
      this._winStart=Math.floor(now-half);
      this._winEnd=Math.floor(now+half);
      if(this._winStart<0){this._winEnd-=this._winStart;this._winStart=0;}
      this._timelineFocusTs=now;
      this._scrubTarget=now;
      this._exhausted=false;
    } else {
      const anchor=hasExplicitAnchor
        ? Number(anchorTs)
        : (this._timelineFocusTs ?? ((this._winStart+this._winEnd)/2));
      this._setTimelineWindowAround(anchor,ratio,nextSpan);
      this._scrubTarget=this._timelineFocusTs;
    }
    this._timelineZoom=Math.max(this._timelineZoomMin,Math.min(this._timelineZoomMax,3600/nextSpan));
    this._renderTimeline(); this._renderRange(); this._renderTimelineZoomLabel();
    this._scheduleTimelineDynamicData('motion');
    this._scheduleTimelineDataLoad();
  },

_resetTimelineZoom() {
    const span=this._timelineDefaultSpanSeconds();
    this._timelineZoom=3600/span;
    if(this._timelineFollowingLive){
      const now=Math.floor(Date.now()/1000);
      this._winStart=now-span/2;
      this._winEnd=now+span/2;
      this._timelineFocusTs=now;
      this._scrubTarget=now;
      this._exhausted=false;
    } else {
      const anchor=this._timelineFocusTs||this._scrubTarget||((this._winStart+this._winEnd)/2);
      // Reset around the center playhead, never around the newest edge.
      this._setTimelineWindowAround(anchor,0.5,span);
      this._scrubTarget=this._timelineFocusTs;
    }
    this._renderTimeline(); this._renderRange(); this._renderTimelineZoomLabel();
    this._scheduleTimelineDynamicData('motion');
    this._scheduleTimelineDataLoad();
  },

_renderTimelineZoomLabel() {
    const el=this._$('#tl-zoom-level'); if(!el) return;
    const span=Math.round(this._winEnd-this._winStart);
    let label;
    if(span>=86400) label='24h';
    else if(span>=7200) label=Math.round(span/3600)+'h';
    else if(span>=3600) label='1h';
    else if(span>=1800) label=Math.round(span/60)+'m';
    else label=Math.max(5,Math.round(span/60))+'m';
    el.textContent=label;
  },

_updateTimelineScrubLabel(target) {
    const t=Math.max(0,Math.floor(Number(target)||0));
    if(!Number.isFinite(t)) return;
    const range=this._$('#tl-range');
    if(range) range.textContent=`${new Date(t*1000).toLocaleDateString([],{month:'short',day:'2-digit'}).toUpperCase()} · ${this._timeMinute(t)}`;
  },

_updateTimelinePlaybackTime(ts) {
    // Keep fractional media time internally so the scrubber is driven by the
    // actual decoder clock rather than a once-per-second rounded value. The
    // UI label is rounded only for display. This removes the occasional 1s
    // (and, with HLS, sometimes 2s) apparent drift between the video and the
    // timeline.
    const t=Number(ts);
    if(!Number.isFinite(t) || t<0 || !this.isConnected) return;
    this._timelineFocusTs=t;
    this._scrubTarget=t;
    const track=this._$('#tl-track');
    if(!track) return;
    const s=Number(this._winStart), e=Number(this._winEnd);
    const span=Math.max(1,e-s);
    const pct=Math.max(0,Math.min(100,50+((t-s)/span-0.5)*100));
    const ph=track.querySelector('.tl-playhead');
    if(ph) {
      // The playhead itself is fixed at 50% visually; its label is the current
      // playback time. Keep the label updated even when video playback pauses.
      const label=ph.querySelector('span');
      if(label) label.textContent=this._timelineTime(Math.round(t));
    }
    const range=track.querySelector('#tl-range');
    if(range) range.textContent=`${new Date(t*1000).toLocaleDateString([],{month:'short',day:'2-digit'}).toUpperCase()} · ${this._timeMinute(Math.round(t))}`;
    // If the media clock has moved outside the currently visible window,
    // re-anchor the window around it without changing its zoom span. This is
    // especially important when a player resumes after a long stall/rebuffer.
    if(t<s || t>e) {
      const half=span/2;
      this._winStart=Math.max(0,Math.floor(t-half));
      this._winEnd=Math.floor(t+half);
      this._renderRange();
      this._renderTimeline(false);
    }
  },

_wireTimelineMediaClock(video, originTs, token) {
    if(!video || video.dataset.frigateTimelineClock==='1') return;
    video.dataset.frigateTimelineClock='1';
    // This clock is attached only to event clips. A clip has its own media-time
    // origin at ev.start_time, so its wall-clock timestamp is always
    // `eventStart + currentTime`. Never consult _playingRecordings here: that
    // state belongs to the hourly recording player and can survive just long
    // enough during a transition to map clip currentTime=0 to the first second
    // of that hour.
    const mediaOrigin=Number(originTs);
    const sync=()=>{
      if(token!=null && this._playSeq!==token) return;
      const rel=Number(video.currentTime);
      if(!Number.isFinite(rel) || rel<0 || !Number.isFinite(mediaOrigin)) return;
      const absolute=mediaOrigin+rel;
      if(!Number.isFinite(absolute)) return;
      this._updateTimelinePlaybackTime(absolute);
    };
    ['timeupdate','playing','seeked','seeking','pause','waiting','stalled','canplay'].forEach(ev=>video.addEventListener(ev,sync));
    sync();
  },

_attachTimelineMediaClock(player, originTs, token) {
    let tries=0;
    const attach=()=>{
      if(token!=null && this._playSeq!==token) return;
      const video=this._findVideo(player);
      if(video) { this._wireTimelineMediaClock(video,originTs,token); return; }
      if(++tries<160) setTimeout(attach,75);
    };
    attach();
  },

async _seekTimelineTarget(target) {
    const t=Math.max(0,Math.floor(Number(target)));
    if(!Number.isFinite(t)) return;
    const seq=++this._timelineSeekSeq;
    this._scrubTarget=t;
    const hour=this._hourStart(t);

    // Desktop stable-HLS session reuse.
    const current=this._playbackSession;
    if(current && t>=current.sourceStart && t<current.sourceEnd && current.video && current.token===this._playSeq) {
      const offset=this._frigateSeekPosition(t,current.recordings,current.inpointOffset);
      if(Number.isFinite(offset)) {
        current.targetTs=t;
        current.pendingSeek=offset;
        this._playing={rec:t};
        this._updateTimelinePlaybackTime(t);
        if(typeof current.requestSeek==='function') current.requestSeek(offset,t);
        return;
      }
    }

    // Restore the older v52 iOS behavior: when the hour MP4 is already mounted,
    // seek the native video directly instead of rebuilding the media source or
    // waiting on an HLS seek state machine. This is the path that previously felt
    // immediate on iPhone/iPad.
    if(this._isIOSRecordingPlatform()) {
      const currentVideo=this._findVideo(this.shadowRoot.querySelector('#viewer'));
      const sourceStart=Number.isFinite(this._playingSourceStart)?this._playingSourceStart:hour;
      const sourceEnd=Number.isFinite(this._playingSourceEnd)?this._playingSourceEnd:hour+3600;
      if(currentVideo && this._playingHour===hour && t>=sourceStart && t<sourceEnd &&
         Number.isFinite(currentVideo.duration) && currentVideo.duration>0 &&
         Array.isArray(this._playingRecordings) && this._playingRecordings.length) {
        const offset=this._frigateSeekPosition(t,this._playingRecordings,this._playingInpointOffset||0);
        if(Number.isFinite(offset)) {
          try {
            currentVideo.currentTime=Math.min(offset,Math.max(0,currentVideo.duration-0.05));
            currentVideo.muted=true;
            currentVideo.play().catch(()=>{});
          } catch(_) {}
          this._playing={rec:t};
          this._scrubTarget=t;
          this._updateTimelinePlaybackTime(t);
          this._renderStreamCtrl();
          return;
        }
      }
    }

    await this._showRecording(hour,hour+3600,t);
    if(seq!==this._timelineSeekSeq) return;
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
