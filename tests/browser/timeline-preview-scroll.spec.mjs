import { test, expect } from '@playwright/test';

for (const thumbnailHeight of [48, 84, 140]) {
  test(`thumbnail anchors stay aligned between motion and reconciliation (${thumbnailHeight}px)`, async ({ page }) => {
    await page.goto('/?viewport=desktop&cameras=1');
    await expect(page.locator('sightline-card .media-gallery-grid [data-ev]')).toHaveCount(8);
    const samples = await page.evaluate(height => {
      const card = window.preview.card;
      card._config.timeline.thumbnail_size = height;
      // Keep the event in view independently of how long the dev server has
      // been running. Exercise a compact track where the old 360px floor is wrong.
      const track = card.shadowRoot.querySelector('#tl-track');
      track.style.setProperty('height', '240px', 'important');
      track.style.setProperty('min-height', '0', 'important');
      track.style.setProperty('max-height', '240px', 'important');
      const focus = card._events[0].start_time;
      card._timelineSelected = String(card._events[0].id);
      card._timelineFollowingLive = false;
      card._timelineInteracting = true;
      card._timelineFocusTs = focus;
      card._winStart = focus - 300;
      card._winEnd = focus + 300;
      card._renderTimeline();
      const preview = track.querySelector(`.t-preview[data-event-id="${card._events[0].id}"]`);
      const image = preview.querySelector('img');
      const measurements = [];
      for (let shift = 0; shift <= 100; shift += 20) {
        card._timelineFocusTs = focus - shift;
        card._winStart = card._timelineFocusTs - 300;
        card._winEnd = card._timelineFocusTs + 300;
        card._updateTimelineLive();
        const moving = preview.getBoundingClientRect();
        const trackBox = track.getBoundingClientRect();
        const marker = track.querySelector(`[data-tick="${card._events[0].id}"]`).getBoundingClientRect();
        card._renderTimeline();
        const reconciled = preview.getBoundingClientRect();
        measurements.push({
          jump: Math.abs(moving.top - reconciled.top),
          markerError: Math.abs(moving.top + moving.height / 2 - (marker.top + marker.height / 2)),
          samePreview: track.querySelector(`.t-preview[data-event-id="${card._events[0].id}"]`) === preview,
          sameImage: preview.querySelector('img') === image,
          trackHeight: trackBox.height,
        });
      }
      return measurements;
    }, thumbnailHeight);
    for (const sample of samples) {
      expect(sample.trackHeight).toBeLessThan(360);
      expect(sample.jump, 'A reconcile must not move the same thumbnail to a different pixel position').toBeLessThan(1);
      expect(sample.markerError, 'The thumbnail center must stay aligned with its event marker').toBeLessThan(2);
      expect(sample.samePreview).toBe(true);
      expect(sample.sameImage).toBe(true);
    }
  });
}

test('wheel scrolling keeps visible preview centers on their timestamps', async ({ page }) => {
  await page.goto('/?viewport=desktop&cameras=1');
  await expect(page.locator('sightline-card .media-gallery-grid [data-ev]')).toHaveCount(8);
  const track = page.locator('sightline-card #tl-track');
  await page.evaluate(() => {
    const card = window.preview.card;
    const focus = card._events[0].start_time;
    card._timelineSelected = String(card._events[0].id);
    card._timelineFollowingLive = false;
    card._timelineFocusTs = focus;
    card._winStart = focus - 300;
    card._winEnd = focus + 300;
    const el = card.shadowRoot.querySelector('#tl-track');
    el.style.setProperty('height', '240px', 'important');
    el.style.setProperty('min-height', '0', 'important');
    el.style.setProperty('max-height', '240px', 'important');
    card._renderTimeline();
    window.previewFrames = [];
    const sample = () => {
      const bounds = el.getBoundingClientRect();
      for (const preview of el.querySelectorAll('.t-preview')) {
        if (getComputedStyle(preview).visibility === 'hidden') continue;
        const ts = Number(preview.dataset.ts);
        if (ts < card._winStart || ts > card._winEnd) continue;
        const rect = preview.getBoundingClientRect();
        const ratio = .5 + (card._timelineFocusTs - ts) / (card._winEnd - card._winStart);
        const expected = bounds.top + el.clientTop + ratio * el.clientHeight;
        window.previewFrames.push(Math.abs(rect.top + rect.height / 2 - expected));
      }
      if (window.previewFrames.length < 150) requestAnimationFrame(sample);
    };
    requestAnimationFrame(sample);
  });
  const box = await track.boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  for (let i = 0; i < 8; i++) {
    await page.mouse.wheel(0, -10);
    await page.waitForTimeout(45);
  }
  const errors = await page.evaluate(() => window.previewFrames);
  expect(errors.length).toBeGreaterThan(10);
  expect(Math.max(...errors), 'Preview position error during actual wheel input').toBeLessThan(2);
});
