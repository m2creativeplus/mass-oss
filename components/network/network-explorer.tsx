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
  ShieldCheck,
  Filter,
  Network,
  Fuel,
  Wrench,
  Car,
  CircleDollarSign
} from "lucide-react"
import { useState } from "react"
import { motion } from "framer-motion"

// Category Icons Map
const categoryIcons: Record<string, typeof Wrench> = {
  garage: Wrench,
  spare_parts: Building2,
  car_dealer: Car,
  tire_shop: CircleDollarSign,
  fuel_station: Fuel,
  fleet_operator: Network,
  oil_lubricants: Fuel,
  batteries: CircleDollarSign,
  tools_equipment: Wrench,
}

// Static POI data (will be replaced by Convex when connected)
const staticPois = [
  { _id: "1", businessName: "MASS Auto Parts", category: "spare_parts", city: "Hargeisa", phone: "+252-63-4521789", email: "info@massauto.com", address: "Main Road, Hargeisa", isActive: true, source: "gold_standard" },
  { _id: "2", businessName: "Toyota Kenya Hargeisa", category: "car_dealer", city: "Hargeisa", phone: "+252-63-8765432", email: "sales@toyota-hga.com", address: "Airport Road", isActive: true, source: "api_import" },
  { _id: "3", businessName: "Gulf Oil Station", category: "fuel_station", city: "Hargeisa", phone: "+252-63-1234567", email: null, address: "Independence Ave", isActive: true, source: "manual" },
  { _id: "4", businessName: "Al-Baraka Tire Center", category: "tire_shop", city: "Burao", phone: "+252-63-9876543", email: "tires@albaraka.com", address: "Main Market", isActive: true, source: "api_import" },
  { _id: "5", businessName: "Berbera Fleet Services", category: "fleet_operator", city: "Berbera", phone: "+252-63-5678901", email: "fleet@berbera.com", address: "Port Road", isActive: false, source: "gold_standard" },
  { _id: "6", businessName: "Daallo Garage", category: "garage", city: "Hargeisa", phone: "+252-63-3456789", email: "service@daallo.com", address: "Industrial Area", isActive: true, source: "api_import" },
]

// Animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
      delay: i * 0.05
    }
  }),
}

export default function NetworkExplorer() {
  const pois = staticPois // Will use useQuery(api.functions.getAutomotivePois) when Convex is connected
  const [searchTerm, setSearchTerm] = useState("")
  const [cityFilter, setCityFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")

  // Get unique cities and categories for filters
  const cities = Array.from(new Set(pois.map(p => p.city)))
  const categories = Array.from(new Set(pois.map(p => p.category)))

  // Filtering logic
  const filteredPois = pois.filter(poi => {
    const matchesSearch = 
      poi.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      poi.city.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCity = cityFilter === "all" || poi.city === cityFilter
    const matchesCategory = categoryFilter === "all" || poi.category === categoryFilter
    return matchesSearch && matchesCity && matchesCategory
  })

  // Stats
  const verifiedCount = pois.filter(p => p.source?.includes("api") || p.source?.includes("import")).length
  const activeCount = pois.filter(p => p.isActive).length

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Network className="h-8 w-8 text-orange-500" />
            Stakeholder Network
          </h1>
          <p className="text-muted-foreground mt-1">Automotive businesses across Somaliland</p>
        </div>
        <Button className="bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20">
          <Plus className="mr-2 h-4 w-4" />
          Add Business
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass-card border-l-4 border-l-blue-500">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total POIs</p>
              <h3 className="text-xl font-bold">{pois.length}</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card border-l-4 border-l-emerald-500">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Verified (API)</p>
              <h3 className="text-xl font-bold">{verifiedCount}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-l-4 border-l-amber-500">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Cities</p>
              <h3 className="text-xl font-bold">{cities.length}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-l-4 border-l-purple-500">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600">
              <Filter className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Categories</p>
              <h3 className="text-xl font-bold">{categories.length}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="glass-card">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by name or city..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="px-3 py-2 border rounded-md bg-background text-sm"
            >
              <option value="all">All Cities</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border rounded-md bg-background text-sm"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat.replace(/_/g, ' ').toUpperCase()}</option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <p className="text-sm text-muted-foreground">
        Showing {filteredPois.length} of {pois.length} results
      </p>

      {/* POI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPois.map((poi, index) => {
          const IconComponent = categoryIcons[poi.category] || Building2
          const isVerified = poi.source?.includes("api") || poi.source?.includes("import")
          
          return (
            <motion.div
              key={poi._id}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
            >
              <Card className="glass-card hover:shadow-lg transition-all duration-200 group h-full">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="h-12 w-12 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600">
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <div className="flex gap-2">
                      {isVerified && (
                        <Badge className="bg-emerald-500 text-white text-xs">
                          <ShieldCheck className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                      <Badge variant={poi.isActive ? "default" : "secondary"}>
                        {poi.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                  <CardTitle className="mt-4 text-lg">{poi.businessName}</CardTitle>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <Badge variant="outline" className="text-xs capitalize">
                      {poi.category.replace(/_/g, ' ')}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      <MapPin className="h-3 w-3 mr-1" />
                      {poi.city}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2 text-sm">
                    {poi.phone && (
                      <div className="flex items-center text-muted-foreground">
                        <Phone className="h-4 w-4 mr-2" />
                        {poi.phone}
                      </div>
                    )}
                    {poi.email && (
                      <div className="flex items-center text-muted-foreground">
                        <Mail className="h-4 w-4 mr-2" />
                        {poi.email}
                      </div>
                    )}
                    {poi.address && (
                      <div className="flex items-center text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-2" />
                        {poi.address}
                      </div>
                    )}
                  </div>
                  
                  {poi.source && (
                    <div className="pt-3 border-t">
                      <span className="text-xs text-muted-foreground">
                        Source: <span className="font-medium">{poi.source}</span>
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Empty State */}
      {filteredPois.length === 0 && (
        <Card className="glass-card p-12 text-center">
          <Network className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-semibold">No results found</h3>
          <p className="text-muted-foreground mt-1">Try adjusting your search or filters</p>
        </Card>
      )}
    </div>
  )
}
