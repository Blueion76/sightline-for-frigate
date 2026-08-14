/**
 * Multiview behavior composed from focused playback, timeline, and media modules.
 */
import { multiviewCoreMethods } from './multiview/core.js';
import { multiviewPlayerMethods } from './multiview/player.js';
import { multiviewControllerMethods } from './multiview/controller.js';
import { multiviewTimelineMethods } from './multiview/timeline-ui.js';
import { multiviewMediaMethods } from './multiview/media-browser.js';

export const multiviewMethods = Object.assign(
  {},
  multiviewCoreMethods,
  multiviewPlayerMethods,
  multiviewControllerMethods,
  multiviewTimelineMethods,
  multiviewMediaMethods,
);
