# Changelog

## 1.1.5

- Fixed the timeline date picker on iOS/Safari/WKWebView by making the user's tap land directly on a real `input[type="date"]` instead of forwarding the gesture to an offscreen input with `showPicker()`/`click()`.
- The native date input now overlays the visible timeline calendar control while preserving the existing icon and styling, which also keeps desktop picker anchoring tied to the calendar button instead of an arbitrary offscreen point.
- The input is refreshed with the timeline's current focused date on pointer/touch/focus before WebKit opens the system picker, so it remains accurate after scrubbing.
- Selecting a calendar date is now a complete navigation action: Sightline preserves the current timeline zoom, starts the visible range at local midnight, and immediately seeks/plays the continuous recording at the timeline's fixed playhead without requiring a second tap.
- When the timeline is on a historical day, the calendar control displays the selected date beside the icon; on Today it returns to the compact icon-only state.
- The selected-date label follows timeline scrubbing and recorded playback so it always reflects the date currently under the playhead.
- Date changes still keep the stale-playback/timer protections from v1.1.2/v1.1.3 and synchronized Multiview playback continues to seek all configured cameras together.
- Added regression coverage for the direct-hit iOS picker path, one-step calendar playback, selected-date labeling, and preservation of the existing timeline zoom/span.

## 1.1.4

- Replaced the timeline's custom calendar popover with the browser's native system date picker behavior.
- Made Clips, Recordings, and Reviews lists responsive scroll containers on phone, tablet, and workstation layouts instead of forcing a fixed four-row height.
- Fixed Clips/Recordings/Reviews as the configured default tab on wide dashboards so the Live pane is measured and kept mounted from the first paint.
- Made workstation and medium-width layouts derive their grid columns from the panes that are actually enabled.
- Disabling the timeline now removes the timeline column completely and lets Live and the media browser expand into the freed space instead of leaving a blank gap.
- Added regression coverage for native timeline date selection, responsive media scrolling, Clips-first startup, and timeline-disabled layouts.

## 1.1.3

- Fixed repeated timeline calendar navigation after scrubbing or recorded playback.
- Date selection now cancels stale wheel-settle/data timers and invalidates in-flight timeline loads before applying the new date.
- Active single-camera and synchronized Multiview recording clocks are stopped before a calendar jump so they cannot move the timeline back to the previous scrub position.
- Added regression coverage for selecting multiple dates after scrubbing while preserving the current zoom level.

## 1.1.2

- Fixed timeline calendar date selection so it preserves the current timeline zoom/span instead of expanding the viewport to the full selected day.
- Timeline date navigation now leaves LIVE-follow mode and begins the selected date at local midnight when no explicit time range is involved.
- Added regression coverage for media From/To time filtering, including selected-date ranges, date-only midnight bounds, and overnight time ranges.

## 1.1.1

- Fixed Multiview Clips so every configured camera is queried over the same Clips browser time range instead of only the active camera receiving the full range.
- Stabilized the Multiview camera filter so all configured cameras remain available even before each camera has returned a clip.
- Fixed desktop clip playback opened from Multiview so workstation layout rules cannot squeeze the player beside the timeline or media browser.
- Reduced the size of the Back to Live / Back to Multiview playback control.

## 1.1.0

- Added configurable startup tab (`live`, `clips`, `recordings`, or `reviews`).
- Added optional newest-clip autoplay when starting on Clips.
- Grid/Multiview recorded clip playback now uses the full card and returns to Multiview afterward.
- Added an explicit Back to Live / Back to Multiview playback control.
- Added configurable timeline thumbnail sizing (`timeline.thumbnail_size`).
- Added synchronized Multiview timeline playback: scrubbing the timeline seeks continuous recordings for every configured camera to the same wall-clock timestamp.
- Cameras without retained footage at the selected Multiview timestamp show `No recording` without moving the other camera feeds out of sync.

## 1.0.0

First public release as **Sightline for Frigate**.

- New Lovelace custom element: `custom:sightline-card`.
- New HACS bundle: `dist/sightline-for-frigate.js`.
- Preserves the existing Frigate live view, timeline, media browser, downloads, filters, two-way audio, visual editor, and responsive wide-dashboard layout.