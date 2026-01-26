document.addEventListener("DOMContentLoaded", () => {
  const social = document.getElementById("socialFloat");
  const toggle = social?.querySelector(".social-toggle");

  if (!social || !toggle) return;

  // UVEK aktivan (opacity / scale)
  social.classList.add("visible");

  const isMobile = window.matchMedia("(max-width: 768px)").matches;

  // Desktop: uvek izvučeno, bez strelice
  if (!isMobile) {
    social.classList.add("open");
    toggle.style.display = "none";
    return;
  }

  // Mobile: start sakriveno (samo strelica)
  social.classList.remove("open");

  toggle.addEventListener("click", () => {
    social.classList.toggle("open");
  });
});
