<template>
  <section id="projects" ref="section" class="projects">
    <div class="section-heading">
      <p class="eyebrow">
        {{ t.eyebrow }}
        <span class="count">(0{{ projects.length }})</span>
      </p>
      <h2>{{ t.title }}</h2>
      <p class="subtitle">{{ t.subtitle }}</p>
    </div>

    <!-- ===== FILTER TABS ===== -->
    <div class="filters" role="tablist" aria-label="Filter proyek">
      <button
        v-for="f in filters"
        :key="f.id"
        :class="{ active: activeFilter === f.id }"
        @click="applyFilter(f.id)"
      >
        {{ f.label }}
        <em>{{ f.count }}</em>
      </button>
    </div>

    <div class="grid" :class="{ flipping }">
      <article
        v-for="(p, i) in filtered"
        :key="p.id"
        class="card"
        :class="{ featured: p.featured && activeFilter === 'all', wide: p.wide && activeFilter === 'all' }"
        tabindex="0"
        role="button"
        :aria-label="p.title"
        @click="openProject(p)"
        @keydown.enter="openProject(p)"
        @mousemove="onCardMove"
        @mouseleave="onCardLeave"
      >
        <!-- ===== VISUAL ===== -->
        <div class="project-visual" :class="p.visual">
          <template v-if="p.visual === 'solar'">
            <div class="space">
              <i class="stars s1"></i>
              <i class="stars s2"></i>
              <div class="plane">
                <i class="ring ring-a"></i>
                <i class="ring ring-b"></i>
                <i class="sun"></i>
                <div class="orbit orb-a"><b class="pl pl-1"></b></div>
                <div class="orbit orb-b"><b class="pl pl-2"></b></div>
              </div>
            </div>
          </template>

          <template v-else-if="p.visual === 'ecom'">
            <div class="browser">
              <div class="b-bar">
                <i></i><i></i><i></i>
                <span class="b-url"></span>
              </div>
              <div class="b-body">
                <i class="sk" style="width: 55%"></i>
                <i class="sk" style="width: 35%"></i>
                <div class="prods">
                  <i class="prod" style="--i: 0"></i>
                  <i class="prod" style="--i: 1"></i>
                  <i class="prod" style="--i: 2"></i>
                </div>
              </div>
            </div>
            <b class="tag">+1</b>
          </template>

          <template v-else>
            <div class="seq">
              <div class="lane" style="--i: 0; --bar: #4a90e2"><i></i></div>
              <div class="lane" style="--i: 1; --bar: var(--primary)"><i></i></div>
              <div class="lane" style="--i: 2; --bar: #57d39f"><i></i></div>
              <div class="lane" style="--i: 3; --bar: #f0b84c"><i></i></div>
              <b class="playhead"></b>
            </div>
          </template>

          <!-- pill ngikutin kursor -->
          <span class="view-pill">↖ {{ t.viewDetail }}</span>
        </div>

        <!-- ===== BODY ===== -->
        <div class="card-body">
          <div class="type-row">
            <p class="type">
              {{ p.type }}
              <span v-if="p.badge" class="badge">{{ p.badge }}</span>
            </p>
            <span class="idx">0{{ i + 1 }}</span>
          </div>

          <h3>{{ p.title }}</h3>
          <p class="desc">{{ p.desc }}</p>

          <div class="meta">
            <span v-for="s in p.stack" :key="s">{{ s }}</span>
          </div>

          <div class="actions" @click.stop>
            <a
              v-for="(l, j) in p.links"
              :key="j"
              :href="l.href"
              target="_blank"
              rel="noopener"
              :class="{ 'btn-solid': j === 0 }"
            >
              {{ l.label }}
            </a>
          </div>
        </div>
      </article>
    </div>

    <!-- ===== DETAIL MODAL ===== -->
    <Teleport to="body">
      <div v-if="selected" class="modal-root">
        <div ref="backdropEl" class="modal-backdrop" @click="closeProject"></div>

        <div ref="panelEl" class="modal" role="dialog" aria-modal="true" :aria-label="selected.title">
          <button ref="closeEl" class="modal-close" @click="closeProject" aria-label="Close">
            ✕
          </button>

          <div ref="modalVisual" class="project-visual modal-visual" :class="selected.visual">
            <template v-if="selected.visual === 'solar'">
              <div class="space">
                <i class="stars s1"></i>
                <i class="stars s2"></i>
                <div class="plane">
                  <i class="ring ring-a"></i>
                  <i class="ring ring-b"></i>
                  <i class="sun"></i>
                  <div class="orbit orb-a"><b class="pl pl-1"></b></div>
                  <div class="orbit orb-b"><b class="pl pl-2"></b></div>
                </div>
              </div>
            </template>
            <template v-else-if="selected.visual === 'ecom'">
              <div class="browser">
                <div class="b-bar">
                  <i></i><i></i><i></i>
                  <span class="b-url"></span>
                </div>
                <div class="b-body">
                  <i class="sk" style="width: 55%"></i>
                  <i class="sk" style="width: 35%"></i>
                  <div class="prods">
                    <i class="prod" style="--i: 0"></i>
                    <i class="prod" style="--i: 1"></i>
                    <i class="prod" style="--i: 2"></i>
                  </div>
                </div>
              </div>
              <b class="tag">+1</b>
            </template>
            <template v-else>
              <div class="seq">
                <div class="lane" style="--i: 0; --bar: #4a90e2"><i></i></div>
                <div class="lane" style="--i: 1; --bar: var(--primary)"><i></i></div>
                <div class="lane" style="--i: 2; --bar: #57d39f"><i></i></div>
                <div class="lane" style="--i: 3; --bar: #f0b84c"><i></i></div>
                <b class="playhead"></b>
              </div>
            </template>
          </div>

          <div class="modal-body">
            <p class="type stagger">
              {{ selected.type }}
              <span v-if="selected.badge" class="badge">{{ selected.badge }}</span>
            </p>

            <h3 class="stagger">{{ selected.title }}</h3>
            <p class="desc stagger">{{ selected.desc }}</p>

            <ul class="highlights stagger">
              <li v-for="(h, k) in selected.highlights" :key="k">{{ h }}</li>
            </ul>

            <div class="meta stagger">
              <span v-for="s in selected.stack" :key="s">{{ s }}</span>
            </div>

            <div class="actions m-actions stagger">
              <a
                v-for="(l, j) in selected.links"
                :key="j"
                :href="l.href"
                target="_blank"
                rel="noopener"
                :class="{ 'btn-solid': j === 0 }"
                @mousemove="onMagnet"
                @mouseleave="onMagnetLeave"
              >
                {{ l.label }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </section>
</template>

<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref } from "vue"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Flip } from "gsap/Flip"
import { useLanguage } from "../../composables/useLanguage"

