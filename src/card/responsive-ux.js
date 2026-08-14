import { coreMethods } from './core.js';
import { layoutMethods } from './layout.js';
import { browserMethods } from './browser.js';

function localDateValue(ts) {
  const d=new Date(Number(ts||Date.now()/1000)*1000);
  const y=d.getFullYear();
  const m=String(d.getMonth()+1).padStart(2,'0');
  const day=String(d.getDate()).padStart(2,'0');
  return `${y}-${m}-${day}`;
}

function clearStyle(el, prop) {
  try { el?.style?.removeProperty?.(prop); } catch(_) {}
}

function setImportant(el, prop, value) {
  try { el?.style?.setProperty?.(prop,value,'important'); } catch(_) {}
}

export const responsiveUxMethods = {
  _prepareTimelineNativeDateInput(input) {
    if(!input) return null;
    const focus=Number.isFinite(Number(this._timelineFocusTs))
      ? Number(this._timelineFocusTs)
      : (Number.isFinite(Number(this._winStart))&&Number.isFinite(Number(this._winEnd))
        ? (Number(this._winStart)+Number(this._winEnd))/2
        : Date.now()/1000);
    input.value=localDateValue(focus);
    input.max=localDateValue(Date.now()/1000);
    return input;
  },

  _ensureTimelineNativeDateInput() {
    const root=this.shadowRoot;
    if(!root?.querySelector) return null;
    let input=root.querySelector('#timeline-native-date');
    if(input) return input;

    const oldButton=root.querySelector('#cal-btn');
    if(!oldButton?.parentNode) return null;

    // iOS Safari/WKWebView often refuses showPicker()/click() when the date
    // input is hidden/offscreen, even if that call originated from a visible
    // button. Replace the visual button with an equivalent non-button host and
    // put the REAL native date input directly over its full hit target. The
    // user's finger therefore lands on <input type="date"> itself and WebKit
    // owns the activation gesture from the beginning.
    const host=document.createElement('span');
    host.id='cal-btn';
    host.className=oldButton.className || 'tool';
    host.title=oldButton.title || 'Calendar';
    host.setAttribute('aria-hidden','false');
    host.style.position='relative';
    host.innerHTML=oldButton.innerHTML;

    input=document.createElement('input');
    input.id='timeline-native-date';
    input.type='date';
    input.setAttribute('aria-label','Timeline date');
    input.style.cssText='position:absolute;inset:0;width:100%;height:100%;min-width:100%;min-height:100%;opacity:0;pointer-events:auto;cursor:pointer;border:0;padding:0;margin:0;z-index:5;background:transparent;color:transparent;font-size:16px;-webkit-appearance:none;appearance:none;';

    const prepare=()=>this._prepareTimelineNativeDateInput(input);
    // Prepare before WebKit performs the input's native default action. Do not
    // preventDefault: doing so would suppress the iOS system date picker.
    input.addEventListener('pointerdown',prepare,{capture:true,passive:true});
    input.addEventListener('touchstart',prepare,{capture:true,passive:true});
    input.addEventListener('focus',prepare,{passive:true});
    // The card has delegated click/change handlers for other controls. Keep the
    // native input's events from bubbling into #cal-btn and triggering the old
    // programmatic picker path after iOS has already accepted the direct tap.
    input.addEventListener('click',e=>e.stopPropagation());
    input.addEventListener('change',e=>{
      e.stopPropagation();
      const value=input.value;
      if(value) this._pickDay(value);
      try { input.blur(); } catch(_) {}
    });

    host.appendChild(input);
    oldButton.parentNode.replaceChild(host,oldButton);
    this._prepareTimelineNativeDateInput(input);
    return input;
  },

  _toggleCal() {
    // Normal interaction is direct through the overlaid native input. Keep this
    // path only as a desktop/keyboard fallback if a synthetic click reaches the
    // visual host instead of the input itself.
    const oldPanel=this.shadowRoot?.querySelector?.('#cal-panel');
    if(oldPanel) oldPanel.style.display='none';
    const input=this._ensureTimelineNativeDateInput();
    if(!input) return;
    this._prepareTimelineNativeDateInput(input);
    try {
      if(typeof input.showPicker==='function') input.showPicker();
      else input.click();
    } catch(_) {
      try { input.click(); } catch(_) {}
    }
  },

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
    if(this._config?.timeline?.show_calendar_button!==false) this._ensureTimelineNativeDateInput();

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

    const showTimeline=timelineEnabled && (!galleryOpen || split);
    if(showTimeline){
      clearStyle(timelineWrap,'display');
      clearStyle(timeline,'display');
    } else {
      setImportant(timelineWrap,'display','none');
      setImportant(timeline,'display','none');
    }

    if(galleryOpen){
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
    // these templates eliminate that dead track entirely.
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
    if(!this._galleryMode) return;
    const card=this.shadowRoot?.querySelector?.('.card');
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
