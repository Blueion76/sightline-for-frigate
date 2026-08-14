import assert from 'node:assert/strict';
import { responsiveUxMethods } from '../src/card/responsive-ux.js';
import { timelineCalendarMethods } from '../src/card/timeline/calendar.js';

class StyleMock {
  constructor(){ this.values=new Map(); this.priority=new Map(); }
  setProperty(name,value,priority=''){ this.values.set(name,String(value)); this.priority.set(name,String(priority||'')); }
  removeProperty(name){ const old=this.values.get(name)||''; this.values.delete(name); this.priority.delete(name); return old; }
  getPropertyValue(name){ return this.values.get(name)||''; }
  getPropertyPriority(name){ return this.priority.get(name)||''; }
}

class ClassListMock {
  constructor(...items){ this.items=new Set(items); }
  contains(name){ return this.items.has(name); }
  add(name){ this.items.add(name); }
  remove(name){ this.items.delete(name); }
  toggle(name,on){ if(on===undefined){ if(this.items.has(name)){this.items.delete(name);return false;} this.items.add(name);return true; } if(on)this.items.add(name);else this.items.delete(name); return !!on; }
}

function el(classes=[]){
  return {
    style:new StyleMock(),
    classList:new ClassListMock(...classes),
    attrs:new Map(),
    children:[],
    setAttribute(name,value){this.attrs.set(name,String(value));},
    getAttribute(name){return this.attrs.get(name)||null;},
    querySelector(){return null;},
    getBoundingClientRect(){return {width:0,height:500};},
    offsetHeight:500
  };
}

function workspace(width,{timeline=true,gallery='clips'}={}){
  const card=el(['card']);
  const layout=el(['layout']);
  const feed=el(['workspace-feed']);
  const timelineWrap=el(['workspace-timeline']);
  const timelineView=el(['timeline-view']);
  const media=el(['workspace-media']);
  const engWrap=el();
  const camGrid=el();
  const galleryEl=el(['media-gallery','open']); galleryEl.id='media-gallery';
  const mediaGrid=el(['media-gallery-grid']);
  const map=new Map([
    ['.card',card],['.layout',layout],['.workspace-feed',feed],['.workspace-timeline',timelineWrap],
    ['#timeline-view',timelineView],['.workspace-media',media],['#eng-wrap',engWrap],['#cam-grid',camGrid],
    ['#media-gallery',galleryEl],['.media-gallery-grid',mediaGrid]
  ]);
  const ctx={
    _cardWidth:0,
    _galleryMode:gallery,
    _config:{timeline:{enabled:timeline,show_calendar_button:true},default_tab:'live'},
    _viewMode:'single',
    _playing:null,
    _engine:{},
    clientWidth:width,
    offsetWidth:width,
    getBoundingClientRect:()=>({width,height:600}),
    _isEditorPreview:()=>false,
    shadowRoot:{querySelector:sel=>map.get(sel)||null},
    _ensureTimelineNativeDateInput:()=>null,
    _measureResponsiveCardWidth:responsiveUxMethods._measureResponsiveCardWidth,
    _syncMediaGalleryScroll:responsiveUxMethods._syncMediaGalleryScroll
  };
  return {ctx,card,layout,feed,timelineWrap,timelineView,media,engWrap,camGrid,galleryEl,mediaGrid};
}

// Workstation layout must derive columns from visible panes. Disabling the
// timeline removes its track completely instead of leaving a blank middle gap.
{
  const w=workspace(1400,{timeline:true,gallery:'clips'});
  responsiveUxMethods._syncResponsiveWorkspace.call(w.ctx);
  assert.equal(w.card.classList.contains('workstation'),true);
  assert.equal(w.layout.style.getPropertyValue('grid-template-areas'),'"feed timeline media"');
  assert.equal(w.media.style.getPropertyValue('display'),'flex');

  w.ctx._config.timeline.enabled=false;
  responsiveUxMethods._syncResponsiveWorkspace.call(w.ctx);
  assert.equal(w.layout.style.getPropertyValue('grid-template-areas'),'"feed media"');
  assert.equal(w.layout.style.getPropertyValue('grid-template-areas').includes('timeline'),false);
  assert.equal(w.timelineWrap.style.getPropertyValue('display'),'none');
  assert.equal(w.timelineView.style.getPropertyValue('display'),'none');
  assert.equal(w.media.style.getPropertyValue('height'),'var(--workspace-column-h,auto)');
  assert.equal(w.mediaGrid.style.getPropertyValue('flex'),'1 1 0');
  assert.equal(w.mediaGrid.style.getPropertyValue('overflow-y'),'auto');

  w.ctx._galleryMode='';
  responsiveUxMethods._syncResponsiveWorkspace.call(w.ctx);
  assert.equal(w.layout.style.getPropertyValue('grid-template-areas'),'"feed"');
  assert.equal(w.media.style.getPropertyValue('display'),'none');
}

