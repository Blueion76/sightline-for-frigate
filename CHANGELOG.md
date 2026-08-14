# Changelog

## 1.1.5

### Timeline and calendar reliability

- Reworked the timeline calendar control around a real `input[type="date"]` positioned directly over the visible calendar button. iOS/Safari/WKWebView keeps the direct native-input gesture path instead of forwarding a tap to an offscreen input.
- Added a desktop Chromium path that opens the native calendar with `showPicker()` from the trusted mouse click; Enter/Space keyboard activation is supported as well.
- Fixed cold-start calendar initialization so null/zero timeline placeholders are not interpreted as Unix epoch time. The picker now opens on Today instead of Dec 31, 1969 / Jan 1, 1970 before the timeline has finished starting.
- Refreshes the native date input from the current timeline focus before pointer, touch, focus, and delegated calendar activation so the picker always opens on the date currently under the playhead.
- Selecting a calendar date is now a complete navigation action: Sightline preserves the current timeline span/zoom, starts the selected day at local midnight, exits LIVE-follow mode, invalidates stale playback/data work, and immediately seeks/plays the continuous recording at the fixed playhead without requiring a second timeline click.
- Historical navigation displays the selected date beside the calendar icon and returns to the compact icon-only control on Today. The label follows scrubbing and recorded playback across day boundaries.
- Hardened desktop timeline panning so a drag can begin directly on a detection thumbnail/event marker after a 4px movement threshold while a stationary click still opens the event. The synthetic click after a real drag is suppressed.
- Preserved timeline legend filtering through the refactor so clicking a detection class filters the timeline and clicking the active class again returns to All.
- Replaced factor-based +/- timeline zoom with discrete scales: `1m`, `5m`, `10m`, `30m`, `45m`, `1h`, `3h`, `6h`, `12h`, and `24h`.
- Fixed recorded-playback synchronization on Windows/Chromium: the media decoder clock now translates the visible timeline window by the same fractional delta as playback, keeping the fixed playhead, `HH:MM:SS` pill, time scale, recording rail, detections, and thumbnails on the same wall-clock timestamp instead of allowing the label to advance independently.

### Live audio and two-way audio

- Fixed microphone discovery for privacy-restricted browsers that return an empty `enumerateDevices()` list before permission is granted. Talk remains eligible when `getUserMedia()` is supported, and the real permission request remains authoritative.
- Added an explicit live-audio speaker control for go2rtc WebRTC streams so inbound camera audio can be unmuted from a direct user gesture instead of depending on browser-native video controls.
- Preserved Sightline's existing Home Assistant Frigate integration same-origin go2rtc WebSocket proxy, two-way-audio session lifecycle, disconnect timeout, and camera-bound talk behavior.

### Source architecture and maintainability

- Refactored the card into focused domain modules while preserving the existing Lovelace configuration, Frigate API behavior, Home Assistant authentication/proxy behavior, DOM hooks, playback routes, and user-facing feature set.
- Split the previous catch-all implementations into dedicated `data/`, `live/`, `media/`, `playback/`, `talk/`, and `timeline/` modules with small composition entry points.
- Renamed the internal `multi-recording-*` implementation to the clearer `multiview/` domain and separated Multiview core state, controller logic, player synchronization, media-browser behavior, and timeline UI.
- Replaced constructor-wide inline state assignments with a documented `initializeCardState()` module so mutable lifecycle state is defined in one place.
- Moved playback workspace/grid presentation policy into `ui/playback-layout.js` instead of patching `_enter()`, `_showLive()`, and `_renderTimeline()` after class composition.
- Removed the side-effect `multi-recording-init.js` / version-specific patch-layer architecture and now compose method groups declaratively in `SightlineCard.js`, eliminating override chains that previously allowed one click handler to bypass another.
- Split the visual editor into dedicated configuration serialization, entity/registry discovery, and rendering modules instead of a single large methods file with post-class prototype patches.
- Extracted the large shell stylesheet from the DOM renderer into `styles/shell.js`, keeping rendering code focused on structure while preserving CSS cascade order and visual behavior.
- Added an explicit build manifest shared by the HACS build and architecture validation. Every runtime `src/**/*.js` module must be present in the manifest and duplicate entries are rejected.
- Added architecture regression checks that prohibit post-composition prototype patching, verify intentional method ownership/order, and ensure source modules cannot accidentally work in ESM tests while being omitted from the generated HACS bundle.

### Validation

- Expanded regression coverage for cold-start date initialization, direct-hit iOS date selection, trusted-click desktop picker activation, one-step calendar playback, selected-date labeling, timeline span preservation, Chromium media-clock synchronization, legend filtering, microphone pre-permission discovery, live-audio unmute, desktop event-card dragging/click suppression, Multiview behavior, responsive layouts, media browsing, discrete timeline scales, and source/build architecture.
- `npm run verify` remains the release gate: it rebuilds `dist/sightline-for-frigate.js`, validates the source/HACS bundle, and runs the complete regression suite.

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
- Added per-camera filtering for Clips, Recordings, and Reviews when using Multiview.
- Added a responsive desktop/workstation layout with persistent Live, Timeline, and Media panes.
- Added Multiview synchronized continuous-recording playback and timeline seeking.
- Added a configurable timeline thumbnail size and improved event thumbnail rendering.
- Added an explicit Back to Live / Back to Multiview control while recorded media is playing.

## 1.0.0

- Initial Sightline for Frigate release.
