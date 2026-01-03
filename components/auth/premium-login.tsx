"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Car, 
  Shield, 
  Wrench, 
  Users, 
  Eye, 
  EyeOff,
  ChevronRight,
  Sparkles,
  Zap,
  BarChart3,
  Clock
} from "lucide-react"

interface PremiumLoginProps {
  onLogin: (role: string, email: string, password: string) => void
  onDemoLogin: (role: string) => void
  isLoading?: boolean
}

const demoRoles = [
  {
    id: "admin",
    title: "Administrator",
    description: "Full system access & settings",
    icon: Shield,
    gradient: "from-violet-600 to-indigo-600",
    shadow: "shadow-violet-500/25"
  },
  {
    id: "staff",
    title: "Service Advisor",
    description: "Customer & service management",
    icon: Users,
    gradient: "from-blue-600 to-cyan-600",
    shadow: "shadow-blue-500/25"
  },
  {
    id: "technician",
    title: "Technician",
    description: "Jobs, inspections & repairs",
    icon: Wrench,
    gradient: "from-emerald-600 to-teal-600",
    shadow: "shadow-emerald-500/25"
  },
  {
    id: "customer",
    title: "Customer Portal",
    description: "Track repairs & approvals",
    icon: Car,
    gradient: "from-orange-600 to-red-600",
    shadow: "shadow-orange-500/25"
  }
]

const features = [
  { icon: Zap, text: "Real-time Updates", color: "text-yellow-400" },
  { icon: BarChart3, text: "Advanced Analytics", color: "text-blue-400" },
  { icon: Clock, text: "Time Tracking", color: "text-green-400" },
  { icon: Sparkles, text: "AI-Powered", color: "text-purple-400" }
]

export function PremiumLogin({ onLogin, onDemoLogin, isLoading = false }: PremiumLoginProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [activeTab, setActiveTab] = useState("demo")
  const [hoveredRole, setHoveredRole] = useState<string | null>(null)

  return (
    <div className="min-h-screen w-full flex">
      {/* Left Panel - Branding & Features */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
          
          {/* Radial Glow */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg shadow-orange-500/30">
              <Car className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">MASS Workshop</h1>
              <p className="text-sm text-slate-400">Vehicle Management System</p>
            </div>
          </div>

          {/* Hero Text */}
          <div className="space-y-8">
            <div>
              <h2 className="text-5xl font-bold text-white leading-tight">
                Streamline Your
                <span className="block bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                  Workshop Operations
                </span>
              </h2>
              <p className="mt-4 text-lg text-slate-400 max-w-md">
                Enterprise-grade automotive management trusted by leading workshops across East Africa.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, i) => (
                <div 
                  key={i}
                  className="flex items-center gap-3 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <feature.icon className={`h-5 w-5 ${feature.color}`} />
                  <span className="text-sm font-medium text-white">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-8">
            <div>
              <p className="text-3xl font-bold text-white">500+</p>
              <p className="text-sm text-slate-400">Active Workshops</p>
            </div>
            <div className="h-12 w-px bg-white/20" />
            <div>
              <p className="text-3xl font-bold text-white">50K+</p>
              <p className="text-sm text-slate-400">Vehicles Serviced</p>
            </div>
            <div className="h-12 w-px bg-white/20" />
            <div>
              <p className="text-3xl font-bold text-white">99.9%</p>
              <p className="text-sm text-slate-400">Uptime</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50 dark:bg-slate-950">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
              <Car className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-bold">MASS Workshop</h1>
          </div>

          {/* Welcome Text */}
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Welcome back</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-400">Sign in to access your dashboard</p>
          </div>

          {/* Login Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl">
              <TabsTrigger 
                value="demo" 
                className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm"
              >
                Quick Demo
              </TabsTrigger>
              <TabsTrigger 
                value="login"
                className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm"
              >
                Sign In
              </TabsTrigger>
            </TabsList>

            {/* Demo Login */}
            <TabsContent value="demo" className="mt-6 space-y-4">
              <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
                Select a role to explore the system
              </p>
              
              <div className="grid grid-cols-2 gap-3">
                {demoRoles.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => onDemoLogin(role.id)}
                    onMouseEnter={() => setHoveredRole(role.id)}
                    onMouseLeave={() => setHoveredRole(null)}
                    disabled={isLoading}
                    className={`
                      relative p-4 rounded-2xl border-2 text-left transition-all duration-300 overflow-hidden
                      ${hoveredRole === role.id 
                        ? 'border-transparent scale-105 shadow-2xl ' + role.shadow
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                      }
                      ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    `}
                  >
                    {/* Gradient Background on Hover */}
                    <div 
                      className={`absolute inset-0 bg-gradient-to-br ${role.gradient} transition-opacity duration-300 ${
                        hoveredRole === role.id ? 'opacity-100' : 'opacity-0'
                      }`}
                    />
                    
                    {/* Content */}
                    <div className="relative z-10">
                      <div className={`
                        h-10 w-10 rounded-xl flex items-center justify-center mb-3 transition-colors
                        ${hoveredRole === role.id 
                          ? 'bg-white/20 text-white' 
                          : `bg-gradient-to-br ${role.gradient} text-white`
                        }
                      `}>
                        <role.icon className="h-5 w-5" />
                      </div>
                      <h3 className={`font-semibold text-sm transition-colors ${
                        hoveredRole === role.id ? 'text-white' : 'text-slate-900 dark:text-white'
                      }`}>
                        {role.title}
                      </h3>
                      <p className={`text-xs mt-1 transition-colors ${
                        hoveredRole === role.id ? 'text-white/80' : 'text-slate-500 dark:text-slate-400'
                      }`}>
                        {role.description}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </TabsContent>

            {/* Email Login */}
            <TabsContent value="login" className="mt-6 space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@workshop.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 rounded-xl border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                  <button className="text-xs text-orange-600 hover:text-orange-700 font-medium">
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 rounded-xl border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-orange-500 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <Button 
                onClick={() => onLogin("staff", email, password)}
                disabled={isLoading || !email || !password}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold shadow-lg shadow-orange-500/30 transition-all hover:shadow-xl hover:shadow-orange-500/40"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    Sign In
                    <ChevronRight className="h-4 w-4" />
                  </div>
                )}
              </Button>
            </TabsContent>
          </Tabs>

          {/* Footer */}
          <p className="text-center text-xs text-slate-500 dark:text-slate-400">
            By signing in, you agree to our{" "}
            <a href="#" className="text-orange-600 hover:underline">Terms of Service</a>
            {" "}and{" "}
            <a href="#" className="text-orange-600 hover:underline">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  )
}
