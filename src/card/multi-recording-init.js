import { SightlineCard } from './SightlineCard.js';
import { applyMethodGroups } from '../utils/apply-method-groups.js';
import { multiRecordingMethods } from './multi-recording.js';

applyMethodGroups(SightlineCard.prototype, multiRecordingMethods);
