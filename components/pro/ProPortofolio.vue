<template>
  <div class="pro-container">
    <Preloader />
    <CustomCursor />

    <!-- scroll progress -->
    <div class="scroll-progress" aria-hidden="true">
      <i ref="progressBar"></i>
    </div>

    <!-- Desktop Navigation -->
    <nav
      ref="navEl"
      class="pro-nav desktop-nav"
      :class="{ scrolled: isScrolled, 'nav-hidden': navHidden }"
      aria-label="Portfolio navigation"
      @focusin="navHidden = false"
    >
      <a href="#hero" :class="{ active: activeSection === 'hero' }">
        {{ language === 'en' ? 'Home' : 'Beranda' }}
      </a>
      <a href="#about" :class="{ active: activeSection === 'about' }">About</a>
      <a href="#projects" :class="{ active: activeSection === 'projects' }">Projects</a>
      <a href="#tech-stack" :class="{ active: activeSection === 'tech-stack' }">Stack</a>
      <a href="#certificates" :class="{ active: activeSection === 'certificates' }">
        {{ language === 'en' ? 'Certificates' : 'Sertifikat' }}
      </a>
      <a href="#blog" :class="{ active: activeSection === 'blog' }">Blog</a>
      <a href="#friends" :class="{ active: activeSection === 'friends' }">Friends</a>
      <a href="#contact" :class="{ active: activeSection === 'contact' }">Contact</a>

      <span ref="pillEl" class="nav-pill" aria-hidden="true"></span>

      <ClientOnly>
        <ThemeToggle />
        <button
          @click="handleLanguageChange('id')"
          :class="{ active: language === 'id' }"
          class="lang-btn"
          title="Switch to Indonesian"
          :disabled="changingLanguage"
        >
          ID
        </button>
        <button
          @click="handleLanguageChange('en')"
          :class="{ active: language === 'en' }"
          class="lang-btn"
          title="Switch to English"
          :disabled="changingLanguage"
        >
          EN
        </button>
      </ClientOnly>
    </nav>

    <!-- Mobile Navigation -->
    <nav class="mobile-nav" :class="{ scrolled: isScrolled, 'nav-hidden': navHidden }">
      <button class="burger-btn" @click="toggleMobileMenu" :aria-label="mobileMenuOpen ? 'Close menu' : 'Open menu'">
        <span :class="{ open: mobileMenuOpen }"></span>
        <span :class="{ open: mobileMenuOpen }"></span>
        <span :class="{ open: mobileMenuOpen }"></span>
      </button>

      <div class="mobile-actions">
        <ClientOnly>
          <ThemeToggle />
          <button
            @click="handleLanguageChange('id')"
            :class="{ active: language === 'id' }"
            class="lang-btn"
            :disabled="changingLanguage"
          >
            ID
          </button>
          <button
            @click="handleLanguageChange('en')"
            :class="{ active: language === 'en' }"
            class="lang-btn"
            :disabled="changingLanguage"
          >
            EN
          </button>
        </ClientOnly>
      </div>
    </nav>

    <!-- Mobile Menu Overlay -->
    <Transition name="menu">
      <div v-if="mobileMenuOpen" class="mobile-menu-overlay" @click="closeMobileMenu">
        <div class="mobile-menu" @click.stop>
          <a href="#hero" :class="{ active: activeSection === 'hero' }" @click="closeMobileMenu">
            {{ language === 'en' ? 'Home' : 'Beranda' }}
          </a>
          <a href="#about" :class="{ active: activeSection === 'about' }" @click="closeMobileMenu">About</a>
          <a href="#projects" :class="{ active: activeSection === 'projects' }" @click="closeMobileMenu">Projects</a>
          <a href="#tech-stack" :class="{ active: activeSection === 'tech-stack' }" @click="closeMobileMenu">Stack</a>
          <a href="#certificates" :class="{ active: activeSection === 'certificates' }" @click="closeMobileMenu">
            {{ language === 'en' ? 'Certificates' : 'Sertifikat' }}
          </a>
          <a href="#blog" :class="{ active: activeSection === 'blog' }" @click="closeMobileMenu">Blog</a>
          <a href="#friends" :class="{ active: activeSection === 'friends' }" @click="closeMobileMenu">Friends</a>
          <a href="#contact" :class="{ active: activeSection === 'contact' }" @click="closeMobileMenu">Contact</a>
        </div>
      </div>
    </Transition>

    <ProHero />
    <ProAbout />
    <ProSkill />
    <ProProjects />
    <ProTechStack />
    <ProCertificates />
    <ProBlog />
    <ProFriends />
    <ProContact />
    <ProFooter />
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, watch } from "vue"
import gsap from "gsap"
import ProHero from "./ProHero.vue"
import ProProjects from "./ProProjects.vue"
import ProSkill from "./ProSkill.vue"
import ProAbout from "./ProAbout.vue"
import ProContact from "./ProContact.vue"
import ProTechStack from "./ProTechStack.vue"
import ProCertificates from "./ProCertificates.vue"
import ProBlog from "./ProBlog.vue"
import ProFriends from "./ProFriends.vue"
import ProFooter from "./ProFooter.vue"
import Preloader from "../common/Preloader.vue"
import ThemeToggle from "../common/ThemeToggle.vue"
import CustomCursor from "../common/CustomCursor.vue"
import { useLanguage } from "../../composables/useLanguage"

