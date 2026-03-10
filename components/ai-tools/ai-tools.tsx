"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Bot, 
  Send, 
  Sparkles, 
  Activity, 
  Wrench,
  Search,
  BookOpen,
  Cpu
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
      content: "MASS OS Auto-Diagnostics System Initialized. Enter an OBD-II code, a vehicle symptom, or a part number for instant analysis based on manufacturer service data.",
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState("")

  const [isTyping, setIsTyping] = useState(false)

  const handleSend = async () => {
    if (!input.trim()) return

    const userMsg: Message = {
      role: "user",
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMsg])
    setInput("")
    setIsTyping(true)

    try {
      // Connect to the new MASS OS AI Knowledge Engine API
      const response = await fetch('/api/ai-diagnostics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg.content }),
      })

      if (!response.ok) throw new Error("AI Engine offline")

      const data = await response.json()
      
      const aiMsg: Message = {
        role: "assistant",
        content: data.reply || "No response received from the database.",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiMsg])
    } catch (error) {
      console.error(error)
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Error: Could not connect to the MASS OS AI Engine. Please verify network connectivity.",
        timestamp: new Date()
      }])
    } finally {
      setIsTyping(false)
    }
  }

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt)
  }

  return (
    <div className="h-[calc(100vh-120px)] grid grid-cols-1 lg:grid-cols-4 gap-6 animate-fade-in-up">
      {/* Sidebar Tools */}
      <div className="space-y-4">
        <Card 
          className="glass-card hover:bg-white/5 cursor-pointer transition-colors border-l-4 border-l-amber-500"
          onClick={() => handleQuickPrompt("Analyze OBD-II Code: P0420 on 2018 Toyota Hilux")}
        >
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">OBD-II Analysis</h3>
              <p className="text-xs text-muted-foreground">Decode fault codes instantly</p>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="glass-card hover:bg-white/5 cursor-pointer transition-colors border-l-4 border-l-blue-500"
          onClick={() => handleQuickPrompt("Lookup Technical Service Bulletins (TSB) for 2015 Suzuki Swift ABS module")}
        >
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">TSB & Recalls</h3>
              <p className="text-xs text-muted-foreground">Manufacturer bullet points</p>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="glass-card hover:bg-white/5 cursor-pointer transition-colors border-l-4 border-l-emerald-500"
          onClick={() => handleQuickPrompt("What is the standard labor time for timing chain replacement on a Toyota 1TR-FE engine?")}
        >
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <Wrench className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Labor Time Guides</h3>
              <p className="text-xs text-muted-foreground">Industry standard repair times</p>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="glass-card hover:bg-white/5 cursor-pointer transition-colors border-l-4 border-l-purple-500"
          onClick={() => handleQuickPrompt("Cross-reference part number: 90919-02260 for compatibility")}
        >
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500">
              <Cpu className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Parts Cross-Reference</h3>
              <p className="text-xs text-muted-foreground">Find OEM & aftermarket matches</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chat Interface */}
      <Card className="lg:col-span-3 glass-card flex flex-col h-full border-none shadow-2xl overflow-hidden bg-black/40 backdrop-blur-xl">
        <CardHeader className="border-b border-white/5 bg-white/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-black shadow-lg shadow-amber-500/20">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-white">MASS OS Auto-Diagnostics</CardTitle>
                <CardDescription className="text-amber-500/80 text-xs">AI-Powered Mechanical Technical Assistant</CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
               <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
               </span>
               <span className="text-[10px] uppercase tracking-widest text-emerald-500 font-bold">System Online</span>
            </div>
          </div>
        </CardHeader>
        
        <div className="flex-1 overflow-hidden relative">
          <ScrollArea className="h-full p-6">
            <div className="space-y-6 pb-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex w-full max-w-[85%] gap-4 p-4 rounded-2xl text-sm shadow-sm animate-fade-in-up",
                    msg.role === "user" 
                      ? "ml-auto bg-amber-500 text-black rounded-tr-sm" 
                      : "bg-white/5 border border-white/5 text-white rounded-tl-sm"
                  )}
                >
                  {msg.role === "assistant" && (
                     <div className="h-8 w-8 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
                        <Bot className="h-4 w-4 text-amber-500" />
                     </div>
                  )}
                  <div className="space-y-2 flex-1">
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    <p className={cn(
                      "text-[10px] font-mono",
                      msg.role === "user" ? "text-black/60" : "text-amber-500/50"
                    )}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })} 
                      {msg.role === "assistant" && " | MASS OS ENGINE"}
                    </p>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex w-full max-w-[85%] gap-4 p-4 rounded-2xl text-sm shadow-sm animate-fade-in-up bg-white/5 border border-white/5 text-white rounded-tl-sm">
                  <div className="h-8 w-8 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
                    <Bot className="h-4 w-4 text-amber-500 animate-pulse" />
                  </div>
                  <div className="space-y-2 flex-1 flex flex-col justify-center">
                    <div className="flex space-x-1">
                      <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        <div className="p-4 border-t border-white/5 bg-white/5">
          <form 
            onSubmit={(e) => {
              e.preventDefault()
              handleSend()
            }}
            className="flex gap-3"
          >
            <div className="relative flex-1">
               <Input
                 value={input}
                 onChange={(e) => setInput(e.target.value)}
                 placeholder="Input OBD-II Code (e.g., P0171), Part #, or description of symptoms..."
                 className="flex-1 bg-black/50 border-white/10 text-white pl-4 placeholder:text-muted-foreground/50 h-12 rounded-xl focus-visible:ring-amber-500"
               />
               <kbd className="pointer-events-none absolute right-4 top-3.5 hidden h-5 select-none items-center gap-1 rounded border border-white/10 bg-white/5 px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 sm:flex">
                 <span className="text-xs">⌘</span> Enter
               </kbd>
            </div>
            
            <Button 
               type="submit" 
               className="bg-amber-500 hover:bg-amber-600 text-black font-bold h-12 px-6 rounded-xl shadow-lg shadow-amber-500/20 transition-all hover:scale-105 active:scale-95 disabled:hover:scale-100 disabled:opacity-50"
               disabled={!input.trim() || isTyping}
            >
              Analyze <Send className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  )
}

