import { mutation } from "./_generated/server";

export const seedAll = mutation({
  args: {},
  handler: async (ctx) => {
    let orgId;
    const existingOrg = await ctx.db
      .query("organizations")
      .withIndex("by_slug", (q) => q.eq("slug", "mass-hargeisa"))
      .first();

    if (existingOrg) { orgId = existingOrg._id; }

    const demoUsers = [
      { email: "owner@masscar.com", firstName: "Yusuf", lastName: "Abdi", role: "admin" },
      { email: "admin@masscar.com", firstName: "Mohamed", lastName: "Hassan", role: "admin" },
      { email: "staff@masscar.com", firstName: "Fatima", lastName: "Ali", role: "staff" },
      { email: "tech@masscar.com", firstName: "Ibrahim", lastName: "Yusuf", role: "technician" },
      { email: "tech2@masscar.com", firstName: "Ahmed", lastName: "Hassan", role: "technician" },
      { email: "tech3@masscar.com", firstName: "Omar", lastName: "Farah", role: "technician" },
      { email: "customer@masscar.com", firstName: "Halimo", lastName: "Jama", role: "customer" },
    ];

    const userIds: Record<string, any> = {};
    for (const u of demoUsers) {
      const existing = await ctx.db.query("users").withIndex("by_email", (q) => q.eq("email", u.email)).first();
      if (existing) {
        userIds[u.email] = existing._id;
      } else {
        userIds[u.email] = await ctx.db.insert("users", { ...u, role: u.role as any, isActive: true });
      }
    }

    if (!orgId) {
      orgId = await ctx.db.insert("organizations", {
        name: "MASS Car Workshop", slug: "mass-hargeisa", ownerId: userIds["owner@masscar.com"], plan: "enterprise", isActive: true,
      });
    }

    for (const u of demoUsers) {
      if (u.role === "customer") continue;
      const existing = await ctx.db.query("userOrgRoles").withIndex("by_user_org", (q) => q.eq("userId", userIds[u.email]).eq("orgId", orgId!)).first();
      if (!existing) {
        await ctx.db.insert("userOrgRoles", { userId: userIds[u.email], orgId: orgId!, role: u.role as any, isActive: true });
      }
    }

    const customers = [
      { firstName: "Mohamed", lastName: "Ibrahim", email: "mohamed.ibrahim@email.com", phone: "+252-63-4521789", address: "26 June Road, Hargeisa" },
      { firstName: "Fatima", lastName: "Ali Omar", email: "fatima.omar@email.com", phone: "+252-63-8765432", address: "Airport Road, Hargeisa" },
      { firstName: "Ahmed", lastName: "Yusuf", email: "ahmed.yusuf@email.com", phone: "+252-63-1234567", address: "Jigjiga Yar, Hargeisa" },
      { firstName: "Halimo", lastName: "Jama Farah", email: "halimo.jama@email.com", phone: "+252-63-9876543", address: "Koodbuur, Hargeisa" },
      { firstName: "Abdullahi", lastName: "Mohamed", email: "abdullahi.m@email.com", phone: "+252-63-5678901", address: "Stadium Road, Hargeisa" },
    ];

    const customerIds: any[] = [];
    for (let i = 0; i < customers.length; i++) {
      const c = customers[i];
      const existing = await ctx.db.query("customers").withIndex("by_email", (q) => q.eq("email", c.email)).first();
      if (existing) { customerIds.push(existing._id); } else {
        const id = await ctx.db.insert("customers", { ...c, orgId: orgId!, customerNumber: `CUST-${1000 + i}`, notes: "", isActive: true });
        customerIds.push(id);
      }
    }

    const vehicles = [
      { make: "Toyota", model: "Land Cruiser 79", year: 2019, vin: "JTM8R5EV5JD789012", licensePlate: "SL-82307-T", color: "White", mileage: 48000 },
      { make: "Toyota", model: "Hilux", year: 2018, vin: "JTM5R6EV7JD345678", licensePlate: "SL-58913-W", color: "White", mileage: 55000 },
      { make: "Toyota", model: "Land Cruiser Prado", year: 2016, vin: "JTM4R3EV1HD012345", licensePlate: "SL-25610-F", color: "White", mileage: 68000 },
      { make: "Toyota", model: "Vitz", year: 2014, vin: "JTM1R2EV5HD234567", licensePlate: "SL-51302-K", color: "Silver", mileage: 76000 },
      { make: "Honda", model: "Fit", year: 2017, vin: "JHM2R5EV5JD234568", licensePlate: "SL-47832-F", color: "Silver", mileage: 55000 },
    ];

    const vehicleIds: any[] = [];
    for (let i = 0; i < vehicles.length; i++) {
      const v = vehicles[i];
      const existing = await ctx.db.query("vehicles").withIndex("by_vin", (q) => q.eq("vin", v.vin)).first();
      if (existing) { vehicleIds.push(existing._id); } else {
        const id = await ctx.db.insert("vehicles", { ...v, orgId: orgId!, customerId: customerIds[i % customerIds.length], status: "active", notes: "" });
        vehicleIds.push(id);
      }
    }

    const parts = [
      { partNumber: "23670-30050", name: "Fuel Injector Set (4pcs)", category: "Engine", sellingPrice: 420, costPrice: 280, stockQuantity: 8, minStockLevel: 2, reorderPoint: 3, location: "A1-01" },
      { partNumber: "04111-28113", name: "Engine Gasket Kit", category: "Engine", sellingPrice: 180, costPrice: 95, stockQuantity: 12, minStockLevel: 2, reorderPoint: 5, location: "A1-02" },
      { partNumber: "48655-60040", name: "Front Suspension Bushing Kit", category: "Suspension", sellingPrice: 85, costPrice: 45, stockQuantity: 15, minStockLevel: 2, reorderPoint: 5, location: "B2-01" },
      { partNumber: "04465-0K240", name: "Front Brake Pads Set", category: "Brakes", sellingPrice: 65, costPrice: 30, stockQuantity: 24, minStockLevel: 2, reorderPoint: 10, location: "C3-01" },
      { partNumber: "04152-YZZA1", name: "Oil Filter", category: "Filters", sellingPrice: 12, costPrice: 5, stockQuantity: 50, minStockLevel: 2, reorderPoint: 20, location: "D4-01" },
    ];

    for (const p of parts) {
      const existing = await ctx.db.query("inventory").withIndex("by_partNumber", (q) => q.eq("partNumber", p.partNumber)).first();
      if (!existing) {
        await ctx.db.insert("inventory", { ...p, orgId: orgId!, brand: "OEM", condition: "new", isActive: true });
      }
    }

    const existingWOs = await ctx.db.query("workOrders").collect();
    if (existingWOs.length === 0) {
      const workOrders = [
        { status: "check-in", services: ["Engine Diagnostics"], priority: "high", customerComplaint: "Engine misfiring at high RPM" },
        { status: "in-progress", services: ["Brake Replacement"], priority: "normal", customerComplaint: "Front brakes worn" },
        { status: "waiting-parts", services: ["Timing Chain Replacement"], priority: "urgent", customerComplaint: "Waiting for kit" },
        { status: "complete", services: ["Oil Change"], priority: "low", customerComplaint: "Routine maintenance" },
        { status: "invoiced", services: ["A/C Service"], priority: "normal", customerComplaint: "A/C compressor serviced" },
      ];

      for (let i = 0; i < workOrders.length; i++) {
        const wo = workOrders[i];
        await ctx.db.insert("workOrders", {
          orgId: orgId!,
          jobNumber: `WO-${String(i + 1001).padStart(6, "0")}`,
          customerId: customerIds[i],
          vehicleId: vehicleIds[i],
          technicianId: userIds["tech@masscar.com"],
          status: wo.status as any,
          priority: wo.priority as any,
          services: wo.services,
          customerComplaint: wo.customerComplaint,
          checkinDate: new Date(Date.now() - (i * 86400000)).toISOString(),
        });
      }
    }

    return "Seeding successfully completed matching exact schema definitions.";
  },
});
