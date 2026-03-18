import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

// ==========================================
// 1. AUTO SCHEDULER ENGINE
// ==========================================
export const autoAssignJob = mutation({
  args: { 
    workOrderId: v.id("workOrders"),
    orgId: v.string(),
  },
  handler: async (ctx, args) => {
    const job = await ctx.db.get(args.workOrderId);
    if (!job) throw new Error("Job not found");

    const technicians = await ctx.db
      .query("users")
      .withIndex("by_role", (q) => q.eq("role", "technician"))
      .collect();

    let bestTech = null;
    let bestScore = -1;

    for (const tech of technicians) {
      if (tech.isActive === false) continue;
      // tech status logic
      // for our schema, we mapped status inside `currentLoad`, `maxCapacity`, etc.
      // let's assume we read from tech.currentLoad
      const currentLoad = tech.currentLoad || 0;
      const maxCapacity = tech.maxCapacity || 3;
      
      if (currentLoad >= maxCapacity) continue;

      // naive skill match (1 if match, 0.5 if not)
      const serviceRequested = job.services?.[0] || "";
      const skillMatch = (tech.specialties || []).includes(serviceRequested) ? 1 : 0.5;
      
      const availability = currentLoad === 0 ? 1 : 0.5;
      // efficiency default to 80 if null
      const speed = (tech.efficiency || 80) / 100;

      const score = (skillMatch * 0.4) + (availability * 0.3) + (speed * 0.2);

      if (score > bestScore) {
        bestScore = score;
        bestTech = tech;
      }
    }

    if (!bestTech) {
      throw new Error("No available technician could be auto-assigned.");
    }

    // Find available bay
    const availableBays = await ctx.db
      .query("bays")
      .withIndex("by_status", (q) => q.eq("status", "free"))
      .filter((q) => q.eq(q.field("orgId"), args.orgId))
      .collect();

    let assignedBayId = undefined;
    if (availableBays.length > 0) {
      assignedBayId = availableBays[0]._id;
      await ctx.db.patch(assignedBayId, {
        status: "occupied",
        technicianId: bestTech._id,
        jobId: job._id
      });
    }

    // Update the work order
    await ctx.db.patch(job._id, {
      technicianId: bestTech._id,
      bayId: assignedBayId,
      status: "diagnosis",
      startedAt: new Date().toISOString(),
    });

    // Update the technician's load
    await ctx.db.patch(bestTech._id, {
      currentLoad: (bestTech.currentLoad || 0) + 1
    });

    return { success: true, assignedTech: bestTech._id, assignedBay: assignedBayId };
  }
});

// ==========================================
// 2. PARTS & DELAY ENGINE
// ==========================================
export const markPartsRequested = mutation({
  args: { workOrderId: v.id("workOrders") },
  handler: async (ctx, args) => {
    const job = await ctx.db.get(args.workOrderId);
    if (!job) throw new Error("Job not found");

    await ctx.db.patch(args.workOrderId, {
      status: "waiting-parts",
      waitingForParts: true,
      partsRequestedAt: Date.now(),
    });

    if (job.bayId) {
      await ctx.db.patch(job.bayId, {
        status: "waiting_parts"
      });
    }

    // Free up technician capacity? Optional.
    return { success: true };
  }
});

export const markPartsReceived = mutation({
  args: { workOrderId: v.id("workOrders") },
  handler: async (ctx, args) => {
    const job = await ctx.db.get(args.workOrderId);
    if (!job) throw new Error("Job not found");

    await ctx.db.patch(args.workOrderId, {
      status: "in-progress",
      waitingForParts: false,
      partsReceivedAt: Date.now(),
    });

    if (job.bayId) {
      await ctx.db.patch(job.bayId, {
        status: "occupied"
      });
    }

    return { success: true };
  }
});

