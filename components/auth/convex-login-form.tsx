"use client"

import { useState } from "react"
import { useConvexAuth } from "./convex-auth-provider"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Car, AlertCircle, User, Shield, Wrench, UserCircle, Crown } from "lucide-react"

export function ConvexLoginForm() {
  const { login, isLoading } = useConvexAuth()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleLoginSuccess = (email: string) => {
    if (email.toLowerCase().includes("customer")) {
      router.push("/client")
    } else {
      router.push("/dashboard")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const result = await login(email, password)
    if (!result.success) {
      setError(result.error || "Login failed")
    } else {
      handleLoginSuccess(email)
    }
  }

  const handleDemoLogin = async (demoEmail: string) => {
    setEmail(demoEmail)
    setPassword("123456")
    setError(null)

    const result = await login(demoEmail, "123456")
    if (!result.success) {
      setError(result.error || "Login failed")
    } else {
      handleLoginSuccess(demoEmail)
    }
  }

  const demoAccounts = [
    { email: "owner@masscar.com", role: "Owner", icon: Crown, color: "text-amber-500" },
    { email: "admin@masscar.com", role: "Admin", icon: Shield, color: "text-red-500" },
    { email: "staff@masscar.com", role: "Staff", icon: User, color: "text-blue-500" },
    { email: "tech@masscar.com", role: "Technician", icon: Wrench, color: "text-green-500" },
    { email: "customer@masscar.com", role: "Customer", icon: UserCircle, color: "text-purple-500" },
  ]

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <Card className="w-full max-w-md bg-slate-800/50 border-slate-700 backdrop-blur-xl">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
            <Car className="w-8 h-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-white">MASS Car Workshop</CardTitle>
            <CardDescription className="text-slate-400">
              Vehicle Workshop Management System
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive" className="bg-red-500/10 border-red-500/50 text-red-400">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-200">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@masscar.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-200">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20"
                disabled={isLoading}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold shadow-lg shadow-blue-500/25"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-600" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-800/50 px-2 text-slate-400">Demo Accounts</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {demoAccounts.map((account) => {
              const Icon = account.icon
              return (
                <Button
                  key={account.email}
                  variant="outline"
                  className="border-slate-600 bg-slate-700/30 hover:bg-slate-700/50 text-slate-300 hover:text-white"
                  onClick={() => handleDemoLogin(account.email)}
                  disabled={isLoading}
                >
                  <Icon className={`mr-2 h-4 w-4 ${account.color}`} />
                  {account.role}
                </Button>
              )
            })}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col items-center text-xs text-slate-500 space-y-1">
          <p>Demo Password: <code className="px-1 py-0.5 bg-slate-700 rounded text-slate-300">123456</code></p>
          <p>Powered by Convex • Real-time Data</p>
        </CardFooter>
      </Card>
    </div>
  )
}
