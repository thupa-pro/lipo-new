"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { ModernFooter } from '@/components/modern-footer';
import { CommandPaletteHint } from '@/components/ui/command-palette-hint';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Grid Background */}
      <div className="absolute inset-0 bg-grid-white/[0.04] [mask-image:radial-gradient(ellipse_at_center,white_20%,transparent_70%)]"></div>
      
      {/* Animated Background Blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-purple-900/30 rounded-full blur-[200px] animate-pulse"></div>
      <div className="absolute bottom-[-30%] right-[-20%] w-[900px] h-[900px] bg-cyan-700/30 rounded-full blur-[200px] animate-pulse animation-delay-4000"></div>
      <div className="absolute top-[30%] right-[10%] w-[500px] h-[500px] bg-fuchsia-700/20 rounded-full blur-[150px] animate-pulse animation-delay-2000"></div>

      {/* Header */}
      <header className="relative z-10 py-6 px-4 sm:px-6 lg:px-8 bg-glass/80 border-b border-white/10 sticky top-0">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <span className="material-icons text-purple-400 text-4xl">hub</span>
            <span className="text-3xl font-bold text-white tracking-wider">Loconomy</span>
          </div>
          
          <nav className="hidden lg:flex items-center space-x-8 text-sm font-medium text-gray-300">
            <a className="hover:text-white transition-colors duration-300" href="#find-service">Find Services</a>
            <a className="hover:text-white transition-colors duration-300" href="#how-it-works">How It Works</a>
            <a className="hover:text-white transition-colors duration-300" href="#become-provider">Become a Provider</a>
            <a className="hover:text-white transition-colors duration-300" href="#blog">Blog</a>
          </nav>
          
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
              <span className="material-icons text-gray-300">notifications_none</span>
            </button>
            <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
              <span className="material-icons text-gray-300">person_outline</span>
            </button>
            <button className="p-2 rounded-full hover:bg-white/10 transition-colors lg:hidden">
              <span className="material-icons text-gray-300">menu</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="text-center py-24 md:py-40">
          <div className="mb-6 flex justify-center items-center gap-2 text-sm font-medium text-purple-300 bg-purple-500/10 border border-purple-400/20 px-4 py-1.5 rounded-full inline-flex">
            <span className="material-icons text-lg animate-pulse">verified</span>
            <span>Trusted by 2.4M+ Users Worldwide</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight">
            <span className="gradient-text">Connect with Local</span>
            <br />
            <span className="text-white">Service Professionals You Trust</span>
          </h1>
          
          <p className="max-w-3xl mx-auto text-lg md:text-xl text-[var(--mid-gray)] mb-12">
            Loconomy is the premium marketplace connecting you with verified local service providers. From home repairs to personal training - find trusted professionals in your area with our AI-powered matching system.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
            <a 
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-5 bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white font-bold rounded-full text-lg btn-glow transition-transform transform hover:scale-105" 
              href="#find-service"
            >
              <span className="material-icons">search</span>
              Find Services Now
            </a>
            <a 
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-5 bg-white/10 text-white font-bold rounded-full text-lg hover:bg-white/20 transition-all duration-300 border border-transparent hover:border-white/30" 
              href="#become-provider"
            >
              <span className="material-icons">group_add</span>
              Become a Provider
            </a>
          </div>
        </section>

        {/* Search Section */}
        <section className="py-20" id="find-service">
          <div className="bg-glass rounded-3xl p-8 md:p-12 card-glow">
            <h2 className="text-4xl font-bold text-center text-white mb-2">Start Your Search</h2>
            <p className="text-center text-[var(--mid-gray)] mb-10">Get matched with the perfect professional in seconds.</p>
            
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row items-center bg-black/20 p-3 rounded-full shadow-inner shadow-black/30 border border-white/10">
                <div className="flex-grow w-full flex items-center pl-4 pr-2">
                  <span className="material-icons text-[var(--mid-gray)] mr-3">work_outline</span>
                  <input
                    className="bg-transparent w-full text-white placeholder-[var(--mid-gray)] focus:outline-none py-3 text-lg"
                    placeholder="What service do you need?"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="w-full md:w-auto flex items-center pl-4 pr-2 border-t md:border-t-0 md:border-l border-white/10 mt-3 md:mt-0 pt-3 md:pt-0">
                  <span className="material-icons text-[var(--mid-gray)] mr-3">location_on</span>
                  <input
                    className="bg-transparent w-full text-white placeholder-[var(--mid-gray)] focus:outline-none py-3 text-lg"
                    placeholder="Your Location"
                    type="text"
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                  />
                </div>
                <button className="w-full mt-4 md:mt-0 md:w-auto px-10 py-4 bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white font-semibold rounded-full btn-glow transition-transform transform hover:scale-105 flex-shrink-0">
                  Search
                </button>
              </div>
              
              <div className="flex flex-wrap justify-center gap-3 mt-8 text-sm">
                {['House Cleaning', 'Plumber', 'Electrician', 'Personal Trainer', 'Math Tutor'].map((tag) => (
                  <button 
                    key={tag}
                    className="bg-white/10 hover:bg-white/20 transition-colors text-gray-300 px-4 py-2 rounded-full border border-transparent hover:border-purple-400/50"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-24" id="how-it-works">
          <h2 className="text-4xl font-bold text-center text-white mb-4">How Loconomy Works</h2>
          <p className="text-lg text-[var(--mid-gray)] text-center mb-16 max-w-2xl mx-auto">Finding your ideal service professional is as easy as 1-2-3.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <div className="absolute top-1/2 left-0 w-full h-px bg-white/10 hidden md:block"></div>
            <div className="absolute top-1/2 left-0 w-full hidden md:flex justify-between">
              <div className="w-1/3 h-px bg-gradient-to-r from-purple-500 to-fuchsia-500"></div>
              <div className="w-1/3 h-px bg-gradient-to-r from-fuchsia-500 to-cyan-500"></div>
            </div>
            
            <div className="relative text-center z-10">
              <div className="w-20 h-20 bg-glass rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-purple-500">
                <span className="text-4xl font-black gradient-text">1</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Post a Job</h3>
              <p className="text-[var(--mid-gray)]">Tell us what you need. Be specific to get the most accurate quotes from our network of professionals.</p>
            </div>
            
            <div className="relative text-center z-10">
              <div className="w-20 h-20 bg-glass rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-fuchsia-500">
                <span className="text-4xl font-black gradient-text">2</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Get Matches</h3>
              <p className="text-[var(--mid-gray)]">Our smart AI algorithm matches you with qualified, vetted pros in your area who are ready to help.</p>
            </div>
            
            <div className="relative text-center z-10">
              <div className="w-20 h-20 bg-glass rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-cyan-500">
                <span className="text-4xl font-black gradient-text">3</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Hire & Relax</h3>
              <p className="text-[var(--mid-gray)]">Compare profiles, quotes, and reviews. Hire the best fit and get the job done right, guaranteed.</p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20">
          <h2 className="text-4xl font-bold text-center text-white mb-12">Trusted Platform Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-glass p-8 rounded-3xl text-center card-glow">
              <div className="flex justify-center items-center mb-4">
                <div className="p-4 bg-purple-500/20 rounded-full">
                  <span className="material-icons text-3xl text-purple-400">group</span>
                </div>
              </div>
              <p className="text-5xl font-bold text-white mb-2">2.4M+</p>
              <p className="text-[var(--mid-gray)] mb-4">Active Users</p>
              <span className="text-green-400 font-semibold text-sm">+23.5% vs last month</span>
            </div>
            
            <div className="bg-glass p-8 rounded-3xl text-center card-glow">
              <div className="flex justify-center items-center mb-4">
                <div className="p-4 bg-cyan-500/20 rounded-full">
                  <span className="material-icons text-3xl text-cyan-400">timer</span>
                </div>
              </div>
              <p className="text-5xl font-bold text-white mb-2">&lt; 2hrs</p>
              <p className="text-[var(--mid-gray)] mb-4">Average Response</p>
              <span className="text-green-400 font-semibold text-sm">+15.2% vs last month</span>
            </div>
            
            <div className="bg-glass p-8 rounded-3xl text-center card-glow">
              <div className="flex justify-center items-center mb-4">
                <div className="p-4 bg-green-500/20 rounded-full">
                  <span className="material-icons text-3xl text-green-400">check_circle</span>
                </div>
              </div>
              <p className="text-5xl font-bold text-white mb-2">98.7%</p>
              <p className="text-[var(--mid-gray)] mb-4">Job Success Rate</p>
              <span className="text-green-400 font-semibold text-sm">+2.1% vs last month</span>
            </div>
            
            <div className="bg-glass p-8 rounded-3xl text-center card-glow">
              <div className="flex justify-center items-center mb-4">
                <div className="p-4 bg-fuchsia-500/20 rounded-full">
                  <span className="material-icons text-3xl text-fuchsia-400">star</span>
                </div>
              </div>
              <p className="text-5xl font-bold text-white mb-2">4.9/5</p>
              <p className="text-[var(--mid-gray)] mb-4">Average Rating</p>
              <span className="text-green-400 font-semibold text-sm">+1.8% vs last month</span>
            </div>
          </div>
        </section>

        {/* Service Categories Section */}
        <section className="py-20">
          <h2 className="text-4xl font-bold text-center text-white mb-4">Popular Service Categories</h2>
          <p className="text-lg text-[var(--mid-gray)] text-center mb-12 max-w-2xl mx-auto">Explore thousands of verified service providers across all major categories.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-glass rounded-3xl p-8 card-glow overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-t from-purple-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10 flex flex-col h-full">
                <span className="material-icons text-5xl text-purple-400 mb-4">home_repair_service</span>
                <h3 className="text-2xl font-bold text-white mb-2">Home Services</h3>
                <p className="text-[var(--mid-gray)] mb-6 flex-grow">Plumbing, electrical, cleaning, and more. All your home needs covered.</p>
                <Link href="/category/home-services" className="font-semibold text-purple-300 flex items-center group-hover:text-white transition-colors">
                  Explore
                  <span className="material-icons text-lg ml-1 group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </Link>
              </div>
            </div>

            <div className="bg-glass rounded-3xl p-8 card-glow overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10 flex flex-col h-full">
                <span className="material-icons text-5xl text-cyan-400 mb-4">fitness_center</span>
                <h3 className="text-2xl font-bold text-white mb-2">Wellness & Fitness</h3>
                <p className="text-[var(--mid-gray)] mb-6 flex-grow">Personal trainers, yoga instructors, and nutritionists to achieve your goals.</p>
                <Link href="/category/wellness-fitness" className="font-semibold text-cyan-300 flex items-center group-hover:text-white transition-colors">
                  Explore
                  <span className="material-icons text-lg ml-1 group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </Link>
              </div>
            </div>

            <div className="bg-glass rounded-3xl p-8 card-glow overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-t from-fuchsia-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10 flex flex-col h-full">
                <span className="material-icons text-5xl text-fuchsia-400 mb-4">school</span>
                <h3 className="text-2xl font-bold text-white mb-2">Education & Tutoring</h3>
                <p className="text-[var(--mid-gray)] mb-6 flex-grow">Find expert tutors for any subject, from math and science to music lessons.</p>
                <Link href="/category/education-tutoring" className="font-semibold text-fuchsia-300 flex items-center group-hover:text-white transition-colors">
                  Explore
                  <span className="material-icons text-lg ml-1 group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </Link>
              </div>
            </div>

            <div className="bg-glass rounded-3xl p-8 card-glow overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-t from-green-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10 flex flex-col h-full">
                <span className="material-icons text-5xl text-green-400 mb-4">build</span>
                <h3 className="text-2xl font-bold text-white mb-2">Tech & Repair</h3>
                <p className="text-[var(--mid-gray)] mb-6 flex-grow">Computer, phone, appliance repair and technical support services.</p>
                <Link href="/category/tech-repair" className="font-semibold text-green-300 flex items-center group-hover:text-white transition-colors">
                  Explore
                  <span className="material-icons text-lg ml-1 group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </Link>
              </div>
            </div>

            <div className="bg-glass rounded-3xl p-8 card-glow overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-t from-orange-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10 flex flex-col h-full">
                <span className="material-icons text-5xl text-orange-400 mb-4">directions_car</span>
                <h3 className="text-2xl font-bold text-white mb-2">Automotive</h3>
                <p className="text-[var(--mid-gray)] mb-6 flex-grow">Car repair, maintenance, detailing and automotive services.</p>
                <Link href="/category/automotive" className="font-semibold text-orange-300 flex items-center group-hover:text-white transition-colors">
                  Explore
                  <span className="material-icons text-lg ml-1 group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </Link>
              </div>
            </div>

            <div className="bg-glass rounded-3xl p-8 card-glow overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-t from-pink-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10 flex flex-col h-full">
                <span className="material-icons text-5xl text-pink-400 mb-4">celebration</span>
                <h3 className="text-2xl font-bold text-white mb-2">Entertainment</h3>
                <p className="text-[var(--mid-gray)] mb-6 flex-grow">Events, photography, music and entertainment services.</p>
                <Link href="/category/entertainment" className="font-semibold text-pink-300 flex items-center group-hover:text-white transition-colors">
                  Explore
                  <span className="material-icons text-lg ml-1 group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-24">
          <h2 className="text-4xl font-bold text-center text-white mb-4">What Our Users Say</h2>
          <p className="text-lg text-[var(--mid-gray)] text-center mb-16 max-w-2xl mx-auto">
            Join millions of satisfied customers who trust Loconomy for their service needs
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-glass rounded-3xl p-8 card-glow">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold">SJ</span>
                </div>
                <div>
                  <h4 className="font-bold text-white">Sarah Johnson</h4>
                  <p className="text-sm text-[var(--mid-gray)]">Homeowner</p>
                </div>
              </div>
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="material-icons text-yellow-400">star</span>
                ))}
              </div>
              <p className="text-[var(--mid-gray)] italic">
                "Found an amazing house cleaner through Loconomy in minutes. The booking process was seamless and the service quality exceeded my expectations!"
              </p>
            </div>

            <div className="bg-glass rounded-3xl p-8 card-glow">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold">MR</span>
                </div>
                <div>
                  <h4 className="font-bold text-white">Mike Rodriguez</h4>
                  <p className="text-sm text-[var(--mid-gray)]">Business Owner</p>
                </div>
              </div>
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="material-icons text-yellow-400">star</span>
                ))}
              </div>
              <p className="text-[var(--mid-gray)] italic">
                "As a provider, Loconomy has transformed my business. The AI matching brings me perfect clients and the platform handles everything seamlessly."
              </p>
            </div>

            <div className="bg-glass rounded-3xl p-8 card-glow">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold">ET</span>
                </div>
                <div>
                  <h4 className="font-bold text-white">Emma Thompson</h4>
                  <p className="text-sm text-[var(--mid-gray)]">Tech Professional</p>
                </div>
              </div>
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="material-icons text-yellow-400">star</span>
                ))}
              </div>
              <p className="text-[var(--mid-gray)] italic">
                "The AI recommendations are spot-on! Got my laptop fixed by a certified technician who arrived within 2 hours. Incredible service!"
              </p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-gradient-to-l from-purple-900/20 to-cyan-900/20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">Why Choose Loconomy</h2>
            <p className="text-lg text-[var(--mid-gray)] max-w-2xl mx-auto">
              Advanced technology meets personalized service for the ultimate experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="material-icons text-3xl text-white">psychology</span>
              </div>
              <h3 className="text-lg font-bold mb-3 text-white">AI-Powered Matching</h3>
              <p className="text-[var(--mid-gray)] text-sm">Our neural network learns your preferences and matches you with the perfect providers every time.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="material-icons text-3xl text-white">verified</span>
              </div>
              <h3 className="text-lg font-bold mb-3 text-white">Verified & Insured</h3>
              <p className="text-[var(--mid-gray)] text-sm">Every provider is background-checked, verified, and fully insured for your peace of mind.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="material-icons text-3xl text-white">flash_on</span>
              </div>
              <h3 className="text-lg font-bold mb-3 text-white">Instant Booking</h3>
              <p className="text-[var(--mid-gray)] text-sm">Book services instantly with real-time availability and immediate confirmation.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="material-icons text-3xl text-white">support_agent</span>
              </div>
              <h3 className="text-lg font-bold mb-3 text-white">24/7 Support</h3>
              <p className="text-[var(--mid-gray)] text-sm">Round-the-clock customer support and live tracking for all your service needs.</p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-24">
          <div className="max-w-4xl mx-auto">
            <div className="bg-glass rounded-3xl p-12 text-center card-glow">
              <h2 className="text-3xl font-bold text-white mb-6">
                Ready to Get Started with Loconomy?
              </h2>
              <p className="text-lg text-[var(--mid-gray)] mb-8 max-w-2xl mx-auto">
                Join millions of satisfied customers who have found their perfect service providers through our platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/browse" className="bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white px-8 py-4 rounded-full font-semibold text-lg btn-glow transition-transform transform hover:scale-105 flex items-center justify-center">
                  Find Services Now
                </Link>
                <Link href="/become-provider" className="bg-white/10 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/20 transition-all duration-300 border border-transparent hover:border-white/30 flex items-center justify-center">
                  Start Earning as Provider
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <ModernFooter />
      <CommandPaletteHint />
    </div>
  );
}
