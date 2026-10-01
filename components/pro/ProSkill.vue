<template>
  <section ref="section" class="skills">
    <div class="section-heading">
      <p class="eyebrow">{{ t.eyebrow }}</p>
      <h2>{{ t.title }}</h2>
      <p class="subtitle">{{ t.subtitle }}</p>
    </div>

    <div ref="grid" class="skill-grid">
      <article
        v-for="(group, i) in groups"
        :key="group.key"
        class="card"
        :style="{ '--ac': group.color }"
        @mousemove="onCardMove"
      >
        <span class="idx">0{{ i + 1 }}</span>

        <h3>{{ isEn ? group.title : group.titleId }}</h3>
        <p class="desc">{{ isEn ? group.desc : group.descId }}</p>

        <div class="level">
          <div class="level-top">
            <span>{{ t.levelLabel }}</span>
            <strong>{{ levels[i] }}%</strong>
          </div>
          <div class="bar"><i :style="{ width: levels[i] + '%' }"></i></div>
        </div>

        <div class="list">
          <span v-for="s in group.skills" :key="s">{{ s }}</span>
        </div>
      </article>
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
const grid = ref()

const t = computed(() => {
  const en = isEn.value
  return {
    eyebrow: en ? "Capabilities" : "Kemampuan",
    title: en
      ? "Focused skills for modern frontend work."
      : "Keahlian yang fokus untuk pekerjaan frontend modern.",
    subtitle: en
      ? "Three focus areas, one goal: interfaces that feel engineered and alive."
      : "Tiga fokus utama, satu tujuan: interface yang terasa engineered dan hidup.",
    levelLabel: en ? "Proficiency" : "Level",
  }
})

/* ===== EDIT DI SINI: warna grup & level 0-100 ===== */
const groups = [
  {
    key: "fe",
    color: "#4a90e2",
    level: 90,
    title: "Frontend Engineering",
    titleId: "Frontend Engineering",
    desc: "Building structured, maintainable interfaces with component-driven workflows.",
    descId: "Membangun interface yang terstruktur dan maintainable dengan alur kerja component-driven.",
    skills: ["Vue", "Nuxt", "TypeScript", "Pinia"],
  },
  {
    key: "ix",
    color: "#57d39f",
    level: 82,
    title: "Interactive Experience",
    titleId: "Pengalaman Interaktif",
    desc: "Adding motion and spatial interaction where it improves clarity and engagement.",
    descId: "Menambahkan motion dan interaksi spasial yang meningkatkan kejelasan dan engagement.",
    skills: ["Three.js", "GSAP", "WebGL", "Canvas"],
  },
  {
    key: "px",
    color: "#f0b84c",
    level: 78,
    title: "Product Interface",
    titleId: "Interface Produk",
    desc: "Designing responsive screens that feel sharp, readable, and production-ready.",
    descId: "Mendesain layar responsif yang terasa tajam, mudah dibaca, dan siap produksi.",
    skills: ["Responsive UI", "Design Systems", "Accessibility", "Performance"],
  },
]
/* ================================================ */

const levels = ref([0, 0, 0])

/* spotlight ngikutin mouse */
function onCardMove(e) {
  const el = e.currentTarget
  const r = el.getBoundingClientRect()
  el.style.setProperty("--mx", `${e.clientX - r.left}px`)
  el.style.setProperty("--my", `${e.clientY - r.top}px`)
}

let ctx

onMounted(() => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches

  if (reduce) {
    levels.value = groups.map((g) => g.level)
    return
  }

  ctx = gsap.context(() => {
    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
      scrollTrigger: { trigger: section.value, start: "top 75%", once: true },
    })

    tl.from(".section-heading > *", { opacity: 0, y: 24, stagger: 0.1, duration: 0.6 })
      .from(".card", { opacity: 0, y: 36, stagger: 0.13, duration: 0.7 }, "-=0.3")

    // counter + fill bar jalan bareng
    const prog = { v: 0 }
    gsap.to(prog, {
      v: 1,
      duration: 1.5,
      ease: "power2.out",
      scrollTrigger: { trigger: grid.value, start: "top 82%", once: true },
      onUpdate() {
        levels.value = groups.map((g) => Math.round(g.level * prog.v))
      },
    })
  }, section.value)
})

onUnmounted(() => ctx?.revert())
</script>

<style scoped>
.skills {
  padding: 96px 40px;
  background: var(--bg);
}

.section-heading,
.skill-grid {
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
  max-width: 680px;
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

.skill-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}

/* ===== CARD ===== */
.card {
  position: relative;
  overflow: hidden;
  padding: 24px;
  border: 1px solid var(--border);
  border-radius: 14px;
  background: var(--bg-card);
  transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
}

/* hairline warna grup di atas kartu */
.card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--ac), transparent 70%);
  opacity: 0.6;
  transition: opacity 0.25s ease;
}

@media (hover: hover) {
  .card:hover {
    transform: translateY(-4px);
    border-color: var(--ac);
    box-shadow: 0 20px 45px -20px rgba(0, 0, 0, 0.5);
  }
  .card:hover::before { opacity: 1; }
}

/* spotlight */
.card::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  border-radius: inherit;
  background: radial-gradient(
    240px circle at var(--mx, 50%) var(--my, 50%),
    color-mix(in srgb, var(--ac) 12%, transparent),
    transparent 65%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
}

.card:hover::after { opacity: 1; }

.idx {
  position: absolute;
  top: 18px;
  right: 20px;
  color: var(--text-muted);
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 0.75rem;
  font-weight: 700;
  opacity: 0.6;
}

h3 {
  margin: 0;
  color: var(--text);
  font-size: 1.12rem;
}

.desc {
  margin: 12px 0 18px;
  color: var(--text-muted);
  font-size: 0.95rem;
  line-height: 1.7;
}

/* ===== LEVEL BAR ===== */
.level { margin-bottom: 20px; }

.level-top {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 8px;
}

.level-top span {
  color: var(--text-muted);
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.level-top strong {
  color: var(--ac);
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 0.85rem;
  font-weight: 800;
}

.bar {
  height: 6px;
  border-radius: 4px;
  background: var(--border-dim);
  overflow: hidden;
}

.bar i {
  display: block;
  height: 100%;
  border-radius: 4px;
  background: linear-gradient(90deg, color-mix(in srgb, var(--ac) 55%, transparent), var(--ac));
  box-shadow: 0 0 12px color-mix(in srgb, var(--ac) 45%, transparent);
}

/* ===== CHIPS ===== */
.list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.list span {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 7px 11px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--border-dim);
  color: var(--text-muted);
  font-size: 0.75rem;
  font-weight: 800;
  transition: color 0.2s ease, border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
}

.list span::before {
  content: "";
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: var(--ac);
  opacity: 0.55;
  transition: opacity 0.2s ease, box-shadow 0.2s ease;
}

.list span:hover {
  color: var(--text);
  border-color: var(--ac);
  transform: translateY(-2px);
  box-shadow: 0 8px 18px -8px var(--ac);
}

.list span:hover::before {
  opacity: 1;
  box-shadow: 0 0 8px var(--ac);
}

@media (max-width: 920px) {
  .skills { padding: 72px 20px; }
  .skill-grid { grid-template-columns: 1fr; }
}

@media (max-width: 560px) {
  .skills { padding: 56px 16px; }
  .card { padding: 20px; }
  h3 { font-size: 1.05rem; }
  .desc { font-size: 0.92rem; margin: 10px 0 16px; }
  .list { gap: 6px; }
  .list span { font-size: 0.75rem; padding: 7px 9px; }
}
</style>