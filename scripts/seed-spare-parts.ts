/**
 * MASS SPARE PARTS MASTER - Seed Script
 * 
 * Toyota & Suzuki parts catalog for 2010-2016 vehicles
 * Common failure points in Somaliland market
 * 
 * Run: npx tsx scripts/seed-spare-parts.ts
 */

// ============================================================
// TOYOTA & SUZUKI SPARE PARTS CATALOG
// Includes: Hilux, Prado, Vitz, Crown, Verossa, Corolla
//           Escudo, Swift, Jimny, Every
// ============================================================

export const sparePartsCatalog = [
  // ========== ENGINE PARTS ==========
  {
    partNumber: "SP-ENG-001",
    oemNumber: "23670-30050",
    name: "Fuel Injector Set (4pcs)",
    category: "Engine",
    subcategory: "Fuel System",
    compatibleMakes: ["Toyota"],
    compatibleModels: ["Hilux 2010-2016", "Prado 150 2010-2016"],
    engineCodes: ["2KD-FTV", "1KD-FTV"],
    priceUaeUsd: 1200,
    priceTier: "genuine_oem" as const,
    brand: "Toyota",
    steeringSideCritical: false,
    failureRank: 9,
    averageLifespanKm: 150000,
    notes: "Most common failure - local fuel quality causes clogging"
  },
  {
    partNumber: "SP-ENG-002",
    oemNumber: "22270-21011",
    name: "Idle Air Control Valve",
    category: "Engine",
    subcategory: "Fuel System",
    compatibleMakes: ["Toyota"],
    compatibleModels: ["Vitz 2010-2016", "Corolla 2010-2016"],
    engineCodes: ["1NZ-FE", "2NZ-FE"],
    priceUaeUsd: 180,
    priceTier: "genuine_oem" as const,
    brand: "Toyota",
    steeringSideCritical: false,
    failureRank: 7,
    averageLifespanKm: 120000,
    notes: "Common on older Vitz models"
  },
  {
    partNumber: "SP-ENG-003",
    oemNumber: "13507-21020",
    name: "Timing Chain Kit",
    category: "Engine",
    subcategory: "Timing",
    compatibleMakes: ["Toyota"],
    compatibleModels: ["Vitz 2010-2016", "Corolla 2010-2016", "Crown 2010-2016"],
    engineCodes: ["1NZ-FE", "2GR-FSE"],
    priceUaeUsd: 350,
    priceTier: "genuine_oem" as const,
    brand: "Toyota",
    steeringSideCritical: false,
    failureRank: 5,
    averageLifespanKm: 200000,
    notes: "Replace if rattling on cold start"
  },
  {
    partNumber: "SP-ENG-004",
    oemNumber: "1JZ-GTE",
    name: "Turbocharger Assembly",
    category: "Engine",
    subcategory: "Turbo",
    compatibleMakes: ["Toyota"],
    compatibleModels: ["Verossa 2001-2004", "Crown Athlete 2003-2008"],
    engineCodes: ["1JZ-GTE", "2JZ-GTE"],
    priceUaeUsd: 850,
    priceTier: "premium_aftermarket" as const,
    brand: "Garrett",
    steeringSideCritical: false,
    failureRank: 6,
    averageLifespanKm: 180000,
    notes: "Verossa turbo models popular in Somaliland"
  },

  // ========== SUSPENSION PARTS ==========
  {
    partNumber: "SP-SUS-001",
    oemNumber: "48655-60040",
    name: "Front Suspension Bushing Kit",
    category: "Suspension",
    subcategory: "Bushings",
    compatibleMakes: ["Toyota"],
    compatibleModels: ["Prado 150 2010-2016", "Hilux 2010-2016"],
    priceUaeUsd: 150,
    priceTier: "premium_aftermarket" as const,
    brand: "SPC",
    steeringSideCritical: false,
    failureRank: 8,
    averageLifespanKm: 80000,
    notes: "Cracks from heat and off-road use"
  },
  {
    partNumber: "SP-SUS-002",
    oemNumber: "48531-60521",
    name: "Rear Shock Absorber (Pair)",
    category: "Suspension",
    subcategory: "Shocks",
    compatibleMakes: ["Toyota"],
    compatibleModels: ["Prado 150 2010-2016", "Land Cruiser 200"],
    priceUaeUsd: 420,
    priceTier: "premium_aftermarket" as const,
    brand: "KYB",
    steeringSideCritical: false,
    failureRank: 7,
    averageLifespanKm: 100000,
    notes: "KYB Excel-G recommended for Somaliland roads"
  },
  {
    partNumber: "SP-SUS-003",
    oemNumber: "48830-60080",
    name: "Air Suspension Pump",
    category: "Suspension",
    subcategory: "Air System",
    compatibleMakes: ["Toyota"],
    compatibleModels: ["Land Cruiser 200 2010-2016", "Prado 150 VX"],
    priceUaeUsd: 850,
    priceTier: "genuine_oem" as const,
    brand: "Toyota",
    steeringSideCritical: false,
    failureRank: 8,
    averageLifespanKm: 120000,
    notes: "Dust causes premature failure"
  },
  {
    partNumber: "SP-SUS-004",
    oemNumber: "51686-52050",
    name: "Front Strut Assembly",
    category: "Suspension",
    subcategory: "Struts",
    compatibleMakes: ["Toyota"],
    compatibleModels: ["Vitz 2010-2016", "Corolla 2010-2016"],
    priceUaeUsd: 220,
    priceTier: "premium_aftermarket" as const,
    brand: "KYB",
    steeringSideCritical: false,
    failureRank: 6,
    averageLifespanKm: 100000,
    notes: "Replace in pairs"
  },

  // ========== STEERING PARTS (LHD/RHD Critical) ==========
  {
    partNumber: "SP-STR-001",
    oemNumber: "44200-0K020",
    name: "Power Steering Rack Assembly",
    category: "Steering",
    subcategory: "Rack",
    compatibleMakes: ["Toyota"],
    compatibleModels: ["Hilux 2010-2016", "Vitz 2010-2016", "Corolla 2010-2016"],
    priceUaeUsd: 700,
    priceTier: "genuine_oem" as const,
    brand: "Toyota",
    steeringSideCritical: true,
    failureRank: 7,
    averageLifespanKm: 150000,
    notes: "⚠️ LHD/RHD SPECIFIC - Verify steering side before order"
  },
  {
    partNumber: "SP-STR-002",
    oemNumber: "45510-02260",
    name: "Steering Column Assembly",
    category: "Steering",
    subcategory: "Column",
    compatibleMakes: ["Toyota"],
    compatibleModels: ["Corolla 2010-2016", "Crown 2010-2016"],
    priceUaeUsd: 380,
    priceTier: "genuine_oem" as const,
    brand: "Toyota",
    steeringSideCritical: true,
    failureRank: 4,
    averageLifespanKm: 250000,
    notes: "⚠️ LHD/RHD SPECIFIC - Match to vehicle configuration"
  },

  // ========== BRAKES ==========
  {
    partNumber: "SP-BRK-001",
    oemNumber: "04465-0K240",
    name: "Front Brake Pads Set",
    category: "Brakes",
    subcategory: "Pads",
    compatibleMakes: ["Toyota"],
    compatibleModels: ["Hilux 2010-2016", "Prado 150 2010-2016"],
    priceUaeUsd: 85,
    priceTier: "genuine_oem" as const,
    brand: "Toyota",
    steeringSideCritical: false,
    failureRank: 3,
    averageLifespanKm: 40000,
    notes: "High wear item - stock recommended"
  },
  {
    partNumber: "SP-BRK-002",
    oemNumber: "04466-60120",
    name: "Rear Brake Pads Set",
    category: "Brakes",
    subcategory: "Pads",
    compatibleMakes: ["Toyota"],
    compatibleModels: ["Land Cruiser 200 2010-2016", "Prado 150 2010-2016"],
    priceUaeUsd: 220,
    priceTier: "genuine_oem" as const,
    brand: "Toyota",
    steeringSideCritical: false,
    failureRank: 3,
    averageLifespanKm: 50000,
    notes: "Heavy vehicle wear"
  },

  // ========== ELECTRICAL ==========
  {
    partNumber: "SP-ELC-001",
    oemNumber: "44050-28270",
    name: "ABS Actuator Unit",
    category: "Electrical",
    subcategory: "ABS",
    compatibleMakes: ["Toyota"],
    compatibleModels: ["Vitz Hybrid 2010-2016", "Aqua 2012-2016"],
    priceUaeUsd: 1200,
    priceTier: "genuine_oem" as const,
    brand: "Toyota",
    steeringSideCritical: false,
    failureRank: 8,
    averageLifespanKm: 150000,
    notes: "Common electronic failure on hybrids"
  },
  {
    partNumber: "SP-ELC-002",
    oemNumber: "G9510-47031",
    name: "Hybrid Battery Cooling Fan",
    category: "Electrical",
    subcategory: "Hybrid",
    compatibleMakes: ["Toyota"],
    compatibleModels: ["Vitz Hybrid 2010-2016", "Aqua 2012-2016"],
    priceUaeUsd: 45,
    priceTier: "genuine_oem" as const,
    brand: "Toyota",
    steeringSideCritical: false,
    failureRank: 9,
    averageLifespanKm: 80000,
    notes: "Dust clogs fan - clean every 20,000km"
  },
  {
    partNumber: "SP-ELC-003",
    oemNumber: "81110-12A60",
    name: "LHD Headlight Assembly (Left)",
    category: "Electrical",
    subcategory: "Lighting",
    compatibleMakes: ["Toyota"],
    compatibleModels: ["Corolla 2010-2016", "Vitz 2010-2016"],
    priceUaeUsd: 280,
    priceTier: "genuine_oem" as const,
    brand: "Toyota",
    steeringSideCritical: true,
    failureRank: 4,
    averageLifespanKm: 200000,
    notes: "⚠️ LHD beam pattern - may need re-alignment for Somaliland roads"
  },

  // ========== INTERIOR ==========
  {
    partNumber: "SP-INT-001",
    oemNumber: "55401-12770",
    name: "Dashboard Pad Assembly",
    category: "Interior",
    subcategory: "Dashboard",
    compatibleMakes: ["Toyota"],
    compatibleModels: ["Corolla 2010-2016"],
    priceUaeUsd: 400,
    priceTier: "genuine_oem" as const,
    brand: "Toyota",
    steeringSideCritical: false,
    failureRank: 7,
    averageLifespanKm: 150000,
    notes: "Heat damage causes melting on Gulf imports"
  },

  // ========== SUZUKI PARTS ==========
  {
    partNumber: "SP-SUZ-001",
    oemNumber: "17400-65J01",
    name: "Water Pump Assembly",
    category: "Engine",
    subcategory: "Cooling",
    compatibleMakes: ["Suzuki"],
    compatibleModels: ["Escudo 2010-2016", "Grand Vitara 2010-2016"],
    engineCodes: ["J20A", "J24B"],
    priceUaeUsd: 120,
    priceTier: "genuine_oem" as const,
    brand: "Suzuki",
    steeringSideCritical: false,
    failureRank: 6,
    averageLifespanKm: 100000,
    notes: "Replace with timing belt"
  },
  {
    partNumber: "SP-SUZ-002",
    oemNumber: "55320-65J00",
    name: "Rear Shock Absorber (Pair)",
    category: "Suspension",
    subcategory: "Shocks",
    compatibleMakes: ["Suzuki"],
    compatibleModels: ["Jimny 2010-2018", "Jimny Sierra"],
    priceUaeUsd: 180,
    priceTier: "premium_aftermarket" as const,
    brand: "Monroe",
    steeringSideCritical: false,
    failureRank: 7,
    averageLifespanKm: 80000,
    notes: "Jimny popular for rough terrain"
  },
  {
    partNumber: "SP-SUZ-003",
    oemNumber: "ZC31S-15400",
    name: "Front Brake Disc Set",
    category: "Brakes",
    subcategory: "Discs",
    compatibleMakes: ["Suzuki"],
    compatibleModels: ["Swift Sport 2010-2017", "Swift 2010-2017"],
    priceUaeUsd: 95,
    priceTier: "premium_aftermarket" as const,
    brand: "Brembo",
    steeringSideCritical: false,
    failureRank: 5,
    averageLifespanKm: 60000,
    notes: "Swift Sport has larger discs"
  },
  {
    partNumber: "SP-SUZ-004",
    oemNumber: "17510-78K00",
    name: "Clutch Kit (Disc + Cover)",
    category: "Transmission",
    subcategory: "Clutch",
    compatibleMakes: ["Suzuki"],
    compatibleModels: ["Every 2010-2017", "Carry 2010-2017"],
    priceUaeUsd: 160,
    priceTier: "genuine_oem" as const,
    brand: "Suzuki",
    steeringSideCritical: false,
    failureRank: 6,
    averageLifespanKm: 100000,
    notes: "Commercial use increases wear"
  },

  // ========== FILTERS (High Turnover) ==========
  {
    partNumber: "SP-FLT-001",
    oemNumber: "04152-YZZA1",
    name: "Oil Filter",
    category: "Filters",
    subcategory: "Oil",
    compatibleMakes: ["Toyota"],
    compatibleModels: ["Hilux 2010-2016", "Prado 150", "Vitz", "Crown", "Verossa", "Corolla"],
    priceUaeUsd: 8,
    priceTier: "genuine_oem" as const,
    brand: "Toyota",
    steeringSideCritical: false,
    failureRank: 1,
    averageLifespanKm: 10000,
    notes: "High volume item - always stock"
  },
  {
    partNumber: "SP-FLT-002",
    oemNumber: "17801-0Y040",
    name: "Air Filter Element",
    category: "Filters",
    subcategory: "Air",
    compatibleMakes: ["Toyota"],
    compatibleModels: ["Vitz 2010-2016", "Corolla 2010-2016"],
    engineCodes: ["1NZ-FE", "2ZR-FE"],
    priceUaeUsd: 15,
    priceTier: "genuine_oem" as const,
    brand: "Toyota",
    steeringSideCritical: false,
    failureRank: 2,
    averageLifespanKm: 20000,
    notes: "Replace more frequently in dusty conditions"
  },
  {
    partNumber: "SP-FLT-003",
    oemNumber: "23390-0L090",
    name: "Diesel Fuel Filter",
    category: "Filters",
    subcategory: "Fuel",
    compatibleMakes: ["Toyota"],
    compatibleModels: ["Hilux Diesel 2010-2016", "Prado Diesel 2010-2016"],
    engineCodes: ["2KD-FTV", "1KD-FTV"],
    priceUaeUsd: 35,
    priceTier: "genuine_oem" as const,
    brand: "Denso",
    steeringSideCritical: false,
    failureRank: 8,
    averageLifespanKm: 30000,
    notes: "Critical for local fuel quality - change frequently"
  },
];

