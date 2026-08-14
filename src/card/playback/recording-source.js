/**
 * Recording media-source identifiers, Home Assistant resolution, and signed VOD playlists.
 *
 * Methods are composed onto SightlineCard.prototype; method names are kept
 * stable so existing card behavior and tests remain unchanged.
 */
export const recordingSourceMethods = {
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
  }
};
