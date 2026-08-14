import { SightlineCard } from './SightlineCard.js';
import { applyMethodGroups } from '../utils/apply-method-groups.js';
import { multiRecordingMethods } from './multi-recording.js';
import { responsiveUxMethods } from './responsive-ux.js';
import { iosTimelineDateMethods } from './ios-timeline-date.js';
import { v115HardeningMethods } from './v115-hardening.js';

applyMethodGroups(SightlineCard.prototype, multiRecordingMethods, responsiveUxMethods, iosTimelineDateMethods, v115HardeningMethods);

// v1.1.5's hardening click layer owns the new live-audio control and the
// post-drag click suppression. The existing multi-recording click layer owns
// timeline legend filtering. Preserve both parts of the click chain instead of
// letting the hardening layer skip directly to browserMethods._click().
const hardenedClick=SightlineCard.prototype._click;
SightlineCard.prototype._click=function(event){
  if(event?.target?.closest?.('[data-legend-label]')){
    return multiRecordingMethods._click.call(this,event);
  }
  return hardenedClick.call(this,event);
};

// The v1.1.0 grid-playback wrapper used ordinary inline styles to collapse the
// responsive desktop workspace. Workstation CSS intentionally uses !important,
// so those declarations could win and leave a clip squeezed beside the hidden
// timeline/browser columns. Reassert the playback geometry with inline
// !important priority, then let the existing _showLive() restoration remove it.
const enterPlayback=SightlineCard.prototype._enter;
const showLive=SightlineCard.prototype._showLive;
const renderTimeline=SightlineCard.prototype._renderTimeline;

SightlineCard.prototype._enter=function(...args){
  const fromGrid=this._viewMode==='grid';
  const result=enterPlayback.apply(this,args);
  const card=this.shadowRoot?.querySelector('.card');
  const feed=this.shadowRoot?.querySelector('.workspace-feed');
  const timeline=this.shadowRoot?.querySelector('.workspace-timeline');
  const media=this.shadowRoot?.querySelector('.workspace-media');
  const layout=this.shadowRoot?.querySelector('.layout');
  const engWrap=this.shadowRoot?.querySelector('#eng-wrap');
  const grid=this.shadowRoot?.querySelector('#cam-grid');

  if(fromGrid){
    card?.classList.add('playback-fullcard');
    layout?.style.setProperty('grid-template-columns','minmax(0, 1fr)','important');
    layout?.style.setProperty('grid-template-areas','"feed"','important');
    feed?.style.setProperty('grid-column','1 / -1','important');
    feed?.style.setProperty('grid-row','1','important');
    timeline?.style.setProperty('display','none','important');
    media?.style.setProperty('display','none','important');
    engWrap?.style.setProperty('display','block','important');
    engWrap?.style.setProperty('width','100%','important');
    engWrap?.style.setProperty('max-width','none','important');
    grid?.style.setProperty('display','none','important');
  }

  // The explicit playback return control should be easy to find without
  // covering a large portion of the video, especially on laptop-sized cards.
  const back=engWrap?.querySelector('#playback-back-live');
  if(back){
    back.style.setProperty('left','10px');
    back.style.setProperty('top','10px');
    back.style.setProperty('gap','5px');
    back.style.setProperty('min-height','30px');
    back.style.setProperty('padding','5px 9px');
    back.style.setProperty('font-size','11px');
    const icon=back.querySelector('svg');
    if(icon){icon.style.width='13px';icon.style.height='13px';}
  }
  return result;
};

SightlineCard.prototype._showLive=function(...args){
  const result=showLive.apply(this,args);
  this.shadowRoot?.querySelector('.card')?.classList.remove('playback-fullcard');
  // Re-run the responsive visibility pass after the high-priority playback
  // overrides have been restored by the v1.1.0 wrapper.
  this._syncResponsiveWorkspace?.();
  return result;
};

SightlineCard.prototype._renderTimeline=function(...args){
  const result=renderTimeline.apply(this,args);
  // Keep the calendar's visible date badge in lock-step with panning, scrubbing
  // and recorded playback instead of updating it only when the picker closes.
  this._updateTimelineDateLabel?.();
  return result;
};
