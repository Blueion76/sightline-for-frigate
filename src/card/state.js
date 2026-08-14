/**
 * Initialize all mutable card state in one place.
 *
 * The card composes behavior from several focused method groups. Keeping their
 * shared state here makes lifecycle expectations explicit and prevents feature
 * modules from silently inventing constructor-only fields.
 */
export function initializeCardState(card) {
  // Home Assistant / configuration lifecycle.
  card._hass = null;
  card._config = null;
  card._started = false;
  card._unsub = null;

  // Camera selection and per-camera caches.
  card._activeCamIdx = 0;
  card._camCache = {};
  card._viewMode = 'single';
  card._eventsMode = 'camera';
  card._cardWidth = 0;
  card._rotateTimer = null;

  // Frigate data currently displayed by the active camera/view.
  card._events = [];
  card._recordings = [];
  card._recordingsLoaded = false;
  card._recordingsRangeStart = null;
  card._recordingsRangeEnd = null;
  card._recordingsLoadedAt = 0;
  card._reviews = [];
  card._kept = [];
  card._recordingBrowse = [];
  card._loading = false;
  card._exhausted = false;
  card._daysWithActivity = new Set();

  // Primary view / media-browser state.
  card._tab = 'live';
  card._browseOpen = false;
  card._showReviewed = false;
  card._initialMediaStateApplied = false;
  card._playbackReturnViewMode = null;
  card._filterLabel = 'all';
  card._filterFace = 'all';
  card._filterZone = 'all';
  card._favOnly = false;
  card._calMonth = null;
  card._mediaFilter = {
    camera: 'all',
    label: 'all',
    face: 'all',
    zone: 'all',
    favorites: false,
    reviewed: 'all',
    severity: 'all',
    duration: 'all',
    date: 'all',
    timeStart: '',
    timeEnd: '',
  };
  card._mediaPickerApplyTimer = null;
  card._mediaPickerReleaseTimer = null;
  card._mediaPickerActive = false;
  card._mediaPickerActiveId = '';
  card._mediaPickerPendingFilterRender = false;
  card._mediaPickerPendingGalleryRender = false;

  // Timeline viewport, caches, interaction and request generations.
  card._winStart = 0;
  card._winEnd = 0;
  card._timelineSelected = null;
  card._timelineFocusTs = null;
  card._scrubTarget = null;
  card._timelineZoom = 6;
  card._timelineZoomMin = 1 / 24;
  card._timelineZoomMax = 12;
  card._timelineLoadSeq = 0;
  card._timelineDataSeq = 0;
  card._timelineSeekSeq = 0;
  card._timelineDynamicTimer = null;
  card._timelineDynamicTimerMode = '';
  card._timelineDynamicActive = false;
  card._timelineDynamicPending = false;
  card._timelineDynamicLastAt = 0;
  card._timelineThumbCache = new Map();
  card._timelineEventCache = new Map();
  card._timelineDataDirty = false;
  card._scrubAbort = null;
  card._scrollAbort = null;

  // Recorded/event playback lifecycle.
  card._playing = null;
  card._playingHour = null;
  card._playSeq = 0;
  card._playbackLoadSeq = 0;
  card._playbackTimer = null;
  card._activePlaybackCleanup = null;
  card._playbackSession = null;
  card._downloadRange = null;

  // Live video / fullscreen state.
  card._engine = null;
  card._streamMuted = true;
  card._go2rtcMountPromise = null;
  card._go2rtcLive = null;
  card._liveAudioEnabled = false;
  card._liveAudioAvailable = false;
  card._liveFsMirror = null;
  card._liveFsRecoverySeq = 0;
  card._livePseudoFullscreen = false;
  card._rtcDebug = { answer: '', candidates: [], tracks: [], errors: [] };

  // Two-way audio / microphone state.
  card._talkActive = false;
  card._talkPC = null;
  card._talkWS = null;
  card._talkMic = null;
  card._talkAudio = null;
  card._talkUsingLivePC = false;
  card._talkMicReadyPromise = null;
  card._micDesiredMute = true;
  card._micForbidden = false;
  card._microphonePresent = null;
  card._micDeviceChangeHandler = null;
  card._micDisconnectTimer = null;

  // DOM/event bookkeeping.
  card._domCache = {};
  card._clickListenerBound = false;
  card._mediaImageListenerBound = false;
}
