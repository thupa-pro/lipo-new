"use client";

import { 
  Sparkles, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin, Github,
  MessageCircle
} from 'lucide-react';

export function ModernFooter() {
  return (
    <footer className="relative z-10 px-6 py-16 mt-24 border-t border-white/10 bg-glass/50">
      <div className="max-w-7xl mx-auto">
        <div className="bg-glass rounded-3xl p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <span className="material-icons text-purple-400 text-3xl">hub</span>
                <span className="text-2xl font-bold text-white tracking-wider">Loconomy</span>
              </div>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                The premium local services marketplace connecting customers with verified professionals. 
                Powered by AI-driven matching technology and trusted by millions worldwide.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 glass rounded-xl flex items-center justify-center hover:bg-neural-50 transition-colors">
                  <Facebook className="w-5 h-5 text-neural-600" />
                </a>
                <a href="#" className="w-10 h-10 glass rounded-xl flex items-center justify-center hover:bg-neural-50 transition-colors">
                  <Twitter className="w-5 h-5 text-neural-600" />
                </a>
                <a href="#" className="w-10 h-10 glass rounded-xl flex items-center justify-center hover:bg-neural-50 transition-colors">
                  <Instagram className="w-5 h-5 text-neural-600" />
                </a>
                <a href="#" className="w-10 h-10 glass rounded-xl flex items-center justify-center hover:bg-neural-50 transition-colors">
                  <Linkedin className="w-5 h-5 text-neural-600" />
                </a>
                <a href="#" className="w-10 h-10 glass rounded-xl flex items-center justify-center hover:bg-neural-50 transition-colors">
                  <Github className="w-5 h-5 text-neural-600" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-bold text-gradient-neural mb-4">Platform</h3>
              <ul className="space-y-3">
                <li><a href="/browse" className="text-muted-foreground hover:text-neural-600 transition-colors">Browse Services</a></li>
                <li><a href="/become-provider" className="text-muted-foreground hover:text-neural-600 transition-colors">Become a Provider</a></li>
                <li><a href="/how-it-works" className="text-muted-foreground hover:text-neural-600 transition-colors">How It Works</a></li>
                <li><a href="/pricing" className="text-muted-foreground hover:text-neural-600 transition-colors">Pricing</a></li>
                <li><a href="/mobile-app" className="text-muted-foreground hover:text-neural-600 transition-colors">Mobile App</a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="font-bold text-gradient-quantum mb-4">Support</h3>
              <ul className="space-y-3">
                <li><a href="/help" className="text-muted-foreground hover:text-neural-600 transition-colors">Help Center</a></li>
                <li><a href="/safety" className="text-muted-foreground hover:text-neural-600 transition-colors">Safety Guide</a></li>
                <li><a href="/community" className="text-muted-foreground hover:text-neural-600 transition-colors">Community</a></li>
                <li><a href="/contact" className="text-muted-foreground hover:text-neural-600 transition-colors">Contact Us</a></li>
                <li><a href="/customer-support" className="text-muted-foreground hover:text-neural-600 transition-colors">Customer Support</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-bold text-gradient-trust mb-4">Contact</h3>
              <ul className="space-y-3">
                <li className="flex items-center text-muted-foreground">
                  <Phone className="w-4 h-4 mr-3 text-neural-500" />
                  <span>+1 (555) 123-4567</span>
                </li>
                <li className="flex items-center text-muted-foreground">
                  <Mail className="w-4 h-4 mr-3 text-neural-500" />
                  <span>hello@loconomy.com</span>
                </li>
                <li className="flex items-center text-muted-foreground">
                  <MapPin className="w-4 h-4 mr-3 text-neural-500" />
                  <span>San Francisco, CA</span>
                </li>
                <li className="flex items-center text-muted-foreground">
                  <MessageCircle className="w-4 h-4 mr-3 text-neural-500" />
                  <span>24/7 Live Chat</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-muted-foreground mb-4 md:mb-0">
              © 2025 Loconomy. All rights reserved. Connecting communities through local services.
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="/privacy" className="text-muted-foreground hover:text-neural-600 transition-colors">Privacy Policy</a>
              <a href="/terms" className="text-muted-foreground hover:text-neural-600 transition-colors">Terms of Service</a>
              <a href="/cookies" className="text-muted-foreground hover:text-neural-600 transition-colors">Cookie Policy</a>
              <a href="/accessibility" className="text-muted-foreground hover:text-neural-600 transition-colors">Accessibility</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
