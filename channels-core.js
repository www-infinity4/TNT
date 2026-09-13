(function () {
  "use strict";

  const channels = [
    { name:"Hermit TV", slug:"Hermit-TV", url:"https://www-infinity4.github.io/Hermit-TV/", group:"TV", scheduled:true },
    { name:"Star Launcher", slug:"Star-Launcher", url:"https://www-infinity4.github.io/Star-Launcher/", group:"TV", scheduled:true },
    { name:"HBO", slug:"HBO", url:"https://www-infinity4.github.io/HBO/", group:"TV", scheduled:true },
    { name:"BET", slug:"BET", url:"https://www-infinity4.github.io/BET/", group:"TV", liveLabel:"BET · Black entertainment, sports, music & culture" },
    { name:"Cinemax", slug:"Cinemax", url:"https://www-infinity4.github.io/Cinemax/", group:"TV", scheduled:true },
    { name:"Showtime", slug:"Showtime", url:"https://www-infinity4.github.io/Showtime/", group:"TV", scheduled:true },
    { name:"Starz", slug:"Starz", url:"https://www-infinity4.github.io/Starz/", group:"TV", scheduled:true },
    { name:"Encore", slug:"Encore", url:"https://www-infinity4.github.io/Encore/", group:"TV", scheduled:true },
    { name:"Cartoon Network", slug:"Cartoon-Network", url:"https://www-infinity4.github.io/Cartoon-Network/", group:"TV", scheduled:true },
    { name:"Nickelodeon", slug:"Nickelodeon", url:"https://www-infinity4.github.io/Nickelodeon/", group:"TV", scheduled:true },
    { name:"Ozzy TV", slug:"Ozzy-TV", url:"https://www-infinity4.github.io/Ozzy-TV/", group:"TV", scheduled:true },
    { name:"WGN", slug:"WGN", url:"https://www-infinity4.github.io/WGN/", group:"TV", scheduled:true },
    { name:"NBC", slug:"NBC", url:"https://www-infinity4.github.io/NBC/", group:"TV", scheduled:true },
    { name:"FOX", slug:"FOX", url:"https://www-infinity4.github.io/FOX/", group:"TV", scheduled:true },
    { name:"PBS", slug:"PBS", url:"https://www-infinity4.github.io/PBS/", group:"TV", scheduled:true },
    { name:"TNT", slug:"TNT", url:"https://www-infinity4.github.io/TNT/", group:"TV", scheduled:true },
    { name:"Trump TV", slug:"Trump-TV", url:"https://www-infinity4.github.io/Trump-TV/", group:"TV", scheduled:true },
    { name:"ShopLC", slug:"ShopLC", url:"https://www-infinity4.github.io/ShopLC/", group:"TV", liveLabel:"Shop LC Live — deals, gemstones, fashion & home" },
    { name:"StarQuest", slug:"TV-Database", url:"https://www-infinity4.github.io/TV-Database/", group:"TV", liveLabel:"StarQuest classic TV & movies" },
    { name:"Astraflix", slug:"Astraflix", url:"https://www-infinity4.github.io/Astraflix/", group:"SYNC" },
    { name:"Syncord", slug:"Syncord", url:"https://www-infinity4.github.io/Syncord/", group:"SYNC" },
    { name:"Vintech", slug:"Vintech", url:"https://www-infinity4.github.io/Vintech/", group:"SYNC" },
    { name:"Abstractia", slug:"Abstractia-", url:"https://www-infinity4.github.io/Abstractia-/", group:"SYNC" },
    { name:"Flix Blender", slug:"Flix-Blender", url:"https://www-infinity4.github.io/Flix-Blender/", group:"SYNC" },
    { name:"Animasync", slug:"Animasync", url:"https://www-infinity4.github.io/Animasync/", group:"SYNC" }
  ];

  const STYLE_ID = "infinity-shared-network-style-v3";
  const SOURCE_CACHE = new Map();
  const BLOCKED_GUIDE_TITLES = /galaxy of terror|chopping mall|fatal combat|hologram man|breakfast of champions|eulogy|blitz|the fanatic|the presence|monsters of man|wanted|zodiac|payback|\bava\b|assault on precinct 13|the fog|\brage\b|a good marriage|return of the living dead|michael collins|deathtrap/i;
  let guideObserver = null;
  let mutationObserver = null;

  function currentSlug() {
    const parts = location.pathname.split("/").filter(Boolean);
    return parts[0] || "";
  }

  function safeJSON(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) || fallback; }
    catch (_) { return fallback; }
  }

  function esc(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
  }

  function installStyle() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      /* Existing channel menus retain their native buttons and visual identity. */
      .channel-menu>nav{right:0!important;left:auto!important;width:min(270px,calc(100vw - 28px))!important;max-width:calc(100vw - 28px)!important;max-height:calc(100dvh - 92px)!important;overflow-y:auto!important;overscroll-behavior:contain!important;box-sizing:border-box!important}
      .channel-menu>nav a{white-space:normal!important}
      /* IMPORTANT: existing .channel-menu elements keep each site's native CSS. */
      .infinity-auto-menu{position:fixed;right:10px;top:10px;z-index:2147483000;font-family:system-ui,-apple-system,Segoe UI,sans-serif}
      .infinity-auto-menu>summary{list-style:none;cursor:pointer;min-width:48px;min-height:44px;padding:0 13px;display:inline-flex;align-items:center;justify-content:center;gap:8px;border:1px solid rgba(255,255,255,.28);border-radius:999px;color:#fff;background:rgba(8,12,22,.92);box-shadow:0 8px 26px rgba(0,0,0,.35);font-weight:800}
      .infinity-auto-menu>summary::-webkit-details-marker{display:none}
      .infinity-auto-menu nav{position:absolute;right:0;top:calc(100% + 8px);width:min(88vw,340px);max-height:72vh;overflow:auto;padding:9px;border:1px solid rgba(255,255,255,.2);border-radius:16px;background:rgba(5,8,16,.98);box-shadow:0 18px 55px rgba(0,0,0,.58);display:grid;gap:5px}
      .infinity-auto-menu nav a{display:block;padding:10px 11px;border-radius:10px;color:#fff!important;text-decoration:none!important;background:rgba(255,255,255,.055);font-weight:700}
      .infinity-auto-menu nav a[aria-current="page"]{outline:2px solid #f5c451;background:rgba(245,196,81,.14)}
      .infinity-auto-menu .infinity-remote-heading{padding:9px 9px 4px;color:#f5c451;font-size:11px;font-weight:900;letter-spacing:.12em;text-transform:uppercase}
      .infinity-shared-actions{display:inline-flex;align-items:center;gap:8px;flex-wrap:wrap;font-family:system-ui,-apple-system,Segoe UI,sans-serif}
      .infinity-shared-actions.infinity-actions-fixed{position:fixed;right:10px;bottom:10px;z-index:2147482900;padding:8px;border:1px solid rgba(255,255,255,.18);border-radius:16px;background:rgba(5,8,16,.94);box-shadow:0 12px 40px rgba(0,0,0,.5)}
      .infinity-shared-share,.infinity-wallet-button{min-height:42px;padding:0 13px;border:1px solid rgba(255,255,255,.3);border-radius:999px;background:#111827;color:#fff;font:800 13px/1 system-ui;cursor:pointer}
      .infinity-wallet-wrap{position:relative;display:inline-flex}.infinity-wallet-button{background:#201837}
      .infinity-wallet-panel{position:absolute;right:0;bottom:calc(100% + 8px);min-width:230px;padding:12px;border:1px solid rgba(255,255,255,.2);border-radius:14px;background:rgba(5,8,16,.98);box-shadow:0 18px 50px rgba(0,0,0,.55);color:#fff;z-index:2147483000;font:600 13px/1.4 system-ui}
      .infinity-wallet-panel[hidden]{display:none}.infinity-wallet-panel strong{display:block;font-size:24px;color:#f5c451}.infinity-wallet-panel small{display:block;margin-top:5px;opacity:.78}
      .infinity-created-directory{margin:28px auto;padding:18px;width:min(1180px,calc(100% - 24px));border:1px solid rgba(255,255,255,.14);border-radius:20px;background:rgba(6,10,20,.9);color:#fff;font-family:system-ui,-apple-system,Segoe UI,sans-serif}
      .infinity-live-heading{display:flex;align-items:end;justify-content:space-between;gap:12px;margin-bottom:12px}.infinity-live-heading strong{font-size:22px}.infinity-live-heading span{font-size:12px;opacity:.72}
      .channel-directory nav.infinity-live-guide{display:grid!important;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:9px!important;align-items:stretch}
      .infinity-live-guide a{display:flex!important;flex-direction:column;gap:5px;padding:12px!important;border:1px solid rgba(255,255,255,.14)!important;border-radius:14px!important;background:rgba(255,255,255,.055)!important;color:#fff!important;text-decoration:none!important;min-width:0}
      .infinity-live-guide a[aria-current="page"]{outline:2px solid #f5c451;background:rgba(245,196,81,.12)!important}
      .infinity-live-guide .infinity-channel-name{font-weight:900}.infinity-live-guide small{line-height:1.3;opacity:.8;white-space:normal}.infinity-live-guide small[data-live-state="ready"]{opacity:1;color:#f5c451}
      .infinity-guide-divider{grid-column:1/-1;margin-top:8px;padding:9px 2px 2px;font-size:11px;font-weight:900;letter-spacing:.12em;text-transform:uppercase;color:#f5c451}
      @media(max-width:640px){.infinity-auto-menu>summary .menu-label{display:none}.infinity-auto-menu nav{width:min(92vw,330px)}.channel-directory nav.infinity-live-guide{grid-template-columns:1fr 1fr}.infinity-live-guide a{padding:10px!important}.infinity-live-heading{align-items:start;flex-direction:column}}
    `;
    document.head.appendChild(style);
  }

  function linkHTML(channel, active) {
    const current = channel.slug.toLowerCase() === active.toLowerCase();
    return `<a${current ? ' aria-current="page"' : ''} href="${channel.url}">${esc(channel.name)}</a>`;
  }

  function renderRemote(nav, fallback) {
    if (!nav) return;
    const active = currentSlug();
    const tv = channels.filter(channel => channel.group === "TV");
    const syncChannels = channels.filter(channel => channel.group === "SYNC");
    if (fallback) {
      nav.innerHTML = `<div class="infinity-remote-heading">Live channels</div>${tv.map(channel => linkHTML(channel, active)).join("")}<div class="infinity-remote-heading">Sync channels</div>${syncChannels.map(channel => linkHTML(channel, active)).join("")}`;
      return;
    }
    /* Native hamburgers get only links. No shared wrapper/classes/headings alter their layout. */
    nav.innerHTML = tv.concat(syncChannels).map(channel => linkHTML(channel, active)).join("");
  }

  function ensureMenu() {
    const existing = document.querySelector(".channel-menu");
    if (existing) {
      existing.classList.remove("infinity-auto-menu");
      renderRemote(existing.querySelector("nav"), false);
      return existing;
    }
    const details = document.createElement("details");
    details.className = "channel-menu infinity-auto-menu";
    details.innerHTML = '<summary aria-label="Open channel remote"><span aria-hidden="true">☰</span><span class="menu-label">Remote</span></summary><nav aria-label="Switch channels"></nav>';
    document.body.appendChild(details);
    renderRemote(details.querySelector("nav"), true);
    return details;
  }

  function walletSnapshot() {
    const session = safeJSON("starquest_session", null);
    const users = safeJSON("starquest_users", {});
    const profile = session && session.key && users[session.key] ? users[session.key] : safeJSON("starquest_guest_profile_v1", {});
    const coins = Math.max(0, Number(profile.tokens) || 0);
    const pending = Math.max(0, Number(profile.pendingShareCredits) || 0);
    const shares = Math.max(0, Number(profile.shareCount) || 0);
    return {coins,pending,shares,total:coins + pending / 10};
  }

  function formatCoins(value) { return Number(value || 0).toFixed(1); }

  function refreshWallet() {
    const snap = walletSnapshot();
    document.querySelectorAll(".infinity-wallet-button").forEach(button => button.textContent = `Wallet ⭐ ${formatCoins(snap.total)}`);
    document.querySelectorAll(".infinity-wallet-panel").forEach(panel => {
      panel.innerHTML = `<strong>⭐ ${formatCoins(snap.total)}</strong><span>Total StarCoins + share progress</span><small>${snap.coins} completed coin${snap.coins === 1 ? "" : "s"} · ${snap.pending}/10 toward the next coin · ${snap.shares} confirmed shares</small>`;
    });
  }

  function makeWallet() {
    const wrap = document.createElement("span");
    wrap.className = "infinity-wallet-wrap";
    wrap.innerHTML = '<button class="infinity-wallet-button" type="button" aria-expanded="false">Wallet ⭐ 0.0</button><span class="infinity-wallet-panel" hidden></span>';
    const button = wrap.querySelector("button"), panel = wrap.querySelector(".infinity-wallet-panel");
    button.addEventListener("click", () => {
      const open = panel.hidden;
      panel.hidden = !open;
      button.setAttribute("aria-expanded", String(open));
      refreshWallet();
    });
    return wrap;
  }

  function recordShare(reference) {
    const attemptId = `shared-channel-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`;
    if (window.StarQuestAuth && typeof window.StarQuestAuth.recordShare === "function") {
      try {
        const result = window.StarQuestAuth.recordShare(reference, {attemptId,confirmed:true,verified:true,method:"web_share_api",url:reference,showTitle:document.title});
        if (result && result.ok) { refreshWallet(); return result; }
      } catch (_) {}
    }
    const session = safeJSON("starquest_session", null);
    const users = safeJSON("starquest_users", {});
    const signedIn = session && session.key && users[session.key];
    const profile = signedIn || safeJSON("starquest_guest_profile_v1", {key:"__guest__",username:"Guest",tokens:0,shareCount:0,pendingShareCredits:0,shareEvents:[],ledger:[]});
    profile.tokens = Math.max(0, Number(profile.tokens) || 0);
    profile.shareCount = Math.max(0, Number(profile.shareCount) || 0) + 1;
    profile.pendingShareCredits = Math.max(0, Number(profile.pendingShareCredits) || 0) + 1;
    profile.shareEvents = Array.isArray(profile.shareEvents) ? profile.shareEvents : [];
    profile.ledger = Array.isArray(profile.ledger) ? profile.ledger : [];
    const event = {id:attemptId,attemptId,contentId:reference,method:"web_share_api",confirmed:true,verified:true,verificationState:"client_confirmed",showTitle:document.title,createdAt:Date.now()};
    profile.shareEvents.push(event);
    let awarded = 0;
    while (profile.pendingShareCredits >= 10) { profile.pendingShareCredits -= 10; profile.tokens += 1; awarded += 1; }
    profile.ledger.push({id:`tx-${attemptId}`,type:awarded?"share_reward":"share_credit",amount:awarded,balance:profile.tokens,pendingShareCredits:profile.pendingShareCredits,reason:awarded?"Share reward: 10 completed shares":`Confirmed share receipt ${profile.pendingShareCredits}/10`,referenceId:attemptId,createdAt:Date.now()});
    profile.shareEvents = profile.shareEvents.slice(-250);
    profile.ledger = profile.ledger.slice(-500);
    if (signedIn) { users[session.key] = profile; localStorage.setItem("starquest_users", JSON.stringify(users)); }
    else localStorage.setItem("starquest_guest_profile_v1", JSON.stringify(profile));
    window.dispatchEvent(new CustomEvent("starquest:share-progress", {detail:{user:profile,lifetimeShareCount:profile.shareCount,progressToNextCoin:profile.pendingShareCredits,sharesPerCoin:10,awarded,balance:profile.tokens,event}}));
    refreshWallet();
    return {ok:true,awarded,progressToNextCoin:profile.pendingShareCredits,balance:profile.tokens};
  }

  function setShareStatus(text) {
    const node = document.querySelector("#shareStatus,.share-status,[data-share-status]");
    if (node) node.textContent = text;
  }

  async function sharedShare(event, button) {
    event.preventDefault();
    event.stopImmediatePropagation();
    const nowTitle = document.querySelector("#nowTitle,[data-now-title]");
    const title = nowTitle && nowTitle.textContent && !/loading/i.test(nowTitle.textContent) ? nowTitle.textContent.trim() : document.title;
    const payload = {title:`${title} · ${document.title}`,text:`Watch ${title} on ${document.title}.`,url:location.href};
    try { if (window.InfinityChannelPiP && typeof window.InfinityChannelPiP.system === "function") window.InfinityChannelPiP.system(); } catch (_) {}
    if (!navigator.share) {
      try { await navigator.clipboard.writeText(payload.url); setShareStatus("Link copied. A confirmed system share earns 1/10 StarCoin."); }
      catch (_) { setShareStatus("Sharing is unavailable in this browser."); }
      return;
    }
    try {
      await navigator.share(payload);
      const result = recordShare(payload.url);
      const snap = walletSnapshot();
      setShareStatus(result && result.awarded ? `Shared · StarCoin completed! Wallet ⭐ ${formatCoins(snap.total)}` : `Shared · +1/10 ⭐ · Wallet ${formatCoins(snap.total)}`);
      button.blur();
    } catch (error) {
      if (!error || error.name !== "AbortError") setShareStatus("Share did not complete, so no StarCoin credit was added.");
    }
  }

  function bindShareButton(button) {
    if (!button || button.dataset.infinityCentralShare === "1") return;
    button.dataset.infinityCentralShare = "1";
    button.textContent = "Share · +1/10 ⭐";
    button.addEventListener("click", event => sharedShare(event, button), true);
  }

  function attachWalletBeside(button) {
    if (!button || button.parentElement && button.parentElement.querySelector(":scope > .infinity-wallet-wrap")) return;
    button.insertAdjacentElement("afterend", makeWallet());
    refreshWallet();
  }

  function ensureActions() {
    const shares = Array.from(document.querySelectorAll("#shareButton,.share-button,.infinity-shared-share"));
    const realShare = shares.find(button => button.dataset.infinityGeneratedShare !== "1");
    const fixed = document.querySelector(".infinity-shared-actions.infinity-actions-fixed");
    if (realShare) {
      bindShareButton(realShare);
      attachWalletBeside(realShare);
      if (fixed) fixed.remove();
      return;
    }
    const generated = shares.find(button => button.dataset.infinityGeneratedShare === "1");
    if (generated) { bindShareButton(generated); attachWalletBeside(generated); return; }
    const bar = document.createElement("div");
    bar.className = "infinity-shared-actions infinity-actions-fixed";
    const share = document.createElement("button");
    share.type = "button";
    share.className = "infinity-shared-share share-button";
    share.dataset.infinityGeneratedShare = "1";
    share.textContent = "Share · +1/10 ⭐";
    bar.append(share, makeWallet());
    document.body.appendChild(bar);
    bindShareButton(share);
    refreshWallet();
  }

  function ensureDirectory() {
    let section = document.querySelector(".channel-directory");
    if (!section) {
      section = document.createElement("section");
      section.className = "channel-directory infinity-created-directory";
      const footer = document.querySelector("footer");
      if (footer) footer.parentNode.insertBefore(section, footer); else document.body.appendChild(section);
    }
    section.innerHTML = '<div class="infinity-live-heading"><strong>Live now</strong><span>Other channels · times shown in your local time</span></div><nav class="infinity-live-guide" aria-label="Live channel guide"></nav>';
    renderGuideShell(section.querySelector("nav"));
    return section;
  }

  function renderGuideShell(nav) {
    const active = currentSlug();
    const tv = channels.filter(channel => channel.group === "TV");
    const syncChannels = channels.filter(channel => channel.group === "SYNC");
    nav.innerHTML = tv.map(channel => {
      const current = channel.slug.toLowerCase() === active.toLowerCase();
      return `<a${current?' aria-current="page"':''} href="${channel.url}"><span class="infinity-channel-name">${esc(channel.name)}</span><small data-live-slug="${esc(channel.slug)}">Checking live program…</small></a>`;
    }).join("") + `<div class="infinity-guide-divider">Sync channels</div>` + syncChannels.map(channel => {
      const current = channel.slug.toLowerCase() === active.toLowerCase();
      return `<a${current?' aria-current="page"':''} href="${channel.url}"><span class="infinity-channel-name">${esc(channel.name)}</span><small data-live-state="ready">SYNC CINEMA · Open paired film + music</small></a>`;
    }).join("");
  }

  function formatLocalTime(ms) {
    try { return new Intl.DateTimeFormat("en-US", {hour:"numeric",minute:"2-digit"}).format(new Date(ms)); }
    catch (_) { return ""; }
  }

  function storedPresence(slug) {
    const data = safeJSON(`infinity_live_${slug}`, null);
    if (!data || !data.title || !data.updatedAt || Date.now() - data.updatedAt > 5 * 60 * 1000) return null;
    if (BLOCKED_GUIDE_TITLES.test(String(data.title))) return null;
    return data;
  }

  function fakeDocument() {
    return {querySelector:()=>null,querySelectorAll:()=>[],createElement:()=>({dataset:{},style:{},setAttribute(){},appendChild(){}}),head:{appendChild(){}},body:{appendChild(){}},addEventListener(){}};
  }

  async function sourceBundle(channel) {
    if (SOURCE_CACHE.has(channel.slug)) return SOURCE_CACHE.get(channel.slug);
    const promise = Promise.all([
      fetch(`${channel.url}engine.js`, {cache:"force-cache"}).then(response => response.ok ? response.text() : Promise.reject(new Error("engine"))),
      fetch(`${channel.url}data/catalog.js`, {cache:"force-cache"}).then(response => response.ok ? response.text() : Promise.reject(new Error("catalog")))
    ]).then(([engineSource,catalogSource]) => {
      const box = {};
      const doc = fakeDocument();
      Function("window","document",engineSource)(box,doc);
      Function("window","document",catalogSource)(box,doc);
      return box;
    });
    SOURCE_CACHE.set(channel.slug, promise);
    return promise;
  }

  async function resolveScheduled(channel) {
    const box = await sourceBundle(channel);
    const engine = box.HermitEngine;
    const catalog = box.HERMIT_CATALOG;
    const commercials = box.HERMIT_COMMERCIALS || [];
    if (!engine || !Array.isArray(catalog) || !catalog.length || typeof engine.createDaySchedule !== "function") throw new Error("schedule unavailable");
    const now = Date.now();
    const schedule = engine.createDaySchedule(now, catalog);
    let block = null;
    if (typeof engine.resolve === "function") {
      const state = engine.resolve(now, schedule, commercials);
      block = state && state.block;
    }
    if (!block) block = schedule.find(item => now >= item.startsAtMs && now < item.endsAtMs) || schedule[0];
    const item = block && (block.movie || block.program || block.show || block);
    const title = item && (item.title || item.name);
    if (!title) throw new Error("title unavailable");
    return {title,startsAtMs:block.startsAtMs,endsAtMs:block.endsAtMs,updatedAt:Date.now()};
  }

  async function nowPlaying(channel) {
    if (channel.group === "SYNC") return {title:"SYNC CINEMA · Open paired film + music"};
    const presence = storedPresence(channel.slug);
    if (presence) return presence;
    if (channel.liveLabel) return {title:channel.liveLabel};
    if (channel.scheduled) {
      try { return await resolveScheduled(channel); } catch (_) {}
    }
    return {title:"Live channel · Open to watch"};
  }

  async function refreshLiveGuide() {
    const nodes = Array.from(document.querySelectorAll("[data-live-slug]"));
    await Promise.all(nodes.map(async node => {
      const channel = channels.find(item => item.slug === node.dataset.liveSlug);
      if (!channel) return;
      const live = await nowPlaying(channel);
      const until = live.endsAtMs ? ` · until ${formatLocalTime(live.endsAtMs)}` : "";
      node.textContent = `LIVE · ${live.title}${until}`;
      node.dataset.liveState = "ready";
    }));
  }

  function watchGuide(section) {
    if (guideObserver) guideObserver.disconnect();
    if ("IntersectionObserver" in window) {
      guideObserver = new IntersectionObserver(entries => { if (entries.some(entry => entry.isIntersecting)) refreshLiveGuide(); }, {rootMargin:"500px"});
      guideObserver.observe(section);
    } else refreshLiveGuide();
  }

  function publishCurrent() {
    const slug = currentSlug();
    const node = document.querySelector("#nowTitle,[data-now-title]");
    if (!node) return;
    const title = (node.textContent || "").trim();
    if (!title || /loading|please wait/i.test(title)) return;
    try { localStorage.setItem(`infinity_live_${slug}`, JSON.stringify({title,updatedAt:Date.now()})); } catch (_) {}
  }

  function sync() {
    installStyle();
    ensureMenu();
    const section = ensureDirectory();
    ensureActions();
    refreshWallet();
    publishCurrent();
    watchGuide(section);
    if (!mutationObserver) {
      let actionsQueued = false;
      mutationObserver = new MutationObserver(records => {
        const needsActions = records.some(record => Array.from(record.addedNodes).some(node =>
          node.nodeType === 1 && (
            node.matches && node.matches("#shareButton,.share-button,.infinity-shared-share,.channel-menu") ||
            node.querySelector && node.querySelector("#shareButton,.share-button,.infinity-shared-share,.channel-menu")
          )
        ));
        if (!needsActions || actionsQueued) return;
        actionsQueued = true;
        requestAnimationFrame(() => { actionsQueued = false; ensureMenu(); ensureActions(); });
      });
      mutationObserver.observe(document.body, {childList:true,subtree:true});
    }
  }

  window.addEventListener("starquest:share-progress", refreshWallet);
  window.addEventListener("storage", event => { if (["starquest_guest_profile_v1","starquest_users","starquest_session"].includes(event.key)) refreshWallet(); });
  setInterval(() => { publishCurrent(); refreshWallet(); }, 15000);
  setInterval(() => { if (document.querySelector(".channel-directory")) refreshLiveGuide(); }, 60000);

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", sync, {once:true}); else sync();

  window.INFINITY_CHANNELS = channels.slice();
  window.InfinityChannelRemote = {refresh:sync,channels:channels.slice(),refreshGuide:refreshLiveGuide};
  window.InfinityShareWallet = {recordShare,refresh:refreshWallet,snapshot:walletSnapshot};
})();