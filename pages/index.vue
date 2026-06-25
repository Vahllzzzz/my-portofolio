<template>
  <div>
    <ModeSwitcher v-if="mode === 'solar'" />

    <SolarSystem
      v-if="mode === 'solar'"
      key="solar"
    />

    <ProPortfolio
      v-else
      key="pro"
    />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia"
import { useModeStore } from "../stores/mode"
import ModeSwitcher from "../components/layout/ModeSwitcher.vue"
import SolarSystem from "../components/solar/SolarSystem.vue"
import ProPortfolio from "../components/pro/ProPortofolio.vue"

const store = useModeStore()
const { mode } = storeToRefs(store)
</script>
