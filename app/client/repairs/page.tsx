"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Car, Search, Calendar, ChevronRight, Wrench, Clock, CheckCircle2, FileText } from "lucide-react"

// Mock data - would come from Convex
const repairs = [
  { 
    id: "WO-2384",
    date: "Jan 02, 2026", 
    vehicle: "Toyota Land Cruiser", 
    license: "SL 12345", 
    service: "Oil Change & Brake Check",
    status: "in-progress",
    technician: "Ahmed M.",
    amount: "$120.00"
  },
  { 
    id: "WO-2021",
    date: "Dec 12, 2025", 
    vehicle: "Nissan Patrol", 
    license: "SL 98765", 
    service: "Regular Service (10k)",
    status: "completed",
    technician: "Hassan K.",
    amount: "$350.00"
  },
  { 
    id: "WO-1840",
    date: "Oct 05, 2025", 
    vehicle: "Toyota Land Cruiser", 
    license: "SL 12345", 
    service: "Battery Replacement",
    status: "completed",
    technician: "Ahmed M.",
    amount: "$120.00"
  },
]

export default function ClientRepairsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">My Repairs</h1>
          <p className="text-slate-500 dark:text-slate-400">Track current jobs and view service history.</p>
        </div>
        <div className="relative w-64 hidden md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
          <Input placeholder="Search by vehicle or service..." className="pl-9" />
        </div>
      </div>

      <div className="space-y-4">
        {repairs.map((repair) => (
          <Card key={repair.id} className="transition-all hover:border-slate-300 dark:hover:border-slate-700">
            <div className="flex flex-col md:flex-row gap-6 p-6">
              {/* Status Indicator */}
              <div className="flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-900 rounded-lg w-full md:w-32 flex-shrink-0 border border-slate-100 dark:border-slate-800">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center mb-2 ${
                  repair.status === 'in-progress' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                }`}>
                  {repair.status === 'in-progress' ? <Clock className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}
                </div>
                <Badge variant={repair.status === 'in-progress' ? 'default' : 'secondary'} className="capitalize">
                  {repair.status.replace('-', ' ')}
                </Badge>
              </div>

              {/* Details */}
              <div className="flex-1 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold flex items-center gap-2">
                       {repair.vehicle}
                       <span className="text-sm font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded text-xs">{repair.license}</span>
                    </h3>
                    <p className="text-slate-500 mt-1">{repair.service}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">{repair.amount}</p>
                    <p className="text-xs text-slate-400">{repair.date}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-sm text-slate-500">
                  <div className="flex items-center gap-2">
                    <Wrench className="h-4 w-4" />
                    Tech: {repair.technician}
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Order: #{repair.id}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex md:flex-col justify-center gap-2 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 pt-4 md:pt-0 md:pl-6 w-full md:w-48 flex-shrink-0">
                <Button className="w-full bg-slate-900 dark:bg-white dark:text-slate-900 hover:bg-slate-800">
                  View Details
                </Button>
                {repair.status === 'completed' && (
                  <Button variant="outline" className="w-full">
                    Download Invoice
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
