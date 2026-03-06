"use client"

import * as React from "react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useOrganization } from "@/components/providers/organization-provider"
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Users,
  Car,
  Wrench,
  Download,
  Calendar,
  BarChart3,
  ClipboardList,
  ArrowUpRight,
  ShieldCheck,
  Package
} from "lucide-react"
import { motion } from "framer-motion"

export default function ReportsDashboardPage() {
  const { organization } = useOrganization()
  const orgId = organization?.slug || "mass-hargeisa"

  // Live Convex Data
  const workOrders = useQuery(api.functions.getWorkOrders, { orgId })
  const invoices = useQuery(api.functions.getInvoices, { orgId })
  const customers = useQuery(api.functions.getCustomers, { orgId })
  const vehicles = useQuery(api.functions.getVehicles, { orgId })
  const inspections = useQuery(api.functions.getInspections, { orgId })
  const estimates = useQuery(api.functions.getEstimates, { orgId })
  const inventory = useQuery(api.functions.getInventory, { orgId })

  if (!organization) return null

  // Computed KPIs
  const totalRevenue = invoices?.reduce((s: number, inv: any) => s + (inv.totalAmount || 0), 0) || 0
  const totalCollected = invoices?.reduce((s: number, inv: any) => s + (inv.paidAmount || 0), 0) || 0
  const completedOrders = workOrders?.filter((wo: any) => wo.status === "completed").length || 0
  const activeOrders = workOrders?.filter((wo: any) => wo.status === "in-progress").length || 0
  const avgTicket = invoices && invoices.length > 0 ? Math.round(totalRevenue / invoices.length) : 0

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } }
  }
  const item: any = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-white uppercase italic">ANALYTICS HUB</h2>
          <p className="text-muted-foreground mt-1">
            Real-time business intelligence powered by live workshop data.
          </p>
        </div>
        <Button variant="outline" className="border-white/10 hover:bg-white/5 h-12 px-6">
          <Download className="mr-2 h-4 w-4" /> Export Report
        </Button>
      </div>

      {/* Financial KPIs */}
      <motion.div variants={container} initial="hidden" animate="show" className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <motion.div variants={item}>
          <Card className="border-white/5 bg-black/40 backdrop-blur-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-all"><DollarSign className="h-20 w-20 text-emerald-500" /></div>
            <CardContent className="p-6">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Total Invoiced</p>
              <h2 className="text-3xl font-black text-white mt-1">${totalRevenue.toLocaleString()}</h2>
              <div className="flex items-center gap-1 mt-2 text-emerald-500 text-xs">
                <TrendingUp className="h-3 w-3" /> Live from {invoices?.length || 0} invoices
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={item}>
          <Card className="border-white/5 bg-black/40 backdrop-blur-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-all"><ArrowUpRight className="h-20 w-20 text-amber-500" /></div>
            <CardContent className="p-6">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Collected</p>
              <h2 className="text-3xl font-black text-white mt-1">${totalCollected.toLocaleString()}</h2>
              <div className="flex items-center gap-1 mt-2 text-amber-500 text-xs">
                {totalRevenue > 0 ? Math.round((totalCollected / totalRevenue) * 100) : 0}% collection rate
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={item}>
          <Card className="border-white/5 bg-black/40 backdrop-blur-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-all"><Wrench className="h-20 w-20" /></div>
            <CardContent className="p-6">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Work Orders</p>
              <h2 className="text-3xl font-black text-white mt-1">{workOrders?.length || 0}</h2>
              <div className="flex items-center gap-2 mt-2 text-xs">
                <Badge variant="outline" className="text-emerald-500 border-emerald-500/20 text-[10px]">{completedOrders} done</Badge>
                <Badge variant="outline" className="text-amber-500 border-amber-500/20 text-[10px]">{activeOrders} active</Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="border-white/5 bg-black/40 backdrop-blur-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-all"><Users className="h-20 w-20" /></div>
            <CardContent className="p-6">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Avg Ticket</p>
              <h2 className="text-3xl font-black text-white mt-1">${avgTicket.toLocaleString()}</h2>
              <div className="flex items-center gap-1 mt-2 text-muted-foreground text-xs">
                Per invoice average
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Detailed Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-black/40 border border-white/5 p-1 rounded-2xl h-auto">
          <TabsTrigger value="overview" className="data-[state=active]:bg-amber-500 data-[state=active]:text-black rounded-xl px-6 py-3 font-bold">
            <BarChart3 className="h-4 w-4 mr-2" /> Overview
          </TabsTrigger>
          <TabsTrigger value="customers" className="data-[state=active]:bg-amber-500 data-[state=active]:text-black rounded-xl px-6 py-3 font-bold">
            <Users className="h-4 w-4 mr-2" /> Customers
          </TabsTrigger>
          <TabsTrigger value="fleet" className="data-[state=active]:bg-amber-500 data-[state=active]:text-black rounded-xl px-6 py-3 font-bold">
            <Car className="h-4 w-4 mr-2" /> Fleet
          </TabsTrigger>
          <TabsTrigger value="inventory" className="data-[state=active]:bg-amber-500 data-[state=active]:text-black rounded-xl px-6 py-3 font-bold">
            <Package className="h-4 w-4 mr-2" /> Inventory
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Module Health */}
            <Card className="border-white/5 bg-black/40 backdrop-blur-xl shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
              <CardHeader>
                <CardTitle className="text-lg font-bold">Module Health</CardTitle>
                <CardDescription>Real-time status of all workshop modules</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: "Customers", count: customers?.length || 0, icon: Users, color: "text-blue-500" },
                  { name: "Vehicles", count: vehicles?.length || 0, icon: Car, color: "text-purple-500" },
                  { name: "Work Orders", count: workOrders?.length || 0, icon: Wrench, color: "text-amber-500" },
                  { name: "Estimates", count: estimates?.length || 0, icon: ClipboardList, color: "text-cyan-500" },
                  { name: "Invoices", count: invoices?.length || 0, icon: DollarSign, color: "text-emerald-500" },
                  { name: "Inspections", count: inspections?.length || 0, icon: ShieldCheck, color: "text-red-500" },
                ].map(mod => {
                  const ModIcon = mod.icon
                  return (
                    <div key={mod.name} className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all">
                      <div className="flex items-center gap-3">
                        <ModIcon className={`h-5 w-5 ${mod.color}`} />
                        <span className="font-medium text-white text-sm">{mod.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-black text-white">{mod.count}</span>
                        <span className="text-[10px] text-muted-foreground">records</span>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            {/* Recent Work Orders */}
            <Card className="border-white/5 bg-black/40 backdrop-blur-xl shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
              <CardHeader>
                <CardTitle className="text-lg font-bold">Recent Work Orders</CardTitle>
                <CardDescription>Latest service activity</CardDescription>
              </CardHeader>
              <CardContent>
                {workOrders && workOrders.length > 0 ? (
                  <div className="space-y-3">
                    {workOrders.slice(0, 6).map((wo: any) => (
                      <div key={wo._id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all">
                        <div>
                          <p className="font-bold text-white text-sm">{wo.orderNumber || wo._id.slice(0,8)}</p>
                          <p className="text-[10px] text-muted-foreground uppercase">{wo.serviceType || "Service"}</p>
                        </div>
                        <Badge 
                          variant="outline" 
                          className={
                            wo.status === "completed" ? "border-emerald-500/20 text-emerald-500" :
                            wo.status === "in-progress" ? "border-amber-500/20 text-amber-500" :
                            "border-white/10"
                          }
                        >
                          {wo.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 text-muted-foreground">
                    <Wrench className="h-12 w-12 mx-auto mb-3 opacity-10" />
                    <p>No work orders yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Customers Tab */}
        <TabsContent value="customers">
          <Card className="border-white/5 bg-black/40 backdrop-blur-xl shadow-2xl">
            <CardHeader>
              <CardTitle>Customer Directory</CardTitle>
              <CardDescription>{customers?.length || 0} registered customers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-2xl border border-white/5 overflow-hidden">
                <Table>
                  <TableHeader className="bg-white/5">
                    <TableRow className="border-white/5">
                      <TableHead className="text-xs uppercase">Customer</TableHead>
                      <TableHead className="text-xs uppercase">Phone</TableHead>
                      <TableHead className="text-xs uppercase">Email</TableHead>
                      <TableHead className="text-xs uppercase text-right">Vehicles</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customers?.slice(0, 10).map((c: any) => (
                      <TableRow key={c._id} className="border-white/5 hover:bg-white/5">
                        <TableCell className="font-bold text-white">{c.firstName} {c.lastName}</TableCell>
                        <TableCell className="text-sm">{c.phone || "—"}</TableCell>
                        <TableCell className="text-sm">{c.email || "—"}</TableCell>
                        <TableCell className="text-right">
                          <Badge variant="outline" className="border-white/10">{vehicles?.filter((v: any) => v.customerId === c._id).length || 0}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Fleet Tab */}
        <TabsContent value="fleet">
          <Card className="border-white/5 bg-black/40 backdrop-blur-xl shadow-2xl">
            <CardHeader>
              <CardTitle>Fleet Overview</CardTitle>
              <CardDescription>{vehicles?.length || 0} vehicles in database</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-2xl border border-white/5 overflow-hidden">
                <Table>
                  <TableHeader className="bg-white/5">
                    <TableRow className="border-white/5">
                      <TableHead className="text-xs uppercase">Vehicle</TableHead>
                      <TableHead className="text-xs uppercase">Plate</TableHead>
                      <TableHead className="text-xs uppercase">VIN</TableHead>
                      <TableHead className="text-xs uppercase text-right">Mileage</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vehicles?.slice(0, 10).map((v: any) => (
                      <TableRow key={v._id} className="border-white/5 hover:bg-white/5">
                        <TableCell className="font-bold text-white">{v.year} {v.make} {v.model}</TableCell>
                        <TableCell><Badge variant="outline" className="border-amber-500/20 text-amber-500">{v.licensePlate}</Badge></TableCell>
                        <TableCell className="text-xs text-muted-foreground font-mono">{v.vin?.slice(0,12) || "—"}...</TableCell>
                        <TableCell className="text-right font-bold">{v.mileage?.toLocaleString() || 0} km</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Inventory Tab */}
        <TabsContent value="inventory">
          <Card className="border-white/5 bg-black/40 backdrop-blur-xl shadow-2xl">
            <CardHeader>
              <CardTitle>Inventory Snapshot</CardTitle>
              <CardDescription>{inventory?.length || 0} parts/materials in stock</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-2xl border border-white/5 overflow-hidden">
                <Table>
                  <TableHeader className="bg-white/5">
                    <TableRow className="border-white/5">
                      <TableHead className="text-xs uppercase">Part</TableHead>
                      <TableHead className="text-xs uppercase">Category</TableHead>
                      <TableHead className="text-xs uppercase text-center">Stock</TableHead>
                      <TableHead className="text-xs uppercase text-right">Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inventory?.slice(0, 10).map((part: any) => (
                      <TableRow key={part._id} className="border-white/5 hover:bg-white/5">
                        <TableCell>
                          <div>
                            <p className="font-bold text-white">{part.name}</p>
                            <p className="text-[10px] text-muted-foreground">{part.partNumber}</p>
                          </div>
                        </TableCell>
                        <TableCell><Badge variant="outline" className="border-white/10 text-xs">{part.category}</Badge></TableCell>
                        <TableCell className="text-center">
                          <span className={`font-bold ${part.stockQuantity <= part.minStockLevel ? "text-red-500" : "text-white"}`}>
                            {part.stockQuantity}
                          </span>
                        </TableCell>
                        <TableCell className="text-right font-bold text-emerald-500">
                          ${((part.sellingPrice || 0) * (part.stockQuantity || 0)).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
