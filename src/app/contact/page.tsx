"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EnhancedCard, EnhancedCardContent, EnhancedCardDescription, EnhancedCardHeader, EnhancedCardTitle } from "@/components/ui/enhanced-card"
import { EnhancedButton } from "@/components/ui/enhanced-button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Phone, Mail, MapPin, MessageSquare, ArrowRight, Clock, Users, Zap } from "lucide-react"
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
    <div className="min-h-screen bg-gradient-to-br from-stratosphere via-cirrus to-white dark:from-gray-900 dark:via-gray-800 dark:to-black transition-colors duration-300">
      {/* Neural Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25px 25px, hsl(var(--neural-500)) 2px, transparent 0),
                           radial-gradient(circle at 75px 75px, hsl(var(--quantum-500)) 1px, transparent 0)`,
          backgroundSize: '100px 100px'
        }} />
      </div>

      <header className="relative z-10 py-16 px-4 text-center">
        <div className="container mx-auto max-w-4xl">
          <div className="w-16 h-16 bg-gradient-neural rounded-2xl flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-8 h-8 text-white" />
          </div>
          <Badge variant="secondary" className="mb-4 px-4 py-2 bg-white/80 dark:bg-gray-800/60 backdrop-blur-md border border-white/20">
            <Users className="w-4 h-4 mr-2" />
            Get in Touch
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient-neural">
            Contact Us
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            We'd love to hear from you! Reach out with any questions, feedback, or inquiries.
          </p>
          <EnhancedButton
            size="lg"
            variant="premium"
            onClick={() => toast({ title: "Live Chat", description: "Connecting you to a support agent...", variant: "default" })}
            className="hover:shadow-glow-neural"
          >
            <Zap className="w-5 h-5 mr-2" />
            Start Live Chat
            <ArrowRight className="w-4 h-4 ml-2" />
          </EnhancedButton>
        </div>
      </header>

      <section className="relative z-10 py-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gradient-quantum">Send Us a Message</h2>
            <p className="text-muted-foreground">
              Fill out the form below and we'll get back to you as soon as possible.
            </p>
            <div className="flex items-center justify-center gap-4 mt-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-sm text-green-600 dark:text-green-400">Usually respond within 2 hours</span>
              </div>
            </div>
          </div>

          <EnhancedCard variant="glass" className="hover:scale-[1.02] transition-all duration-500">
            <EnhancedCardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-base font-medium">Your Name</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      required
                      className="mt-2 glass border-white/20 focus:border-neural-500 transition-colors"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-base font-medium">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john.doe@example.com"
                      required
                      className="mt-2 glass border-white/20 focus:border-neural-500 transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="subject" className="text-base font-medium">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="General Inquiry"
                    required
                    className="mt-2 glass border-white/20 focus:border-neural-500 transition-colors"
                  />
                </div>
                <div>
                  <Label htmlFor="message" className="text-base font-medium">Your Message</Label>
                  <Textarea
                    id="message"
                    rows={5}
                    placeholder="Type your message here..."
                    required
                    className="mt-2 glass border-white/20 focus:border-neural-500 transition-colors resize-none"
                  />
                </div>
                <EnhancedButton
                  type="submit"
                  className="w-full bg-gradient-neural text-white hover:shadow-glow-neural"
                  size="lg"
                >
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Submit Message
                </EnhancedButton>
              </form>
            </EnhancedCardContent>
          </EnhancedCard>
        </div>
      </section>

      <section className="relative z-10 py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gradient-trust">Other Ways to Connect</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Reach out to us through various channels. We're here to help 24/7.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <EnhancedCard variant="glass" className="text-center hover:scale-105 transition-all duration-500 group">
              <EnhancedCardContent className="p-6">
                <div className="w-14 h-14 bg-gradient-neural rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Phone className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gradient-neural">Phone</h3>
                <p className="text-muted-foreground mb-4">Call our support line during business hours.</p>
                <p className="text-lg font-bold">1-800-LOCONOMY</p>
                <div className="flex items-center justify-center gap-1 mt-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Mon-Fri 9AM-6PM</span>
                </div>
              </EnhancedCardContent>
            </EnhancedCard>

            <EnhancedCard variant="glass" className="text-center hover:scale-105 transition-all duration-500 group">
              <EnhancedCardContent className="p-6">
                <div className="w-14 h-14 bg-gradient-quantum rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Mail className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gradient-quantum">Email</h3>
                <p className="text-muted-foreground mb-4">Send us an email and we'll respond within 2 hours.</p>
                <p className="text-lg font-bold">hello@loconomy.com</p>
                <div className="flex items-center justify-center gap-1 mt-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-green-600">Usually responds fast</span>
                </div>
              </EnhancedCardContent>
            </EnhancedCard>

            <EnhancedCard variant="glass" className="text-center hover:scale-105 transition-all duration-500 group">
              <EnhancedCardContent className="p-6">
                <div className="w-14 h-14 bg-gradient-trust rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <MapPin className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gradient-trust">Address</h3>
                <p className="text-muted-foreground mb-4">Our main office location.</p>
                <p className="text-lg font-bold">123 Service Lane, Suite 100</p>
                <p className="text-sm text-muted-foreground">San Francisco, CA 94102</p>
              </EnhancedCardContent>
            </EnhancedCard>
          </div>
        </div>
      </section>
    </div>
  )
}
