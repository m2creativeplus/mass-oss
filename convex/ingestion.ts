/**
 * SAIP Convex Ingestion API
 * All 6 agents push data through these mutations
 * Built to match the exact MASS OSS schema
 */

import { mutation, query } from "./_generated/server"
import { v } from "convex/values"

// Category normalizer for automotivePois strict union
function normalizeCategory(raw: string): "garage" | "spare_parts" | "car_dealer" | "tire_shop" | "fuel_station" | "fleet_operator" | "oil_lubricants" | "batteries" | "tools_equipment" {
  const lower = raw.toLowerCase()
  if (lower.includes("workshop") || lower.includes("repair") || lower.includes("mechanic") || lower.includes("service") || lower.includes("general") || lower.includes("automotive")) return "garage"
  if (lower.includes("spare") || lower.includes("parts")) return "spare_parts"
  if (lower.includes("dealer") || lower.includes("import") || lower.includes("seller")) return "car_dealer"
  if (lower.includes("tyre") || lower.includes("tire")) return "tire_shop"
  if (lower.includes("fuel") || lower.includes("petrol") || lower.includes("station")) return "fuel_station"
  if (lower.includes("fleet")) return "fleet_operator"
  if (lower.includes("oil") || lower.includes("lubricant")) return "oil_lubricants"
  if (lower.includes("battery") || lower.includes("batteries")) return "batteries"
  if (lower.includes("tool") || lower.includes("equipment")) return "tools_equipment"
  return "garage" // default fallback
}

// ── Agent 1+2: Upsert Automotive POI (from Google Search + Maps) ────────────
export const upsertAutomotivePoi = mutation({
  args: {
    name: v.string(),
    category: v.string(),    // raw string — will be normalized
    city: v.string(),
    address: v.optional(v.string()),
    phone: v.optional(v.string()),
    rating: v.optional(v.number()),
    reviewCount: v.optional(v.number()),
    lat: v.optional(v.number()),
    lng: v.optional(v.number()),
    googleMapsUrl: v.optional(v.string()),
    sourceUrl: v.optional(v.string()),
    description: v.optional(v.string()),
    confidence: v.optional(v.number()),
    source: v.string(),
    scrapedAt: v.number(),
  },
  handler: async (ctx, args) => {
    const category = normalizeCategory(args.category)

    // Check for existing POI by name + city
    const existing = await ctx.db
      .query("automotivePois")
      .withIndex("by_city", (q) => q.eq("city", args.city))
      .filter((q) => q.eq(q.field("businessName"), args.name))
      .first()

    if (existing) {
      await ctx.db.patch(existing._id, {
        rating: args.rating ?? existing.rating,
        reviewCount: args.reviewCount ?? existing.reviewCount,
        phone: args.phone ?? existing.phone,
        latitude: args.lat ?? existing.latitude,
        longitude: args.lng ?? existing.longitude,
      })
      return { action: "updated", id: existing._id }
    }

    const id = await ctx.db.insert("automotivePois", {
      businessName: args.name,
      category,
      city: args.city,
      address: args.address,
      phone: args.phone,
      rating: args.rating,
      reviewCount: args.reviewCount,
      latitude: args.lat,
      longitude: args.lng,
      website: args.googleMapsUrl || args.sourceUrl,
      source: args.source,
      notes: args.description,
      isActive: true,
    })
    return { action: "inserted", id }
  },
})

