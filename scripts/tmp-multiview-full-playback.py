from pathlib import Path

nav = Path('src/card/media/navigation.js')
text = nav.read_text()
old = """    const card = e.target.closest('[data-ev]'); if (card) {\n      if (this._viewMode === 'grid') {\n        this._openInGridSlot(card.dataset.ev);\n      } else {\n        this._open(card.dataset.ev);\n      }\n    }\n"""
new = """    const card = e.target.closest('[data-ev]'); if (card) {\n      // Event media is a workspace-level playback action. In Multiview the\n      // grid is the return target, not a per-camera playback surface. Routing\n      // every browser event through `_open()` keeps Clips aligned with timeline\n      // and Review playback, and lets playback-layout.js temporarily replace\n      // the complete player until Back to Multiview is selected.\n      return this._open(card.dataset.ev);\n    }\n"""
if old not in text:
    raise SystemExit('navigation playback branch not found')
nav.write_text(text.replace(old, new, 1))

test = Path('tests/media-browser.mjs')
text = test.read_text()
needle = "import { fileURLToPath } from 'node:url';\n"
insert = needle + "import { mediaNavigationMethods } from '../src/card/media/navigation.js';\n"
if "mediaNavigationMethods" not in text:
    text = text.replace(needle, insert, 1)

needle = "const layout=read('src/card/ui/playback-layout.js');\n"
insert = needle + "const controller=read('src/card/playback/event-controller.js');\n"
if "const controller=" not in text:
    text = text.replace(needle, insert, 1)

block = r'''
// A clip selected from the media browser must always use workspace-level
// playback. Multiview is restored by the playback-return policy; the selected
// camera tile is never used as the clip's playback target.
{
  let opened=null;
  let gridOpened=null;
  const card={dataset:{ev:'clip-event-1'}};
  const target={closest(selector){return selector==='[data-ev]'?card:null;}};
  const ctx={
    _viewMode:'grid',
    _open:id=>{opened=id;},
    _openInGridSlot:id=>{gridOpened=id;}
  };
  mediaNavigationMethods._click.call(ctx,{target,stopPropagation(){}});
  assert.equal(opened,'clip-event-1','Multiview Clips must open in the full playback workspace');
  assert.equal(gridOpened,null,'Multiview Clips must not replace only the matching camera tile');
}

assert.match(controller,/if\(ev\.has_clip\) return this\._showClip\(ev\)/,'Timeline event clips must use the same full playback pipeline');
assert.match(layout,/const returnToGrid=this\._viewMode==='grid'/,'Full playback must remember Multiview as the return target');
'''
marker = "\nconsole.log('Media browser and desktop playback regression test passed.');"
if "clip-event-1" not in text:
    if marker not in text:
        raise SystemExit('media-browser test marker not found')
    text = text.replace(marker, block + marker, 1)
test.write_text(text)

changelog = Path('CHANGELOG.md')
text = changelog.read_text()
anchor = "- Fixed excess blank space when opening a clip from Multiview on wide/workstation dashboards. Full-card playback is now an explicit responsive visibility state: timeline/media/grid panes cannot be resurrected by a resize pass, the stale synchronized Multiview column height is removed while playback is active, and the compact one-pane layout is fully restored back to Multiview afterward.\n"
entry = "- Unified Multiview clip playback so clips selected from the Clips browser, Reviews, or the timeline temporarily replace the entire player workspace instead of opening inside only the camera tile that produced the event. Back to Multiview restores the original grid.\n"
if entry not in text:
    if anchor not in text:
        raise SystemExit('changelog anchor not found')
    text = text.replace(anchor, anchor + entry, 1)
changelog.write_text(text)
