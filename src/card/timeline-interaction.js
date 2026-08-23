/**
 * Public method-group barrel for timelineInteractionMethods.
 *
 * Keeping this entry point stable avoids coupling callers to the internal
 * feature layout while allowing each concern to live in a focused module.
 */
import { mergeMethodGroups } from '../utils/apply-method-groups.js';
import { timelineFilterMethods } from './timeline/filters.js';
import { timelineCalendarMethods } from './timeline/calendar.js';
import { timelineGestureMethods } from './timeline/interaction.js';
import { timelineRuntimeMethods } from './timeline/runtime.js';
import { timelineZoomMethods } from './timeline/zoom.js';
import { timelinePlaybackSyncMethods } from './timeline/playback-sync.js';

export const timelineInteractionMethods = mergeMethodGroups(
  timelineFilterMethods,
  timelineCalendarMethods,
  timelineGestureMethods,
  timelineRuntimeMethods,
  timelineZoomMethods,
  timelinePlaybackSyncMethods,
);
