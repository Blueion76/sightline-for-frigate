/**
 * Timeline event model, clustering, labels, recording gaps, and derived filter metadata.
 *
 * Methods are composed onto SightlineCard.prototype; method names are kept
 * stable so existing card behavior and tests remain unchanged.
 */
import { cap } from '../../helpers.js';

export const timelineModelMethods = {
_timelineLabelInfo(ev) {
    const raw = this._normalizeObjectLabel(ev?.label ?? ev?.data?.label ?? '').toLowerCase();
    const aliases = {
      vehicle: 'vehicle',
      vehicles: 'vehicle',
      person: 'person',
      car: 'car',
      truck: 'truck',
      bus: 'bus',
      motorcycle: 'motorcycle',
      bicycle: 'bicycle',
      dog: 'dog',
      cat: 'cat',
      bird: 'bird',
      horse: 'horse',
      package: 'package',
      face: 'face',
      motion: 'motion',
    };
    const key = aliases[raw] || raw || 'motion';
    const display = key === 'motion' ? 'Motion' : cap(key);
    const sub = ev?.sub_label ? String(ev.sub_label).trim() : '';
    return { key, display, sub };
  },

_timelineEvents() {
    const seen = new Set();
    const out = [];
    for (const ev of this._allDisplayEvents()) {
      if (!ev || ev.id == null || seen.has(ev.id)) continue;
      const start = Number(ev.start_time);
      if (!Number.isFinite(start)) continue;
      // False positives are still useful in the raw Frigate event list, but
      // should not dominate the visual timeline.
      if (ev.false_positive === true) continue;
      if (!this._eventMatchesLiveFilter(ev)) continue;
      const info = this._timelineLabelInfo(ev);
      if (!info.key) continue;
      seen.add(ev.id);
      this._timelineEventCache.set(String(ev.id), ev);
      out.push({ ...ev, _tl: info });
    }
    return out;
  },

_timelineClusters(events) {
    const sorted=[...events].sort((a,b)=>Number(a.start_time)-Number(b.start_time));
    const clusters=[];
    for (const ev of sorted) {
      const info=ev._tl||this._timelineLabelInfo(ev);
      const start=Number(ev.start_time);
      const end=Math.max(start,Number(ev.end_time)||start);
      const last=clusters[clusters.length-1];
      const sameLabelGap=this._config?.timeline?.clustering ? Number(this._config.timeline.same_label_cluster_seconds||0) : 0;
      if (sameLabelGap>0 && last && last.labelKey===info.key && start <= last.end + sameLabelGap) {
        last.events.push(ev);
        last.end=Math.max(last.end,end);
        if (start > Number(last.representative.start_time)) last.representative=ev;
      } else {
        clusters.push({
          labelKey:info.key,
          label:info.display,
          sub:info.sub,
          start,
          end,
          representative:ev,
          events:[ev]
        });
      }
    }
    return clusters.sort((a,b)=>Number(b.representative.start_time)-Number(a.representative.start_time));
  },

_timelineClusterAnchor(cluster, start, end) {
    const visible=(cluster?.events||[])
      .filter(ev=>{
        const ts=Number(ev?.start_time);
        return Number.isFinite(ts) && ts>=start && ts<=end;
      })
      .sort((a,b)=>Number(a.start_time)-Number(b.start_time));
    if(!visible.length) return null;
    if(this._timelineSelected) {
      const selected=visible.find(ev=>String(ev.id)===String(this._timelineSelected));
      if(selected) return selected;
    }
    return visible[0];
  },

_timelineVisualGroups(items, span, trackPx) {
    const px=Math.max(320,Number(trackPx)||420);
    const secondsPerPx=Math.max(.001,Number(span)||1)/px;
    const desiredSeparationPx=Math.max(24,Math.min(36,px*.065));
    const configuredMax=Math.max(0,Number(this._config?.timeline?.visual_cluster_max_seconds ?? 60));
    const zoomCap=Math.min(configuredMax,span<=15*60 ? 15 : span<=60*60 ? 30 : 60);
    const threshold=this._config?.timeline?.clustering===false || zoomCap<=0
      ? 0 : Math.max(1,Math.min(zoomCap,desiredSeparationPx*secondsPerPx));
    const sorted=[...(items||[])].sort((a,b)=>Number(a.ts)-Number(b.ts));
    const groups=[];
    for(const item of sorted) {
      const ts=Number(item?.ts);
      if(!Number.isFinite(ts)) continue;
      const last=groups[groups.length-1];
      // Do not chain a long stream of detections into one giant cluster: every
      // member must remain within the threshold of the group's first moment.
      if(threshold>0 && last && ts-last.startTs<=threshold) {
        last.items.push(item);
        last.endTs=Math.max(last.endTs,ts,Number(item.cluster?.end)||ts);
      } else {
        groups.push({items:[item],startTs:ts,endTs:Math.max(ts,Number(item.cluster?.end)||ts)});
      }
    }
    return groups.map(group=>{
      const selected=this._timelineSelected
        ? group.items.find(item=>item.cluster?.events?.some(ev=>String(ev.id)===String(this._timelineSelected)))
        : null;
      // Prefer the selected event when present; otherwise use the newest real
      // detection in the burst. The marker always points at a genuine event
      // timestamp, never an invented midpoint.
      const anchorItem=selected || group.items[group.items.length-1];
      const seenIds=new Set(), events=[];
      for(const item of group.items) for(const ev of (item.cluster?.events||[])) {
        const id=String(ev?.id ?? '');
        if(!id || seenIds.has(id)) continue;
        seenIds.add(id); events.push(ev);
      }
      const labels=[];
      for(const item of [anchorItem,...group.items]) {
        const info=item?.ev?._tl||this._timelineLabelInfo(item?.ev);
        if(info?.key && !labels.some(x=>x.key===info.key)) labels.push(info);
      }
      return {
        ...group,
        anchorItem,
        ts:Number(anchorItem.ts),
        events,
        labels,
        totalDetections:events.length,
        visualCluster:group.items.length>1
      };
    });
  },

_timelineResponsiveMetrics(track) {
    const width=Math.max(280,Number(track?.clientWidth)||Number(track?.getBoundingClientRect?.().width)||320);
    // Scrypted-style glyphs are deliberately much larger than the rail marker.
    // Scale from the rendered track width (CSS pixels), so a narrow phone/card
    // column and a wide desktop dashboard keep the same visual proportions on
    // both standard and Retina/high-DPI displays.
    const glyphMin=Number(this._config?.timeline?.glyph_min_px ?? 20);
    const glyphMax=Math.max(glyphMin,Number(this._config?.timeline?.glyph_max_px ?? 30));
    const glyphPx=Math.round(Math.max(glyphMin,Math.min(glyphMax,glyphMin+((width-320)/420)*(glyphMax-glyphMin))));
    const glyphGapPx=Math.round(Math.max(6,Math.min(10,6+((width-320)/500)*4)));
    const glyphOffsetPx=Math.round(Math.max(38,Math.min(56,38+((width-320)/500)*18)));
    const eventLanePx=Math.round(Math.max(90,Math.min(190,width*.26)));
    const dotPx=Math.round(Math.max(14,Math.min(18,14+((width-320)/520)*4)));
    const glyphStartFromRail=Math.max(0,glyphOffsetPx-(dotPx/2));
    const laneForGlyphs=Math.max(glyphPx,eventLanePx-glyphStartFromRail-8);
    const configMaxGlyphs=Math.max(1,Math.round(Number(this._config?.timeline?.max_glyphs ?? 3)));
    const maxGlyphs=Math.max(1,Math.min(configMaxGlyphs,Math.floor((laneForGlyphs+glyphGapPx)/(glyphPx+glyphGapPx))));
    return {width,glyphPx,glyphGapPx,glyphOffsetPx,eventLanePx,dotPx,maxGlyphs};
  },

_timelineThumb(ev) {
    const id=String(ev.id);
    const key=`${String(ev?.camera||this._cc().cam||'')}:${id}`;
    let url=this._timelineThumbCache.get(key);
    if (!url) {
      url=this._mediaForEvent(ev,'thumbnail.jpg');
      this._timelineThumbCache.set(key,url);
    }
    return url;
  },

_dur(ev) { return Math.max(1,Math.round((ev.end_time||Date.now()/1000)-ev.start_time)); },

_filterMetadataStates() {
    if(this._eventsMode==='all') return this._config.cameras.map(c=>this._camCache[c.entity]).filter(Boolean);
    return [this._cc()].filter(Boolean);
  },

_zones() {
    const z=new Set();
    for(const cc of this._filterMetadataStates()) for(const value of (cc.filterZones||[])) if(value) z.add(String(value));
    this._allDisplayEvents().forEach(e=>this._eventZoneList(e).forEach(x=>z.add(x)));
    return [...z].sort((a,b)=>String(a).localeCompare(String(b)));
  },

_faces() {
    const f=new Set();
    for(const cc of this._filterMetadataStates()) for(const value of (cc.filterFaces||[])) if(value) f.add(String(value));
    this._allDisplayEvents().forEach(e=>this._eventFaceList(e).forEach(x=>f.add(x)));
    return [...f].sort((a,b)=>String(a).localeCompare(String(b)));
  },

_labels() {
    const l=new Set();
    for(const cc of this._filterMetadataStates()) for(const value of (cc.filterLabels||[])) {
      const label=this._normalizeObjectLabel(value); if(label) l.add(label);
    }
    this._allDisplayEvents().forEach(e=>{ const label=this._normalizeObjectLabel(e?.label); if(label) l.add(label); });
    return [...l].sort((a,b)=>String(a).localeCompare(String(b)));
  },

_filtered() {
    let list=this._allDisplayEvents();
    // The browse tabs intentionally use different look-back windows:
    // Recent Events = 3h; Clips/Snapshots = 24h. Recordings and Reviews use
    // the 24h timeline window directly. Keeping the 24h data window loaded
    // lets the other tabs switch instantly without changing the playback
    // engine that is known to work on iOS.
    const now=Math.floor(Date.now()/1000);
    if(this._tab==='live') list=list.filter(e=>Number(e.start_time)>=now-3*60*60);
    if(this._tab==='clips') list=list.filter(e=>e.has_clip && Number(e.start_time)>=now-24*60*60);
    else if(this._tab==='snapshot') list=list.filter(e=>e.has_snapshot && Number(e.start_time)>=now-24*60*60);
    list=list.filter(e=>this._eventMatchesLiveFilter(e));
    return list;
  },

_mergeRecs(recs) {
    if(!recs.length) return [];
    const segs=[...recs].sort((a,b)=>a.start_time-b.start_time); const out=[]; let cur={...segs[0]};
    for(let i=1;i<segs.length;i++){const s=segs[i];const ce=cur.end_time||cur.start_time;if(s.start_time-ce<=60){cur.end_time=Math.max(ce,s.end_time||s.start_time);cur.events=(cur.events||0)+(s.events||0);}else{out.push(cur);cur={...s};}}
    out.push(cur); return out;
  },

_timelineRecordingGaps(start, end) {
    if (!this._recordingsLoaded) return [];
    const requestedStart=Math.max(0,Number(start)||0);
    const now=Math.floor(Date.now()/1000);
    // Near LIVE, Frigate's newest recording segment may not be finalized yet
    // even though the camera is recording normally. Also, the visual LIVE
    // window advances every second while recordings refresh on a slower timer.
    // Never declare this fresh tail a real gap. Keep it UNKNOWN until the next
    // successful recordings/get has had enough time for the segment to settle.
    // LIVE data is now refreshed by the moving-window follower every ~3s.
    // Keep a short safety tail for Frigate segment finalization, but no longer
    // tie the visual gap delay to the much slower full-card refresh setting.
    const liveFreshnessHoldback=this._timelineFollowingLive ? 25 : 0;
    const confirmedNow=Math.max(0,now-liveFreshnessHoldback);
    const requestedEnd=Math.min(Number(end)||0,confirmedNow);
    if (!(requestedEnd>requestedStart)) return [];

    // A recordings/get response only proves coverage for the exact interval
    // that was queried. During a fast wheel/touch fling the visual window can
    // outrun the debounced network request. Previously the stale recording
    // array contained no rows for that new viewport, so the entire viewport
    // was incorrectly painted red until another slower movement caused data
    // to arrive. Treat time outside the last successful query as UNKNOWN, not
    // as missing retained footage.
    const loadedStart=Number(this._recordingsRangeStart);
    const loadedEnd=Number(this._recordingsRangeEnd);
    if (!Number.isFinite(loadedStart) || !Number.isFinite(loadedEnd) || loadedEnd<=loadedStart) return [];

    const s=Math.max(requestedStart,loadedStart);
    const e=Math.min(requestedEnd,loadedEnd,now);
    if (!(e>s)) return [];

    const recs=this._mergeRecs(Array.isArray(this._recordings)?this._recordings:[])
      .map(r=>({start:Number(r.start_time),end:Number(r.end_time||r.start_time)}))
      .filter(r=>Number.isFinite(r.start)&&Number.isFinite(r.end)&&r.end>s&&r.start<e)
      .sort((a,b)=>a.start-b.start);

    // An empty result is a genuine gap only inside the interval for which the
    // server has already answered. Unknown leading/trailing viewport time is
    // deliberately left unpainted until its request completes.
    if (!recs.length) return [{key:`empty:${Math.floor(s)}:${Math.floor(e)}`,start:s,end:e}];

    const gaps=[];
    let cursor=s;
    let previousEnd=null;
    for (const rec of recs) {
      const a=Math.max(s,rec.start);
      const b=Math.min(e,rec.end);
      if (a>cursor) {
        const leading=previousEnd==null;
        gaps.push({
          key:leading?`lead:${Math.floor(rec.start)}`:`gap:${Math.floor(previousEnd)}:${Math.floor(rec.start)}`,
          start:cursor,
          end:a
        });
      }
      cursor=Math.max(cursor,b);
      previousEnd=Math.max(previousEnd??b,b);
      if (cursor>=e) break;
    }
    if (cursor<e) gaps.push({key:`trail:${Math.floor(previousEnd??cursor)}`,start:cursor,end:e});
    return gaps.filter(g=>g.end-g.start>0.5);
  },

_timelineNodeKey(el) {
    if (el.classList.contains('t-ev')) return `ev:${el.dataset.tick||''}`;
    if (el.classList.contains('t-preview')) return `preview:${el.dataset.eventId||''}`;
    if (el.classList.contains('t-rec')) return `rec:${el.dataset.start||''}:${el.dataset.end||''}`;
    if (el.classList.contains('tl-no-recording')) return `norec:${el.dataset.gap||el.dataset.start||''}`;
    if (el.classList.contains('tl-scale-mark')) return `scale:${el.dataset.ts||''}`;
    if (el.classList.contains('tl-live-line')) return 'live-line';
    if (el.classList.contains('tl-download-range')) return 'download-range';
    if (el.classList.contains('tl-playhead')) return 'playhead';
    if (el.classList.contains('tl-offline')) return 'offline';
    return null;
  }
};
