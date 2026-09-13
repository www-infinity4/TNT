(function(){
  'use strict';
  const CHANNELS=[
    ['Hermit TV','https://www-infinity4.github.io/Hermit-TV/'],['Star Launcher','https://www-infinity4.github.io/Star-Launcher/'],['HBO','https://www-infinity4.github.io/HBO/'],['BET','https://www-infinity4.github.io/BET/'],['Cinemax','https://www-infinity4.github.io/Cinemax/'],['Showtime','https://www-infinity4.github.io/Showtime/'],['Starz','https://www-infinity4.github.io/Starz/'],['Encore','https://www-infinity4.github.io/Encore/'],['Cartoon Network','https://www-infinity4.github.io/Cartoon-Network/'],['Nickelodeon','https://www-infinity4.github.io/Nickelodeon/'],['Ozzy TV','https://www-infinity4.github.io/Ozzy-TV/'],['WGN','https://www-infinity4.github.io/WGN/'],['NBC','https://www-infinity4.github.io/NBC/'],['FOX','https://www-infinity4.github.io/FOX/'],['PBS','https://www-infinity4.github.io/PBS/'],['TNT','https://www-infinity4.github.io/TNT/'],['Trump TV','https://www-infinity4.github.io/Trump-TV/'],['ShopLC','https://www-infinity4.github.io/ShopLC/'],['StarQuest','https://www-infinity4.github.io/TV-Database/'],['Astraflix','https://www-infinity4.github.io/Astraflix/'],['Syncord','https://www-infinity4.github.io/Syncord/'],['Vintech','https://www-infinity4.github.io/Vintech/'],['Abstractia','https://www-infinity4.github.io/Abstractia-/'],['Flix Blender','https://www-infinity4.github.io/Flix-Blender/'],['Animasync','https://www-infinity4.github.io/Animasync/']
  ];
  const STYLE_ID='infinity-sync-safe-remote-style';
  function mounted(){
    const root=document.getElementById('app')||document.getElementById('root');
    if(!root)return true;
    const text=(root.textContent||'').trim();
    return !/^Loading\b/i.test(text)&&root.children.length>0;
  }
  function addStyle(){
    if(document.getElementById(STYLE_ID))return;
    const style=document.createElement('style');style.id=STYLE_ID;style.textContent='.infinity-sync-safe-menu{position:fixed;right:12px;top:12px;z-index:2147483000;font-family:system-ui,-apple-system,Segoe UI,sans-serif}.infinity-sync-safe-menu>summary{list-style:none;cursor:pointer;min-width:46px;min-height:42px;padding:0 13px;display:flex;align-items:center;justify-content:center;gap:7px;border:1px solid rgba(255,255,255,.25);border-radius:999px;color:#fff;background:rgba(7,10,18,.94);font-weight:800}.infinity-sync-safe-menu>summary::-webkit-details-marker{display:none}.infinity-sync-safe-menu nav{position:absolute;right:0;top:calc(100% + 8px);width:min(86vw,320px);max-height:72vh;overflow:auto;padding:8px;display:grid;gap:4px;border:1px solid rgba(255,255,255,.18);border-radius:15px;background:rgba(5,8,16,.98);box-shadow:0 18px 50px rgba(0,0,0,.5)}.infinity-sync-safe-menu nav a{display:block;padding:9px 10px;border-radius:9px;color:#fff!important;text-decoration:none!important;background:rgba(255,255,255,.055);font-weight:700}.infinity-sync-safe-menu nav a[aria-current="page"]{outline:2px solid #f5c451;background:rgba(245,196,81,.14)}';document.head.appendChild(style);
  }
  function render(nav){
    if(!nav)return;const current=(location.pathname.split('/').filter(Boolean)[0]||'').toLowerCase();
    nav.textContent='';CHANNELS.forEach(([name,url])=>{const a=document.createElement('a');a.href=url;a.textContent=name;if(new URL(url).pathname.split('/').filter(Boolean)[0].toLowerCase()===current)a.setAttribute('aria-current','page');nav.appendChild(a)});
  }
  function install(){
    if(!mounted())return false;addStyle();let menu=document.querySelector('.channel-menu');
    if(menu){const nav=menu.querySelector('nav');render(nav);return true;}
    menu=document.createElement('details');menu.className='infinity-sync-safe-menu';menu.innerHTML='<summary aria-label="Open channel remote">☰ <span>Channels</span></summary><nav aria-label="Switch channels"></nav>';document.body.appendChild(menu);render(menu.querySelector('nav'));return true;
  }
  let tries=0;function boot(){if(install())return;if(++tries<40)setTimeout(boot,250)}
  if(document.readyState==='complete')setTimeout(boot,0);else window.addEventListener('load',()=>setTimeout(boot,0),{once:true});
})();
