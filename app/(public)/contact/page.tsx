import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Mail, Phone, MapPin, Clock } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="flex flex-col">
      <section className="py-20 bg-slate-950 border-b border-white/5">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Get in <span className="text-orange-500">Touch</span></h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Have questions? Our team is here to help you get the most out of MASS.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
            {/* Contact Info */}
            <div className="space-y-12">
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Contact Information</h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded bg-white/5 flex items-center justify-center flex-shrink-0">
                      <Mail className="h-5 w-5 text-orange-500" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium mb-1">Email Us</h3>
                      <p className="text-slate-400">support@mass-system.com</p>
                      <p className="text-slate-400">sales@mass-system.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded bg-white/5 flex items-center justify-center flex-shrink-0">
                      <Phone className="h-5 w-5 text-orange-500" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium mb-1">Call Us</h3>
                      <p className="text-slate-400">+1 (555) 123-4567</p>
                      <p className="text-slate-400">Mon-Fri, 9am - 6pm EST</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded bg-white/5 flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-5 w-5 text-orange-500" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium mb-1">Visit Us</h3>
                      <p className="text-slate-400">123 Tech Avenue</p>
                      <p className="text-slate-400">Innovation District, NY 10001</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Support Hours</h2>
                <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded bg-white/5 flex items-center justify-center flex-shrink-0">
                      <Clock className="h-5 w-5 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-slate-400">Monday - Friday: 9am - 6pm</p>
                      <p className="text-slate-400">Saturday: 10am - 4pm</p>
                      <p className="text-slate-400">Sunday: Closed (Emergency support only)</p>
                    </div>
                  </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white/5 p-8 rounded-2xl border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-6">Send us a message</h2>
              <form className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="first-name" className="text-slate-300">First name</Label>
                    <Input id="first-name" placeholder="John" className="bg-white/5 border-white/10 text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last-name" className="text-slate-300">Last name</Label>
                    <Input id="last-name" placeholder="Doe" className="bg-white/5 border-white/10 text-white" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-300">Email</Label>
                  <Input id="email" type="email" placeholder="john@example.com" className="bg-white/5 border-white/10 text-white" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-slate-300">Subject</Label>
                  <select id="subject" className="w-full h-10 rounded-md bg-white/5 border border-white/10 text-white px-3 text-sm">
                    <option>General Inquiry</option>
                    <option>Sales Question</option>
                    <option>Technical Support</option>
                    <option>Partnership</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-slate-300">Message</Label>
                  <Textarea id="message" placeholder="How can we help you?" className="min-h-[150px] bg-white/5 border-white/10 text-white" />
                </div>

                <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white h-12 text-base">Send Message</Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
