<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, computed } from 'vue'

// ── DOM refs ──────────────────────────────────────────────────────────────
const sliderSection  = ref<HTMLElement | null>(null)
const flavorsSection = ref<HTMLElement | null>(null)

// Dynamic refs populated by template function-refs
const carouselEls = ref<(HTMLElement | null)[]>([])
const bubbleEls   = ref<(HTMLElement | null)[]>([])

// ── State ─────────────────────────────────────────────────────────────────
const activePanel = ref(-1) // -1 so panel 0 animates in on mount
let isAnimating     = false
let isTransitioning = false

// ── Panel data (single source of truth – add new slides here) ─────────────
const panels = [
  { name: 'Cherry', src: '/images/Cherry.png', src1: '/images/Cherry1.png', src2: '/images/Cherry2.png', color: '#ffb7c5', bubbleColor: '#dba8c3' },
  { name: 'Walnut', src: '/images/Walnut.png', src1: '/images/Walnut1.png', src2: '/images/Walnut2.png', color: '#dec9a8', bubbleColor: '#f5e6a3' },
  { name: 'Mint',   src: '/images/Mint.png',   src1: '/images/Mint1.png',   src2: '/images/Mint2.png',   color: '#b5ead7', bubbleColor: '#5ecfbf' },
]

// ── Background color ──────────────────────────────────────────────────────
const bgColor = computed(() => panels[Math.max(0, activePanel.value)]?.color ?? panels[0]!.color)

// ── Track transform & width (CSS transition driven) ──────────────────────
const trackTransform = computed(() => {
  const idx = Math.max(0, activePanel.value)
  return `translateX(-${idx * 100}vw)`
})
const trackWidth = computed(() => `${panels.length * 100}vw`)

// ── Drop animation state ──────────────────────────────────────────────────
const flyingVisible     = ref(false)
const flyingStyle       = ref<Record<string, string>>({})
const flyingSrc         = ref(panels[0]!.src)
const hiddenBubbleIndex = ref<number | null>(null)

// ── Function-ref setters (used in template :ref bindings) ─────────────────
const setCarouselRef = (idx: number) => (el: any) => { carouselEls.value[idx] = el as HTMLElement | null }
const setBubbleRef   = (idx: number) => (el: any) => { bubbleEls.value[idx]   = el as HTMLElement | null }

// ── Panel navigation ──────────────────────────────────────────────────────
const goToPanel = (index: number) => {
  if (index < 0 || index >= panels.length || index === activePanel.value || isAnimating) return
  isAnimating = true
  activePanel.value = index
  setTimeout(() => { isAnimating = false }, 550)
}

// ── Easing ────────────────────────────────────────────────────────────────
const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

// ── Smooth scroll (manual for precise timing) ────────────────────────────
const smoothScrollTo = (targetY: number, duration = 550): Promise<void> => {
  return new Promise(resolve => {
    const startY    = window.scrollY
    const distance  = targetY - startY
    const startTime = performance.now()

    const step = (now: number) => {
      const elapsed  = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      window.scrollTo(0, startY + distance * easeInOutCubic(progress))
      if (progress < 1) requestAnimationFrame(step)
      else resolve()
    }
    requestAnimationFrame(step)
  })
}