gsap.registerPlugin(ScrollTrigger, Flip)

const { language } = useLanguage()
const section = ref()
const backdropEl = ref()
const panelEl = ref()
const closeEl = ref()

const t = computed(() => {
  const en = language.value === "en"
  return {
    eyebrow: en ? "Projects" : "Proyek",
    title: en ? "Selected Projects" : "Proyek Pilihan",
    subtitle: en
      ? "Projects with clear interaction, performance, and visual direction."
      : "Proyek dengan interaksi yang jelas, performa, dan arah visual.",
    viewDetail: en ? "View Detail" : "Lihat Detail",
  }
})

/* ===== EDIT DATA PROYEK DI SINI ===== */
const projects = computed(() => {
  const en = language.value === "en"
  return [
    {
      id: "solar",
      visual: "solar",
      category: "frontend",
      featured: true,
      type: en ? "Featured Project" : "Proyek Unggulan",
      badge: en ? "Featured" : "Unggulan",
      title: en ? "Interactive Solar Portfolio" : "Portfolio Solar Interaktif",
      desc: en
        ? "A 3D portfolio experience built with Three.js, orbit navigation, camera transitions, and interactive exploration."
        : "Pengalaman portfolio 3D yang dibangun dengan Three.js, navigasi orbit, transisi kamera, dan eksplorasi interaktif.",
      highlights: en
        ? ["Real-time 3D scene rendered with Three.js", "Cinematic camera transitions between modes", "Interactive orbit navigation & exploration"]
        : ["Scene 3D real-time dengan Three.js", "Transisi kamera sinematik antar mode", "Navigasi orbit & eksplorasi interaktif"],
      stack: ["Nuxt", "Three.js", "GSAP", "Pinia"],
      links: [
        { label: en ? "View Project" : "Lihat Proyek", href: "https://github.com/Vahllzzzz/my-portofolio" },
        { label: "GitHub", href: "https://github.com/Vahllzzzz/my-portofolio" },
      ],
    },
    {
      id: "ecom",
      visual: "ecom",
      category: "fullstack",
      type: "Fullstack",
      title: "E-Commerce",
      desc: en
        ? "E-Commerce project for my internship, including product management and transactions."
        : "Proyek E-Commerce untuk magang saya, termasuk manajemen produk dan transaksi.",
      highlights: en
        ? ["Product & stock management dashboard", "Complete transaction flow", "Authentication with user roles"]
        : ["Dashboard manajemen produk & stok", "Alur transaksi lengkap", "Autentikasi dengan role user"],
      stack: ["Laravel", "PHP", "MySQL"],
      links: [
        { label: en ? "View on GitHub" : "Lihat di GitHub", href: "https://github.com/Vahllzzzz" },
        { label: en ? "Source Code" : "Kode Sumber", href: "https://github.com/Vahllzzzz" },
      ],
    },
    {
      id: "motion",
      visual: "motion",
      category: "ui",
      wide: true,
      type: "UI Engineering",
      title: en ? "Motion Interface Kit" : "Kit Interface Motion",
      desc: en
        ? "Reusable animation system and interaction patterns."
        : "Sistem animasi dan pola interaksi yang dapat digunakan kembali.",
      highlights: en
        ? ["Reusable timeline system", "Ready-to-use hover & reveal patterns", "Pure CSS + GSAP, zero extra dependencies"]
        : ["Sistem timeline reusable", "Pola hover & reveal siap pakai", "Murni CSS + GSAP, tanpa dependensi ekstra"],
      stack: ["GSAP", "CSS"],
      links: [
        { label: en ? "Explore Demos" : "Jelajahi Demo", href: "https://github.com/Vahllzzzz" },
        { label: "GitHub", href: "https://github.com/Vahllzzzz" },
      ],
    },
  ]
})
/* =================================== */

