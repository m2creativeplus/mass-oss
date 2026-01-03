import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/theme-toggle"
import { Car, Menu, X, Github, Twitter, Linkedin } from "lucide-react"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
              <Car className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">MASS <span className="text-orange-500">SaaS</span></span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Home</Link>
            <Link href="/features" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Features</Link>
            <Link href="/pricing" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Pricing</Link>
            <Link href="/contact" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Contact</Link>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <ModeToggle />
            <Link href="/login">
              <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-white/10">Log in</Button>
            </Link>
            <Link href="/register">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20">Get Started</Button>
            </Link>
          </div>

          {/* Mobile Menu (Placeholder) */}
          <Button variant="ghost" size="icon" className="md:hidden text-slate-400">
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-slate-950 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                  <Car className="h-3 w-3 text-white" />
                </div>
                <span className="font-bold text-lg">MASS SaaS</span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                The all-in-one vehicle repair center management solution tailored for modern workshops.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-4 text-white">Product</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link href="/features" className="hover:text-orange-500 transition-colors">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-orange-500 transition-colors">Pricing</Link></li>
                <li><Link href="/roadmap" className="hover:text-orange-500 transition-colors">Roadmap</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-white">Company</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link href="/about" className="hover:text-orange-500 transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-orange-500 transition-colors">Contact</Link></li>
                <li><Link href="/blog" className="hover:text-orange-500 transition-colors">Blog</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-white">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link href="/privacy" className="hover:text-orange-500 transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-orange-500 transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-slate-500">© 2026 MASS Workshop System. All rights reserved.</p>
            <div className="flex gap-4">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white hover:bg-white/10 rounded-full">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white hover:bg-white/10 rounded-full">
                <Github className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white hover:bg-white/10 rounded-full">
                <Linkedin className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
