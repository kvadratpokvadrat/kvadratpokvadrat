/* =====================
   MOBILE NAV
===================== */
const hamburger = document.querySelector('.hamburger');
const nav = document.querySelector('.nav');

if (hamburger) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    nav.classList.toggle('active');
  });
}

/* =====================
   MODAL – GUEST
===================== */
const modal = document.querySelector('.guest-modal');
const modalClose = document.querySelector('.guest-modal-close');
const guestCards = document.querySelectorAll('.guest-card');

guestCards.forEach(card => {
  card.addEventListener('click', () => {
    modal.classList.add('active');
  });
});

if (modalClose) {
  modalClose.addEventListener('click', () => {
    modal.classList.remove('active');
  });
}

if (modal) {
  modal.addEventListener('click', e => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });
}

/* =====================
   ESC CLOSE
===================== */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    modal?.classList.remove('active');
  }
});
