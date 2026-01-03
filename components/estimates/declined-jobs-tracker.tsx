"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  AlertCircle, 
  Phone, 
  Mail, 
  Calendar,
  DollarSign,
  Car,
  Clock,
  ChevronRight,
  Search,
  Filter,
  RefreshCw
} from "lucide-react"

// Mock declined jobs data - in production, fetch from Convex
const declinedJobs = [
  {
    id: "1",
    customerName: "Ahmed Mohamed",
    customerPhone: "+252 63 123 4567",
    vehicleMake: "Toyota",
    vehicleModel: "Hilux",
    licensePlate: "SL-12345",
    declinedItems: [
      { description: "Brake Pad Replacement", price: 120, priority: "urgent" },
      { description: "Transmission Flush", price: 85, priority: "recommended" },
    ],
    totalDeclined: 205,
    declinedDate: "2026-01-01",
    daysSinceDecline: 1,
    followUpStatus: "pending"
  },
  {
    id: "2",
    customerName: "Fatima Ali",
    customerPhone: "+252 63 987 6543",
    vehicleMake: "Suzuki",
    vehicleModel: "Jimny",
    licensePlate: "SL-54321",
    declinedItems: [
      { description: "AC Compressor Repair", price: 350, priority: "recommended" },
    ],
    totalDeclined: 350,
    declinedDate: "2025-12-28",
    daysSinceDecline: 5,
    followUpStatus: "contacted"
  },
  {
    id: "3",
    customerName: "Ibrahim Hassan",
    customerPhone: "+252 63 456 7890",
    vehicleMake: "Toyota",
    vehicleModel: "Land Cruiser",
    licensePlate: "SL-78901",
    declinedItems: [
      { description: "Suspension Overhaul", price: 450, priority: "urgent" },
      { description: "Wheel Alignment", price: 45, priority: "recommended" },
      { description: "Tire Rotation", price: 25, priority: "optional" },
    ],
    totalDeclined: 520,
    declinedDate: "2025-12-20",
    daysSinceDecline: 13,
    followUpStatus: "pending"
  },
]

export function DeclinedJobsTracker() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filter, setFilter] = useState<"all" | "pending" | "contacted">("all")

  const filteredJobs = declinedJobs.filter(job => {
    const matchesSearch = 
      job.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.licensePlate.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filter === "all" || job.followUpStatus === filter
    return matchesSearch && matchesFilter
  })

  const totalPotentialRevenue = declinedJobs.reduce((sum, job) => sum + job.totalDeclined, 0)
  const pendingFollowUps = declinedJobs.filter(j => j.followUpStatus === "pending").length

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
      case "recommended": return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
      default: return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400"
    }
  }

  const handleFollowUp = (job: typeof declinedJobs[0], method: "call" | "sms") => {
    if (method === "call") {
      window.location.href = `tel:${job.customerPhone.replace(/\s/g, "")}`
    } else {
      // Generate SMS message
      const message = encodeURIComponent(
        `Hi ${job.customerName.split(" ")[0]}, this is MASS Car Workshop. ` +
        `We noticed you declined some recommended repairs for your ${job.vehicleMake} ${job.vehicleModel}. ` +
        `We'd like to offer you 10% off if you schedule within this week. Would you like to book an appointment?`
      )
      window.location.href = `sms:${job.customerPhone.replace(/\s/g, "")}?body=${message}`
    }
  }

  return (
    <div className="space-y-6">
      {/* Stats Header */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Declined Jobs</p>
                <p className="text-2xl font-bold">{declinedJobs.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <Clock className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending Follow-ups</p>
                <p className="text-2xl font-bold">{pendingFollowUps}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card md:col-span-2">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Potential Revenue Recovery</p>
                <p className="text-2xl font-bold text-emerald-600">${totalPotentialRevenue}</p>
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
            placeholder="Search by customer or plate..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button 
          variant={filter === "pending" ? "default" : "outline"}
          onClick={() => setFilter(filter === "pending" ? "all" : "pending")}
          className={filter === "pending" ? "bg-orange-500 hover:bg-orange-600" : ""}
        >
          <Filter className="h-4 w-4 mr-2" />
          Pending Only
        </Button>
      </div>

      {/* Jobs List */}
      <div className="space-y-4">
        {filteredJobs.map((job) => (
          <Card key={job.id} className="glass-card hover:shadow-md transition-all duration-200">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                {/* Left: Customer & Vehicle Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold">{job.customerName}</h3>
                    <Badge variant="outline" className={
                      job.followUpStatus === "contacted" 
                        ? "bg-blue-100 text-blue-700" 
                        : "bg-orange-100 text-orange-700"
                    }>
                      {job.followUpStatus === "contacted" ? "Contacted" : "Pending"}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <Car className="h-3 w-3" />
                      {job.vehicleMake} {job.vehicleModel}
                    </span>
                    <span>{job.licensePlate}</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {job.daysSinceDecline} days ago
                    </span>
                  </div>

                  {/* Declined Items */}
                  <div className="flex flex-wrap gap-2">
                    {job.declinedItems.map((item, i) => (
                      <Badge key={i} variant="outline" className={getPriorityColor(item.priority)}>
                        {item.description} - ${item.price}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="text-right">
                  <p className="text-lg font-bold text-orange-600 mb-3">${job.totalDeclined}</p>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleFollowUp(job, "sms")}
                    >
                      <Mail className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      className="bg-emerald-500 hover:bg-emerald-600"
                      onClick={() => handleFollowUp(job, "call")}
                    >
                      <Phone className="h-4 w-4 mr-1" />
                      Call
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <Card className="glass-card">
          <CardContent className="p-8 text-center">
            <RefreshCw className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold mb-2">No Declined Jobs Found</h3>
            <p className="text-sm text-muted-foreground">
              All caught up! No declined jobs matching your criteria.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default DeclinedJobsTracker
