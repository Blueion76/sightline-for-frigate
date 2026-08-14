/**
 * Stable card DOM shell and top-level event wiring.
 *
 * Styling is intentionally kept in src/styles/shell.js so this module remains
 * focused on semantic markup and lifecycle wiring.
 */
import { VERSION, CARD_TAG, DAY, DEFAULT_ROTATE_S, ICONS, LABEL_COLORS, PALETTE, TIMELINE_GLYPHS, CAM_COLORS } from '../constants.js';
import { cap, parseWs, labelColor, timelineGlyph, mkCamState, camDisplayName } from '../helpers.js';
import { SHELL_STYLES } from '../styles/shell.js';

/** Render the stable card shell and wire top-level DOM interactions. */
export const renderShellMethods = {
_renderShell() {
    const multiCam = this._config.cameras.length > 1;

    this.shadowRoot.innerHTML = `<style>${SHELL_STYLES}</style>
      <ha-card class="card ${this._config.theme==='light'?'theme-light':this._config.theme==='auto'?'theme-auto':''} ${this._config.bg_color?'custom-bg':''} ${Number(this._config.transparency)>0?'card-transparent':''} ${(this._config.bg_color||Number(this._config.transparency)>0)?'surface-override':''} ${this._isEditorPreview()?'editor-preview':''}" id="card">
        <div class="layout" id="layout">
          <!-- Responsive workspace. These are real sibling columns so the
               card can become video | timeline | media on dashboard-width cards
               without cloning any players, timelines, or gallery DOM. -->
          <div class="col-left workspace-feed">
            <!-- feed: single stream or grid -->
            <div class="feed-area">
              <div id="eng-wrap" class="${this._config.stream_resizable ? 'resizable' : ''}">
                <div id="engine"><div class="ph skel-stream">${ICONS.live}<span>Connecting…</span></div></div>
                <div class="viewer" id="viewer" style="display:none"></div>
                ${this._config.stream_resizable ? '<div class="stream-resize-grip" id="stream-resize-grip" aria-label="Resize video" role="separator"></div>' : ''}
              </div>
              <div id="cam-grid" style="display:none"></div>
              <!-- sits below whichever of eng-wrap/cam-grid is visible, so it
                   survives the single↔grid display:none toggle without duplication -->
              <div class="stream-ctrl-bar" id="stream-ctrl-bar"></div>
            </div>
            ${multiCam ? `<div class="cam-switcher" id="cam-switcher"></div>` : ''}
          </div>

          <div class="tl-sec workspace-timeline">
            <div id="timeline-view" style="${this._config.timeline.enabled?'':'display:none'}">
              <div class="tl-head">
                <div class="tl-tools">
                  <button class="tool" id="now-btn" title="Jump to now">⟳</button>
                  ${this._config.timeline.show_zoom_controls ? `<div class="tl-zoom-controls" role="group" aria-label="Timeline zoom">
                    <button class="tool tl-zoom-btn" id="tl-zoom-out" title="Zoom out" aria-label="Zoom out">−</button>
                    <button class="tool tl-zoom-level" id="tl-zoom-level" title="Reset timeline zoom">${Math.round(this._config.timeline.default_minutes)}m</button>
                    <button class="tool tl-zoom-btn" id="tl-zoom-in" title="Zoom in" aria-label="Zoom in">+</button>
                  </div>` : ''}
                  ${this._config.timeline.show_filter_button ? `<button class="tool" id="filter-btn" title="Filter">${ICONS.filter}</button>` : ''}
                  ${this._config.timeline.show_calendar_button ? `<button class="tool" id="cal-btn" title="Calendar">${ICONS.calendar}</button>` : ''}
                </div>
              </div>
              <div class="filter-panel" id="filter-panel" style="display:none"></div>
              <div class="cal-panel" id="cal-panel" style="display:none"></div>
              <div class="tl-track vertical" id="tl-track" title="Swipe up to move to older footage · drag the blue scrubber · hold near the bottom to move faster · pinch or use − / + to zoom"><div class="tl-now"></div></div>
              <div class="tl-labels" id="tl-labels"></div>
              <div class="legend" id="legend"></div>
            </div>
          </div>

          <!-- Clips / Recordings / Reviews live in their own responsive column.
               On narrow cards it collapses below the feed, preserving the existing
               single-column interaction model. -->
          <div class="col-right workspace-media">
            <div class="media-gallery" id="media-gallery"></div>
          </div>
        </div>
        <div class="toast" id="toast" style="display:none"></div>
      </ha-card>`;
    if (this._configError) {
      const card = this.shadowRoot.querySelector('#card');
      if (card) {
        const msg = document.createElement('div');
        msg.className = 'config-error';
        msg.innerHTML = '<strong>Sightline for Frigate</strong><span>' + this._configError + '</span>';
        card.prepend(msg);
      }
    }
    this._domCache = {}; // invalidate DOM element cache after full re-render
    this._syncResponsiveWorkspace();
    // Bind delegated listeners exactly once. Re-running setConfig/renderShell must
    // never stack click handlers, which otherwise makes media buttons fire twice.
    if (!this._clickListenerBound) {
      this._clickListenerBound = true;
      this.shadowRoot.addEventListener('click', e=>this._click(e));
    }
    if (!this._changeListenerBound) { this._changeListenerBound=true; this.shadowRoot.addEventListener('change', e=>this._change(e)); }
    if (!this._mediaPickerListenerBound) {
      this._mediaPickerListenerBound=true;
      // Capture before ordinary click/change handlers. Opening a native picker can
      // hand control to WebKit immediately, so the lock must exist before any
      // asynchronous Frigate response has a chance to repaint the filter panel.
      const pickerPress=e=>{
        // The visible Date/From/To controls are <label> wrappers. On iOS the
        // initial pointer/touch target is often the label text/calendar glyph
        // rather than the <input> itself, and focus may be handed directly to
        // the native picker. Resolve the whole control to its temporal input so
        // the lock is guaranteed to exist before WebKit opens the system UI.
        const input=this._mediaTemporalInput(e.target);
        if(input) this._beginMediaPicker(input);
        else if(this._mediaPickerActive) this._scheduleMediaPickerRelease(180);
      };
      this.shadowRoot.addEventListener('pointerdown', pickerPress, true);
      // Some WKWebView/iOS combinations dispatch touchstart before/without the
      // pointerdown we expect. The duplicate begin is harmless and makes the
      // native-picker ownership lock deterministic.
      this.shadowRoot.addEventListener('touchstart', pickerPress, {capture:true,passive:true});
      this.shadowRoot.addEventListener('focusin', e=>{
        const input=this._mediaTemporalInput(e.target);
        if(input) this._beginMediaPicker(input);
      }, true);
      // Do NOT use focusout as a native-picker dismissal signal. iOS/WebKit
      // commonly blurs the <input> when it hands control to the system
      // calendar/time wheel, while the picker is still visibly open. Releasing
      // the lock from that blur lets Clips/Recordings repaint underneath the
      // system picker and immediately dismisses it. The lock is released by a
      // committed change, or by the next pointer interaction outside a temporal
      // input after the user dismisses/cancels the picker.
    }
    if (!this._mediaImageListenerBound) {
      this._mediaImageListenerBound=true;
      // Image error/load events do not bubble, so use capture. Fresh Frigate
      // events can briefly return 404 while their thumbnail is finalized; retry
      // those requests without replacing the surrounding timeline DOM.
      this.shadowRoot.addEventListener('error', e=>this._handleMediaImageError(e), true);
      this.shadowRoot.addEventListener('load', e=>this._handleMediaImageLoad(e), true);
    }
    this._setupStreamResize();
    this._wireScrub(); this._wireScroll(); this._applyBrowse();
    if (multiCam) this._renderCamSwitcher();
    this._applyCardStyle();
  }
};
