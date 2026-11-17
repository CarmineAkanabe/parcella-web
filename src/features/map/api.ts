import type { NominatimReverseResult, NominatimSearchResult } from './types'

const DEFAULT_NOMINATIM_URL = 'https://nominatim.openstreetmap.org'

function getNominatimBaseUrl(): string {
  const configured = import.meta.env.VITE_NOMINATIM_URL as string | undefined
  return (configured || DEFAULT_NOMINATIM_URL).replace(/\/+$/, '')
}

export async function searchNominatim(
  query: string,
  signal?: AbortSignal,
): Promise<NominatimSearchResult[]> {
  const trimmed = query.trim()
  if (!trimmed) {
    return []
  }

  const baseUrl = getNominatimBaseUrl()
  const params = new URLSearchParams({
    format: 'jsonv2',
    limit: '5',
    countrycodes: 'cm',
    addressdetails: '1',
    q: trimmed,
  })

  const response = await fetch(`${baseUrl}/search?${params.toString()}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
    signal,
  })

  if (!response.ok) {
    throw new Error(`Address lookup failed (${response.status})`)
  }

  const data = (await response.json()) as unknown
  return Array.isArray(data) ? (data as NominatimSearchResult[]) : []
}

export async function reverseNominatim(
  lat: number,
  lng: number,
  signal?: AbortSignal,
): Promise<string | null> {
  const baseUrl = getNominatimBaseUrl()
  const params = new URLSearchParams({
    format: 'jsonv2',
    lat: String(lat),
    lon: String(lng),
  })

  try {
    const response = await fetch(`${baseUrl}/reverse?${params.toString()}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      signal,
    })

    if (!response.ok) {
      return null
    }

    const data = (await response.json()) as NominatimReverseResult
    return typeof data.display_name === 'string' && data.display_name.trim()
      ? data.display_name.trim()
      : null
  } catch {
    return null
  }
}
