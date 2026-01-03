"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { Calendar as CalendarIcon, Clock } from "lucide-react"

export default function ClientAppointmentsPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Book Appointment</h1>
        <p className="text-slate-500 dark:text-slate-400">Schedule your next service in 3 easy steps.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         {/* Booking Form */}
         <div className="md:col-span-2 space-y-6">
            <Card>
               <CardContent className="p-6 space-y-6">
                  <div className="space-y-2">
                     <Label>1. Select Vehicle</Label>
                     <Select defaultValue="land-cruiser">
                        <SelectTrigger>
                           <SelectValue placeholder="Select vehicle" />
                        </SelectTrigger>
                        <SelectContent>
                           <SelectItem value="land-cruiser">Toyota Land Cruiser (SL 12345)</SelectItem>
                           <SelectItem value="patrol">Nissan Patrol (SL 98765)</SelectItem>
                        </SelectContent>
                     </Select>
                  </div>

                  <div className="space-y-2">
                     <Label>2. Service Type</Label>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {['Oil Change', 'Brake Inspection', 'General Service', 'Diagnostics'].map((service) => (
                           <div key={service} className="p-4 border rounded-lg cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition-colors">
                              <span className="font-medium">{service}</span>
                           </div>
                        ))}
                     </div>
                  </div>

                  <div className="space-y-2">
                     <Label>3. Select Date & Time</Label>
                     <div className="flex flex-col md:flex-row gap-6">
                        <div className="border rounded-lg p-2 bg-white dark:bg-slate-950">
                           <Calendar
                              mode="single"
                              selected={date}
                              onSelect={setDate}
                              className="rounded-md border-0"
                           />
                        </div>
                        <div className="grid grid-cols-2 gap-2 content-start flex-1">
                           {['09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM', '03:00 PM'].map((time) => (
                              <Button key={time} variant="outline" className="justify-start gap-2 hover:border-orange-500 hover:text-orange-600">
                                 <Clock className="h-4 w-4" /> {time}
                              </Button>
                           ))}
                        </div>
                     </div>
                  </div>

                  <div className="space-y-2">
                     <Label>Additional Notes</Label>
                     <Textarea placeholder="Any specific issues we should look into?" />
                  </div>

                  <Button size="lg" className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                     Confirm Booking
                  </Button>
               </CardContent>
            </Card>
         </div>

         {/* Summary Sidebar */}
         <div className="space-y-6">
            <Card className="bg-slate-50 dark:bg-slate-900 border-none shadow-none">
               <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-4">Booking Summary</h3>
                  <div className="space-y-4 text-sm">
                     <div className="flex justify-between">
                        <span className="text-slate-500">Vehicle</span>
                        <span className="font-medium text-right">Toyota Land Cruiser</span>
                     </div>
                     <div className="flex justify-between">
                        <span className="text-slate-500">Service</span>
                        <span className="font-medium text-right">Oil Change</span>
                     </div>
                     <div className="flex justify-between">
                        <span className="text-slate-500">Date</span>
                        <span className="font-medium text-right">{date?.toLocaleDateString()}</span>
                     </div>
                     <div className="border-t pt-4 flex justify-between items-center">
                        <span className="font-bold">Estimated Total</span>
                        <span className="font-bold text-xl">$85.00</span>
                     </div>
                  </div>
               </CardContent>
            </Card>

            <div className="bg-blue-50 text-blue-800 p-4 rounded-lg text-sm">
               <p className="font-bold mb-1">Need urgent help?</p>
               <p>Call our emergency hotline at <span className="font-bold">555-0123</span></p>
            </div>
         </div>
      </div>
    </div>
  )
}
