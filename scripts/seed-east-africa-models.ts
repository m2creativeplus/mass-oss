/**
 * MASS EAST AFRICA VEHICLE MARKET INTELLIGENCE
 * 
 * Priority models for Somaliland, Kenya, Uganda, Tanzania, Ethiopia
 * Based on BE FORWARD scraping data (Jan 2026)
 * 
 * Run: npx tsx scripts/seed-east-africa-models.ts
 */

// ============================================================
// TOYOTA VOXY COMPREHENSIVE DATA (From BE FORWARD Scrape)
// Chassis: ZRR70 (2007-2013), ZRR80 (2014+)
// Engine: 3ZR-FAE (2.0L Valvematic)
// ============================================================

export const voxyListings = [
  // 2017+ Models (Premium tier)
  { refNo: "CB337850", year: 2017, month: 5, grade: "ZS KIRAMEKI 2", chassis: "ZRR85W", mileage: 132161, fobPrice: 7310, totalPrice: 14844, engine: "3ZR-FAE", drive: "4WD" },
  
  // 2015-2016 Models (Mid-Premium)
  { refNo: "CB435674", year: 2015, month: 8, grade: "ZS KIRAMEKI", chassis: "ZRR85W", mileage: 151517, fobPrice: 5930, totalPrice: 13330, engine: "3ZR-FAE", drive: "4WD" },
  { refNo: "CB423528", year: 2015, month: 1, grade: "ZS KIRAMEKI", chassis: "ZRR80W", mileage: 150135, fobPrice: 5330, totalPrice: 12730, engine: "3ZR-FAE", drive: "2WD" },
  
  // 2013-2014 Models (Value tier)
  { refNo: "CB453511", year: 2013, month: 9, grade: "ZS KIRAMEKI Z", chassis: "ZRR75W", mileage: 126692, fobPrice: 3580, totalPrice: 11114, engine: "3ZR-FAE", drive: "4WD" },
  { refNo: "CB427129", year: 2013, month: 10, grade: "ZS KIRAMEKI Z", chassis: "ZRR70W", mileage: 108300, fobPrice: 3380, totalPrice: 10914, engine: "3ZR-FAE", drive: "2WD" },
  { refNo: "CB465554", year: 2013, month: 1, grade: "X L EDITION", chassis: "ZRR70G", mileage: 78703, fobPrice: 3780, totalPrice: 11310, engine: "3ZR-FAE", drive: "2WD" },
  
  // 2010 Target Models (Budget tier - High value in Somaliland)
  { refNo: "CB422617", year: 2010, month: 8, grade: "TRANS-X", chassis: "ZRR70G", mileage: 142657, fobPrice: 2580, totalPrice: 10114, engine: "3ZR-FAE", drive: "2WD" },
  { refNo: "CB448143", year: 2010, month: 8, grade: "ZS KIRAMEKI 2", chassis: "ZRR70W", mileage: 172000, fobPrice: 2580, totalPrice: 10114, engine: "3ZR-FAE", drive: "2WD" },
  
  // 2008-2009 Target Models (Entry tier)
  { refNo: "CB426694", year: 2009, month: 7, grade: "X L EDITION", chassis: "ZRR70G", mileage: 155377, fobPrice: 2240, totalPrice: 9774, engine: "3ZR-FAE", drive: "2WD" },
  { refNo: "CB434585", year: 2008, month: 11, grade: "ZS KIRAMEKI", chassis: "ZRR70W", mileage: 169383, fobPrice: 2330, totalPrice: 9864, engine: "3ZR-FAE", drive: "2WD" },
  { refNo: "CB448135", year: 2008, month: 11, grade: "ZS KIRAMEKI", chassis: "ZRR70W", mileage: 114888, fobPrice: 2330, totalPrice: 9864, engine: "3ZR-FAE", drive: "2WD" },
  { refNo: "CB460269", year: 2008, month: 11, grade: "ZS", chassis: "ZRR70W", mileage: 137738, fobPrice: 2180, totalPrice: 9714, engine: "3ZR-FAE", drive: "2WD" },
];

// ============================================================
// VOXY GRADE RANKINGS & TRUST RATINGS
// ============================================================

