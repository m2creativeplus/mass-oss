import Image from "next/image"

export function TrustedBySection() {
  const companies = [
    { name: "Hanes", logo: "/placeholder.svg?height=60&width=120" },
    { name: "APEX", logo: "/placeholder.svg?height=60&width=120" },
    { name: "FrontLine Automotive", logo: "/placeholder.svg?height=60&width=120" },
    { name: "RPM", logo: "/placeholder.svg?height=60&width=120" },
    { name: "TIRECRAFT", logo: "/placeholder.svg?height=60&width=120" },
    { name: "Cartronics", logo: "/placeholder.svg?height=60&width=120" },
  ]

  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
            The #1 Choice For Thousands Of Successful Shops
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
          {companies.map((company, index) => (
            <div key={index} className="flex flex-col items-center space-y-4">
              <div className="bg-white rounded-lg p-4 shadow-sm w-full h-20 flex items-center justify-center">
                <Image
                  src={company.logo || "/placeholder.svg"}
                  alt={`${company.name} logo`}
                  width={100}
                  height={40}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              <button className="text-sm text-teal-600 hover:text-teal-700 font-medium">Case study →</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
