<template>
  <section id="projects" ref="section" class="projects">
    <div class="section-heading">
        <p>{{ language === "en" ? "Projects" : "Proyek" }}</p>
        <h2>
            {{
                language === "en"
                ? "Selected Projects"
                : "Proyek Pilihan"
            }}
        </h2>
        <p class="subtitle">
            {{
                language === "en"
                ? "Projects with clear interaction, performance, and visual direction."
                : "Proyek dengan interaksi yang jelas, performa, dan arah visual."
            }}
        </p>
    </div>

<div class="grid">

  <!-- Featured -->
  <article class="card featured">

    <div class="project-visual solar">
      <span></span>
      <span class="stars"></span>
      <span></span>
    </div>

    <div class="card-body">
      <p class="type">
        {{ language === "en" ? "Featured Project" : "Proyek Unggulan" }}
        <span class="badge">{{ language === "en" ? "Featured" : "Unggulan" }}</span>
      </p>

      <h3>{{ language === "en" ? "Interactive Solar Portfolio" : "Portfolio Solar Interaktif" }}</h3>

      <p class="desc">
        {{
          language === "en"
            ? "A 3D portfolio experience built with Three.js, orbit navigation, camera transitions, and interactive exploration."
            : "Pengalaman portfolio 3D yang dibangun dengan Three.js, navigasi orbit, transisi kamera, dan eksplorasi interaktif."
        }}
      </p>

      <div class="meta">
        <span>Nuxt</span>
        <span>Three.js</span>
        <span>GSAP</span>
        <span>Pinia</span>
      </div>

      <div class="actions">
        <a href="https://github.com/Vahllzzzz/my-portofolio" target="_blank" rel="noopener">
          {{ language === "en" ? "View Project" : "Lihat Proyek" }}
        </a>
        <a href="https://github.com/Vahllzzzz/my-portofolio" target="_blank" rel="noopener">GitHub</a>
      </div>
    </div>

  </article>

  <!-- E-Commerce -->
  <article class="card">

    <div class="project-visual portfolio">
      <span></span>
      <span></span>
      <span></span>
    </div>

    <div class="card-body">
      <p class="type">Fullstack</p>

      <h3>E-Commerce</h3>

      <p class="desc">
        {{
          language === "en"
            ? "E-Commerce project for my internship, including product management and transactions."
            : "Proyek E-Commerce untuk magang saya, termasuk manajemen produk dan transaksi."
        }}
      </p>

      <div class="meta">
        <span>Laravel</span>
        <span>PHP</span>
        <span>MySQL</span>
      </div>

      <div class="actions">
        <a href="https://github.com/Vahllzzzz" target="_blank" rel="noopener">
          {{ language === "en" ? "View on GitHub" : "Lihat di GitHub" }}
        </a>
        <a href="https://github.com/Vahllzzzz" target="_blank" rel="noopener">
          {{ language === "en" ? "Source Code" : "Kode Sumber" }}
        </a>
      </div>
    </div>

  </article>

  <!-- Motion Kit -->
  <article class="card">

    <div class="project-visual motion">
      <span></span>
      <span></span>
      <span></span>
    </div>

    <div class="card-body">
      <p class="type">{{ language === "en" ? "UI Engineering" : "UI Engineering" }}</p>

      <h3>{{ language === "en" ? "Motion Interface Kit" : "Kit Interface Motion" }}</h3>

      <p class="desc">
        {{
          language === "en"
            ? "Reusable animation system and interaction patterns."
            : "Sistem animasi dan pola interaksi yang dapat digunakan kembali."
        }}
      </p>

      <div class="meta">
        <span>GSAP</span>
        <span>CSS</span>
      </div>

      <div class="actions">
        <a href="https://github.com/Vahllzzzz" target="_blank" rel="noopener">
          {{ language === "en" ? "Explore Demos" : "Jelajahi Demo" }}
        </a>
        <a href="https://github.com/Vahllzzzz" target="_blank" rel="noopener">GitHub</a>
      </div>
    </div>

  </article>

</div>
  </section>
</template>

<script setup>
import { onMounted, ref } from "vue"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useLanguage } from "../../composables/useLanguage"

const { language } = useLanguage()

gsap.registerPlugin(ScrollTrigger)

const section = ref()

onMounted(() => {
  gsap.from(".card", {
    scrollTrigger: {
      trigger: section.value,
      start: "top 75%"
    },
    opacity: 0,
    y: 36,
    stagger: 0.12,
    duration: 0.7,
    ease: "power3.out"
  })
})
</script>

<style scoped>
.projects {
  padding: 96px 40px;
  background: var(--bg);
}

.section-heading {
  width: min(1080px, 100%);
  margin: 0 auto 36px;
}

.section-heading p {
  margin: 0 0 10px;
  color: var(--primary);
  font-size: 0.8rem;
  font-weight: 900;
  text-transform: uppercase;
}

.section-heading h2 {
  max-width: 760px;
  margin: 0;
  color: var(--text);
  font-size: 2.4rem;
  line-height: 1.16;
}

.section-heading .subtitle {
  max-width: 680px;
  margin: 16px 0 0;
  color: var(--text-muted);
  font-size: 1.05rem;
  line-height: 1.7;
  text-transform: none;
  font-weight: 400;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
  width: min(1080px, 100%);
  margin: 0 auto;
}

