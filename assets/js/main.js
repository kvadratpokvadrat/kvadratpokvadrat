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

/* =========================================
   YOUTUBE – GLOBAL STATS + EPISODES
========================================= */

(() => {
  const API_KEY = "AIzaSyBfv24f4W3lmgCrmUTJBkJ3wIhc6Tm6org";
  const CHANNEL_ID = "UC5iFsgK01i-3xozxhFju7gg";
  const MIN_SECONDS = 1800; // 30 min

  const CACHE_KEY = "yt_global_stats";
  const CACHE_TTL = 6 * 60 * 60 * 1000;

  const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || "null");
  if (cached && Date.now() - cached.time < CACHE_TTL) {
    applyStats(cached.data);
    renderEpisodes(cached.data.episodes);
  } else {
    loadAll();
  }

  async function loadAll() {
    try {
      /* =====================
         CHANNEL STATS
      ===================== */
      const channelRes = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=statistics,contentDetails&id=${CHANNEL_ID}&key=${API_KEY}`
      ).then(r => r.json());

      const stats = channelRes.items[0].statistics;
      const uploads =
        channelRes.items[0].contentDetails.relatedPlaylists.uploads;

      const subscribers = Number(stats.subscriberCount || 0);
      const totalViews = Number(stats.viewCount || 0);

      /* =====================
         VIDEOS
      ===================== */
      const pl = await fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails&maxResults=50&playlistId=${uploads}&key=${API_KEY}`
      ).then(r => r.json());

      const ids = pl.items.map(v => v.contentDetails.videoId).join(",");

      const vids = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${ids}&key=${API_KEY}`
      ).then(r => r.json());

      const episodes = vids.items
        .map(v => ({
          id: v.id,
          title: v.snippet.title,
          thumb: v.snippet.thumbnails.high.url,
          seconds: parseDuration(v.contentDetails.duration)
        }))
        .filter(v => v.seconds >= MIN_SECONDS)
        .sort((a, b) => b.seconds - a.seconds);

      const data = {
        subscribers,
        totalViews,
        episodeCount: episodes.length,
        episodes
      };

      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({ time: Date.now(), data })
      );

      applyStats(data);
      renderEpisodes(episodes);

    } catch (e) {
      console.error("YT ERROR:", e);
    }
  }

  /* =====================
     APPLY STATS
  ===================== */
  function applyStats(d) {
    set("yt-subs", d.subscribers);
    set("yt-views", d.totalViews);
    set("yt-videos", d.episodeCount);
  }

  function set(id, val) {
    const el = document.getElementById(id);
    if (!el) return;
    el.dataset.count = val;
    el.textContent = "0";
  }

  /* =====================
     EPISODES (INDEX)
  ===================== */
  function renderEpisodes(list) {
    const container = document.getElementById("yt-episodes");
    if (!container) return;

    container.innerHTML = "";

    list.slice(0, 3).forEach((v, i) => {
      container.innerHTML += `
        <a href="https://www.youtube.com/watch?v=${v.id}" target="_blank">
          <article class="card card--episode reveal reveal-visible">
            <img src="${v.thumb}">
            <div class="card-body">
              <h3 class="card-title">${v.title}</h3>
              <p class="card-meta">
                Epizoda #${list.length - i}
                <span class="badge badge--new">Nova epizoda</span>
              </p>
            </div>
          </article>
        </a>
      `;
    });
  }

  /* =====================
     HELPERS
  ===================== */
  function parseDuration(iso) {
    const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    return (
      (m[1] || 0) * 3600 +
      (m[2] || 0) * 60 +
      (m[3] || 0) * 1
    );
  }
})();
