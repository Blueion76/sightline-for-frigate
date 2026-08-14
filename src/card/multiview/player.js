/**
 * Per-camera Multiview recording player creation and decoder synchronization.
 */
import { cap } from '../../helpers.js';

export const multiviewPlayerMethods = {
  async _multiRecordingAttachPlayer(entry) {
    const session=entry.session;
    if(!session||session!==this._multiPlaybackSession||!entry.recordings.length)return;
    const {clientId,cam,sourceStart,sourceEnd}=entry;
    const isIOS=this._isIOSRecordingPlatform();
    const attachHls=async()=>{
      if(session!==this._multiPlaybackSession)return;
      const leaf=isIOS?'index':'master';
      const path=`/api/frigate/${encodeURIComponent(String(clientId))}/vod/${encodeURIComponent(String(cam))}/start/${sourceStart}/end/${sourceEnd}/${leaf}.m3u8`;
      const url=isIOS?await this._signed(path):await this._resolveSignedVodPlaylist(path);
      if(session!==this._multiPlaybackSession)return;
      const player=this._createHlsPlayer(url,{autoplay:true,controls:false,muted:true});
      player.style.cssText='position:absolute;inset:0;width:100%;height:100%;display:block;background:#000;pointer-events:none';
      entry.mediaHost.innerHTML='';entry.mediaHost.appendChild(player);entry.player=player;
      let tries=0;
      const find=()=>{
        if(session!==this._multiPlaybackSession)return;
        const video=this._findVideo(player);
        if(video){this._multiRecordingBindVideo(entry,video);return;}
        if(++tries<160)entry.attachTimer=setTimeout(find,60);
        else this._multiRecordingSetState(entry,'error','Unable to play recording');
      };
      find();
    };
    if(!isIOS){await attachHls();return;}
    const path=`/api/frigate/${encodeURIComponent(String(clientId))}/recording/${encodeURIComponent(String(cam))}/start/${sourceStart}/end/${sourceEnd}`;
    const url=await this._signed(path);
    if(session!==this._multiPlaybackSession)return;
    const video=document.createElement('video');
    video.style.cssText='position:absolute;inset:0;width:100%;height:100%;display:block;background:#000;object-fit:contain;pointer-events:none';
    entry.mediaHost.innerHTML='';entry.mediaHost.appendChild(video);entry.player=video;
    this._multiRecordingBindVideo(entry,video);
    let fallback=false;
    video.addEventListener('error',()=>{
      if(fallback||session!==this._multiPlaybackSession)return;
      fallback=true;try{video.pause();video.removeAttribute('src');video.load();}catch(_){}attachHls();
    },{once:true});
    video.src=url;try{video.load();}catch(_){}
  },

  async _multiRecordingPrepareEntry(camera,index,slot,session) {
    if(!slot)return null;
    const name=cap(camera?.name||this._hass?.states?.[camera?.entity]?.attributes?.friendly_name||camera?.entity?.replace(/^camera\./,'')||`Camera ${index+1}`);
    slot.innerHTML='';slot.dataset.multiRecording='1';slot.style.position='relative';
    const mediaHost=document.createElement('div');
    mediaHost.style.cssText='position:absolute;inset:0;background:#000;overflow:hidden';slot.appendChild(mediaHost);
    const status=document.createElement('div');
    status.style.cssText='position:absolute;inset:0;z-index:4;display:flex;align-items:center;justify-content:center;padding:18px;text-align:center;background:#000;color:rgba(255,255,255,.72);font:600 12px/1.35 -apple-system,BlinkMacSystemFont,system-ui,sans-serif';
    status.textContent='Loading recording…';slot.appendChild(status);
    const label=document.createElement('div');label.className='grid-label';label.textContent=name;slot.appendChild(label);
    if(!this._camCache[camera.entity]?.discovered){try{await this._discoverOne(camera.entity);}catch(_){}}
    if(session!==this._multiPlaybackSession)return null;
    const cc=this._camCache[camera.entity]||{};
    const clientId=camera.frigate_client_id||cc.clientId||this._config.frigate_client_id||'frigate';
    const cam=cc.cam||this._hass?.states?.[camera.entity]?.attributes?.camera_name||camera.entity.replace(/^camera\./,'');
    const entry={camera,index,name,slot,mediaHost,status,clientId,cam,sourceStart:session.sourceStart,sourceEnd:session.sourceEnd,recordings:[],inpointOffset:0,video:null,player:null,attachTimer:null,session};
    try{
      const rows=await this._ws({type:'frigate/recordings/get',instance_id:clientId,camera:cam,after:session.sourceStart,before:session.sourceEnd});
      entry.recordings=(Array.isArray(rows)?rows:[]).filter(r=>Number(r.start_time)<session.sourceEnd&&Number(r.end_time)>session.sourceStart).sort((a,b)=>Number(a.start_time)-Number(b.start_time));
    }catch(_){
      entry.recordings=(Array.isArray(cc.recordings)?cc.recordings:[]).filter(r=>Number(r.start_time)<session.sourceEnd&&Number(r.end_time)>session.sourceStart).sort((a,b)=>Number(a.start_time)-Number(b.start_time));
    }
    if(session!==this._multiPlaybackSession)return null;
    entry.inpointOffset=this._frigateInpointOffset(session.sourceStart,entry.recordings[0]);
    if(!entry.recordings.length){this._multiRecordingSetState(entry,'gap','No recording');return entry;}
    await this._multiRecordingAttachPlayer(entry);
    return entry;
  }
};
