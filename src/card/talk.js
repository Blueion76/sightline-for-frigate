import { VERSION, CARD_TAG, DAY, DEFAULT_ROTATE_S, ICONS, LABEL_COLORS, PALETTE, TIMELINE_GLYPHS, CAM_COLORS } from '../constants.js';
import { cap, parseWs, labelColor, timelineGlyph, mkCamState, camDisplayName } from '../helpers.js';
import { STYLES } from '../styles.js';

// Prototype methods grouped by responsibility.
export const talkMethods = {
_talkStreamName() {
    const cam = this._activeCam; if (!cam) return null;
    return cam.go2rtc_stream || this._cc().cam || (cam.entity ? String(cam.entity).split('.').pop() : null) || null;
  },

async _toggleTalk() {
    if (this._viewMode === 'grid' || this._playing) return;
    // A pointerdown on iOS may already have started Talk so that getUserMedia
    // runs inside the browser's user-activation window. The following click
    // is only the synthetic follow-up to that same gesture. Consume it rather
    // than toggling Talk off immediately.
    if (this._talkGestureStarted) {
      this._talkGestureStarted = false;
      return;
    }
    if (this._talkState === 'connecting') return;
    if (this._talkSpeaking) { await this._stopTalk(); return; }
    this._talkSpeaking=true; this._talkState='connecting'; this._micDesiredMute=false;
    this._wireTalkButton();
    this._startTalk().catch(err=>{
      console.warn('[Frigate] talk start failed',err);
      this._talkSpeaking=false; this._talkConnected=false; this._talkState='error';
      this._wireTalkButton(); this._renderStreamCtrl();
    });
  },

_endTalk() {
    this._talkSpeaking=false; this._talkState='idle'; this._micDesiredMute=true;
    this._stopTalkWaveform();
    this._setMicMuted(true);
    this._startMicDisconnectTimer();
    this._talkConnected=false;
    this._wireTalkButton(); this._renderStreamCtrl();
  },

_wireTalkButton() {
    const btn = this.shadowRoot.querySelector('#sc-talk');
    if (!btn) return;
    // iOS Safari/WebKit is stricter about getUserMedia user activation than
    // desktop browsers. Start microphone acquisition directly from the
    // pointer gesture, then let the delegated click handler consume the
    // resulting activation instead of starting a second request. This keeps
    // Talk one-tap on iOS without bringing back the separate audio button.
    if (!btn.__frigateTalkPointerBound) {
      btn.__frigateTalkPointerBound = true;
      btn.addEventListener('pointerdown', () => {
        if (this._talkSpeaking || this._talkState === 'connecting') return;
        this._talkGestureStarted = true;
        // iOS/WebKit grants media playback privileges to work started directly
        // inside the user gesture.  Do this BEFORE getUserMedia() yields, so
        // starting the microphone cannot consume the only activation token.
        this._unlockLiveAudioFromGesture();
        this._toggleTalk();
      }, {passive:true});
    }
    const active = !!this._talkSpeaking;
    const connecting = this._talkState === 'connecting';
    btn.classList.toggle('talking', active);
    btn.classList.toggle('connected', !!this._talkConnected);
    btn.classList.toggle('talk-connecting', connecting);
    btn.setAttribute('aria-pressed', String(active));
    btn.setAttribute('aria-busy', String(connecting));
    btn.setAttribute('aria-label', connecting ? 'Connecting…' : (active ? 'End two-way audio' : 'Start two-way audio'));
    btn.title = connecting ? 'Connecting…' : (active ? 'End two-way audio' : 'Start two-way audio');
  },

_unlockLiveAudioFromGesture() {
    this._liveAudioEnabled = true;
    const video = this._go2rtcLive?.video || this.shadowRoot?.querySelector('#engine video');
    if (!video) return;
    try {
      video.muted = false;
      video.volume = 1;
      video.setAttribute('playsinline', '');
      const p = video.play();
      if (p && typeof p.catch === 'function') p.catch(() => {});
    } catch (_) {}
  },

_updateTalkButtonVisual() {
    const btn = this.shadowRoot.querySelector('#sc-talk');
    if (!btn) return;
    const speaking = !!this._talkSpeaking;
    const connected = !!this._talkConnected;
    btn.classList.toggle('talking', speaking);
    btn.classList.toggle('connected', connected);
    btn.setAttribute('aria-pressed', String(speaking));
    btn.setAttribute('aria-busy', String(connected && !speaking));
    btn.title = speaking ? 'Release to stop talking' : 'Hold to talk';
    btn.setAttribute('aria-label', btn.title);
  },

_pressTalk() {
    return this._toggleTalk();
  },

_releaseTalk() {
    // Tap-to-toggle: pointer release must not stop talkback.
  },

_startTalkWaveform() {
    const canvas = this.shadowRoot.querySelector('#talk-wave');
    if (!canvas || !this._talkMic || !this._talkSpeaking) return;
    if (this._talkWaveRAF) return;

    const track = this._talkMic.getAudioTracks?.()[0];
    if (!track) return;

    try {
      if (!this._talkAudioCtx || this._talkAudioCtx.state === 'closed') {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) return;
        this._talkAudioCtx = new Ctx();
      }
      const ctx = this._talkAudioCtx;
      if (ctx.state === 'suspended') ctx.resume().catch(() => {});
      if (!this._talkAnalyser) {
        this._talkAnalyser = ctx.createAnalyser();
        this._talkAnalyser.fftSize = 128;
        this._talkAnalyser.smoothingTimeConstant = 0.72;
        this._talkAudioSource = ctx.createMediaStreamSource(this._talkMic);
        this._talkAudioSource.connect(this._talkAnalyser);
      }
      const analyser = this._talkAnalyser;
      const data = new Uint8Array(analyser.fftSize);
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const cssW = 72, cssH = 72;
      canvas.width = cssW * dpr; canvas.height = cssH * dpr;
      canvas.style.width = cssW + 'px'; canvas.style.height = cssH + 'px';
      const c = canvas.getContext('2d');
      c.setTransform(dpr,0,0,dpr,0,0);

      const draw = () => {
        this._talkWaveRAF = requestAnimationFrame(draw);
        if (!this._talkSpeaking || !this.shadowRoot.contains(canvas)) {
          this._talkWaveRAF = null; return;
        }
        analyser.getByteTimeDomainData(data);
        let rms=0;
        for (let i=0;i<data.length;i++) {
          const x=(data[i]-128)/128; rms += x*x;
        }
        rms=Math.sqrt(rms/data.length);
        const energy=Math.min(1, Math.max(.08, rms*4.2));

        c.clearRect(0,0,cssW,cssH);
        const cx=cssW/2, cy=cssH/2;
        // iOS 9 Siri-inspired, layered flowing waveform: restrained when quiet,
        // wider/brighter as the microphone receives speech.
        const waves=[
          {a:8+18*energy, f:1.7, phase:.0, alpha:.52},
          {a:5+14*energy, f:2.25, phase:1.3, alpha:.78},
          {a:4+11*energy, f:2.9, phase:2.1, alpha:.92},
        ];
        waves.forEach((w,wi)=>{
          c.beginPath();
          for(let x=0;x<=cssW;x+=2){
            const nx=(x-cx)/cx;
            const envelope=Math.max(0,1-Math.abs(nx))*0.95;
            const y=cy + Math.sin(nx*Math.PI*w.f + w.phase + performance.now()/420*(wi+1)) * w.a * envelope;
            if(x===0)c.moveTo(x,y); else c.lineTo(x,y);
          }
          c.lineWidth=wi===1?2.1:1.5;
          c.globalAlpha=w.alpha*energy;
          c.strokeStyle=wi===0?'#5e9cff':(wi===1?'#b66cff':'#ff6b8a');
          c.stroke();
        });
        c.globalAlpha=1;
        c.beginPath(); c.moveTo(7,cy); c.lineTo(cssW-7,cy);
        c.lineWidth=1; c.strokeStyle='rgba(255,255,255,.18)'; c.stroke();
      };
      draw();
    } catch (e) {
      console.warn('[Frigate] waveform init failed', e);
    }
  },

