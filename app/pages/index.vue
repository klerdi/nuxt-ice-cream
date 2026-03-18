<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const stickyWrapper   = ref<HTMLElement | null>(null)
const horizontalTrack = ref<HTMLElement | null>(null)

const updateTranslation = () => {
  if (!stickyWrapper.value || !horizontalTrack.value) return

  // How far from the top of the document this wrapper starts
  const wrapperTop = stickyWrapper.value.offsetTop

  // 300vh wrapper – sticky element (100vh) = 200vh of scrollable space for 2 extra panels
  const maxScroll = window.innerHeight * 2

  const scrollInWrapper = window.scrollY - wrapperTop
  const progress  = Math.min(1, Math.max(0, scrollInWrapper / maxScroll))
  const translateX = progress * window.innerWidth * 2

  horizontalTrack.value.style.transform = `translateX(-${translateX}px)`
}

onMounted(() => {
  window.addEventListener('scroll', updateTranslation, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateTranslation)
})
</script>

<template>
  <div>

    <!-- ─── Horizontal scroll area ─────────────────────────────────────────── -->
    <!-- 300vh = 100vh visible + 200vh scroll space for panels 2 & 3          -->
    <div ref="stickyWrapper" class="sticky-wrapper">
      <div class="sticky-container">
        <div ref="horizontalTrack" class="horizontal-track">

          <section class="panel cherry">
            <h2 class="panel-title">Cherry</h2>
          </section>

          <section class="panel walnut">
            <h2 class="panel-title">Walnut</h2>
          </section>

          <section class="panel mint">
            <h2 class="panel-title">Mint</h2>
          </section>

        </div>
      </div>
    </div>

    <!-- ─── Section 4 – normal vertical scroll ────────────────────────────── -->
    <section class="panel white">
      <h2 class="panel-title">Section 4</h2>
    </section>

  </div>
</template>

<style scoped>
/* ── Horizontal scroll mechanics ────────────────────────────────────────── */
.sticky-wrapper {
  height: 300vh;       /* provides 200vh of scroll range beyond the 100vh panel */
  position: relative;
}

.sticky-container {
  position: sticky;
  top: 0;
  height: 100vh;
  overflow: hidden;
}

.horizontal-track {
  display: flex;
  width: 300vw;        /* 3 panels × 100vw */
  height: 100%;
  will-change: transform;
  transition: transform 0.12s ease-out; /* subtle smoothing */
}

/* ── Shared panel base ───────────────────────────────────────────────────── */
.panel {
  width: 100vw;
  height: 100vh;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

/* ── Pastel colours ──────────────────────────────────────────────────────── */
.cherry { background-color: #ffb7c5; } /* pastel cherry */
.walnut { background-color: #dec9a8; } /* pastel walnut */
.mint   { background-color: #b5ead7; } /* pastel mint   */
.white  { background-color: #ffffff; } /* white         */

/* ── Typography ──────────────────────────────────────────────────────────── */
.panel-title {
  font-size: clamp(2rem, 6vw, 4rem);
  font-weight: 700;
  letter-spacing: 0.05em;
  color: rgba(0, 0, 0, 0.55);
}
</style>
