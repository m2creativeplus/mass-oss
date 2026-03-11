"use client"

import { Button } from "@/components/ui/button"
import { ChevronDown, Menu, X } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <header className="w-full bg-slate-950/50 backdrop-blur-xl border-b border-white/5 fixed top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <div className="text-2xl font-black tracking-tighter">
              <span className="text-white">MASS</span>
              <span className="text-orange-500">OSS</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-10">
            <Link href="#features" className="text-sm font-bold text-slate-400 hover:text-orange-500 transition-colors cursor-pointer">
              Features
            </Link>
            <Link href="#solutions" className="text-sm font-bold text-slate-400 hover:text-orange-500 transition-colors cursor-pointer">
              Solutions
            </Link>
            <Link href="/pricing" className="text-sm font-bold text-slate-400 hover:text-orange-500 transition-colors cursor-pointer">
              Pricing
            </Link>
            <Link href="/blog" className="text-sm font-bold text-slate-400 hover:text-orange-500 transition-colors cursor-pointer">
              Network
            </Link>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/login" className="text-sm font-bold text-slate-400 hover:text-white transition-colors cursor-pointer">
              Sign In
            </Link>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 h-11 rounded-xl shadow-lg shadow-orange-500/20">
              Get a Demo
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-slate-400 hover:text-white focus:outline-none"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 right-0 bg-slate-950 border-b border-white/5 shadow-2xl z-50">
          <div className="px-6 py-8 space-y-8">
            <div className="flex flex-col space-y-6">
                <Link href="#features" onClick={toggleMobileMenu} className="text-xl font-bold text-white">Features</Link>
                <Link href="#solutions" onClick={toggleMobileMenu} className="text-xl font-bold text-white">Solutions</Link>
                <Link href="/pricing" onClick={toggleMobileMenu} className="text-xl font-bold text-white">Pricing</Link>
                <Link href="/blog" onClick={toggleMobileMenu} className="text-xl font-bold text-white">Network</Link>
            </div>

            <div className="pt-8 border-t border-white/5 space-y-6">
                <Link href="/login" onClick={toggleMobileMenu} className="block text-center text-slate-400 font-bold">Sign In</Link>
                <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 text-lg font-bold rounded-xl h-14">
                    Get a Demo
                </Button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-25 z-40" onClick={toggleMobileMenu} />
      )}
    </header>
  )
}
