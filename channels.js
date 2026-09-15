(function(){
  "use strict";
  const ROOT="https://www-infinity4.github.io/";
  const OMNI_CONTROL_URL=ROOT+"Omni-TV/omni-control.js?v=20260914-network3";
  const CONTROL_URL=ROOT+"Control-Phi/control-phi.js?v=20260914-network3";
  const NAV_URL=ROOT+"Control-Phi/channel-navigation.js?v=20260914-nav1";
  const POLICY_URL=ROOT+"Control-Phi/channel-policy.js?v=20260914-network1";
  const FALLBACK_URL=ROOT+"News-Phi/control-phi.js?v=20260914-network3";

  function addScript(src,key,onerror,onload){
    const old=document.querySelector(`script[data-${key}]`)||document.querySelector(`script[src^="${src.split('?')[0]}"]`);
    if(old){if(onload){if(old.dataset.loaded==="1")onload();else old.addEventListener("load",onload,{once:true});}return old;}
    const script=document.createElement("script");
    script.src=src;script.async=false;script.dataset[key]="1";
    if(onerror)script.onerror=onerror;
    script.onload=()=>{script.dataset.loaded="1";if(onload)onload();};
    (document.head||document.documentElement).appendChild(script);
    return script;
  }

  function loadFallback(){
    if(window.ControlPhi&&window.ControlPhi.version)return;
    addScript(FALLBACK_URL,"infinityControlFallback");
  }

  function hash(text){
    let value=2166136261;
    const input=String(text||"");
    for(let i=0;i<input.length;i++)value=Math.imul(value^input.charCodeAt(i),16777619);
    return value>>>0;
  }

  function seededShuffle(items,seedText){
    const copy=items.slice();
    let seed=hash(seedText);
    const random=()=>{
      seed+=0x6D2B79F5;
      let t=seed;
      t=Math.imul(t^(t>>>15),t|1);
      t^=t+Math.imul(t^(t>>>7),t|61);
      return((t^(t>>>14))>>>0)/4294967296;
    };
    for(let i=copy.length-1;i>0;i--){
      const j=Math.floor(random()*(i+1));
      [copy[i],copy[j]]=[copy[j],copy[i]];
    }
    return copy;
  }

  function hardenMovieSchedule(engine){
    if(!engine||typeof engine.createDaySchedule!=="function"||engine.__infinityRealCatalogSchedule)return;
    const original=engine.createDaySchedule;
    engine.createDaySchedule=function(nowMs,catalog){
      let originalSchedule=[];
      try{originalSchedule=original.apply(this,arguments)||[];}catch{}
      const blockSeconds=Math.max(60,Number(engine.BLOCK_SECONDS)||7200);
      const eligible=(Array.isArray(catalog)?catalog:[]).filter(movie=>{
        const runtime=Number(movie&&movie.runtimeSeconds);
        return !!(movie&&movie.cleared!==false&&movie.videoId&&Number.isFinite(runtime)&&runtime>=3600&&runtime<=blockSeconds);
      });
      if(!eligible.length)return originalSchedule;
      const hasBlank=!Array.isArray(originalSchedule)||originalSchedule.length<12||originalSchedule.some(block=>!block||!block.movie||!block.movie.videoId||block.movie.refill);
      if(!hasBlank)return originalSchedule;

      const parts=typeof engine.stationParts==="function"?engine.stationParts(new Date(nowMs)):null;
      const midnightMs=parts&&typeof engine.zonedToUtc==="function"
        ?engine.zonedToUtc(parts.year,parts.month,parts.day)
        :new Date(new Date(nowMs).setHours(0,0,0,0)).getTime();
      const dayNumber=Math.floor(midnightMs/86400000);
      const channel=String((window.INFINITY_CHANNEL&&window.INFINITY_CHANNEL.id)||location.pathname.split("/").filter(Boolean)[0]||"MOVIE").toUpperCase();
      const deck=seededShuffle(eligible,`infinity-real-catalog:${channel}:${dayNumber}`);
      const start=hash(`${channel}:${dayNumber}:offset`)%deck.length;
      const dateKey=typeof engine.dateKey==="function"?engine.dateKey(nowMs):new Date(midnightMs).toISOString().slice(0,10);

      return Array.from({length:12},(_,index)=>{
        const movie=deck[(start+index)%deck.length];
        const startsAtMs=midnightMs+index*blockSeconds*1000;
        return {
          id:`${dateKey}-${String(index).padStart(2,"0")}`,
          movie,
          startsAtMs,
          endsAtMs:startsAtMs+blockSeconds*1000,
          blockSeconds,
          fullStationSeconds:blockSeconds
        };
      });
    };
    engine.__infinityRealCatalogSchedule=true;
  }

  function stripLegacyCommercials(engine){
    if(!engine||typeof engine.createSegments!=="function"||engine.__infinityBreakHardened||engine.independentBreaks===true)return;
    const original=engine.createSegments;
    engine.createSegments=function(){
      const args=Array.from(arguments);
      const block=args[0]||{};
      const segments=original.apply(this,args);
      if(!Array.isArray(segments)||!segments.some(segment=>segment&&segment.kind==="commercial"))return segments;
      const retained=segments.filter(segment=>segment&&segment.kind!=="commercial").map(segment=>({...segment}));
      let stationStart=0;
      retained.forEach(segment=>{segment.stationStart=stationStart;stationStart+=Math.max(0,Number(segment.duration)||0);});
      const blockSeconds=Math.max(0,Number(block.blockSeconds||block.fullStationSeconds)||0);
      if(blockSeconds&&stationStart<blockSeconds){
        const remainder=blockSeconds-stationStart;
        const last=retained[retained.length-1];
        if(last&&last.kind==="station")last.duration+=remainder;
        else retained.push({kind:"station",title:"Next program starts on schedule",videoId:"",cleared:true,sourceStart:0,stationStart,duration:remainder});
      }
      return retained;
    };
    engine.__infinityBreakHardened=true;
  }

  function hardenLoadedEngines(){
    hardenMovieSchedule(window.HermitEngine);
    const names=["HermitEngine","PhysicsEngine","TBSEngine","TrumpTvEngine","NickEngine","WGNEngine","FSNEngine","ESPNEngine"];
    names.forEach(name=>stripLegacyCommercials(window[name]));
    Object.keys(window).filter(name=>/Engine$/.test(name)).forEach(name=>stripLegacyCommercials(window[name]));
  }

  // Live movie channels use their checked-in channel-specific catalogs directly.
  // The experimental movie source farm is intentionally not loaded: it previously
  // replaced real catalogs with tiny seed/cache sets and produced blank weekly slots.
  addScript(OMNI_CONTROL_URL,"infinityOmniControl");
  addScript(NAV_URL,"infinityCanonicalChannelNavigation");
  addScript(POLICY_URL,"infinityChannelPolicy");
  if(!(window.ControlPhi&&window.ControlPhi.version))addScript(CONTROL_URL,"infinityControlPhi",loadFallback);
  hardenLoadedEngines();
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",hardenLoadedEngines,{once:true});
  else setTimeout(hardenLoadedEngines,0);

  window.INFINITY_CHANNEL_NETWORK_SOURCE="Omni-Control-network3+Control-Phi";
  window.INFINITY_CHANNEL_REMOTE_SOURCE="Omni-TV/omni-control.js?v=20260914-network3";
  window.INFINITY_CHANNEL_BREAK_POLICY="legacy-fixed-breaks-disabled";
  window.INFINITY_MOVIE_CATALOG_POLICY="checked-in-channel-catalog+play-real-content-before-repeat+no-blank-inventory";
})();