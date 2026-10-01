<template>
  <section id="about" ref="section" class="about">
    <!-- dekorasi orbit di background -->
    <div class="orbits" aria-hidden="true">
      <span></span><span></span><span></span>
    </div>

    <div class="copy">
      <p ref="badge" class="eyebrow">{{ t.eyebrow }}</p>

      <h2 ref="headline">
        <span v-for="(w, i) in headlineWords" :key="language + '-' + i" class="w">
          <span class="wi">{{ w }}</span>
        </span>
      </h2>

      <div ref="paras" class="paras">
        <p>{{ t.p1 }}</p>
        <p>{{ t.p2 }}</p>
      </div>

      <!-- edit list skill di sini -->
      <div ref="chipsEl" class="chips">
        <span v-for="c in chips" :key="c">{{ c }}</span>
      </div>
    </div>

    <div ref="sideEl" class="side">
      <div ref="terminal" class="terminal glow-card" @mousemove="onCardMove">
        <div class="terminal-top">
          <span></span><span></span><span></span>
          <em>~/portfolio/reihan.ts</em>
        </div>
        <div class="terminal-body">
          <p
            v-for="(line, i) in typedLines"
            :key="i"
            :class="{ cmd: line.startsWith('$') }"
          >
            {{ line }}<span v-if="i === typedLines.length - 1" class="caret"></span>
          </p>
        </div>
      </div>

      <!-- edit angka & label di script -->
      <div ref="statsEl" class="stats">
        <div v-for="(s, i) in stats" :key="i" class="stat glow-card" @mousemove="onCardMove">
          <strong>{{ display[i] }}{{ s.suffix }}</strong>
          <span>{{ s.label }}</span>
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

const section = ref()
const badge = ref()
const headline = ref()
const paras = ref()
const chipsEl = ref()
const sideEl = ref()
const terminal = ref()
const statsEl = ref()

const t = computed(() => {
  const en = language.value === "en"
  return {
    eyebrow: en ? "About Me" : "Tentang Saya",
    headline: en
      ? "A developer who cares about the interface after the code compiles."
      : "Seorang developer yang peduli tentang tampilan setelah kode selesai dikompilasi.",
    p1: en
      ? "I focus on frontend experiences that are structured, responsive, and enjoyable to use. My work sits between engineering and visual craft: clean Vue/Nuxt architecture, thoughtful motion, and interfaces that feel intentional."
      : "Saya fokus pada pengalaman frontend yang terstruktur, responsif, dan menyenangkan untuk digunakan. Pekerjaan saya berada di antara engineering dan visual craft: arsitektur Vue/Nuxt yang bersih, motion yang thoughtful, dan interface yang terasa disengaja.",
    p2: en
      ? "I enjoy building interactive scenes, polished portfolio systems, and product-facing UI where performance and presentation both matter."
      : "Saya senang membangun scene interaktif, sistem portfolio yang halus, dan UI produk dimana performa dan presentasi sama-sama penting.",
  }
})

const headlineWords = computed(() => t.value.headline.split(" "))

/* ===== EDIT DI SINI ===== */
const chips = ["Vue", "Nuxt", "TypeScript", "Three.js", "GSAP", "Blender"]

const stats = computed(() => {
  const en = language.value === "en"
  return [
    { value: 5, suffix: "+", label: en ? "Projects shipped" : "Proyek selesai" },
    { value: 3, suffix: "+", label: en ? "Years of code" : "Tahun ngoding" },
    { value: 10, suffix: "+", label: en ? "Tech in the stack" : "Teknologi di stack" },
  ]
})

const TERMINAL_LINES = [
  "$ cat reihan.ts",
  "const reihan = {",
  "  role: 'Frontend Developer',",
  "  focus: ['Vue', 'Nuxt', 'Three.js'],",
  "  passion: ['Game Dev', '3D Art'],",
  "  openToWork: true,",
  "}",
]
/* ======================== */

const display = ref([0, 0, 0])
const typedLines = ref([])
let typeTimer
let ctx

/* spotlight ngikutin mouse */
function onCardMove(e) {
  const el = e.currentTarget
  const r = el.getBoundingClientRect()
  el.style.setProperty("--mx", `${e.clientX - r.left}px`)
  el.style.setProperty("--my", `${e.clientY - r.top}px`)
}

