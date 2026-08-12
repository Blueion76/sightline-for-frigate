import { VERSION, CARD_TAG, DAY, DEFAULT_ROTATE_S, ICONS, LABEL_COLORS, PALETTE, TIMELINE_GLYPHS, CAM_COLORS } from '../constants.js';
import { cap, parseWs, labelColor, timelineGlyph, mkCamState, camDisplayName } from '../helpers.js';
import { STYLES } from '../styles.js';

// Prototype methods grouped by responsibility.
export const liveMethods = {
async _discoverAll() { await Promise.all(this._config.cameras.map(c => this._discoverOne(c.entity))); },

async _discoverOne(entity) {
    const cache = this._camCache[entity] || mkCamState();
    if (cache.discovered) return;
    const ent = this._hass.states[entity]; if (!ent) return;
    cache.clientId = ent.attributes?.client_id || ent.attributes?.mqtt_client_id || 'frigate';
    cache.cam = ent.attributes?.camera_name || entity.replace(/^camera\./,'');
    cache.discovered = true;
    this._camCache[entity] = cache;
  },

_streamStateObj(entity) {
    const raw = this._hass.states[entity]; if (!raw) return null;
    const attrs = { ...raw.attributes };
    if (this._config.stream_type === 'hls') delete attrs.frontend_stream_type;
    else attrs.frontend_stream_type = 'web_rtc';
    return { ...raw, attributes: attrs };
  },

_unmountEngine() {
    ++this._liveFsRecoverySeq;
    if (this._liveFsCleanup) {
      try { this._liveFsCleanup(); } catch (_) {}
      this._liveFsCleanup = null;
    }
    // Never leave the visual iOS fullscreen shell behind when the live engine
    // is intentionally unmounted (camera switch, playback, card teardown).
    const wrap=this.shadowRoot?.querySelector('#eng-wrap');
    if(wrap){
      wrap.classList.remove('live-pseudo-fullscreen');
      wrap.querySelector('.live-fs-exit')?.remove();
    }
    this._livePseudoFullscreen=false;
    this._removeLiveFsMirror();
    const engine = this.shadowRoot?.querySelector('#engine');
    if (engine) engine.innerHTML = '';
    this._engine = null;
  },

async _mountEngine() {
    const slot = this.shadowRoot.querySelector('#engine'); if (!slot) return;
    const entity = this._activeCam?.entity; if (!entity) return;
    slot.innerHTML = '<div class="ph skel-stream"></div>';
    this._engine = null;

    // When two-way audio is enabled and a go2rtc source is configured, use the
    // same Frigate-proxied go2rtc WebRTC session for video, camera audio and microphone send.
    // This mirrors Advanced Camera Card's VideoRTC architecture and avoids a
    // second talkback peer competing with the live player.
    if (this._config.two_way_audio && this._talkStreamName() && this._go2rtcEndpoint()) {
      try {
        // If Talk is being started or is already active, never create a
        // receive-only peer while the microphone acquisition is in flight.
        // On iOS this can race a render/remount and permanently leave the
        // successful peer with no sendonly audio transceiver.
        if (this._talkSpeaking && this._talkMicReadyPromise) {
          try { await this._talkMicReadyPromise; } catch (_) {}
        }
        await this._mountGo2RTCVideo(this._talkSpeaking ? this._talkMic : null);
        return;
      } catch (e) {
        console.warn('[Frigate] go2rtc live provider failed, falling back to HA camera stream', e);
        this._destroyGo2RTCLive();
      }
    }

    const stateObj = this._streamStateObj(entity);
    if (!stateObj) return;
    const s = document.createElement('ha-camera-stream');
    s.hass = this._hass;
    s.stateObj = stateObj;
    s.controls = true;
    s.muted = this._streamMuted;
    s.style.cssText = 'width:100%;height:100%;display:block';
    slot.innerHTML = ''; slot.appendChild(s);
    this._engine = s;
    // iOS native video fullscreen can interrupt a live WebRTC MediaStream.
    // Wire the nested HA player as soon as it exists; the helper retries until
    // ha-camera-stream has created its internal <video> element.
    this._wireLiveFsNudge(s);
    this._renderStreamCtrl();
  },

_rtcDbg(_label, _data = null) {},

_rtcSafe(v) {
    if (v == null) return v;
    if (typeof v === 'string') return v.length > 1200 ? v.slice(0,1200) + '…' : v;
    if (v instanceof Error) return { name:v.name, message:v.message, stack:v.stack };
    try { return JSON.parse(JSON.stringify(v)); } catch (_) { return String(v); }
  },

_rtcRedactUrl(value) {
    try {
      const u = new URL(String(value), location.origin);
      if (u.searchParams.has('authSig')) u.searchParams.set('authSig', '[redacted]');
      return u.toString();
    } catch (_) { return String(value ?? ''); }
  },

_rtcAudioDiagnostics(pc, microphoneStream) {
    try {
      const tx = pc?.getTransceivers?.() || [];
      const audioTx = tx.filter(t => t.sender?.track?.kind === 'audio' || t.receiver?.track?.kind === 'audio');
      return {
        microphoneTracks: microphoneStream?.getAudioTracks?.().map(t => ({ id:t.id, readyState:t.readyState, enabled:t.enabled, muted:t.muted, label:t.label })) || [],
        audioTransceivers: audioTx.map((t,i) => ({
          i, mid:t.mid, direction:t.direction, currentDirection:t.currentDirection,
          senderTrack:t.sender?.track ? {id:t.sender.track.id,readyState:t.sender.track.readyState,enabled:t.sender.track.enabled,muted:t.sender.track.muted} : null,
          senderKind:t.sender?.track?.kind || null, receiverKind:t.receiver?.track?.kind || null
        }))
      };
    } catch (e) { return {error:this._rtcSafe(e)}; }
  },

async _rtcAudioStats(pc) {
    try {
      const stats = await pc?.getStats?.();
      const out = [];
      stats?.forEach(r => {
        if (r.type === 'outbound-rtp' && r.kind === 'audio') out.push({
          id:r.id, kind:r.kind, packetsSent:r.packetsSent, bytesSent:r.bytesSent,
          packetsLost:r.packetsLost, targetBitrate:r.targetBitrate, codecId:r.codecId,
          remoteId:r.remoteId
        });
      });
      return out;
    } catch (e) { return [{error:this._rtcSafe(e)}]; }
  },

async _signFrigateWsUrl(endpoint, src) {
    const raw = String(endpoint || '');
    if (!raw) throw new Error('Missing go2rtc WebSocket endpoint');
    let u;
    try { u = new URL(raw); } catch (_) { throw new Error('Invalid go2rtc WebSocket endpoint'); }
    const pageWsOrigin = location.origin.replace(/^http/i, 'ws');
    const sameOrigin = u.origin === pageWsOrigin;
    if (!sameOrigin || !u.pathname.startsWith('/api/frigate/')) {
      throw new Error('Refusing non-Home-Assistant Frigate WebSocket endpoint');
    }
    const path = `${u.pathname}${u.search}${u.search ? '&' : '?'}src=${encodeURIComponent(src)}`;
    if (!this._hass?.callWS) throw new Error('Home Assistant connection is unavailable for WebSocket authentication');
    const signed = await this._hass.callWS({ type:'auth/sign_path', path, expires:300 });
    if (!signed?.path) throw new Error('Home Assistant did not return a signed WebSocket path');
    const signedUrl = new URL(signed.path, location.origin);
    signedUrl.protocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
    return { url:signedUrl.toString(), authMode:'ha_signed_path', signedPath:signed.path };
  },

_rtcSdpSummary(sdp) {
    if (!sdp) return null;
    const lines=sdp.split(/\r?\n/);
    const media=lines.filter(x=>/^m=|^a=mid:|^a=sendrecv|^a=sendonly|^a=recvonly|^a=inactive|^a=rtpmap:|^a=fmtp:|^a=ice-ufrag:|^a=ice-pwd:|^a=fingerprint:|^a=setup:|^a=candidate:/.test(x));
    return media.join('\n');
  },

_go2rtcEndpoint() {
    // Browser-side live WebRTC is always routed through the Frigate Home
    // Assistant integration. Never honor a direct go2rtc/Frigate host URL:
    // doing so breaks remote access, SSL/auth setups, HA Companion networking,
    // and multi-instance routing.
    const discovered=this._cc?.()?.clientId;
    const clientId = this._activeCam?.frigate_client_id || discovered || this._config.frigate_client_id || 'frigate';
    return `${location.origin.replace(/^http/i,'ws')}/api/frigate/${encodeURIComponent(String(clientId))}/go2rtc/ws/api/ws`;
  },

async _mountGo2RTCVideo(microphoneStream=null) {
    // A lifecycle/render-triggered remount must inherit the active Talk
    // microphone. Otherwise it can replace a working sendonly peer with a
    // receive-only peer, which is exactly what the iOS diagnostic exposed.
    if (!microphoneStream && this._talkSpeaking && this._talkMic) microphoneStream=this._talkMic;
    if (this._go2rtcMountPromise) {
      try { await this._go2rtcMountPromise; } catch (_) {}
      if (this._go2rtcLive?.pc && (!microphoneStream || this._microphoneTransceiver)) return this._go2rtcLive.video;
    }
    const runMount = async () => {
    const slot=this.shadowRoot.querySelector('#engine');
    if(!slot) throw new Error('Live engine not available');

    // Preserve the existing live <video> element when Talk starts.  Replacing
    // it after getUserMedia() resolves loses the original user-activation
    // context on Safari/iOS (and can also interrupt desktop autoplay).  The
    // same media element can safely receive the new WebRTC MediaStream after
    // the microphone-enabled peer is negotiated.
    const existingVideo = slot.querySelector('video');
    this._destroyGo2RTCLive(!!existingVideo);
    const video=existingVideo || document.createElement('video');
    video.autoplay=true; video.playsInline=true; video.controls=true; video.preload='auto';
    if (!existingVideo) video.muted=!this._liveAudioEnabled;
    video.volume=1;
    video.style.cssText='width:100%;height:100%;display:block';

    if (!existingVideo) { slot.innerHTML=''; slot.appendChild(video); }
    this._watchAutoAspectMedia(video);

    // Port the proven Advanced Camera Card/go2rtc Safari flow: ordinary live
    // playback has only recvonly video/audio. The microphone is added only
    // when Talk is actually active, matching ACC's documented call lifecycle.
    const pc=new RTCPeerConnection({bundlePolicy:'max-bundle',iceServers:[{urls:['stun:stun.cloudflare.com:3478','stun:stun.l.google.com:19302']}],sdpSemantics:'unified-plan'});
    pc.addEventListener('connectionstatechange',()=>this._rtcDbg('connectionstatechange',{state:pc.connectionState,ice:pc.iceConnectionState}));
    let micTx=null;
    if(microphoneStream?.getAudioTracks()?.length) micTx=pc.addTransceiver(microphoneStream.getAudioTracks()[0],{direction:'sendonly'});
    pc.addTransceiver('video',{direction:'recvonly'});
    pc.addTransceiver('audio',{direction:'recvonly'});
    this._liveAudioAvailable=false; this._microphoneTransceiver=micTx;

    const endpoint=this._go2rtcEndpoint(); const src=this._talkStreamName();
    if(!endpoint || !src) throw new Error('Missing go2rtc endpoint or stream');
    let signedWs;
    try {
      signedWs=await this._signFrigateWsUrl(endpoint,src);
    } catch (e) {
      throw e;
    }
    const wsUrl=signedWs.url;
    this._rtcDbg('WS CONSTRUCTOR INPUT', {
      url:this._rtcRedactUrl(wsUrl),
      endpoint:this._rtcRedactUrl(endpoint),
      stream:src,
      authMode:signedWs.authMode,
      signedPath: signedWs.authMode==='ha_signed_path' ? '[present]' : null,
      pageOrigin:location.origin,
      pageProtocol:location.protocol,
      pageHref:location.href.split('#')[0],
      sameOrigin:(()=>{try{return new URL(endpoint).origin===location.origin.replace(/^http/i,'ws')}catch(_){return null}})(),
      cookiesPresent:!!document.cookie,
      cookieNames:document.cookie ? document.cookie.split(';').map(x=>x.split('=')[0].trim()).filter(Boolean) : []
    });
    let ws;
    try {
      ws=new WebSocket(wsUrl);
    } catch (e) {
      throw e;
    }
    ws.binaryType='arraybuffer';
    this._go2rtcLive={video,pc,ws,stream:null,microphoneStream}; this._engine=video; this._talkPC=pc; this._talkWS=ws; this._talkUsingLivePC=true;
    video.setAttribute('playsinline','');
    video.setAttribute('webkit-playsinline','');
    // Native AVPlayer fullscreen is unreliable for a video.srcObject WebRTC
    // feed on iOS. Keep this exact element/peer alive and convert native
    // fullscreen attempts into our visual fullscreen shell instead.
    this._wireLiveFsNudge(video);

    pc.addEventListener('icecandidate',ev=>{
      if(ev.candidate && ws.readyState===WebSocket.OPEN) { const c=ev.candidate.toJSON(); this._rtcDebug.candidates.push({direction:'out',candidate:c}); this._rtcDbg('send ICE candidate',c); ws.send(JSON.stringify({type:'webrtc/candidate',value:c.candidate})); }
      if(!ev.candidate && ws.readyState===WebSocket.OPEN) ws.send(JSON.stringify({type:'webrtc/candidate',value:''}));
    });

    pc.addEventListener('connectionstatechange',()=>{
      if(!this._go2rtcLive || this._go2rtcLive.pc!==pc) return;
      if(pc.connectionState==='connected') {
        const tx=pc.getTransceivers();
        const tracks=tx.filter(tr=>tr.currentDirection==='recvonly').map(tr=>tr.receiver.track).filter(Boolean);
        this._rtcDebug.tracks=tracks.map(t=>({kind:t.kind,id:t.id,readyState:t.readyState,muted:t.muted,enabled:t.enabled}));
        const video2=document.createElement('video');
        video2.autoplay=true; video2.playsInline=true; video2.muted=true; video2.preload='auto';
        video2.addEventListener('loadeddata',()=>{
          if(!this._go2rtcLive || this._go2rtcLive.pc!==pc) return;
          const stream=video2.srcObject; if(!(stream instanceof MediaStream)) { this._rtcDbg('TEMP VIDEO has no MediaStream'); return; }
          this._go2rtcLive.stream=stream; this._liveAudioAvailable=stream.getAudioTracks().length>0;
          video.srcObject=stream;
          video.muted=!this._liveAudioEnabled;
          video.volume=1;
          video.setAttribute('playsinline','');
          video.play().catch(()=>{});
          if (this._liveAudioEnabled) {
            // If iOS replaced the media element during Talk startup, retry
            // playback on the next media-ready tick without introducing a
            // second audio control.
            const resumeAudio = () => {
              if (!this._go2rtcLive || this._go2rtcLive.pc!==pc) return;
              try { video.muted=false; video.volume=1; const p=video.play(); if(p?.catch)p.catch(()=>{}); } catch (_) {}
            };
            video.addEventListener('canplay', resumeAudio, {once:true});
            video.addEventListener('loadedmetadata', resumeAudio, {once:true});
            setTimeout(resumeAudio, 250);
          }
          video2.srcObject=null; this._renderStreamCtrl();
        },{once:true});
        video2.srcObject=new MediaStream(tracks);
        video2.play().catch(()=>{});
      } else if(pc.connectionState==='failed' || pc.connectionState==='disconnected') {
        pc.close();
        this._setStatusOverlay('error','Live stream disconnected','Unable to maintain the go2rtc WebRTC connection.',{retry:true,retryHandler:()=>this._mountGo2RTCVideo(this._talkMic)});
      }
    });

    let remoteDescriptionSet=false; const pendingCandidates=[];
    let answerResolve,answerReject; const answerPromise=new Promise((resolve,reject)=>{answerResolve=resolve;answerReject=reject;});
    ws.addEventListener('message',async ev=>{
      if(typeof ev.data!=='string') return;
      try { const msg=JSON.parse(ev.data);
        if(msg.type==='webrtc/candidate') { if(!msg.value) {this._rtcDbg('remote ICE end'); return;} const candidate={candidate:msg.value,sdpMid:'0'}; this._rtcDebug.candidates.push({direction:'in',candidate}); if(remoteDescriptionSet){try{await pc.addIceCandidate(candidate);this._rtcDbg('remote ICE added');}catch(e){this._rtcDbg('remote ICE add FAILED',e);}} else pendingCandidates.push(candidate); }
        else if(msg.type==='webrtc/answer') { this._rtcDebug.answer=this._rtcSdpSummary(msg.value); try{await pc.setRemoteDescription({type:'answer',sdp:msg.value}); this._rtcDbg('remote description set',{type:pc.remoteDescription?.type,transceivers:pc.getTransceivers().map((t,i)=>({i,mid:t.mid,direction:t.direction,currentDirection:t.currentDirection,kind:t.receiver.track?.kind,track:t.receiver.track?.id,senderKind:t.sender.track?.kind})),audio:this._rtcAudioDiagnostics(pc,microphoneStream)}); remoteDescriptionSet=true; while(pendingCandidates.length){const c=pendingCandidates.shift(); try{await pc.addIceCandidate(c);this._rtcDbg('queued ICE added');}catch(e){this._rtcDbg('queued ICE FAILED',e);}} answerResolve();}catch(e){this._rtcDebug.errors.push(this._rtcSafe(e));this._rtcDbg('setRemoteDescription FAILED',e);answerReject(e);} }
        else if(msg.type==='error') {this._rtcDebug.errors.push({go2rtc:msg.value}); this._rtcDbg('GO2RTC ERROR',msg.value); answerReject(new Error(msg.value||'go2rtc signaling error'));}
      } catch(e){ console.warn('[Frigate] go2rtc signaling message',e); }
    });
    ws.addEventListener('open',async()=>{try{this._rtcDbg('WS OPEN',{url:this._rtcRedactUrl(ws.url),authMode:signedWs.authMode,readyState:ws.readyState,readyStateName:'OPEN',elapsedMs:Math.round(performance.now()-((this._rtcDebug?.started||Date.now())))}); const offer=await pc.createOffer(); this._rtcDebug.offer=this._rtcSdpSummary(offer.sdp); this._rtcDbg('OFFER CREATED',{sdpSummary:this._rtcDebug.offer,transceivers:pc.getTransceivers().map((t,i)=>({i,mid:t.mid,direction:t.direction,currentDirection:t.currentDirection,senderKind:t.sender.track?.kind,receiverKind:t.receiver.track?.kind})),audio:this._rtcAudioDiagnostics(pc,microphoneStream)}); await pc.setLocalDescription(offer); this._rtcDbg('LOCAL DESCRIPTION SET',{signalingState:pc.signalingState,iceGatheringState:pc.iceGatheringState}); if(ws.readyState!==WebSocket.OPEN) throw new Error('go2rtc WebSocket closed before offer'); ws.send(JSON.stringify({type:'webrtc/offer',value:offer.sdp})); this._rtcDbg('OFFER SENT');}catch(e){this._rtcDebug.errors.push(this._rtcSafe(e)); this._rtcDbg('OFFER FAILED',e); answerReject(e);}}, {once:true});
    ws.addEventListener('error',(e)=>{this._rtcDebug.errors.push(this._rtcSafe(e));this._rtcDbg('WS ERROR',{eventType:e?.type,readyState:ws.readyState,readyStateName:['CONNECTING','OPEN','CLOSING','CLOSED'][ws.readyState]||'UNKNOWN',url:this._rtcRedactUrl(ws.url),authMode:signedWs.authMode});answerReject(new Error('Unable to connect to go2rtc'));},{once:true});
    ws.addEventListener('close',(e)=>{this._rtcDbg('WS CLOSE',{code:e.code,reason:e.reason,wasClean:e.wasClean,readyState:ws.readyState,readyStateName:['CONNECTING','OPEN','CLOSING','CLOSED'][ws.readyState]||'UNKNOWN',url:this._rtcRedactUrl(ws.url),authMode:signedWs.authMode});if(this._go2rtcLive?.pc===pc && pc.connectionState!=='connected') answerReject(new Error('go2rtc WebSocket closed during negotiation'));},{once:true});
    try { await Promise.race([answerPromise,new Promise((_,reject)=>setTimeout(()=>reject(new Error('Timed out waiting for go2rtc WebRTC answer')),10000))]); this._rtcDbg('NEGOTIATION ANSWER RECEIVED'); } catch(e) { this._rtcDebug.errors.push(this._rtcSafe(e)); this._rtcDbg('NEGOTIATION FAILED/TIMEOUT',e); throw e; }
    this._wireLiveFsNudge(video);
    this._renderStreamCtrl(); return video;
    };
    const mountPromise = runMount();
    this._go2rtcMountPromise = mountPromise;
    try { return await mountPromise; } finally { if (this._go2rtcMountPromise === mountPromise) this._go2rtcMountPromise = null; }
  },

_destroyGo2RTCLive(preserveVideo=false) {
    const live=this._go2rtcLive;
    this._go2rtcLive=null;
    this._liveAudioAvailable=false;
    if(live?.ws){try{live.ws.close();}catch(_){}}
    if(live?.pc){try{live.pc.close();}catch(_){}}
    // When replacing a receive-only peer with the microphone-enabled Talk
    // peer, keep the same DOM media element.  Reusing it preserves the user's
    // prior audio-unlock gesture instead of creating a fresh audible media
    // element after getUserMedia() has yielded.
    if(live?.video && !preserveVideo){try{live.video.pause();live.video.srcObject=null;}catch(_){}}
    if(this._talkUsingLivePC){ this._talkPC=null; this._talkWS=null; this._talkUsingLivePC=false; }
  },

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
    // v2.0.26 no longer renders a dedicated iOS fullscreen button; this is a
    // defensive guard for native player chrome / WebKit presentation changes.
    try { vid.setAttribute('controlslist','nofullscreen'); } catch(_) {}

    // iOS can pause a MediaStream-backed <video> as it is transferred to/from
    // native AVPlayer fullscreen. Keep the exact same MediaStream/peer attached,
    // but let AVPlayer own fullscreen while it is active. Critically, once native
    // fullscreen ends we restore the ordinary card geometry immediately. The old
    // v2.0.26-v2.0.34 behavior intentionally left a fixed pseudo-fullscreen shell
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
  },

