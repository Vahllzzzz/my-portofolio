import { useModeStore } from "../stores/mode"
import { storeToRefs } from "pinia"

export const useMode = () => {
  const store = useModeStore()
  const { mode } = storeToRefs(store)

  return {
    mode,
    setMode: store.setMode
  }
}