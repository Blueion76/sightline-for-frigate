/**
 * Multiview behavior composed from focused playback, timeline, and media modules.
 */
import { mergeMethodGroups } from '../utils/apply-method-groups.js';
import { multiviewCoreMethods } from './multiview/core.js';
import { multiviewPlayerMethods } from './multiview/player.js';
import { multiviewControllerMethods } from './multiview/controller.js';
import { multiviewTimelineMethods } from './multiview/timeline-ui.js';
import { multiviewMediaMethods } from './multiview/media-browser.js';

export const multiviewMethods = mergeMethodGroups(
  multiviewCoreMethods,
  multiviewPlayerMethods,
  multiviewControllerMethods,
  multiviewTimelineMethods,
  multiviewMediaMethods,
);