/* ===== FILTER (GSAP Flip) ===== */
const activeFilter = ref("all")
const flipping = ref(false)

const filters = computed(() => {
  const en = language.value === "en"
  const defs = [
    { id: "all", label: en ? "All" : "Semua" },
    { id: "frontend", label: "Frontend" },
    { id: "fullstack", label: "Fullstack" },
    { id: "ui", label: "UI" },
  ]
  return defs.map((d) => ({
    ...d,
    count:
      d.id === "all"
        ? projects.value.length
        : projects.value.filter((p) => p.category === d.id).length,
  }))
})

const filtered = computed(() =>
  activeFilter.value === "all"
    ? projects.value
    : projects.value.filter((p) => p.category === activeFilter.value)
)

function applyFilter(id) {
  if (flipping.value || activeFilter.value === id) return
  flipping.value = true

  const cards = section.value.querySelectorAll(".card")

  // 1. fade out kartu lama
  gsap.to(cards, {
    opacity: 0,
    y: 16,
    scale: 0.96,
    stagger: 0.035,
    duration: 0.3,
    ease: "power2.in",
    onComplete() {
      const state = Flip.getState(cards)

      // 2. swap data
      activeFilter.value = id

      // 3. Flip menganimasikan kartu yang pindah posisi
      nextTick(() => {
        Flip.from(state, {
          duration: 0.6,
          ease: "power3.inOut",
          stagger: 0.04,
          absolute: true,
          onEnter: (els) =>
            gsap.fromTo(
              els,
              { opacity: 0, y: 20, scale: 0.95 },
              { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: "power3.out" }
            ),
          onComplete: () => {
            gsap.set(section.value.querySelectorAll(".card"), { clearProps: "all" })
            flipping.value = false
          },
        })
      })
    },
  })
}