async _mountGrid() {
    const grid = this.shadowRoot.querySelector('#cam-grid'); if (!grid) return;
    const n = this._config.cameras.length;
    const slots = n === 3 ? 4 : n;   // 3 cams → 4 slots, last is placeholder
    grid.className = `cam-grid cams-${n}`;
    grid.innerHTML = '';
    for (let i = 0; i < slots; i++) {
      const slot = document.createElement('div');
      const isPlaceholder = i >= n;
      slot.className = `grid-slot${isPlaceholder ? ' placeholder' : ''}`;
      if (!isPlaceholder) {
        const c = this._config.cameras[i];
        const name = cap(camDisplayName(c));
        // stream
        const stateObj = this._streamStateObj(c.entity);
        if (stateObj) {
          const s = document.createElement('ha-camera-stream');
          s.hass = this._hass; s.stateObj = stateObj; s.controls = false; s.muted = true;
          s.style.cssText = 'width:100%;height:100%;display:block;pointer-events:none';
          slot.appendChild(s);
        }
        // label
        const lbl = document.createElement('div');
        lbl.className = 'grid-label'; lbl.textContent = name;
        slot.appendChild(lbl);
        // click → set as active cam for the events list; stay in grid
        // guard: buttons inside the slot handle their own action; don't also switch camera
        slot.addEventListener('click', ev => {
          if (ev.target.closest('.grid-fs-btn,.grid-close-btn,[data-restore-slot]')) return;
          this._switchCamera(i); this._renderCamSwitcher();
        });
        // Per-slot fullscreen is desktop-only. On iOS keep custom fullscreen
        // affordances out of view to avoid handing live MediaStreams to AVPlayer.
        if(!this._isIOSRecordingPlatform()) {
          const fsBtn = document.createElement('button');
          fsBtn.className = 'grid-fs-btn'; fsBtn.title = 'Fullscreen';
          fsBtn.innerHTML = ICONS.expand;
          fsBtn.addEventListener('click', ev => { ev.stopPropagation(); this._fullscreen(slot); });
          slot.appendChild(fsBtn);
        }
      }
      grid.appendChild(slot);
    }
  },

