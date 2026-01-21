document.addEventListener("DOMContentLoaded", () => {

  /* =====================
     MOBILE NAV
  ===================== */
  const burger = document.querySelector(".hamburger");
  const nav = document.querySelector(".nav");

  burger?.addEventListener("click", () => {
    burger.classList.toggle("active");
    nav.classList.toggle("active");
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
      document.body.classList.toggle("dark");
      const isDark = document.body.classList.contains("dark");
      toggle.textContent = isDark ? "Light" : "Dark";
      localStorage.theme = isDark ? "dark" : "light";
    });
  }


  /* =====================
     REVEAL ANIMATIONS
  ===================== */
  const reveals = document.querySelectorAll(".reveal");

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
        entry.target.style.transition = "0.9s cubic-bezier(.4,0,.2,1)";
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  reveals.forEach(el => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    revealObserver.observe(el);
  });


  /* =====================
     FLOW DIVIDERS
  ===================== */
  const dividers = document.querySelectorAll(".section-divider");

  const dividerObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.transform = "scaleX(1)";
        entry.target.style.transition = "1s cubic-bezier(.4,0,.2,1)";
      }
    });
  }, { threshold: 0.4 });

  dividers.forEach(d => {
    d.style.transform = "scaleX(0)";
    d.style.transformOrigin = "center";
    dividerObserver.observe(d);
  });


  /* =====================
     STATS COUNTER + GLOW
  ===================== */
  const counters = document.querySelectorAll("[data-count]");

  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const el = entry.target;
      const target = +el.dataset.count;
      let current = 0;
      const duration = 1800;
      const step = target / (duration / 16);

      const update = () => {
        current += step;
        if (current < target) {
          el.textContent = Math.floor(current).toLocaleString("sr-RS");
          requestAnimationFrame(update);
        } else {
          el.textContent = target.toLocaleString("sr-RS");

          /* glow pulse moment */
          el.style.transform = "scale(1.05)";
          setTimeout(() => el.style.transform = "scale(1)", 220);
        }
      };

      update();
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.6 });

  counters.forEach(c => counterObserver.observe(c));


  /* =====================
     GUEST MODAL
  ===================== */
  const modal = document.getElementById("guestModal");
  const modalImg = document.getElementById("guestModalImg");
  const modalName = document.getElementById("guestModalName");
  const modalRole = document.getElementById("guestModalRole");
  const modalBio = document.getElementById("guestModalBio");
  const closeModal = document.getElementById("closeGuest");

  document.querySelectorAll(".guest-card").forEach(card => {
    card.addEventListener("click", () => {
      modalImg.src = card.dataset.img;
      modalName.textContent = card.dataset.name;
      modalRole.textContent = card.dataset.role;
      modalBio.textContent = card.dataset.bio;
      modal.classList.add("active");
    });
  });

  closeModal?.addEventListener("click", () => {
    modal.classList.remove("active");
  });

  modal?.addEventListener("click", e => {
    if (e.target === modal) modal.classList.remove("active");
  });

});
