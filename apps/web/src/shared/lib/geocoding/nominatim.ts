import type { Coordinates, GeocodeResult, ReverseGeocodeResult } from './types';

export async function geocodeNominatim(
  query: string,
  options?: {
    endpoint?: string;
    signal?: AbortSignal;
    limit?: number;
  },
): Promise<GeocodeResult[]> {
  const trimmed = query.trim();

  if (!trimmed) {
    return [];
  }

  const endpoint =
    options?.endpoint ?? 'https://nominatim.openstreetmap.org/search';

  const url = new URL(endpoint);

  url.searchParams.set('format', 'jsonv2');
  url.searchParams.set('q', trimmed);
  url.searchParams.set('limit', String(options?.limit ?? 5));
  url.searchParams.set('addressdetails', '1');

  const response = await fetch(url.toString(), {
    signal: options?.signal,
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    return [];
  }

  const data = (await response.json()) as Array<{
    display_name?: string;
    lon?: string;
    lat?: string;
  }>;

  return data
    .map((item) => {
      const longitude = Number(item.lon);
      const latitude = Number(item.lat);

      if (
        typeof item.display_name !== 'string' ||
        !item.display_name.trim() ||
        !Number.isFinite(longitude) ||
        !Number.isFinite(latitude)
      ) {
        return null;
      }

      return {
        name: item.display_name.trim(),
        coordinates: [longitude, latitude] as Coordinates,
      };
    })
    .filter((value): value is GeocodeResult => value !== null);
}

export async function reverseGeocodeNominatim(
  coordinates: Coordinates,
  options?: {
    endpoint?: string;
    signal?: AbortSignal;
  },
): Promise<string | null> {
  const [longitude, latitude] = coordinates;

  const endpoint =
    options?.endpoint ?? 'https://nominatim.openstreetmap.org/reverse';

  const url = new URL(endpoint);

  url.searchParams.set('format', 'jsonv2');
  url.searchParams.set('lat', String(latitude));
  url.searchParams.set('lon', String(longitude));
  url.searchParams.set('zoom', '18');
  url.searchParams.set('addressdetails', '1');

  const response = await fetch(url.toString(), {
    signal: options?.signal,
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as ReverseGeocodeResult;

  if (typeof data.display_name !== 'string' || !data.display_name.trim()) {
    return null;
  }

  return data.display_name.trim();
}