// ============================================================
// MARKET PRICE INTELLIGENCE DATA
// BE FORWARD vs Hargeisa Street Prices (Jan 2026)
// ============================================================

export const marketPriceData = [
  // Toyota
  { vehicleMake: "Toyota", vehicleModel: "Hilux", yearFrom: 2010, yearTo: 2016, source: "beforward", fobPriceUsd: 12000, streetPriceUsd: 18000, averageMileage: 120000, condition: "Good" },
  { vehicleMake: "Toyota", vehicleModel: "Prado 150", yearFrom: 2010, yearTo: 2016, source: "beforward", fobPriceUsd: 20000, streetPriceUsd: 30000, averageMileage: 100000, condition: "Good" },
  { vehicleMake: "Toyota", vehicleModel: "Vitz", yearFrom: 2010, yearTo: 2016, source: "beforward", fobPriceUsd: 3500, streetPriceUsd: 5500, averageMileage: 80000, condition: "Good" },
  { vehicleMake: "Toyota", vehicleModel: "Corolla", yearFrom: 2010, yearTo: 2016, source: "beforward", fobPriceUsd: 5500, streetPriceUsd: 9000, averageMileage: 90000, condition: "Good" },
  { vehicleMake: "Toyota", vehicleModel: "Crown", yearFrom: 2010, yearTo: 2016, source: "beforward", fobPriceUsd: 8000, streetPriceUsd: 13000, averageMileage: 95000, condition: "Good" },
  { vehicleMake: "Toyota", vehicleModel: "Verossa", yearFrom: 2001, yearTo: 2004, source: "beforward", fobPriceUsd: 4500, streetPriceUsd: 7500, averageMileage: 130000, condition: "Fair" },
  { vehicleMake: "Toyota", vehicleModel: "Land Cruiser 200", yearFrom: 2010, yearTo: 2016, source: "beforward", fobPriceUsd: 35000, streetPriceUsd: 50000, averageMileage: 90000, condition: "Good" },
  { vehicleMake: "Toyota", vehicleModel: "Harrier", yearFrom: 2010, yearTo: 2016, source: "beforward", fobPriceUsd: 12000, streetPriceUsd: 18000, averageMileage: 80000, condition: "Good" },
  { vehicleMake: "Toyota", vehicleModel: "RAV4", yearFrom: 2010, yearTo: 2016, source: "beforward", fobPriceUsd: 9000, streetPriceUsd: 14000, averageMileage: 85000, condition: "Good" },
  
  // Suzuki
  { vehicleMake: "Suzuki", vehicleModel: "Escudo", yearFrom: 2010, yearTo: 2016, source: "beforward", fobPriceUsd: 6500, streetPriceUsd: 10000, averageMileage: 90000, condition: "Good" },
  { vehicleMake: "Suzuki", vehicleModel: "Swift", yearFrom: 2010, yearTo: 2017, source: "beforward", fobPriceUsd: 3000, streetPriceUsd: 5000, averageMileage: 75000, condition: "Good" },
  { vehicleMake: "Suzuki", vehicleModel: "Jimny", yearFrom: 2010, yearTo: 2018, source: "beforward", fobPriceUsd: 7000, streetPriceUsd: 11000, averageMileage: 80000, condition: "Good" },
  { vehicleMake: "Suzuki", vehicleModel: "Every", yearFrom: 2010, yearTo: 2017, source: "beforward", fobPriceUsd: 4000, streetPriceUsd: 6500, averageMileage: 100000, condition: "Good" },
];

