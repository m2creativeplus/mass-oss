/**
 * SAIP Agent 3: Facebook Listings Scraper
 * Scrapes vehicle listings from Facebook Marketplace + Somaliland car groups
 * Runs every 6 hours via GitHub Actions
 * Uses Playwright + Gemini for Somali/English normalization
 */

import { chromium, type Browser, type Page } from "playwright"
import { ConvexHttpClient } from "convex/browser"

const CONVEX_URL = process.env.CONVEX_URL || ""
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || ""
const FB_EMAIL = process.env.FB_EMAIL || ""
const FB_PASSWORD = process.env.FB_PASSWORD || ""

// Known Somaliland Facebook car groups
const FB_GROUPS = [
  "https://www.facebook.com/marketplace/hargeisa/vehicles",
  "https://www.facebook.com/groups/somalilandcars",
  "https://www.facebook.com/groups/hargeisamarketplace",
  "https://www.facebook.com/groups/somalilandvehicles",
  "https://www.facebook.com/groups/carshargeysa",
]

interface FBListing {
  title: string
  price?: string
  priceUSD?: number
  location: string
  description: string
  images: string[]
  sourceUrl: string
  postedAt?: string
  rawText: string
}

async function loginToFacebook(page: Page): Promise<boolean> {
  if (!FB_EMAIL || !FB_PASSWORD) {
    console.log("⚠️  No Facebook credentials — using public data only")
    return false
  }

  try {
    await page.goto("https://www.facebook.com/login", { waitUntil: "domcontentloaded", timeout: 15000 })
    await page.fill("#email", FB_EMAIL)
    await page.fill("#pass", FB_PASSWORD)
    await page.click('[name="login"]')
    await page.waitForTimeout(4000)

    const isLoggedIn = await page.$('[aria-label="Facebook"]').then(Boolean).catch(() => false)
    console.log(isLoggedIn ? "✅ Facebook login successful" : "❌ Facebook login failed")
    return isLoggedIn
  } catch (e) {
    console.error("Facebook login error:", e)
    return false
  }
}

async function scrapeMarketplace(page: Page): Promise<FBListing[]> {
  const listings: FBListing[] = []

  try {
    // Facebook Marketplace for Hargeisa vehicles
    await page.goto("https://www.facebook.com/marketplace/hargeisa/vehicles?sortBy=creation_time_descend&exact=false", {
      waitUntil: "domcontentloaded",
      timeout: 20000,
    })
    await page.waitForTimeout(3000)

    // Scroll to load more listings
    for (let i = 0; i < 8; i++) {
      await page.evaluate(() => window.scrollBy(0, 800))
      await page.waitForTimeout(1200)
    }

    // Extract listing cards
    const cards = await page.$$('[data-testid="marketplace_feed_item"], [role="listitem"] a[href*="/marketplace/item/"]')
    console.log(`  Found ${cards.length} Marketplace listing cards`)

    for (const card of cards.slice(0, 50)) {
      try {
        const titleEl = await card.$('span.x1lliihq, [dir="auto"] span')
        const title = (await titleEl?.textContent())?.trim() || ""

        const priceEl = await card.$('[aria-label*="$"], span:has-text("$"), span:has-text("SL")')
        const priceText = (await priceEl?.textContent())?.trim() || ""

        const locationEl = await card.$('span.x1nxh6w3, [class*="subtitle"]')
        const location = (await locationEl?.textContent())?.trim() || "Hargeisa"

        const imgEl = await card.$("img")
        const imgSrc = await imgEl?.getAttribute("src") || ""

        const href = await card.getAttribute("href") || ""

        if (title) {
          listings.push({
            title,
            price: priceText,
            priceUSD: extractUSD(priceText),
            location,
            description: "",
            images: imgSrc ? [imgSrc] : [],
            sourceUrl: href.startsWith("http") ? href : `https://www.facebook.com${href}`,
            rawText: `${title} ${priceText} ${location}`,
          })
        }
      } catch {}
    }
  } catch (e) {
    console.error("Marketplace scrape error:", e)
  }

  return listings
}

async function scrapeGroups(page: Page): Promise<FBListing[]> {
  const listings: FBListing[] = []

  for (const groupUrl of FB_GROUPS.slice(1)) { // Skip marketplace, already scraped
    try {
      console.log(`  📱 Scraping: ${groupUrl}`)
      await page.goto(groupUrl, { waitUntil: "domcontentloaded", timeout: 15000 })
      await page.waitForTimeout(3000)

      for (let i = 0; i < 5; i++) {
        await page.evaluate(() => window.scrollBy(0, 1000))
        await page.waitForTimeout(1000)
      }

      // Extract post text from group feed
      const posts = await page.$$('.x1n2onr6 [data-ad-comet-preview], [role="article"]')
      for (const post of posts.slice(0, 30)) {
        try {
          const text = (await post.textContent())?.trim() || ""
          if (text.length > 20 && isVehiclePost(text)) {
            listings.push({
              title: text.slice(0, 100),
              location: extractCity(text),
              description: text.slice(0, 500),
              images: [],
              sourceUrl: groupUrl,
              rawText: text,
            })
          }
        } catch {}
      }
    } catch (e) {
      console.error(`  Group scrape failed for ${groupUrl}:`, e)
    }
  }

  return listings
}

