/**
 * Frigate-proxied go2rtc WebRTC negotiation, diagnostics, and cleanup.
 *
 * Methods are composed onto SightlineCard.prototype; method names are kept
 * stable so existing card behavior and tests remain unchanged.
 */
export const liveWebRtcMethods = {
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
  }
};
