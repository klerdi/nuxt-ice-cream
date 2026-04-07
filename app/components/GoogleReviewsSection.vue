<template>
  <section class="reviews-section" id="reviews">
    <div class="reviews-container">
      <div class="reviews-header">
        <div class="google-logo" aria-hidden="true">
          <svg width="84" height="84" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
        </div>

        <div class="google-rating">
          <div class="rating-stars" aria-label="Five star rating">
            <div
              v-for="n in 5"
              :key="`rating-star-${n}`"
              class="rating-star"
              :style="`--fill-width: ${getStarFillPercent(n, rating)}%`"
            >
              &#9733;
            </div>
          </div>

          <p class="rating-label">
            <span class="rating-score">{{ rating.toFixed(1) }}</span>
            rating from
            <span class="rating-count">{{ totalReviews }}</span>
            reviews
          </p>

          <div class="rating-social-proof">
            <div class="rating-avatars">
              <div
                v-for="reviewer in featuredReviewers"
                :key="`header-reviewer-${reviewer.id}`"
                class="rating-avatar"
              >
                <img
                  v-if="reviewer.profilePhotoUrl"
                  :src="reviewer.profilePhotoUrl"
                  :alt="reviewer.name"
                  class="avatar-img"
                  referrerpolicy="no-referrer"
                />
                <span v-else>{{ reviewer.initials }}</span>
              </div>
              <div v-if="extraReviewerCount > 0" class="rating-avatar more-reviewers">+{{ extraReviewerCount }}</div>
            </div>

            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              class="leave-review-btn"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35z"/>
              </svg>
              <span>Leave a review</span>
            </a>
          </div>
        </div>
      </div>
      <div class="reviews-carousel-wrapper" @mouseenter="pauseAutoScroll" @mouseleave="resumeAutoScroll">
        <div
          class="reviews-carousel"
          ref="carouselRef"
          @mousedown="onMouseDown"
          @mousemove="onMouseMove"
          @mouseup="onMouseUp"
          @mouseleave="onMouseLeave"
          @touchstart="onTouchStart"
          @touchmove="onTouchMove"
          @touchend="onTouchEnd"
          :class="{ 'is-dragging': isDragging }"
        >
          <div
            v-for="review in duplicatedReviews"
            :key="`${review.id}-${review.duplicateIndex}`"
            class="review-card"
            @click="leaveReview()"
          >
            <div class="review-header">
              <div class="reviewer-info">
                <div class="reviewer-avatar">
                  <img
                    v-if="review.profilePhotoUrl"
                    :src="review.profilePhotoUrl"
                    :alt="review.name"
                    class="avatar-img"
                    referrerpolicy="no-referrer"
                  />
                  <span v-else>{{ review.initials }}</span>
                </div>
                <div class="reviewer-details">
                  <h4 class="reviewer-name">{{ review.name }}</h4>
                  <p class="review-date">{{ review.date }}</p>
                </div>
              </div>
              <div class="review-stars">
                <div v-for="n in 5" :key="n" class="review-star" style="--fill-width: 100%;">&#9733;</div>
              </div>
            </div>

            <p class="review-text">{{ review.text }}</p>

            <div class="google-badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span>Google Review</span>
            </div>
          </div>
        </div>
      </div>

<!--      <div class="reviews-cta">-->
<!--        <a-->
<!--          href="https://www.google.com/maps/place/ATHENA+Greek+Street+Food/@41.3306658,19.8315823,17z/data=!4m8!3m7!1s0x1350317cb74f0c87:0xc29ea0ec42ebd242!8m2!3d41.3306658!4d19.8341572!9m1!1b1!16s%2Fg%2F11y3h8wt7q?entry=ttu"-->
<!--          target="_blank"-->
<!--          rel="noopener noreferrer"-->
<!--          class="view-all-btn"-->
<!--        >-->
<!--          View All Reviews on Google-->
<!--          <span class="arrow">â†’</span>-->
<!--        </a>-->
<!--      </div>-->
    </div>
  </section>
</template>

<script setup lang="ts">
interface Review {
  id: number;
  name: string;
  initials: string;
  date: string;
  text: string;
  rating: number;
  profilePhotoUrl?: string;
  authorUrl?: string;
  duplicateIndex?: number;
}

interface ReviewsData {
  rating: number;
  totalReviews: number;
  reviews: Review[];
}