_stopTalkWaveform() {
    if (this._talkWaveRAF) cancelAnimationFrame(this._talkWaveRAF);
    this._talkWaveRAF = null;
    if (this._talkAudioSource) { try { this._talkAudioSource.disconnect(); } catch (_) {} this._talkAudioSource=null; }
    this._talkAnalyser = null;
    if (this._talkAudioCtx && this._talkAudioCtx.state !== 'closed') {
      this._talkAudioCtx.close().catch(() => {});
    }
    this._talkAudioCtx = null;
  },

_frigateProxyWsUrl(stream) {
    // The Frigate HA integration owns the authentication boundary. Its
    // WebRTCProxyView exposes Frigate's /live/webrtc/api/ws endpoint through
    // Home Assistant, so Safari never has to reach Frigate:5000/8971 or
    // go2rtc:1984 directly. This is the same network boundary used by the
    // Frigate integration's live WebRTC path.
    if (!stream) return null;
    const scheme = location.protocol === 'https:' ? 'wss:' : 'ws:';
    const clientId = this._activeCam?.frigate_client_id || this._cc()?.clientId || this._config.frigate_client_id || 'frigate';
    const prefix = `/api/frigate/${encodeURIComponent(String(clientId))}/go2rtc/ws/api/ws`;
    return `${scheme}//${location.host}${prefix}?src=${encodeURIComponent(stream)}`;
  },

