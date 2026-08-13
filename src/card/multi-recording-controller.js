import { timelineInteractionMethods } from './timeline-interaction.js';
import { recordingPlaybackMethods } from './recording-playback.js';
import { liveMethods } from './live.js';

export const multiRecordingControllerMethods = {
  _cancelMultiRecordingPlayback() {
    const session=this._multiPlaybackSession;
    if(!session)return;
    this._multiPlaybackSession=null;
    clearInterval(session.syncTimer);
    for(const entry of session.entries||[]){
      clearTimeout(entry?.attachTimer);
      try{entry?.video?.pause?.();}catch(_){}
      try{if(entry?.video&&entry.player===entry.video){entry.video.removeAttribute('src');entry.video.srcObject=null;entry.video.load();}}catch(_){}
      try{entry?.player?.remove?.();}catch(_){}
    }
    const grid=this.shadowRoot?.querySelector?.('#cam-grid');
    grid?.querySelector?.('#multi-recording-back-live')?.remove();
    if(grid)delete grid.dataset.multiRecording;
  },

  async _showMultiRecording(target) {
    const t=Math.max(0,Math.floor(Number(target)));
    if(!Number.isFinite(t)||this._viewMode!=='grid'||(this._config?.cameras?.length||0)<2){
      return recordingPlaybackMethods._showRecording.call(this,this._hourStart(t),this._hourStart(t)+3600,t);
    }

    const current=this._multiPlaybackSession;
    if(current&&t>=current.sourceStart&&t<current.sourceEnd){
      current.targetTs=t;
      current.clockBaseTs=t;
      current.clockStartedAt=performance.now();
      this._playing={rec:t,multi:true};
      this._scrubTarget=t;
      this._updateTimelinePlaybackTime(t);
      for(const entry of current.entries||[])this._multiRecordingSyncEntry(entry,t,true);
      this._renderStreamCtrl();
      return;
    }

    this._cancelActivePlayback();
    const token=++this._playSeq;
    const bucket=this._multiRecordingBucket(t);
    const session={token,targetTs:t,clockBaseTs:t,clockStartedAt:performance.now(),sourceStart:bucket.start,sourceEnd:bucket.end,entries:[],syncTimer:null,advancing:false};
    this._multiPlaybackSession=session;
    this._playbackReturnViewMode='grid';
    this._playing={rec:t,multi:true};
    this._scrubTarget=t;
    this._tab='live';
    this._galleryMode='';

    const viewer=this.shadowRoot.querySelector('#viewer');
    if(viewer){viewer.innerHTML='';viewer.style.display='none';}
    const engWrap=this.shadowRoot.querySelector('#eng-wrap');
    if(engWrap)engWrap.style.display='none';
    const grid=this.shadowRoot.querySelector('#cam-grid');
    if(!grid)return;
    grid.style.display='';
    grid.style.position='relative';
    await this._mountGrid();
    if(session!==this._multiPlaybackSession||token!==this._playSeq)return;

    const slots=[...grid.querySelectorAll('.grid-slot:not(.placeholder)')];
    const back=document.createElement('button');
    back.id='multi-recording-back-live';back.type='button';back.textContent='Back to Live';back.setAttribute('aria-label','Back to Live');
    back.style.cssText='position:absolute;left:12px;top:12px;z-index:90;min-height:36px;padding:7px 12px;border:1px solid rgba(255,255,255,.24);border-radius:999px;background:rgba(16,16,18,.78);color:#fff;font:650 12px/1 -apple-system,BlinkMacSystemFont,system-ui,sans-serif;backdrop-filter:blur(16px) saturate(160%);-webkit-backdrop-filter:blur(16px) saturate(160%);cursor:pointer';
    back.addEventListener('click',ev=>{ev.preventDefault();ev.stopPropagation();this._showLive();});
    grid.appendChild(back);

    const entries=await Promise.all(this._config.cameras.map((camera,index)=>this._multiRecordingPrepareEntry(camera,index,slots[index],session)));
    if(session!==this._multiPlaybackSession||token!==this._playSeq)return;
    session.entries=entries.filter(Boolean);
    session.clockBaseTs=t;
    session.clockStartedAt=performance.now();
    this._updateTimelinePlaybackTime(t);
    this._renderStreamCtrl();

    const tick=()=>{
      if(session!==this._multiPlaybackSession||token!==this._playSeq||this._viewMode!=='grid'||this._timelineInteracting)return;
      const abs=this._multiRecordingCurrentTs(session);
      if(!Number.isFinite(abs))return;
      const now=Math.floor(Date.now()/1000);
      if(abs>=now-1){
        if(!session.advancing){session.advancing=true;this._refreshLiveFromTimeline();}
        return;
      }
      if(abs>=session.sourceEnd-.25){
        if(!session.advancing){session.advancing=true;this._showMultiRecording(session.sourceEnd);}
        return;
      }
      session.targetTs=abs;
      this._playing={rec:abs,multi:true};
      this._scrubTarget=abs;
      this._updateTimelinePlaybackTime(abs);
      for(const entry of session.entries)this._multiRecordingSyncEntry(entry,abs,false);
    };
    tick();
    session.syncTimer=setInterval(tick,250);
  },

  _cancelActivePlayback(keepSession=false) {
    this._cancelMultiRecordingPlayback();
    return recordingPlaybackMethods._cancelActivePlayback.call(this,keepSession);
  },

  async _seekTimelineTarget(target) {
    const t=Math.max(0,Math.floor(Number(target)));
    if(this._viewMode==='grid'&&(this._config?.cameras?.length||0)>1){
      if(!Number.isFinite(t))return;
      const seq=++this._timelineSeekSeq;
      this._scrubTarget=t;
      await this._showMultiRecording(t);
      if(seq!==this._timelineSeekSeq)return;
      return;
    }
    return timelineInteractionMethods._seekTimelineTarget.call(this,target);
  },

  _setViewMode(mode) {
    if(mode!=='grid'&&this._multiPlaybackSession)this._cancelMultiRecordingPlayback();
    return liveMethods._setViewMode.call(this,mode);
  }
};
