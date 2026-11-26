import { test, expect } from '@playwright/test';

async function ready(page) {
  await page.goto('/?viewport=desktop&cameras=1');
  await expect(page.locator('sightline-card .media-gallery-grid [data-ev]')).toHaveCount(8);
}

for (const edge of ['top', 'bottom']) {
  test(`partially visible previews survive an offscreen marker at the ${edge} edge`, async ({page}) => {
    await ready(page);
    const result = await page.evaluate(edge => {
      const card = window.preview.card;
      const track = card.shadowRoot.querySelector('#tl-track');
      track.style.setProperty('height','240px','important');
      track.style.setProperty('min-height','0','important');
      track.style.setProperty('max-height','240px','important');
      const focus = card._events[0].start_time;
      const start = focus + (edge === 'top' ? 330 : -330);
      const event = {...card._events[0], start_time:start, end_time:start+20};
      card._events = [event];
      card._timelineFollowingLive = false;
      card._timelineInteracting = true;
      card._timelineFocusTs = focus;
      card._winStart = focus-300; card._winEnd = focus+300;
      card._renderTimeline();
      const preview = track.querySelector('.t-preview');
      if(!preview) return {present:false};
      const bounds = track.getBoundingClientRect();
      const box = preview.getBoundingClientRect();
      const image = preview.querySelector('img');
      card._updateTimelineLive();
      const afterMove = preview.getBoundingClientRect();
      const visibleDuringMove = getComputedStyle(preview).visibility !== 'hidden';
      card._renderTimeline();
      const stable = track.querySelector('.t-preview') === preview && preview.querySelector('img') === image;
      // Move far enough that no part of the preview can intersect the viewport.
      const delta = edge === 'top' ? -200 : 200;
      card._winStart += delta; card._winEnd += delta; card._timelineFocusTs += delta;
      card._updateTimelineLive();
      const culledDuringMove = getComputedStyle(preview).visibility === 'hidden';
      card._renderTimeline();
      return {
        present:true, visibleDuringMove, stable, culledDuringMove,
        intersects:box.bottom>bounds.top && box.top<bounds.bottom,
        centerOutside:edge==='top' ? box.top+box.height/2<bounds.top : box.top+box.height/2>bounds.bottom,
        jump:Math.abs(afterMove.top-box.top),
        removedWhenFullyOutside:!track.querySelector('.t-preview'),
      };
    }, edge);
    expect(result.present).toBe(true);
    expect(result.intersects).toBe(true);
    expect(result.centerOutside).toBe(true);
    expect(result.visibleDuringMove).toBe(true);
    expect(result.stable).toBe(true);
    expect(result.jump).toBeLessThan(1);
    expect(result.culledDuringMove).toBe(true);
    expect(result.removedWhenFullyOutside).toBe(true);
  });
}

for (const entireViewport of [false, true]) {
  test(`event duration survives its offscreen start (${entireViewport?'whole viewport':'partial overlap'})`, async ({page}) => {
    await ready(page);
    const result = await page.evaluate(entireViewport => {
      const card = window.preview.card;
      const track = card.shadowRoot.querySelector('#tl-track');
      const focus = card._events[0].start_time;
      const event = {...card._events[0],start_time:focus-900,end_time:focus+(entireViewport?900:60)};
      card._events = [event];
      card._timelineFollowingLive = false;
      card._timelineInteracting = true;
      card._timelineFocusTs = focus;
      card._winStart = focus-300;card._winEnd = focus+300;
      card._renderTimeline();
      const bar = track.querySelector('.t-duration');
      if(!bar) return {present:false};
      const bounds = track.getBoundingClientRect();
      const box = bar.getBoundingClientRect();
      const expectedTop = bounds.top+track.clientTop+(entireViewport?0:.4)*track.clientHeight;
      const expectedHeight = track.clientHeight*(entireViewport?1:.6);
      card._updateTimelineLive();
      const afterMove = bar.getBoundingClientRect();
      card._renderTimeline();
      const stable = track.querySelector('.t-duration')===bar;
      const noPinnedMarker = [...track.querySelectorAll('.t-ev')].every(el=>getComputedStyle(el).visibility==='hidden');
      return {present:true,stable,noPinnedMarker,topError:Math.abs(box.top-expectedTop),heightError:Math.abs(box.height-expectedHeight),jump:Math.abs(box.top-afterMove.top)};
    }, entireViewport);
    expect(result.present).toBe(true);
    expect(result.stable).toBe(true);
    expect(result.noPinnedMarker).toBe(true);
    expect(result.topError).toBeLessThan(1);
    expect(result.heightError).toBeLessThan(1);
    expect(result.jump).toBeLessThan(1);
  });
}

test('very small trackpad wheel deltas accumulate instead of being discarded', async ({page}) => {
  await ready(page);
  const result = await page.evaluate(() => {
    const card = window.preview.card;
    const track = card.shadowRoot.querySelector('#tl-track');
    const focus = card._events[0].start_time;
    card._timelineFollowingLive = false;
    card._timelineFocusTs = focus;
    card._winStart=focus-300;card._winEnd=focus+300;
    card._renderTimeline();
    const before=card._timelineFocusTs;
    const span=card._winEnd-card._winStart;
    track.dispatchEvent(new WheelEvent('wheel',{deltaY:-.05,bubbles:true,cancelable:true}));
    const first=card._timelineFocusTs;
    for(let i=0;i<19;i++)track.dispatchEvent(new WheelEvent('wheel',{deltaY:-.05,bubbles:true,cancelable:true}));
    return {before,first,after:card._timelineFocusTs,spanAfter:card._winEnd-card._winStart,span};
  });
  expect(result.first).toBeLessThan(result.before);
  expect(result.after).toBeLessThan(result.first);
  expect(result.before-result.after).toBeGreaterThan(.5);
  expect(result.spanAfter).toBeCloseTo(result.span,3);
});
