/**
 * Public method-group barrel for liveMethods.
 *
 * Keeping this entry point stable avoids coupling callers to the internal
 * feature layout while allowing each concern to live in a focused module.
 */
import { liveDiscoveryMethods } from './live/discovery.js';
import { liveEngineMethods } from './live/engine.js';
import { liveWebRtcMethods } from './live/webrtc.js';
import { liveFullscreenMethods } from './live/fullscreen.js';
import { liveViewMethods } from './live/view.js';

export const liveMethods = Object.assign(
  {},
  liveDiscoveryMethods,
  liveEngineMethods,
  liveWebRtcMethods,
  liveFullscreenMethods,
  liveViewMethods,
);
