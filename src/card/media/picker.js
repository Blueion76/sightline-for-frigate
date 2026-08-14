/**
 * Native date/time picker ownership and delegated form-change handling.
 *
 * Methods are composed onto SightlineCard.prototype; method names are kept
 * stable so existing card behavior and tests remain unchanged.
 */
export const mediaPickerMethods = {
_mediaTemporalInput(target) {
    const el=target?.nodeType===1 ? target : null;
    if(!el?.matches) return null;
    if(el.matches('#media-filter-date,#media-filter-time-start,#media-filter-time-end')) return el;
    // A tap on the calendar glyph / From / To label still opens the nested
    // native control. Treat the entire wrapper as the input hit target.
    const control=el.closest?.('.media-filter-date-control,.media-filter-time-control');
    if(!control) return null;
    const input=control.querySelector?.('input[type="date"],input[type="time"]');
    return input||null;
  },

_beginMediaPicker(input) {
    if(!input) return;
    clearTimeout(this._mediaPickerReleaseTimer);
    this._mediaPickerReleaseTimer=null;
    this._mediaPickerActive=true;
    this._mediaPickerActiveId=input.id||'';
  },

_scheduleMediaPickerRelease(delay=260) {
    clearTimeout(this._mediaPickerReleaseTimer);
    this._mediaPickerReleaseTimer=setTimeout(()=>{
      this._mediaPickerReleaseTimer=null;
      this._mediaPickerActive=false;
      this._mediaPickerActiveId='';
      // Clips/Recordings use _loadWindow(), which can refresh the result grid
      // while a native iOS picker is open. Freeze the *entire* gallery DOM
      // during that ownership window and flush it only after dismissal. This
      // is intentionally stronger than merely preserving the input node: iOS
      // can dismiss its popover when an ancestor's layout/content changes.
      if(this._mediaPickerPendingGalleryRender) {
        this._mediaPickerPendingGalleryRender=false;
        this._mediaPickerPendingFilterRender=false;
        this._renderGallery(true);
      } else if(this._mediaPickerPendingFilterRender) {
        this._mediaPickerPendingFilterRender=false;
        this._renderMediaFilter(true);
      }
      this._syncStatus();
      if(this._config?.theme==='auto') this._applyCardStyle();
      if(this._cardWidth>=560) this._syncColHeight();
    }, Math.max(0,Number(delay)||0));
  },

_change(e) {
    const t=e?.target;
    if(!t) return;
    let key=null, value='';
    if(t.id==='media-filter-date'){ key='date'; value=t.value||'all'; }
    else if(t.id==='media-filter-time-start'){ key='timeStart'; value=t.value||''; }
    else if(t.id==='media-filter-time-end'){ key='timeEnd'; value=t.value||''; }
    if(!key) return;

    // Never blur a native temporal input from its own change handler. iOS time
    // wheels can emit `change` while the system picker is still onscreen; the
    // old blur + 300ms forced repaint was therefore closing the picker itself.
    this._beginMediaPicker(t);
    clearTimeout(this._mediaPickerApplyTimer);
    this._mediaPickerApplyTimer=null;

    // Apply/query the new timestamp immediately, but keep the visible gallery
    // frozen while iOS owns the native picker. _loadWindow/_loadReviews may
    // refresh their caches; _renderGallery/_renderMediaFilter will queue paint
    // until the next page interaction after the picker is dismissed.
    Promise.resolve(this._setMediaTemporal(key,value)).catch(err=>
      console.warn('[Frigate] temporal media filter update failed',err)
    );

    // Desktop date/time popovers commit on close, so a short release is safe.
    // iOS/WKWebView must remain sticky: its time wheel may keep firing change
    // events before the user taps Done. The next pointer/touch outside the
    // control releases the lock and paints the already-loaded filtered results.
    if(!this._isIOSRecordingPlatform()) this._scheduleMediaPickerRelease(260);
  }
};
