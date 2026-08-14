/**
 * Public method-group barrel for recordingPlaybackMethods.
 *
 * Keeping this entry point stable avoids coupling callers to the internal
 * feature layout while allowing each concern to live in a focused module.
 */
import { recordingTimeMethods } from './playback/recording-time.js';
import { recordingShellMethods } from './playback/recording-shell.js';
import { recordingSourceMethods } from './playback/recording-source.js';
import { recordingPlayerMethods } from './playback/recording-player.js';

export const recordingPlaybackMethods = Object.assign(
  {},
  recordingTimeMethods,
  recordingShellMethods,
  recordingSourceMethods,
  recordingPlayerMethods,
);
