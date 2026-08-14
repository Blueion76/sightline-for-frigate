/**
 * Live engine mounting and teardown for HA camera streams and go2rtc.
 *
 * Methods are composed onto SightlineCard.prototype; method names are kept
 * stable so existing card behavior and tests remain unchanged.
 */
export const liveEngineMethods = {
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
  }
};
