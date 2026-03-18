"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useOrganization } from "@/components/providers/organization-provider"
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  ShieldAlert, ShieldCheck, Globe, MapPin, 
  Search, AlertTriangle, TrendingUp, Ship, CarFront, Landmark
} from "lucide-react"

export default function SAIPIntelligencePage() {
  const { organization } = useOrganization()
  const org = organization?._id || ""
  
  // Queries
  const marketPrices = useQuery(api.functions.getSAIPMarketPrices, { orgId: org })
  const checkVin = useMutation(api.functions.checkVinRegistry)

  // VIN State
  const [vinQuery, setVinQuery] = useState("")
  const [vinResult, setVinResult] = useState<any>(null)
  const [isChecking, setIsChecking] = useState(false)

  const handleCheckVin = async () => {
    if (!vinQuery.trim()) return
    setIsChecking(true)
    try {
      const result = await checkVin({ vin: vinQuery.toUpperCase(), orgId: org })
      setVinResult(result)
    } catch (error) {
      console.error("Failed to check VIN:", error)
    } finally {
      setIsChecking(false)
    }
  }

  if (!organization) return null

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* ─── Header ─── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              S.A.I.P. Intelligence
            </h1>
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 text-xs shadow-sm">
              Live Edge Network
            </Badge>
          </div>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Somaliland Automotive Intelligence Platform — Market prices & National Registry
          </p>
        </div>
      </div>

      {/* ─── Tabs ─── */}
      <Tabs defaultValue="market" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="market" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" /> Market Price Intelligence
          </TabsTrigger>
          <TabsTrigger value="vin" className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4" /> VIN Registry Flagging
          </TabsTrigger>
        </TabsList>

        {/* ─── Market Intelligence Tab ─── */}
        <TabsContent value="market" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <Card className="shadow-sm border">
                <CardHeader className="bg-slate-50 dark:bg-slate-900/50 border-b pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Globe className="h-5 w-5 text-blue-500" />
                        BE FORWARD vs. Hargeisa Street Pricing
                      </CardTitle>
                      <CardDescription className="mt-1">
                        Aggregating international shipment costs, Somaliland Ministry of Finance customs rates, and active market demand.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-100/50 dark:bg-slate-800/50 border-b">
                        <tr>
                          <th className="px-4 py-3 text-left font-semibold">Vehicle Model</th>
                          <th className="px-4 py-3 text-right font-semibold">BE FORWARD (USD)</th>
                          <th className="px-4 py-3 text-right font-semibold">Shipping+Duty</th>
                          <th className="px-4 py-3 text-right font-semibold text-emerald-600">Local Street Price</th>
                          <th className="px-4 py-3 text-center font-semibold">Demand</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {marketPrices ? marketPrices.map((car, idx) => (
                          <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                            <td className="px-4 py-4">
                              <div className="font-semibold text-slate-900 dark:text-white">
                                {car.make} {car.model}
                              </div>
                              <div className="text-xs text-slate-500">Year: {car.year}</div>
                            </td>
                            <td className="px-4 py-4 text-right tabular-nums">
                              ${car.beForwardPriceUSD.toLocaleString()}
                            </td>
                            <td className="px-4 py-4 text-right tabular-nums text-orange-600 dark:text-orange-400">
                              +${(car.shippingCostUSD + car.customsDutyUSD).toLocaleString()}
                              <div className="text-[10px] text-slate-400 uppercase tracking-wider mt-1">Berbera Port</div>
                            </td>
                            <td className="px-4 py-4 text-right font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                              ${car.hargeisaStreetPriceUSD.toLocaleString()}
                            </td>
                            <td className="px-4 py-4 text-center">
                              <Badge variant={car.demandLevel === "High" ? "default" : "secondary"}>
                                {car.demandLevel} Profile
                              </Badge>
                            </td>
                          </tr>
                        )) : (
                          <tr>
                            <td colSpan={5} className="text-center py-8 text-slate-500">Loading intelligence models...</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Side Analytics */}
            <div className="space-y-4">
              <Card className="border shadow-sm">
                <CardHeader className="pb-2 text-sm font-semibold flex flex-row items-center gap-2">
                  <Landmark className="h-4 w-4 text-slate-500" /> Customs Base Rates
                </CardHeader>
                <CardContent className="text-xs text-slate-600 dark:text-slate-400 space-y-3">
                  <div className="flex justify-between border-b pb-1"><span>Standard Import Tax</span> <span>~15%</span></div>
                  <div className="flex justify-between border-b pb-1"><span>Berbera Port Handling</span> <span>$250</span></div>
                  <div className="flex justify-between"><span>Road Tax/Licensing</span> <span>$120</span></div>
                  <p className="mt-3 text-[10px] italic text-slate-400">Values are AI-aggregated estimates and subject to Somaliland MoFD regulations.</p>
                </CardContent>
              </Card>

              <Card className="border bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800">
                <CardHeader className="pb-2 text-sm font-semibold flex flex-row items-center gap-2 text-blue-900 dark:text-blue-400">
                  <Ship className="h-4 w-4" /> Transit Analytics
                </CardHeader>
                <CardContent className="text-xs text-slate-600 dark:text-slate-400">
                  <p>Average transit time from Yokohama to Berbera Port is currently averaging <strong>28-35 days</strong>.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* ─── VIN Checker Tab ─── */}
        <TabsContent value="vin">
          <Card className="max-w-3xl border shadow-sm">
            <CardHeader className="bg-slate-50 dark:bg-slate-900/50 border-b">
              <CardTitle className="flex items-center gap-2">
                <CarFront className="h-5 w-5 text-indigo-500" />
                National Vehicle Identity Verification
              </CardTitle>
              <CardDescription>
                Cross-reference imported VIN frames against Somaliland Traffic Police, Insurance, and MASS internal registries.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 md:p-8 space-y-6">
              <div className="flex gap-3 max-w-lg">
                <Input 
                  placeholder="Enter 17-character VIN (e.g. JTD11... or type 'STOLEN')" 
                  className="font-mono uppercase tracking-widest text-lg h-12"
                  value={vinQuery}
                  onChange={(e) => setVinQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCheckVin()}
                />
                <Button 
                  onClick={handleCheckVin} 
                  disabled={isChecking || !vinQuery}
                  className="h-12 px-6 bg-indigo-600 hover:bg-indigo-700"
                >
                  {isChecking ? <span className="animate-pulse">Scanning...</span> : <Search className="h-5 w-5" />}
                </Button>
              </div>

              {/* Result Area */}
              {vinResult && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }}
                  className={`rounded-xl border-2 p-5 ${
                    vinResult.status === 'clean' 
                      ? 'bg-emerald-50/50 border-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-900' 
                      : 'bg-red-50/50 border-red-100 dark:bg-red-950/20 dark:border-red-900'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      {vinResult.status === 'clean' ? (
                        <ShieldCheck className="h-8 w-8 text-emerald-500" />
                      ) : (
                        <AlertTriangle className="h-8 w-8 text-red-500 animate-pulse" />
                      )}
                    </div>
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className={`text-lg font-bold uppercase tracking-wider ${
                          vinResult.status === 'clean' ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'
                        }`}>
                          {vinResult.status === 'clean' ? 'CLEAR: NO RECORDS FOUND' : `ALERT: ${vinResult.status}`}
                        </h3>
                        <Badge variant="outline" className="font-mono bg-white dark:bg-slate-900">
                          {vinResult.vin}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm mt-4 p-4 bg-white/60 dark:bg-black/20 rounded-lg">
                        <div>
                          <p className="text-slate-500 mb-1 text-xs uppercase font-semibold">Reporting Source</p>
                          <p className="font-medium flex items-center gap-2">
                            <MapPin className="h-3 w-3 text-slate-400" />
                            {vinResult.reportedBy}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-500 mb-1 text-xs uppercase font-semibold">API Gateway</p>
                          <p className="font-medium">{vinResult.source}</p>
                        </div>
                      </div>
                      {vinResult.notes && (
                        <p className={`text-sm mt-3 ${
                          vinResult.status === 'clean' ? 'text-emerald-600/80 dark:text-emerald-400/80' : 'text-red-600 dark:text-red-400 font-medium'
                        }`}>
                          {vinResult.notes}
                        </p>
                      )}
                      <p className="text-[10px] text-slate-400 pt-2 border-t mt-4">
                        Search executed on {new Date().toLocaleString()} (Africa/Hargeisa Timezone)
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </CardContent>
            <CardFooter className="bg-slate-50 dark:bg-slate-900/50 text-xs text-slate-500 border-t justify-center">
              This module operates via SAIP secure gateways. Misuse of the National Registry triggers IP telemetry logging.
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
