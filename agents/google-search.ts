/**
 * SAIP Agent 1: Google Search Discovery
 * Finds automotive businesses in Somaliland via Google Search
 * Runs daily at 02:00 EAT via GitHub Actions
 * Pushes to Convex automotivePois table
 */

import { chromium, type Browser, type Page } from "playwright"
import { ConvexHttpClient } from "convex/browser"

const CONVEX_URL = process.env.CONVEX_URL || ""
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || ""
const MAX_KEYWORDS = parseInt(process.env.MAX_KEYWORDS || "25")

const SEARCH_KEYWORDS = [
  // Hargeisa Automotive
  "car workshop Hargeisa Somaliland",
  "spare parts Hargeisa",
  "auto repair Hargeisa",
  "Toyota service center Hargeisa",
  "used cars for sale Hargeisa",
  "car dealer Hargeisa Somaliland",
  "mechanics Hargeisa",
  "tyre shop Hargeisa",
  "battery shop Hargeisa",
  "engine repair Hargeisa",
  // Berbera / Port
  "car import Berbera port",
  "vehicle clearance Berbera Somaliland",
  "BE FORWARD Somaliland",
  "SBT Japan Somaliland",
  // Borama / Burao / Las Anod
  "car workshop Borama",
  "auto parts Burao",
  "vehicle repair Las Anod",
  // Parts markets
  "Toyota Hiace parts Hargeisa",
  "Land Cruiser parts Somaliland",
  "Japanese spare parts Hargeisa",
  // Facebook groups (for seeding facebook agent)
  "site:facebook.com Hargeisa cars",
  "site:facebook.com Somaliland vehicles",
  // Marketplace
  "lomax.so cars",
  "jumia Somaliland vehicles",
]

interface SearchResult {
  title: string
  url: string
  snippet: string
  keyword: string
}

async function searchGoogle(page: Page, keyword: string): Promise<SearchResult[]> {
  const results: SearchResult[] = []
  try {
    await page.goto(`https://www.google.com/search?q=${encodeURIComponent(keyword)}&num=10`, {
      waitUntil: "domcontentloaded",
      timeout: 15000,
    })
    await page.waitForTimeout(2000)

    const items = await page.$$eval("div.g", (els) =>
      els.slice(0, 10).map((el) => ({
        title: el.querySelector("h3")?.textContent?.trim() || "",
        url: el.querySelector("a")?.href || "",
        snippet: el.querySelector(".VwiC3b, .IsZvec")?.textContent?.trim() || "",
      }))
    )

    for (const item of items) {
      if (item.title && item.url) {
        results.push({ ...item, keyword })
      }
    }
  } catch (e) {
    console.error(`Search failed for "${keyword}":`, e)
  }
  return results
}

async function normalizeWithGemini(results: SearchResult[]): Promise<any[]> {
  if (!GEMINI_API_KEY || results.length === 0) return []

  const prompt = `You are the SAIP data normalizer for Somaliland's automotive intelligence platform.

Extract automotive businesses from these Google Search results and return structured data.
Only include REAL businesses. Skip news articles, social media posts, and irrelevant results.

Search Results:
${results.map((r) => `Title: ${r.title}\nURL: ${r.url}\nSnippet: ${r.snippet}\n---`).join("\n")}

Return ONLY a valid JSON array (no markdown fences):
[
  {
    "name": "Business Name",
    "category": "workshop|spare_parts|dealer|tyre_shop|fuel_station|other",
    "city": "Hargeisa|Berbera|Borama|Burao|Las_Anod|Other",
    "country": "Republic of Somaliland",
    "sourceUrl": "url",
    "description": "brief description",
    "confidence": 0.85,
    "sourceQuery": "search keyword used"
  }
]

Return empty array [] if no valid automotive businesses found.`

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.1, maxOutputTokens: 4096 },
      }),
    }
  )

  const data = await res.json()
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || ""
  const match = text.match(/\[[\s\S]*\]/)
  if (!match) return []
  try {
    return JSON.parse(match[0])
  } catch {
    return []
  }
}

async function pushToConvex(businesses: any[]) {
  if (!CONVEX_URL || businesses.length === 0) {
    console.log(`[DRY RUN] Would push ${businesses.length} businesses to Convex`)
    businesses.slice(0, 3).forEach((b) => console.log(`  - ${b.name} (${b.city}) [${b.category}]`))
    return
  }

  const client = new ConvexHttpClient(CONVEX_URL)
  let pushed = 0

  for (const biz of businesses) {
    try {
      await client.mutation("ingestion:upsertAutomotivePoi" as any, {
        name: biz.name,
        category: biz.category,
        city: biz.city,
        country: biz.country || "Republic of Somaliland",
        sourceUrl: biz.sourceUrl,
        description: biz.description,
        confidence: biz.confidence,
        source: "google-search",
        scrapedAt: Date.now(),
      })
      pushed++
    } catch (e) {
      console.error(`Failed to push ${biz.name}:`, e)
    }
  }

  console.log(`✅ Pushed ${pushed}/${businesses.length} businesses to Convex`)
}

// ── Main ──────────────────────────────────────────────────────────────────────
;(async () => {
  console.log("🔍 SAIP Google Search Agent starting...")
  const keywords = SEARCH_KEYWORDS.slice(0, MAX_KEYWORDS)

  let browser: Browser | null = null
  try {
    browser = await chromium.launch({ headless: true, args: ["--no-sandbox"] })
    const context = await browser.newContext({
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      locale: "en-US",
    })
    const page = await context.newPage()

    const allResults: SearchResult[] = []

    for (let i = 0; i < keywords.length; i++) {
      const kw = keywords[i]
      console.log(`[${i + 1}/${keywords.length}] Searching: "${kw}"`)
      const results = await searchGoogle(page, kw)
      allResults.push(...results)
      await page.waitForTimeout(1500 + Math.random() * 1000) // Human-like delay
    }

    console.log(`\n📊 Collected ${allResults.length} raw search results`)
    console.log("🤖 Normalizing with Gemini Flash...")

    // Process in batches of 20 results
    const BATCH_SIZE = 20
    const normalizedBizs: any[] = []
    for (let i = 0; i < allResults.length; i += BATCH_SIZE) {
      const batch = allResults.slice(i, i + BATCH_SIZE)
      const normalized = await normalizeWithGemini(batch)
      normalizedBizs.push(...normalized)
    }

    console.log(`✨ Extracted ${normalizedBizs.length} automotive businesses`)
    await pushToConvex(normalizedBizs)

    // Summary report
    const byCat = normalizedBizs.reduce((acc: any, b: any) => {
      acc[b.category] = (acc[b.category] || 0) + 1
      return acc
    }, {})
    console.log("\n📈 Results by category:")
    Object.entries(byCat).forEach(([cat, count]) => console.log(`  ${cat}: ${count}`))

  } finally {
    await browser?.close()
    console.log("✅ Google Search Agent complete")
  }
})()
