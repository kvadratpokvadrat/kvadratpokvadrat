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
const overlay = document.querySelector(".nav-overlay");

overlay?.addEventListener("click", () => {
  nav.classList.remove("active");
  hamburger.classList.remove("active");
});
let touchStartY = 0;

nav.addEventListener("touchstart", e => {
  touchStartY = e.touches[0].clientY;
});

nav.addEventListener("touchend", e => {
  const touchEndY = e.changedTouches[0].clientY;
  const diff = touchStartY - touchEndY;

  if (diff > 80) { // swipe up
    nav.classList.remove("active");
    hamburger.classList.remove("active");
  }
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
/* =========================================
   YOUTUBE STATS
   Likes = ALL
   Others = Videos >= 2 min
   Subscribers = Channel level (SEPARATE CALL)
========================================= */

(() => {
  const API_KEY = "AIzaSyBfv24f4W3lmgCrmUTJBkJ3wIhc6Tm6org";
  const CHANNEL_ID = "UC5iFsgK01i-3xozxhFju7gg";
  const MIN_SECONDS = 1800;

  const CACHE_KEY = "yt_stats_full";
  const CACHE_TTL = 6 * 60 * 60 * 1000; // 6h

  const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || "null");
  if (cached && Date.now() - cached.time < CACHE_TTL) {
    apply(cached.data);
  } else {
    fetchStats();
  }

  async function fetchStats() {
    try {
      /* 1️⃣ SUBSCRIBERS – SEPARATE CALL (FIX) */
      const subsRes = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${CHANNEL_ID}&key=${API_KEY}`
      ).then(r => r.json());

      const subscribers = Number(
        subsRes.items?.[0]?.statistics?.subscriberCount || 0
      );

      /* 2️⃣ UPLOADS PLAYLIST */
      const uploadsRes = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${CHANNEL_ID}&key=${API_KEY}`
      ).then(r => r.json());

      const uploads =
        uploadsRes.items[0].contentDetails.relatedPlaylists.uploads;

      /* 3️⃣ PLAYLIST ITEMS */
      const pl = await fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails&maxResults=50&playlistId=${uploads}&key=${API_KEY}`
      ).then(r => r.json());

      const ids = pl.items.map(i => i.contentDetails.videoId).join(",");

      /* 4️⃣ VIDEO DETAILS */
      const vids = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,statistics,snippet&id=${ids}&key=${API_KEY}`
      ).then(r => r.json());

      let totalViews = 0;
      let totalLikes = 0;
      let totalComments = 0;
      let videoCount = 0;
      let totalDuration = 0;

      let topVideo = { views: 0, title: "" };

      vids.items.forEach(v => {
        const views = Number(v.statistics.viewCount || 0);
        const likes = Number(v.statistics.likeCount || 0);
        const comments = Number(v.statistics.commentCount || 0);
        const seconds = parseDuration(v.contentDetails.duration);

        // 👍 LAJKOVI = SVI (Shorts + Video)
        totalLikes += likes;

        // 👀 OSTALO = VIDEO ≥ 2 MIN
        if (seconds >= MIN_SECONDS) {
          totalViews += views;
          totalComments += comments;
          totalDuration += seconds;
          videoCount++;

          if (views > topVideo.views) {
            topVideo = {
              views,
              title: v.snippet.title
            };
          }
        }
      });

      const data = {
        subscribers,
        views: totalViews,
        likes: totalLikes,
        comments: totalComments,
        videos: videoCount,
        avgDuration:
          videoCount ? Math.round(totalDuration / videoCount) : 0,
        topVideo
      };

      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({ time: Date.now(), data })
      );

      apply(data);
    } catch (e) {
      console.error("YT API ERROR:", e);
    }
  }

  function parseDuration(iso) {
    const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    return (
      (parseInt(m[1] || 0) * 3600) +
      (parseInt(m[2] || 0) * 60) +
      parseInt(m[3] || 0)
    );
  }

  function apply(d) {
    console.log("SUBS:", d.subscribers); // 👈 DEBUG (možeš kasnije obrisati)

    set("yt-subs", d.subscribers);
    set("yt-views", d.views);
    set("yt-likes", d.likes);
    set("yt-comments", d.comments);
    set("yt-videos", d.videos);
    set("yt-avg-duration", d.avgDuration + "s");

    console.log("TOP VIDEO (>=2min):", d.topVideo.title, d.topVideo.views);
  }

  function set(id, val) {
    const el = document.getElementById(id);
    if (!el) return;
    el.dataset.count = val;
    el.textContent = "0";
  }
})();
/* =========================================
   YOUTUBE EPISODES – INDEX
   ONLY VIDEOS >= 30 MIN
========================================= */

(() => {
  const API_KEY = "AIzaSyBfv24f4W3lmgCrmUTJBkJ3wIhc6Tm6org";
  const CHANNEL_ID = "UC5iFsgK01i-3xozxhFju7gg";
  const MIN_SECONDS = 1800; // ✅ 30 min
  const MAX_EPISODES = 3;

  const container = document.getElementById("yt-episodes");
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

      container.innerHTML = "";
      let i = 0;

      for (const v of vids.items) {
        if (i >= MAX_EPISODES) break;

        const sec = parseDuration(v.contentDetails.duration);
        if (sec < MIN_SECONDS) continue;

        i++;

        container.innerHTML += `
          <a href="https://www.youtube.com/watch?v=${v.id}" target="_blank">
            <article class="card card--episode reveal reveal-visible">
              <img src="${v.snippet.thumbnails.high.url}">
              <div class="card-body">
                <h3 class="card-title">${v.snippet.title}</h3>
                <p class="card-meta">Epizoda #${i} • ${format(sec)}</p>
              </div>
            </article>
          </a>
        `;
      }
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













