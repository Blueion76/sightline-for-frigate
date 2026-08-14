/**
 * Frigate recording segment math, inpoint offsets, and seek/progress calculations.
 *
 * Methods are composed onto SightlineCard.prototype; method names are kept
 * stable so existing card behavior and tests remain unchanged.
 */
export const recordingTimeMethods = {
_frigateSegmentDuration(seg) {
    const d=Number(seg?.duration);
    if (Number.isFinite(d) && d >= 0) return d;
    const a=Number(seg?.start_time), b=Number(seg?.end_time);
    return Number.isFinite(a)&&Number.isFinite(b) ? Math.max(0,b-a) : 0;
  },

_frigateInpointOffset(sourceStart, firstRecording) {
    const start = Number(sourceStart);
    if (!Number.isFinite(start) || !firstRecording) return 0;
    const fs = Number(firstRecording.start_time), fe = Number(firstRecording.end_time);
    if (!Number.isFinite(fs) || !Number.isFinite(fe)) return 0;
    if (fs < start && fe > start) return start - fs;
    return 0;
  },

_frigateSeekPosition(timestamp, recordings, inpointOffset=0) {
    if (!Array.isArray(recordings) || !recordings.length) return undefined;
    const sorted=[...recordings]
      .filter(r=>Number.isFinite(Number(r?.start_time)))
      .sort((a,b)=>Number(a.start_time)-Number(b.start_time));
    if (!sorted.length) return undefined;

    const first=Number(sorted[0].start_time);
    const last=Number(sorted[sorted.length-1].end_time);
    if (!Number.isFinite(first) || !Number.isFinite(last) ||
        timestamp < first || timestamp > last) return undefined;

    // Frigate's calculateSeekPosition() uses wall-clock segment length
    // (end_time - start_time) for seeking. `segment.duration` is used by
    // DynamicVideoController.getProgress(), but not by calculateSeekPosition().
    // Keeping these two calculations distinct is important: substituting
    // `duration` here can shift the seek target toward the start of the hour.
    let seek=0;
    for (const seg of sorted) {
      const a=Number(seg.start_time), b=Number(seg.end_time);
      const wallDuration=(Number.isFinite(a)&&Number.isFinite(b)) ? Math.max(0,b-a) : 0;
      if (!Number.isFinite(a) || !Number.isFinite(b) || wallDuration <= 0) continue;
      if (a > timestamp) break;
      if (b < timestamp) {
        seek += wallDuration;
        continue;
      }
      seek += Math.max(0, timestamp-a);
      // calculateSeekPosition() in Frigate subtracts the HLS inpoint offset
      // as its very last step — do the same here, after the within-segment
      // offset has been added, not before.
      const adjusted = seek - (Number(inpointOffset)||0);
      return adjusted >= 0 ? adjusted : undefined;
    }
    return undefined;
  },

_frigateProgress(playerTime, recordings, inpointOffset=0) {
    if (!Array.isArray(recordings) || !recordings.length || !Number.isFinite(Number(playerTime))) return undefined;
    const sorted=[...recordings]
      .filter(r=>Number.isFinite(Number(r?.start_time)))
      .sort((a,b)=>Number(a.start_time)-Number(b.start_time));
    // The inverse of _frigateSeekPosition's final subtraction: Frigate's own
    // HlsVideoPlayer.getVideoTime() computes `video.currentTime + inpointOffset`
    // before ever handing the number to getProgress()'s raw accumulation. Do
    // the same here so seeking and progress-reporting stay perfectly
    // symmetric — otherwise the playhead reports a timestamp a few seconds
    // earlier than what's actually on screen for the whole first hour.
    const raw = Math.max(0, Number(playerTime)) + (Number(inpointOffset)||0);
    let total=0;
    for (const seg of sorted) {
      const a=Number(seg.start_time);
      const duration=this._frigateSegmentDuration(seg);
      if (!Number.isFinite(a) || duration <= 0) continue;
      if (total + duration > raw) return a + (raw-total);
      total += duration;
    }
    const last=sorted[sorted.length-1];
    return Number(last?.end_time);
  },

_isIOSRecordingPlatform() {
    const ua=navigator.userAgent||'';
    return /iPad|iPhone|iPod/.test(ua) || (navigator.platform==='MacIntel' && navigator.maxTouchPoints>1);
  },

_iosRecordingWindow(target) {
    // Native HLS on iOS is reliable once the source is small, but seeking deep
    // into a full one-hour playlist can take several seconds while WebKit walks
    // the playlist/segment index. Keep iOS playback in deterministic 5-minute
    // VOD windows so the maximum seek offset is < 300s. Desktop continues using
    // the full hour with hls.js, which is efficient at long-range seeks.
    const bucket=5*60;
    const t=Math.max(0,Math.floor(Number(target)||0));
    const start=Math.floor(t/bucket)*bucket;
    const now=Math.floor(Date.now()/1000);
    const end=Math.max(start+1,Math.min(start+bucket,now));
    return {start,end};
  }
};
