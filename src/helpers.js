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

export function camDisplayName(c) { return c.name || (c.entity||'').replace(/^camera\./,'').replace(/_/g,' '); }
