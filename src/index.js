/** Register Sightline's card/editor custom elements with Home Assistant. */
import { VERSION, CARD_TAG } from './constants.js';
import { SightlineCard } from './card/SightlineCard.js';
import { SightlineCardEditor } from './editor/SightlineCardEditor.js';

if (!customElements.get(CARD_TAG)) {
  customElements.define(CARD_TAG, SightlineCard);
}
if (!customElements.get(CARD_TAG + '-editor')) {
  customElements.define(CARD_TAG + '-editor', SightlineCardEditor);
}

window.customCards = window.customCards || [];
if (!window.customCards.find((card) => card.type === CARD_TAG)) {
  window.customCards.push({
    type: CARD_TAG,
    name: 'Sightline for Frigate',
    description: `Multi-camera Frigate NVR card — v${VERSION}`,
    preview: true,
  });
}

console.info(
  `%c SIGHTLINE-FOR-FRIGATE %c v${VERSION} `,
  'color:#fff;background:#1d4ed8;padding:2px 4px;border-radius:3px 0 0 3px;font-weight:bold',
  'color:#1d4ed8;background:#dbeafe;padding:2px 4px;border-radius:0 3px 3px 0'
);
