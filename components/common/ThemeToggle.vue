<template>
  <button
    class="theme-toggle"
    :class="{ dark: isDark }"
    :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
    :disabled="running"
    @click="toggleTheme"
  >
    <span class="icon-wrap" aria-hidden="true">
      <svg class="icon sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <circle cx="12" cy="12" r="4.2" fill="currentColor" stroke="none" />
        <path d="M12 2.8v2M12 19.2v2M2.8 12h2M19.2 12h2M5.2 5.2l1.4 1.4M17.4 17.4l1.4 1.4M18.8 5.2l-1.4 1.4M6.6 17.4l-1.4 1.4" />
      </svg>
      <svg class="icon moon" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.8 13.6A8.4 8.4 0 0 1 10.4 3.2a8.4 8.4 0 1 0 10.4 10.4Z" />
      </svg>
    </span>

    <Teleport to="body">
      <!-- SELALU dirender (pelajaran dari _gsap), display dikontrol manual -->
      <div ref="overlay" class="pixel-overlay" aria-hidden="true">
        <canvas ref="canvas"></canvas>
      </div>
    </Teleport>
  </button>
</template>

<script setup lang="ts">
import { onUnmounted, ref } from "vue"
import { useTheme } from "../../composables/useTheme"

const { isDark, setTheme, readTargetBg } = useTheme()

const overlay = ref<HTMLElement | null>(null)
const canvas = ref<HTMLCanvasElement | null>(null)

const running = ref(false)

/* ===== tuning ===== */
const TARGET_PIXELS = 2200 // canvas: aman sampai 5000+
const SWEEP = 0.5          // gelombang nyapu layar
const FILL  = 0.24         // 1 pixel membesar
const HOLD  = 0.09         // beat pas tertutup penuh (flip di sini)
const EMPTY = 0.26         // 1 pixel menyusut

let rafId = 0

function toggleTheme(e: MouseEvent) {
  if (running.value || !overlay.value || !canvas.value) return

  const next = isDark.value ? "light" : "dark"

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    setTheme(next)
    return
  }

  const btn = e.currentTarget as HTMLElement
  const r = btn.getBoundingClientRect()
  const cx = r.left + r.width / 2
  const cy = r.top + r.height / 2

  const w = window.innerWidth
  const h = window.innerHeight
  const dpr = Math.min(window.devicePixelRatio || 1, 2)

  const cv = canvas.value
  cv.width = Math.round(w * dpr)
  cv.height = Math.round(h * dpr)
  cv.style.width = w + "px"
  cv.style.height = h + "px"

  const ctx = cv.getContext("2d")!
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.fillStyle = readTargetBg(next) // SATU warna → fillStyle diset sekali

  /* grid kecil → front gelombang halus kayak gradient */
  const cell = Math.max(14, Math.round(Math.sqrt((w * h) / TARGET_PIXELS)))
  const cols = Math.ceil(w / cell)
  const rows = Math.ceil(h / cell)

  /* delay tiap pixel = jarak ke titik klik → gelombang punya arah */
  const items: { x: number; y: number; delay: number }[] = []
  let maxDist = 0

  for (let gy = 0; gy < rows; gy++) {
    for (let gx = 0; gx < cols; gx++) {
      const px = gx * cell + cell / 2
      const py = gy * cell + cell / 2
      const d = Math.hypot(px - cx, py - cy)
      if (d > maxDist) maxDist = d
      items.push({ x: px, y: py, delay: 0 })
    }
  }

const speed = maxDist / SWEEP

