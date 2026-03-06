"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Network, Plus, MapPin, Building2, Wrench, Car } from "lucide-react"
import { useOrganization } from "@/components/providers/organization-provider"

export default function NetworkPage() {
  const { organization } = useOrganization()

  if (!organization) return null

  const partners = [
    { name: "Hargeisa Auto Parts", type: "Spare Parts", city: "Hargeisa", status: "Active" },
    { name: "Dubai Car Imports", type: "Importer", city: "Dubai", status: "Active" },
    { name: "Al-Salam Garage", type: "Partner Garage", city: "Hargeisa", status: "Active" },
    { name: "Toyota East Africa", type: "Distributor", city: "Nairobi", status: "Prospect" },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-700 flex items-center justify-center">
              <Network className="h-5 w-5 text-white" />
            </div>
            Stakeholder Network
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Automotive ecosystem partners and connections
          </p>
        </div>
        <Button className="bg-cyan-600 hover:bg-cyan-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Partner
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          { icon: Building2, label: "Total Partners", value: "24" },
          { icon: Wrench, label: "Garages", value: "8" },
          { icon: Car, label: "Importers", value: "6" },
          { icon: MapPin, label: "Cities Covered", value: "5" },
        ].map((stat, i) => {
          const Icon = stat.icon
          return (
            <Card key={i}>
              <CardContent className="p-4 flex items-center gap-3">
                <Icon className="h-8 w-8 text-cyan-600" />
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-slate-800">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Partner Name</th>
                <th className="px-4 py-3 text-left font-semibold">Type</th>
                <th className="px-4 py-3 text-left font-semibold">City</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {partners.map((partner, i) => (
                <tr key={i} className="border-t hover:bg-gray-50 dark:hover:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium">{partner.name}</td>
                  <td className="px-4 py-3">{partner.type}</td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {partner.city}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      partner.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {partner.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Button size="sm" variant="outline">View</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
