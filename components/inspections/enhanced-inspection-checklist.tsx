"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Camera, 
  Video,
  Upload,
  Wrench,
  Settings,
  Gauge,
  Car,
  ArrowLeft,
  ArrowRight,
  Save,
  Square
} from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface InspectionPoint {
  id: string
  category: string
  item: string
  status: "good" | "attention" | "urgent" | "unchecked"
  notes?: string
  photos?: string[]
}

const inspectionCategories = [
  { id: "exterior", label: "Exterior", icon: Car },
  { id: "interior", label: "Interior", icon: Settings },
  { id: "engine", label: "Engine", icon: Wrench },
  { id: "performance", label: "Performance", icon: Gauge },
]

const initialInspectionPoints: InspectionPoint[] = [
  { id: "1", category: "exterior", item: "Front Bumper", status: "unchecked" },
  { id: "2", category: "exterior", item: "Headlights", status: "unchecked" },
  { id: "3", category: "exterior", item: "Windshield", status: "unchecked" },
  { id: "4", category: "exterior", item: "Tires (4x)", status: "unchecked" },
  { id: "5", category: "interior", item: "Dashboard Controls", status: "unchecked" },
  { id: "6", category: "interior", item: "Seats & Upholstery", status: "unchecked" },
  { id: "7", category: "interior", item: "Air Conditioning", status: "unchecked" },
  { id: "8", category: "engine", item: "Engine Oil Level", status: "unchecked" },
  { id: "9", category: "engine", item: "Coolant Level", status: "unchecked" },
  { id: "10", category: "engine", item: "Battery Condition", status: "unchecked" },
  { id: "11", category: "performance", item: "Brake System", status: "unchecked" },
  { id: "12", category: "performance", item: "Suspension", status: "unchecked" },
]

