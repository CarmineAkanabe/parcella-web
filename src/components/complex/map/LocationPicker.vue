<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import type { Location } from '@/shared/types'
import {
  reverseNominatim,
  searchNominatim,
  useLeafletMap,
  type NominatimSearchResult,
} from '@/features/map'

interface Props {
  modelValue: Location | null
  label?: string
  errorMessage?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  label: 'Confirmed Physical Dispatch Address & Landmarks',
  errorMessage: undefined,
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [location: Location]
}>()

const mapContainer = ref<HTMLElement | null>(null)
const searchQuery = ref('')
const isSearching = ref(false)
const isReversing = ref(false)
const searchError = ref<string | null>(null)
const searchResults = ref<NominatimSearchResult[]>([])

const localLat = ref<number | null>(props.modelValue?.lat ?? null)
const localLng = ref<number | null>(props.modelValue?.lng ?? null)
const localAddress = ref<string>(props.modelValue?.address ?? '')

const hasCoordinates = computed(
  () => typeof localLat.value === 'number' && typeof localLng.value === 'number',
)

const formattedLat = computed(() =>
  localLat.value !== null ? `${localLat.value.toFixed(6)}° N` : 'Not pinned',
)

const formattedLng = computed(() =>
  localLng.value !== null ? `${localLng.value.toFixed(6)}° E` : 'Not pinned',
)

function emitCurrentLocation(): void {
  if (localLat.value === null || localLng.value === null) return
  emit('update:modelValue', {
    lat: localLat.value,
    lng: localLng.value,
    address: localAddress.value,
  })
}

const { initMap, setMarker, invalidateSize } = useLeafletMap(mapContainer, {
  initialCenter:
    props.modelValue &&
    typeof props.modelValue.lat === 'number' &&
    typeof props.modelValue.lng === 'number'
      ? { lat: props.modelValue.lat, lng: props.modelValue.lng }
      : null,
  disabled: () => props.disabled,
  onSelectCoordinates: async ({ lat, lng }) => {
    localLat.value = lat
    localLng.value = lng
    emitCurrentLocation()

    isReversing.value = true
    const resolvedAddress = await reverseNominatim(lat, lng)
    isReversing.value = false

    if (resolvedAddress) {
      localAddress.value = resolvedAddress.slice(0, 500)
    } else if (!localAddress.value.trim()) {
      localAddress.value = `Pinned Location (${lat.toFixed(5)}, ${lng.toFixed(5)})`
    }
    emitCurrentLocation()
  },
})

onMounted(async () => {
  await nextTick()
  initMap()
})

watch(
  () => props.modelValue,
  (next) => {
    if (!next) {
      localLat.value = null
      localLng.value = null
      localAddress.value = ''
      return
    }
    localLat.value = next.lat
    localLng.value = next.lng
    if (next.address !== localAddress.value) {
      localAddress.value = next.address
    }
    setMarker(next.lat, next.lng, false)
  },
  { deep: true },
)

async function handleSearch(): Promise<void> {
  const query = searchQuery.value.trim()
  if (!query || props.disabled || isSearching.value) return

  isSearching.value = true
  searchError.value = null
  searchResults.value = []

  try {
    const results = await searchNominatim(query)
    searchResults.value = results
    if (results.length === 0) {
      searchError.value = 'No matching places found in Cameroon. Try a broader neighborhood or click directly on the map.'
    } else if (results.length === 1 && results[0]) {
      selectSearchResult(results[0])
    }
  } catch {
    searchError.value = 'Address search is temporarily unavailable. Click on the map to place your pin and enter your address below.'
  } finally {
    isSearching.value = false
  }
}

function selectSearchResult(item: NominatimSearchResult): void {
  const lat = Number(Number.parseFloat(item.lat).toFixed(6))
  const lng = Number(Number.parseFloat(item.lon).toFixed(6))
  if (Number.isNaN(lat) || Number.isNaN(lng)) return

  localLat.value = lat
  localLng.value = lng
  localAddress.value = item.display_name.slice(0, 500)
  searchResults.value = []
  searchError.value = null

  setMarker(lat, lng, true)
  emitCurrentLocation()
}

function handleAddressInput(val: string): void {
  localAddress.value = val
  if (localLat.value !== null && localLng.value !== null) {
    emitCurrentLocation()
  }
}

defineExpose({
  invalidateSize,
})
</script>

