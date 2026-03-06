"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { motion } from "framer-motion"
import {
  Users,
  Car,
  Wrench,
  ShoppingCart,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  TrendingUp,
  CreditCard,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Package,
  CalendarDays,
  Activity,
  Zap,
  Timer,
  BarChart3,
  Sparkles,
} from "lucide-react"
import { useState } from "react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts"
import { useConvexAuth } from "@/components/auth/convex-auth-provider"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useOrganization } from "@/components/providers/organization-provider"
import Link from "next/link"

// ═══════════════════════════════════════════════
// ANIMATION VARIANTS
// ═══════════════════════════════════════════════
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
}

const kpiVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
      delay: i * 0.1,
    },
  }),
  hover: {
    y: -4,
    scale: 1.02,
    transition: { type: "spring", stiffness: 400, damping: 15 },
  },
}

// ═══════════════════════════════════════════════
// CHART DATA
// ═══════════════════════════════════════════════
const revenueData = [
  { month: "Jan", revenue: 12400, expenses: 8200 },
  { month: "Feb", revenue: 14800, expenses: 9100 },
  { month: "Mar", revenue: 13200, expenses: 8800 },
  { month: "Apr", revenue: 16500, expenses: 10200 },
  { month: "May", revenue: 18200, expenses: 11400 },
  { month: "Jun", revenue: 15900, expenses: 9800 },
  { month: "Jul", revenue: 17400, expenses: 10600 },
  { month: "Aug", revenue: 19100, expenses: 11800 },
  { month: "Sep", revenue: 16800, expenses: 10100 },
  { month: "Oct", revenue: 20200, expenses: 12400 },
  { month: "Nov", revenue: 18600, expenses: 11200 },
  { month: "Dec", revenue: 22100, expenses: 13500 },
]

const workOrderStatusData = [
  { name: "In Progress", value: 8, color: "#3B82F6" },
  { name: "Awaiting Parts", value: 5, color: "#F59E0B" },
  { name: "Completed", value: 24, color: "#10B981" },
  { name: "Check-In", value: 3, color: "#8B5CF6" },
  { name: "Invoiced", value: 12, color: "#06B6D4" },
]

const weeklyRepairs = [
  { day: "Mon", repairs: 8 },
  { day: "Tue", repairs: 12 },
  { day: "Wed", repairs: 10 },
  { day: "Thu", repairs: 14 },
  { day: "Fri", repairs: 9 },
  { day: "Sat", repairs: 6 },
  { day: "Sun", repairs: 2 },
]

// ═══════════════════════════════════════════════
// KPI CARD COMPONENT
// ═══════════════════════════════════════════════
interface KPICardProps {
  title: string
  value: string | number
  change?: string
  changeType?: "positive" | "negative" | "neutral"
  icon: React.ElementType
  gradient: string
  index: number
  href?: string
}

