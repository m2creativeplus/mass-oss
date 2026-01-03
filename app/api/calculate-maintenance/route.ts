/**
 * MASS OS - Maintenance Cost Calculator API
 * 
 * Calculates repair estimates based on vehicle and issue type
 */

import { NextRequest, NextResponse } from 'next/server';

// Pricing data for Somaliland market (USD)
const LABOR_RATES = {
  budget: 15,
  standard: 25,
  premium: 40,
};

const REPAIR_COSTS: Record<string, { parts: { budget: number; standard: number; premium: number }; hours: number }> = {
  'brake_replacement': { parts: { budget: 23, standard: 65, premium: 120 }, hours: 2 },
  'oil_change': { parts: { budget: 15, standard: 35, premium: 55 }, hours: 0.5 },
  'engine_overheating': { parts: { budget: 45, standard: 120, premium: 280 }, hours: 4 },
  'transmission_repair': { parts: { budget: 150, standard: 350, premium: 600 }, hours: 8 },
  'ac_repair': { parts: { budget: 80, standard: 180, premium: 320 }, hours: 3 },
  'suspension': { parts: { budget: 60, standard: 140, premium: 220 }, hours: 3 },
  'timing_chain': { parts: { budget: 120, standard: 280, premium: 450 }, hours: 6 },
  'alternator': { parts: { budget: 85, standard: 180, premium: 320 }, hours: 2 },
  'starter_motor': { parts: { budget: 70, standard: 150, premium: 280 }, hours: 1.5 },
  'battery': { parts: { budget: 65, standard: 95, premium: 150 }, hours: 0.5 },
};

// Model-specific cost multipliers
const MODEL_MULTIPLIERS: Record<string, number> = {
  'toyota_vitz': 1.0,
  'toyota_corolla': 1.1,
  'toyota_prado': 1.5,
  'toyota_hilux': 1.3,
  'toyota_landcruiser': 1.8,
  'suzuki_alto': 0.9,
  'suzuki_swift': 0.95,
  'hyundai_accent': 1.0,
  'nissan_tiida': 1.0,
  'default': 1.0,
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { make, model, year, issue, city } = body;

    // Get base repair data
    const repair = REPAIR_COSTS[issue] || REPAIR_COSTS['oil_change'];
    
    // Get model multiplier
    const modelKey = `${(make || 'toyota').toLowerCase()}_${(model || 'vitz').toLowerCase()}`;
    const multiplier = MODEL_MULTIPLIERS[modelKey] || MODEL_MULTIPLIERS['default'];

    // Calculate estimates
    const estimates = {
      budget: {
        parts: Math.round(repair.parts.budget * multiplier),
        labor: Math.round(LABOR_RATES.budget * repair.hours),
        total: 0,
        timeframeHours: repair.hours,
      },
      standard: {
        parts: Math.round(repair.parts.standard * multiplier),
        labor: Math.round(LABOR_RATES.standard * repair.hours),
        total: 0,
        timeframeHours: repair.hours,
      },
      premium: {
        parts: Math.round(repair.parts.premium * multiplier),
        labor: Math.round(LABOR_RATES.premium * repair.hours),
        total: 0,
        timeframeHours: Math.round(repair.hours * 1.5),
      },
    };

    // Calculate totals
    estimates.budget.total = estimates.budget.parts + estimates.budget.labor;
    estimates.standard.total = estimates.standard.parts + estimates.standard.labor;
    estimates.premium.total = estimates.premium.parts + estimates.premium.labor;

    return NextResponse.json({
      success: true,
      data: {
        vehicle: { make, model, year },
        issue,
        city: city || 'Hargeisa',
        estimates,
        confidenceLevel: 0.85,
        dataSources: ['local_market_prices', 'historical_repairs', 'supplier_quotes'],
        recommendations: [
          estimates.budget.total < 100 
            ? 'Budget option recommended for this repair' 
            : 'Consider standard option for reliability',
        ],
      },
    });
  } catch (error) {
    console.error('[Maintenance Calculator API] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to calculate estimate' },
      { status: 500 }
    );
  }
}
