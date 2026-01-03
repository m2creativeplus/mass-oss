"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Car,
  Calendar,
  CheckCircle2,
  Wrench,
  Shield,
  FileText,
  Download,
  Share2,
  QrCode,
  Clock,
  MapPin,
  Phone,
  AlertTriangle
} from "lucide-react"

interface ServiceRecord {
  id: string
  date: string
  type: string
  description: string
  mileage: number
  technician: string
  verified: boolean
}

interface VehiclePassport {
  id: string
  vin: string
  make: string
  model: string
  year: number
  plate: string
  color: string
  mileage: number
  owner: string
  registrationExpiry: string
  insuranceExpiry: string
  lastService: string
  nextService: string
  serviceHistory: ServiceRecord[]
  qrCodeUrl: string
}

// Demo vehicle passport data
const demoPassport: VehiclePassport = {
  id: "VP-001",
  vin: "JTM8R5EV5JD789012",
  make: "Toyota",
  model: "Land Cruiser 79",
  year: 2019,
  plate: "SL-82307-T",
  color: "White",
  mileage: 48250,
  owner: "Mohamed Ahmed",
  registrationExpiry: "2026-06-15",
  insuranceExpiry: "2026-03-20",
  lastService: "2025-12-20",
  nextService: "2026-03-20",
  qrCodeUrl: "",
  serviceHistory: [
    {
      id: "SH-001",
      date: "2025-12-20",
      type: "Full Service",
      description: "Oil change, filter replacement, brake inspection, fluid top-up",
      mileage: 48250,
      technician: "John Doe",
      verified: true
    },
    {
      id: "SH-002",
      date: "2025-09-15",
      type: "Brake Service",
      description: "Front brake pads replacement, rotor resurfacing",
      mileage: 45000,
      technician: "Mike Ross",
      verified: true
    },
    {
      id: "SH-003",
      date: "2025-06-10",
      type: "A/C Service",
      description: "A/C recharge, compressor check, cabin filter replacement",
      mileage: 42000,
      technician: "Sarah Smith",
      verified: true
    },
    {
      id: "SH-004",
      date: "2025-03-05",
      type: "Oil Change",
      description: "Engine oil and filter change, 20-point inspection",
      mileage: 38500,
      technician: "John Doe",
      verified: true
    },
  ]
}

export function VehiclePassportModule() {
  const [passport] = useState<VehiclePassport>(demoPassport)

  const isExpiringSoon = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    return diffDays <= 30
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8">
      
      {/* Header */}
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg">
              <Car className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">MASS Vehicle Passport</h1>
          </div>
          <p className="text-slate-400">Digital Maintenance ID - Verified Service History</p>
        </div>

        {/* Vehicle Card */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-red-600 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {passport.year} {passport.make} {passport.model}
                </h2>
                <p className="text-orange-100">{passport.plate}</p>
              </div>
              <div className="bg-white/20 rounded-xl p-3">
                <QrCode className="h-16 w-16 text-white" />
              </div>
            </div>
          </div>
          
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-slate-400">VIN</p>
                <p className="font-mono text-white">{passport.vin}</p>
              </div>
              <div>
                <p className="text-slate-400">Color</p>
                <p className="text-white">{passport.color}</p>
              </div>
              <div>
                <p className="text-slate-400">Current Mileage</p>
                <p className="text-white font-semibold">{passport.mileage.toLocaleString()} km</p>
              </div>
              <div>
                <p className="text-slate-400">Owner</p>
                <p className="text-white">{passport.owner}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Last Service */}
          <Card className="bg-emerald-500/20 border-emerald-500/30">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-emerald-500/30 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-emerald-300 text-sm">Last Service</p>
                <p className="text-white font-semibold">{new Date(passport.lastService).toLocaleDateString()}</p>
              </div>
            </CardContent>
          </Card>

          {/* Registration */}
          <Card className={`${isExpiringSoon(passport.registrationExpiry) ? 'bg-amber-500/20 border-amber-500/30' : 'bg-blue-500/20 border-blue-500/30'}`}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`h-12 w-12 rounded-xl ${isExpiringSoon(passport.registrationExpiry) ? 'bg-amber-500/30' : 'bg-blue-500/30'} flex items-center justify-center`}>
                {isExpiringSoon(passport.registrationExpiry) ? (
                  <AlertTriangle className="h-6 w-6 text-amber-400" />
                ) : (
                  <FileText className="h-6 w-6 text-blue-400" />
                )}
              </div>
              <div>
                <p className={`${isExpiringSoon(passport.registrationExpiry) ? 'text-amber-300' : 'text-blue-300'} text-sm`}>Registration Expiry</p>
                <p className="text-white font-semibold">{new Date(passport.registrationExpiry).toLocaleDateString()}</p>
              </div>
            </CardContent>
          </Card>

          {/* Insurance */}
          <Card className={`${isExpiringSoon(passport.insuranceExpiry) ? 'bg-amber-500/20 border-amber-500/30' : 'bg-purple-500/20 border-purple-500/30'}`}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`h-12 w-12 rounded-xl ${isExpiringSoon(passport.insuranceExpiry) ? 'bg-amber-500/30' : 'bg-purple-500/30'} flex items-center justify-center`}>
                {isExpiringSoon(passport.insuranceExpiry) ? (
                  <AlertTriangle className="h-6 w-6 text-amber-400" />
                ) : (
                  <Shield className="h-6 w-6 text-purple-400" />
                )}
              </div>
              <div>
                <p className={`${isExpiringSoon(passport.insuranceExpiry) ? 'text-amber-300' : 'text-purple-300'} text-sm`}>Insurance Expiry</p>
                <p className="text-white font-semibold">{new Date(passport.insuranceExpiry).toLocaleDateString()}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Service History */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Wrench className="h-5 w-5 text-orange-500" />
              Verified Service History
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {passport.serviceHistory.map((record, index) => (
              <div 
                key={record.id}
                className="flex gap-4 p-4 bg-slate-700/30 rounded-lg border border-slate-700"
              >
                <div className="flex flex-col items-center">
                  <div className="h-10 w-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                    <Wrench className="h-5 w-5 text-orange-400" />
                  </div>
                  {index < passport.serviceHistory.length - 1 && (
                    <div className="w-0.5 h-full bg-slate-600 mt-2" />
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-white">{record.type}</h4>
                      {record.verified && (
                        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <span className="text-slate-400 text-sm">
                      {new Date(record.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-slate-300 text-sm mb-2">{record.description}</p>
                  <div className="flex gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {record.mileage.toLocaleString()} km
                    </span>
                    <span className="flex items-center gap-1">
                      <Wrench className="h-3 w-3" />
                      Tech: {record.technician}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-6 text-center space-y-4">
          <div className="flex justify-center gap-3">
            <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
            <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
          
          <div className="flex items-center justify-center gap-2 text-slate-500 text-sm">
            <MapPin className="h-4 w-4" />
            <span>MASS Car Workshop, Hargeisa, Somaliland</span>
            <span>•</span>
            <Phone className="h-4 w-4" />
            <span>+252 63 000 0000</span>
          </div>
          
          <p className="text-slate-600 text-xs">
            This is a verified digital maintenance record. Scan QR code to verify authenticity.
          </p>
        </div>
      </div>
    </div>
  )
}

export default VehiclePassportModule