async _refreshMicrophoneAvailability() {
    let present=false;
    if(this._config?.two_way_audio && this._micSupported() && navigator.mediaDevices?.enumerateDevices) {
      try {
        const devices=await navigator.mediaDevices.enumerateDevices();
        present=Array.isArray(devices) && devices.some(d=>d?.kind==='audioinput');
      } catch (_) {
        present=false;
      }
    }
    const changed=this._microphonePresent!==present;
    this._microphonePresent=present;
    if(!present && this._talkSpeaking) {
      try { await this._stopTalk(); } catch (_) {}
    }
    if(changed && this.isConnected) this._renderStreamCtrl();
    return present;
  },

_setupMicrophoneDetection() {
    if(!this._config?.two_way_audio) {
      this._microphonePresent=false;
      if(this._micDeviceChangeHandler && navigator.mediaDevices?.removeEventListener) {
        try { navigator.mediaDevices.removeEventListener('devicechange',this._micDeviceChangeHandler); } catch (_) {}
      }
      this._micDeviceChangeHandler=null;
      if(this.isConnected) this._renderStreamCtrl();
      return;
    }
    this._refreshMicrophoneAvailability();
    if(!this._micDeviceChangeHandler && navigator.mediaDevices?.addEventListener) {
      this._micDeviceChangeHandler=()=>this._refreshMicrophoneAvailability();
      try { navigator.mediaDevices.addEventListener('devicechange',this._micDeviceChangeHandler); } catch (_) {}
    }
  },

_micSupported() { return !!navigator.mediaDevices?.getUserMedia; },

_setMicMuted(muted) {
    this._micDesiredMute=!!muted;
    this._talkMic?.getTracks().forEach(t=>t.enabled=!this._micDesiredMute);
  },

_startMicDisconnectTimer() {
    if(this._config.two_way_audio_disconnect_seconds===0) return;
    if(this._micDisconnectTimer) clearTimeout(this._micDisconnectTimer);
    const sec=this._config.two_way_audio_disconnect_seconds;
    if(sec>0) this._micDisconnectTimer=setTimeout(()=>this._disconnectMic(),sec*1000);
  },

_disconnectMic() {
    if(this._micDisconnectTimer) clearTimeout(this._micDisconnectTimer); this._micDisconnectTimer=null;
    if(this._talkMic){try{this._talkMic.getTracks().forEach(t=>t.stop());}catch(_){} this._talkMic=null;}
    if(this._go2rtcLive && !this._playing && this._viewMode !== 'grid') {
      this._mountGo2RTCVideo(null).catch(e=>console.warn('[Frigate] go2rtc microphone disconnect reconnect failed',e));
    }
  },

