import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// ==========================================
// SAIP: Market Price Intelligence Engine
// ==========================================
export const getSAIPMarketPrices = query({
  args: { orgId: v.optional(v.string()) },
  handler: async (ctx) => {
    // Return statically mocked market data for the MVP
    return [
      {
        make: "Toyota",
        model: "Hilux Revo",
        year: 2018,
        beForwardPriceUSD: 22000,
        shippingCostUSD: 1800,
        customsDutyUSD: 3500,
        hargeisaStreetPriceUSD: 31000,
        margin: 3700,
        demandLevel: "High",
        lastUpdated: new Date().toISOString()
      },
      {
        make: "Toyota",
        model: "Land Cruiser 79",
        year: 2020,
        beForwardPriceUSD: 45000,
        shippingCostUSD: 2200,
        customsDutyUSD: 5000,
        hargeisaStreetPriceUSD: 58000,
        margin: 5800,
        demandLevel: "High",
        lastUpdated: new Date().toISOString()
      },
      {
        make: "Toyota",
        model: "Probox",
        year: 2015,
        beForwardPriceUSD: 3500,
        shippingCostUSD: 1200,
        customsDutyUSD: 1500,
        hargeisaStreetPriceUSD: 7500,
        margin: 1300,
        demandLevel: "Medium",
        lastUpdated: new Date().toISOString()
      },
      {
        make: "Nissan",
        model: "Patrol Y61",
        year: 2016,
        beForwardPriceUSD: 18000,
        shippingCostUSD: 2000,
        customsDutyUSD: 3000,
        hargeisaStreetPriceUSD: 26000,
        margin: 3000,
        demandLevel: "Medium",
        lastUpdated: new Date().toISOString()
      }
    ];
  },
});

// ==========================================
// SAIP: Aggregate Analytics for KPI Dashboard
// ==========================================
export const getSAIPAnalytics = query({
  handler: async (ctx) => {
    // Fetch counts and latest data for the KPI dashboard
    const pois = await ctx.db.query("automotivePois").collect();
    const marketPrices = await ctx.db.query("marketPrices").order("desc").take(100);
    const vinChecks = await ctx.db.query("vinRegistry").order("desc").take(50);
    const priceIntelligence = await ctx.db.query("marketPriceIntelligence").order("desc").take(50);

    return {
      pois: {
        total: pois.length,
        byCategory: pois.reduce((acc, poi) => {
          acc[poi.category] = (acc[poi.category] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        recent: pois.slice(-5)
      },
      marketPrices: {
        totalScraped: marketPrices.length,
        avgPrice: marketPrices.length > 0 
          ? marketPrices.reduce((sum, item) => sum + item.hargeisaStreetPriceUSD, 0) / marketPrices.length 
          : 0,
        recent: marketPrices.slice(0, 5)
      },
      vinRegistry: {
        totalChecks: vinChecks.length,
        flagged: vinChecks.filter(v => v.status === "stolen" || v.status === "flagged" || v.status === "accident").length,
        recent: vinChecks.slice(0, 5)
      },
      intelligence: {
        totalModelsTracked: priceIntelligence.length,
        recent: priceIntelligence.slice(0, 5)
      }
    };
  }
});

// ==========================================
// SAIP: National Theft & Registry Flagging
// ==========================================
export const checkVinRegistry = mutation({
  args: { 
    vin: v.string(),
    orgId: v.string() 
  },
  handler: async (ctx, args) => {
    // Look up in actual local database if previously flagged by this workshop
    const localFlag = await ctx.db
      .query("vinRegistry")
      .withIndex("by_vin", (q) => q.eq("vin", args.vin))
      .first();

    if (localFlag) {
      return {
        vin: localFlag.vin,
        status: localFlag.status,
        reportedBy: localFlag.reportedBy,
        reportDate: localFlag.reportDate,
        notes: localFlag.notes,
        source: "Local Registry"
      };
    }

    // Mock an external national API integration
    // Simulate a network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Hardcode a few problematic VINs for demo purposes
    if (args.vin.toUpperCase().includes("STOLEN")) {
      return {
        vin: args.vin,
        status: "stolen",
        reportedBy: "Somaliland Traffic Police",
        reportDate: new Date(Date.now() - 86400000 * 5).toISOString(),
        notes: "Reported missing from Berbera port transit.",
        source: "National API"
      };
    }

    if (args.vin.toUpperCase().includes("SALVAGE")) {
      return {
        vin: args.vin,
        status: "accident",
        reportedBy: "Insurance Database",
        reportDate: new Date(Date.now() - 86400000 * 120).toISOString(),
        notes: "Severe front-end collision reported in Dubai prior to import.",
        source: "International API"
      };
    }

    return {
      vin: args.vin,
      status: "clean",
      reportedBy: "SAIP Network",
      reportDate: new Date().toISOString(),
      notes: "No adverse records found in national or international databases.",
      source: "National API"
    };
  },
});
