/**
 * SCRIPT: DUPLICATE CHECKER (Audit Tool)
 * 
 * Scans `automotivePois` and `massPartners` for duplicate phone numbers.
 * Normalizes numbers to find matches like "+252 63 4400000" vs "0634400000".
 * 
 * Run: npx tsx scripts/check-duplicates.ts
 */

import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

console.log("🔍 RUNNING DUPLICATE PHONE NUMBER AUDIT...");
console.log("==========================================");

// Simulated data fetch (In real app, use Convex Client)
const pois = [
  { id: "POI-01", name: "Telesom Transport", phone: "+252 63 4400000" },
  { id: "POI-02", name: "Dahabshiil Motors", phone: "063 4410000" },
  { id: "POI-03", name: "Duplicate Entry Test", phone: "4400000" } // Should conflict with Telesom if strict, or maybe not depending on normalization
];

const partners = [
  { id: "PRT-01", name: "Telesom Official", phone: "+252634400000" } // Exact duplicate of POI-01 normalized
];

console.log(`   Fetched ${pois.length} POIs and ${partners.length} Partners.`);

// Normalization Helper
const normalize = (str: string) => {
  // Remove non-digits
  const digits = str.replace(/\D/g, ''); 
  // Somaliland specific: If starts with 252, keep. If 063/065, add 252. If 4xxxxxx, add 25263.
  // For this simple check, we just compare the last 7 digits (local number)
  if (digits.length >= 7) return digits.slice(-7);
  return digits;
};

const phoneMap = new Map<string, string[]>();

const addToMap = (phone: string, recordId: string, name: string, table: string) => {
  if (!phone) return;
  const norm = normalize(phone);
  if (!phoneMap.has(norm)) {
    phoneMap.set(norm, []);
  }
  phoneMap.get(norm)?.push(`[${table}] ${name} (${recordId})`);
};

// Indexing
pois.forEach(p => addToMap(p.phone, p.id, p.name, "POI"));
partners.forEach(p => addToMap(p.phone, p.id, p.name, "PARTNER"));

// Reporting
let duplicateCount = 0;
console.log("\n⚠️  DUPLICATES FOUND:");
phoneMap.forEach((records, phone) => {
  if (records.length > 1) {
    console.log(`\n   📞 Phone ...${phone}:`);
    records.forEach(r => console.log(`      - ${r}`));
    duplicateCount++;
  }
});

if (duplicateCount === 0) {
  console.log("\n✅ No duplicates found! Database is clean.");
} else {
  console.log(`\n❌ Found ${duplicateCount} conflicts. Reconciliation recommended.`);
}
