document.addEventListener("DOMContentLoaded", () => {
  const social = document.getElementById("socialFloat");
  const toggle = social?.querySelector(".social-toggle");

  if (!social || !toggle) return;

  toggle.addEventListener("click", () => {
    social.classList.toggle("open");
  });
});
