"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { hasModuleAccess } from "@/lib/permissions"

// ============================================================
// MASS OSS - Production Auth Provider
// Cookie-based sessions via API routes — zero localStorage
// ============================================================

interface AuthUser {
  id: string
  email: string
  role: "admin" | "staff" | "technician" | "customer"
  firstName: string
  lastName: string
  phone?: string
  avatarUrl?: string
  emailVerified?: boolean
}

interface AuthContextType {
  user: AuthUser | null
  orgId: string | null
  orgName: string | null
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signup: (data: SignupData) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  isLoading: boolean
  hasPermission: (module: string, action: string) => boolean
  refreshSession: () => Promise<void>
}

interface SignupData {
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
  workshopName?: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function ConvexAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [orgId, setOrgId] = useState<string | null>(null)
  const [orgName, setOrgName] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Hydrate session from cookie on mount
  const refreshSession = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/session", { credentials: "include" })
      if (res.ok) {
        const data = await res.json()
        if (data.user) {
          setUser(data.user)
          setOrgId(data.orgId || null)
          setOrgName(data.orgName || null)
          return
        }
      }
      // No valid session
      setUser(null)
      setOrgId(null)
      setOrgName(null)
    } catch {
      setUser(null)
      setOrgId(null)
      setOrgName(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshSession()
  }, [refreshSession])

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true)

      if (!email || !password) {
        return { success: false, error: "Email and password are required" }
      }

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        return { success: false, error: data.error || "Login failed" }
      }

      setUser(data.user)
      setOrgId(data.orgId || null)
      setOrgName(data.orgName || null)

      return { success: true }
    } catch (error) {
      return { success: false, error: "Network error. Please try again." }
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (data: SignupData): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true)

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      })

      const result = await res.json()

      if (!res.ok) {
        return { success: false, error: result.error || "Signup failed" }
      }

      setUser(result.user)
      setOrgId(result.orgId || null)
      setOrgName(result.orgName || null)

      return { success: true }
    } catch (error) {
      return { success: false, error: "Network error. Please try again." }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async (): Promise<void> => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      })
    } catch {
      // Silent fail — cookie will be cleared either way
    } finally {
      setUser(null)
      setOrgId(null)
      setOrgName(null)
    }
  }

  const hasPermission = (module: string, action: string): boolean => {
    if (!user) return false
    return hasModuleAccess(user.role, module, action as "read" | "write" | "delete" | "manage")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        orgId,
        orgName,
        login,
        signup,
        logout,
        isLoading,
        hasPermission,
        refreshSession,
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
