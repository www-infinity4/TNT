(function(){
  "use strict";
  const MUSIC_CHANNELS=[
    {name:"MTV",slug:"MTV",url:"https://www-infinity4.github.io/MTV/",group:"TV",liveLabel:"MTV · nonstop music videos · five-minute grid"},
    {name:"VH1",slug:"VH1",url:"https://www-infinity4.github.io/VH1/",group:"TV",liveLabel:"VH1 · nonstop music videos · five-minute grid"}
  ];
  const CORE_URL="https://www-infinity4.github.io/TNT/channels-core.js?v=20260913-music1";
  function currentSlug(){return(location.pathname.split("/").filter(Boolean)[0]||"").toLowerCase()}
  function anchor(channel,directory){
    const a=document.createElement("a");
    a.href=channel.url;
    if(channel.slug.toLowerCase()===currentSlug())a.setAttribute("aria-current","page");
    if(directory){
      const name=document.createElement("span");name.className="infinity-channel-name";name.textContent=channel.name;
      const live=document.createElement("small");live.dataset.liveState="ready";live.textContent=`LIVE · ${channel.liveLabel}`;
      a.append(name,live);
    }else a.textContent=channel.name;
    return a;
  }
  function addToArray(list){
    if(!Array.isArray(list))return;
    MUSIC_CHANNELS.forEach(channel=>{if(!list.some(item=>item&&String(item.slug).toLowerCase()===channel.slug.toLowerCase()))list.push({...channel})});
  }
  function insertMenuLinks(){
    document.querySelectorAll(".channel-menu nav").forEach(nav=>{
      const syncDivider=Array.from(nav.children).find(node=>node.classList&&node.classList.contains("infinity-remote-heading")&&/sync/i.test(node.textContent||""));
      const firstSync=syncDivider||Array.from(nav.querySelectorAll("a")).find(a=>/\/Astraflix\/?$/i.test(new URL(a.href,location.href).pathname));
      MUSIC_CHANNELS.forEach(channel=>{
        if(Array.from(nav.querySelectorAll("a")).some(a=>new URL(a.href,location.href).pathname.toLowerCase()===new URL(channel.url).pathname.toLowerCase()))return;
        nav.insertBefore(anchor(channel,false),firstSync||null);
      });
    });
  }
  function insertDirectoryLinks(){
    document.querySelectorAll(".channel-directory nav").forEach(nav=>{
      const divider=nav.querySelector(".infinity-guide-divider");
      MUSIC_CHANNELS.forEach(channel=>{
        if(Array.from(nav.querySelectorAll("a")).some(a=>new URL(a.href,location.href).pathname.toLowerCase()===new URL(channel.url).pathname.toLowerCase()))return;
        nav.insertBefore(anchor(channel,true),divider||null);
      });
    });
  }
  function register(){
    addToArray(window.INFINITY_CHANNELS);
    if(window.InfinityChannelRemote){
      addToArray(window.InfinityChannelRemote.channels);
      if(!window.InfinityChannelRemote.__musicWrapped&&typeof window.InfinityChannelRemote.refresh==="function"){
        const original=window.InfinityChannelRemote.refresh;
        window.InfinityChannelRemote.refresh=function(){const result=original.apply(this,arguments);setTimeout(register,0);return result};
        window.InfinityChannelRemote.__musicWrapped=true;
      }
    }
    insertMenuLinks();insertDirectoryLinks();
  }
  function hook(){
    if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",()=>setTimeout(register,0),{once:true});
    else setTimeout(register,0);
    window.addEventListener("pageshow",register);
  }
  const script=document.createElement("script");
  script.src=CORE_URL;
  script.async=false;
  script.onload=()=>{register();hook()};
  script.onerror=()=>console.error("Shared channel core failed to load");
  (document.head||document.documentElement).appendChild(script);
})();