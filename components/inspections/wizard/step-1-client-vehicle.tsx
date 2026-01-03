"use client";

import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Search, Plus, User, Car, AlertCircle } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { WizardData } from "../vehicle-check-in-wizard";

interface Step1Props {
  data: WizardData;
  errors: Record<string, string>;
  orgId: string;
  onUpdate: (updates: Partial<WizardData>) => void;
}

export default function Step1ClientVehicle({ data, errors, orgId, onUpdate }: Step1Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewCustomerModal, setShowNewCustomerModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
  });

  // Convex queries
  const customers = useQuery(api.functions.getCustomers, { orgId });
  const vehicles = useQuery(
    api.functions.getVehiclesByCustomer,
    data.customerId ? { customerId: data.customerId as any } : "skip"
  );

  // Convex mutations
  const addCustomer = useMutation(api.functions.addCustomer);
  const addVehicle = useMutation(api.functions.addVehicle);

  // Filter customers based on search
  const filteredCustomers = customers?.filter(
    (c) =>
      `${c.firstName} ${c.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone?.includes(searchQuery) ||
      c.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectCustomer = (customerId: string) => {
    const customer = customers?.find((c) => c._id === customerId);
    if (customer) {
      onUpdate({
        customerId,
        customerName: `${customer.firstName} ${customer.lastName}`,
        customerPhone: customer.phone || "",
        customerEmail: customer.email || "",
        // Reset vehicle when customer changes
        vehicleId: null,
        vehicleMake: "",
        vehicleModel: "",
        vehicleYear: new Date().getFullYear(),
        vehiclePlate: "",
      });
    }
  };

  const handleSelectVehicle = (vehicleId: string) => {
    const vehicle = vehicles?.find((v) => v._id === vehicleId);
    if (vehicle) {
      onUpdate({
        vehicleId,
        vehicleMake: vehicle.make,
        vehicleModel: vehicle.model,
        vehicleYear: vehicle.year,
        vehiclePlate: vehicle.licensePlate || "",
        mileageIn: vehicle.mileage,
      });
    }
  };

  const handleCreateCustomer = async () => {
    try {
      const newId = await addCustomer({
        firstName: newCustomer.firstName,
        lastName: newCustomer.lastName,
        phone: newCustomer.phone,
        email: newCustomer.email || undefined,
        orgId,
      });
      
      onUpdate({
        customerId: newId,
        customerName: `${newCustomer.firstName} ${newCustomer.lastName}`,
        customerPhone: newCustomer.phone,
        customerEmail: newCustomer.email,
      });
      
      setShowNewCustomerModal(false);
      setNewCustomer({ firstName: "", lastName: "", phone: "", email: "" });
    } catch (error) {
      console.error("Failed to create customer:", error);
    }
  };

  const handleCreateVehicle = async () => {
    if (!data.customerId || !data.vehicleMake || !data.vehicleModel) return;
    
    try {
      const newId = await addVehicle({
        customerId: data.customerId as any,
        make: data.vehicleMake,
        model: data.vehicleModel,
        year: data.vehicleYear,
        licensePlate: data.vehiclePlate || undefined,
        mileage: data.mileageIn,
        status: "in-service",
        orgId,
      });
      
      onUpdate({ vehicleId: newId });
    } catch (error) {
      console.error("Failed to create vehicle:", error);
    }
  };

  // Determine if vehicle exists or is new
  const isNewVehicle = data.customerId && !data.vehicleId && data.vehicleMake;

  return (
    <div className="space-y-8">
      {/* Customer Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-lg font-semibold text-gray-800 dark:text-gray-200">
          <User className="w-5 h-5 text-emerald-600" />
          <h3>Customer Information</h3>
        </div>

        {/* Customer Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search customers by name, phone, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Customer List or Selected Customer */}
        {data.customerId ? (
          <Card className="border-emerald-200 bg-emerald-50 dark:bg-emerald-950 dark:border-emerald-800">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-emerald-800 dark:text-emerald-200">
                  {data.customerName}
                </p>
                <p className="text-sm text-emerald-600 dark:text-emerald-400">
                  {data.customerPhone} • {data.customerEmail || "No email"}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  onUpdate({
                    customerId: null,
                    customerName: "",
                    customerPhone: "",
                    customerEmail: "",
                    vehicleId: null,
                    vehicleMake: "",
                    vehicleModel: "",
                    vehicleYear: new Date().getFullYear(),
                    vehiclePlate: "",
                  })
                }
              >
                Change
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {filteredCustomers?.slice(0, 5).map((customer) => (
              <Card
                key={customer._id}
                className="cursor-pointer hover:border-emerald-400 transition-colors"
                onClick={() => handleSelectCustomer(customer._id)}
              >
                <CardContent className="p-3">
                  <p className="font-medium">
                    {customer.firstName} {customer.lastName}
                  </p>
                  <p className="text-sm text-gray-500">
                    {customer.phone || "No phone"} • {customer.email || "No email"}
                  </p>
                </CardContent>
              </Card>
            ))}

            {/* Add New Customer */}
            <Dialog open={showNewCustomerModal} onOpenChange={setShowNewCustomerModal}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full gap-2 border-dashed">
                  <Plus className="w-4 h-4" />
                  Add New Customer
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Customer</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>First Name *</Label>
                      <Input
                        value={newCustomer.firstName}
                        onChange={(e) =>
                          setNewCustomer({ ...newCustomer, firstName: e.target.value })
                        }
                        placeholder="John"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Last Name *</Label>
                      <Input
                        value={newCustomer.lastName}
                        onChange={(e) =>
                          setNewCustomer({ ...newCustomer, lastName: e.target.value })
                        }
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Phone *</Label>
                    <Input
                      value={newCustomer.phone}
                      onChange={(e) =>
                        setNewCustomer({ ...newCustomer, phone: e.target.value })
                      }
                      placeholder="+252 XX XXX XXXX"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email (optional)</Label>
                    <Input
                      type="email"
                      value={newCustomer.email}
                      onChange={(e) =>
                        setNewCustomer({ ...newCustomer, email: e.target.value })
                      }
                      placeholder="john@example.com"
                    />
                  </div>
                  <Button
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                    onClick={handleCreateCustomer}
                    disabled={!newCustomer.firstName || !newCustomer.lastName || !newCustomer.phone}
                  >
                    Create Customer
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}

        {errors.customerName && (
          <div className="flex items-center gap-2 text-red-600 text-sm">
            <AlertCircle className="w-4 h-4" />
            {errors.customerName}
          </div>
        )}
      </div>

      {/* Vehicle Section - Only show after customer is selected */}
      {data.customerId && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-lg font-semibold text-gray-800 dark:text-gray-200">
            <Car className="w-5 h-5 text-emerald-600" />
            <h3>Vehicle Information</h3>
          </div>

          {/* Existing Vehicles */}
          {vehicles && vehicles.length > 0 && !data.vehicleId && (
            <div className="space-y-2">
              <Label>Select Existing Vehicle</Label>
              <Select onValueChange={handleSelectVehicle}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a vehicle..." />
                </SelectTrigger>
                <SelectContent>
                  {vehicles.map((vehicle) => (
                    <SelectItem key={vehicle._id} value={vehicle._id}>
                      {vehicle.year} {vehicle.make} {vehicle.model} ({vehicle.licensePlate || "No plate"})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-500 text-center">or add a new vehicle below</p>
            </div>
          )}

          {/* Vehicle Form */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Make *</Label>
              <Select
                value={data.vehicleMake}
                onValueChange={(value) => onUpdate({ vehicleMake: value })}
                disabled={!!data.vehicleId}
              >
                <SelectTrigger className={errors.vehicleMake ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select make" />
                </SelectTrigger>
                <SelectContent>
                  {["Toyota", "Suzuki", "Nissan", "Mitsubishi", "Hyundai", "Honda", "Mercedes", "BMW"].map(
                    (make) => (
                      <SelectItem key={make} value={make}>
                        {make}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
              {errors.vehicleMake && (
                <span className="text-red-500 text-xs">{errors.vehicleMake}</span>
              )}
            </div>

            <div className="space-y-2">
              <Label>Model *</Label>
              <Input
                value={data.vehicleModel}
                onChange={(e) => onUpdate({ vehicleModel: e.target.value })}
                placeholder="e.g., Hilux, Vitz"
                disabled={!!data.vehicleId}
                className={errors.vehicleModel ? "border-red-500" : ""}
              />
              {errors.vehicleModel && (
                <span className="text-red-500 text-xs">{errors.vehicleModel}</span>
              )}
            </div>

            <div className="space-y-2">
              <Label>Year</Label>
              <Input
                type="number"
                value={data.vehicleYear}
                onChange={(e) => onUpdate({ vehicleYear: parseInt(e.target.value) || 0 })}
                min={1990}
                max={new Date().getFullYear() + 1}
                disabled={!!data.vehicleId}
              />
            </div>

            <div className="space-y-2">
              <Label>License Plate</Label>
              <Input
                value={data.vehiclePlate}
                onChange={(e) => onUpdate({ vehiclePlate: e.target.value.toUpperCase() })}
                placeholder="e.g., HRG-001"
                disabled={!!data.vehicleId}
              />
            </div>

            <div className="col-span-2 space-y-2">
              <Label>Mileage In (km) *</Label>
              <Input
                type="number"
                value={data.mileageIn || ""}
                onChange={(e) => onUpdate({ mileageIn: parseInt(e.target.value) || 0 })}
                placeholder="e.g., 150000"
                className={errors.mileageIn ? "border-red-500" : ""}
              />
              {errors.mileageIn && (
                <span className="text-red-500 text-xs">{errors.mileageIn}</span>
              )}
            </div>
          </div>

          {/* Create Vehicle Button */}
          {isNewVehicle && !data.vehicleId && (
            <Button
              variant="outline"
              className="w-full border-dashed gap-2"
              onClick={handleCreateVehicle}
            >
              <Plus className="w-4 h-4" />
              Save as New Vehicle for {data.customerName}
            </Button>
          )}

          {/* Selected Vehicle Display */}
          {data.vehicleId && (
            <Card className="border-emerald-200 bg-emerald-50 dark:bg-emerald-950 dark:border-emerald-800">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-emerald-800 dark:text-emerald-200">
                    {data.vehicleYear} {data.vehicleMake} {data.vehicleModel}
                  </p>
                  <p className="text-sm text-emerald-600 dark:text-emerald-400">
                    Plate: {data.vehiclePlate || "None"} • Mileage: {data.mileageIn.toLocaleString()} km
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    onUpdate({
                      vehicleId: null,
                      vehicleMake: "",
                      vehicleModel: "",
                      vehicleYear: new Date().getFullYear(),
                      vehiclePlate: "",
                    })
                  }
                >
                  Change
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
