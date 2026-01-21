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
      document.body.classList.toggle("nav-open");
    });
  }

  /* =====================
     GUEST MODAL (HOME ONLY)
  ===================== */
  const modal = document.getElementById("guestModal");
  const isHome = document.body.classList.contains("home");

  if (modal && isHome) {
    const img = modal.querySelector("#guestModalImg");
    const name = modal.querySelector("#guestModalName");
    const role = modal.querySelector("#guestModalRole");
    const bio = modal.querySelector("#guestModalBio");
    const close = modal.querySelector("#closeGuest");

    document.querySelectorAll(".guest-card").forEach(card => {
      card.addEventListener("click", () => {
        img.src = card.dataset.img || "";
        name.textContent = card.dataset.name || "";
        role.textContent = card.dataset.role || "";
        bio.textContent = card.dataset.bio || "";

        modal.classList.add("active");
        document.body.style.overflow = "hidden";
      });
    });

    const closeModal = () => {
      modal.classList.remove("active");
      document.body.style.overflow = "";
    };

    close?.addEventListener("click", closeModal);

    modal.addEventListener("click", e => {
      if (e.target === modal) closeModal();
    });

    document.addEventListener("keydown", e => {
      if (e.key === "Escape") closeModal();
    });
  }

  /* =====================
     SCROLL REVEAL (FIXED)
     ➜ NEMA SKRIVANJA SECTION-a
  ===================== */
  const revealItems = document.querySelectorAll(".reveal");

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: "0px 0px -80px 0px"
  });

  revealItems.forEach(el => revealObserver.observe(el));

  /* =====================
     SECTION DIVIDER FLOW
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
     STATS COUNTER (SAFE)
  ===================== */
  const stats = document.querySelector(".stats");

  if (stats) {
    const numbers = stats.querySelectorAll("strong[data-count]");
    let animated = false;

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
        if (entry.isIntersecting && !animated) {
          animated = true;
          numbers.forEach(num => animateCount(num));
          statsObserver.unobserve(stats);
        }
      });
    }, { threshold: 0.35 });

    statsObserver.observe(stats);
  }

  /* =====================
     DARK MODE (STABLE)
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
