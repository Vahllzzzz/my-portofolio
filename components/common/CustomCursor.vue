<template>
  <div ref="dot" class="cur-dot" aria-hidden="true"></div>
  <div ref="ring" class="cur-ring" aria-hidden="true"></div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, onUnmounted } from "vue"
import gsap from "gsap"

const dot = ref<HTMLElement | null>(null)
const ring = ref<HTMLElement | null>(null)

const HOVER_SEL =
  'a, button, [role="button"], input, textarea, select, .card, .cert-card, .friend-card, .blog-article, .chip'

let cleanup: (() => void) | null = null

onMounted(() => {
  const fine = window.matchMedia("(pointer: fine)").matches
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  if (!fine || reduce) return // touch / reduced-motion: nggak pasang apa-apa

  document.documentElement.classList.add("has-custom-cursor")

  // seatbelt: tunggu DOM siap + JANGAN PERNAH kasih GSAP target null
  nextTick(() => {
    if (!dot.value || !ring.value) return

    gsap.set([dot.value, ring.value], { xPercent: -50, yPercent: -50 })

    const dx = gsap.quickTo(dot.value, "x", { duration: 0.12, ease: "power3.out" })
    const dy = gsap.quickTo(dot.value, "y", { duration: 0.12, ease: "power3.out" })
    const rx = gsap.quickTo(ring.value, "x", { duration: 0.45, ease: "power3.out" })
    const ry = gsap.quickTo(ring.value, "y", { duration: 0.45, ease: "power3.out" })
    const rs = gsap.quickTo(ring.value, "scale", { duration: 0.3, ease: "power3.out" })
    const ds = gsap.quickTo(dot.value, "scale", { duration: 0.3, ease: "power3.out" })

    let shown = false

    const onMove = (e: MouseEvent) => {
      if (!shown) {
        shown = true
        gsap.to([dot.value, ring.value], { opacity: 1, duration: 0.3 })
      }
      dx(e.clientX); dy(e.clientY)
      rx(e.clientX); ry(e.clientY)
    }

    const onOver = (e: MouseEvent) => {
      const hit = (e.target as HTMLElement)?.closest?.(HOVER_SEL)
      rs(hit ? 1.7 : 1)
      ds(hit ? 0.4 : 1)
    }

    const onDown = () => rs(0.85)
    const onUp = () => rs(1)
    const hide = () => gsap.to([dot.value, ring.value], { opacity: 0, duration: 0.2 })
    const show = () => shown && gsap.to([dot.value, ring.value], { opacity: 1, duration: 0.2 })

    window.addEventListener("mousemove", onMove, { passive: true })
    window.addEventListener("mouseover", onOver, { passive: true })
    window.addEventListener("mousedown", onDown)
    window.addEventListener("mouseup", onUp)
    document.documentElement.addEventListener("mouseleave", hide)
    document.documentElement.addEventListener("mouseenter", show)

    cleanup = () => {
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mouseover", onOver)
      window.removeEventListener("mousedown", onDown)
      window.removeEventListener("mouseup", onUp)
      document.documentElement.removeEventListener("mouseleave", hide)
      document.documentElement.removeEventListener("mouseenter", show)
      document.documentElement.classList.remove("has-custom-cursor")
    }
  })
})

onUnmounted(() => cleanup?.())
</script>

<style scoped>
.cur-dot {
  position: fixed;
  top: 0;
  left: 0;
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: var(--primary, #00c853);
  box-shadow: 0 0 10px var(--primary, #00c853);
  z-index: 1000000;
  pointer-events: none;
  opacity: 0;
}

.cur-ring {
  position: fixed;
  top: 0;
  left: 0;
  width: 34px;
  height: 34px;
  border: 1.5px solid color-mix(in srgb, var(--primary, #00c853) 70%, transparent);
  border-radius: 999px;
  z-index: 1000000;
  pointer-events: none;
  opacity: 0;
}
</style>