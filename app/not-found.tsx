"use client"

import { motion } from "framer-motion"
import { SearchX, Home, Wrench } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-zinc-950 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center max-w-md text-center"
      >
        {/* 404 Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
          className="relative mb-8"
        >
          {/* Glow effect */}
          <div className="absolute inset-0 h-28 w-28 rounded-full bg-amber-500/20 blur-xl" />

          {/* Icon container */}
          <div className="relative h-28 w-28 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center border-4 border-zinc-700 shadow-2xl">
            <SearchX className="h-14 w-14 text-amber-500" />
          </div>

          {/* Decorative wrench */}
          <motion.div
            className="absolute -bottom-2 -right-2 h-10 w-10 rounded-full bg-orange-500 flex items-center justify-center shadow-lg"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Wrench className="h-5 w-5 text-white" />
          </motion.div>
        </motion.div>

        {/* 404 Number */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-4"
        >
          <span className="text-8xl font-black bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 bg-clip-text text-transparent">
            404
          </span>
        </motion.div>

        {/* Message */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-2xl font-bold text-white mb-2"
        >
          Garage Closed
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-zinc-400 mb-8"
        >
          Looks like this bay is empty. The page you're looking for doesn't exist or has been moved.
        </motion.p>

        {/* Decorative line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="w-32 h-1 bg-gradient-to-r from-transparent via-zinc-700 to-transparent mb-8"
        />

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-3 w-full"
        >
          {/* Return to Dashboard */}
          <Link
            href="/"
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40"
          >
            <Home className="h-5 w-5" />
            Return to Dashboard
          </Link>
        </motion.div>

        {/* Fun message */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-xs text-zinc-600 mt-8"
        >
          🔧 Our mechanics are working on it...
        </motion.p>
      </motion.div>

      {/* Background grid pattern */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/3 h-64 w-64 rounded-full bg-orange-500/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/3 h-64 w-64 rounded-full bg-amber-500/5 blur-3xl" />

        {/* Grid lines (optional decorative) */}
        <svg className="absolute inset-0 h-full w-full opacity-[0.02]">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
    </div>
  )
}
