/* =====================================================
   DOM READY
===================================================== */
document.addEventListener("DOMContentLoaded", function () {

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

document.querySelectorAll(".reveal").forEach(el =>
  revealObserver.observe(el)
);

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

document.querySelectorAll("[data-count]").forEach(c =>
  counterObserver.observe(c)
);

/* =====================
   GUEST MODAL
===================== */
const modal = document.getElementById("guestModal");

document.querySelectorAll(".card--guest").forEach(card => {
  card.addEventListener("click", () => {
    modal.querySelector("#guestModalImg").src = card.dataset.img;
    modal.querySelector("#guestModalName").textContent = card.dataset.name;
    modal.querySelector("#guestModalRole").textContent = card.dataset.role;
    modal.querySelector("#guestModalBio").textContent = card.dataset.bio || "";
    modal.classList.add("active");
  });
});

modal?.addEventListener("click", e => {
  if (e.target === modal || e.target.id === "closeGuest") {
    modal.classList.remove("active");
  }
});

});

/* =====================================================
   YOUTUBE STATS
===================================================== */
(() => {
  const API_KEY = "AIzaSyBfv24f4W3lmgCrmUTJBkJ3wIhc6Tm6org";
  const CHANNEL_ID = "UC5iFsgK01i-3xozxhFju7gg";
  const MIN_SECONDS = 1800;

  async function load() {
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
      let episodes = 0;

      vids.items.forEach(v => {
        if (parseDuration(v.contentDetails.duration) >= MIN_SECONDS) {
          views += Number(v.statistics.viewCount || 0);
          episodes++;
        }
      });

      setCounter("yt-subs", subs);
      setCounter("yt-views", views);
      setCounter("yt-videos", episodes);

    } catch (e) {
      console.error("YT ERROR", e);
    }
  }

  function parseDuration(iso) {
    const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    return (m[1]||0)*3600 + (m[2]||0)*60 + (m[3]||0);
  }

  function setCounter(id, val) {
    const el = document.getElementById(id);
    if (!el) return;
    el.dataset.count = val;
    el.textContent = "0";
  }

  load();
})();

/* =====================================================
   INDEX – LAST 3 EPISODES (NO SLIDER)
===================================================== */
(() => {
  const API_KEY = "AIzaSyBfv24f4W3lmgCrmUTJBkJ3wIhc6Tm6org";
  const CHANNEL_ID = "UC5iFsgK01i-3xozxhFju7gg";
  const MIN = 1800;

  const grid = document.getElementById("yt-episodes");
  if (!grid) return;

  async function load() {
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

    grid.innerHTML = "";

    vids.items
      .filter(v => parse(v.contentDetails.duration) >= MIN)
      .slice(0, 3) // 🔥 TAČNO 3
      .forEach(v => {
        grid.innerHTML += `
<article class="card episode-card reveal">
  <img src="${v.snippet.thumbnails.high.url}" alt="">
  <div class="card-body">
    <h3 class="card-title">${v.snippet.title}</h3>
  </div>
</article>`;
      });
  }

  function parse(iso){
    const m = iso.match(/PT(?:(\\d+)H)?(?:(\\d+)M)?(?:(\\d+)S)?/);
    return (m[1]||0)*3600 + (m[2]||0)*60 + (m[3]||0);
  }

  load();
})();
/* =====================
   GUEST MODAL – FIXED
===================== */

document.addEventListener("DOMContentLoaded", () => {

  const modal = document.getElementById("guestModal");
  if (!modal) return;

  const img  = modal.querySelector("#guestModalImg");
  const name = modal.querySelector("#guestModalName");
  const role = modal.querySelector("#guestModalRole");
  const bio  = modal.querySelector("#guestModalBio");
  const closeBtn = modal.querySelector("#closeGuest");

  /* EVENT DELEGATION – radi i kad se DOM menja */
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

  /* CLOSE */
  modal.addEventListener("click", e => {
    if (e.target === modal || e.target === closeBtn) {
      modal.classList.remove("active");
      document.body.classList.remove("modal-open");
    }
  });

});

