"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Search, Filter, ShoppingCart } from "lucide-react"
import { useOrganization } from "@/components/providers/organization-provider"
import { useState } from "react"

export default function CatalogPage() {
  const { organization } = useOrganization()
  const [searchQuery, setSearchQuery] = useState("")

  if (!organization) return null

  const parts = [
    { name: "Fuel Injector Set (4pcs)", partNo: "23670-30050", price: 420, category: "Engine", stock: 8 },
    { name: "Front Brake Pads Set", partNo: "04465-0K240", price: 65, category: "Brakes", stock: 24 },
    { name: "Oil Filter", partNo: "04152-YZZA1", price: 12, category: "Filters", stock: 50 },
    { name: "Timing Chain Kit", partNo: "13507-21020", price: 280, category: "Engine", stock: 6 },
    { name: "Alternator", partNo: "27060-75310", price: 280, category: "Electrical", stock: 4 },
    { name: "Radiator Assembly", partNo: "16400-31520", price: 220, category: "Cooling", stock: 4 },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            Parts Catalog
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Browse and order genuine spare parts
          </p>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            className="w-full pl-10 pr-4 py-3 border rounded-lg"
            placeholder="Search by part number, name, or vehicle..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {parts.filter(p => 
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.partNo.toLowerCase().includes(searchQuery.toLowerCase())
        ).map((part, i) => (
          <Card key={i} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-3">
                <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
                  {part.category}
                </span>
                <span className={`text-xs ${part.stock > 5 ? 'text-green-600' : 'text-amber-600'}`}>
                  {part.stock} in stock
                </span>
              </div>
              <h3 className="font-semibold mb-1">{part.name}</h3>
              <p className="text-sm text-gray-500 font-mono mb-4">{part.partNo}</p>
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-green-600">${part.price}</span>
                <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                  <ShoppingCart className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
