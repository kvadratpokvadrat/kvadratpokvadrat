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

    // 🔒 SCROLL LOCK
    document.body.classList.toggle("nav-open", isOpen);
  });
}

/* CLOSE ON OVERLAY CLICK */
overlay?.addEventListener("click", function () {
  nav.classList.remove("active");
  burger.classList.remove("active");
  overlay.classList.remove("active");
  document.body.classList.remove("nav-open");
});

/* SWIPE UP TO CLOSE (MOBILE ONLY) */
let touchStartY = 0;

nav?.addEventListener("touchstart", function (e) {
  touchStartY = e.touches[0].clientY;
}, { passive: true });

nav?.addEventListener("touchend", function (e) {
  const touchEndY = e.changedTouches[0].clientY;
  const diff = touchStartY - touchEndY;

  if (diff > 80) {
    nav.classList.remove("active");
    burger.classList.remove("active");
    overlay?.classList.remove("active");
    document.body.classList.remove("nav-open");
  }
}, { passive: true });

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
    var isDark = document.body.classList.contains("dark");
    toggle.textContent = isDark ? "Light" : "Dark";
    localStorage.theme = isDark ? "dark" : "light";
  });
}

/* =====================
   REVEAL
===================== */
var reveals = document.querySelectorAll(".reveal");

var revealObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("reveal-visible");
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.15 });

reveals.forEach(el => revealObserver.observe(el));

/* =====================
   FLOW DIVIDERS
===================== */
var dividers = document.querySelectorAll(".section-divider");

var dividerObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("divider-visible");
    dividerObserver.unobserve(entry.target);
  });
}, { threshold: 0.4 });

dividers.forEach(d => dividerObserver.observe(d));

/* =====================
   STATS COUNTER
===================== */
var counters = document.querySelectorAll("[data-count]");

var counterObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (!entry.isIntersecting) return;

    var el = entry.target;
    var target = Number(el.dataset.count);
    var current = 0;
    var duration = 1800;
    var step = target / (duration / 16);

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

/* =====================
   GUEST MODAL
===================== */
var modal = document.getElementById("guestModal");
var modalImg = document.getElementById("guestModalImg");
var modalName = document.getElementById("guestModalName");
var modalRole = document.getElementById("guestModalRole");
var modalBio = document.getElementById("guestModalBio");
var closeModal = document.getElementById("closeGuest");

document.querySelectorAll(".card--guest").forEach(card => {
  card.addEventListener("click", function () {
    modalImg.src = card.dataset.img;
    modalName.textContent = card.dataset.name;
    modalRole.textContent = card.dataset.role;
    modalBio.textContent = card.dataset.bio || "";
    modal.classList.add("active");
  });
});

closeModal?.addEventListener("click", () => modal.classList.remove("active"));

modal?.addEventListener("click", e => {
  if (e.target === modal) modal.classList.remove("active");
});

});

