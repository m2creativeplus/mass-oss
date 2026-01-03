"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Car, AlertCircle } from "lucide-react"

interface LoginFormProps {
  onLogin: (email: string, password: string) => Promise<boolean>
  isLoading?: boolean
  error?: string
}

export function LoginForm({ onLogin, isLoading = false, error }: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [selectedDemo, setSelectedDemo] = useState<string | null>(null)

  const demoUsers = [
    { role: "Admin", email: "admin@masscar.com", password: "123456", color: "bg-red-500" },
    { role: "Staff", email: "staff@masscar.com", password: "123456", color: "bg-blue-500" },
    { role: "Tech", email: "tech@masscar.com", password: "123456", color: "bg-green-500" },
    { role: "Customer", email: "customer@masscar.com", password: "123456", color: "bg-purple-500" },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) return
    await onLogin(email, password)
  }

  const handleDemoLogin = (demoUser: (typeof demoUsers)[0]) => {
    setSelectedDemo(demoUser.role)
    setEmail(demoUser.email)
    setPassword(demoUser.password)
    onLogin(demoUser.email, demoUser.password)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
              <Car className="w-7 h-7 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold text-white">MASS Car Workshop</h1>
              <p className="text-sm text-slate-300">Vehicle Workshop Management System</p>
            </div>
          </div>
        </div>

        {/* Login Form */}
        <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center text-white">Sign In</CardTitle>
            <CardDescription className="text-center text-slate-300">
              Enter your credentials to access the system
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-200">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-200">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 text-slate-400 hover:text-white"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            {/* Demo Users Section */}
            <div className="pt-4 border-t border-slate-600">
              <p className="text-sm text-slate-300 text-center mb-3">Demo Users (Free)</p>
              <div className="grid grid-cols-2 gap-2">
                {demoUsers.map((user) => (
                  <Button
                    key={user.role}
                    variant="outline"
                    size="sm"
                    className={`border-slate-600 text-slate-200 hover:text-white transition-all ${
                      selectedDemo === user.role ? "ring-2 ring-orange-500" : ""
                    }`}
                    onClick={() => handleDemoLogin(user)}
                    disabled={isLoading}
                  >
                    <div className={`w-2 h-2 rounded-full ${user.color} mr-2`} />
                    {user.role}
                  </Button>
                ))}
              </div>
              <p className="text-xs text-slate-400 text-center mt-2">Click any role to login instantly</p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-slate-400">
          <p>Hargeisa, Somaliland • v2.1.0</p>
        </div>
      </div>
    </div>
  )
}