/* ===== TILT + SPOTLIGHT + PILL ===== */
const finePointer =
  typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches

function onCardMove(e) {
  const el = e.currentTarget
  const r = el.getBoundingClientRect()
  const px = (e.clientX - r.left) / r.width - 0.5
  const py = (e.clientY - r.top) / r.height - 0.5

  el.style.setProperty("--mx", `${e.clientX - r.left}px`)
  el.style.setProperty("--my", `${e.clientY - r.top}px`)

  const visual = el.querySelector(".project-visual")
  const pill = visual?.querySelector(".view-pill")
  if (pill) {
    const vr = visual.getBoundingClientRect()
    pill.style.transform = `translate(${e.clientX - vr.left - 12}px, ${e.clientY - vr.top - 14}px)`
  }

  if (!finePointer) return
  el.style.setProperty("--rx", `${(-py * 5).toFixed(2)}deg`)
  el.style.setProperty("--ry", `${(px * 7).toFixed(2)}deg`)
}

function onCardLeave(e) {
  const el = e.currentTarget
  el.style.setProperty("--rx", "0deg")
  el.style.setProperty("--ry", "0deg")
}

/* ===== MODAL ===== */
const selected = ref(null)
let modalTl

function openProject(p) {
  if (selected.value) return
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches

  selected.value = p
  document.documentElement.style.overflow = "hidden"
  window.addEventListener("keydown", onEsc)

  nextTick(() => {
    if (reduce) {
      closeEl.value?.focus()
      return
    }

    gsap.fromTo(
      backdropEl.value,
      { opacity: 0 },
      { opacity: 1, duration: 0.3, ease: "power2.out" }
    )
    gsap.fromTo(
      panelEl.value,
      { opacity: 0, y: 44, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "power3.out" }
    )
    gsap.fromTo(
      panelEl.value.querySelectorAll(".stagger"),
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.4, stagger: 0.06, delay: 0.15, ease: "power3.out" }
    )
    closeEl.value?.focus()
  })
}

function closeProject() {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  window.removeEventListener("keydown", onEsc)

  const finish = () => {
    selected.value = null
    document.documentElement.style.overflow = ""
  }

  if (reduce) return finish()

  modalTl = gsap.timeline({ onComplete: finish })
  modalTl
    .to(panelEl.value, { opacity: 0, y: 26, scale: 0.96, duration: 0.26, ease: "power2.in" })
    .to(backdropEl.value, { opacity: 0, duration: 0.26 }, 0)
}

function onEsc(e) {
  if (e.key === "Escape") closeProject()
}

/* ===== MAGNETIC BUTTONS (modal) ===== */
function onMagnet(e) {
  const el = e.currentTarget
  const r = el.getBoundingClientRect()
  el.style.setProperty("--tx", `${(e.clientX - r.left - r.width / 2) * 0.25}px`)
  el.style.setProperty("--ty", `${(e.clientY - r.top - r.height / 2) * 0.35}px`)
}

function onMagnetLeave(e) {
  e.currentTarget.style.setProperty("--tx", "0px")
  e.currentTarget.style.setProperty("--ty", "0px")
}

/* ===== REVEAL ON SCROLL ===== */
let ctx

onMounted(() => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches

  if (reduce) {
    section.value.querySelectorAll(".card").forEach((c) => c.classList.add("ready"))
    return
  }

  ctx = gsap.context(() => {
    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
      scrollTrigger: { trigger: section.value, start: "top 75%", once: true },
      onComplete() {
        section.value.querySelectorAll(".card").forEach((c) => c.classList.add("ready"))
      },
    })

    tl.from(".section-heading > *", { opacity: 0, y: 26, stagger: 0.1, duration: 0.6 })
      .from(".filters button", { opacity: 0, y: 14, stagger: 0.05, duration: 0.4 }, "-=0.3")
      .from(".card", { opacity: 0, y: 42, stagger: 0.13, duration: 0.75, clearProps: "transform" }, "-=0.25")
  }, section.value)
})

