"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bell, Plus, Calendar, Car, FileText } from "lucide-react"
import { useOrganization } from "@/components/providers/organization-provider"

export default function RemindersPage() {
  const { organization } = useOrganization()

  if (!organization) return null

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-pink-500 to-pink-700 flex items-center justify-center">
              <Bell className="h-5 w-5 text-white" />
            </div>
            Service Reminders
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Automated service and maintenance reminders
          </p>
        </div>
        <Button className="bg-pink-600 hover:bg-pink-700">
          <Plus className="h-4 w-4 mr-2" />
          Create Reminder
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { icon: Calendar, label: "Upcoming", value: "12", color: "text-blue-600" },
          { icon: Bell, label: "Due Today", value: "5", color: "text-amber-600" },
          { icon: Car, label: "Overdue", value: "3", color: "text-red-600" },
          { icon: FileText, label: "Sent This Week", value: "28", color: "text-green-600" },
        ].map((stat, i) => {
          const Icon = stat.icon
          return (
            <Card key={i}>
              <CardContent className="p-4 flex items-center gap-3">
                <Icon className={`h-8 w-8 ${stat.color}`} />
                <div>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">Reminder Types</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {["Oil Change Due", "Registration Renewal", "Insurance Expiry", "Annual Service", "Tire Rotation", "Brake Inspection"].map((type, i) => (
              <div key={i} className="p-3 bg-gray-50 dark:bg-slate-800 rounded-lg text-sm">
                {type}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
