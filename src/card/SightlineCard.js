import { CARD_TAG, ICONS } from '../constants.js';
import { mkCamState } from '../helpers.js';
import { applyMethodGroups } from '../utils/apply-method-groups.js';
import { coreMethods } from './core.js';
import { liveMethods } from './live.js';
import { talkMethods } from './talk.js';
import { dataMethods } from './data.js';
import { renderShellMethods } from './render-shell.js';
import { layoutMethods } from './layout.js';
import { browserMethods } from './browser.js';
import { eventPlaybackMethods } from './event-playback.js';
import { recordingPlaybackMethods } from './recording-playback.js';
import { actionMethods } from './actions.js';
import { timelineInteractionMethods } from './timeline-interaction.js';
import { timelineRenderMethods } from './timeline-render.js';
import { listMethods } from './lists.js';
import { downloadMethods } from './download.js';

export class SightlineCard extends HTMLElement {
constructor() {
    super();
    this.attachShadow({ mode:'open' });
    this._hass = null; this._config = null; this._started = false;
    this._activeCamIdx = 0; this._camCache = {}; this._viewMode = 'single'; this._eventsMode = 'camera';
    this._events = []; this._recordings = []; this._recordingsLoaded = false; this._recordingsRangeStart = null; this._recordingsRangeEnd = null; this._reviews = []; this._kept = [];
    this._tab = 'live'; this._playing = null; this._initialMediaStateApplied = false; this._playbackReturnViewMode = null;
    this._browseOpen = false; this._winEnd = 0; this._winStart = 0; this._timelineSelected = null; this._timelineFocusTs = null;
    this._loading = false; this._exhausted = false; this._daysWithActivity = new Set();
    this._filterLabel = 'all'; this._filterFace = 'all'; this._filterZone = 'all'; this._favOnly = false; this._calMonth = null;
    this._engine = null; this._unsub = null; this._rotateTimer = null; this._cardWidth = 0; this._playSeq = 0; this._playingHour = null;
    this._timelineLoadSeq = 0; this._timelineDataSeq = 0; this._timelineDynamicTimer = null; this._timelineDynamicTimerMode = ''; this._timelineDynamicActive = false; this._timelineDynamicPending = false; this._timelineDynamicLastAt = 0;
    this._recordingsLoadedAt = 0; this._timelineSeekSeq = 0; this._playbackLoadSeq = 0; this._playbackTimer = null; this._scrubAbort = null; this._scrollAbort = null; this._scrubTarget = null;
    this._timelineZoom = 6; this._timelineZoomMin = 1/24; this._timelineZoomMax = 12; this._activePlaybackCleanup = null; this._playbackSession = null;
    this._streamMuted = true; this._showReviewed = false;
    this._mediaFilter = { camera:'all', label:'all', face:'all', zone:'all', favorites:false, reviewed:'all', severity:'all', duration:'all', date:'all', timeStart:'', timeEnd:'' };
    this._mediaPickerApplyTimer = null; this._mediaPickerReleaseTimer = null; this._mediaPickerActive = false; this._mediaPickerActiveId = ''; this._mediaPickerPendingFilterRender = false; this._mediaPickerPendingGalleryRender = false;
    this._liveFsMirror = null; this._liveFsRecoverySeq = 0; this._downloadRange = null; this._recordingBrowse = []; this._domCache = {}; this._clickListenerBound = false; this._mediaImageListenerBound = false; this._livePseudoFullscreen = false;
    this._timelineThumbCache = new Map(); this._timelineEventCache = new Map(); this._timelineDataDirty = false;
    this._talkActive = false; this._talkPC = null; this._talkWS = null; this._talkMic = null; this._talkAudio = null; this._talkUsingLivePC = false; this._talkMicReadyPromise = null; this._go2rtcMountPromise = null;
    this._micDesiredMute = true; this._micForbidden = false; this._microphonePresent = null; this._micDeviceChangeHandler = null; this._micDisconnectTimer = null;
    this._go2rtcLive = null; this._rtcDebug = { answer: '', candidates: [], tracks: [], errors: [] }; this._liveAudioEnabled = false; this._liveAudioAvailable = false;
  }
static getConfigElement() { return document.createElement(CARD_TAG+'-editor'); }
static getStubConfig() { return { camera_entity:'camera.front_door' }; }
}

applyMethodGroups(SightlineCard.prototype, coreMethods, liveMethods, talkMethods, dataMethods, renderShellMethods, layoutMethods, browserMethods, eventPlaybackMethods, recordingPlaybackMethods, actionMethods, timelineInteractionMethods, timelineRenderMethods, listMethods, downloadMethods);

