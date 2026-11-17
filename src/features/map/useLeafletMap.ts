import { onScopeDispose, shallowRef, type Ref } from 'vue'
import L, {
  type LeafletMouseEvent,
  type Map as LeafletMap,
  type Marker as LeafletMarker,
} from 'leaflet'
import 'leaflet/dist/leaflet.css'
import markerIcon2xUrl from 'leaflet/dist/images/marker-icon-2x.png'
import markerIconUrl from 'leaflet/dist/images/marker-icon.png'
import markerShadowUrl from 'leaflet/dist/images/marker-shadow.png'

// Fix Leaflet's default marker icon URLs when bundled with Vite
let iconConfigured = false
export function ensureLeafletDefaultIcon(): void {
  if (iconConfigured) return
  delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2xUrl,
    iconUrl: markerIconUrl,
    shadowUrl: markerShadowUrl,
  })
  iconConfigured = true
}

const DEFAULT_OSM_TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'

// Default center: Yaoundé, Cameroon
export const CAMEROON_DEFAULT_CENTER = {
  lat: 3.848,
  lng: 11.5021,
  zoom: 13,
} as const

export interface UseLeafletMapOptions {
  initialCenter?: { lat: number; lng: number } | null
  initialZoom?: number
  disabled?: () => boolean
  onSelectCoordinates?: (coords: { lat: number; lng: number }) => void
}

export function useLeafletMap(
  containerRef: Ref<HTMLElement | null>,
  options: UseLeafletMapOptions = {},
) {
  ensureLeafletDefaultIcon()

  const mapInstance = shallowRef<LeafletMap | null>(null)
  const markerInstance = shallowRef<LeafletMarker | null>(null)
  let resizeObserver: ResizeObserver | null = null

  function getTileUrl(): string {
    const configured = import.meta.env.VITE_OSM_TILE_URL as string | undefined
    return configured || DEFAULT_OSM_TILE_URL
  }

  function setMarker(lat: number, lng: number, pan = true): void {
    const map = mapInstance.value
    if (!map) return

    const latLng = L.latLng(lat, lng)
    if (!markerInstance.value) {
      const marker = L.marker(latLng, {
        draggable: !(options.disabled?.() ?? false),
      }).addTo(map)

      marker.on('dragend', () => {
        if (options.disabled?.()) return
        const pos = marker.getLatLng()
        options.onSelectCoordinates?.({
          lat: Number(pos.lat.toFixed(6)),
          lng: Number(pos.lng.toFixed(6)),
        })
      })

      markerInstance.value = marker
    } else {
      markerInstance.value.setLatLng(latLng)
    }

    if (pan) {
      map.setView(latLng, Math.max(map.getZoom(), 14), { animate: true })
    }
  }

  function invalidateSize(): void {
    const map = mapInstance.value
    if (!map) return
    requestAnimationFrame(() => {
      map.invalidateSize({ animate: false })
    })
  }

  function initMap(): void {
    const el = containerRef.value
    if (!el || mapInstance.value) return

    const startLat = options.initialCenter?.lat ?? CAMEROON_DEFAULT_CENTER.lat
    const startLng = options.initialCenter?.lng ?? CAMEROON_DEFAULT_CENTER.lng
    const startZoom = options.initialZoom ?? CAMEROON_DEFAULT_CENTER.zoom

    const map = L.map(el, {
      center: [startLat, startLng],
      zoom: startZoom,
      zoomControl: true,
    })

    L.tileLayer(getTileUrl(), {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map)

    map.on('click', (event: LeafletMouseEvent) => {
      if (options.disabled?.()) return
      const lat = Number(event.latlng.lat.toFixed(6))
      const lng = Number(event.latlng.lng.toFixed(6))
      setMarker(lat, lng, false)
      options.onSelectCoordinates?.({ lat, lng })
    })

    mapInstance.value = map

    if (options.initialCenter) {
      setMarker(options.initialCenter.lat, options.initialCenter.lng, false)
    }

    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        invalidateSize()
      })
      resizeObserver.observe(el)
    }

    invalidateSize()
  }

  function destroyMap(): void {
    if (resizeObserver) {
      resizeObserver.disconnect()
      resizeObserver = null
    }
    if (mapInstance.value) {
      mapInstance.value.remove()
      mapInstance.value = null
      markerInstance.value = null
    }
  }

  onScopeDispose(() => {
    destroyMap()
  })

  return {
    mapInstance,
    markerInstance,
    initMap,
    destroyMap,
    setMarker,
    invalidateSize,
  }
}
