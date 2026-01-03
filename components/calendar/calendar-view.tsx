"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { useState } from "react"

const mockEvents = [
  { date: "2025-01-06", title: "BMW Oil Service", time: "9:00 AM", color: "bg-blue-500" },
  { date: "2025-01-06", title: "Toyota Brake Job", time: "2:00 PM", color: "bg-orange-500" },
  { date: "2025-01-07", title: "Honda Inspection", time: "10:00 AM", color: "bg-emerald-500" },
  { date: "2025-01-13", title: "Nissan Engine", time: "8:00 AM", color: "bg-purple-500" },
  { date: "2025-01-19", title: "Ford Full Service", time: "11:00 AM", color: "bg-amber-500" },
  { date: "2025-01-20", title: "Audi Diagnostic", time: "3:00 PM", color: "bg-red-500" },
]

const serviceCounts = [
  { date: "2025-01-06", count: 2, revenue: "120K" },
  { date: "2025-01-07", count: 1, revenue: "85K" },
  { date: "2025-01-13", count: 1, revenue: "150K" },
  { date: "2025-01-19", count: 1, revenue: "95K" },
  { date: "2025-01-20", count: 1, revenue: "75K" },
]

export function CalendarView() {
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 0, 1))

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay()
  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))

  const getEventsForDay = (day: number) => {
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return mockEvents.filter(e => e.date === dateStr)
  }

  const getCountForDay = (day: number) => {
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return serviceCounts.find(s => s.date === dateStr)
  }

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => null)
  const allDays = [...blanks, ...days]

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
          <p className="text-muted-foreground">View and manage appointments</p>
        </div>
        <Button className="bg-orange-500 hover:bg-orange-600 text-white">
          <Plus className="mr-2 h-4 w-4" /> New Appointment
        </Button>
      </div>

      <Card className="glass-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <Button variant="ghost" size="icon" onClick={prevMonth}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <CardTitle className="text-xl">{monthName}</CardTitle>
          <Button variant="ghost" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-5 w-5" />
          </Button>
        </CardHeader>
        <CardContent>
          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-sm font-semibold text-muted-foreground py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {allDays.map((day, i) => {
              if (day === null) {
                return <div key={`blank-${i}`} className="aspect-square" />
              }

              const events = getEventsForDay(day)
              const count = getCountForDay(day)
              const isToday = day === new Date().getDate() && currentMonth.getMonth() === new Date().getMonth()

              return (
                <div
                  key={day}
                  className={`aspect-square border rounded-lg p-1 hover:bg-muted/50 cursor-pointer transition-colors ${isToday ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-500' : 'border-border'}`}
                >
                  <div className="flex justify-between items-start">
                    <span className={`text-sm font-medium ${isToday ? 'text-orange-500' : ''}`}>{day}</span>
                    {count && (
                      <Badge variant="secondary" className="text-[10px] px-1">
                        {count.revenue}
                      </Badge>
                    )}
                  </div>
                  <div className="mt-1 space-y-0.5">
                    {events.slice(0, 2).map((event, j) => (
                      <div key={j} className={`text-[10px] ${event.color} text-white px-1 rounded truncate`}>
                        {event.title}
                      </div>
                    ))}
                    {events.length > 2 && (
                      <div className="text-[10px] text-muted-foreground">+{events.length - 2} more</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Today's Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Free Service Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockEvents.slice(0, 3).map((event, i) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                <div className={`w-1 h-10 rounded ${event.color}`} />
                <div className="flex-1">
                  <p className="font-medium text-sm">{event.title}</p>
                  <p className="text-xs text-muted-foreground">{event.date} • {event.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Paid Service Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockEvents.slice(3).map((event, i) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                <div className={`w-1 h-10 rounded ${event.color}`} />
                <div className="flex-1">
                  <p className="font-medium text-sm">{event.title}</p>
                  <p className="text-xs text-muted-foreground">{event.date} • {event.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default CalendarView