const baseEnterPlayback = SightlineCard.prototype._enter;
const baseShowLive = SightlineCard.prototype._showLive;
const baseRenderTimeline = SightlineCard.prototype._renderTimeline;
SightlineCard.prototype._openInGridSlot = function(id) { return this._open(id); };
SightlineCard.prototype._enter = function(...args) {
  const fromGrid=this._viewMode==='grid'; if(fromGrid && !this._playbackReturnViewMode) this._playbackReturnViewMode='grid';
  const result=baseEnterPlayback.apply(this,args);
  const feed=this.shadowRoot.querySelector('.workspace-feed'), timeline=this.shadowRoot.querySelector('.workspace-timeline'), media=this.shadowRoot.querySelector('.workspace-media'), layout=this.shadowRoot.querySelector('.layout'), engWrap=this.shadowRoot.querySelector('#eng-wrap'), grid=this.shadowRoot.querySelector('#cam-grid');
  if(fromGrid){
    if(feed){ feed.dataset.playbackGridColumn=feed.style.gridColumn||''; feed.dataset.playbackGridRow=feed.style.gridRow||''; feed.style.gridColumn='1 / -1'; feed.style.gridRow='1'; }
    if(timeline){ timeline.dataset.playbackDisplay=timeline.style.display||''; timeline.style.display='none'; }
    if(media){ media.dataset.playbackDisplay=media.style.display||''; media.style.display='none'; }
    if(layout){ layout.dataset.playbackGridTemplateColumns=layout.style.gridTemplateColumns||''; layout.dataset.playbackGridTemplateAreas=layout.style.gridTemplateAreas||''; layout.style.gridTemplateColumns='minmax(0, 1fr)'; layout.style.gridTemplateAreas='"feed"'; }
    if(engWrap){ engWrap.dataset.playbackWidth=engWrap.style.width||''; engWrap.dataset.playbackMaxWidth=engWrap.style.maxWidth||''; engWrap.style.display=''; engWrap.style.width='100%'; engWrap.style.maxWidth='none'; }
    if(grid) grid.style.display='none';
  }
  if(engWrap){
    let back=engWrap.querySelector('#playback-back-live');
    if(!back){ back=document.createElement('button'); back.type='button'; back.id='playback-back-live'; back.style.cssText='position:absolute;left:12px;top:12px;z-index:80;display:inline-flex;align-items:center;gap:7px;min-height:36px;padding:7px 11px;border:1px solid rgba(255,255,255,.24);border-radius:999px;background:rgba(16,16,18,.72);color:#fff;font:650 12px/1 -apple-system,BlinkMacSystemFont,system-ui,sans-serif;box-shadow:0 5px 18px rgba(0,0,0,.30);backdrop-filter:blur(16px) saturate(160%);-webkit-backdrop-filter:blur(16px) saturate(160%);cursor:pointer;appearance:none;-webkit-appearance:none'; engWrap.appendChild(back); }
    const label=fromGrid?'Back to Multiview':'Back to Live'; back.hidden=false; back.style.display='inline-flex'; back.innerHTML=`${ICONS.back}<span>${label}</span>`; back.title=label; back.setAttribute('aria-label',label); back.onclick=()=>this._showLive();
  }
  return result;
};
SightlineCard.prototype._showLive = function(...args) {
  const returnToGrid=this._playbackReturnViewMode==='grid'; const result=baseShowLive.apply(this,args); this._playbackReturnViewMode=null;
  const feed=this.shadowRoot.querySelector('.workspace-feed'), timeline=this.shadowRoot.querySelector('.workspace-timeline'), media=this.shadowRoot.querySelector('.workspace-media'), layout=this.shadowRoot.querySelector('.layout'), engWrap=this.shadowRoot.querySelector('#eng-wrap'), grid=this.shadowRoot.querySelector('#cam-grid'), back=this.shadowRoot.querySelector('#playback-back-live');
  if(back){ back.hidden=true; back.style.display='none'; }
  if(feed){ feed.style.gridColumn=feed.dataset.playbackGridColumn||''; feed.style.gridRow=feed.dataset.playbackGridRow||''; delete feed.dataset.playbackGridColumn; delete feed.dataset.playbackGridRow; }
  if(timeline && 'playbackDisplay' in timeline.dataset){ timeline.style.display=timeline.dataset.playbackDisplay||''; delete timeline.dataset.playbackDisplay; }
  if(media && 'playbackDisplay' in media.dataset){ media.style.display=media.dataset.playbackDisplay||''; delete media.dataset.playbackDisplay; }
  if(layout){ layout.style.gridTemplateColumns=layout.dataset.playbackGridTemplateColumns||''; layout.style.gridTemplateAreas=layout.dataset.playbackGridTemplateAreas||''; delete layout.dataset.playbackGridTemplateColumns; delete layout.dataset.playbackGridTemplateAreas; }
  if(engWrap && 'playbackWidth' in engWrap.dataset){ engWrap.style.width=engWrap.dataset.playbackWidth||''; engWrap.style.maxWidth=engWrap.dataset.playbackMaxWidth||''; delete engWrap.dataset.playbackWidth; delete engWrap.dataset.playbackMaxWidth; }
  if(returnToGrid){ if(engWrap) engWrap.style.display='none'; if(grid) grid.style.display=''; this._eventsMode='all'; this._mountGrid(); this._renderCamSwitcher(); }
  this._syncResponsiveWorkspace(); return result;
};
SightlineCard.prototype._renderTimeline = function(...args) {
  const result=baseRenderTimeline.apply(this,args); const h=Math.max(48,Math.min(140,Math.round(Number(this._config?.timeline?.thumbnail_size ?? 84)))), w=Math.max(154,Math.min(420,Math.round(h*3.15)));
  for(const preview of this.shadowRoot?.querySelectorAll?.('.t-preview')||[]){ preview.style.setProperty('height',`${h}px`,'important'); preview.style.setProperty('width',`min(${w}px, calc(100% - var(--tl-content) - 10px))`,'important'); preview.style.setProperty('max-width',`${w}px`,'important'); }
  return result;
};
