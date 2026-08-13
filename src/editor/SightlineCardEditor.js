import { applyMethodGroups } from '../utils/apply-method-groups.js';
import { editorMethods } from './methods.js';

export class SightlineCardEditor extends HTMLElement {}
applyMethodGroups(SightlineCardEditor.prototype, editorMethods);

const baseRender = SightlineCardEditor.prototype._render;
const baseUpdate = SightlineCardEditor.prototype._u;

SightlineCardEditor.prototype._render = function(...args) {
  const result=baseRender.apply(this,args);
  if(!this.querySelector('#v11-startup-options')) {
    const defaultTab=['live','clips','recordings','reviews'].includes(this._config?.default_tab) ? this._config.default_tab : 'live';
    const thumbnailSize=Math.max(48,Math.min(140,Number(this._config?.timeline?.thumbnail_size ?? 84)));
    const wrap=document.createElement('div');
    wrap.id='v11-startup-options'; wrap.className='section';
    wrap.innerHTML=`<span class="field-label">Startup & timeline previews</span><div class="adv-grid"><label><span class="field-label">Default tab</span><select class="tf" id="default_tab"><option value="live" ${defaultTab==='live'?'selected':''}>Live</option><option value="clips" ${defaultTab==='clips'?'selected':''}>Clips</option><option value="recordings" ${defaultTab==='recordings'?'selected':''}>Recordings</option><option value="reviews" ${defaultTab==='reviews'?'selected':''}>Reviews</option></select></label><label class="chk-lbl"><input type="checkbox" id="autoplay_latest_clip" ${this._config?.autoplay_latest_clip?'checked':''}> Autoplay newest clip on startup</label><label><span class="field-label">Timeline thumbnail size (px)</span><input class="tf" id="timeline_thumbnail_size" type="number" min="48" max="140" value="${thumbnailSize}"></label></div>`;
    this.appendChild(wrap);
    for(const el of wrap.querySelectorAll('input,select')) el.addEventListener('change',()=>this._u());
  }
  return result;
};

SightlineCardEditor.prototype._u = function(...args) {
  const requested=this.querySelector('#default_tab')?.value;
  const autoplay=this.querySelector('#autoplay_latest_clip')?.checked === true;
  const thumb=Number(this.querySelector('#timeline_thumbnail_size')?.value);
  if(requested || Number.isFinite(thumb)) {
    const hidden=Array.isArray(this._config?.hidden_tabs)?this._config.hidden_tabs:[];
    this._config={...(this._config||{}),default_tab:requested && requested!=='live' && hidden.includes(requested)?'live':(requested||'live'),autoplay_latest_clip:autoplay,timeline:{...(this._config?.timeline||{}),...(Number.isFinite(thumb)?{thumbnail_size:Math.max(48,Math.min(140,Math.round(thumb)))}:{})}};
  }
  return baseUpdate.apply(this,args);
};
