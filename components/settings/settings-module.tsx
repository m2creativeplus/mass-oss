"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Settings,
  Palette,
  FileText,
  Mail,
  Phone,
  Save,
  Upload
} from "lucide-react"

export function SettingsModule() {
  const [activeTab, setActiveTab] = useState("system")
  
  // Form states
  const [workshopName, setWorkshopName] = useState("MASS Car Workshop")
  const [currency, setCurrency] = useState("USD")
  const [systemEmail, setSystemEmail] = useState("admin@massworkshop.com")
  const [address, setAddress] = useState("Hargeisa, Somaliland")
  const [phone, setPhone] = useState("+252 63 000 0000")

  return (
    <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-950 p-6">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white uppercase tracking-tight flex items-center gap-2">
          <Settings className="h-5 w-5" />
          System Settings
        </h2>
      </div>

      {/* Settings Tabs (Sakosys Style) */}
      <Card className="shadow-sm border-t-2 border-t-emerald-500">
        <CardHeader className="pb-0 border-b">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-transparent border-b-0 gap-0 h-auto p-0 rounded-none">
              <TabsTrigger 
                value="system" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-emerald-500 data-[state=active]:bg-transparent px-6 py-3"
              >
                System
              </TabsTrigger>
              <TabsTrigger 
                value="theme" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-emerald-500 data-[state=active]:bg-transparent px-6 py-3"
              >
                Theme
              </TabsTrigger>
              <TabsTrigger 
                value="header" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-emerald-500 data-[state=active]:bg-transparent px-6 py-3"
              >
                Header
              </TabsTrigger>
              <TabsTrigger 
                value="footer" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-emerald-500 data-[state=active]:bg-transparent px-6 py-3"
              >
                Footer
              </TabsTrigger>
              <TabsTrigger 
                value="contact" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-emerald-500 data-[state=active]:bg-transparent px-6 py-3"
              >
                Contact US
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        
        <CardContent className="pt-6">
          {/* System Tab */}
          {activeTab === "system" && (
            <div className="space-y-6 max-w-2xl">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="workshopName">Workshop Name</Label>
                  <Input 
                    id="workshopName" 
                    value={workshopName} 
                    onChange={(e) => setWorkshopName(e.target.value)}
                    placeholder="Enter workshop name"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="currency">Currency</Label>
                  <select 
                    id="currency"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                    <option value="AED">AED - UAE Dirham</option>
                    <option value="SOS">SOS - Somali Shilling</option>
                  </select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="systemEmail">System Email</Label>
                  <Input 
                    id="systemEmail" 
                    type="email"
                    value={systemEmail} 
                    onChange={(e) => setSystemEmail(e.target.value)}
                    placeholder="admin@workshop.com"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="address">Address</Label>
                  <Input 
                    id="address" 
                    value={address} 
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Workshop address"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input 
                    id="phone" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 234 567 8900"
                  />
                </div>
              </div>
              
              <Button className="bg-[#00A65A] hover:bg-[#008d4c] text-white">
                <Save className="h-4 w-4 mr-2" />
                Save Settings
              </Button>
            </div>
          )}
          
          {/* Theme Tab */}
          {activeTab === "theme" && (
            <div className="space-y-6 max-w-2xl">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label>Upload Logo</Label>
                  <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-8 text-center">
                    <Upload className="h-10 w-10 mx-auto text-slate-400 mb-4" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Drag and drop your logo here, or click to browse
                    </p>
                    <Button variant="outline" size="sm">
                      Choose File
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">
                      Recommended: 200x60px, PNG or SVG
                    </p>
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label>Primary Color</Label>
                  <div className="flex gap-2">
                    <Input type="color" className="w-20 h-10 p-1" defaultValue="#f97316" />
                    <Input placeholder="#f97316" defaultValue="#f97316" className="flex-1" />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label>Sidebar Color</Label>
                  <div className="flex gap-2">
                    <Input type="color" className="w-20 h-10 p-1" defaultValue="#1e293b" />
                    <Input placeholder="#1e293b" defaultValue="#1e293b" className="flex-1" />
                  </div>
                </div>
              </div>
              
              <Button className="bg-[#00A65A] hover:bg-[#008d4c] text-white">
                <Save className="h-4 w-4 mr-2" />
                Save Theme
              </Button>
            </div>
          )}
          
          {/* Header Tab */}
          {activeTab === "header" && (
            <div className="space-y-6 max-w-2xl">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label>Header Box 1 (HTML)</Label>
                  <textarea 
                    className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono"
                    placeholder="<p>Your custom HTML here</p>"
                    defaultValue="<h3>Welcome to MASS Workshop</h3>"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label>Header Box 2 (HTML)</Label>
                  <textarea 
                    className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono"
                    placeholder="<p>Your custom HTML here</p>"
                    defaultValue="<p>Quality Service Guaranteed</p>"
                  />
                </div>
              </div>
              
              <Button className="bg-[#00A65A] hover:bg-[#008d4c] text-white">
                <Save className="h-4 w-4 mr-2" />
                Save Header
              </Button>
            </div>
          )}
          
          {/* Footer Tab */}
          {activeTab === "footer" && (
            <div className="space-y-6 max-w-2xl">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label>Footer Text</Label>
                  <textarea 
                    className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    placeholder="Copyright text..."
                    defaultValue="© 2026 MASS Car Workshop. All rights reserved."
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label>Social Links (one per line)</Label>
                  <textarea 
                    className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono"
                    placeholder="facebook:https://facebook.com/yourpage"
                    defaultValue={`facebook:https://facebook.com/massworkshop
twitter:https://twitter.com/massworkshop
instagram:https://instagram.com/massworkshop`}
                  />
                </div>
              </div>
              
              <Button className="bg-[#00A65A] hover:bg-[#008d4c] text-white">
                <Save className="h-4 w-4 mr-2" />
                Save Footer
              </Button>
            </div>
          )}
          
          {/* Contact Tab */}
          {activeTab === "contact" && (
            <div className="space-y-6 max-w-2xl">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input 
                    id="contactEmail" 
                    type="email"
                    placeholder="contact@workshop.com"
                    defaultValue="info@massworkshop.com"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="contactPhone">Contact Phone</Label>
                  <Input 
                    id="contactPhone" 
                    placeholder="+1 234 567 8900"
                    defaultValue="+252 63 000 0000"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="whatsapp">WhatsApp Number</Label>
                  <Input 
                    id="whatsapp" 
                    placeholder="+1 234 567 8900"
                    defaultValue="+252 63 123 4567"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label>Business Hours</Label>
                  <Input 
                    placeholder="Mon-Sat: 8AM - 6PM"
                    defaultValue="Saturday - Thursday: 8:00 AM - 6:00 PM"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label>Google Maps Embed URL</Label>
                  <Input 
                    placeholder="https://maps.google.com/maps?..."
                    defaultValue=""
                  />
                </div>
              </div>
              
              <Button className="bg-[#00A65A] hover:bg-[#008d4c] text-white">
                <Save className="h-4 w-4 mr-2" />
                Save Contact Info
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default SettingsModule
