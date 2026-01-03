import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Car, Clock, FileText, CheckCircle2, ChevronRight, AlertCircle, Calendar } from "lucide-react"
import Link from "next/link"

export default function ClientDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">My Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400">Overview of your vehicles, repairs, and billing.</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-blue-500 shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription>Active Repairs</CardDescription>
            <CardTitle className="text-3xl font-bold">1</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-slate-500">
              Toyota Land Cruiser is <span className="text-blue-600 font-medium">In Progress</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-orange-500 shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription>Appointments</CardDescription>
            <CardTitle className="text-3xl font-bold">1</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-slate-500">
              Next: <span className="font-medium">Jan 15, 2026</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription>Outstanding Balance</CardDescription>
            <CardTitle className="text-3xl font-bold">$0.00</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-slate-500 flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              All invoices paid
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Active Repairs Widget */}
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
               <CardTitle>Active Repair Status</CardTitle>
               <CardDescription>Track real-time progress</CardDescription>
            </div>
            <Link href="/client/repairs">
               <Button variant="ghost" size="sm" className="gap-1">View All <ChevronRight className="h-4 w-4" /></Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-6">
             <div className="flex gap-4 items-start pb-6 border-b">
                <div className="h-12 w-12 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                  <Car className="h-6 w-6 text-slate-600" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                     <div>
                        <h4 className="font-bold">Toyota Land Cruiser</h4>
                        <p className="text-sm text-slate-500">Order #WO-2384 • Oil Change & Brake Check</p>
                     </div>
                     <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">In Progress</Badge>
                  </div>
                  
                  {/* Simple Progress Bar */}
                  <div className="space-y-2">
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 w-[60%]" />
                    </div>
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>Check-In</span>
                      <span className="font-medium text-blue-600">Inspection</span>
                      <span>Repair</span>
                      <span>Quality Check</span>
                      <span>Ready</span>
                    </div>
                  </div>
                </div>
             </div>
             
             <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
               <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
               <div>
                  <h5 className="font-bold text-amber-800 text-sm">Action Required</h5>
                  <p className="text-sm text-amber-700 mt-1">Technician found additional issues with rear brake pads. Please review the estimate.</p>
                  <Button size="sm" className="mt-3 bg-amber-600 hover:bg-amber-700 text-white">Review Estimate</Button>
               </div>
             </div>
          </CardContent>
        </Card>

        {/* Recent Invoices Widget */}
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
               <CardTitle>Recent History</CardTitle>
               <CardDescription>Past services and payments</CardDescription>
            </div>
            <Link href="/client/invoices">
               <Button variant="ghost" size="sm" className="gap-1">View All <ChevronRight className="h-4 w-4" /></Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { date: "Dec 12, 2025", type: "Invoice #INV-2021", car: "Nissan Patrol", amount: "$350.00", status: "Paid" },
                { date: "Oct 05, 2025", type: "Invoice #INV-1840", car: "Toyota Land Cruiser", amount: "$120.00", status: "Paid" },
                { date: "Aug 18, 2025", type: "Invoice #INV-1533", car: "Toyota Land Cruiser", amount: "$85.00", status: "Paid" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{item.type}</p>
                      <p className="text-xs text-slate-500">{item.date} • {item.car}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm">{item.amount}</p>
                    <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">{item.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="bg-slate-50 border-t p-4">
             <Link href="/client/appointments" className="w-full">
               <Button variant="outline" className="w-full gap-2 text-slate-600">
                 <Calendar className="h-4 w-4" /> Book New Appointment
               </Button>
             </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
