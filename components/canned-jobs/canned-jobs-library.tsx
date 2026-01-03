"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { 
  Plus, 
  Search, 
  Wrench, 
  Clock, 
  DollarSign,
  Package,
  Edit,
  Trash2,
  Filter,
  Tag,
  Car
} from "lucide-react"

// Mock data - in production, use useQuery(api.functions.getCannedJobs)
const mockCannedJobs = [
  {
    _id: "1",
    name: "Oil Change - Synthetic",
    code: "OIL-SYN-001",
    description: "Full synthetic oil change with filter replacement",
    category: "Maintenance",
    laborHours: 0.5,
    laborRate: 50,
    parts: [
      { name: "Synthetic Oil 5W-30 (5L)", quantity: 1, unitPrice: 8500 },
      { name: "Oil Filter", quantity: 1, unitPrice: 1500 },
    ],
    totalLaborCost: 2500,
    totalPartsCost: 10000,
    totalPrice: 12500,
    applicableVehicles: ["Toyota", "Suzuki", "Honda"],
    isPackageDeal: true,
    packageDiscount: 10,
    isActive: true,
  },
  {
    _id: "2",
    name: "Brake Pad Replacement - Front",
    code: "BRK-PAD-F01",
    description: "Replace front brake pads including inspection",
    category: "Brakes",
    laborHours: 1.5,
    laborRate: 50,
    parts: [
      { name: "Front Brake Pads (Set)", quantity: 1, unitPrice: 15000 },
    ],
    totalLaborCost: 7500,
    totalPartsCost: 15000,
    totalPrice: 22500,
    applicableVehicles: ["Toyota Land Cruiser", "Toyota Hilux"],
    isPackageDeal: false,
    isActive: true,
  },
  {
    _id: "3",
    name: "AC Service & Recharge",
    code: "AC-SVC-001",
    description: "Full AC system check, cleaning, and refrigerant recharge",
    category: "Climate",
    laborHours: 1,
    laborRate: 50,
    parts: [
      { name: "R134a Refrigerant", quantity: 1, unitPrice: 5000 },
      { name: "AC Cleaning Solution", quantity: 1, unitPrice: 2000 },
    ],
    totalLaborCost: 5000,
    totalPartsCost: 7000,
    totalPrice: 12000,
    applicableVehicles: [],
    isPackageDeal: false,
    isActive: true,
  },
  {
    _id: "4",
    name: "Full Service Package",
    code: "SVC-FULL-001",
    description: "Complete vehicle service: oil, filters, fluids check, inspection",
    category: "Maintenance",
    laborHours: 2,
    laborRate: 50,
    parts: [
      { name: "Synthetic Oil 5W-30 (5L)", quantity: 1, unitPrice: 8500 },
      { name: "Oil Filter", quantity: 1, unitPrice: 1500 },
      { name: "Air Filter", quantity: 1, unitPrice: 3000 },
      { name: "Cabin Filter", quantity: 1, unitPrice: 2500 },
    ],
    totalLaborCost: 10000,
    totalPartsCost: 15500,
    totalPrice: 22950, // With 10% discount
    applicableVehicles: [],
    isPackageDeal: true,
    packageDiscount: 10,
    isActive: true,
  },
]

const categories = ["All", "Maintenance", "Brakes", "Climate", "Suspension", "Engine", "Electrical"]

