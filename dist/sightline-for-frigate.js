// Sightline for Frigate v1.1.5
// Generated from src/ by scripts/build.mjs. Do not edit dist directly.

// ── src/constants.js ──
// Shared constants and icon definitions.
const VERSION = '1.1.5';

const CARD_TAG = 'sightline-card';

const DAY = 86400;

const DEFAULT_ROTATE_S = 30;

const ICONS = {
  live:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17 10.5V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3.5l4 4v-11l-4 4z"/></svg>',
  recordings:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/></svg>',
  clips:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8 12.5v-9l6 4.5-6 4.5z"/></svg>',
  snapshot:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 15.2A3.2 3.2 0 0 1 8.8 12 3.2 3.2 0 0 1 12 8.8 3.2 3.2 0 0 1 15.2 12 3.2 3.2 0 0 1 12 15.2M20 4h-3.17L15 2H9L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z"/></svg>',
  reviews:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L4 5v6c0 5 3.4 9.7 8 11 4.6-1.3 8-6 8-11V5l-8-3zm-1 14l-4-4 1.4-1.4L11 13.2l5.6-5.6L18 9l-7 7z"/></svg>',
  clock:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/></svg>',
  pin:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>',
  back:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>',
  download:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>',
  star:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>',
  starO:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>',
  calendar:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H5V8h14v13z"/></svg>',
  filter:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"/></svg>',
  expand:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>',
  chevron:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z"/></svg>',
  rotate:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8A5.87 5.87 0 0 1 6 12c0-3.31 2.69-6 6-6zm6.76 1.74L17.3 9.2A5.87 5.87 0 0 1 18 12c0 3.31-2.69 6-6 6v-3l-4 4 4 4v-3c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26z"/></svg>',
  volOff:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 12A4.5 4.5 0 0 0 14 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>',
  volOn: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>',
  grid:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 3v8h8V3H3zm6 6H5V5h4v4zm-6 4v8h8v-8H3zm6 6H5v-4h4v4zm4-16v8h8V3h-8zm6 6h-4V5h4v4zm-6 4v8h8v-8h-8zm6 6h-4v-4h4v4z"/></svg>',
  person:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>',
  mic:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/></svg>',
};

const LABEL_COLORS = { person:'#0a84ff', car:'#bf5af2', motion:'#ff9f0a', dog:'#66d4cf', cat:'#ff375f', bicycle:'#64d2ff', bird:'#ffd60a', package:'#ac8e68', face:'#5e5ce6', truck:'#30d158', bus:'#40c8e0' };

const PALETTE = ['#0a84ff','#bf5af2','#ff9f0a','#66d4cf','#ff375f','#64d2ff','#ffd60a','#ac8e68','#5e5ce6'];

const TIMELINE_GLYPHS = {
  // Use Home Assistant's native Material Design Icons renderer. This keeps the
  // detection lane visually consistent with the rest of HA and avoids shipping
  // a second hand-drawn icon family in the card bundle.
  person:'mdi:walk',
  face:'mdi:face-recognition',
  car:'mdi:car-side',
  vehicle:'mdi:car',
  truck:'mdi:truck',
  bus:'mdi:bus-side',
  bicycle:'mdi:bicycle',
  motorcycle:'mdi:motorbike',
  dog:'mdi:dog-side',
  cat:'mdi:cat',
  bird:'mdi:bird',
  horse:'mdi:horse',
  package:'mdi:package-variant-closed',
  motion:'mdi:motion-sensor',
  deer:'mdi:forest',
  bear:'mdi:paw',
  cow:'mdi:cow',
  sheep:'mdi:sheep',
  boat:'mdi:ferry',
  airplane:'mdi:airplane',
  train:'mdi:train',
};

const CAM_COLORS = ['rgba(10,132,255,.5)','rgba(255,159,10,.5)','rgba(48,209,88,.5)','rgba(191,90,242,.5)'];

// ── src/helpers.js ──
/** Shared stateless helpers used by card, timeline and camera modules. */
// Shared stateless helpers used across card modules.
function cap(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }

function parseWs(r) { if (typeof r === 'string') { try { return JSON.parse(r); } catch(_) { return []; } } return r; }

function labelColor(l) { if (!l) return '#ff9f0a'; if (LABEL_COLORS[l]) return LABEL_COLORS[l]; let h=0; for (const c of l) h=(h*31+c.charCodeAt(0))>>>0; return PALETTE[h%PALETTE.length]; }

function timelineGlyph(label) {
  const key=String(label||'motion').toLowerCase();
  const icon=TIMELINE_GLYPHS[key] || TIMELINE_GLYPHS.motion;
  return `<ha-icon icon="${icon}" aria-hidden="true"></ha-icon>`;
}

function mkCamState() { return { clientId:'frigate', cam:'', events:[], recordings:[], recordingsLoaded:false, recordingsRangeStart:null, recordingsRangeEnd:null, recordingsLoadedAt:0, reviews:[], kept:[], filterLabels:[], filterFaces:[], filterZones:[], filterLabelNames:{}, filterZoneNames:{}, filterMetaLoaded:false, filterMetaLoading:false, filterMetaLoadedAt:0, discovered:false }; }

function camDisplayName(c) { return c.name || (c.entity||'').replace(/^camera\./,'').replace(/_/g,' '); }

// ── src/styles.js ──
// Card CSS is intentionally isolated from runtime behavior.
const STYLES = `
  :host{display:block;}
  .card{
    color:var(--c-text);
    overflow:hidden;
    border-radius:var(--ha-card-border-radius,20px);
    font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","SF Pro Text",system-ui,"Segoe UI",Roboto,sans-serif;
    -webkit-font-smoothing:antialiased;
    text-rendering:optimizeLegibility;
    background:var(--c-bg);
    -webkit-backdrop-filter:blur(38px) saturate(165%);
    backdrop-filter:blur(38px) saturate(165%);
    border:.5px solid var(--c-hairline);
    box-shadow:var(--ha-card-box-shadow,0 1px 1px rgba(0,0,0,.25),0 10px 34px rgba(0,0,0,.32));
  }
  .section-label{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:var(--c-text3);}

  /* ── theme + design tokens (dark = default) ── */
  .card {
    /* surfaces */
    --c-bg:        rgba(28,28,32,.72);
    --c-bg-panel:  rgba(255,255,255,.055);
    --c-bg-panel2: rgba(255,255,255,.09);
    --c-bg-deep:   #000;
    --c-hairline:  rgba(255,255,255,.14);
    /* type — mirrors label/secondaryLabel/tertiaryLabel/quaternaryLabel */
    --c-text:      #f5f5f7;
    --c-text2:     rgba(235,235,245,.68);
    --c-text3:     rgba(235,235,245,.42);
    --c-text4:     rgba(235,235,245,.22);
    /* separators */
    --c-border:    rgba(84,84,88,.48);
    --c-border2:   rgba(120,120,128,.36);
    /* accent — derived from Home Assistant's own theme first (--accent-color,
       then --primary-color), falling back to systemBlue only if HA sets
       neither. The accent_color YAML option (in card.js) sets --c-acc directly
       as an inline style, which — via normal CSS cascade — takes precedence
       over this var()-with-fallback chain automatically. --c-acc-bg/-bdr/-text
       are all derived from whatever --c-acc resolves to, so an override stays
       self-consistent without extra JS. */
    --c-acc:       var(--accent-color, var(--primary-color, #0a84ff));
    --c-acc-bg:    color-mix(in srgb, var(--c-acc) 18%, transparent);
    --c-acc-bdr:   color-mix(in srgb, var(--c-acc) 42%, transparent);
    --c-acc-text:  color-mix(in srgb, var(--c-acc) 82%, white);
    /* semantic status colors */
    --c-on:        #30d158;
    --c-on-bg:     rgba(48,209,88,.16);
    --c-danger:    #ff453a;
    --c-danger-bg: rgba(255,69,58,.16);
    --c-warn:      #ff9f0a;
    --c-warn-bg:   rgba(255,159,10,.16);
    --c-fav:       #ffd60a;
    --c-fav-bg:    rgba(255,214,10,.14);
    --c-info:      #5e5ce6;
    --c-info-bg:   rgba(94,92,230,.16);
    /* radius scale */
    --r-xs: 6px; --r-sm: 9px; --r-md: 12px; --r-lg: 16px; --r-full: 999px;
    /* spacing scale (8pt-derived; existing hand-tuned paddings are left as-is,
       this scale is for new/refactored surfaces going forward) */
    --sp-1: 4px; --sp-2: 8px; --sp-3: 12px; --sp-4: 16px; --sp-5: 20px; --sp-6: 24px;
    /* elevation scale — blur + fill strength increase with how "above" the
       surface floats. e1 = flush panel (filter/cal panels, list rows),
       e2 = card chrome (toolbars, sheets), e3 = floating controls over live
       video (needs the strongest blur since video behind it never settles). */
    --e1-blur: blur(12px);              --e1-fill: rgba(255,255,255,.055);
    --e2-blur: blur(20px) saturate(180%); --e2-fill: rgba(28,28,30,.6);
    --e3-blur: blur(26px) saturate(180%); --e3-fill: rgba(28,28,30,.55);
    /* z-index scale */
    --z-base: 1; --z-controls: 4; --z-overlay: 6; --z-sheet: 20; --z-toast: 99;
    /* motion timing scale — single shared curve (iOS push/sheet-style ease),
       durations tiered by how big the visual change is */
    --ease: cubic-bezier(.32,.72,0,1);
    --dur-instant: .1s; --dur-fast: .15s; --dur-base: .2s; --dur-slow: .32s;
  }
  /* Respect the user's OS-level motion preference: collapse every transition
     and animation to near-instant instead of disabling them outright, so
     state still visibly changes (e.g. a toggled button) without the motion. */
  @media (prefers-reduced-motion: reduce) {
    .card *, .card *::before, .card *::after {
      animation-duration: .001ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: .001ms !important;
      scroll-behavior: auto !important;
    }
  }
  .card.theme-light {
    --c-bg:        rgba(242,242,247,.78);
    --c-bg-panel:  rgba(0,0,0,.045);
    --c-bg-panel2: rgba(0,0,0,.07);
    --c-bg-deep:   #0b0b0d;
    --c-hairline:  rgba(0,0,0,.08);
    --c-text:      #1d1d1f;
    --c-text2:     rgba(60,60,67,.68);
    --c-text3:     rgba(60,60,67,.42);
    --c-text4:     rgba(60,60,67,.22);
    --c-border:    rgba(60,60,67,.16);
    --c-border2:   rgba(60,60,67,.29);
    --c-acc:       var(--accent-color, var(--primary-color, #007aff));
    --c-acc-bg:    color-mix(in srgb, var(--c-acc) 12%, transparent);
    --c-acc-bdr:   color-mix(in srgb, var(--c-acc) 38%, transparent);
    --c-acc-text:  color-mix(in srgb, var(--c-acc) 82%, black);
    --c-on:        #34c759;
    --c-on-bg:     rgba(52,199,89,.14);
    --c-danger:    #ff3b30;
    --c-danger-bg: rgba(255,59,48,.12);
    --c-warn:      #ff9500;
    --c-warn-bg:   rgba(255,149,0,.12);
    --c-fav:       #ff9f0a;
    --c-fav-bg:    rgba(255,159,10,.12);
    --c-info:      #5856d6;
    --c-info-bg:   rgba(88,86,214,.12);
  }
  /* ── responsive layout ── */
  .layout{display:flex;flex-direction:column;}
  /* Wide: side-by-side.
     col-left drives card height (natural: stream + timeline + info + tabs + latest).
     col-right max-height is set dynamically by JS to match col-left.offsetHeight
     so the events panel never makes the card taller than the stream side. */
  .card.wide .layout{flex-direction:row;align-items:flex-start;}
  .card.wide .col-left{width:58%;flex-shrink:0;}
  .card.wide .col-right{flex:1;min-width:0;overflow-y:auto;border-left:.5px solid var(--c-border);}
  /* Cap stream height so a full-width section doesn't produce an 800px stream.
     User can override via stream_height config. */
  .card.wide #eng-wrap{max-height:var(--stream-h,55vh);}
  .card.wide .browse-toggle{display:none;}
  .card.wide .browse{display:block!important;}
  /* Narrow grid mode: grid stacks above events; browse is open by default
     but the toggle is visible so the user can collapse it. */

  /* ── feed area ── */
  .feed-area{position:relative;width:100%;}
  #eng-wrap{position:relative;width:100%;aspect-ratio:var(--stream-ar,16/9);background:var(--c-bg-deep);overflow:hidden;}
  /* stream_resizable: true — drag the bottom-right corner to change height.
     The aspect-ratio above sets the default/reset shape; once dragged, the
     browser sets an explicit height that overrides it, same as a <textarea>. */
  #eng-wrap.resizable{resize:vertical;min-height:120px;}
  #eng-wrap.resizable .stream-resize-grip{
    position:absolute;z-index:20;left:50%;bottom:6px;transform:translateX(-50%);
    width:54px;height:6px;border-radius:999px;background:rgba(255,255,255,.42);
    box-shadow:0 1px 4px rgba(0,0,0,.45);opacity:.72;cursor:ns-resize;
    touch-action:none;-webkit-user-select:none;user-select:none;
  }
  #eng-wrap.resizable .stream-resize-grip::before{
    content:'';position:absolute;inset:-14px -18px;
  }
  #eng-wrap.resizable.resizing .stream-resize-grip{opacity:1;background:rgba(255,255,255,.82);}
  @media (hover:hover){
    #eng-wrap.resizable .stream-resize-grip{opacity:.35;transition:opacity .15s ease;}
    #eng-wrap.resizable:hover .stream-resize-grip{opacity:.82;}
  }
  #eng-wrap:fullscreen,#eng-wrap:-webkit-full-screen{aspect-ratio:unset;width:100vw;height:100vh;}
  #eng-wrap.live-pseudo-fullscreen{position:fixed!important;inset:0!important;width:100vw!important;height:100vh!important;height:100dvh!important;z-index:2147483000!important;aspect-ratio:auto!important;border-radius:0!important;background:#000!important;overscroll-behavior:none;touch-action:manipulation;}
  #eng-wrap.live-pseudo-fullscreen .live-fs-exit{position:absolute;top:max(12px,env(safe-area-inset-top));right:12px;width:40px;height:40px;border:0;border-radius:20px;background:rgba(28,28,30,.72);color:#fff;font:300 30px/40px -apple-system,BlinkMacSystemFont,sans-serif;z-index:20;backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);}
  #eng-wrap.live-pseudo-fullscreen #engine{width:100%;height:100%;}
  #eng-wrap.live-pseudo-fullscreen + *{position:relative;z-index:0;}
  #eng-wrap .live-fs-mirror{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;background:#000;z-index:16;display:block;}
  /* iOS MediaStream video can freeze when Apple's native fullscreen compositor
     takes ownership of the element. Keep the live video inline and suppress the
     native fullscreen affordance on direct go2rtc video. also removes
     this card's dedicated iOS fullscreen buttons entirely. */
  #engine>video::-webkit-media-controls-fullscreen-button{display:none!important;}
  #engine{position:absolute;inset:0;}
  #engine ha-camera-stream,#engine ha-hls-player{width:100%;height:100%;display:block;}
  .viewer{position:absolute;inset:0;background:#000;display:flex;align-items:center;justify-content:center;z-index:var(--z-controls);}
  .viewer video,.viewer img.snap{width:100%;height:100%;object-fit:contain;background:#000;}
  .viewer .rec-player{position:absolute;inset:0;display:block;background:#000;z-index:1;min-width:0;min-height:0;overflow:hidden;}
  .viewer .playback-loading{position:absolute;inset:0;z-index:8;display:flex;align-items:center;justify-content:center;gap:9px;background:rgba(8,8,10,.28);color:rgba(255,255,255,.82);font:600 12px/-apple-system,BlinkMacSystemFont,sans-serif;pointer-events:none;backdrop-filter:blur(2px);-webkit-backdrop-filter:blur(2px);}
  .viewer .playback-loading .spinner{width:14px;height:14px;border:2px solid rgba(255,255,255,.22);border-top-color:rgba(255,255,255,.9);border-radius:50%;animation:frigate-spin .8s linear infinite;}
  @keyframes frigate-spin{to{transform:rotate(360deg)}}
  .viewer .recording-video{width:100%;height:100%;object-fit:contain;background:#000;display:block;}
  .viewer .rec-player video::-webkit-media-controls{z-index:20;}
  .viewer .ld{color:var(--c-text2);font-size:13px;}
  .ph{width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;color:var(--c-text4);background:linear-gradient(160deg,#1c1c1e,#000);}
  .ph svg{width:40px;height:40px;opacity:.35;}
  /* skeleton shimmer — replaces spinners wherever a stream/thumbnail is loading */
  .skel-stream{position:relative;overflow:hidden;}
  .skel-stream::after{content:'';position:absolute;inset:0;background:linear-gradient(100deg,transparent 30%,rgba(255,255,255,.07) 50%,transparent 70%);background-size:200% 100%;animation:skelShimmer 1.6s ease-in-out infinite;}
  @keyframes skelShimmer{0%{background-position:160% 0;}100%{background-position:-60% 0;}}
  /* generic skeleton block — for future thumbnail/text placeholders */
  .skeleton{position:relative;overflow:hidden;background:var(--c-bg-panel);border-radius:var(--r-xs);}
  .skeleton::after{content:'';position:absolute;inset:0;background:linear-gradient(100deg,transparent 30%,rgba(255,255,255,.09) 50%,transparent 70%);background-size:200% 100%;animation:skelShimmer 1.6s ease-in-out infinite;}
  .feed-top{position:absolute;top:12px;left:16px;right:16px;z-index:var(--z-controls);display:flex;align-items:center;gap:8px;}
  /* floating over live video — uses the strongest (e3) blur tier since the
     video behind it never settles into a stable backdrop to blur against. */
  .btn{display:inline-flex;align-items:center;gap:6px;background:var(--e3-fill);-webkit-backdrop-filter:var(--e3-blur);backdrop-filter:var(--e3-blur);border:.5px solid rgba(255,255,255,.18);color:#fff;border-radius:var(--r-sm);padding:7px 13px;font-size:12px;font-weight:600;letter-spacing:.01em;cursor:pointer;transition:background var(--dur-fast) var(--ease),transform var(--dur-instant) var(--ease);}
  .btn:hover{background:rgba(44,44,46,.7);}
  .btn:active{transform:scale(.96);}
  .btn svg{width:14px;height:14px;}

  /* ── stream controls: sits in normal flow directly below the stream/grid
     (not floating over the video anymore — native video controls now cover
     play/mute for the single-camera view, so this bar is just Talk in
     single view, or a fullscreen button for the grid, centered underneath). ── */
  .stream-ctrl-bar{display:flex;align-items:center;justify-content:center;gap:8px;margin-top:10px;min-height:44px;}
  .scb-btn{width:44px;height:44px;display:flex;align-items:center;justify-content:center;background:var(--e3-fill);-webkit-backdrop-filter:var(--e3-blur);backdrop-filter:var(--e3-blur);border:.5px solid rgba(255,255,255,.2);color:#fff;border-radius:50%;cursor:pointer;flex-shrink:0;transition:background var(--dur-fast) var(--ease),transform var(--dur-instant) var(--ease),opacity var(--dur-fast) var(--ease);}
  .scb-btn:hover{background:rgba(44,44,46,.7);}
  .scb-btn:active{transform:scale(.9);}
  .scb-btn svg{width:18px;height:18px;}

  /* ── camera grid ── */
  .cam-grid{display:grid;width:100%;}
  .cam-grid.cams-1{grid-template-columns:1fr;}
  .cam-grid.cams-2{grid-template-columns:1fr 1fr;}
  .cam-grid.cams-3,.cam-grid.cams-4{grid-template-columns:1fr 1fr;}
  .grid-slot{position:relative;aspect-ratio:var(--stream-ar,16/9);background:var(--c-bg-deep);overflow:hidden;cursor:pointer;transition:box-shadow .15s var(--ease);}
  .grid-slot:hover{box-shadow:inset 0 0 0 2px var(--c-acc-bdr);}
  .grid-slot.placeholder{background:#000;cursor:default;}
  .grid-slot.placeholder:hover{box-shadow:none;}
  .grid-slot ha-camera-stream{width:100%;height:100%;display:block;}
  .grid-close-btn{position:absolute;top:6px;right:6px;width:26px;height:26px;background:rgba(20,20,22,.6);-webkit-backdrop-filter:var(--e3-blur);backdrop-filter:var(--e3-blur);border:.5px solid rgba(255,255,255,.22);color:#fff;border-radius:50%;font-size:12px;cursor:pointer;z-index:var(--z-sheet);display:flex;align-items:center;justify-content:center;line-height:1;transition:background .15s var(--ease);}
  .grid-close-btn:hover{background:var(--c-danger);}
  /* per-slot fullscreen button — appears on hover, bottom-right */
  .grid-fs-btn{position:absolute;bottom:6px;right:6px;width:24px;height:24px;background:rgba(20,20,22,.55);-webkit-backdrop-filter:var(--e3-blur);backdrop-filter:var(--e3-blur);border:.5px solid rgba(255,255,255,.2);color:#fff;border-radius:var(--r-xs);cursor:pointer;z-index:var(--z-sheet);display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .18s var(--ease),background .15s var(--ease);}
  .grid-slot:hover .grid-fs-btn{opacity:1;}
  .grid-fs-btn:hover{background:var(--c-acc);border-color:var(--c-acc);}
  .grid-fs-btn svg{width:12px;height:12px;}
  /* fullscreen animation */
  @keyframes fsIn{from{opacity:.7;transform:scale(.97)}to{opacity:1;transform:scale(1)}}
  /* single-slot fullscreen */
  .grid-slot:fullscreen{width:100vw;height:100vh;aspect-ratio:unset;border-radius:0;background:#000;animation:fsIn .3s var(--ease);}
  .grid-slot:-webkit-full-screen{width:100vw;height:100vh;aspect-ratio:unset;border-radius:0;background:#000;animation:fsIn .3s var(--ease);}
  .grid-slot:fullscreen .grid-fs-btn,.grid-slot:-webkit-full-screen .grid-fs-btn{display:none;}
  /* whole-grid fullscreen */
  .cam-grid:fullscreen{width:100vw;height:100vh;max-height:none!important;background:#000;animation:fsIn .3s var(--ease);}
  .cam-grid:-webkit-full-screen{width:100vw;height:100vh;max-height:none!important;background:#000;animation:fsIn .3s var(--ease);}
  .cam-grid:fullscreen .grid-slot,.cam-grid:-webkit-full-screen .grid-slot{aspect-ratio:unset;border-radius:0;}
  .cam-grid:fullscreen.cams-3,.cam-grid:fullscreen.cams-4,.cam-grid:-webkit-full-screen.cams-3,.cam-grid:-webkit-full-screen.cams-4{grid-template-rows:1fr 1fr;}
  .grid-label{position:absolute;bottom:5px;left:7px;font-size:11px;font-weight:600;letter-spacing:-.01em;color:rgba(255,255,255,.92);text-shadow:0 1px 2px rgba(0,0,0,.7);background:rgba(20,20,22,.5);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);padding:2px 8px;border-radius:20px;pointer-events:none;z-index:var(--z-base);}
  /* 3/4-cam grid: cap height so 2 rows fit viewport */
  .card.grid-mode .cam-grid.cams-3,
  .card.grid-mode .cam-grid.cams-4 { max-height:var(--stream-h,70vh); grid-template-rows:1fr 1fr; }
  .card.grid-mode .cam-grid.cams-3 .grid-slot,
  .card.grid-mode .cam-grid.cams-4 .grid-slot { aspect-ratio:unset; min-height:0; }
  /* Single stream: optional height cap */
  #eng-wrap { max-height:var(--stream-h,none); }
  /* Mobile grid: show 2×2 at same total height as a single stream (56.25vw = 16:9) */
  .card.mobile .cam-grid { max-height:56.25vw; }
  .card.mobile .cam-grid .grid-slot { aspect-ratio:unset; min-height:0; }

  /* ── info row ── */
  .info-row{display:flex;align-items:center;justify-content:space-between;padding:12px 18px 10px;border-bottom:.5px solid var(--c-border);}
  .info-title{font-size:15px;font-weight:600;letter-spacing:-.01em;color:var(--c-text);} .info-sub{font-size:12px;color:var(--c-text3);margin-top:1px;}
  .stats{display:flex;gap:18px;} .stat{display:flex;flex-direction:column;align-items:flex-end;}
  .sv{font-size:15px;font-weight:600;color:var(--c-acc-text);} .sl{font-size:10px;color:var(--c-text4);text-transform:uppercase;letter-spacing:.06em;}

  /* ── camera switcher (segmented-control treatment) ── */
  .cam-switcher{display:flex;align-items:center;gap:6px;padding:7px 14px;border-bottom:.5px solid var(--c-border);background:var(--c-bg-panel);}
  .cam-tabs{display:flex;gap:4px;flex:1;overflow-x:auto;scrollbar-width:none;background:var(--c-bg-panel2);padding:3px;border-radius:var(--r-sm);}
  .cam-tabs::-webkit-scrollbar{display:none;}
  .cam-tab{display:inline-flex;align-items:center;gap:5px;background:transparent;border:none;color:var(--c-text2);border-radius:calc(var(--r-sm) - 3px);padding:6px 12px;font-size:12px;font-weight:600;cursor:pointer;white-space:nowrap;transition:background .18s var(--ease),color .18s var(--ease);}
  .cam-tab:hover{background:rgba(255,255,255,.06);}
  .cam-tab.active{background:var(--c-bg-panel);color:var(--c-text);box-shadow:0 1px 3px rgba(0,0,0,.3);}
  .cam-tab svg{width:12px;height:12px;flex-shrink:0;}
  .cam-dot{font-size:8px;vertical-align:middle;}
  .cam-rotate,.cam-grid-btn{width:34px;height:34px;display:flex;align-items:center;justify-content:center;background:var(--c-bg-panel);border:1px solid var(--c-border2);color:var(--c-text2);border-radius:var(--r-sm);cursor:pointer;flex-shrink:0;transition:all .15s var(--ease);}
  .cam-rotate svg,.cam-grid-btn svg{width:15px;height:15px;}
  .cam-rotate.on{color:var(--c-on);border-color:rgba(48,209,88,.4);background:var(--c-on-bg);}
  .cam-grid-btn:hover{color:var(--c-acc-text);border-color:var(--c-acc-bdr);}

  /* ── latest event ── */
  .latest{border-bottom:.5px solid var(--c-border);}
  .latest-label{padding:8px 18px 5px;display:flex;align-items:center;}
  .latest-body{padding:0 14px 10px;}

  /* ── browse toggle ── */
  .browse-toggle{width:100%;display:flex;align-items:center;gap:9px;background:var(--c-bg-panel);border:none;border-bottom:.5px solid var(--c-border);color:inherit;padding:11px 18px;cursor:pointer;transition:background .15s var(--ease);}
  .browse-toggle:hover{background:var(--c-bg-panel2);}
  .chev2{display:inline-flex;transition:transform .2s var(--ease);color:var(--c-text3);} .chev2 svg{width:14px;height:14px;}

  /* ── tabs (segmented filter chips) ── */
  .tabs{display:flex;gap:5px;padding:10px 14px;border-bottom:.5px solid var(--c-border);overflow-x:auto;scrollbar-width:none;}
  .tabs::-webkit-scrollbar{display:none;}
  .pill{display:inline-flex;align-items:center;gap:5px;background:var(--c-bg-panel);border:1px solid var(--c-border2);border-radius:20px;padding:6px 13px 6px 11px;font-size:12px;font-weight:600;color:var(--c-text2);cursor:pointer;white-space:nowrap;flex-shrink:0;transition:all .15s var(--ease);}
  .pill svg{width:12px;height:12px;opacity:.75;}
  .pill:hover{background:var(--c-bg-panel2);}
  .pill.active{background:var(--c-acc);border-color:var(--c-acc);color:#fff;}
  .pill.active svg{opacity:1;}
  .pill.icon-only{padding:7px 9px;} .pill.icon-only svg{width:14px;height:14px;opacity:.85;}

  /* ── timeline ── */
  .tl-sec{padding:10px 14px;border-bottom:.5px solid var(--c-border);}
  .tl-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;}
  .tl-tools{display:flex;gap:4px;}
  .tool{background:var(--c-bg-panel);border:1px solid var(--c-border2);color:var(--c-text2);border-radius:var(--r-xs);padding:5px 8px;cursor:pointer;transition:all .15s var(--ease);}
  .tool svg{width:14px;height:14px;display:block;} .tool:hover{color:var(--c-acc-text);border-color:var(--c-acc-bdr);}
  .tl-track{position:relative;height:32px;background:var(--c-bg-panel);border-radius:var(--r-xs);overflow:hidden;cursor:grab;touch-action:pan-y;}
  .tl-track.grab{cursor:grabbing;}
  .tl-track::before{content:'';position:absolute;inset:0;background:repeating-linear-gradient(90deg,transparent,transparent calc(100%/12 - 1px),rgba(255,255,255,.04) calc(100%/12 - 1px),rgba(255,255,255,.04) calc(100%/12));}
  .t-rec{position:absolute;top:0;height:100%;background:rgba(10,132,255,.45);pointer-events:none;}
  .t-ev{position:absolute;top:50%;transform:translateY(-50%);width:4px;height:20px;border-radius:3px;z-index:var(--z-base);cursor:pointer;transition:width var(--dur-fast) var(--ease);} .t-ev:hover{width:6px;}
  .tl-now{position:absolute;top:0;bottom:0;width:2px;background:var(--c-danger);pointer-events:none;}
  .tl-live-line{position:absolute;left:0;right:0;height:2px;background:#ff3b30;box-shadow:0 0 8px rgba(255,59,48,.55);z-index:var(--z-sheet);pointer-events:none;}
  .tl-live-line::before{content:'LIVE';position:absolute;right:8px;top:50%;transform:translateY(-50%);background:#ff3b30;color:#fff;font-size:9px;font-weight:800;letter-spacing:.06em;padding:2px 7px;border-radius:9px;box-shadow:0 2px 8px rgba(0,0,0,.3);}
  .tl-labels{display:flex;justify-content:space-between;margin-top:4px;} .tl-labels span{font-size:10px;color:var(--c-text4);}
  .legend{display:flex;gap:11px;flex-wrap:wrap;margin-top:7px;} .lg{font-size:10px;color:var(--c-text3);display:flex;align-items:center;gap:4px;} .lg i{width:7px;height:7px;border-radius:2px;display:inline-block;}

  /* ── filter + cal ── */
  .filter-panel,.cal-panel{background:var(--c-bg-panel);border:1px solid var(--c-border2);border-radius:var(--r-md);padding:10px;margin-bottom:8px;}
  .frow{display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:5px;} .frow:last-child{margin-bottom:0;} .frow-l{font-size:10px;color:var(--c-text3);width:40px;text-transform:uppercase;letter-spacing:.04em;flex-shrink:0;}
  .chip{background:var(--c-bg-panel);border:1px solid var(--c-border2);color:var(--c-text2);border-radius:14px;padding:4px 10px;font-size:11px;font-weight:600;cursor:pointer;transition:all .15s var(--ease);}
  .chip.on{background:var(--c-acc);border-color:var(--c-acc);color:#fff;}
  .cal-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:7px;} .cal-head b{font-size:13px;font-weight:600;} .cal-head button{background:none;border:none;color:var(--c-acc-text);font-size:18px;cursor:pointer;padding:0 6px;}
  .cal-dow,.cal-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:2px;text-align:center;}
  .cal-dow span{font-size:9px;color:var(--c-text4);padding:2px 0;text-transform:uppercase;}
  .cday{position:relative;background:none;border:none;color:var(--c-text);font-size:12px;padding:6px 0;border-radius:var(--r-xs);cursor:pointer;transition:background .15s var(--ease);} .cday:hover{background:var(--c-acc-bg);} .cdot{position:absolute;bottom:3px;left:50%;transform:translateX(-50%);width:3px;height:3px;border-radius:50%;background:var(--c-danger);}

  /* ── event list ── */
  .list-sec{padding:10px 14px 14px;}
  /* Wide: col-right scrolls the whole events panel, no inner list cap needed */
  .card.wide .list{max-height:none;overflow-y:visible;}
  .list-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:9px;}
  .newtoast{font-size:10px;font-weight:700;color:var(--c-on);}
  .list{max-height:460px;overflow-y:auto;}
  .empty{text-align:center;padding:18px;color:var(--c-text3);font-size:12px;line-height:1.5;}
  /* empty-state pattern: icon + short title + one-line description */
  .empty-state{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;text-align:center;padding:28px 18px;color:var(--c-text3);}
  .empty-state .es-icon{width:34px;height:34px;display:flex;align-items:center;justify-content:center;color:var(--c-text4);}
  .empty-state .es-icon svg{width:100%;height:100%;}
  .empty-state .es-title{font-size:13px;font-weight:600;color:var(--c-text2);}
  .empty-state .es-desc{font-size:11px;color:var(--c-text4);line-height:1.4;}
  .more,.end{text-align:center;font-size:10px;color:var(--c-text4);padding:7px;}

  .ec{display:flex;gap:10px;align-items:center;padding:9px 11px;background:var(--c-bg-panel);border:1px solid var(--c-border2);border-radius:var(--r-md);margin-bottom:6px;cursor:pointer;transition:background .15s var(--ease),border-color .15s var(--ease);}
  .ec:hover{background:var(--c-bg-panel2);border-color:var(--c-acc-bdr);}
  .ec.compact{padding:7px 10px;}
  .ec.compact .et{width:54px;height:38px;border-radius:var(--r-xs);}
  .ec.compact .eact .ico{width:26px;height:26px;}
  .ec.compact .eact .ico svg{width:12px;height:12px;}
  .et{width:72px;height:50px;border-radius:var(--r-sm);overflow:hidden;flex-shrink:0;background:var(--c-bg-deep);position:relative;}
  .et img{width:100%;height:100%;object-fit:cover;display:block;}
  .tph{width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:linear-gradient(160deg,#1c1c1e,#000);color:#3a3a3c;} .tph svg,.tph ha-icon{width:20px;height:20px;--mdc-icon-size:20px;}
  .ed{position:absolute;bottom:3px;right:4px;font-size:9px;font-weight:700;color:#fff;background:rgba(0,0,0,.6);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);border-radius:5px;padding:1px 4px;}
  .ei{flex:1;min-width:0;}
  .etop{display:flex;align-items:center;gap:6px;margin-bottom:4px;flex-wrap:wrap;}
  .tb{font-size:10px;font-weight:700;padding:2px 7px;border-radius:9px;}
  .cam-badge{font-size:9px;color:var(--c-text2);background:var(--c-bg-panel);padding:1px 7px;border-radius:9px;}
  .subl{font-size:10px;font-weight:600;color:var(--c-info);background:var(--c-info-bg);padding:2px 7px;border-radius:9px;}
  .bc,.bs{font-size:9px;font-weight:700;padding:1px 6px;border-radius:7px;text-transform:uppercase;letter-spacing:.02em;} .bc{background:var(--c-on-bg);color:var(--c-on);} .bs{background:var(--c-bg-panel2);color:var(--c-text2);}
  .esc{font-size:11px;font-weight:700;color:var(--c-on);background:var(--c-on-bg);border-radius:7px;padding:1px 6px;}
  .em{display:flex;gap:9px;flex-wrap:wrap;font-size:10px;color:var(--c-text3);} .em span{display:flex;align-items:center;gap:3px;} .em svg{width:9px;height:9px;}
  .desc{margin-top:5px;font-size:11px;color:var(--c-text2);line-height:1.45;background:var(--c-bg-panel);border-radius:var(--r-xs);padding:6px 8px;}
  .eact{display:flex;flex-direction:row;align-items:center;gap:5px;flex-shrink:0;}
  .ico{width:30px;height:30px;display:flex;align-items:center;justify-content:center;background:var(--c-bg-panel);border:1px solid var(--c-border2);border-radius:var(--r-xs);color:var(--c-text2);cursor:pointer;transition:all .15s var(--ease);}
  .ico svg{width:14px;height:14px;} .ico:hover{color:var(--c-acc-text);border-color:var(--c-acc-bdr);}
  .ico.fav.on{color:var(--c-fav);border-color:rgba(255,214,10,.4);background:var(--c-fav-bg);}

  /* ── recordings ── */
  .rec{display:flex;align-items:center;gap:10px;padding:9px 11px;background:var(--c-bg-panel);border:1px solid var(--c-border2);border-radius:var(--r-md);margin-bottom:6px;cursor:pointer;transition:background .15s var(--ease);}
  .rec:hover{background:var(--c-bg-panel2);}
  .ric{width:32px;height:32px;border-radius:var(--r-xs);background:var(--c-acc-bg);color:var(--c-acc-text);display:flex;align-items:center;justify-content:center;} .ric svg{width:15px;height:15px;}
  .rinf{flex:1;} .rt{font-size:13px;font-weight:600;color:var(--c-text);} .rsub{font-size:10px;color:var(--c-text3);margin-top:1px;} .rp{color:var(--c-on);}

  /* ── recording seek ── */
  .rec-seek-wrap{margin-top:8px;}
  .rec-seek-row{display:flex;align-items:center;gap:9px;}
  .rec-seek-bar{flex:1;height:4px;accent-color:var(--c-acc);cursor:pointer;}
  .rec-seek-lbl{font-size:10px;color:var(--c-acc-text);white-space:nowrap;min-width:90px;font-weight:600;}
  .seek-hint{color:var(--c-text4);font-size:9px;}
  .seek-from-lbl{position:absolute;top:9px;left:50%;transform:translateX(-50%);background:rgba(20,20,22,.7);-webkit-backdrop-filter:var(--e3-blur);backdrop-filter:var(--e3-blur);border:.5px solid var(--c-acc-bdr);color:var(--c-acc-text);font-size:11px;font-weight:600;padding:5px 13px;border-radius:20px;white-space:nowrap;z-index:var(--z-sheet);pointer-events:none;box-shadow:0 4px 16px rgba(0,0,0,.35);}

  /* ── reviews ── */
  .rev-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;font-size:11px;color:var(--c-text2);}
  .rev{display:flex;align-items:center;gap:10px;padding:9px 11px;background:var(--c-bg-panel);border:1px solid var(--c-border2);border-radius:var(--r-md);margin-bottom:6px;cursor:pointer;transition:background .15s var(--ease),border-color .15s var(--ease);}
  .rev[data-review-open]:hover{background:var(--c-bg-panel2);border-color:var(--c-acc-bdr);}
  .rev-sev{width:4px;align-self:stretch;border-radius:3px;} .rev-sev.alert{background:var(--c-danger);} .rev-sev.detection{background:var(--c-warn);}
  .rev-inf{flex:1;} .rev-t{font-size:13px;font-weight:600;color:var(--c-text);} .rev-m{font-size:10px;color:var(--c-text3);margin-top:1px;}
  .rev-th{width:56px;height:40px;border-radius:var(--r-xs);overflow:hidden;flex-shrink:0;background:var(--c-bg-deep);} .rev-th img{width:100%;height:100%;object-fit:cover;display:block;}

  /* ── toast ── */
  .toast{position:fixed;left:50%;bottom:26px;transform:translateX(-50%);z-index:var(--z-toast);background:rgba(28,28,30,.78);-webkit-backdrop-filter:blur(24px) saturate(180%);backdrop-filter:blur(24px) saturate(180%);border:.5px solid rgba(255,69,58,.4);color:#ffb4ae;padding:9px 16px;border-radius:var(--r-sm);font-size:12px;font-weight:500;box-shadow:0 10px 30px rgba(0,0,0,.45);max-width:90%;}
  .diag{font-size:10px;color:#ffb4ae;background:var(--c-danger-bg);border:1px solid rgba(255,69,58,.3);border-radius:var(--r-xs);padding:7px 9px;margin-bottom:8px;}

  /* ── recording viewer bottom overlay (download row only — native
     video controls handle play/pause/mute/fullscreen/scrub now) ── */
  .rec-dl-bar{position:absolute;bottom:52px;left:0;right:0;display:flex;flex-direction:column;gap:6px;padding:9px 13px 7px;background:linear-gradient(transparent,rgba(0,0,0,.85));z-index:var(--z-controls);pointer-events:none;}
  .rec-dl-bar>*{pointer-events:all;}
  .rec-dl-row{display:flex;align-items:center;gap:9px;}
  .rec-dl-row span{flex:1;font-size:11px;color:rgba(255,255,255,.8);}
  .rec-dl-time{color:var(--c-acc-text);font-weight:600;font-variant-numeric:tabular-nums;}
  .rec-dl-btn{padding:5px 13px;background:var(--c-acc);border:none;color:#fff;border-radius:var(--r-xs);font-size:11px;font-weight:600;cursor:pointer;transition:filter .15s var(--ease);}
  .rec-dl-btn:hover{filter:brightness(1.12);}

  /* ── stream control active state (zone toggle when on) ── */
  .scb-btn.active{background:var(--c-acc-bg)!important;border-color:var(--c-acc-bdr)!important;color:var(--c-acc)!important;}

  /* ── two-way audio talk button ── */
  .scb-btn.talk-btn{
    position:relative;overflow:hidden;touch-action:none;-webkit-user-select:none;user-select:none;
    width:64px;height:64px;border-radius:50%;padding:0;
    background:rgba(28,28,30,.88);border:1px solid rgba(255,255,255,.16);
    -webkit-tap-highlight-color:transparent;
    transition:transform .12s cubic-bezier(.2,.8,.2,1),background .2s ease,box-shadow .2s ease;
  }
  .scb-btn.talk-btn:active{transform:scale(.94);}
  .scb-btn.talk-btn.connected{box-shadow:0 0 0 1px rgba(94,156,255,.20),0 6px 22px rgba(0,0,0,.25);}
  .scb-btn.talk-btn.talking{
    background:rgba(20,20,24,.94)!important;
    border-color:rgba(94,156,255,.55)!important;
    box-shadow:0 0 0 5px rgba(94,156,255,.10),0 0 28px rgba(94,156,255,.18);
    color:#fff;
  }
  .talk-wave{position:absolute;inset:-4px;width:72px;height:72px;pointer-events:none;}
  .talk-mic-glyph{
    position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);
    display:flex;align-items:center;justify-content:center;opacity:.95;
    transition:opacity .16s ease,transform .16s ease;
  }
  .talk-mic-glyph svg{width:19px;height:19px;}
  .talk-btn.talking .talk-mic-glyph{opacity:.22;transform:translate(-50%,-50%) scale(.86);}


  /* ── focus states (keyboard / accessibility, per HIG focus visibility) ── */
  .btn:focus-visible,.scb-btn:focus-visible,.ico:focus-visible,.chip:focus-visible,.pill:focus-visible,
  .cam-tab:focus-visible,.cam-rotate:focus-visible,.cam-grid-btn:focus-visible,.tool:focus-visible,
  .cday:focus-visible,.grid-close-btn:focus-visible,.grid-fs-btn:focus-visible,
  .rec-dl-btn:focus-visible,.browse-toggle:focus-visible{
    outline:2px solid var(--c-acc);outline-offset:2px;
  }

/* ─────────────────────────────────────────────────────────────
   Step 9 — iOS / UniFi Protect mobile timeline
   Mobile is intentionally a single vertical scrub surface:
   time labels → event rail → preview cards. The playhead is fixed.
   ───────────────────────────────────────────────────────────── */
 .card .tl-sec{
   padding:14px 0 12px;
   background:#000;
   border-bottom:.5px solid rgba(255,255,255,.08);
 }
 .card .tl-head{
   margin:0;
   padding:0 16px 12px;
   min-height:44px;
 }
 .card .tl-head #tl-range{
   font-size:12px;
   font-weight:600;
   letter-spacing:.01em;
   text-transform:none;
   color:rgba(235,235,245,.55);
   font-variant-numeric:tabular-nums;
 }
 .card .tl-tools{gap:8px;}
 .card .tool{
   width:44px;height:44px;padding:0;
   display:flex;align-items:center;justify-content:center;
   border-radius:15px;
   background:rgba(28,28,30,.72);
   border:.5px solid rgba(255,255,255,.16);
   -webkit-backdrop-filter:blur(18px) saturate(180%);
   backdrop-filter:blur(18px) saturate(180%);
 }
 .card .tool svg{width:18px;height:18px;}
 .card .filter-panel,.card .cal-panel{margin:0 12px 10px;}
 .card .tl-track{
   position:relative;
   height:clamp(360px,52vh,620px);
   margin:0;
   border-radius:0;
   background:
     linear-gradient(90deg,#03070d 0%,#07101b 68%,#08111d 100%);
   overflow:hidden;
   cursor:grab;
   touch-action:none;
   isolation:isolate;
 }
 .card .tl-track.grab{cursor:grabbing;}
 .card .tl-track{
   -webkit-user-select:none;
   user-select:none;
   -webkit-touch-callout:none;
   overscroll-behavior:contain;
 }
 .card .tl-track::before{
   content:'';
   position:absolute;
   top:0;bottom:0;
   left:91px;
   width:1px;
   transform:none;
   background:rgba(255,255,255,.12);
   z-index:1;
 }
 .card .tl-track::after{
   content:'';
   position:absolute;
   top:0;bottom:0;
   left:91px;
   width:1px;
   background:linear-gradient(to bottom,transparent,rgba(255,255,255,.13) 12%,rgba(255,255,255,.13) 88%,transparent);
   z-index:1;
 }
 .card .t-rec{
   left:87px!important;
   width:9px!important;
   top:0;
   height:auto;
   border-radius:7px;
   background:linear-gradient(90deg,transparent,rgba(10,132,255,.7),transparent)!important;
   opacity:.8;
   z-index:2;
 }
 .card .tl-scale-mark{
   position:absolute;
   left:0;
   right:0;
   height:1px;
   pointer-events:none;
   z-index:1;
 }
 .card .tl-scale-mark span{
   position:absolute;
   left:12px;
   top:-7px;
   width:61px;
   font-size:11px;
   line-height:14px;
   color:rgba(235,235,245,.36);
   font-variant-numeric:tabular-nums;
   white-space:nowrap;
   text-align:left;
 }
 .card .tl-scale-mark i{
   position:absolute;
   left:87px;
   top:0;
   width:10px;
   height:1px;
   background:rgba(255,255,255,.10);
 }
 .card .tl-scale-mark.hour span{
   color:rgba(235,235,245,.68);
   font-weight:600;
 }
 .card .tl-scale-mark.hour i{
   width:15px;
   background:rgba(255,255,255,.24);
 }
 .card .t-ev{
   position:absolute;
   left:0;
   width:100%;
   height:0;
   margin:0;
   padding:0;
   border:0;
   background:transparent!important;
   color:inherit;
   display:block;
   cursor:pointer;
   z-index:5;
   text-align:left;
 }
 .card .t-ev::before{
   content:'';
   position:absolute;
   left:92px;
   top:0;
   width:calc(100% - 92px);
   height:1px;
   background:rgba(255,255,255,.10);
   pointer-events:none;
 }
 .card .t-time{
   position:absolute;
   left:12px;
   top:-8px;
   width:68px;
   font-size:11px;
   line-height:16px;
   color:rgba(235,235,245,.62);
   font-variant-numeric:tabular-nums;
   white-space:nowrap;
   overflow:hidden;
   text-overflow:clip;
 }
 .card .t-dot{
   position:absolute;
   left:85px;
   top:-7px;
   width:14px;
   height:14px;
   margin:0;
   border-radius:50%;
   background:var(--ev-color);
   border:2px solid #07101b;
   box-shadow:0 0 0 2px color-mix(in srgb,var(--ev-color) 62%,transparent),0 2px 8px rgba(0,0,0,.35);
   z-index:6;
 }
 .card .t-card{
   position:absolute;
   left:108px;
   top:var(--card-offset);
   width:min(260px,calc(100% - 122px));
   height:clamp(78px,11vw,108px);
   display:block;
   padding:3px;
   border:1px solid rgba(255,255,255,.13);
   border-radius:13px;
   background:rgba(28,28,30,.78);
   -webkit-backdrop-filter:blur(22px) saturate(165%);
   backdrop-filter:blur(22px) saturate(165%);
   box-shadow:0 7px 24px rgba(0,0,0,.38);
   transform-origin:left center;
   transition:transform .16s var(--ease),border-color .16s var(--ease),box-shadow .16s var(--ease);
   overflow:hidden;
   text-align:left;
 }
 .card .t-thumb{
   position:relative;
   width:100%;
   height:100%;
   border-radius:10px;
   overflow:hidden;
   background:#111113;
 }
 .card .t-thumb img{
   width:100%;height:100%;
   object-fit:cover;
   display:block;
 }
 .card .t-ph{
   width:100%;height:100%;
   display:flex;align-items:center;justify-content:center;
   color:rgba(235,235,245,.25);
   background:linear-gradient(145deg,#222226,#0c0c0f);
 }
 .card .t-ph svg,.card .t-ph ha-icon{width:22px;height:22px;--mdc-icon-size:22px;}
 .card .t-thumb b{
   position:absolute;
   right:5px;bottom:5px;
   padding:2px 5px;
   border-radius:6px;
   background:rgba(0,0,0,.68);
   color:#fff;
   font-size:9px;
   line-height:12px;
   font-weight:650;
   font-variant-numeric:tabular-nums;
 }
 .card .t-badge{
   position:absolute;
   left:6px;top:6px;
   max-width:calc(100% - 12px);
   padding:3px 7px;
   border-radius:999px;
   background:color-mix(in srgb,var(--ev-color) 78%,rgba(0,0,0,.5));
   border:.5px solid rgba(255,255,255,.32);
   color:#fff;
   font-size:10px;
   line-height:13px;
   font-weight:700;
   letter-spacing:-.01em;
   text-shadow:0 1px 2px rgba(0,0,0,.55);
   white-space:nowrap;
   overflow:hidden;
   text-overflow:ellipsis;
   z-index:3;
 }
 .card .t-meta{display:none;}
 .card .t-meta strong{
   display:block;
   font-size:12px;
   line-height:15px;
   font-weight:650;
   color:#f5f5f7;
   white-space:nowrap;
   overflow:hidden;
   text-overflow:ellipsis;
 }
 .card .t-meta span{
   display:block;
   font-size:10px;
   line-height:13px;
   color:rgba(235,235,245,.46);
   white-space:nowrap;
   overflow:hidden;
   text-overflow:ellipsis;
   font-variant-numeric:tabular-nums;
 }
 .card .t-ev:hover .t-card,
 .card .t-ev:focus-visible .t-card,
 .card .t-ev.selected .t-card{
   border-color:rgba(10,132,255,.58);
   box-shadow:0 8px 28px rgba(0,0,0,.46),0 0 0 1px rgba(10,132,255,.10);
 }
 .card .t-ev:active .t-card{transform:scale(.985);}
 .card .t-ev:focus-visible{outline:none;}
 .card .tl-playhead{
   position:absolute;
   left:91px;
   right:0;
   top:0;
   height:2px;
   background:#0a84ff;
   box-shadow:0 0 8px rgba(10,132,255,.35);
   z-index:10;
   pointer-events:none;
 }
 .card .tl-playhead i{
   position:absolute;
   left:-7px;
   top:-5px;
   width:12px;height:12px;
   border-radius:50%;
   background:#0a84ff;
   box-shadow:0 0 0 3px rgba(10,132,255,.22);
 }
 .card .tl-playhead span{
   position:absolute;
   left:10px;
   top:6px;
   width:6px;height:6px;
   border-radius:50%;
   background:#0a84ff;
   opacity:.55;
 }
 .card .tl-labels{display:none;}
 .card .legend{
   padding:10px 14px 0;
   margin:0;
   gap:7px;
 }
 .card .lg{
   padding:5px 9px;
   border-radius:999px;
   background:rgba(28,28,30,.82);
   border:.5px solid rgba(255,255,255,.10);
   font-size:10px;
   color:rgba(235,235,245,.48);
 }
 .card .lg i{width:7px;height:7px;border-radius:50%;}

 /* iOS-like card chrome below the timeline. */
 .card .info-row{
   padding:13px 16px;
   background:#000;
   border-bottom:.5px solid rgba(255,255,255,.08);
 }
 .card .info-title{font-size:15px;font-weight:600;letter-spacing:-.015em;}
 .card .info-sub{font-size:12px;color:rgba(235,235,245,.42);}
 .card .sv{font-size:15px;font-weight:600;}
 .card .sl{font-size:10px;color:rgba(235,235,245,.32);}
 .card .browse-toggle{
   min-height:52px;
   padding:8px 16px;
   background:rgba(28,28,30,.72);
   border-bottom:.5px solid rgba(255,255,255,.08);
   -webkit-backdrop-filter:blur(18px) saturate(160%);
   backdrop-filter:blur(18px) saturate(160%);
 }
 .card .browse-toggle .section-label{font-size:12px;text-transform:none;letter-spacing:0;color:rgba(235,235,245,.72);}
 .card .tabs{
   padding:9px 12px;
   gap:6px;
   background:#000;
   border-bottom:.5px solid rgba(255,255,255,.08);
 }
 .card .pill{
   min-height:40px;
   padding:7px 13px;
   border-radius:12px;
   background:rgba(118,118,128,.18);
   border:0;
   font-size:12px;
 }
 .card .pill.active{
   background:#f2f2f7;
   color:#111113;
 }
 .card .list-sec{padding:10px 12px 16px;background:#000;}
 .card .ec,.card .rec,.card .rev{
   min-height:72px;
   padding:9px;
   border-radius:14px;
   background:rgba(28,28,30,.72);
   border:.5px solid rgba(255,255,255,.11);
 }
 .card .ico{width:44px;height:44px;border-radius:13px;}

 @media (hover:none), (pointer:coarse){
   .card .grid-fs-btn{opacity:1;}
   .card .btn:hover,.card .pill:hover,.card .ico:hover,.card .tool:hover{background:initial;}
 }
 @media (max-width:560px){
   .card{border-radius:18px;background:#000;}
   .card .feed-top{top:10px;left:10px;right:10px;}
   .card .btn{min-height:44px;padding:9px 13px;border-radius:15px;}
   #eng-wrap{aspect-ratio:16/9;max-height:60vh;}
   .card.mobile .tl-track{height:390px;}
   .card.mobile .t-card{width:min(248px,calc(100% - 116px));min-height:76px;}
   .card.mobile .t-thumb{flex-basis:96px;width:96px;height:64px;}
   .card.mobile .t-meta strong{font-size:11px;}
   .card.mobile .t-meta span{font-size:9px;}
   .card.mobile .tl-scale-mark span,.card.mobile .t-time{font-size:10px;}
   .card.mobile .info-row{padding-left:14px;padding-right:14px;}
   .card.mobile .stats{gap:12px;}
 }
 @media (max-width:380px){
   .card .tl-track{height:350px;}
   .card .t-card{left:104px;width:calc(100% - 114px);}
   .card .t-thumb{flex-basis:84px;width:84px;}
   .card .t-ev::before{left:91px;width:calc(100% - 91px);}
   .card .tl-playhead{left:90px;}
   .card .tl-track::before,.card .tl-track::after{left:90px;}
   .card .t-dot{left:84px;}
   .card .tl-scale-mark i{left:86px;}
   .card .tl-scale-mark span{left:10px;width:68px;}
 }

 .card .seek-from-lbl{
   position:absolute;top:14px;left:50%;transform:translateX(-50%);z-index:25;
   padding:8px 13px;border-radius:999px;
   background:rgba(28,28,30,.76);color:#0a84ff;
   border:.5px solid rgba(10,132,255,.28);
   -webkit-backdrop-filter:blur(18px) saturate(180%);backdrop-filter:blur(18px) saturate(180%);
   font-size:12px;font-weight:650;letter-spacing:-.01em;white-space:nowrap;
   pointer-events:none;transition:opacity .22s ease,transform .22s ease;
 }
 .card .seek-from-lbl[data-playing]{opacity:0;transform:translate(-50%,-5px);}
 .card .seek-from-lbl[data-blocked]{color:#ff453a;border-color:rgba(255,69,58,.3);}
 .card .rec-player .recording-video{z-index:2;}
 .card .rec-dl-bar{position:absolute;left:0;right:0;bottom:0;z-index:24;padding:10px 12px;background:linear-gradient(to top,rgba(0,0,0,.78),transparent);pointer-events:none;}
 .card .rec-dl-row{display:flex;align-items:center;justify-content:space-between;gap:10px;color:rgba(255,255,255,.78);font-size:12px;}
 .card .rec-dl-btn{pointer-events:auto;border:0;border-radius:13px;background:#0a84ff;color:#fff;padding:9px 14px;font:600 12px -apple-system,BlinkMacSystemFont,"SF Pro Display",system-ui,sans-serif;box-shadow:0 5px 18px rgba(0,0,0,.3);}
 .card .rec-dl-btn:active{transform:scale(.97);}

/* Timeline zoom controls: compact iOS segmented-control feel. */
.card .tl-zoom-controls{display:flex;align-items:center;gap:2px;padding:2px;border-radius:12px;background:rgba(118,118,128,.16);border:.5px solid rgba(255,255,255,.08);}
.card .tl-zoom-controls .tool{min-width:32px;width:32px;height:32px;min-height:32px;padding:0;border-radius:9px;background:transparent;border:0;font-size:18px;line-height:1;}
.card .tl-zoom-controls .tl-zoom-level{width:42px;min-width:42px;font-size:10px;font-weight:700;letter-spacing:-.01em;color:rgba(235,235,245,.78);}
.card .tl-zoom-controls .tool:active{background:rgba(255,255,255,.12);transform:scale(.96);}
@media (max-width:560px){
  .card .tl-head{gap:8px;}
  .card .tl-tools{gap:5px;}
  .card .tl-zoom-controls{border-radius:13px;}
  .card .tl-zoom-controls .tool{width:30px;min-width:30px;height:32px;min-height:32px;}
  .card .tl-zoom-controls .tl-zoom-level{width:40px;min-width:40px;}
  .card .tl-track{touch-action:none;user-select:none;-webkit-user-select:none;}
}

/* v9 mobile timeline: clean rail + non-overlapping preview thumbnails. */
.card .t-ev::before{left:92px;width:calc(100% - 92px);background:rgba(255,255,255,.08);}
.card .t-ev .t-dot{left:84px;top:-7px;}
.card .t-connector{position:absolute;left:92px;top:0;width:calc(100% - 92px);height:1px;background:rgba(255,255,255,.10);pointer-events:none;}
.card .t-preview{position:absolute;left:108px;width:min(260px,calc(100% - 122px));height:68px;padding:3px;border:1px solid rgba(255,255,255,.12);border-radius:13px;background:rgba(28,28,30,.82);-webkit-backdrop-filter:blur(22px) saturate(165%);backdrop-filter:blur(22px) saturate(165%);box-shadow:0 7px 24px rgba(0,0,0,.38);overflow:hidden;z-index:7;pointer-events:none;}
.card .t-preview-thumb{position:relative;width:100%;height:100%;border-radius:10px;overflow:hidden;background:#111113;}
.card .t-preview-thumb img{width:100%;height:100%;object-fit:cover;display:block;}
.card .t-preview-thumb b{position:absolute;right:5px;bottom:5px;padding:2px 5px;border-radius:6px;background:rgba(0,0,0,.68);color:#fff;font-size:9px;line-height:12px;font-weight:650;font-variant-numeric:tabular-nums;}
.card .t-preview .t-badge{position:absolute;left:6px;top:6px;max-width:calc(100% - 12px);padding:3px 7px;border-radius:999px;background:color-mix(in srgb,var(--ev-color) 78%,rgba(0,0,0,.5));border:.5px solid rgba(255,255,255,.32);color:#fff;font-size:10px;line-height:13px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.card .t-ev{z-index:6;}
.card .t-ev.selected .t-dot{box-shadow:0 0 0 3px color-mix(in srgb,var(--ev-color) 72%,transparent),0 0 0 5px rgba(10,132,255,.18);}
@media (max-width:560px){
  .card .tl-track{height:420px;overflow:hidden;overscroll-behavior:contain;-webkit-overflow-scrolling:auto;}
  .card .t-preview{left:108px;width:min(210px,calc(100% - 118px));height:68px;}
  .card .tl-scale-mark span{left:10px;width:70px;font-size:10px;}
  .card .tl-scale-mark i{left:87px;}
  .card .t-dot{left:84px;}
  .card .t-connector{left:92px;}
}


.card .rec-download-icon{width:34px;min-width:34px;height:34px;padding:0;border-radius:11px;background:rgba(118,118,128,.16);border:.5px solid rgba(255,255,255,.10);}
.card .rec-download-icon svg{width:16px;height:16px;}
.card .rec-download-icon:active{transform:scale(.94);background:rgba(10,132,255,.22);}
.card .stream-ctrl-bar{display:flex;align-items:center;justify-content:center;gap:8px;flex-wrap:nowrap;padding:8px 10px 7px;margin:6px 8px 2px;min-height:46px;border:1px solid rgba(255,255,255,.10);border-radius:17px;background:rgba(28,28,30,.54);-webkit-backdrop-filter:blur(22px) saturate(165%);backdrop-filter:blur(22px) saturate(165%);box-shadow:0 8px 24px rgba(0,0,0,.16);}
.card .stream-ctrl-bar .talk-btn{flex:0 0 auto;margin-right:2px;}
.card .stream-ctrl-bar .media-nav-group{display:inline-flex;align-items:center;gap:3px;padding:3px;border-radius:14px;background:rgba(118,118,128,.13);border:.5px solid rgba(255,255,255,.08);}
.card .media-nav-btn{min-width:38px;height:34px;padding:0 10px;border:0;border-radius:11px;background:transparent;color:var(--c-text2);font-size:11px;font-weight:700;display:inline-flex;align-items:center;justify-content:center;gap:5px;white-space:nowrap;transition:background .16s ease,color .16s ease,transform .12s ease;}
.card .media-nav-btn svg{width:16px;height:16px;flex:none;}
.card .media-nav-btn:hover{background:rgba(255,255,255,.08);color:var(--c-text);}
.card .media-nav-btn.active{background:rgba(255,255,255,.14);border:0;color:var(--c-text);box-shadow:0 1px 4px rgba(0,0,0,.16),inset 0 .5px rgba(255,255,255,.18);}
.card .media-nav-btn:active{transform:scale(.94);}
.card .rec-download-icon{width:36px;min-width:36px;height:36px;padding:0;border-radius:11px;background:rgba(118,118,128,.16);border:.5px solid rgba(255,255,255,.10);}
.card .rec-download-icon svg{width:16px;height:16px;}
.card .media-gallery{display:none;min-height:clamp(260px,42vh,560px);padding:10px 10px 14px;}
.card .media-gallery.open{display:block;}

  .card .media-gallery-head{display:flex;align-items:center;justify-content:space-between;gap:8px;margin:0 2px 9px;padding:0 2px;}
  .card .media-gallery-head-left{display:flex;align-items:center;gap:8px;min-width:0;}
  .card .media-gallery-filter-btn{display:inline-flex;align-items:center;justify-content:center;gap:5px;height:30px;padding:0 10px;border-radius:10px;border:.5px solid rgba(255,255,255,.12);background:rgba(118,118,128,.13);color:var(--c-text2);font-size:11px;font-weight:700;cursor:pointer;}
  .card .media-gallery-filter-btn svg{width:14px;height:14px;}
  .card .media-gallery-filter-btn.active{background:var(--c-acc-bg);color:var(--c-acc-text);border-color:var(--c-acc-bdr);}
  .card .media-filter-panel{display:none;margin:0 0 9px;padding:10px;border:1px solid var(--c-border2);border-radius:13px;background:rgba(28,28,30,.68);-webkit-backdrop-filter:blur(18px) saturate(165%);backdrop-filter:blur(18px) saturate(165%);}
  .card .media-filter-panel.open{display:block;}
  .card .media-filter-row{display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:7px;}
  .card .media-filter-row:last-child{margin-bottom:0;}
  .card .media-filter-label{width:54px;flex:0 0 54px;font-size:9px;color:var(--c-text3);text-transform:uppercase;letter-spacing:.05em;}
  .card .media-filter-chip{border:1px solid var(--c-border2);background:rgba(118,118,128,.10);color:var(--c-text2);border-radius:14px;padding:5px 9px;font-size:10px;font-weight:650;cursor:pointer;}
  .card .media-filter-chip.on{background:var(--c-acc);border-color:var(--c-acc);color:#fff;}
  .card .media-filter-date-control{display:inline-flex;align-items:center;gap:6px;min-height:29px;padding:0 9px;border:1px solid var(--c-border2);background:rgba(118,118,128,.10);color:var(--c-text2);border-radius:14px;cursor:pointer;}
  .card .media-filter-date-control svg{width:14px;height:14px;flex:0 0 14px;}
  .card .media-filter-date-control input{border:0;background:transparent;color:var(--c-text);font:inherit;font-size:10px;font-weight:650;outline:0;min-width:118px;cursor:pointer;color-scheme:dark;}
  .card .media-filter-date-control input::-webkit-calendar-picker-indicator{opacity:.8;filter:invert(1);cursor:pointer;}
  .card .media-filter-time-control{display:inline-flex;align-items:center;gap:5px;min-height:29px;padding:0 8px;border:1px solid var(--c-border2);background:rgba(118,118,128,.10);color:var(--c-text2);border-radius:14px;}
  .card .media-filter-time-control span{font-size:9px;color:var(--c-text3);font-weight:650;}
  .card .media-filter-time-control input{border:0;background:transparent;color:var(--c-text);font:inherit;font-size:10px;font-weight:650;outline:0;min-width:72px;cursor:pointer;color-scheme:dark;-webkit-appearance:auto;appearance:auto;}
  .card .media-filter-time-control input::-webkit-calendar-picker-indicator{opacity:.8;filter:invert(1);cursor:pointer;}
  .card .media-filter-reset-date{border:0;background:transparent;color:var(--c-acc-text);font-size:10px;font-weight:700;cursor:pointer;padding:5px 3px;}
  .card .media-filter-reset{margin-left:auto;border:0;background:transparent;color:var(--c-acc-text);font-size:10px;font-weight:700;cursor:pointer;}
  @media(max-width:700px){.card .media-gallery-filter-btn span{display:none}.card .media-filter-label{width:48px;flex-basis:48px}.card .media-filter-chip{padding:5px 8px;}}

.card .media-gallery-title{font-size:13px;font-weight:750;letter-spacing:-.15px;}
.card .media-gallery-count{font-size:11px;color:var(--c-text2);font-variant-numeric:tabular-nums;}
/* Keep galleries compact: show roughly five media rows by default, with the list itself scrolling.
   The filter/header remain fixed so browsing many clips/recordings does not make the card grow indefinitely. */
.card .media-gallery-grid{display:flex;flex-direction:column;gap:0;max-height:360px;overflow-y:auto;overflow-x:hidden;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;scrollbar-width:thin;padding-right:2px;}
.card .media-gallery-grid .ec,.card .media-gallery-grid .rec,.card .media-gallery-grid .rev{min-width:0;width:100%;box-sizing:border-box;margin-bottom:6px;flex:0 0 auto;}
.card .media-gallery-grid::-webkit-scrollbar{width:7px;}
.card .media-gallery-grid::-webkit-scrollbar-track{background:transparent;}
.card .media-gallery-grid::-webkit-scrollbar-thumb{background:rgba(255,255,255,.16);border-radius:999px;}
.card .media-gallery-grid::-webkit-scrollbar-thumb:hover{background:rgba(255,255,255,.24);}
@media(max-width:700px){.card .media-gallery-grid{max-height:340px;padding-right:1px;}}
.card .media-gallery-grid .empty-state{width:100%;box-sizing:border-box;}
.card .media-gallery-grid .rev{min-height:56px;}
.card .media-gallery-grid .rev-th{width:64px;height:48px;flex:0 0 64px;overflow:hidden;border-radius:9px;}
.card .media-gallery-grid .rev-th img{width:100%;height:100%;display:block;object-fit:cover;}
.card .media-gallery-grid .rev-inf{min-width:0;}
@media(max-width:700px){.card .stream-ctrl-bar{margin-left:4px;margin-right:4px;padding-left:7px;padding-right:7px;gap:6px}.card .media-nav-btn{min-width:34px;padding:0 7px}.card .media-nav-btn span{display:none}.card .stream-ctrl-bar .media-nav-group{gap:1px}.card .media-gallery{padding-left:4px;padding-right:4px;}}

.card .stream-ctrl-bar{min-height:40px;margin-top:6px;margin-bottom:2px;}
.card .rec-dl-bar{display:none!important;}
/* Wide cards keep the media gallery aligned with the main content column. */
@media (min-width:561px){
  .card.wide .tl-track{height:340px;}
  .card.wide .col-left{width:100%;}
}
/* ── v11 mobile NVR timeline: Scrypted-inspired ribbon + thumbnail rail ── */
  .config-error{padding:18px 20px;display:flex;flex-direction:column;gap:5px;background:rgba(255,59,48,.10);border-bottom:.5px solid rgba(255,59,48,.28);color:var(--c-text);font-size:13px;}
  .config-error strong{font-size:14px;} .config-error span{color:var(--c-text2);font-size:12px;}
  .tl-zoom-controls{display:flex;align-items:center;gap:0;border:.5px solid var(--c-border2);border-radius:12px;overflow:hidden;background:rgba(255,255,255,.055);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);}
  .tl-zoom-controls .tool{border:0;border-radius:0;width:32px;height:32px;min-width:32px;padding:0;}
  .tl-zoom-controls .tl-zoom-level{width:42px;min-width:42px;font-size:10px;font-weight:700;color:var(--c-text2);border-left:.5px solid var(--c-border);border-right:.5px solid var(--c-border);}
  .card .tl-track.vertical{height:440px;background:linear-gradient(90deg,rgba(5,12,20,.98),rgba(7,17,28,.96));border-radius:0;overflow:hidden;}
  .card .tl-track.vertical::before{display:none;}
  .card .tl-track.vertical::after{content:'';position:absolute;left:92px;top:0;bottom:0;width:1px;background:rgba(255,255,255,.13);z-index:0;}
  .card .tl-track .t-rec{position:absolute;left:88px;width:8px;min-height:3px;border-radius:999px;background:var(--rec-color,var(--c-acc));opacity:.62;box-shadow:0 0 8px color-mix(in srgb,var(--rec-color,var(--c-acc)) 55%,transparent);z-index:1;}
  .card .tl-scale-mark{position:absolute;left:0;right:0;height:1px;z-index:2;pointer-events:none;}
  .card .tl-scale-mark span{position:absolute;left:10px;top:-8px;width:68px;color:var(--c-text3);font-size:11px;font-variant-numeric:tabular-nums;white-space:nowrap;text-align:left;}
  .card .tl-scale-mark.hour span{color:var(--c-text2);font-weight:650;}
  .card .tl-scale-mark i{position:absolute;left:87px;top:0;width:11px;height:1px;background:rgba(255,255,255,.17);}
  .card .tl-scale-mark.hour i{width:18px;background:rgba(255,255,255,.28);}
  .card .t-ev{position:absolute;left:0;width:100%;height:1px;transform:none;background:none;border:0;padding:0;margin:0;z-index:5;cursor:pointer;}
  .card .t-ev .t-dot{position:absolute;left:81px;top:-7px;width:16px;height:16px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:var(--ev-color,#bf5af2);border:2px solid #07111c;box-shadow:0 0 0 2px color-mix(in srgb,var(--ev-color,#bf5af2) 78%,transparent);}
  .card .t-ev .t-dot b{font-size:8px;line-height:1;color:#fff;font-weight:800;}
  .card .t-ev .t-connector{position:absolute;left:96px;top:0;width:calc(100% - 96px);height:1px;background:rgba(255,255,255,.10);}
  .card .t-ev.selected .t-dot{width:20px;height:20px;left:79px;top:-9px;border-color:#07111c;box-shadow:0 0 0 2px var(--ev-color,#0a84ff),0 0 0 5px rgba(10,132,255,.18);}
  .card .t-preview{position:absolute;left:110px;width:min(205px,calc(100% - 122px));height:92px;padding:3px;border:1px solid rgba(255,255,255,.13);border-radius:14px;background:rgba(28,28,30,.76);-webkit-backdrop-filter:blur(20px) saturate(170%);backdrop-filter:blur(20px) saturate(170%);box-shadow:0 8px 28px rgba(0,0,0,.38);overflow:hidden;z-index:7;pointer-events:none;}
  .card .t-preview-thumb{position:relative;width:100%;height:100%;border-radius:11px;overflow:hidden;background:#111113;}
  .card .t-preview-thumb img{width:100%;height:100%;object-fit:cover;display:block;}
  .card .t-preview .t-badge{position:absolute;left:7px;top:7px;max-width:calc(100% - 14px);padding:3px 8px;border-radius:999px;background:color-mix(in srgb,var(--ev-color) 82%,rgba(0,0,0,.4));border:.5px solid rgba(255,255,255,.32);color:#fff;font-size:10px;line-height:13px;font-weight:750;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
  .card .t-preview .t-preview-time{position:absolute;left:7px;bottom:6px;padding:2px 6px;border-radius:6px;background:rgba(0,0,0,.58);color:#fff;font-size:9px;line-height:12px;font-variant-numeric:tabular-nums;}
  .card .t-preview b{position:absolute;right:6px;bottom:6px;padding:2px 6px;border-radius:6px;background:rgba(0,0,0,.62);color:#fff;font-size:9px;line-height:12px;font-weight:650;font-variant-numeric:tabular-nums;}
  .card .tl-playhead{position:absolute;left:0;right:0;top:50%;height:2px;background:#0a84ff;z-index:10;box-shadow:0 0 7px rgba(10,132,255,.65);pointer-events:none;}
  .card .tl-playhead i{position:absolute;left:79px;top:-10px;width:20px;height:20px;border-radius:50%;background:#0a84ff;border:3px solid #07111c;box-shadow:0 0 0 1px rgba(10,132,255,.5),0 2px 8px rgba(10,132,255,.35);pointer-events:auto;touch-action:none;cursor:ns-resize;z-index:2;}
  .card .tl-playhead span{position:absolute;left:95px;top:0;height:100%;width:calc(100% - 95px);background:#0a84ff;opacity:.95;}
  @media (max-width:560px){
    .card .tl-sec{padding:9px 0 0;} .card .tl-head{padding:0 12px 8px;} .card .tl-tools{gap:5px;}
    .card .tl-track.vertical{height:460px;}
    .card .t-preview{left:110px;width:min(210px,calc(100% - 120px));height:94px;}
    .card .tl-scale-mark span{left:9px;width:69px;font-size:10px;} .card .tl-scale-mark i{left:87px;}
    .card .tl-track.vertical::after{left:92px;} .card .tl-track .t-rec{left:88px;}
    .card .t-ev .t-dot{left:81px;} .card .t-ev .t-connector{left:96px;}
    .card .tl-playhead i{left:79px;} .card .tl-playhead span{left:95px;}
  }


/* ─────────────────────────────────────────────────────────────
   Editorial Black
   Final visual layer only. Playback, Frigate queries, timeline math,
   microphone/talk, filters, camera switching and event handlers are unchanged.
   The UI intentionally avoids decorative gradients and excessive glass.
   ───────────────────────────────────────────────────────────── */
.card,
.card.theme-light,
.card.theme-auto{
  --c-bg:#000;
  --c-bg-deep:#000;
  --c-bg-panel:#0d0d0f;
  --c-bg-panel2:#151518;
  --c-hairline:rgba(255,255,255,.09);
  --c-border:rgba(255,255,255,.08);
  --c-border2:rgba(255,255,255,.11);
  --c-text:#f5f5f7;
  --c-text2:rgba(245,245,247,.68);
  --c-text3:rgba(245,245,247,.44);
  --c-text4:rgba(245,245,247,.28);
  background:#000 !important;
  color:var(--c-text) !important;
  border:1px solid rgba(255,255,255,.08) !important;
  border-radius:18px !important;
  box-shadow:0 10px 32px rgba(0,0,0,.34) !important;
  -webkit-backdrop-filter:none !important;
  backdrop-filter:none !important;
}
.card::before{display:none !important;}
.card .layout,.card .col-left,.card .feed-area,.card .tl-sec,.card .info-row,.card .latest{background:#000 !important;}

/* Stream gets a precise inset frame instead of a glossy hero treatment. */
.card #eng-wrap,
.card .cam-grid{
  background:#000 !important;
  border-radius:14px !important;
  overflow:hidden !important;
  box-shadow:inset 0 0 0 1px rgba(255,255,255,.08) !important;
}
.card .feed-area{padding:8px 8px 0;box-sizing:border-box;}
.card .feed-top{top:18px;left:18px;right:18px;}
.card .btn{
  background:rgba(18,18,20,.90) !important;
  border:1px solid rgba(255,255,255,.12) !important;
  border-radius:10px !important;
  box-shadow:0 2px 8px rgba(0,0,0,.28) !important;
  -webkit-backdrop-filter:blur(12px) !important;
  backdrop-filter:blur(12px) !important;
}

/* Navigation: compact, calm, and intentionally closer to a native media app. */
.card .stream-ctrl-bar{
  margin:8px 0 0 !important;
  padding:8px 10px !important;
  min-height:48px !important;
  border:0 !important;
  border-top:1px solid rgba(255,255,255,.07) !important;
  border-bottom:1px solid rgba(255,255,255,.07) !important;
  border-radius:0 !important;
  background:#070708 !important;
  box-shadow:none !important;
  -webkit-backdrop-filter:none !important;
  backdrop-filter:none !important;
}
.card .stream-ctrl-bar .media-nav-group{
  gap:2px !important;
  padding:3px !important;
  border:1px solid rgba(255,255,255,.08) !important;
  border-radius:11px !important;
  background:#111113 !important;
}
.card .media-nav-btn{
  height:34px !important;
  min-width:42px !important;
  padding:0 11px !important;
  border-radius:8px !important;
  color:rgba(245,245,247,.58) !important;
  font-size:11px !important;
  font-weight:650 !important;
  letter-spacing:-.01em !important;
  box-shadow:none !important;
}
.card .media-nav-btn:hover{background:#1b1b1e !important;color:#fff !important;}
.card .media-nav-btn.active{
  background:#f5f5f7 !important;
  color:#09090a !important;
  box-shadow:none !important;
}
.card .scb-btn{
  background:#111113 !important;
  border:1px solid rgba(255,255,255,.10) !important;
  box-shadow:none !important;
  -webkit-backdrop-filter:none !important;
  backdrop-filter:none !important;
}

/* Timeline: black canvas, quiet guides, stronger hierarchy. */
.card .tl-sec{padding:12px 8px 10px !important;border-bottom:1px solid rgba(255,255,255,.07) !important;}
.card .tl-head{padding:0 6px 10px !important;}
.card .tl-head #tl-range{
  font-size:12px !important;
  font-weight:620 !important;
  letter-spacing:-.01em !important;
  color:rgba(245,245,247,.60) !important;
}
.card .tool{
  background:#101012 !important;
  border:1px solid rgba(255,255,255,.09) !important;
  border-radius:9px !important;
  box-shadow:none !important;
  -webkit-backdrop-filter:none !important;
  backdrop-filter:none !important;
}
.card .tool:hover{background:#1a1a1d !important;border-color:rgba(255,255,255,.16) !important;box-shadow:none !important;}
.card .tl-track,
.card .tl-track.vertical{
  background:#060608 !important;
  border:1px solid rgba(255,255,255,.07) !important;
  border-radius:12px !important;
  box-shadow:inset 0 1px 0 rgba(255,255,255,.025) !important;
}
.card .tl-track::before{background:rgba(255,255,255,.075) !important;}
.card .tl-track::after{opacity:.5 !important;}
.card .t-preview{
  background:#111113 !important;
  border:1px solid rgba(255,255,255,.10) !important;
  border-radius:11px !important;
  box-shadow:0 6px 18px rgba(0,0,0,.34) !important;
  -webkit-backdrop-filter:none !important;
  backdrop-filter:none !important;
}
.card .t-preview-thumb{border-radius:8px !important;background:#09090a !important;}
.card .t-preview .t-badge{
  border:0 !important;
  border-radius:6px !important;
  padding:3px 6px !important;
  font-size:9px !important;
  text-transform:uppercase !important;
  letter-spacing:.035em !important;
}
.card .legend{padding:9px 6px 0 !important;}
.card .lg{
  padding:3px 7px !important;
  border:0 !important;
  border-radius:6px !important;
  background:#101012 !important;
  color:rgba(245,245,247,.42) !important;
}

/* Browser: simple header + four-row viewport. */
.card .media-gallery{
  min-height:0 !important;
  padding:12px 6px 8px !important;
  background:#000 !important;
}
.card .media-gallery-head{
  min-height:38px !important;
  margin:0 2px 10px !important;
  padding:0 4px !important;
}
.card .media-gallery-head .section-label{
  font-size:15px !important;
  line-height:20px !important;
  font-weight:650 !important;
  text-transform:none !important;
  letter-spacing:-.015em !important;
  color:#f5f5f7 !important;
}
.card .media-gallery-count{
  min-width:26px !important;
  height:22px !important;
  display:inline-flex !important;
  align-items:center !important;
  justify-content:center !important;
  padding:0 7px !important;
  border-radius:999px !important;
  background:#141416 !important;
  color:rgba(245,245,247,.52) !important;
  font-size:10px !important;
  font-weight:650 !important;
}
.card .media-gallery-filter-btn{
  height:30px !important;
  padding:0 9px !important;
  border-radius:8px !important;
  background:#111113 !important;
  border:1px solid rgba(255,255,255,.09) !important;
  color:rgba(245,245,247,.58) !important;
  font-weight:620 !important;
}
.card .media-gallery-filter-btn:hover{background:#19191c !important;color:#fff !important;}
.card .media-gallery-filter-btn.active{background:var(--c-acc-bg) !important;border-color:var(--c-acc-bdr) !important;color:var(--c-acc-text) !important;}
.card .media-filter-panel{
  margin:0 0 10px !important;
  padding:10px !important;
  background:#0c0c0e !important;
  border:1px solid rgba(255,255,255,.08) !important;
  border-radius:10px !important;
  -webkit-backdrop-filter:none !important;
  backdrop-filter:none !important;
}
.card .media-filter-chip,.card .media-filter-date-control{
  background:#141416 !important;
  border:1px solid rgba(255,255,255,.09) !important;
  border-radius:8px !important;
}
.card .media-filter-chip.on{background:var(--c-acc) !important;border-color:var(--c-acc) !important;}

/* Exactly four browser rows are visible before scrolling. */
.card .media-gallery-grid{
  --media-row-h:76px;
  --media-row-gap:7px;
  height:calc((var(--media-row-h) * 4) + (var(--media-row-gap) * 3)) !important;
  max-height:none !important;
  display:flex !important;
  flex-direction:column !important;
  gap:var(--media-row-gap) !important;
  overflow-y:auto !important;
  overflow-x:hidden !important;
  padding:0 3px 0 0 !important;
  scroll-snap-type:y proximity;
  scrollbar-width:thin;
  scrollbar-color:rgba(255,255,255,.18) transparent;
}
.card .media-gallery-grid::-webkit-scrollbar{width:5px !important;}
.card .media-gallery-grid::-webkit-scrollbar-thumb{background:rgba(255,255,255,.18) !important;border-radius:999px !important;}
.card .media-gallery-grid .ec,
.card .media-gallery-grid .rec,
.card .media-gallery-grid .rev{
  height:var(--media-row-h) !important;
  min-height:var(--media-row-h) !important;
  max-height:var(--media-row-h) !important;
  flex:0 0 var(--media-row-h) !important;
  box-sizing:border-box !important;
  margin:0 !important;
  scroll-snap-align:start;
  padding:9px 10px !important;
  gap:10px !important;
  border:1px solid rgba(255,255,255,.075) !important;
  border-radius:11px !important;
  background:#0d0d0f !important;
  box-shadow:none !important;
  overflow:hidden !important;
}
.card .media-gallery-grid .ec:hover,
.card .media-gallery-grid .rec:hover,
.card .media-gallery-grid .rev:hover{
  background:#151518 !important;
  border-color:rgba(255,255,255,.14) !important;
}
.card .media-gallery-grid .et{
  width:80px !important;
  height:56px !important;
  border-radius:8px !important;
  background:#050506 !important;
}
.card .media-gallery-grid .rev-th{
  width:80px !important;
  height:56px !important;
  flex:0 0 80px !important;
  border-radius:8px !important;
  background:#050506 !important;
}
.card .media-gallery-grid .ric{
  width:44px !important;
  height:44px !important;
  border-radius:9px !important;
  background:#151518 !important;
}
.card .media-gallery-grid .ric svg{width:17px !important;height:17px !important;}
.card .media-gallery-grid .rt,
.card .media-gallery-grid .rev-t{
  font-size:12px !important;
  line-height:16px !important;
  font-weight:620 !important;
  letter-spacing:-.01em !important;
  white-space:nowrap !important;
  overflow:hidden !important;
  text-overflow:ellipsis !important;
}
.card .media-gallery-grid .rsub,
.card .media-gallery-grid .rev-m,
.card .media-gallery-grid .em{
  font-size:10px !important;
  color:rgba(245,245,247,.42) !important;
}
.card .media-gallery-grid .etop{margin-bottom:3px !important;gap:4px !important;flex-wrap:nowrap !important;overflow:hidden !important;}
.card .media-gallery-grid .eact{gap:3px !important;}
.card .media-gallery-grid .ico{width:32px !important;height:32px !important;border-radius:8px !important;background:#151518 !important;}
.card .media-gallery-grid .ico svg{width:13px !important;height:13px !important;}
.card .media-gallery-grid .empty-state{
  height:100% !important;
  min-height:100% !important;
  justify-content:center !important;
  background:#080809 !important;
  border:1px solid rgba(255,255,255,.06) !important;
  border-radius:11px !important;
}

/* Supporting rows. */
.card .info-row{
  padding:13px 14px !important;
  border-bottom:1px solid rgba(255,255,255,.07) !important;
}
.card .info-title{font-size:14px !important;font-weight:640 !important;letter-spacing:-.015em !important;}
.card .info-sub{font-size:11px !important;color:rgba(245,245,247,.38) !important;}
.card .stat{gap:1px;}
.card .sv{font-size:13px !important;}
.card .sl{font-size:9px !important;letter-spacing:.05em !important;}
.card .cam-switcher{
  padding:8px 10px !important;
  background:#070708 !important;
  border-bottom:1px solid rgba(255,255,255,.07) !important;
}
.card .cam-tabs{background:#111113 !important;border-radius:10px !important;}
.card .cam-tab{border-radius:7px !important;font-size:11px !important;}
.card .cam-tab.active{background:#242427 !important;box-shadow:none !important;color:#fff !important;}
.card .latest{border-bottom:0 !important;}
.card .latest-label{padding:10px 14px 6px !important;}
.card .latest-body{padding:0 10px 10px !important;}
.card .latest .ec{background:#0d0d0f !important;border:1px solid rgba(255,255,255,.075) !important;border-radius:11px !important;}

/* Remove the bright/glassy treatment from ordinary list rows outside browser too. */
.card .list-sec{background:#000 !important;}
.card .list .ec,.card .list .rec,.card .list .rev{
  background:#0d0d0f !important;
  border-color:rgba(255,255,255,.075) !important;
  border-radius:11px !important;
  box-shadow:none !important;
}

@media(max-width:560px){
  .card{border-radius:14px !important;}
  .card .feed-area{padding:5px 5px 0 !important;}
  .card #eng-wrap,.card .cam-grid{border-radius:10px !important;}
  .card .stream-ctrl-bar{padding-left:5px !important;padding-right:5px !important;}
  .card .media-nav-btn{min-width:36px !important;padding:0 8px !important;}
  .card .media-gallery{padding-left:4px !important;padding-right:4px !important;}
  .card .media-gallery-grid{--media-row-h:72px;--media-row-gap:6px;}
  .card .media-gallery-grid .et,
  .card .media-gallery-grid .rev-th{width:72px !important;height:52px !important;flex-basis:72px !important;}
  .card .media-gallery-grid .ec,
  .card .media-gallery-grid .rec,
  .card .media-gallery-grid .rev{padding:8px !important;}
  .card .media-gallery-grid .eact .ico:nth-child(n+3){display:none !important;}
}

/* lean timeline chrome + explicit recording gaps. */
.card .tl-head #tl-range{display:none !important;}
.card .info-row,.card .latest{display:none !important;}
.card .tl-head{justify-content:flex-end !important;}
.card .tl-head::before{margin-right:auto;}
.card .tl-no-recording{
  position:absolute;
  left:calc(var(--tl-rail) - 3px);
  width:6px;
  min-height:3px;
  border-radius:999px;
  background:#ff453a;
  box-shadow:0 0 8px rgba(255,69,58,.42);
  z-index:4;
  pointer-events:none;
}
.card .tl-no-recording span{
  position:absolute;
  left:13px;
  top:50%;
  transform:translateY(-50%);
  white-space:nowrap;
  color:#ff6961;
  font-size:10px;
  font-weight:700;
  letter-spacing:.01em;
  text-shadow:0 1px 2px #000,0 0 8px #000;
}
@media(max-width:420px){
  .card .tl-no-recording span{font-size:9px;left:11px;}
}

`;

// ── src/styles/shell.js ──
/**
 * Shell-level CSS that complements the reusable base card stylesheet.
 *
 * The order is intentionally preserved from the original render template: the
 * status overlay rules come first, then the base STYLES block, followed by
 * responsive/playback overrides. Keeping CSS outside the DOM renderer makes
 * _renderShell() readable without changing cascade behavior.
 */
const SHELL_STYLES = `
/* Friendly camera/status overlays */
.status-overlay {
  position:absolute;
  inset:0;
  z-index:80;
  display:flex;
  align-items:center;
  justify-content:center;
  pointer-events:none;
  background:rgba(8,10,14,.30);
  backdrop-filter:blur(7px) saturate(.85);
  -webkit-backdrop-filter:blur(7px) saturate(.85);
  opacity:1;
  transition:opacity .22s ease;
}
.status-overlay.hidden { opacity:0; visibility:hidden; }
.status-card {
  min-width:190px;
  max-width:78%;
  padding:14px 18px;
  border-radius:18px;
  background:rgba(22,24,29,.78);
  border:1px solid rgba(255,255,255,.12);
  box-shadow:0 12px 38px rgba(0,0,0,.28);
  color:#fff;
  text-align:center;
  font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","SF Pro Text",sans-serif;
}
.status-icon {
  width:34px;height:34px;margin:0 auto 8px;
  border-radius:50%;
  display:grid;place-items:center;
  background:rgba(255,255,255,.10);
  font-size:17px;
}
.status-title { font-size:15px;font-weight:650;letter-spacing:-.1px; }
.status-detail { margin-top:4px;font-size:12px;line-height:1.35;color:rgba(255,255,255,.68); }
.status-spinner {
  width:25px;height:25px;margin:0 auto 9px;border-radius:50%;
  border:2px solid rgba(255,255,255,.22);
  border-top-color:#fff;
  animation:frigateStatusSpin .75s linear infinite;
}
@keyframes frigateStatusSpin { to { transform:rotate(360deg); } }
.status-retry {
  pointer-events:auto;
  margin-top:11px;padding:7px 13px;border:0;border-radius:11px;
  background:rgba(255,255,255,.14);color:#fff;font:600 12px -apple-system,BlinkMacSystemFont,sans-serif;
}
${STYLES}
/* v14 Scrypted-style centered timeline layout */
/* v21 timeline polish: stable detection clusters and object metadata */
.card .t-dot{position:relative;}
.card .t-dot em{position:absolute;right:-9px;top:-8px;min-width:15px;height:15px;padding:0 3px;border-radius:999px;background:rgba(28,28,32,.96);border:.5px solid rgba(255,255,255,.28);color:#fff;font:700 8px/14px -apple-system,BlinkMacSystemFont,"SF Pro Text",system-ui,sans-serif;text-align:center;font-style:normal;}
.card .t-sub{position:absolute;left:7px;top:32px;padding:2px 5px;border-radius:5px;background:rgba(0,0,0,.52);color:rgba(255,255,255,.92);font-size:8px;line-height:11px;max-width:calc(100% - 14px);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.card .t-count{position:absolute;right:7px;bottom:7px;padding:3px 6px;border-radius:6px;background:rgba(0,0,0,.62);color:#fff;font-size:8px;font-weight:650;font-variant-numeric:tabular-nums;}
.card .t-preview-thumb img{content-visibility:auto;}
.card .t-ev{contain:layout paint;}
 .card .t-preview{contain:layout paint;}
 /* Scrypted-inspired visual pass: black timeline canvas, quiet gutter,
    bright blue selected-time rail, and compact detection-story cards. */
 .card .tl-sec{background:#050607;}
 .card .tl-track{background:
   radial-gradient(circle at 50% 50%,rgba(17,35,55,.34),transparent 42%),
   linear-gradient(180deg,#030507 0%,#07111a 100%);}
 .card .tl-track::before{background:linear-gradient(180deg,rgba(255,255,255,.04),rgba(255,255,255,.09) 50%,rgba(255,255,255,.04));}
 .card .tl-scale-mark span{color:rgba(235,235,245,.42);font-weight:600;}
 .card .t-rec{filter:drop-shadow(0 0 3px rgba(10,132,255,.22));}
 .card .t-preview{border-color:rgba(255,255,255,.16);background:rgba(18,20,23,.88);box-shadow:0 10px 30px rgba(0,0,0,.42);}
 .card .t-preview:hover{border-color:rgba(10,132,255,.4);}
 .card .t-dot{box-shadow:0 0 0 2px color-mix(in srgb,var(--ev-color,#0a84ff) 78%,transparent),0 2px 8px rgba(0,0,0,.42);}
 .card .t-ev.selected .t-dot{box-shadow:0 0 0 3px var(--ev-color,#0a84ff),0 0 0 6px rgba(10,132,255,.16),0 2px 10px rgba(0,0,0,.42);}
.card .tl-playhead i{position:absolute;left:84px;top:50%;width:10px;height:10px;transform:translate(-50%,-50%);border-radius:50%;background:#0a84ff;box-shadow:0 0 0 3px rgba(10,132,255,.22),0 1px 5px rgba(0,0,0,.45);}
.card .tl-playhead span{position:absolute;left:104px;top:-15px;padding:4px 8px;border-radius:8px;background:rgba(10,132,255,.94);color:#fff;font:650 10px -apple-system,BlinkMacSystemFont,"SF Pro Text",system-ui,sans-serif;font-variant-numeric:tabular-nums;box-shadow:0 3px 10px rgba(0,0,0,.25);}
.card .t-preview{left:108px;width:min(260px,calc(100% - 122px));height:clamp(78px,11vw,108px);}
.card .t-preview-thumb img{object-position:center;}
.card .t-badge{left:7px;top:7px;right:auto;bottom:auto;padding:4px 8px;border-radius:999px;background:rgba(10,132,255,.88);border:.5px solid rgba(255,255,255,.28);font-size:10px;line-height:13px;font-weight:750;max-width:calc(100% - 14px);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.card .t-preview-time{position:absolute;left:7px;bottom:7px;padding:3px 6px;border-radius:6px;background:rgba(0,0,0,.65);color:#fff;font-size:9px;font-weight:650;font-variant-numeric:tabular-nums;}
@media (min-width:760px){
 .card .tl-track{height:clamp(420px,58vh,720px);max-height:720px;}
 .card .t-preview{left:124px;width:min(340px,calc(100% - 142px));height:clamp(92px,10vw,126px);border-radius:15px;}
 .card .tl-track::before,.card .tl-track::after{left:104px;}
 .card .t-rec{left:100px!important;width:9px!important;}
 .card .tl-scale-mark i{left:100px;}
 .card .t-dot{left:98px;}
 .card .t-ev::before{left:104px;}
 .card .t-time{width:78px;}
 .card .tl-playhead i{left:98px;}
 .card .tl-playhead span{left:112px;}
}
@media (max-width:480px){
 .card .tl-track{height:clamp(360px,58vh,560px);}
 .card .t-preview{left:104px;width:calc(100% - 114px);height:78px;border-radius:12px;}
 .card .t-card{left:104px;}
}

/* ─────────────────────────────────────────────────────────────
   Refined timeline + timeline-only mobile card
   The timeline is now the visual endpoint of the card. Everything
   rendered after the legend is intentionally hidden.
   ───────────────────────────────────────────────────────────── */

/* Remove the post-timeline 30% of the card without touching the
   timeline's data, scrubbing, playback, filters or event handling. */
.card .media-gallery,
.card .info-row,
.card .cam-switcher,
.card .latest {
  display:none !important;
}

/* Keep the timeline visually self-contained. */
.card .tl-sec {
  border-bottom:0 !important;
  padding-bottom:10px;
}

.card .timeline-view {
  position:relative;
}

/* Premium, quieter header controls. */
.card .tl-head {
  margin-bottom:10px;
}

.card .tl-head #tl-range {
  color:rgba(235,235,245,.62);
  font-weight:650;
  letter-spacing:-.01em;
  font-variant-numeric:tabular-nums;
}

.card .tl-tools {
  align-items:center;
}

.card .tool {
  transition:
    background .18s ease,
    border-color .18s ease,
    box-shadow .18s ease,
    transform .12s ease;
}

.card .tool:hover {
  background:rgba(255,255,255,.08);
  border-color:rgba(255,255,255,.20);
  box-shadow:0 4px 16px rgba(0,0,0,.20);
}

.card .tool:active {
  transform:scale(.96);
}

/* Refined timeline surface: less flat, more depth, still very dark. */
.card .tl-track {
  background:
    radial-gradient(circle at 58% 48%, rgba(10,132,255,.055), transparent 44%),
    linear-gradient(180deg, #050b12 0%, #07111b 48%, #050b12 100%) !important;
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,.035),
    inset 0 -1px 0 rgba(255,255,255,.025);
}

/* A softer event rail. */
.card .tl-track::before {
  background:rgba(255,255,255,.105);
}

.card .tl-track::after {
  background:linear-gradient(
    to bottom,
    transparent 0%,
    rgba(255,255,255,.15) 14%,
    rgba(255,255,255,.15) 86%,
    transparent 100%
  );
}

/* Make the event connectors feel deliberate rather than noisy. */
.card .t-ev::before {
  background:rgba(255,255,255,.065);
}

.card .tl-scale-mark span,
.card .t-time {
  color:rgba(235,235,245,.46);
  font-weight:500;
  letter-spacing:-.01em;
}

.card .tl-scale-mark.hour span {
  color:rgba(235,235,245,.72);
  font-weight:650;
}

.card .tl-scale-mark i {
  background:rgba(255,255,255,.075);
}

.card .tl-scale-mark.hour i {
  background:rgba(255,255,255,.20);
}

/* Cleaner event dots with a restrained halo. */
.card .t-dot {
  border-color:#07111b;
  box-shadow:
    0 0 0 2px color-mix(in srgb,var(--ev-color) 48%,transparent),
    0 2px 7px rgba(0,0,0,.34);
}

/* Elegant blue scrubber/current-time line. */
.card .tl-playhead {
  background:linear-gradient(90deg,rgba(10,132,255,.82),#0a84ff) !important;
  box-shadow:
    0 0 0 1px rgba(10,132,255,.06),
    0 0 10px rgba(10,132,255,.32);
}

.card .tl-playhead i {
  box-shadow:
    0 0 0 3px rgba(10,132,255,.18),
    0 2px 8px rgba(0,0,0,.30);
}

/* Legend becomes a subtle footer instead of a second content block. */
.card .legend {
  padding:10px 14px 2px !important;
  gap:6px !important;
}

.card .lg {
  padding:5px 9px !important;
  border:1px solid rgba(255,255,255,.075) !important;
  background:rgba(255,255,255,.045) !important;
  color:rgba(235,235,245,.56) !important;
  box-shadow:inset 0 1px 0 rgba(255,255,255,.025);
  -webkit-backdrop-filter:blur(12px);
  backdrop-filter:blur(12px);
}

@media (max-width:700px) {
  .card .tl-sec {
    padding-top:12px;
    padding-bottom:8px;
    background:#000;
  }

  .card .tl-head {
    padding-bottom:10px;
  }

  .card .tl-track {
    border-radius:16px !important;
    margin:0 8px !important;
    height:clamp(360px,58vh,560px);
    border:1px solid rgba(255,255,255,.055);
    box-shadow:
      inset 0 1px 0 rgba(255,255,255,.035),
      inset 0 -1px 0 rgba(255,255,255,.02),
      0 8px 30px rgba(0,0,0,.22);
  }

  /* Keep the rail aligned after giving the surface breathing room. */
  .card .tl-track::before,
  .card .tl-track::after {
    left:83px;
  }

  .card .t-rec {
    left:79px !important;
  }

  .card .tl-scale-mark i {
    left:79px;
  }

  .card .t-ev::before {
    left:84px;
    width:calc(100% - 84px);
  }

  .card .t-dot {
    left:77px;
  }

  .card .t-time,
  .card .tl-scale-mark span {
    left:10px;
  }

  .card .tl-playhead {
    left:83px;
  }

  .card .tl-playhead i {
    left:-7px;
  }

  .card .legend {
    padding:9px 14px 2px !important;
  }
}

@media (max-width:380px) {
  .card .tl-track {
    margin:0 6px !important;
  }

  .card .tl-track::before,
  .card .tl-track::after {
    left:84px;
  }

  .card .t-rec {
    left:80px !important;
  }

  .card .tl-scale-mark i {
    left:80px;
  }

  .card .t-dot {
    left:78px;
  }

  .card .t-ev::before {
    left:85px;
    width:calc(100% - 85px);
  }

  .card .tl-playhead {
    left:84px;
  }
}


/* ─────────────────────────────────────────────────────────────
   Liquid Glass design overhaul
   Visual-only layer. Interaction, data loading, playback, WebRTC,
   microphone lifecycle, timeline math and event handlers are unchanged.
   The goal is an Apple/HIG-inspired layered material system: translucent
   surfaces, specular highlights, restrained depth, optical spacing and
   spring-like feedback without changing the DOM contract.
   ───────────────────────────────────────────────────────────── */

:host{
  --lg-surface:rgba(28,28,32,.72);
  --lg-surface-strong:rgba(34,34,38,.82);
  --lg-stroke:rgba(255,255,255,.14);
  --lg-stroke-soft:rgba(255,255,255,.075);
  --lg-highlight:rgba(255,255,255,.18);
  --lg-shadow:0 18px 55px rgba(0,0,0,.34);
}

.card{
  position:relative;
  isolation:isolate;
  border-radius:26px !important;
  background:
    radial-gradient(120% 75% at 50% -12%,rgba(255,255,255,.095),transparent 48%),
    linear-gradient(145deg,rgba(255,255,255,.045),transparent 36%),
    rgba(18,18,21,.76) !important;
  border:1px solid rgba(255,255,255,.12) !important;
  box-shadow:
    0 1px 0 rgba(255,255,255,.08) inset,
    0 -1px 0 rgba(0,0,0,.30) inset,
    0 24px 70px rgba(0,0,0,.32),
    0 3px 14px rgba(0,0,0,.24) !important;
  -webkit-backdrop-filter:blur(42px) saturate(175%);
  backdrop-filter:blur(42px) saturate(175%);
}

/* A very subtle glass sheen that stays above all card content without
   intercepting gestures. */
.card::before{
  content:'';
  position:absolute;
  z-index:100;
  inset:0;
  border-radius:inherit;
  pointer-events:none;
  background:
    linear-gradient(180deg,rgba(255,255,255,.075),transparent 15%,transparent 82%,rgba(255,255,255,.018)),
    radial-gradient(80% 30% at 50% 0,rgba(255,255,255,.06),transparent 72%);
  mix-blend-mode:screen;
  opacity:.65;
}

.card.theme-light{
  background:
    radial-gradient(120% 70% at 50% -10%,rgba(255,255,255,.92),transparent 52%),
    linear-gradient(145deg,rgba(255,255,255,.78),rgba(242,242,247,.78)) !important;
  border-color:rgba(0,0,0,.10) !important;
  box-shadow:
    0 1px 0 rgba(255,255,255,.85) inset,
    0 -1px 0 rgba(0,0,0,.06) inset,
    0 22px 60px rgba(0,0,0,.16) !important;
}

/* ── Hero stream: a separate glass viewport inside the card ── */
.feed-area{
  position:relative;
  padding:10px 10px 0;
  background:
    radial-gradient(70% 90% at 50% 0,rgba(255,255,255,.045),transparent 70%),
    linear-gradient(180deg,rgba(0,0,0,.10),rgba(0,0,0,.02));
}

#eng-wrap,
.card .cam-grid{
  border-radius:23px !important;
  border:1px solid rgba(255,255,255,.11) !important;
  box-shadow:
    0 1px 0 rgba(255,255,255,.10) inset,
    0 16px 38px rgba(0,0,0,.30),
    0 3px 10px rgba(0,0,0,.24) !important;
  overflow:hidden;
}

#eng-wrap::after{
  content:'';
  position:absolute;
  inset:0;
  pointer-events:none;
  border-radius:inherit;
  box-shadow:inset 0 1px 0 rgba(255,255,255,.08),inset 0 -24px 60px rgba(0,0,0,.16);
  z-index:3;
}

.card .stream-ctrl-bar{
  position:relative;
  z-index:5;
  min-height:48px;
  margin:9px 4px 2px !important;
  padding:5px 6px !important;
  gap:6px !important;
  border-radius:18px !important;
  border:1px solid rgba(255,255,255,.105) !important;
  background:
    linear-gradient(180deg,rgba(255,255,255,.065),rgba(255,255,255,.025)),
    rgba(28,28,31,.58) !important;
  box-shadow:
    0 1px 0 rgba(255,255,255,.08) inset,
    0 8px 26px rgba(0,0,0,.20) !important;
  -webkit-backdrop-filter:blur(28px) saturate(175%);
  backdrop-filter:blur(28px) saturate(175%);
}

.card .stream-ctrl-bar .media-nav-group{
  padding:3px !important;
  gap:2px !important;
  border-radius:14px !important;
  border:1px solid rgba(255,255,255,.07) !important;
  background:rgba(118,118,128,.14) !important;
  box-shadow:0 1px 0 rgba(255,255,255,.05) inset;
}

.card .media-nav-btn,
.card .talk-btn{
  position:relative;
  min-height:35px;
  border-radius:11px !important;
  transition:transform .22s cubic-bezier(.22,1,.36,1),background .22s ease,color .22s ease,box-shadow .22s ease !important;
}

.card .media-nav-btn.active{
  background:rgba(255,255,255,.17) !important;
  box-shadow:0 1px 5px rgba(0,0,0,.22),inset 0 1px 0 rgba(255,255,255,.14) !important;
}

.card .media-nav-btn:hover,
.card .talk-btn:hover{
  background:rgba(255,255,255,.105) !important;
}

.card .media-nav-btn:active,
.card .talk-btn:active,
.card .tool:active{
  transform:scale(.94);
}

/* ── Timeline becomes a floating material panel ── */
.card .tl-sec{
  position:relative;
  margin:10px 10px 10px !important;
  padding:12px 12px 11px !important;
  border:1px solid rgba(255,255,255,.10) !important;
  border-radius:23px !important;
  background:
    radial-gradient(90% 50% at 52% 5%,rgba(10,132,255,.065),transparent 68%),
    linear-gradient(145deg,rgba(255,255,255,.055),rgba(255,255,255,.018) 45%,rgba(0,0,0,.09)),
    rgba(18,22,28,.62) !important;
  box-shadow:
    0 1px 0 rgba(255,255,255,.075) inset,
    0 -1px 0 rgba(0,0,0,.22) inset,
    0 14px 36px rgba(0,0,0,.22) !important;
  -webkit-backdrop-filter:blur(30px) saturate(170%);
  backdrop-filter:blur(30px) saturate(170%);
}

.card .tl-head{
  margin:0 1px 10px !important;
  min-height:34px;
}

.card .tl-head::before{
  content:'Timeline';
  margin-right:auto;
  color:rgba(245,245,247,.88);
  font-size:13px;
  font-weight:650;
  letter-spacing:-.015em;
}

.card .tl-head #tl-range{
  position:absolute;
  left:1px;
  top:31px;
  color:rgba(235,235,245,.40) !important;
  font-size:10px;
  font-weight:550;
  letter-spacing:0;
}

.card .tl-tools{gap:5px !important;}

.card .tool{
  position:relative;
  display:inline-flex;
  align-items:center;
  justify-content:center;
  min-width:34px;
  height:34px;
  padding:0 9px !important;
  border:1px solid rgba(255,255,255,.10) !important;
  border-radius:12px !important;
  background:
    linear-gradient(180deg,rgba(255,255,255,.075),rgba(255,255,255,.025)),
    rgba(42,42,46,.56) !important;
  color:rgba(245,245,247,.70) !important;
  box-shadow:0 1px 0 rgba(255,255,255,.08) inset,0 2px 8px rgba(0,0,0,.12);
  -webkit-backdrop-filter:blur(18px) saturate(170%);
  backdrop-filter:blur(18px) saturate(170%);
}

.card .tool:hover{
  color:#fff !important;
  background:linear-gradient(180deg,rgba(255,255,255,.13),rgba(255,255,255,.055)),rgba(42,42,46,.62) !important;
  border-color:rgba(255,255,255,.18) !important;
  box-shadow:0 1px 0 rgba(255,255,255,.11) inset,0 5px 15px rgba(0,0,0,.18) !important;
}

.card .tl-zoom-controls{
  padding:3px !important;
  gap:2px !important;
  border:1px solid rgba(255,255,255,.095) !important;
  border-radius:14px !important;
  background:rgba(118,118,128,.15) !important;
  box-shadow:0 1px 0 rgba(255,255,255,.06) inset;
  -webkit-backdrop-filter:blur(18px) saturate(175%);
  backdrop-filter:blur(18px) saturate(175%);
}

.card .tl-zoom-controls .tool{
  border:0 !important;
  box-shadow:none !important;
  background:transparent !important;
}

.card .tl-zoom-controls .tool:hover{background:rgba(255,255,255,.10) !important;}
.card .tl-zoom-controls .tl-zoom-level{color:rgba(245,245,247,.82) !important;}

/* Timeline track: translucent depth with a luminous central rail. */
.card .tl-track.vertical{
  position:relative;
  margin-top:18px;
  border-radius:18px !important;
  border:1px solid rgba(255,255,255,.065) !important;
  background:
    radial-gradient(65% 65% at 65% 50%,rgba(10,132,255,.075),transparent 66%),
    linear-gradient(90deg,rgba(4,8,13,.78),rgba(8,16,25,.84) 54%,rgba(4,9,15,.76)) !important;
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,.04),
    inset 0 -1px 0 rgba(0,0,0,.30),
    0 8px 25px rgba(0,0,0,.18) !important;
}

.card .tl-track.vertical::after{
  left:92px !important;
  width:1px !important;
  background:linear-gradient(180deg,transparent 0%,rgba(255,255,255,.16) 10%,rgba(255,255,255,.12) 50%,rgba(255,255,255,.16) 90%,transparent 100%) !important;
  box-shadow:0 0 8px rgba(255,255,255,.035);
}

.card .tl-track .t-rec{
  background:linear-gradient(180deg,color-mix(in srgb,var(--rec-color,var(--c-acc)) 88%,white 12%),var(--rec-color,var(--c-acc))) !important;
  opacity:.72 !important;
  box-shadow:0 0 10px color-mix(in srgb,var(--rec-color,var(--c-acc)) 48%,transparent) !important;
}

.card .tl-scale-mark span{
  color:rgba(235,235,245,.38) !important;
  font-size:10px !important;
  letter-spacing:-.01em;
}

.card .tl-scale-mark.hour span{
  color:rgba(245,245,247,.67) !important;
  font-weight:650 !important;
}

.card .tl-scale-mark i{background:rgba(255,255,255,.09) !important;}
.card .tl-scale-mark.hour i{background:rgba(255,255,255,.20) !important;}

.card .t-ev .t-dot{
  border:2px solid rgba(5,10,16,.94) !important;
  box-shadow:
    0 0 0 1px color-mix(in srgb,var(--ev-color,#bf5af2) 76%,transparent),
    0 2px 8px rgba(0,0,0,.34) !important;
  transition:transform .22s cubic-bezier(.22,1,.36,1),box-shadow .22s ease !important;
}

.card .t-ev:hover .t-dot{transform:scale(1.13);}

.card .t-ev .t-connector{
  background:linear-gradient(90deg,rgba(255,255,255,.13),rgba(255,255,255,.035)) !important;
}

.card .t-ev.selected .t-dot{
  box-shadow:
    0 0 0 2px var(--ev-color,#0a84ff),
    0 0 0 5px color-mix(in srgb,var(--ev-color,#0a84ff) 20%,transparent),
    0 5px 14px rgba(0,0,0,.30) !important;
}

/* Scrubber becomes a luminous glass control rather than a flat line. */
.card .tl-playhead{
  height:2px !important;
  background:linear-gradient(90deg,rgba(10,132,255,.45),#0a84ff 22%,#54b4ff 72%,rgba(10,132,255,.72)) !important;
  box-shadow:0 0 10px rgba(10,132,255,.48),0 0 24px rgba(10,132,255,.12) !important;
}

.card .tl-playhead i{
  width:20px !important;
  height:20px !important;
  background:linear-gradient(145deg,#42a5ff,#087af0) !important;
  border:3px solid rgba(6,13,21,.94) !important;
  box-shadow:
    0 0 0 1px rgba(84,180,255,.62),
    0 0 0 5px rgba(10,132,255,.14),
    0 5px 13px rgba(0,0,0,.30) !important;
}

.card .tl-playhead span{background:linear-gradient(90deg,#0a84ff,#43a8ff) !important;}

/* LIVE badge gets Apple's restrained status-chip treatment. */
.card .tl-live-line{
  background:#ff453a !important;
  box-shadow:0 0 9px rgba(255,69,58,.42) !important;
}
.card .tl-live-line::before{
  right:8px !important;
  padding:4px 8px !important;
  border:1px solid rgba(255,255,255,.20);
  border-radius:999px !important;
  background:rgba(255,69,58,.88) !important;
  box-shadow:0 3px 10px rgba(0,0,0,.22),0 1px 0 rgba(255,255,255,.18) inset !important;
  font-size:8px !important;
}

/* Preview cards float like iOS contextual material. */
.card .t-preview{
  border:1px solid rgba(255,255,255,.14) !important;
  background:rgba(30,30,34,.68) !important;
  border-radius:17px !important;
  box-shadow:
    0 1px 0 rgba(255,255,255,.10) inset,
    0 14px 38px rgba(0,0,0,.40) !important;
  -webkit-backdrop-filter:blur(24px) saturate(175%);
  backdrop-filter:blur(24px) saturate(175%);
}

.card .t-preview-thumb{border-radius:13px !important;}
.card .t-preview .t-badge{box-shadow:0 1px 0 rgba(255,255,255,.22) inset,0 3px 8px rgba(0,0,0,.20);}

/* Legend: glass chips with an optical inset highlight. */
.card .legend{
  margin-top:9px !important;
  padding:2px 1px 0 !important;
  gap:7px !important;
}
.card .lg{
  min-height:25px;
  padding:4px 9px !important;
  border:1px solid rgba(255,255,255,.075) !important;
  border-radius:999px !important;
  background:rgba(118,118,128,.12) !important;
  color:rgba(235,235,245,.58) !important;
  box-shadow:0 1px 0 rgba(255,255,255,.055) inset !important;
  -webkit-backdrop-filter:blur(16px) saturate(165%);
  backdrop-filter:blur(16px) saturate(165%);
}
.card .lg i{width:6px !important;height:6px !important;border-radius:50% !important;box-shadow:0 0 5px currentColor;}

/* Panels open from Filter/Calendar keep the same material vocabulary. */
.card .filter-panel,
.card .cal-panel{
  border:1px solid rgba(255,255,255,.10) !important;
  border-radius:17px !important;
  background:rgba(38,38,42,.62) !important;
  box-shadow:0 10px 30px rgba(0,0,0,.22),inset 0 1px 0 rgba(255,255,255,.06) !important;
  -webkit-backdrop-filter:blur(24px) saturate(170%);
  backdrop-filter:blur(24px) saturate(170%);
}

.card .chip,
.card .pill{
  border-color:rgba(255,255,255,.09) !important;
  background:rgba(118,118,128,.11) !important;
  box-shadow:0 1px 0 rgba(255,255,255,.045) inset !important;
}
.card .chip.on,
.card .pill.active{
  background:var(--c-acc) !important;
  border-color:color-mix(in srgb,var(--c-acc) 78%,white) !important;
  box-shadow:0 1px 0 rgba(255,255,255,.25) inset,0 4px 12px color-mix(in srgb,var(--c-acc) 28%,transparent) !important;
}

/* Focus rings: visible, soft and unmistakably intentional. */
.card button:focus-visible,
.card input:focus-visible{
  outline:2px solid color-mix(in srgb,var(--c-acc) 82%,white);
  outline-offset:2px;
}

/* Light appearance — preserve translucency instead of reverting to flat white. */
.card.theme-light .tl-sec{
  background:
    radial-gradient(90% 50% at 52% 5%,rgba(0,122,255,.055),transparent 68%),
    linear-gradient(145deg,rgba(255,255,255,.72),rgba(255,255,255,.38)),
    rgba(242,242,247,.72) !important;
  border-color:rgba(0,0,0,.075) !important;
  box-shadow:0 1px 0 rgba(255,255,255,.82) inset,0 14px 36px rgba(0,0,0,.10) !important;
}
.card.theme-light .tl-track.vertical{
  background:linear-gradient(90deg,rgba(235,237,242,.82),rgba(247,248,251,.88),rgba(235,237,242,.82)) !important;
  border-color:rgba(0,0,0,.065) !important;
}
.card.theme-light .tl-track.vertical::after{background:linear-gradient(180deg,transparent,rgba(0,0,0,.16),transparent) !important;}
.card.theme-light .tool{background:rgba(255,255,255,.52) !important;border-color:rgba(0,0,0,.09) !important;color:rgba(29,29,31,.72) !important;}
.card.theme-light .legend .lg{background:rgba(255,255,255,.48) !important;border-color:rgba(0,0,0,.07) !important;color:rgba(60,60,67,.60) !important;}

/* Mobile: tighter optical margins, larger touch targets, no loss of timeline area. */
@media(max-width:700px){
  .card{border-radius:24px !important;}
  .feed-area{padding:8px 8px 0;}
  #eng-wrap,.card .cam-grid{border-radius:21px !important;}
  .card .stream-ctrl-bar{margin:8px 2px 1px !important;border-radius:17px !important;}
  .card .tl-sec{margin:8px 8px 8px !important;padding:11px 10px 10px !important;border-radius:21px !important;}
  .card .tl-head{margin-bottom:9px !important;}
  .card .tl-head::before{font-size:12.5px;}
  .card .tl-head #tl-range{top:30px;}
  .card .tl-track.vertical{margin-top:17px;border-radius:17px !important;}
  .card .legend{padding-left:0 !important;padding-right:0 !important;}
}

@media(max-width:380px){
  .card .tl-sec{margin-left:6px !important;margin-right:6px !important;}
  .card .tool{min-width:32px;padding-left:7px !important;padding-right:7px !important;}
}

@media(prefers-reduced-transparency:reduce){
  .card,.card .tl-sec,.card .stream-ctrl-bar,.card .tool,.card .t-preview{backdrop-filter:none !important;-webkit-backdrop-filter:none !important;}
}

/* ─────────────────────────────────────────────────────────────
   Scrypted / UniFi-inspired timeline reliability + responsive pass
   The timeline remains vertical so the existing gesture/playback contract is
   untouched, but events are now represented by three independent layers:
   recording coverage, event-duration ribbons, and detection markers.
   ───────────────────────────────────────────────────────────── */
.card .tl-track.vertical{
  --tl-gutter:clamp(70px,18vw,104px);
  --tl-rail:calc(var(--tl-gutter) + 8px);
  --tl-content:calc(var(--tl-gutter) + 20px);
  height:clamp(340px,58vw,660px) !important;
  min-height:340px;
  max-height:660px;
  overscroll-behavior:contain;
}
.card .tl-track.vertical::after{
  left:var(--tl-rail) !important;
  width:2px !important;
  background:linear-gradient(180deg,transparent 0%,rgba(255,255,255,.16) 8%,rgba(255,255,255,.16) 92%,transparent 100%) !important;
  box-shadow:0 0 14px rgba(255,255,255,.035);
}
.card .tl-scale-mark span{
  left:8px !important;
  width:calc(var(--tl-gutter) - 14px) !important;
  overflow:hidden;
  text-overflow:ellipsis;
}
.card .tl-scale-mark i{left:calc(var(--tl-rail) - 5px) !important;width:12px !important;}
.card .tl-scale-mark.hour i{width:19px !important;}

/* Recording coverage is the low-contrast foundation; event ribbons sit above it. */
.card .tl-track .t-rec{
  left:calc(var(--tl-rail) - 4px) !important;
  width:8px !important;
  border-radius:999px;
  opacity:.52 !important;
  z-index:2 !important;
}
.card .t-ev{
  z-index:9 !important;
  overflow:visible !important;
}
.card .t-ev .t-duration{
  position:absolute;
  left:calc(var(--tl-rail) - 3px);
  top:0;
  width:8px;
  min-height:3px;
  border-radius:999px;
  background:linear-gradient(180deg,
    color-mix(in srgb,var(--ev-color) 92%,white),
    color-mix(in srgb,var(--ev-color) 58%,transparent));
  box-shadow:0 0 8px color-mix(in srgb,var(--ev-color) 34%,transparent);
  opacity:.78;
  pointer-events:none;
}
.card .t-ev .t-connector{
  left:var(--rail,92px) !important;
  width:calc(100% - var(--tl-rail)) !important;
  opacity:.62;
  z-index:1;
}
.card .t-ev .t-dot{
  left:calc(var(--tl-rail) - 9px) !important;
  z-index:3;
  width:18px !important;
  height:18px !important;
  top:-8px !important;
  border-width:2px !important;
}
.card .t-ev.selected .t-dot{
  left:calc(var(--tl-rail) - 11px) !important;
  top:-10px !important;
  width:22px !important;
  height:22px !important;
}
.card .t-preview{
  left:var(--tl-content) !important;
  width:calc(100% - var(--tl-content) - 10px) !important;
  max-width:380px;
  height:clamp(76px,11vw,118px) !important;
  z-index:5 !important;
}
.card .t-preview::after{
  content:'';position:absolute;left:-7px;top:50%;width:7px;height:1px;
  background:color-mix(in srgb,var(--ev-color) 52%,transparent);
}
.card .tl-live-line{z-index:14 !important;}
.card .tl-playhead{z-index:30 !important;}

/* Keep the timeline useful inside narrow dashboard columns, not only on phones. */
@media(max-width:520px){
  .card .tl-track.vertical{height:clamp(340px,106vw,520px) !important;}
  .card .tl-sec{padding-left:8px !important;padding-right:8px !important;}
  .card .tl-track.vertical{margin-left:0 !important;margin-right:0 !important;}
  .card .t-preview{max-width:none !important;}
  .card .t-preview .t-badge{font-size:9px !important;padding:3px 7px !important;}
  .card .t-preview .t-preview-time,.card .t-preview b{font-size:8px !important;}
}
@media(max-width:360px){
  .card .tl-track.vertical{--tl-gutter:66px;}
  .card .tl-scale-mark span{font-size:9px !important;}
  .card .t-preview{height:72px !important;border-radius:13px !important;}
}
@media(min-width:521px) and (max-width:760px){
  .card .tl-track.vertical{height:clamp(360px,68vw,560px) !important;}
}
@media(min-width:761px){
  .card .tl-track.vertical{height:clamp(390px,52vw,660px) !important;}
}
@media(min-width:1100px){
  .card .tl-track.vertical{height:560px !important;}
}

/* Accessibility/low-power fallback: preserve the hierarchy without blur. */
@media(prefers-reduced-motion:reduce){
  .card .t-ev .t-dot,.card .tool,.card .t-preview{transition:none !important;}
}


/* ─────────────────────────────────────────────────────────────
   final visual authority + browser visibility repair
   This block intentionally comes AFTER every legacy style layer.
   ───────────────────────────────────────────────────────────── */
.card,.card.theme-light,.card.theme-auto{
  --c-bg:#000;--c-bg-deep:#000;--c-bg-panel:#0d0d0f;--c-bg-panel2:#151518;
  --c-hairline:rgba(255,255,255,.09);--c-border:rgba(255,255,255,.08);--c-border2:rgba(255,255,255,.11);
  --c-text:#f5f5f7;--c-text2:rgba(245,245,247,.68);--c-text3:rgba(245,245,247,.44);--c-text4:rgba(245,245,247,.28);
  background:#000 !important;color:#f5f5f7 !important;border:1px solid rgba(255,255,255,.08) !important;
  border-radius:18px !important;box-shadow:0 10px 32px rgba(0,0,0,.34) !important;
  -webkit-backdrop-filter:none !important;backdrop-filter:none !important;
}
.card::before{display:none !important;}
.card .layout,.card .col-left,.card .col-right,.card .feed-area,.card .tl-sec,.card .list-sec{background:#000 !important;}
.card #eng-wrap,.card .cam-grid{border-radius:14px !important;background:#000 !important;box-shadow:inset 0 0 0 1px rgba(255,255,255,.08) !important;}
.card .stream-ctrl-bar{background:#070708 !important;border:0 !important;border-top:1px solid rgba(255,255,255,.07) !important;border-bottom:1px solid rgba(255,255,255,.07) !important;border-radius:0 !important;box-shadow:none !important;-webkit-backdrop-filter:none !important;backdrop-filter:none !important;}
.card .stream-ctrl-bar .media-nav-group{background:#111113 !important;border:1px solid rgba(255,255,255,.08) !important;border-radius:11px !important;}
.card .media-nav-btn{border-radius:8px !important;color:rgba(245,245,247,.58) !important;box-shadow:none !important;}
.card .media-nav-btn.active{background:#f5f5f7 !important;color:#09090a !important;}
.card .tool{background:#101012 !important;border:1px solid rgba(255,255,255,.09) !important;border-radius:9px !important;box-shadow:none !important;-webkit-backdrop-filter:none !important;backdrop-filter:none !important;}
.card .tl-sec{margin:0 !important;border-radius:0 !important;border-bottom:1px solid rgba(255,255,255,.07) !important;box-shadow:none !important;}
.card .tl-track.vertical{background:#060608 !important;border:1px solid rgba(255,255,255,.07) !important;border-radius:12px !important;box-shadow:inset 0 1px 0 rgba(255,255,255,.025) !important;}
.card .t-preview{background:#111113 !important;border:1px solid rgba(255,255,255,.10) !important;border-radius:11px !important;box-shadow:0 6px 18px rgba(0,0,0,.34) !important;-webkit-backdrop-filter:none !important;backdrop-filter:none !important;pointer-events:auto !important;cursor:pointer !important;font:inherit !important;color:inherit !important;text-align:left !important;-webkit-appearance:none !important;appearance:none !important;}
.card .t-preview:active{transform:scale(.985);}

/* Restore surfaces hidden by the old timeline-only compatibility layer. */
.card .media-gallery{display:none !important;min-height:0 !important;padding:12px 6px 8px !important;background:#000 !important;}
.card .media-gallery.open{display:block !important;}
.card .info-row{display:flex !important;background:#000 !important;}
.card .cam-switcher{display:flex !important;background:#070708 !important;}
.card .latest{display:block !important;background:#000 !important;}

/* Four visible browser rows, then vertical scrolling. */
.card .media-gallery-grid{
  --media-row-h:76px;--media-row-gap:7px;
  height:calc((var(--media-row-h) * 4) + (var(--media-row-gap) * 3)) !important;
  max-height:none !important;display:flex !important;flex-direction:column !important;gap:var(--media-row-gap) !important;
  overflow-y:auto !important;overflow-x:hidden !important;padding:0 3px 0 0 !important;
  -webkit-overflow-scrolling:touch;overscroll-behavior:contain;scrollbar-width:thin;
}
.card .media-gallery-grid .ec,.card .media-gallery-grid .rec,.card .media-gallery-grid .rev{
  height:var(--media-row-h) !important;min-height:var(--media-row-h) !important;max-height:var(--media-row-h) !important;
  flex:0 0 var(--media-row-h) !important;margin:0 !important;box-sizing:border-box !important;overflow:hidden !important;
  padding:9px 10px !important;border:1px solid rgba(255,255,255,.075) !important;border-radius:11px !important;background:#0d0d0f !important;box-shadow:none !important;
}
.card .media-gallery-grid .et,.card .media-gallery-grid .rev-th{width:80px !important;height:56px !important;flex:0 0 80px !important;border-radius:8px !important;}
.card .media-filter-panel{background:#0c0c0e !important;border:1px solid rgba(255,255,255,.08) !important;border-radius:10px !important;-webkit-backdrop-filter:none !important;backdrop-filter:none !important;}
.card .media-gallery-filter-btn{background:#111113 !important;border:1px solid rgba(255,255,255,.09) !important;border-radius:8px !important;}
.card .media-gallery-head .section-label{font-size:15px !important;font-weight:650 !important;text-transform:none !important;letter-spacing:-.015em !important;color:#f5f5f7 !important;}
@media(max-width:560px){
  .card{border-radius:14px !important;}
  .card .media-gallery-grid{--media-row-h:72px;--media-row-gap:6px;}
  .card .media-gallery-grid .et,.card .media-gallery-grid .rev-th{width:72px !important;height:52px !important;flex-basis:72px !important;}
}

/* monochrome timeline glyphs + no sticky edge events. */
.card .t-ev .t-duration{
  width:3px !important;
  left:calc(var(--tl-rail) - 1px) !important;
  background:rgba(245,245,247,.28) !important;
  box-shadow:none !important;
  opacity:.72 !important;
}
.card .t-ev .t-dot{
  width:16px !important;
  height:16px !important;
  left:calc(var(--tl-rail) - 8px) !important;
  top:-7px !important;
  display:flex !important;
  align-items:center !important;
  justify-content:center !important;
  background:#151518 !important;
  color:rgba(245,245,247,.86) !important;
  border:1px solid rgba(255,255,255,.20) !important;
  box-shadow:0 2px 7px rgba(0,0,0,.34) !important;
}
.card .t-ev:hover .t-dot{transform:scale(1.08) !important;background:#1c1c1f !important;}
.card .t-ev.selected .t-dot{
  width:18px !important;
  height:18px !important;
  left:calc(var(--tl-rail) - 9px) !important;
  top:-8px !important;
  background:#0a84ff !important;
  color:#fff !important;
  border-color:rgba(255,255,255,.34) !important;
  box-shadow:0 0 0 3px rgba(10,132,255,.18),0 3px 9px rgba(0,0,0,.36) !important;
}
.card .t-glyph,.card .t-badge-glyph{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  flex:none;
}
.card .t-glyph{width:10px;height:10px;}
.card .t-glyph svg,.card .t-badge-glyph svg,.card .t-glyph ha-icon,.card .t-badge-glyph ha-icon{width:100%;height:100%;display:block;fill:currentColor;--mdc-icon-size:100%;}
.card .t-dot em{
  right:-8px !important;
  top:-9px !important;
  min-width:13px !important;
  height:13px !important;
  padding:0 3px !important;
  font-size:7px !important;
  line-height:12px !important;
  background:#222226 !important;
  border-color:rgba(255,255,255,.16) !important;
}
.card .t-ev .t-connector{
  background:linear-gradient(90deg,rgba(255,255,255,.10),rgba(255,255,255,.025)) !important;
  opacity:.42 !important;
}
.card .t-preview .t-badge{
  display:inline-flex !important;
  align-items:center !important;
  gap:5px !important;
  background:rgba(24,24,27,.82) !important;
  color:rgba(255,255,255,.92) !important;
  border:.5px solid rgba(255,255,255,.20) !important;
  box-shadow:none !important;
}
.card .t-badge-glyph{width:11px;height:11px;color:rgba(255,255,255,.82);}
.card .lg.tl-detection-legend i{
  width:11px !important;
  height:11px !important;
  display:inline-flex !important;
  align-items:center !important;
  justify-content:center !important;
  background:transparent !important;
  color:rgba(245,245,247,.72) !important;
  border-radius:0 !important;
  box-shadow:none !important;
}
.card .lg.tl-detection-legend i svg,.card .lg.tl-detection-legend i ha-icon{width:100%;height:100%;display:block;fill:currentColor;--mdc-icon-size:100%;}

/* Scrypted-style event rail + responsive glyph lane.
   The blue activity marker stays on the rail; detection classes live in a
   separate horizontal lane between the rail and the thumbnail. Bursts share
   one row instead of turning the rail marker itself into a multi-icon pill. */
.card .tl-track.vertical{
  --tl-glyph-size:22px;
  --tl-glyph-gap:7px;
  --tl-glyph-offset:38px;
  --tl-event-lane:104px;
  --tl-dot-size:15px;
  --tl-content:calc(var(--tl-rail) + var(--tl-event-lane));
}
.card .t-ev .t-duration{
  left:calc(var(--tl-rail) - 5px) !important;
  width:10px !important;
  min-height:8px !important;
  border-radius:999px !important;
  background:#4b9cf5 !important;
  box-shadow:none !important;
  opacity:.90 !important;
}
.card .t-ev .t-dot,
.card .t-ev.clustered .t-dot{
  position:absolute !important;
  left:var(--tl-rail) !important;
  top:0 !important;
  width:var(--tl-dot-size) !important;
  min-width:var(--tl-dot-size) !important;
  height:calc(var(--tl-dot-size) + 8px) !important;
  padding:0 !important;
  border:0 !important;
  border-radius:999px !important;
  background:#4b9cf5 !important;
  color:rgba(245,245,247,.70) !important;
  box-shadow:none !important;
  overflow:visible !important;
  transform:translate(-50%,-50%) !important;
  transition:transform .14s ease,background-color .14s ease !important;
}
.card .t-ev:hover .t-dot,
.card .t-ev.clustered:hover .t-dot{
  transform:translate(-50%,-50%) scale(1.06) !important;
  background:#5aa7fa !important;
}
.card .t-ev.selected .t-dot,
.card .t-ev.clustered.selected .t-dot{
  left:var(--tl-rail) !important;
  top:0 !important;
  width:calc(var(--tl-dot-size) + 2px) !important;
  min-width:calc(var(--tl-dot-size) + 2px) !important;
  height:calc(var(--tl-dot-size) + 12px) !important;
  padding:0 !important;
  background:#0a84ff !important;
  border:0 !important;
  box-shadow:0 0 0 3px rgba(10,132,255,.15) !important;
  transform:translate(-50%,-50%) !important;
}
.card .t-ev.selected:hover .t-dot,
.card .t-ev.clustered.selected:hover .t-dot{transform:translate(-50%,-50%) scale(1.05) !important;}
.card .t-glyph-stack{
  position:absolute !important;
  left:var(--tl-glyph-offset) !important;
  top:50% !important;
  transform:translateY(-50%) !important;
  display:inline-flex !important;
  align-items:center !important;
  justify-content:flex-start !important;
  gap:var(--tl-glyph-gap) !important;
  min-width:0 !important;
  white-space:nowrap !important;
  color:rgba(245,245,247,.66) !important;
  pointer-events:none !important;
  z-index:4 !important;
}
.card .t-glyph{
  width:var(--tl-glyph-size) !important;
  height:var(--tl-glyph-size) !important;
  display:inline-flex !important;
  flex:0 0 var(--tl-glyph-size) !important;
  align-items:center !important;
  justify-content:center !important;
  opacity:.92;
  filter:none !important;
}
.card .t-glyph svg,.card .t-glyph ha-icon{width:100% !important;height:100% !important;display:block !important;fill:currentColor !important;--mdc-icon-size:100% !important;}
.card .t-ev.selected .t-glyph-stack{color:rgba(245,245,247,.92) !important;}
.card .t-ev .t-connector{
  left:calc(var(--tl-rail) + 10px) !important;
  width:calc(var(--tl-event-lane) - 16px) !important;
  height:1px !important;
  background:linear-gradient(90deg,rgba(245,245,247,.20),rgba(245,245,247,.12)) !important;
  opacity:.72 !important;
  z-index:1 !important;
}
.card .t-preview{
  left:var(--tl-content) !important;
  width:calc(100% - var(--tl-content) - 10px) !important;
}
.card .t-preview::after{
  left:-8px !important;
  width:8px !important;
  background:rgba(245,245,247,.13) !important;
}
.card .t-badge-glyph{
  width:clamp(13px,calc(var(--tl-glyph-size) - 8px),18px) !important;
  height:clamp(13px,calc(var(--tl-glyph-size) - 8px),18px) !important;
}

/* timeline-native trim selection for recording downloads. */
/* HA-proxy-only networking + exact-time scrub stills. */

/* dynamic Frigate filters + resilient/tall-layout thumbnails. */

/* prevent Scrypted-style timeline glyphs from being clipped or
   distorted by the legacy 1px event-row paint containment. */
.card .t-ev{
  contain:layout !important;
  overflow:visible !important;
}
.card .t-ev .t-dot{
  overflow:visible !important;
}
.card .t-glyph-stack{
  overflow:visible !important;
  height:var(--tl-glyph-size) !important;
  min-height:var(--tl-glyph-size) !important;
  line-height:1 !important;
}
.card .t-glyph{
  box-sizing:border-box !important;
  width:var(--tl-glyph-size) !important;
  min-width:var(--tl-glyph-size) !important;
  max-width:var(--tl-glyph-size) !important;
  height:var(--tl-glyph-size) !important;
  min-height:var(--tl-glyph-size) !important;
  max-height:var(--tl-glyph-size) !important;
  aspect-ratio:1 / 1 !important;
  flex-grow:0 !important;
  flex-shrink:0 !important;
  overflow:visible !important;
}
.card .t-glyph > svg,
.card .t-glyph > ha-icon{
  display:block !important;
  width:100% !important;
  height:100% !important;
  min-width:100% !important;
  min-height:100% !important;
  max-width:100% !important;
  max-height:100% !important;
  overflow:visible !important;
  flex:none !important;
}

/* iOS native fullscreen exits directly back to embedded player geometry. */
/* Material Design Icons for Frigate detection glyphs. */
.card .t-glyph ha-icon,
.card .t-badge-glyph ha-icon,
.card .tl-detection-legend ha-icon,
.card .t-ph ha-icon,
.card .tph ha-icon{
  color:currentColor !important;
  line-height:1 !important;
  flex:none !important;
  overflow:visible !important;
}
.card .t-glyph ha-icon{
  width:var(--tl-glyph-size) !important;
  height:var(--tl-glyph-size) !important;
  --mdc-icon-size:var(--tl-glyph-size) !important;
}


/* reliable pointer-captured trim handles + correctly signed MP4 downloads. */
/* native picker fix: no forced blur/render on iOS; robust control hit-lock + card freeze. */
/* iOS native picker hardening: sticky picker lock + full gallery DOM freeze. */
/* stable native date/time pickers: preserve picker DOM during gallery/data refreshes. */
/* timeline-native recording trim/download picker. */
.card .rec-download-icon.range-active{
  color:#fff !important;
  background:rgba(10,132,255,.26) !important;
  border-color:rgba(84,180,255,.42) !important;
  box-shadow:0 0 0 1px rgba(10,132,255,.12),0 4px 16px rgba(10,132,255,.18) !important;
}
.card .tl-download-range{
  position:absolute;
  inset:0;
  z-index:44;
  /* Trim mode owns the timeline interaction surface. Keeping this parent
     pointer-transparent and opting only the children back in is unreliable in
     iOS/WKWebView once backdrop-filter/stacking contexts are involved. */
  pointer-events:auto;
  touch-action:none;
  user-select:none;
  -webkit-user-select:none;
  overflow:visible;
  isolation:isolate;
  font-family:-apple-system,BlinkMacSystemFont,"SF Pro Text",system-ui,sans-serif;
}
.card .tl-range-band{
  position:absolute;
  left:var(--tl-rail);
  right:0;
  min-height:2px;
  background:linear-gradient(90deg,rgba(10,132,255,.22),rgba(10,132,255,.10) 62%,rgba(10,132,255,.035));
  border-top:1px solid rgba(84,180,255,.62);
  border-bottom:1px solid rgba(84,180,255,.62);
  box-shadow:inset 0 0 24px rgba(10,132,255,.08);
  pointer-events:none;
}
.card .tl-range-boundary{
  position:absolute;
  /* The visible boundary is only 2px tall, but the interactive target is a
     full 54px lane. This is deliberately larger than Apple's 44px touch
     target guidance so a moving finger does not have to stay on the line. */
  left:calc(var(--tl-rail) - 16px);
  right:0;
  height:54px;
  transform:translateY(-50%);
  background:transparent;
  box-shadow:none;
  color:#0a84ff;
  pointer-events:auto;
  touch-action:none;
  cursor:ns-resize;
  z-index:12;
}
.card .tl-range-boundary::before{
  content:"";
  position:absolute;
  left:16px;
  right:8px;
  top:50%;
  height:2px;
  transform:translateY(-50%);
  border-radius:2px;
  background:currentColor;
  box-shadow:0 0 9px color-mix(in srgb,currentColor 48%,transparent);
  pointer-events:none;
}
.card .tl-range-start{color:#0a84ff;}
.card .tl-range-end{color:#53b5ff;background:transparent;box-shadow:none;}
.card .tl-range-boundary>i{
  position:absolute;
  left:16px;
  top:50%;
  width:30px;
  height:30px;
  transform:translate(-50%,-50%);
  border-radius:50%;
  border:3px solid rgba(5,10,16,.96);
  background:currentColor;
  color:inherit;
  box-shadow:0 0 0 1px rgba(84,180,255,.74),0 0 0 6px rgba(10,132,255,.14),0 5px 14px rgba(0,0,0,.35);
  pointer-events:none;
}
.card .tl-range-end>i{color:inherit;}
.card .tl-range-boundary>span{
  position:absolute;
  left:34px;
  top:50%;
  transform:translateY(-50%);
  display:inline-flex;
  align-items:center;
  gap:5px;
  padding:5px 8px;
  border:1px solid rgba(255,255,255,.13);
  border-radius:9px;
  background:rgba(15,18,23,.84);
  -webkit-backdrop-filter:blur(16px) saturate(155%);
  backdrop-filter:blur(16px) saturate(155%);
  color:rgba(255,255,255,.94);
  font-size:10px;
  font-weight:650;
  line-height:1;
  font-variant-numeric:tabular-nums;
  white-space:nowrap;
  box-shadow:0 4px 14px rgba(0,0,0,.28),inset 0 1px 0 rgba(255,255,255,.07);
}
.card .tl-range-boundary>span b{
  color:rgba(164,214,255,.88);
  font-size:8px;
  letter-spacing:.07em;
}
.card .tl-range-actions{
  position:absolute;
  right:10px;
  bottom:10px;
  display:flex;
  align-items:center;
  gap:6px;
  padding:5px;
  border:1px solid rgba(255,255,255,.12);
  border-radius:14px;
  background:rgba(22,22,25,.80);
  -webkit-backdrop-filter:blur(22px) saturate(165%);
  backdrop-filter:blur(22px) saturate(165%);
  box-shadow:0 8px 24px rgba(0,0,0,.30),inset 0 1px 0 rgba(255,255,255,.08);
  pointer-events:auto;
  touch-action:manipulation;
  z-index:20;
}
.card .tl-range-duration{
  min-width:42px;
  padding:0 4px;
  color:rgba(235,235,245,.68);
  font-size:10px;
  font-weight:650;
  font-variant-numeric:tabular-nums;
  text-align:center;
}
.card .tl-range-actions button{
  height:31px;
  display:inline-flex;
  align-items:center;
  justify-content:center;
  gap:5px;
  padding:0 10px;
  border:1px solid rgba(255,255,255,.11);
  border-radius:10px;
  background:rgba(118,118,128,.16);
  color:rgba(255,255,255,.86);
  font:650 10px/1 -apple-system,BlinkMacSystemFont,"SF Pro Text",system-ui,sans-serif;
  cursor:pointer;
  -webkit-appearance:none;
  appearance:none;
}
.card .tl-range-actions button svg{width:14px;height:14px;display:block;}
.card .tl-range-actions button.primary{
  border-color:rgba(84,180,255,.36);
  background:linear-gradient(180deg,#168cff,#0877df);
  color:#fff;
  box-shadow:0 3px 10px rgba(10,132,255,.25),inset 0 1px 0 rgba(255,255,255,.18);
}
.card .tl-range-actions button:active{transform:scale(.96);}
.card .tl-track.range-grab{cursor:ns-resize !important;}
.card .tl-range-boundary.dragging{z-index:18;}
.card .tl-range-boundary.dragging>i{
  transform:translate(-50%,-50%) scale(1.10);
  box-shadow:0 0 0 1px rgba(84,180,255,.82),0 0 0 9px rgba(10,132,255,.18),0 7px 18px rgba(0,0,0,.40);
}
.card .tl-download-range.range-dragging .tl-range-actions{opacity:.72;}
@media (max-width:420px){
  .card .tl-range-boundary>span{left:16px;padding:4px 6px;font-size:9px;}
  .card .tl-range-boundary>span b{font-size:7px;}
  .card .tl-range-actions{right:7px;bottom:7px;gap:4px;padding:4px;}
  .card .tl-range-actions button{height:30px;padding:0 8px;}
  .card .tl-range-actions .primary span{display:none;}
  .card .tl-range-duration{min-width:36px;font-size:9px;}
}

/* Frigate-style exact-time scrub stills through HA-proxied VOD.
   unify LIVE/playhead overlays on the responsive timeline rail.
   Older visual layers left several fixed pixel offsets and an inherited full-width
   playhead span behind. Keep every horizontal reference tied to --tl-rail so the
   scrubber dot, scale ticks and recording rail cannot drift apart as card width
   changes. The LIVE badge and time squircle are separate foreground controls;
   their lines remain behind them. */
.card .tl-track.vertical .tl-scale-mark i{
  left:var(--tl-rail) !important;
  transform:translateX(-50%) !important;
  width:12px !important;
}
.card .tl-track.vertical .tl-scale-mark.hour i{
  left:var(--tl-rail) !important;
  transform:translateX(-50%) !important;
  width:19px !important;
}
.card .tl-track.vertical .tl-playhead{
  left:var(--tl-rail) !important;
  right:0 !important;
  height:2px !important;
  z-index:30 !important;
  overflow:visible !important;
  pointer-events:none !important;
}
.card .tl-track.vertical .tl-playhead i{
  left:0 !important;
  top:50% !important;
  width:20px !important;
  height:20px !important;
  transform:translate(-50%,-50%) !important;
  z-index:4 !important;
  pointer-events:auto !important;
}
.card .tl-track.vertical .tl-playhead span{
  position:absolute !important;
  left:clamp(58px,15vw,88px) !important;
  top:50% !important;
  width:max-content !important;
  min-width:0 !important;
  max-width:calc(100% - clamp(118px,28vw,170px)) !important;
  height:auto !important;
  min-height:0 !important;
  padding:4px 9px !important;
  transform:translateY(-50%) !important;
  display:inline-flex !important;
  align-items:center !important;
  justify-content:center !important;
  border:1px solid rgba(255,255,255,.18) !important;
  border-radius:8px !important;
  background:#0a84ff !important;
  color:#fff !important;
  opacity:1 !important;
  box-shadow:0 3px 10px rgba(0,0,0,.28),inset 0 1px 0 rgba(255,255,255,.16) !important;
  font:700 10px/1 -apple-system,BlinkMacSystemFont,"SF Pro Text",system-ui,sans-serif !important;
  font-variant-numeric:tabular-nums !important;
  white-space:nowrap !important;
  overflow:hidden !important;
  text-overflow:ellipsis !important;
  z-index:3 !important;
}
/* Do not let the LIVE line create a stacking context. Its red line therefore
   stays below the blue playhead, while the badge itself can sit above both. */
.card .tl-track.vertical .tl-live-line{
  z-index:auto !important;
}
.card .tl-track.vertical .tl-live-line::before{
  top:50% !important;
  transform:translateY(-50%) !important;
  z-index:45 !important;
  isolation:isolate;
}
/* At the actual live edge there is no need for a red line fighting the blue
   playhead. Keep only the red LIVE status pill over the blue scrubber line. */
.card .tl-track.vertical.following-live .tl-live-line{
  background:transparent !important;
  box-shadow:none !important;
}

/* Home Assistant visual-editor preview mode.
   HA's hui-card-preview lives in a compact side column. Keep the preview
   representative, but do not let the production timeline/player sizing make
   the editor dialog several screens tall or clip its controls. */
.card.editor-preview{
  border-radius:14px !important;
  box-shadow:none !important;
  contain:layout paint;
}
.card.editor-preview .feed-area{padding:6px 6px 0 !important;}
.card.editor-preview #eng-wrap,
.card.editor-preview .cam-grid{
  aspect-ratio:var(--stream-ar,16/9) !important;
  width:100% !important;
  height:auto !important;
  min-height:0 !important;
  max-height:190px !important;
  resize:none !important;
  border-radius:10px !important;
}
.card.editor-preview .stream-resize-grip{display:none !important;}
.card.editor-preview .stream-ctrl-bar{
  min-height:38px !important;
  margin:4px 0 0 !important;
  padding:3px !important;
  gap:3px !important;
}
.card.editor-preview .stream-ctrl-bar .media-nav-group{
  display:grid !important;
  grid-template-columns:repeat(4,minmax(0,1fr));
  width:100% !important;
  min-width:0 !important;
  flex:1 1 auto !important;
  gap:1px !important;
  padding:2px !important;
}
.card.editor-preview .media-nav-btn{
  width:100% !important;
  min-width:0 !important;
  height:31px !important;
  min-height:31px !important;
  padding:0 4px !important;
  gap:3px !important;
  font-size:9px !important;
}
.card.editor-preview .media-nav-btn svg,
.card.editor-preview .media-nav-btn ha-icon{
  width:13px !important;
  height:13px !important;
  --mdc-icon-size:13px !important;
  flex:0 0 13px !important;
}
.card.editor-preview .media-nav-btn span{
  display:block !important;
  min-width:0 !important;
  overflow:hidden !important;
  text-overflow:ellipsis !important;
  white-space:nowrap !important;
}
.card.editor-preview .scb-btn,
.card.editor-preview .rec-download-icon{
  width:32px !important;
  min-width:32px !important;
  height:32px !important;
}
.card.editor-preview .tl-sec{
  margin:0 !important;
  padding:7px 6px 7px !important;
}
.card.editor-preview .tl-head{
  min-height:0 !important;
  margin:0 0 6px !important;
  padding:0 !important;
}
.card.editor-preview .tl-tools{
  width:100% !important;
  gap:5px !important;
  justify-content:space-between !important;
}
.card.editor-preview .tool{
  min-width:32px !important;
  width:32px !important;
  height:32px !important;
  min-height:32px !important;
  padding:0 !important;
}
.card.editor-preview .tl-zoom-controls{
  flex:1 1 auto !important;
  min-width:0 !important;
  justify-content:center !important;
}
.card.editor-preview .tl-zoom-controls .tl-zoom-level{
  width:38px !important;
  min-width:38px !important;
}
.card.editor-preview .tl-track,
.card.editor-preview .tl-track.vertical{
  height:236px !important;
  min-height:236px !important;
  max-height:236px !important;
  margin-top:0 !important;
  border-radius:10px !important;
}
.card.editor-preview .t-preview{
  height:54px !important;
  width:min(150px,calc(100% - var(--tl-content) - 8px)) !important;
  border-radius:9px !important;
}
.card.editor-preview .t-preview .t-badge{font-size:8px !important;padding:2px 5px !important;}
.card.editor-preview .t-preview .t-preview-time,
.card.editor-preview .t-preview b{font-size:8px !important;padding:1px 4px !important;}
.card.editor-preview .legend{
  flex-wrap:nowrap !important;
  overflow:hidden !important;
  max-height:26px !important;
  margin-top:5px !important;
  padding-top:4px !important;
  gap:5px !important;
}
.card.editor-preview .legend .lg{
  flex:0 0 auto !important;
  font-size:8px !important;
  padding:2px 5px !important;
}
.card.editor-preview .media-gallery{padding:7px 5px !important;}
.card.editor-preview .media-gallery-head{margin-bottom:6px !important;min-height:30px !important;}
.card.editor-preview .media-gallery-grid{
  --media-row-h:56px !important;
  --media-row-gap:5px !important;
  height:178px !important;
}
.card.editor-preview .media-gallery-grid .ec,
.card.editor-preview .media-gallery-grid .rec,
.card.editor-preview .media-gallery-grid .rev{
  padding:6px !important;
}
.card.editor-preview .media-gallery-grid .et,
.card.editor-preview .media-gallery-grid .rev-th{
  width:64px !important;
  height:44px !important;
  flex-basis:64px !important;
}
.card.editor-preview .info-row,
.card.editor-preview .latest{display:none !important;}

/* deterministic player geometry.
   There are now exactly two sizing modes:
   1) no stream_height -> aspect_ratio (including Auto) owns the height;
   2) stream_height/runtime drag -> that explicit height owns the height.
   Do not reintroduce mobile/Sections max-height clamps here: they made both
   controls look broken because a hidden cap won the layout before either user
   setting could visibly change it. */
.card #eng-wrap{
  width:100% !important;
  height:auto !important;
  max-height:none !important;
  aspect-ratio:var(--stream-ar,16/9) !important;
}
.card:not(.stream-height-explicit) .cam-grid .grid-slot{
  aspect-ratio:var(--stream-ar,16/9) !important;
  min-height:0 !important;
}
.card.stream-height-explicit:not(.editor-preview) #eng-wrap{
  height:var(--stream-h) !important;
  max-height:none !important;
  aspect-ratio:auto !important;
}
.card.stream-height-explicit:not(.editor-preview).grid-mode .cam-grid{
  height:var(--stream-h) !important;
  max-height:none !important;
}
.card.stream-height-explicit:not(.editor-preview).grid-mode .cam-grid.cams-1,
.card.stream-height-explicit:not(.editor-preview).grid-mode .cam-grid.cams-2{
  grid-template-rows:minmax(0,1fr) !important;
}
.card.stream-height-explicit:not(.editor-preview).grid-mode .cam-grid.cams-3,
.card.stream-height-explicit:not(.editor-preview).grid-mode .cam-grid.cams-4{
  grid-template-rows:minmax(0,1fr) minmax(0,1fr) !important;
}
.card.stream-height-explicit:not(.editor-preview).grid-mode .grid-slot{
  aspect-ratio:auto !important;
  min-height:0 !important;
}

/* geometry survives late HA editor-preview detection.
   The earlier preview rules are intentionally superseded here. Runtime
   inline geometry remains the final authority, while these rules provide a
   stable fallback before JavaScript's first measurement. */
.card.editor-preview:not(.stream-height-explicit) #eng-wrap{
  width:min(100%,calc(280px * var(--stream-ar-num,1.7777778))) !important;
  height:auto !important;
  max-height:280px !important;
  aspect-ratio:var(--stream-ar,16/9) !important;
  margin-inline:auto !important;
}
.card.editor-preview.stream-height-explicit #eng-wrap{
  width:100% !important;
  height:min(var(--stream-h),280px) !important;
  max-height:280px !important;
  aspect-ratio:auto !important;
  margin-inline:0 !important;
}
.card #eng-wrap:fullscreen,.card #eng-wrap:-webkit-full-screen{
  width:100vw !important;height:100vh !important;max-height:none !important;
  aspect-ratio:auto !important;margin:0 !important;
}

/* custom accent authority. Several later Scrypted-style passes
   had hard-coded iOS blue, so accent_color changed only a subset of controls.
   Route the primary timeline/download selection affordances back through
   --c-acc/derived color-mix values so the editor/YAML setting is real. */
.card .tl-playhead{background:var(--c-acc) !important;box-shadow:0 0 10px color-mix(in srgb,var(--c-acc) 58%,transparent) !important;}
.card .tl-playhead i{background:var(--c-acc) !important;box-shadow:0 0 0 3px color-mix(in srgb,var(--c-acc) 24%,transparent),0 1px 5px rgba(0,0,0,.45) !important;}
.card .tl-playhead span{background:var(--c-acc) !important;}
.card .t-rec{background:color-mix(in srgb,var(--c-acc) 48%,transparent) !important;}
.card .rec-download-icon.range-active{background:color-mix(in srgb,var(--c-acc) 26%,transparent) !important;border-color:color-mix(in srgb,var(--c-acc) 48%,transparent) !important;box-shadow:0 0 0 1px color-mix(in srgb,var(--c-acc) 14%,transparent),0 4px 16px color-mix(in srgb,var(--c-acc) 18%,transparent) !important;}
.card .tl-range-band{background:linear-gradient(90deg,color-mix(in srgb,var(--c-acc) 22%,transparent),color-mix(in srgb,var(--c-acc) 10%,transparent) 62%,color-mix(in srgb,var(--c-acc) 4%,transparent)) !important;border-color:color-mix(in srgb,var(--c-acc) 62%,transparent) !important;}
.card .tl-range-boundary,.card .tl-range-start,.card .tl-range-end{color:var(--c-acc) !important;}
.card .rec-dl-btn{background:var(--c-acc) !important;}

/* final theme authority. Older design passes intentionally forced
   black surfaces with !important, which made the Light setting cosmetic. Keep
   video viewports black, but make every card/navigation/browser surface honor
   the resolved light theme. This block is last so it wins the legacy cascade. */
.card.theme-light{
  --c-bg:rgba(246,246,250,.96) !important;
  --c-bg-panel:rgba(0,0,0,.045) !important;
  --c-bg-panel2:rgba(0,0,0,.075) !important;
  --c-hairline:rgba(0,0,0,.10) !important;
  --c-border:rgba(60,60,67,.16) !important;
  --c-border2:rgba(60,60,67,.24) !important;
  --c-text:#1d1d1f !important;
  --c-text2:rgba(60,60,67,.72) !important;
  --c-text3:rgba(60,60,67,.52) !important;
  --c-text4:rgba(60,60,67,.34) !important;
  background:var(--c-bg) !important;
  color:var(--c-text) !important;
  border-color:rgba(0,0,0,.10) !important;
  box-shadow:0 10px 32px rgba(0,0,0,.13) !important;
}
.card.theme-light .layout,
.card.theme-light .col-left,
.card.theme-light .col-right,
.card.theme-light .feed-area,
.card.theme-light .tl-sec,
.card.theme-light .list-sec,
.card.theme-light .info-row,
.card.theme-light .latest,
.card.theme-light .media-gallery{background:var(--c-bg) !important;color:var(--c-text) !important;}
.card.theme-light .stream-ctrl-bar,
.card.theme-light .cam-switcher{background:rgba(250,250,252,.94) !important;border-color:rgba(0,0,0,.10) !important;}
.card.theme-light .stream-ctrl-bar .media-nav-group,
.card.theme-light .tl-zoom-controls{background:rgba(0,0,0,.045) !important;border-color:rgba(0,0,0,.10) !important;}
.card.theme-light .media-nav-btn{color:rgba(60,60,67,.72) !important;}
.card.theme-light .media-nav-btn.active{background:#1d1d1f !important;color:#fff !important;}
.card.theme-light .tool,
.card.theme-light .media-gallery-filter-btn,
.card.theme-light .legend .lg,
.card.theme-light .chip,
.card.theme-light .media-filter-chip{background:rgba(255,255,255,.90) !important;border-color:rgba(0,0,0,.11) !important;color:rgba(29,29,31,.76) !important;}
.card.theme-light .tool:hover,
.card.theme-light .media-filter-chip.on{background:rgba(0,0,0,.075) !important;color:#1d1d1f !important;}
.card.theme-light .tl-sec{border-bottom-color:rgba(0,0,0,.10) !important;}
.card.theme-light .tl-track.vertical{background:#f3f3f7 !important;border-color:rgba(0,0,0,.10) !important;box-shadow:inset 0 1px 0 rgba(255,255,255,.9) !important;}
.card.theme-light .tl-scale-mark span{color:rgba(60,60,67,.62) !important;}
.card.theme-light .tl-scale-mark i{background:rgba(60,60,67,.34) !important;}
.card.theme-light .t-preview{background:#fff !important;border-color:rgba(0,0,0,.10) !important;color:#1d1d1f !important;box-shadow:0 5px 16px rgba(0,0,0,.13) !important;}
.card.theme-light .t-glyph-stack{color:rgba(60,60,67,.68) !important;}
.card.theme-light .media-filter-panel{background:#fff !important;border-color:rgba(0,0,0,.10) !important;color:#1d1d1f !important;}
.card.theme-light .media-gallery-grid .ec,
.card.theme-light .media-gallery-grid .rec,
.card.theme-light .media-gallery-grid .rev{background:#fff !important;border-color:rgba(0,0,0,.08) !important;color:#1d1d1f !important;}
.card.theme-light .media-gallery-head .section-label{color:#1d1d1f !important;}
.card.theme-light .media-gallery-count,
.card.theme-light .media-filter-label,
.card.theme-light .em,
.card.theme-light .rsub,
.card.theme-light .rev-m{color:rgba(60,60,67,.62) !important;}
.card.theme-light #eng-wrap,
.card.theme-light .cam-grid,
.card.theme-light .grid-slot,
.card.theme-light .viewer{background:#000 !important;}

/* light-theme contrast authority. Earlier dark-first design passes
   left several icon children and one-pixel detection connectors explicitly
   white, so switching the surrounding surface to white made them disappear.
   Use semantic dark ink for light surfaces while keeping overlay controls that
   live directly on video white. */
.card.theme-light .scb-btn,
.card.theme-light .btn,
.card.theme-light .ico,
.card.theme-light .rec-download-icon{
  background:rgba(255,255,255,.94) !important;
  border-color:rgba(0,0,0,.14) !important;
  color:rgba(29,29,31,.82) !important;
  box-shadow:none !important;
}
.card.theme-light .scb-btn:hover,
.card.theme-light .btn:hover,
.card.theme-light .ico:hover,
.card.theme-light .rec-download-icon:hover{
  background:rgba(0,0,0,.07) !important;
  color:#1d1d1f !important;
}
.card.theme-light .media-gallery-grid .ico{
  background:rgba(0,0,0,.055) !important;
  border-color:rgba(0,0,0,.12) !important;
  color:rgba(29,29,31,.78) !important;
}
.card.theme-light .filter-panel,
.card.theme-light .cal-panel{
  background:rgba(255,255,255,.97) !important;
  border-color:rgba(0,0,0,.12) !important;
  color:#1d1d1f !important;
}
.card.theme-light .media-gallery-grid .empty-state{
  background:rgba(0,0,0,.025) !important;
  border-color:rgba(0,0,0,.08) !important;
  color:rgba(29,29,31,.72) !important;
}
.card.theme-light .t-glyph-stack{
  color:rgba(29,29,31,.74) !important;
}
.card.theme-light .t-ev.selected .t-glyph-stack{
  color:color-mix(in srgb,var(--c-acc) 82%,#1d1d1f) !important;
}
.card.theme-light .lg.tl-detection-legend i{
  color:rgba(29,29,31,.72) !important;
}
.card.theme-light .t-ev .t-connector{
  background:linear-gradient(90deg,rgba(60,60,67,.34),rgba(60,60,67,.15)) !important;
  opacity:.9 !important;
}
.card.theme-light .t-preview::after{
  background:rgba(60,60,67,.24) !important;
}
.card.theme-light .t-ev::before{
  background:rgba(60,60,67,.18) !important;
}
/* Buttons over the black video viewport should remain white-on-dark even in
   card Light mode. */
.card.theme-light #eng-wrap .btn,
.card.theme-light .grid-slot .btn,
.card.theme-light .grid-close-btn,
.card.theme-light .grid-fs-btn{
  color:#fff !important;
  background:rgba(18,18,20,.78) !important;
  border-color:rgba(255,255,255,.18) !important;
}

/* trim interaction authority. The range overlay must remain the
   top hit-test surface even with translucent theme materials/backdrop filters. */
.card .tl-track.vertical .tl-download-range{pointer-events:auto !important;touch-action:none !important;z-index:60 !important;}
.card .tl-track.vertical .tl-range-boundary{pointer-events:auto !important;z-index:12 !important;}
.card .tl-track.vertical .tl-range-actions{pointer-events:auto !important;z-index:20 !important;}

/* surface material authority. Custom background and/or the card
   transparency slider use the same final layer so late Light/Dark design passes
   cannot replace the requested glass tint/alpha. Actual video pixels stay black. */
.card.surface-override{
  background:var(--c-bg) !important;
}
.card.surface-override .layout,
.card.surface-override .col-left,
.card.surface-override .col-right,
.card.surface-override .feed-area,
.card.surface-override .tl-sec,
.card.surface-override .list-sec,
.card.surface-override .info-row,
.card.surface-override .latest,
.card.surface-override .media-gallery{
  background:var(--c-bg) !important;
}
.card.surface-override .stream-ctrl-bar,
.card.surface-override .cam-switcher,
.card.surface-override .media-filter-panel,
.card.surface-override .filter-panel,
.card.surface-override .cal-panel{
  background:var(--c-bg-panel) !important;
}
.card.surface-override .stream-ctrl-bar .media-nav-group,
.card.surface-override .cam-tabs,
.card.surface-override .tl-zoom-controls,
.card.surface-override .tool,
.card.surface-override .media-gallery-filter-btn,
.card.surface-override .chip,
.card.surface-override .media-filter-chip{
  background:var(--c-bg-panel2) !important;
}
.card.surface-override .tl-track.vertical,
.card.surface-override .media-gallery-grid .ec,
.card.surface-override .media-gallery-grid .rec,
.card.surface-override .media-gallery-grid .rev,
.card.surface-override .t-preview{
  background:var(--c-bg-panel) !important;
}
/* Never tint actual camera/video pixels. */
.card.surface-override #eng-wrap,
.card.surface-override .cam-grid,
.card.surface-override .grid-slot,
.card.surface-override .viewer,
.card.surface-override .t-preview-thumb{
  background:#000 !important;
}


/* ─────────────────────────────────────────────────────────────
   responsive dashboard workspace
   The card responds to its own container width. No viewport media query is
   used for the structural switch, so Lovelace Sections/Grid sizing is honored.
   ───────────────────────────────────────────────────────────── */
.card .layout{
  display:flex !important;
  flex-direction:column !important;
  width:100%;
  min-width:0;
}
.card .workspace-feed,
.card .workspace-timeline,
.card .workspace-media{min-width:0;box-sizing:border-box;}
.card .workspace-media{display:none;background:var(--c-bg) !important;}
.card .workspace-media .media-gallery{width:100%;box-sizing:border-box;}

/* Narrow cards preserve the original replacement model: media occupies the
   timeline's place below the stream instead of creating an empty timeline row. */
.card:not(.dashboard-split).gallery-active .workspace-timeline{display:none !important;}
.card:not(.dashboard-split).gallery-active .workspace-media{display:block !important;}

/* Medium/wide dashboard: stream and timeline become peers. If a browser is
   selected it spans the full row beneath them, which avoids squeezing either
   primary pane on tablet-sized landscape cards. */
.card.dashboard-split:not(.workstation) .layout{
  display:grid !important;
  grid-template-columns:minmax(0,1.42fr) minmax(330px,.88fr);
  grid-template-areas:
    "feed timeline"
    "media media";
  align-items:start;
  gap:10px;
  padding:10px;
  box-sizing:border-box;
}
.card.dashboard-split:not(.workstation) .workspace-feed{grid-area:feed;}
.card.dashboard-split:not(.workstation) .workspace-timeline{grid-area:timeline;}
.card.dashboard-split:not(.workstation) .workspace-media{grid-area:media;}
.card.dashboard-split.gallery-active:not(.workstation) .workspace-media{display:block !important;}
.card.dashboard-split:not(.workstation) .workspace-media{overflow:visible !important;border-left:0 !important;}
.card.dashboard-split:not(.workstation) .feed-area{padding:0 !important;}
.card.dashboard-split:not(.workstation) .workspace-timeline{
  height:var(--workspace-column-h,auto);
  padding:0 !important;
  border:0 !important;
  min-height:0;
}
.card.dashboard-split:not(.workstation) #timeline-view{
  height:100%;min-height:0;display:flex;flex-direction:column;
}
.card.dashboard-split:not(.workstation) .tl-track.vertical{
  flex:1 1 auto;
  height:auto !important;
  min-height:230px;
  max-height:none !important;
}

/* Full dashboard/workstation: video | timeline | selected browser. When Live is
   selected, the unused media column disappears and the first two panes expand. */
.card.workstation .layout{
  display:grid !important;
  grid-template-columns:minmax(470px,1.48fr) minmax(360px,.86fr);
  grid-template-areas:"feed timeline";
  align-items:start;
  gap:12px;
  padding:12px;
  box-sizing:border-box;
}
.card.workstation.gallery-active .layout{
  grid-template-columns:minmax(440px,1.36fr) minmax(340px,.82fr) minmax(330px,.82fr);
  grid-template-areas:"feed timeline media";
}
.card.workstation .workspace-feed{grid-area:feed;}
.card.workstation .workspace-timeline{grid-area:timeline;}
.card.workstation .workspace-media{grid-area:media;}
.card.workstation.gallery-active .workspace-media{display:flex !important;flex-direction:column;}
.card.workstation .feed-area{padding:0 !important;}
.card.workstation .workspace-timeline,
.card.workstation .workspace-media{
  height:var(--workspace-column-h,auto);
  min-height:0;
  overflow:hidden;
  border:1px solid var(--c-border) !important;
  border-radius:14px !important;
  background:var(--c-bg) !important;
}
.card.workstation .workspace-timeline{padding:10px !important;}
.card.workstation #timeline-view{
  height:100%;
  min-height:0;
  display:flex;
  flex-direction:column;
}
.card.workstation .tl-head{flex:0 0 auto;}
.card.workstation .filter-panel,
.card.workstation .cal-panel,
.card.workstation .tl-labels,
.card.workstation .legend{flex:0 0 auto;}
.card.workstation .tl-track.vertical{
  flex:1 1 auto;
  height:auto !important;
  min-height:220px;
  max-height:none !important;
  margin-bottom:0;
}
.card.workstation .workspace-media .media-gallery.open{
  display:flex !important;
  flex-direction:column;
  flex:1 1 auto;
  min-height:0 !important;
  height:100%;
  padding:10px !important;
  box-sizing:border-box;
}
.card.workstation .workspace-media .media-gallery-head,
.card.workstation .workspace-media .media-filter-panel{flex:0 0 auto;}
.card.workstation .workspace-media .media-gallery-grid{
  flex:1 1 auto !important;
  height:auto !important;
  min-height:0 !important;
  max-height:none !important;
  overflow-y:auto !important;
}
.card.workstation .workspace-media .media-gallery-grid .ec,
.card.workstation .workspace-media .media-gallery-grid .rec,
.card.workstation .workspace-media .media-gallery-grid .rev{
  flex:0 0 var(--media-row-h,76px) !important;
}
.card.workstation .cam-switcher{margin-top:8px;}

/* Custom glass/tint remains authoritative on the new wrapper columns. */
.card.surface-override .workspace-feed,
.card.surface-override .workspace-timeline,
.card.surface-override .workspace-media{background:var(--c-bg) !important;}

/* Never let old .wide rules force the feed column width after grid activation. */
.card.dashboard-split .col-left{width:auto !important;flex:none !important;}
.card.dashboard-split #eng-wrap{max-height:none;}

/* Fullscreen must remain isolated from responsive workspace sizing. */
.card #eng-wrap:fullscreen,
.card #eng-wrap:-webkit-full-screen,
.card #eng-wrap.live-pseudo-fullscreen{height:100vh !important;height:100dvh !important;max-height:none !important;}

`;

// ── src/utils/apply-method-groups.js ──
/**
 * Compose method-group property descriptors onto a prototype.
 *
 * Using descriptors preserves getters/setters and gives composition roots an
 * explicit, reviewable override order without side-effect prototype patches.
 */
function applyMethodGroups(target, ...groups) {
  for (const group of groups) {
    const descriptors = Object.getOwnPropertyDescriptors(group);
    delete descriptors.__proto__;
    Object.defineProperties(target, descriptors);
  }
}

// ── src/utils/date.js ──
/**
 * Small local-date helpers shared by the timeline calendar and editor-facing UI.
 *
 * Date-only values are deliberately interpreted in the browser's local timezone;
 * converting them through UTC would shift the selected day for many users.
 */

function parseLocalDateInput(value) {
  const match = String(value || '').match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day, 12, 0, 0, 0);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return {
    year,
    month,
    day,
    date,
    value: `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
  };
}

function localDateValue(timestampSeconds = Date.now() / 1000) {
  const date = new Date(Number(timestampSeconds) * 1000);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

function formatLocalDateInput(value, includeYear = false) {
  const parsed = parseLocalDateInput(value);
  if (!parsed) return '';

  return parsed.date.toLocaleDateString([], {
    month: 'short',
    day: 'numeric',
    ...(includeYear ? { year: 'numeric' } : {}),
  });
}

// ── src/card/state.js ──
/**
 * Initialize all mutable card state in one place.
 *
 * The card composes behavior from several focused method groups. Keeping their
 * shared state here makes lifecycle expectations explicit and prevents feature
 * modules from silently inventing constructor-only fields.
 */
function initializeCardState(card) {
  // Home Assistant / configuration lifecycle.
  card._hass = null;
  card._config = null;
  card._started = false;
  card._unsub = null;

  // Camera selection and per-camera caches.
  card._activeCamIdx = 0;
  card._camCache = {};
  card._viewMode = 'single';
  card._eventsMode = 'camera';
  card._cardWidth = 0;
  card._rotateTimer = null;

  // Frigate data currently displayed by the active camera/view.
  card._events = [];
  card._recordings = [];
  card._recordingsLoaded = false;
  card._recordingsRangeStart = null;
  card._recordingsRangeEnd = null;
  card._recordingsLoadedAt = 0;
  card._reviews = [];
  card._kept = [];
  card._recordingBrowse = [];
  card._loading = false;
  card._exhausted = false;
  card._daysWithActivity = new Set();

  // Primary view / media-browser state.
  card._tab = 'live';
  card._browseOpen = false;
  card._showReviewed = false;
  card._initialMediaStateApplied = false;
  card._playbackReturnViewMode = null;
  card._filterLabel = 'all';
  card._filterFace = 'all';
  card._filterZone = 'all';
  card._favOnly = false;
  card._calMonth = null;
  card._mediaFilter = {
    camera: 'all',
    label: 'all',
    face: 'all',
    zone: 'all',
    favorites: false,
    reviewed: 'all',
    severity: 'all',
    duration: 'all',
    date: 'all',
    timeStart: '',
    timeEnd: '',
  };
  card._mediaPickerApplyTimer = null;
  card._mediaPickerReleaseTimer = null;
  card._mediaPickerActive = false;
  card._mediaPickerActiveId = '';
  card._mediaPickerPendingFilterRender = false;
  card._mediaPickerPendingGalleryRender = false;

  // Timeline viewport, caches, interaction and request generations.
  card._winStart = 0;
  card._winEnd = 0;
  card._timelineSelected = null;
  card._timelineFocusTs = null;
  card._scrubTarget = null;
  card._timelineZoom = 6;
  card._timelineZoomMin = 1 / 24;
  card._timelineZoomMax = 12;
  card._timelineLoadSeq = 0;
  card._timelineDataSeq = 0;
  card._timelineSeekSeq = 0;
  card._timelineDynamicTimer = null;
  card._timelineDynamicTimerMode = '';
  card._timelineDynamicActive = false;
  card._timelineDynamicPending = false;
  card._timelineDynamicLastAt = 0;
  card._timelineThumbCache = new Map();
  card._timelineEventCache = new Map();
  card._timelineDataDirty = false;
  card._scrubAbort = null;
  card._scrubTrack = null;
  card._scrollAbort = null;

  // Recorded/event playback lifecycle.
  card._playing = null;
  card._playingHour = null;
  card._playSeq = 0;
  card._playbackLoadSeq = 0;
  card._playbackTimer = null;
  card._activePlaybackCleanup = null;
  card._playbackSession = null;
  card._downloadRange = null;

  // Live video / fullscreen state.
  card._engine = null;
  card._streamMuted = true;
  card._go2rtcMountPromise = null;
  card._go2rtcLive = null;
  card._liveAudioEnabled = false;
  card._liveAudioAvailable = false;
  card._liveFsMirror = null;
  card._liveFsRecoverySeq = 0;
  card._livePseudoFullscreen = false;
  card._rtcDebug = { answer: '', candidates: [], tracks: [], errors: [] };

  // Two-way audio / microphone state.
  card._talkActive = false;
  card._talkPC = null;
  card._talkWS = null;
  card._talkMic = null;
  card._talkAudio = null;
  card._talkUsingLivePC = false;
  card._talkMicReadyPromise = null;
  card._micDesiredMute = true;
  card._micForbidden = false;
  card._microphonePresent = null;
  card._micDeviceChangeHandler = null;
  card._micDisconnectTimer = null;

  // DOM/event bookkeeping.
  card._domCache = {};
  card._clickListenerBound = false;
  card._mediaImageListenerBound = false;
}

// ── src/card/core.js ──
/**
 * Home Assistant lifecycle, normalized configuration and shared card-level utilities.
 */
const coreMethods = {
setConfig(config) {
    config = (config && typeof config === 'object') ? config : {};
    let cameras = [];
    const rootGo2rtc = (config.go2rtc && typeof config.go2rtc === 'object') ? config.go2rtc : {};
    if (Array.isArray(config.cameras)) {
      cameras = config.cameras.map(c => {
        if (typeof c === 'string') return { entity:c, name:null, frigate_client_id:null, go2rtc_stream:null };
        const g = (c?.go2rtc && typeof c.go2rtc === 'object') ? c.go2rtc : {};
        return { entity:c?.entity || c?.camera_entity || c?.camera || '', name:c?.name||null, frigate_client_id:c?.frigate_client_id || g.frigate_client_id || null, go2rtc_stream:c?.go2rtc_stream || g.stream || null };
      }).filter(c => c.entity);
    }
    const singleEntity = config.camera_entity || config.entity || config.camera;
    if (!cameras.length && singleEntity) cameras = [{ entity:singleEntity, name:config.title||null, frigate_client_id:config.frigate_client_id || rootGo2rtc.frigate_client_id || null, go2rtc_stream:config.go2rtc_stream || rootGo2rtc.stream || null }];
    this._configError = cameras.length ? null : 'Select a Frigate camera entity.';
    if (!cameras.length) cameras = [{ entity:'', name:null, go2rtc_stream:null, frigate_client_id:null }];
    if (cameras.length > 4) cameras = cameras.slice(0, 4);

    const timelineIn = (config.timeline && typeof config.timeline === 'object') ? config.timeline : {};
    const downloadIn = (config.download && typeof config.download === 'object') ? config.download : {};
    const mediaIn = (config.media && typeof config.media === 'object') ? config.media : {};
    const num = (v, fallback, lo, hi) => { const n=Number(v); return Number.isFinite(n) ? Math.max(lo,Math.min(hi,n)) : fallback; };
    const timeline = {
      enabled: timelineIn.enabled !== false,
      default_minutes: num(timelineIn.default_minutes,10,5,60),
      show_thumbnails: timelineIn.show_thumbnails !== false,
      show_glyphs: timelineIn.show_glyphs !== false,
      show_legend: timelineIn.show_legend !== false,
      show_zoom_controls: timelineIn.show_zoom_controls !== false,
      show_filter_button: timelineIn.show_filter_button !== false,
      show_calendar_button: timelineIn.show_calendar_button !== false,
      clustering: timelineIn.clustering !== false,
      same_label_cluster_seconds: num(timelineIn.same_label_cluster_seconds,12,0,120),
      visual_cluster_max_seconds: num(timelineIn.visual_cluster_max_seconds,60,0,300),
      glyph_min_px: num(timelineIn.glyph_min_px,20,12,40),
      glyph_max_px: num(timelineIn.glyph_max_px,30,12,48),
      max_glyphs: Math.round(num(timelineIn.max_glyphs,3,1,6)),
      max_thumbnails: Math.round(num(timelineIn.max_thumbnails,12,0,24)),
      thumbnail_size: Math.round(num(timelineIn.thumbnail_size,84,48,140)),
    };
    if(timeline.glyph_max_px<timeline.glyph_min_px) timeline.glyph_max_px=timeline.glyph_min_px;
    const downloadMaxMinutes=num(downloadIn.max_range_minutes,120,1,720);
    const download = { default_range_seconds: Math.min(Math.round(downloadMaxMinutes*60),Math.round(num(downloadIn.default_range_seconds,60,2,1800))), max_range_minutes: downloadMaxMinutes };
    const reviewedDefault=['all','unreviewed','reviewed'].includes(mediaIn.reviewed_default) ? mediaIn.reviewed_default : 'all';
    const media = { reviewed_default: reviewedDefault };
    const rawAspect=config.aspect_ratio==null || String(config.aspect_ratio).trim()==='' ? 'auto' : String(config.aspect_ratio).trim();
    const aspectValid = rawAspect==='auto' || /^(\d+(?:\.\d+)?)\s*[:/]\s*(\d+(?:\.\d+)?)$/.test(rawAspect) || (Number.isFinite(Number(rawAspect)) && Number(rawAspect)>0);
    const streamHeightNum=Number(config.stream_height);
    const hiddenTabs = Array.isArray(config.hidden_tabs) ? config.hidden_tabs.filter(x=>['clips','recordings','reviews'].includes(String(x))) : [];
    const requestedDefaultTab = ['live','clips','recordings','reviews'].includes(String(config.default_tab||'')) ? String(config.default_tab) : 'live';
    const defaultTab = requestedDefaultTab !== 'live' && hiddenTabs.includes(requestedDefaultTab) ? 'live' : requestedDefaultTab;

    this._config = {
      cameras,
      window_hours: Math.max(1,Math.min(720,Number(config.window_hours)||24)),
      refresh_seconds: Math.max(15,Math.min(3600,Number(config.refresh_seconds)||45)),
      rotate_seconds: num(config.rotate_seconds,0,0,3600),
      rotate_on_load: config.rotate_on_load === true && cameras.length > 1,
      default_view: (config.default_view === 'grid' && cameras.length > 1) ? 'grid' : 'single',
      hidden_tabs: hiddenTabs,
      default_tab: defaultTab,
      autoplay_latest_clip: config.autoplay_latest_clip === true,
      stream_height: Number.isFinite(streamHeightNum) && streamHeightNum>0 ? Math.max(20,Math.min(100,streamHeightNum)) : null,
      stream_type: config.stream_type === 'hls' ? 'hls' : 'webrtc',
      aspect_ratio: aspectValid ? rawAspect : 'auto',
      stream_resizable: config.stream_resizable === true,
      theme: ['light','dark','auto'].includes(config.theme) ? config.theme : 'dark',
      accent_color: config.accent_color || null,
      bg_color: config.bg_color || null,
      transparency: num(config.transparency ?? config.card_transparency ?? config.background_transparency,0,0,100),
      timeline,
      download,
      media,
      frigate_client_id: config.frigate_client_id || rootGo2rtc.frigate_client_id || cameras.find(c => c.frigate_client_id)?.frigate_client_id || null,
      two_way_audio: config.two_way_audio === true,
      two_way_audio_disconnect_seconds: Number.isFinite(Number(config.two_way_audio_disconnect_seconds)) ? Math.max(0, Number(config.two_way_audio_disconnect_seconds)) : 90,
    };
    this._browseOpen = false;
    this._showReviewed = this._config.media.reviewed_default !== 'unreviewed';
    if(this._mediaFilter) this._mediaFilter.reviewed=this._config.media.reviewed_default;
    if (this._galleryMode && this._config.hidden_tabs.includes(this._galleryMode)) { this._galleryMode=''; this._tab='live'; }
    for (const c of cameras) { if (!this._camCache[c.entity]) this._camCache[c.entity] = mkCamState(); }
    this._renderShell();
    this._setupMicrophoneDetection();
  },

set hass(hass) {
    this._hass = hass;
    if (!this._config) return;
    if (!this._started) { this._started = true; this._start(); return; }
    if (this._engine) {
      try { this._engine.hass = hass; } catch(_) {}
      const ent = this._activeCam?.entity;
      const newState = hass.states[ent]?.state;
      if (ent && newState !== this._lastEngineState) {
        this._lastEngineState = newState;
        if ('stateObj' in this._engine) { try { this._engine.stateObj = this._streamStateObj(ent); } catch(_) {} }
      }
    }
    if(!(this._mediaPickerActive && this._galleryMode)) {
      this._syncStatus();
      if (this._config.theme === 'auto') this._applyCardStyle();
    }
  },

get _activeCam() { return this._config?.cameras[this._activeCamIdx] || this._config?.cameras[0]; },

async _applyInitialMediaState() {
    if(this._initialMediaStateApplied) return;
    this._initialMediaStateApplied=true;
    const tab=this._config?.default_tab||'live';
    if(tab==='live') return;
    await this._setGalleryMode(tab);
    if(tab!=='clips' || !this._config?.autoplay_latest_clip || this._galleryMode!=='clips') return;
    const source=this._eventsMode==='all'?this._allDisplayEvents():this._events;
    const latest=this._filterMediaEvents(source).filter(ev=>ev?.has_clip).sort((a,b)=>Number(b.start_time||0)-Number(a.start_time||0))[0];
    if(latest) await this._showClip(latest);
  },

_isEditorPreview() {
    let node=this;
    const editorTags=new Set(['hui-card-preview','hui-dialog-edit-card','hui-card-element-editor','hui-card-editor','hui-dialog-edit-card']);
    for(let i=0;i<14 && node;i++){
      const tag=String(node.tagName||'').toLowerCase();
      if(editorTags.has(tag)) return true;
      const cls=String(node.className||'');
      if(/(^|\s)(card-preview|preview-card|edit-card-preview)(\s|$)/i.test(cls)) return true;
      if(node.parentElement){ node=node.parentElement; continue; }
      const root=node.getRootNode?.();
      node=(root && root.host && root.host!==node) ? root.host : null;
    }
    return false;
  },

getCardSize() { return 10; },
getGridSize() { return { columns: 2, rows: 3 }; },

disconnectedCallback() {
    this._stopRotate(); this._cancelActivePlayback(); this._stopTalk();
    if (this._refresh) clearInterval(this._refresh);
    if (this._timelineClockTimer) clearInterval(this._timelineClockTimer);
    clearTimeout(this._timelineDataTimer); clearTimeout(this._timelineDynamicTimer); this._timelineDynamicTimer=null; this._timelineDynamicPending=false;
    clearTimeout(this._wt); clearTimeout(this._mediaPickerApplyTimer); clearTimeout(this._mediaPickerReleaseTimer);
    this._mediaPickerActive=false; this._mediaPickerActiveId=''; this._mediaPickerPendingFilterRender=false; this._removeLiveFsMirror();
    if (this._scrubAbort) { try { this._scrubAbort.abort(); } catch(_) {} this._scrubAbort=null; }
    this._scrubTrack=null;
    if (this._scrollAbort) { try { this._scrollAbort.abort(); } catch(_) {} this._scrollAbort=null; }
    ++this._timelineLoadSeq; ++this._timelineDataSeq; ++this._timelineSeekSeq;
    if (this._unsub) { try { this._unsub.then(u=>u&&u()); } catch(_) {} this._unsub=null; }
    if (this._timelineResizeRaf) cancelAnimationFrame(this._timelineResizeRaf); this._timelineResizeRaf=0;
    if (this._ro) this._ro.disconnect();
    if (this._micDeviceChangeHandler && navigator.mediaDevices?.removeEventListener) { try { navigator.mediaDevices.removeEventListener('devicechange', this._micDeviceChangeHandler); } catch (_) {} }
    this._micDeviceChangeHandler=null;
  },

async _start() {
    if (this._configError || !this._activeCam?.entity) { this._renderAll(); return; }
    await this._discoverAll();
    this._setupMicrophoneDetection();
    this._loadFrigateFilterMetadata();
    const now = Math.floor(Date.now()/1000);
    this._timelineFocusTs = now;
    const initialTimelineSpan=this._timelineDefaultSpanSeconds();
    this._winStart = now - initialTimelineSpan/2; this._winEnd = now + initialTimelineSpan/2; this._timelineZoom = 3600/initialTimelineSpan;
    this._timelineFollowingLive = true; this._timelineWasLiveBeforeGesture = false; this._timelineLiveCrossed = false;
    if (this._config.default_view === 'grid' && this._config.cameras.length > 1) this._setViewMode('grid');
    await this._mountEngine();
    await this._loadWindow(true, true);
    await this._applyInitialMediaState();
    this._loadCalendar(); this._subscribe();
    this._refresh = setInterval(() => { if (this._isNowWindow()) this._loadWindow(true); this._loadFrigateFilterMetadata(); }, this._config.refresh_seconds*1000);
    if (this._timelineClockTimer) clearInterval(this._timelineClockTimer);
    this._timelineClockTimer = setInterval(() => {
      if (!this.isConnected || this._galleryMode || this._timelineInteracting) return;
      this._updateTimelineLive();
      if (this._timelineFollowingLive) this._scheduleTimelineDynamicData('live');
    }, 1000);
    if (this._config.rotate_on_load === true && this._config.cameras.length > 1) this._startRotate();
    this._setupResizeObserver(); this._stabilizeInitialTimeline();
  }
};

// ── src/card/live/discovery.js ──
/**
 * Camera discovery and Home Assistant camera-entity adaptation.
 *
 * Methods are composed onto SightlineCard.prototype; method names are kept
 * stable so existing card behavior and tests remain unchanged.
 */
const liveDiscoveryMethods = {
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

// ── src/card/live/engine.js ──
/**
 * Live engine mounting and teardown for HA camera streams and go2rtc.
 *
 * Methods are composed onto SightlineCard.prototype; method names are kept
 * stable so existing card behavior and tests remain unchanged.
 */
const liveEngineMethods = {
_unmountEngine() {
    ++this._liveFsRecoverySeq;
    if (this._liveFsCleanup) {
      try { this._liveFsCleanup(); } catch (_) {}
      this._liveFsCleanup = null;
    }
    // Never leave the visual iOS fullscreen shell behind when the live engine
    // is intentionally unmounted (camera switch, playback, card teardown).
    const wrap=this.shadowRoot?.querySelector('#eng-wrap');
    if(wrap){
      wrap.classList.remove('live-pseudo-fullscreen');
      wrap.querySelector('.live-fs-exit')?.remove();
    }
    this._livePseudoFullscreen=false;
    this._removeLiveFsMirror();
    const engine = this.shadowRoot?.querySelector('#engine');
    if (engine) engine.innerHTML = '';
    this._engine = null;
  },

async _mountEngine() {
    const slot = this.shadowRoot.querySelector('#engine'); if (!slot) return;
    const entity = this._activeCam?.entity; if (!entity) return;
    slot.innerHTML = '<div class="ph skel-stream"></div>';
    this._engine = null;

    // When two-way audio is enabled and a go2rtc source is configured, use the
    // same Frigate-proxied go2rtc WebRTC session for video, camera audio and microphone send.
    // This mirrors Advanced Camera Card's VideoRTC architecture and avoids a
    // second talkback peer competing with the live player.
    if (this._config.two_way_audio && this._talkStreamName() && this._go2rtcEndpoint()) {
      try {
        // If Talk is being started or is already active, never create a
        // receive-only peer while the microphone acquisition is in flight.
        // On iOS this can race a render/remount and permanently leave the
        // successful peer with no sendonly audio transceiver.
        if (this._talkSpeaking && this._talkMicReadyPromise) {
          try { await this._talkMicReadyPromise; } catch (_) {}
        }
        await this._mountGo2RTCVideo(this._talkSpeaking ? this._talkMic : null);
        return;
      } catch (e) {
        console.warn('[Frigate] go2rtc live provider failed, falling back to HA camera stream', e);
        this._destroyGo2RTCLive();
      }
    }

    const stateObj = this._streamStateObj(entity);
    if (!stateObj) return;
    const s = document.createElement('ha-camera-stream');
    s.hass = this._hass;
    s.stateObj = stateObj;
    s.controls = true;
    s.muted = this._streamMuted;
    s.style.cssText = 'width:100%;height:100%;display:block';
    slot.innerHTML = ''; slot.appendChild(s);
    this._engine = s;
    // iOS native video fullscreen can interrupt a live WebRTC MediaStream.
    // Wire the nested HA player as soon as it exists; the helper retries until
    // ha-camera-stream has created its internal <video> element.
    this._wireLiveFsNudge(s);
    this._renderStreamCtrl();
  }
};

// ── src/card/live/webrtc.js ──
/**
 * Frigate-proxied go2rtc WebRTC negotiation, diagnostics, and cleanup.
 *
 * Methods are composed onto SightlineCard.prototype; method names are kept
 * stable so existing card behavior and tests remain unchanged.
 */
const liveWebRtcMethods = {
_rtcDbg(_label, _data = null) {},

_rtcSafe(v) {
    if (v == null) return v;
    if (typeof v === 'string') return v.length > 1200 ? v.slice(0,1200) + '…' : v;
    if (v instanceof Error) return { name:v.name, message:v.message, stack:v.stack };
    try { return JSON.parse(JSON.stringify(v)); } catch (_) { return String(v); }
  },

_rtcRedactUrl(value) {
    try {
      const u = new URL(String(value), location.origin);
      if (u.searchParams.has('authSig')) u.searchParams.set('authSig', '[redacted]');
      return u.toString();
    } catch (_) { return String(value ?? ''); }
  },

_rtcAudioDiagnostics(pc, microphoneStream) {
    try {
      const tx = pc?.getTransceivers?.() || [];
      const audioTx = tx.filter(t => t.sender?.track?.kind === 'audio' || t.receiver?.track?.kind === 'audio');
      return {
        microphoneTracks: microphoneStream?.getAudioTracks?.().map(t => ({ id:t.id, readyState:t.readyState, enabled:t.enabled, muted:t.muted, label:t.label })) || [],
        audioTransceivers: audioTx.map((t,i) => ({
          i, mid:t.mid, direction:t.direction, currentDirection:t.currentDirection,
          senderTrack:t.sender?.track ? {id:t.sender.track.id,readyState:t.sender.track.readyState,enabled:t.sender.track.enabled,muted:t.sender.track.muted} : null,
          senderKind:t.sender?.track?.kind || null, receiverKind:t.receiver?.track?.kind || null
        }))
      };
    } catch (e) { return {error:this._rtcSafe(e)}; }
  },

async _rtcAudioStats(pc) {
    try {
      const stats = await pc?.getStats?.();
      const out = [];
      stats?.forEach(r => {
        if (r.type === 'outbound-rtp' && r.kind === 'audio') out.push({
          id:r.id, kind:r.kind, packetsSent:r.packetsSent, bytesSent:r.bytesSent,
          packetsLost:r.packetsLost, targetBitrate:r.targetBitrate, codecId:r.codecId,
          remoteId:r.remoteId
        });
      });
      return out;
    } catch (e) { return [{error:this._rtcSafe(e)}]; }
  },

async _signFrigateWsUrl(endpoint, src) {
    const raw = String(endpoint || '');
    if (!raw) throw new Error('Missing go2rtc WebSocket endpoint');
    let u;
    try { u = new URL(raw); } catch (_) { throw new Error('Invalid go2rtc WebSocket endpoint'); }
    const pageWsOrigin = location.origin.replace(/^http/i, 'ws');
    const sameOrigin = u.origin === pageWsOrigin;
    if (!sameOrigin || !u.pathname.startsWith('/api/frigate/')) {
      throw new Error('Refusing non-Home-Assistant Frigate WebSocket endpoint');
    }
    const path = `${u.pathname}${u.search}${u.search ? '&' : '?'}src=${encodeURIComponent(src)}`;
    if (!this._hass?.callWS) throw new Error('Home Assistant connection is unavailable for WebSocket authentication');
    const signed = await this._hass.callWS({ type:'auth/sign_path', path, expires:300 });
    if (!signed?.path) throw new Error('Home Assistant did not return a signed WebSocket path');
    const signedUrl = new URL(signed.path, location.origin);
    signedUrl.protocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
    return { url:signedUrl.toString(), authMode:'ha_signed_path', signedPath:signed.path };
  },

_rtcSdpSummary(sdp) {
    if (!sdp) return null;
    const lines=sdp.split(/\r?\n/);
    const media=lines.filter(x=>/^m=|^a=mid:|^a=sendrecv|^a=sendonly|^a=recvonly|^a=inactive|^a=rtpmap:|^a=fmtp:|^a=ice-ufrag:|^a=ice-pwd:|^a=fingerprint:|^a=setup:|^a=candidate:/.test(x));
    return media.join('\n');
  },

_go2rtcEndpoint() {
    // Browser-side live WebRTC is always routed through the Frigate Home
    // Assistant integration. Never honor a direct go2rtc/Frigate host URL:
    // doing so breaks remote access, SSL/auth setups, HA Companion networking,
    // and multi-instance routing.
    const discovered=this._cc?.()?.clientId;
    const clientId = this._activeCam?.frigate_client_id || discovered || this._config.frigate_client_id || 'frigate';
    return `${location.origin.replace(/^http/i,'ws')}/api/frigate/${encodeURIComponent(String(clientId))}/go2rtc/ws/api/ws`;
  },

async _mountGo2RTCVideo(microphoneStream=null) {
    // A lifecycle/render-triggered remount must inherit the active Talk
    // microphone. Otherwise it can replace a working sendonly peer with a
    // receive-only peer, which is exactly what the iOS diagnostic exposed.
    if (!microphoneStream && this._talkSpeaking && this._talkMic) microphoneStream=this._talkMic;
    if (this._go2rtcMountPromise) {
      try { await this._go2rtcMountPromise; } catch (_) {}
      if (this._go2rtcLive?.pc && (!microphoneStream || this._microphoneTransceiver)) return this._go2rtcLive.video;
    }
    const runMount = async () => {
    const slot=this.shadowRoot.querySelector('#engine');
    if(!slot) throw new Error('Live engine not available');

    // Preserve the existing live <video> element when Talk starts.  Replacing
    // it after getUserMedia() resolves loses the original user-activation
    // context on Safari/iOS (and can also interrupt desktop autoplay).  The
    // same media element can safely receive the new WebRTC MediaStream after
    // the microphone-enabled peer is negotiated.
    const existingVideo = slot.querySelector('video');
    this._destroyGo2RTCLive(!!existingVideo);
    const video=existingVideo || document.createElement('video');
    video.autoplay=true; video.playsInline=true; video.controls=true; video.preload='auto';
    if (!existingVideo) video.muted=!this._liveAudioEnabled;
    video.volume=1;
    video.style.cssText='width:100%;height:100%;display:block';

    if (!existingVideo) { slot.innerHTML=''; slot.appendChild(video); }
    this._watchAutoAspectMedia(video);

    // Port the proven Advanced Camera Card/go2rtc Safari flow: ordinary live
    // playback has only recvonly video/audio. The microphone is added only
    // when Talk is actually active, matching ACC's documented call lifecycle.
    const pc=new RTCPeerConnection({bundlePolicy:'max-bundle',iceServers:[{urls:['stun:stun.cloudflare.com:3478','stun:stun.l.google.com:19302']}],sdpSemantics:'unified-plan'});
    pc.addEventListener('connectionstatechange',()=>this._rtcDbg('connectionstatechange',{state:pc.connectionState,ice:pc.iceConnectionState}));
    let micTx=null;
    if(microphoneStream?.getAudioTracks()?.length) micTx=pc.addTransceiver(microphoneStream.getAudioTracks()[0],{direction:'sendonly'});
    pc.addTransceiver('video',{direction:'recvonly'});
    pc.addTransceiver('audio',{direction:'recvonly'});
    this._liveAudioAvailable=false; this._microphoneTransceiver=micTx;

    const endpoint=this._go2rtcEndpoint(); const src=this._talkStreamName();
    if(!endpoint || !src) throw new Error('Missing go2rtc endpoint or stream');
    let signedWs;
    try {
      signedWs=await this._signFrigateWsUrl(endpoint,src);
    } catch (e) {
      throw e;
    }
    const wsUrl=signedWs.url;
    this._rtcDbg('WS CONSTRUCTOR INPUT', {
      url:this._rtcRedactUrl(wsUrl),
      endpoint:this._rtcRedactUrl(endpoint),
      stream:src,
      authMode:signedWs.authMode,
      signedPath: signedWs.authMode==='ha_signed_path' ? '[present]' : null,
      pageOrigin:location.origin,
      pageProtocol:location.protocol,
      pageHref:location.href.split('#')[0],
      sameOrigin:(()=>{try{return new URL(endpoint).origin===location.origin.replace(/^http/i,'ws')}catch(_){return null}})(),
      cookiesPresent:!!document.cookie,
      cookieNames:document.cookie ? document.cookie.split(';').map(x=>x.split('=')[0].trim()).filter(Boolean) : []
    });
    let ws;
    try {
      ws=new WebSocket(wsUrl);
    } catch (e) {
      throw e;
    }
    ws.binaryType='arraybuffer';
    this._go2rtcLive={video,pc,ws,stream:null,microphoneStream}; this._engine=video; this._talkPC=pc; this._talkWS=ws; this._talkUsingLivePC=true;
    video.setAttribute('playsinline','');
    video.setAttribute('webkit-playsinline','');
    // Native AVPlayer fullscreen is unreliable for a video.srcObject WebRTC
    // feed on iOS. Keep this exact element/peer alive and convert native
    // fullscreen attempts into our visual fullscreen shell instead.
    this._wireLiveFsNudge(video);

    pc.addEventListener('icecandidate',ev=>{
      if(ev.candidate && ws.readyState===WebSocket.OPEN) { const c=ev.candidate.toJSON(); this._rtcDebug.candidates.push({direction:'out',candidate:c}); this._rtcDbg('send ICE candidate',c); ws.send(JSON.stringify({type:'webrtc/candidate',value:c.candidate})); }
      if(!ev.candidate && ws.readyState===WebSocket.OPEN) ws.send(JSON.stringify({type:'webrtc/candidate',value:''}));
    });

    pc.addEventListener('connectionstatechange',()=>{
      if(!this._go2rtcLive || this._go2rtcLive.pc!==pc) return;
      if(pc.connectionState==='connected') {
        const tx=pc.getTransceivers();
        const tracks=tx.filter(tr=>tr.currentDirection==='recvonly').map(tr=>tr.receiver.track).filter(Boolean);
        this._rtcDebug.tracks=tracks.map(t=>({kind:t.kind,id:t.id,readyState:t.readyState,muted:t.muted,enabled:t.enabled}));
        const video2=document.createElement('video');
        video2.autoplay=true; video2.playsInline=true; video2.muted=true; video2.preload='auto';
        video2.addEventListener('loadeddata',()=>{
          if(!this._go2rtcLive || this._go2rtcLive.pc!==pc) return;
          const stream=video2.srcObject; if(!(stream instanceof MediaStream)) { this._rtcDbg('TEMP VIDEO has no MediaStream'); return; }
          this._go2rtcLive.stream=stream; this._liveAudioAvailable=stream.getAudioTracks().length>0;
          video.srcObject=stream;
          video.muted=!this._liveAudioEnabled;
          video.volume=1;
          video.setAttribute('playsinline','');
          video.play().catch(()=>{});
          if (this._liveAudioEnabled) {
            // If iOS replaced the media element during Talk startup, retry
            // playback on the next media-ready tick without introducing a
            // second audio control.
            const resumeAudio = () => {
              if (!this._go2rtcLive || this._go2rtcLive.pc!==pc) return;
              try { video.muted=false; video.volume=1; const p=video.play(); if(p?.catch)p.catch(()=>{}); } catch (_) {}
            };
            video.addEventListener('canplay', resumeAudio, {once:true});
            video.addEventListener('loadedmetadata', resumeAudio, {once:true});
            setTimeout(resumeAudio, 250);
          }
          video2.srcObject=null; this._renderStreamCtrl();
        },{once:true});
        video2.srcObject=new MediaStream(tracks);
        video2.play().catch(()=>{});
      } else if(pc.connectionState==='failed' || pc.connectionState==='disconnected') {
        pc.close();
        this._setStatusOverlay('error','Live stream disconnected','Unable to maintain the go2rtc WebRTC connection.',{retry:true,retryHandler:()=>this._mountGo2RTCVideo(this._talkMic)});
      }
    });

    let remoteDescriptionSet=false; const pendingCandidates=[];
    let answerResolve,answerReject; const answerPromise=new Promise((resolve,reject)=>{answerResolve=resolve;answerReject=reject;});
    ws.addEventListener('message',async ev=>{
      if(typeof ev.data!=='string') return;
      try { const msg=JSON.parse(ev.data);
        if(msg.type==='webrtc/candidate') { if(!msg.value) {this._rtcDbg('remote ICE end'); return;} const candidate={candidate:msg.value,sdpMid:'0'}; this._rtcDebug.candidates.push({direction:'in',candidate}); if(remoteDescriptionSet){try{await pc.addIceCandidate(candidate);this._rtcDbg('remote ICE added');}catch(e){this._rtcDbg('remote ICE add FAILED',e);}} else pendingCandidates.push(candidate); }
        else if(msg.type==='webrtc/answer') { this._rtcDebug.answer=this._rtcSdpSummary(msg.value); try{await pc.setRemoteDescription({type:'answer',sdp:msg.value}); this._rtcDbg('remote description set',{type:pc.remoteDescription?.type,transceivers:pc.getTransceivers().map((t,i)=>({i,mid:t.mid,direction:t.direction,currentDirection:t.currentDirection,kind:t.receiver.track?.kind,track:t.receiver.track?.id,senderKind:t.sender.track?.kind})),audio:this._rtcAudioDiagnostics(pc,microphoneStream)}); remoteDescriptionSet=true; while(pendingCandidates.length){const c=pendingCandidates.shift(); try{await pc.addIceCandidate(c);this._rtcDbg('queued ICE added');}catch(e){this._rtcDbg('queued ICE FAILED',e);}} answerResolve();}catch(e){this._rtcDebug.errors.push(this._rtcSafe(e));this._rtcDbg('setRemoteDescription FAILED',e);answerReject(e);} }
        else if(msg.type==='error') {this._rtcDebug.errors.push({go2rtc:msg.value}); this._rtcDbg('GO2RTC ERROR',msg.value); answerReject(new Error(msg.value||'go2rtc signaling error'));}
      } catch(e){ console.warn('[Frigate] go2rtc signaling message',e); }
    });
    ws.addEventListener('open',async()=>{try{this._rtcDbg('WS OPEN',{url:this._rtcRedactUrl(ws.url),authMode:signedWs.authMode,readyState:ws.readyState,readyStateName:'OPEN',elapsedMs:Math.round(performance.now()-((this._rtcDebug?.started||Date.now())))}); const offer=await pc.createOffer(); this._rtcDebug.offer=this._rtcSdpSummary(offer.sdp); this._rtcDbg('OFFER CREATED',{sdpSummary:this._rtcDebug.offer,transceivers:pc.getTransceivers().map((t,i)=>({i,mid:t.mid,direction:t.direction,currentDirection:t.currentDirection,senderKind:t.sender.track?.kind,receiverKind:t.receiver.track?.kind})),audio:this._rtcAudioDiagnostics(pc,microphoneStream)}); await pc.setLocalDescription(offer); this._rtcDbg('LOCAL DESCRIPTION SET',{signalingState:pc.signalingState,iceGatheringState:pc.iceGatheringState}); if(ws.readyState!==WebSocket.OPEN) throw new Error('go2rtc WebSocket closed before offer'); ws.send(JSON.stringify({type:'webrtc/offer',value:offer.sdp})); this._rtcDbg('OFFER SENT');}catch(e){this._rtcDebug.errors.push(this._rtcSafe(e)); this._rtcDbg('OFFER FAILED',e); answerReject(e);}}, {once:true});
    ws.addEventListener('error',(e)=>{this._rtcDebug.errors.push(this._rtcSafe(e));this._rtcDbg('WS ERROR',{eventType:e?.type,readyState:ws.readyState,readyStateName:['CONNECTING','OPEN','CLOSING','CLOSED'][ws.readyState]||'UNKNOWN',url:this._rtcRedactUrl(ws.url),authMode:signedWs.authMode});answerReject(new Error('Unable to connect to go2rtc'));},{once:true});
    ws.addEventListener('close',(e)=>{this._rtcDbg('WS CLOSE',{code:e.code,reason:e.reason,wasClean:e.wasClean,readyState:ws.readyState,readyStateName:['CONNECTING','OPEN','CLOSING','CLOSED'][ws.readyState]||'UNKNOWN',url:this._rtcRedactUrl(ws.url),authMode:signedWs.authMode});if(this._go2rtcLive?.pc===pc && pc.connectionState!=='connected') answerReject(new Error('go2rtc WebSocket closed during negotiation'));},{once:true});
    try { await Promise.race([answerPromise,new Promise((_,reject)=>setTimeout(()=>reject(new Error('Timed out waiting for go2rtc WebRTC answer')),10000))]); this._rtcDbg('NEGOTIATION ANSWER RECEIVED'); } catch(e) { this._rtcDebug.errors.push(this._rtcSafe(e)); this._rtcDbg('NEGOTIATION FAILED/TIMEOUT',e); throw e; }
    this._wireLiveFsNudge(video);
    this._renderStreamCtrl(); return video;
    };
    const mountPromise = runMount();
    this._go2rtcMountPromise = mountPromise;
    try { return await mountPromise; } finally { if (this._go2rtcMountPromise === mountPromise) this._go2rtcMountPromise = null; }
  },

_destroyGo2RTCLive(preserveVideo=false) {
    const live=this._go2rtcLive;
    this._go2rtcLive=null;
    this._liveAudioAvailable=false;
    if(live?.ws){try{live.ws.close();}catch(_){}}
    if(live?.pc){try{live.pc.close();}catch(_){}}
    // When replacing a receive-only peer with the microphone-enabled Talk
    // peer, keep the same DOM media element.  Reusing it preserves the user's
    // prior audio-unlock gesture instead of creating a fresh audible media
    // element after getUserMedia() has yielded.
    if(live?.video && !preserveVideo){try{live.video.pause();live.video.srcObject=null;}catch(_){}}
    if(this._talkUsingLivePC){ this._talkPC=null; this._talkWS=null; this._talkUsingLivePC=false; }
  }
};

// ── src/card/live/fullscreen.js ──
/**
 * iOS/WebKit fullscreen recovery and MediaStream compositor safeguards.
 *
 * Methods are composed onto SightlineCard.prototype; method names are kept
 * stable so existing card behavior and tests remain unchanged.
 */
const liveFullscreenMethods = {
_wireLiveFsNudge(engineEl, attempt=0) {
    const vid=this._findVideo(engineEl);
    if(!vid){
      if(attempt<30) setTimeout(()=>{
        if(this._engine===engineEl) this._wireLiveFsNudge(engineEl,attempt+1);
      },100);
      return;
    }
    this._watchAutoAspectMedia(vid);
    if(vid._frigateLiveFsCleanup) return;

    const wrap=this.shadowRoot?.querySelector('#eng-wrap');
    if(!wrap) return;

    vid.playsInline=true;
    vid.setAttribute('playsinline','');
    vid.setAttribute('webkit-playsinline','');
    // Keep native AVPlayer fullscreen out of the live MediaStream path on iOS.
    // The card no longer renders a dedicated iOS fullscreen button; this is a
    // defensive guard for native player chrome / WebKit presentation changes.
    try { vid.setAttribute('controlslist','nofullscreen'); } catch(_) {}

    // iOS can pause a MediaStream-backed <video> as it is transferred to/from
    // native AVPlayer fullscreen. Keep the exact same MediaStream/peer attached,
    // but let AVPlayer own fullscreen while it is active. Critically, once native
    // fullscreen ends we restore the ordinary card geometry immediately. The old
    // Earlier behavior intentionally left a fixed pseudo-fullscreen shell
    // behind, which is the oversized player users then had to dismiss with X.
    let fsHandoffUntil=0;
    let nativeFullscreenActive=false;
    const resumeSameLiveVideo=()=>{
      if(!vid.isConnected || !this.isConnected) return;
      if(this._go2rtcLive?.video && this._go2rtcLive.video!==vid && engineEl===vid) return;
      try {
        vid.playsInline=true;
        vid.setAttribute('playsinline','');
        vid.setAttribute('webkit-playsinline','');
        const p=vid.play();
        if(p?.catch) p.catch(()=>{});
      } catch(_) {}
    };
    const clearFullscreenShell=()=>{
      // This is intentionally synchronous: layout must be back to the embedded
      // card before WebKit paints the first post-fullscreen frame.
      wrap.classList.remove('live-pseudo-fullscreen');
      wrap.querySelector('.live-fs-exit')?.remove();
      this._livePseudoFullscreen=false;
    };
    const beginNativeFullscreen=()=>{
      if(!vid.isConnected) return;
      nativeFullscreenActive=true;
      fsHandoffUntil=performance.now()+1600;
      // A stale visual shell from an earlier fallback must never sit underneath
      // or survive a real native fullscreen presentation.
      clearFullscreenShell();
      this._removeLiveFsMirror();
    };
    const finishNativeFullscreen=(force=false)=>{
      if(!force && !nativeFullscreenActive && !this._livePseudoFullscreen) return;
      nativeFullscreenActive=false;
      fsHandoffUntil=performance.now()+1600;
      clearFullscreenShell();

      // Recover the live compositor inside the NORMAL-SIZED card. A mirror made
      // from the same receiver tracks can bridge the first post-fullscreen frame
      // without keeping the wrapper fixed over the viewport.
      resumeSameLiveVideo();
      if(vid.srcObject) this._createLiveFsMirror(vid,wrap);
      requestAnimationFrame(resumeSameLiveVideo);
      setTimeout(resumeSameLiveVideo,80);
      setTimeout(()=>this._recoverIOSLiveAfterFullscreen(),120);
    };
    const onBegin=()=>beginNativeFullscreen();
    const onPresentation=()=>{
      if(vid.webkitPresentationMode==='fullscreen') beginNativeFullscreen();
      else if(nativeFullscreenActive || this._livePseudoFullscreen) finishNativeFullscreen(true);
    };
    // Some WKWebView builds can deliver end without a reliable begin/presentation
    // sequence. Force the geometry cleanup on every native fullscreen end.
    const onEnd=()=>finishNativeFullscreen(true);
    const onPause=()=>{
      // Resume only pauses produced by the native-fullscreen handoff. Once the
      // transition has settled, the user's normal pause control must work.
      if(nativeFullscreenActive && performance.now()<fsHandoffUntil) {
        setTimeout(resumeSameLiveVideo,0);
      }
    };

    vid.addEventListener('webkitbeginfullscreen',onBegin);
    vid.addEventListener('webkitendfullscreen',onEnd);
    vid.addEventListener('webkitpresentationmodechanged',onPresentation);
    vid.addEventListener('pause',onPause);

    const cleanup=()=>{
      vid.removeEventListener('webkitbeginfullscreen',onBegin);
      vid.removeEventListener('webkitendfullscreen',onEnd);
      vid.removeEventListener('webkitpresentationmodechanged',onPresentation);
      vid.removeEventListener('pause',onPause);
      try { delete vid._frigateLiveFsCleanup; } catch(_) { vid._frigateLiveFsCleanup=null; }
    };
    vid._frigateLiveFsCleanup=cleanup;
    if(this._liveFsCleanup && this._liveFsCleanup!==cleanup) {
      try { this._liveFsCleanup(); } catch(_) {}
    }
    this._liveFsCleanup=cleanup;
  },

_createLiveFsMirror(source,wrap){
    if(!source?.srcObject||!wrap) return null;
    this._removeLiveFsMirror();
    const mirror=document.createElement('video');
    mirror.className='live-fs-mirror';
    mirror.autoplay=true; mirror.playsInline=true; mirror.muted=true; mirror.controls=false;
    mirror.setAttribute('playsinline',''); mirror.setAttribute('webkit-playsinline','');
    // Use a fresh MediaStream wrapper around the same receiver tracks. This
    // keeps one RTCPeerConnection/audio path, but forces WebKit to create a new
    // video rendering attachment instead of reusing the compositor that native
    // fullscreen may have frozen.
    try {
      mirror.srcObject = source.srcObject instanceof MediaStream
        ? new MediaStream(source.srcObject.getTracks())
        : source.srcObject;
    } catch(_) { mirror.srcObject=source.srcObject; }
    wrap.appendChild(mirror);
    this._liveFsMirror=mirror;
    const play=()=>{ try { const p=mirror.play(); if(p?.catch)p.catch(()=>{}); } catch(_) {} };
    requestAnimationFrame(play); setTimeout(play,80);
    return mirror;
  },

_removeLiveFsMirror(){
    const m=this._liveFsMirror;
    this._liveFsMirror=null;
    if(m){ try { m.pause(); m.srcObject=null; } catch(_) {} try { m.remove(); } catch(_) {} }
  },

_recoverIOSLiveAfterFullscreen(){
    if(!this._isIOSRecordingPlatform() || !this.isConnected) { this._removeLiveFsMirror(); return; }
    const seq=++this._liveFsRecoverySeq;
    const source=this._go2rtcLive?.video || this._findVideo(this._engine);
    if(!source) {
      this._removeLiveFsMirror();
      if(!this._playing) requestAnimationFrame(()=>{ if(seq===this._liveFsRecoverySeq && this.isConnected) this._mountEngine(); });
      return;
    }
    try {
      source.playsInline=true;
      source.setAttribute('playsinline','');
      source.setAttribute('webkit-playsinline','');
      source.setAttribute('controlslist','nofullscreen');
      const p=source.play?.(); if(p?.catch)p.catch(()=>{});
    } catch(_) {}

    // Keep the mirror on top while the original element proves that WebKit is
    // producing frames again. requestVideoFrameCallback detects the exact
    // compositor recovery rather than trusting readyState/videoWidth, which can
    // remain healthy even when iOS has frozen the visual surface.
    let recovered=false;
    const finish=()=>{
      if(recovered || seq!==this._liveFsRecoverySeq) return;
      recovered=true;
      clearTimeout(timer);
      this._removeLiveFsMirror();
    };
    try {
      if(typeof source.requestVideoFrameCallback==='function') {
        source.requestVideoFrameCallback(()=>finish());
      }
    } catch(_) {}
    const startTime=Number(source.currentTime);
    const timer=setTimeout(()=>{
      if(recovered || seq!==this._liveFsRecoverySeq || !this.isConnected) return;
      const moved=Number.isFinite(startTime) && Number.isFinite(Number(source.currentTime)) && Number(source.currentTime)>startTime+.03;
      if(moved) { finish(); return; }
      // Last-resort repair: rebuild only the live engine. This is intentionally
      // delayed until the old video failed to produce a frame, avoiding needless
      // WebRTC renegotiation on healthy exits while guaranteeing that a frozen
      // iOS compositor does not remain on screen.
      this._removeLiveFsMirror();
      if(this._playing) return;
      this._unmountEngine();
      requestAnimationFrame(()=>{ if(this.isConnected && !this._playing) this._mountEngine(); });
    },650);
  },

_exitLivePseudoFullscreen(wrap){
    if(!wrap) return;
    wrap.classList.remove('live-pseudo-fullscreen');
    wrap.querySelector('.live-fs-exit')?.remove();
    this._livePseudoFullscreen=false;
    // Do not immediately destroy the bridge video. It covers the WebKit
    // compositor hand-back until the original live element produces a frame.
    this._recoverIOSLiveAfterFullscreen();
  },

_addLiveFsExit(wrap){
    if(!wrap || wrap.querySelector('.live-fs-exit')) return;
    const b=document.createElement('button');
    b.className='live-fs-exit'; b.type='button'; b.title='Exit fullscreen'; b.setAttribute('aria-label','Exit fullscreen'); b.textContent='×';
    b.addEventListener('click',e=>{
      e.stopPropagation();
      this._exitLivePseudoFullscreen(wrap);
    });
    wrap.appendChild(b);
  }
};

// ── src/card/live/view.js ──
/**
 * Live-view UI, camera switching, grid mode, status overlays, and rotation.
 *
 * Methods are composed onto SightlineCard.prototype; method names are kept
 * stable so existing card behavior and tests remain unchanged.
 */
/** Return whether Sightline should render its own fullscreen control. */
function shouldShowFullscreenButton({isLive=false,inGrid=false,isIOS=false}={}) {
  // Recorded single-camera video already exposes native player fullscreen.
  // Sightline's control is needed for the live WebRTC wrapper and Multiview.
  return !isIOS && (isLive || inGrid);
}

const liveViewMethods = {
async _mountGrid() {
    const grid = this.shadowRoot.querySelector('#cam-grid'); if (!grid) return;
    const n = this._config.cameras.length;
    const slots = n === 3 ? 4 : n;   // 3 cams → 4 slots, last is placeholder
    grid.className = `cam-grid cams-${n}`;
    grid.innerHTML = '';
    for (let i = 0; i < slots; i++) {
      const slot = document.createElement('div');
      const isPlaceholder = i >= n;
      slot.className = `grid-slot${isPlaceholder ? ' placeholder' : ''}`;
      if (!isPlaceholder) {
        const c = this._config.cameras[i];
        const name = cap(camDisplayName(c));
        // stream
        const stateObj = this._streamStateObj(c.entity);
        if (stateObj) {
          const s = document.createElement('ha-camera-stream');
          s.hass = this._hass; s.stateObj = stateObj; s.controls = false; s.muted = true;
          s.style.cssText = 'width:100%;height:100%;display:block;pointer-events:none';
          slot.appendChild(s);
        }
        // label
        const lbl = document.createElement('div');
        lbl.className = 'grid-label'; lbl.textContent = name;
        slot.appendChild(lbl);
        // click → set as active cam for the events list; stay in grid
        // guard: buttons inside the slot handle their own action; don't also switch camera
        slot.addEventListener('click', ev => {
          if (ev.target.closest('.grid-fs-btn,.grid-close-btn,[data-restore-slot]')) return;
          this._switchCamera(i); this._renderCamSwitcher();
        });
        // Per-slot fullscreen is desktop-only. On iOS keep custom fullscreen
        // affordances out of view to avoid handing live MediaStreams to AVPlayer.
        if(!this._isIOSRecordingPlatform()) {
          const fsBtn = document.createElement('button');
          fsBtn.className = 'grid-fs-btn'; fsBtn.title = 'Fullscreen';
          fsBtn.innerHTML = ICONS.expand;
          fsBtn.addEventListener('click', ev => { ev.stopPropagation(); this._fullscreen(slot); });
          slot.appendChild(fsBtn);
        }
      }
      grid.appendChild(slot);
    }
  },

_canPlayRecordedMedia(event) {
    // Frigate events are stored independently of the camera's current live
    // availability. A camera/doorbell being offline must never prevent an
    // already-recorded event from opening.
    if (!event) return false;
    return !!(
      event.id ||
      event.event_id ||
      event.start_time != null ||
      event.timestamp != null ||
      event.thumbnail ||
      event.thumb
    );
  },

_ensureStatusOverlay() {
    const viewer=this.shadowRoot?.querySelector?.('#viewer');
    if(!viewer) return null;
    let overlay=viewer.querySelector('.status-overlay');
    if(!overlay) {
      overlay=document.createElement('div');
      overlay.className='status-overlay hidden';
      overlay.innerHTML=`
        <div class="status-card">
          <div class="status-spinner" hidden></div>
          <div class="status-icon" hidden></div>
          <div class="status-title"></div>
          <div class="status-detail"></div>
          <button class="status-retry" hidden type="button">Try again</button>
        </div>`;
      viewer.appendChild(overlay);
      overlay.querySelector('.status-retry').addEventListener('click',e=>{
        e.preventDefault(); e.stopPropagation();
        this._retryStatusOverlay?.();
      });
    }
    return overlay;
  },

_setStatusOverlay(kind, title, detail='', opts={}) {
    const overlay=this._ensureStatusOverlay();
    if(!overlay) return;
    const spinner=overlay.querySelector('.status-spinner');
    const icon=overlay.querySelector('.status-icon');
    const titleEl=overlay.querySelector('.status-title');
    const detailEl=overlay.querySelector('.status-detail');
    const retry=overlay.querySelector('.status-retry');
    const loading=kind==='loading' || kind==='connecting';
    const icons={offline:'⌁',error:'!',recording:'▶',info:'i',live:'•'};
    spinner.hidden=!loading;
    icon.hidden=loading;
    icon.textContent=icons[kind] || 'i';
    titleEl.textContent=title || '';
    detailEl.textContent=detail || '';
    retry.hidden=!opts.retry;
    overlay.classList.toggle('hidden',!title);
    this._statusOverlayKind=kind;
    this._statusOverlayRetry=opts.retry ? (opts.retryHandler || null) : null;
    this._retryStatusOverlay=()=>{
      if(typeof this._statusOverlayRetry==='function') this._statusOverlayRetry();
      else if(typeof this._startLive==='function') this._startLive();
    };
  },

_clearStatusOverlay() {
    const overlay=this.shadowRoot?.querySelector?.('.status-overlay');
    if(overlay) overlay.classList.add('hidden');
    this._statusOverlayKind=null;
    this._statusOverlayRetry=null;
  },

_cameraIsOffline() {
    const s=this._cameraState || this._activeCam?.state || this._hass?.states?.[this._cameraEntity]?.state;
    return s === 'unavailable' || s === 'unknown' || s === 'offline';
  },

_toggleLiveAudio() {
    const video = this._go2rtcLive?.video || this._findVideo?.(this._engine);
    if (!video) return;

    this._liveAudioEnabled = !this._liveAudioEnabled;
    try {
      video.muted = !this._liveAudioEnabled;
      video.volume = 1;
      if (this._liveAudioEnabled) {
        video.setAttribute?.('playsinline', '');
        video.play?.()?.catch?.(() => {});
      }
    } catch (_) {}

    this._renderStreamCtrl();
  },

_renderStreamCtrl() {
    if (this._cameraIsOffline() && !this._playing) {
      this._setStatusOverlay('offline','Camera is offline','Live video is unavailable right now. Your recorded events can still be viewed.',{retry:true});
    }

    const bar = this.shadowRoot.querySelector('#stream-ctrl-bar'); if (!bar) return;
    const inGrid = this._viewMode === 'grid';
    const speaking = !!this._talkSpeaking;
    const connected = !!this._talkConnected;
    const talkLbl = (speaking || connected) ? 'End two-way audio' : 'Start two-way audio';
    const isLive = !this._playing && this.shadowRoot.querySelector('#viewer')?.style.display !== 'flex';
    const liveVideo = this._go2rtcLive?.video || null;
    const liveHasAudio = Boolean(
      this._liveAudioAvailable || this._go2rtcLive?.stream?.getAudioTracks?.().length
    );
    const audioLabel = this._liveAudioEnabled ? 'Mute live audio' : 'Unmute live audio';
    const audioBtn = (isLive && !inGrid && liveVideo && liveHasAudio)
      ? `<button class="scb-btn audio-btn${this._liveAudioEnabled ? ' active' : ''}" id="sc-audio" title="${audioLabel}" aria-label="${audioLabel}" aria-pressed="${Boolean(this._liveAudioEnabled)}">${this._liveAudioEnabled ? ICONS.volOn : ICONS.volOff}</button>`
      : '';
    const talkAvailable = !!(
      this._config.two_way_audio &&
      this._microphonePresent === true &&
      !this._micForbidden &&
      (this._talkStreamName() || this._config.frigate_client_id || this._activeCam?.entity)
    );
    const talkBtn = (isLive && !inGrid && talkAvailable)
      ? `<button class="scb-btn talk-btn${speaking ? ' talking' : ''}${connected ? ' connected' : ''}" id="sc-talk" title="${talkLbl}" aria-label="${talkLbl}" aria-pressed="${speaking}" aria-busy="${connected && !speaking}">
           <canvas class="talk-wave" id="talk-wave" width="72" height="72" aria-hidden="true"></canvas>
           <span class="talk-mic-glyph" aria-hidden="true">${ICONS.mic}</span>
         </button>`
      : '';
    // Keep Sightline's fullscreen affordance on desktop Live as well as
    // Multiview. Single-camera recorded playback already has native video
    // controls, while iOS intentionally keeps custom fullscreen disabled for
    // MediaStream stability.
    const fsBtn = shouldShowFullscreenButton({
      isLive,
      inGrid,
      isIOS:this._isIOSRecordingPlatform(),
    })
      ? `<button class="scb-btn" id="sc-fs" title="Fullscreen" aria-label="Fullscreen">${ICONS.expand}</button>`
      : '';
    // Live is represented internally by an empty gallery mode because the
    // timeline is the live view. Explicitly derive the active state from _tab
    // so Live is highlighted on first render and after every return to Live.
    const activeMediaTab = this._galleryMode || (this._tab === 'live' ? 'live' : '');
    const hiddenTabs=new Set(this._config.hidden_tabs||[]);
    const mediaBtn = (id, label, icon) => (id!=='live' && hiddenTabs.has(id)) ? '' : `<button class="media-nav-btn${activeMediaTab===id?' active':''}" data-gallery-tab="${id}" title="${label}" aria-label="${label}">${icon}<span>${label}</span></button>`;
    const liveBtn = mediaBtn('live','Live',ICONS.live);
    const clipsBtn = mediaBtn('clips','Clips',ICONS.clips);
    const recordingsBtn = mediaBtn('recordings','Recordings',ICONS.recordings);
    const reviewsBtn = mediaBtn('reviews','Reviews',ICONS.reviews);
    const recDl = (this._playing && this._playing.rec)
      ? `<button class="scb-btn rec-download-icon${this._downloadRange?' range-active':''}" data-rec-download title="${this._downloadRange?'Adjust download range':'Choose download range'}" aria-label="${this._downloadRange?'Adjust download range':'Choose download range'}" aria-pressed="${this._downloadRange?'true':'false'}">${ICONS.download}</button>`
      : '';
    const mediaGroup = `<div class="media-nav-group" role="group" aria-label="Media navigation">${liveBtn}${clipsBtn}${recordingsBtn}${reviewsBtn}</div>`;
    bar.innerHTML = `${audioBtn}${talkBtn}${fsBtn}${mediaGroup}${recDl}`;
    bar.querySelector('#sc-audio')?.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      this._toggleLiveAudio();
    });
    this._wireTalkButton();
    if (this._talkSpeaking && this._talkMic) this._startTalkWaveform();
  },

_setViewMode(mode) {
    if (mode === 'grid') this._stopTalk(); // no talk button/target in grid view
    this._viewMode = mode;
    const card = this.shadowRoot.querySelector('.card');
    if (card) card.classList.toggle('grid-mode', mode === 'grid');
    const engWrap = this.shadowRoot.querySelector('#eng-wrap');
    const gridEl = this.shadowRoot.querySelector('#cam-grid');

    if (mode === 'grid') {
      if (engWrap) engWrap.style.display = 'none';
      if (gridEl) { gridEl.style.display = ''; this._mountGrid(); }
      this._eventsMode = 'all';
      const lbl = this.shadowRoot.querySelector('#list-label');
      if (lbl) lbl.textContent = 'All cameras';
      this._loadAllCamsBackground().then(() => this._renderAll());
      this._renderStreamCtrl(); // hide mute button in grid mode
    } else {
      if (engWrap) engWrap.style.display = '';
      if (gridEl) gridEl.style.display = 'none';
      this._eventsMode = 'camera';
      // A camera selector is meaningless in single-camera browsing. Clear any
      // selection carried over from Multiview before rendering the gallery.
      if(this._mediaFilter) this._mediaFilter.camera='all';
      this._mountEngine();
      this._renderAll();
    }
    this._renderCamSwitcher();
    this._applyBrowse();
    this.shadowRoot.querySelectorAll('[data-viewmode]').forEach(p =>
      p.classList.toggle('active', p.dataset.viewmode === mode));
  },

async _switchCamera(idx) {
    if (idx === this._activeCamIdx && this._viewMode === 'single') return;
    this._downloadRange=null;
    this._stopTalk(); // talk session is bound to the previous camera's go2rtc stream
    // Clicking a cam tab while in grid mode switches to single view of that camera
    if (this._viewMode === 'grid') this._setViewMode('single');
    const prevEnt = this._activeCam?.entity;
    if (prevEnt && this._camCache[prevEnt]) {
      this._camCache[prevEnt].events = this._events;
      this._camCache[prevEnt].recordings = this._recordings;
      this._camCache[prevEnt].recordingsLoaded = this._recordingsLoaded;
      this._camCache[prevEnt].recordingsRangeStart = this._recordingsRangeStart;
      this._camCache[prevEnt].recordingsRangeEnd = this._recordingsRangeEnd;
      this._camCache[prevEnt].recordingsLoadedAt = this._recordingsLoadedAt;
    }
    this._activeCamIdx = idx;
    const newEnt = this._activeCam?.entity;
    if (!this._camCache[newEnt]) this._camCache[newEnt] = mkCamState();
    if (!this._camCache[newEnt].discovered) await this._discoverOne(newEnt);
    this._applyCardStyle();
    this._loadFrigateFilterMetadata();
    const cached = this._camCache[newEnt];
    this._events = cached.events||[]; this._recordings = cached.recordings||[]; this._recordingsLoaded = cached.recordingsLoaded===true; this._recordingsRangeStart = Number.isFinite(Number(cached.recordingsRangeStart)) ? Number(cached.recordingsRangeStart) : null; this._recordingsRangeEnd = Number.isFinite(Number(cached.recordingsRangeEnd)) ? Number(cached.recordingsRangeEnd) : null; this._recordingsLoadedAt = Number(cached.recordingsLoadedAt)||0;
    this._reviews = cached.reviews||[]; this._kept = cached.kept||[];
    this._renderCamSwitcher(); this._syncStatus();
    await this._mountEngine();
    this._renderAll();
    await this._loadWindow(true);
  },

_startRotate() {
    this._stopRotate();
    const secs = this._config.rotate_seconds || DEFAULT_ROTATE_S;
    this._rotateTimer = setInterval(() => {
      const next = (this._activeCamIdx+1) % this._config.cameras.length;
      this._switchCamera(next);
    }, secs*1000);
  },

_stopRotate() { if (this._rotateTimer) { clearInterval(this._rotateTimer); this._rotateTimer=null; } },

_toggleRotate() {
    if (this._rotateTimer) { this._stopRotate(); this._toast('Auto-rotate off',1800); }
    else {
      if (!this._config.rotate_seconds) this._config.rotate_seconds = DEFAULT_ROTATE_S;
      this._startRotate(); this._toast(`Rotating every ${this._config.rotate_seconds}s`,1800);
    }
    this._renderCamSwitcher();
  }
};

// ── src/card/live.js ──
/**
 * Public method-group barrel for liveMethods.
 *
 * Keeping this entry point stable avoids coupling callers to the internal
 * feature layout while allowing each concern to live in a focused module.
 */
const liveMethods = Object.assign(
  {},
  liveDiscoveryMethods,
  liveEngineMethods,
  liveWebRtcMethods,
  liveFullscreenMethods,
  liveViewMethods,
);

// ── src/card/talk/controls.js ──
/**
 * Two-way-audio controls, user gestures, and microphone waveform UI.
 *
 * Methods are composed onto SightlineCard.prototype; method names are kept
 * stable so existing card behavior and tests remain unchanged.
 */
const talkControlMethods = {
_talkStreamName() {
    const cam = this._activeCam; if (!cam) return null;
    return cam.go2rtc_stream || this._cc().cam || (cam.entity ? String(cam.entity).split('.').pop() : null) || null;
  },

async _toggleTalk() {
    if (this._viewMode === 'grid' || this._playing) return;
    // A pointerdown on iOS may already have started Talk so that getUserMedia
    // runs inside the browser's user-activation window. The following click
    // is only the synthetic follow-up to that same gesture. Consume it rather
    // than toggling Talk off immediately.
    if (this._talkGestureStarted) {
      this._talkGestureStarted = false;
      return;
    }
    if (this._talkState === 'connecting') return;
    if (this._talkSpeaking) { await this._stopTalk(); return; }
    this._talkSpeaking=true; this._talkState='connecting'; this._micDesiredMute=false;
    this._wireTalkButton();
    this._startTalk().catch(err=>{
      console.warn('[Frigate] talk start failed',err);
      this._talkSpeaking=false; this._talkConnected=false; this._talkState='error';
      this._wireTalkButton(); this._renderStreamCtrl();
    });
  },

_endTalk() {
    this._talkSpeaking=false; this._talkState='idle'; this._micDesiredMute=true;
    this._stopTalkWaveform();
    this._setMicMuted(true);
    this._startMicDisconnectTimer();
    this._talkConnected=false;
    this._wireTalkButton(); this._renderStreamCtrl();
  },

_wireTalkButton() {
    const btn = this.shadowRoot.querySelector('#sc-talk');
    if (!btn) return;
    // iOS Safari/WebKit is stricter about getUserMedia user activation than
    // desktop browsers. Start microphone acquisition directly from the
    // pointer gesture, then let the delegated click handler consume the
    // resulting activation instead of starting a second request. This keeps
    // Talk one-tap on iOS without bringing back the separate audio button.
    if (!btn.__frigateTalkPointerBound) {
      btn.__frigateTalkPointerBound = true;
      btn.addEventListener('pointerdown', () => {
        if (this._talkSpeaking || this._talkState === 'connecting') return;
        this._talkGestureStarted = true;
        // iOS/WebKit grants media playback privileges to work started directly
        // inside the user gesture.  Do this BEFORE getUserMedia() yields, so
        // starting the microphone cannot consume the only activation token.
        this._unlockLiveAudioFromGesture();
        this._toggleTalk();
      }, {passive:true});
    }
    const active = !!this._talkSpeaking;
    const connecting = this._talkState === 'connecting';
    btn.classList.toggle('talking', active);
    btn.classList.toggle('connected', !!this._talkConnected);
    btn.classList.toggle('talk-connecting', connecting);
    btn.setAttribute('aria-pressed', String(active));
    btn.setAttribute('aria-busy', String(connecting));
    btn.setAttribute('aria-label', connecting ? 'Connecting…' : (active ? 'End two-way audio' : 'Start two-way audio'));
    btn.title = connecting ? 'Connecting…' : (active ? 'End two-way audio' : 'Start two-way audio');
  },

_unlockLiveAudioFromGesture() {
    this._liveAudioEnabled = true;
    const video = this._go2rtcLive?.video || this.shadowRoot?.querySelector('#engine video');
    if (!video) return;
    try {
      video.muted = false;
      video.volume = 1;
      video.setAttribute('playsinline', '');
      const p = video.play();
      if (p && typeof p.catch === 'function') p.catch(() => {});
    } catch (_) {}
  },

_updateTalkButtonVisual() {
    const btn = this.shadowRoot.querySelector('#sc-talk');
    if (!btn) return;
    const speaking = !!this._talkSpeaking;
    const connected = !!this._talkConnected;
    btn.classList.toggle('talking', speaking);
    btn.classList.toggle('connected', connected);
    btn.setAttribute('aria-pressed', String(speaking));
    btn.setAttribute('aria-busy', String(connected && !speaking));
    btn.title = speaking ? 'Release to stop talking' : 'Hold to talk';
    btn.setAttribute('aria-label', btn.title);
  },

_pressTalk() {
    return this._toggleTalk();
  },

_releaseTalk() {
    // Tap-to-toggle: pointer release must not stop talkback.
  },

_startTalkWaveform() {
    const canvas = this.shadowRoot.querySelector('#talk-wave');
    if (!canvas || !this._talkMic || !this._talkSpeaking) return;
    if (this._talkWaveRAF) return;

    const track = this._talkMic.getAudioTracks?.()[0];
    if (!track) return;

    try {
      if (!this._talkAudioCtx || this._talkAudioCtx.state === 'closed') {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) return;
        this._talkAudioCtx = new Ctx();
      }
      const ctx = this._talkAudioCtx;
      if (ctx.state === 'suspended') ctx.resume().catch(() => {});
      if (!this._talkAnalyser) {
        this._talkAnalyser = ctx.createAnalyser();
        this._talkAnalyser.fftSize = 128;
        this._talkAnalyser.smoothingTimeConstant = 0.72;
        this._talkAudioSource = ctx.createMediaStreamSource(this._talkMic);
        this._talkAudioSource.connect(this._talkAnalyser);
      }
      const analyser = this._talkAnalyser;
      const data = new Uint8Array(analyser.fftSize);
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const cssW = 72, cssH = 72;
      canvas.width = cssW * dpr; canvas.height = cssH * dpr;
      canvas.style.width = cssW + 'px'; canvas.style.height = cssH + 'px';
      const c = canvas.getContext('2d');
      c.setTransform(dpr,0,0,dpr,0,0);

      const draw = () => {
        this._talkWaveRAF = requestAnimationFrame(draw);
        if (!this._talkSpeaking || !this.shadowRoot.contains(canvas)) {
          this._talkWaveRAF = null; return;
        }
        analyser.getByteTimeDomainData(data);
        let rms=0;
        for (let i=0;i<data.length;i++) {
          const x=(data[i]-128)/128; rms += x*x;
        }
        rms=Math.sqrt(rms/data.length);
        const energy=Math.min(1, Math.max(.08, rms*4.2));

        c.clearRect(0,0,cssW,cssH);
        const cx=cssW/2, cy=cssH/2;
        // iOS 9 Siri-inspired, layered flowing waveform: restrained when quiet,
        // wider/brighter as the microphone receives speech.
        const waves=[
          {a:8+18*energy, f:1.7, phase:.0, alpha:.52},
          {a:5+14*energy, f:2.25, phase:1.3, alpha:.78},
          {a:4+11*energy, f:2.9, phase:2.1, alpha:.92},
        ];
        waves.forEach((w,wi)=>{
          c.beginPath();
          for(let x=0;x<=cssW;x+=2){
            const nx=(x-cx)/cx;
            const envelope=Math.max(0,1-Math.abs(nx))*0.95;
            const y=cy + Math.sin(nx*Math.PI*w.f + w.phase + performance.now()/420*(wi+1)) * w.a * envelope;
            if(x===0)c.moveTo(x,y); else c.lineTo(x,y);
          }
          c.lineWidth=wi===1?2.1:1.5;
          c.globalAlpha=w.alpha*energy;
          c.strokeStyle=wi===0?'#5e9cff':(wi===1?'#b66cff':'#ff6b8a');
          c.stroke();
        });
        c.globalAlpha=1;
        c.beginPath(); c.moveTo(7,cy); c.lineTo(cssW-7,cy);
        c.lineWidth=1; c.strokeStyle='rgba(255,255,255,.18)'; c.stroke();
      };
      draw();
    } catch (e) {
      console.warn('[Frigate] waveform init failed', e);
    }
  },

_stopTalkWaveform() {
    if (this._talkWaveRAF) cancelAnimationFrame(this._talkWaveRAF);
    this._talkWaveRAF = null;
    if (this._talkAudioSource) { try { this._talkAudioSource.disconnect(); } catch (_) {} this._talkAudioSource=null; }
    this._talkAnalyser = null;
    if (this._talkAudioCtx && this._talkAudioCtx.state !== 'closed') {
      this._talkAudioCtx.close().catch(() => {});
    }
    this._talkAudioCtx = null;
  }
};

// ── src/card/talk/microphone.js ──
/**
 * Browser microphone capability, permission, mute, and disconnect lifecycle.
 *
 * Methods are composed onto SightlineCard.prototype; method names are kept
 * stable so existing card behavior and tests remain unchanged.
 */
const microphoneMethods = {
_frigateProxyWsUrl(stream) {
    // The Frigate HA integration owns the authentication boundary. Its
    // WebRTCProxyView exposes Frigate's /live/webrtc/api/ws endpoint through
    // Home Assistant, so Safari never has to reach Frigate:5000/8971 or
    // go2rtc:1984 directly. This is the same network boundary used by the
    // Frigate integration's live WebRTC path.
    if (!stream) return null;
    const scheme = location.protocol === 'https:' ? 'wss:' : 'ws:';
    const clientId = this._activeCam?.frigate_client_id || this._cc()?.clientId || this._config.frigate_client_id || 'frigate';
    const prefix = `/api/frigate/${encodeURIComponent(String(clientId))}/go2rtc/ws/api/ws`;
    return `${scheme}//${location.host}${prefix}?src=${encodeURIComponent(stream)}`;
  },

async _refreshMicrophoneAvailability() {
    const media = navigator.mediaDevices;
    const supported = Boolean(this._config?.two_way_audio && media?.getUserMedia);
    let present = supported;

    // enumerateDevices() can intentionally return an empty list before the
    // user grants microphone permission. Treat getUserMedia() support as
    // "potentially available" and let the permission request be authoritative.
    if (supported && media?.enumerateDevices) {
      try {
        const devices = await media.enumerateDevices();
        if (devices?.some?.((device) => device?.kind === 'audioinput')) present = true;
      } catch (_) {
        // Browser privacy restrictions must not hide the Talk control before
        // the user has a chance to grant access.
        present = true;
      }
    }

    const changed = this._microphonePresent !== present;
    this._microphonePresent = present;

    if (!present && this._talkSpeaking) {
      try { await this._stopTalk(); } catch (_) {}
    }
    if (changed && this.isConnected) this._renderStreamCtrl();
    return present;
  },

_setupMicrophoneDetection() {
    if(!this._config?.two_way_audio) {
      this._microphonePresent=false;
      if(this._micDeviceChangeHandler && navigator.mediaDevices?.removeEventListener) {
        try { navigator.mediaDevices.removeEventListener('devicechange',this._micDeviceChangeHandler); } catch (_) {}
      }
      this._micDeviceChangeHandler=null;
      if(this.isConnected) this._renderStreamCtrl();
      return;
    }
    this._refreshMicrophoneAvailability();
    if(!this._micDeviceChangeHandler && navigator.mediaDevices?.addEventListener) {
      this._micDeviceChangeHandler=()=>this._refreshMicrophoneAvailability();
      try { navigator.mediaDevices.addEventListener('devicechange',this._micDeviceChangeHandler); } catch (_) {}
    }
  },

_micSupported() { return !!navigator.mediaDevices?.getUserMedia; },

_setMicMuted(muted) {
    this._micDesiredMute=!!muted;
    this._talkMic?.getTracks().forEach(t=>t.enabled=!this._micDesiredMute);
  },

_startMicDisconnectTimer() {
    if(this._config.two_way_audio_disconnect_seconds===0) return;
    if(this._micDisconnectTimer) clearTimeout(this._micDisconnectTimer);
    const sec=this._config.two_way_audio_disconnect_seconds;
    if(sec>0) this._micDisconnectTimer=setTimeout(()=>this._disconnectMic(),sec*1000);
  },

_disconnectMic() {
    if(this._micDisconnectTimer) clearTimeout(this._micDisconnectTimer); this._micDisconnectTimer=null;
    if(this._talkMic){try{this._talkMic.getTracks().forEach(t=>t.stop());}catch(_){} this._talkMic=null;}
    if(this._go2rtcLive && !this._playing && this._viewMode !== 'grid') {
      this._mountGo2RTCVideo(null).catch(e=>console.warn('[Frigate] go2rtc microphone disconnect reconnect failed',e));
    }
  }
};

// ── src/card/talk/session.js ──
/**
 * go2rtc/WebRTC talk session connection, readiness, and teardown.
 *
 * Methods are composed onto SightlineCard.prototype; method names are kept
 * stable so existing card behavior and tests remain unchanged.
 */
const talkSessionMethods = {
async _startTalk() {
    if(!this._micSupported()) throw new Error('Microphone is not supported');
    if(!this._talkStreamName() || !this._go2rtcEndpoint()) throw new Error('No go2rtc stream is configured');
    const micPromise = navigator.mediaDevices.getUserMedia({audio:true,video:false});
    this._talkMicReadyPromise = micPromise;
    let mic;
    try {
      mic = await micPromise;
      this._microphonePresent = !!mic?.getAudioTracks?.().length;
      this._micForbidden = false;
    } catch (err) {
      const name=String(err?.name||'');
      if(name==='NotFoundError' || name==='DevicesNotFoundError') this._microphonePresent=false;
      if(name==='NotAllowedError' || name==='PermissionDeniedError' || name==='SecurityError') this._micForbidden=true;
      this._renderStreamCtrl();
      throw err;
    } finally {
      if (this._talkMicReadyPromise === micPromise) this._talkMicReadyPromise = null;
    }
    // Starting Talk must not call _disconnectMic(): that method intentionally
    // tears down the microphone and starts a receive-only remount for ending
    // Talk. Calling it here creates a second asynchronous WebRTC negotiation
    // and can race the microphone-enabled negotiation on iOS.
    if(this._micDisconnectTimer) {
      clearTimeout(this._micDisconnectTimer);
      this._micDisconnectTimer=null;
    }
    if(this._talkMic) {
      try { this._talkMic.getTracks().forEach(t=>t.stop()); } catch (_) {}
    }
    this._talkMic=mic;
    this._setMicMuted(false);

    // The pointer gesture already unlocked the live video's audio before
    // getUserMedia() yielded. Re-apply the desired state after the Talk peer
    // is mounted in case the video element was replaced during remount.
    this._unlockLiveAudioFromGesture();

    // ACC reconnects the go2rtc VideoRTC session so microphone tracks are
    // present before createOffer(). We do the same instead of renegotiating an
    // already-established peer connection.
    await this._mountGo2RTCVideo(mic);
    this._talkPC=this._go2rtcLive?.pc||null; this._talkWS=this._go2rtcLive?.ws||null; this._talkUsingLivePC=true;
    this._talkConnected=true; this._talkState='connected';
    this._renderStreamCtrl(); this._startTalkWaveform();
  },

async _waitForPeerUsable(pc, timeout=7000) {
    if (!pc) return;
    const usable=()=>pc.connectionState==='connected' || pc.iceConnectionState==='connected' || pc.iceConnectionState==='completed';
    if (usable()) return;
    await new Promise((resolve,reject)=>{
      const t=setTimeout(()=>resolve(),timeout);
      const fn=()=>{
        if(usable()){
          clearTimeout(t);
          pc.removeEventListener('connectionstatechange',fn);
          pc.removeEventListener('iceconnectionstatechange',fn);
          resolve();
        } else if(pc.connectionState==='failed' || pc.iceConnectionState==='failed'){
          clearTimeout(t);
          pc.removeEventListener('connectionstatechange',fn);
          pc.removeEventListener('iceconnectionstatechange',fn);
          reject(new Error('WebRTC connection failed'));
        }
      };
      pc.addEventListener('connectionstatechange',fn);
      pc.addEventListener('iceconnectionstatechange',fn);
    });
  },

async _stopTalk() {
    if(this._micDisconnectTimer) clearTimeout(this._micDisconnectTimer); this._micDisconnectTimer=null;
    this._stopTalkWaveform();
    this._talkSpeaking=false; this._talkConnected=false; this._talkState='idle';
    this._talkMicReadyPromise=null;

    // Do not call _disconnectMic() here: that method intentionally remounts
    // the live WebRTC session. Doing that and then immediately destroying it
    // creates a race on iOS and can leave the live peer in a closed state.
    if(this._talkMic){try{this._talkMic.getTracks().forEach(t=>t.stop());}catch(_){} this._talkMic=null;}
    this._destroyGo2RTCLive();
    this._talkPC=null; this._talkWS=null; this._talkUsingLivePC=false; this._talkSender=null;
    this._renderStreamCtrl();

    // Re-establish ordinary receive-only live video after ending talkback.
    // This is a separate negotiation and therefore cannot inherit the
    // sendonly microphone transceiver from the previous session.
    if(this._viewMode !== 'grid' && !this._playing && this._config.two_way_audio && this._talkStreamName()) {
      try { await this._mountGo2RTCVideo(null); }
      catch(e) { console.warn('[Frigate] live restore after talkback failed',e); }
    }
  }
};

// ── src/card/talk.js ──
/**
 * Public method-group barrel for talkMethods.
 *
 * Keeping this entry point stable avoids coupling callers to the internal
 * feature layout while allowing each concern to live in a focused module.
 */
const talkMethods = Object.assign(
  {},
  talkControlMethods,
  microphoneMethods,
  talkSessionMethods,
);

// ── src/card/data/metadata.js ──
/**
 * Frigate object/face/zone normalization and filter metadata discovery.
 *
 * Methods are composed onto SightlineCard.prototype; method names are kept
 * stable so existing card behavior and tests remain unchanged.
 */
const metadataMethods = {
_cc() { return this._camCache[this._activeCam?.entity] || mkCamState(); },

async _ws(p) { return parseWs(await this._hass.callWS(p)); },

_normalizeObjectLabel(value) {
    // Frigate review segments encode a tracked object with a meaningful
    // sub-label (face identity/custom classifier/etc.) as `<label>-verified`.
    // That suffix is review metadata, not a separate object class. Keep the
    // original review payload/sub_labels untouched, but expose/filter the base
    // object label so `person` and `person-verified` are one logical label.
    const raw=String(value??'').trim();
    if(!raw) return '';
    const normalized=raw.replace(/-verified$/i,'').trim();
    return normalized || raw;
  },

_faceValueList(value) {
    const out=[];
    const add=(v)=>{
      if(v==null) return;
      if(Array.isArray(v)) { for(const item of v) add(item); return; }
      const text=String(v).trim();
      if(text) out.push(text);
    };
    add(value);
    return [...new Set(out)];
  },

_eventFaceList(ev) {
    // Frigate face recognition exposes a recognized identity through the
    // event sub_label. Only treat person/face events as face identities so
    // unrelated custom-classification sub-labels do not pollute this filter.
    const label=this._normalizeObjectLabel(ev?.label ?? ev?.data?.label ?? '').toLowerCase();
    if(label!=='person' && label!=='face') return [];
    return this._faceValueList(ev?.sub_label ?? ev?.data?.sub_label);
  },

_reviewFaceList(rv) {
    const labels=this._reviewLabelList(rv).map(x=>String(x).toLowerCase());
    if(!labels.includes('person') && !labels.includes('face')) return [];
    const data=rv?.data||{};
    return this._faceValueList(data.sub_labels ?? data.sub_label);
  },

_faceDisplayName(value) {
    return String(value??'').trim().replace(/_/g,' ');
  },

_eventZoneList(ev) {
    const out=[];
    for (const source of [ev?.zones, ev?.entered_zones, ev?.current_zones]) {
      if (!Array.isArray(source)) continue;
      for (const zone of source) if(zone!=null && String(zone).trim()) out.push(String(zone));
    }
    return [...new Set(out)];
  },

_reviewLabelList(rv) {
    const data=rv?.data||{};
    const values=[];
    for(const source of [data.objects,data.labels]) {
      if(!Array.isArray(source)) continue;
      for(const value of source) {
        const label=this._normalizeObjectLabel(value);
        if(label) values.push(label);
      }
    }
    return [...new Set(values)];
  },

_reviewZoneList(rv) {
    const data=rv?.data||{};
    const values=[];
    for(const source of [data.zones,data.entered_zones]) {
      if(Array.isArray(source)) for(const value of source) if(value!=null&&String(value).trim()) values.push(String(value));
    }
    return [...new Set(values)];
  },

_mergeLoadedFilterMetadata(cc, events=[], reviews=[]) {
    if(!cc) return false;
    const labels=new Set((Array.isArray(cc.filterLabels)?cc.filterLabels:[]).map(v=>this._normalizeObjectLabel(v)).filter(Boolean));
    const faces=new Set(Array.isArray(cc.filterFaces)?cc.filterFaces:[]);
    const zones=new Set(Array.isArray(cc.filterZones)?cc.filterZones:[]);
    const beforeLabels=labels.size, beforeFaces=faces.size, beforeZones=zones.size;
    for(const ev of (events||[])) {
      const label=this._normalizeObjectLabel(ev?.label);
      if(label) labels.add(label);
      for(const face of this._eventFaceList(ev)) faces.add(face);
      for(const zone of this._eventZoneList(ev)) zones.add(zone);
    }
    for(const rv of (reviews||[])) {
      for(const label of this._reviewLabelList(rv)) labels.add(label);
      for(const face of this._reviewFaceList(rv)) faces.add(face);
      for(const zone of this._reviewZoneList(rv)) zones.add(zone);
    }
    cc.filterLabels=[...labels].sort((a,b)=>String(a).localeCompare(String(b)));
    cc.filterFaces=[...faces].sort((a,b)=>String(a).localeCompare(String(b)));
    cc.filterZones=[...zones].sort((a,b)=>String(a).localeCompare(String(b)));
    const changed=labels.size!==beforeLabels||faces.size!==beforeFaces||zones.size!==beforeZones;
    if(changed && cc===this._cc()) this._refreshOpenFilterSurfaces();
    return changed;
  },

_refreshOpenFilterSurfaces() {
    // Metadata can arrive while iOS owns a native Date/Time picker. Do not
    // mutate sibling/ancestor DOM in that period: WebKit can close the system
    // picker even when its exact <input> node remains attached. Queue the
    // gallery/filter paint and keep the card visually stable until dismissal.
    if(this._mediaPickerActive && this._galleryMode) {
      this._mediaPickerPendingFilterRender=true;
      this._mediaPickerPendingGalleryRender=true;
      return;
    }
    const mp=this.shadowRoot?.querySelector('#media-filter-panel');
    if(mp?.classList.contains('open')) this._renderMediaFilter();
    const fp=this.shadowRoot?.querySelector('#filter-panel');
    if(fp&&fp.style.display!=='none') this._renderFilter();
    this._renderLegend();
  },

_filterDisplayName(kind,value,cc=this._cc()) {
    const key=kind==='label' ? this._normalizeObjectLabel(value) : String(value??'');
    const read=(state)=>kind==='zone' ? state?.filterZoneNames?.[key] : state?.filterLabelNames?.[key];
    let named=read(cc);
    if(!named) {
      for(const state of Object.values(this._camCache||{})) { named=read(state); if(named) break; }
    }
    if(named) return String(named);
    return cap(key.replace(/_/g,' '));
  },

async _loadFrigateFilterMetadata(force=false) {
    const cc=this._cc();
    const {clientId,cam}=cc;
    const now=Date.now();
    // Re-check Frigate periodically instead of treating the first metadata load
    // as permanent. Labels/zones can be added or removed while HA stays open.
    const fresh=cc.filterMetaLoaded && (now-Number(cc.filterMetaLoadedAt||0) < 60_000);
    if(!clientId||!cam||cc.filterMetaLoading||(!force&&fresh)) return;
    cc.filterMetaLoading=true;
    // A real metadata refresh rebuilds the set so deleted/renamed zones do not
    // live forever in the filter UI. Current loaded data is always included.
    const labels=new Set();
    const faces=new Set();
    const zones=new Set();
    const labelNames={};
    const zoneNames={};
    const takeEvent=(ev)=>{
      const label=this._normalizeObjectLabel(ev?.label);
      if(label) labels.add(label);
      for(const face of this._eventFaceList(ev)) faces.add(face);
      for(const z of this._eventZoneList(ev)) zones.add(z);
    };
    const takeReview=(rv)=>{
      for(const l of this._reviewLabelList(rv)) labels.add(l);
      for(const face of this._reviewFaceList(rv)) faces.add(face);
      for(const z of this._reviewZoneList(rv)) zones.add(z);
    };
    for(const ev of (this._events||[])) takeEvent(ev);
    for(const rv of (this._reviews||[])) takeReview(rv);

    try {
      const settled=await Promise.allSettled([
        this._ws({type:'frigate/events/get',instance_id:clientId,cameras:[cam],limit:1000}),
        this._ws({type:'frigate/reviews/get',instance_id:clientId,cameras:[cam],limit:500})
      ]);
      if(settled[0].status==='fulfilled') for(const ev of (Array.isArray(settled[0].value)?settled[0].value:[])) takeEvent(ev);
      if(settled[1].status==='fulfilled') for(const rv of (Array.isArray(settled[1].value)?settled[1].value:[])) takeReview(rv);

      // Deliberately no direct /api/config or /api/labels request here.
      // The HA Frigate integration does not expose generic passthrough routes for
      // those endpoints, so labels/zones are learned dynamically from the proxied
      // event/review datasets instead of bypassing Home Assistant authentication.
    } catch(_) {
      // Keep the loaded event/review-derived values even if an enrichment path
      // is unavailable on this Frigate/HA installation.
    } finally {
      cc.filterLabels=[...labels].sort((a,b)=>String(a).localeCompare(String(b)));
      cc.filterFaces=[...faces].sort((a,b)=>String(a).localeCompare(String(b)));
      cc.filterZones=[...zones].sort((a,b)=>String(a).localeCompare(String(b)));
      cc.filterLabelNames=labelNames;
      cc.filterZoneNames=zoneNames;
      cc.filterMetaLoaded=true;
      cc.filterMetaLoadedAt=Date.now();
      cc.filterMetaLoading=false;
      this._normalizeLiveFilterState();
      this._refreshOpenFilterSurfaces();
    }
  }
};

// ── src/card/data/loading.js ──
/**
 * Frigate event/recording/review loading, calendar activity, subscriptions, and refresh scheduling.
 *
 * Methods are composed onto SightlineCard.prototype; method names are kept
 * stable so existing card behavior and tests remain unchanged.
 */
const dataLoadingMethods = {
_isNowWindow() {
    const now=Math.floor(Date.now()/1000);
    // The LIVE timeline is centered on `now`, so its newest window edge is
    // intentionally ~5 minutes in the future. Comparing only _winEnd to now
    // therefore made the card think a true LIVE view was *not* a now-window,
    // which disabled the periodic Frigate refresh after startup.
    if (this._timelineFollowingLive) return true;
    const focus=Number(this._timelineFocusTs);
    if (Number.isFinite(focus) && Math.abs(focus-now)<120) return true;
    return Number(this._winStart)<=now+120 && Number(this._winEnd)>=now-120;
  },

async _loadWindow(replace, initialFullDay=false, timelineOnly=false) {
    const requestSeq = ++this._timelineLoadSeq;
    const activeEntity = this._activeCam?.entity || '';
    const { clientId, cam } = this._cc();
    if (!clientId || !cam) return;
    const visibleSpan=Math.max(300,this._winEnd-this._winStart);
    const now=Math.floor(Date.now()/1000);
    // Keep the normal timeline fetch tight. A huge prefetch made rapid scrubs
    // compete with each other on slower Frigate/HA installs and increased the
    // chance that a late response would arrive after the user had moved again.
    const buffer=Math.min(30*60,Math.max(visibleSpan,10*60));
    const browseSpan=Math.max(3600,Number(this._config.window_hours||24)*3600);
    // Media-browser queries are deliberately independent from the visible
    // timeline viewport. On wide layouts the timeline remains on-screen while
    // Clips/Recordings/Reviews occupy the adjacent column, so opening a browser
    // must never repurpose _winStart/_winEnd (and therefore never zoom the
    // timeline out to window_hours / 24h). A selected browser date/time range
    // is used only for the Frigate data query.
    const mediaBounds=(!timelineOnly && this._galleryMode) ? this._mediaQueryBounds(now) : null;
    const after=mediaBounds
      ? mediaBounds.start
      : (initialFullDay ? Math.max(0, now-browseSpan) : Math.max(0,Math.floor(this._winStart-buffer)));
    // A lightweight LIVE refresh should describe data Frigate could actually
    // have finalized, not the intentional future half of the timeline view.
    const before=mediaBounds
      ? mediaBounds.end
      : (initialFullDay ? now : (timelineOnly && this._timelineFollowingLive
        ? now
        : Math.floor(this._winEnd+buffer)));
    // Do not let a slow request for an old scrub position overwrite the
    // currently visible range. Advanced Camera Card uses the same principle:
    // timeline range changes are data-source changes, not just CSS changes.
    try {
      // Mirror Advanced Camera Card's Frigate engine: event queries explicitly
      // ask for clips, while the recording browser uses Frigate's hourly
      // recordings summary. Raw recording segments remain the authoritative
      // source for timeline drawing and exact playback seeking.
      // Keep the three Frigate data sources independent. A recordings-summary
      // command is not available in every HA/Frigate integration combination;
      // it must never suppress otherwise-valid clips or raw recording segments.
      const requests=[
        this._ws({ type:'frigate/events/get', instance_id:clientId, cameras:[cam], after, before, limit:500, has_clip:true }),
        this._ws({ type:'frigate/recordings/get', instance_id:clientId, camera:cam, after, before })
      ];
      // Summary is useful for the Recordings browser, but it is unnecessary
      // overhead for high-frequency moving-timeline refreshes.
      if (!timelineOnly) requests.push(
        this._ws({ type:'frigate/recordings/summary', instance_id:clientId, camera:cam, timezone:this._tz() })
      );
      const settled=await Promise.allSettled(requests);
      const evResult=settled[0], recResult=settled[1], summaryResult=settled[2];
      if (
        requestSeq !== this._timelineLoadSeq ||
        activeEntity !== this._activeCam?.entity ||
        clientId !== this._cc().clientId ||
        cam !== this._cc().cam
      ) return;
      if (timelineOnly) {
        const currentFocus=Number.isFinite(Number(this._timelineFocusTs))
          ? Number(this._timelineFocusTs)
          : ((this._winStart+this._winEnd)/2);
        const liveSlack=this._timelineFollowingLive ? 15 : 0;
        // A fling can travel farther than the prefetch buffer while this request
        // is in flight. Never replace the visible recording cache with a range
        // the playhead has already left; the scheduler will immediately request
        // the newest position instead.
        if (currentFocus < after || currentFocus > before+liveSlack) {
          this._timelineDynamicPending=true;
          return;
        }
      }
      if (evResult.status==='fulfilled') {
        const incomingEvents = Array.isArray(evResult.value) ? evResult.value : [];
        const eventMap = new Map((this._events||[]).map(x=>[String(x.id),x]));
        for (const item of incomingEvents) eventMap.set(String(item.id), item);
        this._events = [...eventMap.values()];
      } else {
        console.warn('[Frigate] clips query failed', evResult.reason);
      }
      if (recResult.status==='fulfilled') {
        this._recordings = Array.isArray(recResult.value) ? recResult.value : [];
        this._recordingsLoaded = true;
        // Track the exact wall-clock interval this recording result represents.
        // A fast fling can move the viewport beyond this interval before the
        // debounced Frigate query for the new position returns. Unknown time
        // must never be rendered as a real "No Recording" gap.
        this._recordingsRangeStart = after;
        this._recordingsRangeEnd = before;
        this._recordingsLoadedAt = Date.now();
      } else {
        console.warn('[Frigate] recording segments query failed', recResult.reason);
      }
      if (!timelineOnly) {
        if (summaryResult?.status==='fulfilled') {
          this._recordingBrowse = this._recordingHoursFromSummary(summaryResult.value, after, before);
        } else {
          // The raw segments remain a fully usable browser fallback.
          this._recordingBrowse = this._mergeRecs(this._recordings||[]);
          console.warn('[Frigate] recordings summary unavailable; using segments', summaryResult?.reason);
        }
      }
      this._timelineDataDirty = true;
      this._mergeLoadedFilterMetadata(this._cc(), this._events, this._reviews);
    } catch(e) {
      if (requestSeq !== this._timelineLoadSeq) return;
      console.warn('[Frigate] timeline range load failed', e);
    }
    const ent=this._activeCam?.entity;
    if (ent&&this._camCache[ent]) { this._camCache[ent].events=this._events; this._camCache[ent].recordings=this._recordings; this._camCache[ent].recordingsLoaded=this._recordingsLoaded; this._camCache[ent].recordingsRangeStart=this._recordingsRangeStart; this._camCache[ent].recordingsRangeEnd=this._recordingsRangeEnd; this._camCache[ent].recordingsLoadedAt=this._recordingsLoadedAt; }
    if (!timelineOnly && this._tab==='reviews') await this._loadReviews();
    if (requestSeq !== this._timelineLoadSeq) return;
    if (!timelineOnly && this._eventsMode==='all') this._loadAllCamsBackground();
    // Clips/Recordings are fed by _loadWindow(), including the periodic refresh
    // timer. While a native picker is open, accept/cache the fresh data but do
    // not let the normal _renderAll() path mutate any visible card DOM. Reviews
    // does not use this path, which is why it appeared stable before this fix.
    if(!timelineOnly && this._mediaPickerActive && this._galleryMode) {
      this._mediaPickerPendingGalleryRender=true;
      return;
    }
    if (timelineOnly) {
      // The moving-window refresh is deliberately surgical: reconcile just the
      // timeline so new events/recording bars/gaps appear while the gesture or
      // LIVE motion is still happening. Stable-key reconciliation preserves
      // existing thumbnail DOM and avoids the old pop/reload behavior.
      this._scheduleTimelineRender(false);
      this._updateTimelineLive();
      this._renderRange();
      this._renderTimelineZoomLabel();
    } else if (this._timelineInteracting) {
      this._scheduleTimelineRender(false);
      this._updateTimelineLive();
      this._renderRange();
      this._renderTimelineZoomLabel();
    } else {
      this._renderAll();
    }
  },

async _loadAllCamsBackground() {
    const loadSeq=this._timelineLoadSeq;
    const after=this._winStart, before=this._winEnd;
    const others = this._config.cameras.filter(c => {
      const cc = this._camCache[c.entity];
      return c.entity !== this._activeCam?.entity && cc && cc.discovered;
    });
    await Promise.all(others.map(async c => {
      const cc = this._camCache[c.entity];
      try {
        const ev = await this._ws({type:'frigate/events/get',instance_id:cc.clientId,cameras:[cc.cam],after,before,limit:200});
        cc.events = Array.isArray(ev) ? ev : [];
        this._mergeLoadedFilterMetadata(cc, cc.events, cc.reviews||[]);
      } catch(_) {}
    }));
    if (loadSeq !== this._timelineLoadSeq || this._eventsMode!=='all') return;
    this._renderList();
  },

async _loadKept() {
    const {clientId,cam}=this._cc();
    try {
      const k=await this._ws({type:'frigate/events/get',instance_id:clientId,cameras:[cam],favorites:true,limit:200});
      this._kept=Array.isArray(k)?k:[];
      const ent=this._activeCam?.entity; if(ent&&this._camCache[ent]) this._camCache[ent].kept=this._kept;
    } catch(_) { this._kept=[]; }
  },

_recordingHoursFromSummary(summary, after, before) {
    const out=[];
    if (!Array.isArray(summary)) return out;
    for (const dayData of summary) {
      const day=dayData?.day;
      if (!day || !Array.isArray(dayData.hours)) continue;
      for (const hourData of dayData.hours) {
        const hour=Number(hourData?.hour);
        if (!Number.isFinite(hour) || hour<0 || hour>23) continue;
        const d=new Date(`${day}T${String(hour).padStart(2,'0')}:00:00`);
        const start=Math.floor(d.getTime()/1000);
        const end=start+3600;
        if (end<=after || start>=before) continue;
        out.push({start_time:Math.max(start,after),end_time:Math.min(end,before),events:Number(hourData.events||0),camera:this._cc().cam,_summary:true});
      }
    }
    const seen=new Set();
    return out.filter(r=>{const k=`${r.start_time}-${r.end_time}`;if(seen.has(k))return false;seen.add(k);return true;}).sort((a,b)=>a.start_time-b.start_time);
  },

async _loadReviews() {
    const {clientId,cam}=this._cc();
    try {
      const now=Math.floor(Date.now()/1000);
      const currentWindow=this._isNowWindow();
      const galleryRange=!!this._galleryMode;
      const browseSpan=Math.max(3600,Number(this._config.window_hours||24)*3600);
      const mediaBounds=galleryRange ? this._mediaQueryBounds(now) : null;
      const after=mediaBounds ? mediaBounds.start : (currentWindow ? now-browseSpan : this._winStart);
      const before=mediaBounds ? mediaBounds.end : (currentWindow ? now : this._winEnd);
      const r=await this._ws({type:'frigate/reviews/get',instance_id:clientId,cameras:[cam],after,before,limit:500});
      this._reviews=Array.isArray(r)?r:[];
      const active=this._cc();
      active.reviews=this._reviews;
      this._mergeLoadedFilterMetadata(active, this._events, this._reviews);
    } catch(_) { this._reviews=[]; }
  },

async _loadCalendar() {
    const {clientId,cam}=this._cc();
    try {
      const sum=await this._ws({type:'frigate/events/summary',instance_id:clientId,timezone:this._tz()});
      if(Array.isArray(sum)) this._daysWithActivity=new Set(sum.filter(s=>s.camera===cam&&s.day).map(s=>s.day));
    } catch(_) {}
  },

_tz() { return this._hass?.config?.time_zone||Intl.DateTimeFormat().resolvedOptions().timeZone||'UTC'; },

async _subscribe() {
    const {clientId}=this._cc(); if(!this._hass?.connection||!clientId) return;
    try {
      this._unsub=this._hass.connection.subscribeMessage(
        msg=>{ if(msg?.type==='end'&&this._isNowWindow()) this._scheduleReload(); },
        {type:'frigate/events/subscribe',instance_id:clientId}
      );
    } catch(_) {}
  },

_scheduleReload() { clearTimeout(this._rt); this._rt=setTimeout(()=>this._loadWindow(true),1500); }
};

// ── src/card/data.js ──
/**
 * Public method-group barrel for dataMethods.
 *
 * Keeping this entry point stable avoids coupling callers to the internal
 * feature layout while allowing each concern to live in a focused module.
 */
const dataMethods = Object.assign(
  {},
  metadataMethods,
  dataLoadingMethods,
);

// ── src/card/render-shell.js ──
/**
 * Stable card DOM shell and top-level event wiring.
 *
 * Styling is intentionally kept in src/styles/shell.js so this module remains
 * focused on semantic markup and lifecycle wiring.
 */
/** Render the stable card shell and wire top-level DOM interactions. */
const renderShellMethods = {
_renderShell() {
    const multiCam = this._config.cameras.length > 1;

    this.shadowRoot.innerHTML = `<style>${SHELL_STYLES}</style>
      <ha-card class="card ${this._config.theme==='light'?'theme-light':this._config.theme==='auto'?'theme-auto':''} ${this._config.bg_color?'custom-bg':''} ${Number(this._config.transparency)>0?'card-transparent':''} ${(this._config.bg_color||Number(this._config.transparency)>0)?'surface-override':''} ${this._isEditorPreview()?'editor-preview':''}" id="card">
        <div class="layout" id="layout">
          <!-- Responsive workspace. These are real sibling columns so the
               card can become video | timeline | media on dashboard-width cards
               without cloning any players, timelines, or gallery DOM. -->
          <div class="col-left workspace-feed">
            <!-- feed: single stream or grid -->
            <div class="feed-area">
              <div id="eng-wrap" class="${this._config.stream_resizable ? 'resizable' : ''}">
                <div id="engine"><div class="ph skel-stream">${ICONS.live}<span>Connecting…</span></div></div>
                <div class="viewer" id="viewer" style="display:none"></div>
                ${this._config.stream_resizable ? '<div class="stream-resize-grip" id="stream-resize-grip" aria-label="Resize video" role="separator"></div>' : ''}
              </div>
              <div id="cam-grid" style="display:none"></div>
              <!-- sits below whichever of eng-wrap/cam-grid is visible, so it
                   survives the single↔grid display:none toggle without duplication -->
              <div class="stream-ctrl-bar" id="stream-ctrl-bar"></div>
            </div>
            ${multiCam ? `<div class="cam-switcher" id="cam-switcher"></div>` : ''}
          </div>

          <div class="tl-sec workspace-timeline">
            <div id="timeline-view" style="${this._config.timeline.enabled?'':'display:none'}">
              <div class="tl-head">
                <div class="tl-tools">
                  <button class="tool" id="now-btn" title="Jump to now">⟳</button>
                  ${this._config.timeline.show_zoom_controls ? `<div class="tl-zoom-controls" role="group" aria-label="Timeline zoom">
                    <button class="tool tl-zoom-btn" id="tl-zoom-out" title="Zoom out" aria-label="Zoom out">−</button>
                    <button class="tool tl-zoom-level" id="tl-zoom-level" title="Reset timeline zoom">${Math.round(this._config.timeline.default_minutes)}m</button>
                    <button class="tool tl-zoom-btn" id="tl-zoom-in" title="Zoom in" aria-label="Zoom in">+</button>
                  </div>` : ''}
                  ${this._config.timeline.show_filter_button ? `<button class="tool" id="filter-btn" title="Filter">${ICONS.filter}</button>` : ''}
                  ${this._config.timeline.show_calendar_button ? `<button class="tool" id="cal-btn" title="Calendar">${ICONS.calendar}</button>` : ''}
                </div>
              </div>
              <div class="filter-panel" id="filter-panel" style="display:none"></div>
              <div class="cal-panel" id="cal-panel" style="display:none"></div>
              <div class="tl-track vertical" id="tl-track" title="Swipe up to move to older footage · drag the blue scrubber · hold near the bottom to move faster · pinch or use − / + to zoom"><div class="tl-now"></div></div>
              <div class="tl-labels" id="tl-labels"></div>
              <div class="legend" id="legend"></div>
            </div>
          </div>

          <!-- Clips / Recordings / Reviews live in their own responsive column.
               On narrow cards it collapses below the feed, preserving the existing
               single-column interaction model. -->
          <div class="col-right workspace-media">
            <div class="media-gallery" id="media-gallery"></div>
          </div>
        </div>
        <div class="toast" id="toast" style="display:none"></div>
      </ha-card>`;
    if (this._configError) {
      const card = this.shadowRoot.querySelector('#card');
      if (card) {
        const msg = document.createElement('div');
        msg.className = 'config-error';
        msg.innerHTML = '<strong>Sightline for Frigate</strong><span>' + this._configError + '</span>';
        card.prepend(msg);
      }
    }
    this._domCache = {}; // invalidate DOM element cache after full re-render
    this._syncResponsiveWorkspace();
    // Bind delegated listeners exactly once. Re-running setConfig/renderShell must
    // never stack click handlers, which otherwise makes media buttons fire twice.
    if (!this._clickListenerBound) {
      this._clickListenerBound = true;
      this.shadowRoot.addEventListener('click', e=>this._click(e));
    }
    if (!this._changeListenerBound) { this._changeListenerBound=true; this.shadowRoot.addEventListener('change', e=>this._change(e)); }
    if (!this._mediaPickerListenerBound) {
      this._mediaPickerListenerBound=true;
      // Capture before ordinary click/change handlers. Opening a native picker can
      // hand control to WebKit immediately, so the lock must exist before any
      // asynchronous Frigate response has a chance to repaint the filter panel.
      const pickerPress=e=>{
        // The visible Date/From/To controls are <label> wrappers. On iOS the
        // initial pointer/touch target is often the label text/calendar glyph
        // rather than the <input> itself, and focus may be handed directly to
        // the native picker. Resolve the whole control to its temporal input so
        // the lock is guaranteed to exist before WebKit opens the system UI.
        const input=this._mediaTemporalInput(e.target);
        if(input) this._beginMediaPicker(input);
        else if(this._mediaPickerActive) this._scheduleMediaPickerRelease(180);
      };
      this.shadowRoot.addEventListener('pointerdown', pickerPress, true);
      // Some WKWebView/iOS combinations dispatch touchstart before/without the
      // pointerdown we expect. The duplicate begin is harmless and makes the
      // native-picker ownership lock deterministic.
      this.shadowRoot.addEventListener('touchstart', pickerPress, {capture:true,passive:true});
      this.shadowRoot.addEventListener('focusin', e=>{
        const input=this._mediaTemporalInput(e.target);
        if(input) this._beginMediaPicker(input);
      }, true);
      // Do NOT use focusout as a native-picker dismissal signal. iOS/WebKit
      // commonly blurs the <input> when it hands control to the system
      // calendar/time wheel, while the picker is still visibly open. Releasing
      // the lock from that blur lets Clips/Recordings repaint underneath the
      // system picker and immediately dismisses it. The lock is released by a
      // committed change, or by the next pointer interaction outside a temporal
      // input after the user dismisses/cancels the picker.
    }
    if (!this._mediaImageListenerBound) {
      this._mediaImageListenerBound=true;
      // Image error/load events do not bubble, so use capture. Fresh Frigate
      // events can briefly return 404 while their thumbnail is finalized; retry
      // those requests without replacing the surrounding timeline DOM.
      this.shadowRoot.addEventListener('error', e=>this._handleMediaImageError(e), true);
      this.shadowRoot.addEventListener('load', e=>this._handleMediaImageLoad(e), true);
    }
    this._setupStreamResize();
    this._wireScrub(); this._wireScroll(); this._applyBrowse();
    if (multiCam) this._renderCamSwitcher();
    this._applyCardStyle();
  }
};

// ── src/card/layout.js ──
/**
 * Card geometry, responsive sizing, stream resize behavior and layout synchronization.
 */
// Prototype methods grouped by responsibility.
const layoutMethods = {
_parseAspectRatio(v) {
    if (!v || String(v).toLowerCase()==='auto') return null;
    const m = String(v).match(/^(\d+(?:\.\d+)?)\s*[:/]\s*(\d+(?:\.\d+)?)$/);
    if (m && Number(m[1]) > 0 && Number(m[2]) > 0) return `${m[1]}/${m[2]}`;
    const n = Number(v);
    return (!isNaN(n) && n > 0) ? `${n}` : null;
  },

_aspectRatioFromEntity(entity=this._activeCam?.entity) {
    const attrs=this._hass?.states?.[entity]?.attributes||{};
    const direct=this._parseAspectRatio(attrs.aspect_ratio || attrs.video_aspect_ratio || attrs.stream_aspect_ratio);
    if(direct) return direct;
    const pairs=[
      [attrs.video_width,attrs.video_height],
      [attrs.stream_width,attrs.stream_height],
      [attrs.width,attrs.height],
    ];
    for(const [w,h] of pairs) {
      const wn=Number(w), hn=Number(h);
      if(wn>0 && hn>0) return `${wn}/${hn}`;
    }
    const resolution=String(attrs.resolution||attrs.video_resolution||'').match(/(\d+)\s*[x×]\s*(\d+)/i);
    if(resolution && Number(resolution[1])>0 && Number(resolution[2])>0) return `${resolution[1]}/${resolution[2]}`;
    return null;
  },

_currentMediaAspectRatio() {
    const media=this._go2rtcLive?.video || this._findVideo(this._engine);
    const w=Number(media?.videoWidth||media?.naturalWidth||0);
    const h=Number(media?.videoHeight||media?.naturalHeight||0);
    return (w>0 && h>0) ? `${w}/${h}` : null;
  },

_watchAutoAspectMedia(media) {
    if(!media || media._frigateAutoAspectBound) return;
    media._frigateAutoAspectBound=true;
    const update=()=>{
      if(this._config?.aspect_ratio!=='auto') return;
      const w=Number(media.videoWidth||media.naturalWidth||0);
      const h=Number(media.videoHeight||media.naturalHeight||0);
      if(w>0 && h>0) {
        const card=this.shadowRoot?.querySelector('.card');
        card?.style.setProperty('--stream-ar',`${w}/${h}`);
        card?.style.setProperty('--stream-ar-num',String(w/h));
      }
    };
    ['loadedmetadata','loadeddata','resize','load'].forEach(ev=>{
      try { media.addEventListener(ev,update,{passive:true}); } catch (_) {}
    });
    update();
  },

_applyCardStyle() {
    const card = this.shadowRoot.querySelector('.card'); if (!card) return;

    // Player geometry authority. Home Assistant mounts the live card
    // before hui-card-preview has necessarily finished joining the composed DOM.
    // A later ResizeObserver pass can therefore add editor-preview after the first
    // paint. Geometry must be recalculated at that transition instead of allowing
    // the old compact-preview CSS to replace the configured height/aspect ratio.
    //
    // Precedence is intentionally simple:
    //   explicit stream_height / drag height -> owns vertical size;
    //   otherwise aspect_ratio (including Auto) -> owns vertical size.
    const configuredVh = Number(this._config.stream_height);
    const runtimeH = Number(this._config._runtime_stream_height);
    const hasRuntimeHeight = this._config.stream_resizable && Number.isFinite(runtimeH) && runtimeH > 0;
    const hasConfiguredHeight = Number.isFinite(configuredVh) && configuredVh > 0;
    const explicitHeight = hasRuntimeHeight ? `${runtimeH}px` : (hasConfiguredHeight ? `${configuredVh}vh` : '');
    card.classList.toggle('stream-height-explicit', !!explicitHeight);
    if (explicitHeight) card.style.setProperty('--stream-h', explicitHeight);
    else card.style.removeProperty('--stream-h');

    // Aspect ratio. Auto follows the selected camera entity first and then
    // upgrades to the live media's true videoWidth/videoHeight once metadata
    // arrives. Use 16:9 only as the brief pre-metadata fallback.
    const autoAspect=this._config.aspect_ratio==='auto';
    const arCss = autoAspect
      ? (this._currentMediaAspectRatio() || this._aspectRatioFromEntity() || '16/9')
      : (this._parseAspectRatio(this._config.aspect_ratio) || '16/9');
    card.style.setProperty('--stream-ar', arCss);
    const arParts=String(arCss).split('/').map(Number);
    const arNum=arParts.length===2 && arParts[0]>0 && arParts[1]>0 ? arParts[0]/arParts[1] : Number(arCss);
    card.style.setProperty('--stream-ar-num', String(Number.isFinite(arNum)&&arNum>0 ? arNum : 16/9));

    // Apply the selected geometry directly to the live wrapper with important
    // priority. The source contains several historical/mobile styling passes;
    // using one final inline authority prevents any later class or HA resize pass
    // from silently restoring the old 16:9/default height.
    const wrap = this.shadowRoot.querySelector('#eng-wrap');
    const editorPreview = card.classList.contains('editor-preview') || this._isEditorPreview();
    if (wrap) {
      wrap.style.setProperty('min-height','0','important');
      if (explicitHeight) {
        // The visual editor must remain usable, so show the requested height but
        // cap only the editor representation. Production/dashboard playback uses
        // the exact configured vh/dragged px value.
        wrap.style.setProperty('width','100%','important');
        wrap.style.setProperty('height', editorPreview ? `min(${explicitHeight}, 280px)` : explicitHeight, 'important');
        wrap.style.setProperty('max-height', editorPreview ? '280px' : 'none', 'important');
        wrap.style.setProperty('aspect-ratio','auto','important');
        wrap.style.setProperty('margin-inline','0','important');
      } else {
        // In editor preview, fit tall/square ratios inside a 280px preview box
        // without changing the ratio. On the real card the stream always spans
        // the available width and its configured ratio determines height.
        wrap.style.setProperty('width', editorPreview ? 'min(100%, calc(280px * var(--stream-ar-num, 1.7777778)))' : '100%', 'important');
        wrap.style.setProperty('height','auto','important');
        wrap.style.setProperty('max-height', editorPreview ? '280px' : 'none', 'important');
        wrap.style.setProperty('aspect-ratio', arCss, 'important');
        wrap.style.setProperty('margin-inline', editorPreview ? 'auto' : '0', 'important');
      }
    }

    // Keep grid geometry under the same precedence rules. The grid itself owns
    // explicit height; otherwise each tile follows the selected aspect ratio.
    const grid=this.shadowRoot.querySelector('#cam-grid');
    if(grid){
      if(explicitHeight){
        grid.style.setProperty('height', editorPreview ? `min(${explicitHeight}, 280px)` : explicitHeight, 'important');
        grid.style.setProperty('max-height', editorPreview ? '280px' : 'none', 'important');
      } else {
        grid.style.removeProperty('height');
        grid.style.setProperty('max-height', editorPreview ? '280px' : 'none', 'important');
      }
    }

    if(autoAspect) {
      const media=this._go2rtcLive?.video || this._findVideo(this._engine);
      if(media) this._watchAutoAspectMedia(media);
    }

    // Theme — for 'auto' prefer HA's own dark-mode flag, fall back to OS media query
    let theme = this._config.theme || 'dark';
    if (theme === 'auto') {
      const haDark = this._hass?.themes?.darkMode;
      const osDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
      theme = (haDark ?? osDark ?? true) ? 'dark' : 'light';
    }
    card.classList.toggle('theme-light', theme === 'light');
    card.classList.remove('theme-auto'); // resolved to light/dark above

    // Custom accent color — compute bg/border variants from hex
    const acc = this._config.accent_color;
    if (acc && /^#[0-9a-f]{6}$/i.test(acc)) {
      const r = parseInt(acc.slice(1,3),16), g = parseInt(acc.slice(3,5),16), b = parseInt(acc.slice(5,7),16);
      card.style.setProperty('--c-acc',     acc);
      card.style.setProperty('--c-acc-bg',  `rgba(${r},${g},${b},.18)`);
      card.style.setProperty('--c-acc-bdr', `rgba(${r},${g},${b},.40)`);
    } else {
      card.style.removeProperty('--c-acc');
      card.style.removeProperty('--c-acc-bg');
      card.style.removeProperty('--c-acc-bdr');
    }

    // Custom background + surface transparency. Transparency is deliberately
    // implemented on the MATERIAL fills rather than `opacity` on the card:
    // icons/text stay crisp, the video remains fully opaque, and backdrop-filter
    // can reveal a Lovelace wallpaper/theme behind the glass.
    const bg = this._config.bg_color;
    const validBg = !!(bg && /^#[0-9a-f]{6}$/i.test(bg));
    const transparency = Math.max(0,Math.min(100,Number(this._config.transparency)||0));
    const transparent = transparency > 0;
    const surfaceFactor = 1 - (transparency / 100);
    const hexRgb = hex => {
      const h=String(hex||'').replace('#','');
      return /^([0-9a-f]{6})$/i.test(h)
        ? [parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)] : null;
    };
    const rgba = (hex,a) => {
      const rgb=hexRgb(hex); if(!rgb) return 'transparent';
      return `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${Math.max(0,Math.min(1,a)).toFixed(3)})`;
    };
    const mixHex = (a,b,t) => {
      const ca=hexRgb(a), cb=hexRgb(b); if(!ca||!cb) return a;
      const m=(x,y)=>Math.round(x*(1-t)+y*t).toString(16).padStart(2,'0');
      return `#${m(ca[0],cb[0])}${m(ca[1],cb[1])}${m(ca[2],cb[2])}`;
    };
    card.classList.toggle('custom-bg', validBg);
    card.classList.toggle('card-transparent', transparent);
    card.classList.toggle('surface-override', validBg || transparent);

    if (validBg || transparent) {
      const light = theme === 'light';
      const baseHex = validBg ? bg : (light ? '#f2f2f7' : '#1c1c20');
      const baseAlpha = validBg ? 1 : (light ? .78 : .72);
      let panel, panel2;
      if (validBg) {
        const mixBase = light ? '#ffffff' : '#000000';
        // Panels stay a touch stronger than the outer glass so controls remain
        // legible over a busy wallpaper while still honoring the same slider.
        panel = rgba(mixHex(baseHex,mixBase,.12), Math.min(1,(baseAlpha+.08)*surfaceFactor));
        panel2 = rgba(mixHex(baseHex,mixBase,.22), Math.min(1,(baseAlpha+.13)*surfaceFactor));
      } else if (light) {
        panel = `rgba(0,0,0,${(.045*surfaceFactor).toFixed(3)})`;
        panel2 = `rgba(0,0,0,${(.070*surfaceFactor).toFixed(3)})`;
      } else {
        panel = `rgba(255,255,255,${(.055*surfaceFactor).toFixed(3)})`;
        panel2 = `rgba(255,255,255,${(.090*surfaceFactor).toFixed(3)})`;
      }
      const surface = rgba(baseHex, baseAlpha*surfaceFactor);
      card.style.setProperty('--c-bg', surface, 'important');
      card.style.setProperty('--c-bg-panel', panel, 'important');
      card.style.setProperty('--c-bg-panel2', panel2, 'important');
      card.style.setProperty('background', surface, 'important');
    } else {
      card.style.removeProperty('--c-bg');
      card.style.removeProperty('--c-bg-panel');
      card.style.removeProperty('--c-bg-panel2');
      card.style.removeProperty('background');
    }
  },

_setupStreamResize() {
    const wrap = this.shadowRoot.querySelector('#eng-wrap');
    const grip = this.shadowRoot.querySelector('#stream-resize-grip');
    if (!wrap || !grip || !this._config.stream_resizable) return;
    if (grip._resizeWired) return;
    grip._resizeWired = true;

    const getMax = () => Math.max(180, Math.min(
      Math.round(window.innerHeight * 0.82),
      Math.round(this.getBoundingClientRect().height * 0.78)
    ));

    const start = ev => {
      if (ev.pointerType === 'mouse' && ev.button !== 0) return;
      ev.preventDefault();
      ev.stopPropagation();
      const rect = wrap.getBoundingClientRect();
      grip.setPointerCapture?.(ev.pointerId);
      grip.classList.add('resizing');
      this._streamResize = {
        pointerId: ev.pointerId,
        startY: ev.clientY,
        startH: rect.height
      };
    };
    const move = ev => {
      const s = this._streamResize;
      if (!s || s.pointerId !== ev.pointerId) return;
      ev.preventDefault();
      const h = Math.max(120, Math.min(getMax(), Math.round(s.startH + ev.clientY - s.startY)));
      this._config._runtime_stream_height = h;
      this._applyCardStyle();
      this._syncColHeight();
    };
    const end = ev => {
      if (!this._streamResize || this._streamResize.pointerId !== ev.pointerId) return;
      try { grip.releasePointerCapture?.(ev.pointerId); } catch (_) {}
      grip.classList.remove('resizing');
      this._streamResize = null;
    };
    grip.addEventListener('pointerdown', start, {passive:false});
    grip.addEventListener('pointermove', move, {passive:false});
    grip.addEventListener('pointerup', end);
    grip.addEventListener('pointercancel', end);
    grip.addEventListener('lostpointercapture', end);
  },

_stabilizeInitialTimeline() {
    // HA can finish measuring the card one or two frames after the first
    // render. Reconcile the timeline after those measurements so the initial
    // scale, thumbnail positions, and centered playhead are calculated from
    // the real track height rather than a transient 0/partial height.
    cancelAnimationFrame(this._initialTimelineRaf1);
    cancelAnimationFrame(this._initialTimelineRaf2);
    this._initialTimelineRaf1 = requestAnimationFrame(() => {
      this._initialTimelineRaf1 = 0;
      this._renderTimeline(true);
      this._renderRange();
      this._renderTimelineZoomLabel();
      this._initialTimelineRaf2 = requestAnimationFrame(() => {
        this._initialTimelineRaf2 = 0;
        this._renderTimeline(true);
        this._renderRange();
        this._renderTimelineZoomLabel();
      });
    });
  },

_setupResizeObserver() {
    this._ro = new ResizeObserver(entries => {
      // Opening an iOS date/time picker can itself perturb the visual viewport
      // and trigger ResizeObserver. Even class/layout writes outside the filter
      // panel can make WebKit dismiss the native picker, so freeze the whole card
      // geometry until picker ownership is released.
      if(this._mediaPickerActive && this._galleryMode) return;
      const w = entries[0].contentRect.width;
      const previousWidth=this._cardWidth;
      this._cardWidth = w;
      const card = this.shadowRoot.querySelector('.card');
      if (!card) return;
      const editorPreview=this._isEditorPreview();
      const wasEditorPreview=card.classList.contains('editor-preview');
      const wide = !editorPreview && w >= 560, mobile = w < 420;
      // Container-width breakpoints, not viewport breakpoints: the same card can
      // therefore be full-dashboard on one view and a normal Section card on another.
      // 820px = video + timeline; 1180px = video + timeline + media browser.
      const dashboardSplit = !editorPreview && w >= 820;
      const workstation = !editorPreview && w >= 1180;
      card.classList.toggle('editor-preview', editorPreview);
      card.classList.toggle('wide', wide);
      card.classList.toggle('mobile', mobile);
      card.classList.toggle('dashboard-split', dashboardSplit);
      card.classList.toggle('workstation', workstation);
      // HA can discover the preview ancestor only after first paint. Reassert
      // player geometry at that exact transition; this fixes the visible
      // set-height/aspect -> flash -> 16:9/default-size regression.
      if(wasEditorPreview!==editorPreview) this._applyCardStyle();
      this._applyBrowse();
      this._syncResponsiveWorkspace();
      this._syncColHeight();
      // Timeline marker size and visual clustering are container-width aware.
      // Reconcile after a meaningful dashboard/grid resize so moving a card
      // between columns immediately gets the right density without a reload.
      if(Math.abs(Number(previousWidth||0)-Number(w||0))>=8 && this.shadowRoot.querySelector('#tl-track')) {
        if(this._timelineResizeRaf) cancelAnimationFrame(this._timelineResizeRaf);
        this._timelineResizeRaf=requestAnimationFrame(()=>{
          this._timelineResizeRaf=0;
          if(this.isConnected) this._renderTimeline(true);
        });
      }
    });
    this._ro.observe(this);
  },

_syncColHeight() {
    // Avoid ancestor geometry changes while the native iOS picker is open.
    if(this._mediaPickerActive && this._galleryMode) return;
    requestAnimationFrame(() => {
      if(this._mediaPickerActive && this._galleryMode) return;
      const card=this.shadowRoot.querySelector('.card');
      const l=this.shadowRoot.querySelector('.workspace-feed');
      if(!card || !l) return;
      if(!card.classList.contains('dashboard-split')) {
        card.style.removeProperty('--workspace-column-h');
        return;
      }
      const h=Math.round(l.getBoundingClientRect().height||l.offsetHeight||0);
      if(h>0) card.style.setProperty('--workspace-column-h',h+'px');
    });
  },

_syncResponsiveWorkspace() {
    const card=this.shadowRoot?.querySelector('.card');
    if(!card) return;
    const split=card.classList.contains('dashboard-split');
    const galleryOpen=!!this._galleryMode;
    card.classList.toggle('gallery-active',galleryOpen);
    const timeline=this.shadowRoot.querySelector('#timeline-view');
    if(timeline) timeline.style.display=(this._config?.timeline?.enabled && (!galleryOpen || split))?'':'none';
    const media=this.shadowRoot.querySelector('.workspace-media');
    if(media) media.setAttribute('aria-hidden',galleryOpen?'false':'true');
  },

_renderCamSwitcher() {
    const el = this.shadowRoot.querySelector('#cam-switcher'); if (!el) return;
    if (this._config.cameras.length < 2) { el.style.display='none'; return; }
    el.style.display = '';

    const tabs = this._config.cameras.map((c,i) => {
      const name = cap(camDisplayName(c));
      const active = this._viewMode === 'single' && i === this._activeCamIdx;
      const ok = this._hass?.states[c.entity]?.state !== 'unavailable';
      return `<button class="cam-tab ${active?'active':''}" data-camidx="${i}"><span class="cam-dot" style="color:${ok?'var(--c-on)':'var(--c-danger)'}">●</span> ${name}</button>`;
    }).join('');
    const gridActive = this._viewMode === 'grid';
    el.innerHTML = `<div class="cam-tabs">${tabs}<button class="cam-tab${gridActive?' active':''}" data-viewmode="grid" title="All cameras">${ICONS.grid} Multiview</button></div>
      <button class="cam-rotate ${this._rotateTimer?'on':''}" id="rotate-btn" title="Auto-rotate">${ICONS.rotate}</button>`;
  }
};

// ── src/card/media/picker.js ──
/**
 * Native date/time picker ownership and delegated form-change handling.
 *
 * Methods are composed onto SightlineCard.prototype; method names are kept
 * stable so existing card behavior and tests remain unchanged.
 */
const mediaPickerMethods = {
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

// ── src/card/media/navigation.js ──
/**
 * Media browser navigation, delegated clicks, tabs, and gallery-mode transitions.
 *
 * Methods are composed onto SightlineCard.prototype; method names are kept
 * stable so existing card behavior and tests remain unchanged.
 */
const mediaNavigationMethods = {
_click(e) {
    const galleryTab = e.target.closest('[data-gallery-tab]');
    if (galleryTab) return this._setGalleryMode(galleryTab.dataset.galleryTab);
    if (e.target.closest('#sc-talk')) return this._toggleTalk();
    if (e.target.closest('#sc-fs')) {
      const target=this._viewMode==='grid' ? this.shadowRoot.querySelector('#cam-grid') : this.shadowRoot.querySelector('#eng-wrap');
      return this._fullscreen(target);
    }
    if (e.target.closest('#media-filter-btn')) return this._toggleMediaFilter();
    const mf=e.target.closest('[data-mf]'); if (mf) { this._setMediaFilter(mf.dataset.mf, mf.dataset.mv); return; }
    if (e.target.closest('#media-filter-reset')) { this._resetMediaFilter(); return; }
    if (e.target.closest('#filter-btn')) return this._toggleFilter();
    if (e.target.closest('#cal-btn')) return this._toggleCal();
    if (e.target.closest('#now-btn')) return this._goNow();
    if (e.target.closest('#tl-zoom-in')) return this._zoomTimeline(1.35);
    if (e.target.closest('#tl-zoom-out')) return this._zoomTimeline(1/1.35);
    if (e.target.closest('#tl-zoom-level')) return this._resetTimelineZoom();
    if (e.target.closest('#rotate-btn')) return this._toggleRotate();
    if (e.target.closest('[data-mark-all]')) return this._markAll();
    if (e.target.closest('[data-toggle-reviewed]')) { this._showReviewed=!this._showReviewed; this._renderList(); return; }

    const setvm = e.target.closest('[data-setviewmode]'); if (setvm) return this._setViewMode(setvm.dataset.setviewmode);
    const viewm = e.target.closest('[data-viewmode]'); if (viewm) return this._setViewMode(viewm.dataset.viewmode);
    const camTab = e.target.closest('[data-camidx]'); if (camTab) return this._switchCamera(Number(camTab.dataset.camidx));
    const calDay = e.target.closest('[data-cal-day]'); if (calDay) return this._pickDay(calDay.dataset.calDay);
    const calNav = e.target.closest('[data-cal-nav]'); if (calNav) return this._calNav(Number(calNav.dataset.calNav));
    const fopt = e.target.closest('[data-flabel]'); if (fopt) { this._filterLabel=fopt.dataset.flabel; this._applyLiveFilterChange(); return; }
    const faceOpt = e.target.closest('[data-fface]'); if (faceOpt) { this._filterFace=faceOpt.dataset.fface; this._applyLiveFilterChange(); return; }
    const zopt = e.target.closest('[data-fzone]'); if (zopt) { this._filterZone=zopt.dataset.fzone; this._applyLiveFilterChange(); return; }
    const favo = e.target.closest('[data-favonly]'); if (favo) { this._favOnly=favo.dataset.favonly==='1'; this._applyLiveFilterChange(); return; }

    const rangeDl = e.target.closest('[data-range-download]'); if (rangeDl) { e.stopPropagation(); return this._confirmDownloadRangePicker(); }
    const rangeCancel = e.target.closest('[data-range-cancel]'); if (rangeCancel) { e.stopPropagation(); return this._cancelDownloadRangePicker(); }
    const recDl = e.target.closest('[data-rec-download]'); if (recDl) { e.stopPropagation(); const ts=this._scrubTarget||this._timelineFocusTs||this._playing?.rec||Math.floor(Date.now()/1000); return this._enterDownloadRangePicker(ts); }
    const dl = e.target.closest('[data-dl]'); if (dl) { e.stopPropagation(); return this._download(dl.dataset.dl,dl.dataset.dlFile); }
    const fav = e.target.closest('[data-fav]'); if (fav) { e.stopPropagation(); return this._toggleFav(fav.dataset.fav); }
    const revMark = e.target.closest('[data-mark]'); if (revMark) { const rv=revMark.closest('[data-review-id]'); e.stopPropagation(); if(rv) return this._markReviewed(rv.dataset.reviewId); }
    const revOpen = e.target.closest('[data-review-open]'); if (revOpen) return this._showClipById(revOpen.dataset.reviewOpen);
    const pill = e.target.closest('[data-tab]'); if (pill) return this._setTab(pill.dataset.tab);
    const timelinePreview = e.target.closest('.t-preview[data-event-id]');
    if (timelinePreview) return this._activateTimelineEvent(timelinePreview.dataset.eventId);
    const tick = e.target.closest('[data-tick]');
    if (tick) return this._activateTimelineEvent(tick.dataset.tick);
    // Stop seek-bar clicks from bubbling up to the recording row handler
    if (e.target.closest('.rec-seek-wrap')) return;
    const recRow = e.target.closest('[data-rs]'); if (recRow) return this._toggleRecSeek(recRow);
    const restoreSlot = e.target.closest('[data-restore-slot]');
    if (restoreSlot) { e.stopPropagation(); this._mountGrid(); return; }
    // per-slot fullscreen (from innerHTML-created button in _openInGridSlot)
    const slotFs = e.target.closest('[data-slot-fs]');
    if (slotFs) { e.stopPropagation(); this._fullscreen(slotFs.closest('.grid-slot')); return; }
    // whole-grid fullscreen
    const gridFs = e.target.closest('[data-grid-fs]');
    if (gridFs) { e.stopPropagation(); this._fullscreen(this.shadowRoot.querySelector('#cam-grid')); return; }
    const card = e.target.closest('[data-ev]'); if (card) {
      // Event media is a workspace-level playback action. In Multiview the
      // grid is the return target, not a per-camera playback surface. Routing
      // every browser event through `_open()` keeps Clips aligned with timeline
      // and Review playback, and lets playback-layout.js temporarily replace
      // the complete player until Back to Multiview is selected.
      return this._open(card.dataset.ev);
    }
  },

async _setGalleryMode(tab) {
    // Gallery navigation is intentionally a two-phase update: establish the
    // final layout synchronously, then load/paint asynchronous review data.
    // This prevents the first Reviews tap from briefly rendering against the
    // old timeline height and then only looking correct after a second tap.
    const gallery = this.shadowRoot.querySelector('#media-gallery');
    const timeline = this.shadowRoot.querySelector('#timeline-view');

    if (tab === 'live') {
      this._galleryMode = '';
      this._tab = 'live';
      // Returning from Clips/Recordings/Reviews always starts the timeline at
      // the current time with the standard 10-minute viewport. Do not reuse
      // the gallery's 24-hour data window as the visible timeline range.
      this._resetTimelineToNow10m();
      if (gallery) { gallery.classList.remove('open'); gallery.innerHTML=''; }
      this._syncResponsiveWorkspace();
      this._showLive();
      this._renderStreamCtrl();
      requestAnimationFrame(() => {
        this._renderTimeline(true);
        this._renderRange();
        this._renderTimelineZoomLabel();
        this._syncColHeight();
      });
      this._loadWindow(true);
      return;
    }

    // If timeline/clip playback is active, leave playback *before* opening the
    // requested gallery. Previously the gallery was constructed first and then
    // _showLive() cleared it, so the first Clips/Recordings/Reviews click after
    // a timeline seek appeared to do nothing and a second click was required.
    // Also cancel a pending desktop wheel-settle callback so it cannot reopen a
    // recording after the gallery has been selected.
    clearTimeout(this._wt);
    this._wt=null;
    this._timelineInteracting=false;
    this._downloadRange=null;
    ++this._timelineSeekSeq;
    if (this._playing || this._activePlaybackCleanup || this._playbackSession) {
      this._showLive();
    }

    this._galleryMode = tab;
    this._tab = tab;
    // Browser filters default to All, never Today. The media browser queries
    // its own rolling window while the timeline retains its exact zoom/focus.
    // This is required for the wide workspace where both panes are visible.
    this._syncResponsiveWorkspace();
    if (gallery) {
      gallery.classList.add('open');
      gallery.innerHTML = `<div class="media-gallery-head"><div class="media-gallery-head-left"><span class="section-label">${tab==='clips'?'Clips':tab==='recordings'?'Recordings':'Reviews'}</span><button id="media-filter-btn" class="media-gallery-filter-btn" title="Filter" aria-label="Filter">${ICONS.filter}<span>Filter</span></button></div><span class="media-gallery-count">…</span></div><div id="media-filter-panel" class="media-filter-panel"></div><div class="media-gallery-grid"><div class="empty-state">Loading…</div></div>`;
    }
    // Update navigation before async work so the selected state is stable on
    // the very first tap.
    this._renderStreamCtrl();
    requestAnimationFrame(() => this._syncColHeight());

    const requestedTab = tab;
    if (tab === 'reviews') {
      await this._loadReviews();
      // Do not let a slower Reviews request overwrite a later Live/Clips tap.
      if (this._galleryMode === requestedTab) this._renderGallery();
    } else {
      // Clips and Recordings are browser views, not just alternate renderings of
      // the current timeline cache. Fetch the selected day/range on entry so a
      // timeline scrub cannot leave either browser empty or scoped to 10 minutes.
      await this._loadWindow(true);
      if (this._galleryMode === requestedTab) this._renderGallery();
    }
    requestAnimationFrame(() => {
      this._syncColHeight();
      const g=this.shadowRoot.querySelector('#media-gallery');
      if (g && this._galleryMode===tab) {
        g.classList.add('open');
        // Force a single post-image/layout reconciliation. This is deliberately
        // one frame, not a continuous observer, to avoid timeline-style churn.
        requestAnimationFrame(() => this._syncColHeight());
      }
    });
  },

_timelineDefaultSpanSeconds() {
    return Math.max(5*60,Math.min(60*60,Math.round(Number(this._config?.timeline?.default_minutes||10)*60)));
  },

_resetTimelineToNow10m() {
    const now=Math.floor(Date.now()/1000);
    const span=this._timelineDefaultSpanSeconds();
    this._winStart=now-span/2;
    this._winEnd=now+span/2;
    this._timelineFocusTs=now;
    this._scrubTarget=now;
    this._timelineZoom=3600/span;
    this._timelineFollowingLive=true;
    this._exhausted=false;
    this._calMonth=null;
    this._timelineDataDirty=true;
    this._renderTimelineZoomLabel();
  },

_setTab(tab) {
    this._galleryMode = '';
    const gallery=this.shadowRoot.querySelector('#media-gallery'); if(gallery) { gallery.classList.remove('open'); gallery.innerHTML=''; }
    const timeline=this.shadowRoot.querySelector('#timeline-view'); if(timeline) timeline.style.display=this._config.timeline.enabled?'':'none';
    this._syncResponsiveWorkspace();
    this._tab = tab;
    this.shadowRoot.querySelectorAll('[data-tab]').forEach(p=>p.classList.toggle('active',p.dataset.tab===tab));
    const lbl=this.shadowRoot.querySelector('#list-label');
    if (lbl) lbl.textContent=({live:'Recent events',recordings:'Recordings',clips:'Clips',snapshot:'Snapshots',reviews:'Reviews',kept:'Kept'})[tab]||tab;
    if (tab==='live') this._showLive();
    if (tab==='reviews') this._loadReviews().then(()=>this._renderList());
    if (tab==='kept') this._loadKept().then(()=>this._renderList());
    this._renderList();
  }
};

// ── src/card/media/gallery.js ──
/**
 * Clips, recordings, and reviews gallery rendering.
 *
 * Methods are composed onto SightlineCard.prototype; method names are kept
 * stable so existing card behavior and tests remain unchanged.
 */
const mediaGalleryMethods = {
_renderGallery(force=false) {
    const gallery=this.shadowRoot.querySelector('#media-gallery'); if(!gallery || !this._galleryMode) return;
    // While a native date/time picker owns the screen, do not mutate any part
    // of the gallery. Clips/Recordings receive asynchronous _loadWindow()
    // updates that Reviews does not, and even changing sibling result rows or
    // ancestor height can make iOS dismiss the native picker although the
    // <input> itself survived. Queue one repaint and keep the DOM pixel-stable.
    if(this._mediaPickerActive && !force) {
      this._mediaPickerPendingGalleryRender=true;
      return;
    }
    this._mediaPickerPendingGalleryRender=false;
    const tab=this._galleryMode; let title=''; let content=''; let count=0;
    this._normalizeMediaFilterState();
    const activeFilters=this._mediaFilterActive();
    if(tab==='clips') {
      const events=this._filterMediaEvents(this._eventsMode==='all'?this._allDisplayEvents():this._events); title='Clips'; count=events.length;
      content=events.length ? events.map(ev=>this._eventCardHTML(ev,false)).join('') : this._emptyState(ICONS.clips,'No clips match','Try changing the filters');
    } else if(tab==='recordings') {
      const recs=this._filterMediaRecordings(this._recordingBrowse.length ? this._recordingBrowse : this._mergeRecs(this._recordings)).sort((a,b)=>b.start_time-a.start_time); title='Recordings'; count=recs.length;
      content=recs.length ? recs.map(r=>{ const rs=Math.floor(r.start_time), re=Math.floor(r.end_time||Date.now()/1000); const d=Math.max(1,re-rs), mm=Math.floor(d/60), ss=d%60; return `<div class="rec" data-rs="${rs}" data-re="${re}"><div class="ric">${ICONS.recordings}</div><div class="rinf"><div class="rt">${this._time(r.start_time)} – ${this._time(r.end_time||Date.now()/1000)}</div><div class="rsub">${mm?mm+'m ':''}${ss}s${r.events?' · '+r.events+' ev':''}</div></div><div class="rp">▶</div></div>`; }).join('') : this._emptyState(ICONS.recordings,'No recordings match','Try changing the filters');
    } else if(tab==='reviews') {
      const revs=this._filterMediaReviews(this._reviews).sort((a,b)=>b.start_time-a.start_time); title='Reviews'; count=revs.length;
      content=revs.length ? revs.map(r=>{ const sev=r.severity==='alert'?'alert':'detection'; const objs=this._reviewLabelList(r).map(x=>this._filterDisplayName('label',x)).join(', '); const title=r.data?.metadata?.title||objs||cap(r.severity); const firstDet=(r.data?.detections&&r.data.detections[0])||''; const reviewed=r.has_been_reviewed; const reviewThumbUrl=firstDet?this._mediaForEvent({id:firstDet,camera:r.camera},'thumbnail.jpg'):''; const thumb=firstDet?`<div class="rev-th"><img src="${reviewThumbUrl}" data-frigate-thumb="1" data-thumb-src="${reviewThumbUrl}" loading="lazy"><div class="tph thumb-fallback" style="display:none">${ICONS.reviews}</div></div>`:''; return `<div class="rev ${sev}" data-review-id="${r.id}" ${firstDet?`data-review-open="${firstDet}"`:''}><div class="rev-sev ${sev}"></div>${thumb}<div class="rev-inf"><div class="rev-t">${title}</div><div class="rev-m">${this._time(r.start_time)} · ${cap(sev)}${reviewed?' · ✓':firstDet?' · tap':''}</div></div>${reviewed?'':`<button class="ico" data-mark>${ICONS.reviews}</button>`}</div>`; }).join('') : this._emptyState(ICONS.reviews,'No reviews match','Try changing the filters');
    } else return;

    // IMPORTANT: never replace the filter panel merely because clips/recordings
    // refreshed in the background. Native iOS date/time pickers are attached to
    // the exact input DOM node; replacing the gallery used to destroy that node
    // and instantly dismiss the picker. Build the shell once, then update only
    // the header/count/results around the stable panel.
    let head=gallery.querySelector('.media-gallery-head');
    let panel=gallery.querySelector('#media-filter-panel');
    let grid=gallery.querySelector('.media-gallery-grid');
    if(!head || !panel || !grid) {
      gallery.innerHTML=`<div class="media-gallery-head"><div class="media-gallery-head-left"><span class="section-label"></span><button id="media-filter-btn" class="media-gallery-filter-btn" title="Filter" aria-label="Filter">${ICONS.filter}<span>Filter</span></button></div><span class="media-gallery-count"></span></div><div id="media-filter-panel" class="media-filter-panel"></div><div class="media-gallery-grid"></div>`;
      head=gallery.querySelector('.media-gallery-head');
      panel=gallery.querySelector('#media-filter-panel');
      grid=gallery.querySelector('.media-gallery-grid');
    }
    const label=head?.querySelector('.section-label'); if(label) label.textContent=title;
    const countEl=head?.querySelector('.media-gallery-count'); if(countEl) countEl.textContent=String(count);
    const filterBtn=head?.querySelector('#media-filter-btn'); if(filterBtn) filterBtn.classList.toggle('active',activeFilters);
    if(grid) grid.innerHTML=content;
    this._renderMediaFilter(force);
  },

_mediaCameraDisplay(camera) {
    const key=String(camera||'');
    const cfg=this._config?.cameras?.find(c=>String(this._camCache[c.entity]?.cam||'')===key);
    return cfg ? (cfg.name||cap(camDisplayName(cfg))) : cap(key.replace(/_/g,' '));
  }
};

// ── src/card/media/filters.js ──
/**
 * Media filter state, date/time ranges, filtering predicates, and filter UI.
 *
 * Methods are composed onto SightlineCard.prototype; method names are kept
 * stable so existing card behavior and tests remain unchanged.
 */
const mediaFilterMethods = {
_mediaFilterActive() {
    const f=this._mediaFilter;
    const cameraActive=this._eventsMode==='all' && (this._config?.cameras?.length||0)>1 && f.camera!=='all';
    return cameraActive||f.label!=='all'||f.face!=='all'||f.zone!=='all'||f.favorites||f.reviewed!=='all'||f.severity!=='all'||f.duration!=='all'||f.date!=='all'||!!f.timeStart||!!f.timeEnd;
  },

_mediaFilterValues() {
    const f=this._mediaFilter;
    const baseEvents=this._eventsMode==='all'?this._allDisplayEvents():(this._events||[]);
    const baseReviews=this._reviews||[];
    const cams=new Set();
    for(const e of baseEvents) if(e?.camera) cams.add(String(e.camera));
    for(const r of baseReviews) if(r?.camera) cams.add(String(r.camera));
    if(this._cc().cam) cams.add(String(this._cc().cam));
    const selectedCamera=f.camera!=='all'?String(f.camera):null;
    const labels=new Set(), faces=new Set(), zones=new Set();
    const states=this._config.cameras.map(c=>this._camCache[c.entity]).filter(cc=>cc&&cams.has(String(cc.cam||''))&&(!selectedCamera||String(cc.cam)===selectedCamera));
    for(const cc of states) {
      for(const l of (cc.filterLabels||[])) { const label=this._normalizeObjectLabel(l); if(label) labels.add(label); }
      for(const face of (cc.filterFaces||[])) if(face) faces.add(String(face));
      for(const z of (cc.filterZones||[])) if(z) zones.add(String(z));
    }
    for(const e of baseEvents) {
      if(selectedCamera&&String(e?.camera)!==selectedCamera) continue;
      { const label=this._normalizeObjectLabel(e?.label); if(label) labels.add(label); }
      for(const face of this._eventFaceList(e)) faces.add(face);
      for(const z of this._eventZoneList(e)) zones.add(z);
    }
    for(const r of baseReviews) {
      if(selectedCamera&&r?.camera&&String(r.camera)!==selectedCamera) continue;
      for(const l of this._reviewLabelList(r)) labels.add(l);
      for(const face of this._reviewFaceList(r)) faces.add(face);
      for(const z of this._reviewZoneList(r)) zones.add(z);
    }
    return {cams:[...cams].sort(),labels:[...labels].sort(),faces:[...faces].sort((a,b)=>String(a).localeCompare(String(b))),zones:[...zones].sort()};
  },

_normalizeMediaFilterState() {
    let v=this._mediaFilterValues(), f=this._mediaFilter;
    const canFilterCamera=this._eventsMode==='all' && (this._config?.cameras?.length||0)>1;
    if(!canFilterCamera) f.camera='all';
    else if(f.camera!=='all'&&!v.cams.includes(f.camera)) { f.camera='all'; v=this._mediaFilterValues(); }
    if(f.label!=='all'&&!v.labels.includes(f.label)) f.label='all';
    if(f.face!=='all'&&!v.faces.includes(f.face)) f.face='all';
    if(f.zone!=='all'&&!v.zones.includes(f.zone)) f.zone='all';
    return v;
  },

_mediaDateBounds(date) {
    if (!date || date==='all') return null;
    const parts=String(date).split('-').map(Number);
    if (parts.length!==3 || parts.some(n=>!Number.isFinite(n))) return null;
    const [y,mo,d]=parts;
    const start=Math.floor(new Date(y,mo-1,d,0,0,0,0).getTime()/1000);
    const end=Math.floor(new Date(y,mo-1,d+1,0,0,0,0).getTime()/1000);
    return Number.isFinite(start)&&Number.isFinite(end)?{start,end,y,mo,d}:null;
  },

_mediaTimeParts(value) {
    const m=String(value||'').match(/^(\d{1,2}):(\d{2})$/);
    if(!m) return null;
    const h=Number(m[1]), min=Number(m[2]);
    return h>=0&&h<=23&&min>=0&&min<=59?{h,min,minutes:h*60+min}:null;
  },

_mediaAbsoluteBounds() {
    const f=this._mediaFilter, b=this._mediaDateBounds(f.date);
    if(!b) return null;
    const a=this._mediaTimeParts(f.timeStart), z=this._mediaTimeParts(f.timeEnd);
    const startDate=new Date(b.y,b.mo-1,b.d,a?.h??0,a?.min??0,0,0);
    let endDate=new Date(b.y,b.mo-1,b.d,z?.h??24,z?.min??0,0,0);
    if(!z) endDate=new Date(b.y,b.mo-1,b.d+1,0,0,0,0);
    else if(a && z.minutes<=a.minutes) endDate=new Date(b.y,b.mo-1,b.d+1,z.h,z.min,0,0); // overnight range
    const start=Math.floor(startDate.getTime()/1000), end=Math.floor(endDate.getTime()/1000);
    return Number.isFinite(start)&&Number.isFinite(end)&&end>start?{start,end}:b;
  },

_mediaQueryBounds(now=Math.floor(Date.now()/1000)) {
    const abs=this._mediaAbsoluteBounds();
    if(abs) {
      const start=Math.max(0,Math.floor(abs.start));
      const end=Math.max(start+1,Math.min(now,Math.floor(abs.end)));
      return {start,end};
    }
    const span=Math.max(3600,Number(this._config?.window_hours||24)*3600);
    return {start:Math.max(0,now-span),end:now};
  },

_mediaMatchesTimeOfDay(ts) {
    const f=this._mediaFilter, a=this._mediaTimeParts(f.timeStart), z=this._mediaTimeParts(f.timeEnd);
    if(!a&&!z) return true;
    const d=new Date(Number(ts)*1000); if(!Number.isFinite(d.getTime())) return false;
    const m=d.getHours()*60+d.getMinutes();
    if(a&&z) return z.minutes>a.minutes ? (m>=a.minutes&&m<=z.minutes) : (m>=a.minutes||m<=z.minutes);
    if(a) return m>=a.minutes;
    return m<=z.minutes;
  },

_filterByMediaTemporal(items,date,endKey='end_time') {
    const abs=this._mediaAbsoluteBounds();
    if(abs) {
      return (items||[]).filter(x=>{
        const st=Number(x?.start_time), en=Number(x?.[endKey] ?? st);
        return Number.isFinite(st)&&Number.isFinite(en)&&en>=abs.start&&st<abs.end;
      });
    }
    // "All dates" keeps the browser's rolling 24h data set; a time range in
    // that mode is a time-of-day filter across those loaded items.
    return (items||[]).filter(x=>this._mediaMatchesTimeOfDay(Number(x?.start_time)));
  },

async _setMediaTemporal(key,value) {
    if(key==='date') this._mediaFilter.date=value||'all';
    else if(key==='timeStart'||key==='timeEnd') this._mediaFilter[key]=value||'';
    // Browser date/time filtering changes only the browser query. The visible
    // timeline keeps its own zoom/focus range, which is especially important
    // when both are visible together in the wide workspace.
    const tab=this._galleryMode;
    if(!tab){ this._renderGallery(); return; }
    if(tab==='reviews') await this._loadReviews();
    else await this._loadWindow(true);
    if(this._galleryMode===tab) {
      this._renderGallery();
      const p=this.shadowRoot.querySelector('#media-filter-panel');
      if(p) p.classList.add('open');
    }
  },

async _setMediaDate(date) { return this._setMediaTemporal('date',date||'all'); },

_filterMediaEvents(events) {
    const f=this._mediaFilter; let list=this._filterByMediaTemporal((events||[]).filter(e=>e.has_clip!==false),f.date);
    if(f.camera!=='all') list=list.filter(e=>e.camera===f.camera);
    if(f.label!=='all') list=list.filter(e=>this._normalizeObjectLabel(e?.label)===f.label);
    if(f.face!=='all') list=list.filter(e=>this._eventFaceList(e).includes(f.face));
    if(f.zone!=='all') list=list.filter(e=>this._eventZoneList(e).includes(f.zone));
    if(f.favorites) list=list.filter(e=>e.retain_indefinitely||e.is_favorite||e.favorite);
    return list;
  },

_filterMediaRecordings(records) {
    const f=this._mediaFilter; let list=this._filterByMediaTemporal(records||[],f.date);
    if(f.camera!=='all') list=list.filter(r=>!r.camera||r.camera===f.camera);
    if(f.duration==='short') list=list.filter(r=>(r.end_time-r.start_time)<60);
    if(f.duration==='medium') list=list.filter(r=>(r.end_time-r.start_time)>=60&&(r.end_time-r.start_time)<300);
    if(f.duration==='long') list=list.filter(r=>(r.end_time-r.start_time)>=300);
    if(f.favorites) list=list.filter(r=>r.retain_indefinitely||r.favorite||r.is_favorite);
    return list;
  },

_filterMediaReviews(reviews) {
    const f=this._mediaFilter; let list=this._filterByMediaTemporal(reviews||[],f.date);
    if(f.camera!=='all') list=list.filter(r=>!r.camera||r.camera===f.camera);
    if(f.label!=='all') list=list.filter(r=>this._reviewLabelList(r).includes(f.label));
    if(f.face!=='all') list=list.filter(r=>this._reviewFaceList(r).includes(f.face));
    if(f.zone!=='all') list=list.filter(r=>this._reviewZoneList(r).includes(f.zone));
    if(f.reviewed==='unreviewed') list=list.filter(r=>!r.has_been_reviewed);
    if(f.reviewed==='reviewed') list=list.filter(r=>!!r.has_been_reviewed);
    if(f.severity!=='all') list=list.filter(r=>r.severity===f.severity);
    return list;
  },

_toggleMediaFilter() {
    const p=this.shadowRoot.querySelector('#media-filter-panel'); if(!p) return;
    const opening=!p.classList.contains('open');
    if(opening) this._loadFrigateFilterMetadata();
    p.classList.toggle('open');
    this._renderMediaFilter();
  },

_setMediaFilter(key,value) {
    if(key==='date') return this._setMediaDate(value);
    if(key==='timeStart' && value===''){
      this._mediaFilter.timeStart=''; this._mediaFilter.timeEnd='';
      return this._setMediaTemporal('timeStart','');
    }
    if(key==='favorites') this._mediaFilter.favorites=value==='1'; else this._mediaFilter[key]=value;
    this._normalizeMediaFilterState();
    this._renderGallery(); const p=this.shadowRoot.querySelector('#media-filter-panel'); if(p) p.classList.add('open');
  },

_resetMediaFilter() {
    // Reset browser filters without touching the timeline viewport.
    this._mediaFilter={camera:'all',label:'all',face:'all',zone:'all',favorites:false,reviewed:this._config?.media?.reviewed_default||'all',severity:'all',duration:'all',date:'all',timeStart:'',timeEnd:''};
    const tab=this._galleryMode;
    if (tab==='reviews') this._loadReviews().then(()=>{ if(this._galleryMode===tab)this._renderGallery(); });
    else if (tab) this._loadWindow(true).then(()=>{ if(this._galleryMode===tab)this._renderGallery(); });
    else this._renderGallery();
  },

_renderMediaFilter(force=false) {
    const p=this.shadowRoot.querySelector('#media-filter-panel'); if(!p||!this._galleryMode) return;
    if(this._mediaPickerActive && !force) {
      this._mediaPickerPendingFilterRender=true;
      return;
    }
    this._mediaPickerPendingFilterRender=false;
    const wasOpen=p.classList.contains('open');
    const f=this._mediaFilter, v=this._normalizeMediaFilterState(), chip=(key,val,label,checked)=>`<button class="media-filter-chip${checked?' on':''}" data-mf="${key}" data-mv="${val}">${label}</button>`;
    const today=new Date();
    const todayStr=`${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
    const dateValue=f.date==='all'?'':f.date;
    const dateRow=`<div class="media-filter-row"><span class="media-filter-label">Date</span><button class="media-filter-chip${f.date==='all'?' on':''}" data-mf="date" data-mv="all">All dates</button><label class="media-filter-date-control"><span>${ICONS.calendar||''}</span><input id="media-filter-date" type="date" max="${todayStr}" value="${dateValue}" aria-label="Filter by date"></label>${f.date!=='all'?'<button class="media-filter-reset-date" data-mf="date" data-mv="all">Clear</button>':''}</div>`;
    const timeRow=`<div class="media-filter-row"><span class="media-filter-label">Time</span><label class="media-filter-time-control"><span>From</span><input id="media-filter-time-start" type="time" step="60" value="${f.timeStart||''}" aria-label="Start time"></label><label class="media-filter-time-control"><span>To</span><input id="media-filter-time-end" type="time" step="60" value="${f.timeEnd||''}" aria-label="End time"></label>${(f.timeStart||f.timeEnd)?'<button class="media-filter-reset-date" data-mf="timeStart" data-mv="">Clear time</button>':''}</div>`;
    const canFilterCamera=this._eventsMode==='all' && (this._config?.cameras?.length||0)>1;
    const cameraRow=canFilterCamera&&v.cams.length>1?`<div class="media-filter-row"><span class="media-filter-label">Camera</span>${chip('camera','all','All',f.camera==='all')}${v.cams.map(c=>chip('camera',c,this._mediaCameraDisplay(c),f.camera===c)).join('')}</div>`:'';
    const showObjectFilters=(this._galleryMode==='clips'||this._galleryMode==='reviews');
    const labelRow=showObjectFilters&&v.labels.length?`<div class="media-filter-row"><span class="media-filter-label">Label</span>${chip('label','all','All',f.label==='all')}${v.labels.map(x=>chip('label',x,this._filterDisplayName('label',x),f.label===x)).join('')}</div>`:'';
    const faceRow=showObjectFilters&&v.faces.length?`<div class="media-filter-row"><span class="media-filter-label">Face</span>${chip('face','all','All',f.face==='all')}${v.faces.map(x=>chip('face',x,this._faceDisplayName(x),f.face===x)).join('')}</div>`:'';
    const zoneRow=showObjectFilters&&v.zones.length?`<div class="media-filter-row"><span class="media-filter-label">Zone</span>${chip('zone','all','All',f.zone==='all')}${v.zones.map(x=>chip('zone',x,this._filterDisplayName('zone',x),f.zone===x)).join('')}</div>`:'';
    const common=this._galleryMode!=='reviews'?`<div class="media-filter-row"><span class="media-filter-label">Saved</span>${chip('favorites','0','All',!f.favorites)}${chip('favorites','1','Favorites',f.favorites)}</div>`:'';
    const duration=this._galleryMode==='recordings'?`<div class="media-filter-row"><span class="media-filter-label">Length</span>${chip('duration','all','Any',f.duration==='all')}${chip('duration','short','< 1m',f.duration==='short')}${chip('duration','medium','1–5m',f.duration==='medium')}${chip('duration','long','> 5m',f.duration==='long')}</div>`:'';
    const review=this._galleryMode==='reviews'?`<div class="media-filter-row"><span class="media-filter-label">Status</span>${chip('reviewed','unreviewed','Unreviewed',f.reviewed==='unreviewed')}${chip('reviewed','reviewed','Reviewed',f.reviewed==='reviewed')}${chip('reviewed','all','All',f.reviewed==='all')}</div><div class="media-filter-row"><span class="media-filter-label">Type</span>${chip('severity','all','All',f.severity==='all')}${chip('severity','alert','Alerts',f.severity==='alert')}${chip('severity','detection','Detections',f.severity==='detection')}</div>`:'';
    p.innerHTML=`${dateRow}${timeRow}${cameraRow}${labelRow}${faceRow}${zoneRow}${duration}${review}${common}<div class="media-filter-row"><button id="media-filter-reset" class="media-filter-reset">Reset filters</button></div>`;
    p.classList.toggle('open',wasOpen);
  }
};

// ── src/card/browser.js ──
/**
 * Public method-group barrel for browserMethods.
 *
 * Keeping this entry point stable avoids coupling callers to the internal
 * feature layout while allowing each concern to live in a focused module.
 */
const browserMethods = Object.assign(
  {},
  mediaPickerMethods,
  mediaNavigationMethods,
  mediaGalleryMethods,
  mediaFilterMethods,
);

// ── src/card/playback/event-controller.js ──
/**
 * Event selection, playback entry/exit, clip/snapshot actions, and image retries.
 *
 * Methods are composed onto SightlineCard.prototype; method names are kept
 * stable so existing card behavior and tests remain unchanged.
 */
const eventPlaybackControllerMethods = {
_allDisplayEvents() {
    if (this._eventsMode==='all') {
      const seen=new Set(); const all=[];
      for (const c of this._config.cameras) { const cc=this._camCache[c.entity]; if(cc) for(const ev of (cc.events||[])) if(!seen.has(ev.id)){seen.add(ev.id);all.push(ev);} }
      return all.sort((a,b)=>b.start_time-a.start_time);
    }
    return this._events;
  },

async _openInGridSlot(id) {
    const ev = this._allDisplayEvents().find(e => e.id === id);
    if (!ev) return;
    const camIdx = this._config.cameras.findIndex(c => {
      const cc = this._camCache[c.entity]; return cc && cc.cam === ev.camera;
    });
    const grid = this.shadowRoot.querySelector('#cam-grid');
    const slots = grid?.querySelectorAll('.grid-slot:not(.placeholder)');
    const slot = slots?.[camIdx < 0 ? 0 : camIdx];
    if (!slot) { this._open(id); return; } // fallback to single view

    const isSnap = this._tab === 'snapshot' || (!ev.has_clip && ev.has_snapshot);
    const camName = cap((ev.camera||'').replace(/_/g,' '));
    const token = ++this._playSeq;
    slot.innerHTML = `<div class="ph skel-stream"></div><div class="grid-label">${camName}</div>`;
    if (isSnap) {
      const url = await this._resolveFrigateMedia(ev, 'snapshot');
      if (this._playSeq !== token) return;
      slot.innerHTML = `
        <img src="${url}" style="width:100%;height:100%;object-fit:contain;background:#000;display:block">
        <div class="grid-label">${camName}</div>
        <button class="grid-close-btn" data-restore-slot="${camIdx}" title="Back to live">✕</button>
        ${this._isIOSRecordingPlatform()?'':`<button class="grid-fs-btn" data-slot-fs title="Fullscreen">${ICONS.expand}</button>`}`;
    } else {
      const url = await this._resolveFrigateMedia(ev, 'clip');
      if (this._playSeq !== token) return;
      slot.innerHTML = '';
      const player = this._createHlsPlayer(url);
      player.style.cssText = 'width:100%;height:100%;display:block;background:#000';
      slot.appendChild(player);
      const label = document.createElement('div');
      label.className = 'grid-label'; label.textContent = camName;
      slot.appendChild(label);
      const close = document.createElement('button');
      close.className = 'grid-close-btn'; close.dataset.restoreSlot = String(camIdx);
      close.title = 'Back to live'; close.textContent = '✕';
      slot.appendChild(close);
      if(!this._isIOSRecordingPlatform()) {
        const fs = document.createElement('button');
        fs.className = 'grid-fs-btn'; fs.dataset.slotFs = '';
        fs.title = 'Fullscreen'; fs.innerHTML = ICONS.expand;
        slot.appendChild(fs);
      }
    }
  },

_activateTimelineEvent(id) {
    if(!id) return;
    const ev=this._timelineEvents().find(e=>String(e.id)===String(id))
      || this._allDisplayEvents().find(e=>String(e.id)===String(id));
    if(!ev) return;

    // An event click is an explicit playback command and must supersede any
    // delayed timeline-settle seek. Desktop wheel panning schedules a seek
    // after the wheel stops; if that callback survives this click it can replace
    // the event clip with the recording from the same hour a fraction of a
    // second later. Invalidate it before changing focus or starting media.
    clearTimeout(this._wt);
    this._wt=null;
    this._timelineInteracting=false;
    this._timelineWasLiveBeforeGesture=false;
    this._timelineLiveCrossed=false;
    this._scrubGestureInvalidated=false;
    ++this._timelineSeekSeq;

    const ts=Number(ev.start_time);
    if(Number.isFinite(ts)) {
      // Clicking a timeline marker/thumbnail is an explicit playback seek. Keep
      // the current zoom level, but center the selected event under the fixed
      // playhead so the timeline and video begin at the same wall-clock moment.
      const span=Math.max(300,Math.min(86400,Number(this._winEnd-this._winStart)||600));
      let ns=Math.floor(ts-span/2);
      let ne=Math.floor(ts+span/2);
      if(ns<0){ne-=ns;ns=0;}
      this._timelineFollowingLive=false;
      this._timelineInteracting=false;
      this._timelineSelected=String(ev.id);
      this._timelineFocusTs=ts;
      this._scrubTarget=ts;
      this._winStart=ns;
      this._winEnd=ne;
      this._exhausted=false;
      this._renderTimeline(true);
      this._renderRange();
      this._renderTimelineZoomLabel();
      this._scheduleTimelineDataLoad();
    }

    // Prefer the actual Frigate event clip. If this event has no retained clip,
    // fall back to continuous recording at the event's exact timestamp.
    if(ev.has_clip) return this._showClip(ev);
    if(Number.isFinite(ts)) return this._seekTimelineTarget(ts);
    return this._open(String(ev.id));
  },

_open(id) {
    const ev=this._allDisplayEvents().find(e=>e.id===id); if(!ev) return;
    if (this._tab==='snapshot'||(!ev.has_clip&&ev.has_snapshot)) this._showSnapshot(ev);
    else if (ev.has_clip) this._showClip(ev); else this._showSnapshot(ev);
  },

_enter() {
    // Do not keep decoding the live WebRTC stream underneath recording/event
    // playback. On iOS this is especially expensive: the hidden live decoder
    // can continue consuming CPU/GPU even though it is not visible.
    this._unmountEngine();
    this.shadowRoot.querySelector('#engine').style.display='none';
    const v=this.shadowRoot.querySelector('#viewer'); v.style.display='flex';
    // Keep the media navigation visible during playback. _renderStreamCtrl()
    // automatically hides the microphone while a recording/clip is playing,
    // but preserves the Live/Clips/Recordings/Reviews navigation.
    this._renderStreamCtrl();
  },

_showLive() {
    const wasPlaying=!!this._playing;
    ++this._playSeq;
    this._cancelActivePlayback();
    this._tab='live';
    this._galleryMode='';
    // Live is the timeline entry point: always restore the standard 10-minute
    // viewport instead of whatever 24-hour gallery/date range was last used.
    this._resetTimelineToNow10m();
    this._playing=null;
    this._playingHour=null;
    this._playingSourceStart=null;
    this._playingSourceEnd=null;
    this._scrubTarget=null;
    const v=this.shadowRoot.querySelector('#viewer');
    if(v){ v.innerHTML=''; v.style.display='none'; }
    const engine=this.shadowRoot.querySelector('#engine');
    if(engine) engine.style.display='block';
    const gallery=this.shadowRoot.querySelector('#media-gallery');
    if(gallery){ gallery.classList.remove('open'); gallery.innerHTML=''; }
    const timeline=this.shadowRoot.querySelector('#timeline-view');
    if(timeline) timeline.style.display='';
    this._syncResponsiveWorkspace();
    this._renderStreamCtrl();
    // If the live engine is already mounted (normal gallery -> Live or tapping
    // Live twice), keep that exact WebRTC session. Recreating it on every tap
    // causes visible reconnects and is especially fragile on iOS.
    if(!this._engine){ this._mountEngine(); }
    else if(wasPlaying){ this._engine.style.display='block'; }
  },

_handleMediaImageLoad(e) {
    const img=e?.target;
    if(!(img instanceof HTMLImageElement)||img.dataset.frigateThumb!=='1') return;
    img.style.display='block';
    img.style.visibility='visible';
    img.style.opacity='1';
    img.dataset.thumbTry='0';
    const fallback=img.parentElement?.querySelector('.thumb-fallback');
    if(fallback) fallback.style.display='none';
    img.parentElement?.classList.remove('thumb-failed');
  },

_handleMediaImageError(e) {
    const img=e?.target;
    if(!(img instanceof HTMLImageElement)||img.dataset.frigateThumb!=='1') return;
    const base=String(img.dataset.thumbSrc||'');
    const attempt=Number(img.dataset.thumbTry||0);
    if(base && attempt<2) {
      img.dataset.thumbTry=String(attempt+1);
      img.style.visibility='hidden';
      const delay=attempt===0?300:1100;
      setTimeout(()=>{
        if(!img.isConnected) return;
        const sep=base.includes('?')?'&':'?';
        img.src=`${base}${sep}_fmhc_thumb_retry=${Date.now()}`;
      },delay);
      return;
    }
    img.style.display='none';
    img.style.visibility='visible';
    const parent=img.parentElement;
    const fallback=parent?.querySelector('.thumb-fallback');
    if(fallback) fallback.style.display='flex';
    parent?.classList.add('thumb-failed');
  },

async _showClip(ev) {
    if (!ev) return;
    // Event playback owns the media pipeline. Clear any hourly-recording state
    // before mounting the clip so stale recording callbacks/segment maps cannot
    // reinterpret clip currentTime=0 as the first second of the previous hour.
    clearTimeout(this._wt);
    this._wt=null;
    this._timelineInteracting=false;
    ++this._timelineSeekSeq;
    this._cancelActivePlayback();
    this._playingHour=null;
    this._playingSourceStart=null;
    this._playingSourceEnd=null;
    this._playingRecordings=[];
    this._playingInpointOffset=0;
    // Advanced Camera Card represents Frigate event video as HLS and resolves
    // the media-source content ID through Home Assistant. Use the same route
    // here so iOS does not depend on the progressive /clip.mp4 proxy.
    this._enter();
    this._playing={id:ev.id};
    this._renderStreamCtrl();
    const viewer=this.shadowRoot.querySelector('#viewer');
    viewer.innerHTML='<div class="ld">Loading…</div>';
    const token=++this._playSeq;
    try {
      const url=await this._resolveFrigateMedia(ev,'clip');
      if(this._playSeq!==token) return;
      viewer.innerHTML='';
      const player=this._createHlsPlayer(url,{autoplay:true});
      player.style.cssText='width:100%;height:100%;display:block;background:#000';
      viewer.appendChild(player);
      this._attachTimelineMediaClock(player, Number(ev.start_time)||this._timelineFocusTs||Math.floor(Date.now()/1000), token);
    } catch(err) {
      console.warn('[Frigate] event playback failed',err);
      if(this._playSeq===token) viewer.innerHTML='<div class="ld">Unable to play recording</div>';
    }
  },

async _showClipById(id) {
    if(!id) return;
    const ev=this._allDisplayEvents().find(e=>e.id===id);
    if(ev) return this._showClip(ev);
    // Same isolation as _showClip(), including the review-browser path where
    // only an event id is available.
    clearTimeout(this._wt);
    this._wt=null;
    this._timelineInteracting=false;
    ++this._timelineSeekSeq;
    this._cancelActivePlayback();
    this._playingHour=null;
    this._playingSourceStart=null;
    this._playingSourceEnd=null;
    this._playingRecordings=[];
    this._playingInpointOffset=0;
    this._enter();
    this._playing={id};
    this._renderStreamCtrl();
    const viewer=this.shadowRoot.querySelector('#viewer');
    viewer.innerHTML='<div class="ld">Loading…</div>';
    const token=++this._playSeq;
    try {
      const url=await this._resolveFrigateEventMediaId(id,'clips');
      if(this._playSeq!==token) return;
      viewer.innerHTML='';
      const player=this._createHlsPlayer(url,{autoplay:true});
      player.style.cssText='width:100%;height:100%;display:block;background:#000';
      viewer.appendChild(player);
      const eventStart=Number(this._allDisplayEvents().find(e=>e.id===id)?.start_time);
      this._attachTimelineMediaClock(player, Number.isFinite(eventStart)?eventStart:(this._timelineFocusTs||Math.floor(Date.now()/1000)), token);
    } catch(err) {
      console.warn('[Frigate] event-id playback failed',err);
      if(this._playSeq===token) viewer.innerHTML='<div class="ld">Unable to play recording</div>';
    }
  },

async _showSnapshot(ev) {
    this._enter(); this._playing={id:ev.id};
    const v=this.shadowRoot.querySelector('#viewer');
    v.innerHTML='<div class="ld">Loading…</div>';
    const token = ++this._playSeq;
    const url = await this._resolveFrigateMedia(ev, 'snapshot');
    if (this._playSeq !== token) return;
    v.innerHTML=`<img class="snap" src="${url}">`;
  }
};

// ── src/card/playback/media-source.js ──
/**
 * Frigate/Home Assistant media URL resolution and recorded-media element creation.
 *
 * Methods are composed onto SightlineCard.prototype; method names are kept
 * stable so existing card behavior and tests remain unchanged.
 */
const mediaSourceMethods = {
_mediaForEvent(ev,file,dl=false) {
    const id=String(ev?.id??ev?.event_id??'');
    const camera=String(ev?.camera||'');
    let clientId=this._cc().clientId;
    if(camera) {
      const owner=this._config?.cameras?.map(c=>this._camCache[c.entity]).find(cc=>cc&&String(cc.cam)===camera);
      if(owner?.clientId) clientId=owner.clientId;
    }
    return `/api/frigate/${encodeURIComponent(String(clientId))}/notifications/${encodeURIComponent(id)}/${file}${dl?'?download=true':''}`;
  },

_media(id,file,dl) { return `/api/frigate/${encodeURIComponent(String(this._cc().clientId))}/notifications/${encodeURIComponent(String(id))}/${file}${dl?'?download=true':''}`; },

async _mediaSigned(id,file,dl) { return this._signed(this._media(id,file,dl)); },

async _resolveFrigatePlaybackUrl(ev) {
    const {clientId,cam}=this._cc();
    const camera=encodeURIComponent(ev.camera || cam);
    const start=Number(ev.start_time);
    const end=Math.max(start+1,Number(ev.end_time || (start+Math.max(1,Number(ev.duration||30)))));
    if(!clientId || !camera || !Number.isFinite(start)) {
      return this._resolveFrigateMedia(ev,'clip');
    }

    // Use Frigate's authenticated VOD proxy directly. This path works even
    // when the live camera is offline because it reads retained recordings.
    // Safari is explicitly documented by Frigate to prefer HLS over clip.mp4.
    const vod=`/api/frigate/${encodeURIComponent(String(clientId))}/vod/${camera}/start/${Math.floor(start)}/end/${Math.ceil(end)}/master.m3u8`;
    try {
      const signed=await this._signed(vod);
      return signed || vod;
    } catch (_) {
      return vod;
    }
  },

_createRecordedVideo(url) {
    const v=document.createElement('video');
    v.className='recorded-video';
    v.controls=true;
    v.playsInline=true;
    v.preload='auto';
    v.muted=true;
    v.autoplay=true;
    v.setAttribute('controls','');
    v.setAttribute('playsinline','');
    v.setAttribute('webkit-playsinline','');

    const tryPlay=()=>{
      this._clearStatusOverlay();
      v.play().catch(()=>{ /* muted autoplay may still require a tap in some webviews */ });
    };
    v.addEventListener('loadedmetadata',tryPlay,{once:true});
    v.addEventListener('canplay',tryPlay,{once:true});
    v.addEventListener('playing',()=>this._clearStatusOverlay(),{once:true});
    v.addEventListener('error',()=>{
      console.warn('[Frigate] recorded video error',v.error?.code,v.error?.message||'',url);
      const viewer=this.shadowRoot.querySelector('#viewer');
      if(viewer && !viewer.querySelector('.recorded-video-error')) {
        const msg=document.createElement('div');
        msg.className='ld recorded-video-error';
        msg.textContent='Unable to play recording';
        viewer.appendChild(msg);
      }
    },{once:true});
    v.src=url;
    return v;
  },

async _resolveFrigateEventMediaId(id, type) {
    const {clientId,cam}=this._cc();
    const mediaContentId = `media-source://frigate/${clientId}/event/${type}/${cam}/${id}`;
    const resolved = await this._resolveMediaContentId(mediaContentId);
    if (resolved) return resolved;
    // Compatibility fallback for older HA/Frigate media-source providers.
    return this._mediaSigned(id, type === 'clips' ? 'clip.mp4' : 'snapshot.jpg');
  },

async _resolveFrigateMedia(ev, type) {
    return this._resolveFrigateEventMediaId(ev.id, type === 'clip' ? 'clips' : 'snapshots');
  },

async _resolveMediaContentId(mediaContentId) {
    try {
      const r = await this._hass.callWS({
        type:'media_source/resolve_media',
        media_content_id:mediaContentId
      });
      const url = r?.url;
      if (!url) throw new Error('Home Assistant returned no media URL');
      // Frigate's HA media source currently resolves to the integration's own
      // /api/frigate/<instance>/... proxy. Refuse any future/provider response
      // that points the browser at a Frigate host directly.
      const parsed = new URL(String(url), location.origin);
      if (!parsed.pathname.startsWith('/api/frigate/')) {
        throw new Error(`Refusing non-Home-Assistant Frigate media URL: ${parsed.pathname}`);
      }
      return this._hass?.hassUrl ? this._hass.hassUrl(url) : url;
    } catch (e) {
      console.warn('[Frigate] media-source resolve failed', e);
      // The caller may fall back to another Home Assistant Frigate proxy route.
      return null;
    }
  },

_absoluteHaMediaUrl(url) {
    if (!url) return url;
    const raw=String(url);
    // HA's <ha-hls-player> resolves child playlists with
    // `new URL(child, this._url)`, so its base URL MUST be absolute. auth/sign_path
    // intentionally returns a relative HA path; turn that path into a fully
    // qualified HA URL without losing its authSig query parameter.
    try {
      const parsed=new URL(raw);
      if (parsed.protocol==='http:' || parsed.protocol==='https:') return parsed.href;
    } catch(_) {}
    try {
      if (this._hass?.hassUrl) return this._hass.hassUrl(raw);
    } catch(_) {}
    try { return new URL(raw, window.location.href).href; } catch(_) { return raw; }
  },

_createHlsPlayer(url, options={}) {
    if (!url && options.requireUrl !== false) {
      const el = document.createElement('div');
      el.className = 'ld'; el.textContent = 'Unable to resolve recording';
      return el;
    }
    const player = document.createElement('ha-hls-player');
    player.hass = this._hass;
    player.controls = options.controls !== false;
    player.muted = options.muted !== false;
    // Home Assistant's property is `autoPlay` (capital P), not `autoplay`.
    player.autoPlay = options.autoplay !== false;
    player.playsInline = true;
    if (player.controls) player.setAttribute('controls','');
    player.setAttribute('playsinline','');
    player.setAttribute('allow-exoplayer','');
    if (url) player.url = this._absoluteHaMediaUrl(url);
    return player;
  }
};

// ── src/card/playback/time.js ──
/**
 * Home Assistant-aware time formatting and recording coverage helpers.
 *
 * Methods are composed onto SightlineCard.prototype; method names are kept
 * stable so existing card behavior and tests remain unchanged.
 */
const playbackTimeMethods = {
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

// ── src/card/event-playback.js ──
/**
 * Public method-group barrel for eventPlaybackMethods.
 *
 * Keeping this entry point stable avoids coupling callers to the internal
 * feature layout while allowing each concern to live in a focused module.
 */
const eventPlaybackMethods = Object.assign(
  {},
  eventPlaybackControllerMethods,
  mediaSourceMethods,
  playbackTimeMethods,
);

// ── src/card/playback/recording-time.js ──
/**
 * Frigate recording segment math, inpoint offsets, and seek/progress calculations.
 *
 * Methods are composed onto SightlineCard.prototype; method names are kept
 * stable so existing card behavior and tests remain unchanged.
 */
const recordingTimeMethods = {
_frigateSegmentDuration(seg) {
    const d=Number(seg?.duration);
    if (Number.isFinite(d) && d >= 0) return d;
    const a=Number(seg?.start_time), b=Number(seg?.end_time);
    return Number.isFinite(a)&&Number.isFinite(b) ? Math.max(0,b-a) : 0;
  },

_frigateInpointOffset(sourceStart, firstRecording) {
    const start = Number(sourceStart);
    if (!Number.isFinite(start) || !firstRecording) return 0;
    const fs = Number(firstRecording.start_time), fe = Number(firstRecording.end_time);
    if (!Number.isFinite(fs) || !Number.isFinite(fe)) return 0;
    if (fs < start && fe > start) return start - fs;
    return 0;
  },

_frigateSeekPosition(timestamp, recordings, inpointOffset=0) {
    if (!Array.isArray(recordings) || !recordings.length) return undefined;
    const sorted=[...recordings]
      .filter(r=>Number.isFinite(Number(r?.start_time)))
      .sort((a,b)=>Number(a.start_time)-Number(b.start_time));
    if (!sorted.length) return undefined;

    const first=Number(sorted[0].start_time);
    const last=Number(sorted[sorted.length-1].end_time);
    if (!Number.isFinite(first) || !Number.isFinite(last) ||
        timestamp < first || timestamp > last) return undefined;

    // Frigate's calculateSeekPosition() uses wall-clock segment length
    // (end_time - start_time) for seeking. `segment.duration` is used by
    // DynamicVideoController.getProgress(), but not by calculateSeekPosition().
    // Keeping these two calculations distinct is important: substituting
    // `duration` here can shift the seek target toward the start of the hour.
    let seek=0;
    for (const seg of sorted) {
      const a=Number(seg.start_time), b=Number(seg.end_time);
      const wallDuration=(Number.isFinite(a)&&Number.isFinite(b)) ? Math.max(0,b-a) : 0;
      if (!Number.isFinite(a) || !Number.isFinite(b) || wallDuration <= 0) continue;
      if (a > timestamp) break;
      if (b < timestamp) {
        seek += wallDuration;
        continue;
      }
      seek += Math.max(0, timestamp-a);
      // calculateSeekPosition() in Frigate subtracts the HLS inpoint offset
      // as its very last step — do the same here, after the within-segment
      // offset has been added, not before.
      const adjusted = seek - (Number(inpointOffset)||0);
      return adjusted >= 0 ? adjusted : undefined;
    }
    return undefined;
  },

_frigateProgress(playerTime, recordings, inpointOffset=0) {
    if (!Array.isArray(recordings) || !recordings.length || !Number.isFinite(Number(playerTime))) return undefined;
    const sorted=[...recordings]
      .filter(r=>Number.isFinite(Number(r?.start_time)))
      .sort((a,b)=>Number(a.start_time)-Number(b.start_time));
    // The inverse of _frigateSeekPosition's final subtraction: Frigate's own
    // HlsVideoPlayer.getVideoTime() computes `video.currentTime + inpointOffset`
    // before ever handing the number to getProgress()'s raw accumulation. Do
    // the same here so seeking and progress-reporting stay perfectly
    // symmetric — otherwise the playhead reports a timestamp a few seconds
    // earlier than what's actually on screen for the whole first hour.
    const raw = Math.max(0, Number(playerTime)) + (Number(inpointOffset)||0);
    let total=0;
    for (const seg of sorted) {
      const a=Number(seg.start_time);
      const duration=this._frigateSegmentDuration(seg);
      if (!Number.isFinite(a) || duration <= 0) continue;
      if (total + duration > raw) return a + (raw-total);
      total += duration;
    }
    const last=sorted[sorted.length-1];
    return Number(last?.end_time);
  },

_isIOSRecordingPlatform() {
    const ua=navigator.userAgent||'';
    return /iPad|iPhone|iPod/.test(ua) || (navigator.platform==='MacIntel' && navigator.maxTouchPoints>1);
  },

_iosRecordingWindow(target) {
    // Native HLS on iOS is reliable once the source is small, but seeking deep
    // into a full one-hour playlist can take several seconds while WebKit walks
    // the playlist/segment index. Keep iOS playback in deterministic 5-minute
    // VOD windows so the maximum seek offset is < 300s. Desktop continues using
    // the full hour with hls.js, which is efficient at long-range seeks.
    const bucket=5*60;
    const t=Math.max(0,Math.floor(Number(target)||0));
    const start=Math.floor(t/bucket)*bucket;
    const now=Math.floor(Date.now()/1000);
    const end=Math.max(start+1,Math.min(start+bucket,now));
    return {start,end};
  }
};

// ── src/card/playback/recording-shell.js ──
/**
 * Recorded-video shell state, stable media binding, video lookup, and fullscreen behavior.
 *
 * Methods are composed onto SightlineCard.prototype; method names are kept
 * stable so existing card behavior and tests remain unchanged.
 */
const recordingShellMethods = {
_cancelActivePlayback(keepSession=false) {
    if (typeof this._activePlaybackCleanup === 'function') {
      try { this._activePlaybackCleanup(); } catch (_) {}
    }
    this._activePlaybackCleanup = null;
    if (!keepSession) {
      const session=this._playbackSession;
      this._playbackSession=null;
      if (session) {
        try { session.video?.pause(); } catch (_) {}
        try { session.player?.remove(); } catch (_) {}
      }
    }
  },

_ensurePlaybackShell() {
    const viewer=this.shadowRoot.querySelector('#viewer');
    if (!viewer) return null;
    viewer.style.display='flex';
    let holder=viewer.querySelector('.rec-player');
    if (!holder) {
      viewer.innerHTML='';
      holder=document.createElement('div');
      holder.className='rec-player';
      holder.innerHTML='<div class="playback-loading"><span class="spinner"></span><span>Loading recording…</span></div>';
      viewer.appendChild(holder);
    }
    return holder;
  },

_setPlaybackLoading(show, text='Loading recording…') {
    const holder=this.shadowRoot.querySelector('#viewer .rec-player');
    if (!holder) return;
    let el=holder.querySelector('.playback-loading');
    if (show) {
      if (!el) { el=document.createElement('div'); el.className='playback-loading'; holder.appendChild(el); }
      el.innerHTML=`<span class="spinner"></span><span>${text}</span>`;
      el.style.display='flex';
    } else if (el) {
      el.style.display='none';
    }
  },

_bindStableRecordingVideo(video, session) {
    if (!video || session.video===video && session.bound) return;
    session.video=video;
    session.bound=true;
    video.controls=true;
    video.playsInline=true;
    video.preload='auto';
    video.muted=true;
    video.setAttribute('controls','');
    video.setAttribute('playsinline','');
    video.setAttribute('webkit-playsinline','');

    const playAfterSeek=async()=>{
      if (session.token!==this._playSeq || this._playbackSession!==session) return;
      this._setPlaybackLoading(false);
      this._playing={rec:session.targetTs};
      this._scrubTarget=session.targetTs;
      try {
        await video.play();
      } catch(err) {
        // Native controls remain available if iOS consumes the original gesture
        // while the HLS seek is being prepared.
        console.debug('[Frigate] recording play deferred',err?.name||err||'');
      }
    };

    const applyPendingSeek=()=>{
      if (session.token!==this._playSeq || this._playbackSession!==session) return;
      if (session.seekInFlight) return;
      if (!Number.isFinite(video.duration) || video.duration<=0) return;
      // `null` means there is no pending seek. Number(null) is 0 in
      // JavaScript, so converting first caused later canplay/durationchange
      // callbacks to issue an accidental seek back to media time 0 — exactly
      // the first second of each hourly VOD source on desktop.
      if (session.pendingSeek == null) return;
      const target=Number(session.pendingSeek);
      if (!Number.isFinite(target)) return;
      const clamped=Math.max(0,Math.min(target,Math.max(0,video.duration-0.05)));
      const current=Number(video.currentTime);

      // Match Frigate's controller for *every* seek, not just the initial load:
      // assign currentTime, wait for `seeked`, then play. An earlier implementation accidentally
      // bypassed this path for same-hour timeline scrubs and called play()
      // immediately, which can strand Safari/WKWebView in a buffering state.
      if (Number.isFinite(current) && Math.abs(current-clamped)<0.35) {
        session.pendingSeek=null;
        session.lastMediaTime=clamped;
        playAfterSeek();
        return;
      }

      // Pausing native iOS HLS before a discontinuous seek prevents WebKit from
      // trying to continue decoding the old position while the new byte range is
      // being resolved. The video remains mounted, so there is no visual pop.
      if (session.preferNativeIOS) {
        try { video.pause(); } catch(_) {}
      }

      session.seekInFlight=true;
      const requested=clamped;
      const onSeeked=()=>{
        if (session.token!==this._playSeq || this._playbackSession!==session) return;
        clearTimeout(session.seekTimer);
        session.seekTimer=null;
        session.seekInFlight=false;
        session.lastMediaTime=Number(video.currentTime);

        // A newer scrub can arrive while Safari is completing this seek. Never
        // play the stale position: immediately apply the newest pending target.
        const latest=session.pendingSeek == null ? NaN : Number(session.pendingSeek);
        if (Number.isFinite(latest) && Math.abs(latest-requested)>0.35) {
          applyPendingSeek();
          return;
        }
        session.pendingSeek=null;
        playAfterSeek();
      };
      video.addEventListener('seeked',onSeeked,{once:true});
      try {
        video.currentTime=clamped;
      } catch(_) {
        session.seekInFlight=false;
        try { video.removeEventListener('seeked',onSeeked); } catch(_) {}
        return;
      }

      // WebKit occasionally omits `seeked` for native HLS even after currentTime
      // has moved. Recover without reloading the source or jumping to the hour.
      clearTimeout(session.seekTimer);
      session.seekTimer=setTimeout(()=>{
        if (session.token!==this._playSeq || this._playbackSession!==session || !session.seekInFlight) return;
        try { video.removeEventListener('seeked',onSeeked); } catch(_) {}
        session.seekInFlight=false;
        const actual=Number(video.currentTime);
        if (Number.isFinite(actual) && Math.abs(actual-requested)<0.75 && video.readyState>=2) {
          session.pendingSeek=null;
          session.lastMediaTime=actual;
          playAfterSeek();
          return;
        }
        // Keep the requested target and retry when Safari reports more media.
        const retry=()=>{
          video.removeEventListener('canplay',retry);
          video.removeEventListener('progress',retry);
          applyPendingSeek();
        };
        video.addEventListener('canplay',retry,{once:true});
        video.addEventListener('progress',retry,{once:true});
      },1500);
    };

    session.requestSeek=(mediaTime,targetTs)=>{
      if (session.token!==this._playSeq || this._playbackSession!==session) return false;
      if (!Number.isFinite(Number(mediaTime))) return false;
      session.targetTs=Math.floor(Number(targetTs));
      session.pendingSeek=Math.max(0,Number(mediaTime));
      this._playing={rec:session.targetTs};
      this._scrubTarget=session.targetTs;
      applyPendingSeek();
      return true;
    };

    const sync=()=>{
      if (session.token!==this._playSeq || this._playbackSession!==session) return;
      // Desktop hls.js briefly exposes currentTime=0 when a new hour source is
      // attached. Do not let that transient decoder position become the
      // timeline's authoritative timestamp while the requested seek is still
      // pending/in flight; doing so visibly snapped the playhead/window to the
      // first second of every hour. Manual timeline movement also owns the
      // playhead until the gesture settles.
      if (this._timelineInteracting || session.seekInFlight ||
          (session.pendingSeek != null && Number.isFinite(Number(session.pendingSeek)))) return;
      const rel=Number(video.currentTime);
      if (!Number.isFinite(rel) || rel<0) return;
      const abs=this._frigateProgress(rel,session.recordings,session.inpointOffset);
      if (!Number.isFinite(abs)) return;
      session.lastAbsolute=abs;
      this._scrubTarget=abs;
      this._playing={rec:abs};
      this._updateTimelinePlaybackTime(abs);
    };
    const ready=()=>{
      this._clearStatusOverlay();
      applyPendingSeek();
      // Do not hide the loader merely because metadata exists. Keep it visible
      // until the exact seek has settled or playback actually begins.
      if ((session.pendingSeek == null || !Number.isFinite(Number(session.pendingSeek))) && !session.seekInFlight && video.readyState>=2) {
        this._setPlaybackLoading(false);
      }
    };
    const onError=()=>{
      if (session.token!==this._playSeq || this._playbackSession!==session) return;
      console.warn('[Frigate] stable recording player error',video.error?.code,video.error?.message||'');
      this._setPlaybackLoading(true,'Unable to play recording');
    };
    ['loadedmetadata','durationchange','canplay'].forEach(ev=>video.addEventListener(ev,ready));
    ['timeupdate','playing','seeked'].forEach(ev=>video.addEventListener(ev,sync));
    video.addEventListener('waiting',()=>{ if(!video.paused)this._setPlaybackLoading(true,'Buffering…'); });
    video.addEventListener('playing',()=>{
      this._setPlaybackLoading(false);
    });
    video.addEventListener('ended',()=>{
      if(session.token!==this._playSeq || this._playbackSession!==session) return;
      if (session.iosWindowed) {
        const next=Math.floor(Number(session.sourceEnd));
        if (Number.isFinite(next) && next < Math.floor(Date.now()/1000)-1) {
          this._showRecording(next,next+5*60,next);
        }
        return;
      }
      this._continueRecording(session.sourceEnd,session.token);
    });
    video.addEventListener('error',onError);
    session.cleanup=()=>{
      clearTimeout(session.seekTimer);
      session.seekTimer=null;
      try { video.pause(); } catch(_) {}
      try { video.removeAttribute('src'); video.srcObject=null; video.load(); } catch(_) {}
    };
    this._activePlaybackCleanup=session.cleanup;
  },

_findVideo(node, depth, crossedShadow) {
    if (!node || (depth||0) > 6) return null;
    if (node.tagName === 'VIDEO') { node._viaShadow = !!crossedShadow; return node; }
    if (node.shadowRoot) {
      const v = node.shadowRoot.querySelector('video');
      if (v) { v._viaShadow = true; return v; }
      for (const child of node.shadowRoot.children) { const f = this._findVideo(child, (depth||0)+1, true); if (f) return f; }
    }
    const children = node.children || [];
    for (const child of children) { const f = this._findVideo(child, (depth||0)+1, crossedShadow); if (f) return f; }
    return null;
  },

_fullscreen(el) {
    if (!el) return;
    // Live WebRTC must stay in the exact same DOM node. Never invoke
    // webkitEnterFullscreen() on its nested video and never mutate srcObject.
    // The wrapper/fullscreen element preserves the stream session.
    const liveWrap = el.id === 'eng-wrap' || !!el.closest?.('#eng-wrap');
    if (liveWrap) {
      // Never hand a live MediaStream video to iOS's native fullscreen
      // compositor. Keep the exact same player/peer inline and fullscreen only
      // the wrapper. This avoids the WebKit state where video rendering freezes
      // while the stream's audio track continues normally.
      if(this._isIOSRecordingPlatform()) {
        el.classList.add('live-pseudo-fullscreen');
        this._livePseudoFullscreen=true;
        this._removeLiveFsMirror();
        this._addLiveFsExit(el);
        const v=this._go2rtcLive?.video || this._findVideo(this._engine);
        try { v?.setAttribute?.('controlslist','nofullscreen'); const p=v?.play?.(); if(p?.catch)p.catch(()=>{}); } catch(_) {}
        return;
      }
      const req = el.requestFullscreen || el.webkitRequestFullscreen;
      if (req) { try { const p=req.call(el); if(p?.catch) p.catch(()=>{}); return; } catch(_) {} }
      el.classList.add('live-pseudo-fullscreen');
      this._livePseudoFullscreen = true;
      this._addLiveFsExit(el);
      return;
    }
    const vid = el.tagName === 'VIDEO' ? el : this._findVideo(el);
    const isLivePlayerVideo = vid && vid._viaShadow;
    if (vid) delete vid._viaShadow;
    if (vid && !isLivePlayerVideo && typeof vid.webkitEnterFullscreen === 'function' && vid.webkitSupportsFullscreen !== false) {
      try { vid.webkitEnterFullscreen(); return; } catch (_) { /* fall through */ }
    }
    const req = el.requestFullscreen || el.webkitRequestFullscreen;
    if (req) { const p=req.call(el); if (p?.catch) p.catch(()=>{}); return; }
    if (vid) { const req2=vid.requestFullscreen || vid.webkitRequestFullscreen; if(req2) req2.call(vid); }
  }
};

// ── src/card/playback/recording-source.js ──
/**
 * Recording media-source identifiers, Home Assistant resolution, and signed VOD playlists.
 *
 * Methods are composed onto SightlineCard.prototype; method names are kept
 * stable so existing card behavior and tests remain unchanged.
 */
const recordingSourceMethods = {
_frigateRecordingMediaSourceId(clientId, cam, sourceStart) {
    try {
      const tz=this._hass?.config?.time_zone || Intl.DateTimeFormat().resolvedOptions().timeZone;
      const parts=new Intl.DateTimeFormat('en-CA',{
        timeZone:tz,
        year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',hourCycle:'h23'
      }).formatToParts(new Date(Number(sourceStart)*1000));
      const get=t=>parts.find(p=>p.type===t)?.value;
      const y=get('year'),m=get('month'),d=get('day'),h=get('hour');
      if(!y||!m||!d||h==null) return null;
      return `media-source://frigate/${clientId}/recordings/${cam}/${y}-${m}-${d}/${h}`;
    } catch(_) { return null; }
  },

async _resolveFrigateRecordingHourMedia(clientId, cam, sourceStart) {
    const id=this._frigateRecordingMediaSourceId(clientId,cam,sourceStart);
    if(!id) return null;
    try {
      const url=await this._resolveMediaContentId(id);
      return url ? this._absoluteHaMediaUrl(url) : null;
    } catch(err) {
      console.warn('[Frigate] recording media-source resolve failed',err);
      return null;
    }
  },

async _signed(path) { try { const r=await this._hass.callWS({type:'auth/sign_path',path,expires:3600}); return r?.path||path; } catch(_) { return path; } },

async _resolveSignedVodPlaylist(masterPath) {
    // Home Assistant signed paths authenticate the exact manifest URL. Frigate's
    // master playlist points at a second manifest (for example index-v1-a1.m3u8).
    // Reusing the master.m3u8 authSig on that child manifest yields HTTP 401.
    // Resolve the master ourselves, then sign the exact child manifest path that
    // ha-hls-player/hls.js will load. The child manifest propagates that query
    // string to its media segments; HA's VOD segment proxy validates the signed
    // directory prefix for .m4s/.mp4/.ts requests.
    const signedMaster=await this._signed(masterPath);
    const masterUrl=this._absoluteHaMediaUrl(signedMaster);
    try {
      const resp=await fetch(masterUrl,{credentials:'same-origin',cache:'no-store'});
      if(!resp.ok) throw new Error(`master manifest ${resp.status}`);
      const text=await resp.text();
      const lines=text.split(/\r?\n/).map(x=>x.trim()).filter(Boolean);
      let childLine='';
      for(let i=0;i<lines.length;i++) {
        if(lines[i].startsWith('#EXT-X-STREAM-INF')) {
          for(let j=i+1;j<lines.length;j++) {
            if(!lines[j].startsWith('#')) { childLine=lines[j]; break; }
          }
          if(childLine) break;
        }
      }
      // Some Frigate/nginx-vod responses may contain a direct media playlist.
      // In that case the signed master itself is already the final HLS source.
      if(!childLine) return masterUrl;
      const childUrl=new URL(childLine,masterUrl);
      const signedChild=await this._signed(childUrl.pathname);
      return this._absoluteHaMediaUrl(signedChild);
    } catch(err) {
      console.warn('[Frigate] unable to resolve/sign VOD child manifest',err);
      return masterUrl;
    }
  }
};

// ── src/card/playback/recording-player.js ──
/**
 * HLS/MP4 attachment and continuous recording playback control.
 *
 * Methods are composed onto SightlineCard.prototype; method names are kept
 * stable so existing card behavior and tests remain unchanged.
 */
const recordingPlayerMethods = {
_attachStableHlsPlayer(session, url) {
    const holder=session.holder;
    // `auth/sign_path` returns a relative path. HA's HLS component requires an
    // absolute base URL because it uses new URL(relativePlaylist, this._url).
    // Normalize once here and use the same absolute URL for HA and native fallback.
    url=this._absoluteHaMediaUrl(url);
    holder.querySelectorAll('video,ha-hls-player,.stable-hls-player').forEach(el=>{ try{el.remove();}catch(_){} });

    // The Home Assistant iOS app/WKWebView can expose native HLS but not a fully
    // usable ManagedMediaSource implementation for hls.js. In that environment
    // <ha-hls-player> may create a video element that accepts play() yet never
    // exits buffering. For iOS we therefore use the Frigate integration's own
    // resolved recording media-source playlist with Safari's native HLS engine,
    // while retaining our exact segment->timestamp seek mapping.
    if (session.preferNativeIOS) {
      const native=document.createElement('video');
      native.className='recording-video stable-recording-video ios-native-hls';
      native.style.cssText='position:absolute;inset:0;width:100%;height:100%;display:block;background:#000;object-fit:contain';
      native.controls=true; native.playsInline=true; native.muted=true; native.preload='auto';
      native.setAttribute('controls',''); native.setAttribute('playsinline',''); native.setAttribute('webkit-playsinline','');
      holder.insertBefore(native,holder.firstChild);
      session.player=native;
      this._bindStableRecordingVideo(native,session);
      native.src=url;
      try { native.load(); } catch(_) {}
      return;
    }

    // Create HA's HLS element without a URL first. This lets us intercept the
    // hls.js instance at the instant Home Assistant constructs it and seed the
    // exact Frigate startPosition *before* media attachment / fragment loading.
    // Frigate's own HlsVideoPlayer does the same via new Hls({startPosition}).
    const player=this._createHlsPlayer(null,{autoplay:true,requireUrl:false});
    player.className=(player.className||'')+' stable-hls-player';
    player.style.cssText='position:absolute;inset:0;width:100%;height:100%;display:block;background:#000';
    holder.insertBefore(player,holder.firstChild);
    session.player=player;

    const initialStart=Number(session.pendingSeek);
    try {
      let hlsInstance;
      Object.defineProperty(player,'_hlsPolyfillInstance',{
        configurable:true,
        enumerable:false,
        get(){ return hlsInstance; },
        set(instance){
          hlsInstance=instance;
          if (instance && Number.isFinite(initialStart)) {
            try { instance.config.startPosition=Math.max(0,initialStart); } catch(_) {}
          }
        }
      });
    } catch(_) {
      // HA internals may change; the normal video currentTime fallback below
      // still seeks once metadata is available.
    }

    let tries=0;
    const attach=()=>{
      if(session.token!==this._playSeq || this._playbackSession!==session) return;
      const video=this._findVideo(player);
      if(video) { this._bindStableRecordingVideo(video,session); return; }
      if(++tries<160) { session.attachTimer=setTimeout(attach,50); return; }

      // On older Safari/iOS where hls.js/MSE is unavailable, HA may fall back
      // to native HLS. Use the same signed VOD URL and retain the exact seek.
      try { player.remove(); } catch(_) {}
      const native=document.createElement('video');
      native.className='recording-video';
      native.style.cssText='position:absolute;inset:0;width:100%;height:100%;display:block;background:#000;object-fit:contain';
      native.controls=true; native.playsInline=true; native.muted=true; native.preload='auto';
      native.setAttribute('controls',''); native.setAttribute('playsinline',''); native.setAttribute('webkit-playsinline','');
      holder.insertBefore(native,holder.firstChild);
      session.player=native;
      this._bindStableRecordingVideo(native,session);
      native.src=url;
      try { native.load(); } catch(_) {}
    };
    attach();

    // Trigger HA's HLS setup only after the startPosition interception exists.
    player.url=url;
  },

_attachStableMp4Player(session, url) {
    const holder=session.holder;
    // Remove any stale media nodes but preserve the loading overlay.
    holder.querySelectorAll('video,ha-hls-player,.stable-hls-player').forEach(el=>{ try{el.remove();}catch(_){} });
    const video=document.createElement('video');
    video.className='recording-video stable-recording-video';
    video.style.cssText='position:absolute;inset:0;width:100%;height:100%;display:block;background:#000;object-fit:contain';
    video.playsInline=true; video.muted=true; video.preload='auto';
    video.setAttribute('controls','');
    video.setAttribute('playsinline','');
    video.setAttribute('webkit-playsinline','');
    holder.insertBefore(video,holder.firstChild);
    session.player=video;
    this._bindStableRecordingVideo(video,session);
    video.src=url;
    try { video.load(); } catch(_) {}
  },

async _showRecording(s, e, seekFrom, sourceRange=null) {
    const target=Number.isFinite(Number(seekFrom)) ? Math.floor(Number(seekFrom)) : Math.floor(Number(s));
    if (!Number.isFinite(target)) return;
    const hour=this._hourStart(target);
    const sourceStart=hour;
    const sourceEnd=hour+3600;
    const isIOS=this._isIOSRecordingPlatform();
    const current=this._playbackSession;

    // Desktop keeps the stable hls.js session introduced in the newer builds.
    // iOS deliberately does not use this session: the older v52 card used the
    // Frigate recording MP4 proxy and Safari's native byte-range seeking, which
    // is substantially faster than walking an HLS hour playlist on WKWebView.
    if (!isIOS && current && target>=current.sourceStart && target<current.sourceEnd && current.token===this._playSeq) {
      const offset=this._frigateSeekPosition(target,current.recordings,current.inpointOffset);
      if (Number.isFinite(offset)) {
        current.targetTs=target;
        current.pendingSeek=offset;
        this._playing={rec:target};
        this._scrubTarget=target;
        if (typeof current.requestSeek==='function') current.requestSeek(offset,target);
        return;
      }
    }

    this._cancelActivePlayback();
    const token=++this._playSeq;
    const playbackSeq=++this._playbackLoadSeq;
    this._enter();
    this._playing={rec:target};
    this._scrubTarget=target;
    this._playingHour=hour;
    this._renderStreamCtrl();

    const {clientId,cam}=this._cc();
    if(!clientId||!cam) return;
    let recordings=[];
    try {
      const rows=await this._ws({type:'frigate/recordings/get',instance_id:clientId,camera:cam,after:sourceStart,before:sourceEnd});
      recordings=(Array.isArray(rows)?rows:[])
        .filter(r=>Number(r.start_time)<sourceEnd&&Number(r.end_time)>sourceStart)
        .sort((a,b)=>Number(a.start_time)-Number(b.start_time));
    } catch(_) {
      recordings=(this._recordings||[])
        .filter(r=>Number(r.start_time)<sourceEnd&&Number(r.end_time)>sourceStart)
        .sort((a,b)=>Number(a.start_time)-Number(b.start_time));
    }
    if(token!==this._playSeq || playbackSeq!==this._playbackLoadSeq) return;

    const inpointOffset=this._frigateInpointOffset(sourceStart,recordings[0]);
    const offset=this._frigateSeekPosition(target,recordings,inpointOffset);
    const hasRecording=recordings.some(r=>Number(r.start_time)<=target&&Number(r.end_time)>=target);
    if(!hasRecording || !Number.isFinite(offset)) {
      this._playingRecordings=recordings;
      this._playingInpointOffset=inpointOffset;
      this._playingSourceStart=sourceStart;
      this._playingSourceEnd=sourceEnd;
      this._setStatusOverlay('offline','No recording at this time','Frigate has no retained recording covering this timeline position.',{retry:false});
      return;
    }

    this._playingRecordings=recordings;
    this._playingInpointOffset=inpointOffset;
    this._playingSourceStart=sourceStart;
    this._playingSourceEnd=sourceEnd;

    if (isIOS) {
      // iOS playback mirrors the older v52 card exactly: try Home Assistant's
      // signed Frigate MP4 recording proxy first, but DO NOT leave Safari stuck
      // on its native "cannot play" glyph if that particular hour/codec is not
      // accepted. The fallback remains Home Assistant's signed Frigate-integration
      // VOD proxy (index.m3u8) through HA's HLS player.
      const viewer=this.shadowRoot.querySelector('#viewer');
      if(!viewer) return;
      viewer.innerHTML='<div class="ld">Loading recording…</div>';

      const recordingPath=`/api/frigate/${encodeURIComponent(String(clientId))}/recording/${encodeURIComponent(String(cam))}/start/${sourceStart}/end/${sourceEnd}`;
      const vodPath=`/api/frigate/${encodeURIComponent(String(clientId))}/vod/${encodeURIComponent(String(cam))}/start/${sourceStart}/end/${sourceEnd}/index.m3u8`;
      // Keep the MP4 URL in the same relative signed form used by the old card.
      // A normal <video> element can resolve this path relative to HA itself.
      const mp4Url=await this._signed(recordingPath);
      const hlsUrl=await this._signed(vodPath);
      if(token!==this._playSeq || playbackSeq!==this._playbackLoadSeq) return;

      viewer.innerHTML='<div class="rec-player"></div>';
      const holder=viewer.querySelector('.rec-player');
      let didPlay=false;
      let cleanupVideo=null;
      let mode='mp4';
      let fallback=false;

      const wireVideo=(vid)=>{
        if(!vid || vid.dataset.frigateWired==='1') return false;
        vid.dataset.frigateWired='1';
        vid.controls=true;
        vid.playsInline=true;
        vid.preload='auto';
        vid.setAttribute('controls','');
        vid.setAttribute('playsinline','');
        vid.setAttribute('webkit-playsinline','');

        const sync=()=>{
          if(this._playSeq!==token || this._activePlaybackCleanup!==cleanupVideo) return;
          const rel=Number(vid.currentTime);
          if(!Number.isFinite(rel)||rel<0) return;
          const absolute=this._frigateProgress(rel,recordings,inpointOffset);
          if(!Number.isFinite(absolute)) return;
          this._scrubTarget=absolute;
          this._playing={rec:absolute};
          this._updateTimelinePlaybackTime(absolute);
        };

        const seekAndPlay=async()=>{
          if(this._playSeq!==token || this._activePlaybackCleanup!==cleanupVideo) return;
          if(!Number.isFinite(vid.duration)||vid.duration<=0) return;
          const clamped=Math.max(0,Math.min(offset,Math.max(0,vid.duration-0.05)));
          try {
            if(Math.abs(Number(vid.currentTime)-clamped)>0.25) vid.currentTime=clamped;
          } catch(_) {}
          this._scrubTarget=target;
          this._playing={rec:target};
          vid.muted=true;
          try {
            await vid.play();
            if(this._playSeq!==token || this._activePlaybackCleanup!==cleanupVideo) return;
            didPlay=true;
          } catch(err) {
            console.warn('[Frigate] iOS recording play() blocked',err);
          }
        };

        vid.addEventListener('loadedmetadata',seekAndPlay);
        vid.addEventListener('canplay',seekAndPlay,{once:true});
        vid.addEventListener('durationchange',()=>{ if(!didPlay) seekAndPlay(); });
        vid.addEventListener('timeupdate',sync);
        vid.addEventListener('playing',sync);
        vid.addEventListener('seeked',sync);
        vid.addEventListener('ended',()=>{
          if(this._playSeq===token && this._activePlaybackCleanup===cleanupVideo) this._continueRecording(sourceEnd,token);
        });

        cleanupVideo=()=>{
          try{vid.pause();}catch(_){}
          try{vid.removeAttribute('src');vid.srcObject=null;vid.load();}catch(_){}
        };
        this._activePlaybackCleanup=cleanupVideo;
        return true;
      };

      const native=document.createElement('video');
      native.className='recording-video legacy-ios-recording-video';
      native.style.cssText='position:absolute;inset:0;width:100%;height:100%;display:block;background:#000;object-fit:contain';
      native.preload='auto';
      native.muted=true;
      native.playsInline=true;
      native.setAttribute('playsinline','');
      native.setAttribute('webkit-playsinline','');

      const useHlsFallback=()=>{
        if(fallback || this._playSeq!==token) return;
        fallback=true;
        mode='hls';
        try{native.pause();native.removeAttribute('src');native.load();}catch(_){}
        try{native.remove();}catch(_){}
        const player=this._createHlsPlayer(hlsUrl,{autoplay:true});
        player.style.cssText='position:absolute;inset:0;width:100%;height:100%;display:block;background:#000';
        holder.appendChild(player);
        let tries=0;
        const attach=()=>{
          if(this._playSeq!==token) return;
          const inner=this._findVideo(player);
          if(inner && wireVideo(inner)) {
            inner.muted=true;
            return;
          }
          if(++tries<160) setTimeout(attach,75);
          else console.warn('[Frigate] iOS HLS fallback never exposed a video element');
        };
        attach();
      };

      const onNativeError=()=>{
        if(this._playSeq!==token) return;
        const err=native.error;
        console.warn('[Frigate] iOS recording MP4 error; falling back to HLS',err?.code,err?.message||'',{mode});
        if(mode==='mp4') {
          useHlsFallback();
          return;
        }
      };
      native.addEventListener('error',onNativeError);

      holder.appendChild(native);
      wireVideo(native);
      native.src=mp4Url;
      native.load();
      return;
    }

    // Desktop/Chrome retains the current exact Frigate VOD + hls.js path.
    const vodPath=`/api/frigate/${encodeURIComponent(String(clientId))}/vod/${encodeURIComponent(String(cam))}/start/${sourceStart}/end/${sourceEnd}/master.m3u8`;
    const hlsUrl=await this._resolveSignedVodPlaylist(vodPath);
    if(token!==this._playSeq || playbackSeq!==this._playbackLoadSeq) return;
    const holder=this._ensurePlaybackShell();
    if(!holder) return;
    this._setPlaybackLoading(true);
    const session={token,sourceStart,sourceEnd,recordings,inpointOffset,targetTs:target,pendingSeek:offset,holder,player:null,video:null,bound:false,preferNativeIOS:false,iosWindowed:false};
    this._playbackSession=session;
    this._attachStableHlsPlayer(session,hlsUrl);
  },

async _continueRecording(nextTs, token) {
    if (this._playSeq !== token) return;
    const next = this._hourStart(Number(nextTs));
    const now = Math.floor(Date.now()/1000);
    if (next >= now) return;
    const {clientId, cam} = this._cc();
    try {
      const rec = await this._ws({type:'frigate/recordings/get', instance_id:clientId, camera:cam, after:next, before:next+3600});
      if (this._playSeq !== token) return;
      const ranges = this._mergeRecs(Array.isArray(rec) ? rec : []);
      const hasMedia = ranges.some(r => Number(r.start_time) < next + 3600 && Number(r.end_time || next) > next);
      if (hasMedia) {
        // Start exactly at the hour boundary. _showRecording will use the
        // boundary as sourceStart, so no 10-second lead-in is replayed here.
        await this._showRecording(next, next + 3600, next);
      }
    } catch (_) {}
  },

_toggleRecSeek(row) {
    // Capture rs/re directly from this specific row's dataset — no shared state
    const rs = +row.dataset.rs;
    const re = +row.dataset.re;
    const existing = row.querySelector('.rec-seek-wrap');
    if (existing) {
      // Second click: close the seek bar, leave the video playing as-is
      existing.remove();
      return;
    }
    // First click: show seek bar and start playing from beginning immediately
    const d = Math.max(1, re - rs);
    const wrap = document.createElement('div');
    wrap.className = 'rec-seek-wrap';
    // Helper: offset seconds → absolute wall-clock label
    const toTime = v => new Date((rs + v) * 1000).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit', second:'2-digit'});
    wrap.innerHTML = `<div class="rec-seek-row">
      <input type="range" class="rec-seek-bar" min="0" max="${d}" value="0" step="1">
      <span class="rec-seek-lbl">▶ ${this._time(rs)}</span>
    </div>`;
    row.querySelector('.rinf').appendChild(wrap);
    const bar = wrap.querySelector('.rec-seek-bar');
    const lbl = wrap.querySelector('.rec-seek-lbl');
    // Update label while dragging (no video load)
    bar.addEventListener('input', ev => { ev.stopPropagation(); lbl.textContent = `▶ ${toTime(+bar.value)}`; });
    // Load video at seeked position on mouse-up/touch-end
    bar.addEventListener('change', ev => {
      ev.stopPropagation();
      const offset = +bar.value;
      this._showRecording(rs, re, offset > 0 ? rs + offset : rs);
    });
    // Play from start immediately so user sees something while positioning the bar
    this._showRecording(rs, re);
  }
};

// ── src/card/recording-playback.js ──
/**
 * Public method-group barrel for recordingPlaybackMethods.
 *
 * Keeping this entry point stable avoids coupling callers to the internal
 * feature layout while allowing each concern to live in a focused module.
 */
const recordingPlaybackMethods = Object.assign(
  {},
  recordingTimeMethods,
  recordingShellMethods,
  recordingSourceMethods,
  recordingPlayerMethods,
);

// ── src/card/actions.js ──
/**
 * User commands that change card state: navigation, retention, filters and calendar selection.
 */
// Prototype methods grouped by responsibility.
const actionMethods = {
_goNow() {
    this._downloadRange=null;
    this._resetTimelineToNow10m();
    this._loadWindow(true);
    this._renderTimeline(true);
    this._renderRange();
    this._renderTimelineZoomLabel();
    this._renderStreamCtrl();
    this._updateTimelineDateLabel?.();
  },

_download(id,file) { const a=document.createElement('a'); a.href=this._media(id,file,true); a.download=`${this._cc().cam}_${id}_${file}`; document.body.appendChild(a); a.click(); a.remove(); },

_toggleFav(id) {
    const ev=this._events.find(e=>e.id===id); if(!ev) return;
    const next=!ev.retain_indefinitely;
    ev.retain_indefinitely=next;
    if (next) { if(!this._kept.find(e=>e.id===id)) this._kept=[{...ev},...this._kept]; }
    else { this._kept=this._kept.filter(e=>e.id!==id); }
    const ent=this._activeCam?.entity; if(ent&&this._camCache[ent]) this._camCache[ent].kept=this._kept;
    this._renderList(); this._renderLatest();
    const {clientId}=this._cc();
    this._hass.callWS({type:'frigate/event/retain',instance_id:clientId,event_id:id,retain:next})
      .catch(err=>{
        ev.retain_indefinitely=!next;
        if(next) this._kept=this._kept.filter(e=>e.id!==id);
        else if(!this._kept.find(e=>e.id===id)) this._kept=[{...ev},...this._kept];
        this._renderList();
        console.warn('[Frigate] retain failed',err);
        this._toast('Could not save — check Frigate port config.');
      });
  },

async _markAll() {
    const ids=this._reviews.filter(r=>!r.has_been_reviewed).map(r=>r.id); if(!ids.length) return;
    const {clientId}=this._cc();
    try { await this._hass.callWS({type:'frigate/reviews/viewed',instance_id:clientId,ids,viewed:true}); this._reviews.forEach(r=>r.has_been_reviewed=true); this._renderList(); }
    catch(e) { console.warn(e); }
  },

async _markReviewed(id) {
    const {clientId}=this._cc();
    try { await this._hass.callWS({type:'frigate/reviews/viewed',instance_id:clientId,ids:[id],viewed:true}); const r=this._reviews.find(x=>x.id===id); if(r) r.has_been_reviewed=true; this._renderList(); }
    catch(e) { console.warn(e); }
  },

_applyBrowse() {
    // The legacy bottom Events · Recordings browser was replaced by the
    // unified media gallery. Keep this method as a harmless compatibility
    // no-op because older lifecycle paths still call it.
  },

_toggleBrowse() { this._browseOpen=!this._browseOpen; this._applyBrowse(); },

_toast(msg,ms=3500) {
    const t=this.shadowRoot.querySelector('#toast'); if(!t) return;
    t.textContent=msg; t.style.display='block';
    clearTimeout(this._toastT); this._toastT=setTimeout(()=>{ t.style.display='none'; },ms);
  },

_toggleFilter() { const p=this.shadowRoot.querySelector('#filter-panel'); const open=p.style.display==='none'; this.shadowRoot.querySelector('#cal-panel').style.display='none'; p.style.display=open?'block':'none'; if(open){ this._mergeLoadedFilterMetadata(this._cc(),this._events,this._reviews); this._loadFrigateFilterMetadata(); this._renderFilter(); } },

_toggleCal() { const p=this.shadowRoot.querySelector('#cal-panel'); const open=p.style.display==='none'; this.shadowRoot.querySelector('#filter-panel').style.display='none'; p.style.display=open?'block':'none'; if(open){ this._calMonth=this._calMonth||new Date(this._winEnd*1000); this._renderCal(); } },

_calNav(d) { const m=this._calMonth||new Date(); m.setMonth(m.getMonth()+d); this._calMonth=new Date(m); this._renderCal(); },

_pickDay(ds) {
    const [y,mo,da]=String(ds||'').split('-').map(Number);
    if(!Number.isFinite(y)||!Number.isFinite(mo)||!Number.isFinite(da)) return;
    const midnight=Math.floor(new Date(y,mo-1,da,0,0,0,0).getTime()/1000);
    if(!Number.isFinite(midnight)) return;

    // A calendar selection is a timeline translation, not a zoom command.
    // Preserve the exact visible span the user currently chose and move that
    // same viewport so its oldest edge begins at local midnight on the selected
    // date. Previously this replaced the viewport with 00:00–23:59:59, which
    // looked like the calendar merely zoomed the timeline out to 24 hours.
    const currentSpan=Number(this._winEnd)-Number(this._winStart);
    const fallbackSpan=typeof this._timelineDefaultSpanSeconds==='function'
      ? Number(this._timelineDefaultSpanSeconds()) : 10*60;
    const span=Number.isFinite(currentSpan)&&currentSpan>0 ? currentSpan : Math.max(1,fallbackSpan||10*60);

    // Calendar navigation is a hard ownership boundary. After a scrub there
    // may still be a wheel-settle callback, a debounced timeline load, a
    // moving-window refresh, or an active recording/media clock waiting to
    // update the playhead. Any of those can immediately translate the timeline
    // back to the old scrub position after the new date is applied. Cancel the
    // queued work and invalidate every in-flight generation before moving the
    // viewport so repeated date selections are deterministic.
    clearTimeout(this._wt); this._wt=null;
    clearTimeout(this._timelineDataTimer); this._timelineDataTimer=null;
    this._timelineDataSeq=(Number(this._timelineDataSeq)||0)+1;
    clearTimeout(this._timelineDynamicTimer); this._timelineDynamicTimer=null;
    this._timelineDynamicTimerMode='';
    this._timelineDynamicPending=false;
    this._timelineLoadSeq=(Number(this._timelineLoadSeq)||0)+1;

    // Stop single-camera and synchronized Multiview recording playback before
    // changing dates. Their media clocks intentionally drive
    // _updateTimelinePlaybackTime(); leaving either alive would let the old
    // recording re-anchor the freshly selected calendar date on its next tick.
    if(typeof this._invalidatePlaybackForTimelineMove==='function') {
      this._invalidatePlaybackForTimelineMove();
    } else if(typeof this._cancelActivePlayback==='function') {
      this._cancelActivePlayback();
      this._playSeq=(Number(this._playSeq)||0)+1;
      this._playbackLoadSeq=(Number(this._playbackLoadSeq)||0)+1;
    }

    this._timelineInteracting=false;
    this._timelineFollowingLive=false;
    this._timelineWasLiveBeforeGesture=false;
    this._timelineLiveCrossed=false;
    this._scrubGestureInvalidated=false;
    this._timelineSeekSeq=(Number(this._timelineSeekSeq)||0)+1;
    this._timelineSelected=null;
    this._downloadRange=null;

    this._winStart=midnight;
    this._winEnd=midnight+span;
    this._timelineFocusTs=midnight+span/2;
    this._scrubTarget=this._timelineFocusTs;
    this._exhausted=false;
    this._timelineDataDirty=true;

    const panel=this.shadowRoot.querySelector('#cal-panel');
    if(panel) panel.style.display='none';
    this._renderTimeline(true);
    this._renderRange();
    this._renderTimelineZoomLabel();
    this._updateTimelineDateLabel?.(ds);
    this._loadWindow(true);

    // Calendar selection is a complete navigation action. Reuse the normal
    // timeline seek path so single-camera and Multiview playback keep the same
    // source selection, iOS handling, and synchronization semantics.
    const target=Number(this._timelineFocusTs);
    if(Number.isFinite(target) && typeof this._seekTimelineTarget==='function') {
      Promise.resolve(this._seekTimelineTarget(target)).catch((error)=>{
        console.warn('[Sightline] timeline calendar seek failed',error);
      });
    }
  },

_renderCal() {
    const p=this.shadowRoot.querySelector('#cal-panel'); if(!p) return;
    const m=this._calMonth||new Date(); const y=m.getFullYear(),mo=m.getMonth();
    const first=new Date(y,mo,1); const startDow=(first.getDay()+6)%7; const days=new Date(y,mo+1,0).getDate();
    let cells=''; for(let i=0;i<startDow;i++) cells+='<span></span>';
    for(let d=1;d<=days;d++){
      const ds=`${y}-${String(mo+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
      cells+=`<button class="cday" data-cal-day="${ds}">${d}${this._daysWithActivity.has(ds)?'<i class="cdot"></i>':''}</button>`;
    }
    p.innerHTML=`<div class="cal-head"><button data-cal-nav="-1">‹</button><b>${m.toLocaleDateString([],{month:'long',year:'numeric'})}</b><button data-cal-nav="1">›</button></div>
      <div class="cal-dow"><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span></div>
      <div class="cal-grid">${cells}</div>`;
  }
};

// ── src/card/timeline/filters.js ──
/**
 * Live timeline filter normalization, predicates, and filter rendering.
 *
 * Methods are composed onto SightlineCard.prototype; method names are kept
 * stable so existing card behavior and tests remain unchanged.
 */
const timelineFilterMethods = {
_normalizeLiveFilterState() {
    const labels=this._labels(), faces=this._faces(), zones=this._zones();
    if(this._filterLabel!=='all'&&!labels.includes(this._filterLabel)) this._filterLabel='all';
    if(this._filterFace!=='all'&&!faces.includes(this._filterFace)) this._filterFace='all';
    if(this._filterZone!=='all'&&!zones.includes(this._filterZone)) this._filterZone='all';
  },

_eventMatchesLiveFilter(ev) {
    if(!ev) return false;
    if(this._filterLabel!=='all' && this._normalizeObjectLabel(ev?.label)!==String(this._filterLabel)) return false;
    if(this._filterFace!=='all' && !this._eventFaceList(ev).includes(this._filterFace)) return false;
    if(this._filterZone!=='all' && !this._eventZoneList(ev).includes(this._filterZone)) return false;
    if(this._favOnly && !(ev.retain_indefinitely||ev.is_favorite||ev.favorite)) return false;
    return true;
  },

_applyLiveFilterChange() {
    this._normalizeLiveFilterState();
    if(this._timelineSelected) {
      const selected=this._allDisplayEvents().find(ev=>String(ev.id)===String(this._timelineSelected));
      if(selected&&!this._eventMatchesLiveFilter(selected)) this._timelineSelected=null;
    }
    this._renderFilter();
    this._renderList();
    this._renderLatest();
    this._renderStats();
    this._renderLegend();
    this._renderTimeline(true);
  },

_renderFilter() {
    const p=this.shadowRoot.querySelector('#filter-panel'); if(!p) return;
    this._normalizeLiveFilterState();
    const lbls=['all',...this._labels()]; const faces=['all',...this._faces()]; const zones=['all',...this._zones()];
    const chip=(val,cur,attr,kind)=>`<button class="chip ${val===cur?'on':''}" data-${attr}="${val}">${val==='all'?'All':this._filterDisplayName(kind,val)}</button>`;
    p.innerHTML=`<div class="frow"><span class="frow-l">Label</span>${lbls.map(l=>chip(l,this._filterLabel,'flabel','label')).join('')}</div>
      ${faces.length>1?`<div class="frow"><span class="frow-l">Face</span>${faces.map(v=>`<button class="chip ${v===this._filterFace?'on':''}" data-fface="${v}">${v==='all'?'All':this._faceDisplayName(v)}</button>`).join('')}</div>`:''}
      <div class="frow"><span class="frow-l">Zone</span>${zones.map(z=>chip(z,this._filterZone,'fzone','zone')).join('')}</div>
      <div class="frow"><span class="frow-l">Show</span>
        <button class="chip ${!this._favOnly?'on':''}" data-favonly="0">All</button>
        <button class="chip ${this._favOnly?'on':''}" data-favonly="1">★ Favorites</button></div>`;
  }
};

// ── src/card/timeline/calendar.js ──
/**
 * Native timeline date picker and selected-date presentation.
 *
 * iOS/Safari requires the user's gesture to land directly on a real date input,
 * while Chromium is most reliable when showPicker() is called from the trusted
 * desktop click. The same input supports both paths without synthetic hand-off.
 */
/**
 * Convert initialized card timestamps to seconds since epoch.
 *
 * Card state deliberately starts with null/zero placeholders before Home
 * Assistant calls `_start()`. JavaScript's `Number(null) === 0` would otherwise
 * make those placeholders look like valid Unix-epoch timestamps and display
 * Dec 31, 1969 in negative UTC offsets.
 */
function timelineTimestamp(value) {
  if(value === null || value === undefined || value === '') return null;
  const timestamp=Number(value);
  return Number.isFinite(timestamp) && timestamp>0 ? timestamp : null;
}

function timelineDateFocus(card) {
  const focus=timelineTimestamp(card._timelineFocusTs);
  if(focus!==null) return focus;

  const start=timelineTimestamp(card._winStart);
  const end=timelineTimestamp(card._winEnd);
  if(start!==null && end!==null) return (start+end)/2;

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

const timelineCalendarMethods = {
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
    const timestamp=timelineTimestamp(value);
    const focusTimestamp=timelineTimestamp(this._timelineFocusTs);
    const selected=explicit
      || (timestamp!==null?localDateValue(timestamp):null)
      || (focusTimestamp!==null?localDateValue(focusTimestamp):null)
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

// ── src/card/timeline/interaction.js ──
/**
 * Timeline pointer, touch, wheel and event-preview gesture handling.
 *
 * All high-frequency input paths converge on the same viewport and seek state,
 * which keeps desktop, touch and iOS behavior synchronized.
 */
const timelineGestureMethods = {
_invalidatePlaybackForTimelineMove() {
    this._cancelActivePlayback();
    ++this._playSeq;
    ++this._playbackLoadSeq;
    clearTimeout(this._playbackTimer);
    this._playing = null;
    this._playingHour = null;
    this._playingSourceStart = null;
    this._playingSourceEnd = null; this._playingRecordings = []; this._playingInpointOffset = 0;
    this._scrubTarget = this._timelineFocusTs;
    const v=this.shadowRoot.querySelector('#viewer');
    if(v) v.innerHTML='';
    this._renderStreamCtrl();
  },

_scheduleTimelineRender(full=false) {
    this._timelineRenderNeedsFull = this._timelineRenderNeedsFull || full;
    if (this._timelineRenderRaf) return;
    this._timelineRenderRaf = requestAnimationFrame(() => {
      this._timelineRenderRaf = 0;
      const needsFull = this._timelineRenderNeedsFull;
      this._timelineRenderNeedsFull = false;
      this._renderTimeline(!!needsFull);
    });
  },

_reconcileTimelineDuringMove() {
    // High-frequency pan updates move existing DOM nodes directly for speed,
    // but a zoom can leave the visible event set different from the old DOM.
    // Reconcile at a modest cadence while moving so newly-visible markers are
    // introduced and stale ones are removed without rebuilding every frame.
    const now=performance.now();
    if(now-(this._timelineLastMotionReconcile||0)<120) return;
    this._timelineLastMotionReconcile=now;
    this._scheduleTimelineRender(false);
  },

_wireScrub() {
    const track=this.shadowRoot.querySelector('#tl-track'); if(!track) return;
    if (this._scrubAbort) { try { this._scrubAbort.abort(); } catch(_) {} }
    const controller = new AbortController();
    this._scrubAbort = controller;
    this._scrubTrack = track;
    const signal = controller.signal;
    let drag=false,sx=0,sy=0,sws=0,swe=0,lastScrubLabelAt=0;
    let scrubber=false,scrubberLastY=0,scrubberAutoRaf=0,scrubberAutoY=0;
    let rangeDrag=null,rangeLastLabel=0,rangePointerId=null;
    let pinch=false,pinchDistance=0,pinchSpan=0,pinchAnchorTs=0,pinchAnchorRatio=0;
    const stopScrubberAuto=()=>{
      if(scrubberAutoRaf){cancelAnimationFrame(scrubberAutoRaf);scrubberAutoRaf=0;}
    };
    // The center scrubber is a viewport transport, not an independent cursor.
    // Keep the loaded/rendered window translated by exactly the same amount as
    // the playhead timestamp. Previously the scrubber changed only
    // _timelineFocusTs, while _winStart/_winEnd remained on the old range. The
    // fast renderer then correctly culled nodes against that stale window, which
    // made the timeline appear mostly blank until a normal finger pan updated the
    // window again.
    const moveScrubberWindowTo=(nextTs)=>{
      const now=Math.floor(Date.now()/1000);
      const current=Number.isFinite(Number(this._timelineFocusTs))
        ? Number(this._timelineFocusTs)
        : ((this._winStart+this._winEnd)/2);
      const desired=Math.max(0,Math.min(now,Math.round(Number(nextTs))));
      let delta=desired-current;
      // Preserve the current span/visual playhead position. Only constrain the
      // extreme historical boundary; normal LIVE/past movement is a pure
      // translation and therefore stays identical to finger panning.
      if(this._winStart+delta<0) delta=-this._winStart;
      this._winStart+=delta;
      this._winEnd+=delta;
      this._timelineFocusTs=Math.round(current+delta);
      this._scrubTarget=this._timelineFocusTs;
      this._exhausted=false;
    };
    const rangeTimestampAtY=(y)=>{
      const rect=track.getBoundingClientRect();
      const ratio=Math.max(0,Math.min(1,(y-rect.top)/Math.max(1,rect.height)));
      return this._winEnd-ratio*Math.max(1,this._winEnd-this._winStart);
    };
    const rangeKindAtY=(y,preferred)=>{
      const r=this._downloadRange;
      if(!r) return preferred||'start';
      const ts=rangeTimestampAtY(y);
      const ds=Math.abs(ts-Number(r.start));
      const de=Math.abs(ts-Number(r.end));
      // When the handles are nearly on top of each other, honor the explicitly
      // touched handle. Everywhere else, choose the mathematically closest
      // boundary so overlapping 54px hit lanes never select the wrong one.
      if(preferred && Math.abs(ds-de)<1.25) return preferred;
      return ds<=de?'start':'end';
    };
    const startRangeHandle=(kind,y)=>{
      if(!this._downloadRange) return;
      stopScrubberAuto();
      rangeDrag=kind; drag=false; scrubber=false; pinch=false;
      this._timelineInteracting=true;
      track.classList.remove('grab');
      track.classList.add('range-grab');
      const t=this._updateDownloadRangeBoundary(kind,rangeTimestampAtY(y));
      if(Number.isFinite(t)){
        this._syncDownloadRangePickerDOM(kind);
        this._updateTimelineScrubLabel(t);
      }
    };
    const moveRangeHandle=(y)=>{
      if(!rangeDrag||!this._downloadRange) return;
      const t=this._updateDownloadRangeBoundary(rangeDrag,rangeTimestampAtY(y));
      if(!Number.isFinite(t)) return;
      // Do not rebuild the timeline while a pointer is captured. Replacing the
      // boundary DOM node mid-drag is what made iOS intermittently lose the
      // active finger during range dragging. Update only positions/text in place.
      this._syncDownloadRangePickerDOM(rangeDrag);
      const nowMs=performance.now();
      if(nowMs-rangeLastLabel>75){rangeLastLabel=nowMs;this._updateTimelineScrubLabel(t);}
    };
    const stopRangeHandle=()=>{
      if(!rangeDrag) return;
      rangeDrag=null;
      this._timelineInteracting=false;
      track.classList.remove('range-grab');
      this._syncDownloadRangePickerDOM();
    };
    const startScrubber=(y)=>{
      stopScrubberAuto();
      scrubber=true; drag=false; this._timelineInteracting=true; this._scrubGestureInvalidated=false; this._timelineWasLiveBeforeGesture=this._timelineFollowingLive===true; this._timelineLiveCrossed=false; this._timelineFollowingLive=false;
      scrubberLastY=y; scrubberAutoY=y;
      if (this._playing || this._activePlaybackCleanup) this._invalidatePlaybackForTimelineMove();
      this._scrubTarget=this._timelineFocusTs ?? ((this._winStart+this._winEnd)/2);
      track.classList.add('grab');
      scrubberAutoRaf=requestAnimationFrame(scrubberAuto);
    };
    const moveScrubber=(y)=>{
      if(!scrubber)return;
      const rect=track.getBoundingClientRect();
      const size=Math.max(1,track.clientHeight||rect.height||1);
      const span=Math.max(1,this._winEnd-this._winStart);
      const dy=y-scrubberLastY;
      if(Math.abs(dy)>0.01){
        // Dragging the center scrubber downward moves toward older footage.
        // Once the finger is held in the lower part of the rail, progressively
        // increase the time rate so a long timeline can be traversed quickly.
        const localY=Math.max(0,Math.min(size,y-rect.top));
        const lower=Math.max(0,Math.min(1,(localY/size-.58)/.42));
        const speed=1+4*lower*lower;
        const next=(this._scrubTarget ?? this._timelineFocusTs ?? ((this._winStart+this._winEnd)/2)) - (dy/size)*span*speed;
        moveScrubberWindowTo(next);
        this._updateTimelineLive(); this._renderRange();
        this._reconcileTimelineDuringMove();
        this._scheduleTimelineDynamicData('motion');
        const nowMs=performance.now();
        if(nowMs-lastScrubLabelAt>90){lastScrubLabelAt=nowMs;this._updateTimelineScrubLabel(this._timelineFocusTs);}
      }
      scrubberLastY=y; scrubberAutoY=y;
    };
    const scrubberAuto=()=>{
      if(!scrubber)return;
      const rect=track.getBoundingClientRect();
      const size=Math.max(1,track.clientHeight||rect.height||1);
      const localY=Math.max(0,Math.min(size,scrubberAutoY-rect.top));
      // Holding near the bottom edge keeps walking backward through time.
      // This is deliberately bounded so a small accidental touch cannot race
      // through hours of recordings.
      if(localY>size*.78){
        const edge=(localY-size*.78)/(size*.22);
        const speed=1+7*Math.min(1,edge);
        const span=Math.max(1,this._winEnd-this._winStart);
        const dt=(1/60)*span/size*speed*size*.055;
        const next=(this._scrubTarget ?? this._timelineFocusTs ?? ((this._winStart+this._winEnd)/2))-dt;
        moveScrubberWindowTo(next);
        this._updateTimelineLive(); this._renderRange();
        this._reconcileTimelineDuringMove();
        this._scheduleTimelineDynamicData('motion');
        this._updateTimelineScrubLabel(this._timelineFocusTs);
      }
      scrubberAutoRaf=requestAnimationFrame(scrubberAuto);
    };
    const stopScrubber=()=>{
      if(!scrubber)return;
      scrubber=false; stopScrubberAuto(); track.classList.remove('grab');
      this._timelineInteracting=false;
      const target=this._scrubTarget ?? this._timelineFocusTs ?? this._winEnd;
      const wasLive=this._timelineWasLiveBeforeGesture;
      this._timelineWasLiveBeforeGesture=false;
      this._renderTimeline(); this._scheduleTimelineDataLoad();
      if (this._isAtLiveEdge(target)) { this._refreshLiveFromTimeline({restart: !wasLive}); return; }
      this._seekTimelineTarget(target);
    };
    const dn=(x,y)=>{
      drag=true; this._timelineInteracting=true; this._scrubGestureInvalidated=false; this._timelineWasLiveBeforeGesture=this._timelineFollowingLive===true; this._timelineLiveCrossed=false; this._timelineFollowingLive=false; sx=x; sy=y; sws=this._winStart; swe=this._winEnd;
      // Any timeline movement supersedes event-clip playback immediately.
      // Do this before changing the window so an old clip cannot continue
      // updating the viewer while the new recording target is being chosen.
      if (this._playing || this._activePlaybackCleanup) {
        this._invalidatePlaybackForTimelineMove();
      }
      this._scrubTarget = this._timelineFocusTs ?? swe;
      track.classList.add('grab');
    };
    const mv=(x,y)=>{
      if(!drag||pinch)return;
      // Once the finger/mouse moves, the old recording is no longer authoritative.
      // Do this on the first movement only; subsequent moves are cheap renders.
      if (!this._scrubGestureInvalidated) {
        this._scrubGestureInvalidated = true;
        this._invalidatePlaybackForTimelineMove();
      }
      const vertical=track.classList.contains('vertical');
      const size=(vertical?track.clientHeight:track.clientWidth)||1;
      const sp=swe-sws;
      const delta=vertical?-(y-sy):(x-sx);
      // Newest is at the top. Swiping upward moves the timeline downward into older footage; dragging downward moves toward newer footage.
      const sh=Math.round(delta/size*sp);
      const pan = sh;
      let ns=sws-pan, ne=swe-pan;
      let nf=((sws+swe)/2)-pan;
      const now=Math.floor(Date.now()/1000);
      const previousFocus = Number.isFinite(Number(this._timelineFocusTs))
        ? Number(this._timelineFocusTs)
        : ((sws+swe)/2);
      // LIVE is crossed by the fixed playhead timestamp, not by the window's
      // newest edge. The default 10-minute viewport intentionally extends
      // five minutes into the future so LIVE can start centered. Do not clamp
      // that future portion away when the user makes a small backward move;
      // doing so moved the LIVE line to the top of the timeline.
      const crossedLive = previousFocus < now - 1 && nf >= now - 1;
      if(ns<0){const a=-ns;ns+=a;ne+=a;nf+=a;}
      this._winStart=ns; this._winEnd=ne;
      this._timelineFocusTs = Math.max(ns,Math.min(ne,Math.round(nf)));
      if (crossedLive) {
        // Do not restart the live stream from inside the move handler. The
        // browser can still deliver a touchend/mouseup immediately afterward,
        // which previously caused two competing stream mounts and the
        // intermittent 'Unable to start stream' error. Let the single release
        // handler perform the transition exactly once.
        this._timelineLiveCrossed=true;
        this._scrubTarget=Math.floor(now);
        this._updateTimelineLive();
        this._renderRange();
        return;
      }
      this._scrubTarget = this._timelineFocusTs;
      this._updateTimelineLive(); this._renderRange();
      this._reconcileTimelineDuringMove();
      this._scheduleTimelineDynamicData('motion');
      const nowMs=performance.now();
      if(nowMs-lastScrubLabelAt>140){
        lastScrubLabelAt=nowMs;
        this._updateTimelineScrubLabel(this._timelineFocusTs);
      }
    };
    const pinchMove=(touches)=>{
      if(!pinch||touches.length<2)return;
      const a=touches[0],b=touches[1];
      const dx=b.clientX-a.clientX,dy=b.clientY-a.clientY;
      const dist=Math.max(1,Math.hypot(dx,dy));
      const ratio=Math.max(0,Math.min(1,pinchAnchorRatio));
      const newSpan=Math.max(5*60,Math.min(24*60*60,Math.round(pinchSpan*pinchDistance/dist)));
      this._timelineZoom=Math.max(this._timelineZoomMin,Math.min(this._timelineZoomMax,3600/newSpan));
      this._setTimelineWindowAround(pinchAnchorTs,ratio,newSpan);
      // The zoom changes the time scale, so reconcile the scale/markers on the
      // next animation frame instead of leaving the old scale until touchend.
      this._scheduleTimelineRender(true);
      this._renderRange(); this._renderTimelineZoomLabel();
      this._scheduleTimelineDynamicData('motion');
      this._updateTimelineScrubLabel(this._timelineFocusTs ?? this._winEnd);
    };
    const up=()=>{
      if(pinch){pinch=false;pinchDistance=0;this._timelineInteracting=false;track.classList.remove('grab');this._timelineWasLiveBeforeGesture=false;this._timelineLiveCrossed=false;this._renderTimeline();this._scheduleTimelineDataLoad();return;}
      if(!drag)return;
      drag=false; track.classList.remove('grab');
      this._scrubGestureInvalidated=false;
      const target=this._scrubTarget ?? this._winEnd;
      const crossedLive=this._timelineLiveCrossed || this._isAtLiveEdge(target);
      const wasLive=this._timelineWasLiveBeforeGesture;
      this._timelineLiveCrossed=false;
      this._timelineWasLiveBeforeGesture=false;
      if (crossedLive) { this._refreshLiveFromTimeline({restart: !wasLive}); return; }
      this._seekTimelineTarget(target);
      this._scheduleTimelineDataLoad();
    };
    // Pointer Events are the authoritative trim interaction path. Capture is
    // taken on the stable timeline element (not on a handle that is visually
    // updated) so the drag survives finger drift, Shadow DOM hit-testing and
    // iOS/WebKit event retargeting. Dragging anywhere in trim mode moves the
    // nearest boundary; the visible circle/label is no longer a precision hit.
    if('PointerEvent' in window){
      track.addEventListener('pointerdown',e=>{
        if(!this._downloadRange) return;
        if(e.target.closest('[data-range-download],[data-range-cancel]')) return;
        if(e.pointerType==='mouse' && e.button!==0) return;
        e.preventDefault(); e.stopPropagation();
        const preferred=e.target.closest('[data-range-handle]')?.dataset?.rangeHandle||null;
        const kind=rangeKindAtY(e.clientY,preferred);
        rangePointerId=e.pointerId;
        try{track.setPointerCapture(e.pointerId);}catch(_){}
        startRangeHandle(kind,e.clientY);
      },{passive:false,signal});
      track.addEventListener('pointermove',e=>{
        if(rangePointerId==null || e.pointerId!==rangePointerId || !rangeDrag) return;
        e.preventDefault();
        moveRangeHandle(e.clientY);
      },{passive:false,signal});
      const finishRangePointer=e=>{
        if(rangePointerId==null || e.pointerId!==rangePointerId) return;
        try{if(track.hasPointerCapture?.(e.pointerId))track.releasePointerCapture(e.pointerId);}catch(_){}
        rangePointerId=null;
        stopRangeHandle();
      };
      track.addEventListener('pointerup',finishRangePointer,{signal});
      track.addEventListener('pointercancel',finishRangePointer,{signal});
      track.addEventListener('lostpointercapture',e=>{
        if(rangePointerId!=null && e.pointerId===rangePointerId){rangePointerId=null;stopRangeHandle();}
      },{signal});
    }

    track.addEventListener('mousedown',e=>{
      if(this._downloadRange){
        if(e.target.closest('[data-range-download],[data-range-cancel]'))return;
        if(!('PointerEvent' in window)){
          e.preventDefault(); e.stopPropagation();
          const preferred=e.target.closest('[data-range-handle]')?.dataset?.rangeHandle||null;
          startRangeHandle(rangeKindAtY(e.clientY,preferred),e.clientY);
        }
        return;
      }
      if(e.target.closest('.tl-playhead i')){e.preventDefault();startScrubber(e.clientY);return;}
      if(e.target.closest('.t-ev,.t-preview,.tl-zoom-controls'))return;
      e.preventDefault();dn(e.clientX,e.clientY);
    },{signal});
    window.addEventListener('mousemove',e=>{if(rangeDrag&&rangePointerId==null){e.preventDefault();moveRangeHandle(e.clientY);return;}if(scrubber){e.preventDefault();moveScrubber(e.clientY);return;}mv(e.clientX,e.clientY);},{signal});
    window.addEventListener('mouseup',()=>{if(rangeDrag&&rangePointerId==null){stopRangeHandle();return;}if(scrubber){stopScrubber();return;}up();},{signal});
    track.addEventListener('touchstart',e=>{
      if(this._downloadRange){
        if(e.target.closest('[data-range-download],[data-range-cancel]'))return;
        /* Pointer Events are preferred, but some iOS/WKWebView builds expose
           PointerEvent while intermittently failing to deliver pointerdown
           through nested glass/Shadow DOM layers. If no pointer was actually
           captured, use touch as a real fallback instead of assuming support. */
        if(rangePointerId==null && !rangeDrag && e.touches.length){
          e.preventDefault(); e.stopPropagation();
          const y=e.touches[0].clientY;
          const preferred=e.target.closest('[data-range-handle]')?.dataset?.rangeHandle||null;
          startRangeHandle(rangeKindAtY(y,preferred),y);
        }
        return;
      }
      if(e.target.closest('.tl-playhead i')){
        e.preventDefault();
        startScrubber(e.touches[0].clientY);
        scrubberAutoRaf=requestAnimationFrame(scrubberAuto);
        return;
      }
      if(e.touches.length>=2){
        drag=false; pinch=true;
        this._timelineWasLiveBeforeGesture=this._timelineFollowingLive===true;
        this._timelineLiveCrossed=false;
        this._invalidatePlaybackForTimelineMove();
        const a=e.touches[0],b=e.touches[1];
        pinchDistance=Math.max(1,Math.hypot(b.clientX-a.clientX,b.clientY-a.clientY));
        pinchSpan=Math.max(1,this._winEnd-this._winStart);
        const rect=track.getBoundingClientRect();
        const midY=(a.clientY+b.clientY)/2;
        pinchAnchorRatio=Math.max(0,Math.min(1,(midY-rect.top)/Math.max(1,rect.height)));
        pinchAnchorTs=(this._timelineFocusTs ?? this._winEnd) + (0.5-pinchAnchorRatio)*pinchSpan;
        track.classList.add('grab');
        e.preventDefault();
        return;
      }
      if(e.target.closest('.t-ev,.t-preview,.tl-zoom-controls'))return;
      dn(e.touches[0].clientX,e.touches[0].clientY);
    },{passive:false,signal});
    track.addEventListener('touchmove',e=>{
      if(rangeDrag&&rangePointerId==null){e.preventDefault();moveRangeHandle(e.touches[0].clientY);return;}
      if(scrubber){e.preventDefault();moveScrubber(e.touches[0].clientY);return;}
      if(pinch&&e.touches.length>=2){e.preventDefault();pinchMove(e.touches);return;}
      if(drag){e.preventDefault();mv(e.touches[0].clientX,e.touches[0].clientY);}
    },{passive:false,signal});
    track.addEventListener('touchend',e=>{if(rangeDrag&&rangePointerId==null){e.preventDefault();stopRangeHandle();return;}if(scrubber){e.preventDefault();stopScrubber();return;}if(pinch){e.preventDefault();up();return;}up();},{passive:false,signal});
    track.addEventListener('touchcancel',()=>{if(rangeDrag&&rangePointerId==null){stopRangeHandle();return;}if(scrubber){stopScrubber();return;}pinch=false;drag=false;this._timelineInteracting=false;this._timelineWasLiveBeforeGesture=false;this._timelineLiveCrossed=false;track.classList.remove('grab');this._renderTimeline();},{signal});
    track.addEventListener('wheel',e=>{
      e.preventDefault();
      if(this._downloadRange) return;
      const rect=track.getBoundingClientRect();
      const span=this._winEnd-this._winStart;
      // Ctrl/Meta wheel behaves like pinch zoom; normal wheel pans vertically.
      if(e.ctrlKey||e.metaKey){
        const midY=Math.max(0,Math.min(rect.height,e.clientY-rect.top));
        const ratio=midY/Math.max(1,rect.height);
        const anchor=this._timelineTimestampAtRatio(ratio,this._timelineFocusTs,span);
        this._zoomTimeline(e.deltaY>0?1/1.12:1.12,anchor,ratio);
        return;
      }
      const delta=e.deltaY||e.deltaX;
      // Wheel scrolling is a timeline interaction too. While following LIVE,
      // _updateTimelineLive() normally keeps the viewport centered on now.
      // If we don't explicitly leave that state before applying a wheel shift,
      // the very next live-marker update snaps the timeline straight back to
      // now +/- 5 minutes. That was the regression introduced with the LIVE
      // bar: even a tiny wheel movement appeared to jump/reset the timeline.
      // Treat wheel panning exactly like touch/mouse dragging until the wheel
      // settles, then commit the selected timestamp.
      if (!this._timelineInteracting) this._timelineWasLiveBeforeGesture=this._timelineFollowingLive===true;
      this._timelineFollowingLive=false;
      this._timelineInteracting=true;
      if (this._playing || this._activePlaybackCleanup) this._invalidatePlaybackForTimelineMove();
      clearTimeout(this._wt);
      const shift=Math.round(delta/Math.max(1,rect.height)*span);
      let ns=this._winStart+shift, ne=this._winEnd+shift;
      let nf=(this._timelineFocusTs ?? ((this._winStart+this._winEnd)/2))+shift;
      const now=Math.floor(Date.now()/1000);
      const previousFocus = Number.isFinite(Number(this._timelineFocusTs))
        ? Number(this._timelineFocusTs)
        : ((this._winStart+this._winEnd)/2);
      // Do not use the window's newest edge to decide whether LIVE was crossed.
      // The initial 10-minute window has five minutes of intentional future
      // space. A small backward wheel move must preserve that space rather than
      // clamping the whole window to "now" and putting LIVE at the top.
      const crossedLive = previousFocus < now - 1 && nf >= now - 1;
      if(ns<0){const a=-ns;ns+=a;ne+=a;nf+=a;}
      this._winStart=ns;this._winEnd=ne;this._exhausted=false;
      this._timelineFocusTs=Math.max(ns,Math.min(ne,Math.round(nf)));
      if (crossedLive) {
        // Defer the live transition to the settled wheel callback so a burst
        // of wheel events cannot mount multiple live players.
        this._timelineLiveCrossed=true;
        this._scrubTarget=Math.floor(now);
        this._updateTimelineLive(); this._renderRange();
        clearTimeout(this._wt);
        this._wt=setTimeout(()=>{
          this._timelineInteracting=false;
          const wasLive=this._timelineWasLiveBeforeGesture;
          this._timelineWasLiveBeforeGesture=false;
          this._timelineLiveCrossed=false;
          this._refreshLiveFromTimeline({restart: !wasLive});
        },220);
        return;
      }
      this._scrubTarget=this._timelineFocusTs;
      this._updateTimelineLive();this._renderRange();this._renderTimelineZoomLabel();
      this._updateTimelineScrubLabel(this._scrubTarget);
      this._reconcileTimelineDuringMove();
      this._scheduleTimelineDynamicData('motion');
      clearTimeout(this._wt);this._wt=setTimeout(()=>{ this._timelineInteracting=false; this._renderTimeline(); const latest=this._scrubTarget ?? this._timelineFocusTs ?? this._winEnd; if(this._isAtLiveEdge(latest)){ this._refreshLiveFromTimeline(); return; } this._seekTimelineTarget(latest); },220);
      this._scheduleTimelineDataLoad();
    },{passive:false,signal});

    this._wireDesktopEventTimelineDrag(track,signal);
    this._renderTimelineZoomLabel();
  },

  /**
   * Ensure the visible timeline has one complete, current gesture binding set.
   *
   * Playback can temporarily hide the timeline while the dashboard layout is
   * reconfigured. Rebinding at that lifecycle boundary is safe because every
   * listener installed by `_wireScrub()` now belongs to the same AbortSignal.
   * This prevents a half-wired state where `mousedown` survives but the global
   * `mousemove`/`mouseup` listeners that actually carry the drag do not.
   */
  _refreshTimelineInteractionWiring(force=false) {
    const track=this.shadowRoot?.querySelector?.('#tl-track');
    if(!track) return false;
    const signal=this._scrubAbort?.signal;
    if(!force && this._scrubTrack===track && signal && !signal.aborted) return true;
    this._wireScrub();
    return this._scrubTrack===track && this._scrubAbort?.signal?.aborted===false;
  },

  /**
   * Allow desktop users to begin a timeline pan on top of an event preview.
   *
   * A short movement threshold preserves the event's normal click behavior;
   * once the pointer moves far enough, ownership transfers to the timeline and
   * the release commits through the same seek path used by every other scrub.
   */
  _wireDesktopEventTimelineDrag(track,signal) {
    let gesture=null;
    const options=signal?{signal}:undefined;
    const isEventSurface=(target)=>Boolean(
      target?.closest?.('.t-preview,.t-ev')
      && !target.closest('button,a,input,select,textarea,.tl-zoom-controls,.tl-playhead i')
    );

    const finish=(event,cancelled=false)=>{
      if(!gesture || (event?.pointerId!=null && event.pointerId!==gesture.pointerId)) return;
      const state=gesture;
      gesture=null;
      try {
        if(track.hasPointerCapture?.(state.pointerId)) track.releasePointerCapture(state.pointerId);
      } catch(_) {}
      if(!state.moved) return;

      this._timelineInteracting=false;
      this._scrubGestureInvalidated=false;
      track.classList?.remove?.('grab');
      this._timelineSuppressClickUntil=performance.now()+400;

      const target=this._scrubTarget??this._timelineFocusTs??this._winEnd;
      const crossedLive=this._timelineLiveCrossed||this._isAtLiveEdge(target);
      this._timelineLiveCrossed=false;
      this._timelineWasLiveBeforeGesture=false;

      if(cancelled) {
        this._renderTimeline();
        return;
      }
      if(crossedLive) this._refreshLiveFromTimeline({restart:!state.wasLive});
      else this._seekTimelineTarget(target);
      this._scheduleTimelineDataLoad();
    };

    track.addEventListener('pointerdown',(event)=>{
      if(event.pointerType!=='mouse'||event.button!==0||this._downloadRange||!isEventSurface(event.target)) return;
      gesture={
        pointerId:event.pointerId,
        startX:event.clientX,
        startY:event.clientY,
        windowStart:Number(this._winStart),
        windowEnd:Number(this._winEnd),
        focus:Number.isFinite(Number(this._timelineFocusTs))
          ? Number(this._timelineFocusTs)
          : (Number(this._winStart)+Number(this._winEnd))/2,
        wasLive:this._timelineFollowingLive===true,
        moved:false,
      };
      try { track.setPointerCapture?.(event.pointerId); } catch(_) {}
    },options);

    track.addEventListener('pointermove',(event)=>{
      if(!gesture||event.pointerId!==gesture.pointerId) return;
      const distance=Math.hypot(event.clientX-gesture.startX,event.clientY-gesture.startY);
      if(!gesture.moved&&distance<4) return;

      if(!gesture.moved) {
        gesture.moved=true;
        this._timelineInteracting=true;
        this._timelineWasLiveBeforeGesture=gesture.wasLive;
        this._timelineFollowingLive=false;
        this._timelineLiveCrossed=false;
        this._scrubGestureInvalidated=true;
        if(this._playing||this._activePlaybackCleanup) this._invalidatePlaybackForTimelineMove();
        track.classList?.add?.('grab');
      }

      event.preventDefault?.();
      event.stopPropagation?.();
      const rect=track.getBoundingClientRect();
      const height=Math.max(1,track.clientHeight||rect.height||1);
      const span=Math.max(1,gesture.windowEnd-gesture.windowStart);
      const pan=Math.round((event.clientY-gesture.startY)/height*span);
      let start=gesture.windowStart+pan;
      let end=gesture.windowEnd+pan;
      let focus=gesture.focus+pan;
      const now=Math.floor(Date.now()/1000);
      const crossedLive=gesture.focus<now-1&&focus>=now-1;

      if(start<0) {
        focus-=start;
        end-=start;
        start=0;
      }
      this._winStart=start;
      this._winEnd=end;
      this._timelineFocusTs=Math.max(start,Math.min(end,Math.round(focus)));
      this._exhausted=false;
      if(crossedLive) {
        this._timelineLiveCrossed=true;
        this._scrubTarget=now;
      } else {
        this._scrubTarget=this._timelineFocusTs;
      }

      this._updateTimelineLive();
      this._renderRange();
      this._reconcileTimelineDuringMove();
      this._scheduleTimelineDynamicData('motion');
      this._updateTimelineScrubLabel(this._scrubTarget);
    },options);

    track.addEventListener('pointerup',(event)=>finish(event,false),options);
    track.addEventListener('pointercancel',(event)=>finish(event,true),options);
    track.addEventListener('lostpointercapture',(event)=>{
      if(gesture&&event.pointerId===gesture.pointerId) finish(event,false);
    },options);
  }
};

// ── src/card/timeline/runtime.js ──
/**
 * Deferred timeline data loading, scroll pagination and status synchronization.
 */
const timelineRuntimeMethods = {
_scheduleTimelineDynamicData(mode='motion') {
    if (!this.isConnected || this._galleryMode || !this._activeCam?.entity) return;
    const isLive=mode==='live';
    const nowMs=performance.now();
    const span=Math.max(300,this._winEnd-this._winStart);
    const loadedStart=Number(this._recordingsRangeStart);
    const loadedEnd=Number(this._recordingsRangeEnd);
    const margin=Math.min(10*60,Math.max(60,span*.18));
    const loadedAt=Number(this._recordingsLoadedAt)||0;

    // If a request is already in flight, remember that the viewport changed
    // even when the old cache happens to cover it right now. The in-flight
    // response may replace that cache with a tighter interval.
    if (this._timelineDynamicActive) { this._timelineDynamicPending=true; return; }

    // During motion, don't refetch while the currently loaded interval still
    // comfortably surrounds the viewport. At LIVE, freshness matters even
    // when the requested interval overlaps, because the right edge advances.
    if (!isLive && Number.isFinite(loadedStart) && Number.isFinite(loadedEnd) &&
        loadedStart<=this._winStart-margin && loadedEnd>=this._winEnd+margin) return;
    if (isLive && loadedAt && Date.now()-loadedAt<3000) return;

    this._timelineDynamicPending=true;

    // A pending LIVE timer must never delay an active user gesture. Promote it
    // to the faster motion cadence immediately when the user starts moving.
    if (this._timelineDynamicTimer) {
      if (!(mode==='motion' && this._timelineDynamicTimerMode==='live')) return;
      clearTimeout(this._timelineDynamicTimer);
      this._timelineDynamicTimer=null;
    }

    const minGap=isLive ? 3000 : 500;
    const delay=Math.max(0,minGap-(nowMs-(this._timelineDynamicLastAt||0)));
    this._timelineDynamicTimerMode=mode;
    this._timelineDynamicTimer=setTimeout(async()=>{
      this._timelineDynamicTimer=null;
      this._timelineDynamicTimerMode='';
      if (!this.isConnected || this._galleryMode) return;
      this._timelineDynamicActive=true;
      this._timelineDynamicPending=false;
      this._timelineDynamicLastAt=performance.now();
      try {
        await this._loadWindow(true,false,true);
      } finally {
        this._timelineDynamicActive=false;
        // If the viewport moved again while the request was in flight, follow
        // it with one more throttled request for the newest position.
        if (this._timelineDynamicPending && this.isConnected) {
          this._timelineDynamicPending=false;
          this._scheduleTimelineDynamicData(this._timelineFollowingLive?'live':'motion');
        }
      }
    },delay);
  },

_scheduleTimelineDataLoad() {
    clearTimeout(this._timelineDataTimer);
    const seq=++this._timelineDataSeq;
    const entity=this._activeCam?.entity || '';
    const windowStart=this._winStart, windowEnd=this._winEnd;
    // Do not hit Frigate on every high-frequency touch/wheel burst. The
    // current window is already rendered locally; fetch once the gesture has
    // settled enough to know which range is actually needed.
    this._timelineDataTimer = setTimeout(() => {
      if (seq !== this._timelineDataSeq || entity !== this._activeCam?.entity) return;
      // The timer is only a debounce gate. _loadWindow has its own monotonic
      // request guard, so an older network response can never win.
      if (windowStart !== this._winStart || windowEnd !== this._winEnd) return;
      this._loadWindow(true);
    }, 320);
  },

_timelineTimestampAtRatio(ratio, focusTs, span) {
    const r=Math.max(0,Math.min(1,Number.isFinite(Number(ratio)) ? Number(ratio) : 0.5));
    const sp=Math.max(1,Number.isFinite(Number(span)) ? Number(span) : (this._winEnd-this._winStart));
    const f=Number.isFinite(Number(focusTs)) ? Number(focusTs) : ((this._winStart+this._winEnd)/2);
    return f + (0.5-r)*sp;
  },

_setTimelineWindowAround(anchorTs, anchorRatio, span) {
    const now=Math.floor(Date.now()/1000);
    const ratio=Math.max(0,Math.min(1,Number.isFinite(Number(anchorRatio)) ? Number(anchorRatio) : 0.5));
    const sp=Math.max(300,Math.min(86400,Math.floor(Number(span)||900)));
    const anchor=Number.isFinite(Number(anchorTs)) ? Number(anchorTs) : (this._timelineFocusTs ?? this._winEnd);

    // If timestamp A is at visual ratio r, then:
    // A = focus + (0.5 - r) * span.
    // Solve that equation for the new focus after changing span.
    let newFocus=anchor - (0.5-ratio)*sp;
    let ns=Math.floor(newFocus-sp/2);
    let ne=Math.floor(newFocus+sp/2);

    // Keep the newest edge from extending into the future. Shift the whole
    // window rather than changing its span so zoom level remains exact.
    if(ne>now){ const shift=ne-now; ns-=shift; ne-=shift; newFocus-=shift; }
    if(ns<0){ const shift=-ns; ns+=shift; ne+=shift; newFocus+=shift; }

    // Final invariant: focus stays inside the normalized window without
    // silently changing the requested zoom span.
    this._winStart=Math.floor(ns);
    this._winEnd=Math.floor(ne);
    this._timelineFocusTs=Math.max(this._winStart,Math.min(this._winEnd,Math.round(newFocus)));
    this._exhausted=false;
  },

_wireScroll() {

    const list=this.shadowRoot.querySelector('#list'); if(!list) return;
    list.addEventListener('scroll',()=>{if(this._loading||this._exhausted)return;if(list.scrollTop+list.clientHeight>=list.scrollHeight-40)this._loadOlder();});
  },

async _loadOlder() {
    const before=this._events.length?Math.floor(Math.min(...this._events.map(e=>e.start_time))):this._winStart;
    this._loading=true; const {clientId,cam}=this._cc();
    try{
      const older=await this._ws({type:'frigate/events/get',instance_id:clientId,cameras:[cam],before,limit:50});
      const arr=Array.isArray(older)?older.filter(o=>!this._events.some(e=>e.id===o.id)):[];
      if(!arr.length)this._exhausted=true; else{this._events=this._events.concat(arr);this._winStart=Math.min(this._winStart,...arr.map(e=>e.start_time));this._mergeLoadedFilterMetadata(this._cc(),arr,[]);}
    }catch(_){}
    this._loading=false; this._renderList();this._renderTimeline();this._renderRange();
  },

_syncStatus() {
    const ent=this._hass?.states?.[this._activeCam?.entity]; if(!ent) return;
    const dot=this._$('#on-dot'),lbl=this._$('#on-lbl'),title=this._$('#info-title');
    const ok=!this._cameraIsOffline();
    if(dot) dot.style.color=ok?'var(--c-on)':'var(--c-danger)';
    if(lbl) lbl.textContent=ok?'Online':'Offline';
    const tlOffline=this._$('#tl-track')?.querySelector('.tl-offline'); if(tlOffline) tlOffline.style.display=ok?'none':'flex';
    if(title) {
      const c=this._activeCam; const n=cap(camDisplayName(c)||'Camera');
      title.textContent=n;
    }
  },

_$(sel) { return this._domCache[sel] || (this._domCache[sel] = this.shadowRoot.querySelector(sel)); }
};

// ── src/card/timeline/zoom.js ──
/**
 * Timeline zoom window calculations and visible scale labels.
 *
 * The +/- controls intentionally use a small, predictable ladder instead of
 * multiplying the current window by an arbitrary factor. Pinch/trackpad zoom
 * still passes an explicit anchor and therefore preserves pointer-centered
 * behavior.
 */

const TIMELINE_SCALE_SECONDS = Object.freeze([
  60,
  5 * 60,
  10 * 60,
  30 * 60,
  45 * 60,
  60 * 60,
  3 * 60 * 60,
  6 * 60 * 60,
  12 * 60 * 60,
  24 * 60 * 60,
]);

const TIMELINE_SCALE_LABELS = new Map([
  [60, '1m'],
  [300, '5m'],
  [600, '10m'],
  [1800, '30m'],
  [2700, '45m'],
  [3600, '1h'],
  [10800, '3h'],
  [21600, '6h'],
  [43200, '12h'],
  [86400, '24h'],
]);

function timelineScaleStep(currentSpan, direction) {
  const current = Math.max(1, Number(currentSpan) || 10 * 60);

  if (direction === 'in') {
    for (let i = TIMELINE_SCALE_SECONDS.length - 1; i >= 0; i -= 1) {
      if (TIMELINE_SCALE_SECONDS[i] < current - 1) return TIMELINE_SCALE_SECONDS[i];
    }
    return TIMELINE_SCALE_SECONDS[0];
  }

  for (const span of TIMELINE_SCALE_SECONDS) {
    if (span > current + 1) return span;
  }
  return TIMELINE_SCALE_SECONDS.at(-1);
}

function timelineScaleLabel(spanSeconds) {
  const span = Math.max(1, Math.round(Number(spanSeconds) || 0));
  const exact = TIMELINE_SCALE_LABELS.get(span);
  if (exact) return exact;
  if (span < 3600) return `${Math.max(1, Math.round(span / 60))}m`;
  const hours = span / 3600;
  return Number.isInteger(hours) ? `${hours}h` : `${Math.round(hours * 10) / 10}h`;
}

function applyTimelineScale(card, spanSeconds, anchorTs, anchorRatio) {
  const span = Math.max(60, Math.min(86400, Math.round(Number(spanSeconds) || 10 * 60)));
  const hasExplicitAnchor = Number.isFinite(Number(anchorTs));
  const ratio = Number.isFinite(Number(anchorRatio))
    ? Math.max(0, Math.min(1, Number(anchorRatio)))
    : 0.5;

  if (card._timelineFollowingLive && !hasExplicitAnchor) {
    const now = Math.floor(Date.now() / 1000);
    card._winStart = Math.max(0, Math.floor(now - span / 2));
    card._winEnd = card._winStart + span;
    card._timelineFocusTs = now;
    card._scrubTarget = now;
  } else {
    const anchor = hasExplicitAnchor
      ? Number(anchorTs)
      : Number.isFinite(Number(card._timelineFocusTs))
        ? Number(card._timelineFocusTs)
        : (Number(card._winStart) + Number(card._winEnd)) / 2;

    let focus = anchor - (0.5 - ratio) * span;
    let start = Math.floor(focus - span / 2);
    let end = start + span;
    const now = Math.floor(Date.now() / 1000);

    // Historical zoom must not create a future-only tail. LIVE +/- uses the
    // centered branch above, while pointer-anchored zoom stays within now.
    if (end > now) {
      const shift = end - now;
      start -= shift;
      end -= shift;
      focus -= shift;
    }
    if (start < 0) {
      focus -= start;
      end -= start;
      start = 0;
    }

    card._winStart = start;
    card._winEnd = end;
    card._timelineFocusTs = Math.max(start, Math.min(end, Math.round(focus)));
    card._scrubTarget = card._timelineFocusTs;
  }

  card._exhausted = false;
  card._timelineZoomMax = 60; // 60x corresponds to a one-minute visible window.
  card._timelineZoom = 3600 / span;
  return span;
}

const timelineZoomMethods = {
  _zoomTimeline(factor, anchorTs, anchorRatio) {
    const currentSpan = Math.max(1, Number(this._winEnd) - Number(this._winStart));
    const direction = Number(factor || 1) >= 1 ? 'in' : 'out';
    const nextSpan = timelineScaleStep(currentSpan, direction);

    applyTimelineScale(this, nextSpan, anchorTs, anchorRatio);
    this._renderTimeline();
    this._renderRange();
    this._renderTimelineZoomLabel();
    this._scheduleTimelineDynamicData('motion');
    this._scheduleTimelineDataLoad();
  },

  _resetTimelineZoom() {
    const span = this._timelineDefaultSpanSeconds();
    this._timelineZoom = 3600 / span;

    if (this._timelineFollowingLive) {
      const now = Math.floor(Date.now() / 1000);
      this._winStart = now - span / 2;
      this._winEnd = now + span / 2;
      this._timelineFocusTs = now;
      this._scrubTarget = now;
      this._exhausted = false;
    } else {
      const anchor = this._timelineFocusTs || this._scrubTarget || (this._winStart + this._winEnd) / 2;
      this._setTimelineWindowAround(anchor, 0.5, span);
      this._scrubTarget = this._timelineFocusTs;
    }

    this._renderTimeline();
    this._renderRange();
    this._renderTimelineZoomLabel();
    this._scheduleTimelineDynamicData('motion');
    this._scheduleTimelineDataLoad();
  },

  _renderTimelineZoomLabel() {
    const element = this._$('#tl-zoom-level');
    if (!element) return;
    element.textContent = timelineScaleLabel(Number(this._winEnd) - Number(this._winStart));
  },
};

// ── src/card/timeline/playback-sync.js ──
/**
 * Timeline playhead labels, recorded-media clock synchronization, and seek dispatch.
 *
 * Methods are composed onto SightlineCard.prototype; method names are kept
 * stable so existing card behavior and tests remain unchanged.
 */
const timelinePlaybackSyncMethods = {
  _updateTimelineScrubLabel(target) {
    const t=Math.max(0,Math.floor(Number(target)||0));
    if(!Number.isFinite(t)) return;
    const range=this._$('#tl-range');
    if(range) range.textContent=`${new Date(t*1000).toLocaleDateString([],{month:'short',day:'2-digit'}).toUpperCase()} · ${this._timeMinute(t)}`;
  },

  _updateTimelinePlaybackTime(ts) {
    // Keep fractional media time internally so the timeline follows the actual
    // decoder clock instead of a once-per-second rounded value. The label is
    // rounded only for display.
    const t=Number(ts);
    if(!Number.isFinite(t) || t<0 || !this.isConnected) return;

    const previousFocus=Number.isFinite(Number(this._timelineFocusTs))
      ? Number(this._timelineFocusTs)
      : t;
    let start=Number(this._winStart);
    let end=Number(this._winEnd);
    const span=Math.max(1,end-start);

    // The playhead is intentionally fixed at the visual center of the track.
    // Therefore playback progress must translate the viewport by the same
    // amount as the decoder clock. Previously only _timelineFocusTs changed,
    // which let Chromium advance the HH:MM:SS pill while the scale, recording
    // rail and detections remained at their old wall-clock positions until a
    // later render happened.
    if(!this._timelineFollowingLive && !this._timelineInteracting && Number.isFinite(start) && Number.isFinite(end)) {
      const delta=t-previousFocus;
      if(Math.abs(delta)>0.0001) {
        start+=delta;
        end+=delta;
        if(start<0) {
          end-=start;
          start=0;
        }
        this._winStart=start;
        this._winEnd=end;
      }
    }

    this._timelineFocusTs=t;
    this._scrubTarget=t;
    this._updateTimelineDateLabel?.(t);

    const track=this._$('#tl-track');
    if(!track) return;

    const s=Number(this._winStart);
    const e=Number(this._winEnd);
    const ph=track.querySelector('.tl-playhead');
    if(ph) {
      const label=ph.querySelector('span');
      if(label) label.textContent=this._timelineTime(Math.round(t));
    }
    const range=track.querySelector('#tl-range');
    if(range) range.textContent=`${new Date(t*1000).toLocaleDateString([],{month:'short',day:'2-digit'}).toUpperCase()} · ${this._timeMinute(Math.round(t))}`;

    if(!this._timelineFollowingLive && !this._timelineInteracting) {
      // Reposition existing timeline nodes immediately from the same media-clock
      // sample. Reconciliation is throttled separately, so new/expired event
      // nodes appear without rebuilding the whole timeline on every timeupdate.
      this._updateTimelineLive?.();
      this._reconcileTimelineDuringMove?.();
      this._scheduleTimelineDynamicData?.('motion');
    }

    // Defensive recovery for discontinuities where the source jumps beyond the
    // translated viewport (for example an HLS discontinuity or restored seek).
    if(t<s || t>e) {
      const half=span/2;
      this._winStart=Math.max(0,t-half);
      this._winEnd=this._winStart+span;
      this._updateTimelineLive?.();
      this._renderTimeline(false);
    }
  },

  _wireTimelineMediaClock(video, originTs, token) {
    if(!video || video.dataset.frigateTimelineClock==='1') return;
    video.dataset.frigateTimelineClock='1';
    // This clock is attached only to event clips. A clip has its own media-time
    // origin at ev.start_time, so its wall-clock timestamp is always
    // `eventStart + currentTime`. Never consult _playingRecordings here: that
    // state belongs to the hourly recording player and can survive just long
    // enough during a transition to map clip currentTime=0 to the first second
    // of that hour.
    const mediaOrigin=Number(originTs);
    const sync=()=>{
      if(token!=null && this._playSeq!==token) return;
      const rel=Number(video.currentTime);
      if(!Number.isFinite(rel) || rel<0 || !Number.isFinite(mediaOrigin)) return;
      const absolute=mediaOrigin+rel;
      if(!Number.isFinite(absolute)) return;
      this._updateTimelinePlaybackTime(absolute);
    };
    ['timeupdate','playing','seeked','seeking','pause','waiting','stalled','canplay'].forEach(ev=>video.addEventListener(ev,sync));
    sync();
  },

  _attachTimelineMediaClock(player, originTs, token) {
    let tries=0;
    const attach=()=>{
      if(token!=null && this._playSeq!==token) return;
      const video=this._findVideo(player);
      if(video) { this._wireTimelineMediaClock(video,originTs,token); return; }
      if(++tries<160) setTimeout(attach,75);
    };
    attach();
  },

  async _seekTimelineTarget(target) {
    const t=Math.max(0,Math.floor(Number(target)));
    if(!Number.isFinite(t)) return;
    const seq=++this._timelineSeekSeq;
    this._scrubTarget=t;
    const hour=this._hourStart(t);

    // Desktop stable-HLS session reuse.
    const current=this._playbackSession;
    if(current && t>=current.sourceStart && t<current.sourceEnd && current.video && current.token===this._playSeq) {
      const offset=this._frigateSeekPosition(t,current.recordings,current.inpointOffset);
      if(Number.isFinite(offset)) {
        current.targetTs=t;
        current.pendingSeek=offset;
        this._playing={rec:t};
        this._updateTimelinePlaybackTime(t);
        if(typeof current.requestSeek==='function') current.requestSeek(offset,t);
        return;
      }
    }

    // Restore the older v52 iOS behavior: when the hour MP4 is already mounted,
    // seek the native video directly instead of rebuilding the media source or
    // waiting on an HLS seek state machine. This is the path that previously felt
    // immediate on iPhone/iPad.
    if(this._isIOSRecordingPlatform()) {
      const currentVideo=this._findVideo(this.shadowRoot.querySelector('#viewer'));
      const sourceStart=Number.isFinite(this._playingSourceStart)?this._playingSourceStart:hour;
      const sourceEnd=Number.isFinite(this._playingSourceEnd)?this._playingSourceEnd:hour+3600;
      if(currentVideo && this._playingHour===hour && t>=sourceStart && t<sourceEnd &&
         Number.isFinite(currentVideo.duration) && currentVideo.duration>0 &&
         Array.isArray(this._playingRecordings) && this._playingRecordings.length) {
        const offset=this._frigateSeekPosition(t,this._playingRecordings,this._playingInpointOffset||0);
        if(Number.isFinite(offset)) {
          try {
            currentVideo.currentTime=Math.min(offset,Math.max(0,currentVideo.duration-0.05));
            currentVideo.muted=true;
            currentVideo.play().catch(()=>{});
          } catch(_) {}
          this._playing={rec:t};
          this._scrubTarget=t;
          this._updateTimelinePlaybackTime(t);
          this._renderStreamCtrl();
          return;
        }
      }
    }

    await this._showRecording(hour,hour+3600,t);
    if(seq!==this._timelineSeekSeq) return;
  }
};

// ── src/card/timeline-interaction.js ──
/**
 * Public method-group barrel for timelineInteractionMethods.
 *
 * Keeping this entry point stable avoids coupling callers to the internal
 * feature layout while allowing each concern to live in a focused module.
 */
const timelineInteractionMethods = Object.assign(
  {},
  timelineFilterMethods,
  timelineCalendarMethods,
  timelineGestureMethods,
  timelineRuntimeMethods,
  timelineZoomMethods,
  timelinePlaybackSyncMethods,
);

// ── src/card/timeline/model.js ──
/**
 * Timeline event model, clustering, labels, recording gaps, and derived filter metadata.
 *
 * Methods are composed onto SightlineCard.prototype; method names are kept
 * stable so existing card behavior and tests remain unchanged.
 */
const timelineModelMethods = {
_timelineLabelInfo(ev) {
    const raw = this._normalizeObjectLabel(ev?.label ?? ev?.data?.label ?? '').toLowerCase();
    const aliases = {
      vehicle: 'vehicle',
      vehicles: 'vehicle',
      person: 'person',
      car: 'car',
      truck: 'truck',
      bus: 'bus',
      motorcycle: 'motorcycle',
      bicycle: 'bicycle',
      dog: 'dog',
      cat: 'cat',
      bird: 'bird',
      horse: 'horse',
      package: 'package',
      face: 'face',
      motion: 'motion',
    };
    const key = aliases[raw] || raw || 'motion';
    const display = key === 'motion' ? 'Motion' : cap(key);
    const sub = ev?.sub_label ? String(ev.sub_label).trim() : '';
    return { key, display, sub };
  },

_timelineEvents() {
    const seen = new Set();
    const out = [];
    for (const ev of this._allDisplayEvents()) {
      if (!ev || ev.id == null || seen.has(ev.id)) continue;
      const start = Number(ev.start_time);
      if (!Number.isFinite(start)) continue;
      // False positives are still useful in the raw Frigate event list, but
      // should not dominate the visual timeline.
      if (ev.false_positive === true) continue;
      if (!this._eventMatchesLiveFilter(ev)) continue;
      const info = this._timelineLabelInfo(ev);
      if (!info.key) continue;
      seen.add(ev.id);
      this._timelineEventCache.set(String(ev.id), ev);
      out.push({ ...ev, _tl: info });
    }
    return out;
  },

_timelineClusters(events) {
    const sorted=[...events].sort((a,b)=>Number(a.start_time)-Number(b.start_time));
    const clusters=[];
    for (const ev of sorted) {
      const info=ev._tl||this._timelineLabelInfo(ev);
      const start=Number(ev.start_time);
      const end=Math.max(start,Number(ev.end_time)||start);
      const last=clusters[clusters.length-1];
      const sameLabelGap=this._config?.timeline?.clustering ? Number(this._config.timeline.same_label_cluster_seconds||0) : 0;
      if (sameLabelGap>0 && last && last.labelKey===info.key && start <= last.end + sameLabelGap) {
        last.events.push(ev);
        last.end=Math.max(last.end,end);
        if (start > Number(last.representative.start_time)) last.representative=ev;
      } else {
        clusters.push({
          labelKey:info.key,
          label:info.display,
          sub:info.sub,
          start,
          end,
          representative:ev,
          events:[ev]
        });
      }
    }
    return clusters.sort((a,b)=>Number(b.representative.start_time)-Number(a.representative.start_time));
  },

_timelineClusterAnchor(cluster, start, end) {
    const visible=(cluster?.events||[])
      .filter(ev=>{
        const ts=Number(ev?.start_time);
        return Number.isFinite(ts) && ts>=start && ts<=end;
      })
      .sort((a,b)=>Number(a.start_time)-Number(b.start_time));
    if(!visible.length) return null;
    if(this._timelineSelected) {
      const selected=visible.find(ev=>String(ev.id)===String(this._timelineSelected));
      if(selected) return selected;
    }
    return visible[0];
  },

_timelineVisualGroups(items, span, trackPx) {
    const px=Math.max(320,Number(trackPx)||420);
    const secondsPerPx=Math.max(.001,Number(span)||1)/px;
    const desiredSeparationPx=Math.max(24,Math.min(36,px*.065));
    const configuredMax=Math.max(0,Number(this._config?.timeline?.visual_cluster_max_seconds ?? 60));
    const zoomCap=Math.min(configuredMax,span<=15*60 ? 15 : span<=60*60 ? 30 : 60);
    const threshold=this._config?.timeline?.clustering===false || zoomCap<=0
      ? 0 : Math.max(1,Math.min(zoomCap,desiredSeparationPx*secondsPerPx));
    const sorted=[...(items||[])].sort((a,b)=>Number(a.ts)-Number(b.ts));
    const groups=[];
    for(const item of sorted) {
      const ts=Number(item?.ts);
      if(!Number.isFinite(ts)) continue;
      const last=groups[groups.length-1];
      // Do not chain a long stream of detections into one giant cluster: every
      // member must remain within the threshold of the group's first moment.
      if(threshold>0 && last && ts-last.startTs<=threshold) {
        last.items.push(item);
        last.endTs=Math.max(last.endTs,ts,Number(item.cluster?.end)||ts);
      } else {
        groups.push({items:[item],startTs:ts,endTs:Math.max(ts,Number(item.cluster?.end)||ts)});
      }
    }
    return groups.map(group=>{
      const selected=this._timelineSelected
        ? group.items.find(item=>item.cluster?.events?.some(ev=>String(ev.id)===String(this._timelineSelected)))
        : null;
      // Prefer the selected event when present; otherwise use the newest real
      // detection in the burst. The marker always points at a genuine event
      // timestamp, never an invented midpoint.
      const anchorItem=selected || group.items[group.items.length-1];
      const seenIds=new Set(), events=[];
      for(const item of group.items) for(const ev of (item.cluster?.events||[])) {
        const id=String(ev?.id ?? '');
        if(!id || seenIds.has(id)) continue;
        seenIds.add(id); events.push(ev);
      }
      const labels=[];
      for(const item of [anchorItem,...group.items]) {
        const info=item?.ev?._tl||this._timelineLabelInfo(item?.ev);
        if(info?.key && !labels.some(x=>x.key===info.key)) labels.push(info);
      }
      return {
        ...group,
        anchorItem,
        ts:Number(anchorItem.ts),
        events,
        labels,
        totalDetections:events.length,
        visualCluster:group.items.length>1
      };
    });
  },

_timelineResponsiveMetrics(track) {
    const width=Math.max(280,Number(track?.clientWidth)||Number(track?.getBoundingClientRect?.().width)||320);
    // Scrypted-style glyphs are deliberately much larger than the rail marker.
    // Scale from the rendered track width (CSS pixels), so a narrow phone/card
    // column and a wide desktop dashboard keep the same visual proportions on
    // both standard and Retina/high-DPI displays.
    const glyphMin=Number(this._config?.timeline?.glyph_min_px ?? 20);
    const glyphMax=Math.max(glyphMin,Number(this._config?.timeline?.glyph_max_px ?? 30));
    const glyphPx=Math.round(Math.max(glyphMin,Math.min(glyphMax,glyphMin+((width-320)/420)*(glyphMax-glyphMin))));
    const glyphGapPx=Math.round(Math.max(6,Math.min(10,6+((width-320)/500)*4)));
    const glyphOffsetPx=Math.round(Math.max(38,Math.min(56,38+((width-320)/500)*18)));
    const eventLanePx=Math.round(Math.max(90,Math.min(190,width*.26)));
    const dotPx=Math.round(Math.max(14,Math.min(18,14+((width-320)/520)*4)));
    const glyphStartFromRail=Math.max(0,glyphOffsetPx-(dotPx/2));
    const laneForGlyphs=Math.max(glyphPx,eventLanePx-glyphStartFromRail-8);
    const configMaxGlyphs=Math.max(1,Math.round(Number(this._config?.timeline?.max_glyphs ?? 3)));
    const maxGlyphs=Math.max(1,Math.min(configMaxGlyphs,Math.floor((laneForGlyphs+glyphGapPx)/(glyphPx+glyphGapPx))));
    return {width,glyphPx,glyphGapPx,glyphOffsetPx,eventLanePx,dotPx,maxGlyphs};
  },

_timelineThumb(ev) {
    const id=String(ev.id);
    const key=`${String(ev?.camera||this._cc().cam||'')}:${id}`;
    let url=this._timelineThumbCache.get(key);
    if (!url) {
      url=this._mediaForEvent(ev,'thumbnail.jpg');
      this._timelineThumbCache.set(key,url);
    }
    return url;
  },

_dur(ev) { return Math.max(1,Math.round((ev.end_time||Date.now()/1000)-ev.start_time)); },

_filterMetadataStates() {
    if(this._eventsMode==='all') return this._config.cameras.map(c=>this._camCache[c.entity]).filter(Boolean);
    return [this._cc()].filter(Boolean);
  },

_zones() {
    const z=new Set();
    for(const cc of this._filterMetadataStates()) for(const value of (cc.filterZones||[])) if(value) z.add(String(value));
    this._allDisplayEvents().forEach(e=>this._eventZoneList(e).forEach(x=>z.add(x)));
    return [...z].sort((a,b)=>String(a).localeCompare(String(b)));
  },

_faces() {
    const f=new Set();
    for(const cc of this._filterMetadataStates()) for(const value of (cc.filterFaces||[])) if(value) f.add(String(value));
    this._allDisplayEvents().forEach(e=>this._eventFaceList(e).forEach(x=>f.add(x)));
    return [...f].sort((a,b)=>String(a).localeCompare(String(b)));
  },

_labels() {
    const l=new Set();
    for(const cc of this._filterMetadataStates()) for(const value of (cc.filterLabels||[])) {
      const label=this._normalizeObjectLabel(value); if(label) l.add(label);
    }
    this._allDisplayEvents().forEach(e=>{ const label=this._normalizeObjectLabel(e?.label); if(label) l.add(label); });
    return [...l].sort((a,b)=>String(a).localeCompare(String(b)));
  },

_filtered() {
    let list=this._allDisplayEvents();
    // The browse tabs intentionally use different look-back windows:
    // Recent Events = 3h; Clips/Snapshots = 24h. Recordings and Reviews use
    // the 24h timeline window directly. Keeping the 24h data window loaded
    // lets the other tabs switch instantly without changing the playback
    // engine that is known to work on iOS.
    const now=Math.floor(Date.now()/1000);
    if(this._tab==='live') list=list.filter(e=>Number(e.start_time)>=now-3*60*60);
    if(this._tab==='clips') list=list.filter(e=>e.has_clip && Number(e.start_time)>=now-24*60*60);
    else if(this._tab==='snapshot') list=list.filter(e=>e.has_snapshot && Number(e.start_time)>=now-24*60*60);
    list=list.filter(e=>this._eventMatchesLiveFilter(e));
    return list;
  },

_mergeRecs(recs) {
    if(!recs.length) return [];
    const segs=[...recs].sort((a,b)=>a.start_time-b.start_time); const out=[]; let cur={...segs[0]};
    for(let i=1;i<segs.length;i++){const s=segs[i];const ce=cur.end_time||cur.start_time;if(s.start_time-ce<=60){cur.end_time=Math.max(ce,s.end_time||s.start_time);cur.events=(cur.events||0)+(s.events||0);}else{out.push(cur);cur={...s};}}
    out.push(cur); return out;
  },

_timelineRecordingGaps(start, end) {
    if (!this._recordingsLoaded) return [];
    const requestedStart=Math.max(0,Number(start)||0);
    const now=Math.floor(Date.now()/1000);
    // Near LIVE, Frigate's newest recording segment may not be finalized yet
    // even though the camera is recording normally. Also, the visual LIVE
    // window advances every second while recordings refresh on a slower timer.
    // Never declare this fresh tail a real gap. Keep it UNKNOWN until the next
    // successful recordings/get has had enough time for the segment to settle.
    // LIVE data is now refreshed by the moving-window follower every ~3s.
    // Keep a short safety tail for Frigate segment finalization, but no longer
    // tie the visual gap delay to the much slower full-card refresh setting.
    const liveFreshnessHoldback=this._timelineFollowingLive ? 25 : 0;
    const confirmedNow=Math.max(0,now-liveFreshnessHoldback);
    const requestedEnd=Math.min(Number(end)||0,confirmedNow);
    if (!(requestedEnd>requestedStart)) return [];

    // A recordings/get response only proves coverage for the exact interval
    // that was queried. During a fast wheel/touch fling the visual window can
    // outrun the debounced network request. Previously the stale recording
    // array contained no rows for that new viewport, so the entire viewport
    // was incorrectly painted red until another slower movement caused data
    // to arrive. Treat time outside the last successful query as UNKNOWN, not
    // as missing retained footage.
    const loadedStart=Number(this._recordingsRangeStart);
    const loadedEnd=Number(this._recordingsRangeEnd);
    if (!Number.isFinite(loadedStart) || !Number.isFinite(loadedEnd) || loadedEnd<=loadedStart) return [];

    const s=Math.max(requestedStart,loadedStart);
    const e=Math.min(requestedEnd,loadedEnd,now);
    if (!(e>s)) return [];

    const recs=this._mergeRecs(Array.isArray(this._recordings)?this._recordings:[])
      .map(r=>({start:Number(r.start_time),end:Number(r.end_time||r.start_time)}))
      .filter(r=>Number.isFinite(r.start)&&Number.isFinite(r.end)&&r.end>s&&r.start<e)
      .sort((a,b)=>a.start-b.start);

    // An empty result is a genuine gap only inside the interval for which the
    // server has already answered. Unknown leading/trailing viewport time is
    // deliberately left unpainted until its request completes.
    if (!recs.length) return [{key:`empty:${Math.floor(s)}:${Math.floor(e)}`,start:s,end:e}];

    const gaps=[];
    let cursor=s;
    let previousEnd=null;
    for (const rec of recs) {
      const a=Math.max(s,rec.start);
      const b=Math.min(e,rec.end);
      if (a>cursor) {
        const leading=previousEnd==null;
        gaps.push({
          key:leading?`lead:${Math.floor(rec.start)}`:`gap:${Math.floor(previousEnd)}:${Math.floor(rec.start)}`,
          start:cursor,
          end:a
        });
      }
      cursor=Math.max(cursor,b);
      previousEnd=Math.max(previousEnd??b,b);
      if (cursor>=e) break;
    }
    if (cursor<e) gaps.push({key:`trail:${Math.floor(previousEnd??cursor)}`,start:cursor,end:e});
    return gaps.filter(g=>g.end-g.start>0.5);
  },

_timelineNodeKey(el) {
    if (el.classList.contains('t-ev')) return `ev:${el.dataset.tick||''}`;
    if (el.classList.contains('t-preview')) return `preview:${el.dataset.eventId||''}`;
    if (el.classList.contains('t-rec')) return `rec:${el.dataset.start||''}:${el.dataset.end||''}`;
    if (el.classList.contains('tl-no-recording')) return `norec:${el.dataset.gap||el.dataset.start||''}`;
    if (el.classList.contains('tl-scale-mark')) return `scale:${el.dataset.ts||''}`;
    if (el.classList.contains('tl-live-line')) return 'live-line';
    if (el.classList.contains('tl-download-range')) return 'download-range';
    if (el.classList.contains('tl-playhead')) return 'playhead';
    if (el.classList.contains('tl-offline')) return 'offline';
    return null;
  }
};

// ── src/card/timeline/live-follow.js ──
/**
 * LIVE-edge detection, live refresh, and moving timeline-window behavior.
 *
 * Methods are composed onto SightlineCard.prototype; method names are kept
 * stable so existing card behavior and tests remain unchanged.
 */
const timelineLiveMethods = {
_isAtLiveEdge(ts = this._timelineFocusTs) {
    const now = Math.floor(Date.now()/1000);
    return Number.isFinite(Number(ts)) && Number(ts) >= now - 2;
  },

_refreshLiveFromTimeline(opts={}) {
    // Crossing the newest/live edge is an explicit request to return to live.
    // Only remount the WebRTC player when we were actually in recorded
    // playback. If the user started from an already-live stream, keep that
    // healthy player alive; remounting it on the release event creates a race
    // with ha-camera-stream and is the source of the intermittent
    // 'Unable to start stream' state seen after timeline drags.
    const restart=opts.restart!==false;
    this._timelineFollowingLive=true;
    this._timelineInteracting=false;
    this._resetTimelineToNow10m();
    if (restart) {
      this._showLive();
    } else {
      this._playing=null;
      this._playingHour=null;
      this._playingSourceStart=null;
      this._playingSourceEnd=null; this._playingRecordings=[]; this._playingInpointOffset=0;
      this._scrubTarget=this._timelineFocusTs;
      this._galleryMode='';
      this._syncResponsiveWorkspace();
      const viewer=this.shadowRoot.querySelector('#viewer');
      if(viewer){viewer.innerHTML='';viewer.style.display='none';}
      const engine=this.shadowRoot.querySelector('#engine');
      if(engine) engine.style.display='block';
      const timeline=this.shadowRoot.querySelector('#timeline-view');
      if(timeline) timeline.style.display='';
      this._clearStatusOverlay();
      this._renderStreamCtrl();
    }
    this._loadWindow(true);
    requestAnimationFrame(() => {
      this._renderTimeline(true);
      this._renderRange();
      this._renderTimelineZoomLabel();
    });
  },

_updateTimelineLive() {
    const track=this._$('#tl-track'); if(!track) return;
    track.classList.toggle('following-live', !!this._timelineFollowingLive);
    let s=this._winStart,e=this._winEnd;
    const nowTs=Math.floor(Date.now()/1000);
    // LIVE is a true moving anchor. On the live view the scrubber stays exactly
    // on top of the red LIVE line and its HH:MM:SS value advances with the clock.
    // Once the user scrubs, _timelineFollowingLive is false and the selected
    // playback timestamp is left untouched.
    if (this._timelineFollowingLive && !this._timelineInteracting) {
      // Follow LIVE without destroying the user's zoom level. The previous
      // implementation hard-coded a 10-minute viewport here on every clock
      // update, so clicking +/- appeared to do nothing: _zoomTimeline changed
      // the span, then the next LIVE tick immediately restored +/- 5 minutes.
      // Preserve the currently selected span and only translate it forward
      // with the moving LIVE playhead.
      const currentSpan=Math.max(5*60,Math.min(24*60*60,Number(this._winEnd)-Number(this._winStart)||10*60));
      const half=currentSpan/2;
      s=Math.floor(nowTs-half);
      e=Math.floor(nowTs+half);
      if(s<0){e-=s;s=0;}
      this._winStart=s;
      this._winEnd=e;
      this._timelineFocusTs=nowTs;
      this._scrubTarget=nowTs;
      this._timelineZoom=Math.max(this._timelineZoomMin,Math.min(this._timelineZoomMax,3600/currentSpan));
    }
    const span=Math.max(1,e-s);
    // When the selected playhead is at LIVE, keep its wall-clock timestamp
    // moving with real time. Do this from the same update path as the LIVE
    // marker so the HH:MM:SS label cannot get stuck on the initial second.
    let focus=Number.isFinite(Number(this._timelineFocusTs)) ? Number(this._timelineFocusTs) : nowTs;
    if (this._timelineFollowingLive && !this._timelineInteracting) {
      focus=nowTs;
      this._timelineFocusTs=nowTs;
      this._scrubTarget=nowTs;
    }
    const yPct = ts => Math.max(0,Math.min(100,50 + ((focus-Number(ts))/span)*100));
    const liveLine=track.querySelector('.tl-live-line');
    if (liveLine) {
      if (nowTs >= s && nowTs <= e) {
        liveLine.style.display='block';
        liveLine.style.top=`${yPct(nowTs)}%`;
      } else {
        liveLine.style.display='none';
      }
    }
    const events=this._timelineEvents();
    const byId=new Map(events.map(ev=>[String(ev.id),ev]));

    // O(1) event lookup during every animation frame. More importantly, do
    // not clamp stale nodes to 0/100% when their timestamp has moved outside
    // the viewport. That clamp was the cause of the post-zoom "stuck event"
    // artifact: an old marker/card remained pinned to the screen edge until
    // the timeline eventually crossed its original timestamp again.
    track.querySelectorAll('.t-ev').forEach(el=>{
      const ev=byId.get(String(el.dataset.tick));
      const a=Number(el.dataset.start);
      const b=Number(el.dataset.end);
      const anchor=Number.isFinite(Number(el.dataset.ts)) ? Number(el.dataset.ts) : Number(ev?.start_time);
      const overlaps=Number.isFinite(a)&&Number.isFinite(b) ? (b>=s && a<=e) : !!ev;
      // Never pin a stale event to the top/bottom edge. Its duration may still
      // overlap the window, but the class glyph belongs at its real timestamp.
      // Once that anchor leaves the viewport, hide it until a full reconcile
      // promotes a new in-window detection from the same cluster.
      if(!ev || !overlaps || !Number.isFinite(anchor) || anchor<s || anchor>e) {
        el.style.visibility='hidden'; el.style.pointerEvents='none'; return;
      }
      el.style.visibility=''; el.style.pointerEvents='';
      el.style.top=`${yPct(anchor)}%`;
    });
    track.querySelectorAll('.t-preview').forEach(el=>{
      const ev=byId.get(String(el.dataset.eventId));
      if(!ev) { el.style.visibility='hidden'; el.style.pointerEvents='none'; return; }
      const anchor=Number.isFinite(Number(el.dataset.ts)) ? Number(el.dataset.ts) : Number(ev.start_time);
      if(!Number.isFinite(anchor) || anchor<s || anchor>e) {
        el.style.visibility='hidden'; el.style.pointerEvents='none'; return;
      }
      el.style.visibility=''; el.style.pointerEvents='';
      const trackPx=Math.max(track.clientHeight||420,360);
      const cardH=el.offsetHeight||92;
      const y=(yPct(anchor)/100)*trackPx;
      el.style.top=`${y-cardH/2}px`;
    });
    track.querySelectorAll('.t-rec').forEach(el=>{
      const a=Number(el.dataset.start), b=Number(el.dataset.end); if(!Number.isFinite(a)||!Number.isFinite(b)) return;
      const top=yPct(Math.min(b,e));
      const h=Math.max(.45,((Math.min(b,e)-Math.max(a,s))/span)*100);
      el.style.top=`${top}%`; el.style.height=`${h}%`;
    });
    track.querySelectorAll('.tl-no-recording').forEach(el=>{
      const a=Number(el.dataset.start), b=Number(el.dataset.end);
      const loadedStart=Number(this._recordingsRangeStart), loadedEnd=Number(this._recordingsRangeEnd);
      if(!Number.isFinite(loadedStart)||!Number.isFinite(loadedEnd)||loadedEnd<=loadedStart){el.style.display='none';return;}
      if(!Number.isFinite(a)||!Number.isFinite(b)||b<s||a>e||b<loadedStart||a>loadedEnd){el.style.display='none';return;}
      const clippedA=Math.max(a,s,loadedStart), clippedB=Math.min(b,e,loadedEnd,Math.floor(Date.now()/1000));
      if(clippedB<=clippedA){el.style.display='none';return;}
      el.style.display='block';
      const top=yPct(clippedB);
      const h=Math.max(.55,((clippedB-clippedA)/span)*100);
      el.style.top=`${top}%`; el.style.height=`${h}%`;
    });
    // The scale labels are part of the moving timeline, not a static axis.
    // During a scroll the window timestamps change every frame. The previous
    // implementation only moved the old labels, leaving e.g. 06:52–07:07
    // labels attached to a newly scrolled 07:00–07:15 window. Zoom caused a
    // full render and therefore appeared to "fix" the problem.
    // Reuse the existing label nodes whenever possible so this stays cheap on
    // iOS while keeping the labels mathematically synchronized with the window.
    this._syncTimelineScaleNodes(track, s, e, span, focus, yPct);

    const ph=track.querySelector('.tl-playhead');
    if(ph) {
      const label=ph.querySelector('span');
      if(label) label.textContent=this._timelineTime(focus);
      // Keep the dedicated scrubber/current-time readout in sync as well.
      // This is intentionally a text-only update; it does not rebuild the
      // timeline or disturb an active drag/scroll gesture.
      const range=track.querySelector('#tl-range');
      if(range && this._timelineFollowingLive && !this._timelineInteracting) {
        range.textContent=`${new Date(focus*1000).toLocaleDateString([],{month:'short',day:'2-digit'}).toUpperCase()} · ${this._timeMinute(focus)}`;
      }
    }
  }
};

// ── src/card/timeline/render.js ──
/**
 * Timeline, legend, summary, scale, and incremental DOM rendering.
 *
 * Methods are composed onto SightlineCard.prototype; method names are kept
 * stable so existing card behavior and tests remain unchanged.
 */
const timelineViewMethods = {
_renderAll() {
    // A full-card render is especially dangerous while iOS owns a native
    // date/time picker. Defer it just like gallery/filter paints so no ancestor
    // text, class, timeline or height mutation can dismiss the system popover.
    if(this._mediaPickerActive && this._galleryMode){
      this._mediaPickerPendingGalleryRender=true;
      return;
    }
    this._renderStats();this._renderLatest();this._renderTimeline();this._renderLegend();this._renderRange();this._renderList();this._syncStatus();this._renderCamSwitcher();if(this._cardWidth>=560)this._syncColHeight();
  },

_renderStats() { const el=this._$('#ev-count'); if(el) el.textContent=String(this._tab==='live'?this._filtered().length:this._allDisplayEvents().length); },

_renderRange() {
    const el=this._$('#tl-range'); if(!el) return;
    const span=this._winEnd-this._winStart; const fmt=t=>this._timeMinute(t);
    if(span<=DAY+60) el.textContent=`${new Date(this._winEnd*1000).toLocaleDateString([],{day:'2-digit',month:'short'})} · ${fmt(this._winStart)}–${this._isNowWindow()?'now':fmt(this._winEnd)}`;
    else el.textContent=`${new Date(this._winStart*1000).toLocaleDateString([],{day:'2-digit',month:'short'})} – ${this._isNowWindow()?'now':new Date(this._winEnd*1000).toLocaleDateString([],{day:'2-digit',month:'short'})}`;
  },

_renderLegend() {
    const el=this._$('#legend'); if(!el) return;
    if(this._config?.timeline?.show_legend===false){el.innerHTML='';el.style.display='none';return;}
    el.style.display='';
    const labels=[...new Set(this._timelineEvents().map(ev=>(ev._tl||this._timelineLabelInfo(ev)).key))].sort();
    let html=labels.map(l=>`<span class="lg tl-detection-legend"><i>${timelineGlyph(l)}</i>${this._filterDisplayName('label',l)}</span>`).join('');
    if (this._eventsMode==='all') {
      this._config.cameras.forEach((c,i)=>{ html+=`<span class="lg"><i style="background:${CAM_COLORS[i%CAM_COLORS.length].replace('.5','1').replace('rgba','rgb').replace(',1)',')')}"></i>${cap(camDisplayName(c))} rec</span>`; });
    } else {
      html+=`<span class="lg"><i style="background:${CAM_COLORS[0].replace('.5','1').replace('rgba','rgb').replace(',1)',')')}"></i>Rec</span>`;
    }
    el.innerHTML=html;
  },

_renderLatest() {
    const row=this._$('#latest-row'); if(!row) return;
    const events=this._tab==='live'?this._filtered():this._allDisplayEvents();
    if(!events.length||this._viewMode==='grid'){ row.style.display='none'; return; }
    row.style.display='block';
    row.innerHTML=`<div class="latest-label"><span class="section-label">Latest event</span></div>
      <div class="latest-body">${this._eventCardHTML(events[0],false,true)}</div>`;
  },

_time(ts) { return this._timeMinute(ts); },

_timelineScaleTime(ts) { return this._timeMinute(ts); },

_timelineTime(ts) { return this._timeSec(ts); },

_syncTimelineScaleNodes(track, s, e, span, focus, yPct) {
    const step=span<=900 ? 60 : span<=1800 ? 2*60 : span<=3600 ? 5*60 : span<=7200 ? 10*60 : 30*60;
    const first=Math.ceil(s/step)*step;
    const count=Math.max(0,Math.floor((e-first)/step)+1);
    let nodes=[...track.querySelectorAll('.tl-scale-mark')];

    // Zoom changes the required number of ticks. Reconcile the node count only
    // when necessary; normal scrolling just changes their timestamps in place.
    if(nodes.length!==count) {
      const old=nodes;
      old.forEach(n=>n.remove());
      const frag=document.createDocumentFragment();
      nodes=[];
      for(let i=0;i<count;i++) {
        const el=document.createElement('div');
        el.className='tl-scale-mark';
        el.innerHTML='<span></span><i></i>';
        frag.appendChild(el);
        nodes.push(el);
      }
      track.appendChild(frag);
    }

    nodes.forEach((el,i)=>{
      const ts=first+i*step;
      const d=new Date(ts*1000);
      const isHour=d.getMinutes()===0;
      el.dataset.ts=String(ts);
      el.classList.toggle('hour',isHour);
      const label=el.querySelector('span');
      if(label) label.textContent=this._timelineScaleTime(ts);
      el.style.top=`${yPct(ts)}%`;
    });
  },

_renderTimeline(forceFull=false) {
    const track=this._$('#tl-track'); if(!track) return;
    track.classList.toggle('following-live', !!this._timelineFollowingLive);
    const s=this._winStart,e=this._winEnd,span=Math.max(1,e-s);
    if(!Number.isFinite(Number(this._timelineFocusTs))) this._timelineFocusTs=e;
    const focus=Number.isFinite(Number(this._timelineFocusTs)) ? Number(this._timelineFocusTs) : e;
    // Cluster the complete loaded event set first, then crop clusters to the
    // viewport. Clustering only visible events changes a cluster's identity at
    // the viewport edge after zoom/pan and can leave an old thumbnail/marker
    // visually pinned until the window crosses that event again.
    const clusters=this._timelineClusters(this._timelineEvents())
      .filter(cluster=>Number(cluster.end)>=s && Number(cluster.start)<=e);
    // Scrypted-style centered playhead: the selected wall-clock time sits at
    // the visual center while the timeline itself scrolls underneath it.
    const yPct = ts => Math.max(0,Math.min(100,50 + ((focus-Number(ts))/span)*100));
    let html='';

    // Scrypted-style recording ribbon: a single blue activity rail behind the
    // event markers. Newest time is always at the top.
    if (this._eventsMode==='all') {
      this._config.cameras.forEach((c,ci)=>{
        const cc=this._camCache[c.entity]; if(!cc) return;
        const col=CAM_COLORS[ci%CAM_COLORS.length];
        for(const r of this._mergeRecs(cc.recordings||[])) {
          const a=Number(r.start_time),b=Number(r.end_time||e); if(b<s||a>e) continue;
          const top=yPct(Math.min(b,e));
          const h=Math.max(.45,((Math.min(b,e)-Math.max(a,s))/span)*100);
          html+=`<div class="t-rec" data-start="${a}" data-end="${b}" style="top:${top}%;height:${h}%;--rec-color:${col}"></div>`;
        }
      });
    } else {
      for(const r of this._mergeRecs(this._recordings)) {
        const a=Number(r.start_time),b=Number(r.end_time||e); if(b<s||a>e) continue;
        const top=yPct(Math.min(b,e));
        const h=Math.max(.45,((Math.min(b,e)-Math.max(a,s))/span)*100);
        html+=`<div class="t-rec" data-start="${a}" data-end="${b}" style="top:${top}%;height:${h}%"></div>`;
      }
    }

    // Explicitly mark missing retained footage on the same vertical rail as
    // recording coverage. Never mark future time beyond the live edge.
    for (const gap of this._timelineRecordingGaps(s,e)) {
      const a=Math.max(s,Number(gap.start));
      const b=Math.min(e,Number(gap.end),Math.floor(Date.now()/1000));
      if (!(b>a)) continue;
      const top=yPct(b);
      const h=Math.max(.55,((b-a)/span)*100);
      html+=`<div class="tl-no-recording" data-gap="${gap.key}" data-start="${a}" data-end="${b}" style="top:${top}%;height:${h}%" aria-label="No Recording"><span>No Recording</span></div>`;
    }

    // Time scale lives in the left gutter. Keep it sparse at all zoom levels;
    // event timestamps are intentionally not repeated beside every marker.
    const step=span<=900 ? 60 : span<=1800 ? 2*60 : span<=3600 ? 5*60 : span<=7200 ? 10*60 : 30*60;
    for(let ts=Math.ceil(s/step)*step;ts<=e;ts+=step) {
      const pct=yPct(ts), d=new Date(ts*1000), isHour=d.getMinutes()===0;
      html+=`<div class="tl-scale-mark ${isHour?'hour':''}" data-ts="${ts}" style="top:${pct}%"><span>${this._timelineScaleTime(ts)}</span><i></i></div>`;
    }

    // Render Scrypted-style detection rows: a blue rail marker plus a separate
    // horizontal lane of monochrome class glyphs. Nearby activity bursts share
    // the same row, and repeated classes collapse to one glyph.
    // A cluster may overlap the viewport after its first event has already
    // scrolled away. In that case anchor to the first *actual* detection still
    // inside the window instead of clamping the old cluster start to an edge.
    const trackPx=Math.max(track.clientHeight||420,360);
    const metrics=this._timelineResponsiveMetrics(track);
    track.style.setProperty('--tl-glyph-size',`${metrics.glyphPx}px`);
    track.style.setProperty('--tl-glyph-gap',`${metrics.glyphGapPx}px`);
    track.style.setProperty('--tl-glyph-offset',`${metrics.glyphOffsetPx}px`);
    track.style.setProperty('--tl-event-lane',`${metrics.eventLanePx}px`);
    track.style.setProperty('--tl-dot-size',`${metrics.dotPx}px`);
    const timelineItems=clusters.map(cluster=>{
      const ev=this._timelineClusterAnchor(cluster,s,e);
      return ev ? {cluster,ev,ts:Number(ev.start_time)} : null;
    }).filter(Boolean);
    const visualGroups=this._timelineVisualGroups(timelineItems,span,trackPx);

    visualGroups.forEach(group=>{
      const {anchorItem,ts:markerTs}=group;
      const {cluster,ev}=anchorItem;
      const pct=yPct(markerTs);
      const selected=group.events.some(x=>String(x.id)===String(this._timelineSelected));
      const info=ev._tl||this._timelineLabelInfo(ev);
      const allLabels=group.labels.length?group.labels:[info];
      // Scrypted's lane is class-oriented rather than count-oriented: repeated
      // detections collapse into the same glyph and nearby different classes
      // sit side-by-side. Keep at most three unique classes so the row stays
      // clean and the thumbnail always has enough room on narrow cards.
      const shownLabels=allLabels.slice(0,metrics.maxGlyphs);
      const glyphs=this._config.timeline.show_glyphs ? shownLabels
        .map(label=>`<span class="t-glyph">${timelineGlyph(label.key)}</span>`).join('') : '';
      const durationEnd=Math.min(e,Math.max(markerTs,Number(group.endTs)||Number(cluster.end)));
      const durationPx=Math.max(3,((durationEnd-markerTs)/span)*trackPx);
      const clusterClass=group.totalDetections>1?' clustered':'';
      const labelText=group.labels.map(x=>x.display).join(', ')||info.display;
      const aria=group.totalDetections>1
        ? `${labelText} detection cluster at ${this._timelineTime(markerTs)} (${group.totalDetections} detections)`
        : `${info.display} at ${this._timelineTime(markerTs)}`;
      html+=`<button class="t-ev ${selected?'selected':''}${clusterClass}" data-tick="${ev.id}" data-ts="${markerTs}" data-start="${group.startTs}" data-end="${group.endTs}" style="top:${pct}%" aria-label="${aria}"><span class="t-duration" style="height:${durationPx}px"></span><span class="t-dot"><span class="t-glyph-stack">${glyphs}</span></span><span class="t-connector"></span></button>`;
    });

    // Promote a sparse set of representative detection moments into thumbnail
    // cards. Use the same true in-window anchor as the glyph so cards cannot
    // remain glued to the viewport edge while their event scrolls away.
    const cardH=Math.max(82,Math.min(118,trackPx*.19)), gap=Math.max(8,Math.min(14,trackPx*.018));
    // Fit previews to the *actual* rendered timeline height. The old 4-mobile /
    // 6-desktop cap hid perfectly valid thumbnails on tall phones, tablets and
    // portrait dashboards even when there was plenty of vertical room.
    const configuredThumbMax=Math.max(0,Math.round(Number(this._config?.timeline?.max_thumbnails ?? 12)));
    const maxCards=this._config.timeline.show_thumbnails && configuredThumbMax>0
      ? Math.max(1,Math.min(configuredThumbMax,Math.floor((trackPx+gap)/(cardH+gap)))) : 0;
    const candidates=visualGroups.map(group=>({
      group,
      cluster:group.anchorItem.cluster,
      ev:group.anchorItem.ev,
      ts:group.ts,
      y:(yPct(group.ts)/100)*trackPx
    }));
    const chosen=[];
    const selectedCandidate=this._timelineSelected
      ? candidates.find(c=>c.group.events.some(ev=>String(ev.id)===String(this._timelineSelected)))
      : null;
    const ordered=selectedCandidate
      ? [selectedCandidate,...candidates.filter(x=>x!==selectedCandidate)]
      : candidates;
    for(const c of ordered) {
      if(chosen.length>=maxCards) break;
      if(chosen.every(x=>Math.abs(x.y-c.y)>=cardH+gap)) chosen.push(c);
    }

    chosen.forEach(({group,cluster,ev,y,ts})=>{
      const info=ev._tl||this._timelineLabelInfo(ev);
      const dur=this._dur(ev), label=info.display;
      const sub=info.sub?`<span class="t-sub">${info.sub}</span>`:'';
      const count=group.totalDetections>1?`<span class="t-count">${group.totalDetections} detections</span>`:'';
      const thumbUrl=this._timelineThumb(ev);
      const thumb=(ev.has_snapshot||ev.has_clip||ev.thumbnail)
        ? `<img src="${thumbUrl}" data-frigate-thumb="1" data-thumb-src="${thumbUrl}" loading="eager" decoding="async" alt="${label}"><div class="t-ph thumb-fallback" style="display:none">${timelineGlyph(info.key)}</div>`
        : `<div class="t-ph thumb-fallback">${timelineGlyph(info.key)}</div>`;
      const cardTop=y-cardH/2;
      html+=`<button type="button" class="t-preview" data-event-id="${ev.id}" data-ts="${ts}" data-start="${group.startTs}" data-end="${group.endTs}" style="top:${cardTop}px" aria-label="Play ${label} event at ${this._timelineTime(ts)}">
        <div class="t-preview-thumb">${thumb}
          <span class="t-badge"><span class="t-badge-glyph">${timelineGlyph(info.key)}</span>${label}</span>
          ${sub}
          ${count}
          <span class="t-preview-time">${this._timelineScaleTime(ts)}</span>
          <b>${dur}s</b>
        </div>
      </button>`;
    });

    // Camera availability is independent from retained recordings. Show a
    // persistent, compact offline marker on the timeline when the HA camera
    // entity is unavailable/unknown/offline; recorded footage remains usable.
    if (this._cameraIsOffline()) {
      html+=`<div class="tl-offline" aria-label="Camera offline"><i></i>OFFLINE</div>`;
    }

    // Live edge: when the current time is inside the visible timeline, show a
    // bright horizontal red LIVE marker. It is positioned in wall-clock space,
    // independently of the centered playhead.
    const nowTs = Math.floor(Date.now()/1000);
    if (nowTs >= s && nowTs <= e) {
      const livePct = yPct(nowTs);
      html+=`<div class="tl-live-line" style="top:${livePct}%" aria-label="Live"></div>`;
    }

    // Download trim mode is drawn in the same timestamp coordinate space as
    // recordings/events. On this vertical timeline newer time is above older
    // time, so END is the upper handle and START is the lower handle.
    if(this._downloadRange){
      const r=this._downloadRange;
      const start=Math.max(s,Math.min(e,Number(r.start)));
      const end=Math.max(s,Math.min(e,Number(r.end)));
      const endPct=yPct(end), startPct=yPct(start);
      const bandTop=Math.min(endPct,startPct);
      const bandHeight=Math.max(.35,Math.abs(startPct-endPct));
      const duration=this._formatDownloadRangeDuration(Number(r.end)-Number(r.start));
      html+=`<div class="tl-download-range" data-start="${Math.floor(Number(r.start))}" data-end="${Math.floor(Number(r.end))}" aria-label="Download range ${this._timelineTime(r.start)} to ${this._timelineTime(r.end)}">
        <div class="tl-range-band" style="top:${bandTop}%;height:${bandHeight}%"></div>
        <div class="tl-range-boundary tl-range-end" data-range-handle="end" style="top:${endPct}%" role="slider" aria-label="Download end" aria-valuetext="${this._timelineTime(r.end)}"><i></i><span><b>END</b>${this._timelineScaleTime(r.end)}</span></div>
        <div class="tl-range-boundary tl-range-start" data-range-handle="start" style="top:${startPct}%" role="slider" aria-label="Download start" aria-valuetext="${this._timelineTime(r.start)}"><i></i><span><b>START</b>${this._timelineScaleTime(r.start)}</span></div>
        <div class="tl-range-actions"><span class="tl-range-duration">${duration}</span><button type="button" data-range-cancel>Cancel</button><button type="button" class="primary" data-range-download>${ICONS.download}<span>Download</span></button></div>
      </div>`;
    }

    // Fixed center playhead. The selected wall-clock time is pinned at mid-track.
    html+=`<div class="tl-playhead" aria-hidden="true"><i></i><span>${this._timelineTime(focus)}</span></div>`;
    // Reconcile the timeline by stable keys instead of replacing the whole
    // track. Advanced Camera Card treats timeline/view state separately from
    // media rendering; we use the same principle here so thumbnails, markers
    // and the playhead survive pans/scrubs without DOM popping or image reloads.
    this._reconcileTimeline(track, html);
    this._timelineDataDirty=false;
    this._renderTimelineZoomLabel();
    const labels=this._$('#tl-labels'); if(labels) labels.innerHTML='';
  },

_reconcileTimeline(track, html) {
    const tmp=document.createElement('div');
    tmp.innerHTML=html;
    const oldByKey=new Map();
    [...track.children].forEach(el=>{
      const key=this._timelineNodeKey(el);
      if(key) oldByKey.set(key,el);
    });
    const used=new Set();
    const frag=document.createDocumentFragment();
    [...tmp.children].forEach(next=>{
      const key=this._timelineNodeKey(next);
      let old=key ? oldByKey.get(key) : null;
      // If the semantic element type changed (timeline previews became real
      // buttons in a previous implementation), replace it once instead of preserving the legacy
      // node forever under the same reconciliation key.
      if(old && old.tagName!==next.tagName) { old.remove(); old=null; }
      if(old){
        used.add(old);
        // Update presentation attributes in place. Keep descendants intact for
        // thumbnails and media so an unchanged event never reloads its image.
        if(next.className!==old.className) old.className=next.className;
        if(next.getAttribute('style')!==old.getAttribute('style')) old.setAttribute('style',next.getAttribute('style')||'');
        for(const attr of ['aria-label','data-ts','data-start','data-end','data-tick','data-event-id','data-gap']) {
          const v=next.getAttribute(attr);
          if(v==null) old.removeAttribute(attr); else if(old.getAttribute(attr)!==v) old.setAttribute(attr,v);
        }
        // The cluster count/glyph can change without changing its event key.
        // Update only lightweight marker text; never touch preview <img> nodes.
        if(old.classList.contains('t-ev')) {
          const oldDot=old.querySelector('.t-dot'); const newDot=next.querySelector('.t-dot');
          if(oldDot && newDot && oldDot.innerHTML!==newDot.innerHTML) oldDot.innerHTML=newDot.innerHTML;
        }
        if(old.classList.contains('tl-download-range') && old.innerHTML!==next.innerHTML) old.innerHTML=next.innerHTML;
        if(old.classList.contains('tl-offline') && old.textContent!==next.textContent) old.textContent=next.textContent;
        frag.appendChild(old);
      } else {
        frag.appendChild(next);
      }
    });
    const newKeys=new Set([...tmp.children].map(n=>this._timelineNodeKey(n)).filter(Boolean));
    [...track.children].forEach(old=>{
      const key=this._timelineNodeKey(old);
      if(!key || !newKeys.has(key)) old.remove();
    });
    track.appendChild(frag);
  }
};

// ── src/card/timeline-render.js ──
/**
 * Public method-group barrel for timelineRenderMethods.
 *
 * Keeping this entry point stable avoids coupling callers to the internal
 * feature layout while allowing each concern to live in a focused module.
 */
const timelineRenderMethods = Object.assign(
  {},
  timelineModelMethods,
  timelineLiveMethods,
  timelineViewMethods,
);

// ── src/card/lists.js ──
/**
 * Event/review list presentation and camera switcher rendering.
 */
// Prototype methods grouped by responsibility.
const listMethods = {
_favIcon(ev) { return ev.retain_indefinitely?`<button class="ico fav on" data-fav="${ev.id}">${ICONS.star}</button>`:`<button class="ico fav" data-fav="${ev.id}">${ICONS.starO}</button>`; },

_eventCardHTML(ev,expanded,compact=false) {
    const col=labelColor(ev.label); const score=ev.top_score!=null?Math.round(ev.top_score*100)+'%':'';
    const eventZones=this._eventZoneList(ev); const zone=eventZones.length?eventZones[0]:''; const subl=ev.sub_label?`<span class="subl">${ev.sub_label}</span>`:'';
    const desc=expanded&&ev.data?.description?`<div class="desc">${ev.data.description}</div>`:'';
    const thumbUrl=this._mediaForEvent(ev,'thumbnail.jpg');
    const thumb=ev.has_snapshot||ev.has_clip?`<img src="${thumbUrl}" data-frigate-thumb="1" data-thumb-src="${thumbUrl}" loading="lazy"><div class="tph thumb-fallback" style="display:none">${timelineGlyph((ev._tl||this._timelineLabelInfo(ev)).key)}</div>`:`<div class="tph thumb-fallback">${timelineGlyph((ev._tl||this._timelineLabelInfo(ev)).key)}</div>`;
    const badge=ev.has_clip?'<span class="bc">clip</span>':(ev.has_snapshot?'<span class="bs">snap</span>':'');
    const dlClip=ev.has_clip?`<button class="ico" data-dl="${ev.id}" data-dl-file="clip.mp4" title="Download clip">${ICONS.download}</button>`:'';
    const dlSnap=ev.has_snapshot?`<button class="ico" data-dl="${ev.id}" data-dl-file="snapshot.jpg" title="Download snapshot">${ICONS.snapshot}</button>`:'';
    // show camera name in multi-cam all-events mode
    const camLabel=(this._eventsMode==='all'&&this._config.cameras.length>1)?`<span class="cam-badge">${(ev.camera||'').replace(/_/g,' ')}</span>`:'';
    // compact: wrap everything in a tighter layout, actions horizontal
    return `<div class="ec${compact?' compact':''}" data-ev="${ev.id}">
      <div class="et">${thumb}<div class="ed">${this._dur(ev)}s</div></div>
      <div class="ei">
        <div class="etop"><span class="tb" style="background:${col}33;color:${col}">${cap(ev.label)}</span>${subl}${badge}${camLabel}${score?`<span class="esc">${score}</span>`:''}</div>
        <div class="em"><span>${ICONS.clock}${this._time(ev.start_time)}</span>${zone?`<span>${ICONS.pin}${zone}</span>`:''}</div>
        ${desc}
      </div>
      <div class="eact${compact?' h':''}">${this._favIcon(ev)}${dlClip}${dlSnap}</div>
    </div>`;
  },

_emptyState(icon, title, desc) {
    return `<div class="empty-state"><div class="es-icon">${icon}</div><div class="es-title">${title}</div>${desc ? `<div class="es-desc">${desc}</div>` : ''}</div>`;
  },

_renderList() {
    if (this._galleryMode) { this._renderGallery(); return; }
    const list=this._$('#list'); if(!list) return;
    if(this._tab==='recordings') {
      // Don't blow away the recording list (and seek bar) while the user is watching a recording
      const viewerActive = this._$('#viewer')?.style.display !== 'none';
      if (viewerActive && this._playing?.rec != null) return;
      return this._renderRecordings(list);
    }
    if(this._tab==='reviews') return this._renderReviews(list);
    if(this._tab==='kept'){
      if(!this._kept.length){list.innerHTML=this._emptyState(ICONS.star,'No kept events','Star an event to keep it here');return;}
      list.innerHTML=this._kept.map(ev=>this._eventCardHTML(ev,false)).join(''); return;
    }
    const events=this._filtered();
    if(!events.length){list.innerHTML=this._emptyState(ICONS.clips,'No events','Nothing detected in this time window');return;}
    list.innerHTML=events.map(ev=>this._eventCardHTML(ev,false)).join('')+(this._exhausted?'<div class="end">— end —</div>':'<div class="more">scroll for older…</div>');
  },

_renderRecordings(list) {
    const recs=this._mergeRecs(this._recordings).sort((a,b)=>b.start_time-a.start_time);
    if(!recs.length){list.innerHTML=this._emptyState(ICONS.recordings,'No recordings','This camera has nothing recorded in this window');return;}
    list.innerHTML=recs.map(r=>{
      const rs=Math.floor(r.start_time), re=Math.floor(r.end_time||Date.now()/1000);
      const d=Math.max(1,re-rs); const mm=Math.floor(d/60),ss=d%60;
      const dur=`${mm?mm+'m ':''}${ss}s`;
      const seekHint = d > 300 ? ' <span class="seek-hint">· click to seek</span>' : '';
      return `<div class="rec" data-rs="${rs}" data-re="${re}">
        <div class="ric">${ICONS.recordings}</div>
        <div class="rinf">
          <div class="rt">${this._time(r.start_time)} – ${this._time(r.end_time||Date.now()/1000)}</div>
          <div class="rsub">${dur}${r.events?' · '+r.events+' ev':''}${seekHint}</div>
        </div>
        <div class="rp">▶</div>
      </div>`;
    }).join('');
  },

_renderReviews(list) {
    if(!this._reviews.length){list.innerHTML=this._emptyState(ICONS.reviews,'No reviews','Nothing flagged for review in this window');return;}
    const allRevs=[...this._reviews].sort((a,b)=>b.start_time-a.start_time);
    const unrev=allRevs.filter(r=>!r.has_been_reviewed).length;
    const revs=this._showReviewed ? allRevs : allRevs.filter(r=>!r.has_been_reviewed);
    const toggleLbl=this._showReviewed?'Hide reviewed':'Show reviewed';
    const head=`<div class="rev-head"><span>${unrev} to review</span><div style="display:flex;gap:5px;align-items:center">${unrev?`<button class="chip on" data-mark-all>Mark all</button>`:''}<button class="chip" data-toggle-reviewed>${toggleLbl}</button></div></div>`;
    if(!revs.length){list.innerHTML=head+this._emptyState(ICONS.reviews,'All caught up','Nothing left to review');return;}
    list.innerHTML=head+revs.map(r=>{
      const sev=r.severity==='alert'?'alert':'detection';
      const objs=this._reviewLabelList(r).map(x=>this._filterDisplayName('label',x)).join(', ');
      const title=r.data?.metadata?.title||objs||cap(r.severity);
      const firstDet=(r.data?.detections&&r.data.detections[0])||'';
      const reviewed=r.has_been_reviewed;
      const reviewThumbUrl=firstDet?this._mediaForEvent({id:firstDet,camera:r.camera},'thumbnail.jpg'):''; const thumb=firstDet?`<div class="rev-th"><img src="${reviewThumbUrl}" data-frigate-thumb="1" data-thumb-src="${reviewThumbUrl}" loading="lazy"><div class="tph thumb-fallback" style="display:none">${ICONS.reviews}</div></div>`:'';
      return`<div class="rev ${sev}" data-review-id="${r.id}" ${firstDet?`data-review-open="${firstDet}"`:''}><div class="rev-sev ${sev}"></div>${thumb}<div class="rev-inf"><div class="rev-t">${title}</div><div class="rev-m">${this._time(r.start_time)} · ${cap(sev)}${reviewed?' · ✓':firstDet?' · tap':''}</div></div>${reviewed?'':`<button class="ico" data-mark>${ICONS.reviews}</button>`}</div>`;
    }).join('');
  }
};

// ── src/card/download.js ──
/**
 * Recording download-range selection, validation and Frigate export requests.
 */
// Prototype methods grouped by responsibility.
const downloadMethods = {
_formatDownloadRangeDuration(seconds) {
    const total=Math.max(1,Math.round(Number(seconds)||0));
    const h=Math.floor(total/3600), m=Math.floor((total%3600)/60), s=total%60;
    if(h) return `${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
    return `${m}:${String(s).padStart(2,'0')}`;
  },

_enterDownloadRangePicker(anchorTs) {
    if(this._viewMode==='grid' || this._galleryMode) return;
    const now=Math.floor(Date.now()/1000);
    const windowStart=Math.max(0,Math.floor(Number(this._winStart)||0));
    const windowEnd=Math.max(windowStart+1,Math.min(now,Math.floor(Number(this._winEnd)||now)));
    let anchor=Math.floor(Number(anchorTs));
    if(!Number.isFinite(anchor)) anchor=Math.floor((windowStart+windowEnd)/2);
    anchor=Math.max(windowStart,Math.min(windowEnd,anchor));

    // Center the configurable default trim span on the current scrub timestamp.
    const defaultRange=Math.max(2,Math.round(Number(this._config?.download?.default_range_seconds||60)));
    let start=Math.max(windowStart,anchor-Math.floor(defaultRange/2));
    let end=Math.min(windowEnd,anchor+Math.ceil(defaultRange/2));
    if(end-start<2){
      if(end<windowEnd) end=Math.min(windowEnd,start+2);
      else start=Math.max(windowStart,end-2);
    }
    this._downloadRange={start:Math.floor(start),end:Math.max(Math.floor(start)+1,Math.floor(end)),anchor};
    this._timelineFollowingLive=false;
    this._renderTimeline(true);
    this._renderStreamCtrl();
    this._toast('Drag START and END on the timeline, then Download',2600);
  },

_cancelDownloadRangePicker() {
    if(!this._downloadRange) return;
    this._downloadRange=null;
    this._timelineInteracting=false;
    this._renderTimeline(true);
    this._renderStreamCtrl();
  },

async _confirmDownloadRangePicker() {
    const range=this._downloadRange;
    if(!range) return;
    const start=Math.floor(Number(range.start));
    const end=Math.floor(Number(range.end));
    if(!Number.isFinite(start)||!Number.isFinite(end)||end<=start){
      this._toast('Choose a valid download range');
      return;
    }
    this._downloadRange=null;
    this._timelineInteracting=false;
    this._renderTimeline(true);
    this._renderStreamCtrl();
    return this._downloadRecRange(start,end);
  },

_syncDownloadRangePickerDOM(activeKind=null) {
    const track=this._$('#tl-track');
    const root=track?.querySelector('.tl-download-range');
    const r=this._downloadRange;
    if(!track||!root||!r) return;
    const s=Number(this._winStart), e=Number(this._winEnd);
    const span=Math.max(1,e-s);
    const focus=Number.isFinite(Number(this._timelineFocusTs))?Number(this._timelineFocusTs):e;
    const yPct=ts=>Math.max(0,Math.min(100,50+((focus-Number(ts))/span)*100));
    const endPct=yPct(r.end), startPct=yPct(r.start);
    const band=root.querySelector('.tl-range-band');
    if(band){band.style.top=`${Math.min(endPct,startPct)}%`;band.style.height=`${Math.max(.35,Math.abs(startPct-endPct))}%`;}
    const syncHandle=(kind,pct,ts)=>{
      const h=root.querySelector(`[data-range-handle="${kind}"]`);
      if(!h) return;
      h.style.top=`${pct}%`;
      h.setAttribute('aria-valuetext',this._timelineTime(ts));
      h.classList.toggle('dragging',activeKind===kind);
      const label=h.querySelector('span');
      if(label) label.innerHTML=`<b>${kind==='end'?'END':'START'}</b>${this._timelineScaleTime(ts)}`;
    };
    syncHandle('end',endPct,r.end);
    syncHandle('start',startPct,r.start);
    root.classList.toggle('range-dragging',!!activeKind);
    root.dataset.start=String(Math.floor(Number(r.start)));
    root.dataset.end=String(Math.floor(Number(r.end)));
    root.setAttribute('aria-label',`Download range ${this._timelineTime(r.start)} to ${this._timelineTime(r.end)}`);
    const dur=root.querySelector('.tl-range-duration');
    if(dur) dur.textContent=this._formatDownloadRangeDuration(Number(r.end)-Number(r.start));
  },

_updateDownloadRangeBoundary(kind, absoluteTs) {
    const range=this._downloadRange;
    if(!range) return null;
    const now=Math.floor(Date.now()/1000);
    const lo=Math.max(0,Math.floor(Number(this._winStart)||0));
    const hi=Math.max(lo+1,Math.min(now,Math.floor(Number(this._winEnd)||now)));
    let t=Math.max(lo,Math.min(hi,Math.round(Number(absoluteTs)||0)));
    const maxLen=Math.max(60,Math.round(Number(this._config?.download?.max_range_minutes||120)*60));
    if(kind==='start'){
      t=Math.min(t,range.end-1);
      t=Math.max(t,range.end-maxLen,lo);
      range.start=t;
    } else {
      t=Math.max(t,range.start+1);
      t=Math.min(t,range.start+maxLen,hi);
      range.end=t;
    }
    return t;
  },

async _downloadRecRange(dlStart, dlEnd) {
    const {clientId, cam} = this._cc();
    const maxLen=Math.max(60,Math.round(Number(this._config?.download?.max_range_minutes||120)*60));
    const end=Math.min(Math.floor(Number(dlEnd)),Math.floor(Number(dlStart))+maxLen);
    const start=Math.floor(Number(dlStart));
    if(!Number.isFinite(start)||!Number.isFinite(end)||end<=start){this._toast('Choose a valid download range');return;}
    const base = `/api/frigate/${encodeURIComponent(String(clientId))}/recording/${encodeURIComponent(String(cam))}/start/${start}/end/${end}`;

    // IMPORTANT: Home Assistant signs both the request path *and* all non-safe
    // query parameters. An older implementation signed `base` and only then appended
    // `download=true`; current HA correctly rejects that as a tampered signed
    // request, causing the 401/error body to be saved with an .mp4 extension.
    // Build the final proxy request first, then sign that exact path.
    const signed = await this._signed(`${base}?download=true`);
    const a = document.createElement('a');
    a.href = signed;
    const stamp=new Date(start*1000).toISOString().replace(/[:.]/g,'-');
    a.download = `${String(cam).replace(/[^a-z0-9_-]+/gi,'_')}_${stamp}_${end-start}s.mp4`;
    a.rel='noopener';
    document.body.appendChild(a);
    a.click();
    a.remove();
  }
};

// ── src/card/multiview/core.js ──
/**
 * Shared Multiview recording calculations and per-camera synchronization helpers.
 */
const multiviewCoreMethods = {
  _multiRecordingBucket(target) {
    const bucket=15*60;
    const t=Math.max(0,Math.floor(Number(target)||0));
    const start=Math.floor(t/bucket)*bucket;
    const now=Math.floor(Date.now()/1000);
    return {start,end:Math.max(start+1,Math.min(start+bucket,now))};
  },
  _multiRecordingCurrentTs(session=this._multiPlaybackSession) {
    if(!session) return NaN;
    return Number(session.clockBaseTs)+Math.max(0,(performance.now()-Number(session.clockStartedAt||performance.now()))/1000);
  },
  _multiRecordingHasCoverage(entry,ts) {
    return (entry?.recordings||[]).some(r=>Number(r.start_time)<=ts&&Number(r.end_time)>=ts);
  },
  _multiRecordingSetState(entry,state,text='') {
    if(!entry)return;
    const available=state==='playing';
    if(entry.mediaHost)entry.mediaHost.style.visibility=available?'visible':'hidden';
    if(entry.status){entry.status.textContent=text||(available?'':'No recording');entry.status.style.display=available?'none':'flex';}
  },
  _multiRecordingSyncEntry(entry,absTs,force=false) {
    if(!entry||entry.session!==this._multiPlaybackSession)return;
    if(!this._multiRecordingHasCoverage(entry,absTs)){
      this._multiRecordingSetState(entry,'gap','No recording');
      try{entry.video?.pause?.();}catch(_){}
      return;
    }
    const offset=this._frigateSeekPosition(absTs,entry.recordings,entry.inpointOffset||0);
    if(!Number.isFinite(offset)){
      this._multiRecordingSetState(entry,'gap','No recording');
      return;
    }
    this._multiRecordingSetState(entry,'playing');
    const video=entry.video;
    if(!video||video.readyState<1)return;
    const d=Number(video.duration);
    const wanted=Number.isFinite(d)&&d>0?Math.max(0,Math.min(offset,Math.max(0,d-.05))):Math.max(0,offset);
    const current=Number(video.currentTime);
    if(force||!Number.isFinite(current)||Math.abs(current-wanted)>.55){try{video.currentTime=wanted;}catch(_){}}
    video.muted=true;
    if(video.paused){try{const p=video.play();if(p?.catch)p.catch(()=>{});}catch(_){}}
  },
  _multiRecordingBindVideo(entry,video) {
    if(!entry||!video||entry.video===video)return;
    entry.video=video;
    video.muted=true;video.playsInline=true;video.preload='auto';video.controls=false;
    video.setAttribute('playsinline','');video.setAttribute('webkit-playsinline','');
    const sync=()=>{
      if(entry.session!==this._multiPlaybackSession)return;
      const ts=this._multiRecordingCurrentTs(entry.session);
      if(Number.isFinite(ts))this._multiRecordingSyncEntry(entry,ts,true);
    };
    ['loadedmetadata','durationchange','canplay'].forEach(ev=>video.addEventListener(ev,sync));
    sync();
  }
};

// ── src/card/multiview/player.js ──
/**
 * Per-camera Multiview recording player creation and decoder synchronization.
 */
const multiviewPlayerMethods = {
  async _multiRecordingAttachPlayer(entry) {
    const session=entry.session;
    if(!session||session!==this._multiPlaybackSession||!entry.recordings.length)return;
    const {clientId,cam,sourceStart,sourceEnd}=entry;
    const isIOS=this._isIOSRecordingPlatform();
    const attachHls=async()=>{
      if(session!==this._multiPlaybackSession)return;
      const leaf=isIOS?'index':'master';
      const path=`/api/frigate/${encodeURIComponent(String(clientId))}/vod/${encodeURIComponent(String(cam))}/start/${sourceStart}/end/${sourceEnd}/${leaf}.m3u8`;
      const url=isIOS?await this._signed(path):await this._resolveSignedVodPlaylist(path);
      if(session!==this._multiPlaybackSession)return;
      const player=this._createHlsPlayer(url,{autoplay:true,controls:false,muted:true});
      player.style.cssText='position:absolute;inset:0;width:100%;height:100%;display:block;background:#000;pointer-events:none';
      entry.mediaHost.innerHTML='';entry.mediaHost.appendChild(player);entry.player=player;
      let tries=0;
      const find=()=>{
        if(session!==this._multiPlaybackSession)return;
        const video=this._findVideo(player);
        if(video){this._multiRecordingBindVideo(entry,video);return;}
        if(++tries<160)entry.attachTimer=setTimeout(find,60);
        else this._multiRecordingSetState(entry,'error','Unable to play recording');
      };
      find();
    };
    if(!isIOS){await attachHls();return;}
    const path=`/api/frigate/${encodeURIComponent(String(clientId))}/recording/${encodeURIComponent(String(cam))}/start/${sourceStart}/end/${sourceEnd}`;
    const url=await this._signed(path);
    if(session!==this._multiPlaybackSession)return;
    const video=document.createElement('video');
    video.style.cssText='position:absolute;inset:0;width:100%;height:100%;display:block;background:#000;object-fit:contain;pointer-events:none';
    entry.mediaHost.innerHTML='';entry.mediaHost.appendChild(video);entry.player=video;
    this._multiRecordingBindVideo(entry,video);
    let fallback=false;
    video.addEventListener('error',()=>{
      if(fallback||session!==this._multiPlaybackSession)return;
      fallback=true;try{video.pause();video.removeAttribute('src');video.load();}catch(_){}attachHls();
    },{once:true});
    video.src=url;try{video.load();}catch(_){}
  },

  async _multiRecordingPrepareEntry(camera,index,slot,session) {
    if(!slot)return null;
    const name=cap(camera?.name||this._hass?.states?.[camera?.entity]?.attributes?.friendly_name||camera?.entity?.replace(/^camera\./,'')||`Camera ${index+1}`);
    slot.innerHTML='';slot.dataset.multiRecording='1';slot.style.position='relative';
    const mediaHost=document.createElement('div');
    mediaHost.style.cssText='position:absolute;inset:0;background:#000;overflow:hidden';slot.appendChild(mediaHost);
    const status=document.createElement('div');
    status.style.cssText='position:absolute;inset:0;z-index:4;display:flex;align-items:center;justify-content:center;padding:18px;text-align:center;background:#000;color:rgba(255,255,255,.72);font:600 12px/1.35 -apple-system,BlinkMacSystemFont,system-ui,sans-serif';
    status.textContent='Loading recording…';slot.appendChild(status);
    const label=document.createElement('div');label.className='grid-label';label.textContent=name;slot.appendChild(label);
    if(!this._camCache[camera.entity]?.discovered){try{await this._discoverOne(camera.entity);}catch(_){}}
    if(session!==this._multiPlaybackSession)return null;
    const cc=this._camCache[camera.entity]||{};
    const clientId=camera.frigate_client_id||cc.clientId||this._config.frigate_client_id||'frigate';
    const cam=cc.cam||this._hass?.states?.[camera.entity]?.attributes?.camera_name||camera.entity.replace(/^camera\./,'');
    const entry={camera,index,name,slot,mediaHost,status,clientId,cam,sourceStart:session.sourceStart,sourceEnd:session.sourceEnd,recordings:[],inpointOffset:0,video:null,player:null,attachTimer:null,session};
    try{
      const rows=await this._ws({type:'frigate/recordings/get',instance_id:clientId,camera:cam,after:session.sourceStart,before:session.sourceEnd});
      entry.recordings=(Array.isArray(rows)?rows:[]).filter(r=>Number(r.start_time)<session.sourceEnd&&Number(r.end_time)>session.sourceStart).sort((a,b)=>Number(a.start_time)-Number(b.start_time));
    }catch(_){
      entry.recordings=(Array.isArray(cc.recordings)?cc.recordings:[]).filter(r=>Number(r.start_time)<session.sourceEnd&&Number(r.end_time)>session.sourceStart).sort((a,b)=>Number(a.start_time)-Number(b.start_time));
    }
    if(session!==this._multiPlaybackSession)return null;
    entry.inpointOffset=this._frigateInpointOffset(session.sourceStart,entry.recordings[0]);
    if(!entry.recordings.length){this._multiRecordingSetState(entry,'gap','No recording');return entry;}
    await this._multiRecordingAttachPlayer(entry);
    return entry;
  }
};

// ── src/card/multiview/controller.js ──
/**
 * Multiview recording session lifecycle and synchronized seek dispatch.
 */
const multiviewControllerMethods = {
  _cancelMultiRecordingPlayback() {
    const session=this._multiPlaybackSession;
    if(!session)return;
    this._multiPlaybackSession=null;
    clearInterval(session.syncTimer);
    for(const entry of session.entries||[]){
      clearTimeout(entry?.attachTimer);
      try{entry?.video?.pause?.();}catch(_){}
      try{if(entry?.video&&entry.player===entry.video){entry.video.removeAttribute('src');entry.video.srcObject=null;entry.video.load();}}catch(_){}
      try{entry?.player?.remove?.();}catch(_){}
    }
    const grid=this.shadowRoot?.querySelector?.('#cam-grid');
    grid?.querySelector?.('#multi-recording-back-live')?.remove();
    if(grid)delete grid.dataset.multiRecording;
  },

  async _showMultiRecording(target) {
    const t=Math.max(0,Math.floor(Number(target)));
    if(!Number.isFinite(t)||this._viewMode!=='grid'||(this._config?.cameras?.length||0)<2){
      return recordingPlaybackMethods._showRecording.call(this,this._hourStart(t),this._hourStart(t)+3600,t);
    }

    const current=this._multiPlaybackSession;
    if(current&&t>=current.sourceStart&&t<current.sourceEnd){
      current.targetTs=t;
      current.clockBaseTs=t;
      current.clockStartedAt=performance.now();
      this._playing={rec:t,multi:true};
      this._scrubTarget=t;
      this._updateTimelinePlaybackTime(t);
      for(const entry of current.entries||[])this._multiRecordingSyncEntry(entry,t,true);
      this._renderStreamCtrl();
      return;
    }

    this._cancelActivePlayback();
    const token=++this._playSeq;
    const bucket=this._multiRecordingBucket(t);
    const session={token,targetTs:t,clockBaseTs:t,clockStartedAt:performance.now(),sourceStart:bucket.start,sourceEnd:bucket.end,entries:[],syncTimer:null,advancing:false};
    this._multiPlaybackSession=session;
    this._playbackReturnViewMode='grid';
    this._playing={rec:t,multi:true};
    this._scrubTarget=t;
    this._tab='live';
    this._galleryMode='';

    const viewer=this.shadowRoot.querySelector('#viewer');
    if(viewer){viewer.innerHTML='';viewer.style.display='none';}
    const engWrap=this.shadowRoot.querySelector('#eng-wrap');
    if(engWrap)engWrap.style.display='none';
    const grid=this.shadowRoot.querySelector('#cam-grid');
    if(!grid)return;
    grid.style.display='';
    grid.style.position='relative';
    await this._mountGrid();
    if(session!==this._multiPlaybackSession||token!==this._playSeq)return;

    const slots=[...grid.querySelectorAll('.grid-slot:not(.placeholder)')];
    const back=document.createElement('button');
    back.id='multi-recording-back-live';back.type='button';back.textContent='Back to Live';back.setAttribute('aria-label','Back to Live');
    back.style.cssText='position:absolute;left:12px;top:12px;z-index:90;min-height:36px;padding:7px 12px;border:1px solid rgba(255,255,255,.24);border-radius:999px;background:rgba(16,16,18,.78);color:#fff;font:650 12px/1 -apple-system,BlinkMacSystemFont,system-ui,sans-serif;backdrop-filter:blur(16px) saturate(160%);-webkit-backdrop-filter:blur(16px) saturate(160%);cursor:pointer';
    back.addEventListener('click',ev=>{ev.preventDefault();ev.stopPropagation();this._showLive();});
    grid.appendChild(back);

    const entries=await Promise.all(this._config.cameras.map((camera,index)=>this._multiRecordingPrepareEntry(camera,index,slots[index],session)));
    if(session!==this._multiPlaybackSession||token!==this._playSeq)return;
    session.entries=entries.filter(Boolean);
    session.clockBaseTs=t;
    session.clockStartedAt=performance.now();
    this._updateTimelinePlaybackTime(t);
    this._renderStreamCtrl();

    const tick=()=>{
      if(session!==this._multiPlaybackSession||token!==this._playSeq||this._viewMode!=='grid'||this._timelineInteracting)return;
      const abs=this._multiRecordingCurrentTs(session);
      if(!Number.isFinite(abs))return;
      const now=Math.floor(Date.now()/1000);
      if(abs>=now-1){
        if(!session.advancing){session.advancing=true;this._refreshLiveFromTimeline();}
        return;
      }
      if(abs>=session.sourceEnd-.25){
        if(!session.advancing){session.advancing=true;this._showMultiRecording(session.sourceEnd);}
        return;
      }
      session.targetTs=abs;
      this._playing={rec:abs,multi:true};
      this._scrubTarget=abs;
      this._updateTimelinePlaybackTime(abs);
      for(const entry of session.entries)this._multiRecordingSyncEntry(entry,abs,false);
    };
    tick();
    session.syncTimer=setInterval(tick,250);
  },

  _cancelActivePlayback(keepSession=false) {
    this._cancelMultiRecordingPlayback();
    return recordingPlaybackMethods._cancelActivePlayback.call(this,keepSession);
  },

  async _seekTimelineTarget(target) {
    const t=Math.max(0,Math.floor(Number(target)));
    if(this._viewMode==='grid'&&(this._config?.cameras?.length||0)>1){
      if(!Number.isFinite(t))return;
      const seq=++this._timelineSeekSeq;
      this._scrubTarget=t;
      await this._showMultiRecording(t);
      if(seq!==this._timelineSeekSeq)return;
      return;
    }
    return timelineInteractionMethods._seekTimelineTarget.call(this,target);
  },

  _setViewMode(mode) {
    if(mode!=='grid'&&this._multiPlaybackSession)this._cancelMultiRecordingPlayback();
    return liveMethods._setViewMode.call(this,mode);
  }
};

// ── src/card/multiview/timeline-ui.js ──
/** Multiview timeline legend, preview geometry, and download-range UI. */
const multiviewTimelineMethods = {
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
    // A pointer drag that began on an event thumbnail produces a synthetic
    // click on release in desktop browsers. Ignore only that short-lived click;
    // ordinary event and timeline clicks continue through the normal handler.
    if((this._timelineSuppressClickUntil||0)>performance.now() && e?.target?.closest?.('.t-preview,.t-ev,[data-tick]')) {
      e.preventDefault?.();
      e.stopPropagation?.();
      return;
    }

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

  _timelineConfiguredPreviewHeight() {
    return Math.max(48,Math.min(140,Math.round(Number(this._config?.timeline?.thumbnail_size ?? 84))));
  },

  _syncTimelinePreviewGeometry() {
    const track=this._$('#tl-track');
    if(!track)return;
    const h=this._timelineConfiguredPreviewHeight();
    const w=Math.max(154,Math.min(420,Math.round(h*3.15)));
    const s=Number(this._winStart),e=Number(this._winEnd);
    const span=Math.max(1,e-s);
    const focus=Number.isFinite(Number(this._timelineFocusTs))?Number(this._timelineFocusTs):e;
    const trackPx=Math.max(1,Number(track.clientHeight)||Number(track.getBoundingClientRect?.().height)||420);
    const yPct=ts=>Math.max(0,Math.min(100,50+((focus-Number(ts))/span)*100));
    for(const preview of track.querySelectorAll('.t-preview[data-ts]')){
      const ts=Number(preview.dataset.ts);
      preview.style.setProperty('height',`${h}px`,'important');
      preview.style.setProperty('width',`min(${w}px, calc(100% - var(--tl-content) - 10px))`,'important');
      preview.style.setProperty('max-width',`${w}px`,'important');
      if(Number.isFinite(ts)){
        const center=(yPct(ts)/100)*trackPx;
        preview.style.top=`${center-h/2}px`;
      }
    }
  },

  _renderTimeline(...args) {
    const result=timelineRenderMethods._renderTimeline.apply(this,args);
    this._syncTimelinePreviewGeometry();
    this._updateTimelineDateLabel?.();
    if(this._downloadRange){
      this._syncDownloadRangePickerDOM();
      this._wireDedicatedDownloadRangeDrag();
    }
    return result;
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

  _downloadRangeTimestampAtClientY(clientY) {
    const track=this._$('#tl-track');
    if(!track)return NaN;
    const rect=track.getBoundingClientRect();
    const ratio=Math.max(0,Math.min(1,(Number(clientY)-rect.top)/Math.max(1,rect.height)));
    const span=Math.max(1,Number(this._winEnd)-Number(this._winStart));
    const focus=Number.isFinite(Number(this._timelineFocusTs))
      ? Number(this._timelineFocusTs)
      : (Number(this._winStart)+Number(this._winEnd))/2;
    return focus+(0.5-ratio)*span;
  },

  _downloadRangeKindAtClientY(clientY,preferred=null) {
    const range=this._downloadRange;
    if(!range)return preferred||'start';
    if(preferred==='start'||preferred==='end')return preferred;
    const ts=this._downloadRangeTimestampAtClientY(clientY);
    return Math.abs(ts-Number(range.start))<=Math.abs(ts-Number(range.end))?'start':'end';
  },

  _wireDedicatedDownloadRangeDrag() {
    const track=this._$('#tl-track');
    const root=track?.querySelector('.tl-download-range');
    if(!track||!root||!this._downloadRange||root.dataset.dragWired==='1')return;
    root.dataset.dragWired='1';
    root.style.touchAction='none';
    let kind=null;
    let pointerId=null;
    let touchId=null;

    const isActionTarget=target=>!!target?.closest?.('[data-range-download],[data-range-cancel]');
    const update=y=>{
      if(!kind||!this._downloadRange)return;
      const ts=this._downloadRangeTimestampAtClientY(y);
      const value=this._updateDownloadRangeBoundary(kind,ts);
      if(!Number.isFinite(value))return;
      this._timelineInteracting=true;
      track.classList.add('range-grab');
      this._syncDownloadRangePickerDOM(kind);
      this._updateTimelineScrubLabel(value);
    };
    const start=(target,y)=>{
      if(!this._downloadRange||isActionTarget(target))return false;
      const preferred=target?.closest?.('[data-range-handle]')?.dataset?.rangeHandle||null;
      kind=this._downloadRangeKindAtClientY(y,preferred);
      update(y);
      return true;
    };
    const finish=()=>{
      if(!kind)return;
      kind=null;
      pointerId=null;
      touchId=null;
      this._timelineInteracting=false;
      track.classList.remove('range-grab');
      this._syncDownloadRangePickerDOM();
    };

    root.addEventListener('pointerdown',e=>{
      if(isActionTarget(e.target)||(e.pointerType==='mouse'&&e.button!==0))return;
      if(!start(e.target,e.clientY))return;
      e.preventDefault();
      e.stopPropagation();
      pointerId=e.pointerId;
      try{root.setPointerCapture?.(e.pointerId);}catch(_){}
    },{capture:true,passive:false});
    root.addEventListener('pointermove',e=>{
      if(pointerId==null||e.pointerId!==pointerId||!kind)return;
      e.preventDefault();
      e.stopPropagation();
      update(e.clientY);
    },{capture:true,passive:false});
    const endPointer=e=>{
      if(pointerId==null||e.pointerId!==pointerId)return;
      e.preventDefault?.();
      e.stopPropagation?.();
      try{if(root.hasPointerCapture?.(e.pointerId))root.releasePointerCapture?.(e.pointerId);}catch(_){}
      finish();
    };
    root.addEventListener('pointerup',endPointer,{capture:true,passive:false});
    root.addEventListener('pointercancel',endPointer,{capture:true,passive:false});
    root.addEventListener('lostpointercapture',e=>{if(pointerId!=null&&e.pointerId===pointerId)finish();},{capture:true});

    root.addEventListener('touchstart',e=>{
      if(pointerId!=null||kind||isActionTarget(e.target)||!e.changedTouches?.length)return;
      const touch=e.changedTouches[0];
      if(!start(e.target,touch.clientY))return;
      touchId=touch.identifier;
      e.preventDefault();
      e.stopPropagation();
    },{capture:true,passive:false});
    root.addEventListener('touchmove',e=>{
      if(touchId==null||!kind)return;
      const touch=[...(e.changedTouches||[])].find(t=>t.identifier===touchId)||[...(e.touches||[])].find(t=>t.identifier===touchId);
      if(!touch)return;
      e.preventDefault();
      e.stopPropagation();
      update(touch.clientY);
    },{capture:true,passive:false});
    const endTouch=e=>{
      if(touchId==null||!kind)return;
      const ended=[...(e.changedTouches||[])].some(t=>t.identifier===touchId);
      if(!ended)return;
      e.preventDefault?.();
      e.stopPropagation?.();
      finish();
    };
    root.addEventListener('touchend',endTouch,{capture:true,passive:false});
    root.addEventListener('touchcancel',endTouch,{capture:true,passive:false});

    root.addEventListener('mousedown',e=>{
      if('PointerEvent' in window||e.button!==0||isActionTarget(e.target))return;
      if(!start(e.target,e.clientY))return;
      e.preventDefault();
      e.stopPropagation();
      const move=ev=>{ev.preventDefault();update(ev.clientY);};
      const up=()=>{window.removeEventListener('mousemove',move);window.removeEventListener('mouseup',up);finish();};
      window.addEventListener('mousemove',move,{passive:false});
      window.addEventListener('mouseup',up,{once:true});
    },{capture:true,passive:false});
  },

  _enterDownloadRangePicker(anchorTs) {
    const result=downloadMethods._enterDownloadRangePicker.call(this,anchorTs);
    if(this._downloadRange){
      this._syncDownloadRangePickerDOM();
      this._wireDedicatedDownloadRangeDrag();
    }
    return result;
  }
};

// ── src/card/multiview/media-browser.js ──
/** Aggregate media-browser data and filters across all configured cameras. */
const multiviewMediaMethods = {
  _mediaFilterValues() {
    const values=browserMethods._mediaFilterValues.call(this);
    if(this._eventsMode==='all'){
      const cams=new Set(values.cams||[]);
      for(const config of (this._config?.cameras||[])){
        const cc=this._camCache?.[config.entity];
        if(cc?.cam)cams.add(String(cc.cam));
      }
      values.cams=[...cams].sort((a,b)=>String(a).localeCompare(String(b)));
    }
    return values;
  },

  async _loadAllCamsBackground() {
    const loadSeq=this._timelineLoadSeq;
    const now=Math.floor(Date.now()/1000);
    const isClipBrowser=this._eventsMode==='all'&&this._galleryMode==='clips';
    const bounds=isClipBrowser ? this._mediaQueryBounds(now) : {start:this._winStart,end:this._winEnd};
    const after=Math.max(0,Math.floor(Number(bounds?.start)||0));
    const before=Math.max(after+1,Math.floor(Number(bounds?.end)||now));
    const key=`${loadSeq}:${after}:${before}:${isClipBrowser?'clips':'timeline'}`;
    if(this._allCamsBackgroundPromise&&this._allCamsBackgroundKey===key) return this._allCamsBackgroundPromise;

    const task=(async()=>{
      const others=(this._config?.cameras||[]).filter(c=>{
        const cc=this._camCache?.[c.entity];
        return c.entity!==this._activeCam?.entity&&cc?.discovered&&cc.clientId&&cc.cam;
      });
      await Promise.all(others.map(async c=>{
        const cc=this._camCache[c.entity];
        try{
          const request={type:'frigate/events/get',instance_id:cc.clientId,cameras:[cc.cam],after,before,limit:isClipBrowser?500:200};
          if(isClipBrowser)request.has_clip=true;
          const ev=await this._ws(request);
          cc.events=Array.isArray(ev)?ev:[];
          this._mergeLoadedFilterMetadata(cc,cc.events,cc.reviews||[]);
        }catch(_){}
      }));
      if(loadSeq!==this._timelineLoadSeq||this._eventsMode!=='all')return;
      this._renderList();
      if(isClipBrowser&&this._galleryMode==='clips')this._renderGallery();
    })();

    this._allCamsBackgroundKey=key;
    this._allCamsBackgroundPromise=task;
    try{return await task;}
    finally{
      if(this._allCamsBackgroundPromise===task){
        this._allCamsBackgroundPromise=null;
        this._allCamsBackgroundKey='';
      }
    }
  },

  async _setGalleryMode(tab) {
    const result=await browserMethods._setGalleryMode.call(this,tab);
    if(tab==='clips'&&this._galleryMode==='clips'&&this._eventsMode==='all'){
      await this._loadAllCamsBackground();
      if(this._galleryMode==='clips')this._renderGallery();
    }
    return result;
  }
};

// ── src/card/multiview.js ──
/**
 * Multiview behavior composed from focused playback, timeline, and media modules.
 */
const multiviewMethods = Object.assign(
  {},
  multiviewCoreMethods,
  multiviewPlayerMethods,
  multiviewControllerMethods,
  multiviewTimelineMethods,
  multiviewMediaMethods,
);

// ── src/card/responsive-ux.js ──
/**
 * Responsive workspace policy and native timeline date-control integration.
 */
function clearStyle(el, prop) {
  try { el?.style?.removeProperty?.(prop); } catch(_) {}
}

function setImportant(el, prop, value) {
  try { el?.style?.setProperty?.(prop,value,'important'); } catch(_) {}
}

const responsiveUxMethods = {
  _measureResponsiveCardWidth() {
    const rect=Number(this.getBoundingClientRect?.().width||0);
    const client=Number(this.clientWidth||0);
    const offset=Number(this.offsetWidth||0);
    const cached=Number(this._cardWidth||0);
    return Math.max(0,rect||client||offset||cached||0);
  },

  _syncResponsiveWorkspace() {
    const card=this.shadowRoot?.querySelector?.('.card');
    if(!card) return;

    // Install the direct-hit native timeline date control during normal card
    // reconciliation, before the user can tap it. Creating it only from the
    // click handler is too late for iOS because the first gesture would still
    // belong to the synthetic/programmatic path.
    if(this._config?.timeline?.show_calendar_button!==false) this._ensureTimelineNativeDateInput?.();

    // Measure synchronously every time. The configured default gallery is
    // opened before ResizeObserver is installed during startup, so relying only
    // on the observer can misclassify a 1200px workstation as the narrow card
    // for its entire initial gallery render.
    const w=this._measureResponsiveCardWidth();
    if(w>0) this._cardWidth=w;
    const editorPreview=this._isEditorPreview?.()===true;
    const wide=!editorPreview && w>=560;
    const mobile=w>0 && w<420;
    const split=!editorPreview && w>=820;
    const workstation=!editorPreview && w>=1180;
    card.classList.toggle('editor-preview',editorPreview);
    card.classList.toggle('wide',wide);
    card.classList.toggle('mobile',mobile);
    card.classList.toggle('dashboard-split',split);
    card.classList.toggle('workstation',workstation);

    const galleryOpen=!!this._galleryMode;
    const timelineEnabled=this._config?.timeline?.enabled!==false;
    const playbackFull=card.classList.contains('playback-fullcard');
    card.classList.toggle('gallery-active',galleryOpen);

    const layout=this.shadowRoot.querySelector('.layout');
    const feed=this.shadowRoot.querySelector('.workspace-feed');
    const timelineWrap=this.shadowRoot.querySelector('.workspace-timeline');
    const timeline=this.shadowRoot.querySelector('#timeline-view');
    const media=this.shadowRoot.querySelector('.workspace-media');
    const engWrap=this.shadowRoot.querySelector('#eng-wrap');
    const grid=this.shadowRoot.querySelector('#cam-grid');

    // Full-card playback owns the workspace until media is dismissed. A resize
    // or HA dashboard reconciliation must not resurrect the normal timeline or
    // media panes while playback-layout.js still exposes only the feed grid
    // area. Doing so creates an implicit CSS-grid row/column that appears as a
    // large blank region beside/below the clip on wide dashboards.
    const showTimeline=!playbackFull && timelineEnabled && (!galleryOpen || split);
    if(showTimeline){
      clearStyle(timelineWrap,'display');
      clearStyle(timeline,'display');
    } else {
      setImportant(timelineWrap,'display','none');
      setImportant(timeline,'display','none');
    }

    if(playbackFull){
      setImportant(feed,'display','block');
      setImportant(media,'display','none');
      media?.setAttribute?.('aria-hidden','true');
      setImportant(engWrap,'display','block');
      setImportant(grid,'display','none');
    } else if(galleryOpen){
      setImportant(media,'display',workstation || (split&&!timelineEnabled) ? 'flex' : 'block');
      media?.setAttribute?.('aria-hidden','false');
    } else {
      setImportant(media,'display','none');
      media?.setAttribute?.('aria-hidden','true');
    }

    // In split/workstation layouts the live feed is a persistent pane even if
    // Clips/Recordings/Reviews is the selected/default tab. Narrow cards keep
    // the historical replacement model below the feed.
    if(split && !playbackFull){
      clearStyle(feed,'display');
      if(this._viewMode==='grid'){
        clearStyle(grid,'display');
      } else {
        clearStyle(engWrap,'display');
      }
    }

    // Derive the grid from panes that actually exist. Hiding a disabled
    // timeline without changing grid-template-areas leaves an empty column;
    // these templates eliminate that dead track entirely. playback-fullcard is
    // intentionally excluded because its single-pane template is owned by the
    // playback layout and must survive responsive reconciliation unchanged.
    if(layout && !playbackFull){
      if(workstation){
        if(timelineEnabled && galleryOpen){
          setImportant(layout,'grid-template-columns','minmax(440px,1.36fr) minmax(340px,.82fr) minmax(330px,.82fr)');
          setImportant(layout,'grid-template-areas','"feed timeline media"');
        } else if(timelineEnabled){
          setImportant(layout,'grid-template-columns','minmax(470px,1.48fr) minmax(360px,.86fr)');
          setImportant(layout,'grid-template-areas','"feed timeline"');
        } else if(galleryOpen){
          setImportant(layout,'grid-template-columns','minmax(500px,1.5fr) minmax(340px,.9fr)');
          setImportant(layout,'grid-template-areas','"feed media"');
        } else {
          setImportant(layout,'grid-template-columns','minmax(0,1fr)');
          setImportant(layout,'grid-template-areas','"feed"');
        }
      } else if(split){
        if(timelineEnabled && galleryOpen){
          setImportant(layout,'grid-template-columns','minmax(0,1.42fr) minmax(330px,.88fr)');
          setImportant(layout,'grid-template-areas','"feed timeline" "media media"');
        } else if(timelineEnabled){
          setImportant(layout,'grid-template-columns','minmax(0,1.42fr) minmax(330px,.88fr)');
          setImportant(layout,'grid-template-areas','"feed timeline"');
        } else if(galleryOpen){
          setImportant(layout,'grid-template-columns','minmax(0,1.38fr) minmax(300px,.86fr)');
          setImportant(layout,'grid-template-areas','"feed media"');
        } else {
          setImportant(layout,'grid-template-columns','minmax(0,1fr)');
          setImportant(layout,'grid-template-areas','"feed"');
        }
      } else {
        clearStyle(layout,'grid-template-columns');
        clearStyle(layout,'grid-template-areas');
      }
    }

    this._syncMediaGalleryScroll();
  },

  _syncMediaGalleryScroll() {
    const card=this.shadowRoot?.querySelector?.('.card');
    // Media is deliberately absent from the full-card playback workspace. Do
    // not let a stale gallery state reapply workstation height/flex rules while
    // a clip is occupying the single playback pane.
    if(card?.classList?.contains?.('playback-fullcard')) return;
    if(!this._galleryMode) return;
    const media=this.shadowRoot?.querySelector?.('.workspace-media');
    const gallery=this.shadowRoot?.querySelector?.('#media-gallery');
    const grid=this.shadowRoot?.querySelector?.('.media-gallery-grid');
    if(!card||!media||!gallery||!grid) return;

    const timelineEnabled=this._config?.timeline?.enabled!==false;
    const split=card.classList.contains('dashboard-split');
    const workstation=card.classList.contains('workstation');
    const sideBySide=workstation || (split && !timelineEnabled);

    setImportant(gallery,'min-height','0');
    setImportant(grid,'min-height','0');
    setImportant(grid,'overflow-y','auto');
    setImportant(grid,'overflow-x','hidden');
    setImportant(grid,'overscroll-behavior','contain');
    setImportant(grid,'touch-action','pan-y');
    setImportant(grid,'-webkit-overflow-scrolling','touch');
    setImportant(grid,'scrollbar-gutter','stable');

    if(sideBySide){
      setImportant(media,'height','var(--workspace-column-h,auto)');
      setImportant(media,'min-height','0');
      setImportant(media,'overflow','hidden');
      setImportant(media,'flex-direction','column');
      setImportant(gallery,'display','flex');
      setImportant(gallery,'flex-direction','column');
      setImportant(gallery,'height','100%');
      setImportant(gallery,'max-height','none');
      setImportant(gallery,'overflow','hidden');
      setImportant(grid,'flex','1 1 0');
      setImportant(grid,'height','auto');
      setImportant(grid,'max-height','none');
    } else {
      clearStyle(media,'height');
      clearStyle(media,'min-height');
      clearStyle(media,'overflow');
      setImportant(gallery,'display','flex');
      setImportant(gallery,'flex-direction','column');
      setImportant(gallery,'height','auto');
      setImportant(gallery,'max-height','none');
      clearStyle(gallery,'overflow');
      setImportant(grid,'flex','0 1 auto');
      setImportant(grid,'height','auto');
      // Replace the old hard-coded four-row browser with a viewport-aware cap.
      // Short result sets shrink naturally; long sets scroll without making the
      // whole Lovelace card grow indefinitely.
      const cap=Number(this._cardWidth||0)<420
        ? 'clamp(220px,52dvh,520px)'
        : 'clamp(240px,52dvh,620px)';
      setImportant(grid,'max-height',cap);
    }
  },

  _syncColHeight() {
    if(!this.shadowRoot?.querySelector) return;
    const card=this.shadowRoot.querySelector('.card');
    if(card?.classList?.contains?.('playback-fullcard')){
      // The remembered live/grid column height belongs to Multiview, not to
      // full-card playback. Leaving it set allows wide-pane sizing rules to
      // preserve empty vertical space even after those panes are hidden.
      card.style?.removeProperty?.('--workspace-column-h');
      return;
    }
    layoutMethods._syncColHeight.call(this);
    requestAnimationFrame(()=>this._syncMediaGalleryScroll());
  },

  _renderGallery(force=false) {
    const result=browserMethods._renderGallery.call(this,force);
    this._syncMediaGalleryScroll();
    return result;
  },

  async _applyInitialMediaState() {
    // Establish workstation/split classes before default_tab opens a gallery.
    // This keeps the already-mounted live feed visible on wide dashboards from
    // the first paint instead of waiting for ResizeObserver to correct layout.
    this._syncResponsiveWorkspace();
    const result=await coreMethods._applyInitialMediaState.call(this);
    this._syncResponsiveWorkspace();

    if(this._galleryMode && this.shadowRoot?.querySelector?.('.card')?.classList.contains('dashboard-split') && !this._playing){
      if(this._viewMode==='grid'){
        const grid=this.shadowRoot.querySelector('#cam-grid');
        if(grid && !grid.children?.length && typeof this._mountGrid==='function') await this._mountGrid();
      } else if(!this._engine && typeof this._mountEngine==='function') {
        await this._mountEngine();
      }
      const video=this._go2rtcLive?.video || this._findVideo?.(this._engine);
      if(video?.paused){ try { await video.play(); } catch(_) {} }
    }

    this._syncColHeight();
    return result;
  }
};

// ── src/card/ui/playback-layout.js ──
/**
 * Full-card playback presentation and return-to-live layout restoration.
 *
 * Playback transport remains owned by eventPlaybackMethods. This module only
 * adapts the surrounding dashboard workspace when media replaces a Multiview
 * feed, so layout policy is not mixed into decoding or Frigate media logic.
 */
const PLAYBACK_BACK_STYLE = [
  'position:absolute',
  'left:10px',
  'top:10px',
  'z-index:80',
  'display:inline-flex',
  'align-items:center',
  'gap:5px',
  'min-height:30px',
  'padding:5px 9px',
  'border:1px solid rgba(255,255,255,.24)',
  'border-radius:999px',
  'background:rgba(16,16,18,.72)',
  'color:#fff',
  'font:650 11px/1 -apple-system,BlinkMacSystemFont,system-ui,sans-serif',
  'box-shadow:0 5px 18px rgba(0,0,0,.30)',
  'backdrop-filter:blur(16px) saturate(160%)',
  '-webkit-backdrop-filter:blur(16px) saturate(160%)',
  'cursor:pointer',
  'appearance:none',
  '-webkit-appearance:none',
].join(';');

function queryPlaybackWorkspace(card) {
  const query=(selector)=>card.shadowRoot?.querySelector?.(selector);
  return {
    card: query('.card'),
    feed: query('.workspace-feed'),
    timeline: query('.workspace-timeline'),
    media: query('.workspace-media'),
    layout: query('.layout'),
    engine: query('#eng-wrap'),
    grid: query('#cam-grid'),
    camSwitcher: query('#cam-switcher'),
  };
}

function saveStyle(element,key,property) {
  if(!element) return;
  element.dataset[key]=element.style.getPropertyValue(property)||'';
}

function restoreStyle(element,key,property) {
  if(!element||!(key in element.dataset)) return;
  const value=element.dataset[key];
  if(value) element.style.setProperty(property,value);
  else element.style.removeProperty(property);
  delete element.dataset[key];
}

function showPlaybackReturnButton(card,engine,returnToGrid) {
  if(!engine) return;
  let button=engine.querySelector('#playback-back-live');
  if(!button) {
    button=document.createElement('button');
    button.type='button';
    button.id='playback-back-live';
    button.style.cssText=PLAYBACK_BACK_STYLE;
    engine.appendChild(button);
  }
  const label=returnToGrid?'Back to Multiview':'Back to Live';
  button.hidden=false;
  button.style.display='inline-flex';
  button.innerHTML=`${ICONS.back}<span>${label}</span>`;
  button.title=label;
  button.setAttribute('aria-label',label);
  button.onclick=()=>card._showLive();
  const icon=button.querySelector('svg');
  if(icon) {
    icon.style.width='13px';
    icon.style.height='13px';
  }
}

/**
 * Determine whether recorded media is replacing a visible Multiview player.
 *
 * `_viewMode` is the primary state, but Home Assistant can reconcile a wide
 * dashboard while the Clips side pane is open and briefly leave that flag out
 * of sync with the already-mounted grid. Playback should follow what the user
 * is actually looking at, so the DOM presentation is an intentional fallback.
 */
function isMultiviewPlaybackContext(card, workspace=queryPlaybackWorkspace(card)) {
  if(card?._viewMode==='grid') return true;
  if(workspace.card?.classList?.contains?.('grid-mode')) return true;

  const grid=workspace.grid;
  if(!grid || grid.style?.display==='none') return false;
  const hasMountedSlot=Boolean(grid.children?.length || grid.querySelector?.('.grid-slot:not(.placeholder)'));
  return hasMountedSlot;
}

const playbackLayoutMethods = {
  _enter(...args) {
    const workspace=queryPlaybackWorkspace(this);
    const returnToGrid=isMultiviewPlaybackContext(this,workspace);
    if(returnToGrid&&!this._playbackReturnViewMode) this._playbackReturnViewMode='grid';
    const result=eventPlaybackMethods._enter.apply(this,args);

    if(returnToGrid) {
      workspace.card?.classList.add('playback-fullcard');
      saveStyle(workspace.card,'playbackColumnHeight','--workspace-column-h');
      saveStyle(workspace.layout,'playbackDisplay','display');
      saveStyle(workspace.layout,'playbackGridColumns','grid-template-columns');
      saveStyle(workspace.layout,'playbackGridAreas','grid-template-areas');
      saveStyle(workspace.feed,'playbackDisplay','display');
      saveStyle(workspace.feed,'playbackGridColumn','grid-column');
      saveStyle(workspace.feed,'playbackGridRow','grid-row');
      saveStyle(workspace.feed,'playbackWidth','width');
      saveStyle(workspace.feed,'playbackHeight','height');
      saveStyle(workspace.feed,'playbackMinHeight','min-height');
      saveStyle(workspace.feed,'playbackMaxHeight','max-height');
      saveStyle(workspace.timeline,'playbackDisplay','display');
      saveStyle(workspace.media,'playbackDisplay','display');
      saveStyle(workspace.engine,'playbackDisplay','display');
      saveStyle(workspace.engine,'playbackWidth','width');
      saveStyle(workspace.engine,'playbackMaxWidth','max-width');
      saveStyle(workspace.grid,'playbackDisplay','display');
      saveStyle(workspace.camSwitcher,'playbackDisplay','display');

      // Multiview synchronizes timeline/media heights to the live grid column.
      // That measurement is meaningless once playback becomes a single pane and
      // was responsible for preserving a large empty area on wide dashboards.
      workspace.card?.style.removeProperty('--workspace-column-h');

      // Use a true one-pane flow instead of leaving a CSS Grid with hidden
      // workstation children. This also prevents an accidental responsive
      // re-show from creating an implicit grid track beside/below playback.
      workspace.layout?.style.setProperty('display','block','important');
      workspace.layout?.style.setProperty('grid-template-columns','minmax(0, 1fr)','important');
      workspace.layout?.style.setProperty('grid-template-areas','"feed"','important');
      workspace.feed?.style.setProperty('display','block','important');
      workspace.feed?.style.setProperty('grid-column','1 / -1','important');
      workspace.feed?.style.setProperty('grid-row','1','important');
      workspace.feed?.style.setProperty('width','100%','important');
      workspace.feed?.style.setProperty('height','auto','important');
      workspace.feed?.style.setProperty('min-height','0','important');
      workspace.feed?.style.setProperty('max-height','none','important');
      workspace.timeline?.style.setProperty('display','none','important');
      workspace.media?.style.setProperty('display','none','important');
      workspace.engine?.style.setProperty('display','block','important');
      workspace.engine?.style.setProperty('width','100%','important');
      workspace.engine?.style.setProperty('max-width','none','important');
      workspace.grid?.style.setProperty('display','none','important');
      workspace.camSwitcher?.style.setProperty('display','none','important');
    }

    showPlaybackReturnButton(this,workspace.engine,returnToGrid);
    return result;
  },

  _showLive(...args) {
    const returnToGrid=this._playbackReturnViewMode==='grid';
    const returningFromPlayback=Boolean(
      this._playing || this._activePlaybackCleanup || this._playbackSession || this._playbackReturnViewMode
    );
    const result=eventPlaybackMethods._showLive.apply(this,args);
    this._playbackReturnViewMode=null;
    const workspace=queryPlaybackWorkspace(this);
    const back=workspace.engine?.querySelector('#playback-back-live');

    if(back) {
      back.hidden=true;
      back.style.display='none';
    }
    workspace.card?.classList.remove('playback-fullcard');
    restoreStyle(workspace.card,'playbackColumnHeight','--workspace-column-h');
    restoreStyle(workspace.layout,'playbackDisplay','display');
    restoreStyle(workspace.layout,'playbackGridColumns','grid-template-columns');
    restoreStyle(workspace.layout,'playbackGridAreas','grid-template-areas');
    restoreStyle(workspace.feed,'playbackDisplay','display');
    restoreStyle(workspace.feed,'playbackGridColumn','grid-column');
    restoreStyle(workspace.feed,'playbackGridRow','grid-row');
    restoreStyle(workspace.feed,'playbackWidth','width');
    restoreStyle(workspace.feed,'playbackHeight','height');
    restoreStyle(workspace.feed,'playbackMinHeight','min-height');
    restoreStyle(workspace.feed,'playbackMaxHeight','max-height');
    restoreStyle(workspace.timeline,'playbackDisplay','display');
    restoreStyle(workspace.media,'playbackDisplay','display');
    restoreStyle(workspace.engine,'playbackDisplay','display');
    restoreStyle(workspace.engine,'playbackWidth','width');
    restoreStyle(workspace.engine,'playbackMaxWidth','max-width');
    restoreStyle(workspace.grid,'playbackDisplay','display');
    restoreStyle(workspace.camSwitcher,'playbackDisplay','display');

    if(returnToGrid) {
      if(workspace.engine) workspace.engine.style.display='none';
      if(workspace.grid) workspace.grid.style.display='';
      this._eventsMode='all';
      this._mountGrid();
      this._renderCamSwitcher();
    }
    this._syncResponsiveWorkspace?.();
    // Full-card playback temporarily changes the Multiview workspace and can
    // cross a card/layout lifecycle boundary in desktop Home Assistant. Refresh
    // the complete scrub binding set only when actually returning from media.
    if(returningFromPlayback) this._refreshTimelineInteractionWiring?.(true);
    // Re-measure the restored grid/timeline only after normal responsive
    // visibility is back. This prevents the playback player's height from being
    // reused as the next Multiview synchronized-column height.
    if(returnToGrid) requestAnimationFrame(()=>this._syncColHeight?.());
    return result;
  },
};

// ── src/card/SightlineCard.js ──
/**
 * Sightline custom-card element and behavior composition root.
 *
 * Feature modules expose method groups instead of mutating the prototype at
 * import time. The order below is intentional: base capabilities are composed
 * first, then cross-camera/responsive UI adaptations, and finally playback
 * layout policy where an override is required.
 */
class SightlineCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    initializeCardState(this);
  }

  static getConfigElement() {
    return document.createElement(`${CARD_TAG}-editor`);
  }

  static getStubConfig() {
    return { camera_entity: 'camera.front_door' };
  }
}

applyMethodGroups(
  SightlineCard.prototype,
  coreMethods,
  liveMethods,
  talkMethods,
  dataMethods,
  renderShellMethods,
  layoutMethods,
  browserMethods,
  eventPlaybackMethods,
  recordingPlaybackMethods,
  actionMethods,
  timelineInteractionMethods,
  timelineRenderMethods,
  listMethods,
  downloadMethods,
  multiviewMethods,
  responsiveUxMethods,
  playbackLayoutMethods,
);

// ── src/editor/registry.js ──
/**
 * Home Assistant / Frigate entity discovery for the visual editor.
 *
 * Entity-registry ownership is authoritative when available; configured camera
 * entities are retained as a fallback so temporary HA availability changes do
 * not make an existing card impossible to edit.
 */
const editorRegistryMethods = {
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

// ── src/editor/render.js ──
/** Render the visual editor form and bind its local controls. */
const editorRenderMethods = {
_render() {
    // The selector is intentionally Frigate-only. Do not fall back to every
    // camera entity simply because registry discovery returned an empty list.
    const entityList = this._frigateEntities();

    const cams = this._config?.cameras
      ? this._config.cameras
      : (this._config?.camera_entity ? [{ entity: this._config.camera_entity, name: this._config?.title || '' }] : [{ entity: '', name: '' }]);

    const esc=(v)=>String(v??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    const opts = (sel) => entityList.map(e => `<option value="${esc(e)}" ${e===sel?'selected':''}>${esc(this._entityOptionLabel(e))}</option>`).join('');

    const camRows = cams.map((c,i) => `
      <div class="cam-block" data-row="${i}">
        <div class="cr">
          <select name="cam-entity-${i}" class="ce" data-cam-entity="${i}">
            <option value="">— select camera —</option>
            ${opts(c.entity||'')}
          </select>
          <input type="text" name="cam-name-${i}" class="cn" data-cam-name="${i}" placeholder="Display name (optional)" value="${c.name||''}">
          ${cams.length > 1 ? `<button class="xb" data-remove-cam="${i}" title="Remove">✕</button>` : ''}
        </div>
        <div class="cam-advanced">
          <input type="text" class="tf" data-cam-client="${i}" placeholder="Frigate instance/client ID (optional)" value="${c.frigate_client_id||''}">
          <input type="text" class="tf" data-cam-stream="${i}" placeholder="go2rtc stream name (optional)" value="${c.go2rtc_stream||''}">
        </div>
      </div>`).join('');

    const hiddenTabs = new Set(this._config?.hidden_tabs || []);
    const tabCheck = (id, label) => `<label class="chk-lbl">
      <input type="checkbox" name="hide-${id}" data-hide-tab="${id}" ${hiddenTabs.has(id)?'checked':''}> ${label}
    </label>`;

    const defaultView = this._config?.default_view || 'single';
    const rotateOnLoad = this._config?.rotate_on_load === true;
    const tl=this._config?.timeline||{};
    const dl=this._config?.download||{};
    const med=this._config?.media||{};
    const usableCamCount = cams.filter(c=>c?.entity).length;
    const multiCam = usableCamCount > 1;
    const editorDark = this._hass?.themes?.darkMode ?? window.matchMedia?.('(prefers-color-scheme: dark)')?.matches ?? false;

    this.innerHTML = `<style>
      .ed-wrap{
        --ed-bg:#fbfbfd;--ed-panel:#ffffff;--ed-panel2:#f4f4f7;--ed-text:#1f2937;--ed-muted:#667085;
        --ed-border:#d8dbe2;--ed-accent:#2563eb;
        display:flex;flex-direction:column;gap:14px;padding:14px;border-radius:14px;
        font-family:-apple-system,BlinkMacSystemFont,"SF Pro Text",system-ui,sans-serif;
        background:var(--ed-bg)!important;color:var(--ed-text)!important;border:1px solid var(--ed-border)!important;
        box-shadow:0 1px 2px rgba(0,0,0,.08);
      }
      .ed-wrap.dark{--ed-bg:#17171a;--ed-panel:#222226;--ed-panel2:#2b2b30;--ed-text:#f5f5f7;--ed-muted:#b4b4bd;--ed-border:#3a3a40;--ed-accent:#64a7ff;}
      .field-label{font-size:12px;font-weight:650;margin-bottom:4px;display:block;color:var(--ed-text);}
      .section{border-top:1px solid var(--ed-border);padding-top:12px;}
      .cam-block{padding:8px;border:1px solid var(--ed-border);border-radius:9px;margin-bottom:8px;background:var(--ed-panel2)!important;}
      .cr{display:flex;gap:5px;align-items:center;margin-bottom:6px;}
      .cam-advanced{display:grid;grid-template-columns:1fr 1fr;gap:6px;}
      .adv-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px 10px;margin-top:8px;}
      .adv-grid .full{grid-column:1/-1;}
      .mini-help{display:block;color:var(--ed-muted);font-size:10px;margin-top:3px;line-height:1.35;}
      details.config-group{border-top:1px solid var(--ed-border);padding-top:10px;}
      details.config-group summary{cursor:pointer;font-size:12px;font-weight:700;color:var(--ed-text);user-select:none;}
      details.config-group[open] summary{margin-bottom:9px;}
      @media(max-width:520px){.adv-grid,.cam-advanced{grid-template-columns:1fr;}}
      .ce,.cn{flex:1;padding:7px;border:1px solid var(--ed-border);border-radius:6px;font-size:12px;box-sizing:border-box;background:var(--ed-panel)!important;color:var(--ed-text)!important;}
      .ce{min-width:0;} .cn{min-width:0;}
      .xb{padding:5px 8px;border:1px solid #f87171;background:#fee2e2;color:#b91c1c;border-radius:6px;cursor:pointer;font-size:12px;flex-shrink:0;}
      .add-btn{padding:6px 12px;border:1px solid color-mix(in srgb,var(--ed-accent) 55%,transparent);background:color-mix(in srgb,var(--ed-accent) 12%,var(--ed-panel));color:var(--ed-accent);border-radius:7px;cursor:pointer;font-size:12px;margin-top:2px;}
      .tf{width:100%;padding:7px;border:1px solid var(--ed-border);border-radius:6px;font-size:12px;box-sizing:border-box;background:var(--ed-panel)!important;color:var(--ed-text)!important;}
      .range{width:100%;margin:8px 0 2px;accent-color:var(--ed-accent);cursor:pointer;}
      .range-value{min-width:42px;padding:3px 7px;border:1px solid var(--ed-border);border-radius:999px;background:var(--ed-panel2);color:var(--ed-text);font-size:11px;font-weight:700;text-align:center;font-variant-numeric:tabular-nums;}
      .radio-row,.chk-row{display:flex;gap:14px;flex-wrap:wrap;}
      .radio-lbl,.chk-lbl{display:flex;align-items:center;gap:5px;font-size:12px;cursor:pointer;color:var(--ed-text);}
      .ed-wrap small,.ed-wrap [style*="color:#6b7280"]{color:var(--ed-muted)!important;}
      .ed-wrap input::placeholder{color:var(--ed-muted);opacity:.85;}
      .ed-wrap select,.ed-wrap input{color-scheme:light;}
      .ed-wrap.dark select,.ed-wrap.dark input{color-scheme:dark;}
      .ed-wrap .ce,.ed-wrap .cn,.ed-wrap .tf{background:var(--ed-panel)!important;color:var(--ed-text)!important;border-color:var(--ed-border)!important;}
      .ed-wrap details.config-group,.ed-wrap .section{color:var(--ed-text)!important;}
      .ed-wrap input:disabled,.ed-wrap select:disabled{opacity:.48;cursor:not-allowed;}
      .chk-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:4px;}
    
</style>
    <div class="ed-wrap ${editorDark?'dark':''}">
      <div>
        <span class="field-label">Cameras (up to 4) ${entityList.length ? '<small style="font-weight:400;color:var(--ed-muted)">· Frigate cameras detected</small>' : ''}</span>
        <div id="cam-list">${camRows}</div>
        ${cams.length < 4 ? `<button class="add-btn" id="add-cam">+ Add camera</button>` : ''}
      </div>

      <div class="section">
        <span class="field-label">Colors</span>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:4px;">
          <div>
            <label class="chk-lbl" style="margin-bottom:4px">
              <input type="checkbox" id="use_accent" ${this._config?.accent_color?'checked':''}> Custom accent
            </label>
            <div style="display:flex;align-items:center;gap:6px">
              <input type="color" id="accent_color" value="${this._config?.accent_color||'#3b82f6'}" style="width:40px;height:30px;border:none;padding:2px;border-radius:6px;cursor:pointer">
              <span style="font-size:11px;color:#6b7280" id="accent_lbl">${this._config?.accent_color||'#3b82f6'}</span>
            </div>
          </div>
          <div>
            <label class="chk-lbl" style="margin-bottom:4px">
              <input type="checkbox" id="use_bg" ${this._config?.bg_color?'checked':''}> Custom background
            </label>
            <div style="display:flex;align-items:center;gap:6px">
              <input type="color" id="bg_color" value="${this._config?.bg_color||'#1c2233'}" style="width:40px;height:30px;border:none;padding:2px;border-radius:6px;cursor:pointer">
              <span style="font-size:11px;color:#6b7280" id="bg_lbl">${this._config?.bg_color||'#1c2233'}</span>
            </div>
          </div>
        </div>
        <small style="color:#6b7280;font-size:11px">Check the box to activate. Uncheck to revert to theme default.</small>
        <div class="transparency-row" style="margin-top:12px">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:10px">
            <span class="field-label" style="margin:0">Card transparency</span>
            <span class="range-value" id="transparency_lbl">${Math.round(Number(this._config?.transparency)||0)}%</span>
          </div>
          <input class="range" id="transparency" type="range" min="0" max="100" step="1" value="${Math.round(Number(this._config?.transparency)||0)}">
          <small class="mini-help">0% preserves the normal card material. Higher values reveal the Lovelace background/wallpaper. Custom background, when enabled, becomes the glass tint. Video remains opaque.</small>
        </div>
      </div>

      <div class="section">
        <span class="field-label">Theme</span>
        <div class="radio-row">
          <label class="radio-lbl"><input type="radio" name="theme" value="dark"  ${(this._config?.theme||'dark')==='dark' ?'checked':''}> Dark</label>
          <label class="radio-lbl"><input type="radio" name="theme" value="light" ${this._config?.theme==='light'?'checked':''}> Light</label>
          <label class="radio-lbl"><input type="radio" name="theme" value="auto"  ${this._config?.theme==='auto' ?'checked':''}> Auto (Home Assistant)</label>
        </div>
      </div>

      <div class="section">
        <span class="field-label">View</span>
        <div class="radio-row">
          <label class="radio-lbl"><input type="radio" name="default_view" value="single" ${defaultView==='single'?'checked':''}> Single camera</label>
          <label class="radio-lbl"><input type="radio" name="default_view" value="grid" ${defaultView==='grid'?'checked':''} ${usableCamCount<2?'disabled':''}> Grid (all cams)</label>
        </div>
        ${usableCamCount<2?'<small class="mini-help">Grid view becomes available when at least two camera entities are configured.</small>':''}
        <div style="margin-top:8px">
          <label class="chk-lbl"><input type="checkbox" name="rotate_on_load" id="rotate_on_load" ${rotateOnLoad?'checked':''} ${usableCamCount<2?'disabled':''}> Auto-rotate on load</label>
        </div>
        <div style="margin-top:6px">
          <label><span style="font-size:11px;color:#6b7280">Rotate interval (seconds, 0 = use default ${DEFAULT_ROTATE_S}s)</span>
            <input name="rotate_seconds" class="tf" id="rotate_seconds" type="number" value="${this._config?.rotate_seconds??0}" min="0" style="margin-top:3px">
          </label>
        </div>
      </div>

      <div class="section">
        <span class="field-label">Hidden tabs</span>
        <div class="chk-grid">
          ${tabCheck('clips','Clips')}
          ${tabCheck('recordings','Recordings')}
          ${tabCheck('reviews','Reviews')}
        </div>
      </div>

      <div class="section">
        <span class="field-label">Stream height (vh, optional)</span>
        <input name="stream_height" class="tf" id="stream_height" type="number"
          value="${this._config?.stream_height||''}" min="20" max="100"
          placeholder="Blank = use aspect ratio">
        <small class="mini-help">Blank: Aspect ratio controls the player height. Set a value (for example 50) to force 50vh on the dashboard; an explicit height intentionally overrides Aspect ratio. The editor preview scales/caps this only for readability.</small>
      </div>

      <div class="section">
        <span class="field-label">Live stream</span>
        <div class="radio-row" style="margin-bottom:8px">
          <label class="radio-lbl"><input type="radio" name="stream_type" value="webrtc" ${(this._config?.stream_type||'webrtc')==='webrtc'?'checked':''}> WebRTC</label>
          <label class="radio-lbl"><input type="radio" name="stream_type" value="hls" ${this._config?.stream_type==='hls'?'checked':''}> HLS</label>
        </div>
        <small style="color:#6b7280;font-size:11px">WebRTC needs a backend that supports it (go2rtc bundled in Frigate 0.13+, or RTSPtoWebRTC). If a stream won't start, switch back to HLS.</small>

        <div style="margin-top:10px">
          <label class="chk-lbl">
            <input type="checkbox" id="stream_resizable" ${this._config?.stream_resizable?'checked':''}> Let me drag-resize the live view
          </label>
        </div>

        <div style="margin-top:10px">
          <span style="font-size:11px;color:#6b7280;display:block;margin-bottom:3px">Aspect ratio</span>
          <select class="tf" id="aspect_ratio_preset">
            ${['16:9','4:3','1:1','21:9','9:16','auto','custom'].map(v => {
              const cur = this._config?.aspect_ratio || 'auto';
              const isCustom = cur && !['16:9','4:3','1:1','21:9','9:16','auto'].includes(cur);
              const selected = (v === 'custom' && isCustom) || cur === v;
              const label = v === 'auto' ? 'Auto (selected camera)' : v === 'custom' ? 'Custom…' : v;
              return `<option value="${v}" ${selected?'selected':''}>${label}</option>`;
            }).join('')}
          </select>
          <input class="tf" id="aspect_ratio_custom" type="text" placeholder="e.g. 3:2"
            value="${(this._config?.aspect_ratio && !['16:9','4:3','1:1','21:9','9:16','auto'].includes(this._config.aspect_ratio)) ? this._config.aspect_ratio : ''}"
            style="margin-top:6px;display:${(this._config?.aspect_ratio && !['16:9','4:3','1:1','21:9','9:16','auto'].includes(this._config.aspect_ratio)) ? 'block' : 'none'}">
        </div>
      </div>

      <div class="section">
        <span class="field-label">Data & browser</span>
        <div class="adv-grid">
          <label><span class="field-label">Browser history window (hours)</span><input class="tf" id="window_hours" type="number" min="1" max="720" value="${this._config?.window_hours||24}"><small class="mini-help">Initial events/reviews history loaded for browsing.</small></label>
          <label><span class="field-label">Refresh interval (seconds)</span><input class="tf" id="refresh_seconds" type="number" min="15" max="3600" value="${this._config?.refresh_seconds||45}"><small class="mini-help">Background Frigate metadata/event refresh.</small></label>
          <label><span class="field-label">Reviews default</span><select class="tf" id="reviewed_default"><option value="all" ${(med.reviewed_default||'all')==='all'?'selected':''}>All</option><option value="unreviewed" ${med.reviewed_default==='unreviewed'?'selected':''}>Unreviewed</option><option value="reviewed" ${med.reviewed_default==='reviewed'?'selected':''}>Reviewed</option></select></label>
        </div>
      </div>

      <details class="config-group" open>
        <summary>Timeline</summary>
        <div class="adv-grid">
          <label class="chk-lbl"><input type="checkbox" id="timeline_enabled" ${tl.enabled!==false?'checked':''}> Show timeline on Live</label>
          <label><span class="field-label">Default zoom (minutes)</span><input class="tf" id="timeline_default_minutes" type="number" min="5" max="60" value="${tl.default_minutes??10}"></label>
          <label class="chk-lbl"><input type="checkbox" id="timeline_show_thumbnails" ${tl.show_thumbnails!==false?'checked':''}> Event thumbnails</label>
          <label class="chk-lbl"><input type="checkbox" id="timeline_show_glyphs" ${tl.show_glyphs!==false?'checked':''}> Detection glyphs</label>
          <label class="chk-lbl"><input type="checkbox" id="timeline_show_legend" ${tl.show_legend!==false?'checked':''}> Detection legend</label>
          <label class="chk-lbl"><input type="checkbox" id="timeline_show_zoom_controls" ${tl.show_zoom_controls!==false?'checked':''}> Zoom controls</label>
          <label class="chk-lbl"><input type="checkbox" id="timeline_show_filter_button" ${tl.show_filter_button!==false?'checked':''}> Filter button</label>
          <label class="chk-lbl"><input type="checkbox" id="timeline_show_calendar_button" ${tl.show_calendar_button!==false?'checked':''}> Calendar button</label>
          <label class="chk-lbl"><input type="checkbox" id="timeline_clustering" ${tl.clustering!==false?'checked':''}> Cluster nearby detections</label>
          <label><span class="field-label">Same-label merge gap (s)</span><input class="tf" id="timeline_same_label_cluster_seconds" type="number" min="0" max="120" value="${tl.same_label_cluster_seconds??12}"></label>
          <label><span class="field-label">Burst cluster max gap (s)</span><input class="tf" id="timeline_visual_cluster_max_seconds" type="number" min="0" max="300" value="${tl.visual_cluster_max_seconds??60}"></label>
          <label><span class="field-label">Max glyphs per burst</span><input class="tf" id="timeline_max_glyphs" type="number" min="1" max="6" value="${tl.max_glyphs??3}"></label>
          <label><span class="field-label">Glyph min size (px)</span><input class="tf" id="timeline_glyph_min_px" type="number" min="12" max="40" value="${tl.glyph_min_px??20}"></label>
          <label><span class="field-label">Glyph max size (px)</span><input class="tf" id="timeline_glyph_max_px" type="number" min="12" max="48" value="${tl.glyph_max_px??30}"></label>
          <label><span class="field-label">Max visible thumbnails</span><input class="tf" id="timeline_max_thumbnails" type="number" min="0" max="24" value="${tl.max_thumbnails??12}"><small class="mini-help">0 hides them. Actual count still adapts to timeline height.</small></label>
        </div>
      </details>

      <details class="config-group">
        <summary>Recording downloads</summary>
        <div class="adv-grid">
          <label><span class="field-label">Initial trim range (seconds)</span><input class="tf" id="download_default_range_seconds" type="number" min="2" max="1800" value="${dl.default_range_seconds??60}"></label>
          <label><span class="field-label">Maximum trim range (minutes)</span><input class="tf" id="download_max_range_minutes" type="number" min="1" max="720" value="${dl.max_range_minutes??120}"></label>
        </div>
      </details>

      <div class="section">
        <span class="field-label">YAML</span>
        <small class="mini-help">Advanced editor keys are stored as <code>timeline:</code>, <code>download:</code>, and <code>media:</code>. Every option above can also be set directly in Lovelace YAML.</small>
      </div>

      <div class="section">
        <span class="field-label">Two-way audio (talk)</span>
        <label class="chk-lbl" style="margin-bottom:8px">
          <input type="checkbox" id="two_way_audio" ${this._config?.two_way_audio ? 'checked' : ''}> Enable talk button when a microphone is detected
        </label>
        <label><span style="font-size:11px;color:#6b7280">Talk session disconnect delay (seconds; 0 = keep connected)</span>
          <input name="two_way_audio_disconnect_seconds" class="tf" id="two_way_audio_disconnect_seconds" type="number" min="0" step="1"
            value="${this._config?.two_way_audio_disconnect_seconds ?? 90}" style="margin-top:3px">
        </label>
        <small style="color:#6b7280;font-size:11px">Live video and talk are routed only through the Home Assistant Frigate integration's authenticated <code>/api/frigate/&lt;instance&gt;/go2rtc/…</code> proxy. The card never connects the browser directly to a Frigate or go2rtc host.</small>
        <small style="color:#6b7280;font-size:11px">
          Requires go2rtc configured with a two-way-audio source for this camera, HTTPS (or localhost), and a browser-detected audio input. The button stays hidden when no microphone is available.
          By default the go2rtc stream name is assumed to match the Frigate camera name — override per-camera with
          <code>go2rtc_stream</code> in YAML if yours differs.
        </small>
      </div>

    </div>`;

    this.querySelector('#add-cam')?.addEventListener('click', () => {
      const cur = this._getCams(); cur.push({ entity:'', name:'' });
      this._config = { ...this._config, cameras: cur }; delete this._config.camera_entity; this._render(); this._dispatch();
    });
    this.querySelectorAll('[data-remove-cam]').forEach(b => b.addEventListener('click', e => {
      const cur = this._getCams(); cur.splice(Number(e.currentTarget.dataset.removeCam), 1);
      this._config = { ...this._config, cameras: cur }; delete this._config.camera_entity; this._render(); this._dispatch();
    }));
    this.querySelectorAll('select,input').forEach(el => el.addEventListener('change', () => this._u()));
    // show/hide the custom aspect-ratio field based on the preset dropdown
    this.querySelector('#aspect_ratio_preset')?.addEventListener('change', e => {
      const customInput = this.querySelector('#aspect_ratio_custom');
      if (customInput) customInput.style.display = e.target.value === 'custom' ? 'block' : 'none';
    });
    // prevent click outside from closing select while user is choosing
    this.querySelectorAll('select').forEach(sel => sel.addEventListener('mousedown', e => e.stopPropagation()));
    // sync color picker label as user drags
    ['accent','bg'].forEach(key => {
      const picker = this.querySelector(`#${key}_color`);
      const lbl    = this.querySelector(`#${key}_lbl`);
      if (picker && lbl) picker.addEventListener('input', () => { lbl.textContent = picker.value; });
    });
    const transparency=this.querySelector('#transparency');
    const transparencyLbl=this.querySelector('#transparency_lbl');
    if(transparency && transparencyLbl){
      transparency.addEventListener('input',()=>{transparencyLbl.textContent=`${transparency.value}%`;});
    }

    // Startup behavior lives in the main editor render path rather than a
    // prototype wrapper, so every editable setting has a single owner.
    const defaultTab=['live','clips','recordings','reviews'].includes(this._config?.default_tab)
      ? this._config.default_tab
      : 'live';
    const thumbnailSize=Math.max(48,Math.min(140,Number(this._config?.timeline?.thumbnail_size ?? 84)));
    const startup=document.createElement('div');
    startup.id='startup-options';
    startup.className='section';
    startup.innerHTML=`
      <span class="field-label">Startup & timeline previews</span>
      <div class="adv-grid">
        <label>
          <span class="field-label">Default tab</span>
          <select class="tf" id="default_tab">
            <option value="live" ${defaultTab==='live'?'selected':''}>Live</option>
            <option value="clips" ${defaultTab==='clips'?'selected':''}>Clips</option>
            <option value="recordings" ${defaultTab==='recordings'?'selected':''}>Recordings</option>
            <option value="reviews" ${defaultTab==='reviews'?'selected':''}>Reviews</option>
          </select>
        </label>
        <label class="chk-lbl">
          <input type="checkbox" id="autoplay_latest_clip" ${this._config?.autoplay_latest_clip?'checked':''}>
          Autoplay newest clip on startup
        </label>
        <label>
          <span class="field-label">Timeline thumbnail size (px)</span>
          <input class="tf" id="timeline_thumbnail_size" type="number" min="48" max="140" value="${thumbnailSize}">
        </label>
      </div>`;
    (this.querySelector('.ed-wrap')||this).appendChild(startup);
    for(const control of startup.querySelectorAll('input,select')) {
      control.addEventListener('change',()=>this._u());
    }
  }
};

// ── src/editor/config.js ──
/** Read editor controls, normalize card configuration, and emit HA updates. */
const editorConfigMethods = {
setConfig(c) { this._config=c; this._render(); },

_getCams() {
    const rows = [...this.querySelectorAll('[data-row]')];
    return rows.map(r => ({
      entity: r.querySelector('[data-cam-entity]')?.value || '',
      name: r.querySelector('[data-cam-name]')?.value || '',
      frigate_client_id: r.querySelector('[data-cam-client]')?.value?.trim() || '',
      go2rtc_stream: r.querySelector('[data-cam-stream]')?.value?.trim() || '',
    }));
  },

_u() {
    const g = id => this.querySelector('#'+id)?.value?.trim() || '';
    const cams = this._getCams().filter(c => c.entity);
    const c = { ...this._config };
    if (cams.length > 1 || (cams.length===1 && (cams[0].name || cams[0].frigate_client_id || cams[0].go2rtc_stream))) { c.cameras = cams; delete c.camera_entity; }
    else if (cams.length === 1) { c.camera_entity = cams[0].entity; delete c.cameras; }
    const w=g('window_hours'),r=g('rotate_seconds');
    // Legacy header/browser settings no longer have a visual surface. Per-camera
    // display names replace `title`; the unified media galleries replace
    // `browse_expanded`. Do not keep writing dead settings from the UI editor.
    delete c.title;
    delete c.subtitle;
    delete c.browse_expanded;
    c.window_hours=Math.max(1,Math.min(720,Number(w)||24));
    c.rotate_seconds = Math.max(0,Math.min(3600,Number(r)||0));
    c.refresh_seconds=Math.max(15,Math.min(3600,Number(g('refresh_seconds')||45)));
    // custom colors
    c.accent_color = this.querySelector('#use_accent')?.checked
      ? (this.querySelector('#accent_color')?.value || null) : null;
    c.bg_color = this.querySelector('#use_bg')?.checked
      ? (this.querySelector('#bg_color')?.value || null) : null;
    c.transparency = Math.max(0,Math.min(100,Number(this.querySelector('#transparency')?.value)||0));
    // theme
    c.theme = this.querySelector('input[name="theme"]:checked')?.value || 'dark';
    // default view
    const dv = this.querySelector('input[name="default_view"]:checked')?.value || 'single';
    c.default_view = (dv==='grid' && cams.length>1) ? 'grid' : 'single';
    // rotate on load only has meaning with multiple configured cameras
    c.rotate_on_load = cams.length>1 && this.querySelector('#rotate_on_load')?.checked === true;
    // hidden tabs
    const hidden = [...this.querySelectorAll('[data-hide-tab]')]
      .filter(el => el.checked).map(el => el.dataset.hideTab);
    c.hidden_tabs = hidden.length ? hidden : [];
    const sh = this.querySelector('#stream_height')?.value;
    c.stream_height = sh ? Math.max(20,Math.min(100,Number(sh))) : null;
    // live stream: protocol, resizable, aspect ratio
    c.stream_type = this.querySelector('input[name="stream_type"]:checked')?.value === 'hls' ? 'hls' : 'webrtc';
    c.stream_resizable = this.querySelector('#stream_resizable')?.checked === true;
    const arPreset = this.querySelector('#aspect_ratio_preset')?.value || 'auto';
    if (arPreset === 'custom') {
      const custom = this.querySelector('#aspect_ratio_custom')?.value?.trim();
      c.aspect_ratio = custom || 'auto';
    } else {
      c.aspect_ratio = arPreset;
    }
    // advanced timeline / download / media settings
    c.timeline = { ...(this._config?.timeline || {}),
      enabled: this.querySelector('#timeline_enabled')?.checked !== false,
      default_minutes: Math.max(5,Math.min(60,Number(g('timeline_default_minutes')||10))),
      show_thumbnails: this.querySelector('#timeline_show_thumbnails')?.checked !== false,
      show_glyphs: this.querySelector('#timeline_show_glyphs')?.checked !== false,
      show_legend: this.querySelector('#timeline_show_legend')?.checked !== false,
      show_zoom_controls: this.querySelector('#timeline_show_zoom_controls')?.checked !== false,
      show_filter_button: this.querySelector('#timeline_show_filter_button')?.checked !== false,
      show_calendar_button: this.querySelector('#timeline_show_calendar_button')?.checked !== false,
      clustering: this.querySelector('#timeline_clustering')?.checked !== false,
      same_label_cluster_seconds: Math.max(0,Math.min(120,Number(g('timeline_same_label_cluster_seconds')||12))),
      visual_cluster_max_seconds: Math.max(0,Math.min(300,Number(g('timeline_visual_cluster_max_seconds')||60))),
      glyph_min_px: Math.max(12,Math.min(40,Number(g('timeline_glyph_min_px')||20))),
      glyph_max_px: Math.max(12,Math.min(48,Number(g('timeline_glyph_max_px')||30))),
      max_glyphs: Math.max(1,Math.min(6,Math.round(Number(g('timeline_max_glyphs')||3)))),
      max_thumbnails: Math.max(0,Math.min(24,Math.round(Number(g('timeline_max_thumbnails')||12)))),
      thumbnail_size: Math.max(48,Math.min(140,Math.round(Number(g('timeline_thumbnail_size')||84)))),
    };
    if(c.timeline.glyph_max_px<c.timeline.glyph_min_px)c.timeline.glyph_max_px=c.timeline.glyph_min_px;
    const dlMax=Math.max(1,Math.min(720,Number(g('download_max_range_minutes')||120)));
    c.download = {
      default_range_seconds: Math.min(Math.round(dlMax*60),Math.max(2,Math.min(1800,Math.round(Number(g('download_default_range_seconds')||60))))),
      max_range_minutes: dlMax,
    };
    c.media = { reviewed_default: this.querySelector('#reviewed_default')?.value || 'all' };

    // Startup behavior. Hidden tabs cannot be selected as the initial view.
    const requestedTab=this.querySelector('#default_tab')?.value||'live';
    c.default_tab=requestedTab!=='live'&&hidden.includes(requestedTab)?'live':requestedTab;
    c.autoplay_latest_clip=this.querySelector('#autoplay_latest_clip')?.checked===true;

    // two-way audio
    c.two_way_audio = this.querySelector('#two_way_audio')?.checked === true;
    c.two_way_audio_disconnect_seconds = Math.max(0, Number(g('two_way_audio_disconnect_seconds') || 90));
    // Remove legacy direct-network keys whenever the visual editor saves.
    // Frigate instance/client and go2rtc stream overrides are per-camera above;
    // there is intentionally no phantom top-level editor field.
    delete c.go2rtc_url;
    delete c.frigate_url;
    if(c.go2rtc && typeof c.go2rtc==='object') delete c.go2rtc.url;
    this._config=c; this._dispatch();
  },

_dispatch() { this.dispatchEvent(new CustomEvent('config-changed',{detail:{config:this._config}})); }
};

// ── src/editor/methods.js ──
/** Public method-group barrel for the Sightline visual editor. */
const editorMethods = Object.assign(
  {},
  editorRegistryMethods,
  editorRenderMethods,
  editorConfigMethods,
);

// ── src/editor/SightlineCardEditor.js ──
/** Sightline visual editor custom element. */
class SightlineCardEditor extends HTMLElement {}

applyMethodGroups(SightlineCardEditor.prototype,editorMethods);

// ── src/index.js ──
/** Register Sightline's card/editor custom elements with Home Assistant. */
if (!customElements.get(CARD_TAG)) {
  customElements.define(CARD_TAG, SightlineCard);
}
if (!customElements.get(CARD_TAG + '-editor')) {
  customElements.define(CARD_TAG + '-editor', SightlineCardEditor);
}

window.customCards = window.customCards || [];
if (!window.customCards.find((card) => card.type === CARD_TAG)) {
  window.customCards.push({
    type: CARD_TAG,
    name: 'Sightline for Frigate',
    description: `Multi-camera Frigate NVR card — v${VERSION}`,
    preview: true,
  });
}

console.info(
  `%c SIGHTLINE-FOR-FRIGATE %c v${VERSION} `,
  'color:#fff;background:#1d4ed8;padding:2px 4px;border-radius:3px 0 0 3px;font-weight:bold',
  'color:#1d4ed8;background:#dbeafe;padding:2px 4px;border-radius:0 3px 3px 0'
);
