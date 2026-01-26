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
     REVEAL (JAČI + STABILAN)
  ===================== */
  window.revealObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add("reveal-visible");
        revealObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll(".reveal").forEach(el => {
    el.classList.remove("reveal-visible");
    revealObserver.observe(el);
  });

  /* =====================
     COUNTERS – ODMAH RADE
  ===================== */
  window.animateCounter = function(el){
    const target = Number(el.dataset.count || 0);
    let current = 0;
    const step = Math.max(target / 80, 1);

    function tick(){
      current += step;
      if(current < target){
        el.textContent = Math.floor(current).toLocaleString("sr-RS");
        requestAnimationFrame(tick);
      } else {
        el.textContent = target.toLocaleString("sr-RS");
      }
    }
    tick();
  };

  document.querySelectorAll("[data-count]").forEach(el => {
    animateCounter(el);
  });

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
  animateCounter(el);
}

/* =====================================================
   YOUTUBE STATS
===================================================== */
(() => {

  const API_KEY = "AIzaSyBfv24f4W3lmgCrmUTJBkJ3wIhc6Tm6org";
  const CHANNEL_ID = "UC5iFsgK01i-3xozxhFju7gg";
  const MIN_SECONDS = 1800;

  async function loadStats(){
    try {
      const ch = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=statistics,contentDetails&id=${CHANNEL_ID}&key=${API_KEY}`
      ).then(r => r.json());

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

      setCounter("yt-subs", stats.subscriberCount);
      setCounter("yt-views", views);
      setCounter("yt-videos", count);

    } catch(e){
      console.error(e);
    }
  }

  function parseISO(iso){
    const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    return (m[1]||0)*3600 + (m[2]||0)*60 + (m[3]||0);
  }

  loadStats();
  setInterval(loadStats, 300000);

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
    location.pathname.endsWith("index.html") ||
    location.pathname === "/";

  async function loadEpisodes(){
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
        .sort((a,b)=> new Date(b.snippet.publishedAt) - new Date(a.snippet.publishedAt));

      if(isHome) episodes = episodes.slice(0,3);

      grid.innerHTML = "";

      episodes.forEach((v,i)=>{
        const duration = formatTime(parseISO(v.contentDetails.duration));
        grid.insertAdjacentHTML("beforeend", `
          <article class="card episode-card reveal">
            ${i===0?`<span class="badge-new">Nova epizoda</span>`:""}
            <span class="episode-duration">${duration}</span>
            <img src="${v.snippet.thumbnails.high.url}">
            <div class="card-body"><h3>${v.snippet.title}</h3></div>
          </article>
        `);
      });

      document.querySelectorAll("#yt-episodes .reveal")
        .forEach(el => revealObserver.observe(el));

    } catch(e){
      console.error(e);
    }
  }

  function parseISO(iso){
    const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
    return (m[1]||0)*3600 + (m[2]||0)*60;
  }

  function formatTime(sec){
    const h = Math.floor(sec/3600);
    const m = Math.floor((sec%3600)/60);
    return h>0 ? `${h} h ${m} min` : `${m} min`;
  }

  loadEpisodes();

})();





