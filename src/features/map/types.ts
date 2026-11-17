export interface NominatimSearchResult {
  place_id: number
  display_name: string
  lat: string
  lon: string
}

export interface NominatimReverseResult {
  place_id?: number
  display_name?: string
  lat?: string
  lon?: string
}
