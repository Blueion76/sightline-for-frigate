/**
 * Public method-group barrel for browserMethods.
 *
 * Keeping this entry point stable avoids coupling callers to the internal
 * feature layout while allowing each concern to live in a focused module.
 */
import { mediaPickerMethods } from './media/picker.js';
import { mediaNavigationMethods } from './media/navigation.js';
import { mediaGalleryMethods } from './media/gallery.js';
import { mediaFilterMethods } from './media/filters.js';

export const browserMethods = Object.assign(
  {},
  mediaPickerMethods,
  mediaNavigationMethods,
  mediaGalleryMethods,
  mediaFilterMethods,
);
