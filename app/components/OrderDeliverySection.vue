<template>
  <section class="order-delivery-section" id="delivery">
    <div class="order-delivery-container">
      <div class="order-delivery-content" ref="contentRef">
        <div class="content-inner">
<!--          <h3 class="delivery-subtitle" :class="{ 'animate-in': isVisible }">Order Now</h3>-->
          <h2 class="delivery-title text-center" :class="{ 'animate-in': isVisible }">{{ $t('orderDeliveryTitle') }}</h2>
          <div class="delivery-buttons" :class="{ 'animate-in': isVisible }">
            <article class="delivery-card" style="border-top: 4px solid #2563eb;">
              <div class="delivery-card-header">
                <h4 class="delivery-card-title">{{ $t('woltTitle') }}</h4>
                <span class="delivery-badge external">{{ $t('badgeExternal') }}</span>
              </div>
              <p class="delivery-card-meta">{{ $t('woltMeta') }}</p>
              <a
                href="https://wolt.com/en/alb/tirana"
                target="_blank"
                rel="noopener noreferrer"
                class="delivery-btn wolt-btn"
              >
                {{ $t('woltBtn') }}
              </a>
            </article>

            <article class="delivery-card" style="border-top: 4px solid #047857;">
              <div class="delivery-card-header">
                <h4 class="delivery-card-title">{{ $t('iceTitle') }}</h4>
                <span class="delivery-badge value">{{ $t('badgeBestValue') }}</span>
              </div>
              <p class="delivery-card-meta">{{ $t('iceMeta') }}</p>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                class="delivery-btn ice-btn"
              >
                {{ $t('iceBtn') }}
              </a>
            </article>
          </div>
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
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px',
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
.order-delivery-section {
  background: #171717;
  width: 100%;
  color: #fff;
}

.order-delivery-container {
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  background: #111111 url('https://img.freepik.com/free-photo/ice-cream-flavors-pink-table_23-2148268187.jpg?t=st=1775220353~exp=1775223953~hmac=8620cd67f66f9d6f22732b84c3060d0b1f4c4bca2d848858107f162acc71c2cf&w=740') center / cover no-repeat;

  //background-image: url('https://www.rivaicmimarlik.com/upload/images/sayfalar/2023/ozgun-cafeler-icin-bar-masalari-45226-3913606829.jpg');
  //background-size: cover;
  //background-position: center;
  //background-repeat: no-repeat;
  position: relative;
}

.order-delivery-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to top, rgb(0 0 0 / 4%), rgb(0 0 0 / 30%));
  z-index: 1;
}

.order-delivery-content {
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
  //max-width: 760px;
}

/* Animation classes */
.delivery-subtitle,
.delivery-title,
.delivery-buttons {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.delivery-subtitle.animate-in {
  opacity: 1;
  transform: translateY(0);
  transition-delay: 0.1s;
}

.delivery-title.animate-in {
  opacity: 1;
  transform: translateY(0);
  transition-delay: 0.3s;
}

.delivery-buttons.animate-in {
  opacity: 1;
  transform: translateY(0);
  transition-delay: 0.5s;
}

.delivery-subtitle {
  font-family: 'Brush Script MT', cursive, 'Dancing Script', serif;
  font-size: 2.5rem;
  color: white;
  margin: 0 0 0.5rem;
  font-weight: 400;
  line-height: 1;
}

.delivery-title {
  font-size: 3.5rem;
  font-weight: 700;
  color: white;
  margin: 0 0 2rem;
  line-height: 1.1;
}

.delivery-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 1.25rem;
  justify-content: center;
}

.delivery-card {
  background: #f1f3f5;
  border-radius: 16px;
  padding: 1.5rem;
  color: #0f172a;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  min-width: 22rem;
  //flex: 1 1 320px;
}

.delivery-card-header {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: center;
}

.delivery-card-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
}

.delivery-card-meta {
  margin: 0;
  font-size: 1rem;
  line-height: 1.4;
  color: #1f2937;
}

.delivery-badge {
  border-radius: 999px;
  font-size: 0.82rem;
  font-weight: 700;
  padding: 0.3rem 0.7rem;
  white-space: nowrap;
}

.delivery-badge.external {
  background: #dbeafe;
  color: #2563eb;
}

.delivery-badge.value {
  background: #d1fae5;
  color: #047857;
}

.delivery-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.8rem 3.25rem;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  text-decoration: none;
  transition: transform 0.25s ease, box-shadow 0.25s ease, opacity 0.25s ease;
  width: fit-content;
  margin: auto;
}

.delivery-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
  opacity: 0.95;
}

.wolt-btn {
  background: #1d7bf2;
  color: #fff;
}

.ice-btn {
  background: #06a873;
  color: #ffffff;
}

/* Responsive */
@media (max-width: 1024px) {
  .order-delivery-content {
    padding: 3rem 2rem;
  }

  .delivery-title {
    font-size: 3rem;
  }

  .delivery-subtitle {
    font-size: 2rem;
  }
}

@media (max-width: 768px) {
  .order-delivery-content {
    padding: 2rem 1.5rem;
    min-height: auto;
  }

  .delivery-title {
    font-size: 2.5rem;
  }

  .delivery-subtitle {
    font-size: 1.75rem;
  }

  .delivery-card {
    flex-basis: 100%;
    padding: 1rem;
  }

  .delivery-card-title {
    font-size: 1.35rem;
  }

  .delivery-card-meta {
    font-size: 1rem;
  }
}
</style>
