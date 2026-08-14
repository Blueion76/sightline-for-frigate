/**
 * Responsive workspace policy and native timeline date-control integration.
 */
import { coreMethods } from './core.js';
import { layoutMethods } from './layout.js';
import { browserMethods } from './browser.js';

function clearStyle(el, prop) {
  try { el?.style?.removeProperty?.(prop); } catch(_) {}
}

function setImportant(el, prop, value) {
  try { el?.style?.setProperty?.(prop,value,'important'); } catch(_) {}
}

export const responsiveUxMethods = {
  _measureResponsiveCardWidth() {
    const rect=Number(this.getBoundingClientRect?.().width||0);
    const client=Number(this.clientWidth||0);
    const offset=Number(this.offsetWidth||0);
    const cached=Number(this._cardWidth||0);
    return Math.max(0,rect||client||offset||cached||0);
  },

  _syncResponsiveWorkspace() {
    const card=this.shadowRoot?.querySelector?.('.card');
    if(!card) return;

    // Install the direct-hit native timeline date control during normal card
    // reconciliation, before the user can tap it. Creating it only from the
    // click handler is too late for iOS because the first gesture would still
    // belong to the synthetic/programmatic path.
    if(this._config?.timeline?.show_calendar_button!==false) this._ensureTimelineNativeDateInput?.();

    // Measure synchronously every time. The configured default gallery is
    // opened before ResizeObserver is installed during startup, so relying only
    // on the observer can misclassify a 1200px workstation as the narrow card
    // for its entire initial gallery render.
    const w=this._measureResponsiveCardWidth();
    if(w>0) this._cardWidth=w;
    const editorPreview=this._isEditorPreview?.()===true;
    const wide=!editorPreview && w>=560;
    const mobile=w>0 && w<420;
    const split=!editorPreview && w>=820;
    const workstation=!editorPreview && w>=1180;
    card.classList.toggle('editor-preview',editorPreview);
    card.classList.toggle('wide',wide);
    card.classList.toggle('mobile',mobile);
    card.classList.toggle('dashboard-split',split);
    card.classList.toggle('workstation',workstation);

    const galleryOpen=!!this._galleryMode;
    const timelineEnabled=this._config?.timeline?.enabled!==false;
    const playbackFull=card.classList.contains('playback-fullcard');
    card.classList.toggle('gallery-active',galleryOpen);

    const layout=this.shadowRoot.querySelector('.layout');
    const feed=this.shadowRoot.querySelector('.workspace-feed');
    const timelineWrap=this.shadowRoot.querySelector('.workspace-timeline');
    const timeline=this.shadowRoot.querySelector('#timeline-view');
    const media=this.shadowRoot.querySelector('.workspace-media');
    const engWrap=this.shadowRoot.querySelector('#eng-wrap');
    const grid=this.shadowRoot.querySelector('#cam-grid');

    // Full-card playback owns the workspace until media is dismissed. A resize
    // or HA dashboard reconciliation must not resurrect the normal timeline or
    // media panes while playback-layout.js still exposes only the feed grid
    // area. Doing so creates an implicit CSS-grid row/column that appears as a
    // large blank region beside/below the clip on wide dashboards.
    const showTimeline=!playbackFull && timelineEnabled && (!galleryOpen || split);
    if(showTimeline){
      clearStyle(timelineWrap,'display');
      clearStyle(timeline,'display');
    } else {
      setImportant(timelineWrap,'display','none');
      setImportant(timeline,'display','none');
    }

    if(playbackFull){
      setImportant(feed,'display','block');
      setImportant(media,'display','none');
      media?.setAttribute?.('aria-hidden','true');
      setImportant(engWrap,'display','block');
      setImportant(grid,'display','none');
    } else if(galleryOpen){
      setImportant(media,'display',workstation || (split&&!timelineEnabled) ? 'flex' : 'block');
      media?.setAttribute?.('aria-hidden','false');
    } else {
      setImportant(media,'display','none');
      media?.setAttribute?.('aria-hidden','true');
    }

    // In split/workstation layouts the live feed is a persistent pane even if
    // Clips/Recordings/Reviews is the selected/default tab. Narrow cards keep
    // the historical replacement model below the feed.
    if(split && !playbackFull){
      clearStyle(feed,'display');
      if(this._viewMode==='grid'){
        clearStyle(grid,'display');
      } else {
        clearStyle(engWrap,'display');
      }
    }

    // Derive the grid from panes that actually exist. Hiding a disabled
    // timeline without changing grid-template-areas leaves an empty column;
    // these templates eliminate that dead track entirely. playback-fullcard is
    // intentionally excluded because its single-pane template is owned by the
    // playback layout and must survive responsive reconciliation unchanged.
    if(layout && !playbackFull){
      if(workstation){
        if(timelineEnabled && galleryOpen){
          setImportant(layout,'grid-template-columns','minmax(440px,1.36fr) minmax(340px,.82fr) minmax(330px,.82fr)');
          setImportant(layout,'grid-template-areas','"feed timeline media"');
        } else if(timelineEnabled){
          setImportant(layout,'grid-template-columns','minmax(470px,1.48fr) minmax(360px,.86fr)');
          setImportant(layout,'grid-template-areas','"feed timeline"');
        } else if(galleryOpen){
          setImportant(layout,'grid-template-columns','minmax(500px,1.5fr) minmax(340px,.9fr)');
          setImportant(layout,'grid-template-areas','"feed media"');
        } else {
          setImportant(layout,'grid-template-columns','minmax(0,1fr)');
          setImportant(layout,'grid-template-areas','"feed"');
        }
      } else if(split){
        if(timelineEnabled && galleryOpen){
          setImportant(layout,'grid-template-columns','minmax(0,1.42fr) minmax(330px,.88fr)');
          setImportant(layout,'grid-template-areas','"feed timeline" "media media"');
        } else if(timelineEnabled){
          setImportant(layout,'grid-template-columns','minmax(0,1.42fr) minmax(330px,.88fr)');
          setImportant(layout,'grid-template-areas','"feed timeline"');
        } else if(galleryOpen){
          setImportant(layout,'grid-template-columns','minmax(0,1.38fr) minmax(300px,.86fr)');
          setImportant(layout,'grid-template-areas','"feed media"');
        } else {
          setImportant(layout,'grid-template-columns','minmax(0,1fr)');
          setImportant(layout,'grid-template-areas','"feed"');
        }
      } else {
        clearStyle(layout,'grid-template-columns');
        clearStyle(layout,'grid-template-areas');
      }
    }

    this._syncMediaGalleryScroll();
  },

  _syncMediaGalleryScroll() {
    const card=this.shadowRoot?.querySelector?.('.card');
    // Media is deliberately absent from the full-card playback workspace. Do
    // not let a stale gallery state reapply workstation height/flex rules while
    // a clip is occupying the single playback pane.
    if(card?.classList?.contains?.('playback-fullcard')) return;
    if(!this._galleryMode) return;
    const media=this.shadowRoot?.querySelector?.('.workspace-media');
    const gallery=this.shadowRoot?.querySelector?.('#media-gallery');
    const grid=this.shadowRoot?.querySelector?.('.media-gallery-grid');
    if(!card||!media||!gallery||!grid) return;

    const timelineEnabled=this._config?.timeline?.enabled!==false;
    const split=card.classList.contains('dashboard-split');
    const workstation=card.classList.contains('workstation');
    const sideBySide=workstation || (split && !timelineEnabled);

    setImportant(gallery,'min-height','0');
    setImportant(grid,'min-height','0');
    setImportant(grid,'overflow-y','auto');
    setImportant(grid,'overflow-x','hidden');
    setImportant(grid,'overscroll-behavior','contain');
    setImportant(grid,'touch-action','pan-y');
    setImportant(grid,'-webkit-overflow-scrolling','touch');
    setImportant(grid,'scrollbar-gutter','stable');

    if(sideBySide){
      setImportant(media,'height','var(--workspace-column-h,auto)');
      setImportant(media,'min-height','0');
      setImportant(media,'overflow','hidden');
      setImportant(media,'flex-direction','column');
      setImportant(gallery,'display','flex');
      setImportant(gallery,'flex-direction','column');
      setImportant(gallery,'height','100%');
      setImportant(gallery,'max-height','none');
      setImportant(gallery,'overflow','hidden');
      setImportant(grid,'flex','1 1 0');
      setImportant(grid,'height','auto');
      setImportant(grid,'max-height','none');
    } else {
      clearStyle(media,'height');
      clearStyle(media,'min-height');
      clearStyle(media,'overflow');
      setImportant(gallery,'display','flex');
      setImportant(gallery,'flex-direction','column');
      setImportant(gallery,'height','auto');
      setImportant(gallery,'max-height','none');
      clearStyle(gallery,'overflow');
      setImportant(grid,'flex','0 1 auto');
      setImportant(grid,'height','auto');
      // Replace the old hard-coded four-row browser with a viewport-aware cap.
      // Short result sets shrink naturally; long sets scroll without making the
      // whole Lovelace card grow indefinitely.
      const cap=Number(this._cardWidth||0)<420
        ? 'clamp(220px,52dvh,520px)'
        : 'clamp(240px,52dvh,620px)';
      setImportant(grid,'max-height',cap);
    }
  },

  _syncColHeight() {
    if(!this.shadowRoot?.querySelector) return;
    const card=this.shadowRoot.querySelector('.card');
    if(card?.classList?.contains?.('playback-fullcard')){
      // The remembered live/grid column height belongs to Multiview, not to
      // full-card playback. Leaving it set allows wide-pane sizing rules to
      // preserve empty vertical space even after those panes are hidden.
      card.style?.removeProperty?.('--workspace-column-h');
      return;
    }
    layoutMethods._syncColHeight.call(this);
    requestAnimationFrame(()=>this._syncMediaGalleryScroll());
  },

  _renderGallery(force=false) {
    const result=browserMethods._renderGallery.call(this,force);
    this._syncMediaGalleryScroll();
    return result;
  },

  async _applyInitialMediaState() {
    // Establish workstation/split classes before default_tab opens a gallery.
    // This keeps the already-mounted live feed visible on wide dashboards from
    // the first paint instead of waiting for ResizeObserver to correct layout.
    this._syncResponsiveWorkspace();
    const result=await coreMethods._applyInitialMediaState.call(this);
    this._syncResponsiveWorkspace();

    if(this._galleryMode && this.shadowRoot?.querySelector?.('.card')?.classList.contains('dashboard-split') && !this._playing){
      if(this._viewMode==='grid'){
        const grid=this.shadowRoot.querySelector('#cam-grid');
        if(grid && !grid.children?.length && typeof this._mountGrid==='function') await this._mountGrid();
      } else if(!this._engine && typeof this._mountEngine==='function') {
        await this._mountEngine();
      }
      const video=this._go2rtcLive?.video || this._findVideo?.(this._engine);
      if(video?.paused){ try { await video.play(); } catch(_) {} }
    }

    this._syncColHeight();
    return result;
  }
};
