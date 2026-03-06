"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bot, Search, Cpu, Zap, AlertTriangle } from "lucide-react"
import { useOrganization } from "@/components/providers/organization-provider"
import { useState } from "react"

export default function DiagnosticsPage() {
  const { organization } = useOrganization()
  const [query, setQuery] = useState("")

  if (!organization) return null

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center">
              <Bot className="h-5 w-5 text-white" />
            </div>
            AI Diagnostics
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            AI-powered vehicle fault diagnosis and recommendations
          </p>
        </div>
      </div>

      <Card className="border-2 border-violet-200 dark:border-violet-800">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Cpu className="h-5 w-5 text-violet-500" />
            Describe the Vehicle Problem
          </h3>
          <textarea
            className="w-full p-4 border rounded-lg min-h-[120px] resize-none"
            placeholder="Example: 2018 Toyota Hilux - Engine makes knocking sound when accelerating, check engine light is on, slight vibration at idle..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button className="mt-4 bg-violet-600 hover:bg-violet-700">
            <Zap className="h-4 w-4 mr-2" />
            Analyze Problem
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: "Common Causes", icon: AlertTriangle, items: ["Fuel injector issue", "Timing chain wear", "Engine mount failure"] },
          { title: "Recommended Tests", icon: Search, items: ["OBD-II code scan", "Compression test", "Fuel pressure test"] },
          { title: "Parts Often Needed", icon: Cpu, items: ["Fuel injector set", "Timing chain kit", "Engine mounts"] },
        ].map((card, i) => {
          const Icon = card.icon
          return (
            <Card key={i}>
              <CardContent className="p-6">
                <h4 className="font-semibold flex items-center gap-2 mb-4">
                  <Icon className="h-5 w-5 text-violet-500" />
                  {card.title}
                </h4>
                <ul className="space-y-2">
                  {card.items.map((item, j) => (
                    <li key={j} className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