// Default/fallback reviews
const defaultReviews: Review[] = [
  {
    id: 1,
    name: "Maria Kola",
    initials: "MK",
    date: "2 weeks ago",
    text: "Best Greek food in Tirana! The chicken souvlaki is absolutely delicious, and the portions are generous. Service is always fast and friendly. Highly recommend!",
    rating: 5
  },
  {
    id: 2,
    name: "Arben Hoxha",
    initials: "AH",
    date: "1 month ago",
    text: "Authentic Greek taste! The gyros reminds me of my trips to Athens. Fresh ingredients, great prices, and the delivery is super quick. My go-to place for Greek street food.",
    rating: 5
  },
  {
    id: 3,
    name: "Elona Shehu",
    initials: "ES",
    date: "3 weeks ago",
    text: "Amazing food and atmosphere! The pork wrap is my favorite. Everything is freshly made and you can taste the quality. The staff is very welcoming. Will definitely come back!",
    rating: 5
  },
  {
    id: 4,
    name: "Denis Mata",
    initials: "DM",
    date: "1 week ago",
    text: "Fantastic experience! Ordered through WhatsApp and the food arrived hot and fresh. The Greek fries with feta are a must-try. Best street food in town, hands down!",
    rating: 5
  },
  {
    id: 5,
    name: "Ina Berisha",
    initials: "IB",
    date: "2 months ago",
    text: "Love this place! The souvlaki plate is huge and perfect for sharing. Great value for money and the tzatziki sauce is absolutely perfect. Highly recommended!",
    rating: 5
  },
  {
    id: 6,
    name: "Kledi Rama",
    initials: "KR",
    date: "3 weeks ago",
    text: "Top quality Greek street food! Fresh ingredients, generous portions, and amazing taste. The delivery service is reliable and fast. My whole family loves it!",
    rating: 5
  }
];

const defaultData: ReviewsData = {
  rating: 5.0,
  totalReviews: 100,
  reviews: defaultReviews
};

// Fetch reviews from API with fallback to default data
const { data: reviewsData } = await useFetch<ReviewsData>('/api/google-reviews', {
  lazy: false,
  server: true,
  default: () => defaultData
});

// Use fetched data if valid, otherwise use default
const reviews = computed(() => {
  const fetchedReviews = reviewsData.value?.reviews || [];
  console.log("Fetched reviews:", fetchedReviews);
  return fetchedReviews.length > 0 ? fetchedReviews : defaultReviews;
});

const rating = computed(() => reviewsData.value?.rating || 5.0);
const totalReviews = computed(() => reviewsData.value?.totalReviews || 100);

const featuredReviewers = computed(() => reviews.value.slice(0, 3));
const extraReviewerCount = computed(() => Math.max(totalReviews.value - featuredReviewers.value.length, 0));

// Carousel refs and state
const carouselRef = ref<HTMLElement | null>(null);
const scrollPosition = ref(0);
const animationId = ref<number | null>(null);

// Dragging state
const isDragging = ref(false);
const startX = ref(0);
const scrollLeft = ref(0);
const dragVelocity = ref(0);
const lastX = ref(0);
const lastTimestamp = ref(0);

// Duplicate reviews for infinite scrolling
const duplicatedReviews = computed(() => {
  const originalReviews = reviews.value;
  // Create 3 copies to ensure smooth infinite scroll
  return [
    ...originalReviews.map((r) => ({ ...r, duplicateIndex: 0 })),
    ...originalReviews.map((r) => ({ ...r, duplicateIndex: 1 })),
    ...originalReviews.map((r) => ({ ...r, duplicateIndex: 2 }))
  ];
});

const getStarFillPercent = (starIndex: number, score: number) => {
  const normalizedScore = Math.max(0, Math.min(score, 5));
  const starFill = Math.max(0, Math.min(1, normalizedScore - (starIndex - 1)));
  console.log(`Calculating fill for star ${starIndex} with score ${score}`, starFill);

  return Math.round(starFill * 100);

};

// Auto-scroll functionality
const startAutoScroll = () => {
  const carousel = carouselRef.value;
  if (!carousel) return;

  const scroll = () => {
    if (!carousel) return;

    // Scroll speed (pixels per frame) - adjust for slower/faster scrolling
    const scrollSpeed = 0.5; // Lower value = slower scroll
    scrollPosition.value += scrollSpeed;

    // Get the width of one set of reviews
    const originalSetWidth = carousel.scrollWidth / 3;

    // Reset scroll position for infinite loop
    if (scrollPosition.value >= originalSetWidth) {
      scrollPosition.value = 0;
    }

    carousel.scrollLeft = scrollPosition.value;
    animationId.value = requestAnimationFrame(scroll);
  };

  animationId.value = requestAnimationFrame(scroll);
};

// Pause on hover
const pauseAutoScroll = () => {
  if (animationId.value) {
    cancelAnimationFrame(animationId.value);
    animationId.value = null;
  }
};

const resumeAutoScroll = () => {
  if (!animationId.value && !isDragging.value) {
    startAutoScroll();
  }
};

