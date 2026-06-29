<template>
  <div class="pro-container">
    <!-- Theme transition overlay with grid pixels -->
    <div ref="themeOverlay" class="theme-overlay">
      <div ref="pixelGrid" class="pixel-grid"></div>
    </div>

    <!-- Desktop Navigation -->
    <nav class="pro-nav desktop-nav" :class="{ scrolled: isScrolled }" aria-label="Portfolio navigation">
      <a href="#hero" :class="{ active: activeSection === 'hero' }">
        {{ language === 'en' ? 'Home' : 'Beranda' }}
      </a>
      <a href="#about" :class="{ active: activeSection === 'about' }">About</a>
      <a href="#projects" :class="{ active: activeSection === 'projects' }">Projects</a>
      <a href="#tech-stack" :class="{ active: activeSection === 'tech-stack' }">Stack</a>
      <a href="#blog" :class="{ active: activeSection === 'blog' }">Blog</a>
      <a href="#friends" :class="{ active: activeSection === 'friends' }">Friends</a>
      <a href="#contact" :class="{ active: activeSection === 'contact' }">Contact</a>
      <button
        class="theme-toggle-btn"
        @click="toggleTheme"
        :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
      >
        {{ isDark ? "☀️" : "🌙" }}
      </button>
      <ClientOnly>
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
    <nav class="mobile-nav" :class="{ scrolled: isScrolled }">
      <button class="burger-btn" @click="toggleMobileMenu" :aria-label="mobileMenuOpen ? 'Close menu' : 'Open menu'">
        <span :class="{ open: mobileMenuOpen }"></span>
        <span :class="{ open: mobileMenuOpen }"></span>
        <span :class="{ open: mobileMenuOpen }"></span>
      </button>

      <div class="mobile-actions">
        <button
          class="theme-toggle-btn"
          @click="toggleTheme"
          :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
        >
          {{ isDark ? "☀️" : "🌙" }}
        </button>
        <ClientOnly>
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
    <ProBlog />
    <ProFriends />
    <ProContact />
    <ProFooter />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from "vue"
import gsap from "gsap"
import ProHero from "./ProHero.vue"
import ProProjects from "./ProProjects.vue"
import ProSkill from "./ProSkill.vue"
import ProAbout from "./ProAbout.vue"
import ProContact from "./ProContact.vue"
import ProTechStack from "./ProTechStack.vue"
import ProBlog from "./ProBlog.vue"
import ProFriends from "./ProFriends.vue"
import ProFooter from "./ProFooter.vue"
import { useLanguage } from "../../composables/useLanguage"

const { language, setLocale } = useLanguage()

// Language change animation
const changingLanguage = ref(false)

function handleLanguageChange(newLocale: "en" | "id") {
  if (changingLanguage.value || language.value === newLocale) return
  
  changingLanguage.value = true
  
  // Get all text elements that need animation
  const textElements = document.querySelectorAll('h1, h2, h3, p, span:not(.lang-btn), a:not(.lang-btn)')
  const elementsToAnimate: HTMLElement[] = []
  
  textElements.forEach((el) => {
    const htmlEl = el as HTMLElement
    // Skip if element is in nav, is a button, or has no text
    if (
      htmlEl.closest('.pro-nav') || 
      htmlEl.tagName === 'BUTTON' ||
      htmlEl.classList.contains('lang-btn') ||
      htmlEl.classList.contains('theme-toggle-btn') ||
      !htmlEl.textContent?.trim()
    ) return
    
    elementsToAnimate.push(htmlEl)
  })
  
  // Timeline for language change
  const tl = gsap.timeline({
    onComplete: () => {
      changingLanguage.value = false
    }
  })
  
  // Shuffle elements for random effect
  const shuffled = [...elementsToAnimate].sort(() => Math.random() - 0.5)
  
  // Animate out current text with stagger
  tl.to(shuffled, {
    opacity: 0,
    y: -10,
    rotationX: -90,
    transformOrigin: 'center bottom',
    duration: 0.3,
    stagger: {
      amount: 0.4,
      from: 'random',
      grid: 'auto',
      ease: 'power1.in'
    },
    ease: 'power2.in'
  })
  
  // Change language at midpoint
  tl.call(() => {
    setLocale(newLocale)
  }, [], 0.25)
  
  // Wait for Vue to update DOM
  tl.add(() => {}, 0.05)
  
  // Animate in new text with stagger
  tl.fromTo(shuffled, {
    opacity: 0,
    y: 10,
    rotationX: 90,
    transformOrigin: 'center top'
  }, {
    opacity: 1,
    y: 0,
    rotationX: 0,
    duration: 0.4,
    stagger: {
      amount: 0.5,
      from: 'random',
      grid: 'auto',
      ease: 'power1.out'
    },
    ease: 'back.out(1.5)'
  }, 0.45)
}

