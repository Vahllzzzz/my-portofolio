import { ref } from "vue"

type Theme = "dark" | "light"

// module-level: satu sumber kebenaran buat semua komponen
const isDark = ref(true)
let ready = false

function applyTheme(dark: boolean) {
  document.documentElement.setAttribute("data-theme", dark ? "dark" : "light")
}

export function useTheme() {
  if (!ready && typeof window !== "undefined") {
    ready = true
    const saved = localStorage.getItem("theme")
    isDark.value = saved ? saved === "dark" : true
    applyTheme(isDark.value)
  }

  /* sekarang nerima "dark" | "light" — cocok sama Theme
     yang dipakai ThemeToggle & readTargetBg */
  function setTheme(theme: Theme) {
    isDark.value = theme === "dark"
    applyTheme(theme === "dark")
    localStorage.setItem("theme", theme)
  }

  function readTargetBg(target: Theme): string {
    const root = document.documentElement
    const prev = root.getAttribute("data-theme")

    root.setAttribute("data-theme", target)
    const bgVar = getComputedStyle(root).getPropertyValue("--bg").trim()

    if (prev === null) root.removeAttribute("data-theme")
    else root.setAttribute("data-theme", prev)

    const hexLike = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i
    if (hexLike.test(bgVar)) return bgVar
    return target === "dark" ? "#0b0b0f" : "#f5f7fb"
  }

  return { isDark, setTheme, readTargetBg }
}