(function () {
  "use strict";

  const channels = [
    { name: "Hermit TV", slug: "Hermit-TV", url: "https://www-infinity4.github.io/Hermit-TV/", group: "TV" },
    { name: "Star Launcher", slug: "Star-Launcher", url: "https://www-infinity4.github.io/Star-Launcher/", group: "TV" },
    { name: "HBO", slug: "HBO", url: "https://www-infinity4.github.io/HBO/", group: "TV" },
    { name: "Cinemax", slug: "Cinemax", url: "https://www-infinity4.github.io/Cinemax/", group: "TV" },
    { name: "Showtime", slug: "Showtime", url: "https://www-infinity4.github.io/Showtime/", group: "TV" },
    { name: "Starz", slug: "Starz", url: "https://www-infinity4.github.io/Starz/", group: "TV" },
    { name: "Encore", slug: "Encore", url: "https://www-infinity4.github.io/Encore/", group: "TV" },
    { name: "Cartoon Network", slug: "Cartoon-Network", url: "https://www-infinity4.github.io/Cartoon-Network/", group: "TV" },
    { name: "WGN", slug: "WGN", url: "https://www-infinity4.github.io/WGN/", group: "TV" },
    { name: "NBC", slug: "NBC", url: "https://www-infinity4.github.io/NBC/", group: "TV" },
    { name: "FOX", slug: "FOX", url: "https://www-infinity4.github.io/FOX/", group: "TV" },
    { name: "PBS", slug: "PBS", url: "https://www-infinity4.github.io/PBS/", group: "TV" },
    { name: "TNT", slug: "TNT", url: "https://www-infinity4.github.io/TNT/", group: "TV" },
    { name: "Trump TV", slug: "Trump-TV", url: "https://www-infinity4.github.io/Trump-TV/", group: "TV" },
    { name: "ShopLC", slug: "ShopLC", url: "https://www-infinity4.github.io/ShopLC/", group: "TV" },
    { name: "StarQuest", slug: "TV-Database", url: "https://www-infinity4.github.io/TV-Database/", group: "TV" },

    { name: "Astraflix", slug: "Astraflix", url: "https://www-infinity4.github.io/Astraflix/", group: "SYNC" },
    { name: "Syncord", slug: "Syncord", url: "https://www-infinity4.github.io/Syncord/", group: "SYNC" },
    { name: "Vintech", slug: "Vintech", url: "https://www-infinity4.github.io/Vintech/", group: "SYNC" },
    { name: "Abstractia", slug: "Abstractia-", url: "https://www-infinity4.github.io/Abstractia-/", group: "SYNC" },
    { name: "Flix Blender", slug: "Flix-Blender", url: "https://www-infinity4.github.io/Flix-Blender/", group: "SYNC" },
    { name: "Animasync", slug: "Animasync", url: "https://www-infinity4.github.io/Animasync/", group: "SYNC" }
  ];

  const STYLE_ID = "infinity-shared-remote-style";

  function currentSlug() {
    const parts = location.pathname.split("/").filter(Boolean);
    return parts[0] || "";
  }

  function installStyle() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      .infinity-auto-menu{position:relative;z-index:2147483000;margin-left:auto;font-family:system-ui,-apple-system,Segoe UI,sans-serif}
      .infinity-auto-menu>summary{list-style:none;cursor:pointer;min-width:48px;min-height:44px;padding:0 13px;display:inline-flex;align-items:center;justify-content:center;gap:8px;border:1px solid rgba(255,255,255,.28);border-radius:999px;color:#fff;background:rgba(8,12,22,.88);box-shadow:0 8px 26px rgba(0,0,0,.35);font-weight:800}
      .infinity-auto-menu>summary::-webkit-details-marker{display:none}
      .infinity-auto-menu[open]>summary{background:#111827}
      .infinity-auto-menu nav{position:absolute;right:0;top:calc(100% + 8px);width:min(88vw,340px);max-height:min(72vh,620px);overflow:auto;padding:9px;border:1px solid rgba(255,255,255,.2);border-radius:16px;background:rgba(5,8,16,.97);box-shadow:0 18px 55px rgba(0,0,0,.58);display:grid;gap:5px}
      .infinity-auto-menu nav a{display:block;padding:10px 11px;border-radius:10px;color:#fff!important;text-decoration:none!important;background:rgba(255,255,255,.055);font-weight:700}
      .infinity-auto-menu nav a:hover,.infinity-auto-menu nav a:focus-visible{background:rgba(255,255,255,.15)}
      .infinity-auto-menu nav a[aria-current="page"]{outline:2px solid #f5c451;background:rgba(245,196,81,.14)}
      .infinity-auto-menu .infinity-remote-heading{padding:9px 9px 4px;color:#f5c451;font-size:11px;font-weight:900;letter-spacing:.12em;text-transform:uppercase}
      .infinity-auto-menu.infinity-remote-fixed{position:fixed;right:10px;top:10px;z-index:2147483000}
      @media(max-width:640px){.infinity-auto-menu>summary .menu-label{display:none}.infinity-auto-menu nav{width:min(92vw,330px)}}
    `;
    document.head.appendChild(style);
  }

  function linkHTML(channel, active) {
    const current = channel.slug.toLowerCase() === active.toLowerCase();
    return `<a${current ? ' aria-current="page"' : ''} href="${channel.url}">${channel.name}</a>`;
  }

  function render(nav, headings) {
    if (!nav) return;
    const active = currentSlug();
    if (!headings) {
      nav.innerHTML = channels.map(channel => linkHTML(channel, active)).join("");
      return;
    }
    const tv = channels.filter(channel => channel.group === "TV");
    const syncChannels = channels.filter(channel => channel.group === "SYNC");
    nav.innerHTML = `<div class="infinity-remote-heading">Live channels</div>${tv.map(channel => linkHTML(channel, active)).join("")}<div class="infinity-remote-heading">Sync channels</div>${syncChannels.map(channel => linkHTML(channel, active)).join("")}`;
  }

  function ensureMenu() {
    if (document.querySelector(".channel-menu")) return;
    installStyle();
    const details = document.createElement("details");
    details.className = "channel-menu infinity-auto-menu";
    details.innerHTML = '<summary aria-label="Open channel remote"><span aria-hidden="true">☰</span><span class="menu-label">Remote</span></summary><nav aria-label="Switch channels"></nav>';
    const host = document.querySelector(".masthead, header, .topbar, .site-header");
    if (host) host.appendChild(details);
    else {
      details.classList.add("infinity-remote-fixed");
      document.body.appendChild(details);
    }
    render(details.querySelector("nav"), true);
  }

  function sync() {
    installStyle();
    ensureMenu();
    document.querySelectorAll(".channel-menu nav, .channel-directory nav").forEach(nav => {
      const auto = !!nav.closest(".infinity-auto-menu");
      render(nav, auto);
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", sync, { once: true });
  else sync();

  window.INFINITY_CHANNELS = channels.slice();
  window.InfinityChannelRemote = { refresh: sync, channels: channels.slice() };
})();
