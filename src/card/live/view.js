/**
 * Live-view UI, camera switching, grid mode, status overlays, and rotation.
 *
 * Methods are composed onto SightlineCard.prototype; method names are kept
 * stable so existing card behavior and tests remain unchanged.
 */
import { DEFAULT_ROTATE_S, ICONS } from '../../constants.js';
import { cap, mkCamState, camDisplayName } from '../../helpers.js';

/** Return whether Sightline should render its own fullscreen control. */
export function shouldShowFullscreenButton({isLive=false,inGrid=false,isIOS=false}={}) {
  // Recorded single-camera video already exposes native player fullscreen.
  // Sightline's control is needed for the live WebRTC wrapper and Multiview.
  return !isIOS && (isLive || inGrid);
}

export const liveViewMethods = {
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

_toggleLiveAudio() {
    const video = this._go2rtcLive?.video || this._findVideo?.(this._engine);
    if (!video) return;

    this._liveAudioEnabled = !this._liveAudioEnabled;
    try {
      video.muted = !this._liveAudioEnabled;
      video.volume = 1;
      if (this._liveAudioEnabled) {
        video.setAttribute?.('playsinline', '');
        video.play?.()?.catch?.(() => {});
      }
    } catch (_) {}

    this._renderStreamCtrl();
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
    const liveVideo = this._go2rtcLive?.video || null;
    const liveHasAudio = Boolean(
      this._liveAudioAvailable || this._go2rtcLive?.stream?.getAudioTracks?.().length
    );
    const audioLabel = this._liveAudioEnabled ? 'Mute live audio' : 'Unmute live audio';
    const audioBtn = (isLive && !inGrid && liveVideo && liveHasAudio)
      ? `<button class="scb-btn audio-btn${this._liveAudioEnabled ? ' active' : ''}" id="sc-audio" title="${audioLabel}" aria-label="${audioLabel}" aria-pressed="${Boolean(this._liveAudioEnabled)}">${this._liveAudioEnabled ? ICONS.volOn : ICONS.volOff}</button>`
      : '';
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
    // Keep Sightline's fullscreen affordance on desktop Live as well as
    // Multiview. Single-camera recorded playback already has native video
    // controls, while iOS intentionally keeps custom fullscreen disabled for
    // MediaStream stability.
    const fsBtn = shouldShowFullscreenButton({
      isLive,
      inGrid,
      isIOS:this._isIOSRecordingPlatform(),
    })
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
    bar.innerHTML = `${audioBtn}${talkBtn}${fsBtn}${mediaGroup}${recDl}`;
    bar.querySelector('#sc-audio')?.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      this._toggleLiveAudio();
    });
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
