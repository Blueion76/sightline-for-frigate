/**
 * Ordered source manifest for the dependency-free HACS bundle.
 *
 * The build flattens ES modules into one browser script, so dependency order is
 * explicit here: shared values first, focused implementation modules before
 * their public barrels, composition roots near the end, and registration last.
 */
export const BUNDLE_MODULES = [
  // Shared constants, helpers and styles.
  'src/constants.js',
  'src/helpers.js',
  'src/styles.js',
  'src/styles/shell.js',
  'src/utils/apply-method-groups.js',
  'src/utils/date.js',

  // Card state and core Home Assistant lifecycle.
  'src/card/state.js',
  'src/card/core.js',

  // Live camera discovery, transport and presentation.
  'src/card/live/discovery.js',
  'src/card/live/engine.js',
  'src/card/live/webrtc.js',
  'src/card/live/fullscreen.js',
  'src/card/live/view.js',
  'src/card/live.js',

  // Two-way audio / microphone lifecycle.
  'src/card/talk/controls.js',
  'src/card/talk/microphone.js',
  'src/card/talk/session.js',
  'src/card/talk.js',

  // Frigate metadata and data loading.
  'src/card/data/metadata.js',
  'src/card/data/loading.js',
  'src/card/data.js',

  // Stable card shell and responsive layout.
  'src/card/render-shell.js',
  'src/card/layout.js',

  // Media browser.
  'src/card/media/picker.js',
  'src/card/media/navigation.js',
  'src/card/media/gallery.js',
  'src/card/media/filters.js',
  'src/card/browser.js',

  // Event and continuous-recording playback.
  'src/card/playback/event-controller.js',
  'src/card/playback/media-source.js',
  'src/card/playback/time.js',
  'src/card/event-playback.js',
  'src/card/playback/recording-time.js',
  'src/card/playback/recording-shell.js',
  'src/card/playback/recording-source.js',
  'src/card/playback/recording-player.js',
  'src/card/recording-playback.js',

  // Timeline model, rendering, interaction and synchronization.
  'src/card/actions.js',
  'src/card/timeline/filters.js',
  'src/card/timeline/calendar.js',
  'src/card/timeline/interaction.js',
  'src/card/timeline/runtime.js',
  'src/card/timeline/zoom.js',
  'src/card/timeline/playback-sync.js',
  'src/card/timeline-interaction.js',
  'src/card/timeline/model.js',
  'src/card/timeline/live-follow.js',
  'src/card/timeline/render.js',
  'src/card/timeline-render.js',
  'src/card/lists.js',
  'src/card/download.js',

  // Multiview behavior and high-level responsive adaptations.
  'src/card/multiview/core.js',
  'src/card/multiview/player.js',
  'src/card/multiview/controller.js',
  'src/card/multiview/timeline-ui.js',
  'src/card/multiview/media-browser.js',
  'src/card/multiview.js',
  'src/card/responsive-ux.js',
  'src/card/ui/playback-layout.js',

  // Card composition root.
  'src/card/SightlineCard.js',

  // Visual editor.
  'src/editor/registry.js',
  'src/editor/render.js',
  'src/editor/config.js',
  'src/editor/methods.js',
  'src/editor/SightlineCardEditor.js',

  // Custom-element registration.
  'src/index.js',
];