// ── Transition to flavors section (drop animation + scroll) ──────────────
const transitionToFlavors = async () => {
  if (isTransitioning || !flavorsSection.value) return
  isTransitioning = true

  const panelIdx = Math.max(0, activePanel.value)
  const sourceEl = carouselEls.value[panelIdx]
  const targetEl = bubbleEls.value[panelIdx]

  if (!sourceEl || !targetEl) {
    const top = flavorsSection.value.getBoundingClientRect().top + window.scrollY
    await smoothScrollTo(top)
    isTransitioning = false
    return
  }

  // Capture positions BEFORE scrolling
  const startRect  = sourceEl.getBoundingClientRect()
  const targetRect = targetEl.getBoundingClientRect()
  const flavorsTop = flavorsSection.value.getBoundingClientRect().top

  // After scroll, the target shifts up by `flavorsTop`
  const targetFinalTop  = targetRect.top  - flavorsTop
  const targetFinalLeft = targetRect.left

  flyingSrc.value         = panels[panelIdx]?.src ?? panels[0]!.src
  hiddenBubbleIndex.value = panelIdx

  const base: Record<string, string> = {
    position:      'fixed',
    zIndex:        '9999',
    objectFit:     'contain',
    pointerEvents: 'none',
  }

  // 1 – Place clone at carousel image position (no transition)
  flyingStyle.value = {
    ...base,
    top:        `${startRect.top}px`,
    left:       `${startRect.left}px`,
    width:      `${startRect.width}px`,
    height:     `${startRect.height}px`,
    transition: 'none',
    opacity:    '1',
  }
  flyingVisible.value = true

  await nextTick()

  // Start the scroll to section 4
  const scrollTarget = flavorsTop + window.scrollY
  smoothScrollTo(scrollTarget, 550)

  // 2 – Animate the flying image to its target
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      flyingStyle.value = {
        ...base,
        top:        `${targetFinalTop}px`,
        left:       `${targetFinalLeft}px`,
        width:      `${targetRect.width}px`,
        height:     `${targetRect.height}px`,
        transition: 'all 0.55s ease-in-out',
        opacity:    '1',
      }

      // 3 – Cross-fade into the real bubble image
      setTimeout(() => {
        flyingStyle.value = {
          ...flyingStyle.value,
          transition: 'opacity 0.2s ease',
          opacity:    '0',
        }
        hiddenBubbleIndex.value = null

        setTimeout(() => {
          flyingVisible.value = false
          isTransitioning = false
        }, 250)
      }, 550)
    })
  })
}

// ── Check if slider is predominantly visible ─────────────────────────────
const isSliderInView = (): boolean => {
  if (!sliderSection.value) return false
  const rect    = sliderSection.value.getBoundingClientRect()
  const visible = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0)
  return visible / window.innerHeight > 0.5
}

// ── Wheel handler ─────────────────────────────────────────────────────────
const onWheel = (e: WheelEvent) => {
  if (!isSliderInView() || isTransitioning) return

  const absX = Math.abs(e.deltaX)
  const absY = Math.abs(e.deltaY)

  if (absX > absY && absX > 3) {
    // Horizontal → change panel
    e.preventDefault()
    if (isAnimating) return
    goToPanel(activePanel.value + (e.deltaX > 0 ? 1 : -1))
  } else if (absY > absX && e.deltaY > 0) {
    // Vertical DOWN → transition to flavors
    e.preventDefault()
    transitionToFlavors()
  }
  // Vertical UP → don't preventDefault, natural scroll to content above
}

// ── Touch handlers ────────────────────────────────────────────────────────
let touchStartX  = 0
let touchStartY  = 0
let touchHandled = false

const onTouchStart = (e: TouchEvent) => {
  touchStartX  = e.touches[0]?.clientX ?? 0
  touchStartY  = e.touches[0]?.clientY ?? 0
  touchHandled = false
}

const onTouchMove = (e: TouchEvent) => {
  if (!isSliderInView() || isTransitioning) return

  const currentX = e.touches[0]?.clientX ?? touchStartX
  const currentY = e.touches[0]?.clientY ?? touchStartY
  const deltaX   = touchStartX - currentX
  const deltaY   = touchStartY - currentY

  if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
    e.preventDefault() // horizontal swipe → prevent native scroll
  } else if (deltaY > 10) {
    e.preventDefault() // vertical down → we handle the transition
  }
  // vertical up → let native scroll happen
}

const onTouchEnd = (e: TouchEvent) => {
  if (!isSliderInView() || isTransitioning || touchHandled) return

  const deltaX = touchStartX - (e.changedTouches[0]?.clientX ?? touchStartX)
  const deltaY = touchStartY - (e.changedTouches[0]?.clientY ?? touchStartY)

  if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 30) {
    touchHandled = true
    goToPanel(activePanel.value + (deltaX > 0 ? 1 : -1))
  } else if (deltaY > 30) {
    touchHandled = true
    transitionToFlavors()
  }
}

