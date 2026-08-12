// Preserve getters/setters as well as ordinary methods when composing the card.
export function applyMethodGroups(target, ...groups) {
  for (const group of groups) {
    const descriptors = Object.getOwnPropertyDescriptors(group);
    delete descriptors.__proto__;
    Object.defineProperties(target, descriptors);
  }
}
