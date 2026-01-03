"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
  AlertTriangle,
  ExternalLink
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

// Mock data - would come from Convex in production
const mockVehicles: Record<string, {
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
}> = {
  "VP-001": {
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
    serviceHistory: [
      { id: "SH-001", date: "2025-12-20", type: "Full Service", description: "Oil change, filter replacement, brake inspection", mileage: 48250, technician: "John Doe", verified: true },
      { id: "SH-002", date: "2025-09-15", type: "Brake Service", description: "Front brake pads replacement", mileage: 45000, technician: "Mike Ross", verified: true },
      { id: "SH-003", date: "2025-06-10", type: "A/C Service", description: "A/C recharge, compressor check", mileage: 42000, technician: "Sarah Smith", verified: true },
    ]
  },
  "VP-002": {
    id: "VP-002",
    vin: "WDBRF61J21F123456",
    make: "Mercedes-Benz",
    model: "C-Class",
    year: 2021,
    plate: "SL-45892-H",
    color: "Black",
    mileage: 32100,
    owner: "Fatima Hassan",
    registrationExpiry: "2026-08-22",
    insuranceExpiry: "2026-05-10",
    lastService: "2025-11-05",
    nextService: "2026-02-05",
    serviceHistory: [
      { id: "SH-004", date: "2025-11-05", type: "Full Service", description: "Complete vehicle inspection and maintenance", mileage: 32100, technician: "John Doe", verified: true },
    ]
  }
}

export default function VehiclePassportPublic({ vehicleId }: { vehicleId: string }) {
  const passport = mockVehicles[vehicleId]

  if (!passport) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="h-10 w-10 text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Vehicle Not Found</h1>
          <p className="text-slate-400 mb-6">The vehicle passport ID "{vehicleId}" does not exist.</p>
          <Button variant="outline" className="border-slate-600 text-slate-300">
            <ExternalLink className="h-4 w-4 mr-2" />
            Contact MASS Workshop
          </Button>
        </motion.div>
      </div>
    )
  }

  const isExpiringSoon = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    return diffDays <= 30
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg">
              <Car className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">MASS Vehicle Passport</h1>
          </div>
          <p className="text-slate-400">Digital Maintenance ID - Verified Service History</p>
          <Badge className="mt-2 bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Verified Authentic
          </Badge>
        </motion.div>

        {/* Vehicle Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.1 }}
        >
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm mb-6 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-red-600 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {passport.year} {passport.make} {passport.model}
                  </h2>
                  <p className="text-orange-100 text-lg font-mono">{passport.plate}</p>
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
                  <p className="font-mono text-white text-xs">{passport.vin}</p>
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
        </motion.div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[
            { label: "Last Service", value: passport.lastService, icon: CheckCircle2, color: "emerald", warning: false },
            { label: "Registration", value: passport.registrationExpiry, icon: FileText, color: isExpiringSoon(passport.registrationExpiry) ? "amber" : "blue", warning: isExpiringSoon(passport.registrationExpiry) },
            { label: "Insurance", value: passport.insuranceExpiry, icon: Shield, color: isExpiringSoon(passport.insuranceExpiry) ? "amber" : "purple", warning: isExpiringSoon(passport.insuranceExpiry) },
          ].map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.2 + index * 0.1 }}
            >
              <Card className={`bg-${item.color}-500/20 border-${item.color}-500/30`}>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className={`h-12 w-12 rounded-xl bg-${item.color}-500/30 flex items-center justify-center`}>
                    {item.warning ? (
                      <AlertTriangle className={`h-6 w-6 text-${item.color}-400`} />
                    ) : (
                      <item.icon className={`h-6 w-6 text-${item.color}-400`} />
                    )}
                  </div>
                  <div>
                    <p className={`text-${item.color}-300 text-sm`}>{item.label}</p>
                    <p className="text-white font-semibold">{new Date(item.value).toLocaleDateString()}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Service History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.5 }}
        >
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Wrench className="h-5 w-5 text-orange-500" />
                Verified Service History
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {passport.serviceHistory.map((record, index) => (
                <motion.div 
                  key={record.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.6 + index * 0.1 }}
                  className="flex gap-4 p-4 bg-slate-700/30 rounded-lg border border-slate-700"
                >
                  <div className="flex flex-col items-center">
                    <div className="h-10 w-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                      <Wrench className="h-5 w-5 text-orange-400" />
                    </div>
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
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 text-center space-y-4"
        >
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
        </motion.div>
      </div>
    </div>
  )
}
