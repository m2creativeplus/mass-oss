/**
 * MASS OS - National Automotive Intelligence System
 * Centralized Type Definitions
 * 
 * Somaliland Automotive Ecosystem Types
 */

// ============================================================
// AUTOMOTIVE ENTITIES (Workshops, Dealers, Parts Sellers)
// ============================================================

export type EntityType = 
  | 'workshop' 
  | 'dealer' 
  | 'parts_seller' 
  | 'dilaal' 
  | 'tire_shop'
  | 'fuel_station'
  | 'fleet_operator'
  | 'service_provider';

export interface AutomotiveEntity {
  id: string;
  entityType: EntityType;
  businessName: string;
  businessNameSomali?: string;
  location: {
    city: string;
    neighborhood?: string;
    coordinates?: [number, number];
    addressRaw?: string;
  };
  contact: {
    phoneNumbers: string[];
    whatsapp?: string;
    facebook?: string;
    tiktok?: string;
    instagram?: string;
    email?: string;
  };
  servicesOffered: string[];
  brandsSpecialized: string[];
  priceIndicators?: {
    laborRate?: number;
    typicalServiceCost?: number;
  };
  trustScore: number; // 0-100
  dataQuality: 'high' | 'medium' | 'low';
  source: 'google_maps' | 'facebook' | 'tiktok' | 'manual' | 'gold_standard';
  verified: boolean;
  lastUpdated: string;
  mediaAssets?: string[];
  isActive: boolean;
}

// ============================================================
// VEHICLE INTELLIGENCE (Market Data)
// ============================================================

export interface VehicleIntelligence {
  id: string;
  make: string;
  model: string;
  variant?: string;
  yearRange: [number, number];
  marketData: {
    popularityScore: number; // 1-100
    primaryUse: 'taxi' | 'personal' | 'commercial' | 'government' | 'ngo';
    typicalImportSource: 'japan' | 'uae' | 'europe' | 'usa' | 'china';
    priceRangeUsd: [number, number];
    fuelType: 'petrol' | 'diesel' | 'hybrid' | 'electric';
  };
  maintenanceProfile: {
    commonFaults: string[];
    typicalRepairFrequencyMonths: number;
    partsAvailability: 'abundant' | 'common' | 'rare';
    maintenanceCostIndex: number; // Relative to Toyota Vitz = 100
  };
  localKnowledge: {
    somaliNickname?: string;
    mechanicNotes: string[];
    climateConsiderations: string[];
  };
}

// ============================================================
// SPARE PARTS INTELLIGENCE
// ============================================================

export type PriceTier = 'genuine_oem' | 'premium_aftermarket' | 'standard_aftermarket' | 'budget' | 'used';

export interface PartsPricing {
  priceUsd: number;
  tier: PriceTier;
  brand?: string;
  source: string;
  lastUpdated: string;
}

export interface SparePart {
  id: string;
  partNumberOem?: string;
  partNumber: string;
  name: string;
  nameSomali?: string;
  category: string;
  subcategory?: string;
  compatibleVehicles: {
    make: string;
    models: string[];
    years?: [number, number];
  }[];
  pricing: {
    genuineOem?: PartsPricing;
    aftermarket?: PartsPricing;
    used?: PartsPricing;
  };
  marketIntelligence: {
    availabilityScore: number; // 0-100
    counterfeitRisk: 'high' | 'medium' | 'low';
    demandLevel: 'very_high' | 'high' | 'medium' | 'low';
  };
  visualIdentification?: string[];
  stock?: number;
}

// ============================================================
// MARKET INTELLIGENCE DASHBOARD
// ============================================================

export interface MarketIntelligence {
  totalWorkshops: number;
  totalVehiclesTracked: number;
  averageRepairCost: number;
  topVehicleModels: {
    model: string;
    count: number;
    avgMonthlyMaintenance: number;
  }[];
  regionalBreakdown: {
    city: string;
    workshopCount: number;
    vehicleCount: number;
  }[];
  partsDemandForecast: {
    partName: string;
    predictedDemand30d: number;
    currentStockLevel: number;
    reorderRecommendation: boolean;
  }[];
}

