/**
 * Sightline custom-card element and behavior composition root.
 *
 * Feature modules expose method groups instead of mutating the prototype at
 * import time. The order below is intentional: base capabilities are composed
 * first, then cross-camera/responsive UI adaptations, and finally playback
 * layout policy where an override is required.
 */
import { CARD_TAG } from '../constants.js';
import { applyMethodGroups } from '../utils/apply-method-groups.js';
import { actionMethods } from './actions.js';
import { browserMethods } from './browser.js';
import { coreMethods } from './core.js';
import { dataMethods } from './data.js';
import { downloadMethods } from './download.js';
import { eventPlaybackMethods } from './event-playback.js';
import { layoutMethods } from './layout.js';
import { listMethods } from './lists.js';
import { liveMethods } from './live.js';
import { multiviewMethods } from './multiview.js';
import { recordingPlaybackMethods } from './recording-playback.js';
import { renderShellMethods } from './render-shell.js';
import { responsiveUxMethods } from './responsive-ux.js';
import { initializeCardState } from './state.js';
import { talkMethods } from './talk.js';
import { timelineInteractionMethods } from './timeline-interaction.js';
import { timelineRenderMethods } from './timeline-render.js';
import { playbackLayoutMethods } from './ui/playback-layout.js';

export class SightlineCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    initializeCardState(this);
  }

  static getConfigElement() {
    return document.createElement(`${CARD_TAG}-editor`);
  }

  static getStubConfig() {
    return { camera_entity: 'camera.front_door' };
  }
}

applyMethodGroups(
  SightlineCard.prototype,
  coreMethods,
  liveMethods,
  talkMethods,
  dataMethods,
  renderShellMethods,
  layoutMethods,
  browserMethods,
  eventPlaybackMethods,
  recordingPlaybackMethods,
  actionMethods,
  timelineInteractionMethods,
  timelineRenderMethods,
  listMethods,
  downloadMethods,
  multiviewMethods,
  responsiveUxMethods,
  playbackLayoutMethods,
);