_canPlayRecordedMedia(event) {
    // Frigate events are stored independently of the camera's current live
    // availability. A camera/doorbell being offline must never prevent an
    // already-recorded event from opening.
    if (!event) return false;
    return !!(
      event.id ||
      event.event_id ||
      event.start_time != null ||
      event.timestamp != null ||
      event.thumbnail ||
      event.thumb
    );
  },

_ensureStatusOverlay() {
    const viewer=this.shadowRoot?.querySelector?.('#viewer');
    if(!viewer) return null;
    let overlay=viewer.querySelector('.status-overlay');
    if(!overlay) {
      overlay=document.createElement('div');
      overlay.className='status-overlay hidden';
      overlay.innerHTML=`
        <div class="status-card">
          <div class="status-spinner" hidden></div>
          <div class="status-icon" hidden></div>
          <div class="status-title"></div>
          <div class="status-detail"></div>
          <button class="status-retry" hidden type="button">Try again</button>
        </div>`;
      viewer.appendChild(overlay);
      overlay.querySelector('.status-retry').addEventListener('click',e=>{
        e.preventDefault(); e.stopPropagation();
        this._retryStatusOverlay?.();
      });
    }
    return overlay;
  },

_setStatusOverlay(kind, title, detail='', opts={}) {
    const overlay=this._ensureStatusOverlay();
    if(!overlay) return;
    const spinner=overlay.querySelector('.status-spinner');
    const icon=overlay.querySelector('.status-icon');
    const titleEl=overlay.querySelector('.status-title');
    const detailEl=overlay.querySelector('.status-detail');
    const retry=overlay.querySelector('.status-retry');
    const loading=kind==='loading' || kind==='connecting';
    const icons={offline:'⌁',error:'!',recording:'▶',info:'i',live:'•'};
    spinner.hidden=!loading;
    icon.hidden=loading;
    icon.textContent=icons[kind] || 'i';
    titleEl.textContent=title || '';
    detailEl.textContent=detail || '';
    retry.hidden=!opts.retry;
    overlay.classList.toggle('hidden',!title);
    this._statusOverlayKind=kind;
    this._statusOverlayRetry=opts.retry ? (opts.retryHandler || null) : null;
    this._retryStatusOverlay=()=>{
      if(typeof this._statusOverlayRetry==='function') this._statusOverlayRetry();
      else if(typeof this._startLive==='function') this._startLive();
    };
  },

