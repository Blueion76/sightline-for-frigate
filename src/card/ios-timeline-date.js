import { actionMethods } from './actions.js';
import { responsiveUxMethods } from './responsive-ux.js';
import { timelineInteractionMethods } from './timeline-interaction.js';

function parseDateValue(value) {
  const m=String(value||'').match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if(!m) return null;
  const y=Number(m[1]),mo=Number(m[2]),da=Number(m[3]);
  if(!Number.isFinite(y)||!Number.isFinite(mo)||!Number.isFinite(da)) return null;
  const date=new Date(y,mo-1,da,12,0,0,0);
  if(date.getFullYear()!==y||date.getMonth()!==mo-1||date.getDate()!==da) return null;
  return {y,mo,da,date,value:`${String(y).padStart(4,'0')}-${String(mo).padStart(2,'0')}-${String(da).padStart(2,'0')}`};
}

function localDateValue(ts) {
  const d=new Date(Number(ts||Date.now()/1000)*1000);
  const y=d.getFullYear();
  const m=String(d.getMonth()+1).padStart(2,'0');
  const day=String(d.getDate()).padStart(2,'0');
  return `${y}-${m}-${day}`;
}

function displayDate(ds, includeYear=false) {
  const parsed=parseDateValue(ds);
  if(!parsed) return '';
  const options={month:'short',day:'numeric'};
  if(includeYear) options.year='numeric';
  return parsed.date.toLocaleDateString([],options);
}

export const iosTimelineDateMethods = {
  _ensureTimelineNativeDateInput() {
    const input=responsiveUxMethods._ensureTimelineNativeDateInput.call(this);
    if(!input) return null;
    const host=input.parentElement;
    if(host){
      host.style.gap='6px';
      host.style.whiteSpace='nowrap';
      host.style.overflow='visible';
      let label=host.querySelector?.('.timeline-date-label');
      if(!label){
        label=document.createElement('span');
        label.className='timeline-date-label';
        label.setAttribute('aria-hidden','true');
        label.style.cssText='display:none;pointer-events:none;white-space:nowrap;font:650 11px/1 -apple-system,BlinkMacSystemFont,"SF Pro Text",system-ui,sans-serif;font-variant-numeric:tabular-nums;letter-spacing:-.01em;';
        host.insertBefore(label,input);
      }
    }
    this._updateTimelineDateLabel();
    return input;
  },

  _prepareTimelineNativeDateInput(input) {
    const result=responsiveUxMethods._prepareTimelineNativeDateInput.call(this,input);
    this._updateTimelineDateLabel();
    return result;
  },

  _updateTimelineDateLabel(value=null) {
    const root=this.shadowRoot;
    if(!root?.querySelector) return;
    const host=root.querySelector('#cal-btn');
    const input=root.querySelector('#timeline-native-date');
    if(!host||!input) return;

    let ds='';
    if(typeof value==='string' && parseDateValue(value)) ds=parseDateValue(value).value;
    else if(Number.isFinite(Number(value))) ds=localDateValue(Number(value));
    else if(Number.isFinite(Number(this._timelineFocusTs))) ds=localDateValue(Number(this._timelineFocusTs));
    else if(input.value && parseDateValue(input.value)) ds=parseDateValue(input.value).value;
    else ds=localDateValue(Date.now()/1000);

    const today=localDateValue(Date.now()/1000);
    const isToday=ds===today;
    const parsed=parseDateValue(ds);
    const currentYear=new Date().getFullYear();
    const shortLabel=isToday ? '' : displayDate(ds,parsed?.y!==currentYear);
    const fullLabel=isToday ? 'Today' : displayDate(ds,true);
    const label=host.querySelector?.('.timeline-date-label');
    if(label){
      label.textContent=shortLabel;
      label.style.display=isToday?'none':'inline-block';
    }
    host.classList?.toggle?.('has-date-label',!isToday);
    host.title=`Calendar · ${fullLabel}`;
    input.setAttribute('aria-label',`Timeline date, ${fullLabel}`);
  },

  async _pickDay(ds) {
    const parsed=parseDateValue(ds);
    if(!parsed) return actionMethods._pickDay.call(this,ds);

    // Keep the proven v1.1.2/v1.1.3 navigation behavior: preserve zoom, put
    // the selected day's visible range at local midnight, leave LIVE-follow,
    // and invalidate any old scrub/playback clocks first.
    actionMethods._pickDay.call(this,parsed.value);
    this._updateTimelineDateLabel(parsed.value);

    // Date selection should be a complete navigation action, not half of one.
    // Previously it only translated the viewport, so the user had to tap the
    // timeline a second time before continuous recording playback started.
    // Seek the same fixed playhead timestamp that is already inside the newly
    // translated midnight-first window. This preserves the exact current zoom
    // and the midnight viewport edge while starting playback immediately.
    const target=Number(this._timelineFocusTs);
    if(Number.isFinite(target) && typeof this._seekTimelineTarget==='function') {
      this._scrubTarget=target;
      try { await this._seekTimelineTarget(target); }
      catch(err) { console.warn('[Sightline] timeline calendar seek failed',err); }
    }
  },

  _goNow() {
    const result=actionMethods._goNow.call(this);
    this._updateTimelineDateLabel();
    return result;
  },

  _updateTimelinePlaybackTime(ts) {
    const result=timelineInteractionMethods._updateTimelinePlaybackTime.call(this,ts);
    this._updateTimelineDateLabel(ts);
    return result;
  }
};