export const voxyGradeRankings = [
  {
    grade: "G's VERSION EDGE",
    tier: "PREMIUM",
    trustRating: 9.2,
    pricePremium: 1.35, // 35% more than base ZS
    features: ["Sports suspension", "Aerodynamic body kit", "18\" alloys", "Paddle shifters"],
    maintenanceRisk: "MEDIUM", // Sports parts harder to source
    resaleValue: "EXCELLENT",
    notes: "Collector market premium in Kenya/Tanzania"
  },
  {
    grade: "ZS KIRAMEKI 2",
    tier: "HIGH",
    trustRating: 8.8,
    pricePremium: 1.25,
    features: ["LED headlights", "Dual power sliding doors", "Premium audio", "Smart entry"],
    maintenanceRisk: "LOW",
    resaleValue: "EXCELLENT",
    notes: "Best family value - high demand in Somaliland"
  },
  {
    grade: "ZS KIRAMEKI",
    tier: "HIGH",
    trustRating: 8.5,
    pricePremium: 1.20,
    features: ["Chrome accents", "Rear spoiler", "Privacy glass", "Alloy wheels"],
    maintenanceRisk: "LOW",
    resaleValue: "VERY GOOD",
    notes: "Most common import grade"
  },
  {
    grade: "ZS KIRAMEKI Z",
    tier: "MID-HIGH",
    trustRating: 8.2,
    pricePremium: 1.15,
    features: ["Sports grille", "Side skirts", "Fog lamps"],
    maintenanceRisk: "LOW",
    resaleValue: "VERY GOOD",
    notes: "Good balance of features and price"
  },
  {
    grade: "ZS",
    tier: "MID",
    trustRating: 8.0,
    pricePremium: 1.10,
    features: ["7-seater", "Dual sliding doors", "Cruise control"],
    maintenanceRisk: "VERY LOW",
    resaleValue: "GOOD",
    notes: "Reliable workhorse - fleet favorite"
  },
  {
    grade: "V",
    tier: "MID",
    trustRating: 7.8,
    pricePremium: 1.05,
    features: ["7-seater", "Basic trim", "Manual AC"],
    maintenanceRisk: "VERY LOW",
    resaleValue: "GOOD",
    notes: "Budget family option"
  },
  {
    grade: "X L EDITION",
    tier: "ENTRY",
    trustRating: 7.5,
    pricePremium: 1.00,
    features: ["8-seater", "Basic audio", "Steel wheels"],
    maintenanceRisk: "VERY LOW",
    resaleValue: "FAIR",
    notes: "Maximum capacity - taxi/matatu use"
  },
  {
    grade: "TRANS-X",
    tier: "ENTRY",
    trustRating: 7.2,
    pricePremium: 0.95,
    features: ["5-seater", "Flat cargo floor", "Work vehicle spec"],
    maintenanceRisk: "VERY LOW",
    resaleValue: "FAIR",
    notes: "Commercial use - delivery vehicles"
  },
];

// ============================================================
// 3ZR-FAE ENGINE SPARE PARTS (Voxy/Noah Specific)
// ============================================================

export const voxy3ZRParts = [
  {
    partNumber: "SP-VOX-001",
    oemNumber: "16100-39435",
    name: "Water Pump Assembly (3ZR-FAE)",
    category: "Engine",
    subcategory: "Cooling",
    compatibleMakes: ["Toyota"],
    compatibleModels: ["Voxy ZRR70", "Voxy ZRR80", "Noah ZRR70", "Noah ZRR80", "Wish ZGE20"],
    engineCodes: ["3ZR-FAE", "3ZR-FE"],
    priceUaeUsd: 145,
    priceTier: "genuine_oem" as const,
    brand: "Toyota",
    steeringSideCritical: false,
    failureRank: 7,
    averageLifespanKm: 100000,
    notes: "Replace with timing chain at 100k km"
  },
  {
    partNumber: "SP-VOX-002",
    oemNumber: "22270-37010",
    name: "Valvematic Actuator Assembly",
    category: "Engine",
    subcategory: "Valvetrain",
    compatibleMakes: ["Toyota"],
    compatibleModels: ["Voxy ZRR70", "Voxy ZRR80", "Noah ZRR70", "Allion", "Premio"],
    engineCodes: ["3ZR-FAE"],
    priceUaeUsd: 380,
    priceTier: "genuine_oem" as const,
    brand: "Toyota",
    steeringSideCritical: false,
    failureRank: 8,
    averageLifespanKm: 120000,
    notes: "⚠️ CRITICAL: Valvematic-specific - common failure on high-mileage units"
  },
  {
    partNumber: "SP-VOX-003",
    oemNumber: "27060-37030",
    name: "Alternator Assembly (3ZR)",
    category: "Electrical",
    subcategory: "Charging",
    compatibleMakes: ["Toyota"],
    compatibleModels: ["Voxy ZRR70", "Voxy ZRR80", "Noah ZRR70"],
    engineCodes: ["3ZR-FAE", "3ZR-FE"],
    priceUaeUsd: 220,
    priceTier: "premium_aftermarket" as const,
    brand: "Denso",
    steeringSideCritical: false,
    failureRank: 5,
    averageLifespanKm: 150000,
    notes: "Check brushes at 100k km"
  },
  {
    partNumber: "SP-VOX-004",
    oemNumber: "04465-28500",
    name: "Front Brake Pads Set",
    category: "Brakes",
    subcategory: "Pads",
    compatibleMakes: ["Toyota"],
    compatibleModels: ["Voxy ZRR70", "Voxy ZRR80", "Noah", "Wish"],
    priceUaeUsd: 65,
    priceTier: "genuine_oem" as const,
    brand: "Toyota",
    steeringSideCritical: false,
    failureRank: 2,
    averageLifespanKm: 40000,
    notes: "High turnover item - stock heavily"
  },
  {
    partNumber: "SP-VOX-005",
    oemNumber: "48157-28010",
    name: "Front Strut Mount",
    category: "Suspension",
    subcategory: "Mounts",
    compatibleMakes: ["Toyota"],
    compatibleModels: ["Voxy ZRR70", "Voxy ZRR80", "Noah", "Esquire"],
    priceUaeUsd: 85,
    priceTier: "premium_aftermarket" as const,
    brand: "KYB",
    steeringSideCritical: false,
    failureRank: 6,
    averageLifespanKm: 80000,
    notes: "Replace in pairs - common squeaking noise cause"
  },
  {
    partNumber: "SP-VOX-006",
    oemNumber: "69110-28090",
    name: "Sliding Door Motor Assembly (Right)",
    category: "Body",
    subcategory: "Doors",
    compatibleMakes: ["Toyota"],
    compatibleModels: ["Voxy ZRR70", "Voxy ZRR80", "Noah"],
    priceUaeUsd: 320,
    priceTier: "genuine_oem" as const,
    brand: "Toyota",
    steeringSideCritical: false,
    failureRank: 7,
    averageLifespanKm: 150000,
    notes: "Dual sliding door models - check both sides"
  },
];

