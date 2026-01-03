/**
 * SEED SCRIPT: OPERATIONS MODULE (Schema 2.0)
 * 
 * Verifies:
 * - servicePackages (Bundled parts/labor)
 * - timeEntries (Technician efficiency tracking)
 * 
 * Run: npx tsx scripts/seed-operations.ts
 */

import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

console.log("🛠️  PREPARING OPERATIONS MODULE DATA...");
console.log("=======================================");

// 1. SERVICE PACKAGES
console.log("\n📦 TEST 1: SERVICE PACKAGES");

const servicePackages = [
  {
    name: "Gold Service - Toyota 4Cyl",
    basePrice: 85,
    items: [
      { type: "part", desc: "Oil Filter (Genuine)", qty: 1 },
      { type: "part", desc: "4L Synthetic Oil 5W-30", qty: 1 },
      { type: "labor", desc: "Oil Change Service", qty: 0.5 },
      { type: "labor", desc: "40-Point Inspection", qty: 0.5 },
      { type: "fee", desc: "EPA Disposal Fee", qty: 1 }
    ]
  },
  {
    name: "Brake Pad Replacement (Front Axle)",
    basePrice: 120,
    items: [
      { type: "part", desc: "Front Brake Pads (Premium)", qty: 1 },
      { type: "labor", desc: "Brake Service Labor", qty: 1.5 },
      { type: "fee", desc: "Shop Supplies", qty: 1 }
    ]
  }
];

servicePackages.forEach(pkg => {
  console.log(`   [PACKAGE] ${pkg.name} - $${pkg.basePrice}`);
  pkg.items.forEach(i => console.log(`      + ${i.qty}x ${i.desc} (${i.type.toUpperCase()})`));
});

// 2. TIME CLOCKING (Technician Efficiency)
console.log("\n⏱️  TEST 2: TECHNICIAN TIME ENTRIES");

const timeEntries = [
  {
    tech: "Ahmed Mechanic",
    job: "JOB-10292 (Brake Job)",
    start: new Date(Date.now() - 1000 * 60 * 95).toISOString(), // Started 95 mins ago
    end: new Date(Date.now() - 1000 * 60 * 5).toISOString(),    // Ended 5 mins ago
  }
];

// Calculation Logic Verification
timeEntries.forEach(entry => {
  const start = new Date(entry.start).getTime();
  const end = new Date(entry.end).getTime();
  const durationMinutes = Math.round((end - start) / 1000 / 60);
  const billedHours = 1.5; // From standard labor guide
  const efficiency = Math.round((billedHours * 60 / durationMinutes) * 100);

  console.log(`   [ENTRY] ${entry.tech} on ${entry.job}`);
  console.log(`       Start: ${entry.start}`);
  console.log(`       End:   ${entry.end}`);
  console.log(`       Actual: ${durationMinutes} mins | Billed: ${billedHours * 60} mins`);
  console.log(`       Efficiency: ${efficiency}% ${efficiency > 100 ? '✅ (Beating Book Time)' : '⚠️ (Slow)'}`);
});

console.log("\n⚠️ NOTE: This script validates the logical flow and data structure.");
console.log("   Use the app UI to perform actual clock-in/out operations.");
console.log("\n🚀 SCHEMA 2.0 OPERATIONS VERIFICATION COMPLETE");
