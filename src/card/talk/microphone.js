/**
 * Browser microphone capability, permission, mute, and disconnect lifecycle.
 *
 * Methods are composed onto SightlineCard.prototype; method names are kept
 * stable so existing card behavior and tests remain unchanged.
 */
export const microphoneMethods = {
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
    const media = navigator.mediaDevices;
    const supported = Boolean(this._config?.two_way_audio && media?.getUserMedia);
    let present = supported;

    // enumerateDevices() can intentionally return an empty list before the
    // user grants microphone permission. Treat getUserMedia() support as
    // "potentially available" and let the permission request be authoritative.
    if (supported && media?.enumerateDevices) {
      try {
        const devices = await media.enumerateDevices();
        if (devices?.some?.((device) => device?.kind === 'audioinput')) present = true;
      } catch (_) {
        // Browser privacy restrictions must not hide the Talk control before
        // the user has a chance to grant access.
        present = true;
      }
    }

    const changed = this._microphonePresent !== present;
    this._microphonePresent = present;

    if (!present && this._talkSpeaking) {
      try { await this._stopTalk(); } catch (_) {}
    }
    if (changed && this.isConnected) this._renderStreamCtrl();
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
  }
};