async _startTalk() {
    if(!this._micSupported()) throw new Error('Microphone is not supported');
    if(!this._talkStreamName() || !this._go2rtcEndpoint()) throw new Error('No go2rtc stream is configured');
    const micPromise = navigator.mediaDevices.getUserMedia({audio:true,video:false});
    this._talkMicReadyPromise = micPromise;
    let mic;
    try {
      mic = await micPromise;
      this._microphonePresent = !!mic?.getAudioTracks?.().length;
      this._micForbidden = false;
    } catch (err) {
      const name=String(err?.name||'');
      if(name==='NotFoundError' || name==='DevicesNotFoundError') this._microphonePresent=false;
      if(name==='NotAllowedError' || name==='PermissionDeniedError' || name==='SecurityError') this._micForbidden=true;
      this._renderStreamCtrl();
      throw err;
    } finally {
      if (this._talkMicReadyPromise === micPromise) this._talkMicReadyPromise = null;
    }
    // Starting Talk must not call _disconnectMic(): that method intentionally
    // tears down the microphone and starts a receive-only remount for ending
    // Talk. Calling it here creates a second asynchronous WebRTC negotiation
    // and can race the microphone-enabled negotiation on iOS.
    if(this._micDisconnectTimer) {
      clearTimeout(this._micDisconnectTimer);
      this._micDisconnectTimer=null;
    }
    if(this._talkMic) {
      try { this._talkMic.getTracks().forEach(t=>t.stop()); } catch (_) {}
    }
    this._talkMic=mic;
    this._setMicMuted(false);

    // The pointer gesture already unlocked the live video's audio before
    // getUserMedia() yielded. Re-apply the desired state after the Talk peer
    // is mounted in case the video element was replaced during remount.
    this._unlockLiveAudioFromGesture();

    // ACC reconnects the go2rtc VideoRTC session so microphone tracks are
    // present before createOffer(). We do the same instead of renegotiating an
    // already-established peer connection.
    await this._mountGo2RTCVideo(mic);
    this._talkPC=this._go2rtcLive?.pc||null; this._talkWS=this._go2rtcLive?.ws||null; this._talkUsingLivePC=true;
    this._talkConnected=true; this._talkState='connected';
    this._renderStreamCtrl(); this._startTalkWaveform();
  },

async _waitForPeerUsable(pc, timeout=7000) {
    if (!pc) return;
    const usable=()=>pc.connectionState==='connected' || pc.iceConnectionState==='connected' || pc.iceConnectionState==='completed';
    if (usable()) return;
    await new Promise((resolve,reject)=>{
      const t=setTimeout(()=>resolve(),timeout);
      const fn=()=>{
        if(usable()){
          clearTimeout(t);
          pc.removeEventListener('connectionstatechange',fn);
          pc.removeEventListener('iceconnectionstatechange',fn);
          resolve();
        } else if(pc.connectionState==='failed' || pc.iceConnectionState==='failed'){
          clearTimeout(t);
          pc.removeEventListener('connectionstatechange',fn);
          pc.removeEventListener('iceconnectionstatechange',fn);
          reject(new Error('WebRTC connection failed'));
        }
      };
      pc.addEventListener('connectionstatechange',fn);
      pc.addEventListener('iceconnectionstatechange',fn);
    });
  },

async _stopTalk() {
    if(this._micDisconnectTimer) clearTimeout(this._micDisconnectTimer); this._micDisconnectTimer=null;
    this._stopTalkWaveform();
    this._talkSpeaking=false; this._talkConnected=false; this._talkState='idle';
    this._talkMicReadyPromise=null;

    // Do not call _disconnectMic() here: that method intentionally remounts
    // the live WebRTC session. Doing that and then immediately destroying it
    // creates a race on iOS and can leave the live peer in a closed state.
    if(this._talkMic){try{this._talkMic.getTracks().forEach(t=>t.stop());}catch(_){} this._talkMic=null;}
    this._destroyGo2RTCLive();
    this._talkPC=null; this._talkWS=null; this._talkUsingLivePC=false; this._talkSender=null;
    this._renderStreamCtrl();

    // Re-establish ordinary receive-only live video after ending talkback.
    // This is a separate negotiation and therefore cannot inherit the
    // sendonly microphone transceiver from the previous session.
    if(this._viewMode !== 'grid' && !this._playing && this._config.two_way_audio && this._talkStreamName()) {
      try { await this._mountGo2RTCVideo(null); }
      catch(e) { console.warn('[Frigate] live restore after talkback failed',e); }
    }
  }
};
