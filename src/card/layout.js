/**
 * Card geometry, responsive sizing, stream resize behavior and layout synchronization.
 */
import { VERSION, CARD_TAG, DAY, DEFAULT_ROTATE_S, ICONS, LABEL_COLORS, PALETTE, TIMELINE_GLYPHS, CAM_COLORS } from '../constants.js';
import { cap, parseWs, labelColor, timelineGlyph, mkCamState, camDisplayName } from '../helpers.js';
import { STYLES } from '../styles.js';

// Prototype methods grouped by responsibility.
export const layoutMethods = {
_parseAspectRatio(v) {
    if (!v || String(v).toLowerCase()==='auto') return null;
    const m = String(v).match(/^(\d+(?:\.\d+)?)\s*[:/]\s*(\d+(?:\.\d+)?)$/);
    if (m && Number(m[1]) > 0 && Number(m[2]) > 0) return `${m[1]}/${m[2]}`;
    const n = Number(v);
    return (!isNaN(n) && n > 0) ? `${n}` : null;
  },

_aspectRatioFromEntity(entity=this._activeCam?.entity) {
    const attrs=this._hass?.states?.[entity]?.attributes||{};
    const direct=this._parseAspectRatio(attrs.aspect_ratio || attrs.video_aspect_ratio || attrs.stream_aspect_ratio);
    if(direct) return direct;
    const pairs=[
      [attrs.video_width,attrs.video_height],
      [attrs.stream_width,attrs.stream_height],
      [attrs.width,attrs.height],
    ];
    for(const [w,h] of pairs) {
      const wn=Number(w), hn=Number(h);
      if(wn>0 && hn>0) return `${wn}/${hn}`;
    }
    const resolution=String(attrs.resolution||attrs.video_resolution||'').match(/(\d+)\s*[x×]\s*(\d+)/i);
    if(resolution && Number(resolution[1])>0 && Number(resolution[2])>0) return `${resolution[1]}/${resolution[2]}`;
    return null;
  },

_currentMediaAspectRatio() {
    const media=this._go2rtcLive?.video || this._findVideo(this._engine);
    const w=Number(media?.videoWidth||media?.naturalWidth||0);
    const h=Number(media?.videoHeight||media?.naturalHeight||0);
    return (w>0 && h>0) ? `${w}/${h}` : null;
  },

_watchAutoAspectMedia(media) {
    if(!media || media._frigateAutoAspectBound) return;
    media._frigateAutoAspectBound=true;
    const update=()=>{
      if(this._config?.aspect_ratio!=='auto') return;
      const w=Number(media.videoWidth||media.naturalWidth||0);
      const h=Number(media.videoHeight||media.naturalHeight||0);
      if(w>0 && h>0) {
        const card=this.shadowRoot?.querySelector('.card');
        card?.style.setProperty('--stream-ar',`${w}/${h}`);
        card?.style.setProperty('--stream-ar-num',String(w/h));
      }
    };
    ['loadedmetadata','loadeddata','resize','load'].forEach(ev=>{
      try { media.addEventListener(ev,update,{passive:true}); } catch (_) {}
    });
    update();
  },

_applyCardStyle() {
    const card = this.shadowRoot.querySelector('.card'); if (!card) return;

    // Player geometry authority. Home Assistant mounts the live card
    // before hui-card-preview has necessarily finished joining the composed DOM.
    // A later ResizeObserver pass can therefore add editor-preview after the first
    // paint. Geometry must be recalculated at that transition instead of allowing
    // the old compact-preview CSS to replace the configured height/aspect ratio.
    //
    // Precedence is intentionally simple:
    //   explicit stream_height / drag height -> owns vertical size;
    //   otherwise aspect_ratio (including Auto) -> owns vertical size.
    const configuredVh = Number(this._config.stream_height);
    const runtimeH = Number(this._config._runtime_stream_height);
    const hasRuntimeHeight = this._config.stream_resizable && Number.isFinite(runtimeH) && runtimeH > 0;
    const hasConfiguredHeight = Number.isFinite(configuredVh) && configuredVh > 0;
    const explicitHeight = hasRuntimeHeight ? `${runtimeH}px` : (hasConfiguredHeight ? `${configuredVh}vh` : '');
    card.classList.toggle('stream-height-explicit', !!explicitHeight);
    if (explicitHeight) card.style.setProperty('--stream-h', explicitHeight);
    else card.style.removeProperty('--stream-h');

    // Aspect ratio. Auto follows the selected camera entity first and then
    // upgrades to the live media's true videoWidth/videoHeight once metadata
    // arrives. Use 16:9 only as the brief pre-metadata fallback.
    const autoAspect=this._config.aspect_ratio==='auto';
    const arCss = autoAspect
      ? (this._currentMediaAspectRatio() || this._aspectRatioFromEntity() || '16/9')
      : (this._parseAspectRatio(this._config.aspect_ratio) || '16/9');
    card.style.setProperty('--stream-ar', arCss);
    const arParts=String(arCss).split('/').map(Number);
    const arNum=arParts.length===2 && arParts[0]>0 && arParts[1]>0 ? arParts[0]/arParts[1] : Number(arCss);
    card.style.setProperty('--stream-ar-num', String(Number.isFinite(arNum)&&arNum>0 ? arNum : 16/9));

    // Apply the selected geometry directly to the live wrapper with important
    // priority. The source contains several historical/mobile styling passes;
    // using one final inline authority prevents any later class or HA resize pass
    // from silently restoring the old 16:9/default height.
    const wrap = this.shadowRoot.querySelector('#eng-wrap');
    const editorPreview = card.classList.contains('editor-preview') || this._isEditorPreview();
    if (wrap) {
      wrap.style.setProperty('min-height','0','important');
      if (explicitHeight) {
        // The visual editor must remain usable, so show the requested height but
        // cap only the editor representation. Production/dashboard playback uses
        // the exact configured vh/dragged px value.
        wrap.style.setProperty('width','100%','important');
        wrap.style.setProperty('height', editorPreview ? `min(${explicitHeight}, 280px)` : explicitHeight, 'important');
        wrap.style.setProperty('max-height', editorPreview ? '280px' : 'none', 'important');
        wrap.style.setProperty('aspect-ratio','auto','important');
        wrap.style.setProperty('margin-inline','0','important');
      } else {
        // In editor preview, fit tall/square ratios inside a 280px preview box
        // without changing the ratio. On the real card the stream always spans
        // the available width and its configured ratio determines height.
        wrap.style.setProperty('width', editorPreview ? 'min(100%, calc(280px * var(--stream-ar-num, 1.7777778)))' : '100%', 'important');
        wrap.style.setProperty('height','auto','important');
        wrap.style.setProperty('max-height', editorPreview ? '280px' : 'none', 'important');
        wrap.style.setProperty('aspect-ratio', arCss, 'important');
        wrap.style.setProperty('margin-inline', editorPreview ? 'auto' : '0', 'important');
      }
    }

    // Keep grid geometry under the same precedence rules. The grid itself owns
    // explicit height; otherwise each tile follows the selected aspect ratio.
    const grid=this.shadowRoot.querySelector('#cam-grid');
    if(grid){
      if(explicitHeight){
        grid.style.setProperty('height', editorPreview ? `min(${explicitHeight}, 280px)` : explicitHeight, 'important');
        grid.style.setProperty('max-height', editorPreview ? '280px' : 'none', 'important');
      } else {
        grid.style.removeProperty('height');
        grid.style.setProperty('max-height', editorPreview ? '280px' : 'none', 'important');
      }
    }

    if(autoAspect) {
      const media=this._go2rtcLive?.video || this._findVideo(this._engine);
      if(media) this._watchAutoAspectMedia(media);
    }

    // Theme — for 'auto' prefer HA's own dark-mode flag, fall back to OS media query
    let theme = this._config.theme || 'dark';
    if (theme === 'auto') {
      const haDark = this._hass?.themes?.darkMode;
      const osDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
      theme = (haDark ?? osDark ?? true) ? 'dark' : 'light';
    }
    card.classList.toggle('theme-light', theme === 'light');
    card.classList.remove('theme-auto'); // resolved to light/dark above

    // Custom accent color — compute bg/border variants from hex
    const acc = this._config.accent_color;
    if (acc && /^#[0-9a-f]{6}$/i.test(acc)) {
      const r = parseInt(acc.slice(1,3),16), g = parseInt(acc.slice(3,5),16), b = parseInt(acc.slice(5,7),16);
      card.style.setProperty('--c-acc',     acc);
      card.style.setProperty('--c-acc-bg',  `rgba(${r},${g},${b},.18)`);
      card.style.setProperty('--c-acc-bdr', `rgba(${r},${g},${b},.40)`);
    } else {
      card.style.removeProperty('--c-acc');
      card.style.removeProperty('--c-acc-bg');
      card.style.removeProperty('--c-acc-bdr');
    }

    // Custom background + surface transparency. Transparency is deliberately
    // implemented on the MATERIAL fills rather than `opacity` on the card:
    // icons/text stay crisp, the video remains fully opaque, and backdrop-filter
    // can reveal a Lovelace wallpaper/theme behind the glass.
    const bg = this._config.bg_color;
    const validBg = !!(bg && /^#[0-9a-f]{6}$/i.test(bg));
    const transparency = Math.max(0,Math.min(100,Number(this._config.transparency)||0));
    const transparent = transparency > 0;
    const surfaceFactor = 1 - (transparency / 100);
    const hexRgb = hex => {
      const h=String(hex||'').replace('#','');
      return /^([0-9a-f]{6})$/i.test(h)
        ? [parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)] : null;
    };
    const rgba = (hex,a) => {
      const rgb=hexRgb(hex); if(!rgb) return 'transparent';
      return `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${Math.max(0,Math.min(1,a)).toFixed(3)})`;
    };
    const mixHex = (a,b,t) => {
      const ca=hexRgb(a), cb=hexRgb(b); if(!ca||!cb) return a;
      const m=(x,y)=>Math.round(x*(1-t)+y*t).toString(16).padStart(2,'0');
      return `#${m(ca[0],cb[0])}${m(ca[1],cb[1])}${m(ca[2],cb[2])}`;
    };
    card.classList.toggle('custom-bg', validBg);
    card.classList.toggle('card-transparent', transparent);
    card.classList.toggle('surface-override', validBg || transparent);

    if (validBg || transparent) {
      const light = theme === 'light';
      const baseHex = validBg ? bg : (light ? '#f2f2f7' : '#1c1c20');
      const baseAlpha = validBg ? 1 : (light ? .78 : .72);
      let panel, panel2;
      if (validBg) {
        const mixBase = light ? '#ffffff' : '#000000';
        // Panels stay a touch stronger than the outer glass so controls remain
        // legible over a busy wallpaper while still honoring the same slider.
        panel = rgba(mixHex(baseHex,mixBase,.12), Math.min(1,(baseAlpha+.08)*surfaceFactor));
        panel2 = rgba(mixHex(baseHex,mixBase,.22), Math.min(1,(baseAlpha+.13)*surfaceFactor));
      } else if (light) {
        panel = `rgba(0,0,0,${(.045*surfaceFactor).toFixed(3)})`;
        panel2 = `rgba(0,0,0,${(.070*surfaceFactor).toFixed(3)})`;
      } else {
        panel = `rgba(255,255,255,${(.055*surfaceFactor).toFixed(3)})`;
        panel2 = `rgba(255,255,255,${(.090*surfaceFactor).toFixed(3)})`;
      }
      const surface = rgba(baseHex, baseAlpha*surfaceFactor);
      card.style.setProperty('--c-bg', surface, 'important');
      card.style.setProperty('--c-bg-panel', panel, 'important');
      card.style.setProperty('--c-bg-panel2', panel2, 'important');
      card.style.setProperty('background', surface, 'important');
    } else {
      card.style.removeProperty('--c-bg');
      card.style.removeProperty('--c-bg-panel');
      card.style.removeProperty('--c-bg-panel2');
      card.style.removeProperty('background');
    }
  },

_setupStreamResize() {
    const wrap = this.shadowRoot.querySelector('#eng-wrap');
    const grip = this.shadowRoot.querySelector('#stream-resize-grip');
    if (!wrap || !grip || !this._config.stream_resizable) return;
    if (grip._resizeWired) return;
    grip._resizeWired = true;

    const getMax = () => Math.max(180, Math.min(
      Math.round(window.innerHeight * 0.82),
      Math.round(this.getBoundingClientRect().height * 0.78)
    ));

    const start = ev => {
      if (ev.pointerType === 'mouse' && ev.button !== 0) return;
      ev.preventDefault();
      ev.stopPropagation();
      const rect = wrap.getBoundingClientRect();
      grip.setPointerCapture?.(ev.pointerId);
      grip.classList.add('resizing');
      this._streamResize = {
        pointerId: ev.pointerId,
        startY: ev.clientY,
        startH: rect.height
      };
    };
    const move = ev => {
      const s = this._streamResize;
      if (!s || s.pointerId !== ev.pointerId) return;
      ev.preventDefault();
      const h = Math.max(120, Math.min(getMax(), Math.round(s.startH + ev.clientY - s.startY)));
      this._config._runtime_stream_height = h;
      this._applyCardStyle();
      this._syncColHeight();
    };
    const end = ev => {
      if (!this._streamResize || this._streamResize.pointerId !== ev.pointerId) return;
      try { grip.releasePointerCapture?.(ev.pointerId); } catch (_) {}
      grip.classList.remove('resizing');
      this._streamResize = null;
    };
    grip.addEventListener('pointerdown', start, {passive:false});
    grip.addEventListener('pointermove', move, {passive:false});
    grip.addEventListener('pointerup', end);
    grip.addEventListener('pointercancel', end);
    grip.addEventListener('lostpointercapture', end);
  },

_stabilizeInitialTimeline() {
    // HA can finish measuring the card one or two frames after the first
    // render. Reconcile the timeline after those measurements so the initial
    // scale, thumbnail positions, and centered playhead are calculated from
    // the real track height rather than a transient 0/partial height.
    cancelAnimationFrame(this._initialTimelineRaf1);
    cancelAnimationFrame(this._initialTimelineRaf2);
    this._initialTimelineRaf1 = requestAnimationFrame(() => {
      this._initialTimelineRaf1 = 0;
      this._renderTimeline(true);
      this._renderRange();
      this._renderTimelineZoomLabel();
      this._initialTimelineRaf2 = requestAnimationFrame(() => {
        this._initialTimelineRaf2 = 0;
        this._renderTimeline(true);
        this._renderRange();
        this._renderTimelineZoomLabel();
      });
    });
  },

_setupResizeObserver() {
    this._ro = new ResizeObserver(entries => {
      // Opening an iOS date/time picker can itself perturb the visual viewport
      // and trigger ResizeObserver. Even class/layout writes outside the filter
      // panel can make WebKit dismiss the native picker, so freeze the whole card
      // geometry until picker ownership is released.
      if(this._mediaPickerActive && this._galleryMode) return;
      const w = entries[0].contentRect.width;
      const previousWidth=this._cardWidth;
      this._cardWidth = w;
      const card = this.shadowRoot.querySelector('.card');
      if (!card) return;
      const editorPreview=this._isEditorPreview();
      const wasEditorPreview=card.classList.contains('editor-preview');
      const wide = !editorPreview && w >= 560, mobile = w < 420;
      // Container-width breakpoints, not viewport breakpoints: the same card can
      // therefore be full-dashboard on one view and a normal Section card on another.
      // 820px = video + timeline; 1180px = video + timeline + media browser.
      const dashboardSplit = !editorPreview && w >= 820;
      const workstation = !editorPreview && w >= 1180;
      card.classList.toggle('editor-preview', editorPreview);
      card.classList.toggle('wide', wide);
      card.classList.toggle('mobile', mobile);
      card.classList.toggle('dashboard-split', dashboardSplit);
      card.classList.toggle('workstation', workstation);
      // HA can discover the preview ancestor only after first paint. Reassert
      // player geometry at that exact transition; this fixes the visible
      // set-height/aspect -> flash -> 16:9/default-size regression.
      if(wasEditorPreview!==editorPreview) this._applyCardStyle();
      this._applyBrowse();
      this._syncResponsiveWorkspace();
      this._syncColHeight();
      // Timeline marker size and visual clustering are container-width aware.
      // Reconcile after a meaningful dashboard/grid resize so moving a card
      // between columns immediately gets the right density without a reload.
      if(Math.abs(Number(previousWidth||0)-Number(w||0))>=8 && this.shadowRoot.querySelector('#tl-track')) {
        if(this._timelineResizeRaf) cancelAnimationFrame(this._timelineResizeRaf);
        this._timelineResizeRaf=requestAnimationFrame(()=>{
          this._timelineResizeRaf=0;
          if(this.isConnected) this._renderTimeline(true);
        });
      }
    });
    this._ro.observe(this);
  },

_syncColHeight() {
    // Avoid ancestor geometry changes while the native iOS picker is open.
    if(this._mediaPickerActive && this._galleryMode) return;
    requestAnimationFrame(() => {
      if(this._mediaPickerActive && this._galleryMode) return;
      const card=this.shadowRoot.querySelector('.card');
      const l=this.shadowRoot.querySelector('.workspace-feed');
      if(!card || !l) return;
      if(!card.classList.contains('dashboard-split')) {
        card.style.removeProperty('--workspace-column-h');
        return;
      }
      const h=Math.round(l.getBoundingClientRect().height||l.offsetHeight||0);
      if(h>0) card.style.setProperty('--workspace-column-h',h+'px');
    });
  },

_syncResponsiveWorkspace() {
    const card=this.shadowRoot?.querySelector('.card');
    if(!card) return;
    const split=card.classList.contains('dashboard-split');
    const galleryOpen=!!this._galleryMode;
    card.classList.toggle('gallery-active',galleryOpen);
    const timeline=this.shadowRoot.querySelector('#timeline-view');
    if(timeline) timeline.style.display=(this._config?.timeline?.enabled && (!galleryOpen || split))?'':'none';
    const media=this.shadowRoot.querySelector('.workspace-media');
    if(media) media.setAttribute('aria-hidden',galleryOpen?'false':'true');
  },

_renderCamSwitcher() {
    const el = this.shadowRoot.querySelector('#cam-switcher'); if (!el) return;
    if (this._config.cameras.length < 2) { el.style.display='none'; return; }
    el.style.display = '';

    const tabs = this._config.cameras.map((c,i) => {
      const name = cap(camDisplayName(c));
      const active = this._viewMode === 'single' && i === this._activeCamIdx;
      const ok = this._hass?.states[c.entity]?.state !== 'unavailable';
      return `<button class="cam-tab ${active?'active':''}" data-camidx="${i}"><span class="cam-dot" style="color:${ok?'var(--c-on)':'var(--c-danger)'}">●</span> ${name}</button>`;
    }).join('');
    const gridActive = this._viewMode === 'grid';
    el.innerHTML = `<div class="cam-tabs">${tabs}<button class="cam-tab${gridActive?' active':''}" data-viewmode="grid" title="All cameras">${ICONS.grid} Multiview</button></div>
      <button class="cam-rotate ${this._rotateTimer?'on':''}" id="rotate-btn" title="Auto-rotate">${ICONS.rotate}</button>`;
  }
};
