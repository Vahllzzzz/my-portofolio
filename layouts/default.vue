<template>
  <div>
    <ModeSwitcher />
    <slot />
  </div>
</template>

<script setup>
import ModeSwitcher from '~/components/layout/ModeSwitcher.vue'
</script>