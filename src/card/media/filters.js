/**
 * Media filter state, date/time ranges, filtering predicates, and filter UI.
 *
 * Methods are composed onto SightlineCard.prototype; method names are kept
 * stable so existing card behavior and tests remain unchanged.
 */
import { ICONS } from '../../constants.js';

export const mediaFilterMethods = {
_mediaFilterActive() {
    const f=this._mediaFilter;
    const cameraActive=this._eventsMode==='all' && (this._config?.cameras?.length||0)>1 && f.camera!=='all';
    return cameraActive||f.label!=='all'||f.face!=='all'||f.zone!=='all'||f.favorites||f.reviewed!=='all'||f.severity!=='all'||f.duration!=='all'||f.date!=='all'||!!f.timeStart||!!f.timeEnd;
  },

_mediaFilterValues() {
    const f=this._mediaFilter;
    const baseEvents=this._eventsMode==='all'?this._allDisplayEvents():(this._events||[]);
    const baseReviews=this._reviews||[];
    const cams=new Set();
    for(const e of baseEvents) if(e?.camera) cams.add(String(e.camera));
    for(const r of baseReviews) if(r?.camera) cams.add(String(r.camera));
    if(this._cc().cam) cams.add(String(this._cc().cam));
    const selectedCamera=f.camera!=='all'?String(f.camera):null;
    const labels=new Set(), faces=new Set(), zones=new Set();
    const states=this._config.cameras.map(c=>this._camCache[c.entity]).filter(cc=>cc&&cams.has(String(cc.cam||''))&&(!selectedCamera||String(cc.cam)===selectedCamera));
    for(const cc of states) {
      for(const l of (cc.filterLabels||[])) { const label=this._normalizeObjectLabel(l); if(label) labels.add(label); }
      for(const face of (cc.filterFaces||[])) if(face) faces.add(String(face));
      for(const z of (cc.filterZones||[])) if(z) zones.add(String(z));
    }
    for(const e of baseEvents) {
      if(selectedCamera&&String(e?.camera)!==selectedCamera) continue;
      { const label=this._normalizeObjectLabel(e?.label); if(label) labels.add(label); }
      for(const face of this._eventFaceList(e)) faces.add(face);
      for(const z of this._eventZoneList(e)) zones.add(z);
    }
    for(const r of baseReviews) {
      if(selectedCamera&&r?.camera&&String(r.camera)!==selectedCamera) continue;
      for(const l of this._reviewLabelList(r)) labels.add(l);
      for(const face of this._reviewFaceList(r)) faces.add(face);
      for(const z of this._reviewZoneList(r)) zones.add(z);
    }
    return {cams:[...cams].sort(),labels:[...labels].sort(),faces:[...faces].sort((a,b)=>String(a).localeCompare(String(b))),zones:[...zones].sort()};
  },

_normalizeMediaFilterState() {
    let v=this._mediaFilterValues(), f=this._mediaFilter;
    const canFilterCamera=this._eventsMode==='all' && (this._config?.cameras?.length||0)>1;
    if(!canFilterCamera) f.camera='all';
    else if(f.camera!=='all'&&!v.cams.includes(f.camera)) { f.camera='all'; v=this._mediaFilterValues(); }
    if(f.label!=='all'&&!v.labels.includes(f.label)) f.label='all';
    if(f.face!=='all'&&!v.faces.includes(f.face)) f.face='all';
    if(f.zone!=='all'&&!v.zones.includes(f.zone)) f.zone='all';
    return v;
  },

_mediaDateBounds(date) {
    if (!date || date==='all') return null;
    const parts=String(date).split('-').map(Number);
    if (parts.length!==3 || parts.some(n=>!Number.isFinite(n))) return null;
    const [y,mo,d]=parts;
    const start=Math.floor(new Date(y,mo-1,d,0,0,0,0).getTime()/1000);
    const end=Math.floor(new Date(y,mo-1,d+1,0,0,0,0).getTime()/1000);
    return Number.isFinite(start)&&Number.isFinite(end)?{start,end,y,mo,d}:null;
  },

_mediaTimeParts(value) {
    const m=String(value||'').match(/^(\d{1,2}):(\d{2})$/);
    if(!m) return null;
    const h=Number(m[1]), min=Number(m[2]);
    return h>=0&&h<=23&&min>=0&&min<=59?{h,min,minutes:h*60+min}:null;
  },

_mediaAbsoluteBounds() {
    const f=this._mediaFilter, b=this._mediaDateBounds(f.date);
    if(!b) return null;
    const a=this._mediaTimeParts(f.timeStart), z=this._mediaTimeParts(f.timeEnd);
    const startDate=new Date(b.y,b.mo-1,b.d,a?.h??0,a?.min??0,0,0);
    let endDate=new Date(b.y,b.mo-1,b.d,z?.h??24,z?.min??0,0,0);
    if(!z) endDate=new Date(b.y,b.mo-1,b.d+1,0,0,0,0);
    else if(a && z.minutes<=a.minutes) endDate=new Date(b.y,b.mo-1,b.d+1,z.h,z.min,0,0); // overnight range
    const start=Math.floor(startDate.getTime()/1000), end=Math.floor(endDate.getTime()/1000);
    return Number.isFinite(start)&&Number.isFinite(end)&&end>start?{start,end}:b;
  },

_mediaQueryBounds(now=Math.floor(Date.now()/1000)) {
    const abs=this._mediaAbsoluteBounds();
    if(abs) {
      const start=Math.max(0,Math.floor(abs.start));
      const end=Math.max(start+1,Math.min(now,Math.floor(abs.end)));
      return {start,end};
    }
    const span=Math.max(3600,Number(this._config?.window_hours||24)*3600);
    return {start:Math.max(0,now-span),end:now};
  },

_mediaMatchesTimeOfDay(ts) {
    const f=this._mediaFilter, a=this._mediaTimeParts(f.timeStart), z=this._mediaTimeParts(f.timeEnd);
    if(!a&&!z) return true;
    const d=new Date(Number(ts)*1000); if(!Number.isFinite(d.getTime())) return false;
    const m=d.getHours()*60+d.getMinutes();
    if(a&&z) return z.minutes>a.minutes ? (m>=a.minutes&&m<=z.minutes) : (m>=a.minutes||m<=z.minutes);
    if(a) return m>=a.minutes;
    return m<=z.minutes;
  },

_filterByMediaTemporal(items,date,endKey='end_time') {
    const abs=this._mediaAbsoluteBounds();
    if(abs) {
      return (items||[]).filter(x=>{
        const st=Number(x?.start_time), en=Number(x?.[endKey] ?? st);
        return Number.isFinite(st)&&Number.isFinite(en)&&en>=abs.start&&st<abs.end;
      });
    }
    // "All dates" keeps the browser's rolling 24h data set; a time range in
    // that mode is a time-of-day filter across those loaded items.
    return (items||[]).filter(x=>this._mediaMatchesTimeOfDay(Number(x?.start_time)));
  },

async _setMediaTemporal(key,value) {
    if(key==='date') this._mediaFilter.date=value||'all';
    else if(key==='timeStart'||key==='timeEnd') this._mediaFilter[key]=value||'';
    // Browser date/time filtering changes only the browser query. The visible
    // timeline keeps its own zoom/focus range, which is especially important
    // when both are visible together in the wide workspace.
    const tab=this._galleryMode;
    if(!tab){ this._renderGallery(); return; }
    if(tab==='reviews') await this._loadReviews();
    else await this._loadWindow(true);
    if(this._galleryMode===tab) {
      this._renderGallery();
      const p=this.shadowRoot.querySelector('#media-filter-panel');
      if(p) p.classList.add('open');
    }
  },

async _setMediaDate(date) { return this._setMediaTemporal('date',date||'all'); },

_filterMediaEvents(events) {
    const f=this._mediaFilter; let list=this._filterByMediaTemporal((events||[]).filter(e=>e.has_clip!==false),f.date);
    if(f.camera!=='all') list=list.filter(e=>e.camera===f.camera);
    if(f.label!=='all') list=list.filter(e=>this._normalizeObjectLabel(e?.label)===f.label);
    if(f.face!=='all') list=list.filter(e=>this._eventFaceList(e).includes(f.face));
    if(f.zone!=='all') list=list.filter(e=>this._eventZoneList(e).includes(f.zone));
    if(f.favorites) list=list.filter(e=>e.retain_indefinitely||e.is_favorite||e.favorite);
    return list;
  },

_filterMediaRecordings(records) {
    const f=this._mediaFilter; let list=this._filterByMediaTemporal(records||[],f.date);
    if(f.camera!=='all') list=list.filter(r=>!r.camera||r.camera===f.camera);
    if(f.duration==='short') list=list.filter(r=>(r.end_time-r.start_time)<60);
    if(f.duration==='medium') list=list.filter(r=>(r.end_time-r.start_time)>=60&&(r.end_time-r.start_time)<300);
    if(f.duration==='long') list=list.filter(r=>(r.end_time-r.start_time)>=300);
    if(f.favorites) list=list.filter(r=>r.retain_indefinitely||r.favorite||r.is_favorite);
    return list;
  },

_filterMediaReviews(reviews) {
    const f=this._mediaFilter; let list=this._filterByMediaTemporal(reviews||[],f.date);
    if(f.camera!=='all') list=list.filter(r=>!r.camera||r.camera===f.camera);
    if(f.label!=='all') list=list.filter(r=>this._reviewLabelList(r).includes(f.label));
    if(f.face!=='all') list=list.filter(r=>this._reviewFaceList(r).includes(f.face));
    if(f.zone!=='all') list=list.filter(r=>this._reviewZoneList(r).includes(f.zone));
    if(f.reviewed==='unreviewed') list=list.filter(r=>!r.has_been_reviewed);
    if(f.reviewed==='reviewed') list=list.filter(r=>!!r.has_been_reviewed);
    if(f.severity!=='all') list=list.filter(r=>r.severity===f.severity);
    return list;
  },

_toggleMediaFilter() {
    const p=this.shadowRoot.querySelector('#media-filter-panel'); if(!p) return;
    const opening=!p.classList.contains('open');
    if(opening) this._loadFrigateFilterMetadata();
    p.classList.toggle('open');
    this._renderMediaFilter();
  },

_setMediaFilter(key,value) {
    if(key==='date') return this._setMediaDate(value);
    if(key==='timeStart' && value===''){
      this._mediaFilter.timeStart=''; this._mediaFilter.timeEnd='';
      return this._setMediaTemporal('timeStart','');
    }
    if(key==='favorites') this._mediaFilter.favorites=value==='1'; else this._mediaFilter[key]=value;
    this._normalizeMediaFilterState();
    this._renderGallery(); const p=this.shadowRoot.querySelector('#media-filter-panel'); if(p) p.classList.add('open');
  },

_resetMediaFilter() {
    // Reset browser filters without touching the timeline viewport.
    this._mediaFilter={camera:'all',label:'all',face:'all',zone:'all',favorites:false,reviewed:this._config?.media?.reviewed_default||'all',severity:'all',duration:'all',date:'all',timeStart:'',timeEnd:''};
    const tab=this._galleryMode;
    if (tab==='reviews') this._loadReviews().then(()=>{ if(this._galleryMode===tab)this._renderGallery(); });
    else if (tab) this._loadWindow(true).then(()=>{ if(this._galleryMode===tab)this._renderGallery(); });
    else this._renderGallery();
  },

_renderMediaFilter(force=false) {
    const p=this.shadowRoot.querySelector('#media-filter-panel'); if(!p||!this._galleryMode) return;
    if(this._mediaPickerActive && !force) {
      this._mediaPickerPendingFilterRender=true;
      return;
    }
    this._mediaPickerPendingFilterRender=false;
    const wasOpen=p.classList.contains('open');
    const f=this._mediaFilter, v=this._normalizeMediaFilterState(), chip=(key,val,label,checked)=>`<button class="media-filter-chip${checked?' on':''}" data-mf="${key}" data-mv="${val}">${label}</button>`;
    const today=new Date();
    const todayStr=`${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
    const dateValue=f.date==='all'?'':f.date;
    const dateRow=`<div class="media-filter-row"><span class="media-filter-label">Date</span><button class="media-filter-chip${f.date==='all'?' on':''}" data-mf="date" data-mv="all">All dates</button><label class="media-filter-date-control"><span>${ICONS.calendar||''}</span><input id="media-filter-date" type="date" max="${todayStr}" value="${dateValue}" aria-label="Filter by date"></label>${f.date!=='all'?'<button class="media-filter-reset-date" data-mf="date" data-mv="all">Clear</button>':''}</div>`;
    const timeRow=`<div class="media-filter-row"><span class="media-filter-label">Time</span><label class="media-filter-time-control"><span>From</span><input id="media-filter-time-start" type="time" step="60" value="${f.timeStart||''}" aria-label="Start time"></label><label class="media-filter-time-control"><span>To</span><input id="media-filter-time-end" type="time" step="60" value="${f.timeEnd||''}" aria-label="End time"></label>${(f.timeStart||f.timeEnd)?'<button class="media-filter-reset-date" data-mf="timeStart" data-mv="">Clear time</button>':''}</div>`;
    const canFilterCamera=this._eventsMode==='all' && (this._config?.cameras?.length||0)>1;
    const cameraRow=canFilterCamera&&v.cams.length>1?`<div class="media-filter-row"><span class="media-filter-label">Camera</span>${chip('camera','all','All',f.camera==='all')}${v.cams.map(c=>chip('camera',c,this._mediaCameraDisplay(c),f.camera===c)).join('')}</div>`:'';
    const showObjectFilters=(this._galleryMode==='clips'||this._galleryMode==='reviews');
    const labelRow=showObjectFilters&&v.labels.length?`<div class="media-filter-row"><span class="media-filter-label">Label</span>${chip('label','all','All',f.label==='all')}${v.labels.map(x=>chip('label',x,this._filterDisplayName('label',x),f.label===x)).join('')}</div>`:'';
    const faceRow=showObjectFilters&&v.faces.length?`<div class="media-filter-row"><span class="media-filter-label">Face</span>${chip('face','all','All',f.face==='all')}${v.faces.map(x=>chip('face',x,this._faceDisplayName(x),f.face===x)).join('')}</div>`:'';
    const zoneRow=showObjectFilters&&v.zones.length?`<div class="media-filter-row"><span class="media-filter-label">Zone</span>${chip('zone','all','All',f.zone==='all')}${v.zones.map(x=>chip('zone',x,this._filterDisplayName('zone',x),f.zone===x)).join('')}</div>`:'';
    const common=this._galleryMode!=='reviews'?`<div class="media-filter-row"><span class="media-filter-label">Saved</span>${chip('favorites','0','All',!f.favorites)}${chip('favorites','1','Favorites',f.favorites)}</div>`:'';
    const duration=this._galleryMode==='recordings'?`<div class="media-filter-row"><span class="media-filter-label">Length</span>${chip('duration','all','Any',f.duration==='all')}${chip('duration','short','< 1m',f.duration==='short')}${chip('duration','medium','1–5m',f.duration==='medium')}${chip('duration','long','> 5m',f.duration==='long')}</div>`:'';
    const review=this._galleryMode==='reviews'?`<div class="media-filter-row"><span class="media-filter-label">Status</span>${chip('reviewed','unreviewed','Unreviewed',f.reviewed==='unreviewed')}${chip('reviewed','reviewed','Reviewed',f.reviewed==='reviewed')}${chip('reviewed','all','All',f.reviewed==='all')}</div><div class="media-filter-row"><span class="media-filter-label">Type</span>${chip('severity','all','All',f.severity==='all')}${chip('severity','alert','Alerts',f.severity==='alert')}${chip('severity','detection','Detections',f.severity==='detection')}</div>`:'';
    p.innerHTML=`${dateRow}${timeRow}${cameraRow}${labelRow}${faceRow}${zoneRow}${duration}${review}${common}<div class="media-filter-row"><button id="media-filter-reset" class="media-filter-reset">Reset filters</button></div>`;
    p.classList.toggle('open',wasOpen);
  }
};