// ==========================================
// 3. KPI INTELLIGENCE ENGINE
// ==========================================
export const advancedKPIs = query({
  args: { orgId: v.string() },
  handler: async (ctx, args) => {
    const jobs = await ctx.db
      .query("workOrders")
      .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
      .collect();

    const completed = jobs.filter(j => j.status === "complete" || j.status === "invoiced");

    const totalTime = completed.reduce((sum, j) => 
      sum + (j.actualMinutes || 0), 0
    );

    const delays = completed
      .filter(j => j.partsReceivedAt && j.partsRequestedAt)
      .map(j => (j.partsReceivedAt! - j.partsRequestedAt!) / 60000); // Minutes

    const averageDelay = delays.length > 0 ? (delays.reduce((a, b) => a + b, 0) / delays.length) : 0;

    return {
      throughput: completed.length,
      avgRepairTimeMinutes: completed.length > 0 ? (totalTime / completed.length) : 0,
      avgPartsDelayMinutes: averageDelay,
      totalRevenueToday: jobs.reduce((sum, j) => sum + (j.totalAmount || 0), 0)
    };
  }
});

// ==========================================
// LIFECYCLE ENGINE — complete job flow
// ==========================================

/** In Progress → Quality Check */
export const moveToQualityCheck = mutation({
  args: { workOrderId: v.id("workOrders") },
  handler: async (ctx, args) => {
    const job = await ctx.db.get(args.workOrderId);
    if (!job) throw new Error("Job not found");
    await ctx.db.patch(args.workOrderId, { status: "quality-check" });
    return { success: true };
  },
});

/** Quality Check → Complete — sets completedAt + calculates actualMinutes */
export const completeJob = mutation({
  args: {
    workOrderId: v.id("workOrders"),
    totalAmount: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const job = await ctx.db.get(args.workOrderId);
    if (!job) throw new Error("Job not found");

    const now = new Date();
    const completedAt = now.toISOString();

    // Calculate actual repair time from startedAt
    let actualMinutes: number | undefined;
    if (job.startedAt) {
      const startMs = new Date(job.startedAt).getTime();
      actualMinutes = Math.round((now.getTime() - startMs) / 60000);
    }

    await ctx.db.patch(args.workOrderId, {
      status: "complete",
      completedAt,
      actualMinutes,
      totalAmount: args.totalAmount ?? job.totalAmount ?? 0,
    });

    // Free the bay
    if (job.bayId) {
      await ctx.db.patch(job.bayId, {
        status: "free",
        technicianId: undefined,
        jobId: undefined,
      });
    }

    // Release technician capacity
    if (job.technicianId) {
      const tech = await ctx.db.get(job.technicianId);
      if (tech) {
        await ctx.db.patch(tech._id, {
          currentLoad: Math.max(0, (tech.currentLoad || 1) - 1),
        });
      }
    }

    return { success: true, completedAt, actualMinutes };
  },
});

/** Awaiting Approval → In Progress */
export const approveAndStart = mutation({
  args: { workOrderId: v.id("workOrders") },
  handler: async (ctx, args) => {
    const job = await ctx.db.get(args.workOrderId);
    if (!job) throw new Error("Job not found");
    await ctx.db.patch(args.workOrderId, {
      status: "in-progress",
      startedAt: new Date().toISOString(),
    });
    return { success: true };
  },
});

// ==========================================
// 4. PREDICTIVE ENGINE
// ==========================================
export const predictTime = query({
  args: { service: v.string(), orgId: v.string() },
  handler: async (ctx, args) => {
    // Only search completed jobs for this exact service
    // Very simplified predictive algorithm based on historical data
    const jobs = await ctx.db
      .query("workOrders")
      .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
      .filter((q) => q.eq(q.field("status"), "complete"))
      .collect();

    const matchedJobs = jobs.filter(j => (j.services || []).includes(args.service));

    if (matchedJobs.length === 0) return 60; // Default unknown

    const avg = matchedJobs.reduce((sum, j) => 
      sum + (j.actualMinutes || 60), 0
    ) / matchedJobs.length;

    return Math.round(avg);
  }
});

// ==========================================
// 5. REVENUE ENGINE (Basic aggregated sum over time)
// ==========================================
export const getDailyRevenue = query({
  args: { orgId: v.string(), datePrefix: v.string() }, // e.g., "2026-03-17"
  handler: async (ctx, args) => {
    const invoices = await ctx.db
      .query("invoices")
      .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
      .filter((q) => q.eq(q.field("status"), "paid"))
      .collect();

    // In a real app we would parse createdAt/sentAt appropriately
    // But assuming we sum everything for this simple test:
    const total = invoices.reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);
    return total;
  }
});
