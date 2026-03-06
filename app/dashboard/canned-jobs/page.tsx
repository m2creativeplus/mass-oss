"use client"

import * as React from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useOrganization } from "@/components/providers/organization-provider"
import { 
  Plus, 
  Wrench,
  Search,
  DollarSign,
  Clock,
  Package,
  Star,
  Settings,
  ChevronRight,
  Zap
} from "lucide-react"
import { useState } from "react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default function CannedJobsPage() {
  const { organization } = useOrganization()
  const orgId = organization?.slug || "mass-hargeisa"
  
  const cannedJobs = useQuery(api.functions.getCannedJobs, { orgId })
  const createCannedJob = useMutation(api.functions.createCannedJob)
  
  const [searchTerm, setSearchTerm] = useState("")
  const [showCreate, setShowCreate] = useState(false)
  const [newJob, setNewJob] = useState({
    name: "",
    category: "Maintenance",
    laborHours: 1,
    laborRate: 50,
    parts: [] as { name: string; partNumber: string; quantity: number; unitCost: number }[],
  })

  if (!organization) return null

  const filtered = cannedJobs?.filter(j => 
    (j as any).name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (j as any).category?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || []

  const handleCreate = async () => {
    if (!newJob.name) {
      toast.error("Please enter a job name")
      return
    }
    try {
      await createCannedJob({
        orgId,
        name: newJob.name,
        category: newJob.category,
        laborHours: newJob.laborHours,
        laborRate: newJob.laborRate,
        parts: newJob.parts,
      } as any)
      toast.success("Canned job created!")
      setShowCreate(false)
      setNewJob({ name: "", category: "Maintenance", laborHours: 1, laborRate: 50, parts: [] })
    } catch (error) {
      toast.error("Failed to create canned job")
    }
  }

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } }
  }
  const item: any = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  }

  // Pre-built categories for empty state
  const PRESET_PACKAGES = [
    { name: "Oil Change - Synthetic", hours: 0.5, price: 49, icon: "🛢️", category: "Maintenance" },
    { name: "Brake Pad Replacement (Front)", hours: 1.5, price: 199, icon: "🔧", category: "Brakes" },
    { name: "Full Multi-Point Inspection", hours: 1.0, price: 89, icon: "🔍", category: "Inspection" },
    { name: "AC Recharge & Leak Test", hours: 1.0, price: 129, icon: "❄️", category: "Climate" },
    { name: "Tire Rotation + Balance", hours: 0.5, price: 59, icon: "🔄", category: "Tires" },
    { name: "Engine Diagnostic Scan", hours: 0.5, price: 75, icon: "💻", category: "Diagnostics" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-white uppercase italic">CANNED JOBS</h2>
          <p className="text-muted-foreground mt-1">
            Pre-configured service packages with parts and labor pricing.
          </p>
        </div>
        <Dialog open={showCreate} onOpenChange={setShowCreate}>
          <DialogTrigger asChild>
            <Button className="bg-amber-500 hover:bg-amber-600 text-black font-black uppercase tracking-widest shadow-lg shadow-amber-500/20 px-8 h-12">
              <Plus className="mr-2 h-5 w-5" /> Create Package
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-zinc-900 border-white/10 max-w-xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-black">New Canned Job</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Job Name</Label>
                <Input 
                  value={newJob.name} 
                  onChange={e => setNewJob({...newJob, name: e.target.value})}
                  placeholder="e.g. Full Synthetic Oil Change"
                  className="bg-white/5 border-white/10"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Input 
                    value={newJob.category} 
                    onChange={e => setNewJob({...newJob, category: e.target.value})}
                    className="bg-white/5 border-white/10"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Labor Hours</Label>
                  <Input 
                    type="number" 
                    value={newJob.laborHours} 
                    onChange={e => setNewJob({...newJob, laborHours: parseFloat(e.target.value)})}
                    className="bg-white/5 border-white/10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Labor Rate ($/hr)</Label>
                <Input 
                  type="number" 
                  value={newJob.laborRate} 
                  onChange={e => setNewJob({...newJob, laborRate: parseFloat(e.target.value)})}
                  className="bg-white/5 border-white/10"
                />
              </div>
              <Button onClick={handleCreate} className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold h-12">
                Save Package
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* KPI Cards */}
      <motion.div variants={container} initial="hidden" animate="show" className="grid gap-4 md:grid-cols-3">
        <motion.div variants={item}>
          <Card className="border-white/5 bg-black/40 backdrop-blur-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-all"><Package className="h-20 w-20" /></div>
            <CardContent className="p-6">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Total Packages</p>
              <h2 className="text-4xl font-black text-white mt-1">{cannedJobs?.length || 0}</h2>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={item}>
          <Card className="border-white/5 bg-black/40 backdrop-blur-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-all"><Clock className="h-20 w-20 text-amber-500" /></div>
            <CardContent className="p-6">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Avg Labor Hours</p>
              <h2 className="text-4xl font-black text-white mt-1">
                {cannedJobs && cannedJobs.length > 0
                  ? ((cannedJobs as any[]).reduce((s, j) => s + (j.laborHours || 0), 0) / cannedJobs.length).toFixed(1)
                  : "0"}h
              </h2>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={item}>
          <Card className="border-white/5 bg-black/40 backdrop-blur-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-all"><DollarSign className="h-20 w-20 text-emerald-500" /></div>
            <CardContent className="p-6">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Avg Package Price</p>
              <h2 className="text-4xl font-black text-white mt-1">
                ${cannedJobs && cannedJobs.length > 0
                  ? Math.round((cannedJobs as any[]).reduce((s, j) => s + (j.totalPrice || 0), 0) / cannedJobs.length)
                  : "0"}
              </h2>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search packages..." 
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="bg-white/5 border-white/5 pl-10 h-12 rounded-xl"
        />
      </div>

      {/* Jobs Table or Preset Cards */}
      {cannedJobs === undefined ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="space-y-6">
          <div className="text-center py-10 text-muted-foreground">
            <Package className="h-16 w-16 mx-auto mb-4 opacity-10" />
            <p className="text-lg font-bold">No canned jobs yet</p>
            <p className="text-sm">Quick-start with these popular packages:</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {PRESET_PACKAGES.map((pkg, i) => (
              <Card key={i} className="border-white/5 bg-black/40 backdrop-blur-xl hover:bg-white/5 transition-all cursor-pointer group"
                onClick={async () => {
                  try {
                    await createCannedJob({
                      orgId, name: pkg.name, category: pkg.category, laborHours: pkg.hours, laborRate: 50, parts: []
                    } as any)
                    toast.success(`Added "${pkg.name}"`)
                  } catch { toast.error("Failed to add") }
                }}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{pkg.icon}</span>
                    <div>
                      <h3 className="font-bold text-white group-hover:text-amber-500 transition-colors">{pkg.name}</h3>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{pkg.category}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/5">
                    <span className="text-lg font-black text-emerald-500">${pkg.price}</span>
                    <span className="text-xs text-muted-foreground">{pkg.hours}h labor</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <Card className="border-white/5 bg-black/40 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
          <CardContent className="p-0">
            <div className="rounded-2xl overflow-hidden">
              <Table>
                <TableHeader className="bg-white/5">
                  <TableRow className="border-white/5 hover:bg-transparent">
                    <TableHead className="text-xs uppercase py-4">Package</TableHead>
                    <TableHead className="text-xs uppercase py-4">Category</TableHead>
                    <TableHead className="text-xs uppercase py-4 text-center">Labor</TableHead>
                    <TableHead className="text-xs uppercase py-4 text-right">Price</TableHead>
                    <TableHead className="text-xs uppercase py-4 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((job: any) => (
                    <TableRow key={job._id} className="border-white/5 hover:bg-white/5 transition-all">
                      <TableCell className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/10">
                            <Wrench className="h-4 w-4 text-amber-500" />
                          </div>
                          <div>
                            <p className="font-bold text-white">{job.name}</p>
                            {job.description && <p className="text-[10px] text-muted-foreground">{job.description}</p>}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-white/10 text-xs">{job.category}</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="text-sm font-bold">{job.laborHours || 0}h</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="text-lg font-black text-emerald-500">${job.totalPrice || 0}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="ghost" className="hover:bg-amber-500/10 hover:text-amber-500">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
