import { CAM_COLORS } from '../constants.js';
import { cap, camDisplayName, timelineGlyph } from '../helpers.js';
import { browserMethods } from './browser.js';
import { downloadMethods } from './download.js';
import { multiRecordingCoreMethods } from './multi-recording-core.js';
import { multiRecordingPlayerMethods } from './multi-recording-player.js';
import { multiRecordingControllerMethods } from './multi-recording-controller.js';

const timelineUxMethods={
  _renderLegend() {
    const el=this._$('#legend');
    if(!el)return;
    if(this._config?.timeline?.show_legend===false){el.innerHTML='';el.style.display='none';return;}
    el.style.display='';
    const labels=this._labels();
    const current=this._filterLabel==='all'?'all':this._normalizeObjectLabel(this._filterLabel);
    let html=labels.map(raw=>{
      const label=this._normalizeObjectLabel(raw);
      if(!label)return '';
      const active=current!=='all'&&label===current;
      const display=this._filterDisplayName('label',label);
      const activeStyle=active?'background:var(--c-acc-bg)!important;border-color:var(--c-acc-bdr)!important;color:var(--c-acc-text)!important;':'';
      return `<button type="button" class="lg tl-detection-legend${active?' active':''}" data-legend-label="${label}" aria-pressed="${active?'true':'false'}" style="appearance:none;-webkit-appearance:none;font:inherit;cursor:pointer;touch-action:manipulation;${activeStyle}"><i>${timelineGlyph(label)}</i>${display}</button>`;
    }).join('');
    if(this._eventsMode==='all'){
      this._config.cameras.forEach((c,i)=>{
        const color=CAM_COLORS[i%CAM_COLORS.length].replace('.5','1').replace('rgba','rgb').replace(',1)',')');
        html+=`<span class="lg"><i style="background:${color}"></i>${cap(camDisplayName(c))} rec</span>`;
      });
    }else{
      html+=`<span class="lg"><i style="background:${CAM_COLORS[0].replace('.5','1').replace('rgba','rgb').replace(',1)',')')}"></i>Rec</span>`;
    }
    el.innerHTML=html;
  },

  _click(e) {
    const legend=e?.target?.closest?.('[data-legend-label]');
    if(legend){
      e.preventDefault?.();
      e.stopPropagation?.();
      const label=this._normalizeObjectLabel(legend.dataset.legendLabel);
      if(!label)return;
      this._filterLabel=this._filterLabel===label?'all':label;
      this._applyLiveFilterChange();
      return;
    }
    return browserMethods._click.call(this,e);
  },

  _syncDownloadRangePickerDOM(activeKind=null) {
    const result=downloadMethods._syncDownloadRangePickerDOM.call(this,activeKind);
    const root=this._$('#tl-track')?.querySelector('.tl-download-range');
    const range=this._downloadRange;
    if(!root||!range)return result;
    for(const [kind,ts] of [['end',range.end],['start',range.start]]){
      const label=root.querySelector(`[data-range-handle="${kind}"]`)?.querySelector('span');
      if(label)label.innerHTML=`<b>${kind==='end'?'END':'START'}</b>${this._timelineTime(ts)}`;
    }
    return result;
  },

  _enterDownloadRangePicker(anchorTs) {
    const result=downloadMethods._enterDownloadRangePicker.call(this,anchorTs);
    if(this._downloadRange)this._syncDownloadRangePickerDOM();
    return result;
  }
};

export const multiRecordingMethods=Object.assign({},multiRecordingCoreMethods,multiRecordingPlayerMethods,multiRecordingControllerMethods,timelineUxMethods);
