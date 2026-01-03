"use client"

import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { LucideIcon, ArrowRight } from "lucide-react"

interface StatCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  color: string // e.g., "bg-[#00c0ef]"
  index: number
  variants: any
}

export function StatCard({ label, value, icon: Icon, color, index, variants }: StatCardProps) {
  return (
    <motion.div
      custom={index}
      variants={variants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
    >
      <Card className={`${color} text-white border-none shadow-md overflow-hidden relative cursor-pointer`}>
        <CardContent className="p-4 relative z-10">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-4xl font-bold">{value}</h3>
              <p className="text-sm font-medium opacity-90 mt-1 uppercase">{label}</p>
            </div>
            <Icon className="h-16 w-16 opacity-20 absolute right-4 top-2 text-black" />
          </div>
        </CardContent>
        <div className="bg-black/10 p-2 text-center text-xs font-medium cursor-pointer flex justify-center items-center hover:bg-black/20 transition-colors">
          More info <ArrowRight className="h-3 w-3 ml-1" />
        </div>
      </Card>
    </motion.div>
  )
}
