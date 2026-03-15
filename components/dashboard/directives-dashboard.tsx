"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { Zap, AlertCircle, TrendingUp, ShieldCheck } from "lucide-react"

/**
 * M2 ORBIT - DIRECTIVES DASHBOARD COMPONENT
 * Institutional Black & Gold Aesthetic.
 * Part of Milestone 3: Autonomous UI Architecture.
 */

interface Directive {
  id: string
  title: string
  content: string
  priority: "high" | "medium" | "low"
  createdAt: string
}

export function DirectivesDashboard({ directives }: { directives: Directive[] }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-[#D4AF37]" />
          Sovereign Directives
        </h2>
        <Badge variant="outline" className="border-[#D4AF37]/30 text-[#D4AF37] bg-[#D4AF37]/5">
          Live Intelligence
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {directives.map((directive, i) => (
          <motion.div
            key={directive.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="bg-black border-[#D4AF37]/10 hover:border-[#D4AF37]/30 transition-all duration-300 group overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#D4AF37]/5 rounded-full blur-3xl group-hover:bg-[#D4AF37]/10" />
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <CardTitle className="text-lg font-bold text-white tracking-tight">
                      {directive.title}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">
                      {new Date(directive.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <Badge 
                    className={`${
                      directive.priority === "high" ? "bg-red-500/10 text-red-500 border-red-500/20" :
                      directive.priority === "medium" ? "bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/20" :
                      "bg-blue-500/10 text-blue-500 border-blue-500/20"
                    } border uppercase text-[10px] font-bold px-2 py-0`}
                  >
                    {directive.priority} Priority
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400 font-inter leading-relaxed">
                  {directive.content}
                </p>
                <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-widest text-[#D4AF37]/50 font-medium">
                    M2 Orbit Intelligence Loop
                  </span>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-3 w-3 text-[#D4AF37]" />
                    <span className="text-[10px] text-muted-foreground">Strategic Intent Active</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {directives.length === 0 && (
          <div className="flex flex-col items-center justify-center p-12 border border-dashed border-white/5 rounded-xl bg-white/[0.02]">
            <Zap className="h-8 w-8 text-white/10 mb-2" />
            <p className="text-sm text-white/30 uppercase tracking-widest font-medium">
              No Active Directives
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
