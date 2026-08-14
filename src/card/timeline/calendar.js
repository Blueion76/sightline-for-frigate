/**
 * Native timeline date picker and selected-date presentation.
 *
 * iOS/Safari requires the user's gesture to land directly on a real date input,
 * while Chromium is most reliable when showPicker() is called from the trusted
 * desktop click. The same input supports both paths without synthetic hand-off.
 */
import { formatLocalDateInput, localDateValue, parseLocalDateInput } from '../../utils/date.js';

function timelineDateFocus(card) {
  if(Number.isFinite(Number(card._timelineFocusTs))) return Number(card._timelineFocusTs);
  if(Number.isFinite(Number(card._winStart))&&Number.isFinite(Number(card._winEnd))) {
    return (Number(card._winStart)+Number(card._winEnd))/2;
  }
  return Date.now()/1000;
}

function openNativeDatePicker(input) {
  if(!input || typeof input.showPicker!=='function') return false;
  try {
    input.showPicker();
    return true;
  } catch(_) {
    return false;
  }
}

export const timelineCalendarMethods = {
  _prepareTimelineNativeDateInput(input) {
    if(!input) return null;
    const focus=timelineDateFocus(this);
    input.value=localDateValue(focus);
    input.max=localDateValue();
    this._updateTimelineDateLabel(focus);
    return input;
  },

  _ensureTimelineNativeDateInput() {
    const root=this.shadowRoot;
    if(!root?.querySelector) return null;
    const existing=root.querySelector('#timeline-native-date');
    if(existing) return existing;

    const oldButton=root.querySelector('#cal-btn');
    if(!oldButton?.parentNode) return null;

    const host=document.createElement('span');
    host.id='cal-btn';
    host.className=oldButton.className||'tool';
    host.title=oldButton.title||'Calendar';
    host.style.position='relative';
    host.style.gap='6px';
    host.style.whiteSpace='nowrap';
    host.style.overflow='visible';
    host.innerHTML=oldButton.innerHTML;

    const label=document.createElement('span');
    label.className='timeline-date-label';
    label.setAttribute('aria-hidden','true');
    label.style.cssText='display:none;pointer-events:none;white-space:nowrap;font:650 11px/1 -apple-system,BlinkMacSystemFont,"SF Pro Text",system-ui,sans-serif;font-variant-numeric:tabular-nums;letter-spacing:-.01em;';

    const input=document.createElement('input');
    input.id='timeline-native-date';
    input.type='date';
    input.setAttribute('aria-label','Timeline date');
    input.style.cssText='position:absolute;inset:0;width:100%;height:100%;min-width:100%;min-height:100%;opacity:0;pointer-events:auto;cursor:pointer;border:0;padding:0;margin:0;z-index:5;background:transparent;color:transparent;font-size:16px;';

    let lastPointerType='';
    const prepare=()=>this._prepareTimelineNativeDateInput(input);
    input.addEventListener('pointerdown',(event)=>{
      lastPointerType=String(event.pointerType||'');
      prepare();
    },{capture:true,passive:true});
    input.addEventListener('touchstart',()=>{
      // Preserve the iOS/WebKit direct-native activation path. Calling
      // showPicker() is unnecessary there and can be less reliable than letting
      // the trusted touch land on the input itself.
      lastPointerType='touch';
      prepare();
    },{capture:true,passive:true});
    input.addEventListener('focus',prepare,{passive:true});
    input.addEventListener('click',(event)=>{
      event.stopPropagation();
      // Desktop Chromium focuses a date field when its transparent body is
      // clicked but does not consistently open the calendar popup. Because
      // this listener runs on the real trusted click, showPicker() satisfies
      // Chromium's transient-user-activation requirement.
      if(lastPointerType!=='touch') openNativeDatePicker(input);
      lastPointerType='';
    });
    input.addEventListener('keydown',(event)=>{
      if(event.key!=='Enter' && event.key!==' ') return;
      if(openNativeDatePicker(input)) event.preventDefault();
    });
    input.addEventListener('change',(event)=>{
      event.stopPropagation();
      if(input.value) this._pickDay(input.value);
      try { input.blur(); } catch(_) {}
    });

    host.appendChild(label);
    host.appendChild(input);
    oldButton.parentNode.replaceChild(host,oldButton);
    this._prepareTimelineNativeDateInput(input);
    return input;
  },

  /** Update the compact historical-date badge beside the calendar icon. */
  _updateTimelineDateLabel(value=null) {
    const host=this.shadowRoot?.querySelector?.('#cal-btn');
    const input=this.shadowRoot?.querySelector?.('#timeline-native-date');
    if(!host||!input) return;

    const explicit=typeof value==='string'?parseLocalDateInput(value)?.value:null;
    const timestamp=Number(value);
    const selected=explicit
      || (Number.isFinite(timestamp)?localDateValue(timestamp):null)
      || (Number.isFinite(Number(this._timelineFocusTs))?localDateValue(this._timelineFocusTs):null)
      || parseLocalDateInput(input.value)?.value
      || localDateValue();
    const isToday=selected===localDateValue();
    const parsed=parseLocalDateInput(selected);
    const shortLabel=isToday?'':formatLocalDateInput(selected,parsed?.year!==new Date().getFullYear());
    const fullLabel=isToday?'Today':formatLocalDateInput(selected,true);
    const label=host.querySelector?.('.timeline-date-label');

    if(label) {
      label.textContent=shortLabel;
      label.style.display=isToday?'none':'inline-block';
    }
    host.classList?.toggle?.('has-date-label',!isToday);
    host.title=`Calendar · ${fullLabel}`;
    input.setAttribute('aria-label',`Timeline date, ${fullLabel}`);
  },

  _toggleCal() {
    const legacyPanel=this.shadowRoot?.querySelector?.('#cal-panel');
    if(legacyPanel) legacyPanel.style.display='none';
    const input=this._ensureTimelineNativeDateInput();
    if(!input) return;
    this._prepareTimelineNativeDateInput(input);

    // Keyboard/delegated activation reaches this path directly. Prefer
    // showPicker() and retain click() only for engines that do not implement it.
    if(openNativeDatePicker(input)) return;
    try { input.click(); } catch(_) {}
  },
};
