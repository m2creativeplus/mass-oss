"use client"

import React, { useState } from 'react';
import { 
  Car, Users, Package, Wrench, Calendar, TrendingUp, 
  BarChart3, Settings, Database, Search, Plus, Filter,
  MapPin, Phone, DollarSign, AlertCircle, CheckCircle,
  Clock, Mic, Camera, MessageSquare, Download, Eye,
  Activity, Zap, Shield, Globe, ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

// ========== SAMPLE DATA (Will connect to Convex) ==========
const SAMPLE_MARKET_DATA = {
  totalWorkshops: 247,
  totalVehicles: 18453,
  avgRepairCost: 127,
  topModels: [
    { model: 'Toyota Vitz', count: 5842 },
    { model: 'Toyota Prado', count: 2156 },
    { model: 'Toyota Hilux', count: 1834 },
    { model: 'Suzuki Alto', count: 1423 },
  ]
};

const SAMPLE_VEHICLES = [
  { id: '1', make: 'Toyota', model: 'Vitz', year: 2012, plate: 'HRG-5432', owner: 'Ahmed Ali', mileage: 145000, status: 'active', lastService: '2025-12-15', marketValue: 4200 },
  { id: '2', make: 'Toyota', model: 'Prado', year: 2018, plate: 'HRG-8901', owner: 'Ministry of Health', mileage: 89000, status: 'in_service', lastService: '2026-01-02', marketValue: 38000 },
  { id: '3', make: 'Suzuki', model: 'Alto', year: 2020, plate: 'BRO-2341', owner: 'Fatima Hassan', mileage: 62000, status: 'active', lastService: '2025-11-20', marketValue: 3800 },
  { id: '4', make: 'Toyota', model: 'Hilux', year: 2015, plate: 'HRG-7123', owner: 'Dahabshiil Logistics', mileage: 210000, status: 'completed', lastService: '2025-12-28', marketValue: 22000 },
];

const SAMPLE_WORKSHOPS = [
  { id: '1', name: 'Mobile Fuundi', nameSomali: 'Mobile Fuundi', location: 'Jigjiga Yar', city: 'Hargeisa', phone: '+252-63-4567890', services: ['Diagnostics', 'Engine', 'Painting'], trustScore: 98, type: 'formal', verified: true },
  { id: '2', name: 'Dahabshiil Motors', location: 'Road #1, Opposite Kaah', city: 'Hargeisa', phone: '+252-63-2345678', services: ['Toyota', 'Hyundai', 'Iveco'], trustScore: 99, type: 'formal', verified: true },
  { id: '3', name: 'Hargeisa Auto', location: 'Near UNDP Office', city: 'Hargeisa', phone: '+252-63-8901234', services: ['Toyota', 'Michelin', 'AC'], trustScore: 95, type: 'formal', verified: true },
  { id: '4', name: 'Garaashka Ina-Catoosh', nameSomali: 'Garaashka Ina-Catoosh', location: 'Xawaadle', city: 'Hargeisa', phone: '+252-63-5678901', services: ['Engine Overhaul', 'Gearbox'], trustScore: 72, type: 'informal', verified: false },
];

const SAMPLE_PARTS = [
  { id: '1', name: 'Brake Pads (Front)', category: 'Brakes', priceOEM: 85, priceAftermarket: 23, stock: 45, demand: 'high', compatibility: ['Toyota Vitz', 'Toyota Yaris'] },
  { id: '2', name: 'Air Filter', category: 'Engine', priceOEM: 18, priceAftermarket: 7, stock: 120, demand: 'high', compatibility: ['Toyota Vitz', 'Toyota Belta'] },
  { id: '3', name: 'Engine Oil 5W-30 (4L)', category: 'Lubricants', priceOEM: 42, priceAftermarket: 42, stock: 200, demand: 'high', compatibility: ['All Models'] },
  { id: '4', name: 'Shock Absorbers', category: 'Suspension', priceOEM: 95, priceAftermarket: 45, stock: 28, demand: 'medium', compatibility: ['Toyota Hilux', 'Toyota Prado'] },
];

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
      delay: i * 0.1
    }
  }),
};

