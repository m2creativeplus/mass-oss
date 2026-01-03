"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Edit, Fuel, Gauge, Settings, Calendar, Car } from "lucide-react"
import { useState } from "react"

interface VehicleDetailProps {
  vehicleId?: string
  onBack?: () => void
}

const mockVehicle = {
  id: "1",
  make: "Toyota",
  model: "Land Cruiser 79",
  year: 2019,
  plate: "SL-82307-T",
  vin: "JTM8R5EV5JD789012",
  color: "White",
  mileage: 48000,
  owner: "Mohamed Ahmed",
  status: "Active",
  fuelType: "Diesel",
  gears: 5,
  gearBox: "Manual",
  engineNo: "1GR-FE-4578923",
  engineSize: "4000 CC",
  chassisNo: "HGFGH45787845",
  photos: [
    "/api/placeholder/400/300",
    "/api/placeholder/400/300",
    "/api/placeholder/400/300",
    "/api/placeholder/400/300",
  ],
  serviceHistory: [
    { date: "2025-12-15", service: "Oil Change", cost: 150, technician: "John Doe" },
    { date: "2025-11-20", service: "Brake Pad Replacement", cost: 450, technician: "Mike Ross" },
    { date: "2025-10-05", service: "Full Service", cost: 780, technician: "John Doe" },
  ],
  motHistory: [
    { date: "2025-06-15", result: "Pass", nextDue: "2026-06-15", notes: "All checks passed" },
    { date: "2024-06-10", result: "Pass", nextDue: "2025-06-10", notes: "Minor advisories" },
  ],
}

export function VehicleDetail({ onBack }: VehicleDetailProps) {
  const [selectedPhoto, setSelectedPhoto] = useState(0)

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{mockVehicle.year} {mockVehicle.make} {mockVehicle.model}</h1>
            <p className="text-muted-foreground">{mockVehicle.plate}</p>
          </div>
        </div>
        <Badge className="bg-emerald-100 text-emerald-700">{mockVehicle.status}</Badge>
      </div>

      {/* Hero Banner */}
      <Card className="glass-card overflow-hidden bg-gradient-to-r from-orange-500 to-amber-500">
        <CardContent className="p-6 flex items-center gap-6">
          <div className="h-20 w-20 rounded-xl bg-white/20 flex items-center justify-center">
            <Car className="h-10 w-10 text-white" />
          </div>
          <div className="text-white">
            <h2 className="text-xl font-bold">{mockVehicle.make} {mockVehicle.model}</h2>
            <p className="flex items-center gap-4 mt-1 text-white/80">
              <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {mockVehicle.year}</span>
              <span className="flex items-center gap-1"><Gauge className="h-4 w-4" /> {mockVehicle.mileage.toLocaleString()} km</span>
            </p>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Basic Detail</TabsTrigger>
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="history">Maintenance History</TabsTrigger>
          <TabsTrigger value="mot">MOT Test Details</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Photo Gallery */}
            <Card className="glass-card">
              <CardContent className="p-4">
                <div className="aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center">
                  <Car className="h-24 w-24 text-muted-foreground" />
                </div>
                <div className="flex gap-2">
                  {mockVehicle.photos.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedPhoto(i)}
                      className={`flex-1 aspect-video rounded bg-muted flex items-center justify-center ${selectedPhoto === i ? 'ring-2 ring-orange-500' : ''}`}
                    >
                      <Car className="h-6 w-6 text-muted-foreground" />
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Specs */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" /> More Info
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="text-muted-foreground">Chassis No:</span> <span className="font-semibold">{mockVehicle.chassisNo}</span></div>
                  <div><span className="text-muted-foreground">Fuel Type:</span> <span className="font-semibold">{mockVehicle.fuelType}</span></div>
                  <div><span className="text-muted-foreground">No of Gears:</span> <span className="font-semibold">{mockVehicle.gears}</span></div>
                  <div><span className="text-muted-foreground">Odometer:</span> <span className="font-semibold">{mockVehicle.mileage.toLocaleString()} km</span></div>
                  <div><span className="text-muted-foreground">Gear Box:</span> <span className="font-semibold">{mockVehicle.gearBox}</span></div>
                  <div><span className="text-muted-foreground">Engine No:</span> <span className="font-semibold">{mockVehicle.engineNo}</span></div>
                  <div><span className="text-muted-foreground">Vehicle Brand:</span> <span className="font-semibold">{mockVehicle.make}</span></div>
                  <div><span className="text-muted-foreground">Engine Size:</span> <span className="font-semibold">{mockVehicle.engineSize}</span></div>
                  <div><span className="text-muted-foreground">Model Year:</span> <span className="font-semibold">{mockVehicle.year}</span></div>
                  <div><span className="text-muted-foreground">Color:</span> <span className="font-semibold">{mockVehicle.color}</span></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="description" className="mt-6">
          <Card className="glass-card">
            <CardContent className="p-6">
              <p className="text-muted-foreground">
                This {mockVehicle.year} {mockVehicle.make} {mockVehicle.model} is in excellent condition with {mockVehicle.mileage.toLocaleString()} km on the odometer.
                Regular maintenance has been performed according to manufacturer specifications. The vehicle features a {mockVehicle.engineSize} {mockVehicle.fuelType} engine
                with {mockVehicle.gears}-speed {mockVehicle.gearBox.toLowerCase()} transmission.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Service History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Technician</TableHead>
                    <TableHead className="text-right">Cost</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockVehicle.serviceHistory.map((service, i) => (
                    <TableRow key={i}>
                      <TableCell>{service.date}</TableCell>
                      <TableCell>{service.service}</TableCell>
                      <TableCell>{service.technician}</TableCell>
                      <TableCell className="text-right">${service.cost}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mot" className="mt-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>MOT Test History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Test Date</TableHead>
                    <TableHead>Result</TableHead>
                    <TableHead>Next Due</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockVehicle.motHistory.map((mot, i) => (
                    <TableRow key={i}>
                      <TableCell>{mot.date}</TableCell>
                      <TableCell>
                        <Badge className={mot.result === "Pass" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}>
                          {mot.result}
                        </Badge>
                      </TableCell>
                      <TableCell>{mot.nextDue}</TableCell>
                      <TableCell>{mot.notes}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default VehicleDetail
