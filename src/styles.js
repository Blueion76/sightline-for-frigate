// Card CSS is intentionally isolated from runtime behavior.
export const STYLES = `
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
     native fullscreen affordance on direct go2rtc video. v2.0.26 also removes
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
   v2.0.0 — Editorial Black
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

/* v2.0.11 — lean timeline chrome + explicit recording gaps. */
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
