import { VERSION, CARD_TAG, DAY, DEFAULT_ROTATE_S, ICONS, LABEL_COLORS, PALETTE, TIMELINE_GLYPHS, CAM_COLORS } from '../constants.js';
import { cap, parseWs, labelColor, timelineGlyph, mkCamState, camDisplayName } from '../helpers.js';
import { STYLES } from '../styles.js';

// Prototype methods grouped by responsibility.
export const eventPlaybackMethods = {
_allDisplayEvents() {
    if (this._eventsMode==='all') {
      const seen=new Set(); const all=[];
      for (const c of this._config.cameras) { const cc=this._camCache[c.entity]; if(cc) for(const ev of (cc.events||[])) if(!seen.has(ev.id)){seen.add(ev.id);all.push(ev);} }
      return all.sort((a,b)=>b.start_time-a.start_time);
    }
    return this._events;
  },

async _openInGridSlot(id) {
    const ev = this._allDisplayEvents().find(e => e.id === id);
    if (!ev) return;
    const camIdx = this._config.cameras.findIndex(c => {
      const cc = this._camCache[c.entity]; return cc && cc.cam === ev.camera;
    });
    const grid = this.shadowRoot.querySelector('#cam-grid');
    const slots = grid?.querySelectorAll('.grid-slot:not(.placeholder)');
    const slot = slots?.[camIdx < 0 ? 0 : camIdx];
    if (!slot) { this._open(id); return; } // fallback to single view

    const isSnap = this._tab === 'snapshot' || (!ev.has_clip && ev.has_snapshot);
    const camName = cap((ev.camera||'').replace(/_/g,' '));
    const token = ++this._playSeq;
    slot.innerHTML = `<div class="ph skel-stream"></div><div class="grid-label">${camName}</div>`;
    if (isSnap) {
      const url = await this._resolveFrigateMedia(ev, 'snapshot');
      if (this._playSeq !== token) return;
      slot.innerHTML = `
        <img src="${url}" style="width:100%;height:100%;object-fit:contain;background:#000;display:block">
        <div class="grid-label">${camName}</div>
        <button class="grid-close-btn" data-restore-slot="${camIdx}" title="Back to live">✕</button>
        ${this._isIOSRecordingPlatform()?'':`<button class="grid-fs-btn" data-slot-fs title="Fullscreen">${ICONS.expand}</button>`}`;
    } else {
      const url = await this._resolveFrigateMedia(ev, 'clip');
      if (this._playSeq !== token) return;
      slot.innerHTML = '';
      const player = this._createHlsPlayer(url);
      player.style.cssText = 'width:100%;height:100%;display:block;background:#000';
      slot.appendChild(player);
      const label = document.createElement('div');
      label.className = 'grid-label'; label.textContent = camName;
      slot.appendChild(label);
      const close = document.createElement('button');
      close.className = 'grid-close-btn'; close.dataset.restoreSlot = String(camIdx);
      close.title = 'Back to live'; close.textContent = '✕';
      slot.appendChild(close);
      if(!this._isIOSRecordingPlatform()) {
        const fs = document.createElement('button');
        fs.className = 'grid-fs-btn'; fs.dataset.slotFs = '';
        fs.title = 'Fullscreen'; fs.innerHTML = ICONS.expand;
        slot.appendChild(fs);
      }
    }
  },

_activateTimelineEvent(id) {
    if(!id) return;
    const ev=this._timelineEvents().find(e=>String(e.id)===String(id))
      || this._allDisplayEvents().find(e=>String(e.id)===String(id));
    if(!ev) return;

    // An event click is an explicit playback command and must supersede any
    // delayed timeline-settle seek. Desktop wheel panning schedules a seek
    // after the wheel stops; if that callback survives this click it can replace
    // the event clip with the recording from the same hour a fraction of a
    // second later. Invalidate it before changing focus or starting media.
    clearTimeout(this._wt);
    this._wt=null;
    this._timelineInteracting=false;
    this._timelineWasLiveBeforeGesture=false;
    this._timelineLiveCrossed=false;
    this._scrubGestureInvalidated=false;
    ++this._timelineSeekSeq;

    const ts=Number(ev.start_time);
    if(Number.isFinite(ts)) {
      // Clicking a timeline marker/thumbnail is an explicit playback seek. Keep
      // the current zoom level, but center the selected event under the fixed
      // playhead so the timeline and video begin at the same wall-clock moment.
      const span=Math.max(300,Math.min(86400,Number(this._winEnd-this._winStart)||600));
      let ns=Math.floor(ts-span/2);
      let ne=Math.floor(ts+span/2);
      if(ns<0){ne-=ns;ns=0;}
      this._timelineFollowingLive=false;
      this._timelineInteracting=false;
      this._timelineSelected=String(ev.id);
      this._timelineFocusTs=ts;
      this._scrubTarget=ts;
      this._winStart=ns;
      this._winEnd=ne;
      this._exhausted=false;
      this._renderTimeline(true);
      this._renderRange();
      this._renderTimelineZoomLabel();
      this._scheduleTimelineDataLoad();
    }

    // Prefer the actual Frigate event clip. If this event has no retained clip,
    // fall back to continuous recording at the event's exact timestamp.
    if(ev.has_clip) return this._showClip(ev);
    if(Number.isFinite(ts)) return this._seekTimelineTarget(ts);
    return this._open(String(ev.id));
  },

_open(id) {
    const ev=this._allDisplayEvents().find(e=>e.id===id); if(!ev) return;
    if (this._tab==='snapshot'||(!ev.has_clip&&ev.has_snapshot)) this._showSnapshot(ev);
    else if (ev.has_clip) this._showClip(ev); else this._showSnapshot(ev);
  },

_enter() {
    // Do not keep decoding the live WebRTC stream underneath recording/event
    // playback. On iOS this is especially expensive: the hidden live decoder
    // can continue consuming CPU/GPU even though it is not visible.
    this._unmountEngine();
    this.shadowRoot.querySelector('#engine').style.display='none';
    const v=this.shadowRoot.querySelector('#viewer'); v.style.display='flex';
    // Keep the media navigation visible during playback. _renderStreamCtrl()
    // automatically hides the microphone while a recording/clip is playing,
    // but preserves the Live/Clips/Recordings/Reviews navigation.
    this._renderStreamCtrl();
  },

_showLive() {
    const wasPlaying=!!this._playing;
    ++this._playSeq;
    this._cancelActivePlayback();
    this._tab='live';
    this._galleryMode='';
    // Live is the timeline entry point: always restore the standard 10-minute
    // viewport instead of whatever 24-hour gallery/date range was last used.
    this._resetTimelineToNow10m();
    this._playing=null;
    this._playingHour=null;
    this._playingSourceStart=null;
    this._playingSourceEnd=null;
    this._scrubTarget=null;
    const v=this.shadowRoot.querySelector('#viewer');
    if(v){ v.innerHTML=''; v.style.display='none'; }
    const engine=this.shadowRoot.querySelector('#engine');
    if(engine) engine.style.display='block';
    const gallery=this.shadowRoot.querySelector('#media-gallery');
    if(gallery){ gallery.classList.remove('open'); gallery.innerHTML=''; }
    const timeline=this.shadowRoot.querySelector('#timeline-view');
    if(timeline) timeline.style.display='';
    this._syncResponsiveWorkspace();
    this._renderStreamCtrl();
    // If the live engine is already mounted (normal gallery -> Live or tapping
    // Live twice), keep that exact WebRTC session. Recreating it on every tap
    // causes visible reconnects and is especially fragile on iOS.
    if(!this._engine){ this._mountEngine(); }
    else if(wasPlaying){ this._engine.style.display='block'; }
  },

_handleMediaImageLoad(e) {
    const img=e?.target;
    if(!(img instanceof HTMLImageElement)||img.dataset.frigateThumb!=='1') return;
    img.style.display='block';
    img.style.visibility='visible';
    img.style.opacity='1';
    img.dataset.thumbTry='0';
    const fallback=img.parentElement?.querySelector('.thumb-fallback');
    if(fallback) fallback.style.display='none';
    img.parentElement?.classList.remove('thumb-failed');
  },

_handleMediaImageError(e) {
    const img=e?.target;
    if(!(img instanceof HTMLImageElement)||img.dataset.frigateThumb!=='1') return;
    const base=String(img.dataset.thumbSrc||'');
    const attempt=Number(img.dataset.thumbTry||0);
    if(base && attempt<2) {
      img.dataset.thumbTry=String(attempt+1);
      img.style.visibility='hidden';
      const delay=attempt===0?300:1100;
      setTimeout(()=>{
        if(!img.isConnected) return;
        const sep=base.includes('?')?'&':'?';
        img.src=`${base}${sep}_fmhc_thumb_retry=${Date.now()}`;
      },delay);
      return;
    }
    img.style.display='none';
    img.style.visibility='visible';
    const parent=img.parentElement;
    const fallback=parent?.querySelector('.thumb-fallback');
    if(fallback) fallback.style.display='flex';
    parent?.classList.add('thumb-failed');
  },

_mediaForEvent(ev,file,dl=false) {
    const id=String(ev?.id??ev?.event_id??'');
    const camera=String(ev?.camera||'');
    let clientId=this._cc().clientId;
    if(camera) {
      const owner=this._config?.cameras?.map(c=>this._camCache[c.entity]).find(cc=>cc&&String(cc.cam)===camera);
      if(owner?.clientId) clientId=owner.clientId;
    }
    return `/api/frigate/${encodeURIComponent(String(clientId))}/notifications/${encodeURIComponent(id)}/${file}${dl?'?download=true':''}`;
  },

_media(id,file,dl) { return `/api/frigate/${encodeURIComponent(String(this._cc().clientId))}/notifications/${encodeURIComponent(String(id))}/${file}${dl?'?download=true':''}`; },

async _mediaSigned(id,file,dl) { return this._signed(this._media(id,file,dl)); },

async _showClip(ev) {
    if (!ev) return;
    // Event playback owns the media pipeline. Clear any hourly-recording state
    // before mounting the clip so stale recording callbacks/segment maps cannot
    // reinterpret clip currentTime=0 as the first second of the previous hour.
    clearTimeout(this._wt);
    this._wt=null;
    this._timelineInteracting=false;
    ++this._timelineSeekSeq;
    this._cancelActivePlayback();
    this._playingHour=null;
    this._playingSourceStart=null;
    this._playingSourceEnd=null;
    this._playingRecordings=[];
    this._playingInpointOffset=0;
    // Advanced Camera Card represents Frigate event video as HLS and resolves
    // the media-source content ID through Home Assistant. Use the same route
    // here so iOS does not depend on the progressive /clip.mp4 proxy.
    this._enter();
    this._playing={id:ev.id};
    this._renderStreamCtrl();
    const viewer=this.shadowRoot.querySelector('#viewer');
    viewer.innerHTML='<div class="ld">Loading…</div>';
    const token=++this._playSeq;
    try {
      const url=await this._resolveFrigateMedia(ev,'clip');
      if(this._playSeq!==token) return;
      viewer.innerHTML='';
      const player=this._createHlsPlayer(url,{autoplay:true});
      player.style.cssText='width:100%;height:100%;display:block;background:#000';
      viewer.appendChild(player);
      this._attachTimelineMediaClock(player, Number(ev.start_time)||this._timelineFocusTs||Math.floor(Date.now()/1000), token);
    } catch(err) {
      console.warn('[Frigate] event playback failed',err);
      if(this._playSeq===token) viewer.innerHTML='<div class="ld">Unable to play recording</div>';
    }
  },

async _showClipById(id) {
    if(!id) return;
    const ev=this._allDisplayEvents().find(e=>e.id===id);
    if(ev) return this._showClip(ev);
    // Same isolation as _showClip(), including the review-browser path where
    // only an event id is available.
    clearTimeout(this._wt);
    this._wt=null;
    this._timelineInteracting=false;
    ++this._timelineSeekSeq;
    this._cancelActivePlayback();
    this._playingHour=null;
    this._playingSourceStart=null;
    this._playingSourceEnd=null;
    this._playingRecordings=[];
    this._playingInpointOffset=0;
    this._enter();
    this._playing={id};
    this._renderStreamCtrl();
    const viewer=this.shadowRoot.querySelector('#viewer');
    viewer.innerHTML='<div class="ld">Loading…</div>';
    const token=++this._playSeq;
    try {
      const url=await this._resolveFrigateEventMediaId(id,'clips');
      if(this._playSeq!==token) return;
      viewer.innerHTML='';
      const player=this._createHlsPlayer(url,{autoplay:true});
      player.style.cssText='width:100%;height:100%;display:block;background:#000';
      viewer.appendChild(player);
      const eventStart=Number(this._allDisplayEvents().find(e=>e.id===id)?.start_time);
      this._attachTimelineMediaClock(player, Number.isFinite(eventStart)?eventStart:(this._timelineFocusTs||Math.floor(Date.now()/1000)), token);
    } catch(err) {
      console.warn('[Frigate] event-id playback failed',err);
      if(this._playSeq===token) viewer.innerHTML='<div class="ld">Unable to play recording</div>';
    }
  },

async _resolveFrigatePlaybackUrl(ev) {
    const {clientId,cam}=this._cc();
    const camera=encodeURIComponent(ev.camera || cam);
    const start=Number(ev.start_time);
    const end=Math.max(start+1,Number(ev.end_time || (start+Math.max(1,Number(ev.duration||30)))));
    if(!clientId || !camera || !Number.isFinite(start)) {
      return this._resolveFrigateMedia(ev,'clip');
    }

    // Use Frigate's authenticated VOD proxy directly. This path works even
    // when the live camera is offline because it reads retained recordings.
    // Safari is explicitly documented by Frigate to prefer HLS over clip.mp4.
    const vod=`/api/frigate/${encodeURIComponent(String(clientId))}/vod/${camera}/start/${Math.floor(start)}/end/${Math.ceil(end)}/master.m3u8`;
    try {
      const signed=await this._signed(vod);
      return signed || vod;
    } catch (_) {
      return vod;
    }
  },

_createRecordedVideo(url) {
    const v=document.createElement('video');
    v.className='recorded-video';
    v.controls=true;
    v.playsInline=true;
    v.preload='auto';
    v.muted=true;
    v.autoplay=true;
    v.setAttribute('controls','');
    v.setAttribute('playsinline','');
    v.setAttribute('webkit-playsinline','');

    const tryPlay=()=>{
      this._clearStatusOverlay();
      v.play().catch(()=>{ /* muted autoplay may still require a tap in some webviews */ });
    };
    v.addEventListener('loadedmetadata',tryPlay,{once:true});
    v.addEventListener('canplay',tryPlay,{once:true});
    v.addEventListener('playing',()=>this._clearStatusOverlay(),{once:true});
    v.addEventListener('error',()=>{
      console.warn('[Frigate] recorded video error',v.error?.code,v.error?.message||'',url);
      const viewer=this.shadowRoot.querySelector('#viewer');
      if(viewer && !viewer.querySelector('.recorded-video-error')) {
        const msg=document.createElement('div');
        msg.className='ld recorded-video-error';
        msg.textContent='Unable to play recording';
        viewer.appendChild(msg);
      }
    },{once:true});
    v.src=url;
    return v;
  },

async _resolveFrigateEventMediaId(id, type) {
    const {clientId,cam}=this._cc();
    const mediaContentId = `media-source://frigate/${clientId}/event/${type}/${cam}/${id}`;
    const resolved = await this._resolveMediaContentId(mediaContentId);
    if (resolved) return resolved;
    // Compatibility fallback for older HA/Frigate media-source providers.
    return this._mediaSigned(id, type === 'clips' ? 'clip.mp4' : 'snapshot.jpg');
  },

async _resolveFrigateMedia(ev, type) {
    return this._resolveFrigateEventMediaId(ev.id, type === 'clip' ? 'clips' : 'snapshots');
  },

async _resolveMediaContentId(mediaContentId) {
    try {
      const r = await this._hass.callWS({
        type:'media_source/resolve_media',
        media_content_id:mediaContentId
      });
      const url = r?.url;
      if (!url) throw new Error('Home Assistant returned no media URL');
      // Frigate's HA media source currently resolves to the integration's own
      // /api/frigate/<instance>/... proxy. Refuse any future/provider response
      // that points the browser at a Frigate host directly.
      const parsed = new URL(String(url), location.origin);
      if (!parsed.pathname.startsWith('/api/frigate/')) {
        throw new Error(`Refusing non-Home-Assistant Frigate media URL: ${parsed.pathname}`);
      }
      return this._hass?.hassUrl ? this._hass.hassUrl(url) : url;
    } catch (e) {
      console.warn('[Frigate] media-source resolve failed', e);
      // The caller may fall back to another Home Assistant Frigate proxy route.
      return null;
    }
  },

_absoluteHaMediaUrl(url) {
    if (!url) return url;
    const raw=String(url);
    // HA's <ha-hls-player> resolves child playlists with
    // `new URL(child, this._url)`, so its base URL MUST be absolute. auth/sign_path
    // intentionally returns a relative HA path; turn that path into a fully
    // qualified HA URL without losing its authSig query parameter.
    try {
      const parsed=new URL(raw);
      if (parsed.protocol==='http:' || parsed.protocol==='https:') return parsed.href;
    } catch(_) {}
    try {
      if (this._hass?.hassUrl) return this._hass.hassUrl(raw);
    } catch(_) {}
    try { return new URL(raw, window.location.href).href; } catch(_) { return raw; }
  },

_createHlsPlayer(url, options={}) {
    if (!url && options.requireUrl !== false) {
      const el = document.createElement('div');
      el.className = 'ld'; el.textContent = 'Unable to resolve recording';
      return el;
    }
    const player = document.createElement('ha-hls-player');
    player.hass = this._hass;
    player.controls = options.controls !== false;
    player.muted = options.muted !== false;
    // Home Assistant's property is `autoPlay` (capital P), not `autoplay`.
    player.autoPlay = options.autoplay !== false;
    player.playsInline = true;
    if (player.controls) player.setAttribute('controls','');
    player.setAttribute('playsinline','');
    player.setAttribute('allow-exoplayer','');
    if (url) player.url = this._absoluteHaMediaUrl(url);
    return player;
  },

async _showSnapshot(ev) {
    this._enter(); this._playing={id:ev.id};
    const v=this.shadowRoot.querySelector('#viewer');
    v.innerHTML='<div class="ld">Loading…</div>';
    const token = ++this._playSeq;
    const url = await this._resolveFrigateMedia(ev, 'snapshot');
    if (this._playSeq !== token) return;
    v.innerHTML=`<img class="snap" src="${url}">`;
  },

_fmtDurS(s) { // format seconds → m:ss or h:mm:ss
    const h=Math.floor(s/3600), m=Math.floor((s%3600)/60), ss=s%60;
    return h>0 ? `${h}:${String(m).padStart(2,'0')}:${String(ss).padStart(2,'0')}` : `${m}:${String(ss).padStart(2,'0')}`;
  },

_hourStart(ts) {
    const d = new Date(ts * 1000);
    d.setMinutes(0, 0, 0);
    return Math.floor(d.getTime() / 1000);
  },

_hourEnd(ts) { return this._hourStart(ts) + 3600; },

_haUseAmPm() {
    // Mirror Home Assistant frontend `useAmPm()`: explicit 12/24 profile
    // settings win; language/system defer to the corresponding Intl locale.
    const locale=this._hass?.locale||{};
    const pref=String(locale.time_format||'language');
    if(pref==='12') return true;
    if(pref==='24') return false;
    const testLanguage=pref==='language' ? (locale.language||undefined) : undefined;
    try {
      return new Date('January 1, 2023 22:00:00').toLocaleString(testLanguage).includes('10');
    } catch(_) {
      try { return new Intl.DateTimeFormat(undefined,{hour:'numeric'}).formatToParts(new Date()).some(p=>p.type==='dayPeriod'); }
      catch(__) { return true; }
    }
  },

_haTimeZone() {
    // Home Assistant profile can follow the browser (`local`) or the HA server.
    const locale=this._hass?.locale||{};
    const server=this._hass?.config?.time_zone;
    if(locale.time_zone==='local') {
      try {
        const z=Intl.DateTimeFormat().resolvedOptions().timeZone;
        if(z && !/^[+-]\d{2}:?\d{2}$/.test(z)) return z;
      } catch(_) {}
    }
    return server || undefined;
  },

_formatHaTime(ts,withSeconds=false) {
    const d=new Date(Number(ts)*1000);
    if(!Number.isFinite(d.getTime())) return '';
    const locale=this._hass?.locale||{};
    const useAmPm=this._haUseAmPm();
    const options={
      hour:'numeric',
      minute:'2-digit',
      hourCycle:useAmPm?'h12':'h23'
    };
    if(withSeconds) options.second='2-digit';
    const timeZone=this._haTimeZone();
    if(timeZone) options.timeZone=timeZone;
    try { return new Intl.DateTimeFormat(locale.language||undefined,options).format(d); }
    catch(_) {
      const fallback={hour:'numeric',minute:'2-digit',hour12:useAmPm};
      if(withSeconds) fallback.second='2-digit';
      return d.toLocaleTimeString([],fallback);
    }
  },

_timeSec(ts) { return this._formatHaTime(ts,true); },

_timeMinute(ts) { return this._formatHaTime(ts,false); },

_recordingCovers(ts) {
    return (Array.isArray(this._recordings) ? this._recordings : []).find(r =>
      Number(r.start_time) <= ts && Number(r.end_time || ts + 1) >= ts
    ) || null;
  }
};
