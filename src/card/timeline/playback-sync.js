/**
 * Timeline playhead labels, recorded-media clock synchronization, and seek dispatch.
 *
 * Methods are composed onto SightlineCard.prototype; method names are kept
 * stable so existing card behavior and tests remain unchanged.
 */
export const timelinePlaybackSyncMethods = {
_updateTimelineScrubLabel(target) {
    const t=Math.max(0,Math.floor(Number(target)||0));
    if(!Number.isFinite(t)) return;
    const range=this._$('#tl-range');
    if(range) range.textContent=`${new Date(t*1000).toLocaleDateString([],{month:'short',day:'2-digit'}).toUpperCase()} · ${this._timeMinute(t)}`;
  },

_updateTimelinePlaybackTime(ts) {
    // Keep fractional media time internally so the scrubber is driven by the
    // actual decoder clock rather than a once-per-second rounded value. The
    // UI label is rounded only for display. This removes the occasional 1s
    // (and, with HLS, sometimes 2s) apparent drift between the video and the
    // timeline.
    const t=Number(ts);
    if(!Number.isFinite(t) || t<0 || !this.isConnected) return;
    this._timelineFocusTs=t;
    this._scrubTarget=t;
    this._updateTimelineDateLabel?.(t);
    const track=this._$('#tl-track');
    if(!track) return;
    const s=Number(this._winStart), e=Number(this._winEnd);
    const span=Math.max(1,e-s);
    const pct=Math.max(0,Math.min(100,50+((t-s)/span-0.5)*100));
    const ph=track.querySelector('.tl-playhead');
    if(ph) {
      // The playhead itself is fixed at 50% visually; its label is the current
      // playback time. Keep the label updated even when video playback pauses.
      const label=ph.querySelector('span');
      if(label) label.textContent=this._timelineTime(Math.round(t));
    }
    const range=track.querySelector('#tl-range');
    if(range) range.textContent=`${new Date(t*1000).toLocaleDateString([],{month:'short',day:'2-digit'}).toUpperCase()} · ${this._timeMinute(Math.round(t))}`;
    // If the media clock has moved outside the currently visible window,
    // re-anchor the window around it without changing its zoom span. This is
    // especially important when a player resumes after a long stall/rebuffer.
    if(t<s || t>e) {
      const half=span/2;
      this._winStart=Math.max(0,Math.floor(t-half));
      this._winEnd=Math.floor(t+half);
      this._renderRange();
      this._renderTimeline(false);
    }
  },

_wireTimelineMediaClock(video, originTs, token) {
    if(!video || video.dataset.frigateTimelineClock==='1') return;
    video.dataset.frigateTimelineClock='1';
    // This clock is attached only to event clips. A clip has its own media-time
    // origin at ev.start_time, so its wall-clock timestamp is always
    // `eventStart + currentTime`. Never consult _playingRecordings here: that
    // state belongs to the hourly recording player and can survive just long
    // enough during a transition to map clip currentTime=0 to the first second
    // of that hour.
    const mediaOrigin=Number(originTs);
    const sync=()=>{
      if(token!=null && this._playSeq!==token) return;
      const rel=Number(video.currentTime);
      if(!Number.isFinite(rel) || rel<0 || !Number.isFinite(mediaOrigin)) return;
      const absolute=mediaOrigin+rel;
      if(!Number.isFinite(absolute)) return;
      this._updateTimelinePlaybackTime(absolute);
    };
    ['timeupdate','playing','seeked','seeking','pause','waiting','stalled','canplay'].forEach(ev=>video.addEventListener(ev,sync));
    sync();
  },

_attachTimelineMediaClock(player, originTs, token) {
    let tries=0;
    const attach=()=>{
      if(token!=null && this._playSeq!==token) return;
      const video=this._findVideo(player);
      if(video) { this._wireTimelineMediaClock(video,originTs,token); return; }
      if(++tries<160) setTimeout(attach,75);
    };
    attach();
  },

async _seekTimelineTarget(target) {
    const t=Math.max(0,Math.floor(Number(target)));
    if(!Number.isFinite(t)) return;
    const seq=++this._timelineSeekSeq;
    this._scrubTarget=t;
    const hour=this._hourStart(t);

    // Desktop stable-HLS session reuse.
    const current=this._playbackSession;
    if(current && t>=current.sourceStart && t<current.sourceEnd && current.video && current.token===this._playSeq) {
      const offset=this._frigateSeekPosition(t,current.recordings,current.inpointOffset);
      if(Number.isFinite(offset)) {
        current.targetTs=t;
        current.pendingSeek=offset;
        this._playing={rec:t};
        this._updateTimelinePlaybackTime(t);
        if(typeof current.requestSeek==='function') current.requestSeek(offset,t);
        return;
      }
    }

    // Restore the older v52 iOS behavior: when the hour MP4 is already mounted,
    // seek the native video directly instead of rebuilding the media source or
    // waiting on an HLS seek state machine. This is the path that previously felt
    // immediate on iPhone/iPad.
    if(this._isIOSRecordingPlatform()) {
      const currentVideo=this._findVideo(this.shadowRoot.querySelector('#viewer'));
      const sourceStart=Number.isFinite(this._playingSourceStart)?this._playingSourceStart:hour;
      const sourceEnd=Number.isFinite(this._playingSourceEnd)?this._playingSourceEnd:hour+3600;
      if(currentVideo && this._playingHour===hour && t>=sourceStart && t<sourceEnd &&
         Number.isFinite(currentVideo.duration) && currentVideo.duration>0 &&
         Array.isArray(this._playingRecordings) && this._playingRecordings.length) {
        const offset=this._frigateSeekPosition(t,this._playingRecordings,this._playingInpointOffset||0);
        if(Number.isFinite(offset)) {
          try {
            currentVideo.currentTime=Math.min(offset,Math.max(0,currentVideo.duration-0.05));
            currentVideo.muted=true;
            currentVideo.play().catch(()=>{});
          } catch(_) {}
          this._playing={rec:t};
          this._scrubTarget=t;
          this._updateTimelinePlaybackTime(t);
          this._renderStreamCtrl();
          return;
        }
      }
    }

    await this._showRecording(hour,hour+3600,t);
    if(seq!==this._timelineSeekSeq) return;
  }
};
