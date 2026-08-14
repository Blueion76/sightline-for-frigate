from pathlib import Path


def replace_once(text, old, new, label):
    if old not in text:
        raise SystemExit(f'Missing expected block: {label}')
    return text.replace(old, new, 1)

responsive = Path('tests/responsive-layout.mjs')
text = responsive.read_text()
marker = "// iOS must receive a direct native-input gesture. The visible calendar button\n"
addition = r'''// Full-card playback is a hard responsive visibility state. A workstation
// resize/reconcile must not resurrect timeline/media panes into the one-area
// playback layout or preserve the old synchronized Multiview column height.
{
  const w=workspace(1400,{timeline:true,gallery:'clips'});
  w.card.classList.add('playback-fullcard');
  w.layout.style.setProperty('display','block','important');
  w.layout.style.setProperty('grid-template-areas','"feed"','important');
  w.timelineWrap.style.setProperty('display','none','important');
  w.timelineView.style.setProperty('display','none','important');
  w.media.style.setProperty('display','none','important');
  w.card.style.setProperty('--workspace-column-h','812px');

  responsiveUxMethods._syncResponsiveWorkspace.call(w.ctx);
  assert.equal(w.card.classList.contains('workstation'),true);
  assert.equal(w.layout.style.getPropertyValue('grid-template-areas'),'"feed"','responsive reconciliation must preserve the playback-only grid');
  assert.equal(w.timelineWrap.style.getPropertyValue('display'),'none','timeline wrapper must remain hidden during playback');
  assert.equal(w.timelineView.style.getPropertyValue('display'),'none','timeline view must remain hidden during playback');
  assert.equal(w.media.style.getPropertyValue('display'),'none','media pane must remain hidden during playback');
  assert.equal(w.media.getAttribute('aria-hidden'),'true');
  assert.equal(w.engWrap.style.getPropertyValue('display'),'block','recorded player wrapper must stay visible');
  assert.equal(w.camGrid.style.getPropertyValue('display'),'none','Multiview grid must stay hidden during full-card playback');

  responsiveUxMethods._syncColHeight.call(w.ctx);
  assert.equal(w.card.style.getPropertyValue('--workspace-column-h'),'','full-card playback must drop the stale Multiview column height');
}

'''
text = replace_once(text, marker, addition + marker, 'responsive playback regression insertion')
responsive.write_text(text)

media = Path('tests/media-browser.mjs')
text = media.read_text()
anchor = "assert.match(layout,/playback-fullcard/,'Full-card recorded playback must have an explicit state marker');\n"
addition = "assert.match(layout,/playbackColumnHeight/,'Full-card playback must save and clear the synchronized Multiview column height');\nassert.match(layout,/setProperty\\('display','block','important'\\)/,'Full-card playback must collapse the workstation CSS grid to one block-level feed');\nassert.match(layout,/camSwitcher/,'Full-card playback must hide and restore the unused Multiview camera switcher');\n"
text = replace_once(text, anchor, anchor + addition, 'media playback layout assertions')
media.write_text(text)

changelog = Path('CHANGELOG.md')
text = changelog.read_text()
anchor = "- Fixed desktop Multiview timeline mouse dragging after opening a clip and returning to Live. Timeline pointer/mouse/touch/wheel listeners now share one abortable lifecycle, and returning from full-card playback explicitly refreshes that binding set so the track cannot be left with a `mousedown` handler but no active `mousemove`/`mouseup` transport.\n"
bullet = "- Fixed excess blank space when opening a clip from Multiview on wide/workstation dashboards. Full-card playback is now an explicit responsive visibility state: timeline/media/grid panes cannot be resurrected by a resize pass, the stale synchronized Multiview column height is removed while playback is active, and the compact one-pane layout is fully restored back to Multiview afterward.\n"
text = replace_once(text, anchor, anchor + bullet, 'changelog wide playback bullet')
changelog.write_text(text)
