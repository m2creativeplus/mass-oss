"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Truck, Plus, MapPin, Clock } from "lucide-react"
import { useOrganization } from "@/components/providers/organization-provider"

export default function DeliveryPage() {
  const { organization } = useOrganization()

  if (!organization) return null

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center">
              <Truck className="h-5 w-5 text-white" />
            </div>
            Vehicle Delivery
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Track vehicle pickup and delivery schedules
          </p>
        </div>
        <Button className="bg-amber-600 hover:bg-amber-700">
          <Plus className="h-4 w-4 mr-2" />
          Schedule Delivery
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { status: "Pending Pickup", count: 3, color: "bg-blue-500" },
          { status: "In Transit", count: 2, color: "bg-amber-500" },
          { status: "Delivered Today", count: 5, color: "bg-green-500" },
        ].map((item, i) => (
          <Card key={i}>
            <CardContent className="p-6 flex items-center gap-4">
              <div className={`h-12 w-12 rounded-full ${item.color} flex items-center justify-center`}>
                <Truck className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{item.count}</p>
                <p className="text-sm text-gray-500">{item.status}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-dashed border-2">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Truck className="h-16 w-16 text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Delivery Tracking</h3>
          <p className="text-gray-500 text-sm mt-1 text-center max-w-md">
            Schedule pickups and deliveries, track driver locations, and notify customers automatically.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
