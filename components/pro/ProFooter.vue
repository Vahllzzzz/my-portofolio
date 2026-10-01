<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-brand">
        <h3 ref="logo" class="logo" :title="language === 'en' ? 'click me' : 'klik aku'" @click="flipLogo">
          Vahllzzzz<span>.</span>
        </h3>
        <p class="tagline">{{ t.tagline }}</p>
        <p class="status"><i aria-hidden="true"></i>{{ t.status }}</p>
      </div>

      <nav class="footer-col" :aria-label="t.nav">
        <h4>{{ t.nav }}</h4>
        <a v-for="l in navLinks" :key="l.href" :href="l.href">
          {{ l.label }}<i aria-hidden="true">→</i>
        </a>
      </nav>

      <div class="footer-col">
        <h4>{{ t.social }}</h4>
        <a
          v-for="s in socials"
          :key="s.href"
          :href="s.href"
          :target="s.ext ? '_blank' : undefined"
          :rel="s.ext ? 'noopener' : undefined"
        >
          <svg v-if="s.icon === 'gh'" viewBox="0 0 16 16" width="15" height="15" fill="currentColor" aria-hidden="true">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"/>
          </svg>
          <svg v-else-if="s.icon === 'in'" viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true">
            <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z"/>
          </svg>
          <svg v-else viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
            <rect x="3" y="5" width="18" height="14" rx="2"/>
            <path d="m3 7 9 6 9-6"/>
          </svg>
          {{ s.label }}<i aria-hidden="true">→</i>
        </a>
      </div>
    </div>

    <div class="footer-bottom">
      <p>© {{ year }} Vahllzzzz — {{ t.built }}</p>
      <p class="made">{{ t.made }}</p>
    </div>

    <!-- back to top dengan ring progress -->
    <Transition name="pop">
      <button v-if="showTop" class="to-top" :aria-label="t.top" @click="toTop">
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <circle class="track" cx="24" cy="24" r="20" />
          <circle
            class="fill"
            cx="24"
            cy="24"
            r="20"
            :stroke-dasharray="RING"
            :stroke-dashoffset="dash"
          />
        </svg>
        <span aria-hidden="true">↑</span>
      </button>
    </Transition>
  </footer>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue"
import gsap from "gsap"
import { useLanguage } from "../../composables/useLanguage"

const { language } = useLanguage()
const logo = ref()

const year = new Date().getFullYear()

const t = computed(() => {
  const en = language.value === "en"
  return {
    tagline: "Frontend Developer • 3D Artist • Beginner Game Developer",
    status: en ? "Open to opportunities" : "Terbuka untuk peluang",
    nav: en ? "Navigate" : "Navigasi",
    social: en ? "Elsewhere" : "Tempat lain",
    built: en ? "Built with Nuxt & Three.js." : "Dibangun dengan Nuxt & Three.js.",
    made: en ? "Designed & coded by hand, no templates." : "Dirancang & dikoding manual, tanpa template.",
    top: en ? "Back to top" : "Kembali ke atas",
  }
})

const navLinks = [
  { href: "#about", label: "About" },
  { href: "#projects", label: "Projects" },
  { href: "#blog", label: "Blog" },
  { href: "#contact", label: "Contact" },
]

const socials = [
  { href: "https://github.com/Vahllzzzz", label: "GitHub", icon: "gh", ext: true },
  { href: "https://www.linkedin.com/in/reihan-azka-vahlepy", label: "LinkedIn", icon: "in", ext: true },
  { href: "mailto:hannvahll09@gmail.com", label: "Email", icon: "mail", ext: false },
]

/* ===== easter egg: flip logo ===== */
function flipLogo(e) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
  gsap.fromTo(e.currentTarget, { rotateX: 0 }, { rotateX: 360, duration: 0.8, ease: "power3.inOut" })
}

/* ===== back to top + progress ring ===== */
const RING = 2 * Math.PI * 20
const dash = ref(RING)
const showTop = ref(false)

