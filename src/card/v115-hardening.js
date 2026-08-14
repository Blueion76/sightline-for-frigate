import { ICONS } from '../constants.js';
import { liveMethods } from './live.js';
import { browserMethods } from './browser.js';
import { timelineInteractionMethods } from './timeline-interaction.js';

export const TIMELINE_SCALE_SECONDS = Object.freeze([
  60,
  5 * 60,
  10 * 60,
  30 * 60,
  45 * 60,
  60 * 60,
  3 * 60 * 60,
  6 * 60 * 60,
  12 * 60 * 60,
  24 * 60 * 60,
]);

export function timelineScaleStep(spanSeconds, direction) {
  const current = Math.max(1, Number(spanSeconds) || 10 * 60);
  if (direction === 'in') {
    for (let i = TIMELINE_SCALE_SECONDS.length - 1; i >= 0; i--) {
      if (TIMELINE_SCALE_SECONDS[i] < current - 1) return TIMELINE_SCALE_SECONDS[i];
    }
    return TIMELINE_SCALE_SECONDS[0];
  }
  for (const span of TIMELINE_SCALE_SECONDS) {
    if (span > current + 1) return span;
  }
  return TIMELINE_SCALE_SECONDS[TIMELINE_SCALE_SECONDS.length - 1];
}

export function timelineScaleLabel(spanSeconds) {
  const span = Math.max(1, Math.round(Number(spanSeconds) || 0));
  const exact = new Map([
    [60, '1m'], [300, '5m'], [600, '10m'], [1800, '30m'], [2700, '45m'],
    [3600, '1h'], [10800, '3h'], [21600, '6h'], [43200, '12h'], [86400, '24h'],
  ]).get(span);
  if (exact) return exact;
  if (span < 3600) return `${Math.max(1, Math.round(span / 60))}m`;
  const hours = span / 3600;
  return Number.isInteger(hours) ? `${hours}h` : `${Math.round(hours * 10) / 10}h`;
}

function setTimelineWindow(card, spanSeconds, anchorTs, anchorRatio) {
  const span = Math.max(60, Math.min(86400, Math.round(Number(spanSeconds) || 10 * 60)));
  const hasExplicitAnchor = Number.isFinite(Number(anchorTs));
  const ratio = Number.isFinite(Number(anchorRatio))
    ? Math.max(0, Math.min(1, Number(anchorRatio)))
    : 0.5;

  if (card._timelineFollowingLive && !hasExplicitAnchor) {
    const now = Math.floor(Date.now() / 1000);
    const half = span / 2;
    card._winStart = Math.floor(now - half);
    card._winEnd = Math.floor(now + half);
    if (card._winStart < 0) {
      card._winEnd -= card._winStart;
      card._winStart = 0;
    }
    card._timelineFocusTs = now;
    card._scrubTarget = now;
    card._exhausted = false;
    return span;
  }

  const anchor = hasExplicitAnchor
    ? Number(anchorTs)
    : (Number.isFinite(Number(card._timelineFocusTs))
      ? Number(card._timelineFocusTs)
      : ((Number(card._winStart) + Number(card._winEnd)) / 2));
  let focus = anchor - (0.5 - ratio) * span;
  let start = Math.floor(focus - span / 2);
  let end = Math.floor(focus + span / 2);
  const now = Math.floor(Date.now() / 1000);

  // Match the existing anchored zoom behavior: historical views never gain a
  // future-only tail, while LIVE +/- remains centered through the branch above.
  if (end > now) {
    const shift = end - now;
    start -= shift;
    end -= shift;
    focus -= shift;
  }
  if (start < 0) {
    const shift = -start;
    start += shift;
    end += shift;
    focus += shift;
  }

  card._winStart = start;
  card._winEnd = end;
  card._timelineFocusTs = Math.max(start, Math.min(end, Math.round(focus)));
  card._scrubTarget = card._timelineFocusTs;
  card._exhausted = false;
  return span;
}

function desktopTimelineDragTarget(target) {
  if (!target?.closest) return false;
  if (!target.closest('.t-preview,.t-ev')) return false;
  if (target.closest('button,a,input,select,textarea,.tl-zoom-controls,.tl-playhead i')) return false;
  return true;
}

