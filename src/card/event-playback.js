/**
 * Public method-group barrel for eventPlaybackMethods.
 *
 * Keeping this entry point stable avoids coupling callers to the internal
 * feature layout while allowing each concern to live in a focused module.
 */
import { eventPlaybackControllerMethods } from './playback/event-controller.js';
import { mediaSourceMethods } from './playback/media-source.js';
import { playbackTimeMethods } from './playback/time.js';

export const eventPlaybackMethods = Object.assign(
  {},
  eventPlaybackControllerMethods,
  mediaSourceMethods,
  playbackTimeMethods,
);