_clearStatusOverlay() {
    const overlay=this.shadowRoot?.querySelector?.('.status-overlay');
    if(overlay) overlay.classList.add('hidden');
    this._statusOverlayKind=null;
    this._statusOverlayRetry=null;
  },

_cameraIsOffline() {
    const s=this._cameraState || this._activeCam?.state || this._hass?.states?.[this._cameraEntity]?.state;
    return s === 'unavailable' || s === 'unknown' || s === 'offline';
  },

_renderStreamCtrl() {
    if (this._cameraIsOffline() && !this._playing) {
      this._setStatusOverlay('offline','Camera is offline','Live video is unavailable right now. Your recorded events can still be viewed.',{retry:true});
    }

    const bar = this.shadowRoot.querySelector('#stream-ctrl-bar'); if (!bar) return;
    const inGrid = this._viewMode === 'grid';
    const speaking = !!this._talkSpeaking;
    const connected = !!this._talkConnected;
    const talkLbl = (speaking || connected) ? 'End two-way audio' : 'Start two-way audio';
    const isLive = !this._playing && this.shadowRoot.querySelector('#viewer')?.style.display !== 'flex';
    const talkAvailable = !!(
      this._config.two_way_audio &&
      this._microphonePresent === true &&
      !this._micForbidden &&
      (this._talkStreamName() || this._config.frigate_client_id || this._activeCam?.entity)
    );
    const talkBtn = (isLive && !inGrid && talkAvailable)
      ? `<button class="scb-btn talk-btn${speaking ? ' talking' : ''}${connected ? ' connected' : ''}" id="sc-talk" title="${talkLbl}" aria-label="${talkLbl}" aria-pressed="${speaking}" aria-busy="${connected && !speaking}">
           <canvas class="talk-wave" id="talk-wave" width="72" height="72" aria-hidden="true"></canvas>
           <span class="talk-mic-glyph" aria-hidden="true">${ICONS.mic}</span>
         </button>`
      : '';
    // Do not render any dedicated fullscreen control on iOS. Native WebKit
    // fullscreen can destabilize MediaStream-backed live video, and the custom
    // pseudo-fullscreen button was redundant with the platform's own viewing
    // affordances. Desktop keeps the whole-grid control where it is useful.
    const fsBtn = (inGrid && !this._isIOSRecordingPlatform())
      ? `<button class="scb-btn" id="sc-fs" title="Fullscreen" aria-label="Fullscreen">${ICONS.expand}</button>`
      : '';
    // Live is represented internally by an empty gallery mode because the
    // timeline is the live view. Explicitly derive the active state from _tab
    // so Live is highlighted on first render and after every return to Live.
    const activeMediaTab = this._galleryMode || (this._tab === 'live' ? 'live' : '');
    const hiddenTabs=new Set(this._config.hidden_tabs||[]);
    const mediaBtn = (id, label, icon) => (id!=='live' && hiddenTabs.has(id)) ? '' : `<button class="media-nav-btn${activeMediaTab===id?' active':''}" data-gallery-tab="${id}" title="${label}" aria-label="${label}">${icon}<span>${label}</span></button>`;
    const liveBtn = mediaBtn('live','Live',ICONS.live);
    const clipsBtn = mediaBtn('clips','Clips',ICONS.clips);
    const recordingsBtn = mediaBtn('recordings','Recordings',ICONS.recordings);
    const reviewsBtn = mediaBtn('reviews','Reviews',ICONS.reviews);
    const recDl = (this._playing && this._playing.rec)
      ? `<button class="scb-btn rec-download-icon${this._downloadRange?' range-active':''}" data-rec-download title="${this._downloadRange?'Adjust download range':'Choose download range'}" aria-label="${this._downloadRange?'Adjust download range':'Choose download range'}" aria-pressed="${this._downloadRange?'true':'false'}">${ICONS.download}</button>`
      : '';
    const mediaGroup = `<div class="media-nav-group" role="group" aria-label="Media navigation">${liveBtn}${clipsBtn}${recordingsBtn}${reviewsBtn}</div>`;
    bar.innerHTML = `${talkBtn}${fsBtn}${mediaGroup}${recDl}`;
    this._wireTalkButton();
    if (this._talkSpeaking && this._talkMic) this._startTalkWaveform();
  },

