from pathlib import Path

view = Path('src/card/live/view.js')
text = view.read_text()
anchor = "export const liveViewMethods = {\n"
helper = """/** Return whether Sightline should render its own fullscreen control. */\nexport function shouldShowFullscreenButton({isLive=false,inGrid=false,isIOS=false}={}) {\n  // Recorded single-camera video already exposes native player fullscreen.\n  // Sightline's control is needed for the live WebRTC wrapper and Multiview.\n  return !isIOS && (isLive || inGrid);\n}\n\nexport const liveViewMethods = {\n"""
if anchor not in text:
    raise SystemExit('live view export anchor not found')
text = text.replace(anchor, helper, 1)
old = """    // Do not render any dedicated fullscreen control on iOS. Native WebKit\n    // fullscreen can destabilize MediaStream-backed live video, and the custom\n    // pseudo-fullscreen button was redundant with the platform's own viewing\n    // affordances. Desktop keeps the whole-grid control where it is useful.\n    const fsBtn = (inGrid && !this._isIOSRecordingPlatform())\n      ? `<button class=\"scb-btn\" id=\"sc-fs\" title=\"Fullscreen\" aria-label=\"Fullscreen\">${ICONS.expand}</button>`\n      : '';\n"""
new = """    // Keep Sightline's fullscreen affordance on desktop Live as well as\n    // Multiview. Single-camera recorded playback already has native video\n    // controls, while iOS intentionally keeps custom fullscreen disabled for\n    // MediaStream stability.\n    const fsBtn = shouldShowFullscreenButton({\n      isLive,\n      inGrid,\n      isIOS:this._isIOSRecordingPlatform(),\n    })\n      ? `<button class=\"scb-btn\" id=\"sc-fs\" title=\"Fullscreen\" aria-label=\"Fullscreen\">${ICONS.expand}</button>`\n      : '';\n"""
if old not in text:
    raise SystemExit('fullscreen render anchor not found')
view.write_text(text.replace(old,new,1))

test = Path('tests/v115-hardening.mjs')
text = test.read_text()
text = text.replace(
    "import { liveViewMethods } from '../src/card/live/view.js';",
    "import { liveViewMethods, shouldShowFullscreenButton } from '../src/card/live/view.js';",
    1,
)
anchor = """// Explicit speaker control converts a user gesture into a real unmute/play attempt.\n"""
coverage = """// Desktop Live must expose Sightline's fullscreen control. Recorded single\n// camera playback keeps using native video controls, and iOS stays suppressed.\n{\n  assert.equal(shouldShowFullscreenButton({isLive:true,inGrid:false,isIOS:false}),true);\n  assert.equal(shouldShowFullscreenButton({isLive:true,inGrid:true,isIOS:false}),true);\n  assert.equal(shouldShowFullscreenButton({isLive:false,inGrid:true,isIOS:false}),true);\n  assert.equal(shouldShowFullscreenButton({isLive:false,inGrid:false,isIOS:false}),false);\n  assert.equal(shouldShowFullscreenButton({isLive:true,inGrid:false,isIOS:true}),false);\n}\n\n""" + anchor
if anchor not in text:
    raise SystemExit('v115 test anchor not found')
test.write_text(text.replace(anchor,coverage,1))

changelog = Path('CHANGELOG.md')
text = changelog.read_text()
anchor = "### Live audio and two-way audio\n\n"
addition = anchor + "- Restored the dedicated fullscreen button on desktop single-camera Live. It fullscreens the existing `#eng-wrap` WebRTC wrapper without replacing the stream, remains available in Multiview, stays hidden for iOS live MediaStreams, and avoids duplicating the native fullscreen control on single-camera recorded playback.\n"
if anchor not in text:
    raise SystemExit('changelog live section anchor not found')
changelog.write_text(text.replace(anchor,addition,1))
