document.addEventListener("DOMContentLoaded", () => {

  /* MOBILE NAV */
  const burger = document.querySelector(".hamburger");
  const nav = document.querySelector(".nav");

  burger?.addEventListener("click", () => {
    nav.classList.toggle("active");
    burger.classList.toggle("active");
  });

  /* REVEAL */
  const reveals = document.querySelectorAll(".reveal");

  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if(e.isIntersecting){
        e.target.style.opacity = 1;
        e.target.style.transform = "none";
        e.target.style.transition = "0.9s cubic-bezier(.4,0,.2,1)";
        observer.unobserve(e.target);
      }
    });
  },{threshold:0.15});

  reveals.forEach(r => observer.observe(r));

  /* DARK MODE */
  const toggle = document.getElementById("themeToggle");
  if(toggle){
    if(localStorage.theme === "dark"){
      document.body.classList.add("dark");
      toggle.textContent = "Light";
    }
    toggle.onclick = () => {
      document.body.classList.toggle("dark");
      const d = document.body.classList.contains("dark");
      toggle.textContent = d ? "Light" : "Dark";
      localStorage.theme = d ? "dark" : "light";
    };
  }

});
