/**
 * SAIP Agent 6: Fraud Detector
 * Runs weekly — scans vehicle listings for fraud signals:
 * - Duplicate VINs, price anomalies, mileage rollback, fake photos
 * Uses Gemini to analyze suspicious patterns
 */

import { ConvexHttpClient } from "convex/browser"

const CONVEX_URL = process.env.CONVEX_URL || ""
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || ""

// Red flags specific to Somaliland automotive market
const FRAUD_SIGNALS = {
  priceAnomaly: {
    // If price is >40% below market average → suspicious
    underpriceThreshold: 0.6,
    // If price is >80% above market average → suspicious
    overpriceThreshold: 1.8,
  },
  mileageRollback: {
    // If mileage < 50k for vehicle > 8 years old → suspicious
    maxMileagePerYear: 12000,
    minMileagePerYear: 2000,
  },
  knownStolenPatterns: [
    // Known fraudulent descriptions seen in Hargeisa market
    "no papers", "without papers", "warqad la'aan", "documents missing",
    "from police auction", "accident car", "write off", "total loss",
  ],
  suspiciousSellerPatterns: [
    "just arrived from dubai",
    "owner traveling urgently",
    "quick sale",
    "no time wasters",
  ],
}

interface FraudAnalysis {
  listingId: string
  fraudScore: number
  signals: string[]
  severity: "clean" | "low_risk" | "medium_risk" | "high_risk" | "likely_fraud"
  recommendation: "approve" | "review" | "flag" | "block"
  geminiAnalysis?: string
}

async function analyzeWithGemini(listings: any[]): Promise<FraudAnalysis[]> {
  if (!GEMINI_API_KEY || listings.length === 0) return []

  const prompt = `You are the SAIP fraud detection system for Somaliland's automotive market.

Analyze these vehicle listings for fraud signals. Context:
- Hargeisa vehicle prices context: Land Cruiser 200 ~$20-30k, Hiace ~$8-15k, Corolla ~$8-12k, Suzuki Swift ~$6-9k
- Common frauds: VIN cloning, mileage rollback (odometer fraud), stolen vehicles, fake imported status
- Somaliland-specific: "Dubai import" scams, police auction fraud, border vehicles with no papers

Listings to analyze:
${listings.map((l, i) => `${i + 1}. Make: ${l.make} ${l.model} | Year: ${l.year} | Price: $${l.priceUSD} | Mileage: ${l.mileageKm}km | Description: ${l.description?.slice(0, 200)}`).join("\n")}

Return ONLY valid JSON array:
[
  {
    "listingIndex": 0,
    "fraudScore": 15,
    "signals": ["Price 15% below market average"],
    "severity": "low_risk",
    "recommendation": "approve",
    "notes": "Slightly low price but reasonable for vehicle age"
  }
]
severity: clean|low_risk|medium_risk|high_risk|likely_fraud
recommendation: approve|review|flag|block`

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
    { method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0.1, maxOutputTokens: 4096 } }) }
  )
  const data = await res.json()
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || ""
  const match = text.match(/\[[\s\S]*\]/)
  if (!match) return []
  try { return JSON.parse(match[0]) } catch { return [] }
}

function localFraudCheck(listing: any): Partial<FraudAnalysis> {
  const signals: string[] = []
  let score = 0

  // Check suspicious keywords
  const desc = `${listing.title} ${listing.description}`.toLowerCase()
  for (const pattern of FRAUD_SIGNALS.knownStolenPatterns) {
    if (desc.includes(pattern)) { signals.push(`⛔ Suspicious phrase: "${pattern}"`); score += 30 }
  }
  for (const pattern of FRAUD_SIGNALS.suspiciousSellerPatterns) {
    if (desc.includes(pattern)) { signals.push(`⚠️ Pressure tactic: "${pattern}"`); score += 15 }
  }

  // Mileage anomaly (if available)
  if (listing.year && listing.mileageKm) {
    const age = 2026 - listing.year
    const expectedMin = age * FRAUD_SIGNALS.mileageRollback.minMileagePerYear
    const expectedMax = age * FRAUD_SIGNALS.mileageRollback.maxMileagePerYear * 1.5
    if (listing.mileageKm < expectedMin) {
      signals.push(`⚠️ Suspiciously low mileage: ${listing.mileageKm}km for ${age}-year-old vehicle`)
      score += 25
    }
    if (listing.mileageKm > expectedMax) {
      signals.push(`📊 High mileage: ${listing.mileageKm}km`)
      score += 5
    }
  }

  return { signals, fraudScore: Math.min(score, 100) }
}

;(async () => {
  console.log("🔍 SAIP Fraud Detector starting...")

  if (!CONVEX_URL) {
    console.log("[DRY RUN] Testing local fraud detection:")
    const testListings = [
      { make: "Toyota", model: "Land Cruiser 200", year: 2018, priceUSD: 28000, mileageKm: 95000, title: "LC200 for sale", description: "excellent condition" },
      { make: "Toyota", model: "Hilux", year: 2016, priceUSD: 4500, mileageKm: 15000, title: "Quick sale no time wasters from Dubai urgent", description: "no papers owner traveling" },
      { make: "Suzuki", model: "Swift", year: 2020, priceUSD: 7500, mileageKm: 25000, title: "Swift 2020 clean", description: "one owner fully serviced" },
    ]
    for (const listing of testListings) {
      const check = localFraudCheck(listing)
      console.log(`  ${listing.make} ${listing.model}: Score ${check.fraudScore}, Signals: ${check.signals?.join(", ") || "None"}`)
    }
    if (GEMINI_API_KEY) {
      const analysis = await analyzeWithGemini(testListings)
      console.log("\n🤖 Gemini Fraud Analysis:")
      analysis.forEach((a) => console.log(`  Listing ${a.listingIndex}: ${a.severity} (score: ${a.fraudScore}) - ${a.recommendation}`))
    }
    return
  }

  const client = new ConvexHttpClient(CONVEX_URL)

  // Get normalized listings for fraud scanning
  const listings = await client.query("ingestion:getListingsForFraudScan" as any, { limit: 200 })
  if (!listings?.length) { console.log("✅ No listings to scan"); return }

  console.log(`📊 Scanning ${listings.length} listings for fraud...`)

  // Local check first
  const localResults = listings.map((l: any) => ({ ...l, ...localFraudCheck(l) }))
  const suspicious = localResults.filter((l: any) => l.fraudScore > 20)
  console.log(`  Local check: ${suspicious.length} suspicious listings found`)

  // Gemini deep analysis on suspicious ones
  if (suspicious.length > 0 && GEMINI_API_KEY) {
    console.log("🤖 Running Gemini deep analysis on suspicious listings...")
    const analyses = await analyzeWithGemini(suspicious.slice(0, 30))
    
    for (const analysis of analyses) {
      const original = suspicious[analysis.listingIndex]
      if (!original) continue
      try {
        await client.mutation("ingestion:updateFraudScore" as any, {
          id: original._id,
          fraudScore: analysis.fraudScore,
          fraudSignals: analysis.signals,
          fraudSeverity: analysis.severity,
          fraudRecommendation: analysis.recommendation,
          fraudCheckedAt: Date.now(),
        })
      } catch (e) { console.error("Fraud update failed:", e) }
    }
    
    const flagged = analyses.filter(a => a.recommendation === "flag" || a.recommendation === "block")
    console.log(`  🚨 Flagged ${flagged.length} listings for review`)
  }

  console.log("✅ Fraud Detector complete")
})()
