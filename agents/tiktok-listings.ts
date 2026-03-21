/**
 * SAIP Agent 7: TikTok Broker Listings Scraper
 * Scrapes vehicle listings from Somaliland car brokers (Dilaal) and showrooms (Macdarka) on TikTok.
 * Extracts descriptions, parses prices/phone numbers via Gemini, and pushes to Convex.
 * Runs weekly via GitHub Actions.
 */

import { chromium, type Browser, type Page } from "playwright"
import { ConvexHttpClient } from "convex/browser"

const CONVEX_URL = process.env.CONVEX_URL || ""
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || ""

// Deep Dive Somali Keywords for TikTok
const TIKTOK_SEARCHES = [
  "gaadhi iiba hargeisa",
  "macdarka baabuurta hargeisa",
  "dilaal baabuurta somaliland",
  "toyota noah cusub hargeisa",
  "baabuur iiba hargeisa",
  "motor sales hargeisa",
  "toyota voxy iiba hargeisa",
  "qaybaha baabuurta hargeisa", // Spare parts
  
  // Expanded Service Locations
  "garage hargeisa",
  "mechanic hargeisa",
  "car accessories hargeisa",
  "carwash hargeisa"
]

interface TikTokListing {
  title: string
  description: string
  sourceUrl: string
  postedAt?: string
  rawText: string
}

async function scrapeTikTokSearch(page: Page, query: string): Promise<TikTokListing[]> {
  const listings: TikTokListing[] = []

  try {
    const searchUrl = `https://www.tiktok.com/search/video?q=${encodeURIComponent(query)}`
    console.log(`  📱 TikTok Search: "${query}"`)
    
    // Go to search page and reject cookies if prompt appears
    await page.goto(searchUrl, { waitUntil: "domcontentloaded", timeout: 20000 })
    await page.waitForTimeout(4000)

    // Scroll to load videos
    for (let i = 0; i < 5; i++) {
      await page.evaluate(() => window.scrollBy(0, 1000))
      await page.waitForTimeout(1500)
    }

    // Extract TikTok video cards
    // The exact selectors for TikTok change often; these focus on links containing '/video/'
    const videoLinks = await page.$$('a[href*="/video/"]')
    console.log(`  Found ${videoLinks.length} videos for "${query}"`)

    for (const link of videoLinks.slice(0, 20)) { // Limit to top 20 videos per query for speed
      try {
        const href = await link.getAttribute("href") || ""
        const titleEl = await link.getProperty("title")
        const titleText = (await titleEl?.jsonValue()) as string || ""
        const textContent = (await link.textContent())?.trim() || ""

        // TikTok doesn't always expose description in search view without clicking,
        // so we capture the immediately visible text (often hashtags/captions)
        const combinedText = `${titleText} ${textContent}`.trim()
        
        if (href && combinedText.length > 5) {
          listings.push({
            title: combinedText.slice(0, 100).replace(/\n/g, " "),
            description: combinedText,
            sourceUrl: href.startsWith("http") ? href : `https://www.tiktok.com${href}`,
            rawText: combinedText,
          })
        }
      } catch {}
    }
  } catch (e) {
    console.error(`TikTok scrape error for "${query}":`, e)
  }

  // Deduplicate by URL
  return Array.from(new Map(listings.map(l => [l.sourceUrl, l])).values())
}