// ── Agent 3: Upsert Facebook Vehicle Listing (into marketPrices table) ──────
// Using marketPrices as the vehicle listings table since it has the right fields
export const upsertVehicleListing = mutation({
  args: {
    make: v.string(),
    model: v.string(),
    year: v.optional(v.number()),
    priceUSD: v.optional(v.number()),
    mileageKm: v.optional(v.number()),
    condition: v.optional(v.string()),
    location: v.optional(v.string()),
    sourceUrl: v.string(),
    description: v.optional(v.string()),
    source: v.string(),
    fraudRisk: v.optional(v.string()),
    scrapedAt: v.number(),
  },
  handler: async (ctx, args) => {
    // Facebook listings go into marketPrices as real data points
    if (!args.make || !args.model || !args.year || !args.priceUSD) {
      return { action: "skipped", reason: "insufficient data" }
    }
    // Check for existing listing by make+model+year+price combo
    const existing = await ctx.db
      .query("marketPrices")
      .withIndex("by_model", (q) => q.eq("make", args.make).eq("model", args.model))
      .filter((q) => q.eq(q.field("year"), args.year!))
      .first()

    if (existing) {
      // Update price if newer
      await ctx.db.patch(existing._id, {
        beForwardPriceUSD: args.priceUSD!,
        lastUpdated: new Date(args.scrapedAt).toISOString(),
      })
      return { action: "updated", id: existing._id }
    }

    // Insert as new marketplace listing (orgId = "saip-public")
    const id = await ctx.db.insert("marketPrices", {
      make: args.make,
      model: args.model,
      year: args.year,
      beForwardPriceUSD: args.priceUSD,
      hargeisaStreetPriceUSD: Math.round(args.priceUSD * 1.35), // estimated 35% premium
      shippingCostUSD: 1800,
      customsDutyUSD: Math.round(args.priceUSD * 0.15),
      demandLevel: "Medium",
      lastUpdated: new Date(args.scrapedAt).toISOString(),
      orgId: "saip-public",
    })
    return { action: "inserted", id }
  },
})

// ── Agent 5: Upsert Market Valuation (Vehicle Valuator → marketPriceIntelligence) ─
export const upsertMarketValuation = mutation({
  args: {
    make: v.string(),
    model: v.string(),
    yearRange: v.string(),
    beForwardAvgUSD: v.number(),
    shippingUSD: v.optional(v.number()),
    dutyUSD: v.optional(v.number()),
    hargeisaStreetAvgUSD: v.number(),
    hargeisaStreetMinUSD: v.optional(v.number()),
    hargeisaStreetMaxUSD: v.optional(v.number()),
    demandLevel: v.string(),
    demandScore: v.optional(v.number()),
    trend: v.string(),
    notes: v.optional(v.string()),
    valuedAt: v.number(),
    source: v.string(),
  },
  handler: async (ctx, args) => {
    const [yearFromStr, yearToStr] = args.yearRange.split("-")
    const yearFrom = parseInt(yearFromStr) || 2000
    const yearTo = parseInt(yearToStr) || 2024

    const existing = await ctx.db
      .query("marketPriceIntelligence")
      .withIndex("by_make", (q) => q.eq("vehicleMake", args.make))
      .filter((q) => q.eq(q.field("vehicleModel"), args.model))
      .first()

    if (existing) {
      await ctx.db.patch(existing._id, {
        fobPriceUsd: args.beForwardAvgUSD,
        streetPriceUsd: args.hargeisaStreetAvgUSD,
        recordedAt: new Date(args.valuedAt).toISOString(),
        notes: args.notes,
      })
      return { action: "updated", id: existing._id }
    }

    const id = await ctx.db.insert("marketPriceIntelligence", {
      vehicleMake: args.make,
      vehicleModel: args.model,
      yearFrom,
      yearTo,
      source: args.source,
      fobPriceUsd: args.beForwardAvgUSD,
      cAndFPriceUsd: args.beForwardAvgUSD + (args.shippingUSD || 1800),
      streetPriceUsd: args.hargeisaStreetAvgUSD,
      condition: "Good",
      recordedAt: new Date(args.valuedAt).toISOString(),
      notes: args.notes,
    })
    return { action: "inserted", id }
  },
})

// ── Public Queries: Used by MASS OSS ai-tools page ─────────────────────────

export const getMarketPriceIntelligence = query({
  args: {},
  handler: async (ctx) => {
    return ctx.db.query("marketPriceIntelligence").collect()
  },
})

export const getMarketPrices = query({
  args: { orgId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const all = await ctx.db.query("marketPrices").collect()
    // Return saip-public data plus org-specific data
    return all.filter((p) => p.orgId === "saip-public" || p.orgId === args.orgId)
  },
})

export const getPoisByCity = query({
  args: { city: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (args.city) {
      return ctx.db
        .query("automotivePois")
        .withIndex("by_city", (q) => q.eq("city", args.city!))
        .collect()
    }
    return ctx.db.query("automotivePois").collect()
  },
})

export const getVinRegistry = query({
  args: { vin: v.string() },
  handler: async (ctx, args) => {
    return ctx.db
      .query("vinRegistry")
      .withIndex("by_vin", (q) => q.eq("vin", args.vin.toUpperCase()))
      .first()
  },
})
