import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Wrench } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-orange-500/30 font-sans flex flex-col relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950 -z-10" />
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-orange-600/5 blur-[100px] rounded-full pointer-events-none -z-10" />
      
      {/* Navbar */}
      <header className="fixed top-0 w-full z-50 border-b border-white/5 bg-slate-950/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-500 text-white flex items-center justify-center transform rotate-12">
              <Wrench className="w-5 h-5 -rotate-12" />
            </div>
            <span className="font-bold text-xl tracking-wider text-white">MASS<span className="text-orange-500">OSS</span></span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <Link href="/" className="text-white hover:text-orange-400 transition-colors">Home</Link>
            <Link href="#services" className="hover:text-white transition-colors">Services</Link>
            <Link href="#about" className="hover:text-white transition-colors">About Us</Link>
            <Link href="#contact" className="hover:text-white transition-colors">Contact</Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors hidden sm:block">
              Login
            </Link>
            <Button asChild className="bg-orange-500 hover:bg-orange-600 text-white font-medium shadow-[0_0_15px_rgba(249,115,22,0.3)] border-0">
              <Link href="/login">
                Book Appointment
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 pt-32 pb-20 relative z-10 w-full max-w-5xl mx-auto min-h-[90vh]">
        <div className="space-y-6">
          <p className="text-orange-500 font-bold tracking-[0.2em] text-sm uppercase">
            PREMIUM AUTOMOTIVE EXCELLENCE
          </p>
          
          <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-black leading-[1.1] tracking-tight text-white uppercase">
            Professional <br />
            <span className="text-orange-500">Car Repair</span> <br />
            And Maintenance
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 mt-6 leading-relaxed">
            Experience world-class automotive service with MASS OSS
            certified workshops. International standards, local expertise.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Button asChild size="lg" className="h-14 px-8 text-base bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-[0_0_20px_rgba(249,115,22,0.4)] border-0 rounded-md">
              <Link href="/login">
                Get an Appointment &rarr;
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-14 px-8 text-base border-white/10 text-white hover:bg-white/5 rounded-md bg-transparent">
              <Link href="#services">
                Our Services
              </Link>
            </Button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-60">
          <div className="w-5 h-8 border-2 border-slate-500 rounded-full flex justify-center p-1">
            <div className="w-1 h-2 bg-orange-500 rounded-full animate-bounce" />
          </div>
        </div>
      </main>
    </div>
  );
}
