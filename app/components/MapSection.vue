<script setup lang="ts">
import { ref, onMounted } from 'vue'

const mapContainer = ref<HTMLElement | null>(null)

const locations = [
  {
    name: 'Ice Cream - Kavaja',
    coords: [41.3307, 19.8316] as [number, number],
    address: 'Rruga e Kavajës, Tirana',
  },
  {
    name: 'Ice Cream - Blloku',
    coords: [41.3195, 19.8187] as [number, number],
    address: 'Rruga Abdyl Frashëri, Tirana',
  },
  {
    name: 'Ice Cream - Liqeni',
    coords: [41.3120, 19.8310] as [number, number],
    address: 'Rruga e Elbasanit, Tirana',
  },
]

const center: [number, number] = [41.3207, 19.8271]
const zoom = 14

onMounted(async () => {
  const L = (await import('leaflet')).default

  if (!mapContainer.value) return

  // Fix default marker icon paths (broken by bundlers)
  delete (L.Icon.Default.prototype as any)._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  })

  const map = L.map(mapContainer.value).setView(center, zoom)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    // attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map)

  locations.forEach((loc) => {
    L.marker(loc.coords)
      .addTo(map)
      .bindPopup(`<strong>${loc.name}</strong><br/>${loc.address}`)
  })
})
</script>
<template>
  <section class="map-section" style="margin-bottom: -3rem;" id="location">
    <div class="map-container">
      <div class="map-wrapper">
        <div ref="mapContainer" class="google-map"></div>
      </div>
    </div>
  </section>
</template>

<style>
@import 'leaflet/dist/leaflet.css';
</style>

<style scoped>
.map-section {
  background: linear-gradient(200deg, #171717 0%, #171717 100%);
  /*background: linear-gradient(200deg, #f5f7fa 0%, #bababa 100%);*/
  width: 100%;
}

.map-container {
  margin: 0 auto;
}

.map-header {
  text-align: center;
  margin-bottom: 1rem;
}

.map-subtitle {
  color: #e74c3c;
  font-size: 1rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.map-title {
  font-size: 3rem;
  font-weight: 800;
  color: white;
  text-transform: uppercase;
}

.map-description {
  font-size: 1.125rem;
  color: white;
  max-width: 600px;
  margin: 0 auto;
}

.map-wrapper {
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  margin-bottom: 3rem;
}

.google-map {
  display: block;
  width: 100%;
  height: 450px;
}

.location-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
}

.detail-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.detail-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.detail-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.detail-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.detail-text {
  font-size: 1rem;
  color: #666;
  line-height: 1.6;
}

/* Responsive */
@media (max-width: 768px) {


  .map-title {
    font-size: 2rem;
  }

  .location-details {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .google-map {
    height: 350px;
  }
}
</style>