// ========== HELPER COMPONENTS ==========
const KPICard = ({ title, value, icon, color, trend, index }: {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  trend: string;
  index: number;
}) => (
  <motion.div
    custom={index}
    variants={cardVariants}
    initial="hidden"
    animate="visible"
  >
    <Card className={`bg-white dark:bg-zinc-900 shadow-md hover:shadow-lg transition-all border-l-4 border-l-${color}-500`}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-2">
          <div className={`p-2 bg-${color}-100 dark:bg-${color}-900/30 rounded-lg text-${color}-600`}>
            {icon}
          </div>
          <span className={`text-xs px-2 py-1 rounded-full ${
            trend.startsWith('+') ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 
            trend.startsWith('-') ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' : 
            'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
          }`}>
            {trend}
          </span>
        </div>
        <div className="text-sm text-muted-foreground mb-1">{title}</div>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  </motion.div>
);

const StatusBadge = ({ status }: { status: string }) => {
  const colors: Record<string, string> = {
    active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    in_service: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    completed: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400',
  };
  return (
    <span className={`text-xs px-2 py-1 rounded-full ${colors[status] || colors.active}`}>
      {status.replace('_', ' ')}
    </span>
  );
};

const ActivityItem = ({ icon, text, time }: { icon: React.ReactNode; text: string; time: string }) => (
  <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
    <div className="mt-1">{icon}</div>
    <div className="flex-1">
      <p className="text-sm">{text}</p>
      <p className="text-xs text-muted-foreground">{time}</p>
    </div>
  </div>
);

const RegionItem = ({ city, workshops, vehicles }: { city: string; workshops: number; vehicles: number }) => (
  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
    <div className="flex items-center gap-3">
      <MapPin className="w-5 h-5 text-blue-600" />
      <span className="font-medium">{city}</span>
    </div>
    <div className="flex gap-4 text-sm">
      <span className="text-muted-foreground">{workshops} workshops</span>
      <span className="text-muted-foreground">{vehicles.toLocaleString()} vehicles</span>
    </div>
  </div>
);