.card {
  overflow: hidden;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--bg-card);
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.card{
  position:relative;
  overflow:hidden;
}

.card::before{
  content:"";

  position:absolute;
  inset:0;

  background:
    radial-gradient(
      circle at center,
      rgba(28, 147, 38, 0.18),
      transparent 60%
    );

  opacity:0;

  transition:.4s;
}

.card:hover::before{
  opacity:1;
}

.card:hover {
  border-color: var(--primary);
  transform: translateY(-4px);
}

.project-visual {
  position: relative;
  height: 180px;
  overflow: hidden;
  border-bottom: 1px solid var(--border);
  background: var(--bg-surface);
}

.project-visual span {
  position: absolute;
  display: block;
}

.card-body {
  padding: 22px;
}

.type {
  margin: 0 0 10px;
  color: var(--primary);
  font-size: 0.75rem;
  font-weight: 900;
  text-transform: uppercase;
}

h3 {
  margin: 0;
  color: var(--text);
  font-size: 1.22rem;
  line-height: 1.3;
}

.desc {
  margin: 12px 0 18px;
  color: var(--text-muted);
  font-size: 0.95rem;
  line-height: 1.7;
}

.meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.meta span {
  padding: 7px 9px;
  border-radius: 8px;
  background: var(--bg-surface);
  color: var(--text-muted);
  font-size: 0.75rem;
  font-weight: 800;
}

@media (max-width: 920px) {
  .projects {
    padding: 72px 24px;
  }

  .grid {
    grid-template-columns: 1fr;
  }

  .section-heading h2 {
    font-size: 2rem;
  }
}

.featured{
  grid-column: span 2;
}

.actions{
  display:flex;
  gap:10px;
  margin-top:20px;
}

.actions a{
  padding:10px 14px;

  border-radius:8px;

  background: var(--border-dim);

  color: var(--text);

  text-decoration:none;

  font-size:.85rem;
  font-weight:700;

  transition:.25s;
}

.actions a:hover{
  background: var(--primary);
  color: #ffffff;
}

.badge{
  display:inline-flex;

  padding:6px 10px;

  margin-bottom:12px;

  border-radius:999px;

  background: rgba(0, 200, 83, 0.15);

  color: var(--primary);

  font-size:.7rem;
  font-weight:800;
}

.solar{
  position:relative;
  overflow:hidden;
  background:
    radial-gradient(
      circle at center,
      rgba(30,40,70,.3),
      #090a10 70%
    );
}

/* Light mode: lighter space background */
:root[data-theme="light"] .solar{
  background:
    radial-gradient(
      circle at center,
      rgba(230,235,245,.8),
      #c8d0e0 70%
    );
}

.solar .stars{
  position:absolute;
  inset:0;

  background-image:
    radial-gradient(
      rgba(255,255,255,.8) 1px,
      transparent 1px
    );

  background-size:
    26px 26px;

  opacity:.25;
}

/* Light mode: darker stars for contrast */
:root[data-theme="light"] .solar .stars{
  background-image:
    radial-gradient(
      rgba(100,120,150,.4) 1px,
      transparent 1px
    );
  opacity:.35;
}

.solar span:nth-child(1){
  position:absolute;

  width:72px;
  height:72px;

  left:50%;
  top:50%;

  transform:
    translate(-50%,-50%);

  border-radius:50%;

  background:#f0b84c;

  box-shadow:
    0 0 35px rgba(240,184,76,.75),
    0 0 80px rgba(240,184,76,.4);

  z-index:3;
}

/* Light mode: reduce sun brightness */
:root[data-theme="light"] .solar span:nth-child(1){
  background:#e6a940;
  box-shadow:
    0 0 20px rgba(240,184,76,.4),
    0 0 40px rgba(240,184,76,.2);
  opacity: 0.85;
}

.solar::before{
  content:"";

  position:absolute;

  width:140px;
  height:140px;

  left:50%;
  top:50%;

  transform:
    translate(-50%,-50%);

  border-radius:50%;

  border:
    1px solid rgba(255,255,255,.16);
}

/* Light mode: darker orbit rings */
:root[data-theme="light"] .solar::before{
  border: 1px solid rgba(0,0,0,.12);
}

.solar::after{
  content:"";

  position:absolute;

  width:220px;
  height:220px;

  left:50%;
  top:50%;

  transform:
    translate(-50%,-50%);

  border-radius:50%;

  border:
    1px solid rgba(255,255,255,.08);
}

/* Light mode: darker orbit rings */
:root[data-theme="light"] .solar::after{
  border: 1px solid rgba(0,0,0,.08);
}

.solar span:nth-child(3){
  position:absolute;

  width:26px;
  height:26px;

  left:50%;
  top:50%;

  margin:-13px;

  border-radius:50%;

  background:#4a90e2;

  box-shadow:
    0 0 15px rgba(74,144,226,.6);

  animation:
    orbitPlanet 8s linear infinite;
}

/* Light mode: adjust planet glow */
:root[data-theme="light"] .solar span:nth-child(3){
  background:#3a7bc8;
  box-shadow:
    0 0 10px rgba(74,144,226,.4);
}

@keyframes orbitPlanet{

  from{
    transform:
      rotate(0deg)
      translateX(110px)
      rotate(0deg);
  }

  to{
    transform:
      rotate(360deg)
      translateX(110px)
      rotate(-360deg);
  }
}
</style>
