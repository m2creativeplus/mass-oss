import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ============================================================
// MASS DATA INGESTION ENGINE
// Handles external API payloads (Scrap.io, Outscraper, Manual CSV)
// Enforces "Golden Record" rules via deduplication
// ============================================================

/**
 * INGEST LEADS
 * Acccepts a batch of raw lead data.
 * Checks for duplicates against `automotivePois` and `massPartners`.
 * Only inserts net-new records.
 */
export const ingestLeads = mutation({
  args: {
    source: v.string(), // "outscraper_api", "scrap_io", "manual_import"
    batchId: v.string(),
    leads: v.array(v.object({
      businessName: v.string(),
      category: v.string(),
      city: v.string(),
      phone: v.optional(v.string()),
      email: v.optional(v.string()),
      address: v.optional(v.string()),
      website: v.optional(v.string()),
      latitude: v.optional(v.number()),
      longitude: v.optional(v.number()),
      notes: v.optional(v.string()),
    })),
  },
  handler: async (ctx, args) => {
    const results = {
      processed: 0,
      inserted: 0,
      duplicates: 0,
      errors: 0,
    };

    const existingPois = await ctx.db.query("automotivePois").collect();
    const existingPartners = await ctx.db.query("massPartners").collect();

    // Create lookup sets for fast deduplication (Phone & Normalized Name)
    const phoneSet = new Set<string>();
    const nameSet = new Set<string>();

    // Helper: Normalize phone (basic cleanup)
    const normalize = (str: string) => str.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();

    // Populate lookups from DB
    existingPois.forEach(p => {
      if (p.phone) phoneSet.add(normalize(p.phone));
      nameSet.add(normalize(p.businessName));
    });
    existingPartners.forEach(p => {
      if (p.phone) phoneSet.add(normalize(p.phone));
      nameSet.add(normalize(p.partnerName));
    });

    for (const lead of args.leads) {
      results.processed++;

      // 1. CHECK DUPLICATES
      let isDuplicate = false;

      // Check Name (Fuzzy exact match on normalized string)
      if (nameSet.has(normalize(lead.businessName))) isDuplicate = true;

      // Check Phone (if exists)
      if (lead.phone && phoneSet.has(normalize(lead.phone))) isDuplicate = true;

      if (isDuplicate) {
        results.duplicates++;
        continue;
      }

      // 2. MAP CATEGORY (Normalize to schema union)
      let mappedCategory = "garage"; // Default
      const catLower = lead.category.toLowerCase();
      
      if (catLower.includes("part")) mappedCategory = "spare_parts";
      else if (catLower.includes("dealer") || catLower.includes("sales")) mappedCategory = "car_dealer";
      else if (catLower.includes("tire") || catLower.includes("tyre")) mappedCategory = "tire_shop";
      else if (catLower.includes("fuel") || catLower.includes("station")) mappedCategory = "fuel_station";
      else if (catLower.includes("oil") || catLower.includes("lube")) mappedCategory = "oil_lubricants";
      else if (catLower.includes("battery")) mappedCategory = "batteries";
      else if (catLower.includes("tool")) mappedCategory = "tools_equipment";

      // 3. INSERT RECORD
      try {
        await ctx.db.insert("automotivePois", {
          businessName: lead.businessName,
          category: mappedCategory as any, // Cast to union type
          city: lead.city,
          phone: lead.phone,
          email: lead.email,
          address: lead.address,
          website: lead.website,
          latitude: lead.latitude,
          longitude: lead.longitude,
          source: args.source,
          verifiedAt: new Date().toISOString(),
          isActive: true,
          notes: `Ingested Batch: ${args.batchId}. Original Note: ${lead.notes || ''}`,
        });

        // Add to local set to prevent dups within the same batch
        nameSet.add(normalize(lead.businessName));
        if (lead.phone) phoneSet.add(normalize(lead.phone));
        
        results.inserted++;
      } catch (err) {
        console.error(`Failed to insert ${lead.businessName}:`, err);
        results.errors++;
      }
    }

    return results;
  },
});
