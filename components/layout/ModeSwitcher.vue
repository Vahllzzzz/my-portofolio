<template>
  <div ref="switcher" class="switcher">

<button @click="backToPro">
  ← Back to Pro
</button>

    <Transition name="pause-swallow">
      <button
      ref="pauseBtn"
        v-if="mode === 'solar'"
        class="pause-btn"
        @click="togglePause"
      >
        {{ paused ? 'Resume' : 'Pause' }}
      </button>
    </Transition>

  </div>
</template>

<script setup lang="ts">
import { useModeStore } from "../../stores/mode"
import { storeToRefs } from "pinia"

const store = useModeStore()
const { mode, paused } = storeToRefs(store)
const { setMode, togglePause } = store

import gsap from "gsap"

function backToPro() {
  const rect = window.solarTargetRect
  const solar = document.querySelector(".solar-system") as HTMLElement
  
  // Check if mobile
  const isMobile = window.innerWidth <= 920

  if (!solar || !rect || isMobile) {
    // On mobile or no rect, just switch without animation
    setMode("pro")
    return
  }

  // Desktop: animate back to preview
  const clone = solar.cloneNode(true) as HTMLElement
  document.body.appendChild(clone)

  Object.assign(clone.style, {
    position: "fixed",
    left: "0px",
    top: "0px",
    width: "100vw",
    height: "100vh",
    zIndex: "99999",
    margin: "0"
  })

  setMode("pro")

  gsap.to(clone, {
    left: rect.left + "px",
    top: rect.top + "px",
    width: rect.width + "px",
    height: rect.height + "px",
    borderRadius: "12px",
    duration: 1,
    ease: "power3.inOut",
    onComplete() {
      clone.remove()
    }
  })
}
</script>

<style scoped>
.switcher{
  position: fixed;
  top: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px;
  border: 1px solid rgba(255,255,255,.14);
  border-radius: 8px;
  background: rgba(11,11,15,.72);
  backdrop-filter: blur(14px);
  z-index: 102;
  overflow: hidden;
  transition: all .45s cubic-bezier(.22,1,.36,1);
}

button {
  min-width: 72px;
  padding: 9px 14px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: rgba(255, 255, 255, 0.68);
  cursor: pointer;
  font: 700 13px/1 Inter, system-ui, sans-serif;
  transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease;
  white-space: nowrap;
}

button:hover {
  color: white;
  transform: translateY(-1px);
}

.active {
  background: white;
  color: #0b0b0f;
  box-shadow: 0 8px 20px rgba(255, 255, 255, 0.12);
}

.active:hover {
  background: #e94560;
  color: white;
}

.pause-swallow-enter-active,
.pause-swallow-leave-active{
  transition:
    opacity .35s ease,
    width .35s ease,
    transform .35s ease,
    margin .35s ease;
  overflow:hidden;
}

.pause-swallow-enter-from{
  opacity:0;
  width:0;
  margin-left:-4px;
  transform:scaleX(0);
}

.pause-swallow-enter-to{
  opacity:1;
  width:72px;
  margin-left:0;
  transform:scaleX(1);
}

.pause-swallow-leave-from{
  opacity:1;
  width:72px;
  margin-left:0;
  transform:scaleX(1);
}

.pause-swallow-leave-to{
  opacity:0;
  width:0;
  margin-left:-4px;
  transform:scaleX(0);
}

.switcher{
  transition: width .35s cubic-bezier(.22,1,.36,1);
}

.switcher{
  gap: 6px;
}

/* Mobile Responsive */
@media (max-width: 920px) {
  .switcher {
    top: auto;
    bottom: 20px;
    right: 20px;
    left: 20px;
    justify-content: center;
  }

  button {
    flex: 1;
    min-width: 0;
    max-width: 150px;
  }
}

@media (max-width: 560px) {
  .switcher {
    bottom: 16px;
    right: 16px;
    left: 16px;
    padding: 3px;
    gap: 4px;
  }

  button {
    padding: 8px 12px;
    font-size: 12px;
  }
}
</style>
