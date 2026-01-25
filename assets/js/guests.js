import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

/* =====================
   SUPABASE
===================== */
const supabase = createClient(
  "https://qwqohgpzsbrsfekkqctq.supabase.co",
  "sb_publishable_8q1nuH711miG6jzJlyuQqw_l7Wna1-f"
);

/* =====================
   DOM
===================== */
document.addEventListener("DOMContentLoaded", () => {
  const grid  = document.getElementById("guestsGrid");
  const modal = document.getElementById("guestModal");

  if (!grid || !modal) {
    console.error("GUESTS: Nedostaje guestsGrid ili guestModal u HTML-u");
    return;
  }

  const modalImg  = document.getElementById("guestModalImg");
  const modalName = document.getElementById("guestModalName");
  const modalRole = document.getElementById("guestModalRole");
  const modalBio  = document.getElementById("guestModalBio");
  const closeBtn  = document.getElementById("closeGuest");

  /* =====================
     LOAD GUESTS
  ===================== */
  async function loadGuests() {
    const { data, error } = await supabase
      .from("guests")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("SUPABASE:", error);
      return;
    }

    grid.innerHTML = "";

    data.forEach(guest => {
      const card = document.createElement("article");
      card.className = "card card--guest reveal";

      card.innerHTML = `
        <img src="${guest.image_url}" alt="${guest.name}">
        <div class="card-body">
          <h3 class="card-title">${guest.name}</h3>
          <p class="card-meta">${guest.role}</p>
        </div>
      `;

      card.addEventListener("click", () => openGuest(guest));
      grid.appendChild(card);
    });

    /* reveal animacija POSLE rendera */
    requestAnimationFrame(() => {
      grid
        .querySelectorAll(".reveal")
        .forEach(el => el.classList.add("reveal-visible"));
    });
  }

  /* =====================
     MODAL
  ===================== */
  function openGuest(guest) {
    modalImg.src = guest.image_url;
    modalImg.alt = guest.name;
    modalName.textContent = guest.name;
    modalRole.textContent = guest.role;
    modalBio.textContent  = guest.bio;

    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeGuest() {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  }

  closeBtn?.addEventListener("click", closeGuest);

  modal.addEventListener("click", e => {
    if (e.target === modal) closeGuest();
  });

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeGuest();
  });

  /* =====================
     INIT
  ===================== */
  loadGuests();
});
