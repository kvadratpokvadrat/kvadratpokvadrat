import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

/* =====================
   SUPABASE
===================== */
const supabase = createClient(
  "https://qwqohgpzsbrsfekkqctq.supabase.co",
  "sb_publishable_8q1nuH711miG6jzJlyuQqw_l7Wna1-f"
);

/* =====================
   DOM READY
===================== */
document.addEventListener("DOMContentLoaded", () => {

  const grid = document.getElementById("guestsGrid");
  if (!grid) {
    console.error("GUESTS: #guestsGrid ne postoji u HTML-u");
    return;
  }

  // modal NIJE obavezan
  const modal     = document.getElementById("guestModal");
  const modalImg  = document.getElementById("guestModalImg");
  const modalName = document.getElementById("guestModalName");
  const modalRole = document.getElementById("guestModalRole");
  const modalBio  = document.getElementById("guestModalBio");
  const closeBtn  = document.getElementById("closeGuest");

  const isHome =
    window.location.pathname.endsWith("index.html") ||
    window.location.pathname === "/";

  /* =====================
   REVEAL OBSERVER
===================== */
const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("reveal-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.15
  }
);

/* =====================
   LOAD GUESTS
===================== */
async function loadGuests() {
  const { data, error } = await supabase
    .from("guests")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("SUPABASE ERROR:", error);
    return;
  }

  grid.innerHTML = "";

  const list = isHome ? data.slice(0, 4) : data;

  list.forEach(guest => {
    const card = document.createElement("article");
    card.className = "card card--guest reveal";

    card.innerHTML = `
      <img src="${guest.image_url}" alt="${guest.name}">
      <div class="card-body">
        <h3 class="card-title">${guest.name}</h3>
        <p class="card-meta">${guest.role || ""}</p>
      </div>
    `;

    if (modal) {
      card.addEventListener("click", () => openGuest(guest));
    }

    grid.appendChild(card);

    // 👇 OVO JE KLJUČ
    revealObserver.observe(card);
  });
}

  /* =====================
     MODAL
  ===================== */
  function openGuest(guest) {
    if (!modal) return;

    modalImg.src = guest.image_url;
    modalImg.alt = guest.name;
    modalName.textContent = guest.name;
    modalRole.textContent = guest.role || "";
    modalBio.textContent  = guest.bio || "";

    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeGuest() {
    if (!modal) return;

    modal.classList.remove("active");
    document.body.style.overflow = "";
  }

  closeBtn?.addEventListener("click", closeGuest);

  modal?.addEventListener("click", e => {
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
