import { Button } from "@/components/ui/button"

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-20 max-w-4xl">
      <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>
      
      <div className="prose prose-invert prose-lg max-w-none">
        <p className="text-slate-400 mb-6">Last updated: January 2, 2026</p>

        <h3>1. Information We Collect</h3>
        <p>We collect information you provide directly to us, such as when you create an account, subscribe to our service, or request customer support.</p>

        <h3>2. How We Use Your Information</h3>
        <p>We use the information we collect to provide, maintain, and improve our services, to process your transactions, and to communicate with you.</p>

        <h3>3. Information Sharing</h3>
        <p>We do not share your personal information with third parties except as described in this policy or with your consent.</p>

        <h3>4. Data Security</h3>
        <p>We use appropriate technical and organizational measures to protect the security of your personal information.</p>

        <h3>5. Your Rights</h3>
        <p>You have the right to access, correct, or delete your personal information. You may also object to processing or request data portability.</p>
      </div>

      <div className="mt-12 p-6 bg-white/5 rounded-xl border border-white/10">
        <h3 className="text-xl font-bold text-white mb-2">Privacy Concerns?</h3>
        <p className="text-slate-400 mb-4">Contact our Data Protection Officer for any privacy-related inquiries.</p>
        <Button variant="outline">Contact DPO</Button>
      </div>
    </div>
  )
}
