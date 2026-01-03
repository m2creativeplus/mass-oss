"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Car, Calendar, History, Plus } from "lucide-react"

const vehicles = [
  {
    id: 1,
    make: "Toyota",
    model: "Land Cruiser",
    year: "2023",
    color: "Pearl White",
    plate: "SL 12345",
    vin: "JTEHL7...8392",
    nextService: "Jan 15, 2026",
    lastService: "Oct 05, 2025"
  },
  {
    id: 2,
    make: "Nissan",
    model: "Patrol",
    year: "2022",
    color: "Black",
    plate: "SL 98765",
    vin: "JN1...4482",
    nextService: "Mar 12, 2026",
    lastService: "Dec 12, 2025"
  }
]

export default function ClientVehiclesPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">My Vehicles</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage your fleet and check service status.</p>
        </div>
        <Button className="bg-orange-500 hover:bg-orange-600 text-white gap-2">
          <Plus className="h-4 w-4" /> Add Vehicle
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {vehicles.map((car) => (
          <Card key={car.id} className="overflow-hidden group">
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 h-32 relative">
               <div className="absolute bottom-4 left-6">
                  <h3 className="text-2xl font-bold text-white">{car.make} {car.model}</h3>
                  <p className="text-slate-300">{car.year} • {car.color}</p>
               </div>
               <Car className="absolute top-4 right-4 h-24 w-24 text-white/5" />
            </div>
            <CardContent className="pt-6">
               <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                     <p className="text-xs text-slate-500 uppercase font-semibold">License Plate</p>
                     <p className="font-mono text-lg">{car.plate}</p>
                  </div>
                  <div>
                     <p className="text-xs text-slate-500 uppercase font-semibold">VIN</p>
                     <p className="font-mono text-sm text-slate-600 truncate">{car.vin}</p>
                  </div>
               </div>
               
               <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between items-center text-sm">
                     <span className="text-slate-500 flex items-center gap-2"><History className="h-4 w-4" /> Last Service</span>
                     <span className="font-medium">{car.lastService}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                     <span className="text-slate-500 flex items-center gap-2"><Calendar className="h-4 w-4" /> Next Due</span>
                     <span className="font-medium text-orange-600">{car.nextService}</span>
                  </div>
               </div>
               
               <div className="flex gap-3 mt-6">
                  <Button className="flex-1 bg-slate-900 text-white hover:bg-slate-800">Book Service</Button>
                  <Button variant="outline" className="flex-1">History</Button>
               </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
