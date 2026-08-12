import { VERSION, CARD_TAG, DAY, DEFAULT_ROTATE_S, ICONS, LABEL_COLORS, PALETTE, TIMELINE_GLYPHS, CAM_COLORS } from '../constants.js';
import { cap, parseWs, labelColor, timelineGlyph, mkCamState, camDisplayName } from '../helpers.js';
import { STYLES } from '../styles.js';

// Prototype methods grouped by responsibility.
export const recordingPlaybackMethods = {
_frigateSegmentDuration(seg) {
    const d=Number(seg?.duration);
    if (Number.isFinite(d) && d >= 0) return d;
    const a=Number(seg?.start_time), b=Number(seg?.end_time);
    return Number.isFinite(a)&&Number.isFinite(b) ? Math.max(0,b-a) : 0;
  },

_frigateInpointOffset(sourceStart, firstRecording) {
    const start = Number(sourceStart);
    if (!Number.isFinite(start) || !firstRecording) return 0;
    const fs = Number(firstRecording.start_time), fe = Number(firstRecording.end_time);
    if (!Number.isFinite(fs) || !Number.isFinite(fe)) return 0;
    if (fs < start && fe > start) return start - fs;
    return 0;
  },

_frigateSeekPosition(timestamp, recordings, inpointOffset=0) {
    if (!Array.isArray(recordings) || !recordings.length) return undefined;
    const sorted=[...recordings]
      .filter(r=>Number.isFinite(Number(r?.start_time)))
      .sort((a,b)=>Number(a.start_time)-Number(b.start_time));
    if (!sorted.length) return undefined;

    const first=Number(sorted[0].start_time);
    const last=Number(sorted[sorted.length-1].end_time);
    if (!Number.isFinite(first) || !Number.isFinite(last) ||
        timestamp < first || timestamp > last) return undefined;

    // Frigate's calculateSeekPosition() uses wall-clock segment length
    // (end_time - start_time) for seeking. `segment.duration` is used by
    // DynamicVideoController.getProgress(), but not by calculateSeekPosition().
    // Keeping these two calculations distinct is important: substituting
    // `duration` here can shift the seek target toward the start of the hour.
    let seek=0;
    for (const seg of sorted) {
      const a=Number(seg.start_time), b=Number(seg.end_time);
      const wallDuration=(Number.isFinite(a)&&Number.isFinite(b)) ? Math.max(0,b-a) : 0;
      if (!Number.isFinite(a) || !Number.isFinite(b) || wallDuration <= 0) continue;
      if (a > timestamp) break;
      if (b < timestamp) {
        seek += wallDuration;
        continue;
      }
      seek += Math.max(0, timestamp-a);
      // calculateSeekPosition() in Frigate subtracts the HLS inpoint offset
      // as its very last step — do the same here, after the within-segment
      // offset has been added, not before.
      const adjusted = seek - (Number(inpointOffset)||0);
      return adjusted >= 0 ? adjusted : undefined;
    }
    return undefined;
  },

_frigateProgress(playerTime, recordings, inpointOffset=0) {
    if (!Array.isArray(recordings) || !recordings.length || !Number.isFinite(Number(playerTime))) return undefined;
    const sorted=[...recordings]
      .filter(r=>Number.isFinite(Number(r?.start_time)))
      .sort((a,b)=>Number(a.start_time)-Number(b.start_time));
    // The inverse of _frigateSeekPosition's final subtraction: Frigate's own
    // HlsVideoPlayer.getVideoTime() computes `video.currentTime + inpointOffset`
    // before ever handing the number to getProgress()'s raw accumulation. Do
    // the same here so seeking and progress-reporting stay perfectly
    // symmetric — otherwise the playhead reports a timestamp a few seconds
    // earlier than what's actually on screen for the whole first hour.
    const raw = Math.max(0, Number(playerTime)) + (Number(inpointOffset)||0);
    let total=0;
    for (const seg of sorted) {
      const a=Number(seg.start_time);
      const duration=this._frigateSegmentDuration(seg);
      if (!Number.isFinite(a) || duration <= 0) continue;
      if (total + duration > raw) return a + (raw-total);
      total += duration;
    }
    const last=sorted[sorted.length-1];
    return Number(last?.end_time);
  },

_cancelActivePlayback(keepSession=false) {
    if (typeof this._activePlaybackCleanup === 'function') {
      try { this._activePlaybackCleanup(); } catch (_) {}
    }
    this._activePlaybackCleanup = null;
    if (!keepSession) {
      const session=this._playbackSession;
      this._playbackSession=null;
      if (session) {
        try { session.video?.pause(); } catch (_) {}
        try { session.player?.remove(); } catch (_) {}
      }
    }
  },

_ensurePlaybackShell() {
    const viewer=this.shadowRoot.querySelector('#viewer');
    if (!viewer) return null;
    viewer.style.display='flex';
    let holder=viewer.querySelector('.rec-player');
    if (!holder) {
      viewer.innerHTML='';
      holder=document.createElement('div');
      holder.className='rec-player';
      holder.innerHTML='<div class="playback-loading"><span class="spinner"></span><span>Loading recording…</span></div>';
      viewer.appendChild(holder);
    }
    return holder;
  },

_setPlaybackLoading(show, text='Loading recording…') {
    const holder=this.shadowRoot.querySelector('#viewer .rec-player');
    if (!holder) return;
    let el=holder.querySelector('.playback-loading');
    if (show) {
      if (!el) { el=document.createElement('div'); el.className='playback-loading'; holder.appendChild(el); }
      el.innerHTML=`<span class="spinner"></span><span>${text}</span>`;
      el.style.display='flex';
    } else if (el) {
      el.style.display='none';
    }
  },

_bindStableRecordingVideo(video, session) {
    if (!video || session.video===video && session.bound) return;
    session.video=video;
    session.bound=true;
    video.controls=true;
    video.playsInline=true;
    video.preload='auto';
    video.muted=true;
    video.setAttribute('controls','');
    video.setAttribute('playsinline','');
    video.setAttribute('webkit-playsinline','');

    const playAfterSeek=async()=>{
      if (session.token!==this._playSeq || this._playbackSession!==session) return;
      this._setPlaybackLoading(false);
      this._playing={rec:session.targetTs};
      this._scrubTarget=session.targetTs;
      try {
        await video.play();
      } catch(err) {
        // Native controls remain available if iOS consumes the original gesture
        // while the HLS seek is being prepared.
        console.debug('[Frigate] recording play deferred',err?.name||err||'');
      }
    };

    const applyPendingSeek=()=>{
      if (session.token!==this._playSeq || this._playbackSession!==session) return;
      if (session.seekInFlight) return;
      if (!Number.isFinite(video.duration) || video.duration<=0) return;
      // `null` means there is no pending seek. Number(null) is 0 in
      // JavaScript, so converting first caused later canplay/durationchange
      // callbacks to issue an accidental seek back to media time 0 — exactly
      // the first second of each hourly VOD source on desktop.
      if (session.pendingSeek == null) return;
      const target=Number(session.pendingSeek);
      if (!Number.isFinite(target)) return;
      const clamped=Math.max(0,Math.min(target,Math.max(0,video.duration-0.05)));
      const current=Number(video.currentTime);

      // Match Frigate's controller for *every* seek, not just the initial load:
      // assign currentTime, wait for `seeked`, then play. v2.0.5 accidentally
      // bypassed this path for same-hour timeline scrubs and called play()
      // immediately, which can strand Safari/WKWebView in a buffering state.
      if (Number.isFinite(current) && Math.abs(current-clamped)<0.35) {
        session.pendingSeek=null;
        session.lastMediaTime=clamped;
        playAfterSeek();
        return;
      }

      // Pausing native iOS HLS before a discontinuous seek prevents WebKit from
      // trying to continue decoding the old position while the new byte range is
      // being resolved. The video remains mounted, so there is no visual pop.
      if (session.preferNativeIOS) {
        try { video.pause(); } catch(_) {}
      }

      session.seekInFlight=true;
      const requested=clamped;
      const onSeeked=()=>{
        if (session.token!==this._playSeq || this._playbackSession!==session) return;
        clearTimeout(session.seekTimer);
        session.seekTimer=null;
        session.seekInFlight=false;
        session.lastMediaTime=Number(video.currentTime);

        // A newer scrub can arrive while Safari is completing this seek. Never
        // play the stale position: immediately apply the newest pending target.
        const latest=session.pendingSeek == null ? NaN : Number(session.pendingSeek);
        if (Number.isFinite(latest) && Math.abs(latest-requested)>0.35) {
          applyPendingSeek();
          return;
        }
        session.pendingSeek=null;
        playAfterSeek();
      };
      video.addEventListener('seeked',onSeeked,{once:true});
      try {
        video.currentTime=clamped;
      } catch(_) {
        session.seekInFlight=false;
        try { video.removeEventListener('seeked',onSeeked); } catch(_) {}
        return;
      }

      // WebKit occasionally omits `seeked` for native HLS even after currentTime
      // has moved. Recover without reloading the source or jumping to the hour.
      clearTimeout(session.seekTimer);
      session.seekTimer=setTimeout(()=>{
        if (session.token!==this._playSeq || this._playbackSession!==session || !session.seekInFlight) return;
        try { video.removeEventListener('seeked',onSeeked); } catch(_) {}
        session.seekInFlight=false;
        const actual=Number(video.currentTime);
        if (Number.isFinite(actual) && Math.abs(actual-requested)<0.75 && video.readyState>=2) {
          session.pendingSeek=null;
          session.lastMediaTime=actual;
          playAfterSeek();
          return;
        }
        // Keep the requested target and retry when Safari reports more media.
        const retry=()=>{
          video.removeEventListener('canplay',retry);
          video.removeEventListener('progress',retry);
          applyPendingSeek();
        };
        video.addEventListener('canplay',retry,{once:true});
        video.addEventListener('progress',retry,{once:true});
      },1500);
    };

    session.requestSeek=(mediaTime,targetTs)=>{
      if (session.token!==this._playSeq || this._playbackSession!==session) return false;
      if (!Number.isFinite(Number(mediaTime))) return false;
      session.targetTs=Math.floor(Number(targetTs));
      session.pendingSeek=Math.max(0,Number(mediaTime));
      this._playing={rec:session.targetTs};
      this._scrubTarget=session.targetTs;
      applyPendingSeek();
      return true;
    };

    const sync=()=>{
      if (session.token!==this._playSeq || this._playbackSession!==session) return;
      // Desktop hls.js briefly exposes currentTime=0 when a new hour source is
      // attached. Do not let that transient decoder position become the
      // timeline's authoritative timestamp while the requested seek is still
      // pending/in flight; doing so visibly snapped the playhead/window to the
      // first second of every hour. Manual timeline movement also owns the
      // playhead until the gesture settles.
      if (this._timelineInteracting || session.seekInFlight ||
          (session.pendingSeek != null && Number.isFinite(Number(session.pendingSeek)))) return;
      const rel=Number(video.currentTime);
      if (!Number.isFinite(rel) || rel<0) return;
      const abs=this._frigateProgress(rel,session.recordings,session.inpointOffset);
      if (!Number.isFinite(abs)) return;
      session.lastAbsolute=abs;
      this._scrubTarget=abs;
      this._playing={rec:abs};
      this._updateTimelinePlaybackTime(abs);
    };
    const ready=()=>{
      this._clearStatusOverlay();
      applyPendingSeek();
      // Do not hide the loader merely because metadata exists. Keep it visible
      // until the exact seek has settled or playback actually begins.
      if ((session.pendingSeek == null || !Number.isFinite(Number(session.pendingSeek))) && !session.seekInFlight && video.readyState>=2) {
        this._setPlaybackLoading(false);
      }
    };
    const onError=()=>{
      if (session.token!==this._playSeq || this._playbackSession!==session) return;
      console.warn('[Frigate] stable recording player error',video.error?.code,video.error?.message||'');
      this._setPlaybackLoading(true,'Unable to play recording');
    };
    ['loadedmetadata','durationchange','canplay'].forEach(ev=>video.addEventListener(ev,ready));
    ['timeupdate','playing','seeked'].forEach(ev=>video.addEventListener(ev,sync));
    video.addEventListener('waiting',()=>{ if(!video.paused)this._setPlaybackLoading(true,'Buffering…'); });
    video.addEventListener('playing',()=>{
      this._setPlaybackLoading(false);
    });
    video.addEventListener('ended',()=>{
      if(session.token!==this._playSeq || this._playbackSession!==session) return;
      if (session.iosWindowed) {
        const next=Math.floor(Number(session.sourceEnd));
        if (Number.isFinite(next) && next < Math.floor(Date.now()/1000)-1) {
          this._showRecording(next,next+5*60,next);
        }
        return;
      }
      this._continueRecording(session.sourceEnd,session.token);
    });
    video.addEventListener('error',onError);
    session.cleanup=()=>{
      clearTimeout(session.seekTimer);
      session.seekTimer=null;
      try { video.pause(); } catch(_) {}
      try { video.removeAttribute('src'); video.srcObject=null; video.load(); } catch(_) {}
    };
    this._activePlaybackCleanup=session.cleanup;
  },

_isIOSRecordingPlatform() {
    const ua=navigator.userAgent||'';
    return /iPad|iPhone|iPod/.test(ua) || (navigator.platform==='MacIntel' && navigator.maxTouchPoints>1);
  },

_iosRecordingWindow(target) {
    // Native HLS on iOS is reliable once the source is small, but seeking deep
    // into a full one-hour playlist can take several seconds while WebKit walks
    // the playlist/segment index. Keep iOS playback in deterministic 5-minute
    // VOD windows so the maximum seek offset is < 300s. Desktop continues using
    // the full hour with hls.js, which is efficient at long-range seeks.
    const bucket=5*60;
    const t=Math.max(0,Math.floor(Number(target)||0));
    const start=Math.floor(t/bucket)*bucket;
    const now=Math.floor(Date.now()/1000);
    const end=Math.max(start+1,Math.min(start+bucket,now));
    return {start,end};
  },

_frigateRecordingMediaSourceId(clientId, cam, sourceStart) {
    try {
      const tz=this._hass?.config?.time_zone || Intl.DateTimeFormat().resolvedOptions().timeZone;
      const parts=new Intl.DateTimeFormat('en-CA',{
        timeZone:tz,
        year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',hourCycle:'h23'
      }).formatToParts(new Date(Number(sourceStart)*1000));
      const get=t=>parts.find(p=>p.type===t)?.value;
      const y=get('year'),m=get('month'),d=get('day'),h=get('hour');
      if(!y||!m||!d||h==null) return null;
      return `media-source://frigate/${clientId}/recordings/${cam}/${y}-${m}-${d}/${h}`;
    } catch(_) { return null; }
  },

async _resolveFrigateRecordingHourMedia(clientId, cam, sourceStart) {
    const id=this._frigateRecordingMediaSourceId(clientId,cam,sourceStart);
    if(!id) return null;
    try {
      const url=await this._resolveMediaContentId(id);
      return url ? this._absoluteHaMediaUrl(url) : null;
    } catch(err) {
      console.warn('[Frigate] recording media-source resolve failed',err);
      return null;
    }
  },

_attachStableHlsPlayer(session, url) {
    const holder=session.holder;
    // `auth/sign_path` returns a relative path. HA's HLS component requires an
    // absolute base URL because it uses new URL(relativePlaylist, this._url).
    // Normalize once here and use the same absolute URL for HA and native fallback.
    url=this._absoluteHaMediaUrl(url);
    holder.querySelectorAll('video,ha-hls-player,.stable-hls-player').forEach(el=>{ try{el.remove();}catch(_){} });

    // The Home Assistant iOS app/WKWebView can expose native HLS but not a fully
    // usable ManagedMediaSource implementation for hls.js. In that environment
    // <ha-hls-player> may create a video element that accepts play() yet never
    // exits buffering. For iOS we therefore use the Frigate integration's own
    // resolved recording media-source playlist with Safari's native HLS engine,
    // while retaining our exact segment->timestamp seek mapping.
    if (session.preferNativeIOS) {
      const native=document.createElement('video');
      native.className='recording-video stable-recording-video ios-native-hls';
      native.style.cssText='position:absolute;inset:0;width:100%;height:100%;display:block;background:#000;object-fit:contain';
      native.controls=true; native.playsInline=true; native.muted=true; native.preload='auto';
      native.setAttribute('controls',''); native.setAttribute('playsinline',''); native.setAttribute('webkit-playsinline','');
      holder.insertBefore(native,holder.firstChild);
      session.player=native;
      this._bindStableRecordingVideo(native,session);
      native.src=url;
      try { native.load(); } catch(_) {}
      return;
    }

    // Create HA's HLS element without a URL first. This lets us intercept the
    // hls.js instance at the instant Home Assistant constructs it and seed the
    // exact Frigate startPosition *before* media attachment / fragment loading.
    // Frigate's own HlsVideoPlayer does the same via new Hls({startPosition}).
    const player=this._createHlsPlayer(null,{autoplay:true,requireUrl:false});
    player.className=(player.className||'')+' stable-hls-player';
    player.style.cssText='position:absolute;inset:0;width:100%;height:100%;display:block;background:#000';
    holder.insertBefore(player,holder.firstChild);
    session.player=player;

    const initialStart=Number(session.pendingSeek);
    try {
      let hlsInstance;
      Object.defineProperty(player,'_hlsPolyfillInstance',{
        configurable:true,
        enumerable:false,
        get(){ return hlsInstance; },
        set(instance){
          hlsInstance=instance;
          if (instance && Number.isFinite(initialStart)) {
            try { instance.config.startPosition=Math.max(0,initialStart); } catch(_) {}
          }
        }
      });
    } catch(_) {
      // HA internals may change; the normal video currentTime fallback below
      // still seeks once metadata is available.
    }

    let tries=0;
    const attach=()=>{
      if(session.token!==this._playSeq || this._playbackSession!==session) return;
      const video=this._findVideo(player);
      if(video) { this._bindStableRecordingVideo(video,session); return; }
      if(++tries<160) { session.attachTimer=setTimeout(attach,50); return; }

      // On older Safari/iOS where hls.js/MSE is unavailable, HA may fall back
      // to native HLS. Use the same signed VOD URL and retain the exact seek.
      try { player.remove(); } catch(_) {}
      const native=document.createElement('video');
      native.className='recording-video';
      native.style.cssText='position:absolute;inset:0;width:100%;height:100%;display:block;background:#000;object-fit:contain';
      native.controls=true; native.playsInline=true; native.muted=true; native.preload='auto';
      native.setAttribute('controls',''); native.setAttribute('playsinline',''); native.setAttribute('webkit-playsinline','');
      holder.insertBefore(native,holder.firstChild);
      session.player=native;
      this._bindStableRecordingVideo(native,session);
      native.src=url;
      try { native.load(); } catch(_) {}
    };
    attach();

    // Trigger HA's HLS setup only after the startPosition interception exists.
    player.url=url;
  },

_attachStableMp4Player(session, url) {
    const holder=session.holder;
    // Remove any stale media nodes but preserve the loading overlay.
    holder.querySelectorAll('video,ha-hls-player,.stable-hls-player').forEach(el=>{ try{el.remove();}catch(_){} });
    const video=document.createElement('video');
    video.className='recording-video stable-recording-video';
    video.style.cssText='position:absolute;inset:0;width:100%;height:100%;display:block;background:#000;object-fit:contain';
    video.playsInline=true; video.muted=true; video.preload='auto';
    video.setAttribute('controls','');
    video.setAttribute('playsinline','');
    video.setAttribute('webkit-playsinline','');
    holder.insertBefore(video,holder.firstChild);
    session.player=video;
    this._bindStableRecordingVideo(video,session);
    video.src=url;
    try { video.load(); } catch(_) {}
  },

async _showRecording(s, e, seekFrom, sourceRange=null) {
    const target=Number.isFinite(Number(seekFrom)) ? Math.floor(Number(seekFrom)) : Math.floor(Number(s));
    if (!Number.isFinite(target)) return;
    const hour=this._hourStart(target);
    const sourceStart=hour;
    const sourceEnd=hour+3600;
    const isIOS=this._isIOSRecordingPlatform();
    const current=this._playbackSession;

    // Desktop keeps the stable hls.js session introduced in the newer builds.
    // iOS deliberately does not use this session: the older v52 card used the
    // Frigate recording MP4 proxy and Safari's native byte-range seeking, which
    // is substantially faster than walking an HLS hour playlist on WKWebView.
    if (!isIOS && current && target>=current.sourceStart && target<current.sourceEnd && current.token===this._playSeq) {
      const offset=this._frigateSeekPosition(target,current.recordings,current.inpointOffset);
      if (Number.isFinite(offset)) {
        current.targetTs=target;
        current.pendingSeek=offset;
        this._playing={rec:target};
        this._scrubTarget=target;
        if (typeof current.requestSeek==='function') current.requestSeek(offset,target);
        return;
      }
    }

    this._cancelActivePlayback();
    const token=++this._playSeq;
    const playbackSeq=++this._playbackLoadSeq;
    this._enter();
    this._playing={rec:target};
    this._scrubTarget=target;
    this._playingHour=hour;
    this._renderStreamCtrl();

    const {clientId,cam}=this._cc();
    if(!clientId||!cam) return;
    let recordings=[];
    try {
      const rows=await this._ws({type:'frigate/recordings/get',instance_id:clientId,camera:cam,after:sourceStart,before:sourceEnd});
      recordings=(Array.isArray(rows)?rows:[])
        .filter(r=>Number(r.start_time)<sourceEnd&&Number(r.end_time)>sourceStart)
        .sort((a,b)=>Number(a.start_time)-Number(b.start_time));
    } catch(_) {
      recordings=(this._recordings||[])
        .filter(r=>Number(r.start_time)<sourceEnd&&Number(r.end_time)>sourceStart)
        .sort((a,b)=>Number(a.start_time)-Number(b.start_time));
    }
    if(token!==this._playSeq || playbackSeq!==this._playbackLoadSeq) return;

    const inpointOffset=this._frigateInpointOffset(sourceStart,recordings[0]);
    const offset=this._frigateSeekPosition(target,recordings,inpointOffset);
    const hasRecording=recordings.some(r=>Number(r.start_time)<=target&&Number(r.end_time)>=target);
    if(!hasRecording || !Number.isFinite(offset)) {
      this._playingRecordings=recordings;
      this._playingInpointOffset=inpointOffset;
      this._playingSourceStart=sourceStart;
      this._playingSourceEnd=sourceEnd;
      this._setStatusOverlay('offline','No recording at this time','Frigate has no retained recording covering this timeline position.',{retry:false});
      return;
    }

    this._playingRecordings=recordings;
    this._playingInpointOffset=inpointOffset;
    this._playingSourceStart=sourceStart;
    this._playingSourceEnd=sourceEnd;

    if (isIOS) {
      // iOS playback mirrors the older v52 card exactly: try Home Assistant's
      // signed Frigate MP4 recording proxy first, but DO NOT leave Safari stuck
      // on its native "cannot play" glyph if that particular hour/codec is not
      // accepted. The fallback remains Home Assistant's signed Frigate-integration
      // VOD proxy (index.m3u8) through HA's HLS player.
      const viewer=this.shadowRoot.querySelector('#viewer');
      if(!viewer) return;
      viewer.innerHTML='<div class="ld">Loading recording…</div>';

      const recordingPath=`/api/frigate/${encodeURIComponent(String(clientId))}/recording/${encodeURIComponent(String(cam))}/start/${sourceStart}/end/${sourceEnd}`;
      const vodPath=`/api/frigate/${encodeURIComponent(String(clientId))}/vod/${encodeURIComponent(String(cam))}/start/${sourceStart}/end/${sourceEnd}/index.m3u8`;
      // Keep the MP4 URL in the same relative signed form used by the old card.
      // A normal <video> element can resolve this path relative to HA itself.
      const mp4Url=await this._signed(recordingPath);
      const hlsUrl=await this._signed(vodPath);
      if(token!==this._playSeq || playbackSeq!==this._playbackLoadSeq) return;

      viewer.innerHTML='<div class="rec-player"></div>';
      const holder=viewer.querySelector('.rec-player');
      let didPlay=false;
      let cleanupVideo=null;
      let mode='mp4';
      let fallback=false;

      const wireVideo=(vid)=>{
        if(!vid || vid.dataset.frigateWired==='1') return false;
        vid.dataset.frigateWired='1';
        vid.controls=true;
        vid.playsInline=true;
        vid.preload='auto';
        vid.setAttribute('controls','');
        vid.setAttribute('playsinline','');
        vid.setAttribute('webkit-playsinline','');

        const sync=()=>{
          if(this._playSeq!==token || this._activePlaybackCleanup!==cleanupVideo) return;
          const rel=Number(vid.currentTime);
          if(!Number.isFinite(rel)||rel<0) return;
          const absolute=this._frigateProgress(rel,recordings,inpointOffset);
          if(!Number.isFinite(absolute)) return;
          this._scrubTarget=absolute;
          this._playing={rec:absolute};
          this._updateTimelinePlaybackTime(absolute);
        };

        const seekAndPlay=async()=>{
          if(this._playSeq!==token || this._activePlaybackCleanup!==cleanupVideo) return;
          if(!Number.isFinite(vid.duration)||vid.duration<=0) return;
          const clamped=Math.max(0,Math.min(offset,Math.max(0,vid.duration-0.05)));
          try {
            if(Math.abs(Number(vid.currentTime)-clamped)>0.25) vid.currentTime=clamped;
          } catch(_) {}
          this._scrubTarget=target;
          this._playing={rec:target};
          vid.muted=true;
          try {
            await vid.play();
            if(this._playSeq!==token || this._activePlaybackCleanup!==cleanupVideo) return;
            didPlay=true;
          } catch(err) {
            console.warn('[Frigate] iOS recording play() blocked',err);
          }
        };

        vid.addEventListener('loadedmetadata',seekAndPlay);
        vid.addEventListener('canplay',seekAndPlay,{once:true});
        vid.addEventListener('durationchange',()=>{ if(!didPlay) seekAndPlay(); });
        vid.addEventListener('timeupdate',sync);
        vid.addEventListener('playing',sync);
        vid.addEventListener('seeked',sync);
        vid.addEventListener('ended',()=>{
          if(this._playSeq===token && this._activePlaybackCleanup===cleanupVideo) this._continueRecording(sourceEnd,token);
        });

        cleanupVideo=()=>{
          try{vid.pause();}catch(_){}
          try{vid.removeAttribute('src');vid.srcObject=null;vid.load();}catch(_){}
        };
        this._activePlaybackCleanup=cleanupVideo;
        return true;
      };

      const native=document.createElement('video');
      native.className='recording-video legacy-ios-recording-video';
      native.style.cssText='position:absolute;inset:0;width:100%;height:100%;display:block;background:#000;object-fit:contain';
      native.preload='auto';
      native.muted=true;
      native.playsInline=true;
      native.setAttribute('playsinline','');
      native.setAttribute('webkit-playsinline','');

      const useHlsFallback=()=>{
        if(fallback || this._playSeq!==token) return;
        fallback=true;
        mode='hls';
        try{native.pause();native.removeAttribute('src');native.load();}catch(_){}
        try{native.remove();}catch(_){}
        const player=this._createHlsPlayer(hlsUrl,{autoplay:true});
        player.style.cssText='position:absolute;inset:0;width:100%;height:100%;display:block;background:#000';
        holder.appendChild(player);
        let tries=0;
        const attach=()=>{
          if(this._playSeq!==token) return;
          const inner=this._findVideo(player);
          if(inner && wireVideo(inner)) {
            inner.muted=true;
            return;
          }
          if(++tries<160) setTimeout(attach,75);
          else console.warn('[Frigate] iOS HLS fallback never exposed a video element');
        };
        attach();
      };

      const onNativeError=()=>{
        if(this._playSeq!==token) return;
        const err=native.error;
        console.warn('[Frigate] iOS recording MP4 error; falling back to HLS',err?.code,err?.message||'',{mode});
        if(mode==='mp4') {
          useHlsFallback();
          return;
        }
      };
      native.addEventListener('error',onNativeError);

      holder.appendChild(native);
      wireVideo(native);
      native.src=mp4Url;
      native.load();
      return;
    }

    // Desktop/Chrome retains the current exact Frigate VOD + hls.js path.
    const vodPath=`/api/frigate/${encodeURIComponent(String(clientId))}/vod/${encodeURIComponent(String(cam))}/start/${sourceStart}/end/${sourceEnd}/master.m3u8`;
    const hlsUrl=await this._resolveSignedVodPlaylist(vodPath);
    if(token!==this._playSeq || playbackSeq!==this._playbackLoadSeq) return;
    const holder=this._ensurePlaybackShell();
    if(!holder) return;
    this._setPlaybackLoading(true);
    const session={token,sourceStart,sourceEnd,recordings,inpointOffset,targetTs:target,pendingSeek:offset,holder,player:null,video:null,bound:false,preferNativeIOS:false,iosWindowed:false};
    this._playbackSession=session;
    this._attachStableHlsPlayer(session,hlsUrl);
  },

async _continueRecording(nextTs, token) {
    if (this._playSeq !== token) return;
    const next = this._hourStart(Number(nextTs));
    const now = Math.floor(Date.now()/1000);
    if (next >= now) return;
    const {clientId, cam} = this._cc();
    try {
      const rec = await this._ws({type:'frigate/recordings/get', instance_id:clientId, camera:cam, after:next, before:next+3600});
      if (this._playSeq !== token) return;
      const ranges = this._mergeRecs(Array.isArray(rec) ? rec : []);
      const hasMedia = ranges.some(r => Number(r.start_time) < next + 3600 && Number(r.end_time || next) > next);
      if (hasMedia) {
        // Start exactly at the hour boundary. _showRecording will use the
        // boundary as sourceStart, so no 10-second lead-in is replayed here.
        await this._showRecording(next, next + 3600, next);
      }
    } catch (_) {}
  },

_toggleRecSeek(row) {
    // Capture rs/re directly from this specific row's dataset — no shared state
    const rs = +row.dataset.rs;
    const re = +row.dataset.re;
    const existing = row.querySelector('.rec-seek-wrap');
    if (existing) {
      // Second click: close the seek bar, leave the video playing as-is
      existing.remove();
      return;
    }
    // First click: show seek bar and start playing from beginning immediately
    const d = Math.max(1, re - rs);
    const wrap = document.createElement('div');
    wrap.className = 'rec-seek-wrap';
    // Helper: offset seconds → absolute wall-clock label
    const toTime = v => new Date((rs + v) * 1000).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit', second:'2-digit'});
    wrap.innerHTML = `<div class="rec-seek-row">
      <input type="range" class="rec-seek-bar" min="0" max="${d}" value="0" step="1">
      <span class="rec-seek-lbl">▶ ${this._time(rs)}</span>
    </div>`;
    row.querySelector('.rinf').appendChild(wrap);
    const bar = wrap.querySelector('.rec-seek-bar');
    const lbl = wrap.querySelector('.rec-seek-lbl');
    // Update label while dragging (no video load)
    bar.addEventListener('input', ev => { ev.stopPropagation(); lbl.textContent = `▶ ${toTime(+bar.value)}`; });
    // Load video at seeked position on mouse-up/touch-end
    bar.addEventListener('change', ev => {
      ev.stopPropagation();
      const offset = +bar.value;
      this._showRecording(rs, re, offset > 0 ? rs + offset : rs);
    });
    // Play from start immediately so user sees something while positioning the bar
    this._showRecording(rs, re);
  },

async _signed(path) { try { const r=await this._hass.callWS({type:'auth/sign_path',path,expires:3600}); return r?.path||path; } catch(_) { return path; } },

async _resolveSignedVodPlaylist(masterPath) {
    // Home Assistant signed paths authenticate the exact manifest URL. Frigate's
    // master playlist points at a second manifest (for example index-v1-a1.m3u8).
    // Reusing the master.m3u8 authSig on that child manifest yields HTTP 401.
    // Resolve the master ourselves, then sign the exact child manifest path that
    // ha-hls-player/hls.js will load. The child manifest propagates that query
    // string to its media segments; HA's VOD segment proxy validates the signed
    // directory prefix for .m4s/.mp4/.ts requests.
    const signedMaster=await this._signed(masterPath);
    const masterUrl=this._absoluteHaMediaUrl(signedMaster);
    try {
      const resp=await fetch(masterUrl,{credentials:'same-origin',cache:'no-store'});
      if(!resp.ok) throw new Error(`master manifest ${resp.status}`);
      const text=await resp.text();
      const lines=text.split(/\r?\n/).map(x=>x.trim()).filter(Boolean);
      let childLine='';
      for(let i=0;i<lines.length;i++) {
        if(lines[i].startsWith('#EXT-X-STREAM-INF')) {
          for(let j=i+1;j<lines.length;j++) {
            if(!lines[j].startsWith('#')) { childLine=lines[j]; break; }
          }
          if(childLine) break;
        }
      }
      // Some Frigate/nginx-vod responses may contain a direct media playlist.
      // In that case the signed master itself is already the final HLS source.
      if(!childLine) return masterUrl;
      const childUrl=new URL(childLine,masterUrl);
      const signedChild=await this._signed(childUrl.pathname);
      return this._absoluteHaMediaUrl(signedChild);
    } catch(err) {
      console.warn('[Frigate] unable to resolve/sign VOD child manifest',err);
      return masterUrl;
    }
  },

_findVideo(node, depth, crossedShadow) {
    if (!node || (depth||0) > 6) return null;
    if (node.tagName === 'VIDEO') { node._viaShadow = !!crossedShadow; return node; }
    if (node.shadowRoot) {
      const v = node.shadowRoot.querySelector('video');
      if (v) { v._viaShadow = true; return v; }
      for (const child of node.shadowRoot.children) { const f = this._findVideo(child, (depth||0)+1, true); if (f) return f; }
    }
    const children = node.children || [];
    for (const child of children) { const f = this._findVideo(child, (depth||0)+1, crossedShadow); if (f) return f; }
    return null;
  },

_fullscreen(el) {
    if (!el) return;
    // Live WebRTC must stay in the exact same DOM node. Never invoke
    // webkitEnterFullscreen() on its nested video and never mutate srcObject.
    // The wrapper/fullscreen element preserves the stream session.
    const liveWrap = el.id === 'eng-wrap' || !!el.closest?.('#eng-wrap');
    if (liveWrap) {
      // Never hand a live MediaStream video to iOS's native fullscreen
      // compositor. Keep the exact same player/peer inline and fullscreen only
      // the wrapper. This avoids the WebKit state where video rendering freezes
      // while the stream's audio track continues normally.
      if(this._isIOSRecordingPlatform()) {
        el.classList.add('live-pseudo-fullscreen');
        this._livePseudoFullscreen=true;
        this._removeLiveFsMirror();
        this._addLiveFsExit(el);
        const v=this._go2rtcLive?.video || this._findVideo(this._engine);
        try { v?.setAttribute?.('controlslist','nofullscreen'); const p=v?.play?.(); if(p?.catch)p.catch(()=>{}); } catch(_) {}
        return;
      }
      const req = el.requestFullscreen || el.webkitRequestFullscreen;
      if (req) { try { const p=req.call(el); if(p?.catch) p.catch(()=>{}); return; } catch(_) {} }
      el.classList.add('live-pseudo-fullscreen');
      this._livePseudoFullscreen = true;
      this._addLiveFsExit(el);
      return;
    }
    const vid = el.tagName === 'VIDEO' ? el : this._findVideo(el);
    const isLivePlayerVideo = vid && vid._viaShadow;
    if (vid) delete vid._viaShadow;
    if (vid && !isLivePlayerVideo && typeof vid.webkitEnterFullscreen === 'function' && vid.webkitSupportsFullscreen !== false) {
      try { vid.webkitEnterFullscreen(); return; } catch (_) { /* fall through */ }
    }
    const req = el.requestFullscreen || el.webkitRequestFullscreen;
    if (req) { const p=req.call(el); if (p?.catch) p.catch(()=>{}); return; }
    if (vid) { const req2=vid.requestFullscreen || vid.webkitRequestFullscreen; if(req2) req2.call(vid); }
  }
};
