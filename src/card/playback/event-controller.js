/**
 * Event selection, playback entry/exit, clip/snapshot actions, and image retries.
 *
 * Methods are composed onto SightlineCard.prototype; method names are kept
 * stable so existing card behavior and tests remain unchanged.
 */
import { ICONS } from '../../constants.js';
import { cap } from '../../helpers.js';

export const eventPlaybackControllerMethods = {
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

async _showSnapshot(ev) {
    this._enter(); this._playing={id:ev.id};
    const v=this.shadowRoot.querySelector('#viewer');
    v.innerHTML='<div class="ld">Loading…</div>';
    const token = ++this._playSeq;
    const url = await this._resolveFrigateMedia(ev, 'snapshot');
    if (this._playSeq !== token) return;
    v.innerHTML=`<img class="snap" src="${url}">`;
  }
};
