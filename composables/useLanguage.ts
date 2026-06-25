import { ref, watch } from "vue"

const STORAGE_KEY = 'portfolio-language'

// Initialize from localStorage or default to 'en'
const getInitialLanguage = (): "en" | "id" => {
  if (typeof window === 'undefined') return "en"

  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    console.log('🔍 Checking localStorage:', saved)
    if (saved === 'en' || saved === 'id') {
      console.log('✅ Found saved language:', saved)
      return saved
    }
  } catch (e) {
    console.error('❌ Error reading localStorage:', e)
  }

  console.log('⚠️ No saved language, using default: en')
  return "en"
}

const language = ref<"en" | "id">(getInitialLanguage())

// Watch for changes and save to localStorage
if (typeof window !== 'undefined') {
  watch(language, (newLang) => {
    try {
      console.log('💾 Saving language to localStorage:', newLang)
      localStorage.setItem(STORAGE_KEY, newLang)
      console.log('✅ Saved successfully')
    } catch (e) {
      console.error('❌ Error saving to localStorage:', e)
    }
  }, { immediate: false })
}

export function useLanguage() {
  const setLocale = (newLocale: "en" | "id") => {
    console.log('🌐 Setting language to:', newLocale)
    language.value = newLocale
  }

  return {
    language,
    setLocale
  }
}
