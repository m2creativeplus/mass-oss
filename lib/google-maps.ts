/**
 * MASS OS - Google Maps Places API Integration
 * 
 * Automated workshop discovery for Somaliland automotive businesses
 */

import { AutomotiveEntity } from '@/types/mass-os';

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY || '';

// Somaliland city coordinates
const CITY_COORDINATES = {
  Hargeisa: { lat: 9.5600, lng: 44.0650 },
  Berbera: { lat: 10.4397, lng: 45.0164 },
  Burco: { lat: 9.5220, lng: 45.5322 },
  Borama: { lat: 9.9416, lng: 43.1830 },
  'Las Anod': { lat: 8.4771, lng: 47.3570 },
  Erigavo: { lat: 10.6170, lng: 47.3670 },
};

// Search keywords for automotive businesses
const AUTOMOTIVE_KEYWORDS = [
  'auto repair',
  'car workshop',
  'garage',
  'mechanic',
  'auto parts',
  'car dealer',
  'tire shop',
  'oil change',
  'car wash',
  // Somali keywords
  'garaash',
  'fuundi',
  'qalabka gaadiidka',
];

interface PlaceResult {
  place_id: string;
  name: string;
  formatted_address?: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  rating?: number;
  user_ratings_total?: number;
  formatted_phone_number?: string;
  opening_hours?: {
    open_now: boolean;
  };
  types?: string[];
  business_status?: string;
  photos?: { photo_reference: string }[];
}

interface PlaceDetailsResult extends PlaceResult {
  website?: string;
  international_phone_number?: string;
  reviews?: {
    author_name: string;
    rating: number;
    text: string;
  }[];
}

/**
 * Search for automotive businesses near a city
 */
export async function searchAutomotiveBusinesses(
  city: keyof typeof CITY_COORDINATES,
  keyword?: string,
  radius: number = 10000 // 10km default
): Promise<PlaceResult[]> {
  if (!GOOGLE_MAPS_API_KEY) {
    console.warn('[Google Maps] API key not configured - returning mock data');
    return getMockPlaces(city);
  }

  const coords = CITY_COORDINATES[city];
  const searchKeyword = keyword || 'auto repair garage mechanic';

  try {
    const url = new URL('https://maps.googleapis.com/maps/api/place/nearbysearch/json');
    url.searchParams.append('location', `${coords.lat},${coords.lng}`);
    url.searchParams.append('radius', radius.toString());
    url.searchParams.append('keyword', searchKeyword);
    url.searchParams.append('key', GOOGLE_MAPS_API_KEY);

    const response = await fetch(url.toString());
    const data = await response.json();

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      console.error('[Google Maps] API error:', data.status, data.error_message);
      return getMockPlaces(city);
    }

    return data.results || [];
  } catch (error) {
    console.error('[Google Maps] Fetch error:', error);
    return getMockPlaces(city);
  }
}

/**
 * Get detailed information about a place
 */
export async function getPlaceDetails(placeId: string): Promise<PlaceDetailsResult | null> {
  if (!GOOGLE_MAPS_API_KEY) {
    console.warn('[Google Maps] API key not configured');
    return null;
  }

  try {
    const url = new URL('https://maps.googleapis.com/maps/api/place/details/json');
    url.searchParams.append('place_id', placeId);
    url.searchParams.append('fields', 'name,formatted_address,formatted_phone_number,international_phone_number,geometry,rating,user_ratings_total,website,opening_hours,reviews,photos,business_status,types');
    url.searchParams.append('key', GOOGLE_MAPS_API_KEY);

    const response = await fetch(url.toString());
    const data = await response.json();

    if (data.status !== 'OK') {
      console.error('[Google Maps] Place details error:', data.status);
      return null;
    }

    return data.result;
  } catch (error) {
    console.error('[Google Maps] Place details fetch error:', error);
    return null;
  }
}

/**
 * Geocode an address to coordinates
 */
