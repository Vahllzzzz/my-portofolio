<template>
  <section id="contact" ref="section" class="contact">
    <!-- dekorasi orbit -->
    <div class="orbits" aria-hidden="true"><span></span><span></span></div>

    <div class="contact-copy">
      <p class="status">
        <i aria-hidden="true"></i>{{ t.available }}
      </p>

      <h2>{{ t.title }}</h2>
      <span class="sub">{{ t.sub }}</span>

      <!-- email + copy -->
      <div class="email-row">
        <code>www.hannvahll09@gmail.com</code>
        <button class="copy-btn" :class="{ done: copied }" @click="copyEmail">
          {{ copied ? t.copied : t.copy }}
        </button>
      </div>

      <!-- jam lokal live (WIB) -->
      <p v-if="time" class="local">
        {{ t.local }} <strong>{{ time }}</strong>
      </p>
    </div>

    <div ref="linksEl" class="links">
      <a
        v-for="l in links"
        :key="l.href"
        :href="l.href"
        :target="l.ext ? '_blank' : undefined"
        :rel="l.ext ? 'noopener' : undefined"
        class="link-row"
        @mousemove="onMagnet"
        @mouseleave="resetMagnet"
      >
        <span class="lk">
          <strong>{{ l.label }}</strong>
          <small>{{ l.hint }}</small>
        </span>
        <span class="arr" aria-hidden="true">→</span>
      </a>
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
const linksEl = ref()

const EMAIL = "www.hannvahll09@gmail.com"

const t = computed(() => {
  const en = language.value === "en"
  return {
    available: en ? "Available for work" : "Terbuka untuk kerja",
    title: en ? "Let's build something great together." : "Mari membangun sesuatu yang luar biasa bersama.",
    sub: en
      ? "Freelance projects, collaborations, and full-time opportunities — my inbox is open."
      : "Proyek freelance, kolaborasi, dan kesempatan full-time — inbox saya terbuka.",
    copy: en ? "Copy" : "Salin",
    copied: en ? "Copied ✓" : "Tersalin ✓",
    local: en ? "My local time (WIB)" : "Waktu lokal saya (WIB)",
  }
})

const links = computed(() => {
  const en = language.value === "en"
  return [
    {
      href: `mailto:${EMAIL}`,
      ext: false,
      label: en ? "Email Me" : "Email Saya",
      hint: en ? "Fastest response" : "Respons tercepat",
    },
    {
      href: "https://www.linkedin.com/in/reihan-azka-vahlepy",
      ext: true,
      label: "LinkedIn",
      hint: en ? "Professional profile" : "Profil profesional",
    },
    {
      href: "https://github.com/Vahllzzzz",
      ext: true,
      label: "GitHub",
      hint: en ? "Code & projects" : "Kode & proyek",
    },
  ]
})

/* ===== copy email ===== */
const copied = ref(false)
let copiedTimer

async function copyEmail() {
  try {
    await navigator.clipboard.writeText(EMAIL)
  } catch {
    const ta = document.createElement("textarea")
    ta.value = EMAIL
    ta.style.position = "fixed"
    ta.style.opacity = "0"
    document.body.appendChild(ta)
    ta.select()
    document.execCommand("copy")
    ta.remove()
  }
  copied.value = true
  clearTimeout(copiedTimer)
  copiedTimer = setTimeout(() => (copied.value = false), 1800)
}

/* ===== jam lokal WIB ===== */
const time = ref("")
let timeTimer

function tick() {
  time.value = new Intl.DateTimeFormat(language.value === "en" ? "en-US" : "id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Jakarta",
  }).format(new Date())
}

/* ===== magnetik ===== */
function onMagnet(e) {
  const el = e.currentTarget
  const r = el.getBoundingClientRect()
  el.style.setProperty("--tx", `${(e.clientX - r.left - r.width / 2) * 0.12}px`)
  el.style.setProperty("--ty", `${(e.clientY - r.top - r.height / 2) * 0.2}px`)
}

function resetMagnet(e) {
  e.currentTarget.style.setProperty("--tx", "0px")
  e.currentTarget.style.setProperty("--ty", "0px")
}

let ctx

onMounted(() => {
  tick()
  timeTimer = setInterval(tick, 30_000)

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  if (reduce) return

  ctx = gsap.context(() => {
    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
      scrollTrigger: { trigger: section.value, start: "top 82%", once: true },
    })

    tl.from(".contact-copy > *", { opacity: 0, y: 24, stagger: 0.1, duration: 0.6 })
      .from(".link-row", { opacity: 0, x: 26, stagger: 0.1, duration: 0.55 }, "-=0.35")
  }, section.value)
})

