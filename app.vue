<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
// Import theme CSS
import "./assets/css/theme.css"
</script>

<style>
html {
  scroll-behavior: smooth;
  /* Hide scrollbar */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

html::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

html,
body,
#__nuxt {
  width: 100%;
  min-height: 100%;
  margin: 0;
  background: var(--bg);
  color: var(--text);
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
</style>
