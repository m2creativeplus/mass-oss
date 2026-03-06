"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Phone, Mail, MapPin, Clock, MessageCircle, Send } from "lucide-react"
import { useOrganization } from "@/components/providers/organization-provider"
import { useState } from "react"

export default function ContactPage() {
  const { organization } = useOrganization()
  const [message, setMessage] = useState("")

  if (!organization) return null

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
              <Phone className="h-5 w-5 text-white" />
            </div>
            Contact & Support
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Get help from the MASS support team
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <Phone className="h-10 w-10 text-blue-500 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Phone Support</h3>
            <p className="text-lg font-bold text-blue-600">+252 63 XXX XXXX</p>
            <p className="text-sm text-gray-500 mt-2">Available 8 AM - 6 PM EAT</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Mail className="h-10 w-10 text-green-500 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Email</h3>
            <p className="text-lg font-bold text-green-600">support@masscar.com</p>
            <p className="text-sm text-gray-500 mt-2">Response within 24 hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <MapPin className="h-10 w-10 text-red-500 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Location</h3>
            <p className="text-lg font-bold text-red-600">Hargeisa, Somaliland</p>
            <p className="text-sm text-gray-500 mt-2">Main Workshop</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-blue-500" />
            Send a Message
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                className="p-3 border rounded-lg"
                placeholder="Your Name"
              />
              <input
                type="email"
                className="p-3 border rounded-lg"
                placeholder="Email Address"
              />
            </div>
            <input
              type="text"
              className="w-full p-3 border rounded-lg"
              placeholder="Subject"
            />
            <textarea
              className="w-full p-3 border rounded-lg min-h-[120px] resize-none"
              placeholder="How can we help you?"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Send className="h-4 w-4 mr-2" />
              Send Message
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
