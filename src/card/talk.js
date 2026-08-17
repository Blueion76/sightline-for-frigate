/**
 * Public method-group barrel for talkMethods.
 *
 * Keeping this entry point stable avoids coupling callers to the internal
 * feature layout while allowing each concern to live in a focused module.
 */
import { mergeMethodGroups } from '../utils/apply-method-groups.js';
import { talkControlMethods } from './talk/controls.js';
import { microphoneMethods } from './talk/microphone.js';
import { talkSessionMethods } from './talk/session.js';

export const talkMethods = mergeMethodGroups(
  talkControlMethods,
  microphoneMethods,
  talkSessionMethods,
);
