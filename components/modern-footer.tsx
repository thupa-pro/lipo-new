"use client";

import { 
  Sparkles, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin, Github,
  MessageCircle
} from 'lucide-react';

export function ModernFooter() {
  return (
    <footer className="relative z-10 px-6 py-16 mt-24 border-t border-slate-200/50 dark:border-white/10 bg-white/80 dark:bg-glass/50">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/90 dark:bg-glass rounded-3xl p-12 border border-slate-200/50 dark:border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <span className="material-icons text-indigo-600 dark:text-purple-400 text-3xl">hub</span>
                <span className="text-2xl font-bold text-slate-800 dark:text-white tracking-wider">Loconomy</span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed text-sm">
                The premium local services marketplace connecting customers with verified professionals. 
                Powered by AI-driven matching technology and trusted by millions worldwide.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-slate-100 dark:bg-glass rounded-xl flex items-center justify-center hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">
                  <Facebook className="w-5 h-5 text-indigo-600 dark:text-purple-400" />
                </a>
                <a href="#" className="w-10 h-10 bg-slate-100 dark:bg-glass rounded-xl flex items-center justify-center hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">
                  <Twitter className="w-5 h-5 text-indigo-600 dark:text-purple-400" />
                </a>
                <a href="#" className="w-10 h-10 bg-slate-100 dark:bg-glass rounded-xl flex items-center justify-center hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">
                  <Instagram className="w-5 h-5 text-indigo-600 dark:text-purple-400" />
                </a>
                <a href="#" className="w-10 h-10 bg-slate-100 dark:bg-glass rounded-xl flex items-center justify-center hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">
                  <Linkedin className="w-5 h-5 text-indigo-600 dark:text-purple-400" />
                </a>
                <a href="#" className="w-10 h-10 bg-slate-100 dark:bg-glass rounded-xl flex items-center justify-center hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">
                  <Github className="w-5 h-5 text-indigo-600 dark:text-purple-400" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-bold text-slate-800 dark:text-white mb-4">Platform</h3>
              <ul className="space-y-3">
                <li><a href="/browse" className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white transition-colors">Browse Services</a></li>
                <li><a href="/become-provider" className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white transition-colors">Become a Provider</a></li>
                <li><a href="/how-it-works" className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white transition-colors">How It Works</a></li>
                <li><a href="/pricing" className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white transition-colors">Pricing</a></li>
                <li><a href="/mobile-app" className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white transition-colors">Mobile App</a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="font-bold text-slate-800 dark:text-white mb-4">Support</h3>
              <ul className="space-y-3">
                <li><a href="/help" className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white transition-colors">Help Center</a></li>
                <li><a href="/safety" className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white transition-colors">Safety Guide</a></li>
                <li><a href="/community" className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white transition-colors">Community</a></li>
                <li><a href="/contact" className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="/customer-support" className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white transition-colors">Customer Support</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-bold text-slate-800 dark:text-white mb-4">Contact</h3>
              <ul className="space-y-3">
                <li className="flex items-center text-slate-600 dark:text-slate-300">
                  <Phone className="w-4 h-4 mr-3 text-indigo-600 dark:text-purple-400" />
                  <span>+1 (555) 123-4567</span>
                </li>
                <li className="flex items-center text-slate-600 dark:text-slate-300">
                  <Mail className="w-4 h-4 mr-3 text-indigo-600 dark:text-purple-400" />
                  <span>hello@loconomy.com</span>
                </li>
                <li className="flex items-center text-slate-600 dark:text-slate-300">
                  <MapPin className="w-4 h-4 mr-3 text-indigo-600 dark:text-purple-400" />
                  <span>San Francisco, CA</span>
                </li>
                <li className="flex items-center text-slate-600 dark:text-slate-300">
                  <MessageCircle className="w-4 h-4 mr-3 text-indigo-600 dark:text-purple-400" />
                  <span>24/7 Live Chat</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-[var(--mid-gray)] mb-4 md:mb-0">
              © 2025 Loconomy. All rights reserved. Connecting communities through local services.
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="/privacy" className="text-[var(--mid-gray)] hover:text-white transition-colors">Privacy Policy</a>
              <a href="/terms" className="text-[var(--mid-gray)] hover:text-white transition-colors">Terms of Service</a>
              <a href="/cookies" className="text-[var(--mid-gray)] hover:text-white transition-colors">Cookie Policy</a>
              <a href="/accessibility" className="text-[var(--mid-gray)] hover:text-white transition-colors">Accessibility</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
