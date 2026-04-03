<template>
  <section class="our-story-section" id="our-story">
    <div class="our-story-container">

      <!-- Right side - Content -->
      <div class="story-content" ref="contentRef">
        <div class="content-inner">
          <h3 class="story-subtitle" :class="{ 'animate-in': isVisible }">{{ $t('ourStoryDiscover') }}</h3>
          <h2 class="story-title" :class="{ 'animate-in': isVisible }">{{ $t('ourStoryTitle') }}</h2>
          <p class="story-description" :class="{ 'animate-in': isVisible }">
            {{ $t('ourStoryDescription') }}
          </p>
<!--          <a href="#about" class="story-link" :class="{ 'animate-in': isVisible }">-->
<!--            More About Us-->
<!--            <span class="arrow">→</span>-->
<!--          </a>-->
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const contentRef = ref<HTMLElement | null>(null);
const isVisible = ref(false);
let observer: IntersectionObserver | null = null;

onMounted(() => {
  if (contentRef.value) {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isVisible.value = true;
          }
        });
      },
      {
        threshold: 0.2, // Trigger when 20% of the element is visible
        rootMargin: '0px 0px -100px 0px' // Trigger slightly before element enters viewport
      }
    );

    observer.observe(contentRef.value);
  }
});

onUnmounted(() => {
  if (observer) {
    observer.disconnect();
  }
});
</script>

<style scoped>
.our-story-section {
  background: #171717;
  width: 100%;
  color: #fff;
}

.our-story-container {
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  background-image: url('/images/cones.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
}

.our-story-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, rgb(0 0 0 / 12%), rgb(0 0 0 / 33%));
  z-index: 1;
}

.story-content {
  color: white;
  height: 100%;
  min-height: 370px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rem 3rem;
  position: relative;
  z-index: 2;
}

.content-inner {
  max-width: 500px;
}

/* Animation classes */
.story-subtitle,
.story-title,
.story-description,
.story-link {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.story-subtitle.animate-in {
  opacity: 1;
  transform: translateY(0);
  transition-delay: 0.1s;
}

.story-title.animate-in {
  opacity: 1;
  transform: translateY(0);
  transition-delay: 0.3s;
}

.story-description.animate-in {
  opacity: 1;
  transform: translateY(0);
  transition-delay: 0.5s;
}

.story-link.animate-in {
  opacity: 1;
  transform: translateY(0);
  transition-delay: 0.7s;
}

.story-subtitle {
  font-family: 'Brush Script MT', cursive, 'Dancing Script', serif;
  font-size: 2.5rem;
  color: white;
  margin: 0;
  margin-bottom: 0.5rem;
  font-weight: 400;
  line-height: 1;
}

.story-title {
  font-size: 3.5rem;
  font-weight: 700;
  color: white;
  margin: 0;
  margin-bottom: 1.5rem;
  line-height: 1.1;
}

.story-description {
  font-size: 1rem;
  line-height: 1.7;
  color: white;
  margin-bottom: 2rem;
}

.story-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #999;
  text-decoration: none;
  font-size: 1rem;
  font-weight: 500;
}

.story-link:hover {
  color: #333;
  transition: color 0.3s ease;
}

.story-link .arrow {
  display: inline-block;
  transition: transform 0.3s ease;
}

.story-link:hover .arrow {
  transform: translateX(5px);
}

/* Responsive design */
@media (max-width: 1024px) {

  .story-content {
    padding: 3rem 2rem;
  }

  .story-title {
    font-size: 3rem;
  }

  .story-subtitle {
    font-size: 2rem;
  }
}

@media (max-width: 768px) {



  .story-content {
    padding: 2rem 1.5rem;
    min-height: auto;
  }

  .story-title {
    font-size: 2.5rem;
  }

  .story-subtitle {
    font-size: 1.75rem;
  }

  .story-description {
    font-size: 0.95rem;
  }
}
</style>