_setViewMode(mode) {
    if (mode === 'grid') this._stopTalk(); // no talk button/target in grid view
    this._viewMode = mode;
    const card = this.shadowRoot.querySelector('.card');
    if (card) card.classList.toggle('grid-mode', mode === 'grid');
    const engWrap = this.shadowRoot.querySelector('#eng-wrap');
    const gridEl = this.shadowRoot.querySelector('#cam-grid');

    if (mode === 'grid') {
      if (engWrap) engWrap.style.display = 'none';
      if (gridEl) { gridEl.style.display = ''; this._mountGrid(); }
      this._eventsMode = 'all';
      const lbl = this.shadowRoot.querySelector('#list-label');
      if (lbl) lbl.textContent = 'All cameras';
      this._loadAllCamsBackground().then(() => this._renderAll());
      this._renderStreamCtrl(); // hide mute button in grid mode
    } else {
      if (engWrap) engWrap.style.display = '';
      if (gridEl) gridEl.style.display = 'none';
      this._eventsMode = 'camera';
      // A camera selector is meaningless in single-camera browsing. Clear any
      // selection carried over from Multiview before rendering the gallery.
      if(this._mediaFilter) this._mediaFilter.camera='all';
      this._mountEngine();
      this._renderAll();
    }
    this._renderCamSwitcher();
    this._applyBrowse();
    this.shadowRoot.querySelectorAll('[data-viewmode]').forEach(p =>
      p.classList.toggle('active', p.dataset.viewmode === mode));
  },