async function normalizeWithGemini(listings: TikTokListing[]): Promise<any[]> {
  if (!GEMINI_API_KEY || listings.length === 0) return []

  const CHUNK_SIZE = 20;
  const allNormalized: any[] = [];
  
  for (let i = 0; i < listings.length; i += CHUNK_SIZE) {
    const chunk = listings.slice(i, i + CHUNK_SIZE);
    console.log(`  🤖 Gemini processing TikTok batch ${i / CHUNK_SIZE + 1} (${chunk.length} items)...`);
    
    const prompt = `You are the SAIP vehicle listings normalizer for Somaliland's automotive database.

Extract structured vehicle data from these TikTok video descriptions/captions.
Brokers (Dilaal) use TikTok to post inventory. Support Somali + English mixed text.
Only include actual vehicle sale listings. Extract phone numbers if present.

Raw listings:
${chunk.map((l, idx) => `--- Video ${idx + 1} ---\nTitle: ${l.title}\nURL: ${l.sourceUrl}`).join("\n\n")}

Return ONLY valid JSON array (no markdown):
[
  {
    "title": "normalized title in English",
    "make": "Toyota",
    "model": "Noah",
    "year": 2018,
    "priceUSD": 12000,
    "mileageKm": 0,
    "location": "Hargeisa",
    "sellerType": "dealer",
    "phone": "extracted phone number if any",
    "sourceUrl": "url",
    "description": "normalized English description",
    "fraudRisk": "low|medium|high",
    "fraudNotes": "any suspicious patterns"
  }
]`

    try {
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
      
      if (data.error) {
        console.error("Gemini API Error:", data.error.message);
        if (data.error.code === 429) {
          console.log("  ⏳ Rate limited. Waiting 30s...");
          await new Promise(r => setTimeout(r, 30000));
        }
        continue;
      }

      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || ""
      const match = text.match(/\[[\s\S]*\]/)
      if (match) {
        const parsed = JSON.parse(match[0]);
        allNormalized.push(...parsed);
      }
    } catch (e) {
      console.error(`  Batch failed to process`, e);
    }
    
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
  
  return allNormalized;
}

async function pushToConvex(vehicles: any[]) {
  if (!CONVEX_URL || vehicles.length === 0) {
    console.log(`[DRY RUN] Would push ${vehicles.length} TikTok listings to Convex`)
    vehicles.slice(0, 3).forEach((v) => console.log(`  - ${v.make} ${v.model} ($${v.priceUSD})`))
    return
  }

  const client = new ConvexHttpClient(CONVEX_URL)
  let pushed = 0

  for (const v of vehicles) {
    if (!v.make || !v.model) continue // Skip junk data
    try {
      await client.mutation("ingestion:upsertListing" as any, {
        title: v.title,
        make: v.make,
        model: v.model,
        year: v.year || null,
        priceUSD: v.priceUSD || null,
        mileageKm: v.mileageKm || null,
        condition: v.condition || "unknown",
        transmission: v.transmission || "unknown",
        fuelType: v.fuelType || "unknown",
        color: v.color || "unknown",
        location: v.location || "Hargeisa",
        sellerType: v.sellerType || "unknown",
        source: "tiktok",
        sourceUrl: v.sourceUrl,
        rawDescription: v.description,
        scrapedAt: Date.now(),
        // Default fraud fields so agent 6 can scan them later
        fraudScore: 0,
        fraudSeverity: "clean",
      })
      pushed++
    } catch (e) {
      console.error(`Failed to push TikTok listing ${v.model}:`, e)
    }
  }

  console.log(`✅ Pushed ${pushed}/${vehicles.length} valid TikTok listings to Convex`)
}

// ── Main Execution ────────────────────────────────────────────────────────────
;(async () => {
  console.log("🎵 SAIP TikTok Broker Listings Agent starting...")

  let browser: Browser | null = null
  try {
    browser = await chromium.launch({ headless: true, args: ["--no-sandbox"] })
    const context = await browser.newContext({
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      locale: "so-SO,en-US",
      viewport: { width: 1280, height: 720 },
    })
    const page = await context.newPage()

    const allListings: TikTokListing[] = []

    for (const query of TIKTOK_SEARCHES) {
      const results = await scrapeTikTokSearch(page, query)
      allListings.push(...results)
      await page.waitForTimeout(2000 + Math.random() * 2000) // Avoid ban
    }

    // Deduplicate across all queries
    const uniqueListings = Array.from(new Map(allListings.map(l => [l.sourceUrl, l])).values())

    console.log(`\n📊 Collected ${uniqueListings.length} unique TikTok videos`)
    console.log("🤖 Normalizing with Gemini Flash...")
    
    if (uniqueListings.length === 0) {
      console.log("No data found to normalize.");
      return;
    }

    const normalized = await normalizeWithGemini(uniqueListings)
    console.log(`✨ Extracted ${normalized.length} valid vehicle listings from TikTok`)

    await pushToConvex(normalized)

    // Summary report
    const byMake = normalized.reduce((acc: any, v: any) => {
      if (v.make) {
        acc[v.make] = (acc[v.make] || 0) + 1
      }
      return acc
    }, {})
    
    console.log("\n📈 TikTok Inventory by Make:")
    Object.entries(byMake).forEach(([make, count]) => console.log(`  ${make}: ${count}`))

  } catch (error) {
    console.error("TikTok Agent Fatal Error:", error)
  } finally {
    if (browser) await browser.close()
    console.log("✅ TikTok Broker Agent complete")
  }
})()
