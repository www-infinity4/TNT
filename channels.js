(function(){
  "use strict";
  const CONTROL_URL="https://www-infinity4.github.io/Control-Phi/control-phi.js?v=20260914-network2";
  const POLICY_URL="https://www-infinity4.github.io/Control-Phi/channel-policy.js?v=20260914-network1";
  const FALLBACK_URL="https://www-infinity4.github.io/News-Phi/control-phi.js?v=20260914-network2";

  function addScript(src,key,onerror){
    if(document.querySelector(`script[data-${key}]`)||document.querySelector(`script[src^="${src.split('?')[0]}"]`))return;
    const script=document.createElement("script");
    script.src=src;
    script.async=false;
    script.dataset[key]="1";
    if(onerror)script.onerror=onerror;
    (document.head||document.documentElement).appendChild(script);
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

      // Legacy channel copies put every station on identical fixed break marks.
      // Until a channel opts into independentBreaks, remove those commercial
      // segments and keep the underlying program continuous instead.
      const retained=segments.filter(segment=>segment&&segment.kind!=="commercial").map(segment=>({...segment}));
      let stationStart=0;
      retained.forEach(segment=>{
        segment.stationStart=stationStart;
        stationStart+=Math.max(0,Number(segment.duration)||0);
      });
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

  addScript(POLICY_URL,"infinityChannelPolicy");
  if(!(window.ControlPhi&&window.ControlPhi.version))addScript(CONTROL_URL,"infinityControlPhi",loadFallback);
  hardenLoadedEngines();
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",hardenLoadedEngines,{once:true});
  else setTimeout(hardenLoadedEngines,0);

  // Legacy compatibility: pages that used to expect TNT/channels.js can keep
  // the same script tag, but Control Phi is now the only channel registry.
  window.INFINITY_CHANNEL_NETWORK_SOURCE="Control-Phi";
  window.INFINITY_CHANNEL_BREAK_POLICY="legacy-fixed-breaks-disabled";
})();
