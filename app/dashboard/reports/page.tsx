"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Users,
  Car,
  Wrench,
  Download,
  Calendar,
  BarChart3,
  PieChart,
  LineChart
} from "lucide-react";

// Mock data for reports
const MOCK_STATS = {
  revenue: { current: 45680, previous: 42100, change: 8.5 },
  workOrders: { current: 156, previous: 142, change: 9.9 },
  customers: { current: 89, previous: 78, change: 14.1 },
  avgTicket: { current: 293, previous: 296, change: -1.0 },
};

const MOCK_TOP_SERVICES = [
  { name: "Oil Change", count: 45, revenue: 4050 },
  { name: "Brake Service", count: 28, revenue: 8400 },
  { name: "Tire Rotation", count: 22, revenue: 1100 },
  { name: "Engine Diagnostics", count: 18, revenue: 2700 },
  { name: "AC Service", count: 15, revenue: 3750 },
];

const MOCK_TECHNICIANS = [
  { name: "Ahmed Hassan", jobs: 42, hours: 168, efficiency: 92 },
  { name: "Mohamed Ali", jobs: 38, hours: 160, efficiency: 88 },
  { name: "Ismail Omar", jobs: 35, hours: 152, efficiency: 85 },
  { name: "Yusuf Ibrahim", jobs: 28, hours: 140, efficiency: 78 },
];

export default function ReportsDashboardPage() {
  const [dateRange, setDateRange] = useState("this-month");
  const [selectedLocation, setSelectedLocation] = useState("all");

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const StatCard = ({ 
    title, 
    value, 
    change, 
    icon: Icon, 
    prefix = "" 
  }: {
    title: string;
    value: number;
    change: number;
    icon: any;
    prefix?: string;
  }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
            <p className="text-2xl font-bold mt-1">
              {prefix}{value.toLocaleString()}
            </p>
          </div>
          <div className="p-3 rounded-full bg-emerald-100 dark:bg-emerald-900">
            <Icon className="w-6 h-6 text-emerald-600" />
          </div>
        </div>
        <div className={`flex items-center gap-1 mt-2 text-sm ${
          change >= 0 ? "text-green-600" : "text-red-600"
        }`}>
          {change >= 0 ? (
            <TrendingUp className="w-4 h-4" />
          ) : (
            <TrendingDown className="w-4 h-4" />
          )}
          <span>{Math.abs(change)}% vs last period</span>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Reports & Analytics
          </h1>
          <p className="text-gray-500">Business performance insights</p>
        </div>
        <div className="flex gap-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="this-week">This Week</SelectItem>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="last-month">Last Month</SelectItem>
              <SelectItem value="this-year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedLocation} onValueChange={setSelectedLocation}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              <SelectItem value="HRG-01">Hargeisa Main</SelectItem>
              <SelectItem value="BUR-01">Burao Branch</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue"
          value={MOCK_STATS.revenue.current}
          change={MOCK_STATS.revenue.change}
          icon={DollarSign}
          prefix="$"
        />
        <StatCard
          title="Work Orders"
          value={MOCK_STATS.workOrders.current}
          change={MOCK_STATS.workOrders.change}
          icon={Wrench}
        />
        <StatCard
          title="Customers Served"
          value={MOCK_STATS.customers.current}
          change={MOCK_STATS.customers.change}
          icon={Users}
        />
        <StatCard
          title="Avg. Ticket Value"
          value={MOCK_STATS.avgTicket.current}
          change={MOCK_STATS.avgTicket.change}
          icon={Car}
          prefix="$"
        />
      </div>

      {/* Detailed Reports */}
      <Tabs defaultValue="services" className="space-y-4">
        <TabsList>
          <TabsTrigger value="services" className="gap-2">
            <BarChart3 className="w-4 h-4" />
            Services
          </TabsTrigger>
          <TabsTrigger value="technicians" className="gap-2">
            <Users className="w-4 h-4" />
            Technicians
          </TabsTrigger>
          <TabsTrigger value="revenue" className="gap-2">
            <LineChart className="w-4 h-4" />
            Revenue
          </TabsTrigger>
        </TabsList>

        {/* Top Services */}
        <TabsContent value="services">
          <Card>
            <CardHeader>
              <CardTitle>Top Services</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {MOCK_TOP_SERVICES.map((service, idx) => (
                  <div key={service.name} className="flex items-center gap-4">
                    <span className="text-lg font-bold text-gray-400 w-6">
                      #{idx + 1}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{service.name}</span>
                        <span className="text-sm text-gray-500">
                          {service.count} jobs
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-emerald-500 h-2 rounded-full"
                          style={{
                            width: `${(service.count / MOCK_TOP_SERVICES[0].count) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                    <span className="font-bold text-emerald-600">
                      {formatCurrency(service.revenue)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Technician Performance */}
        <TabsContent value="technicians">
          <Card>
            <CardHeader>
              <CardTitle>Technician Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Technician</th>
                      <th className="text-center py-3 px-4">Jobs</th>
                      <th className="text-center py-3 px-4">Hours</th>
                      <th className="text-center py-3 px-4">Efficiency</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_TECHNICIANS.map((tech) => (
                      <tr key={tech.name} className="border-b last:border-0">
                        <td className="py-3 px-4 font-medium">{tech.name}</td>
                        <td className="py-3 px-4 text-center">{tech.jobs}</td>
                        <td className="py-3 px-4 text-center">{tech.hours}h</td>
                        <td className="py-3 px-4 text-center">
                          <Badge
                            variant={
                              tech.efficiency >= 90
                                ? "default"
                                : tech.efficiency >= 80
                                ? "secondary"
                                : "destructive"
                            }
                          >
                            {tech.efficiency}%
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Revenue Chart Placeholder */}
        <TabsContent value="revenue">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Trend</CardTitle>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <LineChart className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p>Revenue chart visualization</p>
                <p className="text-sm">Integrate with Recharts for full charts</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
