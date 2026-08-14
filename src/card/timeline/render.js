/**
 * Timeline, legend, summary, scale, and incremental DOM rendering.
 *
 * Methods are composed onto SightlineCard.prototype; method names are kept
 * stable so existing card behavior and tests remain unchanged.
 */
import { DAY, ICONS, CAM_COLORS } from '../../constants.js';
import { cap, timelineGlyph, camDisplayName } from '../../helpers.js';

export const timelineViewMethods = {
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
      // buttons in a previous implementation), replace it once instead of preserving the legacy
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
