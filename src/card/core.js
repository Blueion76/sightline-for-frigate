/**
 * Home Assistant lifecycle, normalized configuration and shared card-level utilities.
 */
import { VERSION, CARD_TAG, DAY, DEFAULT_ROTATE_S, ICONS, LABEL_COLORS, PALETTE, TIMELINE_GLYPHS, CAM_COLORS } from '../constants.js';
import { cap, parseWs, labelColor, timelineGlyph, mkCamState, camDisplayName } from '../helpers.js';
import { STYLES } from '../styles.js';

export const coreMethods = {
setConfig(config) {
    config = (config && typeof config === 'object') ? config : {};
    let cameras = [];
    const rootGo2rtc = (config.go2rtc && typeof config.go2rtc === 'object') ? config.go2rtc : {};
    if (Array.isArray(config.cameras)) {
      cameras = config.cameras.map(c => {
        if (typeof c === 'string') return { entity:c, name:null, frigate_client_id:null, go2rtc_stream:null };
        const g = (c?.go2rtc && typeof c.go2rtc === 'object') ? c.go2rtc : {};
        return { entity:c?.entity || c?.camera_entity || c?.camera || '', name:c?.name||null, frigate_client_id:c?.frigate_client_id || g.frigate_client_id || null, go2rtc_stream:c?.go2rtc_stream || g.stream || null };
      }).filter(c => c.entity);
    }
    const singleEntity = config.camera_entity || config.entity || config.camera;
    if (!cameras.length && singleEntity) cameras = [{ entity:singleEntity, name:config.title||null, frigate_client_id:config.frigate_client_id || rootGo2rtc.frigate_client_id || null, go2rtc_stream:config.go2rtc_stream || rootGo2rtc.stream || null }];
    this._configError = cameras.length ? null : 'Select a Frigate camera entity.';
    if (!cameras.length) cameras = [{ entity:'', name:null, go2rtc_stream:null, frigate_client_id:null }];
    if (cameras.length > 4) cameras = cameras.slice(0, 4);

    const timelineIn = (config.timeline && typeof config.timeline === 'object') ? config.timeline : {};
    const downloadIn = (config.download && typeof config.download === 'object') ? config.download : {};
    const mediaIn = (config.media && typeof config.media === 'object') ? config.media : {};
    const num = (v, fallback, lo, hi) => { const n=Number(v); return Number.isFinite(n) ? Math.max(lo,Math.min(hi,n)) : fallback; };
    const timeline = {
      enabled: timelineIn.enabled !== false,
      default_minutes: num(timelineIn.default_minutes,10,5,60),
      show_thumbnails: timelineIn.show_thumbnails !== false,
      show_glyphs: timelineIn.show_glyphs !== false,
      show_legend: timelineIn.show_legend !== false,
      show_zoom_controls: timelineIn.show_zoom_controls !== false,
      show_filter_button: timelineIn.show_filter_button !== false,
      show_calendar_button: timelineIn.show_calendar_button !== false,
      clustering: timelineIn.clustering !== false,
      same_label_cluster_seconds: num(timelineIn.same_label_cluster_seconds,12,0,120),
      visual_cluster_max_seconds: num(timelineIn.visual_cluster_max_seconds,60,0,300),
      glyph_min_px: num(timelineIn.glyph_min_px,20,12,40),
      glyph_max_px: num(timelineIn.glyph_max_px,30,12,48),
      max_glyphs: Math.round(num(timelineIn.max_glyphs,3,1,6)),
      max_thumbnails: Math.round(num(timelineIn.max_thumbnails,12,0,24)),
      thumbnail_size: Math.round(num(timelineIn.thumbnail_size,84,48,140)),
    };
    if(timeline.glyph_max_px<timeline.glyph_min_px) timeline.glyph_max_px=timeline.glyph_min_px;
    const downloadMaxMinutes=num(downloadIn.max_range_minutes,120,1,720);
    const download = { default_range_seconds: Math.min(Math.round(downloadMaxMinutes*60),Math.round(num(downloadIn.default_range_seconds,60,2,1800))), max_range_minutes: downloadMaxMinutes };
    const reviewedDefault=['all','unreviewed','reviewed'].includes(mediaIn.reviewed_default) ? mediaIn.reviewed_default : 'all';
    const media = { reviewed_default: reviewedDefault };
    const rawAspect=config.aspect_ratio==null || String(config.aspect_ratio).trim()==='' ? 'auto' : String(config.aspect_ratio).trim();
    const aspectValid = rawAspect==='auto' || /^(\d+(?:\.\d+)?)\s*[:/]\s*(\d+(?:\.\d+)?)$/.test(rawAspect) || (Number.isFinite(Number(rawAspect)) && Number(rawAspect)>0);
    const streamHeightNum=Number(config.stream_height);
    const hiddenTabs = Array.isArray(config.hidden_tabs) ? config.hidden_tabs.filter(x=>['clips','recordings','reviews'].includes(String(x))) : [];
    const requestedDefaultTab = ['live','clips','recordings','reviews'].includes(String(config.default_tab||'')) ? String(config.default_tab) : 'live';
    const defaultTab = requestedDefaultTab !== 'live' && hiddenTabs.includes(requestedDefaultTab) ? 'live' : requestedDefaultTab;

    this._config = {
      cameras,
      window_hours: Math.max(1,Math.min(720,Number(config.window_hours)||24)),
      refresh_seconds: Math.max(15,Math.min(3600,Number(config.refresh_seconds)||45)),
      rotate_seconds: num(config.rotate_seconds,0,0,3600),
      rotate_on_load: config.rotate_on_load === true && cameras.length > 1,
      default_view: (config.default_view === 'grid' && cameras.length > 1) ? 'grid' : 'single',
      hidden_tabs: hiddenTabs,
      default_tab: defaultTab,
      autoplay_latest_clip: config.autoplay_latest_clip === true,
      stream_height: Number.isFinite(streamHeightNum) && streamHeightNum>0 ? Math.max(20,Math.min(100,streamHeightNum)) : null,
      stream_type: config.stream_type === 'hls' ? 'hls' : 'webrtc',
      aspect_ratio: aspectValid ? rawAspect : 'auto',
      stream_resizable: config.stream_resizable === true,
      theme: ['light','dark','auto'].includes(config.theme) ? config.theme : 'dark',
      accent_color: config.accent_color || null,
      bg_color: config.bg_color || null,
      transparency: num(config.transparency ?? config.card_transparency ?? config.background_transparency,0,0,100),
      timeline,
      download,
      media,
      frigate_client_id: config.frigate_client_id || rootGo2rtc.frigate_client_id || cameras.find(c => c.frigate_client_id)?.frigate_client_id || null,
      two_way_audio: config.two_way_audio === true,
      two_way_audio_disconnect_seconds: Number.isFinite(Number(config.two_way_audio_disconnect_seconds)) ? Math.max(0, Number(config.two_way_audio_disconnect_seconds)) : 90,
    };
    this._browseOpen = false;
    this._showReviewed = this._config.media.reviewed_default !== 'unreviewed';
    if(this._mediaFilter) this._mediaFilter.reviewed=this._config.media.reviewed_default;
    if (this._galleryMode && this._config.hidden_tabs.includes(this._galleryMode)) { this._galleryMode=''; this._tab='live'; }
    for (const c of cameras) { if (!this._camCache[c.entity]) this._camCache[c.entity] = mkCamState(); }
    this._renderShell();
    this._setupMicrophoneDetection();
  },

set hass(hass) {
    this._hass = hass;
    if (!this._config) return;
    if (!this._started) { this._started = true; this._start(); return; }
    if (this._engine) {
      try { this._engine.hass = hass; } catch(_) {}
      const ent = this._activeCam?.entity;
      const newState = hass.states[ent]?.state;
      if (ent && newState !== this._lastEngineState) {
        this._lastEngineState = newState;
        if ('stateObj' in this._engine) { try { this._engine.stateObj = this._streamStateObj(ent); } catch(_) {} }
      }
    }
    if(!(this._mediaPickerActive && this._galleryMode)) {
      this._syncStatus();
      if (this._config.theme === 'auto') this._applyCardStyle();
    }
  },

get _activeCam() { return this._config?.cameras[this._activeCamIdx] || this._config?.cameras[0]; },

async _applyInitialMediaState() {
    if(this._initialMediaStateApplied) return;
    this._initialMediaStateApplied=true;
    const tab=this._config?.default_tab||'live';
    if(tab==='live') return;
    await this._setGalleryMode(tab);
    if(tab!=='clips' || !this._config?.autoplay_latest_clip || this._galleryMode!=='clips') return;
    const source=this._eventsMode==='all'?this._allDisplayEvents():this._events;
    const latest=this._filterMediaEvents(source).filter(ev=>ev?.has_clip).sort((a,b)=>Number(b.start_time||0)-Number(a.start_time||0))[0];
    if(latest) await this._showClip(latest);
  },

_isEditorPreview() {
    let node=this;
    const editorTags=new Set(['hui-card-preview','hui-dialog-edit-card','hui-card-element-editor','hui-card-editor','hui-dialog-edit-card']);
    for(let i=0;i<14 && node;i++){
      const tag=String(node.tagName||'').toLowerCase();
      if(editorTags.has(tag)) return true;
      const cls=String(node.className||'');
      if(/(^|\s)(card-preview|preview-card|edit-card-preview)(\s|$)/i.test(cls)) return true;
      if(node.parentElement){ node=node.parentElement; continue; }
      const root=node.getRootNode?.();
      node=(root && root.host && root.host!==node) ? root.host : null;
    }
    return false;
  },

getCardSize() { return 10; },
getGridSize() { return { columns: 2, rows: 3 }; },

disconnectedCallback() {
    this._stopRotate(); this._cancelActivePlayback(); this._stopTalk();
    if (this._refresh) clearInterval(this._refresh);
    if (this._timelineClockTimer) clearInterval(this._timelineClockTimer);
    clearTimeout(this._timelineDataTimer); clearTimeout(this._timelineDynamicTimer); this._timelineDynamicTimer=null; this._timelineDynamicPending=false;
    clearTimeout(this._wt); clearTimeout(this._mediaPickerApplyTimer); clearTimeout(this._mediaPickerReleaseTimer);
    this._mediaPickerActive=false; this._mediaPickerActiveId=''; this._mediaPickerPendingFilterRender=false; this._removeLiveFsMirror();
    if (this._scrubAbort) { try { this._scrubAbort.abort(); } catch(_) {} this._scrubAbort=null; }
    if (this._scrollAbort) { try { this._scrollAbort.abort(); } catch(_) {} this._scrollAbort=null; }
    ++this._timelineLoadSeq; ++this._timelineDataSeq; ++this._timelineSeekSeq;
    if (this._unsub) { try { this._unsub.then(u=>u&&u()); } catch(_) {} this._unsub=null; }
    if (this._timelineResizeRaf) cancelAnimationFrame(this._timelineResizeRaf); this._timelineResizeRaf=0;
    if (this._ro) this._ro.disconnect();
    if (this._micDeviceChangeHandler && navigator.mediaDevices?.removeEventListener) { try { navigator.mediaDevices.removeEventListener('devicechange', this._micDeviceChangeHandler); } catch (_) {} }
    this._micDeviceChangeHandler=null;
  },

async _start() {
    if (this._configError || !this._activeCam?.entity) { this._renderAll(); return; }
    await this._discoverAll();
    this._setupMicrophoneDetection();
    this._loadFrigateFilterMetadata();
    const now = Math.floor(Date.now()/1000);
    this._timelineFocusTs = now;
    const initialTimelineSpan=this._timelineDefaultSpanSeconds();
    this._winStart = now - initialTimelineSpan/2; this._winEnd = now + initialTimelineSpan/2; this._timelineZoom = 3600/initialTimelineSpan;
    this._timelineFollowingLive = true; this._timelineWasLiveBeforeGesture = false; this._timelineLiveCrossed = false;
    if (this._config.default_view === 'grid' && this._config.cameras.length > 1) this._setViewMode('grid');
    await this._mountEngine();
    await this._loadWindow(true, true);
    await this._applyInitialMediaState();
    this._loadCalendar(); this._subscribe();
    this._refresh = setInterval(() => { if (this._isNowWindow()) this._loadWindow(true); this._loadFrigateFilterMetadata(); }, this._config.refresh_seconds*1000);
    if (this._timelineClockTimer) clearInterval(this._timelineClockTimer);
    this._timelineClockTimer = setInterval(() => {
      if (!this.isConnected || this._galleryMode || this._timelineInteracting) return;
      this._updateTimelineLive();
      if (this._timelineFollowingLive) this._scheduleTimelineDynamicData('live');
    }, 1000);
    if (this._config.rotate_on_load === true && this._config.cameras.length > 1) this._startRotate();
    this._setupResizeObserver(); this._stabilizeInitialTimeline();
  }
};
