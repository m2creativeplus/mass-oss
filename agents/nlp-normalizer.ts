/**
 * SAIP Agent 4: NLP Normalizer
 * Runs after Facebook agent to normalize Somali/English vehicle listings
 * Uses Gemini Flash for language detection + normalization
 * Also normalizes business names from Google agents
 */

import { ConvexHttpClient } from "convex/browser"

const CONVEX_URL = process.env.CONVEX_URL || ""
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || ""

const SOMALI_MAKE_MAP: Record<string, string> = {
  // Somali common terms
  "tooyo": "Toyota",
  "toyoda": "Toyota",
  "toyoda lc": "Toyota Land Cruiser",
  "lc 200": "Land Cruiser 200",
  "lc 100": "Land Cruiser 100",
  "lc 70": "Land Cruiser 70",
  "lc 80": "Land Cruiser 80",
  "baabuur toyota": "Toyota",
  "hiyas": "Toyota Hiace",
  "hayas": "Toyota Hiace",
  "prado": "Toyota Land Cruiser Prado",
  "fokar": "Toyota Hiace",
  "nooh": "Toyota Noah",
  "voksi": "Toyota Voxy",
  "hilaks": "Toyota Hilux",
  "susuuki": "Suzuki",
  "miksubishi": "Mitsubishi",
  "biim": "BMW",
  "marsadiis": "Mercedes-Benz",
  "mersadiis": "Mercedes-Benz",
}

async function normalizeBatchWithGemini(texts: string[]): Promise<any[]> {
  if (!GEMINI_API_KEY) return []

  const prompt = `You are a Somali/English automotive text normalizer for Somaliland's SAIP platform.

Convert these raw vehicle listing texts (Somali, English, or mixed) to normalized English.
Identify: make, model, year, price in USD, mileage, condition, location.

Known Somali automotive terms:
- "baabuur" = car
- "gaariga" = the car
- "iib" = for sale
- "aad u fiican" = excellent condition
- "baabuurta" = vehicles
- "qiimaha" = price
- "SL" or "shilling" = Somaliland Shilling (1 USD ≈ 8,500-9,000 SL)
- "lacag" = money/price
- Hargeisa districts: Jugta, Duruqsi, 26-June, Koodbuur, Jigjiga Yar

Texts to normalize:
${texts.map((t, i) => `${i + 1}. ${t}`).join("\n")}

Return ONLY valid JSON array:
[
  {
    "originalIndex": 0,
    "normalizedTitle": "2018 Toyota Land Cruiser 200 - For Sale",
    "make": "Toyota",
    "model": "Land Cruiser 200",
    "year": 2018,
    "priceUSD": 28000,
    "priceRaw": "original price text",
    "mileageKm": 95000,
    "location": "Hargeisa",
    "district": "Jugta",
    "condition": "good",
    "language": "somali|english|mixed",
    "confidence": 0.9
  }
]`

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.1, maxOutputTokens: 8192 },
      }),
    }
  )

  const data = await res.json()
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || ""
  const match = text.match(/\[[\s\S]*\]/)
  if (!match) return []
  try { return JSON.parse(match[0]) } catch { return [] }
}

function applyLocalNormalization(text: string): string {
  let normalized = text
  for (const [somali, english] of Object.entries(SOMALI_MAKE_MAP)) {
    const regex = new RegExp(somali, "gi")
    normalized = normalized.replace(regex, english)
  }
  return normalized
}

// ── Main ──────────────────────────────────────────────────────────────────────
;(async () => {
  console.log("🔤 SAIP NLP Normalizer starting...")

  if (!CONVEX_URL) {
    console.log("[DRY RUN] No CONVEX_URL — running normalization test")
    const testTexts = [
      "Baabuurka tooyo hiyas 2019 oo aad u fiican, qiimaha 12,000 USD, Hargeisa",
      "Gaariga Land Cruiser lc 200 2018 iib, mileage 80km, lacag $25,000",
      "Toyota Corolla 2020 for sale excellent condition, 45,000 km, Borama",
      "Prado 2016 iib, aad u fiican, Koodbuur, 0906123456",
    ]

    const localNorm = testTexts.map(applyLocalNormalization)
    console.log("\n📝 Local normalization test:")
    localNorm.forEach((t, i) => console.log(`  ${i + 1}. ${t}`))

    if (GEMINI_API_KEY) {
      console.log("\n🤖 Gemini normalization test:")
      const normalized = await normalizeBatchWithGemini(testTexts)
      normalized.forEach((n) => {
        console.log(`  ${n.year} ${n.make} ${n.model} — $${n.priceUSD} (${n.confidence} confidence)`)
      })
    }

    return
  }

  // In production: fetch unnormalized listings from Convex, normalize, push back
  const client = new ConvexHttpClient(CONVEX_URL)

  // Get raw listings that need normalization
  const rawListings = await client.query("ingestion:getUnnormalizedListings" as any, { limit: 100 })

  if (!rawListings || rawListings.length === 0) {
    console.log("✅ No listings need normalization")
    return
  }

  console.log(`📊 Normalizing ${rawListings.length} listings...`)

  const texts = rawListings.map((l: any) => `${l.title} ${l.description || ""}`.trim())
  const localNorm = texts.map(applyLocalNormalization)

  // Batch normalize with Gemini in chunks of 20
  const BATCH = 20
  let normalized: any[] = []
  for (let i = 0; i < localNorm.length; i += BATCH) {
    const batch = localNorm.slice(i, i + BATCH)
    const result = await normalizeBatchWithGemini(batch)
    normalized.push(...result)
    console.log(`  Batch ${Math.floor(i / BATCH) + 1}: normalized ${result.length} listings`)
  }

  // Push normalized data back
  let updated = 0
  for (const norm of normalized) {
    const original = rawListings[norm.originalIndex]
    if (!original) continue
    try {
      await client.mutation("ingestion:updateNormalizedListing" as any, {
        id: original._id,
        normalizedTitle: norm.normalizedTitle,
        make: norm.make,
        model: norm.model,
        year: norm.year,
        priceUSD: norm.priceUSD,
        mileageKm: norm.mileageKm,
        location: norm.location,
        condition: norm.condition,
        isNormalized: true,
        nlpConfidence: norm.confidence,
      })
      updated++
    } catch (e) {
      console.error(`Update failed:`, e)
    }
  }

  console.log(`✅ Updated ${updated}/${normalized.length} listings with normalized data`)
  console.log("✅ NLP Normalizer complete")
})()
