/** Sightline visual editor custom element. */
import { applyMethodGroups } from '../utils/apply-method-groups.js';
import { editorMethods } from './methods.js';

export class SightlineCardEditor extends HTMLElement {}

applyMethodGroups(SightlineCardEditor.prototype,editorMethods);