// Debug: watch language changes
watch(language, (newVal) => {
  console.log('👁️ Language changed in ProPortofolio:', newVal)
}, { immediate: true })

const activeSection = ref("hero")
const isScrolled = ref(false)
const mobileMenuOpen = ref(false)

// Theme toggle
const isDark = ref(true)
const themeOverlay = ref<HTMLElement | null>(null)
const pixelGrid = ref<HTMLElement | null>(null)

function toggleMobileMenu() {
  mobileMenuOpen.value = !mobileMenuOpen.value
  // Prevent body scroll when menu is open
  if (mobileMenuOpen.value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

function closeMobileMenu() {
  mobileMenuOpen.value = false
  document.body.style.overflow = ''
}

function toggleTheme() {
  if (!themeOverlay.value || !pixelGrid.value) return
  
  const newTheme = !isDark.value
  const overlay = themeOverlay.value
  const grid = pixelGrid.value
  
  // Set overlay color
  const bgColor = newTheme ? '#0b0b0f' : '#f5f7fb'
  
  // Create grid pixels - responsive size
  const pixelSize = window.innerWidth < 560 ? 80 : window.innerWidth < 920 ? 60 : 50
  const cols = Math.ceil(window.innerWidth / pixelSize) + 1 // +1 untuk safety
  const rows = Math.ceil(window.innerHeight / pixelSize) + 1 // +1 untuk safety
  const totalPixels = cols * rows
  
  // Clear previous pixels
  grid.innerHTML = ''
  
  // Set grid style
  grid.style.gridTemplateColumns = `repeat(${cols}, ${pixelSize}px)`
  grid.style.gridAutoRows = `${pixelSize}px`
  
  // Create pixel elements
  const pixels: HTMLElement[] = []
  for (let i = 0; i < totalPixels; i++) {
    const pixel = document.createElement('div')
    pixel.className = 'pixel'
    pixel.style.background = bgColor
    grid.appendChild(pixel)
    pixels.push(pixel)
  }
  
  // Show overlay
  gsap.set(overlay, { display: 'block' })
  gsap.set(pixels, { scale: 0, opacity: 0 })
  
  // Animate pixels in random order
  const tl = gsap.timeline({
    onComplete: () => {
      gsap.set(overlay, { display: 'none' })
      grid.innerHTML = ''
    }
  })
  
  // Animate in
  tl.to(pixels, {
    scale: 1,
    opacity: 1,
    duration: 0.6,
    stagger: {
      amount: 0.4,
      from: 'random',
      ease: 'power2.inOut'
    },
    ease: 'back.out(1.7)'
  })
  
  // Change theme at midpoint
  tl.call(() => {
    isDark.value = newTheme
    document.documentElement.setAttribute(
      "data-theme",
      newTheme ? "dark" : "light"
    )
    localStorage.setItem(
      "theme",
      newTheme ? "dark" : "light"
    )
  }, [], 0.3)
  
  // Animate out
  tl.to(pixels, {
    scale: 0,
    opacity: 0,
    duration: 0.5,
    stagger: {
      amount: 0.3,
      from: 'random',
      ease: 'power2.inOut'
    },
    ease: 'back.in(1.7)'
  }, 0.7)
}

let observer: IntersectionObserver | null = null

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20
}

onMounted(() => {
  // Load theme
  const saved = localStorage.getItem("theme") || "dark"
  isDark.value = saved === "dark"
  document.documentElement.setAttribute("data-theme", saved)
  
  window.addEventListener("scroll", handleScroll)
  handleScroll()

  const sections = ["hero", "about", "projects", "tech-stack", "blog", "friends", "contact"]
  
  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        activeSection.value = entry.target.id
      }
    })
  }, {
    rootMargin: "-20% 0px -60% 0px"
  })

  sections.forEach((id) => {
    const el = document.getElementById(id)
    if (el) observer?.observe(el)
  })
})

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll)
  observer?.disconnect()
  document.body.style.overflow = '' // Cleanup
})
</script>

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
  background: var(--border);
  color: var(--text);
  box-shadow: inset 0 0 12px var(--border-dim);
  backdrop-filter: blur(4px);
  border: 1px solid var(--border);
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

/* Theme transition overlay */
.theme-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 99999;
  pointer-events: none;
  display: none;
  overflow: hidden;
}

.pixel-grid {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: grid;
  gap: 0;
}

.pixel {
  will-change: transform, opacity;
  transform-origin: center;
  width: 100%;
  height: 100%;
}

footer {
  width: min(1080px, calc(100% - 80px));
  margin: 28px auto 0;
  color: var(--text-dim);
  font-size: 0.85rem;
  font-weight: 700;
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
</style>
