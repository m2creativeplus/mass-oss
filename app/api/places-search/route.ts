/**
 * MASS OS - Google Maps Places Search API
 * 
 * Searches for automotive businesses in Somaliland cities
 */

import { NextRequest, NextResponse } from 'next/server';
import { searchAutomotiveBusinesses, getPlaceDetails, placeToEntity } from '@/lib/google-maps';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const city = searchParams.get('city') || 'Hargeisa';
  const keyword = searchParams.get('keyword') || undefined;
  const radius = parseInt(searchParams.get('radius') || '10000');

  try {
    const places = await searchAutomotiveBusinesses(
      city as 'Hargeisa' | 'Berbera' | 'Burco' | 'Borama' | 'Las Anod' | 'Erigavo',
      keyword,
      radius
    );

    return NextResponse.json({
      success: true,
      data: {
        city,
        count: places.length,
        places: places.map(p => ({
          id: p.place_id,
          name: p.name,
          address: p.formatted_address,
          rating: p.rating,
          reviewCount: p.user_ratings_total,
          status: p.business_status,
          types: p.types,
        })),
      },
    });
  } catch (error) {
    console.error('[Places Search API] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to search places' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { placeId, city } = body;

    if (!placeId) {
      return NextResponse.json(
        { success: false, error: 'placeId is required' },
        { status: 400 }
      );
    }

    const details = await getPlaceDetails(placeId);
    
    if (!details) {
      return NextResponse.json(
        { success: false, error: 'Place not found' },
        { status: 404 }
      );
    }

    // Convert to MASS OS entity format
    const entity = placeToEntity(details, city || 'Hargeisa');

    return NextResponse.json({
      success: true,
      data: {
        raw: details,
        entity,
      },
    });
  } catch (error) {
    console.error('[Places Details API] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get place details' },
      { status: 500 }
    );
  }
}