export async function geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
  if (!GOOGLE_MAPS_API_KEY) {
    return null;
  }

  try {
    const url = new URL('https://maps.googleapis.com/maps/api/geocode/json');
    url.searchParams.append('address', `${address}, Somaliland`);
    url.searchParams.append('key', GOOGLE_MAPS_API_KEY);

    const response = await fetch(url.toString());
    const data = await response.json();

    if (data.status !== 'OK' || !data.results?.[0]) {
      return null;
    }

    return data.results[0].geometry.location;
  } catch {
    return null;
  }
}

/**
 * Convert Google Places result to MASS OS AutomotiveEntity
 */
export function placeToEntity(place: PlaceDetailsResult, city: string): Partial<AutomotiveEntity> {
  // Determine entity type based on place types
  let entityType: AutomotiveEntity['entityType'] = 'workshop';
  if (place.types?.includes('car_dealer')) entityType = 'dealer';
  if (place.types?.includes('car_rental')) entityType = 'service_provider';
  if (place.types?.includes('gas_station')) entityType = 'fuel_station';

  // Calculate trust score based on rating and reviews
  const rating = place.rating || 0;
  const reviewCount = place.user_ratings_total || 0;
  const trustScore = Math.min(100, Math.round(
    (rating / 5 * 60) + // 60% from rating
    (Math.min(reviewCount, 100) / 100 * 40) // 40% from review count (capped at 100)
  ));

  return {
    entityType,
    businessName: place.name,
    location: {
      city,
      addressRaw: place.formatted_address,
      coordinates: [place.geometry.location.lat, place.geometry.location.lng],
    },
    contact: {
      phoneNumbers: place.international_phone_number ? [place.international_phone_number] : 
                    place.formatted_phone_number ? [place.formatted_phone_number] : [],
    },
    servicesOffered: [], // Would need to be extracted from reviews or description
    brandsSpecialized: [],
    trustScore,
    dataQuality: reviewCount > 10 ? 'high' : reviewCount > 3 ? 'medium' : 'low',
    source: 'google_maps',
    verified: false,
    lastUpdated: new Date().toISOString(),
    isActive: place.business_status === 'OPERATIONAL',
  };
}

/**
 * Scan all cities for automotive businesses
 */
export async function scanAllCities(): Promise<Map<string, PlaceResult[]>> {
  const results = new Map<string, PlaceResult[]>();

  for (const city of Object.keys(CITY_COORDINATES) as (keyof typeof CITY_COORDINATES)[]) {
    console.log(`[MASS OS] Scanning ${city}...`);
    const places = await searchAutomotiveBusinesses(city);
    results.set(city, places);
    
    // Rate limiting - wait 200ms between requests
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  return results;
}

/**
 * Mock data for development/demo when API key is not available
 */
function getMockPlaces(city: string): PlaceResult[] {
  return [
    {
      place_id: `mock-${city}-1`,
      name: `${city} Auto Repair`,
      formatted_address: `Main Road, ${city}, Somaliland`,
      geometry: {
        location: CITY_COORDINATES[city as keyof typeof CITY_COORDINATES] || { lat: 0, lng: 0 }
      },
      rating: 4.2,
      user_ratings_total: 45,
      types: ['car_repair', 'point_of_interest'],
      business_status: 'OPERATIONAL'
    },
    {
      place_id: `mock-${city}-2`,
      name: `Garaash ${city}`,
      formatted_address: `Industrial Area, ${city}, Somaliland`,
      geometry: {
        location: CITY_COORDINATES[city as keyof typeof CITY_COORDINATES] || { lat: 0, lng: 0 }
      },
      rating: 4.5,
      user_ratings_total: 28,
      types: ['car_repair', 'point_of_interest'],
      business_status: 'OPERATIONAL'
    },
    {
      place_id: `mock-${city}-3`,
      name: `Toyota Service Center ${city}`,
      formatted_address: `Airport Road, ${city}, Somaliland`,
      geometry: {
        location: CITY_COORDINATES[city as keyof typeof CITY_COORDINATES] || { lat: 0, lng: 0 }
      },
      rating: 4.7,
      user_ratings_total: 112,
      types: ['car_dealer', 'car_repair', 'point_of_interest'],
      business_status: 'OPERATIONAL'
    }
  ];
}
