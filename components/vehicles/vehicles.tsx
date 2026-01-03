"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { 
  Plus, 
  Eye,
  Pencil,
  Trash2,
  Car as CarIcon,
  Wrench,
  RefreshCw,
  Loader2,
  X,
  Check,
  AlertTriangle,
  User,
  Calendar,
  Gauge,
  Hash
} from "lucide-react"
import { database, Vehicle as DbVehicle } from "@/lib/database"

interface Vehicle {
  id: string
  make: string
  model: string
  year: number
  licensePlate: string
  vin: string
  color: string
  mileage: number
  owner: string
  status: "active" | "in-service" | "completed"
}

// Transform database vehicle to UI vehicle
function transformVehicle(dbVehicle: DbVehicle): Vehicle {
  const statusMap: Record<string, Vehicle['status']> = {
    'Active': 'active',
    'Maintenance': 'in-service',
    'Tax Due': 'completed'
  }
  return {
    id: dbVehicle.id,
    make: dbVehicle.make,
    model: dbVehicle.model,
    year: dbVehicle.year,
    licensePlate: dbVehicle.license_plate,
    vin: dbVehicle.vin,
    color: dbVehicle.color,
    mileage: dbVehicle.mileage,
    owner: 'Fleet Owner',
    status: statusMap[dbVehicle.status || ''] || 'active'
  }
}

// Demo data
const demoVehicles: Vehicle[] = [
  { id: "1", make: "Toyota", model: "Land Cruiser 79", year: 2019, licensePlate: "SL-82307-T", vin: "JTM8R5EV5JD789012", color: "White", mileage: 48000, owner: "Mohamed Ahmed", status: "active" },
  { id: "2", make: "Toyota", model: "Hilux", year: 2020, licensePlate: "SL-70115-G", vin: "JTM5R6EV1LD567890", color: "Gray", mileage: 28000, owner: "Sarah Hassan", status: "in-service" },
  { id: "3", make: "Nissan", model: "Patrol", year: 2018, licensePlate: "SL-61203-D", vin: "JN1TBNT30Z0000001", color: "Black", mileage: 85000, owner: "Ahmed Ali", status: "active" },
  { id: "4", make: "Mitsubishi", model: "Pajero", year: 2021, licensePlate: "SL-55401-P", vin: "JMYLYV97J1J000001", color: "Silver", mileage: 15000, owner: "Fatima Omar", status: "completed" },
]

const emptyVehicle = {
  make: "",
  model: "",
  year: new Date().getFullYear(),
  licensePlate: "",
  vin: "",
  color: "",
  mileage: 0,
  owner: "",
}

const colorOptions = ["White", "Black", "Gray", "Silver", "Red", "Blue", "Green", "Beige"]

