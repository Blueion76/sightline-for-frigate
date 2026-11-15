/** Shared stateless helpers used by card, timeline and camera modules. */
import { LABEL_COLORS, PALETTE, TIMELINE_GLYPHS } from './constants.js';

// Shared stateless helpers used across card modules.
export function cap(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }

export function parseWs(r) { if (typeof r === 'string') { try { return JSON.parse(r); } catch(_) { return []; } } return r; }

export function labelColor(l) { if (!l) return '#ff9f0a'; if (LABEL_COLORS[l]) return LABEL_COLORS[l]; let h=0; for (const c of l) h=(h*31+c.charCodeAt(0))>>>0; return PALETTE[h%PALETTE.length]; }

export function timelineGlyph(label) {
  const key=String(label||'motion').toLowerCase();
  const icon=TIMELINE_GLYPHS[key] || TIMELINE_GLYPHS.motion;
  return `<ha-icon icon="${icon}" aria-hidden="true"></ha-icon>`;
}

export function mkCamState() { return { clientId:'frigate', cam:'', events:[], recordings:[], recordingsLoaded:false, recordingsRangeStart:null, recordingsRangeEnd:null, recordingsLoadedAt:0, reviews:[], kept:[], filterLabels:[], filterFaces:[], filterZones:[], filterLabelNames:{}, filterZoneNames:{}, filterMetaLoaded:false, filterMetaLoading:false, filterMetaLoadedAt:0, discovered:false }; }

export const MEDIA_TABS = ['live','clips','recordings','reviews'];
export const MEDIA_TAB_LABELS = { live:'Live', clips:'Clips', recordings:'Recordings', reviews:'Reviews' };

/**
 * Normalize `hidden_tabs` and `default_tab` together. Any tab, including Live,
 * may be hidden, but at least one tab always stays visible: if every tab is
 * hidden, Live is restored. The startup tab is the requested tab when it is
 * visible, otherwise the first visible tab in navigation order.
 */
export function normalizeMediaTabs(hiddenIn, defaultIn) {
  let hidden = Array.isArray(hiddenIn) ? [...new Set(hiddenIn.map(String).filter(t => MEDIA_TABS.includes(t)))] : [];
  if (hidden.length >= MEDIA_TABS.length) hidden = hidden.filter(t => t !== 'live');
  const visible = MEDIA_TABS.filter(t => !hidden.includes(t));
  const requested = String(defaultIn || '');
  const defaultTab = visible.includes(requested) ? requested : visible[0];
  return { hidden_tabs: hidden, default_tab: defaultTab };
}

export function camDisplayName(c) { return c.name || (c.entity||'').replace(/^camera\./,'').replace(/_/g,' '); }
