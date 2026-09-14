(function(){
  "use strict";
  const ROOT="https://www-infinity4.github.io/";
  const CONTROL_URL=ROOT+"Control-Phi/control-phi.js?v=20260914-network3";
  const POLICY_URL=ROOT+"Control-Phi/channel-policy.js?v=20260914-network1";
  const MOVIE_FARM_URL=ROOT+"Control-Phi/movie-source-farm.js?v=20260914-unique1";
  const FALLBACK_URL=ROOT+"News-Phi/control-phi.js?v=20260914-network3";
  const MOVIE_REPOS=new Set(["hermit-tv","star-launcher","hbo","cinemax","showtime","starz","encore","tnt"]);

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

  function currentRepo(){return(location.pathname.split("/").filter(Boolean)[0]||"").trim();}

  function bootstrapMovieSourceFarm(){
    const repo=currentRepo();
    if(!MOVIE_REPOS.has(repo.toLowerCase())||window.InfinityMovieSourceFarm)return;
    const profileUrl=ROOT+encodeURIComponent(repo).replace(/%2F/gi,"/")+"/data/source-profile.js?v=20260914-unique1";
    if(document.readyState==="loading"){
      const close='</scr'+'ipt>';
      document.write('<script src="'+profileUrl+'">'+close+'<script src="'+MOVIE_FARM_URL+'">'+close);
      return;
    }
    addScript(profileUrl,"infinityMovieProfile",null,()=>addScript(MOVIE_FARM_URL,"infinityMovieSourceFarm"));
  }

  function loadFallback(){
    if(window.ControlPhi&&window.ControlPhi.version)return;
    addScript(FALLBACK_URL,"infinityControlFallback");
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
    const names=["HermitEngine","PhysicsEngine","TBSEngine","TrumpTvEngine","NickEngine","WGNEngine","FSNEngine","ESPNEngine"];
    names.forEach(name=>stripLegacyCommercials(window[name]));
    Object.keys(window).filter(name=>/Engine$/.test(name)).forEach(name=>stripLegacyCommercials(window[name]));
  }

  bootstrapMovieSourceFarm();
  addScript(POLICY_URL,"infinityChannelPolicy");
  if(!(window.ControlPhi&&window.ControlPhi.version))addScript(CONTROL_URL,"infinityControlPhi",loadFallback);
  hardenLoadedEngines();
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",hardenLoadedEngines,{once:true});
  else setTimeout(hardenLoadedEngines,0);

  window.INFINITY_CHANNEL_NETWORK_SOURCE="Control-Phi";
  window.INFINITY_CHANNEL_BREAK_POLICY="legacy-fixed-breaks-disabled";
  window.INFINITY_MOVIE_CATALOG_POLICY="unique-source-farm-v1";
})();
