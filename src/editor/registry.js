/**
 * Home Assistant / Frigate entity discovery for the visual editor.
 *
 * Entity-registry ownership is authoritative when available; configured camera
 * entities are retained as a fallback so temporary HA availability changes do
 * not make an existing card impossible to edit.
 */
export const editorRegistryMethods = {
set hass(h) {
    this._hass = h;
    // Registry ownership is the authoritative way to decide whether a camera
    // belongs to the Frigate HA integration. State attributes are only a
    // backwards-compatible fallback while the registry request is pending or
    // unavailable on an older HA frontend.
    this._ensureFrigateEntityRegistry();

    // Only re-render when the camera entity list actually changes — prevents
    // a normal HA state update from closing an open editor control.
    const dark = h?.themes?.darkMode ?? window.matchMedia?.('(prefers-color-scheme: dark)')?.matches ?? false;
    const key = `${this._frigateEntities().join(',')}|registry:${this._frigateRegistryLoaded?'1':'0'}|dark:${dark}`;
    if (key !== this._lastEntityKey) { this._lastEntityKey = key; this._render(); }
  },

async _ensureFrigateEntityRegistry() {
    const hass=this._hass;
    if(!hass?.callWS) return;
    const connection=hass.connection||hass;
    const now=Date.now();
    // Refresh periodically so adding/removing a Frigate camera while the card
    // editor is open is picked up, without querying HA on every state update.
    if(this._frigateRegistryLoading) return;
    if(this._frigateRegistryConnection===connection && this._frigateRegistryLoaded && (now-(this._frigateRegistryFetchedAt||0))<30000) return;

    this._frigateRegistryLoading=true;
    this._frigateRegistryConnection=connection;
    try {
      const entries=await hass.callWS({type:'config/entity_registry/list'});
      if(this._hass!==hass) return;
      this._frigateRegistryEntities=(Array.isArray(entries)?entries:[])
        .filter(entry =>
          String(entry?.entity_id||'').startsWith('camera.') &&
          String(entry?.platform||'').toLowerCase()==='frigate' &&
          !entry?.disabled_by
        )
        .map(entry => String(entry.entity_id))
        .sort((a,b)=>a.localeCompare(b));
      this._frigateRegistryLoaded=true;
      this._frigateRegistryFetchedAt=Date.now();
    } catch(err) {
      // Older/restricted HA sessions may reject registry access. In that case
      // keep the editor usable with the Frigate-specific state fallback below.
      this._frigateRegistryLoaded=false;
      this._frigateRegistryEntities=[];
      this._frigateRegistryFetchedAt=Date.now();
    } finally {
      this._frigateRegistryLoading=false;
      if(this._hass===hass){
        const dark=hass?.themes?.darkMode ?? window.matchMedia?.('(prefers-color-scheme: dark)')?.matches ?? false;
        const key=`${this._frigateEntities().join(',')}|registry:${this._frigateRegistryLoaded?'1':'0'}|dark:${dark}`;
        if(key!==this._lastEntityKey){this._lastEntityKey=key;this._render();}
      }
    }
  },

_configuredEntityIds() {
    const cfg=this._config||{};
    const cams=Array.isArray(cfg.cameras)?cfg.cameras:[];
    const ids=cams.map(c=>typeof c==='string'?c:(c?.entity||c?.camera_entity||c?.camera||''));
    if(cfg.camera_entity||cfg.entity||cfg.camera) ids.push(cfg.camera_entity||cfg.entity||cfg.camera);
    return [...new Set(ids.filter(id=>String(id).startsWith('camera.')).map(String))];
  },

_frigateEntities() {
    if (!this._hass) return this._configuredEntityIds();

    let entities=[];
    if(this._frigateRegistryLoaded){
      // Exact integration filter: only camera entities owned by the Frigate
      // entity platform. This includes entities such as Birdseye that do not
      // expose the normal camera_name/client_id state attributes.
      entities=[...(this._frigateRegistryEntities||[])];
    } else {
      // Fallback for HA versions/sessions where registry access is unavailable.
      // Frigate's camera platform uses device_class="camera" specifically so
      // selectors can distinguish these from ordinary camera entities.
      entities=Object.keys(this._hass.states)
        .filter(e=>e.startsWith('camera.'))
        .filter(e=>{
          const a=this._hass.states[e]?.attributes||{};
          return a.client_id || a.mqtt_client_id || a.camera_name || a.device_class==='camera';
        });
    }

    // Never make an already-saved selection vanish from the editor merely
    // because it is temporarily unavailable/disabled or registry data changed.
    // New selections remain strictly Frigate-filtered.
    entities.push(...this._configuredEntityIds());
    return [...new Set(entities)].sort((a,b)=>a.localeCompare(b));
  },

_entityOptionLabel(entityId) {
    const state=this._hass?.states?.[entityId];
    let name='';
    try {
      if(state && typeof this._hass?.formatEntityName==='function') name=this._hass.formatEntityName(state);
    } catch(_err) {}
    name=name || state?.attributes?.friendly_name || entityId;
    return name===entityId ? entityId : `${name} — ${entityId}`;
  }
};
