import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getDashboardStats = query({
  args: {},
  handler: async (ctx) => {
    const vehicles = await ctx.db.query("vehicles").collect();
    const customers = await ctx.db.query("customers").collect();
    const inventory = await ctx.db.query("inventory").collect();
    const workOrders = await ctx.db.query("workOrders").collect();
    const sales = await ctx.db.query("sales").collect();
    
    // Today's data
    const today = new Date().toISOString().split("T")[0];
    const todaySales = sales.filter((s) => s.createdAt.startsWith(today));
    const todayRevenue = todaySales.reduce((sum, s) => sum + s.totalAmount, 0);
    
    // Inventory stats
    const totalParts = inventory.reduce((sum, item) => sum + item.stockQuantity, 0);
    const lowStockItems = inventory.filter((item) => item.stockQuantity <= item.reorderPoint);
    
    // Work order stats
    const activeWorkOrders = workOrders.filter(
      (wo) => !["complete", "invoiced", "cancelled"].includes(wo.status)
    );
    const completedToday = workOrders.filter(
      (wo) => wo.completedAt?.startsWith(today)
    );
    
    return {
      totalVehicles: vehicles.length,
      vehiclesInService: vehicles.filter((v) => v.status === "in-service").length,
      totalCustomers: customers.length,
      totalParts,
      lowStockCount: lowStockItems.length,
      activeWorkOrders: activeWorkOrders.length,
      completedToday: completedToday.length,
      todayRevenue,
      todaySalesCount: todaySales.length,
    };
  },
});

export const getChartStats = query({
  args: { orgId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    // Collect specific tables
    const workOrders = await ctx.db.query("workOrders").collect();
    const sales = await ctx.db.query("sales").collect();
    const invoices = await ctx.db.query("invoices").collect();

    // 1. Revenue trend over months (current year)
    // We group sales totalAmounts by month (Jan-Dec) 
    const currentYear = new Date().getFullYear();
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const revenueData = months.map(m => ({ month: m, revenue: 0, expenses: 0 }));

    sales.forEach(sale => {
      const date = new Date(sale.createdAt); // createdAt is ISO string
      if (date.getFullYear() === currentYear) {
        revenueData[date.getMonth()].revenue += sale.totalAmount;
      }
    });
    
    // Add work order revenue (invoiced total) via Invoices table
    invoices.forEach(inv => {
      if (inv.status === "paid") {
        const date = new Date(inv._creationTime);
        if (date.getFullYear() === currentYear) {
           revenueData[date.getMonth()].revenue += inv.paidAmount || inv.totalAmount;
        }
      }
    });

    // Mock expenses at 40% margin roughly for demo scaling
    revenueData.forEach(m => {
      m.expenses = m.revenue > 0 ? m.revenue * 0.4 : 0;
    });

    // 2. Work Order Status Data
    const statusCounts = {
      "in-progress": 0,
      "waiting-parts": 0,
      "complete": 0,
      "check-in": 0,
      "invoiced": 0
    };
    workOrders.forEach(wo => {
      if (wo.status === "in-progress" || wo.status === "diagnosis" || wo.status === "awaiting-approval") statusCounts["in-progress"]++;
      else if (wo.status === "waiting-parts") statusCounts["waiting-parts"]++;
      else if (wo.status === "quality-check" || wo.status === "complete") statusCounts["complete"]++;
      else if (wo.status === "check-in") statusCounts["check-in"]++;
      else if (wo.status === "invoiced") statusCounts["invoiced"]++;
    });

    const workOrderStatusData = [
      { name: "In Progress", value: statusCounts["in-progress"], color: "#3B82F6" },
      { name: "Awaiting Parts", value: statusCounts["waiting-parts"], color: "#F59E0B" },
      { name: "Completed", value: statusCounts["complete"], color: "#10B981" },
      { name: "Check-In", value: statusCounts["check-in"], color: "#8B5CF6" },
      { name: "Invoiced", value: statusCounts["invoiced"], color: "#06B6D4" },
    ].filter(s => s.value > 0);

    // 3. Weekly Repairs Data
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const weeklyRepairs = days.map(d => ({ day: d, repairs: 0 }));
    
    // get days of the current week
    const now = new Date();
    workOrders.forEach(wo => {
      if (wo.status === "complete" || wo.status === "invoiced") {
        if (wo.completedAt) {
          const date = new Date(wo.completedAt);
          // Check if it's within the last 7 days
          if ((now.getTime() - date.getTime()) / (1000 * 3600 * 24) < 7) {
            weeklyRepairs[date.getDay()].repairs += 1;
          }
        }
      }
    });
    
    // Sort array so Sun is first
    // Actually our static data is Mon-Sun
    const sortedRepairs = [...weeklyRepairs.slice(1), weeklyRepairs[0]];

    return {
      revenueData,
      workOrderStatusData,
      weeklyRepairs: sortedRepairs
    };
  }
});