// ============================================================
// AUTOMOTIVE POIs - Expanded Network
// Hargeisa, Burco, Berbera, Borama
// ============================================================

export const automotivePoisData = [
  // === HARGEISA ===
  { businessName: "Sanyare Motors", category: "car_dealer" as const, city: "Hargeisa", address: "Wadada Madax-tooyada", phone: "+252 63 4428888", source: "verified", notes: "Major Toyota importer" },
  { businessName: "AMAAN MOTORS", category: "car_dealer" as const, city: "Hargeisa", address: "Opposite CID HQ, Main Road", phone: "+252 63 4416666", source: "verified", notes: "Japanese imports" },
  { businessName: "Autocom Japan Somaliland", category: "car_dealer" as const, city: "Hargeisa", address: "Near Togdheer Junction", phone: "+252 63 4000000", source: "verified", notes: "Direct Japan imports" },
  { businessName: "Safari Motors", category: "car_dealer" as const, city: "Hargeisa", address: "Jigjiga Yar", phone: "+252 63 4429999", source: "verified", notes: "Affordable vehicles" },
  { businessName: "Khaliij Auto Spare Parts", category: "spare_parts" as const, city: "Hargeisa", address: "Xero Awr", phone: "+252 63 4275608", source: "verified", notes: "Open 24 hours" },
  { businessName: "Al-Baraka Spare Parts", category: "spare_parts" as const, city: "Hargeisa", address: "New Market Area", phone: "+252 63 4441122", source: "verified", notes: "Toyota & Nissan specialist" },
  { businessName: "Mogadishu Spare Parts", category: "spare_parts" as const, city: "Hargeisa", address: "Xero Awr District", phone: "+252 63 4225577", source: "verified", notes: "All brands" },
  { businessName: "Dubai Auto Parts", category: "spare_parts" as const, city: "Hargeisa", address: "Near Stadium", phone: "+252 63 4337788", source: "verified", notes: "Direct UAE imports" },
  { businessName: "Crown Toyota Service", category: "garage" as const, city: "Hargeisa", address: "Airport Road", phone: "+252 63 4445566", source: "research", notes: "Toyota specialist garage" },
  { businessName: "Suzuki Care Center", category: "garage" as const, city: "Hargeisa", address: "Industrial Zone", phone: "+252 63 4447788", source: "research", notes: "Suzuki specialist" },
  { businessName: "Bridgestone Authorized Dealer", category: "tire_shop" as const, city: "Hargeisa", address: "Industrial Area", phone: "+252 63 4553366", source: "verified", notes: "Genuine Bridgestone" },
  { businessName: "Hargeisa Tire Center", category: "tire_shop" as const, city: "Hargeisa", address: "Jigjiga Yar", phone: "+252 63 4227799", source: "verified", notes: "New and used tires" },
  { businessName: "Somaliland Oil Company", category: "fuel_station" as const, city: "Hargeisa", address: "Airport Road", phone: "+252 63 4400000", source: "verified", notes: "Castrol & Shell distributor" },
  { businessName: "Total Energies Somalia", category: "fuel_station" as const, city: "Hargeisa", address: "Multiple Locations", phone: "+252 63 4551234", source: "verified", notes: "Full service" },
  { businessName: "Vision Battery Center", category: "batteries" as const, city: "Hargeisa", address: "Xero Awr", phone: "+252 63 4339911", source: "verified", notes: "Varta & Bosch" },
  { businessName: "Horn Auto Tools", category: "tools_equipment" as const, city: "Hargeisa", address: "Industrial Zone", phone: "+252 63 4228844", source: "verified", notes: "Professional equipment" },

  // === BURCO ===
  { businessName: "Burco Auto Center", category: "car_dealer" as const, city: "Burco", address: "Main Market", phone: "+252 63 5221100", source: "research", notes: "Used vehicles" },
  { businessName: "Togdheer Motors", category: "car_dealer" as const, city: "Burco", address: "Near Bus Station", phone: "+252 63 5223344", source: "research", notes: "Import dealer" },
  { businessName: "Burco Spare Parts Center", category: "spare_parts" as const, city: "Burco", address: "Central Market", phone: "+252 63 5225566", source: "research", notes: "All parts" },
  { businessName: "Al-Najah Auto Repair", category: "garage" as const, city: "Burco", address: "Industrial Area", phone: "+252 63 5227788", source: "research", notes: "General repairs" },
  { businessName: "Burco Tire Services", category: "tire_shop" as const, city: "Burco", address: "Highway Road", phone: "+252 63 5229900", source: "research", notes: "Truck tires available" },

  // === BERBERA (Port City) ===
  { businessName: "Port City Motors", category: "car_dealer" as const, city: "Berbera", address: "Port Road", phone: "+252 63 5331100", source: "research", notes: "First contact for imports" },
  { businessName: "Berbera Customs Auto", category: "car_dealer" as const, city: "Berbera", address: "Near Customs Office", phone: "+252 63 5332200", source: "research", notes: "Clearance services" },
  { businessName: "Sahil Spare Parts", category: "spare_parts" as const, city: "Berbera", address: "Town Center", phone: "+252 63 5333300", source: "research", notes: "Import parts direct" },
  { businessName: "Red Sea Garage", category: "garage" as const, city: "Berbera", address: "Industrial Zone", phone: "+252 63 5334400", source: "research", notes: "Marine vehicles too" },
  { businessName: "Berbera Fuel Station", category: "fuel_station" as const, city: "Berbera", address: "Port Road", phone: "+252 63 5335500", source: "research", notes: "24 hour service" },

  // === BORAMA ===
  { businessName: "Awdal Motors", category: "car_dealer" as const, city: "Borama", address: "Main Street", phone: "+252 63 5441100", source: "research", notes: "Regional dealer" },
  { businessName: "Borama Auto Parts", category: "spare_parts" as const, city: "Borama", address: "Market Area", phone: "+252 63 5442200", source: "research", notes: "Common parts" },
  { businessName: "Borama Garage", category: "garage" as const, city: "Borama", address: "Highway Junction", phone: "+252 63 5443300", source: "research", notes: "All repairs" },
];

