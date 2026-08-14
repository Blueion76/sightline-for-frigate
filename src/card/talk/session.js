/**
 * go2rtc/WebRTC talk session connection, readiness, and teardown.
 *
 * Methods are composed onto SightlineCard.prototype; method names are kept
 * stable so existing card behavior and tests remain unchanged.
 */
export const talkSessionMethods = {
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
