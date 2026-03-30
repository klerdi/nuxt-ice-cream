<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const stickyWrapper   = ref<HTMLElement | null>(null)
const horizontalTrack = ref<HTMLElement | null>(null)
const bgColor         = ref('#ffb7c5') // starts at cherry

// ── Active panel (drives carouselImgSmall1 slide-in animation) ───────────
const activePanel = ref(-1) // -1 so panel 0 animates in on mount

// ── Mint drop animation ───────────────────────────────────────────────────
const mintCarouselRef       = ref<HTMLElement | null>(null)  // carousel img in panel 3
const mintBubbleImgRef      = ref<HTMLElement | null>(null)  // flavor-img in section 4
const flyingMintVisible     = ref(false)
const flyingMintStyle       = ref<Record<string, string>>({})
const mintBubbleImageHidden = ref(false)

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

// ── Mint drop animation ───────────────────────────────────────────────────
// Fires when the user scrolls from the Mint panel (index 2) to Section 4 (index 3).
// A fixed-position clone of the mint image flies from its carousel position and
// shrinks into the mint bubble in section 4, then the real image fades back in.
const triggerMintDropAnimation = () => {
  if (!mintCarouselRef.value || !mintBubbleImgRef.value) return

  // Where the mint carousel image sits right now (in viewport space)
  const startRect  = mintCarouselRef.value.getBoundingClientRect()

  // The scroll will move the page down by exactly one innerHeight (one snap step)
  const scrollDelta = window.innerHeight

  // Where the mint bubble image will be AFTER the scroll completes
  const bubbleRect = mintBubbleImgRef.value.getBoundingClientRect()
  const targetTop  = bubbleRect.top  - scrollDelta
  const targetLeft = bubbleRect.left
  const targetW    = bubbleRect.width
  const targetH    = bubbleRect.height

  // 1 – Teleport the flying clone to the carousel image position (no transition)
  flyingMintStyle.value = {
    top:        `${startRect.top}px`,
    left:       `${startRect.left}px`,
    width:      `${startRect.width}px`,
    height:     `${startRect.height}px`,
    transition: 'none',
    opacity:    '1',
  }
  flyingMintVisible.value     = true
  mintBubbleImageHidden.value = true

  // 2 – Two rAFs so the browser paints the start state before we add the transition
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      flyingMintStyle.value = {
        top:        `${targetTop}px`,
        left:       `${targetLeft}px`,
        width:      `${targetW}px`,
        height:     `${targetH}px`,
        transition: 'top 0.45s ease-in-out, left 0.45s ease-in-out, width 0.45s ease-in-out, height 0.45s ease-in-out',
        opacity:    '1',
      }

      // 3 – Once the image has reached its destination, cross-fade into the real one
      setTimeout(() => {
        // Fade out the flying clone
        flyingMintStyle.value = {
          ...flyingMintStyle.value,
          transition: 'opacity 0.2s ease',
          opacity:    '0',
        }
        // Simultaneously fade in the real mint bubble image
        mintBubbleImageHidden.value = false

        setTimeout(() => {
          flyingMintVisible.value = false
        }, 220)
      }, 450)
    })
  })
}

