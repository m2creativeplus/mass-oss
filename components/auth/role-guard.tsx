"use client"

import { useConvexAuth } from "@/components/auth/convex-auth-provider"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Loader2 } from "lucide-react"

interface RoleGuardProps {
  children: React.ReactNode
  allowedRoles: string[] // "admin", "staff", "technician", "customer"
  fallbackPath?: string
}

export function RoleGuard({ children, allowedRoles, fallbackPath = "/login" }: RoleGuardProps) {
  const { user, isLoading } = useConvexAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        // Not logged in -> Redirect to login
        router.push("/login")
      } else if (!allowedRoles.includes(user.role)) {
        // Logged in but wrong role -> Redirect based on role
        if (user.role === "customer") {
          router.push("/client")
        } else {
          router.push("/dashboard")
        }
      }
    }
  }, [user, isLoading, allowedRoles, router, fallbackPath])

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    )
  }

  // If user exists and has allowed role, render children
  if (user && allowedRoles.includes(user.role)) {
    return <>{children}</>
  }

  return null
}
