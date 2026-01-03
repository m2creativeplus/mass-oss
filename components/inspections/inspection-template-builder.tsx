"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { 
  Plus, 
  Search, 
  ClipboardList,
  GripVertical,
  ChevronDown,
  ChevronRight,
  Edit,
  Trash2,
  Copy,
  Star,
  CarFront,
  CheckCircle2,
  AlertCircle,
  XCircle
} from "lucide-react"
import { cn } from "@/lib/utils"

// Mock templates - in production, use useQuery(api.functions.getInspectionTemplates)
const mockTemplates = [
  {
    _id: "1",
    name: "18-Point Inspection",
    description: "Standard comprehensive vehicle inspection",
    vehicleType: "All",
    isDefault: true,
    isActive: true,
    groups: [
      {
        id: "g1",
        name: "Exterior",
        order: 1,
        tasks: [
          { id: "t1", name: "Front Bumper", order: 1, defaultFindings: ["Good", "Scratched", "Cracked"] },
          { id: "t2", name: "Headlights", order: 2, defaultFindings: ["Good", "Dim", "Not Working"] },
          { id: "t3", name: "Windshield", order: 3, defaultFindings: ["Good", "Cracked", "Chipped"] },
          { id: "t4", name: "Tires (4x)", order: 4, defaultFindings: ["Good", "Low Tread", "Replace Soon", "Replace Now"] },
        ]
      },
      {
        id: "g2",
        name: "Under Hood",
        order: 2,
        tasks: [
          { id: "t5", name: "Engine Oil Level", order: 1, defaultFindings: ["Good", "Low", "Dirty - Needs Change"] },
          { id: "t6", name: "Coolant Level", order: 2, defaultFindings: ["Good", "Low", "Needs Flush"] },
          { id: "t7", name: "Battery Condition", order: 3, defaultFindings: ["Good", "Weak", "Replace Soon"] },
          { id: "t8", name: "Belts & Hoses", order: 4, defaultFindings: ["Good", "Cracking", "Replace"] },
        ]
      },
      {
        id: "g3",
        name: "Brakes",
        order: 3,
        tasks: [
          { id: "t9", name: "Front Brake Pads", order: 1, defaultFindings: ["Good (>5mm)", "Worn 50%", "Needs Replacement (<3mm)"] },
          { id: "t10", name: "Rear Brake Pads", order: 2, defaultFindings: ["Good (>5mm)", "Worn 50%", "Needs Replacement (<3mm)"] },
          { id: "t11", name: "Brake Fluid", order: 3, defaultFindings: ["Good", "Dark - Due for Change", "Low"] },
          { id: "t12", name: "Rotors", order: 4, defaultFindings: ["Good", "Grooved", "Warped - Replace"] },
        ]
      },
      {
        id: "g4",
        name: "Performance",
        order: 4,
        tasks: [
          { id: "t13", name: "Suspension", order: 1, defaultFindings: ["Good", "Worn Bushings", "Leaking Shocks"] },
          { id: "t14", name: "Steering", order: 2, defaultFindings: ["Good", "Play in Wheel", "Noise"] },
          { id: "t15", name: "Transmission", order: 3, defaultFindings: ["Good", "Slipping", "Hard Shifts"] },
          { id: "t16", name: "Exhaust", order: 4, defaultFindings: ["Good", "Rust", "Leak"] },
        ]
      },
    ]
  },
  {
    _id: "2",
    name: "Pre-Purchase Inspection",
    description: "Thorough inspection for vehicle purchase decisions",
    vehicleType: "All",
    isDefault: false,
    isActive: true,
    groups: [
      {
        id: "g1",
        name: "Body & Frame",
        order: 1,
        tasks: [
          { id: "t1", name: "Frame Condition", order: 1, defaultFindings: ["No Issues", "Minor Rust", "Accident Damage"] },
          { id: "t2", name: "Paint Condition", order: 2, defaultFindings: ["Original", "Repainted", "Mismatched Panels"] },
          { id: "t3", name: "Accident History Signs", order: 3, defaultFindings: ["None Found", "Previous Repair Signs"] },
        ]
      },
    ]
  },
  {
    _id: "3",
    name: "Oil Change Inspection",
    description: "Quick check during oil service",
    vehicleType: "All",
    isDefault: false,
    isActive: true,
    groups: [
      {
        id: "g1",
        name: "Fluids & Filters",
        order: 1,
        tasks: [
          { id: "t1", name: "Engine Oil", order: 1, defaultFindings: ["Changed", "Dirty", "Low"] },
          { id: "t2", name: "Oil Filter", order: 2, defaultFindings: ["Replaced", "Original"] },
          { id: "t3", name: "Air Filter", order: 3, defaultFindings: ["Good", "Dirty - Recommend Replacement"] },
        ]
      },
    ]
  },
]

