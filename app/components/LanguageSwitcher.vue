<script setup lang="ts">
import { useLocaleLoader } from '~/composables/useLocaleLoader'

const { locale } = useI18n()
const { switchLocale } = useLocaleLoader()

const languages = [
  { code: 'sq', label: 'Shqip',    flag: '/flags/albania.png' },
  { code: 'en', label: 'English',  flag: '/flags/united-kingdom.png' },
  { code: 'el', label: 'Ελληνικά', flag: '/flags/greece.png' },
  { code: 'it', label: 'Italiano', flag: '/flags/italy.png' },
  { code: 'de', label: 'Deutsch',  flag: '/flags/germany.png' },
];

const isOpen = ref(false);
const dropdownRef = ref<HTMLDivElement | null>(null);

const currentLang = computed(
  () => languages.find((l) => l.code === locale.value) ?? languages[0]
);

const otherLangs = computed(() =>
  languages.filter((l) => l.code !== locale.value)
);

async function select(code: string) {
  isOpen.value = false;
  await switchLocale(code);
}

function toggle() {
  isOpen.value = !isOpen.value;
}

function onClickOutside(event: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpen.value = false;
  }
}

function onKeyDown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    isOpen.value = false;
  }
}

onMounted(() => {
  document.addEventListener('click', onClickOutside);
  document.addEventListener('keydown', onKeyDown);
});

onUnmounted(() => {
  document.removeEventListener('click', onClickOutside);
  document.removeEventListener('keydown', onKeyDown);
});
</script>

<template>
  <div ref="dropdownRef" class="relative" role="navigation" aria-label="Language selector">
    <!-- Trigger button -->
    <button
      @click="toggle"
      :aria-expanded="isOpen"
      aria-haspopup="listbox"
      :aria-label="`Language: ${currentLang.label}. Click to change.`"
      class="h-10 w-10 flex items-center justify-center
             hover:scale-105 transition-all duration-200 select-none"
    >
        <img :src="currentLang.flag" :alt="currentLang.label" class="h-9 w-9 rounded-full object-cover" />
    </button>

    <!-- Dropdown -->
    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0 scale-95 -translate-y-1"
      enter-to-class="opacity-100 scale-100 translate-y-0"
      leave-active-class="transition-all duration-150 ease-in"
      leave-from-class="opacity-100 scale-100 translate-y-0"
      leave-to-class="opacity-0 scale-95 -translate-y-1"
    >
      <ul
        v-if="isOpen"
        role="listbox"
        :aria-label="`Select language. Current: ${currentLang.label}`"
        class="absolute right-0 mt-2 flex flex-col gap-1 z-50"
      >
        <li
          v-for="lang in otherLangs"
          :key="lang.code"
          role="option"
          :aria-selected="false"
          :aria-label="lang.label"
        >
          <button
            @click="select(lang.code)"
            :title="lang.label"
            class="h-10 w-10 rounded-full flex items-center justify-center
                   hover:bg-black/8 hover:scale-110 transition-all duration-150 select-none
                   focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20"
          >
            <img :src="lang.flag" :alt="lang.label" class="h-9 w-9 rounded-full object-cover" />
          </button>
        </li>
      </ul>
    </Transition>
  </div>
</template>

