/**
 * Frigate object/face/zone normalization and filter metadata discovery.
 *
 * Methods are composed onto SightlineCard.prototype; method names are kept
 * stable so existing card behavior and tests remain unchanged.
 */
import { cap, parseWs, mkCamState } from '../../helpers.js';

export const metadataMethods = {
_cc() { return this._camCache[this._activeCam?.entity] || mkCamState(); },

async _ws(p) { return parseWs(await this._hass.callWS(p)); },

_normalizeObjectLabel(value) {
    // Frigate review segments encode a tracked object with a meaningful
    // sub-label (face identity/custom classifier/etc.) as `<label>-verified`.
    // That suffix is review metadata, not a separate object class. Keep the
    // original review payload/sub_labels untouched, but expose/filter the base
    // object label so `person` and `person-verified` are one logical label.
    const raw=String(value??'').trim();
    if(!raw) return '';
    const normalized=raw.replace(/-verified$/i,'').trim();
    return normalized || raw;
  },

_faceValueList(value) {
    const out=[];
    const add=(v)=>{
      if(v==null) return;
      if(Array.isArray(v)) { for(const item of v) add(item); return; }
      const text=String(v).trim();
      if(text) out.push(text);
    };
    add(value);
    return [...new Set(out)];
  },

_eventFaceList(ev) {
    // Frigate face recognition exposes a recognized identity through the
    // event sub_label. Only treat person/face events as face identities so
    // unrelated custom-classification sub-labels do not pollute this filter.
    const label=this._normalizeObjectLabel(ev?.label ?? ev?.data?.label ?? '').toLowerCase();
    if(label!=='person' && label!=='face') return [];
    return this._faceValueList(ev?.sub_label ?? ev?.data?.sub_label);
  },

_reviewFaceList(rv) {
    const labels=this._reviewLabelList(rv).map(x=>String(x).toLowerCase());
    if(!labels.includes('person') && !labels.includes('face')) return [];
    const data=rv?.data||{};
    return this._faceValueList(data.sub_labels ?? data.sub_label);
  },

_faceDisplayName(value) {
    return String(value??'').trim().replace(/_/g,' ');
  },

_eventZoneList(ev) {
    const out=[];
    for (const source of [ev?.zones, ev?.entered_zones, ev?.current_zones]) {
      if (!Array.isArray(source)) continue;
      for (const zone of source) if(zone!=null && String(zone).trim()) out.push(String(zone));
    }
    return [...new Set(out)];
  },

_reviewLabelList(rv) {
    const data=rv?.data||{};
    const values=[];
    for(const source of [data.objects,data.labels]) {
      if(!Array.isArray(source)) continue;
      for(const value of source) {
        const label=this._normalizeObjectLabel(value);
        if(label) values.push(label);
      }
    }
    return [...new Set(values)];
  },

_reviewZoneList(rv) {
    const data=rv?.data||{};
    const values=[];
    for(const source of [data.zones,data.entered_zones]) {
      if(Array.isArray(source)) for(const value of source) if(value!=null&&String(value).trim()) values.push(String(value));
    }
    return [...new Set(values)];
  },

_mergeLoadedFilterMetadata(cc, events=[], reviews=[]) {
    if(!cc) return false;
    const labels=new Set((Array.isArray(cc.filterLabels)?cc.filterLabels:[]).map(v=>this._normalizeObjectLabel(v)).filter(Boolean));
    const faces=new Set(Array.isArray(cc.filterFaces)?cc.filterFaces:[]);
    const zones=new Set(Array.isArray(cc.filterZones)?cc.filterZones:[]);
    const beforeLabels=labels.size, beforeFaces=faces.size, beforeZones=zones.size;
    for(const ev of (events||[])) {
      const label=this._normalizeObjectLabel(ev?.label);
      if(label) labels.add(label);
      for(const face of this._eventFaceList(ev)) faces.add(face);
      for(const zone of this._eventZoneList(ev)) zones.add(zone);
    }
    for(const rv of (reviews||[])) {
      for(const label of this._reviewLabelList(rv)) labels.add(label);
      for(const face of this._reviewFaceList(rv)) faces.add(face);
      for(const zone of this._reviewZoneList(rv)) zones.add(zone);
    }
    cc.filterLabels=[...labels].sort((a,b)=>String(a).localeCompare(String(b)));
    cc.filterFaces=[...faces].sort((a,b)=>String(a).localeCompare(String(b)));
    cc.filterZones=[...zones].sort((a,b)=>String(a).localeCompare(String(b)));
    const changed=labels.size!==beforeLabels||faces.size!==beforeFaces||zones.size!==beforeZones;
    if(changed && cc===this._cc()) this._refreshOpenFilterSurfaces();
    return changed;
  },

_refreshOpenFilterSurfaces() {
    // Metadata can arrive while iOS owns a native Date/Time picker. Do not
    // mutate sibling/ancestor DOM in that period: WebKit can close the system
    // picker even when its exact <input> node remains attached. Queue the
    // gallery/filter paint and keep the card visually stable until dismissal.
    if(this._mediaPickerActive && this._galleryMode) {
      this._mediaPickerPendingFilterRender=true;
      this._mediaPickerPendingGalleryRender=true;
      return;
    }
    const mp=this.shadowRoot?.querySelector('#media-filter-panel');
    if(mp?.classList.contains('open')) this._renderMediaFilter();
    const fp=this.shadowRoot?.querySelector('#filter-panel');
    if(fp&&fp.style.display!=='none') this._renderFilter();
    this._renderLegend();
  },

_filterDisplayName(kind,value,cc=this._cc()) {
    const key=kind==='label' ? this._normalizeObjectLabel(value) : String(value??'');
    const read=(state)=>kind==='zone' ? state?.filterZoneNames?.[key] : state?.filterLabelNames?.[key];
    let named=read(cc);
    if(!named) {
      for(const state of Object.values(this._camCache||{})) { named=read(state); if(named) break; }
    }
    if(named) return String(named);
    return cap(key.replace(/_/g,' '));
  },

async _loadFrigateFilterMetadata(force=false) {
    const cc=this._cc();
    const {clientId,cam}=cc;
    const now=Date.now();
    // Re-check Frigate periodically instead of treating the first metadata load
    // as permanent. Labels/zones can be added or removed while HA stays open.
    const fresh=cc.filterMetaLoaded && (now-Number(cc.filterMetaLoadedAt||0) < 60_000);
    if(!clientId||!cam||cc.filterMetaLoading||(!force&&fresh)) return;
    cc.filterMetaLoading=true;
    // A real metadata refresh rebuilds the set so deleted/renamed zones do not
    // live forever in the filter UI. Current loaded data is always included.
    const labels=new Set();
    const faces=new Set();
    const zones=new Set();
    const labelNames={};
    const zoneNames={};
    const takeEvent=(ev)=>{
      const label=this._normalizeObjectLabel(ev?.label);
      if(label) labels.add(label);
      for(const face of this._eventFaceList(ev)) faces.add(face);
      for(const z of this._eventZoneList(ev)) zones.add(z);
    };
    const takeReview=(rv)=>{
      for(const l of this._reviewLabelList(rv)) labels.add(l);
      for(const face of this._reviewFaceList(rv)) faces.add(face);
      for(const z of this._reviewZoneList(rv)) zones.add(z);
    };
    for(const ev of (this._events||[])) takeEvent(ev);
    for(const rv of (this._reviews||[])) takeReview(rv);

    try {
      const settled=await Promise.allSettled([
        this._ws({type:'frigate/events/get',instance_id:clientId,cameras:[cam],limit:1000}),
        this._ws({type:'frigate/reviews/get',instance_id:clientId,cameras:[cam],limit:500})
      ]);
      if(settled[0].status==='fulfilled') for(const ev of (Array.isArray(settled[0].value)?settled[0].value:[])) takeEvent(ev);
      if(settled[1].status==='fulfilled') for(const rv of (Array.isArray(settled[1].value)?settled[1].value:[])) takeReview(rv);

      // Deliberately no direct /api/config or /api/labels request here.
      // The HA Frigate integration does not expose generic passthrough routes for
      // those endpoints, so labels/zones are learned dynamically from the proxied
      // event/review datasets instead of bypassing Home Assistant authentication.
    } catch(_) {
      // Keep the loaded event/review-derived values even if an enrichment path
      // is unavailable on this Frigate/HA installation.
    } finally {
      cc.filterLabels=[...labels].sort((a,b)=>String(a).localeCompare(String(b)));
      cc.filterFaces=[...faces].sort((a,b)=>String(a).localeCompare(String(b)));
      cc.filterZones=[...zones].sort((a,b)=>String(a).localeCompare(String(b)));
      cc.filterLabelNames=labelNames;
      cc.filterZoneNames=zoneNames;
      cc.filterMetaLoaded=true;
      cc.filterMetaLoadedAt=Date.now();
      cc.filterMetaLoading=false;
      this._normalizeLiveFilterState();
      this._refreshOpenFilterSurfaces();
    }
  }
};
