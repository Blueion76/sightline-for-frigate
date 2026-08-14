/** Public method-group barrel for the Sightline visual editor. */
import { editorRegistryMethods } from './registry.js';
import { editorRenderMethods } from './render.js';
import { editorConfigMethods } from './config.js';

export const editorMethods = Object.assign(
  {},
  editorRegistryMethods,
  editorRenderMethods,
  editorConfigMethods,
);