function onScroll() {
  showTop.value = window.scrollY > 400
  const max = document.documentElement.scrollHeight - window.innerHeight
  const p = max > 0 ? window.scrollY / max : 0
  dash.value = RING * (1 - p)
}

function toTop() {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" })
}

onMounted(() => {
  window.addEventListener("scroll", onScroll, { passive: true })
  onScroll()
})

onUnmounted(() => {
  window.removeEventListener("scroll", onScroll)
})
</script>

<style scoped>
.footer {
  margin-top: 120px;
  padding: 60px 40px 30px;
  border-top: 1px solid var(--border);
  background: var(--bg-card);
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr;
  gap: 40px;
}

/* brand */
.logo {
  display: inline-block;
  margin: 0;
  color: var(--text);
  font-size: 1.4rem;
  font-weight: 900;
  letter-spacing: -0.02em;
  cursor: pointer;
  user-select: none;
}

.logo span {
  color: var(--primary);
}

.tagline {
  margin: 12px 0 0;
  max-width: 340px;
  color: var(--text-muted);
  line-height: 1.7;
  font-size: 0.92rem;
}

.status {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin: 16px 0 0;
  color: var(--text-muted);
  font-size: 0.78rem;
  font-weight: 800;
}

.status i {
  width: 7px;
  height: 7px;
  border-radius: 999px;
  background: #3ddc84;
  box-shadow: 0 0 8px #3ddc84;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  50% { opacity: 0.35; transform: scale(0.75); }
}

/* kolom link */
.footer-col {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.footer-col h4 {
  margin: 0 0 12px;
  color: var(--text-dim);
  font-size: 0.72rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.footer-col a {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  min-height: 36px;
  width: fit-content;
  color: var(--text-muted);
  font-size: 0.92rem;
  font-weight: 700;
  text-decoration: none;
  transition: color 0.25s ease;
}

.footer-col a i {
  font-style: normal;
  font-size: 0.85rem;
  opacity: 0;
  transform: translateX(-6px);
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.footer-col a:hover {
  color: var(--primary);
}

.footer-col a:hover i {
  opacity: 1;
  transform: none;
}

/* bottom */
.footer-bottom {
  max-width: 1200px;
  margin: 40px auto 0;
  padding-top: 24px;
  border-top: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  color: var(--text-muted);
  font-size: 0.85rem;
}

.made {
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 0.75rem;
  opacity: 0.7;
}

/* ===== back to top ===== */
.to-top {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 400;
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  padding: 0;
  border: none;
  border-radius: 999px;
  background: var(--bg-surface);
  color: var(--text);
  cursor: pointer;
  box-shadow: 0 14px 34px rgba(0, 0, 0, 0.35);
  transition: transform 0.2s ease;
}

.to-top:hover { transform: translateY(-3px); }

.to-top svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.to-top .track {
  fill: none;
  stroke: var(--border);
  stroke-width: 2.5;
}

.to-top .fill {
  fill: none;
  stroke: var(--primary);
  stroke-width: 2.5;
  stroke-linecap: round;
  transition: stroke-dashoffset 0.1s linear;
}

.to-top span {
  position: relative;
  font-size: 1rem;
  font-weight: 900;
}

.pop-enter-active,
.pop-leave-active { transition: opacity 0.25s ease, transform 0.25s ease; }
.pop-enter-from,
.pop-leave-to { opacity: 0; transform: translateY(12px); }

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
  .footer {
    padding: 50px 20px 24px;
    margin-top: 80px;
  }

  .footer-content {
    grid-template-columns: 1fr;
    gap: 32px;
  }

  .footer-bottom {
    flex-direction: column;
    text-align: center;
    margin-top: 32px;
  }
}

@media (max-width: 560px) {
  .footer {
    padding: 40px 16px 20px;
    margin-top: 60px;
  }

  .logo { font-size: 1.2rem; }
  .to-top { right: 16px; bottom: 16px; width: 44px; height: 44px; }
}

@media (prefers-reduced-motion: reduce) {
  .status i { animation: none; }
}
</style>