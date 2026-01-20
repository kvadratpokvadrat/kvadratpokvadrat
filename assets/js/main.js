document.addEventListener("DOMContentLoaded", () => {
  console.log("Sve radi kako treba 🟡");

  /* =====================
     HAMBURGER MENU
  ===================== */
  const hamburger = document.querySelector(".hamburger");
  const nav = document.querySelector(".nav");

  if (hamburger && nav) {
    hamburger.addEventListener("click", () => {
      nav.classList.toggle("active");
      hamburger.classList.toggle("active");
    });
  }

  /* =====================
     GUEST MODAL
  ===================== */
  const guestCards = document.querySelectorAll(".guest-card");
  const modal = document.getElementById("guestModal");
  const closeBtn = document.getElementById("closeGuest");

  const modalImg = document.getElementById("guestModalImg");
  const modalName = document.getElementById("guestModalName");
  const modalRole = document.getElementById("guestModalRole");
  const modalBio = document.getElementById("guestModalBio");

  if (modal && guestCards.length) {
    guestCards.forEach(card => {
      card.addEventListener("click", () => {
        modalImg.src = card.dataset.img;
        modalName.textContent = card.dataset.name;
        modalRole.textContent = card.dataset.role;
        modalBio.textContent = card.dataset.bio;

        modal.classList.add("active");
        document.body.style.overflow = "hidden";
      });
    });
  }

  /* CLOSE MODAL */
  if (closeBtn) {
    closeBtn.addEventListener("click", closeModal);
  }

  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeModal();
    }
  });

  function closeModal() {
    if (!modal) return;
    modal.classList.remove("active");
    document.body.style.overflow = "";
  }
});
