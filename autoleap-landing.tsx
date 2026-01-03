import { Header } from "./components/header"
import { HeroSection } from "./components/hero-section"
import { TrustedBySection } from "./components/trusted-by-section"

export default function AutoLeapLanding() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection />
      <TrustedBySection />
    </div>
  )
}
