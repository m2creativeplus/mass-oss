import { Button } from "@/components/ui/button"

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-20 max-w-4xl">
      <h1 className="text-4xl font-bold text-white mb-8">Terms of Service</h1>
      
      <div className="prose prose-invert prose-lg max-w-none">
        <p className="text-slate-400 mb-6">Last updated: January 2, 2026</p>

        <h3>1. Acceptance of Terms</h3>
        <p>By accessing and using MASS SaaS ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not use the Service.</p>

        <h3>2. Description of Service</h3>
        <p>MASS SaaS provides a cloud-based vehicle repair center management system. We reserve the right to modify, suspend, or discontinue the Service at any time.</p>

        <h3>3. User Accounts</h3>
        <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>

        <h3>4. Subscription and Billing</h3>
        <p>The Service is billed on a subscription basis. You will be billed in advance on a recurring and periodic basis (monthly or annually).</p>

        <h3>5. Data Privacy</h3>
        <p>Your use of the Service is also governed by our Privacy Policy. We take reasonable measures to protect your data but cannot guarantee absolute security.</p>
        
        <h3>6. Limitation of Liability</h3>
        <p>MASS SaaS shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the Service.</p>
      </div>

      <div className="mt-12 p-6 bg-white/5 rounded-xl border border-white/10">
        <h3 className="text-xl font-bold text-white mb-2">Questions?</h3>
        <p className="text-slate-400 mb-4">If you have any questions about these Terms, please contact us.</p>
        <Button variant="outline">Contact Support</Button>
      </div>
    </div>
  )
}