onUnmounted(() => {
  ctx?.revert()
  window.removeEventListener("keydown", onEsc)
  document.documentElement.style.overflow = ""
})
</script>

<style scoped>
.projects {
  padding: 100px 40px;
  background: var(--bg);
}

/* ===== HEADING ===== */
.section-heading {
  width: min(1080px, 100%);
  margin: 0 auto 40px;
}

.eyebrow {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 12px;
  color: var(--primary);
  font-size: 0.8rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.count { color: var(--text-muted); font-weight: 800; }

.section-heading h2 {
  max-width: 760px;
  margin: 0;
  color: var(--text);
  font-size: clamp(1.9rem, 3.4vw, 2.6rem);
  line-height: 1.16;
  font-weight: 900;
  letter-spacing: -0.02em;
}

.section-heading .subtitle {
  max-width: 680px;
  margin: 16px 0 0;
  color: var(--text-muted);
  font-size: 1.05rem;
  line-height: 1.7;
}

/* ===== FILTERS ===== */
.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  width: min(1080px, 100%);
  margin: 0 auto 28px;
}

.filters button {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 9px 15px;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: var(--bg-card);
  color: var(--text-muted);
  font-size: 0.8rem;
  font-weight: 800;
  cursor: pointer;
  transition: color 0.2s ease, border-color 0.2s ease, background 0.2s ease, transform 0.2s ease;
}

.filters button:hover {
  color: var(--text);
  border-color: var(--primary);
  transform: translateY(-2px);
}

.filters button.active {
  background: var(--primary);
  border-color: var(--primary);
  color: #ffffff;
}

.filters button em {
  font-style: normal;
  font-size: 0.66rem;
  font-weight: 800;
  opacity: 0.6;
}

.filters button.active em { opacity: 0.85; }

/* ===== GRID ===== */
.grid {
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
  width: min(1080px, 100%);
  margin: 0 auto;
}

/* saat Flip jalan, matikan transition transform biar gak tabrakan */
.grid.flipping .card { transition: none !important; }

/* ===== CARD ===== */
.card {
  position: relative;
  overflow: hidden;
  border: 1px solid var(--border);
  border-radius: 16px;
  background: var(--bg-card);
  cursor: pointer;
  transform: perspective(1000px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg)) translateY(var(--lift, 0px));
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.card.ready {
  transition: transform 0.18s ease-out, border-color 0.3s ease, box-shadow 0.3s ease;
}

@media (hover: hover) {
  .card.ready:hover {
    --lift: -5px;
    border-color: var(--primary);
    box-shadow: 0 24px 55px -22px rgba(0, 0, 0, 0.55);
  }
}

.card:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 3px;
}

.card::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  border-radius: inherit;
  background: radial-gradient(
    260px circle at var(--mx, 50%) var(--my, 50%),
    rgba(74, 144, 226, 0.11),
    transparent 65%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
}

.card:hover::after { opacity: 1; }

.card.featured { grid-column: span 2; }
.card.wide { grid-column: 1 / -1; }

/* ===== VISUAL ===== */
.project-visual {
  --tilt: 55deg;
  --space-bg-1: #090a10;
  --space-bg-2: rgba(30, 40, 70, 0.3);
  --star-c: rgba(255, 255, 255, 0.75);
  --ring-c: rgba(255, 255, 255, 0.15);
  --ring-c-2: rgba(255, 255, 255, 0.07);
  --sun-c: #f0b84c;
  --sun-glow: rgba(240, 184, 76, 0.65);
  --panel: #10131c;
  --panel-border: rgba(255, 255, 255, 0.08);
  --sk-1: rgba(255, 255, 255, 0.07);
  --sk-2: rgba(255, 255, 255, 0.17);

  position: relative;
  height: 180px;
  overflow: hidden;
  border-bottom: 1px solid var(--border);
  background: radial-gradient(circle at center, var(--space-bg-2), var(--space-bg-1) 72%);
}

