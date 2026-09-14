(function(){
  'use strict';
  if(window.__INFINITY_SYNC_SAFE_REMOTE_V2__)return;
  window.__INFINITY_SYNC_SAFE_REMOTE_V2__=true;

  const OMNI='https://www-infinity4.github.io/Omni-TV/omni-control.js?v=20260914-network1';
  const FALLBACK=[
    ['Omni TV','Omni-TV'],['News Phi','News-Phi'],['Omni Phi','Omni-Phi'],['Infinity Phi','C13b0/phi'],
    ['Adventure TV','Adventure-TV'],['Discovery','Discovery'],['History Channel','History-Channel'],['CNN','CNN'],['FSN','FSN'],['ESPN','ESPN'],['TBS','TBS'],['BET','BET'],['Nickelodeon','Nickelodeon'],['Nintendo TV','Nintendo-TV'],['Ozzy TV','Ozzy-TV'],['MTV','MTV'],['VH1','VH1'],['Physics TV','Physics-TV'],['Motor TV','Motor-TV'],['CCR TV','CCR-TV'],['Trigger TV','Trigger-TV'],['Chiller','Chiller'],['Disney','Disney'],['Cartoon Network','Cartoon-Network'],['WGN','WGN'],['NBC','NBC'],['FOX','FOX'],['FX','FX'],['ABC','ABC'],['CBS','CBS'],['PBS','PBS'],['TNT','TNT'],['HBO','HBO'],['Cinemax','Cinemax'],['Showtime','Showtime'],['Starz','Starz'],['Encore','Encore'],['Hermit TV','Hermit-TV'],['Star Launcher','Star-Launcher'],['Trump TV','Trump-TV'],['ShopLC','ShopLC'],['StarQuest','TV-Database'],['Astraflix','Astraflix'],['Syncord','Syncord'],['Vintech','Vintech'],['Abstractia','Abstractia-'],['Flix Blender','Flix-Blender'],['Animasync','Animasync'],['SeekSync','SeekSync']
  ].map(([name,slug])=>({name,slug,url:`https://www-infinity4.github.io/${slug}/`}));

  function fallback(){
    if(document.getElementById('omniControlButton')||document.querySelector('.infinity-sync-safe-menu'))return;
    const style=document.createElement('style');style.textContent='.infinity-sync-safe-menu{position:fixed;right:10px;top:10px;z-index:2147483000;font-family:system-ui}.infinity-sync-safe-menu>summary{list-style:none;cursor:pointer;min-height:44px;padding:0 13px;display:flex;align-items:center;gap:7px;border:1px solid #ffffff40;border-radius:14px;color:#fff;background:#0b1510;font-weight:900}.infinity-sync-safe-menu>summary::-webkit-details-marker{display:none}.infinity-sync-safe-menu nav{position:absolute;right:0;top:calc(100% + 8px);width:min(90vw,340px);max-height:72vh;overflow:auto;padding:8px;display:grid;gap:4px;border:1px solid #ffffff2b;border-radius:15px;background:#050810;box-shadow:0 18px 50px #0009}.infinity-sync-safe-menu nav a{display:block;padding:10px;border-radius:9px;color:#fff;text-decoration:none;background:#ffffff0e;font-weight:750}';document.head.appendChild(style);
    const menu=document.createElement('details');menu.className='channel-menu infinity-sync-safe-menu';menu.innerHTML='<summary aria-label="Open Channels">☰ <span>Channels</span></summary><nav aria-label="Switch channels"></nav>';const nav=menu.querySelector('nav'),current=(location.pathname.split('/').filter(Boolean)[0]||'').toLowerCase();FALLBACK.forEach(channel=>{const a=document.createElement('a');a.href=channel.url;a.textContent=channel.name;if(channel.slug.toLowerCase()===current)a.setAttribute('aria-current','page');nav.appendChild(a)});document.body.appendChild(menu);
  }

  function load(){
    if(window.__OMNI_CONTROL_REMOTE__)return;
    if(document.querySelector('script[src^="https://www-infinity4.github.io/Omni-TV/omni-control.js"]'))return;
    const script=document.createElement('script');script.src=OMNI;script.async=true;script.onerror=fallback;(document.head||document.documentElement).appendChild(script);
    setTimeout(()=>{if(!window.__OMNI_CONTROL_REMOTE__)fallback()},3500);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',load,{once:true});else load();
})();