export function InspectionTemplateBuilder() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [expandedTemplate, setExpandedTemplate] = useState<string | null>("1")
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(["g1"]))

  const toggleGroup = (groupId: string) => {
    const newExpanded = new Set(expandedGroups)
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId)
    } else {
      newExpanded.add(groupId)
    }
    setExpandedGroups(newExpanded)
  }

  const filteredTemplates = mockTemplates.filter(t =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getTotalTasks = (template: typeof mockTemplates[0]) => {
    return template.groups.reduce((sum, g) => sum + g.tasks.length, 0)
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Inspection Templates</h1>
          <p className="text-muted-foreground">Create custom DVI checklists for your shop</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-orange-500 hover:bg-orange-600">
              <Plus className="h-4 w-4 mr-2" />
              New Template
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Inspection Template</DialogTitle>
              <DialogDescription>
                Build a custom checklist with groups and tasks
              </DialogDescription>
            </DialogHeader>
            <TemplateForm onClose={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                <ClipboardList className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockTemplates.length}</p>
                <p className="text-xs text-muted-foreground">Templates</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{getTotalTasks(mockTemplates[0])}</p>
                <p className="text-xs text-muted-foreground">Tasks in Default</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Star className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">1</p>
                <p className="text-xs text-muted-foreground">Default Template</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <CarFront className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockTemplates.filter(t => t.vehicleType !== "All").length}</p>
                <p className="text-xs text-muted-foreground">Vehicle-Specific</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search templates..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Templates List */}
      <div className="space-y-4">
        {filteredTemplates.map((template) => (
          <Card 
            key={template._id} 
            className={cn(
              "glass-card transition-all duration-200",
              expandedTemplate === template._id && "ring-2 ring-orange-500"
            )}
          >
            <CardHeader 
              className="cursor-pointer"
              onClick={() => setExpandedTemplate(
                expandedTemplate === template._id ? null : template._id
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {expandedTemplate === template._id ? (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      {template.isDefault && (
                        <Badge className="bg-orange-500 text-white">Default</Badge>
                      )}
                    </div>
                    <CardDescription>
                      {template.description} • {template.groups.length} groups • {getTotalTasks(template)} tasks
                    </CardDescription>
                  </div>
                </div>
                <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                  <Button size="icon" variant="ghost" className="h-8 w-8">
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            {/* Expanded Content */}
            {expandedTemplate === template._id && (
              <CardContent className="border-t pt-4">
                <div className="space-y-3">
                  {template.groups.map((group) => (
                    <div key={group.id} className="border rounded-lg overflow-hidden">
                      <div 
                        className="flex items-center justify-between p-3 bg-muted/50 cursor-pointer"
                        onClick={() => toggleGroup(group.id)}
                      >
                        <div className="flex items-center gap-2">
                          <GripVertical className="h-4 w-4 text-muted-foreground" />
                          {expandedGroups.has(group.id) ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                          <span className="font-medium">{group.name}</span>
                          <Badge variant="outline">{group.tasks.length} tasks</Badge>
                        </div>
                        <Button size="sm" variant="ghost">
                          <Plus className="h-3 w-3 mr-1" /> Add Task
                        </Button>
                      </div>

                      {expandedGroups.has(group.id) && (
                        <div className="p-3 space-y-2">
                          {group.tasks.map((task) => (
                            <div 
                              key={task.id}
                              className="flex items-center justify-between p-2 rounded-lg bg-background border"
                            >
                              <div className="flex items-center gap-2">
                                <GripVertical className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{task.name}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                {task.defaultFindings && (
                                  <div className="flex gap-1">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                    <AlertCircle className="h-4 w-4 text-amber-500" />
                                    <XCircle className="h-4 w-4 text-red-500" />
                                  </div>
                                )}
                                <Button size="icon" variant="ghost" className="h-6 w-6">
                                  <Edit className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
                  <Button variant="outline">
                    <Copy className="h-4 w-4 mr-2" />
                    Duplicate
                  </Button>
                  <Button className="bg-orange-500 hover:bg-orange-600">
                    <Star className="h-4 w-4 mr-2" />
                    Set as Default
                  </Button>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}

// Form for creating templates
function TemplateForm({ onClose }: { onClose: () => void }) {
  const [groups, setGroups] = useState([
    { id: "1", name: "", tasks: [{ id: "1", name: "", findings: "" }] }
  ])

  const addGroup = () => {
    setGroups([...groups, { 
      id: String(Date.now()), 
      name: "", 
      tasks: [{ id: String(Date.now()), name: "", findings: "" }] 
    }])
  }

  const addTask = (groupId: string) => {
    setGroups(groups.map(g => {
      if (g.id === groupId) {
        return { ...g, tasks: [...g.tasks, { id: String(Date.now()), name: "", findings: "" }] }
      }
      return g
    }))
  }

  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Label>Template Name</Label>
          <Input placeholder="e.g., 18-Point Inspection" />
        </div>
        <div>
          <Label>Vehicle Type</Label>
          <Input placeholder="All, Toyota, SUV, etc." />
        </div>
        <div>
          <Label>Description</Label>
          <Input placeholder="Brief description..." />
        </div>
      </div>

      {/* Groups */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h4 className="font-semibold">Inspection Groups</h4>
          <Button size="sm" variant="outline" onClick={addGroup}>
            <Plus className="h-3 w-3 mr-1" /> Add Group
          </Button>
        </div>

        <div className="space-y-4">
          {groups.map((group, gi) => (
            <div key={group.id} className="border rounded-lg p-4">
              <div className="flex gap-2 mb-3">
                <Input 
                  placeholder={`Group ${gi + 1} name (e.g., Exterior)`}
                  className="flex-1"
                />
                <Button size="icon" variant="ghost" className="text-red-500">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2 pl-4">
                {group.tasks.map((task, ti) => (
                  <div key={task.id} className="flex gap-2">
                    <Input 
                      placeholder={`Task ${ti + 1} (e.g., Front Bumper)`}
                      className="flex-1"
                    />
                    <Input 
                      placeholder="Findings (comma-separated)"
                      className="flex-1"
                    />
                    <Button size="icon" variant="ghost" className="text-red-500 h-10 w-10">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="text-orange-500"
                  onClick={() => addTask(group.id)}
                >
                  <Plus className="h-3 w-3 mr-1" /> Add Task
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button className="bg-orange-500 hover:bg-orange-600">
          Save Template
        </Button>
      </div>
    </div>
  )
}

export default InspectionTemplateBuilder
