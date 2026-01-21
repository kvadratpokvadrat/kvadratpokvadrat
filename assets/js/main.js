document.addEventListener("DOMContentLoaded", () => {

  /* =====================
     HAMBURGER MENU
  ===================== */
  const hamburger = document.querySelector(".hamburger");
  const nav = document.querySelector(".nav");

  if (hamburger && nav) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active");
      nav.classList.toggle("active");
    });
  }

  /* =====================
     GUEST MODAL
  ===================== */
  const modal = document.getElementById("guestModal");

  if (modal) {
    const img = modal.querySelector("#guestModalImg");
    const name = modal.querySelector("#guestModalName");
    const role = modal.querySelector("#guestModalRole");
    const bio = modal.querySelector("#guestModalBio");
    const close = modal.querySelector("#closeGuest");

    document.querySelectorAll(".guest-card").forEach(card => {
      card.addEventListener("click", () => {
        img.src = card.dataset.img;
        name.textContent = card.dataset.name;
        role.textContent = card.dataset.role;
        bio.textContent = card.dataset.bio;
        modal.classList.add("active");
        document.body.style.overflow = "hidden";
      });
    });

    const closeModal = () => {
      modal.classList.remove("active");
      document.body.style.overflow = "";
    };

    close.addEventListener("click", closeModal);
    modal.addEventListener("click", e => {
      if (e.target === modal) closeModal();
    });
    document.addEventListener("keydown", e => {
      if (e.key === "Escape") closeModal();
    });
  }

  /* =====================
     SCROLL REVEAL
     (NE dira .stats)
  ===================== */
  const revealItems = document.querySelectorAll(
    "section:not(.stats), .episode-card, .guest-card"
  );

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = 1;
        entry.target.style.transform = "translateY(0)";
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealItems.forEach(el => {
    el.style.opacity = 0;
    el.style.transform = "translateY(40px)";
    el.style.transition = "0.8s cubic-bezier(.4,0,.2,1)";
    revealObserver.observe(el);
  });

  /* =====================
     SECTION DIVIDER
  ===================== */
  document.querySelectorAll(".section-divider").forEach(divider => {
    const dividerObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          divider.classList.add("active");
          dividerObserver.unobserve(divider);
        }
      });
    }, { threshold: 0.4 });

    dividerObserver.observe(divider);
  });

  /* =====================
     STATS REVEAL + COUNTER
  ===================== */
  const stats = document.querySelector(".stats");

  if (stats) {
    const numbers = stats.querySelectorAll("strong[data-count]");

    const animateCount = (el) => {
      const target = +el.dataset.count;
      const duration = 1400;
      const startTime = performance.now();

      const update = (time) => {
        const progress = Math.min((time - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target).toLocaleString();

        if (progress < 1) requestAnimationFrame(update);
      };

      requestAnimationFrame(update);
    };

    const statsObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          stats.classList.add("visible");
          numbers.forEach(num => animateCount(num));
          statsObserver.unobserve(stats);
        }
      });
    }, { threshold: 0.3 });

    statsObserver.observe(stats);
  }
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
    document.body.classList.toggle("dark");
    const dark = document.body.classList.contains("dark");
    toggle.textContent = dark ? "Light" : "Dark";
    localStorage.theme = dark ? "dark" : "light";
  });
}

});
window.addEventListener("load", () => {
  const loader = document.getElementById("page-loader");

  setTimeout(() => {
    loader.classList.add("hide");
    document.body.classList.add("loaded");
  }, 1600);
});



