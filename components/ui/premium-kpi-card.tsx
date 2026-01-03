"use client"

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { LucideIcon, ArrowUp, ArrowDown } from "lucide-react"

interface PremiumKPICardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: {
    value: number
    label: string
    positive: boolean
  }
  color?: "primary" | "success" | "warning" | "danger" | "info" | "purple"
  index?: number
}

export function PremiumKPICard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  color = "primary",
  index = 0 
}: PremiumKPICardProps) {
  
  const colorStyles = {
    primary: "from-orange-500/10 to-orange-500/5 text-orange-500 border-orange-200/50 dark:border-orange-500/20",
    success: "from-emerald-500/10 to-emerald-500/5 text-emerald-500 border-emerald-200/50 dark:border-emerald-500/20",
    warning: "from-amber-500/10 to-amber-500/5 text-amber-500 border-amber-200/50 dark:border-amber-500/20",
    danger: "from-red-500/10 to-red-500/5 text-red-500 border-red-200/50 dark:border-red-500/20",
    info: "from-blue-500/10 to-blue-500/5 text-blue-500 border-blue-200/50 dark:border-blue-500/20",
    purple: "from-purple-500/10 to-purple-500/5 text-purple-500 border-purple-200/50 dark:border-purple-500/20",
  }

  const iconBgStyles = {
    primary: "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400",
    success: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400",
    warning: "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400",
    danger: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
    info: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
    purple: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
  }

  return (
    <Card 
      className={cn(
        "kpi-card bg-gradient-to-br animate-fade-in-up",
        colorStyles[color]
      )}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <CardContent className="p-0">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1 tracking-wide uppercase text-[10px]">
              {title}
            </p>
            <h3 className="text-3xl font-bold tracking-tight animate-count-up">
              {value}
            </h3>
            
            {trend && (
              <div className="flex items-center mt-2 space-x-2">
                <span className={cn(
                  "flex items-center text-xs font-semibold px-1.5 py-0.5 rounded",
                  trend.positive 
                    ? "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400" 
                    : "text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400"
                )}>
                  {trend.positive ? <ArrowUp className="w-3 h-3 mr-1" /> : <ArrowDown className="w-3 h-3 mr-1" />}
                  {trend.value}%
                </span>
                <span className="text-xs text-muted-foreground">{trend.label}</span>
              </div>
            )}
          </div>
          
          <div className={cn(
            "p-3 rounded-xl transition-transform duration-300 hover:scale-110 shadow-sm",
            iconBgStyles[color]
          )}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
