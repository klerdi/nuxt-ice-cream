import { ref } from 'vue'

const isLocaleLoading = ref(false)

export function useLocaleLoader() {
  const { setLocale } = useI18n()

  async function switchLocale(code: string) {
    isLocaleLoading.value = true

    // Wait one tick so the overlay renders before locale swap begins
    await nextTick()

    await setLocale(code as 'sq' | 'en' | 'el' | 'it' | 'de')

    // Wait for the next paint cycle so all reactive updates flush
    await nextTick()

    // Small buffer to guarantee no flash of unstyled content
    await new Promise<void>((resolve) => setTimeout(resolve, 300))

    isLocaleLoading.value = false
  }

  return {
    isLocaleLoading,
    switchLocale,
  }
}

