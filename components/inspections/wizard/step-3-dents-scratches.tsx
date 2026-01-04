"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { 
  Trash2, 
  Plus, 
  Camera, 
  ZoomIn, 
  ZoomOut,
  RotateCcw,
  Circle
} from "lucide-react";
import type { WizardData } from "../vehicle-check-in-wizard";

interface Step3Props {
  data: WizardData;
  onUpdate: (updates: Partial<WizardData>) => void;
}

type Severity = "minor" | "moderate" | "severe";

const SEVERITY_CONFIG: Record<Severity, { color: string; bgColor: string; label: string; ringColor: string }> = {
  minor: { 
    color: "text-yellow-600", 
    bgColor: "bg-yellow-500", 
    label: "Minor", 
    ringColor: "ring-yellow-500" 
  },
  moderate: { 
    color: "text-orange-600", 
    bgColor: "bg-orange-500", 
    label: "Moderate", 
    ringColor: "ring-orange-500" 
  },
  severe: { 
    color: "text-red-600", 
    bgColor: "bg-red-500", 
    label: "Severe", 
    ringColor: "ring-red-500" 
  },
};

// SVG car diagram viewBox dimensions
const CAR_WIDTH = 400;
const CAR_HEIGHT = 200;

export default function Step3DentsScratches({ data, onUpdate }: Step3Props) {
  const [selectedSeverity, setSelectedSeverity] = useState<Severity>("minor");
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);
  const [editingMarker, setEditingMarker] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const svgRef = useRef<SVGSVGElement>(null);

  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    
    const rect = svgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * CAR_WIDTH;
    const y = ((e.clientY - rect.top) / rect.height) * CAR_HEIGHT;
    
    // Don't add marker if clicking on an existing one
    if ((e.target as Element).closest('.damage-marker')) return;
    
    const newMarker = {
      id: `dmg-${Date.now()}`,
      x,
      y,
      severity: selectedSeverity,
      description: "",
      photos: [],
    };
    
    onUpdate({ damageMarkers: [...data.damageMarkers, newMarker] });
    setEditingMarker(newMarker.id);
  };

  const updateMarker = (id: string, updates: Partial<typeof data.damageMarkers[0]>) => {
    const updated = data.damageMarkers.map((m) =>
      m.id === id ? { ...m, ...updates } : m
    );
    onUpdate({ damageMarkers: updated });
  };

  const deleteMarker = (id: string) => {
    onUpdate({ damageMarkers: data.damageMarkers.filter((m) => m.id !== id) });
    setEditingMarker(null);
    setSelectedMarker(null);
  };

  const clearAllMarkers = () => {
    onUpdate({ damageMarkers: [] });
  };

  const currentEditMarker = data.damageMarkers.find((m) => m.id === editingMarker);

  // Group markers by severity for summary
  const markersBySeverity = data.damageMarkers.reduce((acc, m) => {
    acc[m.severity] = (acc[m.severity] || 0) + 1;
    return acc;
  }, {} as Record<Severity, number>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Dents & Scratches Map
          </h3>
          <p className="text-sm text-gray-500">
            Click on the car diagram to mark damage locations
          </p>
        </div>
        <div className="flex gap-2">
          {Object.entries(markersBySeverity).map(([severity, count]) => (
            <Badge 
              key={severity} 
              className={`${SEVERITY_CONFIG[severity as Severity].bgColor} text-white`}
            >
              {count} {SEVERITY_CONFIG[severity as Severity].label}
            </Badge>
          ))}
        </div>
      </div>

      {/* Severity Selector */}
      <div className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
        <Label className="text-sm font-medium">Damage Severity:</Label>
        <div className="flex gap-2">
          {(Object.keys(SEVERITY_CONFIG) as Severity[]).map((severity) => {
            const config = SEVERITY_CONFIG[severity];
            const isActive = selectedSeverity === severity;
            
            return (
              <button
                key={severity}
                onClick={() => setSelectedSeverity(severity)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? `${config.bgColor} text-white ring-2 ${config.ringColor} ring-offset-2`
                    : "bg-white dark:bg-gray-800 border hover:border-gray-400"
                }`}
              >
                {config.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Car Diagram */}
      <Card className="overflow-hidden">
        <CardContent className="p-0 relative">
          {/* Zoom Controls */}
          <div className="absolute top-2 right-2 z-10 flex gap-1 bg-white/90 dark:bg-gray-900/90 rounded-lg p-1 shadow">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={() => setZoom(Math.max(0.5, zoom - 0.25))}
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={() => setZoom(Math.min(2, zoom + 0.25))}
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={clearAllMarkers}
              disabled={data.damageMarkers.length === 0}
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>

          {/* SVG Car Diagram */}
          <div 
            className="overflow-auto bg-gray-100 dark:bg-gray-800"
            style={{ maxHeight: "400px" }}
          >
            <svg
              ref={svgRef}
              viewBox={`0 0 ${CAR_WIDTH} ${CAR_HEIGHT}`}
              className="w-full cursor-crosshair"
              style={{ 
                minWidth: `${CAR_WIDTH * zoom}px`,
                minHeight: `${CAR_HEIGHT * zoom}px`
              }}
              onClick={handleSvgClick}
            >
              {/* Car Body - Top-down view */}
              <defs>
                <linearGradient id="carGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#374151" />
                  <stop offset="100%" stopColor="#1f2937" />
                </linearGradient>
              </defs>
              
              {/* Main car body */}
              <rect 
                x="80" y="40" 
                width="240" height="120" 
                rx="20" ry="20"
                fill="url(#carGradient)"
                stroke="#4b5563"
                strokeWidth="2"
              />
              
              {/* Hood */}
              <rect x="260" y="50" width="50" height="100" rx="10" fill="#4b5563" />
              
              {/* Trunk */}
              <rect x="90" y="50" width="40" height="100" rx="10" fill="#4b5563" />
              
              {/* Windows */}
              <rect x="140" y="55" width="100" height="90" rx="8" fill="#60a5fa" opacity="0.6" />
              
              {/* Wheels */}
              <ellipse cx="120" cy="50" rx="25" ry="12" fill="#1f2937" stroke="#374151" strokeWidth="2" />
              <ellipse cx="120" cy="150" rx="25" ry="12" fill="#1f2937" stroke="#374151" strokeWidth="2" />
              <ellipse cx="280" cy="50" rx="25" ry="12" fill="#1f2937" stroke="#374151" strokeWidth="2" />
              <ellipse cx="280" cy="150" rx="25" ry="12" fill="#1f2937" stroke="#374151" strokeWidth="2" />
              
              {/* Headlights */}
              <ellipse cx="310" cy="65" rx="8" ry="5" fill="#fcd34d" />
              <ellipse cx="310" cy="135" rx="8" ry="5" fill="#fcd34d" />
              
              {/* Taillights */}
              <ellipse cx="85" cy="65" rx="6" ry="4" fill="#ef4444" />
              <ellipse cx="85" cy="135" rx="6" ry="4" fill="#ef4444" />
              
              {/* Side Mirrors */}
              <rect x="145" y="35" width="15" height="8" rx="2" fill="#374151" />
              <rect x="145" y="157" width="15" height="8" rx="2" fill="#374151" />
              
              {/* Labels */}
              <text x="320" y="105" fill="#9ca3af" fontSize="10" fontWeight="bold">FRONT</text>
              <text x="60" y="105" fill="#9ca3af" fontSize="10" fontWeight="bold">REAR</text>
              <text x="195" y="20" fill="#9ca3af" fontSize="10">LEFT</text>
              <text x="190" y="195" fill="#9ca3af" fontSize="10">RIGHT</text>
              
              {/* Damage Markers */}
              {data.damageMarkers.map((marker) => {
                const config = SEVERITY_CONFIG[marker.severity];
                const isSelected = selectedMarker === marker.id;
                
                return (
                  <g 
                    key={marker.id} 
                    className="damage-marker cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedMarker(marker.id);
                      setEditingMarker(marker.id);
                    }}
                  >
                    {/* Pulse animation for selected */}
                    {isSelected && (
                      <circle
                        cx={marker.x}
                        cy={marker.y}
                        r="18"
                        fill="none"
                        stroke={config.bgColor.replace('bg-', '')}
                        strokeWidth="2"
                        opacity="0.5"
                        className="animate-ping"
                      />
                    )}
                    {/* Main marker */}
                    <circle
                      cx={marker.x}
                      cy={marker.y}
                      r="12"
                      fill={config.bgColor.includes('yellow') ? '#eab308' : 
                            config.bgColor.includes('orange') ? '#f97316' : '#ef4444'}
                      stroke="white"
                      strokeWidth="2"
                      className="drop-shadow-lg"
                    />
                    {/* Marker number */}
                    <text
                      x={marker.x}
                      y={marker.y + 4}
                      textAnchor="middle"
                      fill="white"
                      fontSize="10"
                      fontWeight="bold"
                    >
                      {data.damageMarkers.indexOf(marker) + 1}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </CardContent>
      </Card>

      {/* Damage List */}
      {data.damageMarkers.length > 0 && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">Marked Damage Points</Label>
          <div className="grid gap-2">
            {data.damageMarkers.map((marker, index) => {
              const config = SEVERITY_CONFIG[marker.severity];
              
              return (
                <Card 
                  key={marker.id}
                  className={`cursor-pointer transition-all ${
                    selectedMarker === marker.id ? 'ring-2 ring-emerald-500' : ''
                  }`}
                  onClick={() => {
                    setSelectedMarker(marker.id);
                    setEditingMarker(marker.id);
                  }}
                >
                  <CardContent className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full ${config.bgColor} text-white flex items-center justify-center font-bold text-sm`}>
                        {index + 1}
                      </div>
                      <div>
                        <span className={`font-medium ${config.color}`}>
                          {config.label} Damage
                        </span>
                        <p className="text-sm text-gray-500 truncate max-w-[200px]">
                          {marker.description || "No description"}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteMarker(marker.id);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Edit Marker Dialog */}
      <Dialog open={!!editingMarker} onOpenChange={() => setEditingMarker(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Damage Details</DialogTitle>
          </DialogHeader>
          {currentEditMarker && (
            <div className="space-y-4 pt-4">
              {/* Severity Selector */}
              <div className="space-y-2">
                <Label>Severity</Label>
                <div className="flex gap-2">
                  {(Object.keys(SEVERITY_CONFIG) as Severity[]).map((severity) => {
                    const config = SEVERITY_CONFIG[severity];
                    const isActive = currentEditMarker.severity === severity;
                    
                    return (
                      <button
                        key={severity}
                        onClick={() => updateMarker(currentEditMarker.id, { severity })}
                        className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          isActive
                            ? `${config.bgColor} text-white`
                            : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-800"
                        }`}
                      >
                        {config.label}
                      </button>
                    );
                  })}
                </div>
              </div>
              
              {/* Description */}
              <div className="space-y-2">
                <Label>Description</Label>
                <Input
                  placeholder="e.g., Scratch on driver door, 10cm"
                  value={currentEditMarker.description}
                  onChange={(e) => 
                    updateMarker(currentEditMarker.id, { description: e.target.value })
                  }
                />
              </div>
              
              {/* Photo Upload Placeholder */}
              <div className="space-y-2">
                <Label>Photos</Label>
                <Button variant="outline" className="w-full gap-2" disabled>
                  <Camera className="w-4 h-4" />
                  Add Photo (Coming Soon)
                </Button>
              </div>
              
              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => deleteMarker(currentEditMarker.id)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
                <Button
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => setEditingMarker(null)}
                >
                  Done
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
