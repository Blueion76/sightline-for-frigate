/**
 * HLS/MP4 attachment and continuous recording playback control.
 *
 * Methods are composed onto SightlineCard.prototype; method names are kept
 * stable so existing card behavior and tests remain unchanged.
 */
export const recordingPlayerMethods = {
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
  }
};
