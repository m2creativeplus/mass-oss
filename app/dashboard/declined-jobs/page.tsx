"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileX, Phone, RefreshCw } from "lucide-react"
import { useOrganization } from "@/components/providers/organization-provider"

export default function DeclinedJobsPage() {
  const { organization } = useOrganization()

  if (!organization) return null

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
              <FileX className="h-5 w-5 text-white" />
            </div>
            Declined Jobs Tracker
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Follow up on declined service recommendations
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Declined", value: "24", color: "text-red-600" },
          { label: "This Month", value: "8", color: "text-amber-600" },
          { label: "Follow-up Pending", value: "12", color: "text-blue-600" },
          { label: "Recovered", value: "5", color: "text-green-600" },
        ].map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-4 text-center">
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-slate-800">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Customer</th>
                <th className="px-4 py-3 text-left font-semibold">Service</th>
                <th className="px-4 py-3 text-left font-semibold">Value</th>
                <th className="px-4 py-3 text-left font-semibold">Declined Date</th>
                <th className="px-4 py-3 text-center font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="px-4 py-3">Ahmed Hassan</td>
                <td className="px-4 py-3">Brake Pad Replacement</td>
                <td className="px-4 py-3 font-semibold text-green-600">$285</td>
                <td className="px-4 py-3 text-gray-500">Jan 5, 2026</td>
                <td className="px-4 py-3 text-center">
                  <Button size="sm" variant="outline">
                    <Phone className="h-3 w-3 mr-1" /> Follow Up
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