export function CannedJobsLibrary() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingJob, setEditingJob] = useState<typeof mockCannedJobs[0] | null>(null)

  const filteredJobs = mockCannedJobs.filter(job => {
    const matchesSearch = 
      job.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All" || job.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString()} SL`
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Canned Jobs Library</h1>
          <p className="text-muted-foreground">Pre-built service packages for faster estimates</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-orange-500 hover:bg-orange-600">
              <Plus className="h-4 w-4 mr-2" />
              New Canned Job
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Canned Job</DialogTitle>
              <DialogDescription>
                Build a reusable service package with labor and parts
              </DialogDescription>
            </DialogHeader>
            <CannedJobForm onClose={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                <Package className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockCannedJobs.length}</p>
                <p className="text-xs text-muted-foreground">Total Jobs</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <Tag className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockCannedJobs.filter(j => j.isPackageDeal).length}</p>
                <p className="text-xs text-muted-foreground">Package Deals</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Wrench className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{categories.length - 1}</p>
                <p className="text-xs text-muted-foreground">Categories</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{formatCurrency(Math.round(mockCannedJobs.reduce((sum, j) => sum + j.totalPrice, 0) / mockCannedJobs.length))}</p>
                <p className="text-xs text-muted-foreground">Avg. Price</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search canned jobs..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {categories.slice(0, 5).map(cat => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              size="sm"
              className={selectedCategory === cat ? "bg-orange-500 hover:bg-orange-600" : ""}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {filteredJobs.map((job) => (
          <Card key={job._id} className="glass-card hover:shadow-lg transition-all duration-200">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">{job.name}</CardTitle>
                    {job.isPackageDeal && (
                      <Badge className="bg-emerald-500 text-white">
                        {job.packageDiscount}% OFF
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="mt-1">
                    {job.code} • {job.category}
                  </CardDescription>
                </div>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" className="h-8 w-8">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500 hover:text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{job.description}</p>
              
              {/* Parts List */}
              <div className="space-y-1 mb-4">
                {job.parts.map((part, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{part.quantity}x {part.name}</span>
                    <span>{formatCurrency(part.unitPrice * part.quantity)}</span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t pt-3 space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-3 w-3" /> Labor ({job.laborHours}h)
                  </span>
                  <span>{formatCurrency(job.totalLaborCost)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Parts</span>
                  <span>{formatCurrency(job.totalPartsCost)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span className="text-orange-500">{formatCurrency(job.totalPrice)}</span>
                </div>
              </div>

              {/* Applicable Vehicles */}
              {job.applicableVehicles && job.applicableVehicles.length > 0 && (
                <div className="flex items-center gap-2 mt-4 pt-3 border-t">
                  <Car className="h-4 w-4 text-muted-foreground" />
                  <div className="flex flex-wrap gap-1">
                    {job.applicableVehicles.map((v, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {v}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Add Button */}
              <Button className="w-full mt-4 bg-orange-500 hover:bg-orange-600">
                <Plus className="h-4 w-4 mr-2" />
                Add to Estimate
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <Card className="glass-card">
          <CardContent className="p-12 text-center">
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold mb-2">No Canned Jobs Found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              No jobs match your search criteria
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create First Canned Job
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Form component for creating/editing canned jobs
function CannedJobForm({ onClose }: { onClose: () => void }) {
  const [parts, setParts] = useState([{ name: "", quantity: 1, unitPrice: 0 }])

  const addPart = () => {
    setParts([...parts, { name: "", quantity: 1, unitPrice: 0 }])
  }

  const removePart = (index: number) => {
    setParts(parts.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Label>Job Name</Label>
          <Input placeholder="e.g., Oil Change - Synthetic" />
        </div>
        <div>
          <Label>Job Code</Label>
          <Input placeholder="e.g., OIL-SYN-001" />
        </div>
        <div>
          <Label>Category</Label>
          <Input placeholder="e.g., Maintenance" />
        </div>
        <div className="col-span-2">
          <Label>Description</Label>
          <textarea 
            className="w-full p-3 rounded-lg border bg-background text-sm resize-none"
            rows={2}
            placeholder="Brief description of the service..."
          />
        </div>
      </div>

      {/* Labor */}
      <div>
        <h4 className="font-semibold mb-3">Labor</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Hours</Label>
            <Input type="number" step="0.1" placeholder="1.5" />
          </div>
          <div>
            <Label>Rate (SL/hour)</Label>
            <Input type="number" placeholder="5000" />
          </div>
        </div>
      </div>

      {/* Parts */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h4 className="font-semibold">Parts</h4>
          <Button size="sm" variant="outline" onClick={addPart}>
            <Plus className="h-3 w-3 mr-1" /> Add Part
          </Button>
        </div>
        <div className="space-y-2">
          {parts.map((part, i) => (
            <div key={i} className="grid grid-cols-12 gap-2 items-center">
              <div className="col-span-6">
                <Input placeholder="Part name" />
              </div>
              <div className="col-span-2">
                <Input type="number" placeholder="Qty" min="1" />
              </div>
              <div className="col-span-3">
                <Input type="number" placeholder="Price" />
              </div>
              <Button 
                size="icon" 
                variant="ghost" 
                className="h-8 w-8 text-red-500"
                onClick={() => removePart(i)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Package Deal */}
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2">
          <input type="checkbox" className="rounded" />
          <span className="text-sm">Package Deal (Apply Discount)</span>
        </label>
        <Input type="number" placeholder="% off" className="w-24" />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button className="bg-orange-500 hover:bg-orange-600">
          Save Canned Job
        </Button>
      </div>
    </div>
  )
}

export default CannedJobsLibrary
