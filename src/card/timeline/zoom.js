/**
 * Timeline zoom window calculations and visible scale labels.
 *
 * The +/- controls intentionally use a small, predictable ladder instead of
 * multiplying the current window by an arbitrary factor. Pinch/trackpad zoom
 * still passes an explicit anchor and therefore preserves pointer-centered
 * behavior.
 */

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

const TIMELINE_SCALE_LABELS = new Map([
  [60, '1m'],
  [300, '5m'],
  [600, '10m'],
  [1800, '30m'],
  [2700, '45m'],
  [3600, '1h'],
  [10800, '3h'],
  [21600, '6h'],
  [43200, '12h'],
  [86400, '24h'],
]);

export function timelineScaleStep(currentSpan, direction) {
  const current = Math.max(1, Number(currentSpan) || 10 * 60);

  if (direction === 'in') {
    for (let i = TIMELINE_SCALE_SECONDS.length - 1; i >= 0; i -= 1) {
      if (TIMELINE_SCALE_SECONDS[i] < current - 1) return TIMELINE_SCALE_SECONDS[i];
    }
    return TIMELINE_SCALE_SECONDS[0];
  }

  for (const span of TIMELINE_SCALE_SECONDS) {
    if (span > current + 1) return span;
  }
  return TIMELINE_SCALE_SECONDS.at(-1);
}

export function timelineScaleLabel(spanSeconds) {
  const span = Math.max(1, Math.round(Number(spanSeconds) || 0));
  const exact = TIMELINE_SCALE_LABELS.get(span);
  if (exact) return exact;
  if (span < 3600) return `${Math.max(1, Math.round(span / 60))}m`;
  const hours = span / 3600;
  return Number.isInteger(hours) ? `${hours}h` : `${Math.round(hours * 10) / 10}h`;
}

function applyTimelineScale(card, spanSeconds, anchorTs, anchorRatio) {
  const span = Math.max(60, Math.min(86400, Math.round(Number(spanSeconds) || 10 * 60)));
  const hasExplicitAnchor = Number.isFinite(Number(anchorTs));
  const ratio = Number.isFinite(Number(anchorRatio))
    ? Math.max(0, Math.min(1, Number(anchorRatio)))
    : 0.5;

  if (card._timelineFollowingLive && !hasExplicitAnchor) {
    const now = Math.floor(Date.now() / 1000);
    card._winStart = Math.max(0, Math.floor(now - span / 2));
    card._winEnd = card._winStart + span;
    card._timelineFocusTs = now;
    card._scrubTarget = now;
  } else {
    const anchor = hasExplicitAnchor
      ? Number(anchorTs)
      : Number.isFinite(Number(card._timelineFocusTs))
        ? Number(card._timelineFocusTs)
        : (Number(card._winStart) + Number(card._winEnd)) / 2;

    let focus = anchor - (0.5 - ratio) * span;
    let start = Math.floor(focus - span / 2);
    let end = start + span;
    const now = Math.floor(Date.now() / 1000);

    // Historical zoom must not create a future-only tail. LIVE +/- uses the
    // centered branch above, while pointer-anchored zoom stays within now.
    if (end > now) {
      const shift = end - now;
      start -= shift;
      end -= shift;
      focus -= shift;
    }
    if (start < 0) {
      focus -= start;
      end -= start;
      start = 0;
    }

    card._winStart = start;
    card._winEnd = end;
    card._timelineFocusTs = Math.max(start, Math.min(end, Math.round(focus)));
    card._scrubTarget = card._timelineFocusTs;
  }

  card._exhausted = false;
  card._timelineZoomMax = 60; // 60x corresponds to a one-minute visible window.
  card._timelineZoom = 3600 / span;
  return span;
}

export const timelineZoomMethods = {
  _zoomTimeline(factor, anchorTs, anchorRatio) {
    const currentSpan = Math.max(1, Number(this._winEnd) - Number(this._winStart));
    const direction = Number(factor || 1) >= 1 ? 'in' : 'out';
    const nextSpan = timelineScaleStep(currentSpan, direction);

    applyTimelineScale(this, nextSpan, anchorTs, anchorRatio);
    this._renderTimeline();
    this._renderRange();
    this._renderTimelineZoomLabel();
    this._scheduleTimelineDynamicData('motion');
    this._scheduleTimelineDataLoad();
  },

  _resetTimelineZoom() {
    const span = this._timelineDefaultSpanSeconds();
    this._timelineZoom = 3600 / span;

    if (this._timelineFollowingLive) {
      const now = Math.floor(Date.now() / 1000);
      this._winStart = now - span / 2;
      this._winEnd = now + span / 2;
      this._timelineFocusTs = now;
      this._scrubTarget = now;
      this._exhausted = false;
    } else {
      const anchor = this._timelineFocusTs || this._scrubTarget || (this._winStart + this._winEnd) / 2;
      this._setTimelineWindowAround(anchor, 0.5, span);
      this._scrubTarget = this._timelineFocusTs;
    }

    this._renderTimeline();
    this._renderRange();
    this._renderTimelineZoomLabel();
    this._scheduleTimelineDynamicData('motion');
    this._scheduleTimelineDataLoad();
  },

  _renderTimelineZoomLabel() {
    const element = this._$('#tl-zoom-level');
    if (!element) return;
    element.textContent = timelineScaleLabel(Number(this._winEnd) - Number(this._winStart));
  },
};
