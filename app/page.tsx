"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useConvexAuth } from "@/components/auth/convex-auth-provider"

export default function Home() {
  const router = useRouter()
  const { user, isLoading } = useConvexAuth()

  useEffect(() => {
    if (isLoading) return

    if (user) {
      router.push("/dashboard")
    } else {
      router.push("/login")
    }
  }, [user, isLoading, router])

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
    </div>
  )
}
