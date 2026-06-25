import id from "~/locales/id"
import en from "~/locales/en"

const translations = {
  id,
  en
}

export function useTranslation() {

  const langStore = useLanguageStore()

  const t = (path: string) => {

    const keys = path.split(".")

    let value: any =
      translations[
        langStore.locale as "id" | "en"
      ]

    for (const key of keys) {
      value = value?.[key]
    }

    return value || path
  }

  return { t }
}