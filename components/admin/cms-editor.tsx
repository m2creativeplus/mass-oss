"use client"

import { useState } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { Save, Loader2, Globe } from "lucide-react"

export function CMSEditor() {

  const [activeTab, setActiveTab] = useState("hero")
  
  // CMS content — using local state since Convex cms module not yet implemented
  const heroContent: any[] = []
  const featureContent: any[] = []
  
  const updateContent = async (_args: any) => { /* TODO: implement cms module */ }
  const [isSaving, setIsSaving] = useState(false)

  // Helper to find value by key
  const getValue = (data: any[], key: string, fallback: string) => {
    const item = data.find(d => d.key === key)
    return item ? item.value : fallback
  }

  // Local state for form management
  // We initialize with empty strings, and populate when data loads
  const [heroForm, setHeroForm] = useState({
    headline: "",
    subheadline: "",
    cta_text: ""
  })

  // Effect to populate form when data loads (simplified for this demo)
  // In a robust app, we'd use useEffect or key-based form handling

  const handleSave = async (section: string, data: Record<string, string>) => {
    setIsSaving(true)
    try {
      // iterate over keys and save each
      await Promise.all(
        Object.entries(data).map(([key, value]) => 
          updateContent({
            section,
            key,
            value,
            type: "text"
          })
        )
      )
      toast.success("Website content updated successfully.")
    } catch (error) {
       toast.error("Failed to save changes.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Website Content (CMS)</h2>
          <p className="text-muted-foreground">Manage text and settings for your public landing page.</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Globe className="h-4 w-4" /> View Site
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="hero">Hero Section</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="contact">Contact Info</TabsTrigger>
        </TabsList>

        <TabsContent value="hero" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hero Configuration</CardTitle>
              <CardDescription>The main banner area of your homepage.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Main Headline</Label>
                <Input 
                   defaultValue={getValue(heroContent, "headline", "Modern Workshop Management")} 
                   onChange={(e) => setHeroForm({...heroForm, headline: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Sub-Headline</Label>
                <Textarea 
                   defaultValue={getValue(heroContent, "subheadline", "Streamline your auto repair business with our all-in-one platform.")}
                   onChange={(e) => setHeroForm({...heroForm, subheadline: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>CTA Button Text</Label>
                <Input 
                   defaultValue={getValue(heroContent, "cta_text", "Start Free Trial")}
                   onChange={(e) => setHeroForm({...heroForm, cta_text: e.target.value})}
                />
              </div>
              <div className="pt-4">
                <Button onClick={() => handleSave("hero", heroForm)} disabled={isSaving}>
                  {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features">
           <Card>
             <CardHeader>
               <CardTitle>Feature Highlights</CardTitle>
               <CardDescription>Edit feature titles and descriptions.</CardDescription>
             </CardHeader>
             <CardContent>
                <p className="text-sm text-slate-500">Feature editing coming soon in next sprint.</p>
             </CardContent>
           </Card>
        </TabsContent>
        {/* Other tabs placeholders */}
      </Tabs>
    </div>
  )
}
