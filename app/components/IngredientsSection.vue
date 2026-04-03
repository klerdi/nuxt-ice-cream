<template>
  <section class="ingredients-section" ref="sectionRef">
    <div class="ingredients-container">

      <!-- Text Header -->
      <div class="ingredients-header">
        <p class="ingredients-subtitle" :class="{ 'animate-in': isVisible }">{{ $t('ourStoryDiscover') }}</p>
        <h2 class="ingredients-title" :class="{ 'animate-in': isVisible }">{{ $t('ingredientsTitle') }}</h2>
        <p class="ingredients-description" :class="{ 'animate-in': isVisible }">
          {{ $t('ingredientsDescription') }}
        </p>
      </div>

    </div>
    <div class="ingredients-image-wrap" :class="{ 'animate-in': isVisible }">
      <img
          src="/images/ingridients.png"
          :alt="$t('ingredientsImgAlt')"
          class="ingredients-img"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const sectionRef = ref<HTMLElement | null>(null);
const isVisible = ref(false);
let observer: IntersectionObserver | null = null;


onMounted(() => {
  if (sectionRef.value) {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isVisible.value = true;
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -80px 0px',
      }
    );
    observer.observe(sectionRef.value);
  }
});

onUnmounted(() => {
  if (observer) observer.disconnect();
});
</script>

<style scoped>
.ingredients-section {
  background: #c6e6c7;
  //background: #111111 url('https://img.freepik.com/free-vector/hand-drawn-ice-cream-blackboard-background_23-2148984873.jpg?t=st=1775212573~exp=1775216173~hmac=efe98ded603021356ea327355527f8d3fcf6b78c5747cf2d1569205b398cf8c9&w=1480') center / cover no-repeat;
  width: 100%;
  padding: 6rem 2rem;
  color: white;
  overflow: hidden;
}

.ingredients-container {
  max-width: 900px;
  margin: 0 auto;
  text-align: center;
}

/* ── Header animations ── */
.ingredients-subtitle,
.ingredients-title,
.ingredients-description {
  opacity: 0;
  transform: translateY(28px);
  transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1),
              transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.ingredients-subtitle.animate-in {
  opacity: 1;
  transform: translateY(0);
  transition-delay: 0.05s;
}

.ingredients-title.animate-in {
  opacity: 1;
  transform: translateY(0);
  transition-delay: 0.2s;
}

.ingredients-description.animate-in {
  opacity: 1;
  transform: translateY(0);
  transition-delay: 0.38s;
}

.ingredients-subtitle {
  font-family: 'Dancing Script', 'Brush Script MT', cursive, serif;
  font-size: 2.2rem;
  font-weight: 400;
  color: #d4b896;
  margin: 0 0 0.4rem;
  line-height: 1;
}

.ingredients-title {
  font-size: 3rem;
  font-weight: 800;
  color: #6dab6d;
  margin: 0 0 1.5rem;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.ingredients-description {
  font-size: 0.97rem;
  line-height: 1.75;
  color: #6dab6d;
  max-width: 680px;
  margin: 0 auto;
}

/* ── Single image ── */
.ingredients-image-wrap {

  opacity: 0;
  transform: translateY(36px) scale(0.97);
  transition: opacity 0.9s cubic-bezier(0.4, 0, 0.2, 1),
              transform 0.9s cubic-bezier(0.4, 0, 0.2, 1);
  transition-delay: 0.55s;
  max-width: 60rem;
  margin: 0 auto;
  border-radius: 8px;
  overflow: hidden;
}

.ingredients-image-wrap.animate-in {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.ingredients-img {
  display: block;
  width: 100%;
  height: auto;
  object-fit: cover;
  filter: brightness(0.9) contrast(1.05);
}

/* ── Responsive ── */
@media (max-width: 768px) {
  .ingredients-title {
    font-size: 2.2rem;
  }

  .ingredients-subtitle {
    font-size: 1.7rem;
  }

  .ingredients-description {
    font-size: 0.9rem;
  }
}
</style>

