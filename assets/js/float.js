/* =====================================================
   SOCIAL FLOAT – SHOW AFTER HERO
===================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const hero = document.querySelector(".hero");
  const social = document.getElementById("socialFloat");

  if (!hero || !social) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        social.classList.remove("visible");
      } else {
        social.classList.add("visible");
      }
    },
    { threshold: 0.4 }
  );

  observer.observe(hero);
});