// ── Mouse / pointer drag handlers (PC click-and-drag) ────────────────────
let pointerDown    = false
let pointerStartX  = 0
let pointerStartY  = 0
let pointerHandled = false

const onPointerDown = (e: PointerEvent) => {
  // Only handle primary button (left click), ignore touch (handled separately)
  if (e.pointerType === 'touch' || e.button !== 0) return
  if (!isSliderInView() || isTransitioning) return
  pointerDown    = true
  pointerStartX  = e.clientX
  pointerStartY  = e.clientY
  pointerHandled = false
}

const onPointerMove = (e: PointerEvent) => {
  if (!pointerDown || pointerHandled || isTransitioning) return
  const deltaX = pointerStartX - e.clientX

  // Prevent text selection while dragging horizontally
  if (Math.abs(deltaX) > 10) {
    e.preventDefault()
  }
}

const onPointerUp = (e: PointerEvent) => {
  if (!pointerDown || pointerHandled || isTransitioning) return
  pointerDown = false

  if (!isSliderInView()) return

  const deltaX = pointerStartX - e.clientX
  const deltaY = pointerStartY - e.clientY

  if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 30) {
    pointerHandled = true
    goToPanel(activePanel.value + (deltaX > 0 ? 1 : -1))
  } else if (deltaY > 30) {
    pointerHandled = true
    transitionToFlavors()
  }
}

const onPointerCancel = () => {
  pointerDown = false
}

// ── Lifecycle ─────────────────────────────────────────────────────────────
onMounted(() => {
  setTimeout(() => { activePanel.value = 0 }, 80)
  window.addEventListener('wheel',         onWheel,         { passive: false })
  window.addEventListener('touchstart',    onTouchStart,    { passive: true  })
  window.addEventListener('touchmove',     onTouchMove,     { passive: false })
  window.addEventListener('touchend',      onTouchEnd,      { passive: true  })
  window.addEventListener('pointerdown',   onPointerDown,   { passive: true  })
  window.addEventListener('pointermove',   onPointerMove,   { passive: false })
  window.addEventListener('pointerup',     onPointerUp,     { passive: true  })
  window.addEventListener('pointercancel', onPointerCancel, { passive: true  })
})

onUnmounted(() => {
  window.removeEventListener('wheel',         onWheel)
  window.removeEventListener('touchstart',    onTouchStart)
  window.removeEventListener('touchmove',     onTouchMove)
  window.removeEventListener('touchend',      onTouchEnd)
  window.removeEventListener('pointerdown',   onPointerDown)
  window.removeEventListener('pointermove',   onPointerMove)
  window.removeEventListener('pointerup',     onPointerUp)
  window.removeEventListener('pointercancel', onPointerCancel)
})
</script>

