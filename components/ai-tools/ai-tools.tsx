"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Bot, 
  Send, 
  Sparkles, 
  Zap, 
  Wrench,
  Search,
  MessageSquare
} from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface Message {
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export function AITools() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your MASS Workshop AI Assistant. I can help you with vehicle diagnostics, parts identification, or estimating repair times. How can I assist you today?",
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState("")

  const handleSend = () => {
    if (!input.trim()) return

    const userMsg: Message = {
      role: "user",
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMsg])
    setInput("")

    // Simulate AI response
    setTimeout(() => {
      const aiMsg: Message = {
        role: "assistant",
        content: "I'm analyzing your request. Since I'm in demo mode, I can confirm that for a 2020 Toyota Land Cruiser brake pad replacement, the standard labor time is 1.5 hours and recommended parts are OEM pads (Part #04465-60280).",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiMsg])
    }, 1000)
  }

  return (
    <div className="h-[calc(100vh-120px)] grid grid-cols-1 lg:grid-cols-4 gap-6 animate-fade-in-up">
      {/* Sidebar Tools */}
      <div className="space-y-4">
        <Card className="glass-card hover:bg-muted/50 cursor-pointer transition-colors border-l-4 border-l-purple-500">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Rapid Diagnostics</h3>
              <p className="text-xs text-muted-foreground">Identify issues from symptoms</p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card hover:bg-muted/50 cursor-pointer transition-colors border-l-4 border-l-blue-500">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
              <Search className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Parts Finder</h3>
              <p className="text-xs text-muted-foreground">Locate compatible parts</p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card hover:bg-muted/50 cursor-pointer transition-colors border-l-4 border-l-orange-500">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600">
              <Wrench className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Repair Procedures</h3>
              <p className="text-xs text-muted-foreground">Step-by-step guides</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chat Interface */}
      <Card className="lg:col-span-3 glass-card flex flex-col h-full border-none shadow-lg">
        <CardHeader className="border-b">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <Bot className="h-6 w-6" />
            </div>
            <div>
              <CardTitle>MASS AI Assistant</CardTitle>
              <CardDescription>Powered by advanced automotive LLMs</CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <div className="flex-1 overflow-hidden relative">
          <ScrollArea className="h-full p-4">
            <div className="space-y-4 pb-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex w-full max-w-[80%] gap-3 p-4 rounded-2xl text-sm shadow-sm animate-fade-in-up",
                    msg.role === "user" 
                      ? "ml-auto bg-primary text-primary-foreground" 
                      : "bg-muted/50 border"
                  )}
                >
                  {msg.role === "assistant" && <Bot className="h-5 w-5 mt-0.5 shrink-0" />}
                  <div className="space-y-1">
                    <p>{msg.content}</p>
                    <p className={cn(
                      "text-[10px] opacity-70",
                      msg.role === "user" ? "text-primary-foreground" : "text-muted-foreground"
                    )}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        <div className="p-4 border-t bg-background/50 backdrop-blur-sm">
          <form 
            onSubmit={(e) => {
              e.preventDefault()
              handleSend()
            }}
            className="flex gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about diagnostics, error codes, or compatibility..."
              className="flex-1"
            />
            <Button type="submit" size="icon" className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:brightness-110 transiton-all">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  )
}
