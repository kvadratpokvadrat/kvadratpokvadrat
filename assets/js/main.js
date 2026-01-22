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

  if (burger && nav) {
    burger.addEventListener("click", () => {
      const open = nav.classList.toggle("active");
      burger.classList.toggle("active", open);
      overlay?.classList.toggle("active", open);
      document.body.classList.toggle("nav-open", open);
    });
  }

  overlay?.addEventListener("click", () => {
    nav.classList.remove("active");
    burger.classList.remove("active");
    overlay.classList.remove("active");
    document.body.classList.remove("nav-open");
  });

  /* =====================
     DARK MODE
  ===================== */
  const toggle = document.getElementById("themeToggle");

  if (toggle) {
    if (localStorage.theme === "dark") {
      document.body.classList.add("dark");
      toggle.textContent = "Light";
    }

    toggle.addEventListener("click", () => {
      const dark = document.body.classList.toggle("dark");
      toggle.textContent = dark ? "Light" : "Dark";
      localStorage.theme = dark ? "dark" : "light";
    });
  }

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
     SECTION DIVIDERS
  ===================== */
  const dividerObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add("divider-visible");
        dividerObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.4 });

  document.querySelectorAll(".section-divider").forEach(d => dividerObserver.observe(d));

  /* =====================
     COUNTERS
  ===================== */
  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;

      const el = e.target;
      const target = Number(el.dataset.count);
      let current = 0;
      const step = target / 110;

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

});

/* =====================================================
   GUEST MODAL – FINAL (NE DIRATI)
===================================================== */
document.addEventListener("DOMContentLoaded", () => {

  const modal = document.getElementById("guestModal");
  if (!modal) return;

  const img  = modal.querySelector("#guestModalImg");
  const name = modal.querySelector("#guestModalName");
  const role = modal.querySelector("#guestModalRole");
  const bio  = modal.querySelector("#guestModalBio");
  const closeBtn = modal.querySelector("#closeGuest");

  document.body.addEventListener("click", e => {
    const card = e.target.closest(".card--guest");
    if (!card) return;

    img.src = card.dataset.img || "";
    name.textContent = card.dataset.name || "";
    role.textContent = card.dataset.role || "";
    bio.textContent  = card.dataset.bio || "";

    modal.classList.add("active");
    document.body.classList.add("modal-open");
  });

  modal.addEventListener("click", e => {
    if (e.target === modal || e.target === closeBtn) {
      modal.classList.remove("active");
      document.body.classList.remove("modal-open");
    }
  });

});

/* =====================================================
   YOUTUBE STATS (SUBS / VIEWS / EPISODES)
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

      const stats = ch.items[0].statistics;
      const uploads = ch.items[0].contentDetails.relatedPlaylists.uploads;

      const subs = Number(stats.subscriberCount || 0);

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

      setCounter("yt-subs", subs);
      setCounter("yt-views", views);
      setCounter("yt-videos", count);

    } catch (e) {
      console.error("YT STATS ERROR:", e);
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
   INDEX – LAST 3 EPISODES + NEW BADGE
===================================================== */
(() => {

  const API_KEY = "AIzaSyBfv24f4W3lmgCrmUTJBkJ3wIhc6Tm6org";
  const CHANNEL_ID = "UC5iFsgK01i-3xozxhFju7gg";
  const MIN_SECONDS = 1800;

  const grid = document.getElementById("episodesGrid");
  if (!grid) return;

  async function loadEpisodes() {
    try {
      const ch = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${CHANNEL_ID}&key=${API_KEY}`
      ).then(r => r.json());

      const uploads = ch.items[0].contentDetails.relatedPlaylists.uploads;

      const pl = await fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails&maxResults=10&playlistId=${uploads}&key=${API_KEY}`
      ).then(r => r.json());

      const ids = pl.items.map(v => v.contentDetails.videoId).join(",");

      const vids = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${ids}&key=${API_KEY}`
      ).then(r => r.json());

      const episodes = vids.items
        .filter(v => parseDuration(v.contentDetails.duration) >= MIN_SECONDS)
        .slice(0, 3);

      grid.innerHTML = "";

      episodes.forEach((v, i) => {
        grid.innerHTML += `
          <article class="card card--episode reveal">
            ${i === 0 ? `<span class="badge-new">NOVA EPIZODA</span>` : ""}
            <img src="${v.snippet.thumbnails.high.url}" alt="">
            <div class="card-body">
              <h3>${v.snippet.title}</h3>
            </div>
          </article>
        `;
      });

    } catch (e) {
      console.error("EPISODES LOAD ERROR:", e);
    }
  }

  function parseDuration(iso) {
    const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    return (m[1]||0)*3600 + (m[2]||0)*60 + (m[3]||0);
  }

  loadEpisodes();

})();