const { language, setLocale } = useLanguage()

/* ---------- language switch (hardened) ---------- */
const changingLanguage = ref(false)

const ANIM_SKIP =
  '.pro-nav, .mobile-nav, .mobile-menu, .preloader, .solar-system, .canvas-container, .switcher, .theme-overlay, .scroll-progress, [aria-hidden="true"]'

function collectTextElements(): HTMLElement[] {
  const taken = new Set<HTMLElement>()
  const out: HTMLElement[] = []

  document
    .querySelectorAll("h1, h2, h3, h4, p, span, a, li, strong, em, small, time")
    .forEach((node) => {
      const el = node as HTMLElement
      if (el.tagName === "BUTTON") return
      if (el.closest(ANIM_SKIP)) return
      if (!el.textContent?.trim()) return

      // skip kalau ancestor-nya udah keambil (hindari dobel animasi)
      let p = el.parentElement
      let covered = false
      while (p) {
        if (taken.has(p)) { covered = true; break }
        p = p.parentElement
      }
      if (covered) return

      taken.add(el)
      out.push(el)
    })

  return out
}

async function handleLanguageChange(newLocale: "en" | "id") {
  if (changingLanguage.value || language.value === newLocale) return
  changingLanguage.value = true

  const els = collectTextElements()

  if (!els.length || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    setLocale(newLocale)
    changingLanguage.value = false
    return
  }

  // keluar
  await gsap.to(els, {
    opacity: 0,
    y: -10,
    duration: 0.28,
    stagger: { amount: 0.35, from: "random" },
    ease: "power2.in",
  })

  // ganti bahasa + tunggu Vue selesai re-render
  setLocale(newLocale)
  await nextTick()
  movePill(true) // lebar label bisa berubah

  // masuk
  await gsap.fromTo(
    els,
    { opacity: 0, y: 12 },
    {
      opacity: 1,
      y: 0,
      duration: 0.4,
      stagger: { amount: 0.45, from: "random" },
      ease: "back.out(1.4)",
      clearProps: "opacity,transform",
    }
  )

  changingLanguage.value = false
}

/* ---------- nav / scroll ---------- */
const activeSection = ref("hero")
const isScrolled = ref(false)
const navHidden = ref(false)
const mobileMenuOpen = ref(false)

const navEl = ref<HTMLElement | null>(null)
const pillEl = ref<HTMLElement | null>(null)
const progressBar = ref<HTMLElement | null>(null)

const NAV_SECTIONS = ["hero", "about", "projects", "tech-stack", "certificates", "blog", "friends", "contact"]

let lastY = 0
let scrollTicking = false
let observer: IntersectionObserver | null = null

function onScrollFrame() {
  const y = window.scrollY
  isScrolled.value = y > 20

  const max = document.documentElement.scrollHeight - window.innerHeight
  if (progressBar.value) {
    progressBar.value.style.transform = `scaleX(${max > 0 ? y / max : 0})`
  }

  const dy = y - lastY
  if (!mobileMenuOpen.value && y > 140) {
    if (dy > 6 && !navHidden.value) navHidden.value = true
    else if (dy < -6 && navHidden.value) navHidden.value = false
  } else if (navHidden.value) {
    navHidden.value = false
  }

  lastY = y
  scrollTicking = false
}

function onScroll() {
  if (scrollTicking) return
  scrollTicking = true
  requestAnimationFrame(onScrollFrame)
}

/* underline indicator yang menggeliding */
function movePill(instant = false) {
  const nav = navEl.value
  const pill = pillEl.value
  if (!nav || !pill) return

  const active = nav.querySelector("a.active") as HTMLElement | null
  if (!active) {
    gsap.to(pill, { opacity: 0, duration: 0.2 })
    return
  }

  gsap.to(pill, {
    x: active.offsetLeft,
    width: active.offsetWidth,
    opacity: 1,
    duration: instant ? 0 : 0.5,
    ease: "power3.out",
  })
}

