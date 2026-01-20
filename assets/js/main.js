document.addEventListener("DOMContentLoaded", () => {

  /* ---------- HAMBURGER ---------- */
  const hamburger = document.querySelector(".hamburger");
  const nav = document.querySelector(".nav");

  if (hamburger && nav) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active");
      nav.classList.toggle("active");
    });
  }

  /* ---------- GUEST MODAL ---------- */
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

  /* ---------- SCROLL REVEAL ---------- */
  const reveal = document.querySelectorAll("section, .episode-card, .guest-card");
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity = 1;
        e.target.style.transform = "translateY(0)";
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });

  reveal.forEach(el => {
    el.style.opacity = 0;
    el.style.transform = "translateY(40px)";
    el.style.transition = "0.8s cubic-bezier(.4,0,.2,1)";
    io.observe(el);
  });

});
