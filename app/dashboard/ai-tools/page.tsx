"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bot, Send, MessageCircle } from "lucide-react"
import { useOrganization } from "@/components/providers/organization-provider"
import { useState } from "react"

export default function AIToolsPage() {
  const { organization } = useOrganization()
  const [message, setMessage] = useState("")

  if (!organization) return null

  const suggestions = [
    "Generate estimate for brake pad replacement on Toyota Hilux 2018",
    "What are common issues with Land Cruiser 79 diesel engines?",
    "Draft a follow-up SMS for declined service recommendations",
    "Create an inspection checklist for pre-purchase vehicle assessment",
  ]

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center mx-auto mb-4">
          <Bot className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          MASS AI Assistant
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Your intelligent workshop helper
        </p>
      </div>

      <Card className="border-2">
        <CardContent className="p-6">
          <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-4 mb-4 min-h-[200px] flex items-center justify-center">
            <div className="text-center text-gray-400">
              <MessageCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Start a conversation with the AI Assistant</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <input
              type="text"
              className="flex-1 p-3 border rounded-lg"
              placeholder="Ask me anything about vehicle repairs, parts, estimates..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Button className="bg-emerald-600 hover:bg-emerald-700 px-6">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <div>
        <h3 className="font-semibold mb-3 text-gray-600">Suggested Prompts</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {suggestions.map((suggestion, i) => (
            <button
              key={i}
              onClick={() => setMessage(suggestion)}
              className="text-left p-3 bg-gray-50 dark:bg-slate-800 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
