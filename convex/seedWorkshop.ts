import { mutation } from "./_generated/server";

// Seeds realistic workshop demo data for live testing
export const seedWorkshopDemo = mutation({
  handler: async (ctx) => {
    // 1. Seed Bays
    const bayNames = [
      { name: "Bay 1 - General", type: "mechanical" as const },
      { name: "Bay 2 - Engine", type: "mechanical" as const },
      { name: "Bay 3 - Body", type: "body" as const },
      { name: "Bay 4 - Paint", type: "paint" as const },
    ];

    const bayIds = [];
    for (const bay of bayNames) {
      const id = await ctx.db.insert("bays", {
        name: bay.name,
        type: bay.type,
        status: "free",
        orgId: "mass-hargeisa",
      });
      bayIds.push(id);
    }

    // 2. Find existing technicians
    const techs = await ctx.db
      .query("users")
      .withIndex("by_role", (q) => q.eq("role", "technician"))
      .collect();

    // Set their capacity/skills
    for (const tech of techs) {
      await ctx.db.patch(tech._id, {
        currentLoad: 0,
        maxCapacity: 3,
        efficiency: 85 + Math.floor(Math.random() * 10),
        specialties: ["Oil Change", "Brake Repair", "Engine Tune-Up", "Suspension"],
      });
    }

    // 3. Find existing customers + vehicles
    const customers = await ctx.db.query("customers").take(5);
    const vehicles = await ctx.db.query("vehicles").take(5);

    if (customers.length === 0 || vehicles.length === 0) {
      // Need at least one customer + vehicle
      const custId = await ctx.db.insert("customers", {
        firstName: "Ali",
        lastName: "Mohamed",
        email: "ali@example.com",
        phone: "0634567890",
        address: "Hargeisa Main Road",
        orgId: "mass-hargeisa",
      });
      
      const vehId = await ctx.db.insert("vehicles", {
        customerId: custId,
        year: 2019,
        make: "Toyota",
        model: "Land Cruiser",
        vin: "JTMHY7AJ2KD012345",
        licensePlate: "HGA-4521",
        color: "White",
        engineType: "V8 4.5L Diesel",
        transmission: "automatic",
        status: "active",
        orgId: "mass-hargeisa",
      });

      customers.push(await ctx.db.get(custId) as any);
      vehicles.push(await ctx.db.get(vehId) as any);
    }

    // 4. Create sample work orders in different statuses
    const sampleJobs = [
      {
        services: ["Oil Change", "Filter Replacement"],
        status: "check-in" as const,
        priority: "normal" as const,
        complaint: "Regular 10,000km service",
      },
      {
        services: ["Brake Pad Replacement"],
        status: "check-in" as const,
        priority: "high" as const,
        complaint: "Squealing brakes, grinding noise",
      },
      {
        services: ["Engine Diagnostic"],
        status: "in-progress" as const,
        priority: "urgent" as const,
        complaint: "Engine overheating in traffic",
      },
      {
        services: ["Suspension Check"],
        status: "waiting-parts" as const,
        priority: "normal" as const,
        complaint: "Rough ride, pulling to left",
      },
      {
        services: ["AC Repair"],
        status: "diagnosis" as const,
        priority: "high" as const,
        complaint: "AC blowing hot air",
      },
      {
        services: ["Timing Belt"],
        status: "awaiting-approval" as const,
        priority: "normal" as const,
        complaint: "Preventive maintenance at 120k km",
      },
    ];

    const createdJobs = [];
    for (let i = 0; i < sampleJobs.length; i++) {
      const job = sampleJobs[i];
      const custIdx = i % customers.length;
      const vehIdx = i % vehicles.length;

      const techIdx = i % techs.length;
      const assignedTech = job.status !== "check-in" ? techs[techIdx]?._id : undefined;
      const assignedBay = job.status === "in-progress" || job.status === "waiting-parts"
        ? bayIds[i % bayIds.length]
        : undefined;

      const jobNum = `WO-${String(2000 + i).padStart(4, "0")}`;

      const jobId = await ctx.db.insert("workOrders", {
        jobNumber: jobNum,
        vehicleId: vehicles[vehIdx]._id,
        customerId: customers[custIdx]._id,
        technicianId: assignedTech,
        status: job.status,
        priority: job.priority,
        services: job.services,
        department: "mechanical",
        bayId: assignedBay,
        waitingForParts: job.status === "waiting-parts",
        partsRequestedAt: job.status === "waiting-parts" ? Date.now() - 3600000 : undefined, // 1hr ago
        estimatedMinutes: 60 + Math.floor(Math.random() * 120),
        customerComplaint: job.complaint,
        checkinDate: new Date().toISOString().split("T")[0],
        startedAt: job.status !== "check-in" ? new Date(Date.now() - 7200000).toISOString() : undefined,
        orgId: "mass-hargeisa",
      });
      createdJobs.push(jobId);

      // Update bay status if assigned
      if (assignedBay) {
        await ctx.db.patch(assignedBay, {
          status: job.status === "waiting-parts" ? "waiting_parts" : "occupied",
          technicianId: assignedTech,
          jobId: jobId,
        });
      }

      // Increment tech load
      if (assignedTech) {
        const t = await ctx.db.get(assignedTech);
        if (t) {
          await ctx.db.patch(assignedTech, {
            currentLoad: (t.currentLoad || 0) + 1,
          });
        }
      }
    }

    return {
      success: true,
      seeded: {
        bays: bayIds.length,
        jobs: createdJobs.length,
        techniciansUpdated: techs.length,
      },
    };
  },
});
