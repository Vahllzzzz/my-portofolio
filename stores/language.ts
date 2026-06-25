import { defineStore } from "pinia"

export const useLanguageStore = defineStore("language", {
  state: () => ({
    locale: "en" as "en" | "id"
  }),

  actions: {
    setLocale(locale: "en" | "id") {
      console.log('🌐 Language changed to:', locale)
      this.locale = locale
      console.log('💾 Saved to localStorage')
    }
  },

  persist: {
    storage: typeof window !== 'undefined' ? window.localStorage : null,
    key: 'language-store',
    paths: ['locale'],
    afterRestore: (ctx) => {
      console.log('✅ Language restored from localStorage:', ctx.store.locale)
    }
  }
})

