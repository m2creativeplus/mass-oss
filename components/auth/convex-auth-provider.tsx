"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface AuthUser {
  id: string
  email: string
  role: "admin" | "staff" | "technician" | "customer"
  firstName: string
  lastName: string
  phone?: string
  isActive: boolean
}

interface AuthContextType {
  user: AuthUser | null
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  isLoading: boolean
  hasPermission: (module: string, action: string) => boolean
  authError: string | null
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
    pos: { read: true, write: true, delete: true, manage: true },
    delivery: { read: true, write: true, delete: true, manage: true },
    reminders: { read: true, write: true, delete: true, manage: true },
    "work-orders": { read: true, write: true, delete: true, manage: true },
    "vehicle-passport": { read: true, write: true, delete: true, manage: true },
    "ai-diagnostics": { read: true, write: true, delete: true, manage: true },
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
    pos: { read: true, write: true, delete: false, manage: false },
    delivery: { read: true, write: true, delete: false, manage: false },
    reminders: { read: true, write: true, delete: false, manage: false },
    "work-orders": { read: true, write: true, delete: false, manage: false },
    "vehicle-passport": { read: true, write: false, delete: false, manage: false },
    "ai-diagnostics": { read: true, write: true, delete: false, manage: false },
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
    pos: { read: true, write: true, delete: false, manage: false },
    delivery: { read: true, write: true, delete: false, manage: false },
    reminders: { read: true, write: false, delete: false, manage: false },
    "work-orders": { read: true, write: true, delete: false, manage: false },
    "vehicle-passport": { read: true, write: true, delete: false, manage: false },
    "ai-diagnostics": { read: true, write: true, delete: false, manage: false },
  },
  customer: {
    dashboard: { read: true, write: false, delete: false, manage: false },
    vehicles: { read: true, write: false, delete: false, manage: false },
    appointments: { read: true, write: true, delete: false, manage: false },
    inspections: { read: true, write: false, delete: false, manage: false },
    estimates: { read: true, write: false, delete: false, manage: false },
    "vehicle-passport": { read: true, write: false, delete: false, manage: false },
  },
}

// Demo users for local development
const demoUsers: Record<string, AuthUser> = {
  "admin@masscar.com": {
    id: "demo-admin-001",
    email: "admin@masscar.com",
    role: "admin",
    firstName: "Admin",
    lastName: "User",
    isActive: true,
  },
  "owner@masscar.com": {
    id: "demo-owner-001",
    email: "owner@masscar.com",
    role: "admin",
    firstName: "Owner / Super Admin",
    lastName: "Executive",
    isActive: true,
  },
  "staff@masscar.com": {
    id: "demo-staff-001",
    email: "staff@masscar.com",
    role: "staff",
    firstName: "Staff",
    lastName: "Member",
    isActive: true,
  },
  "tech@masscar.com": {
    id: "demo-tech-001",
    email: "tech@masscar.com",
    role: "technician",
    firstName: "Tech",
    lastName: "Worker",
    isActive: true,
  },
  "customer@masscar.com": {
    id: "demo-customer-001",
    email: "customer@masscar.com",
    role: "customer",
    firstName: "Customer",
    lastName: "User",
    isActive: true,
  },
}

const STORAGE_KEY = "mass_workshop_auth"

export function ConvexAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [authError, setAuthError] = useState<string | null>(null)

  // Load user from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsedUser = JSON.parse(stored)
        setUser(parsedUser)
      }
    } catch (error) {
      console.error("[Auth] Failed to load stored user:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true)
      setAuthError(null)

      if (!email || !password) {
        return { success: false, error: "Email and password are required" }
      }

      // Demo mode: Check if email matches a demo user with password "123456"
      const demoUser = demoUsers[email.toLowerCase()]
      if (demoUser && password === "123456") {
        console.log("[Auth] Demo login successful:", email)
        setUser(demoUser)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(demoUser))
        return { success: true }
      }

      // If not a demo user, return error
      return { 
        success: false, 
        error: "Invalid credentials. Use demo accounts: admin@masscar.com, staff@masscar.com, tech@masscar.com, or customer@masscar.com with password: 123456" 
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred"
      console.error("[Auth] Login error:", error)
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async (): Promise<void> => {
    try {
      setUser(null)
      setAuthError(null)
      localStorage.removeItem(STORAGE_KEY)
      console.log("[Auth] Logged out successfully")
    } catch (error) {
      console.error("[Auth] Logout error:", error)
      // Still clear state even on error
      setUser(null)
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
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isLoading,
        hasPermission,
        authError,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useConvexAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useConvexAuth must be used within a ConvexAuthProvider")
  }
  return context
}