/* =========================================
   YOUTUBE STATS
========================================= */
(() => {
  const API_KEY = "AIzaSyBfv24f4W3lmgCrmUTJBkJ3wIhc6Tm6org";
  const CHANNEL_ID = "UC5iFsgK01i-3xozxhFju7gg";
  const MIN_SECONDS = 1800;

  async function load() {
    const ch = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=statistics,contentDetails&id=${CHANNEL_ID}&key=${API_KEY}`
    ).then(r => r.json());

    const stats = ch.items[0].statistics;
    set("yt-subs", stats.subscriberCount);

    const uploads = ch.items[0].contentDetails.relatedPlaylists.uploads;

    const pl = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails&maxResults=50&playlistId=${uploads}&key=${API_KEY}`
    ).then(r => r.json());

    const ids = pl.items.map(v => v.contentDetails.videoId).join(",");

    const vids = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,statistics&id=${ids}&key=${API_KEY}`
    ).then(r => r.json());

    let views = 0, videos = 0;

    vids.items.forEach(v => {
      const sec = parse(v.contentDetails.duration);
      if (sec >= MIN_SECONDS) {
        views += Number(v.statistics.viewCount || 0);
        videos++;
      }
    });

    set("yt-subs", views);
    set("yt-views", views);
    set("yt-videos", videos);
  }

  function parse(iso) {
    const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    return (m[1]||0)*3600 + (m[2]||0)*60 + (m[3]||0);
  }

  function set(id, val) {
    const el = document.getElementById(id);
    if (!el) return;
    el.dataset.count = val;
    el.textContent = "0";
  }

  load();
})();

/* =========================================
   YOUTUBE EPISODES
========================================= */
(() => {
  const API_KEY = "AIzaSyBfv24f4W3lmgCrmUTJBkJ3wIhc6Tm6org";
  const CHANNEL_ID = "UC5iFsgK01i-3xozxhFju7gg";
  const MIN_SECONDS = 1800;
  const MAX_EPISODES = 3;

  const container = document.getElementById("yt-episodes");
  if (!container) return;

  load();

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

    let i = 0;
    container.innerHTML = "";

    vids.items
      .filter(v => parse(v.contentDetails.duration) >= MIN_SECONDS)
      .slice(0, MAX_EPISODES)
      .forEach(v => {
        i++;
        container.innerHTML += `
<a href="https://www.youtube.com/watch?v=${v.id}" target="_blank">
  <article class="card card--episode">
    <img src="${v.snippet.thumbnails.high.url}">
    <div class="card-body">
      <h3>${v.snippet.title}</h3>
      <p>Epizoda #${i} • ${format(parse(v.contentDetails.duration))}</p>
    </div>
  </article>
</a>`;
      });
  }

  function parse(iso) {
    const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    return (m[1]||0)*3600 + (m[2]||0)*60 + (m[3]||0);
  }

  function format(sec) {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    return h ? `${h}h ${m}min` : `${m}min`;
  }
})();
/* =====================================
   SMART SLIDERS (EP + GUESTS)
===================================== */
document.addEventListener("DOMContentLoaded", () => {

  initSlider(".slider--episodes", {
    desktopMin: 4 // više od 3
  });

  initSlider(".slider--guests", {
    desktopMin: 5 // više od 4
  });

 function initSlider(selector, rules) {
  const slider = document.querySelector(selector);
  if (!slider) return;

  const track = slider.querySelector(".slider-track");
  const prev = slider.querySelector(".prev");
  const next = slider.querySelector(".next");
  const dotsWrap = slider.querySelector(".slider-dots");

  /* ⏳ WAIT FOR CARDS (API SAFE) */
  const waitForCards = setInterval(() => {
    const cards = Array.from(track.children);


    if (!cards.length) return;

    clearInterval(waitForCards);
    startSlider(cards);
  }, 100);

  function startSlider(cards) {
    const isMobile = window.matchMedia("(max-width:1023px)").matches;

    if (!isMobile && cards.length < rules.desktopMin) {
      slider.classList.add("no-slider");
      return;
    }

    const cardWidth = cards[0].offsetWidth;

    /* ---------- DOTS ---------- */
    dotsWrap.innerHTML = "";
    cards.forEach((_, i) => {
      const dot = document.createElement("button");
      if (i === 0) dot.classList.add("active");
      dotsWrap.appendChild(dot);

      dot.addEventListener("click", () => {
        track.scrollTo({
          left: cards[i].offsetLeft,
          behavior: "smooth"
        });
      });
    });

    function updateDots() {
      const index = Math.round(track.scrollLeft / cardWidth);
      dotsWrap.querySelectorAll("button").forEach((d, i) => {
        d.classList.toggle("active", i === index);
      });
    }

    /* ---------- ARROWS ---------- */
    prev?.addEventListener("click", () => {
      track.scrollBy({ left: -cardWidth, behavior: "smooth" });
    });

    next?.addEventListener("click", () => {
      track.scrollBy({ left: cardWidth, behavior: "smooth" });
    });

    track.addEventListener("scroll", () => {
      requestAnimationFrame(updateDots);
    });

    /* ---------- AUTO SCROLL ---------- */
    let auto = setInterval(() => {
      track.scrollBy({ left: cardWidth, behavior: "smooth" });
    }, 4500);

    slider.addEventListener("mouseenter", () => clearInterval(auto));
    slider.addEventListener("mouseleave", () => {
      auto = setInterval(() => {
        track.scrollBy({ left: cardWidth, behavior: "smooth" });
      }, 4500);
    });
  }
}

});




