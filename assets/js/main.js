/* REVEAL */
.reveal {
  opacity: 0;
  transform: translateY(32px);
}

.reveal-visible {
  opacity: 1;
  transform: none;
  transition: .9s cubic-bezier(.4,0,.2,1);
}

/* DIVIDER */
.section-divider {
  transform: scaleX(0);
  opacity: 0;
  transform-origin: center;
}

.divider-visible {
  transform: scaleX(1);
  opacity: 1;
  transition: 1s cubic-bezier(.4,0,.2,1);
}

/* COUNTER */
.counting {
  transition: transform .3s ease;
}

.count-finished {
  transform: scale(1.08);
}
