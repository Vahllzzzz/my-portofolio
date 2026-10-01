<template>
  <section id="certificates" ref="section" class="certs">
    <div class="section-heading">
      <p class="eyebrow">{{ t.eyebrow }}</p>
      <h2>{{ t.title }}</h2>
      <p class="subtitle">{{ t.subtitle }}</p>
    </div>

    <!-- earned kosong? tampilkan roadmap, bukan kekosongan -->
    <div ref="grid" class="cert-grid">
      <article
        v-for="(c, i) in certs"
        :key="c.title"
        class="cert-card"
        :class="`st-${c.status}`"
        :style="{ '--ac': statusColor(c.status) }"
        @mousemove="onCardMove"
      >
        <span class="idx">{{ String(i + 1).padStart(2, "0") }}</span>

        <div class="status-pill">
          <i aria-hidden="true"></i>{{ t.status[c.status] }}
        </div>

        <div class="cert-icon" aria-hidden="true">
          <!-- medal icon -->
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="9" r="5.2" />
            <path d="m9 13.6-1.7 6 4.7-2.5 4.7 2.5-1.7-6" />
            <path v-if="c.status === 'earned'" d="m10 8.8 1.6 1.6 3-3.2" />
          </svg>
        </div>

        <h3>{{ c.title }}</h3>
        <p class="issuer">{{ c.issuer }}</p>
        <p class="note">{{ c.note[language] ?? c.note.en }}</p>

        <div class="foot">
          <span class="date">{{ c.status === 'earned' ? c.date : t.eta }}</span>
          <span class="year-target">{{ c.status === 'earned' ? '✓' : c.target }}</span>
        </div>

        <!-- progress bar buat in-progress -->
        <div v-if="c.status === 'progress'" class="bar">
          <i :style="{ width: c.progress + '%' }"></i>
        </div>
      </article>
    </div>

    <p v-if="!certs.length" class="empty">{{ t.empty }}</p>
  </section>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useLanguage } from "../../composables/useLanguage"

gsap.registerPlugin(ScrollTrigger)

const { language } = useLanguage()
const section = ref()

const t = computed(() => {
  const en = language.value === "en"
  return {
    eyebrow: en ? "Credentials" : "Kredensial",
    title: en ? "Learning roadmap & certifications." : "Roadmap belajar & sertifikasi.",
    subtitle: en
      ? "I document my growth honestly — here's what's done, in progress, and on the roadmap."
      : "Saya mendokumentasikan perkembangan dengan jujur — ini yang selesai, sedang berjalan, dan di roadmap.",
    eta: en ? "Target" : "Target",
    empty: en ? "Certificates coming soon." : "Sertifikat segera hadir.",
    status: {
      earned: en ? "Earned" : "Diraih",
      progress: en ? "In Progress" : "Dikerjakan",
      planned: en ? "Planned" : "Direncanakan",
    },
  }
})

/* ===== EDIT DATA DI SINI =====
   status: "earned" | "progress" | "planned"
   - earned   → wajib sertifikat ASLI yang bisa diverifikasi (kasih link/ID)
   - progress → yang lagi serius lo pelajari sekarang
   - planned  → target; target = "2025" dst */
const certs = [
  {
    title: "SMK — Rekayasa Perangkat Lunak",
    issuer: "SMK ASSALAAM BANDUNG",
    note: { en: "Currently studying software engineering fundamentals.", id: "Sedang menempuh dasar-dasar rekayasa perangkat lunak." },
    status: "progress",
    progress: 70,
    target: "2026",
    date: "",
  },
  {
    title: "Frontend Developer Career Path",
    issuer: "dicoding.com",
    note: { en: "Hands-on coursework: HTML, CSS, JS, and web component fundamentals.", id: "Kelas hands-on: HTML, CSS, JS, dan fundamental web component." },
    status: "progress",
    progress: 45,
    target: "2025",
    date: "",
  },
  {
    title: "Meta Front-End Developer",
    issuer: "Coursera",
    note: { en: "Planned right after finishing current coursework.", id: "Direncanakan setelah coursework berjalan selesai." },
    status: "planned",
    progress: 0,
    target: "2026",
    date: "",
  },
  {
    title: "Unity Certified User — Programmer",
    issuer: "Unity",
    note: { en: "Long-term goal to back my game development journey.", id: "Target jangka panjang buat ngestoken perjalanan game dev saya." },
    status: "planned",
    progress: 0,
    target: "2027",
    date: "",
  },
]
/* ============================ */

const statusColor = (s) =>
  s === "earned" ? "#3ddc84" : s === "progress" ? "#4a90e2" : "#7c6cff"

/* spotlight */
function onCardMove(e) {
  const el = e.currentTarget
  const r = el.getBoundingClientRect()
  el.style.setProperty("--mx", `${e.clientX - r.left}px`)
  el.style.setProperty("--my", `${e.clientY - r.top}px`)
}

let ctx

onMounted(() => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

  ctx = gsap.context(() => {
    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
      scrollTrigger: { trigger: section.value, start: "top 75%", once: true },
    })

    tl.from(".section-heading > *", { opacity: 0, y: 24, stagger: 0.1, duration: 0.6 })
      .from(".cert-card", { opacity: 0, y: 34, stagger: 0.11, duration: 0.65 }, "-=0.3")
  }, section.value)
})