const AIToolCard = ({ icon, title, description, color }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}) => (
  <Card className={`bg-white dark:bg-zinc-900 shadow-md hover:shadow-lg transition-all cursor-pointer border-t-4 border-t-${color}-500`}>
    <CardContent className="p-6">
      <div className={`mb-4 text-${color}-600`}>{icon}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

// ========== MAIN VIEWS ==========
const DashboardView = () => (
  <div className="space-y-6">
    {/* KPI Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <KPICard 
        title="Total Workshops" 
        value={SAMPLE_MARKET_DATA.totalWorkshops.toLocaleString()} 
        icon={<Wrench className="w-6 h-6" />}
        color="blue"
        trend="+12%"
        index={0}
      />
      <KPICard 
        title="Tracked Vehicles" 
        value={SAMPLE_MARKET_DATA.totalVehicles.toLocaleString()} 
        icon={<Car className="w-6 h-6" />}
        color="green"
        trend="+8%"
        index={1}
      />
      <KPICard 
        title="Avg Repair Cost" 
        value={`$${SAMPLE_MARKET_DATA.avgRepairCost}`} 
        icon={<DollarSign className="w-6 h-6" />}
        color="amber"
        trend="-3%"
        index={2}
      />
      <KPICard 
        title="Market Intelligence" 
        value="Live" 
        icon={<Activity className="w-6 h-6" />}
        color="purple"
        trend="Active"
        index={3}
      />
    </div>

    {/* Top Models Chart */}
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Most Common Vehicles in Somaliland
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {SAMPLE_MARKET_DATA.topModels.map((model, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <div className="w-32 text-sm font-medium">{model.model}</div>
              <div className="flex-1 bg-muted rounded-full h-8 relative overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(model.count / SAMPLE_MARKET_DATA.topModels[0].count) * 100}%` }}
                  transition={{ duration: 0.8, delay: idx * 0.1 }}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 h-8 rounded-full flex items-center justify-end px-3 text-white text-sm font-semibold"
                >
                  {model.count.toLocaleString()}
                </motion.div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>

    {/* Activity & Regions */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            Real-Time Market Updates
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <ActivityItem 
            icon={<TrendingUp className="w-4 h-4 text-green-600" />}
            text="Brake pad prices increased 8% in Hargeisa"
            time="2 mins ago"
          />
          <ActivityItem 
            icon={<AlertCircle className="w-4 h-4 text-orange-600" />}
            text="New workshop verified: Berbera Auto Center"
            time="15 mins ago"
          />
          <ActivityItem 
            icon={<CheckCircle className="w-4 h-4 text-green-600" />}
            text="45 new vehicles registered today"
            time="1 hour ago"
          />
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-500" />
            Regional Coverage
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <RegionItem city="Hargeisa" workshops={167} vehicles={12834} />
          <RegionItem city="Berbera" workshops={42} vehicles={3219} />
          <RegionItem city="Burco" workshops={38} vehicles={2400} />
        </CardContent>
      </Card>
    </div>
  </div>
);

const VehiclesView = ({ searchQuery, setSearchQuery }: { searchQuery: string; setSearchQuery: (q: string) => void }) => (
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold">Vehicle Registry</h2>
      <Button className="bg-green-600 hover:bg-green-700">
        <Plus className="w-4 h-4 mr-2" />
        Add Vehicle
      </Button>
    </div>

    <Card className="shadow-md overflow-hidden">
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search by make, model, or plate..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Vehicle</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Owner</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Mileage</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Value</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {SAMPLE_VEHICLES.filter(v => 
              searchQuery === '' || 
              v.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
              v.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
              v.plate.toLowerCase().includes(searchQuery.toLowerCase())
            ).map(vehicle => (
              <tr key={vehicle.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                      <Car className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium">{vehicle.make} {vehicle.model}</div>
                      <div className="text-sm text-muted-foreground">{vehicle.year} • {vehicle.plate}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm">{vehicle.owner}</td>
                <td className="px-6 py-4 text-sm">{vehicle.mileage.toLocaleString()} km</td>
                <td className="px-6 py-4"><StatusBadge status={vehicle.status} /></td>
                <td className="px-6 py-4 text-sm font-medium">${vehicle.marketValue.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  </div>
);

const WorkshopsView = () => (
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold">Workshop Directory</h2>
      <Button className="bg-green-600 hover:bg-green-700">
        <Plus className="w-4 h-4 mr-2" />
        Add Workshop
      </Button>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {SAMPLE_WORKSHOPS.map((workshop, idx) => (
        <motion.div
          key={workshop.id}
          custom={idx}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <Card className="shadow-md hover:shadow-lg transition-all">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{workshop.name}</h3>
                  {workshop.nameSomali && (
                    <p className="text-sm text-muted-foreground">{workshop.nameSomali}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {workshop.verified && (
                    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                      <Shield className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                  <Badge variant={workshop.type === 'formal' ? 'default' : 'secondary'}>
                    {workshop.type}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  {workshop.location}, {workshop.city}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="w-4 h-4" />
                  {workshop.phone}
                </div>
              </div>

              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium">Trust Score</span>
                <span className="text-lg font-bold text-green-600">{workshop.trustScore}/100</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {workshop.services.map((service, sidx) => (
                  <Badge key={sidx} variant="outline" className="text-xs">
                    {service}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  </div>
);

const SparePartsView = () => (
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold">Spare Parts Intelligence</h2>
      <div className="flex gap-2">
        <Button variant="outline">
          <Camera className="w-4 h-4 mr-2" />
          Scan Part
        </Button>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Part
        </Button>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {SAMPLE_PARTS.map((part, idx) => (
        <motion.div
          key={part.id}
          custom={idx}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <Card className="shadow-md">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{part.name}</h3>
                  <p className="text-sm text-muted-foreground">{part.category}</p>
                </div>
                <Badge className={
                  part.demand === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                  part.demand === 'medium' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' :
                  'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                }>
                  {part.demand} demand
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                  <div className="text-xs text-muted-foreground mb-1">OEM Price</div>
                  <div className="text-xl font-bold text-blue-600">${part.priceOEM}</div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                  <div className="text-xs text-muted-foreground mb-1">Aftermarket</div>
                  <div className="text-xl font-bold text-green-600">${part.priceAftermarket}</div>
                </div>
              </div>

              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted-foreground">Stock Level</span>
                <span className="text-sm font-medium">{part.stock} units</span>
              </div>

              <div className="border-t pt-3">
                <div className="text-xs text-muted-foreground mb-2">Compatible with:</div>
                <div className="flex flex-wrap gap-1">
                  {part.compatibility.map((model, midx) => (
                    <Badge key={midx} variant="outline" className="text-xs">
                      {model}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  </div>
);

const AIToolsView = () => (
  <div className="space-y-4">
    <h2 className="text-2xl font-bold">AI-Powered Tools</h2>
    
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <AIToolCard 
        icon={<Mic className="w-8 h-8" />}
        title="Voice Job Logger"
        description="Record repair jobs in Somali language"
        color="blue"
      />
      <AIToolCard 
        icon={<Camera className="w-8 h-8" />}
        title="Part Recognition"
        description="Scan and identify spare parts instantly"
        color="green"
      />
      <AIToolCard 
        icon={<MessageSquare className="w-8 h-8" />}
        title="Repair Assistant"
        description="Get AI-powered diagnostic help"
        color="purple"
      />
    </div>

    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Maintenance Cost Calculator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select className="border rounded-lg px-4 py-2 bg-background">
            <option>Select Vehicle Make</option>
            <option>Toyota</option>
            <option>Suzuki</option>
            <option>Hyundai</option>
          </select>
          <select className="border rounded-lg px-4 py-2 bg-background">
            <option>Select Model</option>
            <option>Vitz</option>
            <option>Prado</option>
            <option>Hilux</option>
          </select>
          <select className="border rounded-lg px-4 py-2 bg-background">
            <option>Select Issue</option>
            <option>Brake Replacement</option>
            <option>Engine Overheating</option>
            <option>Oil Change</option>
          </select>
        </div>
        <Button className="w-full bg-green-600 hover:bg-green-700">
          Calculate Estimate
        </Button>

        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <h4 className="font-semibold mb-3">Estimated Cost (Toyota Vitz - Brake Replacement)</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Budget Option (Aftermarket Parts)</span>
              <span className="font-bold">$35-60</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Standard Option (Quality Parts)</span>
              <span className="font-bold">$85-110</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Premium Option (OEM Parts)</span>
              <span className="font-bold">$150-190</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

// ========== MAIN COMPONENT ==========
export default function MassOSDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'vehicles', label: 'Vehicles', icon: <Car className="w-4 h-4" /> },
    { id: 'workshops', label: 'Workshops', icon: <Wrench className="w-4 h-4" /> },
    { id: 'parts', label: 'Spare Parts', icon: <Package className="w-4 h-4" /> },
    { id: 'ai', label: 'AI Tools', icon: <Zap className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-lg">
                <Car className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">MASS OS</h1>
                <p className="text-sm text-green-100">Somaliland Automotive Intelligence</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 bg-green-700 px-4 py-2 rounded-lg">
                <Database className="w-4 h-4" />
                <span className="text-sm">Live Data</span>
              </div>
              <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center font-bold">
                MA
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-card border-b shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-green-600 text-green-600 bg-green-50 dark:bg-green-900/20'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                {tab.icon}
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {activeTab === 'dashboard' && <DashboardView />}
        {activeTab === 'vehicles' && <VehiclesView searchQuery={searchQuery} setSearchQuery={setSearchQuery} />}
        {activeTab === 'workshops' && <WorkshopsView />}
        {activeTab === 'parts' && <SparePartsView />}
        {activeTab === 'ai' && <AIToolsView />}
      </main>

      {/* Footer */}
      <footer className="bg-zinc-800 text-white mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold mb-3">MASS OS</h3>
              <p className="text-sm text-zinc-400">
                National Automotive Intelligence System for Somaliland
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Features</h4>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li>Workshop Management</li>
                <li>Vehicle Registry</li>
                <li>Parts Intelligence</li>
                <li>Market Analytics</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Data Coverage</h4>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li>247 Workshops</li>
                <li>18,453 Vehicles</li>
                <li>3 Major Cities</li>
                <li>Real-time Updates</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Contact</h4>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li>Hargeisa, Somaliland</li>
                <li>info@mass-os.so</li>
                <li>+252-63-XXXXXXX</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-zinc-700 text-center text-sm text-zinc-400">
            © 2026 MASS OS - Powered by M2 Creative & Consulting
          </div>
        </div>
      </footer>
    </div>
  );
}
