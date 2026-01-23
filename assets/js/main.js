/* =====================================================
   DOM READY
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
   DARK / LIGHT Mode (WORKING)
===================== */
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("themeToggle");
  if (!toggle) return; // ako nema dugmeta, prekini

  // inicijalno stanje
  const saved = localStorage.getItem("theme");
  const isDark = saved === "dark";

  document.body.classList.toggle("dark", isDark);
  toggle.textContent = isDark ? "Light" : "Dark";

  // klik
  toggle.addEventListener("click", () => {
    const nowDark = document.body.classList.toggle("dark");
    localStorage.setItem("theme", nowDark ? "dark" : "light");
    toggle.textContent = nowDark ? "Light" : "Dark";
  });


  /* =====================
     REVEAL
  ===================== */
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add("reveal-visible");
        revealObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

  /* =====================
     COUNTERS
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

  document.querySelectorAll("[data-count]").forEach(c => counterObserver.observe(c));

  /* =====================
     GUEST MODAL (FIXED)
  ===================== */
  const modal = document.getElementById("guestModal");

  if (modal) {
    const img  = document.getElementById("guestModalImg");
    const name = document.getElementById("guestModalName");
    const role = document.getElementById("guestModalRole");
    const bio  = document.getElementById("guestModalBio");
    const closeBtn = document.getElementById("closeGuest");

    document.querySelectorAll(".card--guest").forEach(card => {
      card.addEventListener("click", () => {
        img.src = card.dataset.img || "";
        name.textContent = card.dataset.name || "";
        role.textContent = card.dataset.role || "";
        bio.textContent  = card.dataset.bio || "";

        modal.classList.add("active");
        document.body.classList.add("modal-open");
      });
    });

    closeBtn?.addEventListener("click", () => {
      modal.classList.remove("active");
      document.body.classList.remove("modal-open");
    });

    modal.addEventListener("click", e => {
      if (e.target === modal) {
        modal.classList.remove("active");
        document.body.classList.remove("modal-open");
      }
    });
  }

});

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
        if (parseDuration(v.contentDetails.duration) >= MIN_SECONDS) {
          views += Number(v.statistics.viewCount || 0);
          count++;
        }
      });

      setCounter("yt-subs", Number(stats.subscriberCount || 0));
      setCounter("yt-views", views);
      setCounter("yt-videos", count);

    } catch (e) {
      console.error("YT ERROR:", e);
    }
  }

  function setCounter(id, val) {
    const el = document.getElementById(id);
    if (!el) return;
    el.dataset.count = val;
    el.textContent = "0";
  }

  function parseDuration(iso) {
    const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    return (m[1]||0)*3600 + (m[2]||0)*60 + (m[3]||0);
  }

  loadStats();

})();

/* =====================================================
   YOUTUBE EPISODES – FINAL LOGIC
===================================================== */
(async () => {

  const API_KEY = "AIzaSyBfv24f4W3lmgCrmUTJBkJ3wIhc6Tm6org";
  const CHANNEL_ID = "UC5iFsgK01i-3xozxhFju7gg";
  const MIN = 1800;

  const grid = document.getElementById("yt-episodes");
  if (!grid) return;

  const LIMIT = Number(grid.dataset.limit || 3);

  try {
    const ch = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${CHANNEL_ID}&key=${API_KEY}`
    ).then(r => r.json());

    const uploads = ch.items[0].contentDetails.relatedPlaylists.uploads;

    const pl = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails&maxResults=20&playlistId=${uploads}&key=${API_KEY}`
    ).then(r => r.json());

    const ids = pl.items.map(v => v.contentDetails.videoId).join(",");

    const vids = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${ids}&key=${API_KEY}`
    ).then(r => r.json());

    // ✅ filtriraj duge epizode
    let episodes = vids.items.filter(v =>
      parse(v.contentDetails.duration) >= MIN
    );

    // ✅ OKRENI REDOSLED (NAJSTARIJA → NAJNOVIJA)
    episodes.reverse();

    // ✅ limit
    episodes = episodes.slice(0, LIMIT);

    grid.innerHTML = "";

    episodes.forEach((v, i) => {
      const duration = format(parse(v.contentDetails.duration));
      const number = i + 1;
      const isNew = i === episodes.length - 1;

      const url = `https://www.youtube.com/watch?v=${v.id}`;

      grid.innerHTML += `
        <article class="card episode-card reveal"
          onclick="window.open('${url}','_blank')">

          ${isNew ? `<span class="badge-new">Nova epizoda</span>` : ""}

          <span class="episode-number">#${number}</span>
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

  function parse(iso){
    const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    return (m[1]||0)*3600 + (m[2]||0)*60 + (m[3]||0);
  }

  function format(sec){
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2,"0")}`;
  }

})();