export function EnhancedInspectionChecklist() {
  const [activeCategory, setActiveCategory] = useState("exterior")
  const [inspectionPoints, setInspectionPoints] = useState<InspectionPoint[]>(initialInspectionPoints)
  const [selectedPoint, setSelectedPoint] = useState<string | null>(null)

  const updatePointStatus = (id: string, status: InspectionPoint["status"]) => {
    setInspectionPoints(prev => 
      prev.map(point => point.id === id ? { ...point, status } : point)
    )
  }

  const getStatusConfig = (status: InspectionPoint["status"]) => {
    switch (status) {
      case "good":
        return { 
          icon: CheckCircle2, 
          color: "text-emerald-500", 
          bg: "bg-emerald-100 dark:bg-emerald-900/30",
          border: "border-emerald-300 dark:border-emerald-700",
          label: "Good"
        }
      case "attention":
        return { 
          icon: AlertCircle, 
          color: "text-amber-500", 
          bg: "bg-amber-100 dark:bg-amber-900/30",
          border: "border-amber-300 dark:border-amber-700",
          label: "Needs Attention"
        }
      case "urgent":
        return { 
          icon: XCircle, 
          color: "text-red-500", 
          bg: "bg-red-100 dark:bg-red-900/30",
          border: "border-red-300 dark:border-red-700",
          label: "Urgent Repair"
        }
      default:
        return { 
          icon: AlertCircle, 
          color: "text-gray-400", 
          bg: "bg-gray-100 dark:bg-gray-800",
          border: "border-gray-300 dark:border-gray-700",
          label: "Not Checked"
        }
    }
  }

  const categoryPoints = inspectionPoints.filter(p => p.category === activeCategory)
  const progress = inspectionPoints.filter(p => p.status !== "unchecked").length
  const total = inspectionPoints.length
  const progressPercent = Math.round((progress / total) * 100)

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header with Progress */}
      <Card className="glass-card border-none shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Digital Vehicle Inspection</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Vehicle: <span className="font-semibold">Toyota Land Cruiser - ABC-1234</span>
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary">{progressPercent}%</div>
              <p className="text-xs text-muted-foreground">{progress} of {total} checked</p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4 h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-orange-500 to-orange-600 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </CardHeader>
      </Card>

      {/* Category Tabs */}
      <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
        <TabsList className="grid w-full grid-cols-4 glass-card p-1">
          {inspectionCategories.map(category => {
            const CategoryIcon = category.icon
            const categoryProgress = inspectionPoints.filter(
              p => p.category === category.id && p.status !== "unchecked"
            ).length
            const categoryTotal = inspectionPoints.filter(p => p.category === category.id).length
            
            return (
              <TabsTrigger 
                key={category.id} 
                value={category.id}
                className="flex flex-col items-center gap-1 py-3"
              >
                <CategoryIcon className="h-5 w-5" />
                <span className="text-xs font-medium">{category.label}</span>
                <span className="text-[10px] text-muted-foreground">
                  {categoryProgress}/{categoryTotal}
                </span>
              </TabsTrigger>
            )
          })}
        </TabsList>

        {inspectionCategories.map(category => (
          <TabsContent key={category.id} value={category.id} className="mt-6">
            <div className="grid gap-4">
              {categoryPoints.map((point, index) => {
                const config = getStatusConfig(point.status)
                const StatusIcon = config.icon
                
                return (
                  <Card 
                    key={point.id}
                    className={cn(
                      "glass-card hover:shadow-md transition-all duration-200 cursor-pointer",
                      selectedPoint === point.id && "ring-2 ring-primary"
                    )}
                    onClick={() => setSelectedPoint(point.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4 flex-1">
                          <div className={cn(
                            "h-12 w-12 rounded-lg flex items-center justify-center",
                            config.bg
                          )}>
                            <StatusIcon className={cn("h-6 w-6", config.color)} />
                          </div>
                          
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm">{point.item}</h4>
                            <Badge 
                              variant="outline" 
                              className={cn("text-xs mt-1", config.color, config.border)}
                            >
                              {config.label}
                            </Badge>
                          </div>
                        </div>

                        {/* Status Buttons */}
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant={point.status === "good" ? "default" : "outline"}
                            className={cn(
                              "h-8 w-8 p-0",
                              point.status === "good" && "bg-emerald-500 hover:bg-emerald-600"
                            )}
                            onClick={(e) => {
                              e.stopPropagation()
                              updatePointStatus(point.id, "good")
                            }}
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </Button>
                          
                          <Button
                            size="sm"
                            variant={point.status === "attention" ? "default" : "outline"}
                            className={cn(
                              "h-8 w-8 p-0",
                              point.status === "attention" && "bg-amber-500 hover:bg-amber-600"
                            )}
                            onClick={(e) => {
                              e.stopPropagation()
                              updatePointStatus(point.id, "attention")
                            }}
                          >
                            <AlertCircle className="h-4 w-4" />
                          </Button>
                          
                          <Button
                            size="sm"
                            variant={point.status === "urgent" ? "default" : "outline"}
                            className={cn(
                              "h-8 w-8 p-0",
                              point.status === "urgent" && "bg-red-500 hover:bg-red-600"
                            )}
                            onClick={(e) => {
                              e.stopPropagation()
                              updatePointStatus(point.id, "urgent")
                            }}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>

                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0"
                            title="Take Photo"
                          >
                            <Camera className="h-4 w-4" />
                          </Button>

                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:border-red-300"
                            title="Record Video"
                          >
                            <Video className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Notes Section - Shows when selected */}
                      {selectedPoint === point.id && (
                        <div className="mt-4 pt-4 border-t space-y-3 animate-fade-in-up">
                          <textarea
                            placeholder="Add notes about this inspection point..."
                            className="w-full p-3 rounded-lg border bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                            rows={3}
                          />
                          
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="flex-1">
                              <Upload className="h-4 w-4 mr-2" />
                              Upload Photo
                            </Button>
                            <Button size="sm" variant="outline">
                              <Save className="h-4 w-4 mr-2" />
                              Save Note
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-end">
        <Button variant="outline" className="glass-card">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Button className="bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20">
          Complete Inspection
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}
