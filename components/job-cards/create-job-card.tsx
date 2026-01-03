"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save } from "lucide-react"

interface CreateJobCardProps {
  onBack?: () => void
  onSave?: (data: any) => void
}

export function CreateJobCard({ onBack, onSave }: CreateJobCardProps) {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Create Job Card</h1>
          <p className="text-muted-foreground">Fill in the details to create a new job card</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Vehicle & Customer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Select Vehicle</Label>
              <Select>
                <SelectTrigger><SelectValue placeholder="Choose a vehicle" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="v1">Toyota Land Cruiser 79 (SL-82307-T)</SelectItem>
                  <SelectItem value="v2">Honda Fit 2017 (SL-47832-F)</SelectItem>
                  <SelectItem value="v3">Nissan Patrol 2019 (SL-47842-P)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Select Customer</Label>
              <Select>
                <SelectTrigger><SelectValue placeholder="Choose a customer" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="c1">Mohamed Ahmed</SelectItem>
                  <SelectItem value="c2">Sarah Hassan</SelectItem>
                  <SelectItem value="c3">Ahmed Ali</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Current Mileage (km)</Label>
              <Input type="number" placeholder="e.g., 48000" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Service Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Service Type</Label>
              <Select>
                <SelectTrigger><SelectValue placeholder="Select service type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="full">Full Service</SelectItem>
                  <SelectItem value="oil">Oil Change</SelectItem>
                  <SelectItem value="brake">Brake Service</SelectItem>
                  <SelectItem value="engine">Engine Repair</SelectItem>
                  <SelectItem value="diagnostic">Diagnostic</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Assign Technician</Label>
              <Select>
                <SelectTrigger><SelectValue placeholder="Choose technician" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="t1">John Doe</SelectItem>
                  <SelectItem value="t2">Mike Ross</SelectItem>
                  <SelectItem value="t3">Sarah Smith</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Estimated Completion Date</Label>
              <Input type="date" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card lg:col-span-2">
          <CardHeader>
            <CardTitle>Job Description</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Customer Complaint</Label>
              <Textarea placeholder="Describe the customer's reported issue..." rows={3} />
            </div>
            <div className="space-y-2">
              <Label>Initial Observations</Label>
              <Textarea placeholder="Technician's initial assessment..." rows={3} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={onBack}>Cancel</Button>
        <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={() => onSave?.({})}>
          <Save className="mr-2 h-4 w-4" /> Create Job Card
        </Button>
      </div>
    </div>
  )
}

export default CreateJobCard
