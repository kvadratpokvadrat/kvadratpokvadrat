import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabase = createClient(
  "https://qwqohgpzsbrsfekkqctq.supabase.co",
  "sb_publishable_8q1nuH711miG6jzJlyuQqw_l7Wna1-f"
);

const grid = document.getElementById("guestsGrid");
const modal = document.getElementById("guestModal");

const modalImg  = document.getElementById("guestModalImg");
const modalName = document.getElementById("guestModalName");
const modalRole = document.getElementById("guestModalRole");
const modalBio  = document.getElementById("guestModalBio");
const closeBtn  = document.getElementById("closeGuest");

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
}

function openGuest(guest) {
  modalImg.src = guest.image_url;
  modalName.textContent = guest.name;
  modalRole.textContent = guest.role;
  modalBio.textContent  = guest.bio;
  modal.classList.add("active");
}

closeBtn.addEventListener("click", () => {
  modal.classList.remove("active");
});

modal.addEventListener("click", e => {
  if (e.target === modal) modal.classList.remove("active");
});

loadGuests();