/* semua konstanta sekarang KONSISTEN detik */
const ENTER_END  = SWEEP + FILL            // layar 100% tertutup → flip di sini
const EXIT_START = ENTER_END + HOLD        // gelombang keluar mulai
const EXIT_END   = EXIT_START + SWEEP + EMPTY  // pixel terjauh selesai keluar
const total      = EXIT_END + 0.05         // + margin kecil  

  running.value = true
  overlay.value.style.display = "block"

  let flipped = false
  const start = performance.now()

  const easeOut = (t: number) => 1 - (1 - t) * (1 - t) // power2.out
  const easeIn = (t: number) => t * t                  // power2.in

  const frame = (now: number) => {
    const t = (now - start) / 1000

    /* layar 100% tertutup TEPAT di SWEEP+FILL → flip di sini */
    if (!flipped && t >= ENTER_END) {
      setTheme(next)
      flipped = true
    }

    ctx.clearRect(0, 0, w, h)

    for (const it of items) {
      let s: number   // ukuran 0..1
      let sq: number  // "kotak-ness": 0 = lingkaran, 1 = persegi penuh

      if (t <= EXIT_START + it.delay) {
        /* FASE MASUK: lahir bulat → mengunci jadi persegi (coverage 100%) */
        const lt = (t - it.delay) / FILL
        if (lt <= 0) continue
        if (lt >= 1) { s = 1; sq = 1 }
        else { s = easeOut(lt); sq = lt }
      } else {
        /* FASE KELUAR: persegi menyusut, balik jadi dot */
        const k = (t - EXIT_START - it.delay) / EMPTY
        if (k >= 1) continue
        s = 1 - easeIn(k)
        sq = s
      }

      const size = cell * s
      if (size <= 0.5) continue
      const radius = (size / 2) * (1 - sq)

      const x = it.x - size / 2
      const y = it.y - size / 2

      if (radius <= 0.5) {
        ctx.fillRect(x, y, size, size)
      } else if (ctx.roundRect) {
        ctx.beginPath()
        ctx.roundRect(x, y, size, size, radius)
        ctx.fill()
      } else {
        ctx.beginPath()
        ctx.arc(it.x, it.y, size / 2, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    if (t >= total) {
      cleanup()
      return
    }
    rafId = requestAnimationFrame(frame)
  }

  rafId = requestAnimationFrame(frame)

  function cleanup() {
    if (overlay.value) overlay.value.style.display = "none"
    if (canvas.value) {
      const c = canvas.value.getContext("2d")
      c?.clearRect(0, 0, canvas.value.width, canvas.value.height)
    }
    running.value = false
  }
}

/* safety net: unmount di tengah animasi → tema tetap flip */
let pendingNext: "dark" | "light" | null = null
const origSet = setTheme

onUnmounted(() => {
  cancelAnimationFrame(rafId)
  if (overlay.value) overlay.value.style.display = "none"
})
</script>

<style scoped>
.theme-toggle {
  position: relative;
  z-index: 10;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--border-dim);
  color: var(--text);
  cursor: pointer;
  transition: border-color 0.2s ease, transform 0.2s ease, background 0.2s ease;
}

.theme-toggle:hover {
  border-color: var(--primary);
  transform: translateY(-2px);
}

.theme-toggle:active { transform: scale(0.94); }

.theme-toggle:disabled {
  cursor: wait;
  opacity: 0.85;
  transform: none;
}

.theme-toggle:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 3px;
}

.icon-wrap { position: relative; width: 17px; height: 17px; }

.icon {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  transition: opacity 0.3s ease, transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.sun { opacity: 0; transform: rotate(90deg) scale(0.4); }
.moon { opacity: 1; transform: rotate(0deg) scale(1); }

.dark .sun { opacity: 1; transform: rotate(0deg) scale(1); }
.dark .moon { opacity: 0; transform: rotate(-90deg) scale(0.4); }

/* di-teleport ke body — nav punya backdrop-filter yang jadi containing
   block buat position:fixed descendant, jadi gak boleh di dalam nav */
.pixel-overlay {
  position: fixed;
  inset: 0;
  z-index: 99999;
  display: none;
  pointer-events: none;
}

.pixel-overlay canvas {
  display: block;
}
</style>