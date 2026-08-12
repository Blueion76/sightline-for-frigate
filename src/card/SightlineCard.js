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
    this._camCache = {};     // entity → mkCamState()
    this._viewMode = 'single';   // 'single' | 'grid'
    this._eventsMode = 'camera'; // 'camera' | 'all'
    // active display data
    this._events = []; this._recordings = []; this._recordingsLoaded = false; this._recordingsRangeStart = null; this._recordingsRangeEnd = null; this._reviews = []; this._kept = [];
    // UI
    this._tab = 'live'; this._playing = null;
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
    // Moving-window data follow. Unlike _timelineDataTimer (settled debounce),
    // this is a throttle: it keeps fetching newly exposed timeline ranges while
    // a gesture is still in progress and periodically refreshes the LIVE tail.
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
    this._timelineZoom = 6; // 6 = 10 minutes; higher = more zoomed in
    this._timelineZoomMin = 1/24; // 24 hour view
    this._timelineZoomMax = 12;   // 5 minute view
    this._activePlaybackCleanup = null;
    // Stable media session: keep one player alive while seeking within the
    // same source. This mirrors Advanced Camera Card's separation between
    // media state and view/timeline state, preventing player teardown/recreate
    // churn during scrubbing.
    this._playbackSession = null;
    this._streamMuted = true; // start muted so autoplay is allowed; user gesture/audio button can unmute
    this._showReviewed = false; // reviews: hide reviewed by default
    this._mediaFilter = { camera:'all', label:'all', face:'all', zone:'all', favorites:false, reviewed:'all', severity:'all', duration:'all', date:'all', timeStart:'', timeEnd:'' };
    // Native date/time pickers (especially iOS/WebKit) are presented outside
    // normal page layout but remain anchored to the original <input> node. Any
    // background gallery/filter/layout mutation can dismiss the system picker.
    // Keep a sticky interaction lock and freeze the gallery DOM while a picker
    // owns the screen; Clips/Recordings refresh asynchronously far more often
    // than Reviews, so preserving only the input node is not sufficient on iOS.
    this._mediaPickerApplyTimer = null;
    this._mediaPickerReleaseTimer = null;
    this._mediaPickerActive = false;
    this._mediaPickerActiveId = '';
    this._mediaPickerPendingFilterRender = false;
    this._mediaPickerPendingGalleryRender = false;
    this._liveFsMirror = null;
    this._liveFsRecoverySeq = 0;
    // Timeline download trim mode. Start/end are absolute Frigate timestamps;
    // the picker itself is rendered inside the timeline so it follows zoom and
    // uses exactly the same timestamp mapping as normal scrubbing.
    this._downloadRange = null;
    this._recordingBrowse = []; // hourly recording summary used by the Recordings browser
    this._domCache = {}; // querySelector result cache — cleared on re-render
    this._clickListenerBound = false;
    this._mediaImageListenerBound = false;
    this._livePseudoFullscreen = false;
    this._timelineThumbCache = new Map(); // event id -> stable thumbnail URL
    this._timelineEventCache = new Map(); // event id -> latest Frigate event payload
    this._timelineDataDirty = false;
    // two-way audio (talk) state
    this._talkActive = false;
    this._talkPC = null; this._talkWS = null; this._talkMic = null; this._talkAudio = null; this._talkUsingLivePC = false;
    this._talkMicReadyPromise = null;
    this._go2rtcMountPromise = null;
    // ACC-style microphone lifecycle: desired mute is separate from stream existence.
    this._micDesiredMute = true;
    this._micForbidden = false;
    // `null` means device detection has not completed yet. The Talk button is
    // deliberately hidden until an actual audioinput device is enumerated.
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
