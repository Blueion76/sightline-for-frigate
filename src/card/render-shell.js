import { VERSION, CARD_TAG, DAY, DEFAULT_ROTATE_S, ICONS, LABEL_COLORS, PALETTE, TIMELINE_GLYPHS, CAM_COLORS } from '../constants.js';
import { cap, parseWs, labelColor, timelineGlyph, mkCamState, camDisplayName } from '../helpers.js';
import { STYLES } from '../styles.js';

// Prototype methods grouped by responsibility.
export const renderShellMethods = {
_renderShell() {
    const multiCam = this._config.cameras.length > 1;

    this.shadowRoot.innerHTML = `<style>
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
 /* v1.5 Scrypted-inspired visual pass: black timeline canvas, quiet gutter,
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
   v1.2.1 — Refined timeline + timeline-only mobile card
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
   v1.3.0 — Liquid Glass design overhaul
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
   v1.4.0 — Scrypted / UniFi-inspired timeline reliability + responsive pass
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
   v2.0.1 — final visual authority + browser visibility repair
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

/* v2.0.21 — monochrome timeline glyphs + no sticky edge events. */
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

/* v2.0.23 — Scrypted-style event rail + responsive glyph lane.
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

/* v2.0.28 — timeline-native trim selection for recording downloads. */
/* v2.0.27 — HA-proxy-only networking + exact-time scrub stills. */

/* v2.0.25 — dynamic Frigate filters + resilient/tall-layout thumbnails. */

/* v2.0.24 — prevent Scrypted-style timeline glyphs from being clipped or
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

/* v2.0.35 — iOS native fullscreen exits directly back to embedded player geometry. */
/* v2.0.34 — Material Design Icons for Frigate detection glyphs. */
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


/* v2.0.29 — reliable pointer-captured trim handles + correctly signed MP4 downloads. */
/* v2.0.32 — native picker fix: no forced blur/render on iOS; robust control hit-lock + card freeze. */
/* v2.0.31 — iOS native picker hardening: sticky picker lock + full gallery DOM freeze. */
/* v2.0.30 — stable native date/time pickers: preserve picker DOM during gallery/data refreshes. */
/* v2.0.28 — timeline-native recording trim/download picker. */
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

/* v2.0.37 — Frigate-style exact-time scrub stills through HA-proxied VOD.
   v2.0.36 — unify LIVE/playhead overlays on the responsive timeline rail.
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

/* v2.0.40 — Home Assistant visual-editor preview mode.
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

/* v2.0.42 — deterministic player geometry.
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

/* v2.0.45 — geometry survives late HA editor-preview detection.
   The old v2.0.40 preview rules are intentionally superseded here. Runtime
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

/* v2.0.41 — custom accent authority. Several later Scrypted-style passes
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

/* v2.0.41 — final theme authority. Older design passes intentionally forced
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

/* v2.0.42 — light-theme contrast authority. Earlier dark-first design passes
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

/* v2.0.47 — trim interaction authority. The range overlay must remain the
   top hit-test surface even with translucent theme materials/backdrop filters. */
.card .tl-track.vertical .tl-download-range{pointer-events:auto !important;touch-action:none !important;z-index:60 !important;}
.card .tl-track.vertical .tl-range-boundary{pointer-events:auto !important;z-index:12 !important;}
.card .tl-track.vertical .tl-range-actions{pointer-events:auto !important;z-index:20 !important;}

/* v2.0.46 — surface material authority. Custom background and/or the card
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
   v2.0.52 — responsive dashboard workspace
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

</style>
      <ha-card class="card ${this._config.theme==='light'?'theme-light':this._config.theme==='auto'?'theme-auto':''} ${this._config.bg_color?'custom-bg':''} ${Number(this._config.transparency)>0?'card-transparent':''} ${(this._config.bg_color||Number(this._config.transparency)>0)?'surface-override':''} ${this._isEditorPreview()?'editor-preview':''}" id="card">
        <div class="layout" id="layout">
          <!-- v2.0.52 responsive workspace. These are real sibling columns so the
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
