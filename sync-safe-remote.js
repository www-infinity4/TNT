(function(){
  'use strict';
  const FALLBACK=[
    ['Adventure TV','Adventure-TV'],['Discovery','Discovery'],['History Channel','History-Channel'],['CNN','CNN'],['FSN','FSN'],['TBS','TBS'],['BET','BET'],['Nickelodeon','Nickelodeon'],['Nintendo TV','Nintendo-TV'],['Ozzy TV','Ozzy-TV'],['MTV','MTV'],['VH1','VH1'],['Physics TV','Physics-TV'],['Motor TV','Motor-TV'],['CCR TV','CCR-TV'],['Trigger TV','Trigger-TV'],['Chiller','Chiller'],['Disney Vintage','Disney'],['Cartoon Network','Cartoon-Network'],['WGN','WGN'],['NBC','NBC'],['FOX','FOX'],['PBS','PBS'],['TNT','TNT'],['HBO','HBO'],['Cinemax','Cinemax'],['Showtime','Showtime'],['Starz','Starz'],['Encore','Encore'],['Hermit TV','Hermit-TV'],['Star Launcher','Star-Launcher'],['Trump TV','Trump-TV'],['ShopLC','ShopLC'],['StarQuest','TV-Database'],['Astraflix','Astraflix'],['Syncord','Syncord'],['Vintech','Vintech'],['Abstractia','Abstractia-'],['Flix Blender','Flix-Blender'],['Animasync','Animasync']
  ].map(([name,slug])=>({name,slug,url:`https://www-infinity4.github.io/${slug}/`}));
  const STYLE_ID='infinity-sync-safe-remote-style';
  function mounted(){
    const root=document.getElementById('app')||document.getElementById('root');
    if(!root)return true;
    const text=(root.textContent||'').trim();
    return !/^Loading\b/i.test(text)&&root.children.length>0;
  }
  function channels(){
    const live=Array.isArray(window.ADVENTURE_CHANNELS)&&window.ADVENTURE_CHANNELS.length?window.ADVENTURE_CHANNELS:FALLBACK;
    const list=live.map(c=>({name:c.name,slug:c.slug||new URL(c.url).pathname.split('/').filter(Boolean)[0],url:c.url}));
    if(!list.some(c=>String(c.slug).toLowerCase()==='abstractia-'))list.push({name:'Abstractia',slug:'Abstractia-',url:'https://www-infinity4.github.io/Abstractia-/'});
    return list;
  }
  function addStyle(){
    if(document.getElementById(STYLE_ID))return;
    const style=document.createElement('style');style.id=STYLE_ID;style.textContent='.infinity-sync-safe-menu{position:fixed;right:12px;top:12px;z-index:2147483000;font-family:system-ui,-apple-system,Segoe UI,sans-serif}.infinity-sync-safe-menu>summary{list-style:none;cursor:pointer;min-width:46px;min-height:42px;padding:0 13px;display:flex;align-items:center;justify-content:center;gap:7px;border:1px solid rgba(255,255,255,.25);border-radius:999px;color:#fff;background:rgba(7,10,18,.94);font-weight:800}.infinity-sync-safe-menu>summary::-webkit-details-marker{display:none}.infinity-sync-safe-menu nav{position:absolute;right:0;top:calc(100% + 8px);width:min(86vw,320px);max-height:72vh;overflow:auto;padding:8px;display:grid;gap:4px;border:1px solid rgba(255,255,255,.18);border-radius:15px;background:rgba(5,8,16,.98);box-shadow:0 18px 50px rgba(0,0,0,.5)}.infinity-sync-safe-menu nav a{display:block;padding:9px 10px;border-radius:9px;color:#fff!important;text-decoration:none!important;background:rgba(255,255,255,.055);font-weight:700}.infinity-sync-safe-menu nav a[aria-current="page"]{outline:2px solid #f5c451;background:rgba(245,196,81,.14)}';document.head.appendChild(style);
  }
  function render(nav){
    if(!nav)return;const current=(location.pathname.split('/').filter(Boolean)[0]||'').toLowerCase();
    nav.textContent='';channels().forEach(channel=>{const a=document.createElement('a');a.href=channel.url;a.textContent=channel.name;if(String(channel.slug).toLowerCase()===current)a.setAttribute('aria-current','page');nav.appendChild(a)});
  }
  function ensureMenu(){
    addStyle();let menu=document.querySelector('.channel-menu');
    if(menu){render(menu.querySelector('nav'));return menu;}
    menu=document.createElement('details');menu.className='infinity-sync-safe-menu';menu.innerHTML='<summary aria-label="Open channel remote">☰ <span>Channels</span></summary><nav aria-label="Switch channels"></nav>';document.body.appendChild(menu);render(menu.querySelector('nav'));return menu;
  }
  function loadMaster(){
    if(window.ADVENTURE_CHANNELS){render(ensureMenu().querySelector('nav'));return;}
    const script=document.createElement('script');
    script.src='https://www-infinity4.github.io/Adventure-TV/channels.js?v=20260913-master1';
    script.async=true;
    script.onload=()=>render(ensureMenu().querySelector('nav'));
    script.onerror=()=>render(ensureMenu().querySelector('nav'));
    document.head.appendChild(script);
  }
  function install(){if(!mounted())return false;const menu=ensureMenu();render(menu.querySelector('nav'));loadMaster();return true;}
  let tries=0;function boot(){if(install())return;if(++tries<40)setTimeout(boot,250)}
  if(document.readyState==='complete')setTimeout(boot,0);else window.addEventListener('load',()=>setTimeout(boot,0),{once:true});
})();
