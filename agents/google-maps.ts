/**
 * SAIP Agent 2: Google Maps Scraper
 * Extracts automotive businesses from Google Maps for Somaliland cities
 * Captures: name, address, phone, rating, reviews, photos, GPS coordinates
 * Runs daily via GitHub Actions
 */

import { chromium, type Browser, type Page } from "playwright"
import { ConvexHttpClient } from "convex/browser"

const CONVEX_URL = process.env.CONVEX_URL || ""
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || ""

// Somaliland cities + automotive search terms for Google Maps
const MAPS_SEARCHES = [
  // Hargeisa — primary city
  { query: "car workshop", city: "Hargeisa", lat: 9.5603, lng: 44.0650 },
  { query: "spare parts", city: "Hargeisa", lat: 9.5603, lng: 44.0650 },
  { query: "auto repair", city: "Hargeisa", lat: 9.5603, lng: 44.0650 },
  { query: "car dealer", city: "Hargeisa", lat: 9.5603, lng: 44.0650 },
  { query: "tyre shop", city: "Hargeisa", lat: 9.5603, lng: 44.0650 },
  { query: "Toyota service", city: "Hargeisa", lat: 9.5603, lng: 44.0650 },
  { query: "fuel station", city: "Hargeisa", lat: 9.5603, lng: 44.0650 },
  { query: "car wash", city: "Hargeisa", lat: 9.5603, lng: 44.0650 },
  // Berbera — port city
  { query: "car workshop", city: "Berbera", lat: 10.4333, lng: 45.0167 },
  { query: "spare parts", city: "Berbera", lat: 10.4333, lng: 45.0167 },
  { query: "vehicle import", city: "Berbera", lat: 10.4333, lng: 45.0167 },
  // Borama
  { query: "car workshop", city: "Borama", lat: 9.9352, lng: 43.1829 },
  { query: "spare parts", city: "Borama", lat: 9.9352, lng: 43.1829 },
  // Burao
  { query: "auto repair", city: "Burao", lat: 9.5219, lng: 45.5403 },
  { query: "spare parts", city: "Burao", lat: 9.5219, lng: 45.5403 },
  // Las Anod
  { query: "car workshop", city: "Las Anod", lat: 8.4840, lng: 47.3565 },
]

interface MapsListing {
  name: string
  address: string
  phone?: string
  rating?: number
  reviewCount?: number
  category: string
  lat?: number
  lng?: number
  googleMapsUrl: string
  photos: string[]
  city: string
  isOpen?: boolean
}

