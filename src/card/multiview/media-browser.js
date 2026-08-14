/** Aggregate media-browser data and filters across all configured cameras. */
import { browserMethods } from '../browser.js';

export const multiviewMediaMethods = {
  _mediaFilterValues() {
    const values=browserMethods._mediaFilterValues.call(this);
    if(this._eventsMode==='all'){
      const cams=new Set(values.cams||[]);
      for(const config of (this._config?.cameras||[])){
        const cc=this._camCache?.[config.entity];
        if(cc?.cam)cams.add(String(cc.cam));
      }
      values.cams=[...cams].sort((a,b)=>String(a).localeCompare(String(b)));
    }
    return values;
  },

  async _loadAllCamsBackground() {
    const loadSeq=this._timelineLoadSeq;
    const now=Math.floor(Date.now()/1000);
    const isClipBrowser=this._eventsMode==='all'&&this._galleryMode==='clips';
    const bounds=isClipBrowser ? this._mediaQueryBounds(now) : {start:this._winStart,end:this._winEnd};
    const after=Math.max(0,Math.floor(Number(bounds?.start)||0));
    const before=Math.max(after+1,Math.floor(Number(bounds?.end)||now));
    const key=`${loadSeq}:${after}:${before}:${isClipBrowser?'clips':'timeline'}`;
    if(this._allCamsBackgroundPromise&&this._allCamsBackgroundKey===key) return this._allCamsBackgroundPromise;

    const task=(async()=>{
      const others=(this._config?.cameras||[]).filter(c=>{
        const cc=this._camCache?.[c.entity];
        return c.entity!==this._activeCam?.entity&&cc?.discovered&&cc.clientId&&cc.cam;
      });
      await Promise.all(others.map(async c=>{
        const cc=this._camCache[c.entity];
        try{
          const request={type:'frigate/events/get',instance_id:cc.clientId,cameras:[cc.cam],after,before,limit:isClipBrowser?500:200};
          if(isClipBrowser)request.has_clip=true;
          const ev=await this._ws(request);
          cc.events=Array.isArray(ev)?ev:[];
          this._mergeLoadedFilterMetadata(cc,cc.events,cc.reviews||[]);
        }catch(_){}
      }));
      if(loadSeq!==this._timelineLoadSeq||this._eventsMode!=='all')return;
      this._renderList();
      if(isClipBrowser&&this._galleryMode==='clips')this._renderGallery();
    })();

    this._allCamsBackgroundKey=key;
    this._allCamsBackgroundPromise=task;
    try{return await task;}
    finally{
      if(this._allCamsBackgroundPromise===task){
        this._allCamsBackgroundPromise=null;
        this._allCamsBackgroundKey='';
      }
    }
  },

  async _setGalleryMode(tab) {
    const result=await browserMethods._setGalleryMode.call(this,tab);
    if(tab==='clips'&&this._galleryMode==='clips'&&this._eventsMode==='all'){
      await this._loadAllCamsBackground();
      if(this._galleryMode==='clips')this._renderGallery();
    }
    return result;
  }
};