onUnmounted(() => {
  ctx?.revert()
  clearInterval(timeTimer)
  clearTimeout(copiedTimer)
})
</script>

<style scoped>
.contact {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(300px, 0.85fr);
  gap: 40px;
  align-items: center;
  width: min(1080px, calc(100% - 80px));
  margin: 0 auto;
  padding: 52px;
  border: 1px solid var(--border);
  border-radius: 20px;
  background: var(--bg-card);
  overflow: hidden;
}

/* dekorasi orbit */
.orbits {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.orbits span {
  position: absolute;
  border: 1px dashed var(--border);
  border-radius: 999px;
  animation: orbit-spin 60s linear infinite;
}

.orbits span:nth-child(1) {
  width: 340px;
  height: 340px;
  top: -160px;
  right: -110px;
}

.orbits span:nth-child(2) {
  width: 210px;
  height: 210px;
  top: -90px;
  right: -40px;
  animation-direction: reverse;
  animation-duration: 40s;
}

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

@keyframes orbit-spin {
  to { transform: rotate(360deg); }
}

/* ===== COPY ===== */
.status {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  width: fit-content;
  margin: 0 0 20px;
  padding: 8px 14px;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: var(--border-dim);
  color: var(--text-muted);
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.status i {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: #3ddc84;
  box-shadow: 0 0 10px #3ddc84;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  50% { opacity: 0.35; transform: scale(0.75); }
}

h2 {
  max-width: 560px;
  margin: 0;
  color: var(--text);
  font-size: clamp(1.8rem, 3.2vw, 2.4rem);
  line-height: 1.15;
  font-weight: 900;
  letter-spacing: -0.02em;
}

.sub {
  display: block;
  max-width: 520px;
  margin-top: 14px;
  color: var(--text-muted);
  line-height: 1.7;
}

/* email row */
.email-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin-top: 26px;
}

.email-row code {
  padding: 12px 16px;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: var(--bg-surface);
  color: var(--text);
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 0.88rem;
  font-weight: 700;
}

.copy-btn {
  padding: 12px 16px;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: var(--border-dim);
  color: var(--text);
  font-size: 0.82rem;
  font-weight: 800;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
}

.copy-btn:hover {
  border-color: var(--primary);
  transform: translateY(-2px);
}

.copy-btn.done {
  background: rgba(61, 220, 132, 0.14);
  border-color: #3ddc84;
  color: #3ddc84;
}

.local {
  margin: 16px 0 0;
  color: var(--text-muted);
  font-size: 0.85rem;
  font-weight: 700;
}

.local strong {
  color: var(--primary);
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-weight: 800;
}

/* ===== LINKS ===== */
.links {
  position: relative;
  z-index: 1;
  display: grid;
  gap: 10px;
}

.link-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 16px 18px;
  border: 1px solid var(--border);
  border-radius: 14px;
  background: var(--bg-surface);
  color: var(--text);
  text-decoration: none;
  transform: translate(var(--tx, 0px), var(--ty, 0px));
  transition: transform 0.18s ease, border-color 0.25s ease, background 0.25s ease, box-shadow 0.25s ease;
}

.link-row:hover {
  border-color: var(--primary);
  background: color-mix(in srgb, var(--primary) 7%, var(--bg-surface));
  box-shadow: 0 14px 34px -14px var(--primary);
}

.lk strong {
  display: block;
  font-size: 1rem;
  font-weight: 800;
}

.lk small {
  display: block;
  margin-top: 3px;
  color: var(--text-muted);
  font-size: 0.78rem;
  font-weight: 700;
}

.arr {
  flex-shrink: 0;
  color: var(--text-muted);
  font-size: 1.1rem;
  transition: transform 0.25s ease, color 0.25s ease;
}

.link-row:hover .arr {
  color: var(--primary);
  transform: translateX(5px);
}

/* ===== RESPONSIVE ===== */
@media (max-width: 860px) {
  .contact {
    grid-template-columns: 1fr;
    width: calc(100% - 48px);
    padding: 32px;
    gap: 28px;
  }
}

@media (max-width: 560px) {
  .contact {
    width: calc(100% - 32px);
    padding: 24px;
  }

  .email-row code { flex: 1; }
  .copy-btn { width: 100%; }

  .link-row { padding: 14px 16px; }
}

@media (prefers-reduced-motion: reduce) {
  .orbits span,
  .status i { animation: none; }
}
</style>