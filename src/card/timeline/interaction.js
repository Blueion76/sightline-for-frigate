/**
 * Timeline pointer, touch, wheel and event-preview gesture handling.
 *
 * All high-frequency input paths converge on the same viewport and seek state,
 * which keeps desktop, touch and iOS behavior synchronized.
 */
export const timelineGestureMethods = {
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
      // active finger during range dragging. Update only positions/text in place.
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

    this._wireDesktopEventTimelineDrag(track,signal);
    this._renderTimelineZoomLabel();
  },

  /**
   * Allow desktop users to begin a timeline pan on top of an event preview.
   *
   * A short movement threshold preserves the event's normal click behavior;
   * once the pointer moves far enough, ownership transfers to the timeline and
   * the release commits through the same seek path used by every other scrub.
   */
  _wireDesktopEventTimelineDrag(track,signal) {
    let gesture=null;
    const options=signal?{signal}:undefined;
    const isEventSurface=(target)=>Boolean(
      target?.closest?.('.t-preview,.t-ev')
      && !target.closest('button,a,input,select,textarea,.tl-zoom-controls,.tl-playhead i')
    );

    const finish=(event,cancelled=false)=>{
      if(!gesture || (event?.pointerId!=null && event.pointerId!==gesture.pointerId)) return;
      const state=gesture;
      gesture=null;
      try {
        if(track.hasPointerCapture?.(state.pointerId)) track.releasePointerCapture(state.pointerId);
      } catch(_) {}
      if(!state.moved) return;

      this._timelineInteracting=false;
      this._scrubGestureInvalidated=false;
      track.classList?.remove?.('grab');
      this._timelineSuppressClickUntil=performance.now()+400;

      const target=this._scrubTarget??this._timelineFocusTs??this._winEnd;
      const crossedLive=this._timelineLiveCrossed||this._isAtLiveEdge(target);
      this._timelineLiveCrossed=false;
      this._timelineWasLiveBeforeGesture=false;

      if(cancelled) {
        this._renderTimeline();
        return;
      }
      if(crossedLive) this._refreshLiveFromTimeline({restart:!state.wasLive});
      else this._seekTimelineTarget(target);
      this._scheduleTimelineDataLoad();
    };

    track.addEventListener('pointerdown',(event)=>{
      if(event.pointerType!=='mouse'||event.button!==0||this._downloadRange||!isEventSurface(event.target)) return;
      gesture={
        pointerId:event.pointerId,
        startX:event.clientX,
        startY:event.clientY,
        windowStart:Number(this._winStart),
        windowEnd:Number(this._winEnd),
        focus:Number.isFinite(Number(this._timelineFocusTs))
          ? Number(this._timelineFocusTs)
          : (Number(this._winStart)+Number(this._winEnd))/2,
        wasLive:this._timelineFollowingLive===true,
        moved:false,
      };
      try { track.setPointerCapture?.(event.pointerId); } catch(_) {}
    },options);

    track.addEventListener('pointermove',(event)=>{
      if(!gesture||event.pointerId!==gesture.pointerId) return;
      const distance=Math.hypot(event.clientX-gesture.startX,event.clientY-gesture.startY);
      if(!gesture.moved&&distance<4) return;

      if(!gesture.moved) {
        gesture.moved=true;
        this._timelineInteracting=true;
        this._timelineWasLiveBeforeGesture=gesture.wasLive;
        this._timelineFollowingLive=false;
        this._timelineLiveCrossed=false;
        this._scrubGestureInvalidated=true;
        if(this._playing||this._activePlaybackCleanup) this._invalidatePlaybackForTimelineMove();
        track.classList?.add?.('grab');
      }

      event.preventDefault?.();
      event.stopPropagation?.();
      const rect=track.getBoundingClientRect();
      const height=Math.max(1,track.clientHeight||rect.height||1);
      const span=Math.max(1,gesture.windowEnd-gesture.windowStart);
      const pan=Math.round((event.clientY-gesture.startY)/height*span);
      let start=gesture.windowStart+pan;
      let end=gesture.windowEnd+pan;
      let focus=gesture.focus+pan;
      const now=Math.floor(Date.now()/1000);
      const crossedLive=gesture.focus<now-1&&focus>=now-1;

      if(start<0) {
        focus-=start;
        end-=start;
        start=0;
      }
      this._winStart=start;
      this._winEnd=end;
      this._timelineFocusTs=Math.max(start,Math.min(end,Math.round(focus)));
      this._exhausted=false;
      if(crossedLive) {
        this._timelineLiveCrossed=true;
        this._scrubTarget=now;
      } else {
        this._scrubTarget=this._timelineFocusTs;
      }

      this._updateTimelineLive();
      this._renderRange();
      this._reconcileTimelineDuringMove();
      this._scheduleTimelineDynamicData('motion');
      this._updateTimelineScrubLabel(this._scrubTarget);
    },options);

    track.addEventListener('pointerup',(event)=>finish(event,false),options);
    track.addEventListener('pointercancel',(event)=>finish(event,true),options);
    track.addEventListener('lostpointercapture',(event)=>{
      if(gesture&&event.pointerId===gesture.pointerId) finish(event,false);
    },options);
  }
};
