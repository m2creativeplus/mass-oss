"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: number
  email: string
  role: "admin" | "staff" | "technician" | "customer"
  firstName: string
  lastName: string
  phone?: string
  loginTime?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  isLoading: boolean
  hasPermission: (module: string, action: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Role permissions mapping
const rolePermissions: Record<string, Record<string, Record<string, boolean>>> = {
  admin: {
    dashboard: { read: true, write: true, delete: true, manage: true },
    customers: { read: true, write: true, delete: true, manage: true },
    vehicles: { read: true, write: true, delete: true, manage: true },
    appointments: { read: true, write: true, delete: true, manage: true },
    technicians: { read: true, write: true, delete: true, manage: true },
    suppliers: { read: true, write: true, delete: true, manage: true },
    inspections: { read: true, write: true, delete: true, manage: true },
    estimates: { read: true, write: true, delete: true, manage: true },
    inventory: { read: true, write: true, delete: true, manage: true },
    reports: { read: true, write: true, delete: false, manage: true },
    "ai-tools": { read: true, write: true, delete: false, manage: true },
  },
  staff: {
    dashboard: { read: true, write: false, delete: false, manage: false },
    customers: { read: true, write: true, delete: false, manage: false },
    vehicles: { read: true, write: true, delete: false, manage: false },
    appointments: { read: true, write: true, delete: false, manage: true },
    technicians: { read: true, write: false, delete: false, manage: false },
    suppliers: { read: true, write: true, delete: false, manage: false },
    inspections: { read: true, write: true, delete: false, manage: false },
    estimates: { read: true, write: true, delete: false, manage: true },
    inventory: { read: true, write: true, delete: false, manage: false },
    reports: { read: true, write: false, delete: false, manage: false },
    "ai-tools": { read: true, write: true, delete: false, manage: false },
  },
  technician: {
    dashboard: { read: true, write: false, delete: false, manage: false },
    customers: { read: true, write: false, delete: false, manage: false },
    vehicles: { read: true, write: true, delete: false, manage: false },
    appointments: { read: true, write: true, delete: false, manage: false },
    technicians: { read: true, write: false, delete: false, manage: false },
    suppliers: { read: true, write: false, delete: false, manage: false },
    inspections: { read: true, write: true, delete: false, manage: true },
    estimates: { read: true, write: true, delete: false, manage: false },
    inventory: { read: true, write: false, delete: false, manage: false },
    reports: { read: true, write: false, delete: false, manage: false },
    "ai-tools": { read: true, write: true, delete: false, manage: false },
  },
  customer: {
    dashboard: { read: true, write: false, delete: false, manage: false },
    vehicles: { read: true, write: false, delete: false, manage: false },
    appointments: { read: true, write: true, delete: false, manage: false },
    inspections: { read: true, write: false, delete: false, manage: false },
    estimates: { read: true, write: false, delete: false, manage: false },
  },
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem("mass_user")
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser)
        setUser(userData)
      } catch (error) {
        console.error("Error parsing saved user data:", error)
        localStorage.removeItem("mass_user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Login failed:", errorData.error)
        setIsLoading(false)
        return false
      }

      const { user: userData } = await response.json()

      // Store user data in local storage
      localStorage.setItem("mass_user", JSON.stringify(userData))

      // Update application state
      setUser(userData)
      setIsLoading(false)
      return true
    } catch (error) {
      console.error("Login error:", error)
      setIsLoading(false)
      return false
    }
  }

  const logout = async (): Promise<void> => {
    try {
      // Call logout API
      await fetch("/api/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })
    } catch (error) {
      console.error("Logout API error:", error)
    } finally {
      // Clear local state regardless of API call success
      setUser(null)
      localStorage.removeItem("mass_user")
    }
  }

  const hasPermission = (module: string, action: string): boolean => {
    if (!user) return false

    const userPermissions = rolePermissions[user.role]
    if (!userPermissions) return false

    const modulePermissions = userPermissions[module]
    if (!modulePermissions) return false

    return modulePermissions[action] || false
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, hasPermission }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
