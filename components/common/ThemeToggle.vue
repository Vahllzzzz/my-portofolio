<template>
  <button
    class="theme-toggle"
    @click="toggleTheme"
    :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
  >
    {{ isDark ? "☀️" : "🌙" }}
  </button>
  
  <!-- Theme transition overlay -->
  <Transition name="theme-transition">
    <div v-if="isTransitioning" class="theme-overlay" :class="{ dark: !isDark }"></div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"

const isDark = ref(true)
const isTransitioning = ref(false)

function toggleTheme() {
  // Start transition animation
  isTransitioning.value = true
  
  // Toggle theme after a slight delay for smooth animation
  setTimeout(() => {
    isDark.value = !isDark.value

    document.documentElement.setAttribute(
      "data-theme",
      isDark.value ? "dark" : "light"
    )

    localStorage.setItem(
      "theme",
      isDark.value ? "dark" : "light"
    )
  }, 150)
  
  // End transition
  setTimeout(() => {
    isTransitioning.value = false
  }, 800)
}

onMounted(() => {
  const saved =
    localStorage.getItem("theme") || "dark"

  isDark.value =
    saved === "dark"

  document.documentElement.setAttribute(
    "data-theme",
    saved
  )
})
</script>

<style scoped>
.theme-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  padding: 0;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--border-dim);
  color: var(--text);
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.25s, transform 0.25s, border-color 0.25s;
  position: relative;
  z-index: 1;
}

.theme-toggle:hover {
  transform: translateY(-2px);
  background: var(--border);
  border-color: var(--primary);
}

/* Theme transition overlay */
.theme-overlay {
  position: fixed;
  top: -100%;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  pointer-events: none;
  background: #f5f7fb;
}

.theme-overlay.dark {
  background: #0b0b0f;
}

/* Transition animations */
.theme-transition-enter-active {
  animation: slideDown 0.8s cubic-bezier(0.76, 0, 0.24, 1);
}

.theme-transition-leave-active {
  animation: slideUp 0.5s cubic-bezier(0.76, 0, 0.24, 1);
}

@keyframes slideDown {
  0% {
    top: -100%;
    opacity: 0.95;
  }
  50% {
    top: 0%;
    opacity: 1;
  }
  100% {
    top: 100%;
    opacity: 0.95;
  }
}

@keyframes slideUp {
  from {
    top: 100%;
    opacity: 0;
  }
  to {
    top: 100%;
    opacity: 0;
  }
}
</style>