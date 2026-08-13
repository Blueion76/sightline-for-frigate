import { CARD_TAG } from '../constants.js';
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
    this._activeCamIdx = 0;
    this._camCache = {};
    this._viewMode = 'single';
    this._eventsMode = 'camera';
    this._events = []; this._recordings = []; this._recordingsLoaded = false; this._recordingsRangeStart = null; this._recordingsRangeEnd = null; this._reviews = []; this._kept = [];
    this._tab = 'live'; this._playing = null;
    this._initialMediaStateApplied = false;
    this._playbackReturnViewMode = null;
    this._browseOpen = false;
    this._winEnd = 0; this._winStart = 0;
    this._timelineSelected = null;
    this._timelineFocusTs = null;
    this._loading = false; this._exhausted = false;
    this._daysWithActivity = new Set();
    this._filterLabel = 'all'; this._filterFace = 'all'; this._filterZone = 'all'; this._favOnly = false;
    this._calMonth = null;
    this._engine = null; this._unsub = null;
    this._rotateTimer = null; this._cardWidth = 0;
    this._playSeq = 0;
    this._playingHour = null;
    this._timelineLoadSeq = 0;
    this._timelineDataSeq = 0;
    this._timelineDynamicTimer = null;
    this._timelineDynamicTimerMode = '';
    this._timelineDynamicActive = false;
    this._timelineDynamicPending = false;
    this._timelineDynamicLastAt = 0;
    this._recordingsLoadedAt = 0;
    this._timelineSeekSeq = 0;
    this._playbackLoadSeq = 0;
    this._playbackTimer = null;
    this._scrubAbort = null;
    this._scrollAbort = null;
    this._scrubTarget = null;
    this._timelineZoom = 6;
    this._timelineZoomMin = 1/24;
    this._timelineZoomMax = 12;
    this._activePlaybackCleanup = null;
    this._playbackSession = null;
    this._streamMuted = true;
    this._showReviewed = false;
    this._mediaFilter = { camera:'all', label:'all', face:'all', zone:'all', favorites:false, reviewed:'all', severity:'all', duration:'all', date:'all', timeStart:'', timeEnd:'' };
    this._mediaPickerApplyTimer = null;
    this._mediaPickerReleaseTimer = null;
    this._mediaPickerActive = false;
    this._mediaPickerActiveId = '';
    this._mediaPickerPendingFilterRender = false;
    this._mediaPickerPendingGalleryRender = false;
    this._liveFsMirror = null;
    this._liveFsRecoverySeq = 0;
    this._downloadRange = null;
    this._recordingBrowse = [];
    this._domCache = {};
    this._clickListenerBound = false;
    this._mediaImageListenerBound = false;
    this._livePseudoFullscreen = false;
    this._timelineThumbCache = new Map();
    this._timelineEventCache = new Map();
    this._timelineDataDirty = false;
    this._talkActive = false;
    this._talkPC = null; this._talkWS = null; this._talkMic = null; this._talkAudio = null; this._talkUsingLivePC = false;
    this._talkMicReadyPromise = null;
    this._go2rtcMountPromise = null;
    this._micDesiredMute = true;
    this._micForbidden = false;
    this._microphonePresent = null;
    this._micDeviceChangeHandler = null;
    this._micDisconnectTimer = null;
    this._go2rtcLive = null;
    this._rtcDebug = { answer: '', candidates: [], tracks: [], errors: [] };
    this._liveAudioEnabled = false;
    this._liveAudioAvailable = false;
  }

static getConfigElement() { return document.createElement(CARD_TAG+'-editor'); }
static getStubConfig() { return { camera_entity:'camera.front_door' }; }
}

applyMethodGroups(SightlineCard.prototype,
  coreMethods,
  liveMethods,
  talkMethods,
  dataMethods,
  renderShellMethods,
  layoutMethods,
  browserMethods,
  eventPlaybackMethods,
  recordingPlaybackMethods,
  actionMethods,
  timelineInteractionMethods,
  timelineRenderMethods,
  listMethods,
  downloadMethods
);
