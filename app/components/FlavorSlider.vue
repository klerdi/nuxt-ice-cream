<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'

interface Flavor {
  id: number
  brand: string
  title: string
  description: string
  image: string
  bgColor: string
  accentColor: string
}

const flavors: Flavor[] = [
  {
    id: 1,
    brand: 'Melted',
    title: 'Cherry\nBliss!',
    description: 'Bold, rich, and bursting with cherry sweetness in every bite.',
    image: '/images/Cherry.png',
    bgColor: '#f2b5c4',
    accentColor: '#d4708a',
  },
  {
    id: 2,
    brand: 'Melted',
    title: 'Walnut\nCrunch',
    description: 'Smooth, nutty, and irresistibly creamy with a satisfying crunch.',
    image: '/images/Walnut.png',
    bgColor: '#e8d5a3',
    accentColor: '#b89a5a',
  },
  {
    id: 3,
    brand: 'Melted',
    title: 'Fresh\n& Minty',
    description: 'Cool, refreshing mint that feels like a breeze on a hot day.',
    image: '/images/Mint.png',
    bgColor: '#c3e6c8',
    accentColor: '#6dab6d',
  },
  {
    id: 4,
    brand: 'Melted',
    title: 'Cherry\nSunset',
    description: 'A dreamy blend of ripe cherries and golden hour warmth.',
    image: '/images/Cherry1.png',
    bgColor: '#f5c6cb',
    accentColor: '#c97d8a',
  },
  {
    id: 5,
    brand: 'Melted',
    title: 'Nutty\nDelight',
    description: 'Toasted walnuts folded into velvety smooth ice cream perfection.',
    image: '/images/Walnut1.png',
    bgColor: '#dbc9a0',
    accentColor: '#a68b52',
  },
  {
    id: 6,
    brand: 'Melted',
    title: 'Mint\nBreeze',
    description: 'Light, airy, and wonderfully fresh with every single scoop.',
    image: '/images/Mint1.png',
    bgColor: '#b5ead7',
    accentColor: '#5fb88f',
  },
]

// We clone items for infinite scroll: [last3...items...first3]
const cloneCount = 3
const slides = computed(() => {
  const before = flavors.slice(-cloneCount)
  const after = flavors.slice(0, cloneCount)
  return [...before, ...flavors, ...after]
})

const trackRef = ref<HTMLElement | null>(null)
const containerRef = ref<HTMLElement | null>(null)
const currentIndex = ref(cloneCount) // start at first real item
const isTransitioning = ref(true)
const slidesPerView = ref(3)

// Touch / drag state
const isDragging = ref(false)
const dragStartX = ref(0)
const dragCurrentX = ref(0)
const dragOffset = ref(0)

const updateSlidesPerView = () => {
  slidesPerView.value = window.innerWidth < 768 ? 1 : 3
}

// Each slide as a % of the track's own width
const slideWidthInTrack = computed(() => 100 / slides.value.length)

const trackStyle = computed(() => {
  const translateX = -(currentIndex.value * slideWidthInTrack.value) + dragOffset.value
  return {
    transform: `translateX(${translateX}%)`,
    transition: isTransitioning.value && !isDragging.value ? 'transform 0.45s cubic-bezier(0.25, 0.1, 0.25, 1)' : 'none',
    width: `${(slides.value.length / slidesPerView.value) * 100}%`,
  }
})

const slideStyle = computed(() => ({
  width: `${100 / slides.value.length}%`,
}))



const checkInfiniteLoop = () => {
  const totalReal = flavors.length
  if (currentIndex.value >= totalReal + cloneCount) {
    isTransitioning.value = false
    currentIndex.value = cloneCount
    // Force reflow then restore transition
    nextTick(() => {
      void trackRef.value?.offsetHeight
      nextTick(() => {
        isTransitioning.value = true
      })
    })
  } else if (currentIndex.value < cloneCount) {
    isTransitioning.value = false
    currentIndex.value = totalReal + cloneCount - 1
    nextTick(() => {
      void trackRef.value?.offsetHeight
      nextTick(() => {
        isTransitioning.value = true
      })
    })
  }
}

const next = () => {
  if (isDragging.value) return
  isTransitioning.value = true
  currentIndex.value += 1
  setTimeout(checkInfiniteLoop, 470)
}

const prev = () => {
  if (isDragging.value) return
  isTransitioning.value = true
  currentIndex.value -= 1
  setTimeout(checkInfiniteLoop, 470)
}

// Touch events
const onTouchStart = (e: TouchEvent) => {
  const touch = e.touches[0]
  if (!touch) return
  isDragging.value = true
  dragStartX.value = touch.clientX
  dragCurrentX.value = touch.clientX
  dragOffset.value = 0
}

