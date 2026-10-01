<template>
  <Teleport to="body">
    <div v-if="visible" ref="root" class="preloader" aria-hidden="true">
      <div class="stars s1"></div>
      <div class="stars s2"></div>

      <div class="loader-core">
        <div class="orbit-wrap">
          <span class="ring r1"></span>
          <span class="ring r2"></span>
          <span class="ring r3"></span>
          <span class="core"></span>
          <span class="orbit-dot d1"></span>
          <span class="orbit-dot d2"></span>
        </div>

        <div class="readout">
          <span ref="pct" class="pct">000</span><span class="sign">%</span>
        </div>

        <div class="bar-track">
          <div ref="bar" class="bar-fill"></div>
        </div>

        <p ref="status" class="status">{{ statusText }}</p>
      </div>

      <p class="brand">VAHLLZZZZ<span>.</span></p>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue"
import gsap from "gsap"
import { useLanguage } from "../../composables/useLanguage"

const { language } = useLanguage()

const visible = ref(true)
const root = ref<HTMLElement | null>(null)
const pct = ref<HTMLElement | null>(null)
const bar = ref<HTMLElement | null>(null)
const status = ref<HTMLElement | null>(null)

const statusText = ref("")

/* ====== Opsi: cuma tampil sekali per sesi browser ======
   kalau mau aktif, un-comment blok ini di onMounted:
   if (sessionStorage.getItem("vahll-loaded")) {
     visible.value = false
     window.dispatchEvent(new Event("loader:done"))
     return
   }
   sessionStorage.setItem("vahll-loaded", "1")
======================================================= */

onMounted(() => {
  // hormati user yang matiin animasi
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    visible.value = false
    window.dispatchEvent(new Event("loader:done"))
    return
  }

  const en = language.value === "en"
  const statuses = en
    ? ["Establishing orbit", "Loading solar system", "Calibrating stars", "Ready"]
    : ["Menyiapkan orbit", "Memuat sistem solar", "Mengkalibrasi bintang", "Siap"]

  statusText.value = statuses[0]

  const swapStatus = (txt: string) => {
    gsap.to(status.value, {
      opacity: 0,
      y: -6,
      duration: 0.18,
      ease: "power1.in",
      onComplete() {
        statusText.value = txt
        gsap.fromTo(
          status.value,
          { opacity: 0, y: 6 },
          { opacity: 1, y: 0, duration: 0.22, ease: "power1.out" }
        )
      },
    })
  }

  const counter = { v: 0 }

  const tl = gsap.timeline({
    defaults: { ease: "power2.inOut" },
    onComplete: exit,
  })

  tl.to(counter, {
      v: 100,
      duration: 2.1,
      onUpdate() {
        const val = Math.round(counter.v)
        pct.value!.textContent = String(val).padStart(3, "0")
      },
    }, 0)
    .to(bar.value, { scaleX: 1, duration: 2.1 }, 0)
    .call(() => swapStatus(statuses[1]), [], 0.6)
    .call(() => swapStatus(statuses[2]), [], 1.2)
    .call(() => swapStatus(statuses[3]), [], 1.85)

  function exit() {
    const out = gsap.timeline({
      onComplete: () => (visible.value = false),
    })

    out
      // core "melompat" ke hyperespace sesaat sebelum layar terbuka
      .to(".core", { scale: 2.4, opacity: 0.9, duration: 0.35, ease: "power3.in" })
      .to(".loader-core, .brand", {
        opacity: 0,
        y: -18,
        duration: 0.35,
        ease: "power2.in",
        stagger: 0.05,
      }, "-=0.15")
      // tirai terangkat → hero ke-reveal
      .to(root.value, { yPercent: -100, duration: 0.85, ease: "power4.inOut" }, "-=0.05")
      // beri sinyal ke Hero buat mainkan intro pas tirai mulai terbuka
      .call(() => window.dispatchEvent(new Event("loader:done")), [], "-=0.75")
  }
})
</script>

<style scoped>
.preloader {
  position: fixed;
  inset: 0;
  z-index: 999999;
  display: grid;
  place-items: center;
  overflow: hidden;
  background:
    radial-gradient(600px 400px at 50% 42%, rgba(0, 200, 83, 0.07), transparent 65%),
    #05070b;
}

