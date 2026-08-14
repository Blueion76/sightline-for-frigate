/**
 * Home Assistant-aware time formatting and recording coverage helpers.
 *
 * Methods are composed onto SightlineCard.prototype; method names are kept
 * stable so existing card behavior and tests remain unchanged.
 */
export const playbackTimeMethods = {
_fmtDurS(s) { // format seconds → m:ss or h:mm:ss
    const h=Math.floor(s/3600), m=Math.floor((s%3600)/60), ss=s%60;
    return h>0 ? `${h}:${String(m).padStart(2,'0')}:${String(ss).padStart(2,'0')}` : `${m}:${String(ss).padStart(2,'0')}`;
  },

_hourStart(ts) {
    const d = new Date(ts * 1000);
    d.setMinutes(0, 0, 0);
    return Math.floor(d.getTime() / 1000);
  },

_hourEnd(ts) { return this._hourStart(ts) + 3600; },

_haUseAmPm() {
    // Mirror Home Assistant frontend `useAmPm()`: explicit 12/24 profile
    // settings win; language/system defer to the corresponding Intl locale.
    const locale=this._hass?.locale||{};
    const pref=String(locale.time_format||'language');
    if(pref==='12') return true;
    if(pref==='24') return false;
    const testLanguage=pref==='language' ? (locale.language||undefined) : undefined;
    try {
      return new Date('January 1, 2023 22:00:00').toLocaleString(testLanguage).includes('10');
    } catch(_) {
      try { return new Intl.DateTimeFormat(undefined,{hour:'numeric'}).formatToParts(new Date()).some(p=>p.type==='dayPeriod'); }
      catch(__) { return true; }
    }
  },

_haTimeZone() {
    // Home Assistant profile can follow the browser (`local`) or the HA server.
    const locale=this._hass?.locale||{};
    const server=this._hass?.config?.time_zone;
    if(locale.time_zone==='local') {
      try {
        const z=Intl.DateTimeFormat().resolvedOptions().timeZone;
        if(z && !/^[+-]\d{2}:?\d{2}$/.test(z)) return z;
      } catch(_) {}
    }
    return server || undefined;
  },

_formatHaTime(ts,withSeconds=false) {
    const d=new Date(Number(ts)*1000);
    if(!Number.isFinite(d.getTime())) return '';
    const locale=this._hass?.locale||{};
    const useAmPm=this._haUseAmPm();
    const options={
      hour:'numeric',
      minute:'2-digit',
      hourCycle:useAmPm?'h12':'h23'
    };
    if(withSeconds) options.second='2-digit';
    const timeZone=this._haTimeZone();
    if(timeZone) options.timeZone=timeZone;
    try { return new Intl.DateTimeFormat(locale.language||undefined,options).format(d); }
    catch(_) {
      const fallback={hour:'numeric',minute:'2-digit',hour12:useAmPm};
      if(withSeconds) fallback.second='2-digit';
      return d.toLocaleTimeString([],fallback);
    }
  },

_timeSec(ts) { return this._formatHaTime(ts,true); },

_timeMinute(ts) { return this._formatHaTime(ts,false); },

_recordingCovers(ts) {
    return (Array.isArray(this._recordings) ? this._recordings : []).find(r =>
      Number(r.start_time) <= ts && Number(r.end_time || ts + 1) >= ts
    ) || null;
  }
};