// Medium split cards also collapse the missing timeline and use the freed
// column for the browser rather than stacking a blank timeline beside Live.
{
  const w=workspace(940,{timeline:false,gallery:'recordings'});
  responsiveUxMethods._syncResponsiveWorkspace.call(w.ctx);
  assert.equal(w.card.classList.contains('dashboard-split'),true);
  assert.equal(w.card.classList.contains('workstation'),false);
  assert.equal(w.layout.style.getPropertyValue('grid-template-areas'),'"feed media"');
  assert.equal(w.media.style.getPropertyValue('display'),'flex');
  assert.equal(w.mediaGrid.style.getPropertyValue('overflow-y'),'auto');
}

// Narrow browser pages remain stacked, but their list height is no longer a
// fixed four-row box. All three media tabs use a touch-friendly responsive cap.
for(const mode of ['clips','recordings','reviews']){
  const w=workspace(390,{timeline:true,gallery:mode});
  responsiveUxMethods._syncResponsiveWorkspace.call(w.ctx);
  assert.equal(w.card.classList.contains('dashboard-split'),false);
  assert.equal(w.media.style.getPropertyValue('display'),'block');
  assert.equal(w.timelineWrap.style.getPropertyValue('display'),'none');
  assert.equal(w.mediaGrid.style.getPropertyValue('height'),'auto');
  assert.equal(w.mediaGrid.style.getPropertyValue('max-height'),'clamp(220px,52dvh,520px)');
  assert.equal(w.mediaGrid.style.getPropertyValue('touch-action'),'pan-y');
  assert.equal(w.mediaGrid.style.getPropertyValue('-webkit-overflow-scrolling'),'touch');
}

// Full-card playback is a hard responsive visibility state. A workstation
// resize/reconcile must not resurrect timeline/media panes into the one-area
// playback layout or preserve the old synchronized Multiview column height.
{
  const w=workspace(1400,{timeline:true,gallery:'clips'});
  w.card.classList.add('playback-fullcard');
  w.layout.style.setProperty('display','block','important');
  w.layout.style.setProperty('grid-template-areas','"feed"','important');
  w.timelineWrap.style.setProperty('display','none','important');
  w.timelineView.style.setProperty('display','none','important');
  w.media.style.setProperty('display','none','important');
  w.card.style.setProperty('--workspace-column-h','812px');

  responsiveUxMethods._syncResponsiveWorkspace.call(w.ctx);
  assert.equal(w.card.classList.contains('workstation'),true);
  assert.equal(w.layout.style.getPropertyValue('grid-template-areas'),'"feed"','responsive reconciliation must preserve the playback-only grid');
  assert.equal(w.timelineWrap.style.getPropertyValue('display'),'none','timeline wrapper must remain hidden during playback');
  assert.equal(w.timelineView.style.getPropertyValue('display'),'none','timeline view must remain hidden during playback');
  assert.equal(w.media.style.getPropertyValue('display'),'none','media pane must remain hidden during playback');
  assert.equal(w.media.getAttribute('aria-hidden'),'true');
  assert.equal(w.engWrap.style.getPropertyValue('display'),'block','recorded player wrapper must stay visible');
  assert.equal(w.camGrid.style.getPropertyValue('display'),'none','Multiview grid must stay hidden during full-card playback');

  responsiveUxMethods._syncColHeight.call(w.ctx);
  assert.equal(w.card.style.getPropertyValue('--workspace-column-h'),'','full-card playback must drop the stale Multiview column height');
}