function startTyping() {
  let li = 0

  const typeLine = () => {
    if (li >= TERMINAL_LINES.length) return
    const full = TERMINAL_LINES[li]
    typedLines.value.push("")
    let ci = 0

    const tick = () => {
      ci += 1 + Math.floor(Math.random() * 2) // kecepatan agak acak biar natural
      typedLines.value[li] = full.slice(0, ci)
      if (ci < full.length) {
        typeTimer = setTimeout(tick, 10 + Math.random() * 22)
      } else {
        li++
        typeTimer = setTimeout(typeLine, 110)
      }
    }
    tick()
  }

  typeLine()
}

onMounted(() => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches

  // hormati user yang matiin animasi
  if (reduce) {
    display.value = stats.value.map((s) => s.value)
    typedLines.value = [...TERMINAL_LINES]
    return
  }

  ctx = gsap.context(() => {
    const tl = gsap.timeline({
      defaults: { ease: "power3.out", duration: 0.7 },
      scrollTrigger: { trigger: section.value, start: "top 72%", once: true },
    })

    tl.from(badge.value, { opacity: 0, y: 14, duration: 0.5 })
      .from(".wi", { yPercent: 115, duration: 0.8, stagger: 0.04 }, "-=0.15")
      .from(paras.value.children, { opacity: 0, y: 22, stagger: 0.12, duration: 0.6 }, "-=0.5")
      .from(chipsEl.value.children, { opacity: 0, y: 12, stagger: 0.05, duration: 0.45 }, "-=0.35")
      .from(terminal.value, { opacity: 0, y: 28, duration: 0.7 }, "-=0.3")
      .from(statsEl.value.children, { opacity: 0, y: 22, stagger: 0.09, duration: 0.55 }, "-=0.45")

    // counter angka
    const progress = { v: 0 }
    gsap.to(progress, {
      v: 1,
      duration: 1.6,
      ease: "power2.out",
      scrollTrigger: { trigger: statsEl.value, start: "top 85%", once: true },
      onUpdate() {
        display.value = stats.value.map((s) => Math.round(s.value * progress.v))
      },
    })

    // mulai ngetik pas terminal kelihatan
    ScrollTrigger.create({
      trigger: terminal.value,
      start: "top 80%",
      once: true,
      onEnter: startTyping,
    })
  }, section.value)
})

onUnmounted(() => {
  ctx?.revert()
  clearTimeout(typeTimer)
})
</script>

<style scoped>
.about {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(320px, 0.9fr);
  gap: 56px;
  align-items: center;
  width: min(1080px, calc(100% - 80px));
  margin: 0 auto;
  padding: 110px 0;
  overflow: hidden;
}

