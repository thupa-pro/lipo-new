"use client";

import { 
  Sparkles, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin, Github,
  MessageCircle
} from 'lucide-react';

export function ModernFooter() {
  return (
    <footer className="relative z-10 spacing-responsive-y margin-responsive-y border-t border-slate-200/50 dark:border-white/10 bg-white/80 dark:bg-glass/50 safe-area-padding-bottom">
      <div className="responsive-container max-w-7xl mx-auto">
        <div className="bg-white/90 dark:bg-glass card-responsive border border-slate-200/50 dark:border-white/10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 md:gap-8 margin-responsive-y">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-4 md:mb-6">
                <span className="material-icons text-indigo-600 dark:text-purple-400 text-2xl md:text-3xl">hub</span>
                <span className="fluid-text-xl font-bold text-slate-800 dark:text-white tracking-wider">Loconomy</span>
              </div>
              <p className="text-responsive-sm text-slate-600 dark:text-slate-300 mb-4 md:mb-6 leading-relaxed">
                The premium local services marketplace connecting customers with verified professionals. 
                Powered by AI-driven matching technology and trusted by millions worldwide.
              </p>
              <div className="flex flex-wrap gap-3 md:gap-4">
                <a href="#" className="touch-target w-10 h-10 md:w-12 md:h-12 bg-slate-100 dark:bg-glass rounded-xl flex items-center justify-center hover:bg-slate-200 dark:hover:bg-white/10 transition-colors hover-touch">
                  <Facebook className="w-4 h-4 md:w-5 md:h-5 text-indigo-600 dark:text-purple-400" />
                </a>
                <a href="#" className="touch-target w-10 h-10 md:w-12 md:h-12 bg-slate-100 dark:bg-glass rounded-xl flex items-center justify-center hover:bg-slate-200 dark:hover:bg-white/10 transition-colors hover-touch">
                  <Twitter className="w-4 h-4 md:w-5 md:h-5 text-indigo-600 dark:text-purple-400" />
                </a>
                <a href="#" className="touch-target w-10 h-10 md:w-12 md:h-12 bg-slate-100 dark:bg-glass rounded-xl flex items-center justify-center hover:bg-slate-200 dark:hover:bg-white/10 transition-colors hover-touch">
                  <Instagram className="w-4 h-4 md:w-5 md:h-5 text-indigo-600 dark:text-purple-400" />
                </a>
                <a href="#" className="touch-target w-10 h-10 md:w-12 md:h-12 bg-slate-100 dark:bg-glass rounded-xl flex items-center justify-center hover:bg-slate-200 dark:hover:bg-white/10 transition-colors hover-touch">
                  <Linkedin className="w-4 h-4 md:w-5 md:h-5 text-indigo-600 dark:text-purple-400" />
                </a>
                <a href="#" className="touch-target w-10 h-10 md:w-12 md:h-12 bg-slate-100 dark:bg-glass rounded-xl flex items-center justify-center hover:bg-slate-200 dark:hover:bg-white/10 transition-colors hover-touch">
                  <Github className="w-4 h-4 md:w-5 md:h-5 text-indigo-600 dark:text-purple-400" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="fluid-text-lg font-bold text-slate-800 dark:text-white mb-3 md:mb-4">Platform</h3>
              <ul className="space-y-2 md:space-y-3">
                <li><a href="/browse" className="text-responsive-sm text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white transition-colors touch-target hover-touch block py-1">Browse Services</a></li>
                <li><a href="/become-provider" className="text-responsive-sm text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white transition-colors touch-target hover-touch block py-1">Become a Provider</a></li>
                <li><a href="/how-it-works" className="text-responsive-sm text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white transition-colors touch-target hover-touch block py-1">How It Works</a></li>
                <li><a href="/pricing" className="text-responsive-sm text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white transition-colors touch-target hover-touch block py-1">Pricing</a></li>
                <li><a href="/mobile-app" className="text-responsive-sm text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white transition-colors touch-target hover-touch block py-1">Mobile App</a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="fluid-text-lg font-bold text-slate-800 dark:text-white mb-3 md:mb-4">Support</h3>
              <ul className="space-y-2 md:space-y-3">
                <li><a href="/help" className="text-responsive-sm text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white transition-colors touch-target hover-touch block py-1">Help Center</a></li>
                <li><a href="/safety" className="text-responsive-sm text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white transition-colors touch-target hover-touch block py-1">Safety Guide</a></li>
                <li><a href="/community" className="text-responsive-sm text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white transition-colors touch-target hover-touch block py-1">Community</a></li>
                <li><a href="/contact" className="text-responsive-sm text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white transition-colors touch-target hover-touch block py-1">Contact Us</a></li>
                <li><a href="/customer-support" className="text-responsive-sm text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white transition-colors touch-target hover-touch block py-1">Customer Support</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="fluid-text-lg font-bold text-slate-800 dark:text-white mb-3 md:mb-4">Contact</h3>
              <ul className="space-y-2 md:space-y-3">
                <li className="flex items-center text-responsive-sm text-slate-600 dark:text-slate-300 py-1">
                  <Phone className="w-4 h-4 mr-2 md:mr-3 text-indigo-600 dark:text-purple-400 flex-shrink-0" />
                  <span className="break-all">+1 (555) 123-4567</span>
                </li>
                <li className="flex items-center text-responsive-sm text-slate-600 dark:text-slate-300 py-1">
                  <Mail className="w-4 h-4 mr-2 md:mr-3 text-indigo-600 dark:text-purple-400 flex-shrink-0" />
                  <span className="break-all">hello@loconomy.com</span>
                </li>
                <li className="flex items-center text-responsive-sm text-slate-600 dark:text-slate-300 py-1">
                  <MapPin className="w-4 h-4 mr-2 md:mr-3 text-indigo-600 dark:text-purple-400 flex-shrink-0" />
                  <span>San Francisco, CA</span>
                </li>
                <li className="flex items-center text-responsive-sm text-slate-600 dark:text-slate-300 py-1">
                  <MessageCircle className="w-4 h-4 mr-2 md:mr-3 text-indigo-600 dark:text-purple-400 flex-shrink-0" />
                  <span>24/7 Live Chat</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-slate-200/50 dark:border-white/10 pt-6 md:pt-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="text-responsive-sm text-slate-600 dark:text-slate-300 order-2 md:order-1">
              © 2025 Loconomy. All rights reserved. Connecting communities through local services.
            </div>
            <div className="flex flex-wrap gap-4 md:gap-6 text-responsive-sm order-1 md:order-2">
              <a href="/privacy" className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white transition-colors touch-target hover-touch whitespace-nowrap">Privacy Policy</a>
              <a href="/terms" className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white transition-colors touch-target hover-touch whitespace-nowrap">Terms of Service</a>
              <a href="/cookies" className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white transition-colors touch-target hover-touch whitespace-nowrap">Cookie Policy</a>
              <a href="/accessibility" className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white transition-colors touch-target hover-touch whitespace-nowrap">Accessibility</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