// iOS must receive a direct native-input gesture. The visible calendar button
// is replaced by an equivalent span host with a transparent input[type=date]
// stretched over the entire hit target. No showPicker()/synthetic click is
// required for the normal pointer/touch path.
{
  const oldDocument=globalThis.document;
  const listeners={};
  let input=null;
  let replacement=null;
  const parent={
    replaceChild(next,old){ replacement=next; next.parentNode=this; old.parentNode=null; }
  };
  const button={
    id:'cal-btn',className:'tool',title:'Calendar',innerHTML:'CAL',parentNode:parent
  };
  function makeNode(tag){
    const node={
      tagName:String(tag).toUpperCase(),id:'',type:'',value:'',max:'',className:'',title:'',innerHTML:'',children:[],
      style:{cssText:'',position:''},attrs:new Map(),parentNode:null,blurCount:0,showCount:0,clickCount:0,
      setAttribute(name,value){this.attrs.set(name,String(value));},
      appendChild(child){this.children.push(child);child.parentNode=this;},
      addEventListener(name,fn){(listeners[name]??=[]).push(fn);},
      showPicker(){this.showCount++;},click(){this.clickCount++;},blur(){this.blurCount++;},
      fire(name,event={}){for(const fn of listeners[name]||[]) fn({target:this,stopPropagation(){event.stopped=true;},...event});}
    };
    if(tag==='input') input=node;
    return node;
  }
  globalThis.document={createElement:makeNode};
  const root={
    querySelector(sel){
      if(sel==='#timeline-native-date') return replacement?.children?.find?.(x=>x.id==='timeline-native-date')||null;
      if(sel==='#cal-btn') return replacement||button;
      if(sel==='#cal-panel') return {style:{display:'block'}};
      return null;
    }
  };
  let picked='';
  const focus=Math.floor(new Date(2026,7,12,15,30,0,0).getTime()/1000);
  const ctx={
    shadowRoot:root,_timelineFocusTs:focus,_winStart:focus-300,_winEnd:focus+300,
    _prepareTimelineNativeDateInput:timelineCalendarMethods._prepareTimelineNativeDateInput,
    _updateTimelineDateLabel:timelineCalendarMethods._updateTimelineDateLabel,
    _pickDay:value=>{picked=value;}
  };
  const native=timelineCalendarMethods._ensureTimelineNativeDateInput.call(ctx);
  assert.equal(native,input);
  assert.equal(replacement.tagName,'SPAN');
  assert.equal(replacement.id,'cal-btn');
  assert.equal(native.type,'date');
  assert.match(native.style.cssText,/inset:0/);
  assert.match(native.style.cssText,/pointer-events:auto/);
  assert.equal(native.showCount,0,'direct iOS path must not require showPicker()');
  assert.equal(native.clickCount,0,'direct iOS path must not require synthetic click()');

  // After the user scrubs, pointerdown/touchstart refreshes the date before
  // WebKit performs the native input default action.
  ctx._timelineFocusTs=Math.floor(new Date(2026,7,18,9,5,0,0).getTime()/1000);
  native.fire('pointerdown');
  assert.equal(native.value,'2026-08-18');
  native.value='2026-08-09';
  native.fire('change');
  assert.equal(picked,'2026-08-09');
  assert.equal(native.blurCount,1);

  const clickEvent={stopped:false};
  native.fire('click',clickEvent);
  assert.equal(clickEvent.stopped,true,'native input click must not bubble into the synthetic calendar handler');
  globalThis.document=oldDocument;
}

// A default media tab is applied before ResizeObserver is installed. The
// synchronous width pass must still classify a wide card immediately and make
// sure a missing Live engine is mounted alongside that gallery.
{
  const oldRaf=globalThis.requestAnimationFrame;
  globalThis.requestAnimationFrame=fn=>{fn();return 1;};
  const w=workspace(1360,{timeline:true,gallery:''});
  w.ctx._galleryMode='';
  w.ctx._config.default_tab='clips';
  w.ctx._config.autoplay_latest_clip=false;
  w.ctx._initialMediaStateApplied=false;
  w.ctx._engine=null;
  w.ctx._eventsMode='camera';
  w.ctx._events=[];
  w.ctx._syncResponsiveWorkspace=responsiveUxMethods._syncResponsiveWorkspace;
  w.ctx._syncColHeight=()=>{};
  w.ctx._setGalleryMode=async tab=>{w.ctx._galleryMode=tab;};
  let mounts=0;
  w.ctx._mountEngine=async()=>{mounts++;w.ctx._engine={};};
  w.ctx._findVideo=()=>null;
  await responsiveUxMethods._applyInitialMediaState.call(w.ctx);
  assert.equal(w.ctx._galleryMode,'clips');
  assert.equal(w.card.classList.contains('workstation'),true);
  assert.equal(w.layout.style.getPropertyValue('grid-template-areas'),'"feed timeline media"');
  assert.equal(mounts,1,'wide Clips-first startup should keep/mount the Live pane');
  globalThis.requestAnimationFrame=oldRaf;
}

console.log('Native timeline picker and responsive media layout regression test passed.');
