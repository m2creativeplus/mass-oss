"use client";

import React, { useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, AlertCircle, MinusCircle } from "lucide-react";
import type { WizardData } from "../vehicle-check-in-wizard";

interface Step2Props {
  data: WizardData;
  onUpdate: (updates: Partial<WizardData>) => void;
}

// Default inspection checklist items grouped by category
const DEFAULT_CHECKLIST = [
  // Exterior
  { id: "ext-1", name: "Front Bumper", category: "Exterior" },
  { id: "ext-2", name: "Rear Bumper", category: "Exterior" },
  { id: "ext-3", name: "Windshield", category: "Exterior" },
  { id: "ext-4", name: "Side Mirrors", category: "Exterior" },
  { id: "ext-5", name: "Headlights", category: "Exterior" },
  { id: "ext-6", name: "Tail Lights", category: "Exterior" },
  { id: "ext-7", name: "Turn Signals", category: "Exterior" },
  { id: "ext-8", name: "Wipers", category: "Exterior" },
  
  // Tires & Wheels
  { id: "tir-1", name: "Front Left Tire", category: "Tires & Wheels" },
  { id: "tir-2", name: "Front Right Tire", category: "Tires & Wheels" },
  { id: "tir-3", name: "Rear Left Tire", category: "Tires & Wheels" },
  { id: "tir-4", name: "Rear Right Tire", category: "Tires & Wheels" },
  { id: "tir-5", name: "Spare Tire", category: "Tires & Wheels" },
  { id: "tir-6", name: "Wheel Covers/Rims", category: "Tires & Wheels" },
  
  // Interior
  { id: "int-1", name: "Dashboard", category: "Interior" },
  { id: "int-2", name: "Steering Wheel", category: "Interior" },
  { id: "int-3", name: "Seats", category: "Interior" },
  { id: "int-4", name: "Seat Belts", category: "Interior" },
  { id: "int-5", name: "Floor Mats", category: "Interior" },
  { id: "int-6", name: "Radio/Infotainment", category: "Interior" },
  { id: "int-7", name: "Air Conditioning", category: "Interior" },
  { id: "int-8", name: "Horn", category: "Interior" },
  
  // Engine Bay
  { id: "eng-1", name: "Oil Level", category: "Engine Bay" },
  { id: "eng-2", name: "Coolant Level", category: "Engine Bay" },
  { id: "eng-3", name: "Brake Fluid", category: "Engine Bay" },
  { id: "eng-4", name: "Transmission Fluid", category: "Engine Bay" },
  { id: "eng-5", name: "Battery", category: "Engine Bay" },
  { id: "eng-6", name: "Engine Belts", category: "Engine Bay" },
  { id: "eng-7", name: "Air Filter", category: "Engine Bay" },
  
  // Undercarriage
  { id: "und-1", name: "Exhaust System", category: "Undercarriage" },
  { id: "und-2", name: "Suspension", category: "Undercarriage" },
  { id: "und-3", name: "Brake Pads (Front)", category: "Undercarriage" },
  { id: "und-4", name: "Brake Pads (Rear)", category: "Undercarriage" },
  { id: "und-5", name: "CV Joints/Boots", category: "Undercarriage" },
];

type ItemStatus = "ok" | "attention" | "immediate-attention" | "not-applicable";

const STATUS_CONFIG: Record<ItemStatus, { color: string; bgColor: string; icon: React.ElementType; label: string }> = {
  "ok": { color: "text-green-600", bgColor: "bg-green-100", icon: CheckCircle, label: "OK" },
  "attention": { color: "text-yellow-600", bgColor: "bg-yellow-100", icon: AlertTriangle, label: "Needs Attention" },
  "immediate-attention": { color: "text-red-600", bgColor: "bg-red-100", icon: AlertCircle, label: "Immediate" },
  "not-applicable": { color: "text-gray-400", bgColor: "bg-gray-100", icon: MinusCircle, label: "N/A" },
};