:root[data-theme="light"] .project-visual {
  --space-bg-1: #c9d2e3;
  --space-bg-2: rgba(235, 240, 248, 0.85);
  --star-c: rgba(60, 80, 115, 0.5);
  --ring-c: rgba(20, 30, 50, 0.2);
  --ring-c-2: rgba(20, 30, 50, 0.1);
  --sun-c: #e6a63f;
  --sun-glow: rgba(230, 166, 63, 0.4);
  --panel: #eef1f7;
  --panel-border: rgba(20, 30, 50, 0.1);
  --sk-1: rgba(20, 30, 50, 0.08);
  --sk-2: rgba(20, 30, 50, 0.17);
}

.featured .project-visual { height: 215px; }

/* pill ngikutin kursor */
.view-pill {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 4;
  display: inline-flex;
  align-items: center;
  padding: 8px 14px;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: rgba(9, 10, 16, 0.85);
  backdrop-filter: blur(4px);
  color: #ffffff;
  font-size: 0.7rem;
  font-weight: 800;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  scale: 0.6;
  transition: opacity 0.2s ease, scale 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), transform 0.15s linear;
}

@media (hover: hover) {
  .card:hover .view-pill {
    opacity: 1;
    scale: 1;
  }
}

/* --- SOLAR: piringan 3D miring --- */
.space {
  position: absolute;
  inset: 0;
  perspective: 850px;
}

.plane {
  position: absolute;
  left: 50%;
  top: 55%;
  width: 0;
  height: 0;
  transform: rotateX(var(--tilt));
  transform-style: preserve-3d;
}

.ring,
.orbit {
  position: absolute;
  left: 50%;
  top: 50%;
  border-radius: 50%;
  transform-style: preserve-3d;
}

.ring { border: 1px solid var(--ring-c); transform: translate(-50%, -50%); }
.ring-a { width: 150px; height: 150px; }
.ring-b { width: 235px; height: 235px; border-color: var(--ring-c-2); }

.orbit {
  width: var(--d);
  height: var(--d);
  margin: calc(var(--d) / -2);
  animation: spin var(--t) linear infinite;
}

.orb-a { --d: 150px; --t: 7s; }
.orb-b { --d: 235px; --t: 13s; animation-direction: reverse; }

@keyframes spin {
  from { transform: rotateZ(0deg); }
  to { transform: rotateZ(360deg); }
}

/* planet: counter-rotate Z dulu (balikin arah orbit), baru X (balikin tilt)
   → hasilnya planet SELALU bulat menghadap kamera, ke mana pun dia muter */
.orbit .pl {
  position: absolute;
  top: 0;
  left: 50%;
  width: 14px;
  height: 14px;
  margin: -7px;
  border-radius: 50%;
  animation: billboard var(--t) linear infinite;
}

.orb-b .pl { animation-direction: reverse; }

@keyframes billboard {
  from { transform: rotateZ(0deg) rotateX(calc(var(--tilt) * -1)); }
  to   { transform: rotateZ(-360deg) rotateX(calc(var(--tilt) * -1)); }
}

.pl-1 { background: #4a90e2; box-shadow: 0 0 14px rgba(74, 144, 226, 0.7); }
.pl-2 {
  width: 11px;
  height: 11px;
  margin: -5.5px;
  background: #57d39f;
  box-shadow: 0 0 12px rgba(87, 211, 159, 0.7);
}

.sun {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 52px;
  height: 52px;
  margin: -26px;
  border-radius: 50%;
  /* counter-rotate biar matahari bulat, bukan elips */
  transform: rotateX(calc(var(--tilt) * -1));
  background: var(--sun-c);
  box-shadow: 0 0 28px var(--sun-glow), 0 0 70px var(--sun-glow);
  animation: sunPulse 3.4s ease-in-out infinite;
}

@keyframes sunPulse {
  50% { box-shadow: 0 0 40px var(--sun-glow), 0 0 95px var(--sun-glow); }
}

/* --- ECOM --- */
.browser {
  position: absolute;
  left: 50%;
  top: 52%;
  width: 76%;
  transform: translate(-50%, -50%);
  border: 1px solid var(--panel-border);
  border-radius: 10px;
  background: var(--panel);
  overflow: hidden;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.3);
}

.b-bar {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 8px 10px;
  border-bottom: 1px solid var(--panel-border);
}