function KPICard({ title, value, change, changeType = "positive", icon: Icon, gradient, index, href }: KPICardProps) {
  const content = (
    <motion.div
      custom={index}
      variants={kpiVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className="cursor-pointer"
    >
      <Card className={`relative overflow-hidden border-0 shadow-lg ${gradient} text-white group`}>
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-8 translate-x-8" />
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full translate-y-6 -translate-x-6" />

        <CardContent className="p-5 relative z-10">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <p className="text-sm font-medium text-white/80 uppercase tracking-wider">{title}</p>
              <h3 className="text-3xl font-bold tracking-tight">{value}</h3>
              {change && (
                <div className="flex items-center gap-1 text-sm">
                  {changeType === "positive" ? (
                    <ArrowUpRight className="w-4 h-4 text-emerald-300" />
                  ) : changeType === "negative" ? (
                    <ArrowDownRight className="w-4 h-4 text-red-300" />
                  ) : null}
                  <span className={changeType === "positive" ? "text-emerald-300" : changeType === "negative" ? "text-red-300" : "text-white/70"}>
                    {change}
                  </span>
                </div>
              )}
            </div>
            <div className="h-14 w-14 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Icon className="h-7 w-7 text-white" />
            </div>
          </div>
        </CardContent>

        {/* Bottom bar */}
        <div className="bg-black/10 px-5 py-2 flex items-center justify-between text-xs font-medium text-white/70 group-hover:text-white transition-colors">
          <span>View Details</span>
          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
        </div>
      </Card>
    </motion.div>
  )

  if (href) {
    return <Link href={href}>{content}</Link>
  }
  return content
}

// ═══════════════════════════════════════════════
// RECENT ACTIVITY
// ═══════════════════════════════════════════════
const recentActivity = [
  { action: "Work order #WO-2847 completed", time: "2 min ago", type: "success", icon: CheckCircle2 },
  { action: "New vehicle checked in — Toyota Hilux 2018", time: "15 min ago", type: "info", icon: Car },
  { action: "Low stock alert — Front Brake Pads", time: "1 hr ago", type: "warning", icon: AlertTriangle },
  { action: "Invoice #INV-1042 paid — $1,240", time: "2 hrs ago", type: "success", icon: DollarSign },
  { action: "Appointment booked — Mohamed Ibrahim", time: "3 hrs ago", type: "info", icon: CalendarDays },
  { action: "DVI inspection completed — RAV4", time: "4 hrs ago", type: "success", icon: ClipboardCheck },
]

import { ClipboardCheck } from "lucide-react"

// ═══════════════════════════════════════════════
// MAIN DASHBOARD COMPONENT
// ═══════════════════════════════════════════════
export function Dashboard({ orgId }: { orgId?: string }) {
  const { user } = useConvexAuth()
  const { organization } = useOrganization()
  const isOwner = user?.role === "admin" || user?.email === "owner@masscar.com"

  // Convex live queries
  const org = organization?._id || orgId || ""
  const customers = useQuery(api.functions.getCustomers, { orgId: org })
  const vehicles = useQuery(api.functions.getVehicles, { orgId: org })
  const workOrders = useQuery(api.functions.getWorkOrders, { orgId: org })
  const inventory = useQuery(api.functions.getInventory, { orgId: org })

  // Computed stats
  const totalCustomers = customers?.length ?? 0
  const totalVehicles = vehicles?.length ?? 0
  const activeWorkOrders = workOrders?.filter((wo: any) =>
    ["check-in", "inspecting", "in-progress", "awaiting-approval", "waiting-parts"].includes(wo.status)
  ).length ?? 0
  const totalParts = inventory?.reduce((sum: number, item: any) => sum + (item.stockQuantity ?? 0), 0) ?? 0
  const lowStockParts = inventory?.filter((item: any) => (item.stockQuantity ?? 0) <= (item.reorderPoint ?? 0)).length ?? 0

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-700 text-sm">
          <p className="font-semibold mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ background: entry.color }} />
              {entry.name}: ${entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* ─── Header ─── */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-3">
            <Sparkles className="h-6 w-6 text-orange-500" />
            Command Center
            {isOwner && (
              <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/30 text-xs font-semibold">
                Executive View
              </Badge>
            )}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time workshop performance • {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-card px-3 py-1.5 rounded-full border">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            System Live
          </div>
          <Link href="/dashboard/work-orders">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20 gap-2">
              <Zap className="h-4 w-4" /> New Work Order
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* ─── Owner Financial Row ─── */}
      {isOwner && (
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-slate-700">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">Total Revenue (YTD)</p>
                <h3 className="text-3xl font-bold text-emerald-400 mt-1">$205,200</h3>
                <p className="text-xs text-emerald-500 flex items-center mt-2 gap-1">
                  <TrendingUp className="w-3 h-3" /> +18.5% vs last year
                </p>
              </div>
              <div className="h-12 w-12 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-emerald-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-slate-700">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">Net Profit (Est.)</p>
                <h3 className="text-3xl font-bold text-blue-400 mt-1">$68,200</h3>
                <p className="text-xs text-blue-400 flex items-center mt-2 gap-1">
                  33.2% Margin
                </p>
              </div>
              <div className="h-12 w-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-slate-700">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">Outstanding Invoices</p>
                <h3 className="text-3xl font-bold text-amber-400 mt-1">$4,120</h3>
                <p className="text-xs text-amber-500 flex items-center mt-2 gap-1">
                  <AlertTriangle className="w-3 h-3" /> 5 Overdue
                </p>
              </div>
              <div className="h-12 w-12 bg-amber-500/10 rounded-xl flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-amber-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* ─── KPI Cards ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Active Work Orders"
          value={activeWorkOrders}
          change="+3 today"
          changeType="positive"
          icon={Wrench}
          gradient="bg-gradient-to-br from-blue-600 to-blue-700"
          index={0}
          href="/dashboard/work-orders"
        />
        <KPICard
          title="Customers"
          value={totalCustomers}
          change="+12 this month"
          changeType="positive"
          icon={Users}
          gradient="bg-gradient-to-br from-orange-500 to-orange-600"
          index={1}
          href="/dashboard/customers"
        />
        <KPICard
          title="Vehicles"
          value={totalVehicles}
          change="Fleet registry"
          changeType="neutral"
          icon={Car}
          gradient="bg-gradient-to-br from-emerald-500 to-emerald-600"
          index={2}
          href="/dashboard/vehicles"
        />
        <KPICard
          title="Parts in Stock"
          value={totalParts}
          change={lowStockParts > 0 ? `${lowStockParts} low stock` : "Stock healthy"}
          changeType={lowStockParts > 0 ? "negative" : "positive"}
          icon={Package}
          gradient="bg-gradient-to-br from-purple-500 to-purple-600"
          index={3}
          href="/dashboard/inventory"
        />
      </div>

      {/* ─── Charts Row ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trend */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="shadow-sm border">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-muted-foreground" />
                  <CardTitle className="text-lg font-semibold">Revenue Overview</CardTitle>
                </div>
                <Badge variant="outline" className="text-xs">2025</Badge>
              </div>
              <CardDescription>Monthly revenue vs expenses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F97316" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#F97316" strokeWidth={2.5} fill="url(#colorRevenue)" />
                    <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#3B82F6" strokeWidth={2} fill="url(#colorExpenses)" strokeDasharray="4 4" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Work Order Status Donut */}
        <motion.div variants={itemVariants}>
          <Card className="shadow-sm border h-full">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-lg font-semibold">Work Order Status</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={workOrderStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={78}
                      paddingAngle={3}
                      dataKey="value"
                      startAngle={90}
                      endAngle={-270}
                      stroke="none"
                    >
                      {workOrderStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                  <span className="text-2xl font-bold text-foreground">52</span>
                  <p className="text-xs text-muted-foreground">Total</p>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                {workOrderStatusData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ background: item.color }} />
                      <span className="text-muted-foreground">{item.name}</span>
                    </div>
                    <span className="font-semibold text-foreground">{item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* ─── Bottom Row: Activity + Weekly Repairs ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <motion.div variants={itemVariants}>
          <Card className="shadow-sm border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
                </div>
                <Badge variant="outline" className="text-xs">Live</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-1">
              {recentActivity.map((item, i) => {
                const Icon = item.icon
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.08 }}
                    className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/50 transition-colors group"
                  >
                    <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${
                      item.type === "success" ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" :
                      item.type === "warning" ? "bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400" :
                      "bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
                    }`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{item.action}</p>
                      <p className="text-xs text-muted-foreground">{item.time}</p>
                    </div>
                  </motion.div>
                )
              })}
            </CardContent>
          </Card>
        </motion.div>

        {/* Weekly Repairs Bar Chart */}
        <motion.div variants={itemVariants}>
          <Card className="shadow-sm border h-full">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Timer className="h-5 w-5 text-muted-foreground" />
                  <CardTitle className="text-lg font-semibold">Weekly Repairs</CardTitle>
                </div>
                <Badge variant="outline" className="text-xs">This Week</Badge>
              </div>
              <CardDescription>Completed repairs per day</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[260px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyRepairs} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{
                        background: "hsl(222 47% 11%)",
                        border: "1px solid hsl(217 33% 17%)",
                        borderRadius: "12px",
                        color: "white",
                        fontSize: "13px",
                      }}
                    />
                    <Bar
                      dataKey="repairs"
                      fill="#F97316"
                      radius={[8, 8, 0, 0]}
                      maxBarSize={40}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* ─── Quick Stats Footer ─── */}
      <motion.div variants={itemVariants}>
        <Card className="border bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3">
                <p className="text-2xl font-bold text-foreground">98.2%</p>
                <p className="text-xs text-muted-foreground mt-1">Customer Satisfaction</p>
              </div>
              <div className="text-center p-3">
                <p className="text-2xl font-bold text-foreground">2.4 hrs</p>
                <p className="text-xs text-muted-foreground mt-1">Avg. Repair Time</p>
              </div>
              <div className="text-center p-3">
                <p className="text-2xl font-bold text-foreground">12</p>
                <p className="text-xs text-muted-foreground mt-1">Active Technicians</p>
              </div>
              <div className="text-center p-3">
                <p className="text-2xl font-bold text-foreground">$342</p>
                <p className="text-xs text-muted-foreground mt-1">Avg. Ticket Value</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
