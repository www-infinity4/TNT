(function(){
  "use strict";
  const CONTROL_URL="https://www-infinity4.github.io/Control-Phi/control-phi.js?v=20260914-network1";
  const POLICY_URL="https://www-infinity4.github.io/Control-Phi/channel-policy.js?v=20260914-network1";
  const FALLBACK_URL="https://www-infinity4.github.io/News-Phi/control-phi.js?v=20260914-network1";

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

  addScript(POLICY_URL,"infinityChannelPolicy");
  if(!(window.ControlPhi&&window.ControlPhi.version))addScript(CONTROL_URL,"infinityControlPhi",loadFallback);

  // Legacy compatibility: pages that used to expect TNT/channels.js can keep
  // the same script tag, but Control Phi is now the only channel registry.
  window.INFINITY_CHANNEL_NETWORK_SOURCE="Control-Phi";
})();
