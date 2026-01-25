import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabase = createClient(
  "https://qwqohgpzsbrsfekkqctq.supabase.co",
  "sb_publishable_8q1nuH711miG6jzJlyuQqw_l7Wna1-f"
);

const form = document.getElementById("guestForm");
const list = document.getElementById("adminGuestList");

let editId = null;
let oldImageUrl = null;

/* ================= LOAD ================= */
async function loadGuests() {
  const { data, error } = await supabase
    .from("guests")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  list.innerHTML = "";

  data.forEach(g => {
    const div = document.createElement("div");
    div.innerHTML = `
      <img src="${g.image_url}" width="80"><br>
      <strong>${g.name}</strong> – ${g.role}<br>
      <button onclick="editGuest('${g.id}')">Edit</button>
      <button onclick="deleteGuest('${g.id}', '${g.image_url}')">Delete</button>
      <hr>
    `;
    list.appendChild(div);
  });
}
loadGuests();

/* ================= SAVE ================= */
form.addEventListener("submit", async e => {
  e.preventDefault();

  const name = form.name.value.trim();
  const role = form.role.value.trim();
  const bio = form.bio.value.trim();
  const file = document.getElementById("image").files[0];

  let image_url = oldImageUrl;

  /* UPLOAD IMAGE */
  if (file) {
    const fileName = `${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabase
      .storage
      .from("guests")
      .upload(fileName, file);

    if (uploadError) {
      alert("Greška pri uploadu slike");
      console.error(uploadError);
      return;
    }

    image_url = supabase
      .storage
      .from("guests")
      .getPublicUrl(fileName).data.publicUrl;

    /* DELETE OLD IMAGE ON EDIT */
    if (editId && oldImageUrl) {
      const oldPath = oldImageUrl.split("/guests/")[1];
      await supabase.storage.from("guests").remove([oldPath]);
    }
  }

  if (editId) {
    await supabase
      .from("guests")
      .update({ name, role, bio, image_url })
      .eq("id", editId);
  } else {
    await supabase
      .from("guests")
      .insert([{
        name,
        role,
        bio,
        image_url
      }]);
  }

  form.reset();
  editId = null;
  oldImageUrl = null;
  loadGuests();
});

/* ================= EDIT ================= */
window.editGuest = async id => {
  const { data } = await supabase
    .from("guests")
    .select("*")
    .eq("id", id)
    .single();

  form.name.value = data.name;
  form.role.value = data.role;
  form.bio.value = data.bio;

  editId = id;
  oldImageUrl = data.image_url;
};

/* ================= DELETE ================= */
window.deleteGuest = async (id, imageUrl) => {
  if (!confirm("Obrisati gosta?")) return;

  await supabase.from("guests").delete().eq("id", id);

  if (imageUrl) {
    const path = imageUrl.split("/guests/")[1];
    await supabase.storage.from("guests").remove([path]);
  }

  loadGuests();
};
