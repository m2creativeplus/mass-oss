"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { 
  Plus, 
  Calendar as CalendarIcon,
  Clock,
  User,
  Car,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Phone,
  ArrowRight,
  Timer,
  Wrench,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  Play,
  AlertTriangle
} from "lucide-react"
import { useState, useMemo } from "react"
import { cn } from "@/lib/utils"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { useOrganization } from "@/components/providers/organization-provider"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { format, addDays, startOfWeek, isSameDay } from "date-fns"

interface AppointmentsProps {
  orgId?: string
}

export function Appointments({ orgId: propOrgId }: AppointmentsProps) {
  const { organization } = useOrganization()
  const orgId = propOrgId || organization?.slug || "mass-hargeisa"

  // Convex Hooks
  const appointments = useQuery(api.functions.getAppointments, { orgId })
  const customers = useQuery(api.functions.getCustomers, { orgId })
  const vehicles = useQuery(api.functions.getVehicles, { orgId })
  const createAppointment = useMutation(api.functions.createAppointment)

  // UI State
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [viewMode, setViewMode] = useState<"day" | "week">("day")
  const [filterStatus, setFilterStatus] = useState("all")
  const [showCreate, setShowCreate] = useState(false)
  const [newApt, setNewApt] = useState({
    customerId: "",
    vehicleId: "",
    serviceType: "",
    appointmentDate: format(new Date(), "yyyy-MM-dd"),
    time: "09:00",
    durationMinutes: 60,
    priority: "normal" as "low" | "normal" | "high" | "urgent",
    customerNotes: "",
  })

  // Helpers
  const getCustomerName = (id: string) => {
    const c = customers?.find(cust => cust._id === id)
    return c ? `${c.firstName} ${c.lastName}` : "Unknown"
  }
  const getCustomerPhone = (id: string) => {
    const c = customers?.find(cust => cust._id === id)
    return c?.phone || ""
  }
  const getVehicleInfo = (id: string) => {
    const v = vehicles?.find(veh => veh._id === id)
    return v ? `${v.year} ${v.make} ${v.model}` : "Unknown Vehicle"
  }
  const getVehiclePlate = (id: string) => {
    const v = vehicles?.find(veh => veh._id === id)
    return v?.licensePlate || ""
  }

  // Filtered customer vehicles
  const customerVehicles = useMemo(() => {
    if (!newApt.customerId) return []
    return vehicles?.filter(v => v.customerId === newApt.customerId) || []
  }, [newApt.customerId, vehicles])

  // Filter appointments
  const filteredAppointments = useMemo(() => {
    if (!appointments) return []
    let filtered = [...appointments]
    
    if (filterStatus !== "all") {
      filtered = filtered.filter(apt => apt.status === filterStatus)
    }
    
    if (viewMode === "day") {
      const dateStr = format(selectedDate, "yyyy-MM-dd")
      filtered = filtered.filter(apt => apt.appointmentDate?.startsWith(dateStr))
    } else if (viewMode === "week") {
      const weekStart = startOfWeek(selectedDate)
      const weekEnd = addDays(weekStart, 6)
      filtered = filtered.filter(apt => {
        const d = new Date(apt.appointmentDate)
        return d >= weekStart && d <= weekEnd
      })
    }
    
    return filtered.sort((a, b) => (a.appointmentDate || "").localeCompare(b.appointmentDate || ""))
  }, [appointments, filterStatus, viewMode, selectedDate])

  // Stats
  const todayStr = format(new Date(), "yyyy-MM-dd")
  const todayCount = appointments?.filter(a => a.appointmentDate?.startsWith(todayStr)).length || 0
  const scheduledCount = appointments?.filter(a => a.status === "scheduled").length || 0
  const inProgressCount = appointments?.filter(a => a.status === "in-progress").length || 0

  const handleCreate = async () => {
    if (!newApt.customerId || !newApt.vehicleId) {
      toast.error("Please select a customer and vehicle")
      return
    }
    try {
      await createAppointment({
        orgId,
        customerId: newApt.customerId as Id<"customers">,
        vehicleId: newApt.vehicleId as Id<"vehicles">,
        appointmentDate: `${newApt.appointmentDate}T${newApt.time}:00`,
        durationMinutes: newApt.durationMinutes,
        serviceType: newApt.serviceType || "General Service",
        priority: newApt.priority,
        customerNotes: newApt.customerNotes || undefined,
      })
      toast.success("Appointment scheduled!")
      setShowCreate(false)
    } catch (error) {
      toast.error("Failed to create appointment")
    }
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "scheduled":
        return { icon: CalendarIcon, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20", label: "Scheduled" }
      case "in-progress":
        return { icon: Play, color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20", label: "In Progress" }
      case "completed":
        return { icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20", label: "Completed" }
      case "cancelled":
        return { icon: XCircle, color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20", label: "Cancelled" }
      case "no-show":
        return { icon: AlertTriangle, color: "text-zinc-500", bg: "bg-zinc-500/10", border: "border-zinc-500/20", label: "No-Show" }
      default:
        return { icon: AlertCircle, color: "text-zinc-500", bg: "bg-white/5", border: "border-white/5", label: status }
    }
  }

  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case "urgent": return { color: "text-red-500 bg-red-500/10 border-red-500/20" }
      case "high": return { color: "text-amber-500 bg-amber-500/10 border-amber-500/20" }
      case "low": return { color: "text-zinc-400 bg-zinc-500/10 border-zinc-500/20" }
      default: return { color: "text-blue-400 bg-blue-500/10 border-blue-500/20" }
    }
  }

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } }
  const item: any = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } } }

  // Time slots for the day view timeline
  const TIME_SLOTS = ["07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-white uppercase italic">SERVICE SCHEDULE</h2>
          <p className="text-muted-foreground mt-1">
            Manage appointments, bookings, and technician assignments.
          </p>
        </div>
        <Dialog open={showCreate} onOpenChange={setShowCreate}>
          <DialogTrigger asChild>
            <Button className="bg-amber-500 hover:bg-amber-600 text-black font-black uppercase tracking-widest shadow-lg shadow-amber-500/20 px-8 h-12">
              <Plus className="mr-2 h-5 w-5" /> Book Appointment
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-zinc-900 border-white/10 max-w-xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-black uppercase">New Appointment</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-widest opacity-50">Customer</Label>
                <Select value={newApt.customerId} onValueChange={v => setNewApt({...newApt, customerId: v, vehicleId: ""})}>
                  <SelectTrigger className="bg-white/5 border-white/10 h-12"><SelectValue placeholder="Select customer..." /></SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-white/10">
                    {customers?.map(c => (
                      <SelectItem key={c._id} value={c._id}>
                        <div className="flex items-center gap-2"><User className="h-3 w-3 text-amber-500/50" />{c.firstName} {c.lastName}</div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {newApt.customerId && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
                  <Label className="text-xs uppercase tracking-widest opacity-50">Vehicle</Label>
                  <Select value={newApt.vehicleId} onValueChange={v => setNewApt({...newApt, vehicleId: v})}>
                    <SelectTrigger className="bg-white/5 border-white/10 h-12"><SelectValue placeholder="Select vehicle..." /></SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-white/10">
                      {customerVehicles.map(v => (
                        <SelectItem key={v._id} value={v._id}>
                          <div className="flex items-center gap-2"><Car className="h-3 w-3 text-amber-500/50" />{v.year} {v.make} {v.model} ({v.licensePlate})</div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </motion.div>
              )}

              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-widest opacity-50">Service Type</Label>
                <Input value={newApt.serviceType} onChange={e => setNewApt({...newApt, serviceType: e.target.value})} placeholder="e.g. Full Service, Oil Change" className="bg-white/5 border-white/10 h-12" />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-widest opacity-50">Date</Label>
                  <Input type="date" value={newApt.appointmentDate} onChange={e => setNewApt({...newApt, appointmentDate: e.target.value})} className="bg-white/5 border-white/10" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-widest opacity-50">Time</Label>
                  <Input type="time" value={newApt.time} onChange={e => setNewApt({...newApt, time: e.target.value})} className="bg-white/5 border-white/10" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-widest opacity-50">Duration</Label>
                  <Select value={String(newApt.durationMinutes)} onValueChange={v => setNewApt({...newApt, durationMinutes: parseInt(v)})}>
                    <SelectTrigger className="bg-white/5 border-white/10"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-white/10">
                      <SelectItem value="30">30 min</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="90">1.5 hours</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                      <SelectItem value="180">3 hours</SelectItem>
                      <SelectItem value="240">4 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-widest opacity-50">Priority</Label>
                <div className="grid grid-cols-4 gap-2">
                  {(["low", "normal", "high", "urgent"] as const).map(p => (
                    <Button key={p} type="button" variant="outline" size="sm"
                      className={cn("capitalize h-10 border-white/10", newApt.priority === p && "bg-amber-500 text-black border-amber-500 font-bold")}
                      onClick={() => setNewApt({...newApt, priority: p})}
                    >{p}</Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-widest opacity-50">Customer Notes</Label>
                <Input value={newApt.customerNotes} onChange={e => setNewApt({...newApt, customerNotes: e.target.value})} placeholder="Any special instructions..." className="bg-white/5 border-white/10 h-12" />
              </div>

              <Button onClick={handleCreate} className="w-full h-12 bg-amber-500 hover:bg-amber-600 text-black font-black uppercase tracking-widest shadow-lg shadow-amber-500/20">
                Confirm Booking
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* KPI Cards */}
      <motion.div variants={container} initial="hidden" animate="show" className="grid gap-4 md:grid-cols-4">
        <motion.div variants={item}>
          <Card className="border-white/5 bg-black/40 backdrop-blur-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-all"><CalendarIcon className="h-20 w-20 text-blue-500" /></div>
            <CardContent className="p-6">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Today</p>
              <h2 className="text-4xl font-black text-white mt-1">{todayCount}</h2>
              <p className="text-[10px] text-muted-foreground mt-1">{format(new Date(), "EEEE, MMM d")}</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={item}>
          <Card className="border-white/5 bg-black/40 backdrop-blur-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-all"><Clock className="h-20 w-20 text-purple-500" /></div>
            <CardContent className="p-6">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Scheduled</p>
              <h2 className="text-4xl font-black text-white mt-1">{scheduledCount}</h2>
              <p className="text-[10px] text-muted-foreground mt-1">Upcoming bookings</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={item}>
          <Card className="border-white/5 bg-black/40 backdrop-blur-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-all"><Play className="h-20 w-20 text-amber-500" /></div>
            <CardContent className="p-6">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">In Progress</p>
              <h2 className="text-4xl font-black text-white mt-1">{inProgressCount}</h2>
              <p className="text-[10px] text-muted-foreground mt-1">Active services</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={item}>
          <Card className="border-white/5 bg-black/40 backdrop-blur-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-all"><CheckCircle2 className="h-20 w-20 text-emerald-500" /></div>
            <CardContent className="p-6">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Total Bookings</p>
              <h2 className="text-4xl font-black text-white mt-1">{appointments?.length || 0}</h2>
              <p className="text-[10px] text-muted-foreground mt-1">All time</p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Main Content: Calendar + Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Sidebar */}
        <Card className="border-white/5 bg-black/40 backdrop-blur-xl shadow-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-amber-500" /> Calendar
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-xl border border-white/5"
            />
            
            <Separator className="bg-white/5" />

            <div className="flex gap-2">
              {(["day", "week"] as const).map(mode => (
                <Button key={mode} size="sm" variant={viewMode === mode ? "default" : "outline"}
                  onClick={() => setViewMode(mode)}
                  className={cn("flex-1 capitalize rounded-xl h-10", viewMode === mode && "bg-amber-500 hover:bg-amber-600 text-black font-bold")}
                >{mode} View</Button>
              ))}
            </div>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="bg-white/5 border-white/10 rounded-xl">
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-white/10">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            {/* Quick date navigation */}
            <div className="flex gap-2 pt-2">
              <Button variant="ghost" size="sm" className="flex-1 text-xs hover:bg-white/5"
                onClick={() => setSelectedDate(new Date())}>Today</Button>
              <Button variant="ghost" size="sm" className="flex-1 text-xs hover:bg-white/5"
                onClick={() => setSelectedDate(addDays(new Date(), 1))}>Tomorrow</Button>
            </div>
          </CardContent>
        </Card>

        {/* Schedule Timeline */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-white/5 bg-black/40 backdrop-blur-xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-lg font-bold">
                  {viewMode === "day" ? format(selectedDate, "EEEE, MMMM d, yyyy") : `Week of ${format(startOfWeek(selectedDate), "MMM d")}`}
                </CardTitle>
                <CardDescription>{filteredAppointments.length} appointment{filteredAppointments.length !== 1 ? "s" : ""}</CardDescription>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/10"
                  onClick={() => setSelectedDate(addDays(selectedDate, -1))}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/10"
                  onClick={() => setSelectedDate(addDays(selectedDate, 1))}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
          </Card>

          {/* Appointments List */}
          {appointments === undefined ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" />
            </div>
          ) : filteredAppointments.length === 0 ? (
            <Card className="border-white/5 bg-black/40 backdrop-blur-xl">
              <CardContent className="py-16 text-center">
                <CalendarIcon className="h-16 w-16 mx-auto mb-4 opacity-10" />
                <p className="text-lg font-bold text-white">No appointments</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {viewMode === "day" ? `Nothing scheduled for ${format(selectedDate, "MMMM d")}` : "No bookings this week"}
                </p>
                <Button variant="link" className="text-amber-500 mt-2" onClick={() => setShowCreate(true)}>
                  Book an appointment
                </Button>
              </CardContent>
            </Card>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div variants={container} initial="hidden" animate="show" className="space-y-3">
                {filteredAppointments.map((apt: any, index: number) => {
                  const statusConfig = getStatusConfig(apt.status)
                  const StatusIcon = statusConfig.icon
                  const priorityConfig = getPriorityConfig(apt.priority)
                  const aptTime = apt.appointmentDate?.includes("T") 
                    ? format(new Date(apt.appointmentDate), "h:mm a")
                    : "TBD"
                  const aptDate = apt.appointmentDate 
                    ? format(new Date(apt.appointmentDate), "MMM d")
                    : "—"
                  
                  return (
                    <motion.div key={apt._id} variants={item}>
                      <Card className={cn(
                        "border-white/5 bg-black/40 backdrop-blur-xl hover:bg-white/5 transition-all duration-300 group",
                        apt.priority === "urgent" && "border-l-4 border-l-red-500",
                        apt.priority === "high" && "border-l-4 border-l-amber-500"
                      )}>
                        <CardContent className="p-0">
                          <div className="flex">
                            {/* Time Block */}
                            <div className="flex flex-col items-center justify-center bg-gradient-to-b from-amber-500/20 to-amber-600/5 px-5 py-5 min-w-[100px] border-r border-white/5">
                              <Timer className="h-4 w-4 text-amber-500/60 mb-1" />
                              <span className="text-lg font-black text-white">{aptTime}</span>
                              <span className="text-[10px] text-muted-foreground uppercase mt-0.5">{apt.durationMinutes || 60} min</span>
                              {viewMode === "week" && (
                                <span className="text-[10px] text-amber-500/60 mt-1 font-bold">{aptDate}</span>
                              )}
                            </div>

                            {/* Details */}
                            <div className="flex-1 p-5">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 space-y-3">
                                  {/* Service + Priority */}
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <h4 className="font-black text-white text-lg italic">{apt.serviceType || "Service"}</h4>
                                    {apt.priority && apt.priority !== "normal" && (
                                      <Badge variant="outline" className={cn("text-[10px] uppercase font-bold", priorityConfig.color)}>
                                        {apt.priority}
                                      </Badge>
                                    )}
                                  </div>
                                  
                                  {/* Customer & Vehicle Info */}
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    <div className="flex items-center gap-2">
                                      <div className="h-8 w-8 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/10 shrink-0">
                                        <User className="h-3.5 w-3.5 text-amber-500" />
                                      </div>
                                      <div>
                                        <p className="text-sm font-bold text-white">{getCustomerName(apt.customerId)}</p>
                                        <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                                          <Phone className="h-2 w-2" /> {getCustomerPhone(apt.customerId) || "—"}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center border border-white/5 shrink-0">
                                        <Car className="h-3.5 w-3.5 text-white/60" />
                                      </div>
                                      <div>
                                        <p className="text-sm font-medium text-white">{getVehicleInfo(apt.vehicleId)}</p>
                                        <p className="text-[10px] text-amber-500/60 font-mono">{getVehiclePlate(apt.vehicleId)}</p>
                                      </div>
                                    </div>
                                  </div>

                                  {apt.customerNotes && (
                                    <p className="text-xs text-muted-foreground italic border-l-2 border-white/10 pl-3">"{apt.customerNotes}"</p>
                                  )}
                                </div>

                                {/* Status + Actions */}
                                <div className="flex flex-col items-end gap-3">
                                  <div className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold", statusConfig.bg, statusConfig.border, statusConfig.color)}>
                                    <StatusIcon className="h-3.5 w-3.5" />
                                    {statusConfig.label}
                                  </div>
                                  
                                  <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {apt.status === "scheduled" && (
                                      <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white h-8 px-3 text-xs font-bold rounded-lg">
                                        <Play className="h-3 w-3 mr-1" /> Start
                                      </Button>
                                    )}
                                    {apt.status === "in-progress" && (
                                      <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white h-8 px-3 text-xs font-bold rounded-lg">
                                        <CheckCircle2 className="h-3 w-3 mr-1" /> Done
                                      </Button>
                                    )}
                                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-red-500/10 hover:text-red-500 rounded-lg">
                                      <XCircle className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  )
}
