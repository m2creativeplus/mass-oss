"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useOrganization } from "@/components/providers/organization-provider"
import { 
  ShieldAlert, ShieldCheck, Globe, MapPin, 
  Search, AlertTriangle, TrendingUp, Ship, CarFront, Landmark,
  Cpu, RefreshCw, Zap, BarChart3
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// ============================================================
// SAIP Intelligence Page — Powered by Gemini Flash 2.0
// Real vehicle pricing & VIN fraud detection for Somaliland
// ============================================================

interface MarketVehicle {
  make: string
  model: string
  year: string
  beForwardPriceUSD: number
  shippingCostUSD: number
  customsDutyUSD: number
  hargeisaStreetPriceUSD: number
  demandLevel: "High" | "Medium" | "Low"
  demandScore: number
  trend: "rising" | "stable" | "falling"
  notes: string
}

interface VINResult {
  vin: string
  status: string
  fraudScore: number
  manufacturer?: string
  modelYear?: string
  vehicleType?: string
  reportedBy: string
  source: string
  notes: string
  riskFactors?: string[]
  confidence?: string
  geminiPowered: boolean
  checkedAt: string
}

export default function SAIPIntelligencePage() {
  const { organization } = useOrganization()

  // Market Intelligence State
  const [marketData, setMarketData] = useState<MarketVehicle[]>([])
  const [marketLoading, setMarketLoading] = useState(false)
  const [marketError, setMarketError] = useState("")
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)

  // VIN State
  const [vinQuery, setVinQuery] = useState("")
  const [vinResult, setVinResult] = useState<VINResult | null>(null)
  const [isChecking, setIsChecking] = useState(false)
  const [vinError, setVinError] = useState("")

  // Auto-load market data on mount
  useEffect(() => {
    fetchMarketData()
  }, [])

  const fetchMarketData = async () => {
    setMarketLoading(true)
    setMarketError("")
    try {
      const res = await fetch("/api/saip-intelligence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ forceRefresh: true }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to fetch market data")
      setMarketData(data.vehicles || [])
      setLastUpdated(data.generatedAt)
    } catch (err: any) {
      setMarketError(err.message)
    } finally {
      setMarketLoading(false)
    }
  }

  const handleCheckVin = async () => {
    if (!vinQuery.trim()) return
    setIsChecking(true)
    setVinError("")
    setVinResult(null)
    try {
      const res = await fetch("/api/saip-vin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vin: vinQuery.toUpperCase(), orgId: organization?._id }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "VIN check failed")
      setVinResult(data)
    } catch (err: any) {
      setVinError(err.message)
    } finally {
      setIsChecking(false)
    }
  }

  if (!organization) return null

  const trendIcon = (trend: string) => {
    if (trend === "rising") return "↑"
    if (trend === "falling") return "↓"
    return "→"
  }

  const trendColor = (trend: string) => {
    if (trend === "rising") return "text-emerald-500"
    if (trend === "falling") return "text-red-500"
    return "text-slate-400"
  }

  const fraudSeverity = (score: number) => {
    if (score >= 61) return { label: "HIGH RISK", color: "text-red-600", bg: "bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-900" }
    if (score >= 31) return { label: "SUSPICIOUS", color: "text-amber-600", bg: "bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-900" }
    return { label: "CLEAR", color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900" }
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              S.A.I.P. Intelligence
            </h1>
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 text-xs">
              <Zap className="w-3 h-3 mr-1" /> Gemini Flash 2.0
            </Badge>
          </div>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Somaliland Automotive Intelligence Platform — Live market data & National VIN Registry
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Cpu className="w-3.5 h-3.5" />
          {lastUpdated ? `Updated ${new Date(lastUpdated).toLocaleTimeString()}` : "Powered by Gemini AI"}
        </div>
      </div>

      {/* Live Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Data Source", value: "Gemini Flash", icon: <Cpu className="w-4 h-4 text-blue-500" /> },
          { label: "Coverage", value: "8 Models", icon: <CarFront className="w-4 h-4 text-orange-500" /> },
          { label: "Market", value: "Hargeisa + Berbera", icon: <MapPin className="w-4 h-4 text-emerald-500" /> },
          { label: "Port", value: "Berbera 28-35d", icon: <Ship className="w-4 h-4 text-purple-500" /> },
        ].map((stat) => (
          <Card key={stat.label} className="border">
            <CardContent className="p-3 flex items-center gap-3">
              {stat.icon}
              <div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider">{stat.label}</div>
                <div className="text-sm font-semibold text-slate-900 dark:text-white">{stat.value}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="market" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="market" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" /> Market Price Intelligence
          </TabsTrigger>
          <TabsTrigger value="vin" className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4" /> VIN Registry Flagging
          </TabsTrigger>
        </TabsList>

        {/* Market Intelligence */}
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
                        Real-time AI pricing — BE FORWARD Japan + Berbera Port + Somaliland MoFD customs rates
                      </CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={fetchMarketData}
                      disabled={marketLoading}
                      className="flex items-center gap-2"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${marketLoading ? "animate-spin" : ""}`} />
                      Refresh
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {marketError && (
                    <div className="p-4 m-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
                      <AlertTriangle className="inline w-4 h-4 mr-2" />
                      {marketError}
                      {marketError.includes("GEMINI_API_KEY") && (
                        <span className="block mt-1 font-medium">→ Go to Settings → AI Keys → Add Google Gemini API key</span>
                      )}
                    </div>
                  )}
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-100/50 dark:bg-slate-800/50 border-b">
                        <tr>
                          <th className="px-4 py-3 text-left font-semibold">Vehicle Model</th>
                          <th className="px-4 py-3 text-right font-semibold">BE FORWARD (USD)</th>
                          <th className="px-4 py-3 text-right font-semibold">Shipping+Duty</th>
                          <th className="px-4 py-3 text-right font-semibold text-emerald-600">Hargeisa Street</th>
                          <th className="px-4 py-3 text-center font-semibold">Demand</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {marketLoading ? (
                          Array.from({ length: 6 }).map((_, i) => (
                            <tr key={i}>
                              <td colSpan={5} className="px-4 py-3">
                                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                              </td>
                            </tr>
                          ))
                        ) : marketData.length > 0 ? (
                          marketData.map((car, idx) => (
                            <motion.tr
                              key={idx}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: idx * 0.05 }}
                              className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                            >
                              <td className="px-4 py-4">
                                <div className="font-semibold text-slate-900 dark:text-white">
                                  {car.make} {car.model}
                                </div>
                                <div className="text-xs text-slate-500">Year: {car.year}</div>
                                {car.notes && <div className="text-xs text-slate-400 mt-0.5 max-w-xs truncate">{car.notes}</div>}
                              </td>
                              <td className="px-4 py-4 text-right tabular-nums">
                                ${car.beForwardPriceUSD?.toLocaleString()}
                              </td>
                              <td className="px-4 py-4 text-right tabular-nums text-orange-600 dark:text-orange-400">
                                +${((car.shippingCostUSD || 0) + (car.customsDutyUSD || 0)).toLocaleString()}
                                <div className="text-[10px] text-slate-400 uppercase tracking-wider mt-1">Berbera Port</div>
                              </td>
                              <td className="px-4 py-4 text-right font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                                ${car.hargeisaStreetPriceUSD?.toLocaleString()}
                                <span className={`ml-1 text-xs ${trendColor(car.trend)}`}>{trendIcon(car.trend)}</span>
                              </td>
                              <td className="px-4 py-4 text-center">
                                <Badge variant={car.demandLevel === "High" ? "default" : "secondary"}>
                                  {car.demandLevel}
                                </Badge>
                                <div className="text-[10px] text-slate-400 mt-1">{car.demandScore}% score</div>
                              </td>
                            </motion.tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="text-center py-10 text-slate-500">
                              <Cpu className="w-6 h-6 mx-auto mb-2 opacity-30" />
                              {marketError ? "Add your Gemini API key to load real data" : "Click Refresh to load live market intelligence"}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
                {lastUpdated && (
                  <CardFooter className="border-t bg-slate-50 dark:bg-slate-900/50 py-2 px-4">
                    <p className="text-[10px] text-slate-400">
                      AI-generated via Gemini Flash 2.0 · {new Date(lastUpdated).toLocaleString()} · Subject to Somaliland MoFD regulations
                    </p>
                  </CardFooter>
                )}
              </Card>
            </div>

            {/* Side Cards */}
            <div className="space-y-4">
              <Card className="border shadow-sm">
                <CardHeader className="pb-2 text-sm font-semibold flex flex-row items-center gap-2">
                  <Landmark className="h-4 w-4 text-slate-500" /> Customs Base Rates
                </CardHeader>
                <CardContent className="text-xs text-slate-600 dark:text-slate-400 space-y-3">
                  <div className="flex justify-between border-b pb-1"><span>Standard Import Tax</span> <span>~15%</span></div>
                  <div className="flex justify-between border-b pb-1"><span>Berbera Port Handling</span> <span>$250</span></div>
                  <div className="flex justify-between"><span>Road Tax / Licensing</span> <span>$120</span></div>
                  <p className="mt-3 text-[10px] italic text-slate-400">AI-aggregated estimates. Subject to Somaliland MoFD regulations.</p>
                </CardContent>
              </Card>

              <Card className="border bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800">
                <CardHeader className="pb-2 text-sm font-semibold flex flex-row items-center gap-2 text-blue-900 dark:text-blue-400">
                  <Ship className="h-4 w-4" /> Transit Analytics
                </CardHeader>
                <CardContent className="text-xs text-slate-600 dark:text-slate-400">
                  <p>Average transit time from Yokohama to Berbera Port: <strong>28–35 days</strong>.</p>
                </CardContent>
              </Card>

              <Card className="border bg-gradient-to-br from-purple-50 to-violet-50 dark:from-slate-900 dark:to-slate-800">
                <CardHeader className="pb-2 text-sm font-semibold flex flex-row items-center gap-2 text-purple-900 dark:text-purple-400">
                  <BarChart3 className="h-4 w-4" /> Data Network
                </CardHeader>
                <CardContent className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                  <div className="flex justify-between"><span>AI Model</span> <span className="font-medium">Gemini Flash 2.0</span></div>
                  <div className="flex justify-between"><span>Source</span> <span className="font-medium">BE FORWARD + Field</span></div>
                  <div className="flex justify-between"><span>Refresh</span> <span className="font-medium">On demand</span></div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* VIN Checker */}
        <TabsContent value="vin">
          <Card className="max-w-3xl border shadow-sm">
            <CardHeader className="bg-slate-50 dark:bg-slate-900/50 border-b">
              <CardTitle className="flex items-center gap-2">
                <CarFront className="h-5 w-5 text-indigo-500" />
                National Vehicle Identity Verification
              </CardTitle>
              <CardDescription>
                Gemini-powered VIN decoding + SAIP fraud detection — Somaliland automotive registry
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 md:p-8 space-y-6">
              <div className="flex gap-3 max-w-lg">
                <Input
                  placeholder="Enter VIN or plate (e.g. JTD114... or 'STOLEN')"
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

              {vinError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                  <AlertTriangle className="inline w-4 h-4 mr-1" /> {vinError}
                </div>
              )}

              <AnimatePresence>
                {vinResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    {(() => {
                      const sev = fraudSeverity(vinResult.fraudScore || 0)
                      const isClear = vinResult.fraudScore < 31
                      return (
                        <div className={`rounded-xl border-2 p-5 ${sev.bg}`}>
                          <div className="flex items-start gap-4">
                            <div className="mt-1">
                              {isClear ? (
                                <ShieldCheck className="h-8 w-8 text-emerald-500" />
                              ) : (
                                <AlertTriangle className="h-8 w-8 text-red-500 animate-pulse" />
                              )}
                            </div>
                            <div className="space-y-2 flex-1">
                              <div className="flex items-center justify-between">
                                <h3 className={`text-lg font-bold uppercase tracking-wider ${sev.color}`}>
                                  {sev.label} — {vinResult.status}
                                </h3>
                                <div className="flex items-center gap-2">
                                  {vinResult.geminiPowered && (
                                    <Badge variant="outline" className="text-[10px] text-purple-600 border-purple-300">
                                      <Zap className="w-2.5 h-2.5 mr-1" /> Gemini
                                    </Badge>
                                  )}
                                  <Badge variant="outline" className="font-mono bg-white dark:bg-slate-900">
                                    {vinResult.vin}
                                  </Badge>
                                </div>
                              </div>

                              {/* Fraud Score Bar */}
                              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full transition-all ${vinResult.fraudScore >= 61 ? "bg-red-500" : vinResult.fraudScore >= 31 ? "bg-amber-500" : "bg-emerald-500"}`}
                                  style={{ width: `${vinResult.fraudScore}%` }}
                                />
                              </div>
                              <p className="text-xs text-slate-500">Fraud Score: {vinResult.fraudScore}/100</p>

                              <div className="grid grid-cols-2 gap-4 text-sm mt-4 p-4 bg-white/60 dark:bg-black/20 rounded-lg">
                                {vinResult.manufacturer && (
                                  <div>
                                    <p className="text-slate-500 mb-1 text-xs uppercase font-semibold">Manufacturer</p>
                                    <p className="font-medium">{vinResult.manufacturer} ({vinResult.modelYear})</p>
                                  </div>
                                )}
                                <div>
                                  <p className="text-slate-500 mb-1 text-xs uppercase font-semibold">Source</p>
                                  <p className="font-medium flex items-center gap-2">
                                    <MapPin className="h-3 w-3 text-slate-400" /> {vinResult.reportedBy}
                                  </p>
                                </div>
                              </div>

                              {vinResult.notes && (
                                <p className={`text-sm mt-2 ${isClear ? "text-emerald-700" : "text-red-700 font-medium"}`}>
                                  {vinResult.notes}
                                </p>
                              )}

                              {vinResult.riskFactors && vinResult.riskFactors.length > 0 && (
                                <div className="mt-2">
                                  <p className="text-xs font-semibold text-slate-500 mb-1">Risk Factors:</p>
                                  <ul className="text-xs text-red-600 space-y-0.5">
                                    {vinResult.riskFactors.map((r, i) => <li key={i}>• {r}</li>)}
                                  </ul>
                                </div>
                              )}

                              <p className="text-[10px] text-slate-400 pt-2 border-t mt-4">
                                Checked {new Date(vinResult.checkedAt).toLocaleString()} (Hargeisa Time)
                              </p>
                            </div>
                          </div>
                        </div>
                      )
                    })()}
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
            <CardFooter className="bg-slate-50 dark:bg-slate-900/50 text-xs text-slate-500 border-t justify-center">
              Powered by Gemini Flash × SAIP Registry · Misuse triggers IP telemetry logging.
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