/* ---------- mobile menu ---------- */
function toggleMobileMenu() {
  mobileMenuOpen.value = !mobileMenuOpen.value
  navHidden.value = false
  document.body.style.overflow = mobileMenuOpen.value ? "hidden" : ""

  if (mobileMenuOpen.value) {
    nextTick(() => {
      gsap.fromTo(
        ".mobile-menu a",
        { opacity: 0, x: -16 },
        { opacity: 1, x: 0, duration: 0.35, stagger: 0.05, delay: 0.05, ease: "power3.out", clearProps: "all" }
      )
    })
  }
}

watch(activeSection, () => nextTick(() => movePill()))

function closeMobileMenu() {
  mobileMenuOpen.value = false
  document.body.style.overflow = ""
}

function onKey(e: KeyboardEvent) {
  if (e.key === "Escape" && mobileMenuOpen.value) closeMobileMenu()
}

const onResize = () => movePill(true)

onMounted(() => {
  window.addEventListener("scroll", onScroll, { passive: true })
  window.addEventListener("keydown", onKey)
  window.addEventListener("resize", onResize)
  onScroll()

  requestAnimationFrame(() => movePill(true))
  ;(document as any).fonts?.ready?.then(() => movePill(true))

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) activeSection.value = entry.target.id
      })
    },
    { rootMargin: "-20% 0px -60% 0px" }
  )

  NAV_SECTIONS.forEach((id) => {
    const el = document.getElementById(id)
    if (el) observer?.observe(el)
  })
})

/* label berubah pas ganti bahasa → ukur ulang pill */
watch(language, () => nextTick(() => movePill(true)))

onUnmounted(() => {
  window.removeEventListener("scroll", onScroll)
  window.removeEventListener("keydown", onKey)
  window.removeEventListener("resize", onResize)
  observer?.disconnect()
  document.body.style.overflow = ""
})
</script>f

<style scoped>
.pro-container {
  scroll-behavior: smooth;
  background: var(--bg);
  color: var(--text);
  min-height: 100vh;
  font-family: Inter, sans-serif;
  overflow-x: hidden;
  padding-bottom: 34px;
  
  /* Hide scrollbar for all browsers */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

.pro-container::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

.pro-nav {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 100;
  display: flex;
  align-items: center;
  max-width: calc(100vw - 260px);
  gap: 4px;
  overflow-x: auto;
  padding: 4px;
  border: 1px solid var(--border-dim);
  border-radius: 8px;
  background: var(--glass-bg-clear);
  box-shadow: none;
  backdrop-filter: blur(2px);
  transition: background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease, backdrop-filter 0.3s ease;
}

.mobile-nav {
  display: none;
}

.pro-nav.scrolled {
  border-color: var(--border);
  background: var(--glass-bg);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.28);
  backdrop-filter: blur(14px);
}

.pro-nav a {
  display: inline-flex;
  align-items: center;
  min-height: 34px;
  padding: 0 12px;
  border-radius: 6px;
  color: var(--text-muted);
  font-size: 0.8rem;
  font-weight: 800;
  text-decoration: none;
  white-space: nowrap;
  transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease;
}

.pro-nav a:hover {
  background: var(--border-dim);
  color: var(--text);
}

.pro-nav a.active {
  color: var(--text);
  box-shadow: inset 0 0 12px var(--border-dim);
  backdrop-filter: blur(4px);
}

.lang-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 34px;
  min-width: 42px;
  padding: 0 10px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: transparent;
  color: var(--text-muted);
  font-size: 0.75rem;
  font-weight: 800;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease, border-color 0.2s ease;
  pointer-events: auto;
  position: relative;
  z-index: 10;
}

.lang-btn:hover {
  background: var(--border-dim);
  color: var(--text);
}

.lang-btn.active {
  background: var(--primary);
  color: #ffffff;
  border-color: var(--primary);
}

.lang-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.lang-btn:disabled:hover {
  transform: none;
  background: var(--border-dim);
}

.theme-toggle-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 34px;
  min-width: 42px;
  padding: 0 10px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--border-dim);
  color: var(--text);
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.2s ease, border-color 0.2s ease;
}

.theme-toggle-btn:hover {
  background: var(--border);
  border-color: var(--primary);
  transform: translateY(-2px);
}

