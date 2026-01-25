import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabase = createClient(
  "https://TVOJ_PROJECT_ID.supabase.co",
  "PUBLIC_ANON_KEY"
);

const grid = document.querySelector(".guests-grid");

/* ================= LOAD GUESTS ================= */
async function loadGuests() {
  const { data, error } = await supabase
    .from("guests")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  grid.innerHTML = "";

  data.forEach(g => {
    const card = document.createElement("article");
    card.className = "card card--guest reveal";
    card.dataset.img = g.image_url;
    card.dataset.name = g.name;
    card.dataset.role = g.role;
    card.dataset.bio = g.bio;

    card.innerHTML = `
      <img src="${g.image_url}" alt="${g.name}">
      <div class="card-body">
        <h3 class="card-title">${g.name}</h3>
        <p class="card-meta">${g.role}</p>
      </div>
    `;

    grid.appendChild(card);
  });

  initGuestModal();
}

loadGuests();

/* ================= MODAL ================= */
function initGuestModal() {
  const modal = document.getElementById("guestModal");
  const modalImg = document.getElementById("guestModalImg");
  const modalName = document.getElementById("guestModalName");
  const modalRole = document.getElementById("guestModalRole");
  const modalBio = document.getElementById("guestModalBio");
  const closeBtn = document.getElementById("closeGuest");

  document.querySelectorAll(".card--guest").forEach(card => {
    card.addEventListener("click", () => {
      modalImg.src = card.dataset.img;
      modalName.textContent = card.dataset.name;
      modalRole.textContent = card.dataset.role;
      modalBio.textContent = card.dataset.bio;

      modal.classList.add("active");
      document.body.style.overflow = "hidden";
    });
  });

  closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", e => {
    if (e.target === modal) closeModal();
  });

  function closeModal() {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  }
}
