document.addEventListener("DOMContentLoaded", () => {
  const social = document.getElementById("socialFloat");
  const toggle = social?.querySelector(".social-toggle");

  if (!social || !toggle) return;

  // uvek vidljiv (opacity / scale)
  social.classList.add("visible");

  function handleSocial() {
    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    if (isMobile) {
      // 📱 MOBILE
      social.classList.remove("open");
      toggle.style.display = "flex";
    } else {
      // 💻 DESKTOP
      social.classList.add("open");
      toggle.style.display = "none";
    }
  }

  // klik na strelicu (samo mobile)
  toggle.addEventListener("click", () => {
    social.classList.toggle("open");
  });

  // init + resize
  handleSocial();
  window.addEventListener("resize", handleSocial);
});
