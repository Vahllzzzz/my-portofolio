<template>
  <Transition name="pause-swallow">
    <div v-if="mode === 'solar'" class="switcher">
      <button
        class="pause-btn"
        :class="{ paused }"
        :aria-label="pauseLabel"
        @click="togglePause"
      >
        <svg v-if="!paused" class="ic" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <rect x="6.5" y="5" width="4" height="14" rx="1.4" />
          <rect x="13.5" y="5" width="4" height="14" rx="1.4" />
        </svg>
        <svg v-else class="ic" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M8 5.6c0-1.1 1.2-1.8 2.2-1.2l9 5.9c.9.6.9 1.9 0 2.5l-9 5.9c-1 .6-2.2-.1-2.2-1.2V5.6z" />
        </svg>
        {{ pauseLabel }}
      </button>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useModeStore } from "../../stores/mode"
import { storeToRefs } from "pinia"
import { useLanguage } from "../../composables/useLanguage"

const store = useModeStore()
const { mode, paused } = storeToRefs(store)
const { togglePause } = store

const { language } = useLanguage()

const pauseLabel = computed(() => {
  const en = language.value === "en"
  return paused.value ? (en ? "Resume" : "Lanjut") : (en ? "Pause" : "Jeda")
})
</script>

<style scoped>
.switcher {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 102;
  display: flex;
  align-items: center;
  padding: 4px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 10px;
  background: rgba(11, 11, 15, 0.72);
  backdrop-filter: blur(14px);
}

button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-width: 72px;
  padding: 9px 14px;
  border: none;
  border-radius: 7px;
  background: transparent;
  color: rgba(255, 255, 255, 0.68);
  cursor: pointer;
  font: 700 13px/1 Inter, system-ui, sans-serif;
  white-space: nowrap;
  transition: color 0.2s ease, background 0.2s ease;
}

button:hover { color: #fff; }

button.paused {
  color: #f0b84c;
}

button .ic {
  width: 13px;
  height: 13px;
  flex-shrink: 0;
}

/* transition muncul-nyembunyi yang gak lebar-lebar aneh */
.pause-swallow-enter-active,
.pause-swallow-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.pause-swallow-enter-from,
.pause-swallow-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

@media (max-width: 920px) {
  .switcher {
    top: 64px; /* gak nabrak title yang di tengah */
    right: 16px;
  }
}
</style>