"use client"

import { createContext, useContext, useState, useEffect, useMemo } from "react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useConvexAuth } from "@/components/auth/convex-auth-provider"

interface Organization {
  _id: string
  name: string
  slug: string
  role: string
}

interface OrganizationContextType {
  organization: Organization | null
  setOrganization: (org: Organization) => void
  organizations: Organization[]
  isLoading: boolean
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined)

// Demo organization for demo users - instant access, no backend query needed
const DEMO_ORGANIZATION: Organization = {
  _id: "demo-org-001",
  name: "MASS Car Workshop",
  slug: "mass-hargeisa",
  role: "admin"
}

export function OrganizationProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoading: authLoading } = useConvexAuth()
  const [activeOrgId, setActiveOrgId] = useState<string | null>(null)
  
  // Demo user detection: check user.id (from convex-auth-provider demo users)
  const isDemoUser = Boolean(user?.id?.startsWith("demo-"))
  
  // For real users only: query Convex backend for their organizations
  // Demo users skip this query entirely - they get DEMO_ORGANIZATION instantly
  // Note: Real users would have _id from Convex, demo users have id from local mock
  const shouldQueryConvex = Boolean(!authLoading && user && !isDemoUser)
  
  // Skip query for demo users and when not authenticated
  const userOrgs = useQuery(
    api.functions.getUserOrgs, 
    shouldQueryConvex ? { userId: user?.id as any } : "skip"
  )

  // Compute organizations list
  const organizations = useMemo(() => {
    // Demo users get instant mock organization
    if (isDemoUser) {
      return [DEMO_ORGANIZATION]
    }
    // Real users get their orgs from Convex (or empty array if query returned empty)
    return userOrgs ?? []
  }, [isDemoUser, userOrgs])
  
  // Compute loading state - BE VERY CAREFUL HERE
  // Loading = TRUE only when:
  // 1. Auth is still initializing, OR
  // 2. User is logged in AND is NOT a demo user AND Convex query hasn't returned yet
  const isLoading = useMemo(() => {
    // Still checking auth state
    if (authLoading) return true
    
    // No user = not loading (will redirect to login)  
    if (!user) return false
    
    // Demo user = NEVER loading (instant mock data)
    if (isDemoUser) return false
    
    // Real user waiting for Convex = loading until query returns
    return userOrgs === undefined
  }, [authLoading, user, isDemoUser, userOrgs])

  // Debug logging (can be removed in production)
  useEffect(() => {
    console.log("[OrgProvider] State:", { 
      authLoading, 
      hasUser: !!user,
      userId: user?.id,
      isDemoUser, 
      shouldQueryConvex,
      userOrgsStatus: userOrgs === undefined ? "pending" : userOrgs === null ? "null" : `${userOrgs.length} orgs`,
      isLoading,
      organizations: organizations.map(o => o.name)
    })
  }, [authLoading, user, isDemoUser, shouldQueryConvex, userOrgs, isLoading, organizations])

  // Set default active org when organizations change
  useEffect(() => {
    if (organizations.length > 0 && !activeOrgId) {
      setActiveOrgId(organizations[0]._id)
    }
  }, [organizations, activeOrgId])

  const activeOrg = organizations.find(o => o._id === activeOrgId) || 
                   (organizations.length > 0 ? organizations[0] : null)

  const setOrganization = (org: Organization) => {
    setActiveOrgId(org._id)
  }

  return (
    <OrganizationContext.Provider value={{
      organization: activeOrg,
      setOrganization,
      organizations,
      isLoading
    }}>
      {children}
    </OrganizationContext.Provider>
  )
}

export function useOrganization() {
  const context = useContext(OrganizationContext)
  if (context === undefined) {
    throw new Error("useOrganization must be used within an OrganizationProvider")
  }
  return context
}
// force deploy 1767406620
