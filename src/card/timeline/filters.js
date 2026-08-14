/**
 * Live timeline filter normalization, predicates, and filter rendering.
 *
 * Methods are composed onto SightlineCard.prototype; method names are kept
 * stable so existing card behavior and tests remain unchanged.
 */
export const timelineFilterMethods = {
_normalizeLiveFilterState() {
    const labels=this._labels(), faces=this._faces(), zones=this._zones();
    if(this._filterLabel!=='all'&&!labels.includes(this._filterLabel)) this._filterLabel='all';
    if(this._filterFace!=='all'&&!faces.includes(this._filterFace)) this._filterFace='all';
    if(this._filterZone!=='all'&&!zones.includes(this._filterZone)) this._filterZone='all';
  },

_eventMatchesLiveFilter(ev) {
    if(!ev) return false;
    if(this._filterLabel!=='all' && this._normalizeObjectLabel(ev?.label)!==String(this._filterLabel)) return false;
    if(this._filterFace!=='all' && !this._eventFaceList(ev).includes(this._filterFace)) return false;
    if(this._filterZone!=='all' && !this._eventZoneList(ev).includes(this._filterZone)) return false;
    if(this._favOnly && !(ev.retain_indefinitely||ev.is_favorite||ev.favorite)) return false;
    return true;
  },

_applyLiveFilterChange() {
    this._normalizeLiveFilterState();
    if(this._timelineSelected) {
      const selected=this._allDisplayEvents().find(ev=>String(ev.id)===String(this._timelineSelected));
      if(selected&&!this._eventMatchesLiveFilter(selected)) this._timelineSelected=null;
    }
    this._renderFilter();
    this._renderList();
    this._renderLatest();
    this._renderStats();
    this._renderLegend();
    this._renderTimeline(true);
  },

_renderFilter() {
    const p=this.shadowRoot.querySelector('#filter-panel'); if(!p) return;
    this._normalizeLiveFilterState();
    const lbls=['all',...this._labels()]; const faces=['all',...this._faces()]; const zones=['all',...this._zones()];
    const chip=(val,cur,attr,kind)=>`<button class="chip ${val===cur?'on':''}" data-${attr}="${val}">${val==='all'?'All':this._filterDisplayName(kind,val)}</button>`;
    p.innerHTML=`<div class="frow"><span class="frow-l">Label</span>${lbls.map(l=>chip(l,this._filterLabel,'flabel','label')).join('')}</div>
      ${faces.length>1?`<div class="frow"><span class="frow-l">Face</span>${faces.map(v=>`<button class="chip ${v===this._filterFace?'on':''}" data-fface="${v}">${v==='all'?'All':this._faceDisplayName(v)}</button>`).join('')}</div>`:''}
      <div class="frow"><span class="frow-l">Zone</span>${zones.map(z=>chip(z,this._filterZone,'fzone','zone')).join('')}</div>
      <div class="frow"><span class="frow-l">Show</span>
        <button class="chip ${!this._favOnly?'on':''}" data-favonly="0">All</button>
        <button class="chip ${this._favOnly?'on':''}" data-favonly="1">★ Favorites</button></div>`;
  }
};