const onTouchMove = (e: TouchEvent) => {
  if (!isDragging.value) return
  const touch = e.touches[0]
  if (!touch) return
  dragCurrentX.value = touch.clientX
  const containerWidth = containerRef.value?.offsetWidth ?? 1
  const diff = dragCurrentX.value - dragStartX.value
  // Convert px drag to percentage of track width
  const trackWidthPx = containerWidth * (slides.value.length / slidesPerView.value)
  dragOffset.value = (diff / trackWidthPx) * 100
}

const onTouchEnd = () => {
  if (!isDragging.value) return
  isDragging.value = false
  const threshold = slideWidthInTrack.value * 0.15
  if (dragOffset.value < -threshold) {
    next()
  } else if (dragOffset.value > threshold) {
    prev()
  }
  dragOffset.value = 0
}

// Mouse drag events
const onMouseDown = (e: MouseEvent) => {
  isDragging.value = true
  dragStartX.value = e.clientX
  dragCurrentX.value = e.clientX
  dragOffset.value = 0
  e.preventDefault()
}

const onMouseMove = (e: MouseEvent) => {
  if (!isDragging.value) return
  dragCurrentX.value = e.clientX
  const containerWidth = containerRef.value?.offsetWidth ?? 1
  const diff = dragCurrentX.value - dragStartX.value
  const trackWidthPx = containerWidth * (slides.value.length / slidesPerView.value)
  dragOffset.value = (diff / trackWidthPx) * 100
}

const onMouseUp = () => {
  if (!isDragging.value) return
  isDragging.value = false
  const threshold = slideWidthInTrack.value * 0.15
  if (dragOffset.value < -threshold) {
    next()
  } else if (dragOffset.value > threshold) {
    prev()
  }
  dragOffset.value = 0
}

const onMouseLeave = () => {
  if (isDragging.value) onMouseUp()
}

onMounted(() => {
  updateSlidesPerView()
  window.addEventListener('resize', updateSlidesPerView)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateSlidesPerView)
})
</script>

<template>
  <section class="flavor-slider-section py-16 md:py-24 bg-[#f0faf0] overflow-hidden">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="text-3xl md:text-5xl font-bold text-center text-gray-800 mb-12 md:mb-16">
        Explore Our Flavors
      </h2>

      <div class="relative">
        <!-- Slider container -->
        <div
          ref="containerRef"
          class="overflow-hidden"
          @touchstart.passive="onTouchStart"
          @touchmove.passive="onTouchMove"
          @touchend="onTouchEnd"
          @mousedown="onMouseDown"
          @mousemove="onMouseMove"
          @mouseup="onMouseUp"
          @mouseleave="onMouseLeave"
        >
          <div
            ref="trackRef"
            class="flex"
            :style="trackStyle"
          >
            <div
              v-for="(flavor, idx) in slides"
              :key="`slide-${idx}`"
              :style="slideStyle"
              class="flex-shrink-0 px-2 md:px-4"
            >
              <!-- Card -->
              <div
                class="flavor-card relative rounded-[2rem] overflow-hidden flex flex-col select-none"
                :style="{ backgroundColor: flavor.bgColor }"
              >
                <!-- Brand -->
                <div class="pt-6 px-6">
                  <p class="font-brand text-lg md:text-xl text-white/80 italic">
                    {{ flavor.brand }}
                  </p>
                </div>

                <!-- Image -->
                <div class="flex-1 flex items-center justify-center px-4 py-4 relative">
                  <img
                    :src="flavor.image"
                    :alt="flavor.title.replace('\n', ' ')"
                    class="w-48 h-48 md:w-56 md:h-56 object-contain drop-shadow-xl pointer-events-none"
                    draggable="false"
                  />
                </div>

                <!-- Text -->
                <div class="px-6 pb-4">
                  <h3 class="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight whitespace-pre-line">
                    {{ flavor.title }}
                  </h3>
                  <p class="mt-2 text-sm md:text-base text-gray-700/80 leading-relaxed max-w-[220px]">
                    {{ flavor.description }}
                  </p>
                </div>

                <!-- Navigation -->
                <div class="flex items-center justify-between px-6 pb-6 pt-2">
                  <button
                    class="nav-btn flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors duration-200"
                    :style="{ borderColor: flavor.accentColor, color: flavor.accentColor }"
                    aria-label="Previous flavor"
                    @click.stop="prev"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  <span class="text-sm font-medium text-gray-600/70 tracking-wide">Skip</span>

                  <button
                    class="nav-btn flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors duration-200"
                    :style="{ borderColor: flavor.accentColor, color: flavor.accentColor }"
                    aria-label="Next flavor"
                    @click.stop="next"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.font-brand {
  font-family: 'Georgia', 'Times New Roman', serif;
  font-style: italic;
}

.flavor-card {
  min-height: 460px;
  cursor: grab;
}

.flavor-card:active {
  cursor: grabbing;
}

.nav-btn:hover {
  background-color: rgba(255, 255, 255, 0.4);
}

/* Disable text selection while dragging */
.flavor-slider-section {
  -webkit-user-select: none;
  user-select: none;
}
</style>

