/**
 * Public method-group barrel for dataMethods.
 *
 * Keeping this entry point stable avoids coupling callers to the internal
 * feature layout while allowing each concern to live in a focused module.
 */
import { metadataMethods } from './data/metadata.js';
import { dataLoadingMethods } from './data/loading.js';

export const dataMethods = Object.assign(
  {},
  metadataMethods,
  dataLoadingMethods,
);