export function Vehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(demoVehicles)
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  
  // Dialog states
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  const [formData, setFormData] = useState(emptyVehicle)

  const fetchVehicles = async () => {
    setLoading(true)
    try {
      const { data, error } = await database.vehicles.getAll()
      if (data && data.length > 0) {
        setVehicles(data.map(transformVehicle))
      }
    } catch (err) {
      console.error('Failed to fetch vehicles:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVehicles()
  }, [])

  const filteredVehicles = vehicles.filter(vehicle =>
    `${vehicle.make} ${vehicle.model}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vehicle.licensePlate.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vehicle.owner.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStatusBadge = (status: Vehicle["status"]) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>
      case "in-service":
        return <Badge className="bg-amber-500 hover:bg-amber-600">In Service</Badge>
      case "completed":
        return <Badge className="bg-blue-500 hover:bg-blue-600">Completed</Badge>
    }
  }

  const handleCreate = () => {
    setFormData(emptyVehicle)
    setIsCreateOpen(true)
  }

  const handleEdit = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle)
    setFormData({
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      licensePlate: vehicle.licensePlate,
      vin: vehicle.vin,
      color: vehicle.color,
      mileage: vehicle.mileage,
      owner: vehicle.owner,
    })
    setIsEditOpen(true)
  }

  const handleView = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle)
    setIsViewOpen(true)
  }

  const handleDelete = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle)
    setIsDeleteOpen(true)
  }

  const submitCreate = () => {
    const newVehicle: Vehicle = {
      id: String(Date.now()),
      ...formData,
      status: "active",
    }
    setVehicles([...vehicles, newVehicle])
    setIsCreateOpen(false)
    setFormData(emptyVehicle)
  }

  const submitEdit = () => {
    if (!selectedVehicle) return
    setVehicles(vehicles.map(v => 
      v.id === selectedVehicle.id ? { ...v, ...formData } : v
    ))
    setIsEditOpen(false)
    setSelectedVehicle(null)
  }

  const submitDelete = () => {
    if (!selectedVehicle) return
    setVehicles(vehicles.filter(v => v.id !== selectedVehicle.id))
    setIsDeleteOpen(false)
    setSelectedVehicle(null)
  }

  return (
    <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-950 p-6">
      
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white uppercase tracking-tight">
          Car Stock / Vehicle List
        </h2>
        
        <div className="flex gap-2 w-full md:w-auto">
          <Button variant="outline" size="sm" onClick={fetchVehicles} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          </Button>
          <Button className="bg-[#00A65A] hover:bg-[#008d4c] text-white" onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Add Vehicle
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-t-lg border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-600">Show</span>
          <select className="border border-slate-300 rounded px-2 py-1 text-sm bg-transparent">
            <option>10</option>
            <option>25</option>
            <option>50</option>
          </select>
          <span className="text-sm text-slate-600">entries</span>
        </div>
        
        <div className="relative w-64">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">Search:</span>
          <Input className="pl-16 h-8" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white dark:bg-slate-900 rounded-b-lg border border-t-0 border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-800 dark:text-slate-400 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-bold">Image</th>
              <th className="px-6 py-4 font-bold">Vehicle</th>
              <th className="px-6 py-4 font-bold">Plate / VIN</th>
              <th className="px-6 py-4 font-bold">Owner</th>
              <th className="px-6 py-4 font-bold">Mileage</th>
              <th className="px-6 py-4 font-bold">Color</th>
              <th className="px-6 py-4 font-bold">Status</th>
              <th className="px-6 py-4 font-bold text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {filteredVehicles.map((vehicle) => (
              <tr key={vehicle.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <td className="px-6 py-3">
                  <div className="h-10 w-10 rounded bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                    <CarIcon className="h-5 w-5 text-white" />
                  </div>
                </td>
                <td className="px-6 py-3 font-medium text-slate-900 dark:text-white">
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </td>
                <td className="px-6 py-3">
                  <div className="font-semibold text-orange-600">{vehicle.licensePlate}</div>
                  <div className="text-xs text-slate-500 font-mono">{vehicle.vin}</div>
                </td>
                <td className="px-6 py-3 text-slate-600">{vehicle.owner}</td>
                <td className="px-6 py-3 font-semibold">{vehicle.mileage.toLocaleString()} km</td>
                <td className="px-6 py-3">
                  <span className="inline-flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full border border-slate-300" style={{ backgroundColor: vehicle.color.toLowerCase() }}></span>
                    {vehicle.color}
                  </span>
                </td>
                <td className="px-6 py-3">{getStatusBadge(vehicle.status)}</td>
                <td className="px-6 py-3">
                  <div className="flex justify-center gap-2">
                    <Button size="icon" className="h-8 w-8 bg-[#00c0ef] hover:bg-[#00acd6] text-white rounded shadow-sm" onClick={() => handleView(vehicle)}>
                      <Wrench className="h-4 w-4" />
                    </Button>
                    <Button size="icon" className="h-8 w-8 bg-[#f39c12] hover:bg-[#d58512] text-white rounded shadow-sm" onClick={() => handleView(vehicle)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="icon" className="h-8 w-8 bg-[#3c8dbc] hover:bg-[#367fa9] text-white rounded shadow-sm" onClick={() => handleEdit(vehicle)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="icon" className="h-8 w-8 bg-[#dd4b39] hover:bg-[#d73925] text-white rounded shadow-sm" onClick={() => handleDelete(vehicle)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className="bg-slate-50 dark:bg-slate-800 px-4 py-3 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center sm:px-6">
          <div className="text-xs text-slate-500">Showing 1 to {filteredVehicles.length} of {vehicles.length} entries</div>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" className="h-7 text-xs" disabled>Previous</Button>
            <Button size="sm" className="h-7 text-xs bg-blue-500 text-white hover:bg-blue-600">1</Button>
            <Button variant="outline" size="sm" className="h-7 text-xs">Next</Button>
          </div>
        </div>
      </div>

      {/* CREATE VEHICLE DIALOG */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-green-500" />
              Add New Vehicle
            </DialogTitle>
            <DialogDescription>Enter vehicle details to register</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Make *</Label>
                <Input value={formData.make} onChange={(e) => setFormData({...formData, make: e.target.value})} placeholder="Toyota" />
              </div>
              <div>
                <Label>Model *</Label>
                <Input value={formData.model} onChange={(e) => setFormData({...formData, model: e.target.value})} placeholder="Land Cruiser" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Year</Label>
                <Input type="number" value={formData.year} onChange={(e) => setFormData({...formData, year: parseInt(e.target.value)})} />
              </div>
              <div>
                <Label>Color</Label>
                <select className="w-full border rounded-md p-2" value={formData.color} onChange={(e) => setFormData({...formData, color: e.target.value})}>
                  <option value="">Select...</option>
                  {colorOptions.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <Label>Mileage (km)</Label>
                <Input type="number" value={formData.mileage} onChange={(e) => setFormData({...formData, mileage: parseInt(e.target.value) || 0})} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>License Plate *</Label>
                <Input value={formData.licensePlate} onChange={(e) => setFormData({...formData, licensePlate: e.target.value})} placeholder="SL-XXXXX-X" />
              </div>
              <div>
                <Label>VIN</Label>
                <Input value={formData.vin} onChange={(e) => setFormData({...formData, vin: e.target.value})} placeholder="17-character VIN" />
              </div>
            </div>
            <div>
              <Label>Owner Name</Label>
              <Input value={formData.owner} onChange={(e) => setFormData({...formData, owner: e.target.value})} placeholder="Customer name" />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}><X className="h-4 w-4 mr-2" /> Cancel</Button>
            <Button className="bg-green-500 hover:bg-green-600" onClick={submitCreate} disabled={!formData.make || !formData.model || !formData.licensePlate}>
              <Check className="h-4 w-4 mr-2" /> Register Vehicle
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* EDIT VEHICLE DIALOG */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Pencil className="h-5 w-5 text-blue-500" /> Edit Vehicle</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Make</Label><Input value={formData.make} onChange={(e) => setFormData({...formData, make: e.target.value})} /></div>
              <div><Label>Model</Label><Input value={formData.model} onChange={(e) => setFormData({...formData, model: e.target.value})} /></div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div><Label>Year</Label><Input type="number" value={formData.year} onChange={(e) => setFormData({...formData, year: parseInt(e.target.value)})} /></div>
              <div><Label>Mileage</Label><Input type="number" value={formData.mileage} onChange={(e) => setFormData({...formData, mileage: parseInt(e.target.value) || 0})} /></div>
              <div><Label>Color</Label><select className="w-full border rounded-md p-2" value={formData.color} onChange={(e) => setFormData({...formData, color: e.target.value})}>{colorOptions.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
            </div>
            <div><Label>Owner</Label><Input value={formData.owner} onChange={(e) => setFormData({...formData, owner: e.target.value})} /></div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button className="bg-blue-500 hover:bg-blue-600" onClick={submitEdit}><Check className="h-4 w-4 mr-2" /> Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* VIEW VEHICLE DIALOG */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle className="flex items-center gap-2"><Eye className="h-5 w-5 text-orange-500" /> Vehicle Details</DialogTitle></DialogHeader>
          
          {selectedVehicle && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                  <CarIcon className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model}</h3>
                  <p className="text-orange-500 font-mono font-bold">{selectedVehicle.licensePlate}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div className="flex items-center gap-2"><User className="h-4 w-4 text-slate-400" /><span className="text-sm">{selectedVehicle.owner}</span></div>
                <div className="flex items-center gap-2"><Gauge className="h-4 w-4 text-slate-400" /><span className="text-sm">{selectedVehicle.mileage.toLocaleString()} km</span></div>
                <div className="flex items-center gap-2"><Hash className="h-4 w-4 text-slate-400" /><span className="text-xs font-mono">{selectedVehicle.vin}</span></div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full" style={{ backgroundColor: selectedVehicle.color.toLowerCase() }}></span><span className="text-sm">{selectedVehicle.color}</span></div>
              </div>

              <div className="pt-4 border-t">
                <p className="text-xs text-slate-500 mb-2">Status</p>
                {getStatusBadge(selectedVehicle.status)}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewOpen(false)}>Close</Button>
            <Button className="bg-blue-500 hover:bg-blue-600" onClick={() => { setIsViewOpen(false); if (selectedVehicle) handleEdit(selectedVehicle); }}>
              <Pencil className="h-4 w-4 mr-2" /> Edit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DELETE DIALOG */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-500"><AlertTriangle className="h-5 w-5" /> Delete Vehicle</DialogTitle>
            <DialogDescription>Are you sure you want to remove this vehicle?</DialogDescription>
          </DialogHeader>
          
          {selectedVehicle && (
            <div className="py-4">
              <p className="font-bold">{selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model}</p>
              <p className="text-orange-500 font-mono">{selectedVehicle.licensePlate}</p>
              <p className="text-xs text-red-500 mt-2">This action cannot be undone.</p>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
            <Button className="bg-red-500 hover:bg-red-600" onClick={submitDelete}><Trash2 className="h-4 w-4 mr-2" /> Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