onUnmounted(() => ctx?.revert())
</script>

<style scoped>
.certs {
  padding: 96px 40px;
  background: var(--bg);
}

.section-heading,
.cert-grid {
  width: min(1080px, 100%);
  margin-inline: auto;
}

.section-heading { margin-bottom: 36px; }

.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 12px;
  color: var(--primary);
  font-size: 0.8rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.eyebrow::before {
  content: "";
  width: 7px;
  height: 7px;
  border-radius: 999px;
  background: var(--primary);
  box-shadow: 0 0 10px var(--primary);
}

.section-heading h2 {
  max-width: 720px;
  margin: 0;
  color: var(--text);
  font-size: clamp(1.9rem, 3.4vw, 2.4rem);
  line-height: 1.16;
  font-weight: 900;
  letter-spacing: -0.02em;
}

.subtitle {
  max-width: 620px;
  margin: 14px 0 0;
  color: var(--text-muted);
  font-size: 1.02rem;
  line-height: 1.7;
}

.cert-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}

/* ===== CARD ===== */
.cert-card {
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: 22px;
  border: 1px solid var(--border);
  border-radius: 14px;
  background: var(--bg-card);
  transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
}

@media (hover: hover) {
  .cert-card:hover {
    transform: translateY(-4px);
    border-color: color-mix(in srgb, var(--ac) 55%, var(--border));
    box-shadow: 0 20px 44px -20px rgba(0, 0, 0, 0.5);
  }
}

/* spotlight */
.cert-card::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  border-radius: inherit;
  background: radial-gradient(
    220px circle at var(--mx, 50%) var(--my, 50%),
    color-mix(in srgb, var(--ac) 10%, transparent),
    transparent 65%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
}

.cert-card:hover::after { opacity: 1; }

.idx {
  position: absolute;
  top: 18px;
  right: 20px;
  color: var(--text-muted);
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 0.72rem;
  font-weight: 700;
  opacity: 0.55;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  width: fit-content;
  margin-bottom: 18px;
  padding: 5px 11px;
  border: 1px solid color-mix(in srgb, var(--ac) 40%, transparent);
  border-radius: 999px;
  background: color-mix(in srgb, var(--ac) 9%, transparent);
  color: var(--ac);
  font-size: 0.62rem;
  font-weight: 900;
  letter-spacing: 0.07em;
  text-transform: uppercase;
}

.status-pill i {
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: var(--ac);
  box-shadow: 0 0 8px var(--ac);
}

/* in-progress: dotnya kedip; planned: dotnya statis redup */
.st-progress .status-pill i { animation: pulse 1.8s ease-in-out infinite; }
.st-planned .status-pill i { opacity: 0.5; box-shadow: none; }

@keyframes pulse {
  50% { opacity: 0.35; transform: scale(0.75); }
}

.cert-icon {
  width: 44px;
  height: 44px;
  margin-bottom: 16px;
  display: grid;
  place-items: center;
  border: 1px solid color-mix(in srgb, var(--ac) 35%, transparent);
  border-radius: 11px;
  background: color-mix(in srgb, var(--ac) 7%, transparent);
  color: var(--ac);
  transition: box-shadow 0.25s ease;
}

.cert-card:hover .cert-icon {
  box-shadow: 0 0 20px color-mix(in srgb, var(--ac) 30%, transparent);
}

.cert-icon svg {
  width: 22px;
  height: 22px;
}

h3 {
  margin: 0;
  color: var(--text);
  font-size: 0.98rem;
  line-height: 1.35;
}

.issuer {
  margin: 6px 0 0;
  color: var(--ac);
  font-size: 0.76rem;
  font-weight: 800;
}

.note {
  flex: 1;
  margin: 10px 0 16px;
  color: var(--text-muted);
  font-size: 0.84rem;
  line-height: 1.6;
}

.foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding-top: 12px;
  border-top: 1px solid var(--border);
}

.date {
  color: var(--text-muted);
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.year-target {
  color: var(--text-dim);
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 0.78rem;
  font-weight: 800;
}

/* progress bar khusus in-progress */
.bar {
  margin-top: 12px;
  height: 5px;
  border-radius: 4px;
  background: var(--border-dim);
  overflow: hidden;
}

.bar i {
  display: block;
  height: 100%;
  border-radius: 4px;
  background: linear-gradient(90deg, color-mix(in srgb, var(--ac) 50%, transparent), var(--ac));
  box-shadow: 0 0 10px color-mix(in srgb, var(--ac) 40%, transparent);
}

.empty {
  width: min(1080px, 100%);
  margin: 0 auto;
  padding: 40px;
  border: 1px dashed var(--border);
  border-radius: 14px;
  color: var(--text-muted);
  text-align: center;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 1020px) {
  .cert-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

@media (max-width: 640px) {
  .certs { padding: 72px 20px; }
  .cert-grid { grid-template-columns: 1fr; }
}

@media (max-width: 560px) {
  .certs { padding: 56px 16px; }
  .cert-card { padding: 20px; }
}

@media (prefers-reduced-motion: reduce) {
  .status-pill i { animation: none; }
}
</style>