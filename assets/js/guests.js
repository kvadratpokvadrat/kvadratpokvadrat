const { data } = await supabase.from("guests").select("*");

data.forEach(g => {
  grid.innerHTML += `
    <article class="card card--guest"
      data-img="${g.image_url}"
      data-name="${g.name}"
      data-role="${g.role}"
      data-bio="${g.bio}">
      <img src="${g.image_url}">
      <div class="card-body">
        <h3>${g.name}</h3>
        <p>${g.role}</p>
      </div>
    </article>
  `;
});
