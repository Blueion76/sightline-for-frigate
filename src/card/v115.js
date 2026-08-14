import { ICONS } from '../constants.js';
import { actionMethods } from './actions.js';
import { browserMethods } from './browser.js';
import { liveMethods } from './live.js';
import { multiRecordingMethods } from './multi-recording.js';
import { responsiveUxMethods } from './responsive-ux.js';
import { timelineInteractionMethods } from './timeline-interaction.js';

const SCALES=[60,300,600,1800,2700,3600,10800,21600,43200,86400];
const SCALE_LABELS={60:'1m',300:'5m',600:'10m',1800:'30m',2700:'45m',3600:'1h',10800:'3h',21600:'6h',43200:'12h',86400:'24h'};
const parseDate=value=>{
  const m=String(value||'').match(/^(\d{4})-(\d{2})-(\d{2})$/); if(!m)return null;
  const y=+m[1],mo=+m[2],d=+m[3],date=new Date(y,mo-1,d,12);
  return date.getFullYear()===y&&date.getMonth()===mo-1&&date.getDate()===d?{y,date,value:`${m[1]}-${m[2]}-${m[3]}`}:null;
};
const dateValue=ts=>{
  const d=new Date(Number(ts||Date.now()/1000)*1000),p=n=>String(n).padStart(2,'0');
  return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}`;
};

export const v115Methods={
  _ensureTimelineNativeDateInput(){
    const input=responsiveUxMethods._ensureTimelineNativeDateInput.call(this); if(!input)return null;
    const host=input.parentElement;
    if(host){
      Object.assign(host.style,{gap:'6px',whiteSpace:'nowrap',overflow:'visible'});
      if(!host.querySelector?.('.timeline-date-label')){
        const label=document.createElement('span');
        label.className='timeline-date-label'; label.setAttribute('aria-hidden','true');
        label.style.cssText='display:none;pointer-events:none;white-space:nowrap;font:650 11px/1 -apple-system,BlinkMacSystemFont,"SF Pro Text",system-ui,sans-serif;font-variant-numeric:tabular-nums;letter-spacing:-.01em;';
        host.insertBefore(label,input);
      }
    }
    this._updateTimelineDateLabel();
    return input;
  },

  _prepareTimelineNativeDateInput(input){
    const out=responsiveUxMethods._prepareTimelineNativeDateInput.call(this,input);
    this._updateTimelineDateLabel();
    return out;
  },

  _updateTimelineDateLabel(value=null){
    const root=this.shadowRoot,host=root?.querySelector?.('#cal-btn'),input=root?.querySelector?.('#timeline-native-date');
    if(!host||!input)return;
    const parsedString=typeof value==='string'?parseDate(value):null;
    const ds=parsedString?.value || (Number.isFinite(Number(value))?dateValue(value):Number.isFinite(Number(this._timelineFocusTs))?dateValue(this._timelineFocusTs):parseDate(input.value)?.value||dateValue());
    const today=dateValue(),isToday=ds===today,parsed=parseDate(ds);
    const fmt=year=>parsed?.date.toLocaleDateString([],{month:'short',day:'numeric',...(year?{year:'numeric'}:{})})||'';
    const short=isToday?'':fmt(parsed?.y!==new Date().getFullYear()),full=isToday?'Today':fmt(true),label=host.querySelector?.('.timeline-date-label');
    if(label){label.textContent=short;label.style.display=isToday?'none':'inline-block';}
    host.classList?.toggle?.('has-date-label',!isToday); host.title=`Calendar · ${full}`;
    input.setAttribute('aria-label',`Timeline date, ${full}`);
  },

  async _pickDay(ds){
    const parsed=parseDate(ds); if(!parsed)return actionMethods._pickDay.call(this,ds);
    actionMethods._pickDay.call(this,parsed.value); this._updateTimelineDateLabel(parsed.value);
    const target=Number(this._timelineFocusTs);
    if(Number.isFinite(target)&&typeof this._seekTimelineTarget==='function'){
      this._scrubTarget=target;
      try{await this._seekTimelineTarget(target);}catch(err){console.warn('[Sightline] timeline calendar seek failed',err);}
    }
  },

  _updateTimelinePlaybackTime(ts){
    const out=timelineInteractionMethods._updateTimelinePlaybackTime.call(this,ts);
    this._updateTimelineDateLabel(ts); return out;
  },

  async _refreshMicrophoneAvailability(){
    const media=navigator.mediaDevices,supported=!!(this._config?.two_way_audio&&media?.getUserMedia);
    let present=supported;
    if(supported&&media?.enumerateDevices){try{const devices=await media.enumerateDevices();if(devices?.some?.(d=>d?.kind==='audioinput'))present=true;}catch(_){present=true;}}
    const changed=this._microphonePresent!==present; this._microphonePresent=present;
    if(!present&&this._talkSpeaking)try{await this._stopTalk();}catch(_){}
    if(changed&&this.isConnected)this._renderStreamCtrl();
    return present;
  },

  _renderStreamCtrl(){
    const out=liveMethods._renderStreamCtrl.call(this),bar=this.shadowRoot?.querySelector?.('#stream-ctrl-bar');
    if(!bar)return out;
    const video=this._go2rtcLive?.video,hasAudio=!!(this._liveAudioAvailable||this._go2rtcLive?.stream?.getAudioTracks?.().length),live=!this._playing&&this.shadowRoot.querySelector('#viewer')?.style.display!=='flex';
    if(live&&this._viewMode!=='grid'&&video&&hasAudio){
      const b=document.createElement('button'); b.type='button'; b.id='sc-audio';
      b.className=`scb-btn audio-btn${this._liveAudioEnabled?' active':''}`; b.innerHTML=this._liveAudioEnabled?ICONS.volOn:ICONS.volOff;
      b.title=this._liveAudioEnabled?'Mute live audio':'Unmute live audio'; b.setAttribute('aria-label',b.title); b.setAttribute('aria-pressed',String(!!this._liveAudioEnabled));
      bar.insertBefore(b,bar.firstChild);
    }
    return out;
  },

  _zoomTimeline(factor,anchorTs,anchorRatio){
    const old=Math.max(1,Number(this._winEnd)-Number(this._winStart)),zoomIn=Number(factor||1)>=1;
    let next=zoomIn?SCALES[0]:SCALES.at(-1);
    if(zoomIn){for(let i=SCALES.length-1;i>=0;i--)if(SCALES[i]<old-1){next=SCALES[i];break;}}
    else for(const span of SCALES)if(span>old+1){next=span;break;}
    const span=Math.max(60,Math.min(86400,next)),explicit=Number.isFinite(Number(anchorTs)),ratio=Number.isFinite(Number(anchorRatio))?Math.max(0,Math.min(1,Number(anchorRatio))):.5;
    if(this._timelineFollowingLive&&!explicit){
      const now=Math.floor(Date.now()/1000); this._winStart=Math.max(0,Math.floor(now-span/2)); this._winEnd=this._winStart+span; this._timelineFocusTs=this._scrubTarget=now;
    }else{
      const anchor=explicit?Number(anchorTs):Number.isFinite(Number(this._timelineFocusTs))?Number(this._timelineFocusTs):(Number(this._winStart)+Number(this._winEnd))/2;
      let focus=anchor-(.5-ratio)*span,start=Math.floor(focus-span/2),end=start+span,now=Math.floor(Date.now()/1000);
      if(end>now){const shift=end-now;start-=shift;end-=shift;focus-=shift;}
      if(start<0){focus-=start;end-=start;start=0;}
      this._winStart=start;this._winEnd=end;this._timelineFocusTs=Math.max(start,Math.min(end,Math.round(focus)));this._scrubTarget=this._timelineFocusTs;
    }
    this._exhausted=false; this._timelineZoomMax=60; this._timelineZoom=3600/span;
    this._renderTimeline(); this._renderRange(); this._renderTimelineZoomLabel(); this._scheduleTimelineDynamicData('motion'); this._scheduleTimelineDataLoad();
  },

  _renderTimelineZoomLabel(){
    const el=this._$('#tl-zoom-level'); if(!el)return;
    const span=Math.max(1,Math.round(Number(this._winEnd)-Number(this._winStart)));
    el.textContent=SCALE_LABELS[span]||(span<3600?`${Math.max(1,Math.round(span/60))}m`:`${Math.round(span/360)/10}h`);
  },

  _wireScrub(){
    timelineInteractionMethods._wireScrub.call(this);
    const track=this.shadowRoot?.querySelector?.('#tl-track'),signal=this._scrubAbort?.signal; if(!track)return;
    let drag=null; const opts=signal?{signal}:undefined;
    const finish=(e,cancel=false)=>{
      if(!drag||(e?.pointerId!=null&&e.pointerId!==drag.id))return;
      const state=drag;drag=null;try{if(track.hasPointerCapture?.(state.id))track.releasePointerCapture(state.id);}catch(_){}
      if(!state.moved)return;
      this._timelineInteracting=false;this._scrubGestureInvalidated=false;track.classList?.remove?.('grab');this._timelineSuppressClickUntil=performance.now()+400;
      const target=this._scrubTarget??this._timelineFocusTs??this._winEnd,crossed=this._timelineLiveCrossed||this._isAtLiveEdge(target),wasLive=state.wasLive;
      this._timelineLiveCrossed=this._timelineWasLiveBeforeGesture=false;
      if(cancel)this._renderTimeline();else{crossed?this._refreshLiveFromTimeline({restart:!wasLive}):this._seekTimelineTarget(target);this._scheduleTimelineDataLoad();}
    };
    track.addEventListener('pointerdown',e=>{
      if(e.pointerType!=='mouse'||e.button!==0||this._downloadRange||!e.target?.closest?.('.t-preview,.t-ev')||e.target.closest('button,a,input,select,textarea,.tl-zoom-controls,.tl-playhead i'))return;
      drag={id:e.pointerId,x:e.clientX,y:e.clientY,start:+this._winStart,end:+this._winEnd,focus:Number.isFinite(+this._timelineFocusTs)?+this._timelineFocusTs:(+this._winStart+ +this._winEnd)/2,wasLive:this._timelineFollowingLive===true,moved:false};
      try{track.setPointerCapture?.(e.pointerId);}catch(_){}
    },opts);
    track.addEventListener('pointermove',e=>{
      if(!drag||e.pointerId!==drag.id)return;
      if(!drag.moved&&Math.hypot(e.clientX-drag.x,e.clientY-drag.y)<4)return;
      if(!drag.moved){drag.moved=true;this._timelineInteracting=true;this._timelineWasLiveBeforeGesture=drag.wasLive;this._timelineFollowingLive=this._timelineLiveCrossed=false;this._scrubGestureInvalidated=true;if(this._playing||this._activePlaybackCleanup)this._invalidatePlaybackForTimelineMove();track.classList?.add?.('grab');}
      e.preventDefault?.();e.stopPropagation?.();
      const size=Math.max(1,track.clientHeight||track.getBoundingClientRect().height||1),span=Math.max(1,drag.end-drag.start),pan=Math.round((e.clientY-drag.y)/size*span);
      let start=drag.start+pan,end=drag.end+pan,focus=drag.focus+pan; const now=Math.floor(Date.now()/1000),crossed=drag.focus<now-1&&focus>=now-1;
      if(start<0){focus-=start;end-=start;start=0;}
      this._winStart=start;this._winEnd=end;this._timelineFocusTs=Math.max(start,Math.min(end,Math.round(focus)));this._exhausted=false;
      if(crossed){this._timelineLiveCrossed=true;this._scrubTarget=now;}else this._scrubTarget=this._timelineFocusTs;
      this._updateTimelineLive();this._renderRange();this._reconcileTimelineDuringMove();this._scheduleTimelineDynamicData('motion');this._updateTimelineScrubLabel(this._scrubTarget);
    },opts);
    track.addEventListener('pointerup',e=>finish(e),opts);track.addEventListener('pointercancel',e=>finish(e,true),opts);track.addEventListener('lostpointercapture',e=>{if(drag&&e.pointerId===drag.id)finish(e);},opts);
  },

  _click(event){
    if(event?.target?.closest?.('[data-legend-label]'))return multiRecordingMethods._click.call(this,event);
    if(event?.target?.closest?.('#sc-audio')){
      event.preventDefault?.();event.stopPropagation?.();
      const video=this._go2rtcLive?.video||this._findVideo?.(this._engine); if(!video)return;
      this._liveAudioEnabled=!this._liveAudioEnabled;
      try{video.muted=!this._liveAudioEnabled;video.volume=1;if(this._liveAudioEnabled){video.setAttribute?.('playsinline','');video.play?.()?.catch?.(()=>{});}}catch(_){}
      return this._renderStreamCtrl();
    }
    if((this._timelineSuppressClickUntil||0)>performance.now()&&event?.target?.closest?.('.t-preview,.t-ev,[data-tick]')){event.preventDefault?.();event.stopPropagation?.();return;}
    return browserMethods._click.call(this,event);
  },

  _renderTimeline(...args){
    const out=multiRecordingMethods._renderTimeline.apply(this,args);this._updateTimelineDateLabel();return out;
  }
};
