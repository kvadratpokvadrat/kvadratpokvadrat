document.addEventListener("DOMContentLoaded", () => {

  /* =====================
     MOBILE NAV
  ===================== */
  const burger = document.querySelector(".hamburger");
  const nav = document.querySelector(".nav");

  if (burger && nav) {
    burger.addEventListener("click", () => {
      nav.classList.toggle("active");
      burger.classList.toggle("active");
    });

    nav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        nav.classList.remove("active");
        burger.classList.remove("active");
      });
    });
  }

  /* =====================
     REVEAL ANIMATION
  ===================== */
  const revealItems = document.querySelectorAll(".reveal");

  const revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealItems.forEach(el => revealObserver.observe(el));

  /* =====================
     FLOW DIVIDERS
  ===================== */
  const dividers = document.querySelectorAll(".section-divider");

  const dividerObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          dividerObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  dividers.forEach(d => dividerObserver.observe(d));

  /* =====================
     STATS COUNTER 🔢
  ===================== */
  const statsSection = document.querySelector(".stats");
  const counters = document.querySelectorAll("[data-count]");

  if (statsSection && counters.length) {
    const statsObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          statsSection.classList.add("visible");

          counters.forEach(counter => {
            const target = +counter.dataset.count;
            let current = 0;
            const step = Math.ceil(target / 80);

            const update = () => {
              current += step;
              if (current >= target) {
                counter.textContent = target;
              } else {
                counter.textContent = current;
                requestAnimationFrame(update);
              }
            };

            update();
          });

          statsObserver.unobserve(statsSection);
        }
      });
    }, { threshold: 0.4 });

    statsObserver.observe(statsSection);
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
      const isDark = document.body.classList.contains("dark");
      toggle.textContent = isDark ? "Light" : "Dark";
      localStorage.theme = isDark ? "dark" : "light";
    });
  }

});
