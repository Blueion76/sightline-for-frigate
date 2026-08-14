/**
 * iOS/WebKit fullscreen recovery and MediaStream compositor safeguards.
 *
 * Methods are composed onto SightlineCard.prototype; method names are kept
 * stable so existing card behavior and tests remain unchanged.
 */
export const liveFullscreenMethods = {
_wireLiveFsNudge(engineEl, attempt=0) {
    const vid=this._findVideo(engineEl);
    if(!vid){
      if(attempt<30) setTimeout(()=>{
        if(this._engine===engineEl) this._wireLiveFsNudge(engineEl,attempt+1);
      },100);
      return;
    }
    this._watchAutoAspectMedia(vid);
    if(vid._frigateLiveFsCleanup) return;

    const wrap=this.shadowRoot?.querySelector('#eng-wrap');
    if(!wrap) return;

    vid.playsInline=true;
    vid.setAttribute('playsinline','');
    vid.setAttribute('webkit-playsinline','');
    // Keep native AVPlayer fullscreen out of the live MediaStream path on iOS.
    // The card no longer renders a dedicated iOS fullscreen button; this is a
    // defensive guard for native player chrome / WebKit presentation changes.
    try { vid.setAttribute('controlslist','nofullscreen'); } catch(_) {}

    // iOS can pause a MediaStream-backed <video> as it is transferred to/from
    // native AVPlayer fullscreen. Keep the exact same MediaStream/peer attached,
    // but let AVPlayer own fullscreen while it is active. Critically, once native
    // fullscreen ends we restore the ordinary card geometry immediately. The old
    // Earlier behavior intentionally left a fixed pseudo-fullscreen shell
    // behind, which is the oversized player users then had to dismiss with X.
    let fsHandoffUntil=0;
    let nativeFullscreenActive=false;
    const resumeSameLiveVideo=()=>{
      if(!vid.isConnected || !this.isConnected) return;
      if(this._go2rtcLive?.video && this._go2rtcLive.video!==vid && engineEl===vid) return;
      try {
        vid.playsInline=true;
        vid.setAttribute('playsinline','');
        vid.setAttribute('webkit-playsinline','');
        const p=vid.play();
        if(p?.catch) p.catch(()=>{});
      } catch(_) {}
    };
    const clearFullscreenShell=()=>{
      // This is intentionally synchronous: layout must be back to the embedded
      // card before WebKit paints the first post-fullscreen frame.
      wrap.classList.remove('live-pseudo-fullscreen');
      wrap.querySelector('.live-fs-exit')?.remove();
      this._livePseudoFullscreen=false;
    };
    const beginNativeFullscreen=()=>{
      if(!vid.isConnected) return;
      nativeFullscreenActive=true;
      fsHandoffUntil=performance.now()+1600;
      // A stale visual shell from an earlier fallback must never sit underneath
      // or survive a real native fullscreen presentation.
      clearFullscreenShell();
      this._removeLiveFsMirror();
    };
    const finishNativeFullscreen=(force=false)=>{
      if(!force && !nativeFullscreenActive && !this._livePseudoFullscreen) return;
      nativeFullscreenActive=false;
      fsHandoffUntil=performance.now()+1600;
      clearFullscreenShell();

      // Recover the live compositor inside the NORMAL-SIZED card. A mirror made
      // from the same receiver tracks can bridge the first post-fullscreen frame
      // without keeping the wrapper fixed over the viewport.
      resumeSameLiveVideo();
      if(vid.srcObject) this._createLiveFsMirror(vid,wrap);
      requestAnimationFrame(resumeSameLiveVideo);
      setTimeout(resumeSameLiveVideo,80);
      setTimeout(()=>this._recoverIOSLiveAfterFullscreen(),120);
    };
    const onBegin=()=>beginNativeFullscreen();
    const onPresentation=()=>{
      if(vid.webkitPresentationMode==='fullscreen') beginNativeFullscreen();
      else if(nativeFullscreenActive || this._livePseudoFullscreen) finishNativeFullscreen(true);
    };
    // Some WKWebView builds can deliver end without a reliable begin/presentation
    // sequence. Force the geometry cleanup on every native fullscreen end.
    const onEnd=()=>finishNativeFullscreen(true);
    const onPause=()=>{
      // Resume only pauses produced by the native-fullscreen handoff. Once the
      // transition has settled, the user's normal pause control must work.
      if(nativeFullscreenActive && performance.now()<fsHandoffUntil) {
        setTimeout(resumeSameLiveVideo,0);
      }
    };

    vid.addEventListener('webkitbeginfullscreen',onBegin);
    vid.addEventListener('webkitendfullscreen',onEnd);
    vid.addEventListener('webkitpresentationmodechanged',onPresentation);
    vid.addEventListener('pause',onPause);

    const cleanup=()=>{
      vid.removeEventListener('webkitbeginfullscreen',onBegin);
      vid.removeEventListener('webkitendfullscreen',onEnd);
      vid.removeEventListener('webkitpresentationmodechanged',onPresentation);
      vid.removeEventListener('pause',onPause);
      try { delete vid._frigateLiveFsCleanup; } catch(_) { vid._frigateLiveFsCleanup=null; }
    };
    vid._frigateLiveFsCleanup=cleanup;
    if(this._liveFsCleanup && this._liveFsCleanup!==cleanup) {
      try { this._liveFsCleanup(); } catch(_) {}
    }
    this._liveFsCleanup=cleanup;
  },

_createLiveFsMirror(source,wrap){
    if(!source?.srcObject||!wrap) return null;
    this._removeLiveFsMirror();
    const mirror=document.createElement('video');
    mirror.className='live-fs-mirror';
    mirror.autoplay=true; mirror.playsInline=true; mirror.muted=true; mirror.controls=false;
    mirror.setAttribute('playsinline',''); mirror.setAttribute('webkit-playsinline','');
    // Use a fresh MediaStream wrapper around the same receiver tracks. This
    // keeps one RTCPeerConnection/audio path, but forces WebKit to create a new
    // video rendering attachment instead of reusing the compositor that native
    // fullscreen may have frozen.
    try {
      mirror.srcObject = source.srcObject instanceof MediaStream
        ? new MediaStream(source.srcObject.getTracks())
        : source.srcObject;
    } catch(_) { mirror.srcObject=source.srcObject; }
    wrap.appendChild(mirror);
    this._liveFsMirror=mirror;
    const play=()=>{ try { const p=mirror.play(); if(p?.catch)p.catch(()=>{}); } catch(_) {} };
    requestAnimationFrame(play); setTimeout(play,80);
    return mirror;
  },

_removeLiveFsMirror(){
    const m=this._liveFsMirror;
    this._liveFsMirror=null;
    if(m){ try { m.pause(); m.srcObject=null; } catch(_) {} try { m.remove(); } catch(_) {} }
  },

_recoverIOSLiveAfterFullscreen(){
    if(!this._isIOSRecordingPlatform() || !this.isConnected) { this._removeLiveFsMirror(); return; }
    const seq=++this._liveFsRecoverySeq;
    const source=this._go2rtcLive?.video || this._findVideo(this._engine);
    if(!source) {
      this._removeLiveFsMirror();
      if(!this._playing) requestAnimationFrame(()=>{ if(seq===this._liveFsRecoverySeq && this.isConnected) this._mountEngine(); });
      return;
    }
    try {
      source.playsInline=true;
      source.setAttribute('playsinline','');
      source.setAttribute('webkit-playsinline','');
      source.setAttribute('controlslist','nofullscreen');
      const p=source.play?.(); if(p?.catch)p.catch(()=>{});
    } catch(_) {}

    // Keep the mirror on top while the original element proves that WebKit is
    // producing frames again. requestVideoFrameCallback detects the exact
    // compositor recovery rather than trusting readyState/videoWidth, which can
    // remain healthy even when iOS has frozen the visual surface.
    let recovered=false;
    const finish=()=>{
      if(recovered || seq!==this._liveFsRecoverySeq) return;
      recovered=true;
      clearTimeout(timer);
      this._removeLiveFsMirror();
    };
    try {
      if(typeof source.requestVideoFrameCallback==='function') {
        source.requestVideoFrameCallback(()=>finish());
      }
    } catch(_) {}
    const startTime=Number(source.currentTime);
    const timer=setTimeout(()=>{
      if(recovered || seq!==this._liveFsRecoverySeq || !this.isConnected) return;
      const moved=Number.isFinite(startTime) && Number.isFinite(Number(source.currentTime)) && Number(source.currentTime)>startTime+.03;
      if(moved) { finish(); return; }
      // Last-resort repair: rebuild only the live engine. This is intentionally
      // delayed until the old video failed to produce a frame, avoiding needless
      // WebRTC renegotiation on healthy exits while guaranteeing that a frozen
      // iOS compositor does not remain on screen.
      this._removeLiveFsMirror();
      if(this._playing) return;
      this._unmountEngine();
      requestAnimationFrame(()=>{ if(this.isConnected && !this._playing) this._mountEngine(); });
    },650);
  },

_exitLivePseudoFullscreen(wrap){
    if(!wrap) return;
    wrap.classList.remove('live-pseudo-fullscreen');
    wrap.querySelector('.live-fs-exit')?.remove();
    this._livePseudoFullscreen=false;
    // Do not immediately destroy the bridge video. It covers the WebKit
    // compositor hand-back until the original live element produces a frame.
    this._recoverIOSLiveAfterFullscreen();
  },

_addLiveFsExit(wrap){
    if(!wrap || wrap.querySelector('.live-fs-exit')) return;
    const b=document.createElement('button');
    b.className='live-fs-exit'; b.type='button'; b.title='Exit fullscreen'; b.setAttribute('aria-label','Exit fullscreen'); b.textContent='×';
    b.addEventListener('click',e=>{
      e.stopPropagation();
      this._exitLivePseudoFullscreen(wrap);
    });
    wrap.appendChild(b);
  }
};
