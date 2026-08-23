/**
 * Compose method-group property descriptors onto a prototype.
 *
 * Using descriptors preserves getters/setters and gives composition roots an
 * explicit, reviewable override order without side-effect prototype patches.
 */
export function applyMethodGroups(target, ...groups) {
  for (const group of groups) {
    const descriptors = Object.getOwnPropertyDescriptors(group);
    delete descriptors.__proto__;
    Object.defineProperties(target, descriptors);
  }
}

/**
 * Merge method groups into a new plain object, preserving accessors.
 *
 * Barrels must not use `Object.assign` for this: it copies accessor properties
 * *by value*, so a group declaring `set hass(h)` (with no getter) collapses into
 * a dead `hass: undefined` data property and the setter is silently lost.
 */
export function mergeMethodGroups(...groups) {
  const merged = {};
  applyMethodGroups(merged, ...groups);
  return merged;
}
