"use client"

import { motion } from "framer-motion"

export default function Loading() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-zinc-950">
      <div className="relative flex items-center justify-center">
        {/* Outer Ring */}
        <motion.div
          className="absolute h-24 w-24 rounded-full border-t-4 border-amber-500 opacity-20"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Middle Ring */}
        <motion.div
          className="absolute h-16 w-16 rounded-full border-t-4 border-amber-500"
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Inner Dot */}
        <motion.div
          className="h-4 w-4 rounded-full bg-emerald-500"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      </div>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute mt-32 font-mono text-sm text-zinc-500"
      >
        INITIALIZING SYSTEM...
      </motion.p>
    </div>
  )
}