// ============================================================
// WORK ORDERS & SERVICE
// ============================================================

export type WorkOrderStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

export interface MassWorkOrder {
  id: string;
  orderNumber: string;
  vehicleId: string;
  customerId: string;
  technicianId?: string;
  workshopId?: string;
  status: WorkOrderStatus;
  services: string[];
  parts: {
    partId: string;
    quantity: number;
    unitPrice: number;
  }[];
  laborCost: number;
  partsCost: number;
  totalCost: number;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

// ============================================================
// DILAAL (BROKER) NETWORK
// ============================================================

export interface Dilaal {
  id: string;
  name: string;
  phoneNumbers: string[];
  activeListings: number;
  trustScore: number;
  knownLocations: string[];
  specialization: string[];
  priceCompetitiveness: number; // Compared to market average
  fraudFlags: {
    duplicateListings: number;
    priceAnomalies: number;
    fakeDocumentationSuspected: boolean;
  };
}

// ============================================================
// SCRAPED DATA ENTITIES
// ============================================================

export interface ScrapedEntity {
  id: string;
  sourceType: 'google_maps' | 'facebook' | 'tiktok' | 'instagram';
  rawData: Record<string, unknown>;
  extractedAt: string;
  processed: boolean;
  entityId?: string; // Link to AutomotiveEntity if processed
  confidence: number;
}

// ============================================================
// DASHBOARD STATS
// ============================================================

export interface MassOSStats {
  platform: {
    totalUsers: number;
    activeWorkshops: number;
    monthlyJobsProcessed: number;
    revenueMrr: number;
  };
  market: {
    vehiclePopulationTracked: number;
    averageMaintenanceFrequencyDays: number;
    mostCommonRepairs: string[];
    partsDemandIndex: Record<string, number>;
  };
  intelligence: {
    dataSourcesActive: number;
    entitiesDiscovered30d: number;
    dataQualityScore: number;
    aiConfidenceAverage: number;
  };
}

// ============================================================
// PRICING TIERS (SaaS)
// ============================================================

export const MASS_OS_PRICING = {
  fuundi: {
    name: 'Fuundi (Free)',
    priceUsd: 0,
    features: [
      'Basic job logging',
      'WhatsApp receipts',
      '10 jobs/month',
      'Mobile app access'
    ],
    target: 'Street mechanics'
  },
  garaash: {
    name: 'Garaash (Basic)',
    priceUsd: 15,
    features: [
      'Unlimited jobs',
      'Inventory tracking',
      '10 AI part scans/month',
      'Customer database',
      'Basic analytics'
    ],
    target: 'Small workshops'
  },
  shirkad: {
    name: 'Shirkad (Pro)',
    priceUsd: 45,
    features: [
      'Multi-staff accounts',
      'Advanced analytics',
      'Insurance API access',
      'Unlimited AI scans',
      'Priority support',
      'Custom reports'
    ],
    target: 'Service centers'
  },
  enterprise: {
    name: 'Enterprise',
    priceUsd: 0, // Custom pricing
    features: [
      'Fleet management',
      'GovTech integration',
      'White-label option',
      'Dedicated support',
      'Custom integrations',
      'API access'
    ],
    target: 'Dealers, Fleets, Government'
  }
} as const;

// ============================================================
// SOMALILAND CITIES
// ============================================================

export const SOMALILAND_CITIES = [
  { name: 'Hargeisa', nameSomali: 'Hargeysa', region: 'Maroodijeex' },
  { name: 'Berbera', nameSomali: 'Berbera', region: 'Saaxil' },
  { name: 'Burco', nameSomali: 'Burco', region: 'Togdheer' },
  { name: 'Borama', nameSomali: 'Boorama', region: 'Awdal' },
  { name: 'Las Anod', nameSomali: 'Laascaanood', region: 'Sool' },
  { name: 'Erigavo', nameSomali: 'Ceerigaabo', region: 'Sanaag' },
] as const;

// ============================================================
// HELPER TYPES
// ============================================================

export type City = typeof SOMALILAND_CITIES[number]['name'];

export interface ApiResponse<T> {
  data?: T;
  error?: {
    message: string;
    code?: string;
  };
  success: boolean;
}
