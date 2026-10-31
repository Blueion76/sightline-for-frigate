// Optional: FFMPEG=/path/to/ffmpeg node dev/generate-media.mjs
// Generated assets are checked in; FFmpeg is not needed to run the preview.
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const font = process.env.FFMPEG_FONT || (process.platform==='darwin' ? '/System/Library/Fonts/Monaco.ttf' : '/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf');
const output = fileURLToPath(new URL('./media/', import.meta.url));
for (const [camera, sky, ground, house] of [
  ['front_door', '0x7895aa', '0x697c69', '0xd0c4af'],
  ['driveway', '0x8fa4aa', '0x737d73', '0xb5b8b0'],
  ['garden', '0x93acaa', '0x5a795b', '0xc4baa3'],
]) {
  const scene = `color=c=${sky}:s=640x360:r=10,drawbox=x=0:y=190:w=640:h=170:color=${ground}:t=fill,drawbox=x=100:y=55:w=440:h=190:color=${house}:t=fill,drawbox=x=270:y=115:w=90:h=130:color=0x3e4a4a:t=fill,drawbox=x=140:y=100:w=80:h=65:color=0x4f7185:t=fill,drawbox=x=420:y=100:w=80:h=65:color=0x4f7185:t=fill,drawbox=x=255:y=245:w=120:h=115:color=0x9a9d96:t=fill,drawbox=x=30:y=90:w=30:h=180:color=0x4a5448:t=fill,drawbox=x=0:y=65:w=105:h=85:color=0x365f49:t=fill,drawbox=x=555:y=200:w=65:h=55:color=0x3b6251:t=fill,drawtext=fontfile=${font}:text='SYNTHETIC / ${camera.replaceAll('_', ' ')}':x=14:y=14:fontsize=16:fontcolor=white:box=1:boxcolor=black@0.5,drawtext=fontfile=${font}:text='%{pts\\:hms}':x=14:y=h-30:fontsize=16:fontcolor=white:box=1:boxcolor=black@0.5,drawbox=x=390:y=245:w=22:h=55:color=0x304253:t=fill,drawbox=x=393:y=229:w=16:h=16:color=0xdab694:t=fill`;
  const run = args => execFileSync(process.env.FFMPEG || 'ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', ...args], {stdio:'inherit'});
  run(['-f','lavfi','-i',scene,'-t','20','-an','-c:v','libx264','-preset','ultrafast','-pix_fmt','yuv420p','-g','40','-keyint_min','40','-sc_threshold','0','-movflags','+faststart',`${output}${camera}.mp4`]);
  run(['-i',`${output}${camera}.mp4`,'-t','4','-c','copy','-bsf:v','h264_mp4toannexb','-f','mpegts',`${output}${camera}.ts`]);
  run(['-ss','2','-i',`${output}${camera}.mp4`,'-frames:v','1',`${output}${camera}.jpg`]);
}
