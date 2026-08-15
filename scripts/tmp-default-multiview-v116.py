from pathlib import Path


def replace(path, old, new):
    p=Path(path)
    text=p.read_text()
    if old not in text:
        raise SystemExit(f'missing expected text in {path}: {old[:100]!r}')
    p.write_text(text.replace(old,new,1))

# Runtime: expose `multiview` as the public value while accepting legacy `grid`.
core=Path('src/card/core.js')
text=core.read_text()
needle="export const coreMethods = {\n"
helper="""export function normalizeDefaultView(value, cameraCount) {
  const requested=String(value||'').trim().toLowerCase();
  return Number(cameraCount)>1 && (requested==='multiview' || requested==='grid')
    ? 'multiview'
    : 'single';
}

export const coreMethods = {
"""
if needle not in text:
    raise SystemExit('core composition marker missing')
text=text.replace(needle,helper,1)
old="      default_view: (config.default_view === 'grid' && cameras.length > 1) ? 'grid' : 'single',"
new="      default_view: normalizeDefaultView(config.default_view, cameras.length),"
if old not in text:
    raise SystemExit('core default_view normalization missing')
text=text.replace(old,new,1)
old="    if (this._config.default_view === 'grid' && this._config.cameras.length > 1) this._setViewMode('grid');"
new="    if (this._config.default_view === 'multiview' && this._config.cameras.length > 1) this._setViewMode('grid');"
if old not in text:
    raise SystemExit('core startup default_view check missing')
text=text.replace(old,new,1)
core.write_text(text)

# Editor: save the public `multiview` value.
replace(
    'src/editor/config.js',
    "    c.default_view = (dv==='grid' && cams.length>1) ? 'grid' : 'single';",
    "    c.default_view = (dv==='multiview' && cams.length>1) ? 'multiview' : 'single';"
)

# Editor UI: normalize legacy `grid` for display, but label/save Multiview.
replace(
    'src/editor/render.js',
    "    const defaultView = this._config?.default_view || 'single';",
    "    const defaultView = ['multiview','grid'].includes(this._config?.default_view) ? 'multiview' : 'single';"
)
replace(
    'src/editor/render.js',
    "          <label class=\"radio-lbl\"><input type=\"radio\" name=\"default_view\" value=\"grid\" ${defaultView==='grid'?'checked':''} ${usableCamCount<2?'disabled':''}> Grid (all cams)</label>",
    "          <label class=\"radio-lbl\"><input type=\"radio\" name=\"default_view\" value=\"multiview\" ${defaultView==='multiview'?'checked':''} ${usableCamCount<2?'disabled':''}> Multiview (all cameras)</label>"
)
replace(
    'src/editor/render.js',
    "        ${usableCamCount<2?'<small class=\"mini-help\">Grid view becomes available when at least two camera entities are configured.</small>':''}",
    "        ${usableCamCount<2?'<small class=\"mini-help\">Multiview becomes available when at least two camera entities are configured.</small>':''}"
)

# README: document the public option and keep the old value as a compatibility alias.
replace(
    'README.md',
    '- Single-camera, grid, and auto-rotation modes',
    '- Single-camera, Multiview, and auto-rotation modes'
)
replace(
    'README.md',
    'default_view: single\ncameras:',
    'default_view: multiview\ncameras:'
)
replace(
    'README.md',
    'With multiple cameras configured you can switch cameras, use grid mode, or enable automatic rotation. Camera filters are hidden automatically when the card is operating in a single-camera context.',
    "With multiple cameras configured you can switch cameras, use Multiview, or enable automatic rotation. Set `default_view: multiview` to launch directly into the all-camera grid. The legacy value `default_view: grid` remains accepted for backward compatibility. Camera filters are hidden automatically when the card is operating in a single-camera context."
)

# Changelog: make the new startup option part of 1.1.6.
changelog=Path('CHANGELOG.md')
text=changelog.read_text()
needle='- Restored the dedicated fullscreen button on desktop single-camera Live. It fullscreens the existing `#eng-wrap` WebRTC wrapper without replacing the stream, remains available in Multiview, stays hidden for iOS live MediaStreams, and avoids duplicating the native fullscreen control on single-camera recorded playback.\n'
addition=needle+'- Added `default_view: multiview` as the public startup option for multi-camera cards and exposed it as **Multiview (all cameras)** in the visual editor. Existing `default_view: grid` configurations remain supported as a backward-compatible alias.\n'
if needle not in text:
    raise SystemExit('1.1.6 changelog fullscreen entry missing')
changelog.write_text(text.replace(needle,addition,1))

# Regression coverage: public value, legacy alias, and one-camera fallback.
test=Path('tests/responsive-layout.mjs')
text=test.read_text()
old="import { responsiveUxMethods } from '../src/card/responsive-ux.js';\n"
new=old+"import { normalizeDefaultView } from '../src/card/core.js';\n"
if old not in text:
    raise SystemExit('responsive import marker missing')
text=text.replace(old,new,1)
marker="class StyleMock {\n"
block="""// Multiview can be selected as the startup view using the public 1.1.6
// value. The old `grid` value remains a compatibility alias, and a single
// configured camera always falls back to the single-camera view.
assert.equal(normalizeDefaultView('multiview',3),'multiview');
assert.equal(normalizeDefaultView('grid',3),'multiview');
assert.equal(normalizeDefaultView('MULTIVIEW',2),'multiview');
assert.equal(normalizeDefaultView('multiview',1),'single');
assert.equal(normalizeDefaultView('single',4),'single');

class StyleMock {
"""
if marker not in text:
    raise SystemExit('responsive test marker missing')
text=text.replace(marker,block,1)
test.write_text(text)