.b-bar i { width: 8px; height: 8px; border-radius: 999px; background: var(--sk-2); }
.b-bar i:nth-child(1) { background: #e94560; }
.b-bar i:nth-child(2) { background: #f0b84c; }
.b-bar i:nth-child(3) { background: #57d39f; }

.b-url {
  flex: 1;
  height: 10px;
  margin-left: 6px;
  border-radius: 999px;
  background: var(--sk-1);
}

.b-body { padding: 12px 14px 16px; }

.sk {
  display: block;
  height: 8px;
  margin-bottom: 8px;
  border-radius: 4px;
  background: linear-gradient(90deg, var(--sk-1), var(--sk-2), var(--sk-1));
  background-size: 200% 100%;
  animation: shimmer 2.4s linear infinite;
}

@keyframes shimmer { to { background-position: -200% 0; } }

.prods {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-top: 12px;
}

.prod {
  height: 52px;
  border-radius: 8px;
  background: linear-gradient(135deg, var(--sk-2), var(--sk-1));
  animation: bob 3s ease-in-out infinite;
  animation-delay: calc(var(--i) * 0.4s);
}

.prod:nth-child(2) { background: linear-gradient(135deg, rgba(74, 144, 226, 0.4), var(--sk-1)); }
.prod:nth-child(3) { background: linear-gradient(135deg, rgba(87, 211, 159, 0.35), var(--sk-1)); }

@keyframes bob { 50% { transform: translateY(-5px); } }

.tag {
  position: absolute;
  right: 8%;
  top: 12%;
  z-index: 2;
  padding: 7px 11px;
  border-radius: 999px;
  background: var(--primary);
  color: #fff;
  font-size: 0.72rem;
  font-weight: 900;
  box-shadow: 0 10px 24px -6px var(--primary);
  animation: bob 2.6s ease-in-out infinite;
  animation-delay: 0.7s;
}

/* --- MOTION --- */
.seq {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 14px;
  padding: 0 13%;
}

.lane {
  position: relative;
  height: 10px;
  border-radius: 5px;
  background: var(--sk-1);
  overflow: hidden;
}

.lane i {
  position: absolute;
  top: 0;
  bottom: 0;
  left: -38%;
  width: 38%;
  border-radius: 5px;
  background: var(--bar, var(--primary));
  animation: slide 2.6s cubic-bezier(0.45, 0, 0.55, 1) infinite;
  animation-delay: calc(var(--i) * 0.35s);
}

@keyframes slide {
  0% { left: -38%; }
  60%, 100% { left: 100%; }
}

.playhead {
  position: absolute;
  top: 14%;
  bottom: 14%;
  left: 4%;
  width: 2px;
  border-radius: 2px;
  background: var(--text);
  opacity: 0.45;
  animation: scan 2.6s linear infinite;
}

@keyframes scan {
  from { left: 4%; }
  to { left: 95%; }
}

.card.wide .project-visual {
  height: 100%;
  min-height: 235px;
  border-bottom: none;
  border-right: 1px solid var(--border);
}

/* ===== BODY ===== */
.card-body {
  position: relative;
  z-index: 1;
  padding: 22px;
}

.card.wide .card-body {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.type-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.type {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin: 0;
  color: var(--primary);
  font-size: 0.75rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.idx {
  color: var(--text-muted);
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 0.75rem;
  font-weight: 700;
  opacity: 0.7;
}

.badge {
  padding: 5px 10px;
  border-radius: 999px;
  background: rgba(0, 200, 83, 0.15);
  color: var(--primary);
  font-size: 0.68rem;
  font-weight: 800;
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

.meta { display: flex; flex-wrap: wrap; gap: 8px; }

.meta span {
  padding: 7px 10px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--bg-surface);
  color: var(--text-muted);
  font-size: 0.74rem;
  font-weight: 800;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 20px;
}

.actions a {
  padding: 11px 16px;
  border: 1px solid var(--border);
  border-radius: 9px;
  background: var(--border-dim);
  color: var(--text);
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 800;
  transition: background 0.25s ease, color 0.25s ease, border-color 0.25s ease, transform 0.25s ease;
}

.actions a:hover {
  border-color: var(--primary);
  background: var(--primary);
  color: #ffffff;
  transform: translateY(-2px);
}

.btn-solid {
  background: var(--primary);
  border-color: var(--primary);
  color: #ffffff;
}

/* ===== MODAL ===== */
.modal-root {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: grid;
  place-items: center;
  padding: 24px;
}

.modal-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(4, 6, 10, 0.72);
  backdrop-filter: blur(8px);
}

.modal {
  position: relative;
  width: min(620px, 100%);
  max-height: calc(100vh - 48px);
  overflow-y: auto;
  border: 1px solid var(--border);
  border-radius: 20px;
  background: var(--bg-card);
  box-shadow: 0 40px 100px rgba(0, 0, 0, 0.55);
}

.modal-visual {
  height: 230px;
  border-bottom: 1px solid var(--border);
}

.modal-close {
  position: absolute;
  top: 14px;
  right: 14px;
  z-index: 5;
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: rgba(9, 10, 16, 0.7);
  backdrop-filter: blur(6px);
  color: #ffffff;
  font-size: 0.9rem;
  cursor: pointer;
  transition: transform 0.2s ease, background 0.2s ease;
}

.modal-close:hover {
  transform: rotate(90deg);
  background: rgba(9, 10, 16, 0.95);
}

.modal-body { padding: 24px 26px 28px; }

.modal-body h3 {
  margin: 10px 0 0;
  font-size: 1.5rem;
}

.highlights {
  margin: 16px 0 18px;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 9px;
}

.highlights li {
  position: relative;
  padding-left: 24px;
  color: var(--text-muted);
  font-size: 0.92rem;
  line-height: 1.6;
}

.highlights li::before {
  content: "";
  position: absolute;
  left: 0;
  top: 6px;
  width: 11px;
  height: 11px;
  border-radius: 4px;
  background: linear-gradient(135deg, var(--primary), #4a90e2);
}

/* magnetic buttons */
.m-actions a {
  transform: translate(var(--tx, 0px), var(--ty, 0px));
  transition: transform 0.2s ease, background 0.25s ease, color 0.25s ease, border-color 0.25s ease;
}

.m-actions a:hover { transform: translate(var(--tx, 0px), var(--ty, 0px)); }

/* ===== RESPONSIVE ===== */
@media (max-width: 920px) {
  .projects { padding: 72px 20px; }
  .grid { grid-template-columns: 1fr; gap: 16px; }
  .card.featured,
  .card.wide { grid-column: auto; }
  .card.wide { display: block; }
  .card.wide .project-visual {
    height: 170px;
    min-height: 0;
    border-right: none;
    border-bottom: 1px solid var(--border);
  }
  .project-visual { height: 150px; }
  .featured .project-visual { height: 170px; }
  .section-heading h2 { font-size: 2rem; }
}

@media (max-width: 560px) {
  .projects { padding: 56px 16px; }
  .grid { gap: 14px; }
  .section-heading h2 { font-size: 1.7rem; }
  .section-heading .subtitle { font-size: 0.95rem; }
  .card-body { padding: 18px; }
  h3 { font-size: 1.08rem; }
  .desc { font-size: 0.88rem; margin: 10px 0 14px; }
  .type { font-size: 0.7rem; }
  .actions { flex-direction: column; }
  .actions a { width: 100%; text-align: center; padding: 13px 14px; }
  .project-visual { height: 135px; }
  .ring-a, .orb-a { width: 115px; height: 115px; }
  .orb-a { --d: 115px; }
  .ring-b, .orb-b { width: 175px; height: 175px; }
  .orb-b { --d: 175px; }
  .sun { width: 42px; height: 42px; margin: -21px; }
  .prod { height: 42px; }
  .modal-root { padding: 12px; }
  .modal-body { padding: 20px 18px 24px; }
  .m-actions a { --tx: 0px !important; --ty: 0px !important; }
}

@media (prefers-reduced-motion: reduce) {
  .project-visual,
  .project-visual *,
  .tag { animation: none !important; }
}
</style>