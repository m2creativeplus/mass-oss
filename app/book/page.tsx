"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { 
  Calendar, 
  Clock, 
  Car, 
  Phone, 
  User, 
  CheckCircle2,
  Wrench,
  Shield,
  Sparkles,
  ArrowRight
} from "lucide-react"

const serviceTypes = [
  { id: "oil", name: "Oil Change", duration: "30 min", price: "$45", icon: "🛢️" },
  { id: "full", name: "Full Service", duration: "2 hrs", price: "$150", icon: "🔧" },
  { id: "inspection", name: "Vehicle Inspection", duration: "1 hr", price: "$75", icon: "🔍" },
  { id: "brakes", name: "Brake Service", duration: "1.5 hrs", price: "$120", icon: "🛞" },
  { id: "ac", name: "AC Service", duration: "1 hr", price: "$85", icon: "❄️" },
  { id: "diagnostic", name: "Diagnostic Check", duration: "45 min", price: "$60", icon: "🖥️" },
]

const timeSlots = [
  "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM",
  "12:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"
]

export default function BookingPage() {
  const [step, setStep] = useState(1)
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    vehicleMake: "",
    vehicleModel: "",
    licensePlate: "",
    notes: ""
  })
  const [bookingComplete, setBookingComplete] = useState(false)

  const handleSubmit = () => {
    // In production, this would call Convex mutation
    console.log("Booking submitted:", { selectedService, selectedDate, selectedTime, formData })
    setBookingComplete(true)
  }

  if (bookingComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-orange-900 flex items-center justify-center p-4">
        <Card className="max-w-md w-full bg-white/10 backdrop-blur-xl border-white/20 text-white">
          <CardContent className="p-8 text-center">
            <div className="h-20 w-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="h-10 w-10 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Booking Confirmed!</h2>
            <p className="text-white/70 mb-6">
              We've received your appointment request. You'll receive a confirmation via SMS shortly.
            </p>
            <div className="bg-white/5 rounded-lg p-4 text-left space-y-2 mb-6">
              <p><span className="text-white/50">Service:</span> {serviceTypes.find(s => s.id === selectedService)?.name}</p>
              <p><span className="text-white/50">Date:</span> {selectedDate}</p>
              <p><span className="text-white/50">Time:</span> {selectedTime}</p>
              <p><span className="text-white/50">Phone:</span> {formData.phone}</p>
            </div>
            <Button 
              className="w-full bg-orange-500 hover:bg-orange-600"
              onClick={() => window.location.href = "/"}
            >
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-orange-900">
      {/* Header */}
      <header className="p-6 text-center">
        <h1 className="text-3xl font-bold text-white mb-2">
          <span className="text-orange-400">MASS</span> Car Workshop
        </h1>
        <p className="text-white/70">Book Your Service Online - 24/7</p>
      </header>

      {/* Progress Steps */}
      <div className="max-w-2xl mx-auto px-4 mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold ${
                step >= s ? "bg-orange-500 text-white" : "bg-white/20 text-white/50"
              }`}>
                {s}
              </div>
              {s < 3 && (
                <div className={`w-20 sm:w-32 h-1 mx-2 ${
                  step > s ? "bg-orange-500" : "bg-white/20"
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-xs text-white/60">
          <span>Select Service</span>
          <span>Choose Time</span>
          <span>Your Details</span>
        </div>
      </div>

      {/* Step Content */}
      <div className="max-w-2xl mx-auto px-4 pb-12">
        {/* Step 1: Service Selection */}
        {step === 1 && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-xl font-semibold text-white mb-4">What service do you need?</h2>
            <div className="grid grid-cols-2 gap-3">
              {serviceTypes.map((service) => (
                <Card 
                  key={service.id}
                  className={`cursor-pointer transition-all duration-200 ${
                    selectedService === service.id 
                      ? "bg-orange-500 border-orange-400 text-white" 
                      : "bg-white/10 border-white/20 text-white hover:bg-white/20"
                  }`}
                  onClick={() => setSelectedService(service.id)}
                >
                  <CardContent className="p-4 text-center">
                    <span className="text-2xl mb-2 block">{service.icon}</span>
                    <h3 className="font-semibold text-sm">{service.name}</h3>
                    <p className="text-xs opacity-70">{service.duration}</p>
                    <Badge className={`mt-2 ${selectedService === service.id ? "bg-white text-orange-600" : "bg-orange-500/50"}`}>
                      {service.price}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Button 
              className="w-full mt-6 bg-orange-500 hover:bg-orange-600 text-white"
              disabled={!selectedService}
              onClick={() => setStep(2)}
            >
              Continue <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Step 2: Date & Time */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-xl font-semibold text-white mb-4">Choose Date & Time</h2>
            
            <div>
              <Label className="text-white/70 mb-2 block">Select Date</Label>
              <Input 
                type="date" 
                className="bg-white/10 border-white/20 text-white"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>

            <div>
              <Label className="text-white/70 mb-2 block">Available Time Slots</Label>
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map((time) => (
                  <Button
                    key={time}
                    variant={selectedTime === time ? "default" : "outline"}
                    className={selectedTime === time 
                      ? "bg-orange-500 border-orange-400" 
                      : "bg-white/10 border-white/20 text-white hover:bg-white/20"
                    }
                    onClick={() => setSelectedTime(time)}
                  >
                    {time}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1 border-white/20 text-white"
                onClick={() => setStep(1)}
              >
                Back
              </Button>
              <Button 
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
                disabled={!selectedDate || !selectedTime}
                onClick={() => setStep(3)}
              >
                Continue <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Contact Details */}
        {step === 3 && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-xl font-semibold text-white mb-4">Your Details</h2>
            
            <div className="space-y-4">
              <div>
                <Label className="text-white/70">Full Name</Label>
                <Input 
                  placeholder="Mohamed Ahmed"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              
              <div>
                <Label className="text-white/70">Phone Number</Label>
                <Input 
                  placeholder="+252 63 123 4567"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-white/70">Vehicle Make</Label>
                  <Input 
                    placeholder="Toyota"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                    value={formData.vehicleMake}
                    onChange={(e) => setFormData({...formData, vehicleMake: e.target.value})}
                  />
                </div>
                <div>
                  <Label className="text-white/70">Model</Label>
                  <Input 
                    placeholder="Hilux"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                    value={formData.vehicleModel}
                    onChange={(e) => setFormData({...formData, vehicleModel: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <Label className="text-white/70">License Plate</Label>
                <Input 
                  placeholder="SL-12345"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                  value={formData.licensePlate}
                  onChange={(e) => setFormData({...formData, licensePlate: e.target.value})}
                />
              </div>

              <div>
                <Label className="text-white/70">Additional Notes (Optional)</Label>
                <textarea 
                  placeholder="Describe any issues..."
                  className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 resize-none"
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                variant="outline" 
                className="flex-1 border-white/20 text-white"
                onClick={() => setStep(2)}
              >
                Back
              </Button>
              <Button 
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
                disabled={!formData.name || !formData.phone}
                onClick={handleSubmit}
              >
                Confirm Booking
              </Button>
            </div>
          </div>
        )}

        {/* Trust Badges */}
        <div className="mt-12 flex justify-center gap-6 text-white/50 text-xs">
          <div className="flex items-center gap-1">
            <Shield className="h-4 w-4" /> Secure Booking
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" /> Quick Confirmation
          </div>
          <div className="flex items-center gap-1">
            <Sparkles className="h-4 w-4" /> Free Estimates
          </div>
        </div>
      </div>
    </div>
  )
}