@media (max-width: 920px) {
  .desktop-nav {
    display: none;
  }

  .mobile-nav {
    position: fixed;
    top: 10px;
    left: 10px;
    right: 10px;
    z-index: 100;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 8px;
    border: 1px solid var(--border-dim);
    border-radius: 8px;
    background: var(--glass-bg-clear);
    backdrop-filter: blur(2px);
    transition: background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease, backdrop-filter 0.3s ease;
  }

  .mobile-nav.scrolled {
    border-color: var(--border);
    background: var(--glass-bg);
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.28);
    backdrop-filter: blur(14px);
  }

  .mobile-actions {
    display: flex;
    gap: 4px;
    align-items: center;
  }

  .burger-btn {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 4px;
    min-width: 36px;
    min-height: 36px;
    padding: 8px;
    border: 1px solid var(--border);
    border-radius: 6px;
    background: var(--border-dim);
    cursor: pointer;
    transition: transform 0.3s ease, background 0.2s ease;
  }

  .burger-btn:hover {
    background: var(--border);
  }

  .burger-btn:active {
    transform: scale(0.95);
  }

  .burger-btn span {
    display: block;
    width: 18px;
    height: 2px;
    background: var(--text);
    border-radius: 2px;
    transition: all 0.3s ease;
  }

  .burger-btn span.open:nth-child(1) {
    transform: translateY(6px) rotate(45deg);
  }

  .burger-btn span.open:nth-child(2) {
    opacity: 0;
  }

  .burger-btn span.open:nth-child(3) {
    transform: translateY(-6px) rotate(-45deg);
  }

  .mobile-menu-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 99;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
  }

  .mobile-menu {
    position: absolute;
    top: 70px;
    left: 10px;
    right: 10px;
    padding: 12px;
    border: 1px solid var(--border);
    border-radius: 12px;
    background: var(--bg-card);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .mobile-menu a {
    display: flex;
    align-items: center;
    min-height: 48px;
    padding: 0 16px;
    border-radius: 8px;
    color: var(--text);
    font-size: 1rem;
    font-weight: 700;
    text-decoration: none;
    transition: background 0.2s ease, color 0.2s ease;
  }

  .mobile-menu a:active {
    transform: scale(0.98);
  }

  .mobile-menu a.active {
    background: var(--primary);
    color: #ffffff;
  }

  .mobile-menu a:not(.active):hover {
    background: var(--border-dim);
  }

  .mobile-actions .lang-btn,
  .mobile-actions .theme-toggle-btn {
    min-height: 36px;
    min-width: 36px;
    padding: 0 8px;
    font-size: 0.75rem;
  }

  /* Menu transitions */
  .menu-enter-active,
  .menu-leave-active {
    transition: opacity 0.3s ease;
  }

  .menu-enter-active .mobile-menu,
  .menu-leave-active .mobile-menu {
    transition: transform 0.3s ease, opacity 0.3s ease;
  }

  .menu-enter-from,
  .menu-leave-to {
    opacity: 0;
  }

  .menu-enter-from .mobile-menu {
    transform: translateY(-20px);
    opacity: 0;
  }

  .menu-leave-to .mobile-menu {
    transform: translateY(-20px);
    opacity: 0;
  }
}

@media (max-width: 560px) {
  .mobile-nav {
    padding: 6px 6px;
  }

  .mobile-actions {
    gap: 4px;
  }

  .mobile-actions .lang-btn,
  .mobile-actions .theme-toggle-btn {
    min-height: 32px;
    min-width: 32px;
    padding: 0 6px;
    font-size: 0.7rem;
  }

  .burger-btn {
    min-width: 32px;
    min-height: 32px;
    padding: 6px;
  }

  .burger-btn span {
    width: 16px;
  }

  .mobile-menu {
    top: 60px;
  }

  .mobile-menu a {
    min-height: 44px;
    font-size: 0.95rem;
  }
}
/* ===== scroll progress ===== */
.scroll-progress {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 2.5px;
  z-index: 200;
  pointer-events: none;
}

.scroll-progress i {
  display: block;
  height: 100%;
  transform: scaleX(0);
  transform-origin: left;
  background: linear-gradient(90deg, var(--primary), #4a90e2);
  box-shadow: 0 0 12px rgba(0, 200, 83, 0.5);
}

/* ===== underline nav ===== */
.nav-pill {
  position: absolute;
  bottom: 1px;
  left: 0;
  width: 0;
  height: 2px;
  border-radius: 999px;
  background: var(--primary);
  box-shadow: 0 0 10px var(--primary);
  opacity: 0;
  pointer-events: none;
}

/* ===== auto-hide nav (override transition, taruh di bawah biar menang) ===== */
.pro-nav,
.mobile-nav {
  transition: background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease,
    backdrop-filter 0.3s ease, transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
}

.nav-hidden {
  transform: translateY(calc(-100% - 32px));
}
</style>
<style>
/* anchor gak kependem di bawah nav fixed */
section[id] {
  scroll-margin-top: 96px;
}

/* custom cursor aktif → native cursor disembunyiin */
html.has-custom-cursor,
html.has-custom-cursor * {
  cursor: none !important;
}
</style>
