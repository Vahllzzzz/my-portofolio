<template>
  <section ref="section" class="tech-stack">
    <div class="section-heading">
      <p class="eyebrow">{{ t.eyebrow }}</p>
      <h2>{{ t.title }}</h2>
      <p class="subtitle">{{ t.subtitle }}</p>
    </div>

    <div class="rows">
      <div
        v-for="(g, i) in stacks"
        :key="g.initial"
        class="row"
        :class="{ rev: i % 2 === 1 }"
        :style="{ '--ac': g.color, '--spd': speed(g) }"
      >
        <div class="row-label">
          <span class="badge">{{ g.initial }}</span>
          <div class="label-text">
            <b>{{ isEn ? g.title : g.titleId }}</b>
            <small>{{ g.items.length }} tools</small>
          </div>
        </div>

        <div class="mask">
          <div class="track">
            <span v-for="(item, j) in loop(g.items)" :key="j" class="chip">
              {{ item }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useLanguage } from "../../composables/useLanguage"

gsap.registerPlugin(ScrollTrigger)

const { language } = useLanguage()
const isEn = computed(() => language.value === "en")
const section = ref()

const t = computed(() => {
  const en = isEn.value
  return {
    eyebrow: en ? "Tech Stack" : "Tech Stack",
    title: en
      ? "Tools I use to build fast and polished interfaces."
      : "Tools yang saya gunakan untuk membangun interface yang cepat dan halus.",
    subtitle: en
      ? "Hover a row to pause it and inspect the tools."
      : "Arahkan kursor ke baris untuk menghentikan dan melihat tools-nya.",
  }
})

/* ===== EDIT DATA DI SINI ===== */
const stacks = [
  {
    initial: "FE",
    color: "#4a90e2",
    title: "Frontend Core",
    titleId: "Frontend Core",
    items: ["HTML5", "CSS3", "JavaScript", "Vue.js", "Nuxt", "TypeScript", "Pinia"],
  },
  {
    initial: "BE",
    color: "#f0b84c",
    title: "Backend Core",
    titleId: "Backend Core",
    // FIX: dulu desc-nya copy-paste dari FE ("Styling and interaction tools...")
    items: ["PHP", "TypeScript", "Java", "Python", "MySQL"],
  },
  {
    initial: "3D",
    color: "var(--primary)",
    title: "Creative Web",
    titleId: "Web Kreatif",
    items: ["Three.js", "GSAP", "Canvas", "WebGL", "Blender"],
  },
  {
    initial: "DX",
    color: "#57d39f",
    title: "Workflow",
    titleId: "Workflow",
    items: ["Vite", "GitHub", "npm", "Chrome DevTools"],
  },
]
/* ============================ */

/* duplikasi item cukup banyak biar loop-nya gak ada ruang kosong,
   lalu diduplikasi 2x lagi buat seamless -50% translate */
function loop(items) {
  const copies = Math.max(2, Math.ceil(12 / items.length))
  const seq = Array.from({ length: copies }, () => items).flat()
  return [...seq, ...seq]
}

/* durasi proporsional jumlah item, biar kecepatan visualnya konsisten */
function speed(g) {
  const copies = Math.max(2, Math.ceil(12 / g.items.length))
  return `${copies * g.items.length * 2.2}s`
}

let ctx

onMounted(() => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches

  if (reduce) return

  ctx = gsap.context(() => {
    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
      scrollTrigger: { trigger: section.value, start: "top 75%", once: true },
    })

    tl.from(".section-heading > *", { opacity: 0, y: 24, stagger: 0.1, duration: 0.6 })
      .from(".row", { opacity: 0, x: -36, stagger: 0.12, duration: 0.65 }, "-=0.3")
  }, section.value)
})

onUnmounted(() => ctx?.revert())
</script>

<style scoped>
.tech-stack {
  padding: 96px 40px;
  background: var(--bg);
}

.section-heading,
.rows {
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

/* ===== MARQUEE ROWS ===== */
.rows {
  display: grid;
  gap: 14px;
}

.row {
  display: grid;
  grid-template-columns: 210px 1fr;
  align-items: center;
  gap: 0;
  padding: 10px;
  border: 1px solid var(--border);
  border-radius: 14px;
  background: var(--bg-card);
  transition: border-color 0.3s ease;
}

.row:hover { border-color: color-mix(in srgb, var(--ac) 55%, var(--border)); }

.row-label {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-right: 16px;
}

.badge {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 42px;
  height: 42px;
  border: 1px solid color-mix(in srgb, var(--ac) 45%, transparent);
  border-radius: 10px;
  color: var(--ac);
  background: color-mix(in srgb, var(--ac) 8%, transparent);
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 0.78rem;
  font-weight: 900;
  transition: box-shadow 0.3s ease, background 0.3s ease;
}

.row:hover .badge {
  box-shadow: 0 0 18px color-mix(in srgb, var(--ac) 35%, transparent);
  background: color-mix(in srgb, var(--ac) 14%, transparent);
}

.label-text { min-width: 0; }

.label-text b {
  display: block;
  color: var(--text);
  font-size: 0.88rem;
  line-height: 1.25;
}

.label-text small {
  color: var(--text-muted);
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 0.68rem;
  font-weight: 700;
}

.mask {
  overflow: hidden;
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 7%, #000 93%, transparent);
  mask-image: linear-gradient(90deg, transparent, #000 7%, #000 93%, transparent);
}

/* margin-right (bukan gap) supaya loop -50% mulus tanpa lompatan */
.track {
  display: flex;
  width: max-content;
  animation: marquee var(--spd, 28s) linear infinite;
}

.row.rev .track { animation-direction: reverse; }

.row:hover .track { animation-play-state: paused; }

@keyframes marquee {
  to { transform: translateX(-50%); }
}

.chip {
  flex-shrink: 0;
  margin-right: 10px;
  padding: 8px 13px;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: var(--border-dim);
  color: var(--text-muted);
  font-size: 0.78rem;
  font-weight: 800;
  white-space: nowrap;
  cursor: default;
  transition: color 0.2s ease, border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
}

.chip:hover {
  color: var(--text);
  border-color: var(--ac);
  background: color-mix(in srgb, var(--ac) 10%, transparent);
  box-shadow: 0 0 16px color-mix(in srgb, var(--ac) 30%, transparent);
}

@media (max-width: 920px) {
  .tech-stack { padding: 72px 20px; }

  .row { grid-template-columns: 1fr; gap: 10px; padding: 14px; }
  .row-label { padding-right: 0; }
}

@media (max-width: 560px) {
  .tech-stack { padding: 56px 16px; }

  .rows { gap: 10px; }

  .badge { width: 38px; height: 38px; font-size: 0.72rem; }
  .label-text b { font-size: 0.84rem; }
  .chip { font-size: 0.72rem; padding: 7px 11px; }
}

@media (prefers-reduced-motion: reduce) {
  .track { animation: none; }
}
</style>