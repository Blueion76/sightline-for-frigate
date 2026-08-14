/**
 * Full-card playback presentation and return-to-live layout restoration.
 *
 * Playback transport remains owned by eventPlaybackMethods. This module only
 * adapts the surrounding dashboard workspace when media replaces a Multiview
 * feed, so layout policy is not mixed into decoding or Frigate media logic.
 */
import { ICONS } from '../../constants.js';
import { eventPlaybackMethods } from '../event-playback.js';

const PLAYBACK_BACK_STYLE = [
  'position:absolute',
  'left:10px',
  'top:10px',
  'z-index:80',
  'display:inline-flex',
  'align-items:center',
  'gap:5px',
  'min-height:30px',
  'padding:5px 9px',
  'border:1px solid rgba(255,255,255,.24)',
  'border-radius:999px',
  'background:rgba(16,16,18,.72)',
  'color:#fff',
  'font:650 11px/1 -apple-system,BlinkMacSystemFont,system-ui,sans-serif',
  'box-shadow:0 5px 18px rgba(0,0,0,.30)',
  'backdrop-filter:blur(16px) saturate(160%)',
  '-webkit-backdrop-filter:blur(16px) saturate(160%)',
  'cursor:pointer',
  'appearance:none',
  '-webkit-appearance:none',
].join(';');

function queryPlaybackWorkspace(card) {
  const query=(selector)=>card.shadowRoot?.querySelector?.(selector);
  return {
    card: query('.card'),
    feed: query('.workspace-feed'),
    timeline: query('.workspace-timeline'),
    media: query('.workspace-media'),
    layout: query('.layout'),
    engine: query('#eng-wrap'),
    grid: query('#cam-grid'),
    camSwitcher: query('#cam-switcher'),
  };
}

function saveStyle(element,key,property) {
  if(!element) return;
  element.dataset[key]=element.style.getPropertyValue(property)||'';
}

function restoreStyle(element,key,property) {
  if(!element||!(key in element.dataset)) return;
  const value=element.dataset[key];
  if(value) element.style.setProperty(property,value);
  else element.style.removeProperty(property);
  delete element.dataset[key];
}

function showPlaybackReturnButton(card,engine,returnToGrid) {
  if(!engine) return;
  let button=engine.querySelector('#playback-back-live');
  if(!button) {
    button=document.createElement('button');
    button.type='button';
    button.id='playback-back-live';
    button.style.cssText=PLAYBACK_BACK_STYLE;
    engine.appendChild(button);
  }
  const label=returnToGrid?'Back to Multiview':'Back to Live';
  button.hidden=false;
  button.style.display='inline-flex';
  button.innerHTML=`${ICONS.back}<span>${label}</span>`;
  button.title=label;
  button.setAttribute('aria-label',label);
  button.onclick=()=>card._showLive();
  const icon=button.querySelector('svg');
  if(icon) {
    icon.style.width='13px';
    icon.style.height='13px';
  }
}

