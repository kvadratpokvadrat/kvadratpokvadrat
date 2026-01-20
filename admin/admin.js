// =====================
// EPIZODE
// =====================
document.getElementById("episodeForm").addEventListener("submit", async e => {
  e.preventDefault();

  const data = {
    title: epTitle.value,
    youtube: epYoutube.value,
    thumbnail: epThumb.value,
    description: epDesc.value
  };

  const res = await fetch("/api/episodes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  if (res.ok) {
    alert("Epizoda dodata ✅");
    e.target.reset();
  } else {
    alert("Greška pri dodavanju ❌");
  }
});

// =====================
// GOSTI
// =====================
document.getElementById("guestForm").addEventListener("submit", async e => {
  e.preventDefault();

  const data = {
    name: gName.value,
    role: gRole.value,
    image: gImage.value,
    bio: gBio.value
  };

  const res = await fetch("/api/guests", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  if (res.ok) {
    alert("Gost dodat ✅");
    e.target.reset();
  } else {
    alert("Greška ❌");
  }
});
