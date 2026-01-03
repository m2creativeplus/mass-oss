"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Download, 
  Calendar,
  PieChart,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react"
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  Legend
} from 'recharts'
import { useState } from "react"

const monthlyRevenue = [
  { name: 'Jan', revenue: 45000, expenses: 32000, profit: 13000 },
  { name: 'Feb', revenue: 52000, expenses: 35000, profit: 17000 },
  { name: 'Mar', revenue: 48000, expenses: 33000, profit: 15000 },
  { name: 'Apr', revenue: 61000, expenses: 40000, profit: 21000 },
  { name: 'May', revenue: 55000, expenses: 38000, profit: 17000 },
  { name: 'Jun', revenue: 67000, expenses: 42000, profit: 25000 },
]

const serviceCategoryData = [
  { name: 'Oil & Lube', value: 35000 },
  { name: 'Brakes', value: 25000 },
  { name: 'Tires', value: 15000 },
  { name: 'Engine', value: 45000 },
  { name: 'Electrical', value: 20000 },
  { name: 'Suspension', value: 18000 },
]

const technicianPerformance = [
  { name: 'John Doe', jobs: 45, efficiency: 95 },
  { name: 'Mike Ross', jobs: 38, efficiency: 88 },
  { name: 'Sarah Smith', jobs: 52, efficiency: 92 },
  { name: 'David Lee', jobs: 30, efficiency: 85 },
]

export function ReportsAnalytics() {
  const [timeRange, setTimeRange] = useState("6m")

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics & Reports</h1>
          <p className="text-muted-foreground mt-1">Financial insights and workshop performance metrics</p>
        </div>
        <div className="flex gap-2">
           <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="3m">Last 3 Months</SelectItem>
              <SelectItem value="6m">Last 6 Months</SelectItem>
              <SelectItem value="1y">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <h3 className="text-2xl font-bold mt-1 text-emerald-600 dark:text-emerald-400">$328,000</h3>
                <div className="flex items-center mt-2 text-xs text-emerald-600">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  +12.5% vs last period
                </div>
              </div>
              <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">Net Profit</p>
                <h3 className="text-2xl font-bold mt-1">$108,000</h3>
                <div className="flex items-center mt-2 text-xs text-emerald-600">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  +8.2% vs last period
                </div>
              </div>
              <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">Avg Ticket Value</p>
                <h3 className="text-2xl font-bold mt-1">$458</h3>
                <div className="flex items-center mt-2 text-xs text-red-500">
                  <ArrowDownRight className="h-3 w-3 mr-1" />
                  -2.1% vs last period
                </div>
              </div>
              <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">Parts Cost</p>
                <h3 className="text-2xl font-bold mt-1">$85,000</h3>
                <p className="text-xs text-muted-foreground mt-2">26% of Total Revenue</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                <PieChart className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts Area */}
      <Tabs defaultValue="financial" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="jobs">Job Analysis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="financial" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 glass-card">
              <CardHeader>
                <CardTitle>Revenue vs Expenses</CardTitle>
                <CardDescription>Monthly financial performance breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyRevenue} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                      <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value/1000}k`} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--popover))', 
                          borderRadius: '8px', 
                          border: '1px solid hsl(var(--border))',
                        }}
                        cursor={{ fill: 'hsl(var(--muted)/0.3)' }}
                      />
                      <Legend />
                      <Bar dataKey="revenue" fill="hsl(var(--primary))" name="Revenue" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="expenses" fill="hsl(var(--destructive))" name="Expenses" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Profit Trend</CardTitle>
                <CardDescription>Monthly net profit analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyRevenue} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                      <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--popover))', 
                          borderRadius: '8px', 
                          border: '1px solid hsl(var(--border))',
                        }}
                      />
                      <Area type="monotone" dataKey="profit" stroke="#10b981" fillOpacity={1} fill="url(#colorProfit)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="mt-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Technician Efficiency & Output</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={technicianPerformance} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="hsl(var(--border))" />
                    <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                    <YAxis dataKey="name" type="category" stroke="hsl(var(--foreground))" width={100} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--popover))', 
                        borderRadius: '8px', 
                        border: '1px solid hsl(var(--border))',
                      }}
                    />
                    <Legend />
                    <Bar dataKey="jobs" fill="#3b82f6" name="Jobs Completed" radius={[0, 4, 4, 0]} barSize={20} />
                    <Bar dataKey="efficiency" fill="#8b5cf6" name="Efficiency Score (%)" radius={[0, 4, 4, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="jobs" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Revenue by Service Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={serviceCategoryData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" width={100} />
                      <Tooltip />
                      <Bar dataKey="value" fill="#f97316" radius={[0, 4, 4, 0]} barSize={30} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Top Parts Used</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "5W-30 Synthetic Oil", count: 145, trend: "+12%" },
                    { name: "Oil Filter (Universal)", count: 132, trend: "+8%" },
                    { name: "Brake Pads (Front)", count: 89, trend: "-2%" },
                    { name: "Air Filter", count: 76, trend: "+5%" },
                    { name: "Spark Plugs (Set)", count: 45, trend: "+15%" },
                  ].map((part, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                      <div>
                        <p className="font-medium text-sm">{part.name}</p>
                        <p className="text-xs text-muted-foreground">{part.count} units sold</p>
                      </div>
                      <span className={`text-xs font-bold ${part.trend.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}`}>
                        {part.trend}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
