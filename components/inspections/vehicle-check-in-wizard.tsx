"use client";

import React, { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, Check, Car, ClipboardList, PenTool, Fuel, Download } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { downloadBookingPDF, type BookingDocumentData } from "@/components/documents/booking-document-pdf";

// Import wizard steps
import Step1ClientVehicle from "./wizard/step-1-client-vehicle";
import Step2PartsChecklist from "./wizard/step-2-parts-checklist";
import Step3DentsScratches from "./wizard/step-3-dents-scratches";
import Step4DefectsFuel from "./wizard/step-4-defects-fuel";

// Types for wizard data
export interface WizardData {
  // Step 1: Client & Vehicle
  customerId: string | null;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  vehicleId: string | null;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: number;
  vehiclePlate: string;
  mileageIn: number;
  
  // Step 2: Parts Checklist
  partsChecklist: {
    id: string;
    name: string;
    category: string;
    status: "ok" | "attention" | "immediate-attention" | "not-applicable";
    notes: string;
  }[];
  
  // Step 3: Dents & Scratches
  damageMarkers: {
    id: string;
    x: number;
    y: number;
    severity: "minor" | "moderate" | "severe";
    description: string;
    photos: string[];
  }[];
  
  // Step 4: Defects & Fuel
  defectNotes: string;
  fuelLevel: number; // 0-100
  overallCondition: "excellent" | "good" | "fair" | "poor";
  signatureData: string | null;
}

const STEPS = [
  { id: 1, title: "Client & Vehicle", icon: Car, description: "Customer and vehicle information" },
  { id: 2, title: "Parts Checklist", icon: ClipboardList, description: "Inspect vehicle components" },
  { id: 3, title: "Dents & Scratches", icon: PenTool, description: "Mark exterior damage" },
  { id: 4, title: "Defects & Fuel", icon: Fuel, description: "Final details and signature" },
];

const initialWizardData: WizardData = {
  customerId: null,
  customerName: "",
  customerPhone: "",
  customerEmail: "",
  vehicleId: null,
  vehicleMake: "",
  vehicleModel: "",
  vehicleYear: new Date().getFullYear(),
  vehiclePlate: "",
  mileageIn: 0,
  partsChecklist: [],
  damageMarkers: [],
  defectNotes: "",
  fuelLevel: 50,
  overallCondition: "good",
  signatureData: null,
};

interface VehicleCheckInWizardProps {
  orgId: string;
  onComplete?: (data: WizardData) => void;
  onCancel?: () => void;
}

