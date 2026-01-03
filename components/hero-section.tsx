import { Button } from "@/components/ui/button"
import { Star, Users } from "lucide-react"
import Image from "next/image"

export function HeroSection() {
  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div>
              <p className="text-teal-400 font-semibold text-sm tracking-wide uppercase mb-4">
                AUTO REPAIR SHOP SOFTWARE
              </p>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                All-In-One Shop Management Tool for Auto Repair Shops
              </h1>
            </div>

            <div className="space-y-6">
              <p className="text-lg text-gray-600 leading-relaxed">
                AutoLeap provides a complete automotive repair shop management solution for shop owners, service
                managers, and technicians to manage every aspect of their shop.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Designed to help you work smarter, not harder, and grow your auto repair business, all from a single,
                easy-to-use platform.
              </p>
            </div>

            <Button className="bg-teal-400 hover:bg-teal-500 text-white px-8 py-3 text-lg">Get a Demo</Button>

            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-gray-700 font-semibold">2,500+ reviews on</span>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <span className="text-blue-600 font-bold text-lg">G</span>
                <span className="text-red-500 font-bold text-lg">o</span>
                <span className="text-yellow-500 font-bold text-lg">o</span>
                <span className="text-blue-600 font-bold text-lg">g</span>
                <span className="text-green-500 font-bold text-lg">l</span>
                <span className="text-red-500 font-bold text-lg">e</span>
              </div>
              <div className="text-blue-600 font-semibold">Capterra</div>
              <div className="text-orange-500 font-semibold">Software Advice</div>
            </div>
          </div>

          <div className="relative">
            <div className="relative bg-gradient-to-br from-teal-100 to-teal-200 rounded-full p-8">
              <Image
                src="/placeholder.svg?height=400&width=400"
                alt="AutoLeap technician with laptop"
                width={400}
                height={400}
                className="rounded-full"
              />

              {/* Assign Technicians Card */}
              <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-3 flex items-center space-x-2">
                <Users className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Assign Technicians</span>
              </div>

              {/* Average RO Value Card */}
              <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Average RO value</p>
                  <div className="relative w-20 h-20 mx-auto">
                    <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="2"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="2"
                        strokeDasharray="75, 100"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold text-gray-900">$9.5k</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rating Stars */}
              <div className="absolute bottom-8 left-8 bg-white rounded-lg shadow-lg p-2 flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
