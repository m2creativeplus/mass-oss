"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ClipboardList, Plus, Wrench } from "lucide-react"
import { useOrganization } from "@/components/providers/organization-provider"

export default function CannedJobsPage() {
  const { organization } = useOrganization()

  if (!organization) return null

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center">
              <ClipboardList className="h-5 w-5 text-white" />
            </div>
            Canned Jobs Library
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Pre-configured service packages with parts and labor
          </p>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700">
          <Plus className="h-4 w-4 mr-2" />
          Create Package
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {["Oil Change - Synthetic", "Brake Pad Replacement", "Full Service Package"].map((job, i) => (
          <Card key={i} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <Wrench className="h-5 w-5 text-purple-500" />
                <h3 className="font-semibold">{job}</h3>
              </div>
              <p className="text-sm text-gray-500 mb-3">Includes parts + labor bundle</p>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-green-600">${(49 + i * 75).toFixed(2)}</span>
                <span className="text-xs text-gray-400">{0.5 + i * 0.5}h labor</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-dashed border-2 mt-6">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-gray-500 text-sm">
            Create canned jobs to speed up estimate creation
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