// Mouse drag handlers
const onMouseDown = (e: MouseEvent) => {
  const carousel = carouselRef.value;
  if (!carousel) return;

  isDragging.value = true;
  startX.value = e.pageX - carousel.offsetLeft;
  scrollLeft.value = carousel.scrollLeft;
  lastX.value = e.pageX;
  lastTimestamp.value = Date.now();
  dragVelocity.value = 0;

  // Pause auto-scroll when dragging
  pauseAutoScroll();

  // Prevent text selection while dragging
  e.preventDefault();
};

const onMouseMove = (e: MouseEvent) => {
  if (!isDragging.value) return;
  const carousel = carouselRef.value;
  if (!carousel) return;

  e.preventDefault();
  const x = e.pageX - carousel.offsetLeft;
  const walk = (x - startX.value) * 2; // Multiply for faster drag
  carousel.scrollLeft = scrollLeft.value - walk;
  scrollPosition.value = carousel.scrollLeft;

  // Calculate velocity for momentum
  const now = Date.now();
  const timeDelta = now - lastTimestamp.value;
  if (timeDelta > 0) {
    dragVelocity.value = (e.pageX - lastX.value) / timeDelta;
  }
  lastX.value = e.pageX;
  lastTimestamp.value = now;
};

const onMouseUp = () => {
  isDragging.value = false;

  // Resume auto-scroll after a short delay
  setTimeout(() => {
    if (!isDragging.value) {
      resumeAutoScroll();
    }
  }, 100);
};

const onMouseLeave = () => {
  if (isDragging.value) {
    isDragging.value = false;

    // Resume auto-scroll after a short delay
    setTimeout(() => {
      if (!isDragging.value) {
        resumeAutoScroll();
      }
    }, 100);
  }
};

// Touch event handlers for mobile
const onTouchStart = (e: TouchEvent) => {
  const carousel = carouselRef.value;
  if (!carousel) return;

  const touch = e.touches[0];
  isDragging.value = true;
  startX.value = touch.pageX - carousel.offsetLeft;
  scrollLeft.value = carousel.scrollLeft;
  lastX.value = touch.pageX;
  lastTimestamp.value = Date.now();
  dragVelocity.value = 0;

  // Pause auto-scroll when dragging
  pauseAutoScroll();
};

const onTouchMove = (e: TouchEvent) => {
  if (!isDragging.value) return;
  const carousel = carouselRef.value;
  if (!carousel) return;

  const touch = e.touches[0];
  const x = touch.pageX - carousel.offsetLeft;
  const walk = (x - startX.value) * 2;
  carousel.scrollLeft = scrollLeft.value - walk;
  scrollPosition.value = carousel.scrollLeft;

  // Calculate velocity for momentum
  const now = Date.now();
  const timeDelta = now - lastTimestamp.value;
  if (timeDelta > 0) {
    dragVelocity.value = (touch.pageX - lastX.value) / timeDelta;
  }
  lastX.value = touch.pageX;
  lastTimestamp.value = now;

  // Prevent default scrolling on touch devices
  e.preventDefault();
};

const onTouchEnd = () => {
  isDragging.value = false;

  // Resume auto-scroll after a short delay
  setTimeout(() => {
    if (!isDragging.value) {
      resumeAutoScroll();
    }
  }, 100);
};

// Leave a review
const leaveReview = () => {
  window.open(
    'https://www.google.com/maps/place/ATHENA+Greek+Street+Food/@41.3306658,19.8315823,17z/data=!4m8!3m7!1s0x1350317cb74f0c87:0xc29ea0ec42ebd242!8m2!3d41.3306658!4d19.8341572!9m1!1b1!16s%2Fg%2F11y3h8wt7q?entry=ttu',
    '_blank',
    'noopener,noreferrer'
  );
};

// Lifecycle
onMounted(() => {
  startAutoScroll();
});

onUnmounted(() => {
  if (animationId.value) {
    cancelAnimationFrame(animationId.value);
  }
});
</script>

<style scoped>
.reviews-section {
  padding: 4rem 2rem;
  /*background:linear-gradient(-12deg, #f5f7fa 0%, #bababa 50%, #f5f7fa 100%);*/
  background:linear-gradient(-12deg, #c9e6c6 0%, #e6d5a0 50%, #edb5c4 100%);

  width: 100%;
}

.reviews-container {
  max-width: 1400px;
  margin: 0 auto;
}

.reviews-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  padding: 1.35rem 1.5rem;
  margin: 0 auto 3rem;
  max-width: 640px;
  border-radius: 18px;
  //background: #ffffff;
  //box-shadow: 0 18px 48px rgba(0, 0, 0, 0.22);
}

.google-logo {
  width: 84px;
  height: 84px;
  flex-shrink: 0;
}

