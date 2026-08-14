from pathlib import Path

layout = Path('src/card/ui/playback-layout.js')
text = layout.read_text()
old = """export const playbackLayoutMethods = {\n  _enter(...args) {\n    const returnToGrid=this._viewMode==='grid';\n    if(returnToGrid&&!this._playbackReturnViewMode) this._playbackReturnViewMode='grid';\n    const result=eventPlaybackMethods._enter.apply(this,args);\n    const workspace=queryPlaybackWorkspace(this);\n"""
new = """/**\n * Determine whether recorded media is replacing a visible Multiview player.\n *\n * `_viewMode` is the primary state, but Home Assistant can reconcile a wide\n * dashboard while the Clips side pane is open and briefly leave that flag out\n * of sync with the already-mounted grid. Playback should follow what the user\n * is actually looking at, so the DOM presentation is an intentional fallback.\n */\nexport function isMultiviewPlaybackContext(card, workspace=queryPlaybackWorkspace(card)) {\n  if(card?._viewMode==='grid') return true;\n  if(workspace.card?.classList?.contains?.('grid-mode')) return true;\n\n  const grid=workspace.grid;\n  if(!grid || grid.style?.display==='none') return false;\n  const hasMountedSlot=Boolean(grid.children?.length || grid.querySelector?.('.grid-slot:not(.placeholder)'));\n  return hasMountedSlot;\n}\n\nexport const playbackLayoutMethods = {\n  _enter(...args) {\n    const workspace=queryPlaybackWorkspace(this);\n    const returnToGrid=isMultiviewPlaybackContext(this,workspace);\n    if(returnToGrid&&!this._playbackReturnViewMode) this._playbackReturnViewMode='grid';\n    const result=eventPlaybackMethods._enter.apply(this,args);\n"""
if old not in text:
    raise SystemExit('playback-layout anchor not found')
layout.write_text(text.replace(old,new,1))

test = Path('tests/media-browser.mjs')
text = test.read_text()
text = text.replace("import { mediaNavigationMethods } from '../src/card/media/navigation.js';", "import { mediaNavigationMethods } from '../src/card/media/navigation.js';\nimport { isMultiviewPlaybackContext } from '../src/card/ui/playback-layout.js';")
anchor = """assert.match(layout,/const returnToGrid=this\\._viewMode==='grid'/,'Full playback must remember Multiview as the return target');\n\nconsole.log('Media browser and desktop playback regression test passed.');\n"""
replacement = """// Wide workstation reconciliation can leave the state flag stale while the\n// Multiview grid is still visibly mounted beside the Clips browser. Playback\n// must follow the visible player, not only `_viewMode`.\n{\n  const grid={style:{display:''},children:[{}],querySelector:()=>({})};\n  const cardNode={classList:{contains:()=>false}};\n  const ctx={_viewMode:'single'};\n  assert.equal(isMultiviewPlaybackContext(ctx,{card:cardNode,grid}),true,'visible mounted Multiview must trigger full-player playback even with stale view state');\n\n  grid.style.display='none';\n  assert.equal(isMultiviewPlaybackContext(ctx,{card:cardNode,grid}),false,'a hidden stale grid must not force Multiview playback');\n}\n\nassert.match(layout,/isMultiviewPlaybackContext\\(this,workspace\\)/,'Full playback must derive its return target from the rendered Multiview context');\n\nconsole.log('Media browser and desktop playback regression test passed.');\n"""
if anchor not in text:
    raise SystemExit('media-browser test anchor not found')
test.write_text(text.replace(anchor,replacement,1))

changelog = Path('CHANGELOG.md')
text = changelog.read_text()
anchor = "- Unified Multiview clip playback so clips selected from the Clips browser, Reviews, or the timeline temporarily replace the entire player workspace instead of opening inside only the camera tile that produced the event. Back to Multiview restores the original grid.\n"
addition = anchor + "- Fixed the wide-workstation Clips side-panel edge case where a visibly mounted Multiview grid could briefly disagree with `_viewMode`. Full-player playback now recognizes the rendered grid as a fallback, so side-panel clip selection still replaces the entire Multiview player and returns to the grid afterward.\n"
if anchor not in text:
    raise SystemExit('changelog anchor not found')
changelog.write_text(text.replace(anchor,addition,1))
