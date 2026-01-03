"use client"

import { Button } from "@/components/ui/button"
import { ChevronDown, Menu, X } from "lucide-react"
import { useState } from "react"

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <header className="w-full bg-white border-b border-gray-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="text-2xl font-bold">
              <span className="text-gray-900">Auto</span>
              <span className="text-teal-500">Leap</span>
              <span className="text-teal-500">°</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <div className="flex items-center space-x-1 text-gray-700 hover:text-gray-900 cursor-pointer">
              <span>Features</span>
              <ChevronDown className="w-4 h-4" />
            </div>
            <div className="flex items-center space-x-1 text-gray-700 hover:text-gray-900 cursor-pointer">
              <span>Shop Types</span>
              <ChevronDown className="w-4 h-4" />
            </div>
            <div className="flex items-center space-x-1 text-gray-700 hover:text-gray-900 cursor-pointer">
              <span>Partners</span>
              <ChevronDown className="w-4 h-4" />
            </div>
            <span className="text-gray-700 hover:text-gray-900 cursor-pointer">Pricing</span>
            <div className="flex items-center space-x-1 text-gray-700 hover:text-gray-900 cursor-pointer">
              <span>Resources</span>
              <ChevronDown className="w-4 h-4" />
            </div>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <span className="text-gray-700 text-sm">(855) 560-0088</span>
            <span className="text-gray-700 hover:text-gray-900 cursor-pointer">Sign In</span>
            <Button className="bg-teal-400 hover:bg-teal-500 text-white px-6">Get a Demo</Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-700 hover:text-gray-900 focus:outline-none focus:text-gray-900"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-50">
          <div className="px-4 py-6 space-y-6">
            {/* Mobile Navigation Links */}
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-gray-700 font-medium">Features</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-gray-700 font-medium">Shop Types</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-gray-700 font-medium">Partners</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
              <div className="py-2 border-b border-gray-100">
                <span className="text-gray-700 font-medium">Pricing</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-gray-700 font-medium">Resources</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </div>

            {/* Mobile Contact Info */}
            <div className="space-y-4 pt-4 border-t border-gray-200">
              <div className="text-center">
                <a href="tel:8555600088" className="text-teal-600 font-semibold text-lg">
                  (855) 560-0088
                </a>
              </div>

              <div className="text-center">
                <button className="text-gray-700 hover:text-gray-900 font-medium">Sign In</button>
              </div>

              <div className="pt-2">
                <Button className="w-full bg-teal-400 hover:bg-teal-500 text-white py-3 text-lg">Get a Demo</Button>
              </div>
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