export default function VehicleCheckInWizard({ 
  orgId, 
  onComplete, 
  onCancel 
}: VehicleCheckInWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [wizardData, setWizardData] = useState<WizardData>(initialWizardData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Convex mutations
  const createInspection = useMutation(api.functions.createInspection);
  const createWorkOrder = useMutation(api.functions.createWorkOrder);

  const updateWizardData = useCallback((updates: Partial<WizardData>) => {
    setWizardData((prev) => ({ ...prev, ...updates }));
    // Clear errors for updated fields
    const updatedKeys = Object.keys(updates);
    setErrors((prev) => {
      const newErrors = { ...prev };
      updatedKeys.forEach((key) => delete newErrors[key]);
      return newErrors;
    });
  }, []);

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};
    
    switch (step) {
      case 1:
        if (!wizardData.customerName.trim()) {
          newErrors.customerName = "Customer name is required";
        }
        if (!wizardData.vehicleMake.trim()) {
          newErrors.vehicleMake = "Vehicle make is required";
        }
        if (!wizardData.vehicleModel.trim()) {
          newErrors.vehicleModel = "Vehicle model is required";
        }
        if (wizardData.mileageIn <= 0) {
          newErrors.mileageIn = "Mileage must be greater than 0";
        }
        break;
      case 2:
        // Parts checklist is optional, no validation required
        break;
      case 3:
        // Damage markers are optional
        break;
      case 4:
        if (!wizardData.signatureData) {
          newErrors.signatureData = "Customer signature is required";
        }
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < STEPS.length) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;
    
    setIsSubmitting(true);
    try {
      // Generate booking number
      const bookingNumber = `CHK-${Date.now().toString(36).toUpperCase()}`;
      
      // Create work order with inspection data
      const workOrderResult = await createWorkOrder({
        vehicleId: wizardData.vehicleId as any,
        customerId: wizardData.customerId as any,
        status: "check-in",
        priority: "normal",
        services: ["Vehicle Check-In"],
        customerComplaint: wizardData.defectNotes,
        mileageIn: wizardData.mileageIn,
        orgId,
      });

      // Create inspection record
      if (workOrderResult) {
        await createInspection({
          workOrderId: workOrderResult,
          vehicleId: wizardData.vehicleId as any,
          customerId: wizardData.customerId as any,
          status: "completed",
          mileage: wizardData.mileageIn,
          fuelLevel: `${wizardData.fuelLevel}%`,
          overallCondition: wizardData.overallCondition,
          safetyRating: wizardData.overallCondition === "poor" ? "unsafe" : 
                        wizardData.overallCondition === "fair" ? "attention-needed" : "safe",
          items: wizardData.partsChecklist.map((item) => ({
            name: item.name,
            category: item.category,
            status: item.status,
            notes: item.notes,
            photoUrls: [],
          })),
          orgId,
        });
      }

      // Generate and download PDF booking document
      const pdfData: BookingDocumentData = {
        workshopName: "MASS Workshop",
        workshopAddress: "Hargeisa, Somaliland",
        workshopPhone: "+252 XX XXX XXXX",
        bookingNumber,
        bookingDate: new Date().toLocaleDateString(),
        customerName: wizardData.customerName,
        customerPhone: wizardData.customerPhone,
        customerEmail: wizardData.customerEmail,
        vehicleMake: wizardData.vehicleMake,
        vehicleModel: wizardData.vehicleModel,
        vehicleYear: wizardData.vehicleYear,
        vehiclePlate: wizardData.vehiclePlate,
        mileageIn: wizardData.mileageIn,
        fuelLevel: wizardData.fuelLevel,
        overallCondition: wizardData.overallCondition,
        partsChecklist: wizardData.partsChecklist.map((item) => ({
          name: item.name,
          category: item.category,
          status: item.status,
          notes: item.notes,
        })),
        damageMarkers: wizardData.damageMarkers.map((m) => ({
          severity: m.severity,
          description: m.description,
        })),
        defectNotes: wizardData.defectNotes,
        signatureData: wizardData.signatureData || undefined,
      };
      
      downloadBookingPDF(pdfData);

      onComplete?.(wizardData);
    } catch (error) {
      console.error("Failed to create check-in:", error);
      setErrors({ submit: "Failed to save check-in. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = (currentStep / STEPS.length) * 100;

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1ClientVehicle
            data={wizardData}
            errors={errors}
            orgId={orgId}
            onUpdate={updateWizardData}
          />
        );
      case 2:
        return (
          <Step2PartsChecklist
            data={wizardData}
            onUpdate={updateWizardData}
          />
        );
      case 3:
        return (
          <Step3DentsScratches
            data={wizardData}
            onUpdate={updateWizardData}
          />
        );
      case 4:
        return (
          <Step4DefectsFuel
            data={wizardData}
            errors={errors}
            onUpdate={updateWizardData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Progress Header */}
      <Card className="border-none shadow-lg bg-gradient-to-r from-emerald-500 to-teal-600">
        <CardHeader className="pb-2">
          <CardTitle className="text-white text-2xl font-bold">
            Vehicle Check-In
          </CardTitle>
          <p className="text-emerald-100 text-sm">
            Step {currentStep} of {STEPS.length}: {STEPS[currentStep - 1].description}
          </p>
        </CardHeader>
        <CardContent>
          <Progress value={progress} className="h-2 bg-emerald-400/30" />
          
          {/* Step Indicators */}
          <div className="flex justify-between mt-4">
            {STEPS.map((step) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
              return (
                <div
                  key={step.id}
                  className={`flex flex-col items-center gap-1 ${
                    isActive ? "text-white" : isCompleted ? "text-emerald-200" : "text-emerald-300/50"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      isActive
                        ? "bg-white text-emerald-600 scale-110 shadow-lg"
                        : isCompleted
                        ? "bg-emerald-400 text-white"
                        : "bg-emerald-400/30 text-emerald-300/50"
                    }`}
                  >
                    {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                  <span className="text-xs font-medium hidden sm:block">{step.title}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      <Card className="shadow-md">
        <CardContent className="p-6">
          {renderStep()}
          
          {errors.submit && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {errors.submit}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={currentStep === 1 ? onCancel : handlePrevious}
          className="gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          {currentStep === 1 ? "Cancel" : "Previous"}
        </Button>
        
        <div className="flex gap-3">
          {currentStep < STEPS.length ? (
            <Button onClick={handleNext} className="gap-2 bg-emerald-600 hover:bg-emerald-700">
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="gap-2 bg-emerald-600 hover:bg-emerald-700"
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin">⏳</span>
                  Saving...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Complete Check-In
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
