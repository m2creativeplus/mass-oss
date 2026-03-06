"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UserCheck, Plus, Star, Wrench } from "lucide-react"
import { useOrganization } from "@/components/providers/organization-provider"

export default function TechniciansPage() {
  const { organization } = useOrganization()

  if (!organization) return null

  const mechanics = [
    { name: "Ibrahim Yusuf", specialty: "Engine", rating: 4.8, jobs: 156, status: "Available" },
    { name: "Ahmed Hassan", specialty: "Electrical", rating: 4.6, jobs: 124, status: "Busy" },
    { name: "Mohamed Ali", specialty: "Suspension", rating: 4.9, jobs: 189, status: "Available" },
    { name: "Omar Farah", specialty: "Brakes", rating: 4.7, jobs: 142, status: "On Leave" },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center">
              <UserCheck className="h-5 w-5 text-white" />
            </div>
            Mechanics Portal
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage your technician team and assignments
          </p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Mechanic
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {mechanics.map((mech, i) => (
          <Card key={i} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                  {mech.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="font-semibold">{mech.name}</h3>
                  <p className="text-sm text-gray-500">{mech.specialty}</p>
                </div>
              </div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                  <span className="text-sm font-semibold">{mech.rating}</span>
                </div>
                <span className="text-sm text-gray-500">{mech.jobs} jobs</span>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs ${
                mech.status === 'Available' ? 'bg-green-100 text-green-700' :
                mech.status === 'Busy' ? 'bg-amber-100 text-amber-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {mech.status}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
