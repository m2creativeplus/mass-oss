"use client";

import React, { useRef, useCallback } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Fuel, 
  AlertTriangle, 
  CheckCircle, 
  AlertCircle,
  Trash2,
  PenLine
} from "lucide-react";
import type { WizardData } from "../vehicle-check-in-wizard";

interface Step4Props {
  data: WizardData;
  errors: Record<string, string>;
  onUpdate: (updates: Partial<WizardData>) => void;
}

type OverallCondition = "excellent" | "good" | "fair" | "poor";

const CONDITION_OPTIONS: { value: OverallCondition; label: string; description: string; color: string; icon: React.ElementType }[] = [
  { 
    value: "excellent", 
    label: "Excellent", 
    description: "Like new, no issues", 
    color: "text-green-600 border-green-500 bg-green-50",
    icon: CheckCircle
  },
  { 
    value: "good", 
    label: "Good", 
    description: "Minor wear, fully functional", 
    color: "text-blue-600 border-blue-500 bg-blue-50",
    icon: CheckCircle
  },
  { 
    value: "fair", 
    label: "Fair", 
    description: "Noticeable wear, needs attention", 
    color: "text-yellow-600 border-yellow-500 bg-yellow-50",
    icon: AlertTriangle
  },
  { 
    value: "poor", 
    label: "Poor", 
    description: "Significant issues, repairs needed", 
    color: "text-red-600 border-red-500 bg-red-50",
    icon: AlertCircle
  },
];

export default function Step4DefectsFuel({ data, errors, onUpdate }: Step4Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);

  // Signature pad handlers
  const startDrawing = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    isDrawingRef.current = true;
    const rect = canvas.getBoundingClientRect();
    
    let x: number, y: number;
    if ('touches' in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }
    
    lastPointRef.current = { x, y };
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  }, []);

  const draw = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    
    let x: number, y: number;
    if ('touches' in e) {
      e.preventDefault();
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }
    
    if (lastPointRef.current) {
      ctx.beginPath();
      ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
      ctx.lineTo(x, y);
      ctx.strokeStyle = '#1f2937';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
    }
    
    lastPointRef.current = { x, y };
  }, []);

  const stopDrawing = useCallback(() => {
    if (!isDrawingRef.current) return;
    
    isDrawingRef.current = false;
    lastPointRef.current = null;
    
    const canvas = canvasRef.current;
    if (canvas) {
      const signatureData = canvas.toDataURL('image/png');
      // Only save if there's actually something drawn
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const hasContent = imageData.data.some((pixel, i) => i % 4 === 3 && pixel !== 0);
        if (hasContent) {
          onUpdate({ signatureData });
        }
      }
    }
  }, [onUpdate]);

  const clearSignature = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    onUpdate({ signatureData: null });
  }, [onUpdate]);

  // Initialize canvas when component mounts or signature data loads
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    // If there's existing signature data, draw it
    if (data.signatureData) {
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.onload = () => {
        ctx?.drawImage(img, 0, 0);
      };
      img.src = data.signatureData;
    }
  }, []);

  // Fuel level display
  const getFuelIcon = () => {
    if (data.fuelLevel <= 10) return "🔴";
    if (data.fuelLevel <= 25) return "🟠";
    if (data.fuelLevel <= 50) return "🟡";
    return "🟢";
  };

  return (
    <div className="space-y-8">
      {/* Defect Notes */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          <Label className="text-lg font-semibold">Additional Defects & Notes</Label>
        </div>
        <Textarea
          placeholder="Describe any additional defects, customer complaints, or special instructions..."
          value={data.defectNotes}
          onChange={(e) => onUpdate({ defectNotes: e.target.value })}
          className="min-h-[120px]"
        />
      </div>

      {/* Fuel Level */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Fuel className="w-5 h-5 text-emerald-600" />
          <Label className="text-lg font-semibold">Fuel Level</Label>
        </div>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl">{getFuelIcon()}</span>
              <span className="text-2xl font-bold text-emerald-600">
                {data.fuelLevel}%
              </span>
            </div>
            
            {/* Fuel Gauge */}
            <div className="relative">
              <div className="flex justify-between text-sm text-gray-500 mb-2">
                <span>E</span>
                <span>¼</span>
                <span>½</span>
                <span>¾</span>
                <span>F</span>
              </div>
              <Slider
                value={[data.fuelLevel]}
                onValueChange={(value) => onUpdate({ fuelLevel: value[0] })}
                max={100}
                step={5}
                className="w-full"
              />
              {/* Fuel gauge visual */}
              <div className="mt-2 h-4 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${
                    data.fuelLevel <= 25 
                      ? 'bg-gradient-to-r from-red-500 to-orange-500'
                      : data.fuelLevel <= 50
                      ? 'bg-gradient-to-r from-orange-500 to-yellow-500'
                      : 'bg-gradient-to-r from-yellow-500 to-emerald-500'
                  }`}
                  style={{ width: `${data.fuelLevel}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Overall Condition */}
      <div className="space-y-4">
        <Label className="text-lg font-semibold">Overall Vehicle Condition</Label>
        
        <RadioGroup
          value={data.overallCondition}
          onValueChange={(value) => onUpdate({ overallCondition: value as OverallCondition })}
          className="grid grid-cols-2 gap-3"
        >
          {CONDITION_OPTIONS.map((option) => {
            const Icon = option.icon;
            const isSelected = data.overallCondition === option.value;
            
            return (
              <Label
                key={option.value}
                htmlFor={option.value}
                className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
                  isSelected 
                    ? option.color 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <RadioGroupItem
                  value={option.value}
                  id={option.value}
                  className="sr-only"
                />
                <div className="flex items-start gap-3">
                  <Icon className={`w-5 h-5 mt-0.5 ${isSelected ? '' : 'text-gray-400'}`} />
                  <div>
                    <span className="font-medium">{option.label}</span>
                    <p className="text-sm text-gray-500">{option.description}</p>
                  </div>
                </div>
              </Label>
            );
          })}
        </RadioGroup>
      </div>

      {/* Customer Signature */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PenLine className="w-5 h-5 text-emerald-600" />
            <Label className="text-lg font-semibold">Customer Signature *</Label>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={clearSignature}
            disabled={!data.signatureData}
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Clear
          </Button>
        </div>
        
        <Card className={errors.signatureData ? 'border-red-500' : ''}>
          <CardContent className="p-0">
            <canvas
              ref={canvasRef}
              className="w-full h-40 bg-gray-50 dark:bg-gray-900 rounded-lg cursor-crosshair touch-none"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
            />
          </CardContent>
        </Card>
        
        {errors.signatureData && (
          <p className="text-red-500 text-sm flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.signatureData}
          </p>
        )}
        
        <p className="text-sm text-gray-500 text-center">
          Sign above to confirm the vehicle condition at check-in
        </p>
      </div>
    </div>
  );
}
