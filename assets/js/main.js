document.addEventListener("DOMContentLoaded", function () {

/* =====================
   MOBILE NAV
===================== */
var burger = document.querySelector(".hamburger");
var nav = document.querySelector(".nav");
var overlay = document.querySelector(".nav-overlay");

if (burger && nav) {
  burger.addEventListener("click", function () {
    const isOpen = nav.classList.toggle("active");
    burger.classList.toggle("active", isOpen);
    overlay?.classList.toggle("active", isOpen);
    document.body.classList.toggle("nav-open", isOpen);
  });
}

overlay?.addEventListener("click", function () {
  nav.classList.remove("active");
  burger.classList.remove("active");
  overlay.classList.remove("active");
  document.body.classList.remove("nav-open");
});

/* =====================
   DARK MODE
===================== */
var toggle = document.getElementById("themeToggle");

if (toggle) {
  if (localStorage.theme === "dark") {
    document.body.classList.add("dark");
    toggle.textContent = "Light";
  }

  toggle.addEventListener("click", function () {
    document.body.classList.toggle("dark");
    const isDark = document.body.classList.contains("dark");
    toggle.textContent = isDark ? "Light" : "Dark";
    localStorage.theme = isDark ? "dark" : "light";
  });
}

/* =====================
   REVEAL
===================== */
var reveals = document.querySelectorAll(".reveal");

var revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("reveal-visible");
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.15 });

reveals.forEach(el => revealObserver.observe(el));

/* =====================
   STATS COUNTER
===================== */
var counters = document.querySelectorAll("[data-count]");

var counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    var el = entry.target;
    var target = Number(el.dataset.count);
    var current = 0;
    var step = target / 110;

    function update() {
      current += step;
      if (current < target) {
        el.textContent = Math.floor(current).toLocaleString("sr-RS");
        requestAnimationFrame(update);
      } else {
        el.textContent = target.toLocaleString("sr-RS");
      }
    }

    update();
    counterObserver.unobserve(el);
  });
}, { threshold: 0.6 });

counters.forEach(c => counterObserver.observe(c));

});

/* =========================================
   YOUTUBE EPISODES – INDEX
   >= 30 MIN
   + NOVA EPIZODA
   + HERO LINK
========================================= */

(() => {
  const API_KEY = "AIzaSyBfv24f4W3lmgCrmUTJBkJ3wIhc6Tm6org";
  const CHANNEL_ID = "UC5iFsgK01i-3xozxhFju7gg";
  const MIN_SECONDS = 1800;
  const MAX_EPISODES = 3;
  const NEW_DAYS = 7;

  const container = document.getElementById("yt-episodes");
  const heroBtn = document.querySelector(".hero .btn");

  if (!container) return;

  load();

  async function load() {
    try {
      const ch = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${CHANNEL_ID}&key=${API_KEY}`
      ).then(r => r.json());

      const uploads =
        ch.items[0].contentDetails.relatedPlaylists.uploads;

      const pl = await fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails&maxResults=15&playlistId=${uploads}&key=${API_KEY}`
      ).then(r => r.json());

      const ids = pl.items.map(v => v.contentDetails.videoId).join(",");

      const vids = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${ids}&key=${API_KEY}`
      ).then(r => r.json());

      const now = Date.now();

      const episodes = vids.items
        .map(v => {
          const published = new Date(v.snippet.publishedAt);
          return {
            id: v.id,
            title: v.snippet.title,
            thumb: v.snippet.thumbnails.high.url,
            duration: parseDuration(v.contentDetails.duration),
            published,
            isNew: (now - published.getTime()) / 86400000 <= NEW_DAYS
          };
        })
        .filter(v => v.duration >= MIN_SECONDS)
        .sort((a, b) => b.published - a.published)
        .slice(0, MAX_EPISODES);

      /* HERO BUTTON → NAJNOVIJA EPIZODA */
      if (heroBtn && episodes[0]) {
        heroBtn.href = `https://www.youtube.com/watch?v=${episodes[0].id}`;
        heroBtn.target = "_blank";
      }

      container.innerHTML = "";

      episodes.forEach((ep, index) => {
        const isFirst = index === 0 && ep.isNew;

        container.innerHTML += `
          <a href="https://www.youtube.com/watch?v=${ep.id}" target="_blank">
            <article class="card card--episode reveal reveal-visible
              ${isFirst ? "is-new is-glow" : ""}">

              ${isFirst ? `<span class="episode-badge">Nova epizoda</span>` : ""}

              <img src="${ep.thumb}">
              <div class="card-body">
                <h3 class="card-title">${ep.title}</h3>
                <p class="card-meta">
                  Epizoda #${episodes.length - index} • ${format(ep.duration)}
                </p>
              </div>
            </article>
          </a>
        `;
      });

    } catch (e) {
      console.error("YT EPISODES ERROR:", e);
    }
  }

  function parseDuration(iso) {
    const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    return (m[1] || 0) * 3600 + (m[2] || 0) * 60 + (m[3] || 0) * 1;
  }

  function format(sec) {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    return h ? `${h}h ${m}min` : `${m}min`;
  }
})();