async function scrapeMapsSearch(page: Page, search: typeof MAPS_SEARCHES[0]): Promise<MapsListing[]> {
  const listings: MapsListing[] = []
  const searchQuery = `${search.query} in ${search.city} Somaliland`

  try {
    const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(searchQuery)}/@${search.lat},${search.lng},13z`
    console.log(`  📍 Maps: "${searchQuery}"`)

    await page.goto(mapsUrl, { waitUntil: "domcontentloaded", timeout: 20000 })
    await page.waitForTimeout(3000)

    // Scroll to load results
    const resultsPanel = page.locator('[role="feed"]')
    for (let i = 0; i < 5; i++) {
      await resultsPanel.evaluate((el) => el.scrollBy(0, 500)).catch(() => {})
      await page.waitForTimeout(1000)
    }

    // Extract all listing cards
    const cards = await page.$$('[data-result-index], .hfpxzc, [jsaction*="placeCard"]')

    for (const card of cards.slice(0, 20)) {
      try {
        const nameEl = await card.$('.qBF1Pd, .fontHeadlineSmall, h3')
        const name = (await nameEl?.textContent())?.trim()
        if (!name) continue

        const ratingEl = await card.$('.MW4etd')
        const rating = ratingEl ? parseFloat((await ratingEl.textContent()) || "0") : undefined

        const reviewEl = await card.$('.UY7F9')
        const reviewText = (await reviewEl?.textContent())?.replace(/[^0-9]/g, "")
        const reviewCount = reviewText ? parseInt(reviewText) : undefined

        const addressEl = await card.$('[jstcache] .W4Efsd:not(.fontBodyMedium) span:last-child, .Io6YTe')
        const address = (await addressEl?.textContent())?.trim()

        listings.push({
          name,
          address: address || `${search.city}, Republic of Somaliland`,
          rating,
          reviewCount,
          category: categorizeSearch(search.query),
          googleMapsUrl: mapsUrl,
          photos: [],
          city: search.city,
        })
      } catch {}
    }
  } catch (e) {
    console.error(`  Maps search failed: ${e}`)
  }

  return listings
}

function categorizeSearch(query: string): string {
  if (query.includes("workshop") || query.includes("repair")) return "workshop"
  if (query.includes("spare") || query.includes("parts")) return "spare_parts"
  if (query.includes("dealer") || query.includes("import")) return "dealer"
  if (query.includes("tyre")) return "tyre_shop"
  if (query.includes("fuel")) return "fuel_station"
  if (query.includes("wash")) return "car_wash"
  if (query.includes("Toyota") || query.includes("service")) return "authorized_service"
  return "automotive_general"
}

async function enrichWithGemini(listings: MapsListing[]): Promise<any[]> {
  if (!GEMINI_API_KEY || listings.length === 0) return listings

  const prompt = `You are enriching Somaliland automotive business data for the SAIP platform.

For each business below, infer missing data based on name/location knowledge of Somaliland.
Add services offered, estimate business age if possible, flag any major known businesses.

Businesses:
${JSON.stringify(listings.slice(0, 30), null, 2)}

Return ONLY a valid JSON array with same structure plus added fields:
- "services": string[] (likely services offered)  
- "knownBusiness": boolean (is this a known major business in Hargeisa?)
- "notes": string (any notable context about this business)

Keep all original fields. Return [] if no valid data.`

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.2, maxOutputTokens: 4096 },
      }),
    }
  )
  const data = await res.json()
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || ""
  const match = text.match(/\[[\s\S]*\]/)
  if (!match) return listings
  try { return JSON.parse(match[0]) } catch { return listings }
}

async function pushToConvex(listings: MapsListing[]) {
  if (!CONVEX_URL) {
    console.log(`[DRY RUN] Would push ${listings.length} Google Maps listings`)
    listings.slice(0, 5).forEach((l) => console.log(`  📍 ${l.name} — ${l.city} (${l.rating}⭐)`))
    return
  }

  const client = new ConvexHttpClient(CONVEX_URL)
  let pushed = 0

  for (const listing of listings) {
    try {
      await client.mutation("ingestion:upsertAutomotivePoi" as any, {
        name: listing.name,
        category: listing.category,
        city: listing.city,
        country: "Republic of Somaliland",
        address: listing.address,
        rating: listing.rating,
        reviewCount: listing.reviewCount,
        lat: listing.lat,
        lng: listing.lng,
        googleMapsUrl: listing.googleMapsUrl,
        source: "google-maps",
        scrapedAt: Date.now(),
      })
      pushed++
    } catch (e) {
      console.error(`  Push failed for ${listing.name}:`, e)
    }
  }
  console.log(`✅ Pushed ${pushed}/${listings.length} Maps listings to Convex`)
}

// ── Main ──────────────────────────────────────────────────────────────────────
;(async () => {
  console.log("🗺️  SAIP Google Maps Agent starting...")
  let browser: Browser | null = null

  try {
    browser = await chromium.launch({ headless: true, args: ["--no-sandbox", "--disable-blink-features=AutomationControlled"] })
    const context = await browser.newContext({
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      locale: "en-US",
      geolocation: { latitude: 9.5603, longitude: 44.0650 }, // Hargeisa
      permissions: ["geolocation"],
    })
    const page = await context.newPage()

    const allListings: MapsListing[] = []

    for (const search of MAPS_SEARCHES) {
      const listings = await scrapeMapsSearch(page, search)
      console.log(`  Found ${listings.length} listings for "${search.query}" in ${search.city}`)
      allListings.push(...listings)
      await page.waitForTimeout(2000 + Math.random() * 1500)
    }

    console.log(`\n📊 Total raw listings: ${allListings.length}`)
    
    // Deduplicate by name+city
    const seen = new Set<string>()
    const unique = allListings.filter((l) => {
      const key = `${l.name.toLowerCase()}_${l.city}`
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
    console.log(`🔎 Unique listings: ${unique.length}`)

    // Enrich with Gemini
    if (GEMINI_API_KEY) {
      console.log("🤖 Enriching with Gemini...")
    }
    const enriched = await enrichWithGemini(unique)

    await pushToConvex(enriched as MapsListing[])

    // City breakdown
    const byCity = unique.reduce((acc: any, l) => { acc[l.city] = (acc[l.city] || 0) + 1; return acc }, {})
    console.log("\n📈 By city:", byCity)

  } finally {
    await browser?.close()
    console.log("✅ Google Maps Agent complete")
  }
})()
