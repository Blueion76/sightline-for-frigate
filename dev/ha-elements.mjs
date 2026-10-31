// Development-only substitutes for HA media elements. Real <video> + hls.js
// decode local media; playback events are handled by the production card.
import Hls from '/node_modules/hls.js/dist/hls.mjs';
class PreviewHlsPlayer extends HTMLElement {
  constructor() { super(); this.attachShadow({mode:'open'}); this.shadowRoot.innerHTML='<style>:host{display:block;height:100%}video{display:block;width:100%;height:100%;object-fit:contain;background:#000}</style><video playsinline></video>'; this.video=this.shadowRoot.querySelector('video'); }
  set url(url) { this._url=url; if(this.isConnected)this.load(); }
  get url(){return this._url;}
  connectedCallback(){if(this._url)this.load();}
  load() {
    this._hlsPolyfillInstance?.destroy();
    const v=this.video;
    v.controls=this.controls!==false;v.muted=this.muted!==false;v.autoplay=this.autoPlay!==false;
    if(this._url.includes('.m3u8') && Hls.isSupported()) {
      const hls=new Hls(); this._hlsPolyfillInstance=hls;
      hls.loadSource(this._url);hls.attachMedia(v);
    } else v.src=this._url;
  }
  disconnectedCallback(){this.video.pause();this._hlsPolyfillInstance?.destroy();}
}
class PreviewCameraStream extends HTMLElement {
  constructor(){super();this.attachShadow({mode:'open'});}
  set hass(v){this._hass=v;}
  set stateObj(v){this._state=v;if(this.isConnected)this.render();}
  connectedCallback(){this.render();}
  render(){
    this.shadowRoot.replaceChildren();
    if(!this._state||this._state.state==='unavailable') {this.shadowRoot.innerHTML='<div style="padding:32px;color:#9ba7ad;text-align:center">Synthetic camera offline</div>';return;}
    const v=document.createElement('video');v.src=`/dev/media/${this._state.attributes.camera_name}.mp4`;v.muted=true;v.autoplay=true;v.loop=true;v.playsInline=true;v.controls=Boolean(this.controls);v.style.cssText='width:100%;height:100%;object-fit:contain;display:block';this.shadowRoot.append(v);
  }
  disconnectedCallback(){this.shadowRoot.querySelector('video')?.pause();}
}
// HA's card shell is a block element. Leaving it undefined makes the browser
// treat it as inline, adding line-box gaps above/below the preview.
class PreviewCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode:'open'}).innerHTML='<style>:host{display:block}</style><slot></slot>';
  }
}
customElements.define('ha-card',PreviewCard);
customElements.define('ha-hls-player',PreviewHlsPlayer);
customElements.define('ha-camera-stream',PreviewCameraStream);