async _switchCamera(idx) {
    if (idx === this._activeCamIdx && this._viewMode === 'single') return;
    this._downloadRange=null;
    this._stopTalk(); // talk session is bound to the previous camera's go2rtc stream
    // Clicking a cam tab while in grid mode switches to single view of that camera
    if (this._viewMode === 'grid') this._setViewMode('single');
    const prevEnt = this._activeCam?.entity;
    if (prevEnt && this._camCache[prevEnt]) {
      this._camCache[prevEnt].events = this._events;
      this._camCache[prevEnt].recordings = this._recordings;
      this._camCache[prevEnt].recordingsLoaded = this._recordingsLoaded;
      this._camCache[prevEnt].recordingsRangeStart = this._recordingsRangeStart;
      this._camCache[prevEnt].recordingsRangeEnd = this._recordingsRangeEnd;
      this._camCache[prevEnt].recordingsLoadedAt = this._recordingsLoadedAt;
    }
    this._activeCamIdx = idx;
    const newEnt = this._activeCam?.entity;
    if (!this._camCache[newEnt]) this._camCache[newEnt] = mkCamState();
    if (!this._camCache[newEnt].discovered) await this._discoverOne(newEnt);
    this._applyCardStyle();
    this._loadFrigateFilterMetadata();
    const cached = this._camCache[newEnt];
    this._events = cached.events||[]; this._recordings = cached.recordings||[]; this._recordingsLoaded = cached.recordingsLoaded===true; this._recordingsRangeStart = Number.isFinite(Number(cached.recordingsRangeStart)) ? Number(cached.recordingsRangeStart) : null; this._recordingsRangeEnd = Number.isFinite(Number(cached.recordingsRangeEnd)) ? Number(cached.recordingsRangeEnd) : null; this._recordingsLoadedAt = Number(cached.recordingsLoadedAt)||0;
    this._reviews = cached.reviews||[]; this._kept = cached.kept||[];
    this._renderCamSwitcher(); this._syncStatus();
    await this._mountEngine();
    this._renderAll();
    await this._loadWindow(true);
  },

_startRotate() {
    this._stopRotate();
    const secs = this._config.rotate_seconds || DEFAULT_ROTATE_S;
    this._rotateTimer = setInterval(() => {
      const next = (this._activeCamIdx+1) % this._config.cameras.length;
      this._switchCamera(next);
    }, secs*1000);
  },

_stopRotate() { if (this._rotateTimer) { clearInterval(this._rotateTimer); this._rotateTimer=null; } },

_toggleRotate() {
    if (this._rotateTimer) { this._stopRotate(); this._toast('Auto-rotate off',1800); }
    else {
      if (!this._config.rotate_seconds) this._config.rotate_seconds = DEFAULT_ROTATE_S;
      this._startRotate(); this._toast(`Rotating every ${this._config.rotate_seconds}s`,1800);
    }
    this._renderCamSwitcher();
  }
};
