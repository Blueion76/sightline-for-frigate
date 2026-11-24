import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { cameras, createFixtures } from './fixtures.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const fixtures=createFixtures();
const clients=new Set();
const build=()=>{const r=spawnSync(process.execPath,['scripts/build.mjs'],{cwd:root,stdio:'inherit'});return r.status===0;};
if(!build()) process.exit(1);
const mime={'.html':'text/html','.mjs':'text/javascript','.js':'text/javascript','.css':'text/css','.json':'application/json','.mp4':'video/mp4','.ts':'video/mp2t','.jpg':'image/jpeg','.svg':'image/svg+xml'};
function file(req,res,target) {
  const size=fs.statSync(target).size;
  const headers={'Content-Type':mime[path.extname(target)]||'application/octet-stream','Accept-Ranges':'bytes','Cache-Control':'no-store'};
  const range=req.headers.range;
  let start=0,end=size-1,status=200;
  if(range) {
    const m=/^bytes=(\d*)-(\d*)$/.exec(range);
    if(!m||(!m[1]&&!m[2])) {res.writeHead(416,{'Content-Range':`bytes */${size}`}).end();return;}
    start=m[1]?Number(m[1]):Math.max(0,size-Number(m[2]));end=m[1]&&m[2]?Math.min(size-1,Number(m[2])):size-1;
    if(start>end||start>=size){res.writeHead(416,{'Content-Range':`bytes */${size}`}).end();return;}
    status=206;headers['Content-Range']=`bytes ${start}-${end}/${size}`;
  }
  headers['Content-Length']=end-start+1;
  res.writeHead(status,headers);
  if(req.method==='HEAD')res.end();else fs.createReadStream(target,{start,end}).pipe(res);
}
const server=http.createServer((req,res)=>{
  try {
    const url=new URL(req.url,'http://localhost');
    const route=decodeURIComponent(url.pathname);
    if(req.method!=='GET'&&req.method!=='HEAD'){res.writeHead(405).end();return;}
    if(route==='/dev/bootstrap') {res.writeHead(200,{'Content-Type':'application/json','Cache-Control':'no-store'}).end(JSON.stringify({now:fixtures.now}));return;}
    if(route==='/dev/reload') {res.writeHead(200,{'Content-Type':'text/event-stream','Cache-Control':'no-cache','Connection':'keep-alive'});res.write(': ready\n\n');clients.add(res);req.on('close',()=>clients.delete(res));return;}
    const notification=route.match(/^\/api\/frigate\/demo\/notifications\/([^/]+)\/(thumbnail.jpg|snapshot.jpg|clip.mp4)$/);
    if(notification){const ev=fixtures.events.find(ev=>ev.id===notification[1]);if(!ev){res.writeHead(404).end();return;}file(req,res,path.join(root,'dev/media',`${ev.camera}.${notification[2].endsWith('.mp4')?'mp4':'jpg'}`));return;}
    const vod=route.match(/^\/api\/frigate\/demo\/vod\/([^/]+)\/start\/(\d+)\/end\/(\d+)\/(master|index).m3u8$/);
    if(vod && cameras.includes(vod[1])) {
      const [,camera,start,end,kind]=vod;
      if(kind==='master'){res.writeHead(200,{'Content-Type':'application/vnd.apple.mpegurl'}).end('#EXTM3U\n#EXT-X-STREAM-INF:BANDWIDTH=300000,RESOLUTION=640x360\nindex.m3u8\n');return;}
      // Frigate removes recording gaps from media time. Mirror that mapping.
      const ranges=fixtures.recordings.filter(r=>r.camera===camera&&r.end_time>Number(start)&&r.start_time<Number(end));
      let duration=ranges.reduce((total,r)=>total+Math.max(0,Math.min(Number(end),r.end_time)-Math.max(Number(start),r.start_time)),0);
      // Event clips are independent of the hourly recording-gap scenario.
      if(Number(end)-Number(start)<=20)duration=Number(end)-Number(start);
      if(duration<=0||Number(end)-Number(start)>86400){res.writeHead(404).end();return;}
      const lines=['#EXTM3U','#EXT-X-VERSION:3','#EXT-X-TARGETDURATION:4','#EXT-X-MEDIA-SEQUENCE:0','#EXT-X-PLAYLIST-TYPE:VOD'];
      for(let i=0;i<Math.ceil(duration/4);i++)lines.push('#EXT-X-DISCONTINUITY',`#EXTINF:${Math.min(4,duration-i*4).toFixed(3)},`,`/dev/media/${camera}.ts?segment=${i}`);
      lines.push('#EXT-X-ENDLIST');res.writeHead(200,{'Content-Type':'application/vnd.apple.mpegurl','Cache-Control':'no-store'}).end(lines.join('\n'));return;
    }
    const target=path.resolve(root,route==='/'?'dev/index.html':`.${route}`);
    // Serve only public preview paths; never expose .git, credentials or siblings.
    const relative=path.relative(root,target);
    if(relative.startsWith('..')||!['dev','src','dist','node_modules'].includes(relative.split(path.sep)[0])||relative.split(path.sep).some(p=>p.startsWith('.'))||!fs.existsSync(target)||!fs.statSync(target).isFile()){res.writeHead(404).end('Not found');return;}
    file(req,res,target);
  }catch(error){console.error(error);if(!res.headersSent)res.writeHead(500);res.end('Preview server error');}
});
let timer;
const watchers=[];
if(!process.argv.includes('--no-watch'))for(const dir of ['src','dev'])watchers.push(fs.watch(path.join(root,dir),{recursive:true},(_,filename)=>{
  if(!filename||filename.startsWith('media/'))return;
  clearTimeout(timer);timer=setTimeout(()=>{if(dir==='src'&&!build())return;for(const client of clients)client.write('data: reload\n\n');},150);
}));
server.listen(Number(process.env.PORT||5173),'127.0.0.1',()=>console.log(`Sightline standalone preview: http://127.0.0.1:${server.address().port}`));
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>{clearTimeout(timer);watchers.forEach(w=>w.close());clients.forEach(c=>c.end());server.close();});
