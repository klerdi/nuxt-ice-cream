<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const stickyWrapper   = ref<HTMLElement | null>(null)
const horizontalTrack = ref<HTMLElement | null>(null)
const bgColor         = ref('#ffb7c5') // starts at cherry

// Panel colours as RGB components for easy interpolation
const panelColors = [
  { r: 255, g: 183, b: 197 }, // cherry  #ffb7c5
  { r: 222, g: 201, b: 168 }, // walnut  #dec9a8
  { r: 181, g: 234, b: 215 }, // mint    #b5ead7
]

const lerpColor = (a: { r: number; g: number; b: number }, b: { r: number; g: number; b: number }, t: number) => {
  const r = Math.round(a.r + (b.r - a.r) * t)
  const g = Math.round(a.g + (b.g - a.g) * t)
  const bv = Math.round(a.b + (b.b - a.b) * t)
  return `rgb(${r}, ${g}, ${bv})`
}

const updateTranslation = () => {
  if (!stickyWrapper.value || !horizontalTrack.value) return

  const wrapperTop = stickyWrapper.value.offsetTop
  const maxScroll  = window.innerHeight * 2

  const scrollInWrapper = window.scrollY - wrapperTop
  const progress   = Math.min(1, Math.max(0, scrollInWrapper / maxScroll))
  const translateX = progress * window.innerWidth * 2

  horizontalTrack.value.style.transform = `translateX(-${translateX}px)`

  // Interpolate background colour across the 3 panels
  const scaled    = progress * (panelColors.length - 1)
  const fromIndex = Math.min(Math.floor(scaled), panelColors.length - 2)
  const t         = scaled - fromIndex
  const from = panelColors[fromIndex]
  const to   = panelColors[fromIndex + 1]
  if (from && to) bgColor.value = lerpColor(from, to, t)
}

// ── Snap logic ────────────────────────────────────────────────────────────
let isSnapping = false
let rafId: number | null = null

const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

const animateScrollTo = (targetY: number, duration = 340) => {
  if (rafId !== null) cancelAnimationFrame(rafId)
  const startY    = window.scrollY
  const distance  = targetY - startY
  const startTime = performance.now()

  const step = (now: number) => {
    const elapsed  = now - startTime
    const progress = Math.min(elapsed / duration, 1)
    window.scrollTo(0, startY + distance * easeInOutCubic(progress))
    if (progress < 1) {
      rafId = requestAnimationFrame(step)
    } else {
      rafId      = null
      isSnapping = false
    }
  }
  rafId = requestAnimationFrame(step)
}

const getSnapPoints = (): number[] => {
  const top = stickyWrapper.value?.offsetTop ?? 0
  const vh  = window.innerHeight
  return [top, top + vh, top + vh * 2, top + vh * 3]
}

const snapToNearest = () => {
  if (isSnapping) return
  const points  = getSnapPoints()
  const current = window.scrollY
  const nearest = points.reduce((prev, curr) =>
    Math.abs(curr - current) < Math.abs(prev - current) ? curr : prev
  )
  if (Math.abs(current - nearest) < 4) return // already at a snap point
  isSnapping = true
  animateScrollTo(nearest)
}

let scrollTimer: ReturnType<typeof setTimeout> | null = null

const onScroll = () => {
  updateTranslation()
  if (isSnapping) return
  if (scrollTimer) clearTimeout(scrollTimer)
  scrollTimer = setTimeout(snapToNearest, 80)
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  if (scrollTimer) clearTimeout(scrollTimer)
  if (rafId !== null) cancelAnimationFrame(rafId)
})
</script>

<template>
  <div>

    <!-- ─── Horizontal scroll area ─────────────────────────────────────────── -->
    <!-- 300vh = 100vh visible + 200vh scroll space for panels 2 & 3          -->
    <div ref="stickyWrapper" class="sticky-wrapper">
      <div class="sticky-container" :style="{ backgroundColor: bgColor }">
        <div ref="horizontalTrack" class="horizontal-track">

          <section class="panel">
            <h2 class="panel-title">Cherry</h2>
          </section>

          <section class="panel">
            <h2 class="panel-title">Walnut</h2>
          </section>

          <section class="panel">
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
.white  { background-color: #ffffff; } /* white         */

/* ── Typography ──────────────────────────────────────────────────────────── */
.panel-title {
  font-size: clamp(2rem, 6vw, 4rem);
  font-weight: 700;
  letter-spacing: 0.05em;
  color: rgba(0, 0, 0, 0.55);
}
</style>
