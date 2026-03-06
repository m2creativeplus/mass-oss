"use client"

import { useState, useEffect } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Save, 
  Loader2, 
  Globe, 
  Palette, 
  Search, 
  Share2,
  Shield,
  Users,
  Building2,
  Bell,
  Clock,
  DollarSign,
  MapPin,
  Phone,
  Mail,
  CheckCircle2
} from "lucide-react"
import { toast } from "sonner"
import { motion } from "framer-motion"

export function Settings({ orgId }: { orgId: string }) {
  const settings = useQuery(api.functions.getOrgSettings, { orgId })
  const updateSettings = useMutation(api.functions.updateOrgSettings)
  
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [formData, setFormData] = useState({
    siteName: "",
    timezone: "",
    currency: "",
    logoUrl: "",
    faviconUrl: "",
    primaryColor: "#F59E0B",
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
    googleAnalyticsId: "",
    facebookPixelId: ""
  })

  useEffect(() => {
    if (settings) {
      setFormData({
        siteName: settings.siteName || "",
        timezone: settings.timezone || "Africa/Nairobi",
        currency: settings.currency || "USD",
        logoUrl: settings.logoUrl || "",
        faviconUrl: settings.faviconUrl || "",
        primaryColor: settings.primaryColor || "#F59E0B",
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
    setSaved(false)
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      await updateSettings({ orgId, ...formData })
      toast.success("Settings saved successfully")
      setSaved(true)
    } catch (error) {
      console.error(error)
      toast.error("Failed to save settings")
    } finally {
      setLoading(false)
    }
  }

  if (settings === undefined) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" />
      </div>
    )
  }

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } }
  const item: any = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } }

  const SettingField = ({ label, name, value, placeholder, icon: Icon, type = "text" }: {
    label: string; name: string; value: string; placeholder: string; icon?: any; type?: string
  }) => (
    <div className="space-y-2">
      <Label className="text-xs uppercase tracking-widest text-muted-foreground font-bold flex items-center gap-2">
        {Icon && <Icon className="h-3 w-3 text-amber-500/50" />}
        {label}
      </Label>
      <Input 
        id={name} 
        name={name} 
        value={value} 
        onChange={handleChange} 
        placeholder={placeholder}
        type={type}
        className="bg-white/5 border-white/10 h-12 rounded-xl focus:border-amber-500/50 focus:ring-amber-500/20"
      />
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-white uppercase italic">SETTINGS</h2>
          <p className="text-muted-foreground mt-1">
            Configure your workshop, branding, and integrations.
          </p>
        </div>
        <Button 
          onClick={handleSave} 
          disabled={loading}
          className={`h-12 px-8 font-black uppercase tracking-widest shadow-lg transition-all ${
            saved 
              ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20" 
              : "bg-amber-500 hover:bg-amber-600 shadow-amber-500/20 text-black"
          }`}
        >
          {loading ? (
            <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Saving...</>
          ) : saved ? (
            <><CheckCircle2 className="mr-2 h-5 w-5" /> Saved</>
          ) : (
            <><Save className="mr-2 h-5 w-5" /> Save Changes</>
          )}
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="bg-black/40 border border-white/5 p-1 rounded-2xl h-auto flex flex-wrap">
          <TabsTrigger value="general" className="data-[state=active]:bg-amber-500 data-[state=active]:text-black rounded-xl px-5 py-3 font-bold">
            <Building2 className="h-4 w-4 mr-2" /> Workshop
          </TabsTrigger>
          <TabsTrigger value="branding" className="data-[state=active]:bg-amber-500 data-[state=active]:text-black rounded-xl px-5 py-3 font-bold">
            <Palette className="h-4 w-4 mr-2" /> Branding
          </TabsTrigger>
          <TabsTrigger value="seo" className="data-[state=active]:bg-amber-500 data-[state=active]:text-black rounded-xl px-5 py-3 font-bold">
            <Search className="h-4 w-4 mr-2" /> SEO
          </TabsTrigger>
          <TabsTrigger value="integrations" className="data-[state=active]:bg-amber-500 data-[state=active]:text-black rounded-xl px-5 py-3 font-bold">
            <Share2 className="h-4 w-4 mr-2" /> Integrations
          </TabsTrigger>
        </TabsList>

        {/* GENERAL TAB */}
        <TabsContent value="general">
          <motion.div variants={container} initial="hidden" animate="show" className="grid gap-6 md:grid-cols-2">
            <motion.div variants={item}>
              <Card className="border-white/5 bg-black/40 backdrop-blur-xl shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
                <CardHeader>
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-amber-500" /> Workshop Info
                  </CardTitle>
                  <CardDescription>Basic configuration for your workshop.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <SettingField label="Workshop Name" name="siteName" value={formData.siteName} placeholder="MASS Car Workshop" icon={Building2} />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <SettingField label="Timezone" name="timezone" value={formData.timezone} placeholder="Africa/Nairobi" icon={Clock} />
                    <SettingField label="Currency" name="currency" value={formData.currency} placeholder="USD" icon={DollarSign} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card className="border-white/5 bg-black/40 backdrop-blur-xl shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
                <CardHeader>
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <Shield className="h-5 w-5 text-emerald-500" /> Account Details
                  </CardTitle>
                  <CardDescription>Organization and subscription status.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Org ID</p>
                      <p className="text-sm font-mono text-white mt-1">{orgId}</p>
                    </div>
                    <Badge variant="outline" className="border-emerald-500/20 text-emerald-500 font-bold">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Plan</p>
                      <p className="text-sm font-bold text-white mt-1">Professional</p>
                    </div>
                    <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 font-bold">Pro</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Users</p>
                      <p className="text-sm font-bold text-white mt-1">Unlimited</p>
                    </div>
                    <Users className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </TabsContent>

        {/* BRANDING TAB */}
        <TabsContent value="branding">
          <motion.div variants={container} initial="hidden" animate="show">
            <motion.div variants={item}>
              <Card className="border-white/5 bg-black/40 backdrop-blur-xl shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-purple-500" />
                <CardHeader>
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <Palette className="h-5 w-5 text-purple-500" /> Brand Identity
                  </CardTitle>
                  <CardDescription>Customize your workshop's visual appearance.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <SettingField label="Logo URL" name="logoUrl" value={formData.logoUrl} placeholder="https://your-domain.com/logo.png" icon={Globe} />
                  
                  {formData.logoUrl && (
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center">
                      <img src={formData.logoUrl} alt="Logo Preview" className="h-16 object-contain" />
                    </div>
                  )}
                  
                  <SettingField label="Favicon URL" name="faviconUrl" value={formData.faviconUrl} placeholder="https://your-domain.com/favicon.ico" />
                  
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-widest text-muted-foreground font-bold flex items-center gap-2">
                      <Palette className="h-3 w-3 text-amber-500/50" /> Primary Color
                    </Label>
                    <div className="flex gap-4 items-center">
                      <Input 
                        name="primaryColor" 
                        value={formData.primaryColor} 
                        onChange={handleChange}
                        className="bg-white/5 border-white/10 h-12 rounded-xl w-36 font-mono"
                      />
                      <div 
                        className="h-12 w-12 rounded-xl border-2 border-white/10 shadow-lg" 
                        style={{ backgroundColor: formData.primaryColor }}
                      />
                      <div className="flex gap-2">
                        {["#F59E0B", "#10B981", "#3B82F6", "#8B5CF6", "#EF4444", "#06B6D4"].map(color => (
                          <button 
                            key={color}
                            className={`h-8 w-8 rounded-lg border-2 transition-all ${formData.primaryColor === color ? "border-white scale-110" : "border-white/10 hover:scale-105"}`}
                            style={{ backgroundColor: color }}
                            onClick={() => { setFormData(prev => ({...prev, primaryColor: color})); setSaved(false) }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </TabsContent>
        
        {/* SEO TAB */}
        <TabsContent value="seo">
          <motion.div variants={container} initial="hidden" animate="show">
            <motion.div variants={item}>
              <Card className="border-white/5 bg-black/40 backdrop-blur-xl shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500" />
                <CardHeader>
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <Search className="h-5 w-5 text-cyan-500" /> Search Engine Optimization
                  </CardTitle>
                  <CardDescription>Optimize your public-facing pages for search engines.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <SettingField label="Meta Title" name="seoTitle" value={formData.seoTitle} placeholder="Best Car Workshop in Hargeisa" icon={Search} />
                  <SettingField label="Meta Description" name="seoDescription" value={formData.seoDescription} placeholder="Professional auto repair services..." />
                  <SettingField label="Keywords (comma separated)" name="seoKeywords" value={formData.seoKeywords} placeholder="mechanic, repair, oil change, Hargeisa" />
                  
                  {/* SEO Preview */}
                  <div className="p-5 rounded-2xl bg-white/5 border border-white/5">
                    <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold mb-3">Google Preview</p>
                    <div className="space-y-1">
                      <p className="text-blue-400 text-lg font-medium hover:underline cursor-pointer">
                        {formData.seoTitle || "MASS Car Workshop — Hargeisa"}
                      </p>
                      <p className="text-emerald-500 text-sm">mass-workshop.vercel.app</p>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {formData.seoDescription || "Professional auto repair and vehicle management services."}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </TabsContent>

        {/* INTEGRATIONS TAB */}
        <TabsContent value="integrations">
          <motion.div variants={container} initial="hidden" animate="show" className="grid gap-6 md:grid-cols-2">
            <motion.div variants={item}>
              <Card className="border-white/5 bg-black/40 backdrop-blur-xl shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
                <CardHeader>
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <Globe className="h-5 w-5 text-blue-500" /> Google Analytics
                  </CardTitle>
                  <CardDescription>Track website visitors and user behavior.</CardDescription>
                </CardHeader>
                <CardContent>
                  <SettingField label="Measurement ID" name="googleAnalyticsId" value={formData.googleAnalyticsId} placeholder="G-XXXXXXXXXX" />
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div variants={item}>
              <Card className="border-white/5 bg-black/40 backdrop-blur-xl shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500" />
                <CardHeader>
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <Share2 className="h-5 w-5 text-indigo-500" /> Facebook Pixel
                  </CardTitle>
                  <CardDescription>Retargeting and conversion tracking for ads.</CardDescription>
                </CardHeader>
                <CardContent>
                  <SettingField label="Pixel ID" name="facebookPixelId" value={formData.facebookPixelId} placeholder="1234567890" />
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
