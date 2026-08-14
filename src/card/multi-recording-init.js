import { SightlineCard } from './SightlineCard.js';
import { applyMethodGroups } from '../utils/apply-method-groups.js';
import { multiRecordingMethods } from './multi-recording.js';
import { responsiveUxMethods } from './responsive-ux.js';
import { v115Methods } from './v115.js';

applyMethodGroups(SightlineCard.prototype,multiRecordingMethods,responsiveUxMethods,v115Methods);

const enterPlayback=SightlineCard.prototype._enter;
const showLive=SightlineCard.prototype._showLive;

SightlineCard.prototype._enter=function(...args){
  const fromGrid=this._viewMode==='grid',result=enterPlayback.apply(this,args);
  const q=s=>this.shadowRoot?.querySelector(s),card=q('.card'),feed=q('.workspace-feed'),timeline=q('.workspace-timeline'),media=q('.workspace-media'),layout=q('.layout'),eng=q('#eng-wrap'),grid=q('#cam-grid');
  if(fromGrid){
    card?.classList.add('playback-fullcard');
    layout?.style.setProperty('grid-template-columns','minmax(0, 1fr)','important');
    layout?.style.setProperty('grid-template-areas','"feed"','important');
    feed?.style.setProperty('grid-column','1 / -1','important');feed?.style.setProperty('grid-row','1','important');
    timeline?.style.setProperty('display','none','important');media?.style.setProperty('display','none','important');
    eng?.style.setProperty('display','block','important');eng?.style.setProperty('width','100%','important');eng?.style.setProperty('max-width','none','important');
    grid?.style.setProperty('display','none','important');
  }
  const back=eng?.querySelector('#playback-back-live');
  if(back){
    for(const [k,v] of [['left','10px'],['top','10px'],['gap','5px'],['min-height','30px'],['padding','5px 9px'],['font-size','11px']])back.style.setProperty(k,v);
    const icon=back.querySelector('svg');if(icon){icon.style.width='13px';icon.style.height='13px';}
  }
  return result;
};

SightlineCard.prototype._showLive=function(...args){
  const result=showLive.apply(this,args);
  this.shadowRoot?.querySelector('.card')?.classList.remove('playback-fullcard');
  this._syncResponsiveWorkspace?.();
  return result;
};
