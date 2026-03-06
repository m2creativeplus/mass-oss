"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CarFront, Plus, Search, Filter } from "lucide-react"
import { useOrganization } from "@/components/providers/organization-provider"

export default function CarRequestPage() {
  const { organization } = useOrganization()

  if (!organization) return null

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
              <CarFront className="h-5 w-5 text-white" />
            </div>
            Vehicle Requests
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage customer vehicle purchase and sourcing requests
          </p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          New Request
        </Button>
      </div>

      <Card className="border-dashed border-2">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <CarFront className="h-16 w-16 text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">No Vehicle Requests Yet</h3>
          <p className="text-gray-500 text-sm mt-1 text-center max-w-md">
            When customers request specific vehicles (make, model, year), they will appear here for your sourcing team to fulfill.
          </p>
          <Button variant="outline" className="mt-4">
            <Plus className="h-4 w-4 mr-2" />
            Create First Request
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