export default function Step2PartsChecklist({ data, onUpdate }: Step2Props) {
  // Initialize checklist if empty
  useEffect(() => {
    if (data.partsChecklist.length === 0) {
      const initialChecklist = DEFAULT_CHECKLIST.map((item) => ({
        ...item,
        status: "ok" as ItemStatus,
        notes: "",
      }));
      onUpdate({ partsChecklist: initialChecklist });
    }
  }, [data.partsChecklist.length, onUpdate]);

  const updateItemStatus = (itemId: string, status: ItemStatus) => {
    const updated = data.partsChecklist.map((item) =>
      item.id === itemId ? { ...item, status } : item
    );
    onUpdate({ partsChecklist: updated });
  };

  const updateItemNotes = (itemId: string, notes: string) => {
    const updated = data.partsChecklist.map((item) =>
      item.id === itemId ? { ...item, notes } : item
    );
    onUpdate({ partsChecklist: updated });
  };

  // Group items by category
  const groupedItems = data.partsChecklist.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof data.partsChecklist>);

  // Count issues
  const issueCount = data.partsChecklist.filter(
    (item) => item.status === "attention" || item.status === "immediate-attention"
  ).length;

  return (
    <div className="space-y-6">
      {/* Summary Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Parts Inspection Checklist
          </h3>
          <p className="text-sm text-gray-500">
            Toggle to mark items that need attention
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="gap-1">
            <CheckCircle className="w-3 h-3 text-green-600" />
            {data.partsChecklist.filter((i) => i.status === "ok").length} OK
          </Badge>
          {issueCount > 0 && (
            <Badge variant="destructive" className="gap-1">
              <AlertTriangle className="w-3 h-3" />
              {issueCount} Issues
            </Badge>
          )}
        </div>
      </div>

      {/* Status Legend */}
      <div className="flex flex-wrap gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
        {Object.entries(STATUS_CONFIG).map(([status, config]) => {
          const Icon = config.icon;
          return (
            <div key={status} className="flex items-center gap-1.5 text-sm">
              <Icon className={`w-4 h-4 ${config.color}`} />
              <span className="text-gray-600 dark:text-gray-400">{config.label}</span>
            </div>
          );
        })}
      </div>

      {/* Checklist by Category */}
      <div className="space-y-4">
        {Object.entries(groupedItems).map(([category, items]) => (
          <Card key={category}>
            <CardHeader className="py-3 px-4 bg-gray-50 dark:bg-gray-900">
              <CardTitle className="text-sm font-medium">{category}</CardTitle>
            </CardHeader>
            <CardContent className="p-0 divide-y">
              {items.map((item) => {
                const statusConfig = STATUS_CONFIG[item.status];
                const StatusIcon = statusConfig.icon;
                
                return (
                  <div key={item.id} className="p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <StatusIcon className={`w-5 h-5 ${statusConfig.color}`} />
                        <span className="font-medium text-sm">{item.name}</span>
                      </div>
                      
                      {/* Status Toggles */}
                      <div className="flex gap-1">
                        {(Object.keys(STATUS_CONFIG) as ItemStatus[]).map((status) => {
                          const config = STATUS_CONFIG[status];
                          const isActive = item.status === status;
                          
                          return (
                            <button
                              key={status}
                              onClick={() => updateItemStatus(item.id, status)}
                              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                                isActive
                                  ? `${config.bgColor} ${config.color} ring-2 ring-offset-1 ring-current`
                                  : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                              }`}
                              title={config.label}
                            >
                              <config.icon className="w-4 h-4" />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    
                    {/* Notes field - show if not OK */}
                    {item.status !== "ok" && item.status !== "not-applicable" && (
                      <div className="pl-8">
                        <Textarea
                          placeholder="Add notes about this issue..."
                          value={item.notes}
                          onChange={(e) => updateItemNotes(item.id, e.target.value)}
                          className="text-sm min-h-[60px]"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
