# Changelog

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