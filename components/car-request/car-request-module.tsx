"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Car,
  User,
  Phone,
  Mail,
  Calendar,
  Wrench,
  Send,
  CheckCircle2,
  Clock,
  AlertCircle
} from "lucide-react"

interface CarRequest {
  id: string
  customerName: string
  phone: string
  email: string
  vehicle: string
  plate: string
  serviceType: string
  description: string
  preferredDate: string
  status: "pending" | "confirmed" | "scheduled" | "completed"
  createdAt: string
}

const mockRequests: CarRequest[] = [
  {
    id: "CR-001",
    customerName: "Mohamed Ibrahim",
    phone: "+252-63-1234567",
    email: "mohamed@email.com",
    vehicle: "2020 Toyota Hilux",
    plate: "SL-12345-H",
    serviceType: "Full Service",
    description: "Oil change, brake check, general inspection",
    preferredDate: "2026-01-05",
    status: "pending",
    createdAt: "2026-01-01"
  },
  {
    id: "CR-002",
    customerName: "Fatima Hassan",
    phone: "+252-63-7654321",
    email: "fatima@email.com",
    vehicle: "2019 Nissan Patrol",
    plate: "SL-67890-H",
    serviceType: "A/C Repair",
    description: "AC not cooling properly",
    preferredDate: "2026-01-03",
    status: "confirmed",
    createdAt: "2025-12-30"
  },
]

export function CarRequestModule() {
  const [requests] = useState<CarRequest[]>(mockRequests)
  const [formSubmitted, setFormSubmitted] = useState(false)

  const getStatusBadge = (status: CarRequest["status"]) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-amber-500">Pending</Badge>
      case "confirmed":
        return <Badge className="bg-blue-500">Confirmed</Badge>
      case "scheduled":
        return <Badge className="bg-purple-500">Scheduled</Badge>
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormSubmitted(true)
    setTimeout(() => setFormSubmitted(false), 3000)
  }

  return (
    <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-950 p-6">
      
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center mb-6"
      >
        <h2 className="text-xl font-bold text-slate-800 dark:text-white uppercase tracking-tight">
          Car Service Request
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left: Request Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader className="bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5" />
                Request Service
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
                    <Input placeholder="Your name" className="mt-1" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Phone</label>
                    <Input placeholder="+252-XX-XXXXXXX" className="mt-1" />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
                  <Input type="email" placeholder="email@example.com" className="mt-1" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Vehicle</label>
                    <Input placeholder="Year Make Model" className="mt-1" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Plate Number</label>
                    <Input placeholder="SL-XXXXX-X" className="mt-1" />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Service Type</label>
                  <select className="w-full mt-1 border border-slate-300 rounded-md p-2 bg-transparent">
                    <option>Full Service</option>
                    <option>Oil Change</option>
                    <option>Brake Service</option>
                    <option>A/C Repair</option>
                    <option>Engine Repair</option>
                    <option>Transmission</option>
                    <option>Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Preferred Date</label>
                  <Input type="date" className="mt-1" />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
                  <Textarea placeholder="Describe the issue or service needed..." className="mt-1" rows={3} />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                  disabled={formSubmitted}
                >
                  {formSubmitted ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Request Submitted!
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Submit Request
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Right: Pending Requests Table */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-orange-500" />
                Recent Requests
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {requests.map((request) => (
                  <div key={request.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="font-bold text-blue-600">{request.id}</span>
                        <span className="text-slate-500 text-sm ml-2">{new Date(request.createdAt).toLocaleDateString()}</span>
                      </div>
                      {getStatusBadge(request.status)}
                    </div>
                    <div className="text-sm">
                      <p className="font-medium">{request.customerName}</p>
                      <p className="text-slate-500">{request.vehicle} • {request.plate}</p>
                      <p className="text-orange-600 font-medium mt-1">{request.serviceType}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default CarRequestModule
