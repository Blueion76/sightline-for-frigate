/** Read editor controls, normalize card configuration, and emit HA updates. */
export const editorConfigMethods = {
setConfig(c) { this._config=c; this._render(); },

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
    c.default_view = (dv==='multiview' && cams.length>1) ? 'multiview' : 'single';
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
    c.timeline = { ...(this._config?.timeline || {}),
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
      thumbnail_size: Math.max(48,Math.min(140,Math.round(Number(g('timeline_thumbnail_size')||84)))),
    };
    if(c.timeline.glyph_max_px<c.timeline.glyph_min_px)c.timeline.glyph_max_px=c.timeline.glyph_min_px;
    const dlMax=Math.max(1,Math.min(720,Number(g('download_max_range_minutes')||120)));
    c.download = {
      default_range_seconds: Math.min(Math.round(dlMax*60),Math.max(2,Math.min(1800,Math.round(Number(g('download_default_range_seconds')||60))))),
      max_range_minutes: dlMax,
    };
    c.media = { reviewed_default: this.querySelector('#reviewed_default')?.value || 'all' };

    // Startup behavior. Hidden tabs cannot be selected as the initial view.
    const requestedTab=this.querySelector('#default_tab')?.value||'live';
    c.default_tab=requestedTab!=='live'&&hidden.includes(requestedTab)?'live':requestedTab;
    c.autoplay_latest_clip=this.querySelector('#autoplay_latest_clip')?.checked===true;

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
