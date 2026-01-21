/* =====================
   RESET + BASE
===================== */

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: 'Inter', sans-serif;
  background: #f5f6f8;
  color: #111;
  line-height: 1.6;
}

/* =====================
   LINKS & BUTTONS
===================== */

a {
  color: inherit;
  text-decoration: none;
}

.btn {
  display: inline-block;
  padding: 14px 28px;
  border-radius: 30px;
  background: #111;
  color: #fff;
  font-weight: 600;
  transition: all .25s ease;
}

.btn:hover {
  transform: translateY(-2px);
  background: #000;
}

.badge-btn {
  padding: 10px 18px;
  border-radius: 22px;
  border: 1px solid rgba(0,0,0,0.15);
  background: transparent;
  cursor: pointer;
  font-weight: 500;
  transition: all .25s ease;
}

.badge-btn:hover {
  background: rgba(0,0,0,0.05);
  transform: translateY(-2px);
}

/* =====================
   HEADER
===================== */

header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(255,255,255,0.9);
  backdrop-filter: blur(14px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 40px;
}

.logo img {
  height: 36px;
}

.nav {
  display: flex;
  align-items: center;
  gap: 26px;
}

.nav a {
  font-weight: 500;
  color: #111;
}

.nav a.active {
  font-weight: 700;
}

.cta {
  padding: 12px 22px;
  border-radius: 26px;
  background: #111;
  color: #fff;
  font-weight: 600;
}

/* Hamburger (mobile) */
.hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
}

.hamburger span {
  width: 24px;
  height: 2px;
  background: #111;
}

/* =====================
   HERO
===================== */

.hero {
  min-height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 80px 20px;
}

.hero-small {
  min-height: 50vh;
}

.hero-content h1 {
  font-size: clamp(36px, 6vw, 64px);
  font-weight: 800;
  margin-bottom: 16px;
}

.hero-content p {
  font-size: 18px;
  max-width: 620px;
  margin: 0 auto 30px;
  color: #444;
}

/* =====================
   DIVIDER
===================== */

.section-divider {
  height: 1px;
  background: linear-gradient(to right, transparent, rgba(0,0,0,0.15), transparent);
  margin: 80px 0;
}

/* =====================
   SECTIONS
===================== */

section {
  padding: 0 40px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 40px;
}

.section-header h2 {
  font-size: 32px;
  font-weight: 700;
}

/* =====================
   GRIDS
===================== */

.episode-grid,
.hosts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 28px;
}

/* =====================
   CARDS
===================== */

.episode-card,
.guest-card {
  background: #fff;
  border-radius: 28px;
  overflow: hidden;
  box-shadow: 0 18px 50px rgba(0,0,0,0.08);
  transition: transform .35s ease, box-shadow .35s ease;
}

.episode-card:hover,
.guest-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 28px 70px rgba(0,0,0,0.14);
}

.episode-card img,
.guest-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  transition: transform .5s ease;
}

.episode-card:hover img,
.guest-card:hover img {
  transform: scale(1.05);
}

.episode-card-body {
  padding: 22px;
}

.episode-card h3 {
  font-size: 18px;
  margin-bottom: 10px;
}

.episode-card p {
  font-size: 14px;
  color: #555;
  margin-bottom: 14px;
}

/* =====================
   GUEST CARDS
===================== */

.guest-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,.6), transparent);
}

.guest-card {
  position: relative;
}

.guest-info {
  position: absolute;
  bottom: 18px;
  left: 18px;
  color: #fff;
}

.guest-info h3 {
  font-size: 18px;
}

.guest-info span {
  font-size: 14px;
  opacity: .85;
}

/* =====================
   NEWSLETTER / ABOUT
===================== */

.newsletter,
.about {
  padding: 0 40px;
}

.newsletter-inner {
  background: #fff;
  border-radius: 36px;
  padding: 40px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  align-items: center;
}

.newsletter-inner img {
  width: 100%;
  border-radius: 28px;
}

.newsletter-content h2 {
  font-size: 30px;
  margin-bottom: 14px;
}

.newsletter-content p {
  color: #555;
  margin-bottom: 22px;
}

.newsletter-form {
  display: flex;
  gap: 12px;
}

.newsletter-form input {
  flex: 1;
  padding: 14px 22px;
  border-radius: 24px;
  border: 1px solid #ddd;
  font-family: inherit;
}

.newsletter-form button {
  padding: 14px 26px;
  border-radius: 24px;
  background: #111;
  color: #fff;
  border: none;
  cursor: pointer;
}

/* =====================
   FOOTER
===================== */

.footer {
  padding: 60px 40px 30px;
  background: #111;
  color: #aaa;
}

.footer-inner {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px,1fr));
  gap: 40px;
}

.footer a {
  display: block;
  margin-bottom: 8px;
  color: #aaa;
}

.footer-bottom {
  text-align: center;
  margin-top: 40px;
  font-size: 14px;
  opacity: .7;
}

/* =====================
   REVEAL
===================== */

.reveal {
  opacity: 0;
  transform: translateY(30px);
  animation: reveal .9s ease forwards;
}

@keyframes reveal {
  to {
    opacity: 1;
    transform: none;
  }
}

/* =====================
   DARK MODE
===================== */

body.dark {
  background: #0f0f12;
  color: #eaeaf0;
}

body.dark header {
  background: rgba(20,20,25,0.9);
}

body.dark .nav a {
  color: #eaeaf0;
}

body.dark .hero p {
  color: #ccc;
}

body.dark .episode-card,
body.dark .guest-card,
body.dark .newsletter-inner {
  background: #1c1c22;
}

body.dark .episode-card p,
body.dark .newsletter-content p {
  color: #bbb;
}

body.dark .footer {
  background: #0b0b0e;
}

/* =====================
   MOBILE
===================== */

@media (max-width: 900px) {
  .newsletter-inner {
    grid-template-columns: 1fr;
  }

  header {
    padding: 16px 24px;
  }

  section {
    padding: 0 24px;
  }
}