<template>
  <div class="location-picker d-flex flex-column ga-4">
    <!-- Nominatim Search Box + Terracotta Primary Search Button (Matches Stitch Card 4) -->
    <div class="d-flex flex-column flex-sm-row align-stretch align-sm-center ga-2">
      <v-text-field
        v-model="searchQuery"
        placeholder="Search neighborhood or landmark (e.g. Akwa Boulevard, Bastos Yaoundé)"
        prepend-inner-icon="mdi-magnify"
        density="compact"
        :disabled="disabled || isSearching"
        class="flex-grow-1"
        @keydown.enter.prevent="handleSearch"
      />
      <v-btn
        color="primary"
        variant="flat"
        height="40"
        prepend-icon="mdi-radar"
        :loading="isSearching"
        :disabled="disabled || !searchQuery.trim()"
        class="font-weight-bold px-4"
        @click="handleSearch"
      >
        Search Map
      </v-btn>
    </div>

    <v-alert
      v-if="searchError"
      type="warning"
      variant="tonal"
      density="compact"
      closable
      class="text-body-2"
      @click:close="searchError = null"
    >
      {{ searchError }}
    </v-alert>

    <!-- Search Results Dropdown List -->
    <v-list
      v-if="searchResults.length > 1"
      density="compact"
      rounded="lg"
      class="search-results-list pa-1"
    >
      <div class="px-3 py-1 text-caption font-weight-semibold text-medium-emphasis">
        Select matching location ({{ searchResults.length }} results)
      </div>
      <v-list-item
        v-for="item in searchResults"
        :key="item.place_id"
        prepend-icon="mdi-map-marker-outline"
        rounded="md"
        @click="selectSearchResult(item)"
      >
        <v-list-item-title class="text-body-2">
          {{ item.display_name }}
        </v-list-item-title>
        <v-list-item-subtitle class="font-mono text-caption">
          {{ Number.parseFloat(item.lat).toFixed(4) }}, {{ Number.parseFloat(item.lon).toFixed(4) }}
        </v-list-item-subtitle>
      </v-list-item>
    </v-list>

    <!-- Interactive Leaflet Map Container -->
    <div class="map-frame-wrapper position-relative">
      <div
        ref="mapContainer"
        class="map-canvas"
        role="application"
        aria-label="Interactive location picker map"
      />
      <div class="map-instruction-pill text-caption px-3 py-1 d-flex align-center ga-1">
        <span class="hub-dot mr-1" />
        <span class="font-weight-semibold">Click map or drag pin to refine hub coordinates</span>
      </div>
    </div>

    <!-- 3-Column Coordinate Readout Strip (Matches Stitch LATITUDE / LONGITUDE / CORRIDOR bar) -->
    <div class="coord-strip pa-3 rounded-lg">
      <v-row dense>
        <v-col cols="6" sm="4">
          <span class="text-caption font-weight-bold text-uppercase text-medium-emphasis d-block">
            Latitude Coordinate
          </span>
          <span class="font-mono text-body-2 font-weight-bold">
            {{ formattedLat }}
          </span>
        </v-col>
        <v-col cols="6" sm="4">
          <span class="text-caption font-weight-bold text-uppercase text-medium-emphasis d-block">
            Longitude Coordinate
          </span>
          <span class="font-mono text-body-2 font-weight-bold">
            {{ formattedLng }}
          </span>
        </v-col>
        <v-col cols="12" sm="4" class="text-sm-right">
          <span class="text-caption font-weight-bold text-uppercase text-medium-emphasis d-block">
            Dispatch Corridor
          </span>
          <span class="text-body-2 font-weight-bold" :class="hasCoordinates ? 'text-primary' : 'text-medium-emphasis'">
            {{ hasCoordinates ? 'Cameroon Active Zone' : 'Select Pin on Map' }}
          </span>
        </v-col>
      </v-row>
    </div>

    <!-- Editable Address Field -->
    <div>
      <label class="field-label">{{ label }}</label>
      <v-text-field
        :model-value="localAddress"
        placeholder="Click the map to place a pin, then confirm or edit the landmark address"
        prepend-inner-icon="mdi-store-marker-outline"
        :loading="isReversing"
        :disabled="disabled"
        :error="Boolean(errorMessage)"
        :error-messages="errorMessage"
        @update:model-value="handleAddressInput"
      />
    </div>
  </div>
</template>

<style scoped>
.map-frame-wrapper {
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 1px solid var(--border-subtle);
  background-color: rgb(var(--v-theme-surface-variant));
}

.map-canvas {
  width: 100%;
  height: 270px;
  z-index: 1;
}

.map-instruction-pill {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 400;
  background-color: rgba(var(--v-theme-surface), 0.94);
  color: rgb(var(--v-theme-on-surface));
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-sm);
  pointer-events: none;
  box-shadow: var(--shadow-xs);
}

.hub-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 9999px;
  background-color: rgb(var(--v-theme-primary));
}

.coord-strip {
  background-color: rgba(var(--v-theme-surface-variant), 0.5);
  border: 1px solid var(--border-subtle);
}

.search-results-list {
  border: 1px solid var(--border-subtle);
  background-color: rgb(var(--v-theme-surface));
  max-height: 210px;
  overflow-y: auto;
}
</style>
