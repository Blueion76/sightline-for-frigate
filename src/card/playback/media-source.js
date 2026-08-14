/**
 * Frigate/Home Assistant media URL resolution and recorded-media element creation.
 *
 * Methods are composed onto SightlineCard.prototype; method names are kept
 * stable so existing card behavior and tests remain unchanged.
 */
export const mediaSourceMethods = {
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
  }
};
