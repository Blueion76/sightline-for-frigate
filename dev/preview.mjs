import './ha-elements.mjs';
import '/dist/sightline-for-frigate.js';
import { createMockHa } from './mock-ha.mjs';
import { cameras, cameraName } from './fixtures.mjs';
const {now}=await fetch('/dev/bootstrap').then(r=>r.json());
const form=document.querySelector('#controls');
const params=new URLSearchParams(location.search);
for(const select of form.querySelectorAll('select'))if([...select.options].some(o=>o.value===params.get(select.name)))select.value=params.get(select.name);
let mock;
let card;
function mount() {
  mock?.dispose();
  card?.remove();
  const values=Object.fromEntries(new FormData(form));
  history.replaceState(null,'',`?${new URLSearchParams(values)}`);
  document.documentElement.dataset.theme=values.theme;
  const preview=document.querySelector('#preview');preview.dataset.viewport=values.viewport;
  const log=document.querySelector('#request-log');log.replaceChildren();let count=0;
  mock=createMockHa({now,scenario:values.scenario,onRequest:p=>{document.querySelector('#request-count').textContent=String(++count);const li=document.createElement('li');li.textContent=`${p.type}${p.camera?' · '+p.camera:''}`;log.prepend(li);while(log.children.length>50)log.lastChild.remove();}});
  mock.hass.themes.darkMode=values.theme==='dark';
  card=document.createElement('sightline-card');
  card.setConfig({cameras:cameras.slice(0,Number(values.cameras)).map(c=>({entity:`camera.${c}`,name:cameraName(c)})),theme:values.theme,default_tab:'clips',default_view:values.cameras==='3'?'multiview':'single',window_hours:48,refresh_seconds:30,stream_type:'hls',aspect_ratio:'16:9',timeline:{enabled:true}});
  preview.replaceChildren(card);card.hass=mock.hass;
  document.querySelector('#scenario-note').textContent={populated:'Clips, reviewed and unreviewed detections, favorites, faces, zones, and two days of recordings. Each hour has a one-minute recording gap.',empty:'Connected cameras with an empty clip, review, and recording library.',offline:'Live cameras are unavailable. Retained clips and recordings remain playable.',slow:'Mock API responses take 800ms. Use this to inspect loading and navigation races.'}[values.scenario];
  // Expose the external mock and card for browser assertions and exploration.
  window.preview={card,mock,now};
}
form.addEventListener('change',mount);
document.querySelector('#reset').addEventListener('click',mount);
document.querySelector('#new-event').addEventListener('click',()=>{
  if(form.elements.scenario.value==='empty')return;
  const source=mock.fixtures.events[0];
  // Use a known media ID so the real proxy URL remains playable.
  source.start_time=Math.floor(Date.now()/1000)-24;source.end_time=source.start_time+20;
  mock.emit({type:'end',after:source});
  document.querySelector('#scenario-note').textContent='Event notification emitted. The production subscription schedules a normal data refresh.';
});
mount();
new EventSource('/dev/reload').onmessage=()=>location.reload();
