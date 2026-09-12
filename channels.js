(function () {
  "use strict";

  const channels = [
    { name: "Hermit TV", slug: "Hermit-TV", url: "https://www-infinity4.github.io/Hermit-TV/" },
    { name: "Star Launcher", slug: "Star-Launcher", url: "https://www-infinity4.github.io/Star-Launcher/" },
    { name: "HBO", slug: "HBO", url: "https://www-infinity4.github.io/HBO/" },
    { name: "Cinemax", slug: "Cinemax", url: "https://www-infinity4.github.io/Cinemax/" },
    { name: "Showtime", slug: "Showtime", url: "https://www-infinity4.github.io/Showtime/" },
    { name: "Starz", slug: "Starz", url: "https://www-infinity4.github.io/Starz/" },
    { name: "Encore", slug: "Encore", url: "https://www-infinity4.github.io/Encore/" },
    { name: "Cartoon Network", slug: "Cartoon-Network", url: "https://www-infinity4.github.io/Cartoon-Network/" },
    { name: "WGN", slug: "WGN", url: "https://www-infinity4.github.io/WGN/" },
    { name: "TNT", slug: "TNT", url: "https://www-infinity4.github.io/TNT/" },
    { name: "StarQuest", slug: "TV-Database", url: "https://www-infinity4.github.io/TV-Database/" }
  ];

  function currentSlug() {
    const parts = location.pathname.split("/").filter(Boolean);
    return parts[0] || "";
  }

  function render(nav) {
    if (!nav) return;
    const active = currentSlug();
    nav.innerHTML = channels.map(channel => {
      const current = channel.slug.toLowerCase() === active.toLowerCase();
      return `<a${current ? ' aria-current="page"' : ''} href="${channel.url}">${channel.name}</a>`;
    }).join("");
  }

  function sync() {
    document.querySelectorAll(".channel-menu nav, .channel-directory nav").forEach(render);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", sync, { once: true });
  else sync();

  window.INFINITY_CHANNELS = channels.slice();
})();
