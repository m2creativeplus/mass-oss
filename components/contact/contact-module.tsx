"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { 
  MapPin,
  Phone,
  Mail,
  Clock,
  Globe,
  Facebook,
  Instagram,
  Send,
  CheckCircle2
} from "lucide-react"
import { useState } from "react"

export function ContactModule() {
  const [messageSent, setMessageSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setMessageSent(true)
    setTimeout(() => setMessageSent(false), 3000)
  }

  return (
    <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-950 p-6">
      
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center mb-6"
      >
        <h2 className="text-xl font-bold text-slate-800 dark:text-white uppercase tracking-tight">
          Contact Us
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left: Contact Information */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <Card>
            <CardHeader className="bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-t-lg">
              <CardTitle>MASS Car Workshop</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              
              {/* Address */}
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-white">Address</h4>
                  <p className="text-slate-600 dark:text-slate-400">
                    26 July Road, Industrial Area<br />
                    Hargeisa, Somaliland
                  </p>
                </div>
              </div>
              
              {/* Phone */}
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Phone className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-white">Phone</h4>
                  <p className="text-slate-600 dark:text-slate-400">
                    +252 63 123 4567<br />
                    +252 63 765 4321
                  </p>
                </div>
              </div>
              
              {/* Email */}
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <Mail className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-white">Email</h4>
                  <p className="text-slate-600 dark:text-slate-400">
                    info@massworkshop.com<br />
                    support@massworkshop.com
                  </p>
                </div>
              </div>
              
              {/* Hours */}
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-white">Business Hours</h4>
                  <p className="text-slate-600 dark:text-slate-400">
                    Saturday - Thursday: 8:00 AM - 6:00 PM<br />
                    Friday: Closed
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Social Media */}
          <Card>
            <CardContent className="p-4">
              <h4 className="font-semibold mb-3">Follow Us</h4>
              <div className="flex gap-3">
                <Button variant="outline" size="icon" className="hover:bg-blue-50 hover:text-blue-600">
                  <Facebook className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="icon" className="hover:bg-pink-50 hover:text-pink-600">
                  <Instagram className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="icon" className="hover:bg-slate-50 hover:text-slate-600">
                  <Globe className="h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Right: Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-orange-500" />
                Send us a Message
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Name</label>
                    <Input placeholder="Your name" className="mt-1" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Phone</label>
                    <Input placeholder="+252-XX-XXXXXXX" className="mt-1" />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <Input type="email" placeholder="email@example.com" className="mt-1" />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Subject</label>
                  <Input placeholder="How can we help?" className="mt-1" />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Message</label>
                  <Textarea placeholder="Your message..." className="mt-1" rows={5} />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                  disabled={messageSent}
                >
                  {messageSent ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Message Sent!
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default ContactModule
