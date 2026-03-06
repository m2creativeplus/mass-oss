"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ClipboardCheck, Plus } from "lucide-react"
import { useOrganization } from "@/components/providers/organization-provider"

export default function InspectionTemplatesPage() {
  const { organization } = useOrganization()

  if (!organization) return null

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center">
              <ClipboardCheck className="h-5 w-5 text-white" />
            </div>
            DVI Templates
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Digital Vehicle Inspection checklist templates
          </p>
        </div>
        <Button className="bg-teal-600 hover:bg-teal-700">
          <Plus className="h-4 w-4 mr-2" />
          New Template
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { name: "18-Point Inspection", items: 18, type: "Standard" },
          { name: "Pre-Purchase Inspection", items: 45, type: "Comprehensive" },
          { name: "Brake System Check", items: 12, type: "Specialty" },
        ].map((template, i) => (
          <Card key={i} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{template.name}</h3>
                  <p className="text-sm text-gray-500">{template.items} inspection points</p>
                </div>
                <span className="px-2 py-1 bg-teal-100 text-teal-700 text-xs rounded-full">
                  {template.type}
                </span>
              </div>
              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm">Edit</Button>
                <Button variant="outline" size="sm">Duplicate</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