// ============================================================
// MASS PARTNERS - B2B NETWORK
// ============================================================

export const massPartnersData = [
  { partnerName: "Somaliland Ministry of Transport", partnerType: "government" as const, city: "Hargeisa", contactPerson: "Director General", specializations: ["Vehicle Registration", "Import Policy"] },
  { partnerName: "Berbera Port Authority", partnerType: "government" as const, city: "Berbera", contactPerson: "Operations Manager", specializations: ["Vehicle Clearance", "Logistics"] },
  { partnerName: "Dahabshiil Fleet Services", partnerType: "fleet_operator" as const, city: "Hargeisa", fleetSize: 150, specializations: ["Money Transfer Vehicles", "Armored Transport"] },
  { partnerName: "Telesom Vehicle Division", partnerType: "fleet_operator" as const, city: "Hargeisa", fleetSize: 80, specializations: ["Mobile Network Fleet"] },
  { partnerName: "World Vision Somaliland", partnerType: "ngo" as const, city: "Hargeisa", fleetSize: 45, specializations: ["Humanitarian Logistics", "4x4 Fleet"] },
  { partnerName: "Al-Futtaim Toyota UAE", partnerType: "importer" as const, city: "Dubai", supplyRegion: "Dubai", specializations: ["Genuine Toyota Parts", "New Vehicle Import"] },
  { partnerName: "BE FORWARD Japan", partnerType: "importer" as const, city: "Yokohama", supplyRegion: "Japan", specializations: ["Used Vehicle Export", "Parts Catalog"] },
  { partnerName: "Jebel Ali Wholesale Market", partnerType: "distributor" as const, city: "Dubai", supplyRegion: "Dubai", specializations: ["Aftermarket Parts", "Tijari Parts"] },
];

console.log("📦 MASS Spare Parts Catalog: " + sparePartsCatalog.length + " parts");
console.log("💰 Market Price Data: " + marketPriceData.length + " models");
console.log("📍 Automotive POIs: " + automotivePoisData.length + " locations");
console.log("🤝 MASS Partners: " + massPartnersData.length + " partners");
console.log("\n✅ Data ready for Convex seeding!");
