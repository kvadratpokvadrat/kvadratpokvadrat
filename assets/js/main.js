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
const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add("reveal-visible");
        revealObserver.unobserve(e.target);
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

/* =====================
   DIVIDERS
===================== */
const dividerObserver = new IntersectionObserver(
  entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add("divider-visible");
        dividerObserver.unobserve(e.target);
      }
    });
  },
  { threshold: 0.4 }
);

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
   YOUTUBE STATS (SUBS + VIEWS + EPISODES)
===================================================== */
(() => {
  const API_KEY = "AIzaSyBfv24f4W3lmgCrmUTJBkJ3wIhc6Tm6org";
  const CHANNEL_ID = "UC5iFsgK01i-3xozxhFju7gg";
  const MIN_SECONDS = 1800; // 30 min

  async function load() {
    try {
      /* 1️⃣ CHANNEL STATS (SUBSCRIBERS) */
      const ch = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=statistics,contentDetails&id=${CHANNEL_ID}&key=${API_KEY}`
      ).then(r => r.json());

      const stats = ch.items[0].statistics;
      const uploads = ch.items[0].contentDetails.relatedPlaylists.uploads;

      const subscribers = Number(stats.subscriberCount || 0);

      /* 2️⃣ PLAYLIST ITEMS */
      const pl = await fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails&maxResults=50&playlistId=${uploads}&key=${API_KEY}`
      ).then(r => r.json());

      const ids = pl.items.map(v => v.contentDetails.videoId).join(",");

      /* 3️⃣ VIDEO DETAILS */
      const vids = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,statistics&id=${ids}&key=${API_KEY}`
      ).then(r => r.json());

      let totalViews = 0;
      let episodeCount = 0;

      vids.items.forEach(v => {
        const sec = parseDuration(v.contentDetails.duration);
        if (sec >= MIN_SECONDS) {
          totalViews += Number(v.statistics.viewCount || 0);
          episodeCount++;
        }
      });

      /* 4️⃣ APPLY TO COUNTERS */
      setCounter("yt-subs", subscribers);
      setCounter("yt-views", totalViews);
      setCounter("yt-videos", episodeCount);

    } catch (e) {
      console.error("YT STATS ERROR:", e);
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
   YOUTUBE EPISODES
===================================================== */
(() => {
  const API_KEY = "AIzaSyBfv24f4W3lmgCrmUTJBkJ3wIhc6Tm6org";
  const CHANNEL_ID = "UC5iFsgK01i-3xozxhFju7gg";
  const MIN = 1800;

  const track = document.querySelector(".slider--episodes .slider-track");
  if (!track) return;

  async function load() {
    const ch = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${CHANNEL_ID}&key=${API_KEY}`
    ).then(r => r.json());

    const uploads = ch.items[0].contentDetails.relatedPlaylists.uploads;

    const pl = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails&maxResults=15&playlistId=${uploads}&key=${API_KEY}`
    ).then(r => r.json());

    const ids = pl.items.map(v => v.contentDetails.videoId).join(",");

    const vids = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${ids}&key=${API_KEY}`
    ).then(r => r.json());

    track.innerHTML = "";

    vids.items
      .filter(v => parse(v.contentDetails.duration) >= MIN)
      .forEach(v => {
        track.innerHTML += `
<article class="card card--episode">
  <img src="${v.snippet.thumbnails.high.url}">
  <div class="card-body">
    <h3>${v.snippet.title}</h3>
  </div>
</article>`;
      });
  }

  function parse(iso){
    const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    return (m[1]||0)*3600 + (m[2]||0)*60 + (m[3]||0);
  }

  load();
})();

/* =====================================================
   CINEMATIC INFINITE SLIDER (EP + GUESTS)
===================================================== */
document.addEventListener("DOMContentLoaded", () => {

  initSlider(".slider--episodes");
  initSlider(".slider--guests");

  function initSlider(selector) {
    const slider = document.querySelector(selector);
    if (!slider) return;

    const track = slider.querySelector(".slider-track");
    if (!track) return;

    const wait = setInterval(() => {
      const cards = Array.from(track.children);
      if (!cards.length) return;

      clearInterval(wait);
      start(cards);
    }, 100);

    function start(cards) {
      cards.forEach(c => track.appendChild(c.cloneNode(true)));

      let pos = 0;
      let paused = false;
      const speed = 0.35;
      const loopWidth = track.scrollWidth / 2;

      function loop() {
        if (!paused) {
          pos -= speed;
          if (Math.abs(pos) >= loopWidth) pos = 0;
          track.style.transform = `translate3d(${pos}px,0,0)`;
        }
        requestAnimationFrame(loop);
      }

      slider.addEventListener("mouseenter", () => paused = true);
      slider.addEventListener("mouseleave", () => paused = false);
      slider.addEventListener("touchstart", () => paused = true, { passive:true });
      slider.addEventListener("touchend", () => paused = false);

      loop();
    }
  }

});
