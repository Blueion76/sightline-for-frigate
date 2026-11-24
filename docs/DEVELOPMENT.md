# Standalone development

Use the actual HACS bundle in a browser without installing Home Assistant,
Frigate, HACS, Docker, or supplying camera credentials. Node.js 20+ is required.

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:5173. The server binds to localhost only. Set `PORT` to
change its port. Source changes rebuild the bundle and reload the preview;
changes under `dev/` reload the page. Restart the server after changing its
server code or shared fixture definitions. Build failures are printed in the
terminal and do not reload the last working page.

## Preview controls

- **Scenario:** populated, empty library, offline cameras with retained media,
  or responses delayed by 800ms.
- **Viewport:** desktop, tablet (820px), or mobile (390px). These change the
  card container width; browser device emulation is still needed for touch,
  browser viewport, and OS-specific behavior.
- **Theme:** light or dark.
- **Cameras:** single camera or three-camera Multiview.
- **Simulate event:** update the newest event and emit the integration's end
  notification through the subscription mock. The card performs its normal
  debounced refresh; it is not repainted directly by the preview.
- **Reset fixtures:** create a fresh card and mock session. Favorites and
  reviewed state persist during that session and reset with this control.
- **Mock HA requests:** open the request log from the header toolbar.

The preview uses the remaining window space below the toolbar, with scrolling
inside the preview area and no outer padding.

Controls are reflected in the URL so a scenario can be bookmarked, for example:
http://127.0.0.1:5173/?scenario=offline&viewport=mobile&theme=light&cameras=1

The default opens Clips with the desktop timeline visible. Try Reviews,
Recordings, native video seeking, timeline gestures, filters, favorite actions,
and review actions. Existing card bugs remain observable here; the harness does
not implement selection styles or repair viewer/timeline synchronization.

## Fixtures and boundaries

`dev/fixtures.mjs` supplies three synthetic cameras, events spanning today and
yesterday, recognized faces, zones, favorites, reviewed/unreviewed detections,
and two days of recording segments with a one-minute gap halfway through every
hour. Fixture times are anchored once when the server starts, relative to the
current time. Restart for a fresh time anchor during long development sessions.

`dev/mock-ha.mjs` implements HA's state/config, `callWS`, signed-path and
media-resolution responses, and subscription contract. Returned data is cloned,
so optimistic card mutations cannot silently mutate the mock backend. Unknown
commands fail explicitly. Queries honor camera, time, limit, clip, and favorite
constraints. This is a small adapter, not a general HA emulator.

`dev/ha-elements.mjs` supplies the block-level `ha-card` shell and substitutes
`ha-camera-stream` and `ha-hls-player`.
The substitutes use native video and development-only hls.js. Real decoding,
playback, pause and seek events reach the card's unchanged production
controllers. HLS playlists use the normal Frigate proxy URL shapes; recording
gaps are omitted from media time as in Frigate. The same four-second synthetic
transport segment is repeated with discontinuity markers to provide small,
seekable hour-long recordings. The images repeat; media time does not.

The preview does not validate HA component internals, authentication/security,
WebRTC/ICE, microphone talkback, real codecs, or OS-specific native fullscreen.
Those need separate integration/device testing. No connection to a live system
is attempted. There are no real people or customer recordings in the fixtures.

`window.preview` exposes `{card, mock, now}` for debugging. Use the mock API and
UI in tests; avoid patching production controller methods to make a test pass.

## Verification

```sh
npm run verify                 # existing bundle, syntax and Node regressions
npx playwright install chromium # once per machine / Playwright upgrade
npm run test:browser           # starts a server automatically when needed
```

Browser tests exercise rendering, local-only requests, real clip/HLS playback,
native seeking, hourly recording playback, favorite/review persistence, filtering,
Multiview, subscription refresh, empty/offline/slow scenarios, mobile layout,
and media range responses. Failure screenshots and traces land in
`test-results/`; inspect a trace with `npx playwright show-trace <trace.zip>`.
The local preview may stay running while tests run. CI always starts a fresh
server and installs the matching Chromium version.

## Media maintenance

Assets under `dev/media/` are checked in (about 550KB total), so no encoder or
external download is required to use the preview. All were generated specifically
for this repository. To regenerate them with an FFmpeg build including libx264
and drawtext:

```sh
FFMPEG=/path/to/ffmpeg node dev/generate-media.mjs
```

Set `FFMPEG_FONT` to a local TrueType font if needed. The generator uses Monaco
on macOS and DejaVu Sans Mono on Linux by default. Development dependencies and
fixtures are never included in the HACS bundle; the runtime remains dependency-free.
