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
let isSnapping   = false
let rafId: number | null = null
let currentPanel = 0   // index of the snap point we are sitting on
let touchStartY  = 0

const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

const animateScrollTo = (targetY: number, duration = 220) => {
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

// Returns true when the viewport is inside the sticky scroll area
const isInSnapArea = (): boolean => {
  const pts = getSnapPoints()
  return window.scrollY >= (pts[0] ?? 0) && window.scrollY <= (pts[pts.length - 1] ?? 0)
}

const snapToPanel = (index: number) => {
  const points  = getSnapPoints()
  const clamped = Math.min(Math.max(index, 0), points.length - 1)
  currentPanel  = clamped
  const targetY = points[clamped]
  if (targetY === undefined || Math.abs(window.scrollY - targetY) < 4) {
    isSnapping = false
    return
  }
  isSnapping = true
  animateScrollTo(targetY)
}

// ── Only used to keep the visual in sync during the JS animation ──────────
const onScroll = () => updateTranslation()

// ── Wheel (mouse & trackpad) ──────────────────────────────────────────────
const onWheel = (e: WheelEvent) => {
  if (!isInSnapArea()) return          // outside wrapper → normal scroll
  const direction = e.deltaY > 0 ? 1 : -1
  const nextIndex = currentPanel + direction
  const points    = getSnapPoints()
  // At the first or last panel, release control so the page can scroll away
  if (nextIndex < 0 || nextIndex >= points.length) return
  // Inside the wrapper: block native scroll and snap exactly one panel
  e.preventDefault()
  if (isSnapping) return
  snapToPanel(nextIndex)
}

// ── Touch (mobile swipe) ──────────────────────────────────────────────────
const onTouchStart = (e: TouchEvent) => {
  touchStartY = e.touches[0]?.clientY ?? 0
}
const onTouchMove = (e: TouchEvent) => {
  if (!isInSnapArea()) return
  // Determine intended direction so we can release at the boundaries
  const currentY  = e.touches[0]?.clientY ?? touchStartY
  const direction = (touchStartY - currentY) > 0 ? 1 : -1
  const nextIndex = currentPanel + direction
  const points    = getSnapPoints()
  // At the boundary, let native scroll carry the user away
  if (nextIndex < 0 || nextIndex >= points.length) return
  // Inside the wrapper: block ALL native momentum so we don't overshoot
  e.preventDefault()
}
const onTouchEnd = (e: TouchEvent) => {
  if (!isInSnapArea() || isSnapping) return
  const deltaY    = touchStartY - (e.changedTouches[0]?.clientY ?? 0)
  if (Math.abs(deltaY) < 30) return    // too small – ignore
  const direction = deltaY > 0 ? 1 : -1
  const nextIndex = currentPanel + direction
  const points    = getSnapPoints()
  if (nextIndex < 0 || nextIndex >= points.length) return
  snapToPanel(nextIndex)
}

onMounted(() => {
  // Initialise currentPanel to the nearest snap point
  const points = getSnapPoints()
  points.forEach((p, i) => {
    if (Math.abs(window.scrollY - p) < Math.abs(window.scrollY - (points[currentPanel] ?? 0)))
      currentPanel = i
  })
  window.addEventListener('scroll',     onScroll,     { passive: true  })
  window.addEventListener('wheel',      onWheel,      { passive: false })
  window.addEventListener('touchstart', onTouchStart, { passive: true  })
  window.addEventListener('touchmove',  onTouchMove,  { passive: false })
  window.addEventListener('touchend',   onTouchEnd,   { passive: true  })
})

onUnmounted(() => {
  window.removeEventListener('scroll',     onScroll)
  window.removeEventListener('wheel',      onWheel)
  window.removeEventListener('touchstart', onTouchStart)
  window.removeEventListener('touchmove',  onTouchMove)
  window.removeEventListener('touchend',   onTouchEnd)
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
            <img class="carouselImg" src="/images/Cherry.png" alt=""/>
          </section>

          <section class="panel">
            <h2 class="panel-title">Walnut</h2>
            <img class="carouselImg" src="/images/Walnut.png" alt=""/>

          </section>

          <section class="panel">
            <h2 class="panel-title">Mint</h2>
            <img class="carouselImg" src="/images/Mint.png" alt=""/>

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
img.carouselImg {
  max-width: 25rem;
  position: absolute;
}

@media (max-width: 768px) {
  img.carouselImg {
    max-width: 20rem !important;
  }
  .panel-title {
    margin-top: 36rem;
    letter-spacing: 0.05em !important;

  }
}
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
  //font-size: clamp(2rem, 6vw, 4rem);
  font-weight: 700;
  letter-spacing: 2rem;
  color: rgba(0, 0, 0, 0.55);
  font-size: 25dvw;
  margin-top: 20rem;

}
</style>