// ============================================================
// EAST AFRICA PRIORITY MODELS (2010-2016)
// Ranked by demand in Somaliland, Kenya, Uganda, Tanzania
// ============================================================

export const eastAfricaTopModels = [
  // Tier 1: Highest Demand
  { rank: 1, make: "Toyota", model: "Hilux", variant: "Double Cab", yearRange: "2010-2016", demand: "EXTREME", avgFobPrice: 12000, streetPrice: 18000, use: "Transport/Commercial", notes: "Diesel 2KD-FTV most sought" },
  { rank: 2, make: "Toyota", model: "Land Cruiser Prado", variant: "150 Series", yearRange: "2010-2016", demand: "EXTREME", avgFobPrice: 22000, streetPrice: 32000, use: "Executive/NGO", notes: "Diesel TXL most valued" },
  { rank: 3, make: "Toyota", model: "Vitz", variant: "1.0L/1.3L", yearRange: "2010-2016", demand: "VERY HIGH", avgFobPrice: 3500, streetPrice: 5500, use: "Personal/Taxi", notes: "1NZ-FE engine preferred" },
  { rank: 4, make: "Toyota", model: "Probox", variant: "Succeed", yearRange: "2010-2016", demand: "VERY HIGH", avgFobPrice: 3200, streetPrice: 5000, use: "Commercial", notes: "Delivery fleet favorite" },
  { rank: 5, make: "Toyota", model: "Voxy", variant: "ZRR70/ZRR80", yearRange: "2008-2016", demand: "HIGH", avgFobPrice: 3500, streetPrice: 6500, use: "Family/Matatu", notes: "3ZR-FAE engine - 8 seater value" },
  
  // Tier 2: High Demand
  { rank: 6, make: "Toyota", model: "Noah", variant: "ZRR70/ZRR80", yearRange: "2008-2016", demand: "HIGH", avgFobPrice: 3300, streetPrice: 6000, use: "Family/Matatu", notes: "Voxy twin - slightly lower spec" },
  { rank: 7, make: "Toyota", model: "Harrier", variant: "2.4L/3.5L", yearRange: "2010-2016", demand: "HIGH", avgFobPrice: 12000, streetPrice: 18000, use: "Executive", notes: "Luxury SUV market" },
  { rank: 8, make: "Toyota", model: "Crown", variant: "Athlete/Royal", yearRange: "2010-2016", demand: "HIGH", avgFobPrice: 8000, streetPrice: 13000, use: "Executive/VIP", notes: "3GR-FSE/2GR-FSE engines" },
  { rank: 9, make: "Toyota", model: "Corolla Axio", variant: "1.5L/1.8L", yearRange: "2010-2016", demand: "HIGH", avgFobPrice: 5500, streetPrice: 9000, use: "Taxi/Personal", notes: "Reliable sedan workhorse" },
  { rank: 10, make: "Toyota", model: "RAV4", variant: "3rd Gen", yearRange: "2010-2016", demand: "HIGH", avgFobPrice: 9000, streetPrice: 14000, use: "Personal/NGO", notes: "Compact SUV segment leader" },
  
  // Tier 3: Moderate-High Demand
  { rank: 11, make: "Toyota", model: "Land Cruiser 79", variant: "Pick-up", yearRange: "2010-2020", demand: "MODERATE-HIGH", avgFobPrice: 25000, streetPrice: 38000, use: "Heavy Duty/Mining", notes: "Indestructible workhorse" },
  { rank: 12, make: "Suzuki", model: "Escudo", variant: "Vitara", yearRange: "2010-2016", demand: "MODERATE-HIGH", avgFobPrice: 6500, streetPrice: 10000, use: "Personal/Light Duty", notes: "Compact 4x4 value" },
  { rank: 13, make: "Suzuki", model: "Swift", variant: "Sport/Standard", yearRange: "2010-2017", demand: "MODERATE", avgFobPrice: 3000, streetPrice: 5000, use: "Personal", notes: "Fuel efficient city car" },
  { rank: 14, make: "Toyota", model: "Verossa", variant: "VR25/25", yearRange: "2001-2004", demand: "MODERATE", avgFobPrice: 4500, streetPrice: 7500, use: "Personal/Enthusiast", notes: "1JZ-GTE turbo cult following" },
  { rank: 15, make: "Suzuki", model: "Jimny", variant: "JB23/JB74", yearRange: "2010-2018", demand: "MODERATE", avgFobPrice: 7000, streetPrice: 11000, use: "Off-road/Recreation", notes: "Compact 4x4 specialist" },
  
  // Tier 4: Specialized Demand
  { rank: 16, make: "Honda", model: "Fit", variant: "GE/GP", yearRange: "2010-2016", demand: "MODERATE", avgFobPrice: 3500, streetPrice: 5500, use: "Personal/Taxi", notes: "Magic seat versatility" },
  { rank: 17, make: "Honda", model: "Vezel", variant: "Hybrid/Petrol", yearRange: "2013-2018", demand: "MODERATE", avgFobPrice: 8000, streetPrice: 12000, use: "Personal", notes: "Compact SUV growing segment" },
  { rank: 18, make: "Nissan", model: "X-Trail", variant: "T31/T32", yearRange: "2010-2016", demand: "MODERATE", avgFobPrice: 7000, streetPrice: 11000, use: "Family/Adventure", notes: "7-seater option valuable" },
  { rank: 19, make: "Toyota", model: "Aqua", variant: "Hybrid", yearRange: "2012-2017", demand: "LOW-MODERATE", avgFobPrice: 5500, streetPrice: 8500, use: "Personal/Taxi", notes: "Hybrid battery concern in hot climate" },
  { rank: 20, make: "Suzuki", model: "Every", variant: "Van/Wagon", yearRange: "2010-2017", demand: "MODERATE", avgFobPrice: 4000, streetPrice: 6500, use: "Commercial", notes: "Micro-delivery segment" },
];