export const v115HardeningMethods = {
  async _refreshMicrophoneAvailability() {
    // enumerateDevices() is deliberately privacy-restricted in several browser
    // contexts before permission has been granted. Treat getUserMedia support
    // as "microphone may be available" and let the actual permission request be
    // authoritative. Otherwise Sightline can hide Talk before the user has any
    // way to grant microphone permission.
    const supported = !!(this._config?.two_way_audio && navigator.mediaDevices?.getUserMedia);
    let present = supported;
    if (supported && navigator.mediaDevices?.enumerateDevices) {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        if (Array.isArray(devices) && devices.some(device => device?.kind === 'audioinput')) present = true;
        // An empty list is intentionally not treated as proof that no mic exists.
      } catch (_) {
        present = true;
      }
    }

    const changed = this._microphonePresent !== present;
    this._microphonePresent = present;
    if (!present && this._talkSpeaking) {
      try { await this._stopTalk(); } catch (_) {}
    }
    if (changed && this.isConnected) this._renderStreamCtrl();
    return present;
  },

  _toggleLiveAudio() {
    const video = this._go2rtcLive?.video || this._findVideo?.(this._engine);
    if (!video) return;
    this._liveAudioEnabled = !this._liveAudioEnabled;
    try {
      video.muted = !this._liveAudioEnabled;
      video.volume = 1;
      if (this._liveAudioEnabled) {
        video.setAttribute?.('playsinline', '');
        const play = video.play?.();
        if (play?.catch) play.catch(() => {});
      }
    } catch (_) {}
    this._renderStreamCtrl();
  },

  _renderStreamCtrl() {
    const result = liveMethods._renderStreamCtrl.call(this);
    const bar = this.shadowRoot?.querySelector?.('#stream-ctrl-bar');
    if (!bar) return result;
    const inGrid = this._viewMode === 'grid';
    const isLive = !this._playing && this.shadowRoot.querySelector('#viewer')?.style.display !== 'flex';
    const video = this._go2rtcLive?.video || null;
    const streamHasAudio = !!(
      this._liveAudioAvailable ||
      this._go2rtcLive?.stream?.getAudioTracks?.().length
    );

    // WebRTC must start muted in many browsers to satisfy autoplay policy.
    // Surface an explicit speaker button once a receive-audio track is known so
    // unmuting always happens from a user gesture instead of depending on native
    // <video> chrome that may be hidden or inconsistent inside HA/WebViews.
    if (isLive && !inGrid && video && streamHasAudio) {
      const button = document.createElement('button');
      button.type = 'button';
      button.id = 'sc-audio';
      button.className = `scb-btn audio-btn${this._liveAudioEnabled ? ' active' : ''}`;
      button.innerHTML = this._liveAudioEnabled ? ICONS.volOn : ICONS.volOff;
      button.title = this._liveAudioEnabled ? 'Mute live audio' : 'Unmute live audio';
      button.setAttribute('aria-label', button.title);
      button.setAttribute('aria-pressed', String(!!this._liveAudioEnabled));
      bar.insertBefore(button, bar.firstChild);
    }
    return result;
  },

  _zoomTimeline(factor, anchorTs, anchorRatio) {
    const oldSpan = Math.max(1, Number(this._winEnd) - Number(this._winStart));
    const direction = Number(factor || 1) >= 1 ? 'in' : 'out';
    const nextSpan = timelineScaleStep(oldSpan, direction);
    setTimelineWindow(this, nextSpan, anchorTs, anchorRatio);
    this._timelineZoomMax = 60; // 60x = 1 minute visible span.
    this._timelineZoom = 3600 / nextSpan;
    this._renderTimeline();
    this._renderRange();
    this._renderTimelineZoomLabel();
    this._scheduleTimelineDynamicData('motion');
    this._scheduleTimelineDataLoad();
  },

  _renderTimelineZoomLabel() {
    const el = this._$('#tl-zoom-level');
    if (!el) return;
    el.textContent = timelineScaleLabel(Number(this._winEnd) - Number(this._winStart));
  },

  _wireScrub() {
    timelineInteractionMethods._wireScrub.call(this);
    const track = this.shadowRoot?.querySelector?.('#tl-track');
    if (!track) return;
    this._wireDesktopTimelineCardDrag(track, this._scrubAbort?.signal);
  },

  _wireDesktopTimelineCardDrag(track, signal) {
    let drag = null;
    const options = signal ? { signal } : undefined;

    const finish = (event, cancelled = false) => {
      if (!drag || (event?.pointerId != null && event.pointerId !== drag.pointerId)) return;
      const state = drag;
      drag = null;
      try {
        if (track.hasPointerCapture?.(state.pointerId)) track.releasePointerCapture(state.pointerId);
      } catch (_) {}
      if (!state.moved) return;

      this._timelineInteracting = false;
      this._scrubGestureInvalidated = false;
      track.classList?.remove?.('grab');
      this._timelineSuppressClickUntil = performance.now() + 400;
      const target = this._scrubTarget ?? this._timelineFocusTs ?? this._winEnd;
      const crossedLive = this._timelineLiveCrossed || this._isAtLiveEdge(target);
      const wasLive = state.wasLive;
      this._timelineLiveCrossed = false;
      this._timelineWasLiveBeforeGesture = false;

      if (!cancelled) {
        if (crossedLive) this._refreshLiveFromTimeline({ restart: !wasLive });
        else this._seekTimelineTarget(target);
        this._scheduleTimelineDataLoad();
      } else {
        this._renderTimeline();
      }
    };

    track.addEventListener('pointerdown', event => {
      if (event.pointerType !== 'mouse' || event.button !== 0 || this._downloadRange) return;
      if (!desktopTimelineDragTarget(event.target)) return;
      drag = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        winStart: Number(this._winStart),
        winEnd: Number(this._winEnd),
        focus: Number.isFinite(Number(this._timelineFocusTs))
          ? Number(this._timelineFocusTs)
          : ((Number(this._winStart) + Number(this._winEnd)) / 2),
        wasLive: this._timelineFollowingLive === true,
        moved: false,
        invalidated: false,
      };
      try { track.setPointerCapture?.(event.pointerId); } catch (_) {}
    }, options);

    track.addEventListener('pointermove', event => {
      if (!drag || event.pointerId !== drag.pointerId) return;
      const distance = Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY);
      if (!drag.moved && distance < 4) return;

      if (!drag.moved) {
        drag.moved = true;
        this._timelineInteracting = true;
        this._timelineWasLiveBeforeGesture = drag.wasLive;
        this._timelineFollowingLive = false;
        this._timelineLiveCrossed = false;
        this._scrubGestureInvalidated = true;
        if (this._playing || this._activePlaybackCleanup) this._invalidatePlaybackForTimelineMove();
        track.classList?.add?.('grab');
      }

      event.preventDefault?.();
      event.stopPropagation?.();
      const rect = track.getBoundingClientRect();
      const size = Math.max(1, track.clientHeight || rect.height || 1);
      const span = Math.max(1, drag.winEnd - drag.winStart);
      const delta = -(event.clientY - drag.startY);
      const pan = Math.round(delta / size * span);
      let start = drag.winStart - pan;
      let end = drag.winEnd - pan;
      let focus = drag.focus - pan;
      const now = Math.floor(Date.now() / 1000);
      const crossedLive = drag.focus < now - 1 && focus >= now - 1;

      if (start < 0) {
        const shift = -start;
        start += shift;
        end += shift;
        focus += shift;
      }
      this._winStart = start;
      this._winEnd = end;
      this._timelineFocusTs = Math.max(start, Math.min(end, Math.round(focus)));
      this._exhausted = false;

      if (crossedLive) {
        this._timelineLiveCrossed = true;
        this._scrubTarget = now;
      } else {
        this._scrubTarget = this._timelineFocusTs;
      }
      this._updateTimelineLive();
      this._renderRange();
      this._reconcileTimelineDuringMove();
      this._scheduleTimelineDynamicData('motion');
      this._updateTimelineScrubLabel(this._scrubTarget);
    }, options);

    track.addEventListener('pointerup', event => finish(event, false), options);
    track.addEventListener('pointercancel', event => finish(event, true), options);
    track.addEventListener('lostpointercapture', event => {
      if (drag && event.pointerId === drag.pointerId) finish(event, false);
    }, options);
  },

  _click(event) {
    if (event?.target?.closest?.('#sc-audio')) {
      event.preventDefault?.();
      event.stopPropagation?.();
      return this._toggleLiveAudio();
    }
    if (
      (this._timelineSuppressClickUntil || 0) > performance.now() &&
      event?.target?.closest?.('.t-preview,.t-ev,[data-tick]')
    ) {
      event.preventDefault?.();
      event.stopPropagation?.();
      return;
    }
    return browserMethods._click.call(this, event);
  },
};
