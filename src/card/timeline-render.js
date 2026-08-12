import { VERSION, CARD_TAG, DAY, DEFAULT_ROTATE_S, ICONS, LABEL_COLORS, PALETTE, TIMELINE_GLYPHS, CAM_COLORS } from '../constants.js';
import { cap, parseWs, labelColor, timelineGlyph, mkCamState, camDisplayName } from '../helpers.js';
import { STYLES } from '../styles.js';

// Prototype methods grouped by responsibility.
export const timelineRenderMethods = {
_renderAll() {
    // A full-card render is especially dangerous while iOS owns a native
    // date/time picker. Defer it just like gallery/filter paints so no ancestor
    // text, class, timeline or height mutation can dismiss the system popover.
    if(this._mediaPickerActive && this._galleryMode){
      this._mediaPickerPendingGalleryRender=true;
      return;
    }
    this._renderStats();this._renderLatest();this._renderTimeline();this._renderLegend();this._renderRange();this._renderList();this._syncStatus();this._renderCamSwitcher();if(this._cardWidth>=560)this._syncColHeight();
  },

_renderStats() { const el=this._$('#ev-count'); if(el) el.textContent=String(this._tab==='live'?this._filtered().length:this._allDisplayEvents().length); },

_renderRange() {
    const el=this._$('#tl-range'); if(!el) return;
    const span=this._winEnd-this._winStart; const fmt=t=>this._timeMinute(t);
    if(span<=DAY+60) el.textContent=`${new Date(this._winEnd*1000).toLocaleDateString([],{day:'2-digit',month:'short'})} · ${fmt(this._winStart)}–${this._isNowWindow()?'now':fmt(this._winEnd)}`;
    else el.textContent=`${new Date(this._winStart*1000).toLocaleDateString([],{day:'2-digit',month:'short'})} – ${this._isNowWindow()?'now':new Date(this._winEnd*1000).toLocaleDateString([],{day:'2-digit',month:'short'})}`;
  },

_renderLegend() {
    const el=this._$('#legend'); if(!el) return;
    if(this._config?.timeline?.show_legend===false){el.innerHTML='';el.style.display='none';return;}
    el.style.display='';
    const labels=[...new Set(this._timelineEvents().map(ev=>(ev._tl||this._timelineLabelInfo(ev)).key))].sort();
    let html=labels.map(l=>`<span class="lg tl-detection-legend"><i>${timelineGlyph(l)}</i>${this._filterDisplayName('label',l)}</span>`).join('');
    if (this._eventsMode==='all') {
      this._config.cameras.forEach((c,i)=>{ html+=`<span class="lg"><i style="background:${CAM_COLORS[i%CAM_COLORS.length].replace('.5','1').replace('rgba','rgb').replace(',1)',')')}"></i>${cap(camDisplayName(c))} rec</span>`; });
    } else {
      html+=`<span class="lg"><i style="background:${CAM_COLORS[0].replace('.5','1').replace('rgba','rgb').replace(',1)',')')}"></i>Rec</span>`;
    }
    el.innerHTML=html;
  },

_renderLatest() {
    const row=this._$('#latest-row'); if(!row) return;
    const events=this._tab==='live'?this._filtered():this._allDisplayEvents();
    if(!events.length||this._viewMode==='grid'){ row.style.display='none'; return; }
    row.style.display='block';
    row.innerHTML=`<div class="latest-label"><span class="section-label">Latest event</span></div>
      <div class="latest-body">${this._eventCardHTML(events[0],false,true)}</div>`;
  },

_time(ts) { return this._timeMinute(ts); },

_timelineScaleTime(ts) { return this._timeMinute(ts); },

_timelineTime(ts) { return this._timeSec(ts); },

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

_isAtLiveEdge(ts = this._timelineFocusTs) {
    const now = Math.floor(Date.now()/1000);
    return Number.isFinite(Number(ts)) && Number(ts) >= now - 2;
  },

_refreshLiveFromTimeline(opts={}) {
    // Crossing the newest/live edge is an explicit request to return to live.
    // Only remount the WebRTC player when we were actually in recorded
    // playback. If the user started from an already-live stream, keep that
    // healthy player alive; remounting it on the release event creates a race
    // with ha-camera-stream and is the source of the intermittent
    // 'Unable to start stream' state seen after timeline drags.
    const restart=opts.restart!==false;
    this._timelineFollowingLive=true;
    this._timelineInteracting=false;
    this._resetTimelineToNow10m();
    if (restart) {
      this._showLive();
    } else {
      this._playing=null;
      this._playingHour=null;
      this._playingSourceStart=null;
      this._playingSourceEnd=null; this._playingRecordings=[]; this._playingInpointOffset=0;
      this._scrubTarget=this._timelineFocusTs;
      this._galleryMode='';
      this._syncResponsiveWorkspace();
      const viewer=this.shadowRoot.querySelector('#viewer');
      if(viewer){viewer.innerHTML='';viewer.style.display='none';}
      const engine=this.shadowRoot.querySelector('#engine');
      if(engine) engine.style.display='block';
      const timeline=this.shadowRoot.querySelector('#timeline-view');
      if(timeline) timeline.style.display='';
      this._clearStatusOverlay();
      this._renderStreamCtrl();
    }
    this._loadWindow(true);
    requestAnimationFrame(() => {
      this._renderTimeline(true);
      this._renderRange();
      this._renderTimelineZoomLabel();
    });
  },

_updateTimelineLive() {
    const track=this._$('#tl-track'); if(!track) return;
    track.classList.toggle('following-live', !!this._timelineFollowingLive);
    let s=this._winStart,e=this._winEnd;
    const nowTs=Math.floor(Date.now()/1000);
    // LIVE is a true moving anchor. On the live view the scrubber stays exactly
    // on top of the red LIVE line and its HH:MM:SS value advances with the clock.
    // Once the user scrubs, _timelineFollowingLive is false and the selected
    // playback timestamp is left untouched.
    if (this._timelineFollowingLive && !this._timelineInteracting) {
      // Follow LIVE without destroying the user's zoom level. The previous
      // implementation hard-coded a 10-minute viewport here on every clock
      // update, so clicking +/- appeared to do nothing: _zoomTimeline changed
      // the span, then the next LIVE tick immediately restored +/- 5 minutes.
      // Preserve the currently selected span and only translate it forward
      // with the moving LIVE playhead.
      const currentSpan=Math.max(5*60,Math.min(24*60*60,Number(this._winEnd)-Number(this._winStart)||10*60));
      const half=currentSpan/2;
      s=Math.floor(nowTs-half);
      e=Math.floor(nowTs+half);
      if(s<0){e-=s;s=0;}
      this._winStart=s;
      this._winEnd=e;
      this._timelineFocusTs=nowTs;
      this._scrubTarget=nowTs;
      this._timelineZoom=Math.max(this._timelineZoomMin,Math.min(this._timelineZoomMax,3600/currentSpan));
    }
    const span=Math.max(1,e-s);
    // When the selected playhead is at LIVE, keep its wall-clock timestamp
    // moving with real time. Do this from the same update path as the LIVE
    // marker so the HH:MM:SS label cannot get stuck on the initial second.
    let focus=Number.isFinite(Number(this._timelineFocusTs)) ? Number(this._timelineFocusTs) : nowTs;
    if (this._timelineFollowingLive && !this._timelineInteracting) {
      focus=nowTs;
      this._timelineFocusTs=nowTs;
      this._scrubTarget=nowTs;
    }
    const yPct = ts => Math.max(0,Math.min(100,50 + ((focus-Number(ts))/span)*100));
    const liveLine=track.querySelector('.tl-live-line');
    if (liveLine) {
      if (nowTs >= s && nowTs <= e) {
        liveLine.style.display='block';
        liveLine.style.top=`${yPct(nowTs)}%`;
      } else {
        liveLine.style.display='none';
      }
    }
    const events=this._timelineEvents();
    const byId=new Map(events.map(ev=>[String(ev.id),ev]));

    // O(1) event lookup during every animation frame. More importantly, do
    // not clamp stale nodes to 0/100% when their timestamp has moved outside
    // the viewport. That clamp was the cause of the post-zoom "stuck event"
    // artifact: an old marker/card remained pinned to the screen edge until
    // the timeline eventually crossed its original timestamp again.
    track.querySelectorAll('.t-ev').forEach(el=>{
      const ev=byId.get(String(el.dataset.tick));
      const a=Number(el.dataset.start);
      const b=Number(el.dataset.end);
      const anchor=Number.isFinite(Number(el.dataset.ts)) ? Number(el.dataset.ts) : Number(ev?.start_time);
      const overlaps=Number.isFinite(a)&&Number.isFinite(b) ? (b>=s && a<=e) : !!ev;
      // Never pin a stale event to the top/bottom edge. Its duration may still
      // overlap the window, but the class glyph belongs at its real timestamp.
      // Once that anchor leaves the viewport, hide it until a full reconcile
      // promotes a new in-window detection from the same cluster.
      if(!ev || !overlaps || !Number.isFinite(anchor) || anchor<s || anchor>e) {
        el.style.visibility='hidden'; el.style.pointerEvents='none'; return;
      }
      el.style.visibility=''; el.style.pointerEvents='';
      el.style.top=`${yPct(anchor)}%`;
    });
    track.querySelectorAll('.t-preview').forEach(el=>{
      const ev=byId.get(String(el.dataset.eventId));
      if(!ev) { el.style.visibility='hidden'; el.style.pointerEvents='none'; return; }
      const anchor=Number.isFinite(Number(el.dataset.ts)) ? Number(el.dataset.ts) : Number(ev.start_time);
      if(!Number.isFinite(anchor) || anchor<s || anchor>e) {
        el.style.visibility='hidden'; el.style.pointerEvents='none'; return;
      }
      el.style.visibility=''; el.style.pointerEvents='';
      const trackPx=Math.max(track.clientHeight||420,360);
      const cardH=el.offsetHeight||92;
      const y=(yPct(anchor)/100)*trackPx;
      el.style.top=`${y-cardH/2}px`;
    });
    track.querySelectorAll('.t-rec').forEach(el=>{
      const a=Number(el.dataset.start), b=Number(el.dataset.end); if(!Number.isFinite(a)||!Number.isFinite(b)) return;
      const top=yPct(Math.min(b,e));
      const h=Math.max(.45,((Math.min(b,e)-Math.max(a,s))/span)*100);
      el.style.top=`${top}%`; el.style.height=`${h}%`;
    });
    track.querySelectorAll('.tl-no-recording').forEach(el=>{
      const a=Number(el.dataset.start), b=Number(el.dataset.end);
      const loadedStart=Number(this._recordingsRangeStart), loadedEnd=Number(this._recordingsRangeEnd);
      if(!Number.isFinite(loadedStart)||!Number.isFinite(loadedEnd)||loadedEnd<=loadedStart){el.style.display='none';return;}
      if(!Number.isFinite(a)||!Number.isFinite(b)||b<s||a>e||b<loadedStart||a>loadedEnd){el.style.display='none';return;}
      const clippedA=Math.max(a,s,loadedStart), clippedB=Math.min(b,e,loadedEnd,Math.floor(Date.now()/1000));
      if(clippedB<=clippedA){el.style.display='none';return;}
      el.style.display='block';
      const top=yPct(clippedB);
      const h=Math.max(.55,((clippedB-clippedA)/span)*100);
      el.style.top=`${top}%`; el.style.height=`${h}%`;
    });
    // The scale labels are part of the moving timeline, not a static axis.
    // During a scroll the window timestamps change every frame. The previous
    // implementation only moved the old labels, leaving e.g. 06:52–07:07
    // labels attached to a newly scrolled 07:00–07:15 window. Zoom caused a
    // full render and therefore appeared to "fix" the problem.
    // Reuse the existing label nodes whenever possible so this stays cheap on
    // iOS while keeping the labels mathematically synchronized with the window.
    this._syncTimelineScaleNodes(track, s, e, span, focus, yPct);

    const ph=track.querySelector('.tl-playhead');
    if(ph) {
      const label=ph.querySelector('span');
      if(label) label.textContent=this._timelineTime(focus);
      // Keep the dedicated scrubber/current-time readout in sync as well.
      // This is intentionally a text-only update; it does not rebuild the
      // timeline or disturb an active drag/scroll gesture.
      const range=track.querySelector('#tl-range');
      if(range && this._timelineFollowingLive && !this._timelineInteracting) {
        range.textContent=`${new Date(focus*1000).toLocaleDateString([],{month:'short',day:'2-digit'}).toUpperCase()} · ${this._timeMinute(focus)}`;
      }
    }
  },

_syncTimelineScaleNodes(track, s, e, span, focus, yPct) {
    const step=span<=900 ? 60 : span<=1800 ? 2*60 : span<=3600 ? 5*60 : span<=7200 ? 10*60 : 30*60;
    const first=Math.ceil(s/step)*step;
    const count=Math.max(0,Math.floor((e-first)/step)+1);
    let nodes=[...track.querySelectorAll('.tl-scale-mark')];

    // Zoom changes the required number of ticks. Reconcile the node count only
    // when necessary; normal scrolling just changes their timestamps in place.
    if(nodes.length!==count) {
      const old=nodes;
      old.forEach(n=>n.remove());
      const frag=document.createDocumentFragment();
      nodes=[];
      for(let i=0;i<count;i++) {
        const el=document.createElement('div');
        el.className='tl-scale-mark';
        el.innerHTML='<span></span><i></i>';
        frag.appendChild(el);
        nodes.push(el);
      }
      track.appendChild(frag);
    }

    nodes.forEach((el,i)=>{
      const ts=first+i*step;
      const d=new Date(ts*1000);
      const isHour=d.getMinutes()===0;
      el.dataset.ts=String(ts);
      el.classList.toggle('hour',isHour);
      const label=el.querySelector('span');
      if(label) label.textContent=this._timelineScaleTime(ts);
      el.style.top=`${yPct(ts)}%`;
    });
  },

_renderTimeline(forceFull=false) {
    const track=this._$('#tl-track'); if(!track) return;
    track.classList.toggle('following-live', !!this._timelineFollowingLive);
    const s=this._winStart,e=this._winEnd,span=Math.max(1,e-s);
    if(!Number.isFinite(Number(this._timelineFocusTs))) this._timelineFocusTs=e;
    const focus=Number.isFinite(Number(this._timelineFocusTs)) ? Number(this._timelineFocusTs) : e;
    // Cluster the complete loaded event set first, then crop clusters to the
    // viewport. Clustering only visible events changes a cluster's identity at
    // the viewport edge after zoom/pan and can leave an old thumbnail/marker
    // visually pinned until the window crosses that event again.
    const clusters=this._timelineClusters(this._timelineEvents())
      .filter(cluster=>Number(cluster.end)>=s && Number(cluster.start)<=e);
    // Scrypted-style centered playhead: the selected wall-clock time sits at
    // the visual center while the timeline itself scrolls underneath it.
    const yPct = ts => Math.max(0,Math.min(100,50 + ((focus-Number(ts))/span)*100));
    let html='';

    // Scrypted-style recording ribbon: a single blue activity rail behind the
    // event markers. Newest time is always at the top.
    if (this._eventsMode==='all') {
      this._config.cameras.forEach((c,ci)=>{
        const cc=this._camCache[c.entity]; if(!cc) return;
        const col=CAM_COLORS[ci%CAM_COLORS.length];
        for(const r of this._mergeRecs(cc.recordings||[])) {
          const a=Number(r.start_time),b=Number(r.end_time||e); if(b<s||a>e) continue;
          const top=yPct(Math.min(b,e));
          const h=Math.max(.45,((Math.min(b,e)-Math.max(a,s))/span)*100);
          html+=`<div class="t-rec" data-start="${a}" data-end="${b}" style="top:${top}%;height:${h}%;--rec-color:${col}"></div>`;
        }
      });
    } else {
      for(const r of this._mergeRecs(this._recordings)) {
        const a=Number(r.start_time),b=Number(r.end_time||e); if(b<s||a>e) continue;
        const top=yPct(Math.min(b,e));
        const h=Math.max(.45,((Math.min(b,e)-Math.max(a,s))/span)*100);
        html+=`<div class="t-rec" data-start="${a}" data-end="${b}" style="top:${top}%;height:${h}%"></div>`;
      }
    }

    // Explicitly mark missing retained footage on the same vertical rail as
    // recording coverage. Never mark future time beyond the live edge.
    for (const gap of this._timelineRecordingGaps(s,e)) {
      const a=Math.max(s,Number(gap.start));
      const b=Math.min(e,Number(gap.end),Math.floor(Date.now()/1000));
      if (!(b>a)) continue;
      const top=yPct(b);
      const h=Math.max(.55,((b-a)/span)*100);
      html+=`<div class="tl-no-recording" data-gap="${gap.key}" data-start="${a}" data-end="${b}" style="top:${top}%;height:${h}%" aria-label="No Recording"><span>No Recording</span></div>`;
    }

    // Time scale lives in the left gutter. Keep it sparse at all zoom levels;
    // event timestamps are intentionally not repeated beside every marker.
    const step=span<=900 ? 60 : span<=1800 ? 2*60 : span<=3600 ? 5*60 : span<=7200 ? 10*60 : 30*60;
    for(let ts=Math.ceil(s/step)*step;ts<=e;ts+=step) {
      const pct=yPct(ts), d=new Date(ts*1000), isHour=d.getMinutes()===0;
      html+=`<div class="tl-scale-mark ${isHour?'hour':''}" data-ts="${ts}" style="top:${pct}%"><span>${this._timelineScaleTime(ts)}</span><i></i></div>`;
    }

    // Render Scrypted-style detection rows: a blue rail marker plus a separate
    // horizontal lane of monochrome class glyphs. Nearby activity bursts share
    // the same row, and repeated classes collapse to one glyph.
    // A cluster may overlap the viewport after its first event has already
    // scrolled away. In that case anchor to the first *actual* detection still
    // inside the window instead of clamping the old cluster start to an edge.
    const trackPx=Math.max(track.clientHeight||420,360);
    const metrics=this._timelineResponsiveMetrics(track);
    track.style.setProperty('--tl-glyph-size',`${metrics.glyphPx}px`);
    track.style.setProperty('--tl-glyph-gap',`${metrics.glyphGapPx}px`);
    track.style.setProperty('--tl-glyph-offset',`${metrics.glyphOffsetPx}px`);
    track.style.setProperty('--tl-event-lane',`${metrics.eventLanePx}px`);
    track.style.setProperty('--tl-dot-size',`${metrics.dotPx}px`);
    const timelineItems=clusters.map(cluster=>{
      const ev=this._timelineClusterAnchor(cluster,s,e);
      return ev ? {cluster,ev,ts:Number(ev.start_time)} : null;
    }).filter(Boolean);
    const visualGroups=this._timelineVisualGroups(timelineItems,span,trackPx);

    visualGroups.forEach(group=>{
      const {anchorItem,ts:markerTs}=group;
      const {cluster,ev}=anchorItem;
      const pct=yPct(markerTs);
      const selected=group.events.some(x=>String(x.id)===String(this._timelineSelected));
      const info=ev._tl||this._timelineLabelInfo(ev);
      const allLabels=group.labels.length?group.labels:[info];
      // Scrypted's lane is class-oriented rather than count-oriented: repeated
      // detections collapse into the same glyph and nearby different classes
      // sit side-by-side. Keep at most three unique classes so the row stays
      // clean and the thumbnail always has enough room on narrow cards.
      const shownLabels=allLabels.slice(0,metrics.maxGlyphs);
      const glyphs=this._config.timeline.show_glyphs ? shownLabels
        .map(label=>`<span class="t-glyph">${timelineGlyph(label.key)}</span>`).join('') : '';
      const durationEnd=Math.min(e,Math.max(markerTs,Number(group.endTs)||Number(cluster.end)));
      const durationPx=Math.max(3,((durationEnd-markerTs)/span)*trackPx);
      const clusterClass=group.totalDetections>1?' clustered':'';
      const labelText=group.labels.map(x=>x.display).join(', ')||info.display;
      const aria=group.totalDetections>1
        ? `${labelText} detection cluster at ${this._timelineTime(markerTs)} (${group.totalDetections} detections)`
        : `${info.display} at ${this._timelineTime(markerTs)}`;
      html+=`<button class="t-ev ${selected?'selected':''}${clusterClass}" data-tick="${ev.id}" data-ts="${markerTs}" data-start="${group.startTs}" data-end="${group.endTs}" style="top:${pct}%" aria-label="${aria}"><span class="t-duration" style="height:${durationPx}px"></span><span class="t-dot"><span class="t-glyph-stack">${glyphs}</span></span><span class="t-connector"></span></button>`;
    });

    // Promote a sparse set of representative detection moments into thumbnail
    // cards. Use the same true in-window anchor as the glyph so cards cannot
    // remain glued to the viewport edge while their event scrolls away.
    const cardH=Math.max(82,Math.min(118,trackPx*.19)), gap=Math.max(8,Math.min(14,trackPx*.018));
    // Fit previews to the *actual* rendered timeline height. The old 4-mobile /
    // 6-desktop cap hid perfectly valid thumbnails on tall phones, tablets and
    // portrait dashboards even when there was plenty of vertical room.
    const configuredThumbMax=Math.max(0,Math.round(Number(this._config?.timeline?.max_thumbnails ?? 12)));
    const maxCards=this._config.timeline.show_thumbnails && configuredThumbMax>0
      ? Math.max(1,Math.min(configuredThumbMax,Math.floor((trackPx+gap)/(cardH+gap)))) : 0;
    const candidates=visualGroups.map(group=>({
      group,
      cluster:group.anchorItem.cluster,
      ev:group.anchorItem.ev,
      ts:group.ts,
      y:(yPct(group.ts)/100)*trackPx
    }));
    const chosen=[];
    const selectedCandidate=this._timelineSelected
      ? candidates.find(c=>c.group.events.some(ev=>String(ev.id)===String(this._timelineSelected)))
      : null;
    const ordered=selectedCandidate
      ? [selectedCandidate,...candidates.filter(x=>x!==selectedCandidate)]
      : candidates;
    for(const c of ordered) {
      if(chosen.length>=maxCards) break;
      if(chosen.every(x=>Math.abs(x.y-c.y)>=cardH+gap)) chosen.push(c);
    }

    chosen.forEach(({group,cluster,ev,y,ts})=>{
      const info=ev._tl||this._timelineLabelInfo(ev);
      const dur=this._dur(ev), label=info.display;
      const sub=info.sub?`<span class="t-sub">${info.sub}</span>`:'';
      const count=group.totalDetections>1?`<span class="t-count">${group.totalDetections} detections</span>`:'';
      const thumbUrl=this._timelineThumb(ev);
      const thumb=(ev.has_snapshot||ev.has_clip||ev.thumbnail)
        ? `<img src="${thumbUrl}" data-frigate-thumb="1" data-thumb-src="${thumbUrl}" loading="eager" decoding="async" alt="${label}"><div class="t-ph thumb-fallback" style="display:none">${timelineGlyph(info.key)}</div>`
        : `<div class="t-ph thumb-fallback">${timelineGlyph(info.key)}</div>`;
      const cardTop=y-cardH/2;
      html+=`<button type="button" class="t-preview" data-event-id="${ev.id}" data-ts="${ts}" data-start="${group.startTs}" data-end="${group.endTs}" style="top:${cardTop}px" aria-label="Play ${label} event at ${this._timelineTime(ts)}">
        <div class="t-preview-thumb">${thumb}
          <span class="t-badge"><span class="t-badge-glyph">${timelineGlyph(info.key)}</span>${label}</span>
          ${sub}
          ${count}
          <span class="t-preview-time">${this._timelineScaleTime(ts)}</span>
          <b>${dur}s</b>
        </div>
      </button>`;
    });

    // Camera availability is independent from retained recordings. Show a
    // persistent, compact offline marker on the timeline when the HA camera
    // entity is unavailable/unknown/offline; recorded footage remains usable.
    if (this._cameraIsOffline()) {
      html+=`<div class="tl-offline" aria-label="Camera offline"><i></i>OFFLINE</div>`;
    }

    // Live edge: when the current time is inside the visible timeline, show a
    // bright horizontal red LIVE marker. It is positioned in wall-clock space,
    // independently of the centered playhead.
    const nowTs = Math.floor(Date.now()/1000);
    if (nowTs >= s && nowTs <= e) {
      const livePct = yPct(nowTs);
      html+=`<div class="tl-live-line" style="top:${livePct}%" aria-label="Live"></div>`;
    }

    // Download trim mode is drawn in the same timestamp coordinate space as
    // recordings/events. On this vertical timeline newer time is above older
    // time, so END is the upper handle and START is the lower handle.
    if(this._downloadRange){
      const r=this._downloadRange;
      const start=Math.max(s,Math.min(e,Number(r.start)));
      const end=Math.max(s,Math.min(e,Number(r.end)));
      const endPct=yPct(end), startPct=yPct(start);
      const bandTop=Math.min(endPct,startPct);
      const bandHeight=Math.max(.35,Math.abs(startPct-endPct));
      const duration=this._formatDownloadRangeDuration(Number(r.end)-Number(r.start));
      html+=`<div class="tl-download-range" data-start="${Math.floor(Number(r.start))}" data-end="${Math.floor(Number(r.end))}" aria-label="Download range ${this._timelineTime(r.start)} to ${this._timelineTime(r.end)}">
        <div class="tl-range-band" style="top:${bandTop}%;height:${bandHeight}%"></div>
        <div class="tl-range-boundary tl-range-end" data-range-handle="end" style="top:${endPct}%" role="slider" aria-label="Download end" aria-valuetext="${this._timelineTime(r.end)}"><i></i><span><b>END</b>${this._timelineScaleTime(r.end)}</span></div>
        <div class="tl-range-boundary tl-range-start" data-range-handle="start" style="top:${startPct}%" role="slider" aria-label="Download start" aria-valuetext="${this._timelineTime(r.start)}"><i></i><span><b>START</b>${this._timelineScaleTime(r.start)}</span></div>
        <div class="tl-range-actions"><span class="tl-range-duration">${duration}</span><button type="button" data-range-cancel>Cancel</button><button type="button" class="primary" data-range-download>${ICONS.download}<span>Download</span></button></div>
      </div>`;
    }

    // Fixed center playhead. The selected wall-clock time is pinned at mid-track.
    html+=`<div class="tl-playhead" aria-hidden="true"><i></i><span>${this._timelineTime(focus)}</span></div>`;
    // Reconcile the timeline by stable keys instead of replacing the whole
    // track. Advanced Camera Card treats timeline/view state separately from
    // media rendering; we use the same principle here so thumbnails, markers
    // and the playhead survive pans/scrubs without DOM popping or image reloads.
    this._reconcileTimeline(track, html);
    this._timelineDataDirty=false;
    this._renderTimelineZoomLabel();
    const labels=this._$('#tl-labels'); if(labels) labels.innerHTML='';
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
  },

_reconcileTimeline(track, html) {
    const tmp=document.createElement('div');
    tmp.innerHTML=html;
    const oldByKey=new Map();
    [...track.children].forEach(el=>{
      const key=this._timelineNodeKey(el);
      if(key) oldByKey.set(key,el);
    });
    const used=new Set();
    const frag=document.createDocumentFragment();
    [...tmp.children].forEach(next=>{
      const key=this._timelineNodeKey(next);
      let old=key ? oldByKey.get(key) : null;
      // If the semantic element type changed (timeline previews became real
      // buttons in v2.0.10), replace it once instead of preserving the legacy
      // node forever under the same reconciliation key.
      if(old && old.tagName!==next.tagName) { old.remove(); old=null; }
      if(old){
        used.add(old);
        // Update presentation attributes in place. Keep descendants intact for
        // thumbnails and media so an unchanged event never reloads its image.
        if(next.className!==old.className) old.className=next.className;
        if(next.getAttribute('style')!==old.getAttribute('style')) old.setAttribute('style',next.getAttribute('style')||'');
        for(const attr of ['aria-label','data-ts','data-start','data-end','data-tick','data-event-id','data-gap']) {
          const v=next.getAttribute(attr);
          if(v==null) old.removeAttribute(attr); else if(old.getAttribute(attr)!==v) old.setAttribute(attr,v);
        }
        // The cluster count/glyph can change without changing its event key.
        // Update only lightweight marker text; never touch preview <img> nodes.
        if(old.classList.contains('t-ev')) {
          const oldDot=old.querySelector('.t-dot'); const newDot=next.querySelector('.t-dot');
          if(oldDot && newDot && oldDot.innerHTML!==newDot.innerHTML) oldDot.innerHTML=newDot.innerHTML;
        }
        if(old.classList.contains('tl-download-range') && old.innerHTML!==next.innerHTML) old.innerHTML=next.innerHTML;
        if(old.classList.contains('tl-offline') && old.textContent!==next.textContent) old.textContent=next.textContent;
        frag.appendChild(old);
      } else {
        frag.appendChild(next);
      }
    });
    const newKeys=new Set([...tmp.children].map(n=>this._timelineNodeKey(n)).filter(Boolean));
    [...track.children].forEach(old=>{
      const key=this._timelineNodeKey(old);
      if(!key || !newKeys.has(key)) old.remove();
    });
    track.appendChild(frag);
  }
};
