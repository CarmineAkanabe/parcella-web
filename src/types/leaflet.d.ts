declare module 'leaflet' {
  export interface LatLngLiteral {
    lat: number
    lng: number
  }

  export class LatLng {
    lat: number
    lng: number
    constructor(lat: number, lng: number, alt?: number)
  }

  export function latLng(lat: number, lng: number): LatLng
  export function latLng(coords: [number, number] | LatLngLiteral): LatLng

  export interface LeafletMouseEvent {
    latlng: LatLng
  }

  export interface MapOptions {
    center?: [number, number] | LatLngLiteral
    zoom?: number
    zoomControl?: boolean
  }

  export interface PanOptions {
    animate?: boolean
  }

  export class Map {
    setView(center: [number, number] | LatLng, zoom?: number, options?: PanOptions): this
    getZoom(): number
    invalidateSize(options?: PanOptions): this
    on(type: 'click', fn: (event: LeafletMouseEvent) => void): this
    on(type: string, fn: (...args: unknown[]) => void): this
    remove(): this
  }

  export function map(element: HTMLElement | string, options?: MapOptions): Map

  export interface TileLayerOptions {
    attribution?: string
    maxZoom?: number
  }

  export class TileLayer {
    addTo(map: Map): this
  }

  export function tileLayer(urlTemplate: string, options?: TileLayerOptions): TileLayer

  export interface MarkerOptions {
    draggable?: boolean
  }

  export class Marker {
    addTo(map: Map): this
    setLatLng(latlng: [number, number] | LatLng): this
    getLatLng(): LatLng
    on(type: 'dragend', fn: () => void): this
    on(type: string, fn: (...args: unknown[]) => void): this
  }

  export function marker(latlng: [number, number] | LatLng, options?: MarkerOptions): Marker

  export interface DefaultIconOptions {
    iconRetinaUrl?: string
    iconUrl?: string
    shadowUrl?: string
  }

  export namespace Icon {
    class Default {
      static mergeOptions(options: DefaultIconOptions): void
    }
  }

  const L: {
    latLng: typeof latLng
    map: typeof map
    tileLayer: typeof tileLayer
    marker: typeof marker
    Icon: typeof Icon
  }

  export default L
}
