"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Plus, 
  Calendar as CalendarIcon,
  Clock,
  User,
  Car,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Filter,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface Appointment {
  id: string
  customer: string
  vehicle: string
  service: string
  technician: string
  date: string
  time: string
  duration: number
  status: "scheduled" | "in-progress" | "completed" | "cancelled"
  priority: "normal" | "urgent"
  estimatedCost: number
}

const mockAppointments: Appointment[] = [
  {
    id: "1",
    customer: "Mohamed Ahmed",
    vehicle: "Toyota Land Cruiser (ABC-1234)",
    service: "Full Service + Oil Change",
    technician: "John Doe",
    date: "2025-12-26",
    time: "09:00",
    duration: 120,
    status: "scheduled",
    priority: "normal",
    estimatedCost: 450
  },
  {
    id: "2",
    customer: "Sarah Hassan",
    vehicle: "Honda Civic (XYZ-5678)",
    service: "Brake System Repair",
    technician: "Mike Ross",
    date: "2025-12-26",
    time: "11:00",
    duration: 180,
    status: "in-progress",
    priority: "urgent",
    estimatedCost: 780
  },
  {
    id: "3",
    customer: "Ahmed Ali",
    vehicle: "Ford F-150 (DEF-9012)",
    service: "Tire Replacement (4x)",
    technician: "Sarah Smith",
    date: "2025-12-26",
    time: "14:00",
    duration: 90,
    status: "scheduled",
    priority: "normal",
    estimatedCost: 600
  },
  {
    id: "4",
    customer: "Fatima Omar",
    vehicle: "Nissan Patrol (GHI-3456)",
    service: "Engine Diagnostic",
    technician: "John Doe",
    date: "2025-12-27",
    time: "10:00",
    duration: 60,
    status: "scheduled",
    priority: "urgent",
    estimatedCost: 250
  },
]

export function Appointments() {
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [viewMode, setViewMode] = useState<"day" | "week" | "month">("day")
  const [filterStatus, setFilterStatus] = useState<string>("all")

  const getStatusConfig = (status: Appointment["status"]) => {
    switch (status) {
      case "scheduled":
        return { 
          color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400", 
          icon: CalendarIcon,
          label: "Scheduled" 
        }
      case "in-progress":
        return { 
          color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400", 
          icon: Clock,
          label: "In Progress" 
        }
      case "completed":
        return { 
          color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400", 
          icon: CheckCircle2,
          label: "Completed" 
        }
      case "cancelled":
        return { 
          color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400", 
          icon: XCircle,
          label: "Cancelled" 
        }
    }
  }

  const filteredAppointments = appointments.filter(apt => {
    if (filterStatus !== "all" && apt.status !== filterStatus) return false
    if (viewMode === "day") {
      return apt.date === selectedDate.toISOString().split('T')[0]
    }
    return true
  })

  const todayAppointments = appointments.filter(apt => apt.date === new Date().toISOString().split('T')[0])
  const upcomingCount = appointments.filter(apt => apt.status === "scheduled").length
  const inProgressCount = appointments.filter(apt => apt.status === "in-progress").length

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Service Schedule</h1>
          <p className="text-muted-foreground mt-1">Manage appointments and service bookings</p>
        </div>
        <Button className="bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20">
          <Plus className="mr-2 h-4 w-4" />
          New Appointment
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Today</p>
                <h3 className="text-2xl font-bold mt-1">{todayAppointments.length}</h3>
              </div>
              <CalendarIcon className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Scheduled</p>
                <h3 className="text-2xl font-bold mt-1">{upcomingCount}</h3>
              </div>
              <Clock className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <h3 className="text-2xl font-bold mt-1">{inProgressCount}</h3>
              </div>
              <AlertCircle className="h-8 w-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Est. Revenue</p>
                <h3 className="text-2xl font-bold mt-1">
                  ${filteredAppointments.reduce((sum, apt) => sum + apt.estimatedCost, 0).toLocaleString()}
                </h3>
              </div>
              <CheckCircle2 className="h-8 w-8 text-emerald-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg">Select Date</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border"
            />
            
            <div className="mt-4 space-y-2">
              <div className="flex gap-2">
                {["day", "week", "month"].map((mode) => (
                  <Button
                    key={mode}
                    size="sm"
                    variant={viewMode === mode ? "default" : "outline"}
                    onClick={() => setViewMode(mode as any)}
                    className="flex-1 capitalize"
                  >
                    {mode}
                  </Button>
                ))}
              </div>
              
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Appointments List */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>
                  {viewMode === "day" && `Appointments for ${selectedDate.toLocaleDateString()}`}
                  {viewMode === "week" && "This Week's Appointments"}
                  {viewMode === "month" && "This Month's Appointments"}
                </CardTitle>
                <Badge variant="outline">{filteredAppointments.length} total</Badge>
              </div>
            </CardHeader>
          </Card>

          {filteredAppointments.length === 0 ? (
            <Card className="glass-card">
              <CardContent className="p-12 text-center">
                <CalendarIcon className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-20" />
                <p className="text-muted-foreground">No appointments for this date.</p>
              </CardContent>
            </Card>
          ) : (
            filteredAppointments.map((appointment, index) => {
              const statusConfig = getStatusConfig(appointment.status)
              const StatusIcon = statusConfig.icon
              
              return (
                <Card 
                  key={appointment.id}
                  className={cn(
                    "glass-card hover:shadow-md transition-all duration-200 animate-slide-in-left",
                    appointment.priority === "urgent" && "border-l-4 border-l-red-500"
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex gap-4 flex-1">
                        {/* Time Block */}
                        <div className="flex flex-col items-center justify-center bg-gradient-to-br from-orange-500 to-red-600 text-white rounded-lg p-3 min-w-[80px]">
                          <span className="text-2xl font-bold">{appointment.time}</span>
                          <span className="text-xs opacity-90">{appointment.duration} min</span>
                        </div>

                        {/* Details */}
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-lg">{appointment.service}</h4>
                            {appointment.priority === "urgent" && (
                              <Badge variant="destructive" className="text-xs">URGENT</Badge>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <User className="h-4 w-4" />
                              {appointment.customer}
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Car className="h-4 w-4" />
                              {appointment.vehicle}
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <User className="h-4 w-4" />
                              Tech: {appointment.technician}
                            </div>
                            <div className="flex items-center gap-2 font-semibold text-emerald-600 dark:text-emerald-400">
                              ${appointment.estimatedCost}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 pt-2">
                            <Badge className={statusConfig.color}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {statusConfig.label}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2">
                        {appointment.status === "scheduled" && (
                          <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600">
                            Start
                          </Button>
                        )}
                        {appointment.status === "in-progress" && (
                          <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
                            Complete
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
