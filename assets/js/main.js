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
     GUEST MODAL – SAFE FIX
  ===================== */
  const modal = document.getElementById("guestModal");

  if (modal) {
    const guestCards = document.querySelectorAll(".guest-card");
    const closeBtn = document.getElementById("closeGuest");

    const modalImg = document.getElementById("guestModalImg");
    const modalName = document.getElementById("guestModalName");
    const modalRole = document.getElementById("guestModalRole");
    const modalBio = document.getElementById("guestModalBio");

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

    function closeModal() {
      modal.classList.remove("active");
      document.body.style.overflow = "";
    }

    /* X BUTTON */
    closeBtn.addEventListener("click", closeModal);

    /* CLICK OUTSIDE */
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });

    /* ESC KEY */
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("active")) {
        closeModal();
      }
    });
  }
});
