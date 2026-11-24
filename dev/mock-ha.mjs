import { cameras, cameraName, createFixtures, recordingSummary } from './fixtures.mjs';
/** Mock only the external HA contract. Never replace the card's controllers. */
export function createMockHa({now, scenario='populated', latency=80, onRequest=()=>{}}={}) {
  const fixtures=createFixtures(now);
  const subscriptions=new Set();
  const requests=[];
  const clone = value => structuredClone(value);
  const filter=(rows,p)=>rows.filter(row=>(!p.cameras||p.cameras.includes(row.camera)) && (!p.camera||row.camera===p.camera) && (p.after==null||row.end_time>p.after) && (p.before==null||row.start_time<p.before));
  const states=Object.fromEntries(cameras.map(camera=>[`camera.${camera}`,{entity_id:`camera.${camera}`,state:scenario==='offline'?'unavailable':'streaming',attributes:{friendly_name:cameraName(camera),client_id:'demo',camera_name:camera,device_class:'camera',entity_picture:`/dev/media/${camera}.jpg`}}]));
  const hass={
    states, config:{time_zone:Intl.DateTimeFormat().resolvedOptions().timeZone},
    themes:{darkMode:true}, locale:{language:'en',time_format:'24',date_format:'language'},
    hassUrl:path=>new URL(path,location.origin).href,
    connection:{subscribeMessage:async callback=>{subscriptions.add(callback);return ()=>subscriptions.delete(callback);}},
    async callWS(p) {
      requests.push(clone(p)); onRequest(p);
      await new Promise(resolve=>setTimeout(resolve,scenario==='slow'?800:latency));
      let result;
      const empty=scenario==='empty';
      switch(p.type) {
        case 'config/entity_registry/list': result=cameras.map(c=>({entity_id:`camera.${c}`,platform:'frigate'})); break;
        case 'frigate/events/get': result=empty?[]:filter(fixtures.events,p).filter(ev=>(!p.has_clip||ev.has_clip)&&(!p.favorites||ev.retain_indefinitely)).sort((a,b)=>b.start_time-a.start_time).slice(0,p.limit||500); break;
        case 'frigate/reviews/get': result=empty?[]:filter(fixtures.reviews,p).sort((a,b)=>b.start_time-a.start_time).slice(0,p.limit||500); break;
        case 'frigate/recordings/get': result=empty?[]:filter(fixtures.recordings,p); break;
        case 'frigate/recordings/summary': result=empty?[]:recordingSummary(fixtures,p.camera,p.timezone); break;
        case 'frigate/events/summary': result=empty?[]:fixtures.events.map(ev=>({camera:ev.camera,day:new Date(ev.start_time*1000).toLocaleDateString('en-CA',{timeZone:p.timezone})})); break;
        case 'frigate/event/retain': {
          const ev=fixtures.events.find(ev=>ev.id===p.event_id); if(!ev) throw new Error(`Unknown event ${p.event_id}`);
          ev.retain_indefinitely=p.retain; result={success:true}; break;
        }
        case 'frigate/reviews/viewed': fixtures.reviews.filter(rv=>p.ids.includes(rv.id)).forEach(rv=>rv.has_been_reviewed=p.viewed); result={success:true}; break;
        case 'auth/sign_path': result={path:p.path}; break;
        case 'media_source/resolve_media': {
          const match=p.media_content_id.match(/\/event\/([^/]+)\/([^/]+)\/([^/]+)$/);
          if(!match) throw new Error(`Unsupported media source: ${p.media_content_id}`);
          result={url:`/api/frigate/demo/notifications/${match[3]}/${match[1]==='clips'?'clip.mp4':'snapshot.jpg'}`}; break;
        }
        default: throw new Error(`Unmocked HA command: ${p.type}`);
      }
      return clone(result);
    },
  };
  return {hass,fixtures,requests,emit:message=>subscriptions.forEach(cb=>cb(message)),dispose:()=>subscriptions.clear()};
}
