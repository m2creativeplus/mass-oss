"use client"

import { useState, useEffect } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Save, Loader2, Globe, Palette, Search, Share2 } from "lucide-react"
import { toast } from "sonner"

export function Settings({ orgId }: { orgId: string }) {
  const settings = useQuery(api.functions.getOrgSettings, { orgId })
  const updateSettings = useMutation(api.functions.updateOrgSettings)
  
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    siteName: "",
    timezone: "",
    currency: "",
    logoUrl: "",
    faviconUrl: "",
    primaryColor: "#00A65A",
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
    googleAnalyticsId: "",
    facebookPixelId: ""
  })

  // Load initial data
  useEffect(() => {
    if (settings) {
      setFormData({
        siteName: settings.siteName || "",
        timezone: settings.timezone || "Africa/Nairobi",
        currency: settings.currency || "USD",
        logoUrl: settings.logoUrl || "",
        faviconUrl: settings.faviconUrl || "",
        primaryColor: settings.primaryColor || "#00A65A",
        seoTitle: settings.seoTitle || "",
        seoDescription: settings.seoDescription || "",
        seoKeywords: settings.seoKeywords || "",
        googleAnalyticsId: settings.googleAnalyticsId || "",
        facebookPixelId: settings.facebookPixelId || ""
      })
    }
  }, [settings])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      await updateSettings({
        orgId,
        ...formData
      })
      toast.success("Settings saved successfully")
    } catch (error) {
      console.error(error)
      toast.error("Failed to save settings")
    } finally {
      setLoading(false)
    }
  }

  if (settings === undefined) {
    return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
  }

  return (
    <div className="h-full bg-slate-50 dark:bg-slate-950 p-6 overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Admin Settings</h2>
          <p className="text-slate-500">Manage your workspace configuration</p>
        </div>
        <Button onClick={handleSave} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="general" className="w-full space-y-4">
        <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
          <TabsTrigger value="general">
            <Globe className="mr-2 h-4 w-4" /> General
          </TabsTrigger>
          <TabsTrigger value="branding">
            <Palette className="mr-2 h-4 w-4" /> Branding
          </TabsTrigger>
          <TabsTrigger value="seo">
            <Search className="mr-2 h-4 w-4" /> SEO
          </TabsTrigger>
          <TabsTrigger value="integrations">
            <Share2 className="mr-2 h-4 w-4" /> Integrations
          </TabsTrigger>
        </TabsList>

        {/* GENERAL TAB */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Information</CardTitle>
              <CardDescription>Basic configuration for your portal.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="siteName">Site Name</Label>
                <Input id="siteName" name="siteName" value={formData.siteName} onChange={handleChange} placeholder="MASS Car Workshop" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Input id="timezone" name="timezone" value={formData.timezone} onChange={handleChange} placeholder="Africa/Nairobi" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Input id="currency" name="currency" value={formData.currency} onChange={handleChange} placeholder="USD" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* BRANDING TAB */}
        <TabsContent value="branding">
          <Card>
            <CardHeader>
              <CardTitle>Branding & Appearance</CardTitle>
              <CardDescription>Customize the look and feel of your workspace.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="logoUrl">Logo URL (Public URL)</Label>
                <div className="flex gap-2">
                  <Input id="logoUrl" name="logoUrl" value={formData.logoUrl} onChange={handleChange} placeholder="https://..." />
                  {formData.logoUrl && <img src={formData.logoUrl} alt="Logo Preview" className="h-10 w-10 object-contain border rounded" />}
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="faviconUrl">Favicon URL</Label>
                <Input id="faviconUrl" name="faviconUrl" value={formData.faviconUrl} onChange={handleChange} placeholder="https://..." />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="primaryColor">Primary HEX Color</Label>
                <div className="flex gap-2 items-center">
                  <Input id="primaryColor" name="primaryColor" value={formData.primaryColor} onChange={handleChange} className="w-32" />
                  <div className="h-10 w-10 rounded border" style={{ backgroundColor: formData.primaryColor }}></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* SEO TAB */}
        <TabsContent value="seo">
          <Card>
            <CardHeader>
              <CardTitle>SEO Configuration</CardTitle>
              <CardDescription>Manage search engine optimization settings for public pages.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="seoTitle">Meta Title</Label>
                <Input id="seoTitle" name="seoTitle" value={formData.seoTitle} onChange={handleChange} placeholder="Best Car Workshop in Hargeisa" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="seoDescription">Meta Description</Label>
                <Input id="seoDescription" name="seoDescription" value={formData.seoDescription} onChange={handleChange} placeholder="Professional auto repair services..." />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="seoKeywords">Keywords (comma separated)</Label>
                <Input id="seoKeywords" name="seoKeywords" value={formData.seoKeywords} onChange={handleChange} placeholder="mechanic, repair, oil change" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* INTEGRATIONS TAB */}
        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle>Third-Party Integrations</CardTitle>
              <CardDescription>Connect external tools for analytics and tracking.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="googleAnalyticsId">Google Analytics ID (G-XXXXXXXX)</Label>
                <Input id="googleAnalyticsId" name="googleAnalyticsId" value={formData.googleAnalyticsId} onChange={handleChange} placeholder="G-12345678" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="facebookPixelId">Facebook Pixel ID</Label>
                <Input id="facebookPixelId" name="facebookPixelId" value={formData.facebookPixelId} onChange={handleChange} placeholder="1234567890" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
