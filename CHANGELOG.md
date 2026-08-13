# Changelog

## 1.1.0

- Added configurable startup tab (`live`, `clips`, `recordings`, or `reviews`).
- Added optional newest-clip autoplay when starting on Clips.
- Grid/Multiview recorded playback now uses the full card and returns to Multiview afterward.
- Added an explicit Back to Live / Back to Multiview playback control.
- Added configurable timeline thumbnail sizing (`timeline.thumbnail_size`).
- Fixed timeline playback from Multiview by using the full-card recorded-media surface.

## 1.0.0

First public release as **Sightline for Frigate**.

- New Lovelace custom element: `custom:sightline-card`.
- New HACS bundle: `dist/sightline-for-frigate.js`.
- Preserves the existing Frigate live view, timeline, media browser, downloads, filters, two-way audio, visual editor, and responsive wide-dashboard layout.
