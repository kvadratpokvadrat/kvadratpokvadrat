document.addEventListener("DOMContentLoaded", () => {
  const social = document.getElementById("socialFloat");
  const toggle = social?.querySelector(".social-toggle");

  if (!social || !toggle) return;

  const isMobile = window.matchMedia("(max-width: 768px)").matches;

  // desktop – uvek vidljivo
  if (!isMobile) {
    social.classList.add("visible");
    toggle.style.display = "none";
    return;
  }

  // mobile – start sakriveno (samo strelica)
  social.classList.add("visible");
  social.classList.remove("open");

  toggle.addEventListener("click", () => {
    social.classList.toggle("open");
    toggle.textContent = social.classList.contains("open") ? "›" : "‹";
  });
});
