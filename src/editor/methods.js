/** Public method-group barrel for the Sightline visual editor. */
import { mergeMethodGroups } from '../utils/apply-method-groups.js';
import { editorRegistryMethods } from './registry.js';
import { editorRenderMethods } from './render.js';
import { editorConfigMethods } from './config.js';

export const editorMethods = mergeMethodGroups(
  editorRegistryMethods,
  editorRenderMethods,
  editorConfigMethods,
);