// ============================================================
// LANDED COST CALCULATOR (Berbera Port)
// ============================================================

export const calculateLandedCost = (fobPrice: number): number => {
  const shippingJapanBerbera = 1800; // USD Japan to Berbera (Ro-Ro)
  const importDuty = 0.25; // 25% import duty Somaliland
  const clearanceFees = 200; // Port clearing
  
  const cif = fobPrice + shippingJapanBerbera;
  const dutyAmount = cif * importDuty;
  const landedCost = cif + dutyAmount + clearanceFees;
  
  return Math.round(landedCost);
};

// Calculate landed costs for all Voxy listings
export const voxyWithLandedCosts = voxyListings.map(v => ({
  ...v,
  landedCostBerbera: calculateLandedCost(v.fobPrice),
  estimatedStreetPrice: Math.round(calculateLandedCost(v.fobPrice) * 1.15), // 15% dealer margin
}));

// Summary stats
console.log("📊 MASS EAST AFRICA MARKET INTELLIGENCE");
console.log("=".repeat(50));
console.log(`🚐 Toyota Voxy Listings: ${voxyListings.length}`);
console.log(`📈 Voxy Grades Analyzed: ${voxyGradeRankings.length}`);
console.log(`🔧 3ZR-FAE Parts Catalog: ${voxy3ZRParts.length}`);
console.log(`🌍 East Africa Models: ${eastAfricaTopModels.length}`);
console.log("");
console.log("💰 VOXY LANDED COST SAMPLES (Berbera):");
voxyWithLandedCosts.slice(0, 3).forEach(v => {
  console.log(`   ${v.year} ${v.grade}: FOB $${v.fobPrice} → Landed $${v.landedCostBerbera} → Street ~$${v.estimatedStreetPrice}`);
});
console.log("");
console.log("✅ Data ready for Convex seeding!");