function isVehiclePost(text: string): boolean {
  const vehicleKeywords = [
    "Toyota", "Hilux", "Land Cruiser", "Hiace", "Voxy", "Prado", "Corolla",
    "Pajero", "Suzuki", "Mitsubishi", "Honda", "BMW", "Mercedes",
    "baabuur", "gaariga", "kaariga", // Somali words for car
    "$", "USD", "SL shilling", "lacag",
    "iib", "guri", "2024", "2023", "2022", "2021", "2020",
    "km", "mileage",
  ]
  const lower = text.toLowerCase()
  return vehicleKeywords.some((kw) => lower.includes(kw.toLowerCase()))
}

function extractCity(text: string): string {
  const cities = ["Hargeisa", "Berbera", "Borama", "Burao", "Las Anod", "Hargeysa"]
  return cities.find((c) => text.toLowerCase().includes(c.toLowerCase())) || "Hargeisa"
}

function extractUSD(priceText: string): number | undefined {
  const match = priceText.match(/[\$]?\s*([\d,]+)/)
  if (!match) return undefined
  const num = parseInt(match[1].replace(",", ""))
  return isNaN(num) ? undefined : num
}

async function normalizeWithGemini(listings: FBListing[]): Promise<any[]> {
  if (!GEMINI_API_KEY || listings.length === 0) return []

  const prompt = `You are the SAIP vehicle listings normalizer for Somaliland's automotive database.

Extract structured vehicle data from these Facebook listings. Support Somali + English mixed text.
Only include actual vehicle sale listings (not services, parts, or unrelated posts).

Raw listings:
${listings.slice(0, 25).map((l, i) => `--- Listing ${i + 1} ---\nTitle: ${l.title}\nRaw: ${l.rawText.slice(0, 300)}\nURL: ${l.sourceUrl}`).join("\n\n")}

Return ONLY valid JSON array (no markdown):
[
  {
    "title": "normalized title in English",
    "make": "Toyota",
    "model": "Land Cruiser 200",
    "year": 2018,
    "priceUSD": 25000,
    "mileageKm": 120000,
    "condition": "good|fair|excellent|poor",
    "transmission": "automatic|manual|unknown",
    "fuelType": "petrol|diesel|unknown",
    "color": "white",
    "location": "Hargeisa",
    "sellerType": "private|dealer",
    "sourceUrl": "url",
    "description": "normalized English description",
    "fraudRisk": "low|medium|high",
    "fraudNotes": "any suspicious patterns"
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

async function pushToConvex(vehicles: any[]) {
  if (!CONVEX_URL) {
    console.log(`[DRY RUN] Would push ${vehicles.length} Facebook vehicle listings`)
    vehicles.slice(0, 3).forEach((v) => console.log(`  🚗 ${v.year} ${v.make} ${v.model} — $${v.priceUSD?.toLocaleString()}`))
    return
  }

  const client = new ConvexHttpClient(CONVEX_URL)
  let pushed = 0
  for (const vehicle of vehicles) {
    try {
      await client.mutation("ingestion:upsertVehicleListing" as any, {
        ...vehicle,
        source: "facebook",
        scrapedAt: Date.now(),
      })
      pushed++
    } catch (e) {
      console.error(`Push failed: ${vehicle.title}`, e)
    }
  }
  console.log(`✅ Pushed ${pushed}/${vehicles.length} Facebook listings to Convex`)
}

// ── Main ──────────────────────────────────────────────────────────────────────
;(async () => {
  console.log("📘 SAIP Facebook Listings Agent starting...")
  let browser: Browser | null = null

  try {
    browser = await chromium.launch({ headless: true, args: ["--no-sandbox"] })
    const context = await browser.newContext({
      userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_3 like Mac OS X) AppleWebKit/605.1.15",
      viewport: { width: 390, height: 844 },
      locale: "en-US",
    })
    const page = await context.newPage()

    const loggedIn = await loginToFacebook(page)

    console.log("🏪 Scraping Facebook Marketplace...")
    const marketplace = await scrapeMarketplace(page)
    console.log(`  Marketplace listings: ${marketplace.length}`)

    console.log("📱 Scraping Facebook Groups...")
    const groups = await scrapeGroups(page)
    console.log(`  Group listings: ${groups.length}`)

    const allListings = [...marketplace, ...groups]
    console.log(`\n📊 Total raw listings: ${allListings.length}`)

    // Deduplicate
    const seen = new Set<string>()
    const unique = allListings.filter((l) => {
      const key = l.title.toLowerCase().slice(0, 30)
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
    console.log(`🔎 Unique listings: ${unique.length}`)

    if (unique.length > 0) {
      console.log("🤖 Normalizing with Gemini (Somali+English)...")
      const normalized = await normalizeWithGemini(unique)
      console.log(`✨ Extracted ${normalized.length} vehicle listings`)
      await pushToConvex(normalized)
    }

  } finally {
    await browser?.close()
    console.log("✅ Facebook Agent complete")
  }
})()
