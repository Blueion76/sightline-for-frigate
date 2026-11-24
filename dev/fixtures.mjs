/** Synthetic Frigate-shaped data shared by the preview API and browser tests. */
export const cameras = ['front_door', 'driveway', 'garden'];
export const cameraName = camera => camera.split('_').map(s => s[0].toUpperCase()+s.slice(1)).join(' ');
export function createFixtures(now = Math.floor(Date.now()/4000)*4) {
  const events = cameras.flatMap((camera, c) => [120, 240, 420, 720, 1200, 2400, 4800, 90000].map((ago, i) => ({
    id: `${camera}-${i}`, camera, label: ['person','car','dog'][i%3],
    start_time: now-ago-c*24, end_time: now-ago-c*24+20,
    has_clip: true, has_snapshot: true, retain_indefinitely: i===2,
    sub_label: i%3===0 ? 'Alex' : null, zones: [i%2 ? 'walkway' : 'entrance'],
    top_score: 0.94, false_positive: false,
  })));
  const reviews = events.map((ev, i) => ({
    id: `review-${ev.id}`, camera:ev.camera, start_time:ev.start_time, end_time:ev.end_time,
    severity:i%3===0?'alert':'detection', has_been_reviewed:i%4===0,
    data:{detections:[ev.id], objects:[ev.label], zones:ev.zones, sub_labels:ev.sub_label?[ev.sub_label]:[]},
  }));
  // Enough history for date selection and hourly recording playback. Include a
  // deliberate one-minute gap in each hour; segments outside it are 4s long.
  const start = Math.floor((now-2*86400)/3600)*3600;
  const recordings = cameras.flatMap(camera => {
    const out=[];
    for(let t=start;t<now;t+=4) {
      if(t%3600>=1800 && t%3600<1860) continue;
      out.push({id:`${camera}-${t}`,camera,start_time:t,end_time:t+4,duration:4,motion:1,objects:1});
    }
    return out;
  });
  return {now, events, reviews, recordings};
}
export function recordingSummary(fixtures, camera, timezone='UTC') {
  const days=new Map();
  const hours=new Set(fixtures.recordings.filter(r=>r.camera===camera).map(r=>Math.floor(r.start_time/3600)*3600));
  for(const hour of hours) {
    const date=new Date(hour*1000);
    const parts=Object.fromEntries(new Intl.DateTimeFormat('en-CA',{timeZone:timezone,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',hourCycle:'h23'}).formatToParts(date).map(p=>[p.type,p.value]));
    const day=`${parts.year}-${parts.month}-${parts.day}`;
    if(!days.has(day)) days.set(day,new Map());
    days.get(day).set(Number(parts.hour),{hour:Number(parts.hour),events:3});
  }
  return [...days].map(([day,hours])=>({day,hours:[...hours.values()]}));
}
