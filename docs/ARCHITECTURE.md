# Architecture

Home Assistant loads one production file: `dist/sightline-for-frigate.js`. Development happens in `src/`.

## Source layout

- `src/constants.js` — version, Sightline custom-element tag, icons, colors, and fixed maps.
- `src/helpers.js` — stateless shared helpers.
- `src/styles.js` — the complete card stylesheet/template string.
- `src/card/core.js` — configuration, Home Assistant binding, and lifecycle.
- `src/card/live.js` — live engine, go2rtc/WebRTC, fullscreen recovery, and camera switching.
- `src/card/talk.js` — two-way audio and microphone lifecycle.
- `src/card/data.js` — Frigate/HA API access, metadata, event/review/recording loading.
- `src/card/render-shell.js` — primary DOM shell construction.
- `src/card/layout.js` — aspect ratio, stream height, resize observers, and responsive workspace.
- `src/card/browser.js` — Clips/Recordings/Reviews browser and media filters.
- `src/card/event-playback.js` — clip/event/snapshot playback.
- `src/card/recording-playback.js` — stable continuous recording playback and seeking.
- `src/card/actions.js` — favorites, review actions, calendar, and small UI actions.
- `src/card/timeline-interaction.js` — timeline dragging, zooming, seeking, and live synchronization.
- `src/card/timeline-render.js` — timeline data shaping, clusters, and DOM reconciliation.
- `src/card/lists.js` — event/review/recording list rendering.
- `src/card/download.js` — timeline trim handles and recording-range export.
- `src/card/SightlineCard.js` — the composed custom-element class.
- `src/editor/` — Home Assistant visual card editor.
- `src/index.js` — `sightline-card` and editor registration.

The card class is composed from method groups with property descriptors. This preserves native getters/setters while allowing the source to remain split by responsibility.

## Build

The project intentionally has no runtime or build dependencies. `scripts/build.mjs` flattens the ES modules in dependency order into the single HACS artifact.

```bash
npm ci
npm run build
npm run verify
```

`dist/sightline-for-frigate.js` is committed so HACS can install directly from the repository or a release tag.

## Versioning

Keep these values in sync:

- `package.json` → `version`
- `src/constants.js` → `VERSION`

The build fails if they differ.

## Public identifiers

- Project/repository: `sightline-for-frigate`
- HACS display name: `Sightline for Frigate`
- Lovelace type: `custom:sightline-card`
- Custom element: `sightline-card`
- Editor element: `sightline-card-editor`
- Distribution bundle: `dist/sightline-for-frigate.js` (matches the HACS repository name)