<template>
  <div>

    <!-- ─── Horizontal slider ──────────────────────────────────────────────── -->
    <div ref="sliderSection" class="slider-section" :style="{ backgroundColor: bgColor }">
      <div class="horizontal-track" :style="{ transform: trackTransform, width: trackWidth }">

        <section v-for="(panel, i) in panels" :key="panel.name" class="panel">
          <h2 class="panel-title">{{ panel.name }}</h2>
          <img :ref="setCarouselRef(i)" class="carouselImg" :src="panel.src" alt="" />
          <img
            class="carouselImgSmall carouselImgSmall1"
            :class="{ 'is-active': activePanel === i }"
            :src="panel.src1"
            alt=""
          />
          <img
            class="carouselImgSmall carouselImgSmall2"
            :class="{ 'is-active': activePanel === i }"
            :src="panel.src2"
            alt=""
          />
        </section>

      </div>

      <!-- Navigation dots -->
      <div class="slider-dots">
        <button
          v-for="(p, i) in panels"
          :key="p.name"
          class="dot"
          :class="{ active: activePanel === i }"
          :aria-label="`Go to ${p.name}`"
          @click="goToPanel(i)"
        />
      </div>
    </div>

    <!-- ─── Flavors section ────────────────────────────────────────────────── -->
    <section ref="flavorsSection" class="panel flavors-section">
      <h2 class="flavors-title">your favorite flavors</h2>
      <div class="flavors-grid">
        <div v-for="(panel, i) in panels" :key="panel.name" class="flavor-card">
          <div class="flavor-bubble" :style="{ backgroundColor: panel.bubbleColor }">
            <img
              :ref="setBubbleRef(i)"
              :src="panel.src"
              :alt="panel.name"
              class="flavor-img"
              :style="{ opacity: hiddenBubbleIndex === i ? 0 : 1 }"
            />
          </div>
          <span class="flavor-label">{{ panel.name.toLowerCase() }}</span>
        </div>
      </div>
    </section>

    <!-- ─── Flying image (drop animation overlay) ──────────────────────── -->
    <img
      v-show="flyingVisible"
      :src="flyingSrc"
      alt=""
      class="flying-img"
      :style="flyingStyle"
    />

  </div>
</template>

<style scoped>
/* ── Slider section ──────────────────────────────────────────────────────── */
.slider-section {
  position: relative;
  height: 100vh;
  overflow: hidden;
  transition: background-color 0.5s ease;
  user-select: none;         /* prevent text selection during drag */
  -webkit-user-select: none;
}

.slider-section img {
  -webkit-user-drag: none;   /* prevent native image ghost drag */
  pointer-events: none;      /* let drag events pass through to the section */
}

.horizontal-track {
  display: flex;
  height: 100%;
  will-change: transform;
  transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
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
  position: relative;
}

/* ── Carousel images ─────────────────────────────────────────────────────── */
img.carouselImg {
  max-width: 25rem;
  position: absolute;
}

.carouselImgSmall1 {
  transform: translate(11dvw, -27dvh);
  transition: transform 1s cubic-bezier(0.22, 1, 0.36, 1);
  transition-delay: 0.25s;
}
.carouselImgSmall1.is-active {
  transform: translate(5dvw, -30dvh);
}

.carouselImgSmall2 {
  transform: translate(-60%, 75%);
  transition: transform 1s cubic-bezier(0.22, 1, 0.36, 1);
  transition-delay: 0.35s;
}
.carouselImgSmall2.is-active {
  transform: translate(-40%, 75%);
}

img.carouselImgSmall {
  max-width: 11.5rem;
  position: absolute;
}

/* ── Navigation dots ─────────────────────────────────────────────────────── */
.slider-dots {
  position: absolute;
  bottom: 2.5rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.75rem;
  z-index: 10;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid rgba(0, 0, 0, 0.35);
  background: transparent;
  cursor: pointer;
  padding: 0;
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.dot.active {
  background: rgba(0, 0, 0, 0.5);
  border-color: rgba(0, 0, 0, 0.5);
}

.dot:hover {
  background: rgba(0, 0, 0, 0.3);
}

/* ── Typography ──────────────────────────────────────────────────────────── */
.panel-title {
  font-weight: 700;
  letter-spacing: 2rem;
  color: rgba(0, 0, 0, 0.55);
  font-size: 22dvw;
  margin-top: 20rem;
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

/* ── Flying image overlay (drop animation) ───────────────────────────────── */
.flying-img {
  position: fixed;
  z-index: 9999;
  object-fit: contain;
  pointer-events: none;
  will-change: top, left, width, height, opacity;
}

/* ── Responsive ──────────────────────────────────────────────────────────── */
@media (max-width: 1024px) {
  .carouselImgSmall1 {
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
  .carouselImgSmall1 {
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

@media (max-width: 600px) {
  .flavors-grid {
    gap: 1rem;
  }
  .flavor-bubble {
    width: 28vw;
    height: 28vw;
  }
}
</style>

