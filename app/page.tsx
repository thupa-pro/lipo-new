"use client";

import { useState, useEffect } from 'react';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">L</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Loconomy
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-medium transition-colors">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 py-16">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full mb-8">
            <span className="text-sm font-medium text-blue-800">🎉 Welcome to Loconomy</span>
          </div>
          
          <h1 className="text-6xl font-bold mb-8 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Connect with Local
            <br />
            Service Professionals
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
            Loconomy is the premium marketplace connecting you with verified local service providers. 
            From home repairs to personal training - find trusted professionals in your area.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-medium text-lg transition-colors shadow-lg">
              Find Services
            </button>
            <button className="bg-white border-2 border-gray-200 hover:border-blue-300 text-gray-700 px-8 py-4 rounded-xl font-medium text-lg transition-colors">
              Become a Provider
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200">
              <div className="text-3xl font-bold text-blue-600 mb-2">2.4M+</div>
              <div className="text-sm text-gray-600">Active Users</div>
            </div>
            
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200">
              <div className="text-3xl font-bold text-purple-600 mb-2">&lt; 2hrs</div>
              <div className="text-sm text-gray-600">Response Time</div>
            </div>
            
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200">
              <div className="text-3xl font-bold text-green-600 mb-2">98.7%</div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </div>
            
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200">
              <div className="text-3xl font-bold text-pink-600 mb-2">4.9/5</div>
              <div className="text-sm text-gray-600">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Categories */}
      <section className="px-6 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Popular Service Categories</h2>
            <p className="text-lg text-gray-600">Explore thousands of verified service providers</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Home Services", desc: "Cleaning, repairs, maintenance", color: "blue" },
              { title: "Tech & Repair", desc: "Computer, phone, appliance repair", color: "purple" },
              { title: "Automotive", desc: "Car repair, maintenance, detailing", color: "green" },
              { title: "Education", desc: "Tutoring, training, lessons", color: "pink" },
              { title: "Health & Wellness", desc: "Fitness, therapy, wellness", color: "indigo" },
              { title: "Entertainment", desc: "Events, photography, music", color: "red" }
            ].map((category, index) => (
              <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer group">
                <div className={`w-12 h-12 bg-gradient-to-r from-${category.color}-500 to-${category.color}-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <span className="text-white text-xl">🏠</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{category.title}</h3>
                <p className="text-gray-600 mb-4">{category.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">1,200+ providers</span>
                  <span className="text-gray-400">→</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
