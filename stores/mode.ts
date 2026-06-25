import { defineStore } from "pinia"

export const useModeStore = defineStore(
  "mode",
  {
    state: () => ({
      mode: "pro",
      paused: false
    }),

    actions: {
      setMode(mode: "pro" | "solar") {
        this.mode = mode
      },

      togglePause() {
        this.paused = !this.paused
      }
    }
  }
)