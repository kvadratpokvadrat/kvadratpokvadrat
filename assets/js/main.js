document.addEventListener("DOMContentLoaded", () => {

  /* HAMBURGER */
  const hamburger = document.querySelector(".hamburger");
  const nav = document.querySelector(".nav");

  hamburger?.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    nav.classList.toggle("active");
  });

  /* SCROLL ANIMATIONS */
  const reveal = document.querySelectorAll("section, .guest-card, .episode-card");

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity = 1;
        e.target.style.transform = "translateY(0)";
      }
    });
  }, { threshold: 0.15 });

  reveal.forEach(el => {
    el.style.opacity = 0;
    el.style.transform = "translateY(40px)";
    el.style.transition = "0.8s ease";
    io.observe(el);
  });

  /* GUEST MODAL */
  const modal = document.getElementById("guestModal");
  const img = document.getElementById("guestModalImg");
  const name = document.getElementById("guestModalName");
  const role = document.getElementById("guestModalRole");
  const bio = document.getElementById("guestModalBio");
  const close = document.getElementById("closeGuest");

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

  function closeModal(){
    modal.classList.remove("active");
    document.body.style.overflow = "";
  }

  close?.addEventListener("click", closeModal);
  modal?.addEventListener("click", e => e.target === modal && closeModal());
  document.addEventListener("keydown", e => e.key === "Escape" && closeModal());

});
