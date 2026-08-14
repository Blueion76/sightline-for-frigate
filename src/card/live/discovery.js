/**
 * Camera discovery and Home Assistant camera-entity adaptation.
 *
 * Methods are composed onto SightlineCard.prototype; method names are kept
 * stable so existing card behavior and tests remain unchanged.
 */
import { mkCamState } from '../../helpers.js';

export const liveDiscoveryMethods = {
async _discoverAll() { await Promise.all(this._config.cameras.map(c => this._discoverOne(c.entity))); },

async _discoverOne(entity) {
    const cache = this._camCache[entity] || mkCamState();
    if (cache.discovered) return;
    const ent = this._hass.states[entity]; if (!ent) return;
    cache.clientId = ent.attributes?.client_id || ent.attributes?.mqtt_client_id || 'frigate';
    cache.cam = ent.attributes?.camera_name || entity.replace(/^camera\./,'');
    cache.discovered = true;
    this._camCache[entity] = cache;
  },

_streamStateObj(entity) {
    const raw = this._hass.states[entity]; if (!raw) return null;
    const attrs = { ...raw.attributes };
    if (this._config.stream_type === 'hls') delete attrs.frontend_stream_type;
    else attrs.frontend_stream_type = 'web_rtc';
    return { ...raw, attributes: attrs };
  }
};
