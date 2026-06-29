<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
// Import theme CSS
import "./assets/css/theme.css"

// Set viewport for mobile optimization
useHead({
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes',
  meta: [
    { name: 'theme-color', content: '#0b0b0f' }
  ]
})
</script>

<style>
html {
  scroll-behavior: smooth;
  /* Hide scrollbar */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  overflow-x: hidden;
}

html::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

html,
body,
#__nuxt {
  width: 100%;
  max-width: 100vw;
  min-height: 100%;
  margin: 0;
  padding: 0;
  background: var(--bg);
  color: var(--text);
  overflow-x: hidden;
}

* {
  box-sizing: border-box;
}

body {
  overflow-x: hidden;
  /* Hide scrollbar for body too */
  scrollbar-width: none;
  -ms-overflow-style: none;
}

body::-webkit-scrollbar {
  display: none;
}

/* Prevent horizontal scroll on mobile */
#__nuxt > * {
  max-width: 100vw;
  overflow-x: hidden;
}

/* Ensure images don't overflow */
img {
  max-width: 100%;
  height: auto;
}

/* Mobile touch optimization */
@media (max-width: 768px) {
  * {
    -webkit-tap-highlight-color: transparent;
  }
  
  button, a {
    touch-action: manipulation;
  }
}
</style>
