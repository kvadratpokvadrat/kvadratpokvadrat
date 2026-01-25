/* =====================================================
   DOM READY – GLOBAL
===================================================== */
document.addEventListener("DOMContentLoaded", () => {

  /* =====================
     MOBILE NAV
  ===================== */
  const burger = document.querySelector(".hamburger");
  const nav = document.querySelector(".nav");
  const overlay = document.querySelector(".nav-overlay");

  if (burger && nav && overlay) {
    burger.addEventListener("click", () => {
      const open = nav.classList.toggle("active");
      burger.classList.toggle("active", open);
      overlay.classList.toggle("active", open);
      document.body.classList.toggle("nav-open", open);
    });

    overlay.addEventListener("click", () => {
      nav.classList.remove("active");
      burger.classList.remove("active");
      overlay.classList.remove("active");
      document.body.classList.remove("nav-open");
    });
  }

  /* =====================
     DARK MODE
  ===================== */
  const toggle = document.getElementById("themeToggle");
  if (toggle) {
    const saved = localStorage.getItem("theme");
    const isDark = saved === "dark";

    document.body.classList.toggle("dark", isDark);
    toggle.textContent = isDark ? "Light" : "Dark";

    toggle.addEventListener("click", () => {
      const nowDark = document.body.classList.toggle("dark");
      localStorage.setItem("theme", nowDark ? "dark" : "light");
      toggle.textContent = nowDark ? "Light" : "Dark";
    });
  }

  /* =====================
     REVEAL (SCROLL ANIM)
  ===================== */
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add("reveal-visible");
        revealObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll(".reveal")
    .forEach(el => revealObserver.observe(el));

  /* =====================
     COUNTERS (ANIM)
  ===================== */
  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;

      const el = e.target;
      const target = Number(el.dataset.count || 0);
      let current = 0;
      const step = Math.max(target / 100, 1);

      function tick() {
        current += step;
        if (current < target) {
          el.textContent = Math.floor(current).toLocaleString("sr-RS");
          requestAnimationFrame(tick);
        } else {
          el.textContent = target.toLocaleString("sr-RS");
        }
      }

      tick();
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.6 });

  document.querySelectorAll("[data-count]")
    .forEach(c => counterObserver.observe(c));
});

/* =====================================================
   SET COUNTER – TVOJ (NEDIRAN)
===================================================== */
function setCounter(id, val) {
  const el = document.getElementById(id);
  if (!el) return;

  const prev = Number(el.dataset.count || 0);
  if (prev === val && el.textContent !== "0") return;

  el.dataset.count = val;
}

/* =====================================================
   YOUTUBE STATS
===================================================== */
(() => {

  const API_KEY = "AIzaSyBfv24f4W3lmgCrmUTJBkJ3wIhc6Tm6org";
  const CHANNEL_ID = "UC5iFsgK01i-3xozxhFju7gg";
  const MIN_SECONDS = 1800;

  async function loadStats() {
    try {
      const ch = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=statistics,contentDetails&id=${CHANNEL_ID}&key=${API_KEY}`
      ).then(r => r.json());

      if (!ch.items?.length) return;

      const stats = ch.items[0].statistics;
      const uploads = ch.items[0].contentDetails.relatedPlaylists.uploads;

      const pl = await fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails&maxResults=50&playlistId=${uploads}&key=${API_KEY}`
      ).then(r => r.json());

      const ids = pl.items.map(v => v.contentDetails.videoId).join(",");

      const vids = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,statistics&id=${ids}&key=${API_KEY}`
      ).then(r => r.json());

      let views = 0;
      let count = 0;

      vids.items.forEach(v => {
        if (parseISO(v.contentDetails.duration) >= MIN_SECONDS) {
          views += Number(v.statistics.viewCount || 0);
          count++;
        }
      });

      setCounter("yt-subs", Number(stats.subscriberCount || 0));
      setCounter("yt-views", views);
      setCounter("yt-videos", count);

    } catch (e) {
      console.error("YT STATS ERROR:", e);
    }
  }

  loadStats();
  setInterval(loadStats, 5 * 60 * 1000);

})();

/* =====================================================
   YOUTUBE EPISODES
===================================================== */
(() => {

  const API_KEY = "AIzaSyBfv24f4W3lmgCrmUTJBkJ3wIhc6Tm6org";
  const CHANNEL_ID = "UC5iFsgK01i-3xozxhFju7gg";
  const MIN = 1800;

  const grid = document.getElementById("yt-episodes");
  if (!grid) return;

  const isHome =
    window.location.pathname.endsWith("index.html") ||
    window.location.pathname === "/";

  async function loadEpisodes() {
    try {
      const ch = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${CHANNEL_ID}&key=${API_KEY}`
      ).then(r => r.json());

      const uploads = ch.items[0].contentDetails.relatedPlaylists.uploads;

      const pl = await fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails&maxResults=50&playlistId=${uploads}&key=${API_KEY}`
      ).then(r => r.json());

      const ids = pl.items.map(v => v.contentDetails.videoId).join(",");

      const vids = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${ids}&key=${API_KEY}`
      ).then(r => r.json());

      let episodes = vids.items
        .filter(v => parseISO(v.contentDetails.duration) >= MIN)
        .sort((a, b) =>
          new Date(b.snippet.publishedAt) - new Date(a.snippet.publishedAt)
        );

      if (isHome) episodes = episodes.slice(0, 3);

      grid.innerHTML = "";

      episodes.forEach((v, i) => {
        const isNew = i === 0;
        const duration = formatDuration(parseISO(v.contentDetails.duration));

        grid.innerHTML += `
          <article class="card episode-card reveal"
            onclick="window.open('https://www.youtube.com/watch?v=${v.id}','_blank')">

            ${isNew ? `<span class="badge-new">Nova epizoda</span>` : ""}
            <span class="episode-duration">${duration}</span>

            <img src="${v.snippet.thumbnails.high.url}" alt="">
            <div class="card-body">
              <h3>${v.snippet.title}</h3>
            </div>
          </article>
        `;
      });

      requestAnimationFrame(() => {
        document.querySelectorAll("#yt-episodes .reveal")
          .forEach(el => el.classList.add("reveal-visible"));
      });

    } catch (e) {
      console.error("YT EPISODES ERROR:", e);
    }
  }

  /* =====================
     ISO → SEKUNDE
  ===================== */
  function parseISO(iso){
    const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    return (m[1]||0)*3600 + (m[2]||0)*60 + (m[3]||0);
  }

  /* =====================
     FORMAT: SATI + MINUTI (FIX)
  ===================== */
  function formatDuration(sec){
    const totalMinutes = Math.floor(sec / 60);
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;

    if (h > 0) return `${h} h ${m} min`;
    return `${m} min`;
  }

  loadEpisodes();
  setInterval(loadEpisodes, 5 * 60 * 1000);

})();
