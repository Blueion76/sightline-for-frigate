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
