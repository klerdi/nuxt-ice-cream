<template>
  <footer class="bg-gradient-to-r from-[#ffb7c5] via-[#dec9a8] to-[#b5ead7] border-t border-[rgba(60,40,20,0.15)]">
    <div class="mx-auto max-w-[1280px] px-10 py-6 flex items-center justify-between gap-6 flex-wrap">

      <div class="flex items-center gap-2 text-[rgba(60,40,20,0.6)]">
        <span class="text-[11px] tracking-widest uppercase">Payment:</span>
        <span class="flex items-center gap-1.5 text-[11px] tracking-widest uppercase">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
            <line x1="1" y1="10" x2="23" y2="10"/>
          </svg>
          Card
        </span>
        <span class="text-[rgba(60,40,20,0.35)]">·</span>
        <span class="flex items-center gap-1.5 text-[11px] tracking-widest uppercase">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
            <line x1="12" y1="1" x2="12" y2="23"/>
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
          </svg>
          Cash
        </span>
      </div>
      <div class="flex items-center gap-5">
        <span class="text-[rgba(60,40,20,0.6)] text-[11px] tracking-widest uppercase">Social Media:</span>

        <a
          href="https://www.facebook.com"
          aria-label="Facebook"
          target="_blank"
          class="text-[rgba(60,40,20,0.55)] hover:text-[rgba(60,40,20,0.9)] transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"
            />
          </svg>
        </a>
        <a
          href="https://www.instagram.com/"
          aria-label="Instagram"
          target="_blank"
          class="text-[rgba(60,40,20,0.55)] hover:text-[rgba(60,40,20,0.9)] transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            viewBox="0 0 24 24"
          >
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
          </svg>
        </a>
        <a
          href="https://www.youtube.com"
          aria-label="YouTube"
          target="_blank"
          class="text-[rgba(60,40,20,0.55)] hover:text-[rgba(60,40,20,0.9)] transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"
            />
            <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#dec9a8" />
          </svg>
        </a>
      </div>
      <p class="text-[11px] tracking-widest uppercase text-[rgba(60,40,20,0.6)]">
        © Athena Street Food {{ currentYear }}.&nbsp;&nbsp;All Rights Reserved.
      </p>
    </div>
  </footer>
</template>

<script setup lang="ts">
const currentYear = new Date().getFullYear();
</script>