.google-logo svg {
  display: block;
}

.google-rating {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.55rem;
  color: #111827;
}

.rating-stars {
  display: flex;
  gap: 0.2rem;
  line-height: 1;
}

.rating-star {
  --fill-width: 0%;
  position: relative;
  display: inline-block;
  font-size: 1.45rem;
  color: #d1d5db;
}

.rating-star::after {
  content: "\2605";
  position: absolute;
  left: 0;
  top: 0;
  display: block;
  width: var(--fill-width, 0%);
  overflow: hidden;
  white-space: nowrap;
  color: #f4b400;
}

.rating-label {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 500;
  color: white;
}

.rating-score,
.rating-count {
  font-weight: 700;
}

.rating-social-proof {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.75rem;
  width: 100%;
}

.rating-avatars {
  display: flex;
  align-items: center;
  padding-left: 0.15rem;
}

.rating-avatar {
  width: 34px;
  height: 34px;
  border-radius: 999px;
  border: 2px solid #ffffff;
  background: #e5e7eb;
  color: #111827;
  font-size: 0.72rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  margin-left: -0.4rem;
}

.rating-avatar:first-child {
  margin-left: 0;
}

.more-reviewers {
  background: #111827;
  color: #ffffff;
  font-size: 0.78rem;
  padding: 0 0.35rem;
  min-width: 40px;
}

.leave-review-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.62rem 1.1rem;
  border-radius: 10px;
  background: #1a56f0;
  color: #ffffff;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.98rem;
  transition: background 0.2s ease, transform 0.2s ease;
}

.leave-review-btn:hover {
  background: #1745c1;
  transform: translateY(-1px);
}

.leave-review-btn svg {
  flex-shrink: 0;
}

.reviews-carousel-wrapper {
  width: 100%;
  overflow: hidden;
  margin-bottom: 3rem;
  position: relative;
}

.reviews-carousel {
  display: flex;
  gap: 2rem;
  overflow-x: hidden;
  scroll-behavior: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  cursor: grab;
  user-select: none;
  padding: 1rem 0;
  touch-action: pan-x;
}

.reviews-carousel.is-dragging {
  cursor: grabbing;
  scroll-behavior: auto;
}

.reviews-carousel::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

.review-card {
  background: #f8f9fa;
  padding: 2rem;
  border-radius: 16px;
  border: 1px solid #e9ecef;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  flex-shrink: 0;
  /* Responsive widths */
  width: calc(33.333% - 1.33rem); /* 3 cards on desktop */
}

@media (max-width: 1024px) and (min-width: 769px) {
  .review-card {
    width: calc(50% - 1rem); /* 2 cards on tablet */
  }
}

@media (max-width: 768px) {
  .review-card {
    width: calc(100% - 2rem); /* 1 card on mobile */
  }

  .reviews-carousel {
    gap: 1.5rem;
  }
}

.review-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.reviewer-info {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.reviewer-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1rem;
  flex-shrink: 0;
  overflow: hidden;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.reviewer-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.reviewer-name {
  font-size: 1rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
}

.review-date {
  font-size: 0.75rem;
  color: #666;
  margin: 0;
}

.review-stars {
  display: flex;
  gap: 0.125rem;
}

.review-stars .review-star {
  --fill-width: 0%;
  position: relative;
  display: inline-block;
  font-size: 1rem;
  color: #d1d5db;
}

.review-stars .review-star::after {
  content: "\2605";
  position: absolute;
  left: 0;
  top: 0;
  display: block;
  width: var(--fill-width, 0%);
  overflow: hidden;
  white-space: nowrap;
  color: #f4b400;
}

.review-text {
  color: #4a5568;
  line-height: 1.7;
  margin-bottom: 1rem;
  font-size: 0.95rem;
}

.google-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: #666;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e9ecef;
}

.google-badge svg {
  flex-shrink: 0;
}

.reviews-cta {
  text-align: center;
}

.view-all-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: #4285f4;
  color: white;
  text-decoration: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(66, 133, 244, 0.3);
}

.view-all-btn:hover {
  background: #3367d6;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(66, 133, 244, 0.4);
}

.view-all-btn .arrow {
  font-size: 1.25rem;
  transition: transform 0.3s ease;
}

.view-all-btn:hover .arrow {
  transform: translateX(5px);
}

/* Responsive */
@media (max-width: 768px) {
  .reviews-section {
    padding: 3rem 1rem;
  }

  .reviews-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 1rem;
    padding: 1.25rem 1rem;
    max-width: 360px;
  }

  .google-rating,
  .rating-social-proof {
    align-items: center;
  }

  .rating-label {
    font-size: 1rem;
  }
}
</style>



