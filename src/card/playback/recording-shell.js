/**
 * Recorded-video shell state, stable media binding, video lookup, and fullscreen behavior.
 *
 * Methods are composed onto SightlineCard.prototype; method names are kept
 * stable so existing card behavior and tests remain unchanged.
 */
export const recordingShellMethods = {
_cancelActivePlayback(keepSession=false) {
    if (typeof this._activePlaybackCleanup === 'function') {
      try { this._activePlaybackCleanup(); } catch (_) {}
    }
    this._activePlaybackCleanup = null;
    if (!keepSession) {
      const session=this._playbackSession;
      this._playbackSession=null;
      if (session) {
        try { session.video?.pause(); } catch (_) {}
        try { session.player?.remove(); } catch (_) {}
      }
    }
  },

_ensurePlaybackShell() {
    const viewer=this.shadowRoot.querySelector('#viewer');
    if (!viewer) return null;
    viewer.style.display='flex';
    let holder=viewer.querySelector('.rec-player');
    if (!holder) {
      viewer.innerHTML='';
      holder=document.createElement('div');
      holder.className='rec-player';
      holder.innerHTML='<div class="playback-loading"><span class="spinner"></span><span>Loading recording…</span></div>';
      viewer.appendChild(holder);
    }
    return holder;
  },

_setPlaybackLoading(show, text='Loading recording…') {
    const holder=this.shadowRoot.querySelector('#viewer .rec-player');
    if (!holder) return;
    let el=holder.querySelector('.playback-loading');
    if (show) {
      if (!el) { el=document.createElement('div'); el.className='playback-loading'; holder.appendChild(el); }
      el.innerHTML=`<span class="spinner"></span><span>${text}</span>`;
      el.style.display='flex';
    } else if (el) {
      el.style.display='none';
    }
  },

_bindStableRecordingVideo(video, session) {
    if (!video || session.video===video && session.bound) return;
    session.video=video;
    session.bound=true;
    video.controls=true;
    video.playsInline=true;
    video.preload='auto';
    video.muted=true;
    video.setAttribute('controls','');
    video.setAttribute('playsinline','');
    video.setAttribute('webkit-playsinline','');

    const playAfterSeek=async()=>{
      if (session.token!==this._playSeq || this._playbackSession!==session) return;
      this._setPlaybackLoading(false);
      this._playing={rec:session.targetTs};
      this._scrubTarget=session.targetTs;
      try {
        await video.play();
      } catch(err) {
        // Native controls remain available if iOS consumes the original gesture
        // while the HLS seek is being prepared.
        console.debug('[Frigate] recording play deferred',err?.name||err||'');
      }
    };

    const applyPendingSeek=()=>{
      if (session.token!==this._playSeq || this._playbackSession!==session) return;
      if (session.seekInFlight) return;
      if (!Number.isFinite(video.duration) || video.duration<=0) return;
      // `null` means there is no pending seek. Number(null) is 0 in
      // JavaScript, so converting first caused later canplay/durationchange
      // callbacks to issue an accidental seek back to media time 0 — exactly
      // the first second of each hourly VOD source on desktop.
      if (session.pendingSeek == null) return;
      const target=Number(session.pendingSeek);
      if (!Number.isFinite(target)) return;
      const clamped=Math.max(0,Math.min(target,Math.max(0,video.duration-0.05)));
      const current=Number(video.currentTime);

      // Match Frigate's controller for *every* seek, not just the initial load:
      // assign currentTime, wait for `seeked`, then play. An earlier implementation accidentally
      // bypassed this path for same-hour timeline scrubs and called play()
      // immediately, which can strand Safari/WKWebView in a buffering state.
      if (Number.isFinite(current) && Math.abs(current-clamped)<0.35) {
        session.pendingSeek=null;
        session.lastMediaTime=clamped;
        playAfterSeek();
        return;
      }

      // Pausing native iOS HLS before a discontinuous seek prevents WebKit from
      // trying to continue decoding the old position while the new byte range is
      // being resolved. The video remains mounted, so there is no visual pop.
      if (session.preferNativeIOS) {
        try { video.pause(); } catch(_) {}
      }

      session.seekInFlight=true;
      const requested=clamped;
      const onSeeked=()=>{
        if (session.token!==this._playSeq || this._playbackSession!==session) return;
        clearTimeout(session.seekTimer);
        session.seekTimer=null;
        session.seekInFlight=false;
        session.lastMediaTime=Number(video.currentTime);

        // A newer scrub can arrive while Safari is completing this seek. Never
        // play the stale position: immediately apply the newest pending target.
        const latest=session.pendingSeek == null ? NaN : Number(session.pendingSeek);
        if (Number.isFinite(latest) && Math.abs(latest-requested)>0.35) {
          applyPendingSeek();
          return;
        }
        session.pendingSeek=null;
        playAfterSeek();
      };
      video.addEventListener('seeked',onSeeked,{once:true});
      try {
        video.currentTime=clamped;
      } catch(_) {
        session.seekInFlight=false;
        try { video.removeEventListener('seeked',onSeeked); } catch(_) {}
        return;
      }

      // WebKit occasionally omits `seeked` for native HLS even after currentTime
      // has moved. Recover without reloading the source or jumping to the hour.
      clearTimeout(session.seekTimer);
      session.seekTimer=setTimeout(()=>{
        if (session.token!==this._playSeq || this._playbackSession!==session || !session.seekInFlight) return;
        try { video.removeEventListener('seeked',onSeeked); } catch(_) {}
        session.seekInFlight=false;
        const actual=Number(video.currentTime);
        if (Number.isFinite(actual) && Math.abs(actual-requested)<0.75 && video.readyState>=2) {
          session.pendingSeek=null;
          session.lastMediaTime=actual;
          playAfterSeek();
          return;
        }
        // Keep the requested target and retry when Safari reports more media.
        const retry=()=>{
          video.removeEventListener('canplay',retry);
          video.removeEventListener('progress',retry);
          applyPendingSeek();
        };
        video.addEventListener('canplay',retry,{once:true});
        video.addEventListener('progress',retry,{once:true});
      },1500);
    };

    session.requestSeek=(mediaTime,targetTs)=>{
      if (session.token!==this._playSeq || this._playbackSession!==session) return false;
      if (!Number.isFinite(Number(mediaTime))) return false;
      session.targetTs=Math.floor(Number(targetTs));
      session.pendingSeek=Math.max(0,Number(mediaTime));
      this._playing={rec:session.targetTs};
      this._scrubTarget=session.targetTs;
      applyPendingSeek();
      return true;
    };

    const sync=()=>{
      if (session.token!==this._playSeq || this._playbackSession!==session) return;
      // Desktop hls.js briefly exposes currentTime=0 when a new hour source is
      // attached. Do not let that transient decoder position become the
      // timeline's authoritative timestamp while the requested seek is still
      // pending/in flight; doing so visibly snapped the playhead/window to the
      // first second of every hour. Manual timeline movement also owns the
      // playhead until the gesture settles.
      if (this._timelineInteracting || session.seekInFlight ||
          (session.pendingSeek != null && Number.isFinite(Number(session.pendingSeek)))) return;
      const rel=Number(video.currentTime);
      if (!Number.isFinite(rel) || rel<0) return;
      const abs=this._frigateProgress(rel,session.recordings,session.inpointOffset);
      if (!Number.isFinite(abs)) return;
      session.lastAbsolute=abs;
      this._scrubTarget=abs;
      this._playing={rec:abs};
      this._updateTimelinePlaybackTime(abs);
    };
    const ready=()=>{
      this._clearStatusOverlay();
      applyPendingSeek();
      // Do not hide the loader merely because metadata exists. Keep it visible
      // until the exact seek has settled or playback actually begins.
      if ((session.pendingSeek == null || !Number.isFinite(Number(session.pendingSeek))) && !session.seekInFlight && video.readyState>=2) {
        this._setPlaybackLoading(false);
      }
    };
    const onError=()=>{
      if (session.token!==this._playSeq || this._playbackSession!==session) return;
      console.warn('[Frigate] stable recording player error',video.error?.code,video.error?.message||'');
      this._setPlaybackLoading(true,'Unable to play recording');
    };
    ['loadedmetadata','durationchange','canplay'].forEach(ev=>video.addEventListener(ev,ready));
    ['timeupdate','playing','seeked'].forEach(ev=>video.addEventListener(ev,sync));
    video.addEventListener('waiting',()=>{ if(!video.paused)this._setPlaybackLoading(true,'Buffering…'); });
    video.addEventListener('playing',()=>{
      this._setPlaybackLoading(false);
    });
    video.addEventListener('ended',()=>{
      if(session.token!==this._playSeq || this._playbackSession!==session) return;
      if (session.iosWindowed) {
        const next=Math.floor(Number(session.sourceEnd));
        if (Number.isFinite(next) && next < Math.floor(Date.now()/1000)-1) {
          this._showRecording(next,next+5*60,next);
        }
        return;
      }
      this._continueRecording(session.sourceEnd,session.token);
    });
    video.addEventListener('error',onError);
    session.cleanup=()=>{
      clearTimeout(session.seekTimer);
      session.seekTimer=null;
      try { video.pause(); } catch(_) {}
      try { video.removeAttribute('src'); video.srcObject=null; video.load(); } catch(_) {}
    };
    this._activePlaybackCleanup=session.cleanup;
  },

_findVideo(node, depth, crossedShadow) {
    if (!node || (depth||0) > 6) return null;
    if (node.tagName === 'VIDEO') { node._viaShadow = !!crossedShadow; return node; }
    if (node.shadowRoot) {
      const v = node.shadowRoot.querySelector('video');
      if (v) { v._viaShadow = true; return v; }
      for (const child of node.shadowRoot.children) { const f = this._findVideo(child, (depth||0)+1, true); if (f) return f; }
    }
    const children = node.children || [];
    for (const child of children) { const f = this._findVideo(child, (depth||0)+1, crossedShadow); if (f) return f; }
    return null;
  },

_fullscreen(el) {
    if (!el) return;
    // Live WebRTC must stay in the exact same DOM node. Never invoke
    // webkitEnterFullscreen() on its nested video and never mutate srcObject.
    // The wrapper/fullscreen element preserves the stream session.
    const liveWrap = el.id === 'eng-wrap' || !!el.closest?.('#eng-wrap');
    if (liveWrap) {
      // Never hand a live MediaStream video to iOS's native fullscreen
      // compositor. Keep the exact same player/peer inline and fullscreen only
      // the wrapper. This avoids the WebKit state where video rendering freezes
      // while the stream's audio track continues normally.
      if(this._isIOSRecordingPlatform()) {
        el.classList.add('live-pseudo-fullscreen');
        this._livePseudoFullscreen=true;
        this._removeLiveFsMirror();
        this._addLiveFsExit(el);
        const v=this._go2rtcLive?.video || this._findVideo(this._engine);
        try { v?.setAttribute?.('controlslist','nofullscreen'); const p=v?.play?.(); if(p?.catch)p.catch(()=>{}); } catch(_) {}
        return;
      }
      const req = el.requestFullscreen || el.webkitRequestFullscreen;
      if (req) { try { const p=req.call(el); if(p?.catch) p.catch(()=>{}); return; } catch(_) {} }
      el.classList.add('live-pseudo-fullscreen');
      this._livePseudoFullscreen = true;
      this._addLiveFsExit(el);
      return;
    }
    const vid = el.tagName === 'VIDEO' ? el : this._findVideo(el);
    const isLivePlayerVideo = vid && vid._viaShadow;
    if (vid) delete vid._viaShadow;
    if (vid && !isLivePlayerVideo && typeof vid.webkitEnterFullscreen === 'function' && vid.webkitSupportsFullscreen !== false) {
      try { vid.webkitEnterFullscreen(); return; } catch (_) { /* fall through */ }
    }
    const req = el.requestFullscreen || el.webkitRequestFullscreen;
    if (req) { const p=req.call(el); if (p?.catch) p.catch(()=>{}); return; }
    if (vid) { const req2=vid.requestFullscreen || vid.webkitRequestFullscreen; if(req2) req2.call(vid); }
  }
};
