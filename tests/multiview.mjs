import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const bundle=fs.readFileSync(path.join(root,'dist','sightline-for-frigate.js'),'utf8');
class FakeHTMLElement { attachShadow(){ return {}; } }
const registry=new Map();
const context={
  HTMLElement:FakeHTMLElement,
  customElements:{get:n=>registry.get(n),define:(n,c)=>registry.set(n,c)},
  window:{customCards:[]},console:{info(){},log(){},warn(){},error(){}},
  Map,Set,Date,Intl,URL,URLSearchParams,AbortController,CustomEvent:class{},
  navigator:{},document:{createElement:()=>({})},performance:{now:()=>1000},
  setTimeout,clearTimeout,setInterval,clearInterval,
  requestAnimationFrame:cb=>setTimeout(cb,0),cancelAnimationFrame:clearTimeout
};
context.window.window=context.window;
vm.createContext(context);
vm.runInContext(bundle,context,{filename:'sightline-for-frigate.js'});

const Card=registry.get('sightline-card');
assert.ok(Card,'Sightline card must register');
const card=new Card();
assert.equal(typeof card._showMultiRecording,'function');
assert.equal(typeof card._multiRecordingSyncEntry,'function');
assert.equal(typeof card._multiRecordingPrepareEntry,'function');

card._viewMode='grid';
card._config={cameras:[{entity:'camera.one'},{entity:'camera.two'}]};
card._timelineSeekSeq=0;
card._showMultiRecording=async ts=>{card._multiTarget=ts;};
await card._seekTimelineTarget(123.9);
assert.equal(card._multiTarget,123,'Grid timeline seek must route to synchronized Multiview playback');
assert.equal(card._multiRecordingBucket(901).start,900,'Multiview uses bounded 15-minute recording windows');

const entry={recordings:[{start_time:100,end_time:200}]};
assert.equal(card._multiRecordingHasCoverage(entry,150),true);
assert.equal(card._multiRecordingHasCoverage(entry,250),false);
console.log('Multiview smoke test passed.');
