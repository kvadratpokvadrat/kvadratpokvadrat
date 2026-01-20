document.addEventListener("DOMContentLoaded", () => {

  /* HEADER SCROLL */
  const header = document.querySelector("header");
  window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 10);
  });

  /* HAMBURGER */
  const hamburger = document.querySelector(".hamburger");
  const nav = document.querySelector(".nav");
  if(hamburger){
    hamburger.addEventListener("click",()=>{
      hamburger.classList.toggle("active");
      nav.classList.toggle("active");
    });
  }

  /* GUEST MODAL */
  const cards = document.querySelectorAll(".guest-card");
  const modal = document.getElementById("guestModal");
  if(modal){
    const img = document.getElementById("guestModalImg");
    const name = document.getElementById("guestModalName");
    const role = document.getElementById("guestModalRole");
    const bio = document.getElementById("guestModalBio");
    const close = document.getElementById("closeGuest");

    cards.forEach(c=>{
      c.addEventListener("click",()=>{
        img.src = c.dataset.img;
        name.textContent = c.dataset.name;
        role.textContent = c.dataset.role;
        bio.textContent = c.dataset.bio;
        modal.classList.add("active");
        document.body.style.overflow="hidden";
      });
    });

    function closeModal(){
      modal.classList.remove("active");
      document.body.style.overflow="";
    }
    close.addEventListener("click",closeModal);
    modal.addEventListener("click",e=>{
      if(e.target===modal) closeModal();
    });
    document.addEventListener("keydown",e=>{
      if(e.key==="Escape") closeModal();
    });
  }

});
