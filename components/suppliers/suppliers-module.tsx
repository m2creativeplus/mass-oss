"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Search, 
  Plus, 
  ExternalLink,
  Package,
  Truck
} from "lucide-react"
import { useState } from "react"

interface Supplier {
  id: string
  name: string
  contactPerson: string
  category: "OEM Parts" | "Aftermarket" | "Consumables" | "Equipment"
  email: string
  phone: string
  location: string
  rating: number
  status: "active" | "inactive"
  lastOrder: string
}

const mockSuppliers: Supplier[] = [
  {
    id: "1",
    name: "AutoParts Pro Ltd",
    contactPerson: "Ahmed Yasin",
    category: "OEM Parts",
    email: "orders@autopartspro.com",
    phone: "+252 63 444 5555",
    location: "Hargeisa, Industrial Area",
    rating: 4.8,
    status: "active",
    lastOrder: "2025-12-20"
  },
  {
    id: "2",
    name: "Global Auto Imports",
    contactPerson: "Sarah Johnson",
    category: "Aftermarket",
    email: "sales@globalauto.com",
    phone: "+971 50 123 4567",
    location: "Dubai, UAE",
    rating: 4.5,
    status: "active",
    lastOrder: "2025-12-15"
  },
  {
    id: "3",
    name: "Local Tools & Gear",
    contactPerson: "Omar Ali",
    category: "Equipment",
    email: "omar@localtools.so",
    phone: "+252 65 987 6543",
    location: "Berbera, Port Zone",
    rating: 4.2,
    status: "inactive",
    lastOrder: "2025-10-30"
  }
]

export default function SuppliersModule() {
  const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.location.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Supplier Directory</h1>
          <p className="text-muted-foreground mt-1">Manage parts vendors and supply chain partners</p>
        </div>
        <Button className="bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20">
          <Plus className="mr-2 h-4 w-4" />
          Add Vendor
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-card">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Suppliers</p>
              <h3 className="text-2xl font-bold">{suppliers.length}</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600">
              <Package className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Orders</p>
              <h3 className="text-2xl font-bold">12</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600">
              <Truck className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Shipments Due</p>
              <h3 className="text-2xl font-bold">4</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="glass-card">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search suppliers by name, category, or location..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Supplier Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSuppliers.map((supplier, index) => (
          <Card 
            key={supplier.id} 
            className="glass-card hover:shadow-lg transition-all duration-200 group animate-slide-in-left"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="h-12 w-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-lg text-slate-600 dark:text-slate-400">
                  {supplier.name.substring(0, 2).toUpperCase()}
                </div>
                <Badge variant={supplier.status === "active" ? "default" : "secondary"}>
                  {supplier.status}
                </Badge>
              </div>
              <CardTitle className="mt-4 text-xl">{supplier.name}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs">{supplier.category}</Badge>
                <div className="flex text-amber-500 text-xs">
                  {'★'.repeat(Math.round(supplier.rating))}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex items-center text-muted-foreground">
                  <User className="h-4 w-4 mr-2" />
                  {supplier.contactPerson}
                </div>
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-2" />
                  {supplier.location}
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Phone className="h-4 w-4 mr-2" />
                  {supplier.phone}
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Mail className="h-4 w-4 mr-2" />
                  {supplier.email}
                </div>
              </div>
              
              <div className="pt-4 border-t flex gap-2">
                <Button className="flex-1" size="sm" variant="outline">
                  View Catalog
                </Button>
                <Button className="flex-1 bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900" size="sm">
                  Create Order
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function User(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}