/* ===== dekorasi orbit ===== */
.orbits {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.orbits span {
  position: absolute;
  border: 1px dashed var(--border);
  border-radius: 999px;
}

.orbits span:nth-child(1) {
  width: 380px;
  height: 380px;
  top: -120px;
  right: -100px;
  animation: orbit-spin 50s linear infinite;
}

.orbits span:nth-child(2) {
  width: 240px;
  height: 240px;
  top: 30px;
  right: -30px;
  animation: orbit-spin 36s linear infinite reverse;
}

.orbits span:nth-child(3) {
  width: 500px;
  height: 500px;
  bottom: -220px;
  left: -160px;
  animation: orbit-spin 70s linear infinite;
}

/* titik "planet" yang ngorbit di ring */
.orbits span:nth-child(1)::after {
  content: "";
  position: absolute;
  top: 50%;
  left: -3px;
  width: 7px;
  height: 7px;
  border-radius: 999px;
  background: var(--primary);
  box-shadow: 0 0 10px var(--primary);
}

.orbits span:nth-child(2)::after {
  content: "";
  position: absolute;
  top: -3px;
  left: 50%;
  width: 5px;
  height: 5px;
  border-radius: 999px;
  background: #57d39f;
  box-shadow: 0 0 8px #57d39f;
}

@keyframes orbit-spin {
  to { transform: rotate(360deg); }
}

/* ===== copy ===== */
.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  width: fit-content;
  margin: 0 0 18px;
  padding: 8px 14px;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: var(--border-dim);
  color: var(--primary);
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.eyebrow::before {
  content: "";
  width: 7px;
  height: 7px;
  border-radius: 999px;
  background: var(--primary);
  box-shadow: 0 0 10px var(--primary);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  50% { opacity: 0.35; transform: scale(0.75); }
}

h2 {
  margin: 0 0 24px;
  color: var(--text);
  font-size: clamp(1.9rem, 3.4vw, 2.6rem);
  line-height: 1.18;
  font-weight: 900;
  letter-spacing: -0.02em;
}

/* wrapper per kata biar reveal dari bawah, descender gak kepotong */
h2 .w {
  display: inline-block;
  overflow: hidden;
  vertical-align: bottom;
  padding-bottom: 0.14em;
  margin-bottom: -0.14em;
  margin-right: 0.26em;
}

h2 .wi {
  display: inline-block;
  will-change: transform;
}

.paras p {
  margin: 0 0 16px;
  color: var(--text-muted);
  font-size: 1rem;
  line-height: 1.8;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}

.chips span {
  padding: 7px 13px;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: var(--bg-card);
  color: var(--text-muted);
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.02em;
  transition: color 0.2s ease, border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
}

.chips span:hover {
  color: var(--text);
  border-color: var(--primary);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px -8px var(--primary);
}

/* ===== side: terminal + stats ===== */
.side {
  display: grid;
  gap: 14px;
}

.glow-card {
  position: relative;
  overflow: hidden;
}

/* spotlight ngikutin mouse */
.glow-card::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  border-radius: inherit;
  background: radial-gradient(
    220px circle at var(--mx, 50%) var(--my, 50%),
    rgba(74, 144, 226, 0.13),
    transparent 65%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
}

.glow-card:hover::after {
  opacity: 1;
}

.terminal {
  border: 1px solid var(--border);
  border-radius: 14px;
  background: #0b0d13;
  box-shadow: 0 18px 44px rgba(0, 0, 0, 0.35);
}

.terminal-top {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.terminal-top span {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: #e94560;
}

.terminal-top span:nth-child(2) { background: #f0b84c; }
.terminal-top span:nth-child(3) { background: #57d39f; }

.terminal-top em {
  margin-left: auto;
  color: rgba(255, 255, 255, 0.35);
  font-size: 0.68rem;
  font-style: normal;
  font-weight: 700;
}

.terminal-body {
  min-height: 208px;
  padding: 16px 18px 18px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 0.8rem;
  line-height: 1.9;
}

.terminal-body p {
  margin: 0;
  color: #8b9bb0;
  white-space: pre-wrap;
}

.terminal-body p.cmd {
  color: #dce6f2;
}

.caret {
  display: inline-block;
  width: 8px;
  height: 1em;
  margin-left: 3px;
  vertical-align: text-bottom;
  background: var(--primary);
  animation: blink 0.9s steps(1) infinite;
}

@keyframes blink {
  50% { opacity: 0; }
}

.stats {
  display: grid;
  gap: 12px;
}

.stat {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px 20px;
  border: 1px solid var(--border);
  border-radius: 14px;
  background: var(--bg-card);
  transition: transform 0.25s ease;
}

.stat:hover {
  transform: translateY(-3px);
}

.stat strong {
  flex-shrink: 0;
  min-width: 3.2ch;
  font-size: 2.1rem;
  font-weight: 900;
  line-height: 1;
  background: linear-gradient(120deg, var(--text) 20%, var(--primary));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.stat span {
  color: var(--text-muted);
  font-size: 0.85rem;
  font-weight: 700;
  line-height: 1.4;
}

/* ===== responsive ===== */
@media (max-width: 920px) {
  .about {
    grid-template-columns: 1fr;
    width: calc(100% - 40px);
    gap: 44px;
    padding: 72px 0;
  }

  .orbits span:nth-child(3) {
    display: none;
  }
}

@media (max-width: 560px) {
  .about {
    width: calc(100% - 32px);
    padding: 56px 0;
  }

  .orbits span:nth-child(1),
  .orbits span:nth-child(2) {
    width: 260px;
    height: 260px;
    top: -90px;
    right: -110px;
  }

  .terminal-body {
    min-height: 186px;
    font-size: 0.72rem;
  }

  .stat strong {
    font-size: 1.7rem;
  }

  .chips span {
    font-size: 0.7rem;
    padding: 6px 11px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .orbits span { animation: none; }
  .eyebrow::before { animation: none; }
}
</style>