const episodes = JSON.parse(localStorage.getItem("episodes")) || [];
const guests = JSON.parse(localStorage.getItem("guests")) ||;

/* EPIZODE */
document.getElementById("episodeForm").addEventListener("submit", e => {
  e.preventDefault();

  const ep = {
    title: epTitle.value,
    youtube: epYoutube.value,
    thumb: epThumb.value,
    desc: epDesc.value
  };

  episodes.push(ep);
  localStorage.setItem("episodes", JSON.stringify(episodes));
  e.target.reset();

  alert("Epizoda dodata ✔");
});

/* GOSTI */
document.getElementById("guestForm").addEventListener("submit", e => {
  e.preventDefault();

  const guest = {
    name: guestName.value,
    role: guestRole.value,
    img: guestImg.value,
    bio: guestBio.value
  };

  guests.push(guest);
  localStorage.setItem("guests", JSON.stringify(guests));
  e.target.reset();

  alert("Gost dodat ✔");
});

