import { VERSION, CARD_TAG, DAY, DEFAULT_ROTATE_S, ICONS, LABEL_COLORS, PALETTE, TIMELINE_GLYPHS, CAM_COLORS } from '../constants.js';
import { cap, parseWs, labelColor, timelineGlyph, mkCamState, camDisplayName } from '../helpers.js';
import { STYLES } from '../styles.js';

// Visual editor behavior.
export const editorMethods = {
setConfig(c) { this._config=c; this._render(); },

set hass(h) {
    this._hass = h;
    // Registry ownership is the authoritative way to decide whether a camera
    // belongs to the Frigate HA integration. State attributes are only a
    // backwards-compatible fallback while the registry request is pending or
    // unavailable on an older HA frontend.
    this._ensureFrigateEntityRegistry();

    // Only re-render when the camera entity list actually changes — prevents
    // a normal HA state update from closing an open editor control.
    const dark = h?.themes?.darkMode ?? window.matchMedia?.('(prefers-color-scheme: dark)')?.matches ?? false;
    const key = `${this._frigateEntities().join(',')}|registry:${this._frigateRegistryLoaded?'1':'0'}|dark:${dark}`;
    if (key !== this._lastEntityKey) { this._lastEntityKey = key; this._render(); }
  },

async _ensureFrigateEntityRegistry() {
    const hass=this._hass;
    if(!hass?.callWS) return;
    const connection=hass.connection||hass;
    const now=Date.now();
    // Refresh periodically so adding/removing a Frigate camera while the card
    // editor is open is picked up, without querying HA on every state update.
    if(this._frigateRegistryLoading) return;
    if(this._frigateRegistryConnection===connection && this._frigateRegistryLoaded && (now-(this._frigateRegistryFetchedAt||0))<30000) return;

    this._frigateRegistryLoading=true;
    this._frigateRegistryConnection=connection;
    try {
      const entries=await hass.callWS({type:'config/entity_registry/list'});
      if(this._hass!==hass) return;
      this._frigateRegistryEntities=(Array.isArray(entries)?entries:[])
        .filter(entry =>
          String(entry?.entity_id||'').startsWith('camera.') &&
          String(entry?.platform||'').toLowerCase()==='frigate' &&
          !entry?.disabled_by
        )
        .map(entry => String(entry.entity_id))
        .sort((a,b)=>a.localeCompare(b));
      this._frigateRegistryLoaded=true;
      this._frigateRegistryFetchedAt=Date.now();
    } catch(err) {
      // Older/restricted HA sessions may reject registry access. In that case
      // keep the editor usable with the Frigate-specific state fallback below.
      this._frigateRegistryLoaded=false;
      this._frigateRegistryEntities=[];
      this._frigateRegistryFetchedAt=Date.now();
    } finally {
      this._frigateRegistryLoading=false;
      if(this._hass===hass){
        const dark=hass?.themes?.darkMode ?? window.matchMedia?.('(prefers-color-scheme: dark)')?.matches ?? false;
        const key=`${this._frigateEntities().join(',')}|registry:${this._frigateRegistryLoaded?'1':'0'}|dark:${dark}`;
        if(key!==this._lastEntityKey){this._lastEntityKey=key;this._render();}
      }
    }
  },

_configuredEntityIds() {
    const cfg=this._config||{};
    const cams=Array.isArray(cfg.cameras)?cfg.cameras:[];
    const ids=cams.map(c=>typeof c==='string'?c:(c?.entity||c?.camera_entity||c?.camera||''));
    if(cfg.camera_entity||cfg.entity||cfg.camera) ids.push(cfg.camera_entity||cfg.entity||cfg.camera);
    return [...new Set(ids.filter(id=>String(id).startsWith('camera.')).map(String))];
  },

_frigateEntities() {
    if (!this._hass) return this._configuredEntityIds();

    let entities=[];
    if(this._frigateRegistryLoaded){
      // Exact integration filter: only camera entities owned by the Frigate
      // entity platform. This includes entities such as Birdseye that do not
      // expose the normal camera_name/client_id state attributes.
      entities=[...(this._frigateRegistryEntities||[])];
    } else {
      // Fallback for HA versions/sessions where registry access is unavailable.
      // Frigate's camera platform uses device_class="camera" specifically so
      // selectors can distinguish these from ordinary camera entities.
      entities=Object.keys(this._hass.states)
        .filter(e=>e.startsWith('camera.'))
        .filter(e=>{
          const a=this._hass.states[e]?.attributes||{};
          return a.client_id || a.mqtt_client_id || a.camera_name || a.device_class==='camera';
        });
    }

    // Never make an already-saved selection vanish from the editor merely
    // because it is temporarily unavailable/disabled or registry data changed.
    // New selections remain strictly Frigate-filtered.
    entities.push(...this._configuredEntityIds());
    return [...new Set(entities)].sort((a,b)=>a.localeCompare(b));
  },

_entityOptionLabel(entityId) {
    const state=this._hass?.states?.[entityId];
    let name='';
    try {
      if(state && typeof this._hass?.formatEntityName==='function') name=this._hass.formatEntityName(state);
    } catch(_err) {}
    name=name || state?.attributes?.friendly_name || entityId;
    return name===entityId ? entityId : `${name} — ${entityId}`;
  },

_render() {
    // The selector is intentionally Frigate-only. Do not fall back to every
    // camera entity simply because registry discovery returned an empty list.
    const entityList = this._frigateEntities();

    const cams = this._config?.cameras
      ? this._config.cameras
      : (this._config?.camera_entity ? [{ entity: this._config.camera_entity, name: this._config?.title || '' }] : [{ entity: '', name: '' }]);

    const esc=(v)=>String(v??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    const opts = (sel) => entityList.map(e => `<option value="${esc(e)}" ${e===sel?'selected':''}>${esc(this._entityOptionLabel(e))}</option>`).join('');

    const camRows = cams.map((c,i) => `
      <div class="cam-block" data-row="${i}">
        <div class="cr">
          <select name="cam-entity-${i}" class="ce" data-cam-entity="${i}">
            <option value="">— select camera —</option>
            ${opts(c.entity||'')}
          </select>
          <input type="text" name="cam-name-${i}" class="cn" data-cam-name="${i}" placeholder="Display name (optional)" value="${c.name||''}">
          ${cams.length > 1 ? `<button class="xb" data-remove-cam="${i}" title="Remove">✕</button>` : ''}
        </div>
        <div class="cam-advanced">
          <input type="text" class="tf" data-cam-client="${i}" placeholder="Frigate instance/client ID (optional)" value="${c.frigate_client_id||''}">
          <input type="text" class="tf" data-cam-stream="${i}" placeholder="go2rtc stream name (optional)" value="${c.go2rtc_stream||''}">
        </div>
      </div>`).join('');

    const hiddenTabs = new Set(this._config?.hidden_tabs || []);
    const tabCheck = (id, label) => `<label class="chk-lbl">
      <input type="checkbox" name="hide-${id}" data-hide-tab="${id}" ${hiddenTabs.has(id)?'checked':''}> ${label}
    </label>`;

    const defaultView = this._config?.default_view || 'single';
    const rotateOnLoad = this._config?.rotate_on_load === true;
    const tl=this._config?.timeline||{};
    const dl=this._config?.download||{};
    const med=this._config?.media||{};
    const usableCamCount = cams.filter(c=>c?.entity).length;
    const multiCam = usableCamCount > 1;
    const editorDark = this._hass?.themes?.darkMode ?? window.matchMedia?.('(prefers-color-scheme: dark)')?.matches ?? false;

    this.innerHTML = `<style>
      .ed-wrap{
        --ed-bg:#fbfbfd;--ed-panel:#ffffff;--ed-panel2:#f4f4f7;--ed-text:#1f2937;--ed-muted:#667085;
        --ed-border:#d8dbe2;--ed-accent:#2563eb;
        display:flex;flex-direction:column;gap:14px;padding:14px;border-radius:14px;
        font-family:-apple-system,BlinkMacSystemFont,"SF Pro Text",system-ui,sans-serif;
        background:var(--ed-bg)!important;color:var(--ed-text)!important;border:1px solid var(--ed-border)!important;
        box-shadow:0 1px 2px rgba(0,0,0,.08);
      }
      .ed-wrap.dark{--ed-bg:#17171a;--ed-panel:#222226;--ed-panel2:#2b2b30;--ed-text:#f5f5f7;--ed-muted:#b4b4bd;--ed-border:#3a3a40;--ed-accent:#64a7ff;}
      .field-label{font-size:12px;font-weight:650;margin-bottom:4px;display:block;color:var(--ed-text);}
      .section{border-top:1px solid var(--ed-border);padding-top:12px;}
      .cam-block{padding:8px;border:1px solid var(--ed-border);border-radius:9px;margin-bottom:8px;background:var(--ed-panel2)!important;}
      .cr{display:flex;gap:5px;align-items:center;margin-bottom:6px;}
      .cam-advanced{display:grid;grid-template-columns:1fr 1fr;gap:6px;}
      .adv-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px 10px;margin-top:8px;}
      .adv-grid .full{grid-column:1/-1;}
      .mini-help{display:block;color:var(--ed-muted);font-size:10px;margin-top:3px;line-height:1.35;}
      details.config-group{border-top:1px solid var(--ed-border);padding-top:10px;}
      details.config-group summary{cursor:pointer;font-size:12px;font-weight:700;color:var(--ed-text);user-select:none;}
      details.config-group[open] summary{margin-bottom:9px;}
      @media(max-width:520px){.adv-grid,.cam-advanced{grid-template-columns:1fr;}}
      .ce,.cn{flex:1;padding:7px;border:1px solid var(--ed-border);border-radius:6px;font-size:12px;box-sizing:border-box;background:var(--ed-panel)!important;color:var(--ed-text)!important;}
      .ce{min-width:0;} .cn{min-width:0;}
      .xb{padding:5px 8px;border:1px solid #f87171;background:#fee2e2;color:#b91c1c;border-radius:6px;cursor:pointer;font-size:12px;flex-shrink:0;}
      .add-btn{padding:6px 12px;border:1px solid color-mix(in srgb,var(--ed-accent) 55%,transparent);background:color-mix(in srgb,var(--ed-accent) 12%,var(--ed-panel));color:var(--ed-accent);border-radius:7px;cursor:pointer;font-size:12px;margin-top:2px;}
      .tf{width:100%;padding:7px;border:1px solid var(--ed-border);border-radius:6px;font-size:12px;box-sizing:border-box;background:var(--ed-panel)!important;color:var(--ed-text)!important;}
      .range{width:100%;margin:8px 0 2px;accent-color:var(--ed-accent);cursor:pointer;}
      .range-value{min-width:42px;padding:3px 7px;border:1px solid var(--ed-border);border-radius:999px;background:var(--ed-panel2);color:var(--ed-text);font-size:11px;font-weight:700;text-align:center;font-variant-numeric:tabular-nums;}
      .radio-row,.chk-row{display:flex;gap:14px;flex-wrap:wrap;}
      .radio-lbl,.chk-lbl{display:flex;align-items:center;gap:5px;font-size:12px;cursor:pointer;color:var(--ed-text);}
      .ed-wrap small,.ed-wrap [style*="color:#6b7280"]{color:var(--ed-muted)!important;}
      .ed-wrap input::placeholder{color:var(--ed-muted);opacity:.85;}
      .ed-wrap select,.ed-wrap input{color-scheme:light;}
      .ed-wrap.dark select,.ed-wrap.dark input{color-scheme:dark;}
      .ed-wrap .ce,.ed-wrap .cn,.ed-wrap .tf{background:var(--ed-panel)!important;color:var(--ed-text)!important;border-color:var(--ed-border)!important;}
      .ed-wrap details.config-group,.ed-wrap .section{color:var(--ed-text)!important;}
      .ed-wrap input:disabled,.ed-wrap select:disabled{opacity:.48;cursor:not-allowed;}
      .chk-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:4px;}
    
</style>
    <div class="ed-wrap ${editorDark?'dark':''}">
      <div>
        <span class="field-label">Cameras (up to 4) ${entityList.length ? '<small style="font-weight:400;color:var(--ed-muted)">· Frigate cameras detected</small>' : ''}</span>
        <div id="cam-list">${camRows}</div>
        ${cams.length < 4 ? `<button class="add-btn" id="add-cam">+ Add camera</button>` : ''}
      </div>

      <div class="section">
        <span class="field-label">Colors</span>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:4px;">
          <div>
            <label class="chk-lbl" style="margin-bottom:4px">
              <input type="checkbox" id="use_accent" ${this._config?.accent_color?'checked':''}> Custom accent
            </label>
            <div style="display:flex;align-items:center;gap:6px">
              <input type="color" id="accent_color" value="${this._config?.accent_color||'#3b82f6'}" style="width:40px;height:30px;border:none;padding:2px;border-radius:6px;cursor:pointer">
              <span style="font-size:11px;color:#6b7280" id="accent_lbl">${this._config?.accent_color||'#3b82f6'}</span>
            </div>
          </div>
          <div>
            <label class="chk-lbl" style="margin-bottom:4px">
              <input type="checkbox" id="use_bg" ${this._config?.bg_color?'checked':''}> Custom background
            </label>
            <div style="display:flex;align-items:center;gap:6px">
              <input type="color" id="bg_color" value="${this._config?.bg_color||'#1c2233'}" style="width:40px;height:30px;border:none;padding:2px;border-radius:6px;cursor:pointer">
              <span style="font-size:11px;color:#6b7280" id="bg_lbl">${this._config?.bg_color||'#1c2233'}</span>
            </div>
          </div>
        </div>
        <small style="color:#6b7280;font-size:11px">Check the box to activate. Uncheck to revert to theme default.</small>
        <div class="transparency-row" style="margin-top:12px">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:10px">
            <span class="field-label" style="margin:0">Card transparency</span>
            <span class="range-value" id="transparency_lbl">${Math.round(Number(this._config?.transparency)||0)}%</span>
          </div>
          <input class="range" id="transparency" type="range" min="0" max="100" step="1" value="${Math.round(Number(this._config?.transparency)||0)}">
          <small class="mini-help">0% preserves the normal card material. Higher values reveal the Lovelace background/wallpaper. Custom background, when enabled, becomes the glass tint. Video remains opaque.</small>
        </div>
      </div>

      <div class="section">
        <span class="field-label">Theme</span>
        <div class="radio-row">
          <label class="radio-lbl"><input type="radio" name="theme" value="dark"  ${(this._config?.theme||'dark')==='dark' ?'checked':''}> Dark</label>
          <label class="radio-lbl"><input type="radio" name="theme" value="light" ${this._config?.theme==='light'?'checked':''}> Light</label>
          <label class="radio-lbl"><input type="radio" name="theme" value="auto"  ${this._config?.theme==='auto' ?'checked':''}> Auto (Home Assistant)</label>
        </div>
      </div>

      <div class="section">
        <span class="field-label">View</span>
        <div class="radio-row">
          <label class="radio-lbl"><input type="radio" name="default_view" value="single" ${defaultView==='single'?'checked':''}> Single camera</label>
          <label class="radio-lbl"><input type="radio" name="default_view" value="grid" ${defaultView==='grid'?'checked':''} ${usableCamCount<2?'disabled':''}> Grid (all cams)</label>
        </div>
        ${usableCamCount<2?'<small class="mini-help">Grid view becomes available when at least two camera entities are configured.</small>':''}
        <div style="margin-top:8px">
          <label class="chk-lbl"><input type="checkbox" name="rotate_on_load" id="rotate_on_load" ${rotateOnLoad?'checked':''} ${usableCamCount<2?'disabled':''}> Auto-rotate on load</label>
        </div>
        <div style="margin-top:6px">
          <label><span style="font-size:11px;color:#6b7280">Rotate interval (seconds, 0 = use default ${DEFAULT_ROTATE_S}s)</span>
            <input name="rotate_seconds" class="tf" id="rotate_seconds" type="number" value="${this._config?.rotate_seconds??0}" min="0" style="margin-top:3px">
          </label>
        </div>
      </div>

      <div class="section">
        <span class="field-label">Hidden tabs</span>
        <div class="chk-grid">
          ${tabCheck('clips','Clips')}
          ${tabCheck('recordings','Recordings')}
          ${tabCheck('reviews','Reviews')}
        </div>
      </div>

      <div class="section">
        <span class="field-label">Stream height (vh, optional)</span>
        <input name="stream_height" class="tf" id="stream_height" type="number"
          value="${this._config?.stream_height||''}" min="20" max="100"
          placeholder="Blank = use aspect ratio">
        <small class="mini-help">Blank: Aspect ratio controls the player height. Set a value (for example 50) to force 50vh on the dashboard; an explicit height intentionally overrides Aspect ratio. The editor preview scales/caps this only for readability.</small>
      </div>

      <div class="section">
        <span class="field-label">Live stream</span>
        <div class="radio-row" style="margin-bottom:8px">
          <label class="radio-lbl"><input type="radio" name="stream_type" value="webrtc" ${(this._config?.stream_type||'webrtc')==='webrtc'?'checked':''}> WebRTC</label>
          <label class="radio-lbl"><input type="radio" name="stream_type" value="hls" ${this._config?.stream_type==='hls'?'checked':''}> HLS</label>
        </div>
        <small style="color:#6b7280;font-size:11px">WebRTC needs a backend that supports it (go2rtc bundled in Frigate 0.13+, or RTSPtoWebRTC). If a stream won't start, switch back to HLS.</small>

        <div style="margin-top:10px">
          <label class="chk-lbl">
            <input type="checkbox" id="stream_resizable" ${this._config?.stream_resizable?'checked':''}> Let me drag-resize the live view
          </label>
        </div>

        <div style="margin-top:10px">
          <span style="font-size:11px;color:#6b7280;display:block;margin-bottom:3px">Aspect ratio</span>
          <select class="tf" id="aspect_ratio_preset">
            ${['16:9','4:3','1:1','21:9','9:16','auto','custom'].map(v => {
              const cur = this._config?.aspect_ratio || 'auto';
              const isCustom = cur && !['16:9','4:3','1:1','21:9','9:16','auto'].includes(cur);
              const selected = (v === 'custom' && isCustom) || cur === v;
              const label = v === 'auto' ? 'Auto (selected camera)' : v === 'custom' ? 'Custom…' : v;
              return `<option value="${v}" ${selected?'selected':''}>${label}</option>`;
            }).join('')}
          </select>
          <input class="tf" id="aspect_ratio_custom" type="text" placeholder="e.g. 3:2"
            value="${(this._config?.aspect_ratio && !['16:9','4:3','1:1','21:9','9:16','auto'].includes(this._config.aspect_ratio)) ? this._config.aspect_ratio : ''}"
            style="margin-top:6px;display:${(this._config?.aspect_ratio && !['16:9','4:3','1:1','21:9','9:16','auto'].includes(this._config.aspect_ratio)) ? 'block' : 'none'}">
        </div>
      </div>

      <div class="section">
        <span class="field-label">Data & browser</span>
        <div class="adv-grid">
          <label><span class="field-label">Browser history window (hours)</span><input class="tf" id="window_hours" type="number" min="1" max="720" value="${this._config?.window_hours||24}"><small class="mini-help">Initial events/reviews history loaded for browsing.</small></label>
          <label><span class="field-label">Refresh interval (seconds)</span><input class="tf" id="refresh_seconds" type="number" min="15" max="3600" value="${this._config?.refresh_seconds||45}"><small class="mini-help">Background Frigate metadata/event refresh.</small></label>
          <label><span class="field-label">Reviews default</span><select class="tf" id="reviewed_default"><option value="all" ${(med.reviewed_default||'all')==='all'?'selected':''}>All</option><option value="unreviewed" ${med.reviewed_default==='unreviewed'?'selected':''}>Unreviewed</option><option value="reviewed" ${med.reviewed_default==='reviewed'?'selected':''}>Reviewed</option></select></label>
        </div>
      </div>

      <details class="config-group" open>
        <summary>Timeline</summary>
        <div class="adv-grid">
          <label class="chk-lbl"><input type="checkbox" id="timeline_enabled" ${tl.enabled!==false?'checked':''}> Show timeline on Live</label>
          <label><span class="field-label">Default zoom (minutes)</span><input class="tf" id="timeline_default_minutes" type="number" min="5" max="60" value="${tl.default_minutes??10}"></label>
          <label class="chk-lbl"><input type="checkbox" id="timeline_show_thumbnails" ${tl.show_thumbnails!==false?'checked':''}> Event thumbnails</label>
          <label class="chk-lbl"><input type="checkbox" id="timeline_show_glyphs" ${tl.show_glyphs!==false?'checked':''}> Detection glyphs</label>
          <label class="chk-lbl"><input type="checkbox" id="timeline_show_legend" ${tl.show_legend!==false?'checked':''}> Detection legend</label>
          <label class="chk-lbl"><input type="checkbox" id="timeline_show_zoom_controls" ${tl.show_zoom_controls!==false?'checked':''}> Zoom controls</label>
          <label class="chk-lbl"><input type="checkbox" id="timeline_show_filter_button" ${tl.show_filter_button!==false?'checked':''}> Filter button</label>
          <label class="chk-lbl"><input type="checkbox" id="timeline_show_calendar_button" ${tl.show_calendar_button!==false?'checked':''}> Calendar button</label>
          <label class="chk-lbl"><input type="checkbox" id="timeline_clustering" ${tl.clustering!==false?'checked':''}> Cluster nearby detections</label>
          <label><span class="field-label">Same-label merge gap (s)</span><input class="tf" id="timeline_same_label_cluster_seconds" type="number" min="0" max="120" value="${tl.same_label_cluster_seconds??12}"></label>
          <label><span class="field-label">Burst cluster max gap (s)</span><input class="tf" id="timeline_visual_cluster_max_seconds" type="number" min="0" max="300" value="${tl.visual_cluster_max_seconds??60}"></label>
          <label><span class="field-label">Max glyphs per burst</span><input class="tf" id="timeline_max_glyphs" type="number" min="1" max="6" value="${tl.max_glyphs??3}"></label>
          <label><span class="field-label">Glyph min size (px)</span><input class="tf" id="timeline_glyph_min_px" type="number" min="12" max="40" value="${tl.glyph_min_px??20}"></label>
          <label><span class="field-label">Glyph max size (px)</span><input class="tf" id="timeline_glyph_max_px" type="number" min="12" max="48" value="${tl.glyph_max_px??30}"></label>
          <label><span class="field-label">Max visible thumbnails</span><input class="tf" id="timeline_max_thumbnails" type="number" min="0" max="24" value="${tl.max_thumbnails??12}"><small class="mini-help">0 hides them. Actual count still adapts to timeline height.</small></label>
        </div>
      </details>

      <details class="config-group">
        <summary>Recording downloads</summary>
        <div class="adv-grid">
          <label><span class="field-label">Initial trim range (seconds)</span><input class="tf" id="download_default_range_seconds" type="number" min="2" max="1800" value="${dl.default_range_seconds??60}"></label>
          <label><span class="field-label">Maximum trim range (minutes)</span><input class="tf" id="download_max_range_minutes" type="number" min="1" max="720" value="${dl.max_range_minutes??120}"></label>
        </div>
      </details>

      <div class="section">
        <span class="field-label">YAML</span>
        <small class="mini-help">Advanced editor keys are stored as <code>timeline:</code>, <code>download:</code>, and <code>media:</code>. Every option above can also be set directly in Lovelace YAML.</small>
      </div>

      <div class="section">
        <span class="field-label">Two-way audio (talk)</span>
        <label class="chk-lbl" style="margin-bottom:8px">
          <input type="checkbox" id="two_way_audio" ${this._config?.two_way_audio ? 'checked' : ''}> Enable talk button when a microphone is detected
        </label>
        <label><span style="font-size:11px;color:#6b7280">Talk session disconnect delay (seconds; 0 = keep connected)</span>
          <input name="two_way_audio_disconnect_seconds" class="tf" id="two_way_audio_disconnect_seconds" type="number" min="0" step="1"
            value="${this._config?.two_way_audio_disconnect_seconds ?? 90}" style="margin-top:3px">
        </label>
        <small style="color:#6b7280;font-size:11px">Live video and talk are routed only through the Home Assistant Frigate integration's authenticated <code>/api/frigate/&lt;instance&gt;/go2rtc/…</code> proxy. The card never connects the browser directly to a Frigate or go2rtc host.</small>
        <small style="color:#6b7280;font-size:11px">
          Requires go2rtc configured with a two-way-audio source for this camera, HTTPS (or localhost), and a browser-detected audio input. The button stays hidden when no microphone is available.
          By default the go2rtc stream name is assumed to match the Frigate camera name — override per-camera with
          <code>go2rtc_stream</code> in YAML if yours differs.
        </small>
      </div>

    </div>`;

    this.querySelector('#add-cam')?.addEventListener('click', () => {
      const cur = this._getCams(); cur.push({ entity:'', name:'' });
      this._config = { ...this._config, cameras: cur }; delete this._config.camera_entity; this._render(); this._dispatch();
    });
    this.querySelectorAll('[data-remove-cam]').forEach(b => b.addEventListener('click', e => {
      const cur = this._getCams(); cur.splice(Number(e.currentTarget.dataset.removeCam), 1);
      this._config = { ...this._config, cameras: cur }; delete this._config.camera_entity; this._render(); this._dispatch();
    }));
    this.querySelectorAll('select,input').forEach(el => el.addEventListener('change', () => this._u()));
    // show/hide the custom aspect-ratio field based on the preset dropdown
    this.querySelector('#aspect_ratio_preset')?.addEventListener('change', e => {
      const customInput = this.querySelector('#aspect_ratio_custom');
      if (customInput) customInput.style.display = e.target.value === 'custom' ? 'block' : 'none';
    });
    // prevent click outside from closing select while user is choosing
    this.querySelectorAll('select').forEach(sel => sel.addEventListener('mousedown', e => e.stopPropagation()));
    // sync color picker label as user drags
    ['accent','bg'].forEach(key => {
      const picker = this.querySelector(`#${key}_color`);
      const lbl    = this.querySelector(`#${key}_lbl`);
      if (picker && lbl) picker.addEventListener('input', () => { lbl.textContent = picker.value; });
    });
    const transparency=this.querySelector('#transparency');
    const transparencyLbl=this.querySelector('#transparency_lbl');
    if(transparency && transparencyLbl){
      transparency.addEventListener('input',()=>{transparencyLbl.textContent=`${transparency.value}%`;});
    }
  },

_getCams() {
    const rows = [...this.querySelectorAll('[data-row]')];
    return rows.map(r => ({
      entity: r.querySelector('[data-cam-entity]')?.value || '',
      name: r.querySelector('[data-cam-name]')?.value || '',
      frigate_client_id: r.querySelector('[data-cam-client]')?.value?.trim() || '',
      go2rtc_stream: r.querySelector('[data-cam-stream]')?.value?.trim() || '',
    }));
  },

_u() {
    const g = id => this.querySelector('#'+id)?.value?.trim() || '';
    const cams = this._getCams().filter(c => c.entity);
    const c = { ...this._config };
    if (cams.length > 1 || (cams.length===1 && (cams[0].name || cams[0].frigate_client_id || cams[0].go2rtc_stream))) { c.cameras = cams; delete c.camera_entity; }
    else if (cams.length === 1) { c.camera_entity = cams[0].entity; delete c.cameras; }
    const w=g('window_hours'),r=g('rotate_seconds');
    // Legacy header/browser settings no longer have a visual surface. Per-camera
    // display names replace `title`; the unified media galleries replace
    // `browse_expanded`. Do not keep writing dead settings from the UI editor.
    delete c.title;
    delete c.subtitle;
    delete c.browse_expanded;
    c.window_hours=Math.max(1,Math.min(720,Number(w)||24));
    c.rotate_seconds = Math.max(0,Math.min(3600,Number(r)||0));
    c.refresh_seconds=Math.max(15,Math.min(3600,Number(g('refresh_seconds')||45)));
    // custom colors
    c.accent_color = this.querySelector('#use_accent')?.checked
      ? (this.querySelector('#accent_color')?.value || null) : null;
    c.bg_color = this.querySelector('#use_bg')?.checked
      ? (this.querySelector('#bg_color')?.value || null) : null;
    c.transparency = Math.max(0,Math.min(100,Number(this.querySelector('#transparency')?.value)||0));
    // theme
    c.theme = this.querySelector('input[name="theme"]:checked')?.value || 'dark';
    // default view
    const dv = this.querySelector('input[name="default_view"]:checked')?.value || 'single';
    c.default_view = (dv==='grid' && cams.length>1) ? 'grid' : 'single';
    // rotate on load only has meaning with multiple configured cameras
    c.rotate_on_load = cams.length>1 && this.querySelector('#rotate_on_load')?.checked === true;
    // hidden tabs
    const hidden = [...this.querySelectorAll('[data-hide-tab]')]
      .filter(el => el.checked).map(el => el.dataset.hideTab);
    c.hidden_tabs = hidden.length ? hidden : [];
    const sh = this.querySelector('#stream_height')?.value;
    c.stream_height = sh ? Math.max(20,Math.min(100,Number(sh))) : null;
    // live stream: protocol, resizable, aspect ratio
    c.stream_type = this.querySelector('input[name="stream_type"]:checked')?.value === 'hls' ? 'hls' : 'webrtc';
    c.stream_resizable = this.querySelector('#stream_resizable')?.checked === true;
    const arPreset = this.querySelector('#aspect_ratio_preset')?.value || 'auto';
    if (arPreset === 'custom') {
      const custom = this.querySelector('#aspect_ratio_custom')?.value?.trim();
      c.aspect_ratio = custom || 'auto';
    } else {
      c.aspect_ratio = arPreset;
    }
    // advanced timeline / download / media settings
    c.timeline = {
      enabled: this.querySelector('#timeline_enabled')?.checked !== false,
      default_minutes: Math.max(5,Math.min(60,Number(g('timeline_default_minutes')||10))),
      show_thumbnails: this.querySelector('#timeline_show_thumbnails')?.checked !== false,
      show_glyphs: this.querySelector('#timeline_show_glyphs')?.checked !== false,
      show_legend: this.querySelector('#timeline_show_legend')?.checked !== false,
      show_zoom_controls: this.querySelector('#timeline_show_zoom_controls')?.checked !== false,
      show_filter_button: this.querySelector('#timeline_show_filter_button')?.checked !== false,
      show_calendar_button: this.querySelector('#timeline_show_calendar_button')?.checked !== false,
      clustering: this.querySelector('#timeline_clustering')?.checked !== false,
      same_label_cluster_seconds: Math.max(0,Math.min(120,Number(g('timeline_same_label_cluster_seconds')||12))),
      visual_cluster_max_seconds: Math.max(0,Math.min(300,Number(g('timeline_visual_cluster_max_seconds')||60))),
      glyph_min_px: Math.max(12,Math.min(40,Number(g('timeline_glyph_min_px')||20))),
      glyph_max_px: Math.max(12,Math.min(48,Number(g('timeline_glyph_max_px')||30))),
      max_glyphs: Math.max(1,Math.min(6,Math.round(Number(g('timeline_max_glyphs')||3)))),
      max_thumbnails: Math.max(0,Math.min(24,Math.round(Number(g('timeline_max_thumbnails')||12)))),
    };
    if(c.timeline.glyph_max_px<c.timeline.glyph_min_px)c.timeline.glyph_max_px=c.timeline.glyph_min_px;
    const dlMax=Math.max(1,Math.min(720,Number(g('download_max_range_minutes')||120)));
    c.download = {
      default_range_seconds: Math.min(Math.round(dlMax*60),Math.max(2,Math.min(1800,Math.round(Number(g('download_default_range_seconds')||60))))),
      max_range_minutes: dlMax,
    };
    c.media = { reviewed_default: this.querySelector('#reviewed_default')?.value || 'all' };
    // two-way audio
    c.two_way_audio = this.querySelector('#two_way_audio')?.checked === true;
    c.two_way_audio_disconnect_seconds = Math.max(0, Number(g('two_way_audio_disconnect_seconds') || 90));
    // Remove legacy direct-network keys whenever the visual editor saves.
    // Frigate instance/client and go2rtc stream overrides are per-camera above;
    // there is intentionally no phantom top-level editor field.
    delete c.go2rtc_url;
    delete c.frigate_url;
    if(c.go2rtc && typeof c.go2rtc==='object') delete c.go2rtc.url;
    this._config=c; this._dispatch();
  },

_dispatch() { this.dispatchEvent(new CustomEvent('config-changed',{detail:{config:this._config}})); }
};
