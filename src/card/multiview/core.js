/**
 * Shared Multiview recording calculations and per-camera synchronization helpers.
 */
export const multiviewCoreMethods = {
  _multiRecordingBucket(target) {
    const bucket=15*60;
    const t=Math.max(0,Math.floor(Number(target)||0));
    const start=Math.floor(t/bucket)*bucket;
    const now=Math.floor(Date.now()/1000);
    return {start,end:Math.max(start+1,Math.min(start+bucket,now))};
  },
  _multiRecordingCurrentTs(session=this._multiPlaybackSession) {
    if(!session) return NaN;
    return Number(session.clockBaseTs)+Math.max(0,(performance.now()-Number(session.clockStartedAt||performance.now()))/1000);
  },
  _multiRecordingHasCoverage(entry,ts) {
    return (entry?.recordings||[]).some(r=>Number(r.start_time)<=ts&&Number(r.end_time)>=ts);
  },
  _multiRecordingSetState(entry,state,text='') {
    if(!entry)return;
    const available=state==='playing';
    if(entry.mediaHost)entry.mediaHost.style.visibility=available?'visible':'hidden';
    if(entry.status){entry.status.textContent=text||(available?'':'No recording');entry.status.style.display=available?'none':'flex';}
  },
  _multiRecordingSyncEntry(entry,absTs,force=false) {
    if(!entry||entry.session!==this._multiPlaybackSession)return;
    if(!this._multiRecordingHasCoverage(entry,absTs)){
      this._multiRecordingSetState(entry,'gap','No recording');
      try{entry.video?.pause?.();}catch(_){}
      return;
    }
    const offset=this._frigateSeekPosition(absTs,entry.recordings,entry.inpointOffset||0);
    if(!Number.isFinite(offset)){
      this._multiRecordingSetState(entry,'gap','No recording');
      return;
    }
    this._multiRecordingSetState(entry,'playing');
    const video=entry.video;
    if(!video||video.readyState<1)return;
    const d=Number(video.duration);
    const wanted=Number.isFinite(d)&&d>0?Math.max(0,Math.min(offset,Math.max(0,d-.05))):Math.max(0,offset);
    const current=Number(video.currentTime);
    if(force||!Number.isFinite(current)||Math.abs(current-wanted)>.55){try{video.currentTime=wanted;}catch(_){}}
    video.muted=true;
    if(video.paused){try{const p=video.play();if(p?.catch)p.catch(()=>{});}catch(_){}}
  },
  _multiRecordingBindVideo(entry,video) {
    if(!entry||!video||entry.video===video)return;
    entry.video=video;
    video.muted=true;video.playsInline=true;video.preload='auto';video.controls=false;
    video.setAttribute('playsinline','');video.setAttribute('webkit-playsinline','');
    const sync=()=>{
      if(entry.session!==this._multiPlaybackSession)return;
      const ts=this._multiRecordingCurrentTs(entry.session);
      if(Number.isFinite(ts))this._multiRecordingSyncEntry(entry,ts,true);
    };
    ['loadedmetadata','durationchange','canplay'].forEach(ev=>video.addEventListener(ev,sync));
    sync();
  }
};
