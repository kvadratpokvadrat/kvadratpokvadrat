document.addEventListener("DOMContentLoaded", function () {

  /* =====================
     MOBILE NAV
  ===================== */
  var burger = document.querySelector(".hamburger");
  var nav = document.querySelector(".nav");

  if (burger && nav) {
    burger.addEventListener("click", function () {
      burger.classList.toggle("active");
      nav.classList.toggle("active");
    });
  }

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

  reveals.forEach(function (el) {
    revealObserver.observe(el);
  });

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

  dividers.forEach(function (d) {
    dividerObserver.observe(d);
  });

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

      el.classList.add("counting");

      function update() {
        current += step;
        if (current < target) {
          el.textContent = Math.floor(current).toLocaleString("sr-RS");
          requestAnimationFrame(update);
        } else {
          el.textContent = target.toLocaleString("sr-RS");
          el.classList.add("count-finished");
          setTimeout(function () {
            el.classList.remove("count-finished");
          }, 600);
        }
      }

      update();
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.6 });

  counters.forEach(function (c) {
    counterObserver.observe(c);
  });

 /* =====================
   GUEST MODAL
===================== */
var modal = document.getElementById("guestModal");
var modalImg = document.getElementById("guestModalImg");
var modalName = document.getElementById("guestModalName");
var modalRole = document.getElementById("guestModalRole");
var modalBio = document.getElementById("guestModalBio");
var closeModal = document.getElementById("closeGuest");

var guestCards = document.querySelectorAll(".card--guest");

guestCards.forEach(function (card) {
  card.addEventListener("click", function () {
    modalImg.src = card.dataset.img;
    modalName.textContent = card.dataset.name;
    modalRole.textContent = card.dataset.role;

    if (modalBio && card.dataset.bio) {
      modalBio.textContent = card.dataset.bio;
    }

    modal.classList.add("active");
  });
});

if (closeModal) {
  closeModal.addEventListener("click", function () {
    modal.classList.remove("active");
  });
}

if (modal) {
  modal.addEventListener("click", function (e) {
    if (e.target === modal) {
      modal.classList.remove("active");
    }
  });
}

});
/* =========================
   YOUTUBE CHANNEL STATS
========================= */

(() => {
  const API_KEY = "AIzaSyBfv24f4W3lmgCrmUTJBkJ3wIhc6Tm6org"; // OGRANIČI NA DOMEN
  const CHANNEL = "@kvadratpokvadrat";

  const CACHE_KEY = "yt_channel_stats";
  const CACHE_TTL = 60 * 60 * 1000; // 1 sat

  const IDS = {
    subs: "yt-subs",
    views: "yt-views",
    videos: "yt-videos"
  };

  const now = Date.now();
  const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || "null");

  if (cached && now - cached.time < CACHE_TTL) {
    applyStats(cached.data);
  } else {
    fetchStats();
  }

  function fetchStats() {
    fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=statistics&forHandle=${CHANNEL}&key=${API_KEY}`
    )
      .then(res => res.json())
      .then(data => {
        if (!data.items || !data.items.length) return;
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ time: Date.now(), data })
        );
        applyStats(data);
      })
      .catch(err => {
        console.error("YT API error:", err);
      });
  }

  function applyStats(data) {
    const s = data.items[0].statistics;

    setCount(IDS.subs, s.subscriberCount);
    setCount(IDS.views, s.viewCount);
    setCount(IDS.videos, s.videoCount);
  }

  function setCount(id, value) {
    const el = document.getElementById(id);
    if (!el) return;

    el.dataset.count = value;
    el.textContent = "0";
  }
})();


