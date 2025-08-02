"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Phone, Mail, MapPin, MessageSquare, ArrowRight } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

export default function ContactUsPage() {
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Message Sent!",
      description: "Thank you for contacting us. We'll get back to you shortly.",
      variant: "default",
    })
    // Simulate form reset
    e.currentTarget.reset();
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="py-16 px-4 text-center bg-gradient-to-br from-blue-50 to-green-50">
        <div className="container mx-auto max-w-4xl">
          <MessageSquare className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            Contact Us
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            We'd love to hear from you! Reach out with any questions, feedback, or inquiries.
          </p>
          <Button size="lg" onClick={() => toast({ title: "Live Chat", description: "Connecting you to a support agent...", variant: "default" })}>
            Start Live Chat
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </header>

      <section className="py-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Send Us a Message</h2>
            <p className="text-muted-foreground">
              Fill out the form below and we'll get back to you as soon as possible.
            </p>
          </div>

          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Your Name</Label>
                  <Input id="name" placeholder="John Doe" required />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="john.doe@example.com" required />
                </div>
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="General Inquiry" required />
                </div>
                <div>
                  <Label htmlFor="message">Your Message</Label>
                  <Textarea id="message" rows={5} placeholder="Type your message here..." required />
                </div>
                <Button type="submit" className="w-full">
                  Submit Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Other Ways to Connect</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Reach out to us through various channels.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-100 text-blue-600 mb-4">
                  <Phone className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Phone</h3>
                <p className="text-muted-foreground mb-4">Call our support line during business hours.</p>
                <p className="text-lg font-bold">1-800-LOCONOMY</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-100 text-green-600 mb-4">
                  <Mail className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Email</h3>
                <p className="text-muted-foreground mb-4">Send us an email and we'll respond within 24 hours.</p>
                <p className="text-lg font-bold">hello@loconomy.com</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-purple-100 text-purple-600 mb-4">
                  <MapPin className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Address</h3>
                <p className="text-muted-foreground mb-4">Our main office location.</p>
                <p className="text-lg font-bold">123 Service Lane, Suite 100, City, State 12345</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}