const snapToPanel = (index: number) => {
  const points  = getSnapPoints()
  const clamped = Math.min(Math.max(index, 0), points.length - 1)

  // Trigger the mint-drop animation when going Mint panel → Section 4
  if (currentPanel === 2 && clamped === 3) {
    triggerMintDropAnimation()
  }

  currentPanel       = clamped
  activePanel.value  = clamped
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
  setTimeout(() => { activePanel.value = currentPanel }, 80)
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
            <img class="carouselImgSmall carouselImgSmall1" :class="{ 'is-active': activePanel === 0 }" src="/images/Cherry1.png" alt=""/>
            <img class="carouselImgSmall carouselImgSmall2" :class="{ 'is-active': activePanel === 0 }" src="/images/Cherry2.png" alt=""/>
          </section>

          <section class="panel">
            <h2 class="panel-title">Walnut</h2>
            <img class="carouselImg" src="/images/Walnut.png" alt=""/>
            <img class="carouselImgSmall carouselImgSmall1" :class="{ 'is-active': activePanel === 1 }" src="/images/Walnut1.png" alt=""/>
            <img class="carouselImgSmall carouselImgSmall2" :class="{ 'is-active': activePanel === 1 }" src="/images/Walnut2.png" alt=""/>

          </section>

          <section class="panel">
            <h2 class="panel-title">Mint</h2>
            <img ref="mintCarouselRef" class="carouselImg" src="/images/Mint.png" alt=""/>
            <img class="carouselImgSmall carouselImgSmall1" :class="{ 'is-active': activePanel === 2 }" src="/images/Mint1.png" alt=""/>
            <img class="carouselImgSmall carouselImgSmall2" :class="{ 'is-active': activePanel === 2 }" src="/images/Mint2.png" alt=""/>
          </section>

        </div>
      </div>
    </div>

    <!-- ─── Section 4 – your favourite flavors ──────────────────────────── -->
    <section class="panel flavors-section">
      <h2 class="flavors-title">your favorite flavors</h2>
      <div class="flavors-grid">
        <div class="flavor-card">
          <div class="flavor-bubble walnut-bubble">
            <img src="/images/Walnut.png" alt="Walnut" class="flavor-img" />
          </div>
          <span class="flavor-label">walnut</span>
        </div>
        <div class="flavor-card">
          <div class="flavor-bubble mint-bubble">
            <img
              ref="mintBubbleImgRef"
              src="/images/Mint.png"
              alt="Mint"
              class="flavor-img"
              :style="{ opacity: mintBubbleImageHidden ? 0 : 1 }"
            />
          </div>
          <span class="flavor-label">mint</span>
        </div>
        <div class="flavor-card">
          <div class="flavor-bubble cherry-bubble">
            <img src="/images/Cherry.png" alt="Cherry" class="flavor-img" />
          </div>
          <span class="flavor-label">cherry</span>
        </div>
      </div>
    </section>

    <!-- ─── Flying mint image (drop animation overlay) ──────────────────── -->
    <Teleport to="body">
      <img
        v-if="flyingMintVisible"
        src="/images/Mint.png"
        alt=""
        class="flying-mint-img"
        :style="flyingMintStyle"
      />
    </Teleport>

  </div>
</template>

<style scoped>
.carouselImgSmall1{
  transform: translate(11dvw, -27dvh);
  transition: transform 1s cubic-bezier(0.22, 1, 0.36, 1);
  transition-delay: 0.25s;
}
.carouselImgSmall1.is-active {
  transform: translate(5dvw, -30dvh);
}
.carouselImgSmall2{
  transform: translate(-60%, 75%);
  transition: transform 1s cubic-bezier(0.22, 1, 0.36, 1);
  transition-delay: 0.35s;
}
.carouselImgSmall2.is-active {
  transform: translate(-40%, 75%);
}
img.carouselImgSmall{
  max-width: 11.5rem;
  position: absolute;
}

@media (max-width: 1024px) {
  .carouselImgSmall1{
    transform: translate(20dvw, -25dvh);
    transition: transform 1s cubic-bezier(0.22, 1, 0.36, 1);
    transition-delay: 0.25s;
  }
  .carouselImgSmall1.is-active {
    transform: translate(11dvw, -27dvh);
  }
  img.carouselImgSmall {
    max-width: 20dvw;
  }
}

@media (max-width: 768px) {
  img.carouselImgSmall {
    max-width: 35dvw;
  }
}
img.carouselImg {
  max-width: 25rem;
  position: absolute;
}

@media (max-width: 768px) {
  .carouselImgSmall1{
    transform: translate(33dvw, -23dvh);
    transition: transform 1s cubic-bezier(0.22, 1, 0.36, 1);
    transition-delay: 0.25s;
  }
  .carouselImgSmall1.is-active {
    transform: translate(20dvw, -25dvh);
  }
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



/* ── Flavors section ─────────────────────────────────────────────────────── */
.flavors-section {
  background-color: #f0ebe3;
  flex-direction: column;
  justify-content: flex-start;
  padding-top: 16vh;
  gap: 10rem;
}

.flavors-title {
  font-size: clamp(1.8rem, 5vw, 3.5rem);
  font-weight: 700;
  letter-spacing: 0.02em;
  color: #3b2a1a;
  text-align: center;
  margin: 0;
  position: relative;
  z-index: 2;
}

.flavors-grid {
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: center;
  gap: clamp(1.5rem, 5vw, 5rem);
}

.flavor-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.2rem;
}

.flavor-bubble {
  width: clamp(140px, 22vw, 260px);
  height: clamp(140px, 22vw, 260px);
  border-radius: 50%;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  overflow: visible;
  position: relative;
}

.walnut-bubble { background-color: #f5e6a3; }
.mint-bubble   { background-color: #5ecfbf; }
.cherry-bubble { background-color: #dba8c3; }

.flavor-img {
  width: 90%;
  max-width: 220px;
  object-fit: contain;
  position: absolute;
  bottom: -10%;
  transition: opacity 0.2s ease;
}

.flavor-label {
  font-size: clamp(1rem, 2.5vw, 1.6rem);
  font-weight: 700;
  color: #3b2a1a;
  letter-spacing: 0.03em;
  margin-top: 1.8rem;
}

@media (max-width: 600px) {
  .flavors-grid {
    gap: 1rem;
  }
  .flavor-bubble {
    width: 28vw;
    height: 28vw;
  }
}

/* ── Typography ──────────────────────────────────────────────────────────── */
.panel-title {
  //font-size: clamp(2rem, 6vw, 4rem);
  font-weight: 700;
  letter-spacing: 2rem;
  color: rgba(0, 0, 0, 0.55);
  font-size: 25dvw;
  margin-top: 20rem;
}

/* ── Flying mint overlay (mint-drop animation) ───────────────────────────── */
.flying-mint-img {
  position: fixed;
  z-index: 9999;
  object-fit: contain;
  pointer-events: none;
  will-change: top, left, width, height, opacity;
}
</style>
