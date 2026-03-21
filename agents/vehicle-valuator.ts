/**
 * SAIP Agent 5: Vehicle Valuator
 * Gemini-powered — values 20+ vehicle models for Hargeisa market
 * Runs weekly. Pushes to marketPriceIntelligence Convex table.
 */

import { ConvexHttpClient } from "convex/browser"

const CONVEX_URL = process.env.CONVEX_URL || ""
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || ""

const VEHICLES = [
  { make: "Toyota", model: "Land Cruiser 70 Series", yearRange: "2005-2015" },
  { make: "Toyota", model: "Land Cruiser 100 Series", yearRange: "1998-2007" },
  { make: "Toyota", model: "Land Cruiser 200 Series", yearRange: "2008-2021" },
  { make: "Toyota", model: "Land Cruiser Prado 150", yearRange: "2009-2018" },
  { make: "Toyota", model: "Hiace Commuter", yearRange: "2010-2019" },
  { make: "Toyota", model: "Hilux Double Cab", yearRange: "2012-2020" },
  { make: "Toyota", model: "Corolla E210", yearRange: "2019-2022" },
  { make: "Toyota", model: "Voxy", yearRange: "2014-2019" },
  { make: "Mitsubishi", model: "Pajero V73", yearRange: "2000-2006" },
  { make: "Suzuki", model: "Swift", yearRange: "2016-2021" },
  { make: "Nissan", model: "Patrol Y61", yearRange: "1997-2013" },
  { make: "Isuzu", model: "D-Max", yearRange: "2012-2019" },
]

async function valuateBatch(vehicles: typeof VEHICLES) {
  if (!GEMINI_API_KEY) return []
  const prompt = `SAIP vehicle valuator for Hargeisa, Somaliland. Q1 2026.
Import chain: Japan/UAE → Berbera Port ($250 handling, ~15% duty) → Hargeisa dealers.
Shipping Japan→Berbera: $800-2500.

Valuate for Hargeisa street market:
${vehicles.map((v, i) => `${i + 1}. ${v.make} ${v.model} (${v.yearRange})`).join("\n")}

Return ONLY valid JSON array:
[{"make":"Toyota","model":"Land Cruiser 70 Series","yearRange":"2005-2015","beForwardAvgUSD":9500,"shippingUSD":1800,"dutyUSD":1500,"hargeisaStreetAvgUSD":16000,"hargeisaStreetMinUSD":12000,"hargeisaStreetMaxUSD":22000,"demandLevel":"Very High","demandScore":95,"trend":"rising","notes":"Most popular utility in Somaliland"}]`

  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
    { method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0.15, maxOutputTokens: 4096 } }) })
  const data = await res.json()
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || ""
  const match = text.match(/\[[\s\S]*\]/)
  if (!match) return []
  try { return JSON.parse(match[0]) } catch { return [] }
}

;(async () => {
  console.log("💰 SAIP Vehicle Valuator starting...")
  const results = await valuateBatch(VEHICLES)
  console.log(`✅ Valuated ${results.length} vehicles`)

  if (!CONVEX_URL) {
    results.forEach((v: any) => console.log(`  ${v.make} ${v.model}: $${v.hargeisaStreetAvgUSD?.toLocaleString()} avg`))
    return
  }

  const client = new ConvexHttpClient(CONVEX_URL)
  for (const v of results) {
    try {
      await client.mutation("ingestion:upsertMarketValuation" as any, { ...v, valuedAt: Date.now(), source: "gemini-valuator-v2" })
    } catch (e) { console.error(`Push failed: ${v.model}`, e) }
  }
  console.log("✅ Vehicle Valuator complete")
})()
