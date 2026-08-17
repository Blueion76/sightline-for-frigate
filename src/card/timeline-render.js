/**
 * Public method-group barrel for timelineRenderMethods.
 *
 * Keeping this entry point stable avoids coupling callers to the internal
 * feature layout while allowing each concern to live in a focused module.
 */
import { mergeMethodGroups } from '../utils/apply-method-groups.js';
import { timelineModelMethods } from './timeline/model.js';
import { timelineLiveMethods } from './timeline/live-follow.js';
import { timelineViewMethods } from './timeline/render.js';

export const timelineRenderMethods = mergeMethodGroups(
  timelineModelMethods,
  timelineLiveMethods,
  timelineViewMethods,
);