/* ===== star field ===== */
.stars {
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(1px 1px at 12% 22%, rgba(255, 255, 255, 0.7), transparent 100%),
    radial-gradient(1px 1px at 38% 64%, rgba(255, 255, 255, 0.45), transparent 100%),
    radial-gradient(1.5px 1.5px at 64% 18%, rgba(255, 255, 255, 0.6), transparent 100%),
    radial-gradient(1px 1px at 82% 48%, rgba(255, 255, 255, 0.4), transparent 100%),
    radial-gradient(1px 1px at 26% 82%, rgba(255, 255, 255, 0.5), transparent 100%),
    radial-gradient(1.5px 1.5px at 90% 78%, rgba(255, 255, 255, 0.55), transparent 100%),
    radial-gradient(1px 1px at 52% 90%, rgba(255, 255, 255, 0.4), transparent 100%),
    radial-gradient(1px 1px at 6% 58%, rgba(255, 255, 255, 0.45), transparent 100%);
  background-size: 380px 380px;
  animation: twinkle 4.5s ease-in-out infinite;
}

.stars.s2 {
  background-size: 240px 240px;
  opacity: 0.5;
  animation-duration: 7s;
  animation-direction: reverse;
}

@keyframes twinkle {
  50% { opacity: 0.55; }
}

/* ===== orbit ===== */
.orbit-wrap {
  position: relative;
  width: 150px;
  height: 150px;
  margin: 0 auto 30px;
}

.ring {
  position: absolute;
  left: 50%;
  top: 50%;
  border-radius: 999px;
  transform: translate(-50%, -50%);
}

.r1 {
  width: 96px;
  height: 96px;
  border: 1px dashed rgba(0, 200, 83, 0.4);
  animation: spin 9s linear infinite;
}

.r2 {
  width: 150px;
  height: 150px;
  border: 1px solid rgba(0, 200, 83, 0.16);
  animation: spin 14s linear infinite reverse;
}

.r3 {
  width: 210px;
  height: 210px;
  border: 1px dashed rgba(255, 255, 255, 0.07);
  animation: spin 24s linear infinite;
}

.core {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 26px;
  height: 26px;
  margin: -13px;
  border-radius: 999px;
  background: var(--primary, #00c853);
  box-shadow:
    0 0 18px rgba(0, 200, 83, 0.85),
    0 0 55px rgba(0, 200, 83, 0.35);
  animation: corePulse 1.6s ease-in-out infinite;
}

@keyframes corePulse {
  50% { box-shadow: 0 0 26px rgba(0, 200, 83, 1), 0 0 80px rgba(0, 200, 83, 0.45); }
}

/* dot yang ngorbit: wrapper muter, dot duduk di tepi lingkarannya */
.orbit-dot {
  position: absolute;
  left: 50%;
  top: 50%;
  border-radius: 50%;
}

.orbit-dot.d1 {
  width: 96px;
  height: 96px;
  margin: -48px;
  animation: spin 1.7s linear infinite;
}

.orbit-dot.d1::after {
  content: "";
  position: absolute;
  top: -3.5px;
  left: 50%;
  width: 7px;
  height: 7px;
  margin-left: -3.5px;
  border-radius: 999px;
  background: #4a90e2;
  box-shadow: 0 0 10px #4a90e2;
}

.orbit-dot.d2 {
  width: 150px;
  height: 150px;
  margin: -75px;
  animation: spin 3.4s linear infinite reverse;
}

.orbit-dot.d2::after {
  content: "";
  position: absolute;
  top: -3.5px;
  left: 50%;
  width: 6px;
  height: 6px;
  margin-left: -3px;
  border-radius: 999px;
  background: #ffd447;
  box-shadow: 0 0 10px #ffd447;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ===== readout ===== */
.readout {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 3px;
  margin-bottom: 14px;
  color: #fff;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
}

.pct {
  min-width: 3ch;
  font-size: 2.6rem;
  font-weight: 900;
  line-height: 1;
  letter-spacing: 0.02em;
  text-align: left;
}

.sign {
  color: var(--primary, #00c853);
  font-size: 1.1rem;
  font-weight: 800;
}

/* ===== progress bar ===== */
.bar-track {
  width: 220px;
  height: 3px;
  margin: 0 auto;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, rgba(0, 200, 83, 0.5), var(--primary, #00c853));
  box-shadow: 0 0 12px rgba(0, 200, 83, 0.55);
  transform: scaleX(0);
  transform-origin: left;
}

/* ===== status ===== */
.status {
  margin: 18px 0 0;
  min-height: 1.2em;
  color: rgba(255, 255, 255, 0.45);
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.22em;
  text-transform: uppercase;
}

/* ===== brand ===== */
.brand {
  position: absolute;
  bottom: 28px;
  left: 50%;
  transform: translateX(-50%);
  margin: 0;
  color: rgba(255, 255, 255, 0.35);
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.3em;
}

.brand span { color: var(--primary, #00c853); }
</style>