export const playbackLayoutMethods = {
  _enter(...args) {
    const returnToGrid=this._viewMode==='grid';
    if(returnToGrid&&!this._playbackReturnViewMode) this._playbackReturnViewMode='grid';
    const result=eventPlaybackMethods._enter.apply(this,args);
    const workspace=queryPlaybackWorkspace(this);

    if(returnToGrid) {
      workspace.card?.classList.add('playback-fullcard');
      saveStyle(workspace.card,'playbackColumnHeight','--workspace-column-h');
      saveStyle(workspace.layout,'playbackDisplay','display');
      saveStyle(workspace.layout,'playbackGridColumns','grid-template-columns');
      saveStyle(workspace.layout,'playbackGridAreas','grid-template-areas');
      saveStyle(workspace.feed,'playbackDisplay','display');
      saveStyle(workspace.feed,'playbackGridColumn','grid-column');
      saveStyle(workspace.feed,'playbackGridRow','grid-row');
      saveStyle(workspace.feed,'playbackWidth','width');
      saveStyle(workspace.feed,'playbackHeight','height');
      saveStyle(workspace.feed,'playbackMinHeight','min-height');
      saveStyle(workspace.feed,'playbackMaxHeight','max-height');
      saveStyle(workspace.timeline,'playbackDisplay','display');
      saveStyle(workspace.media,'playbackDisplay','display');
      saveStyle(workspace.engine,'playbackDisplay','display');
      saveStyle(workspace.engine,'playbackWidth','width');
      saveStyle(workspace.engine,'playbackMaxWidth','max-width');
      saveStyle(workspace.grid,'playbackDisplay','display');
      saveStyle(workspace.camSwitcher,'playbackDisplay','display');

      // Multiview synchronizes timeline/media heights to the live grid column.
      // That measurement is meaningless once playback becomes a single pane and
      // was responsible for preserving a large empty area on wide dashboards.
      workspace.card?.style.removeProperty('--workspace-column-h');

      // Use a true one-pane flow instead of leaving a CSS Grid with hidden
      // workstation children. This also prevents an accidental responsive
      // re-show from creating an implicit grid track beside/below playback.
      workspace.layout?.style.setProperty('display','block','important');
      workspace.layout?.style.setProperty('grid-template-columns','minmax(0, 1fr)','important');
      workspace.layout?.style.setProperty('grid-template-areas','"feed"','important');
      workspace.feed?.style.setProperty('display','block','important');
      workspace.feed?.style.setProperty('grid-column','1 / -1','important');
      workspace.feed?.style.setProperty('grid-row','1','important');
      workspace.feed?.style.setProperty('width','100%','important');
      workspace.feed?.style.setProperty('height','auto','important');
      workspace.feed?.style.setProperty('min-height','0','important');
      workspace.feed?.style.setProperty('max-height','none','important');
      workspace.timeline?.style.setProperty('display','none','important');
      workspace.media?.style.setProperty('display','none','important');
      workspace.engine?.style.setProperty('display','block','important');
      workspace.engine?.style.setProperty('width','100%','important');
      workspace.engine?.style.setProperty('max-width','none','important');
      workspace.grid?.style.setProperty('display','none','important');
      workspace.camSwitcher?.style.setProperty('display','none','important');
    }

    showPlaybackReturnButton(this,workspace.engine,returnToGrid);
    return result;
  },

  _showLive(...args) {
    const returnToGrid=this._playbackReturnViewMode==='grid';
    const returningFromPlayback=Boolean(
      this._playing || this._activePlaybackCleanup || this._playbackSession || this._playbackReturnViewMode
    );
    const result=eventPlaybackMethods._showLive.apply(this,args);
    this._playbackReturnViewMode=null;
    const workspace=queryPlaybackWorkspace(this);
    const back=workspace.engine?.querySelector('#playback-back-live');

    if(back) {
      back.hidden=true;
      back.style.display='none';
    }
    workspace.card?.classList.remove('playback-fullcard');
    restoreStyle(workspace.card,'playbackColumnHeight','--workspace-column-h');
    restoreStyle(workspace.layout,'playbackDisplay','display');
    restoreStyle(workspace.layout,'playbackGridColumns','grid-template-columns');
    restoreStyle(workspace.layout,'playbackGridAreas','grid-template-areas');
    restoreStyle(workspace.feed,'playbackDisplay','display');
    restoreStyle(workspace.feed,'playbackGridColumn','grid-column');
    restoreStyle(workspace.feed,'playbackGridRow','grid-row');
    restoreStyle(workspace.feed,'playbackWidth','width');
    restoreStyle(workspace.feed,'playbackHeight','height');
    restoreStyle(workspace.feed,'playbackMinHeight','min-height');
    restoreStyle(workspace.feed,'playbackMaxHeight','max-height');
    restoreStyle(workspace.timeline,'playbackDisplay','display');
    restoreStyle(workspace.media,'playbackDisplay','display');
    restoreStyle(workspace.engine,'playbackDisplay','display');
    restoreStyle(workspace.engine,'playbackWidth','width');
    restoreStyle(workspace.engine,'playbackMaxWidth','max-width');
    restoreStyle(workspace.grid,'playbackDisplay','display');
    restoreStyle(workspace.camSwitcher,'playbackDisplay','display');

    if(returnToGrid) {
      if(workspace.engine) workspace.engine.style.display='none';
      if(workspace.grid) workspace.grid.style.display='';
      this._eventsMode='all';
      this._mountGrid();
      this._renderCamSwitcher();
    }
    this._syncResponsiveWorkspace?.();
    // Full-card playback temporarily changes the Multiview workspace and can
    // cross a card/layout lifecycle boundary in desktop Home Assistant. Refresh
    // the complete scrub binding set only when actually returning from media.
    if(returningFromPlayback) this._refreshTimelineInteractionWiring?.(true);
    // Re-measure the restored grid/timeline only after normal responsive
    // visibility is back. This prevents the playback player's height from being
    // reused as the next Multiview synchronized-column height.
    if(returnToGrid) requestAnimationFrame(()=>this._syncColHeight?.());
    return result;
  },
};
