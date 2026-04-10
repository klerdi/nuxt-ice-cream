<template>
  <header class="app-header">
    <!-- Logo -->
    <div class="logo">
      <!--
        viewBox 0 0 40 62  |  centre x = 20
        Soft-serve: 3 tiers drawn as one closed path.
        Each tier BULGES outward then PINCHES at a waist before the next tier.
        Tier 1 (widest) → waist → Tier 2 → waist → Tier 3 → tip.
      -->
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 62" fill="none"
           stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
           class="logo-icon" aria-label="Ice Cream">
        <path stroke-width="1.8" d="
          M 34 38
          C 39 36, 38 27, 28 26
          C 33 25, 32 18, 25 16
          C 27 13, 24  8, 20  4
          C 16  8, 13 13, 15 16
          C  8 18,  7 25, 12 26
          C  2 27,  1 36,  6 38
          Z"/>

        <path stroke-width="1.2" opacity="0.75" d="M 12 26 Q 20 23, 28 26"/>
        <path stroke-width="1.0" opacity="0.70" d="M 15 16 Q 20 14, 25 16"/>
        <path stroke-width="1.8" d="M 6 38 L 20 60 L 34 38 Z"/>

        <line stroke-width="1" opacity="0.6" x1="8"  y1="41" x2="32" y2="41"/>
        <line stroke-width="1" opacity="0.6" x1="10" y1="44" x2="30" y2="44"/>
        <line stroke-width="1" opacity="0.6" x1="12" y1="47" x2="28" y2="47"/>
        <line stroke-width="1" opacity="0.6" x1="14" y1="50" x2="26" y2="50"/>
        <line stroke-width="1" opacity="0.6" x1="16" y1="53" x2="24" y2="53"/>

        <line stroke-width="1" opacity="0.6" x1="13" y1="38" x2="20" y2="60"/>
        <line stroke-width="1" opacity="0.6" x1="20" y1="38" x2="20" y2="60"/>
        <line stroke-width="1" opacity="0.6" x1="27" y1="38" x2="20" y2="60"/>
      </svg>
    </div>

    <!-- Navigation -->
    <nav class="nav">
      <nuxt-link href="#" class="nav-link">FLAVOURS</nuxt-link>
      <nuxt-link href="#" class="nav-link">SHOP</nuxt-link>
      <nuxt-link href="#" class="nav-link">ABOUT US</nuxt-link>
      <nuxt-link href="#" class="nav-link">SUSTAINABILITY</nuxt-link>
      <nuxt-link href="#" class="nav-link">CONTACT</nuxt-link>
    </nav>

    <!-- Actions -->
    <div class="actions">
      <!-- Cart icon -->
      <button class="icon-btn" aria-label="Cart">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
      </button>
      <!-- User icon -->
      <button class="icon-btn" aria-label="Account">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      </button>
      <LanguageSwitcher/>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.9rem 2.5rem;
  background: transparent;
}

.logo {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.logo-icon {
  width: 2.2rem;
  height: 3.4rem;   /* 40:62 ≈ 1:1.55 ratio */
  color: rgba(60, 40, 20, 0.75);
}

/* ── Navigation ─────────────────────────────────────────────── */
.nav {
  display: flex;
  align-items: center;
  gap: 2.2rem;
  flex: 1;
  justify-content: center;
}

.nav-link {
  font-size: 0.72rem;
  font-weight: 500;
  letter-spacing: 0.12em;
  color: rgba(60, 40, 20, 0.75);
  text-decoration: none;
  transition: color 0.2s;
}

.nav-link:hover {
  color: rgba(60, 40, 20, 1);
}

/* ── Action icons ────────────────────────────────────────────── */
.actions {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  flex-shrink: 0;
}

.icon-btn {
  background: none;
  border: 1.5px solid rgba(60, 40, 20, 0.55);
  border-radius: 50%;
  width: 2.2rem;
  height: 2.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
  padding: 0;
  color: rgba(60, 40, 20, 0.75);
}

.icon-btn svg {
  width: 1rem;
  height: 1rem;
}

.icon-btn:hover {
  border-color: rgba(60, 40, 20, 0.9);
  background: rgba(255, 255, 255, 0.15);
}

/* ── Mobile ──────────────────────────────────────────────────── */
@media (max-width: 768px) {
  .nav {
    gap: 1rem;
  }

  .nav-link {
    font-size: 0.6rem;
    letter-spacing: 0.08em;
  }

  .app-header {
    padding: 0.8rem 1rem;
  }
}

@media (max-width: 480px) {
  .nav {
    display: none;
  }
}
</style>

